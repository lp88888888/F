<template>
	<view class="container">
		<view class="header">
			<view :class="{ 'header-1': istpe==1, 'header-2': istpe!=1 }" @click="istpe=2">
				新增
			</view>
			<view :class="{ 'header-1': istpe==2, 'header-2': istpe!=2 }" @click="istpe=1">
				我的记录
			</view>
		</view>
		<newlyAdded v-if="istpe==2"></newlyAdded>
		<recordList v-if="istpe==1"></recordList>
	</view>
</template>
<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '../../config';
	import newlyAdded from './components/newlyAdded.vue';
	import recordList from './components/recordList.vue';
	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const navBarHeight = ref(0);
	const istpe = ref(1);
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});
</script>

<style scoped lang="scss">
	.container {
		height: calc(100vh - 88rpx);
		background: #F6F5F4;
	}

	.header {
		display: flex;
		padding: 30rpx;

	}

	.header-1 {
		width: 140rpx;
		height: 50rpx;
		background: #E7E2DD;
		border-radius: 36rpx 36rpx 36rpx 36rpx;
		font-weight: 400;
		font-size: 28rpx;
		line-height: 50rpx;
		color: #666666;
		margin-right: 30rpx;
		text-align: center;
	}

	.header-2 {
		width: 140rpx;
		height: 50rpx;
		text-align: center;
		background: $bgLgColor;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(111, 61, 0, 0.1);
		border-radius: 36rpx 36rpx 36rpx 36rpx;
		font-weight: 400;
		font-size: 28rpx;
		line-height: 50rpx;
		color: #FFFFFF;
		margin-right: 30rpx;
	}
</style>