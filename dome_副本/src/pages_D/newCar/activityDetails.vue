<template>
	<view class="container" :data-theme="pageTheme" >
		<!-- <cos-header :backIcon="imgUrl+'trip-pro/arrow-left-icon_w.png'" title='活动详情' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="100"></cos-header> -->
			<up-navbar bgColor="transparent" title="活动详情" @leftClick="toBack" :placeholder="false" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<image class="bg-img" :src="info.detailImage" mode=""></image>
		
		<view class="content">
			<view class="card">
				<view class="fs-32 col3 fw-600 m-b-20">{{info.activityName}}</view>
				<view class="flex ali-cen fs-24 col6 m-b-25">
					<image class="time-icon m-r-10" :src="imgUrl+'time-icon.png'" mode=""></image>
					<text>活动时间：{{info.startTime}} 至 {{info.endTime}}</text>
				</view>
				<view class="line"></view>
				<view class="fs-28 col3 m-b-30 fw-500">活动详情</view>
				<view class="details-parse">
					<up-parse :content="info.description"></up-parse>
				</view>
			</view>
			
			<!-- <view v-for="(item,index) in list" :key="index"> -->
				<view class="card">
					<view class="card-center" @click="toNav('/pages_D/newCar/dealerDetail?id='+info.prIndustry4sVo?.id)">
						<up-image :src="info.prIndustry4sVo?.image" width="144rpx" height="144rpx" radius="16rpx" :lazy-load="true"></up-image>
						<view class="card-center-rigth">
							<view class="ft-32-7-333 texNoWrap">{{info.prIndustry4sVo?.name}}</view>
							<up-gap height="10"></up-gap>
							<view class="ft-28-4-666 texNoWrap">{{info.prIndustry4sVo?.address}}</view>
							<up-gap height="10"></up-gap>
							<view class="card-distance ft-28-4-666">
								<up-icon name="map" color="#FF9600"></up-icon>
								<text class="texNoWrap">{{info.prIndustry4sVo?.distance}}</text>
							</view>
						</view>
					</view>
					<up-gap height="15"></up-gap>
					<view class="card-btons">
						<view class="card-btons-item bton1" @click="navigateToApp(info.prIndustry4sVo?.name,info.prIndustry4sVo?.latitude,info.prIndustry4sVo?.longitude)">导航到店</view>
					<!-- 	<view class="card-btons-item bton2" @click="zxkf">在线客服</view> -->
						<view class="card-btons-item bton3" @click="makePhoneCall(info.prIndustry4sVo?.contactNumber)">电话咨询</view>
					</view>
				<!-- </view> -->
			</view>
		</view>
		<view class="bottom-bar">
			<view v-if="info.prCarMarketingActivityApplyVo&&info.status == 1 && info.registrationStatus == 'open' " class="btn g-btn">已报名</view>
			<view v-if="info.status == 0 " class="btn g-btn">已结束</view>
			<view v-if="info.status == 1 && info.registrationStatus == 'closed'" class="btn g-btn">已截止</view>
			<view v-if="info.status = 1 && info.registrationStatus == 'full'" class="btn g-btn">已满员</view>
			<view v-if="!info.prCarMarketingActivityApplyVo&&info.status == 1 && info.registrationStatus == 'open' " class="btn b-btn" @click="toNav(`/pages_D/newCar/activityApply?id=${id}`)">我要报名</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import {makePhoneCall,openLocation,openAPPLocation} from '@/utils/util';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { selectActivityInfo } from '@/api/car';
	import CosHeader from '@/components/customNavBar/index.vue';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	// 布局
	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#fff');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref<number>(0);
	const info = ref({})
	const lat = ref<any>('')
	const lng = ref<any>('')
	const id = ref<any>('')
	onLoad(options => {
		id.value = options.id
		getCurrentLocation()
	})
	const getCurrentLocation = () => {
	  uni.showLoading({ title: '获取位置中' });
	  uni.getLocation({
		  // #ifdef APP
		  type: 'wgs84',
		  // #endif
		  // #ifdef MP-WEIXIN
		  type: 'gcj02', // 国测局坐标系，适配腾讯/高德地图
		  // #endif
	    
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
	const getInfo = async () =>{
		try{
			const res = await selectActivityInfo(id.value,lng.value,lat.value);
			console.log('5555555555', res);
			info.value = res.data
		}catch(err){
			console.log('请求失败', err);
		}
	 
	 
	}
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
	});
	
	const navigateToApp = (name,lat,long) => {
		// #ifdef APP
		let start ={"lat": 34.2778,"lng": 108.953098,"address": "西安市"}
			if(uni.getStorageSync('address')){
				start.lat = uni.getStorageSync('address').lat
				start.lng = uni.getStorageSync('address').lng
				start.address = uni.getStorageSync('address').standardAddress || uni.getStorageSync('address').city
			}
			openAPPLocation({
				startLocation:{
					longitude:start.lng,
					latitude:start.lat,
					address:start.address,
				},
				endLocation:{
					longitude:long,
					latitude:lat,
					address:name,
				}
			})
		// #endif
		// #ifdef MP-WEIXIN
			// openLocation(data.data.data.destination)
			openLocation({
				latitude:Number(lat) ,//维度
				longitude:Number(long),//经度
				scale: 18,//缩放比例，范围5~18，默认为18
				name:name,
			})
		// #endif
		
	}
	const zxkf=()=>{
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
		background: var(--head-color);
	}
	
	.content {
		z-index: 2;
		padding-bottom: 200rpx;
		
		.time-icon {
			width: 26rpx;
			height: 26rpx;
		}
		
		.line {
			width: 630rpx;
			height: 2rpx;
			background: #D8D8D8;
			margin-bottom: 34rpx;
		}
		
		.details-parse {
			margin-bottom: 40rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;
			line-height: 44rpx;
		}
	}
	
	.card{
		width: 100%;
		padding: 32rpx 34rpx;
		margin-bottom: 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 14rpx;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138,78,0,0.05);
		
		.card-center{
			width: 100%;
			display: flex;
			justify-content: space-between;
			.card-center-rigth{
				width: calc(100% - 174rpx);
			}
			.card-distance{
				display: flex;align-items: center;
				text{
					margin-left: 10rpx;
				}
			}
		}
		
		.card-btons{
			display: grid;
			grid-template-columns: repeat(2,1fr);
			grid-gap: 16rpx;
			.card-btons-item{
				height: 72rpx;
				line-height: 72rpx;
				text-align: center;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				font-weight: 400;
				font-size: 32rpx;
			}
			.bton1{background: var(--label-color);color: #492900;}
			.bton2{background: var(--label-color);color: #492900;}
			.bton3{background: var(--primary-color);color: #FFFFFF;}
		}
	}
	
	.bottom-bar {
		width: 750rpx;
		height: 160rpx;
		background: #FFFFFF;
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0,0,0,0.03);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		border: 2rpx solid rgba(0,0,0,0.1);
		position: fixed;
		bottom: 0;
		z-index: 3;
		
		.btn {
			width: 658rpx;
			height: 96rpx;
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			font-size: 32rpx;
			color: #FFFFFF;
			line-height: 96rpx;
			font-weight: 600;
			text-align: center;
			margin: 32rpx auto;
		}
	}
	
	.g-btn {
		background: #999999;
	}
	
	.b-btn {
		background: var(--primary-color);
	}
</style>