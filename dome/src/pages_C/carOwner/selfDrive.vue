<template>
	<view class="container pageView" :data-theme="pageTheme">
		<up-sticky>
			<up-navbar title="趣旅行" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			<view class="searchView">
				<view class='searchView-s'>
					<up-search placeholder="请输入目的地" v-model="keyword" searchIconColor="#000000" shape="round"
						bgColor="#F5F5F5" @change="searchChange" actionText :showAction="false"></up-search>
				</view>
				<!-- 可滑动标签栏核心：使用 scroll-view 实现横向滚动 -->
				<scroll-view 
					class="tab-con1" 
					scroll-x 
					show-scrollbar="false" 
					:scroll-left="scrollLeft" 
				>
					<view class="tab-bar-bql">
						<view 
							v-for="(item, index) in tabs" 
							:key="index"
							:class="['tab-item', { active: activeisow == index }]" 
						    :style="{ '--tab-active-bg': `url(${icoUrl}tabimg.png)` }"
							@click="tabChange(index, item.value)"
						>
							{{ item.label }}
						</view>
					</view>
				</scroll-view>
			</view>
			 <view class="qyx-data">
				 <view class="qyx-text"  :class="{ actives: tiveisow == index }"  v-for="(item,index) in tabData" :key="index" @click="tabchangeTime(index, item.value)">
					 {{item.label}}
				 </view>
			 </view>
		</up-sticky>

		<!-- 核心修改：添加 scroll-view 包裹列表区域 -->
		<scroll-view 
			class="scroll-box"
			scroll-y 
			refresher-enabled="true" 
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
			@scrolltolower="onLoadMore"
			lower-threshold="100"
		>
		   <view class='c_sw-box'>
			   <view class="c_sw" v-for="(item,index) in playSxList" :key="index">
			   	<view class="card_box" @click="toNav('/pages_C/carOwner/carDetails?id='+item.id)">
			   		<image class="card_img" :src="item.imagesContraction" mode=""></image>
			   		<view class="card_name">{{item.name}}</view>
			   		<view class="card_tag" v-if="item.spotTag">
			   			<!-- 核心修改：标签容器增加 tag-wrap 类 -->
			   			<view class="tag-wrap">
			   				<text v-for="(tag, index) in (item.spotTag || '').split(',').filter(tag => tag.trim())" :key="index">{{ tag }}</text>
			   			</view>
			   			<text>{{item.distance}}km</text>
			   		</view>
			   		<view class="card_line"></view>
			   		<view class="card_add">
			   			<uni-icons type="location-filled" color="#979797" size="14"></uni-icons>
			   			<text>{{item.fullAddress}}</text>
			   			<!-- <view class="card_btn" @click="toNav('/pages_C/carOwner/carDetails?id='+item.id)">立即报名</view>
						 -->
						 <view class="card_btn btnOver" v-if="item.busStatus == '11'||item.busStatus == '13'" >{{item.busStatus == '11'?'报名未开始':'报名已结束'}}</view>
						 <view class="card_btn" v-else >立即报名</view>
			   		</view>
			   	</view>
			   </view>
		   </view>
		   <!-- 核心修改：只有在有数据且加载完时才显示“没有更多” -->
		   <view v-if="playSxList.length > 0 && isFinished" class="no-more">
		   	<text>没有更多数据了</text>
		   </view>
		   <view style='height: 200rpx;'></view>
			<view style="margin-top: 100rpx;">
				<ser-empty v-if="!playSxList.length"></ser-empty>
			</view>
		</scroll-view>
		<PageDurationTracker pageName="趣旅行" type='count'/>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, computed, onMounted, getCurrentInstance, nextTick } from 'vue';
	import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app';
	import { random, guid, timeFormat } from '@/uni_modules/uview-plus';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { useTheme } from '@/composables/useTheme';
	import { roadTripPageList } from '@/api/carOwner';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const pageNum = ref(1); // 当前页码
	const pageSize = ref(10); // 每页条数
	const playSxList= ref([]);
	
	// 核心新增：下拉刷新状态
	const isRefreshing = ref(false);
	// 核心新增：数据是否加载完成
	const isFinished = ref(false);
	
	// 核心变量
	const keyword = ref('');
	const tabIndex = ref('');
	const tabTwoIndex = ref('');
	const activeisow = ref(0);
	const tiveisow = ref(0)
	const scrollLeft = ref(0);      // 用于控制 scroll-view 的滚动位置
	const tabWidth = ref(0);

	// 标签列表
	const tabs = [
		{ label: '全部', value: '' },
		{ label: '趣研学', value: '10' },
		{ label: '省内自驾游', value: '11' },
		{ label: '省外自驾游', value: '12' },
		{ label: '国内跟团游', value: '13' },
		{ label: '国外跟团游', value: '14' },
	];
	const tabData = [
		{ label: '不限', value: '' },
		{ label: '1天', value: '11' },
		{ label: '2天', value: '12' },
		{ label: '3天', value: '13' },
		{ label: '5天及以上', value: '15' },
	];

	// 获取当前组件实例（用于 selectorQuery）
	const instance = getCurrentInstance();

	// Tab 切换 + 自动滑动（修复版）
	const tabChange = async (index: number, val: string) => {
		tabIndex.value = val;
		activeisow.value = index;
		pageNum.value=1
		playSxList.value=[]
		roadTripPageListFunw()
		
	};
	// 时间
	const tabchangeTime = async (index: number, val: string) => {
		tabTwoIndex.value = val;
		tiveisow.value = index;
		pageNum.value=1
		playSxList.value=[]
		roadTripPageListFunw()
	};
	// 搜索事件
	const searchChange = (val: string) => {
		keyword.value = val;
		pageNum.value=1
		playSxList.value=[]
		roadTripPageListFunw()
	};
	
	// 核心修改：获取列表函数，支持追加数据
	const roadTripPageListFunw = async (isLoadMore = false) => {
		let lat = uni.getStorageSync('address').lat;
		let lng = uni.getStorageSync('address').lng;
		let params = {
			params:keyword.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
			longitude:lng,
			latitude:lat,
            typeOne: tabIndex.value,
            typeTwo: tabTwoIndex.value
		};
		try {
			const res = await roadTripPageList(params)
			console.log("数据==",res);
			console.log("isLoadMore==",isLoadMore);
			if (res.code == 200) {
				if (isLoadMore) {
					// 上拉加载：追加数据
					playSxList.value = [...playSxList.value, ...res.data.list];
				} else {
					// 下拉刷新/首次加载：替换数据
					playSxList.value = res.data.list;
				}
				
				// 核心新增：判断是否加载完所有数据
				// 如果接口返回了 total，用 total 判断；否则用当前页数据长度判断
				if (res.data.total !== undefined) {
					isFinished.value = playSxList.value.length >= res.data.total;
				} else {
					// 如果当前页返回的数据少于 pageSize，说明没有下一页了
					isFinished.value = res.data.list.length < pageSize.value;
				}
			}
		} catch (error) {
	
		} finally {
			// 核心修改：停止刷新状态
			isRefreshing.value = false;
		}
	};

	// 核心新增：下拉刷新事件
	const onRefresh = () => {
		pageNum.value = 1;
		isFinished.value = false; // 重置加载完成状态
		isRefreshing.value = true;
		roadTripPageListFunw(false);
	};

	// 核心新增：上拉加载更多事件
	const onLoadMore = () => {
		if (isFinished.value) return; // 如果已加载完，不再请求
		pageNum.value += 1;
		roadTripPageListFunw(true);
	};

	// 生命周期
	onLoad((options) => {
		if(options.id){
			activeisow.value=options.id
			tabIndex.value='10'
		}else{
			activeisow.value=0
		}
		console.log(activeisow.value,9999999999999)
		roadTripPageListFunw()
	});
	onShow(() => {});
	onReachBottom(() => {}); // 页面级触底已废弃，改用 scroll-view 的 @scrolltolower
	onMounted(() => {});
</script>

<style lang="scss" scoped>
	.container {
		background: var(--head-color);
	}

	.pageView {
		height: 100vh;
		overflow: hidden;
		-webkit-overflow-scrolling: touch;
	}

	.searchView-s {
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	// scroll-view 样式
	.tab-con1 {
		width: 100%;
		padding: 10rpx 30rpx;
		margin: 14rpx 0;
		box-sizing: border-box;
		white-space: nowrap;          // 确保内部不换行
		// 隐藏滚动条（各平台兼容）
		&::-webkit-scrollbar {
			display: none;
		}
		scrollbar-width: none;
	}

	.tab-bar-bql {
		display: inline-flex;          // 让内部标签横向排列
		align-items: center;
		padding-bottom: 15rpx;
		color: #666;
		position: relative;
	}

	.tab-item {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8rpx 0;
		margin-right: 40rpx;           // 标签间距
		text-align: center;
		font-size: 30rpx;
		line-height: 1.4;
		cursor: pointer;
		transition: all 0.3s ease;
		white-space: nowrap;
		position: relative;
	}

	.tab-item.active {
		color: #333333;
		font-weight: bold;
		transform: scale(1.05);
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 12rpx;
		background: var(--tab-active-bg);
		background-size: 100% 100%;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.qyx-data{
		padding: 0 30rpx;
		box-sizing: border-box ;
		display: flex;
		align-items: center;
		gap: 40rpx;
		margin-bottom: 30rpx;
	}
	.qyx-text{
		background-color: rgba(188, 188, 188, .3);
		    border-radius: 25rpx;
		    text-align: center;
		    padding: 10rpx 20rpx;
	}
	.actives{
		background-color: rgba(0, 189, 171, 0.3);
	}

	// 核心新增：scroll-box 样式
	.scroll-box {
		height: calc(100vh - 320rpx); // 高度需根据实际顶部导航高度调整
		width: 100%;
	}

	.c_sw-box{
		
	}
	.c_sw {
		width: 721rpx;
		min-height: 568rpx;
		background: #ffffff;
		box-shadow: 0rpx 2rpx 8rpx 0rpx #d3e7d1;
		border-radius: 0rpx 32rpx 32rpx 32rpx;
	    margin: 0 auto 15rpx;
		.card_box {
			width: 721rpx;
			padding: 17rpx 20rpx;
			box-sizing: border-box;
	
			.card_img {
				width: 100%;
				height: 300rpx;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
				margin-bottom: 18rpx;
			}
	
			.card_name {
				width: 100%;
				font-weight: 700;
				font-size: 30rpx;
				color: #333333;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-bottom: 24rpx;
			}
	
			.card_tag {
				width: 100%;
				display: flex;
				align-items: flex-start; // 修改为顶部对齐，适配换行
				justify-content: space-between;
				margin-bottom: 30rpx;
				
				// 核心新增样式：标签自动换行容器
				.tag-wrap {
					width: 80%;
					display: flex;
					flex-wrap: wrap; // 开启自动换行
					align-items: center;
					gap: 12rpx 12rpx; // 行列间距（替代column-gap）
					row-gap: 10rpx; // 行间距
					
					text {
						display: inline-block;
						padding:4rpx 10rpx;
						border-radius: 2rpx;
						border: 1rpx solid #628f2f;
						font-weight: 400;
						font-size: 20rpx;
						color: #628f2f;
						text-align: center;
						// 可选：限制标签最大宽度，防止单个标签过长
						max-width: 100%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
	
				>text:nth-child(2) {
					font-weight: 400;
					font-size: 24rpx;
					color: #909090;
					// 确保距离文字垂直居中
					margin-top: 4rpx;
				}
			}
	
			.card_line {
				width: 100%;
				height: 2rpx;
				background-color: #d8d8d8;
				margin-bottom: 16rpx;
			}
	
			.card_add {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
	
				text:nth-child(2) {
					flex: 1 0;
					width: 0;
					font-weight: 400;
					font-size: 22rpx;
					color: #7f7f7f;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin: 0 20rpx 0 10rpx;
				}
	
				.card_btn {
					min-width: 156rpx;
					height: 56rpx;
					background: var(--but-color-line);
					border-radius: 200rpx;
					text-align: center;
					line-height: 56rpx;
					font-weight: 500;
					font-size: 28rpx;
					color: #ffffff;
					padding: 0 16rpx;
				}
				.btnOver {
				  background: #EDEDED !important;
				  color: #999999 !important;
				  font-weight: normal !important;
				}
			}
		}
	}
	.no-more{
		text-align: center;
		color: #ccc;
		margin-top: 20rpx;
	}
</style>