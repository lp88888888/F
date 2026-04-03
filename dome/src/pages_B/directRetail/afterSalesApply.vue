<template>
	<view class="">
		<up-sticky>
			<view>
				<up-navbar title=" " bgColor="none" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
			</view>
		</up-sticky>
		<!-- <view class="backOrderColor"></view> -->
		<image class="backOrderColor" :src="imgUrl+'static/B-direct-aft-bgco.png'" mode=""></image>
		<view class="pageView">
			<view class="shName">申请售后</view>
			<view class="shText">
				<up-icon name="question-circle" color="#000000" size="16"></up-icon>
				<text>《售后政策服务总则》</text>
			</view>
			
			<up-gap height="25"></up-gap>
			<view class="tkView cards">
				<view class="tkView-title">请选择退款原因 <text>*</text></view>
				<view class="tabView">
					<view class="tabView-item" :class="[tabType == 1?'active':'']"  @click="tabChange(1)">退货</view>
					<view class="tabView-item" :class="[tabType == 2?'active':'']" @click="tabChange(2)">退款</view>
				</view>
			</view>
			<up-gap height="15"></up-gap>
			<view class="tkView cards">
				<view class="tkView-title">服务流程说明</view>
				<view class="" style="padding-top: 30rpx;">
					<up-steps v-if="tabType == 1" current="0" :dot="true" activeColor="#FF9600" inactiveColor="#CCCCCC">
						<up-steps-item>
							<template #desc>
								<text class="descTetx" style="color: #FF9600">提交申请</text>
							</template>
						</up-steps-item>
						<up-steps-item>
							<template #desc>
								<text class="descTetx">商家审核</text>
							</template>
						</up-steps-item>
						<up-steps-item >
							<template #desc>
								<text class="descTetx">商家收货</text>
							</template>
						</up-steps-item>
						<up-steps-item>
							<template #desc>
								<text class="descTetx">退款</text>
							</template>
						</up-steps-item>
						<up-steps-item>
							<template #desc>
								<text class="descTetx">完成</text>
							</template>
						</up-steps-item>
					</up-steps>
					<up-steps v-if="tabType == 2" current="0" :dot="true" activeColor="#FF9600" inactiveColor="#CCCCCC">
						<up-steps-item>
							<template #desc>
								<text class="descTetx" style="color: #FF9600">提交申请</text>
							</template>
						</up-steps-item>
						<up-steps-item>
							<template #desc>
								<text class="descTetx">商家审核</text>
							</template>
						</up-steps-item>
						<up-steps-item>
							<template #desc>
								<text class="descTetx">退款</text>
							</template>
						</up-steps-item>
						<up-steps-item>
							<template #desc>
								<text class="descTetx">完成</text>
							</template>
						</up-steps-item>
					</up-steps>
				</view>
				
			</view>
		</view>
		<view class="fixedBotttom">
			<view class="fixedBotttom-item">立即提交</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref} from 'vue';
	import { imgUrl } from '@/config';
	import { toNav,toBack } from '@/utils/route';
	const tabType = ref<number>(1); // 1退货，2退款
	const tabChange = (type:number)=>{
		tabType.value = type
	}
</script>

<style lang="scss" >
	@import './index.scss';
	.descTetx{
		display: inline-block;
		padding-top: 20rpx;
		font-weight: 500;
		font-size: 24rpx;
		color: #333333;
	}
	.backOrderColor{
		width: 750rpx;
		height: 400rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		// background: linear-gradient(180deg, #FCA830, #F5D6A8);
	}
	.tabView{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		grid-gap: 20rpx;
		padding-top: 35rpx;
		.tabView-item{
			min-width: 150rpx;
			height: 76rpx;
			line-height: 76rpx;
			text-align: center;
			background: #F6F6F6;
			border-radius: 38rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #333333;
			border: 1rpx solid #F6F6F6;
		}
		.active{
			color: #FF9600;
			background: #FDF9F5;
			border: 1px solid #FF9600;
		}
	}
	.tkView{
		padding: 36rpx;
		box-sizing: border-box;
		.tkView-title{
			display: inline-flex;
			align-items: center; /* 垂直居中对齐 */
			font-weight: bold;
			font-size: 30rpx;
			color: #000000;
			line-height: 30rpx;
			text{
				display: inline-block;
				line-height: 10rpx;
				color: #FF0000;
				padding-top: 10rpx;
			}
		}
		
	}
	.shName{
		font-weight: 800;
		font-size: 46rpx;
		color: #000000;
	}
	.shText{
		display: flex;
		align-items: center;
		font-weight: 500;
		font-size: 24rpx;
		color: #000000;
		margin-top: 30rpx;
	}
	.fixedBotttom{
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		background: #FFFFFF;
		height: 150rpx;
		width: 100%;
		box-sizing: border-box;
		padding: 15rpx 32rpx;
		display: flex;
		justify-content: flex-end;
		
		.fixedBotttom-item{
			width: 100%;
			height: 88rpx;
			background: #FF9600;
			border-radius: 44rpx;
			line-height: 88rpx;
			text-align: center;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
		}
		
	}
</style>