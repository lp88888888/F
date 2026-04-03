<template>
	<view class="pageView">
		<up-navbar title="年卡" leftIconSize="22" bgColor="#FFEED2" placeholder fixed autoBack :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="tobBox"></view>
		<view class="gridBox">
			<view class="gridBox-item" v-for="(item,index) in dataList" :key="index" @click="toNav('/pages_B/scenicSpotTicket/detail?type=rights')">
				<view class="cardBox" :style="{background: item.backColor,color: item.color}">
					<view class="absBox fl-al-ce">
						<image class="absBox-img" :src="imgUrl+'static/B-direct-log-icon.png'" lazy-load mode=""></image>
						<text class="absBox-text">丝路E行</text>
					</view>
					<view class="priceBox">
						<text class="fh">￥</text>
						<text class="pric">{{item.price}}</text>
					</view>
				</view>
				<up-gap height="15"></up-gap>
				<view class="fl-ce-sb">
					<text class="nameBox">{{item.name}}</text>
					<view class="oldBox">
						<text style="font-size: 28rpx !important;font-weight: 400;line-height: 24rpx;">￥</text>
						<text>{{item.oldPrice}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	
	const dataList = ref([
		{name:'2025景区门票经典权益卡',price:88,oldPrice:150,backColor:'linear-gradient(-40deg, #FF6206, #FF7F33)',color:'#FFFFFF'},
		{name:'2025景区门票普通权益卡',price:88,oldPrice:90,backColor:'linear-gradient(-40deg, #FFE0C2, #FFECD7)',color:'#8F3E00'},
		{name:'2025景区门票普通权益卡',price:66,oldPrice:75,backColor:'linear-gradient(-40deg, #FFE0C2, #FFECD7)',color:'#8F3E00'},
	])
</script>

<style lang="scss">
	page{
		background: #F6F5F4;
	}
	.tobBox{
		width: 750rpx;
		height: 771rpx;
		background: linear-gradient(0deg, #F6F5F4, #FFECCE);
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}
	.pageView{
		padding: 32rpx;
		box-sizing: border-box;
	}
	.gridBox{
		width: 100%;
		display: grid;
		grid-template-columns: repeat(1,1fr);
		grid-gap: 24rpx;
		.gridBox-item{
			width: 100%;
			background: #FFFFFF;
			box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138,78,0,0.05);
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			padding: 30rpx;
			box-sizing: border-box;
		}
	}
	.nameBox{
		font-weight: 800;
		font-size: 32rpx;
		color: #000000;
	}
	.oldBox{
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
		text-decoration-line: line-through;
	}
	.cardBox{
		width: 100%;
		height: 210rpx;
		background: #FAF9F7;
		border-radius: 20rpx;
		position: relative;
		.absBox{
			position: absolute;
			left: 24rpx;
			top: 26rpx;
			
			.absBox-img{
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
			.absBox-text{
				font-weight: 400;
				font-size: 17rpx;
				color: #FFFFFF;
				line-height: 6rpx;
			}
		}
		.priceBox{
			display: flex;
			align-items: flex-end;
			position: absolute;
			right: 24rpx;
			bottom: 26rpx;
			.fh{
				font-weight: 700;
				font-size: 28rpx;
				line-height: 32rpx;
			}
			.pric{
				font-weight: 700;
				font-size: 56rpx;
				line-height: 45rpx;
				margin-left: 10rpx;
			}
		}
	}
	
</style>