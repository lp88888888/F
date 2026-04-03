<template>
  <view class="page">
    <!-- 头部 -->
    <view class="header">
      <text class="title">我的企业（{{ enterpriseCount }}个）</text>
      <view class="add-btn" @tap="handleAddEnterprise">
        <image :src="imgUrl + 'volumePricing/vp_add.png'" class="add-icon" />
        添加企业
      </view>
    </view>

    <!-- 搜索框（有数据 或 已经搜索过时显示） -->
    <view
      class="search-container"
      v-if="items.length || (!items.length && isSearch)"
    >
      <view class="input-box">
        <image
          class="icSearch-s"
          :src="imgUrl + '/wximage/other-icon/ic_search.png'"
        />
        <input
          class="search-input"
          placeholder="输入关键词"
          placeholder-class="input-placeholder"
          :value="keyword"
          @input="onInput"
        />
      </view>
    </view>

    <!-- 审核状态筛选 -->
    <picker
      v-if="items.length || (!items.length && isSearch)"
      mode="selector"
      :range="statusOptions"
      range-key="name"
      :value="selectedIndex"
      @change="handleStatusChange"
    >
      <view class="filter-item">
        {{ statusError || '审核状态' }}
        <image
          class="arrow-icon"
          :src="imgUrl + '/wximage/trip-pro/arrBottom.png'"
        />
      </view>
    </picker>

    <!-- 列表 -->
    <view class="list-container">
      <view
        class="item"
        v-for="(item, index) in items"
        :key="item.id || index"
      >
        <view class="header">
          <text class="time">提交时间：{{ item.createTime }}</text>
          <view
            class="status"
            :class="
              item.auditStatus === '01'
                ? 'd'
                : item.auditStatus === '02'
                ? 'g'
                : item.auditStatus === '03'
                ? 'r'
                : 'r'
            "
          >
            {{
              item.auditStatus === '01'
                ? '待审核'
                : item.auditStatus === '02'
                ? '审核通过'
                : item.auditStatus === '03'
                ? '审核不通过'
                : '作废'
            }}
          </view>
        </view>

        <view class="content">
          <image
            class="logo"
            :src="item.businessLicenseImage"
            mode="aspectFit"
          />
          <text class="company-name">{{ item.enterpriseName }}</text>
        </view>

        <view class="buttons">
          <view class="detail-btn" @tap="handleViewDetail(item.creditCode)">
            查看详情
          </view>
          <view class="my-vehicles-btn" @tap="handleMyVehicles(item)">
            我的车辆
          </view>
        </view>
      </view>

      <view v-if="loading && items.length" class="load-more">加载中...</view>
      <view v-if="!hasMore && items.length" class="load-more no-more">
        没有更多了
      </view>
    </view>

    <!-- 非搜索空状态：展示添加按钮 -->
    <view v-if="!items.length && !isSearch" class="no-car">
      <image
        :src="imgUrl + 'volumePricing/vp_nocar.png'"
        class="no-icon"
      />
      <view class="no-btn" @tap="handleAddEnterprise">
        <image
          :src="imgUrl + 'volumePricing/vp_add.png'"
          class="add-icon"
        />
        <text class="no-add">添加企业</text>
      </view>
    </view>

    <!-- 搜索后空状态 -->
    <view v-if="!items.length && isSearch" class="no-car">
      <image
        :src="imgUrl + 'volumePricing/vp_nocar.png'"
        class="no-icon"
      />
      <view class="no-result">未找到相关企业</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onShow, onReachBottom, onUnload } from '@dcloudio/uni-app'
import { imgUrl } from '@/config'
import { yldjCarEnterprise } from '@/api/volumePricing'

interface StatusOption {
  id: string
  name: string
}

interface EnterpriseItem {
  id: number | string
  createTime: string
  auditStatus: string
  businessLicenseImage: string
  enterpriseName: string
  creditCode: string
  [key: string]: any
}

// 企业数量
const enterpriseCount = ref(0)

// 审核状态选项
const statusOptions = ref<StatusOption[]>([
  { id: '', name: '全部' },
  { id: '01', name: '待审核' },
  { id: '02', name: '审核通过' },
  { id: '03', name: '审核拒绝' },
  { id: '99', name: '审核作废' }
])

// 分页相关
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const hasMore = ref(true)
const loading = ref(false)

// 过滤 & 列表
const statusError = ref('')
const auditStatus = ref('') // 选中的审核状态 id
const selectedIndex = ref(0) // picker 当前索引
const items = ref<EnterpriseItem[]>([])
const keyword = ref('')
const isUser = ref(2) // 原代码中用于跳转“我的车辆”参数
const isSearch = ref(false)

// 搜索防抖定时器
let searchTimer: ReturnType<typeof setTimeout> | null = null

// 页面显示时加载数据
onShow(() => {
  // 每次进入页面重新拉一次列表（也可以按需保留分页状态）
  pageNum.value = 1
  hasMore.value = true
  getCarEnterprise(false)
})

// 页面卸载时清理定时器
onUnload(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }
})

/**
 * 搜索输入
 */
const onInput = (e: any) => {
  const searchKey = (e.detail?.value || '').trim()
  keyword.value = searchKey
  isSearch.value = true

  // 防抖：先清除之前定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  searchTimer = setTimeout(() => {
    pageNum.value = 1
    hasMore.value = true
    isSearch.value = true
    getCarEnterprise(false)
  }, 500)
}

/**
 * 拉取企业列表
 * @param isLoadMore 是否为加载更多（分页）
 */
const getCarEnterprise = async (isLoadMore = false) => {
  if (loading.value) return

  loading.value = true

  const params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    auditStatus: auditStatus.value,
    keyword: keyword.value
  }

  try {
    // ✅ 使用 await 替代回调
    const res = await yldjCarEnterprise(params)

    const pageData = res?.page || {}
    const newItems: EnterpriseItem[] = Array.isArray(pageData.records)
      ? pageData.records
      : []
    const totalCount: number = pageData.total || 0

    let merged: EnterpriseItem[] = []
    if (isLoadMore) {
      merged = [...items.value, ...newItems]
    } else {
      merged = newItems
    }

    items.value = merged
    enterpriseCount.value = totalCount
    total.value = totalCount
    hasMore.value = merged.length < totalCount
  } catch (error) {
    // ✅ 捕获异常并统一提示
    const msg =
      error instanceof Error ? error.message : (error as any)?.msg || '加载失败'
    hasMore.value = false
    uni.showToast({ title: msg, icon: 'none' })
  } finally {
    // ✅ 确保加载状态恢复
    loading.value = false
  }
}


/**
 * 滚动到底部：加载更多
 */
onReachBottom(() => {
  if (loading.value || !hasMore.value) return

  pageNum.value += 1
  getCarEnterprise(true)
})

/**
 * 查看详情
 */
const handleViewDetail = (creditCode: string) => {
  uni.navigateTo({
    url:
      '/pages_D/volumePricing/improve/index?creditCode=' +
      creditCode +
      '&bindType=2'
  })
}

/**
 * 我的车辆
 */
const handleMyVehicles = (item: EnterpriseItem) => {
  const enterpriseId = item.id
  const enterpriseError = item.enterpriseName
  uni.navigateTo({
    url:
      '/pages_D/volumePricing/carlist/index?enterpriseId=' +
      enterpriseId +
      '&type=1' +
      '&isUser=' +
      isUser.value +
      '&enterpriseError=' +
      enterpriseError
  })
}

/**
 * 添加企业
 */
const handleAddEnterprise = () => {
  uni.navigateTo({
    url: '/pages_D/volumePricing/improve/index?bindType=2&type=1'
  })
}

/**
 * 审核状态筛选
 */
const handleStatusChange = (e: any) => {
  const index = Number(e.detail?.value || 0)
  selectedIndex.value = index
  const selected = statusOptions.value[index]

  statusError.value = selected.name
  auditStatus.value = selected.id
  isSearch.value = true
  pageNum.value = 1
  hasMore.value = true

  getCarEnterprise(false)
}
</script>

<style scoped>
.page {
	background-color: #fff;
	height: 100%;
	padding: 28rpx;
	box-sizing: border-box;
}

/* index.wxss */

.icSearch-s {
	width: 28rpx;
	height: 28rpx;
	position: absolute;
	left: 30rpx;
	top: 20rpx;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.title {
	font-size: 28rpx;
	color: #73747A;
	font-weight: 700;
}

.add-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
}

.add-btn {
	color: #FF6503;
	border-radius: 10rpx;
	padding: 10rpx 20rpx;
	font-size: 28rpx;
  display: flex;
  align-items: center;
}

.search-container {
	position: relative;
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.input-box {
  display: flex;
  align-items: center;
}

.search-input {
  width: 686rpx;
	box-sizing: border-box;
	height: 72rpx;
	padding-left: 80rpx;
	border-radius: 40rpx;
	font-size: 26rpx;
	border-radius: 24px;
	opacity: 1;
	background: #FBFBFB;
}

.input-placeholder {
  font-size: 30rpx;
  color: #CCCCCC;
}

.filter-item {
  width: 180rpx;
	height: 64rpx;
	line-height: 64rpx;
	background: #F7F7F7;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #080912;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
  margin-right: 36rpx;
}

.arrow-icon {
  width: 24rpx;
	height: 20rpx;
	margin-left: 10rpx;
}

.status-text {
	font-size: 28rpx;
  color: #080912;
  margin-right: 10rpx;
}

.picker-view {
	display: flex;
	align-items: center;
}
.status{
	font-size: 24rpx;
}
.arrow-icon {
  width: 24rpx;
	height: 20rpx;
	margin-left: 10rpx;
}

/* index.wxss */
.list-container {
	box-sizing: border-box;
	padding: 12rpx 30rpx;
}

.item {
	margin-bottom: 30rpx;
	background-color: #fff;
	border-radius: 10rpx;
	overflow: hidden;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	font-size: 28rpx;
	color: #666;
}

.content {
	display: flex;
	align-items: center;
	padding: 20rpx;
	height: 104rpx;
	box-sizing: border-box;
	background: #F8F8F8;
}

.logo {
	width: 80rpx;
	height: 80rpx;
	margin-right: 20rpx;
}

.company-name {
	font-size: 28rpx;
	color: #000;
	font-weight: 700;
}

.buttons {
	display: flex;
	justify-content: flex-end;
	padding: 20rpx 0;
}
.time{
	font-size: 24rpx;
	color: #9D9D9D;
}
.detail-btn,
.my-vehicles-btn {
	width: 164rpx;
	text-align: center;
	line-height: 58rpx;
	height: 58rpx;
	border-radius: 64rpx;
	margin-left: 20rpx;
	font-size: 24rpx;
	border-radius: 40rpx;
	color: #333;
	border: 2rpx solid #ccc;
}

.my-vehicles-btn {
	color: #FF6503;
}

.g {
  color: #3EC98F;
}

.r {
  color: #FF0000;
}

.d {
  color: #979797;
}


.no-car {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-icon {
  width: 533rpx;
  height: 427rpx;
  margin-bottom: 36rpx;
}

.no-btn {
  width: 417rpx;
  height: 100rpx;
  border-radius: 46rpx;
  background: #FDEEE4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-add {
  margin-left: 12rpx;
  color: #FF6503;
  font-size: 32rpx;
  font-weight: bold;
}

.no-result {
	font-size: 28rpx;
	color: #98a2b3;
}

.load-more {
  padding: 24rpx 0;
  text-align: center;
  color: #999;
  font-size: 26rpx;
}
.load-more.no-more {
  color: #bbb;
}
</style>
