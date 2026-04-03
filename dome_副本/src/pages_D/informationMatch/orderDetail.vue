<template>
	<view class="page-container" :data-theme="pageTheme"  >
		<u-sticky>
			<view class="tabsView">
				<up-navbar title="货源订单列表" bgColor="transparent" @leftClick="toBack" :placeholder="true"
					:fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
			</view>
		</u-sticky>
		<view class="pageView">
			<view class="card m-b-30" v-if="detail.id">
				<view class="card-name fl-ce-sb m-b-20">
					<text>{{detail.prSupplySourceVo?.goodsName}}</text>
					<view class="card-name-icon">成功</view>
				</view>
				<!-- <view class="card-text m-b-20">
					<text class="card-text-left">装货地：</text>
					<text class="card-text-right" v-if="detail.prSupplySourceVo?.loadingAddrName">{{firName(detail.prSupplySourceVo?.loadingAddrName)}}</text>
				</view> -->
				<!-- <view class="card-text m-b-20">
					<text class="card-text-left">卸货地：</text>
					<text class="card-text-right" v-if="detail.prSupplySourceVo?.unloadingAddrName">{{firName(detail.prSupplySourceVo?.unloadingAddrName)}}</text>
				</view> -->
				<view class="card-text m-b-20 fl-al-ce">
					<text class="card-text-left">装货地：</text>
					<view class="fl-al-ce" @click.stop="openLocation({
						name:firName(detail.prSupplySourceVo?.loadingAddrName),
						address:detail.prSupplySourceVo?.loadingStraightLineDistance,
						latitude:detail.prSupplySourceVo?.loadingAddrLatitude,
						longitude:detail.prSupplySourceVo?.loadingAddrLongitude
					})">
						<text class="card-text-right">{{firName(detail.prSupplySourceVo?.loadingAddrName)}}</text>
						<u-icon name="map-fill" color="#FF9600" size="17"></u-icon>
					</view>
				</view>
				<view class="card-text m-b-20 fl-al-ce">
					<text class="card-text-left">卸货地：</text>
					<view class="fl-al-ce" @click.stop="openLocation({
						name:firName(detail.prSupplySourceVo?.unloadingAddrName),
						address:detail.prSupplySourceVo?.unloadingStraightLineDistance,
						latitude:detail.prSupplySourceVo?.unloadingAddrLatitude,
						longitude:detail.prSupplySourceVo?.unloadingAddrLongitude
					})">
						<text class="card-text-right">{{firName(detail.prSupplySourceVo?.unloadingAddrName)}}</text>
						<u-icon name="map-fill" color="#FF9600" size="17"></u-icon>
					</view>
				</view>
				<view class="card-text m-b-20">
					<text class="card-text-left">货物体积：</text>
					<text class="card-text-right">{{detail.prSupplySourceVo?.volume}}m³</text>
				</view>
				<view class="card-text m-b-20">
					<text class="card-text-left">货物重量：</text>
					<text class="card-text-right">{{detail.prSupplySourceVo?.weight}}</text>
				</view>
				
				<view class="card-text m-b-20">
					<text class="card-text-left">车牌号：</text>
					<text class="card-text-right">{{detail.sysVehicleVo?.licensePlate}}</text>
				</view>
				
				<view class="card-text m-b-20">
					<text class="card-text-left">联系人：</text>
					<text class="card-text-right">{{detail.prSupplySourceVo?.contactPerson}}</text>
				</view>
				<!-- <view class="card-text m-b-20">
					<text class="card-text-left">联系人电话：</text>
					<text class="card-text-right">{{detail.prSupplySourceVo?.contactNumber}}</text>
				</view> -->
				<view class="card-text m-b-20 fl-al-ce">
					<text class="card-text-left">联系人电话：</text>
					<view class="fl-al-ce" @click.stop="makePhoneCall(detail.prSupplySourceVo?.contactNumber)">
						<text class="card-text-right">{{detail.prSupplySourceVo?.contactNumber}}</text>
						<u-icon name="phone-fill" color="#FF9600" size="17"></u-icon>
					</view>
				</view>
				<view class="card-text m-b-20">
					<text class="card-text-left">价格：</text>
					<text class="fs-44 priceColor" style="font-weight: bold;" >{{detail.prSupplySourceVo?.price}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import { onLoad ,onReachBottom} from '@dcloudio/uni-app';
	import { getOrderPrSupplySource} from '@/api/premium';
	import {makePhoneCall,openLocation} from '@/utils/util';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const detail = ref({})
	const firName = computed(() => {
	  return (arr: string[] | any[]): string => {
	    if (Array.isArray(arr) && arr.length > 0) {
	      return arr.map(item => (typeof item === 'object' && item !== null ? item.name : String(item))).join('-');
	    }
	    return '';
	  };
	});
	const getData = async(id)=>{
		try{
			let res = await getOrderPrSupplySource(id)
			console.log(res);
			console.log(res.data);
			detail.value = res.data
			console.log(detail.value);
		}catch{
			
		}
	}
	
	onLoad((opticon)=>{
		getData(opticon.id)
	})
</script>

<style lang="scss" scoped>
	.tabsView{
		background: var(--head-color);
	}
	.page-container{
		background: #F1EFEC;
		min-height: 100vh;
	}
	.pageView{
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
	}
	.priceColor{
		 color: var(--primary-color);
	}
	.card{
		width: 100%;
		padding: 25rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
		.card-name{
			font-size: 30rpx;
			font-weight: bold;
			.card-name-icon{
				background: #19be6b;
				color: #FFFFFF;
				font-size: 24rpx;
				line-height: 24rpx;
				padding: 6rpx 20rpx;
				box-sizing: border-box;
				border-radius: 10rpx;
			}
		}
		.card-text{
			font-size: 26rpx;
			.card-text-left{
				color: #666666;
			}
			.card-text-right{
				// font-weight: bold;
				color: #333333;
			}
		}
		
	}
</style>