<template>
	<view class="product-list-container">
		<!-- 商品列表 -->
		<view class="list-content" :class="{ 'grid-view': grid, 'list-view': !grid }">
			<view class="product-item" v-for="product in products" :key="product.spuId" @click="handleItemClick(product)">
				<!-- 商品图片 -->
				<image class="product-image" :src="product.mainImgUrl" mode="aspectFill"></image>

				<!-- 商品信息 -->
				<view class="product-info">
					<view class="product-name">{{ product.name }}</view>

					<view class="product-meta">
						<view class="flex ali-cen">
							<!-- <image class="icon-28 m-r-10" src="/src/static/logo_1.png" mode=""></image> -->
							<text class="product-price">{{ product.priceFee }}</text>
						</view>
						<text class="product-stock">余{{ product.totalStock }}件</text>
					</view>

					<view class="product-points" v-if="product.priceFee">
						<text>兑换{{ product.saleNum }}+</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';

	export interface ProductItem {

		brand: null | string
		brandId: null | string
		category: null | string | number
		categoryId: null | string
		createBy: null | string | number
		createTime: null | string
		delFlag: null | string | number
		detail: null | string
		hasSkuImg:null | number
		imgUrls: null |string
		mainImgUrl: null |string
		marketPriceFee: null |string
		name:  null |string
		priceFee: null |string
		referenceId: null |string
		remark: null |string
		saleNum: null |number
		sellingPoint:  null |string
		seq:  null |number
		shopCategory:  null |string
		shopCategoryId:  null |string
		shopId:  null |string
		shopName:  null |string
		skus:  null |string
		spuAttrValues:  null |string
		spuId:  null |string
		status:  null |number
		totalStock:  null |number
		updateBy:  null |string
		updateTime:  null |string
	}

	const props = defineProps<{
		products : ProductItem[]; // 商品数据
		grid ?: boolean;          // 是否网格布局，默认true
	}>();

	const emit = defineEmits(['itemClick']);

	// 默认使用网格布局
	const grid = ref(props.grid !== false);

	const handleItemClick = (product : ProductItem) => {
		emit('itemClick', product);
	};
</script>

<style lang="scss" scoped>
	.product-list-container {
		margin-top: 40rpx;

		.list-content {
			&.grid-view {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.product-item {
					width: 328rpx;
					margin-bottom: 30rpx;
				}
			}

			&.list-view {
				.product-item {
					display: flex;
					margin-bottom: 30rpx;

					.product-image {
						width: 328rpx;
						height: 328rpx;
					}

					.product-info {
						flex: 1;
						padding-left: 20rpx;
					}
				}
			}
		}

		.product-item {
			background: #fff;
			border-radius: 16rpx;
			overflow: hidden;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
            text-align: center;
			.product-image {
				width: 200rpx;
				height: 300rpx;
				padding: 40rpx 0 20rpx;
			}

			.product-info {
				padding: 20rpx;

				.product-name {
					width: 100%;
					font-size: 28rpx;
					color: #000;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					line-height: 40rpx;
					text-align: left;
				}

				.product-meta {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 20rpx;

					.product-price {
						font-size: 32rpx;
						color: #FF9600;
						font-weight: bold;
					}

					.product-stock {
						font-size: 24rpx;
						color: #FF9600;
					}
				}

				.product-points {
					margin-top: 10rpx;
					font-size: 22rpx;
					color: #999;
					text-align: left;
				}
			}
		}
	}
</style>