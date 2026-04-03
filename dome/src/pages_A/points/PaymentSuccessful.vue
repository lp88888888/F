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
				<image :src="imgUrl + 'bj-success-icon.png'" mode="aspectFill" class="gift-bg"></image>

				<view class="card-content">
					<text class="card-title">出发！带上我的心意，一起解锁美好旅途✨</text>
					<text class="phone-number">{{maskPhone(phone)}}，送你一份礼物</text>

					<view class="product-box">
						<image :src="pointsDetail.productSpuDetailRespVO.picUrl" mode="aspectFit" class="product-img">
						</image>
						<text class="product-name">{{ pointsDetail.productSpuDetailRespVO.name }}</text>
					</view>
				</view>
			</view>

			<!-- 后续步骤 -->
			<view class="steps">
				<text class="steps-title">后续步骤</text>
				<view class="step-list">
					<view class="step-item">
						<image :src="imgUrl + 'icon-send.png'" mode="aspectFill" class="step-icon"></image>
						<text class="step-text">送给朋友</text>
					</view>
					<view class="step-arrow">→</view>
					<view class="step-item">
						<image :src="imgUrl + 'icon-receive.png'" mode="aspectFill" class="step-icon"></image>
						<text class="step-text">朋友收下</text>
					</view>
					<view class="step-arrow">→</view>
					<view class="step-item">
						<image :src="imgUrl + 'icon-use.png'" mode="aspectFill" class="step-icon"></image>
						<text class="step-text">朋友使用</text>
					</view>
				</view>
			</view>

			<!-- 底部按钮 -->
			<view class="footer">
				<view class="order-btn" @click="toOrder">查看订单</view>
				<view class="share-btn" @click="shearOpen">
					<image :src="imgUrl + 'waite-share.png'" mode="aspectFill" class="btn-icon"></image>
					送给朋友
				</view>
			</view>
		</view>
	</view>
	<Share ref="shearRef" pageType="zs" v-if='isshare' :itemObj='pointsDetail'></Share>
</template>

<script setup lang="ts">
	import { ref, reactive, computed, onMounted } from 'vue'
	import { onLoad, onShow, onShareAppMessage } from '@dcloudio/uni-app'
	// onShareTimeline,
	import { toBack, toRec } from '@/utils/route'
	import { imageUrl } from '@/config'
	import Share from '@/components/Share/indexzs';
	import { detailActivityPoints } from '@/api/points';
	import { useTheme } from '@/composables/useTheme'
	import { imgUrl } from '../../config';
	const { themeStore, pageTheme } = useTheme()
	const imageUrl = ref(themeStore.imgUrl)
	const shearRef = ref(null);
	// 数据
	const giftImage = '/static/images/gift-bg.png' // 礼物背景图
	const productImage = '/static/images/product.jpg' // 商品图
	// 分享好友
	onShareAppMessage((res) => {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		console.log('-0- 走这了-00-0-/pages/home/home');
		return {
			title: '爱上高速',
			path: 'pages/home/home',
		};
	});
	// onShareTimeline((res) => {
	// 	console.log("分享操作朋友圈", res)
	// 	if (res.from === 'button') {// 来自页面内分享按钮
	// 		console.log(res.target)
	// 	}
	// 	return {
	// 		title: '爱上高速',
	// 		query: `from=timeline`,
	// 		// path: '/pages_A/points/details?id=' + detailId.value,
	// 		// path: 'pages/home/home',
	// 	};
	// });
	// 页面逻辑
	onMounted(() => {
		console.log('支付成功页加载完成')
	})
	const isshare = ref(false)
	const detailId = ref('')
	onShow(() => {
		// 可在此刷新数据
	})
	const phone = ref('');
	onLoad((e) => {
		// 1. 检查是否是从朋友圈进入
		if (e.from === 'timeline') {
			uni.reLaunch({
				url: '/pages/home/home'
			});
			return; // 终止后续代码执行，避免闪现页面内容
		}
		phone.value = e.phone;
		detailId.value = e.id;
		getDetail(e.id);
	});
	const maskPhone = (raw) => {
		if (!raw) return ''
		const clean = String(raw).replace(/\D/g, '')
		if (clean.length === 11 && /^1[3-9]/.test(clean)) {
			return clean.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
		}
		return raw // 或 return '***'
	}
	const pointsDetail = ref({})
	const detailsPoint = ref(null)
	const getDetail = async (id : string) => {
		const res : any = await detailActivityPoints(id);
		console.log('查询的商品数据', res);
		if (res.code == 200) {

			if (res.data.returnActivityType == 3 || res.data.returnActivityType == 4) {
				detailsPoint.value = res.data.activityPoint;
			} else {
				detailsPoint.value = res.data.point;
			}
			pointsDetail.value = res.data;
			pointsDetail.value.phone = maskPhone(phone)
		} else {
			toast(res.msg);
		}
	};
	const shearOpen = () => {
		isshare.value = true
		shearRef.value.open()
	}
	// 跳转方法
	const toOrder = () => {
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
		background: linear-gradient(180deg, #FFFFFF 0%, #FFEFB9 51.4%, rgba(216, 216, 216, 0) 100%);
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
		width: 563rpx;
		height: 728rpx;
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;
		margin: 0 auto 80rpx;
	}

	.gift-bg {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.card-content {
		padding: 40rpx;
		color: #333;
		text-align: center;

	}

	.card-title {
		display: inline-block;
		width: 260rpx;
		height: 72rpx;
		font-weight: 400;
		font-size: 26rpx;
		color: #A1591F;
		top: 250rpx;
		left: 210rpx;
		position: absolute;
	}

	.phone-number {
		display: inline-block;
		font-weight: 700;
		font-size: 30rpx;
		top: 350rpx;
		left: 70rpx;
		position: absolute;
		color: #A1591F;
	}

	.product-box {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		top: 400rpx;
		left: -10rpx;
		position: absolute;
		margin-top: 20rpx;
		z-index: 999;
	}

	.product-img {
		width: 200rpx;
		height: 200rpx;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		margin-bottom: 12rpx;
	}

	.product-name {
		font-weight: 400;
		font-size: 24rpx;
		color: #4D2402;
	}

	.steps {
		margin: 60rpx 0;
		text-align: center;
	}

	.steps-title {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 30rpx;
	}

	.step-list {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 40rpx;
		margin-top: 32rpx;
	}

	.step-item {
		display: flex;
		align-items: center;
	}

	.step-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 18rpx;
	}

	.step-text {
		font-size: 24rpx;
		color: #666;
	}

	.step-arrow {
		font-size: 32rpx;
		color: #ccc;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		box-shadow: 0rpx -5rpx 8rpx 0rpx rgba(0, 0, 0, 0.1);
		height: 166rpx;
		background: #FFFFFF;
		padding: 0 25rpx;
		box-sizing: border-box;

	}

	.order-btn {
		width: 200rpx;
		height: 84rpx;
		background-color: transparent;
		color: #333;
		border-radius: 12rpx;
		font-size: 28rpx;
		line-height: 80rpx;
	}

	.share-btn {
		width: 500rpx;
		height: 84rpx;
		background: var(--but-color-line);
		color: white;
		border-radius: 12rpx;
		font-size: 32rpx;
		line-height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 12rpx;
	}
</style>