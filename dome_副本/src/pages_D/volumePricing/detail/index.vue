<template>
	<view class="container">
		<view class="station-info">
			<view class="info-content-1">
				<view class="info-content-2">
					<image :src="`${imgUrl}volumePricing/vp_enter.png`" class="enter-icon"></image>
					<text class="station-name">{{ infoData.inName }}收费站</text>
				</view>
				<!-- <text class="plate-number">{{ infoData.discount }}折</text> -->
			</view>
			<view class="info-content">入站时间：{{ infoData.inTime }}</view>
		</view>

		<view class="station-info">
			<view class="info-content-1">
				<view class="info-content-2">
					<image :src="`${imgUrl}volumePricing/vp_exit.png`" class="enter-icon"></image>
					<text class="station-name">{{ infoData.outName }}收费站</text>
				</view>
			</view>
			<view class="info-content">出站时间：{{ infoData.outTime }}</view>
		</view>

		<view class="gain"></view>

		<view class="list-odle">
			<view class="info-section">
				<view class="info-item">
					<text class="label">高速名称</text>
					<text class="value">{{ infoData.highName }}</text>
				</view>
				<view class="info-item discount1">
					<text class="label">车牌号</text>
					<text class="value">{{ infoData.vehicleNumber }}</text>
				</view>
				<view class="info-item">
					<text class="label">车辆类型</text>
					<text class="value">{{ vehicleTypeDisplay }}</text>
				</view>
				<view class="info-item">
					<text class="label">手机号</text>
					<text class="value">{{ infoData.mobile }}</text>
				</view>
			</view>

			<view class="cost-section">
				<view class="cost-item discount1">
					<view class="title-box" @tap="expansionEvt(0)">
						<view class="label"
							>应付金额
							<image :src="`${imgUrl}volumePricing/vp_up.png`" class="enter-icon"></image>
						</view>
					</view>
					<text class="value">¥{{ infoData.shouldPrice }}</text>
				</view>
				<view class="cost-item discount">
					<text class="label">优惠金额</text>
					<text class="value">¥{{ infoData.otherPrice }}</text>
				</view>
				<!-- <view class="cost-item discount">
					<text class="label">以量优惠金额</text>
					<text class="value">¥{{ infoData.yldjPrice }}</text>
				</view>
				<view class="cost-item">
					<text class="label">其他优惠金额</text>
					<text class="value">¥{{ infoData.otherPrice }}</text>
				</view> -->
				<view class="cost-item total">
					<text class="label">实付金额</text>
					<text class="value">¥{{ infoData.actualPrice }}</text>
				</view>
			</view>

			<view class="order-section">
				<view class="cost-item total">
					<view class="title-box" @tap="expansionEvt(1)">
						<view class="label"
							>实付金额
							<image :src="`${imgUrl}volumePricing/vp_drop.png`" class="enter-icon"></image>
						</view>
					</view>
					<text class="value">¥{{ infoData.actualPrice }}</text>
				</view>

				<view class="info-item">
					<text class="label">付款时间</text>
					<text class="value">{{ infoData.payTime }}</text>
				</view>
				<view class="info-item">
					<text class="label">订单状态</text>
					<text class="value">{{ infoData.orderStatus == 1 ? '已完成' : '未完成' }}</text>
				</view>
				<view class="info-item">
					<text class="label">订单编号</text>
					<text class="value">{{ infoData.orderCode }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
// 假设的 API 导入路径
// 这里的 dataApi.yldjyhInfo 对应 fetchDiscountInfo
// 这里的 dataApi.getgaosulist 对应 fetchVehicleTypeList
import { getgaosulist, yldjyhInfo, dictList } from '@/api/volumePricing';

// --- 接口类型定义 ---
interface DiscountInfo {
	inName: string;
	outName: string;
	inTime: string;
	outTime: string;
	discount: string;
	highName: string;
	vehicleNumber: string;
	mobile: string;
	shouldPrice: number;
	yldjPrice: number;
	otherPrice: number;
	actualPrice: number;
	payTime: string;
	orderStatus: 1 | 0;
	orderCode: string;
	vehicleType: string | number; // 车辆类型ID
	[key: string]: any; // 允许其他字段
}

// --- 状态数据定义 ---
const id = ref<number | string>(0);
const type = ref<string>(''); // 页面参数 type

const infoData = ref<Partial<DiscountInfo>>({}); // 详情数据
const vehicleTypeDisplay = ref<string>(''); // 车辆类型名称
const expansion = ref<number>(0); // 1展开；0合起

// --- 方法定义 ---

/** 获取申请详情 */
const getList = async () => {
	if (!id.value) return;

	const params = { id: id.value };

	try {
		const res = await yldjyhInfo(params);
		const data: DiscountInfo = res.clazz;
		infoData.value = data;

		// 获取车辆类型名称，使用 data.vehicleType 作为 ID
		if (data.vehicleType) {
			getTypeList(data.vehicleType);
		}
	} catch (message: any) {
		uni.showToast(message);
	}
};

/** 获取车辆类型名称 */
const getTypeList = async (vehicleTypeId: string | number) => {
	const params = { type: 11 };

	try {
		const res = await getgaosulist(params);
		const list: Array<{ data: string | number; name: string }> = res.clazz || [];

		// 查找匹配的车辆类型名称
		const foundType = list.find((item) => String(item.data) === String(vehicleTypeId));

		vehicleTypeDisplay.value = foundType ? foundType.name : '未知类型';
	} catch (message: any) {
		uni.showToast(message);
	}
};

/** 费用信息展开/收起切换 */
const expansionEvt = (type: number) => {
	expansion.value = type;
};

// --- 生命周期与页面事件 ---

onLoad((options) => {
	// 接收页面参数
	if (options?.id) {
		id.value = options.id;
		type.value = options.type || '';
		getList();
	} else {
		uni.showToast('缺少订单ID');
	}
});

// onMounted 可以在需要全局初始化时使用，但此页主要依赖 onLoad 参数，故省略。
</script>

<style scoped lang="scss">
page {
	background-color: #fff;
}

.container {
	background-color: #f8f8f8;
	min-height: 100vh;
}

/* 订单信息 */
.order-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 30rpx;
	border-bottom: 1rpx solid #f3f3f3;
	margin-bottom: 20rpx;
}

.order-number {
	font-size: 22rpx;
	color: #999;
}

.status {
	font-size: 28rpx;
	color: #1aad19;
}

.info-content-1 {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.info-content-2 {
	display: flex;
	align-items: center;
}

.station-icon {
	box-sizing: border-box;
	text-align: center;
	line-height: 34rpx;
	color: #fff;
	width: 34rpx;
	height: 34rpx;
	border-radius: 14rpx;
	opacity: 1;
	margin-right: 34rpx;
	background: #4c69ed;
	padding: 5rpx;
	font-size: 22rpx;
}

.station-icon2 {
	font-size: 22rpx;
	box-sizing: border-box;
	text-align: center;
	line-height: 34rpx;
	color: #fff;
	width: 34rpx;
	height: 34rpx;
	border-radius: 14rpx;
	opacity: 1;
	margin-right: 34rpx;
	background: #efbd59;
	padding: 5rpx;
}

/* 站点信息 */
.station-info {
	padding: 20rpx;
	background-color: #fff;
	border-radius: 10rpx;
}

.segment-info .icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 34rpx;
}

.info-content {
	margin-top: 2rpx;
	font-size: 28rpx;
	color: #adadad;
	margin-left: 54rpx;
}

.station-name {
	font-weight: 500;
	font-size: 30rpx;
	color: #3a3a3a;
}

.plate-number {
	font-size: 32rpx;
	color: #ff0000;
	font-weight: 700;
}

.gain {
	height: 20rpx;
	width: 100%;
	background: #f8f8fa;
}

/* 容器 */
.list-odle {
}

/* 信息部分 */
.info-section,
.cost-section,
.order-section {
	background-color: #fff;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
	padding: 48rpx 30rpx;
}

.info-item,
.cost-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: 400;
	font-size: 26rpx;
	color: #131313;
	padding: 10rpx 0;
}

.info-item:last-child,
.cost-item:last-child {
	border-bottom: none;
}

.label {
	color: #131313;
	font-size: 26rpx;
	line-height: 52rpx;
	width: 150rpx;
	text-align: left;
	display: flex;
	align-items: center;
}

.value {
	text-align: right;
	color: #6b7073;
	font-size: 28rpx;
	font-weight: 500;
}

/* 费用部分 */
.discount .label {
	color: #ff0cf3;
}

.discount .value {
	color: #ff0cf3;
}

.total .value {
	color: #ff4500;
	font-weight: 600;
}

.discount1 .value {
	font-size: 30rpx;
	color: #333;
	font-weight: 700;
}

.enter-icon {
	width: 34rpx;
	height: 34rpx;
	margin-right: 18rpx;
}

.title-box {
	display: flex;
	align-items: center;
}

.expansion-icon {
	width: 34rpx;
	height: 34rpx;
}
</style>
