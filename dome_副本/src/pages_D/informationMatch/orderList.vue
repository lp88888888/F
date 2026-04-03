<template>
	<view class="page-container" :data-theme="pageTheme"  >
		<u-sticky>
			<view class="tabsView">
				<up-navbar title="货源订单列表" bgColor="transparent" @leftClick="toBack" :placeholder="true"
					:fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
			</view>
		</u-sticky>
		<view class="pageView">
			<view class="card m-b-30" v-for="(item,index) in dataList" :key="index" @click="toNav('/pages_D/informationMatch/orderDetail?id='+item.id)">
				<view class="card-name fl-ce-sb m-b-20">
					<text>{{item.prSupplySourceVo?.goodsName}}</text>
					<view class="card-name-icon">成功</view>
				</view>
				<view class="card-text m-b-20 fl-al-ce">
					<text class="card-text-left">装货地：</text>
					<view class="fl-al-ce" @click.stop="toAddress(item)">
						<text class="card-text-right">{{firName(item.prSupplySourceVo?.loadingAddrName)}}</text>
						<u-icon name="map-fill" color="#FF9600" size="17"></u-icon>
					</view>
				</view>
				
				
				<view class="card-text m-b-20">
					<text class="card-text-left">车牌号：</text>
					<text class="card-text-right">{{item.sysVehicleVo?.licensePlate}}</text>
				</view>
				<view class="card-text m-b-20">
					<text class="card-text-left">联系人：</text>
					<text class="card-text-right">{{item.prSupplySourceVo?.contactPerson}}</text>
				</view>
				<!-- <view class="card-text m-b-20">
					<text class="card-text-left">联系人电话：</text>
					<text class="card-text-right">{{item.prSupplySourceVo?.contactNumber}}</text>
				</view> -->
				<view class="card-text m-b-20 fl-al-ce">
					<text class="card-text-left">联系人电话：</text>
					<view class="fl-al-ce" @click.stop="makePhoneCall(item.prSupplySourceVo?.contactNumber)">
						<text class="card-text-right">{{item.prSupplySourceVo?.contactNumber}}</text>
						<u-icon name="phone-fill" color="#FF9600" size="17"></u-icon>
					</view>
				</view>
				<view class="card-text m-b-20">
					<text class="card-text-left">价格：</text>
					<text class="fs-44 priceColor" style="font-weight: bold;" >{{item.prSupplySourceVo?.price}}</text>
				</view>
				<view class="card-but">
					<view class="card-but-item">查看详情</view>
				</view>
			</view>
		</view>
		<ser-empty v-if="!dataList.length" text="暂无订单"></ser-empty>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import { onLoad ,onReachBottom} from '@dcloudio/uni-app';
	import { listOrderPrSupplySource,getOrderPrSupplySource} from '@/api/premium';
	import {imgUrl} from '@/config';
	import {makePhoneCall,openLocation} from '@/utils/util';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	// const current = ref<string|number>(0);
	// const tabList = ref([
	// 	{name: '全部',state:0},
	// 	{name: '待支付',state:1},
	// 	{name: '进行中',state:2},
	// 	{name: '已完成',state:3},
	// 	{name: '已取消',state:3},
	// ]);
	const listQuery = ref({
		pageNum: 1, 
		pageSize: 10,
	});
	const total = ref(0);
	const dataList = ref([]);
	
	const firName = computed(() => {
	  return (arr: string[] | any[]): string => {
	    if (Array.isArray(arr) && arr.length > 0) {
	      return arr.map(item => (typeof item === 'object' && item !== null ? item.name : String(item))).join('-');
	    }
	    return '';
	  };
	});
	const init = async ()=>{
		listQuery.value.pageNum = 1
		total.value= 0
		getData()
	};
	// 查询数据列表
	const getData = async ()=>{
		let params = {
			pageNum:listQuery.value.pageNum,
			pageSize:listQuery.value.pageSize,
		}
		try{
			const res = await listOrderPrSupplySource(params)
			if(res.code == 200){
				dataList.value = listQuery.value.pageNum == 1?res.rows:[...dataList.value,...res.rows];
				total.value = res.total;
			}
		}catch{
			
		}
	}
	const toAddress = (item)=>{
		openLocation({
						name:firName.value(item.prSupplySourceVo?.loadingAddrName),
						address:item.prSupplySourceVo?.loadingStraightLineDistance,
						latitude:item.prSupplySourceVo?.loadingAddrLatitude,
						longitude:item.prSupplySourceVo?.loadingAddrLongitude
					})
	}
	onLoad(()=>{
		init()
	});
	onReachBottom(()=>{
		if(listQuery.value.pageNum * listQuery.value.pageSize < total.value){
			listQuery.value.pageNum++;
			getData();
		}
	})
</script>

<style lang="scss" scoped>
	.page-container{
		background: #F1EFEC;
		min-height: 100vh;
	}
	.tabsView{
		display: flex;
		justify-content: center;
		background: var(--head-color);
	}
	.pageView{
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
		.card-but{
			display: flex;
			justify-content: flex-end;
			.card-but-item{
				width: 200rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				color: var(--primary-color);
				border: 1rpx solid var(--primary-color);
				border-radius: 40rpx;
				font-size: 24rpx;
			}
		}
		
	}
</style>