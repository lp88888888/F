<!-- 经销商列表 -->
<template>
	<view :data-theme="pageTheme" >
		<view v-for="(item,index) in list" :key="index">
			<view class="card">
				<view class="card-center" @click="toNav('/pages_D/newCar/dealerDetail?id='+item.id)">
					<up-image :src="item.image" width="144rpx" height="144rpx" radius="16rpx" :lazy-load="true"></up-image>
					<view class="card-center-rigth">
						<view class="ft-32-7-333 texNoWrap">{{item.name}}</view>
						<up-gap height="10"></up-gap>
						<view class="ft-28-4-666 texNoWrap">{{item.address}}</view>
						<up-gap height="10"></up-gap>
						<view class="card-distance ft-28-4-666">
							<up-icon name="map" color="#FF9600"></up-icon>
							<text class="texNoWrap">{{item.distance}}</text>
						</view>
					</view>
				</view>
				<up-gap height="15"></up-gap>
				<view class="card-btons">
					<view class="card-btons-item bton1" @click="navigateToApp(item.name,item.latitude,item.longitude)">导航到店</view>
				<!-- 	<view class="card-btons-item bton2" @click="zxkf">在线客服</view> -->
					<view class="card-btons-item bton3" @click="makePhoneCall(item.contactNumber)">电话咨询</view>
				</view>
			</view>
			<up-gap height="12"></up-gap>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import {imgUrl} from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import {makePhoneCall,openLocation,openAPPLocation} from '@/utils/util';
	import type {DealerType} from '../types'
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	interface Props {
	  list: DealerType[];
	}
	const props = defineProps<Props>();
	
	const navigateToApp = (name,lat,long) => {

		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": Number(long),
					"latitude": Number(lat),
					"address": name
				}
			}
			openAPPLocation(navigationInfo)
		} else {
		openLocation({
			latitude:Number(lat) ,//维度
			longitude:Number(long),//经度
			scale: 18,//缩放比例，范围5~18，默认为18
			name:name,
		})
		}
	}
	const zxkf=()=>{
		uni.showToast({ title: '该功能正在快马加鞭赶来的路上', icon: 'none' });
	}
</script>

<style lang="scss" scoped>
	.card{
		width: 100%;
		padding: 32rpx 34rpx;
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
	
	.ft-32-7-333{
		font-weight: 700;
		font-size: 32rpx;
		color: #333333;
	}
	.ft-28-4-666{
		font-weight: 400;
		font-size: 28rpx;
		color: #666666;
	}
</style>