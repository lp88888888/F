<template>
	<view class="box" :data-theme="pageTheme">
		<!-- <up-navbar title="汽车维修" :bgColor="navBgColor" @leftClick="toBack" placeholder :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar> -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="汽车维修" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<view class="fixBg"></view>
		<view class="input-box">
			<view class="input-box-left">
				<up-icon name="search" size="28" color="#333"></up-icon>
				<input placeholder="请输入门店名称" border="none" style="margin-left: 25rpx;" @input="seachchang"
					v-model="keyword"></input>
			</view>
			<!-- <view class="input-box-right" @click="toNav('/pages_D/repair/myAppointment')">
			我的预约
		</view> -->
		</view>
		<view class="pickers">
			<view class="filter-item" @click="selectOpen(1)">
				{{brandName || '品牌'}}
				<image class="arrow-icon" :src="imgUrl + 'map/xialai.png'" />
			</view>
			<view class="filter-item" style="margin-left: 30rpx;" @click="selectOpen(5)">
				{{listQuery.province + listQuery.city || '地区'}}
				<image class="arrow-icon" :src="imgUrl + 'map/xialai.png'" />
			</view>
			<view class="filter-item" @click="chonghzi()">
				{{'重置'}}
			</view>

		</view>
		
		<!-- 添加scroll-view容器实现下拉刷新和上拉加载 -->
		<scroll-view 
			class="scroll-container" 
			scroll-y 
			:refresher-enabled="true"
			:refresher-triggered="refresherTriggered"
			refresher-background="#F7F8F9"
			@refresherrefresh="onRefresherRefresh"
			@scrolltolower="onScrollToLower"
		>
			<view class="container">
				<view class="shop-item-box" v-for="(shop, index) in shops" :key="index">
					<!-- 左侧图片 -->
					<view class="shop-item" @click="toNav(`/pages_D/repair/shopDetails?id=${shop.id}`)">
						<image :src="shop.image" class="shop-image" mode="aspectFill"></image>

						<!-- 中间信息 -->
						<view class="shop-info">
							<text class="shop-name">{{ shop.name }}</text>
							<view style="display: flex;align-items: center;justify-content: space-between;">
								<text class="shop-address">{{ shop.address }}</text>
								<text class="shop-distance">{{ shop.distance }}</text>
							</view>
							<view style="display: flex;align-items: center;">
								<image class="time-icon" :src="imgUrl+'static/wx-time-icon.png'" />
								<text class="shop-time">营业时间：{{ shop.openTime }}-{{ shop.closeTime }}</text>
							</view>
						</view>
					</view>


					<!-- 右侧操作按钮 -->
					<view class="shop-actions">
						<view class="btn btn-nav" @click="navigateTo(shop)">导航到店</view>
						<view class="btn btn-call" @click="callPhone(shop)">电话咨询</view>
						<!-- <view class="btn btn-book" v-if="shop.serviceArea!=1"   @click="bookAppointment(shop)">服务预约</view> -->
					</view>
				</view>
				
				<!-- 加载更多提示 -->
				<!-- <view class="load-more" v-if="loading">
					<text class="load-more-text">加载中...</text>
				</view> -->
				<view class="no-more" v-if="noMoreData && shops.length">
					<text class="no-more-text">没有更多数据了</text>
				</view>
				<view class="empty-data" v-if="shops.length === 0">
				   	<ser-empty></ser-empty>
				</view>
			</view>
		</scroll-view>
		
		<BrandSelectPopup ref="brandSelectRef" type="brand" @change="brandChange"></BrandSelectPopup>
		<up-popup :show="showAddressPicker" round="20" @close="handleCloseAddressPicker">
			<view>
				<Address type="city" :onCallParent="handleCloseAddressPicker" @select-address="handleSelectAddress">
				</Address>
			</view>

		</up-popup>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { onLoad, onPageScroll } from '@dcloudio/uni-app';
	import { prIndustry4sList } from '@/api/car';
	const navBgColor = ref('transparent');
	import BrandSelectPopup from '@/components/BrandSelectPopup/index.vue';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	import Address from '@/pages_D/newCar/components/Address.vue';
	import { openAPPLocation,openLocation ,makePhoneCall} from '@/utils/util';
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	const currentNum = ref(0);
	const highwayIndex = ref(0);
	const selectType = ref(0);
	const show = ref(false);
	const keyword = ref('');
	const brandName = ref('');
	const highwayOptions = ref(["默认排序", "默认排序", "默认排序"]);
	const shops = ref([]);
	const longitude = ref(0);
	const latitude = ref(0);
	const brandSelectRef = ref(null);
	
	// 添加分页相关变量
	const pageNum = ref(1);
	const pageSize = ref(10);
	const total = ref(0);
	const loading = ref(false);
	const noMoreData = ref(false);
	const refresherTriggered = ref(false);
	onLoad(() => {
		getLocation();
	})
	const showAddressPicker = ref(false);
	const getLocation = () => {
		longitude.value = uni.getStorageSync('address').lng;
		latitude.value = uni.getStorageSync('address').lat;

		getPrIndustry4sList();
	};
	const handleCloseAddressPicker = (msg : string) => {
		showAddressPicker.value = false
		if (msg == 'open') {
			showAddressPicker.value = true;
		}
		console.log("showAddressPicker", showAddressPicker.value)
	};
	const chonghzi = () => {
		brandName.value = '';
		listQuery.value.brandId = ''
		listQuery.value.province = '',
			listQuery.value.city = '',
			pageNum.value = 1;
		noMoreData.value = false;
		getPrIndustry4sList()
	}
	const listQuery = ref(
		{
			brandId: '',
			province: '',
			city: ''
		})
	const seachchang = () => {
		shops.value = []
		pageNum.value = 1;
		noMoreData.value = false;
		getPrIndustry4sList()
	}
	const brandChange = (event) => {
		brandName.value = event.brandName;
		shops.value = []
		listQuery.value.brandId = event.brandId;
		pageNum.value = 1;
		noMoreData.value = false;
		getPrIndustry4sList()
	};
	const handleSelectAddress = (address) => {
		console.log("address", address)
		const { province, city } = address;
		shops.value = []
		listQuery.value.province = province;
		listQuery.value.city = city;
		pageNum.value = 1;
		noMoreData.value = false;
		getPrIndustry4sList()
		// address.value = address
	}
	const selectOpen = (type) => {
		selectType.value = type;
		if (type == 1) {
			brandSelectRef.value.open();
		}

		// 类型、能源、价格
		if (type == 2) {
			pickShow.value = true;
			columns.value.push(options3.value);
		}
		if (type == 3) {
			pickShow.value = true;
			columns.value.push(options2.value);
		}
		if (type == 4) {
			pickShow.value = true;
			columns.value.push(options1.value);
		}
		if (type == 5) {
			// showAddressPicker.value = true;
			handleCloseAddressPicker('open');
		}
	};
	
	// 下拉刷新
	const onRefresherRefresh = () => {
		refresherTriggered.value = true;
		pageNum.value = 1;
		noMoreData.value = false;
		getPrIndustry4sList(true);
	};
	
	// 上拉加载更多
	const onScrollToLower = () => {
		if (loading.value || noMoreData.value) return;
		pageNum.value++;
		getPrIndustry4sList(false);
	};
	
	// 获取门店列表
	const getPrIndustry4sList = async (isRefresh = false) => {
		if (!isRefresh) {
			loading.value = true;
		}
		
		let params = {
			typeCode: 3,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
			longitude: longitude.value,
			latitude: latitude.value,
			prIndustryCarBrandId: listQuery.value.brandId,
			province: listQuery.value.province,
			city: listQuery.value.city,
			search: keyword.value
		};

		try {
			const res = await prIndustry4sList(params);
			if (isRefresh || pageNum.value === 1) {
				shops.value = res.rows;
			} else {
				shops.value = [...shops.value, ...res.rows];
			}
			total.value = res.total;
			
			// 判断是否还有更多数据
			if (res.rows.length < pageSize.value || shops.value.length >= res.total) {
				noMoreData.value = true;
			}
		} catch (error) {
			console.error('获取门店列表失败:', error);
		} finally {
			loading.value = false;
			if (isRefresh) {
				refresherTriggered.value = false;
			}
		}
	}
	
	const onHighwayChange = (e : any) => {
	};
	const navigateTo = (shop : Shop) => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": Number(shop.longitude),
					"latitude": Number(shop.latitude),
					"address": shop.address
				}
			}
			openAPPLocation(navigationInfo)
		} else {
			openLocation({
				latitude: Number(shop.latitude),
				longitude: Number(shop.longitude),
				name: shop.name,
				address: shop.address,
				scale: 14
			});
		}

	};

	const callPhone = (shop : Shop) => {
		makePhoneCall(shop.contactNumber)
	};

	const bookAppointment = (shop) => {
		uni.navigateTo({
			url: `/pages_D/repair/ScheduleRepair?id=${shop.id}&name=${shop.name}`
		})
	};
	onPageScroll((e) => {
		if (e.scrollTop > 20) {
			navBgColor.value = '#FFFFFF';
		} else {
			navBgColor.value = 'transparent';
		}
	})
</script>

<style scoped lang="scss">
	.box{
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.searchView {
		background: var(--head-color);
	}

	page {
		min-height: 100vh;
		background: var(--head-color)
	}

	.pickers {
		display: flex;
		align-items: center;
		padding: 0 32rpx;
		box-sizing: content-box;
		z-index: 99;
		margin-top: 20rpx;
		margin-bottom: 18rpx;

	}

	.filter-item {
		padding: 0 20rpx;
		height: 56rpx;
		background: #F7F8F9;
		border-radius: 28rpx;
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.arrow-icon {
		width: 18rpx;
		height: 18rpx;
		margin-left: 19rpx;

	}

	.input-box-right {
		width: 72rpx;
		height: 72rpx;
		background: $bgLgColor;
		border-radius: 20rpx;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 20rpx;
		color: #FFFFFF;
		padding: 15rpx;
		box-sizing: border-box;
		margin-left: 10rpx;
	}

	.input-box {
		padding: 0 32rpx;
		box-sizing: content-box;
		display: flex;
		align-items: center;
	}

	.icon-s {}

	.input-box-left {
		padding-left: 30rpx;
		box-sizing: content-box;
		height: 72rpx;
		border-radius: 16rpx;
		border: 1px solid #CBD1D8;
		display: flex;
		align-items: center;
		width: 608rpx;
	}

	.fixBg {
		width: 750rpx;
		height: 351rpx;
		background: var(--head-color);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.padd-32 {
		padding: 32rpx;
		box-sizing: border-box;
	}
	
	/* 修改容器为scroll-view */
	.scroll-container {
		flex: 1;
		height: 80vh; /* 重要：让scroll-view计算高度 */
		position: relative;
	}

	.container {
		padding: 35rpx;
		min-height: 100%; /* 确保内容区域足够高 */
	}

	.shop-item-box {
		display: flex;
		flex-direction: column;
		margin-bottom: 30rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
		padding: 30rpx;
	}

	.shop-item {
		display: flex;
		align-items: center;
	}

	.shop-image {
		width: 136rpx;
		height: 136rpx;
		border-radius: 10rpx;
		margin-right: 27rpx;
		flex-shrink: 0;
	}

	.shop-info {
		flex: 1;
		overflow: hidden;
	}

	.shop-name {
		font-size: 30rpx;
		color: #000;
		font-weight: bold;
		display: block;
		margin-bottom: 12rpx;
	}

	.shop-address {
		font-size: 24rpx;
		color: #333;
		display: block;
		margin-bottom: 8rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.shop-distance {
		font-size: 24rpx;
		color: #333;
		margin-left: 10rpx;
	}

	.shop-time {
		font-size: 26rpx;
		color: #666;
		display: block;
		margin-top: 10rpx;
	}

	.time-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 12rpx;
	}

	.shop-actions {
		display: flex;
		align-items: center;
		margin-left: 20rpx;
		margin-top: 20rpx;
	}

	.btn {
		width: 180rpx;
		height: 60rpx;
		font-size: 26rpx;
		margin-right: 30rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.btn-nav,
	.btn-call {
		background-color: #fff;
		color: #333;
		border: 1px solid #C5C5C5;
	}

	.btn-book {
		background-color: #fff;
		border: 1px solid $color;
		color: $color;
	}

	/* 最后一个按钮不需要下边距 */
	.btn:last-child {
		margin-bottom: 0;
	}
	
	/* 加载更多样式 */
	.load-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 0;
	}
	
	.load-more-text {
		font-size: 24rpx;
		color: #999;
		margin-left: 16rpx;
	}
	
	.no-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 0;
	}
	
	.no-more-text {
		font-size: 24rpx;
		color: #999;
	}
	
	.empty-data {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}
	
	.empty-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 30rpx;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
</style>