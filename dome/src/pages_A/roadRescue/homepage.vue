<template>
	<view class="container-box">

		<view class="title">
			救援平台
		</view>
		<view class="btn" @click="toggleNav">
			申请救援
		</view>
		<view class="close" @click="closeFun">
			X
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	const toggleNav = () => {
		uni.navigateTo({
			url: '../../pages_A/roadRescue/index',
		})
	}
	const closeFun = () => {
		uni.redirectTo({
			url: '/pages/home/home',
		})
	}
</script>

<style lang="scss" scoped>
	.container-box {
		width: 100%;
		height: 100vh;
		background: url('https://shanyitong.oss-cn-zhengzhou-jva.aliyuncs.com/tongyipingtai/images/app-static/jy-plk.jpg');
		background-size: 100% 100%;
		position: relative;

		.btn {
			width: 254rpx;
			padding: 20rpx;
			text-align: center;
			color: #fff;
			background: $bgLgColor;
			box-shadow: inset 0rpx 0rpx 20rpx 0rpx rgba(255, 255, 255, 0.09);
			border-radius: 414rpx 414rpx 414rpx 414rpx;
			position: fixed;
			bottom: 300rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.title {
		width: 100%;
		text-align: center;
		color: #264371;
		font-size: 66rpx;
		font-weight: bold;
		position: fixed;
		top: 350rpx;
	}

	.close {
		width: 100rpx;
		height: 100rpx;
		background: #fff;
		border-radius: 50%;
		font-weight: bold;
		color: $color;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 34rpx;
		position: fixed;
		bottom: 100rpx;
		left: 50%;
		transform: translateX(-50%);
	}
</style>