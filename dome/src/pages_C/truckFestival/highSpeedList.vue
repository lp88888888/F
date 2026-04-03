<template>
	<view class="container" :data-theme="pageTheme">
		<up-navbar title="高速社群" bgColor="transparent" @leftClick="toBack"  :placeholder="true" :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="card-body">
			<view class="list-item" v-for="(item,index) in tionList" :key="index" >
				<view class="item-icon ">
					<image class="item-icon-img" :src="item.pic" mode=""></image>
				</view>
				<view class="item-info">
					<view class="item-name">{{item.title}}</view>
					<view class="item-desc">{{item.userNum}}+用户</view>
				</view>
				<button class="btn-subscribe" @click="openqr(item)" >订阅</button>
			</view>
		
		</view>
		
		<up-popup mode="center" bgColor="transparent" :safeAreaInsetBottom="false" :show="show" @close="close">
			<view style="width: 600rpx;">
				<view class="modal-container">
					<view class="list2-item">
						<view class="item-icon ">
							<image class="item-icon-img" :src="qrobj.pic" mode=""></image>
							<!-- <text class="orange-bg">卡友</text> -->
						</view>
						<view class="item-info">
							<view class="item-name">{{qrobj.title}}</view>
							<view class="item-desc">{{qrobj.userNum}}+用户</view>
						</view>
					</view>
					<view class="fl-ce-ce" style="width: 100%;">
						<image class="modal-img" :src="qrobj.qrCode" mode=""></image>
					</view>
				  
				  <view class="footer-btns">
				    <button class="btn-submit" @click="handleSubmit">保存到相册</button>
				  </view>
				  <view class="modal-text" style="margin-top: 20rpx;">用微信扫一扫，扫码进入社群</view>
				</view>
				<view class="close-wrapper" @click="close">
					<image class="close-wrapper-img" :src="imgUrl+'static/C-truck/close-icon.png'" mode=""></image>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { toNav,toBack } from '@/utils/route';
	import { getCurrentTruckFestival, getassociationList } from '@/api/truck';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const show = ref(false)
	const close = ()=>{
		show.value = false
	}
	const tionList = ref([])
	const getiationList = async () => {
		try {
			const res = await getassociationList(
				campaignId.value
			)
			tionList.value = res.data
			console.log(tionList.value, 'tionList.value')
		} catch (err) {
		}
	}
	const qrobj = ref({})
	const openqr = async (obj) => {
		try {
			qrobj.value = obj
			show.value = true
		} catch (err) {
		}
	}
	
	const handleSubmit = () => {
	  close()
	};
	const campaignId=ref('')
	onLoad((options) => {
		campaignId.value=options.id
		getiationList()
	})
</script>

<style lang="scss" scoped>
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
	
	.modal-img{
		margin: 20rpx auto;
		width: 260rpx;
		height: 260rpx;
	}
	/* 底部按钮 */
	.footer-btns {
	  display: flex;
	  justify-content: space-between;
	  gap: 30rpx;
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
	
	.container {
	  min-height: 100vh;
	  background: linear-gradient(180deg, #CAECD0 0%, #F5F8F5 25%);
	}
	.card-body{
		padding:30rpx;
		box-sizing: border-box;
	}
	/* 列表条目样式 */
	.list-item {
		display: flex;
		align-items: center;
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
		border: 1px solid #f0f0f0;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.04);
		&:last-child {
			margin-bottom: 0;
		}
	}
	.list2-item{
		display: flex;
		align-items: center;
		// padding: 24rpx;
	}
	.item-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		margin-right: 24rpx;
		background-size: 80rpx 80rpx;
		position: relative;
		.item-icon-img{
			width: 80rpx;
			height: 80rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}
	}
	.blue-bg {
		position: relative;
		z-index: 1;
		color: #2D93FF;
	}
	
	.orange-bg {
		position: relative;
		z-index: 1;
		color: #e67e22;
	}
	.green-bg{
		position: relative;
		z-index: 1;
		color: #628F2F;
	}
	.item-info {
		flex: 1;
	
		.item-name {
			font-size: 15px;
			font-weight: 500;
			color: #333;
			margin-bottom: 4px;
		}
	
		.item-desc {
			font-size: 12px;
			color: #999;
		}
	}
	.btn-subscribe {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #628F2F;
		color: #fff;
		font-size: 28rpx;
		border-radius: 30rpx;
		padding: 0;
		margin: 0;
		border: none;
	}
</style>