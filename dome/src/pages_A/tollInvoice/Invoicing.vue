<template>
	<view class="container" :data-theme="pageTheme" >
		<view class="success-box">
			<image class="success-box-img" :src="imgUrl+'img/bj.png'" mode=""></image>
			<view class="success-box-text">提交开票成功</view>
			<view class="success-box-jupm">
				开具申请已经受理，可进入- <text>我的发票</text>
			</view>
		</view>
		<view class="button"> 
			<view class="button-top" @click="toassociation" >
				继续开票
			</view>
			<view class="button-bot">
				返回首页
			</view>
		</view>

	</view> 
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '../../config';
import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});
	const toassociation = () => {
		uni.navigateTo({
			url: '../../pages_A/tollInvoice/association',
		})
	}
</script>

<style scoped lang="scss">
	.container {
		height: calc(100vh - 88rpx);
		background: #fff;
	}

	.button {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 536rpx;

		.button-top {
			width: 480rpx;
			height: 96rpx;
			background: var(--primary-color);
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			text-align: center;
			line-height: 96rpx;
			margin-bottom: 30rpx;
			font-weight: 700;
			font-size: 32rpx;
			color: #FFFFFF;
		}

		.button-bot {
			width: 480rpx;
			height: 96rpx;
			background: #FFFBF6;
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			border: 2rpx solid var(--primary-color);
			text-align: center;
			line-height: 96rpx;
			font-weight: 400;
			font-size: 32rpx;
			color: #666666;
		}
	}

	.success-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 140rpx;

		.success-box-img {
			width: 260rpx;
			height: 264rpx;
			border-radius: 0rpx 0rpx 0rpx 0rpx;
		}

		.success-box-text {
			font-weight: 700;
			font-size: 32rpx;
			color: #666666;
			line-height: 164rpx;
		}

		.success-box-jupm {
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;
			line-height: 28rpx;

			text {
				color: var(--primary-color);
			}
		}
	}
</style>