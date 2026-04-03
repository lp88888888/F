<template>
	<view :data-theme="pageTheme">
		<up-navbar title=" " bgColor="transparent" @leftClick="toBack"  :placeholder="false" :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="pageView" >
			<image class="bgImg" :src="imgUrl+'static/scanPay_bg.png'" mode=""></image>
			<view class="bg">
				<view class="con">
					<view class="scanFun1 centerCon" @click="toScan">
						<image class="funImg" :src="imgUrl+'static/scanPay_scan.png'"/>
						<view class="colCon">
							<text class="tex30_33" style="font-weight: bold;">扫码支付</text>
							<text class="tex28_33" style="margin-top: 10rpx;">缴费快人一步</text>
						</view>
					</view>
					<view class="scanFun2 centerCon" @click="toNav('./orderList')">
						<image class="funImg" :src="imgUrl+'static/scanPay_order.png'"/>
						<view class="colCon">
							<text class="tex30_33" style="font-weight: bold;">订单管理</text>
							<text class="tex28_33" style="margin-top: 10rpx;">查询历史记录</text>
						</view>
					</view>
				</view>
			
				<view class="whiteBg">
					<view class="rowCon fl-al-ce">
						<view class="colLine"></view>
						<text class="tex32_33_b" style="margin-left: 20rpx;">操作指引</text>
					</view>
					<view class="baseLine" style="margin-top: 30rpx;"></view>
					<view class="introCell">
						<view class="sortBg centerCon">1</view>
						<view class="texDesCon">
							<text class="tex28_33_b">扫一扫</text>
							<text class="tex24_66" style="margin-top: 10rpx;">用户点击“扫码支付”，打开扫一扫对二维码进行扫码。</text>
						</view>
					</view>
					<view class="introCell">
						<view class="sortBg centerCon">2</view>
						<view class="texDesCon">
							<text class="tex28_33_b">选择车辆</text>
							<text class="tex24_66" style="margin-top: 10rpx;">扫码成功后，在缴费页面选择车辆与车牌颜色，确认后点击“缴费”。</text>
						</view>
					</view>
					<view class="introCell">
						<view class="sortBg centerCon">3</view>
						<view class="texDesCon">
							<text class="tex28_33_b">去支付</text>
							<text class="tex24_66" style="margin-top: 10rpx;">在支付界面核对缴费信息，核对无误后点击“去支付”，完成订单支付。</text>
						</view>
					</view>
					<view class="introCell">
						<view class="sortBg centerCon">4</view>
						<view class="texDesCon">
							<text class="tex28_33_b">交卡通行</text>
							<text class="tex24_66" style="margin-top: 10rpx;">请将CPC卡交给收费亭，如果需要发票，请告知工作人员。</text>
						</view>
					</view>
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
import { toast } from '@/utils/common';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const toScan=()=> {
	    //TODO 扫一扫获取二维码数据
	    // 只允许从相机扫码
	    uni.scanCode({
	      onlyFromCamera: true,
	      success(res) {
	        if (res.path.indexOf('pages/scanQrPay/index') > -1) {
	          let scene = decodeURIComponent(res.path.split('?')[1].split('=')[1])
	          let splitData = scene.split('-')[1].split('&')
	          let stationInfo = {}
	          stationInfo['company'] = splitData[0]
	          stationInfo['station'] = splitData[1]
	          stationInfo['toll'] = splitData[2]
	          uni.setStorageSync('stationInfo', stationInfo)
	          wx.navigateTo({
	            url: '../index',
	          })
	        } else {
	          toast('本功能只支持扫描爱上高速 · 扫码付二维码')
	        }
	      },
	      fail() {
	        toast('扫码失败')
	      }
	    })
	  }
</script>

<style lang="scss" scoped>
	.pageView{
		background: #f6f6f6;
		position: relative;
		min-height: 100vh;
	}
	.bgImg{
		width: 750rpx;
		height: 685rpx;
	}
	.tex30_33{
		font-size: 30rpx;
		color: #333333;
	}
	.tex28_33{
		font-size: 28rpx;
		color: #333333;
	}
	.tex32_33_b{
		font-size: 32rpx;
		color: #333333;
		font-weight: bold;
	}
	.tex28_33_b{
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}
	.tex24_66{
		font-size: 24rpx;
		color: #666666;
	}
	.bg{
		width: 750rpx;
		background-color: #f6f6f6;
		border-radius: 20rpx 20rpx 0rpx 0rpx;
		margin-top: -20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		z-index: 1;
	}
	.baseLine{
		width: 100%;
		height: 1rpx;
		background: #EEEEEE;
	}
	.con{
		width: 700rpx;
		height: 252rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		margin-top: -24rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}
	
	.scanFun1{
		width: 325rpx;
		height: 171rpx;
		background: url('https://tranalioss.shanyitong.com/wximage/trip-pro/scanPay/scanPay_funBg1.png');
		background-size: 325rpx 171rpx;
		background-repeat: no-repeat;
	}
	
	.centerCon{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	
	
	.scanFun2{
		width: 325rpx;
		height: 171rpx;
		background: url('https://tranalioss.shanyitong.com/wximage/trip-pro/scanPay/scanPay_funBg2.png');
		background-size: 325rpx 171rpx;
		background-repeat: no-repeat;
		margin-left: 12rpx;
	}
	
	.funImg{
		width: 82rpx;
		height: 82rpx;
		margin-right: 20rpx;
	}
	.colCon{
		display: flex;
		flex-direction: column;
	}
	
	.whiteBg{
		width: 700rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		margin-top: 10rpx;
	}
	
	.colLine{
		width: 10rpx;
		height: 34rpx;
		background-color: #ffb955;
	}
	
	.introCell{
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding: 30rpx 0 0;
		box-sizing: border-box;
	}
	
	.sortBg{
		width: 40rpx;
		height: 40rpx;
		background: url('https://tranalioss.shanyitong.com/wximage/trip-pro/scanPay/scanPay_sortBg.png');
		background-size: 40rpx 40rpx;
		background-repeat: no-repeat;
		font-size: 28rpx;
		font-weight: bold;
		font-stretch: normal;
		letter-spacing: 0rpx;
		color: #ffc286;
		margin-right: 20rpx;
	}
	
	.texDesCon{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	
</style>