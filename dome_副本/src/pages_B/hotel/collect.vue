<template>
	<view class="container" :data-theme="pageTheme">
		<!-- <cos-header :isShowLeft="false" title='我的收藏' :background-color="backgroundColor"
			:font-color="fontColor" :fixed="fixed" :defaultNavBarheight="100"></cos-header> -->
		<!-- <view :style="{ paddingTop: navBarHeight + 'px' }"> -->
		<up-navbar title="我的收藏" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
		
		<!-- 搜索栏 -->
		<view class="search-bar">
			<input placeholder="请输入酒店名称/服务区名称" class="search-input" v-model="searchValue" />
			<image :src="imgUrl + 'trip-pro/activity/selfDrive_search.png'" mode="" @click="seachlist()"
				class="search-icon">
			</image>
		</view>
		<emptyview v-if="hotels.length <= 0" />
		<!-- 酒店列表 -->
		<scroll-view v-else scroll-y class="hotel-list" @scrolltolower="onReachBottom">
			<view v-for="item in hotels" :key="item.id" class="hotel-item" @click="itemClick(item)">
				<image :src="item.mainImage[0]" class="hotel-image" mode="aspectFill"></image>
				<view class="hotel-info">
					<view class="hotel-name">{{ item.hotelName }}</view>
					<view class="hotel-distance">
						<image :src="imgUrl + 'hotel/dizhi-icon.png'" mode="" class="dingwei"></image>
						<view class="list-juli">
							距您{{ item.distance }}km · {{ item.address }}
						</view>
					</view>
		
					<!-- 使用 uView 的标签组 -->
					<view class="hotel-tags">
						<u-tag v-for="(tag, index) in item.serviceItems" :key="index" :text="tag" type="warning"
							size="mini" plain class="tag" />
					</view>
		
					<!-- 价格展示 -->
					<view class="hotel-price" v-if="item.minPrice">
						<text class="hotel-pric-1">¥</text>
						{{ item.minPrice }}
						<text class="hotel-pric-2">起</text>
						<!-- <text class="hotel-pric-3">¥{{ item.basePrice }}</text> -->
					</view>
				</view>
			</view>
			<view style="height: 300rpx;"></view>
		</scroll-view>
		         <view  class="serempty"  v-if="hotels.length == 0">
				  	<ser-empty></ser-empty>
			</view>
		<!-- 底部导航 (假设是一个自定义全局组件) -->
		<BottomNavigation :current-page="currentPage" @change="handleNavChange" />
	</view>
</template>

<script lang="ts" setup>
	import theme from '@/utils/theme'
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '@/config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import BottomNavigation from './components/bottom-navigation.vue'
	import { collectionList } from '@/api/hotel';
	import { toNav,toBack } from '@/utils/route';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	// 假设你有这些工具类或 API 模块
	// import { getHotelList } from '@/api/hotel'
	// import util from '@/utils/util'

	// 数据定义
	const keyword = ref('');
	const hotels = ref([])
	const page = ref(1)
	const pageSize = ref(10)
	const loading = ref(false)
	const hasMore = ref(true)
	const currentPrice = ref({})
	const currentDistance = ref({})
	const currentLocation = ref({})
	const totalPage = ref(0);

	// 布局
	const backgroundColor = ref<string>('#FFFFFF');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref<number>(0);
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
	});
	// 静态标签（可提取为常量）
	const staticTags = ['免费停车', '餐厅', '会议室', '健身房'];
	// 类型定义
	interface HotelItem {
		id : number;
		imageUrl : string;
		name : string;
		distance : number;
		address : string;
		price : number;
		originalPrice : number;
	}

	// 页面生命周期
	const currentPage = ref('collect')
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
	})
	const seachlist = async () => {
		page.value = 1
		hotels.value = []

		getlsit()
	}
	const currentLat = ref('')
	const currentLng = ref('')
	const searchValue = ref('')
	const initMap = async () => {
		try {
			// 获取用户位置
			currentLat.value = uni.getStorageSync('address').lat;
			currentLng.value = uni.getStorageSync('address').lng;
			seachlist()

		} catch (err) {
			console.error('初始化地图失败:', err);
		} finally {

		}
	}
	const getlsit = async () => {
		// if (loading.value || !hasMore.value) return
		loading.value = true
		// 这里替换成实际的API调用
		let params = {
			pageNum: page.value,
			pageSize: pageSize.value,
			hotelName: searchValue.value,
			longitude: currentLng.value,
			latitude: currentLat.value,
		}
		const response = await collectionList(params)
		const newHotels = response.rows || []
		console.log(newHotels)

		newHotels.forEach((hotel, index) => {
			if (hotel.status == 0) {
				newHotels.splice(index, 1); // 删除当前项
			}
			if (hotel.mainImage) {
				hotel.mainImage = hotel.mainImage.split(',')
			} else {
				hotel.mainImage = []
			}
			// 将酒店的服务项目数组（serviceItems）使用逗号连接成字符串
			if (hotel.serviceItems && typeof hotel.serviceItems === 'string') {
				hotel.serviceItems = hotel.serviceItems.split(',')
			} else if (!hotel.serviceItems) {
				hotel.serviceItems = [] // 如果不存在，设为空数组
			}
		})
		// if (newHotels.length < pageSize.value) {
		// 	hasMore.value = false
		// }
		// 合并新旧数据
		hotels.value = page.value == 1 ? newHotels : [...hotels.value, ...newHotels],
		totalPage.value = res.total
		// page.value++
		loading.value = false
	}
	const handleNavChange = ({ page, route } : { page : string; route : string }) => {
		currentPage.value = page
		console.log('导航切换到:', page, route)
		uni.redirectTo({
			url: route
		})
	}

	// 事件处理
	const itemClick = (item : HotelItem) => {
		uni.navigateTo({
			url: `/pages_B/hotel/hotelDetails?id=${item.hotelId}`,
		});
	};



	const onReachBottom = () => {
		if(totalPage.value > hotels.value.length){
			page.value++;
			getlsit();
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		display: flex;
		background: var(--head-color);
		flex-direction: column;
	}

	.search-bar {
		padding: 20rpx;
		margin: 0 40rpx;
		// background-color: #fff;
		border: 2px solid #ebebeb;
		display: flex;
		align-items: center;
		justify-content: space-between;

		::v-deep .u-search__content {
			border-radius: 8rpx !important;
		}
	}

	.search-input {
		width: 80%;
	}

	.search-icon {
		width: 40rpx;
		height: 40rpx;
		z-index: 10;
	}

	.hotel-list {
		width: 750rpx;
		flex: 1 0;
		height: 0;
		background-color: #f5f5f5;
	}

	.hotel-item {
		display: flex;
		margin: 32rpx;
		padding: 32rpx;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
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
		color: #333;
	}

	.hotel-distance {
		font-size: 24rpx;
		color: #666;
		margin-top: 26rpx;
		margin-bottom: 26rpx;
		display: flex;
		align-items: center;
	}

	.hotel-tags {
		margin-bottom: 40rpx;
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
	}

	.tag {
		background: rgba(255, 144, 0, 0.1);
		color: var(--primary-color);
		border-radius: 8rpx;
		padding: 4rpx 10rpx;
		font-size: 24rpx;
	}

	.hotel-price {
		font-size: 48rpx;
		font-weight: bold;
		color: var(--primary-color);
		margin-top: 10rpx;
		display: flex;
		align-items: center;
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

	.dingwei {
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}

	.list-juli {
		width: 80%;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.serempty{
		position: absolute;
		top: 50%;
		left: 50%;
		transform:translate(-50%,-50%);
	}
</style>