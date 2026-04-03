<template>
	<view v-for="(item,index) in list" :key="index">
		<view class="shop-card" @click="toNav('/pages_B/directRetail/merchants')">
			<image class="shop-image" :src="item.businessCategory"></image>
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
</template>

<script lang="ts" setup>
	import theme from '@/utils/theme'
	import { imgUrl } from '@/config';
	import { toBack,toNav } from "@/utils/route";
	import type { MerchantsList } from '../types';
	
	interface Props {
	  list: MerchantsList[];
	}
	
	const props = defineProps<Props>();
	
</script>

<style lang="scss">
	
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