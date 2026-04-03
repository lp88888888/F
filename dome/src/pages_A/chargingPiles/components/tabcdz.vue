<template>
	<view class="container" style="height: 550rpx;  box-sizing: border-box;">
		<!-- 标题区域 -->
		<view class="header">
			<view class="title">
				<view>沿途共计<text class="count">3</text>个充电桩</view>
			</view>
		</view>
		<scroll-view scroll-y="true" style="height: calc(100% - 100rpx);"
			:show-scrollbar="false">
			<view v-for="item in fwqlist " :key="item.id" class="service-card">
				<view class="info-block">
					<view class="name">{{item.rkname}}</view>
					<view class="distance">
						<image class="icon" :src="imgUrl+'img/daohang.png'" mode="aspectFit"></image>距您5.72km
					</view>
					<view class="price"><text style="font-size: 24rpx;" >¥</text>1.2/度<text style="font-size: 24rpx;color: #999999;" >起</text></view>
				</view>
				<!-- 状态与充电信息 -->
				<view class="status-block">
					<view class="operating-status">营业中</view>
					<view class="charge-status-fast">
						<view class="type">快</view>
						<view class="availability">闲3/4</view>
					</view>
					<view class="charge-status-slow">
						<view class="type">慢</view>
						<view class="availability">闲3/4</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue'
	import { imgUrl } from '../../../config';
	const fwqlist = ref([
		{ id: 1, rkname: '渭南西服务区' },
		{ id: 2, rkname: '泾阳北' },
		{ id: 3, rkname: '泾阳北' },
		{ id: 4, rkname: '泾阳北' }
	])
</script>

<style scoped lang="scss">
	.container {
		height: 800rpx;
		position: relative;
		background: #F6F5F4;
		border-radius: 36rpx 36rpx 0rpx 0rpx;
		
	}

	.header {
		padding: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;
		margin-bottom: 20rpx;
	}

	.count {
		color: $color;
		font-weight: bold;
		margin: 0 8rpx;
	}

	.tag-list {
		display: flex;
		gap: 20rpx;
		flex-wrap: wrap;
	}

	.tag {
		text-align: center;
		line-height: 56rpx;
		width: 126rpx;
		height: 56rpx;
		background: #F7F8FA;
		border-radius: 16rpx;
		font-weight: bold;
		font-size: 24rpx;
		color: #000000;

		&.active {
			width: 126rpx;
			height: 56rpx;
			background: #FFFAF2;
			border-radius: 16rpx;
			border: 1px solid $color;
			font-weight: bold;
			font-size: 24rpx;
			color: $color;
		}
	}

	.service-card {
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 32rpx;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
		margin: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}


	.info-block {
		height: 200rpx;
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
	}

	.status-block {
		height: 200rpx;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
	}

	.name{
		font-weight: bold;
		font-size: 30rpx;
		color: #333333;
		line-height: 60rpx;
	}
	.distance{
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
	}
	.price {
		font-weight: 500;
		font-size: 38rpx;
		color: $color;
	}

	.operating-status {
		width: 100rpx;
		height: 42rpx;
		background: #F0F8F4;
		border-radius: 21rpx;
		font-weight: 500;
		font-size: 22rpx;
		color: #00964E;
		text-align: center;
		line-height: 42rpx;
	}

	.icon {
		width: 16px;
		height: 16px;
		margin-right: 4px;
		vertical-align: middle;
	}

	.charge-status-slow {
		display: flex;
		width: 158rpx;
		height: 56rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		border: 1px solid #00ACA6;

		.type {
			width: 56rpx;
			height: 56rpx;
			background: #00ACA6;
			text-align: center;
			line-height: 56rpx;
			color: #fff;

		}

		.availability {
			width: 102rpx;
			height: 56rpx;
			font-weight: 500;
			font-size: 24rpx;
			color: #00ACA6;
			text-align: center;
			line-height: 56rpx;
		}
	}

	.charge-status-fast {
		display: flex;
		width: 158rpx;
		height: 56rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		border: 1px solid #00964E;

		.type {
			width: 56rpx;
			height: 56rpx;
			background: #00964E;
			text-align: center;
			line-height: 56rpx;
			color: #fff;

		}

		.availability {
			width: 102rpx;
			height: 56rpx;
			font-weight: 500;
			font-size: 24rpx;
			color: #00964E;
			text-align: center;
			line-height: 56rpx;
		}
	}
</style>