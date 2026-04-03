<template>
	<view class="container" :data-theme="pageTheme">
		<up-sticky>
			<up-navbar title="二手车交易" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			<view class="searchView">
				<up-search placeholder="请输入车辆关键字" v-model="keyword" searchIconColor="#000000" shape="round"
					bgColor="#F5F5F5" @search="searchChange" actionText :showAction="false" @clear="searchChange"></up-search>
				<view class="searchView-but" @click="toNav('/pages_F/appointment/myAppointment?type='+3)">
					我的<br />预约
				</view>
			</view>
		</up-sticky>
		<view class="pageView">
			<!-- 	<up-swiper :list="swiperList" :current="currentNum" 
			  circular height="280rpx" radius='16rpx'
			 @change="swiperChange">
			 </up-swiper>	 -->
			<view class="swiperView">
				<up-swiper :list="swiperList" :current="currentNum" circular height="312rpx" radius='16rpx'
					@change="swiperChange"></up-swiper>
				<view class="swiperView-indicator-num">
					<view :class="['indicator-num-icon',currentNum == index?'activeIcon':'']"
						v-for="(item,index) in swiperList" :key="item"></view>
				</view>
			</view>

			<up-gap height="16"></up-gap>
			<view class="tabView">
				<view class="tabView-item" v-for="(item,index) in tabList" :key="index" @click="toNav(item.jumpPage)">
					<image class="tabView-item-img" lazy-load :src="imgUrl+item.iconUrl"></image>
					<view class="tabView-item-text">{{item.entryName}}</view>
				</view>
			</view>
			<view class="selectView">
				<scroll-view class="selectView-H" scroll-x="true">
					<view class="selectView-item" @click="selectOpen(1)">
						<text class="">{{ brandName?brandName:'品牌' }}</text>
						<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
					</view>
					<view class="selectView-item" @click="selectOpen(2)">
						<text class="">{{basicName || "类型"}}</text>
						<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
					</view>
					<view class="selectView-item" @click="selectOpen(3)">
						<text class="">{{energyName || "能源"}}</text>
						<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
					</view>
					<view class="selectView-item" @click="selectOpen(4)">
						<text class="">{{priceName || "价格"}}</text>
						<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
					</view>
					<view class="selectView-item" @click="selectOpen(5)">
						<text class="">{{listQuery.province || "地区"}}</text>
						<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
					</view>
				</scroll-view>
				<view class="selectView-right" @click="requst">重置</view>
			</view>
			<view class="waterfallView">
				<view class="waterfallView-item" v-for="(item,index) in dataList" :key="index"
					@click="toNav('/pages_D/usedCar/carDetail?id='+item.id)">
					<image class="waterfallView-item-topImg" :src="item.picture" mode="widthFix"></image>
					<view class="waterfallView-item-center">
						<text class="center-name texNoWrap2">{{item.name}}</text>
						<view class="center-text">{{item.mileage}}公里/
							{{ timeFormat(item.upLicenseTime,'yyyy年mm月')}}
						</view>
						<view class="center-price">{{item.price}}万</view>
					</view>
				</view>
			</view>
			<!-- <view class="waterfallView">
				<view>
					<view class="waterfallView-item"  v-for="(item,index) in leftList" :key="index" @click="toNav('/pages_D/usedCar/carDetail?id='+item.id)">
						<image class="waterfallView-item-topImg" :src="item.picture" mode="widthFix"></image>
						<view class="waterfallView-item-center">
							<text class="center-name texNoWrap2">{{item.name}}</text>
							<view class="center-text">{{item.mileage}}公里/ {{item.upLicenseTime}}</view>
							<view class="center-price">{{item.price}}万</view>
						</view>
					</view>
				</view>
				<view>
					<view class="waterfallView-item"  v-for="(item,index) in rightList" :key="index" @click="toNav('/pages_D/usedCar/carDetail?id='+item.id)">
						<image class="waterfallView-item-topImg" :src="item.picture" mode="widthFix"></image>
						<view class="waterfallView-item-center">
							<text class="center-name texNoWrap2">{{item.name}}</text>
							<view class="center-text">{{item.mileage}}公里/ {{item.upLicenseTime}}</view>
							<view class="center-price">{{item.price}}万</view>
						</view>
					</view>
				</view>
			</view> -->
			<ser-empty v-if="!dataList.length"></ser-empty>
		</view>
	</view>
	<up-picker :show="pickShow" :columns="columns" keyName="dictLabel" @close="pickClose" @cancel="pickClose"
		@confirm="pickConfirm"></up-picker>
	<BrandSelectPopup ref="brandSelectRef" type="brand" @change="brandChange"></BrandSelectPopup>
	<up-popup :show="showAddressPicker" round="20" @close="handleCloseAddressPicker">
		<view>
			<Address type="city" :onCallParent="handleCloseAddressPicker" @select-address="handleSelectAddress">
			</Address>
		</view>

	</up-popup>
		<PageDurationTracker pageName="二手车" type='count'/>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import { ref, computed, onMounted } from 'vue';
	import { random, guid, timeFormat } from '@/uni_modules/uview-plus';
	import BrandSelectPopup from '@/components/BrandSelectPopup/index.vue';
	import Address from '@/pages_D/newCar/components/Address.vue';
	import { useCommonStore } from '@/store/modules/common';
	import { listPrOldCarDetail, listPics } from '@/api/oldCar';
	import { getDict } from '@/api/config';
	import { gridMenu, bannerList } from '@/api/car';
	import { imgUrl } from '@/config';
	import type { List } from './types';
	import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app';
	import { toNav, toBack } from '@/utils/route';
	// 假设这是你的图片基础路径（根据实际配置调整）
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const commonState = useCommonStore();
	const brandSelectRef = ref(null);
	const keyword = ref<string>('');
	const brandName = ref('');
	const listQuery = ref({
		pageNum: 1,
		pageSize: 10,
		brandId: '',
		minPrice: undefined,
		maxPrice: undefined,
		energyType: undefined,
		segment: undefined,
		province: undefined,
		city: undefined,
	});
	const cityCode = ref('');
	const provinceCode = ref('');
	const total = ref(0);
	const swiperList = ref([])
	const currentNum = ref(0);

	const tabList = ref([
		{ entryName: '买二手车', iconUrl: `${imgUrl}static/userCar-icon1.png`, jumpPage: './carList' },
		{ entryName: '高价卖车', iconUrl: `${imgUrl}static/userCar-icon2.png`, jumpPage: './sellCar' },
		{ entryName: '上门估价', iconUrl: `${imgUrl}static/userCar-icon3.png`, jumpPage: './appraisal' },
		{ entryName: '以旧换新', iconUrl: `${imgUrl}static/userCar-icon4.png`, jumpPage: './oldForNew' },
	])

	const showAddressPicker = ref(false);
	// 类型
	const options1 = ref([]);
	const options2 = ref([]);
	const options3 = ref([]);

	const pickShow = ref(false);
	const columns = ref([]);
	const selectType = ref(0);
	const priceName = ref('');
	const energyName = ref('');
	const basicName = ref('');
	const address = ref('');

	const uWaterfallRef = ref(null);
	const loadStatus = ref('loadmore');
	const flowList = ref([]);
	const dataList = ref<Array<List>>([]);
	const leftList = computed(() => {
		let arr = []
		for (let i in dataList.value) {
			if ((i % 2) == 0) {
				arr.push(dataList.value[i])
			}
		}

		return arr
	})
	const rightList = computed(() => {
		let arr = []
		for (let i in dataList.value) {
			if ((i % 2) != 0) {
				arr.push(dataList.value[i])
			}
		}
		return arr
	})
	const requst = () => {
		listQuery.value = {
			pageNum: 1,
			pageSize: 10,
			brandId: '',
			minPrice: undefined,
			maxPrice: undefined,
			energyType: undefined,
			segment: undefined,
			province: undefined,
			city: undefined,
		};
		keyword.value=''
		provinceCode.value = '';
		cityCode.value = '';

		priceName.value = '';
		energyName.value = '';
		basicName.value = '';
		brandName.value = '';
		init();
	};
	const swiperChange = (event) => {
		currentNum.value = event.current
	}
	// 筛选打开
	const selectOpen = (type) => {
		selectType.value = type;
		if (type == 1) {
			brandSelectRef.value.open();
		}

		// 类型、能源、价格
		if (type == 2) {
			pickShow.value = true;
			columns.value.push(options3.value);
		}
		if (type == 3) {
			pickShow.value = true;
			columns.value.push(options2.value);
		}
		if (type == 4) {
			pickShow.value = true;
			columns.value.push(options1.value);
		}
		if (type == 5) {
			// showAddressPicker.value = true;
			handleCloseAddressPicker('open');
		}
	};
	const pickClose = () => {
		pickShow.value = false;
		columns.value = [];
	};
	const pickConfirm = (event) => {
		console.log("event", event)
		const { value } = event;
		if (selectType.value == 2) {
			basicName.value = value[0].dictLabel;
			listQuery.value.segment = value[0].dictValue;
		}
		if (selectType.value == 3) {
			energyName.value = value[0].dictLabel;
			listQuery.value.energyType = value[0].dictValue;
		}
		if (selectType.value == 4) {
			priceName.value = value[0].dictLabel;
			const arr = value[0].dictValue.split('-') || [];
			if (arr.length == 2) {
				listQuery.value.minPrice = arr[0];
				listQuery.value.maxPrice = arr[1];
			}
			if (arr.length == 1) {
				listQuery.value.minPrice = arr[0];
				listQuery.value.maxPrice = '';
			}
		}
		init();
		pickClose();
	};
	const handleScrolltolower = () => {
		if (loadStatus.value == 'loadmore') {
			listQuery.value.pageNum++;
			getData();
		}
	}
	const handleCloseAddressPicker = (msg : string) => {
		showAddressPicker.value = false
		if (msg == 'open') {
			showAddressPicker.value = true;
		}
		console.log("showAddressPicker", showAddressPicker.value)
	};
	const handleSelectAddress = (address) => {
		console.log("address", address)
		const { province, city } = address;

		listQuery.value.province = province;
		listQuery.value.city = city;
		cityCode.value = address.code;
		provinceCode.value = address.provinceCode;
		init()
		//   address.value = address
	}
	const brandChange = (event) => {
		brandName.value = event.brandName;
		listQuery.value.brandId = event.brandId;
		init()
	};
	const searchChange = () => {
		init()
	}
	const init = () => {
		listQuery.value.pageNum = 1;
		getData();
	}
	const getData = async () => {
		// let params = {
		// 	pageNum:listQuery.value.pageNum,
		// 	pageSize:listQuery.value.pageSize,
		// 	brandId: listQuery.value.brandId || undefined,
		// 	name: keyword.value || undefined,
		// }
		let params = { ...listQuery.value, name: keyword.value || undefined, }
		try {
			let res : any = await listPrOldCarDetail(params)
			if (res.code == 200) {
				dataList.value = listQuery.value.pageNum == 1 ? res.rows : [...dataList.value, ...res.rows];
				total.value = res.total;
			}
		} catch {
		}
	}

	const getDictList = async () => {
		try {
			const res : any = await getDict('old_car_price_range');
			const res2 : any = await getDict('energy_type');
			const res3 : any = await getDict('segment');
			if (res.code == 200) {
				options1.value = res.data;
			}
			if (res2.code == 200) {
				options2.value = res2.data;
			}
			if (res3.code == 200) {
				options3.value = res3.data;
			}
		} catch {

		}
	};
	const getImges = async () => {
		let res : any = await bannerList('1')
		if (res.code == 200) {
			swiperList.value = res.rows.map(item => item.imageUrl);
		}
	}
	const getMenuData = async () => {
		try {
			const res : any = await gridMenu(2);
			tabList.value = res.rows;
		} catch (err) {
			console.log(err)
		}
	};

	onLoad(() => {
		getImges();
		init();
		getDictList();
		getMenuData();
	});
	onShow(() => {
		if (listQuery.value.province) {
			commonState.selectPopAddress.province = listQuery.value.province;
			commonState.selectPopAddress.city = listQuery.value.city;
			commonState.selectPopAddress.provinceCode = provinceCode.value;
			commonState.selectPopAddress.code = cityCode.value;
		}
	})
	onReachBottom(() => {
		if (listQuery.value.pageNum * listQuery.value.pageSize < total.value) {
			listQuery.value.pageNum++
			getData()
		}
	})
</script>

<style lang="scss" scoped>
	.container {
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
			// background: $color;
			background: var(--primary-color);
			color: #FFFFFF;
			font-size: 24rpx;
			display: inline-block;
			padding: 10rpx 15rpx;
			border-radius: 10rpx;
			margin-left: 20rpx;
		}
	}

	.tabView {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 20rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 25rpx;
		box-sizing: border-box;

		.tabView-item {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.tabView-item-img {
				width: 50rpx;
				height: 50rpx;
			}

			.tabView-item-text {
				margin-top: 24rpx;
				font-weight: 600;
				font-size: 24rpx;
				color: #333333;
			}
		}

	}

	.selectView {
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		box-sizing: border-box;

		.selectView-H {
			width: calc(100% - 100rpx);
			white-space: nowrap;
			display: flex;
			align-items: center;
		}

		.selectView-right {
			width: 90rpx;
			text-align: center;
			font-size: 28rpx;
			color: #666666;
		}

		.selectView-item {
			display: inline-flex;
			background: #FFFFFF;
			font-size: 24rpx;
			font-weight: 400;
			color: #333333;
			padding: 10rpx 16rpx;
			box-sizing: border-box;
			margin-right: 20rpx;
			border-radius: 50rpx;

			text {
				margin-right: 8rpx;
			}
		}
	}

	.waterfallView {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 20rpx;

		.waterfallView-item {
			width: 100%;
			background: #FFFFFF;
			border-radius: 16rpx;
			margin-bottom: 32rpx;

			.waterfallView-item-topImg {
				width: 100%;
				height: 300rpx !important;
				border-radius: 16rpx 16rpx 0 0;
			}

			.waterfallView-item-center {
				padding: 30rpx;
				padding-top: 20rpx;
				box-sizing: border-box;

				.center-name {
					font-size: 30rpx;
					line-height: 50rpx;
					font-weight: 600;
					color: #333333;
				}

				.center-text {
					font-size: 24rpx;
					font-weight: 400;
					color: #A5A5A5;
					padding: 10rpx 0;
				}

				.center-price {
					font-size: 34rpx;
					font-weight: 600;
					color: var(--primary-color);
				}
			}
		}
	}
</style>