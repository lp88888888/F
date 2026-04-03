<template>
	<view class="titleView" :data-theme="pageTheme" >
		<view class="titleView-item">
			<view class="titleView-item-line"></view>
			<view class="titleView-item-text">{{title}}</view>
		</view>
		<view class="titleView-but" v-if="isButShow" @click="butClick">
			<text>更改</text>
			<image :src="imgUrl+'static/D-inf-edit-icon.png'" mode=""></image>
		</view>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import {ref,computed} from 'vue';
	import { imgUrl } from '@/config';
	const emits = defineEmits(["butClick"]);
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	interface Props {
	  isButShow: boolean;
	  title:string
	}
	const props = defineProps<Props>()
	
	const butClick= ()=>{
		emits('butClick')
	}
</script>

<style lang="scss" scoped>
	.titleView{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.titleView-item{
			display: flex;
			align-items: center;
			
			.titleView-item-line{
				width: 8rpx;
				height: 34rpx;
				background: var(--primary-color);
				border-radius: 4rpx;
			}
			.titleView-item-text{
				height: 34rpx;
				line-height: 34rpx;
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;
				margin-left: 17rpx;
			}
		}
		.titleView-but{
			width: 116rpx;
			height: 44rpx;
			background: var(--primary-color);
			border-radius: 22rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 500;
			font-size: 24rpx;
			color: #FFFFFF;
			image{
				width: 20rpx;
				height: 20rpx;
				margin-left: 8rpx;
			}
		}
	}
</style>