<!-- 市场活动列表 -->
<template>
	<view class="pageView">
		<view class="search-bar">
			<view class="searcch-box flex">
				<image class="icon-32 m-r-10" :src="imgUrl+'new_search.png'" mode=""></image>
				<u-input v-model="activityName" placeholder="请输入关键字搜索" border="none" placeholder-style="color: #999"
					@confirm="handleSearch" clearable @clear="handleClear" @input="handleInput"/>
			</view>
		</view>
		<view class="content" v-for="(item,index) in list" :key="index">
			<view class="card"  @click="toNav(`/pages_D/usedCar/activityDetails?id=${item.id}`)">
				<image class="card-img" :src="item.coverImageUrl" mode=""></image>
				<view class="card-cnet">
					<view class="card-cnet-left">
						<view class="card-cnet-name texNoWrap">{{item.activityName}}</view>
						<up-gap height="12"></up-gap>
						<!-- <view class="card-cnet-text">
							<up-icon name="map" color="#FF9600"></up-icon>
							<text class="texNoWrap">{{item.location}}</text>
						</view> -->
					</view>
				</view>
			</view>
			<up-gap height="20"></up-gap>
		</view>
	</view>

</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	import { toast, debounce } from '@/utils/common';
	import { toNav, toBack } from '@/utils/route';
	import type { MarketActivity } from "../types.ts";
	interface Props {
		list : MarketActivity[];
	}
	const activityName = ref<string>('');
	const props = defineProps<Props>();
	const emit = defineEmits<{
	  (e: 'search', keyword: string): void;
	  (e: 'reset'): void;
	}>();

	// 搜索
	const handleSearch = () => {
	  const keyword = activityName.value.trim();
	  emit('search', keyword);
	};
	
	const handleInput = debounce(handleSearch, 300);
	
	// 清空搜索
	const handleClear = () => {
	  activityName.value = '';
	  emit('reset');
	};
</script>

<style lang="scss" scoped>
	.pageView {
		box-sizing: border-box;
	}

	.search-bar {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;

		.searcch-box {
			height: 70rpx;
			background: #F5F5F5;
			border-radius: 410rpx 410rpx 410rpx 410rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0rpx 24rpx;
			flex: 1
		}

		.btn {
			width: 76rpx;
			// background: #FF8B03;
			background: linear-gradient(to bottom,#5AD6D6,#069FA4);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			font-weight: 500;
			font-size: 24rpx;
			color: #FFFFFF;
			box-sizing: border-box;
			padding: 8rpx 14rpx;
			margin-left: 32rpx;
		}
	}

	.content {
		padding: 24rpx 30rpx 0;
	}

	.card {
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);

		.card-img {
			width: 100%;
			max-height: 254rpx;
			border-radius: 16rpx 16rpx 0rpx 0rpx;
		}

		.card-cnet {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 26rpx 32rpx;
			box-sizing: border-box;

			.card-cnet-left {
				width: calc(100% - 166rpx);
			}

			.card-cnet-name {
				font-weight: 700;
				font-size: 32rpx;
				color: #333333;
			}

			.card-cnet-text {
				display: flex;
				align-items: center;
				font-weight: 400;
				font-size: 28rpx;
				color: #666666;

				text {
					margin-left: 10rpx;
				}
			}

			.card-cnet-but {
				width: 146rpx;
				height: 64rpx;
				line-height: 64rpx;
				text-align: center;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				font-weight: 400;
				font-size: 24rpx;
				color: #FFFFFF;

			}
		}
	}
	
	.g-btn {
		background: #999999;
	}
	
	.b-btn {
		background: $bgLgColor;
	}
</style>