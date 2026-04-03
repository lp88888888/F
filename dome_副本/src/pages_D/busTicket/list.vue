<template>
	<view class="container_bg" :style="{ background: themeStore.themeColors.$pageBgColor }"></view>
	<view class="container" :data-theme="pageTheme">
		<!-- <cos-header
			title="订单"
			:background-color="backgroundColor"
			style="position: fixed; top: 0; z-index: 999"
			:font-color="fontColor"
			:fixed="fixed"
			:defaultNavBarheight="100"
		></cos-header> -->
		<up-navbar title="订单" bgColor="transparent" autoBack placeholder :fixed="true"></up-navbar>
		<!-- 顶部标签栏 -->
		<view class="tab-con" :style="{ top: navBarHeight + 'px' }">
			<view class="search-box">
				<up-input placeholder="搜索" v-model="searchTex" border="none" shape="circle" height="35" @change="inputConfirm">
					<template #prefix>
						<up-icon name="search" color="#000000" size="24"></up-icon>
					</template>
				</up-input>
			</view>
			<view class="tab-con1">
				<view v-for="(tab, index) in tabs" :key="index" class="tab-item" @click="tabChange(index)">
					<text :class="['tab-text', tabIndex === tab.value ? 'tab-select' : 'tab-normal']">
						{{ tab.label }}
					</text>
					<image v-if="tabIndex === tab.value" style="width: 30rpx; height: 8rpx" :src="imgUrl + 'zcby.png'" mode=""></image>
					<!-- <view  class="tab-line"></view> -->
				</view>
			</view>
			<view class="filter-bar">
				<view class="filter-item filter-ls" @click="opentime">
					<view class="filter-box flex ali-cen">
						<text class="active">
							{{ startTime && endTime ? `${startTime} 至 ${endTime}` : '选择时间范围' }}
						</text>
						<view class="down">
							<up-icon name="arrow-down" size="11"></up-icon>
						</view>
					</view>
					<!-- 重置按钮 -->
					<view v-if="startTime && endTime" class="reset-btn" @click.stop="resetTime"> 重置 </view>
				</view>
			</view>
		</view>

		<!-- 列表区域 -->
		<scroll-view scroll-y class="list-con" @scrolltolower="onReachBottom">
			<!-- 订单列表 -->
			<view v-if="addgasolinelist.length">
				<view v-for="item in addgasolinelist" :key="item.id" class="item-con" @click="itemClick(item)">
					<!-- 主体：行程信息 -->
					<view class="trip-info">
						<!-- 左侧：时间 -->
						<view class="time-box">
							<text class="time">{{ item.departTime }}</text>
							<br />
							<text class="duration">{{ item.departDate }}</text>
						</view>

						<!-- 中间：路线 -->
						<view class="route">
							<view class="station-item">
								<view style="width: 14rpx; height: 14rpx; border: 2rpx solid #4381ed; margin-right: 28rpx; border-radius: 14rpx"> </view>
								<text class="station-name">{{ item.startStationName }}</text>
							</view>
							<view class="arrow"></view>
							<view class="station-item">
								<view style="width: 14rpx; height: 14rpx; border: 2rpx solid #4381ed; margin-right: 28rpx; border-radius: 14rpx"> </view>
								<text class="station-name">{{ item.reachStationName }}</text>
							</view>
						</view>

						<!-- 右侧：票价 -->
						<view class="price-box">
							<view class="order-status" :class="`status-${item.payStatus}`">{{ orderStatusText(item.payStatus) }}</view>
							<view class="price"><text style="font-weight: 400; font-size: 24rpx; color: #333333">合计支付：</text>¥{{ item.totalPrice }} </view>
						</view>
					</view>
				</view>
				<view style="height: 60rpx;"></view>
			</view>
			<!-- 空组件 -->
			<ser-empty v-if="!addgasolinelist.length"></ser-empty>
			
			<!-- 日历组件 -->
			<up-calendar :show="show" mode="range" @confirm="confirm" @close="show = false" />
		</scroll-view>
	</view>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { imgUrl } from '@/config';
import CosHeader from '@/components/customNavBar/index.vue';
import { busTicketOrderList } from '@/api/busticket';
import { getDict } from '@/api/config';
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();

// 假设这些是全局配置或 API 模块
// import { integralApi } from '@/api/integralApi'
// import { getUserInfo } from '@/utils/auth'
// import { formatDateWeek } from '@/utils/date'
const navBarHeight = ref(0);
const backgroundColor = ref<string>('#D1E5F9');
const mode = ref('range');
const d = new Date();
const year = d.getFullYear();
let month = d.getMonth() + 1;
month = month < 10 ? `0${month}` : month;
const date = d.getDate();
const searchTex = ref('');
const loading = ref(false);
const finished = ref(false);
let searchTimer: number | null = null;
const maxDate = `${year}-${month}-${date + 10}`;
const minDate = `${year}-${month}-${date + 30}`;
// 标签数据
const tabs = [
	{ label: '全部', value: '' },
	{ label: '待支付', value: '0' },
	{ label: '已支付', value: '1' },
	{ label: '已取消', value: '2' },
	{ label: '退款中', value: '3' },
	{ label: '已退款', value: '4' },
];
const tabIndex = ref<string>('');
const pageNum = ref(1);
const totalPage = ref(1);

const addgasolinelist = ref([{ id: 1 }, { id: 2 }, { id: 3 }]);
const orderStatus = ref('');
// 布局
const show = ref(false);
const startTime = ref('');
const endTime = ref('');

const opentime = () => {
	show.value = true;
};
const confirm = (e: string[]) => {
	if (!e || !e.length) return;

	startTime.value = e[0];
	endTime.value = e[e.length - 1];

	// 重置分页
	pageNum.value = 1;
	finished.value = false;
	addgasolinelist.value = [];

	loadData(true);
	show.value = false;
};

onMounted(() => {
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
});

const onSearchInput = (val: string) => {
	// v-model 已经同步了 searchTex，这里 val 可不用
	if (searchTimer) {
		clearTimeout(searchTimer);
		searchTimer = null;
	}

	searchTimer = setTimeout(() => {
		// 重置分页
		pageNum.value = 1;
		finished.value = false;
		addgasolinelist.value = [];

		loadData(true);
	}, 300); // 300ms 防抖
};

const resetTime = () => {
	startTime.value = '';
	endTime.value = '';

	pageNum.value = 1;
	finished.value = false;
	addgasolinelist.value = [];

	loadData(true);
};

const orderStatusText = (status: number | string) => {
	const map: Record<string | number, string> = {
		0: '待支付',
		1: '已支付',
		2: '已取消',
		3: '退款中',
		4: '已退款',
		21: '部分退款',
	};
	return map[status] || '';
};

// 下拉刷新
const refresh = () => {
	uni.startPullDownRefresh(); // 触发下拉动画
	setTimeout(() => {
		addgasolinelist.value = []; // 清空旧数据
		pageNum.value = 1;
		loadData();
	}, 100);
};

// 上拉加载更多
const onReachBottom = () => {
	if (finished.value) {
		uni.showToast({ title: '没有更多数据了', icon: 'none' });
		return;
	}
	pageNum.value++;
	loadData();
};

const inputConfirm = () => {
	pageNum.value = 1;
	finished.value = false;
	addgasolinelist.value = [];
	loadData(true);
};

onMounted(() => {
	pageNum.value = 1;
	finished.value = false;
	loadData(true);
});

// 列表
const loadData = async (reset = false) => {
	if (loading.value) return;
	if (!reset && finished.value) return;

	loading.value = true;

	const params = {
		pageNum: pageNum.value,
		pageSize: 10,
		title: searchTex.value.trim(),
		startDate: startTime.value,
		endDate: endTime.value,
		status: tabIndex.value,
	};

	const res = await busTicketOrderList(params);
	loading.value = false;

	if (res.code === 200 && res.data) {
		const list = res.data.list || [];
		if (reset) {
			addgasolinelist.value = list;
		} else {
			addgasolinelist.value = addgasolinelist.value.concat(list);
		}

		// 是否还有下一页
		if (list.length < params.pageSize) {
			finished.value = true;
		}
	}
};

// Tab 切换
const tabChange = (index: number) => {
	tabIndex.value = tabs[index].value;
	pageNum.value = 1;
	finished.value = false;
	addgasolinelist.value = [];
	loadData(true);
};

const serlist = () => {
	addgasolinelist.value = [];
	loadData();
};
// 项目点击
const itemClick = (item) => {
	uni.navigateTo({
		url: `/pages_D/busTicket/details?id=${item.orderNo}&startStationCode=${item.startStationCode}`,
	});
};
</script>

<style lang="scss" scoped>
.container_bg {
	width: 750rpx;
	height: 725rpx;
	background-image: var(--linear-color);
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: -1;
}

.container {
	width: 750rpx;
	height: 100vh;
	display: flex;
	flex-direction: column;
}

.trip-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	padding: 30rpx;
}

.time-box {
	text-align: left;
}

.time {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
}

.duration {
	color: #999;
	font-size: 24rpx;
}

.route {
	display: flex;
	flex-direction: column;
	position: relative;
}

.station-item {
	display: flex;
	align-items: center;
	width: 100%;
	text-align: left;
	margin: 10rpx 0;
}

.station-name {
	color: #333;
	font-size: 28rpx;
	width: 160rpx;
}

.arrow {
	padding: 20rpx 0;
	color: #ccc;
	font-size: 24rrne;
	border-left: 2rpx solid #d8d8d8;
	margin-left: 10rpx;
}

.price-box {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 120rpx;
}

.price {
	font-size: 32rpx;
	color: #ff5a00;
	font-weight: bold;
}

// --------------------
.search-box {
	width: 690rpx;
	height: 84rpx;
	background: rgba(255, 255, 255, 0.6);
	border-radius: 322rpx 322rpx 322rpx 322rpx;
	margin: 20rpx 0;
	display: flex;
	padding-left: 30rpx;
	box-sizing: border-box;
	align-items: center;
}

.filter-bar {
	margin-top: 30rpx;
	margin-bottom: 30rpx;
}

.filter-time {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24rpx;
	height: 64rpx;
	background: #ffffff;
	border-radius: 32rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.time-text {
	display: flex;
	align-items: center;
	font-size: 26rpx;
	color: #333;
	flex: 1;

	.placeholder {
		color: #999;
	}

	.up-icon {
		margin-left: 10rpx;
	}
}

.reset-btn {
	font-size: 24rpx;
	color: #4381ed;
	padding-left: 20rpx;
	border-left: 1rpx solid #eee;
}

.filter-ls {
	align-items: center;
	display: flex;
}

.filter-wz {
	font-size: 28rpx;
}

.zhi {
	color: #999999;
	margin: 0 10rpx;
}

.down {
	margin-left: 6rpx;
	display: inline-block;
	padding-top: 5rpx;
}

.category {
	width: 100%;
	min-height: 280rpx;
	background-color: #fff;
	position: absolute;
	top: 80rpx;
	left: 0;
	border-top: 1px solid #eee;
}

.active {
	color: #333;
	margin-right: 8rpx;
}

.labelBox {
	padding: 25rpx 32rpx;
	box-sizing: border-box;
	font-size: 28rpx;
}

.jiayoulist {
	height: 118rpx;
	padding: 20rpx 60rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #f8f9fb;
	border-radius: 12rpx 12rpx 12rpx 12rpx;
}

.list-box-q {
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
}

.list-box-1 {
	font-weight: 400;
	font-size: 20rpx;
	color: #666666;
}

.list-box-2 {
	line-height: 56rpx;
	font-weight: 500;
	font-size: 28rpx;
	color: #000;
}

/* 标签栏 */
.tab-con {
	width: 100%;
	height: 288rpx;
	padding: 0 40rpx 4rpx;
	box-sizing: border-box;
}

.tab-con1 {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.tab-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.tab-text {
	font-size: 32rpx;
	margin-bottom: 12rpx;
}

.tab-select {
	font-weight: bold;
	color: #333;
	font-size: 32rpx;
	position: relative;
}

.tab-normal {
	font-weight: 500;
	color: #666;
}

/* 列表区域 */
.list-con {
	width: 750rpx;
	flex: 1 0;
	height: 0;
	padding: 0 32rpx;
	box-sizing: border-box;
}

.item-con {
	margin-bottom: 20rpx;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 20rpx rgba(138, 78, 0, 0.05);
}

.item-bg {
	background-color: #ffffff;
	padding: 32rpx;
}

.item-bg--disabled {
	background: #fff;
	opacity: 0.6;
}

.item-bg--disabled .ht-name,
.item-bg--disabled .tex24_66 {
	color: #bfbfbf !important;
}

.item-bg--disabled .goods-img,
.item-bg--disabled .ht-icon {
	opacity: 0.3;
	filter: grayscale(100%);
}

/* 标题行 */
.between-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 26rpx;
	border-bottom: 2rpx solid #ebebeb;
}

.ht-icon {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	margin-right: 16rpx;
}

.ht-name {
	flex: 1;
	max-width: 428rpx;
	font-weight: bold;
	font-size: 32rpx;
	color: #333;
	line-height: 36rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.ht-label {
	width: 120rpx;
	height: 48rpx;
	border-radius: 24rpx;
	font-size: 24rpx;
	text-align: center;
	line-height: 48rpx;
}

/* 状态样式 */
.status-1 {
	color: #005fee;
}

.status-2,
.status-4 {
	color: #333;
}

.status-3 {
	color: #008042;
}

.status-4 {
	color: #999;
}

/* 内容行 */
.row-con {
	display: flex;
	align-items: flex-start;
}

.goods-img {
	width: 128rpx;
	height: 128rpx;
	border-radius: 8rpx;
	margin-right: 32rpx;
}

.goods-name {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.tex24_66 {
	font-size: 24rpx;
	color: #666;
}

.m-tb-24 {
	margin-top: 24rpx;
	margin-bottom: 24rpx;
}

.order-status {
	font-weight: 400;
	font-size: 24rpx;
	text-align: right;
}

/* 待支付：蓝色 */
.status-0 {
	color: #4381ed;
}

/* 已取消：黑色 */
.status-2 {
	color: #333333;
}

/* 已退款：黑色 */
.status-4 {
	color: #333333;
}

/* 退款中：红色 */
.status-3 {
	color: #fd4848;
}

/* 已支付（可选，不指定就是默认色） */
.status-1 {
	color: #333333;
}

.filter-box {
	background: #ffffff;
	border-radius: 322rpx 322rpx 322rpx 322rpx;
	padding: 10rpx 30rpx;
	font-weight: 400;
	font-size: 28rpx;
	color: #666666;
}
</style>
