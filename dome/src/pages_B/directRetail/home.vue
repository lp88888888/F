<template>
	<view class="">
		<u-sticky bgColor="transparent">
			<view class="" :style="{background:topBgColor}">
				<up-navbar title="服务区零售" bgColor="transparent" @leftClick="toBack" placeholder :fixed="false"
					:titleStyle="{fontWeight: 'bold'}"></up-navbar>
				<view class="searchView">
					<view class="searcch-box flex">
						<image class="icon-32 m-r-10" :src="imgUrl+'new_search.png'" mode=""></image>
						<up-input v-model="keyword" placeholder="请输入商品名称" border="none" placeholder-style="color: #999"
							@confirm="handleSearch" clearable @clear="handleClear" @change="SearchFun" />
					</view>
				</view>
				<!-- <view class="searchView">
					<u-search placeholder="请输入门店名称" v-model="keyword" searchIconColor="#000000" shape="round"
						bgColor="#FFFFFF" :showAction="false" @change="SearchFun()"></u-search>
				</view> -->
				<up-gap height="10"></up-gap>
			</view>
		</u-sticky>
		<view class="backColor"></view>
		<view class="pageView">
			<up-gap height="5"></up-gap>
			<view class="card">
				<view class="card-title">
					<view class="card-title-left">
						<image :src="imgUrl+'static/B-direct-nav-shop.png'" style="width: 130rpx;height: 30rpx;"
							mode=""></image>
					</view>
					<view class="card-title-right" @click="toNav('/pages_B/directRetail/nearMerchants')">
						<text>更多</text>
						<up-icon name="arrow-right" color="#999999" size="10"></up-icon>
					</view>
				</view>
				<up-gap height="17"></up-gap>
				<view class="gropFj">
					<view class="gropFj-item" v-for="(item,index) in cardList" :key="index"
						@click="toNav('/pages_B/directRetail/merchants?id='+item.stockId)">
						<image lazy-load class="gropFj-item-img" :src="item.businessCategory"></image>
						<view class="gropFj-item-cent">
							<view class="shop_title shop_f1">
								{{item.stockName}}
							</view>
							<up-gap height="5"></up-gap>
							<view class="shop_title shop_f2">{{item.address}}</view>
							<up-gap height="4"></up-gap>
							<text class="gropFj-item-cent-icon">{{item.distance}}</text>
						</view>
					</view>
				</view>
			</view>
			<up-gap height="15"></up-gap>
			<view class="lisView">
				<view class="lisView-item" v-for="(item,index) in dataList" :key="index"
					@click="toNav('/pages_B/directRetail/shopDetail?spuId='+item.id)">
					<view class="lisView-item-img">
						<image lazy-load :src="item.imgUrl"></image>
					</view>
					<view class="lisView-item-center">
						<view class="lisView-item-shopName">
							<up-text :text="item.brand" size="11" color="#666666" lines="1"></up-text>
						</view>
						<up-gap height="11"></up-gap>
						<up-text :text="item.productName" size="14" color="#000000" lines="1"></up-text>
						<up-gap height="11"></up-gap>
						<view class="lisView-item-price">
							<view class="newPrice"><text style="font-size: 24rpx;">￥</text>{{item.sellingPrice}}</view>
							<!-- 	<view class="oldPrice">￥{{item.sellingPrice}}</view> -->
						</view>
					</view>
				</view>
			</view>
			<view v-if="!dataList.length">
				<ser-empty></ser-empty>
			</view>
			<!-- 加载状态提示 -->
			<view class="load-more" v-if="dataList.length > 0">
				<text v-if="!hasMore" class="load-more-text">没有更多数据了</text>
			</view>
			<up-gap height="30"></up-gap>
		</view>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, computed, onMounted } from 'vue';
	import { onLoad, onShow, onPageScroll, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { listPrShopSpu, getShopCarProdCount } from '@/api/points';
	import { selectMerchantList, selectProductList } from '@/api/directretail';

	const topBgColor = ref<string>('rgba(255,255,255,0)');
	const shopCarTotal = ref<number | null>(0);
	const keyword = ref('');
	const cardList = ref([
		// 示例数据保留
	]);
	const address = ref(uni.getStorageSync('address') || {});
	const dataList = ref([]);

	// 分页相关变量
	const pageNum = ref<number>(1); // 当前页码
	const pageSize = ref<number>(20); // 每页条数
	const hasMore = ref<boolean>(true); // 是否还有更多数据
	const loading = ref<boolean>(false); // 加载中状态

	const flPrice = computed(() => {
		return (price : string | number, type : string) => {
			let srt : string = String(Number(price).toFixed(2));
			if (price) {
				if (type == 'left') {
					return srt.substring(0, srt.indexOf('.'))
				} else {
					return srt.substring(srt.indexOf('.'))
				}
			}
			return ''
		}
	});

	onPageScroll((e) => {
		if (e.scrollTop < 1) {
			topBgColor.value = 'rgba(255,255,255,0)'
		} else {
			topBgColor.value = '#ffffff'
		}
	})

	const selectMerchantListnFun = async () => {
		let params = {
			pageNum: 1,
			pageSize: 4,
			xPoint: address.value.lng,
			yPoint: address.value.lat
		}
		const res = await selectMerchantList(params);
		cardList.value = res.rows
	}
	const handleClear = () => {
		keyword.value = ''; // 明确清空输入框值
		dataList.value = []
		selectProductListFun(false)
	}
	const SearchFun = () => {
		dataList.value = []
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 0, // 无动画，瞬间回顶
		});
		pageNum.value = 1
		selectProductListFun(false)
	}
	// 修改后的产品列表请求函数，支持分页
	const selectProductListFun = async (isLoadMore = false) => {


		loading.value = true;

		try {
			let params = {
				pageNum: pageNum.value,
				pageSize: pageSize.value,
				productName: keyword.value
			}
			const res = await selectProductList(params);

			// 处理下拉刷新和上拉加载
			if (isLoadMore) {
				// 上拉加载：追加数据
				dataList.value = [...dataList.value, ...res.rows];
			} else {
				// 初次加载或下拉刷新：替换数据
				dataList.value = res.rows;
			}

			// 判断是否还有更多数据
			const total = res.total || 0; // 假设接口返回total字段
			hasMore.value = (pageNum.value * pageSize.value) < total;

			// 加载成功后页码+1
			if (hasMore.value) {
				pageNum.value++;
			}

		} catch (error) {
			console.error('获取产品列表失败：', error);
		} finally {
			loading.value = false;
			// 结束下拉刷新动画
			if (onPullDownRefresh) {
				uni.stopPullDownRefresh();
			}
		}
	}

	const getShopCar = async () => {
		let res = await getShopCarProdCount()
		if (res.code === 200) {
			shopCarTotal.value = res.data
		}
	}

	// 下拉刷新处理
	const handlePullDownRefresh = () => {
		// 重置分页参数
		pageNum.value = 1;
		hasMore.value = true;
		// 重新加载数据
		selectProductListFun(false);
	}

	// 上拉加载更多（页面触底）
	onReachBottom(() => {
		selectProductListFun(true);
	});

	// 监听下拉刷新
	onPullDownRefresh(handlePullDownRefresh);

	onMounted(() => {
		// getShopCar();
		selectMerchantListnFun()
		selectProductListFun(false)
	})
</script>

<style lang="scss">
	// @import './index.scss';
	.pageView{
		padding: 0 30rpx;
		box-sizing: border-box;
		// position: relative;
		// z-index: 0;
	}
	.shopCar {
		width: 126rpx;
		height: 126rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(0, 0, 0, 0.2);
		position: fixed;
		bottom: 200rpx;
		right: 20rpx;

		.shopCar-img {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.card {
		width: 100%;
		background: $bgTopColor;
		border-radius: 20rpx;
		border: 3px solid #FFFFFF;
		padding: 36rpx 31rpx;
		box-sizing: border-box;

		.card-title {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.card-title-left {
				font-weight: bold;
				font-size: 36rpx;
				color: #000000;

				.tetxIcon {
					color: $color;
				}
			}

			.card-title-right {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 24rpx;
				color: #999999;
			}
		}
	}

	.gropFj {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 32rpx;

		.gropFj-item {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.gropFj-item-img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 16rpx;

			}

			.gropFj-item-cent {
				width: calc(100% - 117rpx);

				.gropFj-item-cent-icon {
					display: inline-block;
					font-size: 20rpx;
					color: $color;
					padding: 4rpx 10rpx;
					border-radius: 6rpx;
					border: 1rpx solid $color;
					box-sizing: border-box;

				}
			}
		}
	}

	.lisView {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2, 335rpx);
		grid-gap: 20rpx;

		.lisView-item {
			width: 100%;
			padding: 0 20rpx 25rpx;
			box-sizing: border-box;
			border-radius: 20rpx;
			background: #FFFFFF;

			.lisView-item-img {
				width: 100%;
				height: 328rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 240rpx;
					height: 240rpx;
				}
			}

			.lisView-item-center {
				margin-top: -18rpx;

				.lisView-item-shopName {
					width: 100%;
					height: 36rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					border: 1rpx solid #EEEEEE;
					padding: 4rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;

					image {
						width: 28rpx;
						height: 28rpx;
						border-radius: 8rpx;
						margin-right: 6rpx;
					}
				}

				.lisView-item-price {
					display: flex;
					align-items: flex-end;

					.newPrice {
						color: $color;
						font-weight: bold;
						font-size: 36rpx;
					}

					.oldPrice {
						margin-left: 11rpx;
						color: #BCBCBD;
						font-size: 24rpx;
						text-decoration-line: line-through;
					}
				}
			}
		}
	}

	.backColor {
		background: $bgTemToPageColor;
	}

	// 加载更多样式
	.load-more {
		text-align: center;
		padding: 30rpx 0;

		.load-more-text {
			font-size: 24rpx;
			color: #999999;
		}
	}

	.searcch-box {
		height: 70rpx;
		background: #F5F5F5;
		border-radius: 410rpx 410rpx 410rpx 410rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 24rpx;
		flex: 1
	}

	.shop_title {
		width: 160rpx;
		white-space: nowrap;
		/* 防止文本换行 */
		overflow: hidden;
		/* 隐藏溢出的内容 */
		text-overflow: ellipsis;
		/* 显示省略符号来代表被修剪的文本 */
	}

	.shop_f1 {
		color: #000000;
		font-size: 26rpx;
	}

	.shop_f2 {
		color: #666666;
		font-size: 22rpx;
	}
</style>