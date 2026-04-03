<!-- 出现 -->
<template>
	<view class="travel-box">
		<view class="travel-head">
			 <image :src="imgUrl + 'banner.png'" class="img"></image>
		</view>
		<view class="grid-container" >
			<view class="grid-item" @click="conditionsfun">
				 <image :src="imgUrl + 'tr-icon1.png'" class="img"></image>
				<text class="item-text">路况查询</text>
			</view>
			<view class="grid-item" @click="toJump('/pages_A/toll/index')">
				<image :src="imgUrl + 'tr-icon2.png'" class="img"></image>
				<view class="item-text">收费站状态<br /> 查询</view>
			</view>
			<view class="grid-item" @click="toJump('/pages_A/station/index')">
				<image :src="imgUrl + 'tr-icon3.png'" class="img"></image>
				<text class="item-text">服务区查询</text>
			</view>
			<view class="grid-item" @click="toJump('/pages_A/tollInvoice/query')">
				<image :src="imgUrl + 'tr-icon4.png'" class="img"></image>
				<text class="item-text">通行费率查询</text>
			</view>
		</view>
		<view class="grid-container">
			<view class="grid-item-three" @click="toJump('/pages_A/chargingPiles/index')">
				<image :src="imgUrl + 'tr-icon5.png'" class="img"></image>
				<text class="item-text">充电桩查询</text>
			</view>
			<view class="grid-item-three" @click="toJump('/pages_A/weather/index')" >
				<image :src="imgUrl + 'tr-icon6.png'" class="img"></image>
				<text class="item-text">气象状态查询</text>
			</view>
			<view class="grid-item-three" @click="toJump('/pages_D/refuelingRefilling/index')">

				<image :src="imgUrl + 'tr-icon7.png'" class="img"></image>
				<text class="item-text">油气站点查询</text>
			</view>
		</view>

		<view class="grid-container">
			<view class="grid-item" >
				<image :src="imgUrl + 'tr-icon8.png'" class="img"></image>
				<text class="item-text">汽车4S店查询</text>
			</view>
			<view class="grid-item">
				<image :src="imgUrl + 'tr-icon9.png'" class="img"></image>
				<text class="item-text">检测站点查询</text>
			</view>
		</view>
		<up-gap :height="bottomHeight" ></up-gap>
		<!-- 底部服务 -->
		<view class="container-bottom">
			<view class="line-img" :style="{
			  background: 'url(' + imgUrl + 'line.png) no-repeat',
			  'background-size': '100% 100%',
			  'background-position': 'center'
			}">
				<view class="node item1" @click="handleCallParent('travel')">
					<view class="node-wenzi">出行</view>
					<view>服务</view>
				</view>
				<view class="nodes item2" @click="handleCallParent('travel2')">
					<view class="node-wenzi">生活</view>
					<view>服务</view>
				</view>
				<view class="nodes item3" @click="handleCallParent('travel3')">
					<view class="node-wenzi">业务</view>
					<view>办理</view>
				</view>
				<view class="nodes item4" @click="handleCallParent('travel4')">
					<view class="node-wenzi">车辆</view>
					<view>服务</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script setup lang="ts">
	import {
		ref
	} from 'vue';
	import { imgUrl } from '../../config';
	const props = defineProps<{
	  parentMethod: (msg: string) => void;
	  bottomHeight:number|string
	}>();
	
	// 子组件内部调用父组件方法
	const handleCallParent = (name:string) => {
	  // 调用父组件传递的方法，并传入参数
	  props.parentMethod(name);
	};

	
	const toJump = (url: String) => {
		uni.navigateTo({
			url: url
		});
	}
	const conditionsfun = () => {
		uni.navigateTo({
			url: '../../pages_A/map/index',
		})
	}
</script>

<style scoped lang="scss">
	.travel-box {
		padding: 0 30rpx;
		box-sizing: border-box;
		min-height: 100vh;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/home-bj-z.png')no-repeat;
		background-position: center;
		background-size: 100% 100%;
		overflow: hidden;
	}

	.travel-head {
		width: 100%;
		height: 220rpx;
		margin: 30% 0 30rpx;
		.img{
			width: 100%;
			height: 220rpx;
		}
	}

	.grid-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.grid-item {
		width: 48%;
		height: 150rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center; 
		justify-content: flex-start; 
		background-color: #fff;
		border-radius: 10rpx;
		.img {
			width: 60rpx;
			height: 60rpx;
			margin:0 20rpx 0 50rpx;
		}
	}

	.grid-item-three {
		width: 31%;
		/* 一行三个，每个约占31%宽度，留出3%的间距 */
		height: 210rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		border-radius: 10rpx;
		.img {
			width: 60rpx;
			height: 60rpx;
			margin-bottom: 20rpx;
		}
	}

	.item-text {
		font-size: 28rpx;
		color: #333;
		
	}

	

	.container-bottom {
		width: 100%;
		position: fixed;
		left:0;
		bottom:-20rpx;
	}

	.node,.nodes{
		width: 106rpx;
		height: 106rpx;
		border-radius: 50%;
		
		font-size: 26rpx;
		text-align: center;
	}
	.node-wenzi {
		margin-top: 20rpx;
	}
	.node{
		color: #fff;
		background: linear-gradient(-40deg, #FF7E00, #FF9600);
		border: 5px solid #FFD5A3;;
	}
    .nodes{
		color: #000;
		background: #fff;
		box-shadow: #C9BFC0;
	}
	.line {
		color: #000;
		position: absolute;
		top: 12px;
		height: 2px;
		background-color: #ccc;
	}

	.customer {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 350rpx;
		right: 40rpx;

		.img {
			width: 100%;
			height: 110rpx;
		}
	}

	.line-img {
		width: 100%;
		height: 200rpx;
		position: relative;
		z-index: 9;

	}

	.item1 {
		position: absolute;
		top: 13%;
		left: 8%;
		z-index: 99;
	}

	.item2 {
		position: absolute;
		top: -25%;
		left: 31%;
		z-index: 99;
	}

	.item3 {
		position: absolute;
		top: -25%;
		left: 54%;
		z-index: 99;
	}

	.item4 {
		position: absolute;
		top: 15%;
		left: 76%;
		z-index: 99;
	}
</style>