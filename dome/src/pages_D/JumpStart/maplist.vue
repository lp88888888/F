<template>
	<view :data-theme="pageTheme">
		<!-- <cos-header title="换电充气查询" :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="90"></cos-header> -->
		<view class="container" :style="{ paddingTop: 0 + 'px' }">
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
				<up-navbar title="换电充气查询" :bgColor="backgroundColor" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
				<view class="search-box">
					<up-input placeholder="请输入关键字搜索" v-model="searchTex" shape="circle" height="35" @blur="inputConfirm">
						<template #prefix>
							<up-icon name="search" color="#000000" size="24"></up-icon>
						</template>
					</up-input>
				</view>
				<!-- 筛选栏 -->
				<view class="filter-bar">
					<view class="filter-item filter-ls" @click="categoryFun('1')">
						<text :class="[optionindex1 > 0 ? 'active' : '']">{{ textValue(1) }}</text>
						<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
					</view>
					<view class="filter-item filter-ls" @click="categoryFun('2')">
						<text :class="[optionindex2 > 0 ? 'active' : '']">{{ textValue(2) }}</text>
						<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
					</view>
					<view class="category" v-if="iscategory">
						<view v-if="typeIndex == '1'">
							<view
								:class="['labelBox', optionindex1 == index ? 'active' : '']"
								v-for="(item, index) in option1"
								:key="index"
								@click="cateChange(1, index)"
							>
								{{ item.val }}
							</view>
						</view>
						<view v-if="typeIndex == '2'">
							<view
								:class="['labelBox', optionindex2 == index ? 'active' : '']"
								v-for="(item, index) in option2"
								:key="index"
								@click="cateChange(2, index)"
							>
								{{ item.val }}
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 左边 -->
			<view class="use-btn" @click="handbtn('02')" v-if="!iscategory">
				<view>
					<image :src="icoUrl + 'dd-map-dw2.png'" class="img"></image>
					<view :class="showfuq == 2 ? 'active' : ''">换电</view>
				</view>
			</view>
			<view class="use-btn1" @click="handbtn('01')" v-if="!iscategory">
				<view>
					<image :src="icoUrl + 'dd-map-dw1.png'" class="img"></image>
					<view :class="showfuq == 2 ? 'active' : ''">充气</view>
				</view>
			</view>
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
				<view v-if="dataList.length == 0">
					<ser-empty></ser-empty>
				</view>
				<scroll-view :scroll-y="true" class="listView-scroll" @scrolltolower="scrolltolower">
					<view class="gas-station-card" v-for="(item, index) in dataList" :key="index">
						<!-- 左侧图标 -->
						<view class="box-1">
							<image :src="imgUrl + 'dadain-img.jpg'" class="img-bj"></image>
							<view class="box-1-left">
								<view class="box-1-left-1">
									<view class="box-1-left-sta"> 营业中 </view>
									<view class="box-1-left-name">
										{{ item.name }}
									</view>
								</view>
								<view class="box-1-left-2">
									<image :src="imgUrl + 'dd-time.png'" class="img-icon"></image>
									<text>营业时间｜08:00-23:00</text>
									<image :src="imgUrl + 'dd-list-jq.png'" style="margin-left: 30rpx" class="img-icon"> </image>
									<image :src="imgUrl + 'dd-list-jd.png'" class="img-icon"></image>
								</view>
								<view class="box-1-left-3">
									<view class="box-1-left-3-1">
										<image :src="imgUrl + 'jiayou-icon-map.png'" class="img-icon"></image>
										<text>{{ item.cityAreaName }}</text>
									</view>
									<text>距您{{ item.distance }}km</text>
								</view>
								<view class="box-1-left-4">
									<view class="box-1-left-4-item" v-for="(item1,index1) in changeData(item.chargingJson)" :key="index1">
										<text :style="{background: themeStore.themeColors.$badgeBgColor }">{{item1.name}}</text>
										<text>{{item1.value}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="box-2">
							<!-- <view class="box-2-bt">
								导航到店
							</view> -->
							<view class="box-2-bt" @click="openphone(item)"> 电话联系 </view>
							<view class="box-2-bt" @click="openmap(item)">
								导航到店
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<ser-CustomImageLoading :modelValue="loadingVisible" text="正在获取数据..." />
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getservicePoint } from '@/api/index';
import CosHeader from '@/components/customNavBar/index.vue';
import { showLoading, hideLoading, showToast, ID2, openAPPLocation } from '@/utils/util';
import { imgUrl } from '../../config';
import { makePhoneCall, openLocation } from '@/utils/util';
import QQMapWX from '../../common/qqmap-wx-jssdk.js';
import { onLoad } from '@dcloudio/uni-app';
import { getDrivingRoute, LatLng } from '@/utils/polyline';
import { toNav, toBack } from '@/utils/route';

// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);

const navBarHeight = ref(0);
const sysInfo = uni.getSystemInfoSync();
navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
const backgroundColor = ref<string>('transparent');
const pageType = ref();
const fontColor = ref<string>('#000');
const fixed = ref<boolean>(true);
const currentLat = ref<number>(34.22259);
const currentLng = ref<number>(108.94878);
const iscategory = ref<boolean>(false);
const isshow = ref<boolean>(true);
const loadingVisible = ref<boolean>(false);

const scale = ref(15);
const pageNum = ref(1);
const totalPage = ref(1); // 总分页
const total = ref(0);
const searchTex = ref<string>('');
const option1 = ref([
	{ key: '', val: '距离' },
	{ key: '10', val: '10km' },
	{ key: '20', val: '20km' },
	{ key: '30', val: '30km' },
]);
const optionindex1 = ref<number>(0);
const option2 = ref([
	{ key: '', val: '营业状态' },
	{ key: '1', val: '营业中' },
	{ key: '2', val: '关闭' },
	{ key: '3', val: '维护中' },
]);
const optionindex2 = ref<number>(0);

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
onLoad(() => {
	currentLat.value = uni.getStorageSync('address').lat;
	currentLng.value = uni.getStorageSync('address').lng;
	initMap();
});
const handleTouchMove = (e) => {
	if (!isDragging.value) return;

	currentY.value = e.touches[0].clientY;
	const deltaY = startY.value - currentY.value;

	// 阻止默认的滚动行为
	e.preventDefault();
};

// 处理项目价格数据
const changeData = (arr) => {
	if( !arr ) return [];
	let arrs = JSON.parse(arr)
	return arrs.slice(0, 2)
}

// 拨打电话
const openphone = (item) => {
	makePhoneCall(item.contactPhone)
	
};

// 布局
	const openmap = (item) => {
		//  #ifdef APP
		openAPPLocation({
			endLocation: {
				"longitude": item.longitude,
				"latitude": item.latitude,
				"address": item.name
			}
		})
		// #endif
		// #ifdef MP-WEIXIN 
		openLocation({
			latitude: Number(item.latitude),//维度
			longitude: Number(item.longitude),//经度
			scale: 18,//缩放比例，范围5~18，默认为18
			name: item.name,
		})
		// #endif

	}

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
			if (optionindex1.value == 0) return '距离';
			else return option1.value[optionindex1.value].val;
		}
		if (type == 2) {
			if (optionindex2.value == 0) return '营业状态';
			else return option2.value[optionindex2.value].val;
		}
	};
});
// 初始化地图
const initMap = async () => {
	currentLat.value = uni.getStorageSync('address').lat;
	currentLng.value = uni.getStorageSync('address').lng;
	init();
};
const inputConfirm = (event) => {
	dataList.value = []; // 清空旧数据
	getList();
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
const handbtn = (e) => {
	tabIndex.value = e;
	init();
};

const tabIndex = ref<string>('');
const getList = async (lat, lon) => {
	loadingVisible.value = true;
	var params = {
		name: searchTex.value,
		serviceScope: tabIndex.value,
		longitude: uni.getStorageSync('address').lng,
		latitude: uni.getStorageSync('address').lat,
		status: option2.value[optionindex2.value].key,
		distance: option1.value[optionindex1.value].key,
	};
	try {
		let res: any = await getservicePoint(params);
		if (res.rows.length) {
			let hasList = res.rows;
			total.value = res.total;
			totalPage.value = Math.ceil(res.total / 50);
			dataList.value = hasList;
			markers.value = hasList.map((item, index) => {
				// item.stationId = item.stationId
				// item.zIndex = 2
				// item.id = ID2(10)
				item.width = '27';
				item.height = '32';
				// item.latitude = Number(item.latitude)
				// item.longitude = Number(item.longitude)
				// item.iconPath = imgUrl + 'static/' + (item.merType == '01' ? 'oil' : 'gas') + '-map-icon.png'
				if (item.routeDirectionCode == 1) {
					item.iconPath = imgUrl + 'dadian-icon.png';
				} else {
					item.iconPath = imgUrl + 'chongqi-icon.png';
				}
				return item;
			});
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
		optionindex1.value = index;
	}
	if (type == 2) {
		optionindex2.value = index;
	}
	inputConfirm();
	iscategory.value = false;
};
// 标记点点击事件
const handleMarkerTap = (event) => {
	var makerId = event.detail.markerId;
	var filterMaker = dataList.value.filter((item) => item.id == makerId)[0];
	uni.setStorageSync('k1yMerInfo', filterMaker);
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
onMounted(() => {});
//地图
const goMap1 = (item) => {
	console.log(item);
	openLocation({
		latitude: Number(item.merchantLat), //维度
		longitude: Number(item.merchantLon), //经度
		scale: 18, //缩放比例，范围5~18，默认为18
		name: item.merchantName,
	});
};
</script>

<style scoped lang="scss">
.box-1 {
	display: flex;

	.img-bj {
		width: 136rpx;
		height: 136rpx;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin-right: 20rpx;
	}

	.box-1-left {
		flex: 1 0;
		width: 0;
		display: flex;
		flex-direction: column;

		.box-1-left-1 {
			display: flex;
			align-items: center;
			font-weight: 500;
			font-size: 28rpx;
			color: #333333;

			.box-1-left-sta {
				font-weight: 500;
				font-size: 20rpx;
				color: #00bebe;
				background: #eaffff;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				border: 2rpx solid #47dfda;
				width: 70rpx;
				height: 32rpx;
				line-height: 32rpx;
				text-align: center;
				margin-right: 20rpx;
			}

			.box-1-left-name {
				font-weight: 500;
				font-size: 32rpx;
				color: #333333;
			}
		}

		.box-1-left-2 {
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
			display: flex;
			align-items: center;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}

		.box-1-left-3 {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-weight: 400;
			font-size: 24rpx;
			color: #333333;

			.box-1-left-3-1 {
				font-weight: 400;
				font-size: 24rpx;
				color: #666666;
				display: flex;
				align-items: center;
			}
		}
		.box-1-left-4{
			width: 100%;
			margin-top: 20rpx;
			.box-1-left-4-item{
				width: 100%;
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;
				text:nth-child(1){
					font-size: 24rpx;
					padding: 5rpx 10rpx;
					box-sizing: border-box;
					color: var(--primary-color);
					margin-right: 10rpx;
					word-break: keep-all;
				}
				text:nth-child(2){
					flex: 1 0;
					width: 0;
					font-size: 24rpx;
					color: #a0a0a0;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					
				}
			}
			.box-1-left-4-item:last-child{
				margin-bottom: 0;
			}
		}
	}
}

.box-2 {
	display: flex;
	align-items: center;
	flex-direction: row-reverse;
	margin-top: 40rpx;

	.box-2-bt {
		width: 160rpx;
		height: 56rpx;
		background: #ffffff;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		border: 2rpx solid var(--primary-color);
		font-weight: 500;
		font-size: 28rpx;
		color: var(--primary-color);
		line-height: 56rpx;
		text-align: center;
		margin-right: 30rpx;
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
	background: #f8f9fb;
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
	color: #ff9000;
}

.labelBox {
	padding: 25rpx 32rpx;
	box-sizing: border-box;
	font-size: 28rpx;
}

.activeLabel {
	color: #ff9000;
}

.container {
	width: 100%;
	height: 100vh;
	box-sizing: border-box;
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
	width: 100%;
	background: var(--head-color);
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, 0);
	// opacity: 1;
}

.search-box {
	padding: 10rpx 30rpx 0;
	box-sizing: border-box;
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
	top: 30%;
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

.use-btn1 {
	position: absolute;
	right: 30rpx;
	top: 40%;
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
	color: #ff9600;
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
	border: 2rpx solid #ff9600;
	color: #ff9600;
	text-align: center;
	line-height: 32rpx;
	font-size: 22rpx;
}
</style>
