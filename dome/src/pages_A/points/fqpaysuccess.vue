<!-- pages/pay-success/PaySuccessPage.vue -->
<template>
	<view class="container" :data-theme="pageTheme">
		<!-- 顶部导航栏 -->
		<up-sticky z-index="8888">
			<up-navbar title="支付成功" bgColor="transparent" @leftClick="toBack" leftIconColor="#000000" placeholder
				:fixed="false" :titleStyle="{ fontWeight: 'bold' }"></up-navbar>
		</up-sticky>

		<!-- 主体内容 -->
		<view class="content">
			<!-- 成功图标 -->
			<view class='content-h'>
				<image :src="imgUrl + 'pj-success-icon.png'" mode="aspectFill" class="success-icon"></image>
				<text class="success-text">支付成功</text>
			</view>


			<!-- 礼物卡片 -->
			<view class="gift-card">
				<view class="hender-box" :style="bgStyle1">
					消费返优惠券
				</view>
				<view class="sccess-text">
					恭喜！获得1张<text>优惠券</text>
				</view>
				<view class="item-con is-disabled" :style="bgStyle">
					<view class="item-line">
						<text class="item-type">{{couponName}}</text>
					</view>
					<view class="item-line">
						<text class="fs-24 col6 fw-400">有效期限:{{ couponEndTime }}</text>
						<!-- <view class="item-btn">核销码</view> -->
					</view>
				</view>
				<view class="look-but" @click="tolook">
					去查看
				</view>
			</view>
			<view class="footer">
				<view class="share-btn" @click="toShare">
					查看订单</view>
				<view class="order-btn" @click="toOrder">返回首页</view>

			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, computed, onMounted } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { toBack, toRec } from '@/utils/route'
	import { imageUrl } from '@/config'
	import { useTheme } from '@/composables/useTheme'
	import { imgUrl } from '../../config';
	const { themeStore, pageTheme } = useTheme()
	const imageUrl = ref(themeStore.imgUrl)
	const backgroundImage = ref(imgUrl + 'fanquan-yhq.png')
	const bgStyle = computed(() => {
		if (!backgroundImage.value) return {}
		return {
			backgroundImage: `url(${backgroundImage.value})`,
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat'
		}
	})
	const backgroundImage1 = ref(imgUrl + 'redquanquan-bj.png')
	const bgStyle1 = computed(() => {
		if (!backgroundImage1.value) return {}
		return {
			backgroundImage: `url(${backgroundImage1.value})`,
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat'
		}
	})
	const couponName = ref('优惠券')
	const couponEndTime = ref('')
	onLoad((option) => {
		couponName.value = option.name
		couponEndTime.value = option.time

	})
	// 数据
	const giftImage = '/static/images/gift-bg.png' // 礼物背景图
	const productImage = '/static/images/product.jpg' // 商品图

	// 页面逻辑
	onMounted(() => {
		console.log('支付成功页加载完成')
	})

	onShow(() => {
		// 可在此刷新数据
	})
	const tolook = () => {
		uni.redirectTo({
			url: '/pages_C/coupon/index'
		})
	}
	// 跳转方法
	const toOrder = () => {
		uni.redirectTo({
			url: '/pages/home/home?type=points'
		})
	}

	const toShare = () => {
		uni.redirectTo({
			url: '/pages_A/order/index',
		});
	}
</script>

<style scoped lang="scss">
	.content-h {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.container {
		height: 100vh;
		background: var(--head-color);
		padding: 0;
	}

	.content {
		padding: 100rpx 32rpx 0;
		text-align: center;
	}

	.success-icon {
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 24rpx;
	}

	.success-text {
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 60rpx;
	}

	.gift-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;
		background: #FFFFFF;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.3);
	}

	.hender-box {
		width: 358rpx;
		height: 62rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 30rpx;
		color: #FFFFFF;
	}

	.item-con {
		background: #fff;
		border-radius: 16rpx;
		padding: 40rpx 40rpx 28rpx 58rpx;
		margin-bottom: 20rpx;
		box-sizing: border-box;
		width: 601rpx;
		height: 165rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.sccess-text {
		font-weight: 600;
		font-size: 45rpx;
		color: #1D2129;
		line-height: 68rpx;
		margin-bottom: 33rpx;
		margin-top: 30rpx;

		text {
			color: #EF1233;
		}
	}

	.look-but {
		width: 274rpx;
		height: 78rpx;
		background: #FFE4E4;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		line-height: 78rpx;
		text-align: center;
		font-size: 32rpx;
		color: #F6193B;
		margin-top: 32rpx;
		margin-bottom: 37rpx;
	}

	.item-line {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		color: #333;
		margin-bottom: 12rpx;
	}

	.item-title {
		font-weight: 700;
		font-size: 32rpx;
		color: #FF2749;
	}

	.item-type {
		font-weight: 700;
		font-size: 32rpx;
	}

	.item-btn {
		width: 134rpx;
		height: 38rpx;
		line-height: 38rpx;
		background: linear-gradient(170deg, #FFEDDB 0%, #FFE1B9 100%);
		border-radius: 156rpx 156rpx 156rpx 156rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #EA072B;
		text-align: center;
	}



	.footer {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		padding: 0 25rpx;
		box-sizing: border-box;

	}

	.order-btn {
		width: 621rpx;
		height: 96rpx;
		background-color: #fff;
		color: #628F2F;
		border-radius: 48rpx;
		font-size: 28rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2rpx solid #628F2F;
	}

	.share-btn {
		margin-top: 60rpx;
		margin-bottom: 30rpx;
		width: 621rpx;
		height: 96rpx;
		background: var(--but-color-line);
		color: white;
		border-radius: 48rpx;
		font-size: 32rpx;
		line-height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>