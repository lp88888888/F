<template>
	<view class="">
		<view class="pageView" style="padding: 32rpx;">
			<view class="selView cards">
				<view class="selView-title"><text>*</text>请选择退款原因</view>
				<view class="selView-center">
					<view class="selView-center-item" :class="[item.name == selectIndex?'active':'']" v-for="(item,index) in dataList" :key="index" @click="seleClick(item)">
						<view class="selView-center-item-label">{{item.name}}</view>
						<view class="selView-center-item-icon">
							<up-icon v-if="item.name == selectIndex" :name="imgUrl+'del/select_true.png'" size="16"></up-icon>
							<up-icon v-else :name="imgUrl+'del/select_false.png'" size="16"></up-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottomBut">
			<view class="bottomBut-left">
				<text class="bottomBut-left-text">退款金额</text>
				<view class="newPrice" style="color: #FF9600;"><text class="fs-24">￥</text>{{decimalPointDivision(totalAmount,'left')}}<text class="fs-28">{{decimalPointDivision(totalAmount,'right')}}</text></view>
			</view>
			<view class="bottomBut-item">立即支付</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref} from 'vue';
	import { imgUrl } from '@/config';
	import {decimalPointDivision} from "@/utils/util";
	import { onLoad } from '@dcloudio/uni-app';
	const selectIndex = ref('');
	const dataList = ref([
		{name:'计划有变'},
		{name:'买多/买错'},
		{name:'不想要了'},
		{name:'交通延误/取消导致无法出行'},
		{name:'商家服务态度不好'},
		{name:'商家表示商品无货/缺货'},
	])
	const totalAmount = ref(0);
	
	const seleClick = (item:any) =>{
		selectIndex.value = item.name;
	}
	onLoad((opticon)=>{
		if(opticon.price){
			totalAmount.value = opticon.price
		}
	})
</script>

<style lang="scss">
	@import './index.scss';
	.selView{
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		.selView-title{
			display: inline-flex;
			align-items: center;
			font-weight: bold;
			font-size: 32rpx;
			color: #000000;
			line-height: 30rpx;
			text{
				display: inline-block;
				line-height: 10rpx;
				color: #FF0000;
				padding-top: 10rpx;
				margin-right: 10rpx;
			}
		}
		.selView-center{
			grid-gap: 30rpx;
			display: grid;
			padding-top: 30rpx;
			.selView-center-item{
				width: 100%;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: #F7F7F7;
				border-radius: 20rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				border: 1px solid none;
			}
			.active{
				background: #FFFBF5 !important;
				border: 1px solid #FF9600;
				color:#FF9600;
			}
		}
	}
	.newPrice{
		font-weight: bold;
		font-size: 36rpx;
		display: inline-block;
	}
	
	.bottomBut{
		position: fixed;
		z-index: 99;
		left: 0;
		bottom: 0;
		background: #FFFFFF;
		width: 750rpx;
		padding: 18rpx 36rpx 60rpx 36rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.bottomBut-left{
			.bottomBut-left-text{
				margin-right: 20rpx;
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
			}
		}
		.bottomBut-item{
			width: 276rpx;
			height: 80rpx;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			border-radius: 39rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>