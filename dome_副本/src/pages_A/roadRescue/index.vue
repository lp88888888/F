<template>
	<view>
		<up-navbar title="安全提醒" :bgColor="backgroundColor" @leftClick="toBack" placeholder :fixed="fixed"></up-navbar>
		<view class="container">
			<view class="bodr-box">
				<image :src="imgUrl+'yijianjy-bj.png'" mode=""></image>
				<view class="botton-box">
					<view class="botton-box-left" @click="toworkOrder">
						历史工单
					</view>
					<view class="botton-box-right" @click="tooneClickRescuer">
						一键救援
					</view>
				</view>
			</view>
			<view class="iamge-phone" @click="makePhoneCall('96113')">
				<image class="iamge-phone-img" src="https://www.sx96113.com/dljy-h5/assets/phone24-DdRz0BCF.png"
					mode=""></image>
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '../../config';
	import { onLoad } from '@dcloudio/uni-app'
	import { makePhoneCall, openLocation } from '@/utils/util';
	const backgroundColor = ref<string>('transparent');
	const fixed = ref<boolean>(true);
	const isshow = ref<boolean>(true);
	const toworkOrder = () => {
		uni.navigateTo({
			url: '../../pages_A/roadRescue/workOrder',
		})
	}
	const toBack = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	const tooneClickRescuer = () => {
		uni.navigateTo({
			url: '../../pages_A/roadRescue/oneClickRescue',
		})
	}
</script>

<style scoped lang="scss">
	.iamge-phone {
		position: -webkit-sticky;
		width: 120rpx;
		height: 110rpx;
		position: fixed;
		top: 70%;
		z-index: 99;
		right: 0;
	}

	.iamge-phone-img {
		width: 100%;
		height: 100rpx;
	}

	.container {
		background: linear-gradient( 180deg, #D1E5F9 0%, rgba(255,255,255,0) 40%);
		background-position: center;
	}

	.bodr-box {
		padding: 25rpx;

		image {
			width: 700rpx;
			height: 1050rpx;
		}
	}

	.botton-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 60rpx;

		.botton-box-left {
			width: 232rpx;
			height: 75rpx;
			background: #F8F9FB;
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			border: 1rpx solid #999999;
			font-size: 26rpx;
			text-align: center;
			line-height: 75rpx;
			color: #000;
		}
		.botton-box-right {
			width: 398rpx;
			height: 75rpx;
			background: #FD4848;
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			border: 1rpx solid #FD4848;
			font-size: 26rpx;
			text-align: center;
			line-height:75rpx;
			color: #fff;

		}
	}
</style>