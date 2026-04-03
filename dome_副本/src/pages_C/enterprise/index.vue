<template>
	<view class="container" :data-theme="pageTheme" >
		<!-- 背景图 -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="tab-con">
				<up-navbar title="" bgColor="transparent" @leftClick="toBack" placeholder
					:fixed="false"></up-navbar>
			</view>
		</u-sticky>
		<image class="bg-image" :src="imgUrl+'qiye-bj.png'" mode="cover"></image>
		<view class="btn-group">
			<!-- 加入企业 -->
			<view class="btn-item"  @click="openPopup">
				<view style="display: flex;flex-direction: column;">
					<text class="btn-title">加入企业</text>
					<text class="btn-desc">成为企业一员</text>
				</view>
				<navigator url="/pages/join-company/index" class="btn-arrow">
					<text class="arrow-icon">→</text>
				</navigator>
			</view>
			<!-- 成为企业管理员 -->
			<view class="btn-item" @click="toNav('/pages_C/enterprise/joinEnteprise?type='+'submit')">
				<view style="display: flex;flex-direction: column;">
					<text class="btn-title">企业入驻</text>
					<text class="btn-desc">成为企业管理员</text>
				</view>
				<navigator url="/pages/become-admin/index" class="btn-arrow">
					<text class="arrow-icon">→</text>
				</navigator>
			</view>
		</view>
		<BindCompanyPopup v-model:show="showPopup" @close="onClose" />
	</view>
</template>

<script lang="ts" setup>
	import { ref, onMounted } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { getservicePoint } from '@/api/index';
	import { openAPPLocation } from '@/utils/util';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	import BindCompanyPopup from './components/BindCompanyPopup.vue'
	const showPopup = ref(false)
	const backgroundColor = ref<string>('transparent');
	const openPopup = () => {
		showPopup.value = true
	}
</script>

<style scoped lang="scss">
	.container {
		position: relative;
		width: 100%;
		height: 100vh;
		background-color: var(--head-color);
	}

	.bg-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 1;
	}

	.title-container {
		position: absolute;
		top: 200rpx;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		z-index: 2;
		color: #fff;
		font-weight: bold;
	}

	.title-text {
		font-size: 48rpx;
		line-height: 60rpx;
		margin-bottom: 10rpx;
	}

	.title-sub {
		font-size: 36rpx;
		line-height: 44rpx;
		opacity: 0.9;
	}

	.btn-group {
		position: absolute;
		bottom: 250rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
	}

	.btn-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 40rpx;
		margin-bottom: 20rpx;
		width: 664rpx;
		height: 184rpx;
		background: linear-gradient(150deg, #D6E5FF 0%, #FFFFFF 100%);
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		border: 2rpx solid #FFFFFF;
		box-sizing: border-box;
	}

	.btn-title {
		font-size: 32rpx;
		color: #333;
		font-weight: 600;
	}

	.btn-desc {
		font-size: 24rpx;
		color: #999;
		margin-top: 4rpx;
	}

	.btn-arrow {
		width: 60rpx;
		height: 60rpx;
		background-color: var(--primary-color);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-size: 32rpx;
		transition: all 0.3s;
	}

	.btn-arrow:hover {
		background-color: var(--primary-color);
	}
</style>