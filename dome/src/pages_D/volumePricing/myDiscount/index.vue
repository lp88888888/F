<template>
	<view class="container">
		<view class="search-bar">
			<input type="text" placeholder="输入车牌号" placeholder-class="input-placeholder" class="search-input" :value="key" @input="onSearchInput" />
			<image :src="`${imgUrl}volumePricing/Search (Normal).png`" class="search-icon"></image>
			<view class="tongji" @tap="toUrl">
				<image :src="`${imgUrl}volumePricing/6262x.png`" class="shaixuan-icon"></image>
				优惠统计
			</view>
		</view>

		<view class="filter-section">
			<picker class="segment-picker" mode="selector" range-key="name" :value="selectedIndex" :range="identityOptions" @change="onIdentityChange">
				<view class="filter-item">
					{{ identityError || '身份筛选' }}
					<image class="arrow-icon" :src="`${imgUrl}volumePricing/arrBottom.png`" />
				</view>
			</picker>

			<picker class="segment-picker" mode="selector" range-key="name" :value="selectedIndex" :range="gslist" @change="handlegsChange">
				<view class="filter-item">
					{{ highwayError || '高速筛选' }}
					<image class="arrow-icon" :src="`${imgUrl}volumePricing/arrBottom.png`" />
				</view>
			</picker>

			<picker class="segment-picker" mode="selector" range-key="name" :value="selectedIndex" :range="luduanlist" @change="handleSegmentChange">
				<view class="filter-item">
					{{ sectionError || '路段筛选' }}
					<image class="arrow-icon" :src="`${imgUrl}volumePricing/arrBottom.png`" />
				</view>
			</picker>

			<picker
				v-if="roadId && userType && carlist.length"
				class="segment-picker"
				mode="selector"
				range-key="vehicleNumber"
				:value="selectedIndex"
				:range="carlist"
				@change="changeTypecarlist"
			>
				<view class="filter-item">
					{{ carError || '车辆筛选' }}
					<image class="arrow-icon" :src="`${imgUrl}volumePricing/arrBottom.png`" />
				</view>
			</picker>
		</view>

		<!--  -->
		<view class="herader-list" v-for="item in rawList" :key="item.id">
			<view class="order-info">
				<text class="order-number">订单编号：{{ item.orderCode }}</text>
				<text class="status">{{ item.orderStatus == 1 ? '已完成 ' : '未完成' }}</text>
			</view>

			<view class="station-info in-station" @tap="onViewDetails(item.id)">
				<view class="info-content-1">
					<view class="info-content-2">
						<image :src="`${imgUrl}volumePricing/vp_enter.png`" class="enter-icon"></image>
						<text class="station-name">{{ item.inName }}</text>
					</view>
					<text class="plate-number">{{ item.vehicleNumber }}</text>
				</view>
				<view class="info-content">入站时间：{{ item.inTime }}</view>
			</view>

			<view class="station-info in-station" @tap="onViewDetails(item.id)">
				<view class="info-content-1">
					<view class="info-content-2">
						<image :src="`${imgUrl}volumePricing/vp_exit.png`" class="enter-icon"></image>
						<text class="station-name">{{ item.outName }}</text>
					</view>
				</view>
				<view class="info-content">出站时间：{{ item.outTime }}</view>
			</view>

			<view class="segment-info">
				<view class="seg-box">
					<image :src="`${imgUrl}volumePricing/tiao-icon.png`" class="icon"></image>
					<text class="segment-name">{{ item.highName }}</text>
				</view>
				<view class="actual-payment">
					<text class="actual-text">实付</text>
					<text>¥{{ item.actualPrice }}</text>
				</view>
			</view>

			<view class="foter-bore">
				<view class="discount-info">
					<view class="discount-text">本次优惠</view>
					<view class="discount-amount">
						<text class="discount-unit">¥</text>
						<text>{{ item.otherPrice }}</text>
					</view>
				</view>
				<view class="bottom-buttons">
					<view class="feedback-btn" @tap="onFeedback">我要反馈</view>
					<view class="detail-btn" @tap="onViewDetails(item.id)">查看详情</view>
				</view>
			</view>
		</view>

		<ser-empty v-if="!rawList.length"></ser-empty>

		<uni-load-more v-if="rawList.length > 0 || loading" :status="loadingStatus" />
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { onReachBottom, onPullDownRefresh, onLoad } from '@dcloudio/uni-app';
import { debounce } from '@/utils/common';
import { yldjMyyh, getgaosulist, getgaosuluduanlist, vehiclePageByRoadId } from '@/api/volumePricing';
import { imgUrl } from '@/config';
import { toNav, toRec } from '@/utils/route';

// 接口类型定义
interface Option {
	id: string | number;
	name: string;
}
interface HighwayOption extends Option {
	data?: string; // For gaosulist's data field
}
interface SegmentOption extends Option {
	roadName1?: string;
	roadName2?: string;
}
interface CarOption {
	vehicleNumber: string;
	id: string; // Or number, based on API
}
interface DiscountRecord {
	id: string;
	orderCode: string;
	orderStatus: 1 | 0; // 1:已完成, 0:未完成
	inName: string;
	outName: string;
	vehicleNumber: string;
	inTime: string;
	outTime: string;
	highName: string;
	actualPrice: number;
	thisPrice: number;
}

// --- 状态数据定义 ---
const keyword = ref<string>('');
const key = ref<string>(''); // 搜索关键词

// 分页与列表
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);
const hasMore = ref<boolean>(true);
const loading = ref<boolean>(false);
const rawList = ref<DiscountRecord[]>([]);

// 筛选状态
const identityOptions: Option[] = [
	{ id: 0, name: '全部' },
	{ id: 1, name: '个人' },
	{ id: 2, name: '企业' },
];
const identityError = ref<string>(''); // 身份筛选显示文本
const userType = ref<string>(''); // 身份筛选ID (1:个人, 2:企业)
const selectedIndex = ref<number>(0); // 新增：解决selectedIndex未定义错误

const highwayError = ref<string>(''); // 高速筛选显示文本
const gaosuid = ref<string>(''); // 高速ID
const gslist = ref<HighwayOption[]>([]); // 高速列表

const sectionError = ref<string>(''); // 路段筛选显示文本
const roadId = ref<string>(''); // 路段ID
const luduanlist = ref<SegmentOption[]>([]); // 路段列表

const carError = ref<string>(''); // 车辆筛选显示文本 (车牌号)
const carlist = ref<CarOption[]>([]); // 车辆列表

// 计算属性用于加载状态提示
const loadingStatus = computed(() => {
	if (loading.value) return 'loading';
	if (!hasMore.value && rawList.value.length > 0) return 'noMore';
	return 'more';
});

// --- 方法定义 ---

/** 重新设置分页并获取列表 */
const resetAndFetch = () => {
	pageNum.value = 1;
	rawList.value = [];
	hasMore.value = true;
	total.value = 0;
	getList();
};

/** 搜索输入 */
const onSearchInput = debounce((e: any) => {
	const searchKey = e.detail.value.trim();
	key.value = searchKey;
	resetAndFetch();
}, 500); // 500ms 防抖

/** 获取列表数据 */
const getList = async () => {
	if (loading.value || (!hasMore.value && pageNum.value > 1)) return;

	loading.value = true;

	const params = {
		pageNum: pageNum.value,
		pageSize: pageSize.value,
		highId: '', // 示例中未用到
		secId: roadId.value,
		vehicleNumber: carError.value,
		key: key.value || '',
		userType: userType.value || '',
	};

	const isAppend = pageNum.value > 1;

	try {
		const res = await yldjMyyh(params);
		const page = res?.page || {};
		const list = Array.isArray(page.records) ? page.records : [];
		const totalCount = Number(page.total || 0);

		hasMore.value = totalCount ? pageNum.value * pageSize.value < totalCount : list.length >= pageSize.value;

		const merged = isAppend ? rawList.value.concat(list) : list;

		rawList.value = merged;
		total.value = totalCount;
	} catch (message: any) {
		console.log('查询车辆报错', message);
	} finally {
		loading.value = false;
	}
};

/** 获取高速列表 */
const getgslist = async (type: string) => {
	try {
		const params = { type };
		const res = await getgaosulist(params);
		gslist.value = res.clazz || [];

		// 默认选择第一个高速
		if (gslist.value.length > 0) {
			const list = gslist.value[0];
			gaosuid.value = list.data ? list.data : '';
			highwayError.value = list.name;
			getluduanlist(); // 依赖 gaosuid，因此在这里调用
		}
	} catch (err) {
		console.error('获取高速列表失败:', err);
	}
};

/** 获取路段列表 */
const getluduanlist = async () => {
	try {
		const params = { highId: gaosuid.value };
		const res = await getgaosuluduanlist(params);

		// 映射和格式化数据
		const luduanlistFormatted: SegmentOption[] = (res.clazz || []).map((item: any) => ({
			id: item.id,
			name: `${item.roadName1}-${item.roadName2}`,
			roadName1: item.roadName1,
			roadName2: item.roadName2,
		}));

		const newList = [{ id: '', name: '全部' } as SegmentOption].concat(luduanlistFormatted);
		luduanlist.value = newList;
	} catch (err) {
		console.error('获取路段列表失败:', err);
	}
};

/** 获取车辆列表 */
const getcarlist = async () => {
	// 只有当有路段ID和用户类型时才获取车辆
	if (!roadId.value || !userType.value) {
		carlist.value = [];
		return;
	}
	try {
		const params = {
			pageNum: '1',
			pageSize: '10000',
			roadId: roadId.value,
			bindType: userType.value == '1' ? '01' : '02', // 1:个人 -> '01', 2:企业 -> '02'
		};
		const res = await vehiclePageByRoadId(params);
		carlist.value = res.page.records || [];
	} catch (err) {
		console.error('获取车辆列表失败:', err);
	}
};

/** 选择高速 */
const handlegsChange = (e: any) => {
	const index = Number(e.detail.value);
	const selected = gslist.value[index];
	if (selected) {
		gaosuid.value = selected.data || '';
		highwayError.value = selected.name;
		roadId.value = '';
		carError.value = '';
		resetAndFetch();
		getluduanlist();
	}
};

/** 选择路段 */
const handleSegmentChange = (e: any) => {
	const index = Number(e.detail.value);
	const selected = luduanlist.value[index];
	if (selected) {
		sectionError.value = selected.name;
		roadId.value = String(selected.id);
		carError.value = '';
		resetAndFetch();
		getcarlist(); // 获取车辆列表
	}
};

/** 选择车辆 */
const changeTypecarlist = (e: any) => {
	const index = Number(e.detail.value);
	const selected = carlist.value[index];
	if (selected) {
		carError.value = selected.vehicleNumber;
		resetAndFetch();
	}
};

/** 身份筛选 */
const onIdentityChange = (e: any) => {
	const index = Number(e.detail.value);
	const selected = identityOptions[index];
	identityError.value = selected.name;
	// userType 是 0, 1, 2，但 API 需要 string，这里改为 string
	userType.value = String(selected.id);
	carError.value = '';

	// 重新获取数据和车辆列表
	getcarlist();
	resetAndFetch();
};

/** 跳转统计页 */
const toUrl = () => {
	toNav('/pages_D/volumePricing/discountStatistics/index');
};

/** 查看详情 */
const onViewDetails = (id: string) => {
	toNav(`/pages_D/volumePricing/detail/index?id=${id}`);
};

/** 我要反馈 */
const onFeedback = () => {
	toNav('/pages_D/volumePricing/submitOpinions/index');
};

// --- 生命周期与页面事件 ---

onLoad(() => {
	// 模拟 onLoad 逻辑
	resetAndFetch(); // 获取列表
	getgslist('10'); // 获取高速列表
});

// UniApp 页面触底加载
onReachBottom(() => {
	if (loading.value || !hasMore.value) return;
	pageNum.value += 1;
	getList();
});

// UniApp 下拉刷新
onPullDownRefresh(() => {
	resetAndFetch();
	uni.stopPullDownRefresh();
});
</script>

<style scoped lang="scss">
/* pages_D/volumePricing/myDiscount/index.wxss */
page {
	background-color: #f8f8fa;
}

/* 容器 */
.container {
	// padding: 30rpx;
	background-color: #f8f8fa;
	min-height: 100vh;
}

/* 搜索框 */
.search-bar {
	position: relative;
	padding: 26rpx;
	display: flex;
}

.search-input {
	box-sizing: border-box;
	width: 486rpx;
	height: 80rpx;
	background: #f0f0f0;
	border-radius: 24rpx;
	padding: 0 80rpx;
	font-size: 28rpx;
	color: #333;
	margin-right: 50rpx;
}

.input-placeholder {
	font-size: 32rpx;
	color: #cccccc;
}

.tongji {
	display: flex;
	align-items: center;
	color: #3bb371;
	font-size: 28rpx;
	word-break: keep-all;
}

.search-icon {
	position: absolute;
	left: 50rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 42rpx;
	height: 42rpx;
}

.shaixuan-icon {
	width: 42rpx;
	height: 42rpx;
	margin-right: 10rpx;
}

/* 筛选标题 */
.filter-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
}

.filter-section {
	display: flex;
	align-items: center;
	padding: 0 26rpx;
}

.segment-picker,
.vehicle-picker {
	display: flex;
	align-items: center;
	/* width: 188rpx; */
	padding: 0 15rpx;
	height: 64rpx;
	box-sizing: border-box;
	background-color: #fff;
	border-radius: 8rpx;
	padding-left: 10rpx;
	font-size: 26rpx;
	color: #333;
	margin-right: 40rpx;
}

.picker-view {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
}

.arrow-icon {
	width: 20rpx;
	height: 15rpx;
	margin-left: 10rpx;
}

/* 容器 */
.herader-list {
	margin: 26rpx;
	border-radius: 16rpx;
	background-color: #fff;
	padding: 24rpx 26rpx;
}

/* 订单信息 */
.order-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 30rpx;
	border-bottom: 1rpx solid #d8d8d8;
	margin-bottom: 20rpx;
}

.order-number {
	font-size: 22rpx;
	color: #999;
}

.status {
	font-size: 28rpx;
	color: #1186f8;
}

.info-content-1 {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.info-content-2 {
	display: flex;
	align-items: center;
}

.enter-icon {
	width: 34rpx;
	height: 34rpx;
	margin-right: 18rpx;
}

/* 站点信息 */
.station-info {
	margin-bottom: 20rpx;
	padding: 20rpx;
	background-color: #fff;
	border-radius: 10rpx;
}

.segment-info .icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 18rpx;
}

.seg-box {
	display: flex;
	align-items: center;
}

.info-content {
	margin-top: 20rpx;
	font-size: 28rpx;
	color: #adadad;
	margin-left: 52rpx;
}

.station-name {
	font-size: 30rpx;
	color: #3a3a3a;
	font-weight: 600;
}
.actual-text {
	font-size: 24rpx;
	color: #9b9b9b;
	margin-right: 16rpx;
}
.time {
	font-size: 24rpx;
	color: #666;
}

.plate-number {
	font-size: 32rpx;
	color: #000;
	font-weight: 600;
}

/* 路段信息 */
.segment-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
	padding: 20rpx;
	background-color: #fff;
	border-radius: 10rpx;
}

.segment-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 20rpx;
}

.segment-name {
	font-size: 24rpx;
	color: #9b9b9b;
}

.actual-payment {
	display: flex;
	align-items: center;
	color: #3d3d3d;
	font-weight: 600;
}

/* 优惠信息 */
.discount-info {
	display: flex;
	align-items: baseline;
	margin-top: 30rpx;
}

.discount-text {
	font-size: 24rpx;
	color: #9b9b9b;
	align-items: center;
	margin-right: 12rpx;
}

.discount-amount {
	font-size: 42rpx;
	color: #ff0000;
	font-weight: 500;
}

.discount-unit {
	font-weight: 500;
	font-size: 26rpx;
}

/* 底部按钮 */
.bottom-buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 30rpx;
}

.feedback-btn,
.detail-btn {
	width: 140rpx;
	height: 60rpx;
	line-height: 60rpx;
	text-align: center;
	font-size: 28rpx;
	color: #000;
	border-radius: 10rpx;
	border: 1px solid #b8b8b8;
	margin-left: 20rpx;
}

.foter-bore {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-top: 1rpx solid #d8d8d8;
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

.no-add {
	font-weight: 400;
	font-size: 24rpx;
	color: #868686;
}
</style>
