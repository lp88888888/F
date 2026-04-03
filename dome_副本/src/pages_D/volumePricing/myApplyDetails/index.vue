<template>
	<view class="apply-info">
		<!-- 顶部状态区域 -->
		<view class="status-card">
			<image
				v-if="(infoData.status === 2 && type === 1) || (infoData.status === 2 && type === 2)"
				class="bg-icon"
				:src="imgUrl + 'volumePricing/vp_apply_bg.png'"
			/>
			<image v-else-if="infoData.status === 1 && type === 1" class="bg-icon" :src="imgUrl + 'volumePricing/vp_search_bg.png'" />
			<image v-else class="bg-icon" :src="imgUrl + 'volumePricing/vp_fail_bg.png'" />

			<view class="status-box">
				<view v-if="type === 1" class="status-title">
					{{ statusTitle }}
				</view>
				<view v-if="type === 2" class="status-title">
					{{ infoData.result }}
				</view>
			</view>

			<view v-if="type === 1" class="status-desc">
				{{ statusDesc }}
			</view>
			<view v-if="type === 2" class="status-desc">
				{{ infoData.status === 1 ? '您的通行次数已达标，快去享受优惠吧！' : '继续通行，就能解锁通行费折扣啦！再接再厉！' }}
			</view>
		</view>

		<!-- 活动信息 -->
		<view class="activity-card">
			<view class="activity-box">
				<view class="activity-title"> {{ infoData.roadName1 }}——{{ infoData.roadName2 }} “以量定价” 差异化收费（试点） </view>
				<view class="discount-badge">
					<text>{{ infoData.discount }}</text>
					<text class="unit">折</text>
				</view>
			</view>
			<view class="activity-info">
				<text class="info-label">高速名称：</text>
				<text class="info-value">{{ infoData.highName }}</text>
			</view>
			<view class="activity-info">
				<text class="info-label">活动时间：</text>
				<view class="info-value">
					{{ infoData.startTime }}
					<text v-if="infoData.endTime">至</text>
					{{ infoData.endTime }}
				</view>
			</view>
			<view v-if="type === 2" class="activity-info-clo0">
				<text>优惠时间：</text>
				<view>
					{{ infoData.discountStartTime }}
					<text v-if="infoData.discountEndTime">至</text>
					{{ infoData.discountEndTime }}
				</view>
			</view>
		</view>

		<view class="line"></view>

		<!-- 车辆信息 -->
		<view class="info-card">
			<view class="section-title">车辆信息</view>
			<view class="info-row">
				<text class="section-label">车牌号</text>
				<text class="section-value car-num">{{ infoData.vehicleNumber }}</text>
			</view>
			<view class="info-row">
				<text class="section-label">车辆类型</text>
				<text class="section-value">{{ type === 1 ? infoData.carTypeName : vehicleType }}</text>
			</view>
			<view class="info-row">
				<text class="section-label">手机号</text>
				<text class="section-value">{{ infoData.mobile }}</text>
			</view>
			<view class="b-line"></view>
			<view class="info-row">
				<text class="section-label">申请编号</text>
				<text class="section-value">{{ type === 1 ? infoData.id : infoData.applyCode }}</text>
			</view>
			<view class="info-row">
				<text class="section-label">申请时间</text>
				<text class="section-value">{{ infoData.createTime }}</text>
			</view>
			<view v-if="type === 2" class="info-row">
				<text class="section-label">订单状态</text>
				<text class="section-value">{{ infoData.orderStatus === 1 ? '已完成' : '未完成' }}</text>
			</view>
			<view v-if="type === 1" class="info-row">
				<text class="section-label">审核状态</text>
				<view class="section-value" :class="auditStatusClass">
					{{ auditStatusText }}
				</view>
			</view>
			<view v-if="type === 1" class="info-row">
				<text class="section-label">审核时间</text>
				<text class="section-value">{{ infoData.auditTime }}</text>
			</view>
			<view v-if="infoData.status === 3" class="info-row">
				<text class="section-label">拒绝原因</text>
				<text class="section-value status-text-r">{{ infoData.mark }}</text>
			</view>
		</view>

		<!-- 通行情況 -->
		<view v-if="type === 2" class="line"></view>
		<view v-if="type === 2" class="info-card bubble">
			<view class="section-title">通行情況</view>
			<view class="info-row">
				<view class="times-box">
					<text class="section-label">前置通行次数</text>
					<image class="wh-icon" :src="imgUrl + 'volumePricing/vp_wh.png'" @tap="showBubbleEvt" />
				</view>
				<text class="section-value status-text-g">{{ infoData.frontNum }}次</text>
				<view v-if="showBubble" class="bubble-box">
					前置通行次数：您通行目标区间的存量通行次数、在优惠期间以原费率完成“前置通行次数”后，增量次数可享区间折扣优惠。
					<view class="bubble-tail"></view>
					<image class="close-icon" :src="imgUrl + 'volumePricing/vp_close.png'" @tap="closeBubbleEvt" />
				</view>
			</view>
			<view class="info-row">
				<text class="section-label">已通行次数</text>
				<text class="section-value status-text-r">{{ infoData.passTotal }}次</text>
			</view>
			<view class="info-row">
				<text class="section-label">是否完成前置</text>
				<text class="section-value status-text-r">{{ infoData.status == 1 ? '完成' : '未完成' }}</text>
			</view>
			<view v-if="infoData.actAppDate" class="info-row">
				<text class="section-label">优惠开始时间</text>
				<text class="section-value">{{ infoData.actAppDate }}</text>
			</view>
			<view class="notice">注：因收费数据有延时，请耐心等候！优惠开始时间为自您收到短信时间后的24小时生效。</view>
		</view>

		<!-- 底部操作 -->
		<view v-if="type === 1" class="bottom-bar">
			<view v-if="infoData.status === 1" class="warning-btn" @tap="onRevocation(infoData.id)"> 撤销申请 </view>
			<view class="default-btn" @tap="onFeedback">我要反馈</view>
		</view>

		<!-- 撤销弹窗 -->
		<view v-if="isPopupVisibleInfo" class="popup-container"></view>
		<view v-show="isPopupVisibleInfo" class="popup">
			<view class="popup-header">确认撤销</view>
			<view class="popup-text">确认撤销本次活动申请？</view>
			<view class="btn-boxs">
				<view class="cancel-btn" @tap="cancelEvt">取消</view>
				<view class="sure-btn" @tap="sureEvt">确认</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { imgUrl } from '../../../config';
import { toNav, toRec } from '@/utils/route';
import { yldjApplyInfo, yldjNumberPassesInfo, getgaosulist } from '@/api/volumePricing';

const showBubble = ref(false);
const isPopupVisibleInfo = ref(false);
const selectedId = ref<number>(0);

const type = ref<number>(1);
const id = ref<number>(0);
const infoData = ref<any>({});
const vehicleType = ref('');

// 生命周期
onLoad((options: any) => {
	console.log('页面接受的参数', options);
	id.value = options.id;
	type.value = Number(options.type);
	getList();
});

// 获取详情
const getList = async () => {
	const params = { id: id.value };
	const res = type.value == 1 ? await yldjApplyInfo(params) : await yldjNumberPassesInfo(params);
	console.log('查询的详情', res);
	infoData.value = res.clazz;
	getTypeList(res.clazz.vehicleType);
};

// 获取车辆类型
const getTypeList = async (id) => {
	const res = await getgaosulist({ type: 11 });
	console.log('查询的车辆数据', res);
	const data = res.clazz.find((item) => item.data == id);
	console.log('判断的车辆', data);
	vehicleType.value = data.name || '';
};

// 审核状态文字与样式
const auditStatusText = computed(() => {
	if (infoData.value.status === 1) return '审核中';
	if (infoData.value.status === 2) return '审核通过';
	if (infoData.value.status === 3) return '审核拒绝';
	if (infoData.value.status === 4) return '已撤销';
	return '作废';
});
const auditStatusClass = computed(() => {
	if (infoData.value.status === 2) return 'status-text-g';
	if (infoData.value.status === 1) return 'status-text';
	return 'status-text-r';
});

// 顶部状态标题与描述
const statusTitle = computed(() => {
	const map: any = {
		1: '审核中',
		2: '审核通过',
		3: '审核拒绝',
		4: '已撤销',
		'-1': '作废',
	};
	return map[infoData.value.status] || '';
});
const statusDesc = computed(() => {
	const map: any = {
		1: '您的申请正在审核中，请耐心等待！',
		2: '您的申请已通过，快去享受优惠吧！',
		3: '您的申请已被拒绝，请重新申请！',
		4: '申请已撤销，您可重新申请！',
		'-1': '作废',
	};
	return map[infoData.value.status] || '';
});

// 撤销
const onRevocation = (val: number) => {
	selectedId.value = val;
	isPopupVisibleInfo.value = true;
};
const cancelEvt = () => {
	isPopupVisibleInfo.value = false;
};
const sureEvt = () => {
	const params = { id: selectedId.value };
	dataApi.yldjRevokeApply(
		params,
		(res: any) => {
			uni.showToast(res.resultMsg);
			getList();
		},
		(msg: string) => {
			uni.showToast(msg);
		}
	);
	isPopupVisibleInfo.value = false;
};

// 气泡
const showBubbleEvt = () => {
	showBubble.value = true;
};
const closeBubbleEvt = () => {
	showBubble.value = false;
};

// 我要反馈
const onFeedback = () => {
	toNav('/pages_D/volumePricing/submitOpinions/index');
};
</script>

<style lang="scss" scoped>
/* 页面整体样式 */
.apply-info {
	background-color: #d6eaff;
	/* min-height: 100vh; */
	box-sizing: border-box;
}

/* 卡片通用样式 */
.status-card,
.activity-card,
.info-card {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 32rpx;
}

.activity-card {
	border-radius: 30rpx 30rpx 0 0;
	padding: 38rpx 35rpx;
}

.bg-icon {
	position: absolute;
	left: -6rpx;
	bottom: 10rpx;
	width: 170rpx;
	height: 132rpx;
	z-index: 0;
}

/* 状态卡片样式 */
.status-card {
	/* height: 175rpx; */
	text-align: center;
	padding: 40rpx 30rpx;
	position: relative;
	background: #d6eaff;
}

.status-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 5rpx 0 120rpx;
	z-index: 1;
}

.status-title {
	font-size: 40rpx;
	font-weight: 500;
	color: #082c5c;
	z-index: 2;
}

.status-desc {
	font-size: 24rpx;
	color: #082c5c;
	padding-left: 120rpx;
	text-align: left;
	z-index: 2;
}

.activity-box {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

/* 活动卡片样式 */
.activity-title {
	width: 456rpx;
	font-size: 34rpx;
	font-weight: 600;
	margin-bottom: 32rpx;
	padding-left: 13rpx;
}

.discount-badge {
	font-weight: 500;
	font-size: 42rpx;
	color: #ff0000;
}

.unit {
	font-size: 28rpx;
}

.activity-info {
	display: flex;
	margin-bottom: 16rpx;
	padding-left: 13rpx;
}

.activity-info-clo0 {
	font-size: 24rpx;
	color: #000000;
	padding-left: 13rpx;
}

.info-label {
	font-size: 24rpx;
	color: #9b9b9b;
}

.info-value {
	font-size: 24rpx;
	color: #9b9b9b;
}

.section-label {
	font-size: 26rpx;
	color: #131313;
}

.section-value {
	font-size: 28rpx;
	font-weight: 500;
	color: #6b7073;
}

.wh-icon {
	width: 36rpx;
	height: 36rpx;
	margin-left: 10rpx;
}

.car-num {
	color: #000000;
	font-weight: 600;
	font-size: 30rpx;
}

.line {
	width: 100%;
	height: 14rpx;
	background: #f8f8fa;
}

.times-box {
	display: flex;
	align-items: center;
}

/* 信息卡片样式 */
.section-title {
	font-size: 32rpx;
	color: #131313;
	font-weight: 600;
	margin-bottom: 30rpx;
}

.info-row {
	display: flex;
	justify-content: space-between;
	padding: 20rpx 0;
}

.b-line {
	height: 1.5rpx;
	background: #dfdfdf;
	margin: 20rpx 0;
}

.info-row:last-child {
	border-bottom: none;
}

.status-text {
	color: #1186f8;
}

.status-text-r {
	color: #ff0000;
}

.status-text-g {
	color: #11a567;
}

.notice {
	color: #e54ced;
	font-size: 24rpx;
	line-height: 42rpx;
}

.bubble {
	position: relative;
	padding-bottom: 180rpx;
}
/* 黑色气泡框样式 */
.bubble-box {
	background-color: #303030;
	color: #fff;
	border-radius: 10rpx;
	padding: 23rpx 20rpx;
	max-width: 680rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	word-wrap: break-word;
	position: absolute;
	top: -140rpx;
	box-sizing: border-box;
	font-size: 26rpx;
	line-height: 48rpx;
}

/* 气泡尾巴样式 */
.bubble-tail {
	position: absolute;
	bottom: -8rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 8rpx solid transparent;
	border-right: 8rpx solid transparent;
	border-top: 8rpx solid #000;
}

.close-icon {
	width: 36rpx;
	height: 36rpx;
	position: absolute;
	right: 23rpx;
	bottom: 18rpx;
}

.bottom-bar {
	width: 750rpx;
	height: 160rpx;
	background: #ffffff;
	box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.3);
	position: fixed;
	bottom: 0;
	display: flex;
	justify-content: flex-end;
	padding: 42rpx 36rpx 0;
	box-sizing: border-box;
}

.success-btn {
	width: 140rpx;
	height: 60rpx;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #156fff;
	border: 1rpx solid #156fff;
	margin-right: 24rpx;
}

.warning-btn {
	width: 140rpx;
	height: 60rpx;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #ff3c00;
	border: 1rpx solid #ff3c00;
	margin-right: 24rpx;
}

.default-btn {
	width: 140rpx;
	height: 60rpx;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border: 1rpx solid #b8b8b8;
}
.popup-container {
	width: 100%;
	height: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: flex-end;
	z-index: 9999;
}

.popup {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	box-sizing: border-box;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 50rpx;
	box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
	z-index: 1000;
	width: 80%;
	height: 338rpx;
	z-index: 99999;
	box-sizing: border-box;
}

.popup-header {
	width: 100%;
	font-size: 32rpx;
	font-weight: 500;
	text-align: center;
	margin-bottom: 20rpx;
}

.popup-text {
	text-align: center;
	font-size: 28rpx;
	font-weight: normal;
	color: #a9a9a9;
	line-height: 42rpx;
}

.popup-content {
	height: 600rpx;
	overflow-y: auto;
}

.btn-boxs {
	display: flex;
	margin-top: 50rpx;
}

.cancel-btn {
	width: 246rpx;
	height: 70rpx;
	border-radius: 10rpx;
	background: #ffffff;
	border: 1rpx solid #6b7073;
	margin-right: 34rpx;
	text-align: center;
	line-height: 70rpx;
	box-sizing: border-box;
}

.sure-btn {
	width: 246rpx;
	height: 70rpx;
	border-radius: 10rpx;
	background: linear-gradient(180deg, #f7b77f 0%, #ec8733 100%), #ff6503;
	text-align: center;
	line-height: 70rpx;
	color: #fff5f3;
	box-sizing: border-box;
}
</style>
