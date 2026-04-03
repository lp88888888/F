<template>
	<view class="page" :data-theme="pageTheme" >
		<!-- 顶部状态块 -->
		<view class="status-wrap">
			<view class="status-bar">
				<image class="back-icon" @click="ongoback" :src="`${imgUrl}trip-pro/arrow-left-icon.png`" />
			</view>
			<view class="nav">
				<view class="status-title">{{orderifno.orderStatusDesc}}</view>
				<view class="status-sub">{{orderifno.orderStatusDesc||'若超过30分钟酒店未确认，请您联系客服'}}</view>
				<view class="btn-cancel" v-if="orderifno.orderStatus==1||orderifno.orderStatus==0" @click="onCancel">
					取消订单</view>
				<view class="btn-cancel" v-if="orderifno.orderStatus==3&&orderifno.isCommented!=1" @click="onpingjia">
					去评价</view>
			</view>
		</view>

		<view class="content">
			<!-- 入住说明 -->
			<view class="row between">
				<view class="cell" @click="onShowCheckinNote">
					<text class="tag">入住说明</text>
					<text class="desc">更改预定订单请电话联系商家</text>
					<!-- <image class="more-icon" :src="`${imgUrl}trip-pro/arrow-right-icon.png`" /> -->
				</view>
			</view>

			<!-- 支付金额 -->
			<view class="pay-row">
				<view>
					<!-- <text class="pay-label">在线支付</text> -->
					<!-- <text class="pay-amount">¥ {{ orderifno.payAmount }}</text> -->
				</view>
				<!-- <view @click="onShowFee">
					<text class="pay-more">费用明细</text>
					<image class="more-icon" :src="`${imgUrl}trip-pro/more_o.png`" />
				</view> -->
			</view>

			<!-- 酒店信息卡片 -->
			<view class="ht-info">
				<view class="hotel-card">
					<image class="hotel-img" :src="orderifno.mainImage[0]" mode="aspectFill" />
					<view class="hotel-info">
						<view class="hotel-name">{{ orderifno.hotelName}}</view>
						<view class="hotel-addr">{{ orderifno.address }}</view>
					</view>
				</view>

				<view class="row btn-row">
					<view class="btn ghost" @click="onCall">联系电话</view>
					<view class="btn primary" @click="onMap">地图导航</view>
				</view>

				<!-- 房型与入住信息 -->
				<view>
					<view class="section-title">{{ orderifno.roomTypeName }}</view>
					<view class="subline">{{ orderifno.checkInDate }}至{{ orderifno.checkOutDate }}
						共{{ orderifno.stayDays }}晚</view>
					<view class="tags">
						<text class="tag-chip">{{ orderifno.hotelRoomTypeInfo.bedType }}</text>
						<text class="tag-chip">{{ orderifno.hotelRoomTypeInfo.area }}㎡</text>
						<!-- <text class="tag-chip">2人入住</text> -->
						<text class="tag-chip" v-if="orderifno.hotelRoomTypeInfo.breakfast != null">含早</text>
						<text class="tag-chip">{{orderifno.hotelRoomTypeInfo.hasWindowsDesc}}</text>
					</view>
					<view class="kv">
						<view class="kv-label">入住人</view>
						<text class="kv-v">{{ orderifno.guestName }}</text>
					</view>
					<view class="kv" @click="onCall">
						<view class="kv-label">联系方式</view>
						<text class="kv-v">{{ orderifno.guestPhone }}</text>
					</view>
					<view class="kv">
						<view class="kv-label">预计到店</view>
						<text class="kv-v">{{ orderifno.checkInDate }}</text>
					</view>
				</view>
			</view>

			<!-- 订单信息 -->
			<view class="order-card">
				<view class="order-name">订单信息</view>
				<view class="kv">
					<view class="kv-label">订单编号</view>
					<view class="kv-v row flex-1">
						<text selectable="true">{{ orderifno.orderNo }}</text>
					</view>
					<text class="copy" @click="onCopy">复制</text>
				</view>
				<view class="kv">
					<view class="kv-label">下单时间</view>
					<text class="kv-v">{{ orderifno.orderTime }}</text>
				</view>
				<!-- <view class="kv">
					<view class="kv-label">支付时间</view>
					<text class="kv-v">{{ orderifno.payTime }}</text>
				</view>
				<view class="kv">
					<view class="kv-label">支付方式</view>
					<text class="kv-v">{{ orderifno.payTypeDesc }}</text>
				</view> -->
			</view>

			<!-- 	<view class="safe-bottom">
				<view class="safe-bottom-tk" @click="totk">申请退款</view>
			</view> -->
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { getmerchantOrderdetail } from '@/api/hotel'
	import { openAPPLocation,openLocation,makePhoneCall } from '@/utils/util';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	// 数据
	const price = ref<number>(268)
	const checkinNote = ref<string>('4月10日 18:00前可免费取消')
	const hotel = ref({
		name: '桔子酒店（西安高新广电路店）',
		addr: '西安市雁塔区西沣路58号',
		img: 'https://img.yzcdn.cn/vant/cat.jpeg'
	})
	const stayDate = ref<string>('4月10日至4月11日')
	const nights = ref<number>(1)
	const guestName = ref<string>('张三')
	const phone = ref<string>('18392039383')
	const eta = ref<string>('4月10日17:00之前')
	const orderNo = ref<string>('JD202504108153154')
	const createTime = ref<string>('2025-04-10 11:36:27')
	const payTime = ref<string>('2025-04-10 11:36:27')
	const orderifno = ref({})
	// 方法
	const onCancel = () => {
		uni.navigateTo({
			url: `/pages_B/hotel/orderCancel?id=${orderifno.value.id}`,
		})
	}
	const ongoback = () => {
		uni.navigateBack()
	}
	const onpingjia = () => {
		uni.navigateTo({
			url: `/pages_B/hotel/orderEvaluate?id=${orderifno.value.id}`,
		})
	}
	const orderid = ref<string>('')
	onLoad((options) => {
		console.log(options, 'options')
		orderid.value = options.id; // 修正了这一行
	})
	onShow(()=>{
		getInfo();
	})
	const getInfo = () => {
		getmerchantOrderdetail(orderid.value).then(res => {
			console.log(res, 'res')
			orderifno.value = res.data
			if (orderifno.value.mainImage) {
				orderifno.value.mainImage = orderifno.value.mainImage.split(',')
			} else {
				orderifno.value.mainImage = []
			}
		})
	}
	const onShowCheckinNote = () => {
		uni.showToast({ title: '入住说明', icon: 'none' })
	}

	const onShowFee = () => {
		uni.showToast({ title: '费用明细', icon: 'none' })
	}
	const totk = () => {
		uni.navigateTo({
			url: `/pages_B/hotel/odertk?id=${orderifno.value.id}&payAmount=${orderifno.value.payAmount}`,
		})
	}
	const onCopy = () => {
		uni.setClipboardData({
			data: orderNo.value,
			success: () => {
				uni.showToast({ title: '已复制', icon: 'success' })
			}
		})
	}

	const onCall = () => {
		makePhoneCall(phone.value)
	}

	const onMap = () => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": orderifno.value.longitude,
					"latitude": orderifno.value.latitude,
					"address": orderifno.value.address
				}
			}
			openAPPLocation(navigationInfo)
		} else {
			openLocation({
				latitude: orderifno.value.latitude,
				longitude: orderifno.value.longitude,
				name: orderifno.value.hotelName,
				address: orderifno.value.address,
				scale: 16
			})
		}
		// 演示坐标，实际应从接口获取

	}
</script>

<style scoped>
	.page {
		background: var(--head-color);
		min-height: 100vh;
		padding-bottom: 40rpx;
		color: #333;
	}

	.content {}

	.status-wrap {
		background: var(--head-color);
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
		color: var(--primary-color);
	}

	.pay-more {
		font-weight: 500;
		font-size: 28rpx;
		color: var(--primary-color);
	}

	.ht-info {
		padding: 40rpx 32rpx;
		margin-top: 24rpx;
		background: #ffffff;
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

	.btn+.btn {
		margin-left: 20rpx;
	}

	.ghost {
		width: 328rpx;
		height: 80rpx;
		background: var(--label-color);
		border-radius: 8rpx;
		font-weight: 400;
		font-size: 32rpx;
		color: #492900;
		line-height: 80rpx;
	}

	.primary {
		width: 328rpx;
		height: 80rpx;
		background: var(--primary-color);
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
		color: var(--primary-color);
		font-size: 28rpx;
	}

	.safe-bottom {
		height: 88rpx;
		background-color: #fff;
		display: flex;
		padding: 20rpx;
		flex-direction: row-reverse;
		align-items: center;
		margin-top: 30rpx;

		.safe-bottom-tk {
			width: 200rpx;
			text-align: center;
			height: 72rpx;
			background-color: var(--primary-color);
			color: #fff;
			box-sizing: border-box;
			border-radius: 32rpx;
			line-height: 72rpx;
		}
	}
</style>