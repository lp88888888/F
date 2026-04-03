<template>
	<view class="feedback-con" :class="!issueList.length && !isSearch ? 'bg_w' : 'bg_f5'">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-box">
				<view class="input-box" v-if="issueList.length || (!issueList.length && isSearch)">
					<image class="search-icon" :src="`${imgUrl}/wximage/trip-pro/search-icon.png`" />
					<u-input
						v-model="keyword"
						placeholder="输入关键词"
						placeholderClass="placeholder"
						border="none"
						clearable
						@change="onInput"
						class="search-input"
					/>
				</view>
				<view v-else class="input-boxs"></view>
				<view class="add-btn" @click="onFeedbackAdd">
					<image class="add-o-icon" :src="imgUrl + 'volumePricing/vp_add.png'" />
					<text class="btn-txt">新增反馈</text>
				</view>
			</view>

			<!-- 筛选 -->
			<view class="filters" v-if="issueList.length || (!issueList.length && isSearch)">
				<picker mode="selector" :range="statusOptions" range-key="name" @change="onStatusChange">
					<view class="filter-item">
						{{ statusError || '状态筛选' }}
						<image class="arrow-icon" :src="imgUrl + 'volumePricing/arrBottom.png'" />
					</view>
				</picker>
				<picker mode="selector" :range="issueOptions" range-key="name" @change="onIssueChange">
					<view class="filter-item">
						{{ issueError || '问题筛选' }}
						<image class="arrow-icon" :src="imgUrl + 'volumePricing/arrBottom.png'" />
					</view>
				</picker>
				<picker mode="selector" :range="identityOptions" range-key="name" @change="onIdentityChange">
					<view class="filter-item">
						{{ identityError || '身份筛选' }}
						<image class="arrow-icon" :src="imgUrl + 'volumePricing/arrBottom.png'" />
					</view>
				</picker>
			</view>
		</view>

		<!-- 空状态 -->
		<ser-empty v-if="!issueList.length"></ser-empty>
		<!-- <view v-if="!issueList.length && isSearch" class="no-car">
			<image :src="imgUrl + 'volumePricing/vp_nocar.png'" class="no-icon" />
			<view class="no-btn" @tap="onFeedbackAdd">
				<image :src="imgUrl + 'volumePricing/vp_add.png'" class="add-o-icon" />
				<text class="no-add">新增反馈</text>
			</view>
		</view> -->

		<!-- 列表 -->
		<view v-if="issueList.length" class="issue-list" :class="!issueList.length && isSearch ? '' : 'bg_f5'">
			<view class="issue-item" v-for="item in issueList" :key="item.id" @click="onDetails(item.id)">
				<view class="issue-header">
					<view class="title-box">
						<image class="tit-icon" :src="imgUrl + 'volumePricing/vp_feedback_d.png'" />
						<text class="issue-title">{{ item.content }}</text>
					</view>
					<text class="status-text" :style="{ color: item.statusColor }">
						{{ item.status }}
					</text>
				</view>
				<view class="issue-details">
					<view class="row m-b-10">
						<text class="label">车牌号码</text>
						<text class="value">{{ item.vehicleNumber || '-' }}</text>
					</view>
					<view class="row">
						<text class="label">反馈时间</text>
						<text class="value">{{ item.createTime || '-' }}</text>
					</view>
				</view>
			</view>

			<!-- 底部加载/没有更多 -->
			<view v-if="loading && issueList.length" class="load-more">加载中...</view>
			<view v-if="!loading && pageNum >= totalPage && issueList.length" class="load-more no-more"> 没有更多数据了 </view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
import noData from '../../components/noData.vue';
import { getYldjFeedbackpageList, getgaosulist } from '@/api/volumePricing';
import { toNav, toRec } from '@/utils/route';

interface StatusOption {
	id: string | number;
	name: string;
}

interface IdentityOption {
	id: number;
	name: string;
}

interface IssueOption {
	id?: string;
	name: string;
	data?: string | number;
}

interface IssueItem {
	id: string | number;
	content: string;
	status: string;
	statusColor: string;
	vehicleNumber: string;
	createTime: string;
	auditStatus: number;
}

interface PageResponse {
	page: {
		records: any[];
		pages: number;
	};
}

// 初始化数据
const statusOptions = ref<StatusOption[]>([
	{ id: '', name: '全部' },
	{ id: 0, name: '平台已处理' },
	{ id: 1, name: '客服已查看' },
	{ id: 2, name: '专员已处理' },
	{ id: 3, name: '处理完成' },
]);

const identityOptions = ref<IdentityOption[]>([
	{ id: 0, name: '全部' },
	{ id: 1, name: '个人' },
	{ id: 2, name: '企业' },
]);

const identityError = ref('');
const userType = ref<string | number>('');
const statusError = ref('');
const auditStatus = ref<string | number>('');
const issueList = ref<IssueItem[]>([]);
const issueOptions = ref<IssueOption[]>([]);
const pageNum = ref(1);
const totalPage = ref(0);
const issueError = ref('');
const feedBackType = ref<string | number>('');
const keyword = ref('');
const isSearch = ref(false);
const hasMore = ref(true);
const loading = ref(false);
const searchTimer = ref<NodeJS.Timeout | null>(null);

onShow(() => {
	issueList.value = [];
	onPullDownRefreshHandler();
	getgslist();
});

// 上拉加载处理
onReachBottom(() => {
	if (pageNum.value >= totalPage.value) {
		loading.value = false;
		return;
	}
	pageNum.value += 1;
	loadData();
});

// 下拉刷新处理
onPullDownRefresh(() => {
	onPullDownRefreshHandler();
});

// 下拉刷新逻辑
const onPullDownRefreshHandler = () => {
	pageNum.value = 1;
	issueList.value = [];
	loadData();
};

const mapStatus = (raw: number | string) => {
	if (Number(raw) === 1) {
		return { statusText: '处理中', statusColor: '#FF6F22' };
	}
	return { statusText: '已处理', statusColor: '#1CC26C' };
};

const normalizeList = (records: IssueRaw[]): IssueView[] =>
	records.map((item) => {
		const m = mapStatus(item.status);
		return {
			...item,
			statusText: m.statusText,
			statusColor: m.statusColor,
		};
	});

// 新增反馈跳转
const onFeedbackAdd = () => {
	toNav('/pages_D/volumePricing/submitOpinions/index');
};

// 反馈详情跳转
const onDetails = (id: number | string) => {
	toNav(`/pages_D/volumePricing/feedbackDetails/index?id=${id}`);
};

// 问题类型筛选变化
const onIssueChange = (e) => {
	var index = e.detail.value;
	const list = issueOptions.value[index];
	issueError.value = list.name;
	feedBackType.value = list.data || '';
	isSearch.value = true;
	onPullDownRefreshHandler();
};

const onStatusChange = (e: any) => {
	let index = e.detail.value;
	var list = statusOptions.value[index];
	statusError.value = list.name;
	auditStatus.value = list.id;
	isSearch.value = true;
	onPullDownRefreshHandler();
};

const onIdentityChange = (e) => {
	let index = e.detail.value;
	let list = identityOptions.value[index];
	identityError.value = list.name;
	userType.value = list.id;
	isSearch.value = true;
	onPullDownRefreshHandler();
};

// 搜索输入处理（防抖）
const onInput = (e) => {
	console.log('搜索框的输入搜索', e);
	const searchKey = e.trim();
	keyword.value = searchKey;
	isSearch.value = true;

	// 清除之前的定时器
	if (searchTimer.value) {
		clearTimeout(searchTimer.value);
		searchTimer.value = null;
	}

	// 新增定时器
	searchTimer.value = setTimeout(() => {
		hasMore.value = true;
		onPullDownRefreshHandler();
	}, 500);
};

// 获取问题类型列表
const getgslist = async () => {
	const params = {
		type: 'yldjFeedback',
	};

	const res = await getgaosulist(params);
	const newList = [{ id: '', name: '全部' }].concat(res.clazz);
	issueOptions.value = newList;

	// 设置默认选中第一个
	const defaultItem = newList[0];
	issueError.value = defaultItem.name;
	feedBackType.value = defaultItem.data || '';

	loadData();
};

const loadData = async () => {
	loading.value = true;
	const params = {
		pageNum: pageNum.value,
		pageSize: 6,
		keyword: keyword.value,
		feedBackType: feedBackType.value,
		auditStatus: auditStatus.value,
		userType: userType.value || '',
	};
	try {
		const res = await getYldjFeedbackpageList(params);
		loading.value = false;

		const list = res.page.records;
		// 处理状态和颜色
		const formattedList = list.map((item: any) => {
			let status = '';
			let statusColor = '';

			switch (item.auditStatus) {
				case 0:
					status = '平台已处理';
					statusColor = '#FF0CF3';
					break;
				case 1:
					status = '客服已查看';
					statusColor = '#1186F8';
					break;
				case 2:
					status = '专员已处理';
					statusColor = '#FF6F22';
					break;
				case 3:
					status = '处理完成';
					statusColor = '#1CC26C';
					break;
				default:
					status = '';
					statusColor = '';
			}

			return {
				...item,
				status,
				statusColor,
			};
		});

		// 合并数据
		issueList.value = pageNum.value === 1 ? formattedList : [...issueList.value, ...formattedList];

		totalPage.value = res.page.pages;
		hasMore.value = pageNum.value < res.page.pages;
	} catch (error) {
		// stopPullDownRefresh();
		loading.value = false;
		uni.showToast({ title: error, icon: 'none' });
		hasMore.value = false;
	}
};

// 上拉触底
onReachBottom(async () => {
	if (pageNum.value >= totalPage.value) {
		uni.showToast({ title: '没有更多数据了!', icon: 'none' });
		return;
	}
	pageNum.value += 1;
	// await loadData()
});
</script>

<style lang="scss" scoped>
.feedback-con {
	min-height: 100vh;
}

.bg_f5 {
	background: #f5f5f5;
}

.bg_w {
	background: #ffffff;
}

.search-bar {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: #fff;
	padding: 30rpx 36rpx 0 27rpx;
}

.search-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.input-box {
	width: 486rpx;
	height: 72rpx;
	border-radius: 24rpx;
	background: #f6f6f6;
	display: flex;
	align-items: center;
}

.search-icon {
	width: 30rpx;
	height: 30rpx;
	margin-left: 16rpx;
}

.search-input {
	width: 70%;
	padding: 10px;
}

.placeholder {
	color: #cccccc;
	font-size: 32rpx;
}

.add-btn {
	display: flex;
	align-items: center;
}

.add-o-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 12rpx;
}

.btn-txt {
	font-size: 28rpx;
	font-weight: 500;
	color: #ff6503;
}

.filter {
	width: 28%;
}

.picker {
	padding: 10px;
	background-color: #fff;
	border-radius: 5px;
	border: 1px solid #ccc;
}

.issue-list {
	width: 750rpx;
	padding: 32rpx 0;
	box-sizing: border-box;
}

.bg_f5 {
	background-color: #f5f5f5;
}

.issue-item {
	width: 702rpx;
	background-color: #fff;
	padding: 30rpx;
	margin: 0 auto;
	margin-bottom: 10px;
	border-radius: 5px;
	box-sizing: border-box;
}

.issue-header {
	width: 642rpx;
	display: flex;
	justify-content: space-between;
	margin-bottom: 24rpx;
	padding-bottom: 20rpx;
	box-sizing: border-box;
	border-bottom: 1rpx solid #f8f8f8;
}

.title-box {
	flex: 1 0;
	display: flex;
	align-items: center;
	overflow: hidden;
}

.tit-icon {
	width: 42rpx;
	height: 42rpx;
	margin-right: 10rpx;
}

.issue-title {
	flex: 1 0;
	width: 0;
	font-size: 30rpx;
	font-weight: 600;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.status-text {
	font-size: 14px;
	width: 160rpx;
	text-align: right;
	word-break: keep-all;
}

.issue-details {
	margin-bottom: 10px;
}

.issue-footer {
	text-align: right;
}

.process-button {
	padding: 8px 15px;
	background-color: #ff9600;
	color: #fff;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}

.process-button:hover {
	background-color: #e68900;
}

.filters {
	display: flex;
	gap: 16rpx;
	margin-bottom: 20rpx;
	// picker {
	// 	flex: 1 0;
	// 	width: 0;
	// }
}

.filter-item {
	// width: 100%;
	height: 64rpx;
	line-height: 64rpx;
	background: #f6f6f6;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #080912;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
	margin-top: 20rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	box-sizing: border-box;
}

.arrow-icon {
	width: 24rpx;
	height: 20rpx;
	margin-left: 10rpx;
}

.label {
	font-size: 27rpx;
	color: #7f7f7f;
	margin-right: 37rpx;
}

.m-b-10 {
	margin-bottom: 10rpx;
}

.value {
	font-size: 27rpx;
}

.no-car {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.no-icon {
	width: 521rpx;
	height: 427rpx;
	margin: 0 120rpx 36rpx 109rpx;
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

.add-icon {
	width: 32rpx;
	height: 32rpx;
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
