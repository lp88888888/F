<template>
	<view class="searchView" :data-theme="pageTheme">
		<view class="container">
			<up-sticky>
				<view>
					<up-navbar title="开票记录" leftIconColor="#000000" bgColor="transparent" @leftClick="toBack"
						:placeholder="true" :fixed="true" />
				</view>

				<view class="tab-bar-bql">
					<view v-for="(item, index) in tabs" :key="index"
						:class="['tab-item', { active: activeisow == index }]" @click="tabChange(index, item.value)">
						{{ item.label }}
					</view>
				</view>
			</up-sticky>

			<view class="invoice-page">
				<!-- 订单列表滚动区 -->
				<scroll-view class="order-scroll" scroll-y>
					<view v-for="item in orderList" :key="item.id" class="order-card"
						@click="toNav('/pages_F/myInvoice/invoicedetails?id='+ item.id)">
						<!-- 订单头部：时间+状态 -->
						<view class="order-header">
							<text class="order-time" v-if="item.invoiceStatus==5 || item.invoiceStatus==2">预计10个工作日完成</text>
							<text class="order-time"
								v-if="item.invoiceStatus==0">下单时间:{{ item.baseOrderInfoResponse.createTime }}</text>
							<text class="order-time" v-if="item.invoiceStatus==1">开具时间:{{ item.auditTime }}</text>
							<text class="order-time" v-if="item.invoiceStatus==3 || item.invoiceStatus==2"></text>
							<text class="order-status" :class="{
							    'status-1': item.invoiceStatus === 1,
							    'status-3': item.invoiceStatus === 3,
							    'status-5': item.invoiceStatus === 5
							  }">
								{{ formatCardStatusStr(item.invoiceStatus) }}
							</text>

						</view>
						<!-- 订单主体内容 -->
						<view class="order-body">
							<!-- 订单详情 -->
							<view class="order-detail">
								<text class="scenic-name">{{ item.orderTitle }}
									<text v-if="item.baseOrderInfoResponse?.quantity">x</text>
									<text
										v-if="item.baseOrderInfoResponse?.quantity">{{ item.baseOrderInfoResponse?.quantity }}</text>
								</text>
								<view class="ticket-wrap">
									<view class="ticket-info">
										<text class="ticket-type"
											v-if="item.baseOrderInfoResponse?.id">订单号：{{ item.baseOrderInfoResponse?.id}}</text>
										<text class="ticket-type">申请时间：{{ item.applyTime}}</text>
									</view>
									<view
										style="display: flex; justify-content: space-between; align-items: center; margin-top: 20rpx;">
										<!-- 左侧：开票金额（靠左） -->
										<text class="ticket-price">
											开票金额：<text
												style="color: #FF5405; font-size: 32rpx;">{{ item.invoiceAmount }}</text>元
										</text>

										<!-- 右侧：按钮组（靠右，内部按钮间距控制） -->
										<view style="display: flex; gap: 20rpx; align-items: center;">
											<!-- 申请重开按钮 -->
											<view @click.stop="toNav()">
											<view class="ticket-btn"
												v-if="(item.invoiceStatus == 1 && item.id) || item.invoiceStatus == 3"
												@click="item.invoiceStatus == 1 ? topath(item.id) : toNav('/pages_F/myInvoice/invoice?id='+item.id)">
												申请重开
											</view>
											</view>
											<!-- 下载发票按钮 -->
											<view @click.stop="toNav()">
												<view class="ticket-btn" v-if="item.invoiceStatus == 1"
													@click="handleDownload(item.invoiceUrl)">
													下载发票
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view style="height: 400rpx;"></view>
					<view class="empty-data" v-if="orderList.length == 0">
						<ser-empty></ser-empty>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, watch, onMounted } from "vue";
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import { myRecords } from "@/api/invoice";
	import { useTheme } from "@/composables/useTheme";
	import { toNav, toBack } from '@/utils/route';
	const { themeStore, pageTheme } = useTheme();
	const tollStatiobj = ref({});
	const activeisow = ref('');
	const activeVal = ref('');
	const icoUrl = ref(themeStore.imgUrl);
	// 多选模式开关
	const isMultiSelect = ref(false);
	const invoiceUrl = ref('');
	const fileName = ref("发票.pdf");
	// 标签列表
	const tabs = [
		{ label: "全部", value: "" },
		{ label: "开票中", value: "5" },
		{ label: "已开票", value: "1" },
		{ label: "已驳回", value: "3" },
		{ label: "重开中", value: "2" },
	];
	const formatCardStatusStr = (num) => {
		switch (num) {
			case 0: return '待开票';
			case 1: return '已开票';
			case 2: return '重开中';
			case 3: return '已驳回';
			case 5: return '开票中';
			default: return '';
		}
	}
	const topath = (val) => {
		uni.navigateTo({
			url: "/pages_F/myInvoice/invoice?id=" + val
		})
	}
	const tabChange = async (index : number, val : string) => {
		activeisow.value = index;
		activeVal.value = val
		orderList.value = [];
		myRecordsFun();
	};
	// 模拟订单数据（id 转为字符串）
	const orderList = ref<OrderItem[]>([]);
	const myRecordsFun = () => {
		let params = {
			invoiceStatus: activeVal.value,
			pageNum: 1,
			pageSize: 99
		}
		myRecords(params).then(res => {
			if (res.code == 200) {
				orderList.value = res.data.list;
			}
		}).catch(err => {

		})
	}
	const handleDownload = async (url) => {
		if (!url) {
			uni.showToast({ title: '下载失败', icon: 'none' })
			return
		}
		// #ifdef APP
		downloadForApp(url)
		// #endif
		// #ifdef MP-WEIXIN
		downloadForWechatMini(url)
		// #endif
	}
	// 1. App端
	const downloadForApp = (url) => {
	   if (!url) return uni.showToast({ title: '链接无效', icon: 'none' });
	     plus.runtime.openURL(
	      url,
	       (err) => {
	         // 打开失败回调（如URL格式错误、无浏览器应用等）
	         uni.showToast({ title: '打开失败', icon: 'none' });
	         console.error('打开浏览器失败:', err);
	       }
	     );
	}

	// 3. 微信小程序端
	const downloadForWechatMini = (url) => {
		uni.downloadFile({
			url: url,
			success: (res) => {
				if (res.statusCode === 200) {
					uni.saveFile({
						tempFilePath: res.tempFilePath,
						success: (saveRes) => {
							uni.hideLoading()
							uni.showModal({
								title: '下载完成',
								content: '文件已暂存，是否立即查看并保存到系统？',
								confirmText: '查看',
								success: (modalRes) => {
									if (modalRes.confirm) {
										uni.openDocument({
											filePath: saveRes.savedFilePath,
											fileType: 'pdf',
											showMenu: true
										})
									}
								}
							})
						},
						fail: () => {
							uni.hideLoading()
							uni.openDocument({
								filePath: res.tempFilePath,
								fileType: 'pdf',
								showMenu: true
							})
						}
					})
				} else {
					handleFail(`下载失败，状态码：${res.statusCode}`)
				}
			},
			fail: (err) => handleFail(`下载失败：${JSON.stringify(err)}`)
		})
	}
	onShow(() => {
		myRecordsFun()
	})
</script>

<style lang="scss" scoped>
	.status-1 {
		color: #333;
	}

	.status-3 {
		color: #FD4848;
	}

	.status-5 {
		color: #4881F5;
	}

	/* 页面全局背景 */
	.searchView {
		height: 100vh;
		overflow: hidden;
	}

	.container {
		box-sizing: border-box;
		padding: 120rpx 30rpx 80rpx;
		height: 26vh;
		background: var(--bgqscolor);
		display: flex;
		flex-direction: column;
	}

	.tab-bar-bql {
		display: inline-flex;
		align-items: center;
		padding-bottom: 15rpx;
		color: #333333;
		position: relative;
		margin: 20rpx 0 0;
	}

	.tab-item {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8rpx 24rpx;
		margin-right:14rpx;
		text-align: center;
		font-size: 28rpx;
		cursor: pointer;
		white-space: nowrap;
		position: relative;
		background: #fff;
		border-radius: 8rpx;
	}

	.tab-item.active {
		color: var(--primary-color);
		transform: scale(1.05);
		border: 1px solid var(--secondary-color);
		background: var(--bgqtmd);
		border-radius: 8rpx;
		font-weight: bold;
	}

	.tab-item.active::after {
		content: "";
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 12rpx;
		background: var(--tab-active-bg);
		background-size: 100% 100%;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.invoice-page {
		min-height: 100vh;
		box-sizing: border-box;
		padding-bottom: 120rpx;
		margin-top: -20rpx;
	}

	.order-scroll {
		height: calc(100vh - 120rpx);
		padding: 30rpx 0;
		box-sizing: border-box;
	}

	.order-card {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0rpx 4rpx 16rpx 0rpx var(--bgqtmd);
		transition: all 0.2s ease;

		&.order-card-active {
			border-color: var(--primary-color);
		}
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20rpx;
		margin-bottom: 25rpx;
		border-bottom: 1rpx solid #f0f0f0;

		.order-time {
			font-size: 24rpx;
			color: #333;
		}

		.order-status {
			font-size: 24rpx;
			font-weight: 500;
		}
	}

	.order-body {
		display: flex;
		align-items: flex-start;
		gap: 20rpx;
	}

	.order-detail {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20rpx;

		.scenic-name {
			font-size: 32rpx;
			color: #333;
			font-weight: 700;
			line-height: 1.4;
		}
	}

	.ticket-wrap {
		.scenic-img {
			width: 160rpx;
			height: 120rpx;
			border-radius: 12rpx;
			overflow: hidden;
		}

		.ticket-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 16rpx;

			.ticket-type {
				font-size: 28rpx;
				color: #666;
			}

			.ticket-price {
				font-size: 28rpx;
				color: #666;
				font-weight: 400;
			}
		}
	}

	.bottom-bar {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 120rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
		z-index: 999;
		gap: 20rpx;

		.multi-select-btn {
			cursor: pointer;
			font-size: 28rpx;
			margin-left: 20px;
		}

		.multi-select-actions {
			display: flex;
			align-items: center;
			gap: 40rpx;
		}

		.select-all-wrap {
			display: flex;
			align-items: center;
			gap: 12rpx;
			flex-shrink: 0;

			.select-all-text {
				font-size: 30rpx;
				color: #333;
			}
		}

		.selected-tip {
			flex: 1;
			font-size: 26rpx;
			color: #ff6b35;
			font-weight: 500;
		}

		.invoice-btn {
			width: 200rpx;
			height: 80rpx;
			line-height: 80rpx;
			color: #fff;
			border-radius: 40rpx;
			font-size: 32rpx;
			font-weight: 500;
			border: none;
			padding: 0;
			margin: 0;
			flex-shrink: 0;
			background: var(--but-color-line);

			&:disabled {
				background: #b7e8a9;
				color: #fff;
			}
		}
	}

	/* 顶部日期筛选栏 */
	.date-filter-wrap {
		display: flex;
		align-items: center;
		gap: 20rpx;

		.date-item {
			display: flex;
			align-items: center;
			gap: 8rpx;
			padding: 8rpx 0;

			.date-text {
				font-size: 24rpx;
				color: #333;
				font-weight: 500;
			}
		}

		.separator {
			font-size: 28rpx;
			color: #666;
		}

		.invoice-record {
			margin-left: auto;
			display: flex;
			align-items: center;
			gap: 20rpx;

			.record-text {
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
				text-decoration: underline;
			}
		}
	}

	.ticket-btn {
		text-align: center;
		padding: 10rpx 20rpx;
		border: 1px solid var(--secondary-color);
		border-radius: 50rpx;
		font-size: 24rpx;
		color: var(--primary-color);
	}

	::v-deep .u-navbar__placeholder {
		height: 70rpx !important;
	}
</style>