<template>
	<view class="page-container">
		<up-navbar title=" " bgColor="transparent" @leftClick="toBack" leftIconColor="#000000" :placeholder="true" :titleStyle="{fontWeight:'600'}"></up-navbar>
		<view class="topView"></view>
		
		<view class="pageView">
			<view class="succesBox fl-ce-ce">
				<image :src="imgUrl+'static/B-din-pay-success-icon.png'" mode></image>
			</view>
			<view class="succesTetx">支付成功</view>
			<up-gap height="24"></up-gap>
			<view class="card">
				<view class="card-title">凭【二维码】到店消费</view>
				<view class="card-qr">
					<up-qrcode cid="ex1" :size="180" val="sxjkdwfwpt20250326"></up-qrcode>
				</view>
				<view class="card-text">待使用券码</view>
				<view class="card-val">sxjkdwfwpt20250326</view>
			</view>
		</view>
		
		<view class="fiexView">
			<view class="fiexView-but">返回商户</view>
		</view>
		<up-gap height="90"></up-gap>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
</script>

<style lang="scss" scoped>
	.page-container{
		min-height: 100vh;
		background: $pageBgColor;
	}
	.topView{
		position: absolute;z-index: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 654rpx;
		background: linear-gradient(-40deg, #FF9600, #F4AA31);
		border-radius: 0 0 20rpx 20rpx;
	}
	.pageView{
		position: relative;
		z-index: 1;
	}
	
	.succesBox{
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, .16);
		margin: 0 auto;
		image{
			width: 160rpx;
			height: 160rpx;
		}
	}
	.succesTetx{
		margin-top: 23rpx;
		text-align: center;
		font-weight: bold;
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 30rpx;
	}
	.card{
		width: 686rpx;
		background: #FFFFFF;
		border-radius: 26rpx;
		margin: 0 auto;
		text-align: center;
		padding-top: 70rpx;
		padding-bottom: 80rpx;
		.card-title{
			font-weight: bold;
			font-size: 32rpx;
			color: #333333;
			line-height: 32rpx;
			margin-bottom: 40rpx;
		}
		.card-qr{
			width: 360rpx;
			height: 360rpx;
			margin: 0 auto;
		}
		.card-text{
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			margin: 30rpx 0;
		}
		.card-val{
			font-weight: 500;
			font-size: 30rpx;
			color: #000000;
		}
	}
	.fiexView{
		width: 750rpx;
		height: 158rpx;
		background: #FFFFFF;
		padding: 15rpx 32rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 9;
		.fiexView-but{
			width: 100%;
			height: 88rpx;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			border-radius: 44rpx;
			line-height: 88rpx;
			text-align: center;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
		}
	}
	
</style>