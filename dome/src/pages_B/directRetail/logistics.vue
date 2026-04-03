<template>
	<view class="" :data-theme="pageTheme">
		<up-sticky>
			<view class="topNavBack">
				<up-navbar title="查看物流" bgColor="none" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
			</view>
		</up-sticky>

		<view class="pageView" style="padding: 32rpx;">
			<view class="carPad cards">
				<view class="kdView">
					<view class="kdView-text">
						<view class="kdView-text-left">
							<up-icon :name="imgUrl+'static/B-direct-log-icon.png'" size="19"></up-icon>
							<!-- 	<text
								style="margin-right: 10rpx;">{{derinfo?.baseOrderInfoResponse?.logisticsTracking?.carrier}}</text>
							<text>{{derinfo?.baseOrderInfoResponse?.logisticsTracking?.trackingNumber}}</text> -->
							<text style="margin-right: 10rpx;margin-left: 20rpx;">{{derinfo?.baseOrderInfoResponse?.logisticsTracking?.carrier}}</text>
							<text>{{derinfo?.baseOrderInfoResponse?.logisticsTracking?.trackingNumber}}</text>
						</view>
						<view class="kdView-text-cop" @click="copyText(derinfo.id)">复制</view>
					</view>
				</view>
				<up-gap height="18"></up-gap>

				<view class="kdView-text-address">
					<up-icon name="map" size="20"></up-icon> <text>送至:{{derinfo?.baseOrderInfoResponse?.city}}{{derinfo?.baseOrderInfoResponse?.area}}{{derinfo?.baseOrderInfoResponse?.addr}}</text>
				</view>
				<view class="kdView-text-name">
					<text>{{derinfo?.baseOrderInfoResponse?.consignee}}:</text><text>{{derinfo?.baseOrderInfoResponse?.mobile}}</text>
				</view>
			</view>

			<up-gap height="10"></up-gap>
			<view class="map-container">
				<map id="logistics-map" :latitude="center.latitude" :longitude="center.longitude" :scale="12"
					:polyline="polylines" :markers="markers"
					style="width: 100%; height: 400rpx; border-radius: 20rpx;margin:32rpx  0;" show-location />
			</view>
			<view class="cards" style="padding:40rpx 32rpx;">

				<view v-if="formattedList.length > 0" class="steps-container">
					<up-steps :current="0" :dot="true" direction="column" activeColor="#FF9600" inactiveColor="#CCCCCC">
						<up-steps-item v-for="(item, index) in formattedList" :key="index">
							<template #icon>
								<up-icon :name="imgUrl+getIconPath(item)" size="16" />
							</template>
							<template #desc>
								<view class="desc-view" :style="{ opacity: index === 0 ? 1 : 0.6 }">
									<view class="desc-title">{{ item.statusText }}</view>
									<view class="desc-text">{{ item.context }}</view>
									<view class="desc-time">{{ formatDate(item.time) }}</view>
								</view>
							</template>
						</up-steps-item>
					</up-steps>
				</view>

				<!-- 空状态 -->
				<view v-else class="empty">
					<text>暂无物流信息</text>
				</view>
			</view>
			<up-gap height="20"></up-gap>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { decimalPointDivision, copyText } from "@/utils/util";
	import { onLoad } from '@dcloudio/uni-app';
	import { getpayOrderInfo, getmapTrack } from '@/api/points';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const statusTetx = ref({
		0: '等待揽收', 1: '已揽收', 2: '已发货', 3: '运输中', 4: '派送中', 5: '已签收'
	})
	const locList = ref<any>([]);
	const derinfo = ref({})
	const getdel = async () => {
		const res = await getpayOrderInfo(oderid.value);
		derinfo.value = res.data
		if (res.data.baseOrderInfoResponse.logisticsTracking) {
			let arr = JSON.parse(res.data.baseOrderInfoResponse.logisticsTracking.status).reverse()
			for (let i in arr) {
				locList.value.push({ ...res.data.baseOrderInfoResponse.logisticsTracking, statusCeshi: arr[i] })
			}
			console.log('------', locList.value);
			// locList.value
		}
	}
	const oderid = ref('')
	const logisticsData = ref([])
	const formattedList = computed(() => {
		if (!logisticsData.value || logisticsData.value.length === 0) return []
		console.log('logisticsData.value', logisticsData.value);
		// 格式化物流信息
		return logisticsData.value.map((item, index) => {
			const statusText = getStatusText(item.context)
			return {
				...item,
				statusText,
				isLatest: index === 0 // 最新一条
			}
		})
	})
	// 获取图标路径
	const getIconPath = (item) => {
		if (item.isLatest && item.statusText === '已签收') {
			return 'static/B-direct-log-icon1-true.png' // 签收成功图标
		}

		const iconMap = {
			'已签收': 'static/B-direct-log-icon1-true.png',
			'派送中': 'static/B-direct-log-icon1-false.png',
			'运输中': 'static/B-direct-log-icon2-false.png',
			'已发货': 'static/B-direct-log-icon3-false.png',
			'已下单': 'static/B-direct-log-icon4-false.png'
		}

		return iconMap[item.statusText] || 'static/B-direct-log-icon4-false.png'
	}
	const getStatusText = (context) => {
		if (!context) return '已下单'
		if (context.includes('签收') || context.includes('领取')) return '已签收'
		if (context.includes('派件')) return '派送中'
		if (context.includes('发往') || context.includes('到达') || context.includes('离开')) return '运输中'
		if (context.includes('揽收')) return '已发货'
		return '已下单'
	}
	// 时间格式化（uni-app 兼容）
	const formatDate = (timeStr) => {
		// 快递100 返回格式如 "2025-03-26 10:30:00"
		return timeStr.replace('T', ' ').substring(0, 19)
	}
	// 地图中心点（最新节点）
	const center = computed(() => {
		if (logisticsData.value.length === 0) return { latitude: 39.9042, longitude: 116.4074 }

		const latest = logisticsData.value[0] // 最新在前
		console.log(latest, 'latestlatestlatest')
		const [lng, lat] = latest.areaCenter.split(',').map(Number)
		return { latitude: lat, longitude: lng }
	})

	// 轨迹线（连接所有点）
	const polylines = computed(() => {
		if (logisticsData.value.length < 2) return []
		console.log(logisticsData.value, '22')
		const points = logisticsData.value.map(item => {
			const [lng, lat] = item.areaCenter.split(',').map(Number)
			return { latitude: lat, longitude: lng }
		})

		return [{
			points,
			color: '#FF9600',
			width: 6,
			dottedLine: false
		}]
	})

	// 标记点
	const markers = computed(() => {
		const len = logisticsData.value.length
		if (len === 0) return []

		// 只处理第一个（index=0）和最后一个（index=len-1）
		const result = []

		// 添加第一个点（最新，通常为终点）
		const firstItem = logisticsData.value[0]
		if (firstItem.areaCenter) {
			const [lng1, lat1] = firstItem.areaCenter.split(',').map(Number)
			result.push({
				id: 0,
				latitude: lat1,
				longitude: lng1,
				iconPath: imgUrl + 'wl-s-icon.png', // 终点图标（已签收）
				width: 36,
				height: 36,
				callout: {
					content: getStatusText(firstItem.context),
					display: 'ALWAYS',
					padding: 8,
					borderRadius: 4,
					bgColor: '#fff',
					color: '#333'
				}
			})
		}

		// 如果不止一个点，再添加最后一个点（最早，起点）
		if (len > 1) {
			const lastItem = logisticsData.value[len - 1]
			if (lastItem.areaCenter && lastItem.areaCenter !== firstItem.areaCenter) {
				const [lng2, lat2] = lastItem.areaCenter.split(',').map(Number)
				result.push({
					id: len - 1,
					latitude: lat2,
					longitude: lng2,
					iconPath: imgUrl + 'wl-q-icon.png', // 起点图标（已发货）
					width: 36,
					height: 36,
					callout: {
						content: getStatusText(lastItem.context),
						display: 'ALWAYS',
						padding: 8,
						borderRadius: 4,
						bgColor: '#fff',
						color: '#333'
					}
				})
			}
		}

		return result
	})
	const gettrack = async () => {
		const res = await getmapTrack('YT7598715931479');

		logisticsData.value = res.data.data

	}
	onLoad((opticon) => {
		oderid.value = opticon.orderId
		getdel()
		gettrack()
		// if(opticon.orderStatus == 5){
		// 	orderType.value = 1
		// }else{
		// 	orderStatus.value = opticon.orderStatus
		// }
	})
</script>

<style lang="scss">
	@import './index.scss';

	.topNavBack {
		width: 750rpx;
		height: 175rpx;
		background: var(--head-color);
	}

	.carPad {
		padding: 38rpx 30rpx;
		box-sizing: border-box;
	}

	.kdView-text-address {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #666666;
		line-height: 40rpx;
		margin-bottom: 32rpx;

		text {
			color: #000000;
			font-weight: bold;
			margin-right: 20rpx;
		}
	}

	.kdView-text-name {
		width: 100%;
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
		margin-left: 56rpx;

		text {
			margin-right: 10rpx;
		}
	}

	.kdView {
		display: flex;
		align-items: center;

		.kdView-text {
			width: calc(100% - 40rpx - 15rpx);
			display: flex;
			align-items: center;
			// justify-content: center;

			.kdView-text-left {
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				font-size: 28rpx;
				color: #000000;
			}

			.kdView-text-cop {
				width: 60rpx;
				height: 30rpx;
				line-height: 30rpx;
				text-align: center;
				background: #FFFFFF;
				border-radius: 6rpx;
				border: 1px solid #CCCCCC;
				font-weight: 500;
				font-size: 20rpx;
				color: #333333;
				margin-left: 32rpx;
			}



		}
	}

	.descView {
		padding: 0 10rpx 30rpx 10rpx;
		box-sizing: border-box;

		.descView-title {
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}

		.descView-tetx {
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			padding: 24rpx 0;

			text {
				color: #5683F7;
			}
		}

		.descView-time {
			font-weight: 500;
			font-size: 24rpx;
			color: #999999;
		}
	}
</style>