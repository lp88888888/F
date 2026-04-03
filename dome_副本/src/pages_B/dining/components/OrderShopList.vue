<template>
	<view class="shopCard">
		<view class="shopCard-title">餐品信息</view>
		<view>
			<view v-for="(item,index) in dataList" :key="index">
				<view class="shopItem">
					<image class="shopItem-image" :src="imgUrl+'dsewf.png'" mode=""></image>
					<view class="shopItem-center">
						<view class="shopItem-center-name">{{item.name}}</view>
						<view class="shopItem-center-nums">数量:{{item.num}}</view>
					</view>
					<view class="shopItem-price">
						<text class="oldPri">￥{{item.oldPrice}}</text>
						<view class="newPrice"><text class="fs-24">￥</text>{{decimalPointDivision(item.price,'left')}}<text class="fs-28">{{decimalPointDivision(item.price,'right')}}</text></view>
					</view>
				</view>
			</view>
			<view class="showItem" v-if="list.length > maxListNumShow" @click="listShow = !listShow">
				<text>{{listShow?'收起':'展开更多'}} (共{{list.length}}件商品)</text>
				<up-icon :name="listShow?'arrow-up':'arrow-down'" size="12" color="#999999"></up-icon>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue'
	import {decimalPointDivision} from "@/utils/util";
	import { imgUrl } from '@/config';
	import type {ShopDetail} from '../types.ts';
	interface Props {
		maxListNumShow:number;
		list: ShopDetail[];
	}
	// const props = defineProps<Props>();
	const props = withDefaults(defineProps<Props>(), {
	  maxListNumShow: 3,
	  list: () => []
	});
	const listShow = ref<boolean>(false);
	const dataList = computed(()=>{
		if(listShow.value){
			return props.list
		}else{
			return props.list.slice(0,props.maxListNumShow);
		}
	})
</script>

<style lang="scss" scoped>
	.shopCard{
		padding: 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
		
		.shopCard-title{
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}
	}
	.shopItem{
		width: 100;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding: 25rpx 0;
		
		.shopItem-image{
			width: 96rpx;
			height: 96rpx;
			background: #F5F5F5;
			border-radius: 16rpx;
		}
		.shopItem-center{
			width: calc(100% - 96rpx - 40rpx - 120rpx);
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			
			height: 96rpx;
			
			.shopItem-center-name{
				font-weight: 800;
				font-size: 28rpx;
				color: #000000;
			}
			.shopItem-center-nums{
				font-weight: 500;
				font-size: 24rpx;
				color: #999999;
			}
		}
		.shopItem-price{
			width: 120rpx;
			display: flex;
			justify-content: flex-end;
			align-items: flex-end;
			line-height: 30rpx;
		}
	}
	.newPrice{
		font-weight: bold;
		font-size: 36rpx;
		display: inline-block;
		margin-left: 10rpx;
	}
	
	.oldPri{
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
		text-decoration-line: line-through;
	}
	.showItem{
		width: 100%;
		height: 50rpx;
		line-height: 30rpx;
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
		display: flex;
		align-items: center;
		justify-content: center;
		text{
			margin-right: 10rpx;
		}
	}
</style>