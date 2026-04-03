<template>
	<view class="checkin_box" :data-theme="pageTheme">
		<up-navbar title="" bgColor="transparent" autoBack :fixed="true"></up-navbar>
		
		<image class="page_img" :src="`${imgUrl}static/cartourism_head_img.png`" mode=""></image>

		<view class="checkin_nums">
			<image class="nums_bg" :src="`${imgUrl}static/cartourism_check_box_bg.png`" mode=""></image>
			<view class="nums_title">
				<image :src="`${imgUrl}static/cartourism_check_s_icon.png`" mode=""></image>
				<text>我的打卡</text>
			</view>
			<view class="nums_box">
				<view class="num_box">
					<text>{{ checkinStats?.clockCount || 0 }}</text>
					<text>累计打卡</text>
				</view>
				<view class="num_line"></view>
				<view class="num_box">
					<text>{{ checkinStats?.pointCount|| 0 }}</text>
					<text>累计积分</text>
				</view>
			</view>
		</view>

		<view class="card_box">
			<view class="card_title">
				<image :src="`${imgUrl}static/cartourism_check_t_icon.png`" mode=""></image>
				<text>活动打卡规则</text>
			</view>
			<view class="rules_box">
				<up-parse :content="intoDetail.clockRulesDesc"  ></up-parse>
			</view>
		</view>

		<view class="card_box">
			<view class="card_title">
				<image :src="`${imgUrl}static/cartourism_check_t_icon.png`" mode=""></image>
				<text>交旅打卡站点</text>
			</view>
			<view class="site_box">
				<view class="site_item" v-for="(item, index) in checkinSites" :key="index">
					<view class="site_img">
						<text>{{StatusText(item.operationalStatus)}}</text>
						<image :src="item.tollStationImg" mode="" :lazy-load="true"></image>
					</view>
					<view class="site_r">
						<view class="site_t">
							<text>{{item.tollStationName}}</text>
							<image :src="`${imgUrl}static/cartourism_check_add_icon.png`" mode="" @click.stop="handleNavigation(item)"></image>
						</view>
						<view class="site_add">{{item.tollStationAddress}}</view>
						<view class="site_info">
							<text>收费站</text>
							<text>{{item.distance}}</text>
							<view class="" @click.stop="checkClick(item)" v-if="item.clockState == 0">打卡</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<up-popup mode="center" bgColor="transparent" :safeAreaInsetBottom="false" :show="show" @close="close">
			<view style="width: 600rpx;">
				<view class="modal-container">
				  <view class="modal-title">自动打卡授权申请</view>
				  <view class="modal-text">为方便您在打卡点快速获得积分，开启后，当您进入打卡点{{intoDetail?.clockInRules?.range || 3}}公里范围内，系统将为您自动完成打卡。您的位置信息仅用于本次自动打卡判断，不会用于其他用途。是否同意开启自动打卡？</view>
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
		<PageDurationTracker pageName="车主节打卡" />
	</view>
</template>

<script setup>
	import { ref, onMounted, computed, watch } from 'vue';
import { imgUrl } from '@/config';
import { toast } from '@/utils/common';
import {getCheckinInfo, getMyCheckinStats, getCheckinTollList,checkin,autoCheckin,getAutoCheckinAuthStatus,authAutoCheckin } from '@/api/checkin';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { openAPPLocation, openLocation, makePhoneCall } from '@/utils/util';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
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
  	console.log("打卡统计", res)
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
		stationName:'',
		log:longitude.value,
		lat:latitude.value,
		activityType:intoDetail.value.activityType
  	})
	console.log('打卡收费站参数',{
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
		
		console.log('0-09--0-res0-0-0-0-0-',{
			activeId:intoDetail.value.id,
			log:longitude.value,
			lat:latitude.value,
		});
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
			toast('授权成功')
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
		const res = await getCheckinInfo('car_owner_festival')
		intoDetail.value = res.data || {};
		console.log("打卡统3373873837837计信息", res)
		queryCheckinStats()
		queryCheckinTollList()
		checkStetus()
	}catch(err){
		toast(err)
		console.log("查询打卡统计信息失败", err)
	}
}

const latitude = ref('')
const longitude = ref('')

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

onLoad(()=>{
	getAddressChange()
})
</script>

<style lang="scss" scoped>
view,
text {
	box-sizing: border-box;
}
.checkin_box {
	width: 750rpx;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	.page_img {
		width: 750rpx;
		height: 555rpx;
		border-radius: 0rpx 0rpx 32rpx 32rpx;
	}
	.checkin_nums {
		width: 699rpx;
		height: 210rpx;
		padding: 25rpx 30rpx;
		margin-top: -159rpx;
		z-index: 9;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		margin-bottom: 72rpx;
		.nums_bg {
			width: 699rpx;
			height: 210rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
		.nums_title {
			display: flex;
			align-items: center;
			image {
				width: 35rpx;
				height: 31rpx;
				margin-right: 20rpx;
			}
			text {
				font-weight: 700;
				font-size: 30rpx;
				color: #3d3d3d;
			}
		}
		.nums_box {
			width: 100%;
			height: 98rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.num_box {
				flex: 1 0;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				text:nth-child(1) {
					font-weight: 700;
					font-size: 48rpx;
					color: var(--primary-color);
				}
				text:nth-child(2) {
					font-weight: 400;
					font-size: 26rpx;
					color: #666666;
				}
			}
			.num_line {
				height: 98rpx;
				width: 2rpx;
				background-color: #d8d8d8;
			}
		}
	}

	.card_box {
		width: 699rpx;
		background: var(--success-color);
		box-shadow: 0rpx 2rpx 8rpx 0rpx #d3e7d1;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		padding-top: 78rpx;
		margin-bottom: 72rpx;
		position: relative;
		.card_title {
			width: 352rpx;
			height: 123rpx;
			// box-shadow: 0rpx 5rpx 13rpx 0rpx #b0d0ae;
			filter: drop-shadow(0rpx 5rpx 13rpx 0rpx #b0d0ae);
			border-radius: 0rpx 0rpx 0rpx 0rpx;
			position: absolute;
			top: -62rpx;
			left: 50%;
			transform: translateX(-50%);
			image {
				width: 352rpx;
				height: 123rpx;
			}
			text {
				font-weight: 700;
				font-size: 30rpx;
				color: #3d3d3d;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 40rpx;
				word-break: keep-all;
			}
		}
		.rules_box {
			width: 634rpx;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			padding-bottom: 50rpx;
			text {
				font-weight: 400;
				font-size: 26rpx;
				color: #333333;
				line-height: 34rpx;
			}
		}

		.site_box {
			width: 679rpx;
			margin: 0 auto;

			.site_item {
				width: 679rpx;
				height: 130rpx;
				margin-bottom: 59rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.site_img {
					width: 186rpx;
					height: 130rpx;
					border-radius: 10rpx 10rpx 10rpx 10rpx;
					margin-right: 29rpx;
					position: relative;
					image {
						width: 186rpx;
						height: 130rpx;
						border-radius: 10rpx 10rpx 10rpx 10rpx;
					}
					text {
						height: 31rpx;
						background: var(--primary-color);
						border-radius: 10rpx 0rpx 10rpx 0rpx;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 2;
						font-weight: 400;
						font-size: 22rpx;
						color: #ffffff;
						line-height: 31rpx;
						padding: 0 11rpx;
					}
				}
				.site_r {
					flex: 1 0;
					width: 0;
					height: 130rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.site_t {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;
						text {
							flex: 1 0;
							width: 0;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							font-weight: 700;
							font-size: 30rpx;
							color: #3d3d3d;
						}
						image {
							width: 44rpx;
							height: 44rpx;
							background: #ffebd0;
							border-radius: 50%;
						}
					}
					.site_add {
						width: calc(100% - 126rpx);
						font-weight: 400;
						font-size: 22rpx;
						color: #666666;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.site_info {
						width: 100%;
						display: flex;
						align-items: center;
						text:nth-child(1) {
							height: 32rpx;
							background: #f1fef7;
							border-radius: 6rpx 6rpx 6rpx 6rpx;
							border: 1rpx solid var(--primary-color);
							padding: 0 18rpx;
							font-weight: 400;
							font-size: 20rpx;
							color: var(--primary-color);
							line-height: 32rpx;
							margin-right: 20rpx;
						}
						text:nth-child(2) {
							flex: 1 0;
							font-weight: 400;
							font-size: 22rpx;
							color: #666666;
						}
						view {
							width: 126rpx;
							height: 49rpx;
							background: var(--but-color-line);
							border-radius: 200rpx;
							text-align: center;
							line-height: 49rpx;
							font-weight: 400;
							font-size: 28rpx;
							color: #ffffff;
						}
					}
				}
			}
		}
	}
}


	.modal-container {
	  width: 600rpx;
	  background: var(--linear-color);
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
	  border: 2rpx solid var(--primary-color);
	  color: var(--primary-color);
	  border-radius: 50rpx;
	  font-size: 32rpx;
	}
	
	.btn-submit {
	  flex: 1;
	  height: 90rpx;
	  line-height: 90rpx;
	  background: var(--but-color-line);
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
