<template>
	<view class="container" :data-theme="pageTheme">
		<view class="pageView">
			<view class="header-box">
				<view class="serviceInfo">
					<view style="display: flex;flex-direction: column;align-items: flex-start;">
						<view class="serviceName" style="display: flex;align-items: center;">
							<view class="status">{{statusTetx(Detail.stationStatus)}}</view>
							{{Detail.stationName}}
						</view>
						<view class="distance">
							<up-icon name="map" :color="themeStore.themeColors.$primaryColor"
								size="16"></up-icon><text>距您{{Detail.distance}}km</text>
						</view>
					</view>
					<view style="display: flex;align-items: center;">
						<view class="cal-icon">
							<image @click="goMap1" :src="imgUrl+'cd-daohang.png'"
								style="width: 58rpx; height: 58rpx;margin-bottom: 20rpx;"></image>
							<text>导航</text>
						</view>
						<view @click="callPhone" class="cal-icon" v-if="Detail.serviceTel">
							<image :src="imgUrl+'cd-phone.png'"
								style="width: 58rpx; height: 58rpx;margin-bottom: 20rpx;"></image>
							<text>电话</text>
						</view>
					</view>
				</view>
				<view class="details">
					<view class="detailItem">
						地址: {{ Detail.address }}
					</view>
				</view>
			</view>
			<!-- Tab 切换 -->
			<view class="tab-container">
				<view v-for="(tab, index) in tabs" :key="index"
					:class="['tab-item', { 'active': currentIndex === index }]" @click="handleTabClick(index)">
					{{ tab }}
				</view>
			</view>

			<!-- Tab 内容 -->
			<view class="tab-content">
				<view v-if="currentIndex === 0">
					<!-- <view class="price-info">
						<view class="time-price">
							<text>08:00 - 11:00</text>
							<text class="current-time">当前时段</text>
						</view>
						<view class="price-details">
							<text>电费:0.90元/度</text>
							<text class="total-price">¥ 1.10元/度</text>
							<text>(服务费0.2元/度)</text>
						</view>
					</view> -->
					<!-- 	<view class="price-list" v-for="(item,index) in Detail.policyInfoVoList">
						<view class="price-list-code">
							<view class="price-list-2">
								<text class="price-text">{{item.elecPrice+item.sevicePrice}}元/度</text>
								<text
									class="price-list-text">(服务费:{{item.sevicePrice}}元/度，电费{{item.elecPrice}}元/度)</text>
							</view>
							<view class="price-list-3">
								{{formatTime(item.startTime)}} - {{formatTime(item.endTime)}}
							</view>
						</view>
					</view> -->
					<view class="price-table-container">
						<!-- 表头 -->
						<view class="table-header">
							<view class="header-cell">费用时段</view>
							<view class="header-cell">费用(元/度)</view>
							<view class="header-cell">电费</view>
							<view class="header-cell">服务费</view>
						</view>

						<!-- 数据行 -->
						<view v-for="(item, index) in policyInfoVoList" :key="index" class="table-row"
							:class="{ 'current-period': isCurrentPeriod(item) }">
							<!-- <view class="tag-jb">
								当前时段
							</view> -->
							<!-- 费用时段 -->
							<view class="cell" style="width: 200rpx;">{{ formatTime(item.startTime) }} -
								{{ formatTime(item.endTime) }}
							</view>

							<!-- 费用/度 -->
							<view class="cell">
								<text class="price-text">{{ item.elecPrice + item.sevicePrice }}</text>
								<text class="tag" :class="getTagClass(item)">
									{{ getTagName(item) }}
								</text>
							</view>

							<!-- 电费 -->
							<view class="cell">{{ item.elecPrice }} </view>

							<!-- 服务费 -->
							<view class="cell">{{ item.sevicePrice }}</view>
						</view>
					</view>
				</view>
				<view v-if="currentIndex === 1" class="fast-charging-stations">
					<view class="station-item" v-for="(station, index) in Detail.fastEquipment" :key="index">
						<view class="station-name">桩名称: {{ station.equipmentName }}</view>
						<view class="station-power">额定功率: {{ station.power }}kW</view>
						<view style="display: flex;align-items: center;margin-bottom: 20rpx;"
							v-for="(i,v) in station.connectorList" :key="v">
							<image v-if="i.status==1" :src="imgUrl+'Electricpile-icon-1.png'" class="station-image">
							</image>
							<image v-else :src="imgUrl+'Electricpile-icon-2.png'" class="station-image"></image>
							<view class="">
								<view class="gun-status">枪状态:{{ i.statusDesc }}</view>
								<view class="gun-number">枪编号: {{ i.connectorId }}</view>
							</view>

						</view>

					</view>
				</view>
				<view v-if="currentIndex === 2" class="fast-charging-stations">
					<view class="station-item" v-for="(station, index) in Detail.slowEquipment" :key="index">
						<view class="station-name">桩名称: {{ station.equipmentName }}</view>
						<view class="station-power">额定功率: {{ station.power }}kW</view>
						<view style="display: flex;align-items: center;margin-bottom: 20rpx;"
							v-for="(i,v) in station.connectorList" :key="v">
							<image v-if="i.status==1" :src="imgUrl+'Electricpile-icon-1.png'" class="station-image">
							</image>
							<image v-else :src="imgUrl+'Electricpile-icon-2.png'" class="station-image"></image>
							<view class="">
								<view class="gun-status">枪状态:{{ i.statusDesc }}</view>
								<view class="gun-number">枪编号: {{ i.connectorId }}</view>
							</view>

						</view>

					</view>
				</view>
				<!-- <view v-if="currentIndex === 3" class="currentIndex-3">
					<image :src="imgUrl+'mode-icon.png'" mode=""></image>
					<view class="currentIndex-3-text">
						其他内容
					</view>
				</view> -->
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="foot-bomm">
			<view class="foot-bomm-left">
				<!-- <view class="foot-bomm-left-1">
					<text class="foot-bomm-left-text">¥</text>
					1.10元/度
				</view>
				<view class="foot-bomm-left-2">
					合计
				</view> -->
			</view>
			<view @click="goMap1" class="foot-bomm-right">
				导航到站点
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		ref
	} from 'vue'

	import QQMapWX from "@/common/qqmap-wx-jssdk.js";
	import { imgUrl } from '../../config';
	import { getCharging } from '@/api/travel';
	import { onLoad } from '@dcloudio/uni-app';
	import { toast } from '@/utils/common';
	import { openAPPLocation, openLocation, makePhoneCall } from '@/utils/util';

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	const tabs = ref(['价格', '快充 空2/4', '慢充 空0/4'])
	const currentIndex = ref(0)
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});
	const currentLat = ref<number | number>(0);
	const currentLng = ref<number | number>(0);
	const stationId = ref<string | null>('');
	const Detail = ref({});
	const statusTetx = computed(() => {
		return (stationStatus) => {
			switch (stationStatus) {
				case '50':
					return '营业中';
				case '6':
					return '维护中';
				case '5':
					return '关闭';
				case '1':
					return '建设中';
				default:
					return '未知';
			}
		}
	});
	const fastEquipment = ref([]);
	const slowEquipment = ref([]);
	const policyInfoVoList = ref([
		{
			startTime: "00:00",
			endTime: "07:00",
			elecPrice: 0.25,   // 电费
			sevicePrice: 0.30  // 服务费
		},
		{
			startTime: "07:00",
			endTime: "10:00",
			elecPrice: 0.50,
			sevicePrice: 0.40
		},
		{
			startTime: "10:00",
			endTime: "15:00",
			elecPrice: 0.80,
			sevicePrice: 0.76
		},
		{
			startTime: "15:00",
			endTime: "18:00",
			elecPrice: 0.50,
			sevicePrice: 0.40
		},
		{
			startTime: "18:00",
			endTime: "21:00",
			elecPrice: 0.80,
			sevicePrice: 0.76
		},
		{
			startTime: "21:00",
			endTime: "24:00",
			elecPrice: 0.50,
			sevicePrice: 0.40
		}
	]);// 充电费用
	// 切换Tab
	const handleTabClick = (index) => {
		currentIndex.value = index
	}
	// const formatTime = (timeStr) => {
	// 	if (!timeStr || timeStr.length !== 6) return timeStr
	// 	return `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`
	// }
	const now = new Date()
	const currentHour = now.getHours()

	// 判断是否是当前时段
	const isCurrentPeriod = (item) => {
		const startHour = parseInt(item.startTime.split(':')[0])
		const endHour = parseInt(item.endTime.split(':')[0])
		return currentHour >= startHour && currentHour < endHour
	}

	// 获取标签名称
	const getTagName = (item) => {
		const total = item.elecPrice + item.sevicePrice
		if (total === 0.95) return '谷'
		if (total === 1.26) return '平'
		if (total === 1.56) return '峰'
		return ''
	}

	// 获取标签样式类名
	const getTagClass = (item) => {
		const total = item.elecPrice + item.sevicePrice
		if (total === 0.95) return 'tag-valley'     // 谷电：浅绿
		if (total === 1.26) return 'tag-normal'    // 平电：浅蓝
		if (total === 1.56) return 'tag-peak'      // 峰电：橙色
		return ''
	}

	// 格式化时间（如 "00:00" → "00:00"）
	const formatTime = (timeStr) => {
		return timeStr
	}
	const fastChargingStations = ref([{
		name: '星星充电桩',
		power: '120',
		image: 'Electricpile-icon-1.png',
		gunStatus: '已插枪',
		gunNumber: '005912000200000102'
	},
	{
		name: '星星充电桩',
		power: '120',
		image: 'Electricpile-icon-2.png',
		gunStatus: '空闲中',
		gunNumber: '005912000200000103'
	}
	])
	const fastChargingStation = ref([{
		name: '星星充电桩',
		power: '35',
		image: 'Electricpile-icon-1.png',
		gunStatus: '空闲中',
		gunNumber: '005912000200000102'
	},
	{
		name: '星星充电桩',
		power: '35',
		image: 'Electricpile-icon-2.png',
		gunStatus: '空闲中',
		gunNumber: '005912000200000103'
	}
	])
	//地图
	const goMap1 = () => {
		// #ifdef APP
		openAPPLocation({
			endLocation: {
				latitude: Number(Detail.value.stationLat),//维度
				longitude: Number(Detail.value.stationLng),//经度
				address: Detail.value.address//地址
			}
		})
		// #endif
		// #ifdef MP-WEIXIN
		openLocation({
			latitude: Number(Detail.value.stationLat),//维度
			longitude: Number(Detail.value.stationLng),//经度
			scale: 13,//缩放比例，范围5~18，默认为18
			name: Detail.value.stationName,//位置名称
			address: Detail.value.address//地址
		})
		// #endif

	}

	// 拨打电话
	const callPhone = () => {
		console.log("点击的电弧", Detail.value)
		makePhoneCall(Detail.value.serviceTel);
	};
	const getUserAddress = () => {

		// #ifdef APP
		currentLat.value = uni.getStorageSync('address').lat;
		currentLng.value = uni.getStorageSync('address').lng;
		gatData()
		// #endif
		// #ifdef MP-WEIXIN
		qqmapsdk.reverseGeocoder({
			success: (res) => {
				console.log(res, '位置信息');
				currentLat.value = res.result.location.lat;
				currentLng.value = res.result.location.lng;
				gatData()
			},
			fail: (err) => {
				console.error('逆地理编码失败:', err);
			}
		});
		// #endif

		// qqmapsdk.reverseGeocoder({
		// 	success: (res) => {
		// 		console.log(res, '位置信息');

		// 	},
		// 	fail: (err) => {
		// 		console.error('逆地理编码失败:', err);
		// 	}
		// });

	}
	const gatData = async () => {
		try {
			const res = await getCharging({
				longitude: currentLng.value,
				latitude: currentLat.value,
				stationId: stationId.value
			});
			console.log('-----------', res);
			if (res.code == 200) {
				Detail.value = res.data;
				tabs.value[1] = `快充 ${res.data.fastFree} / ${res.data.fastTotal}`;
				tabs.value[2] = `慢充 ${res.data.slowFree} / ${res.data.slowTotal}`;
				fastEquipment.value = res.data.fastEquipment;
				// policyInfoVoList.value = res.data.policyInfoVoList;
				slowEquipment.value = res.data.slowEquipment;
			} else {
				toast(res.msg)
			}
		} catch (err) {
			console.log('090-900990-=', err);
		}

	}
	onLoad((opticon) => {
		stationId.value = opticon.id;
		currentLat.value = uni.getStorageSync('address').lat;
		currentLng.value = uni.getStorageSync('address').lng;
		gatData()
	})
</script>

<style lang="scss" scoped>
	.price-table-container {
		background-color: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	/* 表头 */
	.table-header {
		display: flex;
		background-color: #fff;
		border-bottom: 1rpx solid #e5e5e5;
		padding: 20rpx 0;
	}

	.header-cell {
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
	}

	/* 数据行 */
	.table-row {
		display: flex;
		padding: 30rpx;
		border-bottom: 1rpx solid #eee;
		position: relative;
	}

	.tag-jb {}

	.table-row:last-child {
		border-bottom: none;
	}

	.current-period {
		background: #F8F9FB;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #FFA813;
	}

	/* 单元格 */
	.cell {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		width: 170rpx;
		text-align: center;
		font-size: 26rpx;
		color: #666;
	}

	.price-text {
		font-size: 24rpx;
		color: #333;
	}

	/* 标签样式 */
	.tag {
		margin-left: 10rpx;
		padding: 4rpx 8rpx;
		font-size: 20rpx;
		border-radius: 4rpx;
		white-space: nowrap;
	}

	.tag-valley {
		background: #EAFFFF;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #47DFDA;
		font-weight: 500;
		font-size: 20rpx;
		color: #00BEBE;
	}

	.tag-normal {
		background: #EAFFFF;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #47DFDA;
		font-weight: 500;
		font-size: 20rpx;
		color: #00BEBE;
		padding: 4rpx 8rpx;
	}

	.tag-peak {
		background: #EAFFFF;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #47DFDA;
		font-weight: 500;
		font-size: 20rpx;
		color: #00BEBE;

	}

	/* 当前时段提示标签 */
	.current-period::before {
		content: "当前时段";
		position: absolute;
		left: 0;
		top: 0;
		width: 106rpx;
		height: 30rpx;
		background: #FFA813;
		color: #fff;
		font-weight: 500;
		font-size: 20rpx;
		line-height: 30rpx;
		border-radius: 4rpx 4rpx 30rpx 4rpx;
	}

	// _______________________
	.cal-icon {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-right: 30rpx;
	}

	.foot-bomm {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 160rpx;
		box-sizing: border-box;
		padding: 38rpx 40rpx;
		background: #FFFFFF;
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.03);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		border: 2rpx solid rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: space-between;

		.foot-bomm-left {
			display: flex;
			flex-direction: column;
		}

		.foot-bomm-left-1 {
			font-weight: 700;
			font-size: 36rpx;
			color: var(--primary-color);

			.foot-bomm-left-text {
				font-size: 24rpx;
			}
		}

		.foot-bomm-left-2 {
			font-size: 24rpx;
			color: #666666;
		}

		.foot-bomm-right {
			width: 192rpx;
			height: 70rpx;
			background: var(--primary-color);
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			text-align: center;
			line-height: 70rpx;
			color: #fff;
		}
	}

	.container {
		height: calc(100vh - 88rpx);
		background: #F6F5F4;
		padding: 32rpx;
	}

	.header-box {
		background-color: #fff;
		border-radius: 24rpx;
		padding: 32rpx;
	}

	.serviceInfo {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx 0;

		.serviceName {
			width: 400rpx;
			// white-space: nowrap;
			// overflow: hidden;
			// text-overflow: ellipsis;
			display: flex;
			align-items: self-start;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}

		.distance {
			font-size: 28rpx;
			color: #666;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 5rpx;
		}

		.status {
			width: 90rpx;
			height: 28rpx;
			background: #EAFFFF;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			border: 2rpx solid #47DFDA;
			font-weight: 500;
			font-size: 20rpx;
			color: #00BEBE;
			text-align: center;
			line-height: 28rpx;
			margin-right: 18rpx;
		}
	}

	.details {
		.detailItem {
			font-size: 28rpx;
			color: #666;
			margin-bottom: 16rpx;
		}
	}

	.buttons {
		display: flex;
		padding: 24rpx 0;

		.navigateButton,
		.callButton {
			width: 196rpx;
			height: 60rpx;
			border-radius: 8rpx;
			font-size: 28rpx;
			text-align: center;
			line-height: 60rpx;
			border: 1px solid #F4EDE5;
		}

		.navigateButton {
			background: rgba(147, 83, 0, 0.1);
			color: #492900;
			margin-right: 10rpx;
		}

		.callButton {
			border: 2rpx solid var(--primary-color);
			background-color: #fff;
			color: var(--primary-color);
		}
	}

	.tab-container {
		display: flex;
		margin-top: 24rpx;

		.tab-item {
			min-width: 120rpx;
			box-sizing: border-box;
			padding: 12rpx 32rpx;
			margin-right: 16rpx;
			border-radius: 32rpx;
			background: #f0f0f0;
			color: #666;
			font-size: 26rpx;
		}
		.tab-item.active {
			background: var(--primary-color);
			color: white;
		}
	}

	.tab-content {
		margin-top: 24rpx;
	}

	.price-info {
		display: flex;
		flex-direction: column;
		padding: 32rpx;
		background-image: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/cd-bj.png');
		background-repeat: no-repeat;
		border-radius: 12rpx;

		.time-price {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16rpx;
			font-weight: 700;
			font-size: 32rpx;
			color: #666666;

			.current-time {
				background-color: #E6FFE6;
				color: #33CC33;
				padding: 8rpx 16rpx;
				border-radius: 16rpx;
				font-size: 24rpx;
			}
		}

		.price-details {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;

			.total-price {
				font-weight: 700;
				font-size: 40rpx;
				color: var(--primary-color);
				margin: 16rpx 0;
			}
		}
	}

	.price-list {
		background-color: #fff;
		margin-top: 24rpx;
		padding: 32rpx;
		border-radius: 12rpx;
	}

	.price-list-code {
		padding-bottom: 32rpx;
		border-bottom: 2rpx solid rgba(0, 0, 0, 0.06);

	}

	.price-list-1 {
		font-weight: 700;
		font-size: 32rpx;
		color: #666666;
		margin-bottom: 24rpx;
	}

	.price-list-text {
		font-size: 24rpx;
		color: #666666;
	}

	.price-list-2 {
		font-size: 28rpx;
		color: #666666;
	}

	.fast-charging-stations {
		display: flex;
		flex-direction: column;
		margin-top: 24rpx;
		padding-bottom: 150rpx;

		.station-item {
			background-color: #fff;
			border-radius: 12rpx;
			padding: 32rpx;
			margin-bottom: 24rpx;

			.station-name {
				font-weight: 700;
				font-size: 32rpx;
				color: #666666;
				margin-bottom: 24rpx;
			}

			.station-power {
				font-size: 28rpx;
				color: #666;
				margin-bottom: 42rpx;
			}

			.gun-number {
				font-size: 24rpx;
				color: #666;
			}

			.station-image {
				width: 46rpx;
				height: 96rpx;
				margin-right: 32rpx;
			}

			.gun-status {
				font-weight: 700;
				font-size: 28rpx;
				color: var(--primary-color);
				margin-bottom: 24rpx;
			}
		}
	}

	.currentIndex-3 {
		width: 686rpx;
		height: 620rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		image {
			width: 478rpx;
			height: 180rpx;
			border-radius: 0rpx 0rpx 0rpx 0rpx;
			margin-bottom: 24rpx;
		}

		.currentIndex-3-text {
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;
		}
	}

	.price-text {
		display: inline-block;
		width: 80rpx;
		text-align: left;
		font-size: 30rpx;
		color: #666666;
	}

	.price-list-3 {
		margin-top: 10rpx;
	}
</style>