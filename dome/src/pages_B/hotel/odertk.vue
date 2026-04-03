<template>
	<view class="cancel-order" :data-theme="pageTheme" >
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="申请退款" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<view class="form">
			<view class="form-header">
				<text class="title">请选择退款原因</text>
				<text class="required">*</text>
			</view>

			<view class="form-cont">
				<view v-for="(item, index) in labelList" :key="index" class="form-item"
					@click="selectReason(item.label)">
					<text class="form-label">{{ item.label }}</text>
					<image class="circle-icon"
						:src="imgUrl + 'trip-pro/' + (selectedId === item.label ? 'ic_ad_select.png' : 'ic_ad_normal.png')" />
				</view>
			</view>
		</view>

		<view class="bottom-bar">
			<view class="bar-left">
				<view class="amount">
					<text class="unit">¥</text>
					<text class="price">{{payAmount}}</text>
				</view>
				<text class="refund">退款金额</text>
			</view>
			<view class="cancel-button" @click="handleCancelOrder">申请退款</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	// 假设 activityApi 是一个模块，导出 imgUrl
	import { imgUrl } from '@/config';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { getordercancel } from '@/api/hotel';
	import { toNav,toBack } from '@/utils/route';
	// 数据
	const orederid = ref('')
	const selectedId = ref('')
	const payAmount = ref('')
	onLoad((options) => {
		orederid.value = options.id; // 修正了这一行
		payAmount.value = options.payAmount;
		// getInfo();
	})
	const labelList = [
		{ label: '出行计划有变', id: 1 },
		{ label: '定错/多订', id: 2 },
		{ label: '交通延误/取消导致无法出行', id: 3 },
		{ label: '与店家协商一致退款', id: 4 },
		{ label: '酒店环境/设施差', id: 5 },
		{ label: '酒店没房/加价', id: 6 },
		{ label: '其他渠道更优惠', id: 7 }
	]

	// 方法
	const selectReason = (label : string) => {
		selectedId.value = label
	}
	const handleCancelOrder = () => {
		if (selectedId.value == '') {
			uni.showToast({ title: '请选择取消原因', icon: 'none' })
			return
		}
		let params = {
			orderId: orederid.value,
			cancelReason: selectedId.value,
			operatorType: 0,
			operatorId: 0
		}
		getordercancel(params).then(res => {
			if (res.code == 200) {
				uni.showToast({ title: '提交成功', icon: 'none' })
				uni.reLaunch({
					url: '/pages_B/hotel/order'
				})
			} else {
				uni.showToast({ title: res.msg, icon: 'none' })
			}
		})
	}
</script>

<style scoped>
	.cancel-order {
		padding: 40rpx;
		background: var(--primary-color);
		min-height: calc(100vh - 160rpx);
	}

	.bottom-bar {
		width: 750rpx;
		height: 160rpx;
		background: #ffffff;
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.03);
		border: 2rpx solid rgba(0, 0, 0, 0.1);
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx 40rpx;
		box-sizing: border-box;
	}

	.bar-left {
		display: flex;
		flex-direction: column;
	}

	.unit {
		font-weight: 700;
		font-size: 32rpx;
		color:var(--primary-color);
	}

	.price {
		font-weight: 700;
		font-size: 48rpx;
		color: var(--primary-color);
	}

	.refund {
		font-weight: 400;
		font-size: 28rpx;
		color: #999999;
		margin-top: 6rpx;
	}

	.form-header {
		display: flex;
		align-items: center;
	}

	.form-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 30rpx 0;
	}

	.circle-icon {
		width: 48rpx;
		height: 48rpx;
		background: #ffffff;
		border: 2rpx solid #c9c9c9;
		border-radius: 50%;
	}

	.form-label {
		font-weight: 400;
		font-size: 32rpx;
		color: #333333;
		line-height: 48rpx;
	}

	.title {
		font-weight: 400;
		font-size: 36rpx;
		color: #999999;
	}

	.required {
		font-weight: 400;
		font-size: 48rpx;
		color: #fd4848;
		margin-left: 12rpx;
	}

	.cancel-button {
		width: 280rpx;
		height: 96rpx;
		background: var(--primary-color);
		border-radius: 48rpx;
		font-weight: 700;
		font-size: 32rpx;
		color: #ffffff;
		text-align: center;
		line-height: 96rpx;
	}
</style>