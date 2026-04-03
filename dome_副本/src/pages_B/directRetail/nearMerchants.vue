<template>
	<view class="">
		<u-sticky bgColor="transparent">
			<view class="topBgColor">
				<up-navbar title="附近门店" bgColor="none" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
				<view class="searchView">
					<u-search placeholder="请输入门店名称" v-model="keyword" searchIconColor="#000000" height="72rpx"
						shape="round" bgColor="#F5F5F5" :showAction="false" @change="selectMerchantListnFun"></u-search>
				</view>
			</view>
		</u-sticky>

		<!-- 修复1：添加 refresher-triggered 绑定 + lower-threshold 优化上拉触发 -->
		<scroll-view class="pageView" scroll-y refresher-enabled :refresher-triggered="refreshing"
			refresher-threshold="100" refresher-default-style="black" @refresherpulling="onPulling"
			@refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort"
			@scrolltolower="onReachBottom" lower-threshold="50">
			<!-- 列表内容 -->
			<view v-for="(item,index) in dataList" :key="index">
				<view class="shop-card" @click="toNav('/pages_B/directRetail/merchants?id='+item.stockId)">
					<image class="shop-image" :src="item.businessCategory"></image>
					<!-- <image class="shop-image" :src="imgUrl+'data-merchant.png'" v-else></image> -->
					<view class="shop-center">
						<view class="shop-info">
							<text class="shop-name texNoWrap">{{item.stockName}}</text>
							<view class="shop-details">
								<text class="shop-address texNoWrap">{{item.address}}</text>
								<text class="shop-distance">{{item.distance}}</text>
							</view>
						</view>
						<view class="product-list">
							<view class="product-item" v-for="(product, ind) in item.productList" :key="ind">
								<image class="product-image" :src="imgUrl+product.image"></image>
								<view class="product-details">
									<text class="product-name texNoWrap">{{ product.name }}</text>
									<text class="product-price">¥{{ product.price }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<up-gap height="15"></up-gap>
			</view>
			<view class="load-more" v-if="dataList.length > 0">
				<view v-if="loading.value" class="load-more-loading">
					<text class="load-more-text">加载中...</text>
				</view>
				<view v-else-if="!hasMore" class="load-more-text">没有更多数据了</view>
			</view>
			<view v-if="!dataList.length">
				<ser-empty></ser-empty>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, onMounted, onUnmounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import MerchantsItem from './components/MerchantsItem.vue';
	import { imgUrl } from '@/config';
	import { toNav,toBack } from "@/utils/route";
	import { selectMerchantList } from '@/api/directretail';
	// 搜索关键词
	const keyword = ref<string>('');
	// 列表数据
	const dataList = ref<any[]>([]);
	// 地址信息（修复3：兼容经纬度字段名）
	const address = ref(() => {
		const addr = uni.getStorageSync('address') || {};
		// 兼容常见的经纬度字段名（根据实际存储调整）
		return {
			lng: addr.lng || addr.longitude || '',
			lat: addr.lat || addr.latitude || ''
		};
	});
	// 分页参数
	const pageNum = ref<number>(1);
	const pageSize = ref<number>(10);
	// 加载状态
	const loading = ref<boolean>(false);
	// 是否还有更多数据
	const hasMore = ref<boolean>(true);
	// 下拉刷新状态
	const refreshing = ref<boolean>(false);
	// 修复4：动态计算scroll-view高度
	const scrollViewHeight = ref<string>('100vh');

	/**
	 * 加载门店列表数据
	 * @param isRefresh 是否是下拉刷新（重置数据）
	 */
	const loadMerchantList = async (isRefresh = false) => {
		// 如果正在加载，直接返回
		if (loading.value) return;

		// 如果不是下拉刷新且没有更多数据，直接返回
		if (!isRefresh && !hasMore.value) return;

		// 设置加载状态
		loading.value = true;

		try {
			const params = {
				pageNum: isRefresh ? 1 : pageNum.value,
				pageSize: pageSize.value,
				xPoint: address.value.lng,
				yPoint: address.value.lat,
				stockName: keyword.value
			};

			const res = await selectMerchantList(params);

			// 修复6：根据实际接口返回格式调整（关键！）
			// 假设接口返回格式：{ code: 200, data: { total: 50, rows: [] } }
			const result = res.data || res; // 兼容直接返回data的情况

			if (result && result.rows) {
				if (isRefresh) {
					// 下拉刷新：重置数据
					dataList.value = result.rows;
					pageNum.value = 1;
				} else {
					// 上拉加载：追加数据
					dataList.value = [...dataList.value, ...result.rows];
				}

				// 判断是否还有更多数据
				const totalPage = Math.ceil((result.total || 0) / pageSize.value);
				hasMore.value = (isRefresh ? 1 : pageNum.value) < totalPage;

				// 更新当前页码
				if (!isRefresh && hasMore.value) {
					pageNum.value++;
				}
			} else {
				if (isRefresh) dataList.value = [];
				hasMore.value = false;
			}
		} catch (error) {
			console.error('加载门店列表失败：', error);
		} finally {
			// 结束加载状态
			loading.value = false;
			// 结束下拉刷新状态（修复1：通过refreshing控制，移除uni.stopPullDownRefresh()）
			if (isRefresh) refreshing.value = false;
		}
	};

	/**
	 * 搜索/重新加载列表（重置分页）
	 */
	const selectMerchantListnFun = async () => {
		pageNum.value = 1;
		hasMore.value = true;
		await loadMerchantList(true);
	};

	/**
	 * 下拉刷新相关方法
	 */
	const onPulling = () => { };
	const onRefresh = () => {
		refreshing.value = true;
		loadMerchantList(true);
	};
	const onRestore = () => { };
	const onAbort = () => {
		refreshing.value = false;
	};

	/**
	 * 上拉加载更多
	 */
	const onReachBottom = () => {
		if (!hasMore.value || loading.value) return;
		loadMerchantList(false);
	};

	/**
	 * 页面挂载时初始化
	 */
	onMounted(() => {
		// 修复4：动态计算scroll-view高度（确保滚动区域足够）
		const calcScrollHeight = () => {
			const systemInfo = uni.getSystemInfoSync();
			const statusBarHeight = systemInfo.statusBarHeight; // 状态栏高度
			const topBarHeight = 200 * (systemInfo.screenWidth / 750); // 顶部导航+搜索框高度（200rpx转px）
			// 滚动高度 = 屏幕高度 - 状态栏高度 - 顶部栏高度
			const height = systemInfo.screenHeight - statusBarHeight - topBarHeight;
			scrollViewHeight.value = `${height}px`;
		};

		calcScrollHeight();
		// 监听窗口大小变化（适配旋转屏幕等场景）
		uni.onWindowResize(calcScrollHeight);

		// 加载初始数据
		if (address.value.lng && address.value.lat) {
			loadMerchantList(true);
		}
	});

	/**
	 * 页面卸载时清理
	 */
	onUnmounted(() => {
		loading.value = false;
		refreshing.value = false;
		uni.offWindowResize(); // 移除窗口监听

	});
	onLoad(() => {
		loadMerchantList()
	})
</script>

<style lang="scss">
	page {
		background: $pageBgColor;
		height: 100%;
	}

	.pageView {
		width: 100%;
		height: v-bind(scrollViewHeight); // 动态绑定计算后的高度
		padding: 30rpx 32rpx;
		box-sizing: border-box;
		overflow-y: auto; // 强制启用垂直滚动
	}

	.topBgColor {
		background: $bgTopColor;
		padding-bottom: 24rpx;
	}

	.searchView {
		padding: 0 32rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.card {
		padding: 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
	}

	// 修复2：加载中样式
	.load-more {
		text-align: center;
		padding: 30rpx 0;
		font-size: 24rpx;
		color: #999;
	}

	.load-more-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
	}

	.load-more-text {
		line-height: 40rpx;
	}

	// 空数据样式
	.empty-view {
		width: 100%;
		padding-top: 100rpx;
	}

	::v-deep .u-navbar__content {
		background: none !important;
	}

	::v-deep .u-empty {
		width: 100%;
	}

	// 门店卡片样式（保持不变）
	.shop-card {
		padding: 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;

		.shop-image {
			width: 116rpx;
			height: 116rpx;
			border-radius: 16rpx;
		}

		.shop-center {
			width: calc(100% - 136rpx);
		}

		.shop-info {
			display: flex;
			min-height: 116rpx;
			flex-direction: column;
			justify-content: space-around;
		}

		.shop-details {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.shop-name {
			font-weight: 800;
			font-size: 32rpx;
			color: #000000;
		}

		.shop-address {
			font-weight: 500;
			font-size: 24rpx;
			color: #666666;
		}

		.shop-distance {
			font-weight: 500;
			font-size: 24rpx;
			color: #333333;
		}
	}

	.product-list {
		padding-top: 10rpx;
		display: flex;
		justify-content: space-around;
	}

	.product-item {
		width: 144rpx;
	}

	.product-image {
		width: 144rpx;
		height: 144rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		border: 1rpx solid #EBEBEB;
	}

	.product-name {
		width: 100%;
		font-weight: 500;
		font-size: 24rpx;
		color: #333333;
		text-align: center;
	}

	.product-price {
		text-align: left;
		font-weight: bold;
		font-size: 24rpx;
		color: $color;
	}
</style>