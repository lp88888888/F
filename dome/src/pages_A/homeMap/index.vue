<template>
	<view class="homeMap">
		<!-- 顶部信息区 -->
		<view class="header-section" style="display: flex;">
			<view class="location-info" style="margin-right: 30rpx;">
				<image :src="imgUrl+'ind-icon20.png'" class="location-icon" mode="aspectFit"></image>
				<view class="location-text">
					<text class="address">当前定位</text><br />
					<text class="title">西安燕岭路</text>
				</view>
			</view>

			<!-- 搜索框 -->
			<view class="search-container">
				<up-search placeholder="你有什么想吃的，或者想去的" v-model="searchTex" :showAction="false" searchIconColor="#000000"
					class="search-input"></up-search>
			</view>
		</view>

		<!-- 地图区域 -->
		<map :latitude="currentLat" :longitude="currentLng" v-if="currentLat" :markers="markers" @markertap="handleMarkerTap"
			:scale="scale" class="map-container"></map>

		<!-- 服务标签区 -->
		<view class="service-tags">
			<!-- <scroll-view scroll-x="true" class="tags-scroll" :show-scrollbar="false"> -->
			<view v-for="(item, index) in serviceOptions" :key="index" class="tag-item"
				:class="{ 'tag-active': item.isshow }" @click="item.isshow = !item.isshow">
				<image :src="item.isshow ? imgUrl+'car_select.png' : imgUrl+'car_normal.png'" class="tag-icon"
					mode="aspectFit"></image>
				<text class="tag-label">{{ item.label }}</text>
			</view>
			<!-- </scroll-view> -->
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	// 假设 imageUrl 是从配置文件中引入的
	import {
		imgUrl
	} from '../../config';

	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});

	const currentLat = ref(uni.getStorageSync('address').lat);
	const currentLng = ref(uni.getStorageSync('address').lng);
	const scale = ref(14);

	const serviceOptions = ref([{
			label: '餐饮美食',
			value: 'food',
			isshow: false
		},
		{
			label: '景区门票',
			value: 'ticket',
			isshow: false
		},
		{
			label: '酒店住宿',
			value: 'hotel',
			isshow: false
		},
		{
			label: '休闲娱乐',
			value: 'entertainment',
			isshow: false
		},
		{
			label: '生活服务',
			value: 'life',
			isshow: false
		},
		{
			label: '交通出行',
			value: 'transport',
			isshow: false
		},
		{
			label: '教育培训',
			value: 'education',
			isshow: false
		}
	]);

	const markers = ref([{
		id: 0,
		latitude: currentLat.value,
		longitude: currentLng.value,
		iconPath: imgUrl + 'ind-icon20.png',
		width: 30,
		height: 30,
		title: '当前位置'
	}]);

	const handleMarkerTap = (e) => {
		console.log(e);
	};

	const searchTex = ref('');
</script>

<style scoped lang="scss">
	.homeMap {
		width: 100%;
		height: 100vh;
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	/* === 顶部信息区 === */
	.header-section {
		padding: 30rpx 24rpx;
		background-color: #ffffff;
		z-index: 10;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
	}

	.location-info {
		width: 310rpx;
		display: flex;
		align-items: center;
	}

	.location-icon {
		width: 48rpx;
		height: 48rpx;
		margin-right: 16rpx;
	}

	.location-text {}

	.location-text .title {
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}

	.location-text .address {
		font-size: 26rpx;
		color: #666666;
		margin-top: 6rpx;
	}

	.search-container {
		width: 100%;
	}

	.search-input {

		/* up-search 内部样式可能需穿透，若无效可加 ::v-deep */
		:deep(.u-search) {
			border-radius: 40rpx;
			background-color: #f0f0f0;
		}
	}

	/* === 地图区域 === */
	.map-container {
		width: 100%;
		height: 500rpx;
	}

	/* === 服务标签区 === */
	.service-tags {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		width: 100%;
		padding: 20rpx 0 30rpx;
		z-index: 20;
	}

	.tags-scroll {
		white-space: nowrap;
		padding: 0 24rpx;
	}

	.tag-item {
		display: flex;
		align-items: center;
		border-radius: 50%;
		margin-right: 12rpx;
		background-color: #fff;
		cursor: pointer;
		padding: 10rpx 20rpx;
		margin-bottom: 20rpx;
	}

	.tag-item:last-child {
		margin-right: 0;
	}

	.tag-icon {
		width: 44rpx;
		height: 44rpx;
		margin-right: 12rpx;
	}

	.tag-label {
		font-size: 24rpx;
		color: #666666;
	}

	.tag-active .tag-label {
		color: #007AFF;
		/* 或你想要的主色 */
		font-weight: bold;
	}
</style>