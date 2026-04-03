<template>
	<view class="searchView" :data-theme="pageTheme">
		<view class="container">
			<up-sticky>
				<view>
					<up-navbar title="我的发票" leftIconColor="#000000" bgColor="transparent" @leftClick="toBack"
						:placeholder="true" :fixed="true" />
				</view>

				<view class="tab-bar-bql">
					<view v-for="(item, index) in tabs" :key="index"
						:class="['tab-item', { active: activeisow == index }]"
						:style="{ '--tab-active-bg': `url(${icoUrl}tabimg.png)` }"
						@click="tabChange(index, item.value)">
						{{ item.label }}
					</view>
				</view>
				<!-- 顶部时间筛选栏 -->
				<view class="date-filter-wrap">
					<!-- 开始日期选择 -->
					<view class="date-item" @click="showStartPicker = true">
						<text class="date-text">{{ startDate?startDate:'选择开始时间' }}</text>
						<u-icon name="arrow-down" size="14"></u-icon>
					</view>
					<text class="separator">至</text>
					<!-- 结束日期选择 -->
					<view class="date-item" @click="showEndPicker = true">
						<text class="date-text">{{ endDate?endDate:'选择结束时间' }}</text>
						<u-icon name="arrow-down" size="14"></u-icon>
					</view>
					<view class="invoice-record" @click="toNav('/pages_F/myInvoice/invoicingcenter')">
						<up-icon name="coupon-fill" size="18"></up-icon>
						<text class="record-text">开票记录</text>
					</view>
				</view>
			</up-sticky>

			<view class="invoice-page">
				<!-- 订单列表滚动区 -->
				<scroll-view class="order-scroll" scroll-y>
					<view v-for="item in orderList" :key="item.id" v-if="activeisow ==0" class="order-card"
						:class="{ 'order-card-active': selectedIds.includes(item.id) }">
						<!-- 订单头部：时间+状态 -->
						<view class="order-header">
							<text class="order-time">下单时间:{{ item.orderTime }}</text>
							<text class="order-status">{{formatCardStatusStr(item.invoiceStatus)}}</text>
						</view>

						<!-- 订单主体内容 -->
						<view class="order-body">
							<!-- 复选框：仅多选模式下显示 -->
							<view v-if="item.invoiceStatus==0">
								<u-checkbox v-if="isMultiSelect" :checked="selectedIds.includes(item.id)" shape="circle"
									:active-color="themeStore.themeColors.$color" size="36rpx"
									@change="(checked) => handleSingleCheck(checked, item.id, item?.orderAmount || 0)" />
							</view>
							<!-- 订单详情 -->
							<view class="order-detail">
								<text class="scenic-name">{{ item.orderTitle }}</text>
								<view class="ticket-wrap">
									<up-image class="scenic-img" :src="icoUrl+'lyjq_bg.png'" width="80" height="80"
										></up-image>
									<view class="ticket-info">
										<text class="ticket-type">门票:成人票{{item.baseOrderInfoResponse.quantity}}张</text>
										<text class="ticket-price">总价:{{ item.orderAmount}}元</text>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view v-if="activeisow ==1">
						<view v-for="item in orderList" :key="item.id" class="order-card"
							:class="{ 'order-card-active': selectedIds.includes(item.id) }">
							<!-- 订单头部：时间+状态 -->
							<view class="order-header">
								<text class="order-time">下单时间:{{ item.orderTime }}</text>
								<text class="order-status">{{formatCardStatusStr(item.invoiceStatus)}}</text>
							</view>

							<!-- 订单主体内容 -->
							<view class="order-body">
								<!-- 复选框：仅多选模式下显示 -->
								<view v-if="item.invoiceStatus==0">
									<u-checkbox v-if="isMultiSelect" :checked="selectedIds.includes(item.id)"
										shape="circle" :active-color="themeStore.themeColors.$color" size="36rpx"
										@change="(checked) => handleSingleCheck(checked, item.id, item?.orderAmount || 0)" />
								</view>
								<!-- 订单详情 -->
								<view class="order-detail">
									<text class="scenic-name">{{ item.orderTitle }}</text>
									<view class="ticket-wrap">
										<up-image class="scenic-img" :src="item.orderImage" radius='8'
										 mode='aspectFill'
										 width="80" height="80"
											></up-image>
										<view class="ticket-info">
											<text class="ticket-type">门票:成人票{{item.baseOrderInfoResponse.manNumber}}张</text>
											<text class="ticket-type">门票:儿童票{{item.baseOrderInfoResponse.childNumber}}张</text>
											<text class="ticket-price">总价:{{ item.orderAmount}}元</text>
										</view>
									</view>
								</view>
							</view>
						</view>

					</view>
					<view class="empty-data" v-if="orderList.length == 0">
						<ser-empty></ser-empty>
					</view>
					<view style="height: 400rpx;"></view>
				</scroll-view>

				<!-- 底部固定操作栏 -->
				<view class="bottom-bar">
					<!-- 点击切换多选模式 -->
					<view v-if="!isMultiSelect" class="multi-select-btn" @click="toggleMultiSelect">
						多选开票
					</view>
					<!-- 全选：仅多选模式下显示 -->
					<view v-if="isMultiSelect" class="multi-select-actions">
						<view class="select-all-wrap">
							<u-checkbox :checked="selectAll" shape="circle"
								:active-color="themeStore.themeColors.$color" size="36rpx" @change="handleSelectAll" />
							<text class="select-all-text">全部</text>
						</view>

						<view class="selected-tip">
							<text>已选中{{ selectedCount }}个，合计¥{{ selectedTotal.toFixed(2) }}</text>
						</view>
					</view>
					<button class="invoice-btn" @click="handleGoInvoice">去开票</button>
				</view>
			</view>
		</view>
		<!-- 开始日期选择器 (已替换为 up-datetime-picker) -->
		<up-datetime-picker v-model:show="showStartPicker" v-model="startDateTemp" mode="date" :maxDate="Date.now()"
			@cancel='showStartPickerFun' @confirm="handleStartConfirm"></up-datetime-picker>

		<!-- 结束日期选择器 -->
		<up-datetime-picker v-model:show="showEndPicker" v-model="endDateTemp" mode="date" :minDate="startDateTemp"
			:maxDate="Date.now()" @cancel='showEndPickerFun' @confirm="handleEndConfirm"></up-datetime-picker>
		<PageDurationTracker pageName="我的发票" />
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, watch, onMounted } from "vue";
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import { payOrderInfo } from '@/api/home';
	import { useTheme } from "@/composables/useTheme";
	import { toNav, toBack } from '@/utils/route';

	const orderId = ref('');

	const tollStatiobj = ref({});
	const activeisow = ref(0);
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const isMultiSelect = ref(false);
	const shouldClearSelect = ref(false);
	// 标签列表
	const tabs = [
		{ label: "景区门票", value: "0" },
		{ label: "自驾行", value: "1" },
	];

	// 订单数据TS类型定义
	interface OrderItem {
		id : string;
		orderTime : string;
		status : string;
		scenicName : string;
		ticketType : string;
		ticketNum : number;
		orderAmount : number;
		scenicImg : string;
		[key : string] : any;
	}

	const orderList = ref<OrderItem[]>([]);
	const selectedIds = ref([]);
	const selectAll = ref(false);

	// ===================== 新增：本地缓存相关 =====================
	const formatCardStatusStr = (num) => {
		switch (num) {
			case 0:
				return '待开票';
			case 1:
				return '已开票';
			case 2:
				return '重开发票';
			case 3:
				return '驳回开票';
			case 5:
				return '开票中';
		}
	}
	const selectedInvoiceOrders = ref<{ id : string; amount : number }[]>([]);
	const syncStorage = () => {
	  const newData = Array.from(
	    new Map(selectedInvoiceOrders.value.map(item => [item.id, { orderId: item.id, invoiceAmount: item.amount }])).values()
	  );
	  uni.setStorageSync('selectedInvoiceOrders', newData);
	};
	// ===================== 日期相关 =====================
	const getCurrentDate = () : string => {
		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const startDate = ref<string>('');
	const endDate = ref<string>('');
	const startDateTemp = ref<number>(Date.now());
	const endDateTemp = ref<number>(Date.now());
	const showStartPicker = ref<boolean>(false);
	const showEndPicker = ref<boolean>(false);

	const openStartPicker = () => {
		startDateTemp.value = new Date(startDate.value).getTime();
		showStartPicker.value = true;
	};
	const openEndPicker = () => {
		endDateTemp.value = new Date(endDate.value).getTime();
		showEndPicker.value = true;
	};
	const handleStartConfirm = () => {
		const date = new Date(startDateTemp.value);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		startDate.value = `${year}-${month}-${day}`;
		if (endDateTemp.value < startDateTemp.value) {
			endDate.value = startDate.value;
			endDateTemp.value = startDateTemp.value;
		}
		isMultiSelect.value = false
		showStartPicker.value = false;
		selectAll.value = false
		selectedIds.value = [];
		selectedInvoiceOrders.value = [];
		payOrderInfoFun()
	};

	const handleEndConfirm = () => {
		const date = new Date(endDateTemp.value);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		endDate.value = `${year}-${month}-${day}`;
		isMultiSelect.value = false
		showEndPicker.value = false
		selectAll.value = false
		selectedIds.value = [];
		selectedInvoiceOrders.value = [];
		payOrderInfoFun()
	};
	const showStartPickerFun = () => {
		showStartPicker.value = false
		startDate.value = ''
		payOrderInfoFun()
	}
	const showEndPickerFun = () => {
		showEndPicker.value = false
		endDate.value = ''
		payOrderInfoFun()
	}
	// ===================== 核心方法 =====================
	const payOrderInfoFun = async () => {
		const params = {
			payTimeStart: startDate.value ? `${startDate.value} 00:00:00` : '',
			payTimeEnd: endDate.value ? `${endDate.value} 23:59:59` : '',
			bizOrderType: activeisow.value === 0 ? '1' : '6',
			payStatus: '6',
			invoiceStatus: '0',
			pageNum: 1,
			pageSize: 999
		};
		try {
			const res = await payOrderInfo(params);
			if (res.code == 200) {
				orderList.value = res.data.list;
			}
		} catch (error) {
			console.error('获取订单列表失败：', error);
		}
	};

	const tabChange = async (index : number, val : string) => {
		activeisow.value = index;
		selectedIds.value = [];
		// isMultiSelect.value = false
		selectAll.value = false
		selectedInvoiceOrders.value = [];
		syncStorage();
		await payOrderInfoFun();
	};

	const selectedCount = computed(() => selectedIds.value.length);
	const selectedTotal = computed(() =>
		orderList.value.reduce((sum, item) => {
			if (selectedIds.value.includes(item.id)) {
				// 兼容两种订单金额
				return sum + (item.orderAmount || item.baseOrderInfoResponse?.orderAmount || 0)
			}
			return sum;
		}, 0)
	);
		const handleSingleCheck = (checked : boolean, id : string, amount : number) => {
		  amount = Number(amount) || 0;
		  if (checked) {
			if (!selectedIds.value.includes(id)) {
			  selectedIds.value.push(id);
			  selectedInvoiceOrders.value.push({ id, amount });
			  selectAll.value = true
			}
		  } else {
			const index = selectedIds.value.indexOf(id);
			if (index > -1) {
			  selectedIds.value.splice(index, 1);
			  selectedInvoiceOrders.value = selectedInvoiceOrders.value.filter(item => item.id !== id);
			  selectAll.value = false
			}
		  }
		  syncStorage();
		  // 这里删除所有 selectAll 手动赋值！
		};

	// 全选（带缓存）
	const handleSelectAll = (checked : boolean) => {
		if (checked) {
			selectedIds.value = orderList.value.map(item => item.id);
			// 兼容景区门票 + 自驾行，自动取正确金额
			selectedInvoiceOrders.value = orderList.value.map(item => ({
				id: item.id,
				amount: Number(item.orderAmount || item.baseOrderInfoResponse?.orderAmount) || 0
			}));
		} else {
			selectedIds.value = [];
			selectedInvoiceOrders.value = [];
		}
		syncStorage();
	};

	// 切换多选模式（带缓存清空）
	const toggleMultiSelect = () => {
		isMultiSelect.value = !isMultiSelect.value;
		if (!isMultiSelect.value) {
			selectAll.value = false
			selectedIds.value = [];
			selectedInvoiceOrders.value = [];
			syncStorage();
		} else {
			selectedIds.value = [];
			selectedInvoiceOrders.value = [];
		}
	};

	const handleGoInvoice = () => {
		if (!selectedCount.value) {
			uni.showToast({ title: `请选择开票订单`, icon: "none" });
			return;
		}
		let money = selectedTotal.value.toFixed(2)
		uni.navigateTo({ url: '/pages_F/myInvoice/invoice?money=' + money });
	};

	onLoad(async (options) => {
		if (options.type) {
			activeisow.value = Number(options.type);
		}
		await payOrderInfoFun();
		if (options?.orderId) {
			const ids = options.orderId.split(',');
			selectedIds.value = ids;
			selectedInvoiceOrders.value = orderList.value
				.filter(item => ids.includes(item.id))
				.map(item => ({ id: item.id, amount: item.orderAmount }));
			syncStorage();
			isMultiSelect.value = true;
			orderId.value = options.orderId;
		} else {
			isMultiSelect.value = true
			payOrderInfoFun();
		}
	});
	onShow(()=>{
		let selecteShowe=uni.getStorageSync('selecteShowe')
		if (selecteShowe==1) {
			let newData=[]
			payOrderInfoFun()
			selectAll.value = false
			selectedIds.value = [];
			selectedInvoiceOrders.value = [];
			uni.removeStorageSync('selecteShowe')
			uni.setStorageSync('selectedInvoiceOrders', newData);
		}
	})
</script>

<style lang="scss" scoped>
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
		padding-bottom: 30rpx;
		color: #333333;
		position: relative;
	}

	.tab-item {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8rpx 0;
		margin-right: 40rpx;
		text-align: center;
		font-size: 28rpx;
		line-height: 1.4;
		cursor: pointer;
		transition: all 0.3s ease;
		white-space: nowrap;
		position: relative;
	}

	.tab-item.active {
		color: #333333;
		font-weight: bold;
		transform: scale(1.05);
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
			border: 1px solid var(--primary-color)
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
			color: #333;
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
		display: flex;
		align-items: center;
		gap: 24rpx;

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
		padding: 0 40rpx;
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
			gap: 8rpx;

			.record-text {
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
				text-decoration: underline;
			}
		}
	}

	.list2-item {
		background: #FFFFFF;
		border-radius: 20rpx;
		margin: 0 0 40rpx;
		padding: 26rpx 20rpx;
		box-shadow: 0 4rpx 16rpx 0 var(--bgqtmd);

		.lingqu-text-1 {
			font-weight: 400;
			font-size: 26rpx;
			color: #666666;
		}

		.lingqu-text-2 {
			font-weight: 400;
			font-size: 26rpx;
			color: var(--primary-color);
		}

		.card-h {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 102rpx;

		}

		.list-header {

			.label {
				width: 60rpx;
				height: 28rpx;
				border-radius: 6rpx;
				border: 1px solid var(--primary-color);
				font-weight: 500;
				font-size: 22rpx;
				color: var(--primary-color);
				text-align: center;
				line-height: 28rpx;
			}

			.status-txt {
				width: 116rpx;
				height: 40rpx;
				line-height: 40rpx;
				background: #FF5A27;
				border-radius: 16rpx;
				text-align: center;
			}

			.time {
				font-weight: 500;
				font-size: 26rpx;
				color: #FF5A27;
				width: 220rpx;
				height: 32rpx;
				line-height: 32rpx;
				background: #FFF3EE;
				border-radius: 16rpx;
				text-align: center;
			}
		}

		.address {
			width: 626rpx;
			height: 66rpx;
			background: #FFFBF6;
			border-radius: 16rpx;
			font-weight: 500;
			font-size: 24rpx;
			color: #000000;
			padding-left: 27rpx;
			line-height: 66rpx
		}

		.list-con {
			border-bottom: 1rpx solid #EEEEEE;

			.food-img {
				width: 136rpx;
				height: 136rpx;
				background: #F5F5F5;
				border-radius: 16rpx;
				margin-right: 15rpx;
			}

			.food-con {
				justify-content: space-around;

				.food-title {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					width: 320rpx;
				}
			}

			.total {
				align-items: flex-end;
				width: 160rpx;
				height: 136rpx;
				background: #FFFFFF;
				opacity: 0.93;
			}
		}

		.list-bottom {
			margin-top: 18rpx;

			.cancel-btn {
				width: 160rpx;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 30rpx;
				border: 1px solid #CCCCCC;
				font-weight: 500;
				font-size: 28rpx;
				color: #666666;
				text-align: center;
			}

			.pay-btn {
				width: 150rpx;
				height: 50rpx;
				line-height: 50rpx;
				border-radius: 30rpx;
				border: 1px solid var(--primary-color);
				font-weight: 500;
				font-size: 28rpx;
				color: var(--primary-color);
				text-align: center;
			}
		}

	}

	::v-deep .u-navbar__placeholder {
		height: 70rpx !important;
	}
</style>