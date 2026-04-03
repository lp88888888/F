<template>
	<view class="">
		<!-- 地图组件 -->
		<map :latitude="currentLat" :longitude="currentLng"  v-if="currentLat" :scale="scale" :markers="markers" class="map"
			@markertap="handleMarkerTap" :polyline="polyline" :include-points="includePoints" show-location
			id='myMap'></map>
		
		<view class="cardsView" v-if="isShow">
			<view class="cardsView-text">为您推荐出 <text>{{dataList.length}}</text>条货源信息</view>
			<up-icon name="close" size="14" @click="isShow = false"></up-icon>
		</view>
		<view class="pageView">
			<view v-for="(item,index) in dataList" :key="index">
				<BusinessItem :detail="item"></BusinessItem>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed,onMounted} from 'vue';
	import BusinessItem from "./components/BusinessItem.vue";
	import {showToast} from"@/utils/util";
	import {imgUrl} from '@/config';
	import type {Business} from './types';
	import QQMapWX from "@/common/qqmap-wx-jssdk.js"
	const qqmapsdk = new QQMapWX({
		key: '5HDBZ-75NLA-YCVKK-CK77C-ASTC7-SLBX2' // 请替换为你的腾讯地图key
	});
	
	const isShow = ref<boolean>(true);
	const dataList = ref<Array<Business>>([
		{url:'',name:'安康宏晖鑫达商贸有限公司',price:68,dNum:'100.15KM',addr:'宁陕县江口回族镇'},
		{url:'',name:'西安悦达商贸有限公司',price:200,dNum:'100.15KM',addr:'广泽大厦丈八东路南途虎养车'},
		{url:'',name:'西安悦达商贸有限公司',price:200,dNum:'100.15KM',addr:'广泽大厦丈八东路南途虎养车'},
	])
	const currentLat = ref(0);
	const currentLng = ref(0);
	const markers = ref([]);
	const scale = ref(15);
	const shopList = ref([]);
	const polyline = ref([]);
	const includePoints = ref([])
	const loading= ref(false)
	const errorMsg= ref('')
	
	// 初始化地图
	const initMap = async () => {
		loading.value = true;
		errorMsg.value = '';
	
		try {
			// 获取用户位置
			const locationRes = await new Promise((resolve, reject) => {
				uni.getLocation({
					type: 'gcj02', // 腾讯地图使用gcj02坐标系
					success: resolve,
					fail: reject
				});
			});
	
			currentLat.value = locationRes.latitude;
			currentLng.value = locationRes.longitude;
	
			// 添加用户位置标记
			markers.value = [{
				id: 0,
				latitude: currentLat.value,
				longitude: currentLng.value,
				iconPath: imgUrl + 'map/qi.png', // 可替换为自己的图标
				width: 30,
				height: 30,
				zIndex: 10
			}];
		} catch (err) {
			console.error('初始化地图失败:', err);
			errorMsg.value = '获取位置失败，请检查权限设置';
		} finally {
			loading.value = false;
		}
	};
	
	// 处理标记点击
	const handleMarkerTap = (e) => {
		const markerId = e.markerId;
		if (markerId === 0) return; // 忽略用户自己的标记
	
		const selectedShop = shopList.value[markerId - 1];
		if (selectedShop) {
			navigateToShop(selectedShop);
		}
	};
	
	// 导航到商店详情（这里只是示例，实际项目中可跳转到详情页）
	const navigateToShop = (shop) => {
		showToast({
			title: `你选择了: ${shop.title}`,
			duration: 2000
		});
	
		// 实际项目中可以跳转到详情页
		// uni.navigateTo({
		//   url: `/pages/shop/detail?id=${shop.id}`
		// });
	};
	
	// 页面加载时初始化地图
	onMounted(() => {
		console.log("-----------------");
		initMap();
	});
</script>

<style lang="scss" scoped>
	.map {
		width: 100%;
		height: 750rpx;
		position: relative;
		z-index: 1;
	}
	.pageView{
		padding: 32rpx;
		box-sizing: border-box;
	}
	.cardsView{
		width: 750rpx;
		height: 99rpx;
		background: #FFFFFF;
		border-radius: 36rpx 36rpx 0rpx 0rpx;
		border: 3px solid #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		box-sizing: border-box;
		margin-top: -40rpx;
		position: relative;
		z-index: 3;
		.cardsView-text{
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
			text{
				color: #FF9600;
			}
		}
	}
	
</style>