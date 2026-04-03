<template>
	<view class="condent" :data-theme="pageTheme" >
		<up-navbar title="新车买卖" bgColor="none" @leftClick="toBack" placeholder :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="fixBg"></view>
		
		<scroll-view scroll-y="true" class="scrollY">
			<up-index-list activeColor="#333333" :index-list="indexList" customNavHeight="88">
				<up-index-item>
					<view class="padd-32">
						<view class="searView">
							<input placeholder="请输入车品牌名称" border="none" v-model="keyword" class='inputbox'
								@input='getCarBrandList'></input>
							<up-icon name="search" size="22" color="#D8D8D8"></up-icon>
						</view>
						<up-gap height="16"></up-gap>
						<view class="swiperView">
							<up-swiper :list="swiperList" :current="currentNum" autoplay  height="312rpx" radius='16rpx'
								@change="swiperChange"></up-swiper>
							<!-- <view class="swiperView-indicator-num">
								<view :class="['indicator-num-icon',currentNum == index?'activeIcon':'']"
									v-for="(item,index) in swiperList" :key="item"></view>
							</view> -->
						</view>
						<up-gap height="16"></up-gap>
						<view class="tabView">
							<view class="tabView-item" v-for="(item,index) in tabList" :key="index"
								@click="toNav(item.jumpPage)">
								<image class="tabView-item-img" :src="imgUrl + item.iconUrl" mode=""></image>
								<view class="tabView-item-text">{{item.entryName}}</view>
							</view>
						</view>
						<up-gap height="20"></up-gap>
						<view class="labelView">
							<view class="labelView-item" v-for="(item,index) in labelList1" :key="index"
								@click="toNav('/pages_D/newCar/carType?name=' + item.name + '&type=2'+'&val='+item.type)">
								{{item.name}}
							</view>
						</view>
						<up-gap height="12"></up-gap>
						<view class="labelView">
							<view class="labelView-item" v-for="(item,index) in labelList2" :key="index"
								@click="toNav('/pages_D/newCar/carType?name=' + item.name + '&type=1'+'&val1='+item.type1 +'&val='+item.type)">
								{{item.name}}
							</view>
						</view>
						<up-gap height="20"></up-gap>
					</view>
				</up-index-item>
			
				<template v-for="(item, index) in listData" :key="index">
					<up-index-item>
						<up-index-anchor class="indText" :text="indexList[index+1]"></up-index-anchor>
						<!-- <view class="indText">{{item.initial}}</view> -->
						<view class="list-cell" v-for="(cell, indesx) in item.items" :key="indesx"
							@click="toPath(cell.id, cell.name)">
							<view class="list-cell-icon">
								<image :src="cell.logo" mode="heightFix"></image>
							</view>
							<view class="list-cell-text">{{cell.name}}</view>
						</view>
						<view style='height:40rpx'></view>
					</up-index-item>
				</template>
			
			</up-index-list>
			
			<view v-if="!listData.length">
				<ser-empty></ser-empty>
			</view>
		</scroll-view>
		
	</view>
	<PageDurationTracker pageName="新车买卖" type='count'/>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import { imgUrl } from '@/config';
	import { prCarBrand } from '@/api/car';
	import { toNav, toBack } from '@/utils/route';
	import { onLoad, onPageScroll, onShow } from '@dcloudio/uni-app';
	import QQMapWX from "../../common/qqmap-wx-jssdk.js"
	import jsonData from '../../../cascaderData.json';
	import { gridMenu, bannerList } from '@/api/car';
	import { listPics } from '@/api/oldCar';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const keyword = ref<string>('')
	const indexList = ref([])
	const listData = ref([])
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});
	const getCarBrandList = async () => {
		listData.value=[]
		let params = {
			name: keyword.value ? keyword.value : ''
		}
		const res = await prCarBrand(params);
		const groupedData : Record<string, typeof listData.value[0]> = {};
		res.rows.forEach(brand => {
			const initial = brand.initial;
			if (!groupedData[initial]) {
				groupedData[initial] = { initial, items: [] };
			}
			groupedData[initial].items.push({
				id: brand.id,
				name: brand.name,
				logo: brand.logo
			});
		});
		listData.value = Object.values(groupedData).sort((a, b) => {
			return a.initial.localeCompare(b.initial);
		});
		const initials = listData.value.map(item => item.initial).sort((a, b) => a.localeCompare(b));
		console.log("过滤的首字母",initials)
		indexList.value = ['选', ...initials];
		
		// if (indexList.value, 9999) {
		// 	indexList.value = ['选', ...initials];
		// } else {
		// 	indexList.value = [];
		// }

	};
	const swiperList = ref([])
	const currentNum = ref(0);

	const tabList = ref([
		{ name: '热销榜', logo: `${imgUrl}static/newCar-icon1.png`, router: '/pages_D/newCar/hostSell' },
		{ name: '经销商', logo: `${imgUrl}static/newCar-icon2.png`, router: '/pages_D/newCar/dealer' },
		{ name: '预约试驾', logo: `${imgUrl}static/newCar-icon3.png`, router: '/pages_D/newCar/myTestDrive' },
		{ name: '市场活动', logo: `${imgUrl}static/newCar-icon4.png`, router: '/pages_D/newCar/marketActivity' },
	])
	const labelList1 = ref([
		{ name: '轿车', type: 'limousine' },
		{ name: 'SUV', type: 'SUV' },
		{ name: 'MPV', type: 'MPV' },
		{ name: '更多条件' }
	])
	const labelList2 = ref([
		{ name: '10万以下', type1: '', type: '10' },
		{ name: '10-15万', type1: '10', type: '15' },
		{ name: '15-20万', type1: '15', type: '20' },
		{ name: '20-25万', type1: '20', type: '25' }
	])
	const swiperChange = (event) => {
		currentNum.value = event.current
	}
	const toPath = (val, name) => {
		uni.navigateTo({
			url: `/pages_D/newCar/brandList?id=${val}&name=${name}`
		});
	}
	// //获取当前位置 //遍历获取code
	// const getUserAddress = () => {
	// 	qqmapsdk.reverseGeocoder({
	// 		success: (res) => {
	// 			console.log('逆地理编码成功:', res);
	// 			uni.setStorageSync('address', res.result.address);
	// 			uni.setStorageSync('location', res.result.location);
	// 		},
	// 		fail: (err) => {
	// 			console.error('逆地理编码失败:', err);
	// 		}
	// 	});
	// }
	const getMenuData = async () => {
		try {
			const res : any = await gridMenu(1);
			tabList.value = res.rows;
		} catch (err) {
			console.log(err)
		}
	};
	const getImges = async () => {
		let res : any = await bannerList('1')
		if (res.code == 200) {
			swiperList.value = res.rows.map(item => item.imageUrl);
		}
	}
	onLoad(() => {
		getImges()
		getCarBrandList()
		getMenuData()
	})
	onShow(() => {
		getImges()
	})
	onPageScroll((e) => {
		console.log(e);
	})
</script>

<style scoped lang="scss">
	.condent {
		background: var(--head-color);
		width: 750rpx;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.scrollY{
		width: 750rpx;
		flex: 1 0;
		height: 0;
	}

	.padd-32 {
		padding: 32rpx;
		box-sizing: border-box;
	}

	.searView {
		width: 100%;
		height: 72rpx;
		background: #FCFCFC;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #EBEBEB;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.fixBg {
		width: 750rpx;
		height: 804rpx;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.swiperView {
		width: 100%;
		height: 312rpx;
		position: relative;

		.swiperView-indicator-num {
			width: 90%;
			position: absolute;
			left: 5%;
			bottom: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			grid-gap: 24rpx;

			.indicator-num-icon {
				width: 24rpx;
				height: 24rpx;
				background: rgba(255, 255, 255, 0.5);
				border-radius: 50%;
			}

			.activeIcon {
				background: #FFFFFF !important;
			}
		}

	}

	.tabView {
		margin: 0 auto;
		width: 568rpx;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 20rpx;

		.tabView-item {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.tabView-item-img {
				width: 128rpx;
				height: 128rpx;
			}

			.tabView-item-text {
				margin-top: 24rpx;
				font-weight: 500;
				font-size: 24rpx;
				color: #666666;
			}
		}

	}

	.labelView {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 16rpx;

		.labelView-item {
			width: 100%;
			height: 72rpx;
			line-height: 72rpx;
			text-align: center;
			background: rgba(241, 240, 239, 0.7);
			border-radius: 8rpx 8rpx 8rpx 8rpx;

			font-weight: 500;
			font-size: 24rpx;
			color: #333333;
		}
	}

	.list-cell {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		height: 100rpx;
		// padding: 20rpx 24rpx;
		padding: 0 32rpx;
		overflow: hidden;
		font-size: 14px;
		line-height: 24px;
		background: #F8F9FB;

		.list-cell-icon {
			width: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				height: 70rpx;
			}
		}

		.list-cell-text {
			font-weight: 700;
			font-size: 28rpx;
			color: #3D3D3D;
			line-height: 28rpx;
		}
	}

	.indText {
		width: 100%;
		height: 64rpx;
		line-height: 64rpx;
		background: linear-gradient(270deg, #F6F5F4 0%, rgba(216, 216, 216, 0) 100%);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		font-weight: 500;
		font-size: 24rpx;
		color: #3D3D3D;
		padding-left: 52rpx;
		box-sizing: border-box;
	}

	::v-deep .u-navbar__content {
		background: none !important;
	}
	.inputbox{
		width: 100%;
	}
</style>