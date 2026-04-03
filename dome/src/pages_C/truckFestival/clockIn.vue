<template>
	<view class="page-view" :data-theme="pageTheme">
		<up-navbar title="打卡赚积分" bgColor="transparent" @leftClick="toBack" :placeholder="true" :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
			<!-- <image style="width: 690rpx;height: 216rpx;" :src="imgUrl+'static/C-truck/card-icom.png'" mode=""></image> -->
			<view class="ctrdsBox">
				<image class="ctrdsBox-bgImg" :src="imgUrl+'static/C-truck/card-icom.png'" mode=""></image>
				<view class="ctrdsBox-cent">
					<view class="location-toggle">
						<!-- <text style="margin-right: 10rpx;">开启自动定位打卡</text> -->
						 <!-- <up-switch v-model="switchShow" size="20" activeColor="#76B83E" asyncChange inactiveColor="rgb(230, 230, 230)" @change="asyncChange"></up-switch> -->
						 <text class="location-toggle-texts">打卡规则</text>
					</view>
					
					<view class="stats-card">
						<view class="stats-item">
							<text class="stats-num">{{checkinStats?.clockCount|| 0}}/{{checkinStats?.clockStationCount|| 0}}</text>
							<text class="stats-label">已打卡站点</text>
						</view>
						<view class="divider"></view>
						<view class="stats-item">
							<text class="stats-num">{{checkinStats?.pointCount|| 0}}</text>
							<text class="stats-label">已获得积分</text>
						</view>
						<image class="medal-icon" src="/static/medal.png" mode="aspectFit"></image>
					</view>
				</view>
				
			</view>
		

		<view class="search-section">
			<view class="search-bar">
				<up-search placeholder="请输入收费站名称" v-model="keyword" bgColor="#FFFFFF" @change="searchChange" :showAction="false"></up-search>
				<!-- <up-icon name="search" color="#3D3D3D" size="25"></up-icon> -->
				<!-- <input type="text" placeholder="请输入收费站名称" placeholder-style="color:#ccc" /> -->
			</view>
		</view>

		<scroll-view scroll-y class="list-scroll">
			<view class="list-item" v-for="(item, index) in checkinSites" :key="index">
				<view class="item-main">
					<view class="img-box">
						<image class="station-img" :src="item.tollStationImg" :lazy-load="true" mode="aspectFill"></image>
						<view class="tag">{{StatusText(item.operationalStatus)}}</view>
					</view>

					<view class="info-box">
						<view class="station-name">{{ item.tollStationName }}</view>
						<view class="station-address">
							<image class="station-address-img" :src="imgUrl+'static/C-truck/card-icon5.png'" mode=""></image>
							<view style="flex: 1;" class="texNoWrap">{{ item.tollStationAddress }}</view>
						</view>
					</view>

					<view class="side-box">
						<image class="nav-btn" :src="imgUrl+'static/C-truck/card-icon3.png'" mode=""></image>
						<text class="distance">距您{{ item.distance }}</text>
					</view>
				</view>

				<view class="item-footer">
					<view class="status-text" :class="{ 'is-checked': item.clockState == 1 }">
						<text class="dot" :style="{ backgroundColor: item.clockState == 1 ? '#4881F5' : '#666666' }"></text>
						{{ item.clockState == 1 ? '已打卡' : '尚未打卡' }}
					</view>
					<view class="fl-al-ce">
						<text v-if="item.clockState == 1" class="points-plus">已得{{commonState.truckFestivalInfo?.clockInRules?.issuePoints || 0}}积分</text>
						<button :class="['action-btn', item.clockState == 1 ? 'btn-disabled' : 'btn-active']"
							@click="checkClick(item)">
							{{ item.clockState == 1 ? '已打卡' : '打卡' }}
						</button>
					</view>
				</view>
			</view>
			<ser-empty v-if="!checkinSites.length"></ser-empty>
			
		</scroll-view>
		
		
		<up-popup mode="center" bgColor="transparent" :safeAreaInsetBottom="false" :show="show" @close="close">
			<view style="width: 600rpx;">
				<view class="modal-container">
				  <view class="modal-title">自动打卡授权申请</view>
				  <view class="modal-text">授权开启后，您进入打卡点范围内，系统将自动完成打卡，无需手动操作！</view>
				  <view class="footer-btns">
				    <button class="btn-cancel" @click="close">暂不开启</button>
				    <button class="btn-submit" @click="handleSubmit">立即开启</button>
				  </view>
				</view>
				<view class="close-wrapper" @click="close">
					<image class="close-wrapper-img" :src="imgUrl+'static/C-truck/close-icon.png'" mode=""></image>
				</view>
			</view>
		</up-popup>
		<PageDurationTracker pageName="货车节打卡" type="time" />
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { toast } from '@/utils/common';
	import { openAPPLocation, openLocation, makePhoneCall } from '@/utils/util';
	import {getCheckinInfo, getMyCheckinStats, getCheckinTollList,checkin,autoCheckin,getAutoCheckinAuthStatus,authAutoCheckin } from '@/api/checkin';
	import { useCommonStore } from '@/store/modules/common';
	const commonState = useCommonStore();
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const switchShow = ref(false)
	const keyword = ref('')
	const searchChange = ()=>{
		queryCheckinTollList()
	}
	const asyncChange = (e) => {
		if(e){
			show.value = true
		}else{
			handleSubmit()
		}
	};
	
	// 活动信息
	const intoDetail = ref({})
	const show = ref(false)
	// 导航
	const handleNavigation = (item) => {
		// #ifdef APP-PLUS
		const navigationInfo = {
			endLocation: {
				longitude: Number(item.longitude),
				latitude: Number(item.latitude),
				address: item.tollStationAddress,
			},
		};
		openAPPLocation(navigationInfo);
		//  #endif
		// #ifdef MP-WEIXIN || APP-HARMONY
		openLocation({
			latitude: Number(item.latitude), // 纬度
			longitude: Number(item.longitude), // 经度
			name: item.tollStationName, // 地址名称（服务区名称）
			address: item.tollStationAddress, // 地址
			scale: 18, // 缩放级别，1~20，数值越大，地图越精细
		});
		// #endif
	}
	const StatusText = computed(()=>{
		return (operationalStatus)=>{
			// 01 正常 02 关闭 03 入口关闭、出口正常 04 入口正常、出口关闭 05 管制
			let text = ''
			switch(operationalStatus){
				case '01':
					text = '正常'
					break;
				case '02':
					text = '关闭'
					break;
				case '03':
					text = '入口关闭、出口正常'
					break;
				case '04':
					text = '入口正常、出口关闭'
					break;
				case '05':
					text = '管制'
					break;
			}
			return text
		}
	})
	
	// 查询打卡统计信息
	const checkinStats = ref({})
	const queryCheckinStats = async () => {
	  try{
		const res = await getMyCheckinStats({
			activeId: intoDetail.value.id
		})
		console.log("打卡统计信息", res)
		checkinStats.value = res.data || {}
	  }catch(err){
		console.log("查询打卡统计信息失败", err)
	  }
	}
	// 获取打卡收费站列表
	const checkinSites = ref([])
	const queryCheckinTollList = async () => {
	  try{
		const res = await getCheckinTollList({
	    	activeId: intoDetail.value.id,
			stationName:keyword.value,
			log:longitude.value,
			lat:latitude.value,
			activityType:intoDetail.value.activityType,
	  	})
		console.log('00000000000',{
	    	activeId: intoDetail.value.id,
			stationName:'',
			log:longitude.value,
			lat:latitude.value,
			activityType:intoDetail.value.activityType
	  	});
	  	console.log("打卡收费站444列表", res)
	  	console.log("打卡收费站444列表长度", res.data.length)
	  	checkinSites.value = res.data.map(item=>{
			if(item.distance) item.distance = `${Number(item.distance).toFixed(2)}KM`
			return item
		}) || []
	  }catch(err){
		console.log("查询打卡收费站列表失败", err)
	  }
	} 
	// 打卡
	const checkClick = async (item)=>{
		try{
			const res = await checkin({
				activeId:intoDetail.value.id,
				activityType:intoDetail.value.activityType,
				stationId:item.id,
				log:longitude.value,
				lat:latitude.value,
			})
			if(res.code == 200){
				toast("打卡成功")
				queryCheckinStats()
				queryCheckinTollList()
			}
			
			console.log('-0-00-0--0--00--0-0',res);
		}catch(err){
			toast(err.msg || '打卡失败')
			console.log("打卡失败", err)
		}
	}
	// 自动打卡
	const autoCheck = async ()=>{
		try{
			const res = await autoCheckin({
				activeId:intoDetail.value.id,
				log:longitude.value,
				lat:latitude.value,
			})
			console.log('0-09--0-0-0-0-0-0-',res);
			if(res.code == 200){
				toast('自动打卡成功');
			}
			queryCheckinStats()
			queryCheckinTollList()
			
		}catch(err){
			toast(err.msg || '自动打卡失败')
			console.log("查询打卡统计信息失败", err)
		}
	}
	// 自动打卡授权状态查询
	const checkStetus = async ()=>{
		try{
			const res = await getAutoCheckinAuthStatus({activeId:intoDetail.value.id})
			console.log('-0-0-0-00--',res); 
			if(res.data === true){
				show.value = true
			}else{
				autoCheck()
			}
		}catch(err){
			toast(err)
			console.log("查询打卡统计信息失败", err)
		}
	}
	// 自动打卡授权
	const checkChaneg = async ()=>{
		try{
			const res = await authAutoCheckin({activeId:intoDetail.value.id})
			if(res.code == 200){
				switchShow.value = !switchShow.value
				toast(switchShow.value?'授权成功':'关闭成功')
			}
		}catch(err){
			toast(err)
			console.log("查询打卡统计信息失败", err)
		}
	}
	const close = ()=>{
		show.value = false
	}
	const handleSubmit = () => {
	  checkChaneg()
	  close()
	};
	const init = async ()=>{
		try{
			const res = await getCheckinInfo('truck_festival')
			intoDetail.value = res.data || {};
			console.log("打卡统计信息", res)
			queryCheckinStats()
			queryCheckinTollList()
			checkStetus()
		}catch(err){
			toast(err)
			console.log("查询打卡统计信息失败", err)
		}
	}
	const latitude = ref<number | string>('')
	const longitude = ref<number | string>('')
	
	const getAddressChange = ()=>{
		uni.getLocation({
			  // #ifdef APP
			  type: 'wgs84',
			  // #endif
			  // #ifdef MP-WEIXIN
			  type: 'gcj02', // 国测局坐标系
			  // #endif
		  
		  success: (res) => {
			console.log(res);
		    latitude.value = res.latitude; // 赋值纬度
		    longitude.value = res.longitude; // 赋值经度
		  },
		  fail: (err) => {
			  latitude.value = uni.getStorageSync('address').lat;
			  longitude.value = uni.getStorageSync('address').lng;
		  },
		  complete: () => {
			  init()
		  }
		});
	}
	
	onMounted(()=>{
		getAddressChange()
	})
</script>

<style lang="scss" scoped>
	.page-view {
		min-height: 100vh;
		background: linear-gradient(0deg, #FCFFFC 70%, #D8F7DE 100%);
		padding: 0 24rpx;
	}
	.ctrdsBox{
		width: 690rpx;
		height: 216rpx;
		position: relative;
		
		.ctrdsBox-bgImg{
			position: absolute;
			top: 0;
			left: 0;
			right:0;
			bottom: 0;
			width: 690rpx;
			height: 216rpx;
			z-index: 0;
		}
		.ctrdsBox-cent{
			position: absolute;
			top: 0;
			left: 0;
			right:0;
			bottom: 0;
			width: 690rpx;
			height: 216rpx;
			z-index: 1;
		}
	}

	.location-toggle {
		// background-color: #BDDF9C;
		height: 60rpx;
		border-radius: 12rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		display: flex;
		// justify-content: space-between;
		align-items: center;
		justify-content: flex-end;
		font-size: 24rpx;
		color: #333333;
	}
	.location-toggle-texts{
		font-size: 24rpx;
		color:var(--primary-color)
	}

	.stats-card {
		margin-top: -10rpx;
		// background-color: #76B83E;
		border-radius:0 0 16rpx 16rpx;
		height: 180rpx;
		display: flex;
		align-items: center;
		padding: 0 40rpx;
		position: relative;
		color: #fff;
		z-index: 1;

		.stats-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			.stats-num {
				font-size: 44rpx;
				font-weight: bold;
			}

			.stats-label {
				font-size: 24rpx;
				opacity: 0.9;
			}
		}

		.divider {
			width: 2rpx;
			height: 80rpx;
			background-color: rgba(255, 255, 255, 0.3);
		}

		.medal-icon {
			position: absolute;
			right: 30rpx;
			width: 120rpx;
			height: 120rpx;
		}
	}

	.search-section {
		margin: 24rpx 0;

		.search-bar {
			background: #fff;
			height: 80rpx;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);

			input {
				flex: 1;
				margin-left: 10rpx;
				font-size: 28rpx;
			}
		}
	}

	.list-scroll {
		height: calc(100vh - 500rpx);
	}

	.list-item {
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
		.item-main {
			display: flex;
			align-items: flex-start;
		}

		.img-box {
			position: relative;
			width: 120rpx;
			height: 120rpx;

			.station-img {
				width: 100%;
				height: 100%;
				border-radius: 12rpx;
			}

			.tag {
				position: absolute;
				top: 0;
				left: 0;
				background: #27AE60;
				color: #fff;
				font-size: 20rpx;
				padding: 2rpx 10rpx;
				border-radius: 12rpx 0 12rpx 0;
			}
		}

		.info-box {
			flex: 1;
			padding: 0 20rpx;

			.station-name {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}

			.station-address {
				font-size: 24rpx;
				color: #999;
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				.station-address-img{
					width: 28rpx;
					height: 28rpx;
					margin-right:15rpx;
				}
			}
		}

		.side-box {
			display: flex;
			flex-direction: column;
			align-items: center;

			.nav-btn {
				width: 50rpx;
				height: 50rpx;
			}

			.distance {
				font-size: 20rpx;
				color: #666;
				margin-top: 15rpx;
			}
		}

		.item-footer {
			margin-top: 24rpx;
			padding-top: 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.status-text {
				font-size: 26rpx;
				color: #999;
				display: flex;
				align-items: center;

				.dot {
					width: 10rpx;
					height: 10rpx;
					border-radius: 50%;
					margin-right: 12rpx;
				}

				&.is-checked {
					color: #4881F5;
				}

				
			}
			.points-plus {
				font-size: 26rpx;
				color: #F39C12;
				margin-right: 20rpx;
			}
			.action-btn {
				margin: 0;
				padding: 0 40rpx;
				height: 56rpx;
				line-height: 56rpx;
				font-size: 26rpx;
				border-radius: 28rpx;

				&::after {
					border: none;
				}
			}

			.btn-active {
				background-color: var(--primary-color);
				color: #fff;
			}

			.btn-disabled {
				background-color: transparent;
				border: 1px solid #ccc;
				color: #999;
				display: none;
			}
		}
	}
	.modal-container {
	  width: 600rpx;
	  background: linear-gradient(0deg, #FCFFFC 70%, #D8F7DE 100%);
	  border-radius: 24rpx;
	  padding: 60rpx 40rpx 40rpx;
	  box-sizing: border-box;
	}
	
	.modal-title {
	  text-align: center;
	  font-size: 32rpx;
	  font-weight: 500;
	  color: #333;
	  margin-bottom: 20rpx;
	}
	.modal-text{
		font-size: 28rpx;
		font-weight: 350;
		line-height: 48rpx;
		text-align: center;
		color: #333333;
		margin-bottom: 20rpx;
	}
	
	.company-list {
	  display: flex;
	  flex-direction: column;
	  gap: 30rpx;
	  margin-bottom: 60rpx;
	}
	
	.company-card {
	  background-color: #ffffff;
	  border-radius: 24rpx;
	  padding: 30rpx;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  border: 4rpx solid transparent; // 预留边框位置防止跳动
	  transition: all 0.2s;
	  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	
	  &.active-card {
	    border-color: #7ab34d;
	  }
	}
	
	.card-left {
	  display: flex;
	  align-items: center;
	}
	
	.building-icon {
	  width: 60rpx;
	  height: 60rpx;
	  margin-right: 10rpx;
	  // 这里如果没图片可以用CSS画两个方块代替
	}
	
	.company-name {
	  font-size: 28rpx;
	  font-weight: 600;
	  color: #333;
	}
	
	.truck-count {
	  font-size: 22rpx;
	  color: #666666;
	  margin-top: 8rpx;
	}
	
	/* 单选框样式 */
	.radio-box {
	  .unchecked-circle {
	    width: 28rpx;
	    height: 28rpx;
	  }
	  
	  .checked-icon {
	    width: 44rpx;
	    height: 44rpx;
	    background-color: #7ab34d;
	    border-radius: 50%;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    
	    .check-mark {
	      color: #fff;
	      font-size: 24rpx;
	    }
	  }
	}
	
	/* 底部按钮 */
	.footer-btns {
	  display: flex;
	  justify-content: space-between;
	  gap: 30rpx;
	}
	
	.btn-cancel {
	  flex: 1;
	  height: 90rpx;
	  line-height: 90rpx;
	  background-color: transparent;
	  border: 2rpx solid #7ab34d;
	  color: #7ab34d;
	  border-radius: 50rpx;
	  font-size: 32rpx;
	}
	
	.btn-submit {
	  flex: 1;
	  height: 90rpx;
	  line-height: 90rpx;
	  background: linear-gradient(90deg, #80A653 4%, #B2D38A 92%);
	  color: #ffffff;
	  border-radius: 50rpx;
	  font-size: 32rpx;
	  border: none;
	  
	  &::after {
	    border: none;
	  }
	}
	
	/* 外部关闭按钮 */
	.close-wrapper {
	  margin-top: 60rpx;
	  display:flex;
	  justify-content: center;
	}
	.close-wrapper-img{
		width: 60rpx;
		height: 60rpx;
	}
</style>