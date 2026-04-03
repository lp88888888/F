<!-- 抵用券 -->
<template>
	<view class="box" :data-theme="pageTheme">
	 <view class="box-header">
		 	<up-navbar title="订单详情" :bgColor="backgroundColor" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
	 </view>
		<view class="merchant-bg">
			<view>
			<!-- 顶部状态栏区域 -->
			<view class="status-bar">
				<text class="status-text" v-if="detail.status == 0">待支付</text>
				<text class="status-text" v-if="detail.status == 10">待发货</text>
				<text class="status-text" v-if="detail.status == 20">已发货</text>
				<text class="status-text" v-if="detail.status == 30">已完成</text>
				<text class="status-text" v-if="detail.status == 40">已取消</text>
				<!-- <view class="navigate-text">请前往
				<view class="card-text">
					<view class="card-jt"><up-icon name="arrow-left" color="#FF9600" size="12"></up-icon></view>
					<view>我的卡包</view>
					<view class="card-jt"><up-icon name="arrow-right" color="#FF9600" size="12"></up-icon></view>
				</view>
				使用
			</view> -->
			</view>

			<!-- 商家信息区域 -->
			
			<view class="merchant-info" v-if="detail.receiverName && detail.receiverAreaName&&detail.couponFlag!=1">
				<view style="font-size: 32rpx; font-weight: 600">
					{{ detail.receiverName }}
				</view>
				<view style="font-size: 26rpx; color: #666">
					{{ detail.receiverAreaName }}{{ detail.receiverDetailAddress }} </view>
			</view>
			</view>
			<!-- 商品信息区域 -->
			<view class="goods-info">
				<text class="goods-title">商品信息</text>
				<view class="goods-item" v-for="(item, index) in detail.items" :key="index" @click="toNav('/pages_A/points/details?id='+item.activityId)" style="position: relative">
					<view class="goods-img">
						<image :src="item.picUrl" />
					</view>
					<view class="goods-cent">
						<view>
							<text class="goods-name">{{ item.spuName }}</text>
						</view>
						<view class="fl-ce-sb">
							<text class="goods-points">{{ item.usePoint }} <text class="goods-points-text">积分</text>
							</text>
							<view>
								<text class="goods-count">×{{ item.count }}</text>
								<text v-if="item.writeOffPlatform == 1&& detail.roleType != 1">
									<text class="pjButton" @click.stop="qrCodeFun(item)"
										v-if="item.writeOffStatus=='1'">核销码</text>
								</text>
								<text class="pjButton" v-if="!item.commentStatus && detail.status == 30&& detail.roleType != 1"
									@click.stop="toNav('/pages_C/evaluation/add?id=' + item.id + '&spuId=' + item.spuId + '&shopId=' + item.shopId)">去评价</text>
							</view>
						</view>
					</view>
					<!-- <view class="goods-desc">
					<text class="goods-name">{{item.spuName}}</text>
				</view> -->
					<!-- <view class="goods-desc">
					<text class="goods-name">{{item.spuName}}</text>
					<text class="goods-points">{{item.usePoint}} 积分</text>
				</view>
				<text class="goods-count">×{{ item.count }}</text> -->
				</view>
				<text class="total-points"><text style="color: #333333">总计：</text>{{ detail.usePoint }} 积分</text>
			</view>
			<view v-if="show" style="background: #fff; border-radius: 8px">
				<view style="margin: 30rpx; padding: 10rpx"> 凭【二维码】到店消费</view>
				<view class="ewm" :style="{ backgroundImage: 'url(' + img + ')' }"></view>
			</view>
			<!-- 订单信息区域 -->
			<view class="order-info">
				<text class="order-title">订单信息</text>
				<view class="order-item">
					<text class="order-label">订单编号</text>
					<!-- <text class="copy-btn">复制</text> -->
					<text class="order-value">{{ detail.no }}</text>
				</view>
				<view class="order-item">
					<text class="order-label">下单时间</text>
					<text class="order-value">{{ formatTimestamp(detail.createTime, 'yyyy-MM-dd hh:mm:ss') }}</text>
				</view>
				<view class="order-item">
					<text class="order-label">支付时间</text>
					<text class="order-value">{{ formatTimestamp(detail.payExpireTime, 'yyyy-MM-dd hh:mm:ss') }}</text>
				</view>
			</view>

			<!-- 底部操作栏区域 -->
			<view class="bottom-bar">
				<view class="bottom-box">
					<view class="service-btn"> </view>
					<view class="operation">
						<!-- <view class="evaluate-btn">&emsp;评价&emsp;</view> -->
						<view class="cancel-btn" v-if="detail.status == 20&&detail.couponFlag!=1&& detail.roleType != 1" @click="savereceipt" >确认收货</view>
						<view class="cancel-btn"
							v-if="detail.status == 20&&detail.couponFlag!=1&& detail.roleType != 1 || detail.status == 30&&detail.couponFlag!=1&& detail.roleType != 1"
							@click="toNav('./logistics?orderId=' + detail.id)">查看物流</view>
					</view>
				</view>
			</view>
			<!-- <up-popup :show="show" @close="close" @open="open">
				
			</up-popup> -->
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref } from 'vue';
	import { imgUrl } from '../../config';
	import { random, guid, timeFormat } from '@/uni_modules/uview-plus';
	import { toNav, toBack } from '@/utils/route';
	// 引入组件，这里假设 CosHeader 组件的类型后续补充，先简单断言
	import CosHeader from '@/components/customNavBar/index.vue';
	import { getOrderInfo, getOrderInfoDetail,postorderreceive } from '@/api/points';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { formatTimestamp } from '@/utils/util';
	import { qrCode } from '@/api/index';
	const show = ref(false);
	const img = ref('');
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	interface CosHeaderProps {
		title : string;
		backgroundColor : string;
		fontColor : string;
		fixed : boolean;
		defaultNavBarheight : number;
	}

	// 响应式变量
	const backgroundColor = ref<string>('transparent');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const detail = ref<any>({});

	const orderId = ref('');
	const ordertype = ref('');
	const savereceipt = async () => {
		const params = {
			id: detail.value.id,
		};
		const res = await postorderreceive(params);
		if (res.code == 200) {
			uni.showToast({
				title: '收货成功',
				icon: 'none',
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1000);
		}
	};
	const getData = async (orderId, type) => {
		let params = {
			id: orderId,
		};
		try {
			// if (type == 'all') {
			// 	const res = await getOrderInfoDetail(params);
			// 	if (res.code == 200) {
			// 		detail.value = res.data;
			// 		console.log(res.data, 99999999);
			// 		if (res.data.items[0].writeOffPlatform == 1) {
			// 			qrCodeFun(item);
			// 		}
			// 	}
			// } else {
			// 	const res = await getOrderInfo(params);
			// 	if (res.code == 200) {
			// 		detail.value = res.data;
			// 		console.log(res.data, res.data.items[0].writeOffPlatform);
			// 		if (res.data.items.writeOffPlatform == 1) {
			// 			qrCodeFun(item);
			// 		}
			// 	}
			// }
			const res = await getOrderInfo(params);
			if (res.code == 200) {
				detail.value = res.data;
				console.log(res.data, res.data.items[0].writeOffPlatform);
				if (res.data.items.writeOffPlatform == 1) {
					qrCodeFun(item);
				}
			}
		} catch (err) {
			console.log('987999999999', err);
		}
	};
	const qrCodeFun = async (val : any) => {
		const params = {
			couponId: val.couponId,
			orderId:val.orderId
		};
		const res = await qrCode(params);
		if (res.code == 200) {
			img.value = 'data:image/png;base64,' + res.data;
			show.value = true;
		}
	};
	const open = () => {
		show.value = true;
	};

	const close = () => {
		show.value = false;
	};
	onLoad((opticon) => {
		orderId.value = opticon.orderId;
		ordertype.value = opticon.type || '';
	});

	onShow(() => {
		if (orderId.value) {
			getData(orderId.value, ordertype.value);
		}
	});
</script>
<style scoped lang="scss">
	
	/* 顶部状态栏样式 */
	.status-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 30rpx;;
		margin-bottom: 30rpx;
	}
   .box-header{
	background: var(--head-color);   
   }
	.merchant-bg {
		width: 100%;
		height: 83vh;
		background: var(--head-color);
		padding: 20rpx 30rpx 0;
		box-sizing: border-box;
		overflow: scroll;
	}

	.status-text {
		font-size: 18px;
		font-weight: bold;
	}

	.navigate-text {
		display: flex;
		font-size: 24rpx;
		color: #333333;
	}

	.card-text {
		display: flex;
		justify-content: center;
		align-self: center;
		color: #ff9600;
	}

	.card-jt {
		padding-top: 6rpx;
	}

	/* 商家信息样式 */
	.merchant-info {
		display: flex;
		align-items: self-start;
		flex-direction: column;
		justify-content: space-between;
		height: 120rpx;
		background-color: #fff;
		border-radius: 8px;
		margin: 20rpx 0;
		padding: 20rpx 30rpx;
	}

	.merchant-img {
		width: 60px;
		height: 60px;
		background: salmon;
		border-radius: 4px;
	}

	.merchant-desc {
		flex: 1;
		margin: 0 10px;
	}

	.merchant-name {
		font-size: 26rpx;
		font-weight: bold;
		margin-bottom: 5px;
		display: block;
	}

	.merchant-location {
		display: flex;
		gap: 2px;
		font-size: 24rpx;
		color: #999;
	}

	.merchant-icons {
		display: flex;
		gap: 16px;
		margin-right: 30rpx;
	}

	.icon {
		width: 20px;
		height: 20px;
	}

	/* 商品信息样式 */
	.goods-info {
		padding: 0 30rpx;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 8px;
	}

	.goods-title {
		font-size: 26rpx;
		font-weight: bold;
		display: block;
		padding: 20rpx 0;
	}

	.goods-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 15px;
		position: relative;
	}

	.goods-img {
		width: 150rpx;
		height: 150rpx;
		// background: sandybrown;
		border-radius: 4px;

		image {
			width: 140rpx;
			height: 140rpx;
			border-radius: 4px;
		}
	}

	.goods-cent {
		width: calc(100% - 170rpx);
		height: 150rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.goods-desc {
		display: flex;
	}

	.goods-name {
		width: 100%;
		display: block;

		font-weight: 400;
		font-size: 32rpx;
		color: #333333;
		line-height: 44rpx;
	}

	.goods-points {
		font-weight: 500;
		font-size: 34rpx;
		color: #ff5405;
		line-height: 44rpx;

		.goods-points-text {
			font-size: 24rpx;
		}
	}

	.goods-count {
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
		line-height: 28rpx;
		margin-right: 10rpx;
		// position: absolute;
		// right: 0;
		// bottom: 10rpx;
	}

	.pjButton {
		display: inline-block;
		width: 110rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		border-radius: 40rpx;
		color: var(--primary-color);
		border: 1rpx solid var(--primary-color);
		margin-left: 15rpx;
		font-size: 24rpx;
	}

	.total-points {
		border-top: 1px solid #eeeeee;
		font-size: 24rpx;
		color: #ff9600;
		text-align: right;
		display: block;
		padding: 20rpx 0;
	}

	/* 订单信息样式 */
	.order-info {
		padding: 0 30rpx;
		background-color: #fff;
		border-radius: 8px;
		margin-top: 20rpx;
	}

	.order-title {
		font-size: 26rpx;
		font-weight: bold;
		padding: 20rpx 0;
		display: block;
	}

	.order-item {
		display: flex;
		padding: 20rpx 0;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #eee;
	}

	.order-item:last-child {
		border-bottom: none;
	}

	.order-label {
		font-size: 14px;
		color: #999;
	}

	.order-value {
		font-size: 14px;
	}

	.copy-btn {
		font-size: 24rpx;
		color: #666666;
		padding: 5rpx 10rpx;
		border: 1px solid #cccccc;
		margin: 0 10rpx;
		border-radius: 16rpx;
	}

	/* 底部操作栏样式 */
	.bottom-bar {
		width: 100%;
		background-color: #fff;
		border-top: 1px solid #eee;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.bottom-box {
		width: 90%;
		margin: 20rpx auto 50rpx;
		display: flex;
		justify-content: space-between;
	}

	.operation {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 30rpx;
	}

	.service-btn {
		color: #333;
		margin-left: 10rpx;

		.icon {
			width: 30rpx;
			height: 30rpx;
			margin-left: 40rpx;
		}
	}

	.evaluate-btn {
		padding: 15rpx 20rpx;
		border: 1px solid var(--primary-color);
		color: var(--primary-color);
		border-radius: 44rpx;
	}

	.cancel-btn {
		padding: 15rpx 20rpx;
		border: 1px solid #cccccc;
		color: #333;
		border-radius: 44rpx;
	}

	.ewm {
		width: 341rpx;
		height: 300rpx;
		margin: 0 auto;
		background-size: 100% 100%;
	}
	.box{
	    height: 100vh;
		overflow: hidden;
	}
</style>