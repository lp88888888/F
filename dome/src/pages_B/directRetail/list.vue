<template>
	<view class="">
		<u-sticky>
			<view class="navBack">
				<up-navbar title="订单列表" bgColor="none" @leftClick="leftClick" placeholder :fixed="false"></up-navbar>
				<view class="tabsView">
					<u-tabs :list="tabList" :current="current" @change="tabChange"
						:lineColor="themeStore.themeColors.$primaryColor"
						:activeStyle="{color: themeStore.themeColors.$primaryColor,fontWeight: 'bold'}"
						:inactiveStyle="{color:'#333333'}" :itemStyle="{width:'100rpx',height:'88rpx',fontSize:'28rpx'}"
						lineWidth="33"></u-tabs>
				</view>
			</view>
		</u-sticky>
		<view class="pageView">
			<view class="card" v-for="(item,index) in dataList" :key="index"
				@click="toNav('/pages_B/directRetail/orderDetail?id='+item.id)">
				<view class="card-top">
					<view class="card-top-name">
						<u-icon :name="imgUrl+'static/B-direct-shop-icon.png'" size="20"></u-icon>
						<view class="card-top-name-title">
							<text>{{item.orderTitle}}</text>
							<text>{{item.baseOrderInfoResponse.payRetailShopOrderItemVos[0].shopName}}</text>
						</view>
						<!-- <view class="card-top-name-icon">{{item.type ==2?'自提':"快递"}}</view> -->
					</view>
					<view class="card-top-state">
						<text v-if="item.payStatus == 0" class="stateIcon2">待支付</text>
						<text v-if="item.payStatus == 1" class="stateIcon3">已支付</text>
						<text v-if="item.payStatus == 6" class="stateIcon4">已完成</text>
						<text v-if="item.payStatus == 2" class="stateIcon5">已取消</text>
					</view>
				</view>
				<up-gap height="10"></up-gap>
				<view class="card-center">

					<scroll-view v-if="item.baseOrderInfoResponse.payRetailShopOrderItemVos.length > 1"
						class="scroll-view_H" :scroll-x="true">
						<image v-for="(url,index) in item.baseOrderInfoResponse.payRetailShopOrderItemVos"
							:src="url.pic" :key="index"></image>
					</scroll-view>
					<view v-else class="scroll-view_H" style="width: calc(100% - 170rpx);">
						<image :src="item.baseOrderInfoResponse.payRetailShopOrderItemVos[0].pic" :key="url"></image>
						<view class="scroll-view_H-text">
							{{item.baseOrderInfoResponse.payRetailShopOrderItemVos[0].shopName}}</view>
					</view>
					<view class="card-center-fiexd">
						<view class="priceView"><text
								style="font-size: 24rpx;">￥</text>{{flPrice(item.orderAmount,'left')}}<text
								style="font-size: 24rpx;">{{flPrice(item.orderAmount,'right')}}</text></view>
						<view class="totalView">共{{item.baseOrderInfoResponse.allCount}}件</view>
					</view>
				</view>
				<u-line color="#EEEEEE"></u-line>
				<up-gap height="10"></up-gap>
				<view class="card-bottom">
					<view class="card-bottom-time">{{item.time}}</view>
					<!-- <view class="card-bottom-but butColor1" v-if="item.state == 1">去支付</view>
					<view class="card-bottom-but butColor1" v-if="item.state == 2">查看券码</view>
					<view class="card-bottom-but butColor2" v-if="item.state == 3">取消</view> -->
				</view>
			</view>
		</view>

	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { getShopOrder } from '@/api/points';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	import {
		onLoad
	} from '@dcloudio/uni-app';
	const current = ref<string | number>(0);
	onLoad(() => {
		getlist()
	})
	const tabList = ref([
		{ name: '全部', state: '' },
		{ name: '待支付', state: 0 },
		{ name: '进行中', state: 1 },
		{ name: '已完成', state: 6 },
		{ name: '已取消', state: 2 },
	]);
	const payStatus = ref('')
	const tabChange = (e) => {
		console.log("e", e)
		payStatus.value = e.state
		dataList.value = []
		getlist()
		// getData();
	}
	const flPrice = computed(() => {
		return (price : string | number, type : string) => {
			let srt : string = String(Number(price).toFixed(2));
			if (price) {
				if (type == 'left') {
					return srt.substring(0, srt.indexOf('.'))
				} else {
					return srt.substring(srt.indexOf('.'))
				}

			}
			return ''
		}
	})
	const dataList = ref([
		{ orderStatus: '5', title1: '宝鸡西服务区', title: '朋乐乐购', state: 1, type: 1, time: '2025-03-27 10:30:28', totalAmount: 99, imgUrl: ['del/listImg.png', 'del/listImg.png', 'del/listImg.png', 'del/listImg.png'] },
		{ orderStatus: '2', title1: '宝鸡西服务区', title: '朋乐乐购', state: 2, type: 2, time: '2025-03-27 10:30:28', totalAmount: 99, imgUrl: ['del/listImg.png'], shopName: '苹果苹果苹果苹果苹果苹果苹果苹果苹果' },
		{ orderStatus: '1', title1: '宝鸡西服务区', title: '朋乐乐购', state: 3, type: 2, time: '2025-03-27 10:30:28', totalAmount: 99, imgUrl: ['del/listImg.png', 'del/listImg.png'] },
		{ orderStatus: '3', title1: '宝鸡西服务区', title: '朋乐乐购', state: 4, type: 1, time: '2025-03-27 10:30:28', totalAmount: 99, imgUrl: ['del/listImg.png', 'del/listImg.png'] },
		{ orderStatus: '4', title1: '宝鸡西服务区', title: '朋乐乐购', state: 5, type: 1, time: '2025-03-27 10:30:28', totalAmount: 99, imgUrl: ['del/listImg.png', 'del/listImg.png'] },
	])
	const getlist = async () => {
		let params = {
			payStatus: payStatus.value
		}
		const res = await getShopOrder(params)
		if (res.code == 200) {
			dataList.value = res.data.list
			console.log(res, 'getShopOrder')
		}
	}
	const leftClick = () => {
		uni.navigateBack({
			delta: 1,
			fail: () => {
				uni.navigateTo({
					url: "/pages/home/home"
				})
			}
		})
	}
</script>

<style lang="scss">
	page {
		background: $pageBgColor;
	}

	.navBack {
		width: 100%;
		background: $bgTopColor;
	}

	.tabsView {
		display: flex;
		justify-content: center;
	}

	.pageView {
		padding: 30rpx 32rpx;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: repeat(1, 100%);
		grid-gap: 30rpx;
	}

	.card {
		width: 100%;
		padding: 25rpx 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;

		.card-top {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.card-top-name {
				display: flex;
				align-items: center;

				.card-top-name-title {
					line-height: 40rpx;
					font-weight: bold;
					font-size: 28rpx;
					color: #000000;
					padding: 0 16rpx;
				}

				.card-top-name-icon {
					width: 60rpx;
					height: 28rpx;
					// line-height: 28rpx;
					text-align: center;
					border-radius: 6rpx;
					border: 1rpx solid $color;
					font-weight: 500;
					font-size: 22rpx;
					color: $color;
				}
			}

			.card-top-state {
				font-weight: 500;
				font-size: 26rpx;

				.stateIcon1 {
					color: #FF9600;
				}

				.stateIcon2 {
					color: #51B3F7;
				}

				.stateIcon3 {
					color: #0077FF;
				}

				.stateIcon4 {
					color: #999999;
				}

				.stateIcon5 {
					color: #BCBCBD;
				}
			}
		}

		.card-center {
			position: relative;

			.scroll-view_H {

				width: 100%;
				white-space: nowrap;
				display: flex;
				align-items: center;
				padding-right: 150rpx;

				image {
					width: 136rpx;
					height: 136rpx;
					background: #F5F5F5;
					border-radius: 16rpx;
					margin-right: 15rpx;
				}

				.scroll-view_H-text {
					width: calc(100% - 140rpx);
					white-space: nowrap;
					/* 禁止换行 */
					overflow: hidden;
					/* 超出部分隐藏 */
					text-overflow: ellipsis;
					/* 使用省略号替代超出部分 */
				}
			}

			.card-center-fiexd {
				width: 150rpx;
				height: 136rpx;
				position: absolute;
				top: 0;
				right: 0;
				z-index: 2;
				background: rgba(255, 255, 255, 0.9);
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-end;

				.priceView {
					font-weight: bold;
					font-size: 28rpx;
					color: #000000;
				}

				.totalView {
					font-weight: 500;
					font-size: 24rpx;
					color: #999999;
				}
			}
		}

		.card-bottom {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.card-bottom-time {
				font-weight: 500;
				font-size: 24rpx;
				color: #999999;
			}

			.card-bottom-but {
				width: 160rpx;
				height: 60rpx;
				border-radius: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 500;
				font-size: 28rpx;
			}

			.butColor1 {
				color: $color;
				border: 1rpx solid $color;
			}

			.butColor2 {
				color: #999999;
				border: 1rpx solid #E2E2E2;
			}
		}
	}

	::v-deep .u-navbar__content {
		background: none !important;
	}
</style>