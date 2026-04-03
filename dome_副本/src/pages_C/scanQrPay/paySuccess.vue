<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-navbar title="支付订单" bgColor="transparent" @leftClick="toBack"  :placeholder="true" :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="con">
		  <image class="icSuccess" :src="imgUrl + 'static/pay-success.png'" />
		  <text class="tex32_33" style="margin-top:20rpx">支付成功</text>
		  <view class="priceCon">
		    <text class="texPrice">¥{{paySucInfo.payAmount}}</text>
		    <text class="texPrice" style="font-size: 28rpx;">元</text>
		  </view>
		  <view class="btnCon">
		    <view class="btnLeft" @click="navTo">查看订单</view>
		    <view class="btnRight" @click="toBack">我知道了</view>
		  </view>
		  <view class="tipCon">
		    <image class="icTip" :src="imgUrl+'static/scanPay_tip.png'" mode="" style="z-index: 99;" />
		    <text class="tex28_33_b">温馨提示:</text>
		  </view>
		  <view class="tipCon" style="margin-top: 20rpx;">
		    <text class="tex28_33">请将CPC卡交给收费亭，如果需要发票，请告知工作人员。</text>
		  </view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const paySucInfo = ref({
		payAmount:'20'
	})
	const navTo = ()=>{
		
	}
	const navBack = ()=>{
		
	}
	
</script>

<style lang="scss" scoped>
	.pageView {
		background: #F0F0F2;
		min-height: 100vh;
	}
	
	.con{
		width: 702rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		margin: 40rpx 24rpx;
		padding: 80rpx 40rpx 50rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.icSuccess{
		width: 115rpx;
		height: 117rpx;
	}
	
	.priceCon{
		margin-top: 30rpx;
	}
	
	.texPrice{
		font-size: 48rpx;
		color: #ff0000;
		font-weight: bold;
	}
	
	.btnCon{
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 80rpx;
	}
	
	.btnLeft{
		width: 284rpx;
		height: 90rpx;
		background-color: #f0f0f0;
		border-radius: 10rpx;
		font-size: 32rpx;
		color: #999999;
		text-align: center;
		line-height: 90rpx;
	}
	
	.btnRight{
		width: 284rpx;
		height: 90rpx;
		background-color: #ffa84d;
		border-radius: 10rpx;
		font-size: 32rpx;
		color: #ffffff;
		text-align: center;
		line-height: 90rpx;
	}
	
	.tipCon{
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin-top: 70rpx;
	}
	
	.icTip{
		width: 33rpx;
		height: 31rpx;
		margin-right: 20rpx;
	}

</style>