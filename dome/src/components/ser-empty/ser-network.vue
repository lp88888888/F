<!-- 全局列表空 -->
<template>
	<view class="empty">
		<image class="empty-img" :src="imgSrc" :style="imgStyle" mode></image>
		<text class="empty-text" :style="textStyle">{{text}}</text>
	</view>
</template>

<script lang="ts" setup>
	import { imgUrl } from '@/config';
	const props = defineProps({
		text: {
			type: String,
			default:'网络连接不稳定请重试'
		},
		imgSrc:{
			type: String,
			default:imgUrl+'ser-network-icon.png'
		},
		imgStyle:{
			type: Object,
			default:()=>({})
		},
		textStyle:{
			type: Object,
			default:()=>({
				fontSize:'28rpx'
			})
		}
	});
</script>

<style lang="scss">
	.empty{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		background: linear-gradient( 180deg, #D1E5F9 0%, rgba(255,255,255,0) 40%);
		.empty-img{
			width: 533rpx;
			height: 427rpx;
			margin: 0 auto;
		}
		.empty-text{
			line-height: 40rpx;
			text-align: center;
			font-weight: 400;
			font-size: 32rpx;
			color: #666666;
		}
	}
</style>