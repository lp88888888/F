<template>
	<view class="searchView" :data-theme="pageTheme">
		<view class="container">
			<up-sticky>
				<view >
					<up-navbar title="我的纠错" leftIconColor="#000000" bgColor="transparent" @leftClick="toBack"
						:placeholder="true" :fixed="true"></up-navbar>
				</view>
			</up-sticky>
			<view class="correction-page">
				<!-- 顶部统计卡片 -->
				<view class="stat-card" :style="{ '--head-active-bg': `url(${icoUrl}my-jc.png)` }">
					<view class="stat-header">
						<text class="card-title">纠错数据总览</text>
						<view class="score-tag">
							<image class="card_sm_head_icon" :src="icoUrl + 'jcmoney.png'"> </image>
							<text style="font-size: 24rpx;">{{tollStatiobj.integral}}积分</text>
						</view>
					</view>
					<view class="stat-list">
						<view class="stat-item">
							<text class="stat-num">{{ tollStatiobj.total }}</text>
							<text class="stat-label">总上报</text>
						</view>
						<view class="stat-item">
							<text class="stat-num">{{ tollStatiobj.verified }}</text>
							<text class="stat-label">已核实</text>
						</view>
						<view class="stat-item">
							<text class="stat-num">{{ tollStatiobj.auditing }}</text>
							<text class="stat-label">审核中</text>
						</view>
						<view class="stat-item">
							<text class="stat-num">{{ tollStatiobj.unadopted }}</text>
							<text class="stat-label">未采纳</text>
						</view>
					</view>
					<view class="score-tip">

						<view class="score-left">
							<image :src="imgUrl + 'mylps.png'" mode="aspectFit" class="flower-icon"></image>
							<text class="score-text">已获得积分：{{tollStatiobj.integral}}积分（可兑换加油券、洗车券等）</text>
						</view>
						<view class="exchange-btn"  @click="toNav('/pages/home/home?type='+'points')">
							<text style="font-weight: bold;">去兑换</text>
							<up-icon name="arrow-right" size="14"></up-icon>
						</view>
					</view>
				</view>

				<!-- Tab导航栏 -->
				<view class="tab-bar-bql">
					<view v-for="(item, index) in tabList" :key="index"
						:class="['tab-item', { active: activeisow == index }]"
						:style="{ '--tab-active-bg': `url(${icoUrl}tabimg.png)` }"
						@click="tabChange(index, item.value)">
						{{ item.label }}
					</view>
				</view>

				<!-- 日期筛选器 -->
				<view class="date-filter">
					<picker mode="date" :value="date" @change="onDateChange">
						<view class="date-picker">
							<text>{{ date }}</text>
							<text class="arrow-down">▼</text>
						</view>
					</picker>
				</view>

				<!-- 纠错列表 -->
				<view class="list-wrap">
					<view class="list-item" v-for="item in originList" :key="item.id">
						<!-- 右上角状态角标 -->
						<view class="status-tag auditing" v-if="item.auditStatus=='01'">
							{{formatCardStatusStr(item.auditStatus) }}
						</view>
						<view class="status-tag verified" v-if="item.auditStatus=='02'">
							{{formatCardStatusStr(item.auditStatus) }}
						</view>
						<view class="status-tag refused" v-if="item.auditStatus=='03'">
						     {{formatCardStatusStr(item.auditStatus) }}
						</view>

						<!-- 列表核心内容 -->
						<view class="item-title">{{ item.tollStationName }}</view>
						<view class="item-desc">{{ item.description }}</view>
						

						<!-- 积分/驳回提示 -->
						<view class="item-bottom" v-if="item.auditStatus=='01'">
							<!-- <view  class="score-text">{{ item.score }}</view> -->
							<text class="item-time">{{ item.createTime }}</text>
						</view>
						
						<view class="item-bottom" v-if="item.auditStatus=='02'">
							<view  class="score-text" style="color: #FF8F05;">获得积分 | {{item.integral}}积分</view>
							<text class="item-time">{{ item.createTime }}</text>
						</view>
						
						<view v-if="item.auditStatus=='03'">
							<!-- <view class="score-text">{{ item.score }}</view> -->
							<view>
								<view class="refuse-tip">
									{{ item.auditOpinions }}
								</view>
							</view>
							<view class="item-bottom">
								<view class="score-text">无奖励</view>
								<text class="item-time">{{ item.createTime }}</text>
							</view>
						</view>

					</view>
					
					<!-- 空数据提示 -->
					<view class="empty-data" v-if="(!originList || originList.length === 0)">
						<ser-empty></ser-empty>
					</view>
					<view style="height: 200rpx;"></view>
				</view>
			</view>
			<PageDurationTracker pageName="我的纠错" />
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		ref,
		reactive,
		computed // 【修复1】导入缺失的 computed
	} from 'vue';
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app';
	import {
		imgUrl
	} from '../../config';
	import {
		toNav,
		toBack
	} from '@/utils/route';
	import { getList,getChargeStationErrorPoint } from '@/api/errorcorrection'
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const tollStatiobj = ref({})
    const tollStatiData = ref([])
    const point= ref('')
	// 【修复2】新增：格式化日期为 YYYY-MM-DD 的函数
	const formatDate = (date : Date) => {
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	// 响应式状态定义
	const activeTab = ref('') // 当前选中Tab
	const date = ref(formatDate(new Date())) // 【修复3】修改：默认值设为当天日期
	const activeisow = ref(0);
	const tabindex = ref('');
	// 顶部统计数据
	const statList = ref([
		{ num: 12, label: '总上报' },
		{ num: 8, label: '已核实' },
		{ num: 2, label: '审核中' },
		{ num: 2, label: '未采纳' },
	])

	// Tab配置
	const tabList = ref([
		{ label: '全部', value: '' },
		{ label: '审核中', value: '01' },
		{ label: '已核实', value: '02' },
		{ label: '未采纳', value: '03' },
	])
  const formatCardStatusStr=(num)=> {
   	switch (num) {
   		case '01':
   			return '审核中';
   		case '02':
   			return '已核实';
   		case '03':
   			return '未采纳';
   	}
   }
   const getChargeStationErrorPointFun=async()=>{
   		  const res = await getChargeStationErrorPoint()
   		  if (res.code == 200) {
   		     point.value=res.data.point
   		  }
   }
	// 列表原始数据（可替换为接口返回数据）
	const originList = ref([])
	const getListFun = async () => {
		let params = {
			status: activeTab.value,
			date:date.value
		};
		try {
			const res = await getList(params)
			if (res.code == 200) {
				tollStatiobj.value = res.data
				originList.value=res.data.roadConditionCorrectionVoList
			}
		} catch (error) {
	
		} finally {
	
		}
	}
	const tabChange = (index : number, val : string) => {
		activeisow.value = index;
		activeTab.value = val 
		getListFun()
	}
	// // 筛选后的展示列表
	// const showList = computed(() => {
	// 	if (activeTab.value === '01') return originList.value
	// 	return originList.value.filter(item => item.status === activeTab.value)
	// })

	// Tab切换方法
	const changeTab = (val) => {
		activeTab.value = val
	}

	// 日期选择回调
	const onDateChange = (e) => {
		date.value = e.detail.value
		getListFun()
	}

	onLoad(() => {
		getListFun()
	})
</script>

<style lang="scss" scoped>
	.searchView{
		height: 100vh;
		overflow: hidden;
	}
	.container {
		box-sizing: border-box;
		padding: 120rpx 30rpx 80rpx;
		height: 26vh;
		background: var(--bgqscolor);
		display: flex;
		flex-direction: column;
	}

	.correction-page {
		min-height: 100vh;
		padding: 20rpx 0;
		box-sizing: border-box;
	}

	/* 顶部统计卡片 */
	.stat-card {
		width: 90%;
		height: 276rpx;
		background-image: var(--head-active-bg); // 【修复5】正确使用CSS变量
		background-size: 100% 100%;
		border-radius: 20rpx;
		padding: 30rpx;
		margin: 0 auto 30rpx;
	}

	.stat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.card-title {
		font-size: 28rpx;
		font-weight: 600;
	}

	.score-tag {
		display: flex;
		align-items: center;
		gap: 8rpx;
		background: rgba(255, 255, 255);
		border-radius: 30rpx;
		padding: 8rpx 16rpx;
		font-size: 26rpx;
		margin-right: -20rpx;
		color: var(--primary-color);
	}

	.stat-list {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.stat-num {
		font-size: 40rpx;
		color: #333;
		font-weight: 700;
		line-height: 1;
		margin-bottom: 12rpx;
	}

	.stat-label {
		font-size: 26rpx;
		opacity: 0.9;
	}

	.score-tip {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--label-color);
		border-radius: 16rpx;
		padding: 20rpx;
		opacity: .8;
	}

	.score-left {
		display: flex;
		align-items: center;
		gap: 12rpx;
		flex: 1;
	}

	.flower-icon {
		width: 70rpx;
		height: 70rpx;
	}

	.score-text {
		font-size: 26rpx;
		line-height: 1.4;
		flex: 1;
	}

	.exchange-btn {
		display: flex;
		align-items: center;
		gap: 8rpx;
		font-size: 24rpx;
		white-space: nowrap;

		text {
			color: var(--primary-color);
		}
	}

	/* Tab导航栏 */
	.tab-wrap {
		display: flex;
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 24rpx 0;
		font-size: 30rpx;
		color: #666;
		position: relative;
		transition: all 0.3s;
	}

	.tab-item.active {
		font-weight: 600;
	}

	/* 日期筛选器 */
	.date-filter {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 20rpx;
	}

	.date-picker {
		display: flex;
		align-items: center;
		gap: 8rpx;
		font-size: 28rpx;
		color: #333;
		padding: 8rpx 16rpx;
	}

	.arrow-down {
		font-size: 24rpx;
		color: #666;
	}

	/* 纠错列表 */
	.list-wrap {
		height: 60vh;
		background: #FCFFFC;
		overflow: scroll;
	}

	.list-item {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		position: relative;
		overflow: hidden;
		box-shadow: 0rpx 4rpx 20rpx 0rpx var(--bgqtmd);
		margin-bottom: 12rpx;
	}

	/* 右上角状态角标 */
	.status-tag {
		position: absolute;
		top: 10rpx;
		right: -30rpx;
		width: 120rpx;
		text-align: center;
		padding: 6rpx 0;
		font-size: 22rpx;
		color: #fff;
		transform: rotate(45deg);
		font-weight: 500;
	}

	.status-tag.auditing {
		background: #FF9800;
	}

	.status-tag.verified {
		background: #4CAF50;
	}

	.status-tag.refused {
		background: #9E9E9E;
	}

	/* 列表内容样式 */
	.item-title {
		font-size: 34rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 16rpx;
		padding-right: 80rpx;
	}

	.item-desc {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}

	.item-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.item-time {
		font-size: 24rpx;
		color: #999;
	}

	/* 积分文本 */
	.score-text {
		font-size: 24rpx;
		color: var(--primary-color);
		font-weight: 500;
	}

	/* 未采纳驳回提示 */
	.refuse-tip {
		background: #FDEDED;
		border: 1rpx solid #F5B7B7;
		border-radius: 8rpx;
		padding: 20rpx;
		font-size: 24rpx;
		color: #D32F2F;
		line-height: 1.5;
		margin-bottom: 20rpx;
	}

	.tab-bar-bql {
		display: flex;
		margin-bottom: 20rpx;
	}

	.tab-item {
		padding: 8rpx 0;
		text-align: center;
		font-size: 28rpx;
		line-height: 1.4;
		transition: all 0.3s ease;
		white-space: nowrap;
		position: relative;
	}

	.tab-item.active {
		color: #333333;
		font-weight: bold;
		transform: scale(1.05);
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 12rpx;
		background-image: var(--tab-active-bg);
		background-size: 100% 100%;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.card_sm_head_icon {
		width: 32rpx;
		height: 32rpx;
	}

	::v-deep .u-navbar__placeholder {
		height: 50rpx !important;
	}
</style>