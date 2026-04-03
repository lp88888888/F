<template>
	<view class="">
		<up-sticky>
			<view class="topView" >
				<up-navbar title="租车" bgColor="transparent" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
				<view class="tabs">
					<up-tabs :list="tabsList" lineColor="#FF9600" lineWidth="33" @click="click" :itemStyle="{width:'100rpx',height:'90rpx'}" :inactiveStyle="{fontWeight: '500',fontSize: '28rpx',color: '#333333'}" :activeStyle="{fontWeight: 'bold',fontSize: '28rpx',color: '#FF9600'}"></up-tabs>
				</view>
			</view>
		</up-sticky>
		<view class="pageView">
			<view v-for="(item,index) in dataList" :key="index">
				<view class="cards" @click="toNav('/pages_B/rentCar/orderDetail')">
					<view class="cards-top fl-ce-sb">
						<view class="fl-al-ce">
							<up-image :src="imgUrl+'static/huang.png'"  width="40rpx" height="40rpx" shape="circle" lazyLoad></up-image>
							<text class="cards-name">租车</text>
						</view>
						<view>
							<text class="stauText1" v-if="item.status == 1">待支付</text>
							<text class="stauText1" v-if="item.status == 2">待确认</text>
							<text class="stauText2" v-if="item.status == 3">已完成</text>
							<text class="stauText3" v-if="item.status == 4">已取消</text>
						</view>
					</view>
					<view class="cards-cen fl-ce-sb">
						<up-image :src="imgUrl+'del/car-img.png'" width="200rpx" height="160rpx" radius="3" shape="square" lazyLoad></up-image>
						<view  class="cards-cen-item">
							<view class="carName">{{item.name}}</view>
							<view class="carText">{{item.decit}}</view>
							<view class="carTime">2025.03.27 至 2025.03.29 (共3天)</view>
						</view>
						
						
					</view>
					<view class="cards-bottom fl-ce-sb">
						<view class="fl-al-ce">
							<up-icon name="clock" color="#C2C2C2" size="12"></up-icon>
							<text class="timeText">2025-03-27 10:30:28</text>
						</view>
						<view class="fl-al-ce" style="line-height: 36rpx">
							<text class="fs-24" style="color: #999999;">线下支付</text>
							<text class="fs-24" style="color: #FF9600;">￥</text>
							<text class="fs-36" style="color: #FF9600;font-weight: 600;">150</text>
						</view>
					</view>
				</view>
				<up-gap height="15" ></up-gap>
			</view>
			<ser-empty v-if="!dataList.length" text="暂无订单"></ser-empty>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,reactive,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	const tabsList = reactive([
	    { name: '全部',status:null },
	    { name: '待支付' ,status:1},
	    { name: '进行中' ,status:2},
	    { name: '已完成' ,status:3},
	    { name: '已取消' ,status:4}
	]);  
	
	const dataList = ref([
		{name:'捷达VA3',status:1,decit:'安康宏晖鑫达商贸有限公司'},
		{name:'捷达VA3',status:2,decit:'西安悦达商贸有限公司'},
		{name:'捷达VA3',status:3,decit:'西安星辰商贸有限公司'},
		{name:'捷达VA3',status:4,decit:'西安悦达商贸有限公司'},
	])
	const click=(item)=> {  
	    console.log('item', item);  
	}  
</script>

<style lang="scss" scoped>
	.topView{
		width: 100%;
		background: linear-gradient(0deg, #FFFFFF, #FFECCE);
	}
	
	.tabs{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.pageView{
		padding: 32rpx;
		box-sizing: border-box;
	}
	.cards{
		width: 100%;
		// height: 356rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		.cards-top{
			height: 80rpx;
		}
		.cards-cen{
			width: 100%;
			.cards-cen-item{
				width: calc(100% - 220rpx);
			}
			.carName{
				font-weight: bold;
				font-size: 30rpx;
				color: #000000;
			}
			.carText{
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
				margin: 20rpx 0;
			}
			.carTime{
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
			}
		}
		.cards-bottom{
			height: 95rpx;
		}
		.cards-name{
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
			margin-left: 10rpx;
		}
	}
	.timeText{
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
		margin-left: 10rpx;
	}
	.stauText1{
		font-weight: 500;
		font-size: 26rpx;
		color: #0077FF;
	}
	.stauText2{
		font-weight: 500;
		font-size: 26rpx;
		color: #C0C3CB;
	}
	.stauText3{
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
	}
	
</style>