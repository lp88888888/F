<template>
	<view class="back" :style="{ top: statusBarHeight + 'px', height: titleBarHeight + 'px' }" @click="goBack">
		<image class="back-icon" :src="imgUrl + 'prev.png'" :lazy-load="true" alt="" />
		<text></text>
	</view>

	<view class="station-image">
		<image :src="info.merchantImage" alt="" :lazy-load="true" />
	</view>

	<view class="station-info">
		<view class="cont">
			<view class="name texNoWrap">
				{{ info.merchantName  }}
			</view>
			<view class="info">
				<view class="texNoWrap">{{ info.merchantAddress  }}</view>
				<!-- #ifdef APP -->
				<!-- <view class="" @click="goMap">
					<bdMapView ref="bdMapViewRef" class="map"></bdMapView>
				</view> -->
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="map">
					<map v-if="latitude !== 0 && longitude !== 0" :longitude="longitude" :latitude="latitude"
						:markers="makers" enable-zoom="false" enable-scroll="false" enable-rotate="false" scale="9">
						<cover-view class="map-view" @click="goMap"></cover-view>
					</map>
				</view>
				<!-- #endif -->
			</view>
		</view>
	</view>

	<view class="station-bottom"></view>


</template>

<script setup lang="ts">
	import { imgUrl } from '../../config';
	import { ref, onMounted } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getnaturalGasStation } from '@/api/map';
	import { openAPPLocation, openLocation } from '@/utils/util';
	const systemInfo = uni.getSystemInfoSync();
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin';
	const isApp = systemInfo.uniPlatform === 'app';
	// 定义响应式状态
	const statusBarHeight = ref<number>(54);
	const titleBarHeight = ref<number>(44);
	const type = ref<number>(0);
	const id = ref<string>('');
	const latitude = ref<number>(0);
	const longitude = ref<number>(0);
	const makers = ref<any[]>([]);
	const stationInfo = ref<any>({
		detailList: [],
		other: [],
	});
	// const mapShow = ref<boolean>(false);
	onLoad((options) => {
		id.value = options.id;
	});
	// 页面加载时获取数据
	onMounted(() => {
		statusBarHeight.value = uni.getStorageSync('statusBarHeight') || 54;
		titleBarHeight.value = uni.getStorageSync('navBarHeight') || 44;
		type.value = 1;
		getDetail();
	});

	// 返回上一页
	const goBack = () => {
		uni.navigateBack();
	};
	// 跳转到地图页面
	const goMap = () => {
		if (isApp) {
			const navigationInfo = {
				endLocation: {
					longitude: Number(info.value.merchantLon),
					latitude: Number(info.value.merchantLat),
					address: info.value.merchantAddress,
				},
			};
			openAPPLocation(navigationInfo);
		} else {
			openLocation({
				latitude: Number(info.value.merchantLat), // 纬度
				longitude: Number(info.value.merchantLon), // 经度
				name: info.value.merchantName, // 地址名称（服务区名称）
				address: info.value.merchantAddress, // 地址
				scale: 18, // 缩放级别，1~20，数值越大，地图越精细
			});
		}
	};
	const info = ref({});
	// 获取站点详情
	const getDetail = async () => {
		const res = await getnaturalGasStation(id.value);
		info.value = res.data;
		latitude.value = Number(info.value.merchantLat) || 0;
		longitude.value = Number(info.value.merchantLon) || 0;
		setMaker()
	};

	// 设置地图标记
	const setMaker = () => {
		if (latitude.value === 0 || longitude.value === 0) return;
		const maker = [
			{
				// id: util.ID2(10),
				latitude: latitude.value,
				longitude: longitude.value,
				zIndex: 2,
				iconPath: `${imgUrl}${'fuwu-station-icon'}.png`,
				width: '32',
				height: '39',
				type: 'camera',
			},
		];
		makers.value = maker;
	};
</script>

<style scoped lang="scss">
	.back {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		padding-left: 10px;
	}

	.back-icon {
		width: 20rpx;
		height: 35rpx;
	}

	.station-image,
	.station-image image {
		width: 100%;
		height: 422rpx;
		/* background-color: #999; */
	}

	.station-info {
		width: 100%;
		height: 418rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 372rpx;
		// #ifdef APP
		background: #ffffff;
		// #endif
		// #ifdef MP-WEIXIN
		background-image: linear-gradient(180deg, #fff3e9 0%, #f0f0f0 20%), linear-gradient(#ffffff, #ffffff);
		// #endif

		background-blend-mode: normal, normal;
		border-radius: 50rpx 50rpx 0px 0px;
	}

	.cont {
		width: 700rpx;
		// #ifdef APP
		// min-height: 200rpx;
		// #endif
		// #ifdef MP-WEIXIN
		height: 366rpx;
		// #endif
		background: #fff;
		margin: 20rpx auto;
		background-image: linear-gradient(180deg, #f0f0f0 0%, #ffffff 100%), linear-gradient(#ffffff, #ffffff);
		background-blend-mode: normal, normal;
		border-radius: 10rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.cont .name {
		height: 80rpx;
		width: 100%;
		line-height: 80rpx;
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
		border-bottom: solid 1rpx #e1e1e1;
	}

	.cont .info {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-top: 20rpx;
	}

	.cont .info>view:nth-child(1),
	.cont .info>view:nth-child(2) {
		font-size: 28rpx;
		color: #666666;
		line-height: 45rpx;
	}

	.cont .info>view:nth-child(3) {
		width: 100%;
		height: 154rpx;
		/* background-color: #000000; */
		border-radius: 10rpx;
		margin-top: 20rpx;
	}

	.map {
		position: relative;
	}

	.map map {
		width: 100%;
		height: 154rpx;
		border-radius: 10rpx;
	}

	.map-view {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 154rpx;
		/* background-color: #ccc; */
		z-index: 3;
	}

	.station-bottom {
		width: 100%;
		// #ifdef APP
		min-height: 170rpx;
		// #endif
		// #ifdef MP-WEIXIN
		height: 368rpx;
		// #endif
	}

	.service {
		width: 700rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		margin: 0 auto;
		padding: 10rpx 18rpx 0;
		box-sizing: border-box;
		// #ifdef APP
		position: relative;
		z-index: 2;
		// #endif
	}

	.service .tit {
		font-size: 28rpx;
		font-weight: bold;
		line-height: 60rpx;
		color: #333333;
	}

	.service-icon {
		display: flex;
		flex-wrap: wrap;
	}

	.service-icon>view {
		width: 120rpx;
		height: 110rpx;
		border-radius: 10rpx;
		border: solid 1rpx #e1e1e1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 11rpx;
		margin-bottom: 15rpx;
	}

	.service-icon>view:nth-child(5n) {
		margin-right: 0;
	}

	.service-icon>view>image {
		width: 39rpx;
		height: 41rpx;
		margin-bottom: 10rpx;
	}

	.service-icon>view>text {
		font-size: 24rpx;
		color: #333333;
	}
</style>