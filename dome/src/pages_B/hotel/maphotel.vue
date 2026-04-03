<!-- HotelList.vue -->
<template>
	<view class="container" :data-theme="pageTheme">
		<!-- 搜索栏 -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="酒店住宿" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<view class="search-bar">
			<input placeholder="请输入酒店名称/服务区名称" class="search-input" @blur="seachlist()" v-model="searchValue" />
			<image :src="imgUrl + 'trip-pro/activity/selfDrive_search.png'" mode="" @click="seachlist()"
				class="search-icon"></image>
			<view class="search-dt" @tap="toMapHotel">
				<image :src="imgUrl + 'hotel/tab33-icon.png'" mode="" class="search-dt-icon"></image>
				<text class="search-text">列表</text>
			</view>
		</view>

		<!-- 筛选栏 -->
		<view class="filter-bar">
			<view class="filter-1">
				<!-- 价格下拉 -->
				<view class="filter-item" @click="toggleDropdown('price')">
					{{ currentPrice.label || '价格' }}
					<image :src="imgUrl + 'trip-pro/arrBottom.png'" mode="" class="filter-icon"
						:class="{ 'rotate': currentDropdown === 'price' }"></image>
				</view>

				<!-- 距离下拉 -->
				<view class="filter-item" @click="toggleDropdown('location')">
					{{ currentLocation.label || '距离优先' }}
					<image :src="imgUrl + 'trip-pro/arrBottom.png'" mode="" class="filter-icon"
						:class="{ 'rotate': currentDropdown === 'location' }"></image>
				</view>

				<!-- 位置下拉 -->
				<view class="filter-item" @click="chongzhi()">
					{{ '重置' }}

				</view>
			</view>

			<image @click="toggleFilterPopup" :src="imgUrl + 'hotel/shaixuan.png'" mode="" class="filter-sx-icon">
			</image>


			<!-- 价格选项 -->
			<view class="dropdown-content" v-if="currentDropdown === 'price'">
				<view class="dropdown-item" v-for="item in priceOptions" :key="item.value" @click="selectPrice(item)">
					{{ item.label }}
				</view>
			</view>

			<!-- 距离选项 -->
			<view class="dropdown-content" v-if="currentDropdown === 'distance'">
				<view class="dropdown-item" v-for="item in distanceOptions" :key="item.value"
					@click="selectDistance(item)">
					{{ item.label }}
				</view>
			</view>

			<!-- 位置选项 -->
			<view class="dropdown-content" v-if="currentDropdown === 'location'">
				<view class="dropdown-item" v-for="item in locationOptions" :key="item.value"
					@click="selectLocation(item)">
					{{ item.label }}
				</view>
			</view>
		</view>
		<map :latitude="currentLat" v-if="currentLat" :longitude="currentLng" :markers="markers"
			@markertap="handleMarkerTap" :scale="scale" class="map"></map>
		<!-- 酒店列表 -->
		<scroll-view scroll-y class="hotel-list" :style="{ height: boxHeight + 'rpx' }" @scrolltolower="onReachBottom">
			<view class="line_head" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
				@touchend="handleTouchEnd">
				<view class="line-heng"> </view>
			</view>
			<view style="font-size: 32rpx;font-weight: bold;margin-top: 20rpx;margin-left: 20rpx;">
				附近共计<text
					:style="{fontSize: '28rpx',color: themeStore.themeColors.$primaryColor}">{{hotels.length}}</text>个酒店
			</view>
			<block v-for="item in hotels" :key="item.id">
				<view class="hotel-item" @tap="toHotelDetails(item)">
					<image :src="item.mainImage" class="hotel-image"></image>
					<view class="hotel-info">
						<view class="hotel-name">{{ item.hotelName }}</view>
						<view class="hotel-distance">
							<image :src="imgUrl + 'hotel/dizhi-icon.png'" mode="" class="dingwei"></image>
							<view class="list-juli">
								距您{{ item.distance }}km · {{ item.address }}
							</view>
						</view>
						<view class="hotel-tags">
							<view class="tag" v-for="(i,f) in item.serviceItems" :key="f">{{i}}</view>
						</view>
						<view class="hotel-price">
							<text class="hotel-pric-1">¥</text>
							{{ item.minPrice }}
							<text class="hotel-pric-2">起</text>
							<!-- <text class="hotel-pric-3">¥{{ item.basePrice }}</text> -->
						</view>
					</view>
				</view>
			</block>
			<ser-empty v-if="!hotels.length"></ser-empty>
		</scroll-view>

		<!-- 筛选弹窗 -->

		<view class="filter-popup-content" v-if="isFilterPopupVisible">
			<view class="section">
				<view class="text-l">
					<text class="title">床型</text>
				</view>

				<view class="options">
					<view class="option" v-for="(item,index) in facilityOptions" :key="index"
						:class="{ 'selected': item.selected }" @click="toggleSelection(facilityOptions, index)">
						{{item.dictLabel}}
					</view>
				</view>
			</view>
			<view class="section">
				<view class="text-l">
					<text class="title">设施</text>
					<text class="title1" @click="toggleExpand">{{ isExpanded ? '收起' : '展开' }}</text>
				</view>
				<view class="options" :class="{ 'collapsed': !isExpanded }">
					<view class="option" v-for="(item,index) in bedOptions" :key="index"
						:class="{ 'selected': item.selected }" @click="toggleSelection(bedOptions, index)">
						{{item.dictLabel}}
					</view>
				</view>
			</view>
			<view class="buttons">
				<view class="confirm-btn" @click="resetOptions">重置</view>
				<view class="reset-btn" @click="confirmSelection">确定</view>
			</view>
		</view>
		<!-- 底部导航 -->
		<BottomNavigation :current-page="currentPage" @change="handleNavChange" />
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, reactive, onMounted } from 'vue'
	import { imgUrl } from '@/config';
	import { gethotelList, gethotelservices } from '@/api/hotel';
	import BottomNavigation from './components/bottom-navigation.vue';
	import { toBack } from '@/utils/route';
	import QQMapWX from '@/common/qqmap-wx-jssdk.js';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	// 假设这是你的图片基础路径（根据实际配置调整）
	const currentLat = ref<number>(0);
	const currentLng = ref<number>(0);
	const scale = ref(15)
	const markers = ref([]);
	// 搜索输入框
	const searchValue = ref('')
	const currentDropdown = ref('')
	// 当前页面标识
	const currentPage = ref('hotellist')
	onMounted(() => {
		initMap();
		const pages = getCurrentPages()
		const currentPageInstance = pages[pages.length - 1]
		const route = currentPageInstance.route
		// 根据路由设置当前页面标识
		if (route?.includes('hotellist')) {
			currentPage.value = 'hotellist'
		} else if (route?.includes('collect')) {
			currentPage.value = 'collect'
		} else if (route?.includes('order')) {
			currentPage.value = 'order'
		}
		getsaixunlist1()
		getsaixunlist2()
	})
	const handleNavChange = ({ page, route } : { page : string; route : string }) => {
		currentPage.value = page
		console.log('导航切换到:', page, route)
		uni.redirectTo({
			url: route
		})
	}
	// 酒店列表数据
	const hotels = ref([])
	const page = ref(1)
	const pageSize = ref(10)
	const loading = ref(false)
	const hasMore = ref(true)
	const currentPrice = ref('')
	const currentDistance = ref('')
	const currentLocation = ref('')
	const isExpanded = ref(true)
	const isDragging = ref(false)
	const startY = ref(0);
	const currentY = ref(0);
	const boxHeight=ref(600)
	const handleTouchEnd = () => {
		if (!isDragging.value) return;
	
		const deltaY = startY.value - currentY.value;
	
		// 上滑超过50px，切换到1200px
		if (deltaY > 50 && boxHeight.value === 600) {
			boxHeight.value = 1200;
			currentDropdown.value = ''
		}
		// 下滑超过50px，切换到600px
		else if (deltaY < -50 && boxHeight.value === 1200) {
			boxHeight.value = 600;
		}
	
		isDragging.value = false;
	};
	const handleTouchMove = (e) => {
		if (!isDragging.value) return;
	
		currentY.value = e.touches[0].clientY;
		const deltaY = startY.value - currentY.value;
	
		// 阻止默认的滚动行为
		e.preventDefault();
	};
	const handleTouchStart = (e) => {
		startY.value = e.touches[0].clientY;
		isDragging.value = true;
	};
	// 标记点点击事件
	const handleMarkerTap = (event) => {
		console.log(event);

		var makerId = event.detail.markerId
		var filterMaker = dataList.value.filter(item => item.id == makerId)[0]
		uni.setStorageSync('k1yMerInfo', filterMaker)
		uni.navigateTo({
			url: '/pages_D/refuelingRefilling/details?merId=' + filterMaker.stationId + (pageType.value == 'check' ? '&type=check' : '')
		})
	}
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});
	// 切换展开/收起
	const toggleExpand = () => {
		isExpanded.value = !isExpanded.value
	}
	// 选项数据
	const priceOptions = [
		{ label: '从低到高', value: 1 },
		{ label: '从高到低', value: 2 }
	]

	const distanceOptions = [
		{ label: '最近优先', value: 'nearest' },
		{ label: '最远优先', value: 'farthest' }
	]

	const locationOptions = [
		{ label: '1公里内', value: 1 },
		{ label: '3公里内', value: 3 },
		{ label: '5公里内', value: 5 }
	]
	// 切换下拉菜单
	const toggleDropdown = (type) => {
		boxHeight.value = 600
		currentDropdown.value = currentDropdown.value === type ? '' : type
	}

	// 关闭下拉菜单
	const closeDropdown = () => {
		currentDropdown.value = ''
	}
	const chongzhi = () => {
		currentLocation.value = ''
		currentPrice.value = ''
		searchValue.value = ''
		seachlist()
	}
	// 选择价格
	const selectPrice = (item) => {
		currentPrice.value = item.value
		currentDropdown.value = ''
		console.log('选择价格:', item)
		seachlist()
	}

	// 选择距离
	const selectDistance = (item) => {
		currentDistance.value = item.value
		currentDropdown.value = ''
		console.log('选择距离:', item)
		seachlist()
	}

	// 选择位置
	const selectLocation = (item) => {
		currentLocation.value = item.value
		currentDropdown.value = ''
		console.log('选择位置:', item)
		seachlist()
	}
	const initMap = async () => {
		try {
			// 获取用户位置
			const locationRes : any = await new Promise((resolve, reject) => {
				// #ifdef APP-PLUS
				uni.getLocation({
					type: 'wgs84', // iOS 必须使用 wgs84
					geocode: true, // 开启地理编码
					isHighAccuracy: true,
					success: resolve,
					fail: reject,
				});
				// #endif
				// #ifndef APP-PLUS
				uni.getLocation({
					type: 'gcj02', // 腾讯地图使用gcj02坐标系
					success: resolve,
					fail: reject,
				});
				// #endif
			});
			currentLat.value = locationRes.latitude;
			currentLng.value = locationRes.longitude;
			seachlist()

		} catch (err) {
			console.error('初始化地图失败:', err);
		} finally {

		}
	}
	const seachlist = async () => {
		page.value = 1
		hotels.value = []
		markers.value = []
		getlsit()
	}
	const getlsit = async () => {
		// if (loading.value || !hasMore.value) return
		loading.value = true
		let arr1 = []
		let arr2 = []
		bedOptions.value.forEach(item => {
			if (item.selected) {
				arr1.push(item.dictValue)
			}
		})
		facilityOptions.value.forEach(item => {
			if (item.selected) {
				arr2.push(item.dictValue)
			}
		})
		// 这里替换成实际的API调用
		let params = {
			pageNum: page.value,
			pageSize: pageSize.value,
			serviceItems: arr1.join(','),
			roomTypeGroups: arr2.join(','),
			hotelName: searchValue.value,
			longitude: currentLng.value,
			latitude: currentLat.value,
			distanceRange: currentLocation.value,
			priceSort: currentPrice.value
		}
		// 这里替换成实际的API调用
		const response = await gethotelList(params)
		const data = await response
		const newHotels = data.rows || []
		newHotels.forEach((hotel, index) => {
			if (hotel.status == 0) {
				newHotels.splice(index, 1); // 删除当前项
			}
			// if (hotel.mainImage) {
			// 	hotel.mainImage = hotel.mainImage.split(',')
			// } else {
			// 	hotel.mainImage = []
			// }
			// 将酒店的服务项目数组（serviceItems）使用逗号连接成字符串
			if (hotel.serviceItems && typeof hotel.serviceItems === 'string') {
				hotel.serviceItems = hotel.serviceItems.split(',')
			} else if (!hotel.serviceItems) {
				hotel.serviceItems = [] // 如果不存在，设为空数组
			}
		})
		if (newHotels.length < pageSize.value) {
			hasMore.value = false
		}
		// 合并新旧数据
		hotels.value = [...hotels.value, ...newHotels]
		markers.value = [...markers.value, ...hotels.value.map((item, index) => {
			item.width = '27'
			item.height = '32'
			item.iconPath = imgUrl + 'static/hotel-icon.png'
			return item
		})]
		console.log(markers.value, 'markers.value')
		page.value++
		loading.value = false
	}

	// 监听页面滚动
	const onPageScroll = (e) => {
		// 滚动距离超过一定值时，关闭下拉菜单
		if (e.scrollTop > 100) {
			closeDropdown()
		}
	}

	const handleSearch = () => {

	}
	// 筛选弹窗控制
	const isFilterPopupVisible = ref(false)

	// 筛选项
	const selectedOptions = reactive({
		bed: [] as string[],
		facility: [] as string[],
	})

	// 可选项
	const bedOptions = ref([])
	const facilityOptions = ref([])

	// 切换筛选弹窗
	const toggleFilterPopup = () => {
		boxHeight.value=600
		console.log('切换筛选弹窗')
		isFilterPopupVisible.value = !isFilterPopupVisible.value
	}

	// 选择选项
	const selectOption = (type : 'bed' | 'facility', value : string) => {
		const options = selectedOptions[type]
		const index = options.indexOf(value)
		if (index > -1) {
			options.splice(index, 1)
		} else {
			options.push(value)
		}
	}

	// 重置选项
	const resetOptions = () => {
		bedOptions.value.forEach(item => {
			item.selected = false
		})
		facilityOptions.value.forEach(item => {
			item.selected = false
		})
	}
	const toggleSelection = (options, index) => {
		options[index].selected = !options[index].selected
	}

	const getsaixunlist1 = () => {
		gethotelservices('hotel_services').then(res => {
			bedOptions.value = res.data.map(item => ({
				...item,
				selected: false
			}))
		})
	}
	const getsaixunlist2 = () => {
		gethotelservices('hotel_room_type').then(res => {
			facilityOptions.value = res.data.map(item => ({
				...item,
				selected: false
			}))
		})
	}
	// 确认筛选
	const confirmSelection = () => {
		seachlist()
		toggleFilterPopup()
	}

	// 跳转地图页
	const toMapHotel = () => {
		uni.navigateBack()
	}

	// 跳转详情页
	const toHotelDetails = (item : HotelItem) => {
		uni.navigateTo({
			url: `/pages_B/hotel/hotelDetails?id=${item.id}`,
		})
	}



	// 上拉触底（分页加载）
	const onReachBottom = () => {
		console.log('ssssssssssssss')
		// TODO: 分页逻辑
		// 如果有 pageNum 和 totalPage，可以在这里请求下一页
		// loadMoreData()
	}
</script>

<style scoped lang="scss">
	// $border-color: #ccc;
	// $primary-color: $color;
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

	.map {
		width: 100%;
		height: 40%;
	}

	.options {
		display: flex;
		flex-wrap: wrap;
	}

	.option {
		height: 56rpx;
		border-radius: 8rpx;
		opacity: 1;
		padding-left: 40rpx;
		padding-right: 40rpx;
		background: rgba(240, 240, 240, 0.7);
		line-height: 56rpx;
		text-align: center;
		background-color: #f5f5f5;
		margin-right: 10rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		font-size: 24rpx;

		&.selected {
			background: var(--primary-color);
			color: white;
			transform: scale(1.05);
		}

		&:active {
			transform: scale(0.95);
		}
	}

	.confirm-btn {
		box-sizing: border-box;
		width: 230rpx;
		height: 96rpx;
		background: #FFFBF6;
		border: 2rpx solid var(--primary-color);
		line-height: 96rpx;
		text-align: center;
		border-radius: 48rpx;
		font-size: 32rpx;
		color: #666666;
	}

	.reset-btn {
		width: 230rpx;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		background: var(--primary-color);
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		color: #fff;
	}

	.container {
		height: 100vh;
		background: var(--head-color);
		/* 留出底部导航空间 */
	}

	.search-bar {
		padding-left: 40rpx;
		display: flex;
		align-items: center;
		position: relative;
		padding-bottom: 30rpx;
	}

	.search-input {
		width: 590rpx;
		height: 72rpx;
		border-radius: 4rpx;
		padding-left: 20rpx;
		padding-right: 100rpx;
		border: 2px solid #ebebeb;
		font-size: 28rpx;
		box-sizing: border-box;
	}

	.search-icon {
		position: absolute;
		right: 170rpx;
		top: 20rpx;
		width: 40rpx;
		height: 40rpx;
	}

	.search-dt {
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.search-dt-icon {
		width: 44rpx;
		height: 44rpx;
	}

	.search-text {
		font-size: 24rpx;
		font-weight: 500;
		color: #666;
	}

	.dropdown-content {
		position: absolute;
		top: 80rpx;
		left: 0;
		width: 100%;
		background-color: #fff;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		padding: 20rpx;
		z-index: 999;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.dropdown-item:last-child {
		border-bottom: none;
	}


	.filter-bar {
		display: flex;
		align-items: center;
		padding: 0 30rpx 20rpx;
		position: relative;
	}

	.filter-1 {
		display: flex;
		align-items: center;
		width: 590rpx;
	}

	.filter-item {
		padding: 10rpx 20rpx;
		// border: 2rpx solid $border-color;
		border-radius: 40rpx;
		background: #f0f0f0;
		font-size: 28rpx;
		font-weight: normal;
		color: #666666;
		display: flex;
		align-items: center;
		margin-right: 30rpx;
	}

	.filter-icon {
		width: 24rpx;
		height: 24rpx;
		margin-left: 10rpx;
	}

	.filter-sx-icon {
		width: 52rpx;
		height: 52rpx;
		margin-left: 30rpx;
	}

	.hotel-list {
		position: fixed;
		bottom: 150rpx;
		left: 0;
		width: 100%;
		background: var(--head-color);
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.06);
		border-radius: 24rpx 24rpx 0rpx 0rpx;
	}

	.hotel-item {
		display: flex;
		margin: 32rpx;
		padding: 32rpx;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.hotel-image {
		width: 188rpx;
		height: 272rpx;
		border-radius: 16rpx;
		margin-right: 32rpx;
	}

	.hotel-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.hotel-name {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.dingwei {
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}

	.hotel-distance {
		font-size: 24rpx;
		color: #666;
		margin-top: 26rpx;
		margin-bottom: 26rpx;
		display: flex;
		align-items: center;
	}

	.tag {
		display: inline-block;
		padding: 4rpx 10rpx;
		margin-right: 10rpx;
		background: rgba(255, 144, 0, 0.1);
		color: var(--primary-color);
		font-size: 24rpx;
		border-radius: 8rpx;
	}

	.hotel-tags {
		margin-bottom: 40rpx;
	}

	.hotel-price {
		font-size: 48rpx;
		font-weight: bold;
		align-items: center;
		display: flex;
		color: var(--primary-color);
		margin-top: 10rpx;
	}

	.hotel-pric-1 {
		font-size: 26rpx;
		margin-right: 10rpx;
	}

	.hotel-pric-2 {
		font-size: 28rpx;
		color: #666666;
		margin-left: 10rpx;
		margin-right: 10rpx;
	}

	.hotel-pric-3 {
		font-size: 24rpx;
		color: #999999;
		text-decoration: line-through;
	}

	/* 筛选弹窗样式 */
	.filter-popup-content {
		padding: 40rpx;
		max-height: 80vh;
		position: absolute;
		top: 365rpx;
		background: #fff;
		width: 100%;
		box-sizing: border-box;
	}

	.section {
		margin-bottom: 30rpx;
	}

	.text-l {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 28rpx;
		font-weight: bold;
	}

	.title1 {
		font-size: 28rpx;
		font-weight: bold;
		color: var(--primary-color);
	}

	.options {
		display: flex;
		flex-wrap: wrap;
		transition: all 0.3s ease;
		gap: 20rpx;
	}

	.options.collapsed {
		height: 40px;
		overflow: hidden;
	}


	.buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 60rpx;
		padding: 0 20rpx;
	}

	.u-button {
		width: 48% !important;
	}

	.list-juli {
		width: 80%;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>