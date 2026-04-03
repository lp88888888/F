<template>
	<view class="order-detail-page">

		<!-- 订单基本信息卡片 -->
		<view class="order-card">
			<view class="ride-date">乘车日期: 2025年11月10日</view>

			<view class="route-container">
				<view class="from-station">
					<text class="station-name">{{ fromStation }}</text>
					<view class="station-tag">起点站</view>
				</view>

				<view class="route-info">
					<text class="duration">约1小时</text>
					<view class="dashed-line">
						<view class="line-dot"></view>
					</view>
				</view>
				<view class="to-station">
					<text class="station-name">{{ toStation }}</text>
					<view class="station-tag">终点站</view>
				</view>
				<view>
					<text>x2</text>
				</view>
			</view>
			<view class="time-price">
				<view class="time-box">
					<text class="time-label">发车时间</text>
					<text class="time-value">08:40</text>
				</view>
				<view class="price-box">
					<text class="price-label">总价</text>
					<text class="price-value">¥80.00</text>
				</view>
			</view>
			<view class="arrive-info">
				<u-icon name="clock" color="#999" size="20" class="time-icon"></u-icon>
				<text class="arrive-text">预计到达: 2025年11月10日 09:40</text>
			</view>
		</view>
		<!-- 乘车人信息区域 -->
		<view class="passenger-section">
			<view class="section-header">
				<text class="section-title">乘车人信息</text>
				<text class="section-count">共2位乘客</text>
			</view>

			<!-- 乘车人1 -->
			<view class="passenger-card">
				<view class="passenger-avatar">
					<text class="avatar-text">张</text>
				</view>

				<view class="passenger-info">
					<view class="info-row">
						<view class="info-item">
							<text class="item-label">姓名</text>
							<text class="item-value">张三</text>
						</view>
						<view class="info-item">
							<text class="item-label">证件号</text>
							<text class="item-value">610************1234</text>
						</view>
						<view class="info-item">
							<text class="item-label">票种</text>
							<text class="item-value">成人票</text>
						</view>
					</view>

					<view class="info-row">
						<view class="info-item">
							<text class="item-label">车位</text>
							<text class="item-value">1号车</text>
						</view>
						<view class="info-item">
							<text class="item-label">座位</text>
							<text class="item-value">12A</text>
						</view>
						<view class="info-item">
							<text class="item-label">班次</text>
							<text class="item-value">CX-20251110</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 乘车人2 -->
			<view class="passenger-card">
				<view class="passenger-avatar">
					<text class="avatar-text">李</text>
				</view>

				<view class="passenger-info">
					<view class="info-row">
						<view class="info-item">
							<text class="item-label">姓名</text>
							<text class="item-value">李四</text>
						</view>
						<view class="info-item">
							<text class="item-label">证件号</text>
							<text class="item-value">610************5678</text>
						</view>
						<view class="info-item">
							<text class="item-label">票种</text>
							<text class="item-value">成人票</text>
						</view>
					</view>

					<view class="info-row">
						<view class="info-item">
							<text class="item-label">车位</text>
							<text class="item-value">1号车</text>
						</view>
						<view class="info-item">
							<text class="item-label">座位</text>
							<text class="item-value">12B</text>
						</view>
						<view class="info-item">
							<text class="item-label">班次</text>
							<text class="item-value">CX-20251110</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 二维码区域 -->
		<view class="qr-section">
			<view class="qr-container">
				<view class="qr-code">
					<!-- 实际项目中替换为真实二维码 -->
					<image src="/static/qrcode.png" mode="widthFix" class="qr-img"></image>
				</view>
				<text class="qr-tip">凭此二维码可直接检票进站</text>
				<text class="qr-expire">二维码有效期至: 2025-11-10 08:35</text>
			</view>
		</view>

		<!-- 底部信息 -->
		<view class="bottom-section">
			<view class="refund-remind">
				<u-icon name="info-circle" color="#FF7D00" size="22" class="remind-icon"></u-icon>
				<text class="remind-text">发车前5分钟可在线退票，超时将无法办理</text>
			</view>

			<view class="action-buttons">
				<u-button @click="showNotice = true" text="查看退票规则" type="text" color="#666666"
					class="rule-btn"></u-button>
				<u-button text="联系客服" type="primary" color="$color" class="contact-btn" shape="circle"></u-button>
			</view>

			<u-popup :show="showNotice" mode="bottom" :round="20" :closeOnClickOverlay="false">
				<view class="notice-popup">
					<view class="notice-title">退票规则</view>
					<view class="notice-content">
						<view class="notice-item">1. 发车前5分钟可在线退票，超时将无法办理。</view>
						<view class="notice-item">2. 退票手续费为票价的10%，最低收费2元。</view>
						<view class="notice-item">3. 退票成功后，退款将在3个工作日内原路返回。</view>
					</view>
				</view>
				<view class="notice-btn">
					退票
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	// 站点信息
	const fromStation = ref('省西汽车站');
	const toStation = ref('兵马俑');
	const showNotice = ref(false);
</script>

<style lang="scss" scoped>
	$shadow-light: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	$border-radius: 16rpx;
	$spacing: 24rpx;

	.order-detail-page {
		background-color: #F7F8FA;
		min-height: 100vh;
		padding-bottom: 30rpx;
	}

	// 订单卡片样式
	.order-card {
		background-color: #FFFFFF;
		padding: $spacing;
		margin: 20rpx $spacing;
		border-radius: $border-radius;
		box-shadow: $shadow-light;

		.ride-date {
			font-size: 26rpx;
			color: #666666;
			margin-bottom: $spacing;
			display: flex;
			align-items: center;

			&::before {
				content: '';
				width: 8rpx;
				height: 8rpx;
				border-radius: 50%;
				background-color: $color;
				margin-right: 10rpx;
			}
		}

		.route-container {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			position: relative;

			.from-station,
			.to-station {
				display: flex;
				flex-direction: column;
				align-items: center;
				min-width: 140rpx;

				.station-name {
					font-size: 36rpx;
					color: #333333;
					font-weight: 600;
					margin-bottom: 8rpx;
				}

				.station-tag {
					font-size: 20rpx;
					padding: 2rpx 12rpx;
					border-radius: 12rpx;
					background-color: #F5F5F5;
					color: #666666;
				}
			}

			.route-info {
				flex: 1;
				margin: 0 16rpx;
				position: relative;

				.duration {
					font-size: 24rpx;
					color: #999999;
					display: block;
					text-align: center;
					margin-bottom: 12rpx;
					font-weight: 500;
				}

				.dashed-line {
					height: 2rpx;
					background: linear-gradient(90deg, #EEEEEE 50%, transparent 50%) repeat-x;
					background-size: 12rpx 2rpx;
					position: relative;

					.line-dot {
						position: absolute;
						width: 6rpx;
						height: 6rpx;
						border-radius: 50%;
						background-color: $color;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						box-shadow: 0 0 0 6rpx rgba(255, 125, 0, 0.1);
					}
				}
			}

			.ticket-count {
				width: 60rpx;
				height: 60rpx;
				background-color: $color;
				border-radius: 50%;
				color: #FFFFFF;
				font-size: 26rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 500;
				box-shadow: 0 4rpx 12rpx rgba(255, 125, 0, 0.2);
			}
		}

		.time-price {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			padding: 0 10rpx;

			.time-box,
			.price-box {
				display: flex;
				flex-direction: column;
			}

			.time-label,
			.price-label {
				font-size: 24rpx;
				color: #999999;
				margin-bottom: 6rpx;
			}

			.time-value {
				font-size: 30rpx;
				color: #333333;
				font-weight: 500;
			}

			.price-value {
				font-size: 30rpx;
				color: #FF4D4F;
				font-weight: 600;
			}
		}

		.arrive-info {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #666666;
			padding-top: 16rpx;
			border-top: 1px dashed #F2F2F2;

			.time-icon {
				margin-right: 10rpx;
			}
		}
	}

	// 乘车人信息区域
	.passenger-section {
		padding: 0 $spacing;
		margin-top: 10rpx;

		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 30rpx 0 20rpx;

			.section-title {
				font-size: 32rpx;
				color: #333333;
				font-weight: 600;
				position: relative;

				&::before {
					content: '';
					position: absolute;
					width: 8rpx;
					height: 28rpx;
					background-color: $color;
					left: -16rpx;
					top: 50%;
					transform: translateY(-50%);
					border-radius: 4rpx;
				}
			}

			.section-count {
				font-size: 24rpx;
				color: #999999;
			}
		}

		.passenger-card {
			background-color: #FFFFFF;
			border-radius: $border-radius;
			padding: $spacing;
			margin-bottom: 20rpx;
			box-shadow: $shadow-light;
			display: flex;
			align-items: flex-start;
			transition: transform 0.2s;

			&:hover {
				transform: translateY(-2rpx);
			}

			.passenger-avatar {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				background-color: $color;
				color: #FFFFFF;
				font-size: 30rpx;
				font-weight: 600;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
				flex-shrink: 0;
				box-shadow: 0 4rpx 10rpx rgba(255, 125, 0, 0.15);
			}

			.passenger-info {
				flex: 1;

				.info-row {
					display: flex;
					justify-content: space-between;
					margin-bottom: 20rpx;

					&:last-child {
						margin-bottom: 0;
					}
				}

				.info-item {
					flex: 1;

					&:not(:last-child) {
						padding-right: 10rpx;
					}
				}

				.item-label {
					font-size: 22rpx;
					color: #999999;
					display: block;
					margin-bottom: 6rpx;
				}

				.item-value {
					font-size: 26rpx;
					color: #333333;
					font-weight: 500;
				}
			}
		}
	}

	// 二维码区域
	.qr-section {
		padding: 0 $spacing;
		margin-top: 10rpx;

		.qr-container {
			background-color: #FFFFFF;
			border-radius: $border-radius;
			padding: 30rpx $spacing;
			box-shadow: $shadow-light;
			display: flex;
			flex-direction: column;
			align-items: center;

			.qr-code {
				width: 220rpx;
				height: 220rpx;
				background-color: #FFFFFF;
				padding: 15rpx;
				box-shadow: 0 0 15rpx rgba(0, 0, 0, 0.08);
				border-radius: 10rpx;
				margin-bottom: 20rpx;

				.qr-img {
					width: 100%;
					height: 100%;
				}
			}

			.qr-tip {
				font-size: 28rpx;
				color: #333333;
				font-weight: 500;
				margin-bottom: 10rpx;
			}

			.qr-expire {
				font-size: 22rpx;
				color: #999999;
			}
		}
	}

	// 底部区域
	.bottom-section {
		margin: 30rpx $spacing 50rpx;

		.refund-remind {
			background-color: rgba(255, 125, 0, 0.05);
			border-left: 4rpx solid $color;
			padding: 16rpx 20rpx;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;

			.remind-icon {
				margin-right: 12rpx;
			}

			.remind-text {
				font-size: 24rpx;
				color: #666666;
				line-height: 1.5;
			}
		}

		.action-buttons {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.rule-btn {
				font-size: 26rpx;
				padding: 0;
			}

			.contact-btn {
				font-size: 28rpx;
				padding: 0 40rpx;
				height: 80rpx;
				line-height: 80rpx;
			}
		}
	}

	.notice-popup {
		background-color: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		
		.notice-title {
			font-size: 32rpx;
			color: #333333;
			font-weight: 600;
			text-align: center;
			padding: 30rpx 0;
		}
		
		.notice-content {
			padding: 0 30rpx;
			max-height: 60vh;
			overflow-y: scroll;
			font-size: 28rpx;
			color: #666666;
			line-height: 1.5;
		}
	}
</style> 