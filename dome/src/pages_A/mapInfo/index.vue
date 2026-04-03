<template>
	<view class="container" :data-theme="pageTheme"  >
		<!-- 头部搜索+分类栏 -->
		<view class="road-header">
			<view class="searchBg-s">
				<image class="icSearch-s" :src="`${imgUrl}new_search.png`"></image>
				<input class="texSearchTip-s" placeholder="请输入关键字" v-model="roadKeyWords" type="text"
					confirm-type="search" @input="search" />
			</view>
			<view class="road-tabs">
				<view v-for="(item, index) in roadTabs" :key="index" :class="item.id === changeId ? 'active' : ''"
					@tap="changeRoad(item.id)">
					<text>{{ item.label }}{{ item.nums ? `(${item.nums})` : '' }}</text>
					<text></text>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view style="padding-top: 218rpx;" v-if="eventList.length <= 0">
			<ser-empty></ser-empty>
		</view>

		<!-- 列表滚动区域 -->
		<scroll-view v-else class="road-scroll" :scroll-top="scrollTop" scroll-y>
			<view class="road-show-view" v-for="(item, index) in eventList" :key="index">
				<view>{{ item.happenTime }}</view>
				<view class="event-type-wrap">
					<image v-if="item.eventType === '01'" :src="`${imgUrl}road-show-shijian.png`" />
					<image v-else-if="item.eventType === '03'" :src="`${imgUrl}road-show-shigu.png`" />
					<image v-else :src="`${imgUrl}road-show-yanghu.png`" />
					<text>{{ item.typeName }}</text>
				</view>
				<view class="event-desc">{{ item.eventDesc }}</view>
				<view class="road-name" v-if="item.roadName">{{ item.roadName }}</view>
			</view>
		</scroll-view>
		<PageDurationTracker pageName="路况信息" type='count'/>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '@/config';
	import { getEvents } from '@/api/map';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	// 类型定义（保持不变）
	interface RoadTabItem {
		label : string;
		nums : string | number;
		id : string;
	}

	// 状态管理（保持不变）
	const scrollViewHeight = ref(0);
	const roadKeyWords = ref('');
	const changeId = ref('04');
	const eventList = ref([]);
	const scrollTop = ref(0);

	// 分类标签数据（保持不变）
	const roadTabs = ref<RoadTabItem[]>([
		{ label: '全部', nums: '0', id: '04' },
		{ label: '事件', nums: '0', id: '01' },
		{ label: '事故', nums: '0', id: '03' },
		{ label: '养护', nums: '0', id: '02' },
	]);

	// 页面加载时初始化（保持不变）
	onMounted(() => {
		getRoadList();
		updateClickVolume();
	});

	// 更新点击量（优化参数类型）
	const updateClickVolume = () => {
		const params = {
			sourceType: '23',
		};

		// dataApi.updateClickVolume(
		//   params,
		//   () => {},
		//   (message) => {
		//     uni.showToast(message);
		//   }
		// );
	};

	// 搜索事件（保持不变）
	const search = () => {
		eventList.value = [];
		changeId.value = '04';
		getRoadList();
	};

	// 切换分类（保持不变）
	const changeRoad = (id : string) => {
		if (id === changeId.value) return;
		changeId.value = id;
		getRoadList();
	};

	// 获取道路事件列表（保持不变）
	const getRoadList = async () => {
		uni.showLoading('请求中');
		const params = {
			eventType: changeId.value,
			startTime: '',
			endTime: '',
			keywords: roadKeyWords.value,
		};
		let res = await getEvents(params)
		if (res.code == 0) {
			const arr = [...roadTabs.value];
			arr[0].nums = res.clazz.total;
			arr[1].nums = res.clazz.eventCount;
			arr[2].nums = res.clazz.accidentCount;
			arr[3].nums = res.clazz.maintenanceCount;

			eventList.value = res.clazz.list;
			// roadTabs.value = arr;
			scrollTop.value = 0;
			uni.hideLoading();
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	};
</script>


<style lang="scss" scoped>
	.container {
		overflow: hidden;
		background-color: #f0f0f2;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.road-header {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 174rpx;
		background-color: #fff;
		padding: 16rpx 0;
		position: fixed;
		top: 0;
		z-index: 1;
		border-top: 10rpx solid #f0f0f2;

		.searchBg-s {
			width: 702rpx;
			background-color: #f0f0f0;
			border-radius: 10rpx;
			height: 80rpx;
			display: flex;
			align-items: center;

			.icSearch-s {
				width: 30rpx;
				height: 30rpx;
				margin-left: 26rpx;
				margin-right: 30rpx;
			}

			.texSearchTip-s {
				font-size: 28rpx;
				color: #333;
				min-width: 80%;
				background: transparent;
			}
		}

		.road-tabs {
			width: 100%;
			height: 86rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 24rpx;
			box-sizing: border-box;
			margin-top: 10rpx;

			>view {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				>text:nth-child(1) {
					font-size: 28rpx;
					color: #333;
					margin-bottom: 6rpx;
				}

				>text:nth-child(2) {
					display: inline-block;
					width: 60rpx;
					height: 6rpx;
					background-color: transparent;
					border-radius: 3rpx;
				}
			}

			.active {
				>text:nth-child(1) {
					font-size: 32rpx;
					font-weight: bold;
				}

				>text:nth-child(2) {
					background-color: var(--primary-color);
				}
			}
		}
	}

	.empty-view {
		margin-top: 400rpx;
		display: flex;
		justify-content: center;
	}

	.road-scroll {
		background-color: #f0f0f2;
		padding-bottom: 20rpx;
		flex: 1;
		overflow: hidden;
		padding-top: 218rpx;
	}

	.road-show-view {
		width: 702rpx;
		background-color: #fefdf9;
		border-radius: 10rpx;
		margin: 10rpx auto 0;
		padding: 24rpx 20rpx 40rpx;
		box-sizing: border-box;
		position: relative;

		>view:nth-child(1) {
			font-size: 24rpx;
			line-height: 34rpx;
			color: #666;
		}

		.event-type-wrap {
			display: flex;
			align-items: center;
			margin: 20rpx 0 24rpx;

			>image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 18rpx;
			}

			>text {
				font-size: 32rpx;
				color: #333;
				font-weight: bold;
			}
		}

		.event-desc {
			width: 100%;
			padding: 24rpx 30rpx;
			box-sizing: border-box;
			background-color: #f0f0f2;
			border-radius: 10rpx;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #333;
		}

		.road-name {
			position: absolute;
			top: 32rpx;
			right: 0;
			height: 50rpx;
			background-color: var(--linear-color);
			border-radius: 25rpx 0 0 25rpx;
			padding: 0 24rpx;
			font-size: 24rpx;
			letter-spacing: 1rpx;
			color: var(--primary-color);
			line-height: 50rpx;
		}
	}
</style>