<template>
	<view class="page" :data-theme="pageTheme">
		<!-- 头部背景色 -->
		<view class="bgcolor" :style="{ background: themeStore.themeColors.$pageheadbg }"></view>

		<up-navbar title="订单详情" bgColor="transparent" autoBack :placeholder="true" :fixed="false"></up-navbar>

		<scroll-view scroll-y="true" class="scrollview">
			<view class="scrollbox">
				<view class="head_status">{{ getStatustext(orderInfo.orderStatus) }} <text v-if="orderInfo.orderStatus == 3" class="head_status-text">（退款提交后预计15个工作日内完成退款）</text></view>

				<view class="info_box">
					<view class="info_1">
						<image class="info_img" :src="orderInfo.imagesContraction" mode=""></image>
						<view class="info_l">
							<text>{{ orderInfo.roadTripName }}</text>
							<text>自驾行</text>
						</view>
					</view>
					<view class="item_text">
						<text>行程时间</text>
						<text>{{ orderInfo.startDate }}（{{formatTimestamp(orderInfo.startDate,'week')}}）至 {{ orderInfo.endDate }}（{{formatTimestamp(orderInfo.endDate,'week')}}）</text>
					</view>
					<view class="item_text">
						<text>活动主题</text>
						<text>{{ orderInfo.roadTripName }}</text>
					</view>
					<view class="item_text">
						<text>出行人数</text>
						<text>{{ orderInfo.manNumber || 0 }}成人{{ orderInfo.childNumber ? orderInfo.childNumber + '儿童' : '' }}</text>
					</view>
					<view class="info_money">
						<text>订单金额：￥{{ orderInfo.payableAmount }}</text>
					</view>
				</view>

				<view class="user_box">
					<view class="user_title">联系人信息</view>
					<view class="item_text">
						<text>联系人</text>
						<text>{{ orderInfo.contactName }}</text>
					</view>
					<view class="item_text">
						<text>联系电话</text>
						<text>{{ orderInfo.contactPhone }}</text>
					</view>
					<view class="item_text">
						<text>订单编号</text>
						<text>{{ orderInfo.parentOrderId }}</text>
						<text class="btn" @click="copyText(orderInfo.parentOrderId)">复制</text>
					</view>
					<view class="item_text">
						<text>下单时间</text>
						<text>{{ orderInfo.createTime }}</text>
					</view>
					<view class="item_text" v-if="orderInfo.orderStatus == 5">
						<text>驳回原因</text>
						<text>{{ orderInfo.rejectionRefundDes }}</text>
					</view>
					
				</view>

				<view class="btns">
					<view class="" v-if="orderInfo.orderStatus == 6" @click="refundShow = true">退款</view>
					<view class="" v-if="orderInfo.orderStatus == 60" @click="cancelShow = true">取消</view>
					<view class="" v-if="orderInfo.orderStatus == 0" @click="payOrder">去支付</view>
					<view class="" @click="toNav('/pages_C/carOwner/carDetails?id='+orderInfo.roadTripId)">重新下单</view>
				</view>
			</view>
		</scroll-view>
		<up-modal :show="cancelShow" title="提示" content="您确定要对该订单申请取消吗？" :confirmColor="themeStore.themeColors.$primaryColor" @cancel="cancelShow=false" @confirm="cancelOrder" :showCancelButton="true"></up-modal>
		<up-modal :show="refundShow" title="提示" content="您确定要对该订单申请退款吗？" :confirmColor="themeStore.themeColors.$primaryColor" @cancel="refundShow=false" @confirm="refundOrder" :showCancelButton="true"></up-modal>
		<PageDurationTracker pageName="车主节订单详情" />
	</view>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { onLoad, onUnload,onShow } from '@dcloudio/uni-app';
import { toNav, toRec } from '@/utils/route';
import { imgUrl } from '@/config';
import { roadTripOrderDetails ,roadTripCancel,roadTripRefund} from '@/api/carOwner';
import { fetchWechatInfo } from '@/api/login';
import { copyText,formatTimestamp } from '@/utils/util';
import { postcreateOrder } from '@/api/scenicArea';
import { getDict } from '@/api/config'
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = computed(() => themeStore.imgUrl);
const cancelShow = ref(false);
const refundShow = ref(false);

const statusdata = ref([]);

const getStatustext = (value) => {
	let val = statusdata.value.find((e) => e.dictValue == value);
	if (val) return val.dictLabel;
	return '';
};

const carorderid = ref('');
const orderInfo = ref({});
const getDetail = async () => {
	try {
		const res = await roadTripOrderDetails(carorderid.value);
		console.log('车主节详情', res);
		orderInfo.value = res.data;
	} catch (e) {
		console.log('车主节详情错误', e);
	}
};
const payOrder = async (outTradeNo) => {
		// 增加数据校验
		if (!orderInfo.value?.roadTripName) {
			uni.showToast({ title: '订单信息加载中', icon: 'none' });
			return;
		}
		let params = {
			description: orderInfo.value.roadTripName,
			outTradeNo: orderInfo.value.parentOrderId,
			// totalAmount: 0.01,
			totalAmount: Number(orderInfo.value.payableAmount),
			// #ifdef MP-WEIXIN
				openId: openid.value
			// #endif
		}
		console.log('params', params);
		try {
			const res = await postcreateOrder(params);
			if (res.code==200) {
				console.log(res)
				// 1. 发起支付
				// 1.1 获取支付参数
				// 1.2 调起微信支付
				// 2. 调起微信支付
				uni.requestPayment({
					// #ifdef APP-PLUS
						provider: 'wxpay',
						orderInfo: {
							"appid": res.data.appId,        // 对应后端 appId
							"noncestr": res.data.nonceStr,  // 对应后端 nonceStr
							"package": res.data.packageVal, // 对应后端 packageVal
							"partnerid": res.data.partnerId,// 对应后端 partnerId
							"prepayid": res.data.prepayId,  // 对应后端 prepayId
							"timestamp": res.data.timeStamp,// 对应后端 timeStamp
							"sign": res.data.sign,// 对应后端 sign
						},
					// #endif
					// #ifdef APP-HARMONY
						provider: 'wxpay',
						orderInfo: JSON.stringify({
							"appid": res.data.appId,
							"noncestr": res.data.nonceStr,
							"package": res.data.packageVal,
							"partnerid": res.data.partnerId,
							"prepayid": res.data.prepayId,
							"timestamp": res.data.timeStamp,
							"sign": res.data.sign,
						}),
					// #endif
					// #ifdef MP-WEIXIN
						appId: res.data.appId,
						timeStamp: res.data.timeStamp,
						nonceStr: res.data.nonceStr,
						package: res.data.packageVal,
						paySign: res.data.paySign,
						signType: 'RSA',
					// #endif
						
					success: (payRes) => {
						uni.showToast({
							title: '支付成功',
							icon: 'none',
						});
						getDetail()
						// toRec('/pages_A/order/myorder');
					},
					fail: (err) => {
						console.error('支付失败', err)
						uni.showToast({ title: '支付失败', icon: 'error' })
					}
				})
			}
		} catch (error) {
			console.error('支付请求捕获错误', error)
			uni.showToast({ title: '请求失败', icon: 'error' })
		}
	
	};
	// 退款
	const refundOrder = async (type) =>{
		try {
			const res = await roadTripRefund({
				superId:orderInfo.value.parentOrderId,
				superReasonSelect:''
			});
			console.log("提交成功",res)
			uni.showToast({ title: '提交成功'})
			getDetail()
		} catch (err) {
			console.log("查询状态错误",err)
		}
		refundShow.value=false
	}
	// 取消
	const cancelOrder = async (type) =>{
		try {
			const res = await roadTripCancel(orderInfo.value.parentOrderId);
			console.log("取消成功",res)
			uni.showToast({ title: '取消成功'})
			getDetail()
		} catch (err) {
			console.log("查询状态错误",err)
		}
		cancelShow.value=false
	}
	// 查询状态
	const getLabel = async () => {
		try {
			const res = await getDict('road_trip_order_status');
			console.log("查询的状态",res)
			statusdata.value = res.data
		} catch (err) {
			console.log("查询状态错误",err)
		}
	}
	
	const openid = ref('')
	const getOpenId = async ()=>{
		try{
			const wxCode = await getWxLoginCode();
			console.log('获取到的wxCode', wxCode);
			const wxInfoResp : any = await fetchWechatInfo({ code: wxCode });
			console.log('微信信息响应', wxInfoResp);
			openid.value = wxInfoResp.clazz.openid
		}catch(err){
			openid.value = uni.getStorageSync('wxPayOpenid')
		}
		console.log('openidopenidopenidopenid', openid.value);
	}
	const getWxLoginCode = () : Promise<string> => {
		return new Promise((resolve, reject) => {
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				success: (res) => {
					if (res?.code) {
						resolve(res.code);
					} else {
						reject(new Error('未返回 code'));
					}
				},
				fail: (e) => {
					reject(e);
				},
			});
			// #endif
	
			// #ifndef MP-WEIXIN
			reject(new Error('非小程序环境'));
			// #endif
		});
	};
	onShow(() => {
		// #ifdef MP-WEIXIN
		getOpenId()
		// #endif
	});
	onLoad((e) => {
		console.log("接收的参数",e)
		carorderid.value = e.orderId;
		getDetail()
		getLabel()
	});
</script>

<style lang="scss" scoped>
view {
	box-sizing: border-box;
}
.page {
	width: 750rpx;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #f7f7f7;

	.bgcolor {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 448rpx;
		z-index: 0;
	}
	.scrollview {
		width: 750rpx;
		flex: 1 0;
		position: relative;
		z-index: 1;
		.scrollbox {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-bottom: 200rpx;
		}
	}

	.head_status {
		width: 690rpx;
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 30rpx;
		display: flex;
		align-items: center;
		.head_status-text{
			font-size: 24rpx;
			color: #999;
		}
	}

	.item_text {
		width: 100%;
		display: flex;
		margin-bottom: 20rpx;
		text:nth-child(1) {
			width: 130rpx;
			font-size: 28rpx;
			color: #999;
		}
		text:nth-child(2) {
			flex: 1 0;
			width: 0;
			font-size: 28rpx;
			// white-space: nowrap;
			// overflow: hidden;
			// text-overflow: ellipsis;
		}
		.btn {
			font-size: 20rpx;
			padding: 5rpx 10rpx;
			border: 2rpx solid #eee;
		}
	}

	.info_box {
		width: 690rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 8px;
		margin-bottom: 30rpx;
		.info_1 {
			width: 100%;
			display: flex;
			align-items: center;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #eee;
			margin-bottom: 30rpx;
			.info_img {
				width: 150rpx;
				height: 150rpx;
				background: sandybrown;
				border-radius: 4px;
				margin-right: 20rpx;
			}
			.info_l {
				width: 460rpx;
				height: 150rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				text:nth-child(1) {
					font-size: 32rpx;
					display: -webkit-box !important;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical !important;
				}
				> text:nth-child(2) {
					font-weight: 400;
					font-size: 30rpx;
					color: #333333;
				}
			}
		}

		.info_money {
			width: 100%;
			padding-top: 20rpx;
			border-top: 1rpx solid #eee;
			display: flex;
			align-items: center;
			text:nth-child(1) {
				font-weight: 500;
				font-size: 34rpx;
				color: #ff5405;
				margin-right: 10rpx;
			}
			text:nth-child(2) {
				font-size: 24rpx;
				text-decoration: line-through;
			}
		}
	}

	.user_box {
		width: 690rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 8px;
		.user_title {
			font-size: 30rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}
		.item_text:last-child {
			margin-bottom: 0;
		}
	}

	.btns {
		width: 750rpx;
		padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
		padding-left: 30rpx;
		padding-right: 30rpx;
		padding-top: 30rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		column-gap: 20rpx;
		view {
			min-width:140rpx;
			height: 80rpx;
			border: 2rpx solid #333333;
			padding: 0 30rpx;
			line-height: 76rpx;
			text-align: center;
			font-size: 28rpx;
			border-radius: 200rpx;
		}
	}
}
</style>
