<template>
	<view class="box" :data-theme="pageTheme">
		<u-sticky bgColor="transparent">
			<view class="searchVieww">
			<view class="topBgColor">
				<up-navbar title="我的收藏" bgColor="none" @leftClick="toBack" placeholder :fixed="false">
					<template #right>
						<!-- #ifndef MP-WEIXIN -->
						<text class="manage-btn" @click="isManageMode = !isManageMode">
							{{ isManageMode ? '退出管理' : '管理' }}
						</text>
						<!-- #endif -->
					</template>
				</up-navbar>

				<view class="searchView">
					<up-search placeholder="请输入商品关键字" v-model="keyword" searchIconColor="#000000" shape="round"
						bgColor="#F5F5F5" @search="searchChange" @input="handleInputChange"
						:showAction="false"></up-search>
					<!-- #ifdef MP-WEIXIN -->
					<view class="searchView-but" @click="isManageMode = !isManageMode">
						<text>{{ isManageMode ? '退出管理' : '管理' }}</text>
					</view>
					<!-- #endif -->
				</view>
			</view>
	    	</view>	
		</u-sticky>
		<view class="header">
			<view class="tab-con1">
				<view class="tab-bar-bql">
					<view v-for="(item,index) in tabs" :key="index"
						:class="['tab-item', { active: activeTab == item.value }]" @click="tabChange(item.value)">
						<view>
							{{item.label}}({{item.count}})
						</view>
					</view>
				</view>
			</view>

		</view>
		<!-- 商品列表 -->
		<view class="pageView">
			<!-- 商品项：新增单选框（管理模式下显示） -->
			<view v-for="(good, gIndex) in filteredGoods" :key="gIndex" class="good-item"
				@click="handleGoodItemClick(good.spuId)">
				<!-- 管理模式下显示单选框 -->
				<view v-if="isManageMode" class="good-select">
					<image class="select-icon" :src="isGoodSelected(good.spuId) ? selectedIcon : unselectedIcon"
						mode="aspectFit"></image>
				</view>
				<!-- 修改：为每个商品使用独立的 show 状态 -->
				<up-swipe-action>
					<up-swipe-action-item :show="good.showSwipe" :options="options1" @click="handleSingleDelete(good)">
						<view class="card" @touchstart="disableSwipeIfSelected(good)">
							<view style="display: flex;" @click="shopDetail(good)">
								<image class="card-image" lazy-load :src="good.picUrl" mode=""></image>
								<view class="card-center">
									<view>
										<view style="margin:20rpx 0 10rpx;">
											<up-text :text="good.spuName" size="14" color="#000000" bold></up-text>
										</view>
										<view class="shop">
											<image class="card-shop" lazy-load :src="imgUrl + good.shopIcon" mode="">
											</image>
											<text>{{ good.shopName }}</text>
										</view>
									</view>
								</view>
							</view>
							<view class="card-center-price">
								<view class="newPrice">
									{{ good.price }} <text>积分</text>
									<view class="sc-text">{{ good.count }}人收藏</view>
								</view>
							</view>
						</view>
					</up-swipe-action-item>
				</up-swipe-action>
			</view>
			<ser-empty v-if="!filteredGoods.length && !isLoading"></ser-empty>
			<view v-if="isLoading" class="loading-text">加载中...</view>
			<view v-if="!hasMore && filteredGoods.length > 0" class="no-more-text">没有更多了</view>
			<view style="height: 150rpx;"></view>
			<!-- 底部操作栏（管理模式下显示） -->
			<view v-if="isManageMode && filteredGoods.length > 0" class="bottom-bar">
				<view class="all-select" @click="toggleSelectAll">
					<image class="select-icon" :src="isAllSelected ? selectedIcon : unselectedIcon" mode="aspectFit">
					</image>
					<text class="select-text">全选</text>
				</view>
				<view class="cancel-collect-btn" @click="batchCancelCollect">取消收藏</view>
			</view>
		</view>
        <PageDurationTracker pageName="我的收藏" />
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, reactive, computed } from 'vue';
	import { imgUrl } from '@/config';
	import { toBack, toNav } from "@/utils/route";
	import { favoriteList } from '@/api/collection';
	import { deletecreate, deleteFavoriteAll } from '@/api/points';
	import { onLoad, onReachBottom } from '@dcloudio/uni-app';
	import { debounce } from '@/utils/common'
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	// 1. Tab 数据
	const tabs = ref([
		// { label: '全部', value: '', count: 0 },
		// { label: '直营零售', value: '2', count: 0 },
		{ label: '积分商城', value: '1', count: 0 }
	]);

	// 2. 商品数据
	const goodsList = ref<any[]>([]);

	// 3. 响应式状态
	const keyword = ref<string>('');
	const isManageMode = ref<boolean>(false); // 默认关闭管理模式
	const selectedGoods = ref<string[]>([]);
	const options1 = reactive([{ text: '取消收藏' }]);
	const activeTab = ref<string>('1'); // 当前激活的tab
	const selectedIcon = imgUrl + 'selected-icon.png';
	const unselectedIcon = imgUrl + 'unselected-icon.png';

	const pageNum = ref(1);
	const pageSize = ref(10);
	const hasMore = ref(true);
	const isLoading = ref(false);

	// 4. 计算属性：根据当前激活的tab筛选商品
	const filteredGoods = computed(() => {
		if (activeTab.value === '') {
			return goodsList.value;
		}
		// 筛选对应类型的商品
		return goodsList.value.filter(item => String(item.merchantType) === activeTab.value);
	});

	// 是否全选
	const isAllSelected = computed(() => {
		if (!filteredGoods.value.length) return false;
		return selectedGoods.value.length === filteredGoods.value.length;
	});

	// 判断单个商品是否被选中
	const isGoodSelected = (goodId: any) => {
		return selectedGoods.value.includes(goodId);
	};

	// 处理商品项点击（选择/取消选择）
	const handleGoodItemClick = (goodId: any) => {
		if (isManageMode.value) {
			// 管理模式下处理选择/取消选择
			const index = selectedGoods.value.findIndex(id => id === goodId);
			if (index === -1) {
				selectedGoods.value.push(goodId);
			} else {
				selectedGoods.value.splice(index, 1);
			}
		}
	};

	// 如果商品已被选中，禁用滑动
	const disableSwipeIfSelected = (good: any) => {
		if (isManageMode.value && selectedGoods.value.includes(good.spuId)) {
			return false;
		}
	};

	// 切换全选状态
	const toggleSelectAll = () => {
		if (!filteredGoods.value.length) return;

		if (isAllSelected.value) {
			selectedGoods.value = [];
		} else {
			selectedGoods.value = filteredGoods.value.map(item => item.spuId);
		}
	};

	// 切换管理模式时清除选中状态
	const toggleManageMode = () => {
		isManageMode.value = !isManageMode.value;
		if (!isManageMode.value) {
			selectedGoods.value = []; // 退出管理模式时清除选中状态
		}
	};

	// 辅助函数：更新指定tab的count
	const updateSpecificTabCount = (type: string, count: number) => {
		const tab = tabs.value.find(t => t.value === type);
		if (tab) {
			tab.count = Math.max(0, count);
		}
	};

	// 辅助函数：更新当前tab的count
	const updateCurrentTabCount = (change: number) => {
		const currentTab = tabs.value.find(t => t.value === activeTab.value);
		if (currentTab) {
			currentTab.count = Math.max(0, currentTab.count + change);
		}
	};

	// 单个商品取消收藏
	const handleSingleDelete = async (good: any) => {
		try {
			uni.showLoading({ title: '处理中...' });

			const params = {
				spuId: good.spuId,
				merchantType: good.merchantType || ''
			};

			const res = await deletecreate(params);
			if (res.code === 200) {
				uni.showToast({ title: '取消收藏成功', icon: 'success' });

				// 移除当前商品
				goodsList.value = goodsList.value.filter(item => item.spuId !== good.spuId);

				// 从选中列表中移除
				const index = selectedGoods.value.findIndex(id => id === good.spuId);
				if (index !== -1) {
					selectedGoods.value.splice(index, 1);
				}

				// 更新当前tab的count
				updateCurrentTabCount(-1);

				// 如果商品类型与当前tab不同，也需要更新对应类型的tab count
				if (String(good.merchantType) !== activeTab.value) {
					await refreshTabCount(String(good.merchantType));
				}

				// 更新"全部"tab的count
				await refreshTabCount('');
			} else {
				uni.showToast({ title: res.msg || '操作失败', icon: 'none' });
			}
		} catch (error) {
			console.error('单个取消收藏失败：', error);
			uni.showToast({ title: '操作失败', icon: 'none' });
		} finally {
			uni.hideLoading();
			// 关闭当前商品的侧滑菜单
			good.showSwipe = false;
		}
	};

	// 批量取消收藏
	const batchCancelCollect = async () => {
		if (selectedGoods.value.length === 0) {
			uni.showToast({ title: '请先选择要取消收藏的商品', icon: 'none' });
			return;
		}

		const selectedItems = goodsList.value.filter(item => selectedGoods.value.includes(item.spuId));

		uni.showModal({
			title: '提示',
			content: `确定要取消选中的${selectedItems.length}件商品收藏吗？`,
			async success(res) {
				if (res.confirm) {
					try {
						uni.showLoading({ title: '批量处理中...' });

						const payload = selectedItems.map(item => ({
							spuId: item.spuId,
							merchantType: item.merchantType || ''
						}));

						const res = await deleteFavoriteAll(payload);
						if (res.code === 200) {
							uni.showToast({ title: '取消收藏成功', icon: 'success' });

							// 更新商品列表
							goodsList.value = goodsList.value.filter(item => !selectedGoods.value.includes(item.spuId));

							// 清空选中状态
							selectedGoods.value = [];

							// 刷新所有tab的count
							await refreshAllTabCounts();
							
							// 重新加载当前tab的商品列表
							await loadCurrentTabGoods();
						} else {
							uni.showToast({ title: res.msg || '操作失败', icon: 'none' });
						}
					} catch (error) {
						console.error('批量取消收藏失败：', error);
						uni.showToast({ title: '操作失败', icon: 'none' });
					} finally {
						uni.hideLoading();
					}
				}
			}
		});
	};

	// 加载当前tab的商品列表
	const loadCurrentTabGoods = async (isLoadMore = false) => {
		if (!isLoadMore) {
			goodsList.value = [];
			selectedGoods.value = [];
			pageNum.value = 1;
			hasMore.value = true;
		}
		
		await favoriteListFun(activeTab.value, keyword.value, isLoadMore);
	};

	// tab 切换
	const tabChange = (type: string) => {
		if (activeTab.value === type) return;

		activeTab.value = type;
		isManageMode.value = false; // 切换tab时退出管理模式
		selectedGoods.value = []; // 清空选中状态
		loadCurrentTabGoods();
	};

	// 刷新指定tab的count
	const refreshTabCount = async (type: string) => {
		try {
			let params = {
				pageSize: 1,
				pageNum: 1,
				merchantType: type,
				spuName: keyword.value
			};

			const res = await favoriteList(params);
			if (res.code === 200) {
				updateSpecificTabCount(type, res.data.total || 0);
			}
		} catch (error) {
			console.error('刷新tab count失败:', error);
		}
	};
  const shopDetail= (data:any) => {
	  if(data.merchantType==1){
		  uni.navigateTo({
		  	url: '/pages_A/points/details?id='+data.pointProduct.activityId
		  })
	  }else{
		 uni.navigateTo({
		 	url: '/pages_B/directRetail/shopDetail?spuId='+data.spuId
		 }) 
	  }
	
  }
  
	// 刷新所有tab的count
	const refreshAllTabCounts = async () => {
		try {
			await Promise.all([
				refreshTabCount(''),
				refreshTabCount('1'),
				refreshTabCount('2')
			]);
		} catch (error) {
			console.error('刷新所有tab count失败:', error);
		}
	};

	// 搜索处理
	const searchHandler = async () => {
		pageNum.value = 1;
		hasMore.value = true;
		goodsList.value = [];
		selectedGoods.value = [];
		
		// 刷新所有tab的count
		await refreshAllTabCounts();
		
		// 加载当前tab的商品列表
		await loadCurrentTabGoods();
	};

	const debouncedSearch = debounce(searchHandler, 500);
	
	const searchChange = () => {
		searchHandler();
	};
	
	const handleInputChange = () => {
		debouncedSearch();
	};

	// 获取收藏列表
	const favoriteListFun = async (type: string, searchKeyword = keyword.value, isLoadMore = false) => {
		if (isLoadMore) {
			if (isLoading.value || !hasMore.value) return;
		} else {
			goodsList.value = [];
			selectedGoods.value = [];
		}
		
		isLoading.value = true;

		try {
			let params = {
				pageSize: pageSize.value,
				pageNum: isLoadMore ? pageNum.value : 1,
				merchantType: type,
				spuName: searchKeyword
			};

			const res = await favoriteList(params);
			if (res.code === 200) {
				const currentList = res.data.list || [];
				const total = res.data.total || 0;

				// 为每个商品添加独立的侧滑状态
				const processedList = currentList.map(item => ({
					...item,
					showSwipe: false // 每个商品独立的侧滑状态
				}));

				// 更新商品列表
				if (isLoadMore) {
					goodsList.value = [...goodsList.value, ...processedList];
				} else {
					goodsList.value = processedList;
				}

				// 更新当前tab的count
				updateSpecificTabCount(type, total);

				// 判断是否还有更多数据
				const totalPage = Math.ceil(total / pageSize.value);
				hasMore.value = (isLoadMore ? pageNum.value : 1) < totalPage;

				// 加载更多成功后，页码+1
				if (isLoadMore && hasMore.value) {
					pageNum.value += 1;
				}
			}
		} catch (error) {
			console.error('获取收藏列表失败:', error);
			uni.showToast({ title: '加载失败', icon: 'none' });
		} finally {
			isLoading.value = false;
		}
	};

	// 触底加载更多
	onReachBottom(async () => {
		if (isManageMode.value) return;
		await favoriteListFun(activeTab.value, keyword.value, true);
	});

	onLoad(async () => {
		// 设置默认激活的tab为"全部"
		activeTab.value = '';
		
		// 初始化加载所有tab的count
		await refreshAllTabCounts();
		
		// 加载当前tab的商品列表（默认全部）
		await loadCurrentTabGoods();
	});
</script>

<style lang="scss">
	page {
		background: $pageBgColor;
	}
	.searchVieww {
		background: var(--head-color);
	}

	/* 管理按钮样式 */
	.manage-btn {
		font-size: 28rpx;
		color: #333;
		margin-right: 20rpx;
	}

	.pageView {
		padding: 10rpx 50rpx;
		box-sizing: border-box;
		min-height: calc(100vh - 300rpx);
		height: 80vh;
		overflow: scroll;
	}

	/* 商品项（包含单选框） */
	.good-item {
		position: relative;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		cursor: pointer;

		.good-select {
			margin-right: 18rpx;
		}
	}

	.box {
		height: 100vh;
		overflow: hidden;
	}

	.topBgColor {
		// background: linear-gradient(180deg, #D1E5F9 0%, rgba(255, 255, 255, 0) 100%);
	}

	.searchView {
		width: 100%;
		padding: 25rpx 32rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.searchView-but {
			background: var(--but-color-line);
			color: #FFFFFF;
			font-size: 24rpx;
			padding: 10rpx 15rpx;
			border-radius: 10rpx;
			margin-left: 20rpx;
		}
	}

	/* Tab 区域样式 */
	.tab-con1 {
		padding: 0 32rpx;
	}

	.tab-bar-bql {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		color: #666;
		position: relative;
	}

	.tab-item {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5px 25rpx;
		border-radius: 4px;
		position: relative;
		font-size: 30rpx;
	}

	.active {
		color: #333333;
		font-weight: bold;
	}

	.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 12rpx;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/zcby.png');
		background-size: 100% 100%;
	}

	/* 商品卡片样式 */
	.card {
	
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #FFFFFF;
		border-radius: 25rpx;
		padding: 20rpx 20rpx;

		.card-image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 16rpx;
		}

		.newPrice {
			color: var(--primary-color);
			font-weight: bold;
			font-size: 26rpx;
			text-align: center;
		}

		.card-center {
			padding-left: 27rpx;
			box-sizing: border-box;
			flex: 1;
		}
	}

	.sc-text {
		width: 130rpx;
		font-size: 24rpx;
		color: #666666;
		margin-top: 30rpx;
	}

	.card-shop {
		width: 40rpx;
		height: 40rpx;
		margin-right: 8rpx;
	}

	.shop {
		width: 220rpx;
		display: flex;
		align-items: center;
		border-radius: 12rpx;
		padding: 8rpx;
		font-size: 24rpx;
		color: #666;
	}

	/* 底部操作栏样式（管理模式） */
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 140rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		box-sizing: border-box;
		border-top: 1px solid #eee;

		.all-select {
			display: flex;
			align-items: center;
			flex: 1;
			cursor: pointer;

			.select-icon {
				width: 32rpx;
				height: 32rpx;
				margin-right: 16rpx;
			}

			.select-text {
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
			}
		}

		.cancel-collect-btn {
			padding: 20rpx 50rpx;
			text-align: center;
			background: var(--but-color-line);
			color: #fff;
			border-radius: 50rpx;
			font-size: 24rpx;
		}
	}

	::v-deep .u-navbar__content {
		background: none !important;
	}

	::v-deep .u-radio__icon-wrap {
		width: 32rpx !important;
		height: 14px !important;
	}

	::v-deep .u-swipe-action-item__right__button__wrapper {
		background-color: #FF5A4A !important;
	}

	.header {
		position: sticky;
		top: 20rpx;
		z-index: 10;
		background-color: #F8F9FB;
	}

	.tab-con1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 15rpx 0;
	}

	.tab-bar-bql {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10;
		color: #666;
		position: relative;
	}

	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5px 25rpx;
		border-radius: 4px;
		position: relative;
		font-size: 30rpx;
	}

	.active {
		color: #333333;
		font-weight: bold;
	}

	/* 激活态底部下划线 */
	.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 40%;
		transform: translateX(-40%);
		width: 40rpx;
		height: 12rpx;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/zcby.png');
		background-size: 100% 100%;
	}

	.select-icon {
		width: 32rpx;
		height: 32rpx;
	}

	::v-deep .u-swipe-action {
		width: 656rpx;
	}
	
	.loading-text, .no-more-text {
		text-align: center;
		padding: 20rpx;
		color: #999;
		font-size: 28rpx;
	}

</style>