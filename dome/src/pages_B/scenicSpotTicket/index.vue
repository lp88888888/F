<template>
	<view class="box" :data-theme="pageTheme">
		<view class="topView">
			<view class="status-bar">
				<image class="back-icon" @click="ongoback" :src="`${imgUrl}trip-pro/arrow-left-icon.png`" />
				<view class="tit-hea">
					景区门票
				</view>

			</view>
			<view class="searchView">
				<up-search placeholder="请输入景点名称" v-model="keyword" searchIconColor="#000000" shape="round"
					bgColor="#F5F5F5" @change="search" actionText :showAction="false"></up-search>
				<view class="searchView-but" @click="toNav('/pages_B/scenicSpotTicket/myOlderList')">
					我的<br />订单
				</view>
			</view>
			<!-- <view class="searchView fl-al-ce">
				<view class="fl-al-ce" style="width: 80%;">
					<up-input placeholder="请输入景点名称" fontSize="28rpx" @blur="search()" border="none"
						v-model="keyword"></up-input>
					<up-icon :name="imgUrl+'static/B-scen-search-icon.png'" size="18"></up-icon>
				</view>
				<view class="searchView-but" @click="toNav('/pages_D/usedCar/orderList')">
					我的<br />订单
				</view>
			</view> -->
			<!-- <view class="iconBox fl-ce-sb">
				<view class="iconBox-item fl-al-ce" v-for="(item,index) in iconList" :key="index">
					<up-image :src="item.url" width="96rpx" height="88rpx" lazy-load></up-image>
					<text>{{item.name}}</text>
				</view>
			</view> -->
		</view>
		<view class="pageView">
			<!-- <view class="cardBox fl-ce-sb">
				<view class="cardBox-item iconColor1" @click="toNav('/pages_B/scenicSpotTicket/cardAnnual')">
					<view class="cardBox-item-top fl-ce-sb">
						<view class="cardBox-item-top-name">年卡</view>
						<view class="cardBox-item-top-icon fl-al-ce">
							<image class="cardBox-item-top-icon-img" :src="imgUrl+'static/B-scen-left-fff-icon.png'"
								lazy-load></image>
							<image class="cardBox-item-top-icon-img" :src="imgUrl+'static/B-scen-left-fff-icon.png'"
								lazy-load></image>
							<image class="cardBox-item-top-icon-img" :src="imgUrl+'static/B-scen-left-fff-icon.png'"
								lazy-load></image>
						</view>
					</view>
					<view class="cardBox-item-center fl-ce-sb">
						<view class="cardBox-item-center-text">
							<text>购买年卡</text>
							<up-gap height="6"></up-gap>
							<text>全年无忧玩</text>
						</view>
						<up-image :src="imgUrl+'static/B-scen-cop-icon.png'" width="76rpx" height="64rpx"
							lazy-load></up-image>
					</view>
				</view>
				<view class="cardBox-item iconColor2" @click="toNav('/pages_B/scenicSpotTicket/cardRights')">
					<view class="cardBox-item-top fl-ce-sb">
						<view class="cardBox-item-top-name">权益卡</view>
						<view class="cardBox-item-top-icon fl-al-ce">
							<image class="cardBox-item-top-icon-img" :src="imgUrl+'static/B-scen-left-fff-icon.png'"
								lazy-load></image>
							<image class="cardBox-item-top-icon-img" :src="imgUrl+'static/B-scen-left-fff-icon.png'"
								lazy-load></image>
							<image class="cardBox-item-top-icon-img" :src="imgUrl+'static/B-scen-left-fff-icon.png'"
								lazy-load></image>
						</view>
					</view>
					<view class="cardBox-item-center fl-ce-sb">
						<view class="cardBox-item-center-text">
							<text>购买权益卡</text>
							<up-gap height="6"></up-gap>
							<text>享全年折扣</text>
						</view>
						<up-image :src="imgUrl+'static/B-scen-qy-icon.png'" width="76rpx" height="64rpx"
							lazy-load></up-image>
					</view>
				</view>
			</view> -->
			<up-gap height="16"></up-gap>
			<view class="fl-ce-sb">
				<view class="fl-al-ce">
					<view class="seleBox fl-al-ce" @click="handleCloseAddressPicker('open')">
						<text>{{city}}</text>
						<up-icon name="arrow-down" size="12"></up-icon>
					</view>
					<!-- <view class="seleBox fl-al-ce">
						<text>全部</text>
						<up-icon name="arrow-down" size="12"></up-icon>
					</view>
					<view class="seleBox fl-al-ce">
						<text>今日可定</text>
						<up-icon name="arrow-down" size="12"></up-icon>
					</view> -->
				</view>
			</view>
			<up-gap height="8"></up-gap>

			<scroll-view class="scroll-container" :scroll-y="true" @scrolltolower="loadMore"
				:scroll-with-animation="true">
				<!-- 列表内容 -->
				<view v-for="(item, index) in dataList" :key="index">
					<ItemCard :detail="item" />
					<up-gap height="16" />
				</view>
				<view v-if="isshow" class="loading-tip"
					style="text-align: center; padding: 20rpx 0; font-size: 24rpx; color: #999;">
					没有更多数据了
				</view>
				<ser-empty v-if="!dataList.length"></ser-empty>
			</scroll-view>
			<view style="height: 100px;"></view>
		</view>
		<up-popup :show="showAddressPicker" round="20" @close="handleCloseAddressPicker">
			<view>
				<Address type="city" :onCallParent="handleCloseAddressPicker" @select-address="handleSelectAddress"></Address>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import ItemCard from './components/ItemCard.vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import type { Detail } from './types';
	import { useTheme } from '@/composables/useTheme';
	import { getodsJjbScenicSpot } from '@/api/scenicArea';
	import Address from '@/pages_B/scenicSpotTicket/components/Address.vue';
	import {
		onLoad,
		onShow,
		onPageScroll,
		onHide
	} from '@dcloudio/uni-app';
	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const keyword = ref<string>('');
	const sysInfo = uni.getSystemInfoSync('statusBarHeight');
	const bgImageUrl = ref<string>(imgUrl + 'jd-bj-icon.png')
	const listtotal = ref('0')
	const pageNum = ref(1)
	const pageSize = ref(10)
	const city = ref<string>('');
	const isshow = ref(false)
	// 主题相关
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = computed(() => {
		return themeStore.imgUrl
	})
	const showAddressPicker = ref(false);
	onMounted(() => {
		fetchData()

	});
	onShow(() => {
		// #ifdef APP
		if (uni.getStorageSync('appaddress')) {
			const addr = uni.getStorageSync('appaddress')
			setSelectedAddress(addr)
			uni.removeStorageSync('appaddress')
		}
		// #endif

	})
	onLoad(() => {
		let map = uni.getStorageSync('address')
		city.value = map.city
	})
	const handleCloseAddressPicker = (msg: string) => {
			showAddressPicker.value = false
		 if (msg == 'open') {
			showAddressPicker.value = true;
		}
	};
	const handleSelectAddress = (address) => {
	    const { province, city: selectedCity } = address; // 1. 解构时重命名，避免冲突
	    city.value = selectedCity; // 2. 给 ref 变量赋值
	    showAddressPicker.value = false;
	    pageNum.value = 1; // 建议：切换城市时重置页码
	    dataList.value = []; // 建议：切换城市时清空列表
	    fetchData(); // 3. fetchData 不需要传参，它内部会读取 city.value
	}
	// const setSelectedAddress = async (selectedAddress : any) => {
	// 	console.log('okokokokok')
	// 	city.value = selectedAddress.city
	// 	pageNum.value = 1
	// 	dataList.value = []
	// 	fetchData()
	// }
	const search = () => {
		dataList.value = []
		pageNum.value = 1
		fetchData()
	}
	defineExpose({
		// setSelectedAddress
	})
	const iconList = ref([
		{ name: '人文历史', url: imgUrl + 'static/B-scen-index-icon1.png' },
		{ name: '自然风光', url: imgUrl + 'static/B-scen-index-icon2.png' },
		{ name: '文博场馆', url: imgUrl + 'static/B-scen-index-icon3.png' },
		{ name: '艺术展览', url: imgUrl + 'static/B-scen-index-icon4.png' },
	])
	// 模拟请求数据
	const fetchData = async () => {
		// 下拉刷新：重置数据
		const lat = uni.getStorageSync('address').lat ? uni.getStorageSync('address').lat : ""
		const lng = uni.getStorageSync('address').lng ? uni.getStorageSync('address').lng : ""
		try {
			// 模拟 API 请求
			let params = {
				poiName: keyword.value,
				pageNum: pageNum.value,
				pageSize: pageSize.value,
				city: city.value,
				longitude: lng,
				latitude: lat
			}

			let res : any = await getodsJjbScenicSpot(params);
			listtotal.value = res.data.total
			res.data.list.forEach((item : Item) => {
				let firstImage = '';
				try {
					const arr = JSON.parse(item.images);
					if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string') {
						firstImage = arr[0];
					}
				} catch (error) {
					console.error('解析 images 失败:', item.images, error);
				}
				item.image = firstImage;
			});
			// 判断是否还有更多数据
			dataList.value = [...dataList.value, ...res.data.list]
			console.log(dataList.value, 'dataList.value')
		} catch (err) {
			uni.showToast({ title: '加载失败', icon: 'none' })
		}
	}
	const ongoback = () => {
		uni.navigateBack()
	}
	// 下拉刷新事件
	const loadMore = () => {
		if (pageNum.value * pageSize.value >= listtotal.value) {
			isshow.value = true
			return
		} else {
			pageNum.value++
			fetchData()
		}

	}

	const dataList = ref([])
</script>

<style lang="scss">
	.box {
		background: var(--head-color);
		height: 100vh;
		overflow: hidden;
	}

	page {
		background: #F8F9FB;
	}

	.scroll-container {
		height: calc(100vh - 400rpx)
	}

	.status-bar {
		width: 100%;
		height: 88rpx;
		padding-top: 78rpx;
		text-align: left;
		display: flex;
		align-items: center;
	}

	.tit-hea {
		width: 650rpx;
		text-align: center;
	}

	.back-icon {
		width: 40rpx;
		height: 32rpx;
	}

	.pageView {
		padding: 0 32rpx;
		box-sizing: border-box;
	}

	.topView {
		width: 100%;
		padding: 20rpx 40rpx 0;
		box-sizing: border-box;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		transition: background-image 1s ease-in-out;
	}

	// .searchView {
	// 	width: 100%;
	// 	height: 72rpx;
	// 	padding: 0 20rpx;
	// 	box-sizing: border-box;
	// 	background: #FFFFFF;
	// 	border-radius: 16rpx;
	// 	border: 1px solid #CBD1D8;
	// }

	.iconBox {
		width: 100%;
		padding: 20rpx 0;

		.iconBox-item {
			width: 120rpx;
			flex-direction: column;
			font-size: 24rpx;
			font-weight: 500;
			color: #666666;

			text {
				line-height: 24rpx;
				margin-top: 20rpx;
			}
		}
	}

	.cardBox {
		width: 100%;

		.cardBox-item {
			width: 332rpx;
			border-radius: 16rpx 16rpx 16rpx 16rpx;

			.cardBox-item-top {
				width: 100%;
				padding: 26rpx 32rpx;
				box-sizing: border-box;

				.cardBox-item-top-name {
					font-weight: 900;
					font-size: 32rpx;
					color: #FDF7EC;
					line-height: 32rpx;
				}

				.cardBox-item-top-icon {
					height: 32rpx;

					.cardBox-item-top-icon-img {
						width: 13rpx;
						height: 21rpx;
					}
				}
			}

			.cardBox-item-center {
				width: 100%;
				height: 108rpx;
				padding: 0 32rpx;
				box-sizing: border-box;

				.cardBox-item-center-text {
					text {
						display: block;
						font-weight: 500;
						font-size: 24rpx;
						line-height: 24rpx;
					}
				}
			}
		}

		.iconColor1 {
			background: linear-gradient(135deg, #FFD071 0%, #FCA141 100%);

			.cardBox-item-center {
				background: linear-gradient(0deg, rgba(255, 255, 255, 0.64) 0%, rgba(255, 255, 255, 0.22) 100%);

				text {
					color: #C28934;
				}
			}
		}

		.iconColor2 {
			background: linear-gradient(135deg, #789CFF 0%, #2C6FF4 100%);

			.cardBox-item-center {
				background: linear-gradient(0deg, rgba(255, 255, 255, 0.64) 0%, rgba(255, 255, 255, 0.22) 100%);

				text {
					color: #1970C1;
				}
			}
		}

	}

	.seleBox {
		border-radius: 32rpx;
		padding: 12rpx 25rpx;
		gap: 12rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		border: 2rpx solid #D8D8D8;
		font-size: 28rpx;
		font-weight: normal;
		color: #666666;
		margin-right: 24rpx;
	}

	.myBox {
		font-size: 28rpx;
		font-weight: 500;
		line-height: 28rpx;
		color: #005FEE;
	}
	.searchView {
		width: 100%;
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
</style>