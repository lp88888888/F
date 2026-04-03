<template>
	<view class="page">
		<!-- 状态栏 -->
		<up-navbar bgColor="transparent" :placeholder="false" :fixed="true" title="活动详情" autoBack></up-navbar>

		<!-- 顶部轮播 -->
		<swiper class="banner" circular interval="3500" duration="500" :style="{ paddingTop: showHeader ? navBarHeight + 'px' : 0 }">
			<swiper-item v-for="(item, index) in bannerImgs" :key="index">
				<image class="banner-img" mode="aspectFill" :src="item" />
			</swiper-item>
		</swiper>

		<!-- 主体卡片 -->
		<view class="container-details">
			<view class="card">
				<view class="status-row">
					<image class="going-icon" :src="imgUrl + 'volumePricing/vp_going.png'" />
					<view class="title">{{ discountInfo.highName }}“以量定价” 差异化收费（试点）</view>
				</view>

				<view>
					<view class="sub-box">
						<view class="price-row">
							<text class="price">{{ discountInfo.minDiscount ? discountInfo.minDiscount || '—' : '暂无' }}</text>
							<text v-if="discountInfo.minDiscount" class="unit">折</text>
							<text v-if="discountInfo.minDiscount" class="subline sub">路段最低优惠</text>
						</view>

						<view class="sub-info">
							<text>收费站 {{ discountInfo.stationNum }}个</text>
							<view class="sub-line"></view>
							<text>服务区 {{ discountInfo.serviceNum }}个</text>
						</view>
					</view>

					<!-- 关键信息条 -->
					<view class="chips">
						<image class="car-icon" :src="imgUrl + 'volumePricing/vp_car.png'" />
						<view class="chip">优惠车型：{{ discountInfo.goalName || '' }}（持ETC和CPC卡均可）</view>
					</view>

					<view class="meta">
						<view class="meta-row">
							<image class="time-icon" :src="imgUrl + 'volumePricing/vp_time.png'" />
							<text class="meta-val">{{ discountInfo.startTime }} - {{ discountInfo.endTime }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 活动路段（表格） -->
			<view class="section">
				<view class="section-hd">
					<image class="dot-icon" :src="imgUrl + 'volumePricing/vp_circle.png'" />
					<text class="section-title">活动路段</text>
				</view>

				<view class="table">
					<view class="tr th">
						<view class="td">优惠路段</view>
						<view class="td td-r">优惠折扣</view>
					</view>
					<view v-for="(item, index) in discountInfo.secList" :key="index" class="tr trs" :class="{ zebra: index % 2 === 1 }">
						<view class="td">{{ item.roadName1 }}——{{ item.roadName2 }}</view>
						<view class="td td-r">{{ item.discount }}折</view>
					</view>
				</view>
			</view>

			<!-- 参与活动条件 -->
			<view class="section">
				<view class="section-hd">
					<image class="dot-icon" :src="imgUrl + 'volumePricing/vp_circle.png'" />
					<text class="section-title">参与活动条件</text>
				</view>
				<u-parse class="para" :content="discountInfo.joinText"></u-parse>
			</view>

			<!-- 前置次数判定 -->
			<view class="section">
				<view class="section-hd">
					<image class="dot-icon" :src="imgUrl + 'volumePricing/vp_circle.png'" />
					<text class="section-title">前置次数判定</text>
				</view>
				<u-parse class="para" :content="discountInfo.presentText"></u-parse>
			</view>

			<!-- 高速地图 -->
			<view class="section">
				<view class="section-hd">
					<image class="dot-icon" :src="imgUrl + 'volumePricing/vp_circle.png'" />
					<text class="section-title">高速地图</text>
				</view>
				<view class="map-card">
					<image class="map" mode="aspectFill" :src="discountInfo.mapUrl" />
				</view>
			</view>

			<!-- 底部占位 -->
			<view style="height: 160rpx"></view>

			<!-- 固定底部按钮 -->
			<view class="fix-bar">
				<view class="feeddback" @click="onFeedback">
					<image class="feedback-icon" :src="imgUrl + 'volumePricing/vp_feedback.png'" />
					<text>反馈</text>
				</view>
				<view class="btn-apply" @click="onApply">立即申请</view>
			</view>
		</view>

		<!-- 活动预约 -->
		<vpPopup
			v-if="isPopupVisible"
			:isUser="isUser"
			:vehicleNumberList="vehicleNumberList"
			:routes="discountInfo.secList"
			:isChecked="isChecked"
			@close="handleClosePopup"
			@onConfirm="handleConfirm"
			@onProtocol="onProtocol"
		/>

		<!-- 协议弹窗 -->
		<protocol v-if="isProtocolVisible" @close="handleCloseProtocol" @onConfirmProtocol="onConfirmProtocol" />

		<!-- 完善信息遮罩 -->
		<up-popup :show="isPopupVisibleInfo" mode="center" :safeAreaInsetBottom="false">
			<view class="popup1">
				<view class="popup-header">完善信息</view>
				<view class="popup-text">本次活动需完善身份信息后方可参与活动，享受优惠～</view>
				<view class="btn-box">
					<view class="cancel-btn" @tap="cancelEvt">取消</view>
					<view class="sure-btn" @tap="sureEvt">去完善</view>
				</view>
			</view>
		</up-popup>

		<!-- 审核中弹窗 -->
		<up-popup :show="isshPopup" mode="center" :safeAreaInsetBottom="false">
			<view class="popup1">
				<view class="popup-header">完善信息</view>
				<view class="popup-text">身份信息审核中，请等待审核通过～</view>
				<view class="btn-box">
					<view class="cancel-btn" @tap="canceshlEvt">取消</view>
					<view class="sure-btn" @tap="sureEvt">去查看</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { onLoad, onShow, onPageScroll } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
import { yldjHighSpeedRoad, yldjUser, yldjEnterprise, yldjDiscountApply } from '@/api/volumePricing';
import protocol from '../../components/protocol.vue';
import vpPopup from '../../components/vpPopup.vue';
import { showToast, showToastSuccess, showLoading, hideLoading } from '@/utils/util';
import { toNav, toRec } from '@/utils/route';
type AnyObj = Record<string, any>;

const id = ref<string>('');
const vehicleType = ref<string>('');

const isPopupVisible = ref<boolean>(false);
const isProtocolVisible = ref<boolean>(false);
const isPopupVisibleInfo = ref<boolean>(false);
const isshPopup = ref<boolean>(false);

const statusBarHeight = ref<number>(0);
const titleBarHeight = ref<number>(0);
const showHeader = ref<boolean>(false);

const isChecked = ref<boolean>(false); // 是否勾选
const isComplete = ref<boolean>(false); // 是否完善信息

const isUser = ref<number>(0); // 1有用户信息/后续会被 onApply 重置为 0~3
const isEnterprise = ref<number>(0); // 1有企业信息

const isUserSuccess = ref<number>(0);
const isEnterpriseSuccess = ref<number>(0);

const vehicleNumberList = ref<any[]>([]);
const bannerImgs = ref<string[]>([`${imgUrl}volumePricing/banner.png`]);

const mapImg = ref<string>('/assets/highway-map.png');
const sections = ref<any[]>([]);
const discountInfo = ref<AnyObj>({});
const joinRules = ref<string>('');
const certRules = ref<string>('');
const navBarHeight = ref(0);
/** ============== 生命周期 ============== */
onMounted(() => {
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44 是默认导航栏高度
});
onLoad((options: AnyObj) => {
	uni.removeStorageSync('carList');

	id.value = options?.id || '';
	vehicleType.value = options?.vehicleType || '';

	// 这里按你原逻辑从 globalData 取
	const app = getApp() as any;
	statusBarHeight.value = app?.globalData?.statusBarHeight || 0;
	titleBarHeight.value = app?.globalData?.titleBarHeight || 0;

	getyldjHighSpeedRoad();
	getyldjUser();
	getyldjEnterprise();
});

onShow(() => {
	vehicleNumberList.value = uni.getStorageSync('carList') || [];
	console.log('传来的选中的参数:', vehicleNumberList.value);
});

onPageScroll((e: { scrollTop: number }) => {
	showHeader.value = e.scrollTop >= 200;
});

/** ============== 事件 ============== */

function onApply() {
	// 保留你原来的计算方式
	let data = 0;
	const _isUser = isUser.value;
	const _isEnterprise = isEnterprise.value;

	if (_isUser) {
		data = _isEnterprise ? 3 : 1;
	} else {
		data = _isEnterprise ? 2 : 0;
	}
	isUser.value = data;
	uni.setStorageSync('isUser', isUser.value);
	console.log('99+6+', isUserSuccess.value);
	console.log('99+6+4', isEnterpriseSuccess.value);
	console.log('99+6+4+5', _isUser);
	console.log('99+6+4+5+6', _isEnterprise);
	if (isUserSuccess.value || isEnterpriseSuccess.value) {
		isPopupVisible.value = true;
	} else if (_isUser || _isEnterprise) {
		isshPopup.value = true;
	} else {
		isPopupVisibleInfo.value = true;
	}
}

// 勾选协议
function onConfirmProtocol(val: boolean) {
	isChecked.value = val;
}

function onFeedback() {
	uni.navigateTo({
		url: '/pages_D/volumePricing/feedbackList/index',
	});
}

function handleShowPopup() {
	isPopupVisible.value = true;
}
function handleClosePopup() {
	isPopupVisible.value = false;
}
function handleCloseProtocol() {
	isProtocolVisible.value = false;
}

// 协议弹窗
function onProtocol() {
	if (!isChecked.value) isProtocolVisible.value = true;
}

// 确认申请（保持你原来入参结构：item.detail）
const handleConfirm = async (item: AnyObj) => {
	console.log('已选:', item);
	console.log('已选车辆:', item?.detail?.vehicleNumberList);
	console.log('已选路段:', item?.routes);

	if (!isChecked.value) {
		isProtocolVisible.value = true;
		return;
	}
	if (!item?.routes || item.routes.length === 0) {
		showToast('请选择路段');
		return;
	}
	const carList = uni.getStorageSync('carList') || [];
	if (carList.length === 0) {
		showToast('请选择车辆');
		return;
	}

	const params = {
		id: discountInfo.value?.id,
		highId: discountInfo.value?.highId,
		vehicleNumberList: carList,
		roadSecList: item.routes,
		userType: uni.getStorageSync('selectBindType'),
	};
	console.log('chuancan', params);
	try {
		const res = await yldjDiscountApply(params);
		console.log('申请成功', res);
		showToast(res.resultMsg || '');
		handleClosePopup();
	} catch (e) {
		console.log('申请失败', e);
	}
};

// 关闭信息审核提示弹窗
const canceshlEvt = () => {
	isshPopup.value = false;
};

// 完善、查看用户信息
const sureEvt = () => {
	uni.navigateTo({
		url: `/pages_D/volumePricing/improve/index?id=${id.value}`,
	});
	isPopupVisibleInfo.value = false;
};

// 关闭用户信息提示弹窗
const cancelEvt = () => {
	isPopupVisibleInfo.value = false;
};

/** ============== 接口 ============== */

// 获取活动数据
const getyldjHighSpeedRoad = async () => {
	const params = { id: id.value };
	const res = await yldjHighSpeedRoad(params);
	console.log('查询的活动详情', res);
	discountInfo.value = res.clazz[0] || {};
};

// 用户信息
const getyldjUser = async () => {
	const params = {};
	const res = await yldjUser(params);
	console.log('查询的用户信息', res);
	const auditStatus = res?.clazz?.user?.auditStatus;
	const success = auditStatus === '02' ? 1 : 0;

	isComplete.value = !!res?.clazz;
	isUserSuccess.value = success;
	isUser.value = res?.clazz?.user ? 1 : 0;
};

// 企业信息
const getyldjEnterprise = async () => {
	const params = { pageNum: 1, pageSize: 1000 };
	const res = await yldjEnterprise(params);
	console.log('查询的企业数据', res);
	const first = res?.page?.records?.[0];
	const success = first?.auditStatus === '02' ? 1 : 0;

	isEnterprise.value = res?.page?.records?.length > 0 ? 1 : 0;
	isEnterpriseSuccess.value = success;
};
</script>

<style lang="scss" scoped>
.page {
	background-color: #000;
	min-height: 100vh;
}

.status-bar-height {
	width: 100%;
	background-color: #fff;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9;
	display: flex;
	justify-content: flex-start;
}

.back-icon {
	width: 20rpx;
	height: 35rpx;
	position: absolute;
	bottom: 16rpx;
	left: 14rpx;
	margin-left: 15rpx;
}

.header-title {
	position: absolute;
	bottom: 16rpx;
	left: 50%;
	transform: translateX(-50%);
	font-size: 32rpx;
}

.header-title-n {
	position: fixed;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	font-size: 32rpx;
	z-index: 10;
	padding-top: 110rpx;
}

.container-details {
	width: 100%;
	background: #f6f7fb;
	border-radius: 20rpx 20rpx 0 0;
	margin-top: -20rpx;
	position: relative;
}

.banner {
	width: 750rpx;
	height: 400rpx;
}

.banner-img {
	width: 100%;
	height: 100%;
	display: block;
}

.card {
	margin: 0 24rpx;
	border-radius: 16rpx;
	padding: 44rpx 20rpx 30rpx;
}

.status-row {
	margin-bottom: 8rpx;
	display: flex;
	align-items: flex-start;
}

.going-icon {
	width: 99rpx;
	height: 38rpx;
	margin-right: 18rpx;
	margin-top: 8rpx;
}

.title {
	font-size: 36rpx;
	color: #77757d;
	font-weight: 500;
}

.p-lr-40 {
	padding: 0 40rpx;
}

.subline {
	color: #a2a2a2;
	font-size: 24rpx;
	margin-left: 12rpx;
}

.sub-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 32rpx;
}

.price-row {
	display: flex;
	align-items: center;
}

.price {
	color: #ec4e4c;
	font-size: 40rpx;
	margin-bottom: 10rpx;
}

.unit {
	color: #ec4e4c;
	font-size: 24rpx;
}

.sub-info {
	color: #a2a2a2;
	font-size: 20rpx;
	display: flex;
}

.sub-line {
	width: 1rpx;
	height: 22rpx;
	background: #a2a2a2;
	margin: 0 39rpx 0 29rpx;
}

.chips {
	height: 70rpx;
	line-height: 70rpx;
	border-radius: 15rpx;
	background: #eaf2ff;
	display: flex;
	align-items: center;
	margin-top: 30rpx;
	flex-wrap: wrap;
	padding-left: 23rpx;
}

.car-icon {
	width: 37rpx;
	height: 37rpx;
	margin-right: 10rpx;
}

.chip {
	color: #515a6e;
	font-size: 24rpx;
}

.meta {
	margin-top: 12rpx;
	padding-top: 8rpx;
}

.meta-row {
	display: flex;
	font-size: 24rpx;
	padding: 6rpx 0;
}

.time-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 12rpx;
}

.meta-val {
	color: #a2a2a2;
	font-size: 24rpx;
	flex: 1;
}

.section {
	padding: 0 45rpx 48rpx;
	background: #ffffff;
}

.section-hd {
	display: flex;
	align-items: center;
	padding: 28rpx 0 20rpx;
}

.dot-icon {
	width: 22.46rpx;
	height: 22.46rpx;
	margin-right: 14.54rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #000000;
}

.table {
	overflow: hidden;
	border: 1rpx solid #d4eaff;
}

.tr {
	display: grid;
	grid-template-columns: 1fr 240rpx;
}

.td {
	font-size: 28rpx;
	text-align: center;
}

.trs .td {
	color: #34261e;
	padding: 27rpx 24rpx;
}

.td-r {
	border-left: 1rpx solid #d4eaff;
}

.th {
	background: #399ffe;
	color: #ffffff;
	font-size: 28rpx;
}

.th .td {
	padding: 15rpx 24rpx;
}

.zebra .td {
	background: #eef4fd;
}

.para {
	color: #393939;
	font-size: 26rpx;
	line-height: 38rpx;
}

.map-card {
	height: 342rpx;
	border-radius: 20rpx;
	background: #f7f8fd;
	padding: 24rpx;
	box-sizing: border-box;
}

.map {
	width: 100%;
	height: 100%;
}

/* 底部固定按钮 */
.fix-bar {
	height: 160rpx;
	background: #ffffff;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 30rpx 50rpx 30rpx auto;
	box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.feeddback {
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 24rpx;
	color: #787878;
	margin-left: 70rpx;
}

.feedback-icon {
	width: 45rpx;
	height: 45rpx;
	margin-bottom: 5rpx;
}

.btn-apply {
	width: 417rpx;
	height: 100rpx;
	border-radius: 46rpx;
	background: linear-gradient(180deg, #f7b77f 0%, #ec8733 100%), #ff6503;
	line-height: 100rpx;
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
	position: absolute;
	right: 50rpx;
	bottom: 30rpx;
	text-align: center;
}

.popup1 {
	width: 615rpx;
	border-radius: 16rpx;
	padding: 40rpx;
	box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
	box-sizing: border-box;
}

.popup-header {
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
	word-break: break-all;
}

.popup-content {
	height: 600rpx;
	overflow-y: auto;
}

.btn-box {
	display: flex;
	margin-top: 36rpx;
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
