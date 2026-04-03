<template>
	<view class="page">
		<!-- 顶部状态块 -->
		<view class="status-wrap">
			<view class="status-bar">
				<image class="back-icon" @click="ongoback" :src="`${imgUrl}trip-pro/arrow-left-icon.png`" />
				<view class="tit-hea" v-if="orderifno.payStatus == 0"> 待支付 </view>
				<view class="tit-hea" v-if="orderifno.payStatus == 1"> 已支付 </view>
				<view class="tit-hea" v-if="orderifno.payStatus == 2"> 已取消 </view>
				<view class="tit-hea" v-if="orderifno.payStatus == 3"> 退款中 </view>
				<view class="tit-hea" v-if="orderifno.payStatus == 4"> 已退款 </view>
			</view>
		</view>
		<image class="be-ji-icon" :src="`${imgUrl}cd-d-bj-icon.png`" />
		<view class="content">
			<view class="content-1" v-if="orderifno.payStatus == 4 || orderifno.payStatus == 3 || orderifno.payStatus == 5">
				<view class="content-1-z" v-if="orderifno.payStatus == 4"> 退款审核：已通过 </view>
				<view class="content-1-z" v-if="orderifno.payStatus == 5"> 退款审核：未通过 </view>
				<view class="content-1-z" v-if="orderifno.payStatus == 3"> 退款审核：审核中，请耐心等待～ </view>
			</view>
			<view class="content-1" style="z-index: 999">
				<view class="content-1-1">
					{{ orderifno.orderTitle }}
				</view>
				<view class="content-1-2" style="z-index: 999">
					<image class="mao-icon" :src="`${imgUrl}jiayou-icon-map.png`" />
					{{ orderifno.baseOrderInfoResponse.address }}
				</view>
				<view class="content-1-2">
					<image class="mao-icon" :src="`${imgUrl}jiayou-icon-map.png`" />
					联系电话｜{{ orderifno.userPhone }}
				</view>
			</view>
			<view class="content-2">
				<view class="content-2-1"> 加油信息 </view>
				<view class="content-2-2">
					<text class="content-2-leb">能源类型 </text>
					<text class="content-2-val">{{ orderifno.baseOrderInfoResponse.oilName }} </text>
				</view>
				<view class="content-2-2">
					<text class="content-2-leb"> 油枪号 </text>
					<text class="content-2-val"> {{ orderifno.baseOrderInfoResponse.oilGun }}号 </text>
				</view>
				<view class="content-2-2">
					<text class="content-2-leb"> 规格</text>
					<text class="content-2-val"> {{ orderifno.baseOrderInfoResponse.totalLitre }}L</text>
				</view>
			</view>
			<view class="content-2">
				<view class="content-2-1"> 费用信息 </view>
				<view class="content-2-2">
					<text class="content-2-leb">标准价 </text>
					<text class="content-2-val">{{ orderifno.baseOrderInfoResponse.officialPrice }}元 </text>
				</view>
				<view class="content-2-2">
					<text class="content-2-leb"> 站点价 </text>
					<text class="content-2-val"> {{ orderifno.baseOrderInfoResponse.stationPrice }}元 </text>
				</view>
				<view class="content-2-2">
					<text class="content-2-leb"> 费用金额</text>
					<text class="content-2-val"> {{ orderifno.baseOrderInfoResponse.payableAmount }}元</text>
				</view>
			</view>
			<view class="content-2">
				<view class="content-2-1"> 订单信息 </view>
				<view class="content-2-2">
					<text class="content-2-leb">订单编号 </text>
					<text class="content-2-val">{{ orderifno.id }} </text>
				</view>
				<view class="content-2-2">
					<text class="content-2-leb"> 下单时间 </text>
					<text class="content-2-val"> {{ orderifno.createTime }} </text>
				</view>
				<view class="content-2-2">
					<text class="content-2-leb"> 支付时间 </text>
					<text class="content-2-val"> {{ orderifno.payTime }} </text>
				</view>
			</view>
			<!-- 酒店信息卡片 -->
		</view>
		<up-overlay :show="show" @click="show = false">
			<view class="warp">
				<view class="text-1">申请开票</view>
				<view class="text-2">暂时无法提供线上开票功能请去站点现场沟通索取发票，过期无法支持回溯开票。？</view>
				<view style="display: flex; align-items: center; justify-content: space-between">
					<view class="bnt-1" @click="show = false">取消</view>
					<view @click="goMap1" class="bnt-2">导航到店</view>
				</view>
			</view>
		</up-overlay>
		<view class="safe-bottom">
			<view class="btn-foot" v-if="orderifno.payStatus == 1" @click="togotuikuan"> 申请退款 </view>
			<view class="btn-foot" v-if="orderifno.payStatus == 5" @click="togotuikuan"> 再次申请 </view>
			<!-- <view class="btn-foot" v-if="orderifno.payStatus == 1" @click="show = true"> 申请开票 </view> -->
			<view class="btn-foot" v-if="orderifno.payStatus == 0" @click="handleCancelOrder"> 取消订单 </view>
			<view class="btn-foot1" v-if="orderifno.payStatus == 0" @click="togopay"> 去支付 </view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
import { getpayOrderInfodel, postpayGasStationOrderinfo } from '@/api/index';
import { openLocation,makePhoneCall } from '@/utils/util';
// 数据
const price = ref<number>(268);
const checkinNote = ref<string>('4月10日 18:00前可免费取消');
const hotel = ref({
	name: '桔子酒店（西安高新广电路店）',
	addr: '西安市雁塔区西沣路58号',
	img: 'https://img.yzcdn.cn/vant/cat.jpeg',
});
const stayDate = ref<string>('4月10日至4月11日');
const nights = ref<number>(1);
const guestName = ref<string>('张三');
const phone = ref<string>('18392039383');
const eta = ref<string>('4月10日17:00之前');
const orderNo = ref<string>('JD202504108153154');
const createTime = ref<string>('2025-04-10 11:36:27');
const payTime = ref<string>('2025-04-10 11:36:27');
const show = ref(false);
// 退款
const orderifno = ref({});
// 方法
const togotuikuan = () => {
	uni.navigateTo({
		url: '/pages_D/refuelingRefilling/orderCancel?id=' + orderid.value,
	});
};

const goMap1 = () => {
	openLocation({
		latitude: Number(item.latitude), //维度
		longitude: Number(item.longitude), //经度
		scale: 18, //缩放比例，范围5~18，默认为18
		name: item?.stationName,
	});
};
const handleCancelOrder = () => {
	postpayGasStationOrderinfo(orderid.value).then((res) => {
		if (res.code == 200) {
			uni.showToast({ title: '取消成功', icon: 'none' });
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages_D/refuelingRefilling/order',
				});
			}, 1500);
		} else {
			uni.showToast({ title: res.msg, icon: 'none' });
		}
	});
};
const togopay = () => {
	console.log(orderifno.value.baseOrderInfoResponse.payParam, 'orderifno.value.payParam');
	let obj = JSON.parse(orderifno.value.baseOrderInfoResponse.payParam);
	wx.navigateToMiniProgram({
		appId: obj.appId,
		path: obj.pageUrl,
		extraData: {},
		envVersion: 'release',
		success(res) {
			console.log('跳转成功', res);
		},
		fail(err) {
			console.error('跳转失败', err);
		},
	});
};
const ongoback = () => {
	uni.navigateBack();
};

const orderid = ref<string>('');
onLoad((options) => {
	orderid.value = options.id; // 修正了这一行
	getInfo();
});
const getInfo = () => {
	getpayOrderInfodel(orderid.value).then((res) => {
		orderifno.value = res.data;
		console.log(orderifno.value, 'orderifno.value');
		console.log(res, 'res');
	});
};
const onShowCheckinNote = () => {
	uni.showToast({ title: '入住说明', icon: 'none' });
};

const onShowFee = () => {
	uni.showToast({ title: '费用明细', icon: 'none' });
};

const onCopy = () => {
	uni.setClipboardData({
		data: orderNo.value,
		success: () => {
			uni.showToast({ title: '已复制', icon: 'success' });
		},
	});
};

const onCall = () => {
	makePhoneCall(phone.value)
};

const onMap = () => {
	// 演示坐标，实际应从接口获取
	openLocation({
		latitude: 34.201,
		longitude: 108.889,
		name: hotel.value.name,
		address: hotel.value.addr,
		scale: 16,
	});
};
</script>

<style scoped lang="scss">
.warp {
	width: 570rpx;
	height: 432rpx;
	background: linear-gradient(180deg, #c8fffd 0%, #ffffff 40%);
	border-radius: 24rpx 24rpx 24rpx 24rpx;
	padding: 50rpx;
	box-sizing: border-box;
	margin: 400rpx auto;
	z-index: -2;

	.text-1 {
		font-weight: 350;
		font-size: 32rpx;
		color: #333333;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.text-2 {
		font-weight: 350;
		font-size: 28rpx;
		color: #333333;
		text-align: center;
		margin-bottom: 48rpx;
	}

	.bnt-1 {
		width: 220rpx;
		height: 76rpx;
		background: #ffffff;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		border: 2rpx solid #00bebe;
		font-weight: 500;
		font-size: 28rpx;
		color: #00bebe;
		line-height: 76rpx;
		text-align: center;
	}

	.bnt-2 {
		width: 220rpx;
		height: 76rpx;
		background: #00bebe;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		font-weight: 500;
		font-size: 28rpx;
		color: #fff;
		line-height: 76rpx;
		text-align: center;
	}
}

.be-ji-icon {
	position: absolute;
	top: 180rpx;
	right: 0;
	width: 278rpx;
	height: 278rpx;
	z-index: 0;
}

.content-1-z {
	font-weight: 500;
	font-size: 28rpx;
	color: #333333;
}

.page {
	background: linear-gradient(180deg, #d1e5f9 0%, rgba(255, 255, 255, 0) 40%), #f8f9fb;
	background-size: 100% 100%, 100% 100%;
	background-repeat: no-repeat;
	min-height: 100vh;
	padding-bottom: 40rpx;
	color: #333;
}

.content-2 {
	padding: 30rpx;
	background: #ffffff;
	border-radius: 16rpx 16rpx 16rpx 16rpx;
	margin-top: 30rpx;
}

.content-2-1 {
	font-weight: 500;
	font-size: 28rpx;
	color: #333333;
	padding-bottom: 30rpx;
	border-bottom: 2rpx solid #ebebeb;
}

.content-2-2 {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 30rpx;

	.content-2-leb {
		font-weight: 400;
		font-size: 28rpx;
		color: #999999;
	}

	.content-2-val {
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}
}

.content-1 {
	margin-top: 30rpx;
	padding: 20rpx 30rpx;
	background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
	border-radius: 12rpx 12rpx 12rpx 12rpx;
}

.content-1-1 {
	font-weight: 500;
	font-size: 28rpx;
	color: #333333;
}

.content-1-2 {
	width: 400rpx;
	display: flex;
	align-items: center;
	font-weight: 500;
	font-size: 28rpx;
	color: #666;
	margin-top: 20rpx;

	.mao-icon {
		width: 28rpx;
		height: 29rpx;
		margin-right: 20rpx;
	}
}

.content {
	padding: 30rpx;
	margin-bottom: 120rpx;
}

.status-wrap {
	color: #663300;
	padding: 40rpx 40rpx 32rpx;
	text-align: left;
}

.nav {
	padding-top: 40rpx;
}

.status-bar {
	width: 100%;
	height: 60rpx;
	padding-top: 78rpx;
	text-align: left;
	display: flex;
	align-items: center;
}

.tit-hea {
	width: 650rpx;
	text-align: center;
}

.back-icon {
	width: 40rpx;
	height: 32rpx;
}

.order-name {
	font-weight: 600;
	font-size: 36rpx;
	color: #333333;
}

.status-title {
	font-weight: 600;
	font-size: 48rpx;
	color: #492800;
}

.status-sub {
	margin-top: 28rpx;
	font-weight: 400;
	font-size: 28rpx;
	color: #5b3200;
}

.btn-cancel {
	margin-top: 40rpx;
	height: 96rpx;
	background: #fff;
	border-radius: 48rpx;
	color: #333;
	font-size: 28rpx;
	text-align: center;
	line-height: 96rpx;
}

.row {
	display: flex;
	align-items: center;
}

.between {
	justify-content: space-between;
}

.right {
	text-align: right;
}

.row.between .cell {
	flex: 1;
	background: #fff;
	border-radius: 16rpx;
	padding: 32rpx;
	display: flex;
}

.cell .tag {
	font-weight: 600;
	font-size: 28rpx;
	color: #005fee;
	margin-right: 16rpx;
}

.cell .desc {
	font-weight: 400;
	font-size: 28rpx;
	color: #333333;
}

.more-icon {
	width: 22rpx;
	height: 22rpx;
	margin-left: 16rpx;
	margin-top: 4rpx;
}

.pay-row {
	background: #fff;
	border-radius: 16rpx;
	padding: 0 32rpx 32rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.pay-label {
	font-weight: 600;
	font-size: 40rpx;
	color: #333333;
	margin-right: 26rpx;
}

.pay-amount {
	font-weight: 600;
	font-size: 36rpx;
	color: #ff9000;
}

.pay-more {
	font-weight: 500;
	font-size: 28rpx;
	color: #ff9000;
}

.ht-info {
	padding: 40rpx 32rpx;
	margin-top: 24rpx;
}

.order-card {
	padding: 32rpx;
	background: #ffffff;
	margin-top: 24rpx;
}

.section-title {
	font-weight: 700;
	font-size: 32rpx;
	color: #333333;
}

.subline {
	margin-top: 24rpx;
	font-weight: 400;
	font-size: 28rpx;
	color: #666666;
}

.hotel-card {
	display: flex;
	align-items: center;
}

.hotel-img {
	width: 176rpx;
	height: 136rpx;
	border-radius: 8rpx;
	margin-right: 32rpx;
}

.hotel-info {
	flex: 1;
}

.hotel-name {
	font-weight: 600;
	font-size: 32rpx;
	color: #333333;
}

.hotel-addr {
	margin-top: 30rpx;
	font-weight: 400;
	font-size: 28rpx;
	color: #666666;
}

.btn-row {
	margin: 32rpx 0;
	padding-bottom: 32rpx;
	border-bottom: 2rpx solid rgba(0, 0, 0, 0.06);
}

.btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	text-align: center;
}

.btn + .btn {
	margin-left: 20rpx;
}

.ghost {
	width: 328rpx;
	height: 80rpx;
	background: rgba(255, 144, 0, 0.3);
	border-radius: 8rpx;
	font-weight: 400;
	font-size: 32rpx;
	color: #492900;
	line-height: 80rpx;
}

.primary {
	width: 328rpx;
	height: 80rpx;
	background: #ff9000;
	border-radius: 8rpx;
	font-weight: 400;
	font-size: 32rpx;
	color: #ffffff;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	margin-top: 24rpx;
	padding-bottom: 32rpx;
	border-bottom: 2rpx solid rgba(0, 0, 0, 0.06);
}

.tag-chip {
	border-radius: 999rpx;
	font-weight: 400;
	font-size: 28rpx;
	color: #666666;
	margin: 0 12rpx 0 0;
}

.kv {
	display: flex;
	align-items: center;
	margin-top: 24rpx;
	font-size: 26rpx;
}

.kv-label {
	width: 150rpx;
	font-weight: 400;
	font-size: 28rpx;
	color: #666666;
}

.kv-v {
	font-weight: 600;
	font-size: 28rpx;
	color: #666666;
}

.flex-1 {
	flex: 1;
}

.copy {
	color: #ff9600;
	font-size: 28rpx;
}

.safe-bottom {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 24rpx 32rpx;
	background: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
}

.btn-foot {
	width: 220rpx;
	height: 76rpx;
	background: #ffffff;
	border-radius: 48rpx 48rpx 48rpx 48rpx;
	border: 2rpx solid #00bebe;
	font-weight: 500;
	font-size: 28rpx;
	color: #00bebe;
	text-align: center;
	line-height: 76rpx;
	margin-right: 30rpx;
}

.btn-foot1 {
	width: 220rpx;
	height: 76rpx;
	background: #00bebe;
	border-radius: 48rpx 48rpx 48rpx 48rpx;
	font-weight: 500;
	font-size: 28rpx;
	color: #fff;
	text-align: center;
	line-height: 76rpx;
	margin-right: 30rpx;
}
</style>
