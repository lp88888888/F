<template>
	<cos-header title='加油' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
		:defaultNavBarheight="100"></cos-header>
	<view class="container" :style="{ paddingTop: navBarHeight + 'px' }">
		<!-- 地图组件 -->
		<map v-if="currentLat" :latitude="currentLat" :longitude="currentLng" :markers="markers"
			@markertap="handleMarkerTap" :scale="scale" class="map"></map>
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
					<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
				</view>


				<view class="category" v-if="iscategory">
					<view v-if="typeIndex == '1'">
						<view :class="['labelBox',merIndex == index?'active':'']" v-for="(item,index) in merTypes"
							:key="index" @click="cateChange(1,index)">{{item.val}}</view>
					</view>

				</view>
			</view>
		</view>

		<view class="listView" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
			:style="{ height: boxHeight + 'rpx' }">
			<view class="line-heng">
			</view>
			<ser-empty></ser-empty>
			<view class="empty-state" v-if="markers.length == 0">

			</view>
			<scroll-view :scroll-y="true" class="listView-scroll" @scrolltolower="scrolltolower">
				<view class="gas-station-card" v-for="(item,index) in markers" :key="index"
					@click="oildetailsFun(item)">
					<!-- 左侧图标 -->
					<view class="gas-img">
						<image v-if="item.merchantImage" :src="item.merchantImage" class="img"></image>
						<image v-else :src="imgUrl + 'yq-zgsy.png'" class="img"></image>
					</view>
					<!-- 右侧信息区域 -->
					<view class="station-info">
						<text class="station-name" lines="1">{{item.merchantName}}</text>
						<view class="station-distance">
							<text class="station-n"><text style="color: #000;">距你</text> {{item.distance}}</text>
							<text class="fontTetx">{{item.merchantAddress}}</text>
						</view>
						<image :src="imgUrl + 'yq-dff.png'" class="img" @click.stop="goMap1(item)"></image>
					</view>
				</view>
			</scroll-view>
		</view>
		<up-popup v-model:show="show" mode="center" :round="24" :safeAreaInsetBottom="false">
			<view class="warp">
				<view class="text-1">提示</view>
				<view class="text-2">真实数据对接中</view>
				<view style="display: flex;align-items: center;justify-content: center;">
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
	import {
		ref,
		onMounted,
		computed
	} from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { onReachBottom, onReady, onLoad } from '@dcloudio/uni-app';
	import { getlistPageMerchant } from '@/api/index';
	import { showLoading, hideLoading, showToast, ID2, openLocation } from '@/utils/util';
	import { imgUrl } from '../../config';
	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	import { getDrivingRoute, LatLng } from '@/utils/polyline';
	import { useElementRects } from '@/utils/useElementRect';
	const { queryAll } = useElementRects(['#toBox'])
	const topBoxHeight = ref(90);
	const pageType = ref();
	const loadingVisible = ref(false);
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const currentLat = ref<number>(34.22259);
	const currentLng = ref<number>(108.94878);
	const iscategory = ref<boolean>(false);
	const isshow = ref<boolean>(true);
	const scale = ref(15)
	const pageNum = ref(1);
	const totalPage = ref(1); // 总分页 
	const total = ref(0);
	const searchTex = ref<string>('')
	const merTypes = ref([{ key: '', val: '全部' }, { key: '01', val: '客车' }, { key: '02', val: '货车' }, { key: '03', val: '货车/客车' }]);
	const merIndex = ref<number>(0);
	const loadTypes = ref([{ key: '', val: '全部' }, { key: '01', val: '非高速' }, { key: '02', val: '高速' }]);
	const loadIndex = ref<number>(0);
	const gasolineTypes = ref([{ key: '', val: '全部' }, { key: '01', val: '92#' }, { key: '02', val: '95#' }, { key: '03', val: '98#' }]);
	const gasolineIndex = ref<number>(0);

	const markers = ref([]);
	const dataList = ref([]);
	const typeIndex = ref('')


	const isnavigation = ref(false)
	const selectedLocation = ref(null)
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});
	const boxHeight = ref(600) // 初始高度
	const startY = ref(0)
	const currentY = ref(0)
	const isDragging = ref(false)
	const handleTouchStart = (e) => {
		startY.value = e.touches[0].clientY
		isDragging.value = true
	}

	const handleTouchMove = (e) => {
		if (!isDragging.value) return

		currentY.value = e.touches[0].clientY
		const deltaY = startY.value - currentY.value

		// 阻止默认的滚动行为
		e.preventDefault()
	}
	const handleTouchEnd = () => {
		if (!isDragging.value) return

		const deltaY = startY.value - currentY.value

		// 上滑超过50px，切换到1200px
		if (deltaY > 50 && boxHeight.value === 600) {
			iscategory.value = false
			boxHeight.value = 1200
		}
		// 下滑超过50px，切换到600px
		else if (deltaY < -50 && boxHeight.value === 1200) {
			boxHeight.value = 600
		}

		isDragging.value = false
	}
	const textValue = computed(() => {
		return (type) => {
			if (type == 1) {
				if (merIndex.value == 0) return '类型'
				else return merTypes.value[merIndex.value].val
			}
			if (type == 2) {
				if (gasolineIndex.value == 0) return '油品'
				else return gasolineTypes.value[gasolineIndex.value].val
			}
			if (type == 3) {
				if (loadIndex.value == 0) return '路线'
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
		currentLat.value = uni.getStorageSync('address').lat;
		currentLng.value = uni.getStorageSync('address').lng;
		init()

	}
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
		getList(currentLat.value, currentLng.value)
	}
	/**
	 * 获取油气商户列表
	 */
	const getList = async (lat, lon) => {
		loadingVisible.value = true
		var that = this
		var params = {
			pageNum: pageNum.value,
			pageSize: 50,
			merchantLon: lon,
			merchantLat: lat,
			merchantName: searchTex.value ? searchTex.value : '',
			merchantLocationType: loadIndex.value <= 0 ? '' : '0' + loadIndex.value,
			checkVehicleType: merIndex.value <= 0 ? '' : '0' + merIndex.value,
			merType: '08'
		}
		// showLoading()
		// merchantLocationType  01非高速  02高速
		// merType  01加油  02加气
		try {
			let res : any = await getlistPageMerchant(params);
			if (res.rows.length) {
				let hasList = res.rows

				total.value = res.total
				totalPage.value = res.pages
				if (pageNum.value == 1) {
					dataList.value = hasList;
					markers.value = hasList.map((item, index) => {
						item.stationId = item.merchantId
						item.zIndex = 2
						item.id = ID2(10)
						item.width = '27'
						item.height = '32'
						item.latitude = Number(item.merchantLat)
						item.longitude = Number(item.merchantLon)
						item.iconPath = imgUrl + 'static/' + (item.merType == '01' ? 'oil' : 'gas') + '-map-icon.png'
						return item
					})
				} else {
					dataList.value = [...dataList.value, ...hasList]
					markers.value = [...markers.value, ...hasList.map((item, index) => {
						item.stationId = item.merchantId
						item.zIndex = 2
						item.id = ID2(10)
						item.width = '27'
						item.height = '32'
						item.latitude = Number(item.merchantLat)
						item.longitude = Number(item.merchantLon)
						item.iconPath = imgUrl + 'static/' + (item.merType == '01' ? 'oil' : 'gas') + '-map-icon.png'
						return item
					})]
				}
				// scale.value = scale.value > 9 ? 9 : scale.value
			}
			loadingVisible.value = false
			// uni.stopPullDownRefresh()
		} catch (err) {
			loadingVisible.value = false
			// uni.stopPullDownRefresh()
			showToast(err)
		}


	}
	const categoryFun = (type) => {
		typeIndex.value = type;

		iscategory.value = !iscategory.value
		if (iscategory.value) {
			boxHeight.value = 600
		}
	}
	const cateChange = (type, index) => {
		if (type == 1) {
			merIndex.value = index
		}
		if (type == 2) {
			gasolineIndex.value = index
		}
		if (type == 3) {

			loadIndex.value = index
		}
		iscategory.value = false
		init()
	}

	// 标记点点击事件
	const handleMarkerTap = (event) => {
		console.log(event);

		var makerId = event.detail.markerId
		var filterMaker = dataList.value.filter(item => item.id == makerId)[0]
		uni.setStorageSync('k1yMerInfo', filterMaker)
		uni.navigateTo({
			url: '/pages_D/inspection/details?merId=' + filterMaker.stationId + (pageType.value == 'check' ? '&type=check' : '')
		})
	}
	const oildetailsFun = (item) => {
		uni.setStorageSync('k1yMerInfo', item)
		uni.navigateTo({
			url: '/pages_D/inspection/details?merId=' + item.stationId + (pageType.value == 'check' ? '&type=check' : '')
		})
	}

	const handleQuery = async () => {
		try {
			const result : any = await queryAll()
			console.log("---------->>>", result);
			for (let i in result) {
				if (result[i].id == 'toBox') {
					topBoxHeight.value = result[i].height
				}
			}
		} catch (err) {
			console.log('卡片尺寸shib:', err)
		}
	}
	// onReachBottom 
	onReachBottom(() => {
		console.log('到底了');
		if (totalPage.value > pageNum.value) {
			pageNum.value++
			getList(currentLat.value, currentLng.value)
		}
	})
	onReady(() => {
		// 从cos-header组件获取实际高度或计算
		nextTick(() => {
			setTimeout(() => {
				handleQuery()
			}, 100)
		})

	})
	// 页面加载时初始化地图
	onLoad(() => {
		currentLat.value = uni.getStorageSync('address').lat;
		currentLng.value = uni.getStorageSync('address').lng;
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
	}
</script>

<style scoped lang="scss">
	.warp {
		width: 570rpx;
		// height: 432rpx;
		// background: linear-gradient(180deg, #C8FFFD 0%, #FFFFFF 40%);
		background: #FFFFFF;
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
			background: #FFFFFF;
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			border: 2rpx solid #00BEBE;
			font-weight: 500;
			font-size: 28rpx;
			color: #00BEBE;
			line-height: 76rpx;
			text-align: center;
		}

		.bnt-2 {
			width: 220rpx;
			height: 76rpx;
			background: #00BEBE;
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
		box-sizing: border-box;
		background-color: #F8F9FB;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		padding: 30rpx;
		z-index: 999;
		transition: height 0.3s ease;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.listView-scroll {
		background: none;
		margin-top: 30rpx;
		height: 100%;
	}

	.line-heng {
		width: 126rpx;
		height: 8rpx;
		background: #D8D8D8;
		border-radius: 376rpx 376rpx 376rpx 376rpx;
		margin: 0 auto;
	}

	.active {
		color: $color;
	}

	.labelBox {
		padding: 25rpx 32rpx;
		box-sizing: border-box;
		font-size: 28rpx;
	}

	.activeLabel {
		color: $color;
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
			background-color: $color;
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
		background: $bgTopColor;
		position: absolute;
		top: 175rpx;
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

		padding: 15px 30rpx;
		background: #FFFFFF;
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
		color: $color;
		margin-right: 10rpx;
	}

	.station-info {
		width: 400rpx;
	}

	.yinyesta {
		width: 70rpx;
		height: 32rpx;
		background: #EAFFFF;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #47DFDA;
		color: #47DFDA;
		text-align: center;
		line-height: 32rpx;
		font-size: 22rpx;
		margin-right: 10rpx;
	}

	.yinyetb {
		width: 70rpx;
		height: 32rpx;
		background: #FFF2EA;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid $color;
		color: $color;
		text-align: center;
		line-height: 32rpx;
		font-size: 22rpx;
	}
</style>