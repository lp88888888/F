<template>
	<view class="" :data-theme="pageTheme"  >
		<!-- 地图组件 -->
		<map :latitude="currentLat"  v-if="currentLat" :longitude="currentLng" :scale="scale" :markers="markers" class="map"
			@markertap="handleMarkerTap" :polyline="polyline" :include-points="includePoints" show-location
			id='myMap'></map>
		<view class="cardsView" v-if="isShow">
			<view class="cardsView-text">为您推荐出 <text>{{total}}</text>条货源信息</view>
			<up-icon name="close" size="14" @click="isShow = false"></up-icon>
		</view>
		<view class="pageView">
			<view v-for="(item,index) in dataList" :key="index">
				<ItemDtail :detai="item"></ItemDtail>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed,onMounted,watch} from 'vue';
	import ItemDtail from "./components/ItemDtail.vue";
	import {showToast} from"@/utils/util";
	import { toNav, toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import QQMapWX from "@/common/qqmap-wx-jssdk.js";
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const qqmapsdk = new QQMapWX({
		key: '5HDBZ-75NLA-YCVKK-CK77C-ASTC7-SLBX2' // 请替换为你的腾讯地图key
	});
	interface Props {
	  list: ItemDetail;
	  total:string|number
	}
	const props = defineProps<Props>();
	const isShow = ref<boolean>(true);
	const dataList = computed(()=>{
		return props.list || [] 
		
	});
	
	
	const currentLat = ref(0);
	const currentLng = ref(0);
	const markers = ref([]);
	const scale = ref(10);
	const shopList = ref([]);
	const polyline = ref([]);
	const includePoints = ref([])
	const loading= ref(false)
	const errorMsg= ref('')
	// 添加watch来监听props.list的变化
	watch(() => props.list, (newList) => {
		console.log("object", newList)
		if (newList) {
			addMarker()
		}
	}, { immediate: true });
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
			addMarker()
		} catch (err) {
			console.error('初始化地图失败:', err);
			errorMsg.value = '获取位置失败，请检查权限设置';
		} finally {
			loading.value = false;
		}
	};
	const addMarker = ()=>{
		markers.value = props.list.map((shop, index) =>({
				id: Number(shop.id), // 确保id唯一且不为0（0用于用户位置）
				latitude: shop.loadingAddrLatitude,
				longitude: shop.loadingAddrLongitude,
				title: shop.goodsName,
				iconPath: imgUrl +
					'static/huoyuan-icon.png', // 可替换为自己的图标
				width: 25,
				height: 25,
				type: 'fuq',
				callout: {
					content: shop.goodsName,
					color: '#333',
					fontSize: 12,
					borderRadius: 4,
					bgColor: '#fff',
					padding: 5,
					display: 'BYCLICK'
				}
			}))
			scale.value = 10
	}
	
	// 处理标记点击
	const handleMarkerTap = (e) => {
		const markerId = e.markerId;
		if (markerId === 0) return; // 忽略用户自己的标记
		console.log(e);
		toNav('/pages_D/informationMatch/detail?id='+markerId)
		// const selectedShop = shopList.value[markerId - 1];
		// if (selectedShop) {
		// 	navigateToShop(selectedShop);
		// }
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
		initMap();
	});
</script>

<style lang="scss" scoped>
	.map {
		width: 100%;
		height: 750rpx;
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