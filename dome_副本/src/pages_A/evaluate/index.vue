<template>
	<view class="integral-detail">
		<scroll-view scroll-y="true" style="height: calc(100vh - 44rpx);" >
		<view class="card-box" v-for="item in 15" >
			<image :src="imgUrl+'tx.jpg'" mode=""></image>
			<view class="card-right">
				<view class="card-right-1">
					陕西宝鸡特色擀面皮塑封100g
				</view>
				<view class="card-right-2">
					评价
				</view>
			</view>
		</view>
		</scroll-view>
	
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	import { imgUrl } from '../../config';



</script>

<style scoped lang="scss">
	.integral-detail{
		height: calc(100vh - 44rpx);
		padding: 30rpx 32rpx;
		background: #F1EFEC;
	}
	.card-box{
		display: flex;
		padding: 30rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin-bottom: 25rpx;
		image{
			width: 140rpx;
			height: 140rpx;
			background: #F5F5F5;
			border-radius: 20rpx;
			margin-right: 28rpx;
		}
		.card-right{
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			position: relative;
			.card-right-1{
				font-weight: 500;
				font-size: 28rpx;
				color: #000000;
				line-height: 36rpx;
			}
			.card-right-2{
				position: absolute;
				right: 0;
				bottom: 0;
				width: 130rpx;
				height: 50rpx;
				background: #FFFFFF;
				border-radius: 25rpx;
				border: 1px solid $color;
				font-weight: 500;
				font-size: 26rpx;
				color: $color;
				text-align: center;
				line-height: 50rpx;
			}
		}
	}
</style>