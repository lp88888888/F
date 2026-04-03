<template>
	<view class="food-page">
		<up-navbar title="餐饮美食" :bgColor="backgroundColor" leftIconColor="#FFFFFF" :titleStyle="{fontWeight:'bold',color:'#FFFFFF'}" @leftClick="toBack" placeholder fixed></up-navbar>
		<view class="bg-box" style="font-weight: ;"></view>
		<view class="header">
			<view class="search-row">
				<u-search v-model="keyword" :showAction="false" placeholder="请输入商品名称或商家名称" height="36" shape="round"
					bgColor="#fff" />
				<view class="gap8" />
			</view>
			<view class="tab-card">
				<scroll-view class="scroll-wrapper" scroll-x="true">
					<view class="cat-items">
						<view v-for="(c, i) in categories" :key="i" class="cat-item" @click="onPickCat(c)">
							<image class="cat-icon" :src="imgUrl+c.icon" mode="aspectFit" />
							<text :class="['cat-text', currentCat === c.name ? 'active' : '']">{{ c.name }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="content-box">
			<!-- 筛选标签 -->
			<view class="filters">
				<view v-for="(t,i) in tabs" :key="i" :class="['chip', currentTab===i?'chip--active':'']"
					@click="currentTab=i">
					{{ t }}
				</view>
			</view>
			<!-- 店铺卡片列表 -->
			<view class="list">
				<view v-for="shop in filteredShops" :key="shop.id" :border="false" :headBorderBottom="false"
					:footBorderTop="false" :padding="0" @click="togplist" bodyStyle="padding: 16rpx 20rpx 20rpx 20rpx;" class="shop-card">
					<view class="shop-row">
						<u--image :src="imgUrl+shop.cover" width="170rpx" height="170rpx" radius="13" />
						<view class="shop-main">
							<text class="name">{{ shop.name }}</text>
					
							<view class="rate-row">
								<view class="icon-box">
									<u-icon name="star-fill" color="#FFFFFF" size="16" />
								</view>
								<view class="score">{{ shop.score.toFixed(1) }}分</view>
								<text class="time">
									营业时间：
									<text class="times">{{ shop.hours }}</text>
								</text>
							</view>
							
							<view class="name-row">
								<view class="metas-row">
									<view class="meta-row">
										<text class="meta">月售{{ shop.monthly }}+</text>
										<view class="divider"></view>
										<text class="meta">人均￥{{ shop.pp }}</text>
									</view>
									<text class="meta-addr">宝鸡西服务区</text>
								</view>
								<view class="phone" @click="call(shop.phone)">
									<u-icon :name="imgUrl+'static/eat-ipone-ionc.png'" size="18"  />
								</view>
							</view>
						</view>
					</view>
					
					<view class="addr-row">
						<u-icon name="map" size="16" color="#000000" />
						<text class="addr">{{ shop.addr }}</text>
						<view class="flex-spacer" />
						<text class="dist">距您{{ shop.distance }}</text>
						<u-icon name="arrow-right" size="12" color="#333333" />
					</view>
				</view>
			</view>

		</view>

		<u-gap height="24" />
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { imgUrl } from '../../config';
	import { toNav,toBack } from '@/utils/route';
	import {makePhoneCall} from '@/utils/util'
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);	
	
	const keyword = ref('')
	const currentCat = ref('全部')
	const currentTab = ref(0)
	const backgroundColor = ref<string>(themeStore.themeColors.$primaryColor);
	onMounted(() => {
		
	});
	const tabs = ['服务区美食', '景区美食', '距离优先', '筛选']

	const categories = [
		{ name: '全部', icon: 'static/eat-icon-4.png' },
		{ name: '米粉面馆', icon:'static/eat-icon-1.png' },
		{ name: '川湘菜', icon: 'static/eat-icon-2.png' },
		{ name: '特色小吃', icon: 'static/eat-icon-3.png' },
		{ name: '炸鸡炸物', icon: 'static/eat-icon-4.png' },
		{ name: '米粉面馆', icon: 'static/eat-icon-5.png' },
		{ name: '川湘菜', icon: 'static/eat-icon-1.png' },
		{ name: '特色小吃', icon: 'static/eat-icon-2.png' },
		{ name: '炸鸡炸物', icon: 'static/eat-icon-3.png' },
	]

	const shops = ref([
		{
			id: 1,
			name: '宝鸡西服务区餐厅',
			score: 4.6,
			hours: '08:00~23:00',
			monthly: 2000,
			pp: 25,
			addr: '宝鸡市清涧区宝鸡西服务区',
			distance: '30.6km',
			phone: '0917-8888888',
			cover: 'static/list-shop-icon.png',
			tags: ['服务区美食', '全部'],
		},
		{
			id: 2,
			name: '秦岭服务区北区餐厅',
			score: 4.9,
			hours: '08:00~22:00',
			monthly: 3000,
			pp: 30,
			addr: '陕西省商洛服务区北区',
			distance: '150.3km',
			phone: '029-6666666',
			cover: 'static/list-shop-icon.png',
			tags: ['服务区美食', '全部'],
		},
		{
			id: 3,
			name: '武功服务区餐厅',
			score: 4.3,
			hours: '08:00~22:00',
			monthly: 1000,
			pp: 19,
			addr: '陕西省武功服务区',
			distance: '90.6km',
			phone: '029-1234567',
			cover: 'static/list-shop-icon.png',
			tags: ['服务区美食', '全部'],
		},
	])

	const filteredShops = computed(() => {
		const kw = keyword.value.trim()
		return shops.value.filter(s => {
			const byCat = s.tags.includes(currentCat.value)
			const byKw = kw ? s.name.includes(kw) || s.addr.includes(kw) : true
			return byCat && byKw
		})
	})
     const togplist = () => {
		toNav('/pages_B/dining/diningHome')
	}
	function onPickCat(c : { name : string }) {
		currentCat.value = c.name
	}

	function onSearch() {
		// 这里已用 computed 过滤，无需额外处理
	}

	function call(phone : string) {
		if (!phone) return
		// #ifdef H5
		window.location.href = `tel:${phone}`
		// #endif
		// #ifndef H5
		makePhoneCall(phone);
		// #endif
	}
</script>

<style scoped lang="scss">
	.food-page {
		min-height: 100vh;
		background: $pageBgColor;
	}

	.bg-box {
		position: absolute;
		z-index: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 408rpx;
		background: $color;
		border-radius: 0 0 40rpx 40rpx;
	}

	/* 头部 */
	.header {
		padding-bottom: 20rpx;
	}

	.search-row {
		height: 72rpx;
		background: #FFFFFF;
		border-radius: 36rpx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;
		margin: 20rpx 32rpx;
	}
	
	::v-deep .search-row .u-icon__icon {
		color: #000000 !important;
	}

	.gap8 {
		width: 16rpx;
		height: 1rpx;
	}

	.tab-card {
		width: 686rpx;
		height: 200rpx;
		background: #FFFFFF;
		border-radius: 26rpx;
		border: 8rpx solid #FFFFFF;
		margin: 0 32rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		padding-left: 30rpx;
	}

	.scroll-wrapper {
		height: 200rpx;
		display: flex;
		overflow-x: auto;
		white-space: nowrap;
	}

	.cat-items {
		display: flex;
		height: 200rpx;
		gap: 60rpx;
		flex-wrap: nowrap;
	}

	.cat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.cat-icon {
		width: 78rpx;
		height: 65rpx;
	}

	.cat-text {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #7a7f87;
	}

	.cat-text.active {
		color: $color;
		font-weight: 600;
	}

	.filters {
		display: flex;
		gap: 20rpx;
		padding: 0 32rpx 20rpx 32rpx;
	}

	.chip {
		height: 56rpx;
		line-height: 56rpx;
		box-sizing: border-box;
		padding: 0 26rpx;
		background: #fff;
		border-radius: 28rpx;
		font-size: 24rpx;
	}

	.chip--active {
		color: #FFFFFF;
		background: $bgLgColor;
	}

	/* 列表 */
	.list {
		padding: 0 32rpx 20rpx;
	}

	.shop-card {
		margin-bottom: 20rpx;
		border-radius: 26rpx;
		background: #FFFFFF;
		padding: 30rpx;
	}

	.shop-row {
		display: flex;
		gap: 20rpx;
	}

	.shop-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.name-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.name {
		font-weight: 800;
		font-size: 32rpx;
		color: #000000;
	}

	.phone {
		width: 56rpx;
		height: 56rpx;
		justify-content: center;
		align-items: center;
	}

	.rate-row {
		display: flex;
		align-items: center;
		color: #8a8f99;
		font-size: 22rpx;
	}
	
	.icon-box {
		width: 34rpx;
		height: 34rpx;
		line-height: 34rpx;
		background: linear-gradient(-40deg, #FF4C26, #FF8A51);
		border-radius: 6rpx 0rpx 0rpx 6rpx;
	}

	.score {
		width: 90rpx;
		height: 34rpx;
		line-height: 34rpx;
		background: #FFEFE8;
		border-radius: 0rpx 6rpx 6rpx 0rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #FF5000;
		padding-left: 12rpx;
		margin-right: 20rpx;
	}

	.time {
		margin-left: 8rpx;
		font-weight: 500;
		font-size: 24rpx;
		color: #666666;
	}
	
	.times {
		color: $color;
	}
	
	.metas-row {
		display: flex;
		flex-direction: column;
	}

	.meta-row {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 12rpx;

		.meta {
			font-size: 22rpx;
			color: #333333;
		}
		
		.divider {
			width: 1rpx;
			height: 22rpx;
			background: #CCCCCC;
		}
	}
	
	.meta-addr {
		font-weight: 500;
		font-size: 22rpx;
		color: #666666;
	}

	.addr-row {
		height: 76rpx;
		background: #F5F5F5;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		margin-top: 24rpx;
		padding: 0 24rpx;

		.addr {
			flex: 1;
			font-size: 24rpx;
			color: #333333;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin-left: 10rpx;
		}

		.dist {
			font-size: 24rpx;
			color: #333333;
			margin-right: 12rpx;
		}
	}

	.flex-spacer {
		flex: 1;
	}

	.u-grid {
		height: 200rpx;
	}
</style>