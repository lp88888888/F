<template>
	<view class="page-container" :data-theme="pageTheme">
		<up-sticky :bgColor="navBgColor">
				<up-navbar title="车辆详情"  bgColor='none'
					@leftClick="toBack" placeholder :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		</up-sticky>
		<view class="topView">
			<view class="swimgBox">
				<up-swiper :list="swiperList" :current="currentNum" circular height="360rpx" radius='0'
					@change="swiperChange"></up-swiper>
				<view class="swimgBox-item" v-if="swiperList.length">{{ currentNum + 1}}/{{swiperList.length}}</view>
			</view>
			<!-- <image class="topView-img-s" lazy-load :src="listObj.images"></image> -->
			<!-- <view v-for="(item,index) in listObj.prCarPicsVoList" :key="index">
					<image class="topView-img" lazy-load :src="item.picUrl"></image>
			</view> -->
			<!-- 	<image class="topView-img" lazy-load :src="imgUrl+'del/car_detail.png'"></image> -->
			<!-- <view class="topView-icon">
				<view class="topView-icon-item">
					<text>外观</text>
					<up-icon name="play-right-fill" size="10" color="#666666"></up-icon>
				</view>
				<view class="topView-icon-item">
					<text>660张图</text>
					<up-icon name="play-right-fill" size="10" color="#666666"></up-icon>
				</view>
			</view> -->
		</view>
		<view class="cardT">
			<view class="carXi">
				<view class="carXi-name">{{listObj.name}}</view>
				<view class="carXi-right">
					<view class="carXi-right-priceName">新车价</view>
					<view class="carXi-right-price">{{listObj.price}}万起</view>
				</view>
			</view>
			<up-gap height="16"></up-gap>
			<view class="typeGrid">
				<view class="typeGrid-item">
					<up-icon :name="imgUrl+'static/new-car-detail-icon1.png'" size="40"></up-icon>
					<view class="typeGrid-item-name">{{segmentFun(listObj.segment)}}</view>
					<view class="typeGrid-item-text">级别</view>
				</view>
				<view class="typeGrid-item">
					<up-icon :name="imgUrl+'static/new-car-detail-icon2.png'" size="40"></up-icon>
					<view class="typeGrid-item-name">{{listObj.displacement}}</view>
					<view class="typeGrid-item-text">排量</view>
				</view>
				<view class="typeGrid-item">
					<up-icon :name="imgUrl+'static/new-car-detail-icon3.png'" size="40"></up-icon>
					<view class="typeGrid-item-name">{{listObj.power}}</view>
					<view class="typeGrid-item-text">功率</view>
				</view>
			</view>
			<up-gap height="16"></up-gap>
			<view class="carMx">
				<view class="carMx-item">
					<text class="carMx-item-label">油耗</text>
					<text class="carMx-item-text">{{listObj.fuelConsumption}}</text>
				</view>
				<view class="carMx-item">
					<text class="carMx-item-label">变速箱</text>
					<text class="carMx-item-text">{{listObj.basicIntakeType}}</text>
				</view>
				<view class="carMx-item">
					<text class="carMx-item-label">长宽高(mm)</text>
					<text class="carMx-item-text">{{listObj.specification}}</text>
				</view>
			</view>
		</view>
		<up-gap height="12" bgColor="#F6F5F4"></up-gap>
		<view class="cardT">
			<view class="tabs">
				<view class="tabs-item" v-for="(item,index) in tabsList" :key="index" @click="tabsClick(index)">
					<view :class="['tabs-item-text',tabIndex == index?'tabActive':'']">{{item.name}}</view>
					<view class="tabs-item-icon" v-if="tabIndex == index"></view>
				</view>
			</view>
			<up-gap height="10"></up-gap>
			<view class="cardT-cneter" v-if="tabIndex==0">
				<view class="cardT-cneter-item" v-if="listObj.basicPriceDiscounted != null">
					<text class="cardT-cneter-item-label">经销商报价(原价+降价幅度): </text>
					<text class="cardT-cneter-item-price">{{listObj.basicPriceDiscounted}}万</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">级别:</text>
					<text class="cardT-cneter-item-text">{{segmentFun(listObj.segment)}}</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">发动机型号:</text>
					<text class="cardT-cneter-item-text">{{listObj.basicEngineModel}}</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">车身结构:</text>
					<text class="cardT-cneter-item-text">{{listObj.basicCarBodyMaterial}}</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">最高车速: </text>
					<text class="cardT-cneter-item-text">{{listObj.basicMaximumSpeed}}</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">最大扭矩:</text>
					<text class="cardT-cneter-item-text">{{listObj.basicMaximumTorque}}</text>
				</view>
			</view>
			<view class="cardT-cneter" v-if="tabIndex==1">
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">颜色: </text>
					<text class="cardT-cneter-item-price">{{listObj.basicColor}}</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">轴距 :</text>
					<text class="cardT-cneter-item-text">{{listObj.basicWheelbase}}</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">前轮距:</text>
					<text class="cardT-cneter-item-text">{{listObj.basicFrontTrack}}</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">整备质量:</text>
					<text class="cardT-cneter-item-text">{{listObj.basicCurbWeight}}</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">燃油箱容积: </text>
					<text class="cardT-cneter-item-text">{{listObj.basicFuelTankCapacity}}</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">行李厢容积:</text>
					<text class="cardT-cneter-item-text">{{listObj.basicLuggageVolume}}</text>
				</view>
			</view>
			<view class="cardT-cneter" v-if="tabIndex==2">
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">发动机排量: </text>
					<text class="cardT-cneter-item-text">{{listObj.basicEngineDisplacement}}</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">最大马力: </text>
					<text class="cardT-cneter-item-text">{{listObj.basicMaxHorsepower}}</text>
				</view>
				<view class="cardT-cneter-item">
					<text class="cardT-cneter-item-label">最大功率: </text>
					<text class="cardT-cneter-item-text">{{listObj.basicMaxPower}}</text>
				</view>
			</view>

		</view>
		<up-gap height="12" bgColor="#F6F5F4"></up-gap>
		<view class="jxsView">
			<view class="jxsView-title">经销商</view>
			<DealerList :list="listData"></DealerList>
		</view>
		<up-gap height="12" bgColor="#F6F5F4"></up-gap>
		<view class="jxsView" style="display: none;">
			<view class="jxsView-title">用户评价</view>
			<view class="reviewBox">
				<view v-for="(item,index) in listReview" :key="index">
					<up-line color="#EBEBEB"></up-line>
					<view class="fl-fs-sb itemBox">
						<image class="reviewBox-item-img" :src="imgUrl + 'tx.jpg'" mode=""></image>
						<view class="reviewBox-item">
							<view class="reviewBox-item-info">
								<view class="fl-ce-sb m-b-5">
									<text class="name">{{item.name}}</text>
									<text class="time">2025.05.20</text>
								</view>
								<up-rate count="5" v-model="item.score" size="14" :readonly="true"
									:activeColor="themeStore.themeColors.$primaryColor"></up-rate>
							</view>
							<view class="tetxFont m-t-15">{{ item.content }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fixedBottom">
			<view class="fixedBottom-but"
				@click="pathNav(listObj.prCarBrandVo,listObj.prCarSeriesVo,listObj.prCarTypeVo,listObj.prIndustry4sVo.id,listObj.prIndustry4sVo.name,listObj.prIndustry4sVo.closeTime)">
				预约试驾
			</view>
		</view>
		<up-gap height="90"></up-gap>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	import { onLoad, onShow, onPageScroll } from '@dcloudio/uni-app';
	import { selectNewCarDetail } from '@/api/car';
	import DealerList from './components/DealerList.vue';
	import { toNav, toBack } from '@/utils/route';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	const topBgColor = ref<string>('transparent');

	const tabsList = ref([{ name: '基本信息' }, { name: '车身' }, { name: '发动机' }])
	const tabIndex = ref<number | string>(0)
	const listObj = ref<any>('')
	const locationObj = ref<any>('')
	const listData = ref<any>([])
	const swiperList = ref<any>([])
	const currentNum = ref(0);
	const listReview = ref([]);
	const deaList = ref([])
	const navBgColor = ref('transparent')
	const tabsClick = (index : number | string) => {
		tabIndex.value = index
	}
	onPageScroll((e) => {
		let bag = ''
		if (pageTheme.value == 'green') {
			bag = '#edf8f0'
		} else {
			bag = '#c0e1ff'
		}

		if (e.scrollTop > 10) {
			navBgColor.value = bag
		} else {
			navBgColor.value = 'transparent'
		}

	})
	const swiperChange = (e) => {
		currentNum.value = e.current;
	};
	// 获取车型
	const selectNewCarDetailList = async (seriesId : number | string, lng : number | string = '', lat : number | string = '') => {
		try {
			const res = await selectNewCarDetail(seriesId, lng, lat);
			console.log("车辆详情", res)
			if (res.data) {
				listObj.value = res.data;
				// 避免重复push数据
				if (res.data.prIndustry4sVo) {
					listData.value = [res.data.prIndustry4sVo];
				}
				swiperList.value = res.data.prCarPicsVoList.map(item => item.picUrl);
			}
		} catch (error) {
			console.error('获取车型详情失败：', error);
			// 可添加错误提示，如 uni.showToast({ title: '数据加载失败' })
		}
	};
	const segmentFun = (val) => {
		if (val == 'limousine') {
			return '轿车'
		} else if (val == 'suv') {
			return 'SUV'
		} else if (val == 'mpv') {
			return 'MPV'
		} else {
			return ''
		}
	}
	const pathNav = (aval, baval, caval, id, name,coltime) => {
		uni.navigateTo({
			url: `/pages_D/newCar/myTestDrive?id=${aval.id}&brandId=${baval.id}&carid=${caval.id}&carsid=${id}&carName=${name}`,
		})
		let obj = {
			brandName: aval.name,
			seriesName: baval.name,
			carTypeName: caval.name,
			closeTime:coltime
		}
		uni.setStorageSync('brand', obj);
	}
	onLoad((options) => {
		const dataObj = uni.getStorageSync('address') || { lat: '', lng: '' };
		selectNewCarDetailList(options.id, dataObj.lng, dataObj.lat)
	})
</script>

<style lang="scss" scoped>
	.page-container {
		background: var(--head-color);
		min-height: 100vh;
	}

	.reviewBox {
		padding: 0 25rpx;
		box-sizing: border-box;

		.reviewBox-item-img {
			width: 62rpx;
			height: 62rpx;
		}

		.itemBox {
			padding: 28rpx 0;
			box-sizing: border-box;
		}

		.reviewBox-item {
			flex: 1;
			padding-left: 20rpx;
			box-sizing: border-box;
		}

		.name {
			font-weight: 600;
			font-size: 24rpx;
			color: #333333;
			line-height: 34rpx;
		}

		.time {
			font-weight: 400;
			font-size: 22rpx;
			color: #999999;
			line-height: 30rpx;
		}

		.tetxFont {
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
			line-height: 40rpx;
		}
	}

	.topView {

		.topView-img {
			display: inline-block;
			width: 420rpx;
			height: 210rpx;
			margin: 0 auto;
		}

		.topView-icon {
			position: absolute;
			left: 40rpx;
			bottom: 40rpx;
			z-index: 1;

			width: 260rpx;
			height: 48rpx;
			padding: 0 24rpx;
			box-sizing: border-box;
			background: rgba(255, 255, 255, 0.9);
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.topView-icon-item {
				display: flex;
				align-items: center;
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;

				text {
					margin-right: 10rpx;
				}
			}
		}
	}

	.topView-img-s {
		width: 100%;
		height: 340rpx;
	}

	.cardT {
		width: 100%;
		background: #FFFFFF;
		padding: 20rpx 32rpx;
		box-sizing: border-box;

		.carXi {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			padding: 12rpx 8rpx;
			box-sizing: border-box;

			.carXi-name {
				width: 448rpx;
				height: 120rpx;
				font-weight: 700;
				font-size: 32rpx;
				color: #333333;
				line-height: 60rpx;
			}

			.carXi-right {}

			.carXi-right-priceName {
				font-weight: 400;
				font-size: 28rpx;
				color: var(--primary-color);
			}

			.carXi-right-price {
				font-weight: 700;
				font-size: 36rpx;
				color: var(--primary-color);
				line-height: 60rpx;
			}
		}

		.typeGrid {
			width: 100%;
			height: 240rpx;
			background: var(--label-color);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;

			.typeGrid-item {
				min-width: 120rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.typeGrid-item-name {
					font-weight: 700;
					font-size: 32rpx;
					line-height: 32rpx;
					color: #333333;
					padding: 24rpx 0 10rpx 0;
				}

				.typeGrid-item-text {
					font-weight: 400;
					font-size: 24rpx;
					line-height: 24rpx;
					color: #666666;
				}
			}


		}

		.carMx {
			padding: 0 20rpx;
			box-sizing: border-box;

			.carMx-item {
				padding: 20rpx 0;
				box-sizing: border-box;

				.carMx-item-label {
					font-weight: 400;
					font-size: 28rpx;
					color: #666666;
					margin-right: 10rpx;
				}

				.carMx-item-text {
					font-weight: 600;
					font-size: 32rpx;
					color: #333333;
				}
			}
		}

		.tabs {
			padding: 0 20rpx;
			box-sizing: border-box;

			.tabs-item {
				margin-right: 60rpx;
				display: inline-block;
				height: 70rpx;
				position: relative;

				.tabs-item-text {
					font-weight: 500;
					font-size: 32rpx;
					color: #666666;
					line-height: 60rpx;
				}

				.tabActive {
					font-weight: 700;
					color: #333333;
				}

				.tabs-item-icon {
					width: 70%;
					height: 8rpx;
					background: var(--primary-color);
					border-radius: 4rpx 4rpx 4rpx 4rpx;
					position: absolute;
					left: 15%;
					bottom: 0;
				}
			}
		}

		.cardT-cneter {
			width: 100%;
			background: var(--label-color);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			padding: 20rpx 22rpx;
			box-sizing: border-box;
			font-size: 28rpx;

			line-height: 28rpx;

		}

		.cardT-cneter-item {
			padding: 20rpx 0;
			box-sizing: border-box;
			display: flex;
			align-items: center;
		}

		.cardT-cneter-item-label {
			font-weight: 400;
			color: #666666;
			margin-right: 10rpx;
		}

		.cardT-cneter-item-price {
			font-weight: 700;
			color: var(--primary-color);
		}

		.cardT-cneter-item-text {
			font-weight: 700;
			color: #333333;
		}

	}

	.jxsView {
		width: 100%;
		background: #FFFFFF;
		padding: 0 20rpx;
		box-sizing: border-box;

		.jxsView-title {
			padding: 40rpx 32rpx 0 32rpx;
			box-sizing: border-box;
			font-weight: 700;
			font-size: 32rpx;
			color: #333333;
		}
	}

	.fixedBottom {
		position: fixed;
		z-index: 99;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 160rpx;
		background: #FFFFFF;
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.03);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		border: 2rpx solid rgba(0, 0, 0, 0.1);
		padding-top: 26rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;

		.fixedBottom-but {
			width: 320rpx;
			height: 96rpx;
			line-height: 96rpx;
			text-align: center;
			background: var(--primary-color);
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			font-weight: 700;
			font-size: 32rpx;
			color: #FFFFFF;
		}
	}

	.swimgBox {
		width: 100%;
		height: 380rpx;
		position: relative;

		.swimgBox-item {
			position: absolute;
			right: 48rpx;
			bottom: 40rpx;
			z-index: 1;
			// width: 100rpx;
			padding: 0 22rpx;
			box-sizing: border-box;
			height: 48rpx;
			background: rgba(255, 255, 255, 0.9);
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			font-weight: 400;
			font-size: 24rpx;
			color: #999999;
			line-height: 48rpx;
			text-align: center;
		}
	}
</style>