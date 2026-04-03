<template>
	<view class="pageView">
		<map :latitude="currentLat" v-if="currentLat" :longitude="currentLng" :scale="14" :markers="markers" class="map"
			@markertap="handleMarkerTap" :polyline="polyline" :include-points="includePoints"></map>

		<!-- 顶部筛选搜索 -->

		<view class="input-container">
			<view class="input-group">
				<!-- 左侧图标和文本 -->
				<view style="width: 80%;">
					<view class="input-icon" style="border-bottom: 2rpx solid rgba(0, 0, 0, 0.06);">
						<span class="icon-dot"></span>
						<span>我的位置</span>
					</view>
					<view class="input-icon">
						<span class="icon-dot"></span>
						<input type="text" placeholder="请输入目的地" class="up-input">
					</view>
				</view>
				<view class="swap-icon" @click="handleSwap">⇅</view>
			</view>
		</view>
		<view class="use-btn-mz">
			<image :src="imgUrl+'img/miaozhunicon.png'" style="width: 89rpx; height: 89rpx;"></image>
		</view>
		<!-- 侧面按钮-列表，订单，路线规划 -->
		<view class="foot-list">
			<Tabcdz></Tabcdz>
		</view>

	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import theme from '@/utils/theme'
	import {
		imgUrl
	} from '../../config';
	import Tabcdz from './components/tabcdz.vue';
	import QQMapWX from "@/common/qqmap-wx-jssdk.js";
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});
	const currentLat = ref(0);
	const currentLng = ref(0);
	const markers = ref([]);
	const polyline = ref([]);
	const includePoints = ref([]);
	const loading = ref(true);
	const errorMsg = ref('');


	const handleSwap = () => {
		console.log('交换图标被点击');
		// 你可以在这里添加处理交换功能的逻辑
	};
	// 初始化地图
	const initMap = async () => {
		loading.value = true;
		errorMsg.value = '';

		try {
			// 获取用户位置
			const locationRes = await new Promise((resolve, reject) => {
				uni.getLocation({
					type: 'gcj02', // 腾讯地图使用gcj02坐标系
					success: resolve,
					fail: reject
				});
			});

			currentLat.value = locationRes.latitude;
			currentLng.value = locationRes.longitude;

			// 添加用户位置标记
			markers.value = [{
				id: 0,
				latitude: currentLat.value,
				longitude: currentLng.value,
				// iconPath: imgUrl + '/images/activeIcons/fuwu-station-icon-new.png', // 可替换为自己的图标
				width: 30,
				height: 30,
				zIndex: 10
			}];
		} catch (err) {
			console.error('初始化地图失败:', err);
			errorMsg.value = '获取位置失败，请检查权限设置';
		} finally {
			loading.value = false;
		}
	};

	// 处理标记点击
	const handleMarkerTap = (e) => {
		const markerId = e.markerId;
		if (markerId === 0) return; // 忽略用户自己的标记

		const selectedShop = shopList.value[markerId - 1];
		if (selectedShop) {
			navigateToShop(selectedShop);
		}
	};

	// 导航到商店详情（这里只是示例，实际项目中可跳转到详情页）
	const navigateToShop = (shop) => {
		showToast({
			title: `你选择了: ${shop.title}`,
			duration: 2000
		});

	};
	onMounted(() => {
		initMap();
	});
</script>

<style lang="scss" scoped>
	.use-btn-mz {
		width: 112rpx;
		border-radius: 10rpx;
		padding: 14rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 32rpx;
		top: 50vh;
		z-index: 9999;
	}

	.pageView {
		width: 100%;
		height: 100vh;
		position: relative;
	}

	.map {
		width: 100%;
		height: 100%;
	}

	.foot-list {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: transform 0.3s ease;
		z-index: 999;
	}

	.header-search {}

	/* 样式部分 */
	.input-container {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		background-color: #fff;
		width: 100%;
		padding: 24rpx 42rpx;
		box-sizing: border-box;

	}

	.input-group {
		width: 100%;
		box-sizing: border-box;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #EBEBEB;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 16rpx;
	}

	.input-icon {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		color: #333;
		font-size: 28rpx; // 14px -> 28rpx
		padding: 24rpx 0;
	}

	.icon-dot {
		display: inline-block;
		width: 16rpx; // 8px -> 16rpx
		height: 16rpx;
		background-color: #007AFF; // 蓝色，iOS风格
		border-radius: 50%;
		margin-right: 16rpx; // 8px -> 16rpx
	}

	.up-input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		font-size: 28rpx;
		color: #333;
		height: 100%;
		line-height: 90rpx;
	}

	.swap-icon {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 48rpx; // 24px -> 48rpx
		height: 48rpx;
		background-color: #e0e0e0;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #666;
		font-size: 28rpx; // 16px -> 28rpx
	}
</style>