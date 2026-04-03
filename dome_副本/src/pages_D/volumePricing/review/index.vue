<template>
	<view class="page">
		<!-- 顶部返回 -->
		<!-- <view class="back" :style="{ position: 'fixed', paddingTop: navBarHeight + 'px' }" @click="handleViewDetail">
			<image :src="imgUrl + '/wximage/trip-pro/arrow-left-icon.png'" />
			<text class="back-tit">提交成功</text>
		</view> -->

		<up-navbar bgColor="transparent" placeholder :fixed="true" title="提交成功" autoBack></up-navbar>

		<!-- 状态图标 -->
		<image v-if="bindType === '2'" class="check-icon" :src="imgUrl + 'volumePricing/arrow-left-icon.png'" />
		<image v-else-if="bindType === '1'" class="check-icon" :src="imgUrl + 'volumePricing/arrow-left-icon-s.png'" />

		<!-- 内容 -->
		<view class="content">
			<view class="title">{{ bindType === '1' ? '审核已通过' : '正在审核中' }}</view>
			<view class="description">
				{{ bindType === '1' ? '您的信息已审核通过，快去申请活动享受优惠吧~' : '您的信息正在人工审核中，预计需1-2个工作日，请耐心等待~' }}
			</view>
			<view class="button-group">
				<view class="detail-btn" @click="handleViewDetail">查看</view>
				<view :class="bindType === '1' ? 'apply-btn' : 'g-btn'" @click="handleApply"> 去申请 </view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { imgUrl } from '../../../config';

// 响应式数据
const bindType = ref('2');
const navBarHeight = ref(0);
const creditCode = ref('');
const id = ref('');

// 生命周期
onLoad((options: any) => {
	bindType.value = options.bindType || '2';
	creditCode.value = options.creditCode || '';
	id.value = options.id || '';
	// 从全局获取状态栏和标题栏高度
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = sysInfo.statusBarHeight + 12; // 44是默认导航栏高度

	if (!getApp().checkLogin()) {
		return;
	}
});

// 事件处理
const handleViewDetail = () => {
	uni.navigateTo({
		url: `/pages_D/volumePricing/improve/index?creditCode=${creditCode.value}&bindType=${bindType.value}`,
	});
};

const handleApply = () => {
	if (bindType.value === '2') return;
	uni.navigateTo({
		url: `/pages_D/volumePricing/activityDetails/index?id=${id.value}`,
	});
	console.log('去申请');
};
</script>

<style lang="scss" scoped>
.container {
	padding: 30rpx;
}

.back {
	width: 100%;
	position: relative;
	/* font-size: 36rpx; */
}

.back-tit {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}

.content {
	text-align: center;
}

.check-icon {
	width: 750rpx;
	height: 590rpx;
	margin-bottom: 20rpx;
}

.title {
	font-size: 36rpx;
	color: #333;
	font-weight: 700;
}

.description {
	width: 60%;
	text-align: center;
	margin: 0 auto;
	font-size: 26rpx;
	color: #979797;
	margin-top: 20rpx;
}

.button-group {
	display: flex;
	justify-content: space-around;
	padding-top: 100rpx;
	/* border-top: 4rpx #f3f3f3 dashed; */
	margin-top: 30rpx;
}

.detail-btn,
.apply-btn {
	text-align: center;
	line-height: 96rpx;
	width: 280rpx;
	height: 96rpx;
	border-radius: 64rpx;
	box-sizing: border-box;
}

.g-btn {
	width: 280rpx;
	height: 96rpx;
	border-radius: 46rpx;
	background: #a2a2a2;
	text-align: center;
	line-height: 96rpx;
	color: #fefefe;
}

.detail-btn {
	color: #333;
	border: 2rpx solid #a2a2a2;
}

.apply-btn {
	background-color: #2196f3;
	color: white;
}
</style>
