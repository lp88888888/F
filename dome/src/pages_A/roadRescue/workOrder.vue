<template>
	<view class="app-container">
		<view class="header">	
			<view class="tab-con1">					
					<view class="tab-bar-bql">
						<view v-for="(item,index) in tabs" :key="index"
							:class="['tab-item', { active: activeisow== index }]" @click="tabChange(index,item.value)">
							{{item.label}}</view>
					</view>
			</view>
			
		</view>
		<view class="pageView">
			<view v-for="(item,index) in dataList" :key="index">
				<view class="vehicle-info" @click="orderdel(item)" >
					<view class="info-row1">
						<view class="">
							<text class="key">车辆类型：</text>
							<text class="value">{{item.vehicleType}}</text>
						</view>
						<view class="info-row-key">
							{{getStatusText(item.status)}}
						</view>
					</view>
					<view class="info-row">
						<text class="key">路段名称：</text>
						<text class="value">{{item.highWayName}}</text>
					</view>
					<view class="info-row">
						<text class="key">行驶方向：</text>
						<text class="value">{{item.vehicleDirection}}</text>
					</view>
					<view class="license-time">
						<text class="license">{{item.vehicleNumber}}</text>
						<text class="time">{{item.createTime}}</text>
					</view>
				</view>
			</view>
			<view class="zwsj" v-if="!dataList || dataList.length === 0">
				<image :src="imgUrl + 'static/list-empty.png'" />
				<view>暂无数据</view>
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '../../config';
	import { onLoad,onShow } from '@dcloudio/uni-app'
	import { orderList } from '@/api/rescue';
	import { toNav, toBack } from '@/utils/route';
	const dataList = ref<any>([])
	const tabIndex = ref('')
	const searchTex = ref('')
	const worklist = ref([
		'进行中',
		'已完成'
	]);
	const tabs = [
		{ label: '全部', value: '' },
		{ label: '已受理', value: '0' },
		{ label: '进行中', value: '1' },
		{ label: '已结束', value: '2' },
		{ label: '已取消', value: '3' },
	];
	const activeisow = ref<any>('')
	const current = ref<any>(0)
	const orderListFun = async () => {
		const res = await orderList(tabIndex.value);
		dataList.value = res.data

	}
	const orderdel = (item : any) => {
		uni.navigateTo({
			url: '/pages_A/roadRescue/oderList?id=' + item.id
		})
	}
	// Tab 切换
	const tabChange = (index : number,val:string) => {
		tabIndex.value = val;
		activeisow.value = index;
		orderListFun()
	};
	const getStatusText = (status : string) => {
		switch (status) {
			case 5:
				return "待派单";
			case 10:
				return "已确认";
			case 15:
				return "已派单";
			case 20:
				return "处理中";
			case 23:
				return "已接单";
			case 24:
				return "待付款";
			case 25:
				return "已结束";
			case 30:
				return "已完成";
			case 35:
				return "已取消";
			default:
				return "未知状态"; // 处理未匹配的状态
		}
	}
	const getVehicleTypeText = (typeCode : string) => {
		switch (typeCode) {
			case "01":
				return "≤9座客车";
			case "02":
				return ">9座客车";
			case "03":
				return "危化品运输车";
			case "04":
				return "特种车";
			case "05":
				return "货车";
			case "06":
				return "其他";
			default:
				return "未知车辆类型";
		}
	}

	onShow(()=>{
		orderListFun()
	})
</script>

<style scoped lang="scss">
	/* 车辆信息 */
	.vehicle-info {
		background-color: #fff;
		padding: 30rpx;
		margin-top: 20rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.info-row {
		display: flex;
		align-items: center;
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
		margin-top: 20rpx;
	}

	.info-row1 {
		display: flex;
		justify-content: space-between;
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
	}

	.info-row-key {
		font-weight: 400;
		font-size: 24rpx;
		color: #999999;
	}

	/* 车牌和时间 */
	.license-time {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0;
	}

	.license {
		font-weight: 600;
		font-size: 28rpx;
		color: #333333;
	}

	.time {
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
	}

	

	.tab-text {
		font-size: 32rpx;
		margin-bottom: 12rpx;
	}

	.tab-select {
		font-weight: bold;
		color: #333;
		font-size: 32rpx;
		position: relative;
	}

	.tab-normal {
		font-weight: 500;
		color: #666;
	}

	.app-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
		background: #F8F9FB
	}

	.header {
		position: sticky;
		top: 20rpx;
		z-index: 10;
		background-color: #F8F9FB;
		/* 确保在内容上方 */
	}

	.pageView {
		box-sizing: border-box;
		flex: 1;
		/* 占据剩余全部空间 */
		overflow-y: auto;
		/* 内容超出时显示垂直滚动条 */
	}

	.zwsj {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 200rpx;
	}

	.pageView-box {
		padding: 0 20rpx 10rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 20rpx;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);
		margin-bottom: 20rpx;
	}

	.jy {
		padding: 10rpx 0;
		font-size: 28rpx;
	}

	.pageView-head {
		display: flex;
		font-weight: bold;
		justify-content: space-between;
		border-bottom: 1px solid #eee;
		padding: 20rpx 0;
	}

	.pageView-text {
		display: flex;
		margin: 30rpx 0;
		gap: 20rpx;
	}

	.wenzi {
		width: 430rpx;
		color: #333333 !important;
		margin-left: 20rpx;
	}

	.pageView-opk {
		text-align: right;
		color: #666;
	}
	.tab-con1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 15rpx 0;
	}
	.tab-bar-bql {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10;
		color: #666;
		/* 给下划线留空间 */
		position: relative;
		/* 伪元素定位基准 */
	}
	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5px 25rpx;
		border-radius: 4px;
		position: relative;
		font-size: 30rpx;
	}
	.active {
		color: #333333;
		font-weight: bold;
	}
	/* 激活态底部下划线（伪元素实现） */
	.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 12rpx;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/zcby.png');
		background-size: 100% 100%;
	}
</style>