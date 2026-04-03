<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-navbar title="支付订单" bgColor="transparent" @leftClick="toBack"  :placeholder="true" :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		
		<view class="con">
			<text class="tex28_66">缴费车牌号</text>
			<text class="tex36_33_b" style="margin-top: 28rpx;">{{passInfo.payPlateNo || passInfo.vehicleNumber}}</text>
			<view class="grayBg">
				<view class="colCon">
					<text class="tex28_66">支付金额</text>
					<view style="margin-top: 12rpx;">
						<text class="tex28_33_b" style="font-size: 44rpx;">{{passInfo.payAmount}}</text>
						<text class="tex28_33_b">元</text>
					</view>
				</view>
				<view class="colCon" style="align-items: flex-end;">
					<text class="tex28_66">行驶时长</text>
					<view style="margin-top: 12rpx;">
						<text class="tex28_33_b" style="font-size: 44rpx;">{{passInfo.duration.hours}}</text>
						<text class="tex28_33_b" v-if="passInfo.duration.hours">小时</text>
						<text class="tex28_33_b" style="font-size: 44rpx;">{{passInfo.duration.mins}}</text>
						<text class="tex28_33_b">分钟</text>
					</view>
				</view>
			</view>
			<view class="rowCon" style="margin-top: 30rpx;justify-content: space-between;">
				<view class="rowCon">
					<text class="tex28_66">入口站</text>
					<text class="tex28_33_b" style="margin-left: 10rpx;flex: 1;">{{passInfo.entryStationName}}</text>
				</view>
				<view class="rowCon" v-if="passInfo.payStationName">
					<text class="tex28_66">出口站</text>
					<text class="tex28_33_b" style="margin-left: 10rpx;flex: 1;">{{passInfo.payStationName}}</text>
				</view>
			</view>
			<view class="baseLine" style="margin-top:30rpx;"></view>
			<view class="rowCon" style="margin-top: 30rpx;">
				<text class="tex24_66">下单时间：{{passInfo.unpaidCreateTime}}</text>
			</view>
		</view>
		
		<view class="fixedBottom rowCon">
			<text class="tex28_66">支付金额</text>
			<text class="bottomRedPrice">{{passInfo.payAmount}}</text>
			<text class="bottomRedTex">元</text>
			<view class="bottomBtn" @click="pay">去支付</view>
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
	const passInfo = ref({
		vehicleNumber:'陕A89063',
		tradeState:'01',
		tradeStateStr:'未支付',
		totalAmountYuan:'30',
		payStationName:'出站口出站口',
		entryStationName:'进站口进站口',
		entryTime:'242-7873-78',
		gantryPassTime:'242-7873-78',
		createTimeStr:'242-7873-78',
		codeUrl:'https://tranalioss.shanyitong.com/images/20240628/1719565204949.jpg',
		passRoadMinutes:['10',20],
		unpaidCreateTime:'2025-12-22 11:20:30',
		duration:{
			hours:'1',
			mins:'23'
		}
		
	})
	const pay = ()=>{
		
	}
</script>

<style lang="scss" scoped>
	.pageView {
		background: #F0F0F2;
		min-height: 100vh;
	}
	.rowCon{
		display: flex;
		align-items: center;
	}
	.tex28_66{
		font-size: 28rpx;
		color: #666666;
	}
	.tex36_33_b{
		font-size: 36rpx;
		color: #333333;
		font-weight: bold;
	}
	.tex28_33_b{
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}
	.con {
		width: 702rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding: 30rpx 20rpx;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		margin: 60rpx 24rpx;
	}
	
	.grayBg {
		width: 658rpx;
		height: 179rpx;
		background-color: #f0f0f0;
		margin-top: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	
	.fixedBottom{
		width: 750rpx;
		height: 180rpx;
		background-color: #ffffff;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 9;
		padding: 0 24rpx;
		box-sizing: border-box;
	}
	
	.bottomRedPrice{
		font-size: 48rpx;
		font-weight: bold;
		letter-spacing: 0rpx;
		color: #ff0000;
		margin-left: 30rpx;
	}
	
	.bottomRedTex{
		font-size: 28rpx;
		font-weight: bold;
		letter-spacing: 0rpx;
		color: #ff0000;
		margin-top: 12rpx;
		flex: 1;
	}
	
	.bottomBtn{
		width: 301rpx;
		height: 91rpx;
		background-color: #ffa84d;
		border-radius: 10rpx;
		font-size: 32rpx;
		color: #ffffff;
		font-weight: bold;
		text-align: center;
		line-height: 91rpx;
	}
</style>