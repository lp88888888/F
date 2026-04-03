<template>
	<view class="pageView">
		<map
			v-if="currentLat"
			:latitude="currentLat"
			:longitude="currentLng"
			:scale="14"
			:markers="markers"
			class="map"
			@markertap="handleMarkerTap"
			:polyline="polyline"
			:include-points="includePoints"
		></map>

		<!-- 顶部筛选搜索 -->
		<Search isFixed :boxHeight="boxHeight" @onAction="onAction" @change="searchChange"></Search>
		<!-- 侧面按钮-列表，订单，路线规划 -->
		<!-- <view class="rightView">
			<view class="rightView-card">
				<view class="rightView-card-item" @click="$u.route('/pages_A/chargingPiles/queryList')">
					<up-icon :name="imgUrl+'cdz-lb.png'" size="20"></up-icon>
					<text>列表</text>
				</view>
				<view class="rightView-card-item" @click="$u.route('/pages_A/order/index')">
					<up-icon :name="imgUrl+'cdz-dd.png'" size="20"></up-icon>
					<text>订单</text>
				</view>
			</view>
			<up-gap height="12"></up-gap>
			<view class="rightView-card">
				<view class="rightView-card-item">
					<up-icon :name="imgUrl+'cdz-map.png'" size="20"></up-icon>
					<text>路线规划</text>
				</view>
			</view>
		</view> -->
		<!-- <view class="use-btn-mz">
			<image :src="imgUrl+'img/miaozhunicon.png'" style="width: 89rpx; height: 89rpx;"></image>
		</view> -->
		<!-- 列表视图容器 -->
		<!-- <view class="listView"  :style="{ height: isToggled ? '1200rpx' : '600rpx' }" >
			<view class="line-heng" @click="toggleHeight" >
			</view>
			<scroll-view class="listView-scroll" :scroll-y="true">
				<view v-for="(item,index) in dataList" :key="index">
					<ItemCard :detail="item"></ItemCard>
					<up-gap height="12"></up-gap>
				</view>
			</scroll-view>
		</view> -->
		<view class="listView" :style="{ height: boxHeight + 'rpx' }">
			<view class="line_head" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
				<view class="line-heng"> </view>
			</view>

			<scroll-view class="listView-scroll" :scroll-y="true">
				<view v-for="(item, index) in dataList" :key="index">
					<ItemCard :detail="item"></ItemCard>
					<up-gap height="12"></up-gap>
				</view>
			</scroll-view>
			<view v-if="dataList.length == 0" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
				<ser-empty></ser-empty>
			</view>
		</view>
		<up-popup v-model:show="show" mode="center" :round="24" :safeAreaInsetBottom="false">
			<view class="warp">
				<view class="text-1">提示</view>
				<view class="text-2">真实数据对接中</view>
				<view style="display: flex; align-items: center; justify-content: center">
					<view class="bnt-1" @click="show = false">取消</view>
				</view>
			</view>
		</up-popup>
		<ser-CustomImageLoading :modelValue="loadingVisible" text="正在获取数据..." />
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { imgUrl } from '../../config';
import { toNav, toBack } from '@/utils/route';
import ItemCard from './components/ItemCard.vue';
import Search from './components/Search.vue';
import QQMapWX from '@/common/qqmap-wx-jssdk.js';
import { getchargingList } from '@/api/chargingPiles';
import { showLoading, hideLoading, showToast, ID2 } from '@/utils/util';
import { toast } from '@/utils/common';
import { onLoad } from '@dcloudio/uni-app';
const qqmapsdk = new QQMapWX({
	key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB', // 请替换为你的腾讯地图key
});
const show = ref(false);
const loadingVisible = ref(false);
const currentLat = ref(0);
const currentLng = ref(0);
const markers = ref([]);
const polyline = ref([]);
const includePoints = ref([]);
const loading = ref(true);
const errorMsg = ref('');
const listQuery = ref({
	pageNum: 1,
	pageSize: 50,
	stationName: '',
	stationStatus: '', // 站点状态：0=未知，1=建设中，5=关闭 6:维护中 50:正常使⽤
	chargingStatus: '',
	distanceRange: '',
	power: '',
});
const isToggled = ref(false);

// 切换高度的函数
const toggleHeight = () => {
	isToggled.value = !isToggled.value;
};
// --------------------------
const boxElement = ref(null);
const boxHeight = ref(600); // 初始高度
const startY = ref(0);
const currentY = ref(0);
const isDragging = ref(false);
const handleTouchStart = (e) => {
	startY.value = e.touches[0].clientY;
	isDragging.value = true;
};
const onAction = () => {
	boxHeight.value = 600;
};
const handleTouchMove = (e) => {
	if (!isDragging.value) return;

	currentY.value = e.touches[0].clientY;
	const deltaY = startY.value - currentY.value;

	// 阻止默认的滚动行为
	e.preventDefault();
};

const handleTouchEnd = () => {
	if (!isDragging.value) return;

	const deltaY = startY.value - currentY.value;

	// 上滑超过50px，切换到1200px
	if (deltaY > 50 && boxHeight.value === 600) {
		boxHeight.value = 1200;
	}
	// 下滑超过50px，切换到600px
	else if (deltaY < -50 && boxHeight.value === 1200) {
		boxHeight.value = 600;
	}
	isDragging.value = false;
};
// _-----------------------------------------
const dataList = ref([]);
const total = ref(0);
const searchChange = (event) => {
	dataList.value = [];
	listQuery.value.stationName = event.stationName;
	listQuery.value.stationStatus = event.stationStatus;
	listQuery.value.chargingStatus = event.chargingStatus;
	listQuery.value.distanceRange = event.distanceRange;
	listQuery.value.power = event.power;
	init();
};
// 初始化地图
// const init = () => {
// 	getUserAddress();
// 	getData();
//
// init()
// }

// 处理标记点击
const handleMarkerTap = (e) => {
	console.log('点击的小程序地图标记点', e);
	const markerId = e.markerId;
	toNav('/pages_A/chargingPiles/queryDetail?id=' + markerId);
};
// 导航到商店详情（这里只是示例，实际项目中可跳转到详情页）
const navigateToShop = (shop) => {
	showToast({
		title: `你选择了: ${shop.title}`,
		duration: 2000,
	});
};
// 初始化地图
const getUserAddress = () => {
	qqmapsdk.reverseGeocoder({
		success: (res) => {
			console.log(res, '位置信息');
			currentLat.value = uni.getStorageSync('address').lat;
			currentLng.value = uni.getStorageSync('address').lng;
			init();
		},
		fail: (err) => {
			console.error('逆地理编码失败:', err);
		},
	});
};
const init = () => {
	loadingVisible.value = true;
	listQuery.value.pageNum = 1;
	getData();
};
const getData = async () => {
	try {
		let params = {
			...listQuery.value,
			latitude: currentLat.value,
			longitude: currentLng.value,
		};
		const res = await getchargingList(params);
		console.log(res);
		if (res.code === 200) {
			let hasList = JSON.parse(JSON.stringify(res.data.list));
			console.log(dataList.value, res.data.list, 'dataList.value');
			dataList.value = [...dataList.value, ...res.data.list];

			markers.value = hasList.map((item, index) => {
				item.zIndex = 2;
				item.id = Number(item.stationId);
				item.markerId = item.stationId;
				item.width = '27';
				item.height = '32';
				item.latitude = Number(item.stationLat);
				item.longitude = Number(item.stationLng);
				item.iconPath = imgUrl + 'static/oil-map-icon.png';
				return item;
			});
			total.value = res.data.total;
		} else {
			toast(res.msg);
		}
		loadingVisible.value = false;
	} catch (err) {
		loadingVisible.value = false;
	}
};
onLoad(() => {
	currentLat.value = uni.getStorageSync('address').lat;
	currentLng.value = uni.getStorageSync('address').lng;
	init();
});
</script>

<style lang="scss" scoped>
.warp {
	width: 570rpx;
	// height: 432rpx;
	// background: linear-gradient(180deg, #C8FFFD 0%, #FFFFFF 40%);
	background: #ffffff;
	border-radius: 24rpx 24rpx 24rpx 24rpx;
	padding: 50rpx;
	box-sizing: border-box;
	// margin: 400rpx auto;
	// z-index: -2;

	.text-1 {
		font-weight: 350;
		font-size: 32rpx;
		color: #333333;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.text-2 {
		font-weight: 350;
		font-size: 28rpx;
		color: #333333;
		text-align: center;
		margin-bottom: 48rpx;
	}

	.bnt-1 {
		width: 220rpx;
		height: 76rpx;
		background: #ffffff;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		border: 2rpx solid #00bebe;
		font-weight: 500;
		font-size: 28rpx;
		color: #00bebe;
		line-height: 76rpx;
		text-align: center;
	}

	.bnt-2 {
		width: 220rpx;
		height: 76rpx;
		background: #00bebe;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		font-weight: 500;
		font-size: 28rpx;
		color: #fff;
		line-height: 76rpx;
		text-align: center;
	}
}

.listView {
	width: 100%;
	background: #f8f9fb;
	border-radius: 40rpx 40rpx 0rpx 0rpx;
	padding-top: 0;
	padding-left: 30rpx;
	padding-right: 30rpx;
	z-index: 999;
	transition: height 0.3s ease;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 999;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-direction: column;

	.line_head {
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.line-heng {
			width: 126rpx;
			height: 8rpx;
			background: #d8d8d8;
			border-radius: 376rpx 376rpx 376rpx 376rpx;
		}
	}
}

.listView-scroll {
	background: none;
	flex: 1 0;
	height: 0;
}

.pageView {
	width: 100%;
	height: 100vh;
	position: relative;
}

.map {
	width: 100%;
	height: 100%;
}

.searchTop {
	width: 100%;
	background: #ffffff;
	padding: 24rpx 40rpx;
	box-sizing: border-box;
	position: absolute;
	top: 0;
	left: 0;

	.searchIcons {
		width: 100%;
		padding-top: 28rpx;

		.searchIcons-item {
			padding: 14rpx 20rpx;
			box-sizing: border-box;
			background: #f0f0f0;
			border-radius: 28rpx 28rpx 28rpx 28rpx;

			font-weight: 400;
			font-size: 26rpx;
			color: #666666;
			line-height: 28rpx;
			margin-right: 24rpx;

			text {
				margin-right: 10rpx;
			}
		}
	}
}

.rightView {
	position: absolute;
	right: 32rpx;
	top: 240rpx;

	.rightView-card {
		width: 112rpx;
		background: #ffffff;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(0, 0, 0, 0.06);
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		padding: 10rpx 0;

		.rightView-card-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 10rpx 0;

			font-weight: 500;
			font-size: 24rpx;
			color: #666666;
			line-height: 24rpx;

			text {
				margin-top: 6rpx;
			}
		}
	}
}

.use-btn-mz {
	width: 112rpx;
	box-shadow: 0px 1rpx 4rpx 0px rgba(149, 149, 149, 0.52);
	border-radius: 10rpx;
	padding: 14rpx 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: absolute;
	right: 32rpx;
	top: 50vh;
}
</style>
