<template>
	<view class="container">
		<up-navbar bgColor="#e8f0f8" placeholder :fixed="true" title="活动申请" autoBack></up-navbar>

		<view class="search-bar" :style="{ top: navBarHeight + 'px' }">
			<view class="search-input">
				<image class="search-icon" :src="imgUrl + 'volumePricing/vp_search.png'" />
				<view class="s-line"></view>
				<input v-model="keyword" placeholder="输入高速名或关键词" placeholder-class="ph" @confirm="onSearch" @input="onInput" />
			</view>
			<view class="btn-search" @click="onSearch">搜索</view>
		</view>

		<!-- 顶部搜索栏 -->
		<view class="pageCon">
			<!-- 列表 -->
			<template v-for="item in list" :key="item.id">
				<view v-if="item.highId == 1" @click="onDetail(item)">
					<view class="card">
						<view class="card-hd">
							<text class="title">{{ item.highName || item.name }}</text>
							<view class="detail">
								<text>查看详情</text>
								<image class="more-icon" :src="imgUrl + 'arrow-right-icon.png'" />
							</view>
						</view>
						<view class="rows">
							<view class="row m-b-14">
								<text class="label">活动时间</text>
								<text class="val">{{ item.startTime }}至{{ item.endTime }}</text>
							</view>
							<view class="row">
								<text class="label">优惠车型</text>
								<text class="val">{{ item.goalName || '未知类型' }}</text>
							</view>
						</view>
						<view class="card-ft">
							<view class="badge">
								<text>{{ item.minDiscount ? item.minDiscount || '—' : '暂无' }}</text>
								<text v-if="item.minDiscount" class="discount">折</text>
								<text v-if="item.minDiscount" class="subline sub">区间最低优惠</text>
							</view>
							<view class="btn-apply">立即申请</view>
						</view>
					</view>
				</view>
			</template>

			<!-- 空状态 -->
			<view v-if="!list.length && !loading" class="empty">暂无数据</view>
			<!-- 加载中状态 -->
			<view v-if="loading && list.length" class="loading">加载中...</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { imgUrl } from '@/config';
import CosHeader from '@/components/customNavBar/index.vue';

import { getDict } from '@/api/config';
import { yldjHighSpeedRoadBiz, getgaosulist, dictList } from '@/api/volumePricing';
import { onLoad } from '@dcloudio/uni-app';

import { toNav, toRec } from '@/utils/route';

// 布局相关
const backgroundColor = ref<string>('linear-gradient(180deg,rgba(230, 241, 252, 1) 0%, rgba(234, 239, 244, 1) 55%)');
const fontColor = ref<string>('#000');
const fixed = ref<boolean>(true);
const navBarHeight = ref<number>(0);

const isUser = ref<number>(0);

// 筛选相关
const keyword = ref<string>('');
const date = ref<string>('2025-10-01');
const highwayOptions = ref<string[]>([]);
const highwayIndex = ref<number>(0);

// 状态相关（已去掉触底分页）
const loading = ref<boolean>(false);
const hasMore = ref(true);
const searchTimer = ref<ReturnType<typeof setTimeout> | null>(null);

const rawList = ref([]);
const list = ref([]);
const pageNum = ref(1);
const pageSize = ref(4);
const total = ref(0);

onLoad((options: any) => {
	isUser.value = Number(options?.isUser ?? 0);
	fetchData();
});

onMounted(() => {
	// 获取导航栏高度
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44;
});

/**
 * 格式化时间范围
 */
const formatTimeRange = (start?: string, end?: string): string => {
	if (!start || !end) return '';
	// 根据实际接口返回的时间格式进行调整
	// return `${util.formatDate(start)} ${util.formatTime(start)} - ${util.formatDate(end)} ${util.formatTime(end)}`;
	return `${start} ~ ${end}`;
};

/**
 * 获取活动数据（一次性加载，不做触底分页）
 */
const fetchData = async (isLoadMore = false) => {
	if (loading.value) return;

	loading.value = true;

	try {
		// 如果后端需要分页参数，可以给一个足够大的 pageSize
		const params = {
			pageNum: pageNum.value,
			pageSize: pageSize.value,
			keyword: keyword.value,
		};

		const res: any = await yldjHighSpeedRoadBiz(params);
		console.log('活动接口返回：', res);
		const newList = Array.isArray(res?.clazz) ? res.clazz : [];
		const rawlists = isLoadMore ? [...rawList.value, ...newList] : newList;
		console.log('---123', newList);
		rawList.value = rawlists;
		loading.value = false;
		total.value = res?.total || 0;

		// 获取车型类型映射
		const goalIds = [...new Set(newList.map((item) => item.goal).filter(Boolean))];
		console.log(goalIds, '----------------------');
		getTypeList(goalIds, newList, isLoadMore);

		// 应用筛选（仅过滤不分页）
		applyFilterAndPaginate();

		hasMore.value = rawList.value.length < total.value;
	} catch (error: any) {
		uni.showToast({
			title: error?.message || '加载失败',
			icon: 'none',
		});
	} finally {
		loading.value = false;
	}
};

/**
 * 获取车型类型列表
 */
const getTypeList = async (goalIds, newList, isLoadMore) => {
	if (goalIds.length === 0) {
		// applyFilterAndPaginate();
		return;
	}
	try {
		const res: any = await getgaosulist({ type: 11 });
		console.log('查询车辆类型的参数', res);
		const typeMap = {};
		res.clazz.forEach((item) => {
			typeMap[item.data] = item.name || '未知类型';
		});

		// 为原始数据添加车型类型
		const listWithType = rawList.value.map((item) => ({
			...item,
			vehicleType: typeMap[item?.goal] || '未知类型',
		}));

		const updatedRawList = isLoadMore ? [...rawList.value.slice(0, -newList.length), ...listWithType] : listWithType;

		list.value = updatedRawList;
	} catch (error: any) {
		uni.showToast({
			title: error?.message || '获取车型失败',
			icon: 'none',
		});
	}
};

/**
 * 只做筛选，不做分页
 */
const applyFilterAndPaginate = () => {
	let filteredList = [...rawList.value];

	// 关键词筛选
	if (keyword.value) {
		const lowerKeyword = keyword.value.toLowerCase();
		filteredList = filteredList.filter((item) => (item.highName || item.name || '').toLowerCase().includes(lowerKeyword));
	}

	const paginatedList = filteredList.slice(0, pageNum.value * pageSize.value);

	// TODO: 日期、高速筛选逻辑也可以在这里补充

	list.value = paginatedList;
	console.log('----***-----', list.value);
};

/**
 * 搜索输入防抖处理
 */
const onInput = (e: any) => {
	const searchKey = (e?.detail?.value ?? '').trim();
	keyword.value = searchKey;

	// 清除之前的定时器
	if (searchTimer.value) {
		clearTimeout(searchTimer.value);
	}

	// 设置新的防抖定时器
	searchTimer.value = setTimeout(() => {
		fetchData();
	}, 500);
};

/**
 * 执行搜索（立即请求）
 */
const onSearch = () => {
	// 清除定时器，立即执行
	if (searchTimer.value) {
		clearTimeout(searchTimer.value);
	}
	fetchData();
};

/**
 * 查看详情
 */
const onDetail = (item) => {
	console.log('点击的申请子项', item);
	if (!item) return;

	if (item.highId == 1) {
		uni.navigateTo({
			url: `/pages_D/volumePricing/activityDetails/index?id=${item.id}&isUser=${isUser.value}&vehicleType=${item.vehicleType}`,
		});
	} else if (item.address) {
		// uni.navigateTo({
		// 	url: item.address
		// })
	}
};
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: #f6f7fb;
	background-image: linear-gradient(#e8f0f8 0%, #ebeff4 20%, #f6f7fb 30%, #f6f7fb 100%);
	position: relative;
}

.search-bar {
	width: 700rpx;
	display: flex;
	align-items: center;
	margin-bottom: 28rpx;
	border: 1.5rpx solid #156fff;
	border-radius: 24rpx;
	margin: 0 25rpx 25rpx;
	background: #fff;
	position: static;
	top: 0;
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

.pageCon {
	padding: 0 25rpx 60rpx;
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
	background: #fff;
	border-radius: 16rpx;
	padding: 29rpx 18rpx;
	margin-bottom: 24rpx;
}

.card-hd {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 11rpx;
}

.title {
	font-size: 28rpx;
	font-weight: 500;
	color: #505050;
}

.detail {
	display: flex;
	align-items: center;
	font-size: 26rpx;
	color: #a2a2a2;
}

.more-icon {
	width: 28rpx;
	height: 28rpx;
	margin-left: 16rpx;
}

.detail:active {
	opacity: 0.7;
}

.rows {
	margin-top: 33rpx;
	background: #f5f5f6;
	border-radius: 16rpx;
	padding: 22rpx 18rpx;
	margin-bottom: 36rpx;
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
	word-break: keep-all;
}

.val {
	color: #353535;
	font-size: 26rpx;
}

.card-ft {
	margin-top: 16rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 8rpx;
}

.badge {
	font-size: 42rpx;
	color: #ff0000;
}

.discount {
	font-size: 28rpx;
}

.subline {
	color: #a2a2a2;
	font-size: 24rpx;
	margin-left: 12rpx;
}

.btn-apply {
	height: 68rpx;
	line-height: 68rpx;
	border-radius: 32rpx;
	background: #fff;
	color: #3b82f6;
	font-size: 28rpx;
	text-align: center;
	border: 1rpx solid #3d83fe;
	padding: 0 30rpx;
}

.btn-apply:active {
	opacity: 0.8;
}

.empty {
	text-align: center;
	color: #98a2b3;
	padding: 80rpx 0;
	font-size: 28rpx;
}

.loading {
	text-align: center;
	color: #98a2b3;
	padding: 30rpx 0;
	font-size: 28rpx;
}
</style>
