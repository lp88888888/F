<template>
	<view class="pagess" :data-theme="pageTheme">
		<up-navbar :title="statusObj[oinfo.payStatus].text" :bgColor="backgroundColor" @leftClick="toBack" placeholder
			:fixed="false"></up-navbar>
		<view class="topAbotBox"></view>

		<view class="topBox">
			<view v-if="oinfo.payStatus == 11" class="quBox">
				<view class="quBox-item" v-for="(item,index) in oinfo.baseOrderInfoResponse.voucher">
					<view style="border-bottom: 1px solid;">
						<image :src="item.voucherPic" class="img"></image>
					</view>
				</view>
				<view class="quBox-text">请识别二维码进入景区</view>
			</view>
			<view>
				<view class="fl-al-ce" v-if="oinfo.payStatus != 1">
					<!-- <up-icon name="checkmark-circle" color="#492800" size="28"></up-icon> -->
					<text class="statuText m-l-10">{{statusObj[oinfo.payStatus].text}}</text>
					<text v-if="oinfo.payStatus == 3" class="head_status-text">（退款提交后预计15个工作日内完成退款）</text>
				</view>
				<!-- <view class="mxText fl-al-ce m-t-30" v-if="oinfo.payStatus == 0">
					<text>剩余时间:</text>
					<up-count-down :time="30 * 60 * 1000" format="HH:mm:ss" autoStart millisecond @change="onChange">
						<view>
							<text class="mxText">{{ timeData.minutes }}分钟</text>
							<text class="mxText">{{ timeData.seconds }}秒</text>
						</view>
					</up-count-down>
				</view> -->
				<view class="mxText m-t-30" v-if="oinfo.payStatus == 6">订单已完成</view>
				<view class="mxText m-t-30" v-if="oinfo.payStatus == 3">您的订单正在退款中...</view>
				<view class="mxText m-t-30" v-if="oinfo.payStatus == 4">感谢您使用!</view>
				<view class="butslIst m-t-30" v-if="oinfo.payStatus == 0">
					<view class="butslIst-item but1" @click="cancelOrder">取消订单</view>
					<view class="butslIst-item but2" @click="toPay">去支付</view>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="fl-ce-sb">
				<up-image :src="detail.img" width="128rpx" height="128rpx" radius="4"></up-image>
				<view style="width: calc(100% - 158rpx);">
					<view class="nameBox">{{oinfo.orderTitle}}</view>
					<up-gap height="12"></up-gap>
					<view class="timeBox">{{oinfo?.baseOrderInfoResponse?.travelDate}}
						{{oinfo?.baseOrderInfoResponse?.travelDateName}}
					</view>
					<up-gap height="12"></up-gap>
					<view class="addrBox" v-if="oinfo?.baseOrderInfoResponse"> {{ JSON.parse(oinfo?.baseOrderInfoResponse?.timeSlot).startTime }}
						~{{ JSON.parse(oinfo.baseOrderInfoResponse.timeSlot).endTime }}入园</view>
				</view>
			</view>
			<view class="cardTwo m-t-40" v-if="oinfo?.baseOrderInfoResponse">
				<view class="cardTwo-item fl-ce-sb m-b-50">
					<view class="cardTwo-item-left">门票(成人票) X{{oinfo.baseOrderInfoResponse.quantity}}</view>
					<view class="cardTwo-item-right">
						<text class="dw">¥</text>
						<text class="itc">{{oinfo.baseOrderInfoResponse.totalPrice}}</text>
					</view>
				</view>

			</view>
			<view class="fl-ce-sb m-t-30" v-if="oinfo.payStatus != 1" style="padding: 0 20rpx;">
				<view>合计</view>
				<view class="totBox" v-if="oinfo?.baseOrderInfoResponse">
					<text class="totBox-dw">￥</text>
					<text class="totBox-pric">{{oinfo.baseOrderInfoResponse.totalPrice}}</text>
				</view>
			</view>
		</view>
		<view class="card" v-if="oinfo?.baseOrderInfoResponse">
			<view class="card-title  m-b-40">游客信息</view>
			<view class=" m-b-30" v-for="(item,index) in oinfo.baseOrderInfoResponse.payScenicSpotVisitorInfoList"
				:key="index">
				<view @click="openqr(item,oinfo.baseOrderInfoResponse.voucher[index])"
					v-if='oinfo.baseOrderInfoResponse.voucherType==1&&oinfo.payStatus == 1'
					style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<up-qrcode :cid="index+1" :size="120" :val="oinfo.baseOrderInfoResponse.voucher[index]"></up-qrcode>
					<view>请识别二维码进入景区</view>
				</view>
				<view class="labelBox1" style="margin-bottom: 20rpx;">{{item.name}}</view>
				<view class="labelCent "> {{item.certNo}}</view>
				<!-- <up-gap height="1" bgColor="rgba(0,0,0,0.06)"></up-gap> -->
			</view>

			<up-gap height="1" bgColor="rgba(0,0,0,0.06)"></up-gap>
			<view class="fl-al-ce m-t-30">
				<view class="labelBox1">联系手机号</view>
				<view class="labelCent m-l-40">{{oinfo?.baseOrderInfoResponse.mobile}}</view>
			</view>
		</view>
		<view class="card">
			<view class="card-title  m-b-40">订单信息</view>
			<view class="fl-al-ce m-t-30" style="justify-content: space-between;">
				<view class="labelBox2">订单编号 </view>
				<view class="labelCent m-l-40">{{oinfo.id}}</view>
			</view>
			<view class="fl-al-ce m-t-30" style="justify-content: space-between;">
				<view class="labelBox2">下单时间 </view>
				<view class="labelCent m-l-40">{{oinfo.orderTime}}</view>
			</view>
			<view class="fl-al-ce m-t-30" style="justify-content: space-between;">
				<view class="labelBox2">合计</view>
				<view class="labelCent m-l-40" v-if="oinfo.baseOrderInfoResponse">¥{{oinfo.baseOrderInfoResponse.totalPrice}}</view>
			</view>
			<view class="fl-al-ce m-t-30" style="justify-content: space-between;">
				<view class="labelBox2">优惠</view>
				<view class="labelCent m-l-40">¥0</view>
			</view>
			<view class="fl-al-ce m-t-30" style="justify-content: space-between;">
				<view class="labelBox2">应付</view>
				<view class="labelCent m-l-40" v-if="oinfo.baseOrderInfoResponse">¥{{oinfo.baseOrderInfoResponse.totalPrice}}</view>
			</view>
			<view class="fl-al-ce m-t-30" style="justify-content: space-between;" v-if="oinfo.payStatus == 5">
				<view class="labelBox2">驳回原因</view>
				<view class="labelCent m-l-40">{{oinfo.rejectReason}}</view>
			</view>
		</view>

		<up-popup :show="refundShow" @close="close" round="8">
			<view>
				<view class="paddBox fl-ce-sb">
					<up-icon name="close" size="20" color="#3D3D3D" @click="close"></up-icon>
					<view class="nameText">选择退款原因</view>
					<view class="subBox"></view>
				</view>
				<view class="selView">
					<view class="selectBox fl-ce-sb" v-for="(item,index) in labelList" :key="index"
						@click="labelClick(item)">
						<view class="selectBox-label">{{item.name}}</view>
						<up-icon v-if="item.name == selectLabel" :name="imgUrl+'del/select_true.png'"
							size="20"></up-icon>
						<up-icon v-else :name="imgUrl+'del/select_false.png'" size="20"></up-icon>
					</view>
					<view class="textView">退款原因<text>*</text></view>
					<view class="textArBox" style="">
						<textarea v-model="refundDescribed" placeholder="请填写退款原因"></textarea>
					</view>
				</view>

				<view class="fixBox fl-ce-sb" style="position: static;">
					<view>
						<view class="deaPric">
							<text class="fh">￥</text>
							<text class="num" v-if="oinfo.baseOrderInfoResponse">{{oinfo.baseOrderInfoResponse.totalPrice}}</text>
						</view>
						<up-gap height="8"></up-gap>
						<view class="yhText fs-24" style="color: #999999;">退款金额</view>
					</view>
					<view class="fixBut-1" style="background-color:#09BABE ;" @click="save">提交</view>
				</view>
			</view>
		</up-popup>

		<up-gap height="20"></up-gap>
		<!-- 底部 -->
		<template v-if="oinfo.payStatus == 10 || oinfo.payStatus == 11 || oinfo.payStatus == 12">
			<view class="fixBox fl-ce-sb">
				<view>
					<view class="deaPric">
						<text class="fh">￥</text>
						<text class="num">{{oinfo.baseOrderInfoResponse.totalPrice}}</text>
					</view>
				</view>
				<view class="fixBut-1" v-if="oinfo.payStatus == 10 || oinfo.payStatus == 11 || oinfo.payStatus == 12"  @click="refundShow=true">申请退款</view>
			</view>
			<up-gap height="80"></up-gap>
		</template>
		<up-overlay :show="isopenqr" @click="isopenqr = false">
			<view class="warp">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;color: #fff;">
					<up-qrcode cid="cid" :size="180" :val="openinfo.voucher"></up-qrcode>
					<view>{{openinfo.name}}</view>
					<view>{{openinfo.certNo}}</view>
				</view>
			</view>
		</up-overlay>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { onLoad, onShow, onPageScroll } from '@dcloudio/uni-app';
	import { getpayOrderInfo, postpayrefund, getpaycancel } from '@/api/scenicArea';
	const backgroundColor = ref<string>('transparent');
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = computed(() => {
		return themeStore.imgUrl
	})
	// 使用 reactive 创建响应式对象  
	const timeData = ref({});
	const oid = ref<string>('');
	const superReasonSelect = ref('');
	const oinfo = ref({
		payStatus:0
	});
	const isopenqr = ref(false);
	onLoad((opticon) => {
		if (opticon.id) {
			oid.value = opticon.id
		} else {
			oid.value = '10167202512161721161379926'
		}
	})
	onShow(()=>{
		getOrderInfo()
	})
	const openinfo = ref({})
	const openqr = (e, v) => {
		isopenqr.value = true
		openinfo.value.name = e.name
		openinfo.value.certNo = e.certNo
		openinfo.value.voucher = v
	}
	const toPay = ()=>{
		toNav('/pages_B/scenicSpotTicket/confirmOrder?id='+oid.value)
	}
	const cancelOrder = async () => {
		const res = await getpaycancel(oid.value)
		if (res.code == 200) {
			uni.showToast({
				title: '取消成功',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1000)
		}
	} 
	const save = async () => {
		if(!refundDescribed.value){
			uni.showToast({
				title: '未填写退款原因',
				icon: 'none'
			})
			return;
		}
		let params = {
			superId: oid.value,
			superReason: refundDescribed.value,
			superReasonSelect: selectLabel.value
		}
		const res = await postpayrefund(params)
		if (res.code == 200) {
			uni.showToast({
				title: '提交成功',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1000)
		}
	}
	const getOrderInfo = async () => {
		const res = await getpayOrderInfo(oid.value)
		console.log("景区详情", res)
		if (res.code == 200) {
			oinfo.value = res.data
		}
	}
	const statusObj = ref({
		0: { text: '待支付', color: '#00964E', bgColor: '#F0F8F4' },
		1: { text: '已支付', color: '#005FEE', bgColor: '#F0F6FE' },
		2: { text: '已取消', color: '#999999', bgColor: '#F9F9F9' },
		3: { text: '退款中', color: '#999999', bgColor: '#F9F9F9' },
		4: { text: '已退款', color: '#FF9000', bgColor: '#F9F9F9' },
		5: { text: '退款失败', color: '#005FEE', bgColor: '#F0F6FE' },
		6: { text: '已完成', color: '#FF9000', bgColor: '#FFF9F0' },
		10: { text: '出票中', color: '#00964E', bgColor: '#F0F8F4' },
		11: { text: '待核销', color: '#999999', bgColor: '#F9F9F9' },
		12: { text: '出票失败', color: '#999999', bgColor: '#F9F9F9' },
	})
	const refundShow = ref(false);
	const refundDescribed = ref('');

	const selectLabel = ref('');
	const labelList = ref([
		{ name: '与商家协商一致退款' },
		{ name: '退款时间内无理由退款' },
		{ name: '其他' },
	]);
	const navBgColor = ref('transparent');
	const detail = ref({
		name: '西安城墙 碑林历史文化景区',
		img: imgUrl + 'del/order-icon.png',
		createTime: '2025-04-22 11:37:36',
		status: 1,
		price: 156.0,
		text: '成人票2张，学生票1张'
	})
	// 定义 onChange 方法  
	const onChange = (e) => {
		timeData.value = e;
	};
	const close = () => {
		refundShow.value = false
	}
	const labelClick = (item) => {
		selectLabel.value = item.name
	}
	onPageScroll((e) => {
		if (e.scrollTop < 50) {
			navBgColor.value = 'transparent';
		} else {
			navBgColor.value = `#FFFFFF`;
		}
	})
</script>

<style lang="scss">
	@import url('./style.scss');
	.fixBut-1{
		width: 224rpx;
		height: 84rpx;
		background: #00BEBE;
		border-radius: 414rpx 414rpx 414rpx 414rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		line-height: 84rpx;
		text-align: center;
	}

	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	.pagess {
		background: var(--head-color);
	}
	// page {
	// 	background: linear-gradient(180deg, #D1E5F9 0%, #F8F9FB 96%);
	// 	background-repeat: no-repeat;
	// 	background-size: 100% 100%;
	// }

	.textArBox {
		margin-top: 25rpx;
		padding: 24rpx 32rpx;
		box-sizing: border-box;
		background: #FCFCFC;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		border: 2rpx solid #EBEBEB;
	}

	.textView {
		font-weight: 400;
		font-size: 32rpx;
		color: #333333;
		line-height: 48rpx;

		text {
			color: #FD4848;
		}
	}

	.selView {
		padding: 20rpx 40rpx;
		box-sizing: border-box;

		.selectBox {
			padding: 20rpx 0;
			box-sizing: border-box;
		}

		.selectBox-label {
			font-weight: 400;
			font-size: 32rpx;
			color: #333333;
			line-height: 48rpx;
		}
	}

	.time {
		@include flex;
		align-items: center;

		&__custom {
			margin-top: 4px;
			width: 22px;
			height: 22px;
			background-color: #FF9000;
			border-radius: 4px;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			justify-content: center;
			align-items: center;

			&__item {
				color: #fff;
				font-size: 12px;
				text-align: center;
			}
		}

		&__doc {
			color: $u-primary;
			padding: 0px 4px;
		}

		&__item {
			color: #606266;
			font-size: 15px;
			margin-right: 4px;
		}
	}

	.topAbotBox {
		height: 804rpx;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.topBox {
		padding: 40rpx;
		box-sizing: border-box;
	}

	.statuText {
		font-weight: 700;
		font-size: 32rpx;
		color: #492800;
		line-height: 48rpx;
	}
	.head_status-text{
		font-size: 24rpx;
		color: #999;
	}

	.quBox {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.quBox-item {
			padding: 14rpx;
			box-sizing: border-box;
			background: #FFFFFF;
			border-radius: 20rpx 20rpx 20rpx 20rpx;
			border: 4rpx solid #C27500;
		}

		.quBox-text {
			margin-top: 32rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #C27500;
			line-height: 28rpx;
		}
	}

	.butslIst {
		display: flex;
		align-items: center;
		justify-content: space-around;

		.butslIst-item {
			width: 312rpx;
			height: 96rpx;
			line-height: 96rpx;
			text-align: center;
			font-size: 36rpx;
			color: #333333;
			border-radius: 48rpx 48rpx 48rpx 48rpx;
		}

		.but1 {
			font-weight: 400;
			background: rgba(255, 255, 255, 0.9);
			border: 2rpx solid none;
		}

		.but2 {
			font-weight: 700;
			background: rgba(255, 144, 0, 0.6);
			border: 2rpx solid #FFFFFF;
		}
	}

	.mxText {
		font-weight: 400;
		font-size: 28rpx;
		color: #5B3200;
		line-height: 28rpx;
	}

	.nameBox {
		font-weight: 700;
		font-size: 32rpx;
		color: #333333;
		line-height: 36rpx;
	}

	.totBox {
		color: #FF9600;

		.totBox-dw {
			font-weight: 700;
			font-size: 28rpx;
			color: #FF9000;
			line-height: 28rpx;
			margin-right: 5rpx;
		}

		.totBox-pric {
			font-weight: 700;
			font-size: 36rpx;
			color: #FF9000;
			line-height: 48rpx;
		}
	}


	.timeBox {
		font-weight: 400;
		font-size: 24rpx;
		color: #666666;
		line-height: 24rpx;
	}

	.addrBox {
		font-weight: 700;
		font-size: 24rpx;
		color: #333333;
		line-height: 24rpx;
	}

	.card {
		margin: 30rpx;
		padding: 42rpx 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 48rpx;

		.card-title {
			font-weight: 700;
			font-size: 40rpx;
			color: #333333;
			line-height: 40rpx;
		}
	}

	.cardTwo {
		width: 100%;
		padding: 32rpx;
		box-sizing: border-box;
		background: rgba(0, 0, 0, 0.03);
		border-radius: 16rpx 16rpx 16rpx 16rpx;

		.cardTwo-item {

			.cardTwo-item-left {
				font-weight: 700;
				font-size: 28rpx;
				color: #333333;
				line-height: 28rpx;
			}

			.cardTwo-item-right {
				.dw {
					font-weight: 700;
					font-size: 28rpx;
					color: #333333;
					line-height: 28rpx;
					margin-right: 6rpx;
				}

				.itc {
					font-weight: 700;
					font-size: 36rpx;
					color: #333333;
					line-height: 48rpx;
				}
			}

		}

	}

	.labelBox1 {
		min-width: 90rpx;
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
	}

	.labelBox2 {
		min-width: 120rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #999999;
		line-height: 28rpx;
		text-align: right;
	}

	.labelCent {
		font-weight: 700;
	}

	.textBox {
		.textBox-label1 {
			width: 130rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;
			line-height: 28rpx;
		}

		.textBox-item {
			font-weight: 700;
		}
	}


	.butText {
		font-size: 32rpx;
		font-weight: normal;
		line-height: 32rpx;
		color: #333333;
	}
	.img{
		width: 340rpx;
		height: 340rpx;
	}
</style>