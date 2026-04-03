<template>
  <view class="recruit-page">
    <up-navbar
      title=" "
      bgColor="transparent"
      @leftClick="toBack"
      :placeholder="false"
    ></up-navbar>

    <!-- 顶部背景 -->
    <view class="top-bg">
      <view class="title-box">
        <image :src="imgUrl + 'experience/ex_bg.jpg'" class="img"></image>
      </view>
    </view>

    <view class="box">
      <!-- 表单卡片 -->
      <view class="form-card">
        <view class="form-title">报名信息填写</view>

        <!-- 联系方式 -->
        <view class="form-item-phone">
          <view class="item-label">
            <text class="num">*</text>
            <text class="label-text">01 联系方式</text>
          </view>
          <text class="phone">{{ phone }}</text>
        </view>

        <!-- 职业 -->
        <view class="form-item-phone">
          <view class="item-label">
            <text class="num">*</text>
            <text class="label-text">02 您的职业</text>
          </view>
          <view>
            <up-input
              placeholder="请输入您的职业"
              v-model="occupation"
              border="none"
              input-align="right"
              maxlength="10"
            />
          </view>
        </view>

        <!-- 常用功能 -->
        <view class="form-item">
          <view class="item-label">
            <text class="num">*</text>
            <text class="label-text">
              03 <text class="dx">[多选]</text>常用功能
            </text>
          </view>
          <view class="checkbox-group">
            <up-checkbox-group v-model="checkedFunctions">
              <up-checkbox
                v-for="(item, index) in functionList"
                :key="item.dictValue || index"
                :label="item.dictLabel"
                :name="item.dictValue"
                shape="square"
                class="checkbox-item"
              />
            </up-checkbox-group>
          </view>
        </view>

        <!-- 为什么想成为体验官 -->
        <view class="form-tyg">
          <view class="item-label" style="margin-bottom: 10rpx;">
            <text class="num">*</text>
            <text class="label-text">04 为什么想成为体验官？</text>
          </view>
          <view class="wenzi">
            请详细描述你的动机，便于我们更好地选择合适的体验官！
          </view>
          <up-textarea
            v-model="reason"
            placeholder="举例：我是高频高速出行用户，能提出切实有用的建议；我是产品设计师，擅长体验优化；"
			placeholder-class="placeholder"
            :maxlength="200"
            class="textarea-field"
            count
          />
        </view>
      </view>

      <!-- 活动说明 -->
      <view class="activity-info">
        <view class="info-title">活动说明</view>
        <view class="info-content">
          <view class="info-section">
            <text class="section-title">一、报名规则</text>
            	<text class="section-content">用户在活动期间提交真实信息，经平台审核通过后，正式成为活动体验官。</text>
            </view>
            
            <view class="info-section">
            	<text class="section-title">二、奖励机制</text>
            	<!-- <text class="section-content">1. 报名奖励：成为活动体验官，即时发放 88 积分。</text> -->
            	<text class="section-content">1. 基础奖励：提交每条合格建议经平台审核通过奖励 50 积分。</text>
            	<text class="section-content">2. 活跃奖励：自然月内累计提交 5 条及以上合格建议，额外奖励 200 积分。</text>
            </view>
            
            <view class="info-section">
            	<text class="section-title">三、建议规范及审核机制</text>
            	<text class="section-content">1. 合格建议判定条件：</text>
            	<text class="section-content">（1）内容规范：无广告推广、辱骂、闲聊等违规内容；</text>
            	<text class="section-content">（2）明确建议场景、使用痛点或优化方向，可落地性强议；</text>
            	<text class="section-content">（3）与历史提交的建议无高度相似（核心观点重合度＜80%）。</text>
            	<text class="section-content">2. 审核与积分发放机制：</text>
            	<text class="section-content">（1）用户提交建议后，平台将在 3-5 个工作日内完成审核；</text>
            	<text class="section-content">（2）积分可用于后续平台积分商城商品兑换；</text>
            	<text class="section-content">（3）积分自发放之日起 12 个月内有效，逾期未使用自动失效；</text>
            	<text class="section-content">（4）参与本次活动即视为同意本规则全部内容，平台拥有活动最终解释权。</text>
            </view>
        </view>
      </view>

      <!-- 报名按钮 -->
      <view class="foot">
		  <view class="submit-btn">
		    <view @click="submitForm" class="btn">立即报名</view>
		  </view>
	  </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { imgUrl } from '@/config'
import { toBack } from '@/utils/route'
import { getDict } from '@/api/config'
import { addExperience, editExperience, experienceInfo } from '@/api/home'
import { onLoad } from '@dcloudio/uni-app'

// 字典项类型
interface DictItem {
  dictLabel: string
  dictValue: string
  [key: string]: any
}

// 表单字段
const occupation = ref<string>('') // 职业
const phone = ref<string>(uni.getStorageSync('userInfo').mobile || '')
const checkedFunctions = ref<string[]>([]) // 多选结果：dictValue 数组
const reason = ref<string>('')

// 字典功能列表
const functionList = ref<DictItem[]>([])

// 是否编辑态
const fromEdit = ref(false)
// 记录报名信息 id，供编辑时使用
const experienceId = ref<string | null>(null)

// 获取报名详情（编辑态用）
const getExperienceInfo = async () => {
  const res: any = await experienceInfo()
  if (res.code === 200 && res.data) {
    const info = res.data
    // id
    experienceId.value = info.id
    // 手机号用接口返回的，带掩码显示也可以
    if (info.mobile) {
      phone.value = info.mobile
    }
    // 职业
    occupation.value = info.occupation || ''
    // 多选：'0,3' -> ['0', '3']
    if (info.applySource) {
      checkedFunctions.value = String(info.applySource).split(',')
    } else {
      checkedFunctions.value = []
    }
    // 理由
    reason.value = info.experienceDesc || ''
  }
}

// 获取“常用功能”字典
const getDictData = async () => {
  try {
    const res: any = await getDict('sys_experience_apply')
    if (res.code === 200 && Array.isArray(res.data)) {
      functionList.value = res.data
    }
  } catch (e) {
    console.error('获取常用功能字典失败：', e)
  }
}

onLoad((options: any) => {
  // 是否再次提交（编辑）
  if (options && options.from === 'edit') {
    fromEdit.value = true
    getExperienceInfo()
  }
})

// 统一 toast
const showToast = (title: string) => {
  uni.showToast({
    title,
    icon: 'none'
  })
}

// 表单提交
const submitForm = async () => {
  // 手机号验证
  if (!phone.value) {
    showToast('请输入联系方式')
    return
  }

  // 职业必填
  if (!occupation.value.trim()) {
    showToast('请输入您的职业')
    return
  }

  // 常用功能选择验证
  if (checkedFunctions.value.length === 0) {
    showToast('请至少选择一项常用功能')
    return
  }

  // 理由输入验证
  if (!reason.value.trim()) {
    showToast('请输入成为体验官的理由')
    return
  }

  // 组装参数
  const params: any = {
    mobile: phone.value,
    occupation: occupation.value,
    applySource: checkedFunctions.value.join(','), // "0,3" 这种格式
    experienceDesc: reason.value
  }

  // 编辑时带上 id
  if (fromEdit.value && experienceId.value) {
    params.id = experienceId.value
  }

  console.log('提交参数: ', params)

  // const apiFun = fromEdit.value ? editExperience : 
  const res: any = await addExperience(params)

  if (res?.code === '200' || res?.code === 200) {
    showToast('提交成功')
    setTimeout(() => {
		uni.redirectTo({
			url: '/pages_E/experience/registration'
		})
    }, 1000)
  } else {
    uni.showToast({ title: res?.msg || '提交失败', icon: 'none' })
  }
}

onMounted(() => {
  getDictData()
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  border-radius: 36rpx 36rpx 0 0;
  margin-top: -50px;
  z-index: 99;
  overflow: hidden;
  position: relative;
  background: linear-gradient(180deg, #e7ecf6 0%, #ffffff 100%);
  box-sizing: border-box;
  box-shadow: 0px -5px 13px 0px rgba(0, 0, 0, 0.1);
}
.recruit-page {
  min-height: 100vh;
  padding-bottom: 60rpx;
}

.top-bg {
  width: 100%;
  .title-box {
    width: 100%;
    .main-title {
      font-size: 48rpx;
      font-weight: bold;
      color: #fff;
      display: block;
      margin-bottom: 16rpx;
    }

    .sub-title {
      font-size: 28rpx;
      color: #fff;
      display: block;
      margin-bottom: 12rpx;
    }

    .desc {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
      display: block;
      width: 80%;
      margin: 0 auto;
    }
  }

  .floating-icon {
    position: absolute;
    right: 60rpx;
    top: 40rpx;
    z-index: 2;

    .badge-img {
      width: 140rpx;
      height: 140rpx;
      animation: float 3s ease-in-out infinite;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10rpx);
  }
}

.form-card {
  width: 85%;
  margin: 40rpx auto 40rpx;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 40rpx 30rpx 20rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);
  position: relative;
  .form-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 40rpx;
    padding-left: 10rpx;
  }

  .form-tyg {
    margin-bottom: 40rpx;
  }

  .form-item {
    margin-bottom: 40rpx;

    .input-field {
      width: 100%;
      height: 80rpx;
      border: 1px solid #e5e6eb;
      border-radius: 12rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
    }

    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 30rpx;

      .checkbox-item {
        margin-bottom: 20rpx;
        width: 28%;
      }
    }

    .textarea-field {
      width: 100%;
      border: 1px solid #e5e6eb;
      border-radius: 12rpx;
      padding: 20rpx;
      font-size: 28rpx;
      min-height: 200rpx;
    }

    .word-count {
      font-size: 24rpx;
      color: #999;
      float: right;
      margin-top: 10rpx;
    }
  }
}

.activity-info {
  width: 85%;
  margin: 0 auto 110rpx;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);

  .info-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
    padding-left: 10rpx;
  }

  .info-content {
    font-size: 26rpx;
    color: #666;
    line-height: 1.8;

    .info-section {
      margin-bottom: 30rpx;

      .section-title {
        font-weight: bold;
        color: #333;
        display: block;
        margin-bottom: 15rpx;
      }

      .section-content {
        display: block;
        margin-bottom: 10rpx;
        text-indent: 52rpx;
      }

      .section-content:first-of-type {
        text-indent: 0;
      }
    }
  }
}
.foot{
	width: 100%;
	height: 120rpx;
	background: #fff;
	position: fixed;
	bottom: 0;
	padding-top: 30rpx;
}
.submit-btn {
  width: 90%;
  margin: 0 auto;
}
.btn {
  height: 90rpx;
  line-height: 90rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  color: #fff;
  background: #171715;
  text-align: center;
}

.form-item-phone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60rpx;
  padding-bottom: 15rpx;
  border-bottom: 1px solid #f5f5f5;
}

.label-text {
  font-weight: 500;
  font-size: 32rpx;
  color: #000000;
}
.num {
  color: #e53d3d;
  font-size: 32rpx;
  margin-right: 15rpx;
}
.phone {
  color: #000000;
}
.dx {
  font-size: 26rpx;
  color: #2c69c3;
}
.item-label {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}
.wenzi {
  font-size: 22rpx;
  color: #b7b9c3;
  margin-bottom: 20rpx;
}
::v-deep .u-textarea {
  height: 250rpx;
}
.img {
  width: 100%;
  height: 540rpx;
}
::v-deep .u-checkbox-group {
  gap: 30rpx;
  justify-content: space-between;
  padding: 10rpx;
}
::v-deep .placeholder {
	font-size: 26rpx !important;
}
</style>
