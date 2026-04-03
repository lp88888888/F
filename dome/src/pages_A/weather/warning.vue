<template>
	<up-sticky z-index="8888">
		<view :style="{ background: themeStore.themeColors.$color2 }">
			<up-navbar title="天气预警详情" bgColor="transparent" @leftClick="toBack" leftIconColor="#000000" placeholder
				:fixed="false" :titleStyle="{ fontWeight: 'bold' }"></up-navbar>
		</view>
	</up-sticky>
	<view class="container" :data-theme="pageTheme">
		<view v-for="(item,index) in warnings" :key="index">

			<!-- 顶部自定义导航 -->
			<view class="warning-card">
				<view class="warning-card-hed">
					<image :src="imgUrl + 'mj-tq-icon.png'" mode="widthFix" class="mjion_img"></image>
					<view class="warning-card-hed-l">
						<view class="warning-card-hed-l-1">
							<text>{{item.headline}}</text>
						</view>
						<view class="warning-card-hed-l-2">
							<text>{{item.senderName}}{{item.onsetTime}}发布</text>
						</view>
					</view>
				</view>
			</view>
			<view class="text-box">
				<view class="text-1">
					{{item.criteria}}
				</view>
				<view class="text-2">
					{{item.description}}
				</view>
				<view class="text-3">
					【 {{source}} 】
				</view>
			</view>
			<view class="instruction-list">
				<view class="item">
					<text class="text-4">防御指南：</text>
				</view>
				<view v-for="(item1, index1) in  parseInstruction(item.instruction)" :key="index1" class="item">
					<text class="text">{{ item1 }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, computed, onMounted } from 'vue';
	import { onLoad, onPageScroll, onShow } from '@dcloudio/uni-app';
	import { showToastSuccess } from '@/utils/util';
	import { payInfoPrShopCarOrder } from '@/api/points';
	import { getMemberDeliveryAddress } from '@/api/user';
	import { getWeatherWarnings } from '@/api/weather' // 假设你的API接口
	import { toBack, toRec } from '@/utils/route';
	import { toast, debounce } from '@/utils/common';
	import { imgUrl } from '../../config';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	/** 顶部栏 */
	onMounted(() => {

	});
	const warnings = ref<any[]>([])
	// 拆分指令列表
	const parseInstruction = (str : string | null) : string[] => {
		if (!str) return []
		return str
			.split(/[\r\n↵]+/) // 同时支持 \n、\r\n、↵
			.map(line => line.trim())
			.filter(line => line.length > 0)
	}
	const source = ref('')
	const location = ref('')
	const getyujing = async () => {
		let params = {
			location: location.value,
		}
		try {
			const res = await getWeatherWarnings(params)
			warnings.value = res.data.alerts || []
			source.value = res.data.metadata.attributions.join(',') || ''
		} catch (error) {

		}
	}

	onShow(() => {
	});

	onLoad((e) => {
		location.value = e.location
		getyujing()
	});
</script>

<style scoped lang="scss">
	.container {
		min-height: 100vh;
		background: var(--head-color);
		display: flex;
		flex-direction: column;
		padding: 40rpx 32rpx;
		box-sizing: border-box;
	}

	.warning-card {
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx 32rpx;
	}

	.warning-card-hed {
		display: flex;
		align-items: center;
	}

	.warning-card-hed-l {
		margin-left: 24rpx;
	}

	.warning-card-hed-l-1 {
		display: flex;
		align-items: center;
	}

	.warning-card-hed-l-1 text {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
	}

	.warning-card-hed-l-2 {
		margin-top: 16rpx;
	}

	.mjion_img {
		width: 96rpx;
		height: 96rpx;
		margin-right: 16rpx;
	}

	.upion_img {
		width: 16rpx;
		height: 16rpx;
		margin-left: 8rpx;
	}

	.instruction-list {
		background: #EFF6FF;
		margin-top: 20rpx;
		border-radius: 24rpx;
		padding: 24rpx;
	}

	.item {
		display: flex;
		align-items: center;
		padding: 16rpx 0;
		font-size: 28rpx;
		color: #333;
	}

	.icon {
		font-size: 32rpx;
		margin-right: 16rpx;
		color: #007AFF;
	}

	.text {
		flex: 1;
		line-height: 1.5;
	}

	.text-box {
		background: #fff;
		border-radius: 24rpx;
		padding: 24rpx;
		margin-top: 20rpx;
	}

	.text-1 {
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 88rpx;
	}

	.text-2 {
		font-size: 28rpx;
		color: #000;
		margin-top: 20rpx;
		margin-bottom: 88rpx;
	}

	.text-3 {
		font-size: 28rpx;
		color: #999999;
		margin-top: 20rpx;
	}
	.text-4{
		font-size: 38rpx;
		color: #6C83CC;
		font-weight: bold;
	}
</style>