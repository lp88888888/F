<template>
	<view class="page">
		<!-- 顶部搜索栏 -->
		<view class="search-bar">
			<view class="search-input">
				<image class="search-icon" :src="`${imgUrl}volumePricing/vp_search.png`" />
				<view class="s-line"></view>
				<input placeholder="输入车牌号" placeholder-class="ph" @input="onInput" v-model="keyword" />
			</view>
			<view class="btn-search" @click="onSearch">搜索</view>
		</view>

		<!-- 筛选行 -->
		<view class="filters">
			<picker mode="selector" :range="statusOptions" range-key="name" :value="statusIndex" @change="onStatusChange">
				<view class="filter-item">
					{{ statusError || '审核状态' }}
					<image class="arrow-icon" :src="`${imgUrl}volumePricing/arrBottom.png`" />
				</view>
			</picker>

			<picker mode="selector" :range="luduanlist" range-key="name" :value="routeIndex" @change="onRouteChange">
				<view class="filter-item">
					{{ sectionError || '路段筛选' }}
					<image class="arrow-icon" :src="`${imgUrl}volumePricing/arrBottom.png`" />
				</view>
			</picker>

			<picker mode="selector" :range="identityOptions" range-key="name" :value="identityIndex" @change="onIdentityChange">
				<view class="filter-item">
					{{ identityError || '身份筛选' }}
					<image class="arrow-icon" :src="`${imgUrl}volumePricing/arrBottom.png`" />
				</view>
			</picker>
		</view>

		<!-- 列表  -->
		<view v-for="(item, index) in rawList" :key="`${item.id}-${index}`" class="card">
			<view class="card-hd">
				<text class="title">申请编号：{{ item.id }}</text>
				<text :class="`tag ${item.statusClass}`">{{ item.statusText }}</text>
			</view>

			<!-- 起终点 -->
			<view class="route">
				<view class="city center">
					<text class="name">{{ item.roadName1 }}</text>
					<text class="prov">{{ item.cityName1 }}</text>
				</view>
				<view class="dir">
					<image class="dir-icon" :src="`${imgUrl}volumePricing/vp_dir.png`" />
					<text class="dir-text">双向</text>
				</view>
				<view class="city center">
					<text class="name">{{ item.roadName2 }}</text>
					<text class="prov">{{ item.cityName2 }}</text>
				</view>
			</view>

			<view class="rows">
				<view class="row m-b-14">
					<text class="label">申请时间</text>
					<text class="val">{{ item.createTime }}</text>
				</view>
				<view class="row">
					<text class="label">优惠车型</text>
					<text class="val">{{ item.carTypeName }}</text>
				</view>
			</view>

			<view class="discount">
				<view class="dis-gs">
					<image class="gs-icon" :src="`${imgUrl}volumePricing/vp_gs.png`" />
					<text class="gs-text">{{ item.highName }}</text>
				</view>
				<view class="dis-gs">
					<text class="num">{{ item.discount }}</text>
					<text class="unit">折</text>
				</view>
			</view>

			<view class="card-ft">
				<view class="badge">
					<text>{{ item.vehicleNumber }}</text>
				</view>
				<view class="btn-box">
					<view class="btn-apply danger" v-if="item.status === 1" @click="onRevocation(item.id)"> 撤销申请 </view>
					<view class="btn-apply blue" v-if="item.status === 3 || item.status === 4" @click="onApply(item.roadId)"> 重新申请 </view>
					<view class="btn-apply default" @click="onFeedback">我要反馈</view>
					<view class="btn-apply default" @click="onDetails(item)">查看详情</view>
				</view>
			</view>
		</view>

		<!-- 加载中 -->
		<view v-if="loading && rawList.length" class="load-more">加载中…</view>
		<!-- 没有更多 -->
		<view v-if="!hasMore && rawList.length" class="load-more no-more">没有更多了</view>
		<!-- 空组件 -->
		<ser-empty v-if="!rawList.length"></ser-empty>
	</view>

	<!-- 弹窗内容 -->
	<up-popup :show="isPopupVisibleInfo" mode="center" :safeAreaInsetBottom="false">
		<view class="popup">
			<view class="popup-header">确认撤销</view>
			<view class="popup-text">确认撤销本次活动申请？</view>
			<view class="btn-boxs">
				<view class="cancel-btn" @click="cancelEvt">取消</view>
				<view class="sure-btn" @click="sureEvt">确认</view>
			</view>
		</view>
	</up-popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onShow, onUnload, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
import { yldjMyApply, yldjRevokeApply, getgaosuluduanlist, yldjCarInfo } from '@/api/volumePricing';
import { toNav, toRec } from '@/utils/route';

// 类型定义
interface StatusOption {
	id: number | string;
	name: string;
}

interface IdentityOption {
	id: number;
	name: string;
}

interface LuduanItem {
	id: string;
	name: string;
	roadName1: string;
	roadName2: string;
	[key: string]: any; // 兼容其他字段
}

interface ApplyItem {
	id: number;
	status: number | string;
	statusClass: string;
	statusText: string;
	roadName1: string;
	cityName1: string;
	roadName2: string;
	cityName2: string;
	createTime: string;
	carTypeName: string;
	highName: string;
	discount: string | number;
	vehicleNumber: string;
	roadId: number;
	[key: string]: any; // 兼容其他字段
}

// 响应式数据
const keyword = ref<string>('');
const statusOptions = ref<StatusOption[]>([
	{ id: 0, name: '全部' },
	{ id: 1, name: '审核中' },
	{ id: 2, name: '审核通过' },
	{ id: 3, name: '审核拒绝' },
	{ id: 4, name: '审核已撤销' },
	{ id: -1, name: '审核作废' },
]);
const identityOptions = ref<IdentityOption[]>([
	{ id: 0, name: '全部' },
	{ id: 1, name: '个人' },
	{ id: 2, name: '企业' },
]);
const identityError = ref<string>('');
const userType = ref<string>('');
const rawList = ref<ApplyItem[]>([]);
const luduanlist = ref<LuduanItem[]>([]);
const statusIndex = ref<number>(0);
const routeIndex = ref<number>(0);
const identityIndex = ref<number>(0);
const sectionError = ref<string>('');
const statusError = ref<string>('');
const isPopupVisibleInfo = ref<boolean>(false);
const selectedId = ref<number>(0);
const roadId = ref<string>('');

// 分页相关
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const status = ref<number | null>(null);
const total = ref<number>(0);
const hasMore = ref<boolean>(true);
const loading = ref<boolean>(false);
const searchTimer = ref<NodeJS.Timeout | null>(null);

// 页面显示时初始化
onShow(() => {
	resetAndFetch();
	getluduanlist();
});

// 页面卸载清理定时器
onUnload(() => {
	if (searchTimer.value) {
		clearTimeout(searchTimer.value);
	}
});

// 下拉刷新
onPullDownRefresh(() => {
	resetAndFetch();
	setTimeout(() => {
		uni.stopPullDownRefresh();
		uni.showToast({ title: '已刷新', icon: 'none' });
	}, 300);
});

// 触底加载
onReachBottom(() => {
	if (!hasMore.value || loading.value) return;
	pageNum.value++;
	getList();
});

/**
 * 搜索输入防抖处理
 */
const onInput = (e: Event) => {
	const searchKey = (e.target as HTMLInputElement).value.trim();
	keyword.value = searchKey;

	// 清除之前的定时器
	if (searchTimer.value) {
		clearTimeout(searchTimer.value);
	}

	// 设置新的防抖定时器
	searchTimer.value = setTimeout(() => {
		// 重置分页，重新加载数据
		pageNum.value = 1;
		hasMore.value = true;
		getList();
	}, 500);
};

/**
 * 执行搜索
 */
const onSearch = () => {
	// 清除定时器，立即执行
	if (searchTimer.value) {
		clearTimeout(searchTimer.value);
	}
	pageNum.value = 1;
	hasMore.value = true;
	getList();
};

/**
 * 重置并重新获取第一页数据
 */
const resetAndFetch = () => {
	pageNum.value = 1;
	rawList.value = [];
	hasMore.value = true;
	total.value = 0;
	getList();
};

/**
 * 获取申请列表数据
 */
const getList = async () => {
	if (loading.value || (!hasMore.value && pageNum.value > 1)) return;

	loading.value = true;

	const params = {
		pageNum: pageNum.value,
		pageSize: pageSize.value,
		status: status.value,
		route: '',
		secId: roadId.value,
		keyword: keyword.value || '',
		userType: userType.value || '',
	};

	const isAppend = pageNum.value > 1;

	try {
		// 调用接口（保持原接口调用方式）
		const res = await yldjMyApply(params);
		console.log('查询的申请', res);
		const page = res?.page || {};
		const list = Array.isArray(page.records) ? page.records : [];
		const totalCount = Number(page.total || 0);

		// 判断是否还有更多数据
		const hasMoreData = totalCount ? pageNum.value * pageSize.value < totalCount : list.length >= pageSize.value;

		// 合并数据
		const mergedList = isAppend ? [...rawList.value, ...list] : list;

		// 更新数据
		rawList.value = mergedList;
		total.value = totalCount;
		hasMore.value = hasMoreData;

		// 处理状态样式
		applyStatusClass();
	} catch (error) {
		uni.showToast({
			title: error?.message || '',
			icon: 'none',
		});
	} finally {
		loading.value = false;
	}
};

/**
 * 为列表项添加状态样式和文本
 */
const applyStatusClass = () => {
	const statusMap: Record<string | number, { statusClass: string; statusText: string }> = {
		1: { statusClass: 'pending', statusText: '审核中' },
		2: { statusClass: 'approved', statusText: '审核通过' },
		3: { statusClass: 'rejected', statusText: '审核拒绝' },
		4: { statusClass: 'canceled', statusText: '审核已撤销' },
		'-1': { statusClass: 'void', statusText: '作废' },
	};

	// 批量处理状态
	rawList.value = rawList.value.map((item) => {
		const statusConfig = statusMap[item.status] || {
			statusClass: 'pending',
			statusText: '审核中',
		};
		return { ...item, ...statusConfig };
	});
};

/**
 * 审核状态筛选变化
 */
const onStatusChange = (e: UniApp.PickerChangeEvent) => {
	const index = Number(e.detail.value);
	const selected = statusOptions.value[index];
	statusIndex.value = index;
	statusError.value = selected.name;
	status.value = selected.id as number;
	getList();
};

/**
 * 身份筛选变化
 */
const onIdentityChange = (e: UniApp.PickerChangeEvent) => {
	const index = Number(e.detail.value);
	const selected = identityOptions.value[index];
	identityIndex.value = index;
	identityError.value = selected.name;
	userType.value = selected.id.toString();
	getList();
};

/**
 * 路段筛选变化
 */
const onRouteChange = (e: UniApp.PickerChangeEvent) => {
	const index = Number(e.detail.value);
	const selected = luduanlist.value[index];
	routeIndex.value = index;
	sectionError.value = selected.name;
	roadId.value = selected.id;
	getList();
};

/**
 * 获取路段列表
 */
const getluduanlist = async () => {
	try {
		const res = await getgaosuluduanlist({ highId: 1 });

		// 处理路段数据，拼接名称
		const luduanItems = (res.clazz || []).map((item: any) => ({
			...item,
			name: `${item.roadName1}-${item.roadName2}`,
		}));

		// 添加"全部"选项
		const newList = [{ id: '', name: '全部' }, ...luduanItems];

		luduanlist.value = newList;
	} catch (error) {
		console.error('获取路段列表失败:', error);
	}
};

/**
 * 重新申请
 */
const onApply = (id: number) => {
	toNav(`/pages_D/volumePricing/activityDetails/index?id=${id}`);
};

/**
 * 查看详情
 */
const onDetails = (item) => {
	console.log('查看申请详情', item);
	toNav(`/pages_D/volumePricing/myApplyDetails/index?id=${item.id}&type=1`);
};

/**
 * 我要反馈
 */
const onFeedback = () => {
	toNav(`/pages_D/volumePricing/feedbackList/index`);
};

/**
 * 撤销申请（显示弹窗）
 */
const onRevocation = (id: number) => {
	selectedId.value = id;
	isPopupVisibleInfo.value = true;
};

/**
 * 取消撤销
 */
const cancelEvt = () => {
	isPopupVisibleInfo.value = false;
};

/**
 * 确认撤销
 */
const sureEvt = async () => {
	const params = { id: selectedId.value };

	try {
		const res = await yldjCarInfo(params);
		console.log('撤销结果', res);
		uni.showToast({
			title: res.resultMsg || '已撤销',
			icon: 'none',
		});
		isPopupVisibleInfo.value = false;
		resetAndFetch();
	} catch (error) {
		uni.showToast({
			title: error?.message || '',
			icon: 'none',
		});
		isPopupVisibleInfo.value = false;
	}
};
</script>

<style lang="scss" scoped>
page {
	background: #f8f8fa;
}

.page {
	padding: 25rpx;
}

.search-bar {
	display: flex;
	align-items: center;
	margin-bottom: 28rpx;
	border: 1.5rpx solid #156fff;
	border-radius: 24rpx;
}

.search-input {
	flex: 1;
	height: 72rpx;
	border-radius: 36rpx;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.search-icon {
	margin-right: 13rpx;
	width: 59.31rpx;
	height: 56rpx;
}

.s-line {
	width: 2rpx;
	height: 36rpx;
	background: #a2a2a2;
	margin-right: 30rpx;
}

.search-input input {
	flex: 1;
	font-size: 28rpx;
}

.ph {
	color: #999999;
	font-size: 32rpx;
}

.btn-search {
	width: 140rpx;
	height: 68.49rpx;
	border-radius: 12rpx;
	opacity: 1;
	font-size: 32rpx;
	color: #ffffff;
	background: linear-gradient(180deg, #6fa2f6 0%, #347dff 100%);
	text-align: center;
	line-height: 68.49rpx;
	margin: 8rpx 16rpx;
}

.filters {
	display: flex;
	gap: 16rpx;
	margin-bottom: 20rpx;
}

.filter-item {
	flex: 1;
	height: 64rpx;
	line-height: 64rpx;
	background: #ffffff;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #080912;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.arrow-icon {
	width: 24rpx;
	height: 20rpx;
	margin-left: 10rpx;
}

.card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 24rpx 18rpx;
	margin-bottom: 28rpx;
}

.card-hd {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 0 17rpx;
	border-bottom: 1rpx solid #d8d8d8;
}

.title {
	font-size: 22rpx;
	color: #999999;
}

.tag {
	font-size: 26rpx;
}

.pending {
	color: #1186f8;
}

.approved {
	color: #11a567;
}

.rejected,
.void,
.canceled {
	color: #ff0000;
}

.route {
	margin-top: 16rpx;
	padding: 16rpx 0;
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.city .name {
	font-size: 34rpx;
	color: #000;
	font-weight: 500;
}

.city .prov {
	display: block;
	color: #a7a7a7;
	font-size: 28rpx;
	margin-top: 4rpx;
}

.city.center {
	text-align: center;
}

.dir {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.dir-icon {
	width: 90rpx;
	height: 24rpx;
	position: relative;
}

.dir-icon::after {
	content: '';
	position: absolute;
	right: -10rpx;
	top: -6rpx;
	width: 0;
	height: 0;
	border-left: 10rpx solid #ff8a00;
	border-top: 6rpx solid transparent;
	border-bottom: 6rpx solid transparent;
}

.dir-text {
	color: #4a2701;
	font-size: 26rpx;
}

.rows {
	margin-top: 3rpx;
	background: #f5f5f6;
	border-radius: 16rpx;
	padding: 22rpx 18rpx;
	margin-bottom: 3rpx;
}

.row {
	display: flex;
}

.m-b-14 {
	margin-bottom: 14rpx;
}

.label {
	color: #a6a6a6;
	font-size: 26rpx;
	margin-right: 17rpx;
}

.val {
	color: #353535;
	font-size: 26rpx;
}

.discount {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.gs-icon {
	width: 36rpx;
	height: 36rpx;
}

.gs-text {
	font-size: 24rpx;
	color: #9b9b9b;
}

.dis-gs {
	display: flex;
	align-items: flex-end;
	color: #ff0000;
	font-weight: 500;
}

.dis-gs .num {
	font-size: 28px;
}

.dis-gs .unit {
}

.card-ft {
	margin-top: 29rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 8rpx;
}

.badge {
	font-size: 30rpx;
	font-weight: 500;
	color: #000000;
}

.btn-box {
	display: flex;
}

.btn-apply {
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 16rpx;
	background: #fff;
	font-size: 28rpx;
	text-align: center;
	padding: 0 14rpx;
}

.danger {
	border: 1rpx solid #ff3c00;
	color: #ff3c00;
}

.blue {
	border: 1px solid #156fff;
	color: #156fff;
}

.default {
	border: 1rpx solid #9e9e9e;
	color: #000000;
	margin-left: 16rpx;
}

.btn-apply:active {
	opacity: 0.8;
}

.popup-container {
	width: 100%;
	height: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: flex-end;
	z-index: 9999;
}

.popup {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 50rpx;
	box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
	width: 615rpx;
	min-height: 338rpx;
	box-sizing: border-box;
}

.popup-header {
	width: 100%;
	font-size: 32rpx;
	font-weight: 500;
	text-align: center;
	margin-bottom: 20rpx;
}

.popup-text {
	text-align: center;
	font-size: 28rpx;
	font-weight: normal;
	color: #a9a9a9;
	line-height: 42rpx;
}

.popup-content {
	height: 600rpx;
	overflow-y: auto;
}

.btn-boxs {
	display: flex;
	margin-top: 50rpx;
}

.cancel-btn {
	width: 246rpx;
	height: 70rpx;
	border-radius: 10rpx;
	background: #ffffff;
	border: 1rpx solid #6b7073;
	margin-right: 34rpx;
	text-align: center;
	line-height: 70rpx;
	box-sizing: border-box;
}

.sure-btn {
	width: 246rpx;
	height: 70rpx;
	border-radius: 10rpx;
	background: linear-gradient(180deg, #f7b77f 0%, #ec8733 100%), #ff6503;
	text-align: center;
	line-height: 70rpx;
	color: #fff5f3;
	box-sizing: border-box;
}

.load-more {
	padding: 24rpx 0;
	text-align: center;
	color: #999;
	font-size: 26rpx;
}
.load-more.no-more {
	color: #bbb;
}
</style>
