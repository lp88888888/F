<template>
	<view class="page-container" :data-theme="pageTheme" >
		<up-navbar title="" bgColor='transparent' @leftClick="toBack" :placeholder="false" :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="swimgBox">
			<up-swiper :list="swiperList" :current="currentNum" circular height="640rpx" radius='0'
				@change="swiperChange"></up-swiper>
			<view class="swimgBox-item" v-if="swiperList.length">{{ currentNum + 1}}/{{swiperList.length}}</view>
		</view>
		<view class="pageView" v-if="detail.id">
			<view class="topBack"></view>
			<view class="topCard">
				<view class="topCard-price m-b-20">{{detail.price}}万起</view>
				<view class="topCard-price2 m-b-20">经销商报价：{{detail.basicPriceDiscounted}}万</view>
				<view class="topCard-title">{{detail.name}}</view>
			</view>

			<view class="cards m-t-30" @click="toNav('/pages_D/usedCar/carInfo?id='+detail.id)">
				<view class="detaiInfo-tabs m-b-30">
					<view class="detaiInfo-tabs-item">
						<view class="detaiInfo-tabs-item-label">上牌时间</view>
						<view class="detaiInfo-tabs-item-text">{{ timeFormat(detail.upLicenseTime,'yyyy年mm月') }}</view>
					</view>
					<view class="detaiInfo-tabs-item">
						<view class="detaiInfo-tabs-item-label">里程数</view>
						<view class="detaiInfo-tabs-item-text">{{detail.mileage}}公里</view>
					</view>
					<view class="detaiInfo-tabs-item">
						<view class="detaiInfo-tabs-item-label">经手</view>
						<view class="detaiInfo-tabs-item-text">{{detail.transactionsNumber || 0 }}手</view>
					</view>
				</view>
				<view class="labelBox">
					<view class="labelBox-left">档案</view>
					<view class="labelBox-center">
						<view class="labelBoxView">
							<view class="labesBox">
								<view class="labesBox-title textOneEllipsis">{{ detail.displacement }}</view>
								<view class="labesBox-text">排量</view>
							</view>
							<view class="labesBox">
								<view class="labesBox-title textOneEllipsis">{{ detail.basicCarBodyMaterial }}</view>
								<view class="labesBox-text">车身结构</view>
							</view>
							<view class="labesBox">
								<view class="labesBox-title textOneEllipsis">{{ detail.prIndustry4sVo?.city }}</view>
								<view class="labesBox-text">车源地</view>
							</view>
							<view class="labesBox">
								<view class="labesBox-title textOneEllipsis">{{ energyTypeText(detail?.energyType) }}
								</view>
								<view class="labesBox-text">能源类型</view>
							</view>
						</view>
						<u-icon name="arrow-right" size="18"></u-icon>
					</view>
				</view>
				<view class="labelBox m-t-30">
					<view class="labelBox-left">基本参数</view>
					<view class="labelBox-center">
						<view class="labelBoxView" style="width: 100%;">
							<view class="labesBox">
								<view class="labesBox-title texNoWrap">{{ detail.basicEngineModel }}</view>
								<view class="labesBox-text">发动机型号</view>
							</view>
							<view class="labesBox">
								<view class="labesBox-title texNoWrap">{{ detail.basicMaximumSpeed }}</view>
								<view class="labesBox-text">最大车速</view>
							</view>
							<view class="labesBox">
								<view class="labesBox-title texNoWrap">{{ detail.basicMaximumTorque }}</view>
								<view class="labesBox-text">最大扭矩</view>
							</view>
							<view class="labesBox">
								<view class="labesBox-title texNoWrap">{{ detail.basicCurbWeight }}kg</view>
								<view class="labesBox-text">整备质量</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cards m-t-30" @click="toNav('/pages_D/usedCar/carInfo?id='+detail.id)">
				<view class="labelBox">
					<view class="labelBox-left">详细信息</view>
					<view class="labelBox-center">
						<view class="labelBoxView">
							<view class="labesBox">
								<view class="labesBox-title texNoWrap">{{ segmentText(detail.segment) }}</view>
								<view class="labesBox-text">类型</view>
							</view>
							<view class="labesBox">
								<view class="labesBox-title texNoWrap">{{ detail.basicCarBodyMaterial }}</view>
								<view class="labesBox-text">车身结构</view>
							</view>
							<view class="labesBox">
								<view class="labesBox-title texNoWrap">{{ detail.specification }}</view>
								<view class="labesBox-text">规格长宽高</view>
							</view>

						</view>
						<u-icon name="arrow-right" size="18"></u-icon>
					</view>
				</view>
			</view>
			<view class="card m-t-30">
				<view class="card-center"
					@click="toNav('/pages_D/usedCar/merchantsDetail?id='+detail.prIndustry4sVo?.id)">
					<up-image :src="detail.prIndustry4sVo?.image" width="144rpx" height="144rpx" radius="16rpx"
						:lazy-load="true"></up-image>
					<view class="card-center-rigth">
						<view class="ft-32-7-333 texNoWrap">{{detail.prIndustry4sVo?.name}}</view>
						<up-gap height="15"></up-gap>
						<!-- <view class="ft-28-4-666 texNoWrap">{{detail.prIndustry4sVo?.address}}</view>
						<up-gap height="10"></up-gap> -->
						<view class="card-distance ft-28-4-666">
							<up-icon name="map" color="#FF9600"></up-icon>
							<text class="ft-28-4-666 texNoWrap">{{detail.prIndustry4sVo?.address}}</text>
						</view>
					</view>
				</view>
				<up-gap height="15"></up-gap>
				<view class="card-btons">
					<view></view>
					<view class="card-btons-item bton1"
						@click="navigateToApp(detail.prIndustry4sVo?.name,detail.prIndustry4sVo?.latitude,detail.prIndustry4sVo?.longitude)">
						导航到店</view>
					<!-- <view class="card-btons-item bton2" @click="zxkf">在线客服</view> -->
					<view class="card-btons-item bton3" @click="makePhoneCall(detail.prIndustry4sVo?.contactNumber)">
						电话咨询</view>
				</view>
			</view>
		</view>
		<up-gap height="80"></up-gap>
		<!-- 底部按钮 -->
		<view class="bottomBut">
			<view class="bottomBut-item but1" @click="toYU">预约试驾</view>
			<view class="bottomBut-item but2" @click="makePhoneCall(detail.prIndustry4sVo.contactNumber)">联系卖家</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { timeFormat } from '@/uni_modules/uview-plus';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { makePhoneCall, openLocation, openAPPLocation } from '@/utils/util';
import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	import { getPrOldCarDetail } from '@/api/oldCar';
	import { onLoad } from '@dcloudio/uni-app';
	import { getDict } from '@/api/config';
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	const selectIndex = ref('');
	const options1 = ref([]);

	const options2 = ref([]);
	const options3 = ref([]);

	const currentNum = ref(0);
	const swiperList = ref([])
	const detail = ref({});
	const segmentText = computed(() => {
		return (val) => {
			return options3.value.find(item => item.dictValue == val)?.dictLabel;
		}

	});
	const energyTypeText = computed(() => {
		return (val) => {
			return options2.value.find(item => item.dictValue == val)?.dictLabel;
		}
	})
	const swiperChange = (e) => {
		console.log("e", e)
		currentNum.value = e.current;
	}
	const call = () => {
		console.log("连携卖家二手车交易",detail.value.prIndustry4sVo)
		if (detail.value.prIndustry4sVo?.contactNumber) {
			makePhoneCall(detail.value.prIndustry4sVo.contactNumber)
		}
	}
	const toYU = () => {
		uni.setStorageSync('carBrand', {
			brandId: detail.value.brandId,
			seriesId: detail.value.seriesId,
			typeId: detail.value.typeId,
			brandName: detail.value.prCarBrandVo?.name,
			seriesName: detail.value.prCarSeriesVo?.name,
			typeName: detail.value.prCarTypeVo?.name,
			industryId: detail.value.prIndustry4sVo?.id,
			industryName: detail.value.prIndustry4sVo?.name,
		})
		toNav('/pages_D/usedCar/orderAdd')
	}
	const navigateToApp = (name, lat, long) => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": Number(long),
					"latitude": Number(lat),
					"address": name
				}
			}
			openAPPLocation(navigationInfo)
		} else{
			openLocation({
				latitude: Number(lat),//维度
				longitude: Number(long),//经度
				scale: 18,//缩放比例，范围5~18，默认为18
				name: name,
			})
		}

	}

	const getDetail = async (id) => {
		try {
			let res = await getPrOldCarDetail(id);
			if (res && res.data) {
				detail.value = res.data;
				if (detail.value.prCarPicsVoList) {
					swiperList.value = detail.value.prCarPicsVoList.map(item => item.picUrl)
				}
			}
		} catch (err) {
			console.log(err)
		}
	}
	const getDictList = async () => {
		try {
			// const res:any = await getDict('old_car_price_range');
			const res2 : any = await getDict('energy_type');
			const res3 : any = await getDict('segment');
			// if(res.code == 200){
			// 	options1.value = res.data;
			// }
			if (res2.code == 200) {
				options2.value = res2.data;
			}
			if (res3.code == 200) {
				options3.value = res3.data;
			}
		} catch {

		}
	};
	onLoad((opticon) => {
		getDetail(opticon.id);
		getDictList();
	})
</script>

<style lang="scss" scoped>
	.page-container {
		min-height: 100vh;
		background: var(--head-color);
	}

	.labelBox {
		display: flex;
		justify-content: space-between;

		.labelBox-left {
			width: 80rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;
			line-height: 28rpx;
		}

		.labelBox-center {
			display: flex;
			width: calc(100% - 100rpx);
		}

		.labelBoxView {
			width: calc(100% - 40rpx);
			display: flex;
			grid-gap: 10rpx;

			.labesBox {
				flex: 1;

				.labesBox-title {
					font-weight: 500;
					font-size: 28rpx;
					color: #333333;
					line-height: 28rpx;
					margin-bottom: 20rpx;
				}

				.labesBox-text {
					font-weight: 400;
					font-size: 22rpx;
					color: #666666;
					line-height: 28rpx;
				}
			}
		}
	}

	.detaiInfo-tabs {
		background: #F5F5F5;
		border-radius: 20rpx;
		padding: 18rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

		&-item {
			flex: 1;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			padding: 18rpx 0;

			&-label {
				font-weight: 500;
				font-size: 26rpx;
				color: #999999;
			}

			&-text {
				margin-top: 10rpx;
				font-weight: 600;
				font-size: 28rpx;
				color: #333333;
			}
		}

	}

	.pageView {
		padding: 32rpx;
		box-sizing: border-box;
		border-radius: 24rpx 24rpx 0rpx 0rpx;
		position: relative;
		z-index: 1;
		margin-top: -40rpx;
		background: transparent;
	}

	.topBack {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 750rpx;
		height: 756rpx;
		background: var(--head-color);
		border-radius: 24rpx 24rpx 0rpx 0rpx;
	}

	.swimgBox {
		width: 100%;
		height: 640rpx;
		position: relative;

		.swimgBox-item {
			position: absolute;
			right: 48rpx;
			bottom: 88rpx;
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

	.cards {
		padding: 32rpx 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;

		.cards-title {
			font-weight: bold;
			font-size: 32rpx;
			color: #000000;

			text {
				font-weight: 500;
				font-size: 24rpx;
				color: var(--primary-color);
			}
		}

		.title-right {
			font-weight: 500;
			font-size: 24rpx;
			color: #999999;
		}
	}

	.topCard {
		border-radius: 20rpx;

		.topCard-price {
			font-weight: 700;
			font-size: 44rpx;
			color: #F95A37;
			line-height: 60rpx;
		}

		.topCard-price2 {
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;
			line-height: 28rpx;
		}

		.topCard-title {
			font-weight: 700;
			font-size: 36rpx;
			color: #333333;
			line-height: 60rpx;
		}
	}

	.gordBox {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 13rpx;

		.gordBox-item {
			height: 116rpx;
			background: #F5F5F5;
			border-radius: 12rpx;
			flex-direction: column;
		}

		.gordBox-item-name2 {
			font-weight: 500;
			font-size: 24rpx;
			color: #333333;
		}

		.gordBox-item-name {
			font-weight: bold;
			font-size: 26rpx;
			color: #000000;
		}

		.gordBox-item-text {
			font-weight: 500;
			font-size: 24rpx;
			color: #999999;
		}
	}

	.bottomBut {
		position: fixed;
		z-index: 99;
		left: 0;
		bottom: 0;
		background: #FFFFFF;
		width: 750rpx;
		padding: 18rpx 36rpx 60rpx 36rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.bottomBut-item {
			width: 320rpx;
			height: 80rpx;
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.but1 {
			// color:var(--label-color);
			border: 1rpx solid var(--primary-color);
		}

		.but2 {
			background: var(--primary-color);
			color: #FFFFFF;
		}
	}

	.card {
		width: 100%;
		padding: 32rpx 34rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 14rpx;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);

		.card-center {
			width: 100%;
			display: flex;
			justify-content: space-between;

			.card-center-rigth {
				width: calc(100% - 174rpx);
			}

			.card-distance {
				display: flex;
				align-items: center;

				text {
					margin-left: 10rpx;
				}
			}
		}

		.card-btons {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 16rpx;

			.card-btons-item {
				height: 72rpx;
				line-height: 72rpx;
				text-align: center;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				font-weight: 400;
				font-size: 32rpx;
			}

			.bton1 {
				background: var(--label-color);
				color: #492900;
			}

			.bton2 {
				background: var(--label-color);
				color: #492900;
			}

			.bton3 {
				background: var(--primary-color);
				color: #FFFFFF;
			}
		}
	}

	.ft-32-7-333 {
		font-weight: 700;
		font-size: 32rpx;
		color: #333333;
	}

	.ft-28-4-666 {
		font-weight: 400;
		font-size: 28rpx;
		color: #666666;
	}
</style>