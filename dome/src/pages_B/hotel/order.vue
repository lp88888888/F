<template>
	<view class="container"  :data-theme="pageTheme" >
		<up-navbar title="订单" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
		<!-- 顶部标签栏 -->
		<view class="tab-con" >
			<view v-for="(tab, index) in tabs" :key="index" class="tab-item" @click="tabChange(index)">
				<text :class="['tab-text', tabIndex === tab.value ? 'tab-select' : 'tab-normal']">
					{{ tab.label }}
				</text>
				<!-- <view v-if="tabIndex === tab.value" class="tab-line"></view> -->
			</view>
		</view>
		
		<!-- 列表区域 -->
		<scroll-view scroll-y class="list-con" @scrolltolower="onReachBottom">
		
			<!-- 订单列表 -->
			<view>
				<view v-for="item in hotelsList" :key="item.id" class="item-con" @click="itemClick(item.id)">
					<!-- 使用动态类名控制禁用样式 -->
					<view :class="['item-bg', cancelMap[item.status] && 'item-bg--disabled']">
						<!-- 标题行：酒店名称 + 状态 -->
						<view class="between-row">
							<image :src="imgUrl + 'hotel_icon.png'" class="ht-icon" />
							<view class="ht-name">{{ item.hotelName }}</view>
							<view :class="['ht-label', statusCls[item.orderStatus] || 'status-2']">
								{{ statusText[item.orderStatus] || '已取消' }}
							</view>
						</view>
		
						<!-- 内容行：图片 + 信息 -->
						<view class="row-con">
							<image :src="item.mainImage[0]" class="goods-img" mode="aspectFill" />
							<view class="goods-name">
								<text class="tex24_66">{{ item.roomTypeName }}共{{item.roomCount}}间{{item.stayDays}}晚</text>
								<text
									class="tex24_66 m-tb-24">{{ item.checkInDate }}至{{ item.checkOutDate }}</text>
								<text class="tex24_66">预定订单总额: ¥{{ item.payAmount }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view style="height: 300rpx;"></view>
		</scroll-view>
		<!-- 空状态 -->
			<view class="serempty" v-if="hotelsList.length == 0">
					<ser-empty></ser-empty>
			</view>
					
		
		<!-- 底部导航 -->
		<BottomNavigation :current-page="currentPage" @change="handleNavChange" />
	</view>
</template>
<script lang="ts" setup>
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '@/config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import BottomNavigation from './components/bottom-navigation.vue'
	import { getmerchantOrderlist } from '@/api/hotel';
	import { toNav,toBack } from '@/utils/route';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	// 假设这些是全局配置或 API 模块
	// import { integralApi } from '@/api/integralApi'
	// import { getUserInfo } from '@/utils/auth'
	// import { formatDateWeek } from '@/utils/date'



	// 标签数据
	const tabs = [
		{ label: '全部', value: '' },
		{ label: '待确认', value: '0' },
		{ label: '待入住', value: '1' },
		{ label: '已入住', value: '2' },
		{ label: '已完成', value: '3' },
		{ label: '已取消', value: '4' },
		{ label: '已退款', value: '5' },
	];

	const tabIndex = ref<string>('');
	const pageNum = ref(1);
	const totalPage = ref(0);

	// 映射表
	const statusText = {
		0: '待确认',
		1: '待入住',
		2: '已入住',
		3: '已完成',
		4: '已取消',
		5: '已退款',
	};

	const statusCls = {
		0: 'status-1',
		1: 'status-1',
		2: 'status-2',
		3: 'status-3',
		4: 'status-4',
	};

	const cancelMap = {
		4: true,
		'04': true,
		CANCELLED: true,
		'已取消': true,
	};

	// 布局
	const backgroundColor = ref<string>('#FFFFFF');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref<number>(0);
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
	});

	// 酒店列表数据（示例）
	const hotelsList = ref<OrderItem[]>([]);

	// 类型定义
	interface OrderItem {
		id : number;
		imageUrl : string;
		name : string;
		address : string;
		price : number;
		status : number | string;
		date : string;
	}

	// 页面生命周期
	onMounted(() => {
		console.log('Exchange List Page Mounted');
	});


	// 下拉刷新
	const refresh = () => {
		uni.startPullDownRefresh(); // 触发下拉动画
		setTimeout(() => {
			hotelsList.value = []; // 清空旧数据
			pageNum.value = 1;
			loadData();
		}, 100);
	};

	// 上拉加载更多
	const onReachBottom = () => {
		console.log("触底的数据",totalPage.value,hotelsList.value.length)
		if ( totalPage.value > hotelsList.value.length) {
			pageNum.value+=1;
			loadData();
		}else{
			uni.showToast({ title: '没有更多数据了', icon: 'none', duration: 1500 });
		}
	}
	const currentPage = ref('order')
	onMounted(() => {
		const pages = getCurrentPages()
		const currentPageInstance = pages[pages.length - 1]
		const route = currentPageInstance.route
		// 根据路由设置当前页面标识
		if (route?.includes('hotellist')) {
			currentPage.value = 'hotellist'
		} else if (route?.includes('collect')) {
			currentPage.value = 'collect'
		} else if (route?.includes('order')) {
			currentPage.value = 'order'
		}
		loadData()
	})
	const handleNavChange = ({ page, route } : { page : string; route : string }) => {
		currentPage.value = page
		console.log('导航切换到:', page, route)
		uni.redirectTo({
			url: route
		})
	}

	// 模拟加载数据（替换为真实 API 调用）
	const loadData = () => {
		// 示例：模拟请求延迟
		// 这里应调用真实接口，例如：
		getmerchantOrderlist({
			pageNum: pageNum.value,
			pageSize: 20,
			orderStatus: tabIndex.value
		}).then(res => {
			console.log("查询的酒店订单列表",res)
			const newList = res.rows; // 处理数据
			newList.forEach((hotel) => {
				if (hotel.mainImage) {
					hotel.mainImage = hotel.mainImage.split(',')
				} else {
					hotel.mainImage = []
				}

			})
			hotelsList.value = pageNum.value == 1 ? newList : [...hotelsList.value, ...newList];
			totalPage.value = Number(res.total);
		}).catch(err => {
			uni.showToast({ title: err.message || '加载失败', icon: 'none' });
		}).finally(() => {
			uni.hideLoading();
		});
		// 模拟返回数据（仅用于演示）
		// setTimeout(() => {
		// 	const mockData : OrderItem[] = [
		// 		// 可在此添加分页返回的新数据
		// 	];
		// 	hotelsList.value = hotelsList.value.concat(mockData);
		// 	totalPage.value = 3; // 模拟总页数
		// 	uni.hideLoading();
		// }, 800);
	};

	// Tab 切换
	const tabChange = (index : number) => {
		const newValue = tabs[index].value;
		pageNum.value = 1
		hotelsList.value = [];
		tabIndex.value = newValue;
		loadData();
	};


	// 项目点击
	const itemClick = (id : number) => {
		uni.navigateTo({
			url: `/pages_B/hotel/orderDetails?id=${id}`,
		});
	};
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		background:var(--head-color);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* 标签栏 */
	.tab-con {
		width: 690rpx;
		height: 104rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 40rpx 4rpx;
		box-sizing: border-box;
		overflow-x: auto;
	}

	.tab-item {
		min-width: 120rpx;
		margin-right: 40rpx;
		text-align: center;
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

	.tab-select::after {
		content: "";
		position: absolute;
		left: 50%;
		bottom: -20rpx;
		width: 60rpx;
		height: 8rpx;
		transform: translateX(-50%);
		background-color: var(--primary-color);
		border-radius: 4rpx;
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
		overflow-y: auto;
	}

	.item-con {
		margin-bottom: 24rpx;
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
		padding-bottom: 20rpx;
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
		background: rgba(0, 95, 238, 0.06);
	}

	.status-2,
	.status-4 {
		color: #333;
		background: rgba(51, 51, 51, 0.06);
	}

	.status-3 {
		color: #008042;
		background: rgba(0, 128, 66, 0.06);
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
	.serempty{
		position: absolute;
		top: 50%;
		left: 50%;
		transform:translate(-50%,-50%);
	}
</style>