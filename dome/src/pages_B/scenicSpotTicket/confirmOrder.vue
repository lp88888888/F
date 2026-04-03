<template>
	<view class="pagess" :data-theme="pageTheme">
		<up-navbar title="确认支付" bgColor="transparent" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
		<view class="pageView">
			<view class="card">
				<view class="card-item">
					<view v-if="pageType == 'tickets'">
						<view class="nameBox">{{ oinfo.orderTitle }}</view>
						<view class="textBox u-m-t-24">{{ oinfo.baseOrderInfoResponse.travelDate }}
							{{ oinfo.baseOrderInfoResponse.travelDateName }}</view>
						<view v-if="timeSlotDisplay.startTime" class="textBox u-m-t-24">
						    {{ timeSlotDisplay.startTime }} ~ {{ timeSlotDisplay.endTime }}入园
						</view>
					</view>
					<!-- 	<view v-if="pageType == 'annual'" class="nameTBox">[2025西安游览年票]仅需79元/张 一票畅玩翠华山 ，塔云山，动物园与海洋馆多家温泉+优质景区
					</view>
					<view v-if="pageType == 'rights'" class="nameTBox">xxx景区，xxx景区等九折权益卡</view> -->
					<view class="orderCard u-m-t-32">
						<template v-if="pageType == 'tickets'">
							<view class="orderCard-item fl-ce-sb">
								<view class="orderCard-item-left texNoWrap">门票{{oinfo.baseOrderInfoResponse.productName}}</view>
								<view class="orderCard-item-center">x{{oinfo.baseOrderInfoResponse.quantity}}</view>
								<view class="orderCard-item-right">{{oinfo.orderAmount}}元</view>
							</view>
						</template>
						<!-- <template v-if="pageType == 'annual'">
							<view class="orderCard-item fl-ce-sb ">
								<view class="orderCard-item-left">年卡</view>
								<view class="orderCard-item-center">x2</view>
								<view class="orderCard-item-right">88元</view>
							</view>
						</template>
						<template v-if="pageType == 'rights'">
							<view class="orderCard-item fl-ce-sb ">
								<view class="orderCard-item-left">权益卡</view>
								<view class="orderCard-item-center">x2</view>
								<view class="orderCard-item-right">88元</view>
							</view>
						</template> -->
					</view>
					<!-- <view class="fl-ce-sb u-m-t-32">
						<view class="labBox">优惠合计: </view>
						<view style="color: #FF9000;font-weight: 700;">-30元</view>
					</view> -->
					<view class="fl-ce-sb u-m-t-32">
						<view class="labBox">应付金额: </view>
						<view style="color: #333333;font-weight: 700;">{{oinfo.orderAmount}}元
						</view>
					</view>
					<view class="fl-ce-sb u-m-t-32">
						<view class="labBox">支付方式: </view>
						<view style="color: #333333;">微信支付 </view>
					</view>
				</view>
			</view>
			<!-- toNav('/pages_B/scenicSpotTicket/paySuccess?type='+pageType) -->
			<view class="fixBut" @click="topay">确认支付</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { toNav, toBack, toRec } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { onLoad,onShow } from '@dcloudio/uni-app';
	import { getpayOrderInfo, getpayScenicSpotOrder, postcreateOrder } from '@/api/scenicArea';
	import { fetchWechatInfo, fetchWechatInfoAuthorization, getMiniUserInfo } from '@/api/login';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const backgroundColor = ref<string>('#D1E5F9');
	const pageType = ref<string>('tickets'); //tickets门票下单 tickets ,annual,rights
	const oid = ref<string>('');
	const oinfo = ref({});
	const openid = ref('')
	const timeSlotDisplay = computed(() => {
	    let slot = oinfo.value?.baseOrderInfoResponse?.timeSlot;
	    if (!slot) return { startTime: '', endTime: '' };
	    // 如果后端返回的是对象而非字符串，直接返回
	    if (typeof slot === 'object') return slot;
	    try {
	        // 清洗字符串：去除换行、回车和制表符
	        const cleanSlot = slot.replace(/[\r\n\t]/g, '').trim();
	        return JSON.parse(cleanSlot);
	    } catch (e) {
	        console.error("JSON解析彻底失败:", slot);
	        // 最后的兜底方案：如果解析失败，用正则强行抓取时间（为了兼容这种破碎的JSON）
	        const start = slot.match(/startTime\s*"\s*:\s*"\s*([\d:]+)/)?.[1] || '';
	        const end = slot.match(/endTime\s*"\s*:\s*"\s*([\d:]+)/)?.[1] || '';
	        return { startTime: start, endTime: end };
	    }
	});
	onLoad((opticon) => {
		oid.value = opticon.id;
		// #ifdef MP-WEIXIN
		getOpenId()
		// #endif
		getOrderInfo();
	});
	onShow(()=>{
		// #ifdef MP-WEIXIN
		getOpenId()
		// #endif
	})
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
	const getOrderInfo = async () => {
		const res = await getpayOrderInfo(oid.value);
		if (res.code == 200) {
			oinfo.value = res.data;
		}
		console.log(res);
	};
	const topay = async () => {
		console.log('openidopenid2222openidopenid', openid.value);
		// 增加数据校验
		if (!oinfo.value?.orderTitle) {
			uni.showToast({ title: '订单信息加载中', icon: 'none' });
			return;
		}
		let params = {
			description: oinfo.value.orderTitle,
			outTradeNo: oid.value,
			totalAmount: oinfo.value.orderAmount,
			// #ifdef MP-WEIXIN
				openId: openid.value
			// #endif
		}
		console.log('params', params);
		try {			const res = await postcreateOrder(params);
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
						toRec('/pages_B/scenicSpotTicket/paySuccess?id=' + oid.value);
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
</script>

<style lang="scss">
	// page {
	// 	background: linear-gradient(180deg, #d1e5f9 0%, #f8f9fb 96%);
	// }
	.pagess {
		background: var(--head-color);
	}
	.pageView {
		padding: 24rpx 32rpx;
		box-sizing: border-box;
	}

	.card {
		width: 100%;
		padding: 32rpx;
		box-sizing: border-box;
		background: #ffffff;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);

		.card-item {
			width: 100%;
			padding: 32rpx;
			box-sizing: border-box;
			background: rgba(103, 58, 0, 0.03);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
		}
	}

	.nameBox {
		font-weight: 700;
		font-size: 32rpx;
		color: #333333;
		line-height: 32rpx;
	}

	.nameTBox {
		font-weight: 700;
		font-size: 32rpx;
		color: #333333;
		line-height: 48rpx;
	}

	.textBox {
		font-weight: 400;
		font-size: 24rpx;
		color: #666666;
		line-height: 24rpx;
	}

	.orderCard {
		width: 100%;
		padding: 32rpx 20rpx;
		box-sizing: border-box;
		background: rgba(103, 58, 0, 0.05);
		border-radius: 16rpx 16rpx 16rpx 16rpx;
	}

	.orderCard-item {
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
		line-height: 28rpx;

		.orderCard-item-left {
			min-width: calc(100% - 60rpx - 140rpx);
		}

		.orderCard-item-center {
			width: 60rpx;
			text-align: right;
		}

		.orderCard-item-right {
			width: 140rpx;
			text-align: right;
		}
	}

	.labBox {
		font-weight: 400;
		font-size: 28rpx;
		color: #666666;
		line-height: 28rpx;
	}

	.fixBut {
		width: 540rpx;
		height: 96rpx;
		background: var(--but-color-line);
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		line-height: 96rpx;
		text-align: center;
		font-weight: 700;
		font-size: 32rpx;
		color: #ffffff;
		position: fixed;
		left: calc((100% - 540rpx) / 2);
		bottom: 50rpx;
	}
</style>