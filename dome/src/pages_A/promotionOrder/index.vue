<template>
	<view class="promote-order-page" :data-theme="pageTheme">
		<view class="tab-con">
			<u-sticky bgColor="transparent" z-index="99999">
				<up-navbar title="推广订单" :bgColor="backgroundColor" @leftClick="toBack" placeholder
					:fixed="false"></up-navbar>
			</u-sticky>
			<!-- 搜索+筛选栏 -->
			<view class="search-filter-bar">
				<up-search placeholder="请输入景点名称" shape="round" :show-action="false" height="72rpx" margin="20rpx"
					bgColor="#fff" v-model="nameInput" @change='payOrderInfoFun'></up-search>
				<view class="date-btn" @click="jlShow=true">
					<text class="date-title">{{selected}}</text>
					<up-icon name="arrow-down" color="#666666" size="14"></up-icon>
				</view>
			</view>
		</view>
		
		<!-- 使用scroll-view实现下拉刷新和上拉加载 -->
		<scroll-view 
			class="content-scroll" 
			scroll-y 
			:refresher-enabled="true"
			:refresher-triggered="refreshing"
			@refresherrefresh="onRefresh"
			@scrolltolower="onScrollToLower"
			:style="{height: scrollHeight + 'px'}"
		>
			<!-- 下拉刷新提示 -->
			<view class="refresh-tips" v-if="refreshing">
				<u-loading-icon v-if="!refreshComplete"></u-loading-icon>
				<text>{{ refreshText }}</text>
			</view>
			
			<!-- 订单列表 -->
			<view class="order-list">
				<!-- 空状态 -->
				<ser-empty v-if="orderList.length == 0 && !loading"></ser-empty>
				<view class="order-item" v-for="(item, index) in orderList" :key="index">
					<view class="order-header">
						<text class="order-time">下单时间: {{ item.orderTime }}</text>
						<view class="status-tag" :class="`status-${item.status}`">
							{{ getStatusText(item.payStatus) }}
						</view>
					</view>
					<text class="scenic-name">{{ item.orderTitle }}</text>
					<view class="order-content">
						<image :src="item.orderImage" mode="aspectFill" width="60" height="60" class="scenic-image">
						</image>
						<view class="ticket-info">
							<text class="ticket-desc">门票:{{item.baseOrderInfoResponse.productName}} {{item.baseOrderInfoResponse.quantity}} 张</text>
							<text class="total-price">总价:{{ item.orderAmount }}</text>
						</view>
					</view>
					<view class="list-phone">
						<view class="phone">下单手机号:{{item.userPhone}}</view>
						<view class="commission">佣金¥{{ item.commission }}</view>
					</view>
				</view>
				<!-- 加载更多提示 -->
				<view class="load-more" v-if="orderList.length > 0">
					<u-loading-icon v-if="loadingMore"></u-loading-icon>
					<text class="load-text">{{ loadMoreText }}</text>
				</view>
			</view>
		</scroll-view>
		
		<up-picker :show="jlShow" v-model="record" :columns="filterList" @cancel='jlShow=false' @confirm="jlFun"
			keyName="label" valueName="id"></up-picker>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, nextTick } from 'vue';
	import { imgUrl } from '../../config';
	import { onLoad, onShow, onPageScroll, onHide } from '@dcloudio/uni-app';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { payOrderInfo } from '@/api/distribution';
	import { toNav, toBack } from '@/utils/route';
	import { useTheme } from "@/composables/useTheme";
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const backgroundColor = ref<string>('transparent');
	const scrollHeight = ref(0); // scroll-view高度
	
	// 分页参数
	const pageNum = ref(1);
	const pageSize = ref(10);
	const total = ref(0);
	const hasMore = ref(true);
	
	// 加载状态
	const loading = ref(false);
	const loadingMore = ref(false);
	const refreshing = ref(false);
	const refreshComplete = ref(false);
	
	// 下拉刷新文本
	const refreshText = computed(() => {
		if (refreshing.value && !refreshComplete.value) {
			return '正在刷新...';
		} else if (refreshComplete.value) {
			return '刷新完成';
		}
		return '下拉刷新';
	});
	
	// 加载更多文本
	const loadMoreText = computed(() => {
		if (loadingMore.value) {
			return '正在加载更多...';
		} else if (!hasMore.value) {
			return '没有更多数据了';
		}
		return '上拉加载更多';
	});
	
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44;
		
		// 计算scroll-view高度
		calcScrollHeight();
		
		// 监听窗口变化
		uni.onWindowResize(() => {
			calcScrollHeight();
		});
	});
	
	// 计算scroll-view高度
	const calcScrollHeight = () => {
		const query = uni.createSelectorQuery();
		query.select('.tab-con').boundingClientRect(data => {
			if (data) {
				const sysInfo = uni.getSystemInfoSync();
				scrollHeight.value = sysInfo.windowHeight - data.height;
			}
		}).exec();
	};
	
	const tabIndex = ref('0')
	const activeisow = ref<any>('0')
	const tabs = [
		{ label: '推广订单', value: '1' },
	];
	const nameInput= ref('')
	const activeTab = ref(1);
	const jlShow = ref<boolean>(false);
	const selected = ref('全部');
	const record = ref('');
	
	// 筛选下拉数据
	const filterList = reactive([
		[
			{
				label: '全部',
				id: ''
			},
			{
				label: '已支付',
				id:1
			}, {
				label: '已取消',
				id:2
			}, {
				label: '退款中',
				id:3
			}, {
				label: '已退款',
				id:4
			}, {
				label: '退款失败',
				id:5
			}, {
				label: '已完成',
				id:6
			}, {
				label: '出票中',
				id:10
			},{
				label: '待核销',
				id:11
			},{
				label: '出票失败',
				id:12
			}
		]
	]);
	
	const getStatusText=(status)=> {
	  switch (status) {
	    case 0:
	      return '待支付';
	    case 1:
	      return '已支付';
	    case 2:
	      return '已取消';
	    case 3:
	      return '退款中';
	    case 4:
	      return '已退款';
	    case 5:
	      return '退款失败';
	    case 6:
	      return '已完成';
	    case 10:
	      return '出票中';
	    case 11:
	      return '待核销';
	    case 12:
	      return '出票失败';
	    default:
	      return '未知状态';
	  }
	}
	
	// 订单列表数据
	const orderList = ref([]);
	const jlFun = (e) => {
		const selectedItem = e.value[0];
		selected.value = selectedItem.label || '';
		record.value = selectedItem.id || '';
		jlShow.value = false;
		// 重置分页，重新加载
		resetPage();
		payOrderInfoFun();
	}
	
	// Tab 切换
	// const tabChange = (index : number, val : string) => {
	// 	tabIndex.value = val.value;
	// 	activeisow.value = index;
	// };
	
	// 重置分页参数
	const resetPage = () => {
		pageNum.value = 1;
		hasMore.value = true;
		orderList.value = [];
	};
	
	// 下拉刷新
	const onRefresh = () => {
		if (refreshing.value) return;
		
		refreshing.value = true;
		refreshComplete.value = false;
		
		// 重置分页
		pageNum.value = 1;
		hasMore.value = true;
		
		// 模拟网络请求
		setTimeout(() => {
			payOrderInfoFun().finally(() => {
				// 刷新完成后延迟显示"刷新完成"
				setTimeout(() => {
					refreshComplete.value = true;
					setTimeout(() => {
						refreshing.value = false;
						refreshComplete.value = false;
					}, 800);
				}, 500);
			});
		}, 500);
	};
	
	// 上拉加载更多
	const onScrollToLower = () => {
		if (loadingMore.value || !hasMore.value) return;
		
		loadingMore.value = true;
		pageNum.value++;
		
		// 模拟网络请求
		setTimeout(() => {
			// 这里应该调用接口获取更多数据
			// 模拟获取更多数据
			const moreData = [];
			
			// 模拟数据加载
			orderList.value = [...orderList.value, ...moreData];
			
			// 模拟没有更多数据的情况
			// 实际应根据接口返回判断
			if (orderList.value.length >= 20) {
				hasMore.value = false;
			}
			
			loadingMore.value = false;
		}, 800);
	};
	
	const payOrderInfoFun = async () => {
		if (loading.value) return;
		
		loading.value = true;
		
		let params = {
			orderTitle: nameInput.value,
			distributor: 1,
			payStatus: record.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value
		}
		
		try {
			const res = await payOrderInfo(params);
			console.log('订单数据:', res);
			
			// 这里根据实际接口返回结构处理数据
			// 如果是第一页，直接赋值，否则追加
			if (pageNum.value === 1) {
				orderList.value = res.data?.list || [];
			} else {
				orderList.value = [...orderList.value, ...(res.data?.list || [])];
			}
			
			// 更新总数和是否还有更多数据
			total.value = res.data?.total || 0;
			hasMore.value = orderList.value.length < total.value;
			
		} catch (error) {
			console.error('获取订单数据失败:', error);
			uni.showToast({
				title: '加载失败，请重试',
				icon: 'none'
			});
		} finally {
			loading.value = false;
			loadingMore.value = false;
		}
	}
	
	onLoad(() => {
		payOrderInfoFun();
	});
</script>

<style lang="scss" scoped>
	.promote-order-page {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		.u-tabs__wrapper__nav {
			background: #fff;
		}

		.search-filter-bar {
			display: flex;
			align-items: center;
			padding: 0 20rpx;

			.filter-btn {
				padding: 16rpx 24rpx;
				border: 1rpx solid #ddd;
				border-radius: 8rpx;
			}
		}

		// 下拉刷新提示
		.refresh-tips {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 30rpx 0;
			color: #999;
			font-size: 24rpx;
			
			.u-loading-icon {
				margin-bottom: 10rpx;
			}
		}

		// 滚动区域
		.content-scroll {
			flex: 1;
			overflow: hidden;
			background-color: #F8F9FB;
		}

		.scenic-name {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}

		.commission {
			display: block;
			font-size: 28rpx;
			color: #ff672b;
		}

		.order-list {
			padding: 32rpx;
			min-height: 100%;
			
			.order-item {
				background-color: #fff;
				border-radius: 16rpx;
				margin-bottom: 20rpx;
				padding: 20rpx;
				box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

				.order-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 20rpx;
					border-bottom: 1px solid #EBEBEB;
					padding-bottom: 20rpx;


					.status-tag {
						padding: 4rpx 12rpx;
						border-radius: 8rpx;
						font-size: 24rpx;
					}

					.status-completed {
						background-color: #e1f5e3;
						color: #4caf50;
					}

					.status-pending {
						background-color: #fff8e1;
						color: $color;
					}

					.status-delivering {
						background-color: #e3f2fd;
						color: #2196f3;
					}

					.status-refunding {
						background-color: #ffebee;
						color: #f44336;
					}

					.status-refunded {
						background-color: #f5f5f5;
						color: #9e9e9e;
					}
				}

				.order-time {
					font-size: 24rpx;
					color: #999;
					display: block;
				}

				.order-content {
					display: flex;
					align-items: flex-start;
					margin-top: 20rpx;

					.scenic-image {
						width: 120rpx;
						height: 120rpx;
						border-radius: 8rpx;
						margin-right: 20rpx;
						background: #f5f5f5;
					}

					.ticket-info {
						flex: 1;

						.ticket-desc {
							display: block;
							font-size: 28rpx;
							margin-bottom: 12rpx;
						}

						.total-price {
							display: block;
							font-size: 28rpx;
							color: #666666;
							margin-bottom: 8rpx;
						}


					}
				}
			}
			
			// 空状态
			.empty-state {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 100rpx 0;
				
				.empty-img {
					width: 240rpx;
					height: 240rpx;
					margin-bottom: 40rpx;
					opacity: 0.6;
				}
				
				.empty-text {
					font-size: 28rpx;
					color: #999;
				}
			}
			
			// 加载更多
			.load-more {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 40rpx 0;
				
				.u-loading-icon {
					margin-bottom: 20rpx;
				}
				
				.load-text {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
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

	/* 激活态底部下划线（伪元素实现） */
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

	.tab-con {
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		background: var(--bgqscolor)
	}

	.date-btn {
		width: 170rpx;
		height: 72rpx;
		background: #FFFFFF;
		border-radius: 28rpx;
		font-weight: 500;
		font-size: 24rpx;
		color: #666666;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 30rpx;
	}

	.list-phone {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
	}
	
	.phone {
		font-size: 24rpx;
		color: #666666;
	}
</style>