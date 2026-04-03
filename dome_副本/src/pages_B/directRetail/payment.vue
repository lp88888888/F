<template>
	<view class="pageView">
		<cos-header title='支付订单' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="80"></cos-header>
			
		<view class="lisBox" :style="{ paddingTop: navBarHeight + 'px' }">
			<view class="order-card">
				<view>支付剩余时间  14:30</view>
				<view class="price col3">
					<text class="fs-28">¥</text>136.00
				</view>
				<view>朋乐乐购｜3940573929223</view>
			</view>
			
			<view class="pay-method flex just-sb ali-cen">
				<view class="flex ali-cen">
					<image class="pay-img" :src="imgUrl+'static/pay-wechat.png'" mode=""></image>
					<text class="fs-32 col3">微信支付</text>
				</view>
				<image v-if="ischenck==1" @click="ischenck=2" class="check-img" :src="imgUrl+'static/cart-check.png'" mode=""></image>
				<image v-if="ischenck==2" @click="ischenck=1" class="check-img" :src="imgUrl+'static/cart-checked.png'" mode=""></image>
			</view>
			
			<view class="pay-btn m-t-400" @click="onsubmit">
				确定支付
			</view>
			
			<!-- 支付弹窗 -->
			<up-popup :show="show" @close="close" @open="open">
				<view class="popup-continer">
					<view class="close-icon" @click="close">
						<up-icon name="close" color="#333333" size="22"></up-icon>
					</view>
					<image class="pay-success-img" :src="imgUrl+'static/pay-success.png'" mode=""></image>
					<view class="fs-40 col3 fw-500 tc">支付成功¥136.00</view>
					<view class="pay-btn m-t-96" @click="close">完成</view>
				</view>
			</up-popup>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref, computed, onMounted} from 'vue';
	import CosHeader from '@/components/customNavBar/index.vue';
	import {imgUrl} from '@/config';

	// 布局
	const backgroundColor = ref<string>('#FEEDD4');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref<number>(0);
	
	const ischenck = ref(1)
	const show = ref(false);
	const open = () => {
		show.value = true;
	};
	const close = () => {
		show.value = false;
	};
	const onsubmit = () => {
		open()
	}
	
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
	});
</script>

<style lang="scss" scoped>
	.pageView{
		min-height: 100vh;
		background: linear-gradient( 180deg, rgba(255,150,0,0.18) 0%, rgba(216,216,216,0) 80%);
	}
	
	.order-card {
		width: 100%;
		margin: 120rpx auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		font-weight: 400;
		color: #666666;
		line-height: 60rpx;
		
		.price {
			font-weight: 600;
			font-size: 50rpx;
		}
	}
	
	.pay-method {
		width: 686rpx;
		height: 120rpx;
		background: #FFFFFF; 
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 0 auto;
		padding: 30rpx 24rpx;
		box-sizing: border-box;
		
		.pay-img {
			width: 56rpx;
			height: 56rpx;
			margin-right: 20rpx;
		}
		
		.check-img {
			width: 36rpx;
			height: 36rpx;
		}
	}
	
	.pay-btn {
		width: 610rpx;
		height: 96rpx;
		background: linear-gradient( 180deg, #FFA836 0%, #FF9000 100%);
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		font-weight: 700;
		font-size: 32rpx;
		color: #FFFFFF;
		margin: 0 auto;
		text-align: center;
		line-height: 96rpx;
		font-weight: 700;
		font-size: 32rpx;
		color: #FFFFFF;
	}
	
	.m-t-400 {
		margin: 400rpx auto 0;
	}
	
	.m-t-96 {
		margin-top: 96rpx;
	}
	
	.popup-continer {
		position: relative;
		padding: 74rpx 50rpx;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;	
		
		.close-icon {
			position: absolute;
			right: 50rpx;
			top: 50rpx;
		}
	}
	
	.pay-success-img {
		width: 102rpx;
		height: 102rpx;
		margin-bottom: 26rpx;
	}
</style>