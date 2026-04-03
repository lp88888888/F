<template>
	<view>
		<view class="card "  @click="toNav('/pages_B/rentCar/businessDetail')">
			<view class="fl-fs-sb">
				<up-image :src="imgUrl+'static/wx-banner.png'" width="136rpx" height="136rpx" radius="5"></up-image>
				<view class="cenBox">
					<view class="name m-b-25">{{detail.name}}</view>
					<view class="fl-al-ce">
						<text class="text">{{detail.dNum}}</text>
						<text class="text">丨</text>
						<text class="text texNoWrap">{{detail.addr}}</text>
					</view>
					<view class="labers m-t-20">
						<view class="labers-iitem">奥迪</view>
						<view class="labers-iitem">轩逸</view>
						<view class="labers-iitem">卡罗拉</view>
					</view>
				</view>
			</view>
			<up-gap height="15" ></up-gap>
			<up-line color="#EEEEEE"></up-line>
			<view class="botBox fl-al-fe">
				日均￥<text class="price">{{detail.price}}</text> 起
			</view>
		</view>
		<up-gap height="15" ></up-gap>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import type {Business} from '../types';
	interface Props {
	  detail: Business;
	}
	
	const props = defineProps<Props>();
	
</script>

<style lang="scss" scoped>
	.card{
		padding: 35rpx 26rpx 0 26rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
	}
	.cenBox{
		width: calc(100% - 156rpx);
		.name{
			font-weight: bold;
			font-size: 30rpx;
			color: #000000;
			line-height: 30rpx;
		}
		.text{
			font-weight: 500;
			font-size: 24rpx;
			line-height: 24rpx;
			color: #333333;
		}
		.labers{
			display: flex;
			flex-wrap: wrap;
			grid-gap: 14rpx;
			.labers-iitem{
				display: inline-block;
				padding: 7rpx 16rpx;
				border-radius: 6rpx;
				border: 1px solid #FF9600;
				font-weight: 500;
				font-size: 22rpx;
				color: #FF9600;
				line-height: 22rpx;
			}
		}
		
	}
	.botBox{
		// height: 78rpx;
		padding:21rpx 0 27rpx 0 ;
		justify-content: flex-end;
		font-weight: 500;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #FF9600;
		.price{
			font-size: 36rpx;
			font-weight: 600;
			line-height: 36rpx;
		}
	}
	
</style>