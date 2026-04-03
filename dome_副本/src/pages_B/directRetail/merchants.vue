<template>
	<view id="top" class="top">
		<up-navbar title="商家详情" bgColor="none" @leftClick="leftClick" placeholder :fixed="false"></up-navbar>
		<view class="backColor"></view>
		<view class="searchView">
			<u-search placeholder="请输入商品名称" v-model="keyword" searchIconColor="#000000" shape="round" bgColor="#FFFFFF"
				:showAction="false" @change="handleSearch"></u-search>
			<u-line direction="col" color="rgba(255,255,255,0)" margin=" 0 5rpx"></u-line>
		</view>
		<up-gap height="10"></up-gap>
		<!-- 商家信息：增加存在判断，避免报错 -->
		<view class="cardDetail" v-if="merchant.stockName">
			<image class="cardDetail-image" lazy-load :src="merchant.businessCategory || defaultImg" mode="aspectFill">
			</image>
			<!-- 	<image class="cardDetail-image" :src="imgUrl+'data-merchant.png'" v-else></image> -->
			<view class="cardDetail-center">
				<up-text :text="merchant.stockName" size="18" bold color="#000000" lines="1"></up-text>
				<up-gap height="11"></up-gap>
				<up-text :text="merchant.address" size="13" color="#666666" lines="1"></up-text>
				<up-gap height="5"></up-gap>
				<view class="cardDetail-center-bott">
					<text>{{merchant.distance || 0}}</text>
					<view class="cardDetail-center-icon">
						<u-icon :name="imgUrl+'static/B-direct-merch-tel.png'" size="16"
							@click="makePhoneCall(merchant.phoneNumber)"></u-icon>
						<view class="lineHHH"></view>
						<u-icon :name="imgUrl+'static/B-direct-merch-nav.png'" size="16" @click="map()"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<up-gap height="15"></up-gap>

		<view class="listCard" v-if="merchant.stockName">
			<view class="listCard-title">商品<text>({{dataList.length}})</text></view>
			<view class="catTab" :style="{height: catTabHeight}"> <!-- 直接绑定高度 -->
				<scroll-view class="catTab-left" scroll-y="true">
					<view class="tabItem" :class="{active:selectInde == index}" v-for="(item,index) in tabList"
						:key="index" @click="tabClick(item,index)">
						{{item.name}}
						<view v-if="selectInde == index" class="active-icon"></view>
					</view>
				</scroll-view>
				<!-- 右侧滚动区域：修复高度绑定，增加空数据提示 -->
				<scroll-view class="catTab-right" scroll-y="true" @scrolltolower="loadMore" lower-threshold="100">
					<!-- 空数据提示 -->
					<view v-if="dataList.length === 0 && !loading">
						<ser-empty></ser-empty>
					</view>
					<view class="listItem" v-else style="margin-top: 5rpx;">
						<view class="card" v-for="(item,index) in dataList" :key="item.id || index"
							@click="toNav('/pages_B/directRetail/shopDetail?spuId='+item.id)"> <!-- 优先用item.id作为key -->
							<image class="card-image" lazy-load :src="item.imgUrl || defaultImg" mode="aspectFill">
							</image>
							<!-- <image class="card-image" lazy-load :src="imgUrl+'data-shop.png'" v-else></image> -->
							<view class="card-center">
								<up-text :text="item.productName || '未知商品'" size="14" color="#000000" bold
									lines="1"></up-text>
								<!-- 	<up-text v-if="type == 'list'" text="月售200+" size="12" color="#666666" lines="1"></up-text> -->
								<!-- 	<up-text v-if="type == 'collection'" text="宝鸡西服务区" size="12" color="#999999" lines="1"></up-text> -->
								<view class="card-center-botom">
									<view class="card-center-price">
										<view class="newPrice"><text class="fs-24">￥{{item.sellingPrice || 0}}</text>
										</view>
									</view>
									<up-number-box v-if="type == 'shopCar'" v-model="value" @change="onChange"
										bgColor="none">
										<template #minus>
											<up-icon name="minus-circle" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
										</template>
										<template #plus>
											<up-icon name="plus-circle-fill" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
										</template>
									</up-number-box>
								</view>
								<up-text v-if="type == 'collection'"
									:prefixIcon="imgUrl+'static/B-direct-shop-icon2.png'"
									:iconStyle="{width:'12px',height:'12px',marginRight:'10rpx'}" text="昆仑好客" size="11"
									color="#666666" lines="1"></up-text>
							</view>
						</view>
						<up-gap height="10"></up-gap>
					</view>

					<!-- 加载状态 -->
					<view class="load-more" v-if="dataList.length > 0">

						<text v-if="!hasMore" class="load-more-text">没有更多商品了</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, onMounted, watch } from 'vue';
	import { imgUrl } from '../../config';
	import { toNav } from '@/utils/route';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import CatTab from "./components/CatTab.vue";
	import ShopCart from './components/ShopCart.vue';
	import { selectMerchantById } from '@/api/directretail';
	import { makePhoneCall, openAPPLocation,openLocation } from '@/utils/util';
	import GoodsListItemVue from './GoodsListItem.vue';
	
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);	
	
	
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	// 1. 修复：初始化必要变量（之前缺失type、defaultImg）
	const selectInde = ref(0);
	const stockId = ref('');
	const value = ref(1);
	const tabList = ref([{ name: '全部' }]);
	const keyword = ref('');
	const catTabHeight = ref('60vh'); // 默认高度，避免为0
	const address = ref(uni.getStorageSync('address') || {});
	const merchant = ref<any>({}); // 初始化为对象，避免访问属性报错
	const dataList = ref<any[]>([]);
	const type = ref('list'); // 定义type默认值，匹配模板中的v-if判断
	const defaultImg = ref('/static/default.png'); // 默认图片，避免imgUrl为空

	// 分页相关（简化逻辑，先确保首次加载）
	const pageNum = ref(1);
	const pageSize = ref(20);
	const hasMore = ref(true);
	const loading = ref(false);

	// 2. 修复：数据请求逻辑（增加错误处理、数据校验、打印调试）
	const selectMerchantByIdFun = async (id : string, isReset : boolean = false) => {
		if (loading.value || (!isReset && !hasMore.value)) return;

		loading.value = true;
		console.log('请求参数：', {
			pageNum: pageNum.value,
			pageSize: pageSize.value,
			xPoint: address.value.lng,
			yPoint: address.value.lat,
			stockId: id,
			productName: keyword.value
		});

		try {
			const res = await selectMerchantById({
				pageNum: pageNum.value,
				pageSize: pageSize.value,
				xPoint: address.value.lng || '', // 避免undefined
				yPoint: address.value.lat || '',
				stockId: id,
				productName: keyword.value
			});

			console.log('接口返回结果：', res); // 打印结果，方便调试

			// 修复：兼容接口返回格式（如果res.rows不是数组，或res.rows[0]不存在）
			const merchantData = res.rows && res.rows.length > 0 ? res.rows[0] : {};
			const productList = merchantData.dimServiceAreaMerchantProducts || [];

			// 更新商家信息
			merchant.value = merchantData;

			// 更新商品列表
			if (isReset || pageNum.value === 1) {
				dataList.value = productList;
			} else {
				dataList.value = [...dataList.value, ...productList];
			}

			// 判断是否还有更多（如果当前页数据少于pageSize，说明没有更多）
			hasMore.value = productList.length === pageSize.value;
			pageNum.value++;

			console.log('最终商品列表：', dataList.value); // 确认数据是否正确
		} catch (error) {
			console.error('请求商品列表失败：', error);
			uni.showToast({ title: '加载失败', icon: 'none' });
			hasMore.value = false;
		} finally {
			loading.value = false;
		}
	};

	// 3. 修复：样式相关（确保右侧区域有高度）
	const getElementByIdHeight = (id : string) => {
		uni.createSelectorQuery()
			.select(`#${id}`)
			.boundingClientRect((data : any) => {
				if (data) {
					const info = uni.getSystemInfoSync();
					// 计算高度：屏幕高度 - top区域高度 - 标题栏高度（83rpx）- 底部安全区（45rpx）
					const calcHeight = info.screenHeight - data.height - 83 - 45;
					catTabHeight.value = `${calcHeight}px`; // 确保高度为正数
					console.log('计算后右侧区域高度：', catTabHeight.value);
				}
			})
			.exec();
	};

	// 4. 其他修复：补全缺失的函数、监听逻辑
	const leftClick = () => {
		uni.navigateBack({
			delta: 1,
			fail: () => {
				uni.navigateTo({ url: "/pages/home/home" });
			}
		});
	};

	const tabClick = (item : any, index : number) => {
		selectInde.value = index;
		resetPageAndLoad(); // 切换分类重新加载
	};

	const handleSearch = () => {
		resetPageAndLoad();
	};

	const resetPageAndLoad = () => {
		pageNum.value = 1;
		hasMore.value = true;
		dataList.value = [];
		selectMerchantByIdFun(stockId.value, true);
	};

	const loadMore = () => {
		if (!loading.value && hasMore.value) {
			selectMerchantByIdFun(stockId.value);
		}
	};

	const map = () => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": Number(merchant.value.longitudeBd09),
					"latitude": Number(merchant.value.latitudeBd09),
					"address": merchant.value.stockName || '商家位置'
				}
			}
			openAPPLocation(navigationInfo)
		} else {
			openLocation({
				latitude: Number(merchant.value.latitudeBd09),
				longitude: Number(merchant.value.longitudeBd09),
				scale: 18,
				name: merchant.value.stockName || '商家位置'
			});
		}

	};

	const onChange = (val : number) => {
		value.value = val;
	};

	// 页面加载时请求数据
	onLoad((options : any) => {
		stockId.value = options.id || '';
		if (stockId.value) {
			resetPageAndLoad();
		} else {
			uni.showToast({ title: '缺少商家ID', icon: 'none' });
		}
	});

	// 确保DOM渲染后计算高度
	onMounted(() => {
		setTimeout(() => {
			getElementByIdHeight('top');
		}, 300); // 延长延时，确保top区域渲染完成
	});

	// 监听关键词和分类变化
	watch([keyword, selectInde], () => {
		resetPageAndLoad();
	});
</script>

<style lang="scss">
	@import './index.scss';

	.top {
		height: 100vh;
		overflow: hidden;
	}

	.cardDetail {
		width: 686rpx;
		margin: 0 auto;
		// height: 186rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
		display: flex;
		// align-items: center;
		justify-content: space-between;

		.cardDetail-image {
			width: 126rpx;
			height: 126rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
		}

		.cardDetail-center {
			width: calc(100% - 156rpx);
			// height: 126rpx;
			// display: flex;
			// flex-direction: column;
			// justify-content: space-between;

			.cardDetail-center-bott {
				display: flex;
				align-items: flex-end;
				justify-content: space-between;
				font-weight: 500;
				font-size: 24rpx;
				color: $color;

				.cardDetail-center-icon {
					display: flex;
					align-items: center;

					.lineHHH {
						width: 1rpx;
						height: 36rpx;
						background: #E0E0E0;
						margin: 0 20rpx;
					}
				}
			}

		}
	}

	.topBgColor {
		background: $bgTopColor;
	}

	.backColor {
		background: $bgTopColor;
	}

	.list {
		height: 80vh;
		background: saddlebrown;
		overflow: scroll;
	}

	.listCard {
		width: 100%;

		.listCard-title {
			width: 100%;
			height: 88rpx;
			background: #FFFFFF;
			border-radius: 20rpx 20rpx 0rpx 0rpx;
			line-height: 88rpx;
			padding: 0 33rpx;
			box-sizing: border-box;
			font-weight: 800;
			font-size: 32rpx;
			color: #000000;
			border-bottom: 1rpx solid #E0E0E0;

			text {
				font-size: 24rpx;
				font-weight: 500;
			}
		}
	}

	.catTab {
		width: 100%;
		display: flex;
		justify-content: space-between;
		background: $pageBgColor;

		.catTab-left {
			width: 160rpx;

			// height: 50vh;
			.tabItem {
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 500;
				font-size: 26rpx;
				color: #666666;
				position: relative;
			}

			.active {
				font-weight: bold;
				color: $color;
				background: #FFFFFF;

				.active-icon {
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

		.catTab-right {
			width: calc(100% - 160rpx);
			height: 60vh;
			// height: 50vh;
			padding-bottom: 30rpx;
		}
	}

	.card {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background: #FFFFFF;
		border-radius: 10rpx 0rpx 0rpx 10rpx;
		margin: 0 10rpx 20rpx;
		padding: 20rpx 10rpx;

		.card-image {
			width: 135rpx;
			height: 135rpx;
			border-radius: 16rpx;
		}

		.card-center {
			padding-left: 27rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.card-center-botom {
				.card-center-price {
					display: flex;
					align-items: flex-end;

					.newPrice {
						color: $color;
						font-weight: bold;
						font-size: 36rpx;
						margin-top: 10rpx;
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

	// 加载更多样式
	.load-more {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80rpx;
		font-size: 24rpx;
		color: #888888;
	}

	.load-more-text {
		color: #888888;
		font-size: 24rpx;
	}
</style>