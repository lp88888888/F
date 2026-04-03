<template>
	<view class="container">
		<view class="tabs" v-if="isUser == 3">
			<view class="tab-item" :class="{ active: activeTab === 1 }" @tap="switchTab(1)">个人车辆</view>
			<view class="tab-item" :class="{ active: activeTab === 2 }" @tap="switchTab(2)">企业车辆</view>
		</view>

		<view class="header">
			<text v-if="vehicles.length || (!vehicles.length && isSearch)" class="title"> 我的车辆（{{ enterpriseCount }}辆） </text>
			<text v-else class="title"></text>

			<view v-if="activeTab === 2" class="add-btn" @tap="handleAddEnterprise">
				<image :src="`${imgUrl}volumePricing/vp_add.png`" class="add-icon"></image>
				添加车辆
			</view>
		</view>

		<view v-if="(vehicles.length && activeTab === 2) || (!vehicles.length && isSearch)" class="search-container">
			<view style="width: 100%">
				<image class="icSearch-s" :src="`${imgUrl}/wximage/other-icon/ic_search.png`"></image>
				<input class="search-input" placeholder="输入关键词" placeholder-class="input-placeholder" v-model="keyword" @input="onInput" />
			</view>
			<view v-if="activeTab === 2 && type === 2" class="search-right">
				<image :src="`${imgUrl}volumePricing/vp_all.png`" class="all-icon"></image>
				<view class="select-all-btn" @tap="handleSelectAll">
					{{ allSelected ? '取消全选' : '全选' }}
				</view>
			</view>
		</view>

		<view v-if="(vehicles.length && activeTab === 2) || (!vehicles.length && isSearch)" class="siauxan">
			<picker mode="selector" range-key="enterpriseName" :range="enterpriseList" @change="handleEnterpriseChange">
				<view class="filter-item">
					<text class="line1">{{ enterpriseError || '企业筛选' }}</text>
					<image class="arrow-icon" :src="`${imgUrl}/wximage/trip-pro/arrBottom.png`" />
				</view>
			</picker>
			<picker v-if="activeTab === 2" mode="selector" range-key="name" :range="statusOptions" @change="handleStatusChange">
				<view class="filter-item">
					{{ statusError || '审核状态' }}
					<image class="arrow-icon" :src="`${imgUrl}/wximage/trip-pro/arrBottom.png`" />
				</view>
			</picker>
		</view>

		<view v-if="vehicles.length" class="list-container">
			<view class="vehicle-item" :class="{ bg_f7: item.selected }" v-for="(item, index) in vehicles" :key="item.id || item.vehicleNumber">
				<view class="vehicle-box">
					<image
						v-if="type === 2"
						class="check-icon"
						:src="item.selected ? `${imgUrl}volumePricing/vp_select.png` : `${imgUrl}volumePricing/vp_normal.png`"
						@tap="handleToggleItem(index)"
					></image>
					<view>
						<view class="vehicle-info">
							<view class="plate-number">{{ item.vehicleNumber }}</view>
							<view v-if="activeTab === 2" class="status" :class="getStatusClass(item.auditStatus)">
								{{ getStatusText(item.auditStatus) }}
							</view>
						</view>
						<view class="owner-info">
							<text>{{ item.userName || item.name || item.owner || '' }}</text>
							<text v-if="item.enterpriseName">({{ item.enterpriseName }})</text>
						</view>
					</view>
				</view>
				<view v-if="type !== 2" class="detail-btn" @tap="handleViewDetail(item.id)">查看</view>
			</view>

			<uni-load-more :status="loadingStatus" />
		</view>

		<view v-if="!vehicles.length && !isSearch" class="no-car">
			<image :src="`${imgUrl}volumePricing/vp_nocar.png`" class="no-icon"></image>
			<view class="no-btn" @tap="handleAddEnterprise">
				<image :src="`${imgUrl}volumePricing/vp_add.png`" class="add-icon"></image>
				<text class="no-add">添加车辆</text>
			</view>
		</view>
		<view v-if="!vehicles.length && isSearch" class="no-car">
			<image :src="`${imgUrl}volumePricing/vp_nocar.png`" class="no-icon"></image>
			<view class="no-result">未找到相关车辆</view>
		</view>

		<view v-if="vehicles.length && type === 2" class="bottom-bar">
			<view class="reset-btn" @tap="handleReset">重置</view>
			<view class="submit-btn" @tap="handleSubmit">确定</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import { onLoad, onShow, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
// 假设的导入路径，请根据实际项目结构修改
import { debounce } from '@/utils/common';
import { getVehiclePage, yldjCarList, getEnterList } from '@/api/volumePricing'; // 假设 API 已封装
import { toNav, toRec } from '@/utils/route';

// --- 接口类型定义 ---
interface Vehicle {
	id: string | number;
	vehicleNumber: string;
	auditStatus: '01' | '02' | '03' | '99'; // 01:待审, 02:同意, 03:驳回, 99:作废
	enterpriseName: string;
	userName?: string;
	name?: string;
	owner?: string;
	selected?: boolean;
}
interface EnterpriseOption {
	id: string;
	enterpriseName: string;
}
interface StatusOption {
	id: string;
	name: string;
}

// 分页与列表
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);
const hasMore = ref<boolean>(true);
const loading = ref<boolean>(false);
const vehicles = ref<Vehicle[]>([]);
const enterpriseCount = ref<number>(0); // 车辆总数 (用于标题显示)

// 页面状态
const type = ref<number>(0); // 2:选择车辆, 1:列表, 0:列表
const isUser = ref<number>(0); // 3:显示标签页
const activeTab = ref<number>(1); // 1:个人, 2:企业

// 筛选与搜索
const keyword = ref<string>('');
const isSearch = ref<boolean>(false); // 是否处于搜索状态（用于空状态判断）
let searchTimer: NodeJS.Timeout | null = null; // 防抖定时器

// 筛选条件
const enterpriseList = ref<EnterpriseOption[]>([{ id: '', enterpriseName: '全部' }]);
const enterpriseError = ref<string>(''); // 企业筛选显示文本
const enterpriseId = ref<string>(''); // 选中的企业ID

const statusOptions: StatusOption[] = [
	{ id: '', name: '全部' },
	{ id: '01', name: '待审核' },
	{ id: '02', name: '审核通过' },
	{ id: '03', name: '审核拒绝' },
	{ id: '99', name: '审核作废' },
];
const statusError = ref<string>(''); // 状态筛选显示文本
const auditStatus = ref<string>(''); // 选中的审核状态ID

// 选择模式状态
const allSelected = ref<boolean>(false);
const selectedIds = ref<string[]>([]); // 存储已选中的车牌号

// --- 计算属性 ---
const loadingStatus = computed(() => {
	if (loading.value) return 'loading';
	if (!hasMore.value && vehicles.value.length > 0) return 'noMore';
	return 'more';
});

// --- 状态文本/样式方法 ---
const getStatusText = (status: string) => {
	switch (status) {
		case '01':
			return '待审核';
		case '02':
			return '同意';
		case '03':
			return '驳回';
		case '99':
			return '作废';
		default:
			return '';
	}
};
const getStatusClass = (status: string) => {
	// d: 待审核 (黄色), g: 同意 (绿色), r: 驳回/作废 (红色)
	switch (status) {
		case '01':
			return 'd';
		case '02':
			return 'g';
		case '03':
		case '99':
			return 'r';
		default:
			return '';
	}
};

/** 获取车辆列表 */
const getCarList = async (isLoadMore = false) => {
	if (loading.value) return;

	loading.value = true;

	const apiFunction = type.value === 2 ? getVehiclePage : type.value === 1 ? yldjCarList : '';
	if (!apiFunction) {
		loading.value = false;
		return;
	}

	const params = {
		pageNum: pageNum.value,
		pageSize: pageSize.value,
		enterpriseId: activeTab.value === 2 ? enterpriseId.value : '', // 个人车辆不带企业ID
		bindType: activeTab.value === 1 ? '01' : '02', // 01:个人, 02:企业
		auditStatus: activeTab.value === 2 ? auditStatus.value : '', // 个人车辆不带审核状态
		keyword: keyword.value,
	};

	try {
		console.log('请求的参数', apiFunction);
		console.log('车辆列表查询的参数', params);
		const res = await apiFunction(params);
		console.log('查询的车辆', res);
		const newList: Vehicle[] = Array.isArray(res?.page?.records) ? res.page.records : [];
		const totalCount = res?.page?.total || 0;

		let updatedVehicles: Vehicle[] = isLoadMore ? [...vehicles.value, ...newList] : newList;

		// 标记已选中状态 (基于车牌号)
		updatedVehicles = updatedVehicles.map((vehicle) => ({
			...vehicle,
			selected: selectedIds.value.includes(vehicle.vehicleNumber),
		}));

		vehicles.value = updatedVehicles;
		enterpriseCount.value = totalCount;
		total.value = totalCount;
		hasMore.value = updatedVehicles.length < totalCount;
		isSearch.value = keyword.value !== '' || enterpriseId.value !== '' || auditStatus.value !== '';
	} catch (message: any) {
		uni.showToast(message);
		hasMore.value = false; // 失败时阻止继续加载
	} finally {
		loading.value = false;
		uni.stopPullDownRefresh(); // 停止下拉刷新动画
	}
};

/** 获取企业列表 */
const getEnterpriseList = async () => {
	try {
		const params = { pageNum: 1, pageSize: 1000 };
		const res = await getEnterList(params);
		const list: EnterpriseOption[] = res?.page?.records || [];

		const newList = [{ id: '', enterpriseName: '全部' }].concat(list);
		enterpriseList.value = newList;

		// 如果是通过参数带入的企业，确保筛选文本正确
		if (enterpriseId.value && !enterpriseError.value) {
			const selectedEnterprise = newList.find((e) => e.id === enterpriseId.value);
			if (selectedEnterprise) {
				enterpriseError.value = selectedEnterprise.enterpriseName;
			}
		}
	} catch (message: any) {
		uni.showToast(message);
	}
};

// --- 交互方法 ---

/** 切换标签页 */
const switchTab = (index: number) => {
	if (activeTab.value === index) return;
	activeTab.value = index;
	// 切换时重置分页和筛选条件
	resetAndReload();
};

/** 搜索输入处理（防抖） */
const onInput = debounce((e: any) => {
	const searchKey = e.detail.value.trim();
	keyword.value = searchKey;
	// 触发重置和加载
	resetAndReload();
}, 500);

/** 切换筛选条件后重置分页并重新加载 */
const resetAndReload = () => {
	pageNum.value = 1;
	hasMore.value = true;
	vehicles.value = [];
	getCarList();
};

/** 选择企业 */
const handleEnterpriseChange = (e: any) => {
	const index = Number(e.detail.value);
	const selected = enterpriseList.value[index];
	enterpriseError.value = selected.enterpriseName;
	enterpriseId.value = selected.id;
	resetAndReload();
};

/** 选择状态 */
const handleStatusChange = (e: any) => {
	const index = Number(e.detail.value);
	const selected = statusOptions[index];
	statusError.value = selected.name;
	auditStatus.value = selected.id;
	resetAndReload();
};

/** 全选/取消全选 */
const handleSelectAll = () => {
	const nextAll = !allSelected.value;
	vehicles.value = vehicles.value.map((v) => ({
		...v,
		selected: nextAll,
	}));
	selectedIds.value = nextAll ? vehicles.value.map((v) => v.vehicleNumber) : [];
	allSelected.value = nextAll;
};

/** 单项切换 */
const handleToggleItem = (index: number) => {
	console.log('点击了车辆');
	const vehicle = vehicles.value[index];
	const isCurrentlySelected = vehicle.selected;

	// 1. 切换选中状态
	vehicle.selected = !isCurrentlySelected;
	vehicles.value = [...vehicles.value]; // 触发响应式更新

	// 2. 更新 selectedIds 列表
	if (vehicle.selected) {
		if (!selectedIds.value.includes(vehicle.vehicleNumber)) {
			selectedIds.value.push(vehicle.vehicleNumber);
		}
	} else {
		selectedIds.value = selectedIds.value.filter((id) => id !== vehicle.vehicleNumber);
	}

	// 3. 更新全选状态
	allSelected.value = vehicles.value.length > 0 && vehicles.value.every((v) => v.selected);
};

/** 重置选择 */
const handleReset = () => {
	vehicles.value = vehicles.value.map((v) => ({ ...v, selected: false }));
	allSelected.value = false;
	selectedIds.value = [];
};

/** 提交选择结果并返回 */
const handleSubmit = () => {
	if (selectedIds.value.length === 0) {
		uni.showToast({ title: '请选择车辆', icon: 'none' });
		return;
	}

	// 使用 uni.setStorageSync 模拟 wx.setStorageSync
	uni.setStorageSync('carList', selectedIds.value);
	uni.setStorageSync('selectBindType', activeTab.value);

	uni.navigateBack();
};

/** 查看详情 */
const handleViewDetail = (id: string | number) => {
	uni.navigateTo({
		url: `/pages_D/volumePricing/myCar/myCar?id=${id}`,
	});
};

/** 添加车辆 */
const handleAddEnterprise = () => {
	uni.navigateTo({
		url: `/pages_D/volumePricing/bindCar/bindCar?isUser=${activeTab.value}&enterpriseId=${enterpriseId.value}&enterpriseError=${enterpriseError.value}`,
	});
};

// --- 生命周期钩子 ---

onLoad((options) => {
	console.log('我的车辆列表', options);
	if (options?.vehicleNumberList) {
		selectedIds.value = options.vehicleNumberList.split(',');
	}
	if (options?.type) {
		type.value = Number(options.type);
	}
	if (options?.isUser) {
		isUser.value = options.type == 2 ? Number(uni.getStorageSync('isUser')) : Number(options.isUser);
		console.log('判断的isUser的参数', isUser.value);
		activeTab.value = options.isUser == 2 ? 2 : 1;
	}
	if (options?.enterpriseId) {
		enterpriseId.value = options.enterpriseId;
		enterpriseError.value = options.enterpriseError || '';
	}
});

onShow(() => {
	// onShow 时重新加载列表和企业列表
	getEnterpriseList();
	getCarList();
});

onPullDownRefresh(() => {
	// 重置分页和筛选状态
	pageNum.value = 1;
	keyword.value = '';
	// enterpriseId.value = ''; // 保持原有逻辑，不重置企业ID
	auditStatus.value = '';
	// enterpriseError.value = '';
	statusError.value = '';
	isSearch.value = false;
	vehicles.value = [];
	getCarList();
});

onReachBottom(() => {
	if (loading.value || !hasMore.value) return;
	pageNum.value += 1;
	getCarList(true);
});

onUnmounted(() => {
	if (searchTimer) {
		clearTimeout(searchTimer);
	}
});
</script>
<style scoped>
page {
	background-color: #fff;
	height: 100%;
	box-sizing: border-box;
}

.tabs {
	display: flex;
	align-items: center;
	justify-content: space-around;
	height: 100rpx;
	border-bottom: 9rpx solid #fbfbfb;
	color: #a2a2a2;
	font-size: 30rpx;
	font-weight: 500;
}

.tabs .active {
	color: #120c08;
	font-size: 34rpx;
	position: relative;
}

.tabs .active::after {
	content: '';
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: -10rpx;
	width: 32rpx;
	height: 8rpx;
	font-weight: 600;
	background-color: #ffa46b;
}

.add-o-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 12rpx;
}

/* index.wxss */

.icSearch-s {
	width: 34rpx;
	height: 34rpx;
	position: absolute;
	left: 30rpx;
	top: 20rpx;
	padding-left: 16rpx;
}

.add-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 12rpx;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding: 28rpx 28rpx 0;
}

.input-placeholder {
	font-size: 30rpx;
	color: #cccccc;
}

.title {
	font-size: 28rpx;
	color: #73747a;
	font-weight: bold;
}

.add-btn {
	color: #ff6503;
	border-radius: 10rpx;
	padding: 10rpx 20rpx;
	font-size: 28rpx;
	display: flex;
	align-items: center;
}

.search-container {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
	padding: 0 28rpx;
}

.search-input {
	min-width: 520rpx;
	width: 100%;
	flex: 1;
	box-sizing: border-box;
	height: 72rpx;
	padding-left: 80rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
	border-radius: 24px;
	opacity: 1;
	background: #f7f7f7;
}

.select-all-btn {
	background-color: transparent;
	margin-left: 6rpx;
	font-weight: 500;
}

.search-right {
	display: flex;
	align-items: center;
	min-width: 180rpx;
	justify-content: flex-end;
}

.all-icon {
	width: 36rpx;
	height: 36rpx;
}

.filter-item {
	flex: 1;
	height: 64rpx;
	line-height: 64rpx;
	background: #f7f7f7;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #080912;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
	margin-right: 36rpx;
	max-width: 300rpx;
}

.line1 {
	max-width: 260rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.status-text {
	font-size: 28rpx;
	color: #080912;
	margin-right: 10rpx;
}

.picker-view {
	display: flex;
	align-items: center;
}

.arrow-icon {
	width: 24rpx;
	height: 20rpx;
	margin-left: 10rpx;
}

.siauxan {
	display: flex;
	align-items: center;
	padding: 0 28rpx;
}

/* index.wxss */
.list-container {
	box-sizing: border-box;
	margin-top: 50rpx;
	padding-bottom: 260rpx;
}

.vehicle-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	border-bottom: 2rpx solid #eee;
	padding: 36rpx 32rpx;
}

.bg_f7 {
	background: #f7f7f7;
}

.vehicle-box {
	display: flex;
	align-items: center;
}

.vehicle-info {
	display: flex;
	align-items: center;
}

.plate-number {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-right: 20rpx;
}

.status {
	font-size: 24rpx;
	padding: 2rpx 10rpx;
	border-radius: 8rpx;
}

.owner-info {
	font-size: 26rpx;
	color: #858f9e;
	margin-top: 10rpx;
}

.check-icon {
	width: 34rpx;
	height: 34rpx;
	margin-right: 36rpx;
}

.detail-btn {
	width: 94rpx;
	height: 53rpx;
	font-size: 30rpx;
	line-height: 53rpx;
	text-align: center;
	color: #58595b;
	background: #f7f7f7;
	border-radius: 8rpx;
	border: 1rpx solid #cccccc;
}

.g {
	color: #11a567;
	border: 1rpx solid #3ec98f;
}

.r {
	color: #ff0000;
	border: 1rpx solid #cf4630;
}

.d {
	color: #979797;
	border: 1rpx solid #d8d8d8;
}

.bottom-bar {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 750px;
	height: 160px;
	background: #ffffff;
	box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	box-sizing: border-box;
	padding: 0 67rpx;
}

.reset-btn {
	width: 280rpx;
	height: 96rpx;
	border-radius: 64rpx;
	background: #fffbf6;
	box-sizing: border-box;
	border: 1rpx solid #ff9000;
	color: #666666;
	font-size: 32rpx;
	font-weight: 500;
	text-align: center;
	line-height: 96rpx;
	margin-right: 64rpx;
}

.submit-btn {
	width: 280rpx;
	height: 96rpx;
	border-radius: 64rpx;
	background: linear-gradient(180deg, #f7b77f 0%, #ec8733 100%), #ff6503;
	box-sizing: border-box;
	color: #fefefe;
	font-size: 32rpx;
	font-weight: 500;
	text-align: center;
	line-height: 96rpx;
}

.no-car {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.no-icon {
	width: 533rpx;
	height: 427rpx;
	margin-bottom: 36rpx;
}

.no-btn {
	width: 417rpx;
	height: 100rpx;
	border-radius: 46rpx;
	background: #fdeee4;
	display: flex;
	align-items: center;
	justify-content: center;
}

.no-add {
	margin-left: 12rpx;
	color: #ff6503;
	font-size: 32rpx;
	font-weight: bold;
}

.no-result {
	font-size: 28rpx;
	color: #98a2b3;
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
