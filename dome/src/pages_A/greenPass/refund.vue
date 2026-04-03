<template>
	<view class="container">
		<view class="header-info">
			<text class="header-info-1">退费信息</text>
			<view class="header-info-code">
				<text>查验码:</text> 18510041570-20250320-xxxxxx
			</view>
			<view class="header-info-code">
				<text>运输车辆:</text> 陕Axxxxx
			</view>
			<view class="header-info-code">
				<text>查验结果 :</text> 合格
			</view>
			<view class="header-info-code">
				<text>查验时间 : </text>52025-03-20 15:44:00
			</view>
			<view class="header-info-code">
				<text>出口收费站 :</text> xxx收费站
			</view>
		</view>
		<view class="bottom-box">
			<view class="bottom" @click="todiscount" >
				申请退费
			</view>
		</view>

	</view>
</template>
<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '../../config';

	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const navBarHeight = ref(0);
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});
	const todiscount = () => {
		uni.navigateTo({
			url: '../../pages_A/greenPass/discount',
		})
	}
</script>

<style scoped lang="scss">
	.bottom-box {
		display: flex;
		justify-content: center;
		.bottom {
			width: 434rpx;
			height: 96rpx;
			background: $bgLgColor;
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			font-weight: 700;
			font-size: 32rpx;
			color: #FFFFFF;
			text-align: center;
			line-height: 96rpx;
		}
	}
	.container {
		height: calc(100vh - 88rpx);
		background: #F6F5F4;
		padding-top: 24rpx;
	}
	.header-info {
		width: 622rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);
		margin: 0 32rpx 32rpx 32rpx;
		padding: 32rpx;
		border-radius: 12rpx;

		.header-info-1 {
			font-weight: 700;
			font-size: 32rpx;
			color: #333333;
		}
		.header-info-code {
			font-weight: 800;
			font-size: 28rpx;
			color: #000;
			margin-top: 20rpx;

			text {
				color: #666666;
			}
		}
	}
</style>