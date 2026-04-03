<template>
	<view class="container">
		<view class="header">
			<view class="input-header">
				<text>陕Axxx123</text>
				<uni-icons type="bottom" size="16" color="#999"></uni-icons>
			</view>
			<view class="time-header">
				<view class="time-header-day">
					<text>2005年3月</text>
					<uni-icons type="bottom" size="16" color="#999"></uni-icons>
				</view>
				<view class="time-header-day">
					<text>支付方式</text>
					<uni-icons type="bottom" size="16" color="#999"></uni-icons>
				</view>
			</view>
		</view>
		<view class="invoicelist">
			<view class="invoicelist-card" v-for="(item,index) in invoiceList" :key="index">
				<view class="check-box">
					<up-checkbox :customStyle="{marginBottom: '4px'}" name="agree" usedAlone shape="circle" size="14"
						activeColor='#005FEE' v-model:checked="item.check">
					</up-checkbox>
					<text>选择</text>
				</view>
				<view class="boay-box">
					<view style="display: flex;">
						<view class="boay-box-1">
							<view class="boay-box-y">
								
							</view>
							<image :src="imgUrl+'img/xjt.png'" mode=""></image>
							<view class="boay-box-y">
								
							</view>
						</view>
						<view class="boay-box-left">
							<view class="gs-name">
								{{item.rkname}}
							</view>
							<view class="gs-time" style="margin-bottom: 40rpx;" >
								{{item.kstiem}}
							</view>
							<view class="gs-name">
								{{item.ckname}}
							</view>
							<view class="gs-time">
								{{item.jstiem}}
							</view>
						</view>
					</view>
					
					<view class="boay-box-right">
						<view class="gs-price">
							¥<text>{{item.price}}</text>
						</view>
						<view v-if="item.paytpye==1" class="gs-paytpye-wx">
							微信支付
						</view>
						<view v-else class="gs-paytpye-zfb">
							支付宝支付
						</view>
					</view>
				</view>

			</view>
		</view>
		<view class="footer-box">
			<view class="footer-box-left">
				<view class="check-box">
					<up-checkbox :customStyle="{marginBottom: '4px'}" name="agree" usedAlone shape="circle" size="14"
						activeColor='#005FEE' v-model:checked="check">
					</up-checkbox>
					<text>全选</text>
				</view>
				<view class="tj-Number">
					共选:<text>3</text> 条记录
				</view>
			</view>
			<view class="footer-box-right">
				<view class="right-1">
					<view class="tj-price">
						¥<text>384元</text>
					</view>
					<view class="tj-price-js">
						开票金额合计
					</view>
				</view>
				<view class="right-bot" @click="toInvoicing" >
					下一步
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '../../config';

	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const check = ref(false);
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});
	const invoiceList = ref([
		{
			paytpye: 1,
			kstiem: '2025-03-31 19:25:37',
			jstiem: '2025-03-31 19:25:37',
			price: 158,
			rkname: '入口收费站名称',
			ckname: '出口收费站名称',
			check: false
		},
		{
			paytpye: 2,
			kstiem: '2025-03-31 19:25:37',
			jstiem: '2025-03-31 19:25:37',
			price: 158,
			rkname: '入口收费站名称',
			ckname: '出口收费站名称',
			check: false
		},
		{
			paytpye: 1,
			kstiem: '2025-03-31 19:25:37',
			jstiem: '2025-03-31 19:25:37',
			price: 158,
			rkname: '入口收费站名称',
			ckname: '出口收费站名称',
			check: false
		}
	])
	const toInvoicing = () => {
		uni.navigateTo({
			url: '../../pages_A/tollInvoice/Invoicing',
		})
	}
</script>

<style scoped lang="scss">
	.boay-box-1{
		display: flex;
		flex-direction: column;
		margin-right: 24rpx;
		align-items: center;
		image{
			width: 16rpx;
			height: 72rpx;
			margin-bottom: 18rpx;
			margin-top: 18rpx;
			border-radius: 2rpx 2rpx 2rpx 2rpx;
		}
		.boay-box-y{
			width: 24rpx;
			height: 24rpx;
			background: #FFFFFF;
			border: 4rpx solid #C9C9C9;
			border-radius: 50%;
		}
	}
	
	.container {
		height: calc(100vh - 88rpx);
		background: #F6F5F4;
	}
	.header {
		background: #FCFCFC;
		padding: 40rpx;
	}
	.invoicelist {
		padding: 32rpx;
		padding-bottom: 164rpx;
	}
	.footer-box {
		width: 670rpx;
		height: 160rpx;
		background: #FFFFFF;
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.03);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		border: 2rpx solid rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 40rpx;
		padding-right: 40rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		.footer-box-left {
			.check-box {
				display: flex;
			}

			.tj-Number {
				font-weight: 350;
				font-size: 24rpx;
				color: #666666;
				line-height: 48rpx;

				text {
					font-weight: 700;
					font-size: 36rpx;
					color: $color;
					line-height: 48rpx;
				}
			}
		}

		.footer-box-right {
			display: flex;
			align-items: center;

			.right-1 {
					margin-right: 32rpx;
				.tj-price {
					font-weight: 700;
					font-size: 28rpx;
					color: #FF6200;
					line-height: 72rpx;
				
					text {
						font-size: 36rpx;
					}
				}

				.tj-price-js {
					font-weight: 350;
					font-size: 24rpx;
					color: #666666;
					line-height: 24rpx;
				}
			}

			.right-bot {
				width: 192rpx;
				height: 96rpx;
				background: $bgLgColor;
				border-radius: 48rpx 48rpx 48rpx 48rpx;
				text-align: center;
				line-height: 96rpx;
				font-weight: 700;
				font-size: 32rpx;
				color: #FFFFFF;
			}
		}
	}

	.invoicelist-card {
		padding: 32rpx;
		width: 622rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);
		margin-bottom: 24rpx;
		border-radius: 24rpx;
		.check-box {
			display: flex;
		}

	}

	.boay-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 34rpx;

		.gs-name {
			font-weight: 700;
			font-size: 28rpx;
			color: #333333;
			margin-bottom: 24rpx;
		}

		.gs-time {
			font-weight: 400;
			font-size: 24rpx;
			color: #999999;

		}

		.gs-price {
			font-weight: 700;
			font-size: 28rpx;
			color: #FF6200;
			text-align: left;
			font-style: normal;
			text-transform: none;
			text{
				font-size: 48rpx;
			}
		}

		.gs-paytpye-wx {
			width: 128rpx;
			height: 48rpx;
			background: rgba(0, 128, 66, 0.06);
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			text-align: center;
			line-height: 48rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #00964E;
			margin-top: 20rpx;
		}
		.gs-paytpye-zfb {
			width: 152rpx;
			height: 48rpx;
			background: rgba(0,43,128,0.06);
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			text-align: center;
			line-height: 48rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #005AE1;
			margin-top: 20rpx;
		}
	}

	.input-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 32rpx;
		padding-right: 32rpx;
		width: 604rpx;
		height: 72rpx;
		background: #FCFCFC;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #EBEBEB;

		text {
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;
			line-height: 28rpx;

		}
	}

	.time-header {
		display: flex;
		align-items: center;
		margin-top: 28rpx;

		.time-header-day {
			width: 220rpx;
			height: 56rpx;
			background: #F0F0F0;
			border-radius: 28rpx 28rpx 28rpx 28rpx;
			text-align: center;
			line-height: 56rpx;
			margin-right: 24rpx;

			text {
				font-weight: 400;
				font-size: 28rpx;
				color: #666666;
				line-height: 28rpx;
				margin-right: 20rpx;

			}
		}
	}
</style>