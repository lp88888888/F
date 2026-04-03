<template>
	<view class="page-container">
		<up-sticky z-index="8888">
			<view :style="{background:topBgColor}">
				<up-navbar title="订单详情" bgColor="transparent" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
			</view>
		</up-sticky>
		<view class="backOrderColor"></view>
		<view class="pageView">
			<view class="orderSta" >
				<view class="orderSta-label">
					{{stetusTetx[orderStatus]}}
					<view class="mxText fl-al-ce m-l-20" >
						<text>还剩</text>
						<up-count-down :time="payTime" format="HH:mm:ss" autoStart millisecond @change="onChange">
							<view>
								<text class="mxText">{{ timeData.minutes }}分</text>
								<text class="mxText">{{ timeData.seconds }}秒</text>
							</view>
						</up-count-down>
						<text>可支付</text>
					</view>
				</view>
			</view>
			<view class="qCard cards" v-if="orderStatus == 2">
				<view class="qCard-title">凭【二维码】到店消费</view>
				<view class="qCard-qr">
					<up-qrcode cid="ex1" :size="180" val="sxjkdwfwpt20250326"></up-qrcode>
				</view>
				<view class="qCard-text">待使用券码</view>
				<view class="qCard-texNum">sxjkdwfwpt20250326</view>
			</view>
			
			<up-gap height="15"></up-gap>
			<order-shop-list :list="shopList"></order-shop-list>
			<view class="orderView cards m-t-30">
				<view class="orderView-title">订单信息</view>
				<order-line label="订单编号" text="JD20250328153154" borderBottom isBut @butClick="copyText('JD20250328153154')"></order-line>
				<order-line label="下单时间" text="2025-03-27 10:30:28" borderBottom></order-line>
				<order-line v-if="orderStatus != 1" label="支付时间" text="2025-03-27 10:31:00" borderBottom></order-line>
				<order-line label="备注" text="不要香菜"></order-line>
			</view>
			<view class="orderView cards m-t-30">
				<order-line label="优惠券" >
					<template #text>
						<text class="font2">￥0.9</text>
					</template>
				</order-line>
			</view>
			<view class="orderView cards m-t-30">
				<order-line >
					<template #label>
						<text class="font1">实付款</text>
					</template>
					<template #text>
						<view class="newPrice"><text style="font-size: 24rpx;">￥</text>{{flPrice(totalAmount,'left')}}<text style="font-size: 28rpx;">{{flPrice(totalAmount,'right')}}</text></view>
					</template>
				</order-line>
			</view>
		</view>
		<up-gap height="90"></up-gap>
		<view class="fixedBotttom" v-if="orderStatus != 4 && orderStatus != 5">
			<view v-if="orderStatus == 2" class="fixedBotttom-item iconColor1">申请退款</view>
			<view v-if="orderStatus == 3" class="fixedBotttom-item iconColor2" @click="toNav('./serviceEvaluation')">去评价</view>
			<template v-if="orderStatus == 1">
				<view class="fixedBotttom-item iconColor1 m-r-20">取消订单</view>
				<view class="fixedBotttom-item iconColor3">去支付</view>
			</template>
			
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref} from 'vue';
	import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import {decimalPointDivision,copyText} from "@/utils/util";
	import OrderLine from "./components/OrderLine";
	import OrderShopList from "./components/OrderShopList";
	import { toNav,toBack } from '@/utils/route';
	import type {ShopDetail} from './types.ts';
	const topBgColor = ref<string>('transparent');
	const totalAmount = ref(99.89);
	const isHx =  ref(true); // 是否核销
	const orderStatus = ref(3); // 1 待支付;2 待核销;3 已完成;4 已取消;5 退款中;
	const stetusTetx=ref({
		1:'待支付',
		2:'待核销',
		3:'已完成',
		4:'已取消',
		5:'退款中'
	})
	const payTime = ref(30 * 60 * 1000); // 倒计时时间
	
	interface TimeData{
		hours?: number;
		minutes?: number;
		seconds?: number;
	}
	
	const timeData = ref<TimeData>({});  

	const shopList = ref<Array<ShopDetail>>([
		{name:'酸菜肉丝酸汤米线',price:15,oldPrice:20,num:1},
		{name:'小米稀饭无糖',price:10,oldPrice:14,num:1},
		{name:'美味新鲜时蔬盖浇饭',price:19.9,oldPrice:20,num:1},
		{name:'美味新鲜时蔬盖浇饭',price:19.9,oldPrice:20,num:1},
		{name:'美味新鲜时蔬盖浇饭',price:19.9,oldPrice:20,num:1},
		{name:'美味新鲜时蔬盖浇饭',price:19.9,oldPrice:20,num:1},
		{name:'美味新鲜时蔬盖浇饭',price:19.9,oldPrice:20,num:1},
		{name:'美味新鲜时蔬盖浇饭',price:19.9,oldPrice:20,num:1},
		{name:'美味新鲜时蔬盖浇饭',price:19.9,oldPrice:20,num:1},
	])
	
	const flPrice = computed(()=>{
			return (price:string|number,type:string) =>{
				let srt:string = String(Number(price).toFixed(2));
				if(price){
					if(type == 'left'){
						return srt.substring(0,srt.indexOf('.'))
					}else{
						return srt.substring(srt.indexOf('.'))
					}
				}
				return ''
			}
	});
	// 定义 onChange 方法
	const onChange = (e) => {  
	  timeData.value = e;  
	};  
	onPageScroll((e) =>{
	  if (e.scrollTop < 1) {
		  topBgColor.value = 'transparent';
	  } else {
		  topBgColor.value = `linear-gradient(to bottom, rgba(255,237,206,1), rgba(255,239,216,1))`;
	  }
	})
</script>

<style lang="scss" >
	// @import './index.scss';
	.page-container{
		width: 100%;
		min-height: 100vh;
		background:$pageBgColor;
	}
	.newPrice{
		color: $color;
		font-weight: bold;
		font-size: 36rpx;
	}
	.font1{
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
	}
	.font2{
		font-weight: bold;
		font-size: 28rpx;
		color: #333333;
	}
	
	.backOrderColor{
		width: 750rpx;
		height: 771rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		background: linear-gradient(0deg, #F1EFEC, #FFECCE);
	}
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
			line-height: 40rpx;
			
		}
		.mxText{
			font-weight: 500;
			font-size: 24rpx;
			color: $color;
			line-height: 40rpx;
		}
	}
	.qCard{
		padding: 35rpx;
		box-sizing: border-box;
		
		
		border: 3px solid #FFFFFF;
		position: relative;
		.hexiao{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			background: rgba(255,255,255, .4);
		}
		.qCard-title{
			font-weight: bold;
			font-size: 32rpx;
			color: #333333;
		}
		.qCard-qr{
			padding: 30rpx 0 20rpx 0;
			display: flex;
			justify-content: center;
		}
		.qCard-text{
			text-align: center;
			padding: 10rpx 0;
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
		}
		.qCard-texNum{
			text-align: center;
			padding: 10rpx 0;
			font-weight: 500;
			font-size: 30rpx;
			color: #000000;
		}
	}
	.cards{
		background: #FFFFFF;
		border-radius: 20rpx;
	}
	.orderView{
		padding: 0 30rpx;
		box-sizing: border-box;
		.orderView-title{
			padding-top: 38rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}
	}
	.pageView{
		padding: 0 32rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
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
			width: 230rpx;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			border-radius: 44rpx;
			font-weight: 500;
			font-size: 30rpx;
		}
		.iconColor1{
			background: #FFFFFF;
			border: 1px solid #CCCCCC;
			color: #000000;
		}
		
		.iconColor2{
			background: #FFFFFF;
			border: 1px solid $color;
			color: $color;
		}
		.iconColor3{
			background: $bgLgColor;
			color: #FFFFFF;
		}
		
	}
</style>