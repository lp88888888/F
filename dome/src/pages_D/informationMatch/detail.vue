<template>
	<view class="page-container" :data-theme="pageTheme"  >
		<u-sticky>
			<view class="tabsView">
				<up-navbar title="货源订单列表" bgColor="transparent" @leftClick="toBack" :placeholder="true"
					:fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
			</view>
		</u-sticky>
		<view class="pageView">
			<view class="cardView" v-if="detail.id">
				
				<view class="cardView-center">
					<view class="cardView-center-item">
						<view class="cardView-center-item-zIcon" style="background: #222836;">装</view>
						<view class="cardView-center-item-text">{{firName(detail.loadingAddrName)}}</view>
					</view>
					<view class="cardView-center-line"></view>
					<view class="cardView-center-item">
						<view class="cardView-center-item-zIcon" style="background: #FF9600;">卸</view>
						<view class="cardView-center-item-text">{{firName(detail.unloadingAddrName)}}</view>
					</view>
				</view>
				<up-gap height="15"></up-gap>
				<view class="card-label">
					<view class="card-label-item icon1" v-if="detail.goodsName">{{detail.goodsName}}</view>
					<view class="card-label-item icon2" v-if="detail.weight">{{detail.weight?detail.weight+'吨':'不限重量'}}</view>
					<view class="card-label-item icon3" v-if="detail.bodyworkLen">{{detail.bodyworkLen?detail.bodyworkLen+'米':'不限车长'}}</view>
					<view class="card-label-item icon4" v-if="detail.volume">{{detail.volume?detail.volume+'m³':'不限体积'}}</view>
				</view>
				<up-gap height="10"></up-gap>
				<view class="card-bott-right">
					<view class="fl-al-ce" @click.stop="makePhoneCall(detail.contactNumber)">
						<text class="m-r-5" style="font-size: 24rpx;">联系他</text>
						<up-icon :name="`${imgUrl}static/D-inf-tel-icon-ff9600.png`"  size="16"></up-icon>
					</view>
					<!-- <view class="fl-al-ce m-l-25" @click.stop="openLocation({latitude:detail.loadingAddrLatitude,longitude:detail.loadingAddrLongitude,name:firName(detail.loadingAddrName)})"> -->
					<view class="fl-al-ce m-l-25" @click.stop="addrsOpen(detail)">
						<text class="m-r-5" style="font-size: 24rpx;">去导航</text>
						<up-icon :name="`${imgUrl}static/D-inf-nav-icon-ff9600.png`" size="16" ></up-icon>
					</view>
				</view>
			</view>
			<up-gap height="15"></up-gap>
			<view class="card">
				<view class="card-item">联系人：{{detail.contactPerson}}</view>
				<view class="card-item">联系方式：{{detail.contactNumber}}</view>
				<view class="card-item">备注：{{detail.transportationRequirements}}</view>
				
			</view>
		</view>
		<up-picker :show="pickShow" :columns="sysVehicleVoList" keyName="licensePlate" @close="pickShow=false" @cancel="pickShow=false" @confirm="subConfirm"></up-picker>
		<view class="fixBox">
			<view class="fixBox-item" @click="pickOpen">立即抢单</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toast,debounce } from '@/utils/common';
	import { toNav,toBack,toRec } from '@/utils/route';
	import {imgUrl} from '@/config';
	import {makePhoneCall,openLocation,openAPPLocation} from '@/utils/util';
	import { getPrSupplySource,addOrderPrSupplySource} from '@/api/premium';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const detail = ref({});
	const pickShow = ref(false);
	const sourceId = ref<string | number>('');
	const firName = computed(() => {
		return (arr : string[] | any[]) : string => {
			if (Array.isArray(arr) && arr.length > 0) {
				// let newArr = arr.slice(0, 2);
				return arr.map(item => (typeof item === 'object' && item !== null ? item.name : String(item))).join('-');
			}
			return '';
		};
	});
	// 车辆信息
	const sysVehicleVoList = computed(()=>{
		if(detail.value.sysVehicleVoList && detail.value.sysVehicleVoList.length > 0){
			return [detail.value.sysVehicleVoList]
		}
		return [[]]
	});
	const addrsOpen = (item)=>{
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
					longitude:item.loadingAddrLongitude,
					latitude:item.loadingAddrLatitude,
					address:firName.value(item.loadingAddrName),
				}
			})
		// #endif
		// #ifdef MP-WEIXIN
		openLocation({latitude:item.loadingAddrLatitude,longitude:item.loadingAddrLongitude,name:firName.value(item.loadingAddrName)})
		// #endif
		
	}
	const pickOpen = ()=>{
		console.log('000',detail.value);
		if(!detail.value.sysVehicleVoList.length) {
			uni.showModal({
				title: '提示',
				content: '请先绑定车辆',
				confirmText:'去绑车',
				success: function (res) {
					if (res.confirm) {
						toNav('/pages_A/car/addCar');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
			return 
		}
		pickShow.value = true;
	};
	const subConfirm = (e)=>{
		const {value} = e;
		pickShow.value = false;
		sumbit(value[0].id)
	}
	const sumbit = async (vehicleId:string|number)=>{
		try{
			let res = await addOrderPrSupplySource({
				supplySourceId:detail.value.id,
				vehicleId:vehicleId,
				// tenantId:detail.value.tenantId
			})
			if(res.code == 200){
				toast('抢单成功');
				setTimeout(()=>{
					toRec('/pages_D/informationMatch/orderList');
				},1000)
				
			}
		}catch{
			
		}
	};
	const getData = async(id)=>{
		try{
			let res = await getPrSupplySource(id)
			console.log('00000',res);
			if(res.data){
				detail.value = res.data
			}
		}catch{
			
		}
	}
	
	onLoad((opticon)=>{
		sourceId.value = opticon.id
	});
	onShow(()=>{
		getData(sourceId.value);
	})

</script>

<style lang="scss" scoped>
	.tabsView{
		background: var(--head-color);
	}
	.page-container{
		min-height: 100vh;
		width: 100%;
		background: #F1EFEC;
	}
	.card-bott-right{
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.card{
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		background: #FFFFFF;
		.card-item{
			line-height: 80rpx;
		}
	}
	.fixBox{
		width: 100%;
		height: 160rpx;
		background: #FFFFFF;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 1;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		.fixBox-item{
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 30rpx;
			background: var(--but-color-line);
			border-radius: 50rpx;
			
		}
	}
	.pageView{
		width: 100%;
		padding: 25rpx;
		box-sizing: border-box;
	}
	.cardView{
		padding: 30rpx;
		box-sizing: border-box;
		width: 100%;
		
		background: linear-gradient(0deg, #FFFFFF, #FFECCE);
		border-radius: 20rpx;
		border: 3px solid #FFFFFF;
		.cardView-center{
			width: 100%;
			height: 200rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			border: 1px dashed var(--primary-color);
			padding: 40rpx;
			box-sizing: border-box;
			.cardView-center-item{
				display: flex;
				align-items: center;
				height: 38rpx;
				line-height: 38rpx;
				.cardView-center-item-zIcon{
					width: 38rpx;
					height: 38rpx;
					border-radius: 8rpx;
					font-weight: 500;
					font-size: 24rpx;
					color: #FFFFFF;
					
					text-align: center;
				}
				.cardView-center-item-text{
					font-weight: bold;
					font-size: 32rpx;
					color: #000000;
					margin-left: 26rpx;
				}
			}
			.cardView-center-line{
				width: 1rpx;
				height: 44rpx;
				margin-left: 17rpx;
				border-left: 1rpx dashed #CCCCCC;
			}
		}
		
		.cardView-text{
			display: flex;
			align-items: center;
			.cardView-text-item{
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
			}
			.cardView-text-line{
				width: 1rpx;
				height: 22rpx;
				background: #999999;
				margin: 0 20rpx;
			}
		}
		
		.cardView-but{
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background: var(--but-color-line);
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
		}
		
		.cardView-cut{
			width: 100%;
			padding: 34rpx 30rpx;
			box-sizing: border-box;
			background: #FFFFFF;
			border-radius: 16rpx;
			border: 1px dashed  var(--primary-color);
			display: flex;
			
			.cardView-cut-ceent{
				padding-left: 20rpx;
				box-sizing: border-box;
			}
			.cardView-cut-title{
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;
			}
			.cardView-cut-text{
				font-weight: 500;
				font-size: 26rpx;
				color: #999999;
			}
		}
		
	}
	
	.card-label{
		width: 100%;
		padding: 30rpx 0  25rpx 0;
		display: flex;
		flex-wrap: wrap;
		.card-label-item{
			padding: 12rpx 22rpx;
			border-radius: 8rpx;
			font-weight: 500;
			font-size: 24rpx;
			margin-right: 20rpx;
		}
		.icon1{background: #FFF4EA;color: #FF9600;}
		.icon2{background: #FFF3F3;color: #FF2F00;}
		.icon3{background: #E7F2FF;color: #0084FF;}
		.icon4{background: #E6FCFF;color: #04BFDD;}
	}
</style>