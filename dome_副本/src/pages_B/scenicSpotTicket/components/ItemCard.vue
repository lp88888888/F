<template>
	<view class="card fl-fs-sb" :data-theme="pageTheme" @click="toNav('/pages_B/scenicSpotTicket/detail?id='+detail.poiId)">
		<view class="imgBox">
			<up-image :src="detail.image" radius="4" width="188rpx" height="234rpx"></up-image>
			<view class="imgBox-type">{{detail.level}}</view>
			<view class="imgBox-text fl-al-ce">
				<up-icon :name="imgUrl+'static/B-scen-address-fff-icon.png'" size="14" ></up-icon>
				<text>距您{{detail.straightLineDistance}}</text>
			</view>
		</view>
		<view class="centBox">
			<view class="centBox-name texNoWrap">{{detail.poiName}}</view>
			<up-gap height="12"></up-gap>
			<view class="centBox-text texNoWrap">{{detail.introduction}}</view>
			<up-gap height="12"></up-gap>
			<view class="fl-al-ce">
				<view class="centBox-icons iconsColor1">随买随用</view>
				<view class="centBox-icons iconsColor2">随时退</view>
			</view>
			<up-gap height="16"></up-gap>
			<view class="centBox-price">
				<text class="fh">￥</text>
				<text class="num">{{detail.odsJjbProductVoList[0].odsJjbStockVo.salesPrice}}</text>
				<text class="dw">起</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import type { Detail } from '../types';
	import { useTheme } from '@/composables/useTheme';
	interface Props {
		detail:Detail;
	}
	const props = defineProps<Props>()
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = computed(() => {
		return themeStore.imgUrl
	})
</script>

<style lang="scss" scoped>
	.card{
		width: 100%;
		border-radius: 16rpx;
		background: #FFFFFF;
		padding: 30rpx 32rpx ;
		box-sizing: border-box;
		/* 卡片投影 */
		box-shadow: 0px 8rpx 20rpx 0px rgba(138, 78, 0, 0.05);
	}
	.imgBox{
		width: 188rpx;
		height: 234rpx;
		border-radius: 8rpx;
		position: relative;
		.imgBox-type{
			position: absolute;
			left: 0;
			top: 16rpx;
			width: 80rpx;
			height: 32rpx;
			border-radius: 0px 16rpx 16rpx 0px;
			background: linear-gradient(180deg, rgba(255, 144, 0, 0.79) 0%, rgba(255, 144, 0, 0.5) 100%);
			// backdrop-filter: blur(4rpx);
			// filter: blur(4rpx);
			padding-left: 14rpx;
			box-sizing: border-box;
			font-size: 20rpx;
			font-weight: bold;
			line-height: 32rpx;
			color: #FAF6F0;
		}
		.imgBox-text{
			width: 100%;
			padding: 0 12rpx;
			box-sizing: border-box;
			position: absolute;
			bottom: 12rpx;
			left: 0;
			
			font-size: 20rpx;
			font-weight: normal;
			line-height: 20rpx;
			color: #FFFFFF;
			text{
				margin-left: 8rpx;
			}
		}
	}
	.centBox{
		// 减去左侧宽度
		width: calc(100% - 188rpx - 20rpx);
		
		.centBox-name{
			font-size: 32rpx;
			font-weight: bold;
			line-height: 36rpx;
			color: #333333;
		}
		.centBox-text{
			font-size: 28rpx;
			font-weight: normal;
			line-height: 28rpx;
			color: #666666;
		}
		.centBox-icons{
			font-size: 24rpx;
			font-weight: normal;
			line-height: 24rpx;
			padding: 8rpx;
			box-sizing: border-box;
			border: 1rpx solid none;
			border-radius: 8rpx;
			margin-right: 10rpx;
		}
		.iconsColor1{
			color: var(--secondary-color);
			background: var(--head-color);
		}
		.iconsColor2{
			border: 1rpx solid #999999;
			color: #999999;
		}
		.centBox-price{
			.fh{
				font-size: 32rpx;
				font-weight: bold;
				line-height: 32rpx;
				color: var(--secondary-color);
			}
			.num{
				font-size: 48rpx;
				font-weight: bold;
				line-height: 48rpx;
				color: var(--secondary-color);
				margin-right: 6rpx;
			}
			.dw{
				font-size: 28rpx;
				font-weight: normal;
				line-height: 28rpx;
				color: #666666;
			}
		}
		
	}
</style>