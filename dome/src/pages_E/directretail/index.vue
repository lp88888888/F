<template>
	<view class="container" :data-theme="pageTheme">
		<up-sticky>
			<up-navbar title="服务区便利店活动" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			<view class="searchView">
				<up-search 
					placeholder="请输入商品名称或服务区查询" 
					v-model="keyword" 
					searchIconColor="#000000" 
					shape="round"
					:bgColor="themeStore.themeColors.$badgeBgColorsy" 
					@change="serviceareaactivityFunProxy"  
					@search="serviceareaactivityFunProxy" 
					actionText 
					:showAction="false"
					style="height: 45px;"
				></up-search>
			</view>
		</up-sticky>
		
		<!-- 页面容器：添加上拉加载监听 -->
		<view class="page-container" @scrolltolower="loadMore">
			<!-- 活动卡片列表 -->
			<view class="activity-card" v-for="(item, index) in listData" :key="index">
				<!-- 顶部绿色标签栏 -->
				<view class="card-header">
					<image class="arrow-img" :src="icoUrl + 'direct_icon.png'"></image>
					<view class="hdnr">
						<image class="hdnr-img" :src="imgUrl + 'dire-icon1.png'" style="padding-top: 4rpx;"></image>
						活动内容
					</view>
				</view>
				
				<!-- 活动规则区 -->
				<view class="rule-section">
					<view class="rule-box">
						<view>
							<image :src="imgUrl + 'yldj-icon.png'" mode="" class="rule-img"></image>
						</view>
						<text class="activity-content">
							{{ item.activityContent }}
						</text>
					</view>
				</view>

				<!-- 活动时间 -->
				<view class="time-row">
					<view style="display: flex;align-items: center;gap: 20rpx;margin-bottom: 20rpx;font-size: 32rpx;">
						<image :src="imgUrl + 'dire-icon2.png'" mode="" class="hdnr-img"></image>
						活动时间
					</view>
					<text class="info-text" style="margin-left: 4rpx;">{{item.startTime}}</text>-<text class="info-text">{{item.endTime}}</text>
				</view>
				
				<!-- 活动地点 -->
				<view class="time-row">
					<view style="display: flex;align-items: center;gap: 20rpx;font-size: 32rpx;">
						<image :src="imgUrl + 'dire-icon3.png'" mode="" class="hdnr-img"></image>
						活动地点</view>
				</view>
				
				<!-- 服务区列表：核心修改 - 最多显示3个，展开/收起切换 -->
				<view class="location-list">
					<view 
						class="location-item" 
						v-for="(loc, locIndex) in (item.isExpanded ? item.serviceAreaInfoList : item.serviceAreaInfoList.slice(0, 3))" 
						:key="locIndex"
					>
						<view class="location-fwq" 
						      :class="{ 'is-active': locIndex == 0 }"
						      @click="loc && toNav(`/pages_A/stationDetails/index?id=${loc.id}`)">
						  <text class="location-text">{{ (loc && loc.serviceAreaName) || '' }} {{ loc && handleEstimate(loc) }}</text>
						  <text class="location-text" v-if="locIndex === 0">{{ (loc && loc.distance) || '' }}</text>
						  <up-icon name="arrow-right" color="#000" size="14"></up-icon>
						</view>
						</view>
				</view>
				
				<!-- 展开/收起按钮：仅服务区数量>3时显示 -->
				<view 
					class="arrow-dow" 
					@click="arrowFun(index)" 
					v-if="item.serviceAreaInfoList && item.serviceAreaInfoList.length > 3"
				>
					<view class="arrow-zk">
						<up-icon 
							:name="item.isExpanded ? 'arrow-up' : 'arrow-down'" 
							color="#000" 
							size="18"
						></up-icon>
						<text>{{ item.isExpanded ? '收起' : '展开' }}</text>
					</view>
				</view>
			</view>
			
			<!-- 加载状态提示 -->
			<view class="load-more" v-if="loading">
				
				<text class="load-text">加载中...</text>
			</view>
			<view class="load-more" v-if="noMoreData && listData.length > 0">
				<text class="load-text">没有更多数据了</text>
			</view>
			
			<!-- 空数据提示 -->
			<ser-empty v-if="listData.length == 0"></ser-empty>
			<view style="height: 250rpx;" v-if="noMoreData && listData.length > 0"></view>
		</view>
		
		<!-- 购物直达栏 -->
		<view class="shopping-bar">
			<view class="bar-left">
				<image class="hdnr-img" :src="imgUrl + 'dire-icon4.png'"></image>
				<text class="bar-text">线上购物·一键直达</text>
			</view>
			<view class="check-btn" hover-class="check-btn-hover" @click="handleCheck">
				<text class="btn-text">立即查看</text>
			</view>
		</view>
		<SateLayer ref="sateLayerRef"></SateLayer>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, computed, onMounted } from 'vue';
	import { random, guid, timeFormat } from '@/uni_modules/uview-plus';
	import SateLayer from '@/components/SateLayer/index.vue';
	import { useCommonStore } from '@/store/modules/common';
	import { imgUrl } from '@/config';
	import { serviceareaactivity } from '@/api/home';
	import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app';
	import { toNav, toBack } from '@/utils/route';
	import { useTheme } from '@/composables/useTheme';
	import { useAppStore } from '@/store/modules/app';
	const appStore = useAppStore();
	const sateLayerRef = ref(null);
	// 主题相关
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = computed(() => {
		return themeStore.imgUrl
	})

	// 搜索关键词
	const keyword = ref('')

	// 列表数据
	const listData = ref<any[]>([])

	// 分页加载相关
	const pageNum = ref(1)         // 当前页码
	const pageSize = ref(99)       // 每页条数
	const loading = ref(false)     // 加载中状态
	const noMoreData = ref(false)  // 是否无更多数据

	// 切换服务区展开/收起状态（按卡片索引）
	const arrowFun = (index: number) => {
		if (listData.value[index]) {
			listData.value[index].isExpanded = !listData.value[index].isExpanded
		}
	}
	const handleEstimate = (item) => {
		if (item.serviceAreaName == '曲江服务区' || item.serviceAreaName == '汉城服务区') {
			return `(${['', '内环', '外环'][item.locationDirection]})`;
		}
		if (item.locationDirection) {
			return `(${
				item.serviceAreaName.indexOf('绕城') != -1 ? ['', '内环', '外环'][item.locationDirection] : ['', '上行', '下行'][item.locationDirection]
			})`;
		}
		return '';
	};
	// 核心查询函数（支持分页）
	const serviceareaactivityFun = async (isLoadMore = false) => {
		// 加载中/无更多数据时阻止重复请求
		if (loading.value || (noMoreData.value && isLoadMore)) return;

		loading.value = true
		try {
			const params = {
				keyword: keyword.value,
				pageNum: pageNum.value,
				pageSize: pageSize.value,
				longitude: uni.getStorageSync('address').lng,
				latitude: uni.getStorageSync('address').lat,
			};
			const res = await serviceareaactivity(params)

			// 格式化数据：给每个项添加默认收起状态
			const formatData = (res.data || []).map((item: any) => ({
				...item,
				isExpanded: false  // 初始为收起状态
			}));

			// 加载更多：追加数据；首次/搜索：替换数据
			if (isLoadMore) {
				listData.value = [...listData.value, ...formatData]
			} else {
				listData.value = formatData
			}

			// 判断是否无更多数据
			noMoreData.value = formatData.length < pageSize.value
		} catch (error) {
			console.error('获取服务区活动数据失败:', error)
		} finally {
			loading.value = false
		}
	};

	// 加载更多
	const loadMore = () => {
		if (!loading.value && !noMoreData.value) {
			pageNum.value++
			serviceareaactivityFun(true)
		}
	}

	// 搜索代理：重置分页后查询
	const serviceareaactivityFunProxy = () => {
		pageNum.value = 1          // 重置页码
		noMoreData.value = false   // 重置无更多状态
		serviceareaactivityFun(false)
	}

	const handleCheck = () => {
		sateLayerRef.value.open(appStore.MiniProgramConfig['wxdc19ca1e27782277']);
		console.log('点击立即查看')
	}

	// 页面挂载时加载初始数据
	onMounted(() => {
		serviceareaactivityFun()
	})
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		overflow: hidden;
		background: var(--head-color);
	}

	.pageView {
		padding: 32rpx;
		box-sizing: border-box;
		height: 80vh;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
	}

	.searchView {
		width: 100%;
		padding: 25rpx 32rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.searchView-but {
			color: #000;
			font-size: 24rpx;
			display: inline-block;
			padding: 10rpx 15rpx;
			border-radius: 10rpx;
			margin-left: 20rpx;
		}
	}

	/* 页面容器：添加上拉加载所需的滚动样式 */
	.page-container {
		padding: 20rpx;
		height: 80vh;
		overflow: scroll;
		min-height: calc(100vh - 200rpx); /* 适配底部购物栏高度 */
		-webkit-overflow-scrolling: touch; /* 优化移动端滚动体验 */
	}

	/* 加载更多提示样式 */
	.load-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #999;
		
		.load-text {
			margin-left: 10rpx;
			font-size: 26rpx;
		}
	}

	/* 活动卡片样式 */
	.activity-card {
		background: #fff;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
		font-size: 28rpx;
		color: #333;
		margin: 0 auto 20rpx; /* 增加卡片间距 */
	}

	.header-left {
		display: flex;
		align-items: center;
	}

	.icon {
		flex-shrink: 0;
	}

	.icon-content {
		width: 40rpx;
		height: 40rpx;
		margin-right: 16rpx;
	}

	.header-title {
		font-size: 32rpx;
		font-weight: 500;
	}

	.subscribe-tag {
		position: absolute;
		right: 32rpx;
		top: 50%;
		transform: translateY(-50%);
		background-color: #72b86a;
		padding: 8rpx 16rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
	}

	/* 活动规则区 */
	.rule-section {
		padding: 20rpx 30rpx;
		display: flex;
		align-items: flex-start;
	}

	.icon-dot {
		width: 24rpx;
		height: 24rpx;
		margin-top: 8rpx;
		margin-right: 16rpx;
	}

	.rule-text {
		line-height: 1.6;
		color: #666;
	}

	/* 信息行通用样式 */
	.info-row {
		padding: 16rpx 32rpx;
		display: flex;
		align-items: center;
	}

	.icon-time,
	.icon-location {
		width: 36rpx;
		height: 36rpx;
	}

	.time-row {
		padding: 10rpx 30rpx;
		
	}

	.location-list {
		padding: 0 30rpx;
	}

	.location-item {
		margin: 10rpx 0;
		padding-bottom: 10rpx;
	}

	.location-fwq {
		display: flex;
		gap: 10rpx;
		align-items: center;
		color: #666666;
	}

	.location-text {
		max-width: 400rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.arrow-dow {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.arrow-img {
		width: 342rpx;
		height: 76rpx;
		display: flex;
		align-items: center;
		margin: 0 auto 20rpx;
	}

	.rule-img {
		width: 30rpx;
		height: 30rpx;
		margin-right: 14rpx;
	}

	.rule-box {
		display: flex;
		border: 1px solid var(--primary-color);
		border-radius: 24rpx;
		padding: 20rpx;
		max-height: 300rpx;
		overflow-y: scroll;
	}

	.card-header {
		position: relative;
	}


	/* 购物直达栏 */
	.shopping-bar {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 30rpx 32rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99; /* 确保在最上层 */
	}

	/* 左侧图标+文字区 */
	.bar-left {
		display: flex;
		align-items: center;
		gap: 20rpx;
		margin-left: -60rpx;
	}

	/* 左侧小图标（横线+圆点样式） */
	.dot-icon {
		width: 24px;
		height: 16px;
		position: relative;
		margin-right: 8px;
	}

	.dot-icon::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		width: 16px;
		height: 1px;
		background-color: #999;
		transform: translateY(-50%);
	}

	.dot-icon::after {
		content: '';
		position: absolute;
		top: 50%;
		right: 0;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background-color: #999;
		transform: translateY(-50%);
	}

	/* 文字样式 */
	.bar-text {
		font-size: 14px;
		color: #333;
		line-height: 1.2;
	}

	/* 右侧立即查看按钮 */
	.check-btn {
		background: var(--primary-color);
		color: #fff;
		border-radius: 16px;
		padding: 16rpx 45rpx;
		font-size: 14px;
		border: none;
		line-height: 1.4;
		height: auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-text {
		color: #fff;
		font-size: 14px;
	}

	.arrow-zk {
		display: flex;
		gap: 10rpx;
		padding-bottom: 10rpx;
		align-items: center;
	}
	.hdnr {
		position: absolute;
		color: #fff;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -40%);
		display: flex;
		align-items: center;
		gap: 10rpx;
		font-size: 32rpx;
	}
	
	.hdnr-img{
		width: 36rpx;
		height:36rpx;
		
	}
	.info-text{
		font-size: 28rpx;
		color: #333333;
	}
	.activity-content{
		line-height: 1.6;
		color: #333;
		word-break: break-all;
	}
	.is-active{
		color: var(--primary-color) !important;;
	}
</style>