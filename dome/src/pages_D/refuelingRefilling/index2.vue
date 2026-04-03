<template>
	<cos-header title='加油' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
		:defaultNavBarheight="100"></cos-header>
	<view class="container" :style="{ paddingTop: navBarHeight + 'px' }" >
		<!-- 地图组件 -->
		<map :latitude="currentLat" v-if="currentLat" :longitude="currentLng" :markers="markers" @markertap="handleMarkerTap" :scale="scale" class="map"></map>
		<!-- 搜索 -->
		<view class="search">
			<view class="search-box">
				<up-input placeholder="请输入关键字搜索" v-model="searchTex" shape='circle' height="35" @confirm="inputConfirm">
					<template #prefix>
						<up-icon name="search" color="#000000" size="24"></up-icon>
					</template>
				</up-input>
			</view>
			<!-- 筛选栏 -->
			<view class="filter-bar">
				<view class="filter-item filter-ls" @click="categoryFun('1')">
					<text :class="[merIndex > 0?'active':'']">{{textValue(1)}}</text>
					<view class="down"><up-icon name="arrow-down-fill" color="#000" size="10"></up-icon></view>
				</view>
				<view class="filter-item  filter-ls" @click="categoryFun('2')">
					<text :class="[gasolineIndex > 0?'active':'']">{{textValue(2)}}</text>
					<view class="down"><up-icon name="arrow-down-fill" color="#000" size="10"></up-icon></view>
				</view>
				<view class="filter-item  filter-ls" @click="categoryFun('3')">
					<text :class="[loadIndex > 0?'active':'']">{{textValue(3)}}</text>
					<view class="down"><up-icon name="arrow-down-fill" color="#000" size="10"></up-icon></view>
				</view>
				<view class="category" v-if="iscategory">
					<view v-if="typeIndex == '1'">
						<view :class="['labelBox',merIndex == index?'active':'']" v-for="(item,index) in merTypes" :key="index" @click="cateChange(1,index)">{{item.val}}</view>
					</view>
					<view v-if="typeIndex == '2'">
						<view :class="['labelBox',gasolineIndex == index?'active':'']" v-for="(item,index) in gasolineTypes" :key="index" @click="cateChange(2,index)">{{item.val}}</view>
					</view>
					<view v-if="typeIndex == '3'">
						<view :class="['labelBox',loadIndex == index?'active':'']" v-for="(item,index) in loadTypes" :key="index" @click="cateChange(3,index)">{{item.val}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 左边 -->
		<view class="use-btn" @click="togoorder" v-if="!iscategory">
			<view >
				<image :src="imgUrl + 'img/fuqicon.png'" class="img"></image>
				<view :class="showfuq==2?'active':''">我的订单</view>
			</view>
		</view>
		<!-- 列表底部弹窗 -->
		<view class="location-list" v-if="isshow">
			<view class="location-title">
				<view>已为您查询到{{total}}条信息内容</view>
				<!-- <view @click="isshow=false">
					<image :src="imgUrl + 'yq-fds.png'" class="img"></image>
				</view> -->
			</view>
			
			<scroll-view :scroll-y="true" class="location-score" @scrolltolower="scrolltolower">
				<view class="gas-station-card" v-for="(item,index) in markers" :key="index" @click="oildetailsFun(item)">
					<!-- 左侧图标 -->
					<view class="gas-img">
						<image v-if="item.merchantImage" :src="item.merchantImage" class="img"></image>
						<image v-else :src="imgUrl + 'yq-zgsy.png'" class="img"></image>
						<!-- <image v-else :src="imgUrl + `static/${item.merType=='01'?'new-gas-default-gas':'new-gas-default-oil'}.png`" class="img"></image> -->
					</view>
					<!-- 右侧信息区域 -->
					<view class="station-info">
						<text class="station-name" >{{item.merchantName}}</text>
						<text class="station-distance"><text class="station-n">{{item.distance}}km</text>{{item.merchantAddress}}</text>
						<text class="station-discount">最高优惠9折</text>
						<image :src="imgUrl + 'yq-dff.png'" class="img" @click.stop="goMap1(item)"></image>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		ref,
		onMounted,
		computed
	} from 'vue';
	import {getKycMerchantInfoList} from '@/api/index';
	import CosHeader from '@/components/customNavBar/index.vue';
	import {showLoading,hideLoading,showToast,ID2} from '@/utils/util';
	import {imgUrl} from '../../config';
	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	import {getDrivingRoute,LatLng} from '@/utils/polyline';
	const navBarHeight = ref(0);
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	const backgroundColor = ref<string>('#FFFFFF');
	const pageType  = ref();
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const currentLat = ref<number>(0);
	const currentLng = ref<number>(0);
	const iscategory = ref<boolean>(false);
	const isshow= ref<boolean>(true);
	const scale = ref(15)
	const pageNum = ref(1);
	const totalPage = ref(1); // 总分页
	const total = ref(0);
	const searchTex = ref<string>('')
	const merTypes=ref([{ key: '',val: '全部'}, {key: '01',val: '加油站'}, {key: '02',val: '加气站'}]);
	const merIndex = ref<number>(0);
	const loadTypes=ref([{ key: '',val: '全部'}, {key: '01',val: '非高速'}, {key: '02',val: '高速'}]);
	const loadIndex = ref<number>(0);
	const gasolineTypes=ref([{ key: '',val: '全部'}, {key: '01',val: '92#'}, {key: '02',val: '95#'}, {key: '03',val: '98#'}]);
	const gasolineIndex = ref<number>(0);
	
	const markers = ref([]);
	const dataList = ref([]);
	const typeIndex = ref('')
	
	
	const isnavigation = ref(false)
	const selectedLocation = ref(null)
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});
	
	const togoorder=()=>{
		uni.navigateTo({
			url:'/pages_D/refuelingRefilling/order'
		})
	}
	const textValue = computed(()=>{
		return (type)=>{
			if(type == 1){
				if(merIndex.value == 0) return '类型'
				else return merTypes.value[merIndex.value].val
			}
			if(type == 2){
				if(gasolineIndex.value == 0) return '油品'
				else return gasolineTypes.value[gasolineIndex.value].val
			}
			if(type == 3){
				if(loadIndex.value == 0) return '路线'
				else return loadTypes.value[loadIndex.value].val
			}
			// if(type == 2){
				
			// }
			// if(type == 3){
				
			// }
		}
	})

	// 初始化地图
	const initMap = async () => {
		try {
			// 获取用户位置
			const locationRes:any = await new Promise((resolve, reject) => {
				uni.getLocation({
					type: 'gcj02', // 腾讯地图使用gcj02坐标系
					success: resolve,
					fail: reject
				});
			});
			currentLat.value = locationRes.latitude;
			currentLng.value = locationRes.longitude;
			init()
			
		} catch (err) {
			console.error('初始化地图失败:', err);
		} finally {

		}
	}
	const inputConfirm = (event) =>{
		console.log(event);
		init();
	};
	const init = () => {
		pageNum.value = 1;
		totalPage.value = 1;
		total.value =0;
		dataList.value = [];
		markers.value = [];
		getList(currentLat.value,currentLng.value)
	}
	/**
	 * 获取油气商户列表
	 */
	const getList = async (lat, lon)=> {
	  var that = this
	  var params = {
	    pageNum: pageNum.value,
	    pageSize: 50,
	    userId: wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo').id : '',
	    lon: lon,
	    lat: lat,
	    merchantName: searchTex.value ? searchTex.value : '',
	    merchantLocationType: loadIndex.value <= 0 ? '' : '0' + loadIndex.value,
	    merType: merIndex.value <= 0 ? '' : '0' + merIndex.value,
	  }
	  showLoading()
	  // merchantLocationType  01非高速  02高速
	  // merType  01加油  02加气
	  try{
		  let res:any = await getKycMerchantInfoList(params);
		  if(res.rows.length){
			  let hasList = res.rows
			  total.value = res.total
			  totalPage.value = Math.ceil(res.total / 50) 
			  if(pageNum.value ==1){
				  dataList.value = hasList;
				  markers.value = hasList.map((item, index) => {
				    item.stationId = item.merchantId
				    item.zIndex = 2
				    item.id = ID2(10)
				    item.width = '27'
				    item.height = '32'
				    item.latitude = Number(item.merchantLat)
				    item.longitude = Number(item.merchantLon)
				    item.iconPath = imgUrl+'static/' + (item.merType == '01' ? 'oil' : 'gas') + '-map-icon.png'
				    return item
				  })
			  }else{
				  dataList.value = [...dataList.value,...hasList]
				  markers.value = [...markers.value,...hasList.map((item, index) => {
				    item.stationId = item.merchantId
				    item.zIndex = 2
				    item.id = ID2(10)
				    item.width = '27'
				    item.height = '32'
				    item.latitude = Number(item.merchantLat)
				    item.longitude = Number(item.merchantLon)
				    item.iconPath = imgUrl+'static/' + (item.merType == '01' ? 'oil' : 'gas') + '-map-icon.png'
				    return item
				  })]
			  }
			  scale.value = scale.value > 9 ? 9 : scale.value
		  }
		  
		  hideLoading()
		  // uni.stopPullDownRefresh()
	  }catch(err){
		  hideLoading()
		  // uni.stopPullDownRefresh()
		  showToast(err)
	  }
	  
	
	}
	const categoryFun = (type) => {
		typeIndex.value = type;
		
		iscategory.value = !iscategory.value
	}
	const cateChange = (type,index) =>{
		if(type== 1){
			merIndex.value = index
		}
		if(type == 2){
			gasolineIndex.value = index
		}
		if(type == 3){
			
			loadIndex.value = index
		}
		iscategory.value = false
		init()
	}
	
	// 标记点点击事件
	const handleMarkerTap = (event) =>{
		var makerId = event.detail.markerId
		var filterMaker = dataList.value.filter(item => item.id == makerId)[0]
		uni.setStorageSync('k1yMerInfo', filterMaker)
		uni.navigateTo({
		  url: '/pages_D/refuelingRefilling/details?merId=' + filterMaker.stationId + (pageType.value == 'check' ? '&type=check' : '')
		})
	}
	const oildetailsFun = (item) => {
		uni.setStorageSync('k1yMerInfo', item)
		uni.navigateTo({
		  url: '/pages_D/refuelingRefilling/details?merId=' + item.stationId + (pageType.value == 'check' ? '&type=check' : '')
		})
	}
	const scrolltolower = (event) =>{
		console.log("--------触底加载分页----------");
		console.log(event);
		if(totalPage.value > pageNum.value){
			pageNum.value++
			getList(currentLat.value,currentLng.value)
		}
	}
	// 页面加载时初始化地图
	onMounted(() => {
		initMap();
	});
	//地图
	const goMap1=(item)=> {
		console.log(item);
	    uni.openLocation({
		    latitude:Number(item.merchantLat),//维度
			longitude:Number(item.merchantLon),//经度
			scale: 18,//缩放比例，范围5~18，默认为18
			name:item.merchantName,
		})
	}
</script>

<style scoped lang="scss">
	.active {
		color: #FF9000;
	}
	.labelBox{
		padding: 25rpx 32rpx;
		box-sizing: border-box;
		font-size: 28rpx;
	}
	.activeLabel{
		color: #FF9000;
	}
	.container {
		width: 100%;
		height: 100vh;
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
		background: #fff;
		position: absolute;
		top: 190rpx;
		left: 50%;
		transform: translate(-50%, 0);
	}

	.search-box {
		padding: 10rpx 30rpx 0;
		box-sizing: border-box;
	}

	.filter-bar {
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		background-color: #fff;
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
		background-color: #F4F6FA;
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
		background: #EFF1F6;
		background-blend-mode: normal, normal;
		border-radius: 30rpx 30rpx 0px 0px;
	}

	.location-score {
		height: 500rpx;
		overflow-x: scroll;
	}

	.gas-station-card {
		width: 85%;
		display: flex;
		align-items: center;
		padding: 15px 30rpx;
		background: #FFFFFF;
		border-radius: 30rpx;
		margin: 20rpx auto;
		gap: 30rpx;

		.gas-img {
			width: 160rpx;
			height: 140rpx;
			background: #FFFFFF;
			border-radius: 26rpx;
			border: 1px solid #DCDDDF;
			display: flex;
			align-items: center;
			justify-content: center;
			.img{
				width: 100rpx;
				height:100rpx;
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
		text-overflow: ellipsis ;
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
		font-size: 12px;
		color: #F7523D;
		background-color: #FFF2EA;
		/* 红色背景，可根据需求调整 */
		padding: 2px 6px;
		border-radius: 4px;
		display: inline-block;
	}

	.station-n {
		color: #FF9600;
		margin-right: 10rpx;
	}

	.station-info {
		width: calc(100% - 160rpx);
		position: relative;

		.img {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: 20rpx;
			bottom: 0;
		}
	}
</style>