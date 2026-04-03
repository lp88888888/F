<template>
	<view class="page-con">
		<image class="no-data" :src="imgUrl + 'volumePricing/vp_nocar.png'" />
		<view>暂无数据</view>
	</view>
</template>

<script setup lang="ts">
	import { imgUrl } from '../../config';
</script>

<style lang="scss" scoped>
	.page-con {
		height: 500rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #98a2b3;
		font-size: 28rpx;
		margin: 108rpx;
	}

	.no-data {
		width: 533rpx;
		height: 427rpx;
	}
</style>