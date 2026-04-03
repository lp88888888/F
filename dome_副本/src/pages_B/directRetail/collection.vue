<template>
	<u-sticky bgColor="transparent">
		<view class="topBgColor">
			<up-navbar title="我的收藏" bgColor="none" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
			<view class="searchView">
				<u-search placeholder="请输入门店名称" v-model="keyword" searchIconColor="#000000" height="72rpx" shape="round" bgColor="#F5F5F5" :showAction="false"></u-search>
			</view>
			<view class="tabs">
				<view class="tabs-item" @click="tabChange(1)">
					<view class="tabs-item-text" :class="[indexType == 1?'active':'']">商品（{{goodsList.length}}件）</view>
					<view class="tabs-item-icon" v-if="indexType == 1"></view>
				</view>
				<view class="tabs-item" @click="tabChange(2)">
					<view class="tabs-item-text" :class="[indexType == 2?'active':'']">商家（{{merchantsList.length}}件）</view>
					<view class="tabs-item-icon" v-if="indexType == 2"></view>
				</view>
			</view>
		</view>
	</u-sticky>
	<view class="pageView">
		<view v-if="indexType == 1">
			<GoodsListItem type="collection" imgSize="170rpx"></GoodsListItem>
		</view>
		<view v-if="indexType == 2">
			<MerchantsItem :list="merchantsList"></MerchantsItem>
		</view>
	</view>
	
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref } from 'vue';
	import GoodsListItem from './components/GoodsListItem.vue';
	import MerchantsItem from './components/MerchantsItem.vue';
	import { imgUrl } from '@/config';
	import { toBack,toNav } from "@/utils/route";
	import type { MerchantsList } from './types';
	
	
	const goodsList = ref<[]>([])
	const merchantsList = ref<Array<MerchantsList>>([
		{
			name:'朋乐乐购',
			address:'宝鸡市渭滨区宝鸡西服务区',
			distance:'3.2km',
			shopUrl:'del/shopIcon.png',
			productList:[
				{ image: 'del/goods1.png', name: '海南香蕉约海南香蕉约海南香蕉约', price: '10.60' },
				{ image: 'del/goods2.png', name: '粑粑柑3个', price: '15.00' },
				{ image: 'del/goods4.png', name: '洛川红苹果', price: '26.03' }
			]
		},
	])
	
	const keyword = ref<string>('');
	
	const indexType = ref<number>(1);
	
	
	
	const tabChange = (type:number)=>{
		indexType.value = type
	}
</script>

<style lang="scss">
	page {
		background:$pageBgColor;
	}
	.pageView {
		padding: 30rpx 32rpx;
		box-sizing: border-box;
	}
	
	.topBgColor {
		background: $pageBgColor;
		// padding-bottom: 24rpx;
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
	.tabs{
		display: grid;
		grid-template-columns: repeat(2,1fr);
		.tabs-item{
			height: 90rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			.tabs-item-text{
				font-weight: bold;
				font-size: 28rpx;
				color: #333333;
			}
			.active{
				color: $color;
			}
			.tabs-item-icon{
				width: 70rpx;
				height: 8rpx;
				background: $color;
				border-radius: 4rpx 4rpx 0rpx 0rpx;
				position: absolute;
				bottom: 0;
				left: calc((100% - 70rpx) / 2);
			}
		}
		
	}
	::v-deep .u-navbar__content {
		background: none !important;
	}
</style>