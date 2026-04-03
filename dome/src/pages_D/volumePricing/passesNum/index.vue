<template>
	<view class="page">
		<!-- 顶部搜索栏 -->
		<view class="search-bar">
			<view class="search-input">
				<image class="search-icon" :src="`${imgUrl}volumePricing/vp_search.png`" />
				<view class="s-line"></view>
				<input placeholder="输入高速名或关键词" placeholder-class="ph" confirm-type="search" @input="onInput" v-model="keyword" />
			</view>
			<view class="btn-search" @click="onSearch">搜索</view>
		</view>

		<!-- 筛选行 -->
		<view class="filters">
			<view class="filter-item" @click="onTimeFilterTap">
				日期
				<image class="arrow-icon" :src="`${imgUrl}volumePricing/arrBottom.png`" />
			</view>

			<picker mode="selector" :range="identityOptions" range-key="name" :value="selectedId" @change="onIdentityChange">
				<view class="filter-item">
					{{ identityError || '身份筛选' }}
					<image class="arrow-icon" :src="`${imgUrl}volumePricing/arrBottom.png`" />
				</view>
			</picker>

			<picker mode="selector" :range="luduanlist" range-key="name" :value="routeIndex" @change="handleSegmentChange">
				<view class="filter-item">
					<view style="max-width: 120rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
						{{ sectionError || '路段筛选' }}
					</view>
					<image class="arrow-icon" :src="`${imgUrl}volumePricing/arrBottom.png`" />
				</view>
			</picker>

			<picker
				v-if="roadId && userType && carlist.length"
				mode="selector"
				:range="carlist"
				range-key="vehicleNumber"
				:value="carIndex"
				@change="changeTypecarlist"
			>
				<view class="filter-item">
					{{ carError || '车辆筛选' }}
					<image class="arrow-icon" :src="`${imgUrl}/wximage/trip-pro/arrBottom.png`" />
				</view>
			</picker>
		</view>

		<!-- 日期筛选扩展行 -->
		<view v-if="showStartPicker" class="filters">
			<!-- 开始时间 -->
			<picker mode="date" :value="startDate" @change="onStartDateChange" v-show="startDate === '' && !showEndPicker">
				<view class="filter-item">
					{{ startDate || '开始时间' }}
					<image class="arrow-icon" :src="`${imgUrl}/wximage/trip-pro/arrBottom.png`" />
				</view>
			</picker>

			<!-- 结束时间 -->
			<picker
				v-if="showEndPicker"
				mode="date"
				:value="endDate"
				@change="onEndDateChange"
				:start="startDate"
				v-show="startDate !== '' && showEndPicker"
			>
				<view class="filter-item">
					{{ endDate || '结束时间' }}
					<image class="arrow-icon" :src="`${imgUrl}/wximage/trip-pro/arrBottom.png`" />
				</view>
			</picker>
		</view>

		<!-- 列表  -->
		<view v-for="(item, index) in rawList" :key="`${item.id}-${index}`" class="card">
			<view class="card-hd">
				<text class="title">延延高速子姚段</text>
				<text :class="`tag ${item.statusClass}`">{{ item.result }}</text>
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
					<text class="val">{{ item.applyDate }}</text>
				</view>
				<view class="row m-b-14">
					<text class="label">前置通行次数</text>
					<text class="val tag approved">{{ item.newFrontNum || 0 }}</text>
				</view>
				<view class="row">
					<text class="label">已通行次数</text>
					<text class="val tag rejected">{{ item.passTotal || 0 }}</text>
				</view>
			</view>

			<view class="card-ft">
				<view class="card-ft-num">
					<view class="number">{{ item.vehicleNumber }}</view>
					<view class="dis-gs">
						<text class="num">{{ item.discount }}</text>
						<text class="unit">折</text>
					</view>
				</view>

				<view class="btn-box">
					<view class="btn-apply default" @click="onFeedback">我要反馈</view>
					<view class="btn-apply default" @click="onDetails(item.id)">查看详情</view>
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
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onShow, onUnload, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
import { showToast, showToastSuccess, showLoading, hideLoading } from '@/utils/util';
import { yldjNumberPassesList, getgaosuluduanlist, vehiclePageByRoadId, yldjRevokeApply } from '@/api/volumePricing';
import { toNav, toRec } from '@/utils/route';

// 类型定义
interface IdentityOption {
	id: number;
	name: string;
}

interface LuduanItem {
	id: string;
	name: string;
	roadName1: string;
	roadName2: string;
	[key: string]: any;
}

interface CarItem {
	vehicleNumber: string;
	[key: string]: any;
}

interface PassRecordItem {
	id: number;
	roadName1: string;
	cityName1: string;
	roadName2: string;
	cityName2: string;
	applyDate: string;
	newFrontNum?: number;
	passTotal?: number;
	vehicleNumber: string;
	discount: string | number;
	result: string;
	status: string;
	statusClass: string;
	[key: string]: any;
}

// 响应式数据
const keyword = ref<string>('');
const rawList = ref<PassRecordItem[]>([]);
const statusIndex = ref<number>(0);
const routeIndex = ref<number>(0);
const carIndex = ref<number>(0);

const selectedId = ref<number>(0);

// 日期筛选相关
const startDate = ref<string>('');
const endDate = ref<string>('');
const showStartPicker = ref<boolean>(false);
const showEndPicker = ref<boolean>(false);

// 筛选相关
const identityOptions = ref<IdentityOption[]>([
	{ id: 0, name: '全部' },
	{ id: 1, name: '个人' },
	{ id: 2, name: '企业' },
]);
const identityError = ref<string>('');
const userType = ref<string>('');
const sectionError = ref<string>('');
const gaosuid = ref<string>('');
const roadId = ref<string>('');
const luduanlist = ref<LuduanItem[]>([]);
const gslist = ref<any[]>([]);
const carlist = ref<CarItem[]>([]);
const carError = ref<string>('');

// 分页相关
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
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
		showToast({ title: '已刷新', icon: 'none' });
	}, 300);
});

// 触底加载
onReachBottom(() => {
	if (!hasMore.value || loading.value) return;
	pageNum.value++;
	getList();
});

/**
 * 日期筛选点击
 */
const onTimeFilterTap = () => {
	showStartPicker.value = true;
};

/**
 * 开始日期选择变化
 */
const onStartDateChange = (e: any) => {
	const selectedStartDate = e.detail.value;
	startDate.value = selectedStartDate;
	endDate.value = '';
	showEndPicker.value = true;
};

/**
 * 结束日期选择变化
 */
const onEndDateChange = (e: any) => {
	const selectedEndDate = e.detail.value;

	if (selectedEndDate < startDate.value) {
		showToast('结束时间不得小于开始时间');
		return;
	}

	endDate.value = selectedEndDate;
	// 刷新列表
	resetAndFetch();
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
 * 获取通行记录列表
 */
const getList = async () => {
	if (loading.value || (!hasMore.value && pageNum.value > 1)) return;

	loading.value = true;

	const params = {
		pageNum: pageNum.value,
		pageSize: pageSize.value,
		secId: roadId.value,
		vehicleNumber: carError.value,
		keyword: keyword.value || '',
		applyStartDate: startDate.value,
		applyEndDate: endDate.value,
		userType: userType.value || '',
	};

	const isAppend = pageNum.value > 1;

	try {
		// 接口调用（回调转Promise）
		const res = await yldjNumberPassesList(params);
		console.log('查询的同行次数', res);
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
		showToast(error);
	} finally {
		loading.value = false;
	}
};

/**
 * 为列表项添加状态样式
 */
const applyStatusClass = () => {
	const statusMap: Record<string, { statusClass: string; statusText: string }> = {
		符合: { statusClass: 'pending', statusText: '符合' },
		不符合: { statusClass: 'rejected', statusText: '不符合' },
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
 * 选择路段变化
 */
const handleSegmentChange = (e: UniApp.PickerChangeEvent) => {
	const index = Number(e.detail.value);
	const selected = luduanlist.value[index];
	console.log('选择的路段', selected, luduanlist.value.length);
	routeIndex.value = index;
	// 截取前2个字符加省略号（保持原逻辑）
	sectionError.value = selected.name.substring(0, 2) + '...';
	roadId.value = selected.id;
	// 获取车辆列表
	getcarlist();
};

/**
 * 获取车辆列表（原逻辑有两个同名方法，合并为一个并保留完整逻辑）
 */
const getcarlist = async () => {
	try {
		const params2 = {
			pageNum: '1',
			pageSize: '10000',
			bindType: userType.value === '1' ? '01' : '02',
			roadId: roadId.value,
		};

		const res2 = await vehiclePageByRoadId(params2);

		const carlist2 = Array.isArray(res2?.page?.records) ? res2.page.records : [];
		carlist.value = carlist2;

		// 重新获取列表
		getList();
	} catch (error) {
		showToast(error || '获取车辆列表失败');
	}
};

/**
 * 选择车辆变化
 */
const changeTypecarlist = (e: UniApp.PickerChangeEvent) => {
	const index = Number(e.detail.value);
	const selected = carlist.value[index];
	carIndex.value = index;
	carError.value = selected.vehicleNumber;
	// 刷新列表
	getList();
};

/**
 * 身份筛选变化
 */
const onIdentityChange = (e: UniApp.PickerChangeEvent) => {
	const index = Number(e.detail.value);
	const selected = identityOptions.value[index];
	selectedId.value = index;
	identityError.value = selected.name;
	userType.value = selected.id.toString();
	// 重置车辆筛选
	carError.value = '';
	carIndex.value = 0;
	// 刷新列表和车辆列表
	getList();
	getcarlist();
};

/**
 * 查看详情
 */
const onDetails = (id: number) => {
	toNav(`/pages_D/volumePricing/myApplyDetails/index?id=${id}&type=2`);
};

/**
 * 我要反馈
 */
const onFeedback = () => {
	toNav(`/pages_D/volumePricing/feedbackList/index`);
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
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx 18rpx;
	margin-bottom: 28rpx;
}

.card-hd {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 17rpx 17rpx;
}

.title {
	font-size: 28rpx;
	color: #505050;
}

.tag {
	font-size: 26rpx;
}

.tag.pending {
	color: #1186f8;
}

.tag.approved {
	color: #11a567;
}

.tag.rejected {
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
	margin-bottom: 8rpx;
}

.card-ft {
	margin-top: 29rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 8rpx;
}

.card-ft-num {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 8rpx;
}

.badge {
	font-size: 32rpx;
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
	margin-left: 29rpx;
}

.btn-apply:active {
	opacity: 0.8;
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

.empty-picker {
	width: 0;
	height: 0;
	visibility: hidden;
}

.number {
	font-weight: 500;
	font-size: 32rpx;
	color: #837b7b;
	margin-right: 16rpx;
}

.popup1 {
	width: 615rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 40rpx;
	box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
	box-sizing: border-box;
}

.popup1-header {
	font-size: 32rpx;
	font-weight: 500;
	text-align: center;
	margin-bottom: 20rpx;
}

.popup1-text {
	text-align: center;
	font-size: 28rpx;
	font-weight: normal;
	color: #a9a9a9;
	line-height: 42rpx;
	word-break: break-all;
}

.popup1-content {
	height: 600rpx;
	overflow-y: auto;
}

.btn-boxs {
	display: flex;
	margin-top: 36rpx;
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
</style>
