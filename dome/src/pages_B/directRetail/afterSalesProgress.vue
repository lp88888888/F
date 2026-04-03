<template>
	<view class="">
		<u-sticky bgColor="transparent">
			<view :style="{background:topBgColor}">
				<up-navbar title="售后进度查询" bgColor="none" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
			</view>
		</u-sticky>
		<view class="backColor" style="background: linear-gradient(0deg, #FFFFFF, #FFECCE);"></view>
		
		<view class="pageView">
			<view class="orderSta" >
				<view class="orderSta-label">售后完成</view>
			</view>
			<view class="cards" style="padding:40rpx 32rpx;">
				<up-steps current="0" :dot="true" direction="column" activeColor="#FF9600" inactiveColor="#CCCCCC">
					<up-steps-item>
						<template #desc>
							<view class="descView" >
								<view class="descView-title">退款成功</view>
								<view class="descView-tetx">财务已退款，请您注意查收</view>
								<view class="descView-time">2025-03-26 13:50:00</view>
							</view>
						</template>
					</up-steps-item>
					<up-steps-item>
						<template #desc>
							<view class="descView" style="opacity: .6;">
								<view class="descView-title">商家收货</view>
								<view class="descView-tetx">您提交的商品商家已收到</view>
								<view class="descView-time">2025-03-26 10:30:00</view>
							</view>
						</template>
					</up-steps-item>
					<up-steps-item>
						<template #desc>
							<view class="descView" style="opacity: .6;">
								<view class="descView-title">物流进度</view>
								<view class="descView-tetx">顺丰快递，单号：<text>SF1312132132132</text></view>
								<view class="descView-time">2025-03-26 10:30:00</view>
							</view>
						</template>
					</up-steps-item>
					<up-steps-item>
						<template #desc>
							<view class="descView" style="opacity: .6;">
								<view class="descView-title">商家审核通过</view>
								<view class="descView-tetx">您的售后申请商家已审核通过</view>
								<view class="descView-time">2025-03-26 10:30:00</view>
							</view>
						</template>
					</up-steps-item>
					<up-steps-item>
						<template #desc>
							<view class="descView" style="opacity: .6;">
								<view class="descView-title">售后申请</view>
								<view class="descView-tetx">您的售后申请已提交，等待商家审核</view>
								<view class="descView-time">2025-03-26 10:30:00</view>
							</view>
						</template>
					</up-steps-item>
				</up-steps>
			</view>
			<up-gap height="15"></up-gap>
			<view class="cards" style="padding: 0 30rpx;box-sizing: border-box;">
				<order-line label="服务单号" text="SH202501011231354" textAlign="left" borderBottom></order-line>
				<order-line label="申请时间" text="2025-03-27 10:30:28" textAlign="left" borderBottom></order-line>
				<order-line label="申请原因" text="不想要了" textAlign="left" borderBottom></order-line>
				<order-line label="取件信息" textAlign="left">
					<template #text>
						<view class="textItem"><text>张远</text>  <text>135****0000</text></view>
						<up-gap height="10"></up-gap>
						<view class="textItem">陕西省西安市高新区科技一路科技智慧园区写字楼A座610室</view>
					</template>
				</order-line>
			</view>
			
			<up-gap height="30"></up-gap>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref} from 'vue';
	import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
	import OrderLine from "./components/OrderLine";
	import { toNav,toBack } from '@/utils/route';
	const topBgColor = ref<string>('transparent');
	onPageScroll((e) =>{
		if (e.scrollTop < 1) {
			topBgColor.value = 'transparent'
		} else {
			topBgColor.value = `linear-gradient(to bottom, rgba(252,237,212,1), rgba(249,240,223,1))`
		}
	})
</script>

<style lang="scss">
	@import './index.scss';
	.orderSta{
		padding: 20rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		.orderSta-label{
			// height: 100rpx;
			display: flex;
			align-items: flex-end;
			font-weight: bold;
			font-size: 40rpx;
			color: #000000;
			text{
				font-weight: 500;
				font-size: 24rpx;
				color: #666666;
				margin-left: 20rpx;
			}
		}
	}
	.descView{
		padding: 0 10rpx 30rpx 10rpx;
		box-sizing: border-box;
		.descView-title{
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
			// line-height: 40rpx;
		}
		.descView-tetx{
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			
			padding: 24rpx 0;
			text{
				color: #5683F7;
			}
		}
		.descView-time{
			font-weight: 500;
			font-size: 24rpx;
			color: #999999;
			// line-height: 40rpx;
		}
	}
	
	.textItem text{
		display: inline-block;
		margin-right: 20rpx;
	}
</style>