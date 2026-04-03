<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-navbar title="订单记录" @leftClick="toBack" :placeholder="true" :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		
		<up-sticky bgColor="#FFFFFF">
			<view style="padding: 20rpx 30rpx;box-sizing: border-box;">
				<up-search placeholder="请输入要查询的完整车牌号" v-model="searchTex"></up-search>
				  <view class="filterCon rowCon" style="margin-top: 20rpx;">
				    <text class="tex28_66">当前一共<text style="color: #ffb955;">{{orderList.length}}</text>笔订单</text>
					<uni-datetime-picker v-model="range" type="daterange" @change="maskChange" />
				    <!-- <view class="rowCon" @click="showDate">
				      <image class="icRili" :src="imgUrl+'static/scanPay_rili.png'" mode="" />
				      <view :class="[sel_list.start_time?'tex24_33_b':'tex24_66']">{{sel_list.start_time?sel_list.start_time:'开始时间'}}</view>
				      <text class="tex28_66">~</text>
				      <view :class="[sel_list.end_time?'tex24_33_b':'tex24_66']">{{sel_list.end_time?sel_list.end_time:'结束时间'}}</view>
				    </view> -->
				  </view>
			</view>
		</up-sticky>
		<view class="listCon">
		  <view class="whiteBg" v-for="(item,index) in orderList" :key="index">
		    <view class="rowCon">
		      <text class="tex28_66 cellLeft">缴费车牌号</text>
		      <text class="tex28_33_b" style="flex: 1;">{{item.vehicleNumber}}</text>
		      <text v-if="item.tradeState=='05'||item.tradeState=='02'||item.tradeState=='07'||item.tradeState=='01'" class="tex28_red_b">{{item.tradeStateStr}}</text>
		      <text v-if="item.tradeState=='03'||item.tradeState=='06'" class="tex28_66_b">{{item.tradeStateStr}}</text>
		      <!-- <text v-if="item.tradeState!='03'&&item.tradeState!='02'&&item.tradeState!='05'&&item.tradeState!='06' && item.tradeState!='07'" class=" tex28_33_b">{{item.tradeStateStr}}</text> -->
		    </view>
		    <view class="baseLine" style="margin: 20rpx 0;"></view>
		    <view class="rowCon">
		      <text class="tex28_66 cellLeft">支付金额</text>
		      <text class="tex28_33">{{item.totalAmountYuan}}元</text>
		    </view>
		    <view class="rowCon" style="margin-top: 20rpx;">
		      <text class="tex28_66 cellLeft">出站口</text>
		      <text class="tex28_33">{{item.payStationName}}</text>
		    </view>
		    <view class="rowCon" style="margin-top: 20rpx;">
		      <text class="tex28_66 cellLeft">下单时间</text>
		      <text class="tex28_33">{{item.createTimeStr}}</text>
		    </view>
		    <view class="rowCon" style="margin-top: 20rpx;">
		      <view style="flex: 1;"></view>
		      <view class="btn" @click="toDetail" >查看详情</view>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	
	const searchTex = ref('')
	const sel_list = ref({
		start_time:'',
		end_time:'',
	})
	const range = ref([])
	const orderList = ref([
		{
			vehicleNumber:'陕A89063',
			tradeState:'01',
			tradeStateStr:'未支付',
			totalAmountYuan:'30',
			payStationName:'出站口出站口出站口出站口出站口',
			createTimeStr:'242-7873-78',
		},
		{
			vehicleNumber:'陕A89063',
			tradeState:'01',
			tradeStateStr:'未支付',
			totalAmountYuan:'30',
			payStationName:'出站口出站口出站口出站口出站口',
			createTimeStr:'242-7873-78',
		}
	]);
	const maskChange = (e)=>{
		console.log(e);
	}
	const showDate = ()=>{
		
	}
	const toDetail = ()=>{
		toNav('./orderDetail')
	}
	
</script>

<style lang="scss" scoped>
	.pageView{
		background: #EEEEEE;
		width: 100%;
		min-height: 100vh;
	}
	.listCon{
		// margin-top: 400rpx;
		padding-bottom: 50rpx;
	}
	.tex28_66{
		font-size: 28rpx;
		color: #666666;
	}
	.tex28_33{
		font-size: 28rpx;
		color: #333333;
	}
	.tex28_66_b{
		font-size: 28rpx;
		color: #666666;
		font-weight: bold;
	}
	.tex28_33_b{
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}
	.tex24_33_b{
		font-size: 24rpx;
		color: #333333;
		font-weight: bold;
	}
	.tex24_66{
		font-size: 24rpx;
		color: #666666;
	}
	.rowCon{
		display: flex;
		align-items: center;
	}
	.tex28_red_b{
		font-size: 28rpx;
		color: red;
		font-weight: bold;
	}
	.whiteBg{
		width: 702rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		margin-left: 24rpx;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
	}
	.baseLine{
		width: 100%;
		height: 1rpx;
		background: #EEEEEE;
	}
	.cellLeft{
		width: 220rpx;
	}
	.icRili{
		width: 34rpx;
		height: 34rpx;
		margin-right: 6rpx;
	}
	.btn{
		width: 160rpx;
		height: 50rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		border: solid 2rpx #ed933a;
		font-size: 28rpx;
		color: #ed933a;
		text-align: center;
		line-height: 50rpx;
	}
</style>