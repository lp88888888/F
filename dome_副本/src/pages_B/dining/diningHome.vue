<template>
	<view class="page-container">
		<up-sticky z-index="8888">
			<view class="topBox">
				<up-navbar :title="Detail.shopName || ''" bgColor="transparent" @leftClick="toBack"
					leftIconColor="#000000" placeholder :fixed="false" :titleStyle="{fontWeight:'bold'}"></up-navbar>
			</view>
		</up-sticky>
		<view id="topCard" class="topCard">
			<swiper class="swiperBox" :circular="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<up-image :src="item" width="100%" height="380rpx" radius="26rpx" lazyLoad></up-image>
				</swiper-item>
			</swiper>
			<view class="fl-ce-sb m-t-20">
				<view class="leftBox">
					<image :src="Detail.shopImage"></image>
					<view class="leftBox-text texNoWrap">服务区</view>
				</view>
				<view class="rightBox">
					<view class="fl-ce-sb">
						<view class="nameBox">{{ Detail.shopName }}</view>
					</view>
					<view class="csBox m-t-20" style="flex-direction: column;">
						<view class="csBox-item fl-al-ce">
							<text class="csBox-item-name">营业时间</text>
							<text class="csBox-item-value">{{ Detail.eatInOpenTime }}</text>
						</view>
						<view class="csBox-item fl-al-ce">
							<text class="csBox-item-name">联系电话</text>
							<text class="csBox-item-value">{{ Detail.phone }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="addrBox fl-ce-sb" @click="openmap">
				<view class="fl-al-ce">
					<up-icon name="map" size="12" color="#000000"></up-icon>
					<view class="font1 texNoWrap m-l-10" style="max-width:380rpx">{{Detail.address}}</view>
				</view>
				<view class="fl-al-ce">
					<view class="font1 m-r-10">距您{{ Detail.straightLineDistance }}</view>
					<up-icon name="arrow-right" size="12" color="#000000"></up-icon>
				</view>
			</view>
		</view>
		<up-gap height="15"></up-gap>
		<view class="cardBotBox">
			<view v-if="typePage == 1" style="background: #FFFFFF;">
				<view class="tjBox">
					<view class="tjBox-title"> 特色菜品</view>
					<image class="wenzibj" :src="imgUrl+'static/bj-bgz-gb.png'" mode></image>
					<view class="tjGrod">
						<view class="tjGrod-item" v-for="(item,index) in recommendList" :key="index"
							@click="toNav('./goodsDetail?id='+item.goodsId)">
							<image class="tjGrod-item-img" :src="item.goodsPicture" mode></image>
							<view class="tjGrod-item-cent">
								<view class="tjGrod-item-name">{{item.goodsName}}</view>
								<view class="fl-ce-sb">
									<view class="tjPrice">
										<text class="fs-24">￥</text>
										<text class="fs-24">{{decimalPointDivision(item.discountPrice,'left')}}</text>
										<text class="fs-18">{{decimalPointDivision(item.price,'right')}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<up-gap height="10"></up-gap>
				<view class="fl-fs-sb">
					<scroll-view class="leftTabs" scroll-y :style="{height: containerHeight + 'rpx'}">
						<view class="leftTabs-item" v-for="(item,index) in tabsList" :key="index"
							@click="leTabsClick(item)">
							<view :class="['leftTabs-item-text',item.id == tabId?'tabsActive':'']">{{item.typeName}}</view>
							<view class="leftTabs-item-line" v-if="item.id == tabId"></view>
						</view>
					</scroll-view>
					<scroll-view class="rightCent" scroll-y refresher-enabled
						:refresher-triggered="refresherTriggered" @refresherrefresh="onRefresherRefresh"
						@scrolltolower="onScrollToLower" lower-threshold="50" :style="{height: containerHeight + 'rpx'}">
						<!-- 商品列表 -->
						<view class="card" v-for="(item,index) in currentList" :key="index">
							<image class="card-image" lazy-load :src="item.goodsLogo"></image>
							<view class="card-center" @click="togolist(item)">
								<up-text :text="item.goodsName" size="14" color="#000000" bold lines="1"></up-text>
								<view class="m-t-20 m-b-20">
									<up-text :text="`月销${item.virtualSaleCnt}+`" size="12" color="#666666"
										lines="1"></up-text>
								</view>
								<view class="card-center-botom">
									<view class="card-center-price">
										<view class="newPrice"><text
												class="fs-24">￥</text>{{decimalPointDivision(item.discountPrice,'left')}}<text
												class="fs-28">{{decimalPointDivision(item.discountPrice,'right')}}</text>
										</view>
										<view class="oldPrice">￥{{ item.price }}</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 加载中提示 -->
						<view class="loading-tip" v-if="loading && !refresherTriggered">
							加载中...
						</view>
						<!-- 没有更多数据提示 -->
						<view class="no-more-tip" v-if="!hasMore && currentList.length > 0">
							没有更多数据了
						</view>
						<!-- 空数据 -->
						<ser-empty v-if="!currentList.length && !loading"></ser-empty>
						<up-gap height="200"></up-gap>
					</scroll-view>
				</view>
			</view>
			<view v-if="typePage == 2">
				<view class="starBox fl-ce-sb">
					<view class="starBox-left fl-al-fe">
						<view class="font3">4.7</view>
						<view class="m-l-20">
							<view class="font2 m-b-15">商家评分</view>
							<up-rate count="5" v-model="start" readonly
								:activeColor="themeStore.themeColors.$primaryColor" inactiveColor="#DDDDDD"
								inactiveIcon="star-fill" allowHalf gutter="2"></up-rate>
						</view>
					</view>
					<view class="starBox-right">
						<view class="csBox">
							<view class="csBox-item">
								<text class="csBox-item-name">口味</text>
								<text class="csBox-item-value" style="text-align: center;">4.7</text>
							</view>
							<view class="csBox-HHH m-r-10 m-l-20"></view>
							<view class="csBox-item">
								<text class="csBox-item-name">环境</text>
								<text class="csBox-item-value" style="text-align: center;">4.6</text>
							</view>
							<view class="csBox-HHH m-r-10 m-l-20"></view>
							<view class="csBox-item">
								<text class="csBox-item-name">服务</text>
								<text class="csBox-item-value" style="text-align: center;">4.7</text>
							</view>
						</view>
					</view>
				</view>
				<up-gap height="10"></up-gap>
				<view class="pjBox">
					<view v-for="(item,index) in pjList" :key="index">
						<up-line v-if="index >0" color="#EEEEEE"></up-line>
						<view class="pjBox-item">
							<view class="fl-ce-sb">
								<view class="fl-al-ce">
									<up-image :src="imgUrl+'tx.jpg'" width="44rpx" height="44rpx"
										shape="circle"></up-image>
									<text class="usName m-l-10">{{item.name}}</text>
								</view>
								<view class="usTime">{{item.time}}</view>
							</view>
							<view class="usText m-t-20">{{item.text}}</view>
							<view class="usImgs" v-if="item.images && item.images.length">
								<image class="usImgs-item" v-for="(url,indx) in item.images" :key="indx" :src="url"
									mode></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<up-gap height="10"></up-gap>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, getCurrentInstance, onMounted, nextTick, onUnmounted } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { getOdsFzgRestaurantInfo, specialty } from '@/api/premium';
	import { imgUrl } from '@/config';
	import theme from '@/utils/theme';
	import { decimalPointDivision, openLocation, makePhoneCall, openAPPLocation } from "@/utils/util";
	import { onLoad, onReady, onShow } from '@dcloudio/uni-app';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	const topBgColor = ref<string>('transparent');
	const topHeight = ref(200);
	const typePage = ref<string | number>(1); // 1点餐，2评价
	const start = ref(4.5);
	const Detail = ref({});
	const swiperList = ref([]);
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	const recommendList = ref([]);
	const tabId = ref(1);
	const tabsList = ref([]);
	const pjList = ref([
		{ name: '少年的你0136', time: '2025-10-13', text: '这个服务区的餐饮做的真不错，很喜欢吃，也推荐给大家，不仅服务态度好，味道也很棒。', images: [imgUrl + 'fwe.png', imgUrl + 'dsewf.png', imgUrl + 'ge.png',], isGive: false },
		{ name: '梦想家0207', time: '2025-10-13', text: '点铺环境干净卫生，饭菜的整体口味适中，服务员态度都很好，推荐给大家。', images: [], isGive: false },
	])

	// 分页相关变量
	const pageNum = ref(1); // 当前页码
	const pageSize = ref(10); // 每页条数
	const hasMore = ref(true); // 是否有更多数据
	const loading = ref(false); // 加载中状态
	const currentList = ref([]); // 当前显示的商品列表
	const refresherTriggered = ref(false); // 下拉刷新触发状态
	const containerHeight = ref(0); // 容器高度

	// 组件实例和定时器管理
	const instance = ref<any>(null);
	const refreshTimer = ref<number | null>(null);
	const queryTimer = ref<number | null>(null);
	const isComponentMounted = ref(true);

	const openmap = () => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": Detail.value.gitu,
					"latitude": Detail.value.titu,
					"address": Detail.value.address || '商家位置'
				}
			}
			openAPPLocation(navigationInfo)
		} else if (isWechatMP) {
			openLocation({
				latitude: Detail.value.titu,
				longitude: Detail.value.gitu,
				name: Detail.value.shopName,
				address: Detail.value.address,
			});
		}
	}

	const togolist = (item) => {
		uni.setStorageSync('diningGoodsDetail', item);
		toNav('/pages_B/dining/goodsDetail?id=' + item.goodsId);
	}

	const tabsChange = (type : number | string) => {
		typePage.value = type;
	}

	// 计算容器高度
	const calculateContainerHeight = () => {
		if (!isComponentMounted.value) return;
		
		clearTimeout(queryTimer.value as number);
		
		queryTimer.value = setTimeout(() => {
			if (!isComponentMounted.value) return;
			
			// 获取页面实例的替代方法
			const pages = getCurrentPages();
			if (!pages || pages.length === 0) {
				return;
			}
			
			const currentPage = pages[pages.length - 1];
			if (!currentPage) return;
			
			// 使用当前页面实例创建查询
			const query = uni.createSelectorQuery().in(currentPage as any);
			query.select('#topCard').boundingClientRect(data => {
				if (data && isComponentMounted.value) {
					const windowHeight = uni.getSystemInfoSync().windowHeight;
					const topHeight = data.bottom;
					// 计算剩余高度（windowHeight - topHeight - 安全间距）
					const safeArea = 50; // 底部安全间距
					containerHeight.value = (windowHeight - topHeight - safeArea) * 2; // 转换为rpx
				}
			}).exec();
		}, 100);
	}

	// 加载商品数据
	const loadGoodsData = async (isRefresh = false) => {
		if (loading.value || !isComponentMounted.value) return;
		loading.value = true;

		try {
			// 模拟网络请求延迟
			await new Promise(resolve => {
				if (!isComponentMounted.value) return;
				setTimeout(resolve, 500);
			});

			// 获取当前标签的商品列表
			const currentTab = tabsList.value.find(item => item.id === tabId.value);
			const goodsList = currentTab?.odsFzgRestaurantGoodsVoList || [];

			// 模拟分页：计算当前页数据
			const startIndex = (pageNum.value - 1) * pageSize.value;
			const endIndex = pageNum.value * pageSize.value;
			const newList = goodsList.slice(startIndex, endIndex);

			if (isRefresh) {
				// 下拉刷新：重置列表
				currentList.value = newList;
			} else {
				// 上拉加载：追加列表
				currentList.value = [...currentList.value, ...newList];
			}

			// 判断是否有更多数据
			hasMore.value = endIndex < goodsList.length;

		} catch (error) {
			console.error('加载商品数据失败：', error);
		} finally {
			if (isComponentMounted.value) {
				loading.value = false;
				// 确保下拉刷新状态被重置
				if (isRefresh) {
					clearTimeout(refreshTimer.value as number);
					refreshTimer.value = setTimeout(() => {
						if (isComponentMounted.value) {
							refresherTriggered.value = false;
						}
					}, 300);
				}
			}
		}
	}

	// 下拉刷新事件
	const onRefresherRefresh = () => {
		if (!isComponentMounted.value) return;
		
		// 设置下拉刷新状态为触发
		refresherTriggered.value = true;
		
		// 重置分页参数
		pageNum.value = 1;
		hasMore.value = true;
		
		// 重新加载第一页
		loadGoodsData(true);
	}

	// 上拉加载更多事件
	const onScrollToLower = () => {
		if (hasMore.value && !loading.value && isComponentMounted.value) {
			// 页码+1，加载下一页
			pageNum.value += 1;
			loadGoodsData();
		}
	}

	// 左侧标签点击事件
	const leTabsClick = (item) => {
		if (!isComponentMounted.value) return;
		
		tabId.value = item.id;
		// 重置分页参数
		pageNum.value = 1;
		hasMore.value = true;
		currentList.value = [];
		// 加载当前标签的第一页数据
		loadGoodsData(true);
	}

	const getData = async (shopId : string) => {
		if (!isComponentMounted.value) return;
		
		const res = await getOdsFzgRestaurantInfo(shopId)
		if (res.code == 200) {
			tabsList.value = res.data || [];
			if (res.data && res.data.length) {
				tabId.value = res.data[0].id;
				// 初始化加载第一页数据
				pageNum.value = 1;
				hasMore.value = true;
				currentList.value = [];
				loadGoodsData(true);
			}
		}
	}
	const specialtyFun = async (shopId : string) => {
		console.log('-0---0eer--0-0-',shopId);
		if (!isComponentMounted.value) return;
		try{
			const res = await specialty(shopId)
			console.log('-0---0--0-0-',res);
			if (res.code == 200) {
				recommendList.value = res.data
			}
		}catch(err){
			console.log('-0---0--0-0-',err);
		}
		
	}

	onLoad((opticon) => {
		isComponentMounted.value = true;
		
		if (uni.getStorageSync('diningShopInfo')) {
			Detail.value = uni.getStorageSync('diningShopInfo');
			swiperList.value = Detail.value.shopDetailImage ? Detail.value.shopDetailImage.split(',') : [];
		}
		specialtyFun(opticon.id)
		getData(opticon.id)
	})

	onReady(() => {
		if (isComponentMounted.value) {
			calculateContainerHeight();
		}
	})

	onShow(() => {
		if (isComponentMounted.value) {
			// 页面显示时重新计算高度
			calculateContainerHeight();
		}
	})

	// 组件卸载时的清理
	onUnmounted(() => {
		isComponentMounted.value = false;
		
		// 清除所有定时器
		if (refreshTimer.value) {
			clearTimeout(refreshTimer.value);
			refreshTimer.value = null;
		}
		
		if (queryTimer.value) {
			clearTimeout(queryTimer.value);
			queryTimer.value = null;
		}
		
		// 清理其他资源
		currentList.value = [];
		tabsList.value = [];
		recommendList.value = [];
	})
</script>

<style lang="scss" scoped>
	// ... 样式部分保持不变，使用之前的样式 ...
	.page-container {
		background: $pageBgColor;
		min-height: 100vh;
	}

	.font2 {
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
	}

	.font3 {
		font-weight: bold;
		font-size: 60rpx;
		line-height: 44rpx;
		color: $color;
	}

	// 使用flex布局，让容器自适应高度
	.fl-fs-sb {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		width: 100%;
		box-sizing: border-box;
	}

	.leftTabs {
		width: 160rpx;
		background: #F5F5F5;
		flex-shrink: 0;
		
		.leftTabs-item {
			width: 100%;
			min-height: 100rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			box-sizing: border-box;

			.leftTabs-item-text {
				font-weight: 500;
				font-size: 26rpx;
				color: #666666;
				padding: 30rpx 0;
				width: 100%;
				text-align: center;
				box-sizing: border-box;
			}

			.tabsActive {
				font-weight: bold;
				color: $color;
				background: #FFFFFF;
			}

			.leftTabs-item-line {
				position: absolute;
				left: 0;
				top: 25rpx;
				width: 6rpx;
				height: 50rpx;
				background: $color;
				border-radius: 0rpx 4rpx 4rpx 0rpx;
			}
		}
	}

	.rightCent {
		flex: 1;
		width: calc(100% - 160rpx);
		box-sizing: border-box;
	}

	// scroll-view 样式
	.scroll-view {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	// 加载提示样式
	.loading-tip,
	.no-more-tip {
		text-align: center;
		padding: 20rpx 0;
		font-size: 24rpx;
		color: #999;
	}

	.card {
		width: 100%;
		padding: 25rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background: #FFFFFF;
		border-radius: 20rpx 0rpx 0rpx 20rpx;
		margin-bottom: 10rpx;

		.card-image {
			width: 160rpx;
			height: 160rpx;
			background: #F5F5F5;
			border-radius: 16rpx;
			flex-shrink: 0;
		}

		.card-center {
			flex: 1;
			padding-left: 27rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			min-height: 160rpx;

			.card-center-botom {
				.card-center-price {
					display: flex;
					align-items: flex-end;

					.newPrice {
						color: $color;
						font-weight: bold;
						font-size: 36rpx;
						display: flex;
						align-items: flex-end;
					}

					.oldPrice {
						margin-left: 11rpx;
						color: #BCBCBD;
						font-size: 24rpx;
						text-decoration-line: line-through;
					}
				}

				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}

	.cardBotBox {
		width: 100%;
		box-sizing: border-box;

		.botTabs {
			padding: 35rpx 32rpx;
			box-sizing: border-box;
			border-radius: 26rpx 26rpx 0rpx 0rpx;
			background: #FFFFFF;

			.botTabs-item {
				display: inline-block;
				margin-right: 60rpx;
				position: relative;
			}

			.botTabs-item-text {
				font-weight: 500;
				font-size: 32rpx;
				color: #666666;
				line-height: 32rpx;

				text {
					font-size: 24rpx;
				}
			}

			.botTabsActibe {
				font-weight: bold;
				color: #000000;
			}

			.botTabs-item-line {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: -16rpx;
				width: 40rpx;
				height: 8rpx;
				background: $bgLgColor;
				border-radius: 4rpx;
			}
		}

		.tjBox {
			margin: 0 auto;
			width: 686rpx;
			background: #F0F3F6;
			border-radius: 26rpx;
			padding: 70rpx 25rpx 40rpx 25rpx;
			box-sizing: border-box;
			position: relative;

			.tjBox-title {
				position: absolute;
				left: 0;
				top: -16rpx;
				width: 226rpx;
				border-radius: 31rpx 0rpx 26rpx 0rpx;
				font-weight: 400;
				font-size: 36rpx;
				color: #FFFFFF;
				padding-top: 13rpx;
				padding-left: 43rpx;
				box-sizing: border-box;
				z-index: 999;
			}

			.wenzibj {
				position: absolute;
				left: 0;
				top: -10rpx;
				width: 226rpx;
				height: 89rpx;
			}

			.tjGrod {
				display: grid;
				grid-template-columns: repeat(3, 200rpx);
				grid-gap: 18rpx;

				.tjGrod-item {
					background: #FFFFFF;
					border-radius: 16rpx;
					overflow: hidden;

					.tjGrod-item-img {
						width: 200rpx;
						height: 150rpx;
						background: #FFFFFF;
						border-radius: 16rpx 16rpx 0rpx 0rpx;
						display: block;
					}

					.tjGrod-item-cent {
						width: 100%;
						height: 160rpx;
						padding: 16rpx 20rpx 25rpx 20rpx;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}

					.tjGrod-item-name {
						font-weight: bold;
						font-size: 26rpx;
						color: #000000;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						text-overflow: ellipsis;
						margin-top: 5rpx;
						line-height: 1.4;
					}

					.tjGrod-item-Icon {
						position: relative;
					}
				}
			}
		}

		.tjPrice {
			color: #000000;
			font-weight: bold;
			display: flex;
			align-items: flex-end;
		}
	}

	.addrBox {
		width: 100%;
		height: 76rpx;
		background: #F5F5F5;
		border-radius: 16rpx;
		margin-top: 24rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.leftBox {
		width: 136rpx;
		height: 136rpx;
		border-radius: 16rpx;
		position: relative;
		flex-shrink: 0;

		image {
			width: 100%;
			height: 100%;
			border-radius: 16rpx;
			display: block;
		}

		.leftBox-text {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
			padding: 0 15rpx;
			box-sizing: border-box;
			background: rgba(0, 0, 0, 0.3);
			border-radius: 0 0 16rpx 16rpx;
			font-weight: 500;
			font-size: 18rpx;
			color: #FFFFFF;
		}
	}

	.rightBox {
		flex: 1;
		margin-left: 20rpx;
		box-sizing: border-box;

		.nameBox {
			font-weight: 800;
			font-size: 36rpx;
			color: #000000;
			line-height: 1.2;
		}

		.iconBox {
			width: 88rpx;
			height: 36rpx;
			line-height: 36rpx;
			text-align: center;
			background: #FFFFFF;
			border-radius: 18rpx;
			border: 1px solid $color;
			font-weight: 500;
			font-size: 24rpx;
			color: $color;
		}
	}

	.csBox {
		margin-top: 10rpx;
		display: flex;
		flex-direction: column;

		.csBox-item {
			display: flex;
			align-items: center;
			margin-top: 15rpx;

			.csBox-item-name {
				font-weight: 500;
				font-size: 24rpx;
				color: #999999;
				flex-shrink: 0;
			}

			.csBox-item-value {
				font-weight: bold;
				font-size: 24rpx;
				color: #000000;
				margin-left: 10rpx;
				flex: 1;
			}
		}

		.csBox-HHH {
			width: 1rpx;
			height: 40rpx;
			background: #E3E3E3;
			flex-shrink: 0;
		}
	}

	.font1 {
		font-weight: 500;
		font-size: 24rpx;
		color: #333333;
	}

	.topBox {
		background: $bgTopColor;
	}

	.topCard {
		width: 750rpx;
		background: #FFFFFF;
		border-radius: 0rpx 0rpx 26rpx 26rpx;
		padding: 10rpx 32rpx 35rpx 32rpx;
		box-sizing: border-box;
	}

	.starBox {
		border-radius: 0rpx 0rpx 26rpx 26rpx;
		background: #FFFFFF;
		padding: 0 40rpx 50rpx 40rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.starBox-left {
			display: flex;
			align-items: flex-end;
		}

		.starBox-right {
			width: 300rpx;
			flex-shrink: 0;
		}
	}

	.pjBox {
		padding: 0 32rpx;
		box-sizing: border-box;
		border-radius: 26rpx 26rpx 0rpx 0rpx;
		background: #FFFFFF;

		.pjBox-item {
			padding: 30rpx 0;
			box-sizing: border-box;
		}

		.usName {
			font-weight: bold;
			font-size: 24rpx;
			color: #000000;
		}

		.usTime {
			font-weight: 500;
			font-size: 24rpx;
			color: #666666;
		}

		.usText {
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			line-height: 50rpx;
		}

		.usImgs {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 10rpx;
			margin: 20rpx 0;

			.usImgs-item {
				width: 196rpx;
				height: 196rpx;
				border-radius: 8rpx;
			}
		}

		.usDzImg {
			width: 26rpx;
			height: 26rpx;
		}

		.usDzText {
			font-size: 24rpx;
			font-weight: 500;
		}
	}

	// 通用样式类
	.fl-ce-sb {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.fl-al-ce {
		display: flex;
		align-items: center;
	}

	.m-t-20 {
		margin-top: 20rpx;
	}

	.m-b-20 {
		margin-bottom: 20rpx;
	}

	.m-l-10 {
		margin-left: 10rpx;
	}

	.m-r-10 {
		margin-right: 10rpx;
	}

	.m-l-20 {
		margin-left: 20rpx;
	}

	.m-r-20 {
		margin-right: 20rpx;
	}

	.texNoWrap {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.fs-24 {
		font-size: 24rpx;
	}

	.fs-18 {
		font-size: 18rpx;
	}

	.fs-28 {
		font-size: 28rpx;
	}
</style>