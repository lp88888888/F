<template>
	<view class="pageView">
		<view class="card">
			<view class="card-title">充电信息</view>
			<up-gap height="15"></up-gap>
			<view class="card-item"><text>充电时长:</text>1小时36分钟</view>
			<view class="card-item"><text>充电度数:</text>27.708度</view>
			<view class="card-item"><text>充电功率 :</text>120kw</view>
		</view>
		<up-gap height="12"></up-gap>
		<view class="card">
			<view class="card-title">费用信息</view>
			<up-gap height="15"></up-gap>
			<view class="card-item"><text>支付方式:</text>微信支付</view>
			<view class="card-item"><text>电费:</text>0.925元/度</view>
			<view class="card-item"><text>服务费:</text>0.05元/度</view>
			<view class="card-item"><text>预付金额:</text>50元</view>
			<view class="card-item"><text>已优惠 : </text>8.237元</view>
		</view> 
		<up-gap height="12"></up-gap>
		<view class="card">
			<view class="card-title">费用信息</view>
			<up-gap height="10"></up-gap>
			<view class="card-text">2025-03-15 15:36:27</view>
			<up-gap height="15"></up-gap>
			<view class="card-item"><text>订单编号:</text>1333344644</view>
			<view class="card-item"><text>桩名称:</text>桩789</view>
			<view class="card-item"><text>枪编号:</text>780488904904905</view>
		</view>
	</view>
</template>

<script setup>
	import {ref} from 'vue'
</script>

<style lang="scss" >
	page{
		background: #F6F5F4;
	}
	.pageView{
		padding: 24rpx 32rpx;
		box-sizing: border-box;
	}
	.card{
		padding: 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138,78,0,0.05);
		border-radius: 16rpx;
		.card-title{
			font-weight: 700;
			font-size: 32rpx;
			color: #333333;
			line-height: 32rpx;
		}
		.card-text{
			font-weight: 400;
			font-size: 24rpx;
			color: #999999;
			line-height: 24rpx;
		}
		.card-item{
			text{
				font-weight: 400;
				color: #666666;
			}
			font-weight: 700;
			color: #333333;
			font-size: 28rpx;
			line-height: 50rpx;
		}
	}
	
	
</style>