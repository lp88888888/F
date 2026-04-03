<template>
	<view class="container" :data-theme="pageTheme">
		<!-- 地图组件 -->
		<map v-if="currentLat" :latitude="currentLat" :longitude="currentLng" :scale="scale" :markers="markers"
			class="map" @markertap="handleMarkerTap" :polyline="polyline" :include-points="includePoints" show-location
			id="myMap"></map>
			

		<!-- 加载提示 -->
		<!-- <view v-if="loading" class="loading-mask">
			<view class="loading">
				<uni-loading-icon size="24" color="#007aff"></uni-loading-icon>
				<text class="loading-text">加载中...</text>
			</view>
		</view> -->
		<!-- 错误提示 -->
		<view v-if="errorMsg" class="error-message">
			<text>{{ errorMsg }}</text>
			<button @click="initMap" class="retry-btn">重试</button>
		</view>
		<!-- 商店列表底部弹窗 -->
		<view class="shop-list" :style="{
				height: popupHeight + 'px',
				transition: isMoving ? 'none' : 'height 0.3s ease',
			}" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" v-if="isnavigation == false">
			<view class="list-header">
				<view>
					<view class="list-header-1" @click="openMaps">
						<view class="corie"> </view>
						<text>{{ chushiname }}</text>
						<u-icon name="arrow-right" size="16" color="#999"></u-icon>
					</view>
					<view class="list-header-2">
						<text>我的位置</text>
						<view class="list-header-4" @click="huanxinag()">
							<image :src="imgUrl + 'map/jinahuanicon.png'"
								style="width: 35rpx; height: 24rpx; margin-right: 8rpx"> </image>
							<text class="huaixangtext">换向</text>
						</view>
					</view>

					<view class="list-header-3" @click="openMap">
						<view class="corie1"> </view>
						<text v-if="selectedLocation">{{ selectedLocation.name }}</text>
						<text v-else>请输入目的地</text>
					</view>
				</view>
			</view>
			<view class="leb-box">
				<view class="leb-cord" v-for="(item, index) in lebList" :key="index" @click="topath(item)">
					<image :src="imgUrl + item.img" mode=""></image>
					<text>{{ item.name }}</text>
				</view>
			</view>
		</view>
		<view class="foot-list" v-if="isnavigation">
			<Tabjyz @closetab="hangletab" @maptq="tianqimap" :fromcurrentLat="currentLat" :fromcurrentLng="currentLng"
				:tolatitude="selectedLocation.latitude" :tolongitude="selectedLocation.longitude" v-if="istab == 1">
			</Tabjyz>
			<Tabetc @closetab="hangletab" @maptq="tianqimap" :fromcurrentLat="currentLat" :fromcurrentLng="currentLng"
				:tolatitude="selectedLocation.latitude" :tolongitude="selectedLocation.longitude" v-if="istab == 4">
			</Tabetc>
			<Tabcdz @closetab="hangletab" @maptq="tianqimap" :fromcurrentLat="currentLat" :fromcurrentLng="currentLng"
				:tolatitude="selectedLocation.latitude" :tolongitude="selectedLocation.longitude" v-if="istab == 2">
			</Tabcdz>
			<Tabfuq @closetab="hangletab" @maptq="tianqimap" :fromcurrentLat="currentLat" :fromcurrentLng="currentLng"
				:tolatitude="selectedLocation.latitude" :tolongitude="selectedLocation.longitude" v-if="istab == 3">
			</Tabfuq>
			<Tabtq @closetab="hangletab" @maptq="tianqimap" :from="coordinatesfrom" :to="coordinatesto"
				v-if="istab == 5"> </Tabtq>
			<Tablx @qiehuantab="chengtab" :routelist="routelist" :tolatitude="selectedLocation.latitude"
				:tolongitude="selectedLocation.longitude" :toname="selectedLocation.name" v-if="istab == 6"></Tablx>
		</view>
		<!-- <view class="custom-search-box">
			<view class="select-sousu">
				西安
				<image :src="imgUrl+'map/xialai.png'" class="select-img"></image>
			</view>
			<input type="text" :value="keyword" placeholder="请输入服务区/收费站名称" placeholder-style="color: #999"
				class="input" />
			<view class="search-icon">
				<u-icon name="search" size="35" color="#333"></u-icon>
			</view>

		</view> -->

		<view class="tab-header" v-if="isnavigation">
			<view class="tab-header-card" v-for="(item, index) in ltabList" :key="index" @click="switchtab(index)">
				<image :src="imgUrl + item.img" mode=""></image>
				<text :class="istab == index + 1 ? 'tabtext2' : 'tabtext1'">{{ item.name }}</text>
			</view>
		</view>
		<!-- 右边 -->
		<view class="cities" v-if="isnavigation == false" @click="totianqi">
			<image :src="`https://tranalioss.shanyitong.com/wximage/trip-pro/weather/${weatherNow.icon}.png`"
				class="img"> </image>
			<text>{{ weatherNow.temp }}℃</text>
			<!-- <text>陕西省</text><u-icon name="arrow-right" size="16" color="#999"></u-icon> -->
		</view>
		<!-- 左边 -->
		<view class="use-btn" v-if="isnavigation == false">
			<view @click="haedfwq">
				<image :src="imgUrl + 'map/fuwuqutop.png'" class="img"> </image>
				<view :class="showfuq == 2 ? 'active' : ''">服务区</view>
			</view>
			<view @click="haedsfz">
				<image :src="imgUrl + 'map/shoufeitop.png'" class="img1"> </image>
				<view :class="showsfz == 2 ? 'active' : ''">收费站</view>
			</view>
		</view>
		<view class="use-btn" style="top: 25%" v-if="isnavigation == false">
			<view @click="haedetc">
				<image :src="imgUrl + 'map/etctop.png'" style="width: 45rpx; height: 45rpx; margin-left: 8rpx"></image>
				<view :class="showetc == 2 ? 'active' : ''" style="font-size: 18rpx">ETC网点</view>
			</view>
		</view>
		<view class="use-btn-mz" style="top: 50%" v-if="isnavigation == false">
			<image :src="imgUrl + 'img/miaozhunicon.png'" style="width: 89rpx; height: 89rpx; margin-left: 8rpx"
				@click="addsele()"></image>
		</view>
		<!-- 列表按钮 -->
		<button class="list-btn" @click="showShopList = true" v-if="shopList.length > 0 && !errorMsg">
			<uni-icons type="list" size="18" color="#fff"></uni-icons>
		</button>
		<ser-CustomImageLoading :modelValue="loading" text="正在获取数据..." />
		<PageDurationTracker pageName="路况地图" type='count'/>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import theme from '@/utils/theme';
	// import CustomImageLoading from '@/components/CustomImageLoading/CustomImageLoading.vue'
	import {
		imgUrl
	} from '../../config';
	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	import {
		getgetServiceAreaPageList,
		getgetTollStationByIdList,
		getlistPageEtcBranchList
	} from '@/api/map.ts';
	import {
		getTadayApi
	} from '@/api/weather.ts';
	import Tabjyz from './components/tabjyz.vue';
	import Tabetc from './components/tabetc.vue';
	import Tabcdz from './components/tabcdz.vue';
	import Tabfuq from './components/tabfuq.vue';
	import Tabtq from './components/tabtq.vue';
	import Tablx from './components/luxian.vue';
	const scale = ref(15);
	const isnavigation = ref(false);
	const selectedLocation = ref(null);
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB', // 请替换为你的腾讯地图key
	});
	// 响应式数据
	const currentLat = ref(0);
	const currentLng = ref(0);
	const markers = ref([]);
	const shopList = ref([]);
	const loading = ref(true);
	const errorMsg = ref('');
	const showShopList = ref(true);
	const showfuq = ref(1);
	const showsfz = ref(1);
	const showetc = ref(1);
	const istab = ref(6);
	const keyword = ref('');
	const coordinatesfrom = ref('');
	const coordinatesto = ref('');
	// 当前高亮路线索引
	const includePoints = ref([]);
	const routelist = ref([]);
	const activeIndex = ref(0);
	const chushiname = ref('');
	const weatherNow = ref({});
	// 方法
	const getWeatherNow = async () => {
		const params = {
			key: 'c378003293184af18adad854cc0c12bc',
			location: uni.getStorageSync('locationId'),
			lang: 'zh-hans',
			unit: 'm',
		};
		try {
			const response = await getTadayApi(params);
			console.log(response);
			weatherNow.value = response.now;
		} catch (error) {
			console.error(error);
		}
	};

	const totianqi = async () => {
		uni.navigateTo({
			url: `/pages_A/weather/index`,
		});
	};
	const lebList = ref([{
			img: 'map/shoufeiicon.png',
			name: '收费站',
			id: '1',
			path: '/pages_A/toll/index',
		},
		{
			img: 'map/fuwuquicon.png',
			name: '服务区',
			id: '2',
			path: '/pages_A/station/index',
		},
		{
			img: 'map/etcwadicon.png',
			name: 'ETC网点',
			id: '3',
			path: '/pages_A/etcbranch/index',
		},
		// {
		// 	img: 'map/etctingche.png',
		// 	name: 'ETC停车场',
		// 	id: '4'
		// },
		{
			img: 'map/jiayouicon.png',
			name: '加油',
			id: '5',
			path: '/pages_D/refuelingRefilling/index',
		},
	]);
	const ltabList = ref([{
			img: 'img/sfzicon.png',
			name: '收费站',
			id: '1',
		},
		{
			img: 'img/tabcdz.png',
			name: '充电桩',
			id: '2',
		},
		{
			img: 'img/tabfwq.png',
			name: '服务区',
			id: '3',
		},
		{
			img: 'img/tabetc.png',
			name: 'ETC网点',
			id: '4',
		},
		{
			img: 'img/tianqi.png',
			name: '天气',
			id: '5',
		},
		{
			img: 'img/sfzicon.png',
			name: '路线',
			id: '6',
		},
	]);
	const switchtab = (e) => {
		if (e == 6) {
			for (let i = markers.value.length - 1; i >= 0; i--) {
				if (markers.value[i].type !== 'anchor') {
					markers.value.splice(i, 1);
				}
			}
			return;
		}
		if (istab.value == e + 1) {
			return;
		} else {
			istab.value = e + 1;
			for (let i = markers.value.length - 1; i >= 0; i--) {
				if (markers.value[i].type !== 'anchor') {
					markers.value.splice(i, 1);
				}
			}
		}
	};

	const heights = {
		small: uni.upx2px(300), // 下滑：约 40vh
		normal: uni.upx2px(300), // 默认：约 60vh
		large: uni.upx2px(400), // 上滑：约 90vh（留安全距离）
	};
	const popupHeight = ref(heights.normal);
	const isMoving = ref(false); // 是否正在滑动
	let startY = 0; // 触摸起始 Y 坐标
	const huanxinag = () => {
		const lat = currentLat.value;
		const lng = currentLng.value;
		const name = chushiname.value;
		currentLat.value = selectedLocation.value.latitude;
		currentLng.value = selectedLocation.value.longitude;
		chushiname.value = selectedLocation.value.name;
		selectedLocation.value.latitude = lat;
		selectedLocation.value.longitude = lng;
		selectedLocation.value.name = name;
		getRoute();
	};
	const hangletab = () => {
		isnavigation.value = false;
	};
	// 屏幕高度
	const {
		windowHeight
	} = uni.getSystemInfoSync();
	import {
		getDrivingRoute
	} from '@/utils/polyline';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const polyline = ref([]);
	// 存储腾讯地图返回的原始路线数据
	const apiRoutes = ref([]);
	const checkDirection = (deltaY) => {
		if (deltaY < -50) {
			// 上滑：手势向上，deltaY 为负且绝对值大
			popupHeight.value = heights.large;
		} else if (deltaY > 50) {
			// 下滑：手势向下
			popupHeight.value = heights.small;
		} else {
			// 小幅度滑动，回到默认
			popupHeight.value = heights.normal;
		}
	};

	const onTouchStart = (e) => {
		startY = e.touches[0].clientY;
		isMoving.value = true;
	};
	const tianqimap = (e) => {
		markers.value = [...markers.value, ...e];
	};
	const onTouchMove = (e) => {
		// 可开启实时拉伸效果：
		const moveY = e.touches[0].clientY;
		const deltaY = moveY - startY;
		let newHeight = popupHeight.value - deltaY;
		newHeight = Math.max(heights.small, Math.min(heights.large, newHeight));
		popupHeight.value = newHeight;
	};

	/**
	 * 触摸结束
	 */
	const onTouchEnd = (e) => {
		const endY = e.changedTouches[0].clientY;
		const deltaY = endY - startY; // 正数：下滑；负数：上滑
		checkDirection(deltaY);
		// 恢复过渡动画
		setTimeout(() => {
			isMoving.value = false;
		}, 50);
	};
	const addsele = () => {
		scale.value = 15;
		const mapCtx = uni.createMapContext('myMap');

		mapCtx.moveToLocation({
			// 不需要传 latitude/longitude
			// 微信会自动使用最近一次定位（即 getLocation 的结果）
			success: () => {},
			fail: (err) => {},
		});
	};
	const chengtab = (value) => {
		polyline.value = polyline.value.map((route, index) => ({
			points: route.points,
			color: index === value ? '#09BABE' : '#5DC476',
			width: 6,
			zIndex: index === value ? 999 : 5,
			arrowLine: true, // 显示箭头
			borderColor: '#ccc',
		}));
	};
	const formatDistance = (value) => {
		if (value < 1000) {
			return `${Math.round(value)}米`;
		} else {
			return `${(value / 1000).toFixed(1)}公里`;
		}
	};
	const topath = (item) => {
		if (item.path) {
			uni.navigateTo({
				url: item.path,
			});
		}
	};
	const getRoute = async () => {
	    loading.value = true;
	    polyline.value = [];
	    
	    const from = `${currentLat.value},${currentLng.value}`;
	    const to = `${selectedLocation.value.latitude},${selectedLocation.value.longitude}`;
	    coordinatesfrom.value = from;
	    coordinatesto.value = to;
	    
	    try {
	        const result = await getDrivingRoute({
	            from: from,
	            to: to,
	            key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB'
	        });
	        
	        routelist.value = result.data;
	        
	        if (result && result.data) {
	            // 🎯 关键修改：处理 points 格式并移除鸿蒙不支持的属性
	            const formattedRoutes = result.data.map((route, index) => {
	                // 确保 points 是标准格式 {latitude, longitude}
	                const points = route.path.map(point => ({
	                    latitude: point.lat || point.latitude,
	                    longitude: point.lng || point.longitude
	                }));
	                // #ifdef APP-HARMONY
						return {
							points: points,
							color: index === 0 ? '#09BABE' : '#5DC476',
							width: 6,
							// ❌ 鸿蒙不支持以下属性，需移除或条件编译
							// arrowLine: true,  
							// borderColor: '#ccc',
							// zIndex: index === 0 ? 999 : 5
						};
					// #endif
	                // #ifdef MP-WEIXIN
	                	return {
	                		points: points,
	                		color: index === 0 ? '#09BABE' : '#5DC476',
	                		width: 6,
	                		arrowLine: true,  
	                		borderColor: '#ccc',
	                		zIndex: index === 0 ? 999 : 5
	                	};
	                // #endif
	            });
	            
	            // 使用 nextTick 确保 DOM 更新后再赋值
	            nextTick(() => {
	                polyline.value = formattedRoutes;
	            });
	            
	            isnavigation.value = true;
	            
	            // 更新 markers（保持原有逻辑）
	            markers.value = markers.value.filter(item => item.id === 999 || item.id === 777);
	            markers.value.push(
	                {
	                    id: 999,
	                    latitude: selectedLocation.value.latitude,
	                    longitude: selectedLocation.value.longitude,
	                    iconPath: imgUrl + 'map/zhong.png',
	                    width: 40,
	                    height: 40,
	                    type: 'anchor',
	                    anchor: { x: 0.5, y: 1 },
	                    callout: {
	                        content: '目的地',
	                        display: 'ALWAYS',
	                        borderRadius: 6,
	                        bgColor: '#000',
	                        color: '#fff',
	                        fontSize: 12,
	                        padding: 5
	                    }
	                },
	                {
	                    id: 777,
	                    latitude: currentLat.value,
	                    longitude: currentLng.value,
	                    type: 'anchor',
	                    iconPath: imgUrl + 'map/qi.png',
	                    width: 40,
	                    height: 40,
	                    anchor: { x: 0.5, y: 1 },
	                    callout: {
	                        content: '起点',
	                        display: 'ALWAYS',
	                        borderRadius: 6,
	                        bgColor: '#000',
	                        color: '#fff',
	                        fontSize: 12,
	                        padding: 5
	                    }
	                }
	            );
	            // #ifdef APP-HARMONY
				// #endif
	            // #ifdef MP-WEIXIN
					// 调整视野
					setTimeout(() => {
					    const mapCtx = uni.createMapContext('myMap');
					    mapCtx.includePoints({
					        points: [
					            { latitude: currentLat.value, longitude: currentLng.value },
					            { latitude: selectedLocation.value.latitude, longitude: selectedLocation.value.longitude }
					        ],
					        padding: [20, 20, 20, 20]
					    });
					}, 300);
				// #endif
	            
				
				
	            console.log('-0-00-0--0-00--0',currentLat.value,currentLng.value);
	        } else {
	            uni.showToast({
	                title: result.message || '路线规划失败',
	                icon: 'none'
	            });
	        }
	    } catch (err) {
	        console.error('路线获取异常:', err);
	        uni.showToast({ title: '网络异常', icon: 'none' });
	    } finally {
	        loading.value = false;
	    }
	};
	// const getRoute = async () => {
	// 	loading.value = true;
	// 	polyline.value = [];
	// 	const from = `${currentLat.value},${currentLng.value}`; // 你的起点
	// 	const to = `${selectedLocation.value.latitude},${selectedLocation.value.longitude}`;
	// 	coordinatesfrom.value = from;
	// 	coordinatesto.value = to;
	// 	const params = {
	// 		from: from,
	// 		to: to,
	// 		// key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB'
	// 		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB',
	// 	};
	// 	try {
	// 		const result = await getDrivingRoute(params);
	// 		routelist.value = result.data;
	// 		if (result) {
	// 			polyline.value = result.data.map((route, index) => ({
	// 				points: route.path,
	// 				color: index === 0 ? '#09BABE' : '#5DC476',
	// 				width: 6,
	// 				zIndex: index === 0 ? 999 : 5,
	// 				arrowLine: true, // 显示箭头
	// 				borderColor: '#ccc',
	// 			}));
	// 			isnavigation.value = true;
	// 			markers.value = markers.value.filter((item) => item.id == 999);
	// 			markers.value = markers.value.filter((item) => item.id == 777);
	// 			markers.value.push({
	// 				id: 999, // 唯一 ID
	// 				latitude: selectedLocation.value.latitude,
	// 				longitude: selectedLocation.value.longitude,
	// 				iconPath: imgUrl + 'map/zhong.png', // 自定义图标路径
	// 				width: 40, // 图标宽度
	// 				height: 40, // 图标高度
	// 				type: 'anchor',
	// 				anchor: {
	// 					x: 0.5,
	// 					y: 1,
	// 				}, // 锚点：底部居中（推荐）
	// 				callout: {
	// 					content: '目的地',
	// 					display: 'ALWAYS',
	// 					borderRadius: 6,
	// 					bgColor: '#000',
	// 					color: '#fff',
	// 					fontSize: 12,
	// 					padding: 5,
	// 				},
	// 			}, {
	// 				id: 777, // 唯一 ID
	// 				latitude: currentLat.value,
	// 				longitude: currentLng.value,
	// 				type: 'anchor',
	// 				iconPath: imgUrl + 'map/qi.png', // 自定义图标路径
	// 				width: 40, // 图标宽度
	// 				height: 40, // 图标高度
	// 				anchor: {
	// 					x: 0.5,
	// 					y: 1,
	// 				}, // 锚点：底部居中（推荐）
	// 				callout: {
	// 					content: '起点',
	// 					display: 'ALWAYS',
	// 					borderRadius: 6,
	// 					bgColor: '#000',
	// 					color: '#fff',
	// 					fontSize: 12,
	// 					padding: 5,
	// 				},
	// 			});
	// 			const mapCtx = uni.createMapContext('myMap');

	// 			// ✅ 定义要包含的点：起点 + 终点
	// 			const points = [{
	// 					latitude: currentLat.value,
	// 					longitude: currentLng.value,
	// 				},
	// 				{
	// 					latitude: selectedLocation.value.latitude,
	// 					longitude: selectedLocation.value.longitude,
	// 				},
	// 			];

	// 			// ✅ 让地图视野自动包含这两个点
	// 			mapCtx.includePoints({
	// 				points: points,
	// 				padding: [20, 20, 20, 20], // 避免被控件遮挡
	// 				success: () => {},
	// 				fail: (err) => {},
	// 			});
	// 		} else {
	// 			errorMessage.value = result.message || '未知错误';
	// 			uni.showToast({
	// 				title: result.message || '路线失败',
	// 				icon: 'none',
	// 				duration: 3000,
	// 			});
	// 		}
	// 	} catch (err) {
	// 		console.error('异常:', err);
	// 	} finally {
	// 		loading.value = false;
	// 	}
	// };
	// 打开地图选择位置
	const openMap = () => {
		uni.chooseLocation({
			success: (res) => {
				if (res.name) {
					selectedLocation.value = {
						name: res.name || '未知地点',
						address: res.address || res.formattedAddress || '无详细地址',
						latitude: res.latitude,
						longitude: res.longitude,
					};
					getRoute();
				}
			},
			fail: (err) => {
				if (err.errMsg.includes('cancel')) {
					console.log('用户取消选择');
				} else {
					uni.showToast({
						title: '获取位置失败',
						icon: 'none',
					});
				}
			},
		});
	};
	// 其实位置打开地图选择位置
	const openMaps = () => {
		uni.chooseLocation({
			success: (res) => {
				if (res.name) {
					(chushiname.value = res.address || res.formattedAddress || '无详细地址'),
					(currentLat.value = res.latitude),
					(currentLng.value = res.longitude);
					if (selectedLocation.value.longitude) {
						getRoute();
					}
				}
			},
			fail: (err) => {
				if (err.errMsg.includes('cancel')) {
					console.log('用户取消选择');
				} else {
					uni.showToast({
						title: '获取位置失败',
						icon: 'none',
					});
				}
			},
		});
	};

	// 调用 includePoints 自动缩放地图
	// const fitMapToRoute = (routePoints) => {
	// 	if (!routePoints || routePoints.length === 0) return;

	// 	mapContext.includePoints({
	// 		points: routePoints, // 所有路线坐标
	// 		padding: [50, 30, 50, 30], // 上右下左留边距，避免被按钮遮挡
	// 		animationDuration: 1000 // 1秒动画过渡
	// 	});
	// }
	// 所有路线的坐标点，用于自动缩放视野
	// const includePoints = computed(() => {
	// 	if (apiRoutes.value.length === 0) return []
	// 	const points = []
	// 	polylineList.value.forEach(poly => {
	// 		points.push(...poly.points)
	// 	})
	// 	return points
	// })

	// 设置当前高亮路线
	// const setActiveRoute = (index) => {
	// 	activeIndex.value = index

	// 	// 视野聚焦到该路线
	// 	const points = polylineList.value[index].points
	// 	const mapCtx = uni.createMapContext('routeMap')
	// 	mapCtx.includePoints({
	// 		points,
	// 		padding: [20, 20, 20, 20]
	// 	})
	// }
	// 获取服务区数据
	const fetchData = async () => {
		try {
			const res = await getgetServiceAreaPageList({
				latitude: currentLat.value,
				longitude: currentLng.value,
				pageNum: 1,
				pageSize: 999999,
			});
			const newMarkers = res.rows.map((shop, index) => ({
				id: shop.id, // 确保id唯一且不为0（0用于用户位置）
				latitude: shop.latitude,
				longitude: shop.longitude,
				title: shop.serviceAreaName,
				delid: shop.id,

				iconPath: imgUrl + 'map/fuwuqudingwei-icon.png', // 可替换为自己的图标
				width: 20,
				height: 20,
				type: 'fuq',
				callout: {
					content: shop.serviceAreaName,
					color: '#333',
					fontSize: 12,
					borderRadius: 4,
					bgColor: '#fff',
					padding: 5,
					display: 'BYCLICK',
				},
			}));
			markers.value = [...markers.value, ...newMarkers];
			scale.value = 10;
		} catch (error) {} finally {}
	};

	// 获取收费站数据
	const sfzchData = async () => {
		try {
			const res = await getgetTollStationByIdList({
				latitude: currentLat.value,
				longitude: currentLng.value,
				pageNum: 1,
				pageSize: 999999,
			});
			const newMarkers = res.rows.map((shop, index) => ({
				id: shop.id, // 确保id唯一且不为0（0用于用户位置）
				latitude: shop.latitude,
				longitude: shop.longitude,
				title: shop.tollStationName,
				delid: shop.id,
				iconPath: imgUrl + 'map/sfzdingwei-icon.png', // 可替换为自己的图标
				width: 24,
				height: 24,
				type: 'sfz',
				callout: {
					content: shop.tollStationName,
					color: '#333',
					fontSize: 12,
					borderRadius: 4,
					bgColor: '#fff',
					padding: 5,
					display: 'BYCLICK',
				},
			}));
			markers.value = [...markers.value, ...newMarkers];
			scale.value = 10;
		} catch (error) {} finally {}
	};
	// 获取etc数据
	const etcchData = async () => {
		try {
			const res = await getlistPageEtcBranchList({
				latitude: currentLat.value,
				longitude: currentLng.value,
				pageNum: 1,
				pageSize: 999999,
				type: 0,
			});
			const newMarkers = res.data.list.map((shop, index) => ({
				id: shop.id, // 确保id唯一且不为0（0用于用户位置）
				latitude: shop.latitude,
				longitude: shop.longitude,
				title: shop.name,
				delid: shop.id,
				iconPath: imgUrl + 'map/etcdianwei-icon.png', // 可替换为自己的图标
				width: 24,
				height: 24,
				type: 'etc',
				callout: {
					content: shop.name,
					color: '#333',
					fontSize: 12,
					borderRadius: 4,
					bgColor: '#fff',
					padding: 5,
					display: 'BYCLICK',
				},
			}));
			markers.value = [...markers.value, ...newMarkers];
			scale.value = 10;
		} catch (error) {} finally {}
	};

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
					fail: reject,
				});
			});
			console.log(locationRes, 'locationReslocationReslocationReslocationRes');
			chushiname.value = uni.getStorageSync('address').standardAddress || '';
			currentLat.value = uni.getStorageSync('address').lat;
			currentLng.value = uni.getStorageSync('address').lng;

			// 添加用户位置标记
			markers.value = [{
				id: 0,
				latitude: currentLat.value,
				longitude: currentLng.value,
				iconPath: imgUrl + 'map/qi.png', // 可替换为自己的图标
				width: 30,
				height: 30,
				zIndex: 10,
			}, ];
		} catch (err) {
			console.error('初始化地图失败:', err);
			errorMsg.value = '获取位置失败，请检查权限设置';
			chushiname.value = uni.getStorageSync('address').standardAddress || '';
			currentLat.value = uni.getStorageSync('address').lat;
			currentLng.value = uni.getStorageSync('address').lng;
		} finally {
			loading.value = false;
		}
	};
	const haedfwq = () => {
		if (showfuq.value == 1) {
			showfuq.value = 2;
			fetchData();
		} else {
			markers.value = markers.value.filter((item) => item.type !== 'fuq');
			showfuq.value = 1;
		}
	};
	const haedsfz = () => {
		if (showsfz.value == 1) {
			showsfz.value = 2;
			sfzchData();
		} else {
			markers.value = markers.value.filter((item) => item.type !== 'sfz');
			showsfz.value = 1;
		}
	};
	const haedetc = () => {
		if (showetc.value == 1) {
			showetc.value = 2;
			etcchData();
		} else {
			markers.value = markers.value.filter((item) => item.type !== 'etc');
			showetc.value = 1;
		}
	};
	// 添加商店标记到地图
	const addShopMarkers = (shops) => {
		const newMarkers = shops.map((shop, index) => ({
			id: index + 1, // 确保id唯一且不为0（0用于用户位置）
			latitude: shop.location.lat,
			longitude: shop.location.lng,
			title: shop.title,
			iconPath: imgUrl + 'map/qidian.png', // 可替换为自己的图标
			width: 24,
			height: 24,
			callout: {
				content: shop.title,
				color: '#333',
				fontSize: 12,
				borderRadius: 4,
				bgColor: '#fff',
				padding: 5,
				display: 'BYCLICK',
			},
		}));

		// 保留用户位置标记，添加商店标记

		markers.value = [...markers.value, ...newMarkers];
	};

	// 处理标记点击
	const handleMarkerTap = (e) => {
		console.log(e, 'eeeeeeeeeeeeeeeeeee');
		// ✅ 根据 id 找到原始数据
		const markerId = e.detail.markerId;
		const clickedMarker = markers.value.find((m) => m.id === markerId );
		console.log(clickedMarker, 'sclickedMarker');
		if (clickedMarker.type == 'tq') {
			uni.navigateTo({
				url: `/pages_A/weather/index?coordinate=${clickedMarker.locationId}&district=${clickedMarker.title}&city=${clickedMarker.city}`,
			});
		} 
		if (clickedMarker.type == 'fuq') {
			uni.navigateTo({
				url: '/pages_A/stationDetails/index?id=' + clickedMarker.delid,
			});
		}
		if (clickedMarker.type == 'sfz') {
			// uni.navigateTo({
			//   url: '/pages_A/stationDetails/index?id=' + clickedMarker.delid
			// })
		}
		if (clickedMarker.type == 'cdz') {
			uni.navigateTo({
				url: '/pages_A/chargingPiles/queryDetail?id=' + clickedMarker.delid,
			});
		}

		console.log('被点击的 marker 信息:', e.detail.markerId, clickedMarker, clickedMarker.locationId);
	};

	// 导航到商店详情（这里只是示例，实际项目中可跳转到详情页）
	const navigateToShop = (shop) => {
		showToast({
			title: `你选择了: ${shop.title}`,
			duration: 2000,
		});

		// 实际项目中可以跳转到详情页
		// uni.navigateTo({
		//   url: `/pages/shop/detail?id=${shop.id}`
		// });
	};

	// 页面加载时初始化地图
	onMounted(() => {
		initMap();
		getWeatherNow();
	});
</script>

<style scoped lang="scss">
	.tab-header {
		position: absolute;
		top: 126rpx;
		left: 30rpx;
		z-index: 999;
		width: 90%;
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;

		.tab-header-card {
			flex: 0 0 auto;
			width: 170rpx;
			height: 60rpx;
			background: #ffffff;
			box-shadow: 0rpx 20rpx 30rpx 0rpx rgba(49, 58, 80, 0.1);
			border-radius: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 20rpx;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 15rpx;
			}
		}
	}

	.tabtext1 {
		font-weight: bold;
		font-size: 22rpx;
		color: #000000;
	}

	.tabtext2 {
		font-weight: 800;
		font-size: 22rpx;
		color: var(--primary-color);
	}

	.active {
		color: var(--primary-color);
	}

	.leb-box {
		width: 690rpx;
		height: 284rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		display: flex;
		flex-wrap: wrap;
		padding: 10rpx 0;
		box-sizing: border-box;

		.leb-cord {
			width: 120rpx;
			height: 136rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-right: 14rpx;

			image {
				width: 60rpx;
				height: 60rpx;
				margin-bottom: 12rpx;
			}

			text {
				font-size: 24rpx;
				color: #333333;
			}
		}
	}

	.container {
		width: 100%;
		height: 100vh;
		position: relative;
	}

	.map {
		width: 100%;
		height: 100%;
	}

	.loading-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 100;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		padding: 20rpx 40rpx;
		border-radius: 10rpx;
	}

	.loading-text {
		margin-top: 20rpx;
		color: #333;
		font-size: 28rpx;
	}

	.error-message {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		padding: 30rpx;
		border-radius: 10rpx;
		text-align: center;
		z-index: 100;
		width: 600rpx;
	}

	.retry-btn {
		margin-top: 20rpx;
		background-color: #007aff;
		color: #fff;
		padding: 10rpx 20rpx;
		border-radius: 5rpx;
	}

	.shop-list {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: transform 0.3s ease;
		z-index: 90;
		background: linear-gradient(0deg, #ffffff, #fffbf6);
		border-radius: 36rpx 36rpx 0rpx 0rpx;
		background-blend-mode: normal, normal;
		padding: 40rpx 24rpx;
	}

	.foot-list {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: transform 0.3s ease;
		z-index: 999;
	}

	.shop-list.show {
		transform: translateY(0);
	}

	.list-header {
		width: 690rpx;

		border-radius: 10rpx;
		margin-bottom: 14rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 18rpx 18rpx;
		box-sizing: border-box;

		.list-header-1 {
			display: flex;
			align-items: center;
			margin-bottom: 10rpx;
			padding-left: 10rpx;

			text {
				font-size: 28rpx;
				color: var(--primary-color);
				max-width: 500rpx;
				font-weight: bold;
			}
		}

		.list-header-2 {
			margin-bottom: 40rpx;
			margin-left: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.list-header-4 {
				display: flex;
				align-items: center;

				.huaixangtext {
					font-weight: bold;
					font-size: 28rpx;
					color: #000000;
				}
			}

			text {
				font-size: 24rpx;
				color: #999999;
			}
		}

		.list-header-3 {
			width: 650rpx;
			box-sizing: border-box;
			height: 88rpx;
			background-color: #fff;
			border-radius: 30rpx;
			border: 1rpx solid var(--primary-color);
			display: flex;
			align-items: center;
			padding-left: 10rpx;
			box-sizing: border-box;
			box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(238, 140, 0, 0.06);

			text {
				font-size: 28rpx;
				color: #333333;
				max-width: 500rpx;
				font-weight: bold;
			}
		}

		.corie {
			width: 20rpx;
			height: 20rpx;
			background: #fff;
			border-radius: 50%;
			border: 7rpx solid #f6b080;
			margin-right: 20rpx;
			box-sizing: border-box;
		}

		.corie1 {
			width: 20rpx;
			height: 20rpx;
			background: #fff;
			border-radius: 50%;
			border: 7rpx solid var(--primary-color);
			margin-right: 20rpx;
			box-sizing: border-box;
		}
	}

	.title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.close-btn {
		background-color: transparent;
		padding: 10rpx;
	}

	.list-content {
		height: calc(100% - 80rpx);
		padding: 10rpx 0;
	}

	.shop-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #f5f5f5;
	}

	.shop-info {
		flex: 1;
	}

	.shop-name {
		font-size: 30rpx;
		color: #333;
		display: block;
		margin-bottom: 5rpx;
	}

	.shop-address {
		font-size: 24rpx;
		color: #666;
		display: block;
		margin-bottom: 5rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 500rpx;
	}

	.shop-distance {
		font-size: 22rpx;
		color: #007aff;
	}

	.list-btn {
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #007aff;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 80;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
	}

	.search {}

	.custom-search-box {
		width: 90%;
		position: absolute;
		transform: translate(-50%, 0);
		top: 20rpx;
		left: 50%;
		z-index: 100;
		display: flex;
		align-items: center;
		background-color: #fff;
		height: 96rpx;
		border-radius: 30rpx;
		padding-left: 20rpx;
		padding-right: 50rpx;
		box-sizing: border-box;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.06);

		.input {
			flex: 1;
			font-size: 28rpx;
			color: #333;
			padding-right: 10rpx;
		}

		.search-icon {
			margin-left: 10rpx;
			display: flex;
			align-items: center;
		}
	}

	.select-sousu {
		width: 130rpx;
		height: 56rpx;
		background: #f5f5f5;
		border-radius: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 500;
		font-size: 28rpx;
		color: #000000;

		.select-img {
			width: 24rpx;
			height: 24rpx;
			margin-left: 10rpx;
		}
	}

	.use-btn-mz {
		width: 80rpx;

		box-shadow: 0px 1rpx 4rpx 0px rgba(149, 149, 149, 0.52);
		border-radius: 10rpx;
		padding: 14rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 30rpx;
		top: 10%;
	}

	.use-btn {
		width: 80rpx;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0px 1rpx 4rpx 0px rgba(149, 149, 149, 0.52);
		border-radius: 10rpx;
		padding: 14rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 30rpx;
		top: 10%;
		font-size: 22rpx;

		.img {
			width: 40rpx;
			height: 30rpx;
			display: inline-block;
			margin: 5rpx 0 0 10rpx;
		}

		.img1 {
			width: 50rpx;
			height: 40rpx;

			display: inline-block;
			margin: 10rpx 0 0 10rpx;
		}
	}

	.cities {
		width: 80rpx;
		height: 70rpx;
		background: #ffffff;
		box-shadow: 0rpx 20rpx 30rpx 0rpx rgba(49, 58, 80, 0.1);
		border-radius: 20rpx;
		padding: 10rpx 15rpx;
		background: #fff;
		position: absolute;
		left: 30rpx;
		top: 10%;
		color: #000;
		font-weight: bold;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;

		image {
			width: 40rpx;
			height: 30rpx;
		}
	}
</style>