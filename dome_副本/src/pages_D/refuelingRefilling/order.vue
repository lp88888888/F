<template>
	<view class="container">
		<!-- 自定义导航栏 -->
		<!-- <cos-header 
			title="加油订单" 
			:background-color="backgroundColor"
			:font-color="fontColor" 
			:fixed="fixed" 
			:defaultNavBarheight="100"
		></cos-header> -->
		<up-navbar
			title="加油订单"
			:bgColor="backgroundColor"
			@leftClick="toBack"
			placeholder
			:fixed="true"
		></up-navbar>
		<!-- 顶部标签栏 -->
		<view class="tab-con">
			<view class="tab-con1">
				<view v-for="(tab, index) in tabs" :key="index" class="tab-item" @click="tabChange(index)">
					<text :class="['tab-text', tabIndex === tab.value ? 'tab-select' : 'tab-normal']">
						{{ tab.label }}
					</text>
					<image v-if="tabIndex === tab.value" style="width: 30rpx; height: 8rpx" :src="imgUrl + 'zcby.png'" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 筛选栏 -->
			<view class="filter-bar">
				<!-- 能源类型筛选 - 第40行核心修复 -->
				<view class="filter-item filter-ls" @click="categoryFun('1')">
					<text :class="[optionindex1 > 0 ? 'active' : '']">{{ textValue(1) }}</text>
					<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
				</view>

				<!-- 时间筛选 -->
				<view class="filter-item filter-ls" @click="opentime()">
					<text>时间筛选</text>
					<view class="down"><up-icon name="arrow-down" size="11"></up-icon></view>
				</view>

				<!-- 筛选弹窗 -->
				<view class="category" v-if="iscategory">
					<view v-if="typeIndex === '1'">
						<view
							:class="['labelBox', optionindex1 === index ? 'active' : '']"
							v-for="(item, index) in option1"
							:key="index"
							@click="cateChange(1, index)"
						>
							{{ item.dictLabel }}
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 日期选择器 -->
		<up-calendar :show="show" :minDate="minDate" :maxDate="maxDate" :mode="mode" @close="show = false" @confirm="confirm"></up-calendar>

		<!-- 订单列表 - scroll-view 核心修复 -->
		<scroll-view
			class="list-con"
			scroll-y
			:style="{ height: scrollViewHeight }"
			refresher-enabled="true"
			:refresher-triggered="refreshing"
			@refresherpulling="onRefresherPulling"
			@refresherrefresh="refresh"
			@scrolltolower="onReachBottom"
			refresher-default-style="black"
		>
			<!-- 空状态 -->
			<emptyview v-if="addgasolinelist.length === 0" />

			<!-- 订单列表 -->
			<view v-else class="list-wrapper">
				<view v-for="item in addgasolinelist" :key="item.id" class="item-con" @click="itemClick(item.id)">
					<view :class="['item-bg', cancelMap[item.payStatus] && 'item-bg--disabled']">
						<!-- 订单号 + 支付状态 -->
						<view class="between-row">
							<view>订单号 | {{ item.id }}</view>
							<view>
								<template v-if="item.payStatus === 0">待支付</template>
								<template v-if="item.payStatus === 1">已支付</template>
								<template v-if="item.payStatus === 2">已取消</template>
								<template v-if="item.payStatus === 3">退款中</template>
								<template v-if="item.payStatus === 4">已退款</template>
							</view>
						</view>

						<!-- 订单标题 + 创建时间 -->
						<view class="between-row" style="margin-top: 26rpx">
							<view style="font-size: 28rpx; font-weight: 700; color: #000">
								{{ item.orderTitle }}
							</view>
							<view>{{ item.createTime }}</view>
						</view>

						<!-- 订单详情 -->
						<view class="jiayoulist">
							<view class="list-box-q">
								<text class="list-box-1">能源类型</text>
								<text class="list-box-2">{{ item.baseOrderInfoResponse.oilName }}汽油</text>
							</view>
							<view class="list-box-q">
								<text class="list-box-1">规格</text>
								<text class="list-box-2">{{ item.baseOrderInfoResponse.totalLitre }}L</text>
							</view>
							<view class="list-box-q">
								<text class="list-box-1">价格</text>
								<text class="list-box-2">¥{{ item.baseOrderInfoResponse.orderAmount }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载状态提示 -->
			<view v-if="loadingMore" class="load-more">加载中...</view>
			<view v-if="noMoreData" class="load-more">没有更多数据了</view>
		</scroll-view>
	</view>
</template>

<script lang="ts" setup>
// 1. 核心导入（修复未导入的API）
import { ref, computed, onMounted } from 'vue';
import { imgUrl } from '@/config';
import CosHeader from '@/components/customNavBar/index.vue';
import { getpayOrderInfoList } from '@/api/index';
import { getDict } from '@/api/config';

// 2. 导航栏配置（修复缺失的属性）
const navBarHeight = ref(0); // 导航栏高度(px)
const backgroundColor = ref<string>('transparent');
const fontColor = ref<string>('#333333');
const fixed = ref<boolean>(true);

// 3. 日期选择器配置（修复minDate兼容性）
const show = ref<boolean>(false);
const mode = ref<string>('range');
const d = new Date();
const year = d.getFullYear();
const month = String(d.getMonth() + 1).padStart(2, '0');
const day = String(d.getDate()).padStart(2, '0');
const maxDate = ref<string>(`${year}-${month}-${day}`);
// 修复minDate计算属性 - 兼容多端
const minDate = computed(() => {
	const now = new Date();
	now.setDate(now.getDate() - 30); // 30天前
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const d = String(now.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
});

// 4. 标签栏配置
const tabs = ref([
	{ label: '全部', value: '' },
	{ label: '待支付', value: '0' },
	{ label: '已支付', value: '1' },
	{ label: '已取消', value: '2' },
	{ label: '退款中', value: '3' },
	{ label: '已退款', value: '4' },
]);
const tabIndex = ref<string>('');
const toBack = () => {
	uni.navigateBack();
};
// 5. 分页配置（修复上拉加载逻辑）
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0); // 总条数
const totalPage = computed(() => Math.ceil(total.value / pageSize.value)); // 总页数
const loadingMore = ref<boolean>(false); // 加载中
const noMoreData = ref<boolean>(false); // 无更多数据
const refreshing = ref<boolean>(false); // 下拉刷新状态

// 6. 筛选配置（修复第40行textValue错误）
const cancelMap = ref({
	2: true, // 已取消
	4: true, // 已退款
	'04': true,
	CANCELLED: true,
	已取消: true,
});
const option1 = ref<Array<{ dictLabel: string; dictValue: string }>>([{ dictLabel: '全部', dictValue: '' }]); // 能源类型选项
const optionindex1 = ref<number>(0); // 当前选中的能源类型索引
const iscategory = ref<boolean>(false); // 筛选弹窗显示状态
const typeIndex = ref<string>(''); // 筛选类型
const startTime = ref<string>(''); // 开始时间
const endTime = ref<string>(''); // 结束时间

// 7. 订单列表数据
const addgasolinelist = ref<
	Array<{
		id: number;
		orderTitle: string;
		createTime: string;
		payStatus: number;
		baseOrderInfoResponse: {
			oilName: string;
			totalLitre: number;
			orderAmount: number;
		};
	}>
>([]);

// 8. 计算属性 - 修复scroll-view高度（核心）
const scrollViewHeight = computed(() => {
	// px转rpx（兼容不同设备）
	const sysInfo = uni.getSystemInfoSync();
	const pxToRpx = 750 / sysInfo.screenWidth;
	const navBarRpx = navBarHeight.value * pxToRpx;
	// 计算滚动区域高度（导航栏 + 标签栏 + 筛选栏 总偏移）
	return `calc(100vh - ${navBarRpx + 220}rpx)`;
});

// 9. 计算属性 - 修复第40行textValue方法
const textValue = computed((): ((type: number) => string) => {
	return (type: number) => {
		if (type === 1) {
			// 确保数组不为空，且当前索引在安全范围内
			if (option1.value.length === 0 || optionindex1.value >= option1.value.length) {
				return '类型';
			}
			const selectedOption = option1.value[optionindex1.value];
			// 索引为0通常是“全部”
			if (optionindex1.value === 0) {
				return '类型';
			}
			return selectedOption.dictLabel || '类型';
		}
		return '';
	};
});

// 10. 方法定义
/**
 * 筛选弹窗切换
 * @param type 筛选类型
 */
const categoryFun = (type: string) => {
	typeIndex.value = type;
	iscategory.value = !iscategory.value;
};

/**
 * 筛选选项变更
 * @param type 筛选类型
 * @param index 选项索引
 */
const cateChange = (type: number, index: number) => {
	if (type === 1) {
		optionindex1.value = index;
	}
	serlist(); // 重新查询
	iscategory.value = false; // 关闭弹窗
};

/**
 * 打开时间筛选器
 */
const opentime = () => {
	show.value = !show.value;
};

/**
 * 时间筛选确认
 * @param e 选中的时间范围
 */
const confirm = (e: Array<string>) => {
	startTime.value = e[0];
	endTime.value = e[e.length - 1];
	serlist(); // 重新查询
	show.value = false;
};

/**
 * 下拉刷新
 */
const refresh = async () => {
	refreshing.value = true;
	try {
		// 重置分页
		pageNum.value = 1;
		addgasolinelist.value = [];
		noMoreData.value = false;
		await loadData();
	} catch (err) {
		uni.showToast({ title: '刷新失败', icon: 'none', duration: 1500 });
	} finally {
		setTimeout(() => {
			refreshing.value = false;
		}, 1500);
	}
};

/**
 * 下拉刷新过程监听
 */
const onRefresherPulling = () => {
	// 可自定义下拉动画逻辑
};

/**
 * 上拉加载更多
 */
const onReachBottom = async () => {
	// 防止重复加载/无更多数据
	if (loadingMore.value || noMoreData.value || pageNum.value >= totalPage.value) {
		noMoreData.value = true;
		return;
	}

	loadingMore.value = true;
	pageNum.value++;
	try {
		await loadData();
	} catch (err) {
		pageNum.value--; // 加载失败回退页码
		uni.showToast({ title: '加载失败', icon: 'none', duration: 1500 });
	} finally {
		loadingMore.value = false;
	}
};

/**
 * 获取能源类型字典
 */
const gettypelist = async () => {
	try {
		const res = await getDict('oil_type');
		// 补充"全部"选项
		option1.value = [{ dictLabel: '全部', dictValue: '' }, ...res.data];
	} catch (err) {
		console.error('获取能源类型失败：', err);
	}
};

/**
 * 加载订单数据
 */
const loadData = async () => {
	// 加载中提示（非下拉刷新时）
	if (!refreshing.value && pageNum.value === 1) {
		uni.showLoading({ title: '加载中...' });
	}

	try {
		// 构造请求参数
		const params = {
			pageNum: pageNum.value,
			pageSize: pageSize.value,
			payStatus: tabIndex.value,
			oilId: option1.value[optionindex1.value].dictValue || '',
			startTime: startTime.value,
			endTime: endTime.value,
		};

		// 调用接口
		const res = await getpayOrderInfoList(params);
		if (res.code === 200) {
			const newList = res.data.list || [];
			addgasolinelist.value = [...addgasolinelist.value, ...newList];
			total.value = res.data.total || 0;
			// 判断是否无更多数据
			if (addgasolinelist.value.length >= total.value) {
				noMoreData.value = true;
			}
		} else {
			throw new Error(res.msg || '获取订单失败');
		}
	} catch (err: any) {
		uni.showToast({ title: err.message || '加载失败', icon: 'none', duration: 1500 });
	} finally {
		if (!refreshing.value && pageNum.value === 1) {
			uni.hideLoading();
		}
	}
};

/**
 * 标签切换
 * @param index 标签索引
 */
const tabChange = (index: number) => {
	const newValue = tabs.value[index].value;
	// 重置分页和数据
	pageNum.value = 1;
	addgasolinelist.value = [];
	noMoreData.value = false;
	tabIndex.value = newValue;
	loadData();
};

/**
 * 重新查询列表
 */
const serlist = () => {
	pageNum.value = 1;
	addgasolinelist.value = [];
	noMoreData.value = false;
	loadData();
};

/**
 * 订单项点击
 * @param id 订单ID
 */
const itemClick = (id: number) => {
	uni.navigateTo({
		url: `/pages_D/refuelingRefilling/orderDetails?id=${id}`,
	});
};

// 11. 生命周期 - 初始化
// 11. 生命周期 - 初始化
onMounted(() => {
	const sysInfo = uni.getSystemInfoSync();
	let menuButtonInfo = null;

	try {
		// 尝试获取胶囊按钮信息（小程序适用）
		menuButtonInfo = uni.getMenuButtonBoundingClientRect();
	} catch (e) {
		// H5/App 等环境无此API
	}

	// 统一计算自定义导航栏总高度（状态栏高度 + 导航栏高度）
	if (menuButtonInfo) {
		// 小程序环境：(胶囊顶部 - 状态栏) * 2 + 胶囊高度 + 状态栏高度
		navBarHeight.value = menuButtonInfo.height + (menuButtonInfo.top - sysInfo.statusBarHeight) * 2 + sysInfo.statusBarHeight;
	} else {
		// App/H5 环境： 状态栏高度 + 默认导航栏高度 44px
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44;
	}

	// 如果您的 cos-header 组件的实际高度逻辑与 uni-app 标准不一致，请根据实际情况微调最后的 `+ 44` 或 `+ 50`。

	// 初始化数据
	gettypelist();
	loadData();
});
</script>

<style lang="scss" scoped>
/* 全局容器 */
.container {
	background: #f8f9fb;
	height: 100vh;
	overflow: hidden;
}

/* 标签栏 */
.tab-con {
	width: 100%;
	padding: 0 40rpx 4rpx;
	box-sizing: border-box;
	background: linear-gradient(180deg, #d1e5f9 0%, rgba(255, 255, 255, 0) 100%);
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
	padding: 10rpx 0;
}

.tab-text {
	font-size: 32rpx;
	margin-bottom: 12rpx;
}

.tab-select {
	font-weight: bold;
	color: #333;
	font-size: 32rpx;
}

.tab-normal {
	font-weight: 500;
	color: #666;
}

/* 筛选栏 */
.filter-bar {
	padding: 0 20rpx;
	box-sizing: border-box;
	display: flex;
	border-radius: 8px;
	position: relative;
	margin-bottom: 30rpx;
	margin-top: 30rpx;
}

.filter-item {
	display: flex;
	text-align: center;
	font-size: 14px;
	width: 156rpx;
	height: 56rpx;
	background: #ffffff;
	border-radius: 322rpx;
	line-height: 56rpx;
	margin-right: 30rpx;
}

.filter-ls {
	align-items: center;
	justify-content: center;
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
	z-index: 99;
}

.active {
	color: #ff9000;
}

.labelBox {
	padding: 25rpx 32rpx;
	box-sizing: border-box;
	font-size: 28rpx;
}

/* 列表容器 */
.list-con {
	width: 100%;
	box-sizing: border-box;
	padding: 0 32rpx;
}

.list-wrapper {
	width: 100%;
}

/* 订单项 */
.item-con {
	margin-bottom: 24rpx;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 20rpx rgba(138, 78, 0, 0.05);
}

.item-bg {
	background-color: #ffffff;
	padding: 32rpx;
	border-radius: 20rpx;
}

.item-bg--disabled {
	opacity: 0.6;
}

/* 行布局 */
.between-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 26rpx;
	border-bottom: 2rpx solid #ebebeb;
	font-size: 26rpx;
}

/* 订单详情行 */
.jiayoulist {
	height: 118rpx;
	padding: 20rpx 60rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #f8f9fb;
	border-radius: 12rpx;
	margin-top: 20rpx;
}

.list-box-q {
	display: flex;
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

/* 加载提示 */
.load-more {
	text-align: center;
	padding: 20rpx 0;
	font-size: 24rpx;
	color: #999;
}
</style>
