<template>
	<!-- 背景色 -->
	<view class="service_bg" :style="{background:themeStore.themeColors.$pageBgColor}"></view>
	<view class="carlife_page">
		<!-- 导航栏 -->
		<up-navbar :bgColor="themeStore.themeColors.$color2" placeholder :fixed="true">
			<template #left>
				<view class="navleft_box">
					<image class="navleft_box_img" :src="icoUrl + 'fw_locatuon.png'" mode=""></image>
					<view class="navleft_box_info">
						<text class="navleft_box_info_text">当前定位</text>
						<text class="navleft_box_info_text1">{{ address.city }}·{{ address.district }}</text>
					</view>
				</view>
			</template>
			<template #center>
				<text>车生活地图</text>
			</template>
		</up-navbar>

		<!-- 搜索栏 -->
		<view class="search_bar">
			<up-search
				v-model="searchValue"
				placeholder="您有什么想吃的，或者想去的？"
				:showAction="false"
				shape="square"
				bgColor="#fff"
				border-radius="20"
				@search="onSearch"
			/>
			<image class="search_bar_img" :src="icoUrl + 'monkey_mike.png'" mode=""></image>
			<view class="search_bar_btn" :style="{background:themeStore.themeColors.$bgLgColor}" @click="onSearch">
				<text class="search_bar_btn_text">搜索</text>
			</view>
		</view>

		<view class="life_main">
			<!-- 地图模块 -->
			<view class="main_map">
				<map
					:latitude="address.lat"
					:longitude="address.lng"
					:scale="scale"
					v-if="address.lat"
					@regionchange="onRegionChange"
					@markertap="onMarkertap"
					:markers="markers"
					style="width: 702rpx; height: 410rpx"
					id="myMap"
				></map>
			</view>

			<!-- 分类 -->
			<view class="type_box">
				<view class="type_box_item" :style="{marginRight: ((index + 1) % 4) == 0?'0':'20rpx'}" v-for="(item, index) in typeData" :key="index" @click="handleType(index)">
					<!-- <up-checkbox inactiveColor="#909599" :activeColor="themeStore.themeColors.$primaryColor" shape="circle" size="12" disabled :checked="item.chack"> </up-checkbox> -->
					<up-icon :name="`${icoUrl}${item.chack ? 'check-car-icon.png' : 'car_normal1.png'}`" size="12"></up-icon>
					<text :class="{ type_box_item_text: true, active: item.chack }" :style="{color:item.chack?themeStore.themeColors.$primaryColor:'#909599'}">{{ item.title }}</text>
				</view>
			</view>

			<!-- 筛选 -->
			<view class="card_sel">
				<text class="card_sel_text">共检索出</text>
				<text class="card_sel_text card_sel_text1" :style="{color:themeStore.themeColors.$primaryColor}">{{ datalist.length }}</text>
				<text class="card_sel_text card_sel_text2">家店</text>
				<!-- <view class="card_sel_btn">
					<text class="card_sel_btn_text">按最近距离排序</text>
					<image class="card_sel_btn_img" :src="imgUrl + 'static/sj-bottom.png'" mode=""></image>
				</view> -->
			</view>

			<!-- 地址列表 -->
			<view class="goods_item" v-for="(item, index) in datalist" :key="index" @click="navLink(item)">
				<image class="goods_item_img" :src="item.image" mode=""></image>
				<view class="goods_item_r">
					<text class="goods_item_r_title">{{ item.name }}</text>
					<text class="goods_item_r_tag" :style="{color:themeStore.themeColors.$primaryColor,borderColor:themeStore.themeColors.$primaryColor}">{{ getServiceTitleByType(item.type) }}</text>
					<text class="goods_item_r_distance" decode> &lt; {{ item.distance || 0 }}km</text>
					<view class="goods_item_r_info">
						<text class="goods_item_r_info_txt">{{ item.address }}</text>
						<!-- <text class="goods_item_r_info_txt1">￥</text>
						<text class="goods_item_r_info_num">&nbsp;114&nbsp;</text>
						<text class="goods_item_r_info_txt2">起</text> -->
						<image :src="imgUrl + 'yq-dff.png'" class="img" @click.stop="navigateToApp(item)"></image>
					</view>
				</view>
			</view>

			<!-- <text class="more_text">点击加载更多…</text> -->
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { imgUrl } from '../../config';
import { toNav, toBack } from '@/utils/route';
import { onShow, onReady,onLoad } from '@dcloudio/uni-app';
import { postmapServicesList } from '@/api/map.ts';
import { toast } from '@/utils/common';
import { openLocation } from '@/utils/util';
// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);

const searchValue = ref('');
const onSearch = () => {
	getmapServicesList();
	datalist.value = [];
	markers.value = [];
};
const scale = ref(8);
const markers = ref([]);
const typeData = ref([
	{
		chack: true,
		title: '加油',
		id: 1,
	},
	{
		chack: true,
		title: '充电',
		id: 2,
	},
	{
		chack: true,
		title: '车辆检测',
		id: 3,
	},
	{
		chack: true,
		title: '汽车4S店',
		id: 4,
	},
	{
		chack: true,
		title: '汽车维修',
		id: 5,
	},
	{
		chack: true,
		title: '景区门票',
		id: 6,
	},
	{
		chack: true,
		title: '酒店住宿',
		id: 7,
	},
	// {
	// 	chack: false,
	// 	title: '餐饮美食',
	// 	id: 8,
	// },
]);
// 地图上下文
const mapContext = ref(null);
const linkObj = {
	1: '/pages_D/refuelingRefilling/details?merId=',
	2: '/pages_A/chargingPiles/queryDetail?id=',
	3: '/pages_D/inspection/details?merId=',
	4: '/pages_D/newCar/dealerDetail?id=',
	5: '/pages_D/newCar/dealerDetail?id=',
	6: '/pages_B/scenicSpotTicket/detail?id=',
	7: '/pages_B/hotel/hotelDetails?id=',
	8: '/pages_B/dining/diningHome?id=',
};
const navLink = (item) => {
	let route = linkObj[item.type] + item.id;
	if (linkObj[item.type]) {
		toNav(route);
	} else {
		toast('未配置路径');
	}
};

onReady(() => {
	mapContext.value = uni.createMapContext('myMap');
});
const center = ref({});
const getServiceTitleByType = (type) => {
	const map = {
		1: '加油',
		2: '充电',
		3: '车辆检测',
		4: '汽车4S店',
		5: '汽车维修',
		6: '景区门票',
		7: '酒店住宿',
		8: '餐饮美食',
	};
	return map[type] || '其他服务';
};
const datalist = ref([]);
const onRegionChange = (e) => {
	if (e.type === 'end') {
		// 防抖（可选）
		setTimeout(() => {
			mapContext.value.getCenterLocation({
				success: (res) => {
					center.value = {
						lat: res.latitude,
						lng: res.longitude,
					};
					getMapScaleEstimate();
					console.log('中心点更新:', center.value);
				},
				fail: (err) => {
					console.error('获取中心点失败:', err);
				},
			});
		}, 100);
	}
};

// 点击标记点
const onMarkertap = (e) => {
	console.log('点击的定位点', e);
	let item = datalist.value.find((val) => val.id === e.detail.markerId);
	navLink(item);
};

const getMapScaleEstimate = () => {
	mapContext.value.getRegion({
		success: (res) => {
			const { southwest, northeast } = res;
			const latSpan = northeast.latitude - southwest.latitude;
			const lngSpan = northeast.longitude - southwest.longitude;

			// 简单估算：取最大跨度
			const maxSpan = Math.max(Math.abs(latSpan), Math.abs(lngSpan));

			// 根据经验公式估算 scale（需自行校准）
			let estimatedScale;
			if (maxSpan > 10) estimatedScale = 5;
			else if (maxSpan > 5) estimatedScale = 6;
			else if (maxSpan > 1) estimatedScale = 8;
			else if (maxSpan > 0.5) estimatedScale = 10;
			else if (maxSpan > 0.1) estimatedScale = 12;
			else if (maxSpan > 0.05) estimatedScale = 14;
			else if (maxSpan > 0.01) estimatedScale = 16;
			else estimatedScale = 16;

			console.log('估算缩放级别:', estimatedScale);
			scale.value = estimatedScale;
			getmapServicesList();
		},
		fail: (err) => {
			console.warn('getRegion 不支持或失败:', err);
			// 回退到固定值或忽略
		},
	});
};
const handleType = (index) => {
	// typeData.value[index].chack = !typeData.value[index].chack;
	// setTimeout(() => {
	// 	getmapServicesList()
	// }, 100)
	typeData.value[index].chack = !typeData.value[index].chack;
	let arr = [];
	typeData.value.forEach((item) => {
		if (item.chack) {
			arr.push(item.id);
		}
	});
	if (arr.length < 1) {
		toast('最少选择一个');
		typeData.value[index].chack = !typeData.value[index].chack;
	} else {
		setTimeout(() => {
			getmapServicesList();
		}, 100);
	}
};
const getmapServicesList = async () => {
	let arr = [];
	typeData.value.forEach((item) => {
		if (item.chack) {
			arr.push(item.id);
		}
	});
	let params = {
		types: arr,
		keyWord: searchValue.value,
		longitude: address.value.lng,
		latitude: address.value.lat,
		centerLat: center.value.lat,
		centerLng: center.value.lng,
		zoom: scale.value,
		coordType: 1,
		containerW: 350,
		containerH: 170,
	};
	const res = await postmapServicesList(params);
	datalist.value = res.data.list;
	if (res.data.clusters.length) {
		let hasList = res.data.clusters;
		markers.value = hasList.map((item, index) => {
			(item.id = index + 1), (item.width = '27');
			item.height = '32';
			item.latitude = Number(item.lat);
			item.longitude = Number(item.lng);
			item.iconPath = getIconPathByType(item);
			return item;
		});
	}
};
const getIconPathByType = (item) => {
	const point = item.points?.[0];

	// 1. 优先使用自定义 image（如果存在且有效）
	if (point?.image && typeof point.image === 'string' && point.image.trim()) {
		return point.image;
	}

	// 2. 根据 type 判断
	const type = point?.type;

	if (type === 1) {
		return imgUrl + '1buchong-icon.png';
	}

	// 其他类型（2～8）统一用 chongqi-icon.png
	if ([2, 3, 4, 5, 6, 7, 8].includes(type)) {
		return imgUrl + type + 'chongqi-icon.png';
	}

	// 3. 默认兜底图标（可选）
	return imgUrl + '1buchong-icon.png'; // 或者返回 '' 表示不显示图标
};
// 当前定位
const address = ref({});
const getUserAddress = () => {
	address.value = uni.getStorageSync('address');
	center.value = {
		lat: address.value.lat,
		lng: address.value.lng,
	};
	getmapServicesList();
};
const navigateToApp = (item) => {
	openLocation({
		latitude: Number(item.latitude), //维度
		longitude: Number(item.longitude), //经度
		scale: 18, //缩放比例，范围5~18，默认为18
		name: item.name,
	})
};
onLoad(() => {
	getUserAddress();
});
</script>

<style lang="scss" scoped>
.service_bg {
	width: 750rpx;
	height: 725rpx;
	background-image: linear-gradient(to top, #fcfffc, #ecfcef);
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: -1;
}

.carlife_page {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: #fcfffc;
	padding-bottom: 100rpx;

	// 导航栏左侧
	.navleft_box {
		display: flex;
		align-items: center;

		.navleft_box_img {
			width: 48rpx;
			height: 48rpx;
			margin-right: 12rpx;
		}

		.navleft_box_info {
			height: 48rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.navleft_box_info_text {
				font-weight: 400;
				font-size: 20rpx;
				color: #909599;
			}

			.navleft_box_info_text1 {
				font-weight: 400;
				font-size: 24rpx;
				color: #333333;
			}
		}
	}

	// 搜索框
	.search_bar {
		width: 702rpx;
		height: 78rpx;
		background: #ffffff;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 32rpx;
		padding-right: 12rpx;
		box-sizing: border-box;

		.search_bar_img {
			width: 40rpx;
			height: 40rpx;
			margin-right: 24rpx;
		}

		.search_bar_btn {
			width: 97rpx;
			height: 58rpx;
			background-image: linear-gradient(to left, #b2d38a, #80a653);
			border-radius: 16rpx;
			text-align: center;

			.search_bar_btn_text {
				font-weight: 400;
				font-size: 28rpx;
				color: #ffffff;
				text-align: center;
				line-height: 58rpx;
			}
		}
	}

	// 内容区
	.life_main {
		width: 702rpx;
		background: #fafafa;
		box-shadow: 0rpx 0rpx 10rpx 0rpx #d3e7d1;
		border-radius: 32rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;

		// 地图
		.main_map {
			width: 702rpx;
			// height: 345rpx;
			height: 410rpx;
			background-color: #ffffff;
		}

		// 分类
		.type_box {
			width: 702rpx;
			height: 184rpx;
			background: #ffffff;
			display: flex;
			flex-direction: row;
			align-items: center;
			// justify-content: space-between;
			flex-wrap: wrap;
			padding: 24rpx;
			padding-bottom: 4rpx;
			box-sizing: border-box;
			position: relative;
			z-index: 1;
			margin-top:-80rpx;

			.type_box_item {
				width: 148rpx;
				height: 58rpx;
				background: #fafafa;
				border-radius: 12rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-left: 10rpx;
				margin-bottom: 20rpx;
				box-sizing: border-box;

				.type_box_item_text {
					flex: 1;
					text-align: left;
					font-weight: 400;
					font-size: 24rpx;
					color: #909599;
				}

				.active {
					color: #628f2f;
				}
			}
		}

		// 筛选
		.card_sel {
			width: 702rpx;
			height: 76rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding-left: 24rpx;
			padding-right: 24rpx;
			box-sizing: border-box;

			.card_sel_text {
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
			}

			.card_sel_text1 {
				color: #628f2f;
			}

			.card_sel_text2 {
				flex: 1;
			}

			.card_sel_btn {
				display: flex;
				flex-direction: row;
				align-items: center;

				.card_sel_btn_text {
					font-weight: 400;
					font-size: 24rpx;
					color: #333333;
				}

				.card_sel_btn_img {
					width: 14rpx;
					height: 8rpx;
				}
			}
		}

		.goods_item {
			width: 702rpx;
			height: 234rpx;
			background: #ffffff;
			margin-bottom: 20rpx;
			padding-left: 24rpx;
			padding-right: 24rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;

			.goods_item_img {
				width: 186rpx;
				height: 186rpx;
				margin-right: 16rpx;
			}

			.goods_item_r {
				flex: 1 0;
				width: 0;
				height: 186rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.goods_item_r_title {
					font-weight: 400;
					font-size: 28rpx;
					color: #333333;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.goods_item_r_tag {
					width: fit-content;
					height: 32rpx;
					border-radius: 2rpx;
					border-width: 1rpx;
					border-style: solid;
					border-color: #628f2f;
					padding-left: 10rpx;
					padding-right: 10rpx;
					font-weight: 400;
					font-size: 20rpx;
					color: #628f2f;
					line-height: 30rpx;
					box-sizing: border-box;
				}

				.goods_item_r_distance {
					font-weight: 400;
					font-size: 24rpx;
					color: #909090;
				}

				.goods_item_r_info {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;

					.goods_item_r_info_txt {
						flex: 1 0;
						font-weight: 400;
						font-size: 24rpx;
						color: #909090;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.goods_item_r_info_txt1 {
						font-weight: 600;
						font-size: 20rpx;
						color: #ff8b0e;
						line-height: 47rpx;
					}

					.goods_item_r_info_num {
						font-weight: 600;
						font-size: 32rpx;
						color: #ff8b0e;
					}

					.goods_item_r_info_txt2 {
						font-weight: 400;
						font-size: 20rpx;
						color: #909090;
					}
				}
			}
		}

		.more_text {
			font-weight: 400;
			font-size: 28rpx;
			color: #6e6e6e;
			margin-top: 29rpx;
			margin-bottom: 49rpx;
		}
	}
}
.img {
	width: 40rpx;
	height: 40rpx;
}
</style>
