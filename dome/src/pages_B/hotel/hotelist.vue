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
			<input 
				placeholder="请输入酒店名称/服务区名称" 
				class="search-input" 
				v-model="searchValue" 
				@input="handleSearchChange"
			/>
			<image :src="imgUrl + 'trip-pro/activity/selfDrive_search.png'" mode="" @click="seachlist"
				class="search-icon"></image>
			<view class="search-dt" @tap="toMapHotel">
				<image :src="imgUrl + 'hotel/map1-icon.png'" mode="" class="search-dt-icon"></image>
				<text class="search-text">地图</text>
			</view>
		</view>

		<!-- 筛选栏 -->
		<view class="filter-bar">
			<view class="filter-1">
				<!-- 价格下拉 -->
				<view class="filter-item" @click="toggleDropdown('price')">
					{{ currentPricename || '价格' }}
					<image :src="imgUrl + 'trip-pro/arrBottom.png'" mode="" class="filter-icon"
						:class="{ 'rotate': currentDropdown === 'price' }"></image>
				</view>

				<!-- 距离下拉 -->
				<view class="filter-item" @click="toggleDropdown('location')">
					{{ currentLocationname || '距离优先' }}
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

		<!-- 酒店列表 -->
		<scroll-view 
			scroll-y 
			class="hotel-list" 
			@scrolltolower="onReachBottom"

			:refresher-triggered="isRefreshing"
			
			refresher-background="var(--head-color)"
		>
			<!-- 空状态提示 -->
			<view class="empty-state" v-if="hotels.length === 0 && !loading">
				  	<ser-empty></ser-empty>
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
							<view class="tag" v-for="(i,f) in icomlist.slice(0, 3)" :key="f">{{i}}</view>
						</view>
						<view class="hotel-price" v-if="item.minPrice">
							<text class="hotel-pric-1">¥</text>
							{{ item.minPrice }}
							<text class="hotel-pric-2">起</text>
						</view>
					</view>
				</view>
			</block>
			
			<view class="no-more" v-if="!hasMore && hotels.length > 0">
				没有更多数据了~
			</view>
			
			<view style="height: 300rpx;"></view>
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
	import { ref, reactive, onMounted, onUnmounted } from 'vue'
	import { imgUrl } from '@/config';
	import { gethotelList, gethotelservices } from '@/api/hotel';
	import BottomNavigation from './components/bottom-navigation.vue'
	import { toNav, toBack } from '@/utils/route';
	// 防抖函数
		import { debounce } from '@/utils/common'
	
	// 假设这是你的图片基础路径（根据实际配置调整）
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	
	// 搜索输入框
	const searchValue = ref('')
	const currentDropdown = ref('')
	// 当前页面标识
	const currentPage = ref('hotellist')
	
	// 下拉刷新状态
	const isRefreshing = ref(false)
	
	// 防抖搜索函数
	const debouncedSearch = debounce(() => {
		seachlist()
	}, 300)
	
	// 搜索输入变化处理
	const handleSearchChange = () => {
		debouncedSearch()
	}
	
	onMounted(() => {
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
		initMap()
		getsaixunlist1()
		getsaixunlist2()
	})
	
	onUnmounted(() => {
		// 清理防抖函数
		debouncedSearch.cancel()
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
	const currentPricename = ref('')
	const currentDistance = ref('')
	const currentLocation = ref('')
	const currentLocationname = ref('')
	const isExpanded = ref(true)
	
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
	
	const icomlist = ['环境优美', '干净卫生', '停车方便', '交通便利']
	
	const toggleExpand = () => {
		isExpanded.value = !isExpanded.value
	}
	
	// 切换下拉菜单
	const toggleDropdown = (type) => {
		currentDropdown.value = currentDropdown.value === type ? '' : type
	}
	
	const initMap = async () => {
		try {
			currentLat.value = uni.getStorageSync('address').lat;
			currentLng.value = uni.getStorageSync('address').lng;
			seachlist()
		} catch (err) {
			console.error('初始化地图失败:', err);
		}
	}
	
	const currentLat = ref('')
	const currentLng = ref('')
	
	// 关闭下拉菜单
	const closeDropdown = () => {
		currentDropdown.value = ''
	}
	
	const chongzhi = () => {
		currentLocation.value = ''
		currentPrice.value = ''
		searchValue.value = ''
		currentPricename.value = ''
		currentLocationname.value = ''
		seachlist()
	}
	
	// 选择价格
	const selectPrice = (item) => {
		currentPrice.value = item.value
		currentPricename.value = item.label
		currentDropdown.value = ''
		console.log('选择价格:', item)
		seachlist()
	}

	// 选择距离
	const selectDistance = (item) => {
		currentPrice.value = item.value
		currentDropdown.value = ''
		console.log('选择距离:', item)
		seachlist()
	}

	// 选择位置
	const selectLocation = (item) => {
		currentLocation.value = item.value
		currentLocationname.value = item.label
		console.log(item, 'item')
		currentDropdown.value = ''
		seachlist()
	}
	
	// 下拉刷新
	const onPullDownRefresh = () => {
		if (loading.value) return
		
		isRefreshing.value = true
		page.value = 1
		hotels.value = []
		hasMore.value = true
		
		getlsit().finally(() => {
			isRefreshing.value = false
		})
	}
	
	const seachlist = async () => {
		page.value = 1
		hotels.value = []
		hasMore.value = true
		getlsit()
	}
	
	const getlsit = async () => {
		if (loading.value || !hasMore.value || isRefreshing.value) return
		
		loading.value = true
		
		try {
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
			
			// 过滤状态为0的酒店
			const filteredHotels = newHotels.filter(hotel => hotel.status !== 0)
			
			// 处理酒店图片和标签
			filteredHotels.forEach(hotel => {
				if (hotel.serviceItems && typeof hotel.serviceItems === 'string') {
					hotel.serviceItems = hotel.serviceItems.split(',')
				} else if (!hotel.serviceItems) {
					hotel.serviceItems = []
				}
			})
			
			console.log(filteredHotels)
			
			if (filteredHotels.length < pageSize.value) {
				hasMore.value = false
			}
			
			// 如果是第一页，直接替换数据，否则追加数据
			if (page.value === 1) {
				hotels.value = filteredHotels
			} else {
				hotels.value = [...hotels.value, ...filteredHotels]
			}
			
			page.value++
			
		} catch (error) {
			console.error('获取酒店列表失败:', error)
		} finally {
			loading.value = false
		}
	}

	// 监听页面滚动
	const onPageScroll = (e) => {
		// 滚动距离超过一定值时，关闭下拉菜单
		if (e.scrollTop > 100) {
			closeDropdown()
		}
	}

	// 上拉加载更多
	const onReachBottom = () => {
		if (loading.value || !hasMore.value || isRefreshing.value) return
		getlsit()
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
		uni.navigateTo({
			url: '/pages_B/hotel/maphotel',
		})
	}

	// 跳转详情页
	const toHotelDetails = (item) => {
		uni.navigateTo({
			url: `/pages_B/hotel/hotelDetails?id=${item.id}`,
		})
	}
</script>

<style scoped lang="scss">
	.searchView {
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
			background-color: #FFA836;
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
		background: $pageBgColor;
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
		overflow: hidden;
		display: flex;
		flex-direction: column;
		/* 留出底部导航空间 */
	}

	.search-bar {
		padding-left: 40rpx;
		// background-color: #fff;
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
		width: 750rpx;
		flex: 1 0;
		height: 0;
		background: var(--head-color);
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
		// margin-bottom: 10rpx;
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
		background: var(--label-color);
		color: var(--primary-color);
		font-size: 24rpx;
		border-radius: 8rpx;
	}

	.hotel-tags {
		// margin-bottom: 40rpx;
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
		top: 200rpx;
		background: var(--head-color);
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
	
	/* 空状态样式 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 200rpx;
	}

	.empty-image {
		width: 300rpx;
		height: 300rpx;
		opacity: 0.6;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
		margin-top: 30rpx;
	}
	
	/* 加载更多样式 */
	.loading-more {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30rpx 0;
		color: #999;
		font-size: 28rpx;
	}

	.no-more {
		text-align: center;
		padding: 30rpx 0;
		color: #999;
		font-size: 28rpx;
	}
	
	/* 旋转动画 */
	.rotate {
		transform: rotate(180deg);
		transition: transform 0.3s;
	}
</style>