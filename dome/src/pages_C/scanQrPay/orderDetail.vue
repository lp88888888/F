<template>
	<view class="pagView" :data-theme="pageTheme">
		<up-navbar :title="paySucInfo.tradeStateStr" @leftClick="toBack" :placeholder="true" :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="code-view" v-if="paySucInfo.codeUrl">
			<view class="timer">
				<view class="tex28_66_b">{{currentDay}}</view>
				<view>
					<text>{{splitDataTime[0]}}</text>
					<text>时</text>
					<text>{{splitDataTime[1]}}</text>
					<text>分</text>
					<text>{{splitDataTime[2]}}</text>
					<text>秒</text>
				</view>
			</view>
			<image :src="paySucInfo.codeUrl" mode="" />
			<view class="tips">出示此二维码，核验成功后放行</view>
		</view>
		<view class="con">
			<view class="rowCon">
				<view class="cellLeft">缴费车牌号</view>
				<text class="tex32_33_b">{{paySucInfo.vehicleNumber}}</text>
			</view>
			<view class="grayBg">
				<view class="rowCon top30">
					<view class="cellLeft">入口站</view>
					<text class="tex28_33">{{paySucInfo.entryStationName}}</text>
				</view>
				<view class="rowCon top30">
					<view class="cellLeft">入口时间</view>
					<text class="tex28_33">{{paySucInfo.entryTime}}</text>
				</view>
				<view class="rowCon top30">
					<view class="cellLeft">出口站</view>
					<text class="tex28_33">{{paySucInfo.payStationName}}</text>
				</view>
				<view class="rowCon top30">
					<view class="cellLeft">出口时间</view>
					<text class="tex28_33">{{paySucInfo.gantryPassTime}}</text>
				</view>
				<view class="rowCon top30">
					<view class="cellLeft">通行时间</view>
					<text v-if="paySucInfo.passRoadMinutes.length>1">{{paySucInfo.passRoadMinutes[0]}}小时{{paySucInfo.passRoadMinutes[1]}}分钟</text>
					<text v-if="paySucInfo.passRoadMinutes.length==1">{{paySucInfo.passRoadMinutes[0]}}分钟</text>
				</view>
			</view>
			<view class="rowCon top30">
				<view class="cellLeft">支付金额</view>
				<text class="tex32_33_b" style="color: #ff0000;">¥{{paySucInfo.totalAmountYuan}}元</text>
			</view>
			<view class="baseLine top30"></view>
			<view class="rowCon top30" bindtap="copyUrl">
				<view class="cellLeft">订单编号</view>
				<text class="tex28_66 texNoWrap" style="max-width: 400rpx;display: block;">{{paySucInfo.sytOrderId}}</text>
			</view>
			<view class="rowCon top30">
				<view class="cellLeft">支付方式</view>
				<text class="tex28_66">微信支付</text>
			</view>
			<view class="rowCon top30">
				<view class="cellLeft">下单时间</view>
				<text class="tex28_66">{{paySucInfo.createTimeStr}}</text>
			</view>
		
		</view>
		
		<view class="btn" @click="toPay" v-if="paySucInfo.tradeState=='04' || paySucInfo.tradeState=='01'">缴费</view>
		<up-gap height="10"></up-gap>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import { onLoad } from '@dcloudio/uni-app';
	import {formatDate,splitTime} from "@/utils/date"

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const currentDay = ref('2025-12-22')
	let inter = null;
	const splitDataTime = ref(splitTime(new Date()))
	const openTime=()=>{
		const intedr = setInterval(() => {
			splitDataTime.value = splitTime(new Date())
		}, 1000)
		inter = intedr
	}
	const paySucInfo = ref({
		vehicleNumber:'陕A89063',
		tradeState:'01',
		tradeStateStr:'未支付',
		totalAmountYuan:'30',
		payStationName:'出站口出站口出站口出站口出站口',
		entryStationName:'进站口进站口',
		entryTime:'242-7873-78',
		gantryPassTime:'242-7873-78',
		createTimeStr:'242-7873-78',
		codeUrl:'https://tranalioss.shanyitong.com/images/20240628/1719565204949.jpg',
		passRoadMinutes:['10',20]
	})
	const toPay = ()=>{
		 paySucInfo.value['from'] = 'order'
		uni.setStorageSync('passInfo',  paySucInfo.value)
		uni.navigateTo({
		  url: './pay',
		})
	}
	onLoad(()=>{
		openTime()
	})
</script>

<style lang="scss" scoped>
	.pagView {
		background: #F0F0F2;
		min-height: 100vh;
		
	}
	
	.con {
		width: 702rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx 22rpx;
		box-sizing: border-box;
		margin: 11rpx 24rpx 36rpx;
	}
	
	.cellLeft {
		width: 220rpx;
		font-size: 28rpx;
		color: #666666;
	}
	
	.grayBg {
		width: 656rpx;
		background-color: #f0f0f0;
		padding: 10rpx 22rpx 30rpx;
		box-sizing: border-box;
		margin-top: 30rpx;
	}
	.rowCon{
		display: flex;
		align-items: center;
	}
	.tex28_66_b{
		font-size: 28rpx;
		color: #666666;
		font-weight: bold;
	}
	.tex32_33_b{
		font-size: 32rpx;
		color: #333333;
		font-weight: bold;
	}
	.tex28_33{
		font-size: 28rpx;
		color: #333333;
	}
	.top30 {
		margin-top: 30rpx;
	}
	
	.btn {
		width: 702rpx;
		height: 91rpx;
		background-image: linear-gradient(178deg,
				#ffd9b2 0%,
				#e7771a 100%,
				#ec6132 100%,
				#f14a4a 100%,
				#f85f30 100%,
				#fe7416 100%),
			linear-gradient(#ec9248,
				#ec9248);
		background-blend-mode: normal,
			normal;
		border-radius: 10rpx;
		font-size: 36rpx;
		line-height: 90rpx;
		letter-spacing: 1rpx;
		color: #ffffff;
		text-align: center;
		margin: 70rpx 24rpx;
	}
	
	.code-view {
		width: 702rpx;
		height: 653rpx;
		background-image: linear-gradient(180deg,
				#81c1ff 0%,
				#bfbeba 0%,
				#fcbb75 0%,
				#fed5a9 0%,
				#ffefdd 0%,
				#ffffff 100%),
			linear-gradient(#ffffff,
				#ffffff);
		background-blend-mode: normal,
			normal;
		border-radius: 20rpx;
		margin: 30rpx auto 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 10rpx;
	}
	
	.code-view image {
		width: 440rpx;
		height: 440rpx;
		margin-top: 20rpx;
	}
	
	.code-view .timer {
		width: 636rpx;
		height: 63rpx;
		background-color: #ffffff;
		border-radius: 28rpx;
		border: solid 1rpx #e1e1e1;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	
	.code-view .timer>view:nth-child(2) {
		display: flex;
		align-items: center;
	}
	
	.code-view .timer>view:nth-child(2)>text:nth-child(1),
	.code-view .timer>view:nth-child(2)>text:nth-child(3),
	.code-view .timer>view:nth-child(2)>text:nth-child(5) {
		width: 48rpx;
		height: 48rpx;
		background-color: #f3f5f9;
		border-radius: 4rpx;
		line-height: 48rpx;
		text-align: center;
		font-size: 28rpx;
		letter-spacing: 3rpx;
		color: #333333;
		font-weight: bold;
	}
	
	.code-view .timer>view:nth-child(2)>text:nth-child(5){
		font-size: 32rpx !important;
		color: #ff0000 !important;
	}
	
	.code-view .timer>view:nth-child(2)>text:nth-child(2),
	.code-view .timer>view:nth-child(2)>text:nth-child(6),
	.code-view .timer>view:nth-child(2)>text:nth-child(4){
		font-size: 28rpx;
		color: #999999;
		margin: 0 6rpx;
	}
	
	.code-view .tips {
		width: 480rpx;
		height: 60rpx;
		background-color: #f0f0f0;
		text-align: center;
		line-height: 60rpx;
		font-size: 28rpx;
		letter-spacing: 3rpx;
		color: #666666;
		margin-top: 20rpx;
	}
</style>