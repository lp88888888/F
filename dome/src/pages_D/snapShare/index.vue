<template>
	<view class="container" :data-theme="pageTheme" >
		<!-- 顶部图片 -->
		<view>
			<image class="top-image" :src="imgUrl+'bj-top.png'" mode="widthFix"></image>
			<image class="top-fanhui" @click="toBack" :src="imgUrl+'prev.png'" mode="widthFix"></image>
		</view>

		<!-- 中间内容区 -->
		<view class="content">
			<!-- 标题与按钮 -->
			<!-- 	<view class="title-box">
				<text class="title">路政养护随手拍</text>
				<button class="report-btn" @click="onReportClick">立即上报</button>
			</view> -->

			<!-- 提示框 -->
			<view class="tips-box">
				<image class="icon" :src="imgUrl+'hual-icon.png'" mode="aspectFit"></image>
				<text class="tip-text">上报路政养护信息，可获得积分奖励</text>
			</view>

			<!-- 使用说明 -->
			<view class="usage-info">
				<!-- <text class="info-title">使用说明</text><br /> -->
				<rich-text :nodes="textpup" />
				<!-- <text class="info-item" >{{textpup}}</text> -->
			</view>


		</view>
		<!-- 功能按钮组 -->
		<view class="btn-group">
			<view class="record-btn" @click="onRecordClick">
				<view class="att-bot">
					<text class="text-1">上报记录</text>
					<text class="text-2">一键查看上报详情</text>
				</view>
				<image class="rigth-icon" :src="imgUrl+'lanse-icon.png'" mode="widthFix"></image>
			</view>
			<view class="points-btn" @click="toNav('/pages_A/pointslist/index')">
				<view class="att-bot">
					<text class="text-1">积分获得</text>
					<text class="text-2">查看获得积分情况</text>
				</view>
				<image class="rigth-icon" :src="imgUrl+'hongse-icon.png'" mode="widthFix"></image>
			</view>
		</view>
		<!-- 底部图片 -->
		<image class="bottom-image" :src="imgUrl+'jf-brn-img.png'" mode="widthFix"></image>

		<!-- 底部大按钮 -->
		<view class="submit-btn" @click="onSubmitClick">立即上报</view>
		<PageDurationTracker pageName="随手拍" />
	</view>
</template>

<script setup lang="ts">
	import {
		ref,
		onMounted,
		computed
	} from 'vue';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import { toNav, toBack } from '@/utils/route';
	import { getrichTextPopup } from '@/api/snapShare';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { showLoading, hideLoading, showToast, ID2 } from '@/utils/util';
	import { imgUrl } from '../../config';
	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	import { getDrivingRoute, LatLng } from '@/utils/polyline';
	import theme from '@/utils/theme';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const navBarHeight = ref(0);
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	const backgroundColor = ref<string>("#FFFFFF");
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const textpup = ref('')
	const gettext = async () => {
		const res = await getrichTextPopup({ popupType: '随手拍使用说明' })
		textpup.value = res.rows[0].content
	}
	onMounted(() => {
		gettext()
	});
	const onRecordClick = () => {
		uni.navigateTo({
			url: '/pages_D/snapShare/record'
		})
	}
	const onSubmitClick = () => {
		uni.navigateTo({
			url: '/pages_D/snapShare/form'
		})
	}
</script>

<style scoped lang="scss">
	.top-fanhui {
		position: absolute;
		top: 90rpx;
		left: 30rpx;
		width: 22rpx;
		height: 32rpx;
	}

	.att-bot {
		display: flex;
		flex-direction: column;
		align-content: flex-start;
	}

	.rigth-icon {
		width: 32rpx;
		height: 32rpx;
	}

	.text-1 {
		font-weight: 700;
		font-size: 32rpx;

	}

	.text-2 {
		font-weight: 400;
		font-size: 24rpx;
	}

	/* 基础布局 */
	.container {
		position: relative;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	/* 顶部图片 */
	.top-image {
		width: 100%;
		height: 506rpx;
		/* 根据实际图片调整 */

		overflow: hidden;
	}

	/* 内容区 */
	.content {
		margin: 30rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.05);
		z-index: 999;
		position: relative;
		top: -70rpx;
	}

	.title-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
	}

	.report-btn {
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
		padding: 0;
		margin: 0;
		line-height: 1;
		text-decoration: underline;
	}

	.tips-box {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #ffeaea;
		border-radius: 16rpx;
		margin-bottom: 30rpx;
		position: relative;
		justify-content: center;
		border-radius: 200rpx 200rpx 200rpx 200rpx;
	}

	.icon {
		width: 92rpx;
		height: 92rpx;
		margin-right: 10rpx;
		position: absolute;
		top: -10rpx;
		left: 10rpx;

	}

	.tip-text {
		font-size: 28rpx;
		color: #d43c3c;
	}

	.usage-info {
		margin-bottom: 30rpx;
		padding: 30rpx;
		background: #F8F9FB;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		height: 190rpx;
		overflow: hidden;
		overflow-y: scroll;
	}

	.info-title {
		font-weight: 400;
		font-size: 28rpx;
		color: #666666;
	}

	.info-item {
		font-weight: 400;
		font-size: 28rpx;
		color: #666666;
		line-height: 40rpx;
	}

	.btn-group {
		margin: 30rpx;
		display: flex;
		gap: 30rpx;
		position: relative;
		top: -70rpx;
	}

	.points-btn {
		width: 330rpx;
		height: 130rpx;
		border: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(138deg, #FFEFDF 0%, #FFFFFF 100%);
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		color: #FFA500;
		padding: 30rpx 40rpx;
		box-sizing: border-box;
	}

	.record-btn {
		width: 330rpx;
		height: 130rpx;
		border: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(134deg, #E3EDFF 0%, #FFFFFF 100%);
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		color: #4788FA;
		padding: 30rpx 40rpx;
		box-sizing: border-box;
	}

	/* 底部图片 */
	.bottom-image {
		width: 690rpx;
		height: 240rpx;
		margin: 30rpx;
		border-radius: 16rpx;
		overflow: hidden;
		position: relative;
		top: -70rpx;
	}

	/* 底部按钮 */
	.submit-btn {
		width: 600rpx;
		height: 80rpx;
		margin-left: 75rpx;
		font-size: 32rpx;
		color: #fff;
		background-color: var(--primary-color);
		border-radius: 40rpx;
		line-height: 80rpx;
		text-align: center;
		border: none;
		position: relative;
		top: -70rpx;
	}
</style>