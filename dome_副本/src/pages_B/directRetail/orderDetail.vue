<template>
	<view class="">
		<up-sticky>
			<view :style="{background:topBgColor}">
				<up-navbar title="订单详情" bgColor="none" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
			</view>
		</up-sticky>
		<view class="backOrderColor"></view>
		<view class="pageView">
			<template v-if="derinfo.payStatus == 11">
				<view class="orderSta">
					<view class="orderSta-label">{{isHx?'已完成':'待核销'}}</view>
				</view>
				<view class="qCard cards">
					<view class="qCard-title">{{isHx?'已':''}}凭【二维码】到店消费</view>
					<view class="qCard-qr">
						<up-qrcode cid="ex1" :size="180" val="sxjkdwfwpt20250326"></up-qrcode>
						<!-- <image :src="imgUrl+'static/B-direct-failure-qr.png'" style="width: 180px;height: 180px;" mode=""></image> -->
					</view>
					<view class="qCard-text">{{isHx?'券码已使用':'待使用券码'}}</view>
					<view class="qCard-texNum">sxjkdwfwpt20250326</view>
					<view class="hexiao" v-if="isHx"></view>
				</view>
			</template>
			<template>
				<view class="orderSta">
					<view class="orderSta-label" v-if="derinfo.payStatus == 0">
						待支付
						<text>请尽快支付</text>
					</view>
					<view class="orderSta-label" v-if="derinfo.payStatus == 1">
						待发货
						<text>等待商家发货</text>
					</view>
					<view class="orderSta-label" v-if="derinfo.payStatus == 2">
						已发货
						<text>查看物流</text>
					</view>
					<view class="orderSta-label" v-if="derinfo.payStatus == 6">
						已完成
						<text>订单已完成</text>
					</view>
					<view class="orderSta-label" @click="toNav('./afterSalesProgress')" v-if="derinfo.payStatus == 3">
						待商家审核
						<text>售后进度查询</text>
					</view>
					<view class="orderSta-label" v-if="derinfo.payStatus == 4">
						退款中
						<text>已发起退款，预计1-3个工作日到账</text>
					</view>
					<!-- <up-icon name="arrow-right" v-if="derinfo.payStatus != 4" size="12"></up-icon> -->
				</view>
				<up-gap height="5"></up-gap>
				<view class="adreView cards">
					<up-icon name="map" color="#000000" size="20"></up-icon>
					<view class="adreView-cen">
						<view class="adreName">
							{{derinfo.baseOrderInfoResponse.province}}{{derinfo.baseOrderInfoResponse.city}}{{derinfo.baseOrderInfoResponse.area}}{{derinfo.baseOrderInfoResponse.addr}}
						</view>
						<view class="adreTaxt">
							<view class="adreTaxt-item">{{derinfo.baseOrderInfoResponse.consignee}}</view>
							<view class="adreTaxt-item">{{derinfo.baseOrderInfoResponse.mobile}}</view>
						</view>
					</view>
				</view>
			</template>

			<up-gap height="15"></up-gap>
			<view class="mallCard cards">
				<image class="mallCard-imgs" lazy-load :src="derinfo.baseOrderInfoResponse.payRetailShopOrderItemVos[0].pic" mode=""></image>
				<view class="mallCard-center">
					<view class="left">
						<view class="mallCard-name">
							{{derinfo.baseOrderInfoResponse.payRetailShopOrderItemVos[0].shopName}}</view>
						<view class="mallCard-address">
							<up-icon name="map" color="#000000" size="10"></up-icon>
							<text>{{derinfo.baseOrderInfoResponse.payRetailShopOrderItemVos[0].shopName}}</text>
						</view>
					</view>
					<view class="right">
						<view class="right-icon">
							<up-icon :name="imgUrl+'static/B-direct-navigation.png'" size="28"></up-icon>
						</view>
						<view class="right-icon">
							<up-icon :name="imgUrl+'static/B-direct-tell.png'" size="28"></up-icon>
						</view>
					</view>
				</view>
			</view>
			<up-gap height="15"></up-gap>
			<order-shop-list :list="derinfo.baseOrderInfoResponse.payRetailShopOrderItemVos"></order-shop-list>
			<up-gap height="15"></up-gap>
			<view class="priceView cards">
				<view class="priceView-label">实付款</view>
				<view class="priceView-center">
					<view class="newPrice" :style="{color: themeStore.themeColors.$primaryColor}"><text
							class="fs-28">￥</text>{{decimalPointDivision(derinfo.baseOrderInfoResponse.totalPrice,'left')}}<text
							class="fs-26">{{decimalPointDivision(derinfo.baseOrderInfoResponse.totalPrice,'right')}}</text>
					</view>
				</view>
			</view>
			<up-gap height="15"></up-gap>
			<view class="orderView cards">
				<view class="orderView-title">订单信息</view>
				<order-line label="订单信息" :text="derinfo.baseOrderInfoResponse.parentOrderId" borderBottom isBut
					@butClick="copyText(derinfo.baseOrderInfoResponse.parentOrderId)"></order-line>
				<order-line label="下单时间" :text="derinfo.orderTime" borderBottom></order-line>
				<order-line label="支付时间" :text="derinfo.payExpTime"
					:borderBottom="(isHx && orderType == 1)?true:false"></order-line>
				<order-line v-if="isHx && orderType == 1" label="核销时间" :text="derinfo.updateTime"></order-line>
			</view>
			<template v-if="orderType == 2">
				<up-gap height="15"></up-gap>
				<view class="orderView cards">
					<order-line label="配送方式" text="快递运输" borderBottom></order-line>
					<order-line label="配送时间" text="商品发出后7天内送达"></order-line>
				</view>
			</template>

			<up-gap height="90"></up-gap>
			<view class="fixedBotttom">
				<!-- <view class="fixedBotttom-item" @click="toNav('./refundApply?price='+derinfo.baseOrderInfoResponse.totalPrice)">申请退款</view>
				<view class="fixedBotttom-item" style="margin-left: 20rpx;" v-if="derinfo.baseOrderInfoResponse.logisticsTracking"  @click="toNav('./logistics?id='+derinfo.id)">查看物流</view> -->
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref } from 'vue';
	import { getpayOrderInfo } from '@/api/points';
	import { onLoad, onShow, onPageScroll } from '@dcloudio/uni-app';
	import OrderShopList from "./components/OrderShopList";
	import OrderLine from "./components/OrderLine";
	import { imgUrl } from '@/config';
	import { decimalPointDivision, copyText } from "@/utils/util"
	import { toNav, toBack } from '@/utils/route';
	import type { ShopDetail } from "./types";

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);


	const topBgColor = ref<string>('transparent');
	const totalAmount = ref(99.89);
	const orderType = ref(2); // 1 到店，2 快递
	const isHx = ref(false); // 是否核销
	const orderStatus = ref(1); // 1 待发货;2 待收货;3 待商家审核;4 退款中;

	const addressDetail = ref({
		linkman: '名称',
		linkmanMobile: '133343344322',
		fullAddress: '科技路丈八北路A座304室'
	})
	const shopList = ref<Array<ShopDetail>>([
		{ name: '洛川脆甜可口苹果', price: 99, num: 5 },
		{ name: '洛川脆甜可口苹果', price: 99, num: 5 },
		{ name: '洛川脆甜可口苹果', price: 99, num: 5 },
		{ name: '洛川脆甜可口苹果', price: 99, num: 5 },
	])
	onPageScroll((e) => {
		if (e.scrollTop < 1) {
			topBgColor.value = 'transparent';
		} else {
			topBgColor.value = "#FFFFFF";
		}
	})
	const derinfo = ref({})
	const getdel = async () => {
		const res = await getpayOrderInfo(oderid.value);
		derinfo.value = res.data

	}
	const oderid = ref('')
	onLoad((opticon) => {
		oderid.value = opticon.id
		getdel()
		console.log(opticon.state);
		// if(opticon.orderStatus == 5){
		// 	orderType.value = 1
		// }else{
		// 	orderStatus.value = opticon.orderStatus
		// }
	})
</script>

<style lang="scss">
	@import './index.scss';

	.orderSta {
		padding: 20rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;

		.orderSta-label {
			// height: 100rpx;
			display: flex;
			align-items: flex-end;
			font-weight: bold;
			font-size: 40rpx;
			color: #000000;

			text {
				font-weight: 500;
				font-size: 24rpx;
				color: #666666;
				margin-left: 20rpx;
			}
		}
	}

	.adreView {
		padding: 30rpx 36rpx;
		box-sizing: border-box;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;

		.adreView-cen {
			width: calc(100% - 60rpx);
		}

		.adreName {
			font-weight: bold;
			font-size: 30rpx;
			color: #000000;
		}

		.adreTaxt {
			display: flex;
			align-items: center;
			font-weight: 500;
			font-size: 24rpx;
			color: #999999;
			margin-top: 22rpx;

			.adreTaxt-item {
				margin-right: 20rpx;
			}
		}

	}

	.qCard {
		padding: 35rpx;
		box-sizing: border-box;


		border: 3px solid #FFFFFF;
		position: relative;

		.hexiao {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			background: rgba(255, 255, 255, .4);
		}

		.qCard-title {
			font-weight: bold;
			font-size: 32rpx;
			color: #333333;
		}

		.qCard-qr {
			padding: 30rpx 0 20rpx 0;
			display: flex;
			justify-content: center;
		}

		.qCard-text {
			text-align: center;
			padding: 10rpx 0;
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
		}

		.qCard-texNum {
			text-align: center;
			padding: 10rpx 0;
			font-weight: 500;
			font-size: 30rpx;
			color: #000000;
		}
	}

	.mallCard {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 3px solid #FFFFFF;

		.mallCard-imgs {
			width: 100rpx;
			height: 100rpx;
			border-radius: 16rpx;
		}

		.mallCard-center {
			width: calc(100% - 120rpx);
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				height: 100rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				.mallCard-name {
					font-weight: bold;
					font-size: 28rpx;
					color: #000000;
				}

				.mallCard-address {
					display: flex;
					align-items: center;

					font-weight: 500;
					font-size: 24rpx;
					color: #666666;

					text {
						margin-left: 5rpx;
					}
				}
			}

			.right {
				display: flex;
				align-items: center;

				.right-icon {
					margin-right: 20rpx;
				}
			}
		}
	}

	.priceView {
		width: 686rpx;
		height: 106rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 34rpx;
		box-sizing: border-box;

		.priceView-label {
			font-weight: 500;
			font-size: 28rpx;
			color: #333333;
		}
	}

	.orderView {
		padding: 0 30rpx;
		box-sizing: border-box;

		.orderView-title {
			padding-top: 38rpx;
			// height: 64rpx;
			// line-height: 64rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}

		.orderItem {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 36rpx 0;

			.orderItem-label {
				font-weight: 500;
				font-size: 26rpx;
				color: #666666;
			}

			.orderItem-text {
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;

				text {
					display: inline-block;
					width: 56rpx;
					height: 28rpx;
					line-height: 28rpx;
					text-align: center;
					background: #FFFFFF;
					border-radius: 6rpx;
					border: 1px solid #CCCCCC;
					font-weight: 500;
					font-size: 20rpx;
					color: #666666;
				}
			}
		}


	}

	.newPrice {
		// color: $color;
		font-weight: bold;
		font-size: 50rpx;
		display: inline-block;
	}

	.fixedBotttom {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		background: #FFFFFF;
		height: 150rpx;
		width: 100%;
		box-sizing: border-box;
		padding: 15rpx 32rpx;
		display: flex;
		justify-content: flex-end;

		.fixedBotttom-item {
			width: 230rpx;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			background: #FFFFFF;
			border-radius: 44rpx;
			border: 1px solid #CCCCCC;
			font-weight: 500;
			font-size: 30rpx;
			color: #000000;
		}

	}

	.backOrderColor {
		width: 750rpx;
		height: 771rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		background: $bgTopColor;
	}
</style>