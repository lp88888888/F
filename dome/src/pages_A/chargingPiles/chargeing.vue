<template>
	<view class="details-box" :data-theme="pageTheme" >
		<cos-header :background-color="backgroundColor" :fixed="fixed" title="充电中" :defaultNavBarheight="80" />
		<view class="header-box">
			<view class="progress-container">
				<view class="progress-percentage">65%</view>
				<view class="progress-text">充电中...</view>
				<canvas type="2d" id="progressCanvas" class="progress-canvas" />
			</view>
			<view class="tiame">
				充电时长:1小时5分钟
			</view>
			<image :src="imgUrl+'car-icon.png'" mode="scaleToFill" class="image-car"></image>
		</view>
		<!-- 新增充电状态详情 -->
		<view class="charging-status">
			<view class="status-title">
				<image  class="icon" :src="imgUrl+'shandian.png'" mode="scaleToFill"></image>
				 正在充电
			</view>
			<view class="status-items">
				<view class="status-item">
					<view class="item-icon"><image :src="imgUrl+'Waitingcar-icon.png'" mode="aspectFit"></image></view>
					<view class="item-content">
						<view class="item-value">23min</view>
						<view class="item-label">预计剩余时长</view>
					</view>
				</view>
				<view class="status-item">
					<view class="item-icon"><image :src="imgUrl+'greenelectricity-icon.png'" mode="aspectFit"></image></view>
					<view class="item-content">
						<view class="item-value">20.35</view>
						<view class="item-label">预计充电度数</view>
					</view>
				</view>
				<view class="status-item">
					<view class="item-icon"><image :src="imgUrl+'bill-icon.png'" mode="aspectFit"></image></view>
					<view class="item-content">
						<view class="item-value">25.36</view>
						<view class="item-label">预计支付金额</view>
					</view>
				</view>
			</view>
			<view class="realtime-data">
				<view class="data-item">
					<view class="data-label">实时电流</view>
					<view class="data-value">11.25A</view>
				</view>
				<view class="data-item">
					<view class="data-label">实时电压</view>
					<view class="data-value">220V</view>
				</view>
				<view class="data-item">
					<view class="data-label">实时功率</view>
					<view class="data-value">120kW</view>
				</view>
			</view>
		</view>
		<view class="foot-an">
			停止充电
		</view>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, onMounted, getCurrentInstance } from 'vue';
	import CosHeader from '@/components/customNavBar/index.vue';
import {
		imgUrl
	} from '../../config';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const fixed = ref<boolean>(true);
	const backgroundColor = ref<string>('#FFFFFF');

	//  在 setup 阶段获取实例（onMounted 内部）
	onMounted(() => {
		const instance = getCurrentInstance();
		if (!instance) {
			console.error('组件实例获取失败');
			return;
		}

		const query = uni.createSelectorQuery().in(instance);

		setTimeout(() => {
			query
				.select('#progressCanvas')
				.node()
				.exec(async (res) => {
					const canvasNode = res[0]?.node;
					if (!canvasNode) {
						console.error('Canvas 节点未找到');
						return;
					}

					const ctx = canvasNode.getContext('2d');
					const dpr = uni.getSystemInfoSync().pixelRatio;
					const size = 300;

					canvasNode.width = size * dpr;
					canvasNode.height = size * dpr;
					ctx.scale(dpr, dpr);
					ctx.clearRect(0, 0, size, size);

					const centerX = size / 2;
					const centerY = size / 2;
					const radius = 120;
					const startAngle = Math.PI / 2;
					const endAngle = 2 * Math.PI * 0.65 + Math.PI / 2; // 65%

					// 背景圆环
					ctx.beginPath();
					ctx.arc(centerX, centerY, radius, startAngle, startAngle + 2 * Math.PI);
					ctx.strokeStyle = '#F8F9FB';
					ctx.lineWidth = 50;
					ctx.stroke();

					// 进度圆环
					ctx.beginPath();
					ctx.arc(centerX, centerY, radius, startAngle, endAngle);
					ctx.strokeStyle = themeStore.themeColors.$primaryColor;
					ctx.lineWidth = 30;
					ctx.lineCap = 'round';
					ctx.stroke();
				});
		}, 50); // 小延迟确保 DOM 渲染完成
	});
</script>

<style scoped lang="scss">
	.foot-an{
		text-align: center;
		line-height:96rpx ;
		width: 480rpx;
		height: 96rpx;
		background: var(--linear-color);
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		font-weight: 700;
		font-size: 32rpx;
		margin: 0 auto;
		color: #fff;
	}
	.details-box {
		background: #F1EFEC;
	}

	.header-box {
		height: 1000rpx;
		background: linear-gradient(180deg, #FF9600 0%, rgba(255, 158, 0, 0) 100%);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.tiame {
		width: 352rpx;
		height: 80rpx;
		background: #FCE7C2;
		border-radius: 3640rpx 3640rpx 3640rpx 3640rpx;
		text-align: center;
		line-height: 80rpx;
		margin-top: 40rpx;
	}

	.image-car {
		width: 478rpx;
		height: 182rpx;
		margin-top: 32rpx;
	}

	.progress-container {
		position: relative;
		width: 300rpx;
		height: 300rpx;
		background-color: #FFC857;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.progress-percentage {
		font-size: 48rpx;
		color: white;
		font-weight: bold;
		z-index: 1;
	}

	.progress-text {
		font-size: 20rpx;
		color: white;
		z-index: 1;
	}

	.progress-canvas {
		position: absolute;
		width: 300rpx;
		height: 300rpx;
		top: 0;
		left: 0;
		border-radius: 50%;
	}
	.charging-status {
		display: flex;
		flex-direction: column;
		margin: 32rpx;
		padding: 32rpx;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}
	
	.status-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #3D3D3D;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		
		.icon {
			width: 33rpx;
			height: 33rpx;
			margin-right: 16rpx;
		}
	}
	
	.status-items {
		display: flex;
		justify-content: space-around;
		width: 100%;
		padding-bottom: 32rpx;
		border-bottom:  2rpx solid rgba(0,0,0,0.06);;
	}
	
	.status-item {
		width: 192rpx;
		height: 236rpx;
		background-color: #F0F8FF;
		border-radius: 16rpx;
		padding: 20rpx;
		margin: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.item-icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	
	.item-content {
		text-align: center;
	}
	
	.item-value {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.item-label {
		font-size: 24rpx;
		color: #666;
		margin-top: 5rpx;
	}
	
	.realtime-data {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		width: 100%;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
	}
	
	.data-item {
		margin: 10rpx;
		text-align: center;
		width: 30%;
	}
	
	.data-label {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 5rpx;
	}
	
	.data-value {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
</style>