<template>
	<view class="container" :data-theme="pageTheme">
		<view id="toBox" class="topView" >
			<up-navbar title="检测站" bgColor="transparent" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
			<view class="search">
				<view class="search-box">
					<up-search placeholder="请输入关键字搜索" v-model="searchTex" @blur="init" :showAction="false" searchIconColor="#000000"></up-search>
				</view>
				<!-- 筛选栏 -->
				<view class="filter-bar">
					<view class="filter-item filter-ls" @click="categoryFun('1')">
						<text :class="[merIndex > 0 ? 'active' : 'defText']">{{ textValue(1) }}</text>
						<view class="down"><up-icon name="arrow-down-fill" color="#000" size="10"></up-icon></view>
					</view>
				</view>
			</view>
		</view>

		<view :style="{ width: '750rpx', height: topBoxHeight + 'px' }"></view>
		<up-popup :show="iscategory" mode="top" z-index="9" @close="iscategory = false">
			<view class="popView" :style="{ paddingTop: topBoxHeight + 'px' }">
				<view v-if="typeIndex == '1'">
					<view class="labelBox" v-for="(item, index) in merTypes" :key="index" @click="cateChange(1, index)">
						<text :class="[merIndex == index ? 'active' : 'deflabeText']">{{ item.val }}</text>
					</view>
				</view>
			</view>
		</up-popup>
		<!-- 地图组件 -->
		<map :latitude="currentLat" v-if="currentLat" :longitude="currentLng" :markers="markers" @markertap="handleMarkerTap" :scale="scale" class="map"></map>

		<!-- 列表底部弹窗 -->
		<view
			class="location-list"
			@touchstart="handleTouchStart"
			@touchmove="handleTouchMove"
			@touchend="handleTouchEnd"
			:style="{ height: boxHeight + 'rpx' }"
		>
			<view class="location-title" v-if="isshow">
				<text style="font-size: 26rpx">已为您查询到{{ total }}条信息内容</text>
			</view>
			
			<view class="empty-state" v-if="markers.length == 0">
				<ser-empty></ser-empty>
			</view>
			<view class="location-score">
				<view class="gas-station-card" v-for="(item, index) in markers" :key="index" @click="oildetailsFun(item)">
					<!-- 左侧图标 -->
					<view class="gas-img">
						<image v-if="item.merchantImage" :src="item.merchantImage" class="img"></image>
						<image v-else :src="imgUrl + 'yq-zgsy.png'" class="img"></image>
					</view>
					<!-- 右侧信息区域 -->
					<view class="station-info">
						<text class="station-name" lines="1">{{ item.merchantName }}</text>
						<view class="station-distance">
							<text class="station-n"><text style="color: #000">距你</text> {{ item.distance }}</text>
							<text class="fontTetx">{{ item.merchantAddress }}</text>
						</view>
						<!-- <text class="station-discount">最高优惠9折</text> -->
						<image :src="imgUrl + 'yq-dff.png'" class="img" @click.stop="goMap1(item)"></image>
					</view>
				</view>
			</view>
		</view>
		<PageDurationTracker pageName="检测站" type='count'/>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
import { toNav, toBack } from '@/utils/route';
import { onReachBottom, onReady } from '@dcloudio/uni-app';
import { getlistPageMerchant } from '@/api/index';
import { showLoading, hideLoading, showToast, ID2 ,openLocation} from '@/utils/util';
import { imgUrl } from '../../config';
import QQMapWX from '../../common/qqmap-wx-jssdk.js';
import { getDrivingRoute, LatLng } from '@/utils/polyline';
import { useElementRects } from '@/utils/useElementRect';

// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

const { queryAll } = useElementRects(['#toBox']);
const topBoxHeight = ref(90);
const pageType = ref();
const fontColor = ref<string>('#000');
const fixed = ref<boolean>(true);
const currentLat = ref('');
const currentLng = ref('');
const iscategory = ref<boolean>(false);
const isshow = ref<boolean>(true);
const scale = ref(15);
const pageNum = ref(1);
const totalPage = ref(1); // 总分页
const total = ref(0);
const searchTex = ref<string>('');
const merTypes = ref([
	{ key: '', val: '全部' },
	{ key: '01', val: '客车' },
	{ key: '02', val: '货车' },
	{ key: '03', val: '货车/客车' },
]);
const merIndex = ref<number>(0);
const loadTypes = ref([
	{ key: '', val: '全部' },
	{ key: '01', val: '非高速' },
	{ key: '02', val: '高速' },
]);
const loadIndex = ref<number>(0);
const gasolineTypes = ref([
	{ key: '', val: '全部' },
	{ key: '01', val: '92#' },
	{ key: '02', val: '95#' },
	{ key: '03', val: '98#' },
]);
const gasolineIndex = ref<number>(0);

const markers = ref([]);
const dataList = ref([]);
const typeIndex = ref('');

const isnavigation = ref(false);
const selectedLocation = ref(null);
const qqmapsdk = new QQMapWX({
	key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB', // 请替换为你的腾讯地图key
});
const boxHeight = ref(600); // 初始高度
const startY = ref(0);
const currentY = ref(0);
const isDragging = ref(false);
const handleTouchStart = (e) => {
	startY.value = e.touches[0].clientY;
	isDragging.value = true;
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
		iscategory.value = false;
		boxHeight.value = 1200;
	}
	// 下滑超过50px，切换到600px
	else if (deltaY < -50 && boxHeight.value === 1200) {
		boxHeight.value = 600;
	}

	isDragging.value = false;
};
const textValue = computed(() => {
	return (type) => {
		if (type == 1) {
			if (merIndex.value == 0) return '类型';
			else return merTypes.value[merIndex.value].val;
		}
		if (type == 2) {
			if (gasolineIndex.value == 0) return '油品';
			else return gasolineTypes.value[gasolineIndex.value].val;
		}
		if (type == 3) {
			if (loadIndex.value == 0) return '路线';
			else return loadTypes.value[loadIndex.value].val;
		}
		// if(type == 2){

		// }
		// if(type == 3){

		// }
	};
});

// 初始化地图
const initMap = async () => {
	try {
		// 获取用户位置
		// const locationRes : any = await new Promise((resolve, reject) => {
		// 	uni.getLocation({
		// 		type: 'gcj02', // 腾讯地图使用gcj02坐标系
		// 		success: resolve,
		// 		fail: reject
		// 	});
		// });
		currentLat.value = uni.getStorageSync('address').lat;
		currentLng.value = uni.getStorageSync('address').lng;
		init();
	} catch (err) {
		console.error('初始化地图失败:', err);
	} finally {
	}
};
const inputConfirm = (event) => {
	console.log(event);
	init();
};
const init = () => {
	pageNum.value = 1;
	totalPage.value = 1;
	total.value = 0;
	dataList.value = [];
	markers.value = [];
	getList(currentLat.value, currentLng.value);
};
/**
 * 获取油气商户列表
 */
const getList = async (lat, lon) => {
	var that = this;
	var params = {
		pageNum: pageNum.value,
		pageSize: 50,
		merchantLon: lon,
		merchantLat: lat,
		merchantName: searchTex.value ? searchTex.value : '',
		merchantLocationType: loadIndex.value <= 0 ? '' : '0' + loadIndex.value,
		checkVehicleType: merIndex.value <= 0 ? '' : '0' + merIndex.value,
		merType: '08',
	};
	showLoading();
	// merchantLocationType  01非高速  02高速
	// merType  01加油  02加气
	try {
		let res: any = await getlistPageMerchant(params);
		console.log('小程序监测站', res);
		if (res.rows.length) {
			let hasList = res.rows;

			total.value = res.total;
			totalPage.value = res.pages;
			if (pageNum.value == 1) {
				dataList.value = hasList;
				markers.value = hasList.map((item, index) => {
					item.stationId = item.merchantId;
					item.zIndex = 2;
					item.id = index;
					item.width = '27';
					item.height = '32';
					item.latitude = Number(item.merchantLat);
					item.longitude = Number(item.merchantLon);
					item.iconPath = imgUrl + 'static/' + (item.merType == '01' ? 'oil' : 'gas') + '-map-icon.png';
					return item;
				});
			} else {
				dataList.value = [...dataList.value, ...hasList];
				markers.value = [
					...markers.value,
					...hasList.map((item, index) => {
						item.stationId = item.merchantId;
						item.zIndex = 2;
						item.id = index;
						item.width = '27';
						item.height = '32';
						item.latitude = Number(item.merchantLat);
						item.longitude = Number(item.merchantLon);
						item.iconPath = imgUrl + 'static/' + (item.merType == '01' ? 'oil' : 'gas') + '-map-icon.png';
						return item;
					}),
				];
			}
			// scale.value = scale.value > 9 ? 9 : scale.value
		}

		hideLoading();
		// uni.stopPullDownRefresh()
	} catch (err) {
		hideLoading();
		// uni.stopPullDownRefresh()
		showToast(err);
	}
};
const categoryFun = (type) => {
	typeIndex.value = type;

	iscategory.value = !iscategory.value;
	if (iscategory.value) {
		boxHeight.value = 600;
	}
};
const cateChange = (type, index) => {
	if (type == 1) {
		merIndex.value = index;
	}
	if (type == 2) {
		gasolineIndex.value = index;
	}
	if (type == 3) {
		loadIndex.value = index;
	}
	iscategory.value = false;
	init();
};

// 标记点点击事件
const handleMarkerTap = (event) => {
	console.log('点击的数据', event);

	var makerId = event.detail.markerId;
	var filterMaker = dataList.value[makerId];
	uni.setStorageSync('k1yMerInfo', filterMaker);
	uni.navigateTo({
		url: '/pages_D/inspection/details?merId=' + filterMaker.stationId + (pageType.value == 'check' ? '&type=check' : ''),
	});
};
const oildetailsFun = (item) => {
	uni.setStorageSync('k1yMerInfo', item);
	uni.navigateTo({
		url: '/pages_D/inspection/details?merId=' + item.stationId + (pageType.value == 'check' ? '&type=check' : ''),
	});
};

const handleQuery = async () => {
	try {
		const result: any = await queryAll();
		console.log('---------->>>', result);
		for (let i in result) {
			if (result[i].id == 'toBox') {
				topBoxHeight.value = result[i].height;
			}
		}
	} catch (err) {
		console.log('卡片尺寸shib:', err);
	}
};
// onReachBottom
onReachBottom(() => {
	console.log('到底了');
	if (totalPage.value > pageNum.value) {
		pageNum.value++;
		getList(currentLat.value, currentLng.value);
	}
});
onReady(() => {
	// 从cos-header组件获取实际高度或计算
	nextTick(() => {
		setTimeout(() => {
			handleQuery();
		}, 100);
	});
});
// 页面加载时初始化地图
onMounted(() => {
	initMap();
});
//地图
const goMap1 = (item) => {
	console.log(item);
	openLocation({
		latitude: Number(item.merchantLat),//维度
		longitude: Number(item.merchantLon),//经度
		scale: 18,//缩放比例，范围5~18，默认为18
		name: item.merchantName,
	})
};
</script>

<style scoped lang="scss">
.xiala {
	width: 750rpx;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #fff;
}

.container {
	width: 750rpx;
	height: 100vh;
	position: relative;
}

.active {
	color: #ff9000;
	font-size: 28rpx;
}

.topView {
	width: 750rpx;
	background: var(--head-color);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 99;
	/* APP 端特性 */
	elevation: 999;
}

.labelBox {
	padding: 25rpx 32rpx;
	box-sizing: border-box;
	font-size: 28rpx;
}

.deflabeText {
	font-size: 28rpx;
}

.activeLabel {
	color: #ff9000;
	font-size: 28rpx;
}

.map {
	width: 750rpx;
	height: 900rpx;
}

.loading-mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 100;
}

.loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #fff;
	padding: 20rpx 40rpx;
	border-radius: 10rpx;
}

.loading-text {
	margin-top: 20rpx;
	color: #333;
	font-size: 28rpx;
}

.error-message {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: #fff;
	padding: 30rpx;
	border-radius: 10rpx;
	text-align: center;
	z-index: 100;
	width: 600rpx;
}

.retry-btn {
	margin-top: 20rpx;
	background-color: #007aff;
	color: #fff;
	padding: 10rpx 20rpx;
	border-radius: 5rpx;
}

.list-header {
	width: 690rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
	margin-bottom: 14rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 30rpx 18rpx 18rpx;
	box-sizing: border-box;

	.list-header-1 {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;

		text {
			font-size: 28rpx;
			color: #333333;
			max-width: 500rpx;
			font-weight: bold;
		}
	}

	.list-header-2 {
		margin-bottom: 40rpx;
		margin-left: 40rpx;

		text {
			font-size: 24rpx;
			color: #333333;
		}
	}

	.list-header-3 {
		height: 80rpx;
		background-color: #f4f6f8;
		border-radius: 10rpx;
		border: solid 1rpx #e1e1e1;
		display: flex;
		align-items: center;
		padding-left: 10rpx;
		box-sizing: border-box;

		text {
			font-size: 28rpx;
			color: #333333;
			max-width: 500rpx;
			font-weight: bold;
		}
	}

	.corie {
		width: 14rpx;
		height: 14rpx;
		background-color: #ff8b58;
		border-radius: 100%;
		margin-right: 23rpx;
	}
}

.title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.close-btn {
	background-color: transparent;
	padding: 10rpx;
}

.list-content {
	height: calc(100% - 80rpx);
	padding: 10rpx 0;
}

.shop-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 30rpx;
	border-bottom: 1px solid #f5f5f5;
}

.shop-info {
	flex: 1;
}

.shop-name {
	font-size: 30rpx;
	color: #333;
	display: block;
	margin-bottom: 5rpx;
}

.shop-address {
	font-size: 24rpx;
	color: #666;
	display: block;
	margin-bottom: 5rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 500rpx;
}

.shop-distance {
	font-size: 22rpx;
	color: #007aff;
}

.list-btn {
	position: absolute;
	bottom: 30rpx;
	right: 30rpx;
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: #007aff;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 80;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
}

.search {
	width: 750rpx;
	// background: #fff;
}

.search-box {
	padding: 10rpx 30rpx 0;
	box-sizing: border-box;
}

.filter-bar {
	padding: 10rpx 30rpx;
	box-sizing: border-box;
	// display: flex;
	// flex-direction: row;
	// background-color: #fff;
	border-radius: 8px;
	position: relative;
}

.filter-item {
	// text-align: center;
	padding: 10px 0;

	.defText {
		font-size: 28rpx;
	}
}

.filter-ls {
	// flex: 1;
	// align-items: center;
	// justify-content: center;
}

.filter-wz {
	font-size: 28rpx;
}

.zhi {
	color: #999999;
	margin: 0 10rpx;
}

.down {
	margin-left: 6rpx;
	display: inline-block;
	padding-top: 5rpx;
}

.category {
	width: 750rpx;
	// min-height: 280rpx;
	background-color: #cab;
	position: absolute;
	top: 380rpx;
	left: 0;
	border-top: 1px solid #eee;
}

::v-deep .u-input {
	height: 50rpx;
	background-color: #f4f6fa;
	border: none;
}

.use-btn {
	position: absolute;
	right: 30rpx;
	top: 360rpx;
	font-size: 18rpx;
	background: #fff;
	padding: 10rpx;
	border-radius: 16rpx;
	align-items: center;

	.img {
		width: 40rpx;
		height: 40rpx;
		display: inline-block;
		margin-top: 5rpx;
	}
}

.location-title {
	width: 750rpx;
	height: 100rpx;
	background-color: #fff;
	border-radius: 36rpx 36rpx 0rpx 0rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.img {
		width: 25rpx;
		height: 25rpx;
	}
}

.location-list {
	overflow-y: scroll;
	width: 750rpx;
	background: #eff1f6;
	border-radius: 30rpx 30rpx 0px 0px;
	position: absolute;
	left: 0;
	bottom: 0;
}

.location-score {
	width: 750rpx;
	padding: 32rpx;
	box-sizing: border-box;
}

.gas-station-card {
	width: 686rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 15rpx 30rpx;
	box-sizing: border-box;
	background: #ffffff;
	border-radius: 30rpx;
	margin: 0 auto;
	margin-bottom: 20rpx;

	.gas-img {
		width: 160rpx;
		height: 140rpx;
		background: #ffffff;
		border-radius: 26rpx;
		border: 1px solid #dcdddf;
		display: flex;
		align-items: center;
		justify-content: center;

		.img {
			width: 100rpx;
			height: 100rpx;
		}
	}
}

.station-info {
	width: 440rpx;
	position: relative;
	display: flex;
	flex-direction: column;

	.img {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 20rpx;
		bottom: 0;
	}
}

/* 加油站名称：字体、加粗 */
.station-name {
	width: 440rpx;
	font-size: 32rpx;
	font-weight: bold;
	lines: 1;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

/* 距离和地址：字体、颜色 */
.station-distance {
	width: 440rpx;
	flex-direction: row;
	margin: 5px 0;
	flex: 1;

	/* 占据剩余空间 */
	.fontTetx {
		width: 300rpx;
		display: inline-block;
		font-size: 28rpx;
		color: #666;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		flex: 1;
		/* 占据剩余空间 */
	}
}

/* 优惠信息：背景、文字颜色、圆角、内边距 */
.station-discount {
	max-width: 160rpx;
	font-size: 24rpx;
	text-align: center;
	color: #f7523d;
	background-color: #fff2ea;
	/* 红色背景，可根据需求调整 */
	padding: 4rpx 12rpx;
	border-radius: 4px;
	display: inline-block;
	/* 改为 inline-block 更稳定 */
	white-space: nowrap;
	/* 防止文字换行 */
	flex-shrink: 0;
	/* 防止在 flex 布局中被压缩 */
}

.station-n {
	font-size: 28rpx;
	color: #ff9600;
	margin-right: 10rpx;
}
</style>
