<template>
	<view class="page-container">

		<view class="header" :style="{ backgroundImage: 'url(' + imgUrl + 'static/mystore_bg.png)' }">
			<u-sticky bgColor="transparent" z-index="99999">
				<up-navbar title="我的小店" :bgColor="backgroundColor" @leftClick="toBack" placeholder
					:fixed="false"></up-navbar>
			</u-sticky>
			<view class="input-container">
				<up-icon name="search" color="#fff" size="18" class="icon" />
				<input class="search-input" v-model="nameInput" type="text" placeholder="请输入景点名称"
					placeholder-class="placeholder" @input="odsJjbScenicSpotpicFun" />
			</view>
		</view>

		<view class="content">
			<!-- 头部搜索框 -->

			<view class="list-card">
				<view class="tab-list flex just-sb">
					<view class="tab-item ali-cen bg_g1" @click="isDistributorFun">
						<image class="tab-icon" :src="imgUrl+'static/fx-icon1.png'" mode=""></image>
						<view><text>我的信息</text></view>
					</view>
					<view class="tab-item  ali-cen bg_g2" @click="shearOpen">
						<image class="tab-icon" :src="imgUrl+'static/fx-icon2.png'" mode=""></image>
						<view><text>小程序码</text></view>
					</view>
					<view class="tab-item ali-cen bg_g3" @click="toNav('/pages_A/promotionOrder/index')">
						<image class="tab-icon" :src="imgUrl+'static/fx-icon3.png'" mode=""></image>
						<view><text>订单</text></view>
					</view>
					<view class="tab-item ali-cen bg_g4" @click="toNav('/pages_A/wallet/index')">
						<image class="tab-icon" :src="imgUrl+'static/fx-icon4.png'" mode=""></image>
						<view><text>钱包</text></view>
					</view>
				</view>
				<!-- 统计信息 -->
				<view class="statistics">
					<view class="tjsx">
						<view>账号状态</view><view>|</view><view>正常</view>
					</view>
					<view class="statistics-tab">
						<view class="statistics-tab-item" :class="tabIndex == index ? 'tab-actived' : ''"
							@click="tabClick(index,item.type)" v-for="(item, index) in statisticsTab" :key="index">
							{{item.value}}
						</view>
					</view>
					<view class="statistics-info">
						<view class="task-info">
							<text class="task-text">{{money.orderNum }}</text>
							<text class="task-description">总订单数
								<text class="fs-20"> (有效)</text>
							</text>
						</view>
						<view class="revenue-info">
							<text class="revenue-text">¥{{ money.orderAmount}}</text>
							<text class="revenue-description">总销售额</text>
						</view>
						<view class="revenue-info">
							<text class="revenue-text">¥{{ money.commission}}</text>
							<text class="revenue-description">实际佣金</text>
						</view>
					</view>
				</view>

				<!-- 景点列表 -->
				<view class="location-list">
					<ser-empty v-if="dataList.length == 0"></ser-empty>
					<view class="location-item" v-for="(item, index) in dataList" :key="index" @click="pathUrl(item)">
						<view class="location-image-box">
							<image :src="item.images" class="location-image" />
							<view class="location-distance-box">
								<up-icon name="map-fill" color="#ffffff" size="14" class="icon" />
								<text class="location-distance">{{ item.straightLineDistance }}</text>
							</view>
							<view class="location-classify">
								{{item.level}}
							</view>
						</view>
						<view class="location-info">
							<text class="location-name">{{ item.poiName }}</text>
							<text class="location-address">{{ item.address }}</text>
							<view class="location-label-box">
								<view class="location-label" v-for="(it, idx) in item.label" :key="idx">{{it}}</view>
							</view>
							<view class="location-price-box flex ali-cen just-sb">
								<view class="location-price">
									<text class="fs-26">¥</text>{{item.odsJjbProductVoList[0].odsJjbStockVo.salesPrice}}
									<text class="fs-26">起</text>
								</view>
								<view class="location-num-box flex ali-cen">
									<text class="fs-24 col6">最高佣金</text>
									<text class="location-num">￥{{item.commission}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <up-overlay :show="show" @click="show = false">
			<view @tap.stop>
				<image :src="qrCodeDataUrl" mode="" class="ewm"></image>
				<image class="shops" :src="imgUrl+'static/shops_fx.png'" mode=""></image>
			</view>
		</up-overlay> -->
	</view>
	<Share ref="shearRef" pageType="fx"></Share>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, nextTick } from 'vue';
	import {
		onLoad,
		onShow,
		onPageScroll,
		onHide
	} from '@dcloudio/uni-app';

	import { imgUrl } from '../../config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import theme from '@/utils/theme'
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	import { toNav, toBack } from '@/utils/route';
	import { isDistributor } from '@/api/distribution';
	import { getodsJjbScenicSpot } from '@/api/scenicArea';
	import { findNumAndAmountByDistributionMemberId } from '@/api/distribution';
	import Share from '@/components/Share/index';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const shearRef = ref(null);
	const show = ref(false);
	// 初始化数据
	const qrCodeDataUrl = ref('');
	// 数据绑定
	const searchQuery = ref("");  // 搜索框绑定的值
	const totalAmount = ref(6030);  // 今日总金额
	const totalOrders = ref(100);   // 总订单数
	const totalRevenue = ref(5010); // 实际收入
	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const pageNum = ref(1)
	const pageSize = ref(10)
	const dataList = ref([])
	const money = ref({})
	const nameInput = ref('')
	const tbaType = ref('today')
	const address = ref('')
	const invitationId= ref('')
	const statisticsTab = ref([
		{
			value: '今日',
			type: 'today'
		}, {
			value: '昨日',
			type: 'yesterday'
		}, {
			value: '近7日',
			type: 'pastSevenDays'
		}, {

			value: '近30日',
			type: 'pastOneMonth'
		}
	]);
	const tabIndex = ref(0)

	onMounted(() => {
		getUserAddress()
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44 是默认导航栏高度
	});
	const open = () => {
		show.value = true;
	}

	const close = () => {
		show.value = false;
	}
	const odsJjbScenicSpotpicFun = async () => {
		try {
			// 模拟 API 请求
			let params = {
				pageNum: pageNum.value,
				pageSize: pageSize.value,
				city: address.value.city,
				longitude: address.value.lng,
				latitude: address.value.lat,
				distributor: '1',
				poiName: nameInput.value
			}

			let res = await getodsJjbScenicSpot(params);
			
			dataList.value = res.data.list.map(item=>{
				let firstImage = '';
				const arr = JSON.parse(item.images);
				if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string') {
					firstImage = arr[0];
				}
				item.images = firstImage
				return item
			})
		} catch (err) {
			// uni.showToast({ title: '加载失败', icon: 'none' })
		}
	}
	const findNumAndAmountByDistributionMemberIdFun = async () => {
		const id = uni.getStorageSync('userInfo').id
		let params = {
			type: tbaType.value,
			distributionMemberId: id
		}
		let res = await findNumAndAmountByDistributionMemberId(params);
		money.value = res.data
	}
	const pathUrl = (val : any) => {
		const id = uni.getStorageSync('userInfo').memberShowId
		uni.navigateTo({
			url: `/pages_B/scenicSpotTicket/detail?id=${val.poiId}&memberShowId=${id}`
		})
	}
	const tabClick = (index, type) => {
		tabIndex.value = index
		tbaType.value = type
		findNumAndAmountByDistributionMemberIdFun()
	}
	const isDistributorFun = async () => {
		let res = await isDistributor();
		if (res.data == true) {
			uni.navigateTo({
				url: '/pages_A/partner/index?type='+1
			})
		} else {
			uni.navigateTo({
				url: '/pages_A/partner/index'
			})
		}
	}
	const generateQRCode = () => {
		const id = uni.getStorageSync('userInfo').id
		let urlLj = `https://tydwfwpt.shanyitong.com:31082/fx?id=${id}`
		const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(urlLj)}`
		qrCodeDataUrl.value = url
		uni.setStorageSync('qrCodeDataUrl', url);
	}
	const shearOpen = () => {
		if (shearRef.value) {
			shearRef.value.open()
		} else {
			console.error('shearRef is null')
		}
	}
	const getUserAddress = () => {
		address.value = uni.getStorageSync('address')
	}
	onLoad((opticon) => {
		getUserAddress()
		generateQRCode()
		findNumAndAmountByDistributionMemberIdFun()
		odsJjbScenicSpotpicFun()
		shearOpen()
	})
</script>

<style lang="scss">
	.page-container {
		width: 100%;
		height: 100vh;
		background: #F1EFEC;
	}

	.content {
		// padding: 20rpx 0;
	}

	.bg-icon {
		width: 100%;
		height: 240rpx;
	}

	.header {
		width: 100%;
		height: 600rpx;
		overflow: hidden;
		background-size: 100% 100%;

		.input-container {
			display: flex;
			align-items: center;
			width: 85%;
			height: 72rpx;
			position: relative;
			background: rgba(255, 255, 255, 0.6);
			border-radius: 36rpx;
			padding: 0 30rpx;
			margin: 20rpx auto;

			.icon {
				position: absolute;
				left: 2rpx;
				// margin-right: 26rpx;
			}

			.search-input {
				width: 100%;
				height: 72rpx;
				padding: 0 30rpx 0 20rpx;
				font-weight: 500;
				font-size: 28rpx;
			}

			.placeholder {
				color: #fff;
			}
		}
	}


	.list-card {
		width: 100%;
		background: #F1EFEC;
		border-radius: 60rpx 60rpx 0rpx 0rpx;
		padding: 32rpx 32rpx 0;
		box-sizing: border-box;
		margin-top: -30rpx;

		.tab-list {
			margin-bottom: 26rpx;

			.tab-item {
				width: 150rpx;
				padding: 16rpx 20rpx;
				box-sizing: border-box;
				font-size: 24rpx;
				text-align: center;
				color: #333333;
			}
		}

		.tab-icon {
			width: 44rpx;
			height: 44rpx;
		}

		.bg_g1 {
			border-radius: 10rpx;
			background: rgba(41, 223, 106, 0.12);
		}

		.bg_g2 {
			border-radius: 10rpx;
			background: rgba(44, 116, 241, 0.1);
		}

		.bg_g3 {
			border-radius: 10rpx;
			background: rgba(255, 155, 5, 0.09);
		}

		.bg_g4 {
			border-radius: 10rpx;
			background: rgba(44, 179, 241, 0.1);
		}


		.bg_b {
			width: 216rpx;
			height: 76rpx;
			background: #F3F8FF;
			border-radius: 38rpx;
			border: 3px solid #FFFFFF;
		}

		.bg_o {
			width: 216rpx;
			height: 76rpx;
			background: #FFF1EA;
			border-radius: 38rpx;
			border: 3px solid #FFFFFF;
		}
	}

	.statistics {
		width: 100%;
		height: 324rpx;
		box-sizing: border-box;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/fx_bg.png');
		background-size: 100%;
		border-radius: 26rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-bottom: 20px;
		padding: 30rpx 20rpx;
		position: relative;
		.statistics-tab {
			width: 100%;
			display: flex;
			gap: 10rpx;
			margin-top: 75rpx;

			.statistics-tab-item {
				width: 110rpx;
				height: 50rpx;
				background: #FFFFFF;
				border-radius: 16rpx;
				border: 1rpx solid #EEEEEE;
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
				text-align: center;
				line-height: 50rpx;
			}

			.tab-actived {
				background: #FFFFFF;
				border: 1rpx solid $color;
				color: $color;
			}
		}

		.statistics-info {
			display: flex;
			justify-content: space-between;
			background: rgba(255, 255, 255, 0.5);
			border-radius: 16rpx;
			padding: 10rpx 25rpx;
			margin-top: 20rpx;
		}

		.total-info,
		.task-info,
		.revenue-info {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.total-icon,
		.task-icon,
		.revenue-icon {
			width: 40px;
			height: 40px;
			margin-bottom: 8px;
		}

		.total-text,
		.task-text,
		.revenue-text {
			font-weight: 800;
			font-size: 43rpx;
			color: #333333;
			margin-bottom: 20rpx;
		}

		.total-description,
		.task-description,
		.revenue-description {
			font-weight: 500;
			font-size: 24rpx;
			color: #666666;
		}
	}

	.location-list {
		display: flex;
		flex-direction: column;

		.location-item {
			width: 686rpx;
			height: 290rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			display: flex;
			margin-bottom: 16px;
			padding: 30rpx;
			box-sizing: border-box;

			.location-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.location-name {
					font-size: 32rpx;
					font-weight: bold;
					color: #333333;
				}

				.location-address {
					font-weight: 500;
					font-size: 24rpx;
					color: #666666;
				}

				.location-label-box {
					display: flex;
				}

				.location-label {
					width: 112rpx;
					height: 40rpx;
					background: #FFF5EA;
					border-radius: 6rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: 500;
					font-size: 22rpx;
					color: $color;
					margin-right: 15rpx;
				}

				.location-label:nth-last-child(1) {
					width: 112rpx;
					height: 40rpx;
					background: #F7F8F9;
					border-radius: 6rpx;
					font-weight: 500;
					font-size: 22rpx;
					color: #999999;
				}


				.location-price {
					font-weight: 600;
					font-size: 50rpx;
					color: $color;
				}

				.location-num {
					font-weight: 500;
					font-size: 24rpx;
					color: #F90F06;
				}

				.location-num-box {
					width: 230rpx;
					height: 40rpx;
					background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 238, 237, 1) 100%);
					border-radius: 0rpx 20rpx 20rpx 0rpx;
					justify-content: flex-end;
					padding-right: 17rpx;
					box-sizing: border-box;
				}
			}

			.location-image-box {
				position: relative;
				margin-right: 27rpx;
				width: 186rpx;
				height: 230rpx;
				background: #FFFFFF;
				border-radius: 16rpx;

			}

			.location-image {
				width: 186rpx;
				height: 230rpx;
				background: #000;
				border-radius: 16rpx;
			}

			.location-distance-box {
				position: absolute;
				bottom: 18rpx;
				left: 10rpx;
				font-size: 24rpx;
				color: #666666;
				display: flex;
				align-items: center;
			}

			.location-distance {
				margin-left: 8rpx;
				font-weight: 500;
				font-size: 22rpx;
				color: #FFFFFF;
			}

			.location-classify {
				width: 56rpx;
				height: 32rpx;
				background: $bgLgColor;
				border-radius: 0rpx 16rpx 16rpx 0rpx;
				font-weight: 500;
				font-size: 22rpx;
				color: #FFFFFF;
				position: absolute;
				top: 16rpx;
				left: 0;
				padding: 0 14rpx;
				box-sizing: border-box;
			}
		}
	}

	.shops {
		height: 750rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 9;
	}

	.ewm {
		position: absolute;
		top: 47%;
		left: 50%;
		width: 280rpx;
		height: 265rpx;
		z-index: 99;
		transform: translate(-50%, -50%);
	}

	::v-deep .u-navbar__content {
		background: linear-gradient(116deg, #FF9562 13%, #EB5E40 100%) !important;
	}

	::v-deep .u-transition {
		z-index: 99999999999 !important;
	}
	.tjsx{
		position: absolute;
		top: 20rpx;
		right: 30rpx;
		display: flex;
		align-items: center;
		gap: 10rpx;
	}
</style>