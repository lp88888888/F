<template>
	<view class="toll-container">
		<!-- 固定头部 -->
		<view class="topCon-s hCon" :class="{ absolute: isAbsolute }">
			<!-- 搜索框 -->
			<view class="searchBg-s">
				<image class="icSearch-s" :src="imgUrl + 'map/sosuo.png'"></image>
				<input
					class="texSearchTip-s"
					placeholder="请输入ETC网点关键字"
					@input="inputValue"
					type="text"
					confirm-type="search"
					:value="keyWords"
				/>
			</view>

			<!-- 标签切换 -->
			<view class="change-tab">
				<view v-for="tab in tabs" :key="tab.index" :class="{ active: changeIndex === tab.index }" @click="changeIndex1(tab.index)">
					<text>{{ tab.label }}</text>
					<text></text>
				</view>
			</view>
		</view>

		<!-- 内容区域 -->
		<view v-if="stationList.length > 0" class="etc-list">
			<view v-for="(item, index) in stationList" :key="index" class="etc-item" @click="goStation(index)">
				<view>
					<text class="texNoWrap">{{ item.serviceAreaName || item.tollStationName || item.name }}</text>
					<text class="texNoWrap">{{ item.address || item.tollStationAddress }}</text>
				</view>
				<view class="etc-icon" @click.stop="openAdd(item)">
					<image :src="imgUrl + 'img/daohang.png'" />
					<view>{{ item.distance ? item.distance : '0km' }}</view>
				</view>
			</view>
		</view>
           <view v-if="stationList.length==0">
           	<ser-empty></ser-empty>
           </view>
		<!-- 空状态 -->
	</view>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { onLoad, onPageScroll, onReachBottom } from '@dcloudio/uni-app';
import { getlistPageRingCityNetwork } from '@/api/map';
import { openAPPLocation ,openLocation} from '@/utils/util';
// 引入工具和 API
// import networkAPIService from '@/networkService/networkAPIService'
// import dataApi from '@/networkService/dataApi'
// import util from '@/utils/util'
// import mapUtil from '@/utils/mapUtil'

// 数据定义
import { imgUrl } from '../../config';
const keyWords = ref('');
const changeIndex = ref(1); // 当前选中的标签
const page = ref(1);
const lastPage = ref('');
const stationList = ref([]);
const noContShow = ref(false);
const center = ref({
	latitude: uni.getStorageSync('address').lat,
	longitude: uni.getStorageSync('address').lng,
});
const isAbsolute = ref(false); // 是否吸顶

// 标签数据
const tabs = [
	{
		index: 1,
		label: '绕城包年网点',
	},
	{
		index: 2,
		label: '收费站网点',
	},
	{
		index: 3,
		label: '服务区网点',
	},
];

// 页面加载
onLoad((options) => {
	if (options.latitude && options.longitude) {
		center.value = {
			latitude: options.latitude,
			longitude: options.longitude,
		};
	}
	getList();
});

// 页面滚动监听
onPageScroll(({ scrollTop }) => {
	isAbsolute.value = scrollTop > 0;
});

// 上拉触底
onReachBottom(() => {
	if (page.value > lastPage.value) {
		return;
	}
	getList();
});

// 输入框变化
const inputValue = (e) => {
	page.value = 1;
	stationList.value=[]
	keyWords.value = e.detail?.value || '';
	getList()
};

// 搜索
const search = () => {
	page.value = 1;
	lastPage.value = '';
	stationList.value = [];
	getList();
};
// 切换标签
const changeIndex1 = (index) => {
	page.value = 1;
	lastPage.value = '';
	stationList.value = [];
	changeIndex.value = index;
	getList();
};

// 跳转详情页
const goStation = (index) => {
	const item = stationList.value[index];
	if (changeIndex.value === 1) return;

	let id = item.id;
	if (changeIndex.value === 3) {
		if (id.slice(0, 2) === 'ST') return;
	}

	uni.navigateTo({
		url: '/pages/trip/shop/station?id=' + id,
	});
};

// 打开地图
const openAdd = (item) => {
	// #ifdef MP-WEIXIN
	openLocation({
		latitude: Number(item.latitude), //维度
		longitude: Number(item.longitude), //经度
		scale: 18, //缩放比例，范围5~18，默认为18
		name: item.name,
	});
	// #endif
	// #ifdef APP
	openAPPLocation({
		endLocation: {
			longitude: item.longitude,
			latitude: item.latitude,
			address: item.name,
		},
	});
	// #endif
};

// 获取列表数据
const getList = async () => {
	const params = {
		latitude: center.value.latitude,
		longitude: center.value.longitude,
		pageNum: page.value,
		pageSize: 10,
		type: changeIndex.value,
		condition: keyWords.value,
	};
	const res = await getlistPageRingCityNetwork(params);
	const records = res.data.list || [];
	stationList.value = [...stationList.value, ...records];
	page.value += 1;
	lastPage.value = res.data.list;
	if (res.data.total === 0 && page.value === 2) {
	}
};
</script>
<style lang="scss" scoped>
page {
	background-color: #f0f0f2;
}

.toll-container {
	width: 100%;
	position: relative;
}

.topCon-s {
	padding: 0 24rpx;
	width: 100%;
	box-sizing: border-box;
	background: #fff;
}

.hCon {
	display: flex;
	flex-direction: column;
}

.vCon {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.msgTex {
	font-size: 28rpx;
	color: #333333;
}

.searchBg-s {
	background-color: #f0f0f0;
	border-radius: 10rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
}

.icSearch-s {
	width: 30rpx;
	height: 30rpx;
	margin-left: 26rpx;
	margin-right: 30rpx;
}

.texSearchTip-s {
	font-size: 28rpx;
	color: #333;
	min-width: 80%;
	height: 80rpx;
}

.change-tab {
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: flex-end;
	height: 100rpx;
	padding-bottom: 15rpx;
}

.change-tab .active > text:nth-child(2) {
	background-color: $color;
}

.change-tab .active > text:nth-child(1) {
	color: $color;
}

.change-tab > view {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 100rpx;
}

.change-tab > view:last-child {
	margin: 0 !important;
}

.change-tab > view > text:nth-child(1) {
	font-size: 28rpx;
	color: #333333;
	margin-bottom: 10rpx;
}

.change-tab > view > text:nth-child(2) {
	display: inline-block;
	width: 60rpx;
	height: 6rpx;
	background: transparent;
	border-radius: 6rpx;
}

.absolute {
	position: fixed;
	top: 0;
	left: 0;
	box-shadow: 0 12rpx 16rpx 0 rgba(0, 0, 0, 0.1);
	z-index: 1;
	background: #fff;
}

.etc-list {
	width: 100%;
	padding: 0 22rpx 22rpx;
	background-color: #fff;
	box-sizing: border-box;
	margin-top: 14rpx;
}

.etc-item {
	border-bottom: solid 1rpx #e1e1e1;
	width: 100%;
	height: 150rpx;
	display: flex;
	justify-content: space-between;
	padding: 30rpx 0;
	box-sizing: border-box;
}

.etc-item > view:nth-child(1) {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.etc-item > view:nth-child(1) > text:nth-child(1) {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
}

.etc-item > view:nth-child(1) > text:nth-child(2) {
	font-size: 24rpx;
	color: #666;
	font-weight: bold;
}

.etc-icon {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.etc-icon image {
	width: 45rpx;
	height: 45rpx;
	margin-bottom: 12rpx;
}

.etc-icon view {
	font-size: 24rpx;
	letter-spacing: 0;
	color: #333333;
}

.etc-item:last-child {
	border: none;
}
</style>
