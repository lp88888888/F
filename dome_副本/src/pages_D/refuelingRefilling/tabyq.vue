<template>
	<cos-header title='选择加油' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
		:defaultNavBarheight="100"></cos-header>
	<view class="container" :style="{ paddingTop: navBarHeight + 'px' }">
		<view class="jiayou-box" @click="togoujiayou">
			<view class="jiayou-box-1">
				<image :src="imgUrl+'tab-icon-2.png'" style="width: 36rpx; height: 36rpx;margin-right: 20rpx;"></image>
				<text class="text-1" style="color:#FF9000 ;">加油专区</text>
			</view>
			<view class="jiayou-box-2">
				<view class="jiayou-box-3">
					<view class="text-2" style="color:#FF9000 ;">汽油、柴油</view>
					<view class="text-3">高速补能省时省心，油汽满格奔赴前程</view>
				</view>
				<view class="jiayou-box-4"><up-icon name="arrow-right" color="#fff" size="16"></up-icon></view>
			</view>
		</view>
		<!-- 	<view class="jiaqi-box">
<view class="jiayou-box-1">
				<image :src="imgUrl+'tab-icon-1.png'" style="width: 36rpx; height: 36rpx;margin-right: 20rpx;"></image>
				<text class="text-1"  style="color:#4788FA ;" >加气专区</text>
			</view>
			<view class="jiayou-box-2">
				<view class="jiayou-box-3">
					<view class="text-2"  style="color:#4788FA ;" >汽油、柴油</view>
					<view class="text-3" >高速补能省时省心，油汽满格奔赴前程</view>
				</view>
				<view class="jiayou-box-5"><up-icon name="arrow-right" color="#fff" size="16"></up-icon></view>
			</view>
		</view> -->

	</view>
</template>

<script setup lang="ts">
	import {
		ref,
		onMounted,
		computed
	} from 'vue';
	import { getKycMerchantInfoList } from '@/api/index';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { showLoading, hideLoading, showToast, ID2 } from '@/utils/util';
	import { imgUrl } from '../../config';
	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	import { getDrivingRoute, LatLng } from '@/utils/polyline';
	import theme from '@/utils/theme';
	const navBarHeight = ref(0);
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	const backgroundColor = ref<string>("#FFFFFF");
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const togoujiayou = () => {
		uni.navigateTo({
			url: '/pages_D/refuelingRefilling/index'
		})
	}
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		height: 100vh;
		background-color: $pageBgColor;
	}

	.jiayou-box {
		width: 690rpx;
		height: 246rpx;
		background-image: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/tab-bj-2.png');
		background-repeat: no-repeat;
		background-size: cover;
		background-repeat: no-repeat;
		border-radius: 12rpx;
		margin-top: 30rpx;
		margin-left: 30rpx;
		margin-bottom: 30rpx;
		padding: 30rpx;
		box-sizing: border-box;
	}

	.jiaqi-box {
		width: 690rpx;
		height: 246rpx;
		background-image: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/tab-bj-1.png');
		background-repeat: no-repeat;
		background-size: cover;
		border-radius: 12rpx;
		margin-left: 30rpx;
		padding: 30rpx;
		box-sizing: border-box;
	}

	.jiayou-box-1 {
		display: flex;
		align-items: center;

		.text-1 {
			font-weight: 700;
			font-size: 32rpx;
		}
	}

	.jiayou-box-2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.jiayou-box-3 {
		.text-2 {
			font-weight: 700;
			font-size: 32rpx;
		}

		.text-3 {
			font-size: 24rpx;
			color: #666666;
			margin-top: 16rpx;
		}
	}

	.jiayou-box-4 {
		width: 52rpx;
		height: 52rpx;
		background: #FF9000;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}

	.jiayou-box-5 {
		width: 52rpx;
		height: 52rpx;
		background: #4788FA;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}
</style>