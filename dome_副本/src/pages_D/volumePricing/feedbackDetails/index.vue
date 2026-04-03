<template>
	<view class="feeback-details">
		<!-- 头部保障 -->
		<view class="header">
			<image class="bao-icon" :src="imgUrl + 'volumePricing/vp_bao.png'" />
			<view class="header-title">陕易通平台保障</view>
			<text class="header-text">您提交的每一份工单，平台都会全程跟进、妥善处理，保障您的问题都有解决。</text>
		</view>

		<!-- 错误提示块 -->
		<view class="error-tip">
			<text class="err-title">{{ feedinfo.content }}</text>
			<view v-if="feedinfo.replyContent" class="err-line"></view>
			<view v-if="feedinfo.replyContent" class="err-info">
				<image class="kefu-icon" :src="imgUrl + 'volumePricing/vp_kefu.png'" />
				<text>{{ feedinfo.replyContent }}</text>
			</view>
		</view>

		<!-- 处理进度 tabs -->
		<view class="process-tabs">
			<view class="tab-item">
				<image class="success-icon" :src="imgUrl + 'volumePricing/vp_fk_success.png'" />
				提交反馈
			</view>
			<view class="dashed"></view>
			<view class="tab-item" :class="{ active: feedinfo.auditStatus == 1 || feedinfo.auditStatus == 2 }">
				<image v-if="feedinfo.auditStatus == 3" class="success-icon" :src="imgUrl + 'volumePricing/vp_fk_success.png'" />
				处理中
			</view>
			<view class="dashed"></view>
			<view class="tab-item" :class="{ active: feedinfo.auditStatus == 3 }">处理完成</view>
		</view>

		<!-- 状态头 -->
		<view class="status-header">
			<text v-if="feedinfo.auditStatus != 3" class="status-title">平台正在帮助您处理</text>
			<text v-if="feedinfo.auditStatus == 3" class="status-title">处理完成</text>
			<view v-if="feedinfo.auditStatus != 3" class="status-btn" @click="onUrge">催办</view>
		</view>

		<!-- 时间线 -->
		<view class="status-progress">
			<view class="timeline">
				<view
					class="timeline-item"
					v-for="(item, index) in timelineItems"
					:key="index"
					:class="[{ active: item.status == feedinfo.auditStatus }, { 'last-item': index === timelineItems.length - 1 }]"
				>
					<view class="timeline-header">
						<text class="timeline-title" :class="{ 'active-text': item.status == feedinfo.auditStatus }">
							{{ item.title }}
						</text>
						<text v-if="item.status == feedinfo.auditStatus" class="estimate-text">预计30分钟内完成</text>
					</view>
					<view class="timeline-content">
						<text class="timeline-time">{{ item.time }}</text>
						<text class="timeline-desc" :class="{ 'active-text': item.status == feedinfo.auditStatus }">
							{{ item.desc }}
						</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 详情块 -->
		<view class="details">
			<view class="item">
				<text class="label">高速名称</text>
				<text class="value">{{ feedinfo.highName || '-' }}</text>
			</view>
			<view class="item">
				<text class="label">区间名称</text>
				<text class="value">{{ feedinfo.roadName1 }}——{{ feedinfo.roadName2 }}</text>
			</view>
			<view class="item">
				<text class="label">车牌号码</text>
				<text class="value">{{ feedinfo.vehicleNumber || '-' }}</text>
			</view>

			<view class="line"></view>

			<view class="item">
				<text class="label">工单编号</text>
				<text class="value">{{ feedinfo.id }}</text>
			</view>
			<view class="item">
				<text class="label">反馈时间</text>
				<text class="value">{{ feedinfo.createTime }}</text>
			</view>
			<view class="item">
				<text class="label">处理结果</text>
				<text v-if="feedinfo.auditStatus == 1 || feedinfo.auditStatus == 2" class="value">处理中</text>
				<text v-if="feedinfo.auditStatus == 3" class="value">已处理</text>
			</view>
		</view>

		<!-- 底部 -->
		<!-- <view class="footer">
			<text>如有问题，请添加客服微信进行解决。</text>
			<view class="wx-btn" @click="onAddWX">添加微信</view>
		</view> -->
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { imgUrl } from '../../../config';
import { getYldjFeedbackinfoById } from '@/api/volumePricing';

type TimeLineItem = {
	title: string;
	time: string;
	desc: string;
	status: number | string;
};

type FeedInfo = {
	id?: string | number;
	auditStatus?: number | string;
	content?: string;
	replyContent?: string;
	highName?: string;
	roadName1?: string;
	roadName2?: string;
	vehicleNumber?: string;
	memberId?: string;
	createTime?: string;
	auditList?: Array<{
		auditStatus: number;
		createTime: string;
	}>;
};

const listId = ref<string | number>('');

const feedinfo = ref<FeedInfo>({
	highName: '延延高速子姚段',
	roadName1: '永坪',
	roadName2: '蟠龙',
	vehicleNumber: '陕A566ME',
	id: '1234567892020215211155',
	createTime: '2025-04-11 20:32:24',
	auditStatus: 3,
});
const timelineItems = ref<TimeLineItem[]>([
	{
		title: '客服',
		time: '2025-03-02 21:32:24',
		desc: '客服已经查看您的反馈意见',
		status: 0,
	},
	{
		title: '专员',
		time: '2025-03-02 21:32:24',
		desc: '专员已经查看您的反馈意见',
		status: 1,
	},
	{
		title: '平台',
		time: '2025-03-02 20:32:24',
		desc: '平台已经收到您的反馈意见',
		status: 2,
	},
	{
		title: '处理完成',
		time: '2025-03-02 20:32:24',
		desc: '已处理您的反馈意见',
		status: 3,
	},
]);

// 兜底展示字段（无数据时）
const workOrderNumber = ref('123456789202201521155');
const feedbackTime = ref('2025-04-11 10:32:24');

/** 拉取详情并映射到时间线 */
const loadDetail = async () => {
	if (!listId.value) return;
	const params = { id: listId.value };

	try {
		const res = await getYldjFeedbackinfoById(params);
		console.log('反馈的详情', res);
		feedinfo.value = res?.clazz || {};
		let arr = timelineItems.value;
		feedinfo.value.auditList.forEach((item, index) => {
			if (item.auditStatus == 0) {
				arr[index].title = '平台已处理';
			}
			if (item.auditStatus == 1) {
				arr[index].title = '客服已查看';
			}
			if (item.auditStatus == 2) {
				arr[index].title = '专员已处理';
			}
			if (item.auditStatus == 3) {
				arr[index].title = '处理完成';
			}
			arr[index].time = item.createTime;
			arr[index].status = item.auditStatus;
		});
		timelineItems.value = arr;
	} catch (err: any) {
		uni.showToast({ title: String(err || '加载失败'), icon: 'none' });
	}
};

onLoad((options: Record<string, any>) => {
	const id = options?.id;
	if (id) {
		listId.value = id;
		loadDetail();
	}
});

/** 催办 */
const onUrge = () => {
	uni.showToast({ title: '已催办', icon: 'success' });
};

/** 添加客服微信（示例：复制微信号并提示） */
const onAddWX = () => {
	const wxId = 'kefu123456';
	uni.setClipboardData({
		data: wxId,
		success: () => {
			uni.showToast({ title: '微信号已复制', icon: 'none' });
		},
	});
};

/** 重新提交（若保留该交互） */
const onRetry = () => {
	uni.showToast({ title: '重新提交成功!', icon: 'success', duration: 2000 });
};
</script>

<style lang="scss" scoped>
.feeback-details {
	background: #f8f8fa;
}

.header {
	background: #f1faf1;
	color: #1ab84e;
	font-size: 26rpx;
	padding: 17rpx 26rpx;
}

.header-title {
	font-size: 28rpx;
	margin-right: 10rpx;
	font-weight: 600;
	margin-left: 20rpx;
	text-indent: 20rpx;
	display: inline-block;
}

.bao-icon {
	min-width: 34rpx;
	max-width: 34rpx;
	height: 34rpx;
	margin-right: 5rpx;
	position: absolute;
}

.error-tip {
	padding: 32rpx 30rpx 42rpx;
	background: #fff;
}

.err-title {
	font-weight: 600;
	font-size: 32rpx;
	color: #000000;
}

.err-line {
	width: 670rpx;
	height: 1.5rpx;
	background: #dfdfdf;
	margin: 29rpx 0 23rpx;
}

.err-info {
	display: flex;
	align-items: center;
}

.kefu-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 22rpx;
}

.process-tabs {
	margin-top: 14rpx;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 44rpx 25rpx 34rpx;
	margin-bottom: 1rpx;
	border-bottom: 1px solid #d8d8d8;
}

.success-icon {
	width: 24rpx;
	height: 24rpx;
	margin-right: 6rpx;
}

.tab-item {
	color: #a1a1a1;
	font-size: 26rpx;
}

.dashed {
	width: 124rpx;
	height: 0rpx;
	border-top: 1rpx dashed #a1a1a1;
}

.active {
	font-size: 30rpx;
	font-weight: 500;
	color: #58595b;
}

.status-header {
	text-align: center;
	background: #fff;
	padding: 36rpx 26rpx 48rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid #d8d8d8;
}

.status-title {
	font-size: 48rpx;
	font-weight: bold;
}

.status-btn {
	width: 108rpx;
	height: 52rpx;
	border-radius: 30rpx;
	border: 1rpx solid #ff3c00;
	color: #ff3c00;
	font-size: 24rpx;
	font-weight: 500;
	box-sizing: border-box;
	line-height: 48rpx;
}

.status-subtitle {
	font-size: 16px;
	color: #999;
}

.status-progress {
	background: #fff;
	padding: 30rpx 32rpx;
}

/* 时间区域样式 */
.time-section {
	text-align: center;
	margin-bottom: 20rpx;
}

.time-text {
	font-size: 28rpx;
	color: #666;
}

/* 预计完成时间样式 */
.estimate-section {
	text-align: center;
	margin-bottom: 30rpx;
}

/* 状态描述样式 */
.status-desc {
	text-align: center;
	margin-bottom: 50rpx;
	padding: 0 20rpx;
}

.desc-text {
	font-size: 30rpx;
	color: #333;
	line-height: 1.6;
}

/* 时间线样式 */
.timeline {
	background-color: #fff;
	border-radius: 16rpx;
	padding-left: 10rpx;
}

.timeline-item {
	margin-bottom: 40rpx;
	position: relative;
	padding-left: 31rpx;
}

.timeline-item::before {
	content: '';
	position: absolute;
	left: 0;
	top: 40rpx;
	bottom: -50rpx;
	width: 2rpx;
	background-color: #e0e0e0;
}

.timeline-item.active::before {
	background-color: #26b510;
}

.timeline-item.last-item::before {
	display: none;
}

.timeline-item:last-child {
	margin-bottom: 0;
}

.timeline-header {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 15rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-left: 20rpx;
}

.timeline-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #9c9c9c;
	position: relative;
}

.estimate-text {
	font-size: 26rpx;
	color: #27b417;
	font-weight: 500;
}

.timeline-title.active-text {
	color: #000;
}

.timeline-title::before {
	content: '';
	position: absolute;
	left: -65rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 18rpx;
	height: 18rpx;
	border-radius: 50%;
	background-color: #e0e0e0;
	border: 7rpx solid #fff;
}

.timeline-item.active .timeline-title::before {
	background-color: #26b510;
	border: 7rpx solid #96da8e;
}

.timeline-content {
	padding-left: 20rpx;
}

.timeline-time {
	font-size: 26rpx;
	color: #9c9c9c;
	display: block;
	margin-bottom: 8rpx;
}

.timeline-desc {
	font-size: 28rpx;
	color: #9c9c9c;
	display: block;
	line-height: 1.5;
}

.timeline-desc.active-text {
	color: #000;
}

.details {
	margin-top: 14rpx;
	background: #fff;
	padding: 32rpx;
	margin-bottom: 14rpx;
}

.item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 37rpx;
}

.line {
	width: 679rpx;
	height: 1rpx;
	background: #dfdfdf;
	margin-bottom: 32rpx;
}

.label {
	width: 100px;
	font-weight: 400;
	font-size: 26rpx;
	color: #131313;
}

.value {
	font-weight: 400;
	font-size: 24rpx;
	color: #6b7073;
}

.footer {
	background: #fff;
	font-weight: 400;
	font-size: 26rpx;
	color: #69696a;
	padding: 32rpx 32rpx 100rpx;
}

.wx-btn {
	width: 140rpx;
	height: 52rpx;
	border-radius: 8rpx;
	background: #ff6503;
	color: #ffffff;
	margin-top: 14rpx;
	text-align: center;
	line-height: 48rpx;
}
</style>
