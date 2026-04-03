<template>
	<!-- <cos-header title="加油" :background-color="themeStore.themeColors.$pageBBgColor" :font-color="fontColor" :fixed="fixed" :defaultNavBarheight="100"></cos-header> -->
	<view class="container" :data-theme="pageTheme">
		<!-- 地图组件 -->
		<map
			:latitude="currentLat"
			:longitude="currentLng"
			v-if="currentLat"
			:markers="markers"
			@markertap="handleMarkerTap"
			:scale="scale"
			class="map"
		></map>
		<!-- 搜索 -->
		<view class="search">
			<u-sticky bgColor="transparent" z-index="99999">
				<view class="searchView">
					<up-navbar title="加油" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
				</view>
			</u-sticky>
			<view class="search-box">
				<up-input placeholder="请输入关键字搜索" v-model="searchTex" shape="circle" height="35" @confirm="inputConfirm">
					<template #prefix>
						<up-icon name="search" color="#000000" size="24"></up-icon>
					</template>
				</up-input>
				<view class="search-txt" @click="togodingdan">
					<image :src="imgUrl + 'img/fuqicon.png'" class="search-img"></image>
					<view>订单</view>
				</view>
			</view>
			<!-- 筛选栏 -->
			<view class="filter-bar">
				<view class="filter-item filter-ls" @click="categoryFun('1')">
					<text :class="[merIndex > 0 ? 'active' : '']">{{ textValue(1) }}</text>
					<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
				</view>
				<view class="filter-item filter-ls" @click="categoryFun('4')">
					<text :class="[jiageindex > 0 ? 'active' : '']">{{ textValue(4) }}</text>
					<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
				</view>
				<view class="filter-item filter-ls" @click="categoryFun('2')">
					<text :class="[gasolineIndex > 0 ? 'active' : '']">{{ textValue(2) }}</text>
					<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
				</view>
				<view class="filter-item filter-ls" @click="categoryFun('3')">
					<text :class="[loadIndex > 0 ? 'active' : '']">{{ textValue(3) }}</text>
					<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
				</view>

				<view class="category" v-if="iscategory">
					<view v-if="typeIndex == '1'">
						<view
							:class="['labelBox', merIndex == index ? 'active' : '']"
							v-for="(item, index) in merTypes"
							:key="index"
							@click="cateChange(1, index)"
							>{{ item.val }}</view
						>
					</view>
					<view v-if="typeIndex == '2'">
						<view
							:class="['labelBox', gasolineIndex == index ? 'active' : '']"
							v-for="(item, index) in gasolineTypes"
							:key="index"
							@click="cateChange(2, index)"
						>
							{{ item.val }}
						</view>
					</view>
					<view v-if="typeIndex == '3'">
						<view
							:class="['labelBox', loadIndex == index ? 'active' : '']"
							v-for="(item, index) in loadTypes"
							:key="index"
							@click="cateChange(3, index)"
							>{{ item.val }}
						</view>
					</view>
					<view v-if="typeIndex == '4'">
						<view
							:class="['labelBox', loadIndex == index ? 'active' : '']"
							v-for="(item, index) in jiagetype"
							:key="index"
							@click="cateChange(4, index)"
							>{{ item.val }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 左边 -->
		<!-- <view class="use-btn" @click="togoorder" v-if="!iscategory">
			<view >
				<image :src="imgUrl + 'img/fuqicon.png'" class="img"></image>
				<view :class="showfuq==2?'active':''">我的订单</view>
			</view>
		</view> -->
		<!-- 列表底部弹窗 -->
		<!-- <view class="location-list" v-if="isshow">
			<view class="location-title">
				<view>已为您查询到{{total}}条信息内容</view>
				
			</view>
			
			
		</view> -->
		<view class="listView" :style="{ height: boxHeight + 'rpx' }">
			<view class="line_head" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
				<view class="line-heng"> </view>
			</view>
			<scroll-view :scroll-y="true" class="listView-scroll" @scrolltolower="scrolltolower">
				<template v-if="dataList.length">
					<view class="gas-station-card" v-for="(item, index) in dataList" :key="index" @click="oildetailsFun(item)">
						<!-- 左侧图标 -->
						<view class="gas-img">
							<image v-if="item.logo" :src="item.logo" class="img"></image>
							<image v-else :src="imgUrl + 'yq-zgsy.png'" class="img"></image>
							<view class="station-info">
								<text class="station-name">{{ item.stationName }}</text>
								<view style="display: flex; align-items: center; margin: 16rpx 0">
									<view class="yinyesta"> 营业中 </view>
									<text style="font-size: 24rpx; color: #666666">距您{{ item.straightLineDistance }}</text>
								</view>
								<text class="station-discount"
									>{{ item.odsGasStationOilPriceVoList[0].oilName
									}}<text style="color: #ed1c24; font-weight: 600; font-size: 28rpx; margin-left: 20rpx"
										>{{ item.odsGasStationOilPriceVoList[0].price }}元/L</text
									>
								</text>
							</view>
						</view>
						<view style="display: flex; align-items: center; justify-content: space-between; margin-top: 20rpx">
							<view style="display: flex; align-items: center">
								<image :src="imgUrl + 'jiayou-icon-map.png'" class="img-icon"></image>
								<view class="code-foot-1">{{ item.address }}</view>
							</view>
							<view @click.stop="goMap1(item)" style="display: flex; align-items: center">
								<image :src="imgUrl + 'jiayou-icon-dao.png'" class="img-icon"></image>
								<view class="code-foot-2">导航</view>
							</view>
						</view>
					</view>
				</template>
				<ser-empty v-else></ser-empty>
			</scroll-view>
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
		<!-- <up-overlay :show="show" @click="show = false">
			<view class="warp">
				<view class="text-1">提示</view>
				<view class="text-2">真实数据对接中</view>
				<view style="display: flex;align-items: center;justify-content: center;">
					<view class="bnt-1" @click="show = false">取消</view>
				</view>
			</view>
		</up-overlay> -->
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getKycMerchantInfoList } from '@/api/index';
import { getDict } from '@/api/config';
import CosHeader from '@/components/customNavBar/index.vue';
import { showLoading, hideLoading, showToast, ID2, openLocation } from '@/utils/util';
import { imgUrl } from '../../config';
import { toNav, toBack } from '@/utils/route';
import QQMapWX from '../../common/qqmap-wx-jssdk.js';
import { getDrivingRoute, LatLng } from '@/utils/polyline';
import theme from '@/utils/theme';
const navBarHeight = ref(0);
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const sysInfo = uni.getSystemInfoSync();
navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
const backgroundColor = ref<string>('#D1E5F9');
const pageType = ref();
const fontColor = ref<string>('#000');
const fixed = ref<boolean>(true);
const loadingVisible = ref<boolean>(true);

const currentLat = ref(uni.getStorageSync('address').lat);
const currentLng = ref(uni.getStorageSync('address').lng);
const iscategory = ref<boolean>(false);
const isshow = ref<boolean>(true);
const show = ref<boolean>(false);
const scale = ref(15);
const pageNum = ref(1);
const totalPage = ref(1); // 总分页
const total = ref(0);
const searchTex = ref<string>('');
const merTypes = ref([
	{ key: '', val: '全部' },
	{ key: '10', val: '10km' },
	{ key: '30', val: '30km' },
	{ key: '50', val: '50km' },
]);
const merIndex = ref<number>(0);
const loadTypes = ref([
	{ key: '', val: '全部' },
	{ key: '0', val: '其他' },
	{ key: '1', val: '中国石油' },
	{ key: '1', val: '中国石化' },
	{ key: '1', val: '壳牌' },
]);
const loadIndex = ref<number>(0);
const gasolineTypes = ref([
	{ key: '', val: '全部' },
	{ key: '1', val: '92#汽油' },
	{ key: '2', val: '95#汽油' },
	{ key: '3', val: '0#柴油' },
	{ key: '4', val: '98#汽油' },
]);
const gasolineIndex = ref<number>(0);
const jiagetype = ref([
	{ key: '', val: '默认排序' },
	{ key: 'true', val: '从低到高' },
]);
const jiageindex = ref<number>(0);
const markers = ref([]);
const dataList = ref([]);
const typeIndex = ref('');

const boxElement = ref(null);
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
		boxHeight.value = 1200;
	}
	// 下滑超过50px，切换到600px
	else if (deltaY < -50 && boxHeight.value === 1200) {
		boxHeight.value = 600;
	}
	isDragging.value = false;
};

const gettypelist = async () => {
	let res = await getDict('oil_type');
};
const goMap1 = (item) => {
	console.log();
	openLocation({
		latitude: Number(item.latitude), //维度
		longitude: Number(item.longitude), //经度
		scale: 18, //缩放比例，范围5~18，默认为18
		name: item?.stationName,
	});
};

const isnavigation = ref(false);
const selectedLocation = ref(null);
const qqmapsdk = new QQMapWX({
	key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB', // 请替换为你的腾讯地图key
});

const togoorder = () => {
	uni.navigateTo({
		url: '/pages_D/refuelingRefilling/order',
	});
};
const textValue = computed(() => {
	return (type) => {
		if (type == 1) {
			if (merIndex.value == 0) return '距离排序';
			else return merTypes.value[merIndex.value].val;
		}
		if (type == 2) {
			if (gasolineIndex.value == 0) return '类型';
			else return gasolineTypes.value[gasolineIndex.value].val;
		}
		if (type == 3) {
			if (loadIndex.value == 0) return '品牌';
			else return loadTypes.value[loadIndex.value].val;
		}
		if (type == 4) {
			if (jiageindex.value == 0) return '价格排序';
			else return jiagetype.value[jiageindex.value].val;
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
		currentLat.value = uni.getStorageSync('address').lat;
		currentLng.value = uni.getStorageSync('address').lng;
		init();
	} catch (err) {}
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
const togodingdan = () => {
	uni.navigateTo({
		url: '/pages_D/refuelingRefilling/order',
	});
};
/**
 * 获取油气商户列表
 */
const getList = async (lat, lon) => {
	var that = this;
	var params = {
		pageNum: pageNum.value,
		pageSize: 50,
		longitude: uni.getStorageSync('address').lng,
		latitude: uni.getStorageSync('address').lat,
		brand: loadTypes.value[loadIndex.value].key,
		oilId: gasolineTypes.value[gasolineIndex.value].key,
		scope: merTypes.value[merIndex.value].key,
		priceSort: jiagetype.value[jiageindex.value].key,
		stationName: searchTex.value ? searchTex.value : '',
	};
	showLoading();
	// merchantLocationType  01非高速  02高速
	// merType  01加油  02加气
	try {
		let res: any = await getKycMerchantInfoList(params);
		if (res.data.list.length) {
			let hasList = res.data.list;
			total.value = res.data.total;
			totalPage.value = Math.ceil(res.data.total / 50);
			if (pageNum.value == 1) {
				dataList.value = hasList;
				markers.value = hasList.map((item, index) => {
					item.stationId = item.stationId;
					item.zIndex = 2;
					item.id = ID2(10);
					item.width = '27';
					item.height = '32';
					item.latitude = Number(item.latitude);
					item.longitude = Number(item.longitude);
					item.iconPath = imgUrl + 'static/jy-icon.png';
					return item;
				});
			} else {
				dataList.value = [...dataList.value, ...hasList];
				markers.value = [
					...markers.value,
					...hasList.map((item, index) => {
						item.stationId = item.stationId;
						item.zIndex = 2;
						item.id = ID2(10);
						item.width = '27';
						item.height = '32';
						item.latitude = Number(item.latitude);
						item.longitude = Number(item.longitude);
						item.iconPath = imgUrl + 'static/jy-icon.png';
						return item;
					}),
				];
			}
			scale.value = scale.value > 9 ? 9 : scale.value;
		}
		loadingVisible.value = false;
		hideLoading();
		// uni.stopPullDownRefresh()
	} catch (err) {
		loadingVisible.value = false;
		hideLoading();
		// uni.stopPullDownRefresh()
		showToast(err);
	}
};
const categoryFun = (type) => {
	typeIndex.value = type;
	boxHeight.value = 600;
	iscategory.value = !iscategory.value;
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
	if (type == 4) {
		jiageindex.value = index;
	}
	iscategory.value = false;
	init();
};

// 标记点点击事件
const handleMarkerTap = (event) => {
	var makerId = event.detail.markerId;
	var filterMaker = dataList.value.filter((item) => item.id == makerId)[0];
	uni.setStorageSync('k1yMerInfo', filterMaker);
	uni.navigateTo({
		url: '/pages_D/refuelingRefilling/details?merId=' + filterMaker.stationId + (pageType.value == 'check' ? '&type=check' : ''),
	});
};
const oildetailsFun = (item) => {
	uni.setStorageSync('k1yMerInfo', item);
	uni.navigateTo({
		url: '/pages_D/refuelingRefilling/details?merId=' + item.stationId + (pageType.value == 'check' ? '&type=check' : ''),
	});
};
const scrolltolower = (event) => {
	console.log('--------触底加载分页----------');
	console.log(event);
	if (totalPage.value > pageNum.value) {
		pageNum.value++;
		getList(currentLat.value, currentLng.value);
	}
};
// 页面加载时初始化地图
onMounted(() => {
	initMap();
	// gettypelist()
});
//地图
</script>

<style scoped lang="scss">
.searchView {
	// background: var(--head-color);
}

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

.code-foot-1 {
	width: 400rpx;
	font-weight: 400;
	font-size: 24rpx;
	color: #333333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.code-foot-1 {
	font-weight: 400;
	font-size: 24rpx;
	color: #333333;
}

.img-icon {
	width: 28rpx;
	height: 28rpx;
	margin-right: 20rpx;
}

.listView {
	width: 100%;
	background-color: #f8f9fb;
	border-radius: 40rpx 40rpx 0rpx 0rpx;
	padding-top: 0;
	padding-left: 30rpx;
	padding-right: 30rpx;
	z-index: 999;
	transition: height 0.3s ease;
	position: absolute;
	bottom: 0;
	left: 0;
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

.active {
	color: var(--primary-color);
}

.labelBox {
	padding: 25rpx 32rpx;
	box-sizing: border-box;
	font-size: 28rpx;
}

.activeLabel {
	color: var(--primary-color);
}

.container {
	width: 100%;
	height: 100vh;
	box-sizing: border-box;
	background-color: var(--head-color);
}

.map {
	width: 100%;
	height: 100%;
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
		background-color: var(--primary-color);
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
	width: 100%;
	background: var(--linear-color);
	position: absolute;
	top: 0rpx;
	left: 50%;
	transform: translate(-50%, 0);
	opacity: 0.9;
}

.search-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx 0;
	box-sizing: border-box;
}

.search-txt {
	width: 88rpx;
	height: 84rpx;
	background: rgba(255, 255, 255, 0.6);
	border-radius: 12rpx 12rpx 12rpx 12rpx;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	margin-left: 60rpx;

	.search-img {
		width: 30rpx;
		height: 32rpx;
		margin-bottom: 10rpx;
		margin-top: 10rpx;
	}
}

.filter-bar {
	padding: 10rpx 30rpx;
	box-sizing: border-box;
	display: flex;
	border-radius: 8px;
	position: relative;
}

.filter-item {
	display: flex;
	text-align: center;
	padding: 10px 0;
	font-size: 14px;
}

.filter-ls {
	flex: 1;
	align-items: center;
	justify-content: center;
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
	width: 100%;
	min-height: 280rpx;
	background-color: #fff;
	position: absolute;
	top: 80rpx;
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
	top: 25%;
	font-size: 18rpx;
	background: #fff;
	padding: 10rpx;
	border-radius: 16rpx;
	text-align: center;

	.img {
		width: 40rpx;
		height: 40rpx;
		display: inline-block;
		margin-top: 5rpx;
	}
}

.location-title {
	width: 100%;
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
	width: 100%;
	height: 600rpx;
	overflow: hidden;
	position: fixed;
	bottom: 0;
	left: 0;
	transition: transform 0.3s ease;
	z-index: 90;
	background: #eff1f6;
	background-blend-mode: normal, normal;
	border-radius: 30rpx 30rpx 0px 0px;
}

.location-score {
	height: 500rpx;
	overflow-x: scroll;
}

.gas-station-card {
	padding: 15px 30rpx;
	background: #ffffff;
	border-radius: 30rpx;
	margin: 20rpx auto;
	gap: 30rpx;

	.gas-img {
		display: flex;
		align-items: center;

		.img {
			width: 132rpx;
			height: 132rpx;
			margin-right: 30rpx;
		}
	}
}

/* 左侧图标：控制尺寸 */
.station-icon {
	width: 50px;
	height: 50px;
	margin-right: 10px;
}

/* 加油站名称：字体、加粗 */
.station-name {
	font-size: 16px;
	font-weight: bold;
	display: block;
	/* 独占一行 */
	margin-bottom: 5px;

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* 距离和地址：字体、颜色 */
.station-distance {
	width: 440rpx;
	font-size: 28rpx;
	color: #666;
	display: block;
	margin: 5px 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* 优惠信息：背景、文字颜色、圆角、内边距 */
.station-discount {
	font-weight: 500;
	font-size: 24rpx;
	color: #333333;
	font-weight: 500;
}

.station-n {
	color: var(--primary-color);
	margin-right: 10rpx;
}

.station-info {
	width: 400rpx;
}

.yinyesta {
	width: 70rpx;
	height: 32rpx;
	background: #eaffff;
	border-radius: 8rpx 8rpx 8rpx 8rpx;
	border: 2rpx solid #47dfda;
	color: #47dfda;
	text-align: center;
	line-height: 32rpx;
	font-size: 22rpx;
	margin-right: 10rpx;
}

.yinyetb {
	width: 70rpx;
	height: 32rpx;
	background: #fff2ea;
	border-radius: 8rpx 8rpx 8rpx 8rpx;
	border: 2rpx solid var(--primary-color);
	color: var(--primary-color);
	text-align: center;
	line-height: 32rpx;
	font-size: 22rpx;
}
</style>
