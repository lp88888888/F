<template>
	<view class="">
		<up-navbar title="订单详情" bgColor="#FFFFFF" @leftClick="toBack" placeholder fixed :titleStyle="{fontWeight:'600'}"></up-navbar>
		<view class="topCard">
			<view class="statusName">待确认</view>
			<view class="statusText m-t-30">若超过30分钟商家未确认，请您联系商家</view>
		</view>
		<view class="pageView">
			<view class="card">
				<view class="fl-ce-sb p-t-30 p-b-20">
					<up-image :src="imgUrl+'del/car-img.png'" width="200rpx" height="160rpx" lazy-load></up-image>
					<view class="carView">
						<view class="carName texNoWrap">捷达VA3</view>
						<view class="carText texNoWrap">
							轿车丨5座丨1.6丨自动
						</view>
						<view class="carTime texNoWrap">
							2025.03.27 至 2025.03.29 (共3天)
						</view>
					</view>
				</view>
				<u-line color="#EEEEEE"></u-line>
				<view class="fl-ce-sb p-t-30 p-b-50">
					<view>
						<view class="gsName texNoWrap">安康宏晖鑫达商贸有限公司</view>
						<view class="fl-al-ce u-m-t-24">
							<u-icon :name="imgUrl+'static/B-direct-position.png'" width="20rpx" height="24rpx"></u-icon>
							<view class="gsAddr texNoWrap u-m-l-15">西安市雁塔区西沣公路58号</view>
						</view>
					</view>
					<view class="fl-al-ce">
						<view class="iconView">
							<u-icon :name="imgUrl+'static/addr-icon.png'" size="23"></u-icon>
							<text class="m-t-5">导航</text>
						</view>
						<view class="iconView u-m-l-35">
							<u-icon :name="imgUrl+'static/tel-icon-000.png'" size="23"></u-icon>
							<text class="m-t-5">电话</text>
						</view>
					</view>
				</view>
			</view>
			<u-gap height="15"></u-gap>
			<view class="card" style="padding: 34rpx 30rpx 10rpx 34rpx;">
				<view class="cardTitle">费用明细</view>
				<view class="p-tb-35 fl-ce-sb">
					<view class="labelName">车辆租赁费（共3天）</view>
					<view class="labelRight" style="color: #FF9600;">¥150</view>
				</view>
			</view>
			<u-gap height="15"></u-gap>
			<view class="card" style="padding: 34rpx 30rpx 15rpx 34rpx;">
				<view class="cardTitle">押金说明</view>
				<view class="p-tb-35 fl-ce-sb">
					<view class="labelName">违章押金<text>（还车30天后无违章全退）</text></view>
					<view class="labelRight">¥2000</view>
				</view>
				<u-line color="#EEEEEE"></u-line>
				<view class="p-tb-35 fl-ce-sb">
					<view class="labelName">车辆押金<text>（还车后全退）</text></view>
					<view class="labelRight">¥3000</view>
				</view>
			</view>
			<u-gap height="15"></u-gap>
			<view class="card" style="padding: 34rpx 30rpx 15rpx 34rpx;">
				<view class="cardTitle">订单信息</view>
				<view class="p-tb-35 fl-ce-sb">
					<view class="label2Name">订单编号</view>
					<view class="label2Right">JD20250328153154 <text class="m-l-12" @click="copyText('JD20250328153154')">复制</text></view>
				</view>
				<u-line color="#EEEEEE"></u-line>
				<view class="p-tb-35 fl-ce-sb">
					<view class="label2Name">下单时间</view>
					<view class="label2Right">2025-03-27 10:30:28</view>
				</view>
			</view>
			
			<view class="fixedBott fl-al-ce">
				<!-- <view class="fixedBott-but but1" @click="toNav('/pages_B/rentCar/cancel')">取消预订</view> -->
				<view class="fixedBott-but but2" @click="toNav('/pages_B/rentCar/refund')">退租</view>
				<view class="fixedBott-but but3 m-l-20">评价</view>
				<view class="fixedBott-but but4 m-l-20" @click="toNav('/pages_B/rentCar/orderAdd')">续租</view>
			</view>
			<u-gap height="90"></u-gap>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import {copyText} from '@/utils/util';
</script>

<style lang="scss">
	page{
		background: $pageBgColor;
	}
	.fixedBott{
		width: 750rpx;
		height: 158rpx;
		background: #FFFFFF;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 9;
		padding: 26rpx 32rpx 0 32rpx;
		box-sizing: border-box;
		justify-content: flex-end;
		
		.fixedBott-but{
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			// background: linear-gradient(-40deg, #FF9600, #F4AA31);
			border-radius: 40rpx;
			border: 1px solid none;
			font-weight: 500;
			font-size: 30rpx;
		}
		.but1{
			width: 200rpx;
			background: #FFFFFF;
			color: #666666;
			border: 1px solid #CCCCCC;
		}
		.but2{
			width: 170rpx;
			background: #FFFFFF;
			color: #666666;
			border: 1px solid #CCCCCC;
			
		}
		.but3{
			width: 170rpx;
			background: #FFFFFF;
			color: #FF9600;
			border: 1px solid #FF9600;
		}
		.but4{
			width: 170rpx;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			color: #FFFFFF;
			
		}
		
	}
	.topCard{
		width: 750rpx;
		height: 230rpx;
		background: linear-gradient(-40deg, #FF9600, #F4AA31);
		padding: 46rpx 36rpx 0 36rpx;
		box-sizing: border-box;
		position: relative;
		z-index: -1;
	}
	.pageView{
		margin-top: -50rpx;
		background: $pageBgColor;
		border-radius: 20rpx;
		padding: 30rpx 32rpx;
		box-sizing: border-box;
	}
	.statusName{
		font-weight: bold;
		font-size: 40rpx;
		line-height: 40rpx;
		color: #FFFFFF;
	}
	.statusText{
		font-weight: 500;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #FFFFFF;
	}
	.card{
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
		.cardTitle{
			font-weight: bold;
			font-size: 32rpx;
			color: #000000;
		}
	}
	.iconView{
		text-align: center;
		font-weight: 500;
		font-size: 22rpx;
		color: #333333;
	}
	.carView{
		width: calc(100% - 220rpx);
		.carName{
			font-weight: bold;
			font-size: 34rpx;
			line-height: 34rpx;
			color: #000000;
		}
		.carText{
			font-weight: 500;
			font-size: 24rpx;
			line-height: 24rpx;
			color: #333333;
			margin: 25rpx 0;
		}
		.carTime{
			font-weight: bold;
			font-size: 24rpx;
			line-height: 24rpx;
			color: #333333;
		}
	}
	
	.gsName{
		font-weight: bold;
		font-size: 26rpx;
		line-height: 26rpx;
		color: #000000;
	}
	.gsAddr{
		font-weight: 500;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #999999;
	}
	
	.labelName{
		font-weight: 500;
		font-size: 26rpx;
		color: #000000;
		text{
			color: #FF9600;
		}
	}
	.labelRight{
		font-weight: 800;
		font-size: 28rpx;
		color: #000000;
	}
	
	.label2Name{
		font-weight: 500;
		font-size: 26rpx;
		color: #666666;
	}
	.label2Right{
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
		text{
			display: inline-block;
			background: #FFFFFF;
			border-radius: 6rpx;
			border: 1rpx solid #CCCCCC;
			padding: 5rpx 9rpx;
			box-sizing: border-box;
			font-weight: 500;
			font-size: 20rpx;
			color: #666666;
		}
	}
</style>