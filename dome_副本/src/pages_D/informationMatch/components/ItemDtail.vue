<template>
	<view class="card" :data-theme="pageTheme" >
		<view class="card-name">
			<view class="card-label-item icon1 text-name" v-if="detai.goodsName">{{detai.goodsName}}</view>
			<view class="card-left-cneter">
				<view class="card-left-cneter-price">{{detai.price || 0}}元</view>
			</view>
		</view>
		<view class="card-left" @click="toNav('/pages_D/informationMatch/detail?id='+detai.id)">
			<view class="card-left-icon">
				<view class="iconitem">
					<view class="zIcon" style="background: #222836;">装</view>
					<view class="iconitem-text">{{firName(detai.loadingAddrName)}}</view>
				</view>
				<view class="icon-line"></view>
				<view class="iconitem">
					<view class="zIcon" :style="{background: themeStore.themeColors.$primaryColor}">卸</view>
					<view class="iconitem-text">{{firName(detai.unloadingAddrName)}}</view>
				</view>
			</view>
			<view class="card-left-cneter">
				<view class="card-left-cneter-buton">抢单</view>
			</view>
		</view>
		<up-line color="#F0F0F0"></up-line>
		<view class="card-label" @click="toNav('/pages_D/informationMatch/detail?id='+detai.id)">
			<view class="card-label-item icon2" v-if="detai.weight">{{detai.weight?detai.weight+'吨':'不限重量'}}</view>
			<view class="card-label-item icon3" v-if="detai.bodyworkLen">
				{{detai.bodyworkLen?detai.bodyworkLen+'米':'不限车长'}}</view>
			<view class="card-label-item icon4" v-if="detai.volume">{{detai.volume?detai.volume+'m³':'不限体积'}}</view>
		</view>
		<view class="card-bott">
			<view class="card-bott-left" @click="toNav('/pages_D/informationMatch/detail?id='+detai.id)">
				<up-icon name="map" size="12" color="#333333"></up-icon>
				<text
					class="">距您约{{detai.loadingStraightLineDistance || 0}}，全程约{{detai.totalDistance || 0}}</text>
			</view>
			<view class="card-bott-right">
				<up-icon :name="`${imgUrl}static/D-inf-tel-icon-ff9600.png`"
					@click="makePhoneCall(detai.contactNumber)" size="20"></up-icon>
				<up-icon :name="`${imgUrl}static/D-inf-nav-icon-ff9600.png`" size="20"
					@click="openLocation({latitude:detai.loadingAddrLatitude,longitude:detai.loadingAddrLongitude,name:firName(detai.loadingAddrName)})"></up-icon>
			</view>
		</view>
	</view>
	<up-gap height="15"></up-gap>
</template>

<script setup lang="ts">
	
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { makePhoneCall, openLocation } from '@/utils/util';
	import type { ItemDetail } from "../types.ts";
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	interface Props {
		detai : ItemDetail;
	}

	const props = defineProps<Props>();
	const firName = computed(() => {
		return (arr : string[] | any[]) : string => {
			if (Array.isArray(arr) && arr.length > 0) {
				let newArr = arr.slice(0, 3);
				return newArr.map(item => (typeof item === 'object' && item !== null ? item.name : String(item))).join('-');
			}
			return '';
		};
	});
</script>

<style lang="scss" scoped>
	.card {
		width: 100%;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;

		.card-left {
			display: flex;
			justify-content: space-between;
			// height: 130rpx;
			height: 90rpx;

			.card-left-icon {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-start;

				.zIcon {
					width: 34rpx;
					height: 34rpx;
					line-height: 34rpx;
					text-align: center;
					border-radius: 50%;
					font-weight: 500;
					font-size: 20rpx;
					color: #FFFFFF;
				}

				.icon-line {
					width: 1rpx;
					height: 100%;
					margin-left: 16rpx;
					border-left: 1rpx dashed #CCCCCC;
				}
			}

			.card-left-cneter {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;

				.card-left-cneter-buton {
					width: 126rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background: var(--primary-color);
					border-radius: 30rpx;
					font-weight: 500;
					font-size: 28rpx;
					color: #FFFFFF;
				}
			}

			.iconitem {
				box-sizing: border-box;
				display: flex;
				align-items: center;

				.iconitem-title {
					font-weight: bold;
					font-size: 30rpx;
					color: #000000;
					margin-left: 10rpx;
				}
				.iconitem-text{
					font-size: 26rpx;
					color: #000000;
					margin-left: 10rpx;
				}

			}


		}

		.card-label {
			width: 100%;
			padding: 30rpx 0 25rpx 0;
			display: flex;
			flex-wrap: wrap;

			.card-label-item {
				padding: 12rpx 22rpx;
				border-radius: 8rpx;
				font-weight: 500;
				font-size: 24rpx;
				margin-right: 20rpx;
			}

			.icon1 {
				background: #FFF4EA;
				color: #FF9600;
			}

			.icon2 {
				background: #FFF3F3;
				color: #FF2F00;
			}

			.icon3 {
				background: #E7F2FF;
				color: #0084FF;
			}

			.icon4 {
				background: #E6FCFF;
				color: #04BFDD;
			}
		}

		.card-bott {
			width: 100%;
			height: 88rpx;
			background: #F6F6F6;
			border-radius: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
			box-sizing: border-box;

			.card-bott-left {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;

				text {
					margin-left: 10rpx;
				}
			}

			.card-bott-right {
				width: 90rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}

	.card-name {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx 0 25rpx;
		.card-left-cneter-price {
			font-weight: 800;
			font-size: 34rpx;
			color: var(--primary-color);
			line-height: 30rpx;
		}
	}
	.text-name{
		font-size: 38rpx;
		color: #333333;
		font-weight: bold;
	}
</style>