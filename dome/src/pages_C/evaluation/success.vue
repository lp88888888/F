<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-navbar title="评价成功" @leftClick="toBack" bgColor="transparent" placeholder :fixed="true" :titleStyle="{ fontWeight: 'bold' }"></up-navbar>
		<view class="toNavBg"></view>
		<view class="centerBox">
			<up-gap height="116"></up-gap>
			<view class="boxTop1 fl-ce-ce">
				<image class="boxTop1-img" :src="imgUrl + 'paysecc.png'" mode=""></image>
				<text class="boxTop1-text">评价成功</text>
				<text class="boxTop1-text1">感谢您的评价</text>
			</view>
			<!-- <up-gap height="40"></up-gap> -->
			<!-- <view class="cardR">
				<image class="cardR-img" :src="imgUrl + 'pj-icon2.png'" mode=""></image>
				<text class="cardR-text">恭喜您获得评价积分！前往积分商城，查看可兑换物品～</text>
			</view> -->
			<up-gap height="196"></up-gap>
			<view class="btn_box">
				<view class="button1" @click="toRec('/pages_E/evaluate/alreadyrated')">查看评价</view>
				<view class="button2" @click="toRec('/pages_E/evaluate/index')">评价中心</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { toNav, toBack, toRec, toLau } from '@/utils/route';
import { imgUrl } from '@/config';

// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);
</script>

<style lang="scss" scoped>
.pageView {
	padding: 30rpx 32rpx;
	box-sizing: border-box;
	min-height: 100vh;
	background: #f8f9fb;
}
.cardR {
	width: 100%;
	min-height: 124rpx;
	background: #fff1f1;
	border-radius: 8rpx 8rpx 8rpx 8rpx;
	padding: 28rpx 34rpx 28rpx 160rpx;
	box-sizing: border-box;
	position: relative;

	.cardR-img {
		position: absolute;
		left: 10rpx;
		bottom: 0;
		width: 150rpx;
		height: 176rpx;
	}
	.cardR-text {
		font-weight: 400;
		font-size: 28rpx;
		color: #c85e5e;
		line-height: 40rpx;
	}
}
.toNavBg {
	width: 750rpx;
	height: 448rpx;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
	background: var(--head-color);
	border-radius: 0rpx 0rpx 0rpx 0rpx;
}
.centerBox {
	position: relative;
	z-index: 1;
}
.boxTop1 {
	flex-direction: column;
	.boxTop1-img {
		width: 120rpx;
		height: 120rpx;
		margin-bottom: 18rpx;
	}
	.boxTop1-text {
		margin-top: 10rpx;
		font-weight: bold;
		font-size: 36rpx;
		color: #333333;
		margin-bottom: 18rpx;
	}
	.boxTop1-text1 {
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}
}
.btn_box {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 30rpx;

	.button1,
	.button2 {
		width: 272rpx;
		height: 96rpx;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		text-align: center;
		line-height: 96rpx;
		font-weight: 500;
		font-size: 32rpx;
	}

	.button1 {
		border: 1rpx solid var(--primary-color);
		color: var(--primary-color);
	}
	.button2 {
		background: var(--but-color-line);
		color: #ffffff;
	}
}
</style>
