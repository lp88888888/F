<template>
	<view>
		<view class="centerBox">
			<up-image :src="imgUrl+'static/B-scen-pay-success-icon.png'" width="198rpx" height="252rpx"></up-image>
			<up-gap height="16"></up-gap>
			<view class="textBox">
				<text class="textBox-item">支付成功</text>
			</view>
		
			<up-gap height="55"></up-gap>
			<view class="butBox butIcon1" @click="toRec('/pages_D/refuelingRefilling/order')">查看我的订单</view>
			<up-gap height="20"></up-gap>
			<view class="butBox butIcon2" @click="toHome">返回首页</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toRec,toHome } from '@/utils/route';
	import { copyText } from '@/utils/util';
	import {imgUrl} from '@/config';
	import { onLoad } from '@dcloudio/uni-app';
	
	const pageType = ref('yearsCard');
	const exchangeCode = ref<string>('0000000909090909')
	
	onLoad((opticon)=>{
		if(opticon.type) pageType.value = opticon.type
		if(opticon.code) exchangeCode.value = opticon.code
	})
</script>

<style lang="scss">
	page{
		background: #F6F5F4;
	}
	.centerBox{
		min-height: 80vh;
		padding-top: 80rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.textBox{
		.textBox-item{
			font-weight: 400;
			font-size: 32rpx;
			color: #999999;
			line-height: 32rpx;
		}
		.textBox-item2{
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;
			line-height: 28rpx;
		}
		.textBox-copy{
			font-weight: 700;
			font-size: 28rpx;
			color: #FF9000;
			line-height: 28rpx;
		}
	}
	
	.butBox{
		width: 540rpx;
		height: 96rpx;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		font-size: 32rpx;
		line-height: 96rpx;
		text-align: center;
	}
	.butIcon1{
		background: linear-gradient( 180deg, #FFA836 0%, #FF9000 100%);
		font-weight: 700;
		color: #FFFFFF;
		
	}
	.butIcon2{
		background: linear-gradient( 180deg, #F0F0F0 0%, #CBCBCB 100%);
		font-weight: 400;
		color: #666666;
	}
</style>