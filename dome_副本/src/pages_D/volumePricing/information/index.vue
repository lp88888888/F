<template>
	<view class="page">
		<view class="title">选择您的身份</view>
		<view class="tips">一个用户可拥有多种身份，不同身份拥有不同的信息！</view>

		<view class="tabs">
			<view class="tab-item" @click="changeTab(1)">
				<view class="tab-bg" :style="{ backgroundImage: `url(${imgUrl}volumePricing/vp_user.png)` }"></view>
				<view class="tab-item-title">个人身份</view>
				<view class="tab-item-text">需认证个人身份信息</view>
				<image class="icAddRaido" :src="`${imgUrl}volumePricing/${selectType === 1 ? 'vp_select.png' : 'vp_normal.png'}`" />
			</view>

			<view class="tab-item" @click="changeTab(2)">
				<view class="tab-bg" :style="{ backgroundImage: `url(${imgUrl}volumePricing/vp_enterprise.png)` }"></view>
				<view class="tab-item-title">企业身份</view>
				<view class="tab-item-text">需认证企业营业执照信息</view>
				<image class="icAddRaido" :src="`${imgUrl}volumePricing/${selectType === 2 ? 'vp_select.png' : 'vp_normal.png'}`" />
			</view>
		</view>

		<view class="btn" @click="nextStep">确定</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { imgUrl } from '@/config';

// 响应式数据
const selectType = ref<1 | 2>(1); // 限制只能是1或2，对应个人/企业

/**
 * 切换身份类型
 * @param type 1-个人，2-企业
 */
const changeTab = (type: 1 | 2) => {
	selectType.value = type;
};

/**
 * 下一步：跳转对应认证页面
 */
const nextStep = () => {
	switch (selectType.value) {
		case 1:
			// 跳转个人身份认证页面
			uni.navigateTo({
				url: `/pages_D/volumePricing/improve/index?bindType=1`,
			});
			break;
		case 2:
			// 跳转企业身份认证页面
			uni.navigateTo({
				url: `/pages_D/volumePricing/Corporate/index`,
			});
			break;
	}
};
</script>

<style lang="scss" scoped>
.page {
	background: #f0f0f2;
	height: calc(100vh - 106rpx);
	padding: 52rpx;
}

.title {
	font-size: 48rpx;
	font-weight: 600;
	color: #080912;
	margin-bottom: 20rpx;
}

.tips {
	font-size: 24rpx;
	color: rgba(61, 61, 61, 0.5);
}

.tabs {
	margin-top: 20%;
}

.tab-item {
	width: 646rpx;
	height: 200rpx;
	margin-bottom: 100rpx;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
}

.tab-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	opacity: 0.15;
}

.tab-item-title {
	font-size: 36rpx;
	font-weight: 600;
	margin-bottom: 22rpx;
	padding-left: 40rpx;
}

.tab-item-text {
	font-size: 24rpx;
	color: #686868;
	padding-left: 40rpx;
}

.icAddRaido {
	width: 45rpx;
	height: 44rpx;
	margin-right: 20rpx;
	position: absolute;
	bottom: 40rpx;
	right: 34rpx;
}

.btn {
	width: 588rpx;
	height: 88rpx;
	border-radius: 16rpx;
	background: linear-gradient(180deg, #f7b77f 0%, #ec8733 100%), linear-gradient(271deg, #ffa46b 0%, #ff5e27 99%);
	margin: 20% 30rpx 0;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 34rpx;
	font-weight: 500;
	color: #ffffff;
}
</style>
