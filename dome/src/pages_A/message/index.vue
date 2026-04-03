<template>
	<view class="box">
		<u-sticky bgColor="transparent">
			<view :style="{background:topBgColor}">
				<up-navbar title="我的消息" bgColor="none" @leftClick="toBack" placeholder :fixed="false"
					:titleStyle="{fontWeight: 'bold'}"></up-navbar>
				<up-gap height="10"></up-gap>
			</view>
		</u-sticky>
		<view class="message-page">
			<!-- 顶部消息分类快捷入口 -->
			<view class="message-entrance">
				<view class="entrance-item entrance-item1" @click="typeFun('USER_OPERATE')">
					<view class="text">用户操作</view>
					<view class="entrance-text">
						<navigator url="" class="entrance-link" style="color: #4381ED;">用户操作</navigator>
						<text class="entrance-desc">用户相关的场景分类</text>
					</view>
				</view>
				<view class="entrance-item entrance-item2" @click="typeFun('SYSTEM_SERVICE_OPERATE')">
					<view class="text">系统服务</view>
					<view class="entrance-text">
						<navigator url="" class="entrance-link" style="color: #FF9000;">系统服务</navigator>
						<text class="entrance-desc" style="color: #FABF71;">系统服务相关的场景分类</text>
					</view>
				</view>
			</view>

			<!-- 最近消息头部 -->
			<view class="recent-header">
				<text class="recent-title">最近消息</text>
				<view class="read-all" @click="handleReadAll">
					<image class="read-icon" :src="imgUrl +'static/mess-icon.png' " mode="widthFix"></image>
					<text class="read-text">一键已读</text>
				</view>
			</view>

			<!-- 消息列表 -->
			<scroll-view class="message-list" scroll-y :refresher-enabled="true" :refresher-triggered="refreshing"
				@refresherrefresh="onRefresh" @scrolltolower="onLoadMore" refresher-background="#f0f8f0"
				refresher-threshold="45" :show-scrollbar="false">
				<!-- 下拉刷新动画 -->
				<view v-if="refreshing" class="refresh-container">
					<image class="refresh-icon" :src="imgUrl + 'static/refresh-loading.gif'" mode="widthFix"></image>
					<text class="refresh-text">加载中...</text>
				</view>
				<!-- 最近消息分组 -->
				<view class="message-group">
					<view class="message-item" v-for="(item, index) in list" :key="index"
						@click="handleMessageClick(item)">
						<view class='box-top'>
							<view class="message-left">
								<text class="message-type">{{ item.name }}</text>
								<view v-if="item.unread==1">
									<text class="message-dot" v-if="!item.read"></text>
								</view>
							</view>
							<view class="message-right">
								<text class="message-time">{{ item.createTime }}</text>
							</view>
						</view>
						<view class="message-content">
							<text class="content-title">{{item.channelName }}</text>
							<text class="content-desc">{{ item.message }}</text>
						</view>
					</view>
				</view>
				<view v-if="!hasMore && list.length > 0" class="no-more">
					<text class="no-more-text">没有更多消息了</text>
				</view>
				<!-- 空状态 -->
				<view v-if="!list || list.length === 0" class="empty-state">
					<ser-empty></ser-empty>
				</view>
				<view style="height: 100rpx;"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, watch } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { msgSendRecord, msgSendRecordRead, msgSendRecordReadAll,ScenarioCategoryList } from '@/api/message';
	const topBgColor = ref<string>('rgba(219, 248, 225, 1)');
	import {
		imgUrl
	} from '../../config';
	import { useMqttStore } from '@/store/modules/mqtt';

	// 定义消息类型接口
	interface MessageItem {
		id : string;
		name: string;
		type : string; // 消息类型（订单动态/服务提醒）
		read : boolean; // 是否已读
		unread: number;
		createTime : string; // 消息时间
		channelName : string; // 消息标题
		message : string; // 消息内容
	}

	const messageStore = useMqttStore()
    const typeList=ref([])
	// 分页相关变量
	const pageNum = ref<number>(1);
	const pageSize = ref<number>(10);
	const total = ref<number>(0);
	const hasMore = ref<boolean>(true);
	const loading = ref<boolean>(false);
	const refreshing = ref<boolean>(false);
	const isLoading = ref<boolean>(false);
    const typewl=ref('')
	const list = ref<MessageItem[]>(messageStore.swiperInfo || []);

	// 监听 messageStore.swiperInfo 的变化
	watch(
		() => messageStore.swiperInfo,
		(newVal) => {
			console.log('swiperInfo 发生变化：', newVal);
			list.value = newVal || [];
			pageNum.value = 1;
			list.value = []
			msgSendRecordFun(true)
		},
		{
			deep: true,
			immediate: true
		}
	);
    
    const typeFun=(val:string)=>{
		typewl.value=val
		pageNum.value = 1;
		list.value=[]
		msgSendRecordFun(true)
	}
	
	// 获取消息列表
	const msgSendRecordFun = async (isRefresh : boolean = false) => {
		if (loading.value || (!isRefresh && !hasMore.value)) return;

		loading.value = true;
		isLoading.value = true;

		if (isRefresh) {
			pageNum.value = 1;
			hasMore.value = true;
		}

		const params = {
			pageNum: pageNum.value,
			pageSize: pageSize.value,
			type: typewl.value,
		}

		try {
			const res : any = await msgSendRecord(params)
			if (res?.code == '200') {
				// 确保 data.list 存在
				const dataList = res.data?.list || [];
				
				if (isRefresh) {
					list.value = dataList;
				} else {
					list.value = [...list.value, ...dataList];
				}

				total.value = res.data?.total || 0;
				hasMore.value = list.value.length < total.value;

				// if (isRefresh) {
				// 	uni.showToast({
				// 		title: '加载成功',
				// 		icon: 'success',
				// 		duration: 1000
				// 	});
				// }
			}
		} catch (error) {
			console.error('加载消息失败:', error);
		} finally {
			loading.value = false;
			refreshing.value = false;
			isLoading.value = false;
		}
	};

	// 下拉刷新
	const onRefresh = () => {
		if (refreshing.value) return;
		refreshing.value = true;
		msgSendRecordFun(true);
	};

	// 上拉加载更多
	const onLoadMore = () => {
		if (loading.value || !hasMore.value) return;
		pageNum.value++;
		msgSendRecordFun(false);
	};

	// 一键已读处理
	const handleReadAll = async () => {
		try {
			const res : any = await msgSendRecordReadAll();
			if (res?.code == '200') {
				uni.showToast({
					title: '已标记全部已读',
					icon: 'success'
				});
				pageNum.value = 1;
				list.value = []
				msgSendRecordFun(true)
			}
		} catch (error) {
			console.error('一键已读失败:', error);
			uni.showToast({
				title: '操作失败',
				icon: 'error'
			});
		}
	};

	// 点击单条消息处理
	const handleMessageClick = async (item : MessageItem) => {
		if (!item.read) {
			let data = {
				id: item.id
			}
			try {
				const res : any = await msgSendRecordRead(data);
				if (res?.code == '200') {
					// 更新本地状态
					const index = list.value.findIndex(msg => msg.id === item.id);
					if (index !== -1) {
						list.value[index].read = true;
					}
				}
			} catch (error) {
				console.error('标记已读失败:', error);
			}
		}
	};
    
	const ScenarioCategoryListFun = async() => {
		try {
			const res : any = await ScenarioCategoryList();
			typeList.value = res.rows || []
		} catch (error) {
			console.error('获取分类列表失败:', error);
		}
	}
	  
	onLoad(() => {
		ScenarioCategoryListFun()
		msgSendRecordFun(true);
	});
</script>

<style scoped lang="scss">
	.message-page {
		background-color: #f0f8f0;
		min-height: 100vh;
		padding: 0 20rpx 20rpx;
	}

	.entrance-item1 {
		width: 100%;
		height: 200rpx;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/mess1.png');
		background-repeat: no-repeat;
		background-size: 100%;
		position: relative;
	}

	.entrance-item2 {
		width: 100%;
		height: 200rpx;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/mess2.png');
		background-repeat: no-repeat;
		background-size: 100%;
		position: relative;
	}

	.text {
		position: absolute;
		top: 32rpx;
		color: #fff;
		font-size: 20rpx;
	}

	// 消息分类快捷入口
	.message-entrance {
		display: flex;
		padding: 20rpx 16rpx 0;
		gap: 20rpx;

		.entrance-item {
			flex: 1;
			display: flex;
			align-items: center;
			padding: 0 10rpx;

			.entrance-text {
				flex: 1;

				.entrance-link {
					display: block;
					font-size: 28rpx;
					color: #333;
					font-weight: 500;
					margin: 10rpx 10rpx 0;
				}

				.entrance-desc {
					font-size: 24rpx;
					color: #666;
					line-height: 1.2;
					margin-left: 10rpx;
				}
			}
		}
	}

	// 最近消息头部
	.recent-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16rpx 20rpx;
		margin: -20rpx 0 10rpx;

		.recent-title {
			font-size: 28rpx;
			color: #333;
			font-weight: 500;
		}

		.read-all {
			display: flex;
			align-items: center;

			.read-icon {
				width: 30rpx;
				height: 30rpx;
				margin-right: 6rpx;
			}

			.read-text {
				font-size: 24rpx;
				color: #666666;
			}
		}
	}

	// 消息列表
	.message-list {
		height: calc(100vh - 360rpx); // 根据实际情况调整高度

		.refresh-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 20rpx 0;

			.refresh-icon {
				width: 60rpx;
				height: 60rpx;
				margin-bottom: 10rpx;
			}

			.refresh-text {
				font-size: 24rpx;
				color: #999;
			}
		}

		.message-group {
			border-radius: 12rpx;
			overflow: hidden;
			margin-bottom: 10rpx;

			.message-item {
				margin-bottom: 20rpx;
				padding: 20rpx;
				position: relative;
				background: #fff;
				&:last-child {
					border-bottom: none;
				}

				.message-left {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;

					.message-dot {
						display: inline-block;
						width: 12rpx;
						height: 12rpx;
						border-radius: 50%;
						background-color: #ff3b30;
						margin: 5rpx 10rpx;
					}
				}

				.message-right {
					position: absolute;
					top: 20rpx;
					right: 20rpx;

					.message-time {
						font-size: 22rpx;
						color: #999;
					}
				}

				.message-content {
					margin: 10rpx 0;
					.content-title {
						display: block;
						font-size: 26rpx;
						color: #333;
						margin-bottom: 8rpx;
						font-weight: 500;
					}

					.content-desc {
						font-size: 24rpx;
						color: #666;
						line-height: 1.4;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}
		}

		.load-more,
		.no-more {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 30rpx 0;

			.loading-icon {
				width: 40rpx;
				height: 40rpx;
				margin-bottom: 10rpx;
			}

			.loading-text,
			.no-more-text {
				font-size: 24rpx;
				color: #999;
			}
		}

		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 100rpx 0;

			.empty-icon {
				width: 200rpx;
				height: 200rpx;
				margin-bottom: 30rpx;
				opacity: 0.6;
			}

			.empty-text {
				font-size: 28rpx;
				color: #999;
			}
		}
	}

	.box {
		height: 100vh;
		overflow: hidden;
	}
	.box-top{
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #EAEAEA;
		padding: 5rpx 0;
	}
	.message-type{
		color: #000;
	}
</style>