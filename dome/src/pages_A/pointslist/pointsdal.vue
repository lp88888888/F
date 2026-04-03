<template>
	<view class="page">
		<up-sticky>
			<view class="searchView" :style="{background:backgroundColor}">
				<up-navbar bgColor="transparent" title='积分明细详情' @leftClick="toBack" placeholder fixed></up-navbar>
			</view>
		</up-sticky>
		<view class="integral-detail">
			<view class="header">
				<text class="title">{{dalinfo.templateRuleName}}</text>
			</view>

			<!-- 积分变动 -->
			<view class="amount">
				<text class="value">{{dalinfo.pointsNum}}</text>
			</view>
			<!-- <view class="balance">余额：{{dalinfo.pointsBalance}}</view> -->

			<!-- 详细信息列表 -->
			<view class="info-list">
				<view class="info-item">
					<text class="label">发生时间</text>
					<text class="value">{{dalinfo.createTime}}</text>
				</view>
				<view class="info-item">
					<text class="label">类型</text>
					<text class="value">{{dalinfo.pointsEventTypeName}}</text>
				</view>
				<view class="info-item">
					<text class="label">详情</text>
					<text class="value">{{dalinfo.pointsDetail}}</text>
				</view>
				<view class="info-item">
					<text class="label">备注</text>
					<text class="value">{{dalinfo.remark||'-'}}</text>
				</view>
				<view class="info-item">
					<text class="label">来源</text>
					<text class="value">{{dalinfo.pointsSourceName}}</text>
				</view>
			</view>

		</view>
	</view>
</template>

<script setup lang="ts">
	import moment from "moment";
	import {
		imgUrl,
	} from '../../config';
	import {
		ref,
		reactive,
		computed
	} from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	import { toNav, toBack } from '@/utils/route';
	const backgroundColor = ref("#EEFDF1")
	const dalinfo = ref({})
	onLoad(() => {
		dalinfo.value = uni.getStorageSync('pointdal')
	})
</script>

<style scoped lang="scss">
	.page {
		min-height: 100vh;
		background: linear-gradient(0deg, #FCFFFC 0%, #ECFCEF 100%);
		padding: 25rpx;
	}

	.integral-detail {
		background: #FFFFFF;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 8rpx 0rpx #D3E7D1;
		border-radius: 10rpx;
		padding: 60rpx;
		min-height: 800rpx;
	}

	/* 顶部标题 */
	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 30rpx;
	}

	.header .icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 12rpx;
	}

	.header .title {
		font-size: 32rpx;
		color: #333333;
		font-weight: bold;
	}

	.header .tag {
		font-size: 20rpx;
		color: #ff3b30;
		background-color: #ffeaea;
		padding: 4rpx 8rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
	}

	/* 积分变动 */
	.amount {
		text-align: center;
		font-size: 48rpx;
		font-weight: bold;
		color: #ff3b30;
		margin-bottom: 10rpx;
	}

	.amount .minus {
		font-size: 36rpx;
	}

	.balance {
		text-align: center;
		font-size: 26rpx;
		color: #999999;
		margin-bottom: 40rpx;
	}

	/* 信息列表 */
	.info-list {
		width: 100%;

	}

	.info-item {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.info-item:last-child {
		border-bottom: none;
	}

	.info-item .label {
		font-weight: 400;
		font-size: 24rpx;
		color: #909090;
		line-height: 24rpx;
		text-align: left;
	}

	.info-item .value {
		font-weight: 400;
		font-size: 24rpx;
		color: #909090;
		line-height: 24rpx;
	}
</style>