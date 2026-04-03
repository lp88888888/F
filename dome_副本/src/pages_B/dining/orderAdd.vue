<template>
	<view class="page-container">
		<up-sticky z-index="8888">
			<view :style="{background: topBgColor}">
				<up-navbar title="确认支付" bgColor="transparent" @leftClick="toBack" leftIconColor="#000000" placeholder :fixed="false" :titleStyle="{fontWeight:'bold'}"></up-navbar>
			</view>
		</up-sticky>
		<view class="backOrderColor"></view>
		
		<view class="pageView">
			<view class="cards m-t-30" style="padding: 30rpx 32rpx;">
				<view class="namBox texNoWrap">陕西安康市友好餐厅</view>
				<view class="fl-al-ce m-t-30">
					<up-icon name="map" size="12" color="#666666"></up-icon>
					<text class="addrBox m-l-10 texNoWrap">安康市宁陕县京昆高速秦岭服务区北区</text>
				</view>
				<up-line color="#EEEEEE" margin="30rpx 0 24rpx 0"></up-line>
				<view class="fl-ce-sb">
					<view class="fl-ce-ce">
						<view class="iconText m-r-20">安康服务区</view>
						<view class="iconText">距您2.6km</view>
					</view>
					<view class="fl-ce-ce">
						<up-icon :name="imgUrl+'static/B-din-select-icon.png'" size="13"></up-icon>
						<text class="font3 m-l-10">到店就餐</text>
					</view>
				</view>
			</view>
			<view class="cards m-t-30" style="padding: 30rpx 32rpx;">
				<view class="fl-ce-se">
					<view class="fl-ce-ce">
						<up-icon :name="imgUrl+'static/B-din-tel-icon.png'" size="13"></up-icon>
						<text class="font3 m-l-20">联系商家</text>
					</view>
					<view class="hhhh"></view>
					<view class="fl-ce-ce">
						<up-icon :name="imgUrl+'static/B-din-addr-icon.png'" size="13"></up-icon>
						<text class="font3 m-l-20">地图导航</text>
					</view>
				</view>
			</view>
			<up-gap height="15"></up-gap>
			<order-shop-list :list="shopList"></order-shop-list>
			<view class="cards m-t-30">
				<order-line label="优惠券" borderBottom>
					<template #text>
						<view class="fl-ce-fe">
							<text class="font1 m-r-5">兑换优惠券</text>
							<up-icon name="arrow-right" color="#FF4B33" size="12"></up-icon>
						</view>
					</template>
				</order-line>
				<order-line label="支付方式" borderBottom>
					<template #text>
						<view class="fl-ce-fe">
							<text class="font2 m-r-5">微信支付</text>
							<up-icon name="arrow-right" color="#000000" size="12"></up-icon>
						</view>
					</template>
				</order-line>
				<order-line label="">
					<template #text>
						<view class="fl-ce-fe" style="line-height: 34rpx;">
							<text class="font2 m-r-5">总计：</text>
							<view class="newPrice" :style="{color: themeStore.themeColors.$primaryColor}"><text class="fs-24">￥</text><text class="fs-34">{{decimalPointDivision(totalAmount,'left')}}</text> <text class="fs-24">{{decimalPointDivision(totalAmount,'right')}}</text></view>
						</view>
					</template>
				</order-line>
			</view>
			<view class="cards m-t-30">
				<order-line label="订单备注" >
					<template #text>
						<view class="fl-ce-fe">
							<text class="font2 m-r-5">不要葱花</text>
							<up-icon name="arrow-right" color="#000000" size="12"></up-icon>
						</view>
					</template>
				</order-line>
			</view>
		</view>
		
		<up-gap height="90"></up-gap>
		<!-- 支付按钮 -->
		<view class="bottomBut">
			<view class="newPrice" :style="{color: themeStore.themeColors.$primaryColor}"><text class="fs-24">￥</text>{{decimalPointDivision(totalAmount,'left')}}<text class="fs-28">{{decimalPointDivision(totalAmount,'right')}}</text></view>
			<view class="bottomBut-item" @click="pay">立即支付</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import {decimalPointDivision} from "@/utils/util";
	import OrderLine from "./components/OrderLine";
	import OrderShopList from "./components/OrderShopList";
	import theme from '@/utils/theme';
	import type {ShopDetail} from "./types";
	import { onPageScroll } from '@dcloudio/uni-app';
	
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);	
	
	
	const topBgColor = ref<string>('transparent');
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
	
	const totalAmount = computed(()=>{
		let num = 0
		for(let i in shopList.value){
			num += Number(shopList.value[i].price)
		}
		return num.toFixed(2)
	})
	const pay = ()=>{
		toNav('/pages_B/dining/paySuccess')
	}
	onPageScroll((e) =>{
		
	  if (e.scrollTop < 10) {
		  topBgColor.value = 'transparent';
	  } else {
		  topBgColor.value =  themeStore.themeColors.$primaryColor;
	  }
	  console.log(topBgColor.value);
	})
</script>

<style lang="scss" scoped>
	.page-container{
		width: 100%;
		min-height: 100vh;
		background: $pageBgColor;
	}
	.font1{
		font-weight: 500;
		font-size: 26rpx;
		color: #FF4B33;
	}
	.font2{
		font-weight: 500;
		font-size: 26rpx;
		color: #000000;
	}
	.font3{
		font-weight: 500;
		font-size: 22rpx;
		color: #000000;
		line-height: 26rpx;
	}
	.namBox{
		font-weight: bold;
		font-size: 32rpx;
		line-height: 32rpx;
		color: #000000;
	}
	.addrBox{
		font-weight: 500;
		font-size: 26rpx;
		line-height: 26rpx;
		color: #666666;
	}
	.iconText{
		min-width: 170rpx;
		height: 46rpx;
		line-height: 46rpx;
		background: $pageBgColor;
		border-radius: 8rpx;
		font-weight: 500;
		font-size: 24rpx;
		color: $color;
		text-align: center;
		padding: 0 26rpx;
		box-sizing: border-box;
	}
	.hhhh{
		width: 2rpx;
		height: 30rpx;
		background: #CECECE;
	}
	.pageView{
		padding: 0 32rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}
	.cards{
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		.cards-title{
			padding-top: 38rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}
	}
	
	.backOrderColor{
		width: 750rpx;
		height: 771rpx;
		position: absolute;
		top: 0;
		left: 0;
		// background: linear-gradient(180deg, #FF9600 0%, #F1EFEC 100%);
		background: $bgTemToPageColor;
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
		.bottomBut-item{
			width: 276rpx;
			height: 80rpx;
			background: $bgLgColor;
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