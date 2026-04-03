<template>
	<view>
		<u-sticky bgColor="#F6F5F4">
			<view class="navBack">
				<u-tabs :list="tabList" :current="current" :lineColor="themeStore.themeColors.$primaryColor" :activeStyle="{color:themeStore.themeColors.$primaryColor,fontWeight: 'bold'}" :inactiveStyle="{color:'#333333'}" :itemStyle="{width:'100rpx',height:'88rpx',fontSize:'28rpx'}" lineWidth="33"></u-tabs>
			</view>
		</u-sticky>
		
		<view class="pageView">
			<view v-for="(item,index) in dataList" :key="index">
				<view class="ordeView" @click="$u.route('/pages_A/chargingPiles/orderDetail')">
					<view class="ordeView-item">
						<view class="ordeView-item-left">
							<view class="ordeView-item-ordeNo">订单编号：{{item.orderNo}}</view>
							<view class="ordeView-item-time">{{item.time}}</view>
						</view>
						<view class="ordeView-item-right">
							<view class="ordeView-item-icon Icon1" v-if="item.statue == 1">待支付</view>
							<view class="ordeView-item-icon Icon2" v-if="item.statue == 2">进行中</view>
							<view class="ordeView-item-icon Icon3" v-if="item.statue == 3">已完成</view>
						</view>
					</view>
					<up-gap height="24"></up-gap>
					<view class="ordeView-item">
						<view class="ordeView-item-left">
							<view class="ordeView-item-text">充电时长：{{item.cTime}}</view>
							<view class="ordeView-item-text">充电度数：{{item.duNum}}度</view>
						</view>
						<view class="ordeView-item-right">
							<view class="ordeView-item-price"> <text>￥</text> {{item.price}}元</view>
						</view>
					</view>
				</view>
				<up-gap height="12"></up-gap>
			</view>
		</view>
		
	</view>
</template>
<script setup>
	import {ref} from 'vue';
	
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const current = ref(0)
	const tabList = ref([
		{name: '全部',state:0},
		{name: '进行中',state:2},
		{name: '待支付',state:1},
		{name: '已完成',state:3},
	]);
	
	const dataList = ref([
		{orderNo:'xxxx678787809078',statue:1,price:19.0,time:"2025-09-01 11:00:00",cTime:'1小时35分钟',duNum:'22.890'},
		{orderNo:'xxxx678787809078',statue:2,price:19.0,time:"2025-09-01 11:00:00",cTime:'1小时35分钟',duNum:'22.890'},
		{orderNo:'xxxx678787809078',statue:3,price:19.0,time:"2025-09-01 11:00:00",cTime:'1小时35分钟',duNum:'22.890'},
	]);
</script>

<style lang="scss">
	page{
		background: #F6F5F4;
	}
	.navBack{
		width: 100%;
		background:#F6F5F4;
	}
	
	.pageView{
		padding: 32rpx;
		box-sizing: border-box;
	}
	
	.ordeView{
		width: 100%;
		background: #FFFFFF;
		border-radius: 16rpx;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138,78,0,0.05);
		padding: 32rpx;
		box-sizing: border-box;
		
		.ordeView-item{
			min-height: 76rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.ordeView-item-left{
				min-height: 76rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
			.ordeView-item-right{}
			.ordeView-item-ordeNo{
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;
				line-height: 28rpx;
			}
			.ordeView-item-time{
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;
				line-height: 24rpx;
			}
			.ordeView-item-icon{
				width: 120rpx;
				height: 48rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 24rpx 24rpx 24rpx 24rpx;
				font-weight: 400;
				font-size: 24rpx;
				line-height: 24rpx;
			}
			.Icon1{
				color: $color;
				background: rgba(255,98,0,0.06);
			}
			.Icon2{
				color: #005AE1;
				background: rgba(0,43,128,0.06);
			}
			.Icon3{
				color: #00964E;
				background: rgba(0,128,66,0.06);
			}
			
			.ordeView-item-text{
				font-weight: 400;
				font-size: 24rpx;
				color: #666666;
				line-height: 24rpx;
			}
			.ordeView-item-price{
				text{
					font-size: 24rpx;
					// font-weight: 400;
				}
				font-size: 34rpx;
				font-weight: bold;
			}
		}
	}
</style>