<template>
	<!-- <cos-header title="收费站" :background-color="themeStore.themeColors.$pageBBgColor" :font-color="fontColor"
		:fixed="fixed" :defaultNavBarheight="100"></cos-header> -->
	<view class="container" :data-theme="pageTheme">
		<!-- 地图组件 -->

		<map :latitude="currentLat" :longitude="currentLng" v-if="currentLat" :markers="markers" :scale="scale"
			class="map"></map>
		<!-- 搜索 -->
		<view class="search">
			<u-sticky bgColor="transparent" z-index="99999">
				<view class="searchView">
					<up-navbar title="收费站" bgColor="transparent" @leftClick="toBack" placeholder
						:fixed="true"></up-navbar>
				</view>
			</u-sticky>
			<view class="search-box">
				<up-input placeholder="请输入关键字搜索" v-model="searchTex" shape="circle" height="35" @blur="inputConfirm">
					<template #prefix>
						<up-icon name="search" color="#000000" size="24"></up-icon>
					</template>
				</up-input>
				<view class="search-bnt" @click="inputConfirm">搜索</view>
			</view>
			<!-- 筛选栏 -->
			<view class="filter-bar">
				<view class="filter-item filter-ls" @click="categoryFun('1')">
					<text :class="[merIndex > 0 ? 'active' : '']">{{ textValue(1) }}</text>
					<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
				</view>
				<!-- 	<view class="filter-item  filter-ls" @click="categoryFun('4')">
					<text :class="[jiageindex > 0?'active':'']">{{textValue(4)}}</text>
					<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
				</view>
				<view class="filter-item  filter-ls" @click="categoryFun('2')">
					<text :class="[gasolineIndex > 0?'active':'']">{{textValue(2)}}</text>
					<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
				</view>
				<view class="filter-item  filter-ls" @click="categoryFun('3')">
					<text :class="[loadIndex > 0?'active':'']">{{textValue(3)}}</text>
					<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
				</view> -->

				<view class="category" v-if="iscategory">
					<view v-if="typeIndex == '1'">
						<view :class="['labelBox', merIndex == index ? 'active' : '']" v-for="(item, index) in merTypes"
							:key="index" @click="cateChange(1, index)">{{ item.val }}</view>
					</view>
					<!-- 	<view v-if="typeIndex == '2'">
						<view :class="['labelBox',gasolineIndex == index?'active':'']"
							v-for="(item,index) in gasolineTypes" :key="index" @click="cateChange(2,index)">{{item.val}}
						</view>
					</view>
					<view v-if="typeIndex == '3'">
						<view :class="['labelBox',loadIndex == index?'active':'']" v-for="(item,index) in loadTypes"
							:key="index" @click="cateChange(3,index)">{{item.val}}</view>
					</view>
					<view v-if="typeIndex == '4'">
						<view :class="['labelBox',loadIndex == index?'active':'']" v-for="(item,index) in jiagetype"
							:key="index" @click="cateChange(4,index)">{{item.val}}</view>
					</view> -->
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
			<view class="line_head" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
				@touchend="handleTouchEnd">
				<view class="line-heng"> </view>
			</view>
			<scroll-view :scroll-y="true" class="listView-scroll" @scrolltolower="scrolltolower">
				<view class="card-container" v-for="(item, index) in dataList" :key="index" @click.stop="item.operationalStatus === '05' ? showPopFn(index, item) : ''">
				    <!-- <view class="top-right-badge" v-if="serviceScopeShow(item.serviceScope,'20')">
				      <text class="top-badge-text">综合</text>
				      <text class="top-badge-text">服务</text>
				    </view> -->
					<image class="top-right-badge" v-if="serviceScopeShow(item.serviceScope,'20')" :src="imgUrl+'static/static-iocn-zh.png'" lazy-load mode=""></image>
				    <view class="main-content">
				      <view class="image-wrapper">
				        <image 
				          class="station-image" 
				          :src="item.tollStationImg || `${imgUrl}service-list-default.png`" 
				          mode="aspectFill"
						  lazy-load
				        ></image>
				       <view class="status-badge green" v-if="item.operationalStatus === '01'">
				        	<text class="status-text">正常</text>
				        </view>
				        <view class="status-badge gray" v-if="item.operationalStatus === '02'">
				        	<text class="status-text">关闭</text>
				        </view>
				        <view class="status-badge halfClose" v-if="item.operationalStatus === '05'">
				        	<text class="status-text">管制</text>
				        </view>
				        <view class="status-badge halfClose" v-if="item.operationalStatus === '03'">
				        	<text class="status-text">入口关闭，出口正常</text>
				        </view>
				        <view class="status-badge halfClose" v-if="item.operationalStatus === '04'">
				        	<text class="status-text">入口正常，出口关闭</text>
				        </view>
				      </view>
				
				      <view class="info-area">
				        <view class="title-row">
				          <text class="title">{{item.tollStationName}}</text>
				          <text class="distance">{{item.distance || '0km'}}</text>
				        </view>
						<view class="stats-row" >
						  <text class="stat-text" style="margin-right: 14rpx;" v-for="(enl,inx) in laneInfoList(item.laneInfo)">{{enl.name}} | {{enl.value}}</text>
						</view>
				        <view class="tags-row">
				          <view class="hollow-tag" v-if="serviceScopeShow(item.serviceScope,'18')">
				            <text class="hollow-tag-text">可办理ETC</text>
				          </view>
				          <view class="hollow-tag" v-if="serviceScopeShow(item.serviceScope,'19')">
				            <text class="hollow-tag-text">绕城包年</text>
				          </view>
				          <view class="hollow-tag" v-if="item.volumePricingFlag == 1">
				            <text class="hollow-tag-text">以量定价</text>
				          </view>
				        </view>
				      </view>
					  <view class="jc-text" @click="path(item)" v-if="item.allowCorrectionFlag==true">纠错</view>
				    </view>
				    <view class="bottom-area">
				      <text class="address-text texNoWrap">{{ item.tollStationAddress }}</text>
				      <view class="nav-button" @click.stop="openAdd(item)">
				        <up-icon :name="imgUrl+'static/station-dh-icon.png'" size="32rpx" color="#666"></up-icon>
				        <text class="nav-text">导航</text>
				      </view>
				    </view>
				    
				  </view>
				<!-- <view
					class="s-view"
					v-for="(item, index) in dataList"
					:key="index"
					@click.stop="item.operationalStatus === '05' ? showPopFn(index, item) : ''"
				>
					<view class="cont">
						<image class="image" :src="item.tollStationImg || `${imgUrl}service-list-default.png`"
							lazy-load />
						<view>
							<view class="texNoWrap"
								:style="{ marginBottom: !item.detailList || item.detailList.length === 0 ? '36rpx' : '' }">
								{{ item.tollStationName }}
							</view>
							<view class="texNoWrap" :style="{ margin: !item.detailList ? '0' : '' }">
								{{ item.tollStationAddress }}
							</view>
							<view v-if="item.detailList && item.detailList.length > 0">
								<image v-for="(subItem, index2) in item.detailList" :key="index2"
									:src="subItem.serviceInfoPicUrl" />
							</view>
						</view>
						<view class="map-icon">
							<image @click.stop="openAdd(item)" :src="`${imgUrl}go-map-icon-new.png`" />
							<view>{{ item.distance || '0km' }}</view>
							<view class="btnDetail" style="display:flex;align-items: center;"
								v-if="item.operationalStatus === '05'">管制详情<up-icon name="arrow-right" color="#333"
									size="14"></up-icon></view>
						</view>
						<view class="status green" v-if="item.operationalStatus === '01'">正常</view>
						<view class="status gray" v-if="item.operationalStatus === '02'">关闭</view>
						<view class="status" v-if="item.operationalStatus === '05'">管制</view>
						<view class="status halfClose" v-if="item.operationalStatus === '03'">入口关闭，出口正常</view>
						<view class="status halfClose" v-if="item.operationalStatus === '04'">入口正常，出口关闭</view>
					</view>
				</view> -->
				<ser-empty v-if="!dataList.length"></ser-empty>
			</scroll-view>
		</view>
		<view class="mask" v-if="showPop" @click="closePop" @touchmove.prevent="closePop">
			<view class="pop" @click.stop>
				<view class="rowCon">
					<img class="popImg"
						:src="clickItem.tollStationImg || `${imgUrl}/wximage/trip-pro/toll-list-default.png`" />
					<view class="colCon flex flex-col" style="flex: 1">
						<view class="texNoWrap">
							<span class="fs-32 col3 fw-b">{{ clickItem.tollStationName }}</span>
							<span class="tex24_red">{{ clickItem.operationalStatus === '05' ? '(管制)' : '' }}</span>
						</view>
						<view class="texNoWrap fs-24 col6" style="margin-top: 20rpx">{{ clickItem.tollStationAddress }}
						</view>
					</view>
					<view class="map-icon" @click.stop="openAdd(clickItem)">
						<img :src="`${imgUrl}go-map-icon-new.png`" />
						<view>{{ clickItem.distance || '0km' }}</view>
					</view>
				</view>
				<view class="popDes">{{ clickItem.eventDesc || '暂无描述' }}</view>
				<view class="correct-btn"
					@click.stop="goCorrect(clickItem.ids, clickItem.tollStationName, clickItem.operationalStatus)">
					<view>路况纠错</view>
					<view>
						<img :src="`${imgUrl}intel-map-correct.png`" />
						<span class="btn-num">+{{ clickItem.correctionIntegral }}</span>
					</view>
				</view>
			</view>
		</view>
		<ser-CustomImageLoading :modelValue="loadingVisible" text="正在获取数据..." />
		<PageDurationTracker pageName="收费站" type='count'/>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import { checkDistanceRequirement, getgetTollStationByIdList } from '@/api/map';
	import { getDict } from '@/api/config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { showLoading, hideLoading, showToast, ID2, openAPPLocation, openLocation,CurrentPage } from '@/utils/util';
	const systemInfo = uni.getSystemInfoSync();
	import { toNav, toBack } from '@/utils/route';
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin';
	const isApp = systemInfo.uniPlatform === 'app';
	import { imgUrl } from '../../config';
	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	import theme from '@/utils/theme';
	const navBarHeight = ref(0);
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	const backgroundColor = ref<string>('#D1E5F9');
	const pageType = ref();
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const currentLat = ref(uni.getStorageSync('address').lat);
	const currentLng = ref(uni.getStorageSync('address').lng);
	const iscategory = ref<boolean>(false);
	const isshow = ref<boolean>(true);
	const loadingVisible = ref(false);
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const scale = ref(15);
	const pageNum = ref(1);
	const totalPage = ref(1); // 总分页
	const total = ref(0);
	const searchTex = ref<string>('');
	const merTypes = ref([
		{ key: '', val: '全部' },
		{ key: '01', val: '正常' },
		{ key: '02', val: '关闭' },
		// { key: '03', val: '入口关闭，出口正常' },
		// { key: '04', val: '入口正常，出口关闭' },
		{ key: '05', val: '管制' },
	]);
	
	const serviceScopeShow = computed(()=>{
		return (scope,value)=>{
			let isShow = false
			if(scope){
				if(scope.indexOf(value) != -1){
					isShow = true
				}
			}
			return isShow
		}
	})
	const laneInfoList = computed(()=>{
		return (laneInfo)=>{
			if(laneInfo){
				return JSON.parse(laneInfo)
			}
			return []
		}
	}) 
	
	
	const merIndex = ref<number>(0);
	import { useAppStore } from '@/store/modules/app';
	const appStore = useAppStore();
	// const isLogin = ref(appStore.checkLogin());
	const isLogin = computed(() => {
		return appStore.checkLogin();
	});
	// const loadTypes = ref([{ key: '', val: '全部' }, { key: '0', val: '其他' }, { key: '1', val: '中国石油' }, { key: '1', val: '中国石化' }, { key: '1', val: '壳牌' }]);
	// const loadIndex = ref<number>(0);
	// const gasolineTypes = ref([{ key: '', val: '全部' }, { key: '1', val: '92#' }, { key: '2', val: '95#' }, { key: '4', val: '98#' }]);
	// const gasolineIndex = ref<number>(0);
	// const jiagetype = ref([{ key: '', val: '默认排序' },{ key: 'true', val: '从低到高' }]);
	// const jiageindex = ref<number>(0);
	const markers = ref([]);
	const dataList = ref([]);
	const typeIndex = ref('');
	const showPop = ref(false);
	const clickItem = ref<TollStation>({} as TollStation);
	const boxElement = ref(null);
	const boxHeight = ref(600); // 初始高度
	const startY = ref(0);
	const currentY = ref(0);
	const isDragging = ref(false);

	const handleTouchStart = (e) => {
		startY.value = e.touches[0].clientY;
		isDragging.value = true;
	};
	const closePop = () => {
		clickItem.value = {} as TollStation;
		showPop.value = false;
	};
	const openAdd = (station : any) => {
		// 获取点击的服务区索引
		const latitude = parseFloat(station.latitude); // 获取服务区纬度
		const longitude = parseFloat(station.longitude); // 获取服务区经度
		const address = station.tollStationAddress; // 获取服务区地址
		if (isApp) {
			const navigationInfo = {
				endLocation: {
					longitude: Number(longitude),
					latitude: Number(latitude),
					address: address,
				},
			};
			openAPPLocation(navigationInfo);
		} else if (isWechatMP) {
			openLocation({
				latitude: latitude, // 纬度
				longitude: longitude, // 经度
				name: station.tollStationName, // 地址名称（服务区名称）
				address: address, // 地址
				scale: 18, // 缩放级别，1~20，数值越大，地图越精细
			});
		}
	};
	// 路况纠错
	const goCorrect = async (id : string, name : string, status : string) => {
		if (!isLogin.value) {
			// showAlert2('提示', '本次操作需要您进行登录验证', false, '取消', '确定', (success) => {
			// 	uni.navigateTo({
			// 		url: '/pages_A/login/login?fromPage=' + CurrentPage(),
			// 	})
			// }, null)
			uni.showModal({
				title: '提示',
				content: '本次操作需要您进行登录验证',
				cancelText: '取消',
				confirmText: '确定',
				success: function (res) {
					if (res.confirm) {
						// #ifdef MP-WEIXIN
						uni.navigateTo({
							url: '/pages_A/login/login?fromPage=' + CurrentPage(),
						});
						// #endif
						// #ifdef APP
						uni.navigateTo({ url: '/pages_A/login_password/login' });
						// #endif
					} else if (res.cancel) {
					}
				},
			});
			return;
		}

		const params = {
			latitude: uni.getStorageSync('address').lat,
			longitude: uni.getStorageSync('address').lng,
			tollStationId: id,
		};

		try {
			const res = await checkDistanceRequirement(params);
			showPop.value = false;
			if (!res.data) {
				uni.showToast({
					title: '您当前定位已超出纠错申请范围',
					icon: 'none',
				});
				return;
			}
			uni.navigateTo({
				url: `/pages_A/correct/index?id=${id}&name=${name}&status=${status}`,
			});
		} catch (error : any) {
			uni.showToast({
				title: error.message || '操作失败',
				icon: 'none',
			});
		}
	};
	const showPopFn = (index : number, item : any) => {
		clickItem.value = item;
		console.log(clickItem.value, 'clickItem.value');
		showPop.value = false;
	};
	const goStation = (id : any) => {
		uni.navigateTo({
			url: '/pages_A/stationDetails/index?id=' + id,
		});
	};
	const handleTouchMove = (e) => {
		if (!isDragging.value) return;

		currentY.value = e.touches[0].clientY;
		const deltaY = startY.value - currentY.value;

		// 阻止默认的滚动行为
		e.preventDefault();
	};
	const gettypelist = async () => {
		let res = await getDict('oil_type');
	};
	const goMap1 = (item) => {
		console.log(item, 'item');
		openLocation({
			latitude: Number(item.latitude), //维度
			longitude: Number(item.longitude), //经度
			scale: 18, //缩放比例，范围5~18，默认为18
			name: item.tollStationName,
		});
	};
	const handleTouchEnd = () => {
		if (!isDragging.value) return;

		const deltaY = startY.value - currentY.value;

		// 上滑超过50px，切换到1200px
		if (deltaY > 50 && boxHeight.value === 600) {
			boxHeight.value = 1200;
			iscategory.value = false;
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
				if (merIndex.value == 0) return '全部';
				else return merTypes.value[merIndex.value].val;
			}
			// if (type == 2) {
			// 	if (gasolineIndex.value == 0) return '类型'
			// 	else return gasolineTypes.value[gasolineIndex.value].val
			// }
			// if (type == 3) {
			// 	if (loadIndex.value == 0) return '品牌'
			// 	else return loadTypes.value[loadIndex.value].val
			// }
			// if (type == 4) {
			// 	if (jiageindex.value == 0) return '价格排序'
			// 	else return jiagetype.value[jiageindex.value].val
			// }
			// if(type == 2){

			// }
			// if(type == 3){

			// }
		};
	});

	// 初始化地图
	const initMap = async () => {
		loadingVisible.value = true;
		try {
			// 获取用户位置
			currentLat.value = uni.getStorageSync('address').lat;
			currentLng.value = uni.getStorageSync('address').lng;
			init();
		} catch (err) { }
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
			tollStationName: searchTex.value ? searchTex.value : '',
			operationalStatus: merTypes.value[merIndex.value].key,
		};
		showLoading();

		try {
			let res : any = await getgetTollStationByIdList(params);
			if (res.rows.length) {
				let hasList = res.rows;
				total.value = res.total;
				totalPage.value = Math.ceil(res.total / 50);
				if (pageNum.value == 1) {
					dataList.value = hasList;
					markers.value = hasList.map((item, index) => {
						item.ids = item.id;
						item.zIndex = 2;
						item.id = index;
						item.width = '27';
						item.height = '32';
						item.latitude = Number(item.latitude);
						item.longitude = Number(item.longitude);
						item.iconPath = imgUrl + 'map/sfzdingwei-icon.png';
						return item;
					});
				} else {
					dataList.value = [...dataList.value, ...hasList];
					markers.value = [
						...markers.value,
						...hasList.map((item, index) => {
							item.zIndex = 2;
							item.id = index;
							item.ids = item.id;
							item.width = '27';
							item.height = '32';
							item.latitude = Number(item.latitude);
							item.longitude = Number(item.longitude);
							item.iconPath = imgUrl + 'map/sfzdingwei-icon.png';
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
		// if (type == 2) {
		// 	gasolineIndex.value = index
		// }
		// if (type == 3) {

		// 	loadIndex.value = index
		// }
		// if (type == 4) {

		// 	jiageindex.value = index
		// }
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
		if (totalPage.value > pageNum.value) {
			pageNum.value++;
			getList(currentLat.value, currentLng.value);
		}
	};
	const path=(item)=>{
		uni.navigateTo({
			url: '/pages_F/errorcorrection/index?id='+item.ids +'&name='+item.tollStationName +'&distance='+item.distance,
		});
	}
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

	.search-bnt {
		background: #fff;
		color: #333;
		padding: 10rpx 25rpx;
		margin-left: 32rpx;
		border-radius: 8rpx;
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
		color: var(--secondary-color);
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
		border: 2rpx solid var(--border-color);
		color: var(--secondary-color);
		text-align: center;
		line-height: 32rpx;
		font-size: 22rpx;
	}

	// =--------？
	//  {
	// 	width: 100%;
	// 	padding: 0 22rpx 22rpx;
	// 	box-sizing: border-box;
	// 	background-color: #fff;
	// 	margin-top: 14rpx;
	// }

	.s-view:last-child {
		margin-bottom: 0 !important;
		border: none !important;
	}

	.s-view {
		width: 100%;
		height: 130rpx;
		border-bottom: solid 1rpx #e1e1e1;
		padding: 20rpx 0;
	}

	.s-view .cont {
		width: 100%;
		height: 130rpx;
		display: flex;
		box-sizing: border-box;
		position: relative;
	}

	.cont-img {
		width: 186rpx;

		height: 130rpx;
		border-radius: 10rpx;
		margin-right: 25rpx;
	}

	.s-view .cont .status {
		padding: 0 10rpx;
		height: 30rpx;
		background-color: var(--secondary-color);
		border-radius: 0px 0px 10rpx 0px;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 10rpx 0 10rpx 0;
		font-size: 24rpx;
		color: #ffffff;
		text-align: center;
		line-height: 30rpx;
	}

	.gray {
		background-color: #959595 !important;
	}

	.s-view .cont .map-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.s-view .cont .map-icon image {
		width: 45rpx;
		height: 45rpx;
		margin-bottom: 12rpx;
	}

	.s-view .cont .map-icon view {
		font-size: 24rpx;
		letter-spacing: 0px;
		color: #333333;
	}

	.s-view .cont .image {
		width: 186rpx;
		height: 130rpx;
		border-radius: 10rpx;
		margin-right: 25rpx;
	}

	.s-view .cont>view:nth-child(2) {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.s-view .cont>view:nth-child(2)>view:nth-child(1) {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin: 0 0 10rpx;
	}

	.s-view .cont>view:nth-child(2)>view:nth-child(2) {
		font-size: 24rpx;
		color: #666666;
		line-height: 24rpx;
		height: 24rpx;
		margin: 0 0 15rpx;
		max-width: 300rpx;
	}

	.s-view .cont>view:nth-child(2)>view:nth-child(3) {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.s-view .cont>view:nth-child(2)>view:nth-child(3) image {
		width: 26rpx;
		height: 26rpx;
		margin-right: 20rpx;
	}

	.map-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.map-icon image {
		width: 45rpx;
		height: 45rpx;
		margin-bottom: 12rpx;
	}

	.map-icon view {
		font-size: 24rpx;
		letter-spacing: 0px;
		color: #333333;
	}

	.absolute {
		position: fixed;
		top: 0;
		left: 0;
		box-shadow: 0 12rpx 16rpx 0 rgba(0, 0, 0, 0.1);
		z-index: 1;
	}

	.mask {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.pop {
		width: 702rpx;
		transition: all 0.5s;
		z-index: 99;
		background: #fff;
		border-radius: 10rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 20rpx;
	}

	.popImg {
		width: 186rpx;
		height: 130rpx;
		border-radius: 10rpx;
		margin-right: 25rpx;
	}

	.popDes {
		width: 664rpx;
		background-color: #f0f0f0;
		font-size: 24rpx;
		color: #666;
		margin: 20rpx 0;
		padding: 12rpx;
		box-sizing: border-box;
	}

	.correct-btn {
		width: 260rpx;
		height: 70rpx;
		background-color: var(--primary-color);
		border-radius: 35rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		margin: auto;
	}

	.correct-btn>view:nth-child(1) {
		font-size: 28rpx;
		color: #ffffff;
		font-weight: bold;
		margin-right: 20rpx;
	}

	.correct-btn>view:nth-child(2) {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 93rpx;
		height: 46rpx;
		background-color: #ffffff;
		border-radius: 23rpx;
	}

	.correct-btn>view:nth-child(2) image {
		width: 26rpx;
		height: 24rpx;
	}

	.correct-btn>view:nth-child(2) text {
		font-size: 28rpx;
		color: var(--primary-color);
		margin-left: 2rpx;
	}

	.colCon {
		justify-content: center;
	}

	.rowCon {
		display: flex;
		display: flex;
		align-items: center;
		box-sizing: border-box;
	}

	.tex24_red {
		font-size: 24rpx;
		color: red;
	}

	.btn-num {
		font-size: 28rpx;
		color: var(--primary-color);
		margin-left: 2rpx;
	}
	
	.card-container {
		width: 690rpx;
	  position: relative;
	  background-color: #ffffff;
	  border-radius: 24rpx;
	  padding: 30rpx;
	  box-sizing: border-box;
	  // margin: 20rpx;
	  margin-bottom: 25rpx;
	  /* 基础的卡片阴影，nvue 下需要使用特定属性 */
	  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
	  .top-right-badge {
		width: 56rpx;
		height: 60rpx;
	    position: absolute;
	    top: 0;
	    right: 24rpx;
	    // background-color: #ff5a00;
	    // padding: 8rpx 12rpx;
	    /* NVUE 无法完美实现底部的锯齿效果，此处用常规圆角平替 */
	    // border-bottom-left-radius: 8rpx;
	    // border-bottom-right-radius: 8rpx;
	    // align-items: center;
	  }
	  
	  .top-badge-text {
	    color: #ffffff;
	    font-size: 20rpx;
	    line-height: 24rpx;
	  }
	  
	  .main-content {
	    display: flex;
		position: relative;
	  }
	  
	  .image-wrapper {
	    position: relative;
	    width: 160rpx;
	    height: 160rpx;
	    margin-right: 24rpx;
	  }
	  
	  .station-image {
	    width: 160rpx;
	    height: 160rpx;
	    border-radius: 12rpx;
	    background-color: #f5f5f5;
	  }
	  
	  .status-badge {
	    position: absolute;
	    top: 0;
	    left: 0;
	    background-color: #34c759;
	    padding: 4rpx 12rpx;
	    border-radius: 12rpx 0rpx 16rpx 0rpx;
	  }
	  
	  .status-text {
	    color: #ffffff;
	    font-size: 22rpx;
	  }
	  
	  .info-area {
	    flex: 1;
	    flex-direction: column;
	    // justify-content: space-between;
	  }
	  
	  .title-row {
	    display: flex;
	    align-items: flex-end;
	    margin-bottom: 12rpx;
	  }
	  
	  .title {
	    font-size: 34rpx;
	    font-weight: bold;
	    color: #333333;
	  }
	  
	  .distance {
	    font-size: 24rpx;
	    color: #999999;
	    margin-left: 16rpx;
	    margin-bottom: 4rpx;
	  }
	  
	  .tags-row {
	    display: flex;
	    flex-wrap: wrap;
	    margin-bottom: 16rpx;
	  }
	  
	  .hollow-tag {
	    display: flex;
	    align-items: center;
	    /* NVUE 下边框需拆分写以防渲染失效 */
	    border-width: 2rpx;
	    border-style: solid;
	    border-color: #65a94e;
	    border-radius: 6rpx;
	    padding: 2rpx 10rpx;
	    margin-right: 12rpx;
	    margin-bottom: 8rpx;
	  }
	  
	  .hollow-tag-text {
	    font-size: 22rpx;
	    color: #65a94e;
	  }
	  
	  .stats-row {
	    display: flex;
	    align-items: center;
		margin-bottom: 16rpx;
		white-space: nowrap;
	  }
	  
	  .stat-text {
	    font-size: 24rpx;
	    color: #888888;
	  }
	  
	  .stat-divider {
	    width: 16rpx;
	  }
	  
	  .divider {
	    height: 1px;
	    background-color: #f0f0f0;
	    margin-top: 24rpx;
	    margin-bottom: 24rpx;
	  }
	  
	  .bottom-area {
		  margin-top: 24rpx;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	  }
	  
	  .address-text {
	    flex: 1;
	    font-size: 26rpx;
	    color: #666666;
	    /* 单行文本省略 (NVUE 兼容写法) */
	    lines: 1;
	    text-overflow: ellipsis;
	    margin-right: 20rpx;
	  }
	  
	  .nav-button {
	    display: flex;
	    align-items: center;
	  }
	  
	  .nav-icon-box {
	    /* 导航图标外圈虚线框 */
	    border-width: 2rpx;
	    border-style: dashed;
	    border-color: #cccccc;
	    padding: 4rpx;
	    margin-right: 8rpx;
	  }
	  
	  .nav-text {
	    font-size: 26rpx;
	    color: #666666;
	  }
	}
	.jc-text{
		position: absolute;
		right: 0;
		bottom: 30rpx;
		 color: var(--secondary-color);
	}
</style>