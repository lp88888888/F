<template>
	<view class="container">
		<cos-header  title='' :background-color="backgroundColor"
			:font-color="fontColor" :fixed="fixed" :defaultNavBarheight="100"></cos-header>
		<image class="bg-img" :src="info.merchantImage" mode=""></image>
		<view class="station-detail-container">
			<!-- 第一部分：名称和车辆年检 -->
			<view class="section-header">
				<view class="name-section">
					<view class="title">{{info.merchantName}}</view>
					<view class="tag">车辆年检</view>
				</view>
				<view class="contact-section" @click="callPhone" >
					<image class="phone-img" :src="imgUrl+'yq-phone.png'"  mode="aspectFit"></image>
					<view class="contact-text">电话</view>
				</view>
			</view>

			<!-- 第二部分：距离信息和导航按钮 -->
			<view class="distance-and-navigation">
				<view class="location-info">
					<view class="distance">
						距离
						<text class="distance-value">{{info.distance}}</text>
					</view>
					<view class="address">{{info.merchantAddress}}</view>
				</view>
				<view class="navigation-section" @click="navigateToApp" >
					<image class="navigation-img" :src="imgUrl+'yq-dh.png'" mode="aspectFit"></image>
					<view class="navigation-text">导航</view>
				</view>
			</view>

			<!-- 第三部分：优惠信息 -->
			<!-- <view class="discount-section">
				<view class="discount-title">优惠</view>
				<view class="discount-content">{{info.stationCoupon}}</view>
			</view> -->
		</view>

	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { makePhoneCall, openLocation, openAPPLocation } from '@/utils/util';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { getMerchantByIdinfo } from '@/api/car';
	import CosHeader from '@/components/customNavBar/index.vue';
	// 布局
	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#fff');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref<number>(0);
	const info = ref({
		detailImage: "https://aisearch.cdn.bcebos.com/fileManager/ilnOuvi7EnUBEkm9rLioNh0vqFV5a7ew_bhB6S_d81Q/1763105008575F4QWxa.png"
	})
	const lat = ref<any>('')
	const lng = ref<any>('')
	const id = ref<any>('')
	onLoad(options => {
		id.value = options.merId
		getInfo()
	})
	const getCurrentLocation = () => {
		uni.showLoading({ title: '获取位置中' });
		uni.getLocation({
			type: 'gcj02', // 国测局坐标系，适配腾讯/高德地图
			success: (res) => {
				lat.value = res.latitude; // 赋值纬度
				lng.value = res.longitude; // 赋值经度
				getInfo()
				console.log('当前经纬度', lat.value, lng.value);
			},
			fail: (err) => {
				console.error('获取位置失败', err);
				uni.showToast({ title: '请开启位置权限', icon: 'none' });
			},
			complete: () => {
				uni.hideLoading();
			}
		});
	};
	const callPhone = () => {
		makePhoneCall(info.value.contactTel)
	};
	const getInfo = async () => {
		let params={
			merchantLat:uni.getStorageSync('address').lat,
			merchantLon:uni.getStorageSync('address').lng,
			merchantId:id.value
		}
		const res = await getMerchantByIdinfo(params);
		info.value = res.data
	}
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
	});

	const navigateToApp = () => {
		// #ifdef MP-WEIXIN
			openLocation({
				latitude: Number(info.value.merchantLat),//维度
				longitude: Number(info.value.merchantLon),//经度
				scale: 18,//缩放比例，范围5~18，默认为18
				name: info.value.merchantName,
			})
		// #endif
		// #ifdef APP
			openAPPLocation({
				endLocation:{
					"longitude": info.value.merchantLon,
					"latitude": info.value.merchantLat,
					"address": info.value.merchantName
				}
			})
		// #endif
	}
	const zxkf = () => {
		uni.showToast({ title: '该功能正在快马加鞭赶来的路上', icon: 'none' });
	}
</script>

<style lang="scss" scoped>
	.bg-img {
		width: 100%;
		height: 750rpx;
		z-index: 1;
	}

	.container {
		width: 100%;
		min-height: 100vh;
		background: #fff;
	}

	.station-detail-container {
		padding: 20rpx;
	}

	/* 标题和标签部分 */
	.section-header,
	.distance-and-navigation,
	{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	}

	.discount-section {
		display: flex;
		align-items: center;
		padding: 20rpx;
	}

	.name-section,
	.location-info {
		display: flex;
		flex-direction: column;
	}

	.contact-section,
	.navigation-section {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.title {
		font-size: 32rpx;
		color: #000;
		font-weight: bold;
		width: 500rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.address {
		width: 400rpx;
		font-size: 28rpx;
		color: #666;
		margin-top: 10rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.discount-title,
	.distance {
		font-size: 30rpx;
		color: #000;
		font-weight: bold;
	}

	.tag,
	.contact-text,
	.navigation-text {
		font-size: 28rpx;
		line-height: 1.5;
	}

	.discount-content {
		height: 35rpx;
		padding: 4rpx 20rpx;
		border-radius: 4rpx;
		background-color: rgba(255, 0, 0, 0.06);
		border-radius: 4rpx;
		font-size: 24rpx;
		line-height: 35rpx;
		letter-spacing: 0rpx;
		color: #ff0000;
		text-align: center;
	}

	/* 图片样式 */
	.phone-img,
	.navigation-img {
		width: 40rpx;
		height: 40rpx;
		margin-bottom: 10rpx;
	}

	/* 特定文本样式 */
	.tag {
		background-color: #f5f7fa;
		padding: 6rpx 12rpx;
		border-radius: 6rpx;
		color: #666;
	}

	.distance-value {
		color: #ff4d4f;
		font-weight: bold;
	}
</style>