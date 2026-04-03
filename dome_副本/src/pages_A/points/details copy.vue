<template>
	<view class="container" :data-theme="pageTheme">
		<view class="swiperBox">
			<up-swiper :list="list6" height="350" @change="(e) => (currentNum = e.current)" :autoplay="false" indicatorStyle="right: 20px;bottom: 30px">
				<template #default="{ item }">
					<view class="img-wrap">
						<image class="swp-img" :src="item" mode="aspectFit" />
					</view>
				</template>
				<template #indicator>
					<view class="indicator-num">
						<text class="indicator-num__text">{{ currentNum + 1 }}/{{ list6.length }}</text>
					</view>
				</template>
			</up-swiper>
		</view>

		<view class="header-card flex just-sb ali-cen" :style="{ marginTop: navBarHeight + 'px' }">
			<view class="" @click="backEvt()">
				<up-icon name="arrow-left" color="#000000" size="24"></up-icon>
			</view>
		</view>
		<view class="content">
			<view class="con-header flex just-sb ali-cen colf">
				<view class="flex ali-cen">
					<image class="goods_item_img-1" :src="imgUrl + 'zhekou-4.png'" mode=""> </image>
					<text class="fs-50 m-r-15">{{ detailsPoint }}</text>
					<text class="fs-28">积分</text>
					<text
						class="fs-28"
						style="text-decoration: line-through"
						v-if="pointsDetail.returnActivityType == 4 || pointsDetail.returnActivityType == 3"
						>{{ pointsDetail.point }}</text
					>
					<view class="del-box" v-if="pointsDetail.returnActivityType == 3">
						<image class="goods_item_img-2" :src="imgUrl + 'miaosha-2.png'" mode=""> </image>
						<text class="del-box-text">限时秒杀</text>
					</view>
				</view>
				<view class="miansha-box">
					<image class="goods_item_img-3" :src="imgUrl + 'miaosha-4.png'" mode=""> </image>
					<text>距结束</text>
					<up-count-down :time="timeshengyu" format="HH:mm:ss" autoStart millisecond @change="onChange">
						<view class="time">
							<view class="time__custom">
								<text class="time__custom__item">{{ timeData.hours > 10 ? timeData.hours : '0' + timeData.hours }}</text>
							</view>
							<text class="time__doc">:</text>
							<view class="time__custom">
								<text class="time__custom__item">{{ timeData.minutes }}</text>
							</view>
							<text class="time__doc">:</text>
							<view class="time__custom">
								<text class="time__custom__item">{{ timeData.seconds }}</text>
							</view>
						</view>
					</up-count-down>
				</view>
				<text class="fs-24" style="color: #fff">已上架{{ totalStock }}</text>
			</view>
			<view class="con-info">
				<text class="fs-34 fw-600">{{ detail.name }}</text>
				<view class="m-t-25 fs-26 col9 fw-400 lh40" style="display: flex; justify-content: space-between">
					<text>{{ detail.sellingPoint }}</text>
					<view class="tab-fenxiang" @click="shearOpen()">
						<image class="goods_item_img-4" :src="imgUrl + 'fenxiang-1.png'" mode=""> </image>
						<text>分享</text>
					</view>
				</view>
			</view>

			<!-- 资讯模块 -->
			<!--<view class="news_box" v-if="newsinfo.title" @click="toNav(`/pages_A/points/newsdetail?id=${newsinfo.id}`)">
				<view class="news_title">
					<uni-icons type="sound-filled" color="#3D3D3D" size="24"></uni-icons>
					<text>{{newsinfo.title}}</text>
				</view>
				<view class="news_cont" v-html="newsinfo.content"></view>
			</view> -->

			<view class="zslw-box">
				<view class="zslw-box-1">
					<image class="goods_item_img-7" :src="imgUrl + 'liwu-icon.png'" mode=""> </image>
					<text class="zslw-box-text1">支持赠送礼物</text>
				</view>
				<view class="zslw-box-2" @click="toNav('/pages_A/points/givegift')">
					<text class="zslw-box-text2">一键送礼</text>
				</view>
			</view>
			<view class="tab-box">
				<view class="tab-container">
					<view
						v-for="(item, index) in tabList"
						:key="index"
						class="tab-item"
						:class="{ active: currentTab == item.id }"
						@click="currentTabFun(item.id)"
					>
						{{ item.name }}
					</view>
				</view>

				<view class="details-parse" v-if="detail?.description">
					<up-parse :content="detail?.description"></up-parse>
				</view>
			</view>
			<view class="details-eva m-t-30">
				<view class="eva-header flex just-sb ali-cen">
					<text class="fs32 fw-b">评价</text>
					<view class="flex" @click="toJump('/pages_C/evaluation/list?spuId=' + pointsDetail.spuId)">
						<view class="fs-24 col9" style="color: #fff">
							查看全部 (
							<text class="fs-24 colff9">{{ sysReviewVoList.length }}</text>
							)
						</view>
						<up-icon name="arrow-right" color="#999999" size="14"></up-icon>
					</view>
				</view>
				<view class="eva-item flex flex-col m-t-30" v-for="(item, index) in sysReviewVoList" :key="index">
					<view class="flex just-sb ali-cen m-b-25">
						<view class="flex ali-cen">
							<up-avatar :src="item.avatar" size="22"></up-avatar>
							<text class="fs-24 fw-b m-l-15">{{ item.nickName }}</text>
						</view>
						<text class="fs-24 col6">{{ item.createTime || '' }}</text>
					</view>
					<view class="posView">
						<view class="eva-info">
							{{ item.content }}
						</view>
						<view class="eva-img-box flex" v-if="item.imageUrls.length">
							<image
								class="eva-img"
								v-for="(url, inx) in item.imageUrls"
								:key="inx"
								:src="url"
								@click="$previewListImage(inx, item.imageUrls)"
								mode=""
							>
							</image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar flex ali-cen just-sb">
			<view class="foot_cz">
				<view class="pr flex flex-col ali-cen" @click="pathTo()">
					<image class="icon-44" :src="imgUrl + 'service.png'" mode=""></image>
					<text class="fs-22 col3">客服</text>
				</view>
				<view class="pr flex flex-col ali-cen" @click="toJump('/pages_A/shoppingCart/index')">
					<image class="icon-44" :src="imgUrl + 'jf/jf_cart.png'" mode=""></image>
					<text class="fs-22 col3">购物车</text>
					<view v-if="cartCount > 0" class="dot" :class="['dot', cartCount < 10 ? 'dot--1' : cartCount < 100 ? 'dot--2' : 'dot--3']">
						{{ cartCount > 99 ? '99+' : cartCount }}
					</view>
				</view>
				<view class="btn-box">
					<up-icon name="star" size="24" v-if="collect" @click="addcreateFun()"></up-icon>
					<up-icon name="star-fill" :color="themeStore.themeColors.$primaryColor" size="24" v-else @click="deletecreateFun()"></up-icon>
					<view class="fs-22 col3">收藏</view>
				</view>
			</view>
			<view class="btn-group">
				<view class="btn-cart" @click="openSheet(1)">加入购物车</view>
				<view class="btn-pay" @click="openSheet(2)">立即兑换</view>
			</view>
		</view>
		<up-gap height="90"></up-gap>
		<!-- 购物车弹窗 -->
		<PageDurationTracker pageName="product-detail" />
		<ExchangeSheet ref="sheetRef" :totalStock="totalStock" @confirm="onConfirm" @onSku="changeSku" :couponFlag="couponFlag" />
		<Share v-if="detail.id" ref="shearRef" pageType="mx" :itemObj="detail" :invitationId="detailId"></Share>
	</view>
</template>
<script setup lang="ts">
import theme from '@/utils/theme';
import PageDurationTracker from '@/components/PageDurationTracker.vue';
import { ref, reactive, onMounted } from 'vue';
import { onLoad, onReachBottom, onShow, onShareAppMessage } from '@dcloudio/uni-app';
import { toNav, toBack } from '@/utils/route';
import Share from '@/components/Share/index';
import { useAppStore } from '@/store/modules/app';
import ExchangeSheet from '@/components/ExchangeSheet/ExchangeSheet.vue';
import {
	detailPoints,
	detailActivityPoints,
	addCartPoints,
	addShopCar,
	getCountCartPoints,
	confirmPrShopOrder,
	submitPrShopCarOrder,
	addcreate,
	deletecreate,
	exitscreate,
	pointsnews,
} from '@/api/points';
import { userDefaultAddr } from '@/api/user';
import { toast } from '@/utils/common';
import { $previewListImage, parseQueryString } from '@/utils/util';
import { imgUrl } from '@/config';

// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);
const timeData = ref({});

// 定义 onChange 方法
const onChange = (e) => {
	timeData.value = e;
};
const appStore = useAppStore();
const detail = ref({});
const list6 = ref([]);
const shearRef = ref(null);
const list7 = reactive([
	'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/fwe.png',
	'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/dsewf.png',
	'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/ge.png',
	'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/ge.png',
]);
const sheetRef = ref<InstanceType<typeof ExchangeSheet>>();
const addrId = ref(null);
const currentNum = ref(0);
const cartCount = ref(3);
const navBarHeight = ref(0);
const collect = ref(true);
const totalStock = ref('');
const detailsPoint = ref('');
const currentTab = ref(1);
const couponFlag = ref('');
const pointsDetail = ref({});
const sysReviewVoList = ref([]);

// 详情ID
const detailId = ref('');
const isLogin = computed(() => {
	return appStore.checkLogin();
});
onMounted(() => {
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = sysInfo.statusBarHeight; // 44是默认导航栏高度
});

const toJump = (url: String) => {
	uni.navigateTo({
		url: url,
	});
};
const shearOpen = () => {
	shearRef.value.open();
};
const openSheet = async (type: string | number) => {
	console.log('打开组件', pointsDetail.value.returnActivityType);
	if (type == 1 && pointsDetail.value.returnActivityType == 3) {
		uni.showToast({ title: '秒杀商品不可计入购物车', icon: 'success' });
		return;
	} else {
		if (pointsDetail.value.returnActivityType == 3 && detail.value.skus[0].canUseActivity == 0) {
			uni.showToast({ title: '已达兑换上限', icon: 'success' });
			return;
		} else {
			sheetRef.value?.open(detail.value, type, detailId.value, pointsDetail.value.returnActivityType);
		}
	}
};

// 选择Sku
const changeSku = (item) => {
	console.log('选择的sku', item);
	detailsPoint.value = item.point || 0;
};

// 立即兑换
const onConfirm = (val) => {
	console.log('弹窗的兑换', val);
	if (!val) {
		shopCarTotal();
	} else {
		toNav(`/pages_A/points/payOrder?obj=${JSON.stringify(val)}`);
	}

	// getDetail(val.id);
};

// const addShopCarData = async (count:number,skuId:string)=>{
// 	const res = await addShopCar({
// 		spuId:detail.value.spuId,
// 		count:count,
// 		skuId:skuId,
// 		shopType:1,
// 	})
// 	if(res.code == 200){
// 		shopCarTotal()
// 		toast('加入购物车成功');
// 	}else{
// 		toast(res.msg)
// 	}
// }

const tabList = ref([
	{
		name: '商品详情',
		id: '1',
	},
	{
		name: '评价',
		id: '3',
	},
]);
const pathTo = () => {
	// toast('正在开发中');
	const info = uni.getSystemInfoSync();
	const platform = info.platform || info.uniPlatform;
	if (platform == 'android') {
		toNav('/pages_E/digitalHuman/openAi');
	} else {
		toNav('/pages_E/digitalHuman/index');
	}
};
const backEvt = () => {
	uni.navigateBack();
};
const getDetail = async (id: string) => {
	const res: any = await detailActivityPoints(id);
	console.log('查询的商品数据', res);
	if (res.code == 200) {
		let point = res.data.point;
		// let
		let productsItem = null;
		totalStock.value = res.data.stock;
		if (res.data.returnActivityType == 3 || res.data.returnActivityType == 4) {
			detailsPoint.value = res.data.activityPoint;
		} else {
			detailsPoint.value = res.data.point;
		}
		pointsDetail.value = res.data;
		sysReviewVoList.value = res.data.sysReviewVoList;
		console.log('shujushuju', pointsDetail.value.spuId);
		get_news(pointsDetail.value.spuId);
		if (res.data.products.length > 0) {
			productsItem = res.data.products[0];
		}
		if (res.data.productSpuDetailRespVO) {
			let res1 = res.data.productSpuDetailRespVO;
			detail.value = res1;
			const endTimeStr = res1.skus[0].activityEndTime; // 从接口 res.data.endTime 获取

			const [datePart, timePart] = endTimeStr.split(' ');
			const [y, m, d] = datePart.split('-').map(Number);
			const [h, min, s] = timePart.split(':').map(Number);
			timeshengyu.value = Math.max(0, new Date(y, m - 1, d, h, min, s).getTime() - Date.now());
			detail.value.point = point;
			detail.value.products = productsItem;
			list6.value = res1.sliderPicUrls || [];
			couponFlag.value = res.data.productSpuDetailRespVO.couponFlag;
			if (isLogin.value) {
				shopCarTotal();
			}
		}
		if (isLogin.value) {
			exitscreateFun();
		}
	} else {
		toast(res.msg);
	}
};

// 商品资讯
const newsinfo = ref({
	title: '',
	content: '',
});
const get_news = async (id) => {
	try {
		const res = await pointsnews({ spuId: id });
		console.log('查询的商品资讯', res);
		if (res.rows && res.rows.length) {
			newsinfo.value = res.rows[0];
		}
	} catch (err) {
		console.log('资讯失败', err);
	}
};

const shopCarTotal = async () => {
	if (!isLogin.value) {
		showAlert2(
			'提示',
			'本次操作需要您进行登录验证',
			false,
			'取消',
			'确定',
			(success) => {
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages_A/login/login',
				});
				// #endif
				// #ifdef APP
				uni.navigateTo({ url: '/pages_A/login_password/login' });
				// #endif
			},
			null
		);
		return;
	} else {
		let res = await getCountCartPoints();
		if (res.code === 200) {
			cartCount.value = res.data;
		}
	}
};
const changeOrder = async () => {
	if (!detail.value.skus.length) return toast('请选择商品规格');
	// if (!addrId.value) return toast('请先添加地址');
	const res = await confirmPrShopOrder({
		shopCartItem: {
			spuId: pointsDetail.value.spuId,
			skuId: detail.value.skus[0].skuId,
			count: 1,
			shopId: detail.value.shopId,
		},
		dvyType: 3,
		addrId: 387,
		shopType: 1,
	});
	if (res.code == 200) {
		const ress = await submitPrShopCarOrder();
		console.log('查看的提交订单', ress);
		if (ress.code == 200) {
			uni.setStorageSync('orderIds', ress.data);
			toNav('/pages_A/points/payOrder');
		} else {
			uni.showtoast({ title: ress.msg, icon: 'none' });
		}
	} else {
		uni.showtoast({ title: ress.msg, icon: 'none' });
	}
};
// 收藏
const addcreateFun = async () => {
	let params = {
		spuId: pointsDetail.value.spuId,
		merchantType: 1,
		activityId: pointsDetail.value.id,
	};
	let res = await addcreate(params);
	if (res.code === 200) {
		collect.value = false;
		uni.showToast({ title: '加入收藏成功', icon: 'success' });
	}
};
const deletecreateFun = async () => {
	let params = {
		spuId: pointsDetail.value.spuId,
		activityId: pointsDetail.value.id,
		merchantType: 1,
	};
	let res = await deletecreate(params);
	if (res.code === 200) {
		collect.value = true;
		uni.showToast({ title: '取消收藏', icon: 'none' });
	}
};
const exitscreateFun = async (id: string | number) => {
	let params = {
		spuId: pointsDetail.value.spuId,
		merchantType: 1,
	};
	let res = await exitscreate(params);
	if (res.code == 200) {
		if (res.data == true) {
			collect.value = false;
		} else {
			collect.value = true;
		}
	}
};
// 点击切换
const currentTabFun = (val: number) => {
	currentTab.value = val;
	if (val == 1) {
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 300,
		});
	} else if (val == 1) {
		uni.pageScrollTo({
			scrollTop: 200,
			duration: 300,
		});
	} else {
		uni.pageScrollTo({
			scrollTop: 9999,
			duration: 300,
		});
	}
};
onLoad((opticon) => {
	console.log(opticon, 99999999);
	if (opticon.id) {
		detailId.value = opticon.id;
	}
	if (opticon.scene) {
		const scene = decodeURIComponent(opticon.scene);
		const params = parseQueryString(scene);
		detailId.value = params.id;
		console.log('87987779978909090-----------------', params);
	}
});
onShow(() => {
	if (isLogin.value) {
		shopCarTotal();
	}
	if (detailId.value) {
		getDetail(detailId.value);
	}
});
// 分享好友
onShareAppMessage((res) => {
	if (res.from === 'button') {
		// 来自页面内分享按钮
		console.log(res.target);
	}
	return {
		title: detail.value.name,
		path: '/pages_A/points/details?id=' + detailId.value,
	};
});
</script>
<style scoped lang="scss">
.zslw-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 85rpx;
	background: #fff;
	border-radius: 24rpx 24rpx 24rpx 24rpx;
	margin-top: 32rpx;
	padding: 0 22rpx;
	box-sizing: border-box;
}
.zslw-box-1 {
	display: flex;
	align-items: center;
	.zslw-box-text1 {
		font-weight: 700;
		font-size: 28rpx;
		color: #661b06;
	}
}
.zslw-box-2 {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 160rpx;
	height: 54rpx;
	background: linear-gradient(180deg, #ff716e 0%, #f23d4f 100%);
	border-radius: 6rpx 6rpx 6rpx 6rpx;
	font-weight: 700;
	font-size: 28rpx;
	color: #ffffff;
}
.goods_item_img-7 {
	width: 26rpx;
	height: 28rpx;
	margin-right: 12rpx;
}
.goods_item_img-4 {
	width: 26rpx;
	height: 26rpx;
	margin-right: 12rpx;
}

.miansha-box {
	display: flex;
	align-items: center;
	font-weight: 400;
	font-size: 26rpx;
	color: #fdfdfd;
	position: absolute;
	top: 0;
	right: 24rpx;
}

.goods_item_img-3 {
	width: 33rpx;
	height: 65rpx;
	margin-right: 12rpx;
}

.time {
	@include flex;
	align-items: center;

	&__custom {
		margin-top: 4px;
		width: 22px;
		height: 22px;
		background-color: #ff8e04;
		border-radius: 4px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;

		&__item {
			color: #fff;
			font-size: 12px;
			text-align: center;
		}
	}

	&__doc {
		color: #ff8e04;
		padding: 0px 4px;
	}

	&__item {
		color: #606266;
		font-size: 15px;
		margin-right: 4px;
	}
}

.goods_item_img-1 {
	width: 48rpx;
	height: 48rpx;
	margin-right: 12rpx;
}

.del-box {
	width: 138rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f1efec;
	border-radius: 8rpx;
	font-size: 22rpx;
	font-family: PingFang SC;
	font-weight: 700;
	color: #ff8e04;
	margin-left: 30rpx;
}

.goods_item_img-2 {
	width: 22rpx;
	height: 24rpx;
	margin-right: 8rpx;
}

.swiperBox {
	background: var(--label-color);
}

.shearBox {
	button {
		// width: 100rpx;
		// height: 100rpx;
		border: none !important;
		border-radius: 0;
		background: none;
		line-height: inherit;
	}

	button::after {
		border: none;
	}
}

.container {
	min-height: 100vh;
	background: #f1efec;
}

.indicator {
	@include flex(row);
	justify-content: center;

	&__dot {
		height: 12rpx;
		width: 12rpx;
		border-radius: 100px;
		background-color: rgba(255, 255, 255, 0.35);
		margin: 0 10rpx;
		transition: background-color 0.3s;

		&--active {
			background-color: #ffffff;
		}
	}
}

.indicator-num {
	padding: 4rpx 0;
	background-color: rgba(0, 0, 0, 0.35);
	border-radius: 100px;
	width: 70rpx;
	@include flex;
	justify-content: center;

	&__text {
		color: #ffffff;
		font-size: 12px;
	}
}

.header-card {
	position: fixed;
	top: 6rpx;
	left: 0;
	z-index: 10;
	padding: 0 30rpx;
	box-sizing: border-box;
	font-weight: 600;
	color: #333;
	display: flex;
	align-items: center;
	// #ifdef MP
	width: 74%;
	// #endif
	// #ifdef APP
	width: 100%;
	// #endif

	.btn-box {
		background: rgba(0, 0, 0, 0.26);
		border-radius: 50%;
		// opacity: 0.26;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 10rpx;
		margin-right: 16rpx;
	}
}

.content {
	width: 750rpx;
	// height: 2616rpx;

	border-radius: 26rpx;
	background: #f1efec;
	position: relative;
	z-index: 2;
	// top: 586rpx;
	margin-top: -30rpx;
	padding: 32rpx;
	box-sizing: border-box;

	.con-header {
		height: 130rpx;
		background: var(--but-color-line);
		border-radius: 26rpx 26rpx 0rpx 0rpx;
		padding: 34rpx 32rpx 58rpx;
		box-sizing: border-box;
		position: relative;
	}

	.con-info {
		width: 686rpx;
		height: 210rpx;
		background: #ffffff;
		border-radius: 26rpx;
		margin-top: -24rpx;
		padding: 40rpx 38rpx;
		box-sizing: border-box;
	}

	// 资讯
	.news_box {
		width: 690rpx;
		border-radius: 16rpx;
		background-color: #f8f9fa;
		padding: 32rpx 30rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		.news_title {
			width: 100%;
			display: flex;
			align-items: center;
			margin-bottom: 10rpx;
			> text:nth-child(2) {
				flex: 1 0;
				width: 0;
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-left: 26rpx;
			}
		}
		.news_cont {
			width: 100%;
			font-size: 28rpx;
			color: #666666;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-word;
		}
	}

	.con-details {
		background: #ffffff;
		border-radius: 26rpx;
		margin-top: 20rpx;
		padding: 35rpx 30rpx;

		.details-pro {
			width: 626rpx;
			height: 226rpx;
			background: #f5f5f5;
			border-radius: 20rpx;
			box-sizing: border-box;
			padding: 35rpx 36rpx;
			margin-top: 16rpx;
			justify-content: space-between;

			.label {
				width: 186rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #999999;
			}

			.value {
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;
			}
		}
	}

	::v-deep .u-tabs__wrapper__nav__line {
		height: 6rpx !important;
		background: linear-gradient(to bottom, #5ad6d6, #069fa4) !important;
		border-radius: 4rpx 4rpx 0rpx 0rpx !important;
		bottom: 0rpx !important;
	}

	.details-eva {
		background: #ffffff;
		border-radius: 26rpx;
		padding: 35rpx 30rpx;
		box-sizing: border-box;

		.eva-item {
			padding-bottom: 40rpx;
			border-bottom: 1rpx solid #ececec;

			.posView {
				padding-left: 60rpx;
				box-sizing: border-box;
			}

			.eva-info {
				font-weight: 500;
				font-size: 26rpx;
				color: #333333;
				line-height: 50rpx;
			}

			.eva-img-box {
				border-radius: 20rpx;
				// height: 164rpx;
				margin-top: 25rpx;
				grid-gap: 25rpx;
				flex-wrap: wrap;
				// overflow: hidden;

				.eva-img {
					width: 164rpx;
					height: 164rpx;
					font-weight: 500;
					font-size: 26rpx;
					color: #333333;
					line-height: 50rpx;
					border-radius: 16rpx 16rpx 16rpx 16rpx;
				}
			}
		}
	}
}

.bottom-bar {
	width: 750rpx;
	height: 158rpx;
	background: #ffffff;
	position: fixed;
	z-index: 9;
	bottom: 0;
	padding: 25rpx 30rpx 64rpx 30rpx;
	box-sizing: border-box;

	.btn {
		width: 250rpx;
		height: 78rpx;
		border-radius: 39rpx;
		font-weight: 500;
		font-size: 30rpx;
		text-align: center;
		line-height: 78rpx;
		box-sizing: border-box;
	}

	.btn1 {
		color: $color;
		background: #ffffff;
		border: 1px solid $color;
	}

	.btn2 {
		background: $bgLgColor;
		border-radius: 39rpx;
		color: #ffffff;
	}

	.pr {
		position: relative;
	}

	// .dot {
	// 	min-width: 28rpx;
	// 	height: 28rpx;
	// 	padding: 0 8rpx;
	// 	background: #F4190A;
	// 	border-radius: 50%;
	// 	font-weight: 500;
	// 	font-size: 20rpx;
	// 	color: #FFFFFF;
	// 	position: absolute;
	// 	top: -4rpx;
	// 	right: 0;
	// 	text-align: center;
	// 	line-height: 28rpx;
	// }
	/* 基础徽标：正圆（用于个位） */
	.dot {
		position: absolute;
		top: -4rpx;
		right: 0;
		height: 28rpx;
		min-width: 28rpx;
		padding: 0;
		background: #f4190a;
		border-radius: 14rpx;
		font-weight: 500;
		font-size: 20rpx;
		color: #ffffff;
		text-align: center;
		line-height: 28rpx;
		box-sizing: border-box;
		transform: translate(30%, -30%);
	}

	/* 个位（0-9）：保持正圆 */
	.dot--1 {
	}

	/* 两位数（10-99）：椭圆 */
	.dot--2 {
		padding: 0 10rpx;
		min-width: 28rpx;
	}

	/* 100+：显示 99+ */
	.dot--3 {
		padding: 0 8rpx;
		font-size: 18rpx;
		min-width: 36rpx;
	}
}

.btn-group {
	width: 55%;
	display: flex;
	border: 2rpx solid var(--primary-color);
	/* 边框颜色（和按钮主色一致） */
	border-radius: 28px;
	/* 圆角，根据按钮高度调整 */
	overflow: hidden;
	/* 裁剪子元素圆角外的部分 */
}

.btn-cart,
.btn-pay {
	flex: 1;
	padding: 15rpx 0;
	font-size: 28rpx;
	font-weight: 500;
	text-align: center;
	cursor: pointer;
	border: none;
	outline: none;
}

/* 加入购物车按钮样式 */
.btn-cart {
	background-color: #fff;
	color: var(--primary-color);
}

/* 立即支付按钮样式 */
.btn-pay {
	background-color: var(--primary-color);
	color: #fff;
}

.foot_cz {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 30rpx;
}

/* 标签栏样式 */
.tab-container {
	display: flex;
	width: 80%;
	/* 可根据需求调整宽度 */
	justify-content: space-between;
	margin: 0 auto;
}

/* 标签项基础样式 */
.tab-item {
	padding: 8rpx 0;
	cursor: pointer;
	position: relative;
	/* 用于伪元素定位 */
	color: #666;
	transition: color 0.3s ease;
}

/* 选中标签样式 */
.tab-item.active {
	font-weight: bold;
}

/* 选中标签下划线（带过渡动画） */
.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: -1px;
	/* 贴合底部边框 */
	left: 8rpx;
	width: 70%;
	height: 2px;
	background-color: var(--primary-color);
	transition: width 0.3s ease;
}

// /* 未选中标签的下划线（初始隐藏） */
// .tab-item::after {
// 	content: '';
// 	position: absolute;
// 	bottom: -1px;
// 	left:5rpx;
// 	width: 0;
// 	height: 2px;
// 	background-color: #00BEBE;
// 	transition: width 0.3s ease;
// }

/* 内容区域样式 */
.content-container {
	margin-top: 20px;
	padding: 16px;
}

/* 内容项基础样式（默认隐藏） */
.content-item {
	opacity: 0;
	visibility: hidden;
	transition: all 0.3s ease;
}

/* 显示的内容项样式 */
.content-item.show {
	opacity: 1;
	visibility: visible;
}

.tab-box {
	background: #ffffff;
	border-radius: 26rpx;
	padding: 35rpx 30rpx;
	box-sizing: border-box;
	margin-top: 35rpx;
}

.tab-fenxiang {
	display: flex;
	align-items: center;
	width: 140rpx;
	height: 52rpx;
	font-size: 26rpx;
}

.details-parse {
	font-size: 26rpx;
	color: #333333;
	margin-top: 60rpx;
}

.img-wrap {
	width: 100%;
	height: 350px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: transparent;
}

.swp-img {
	max-width: 100%;
	max-height: 100%;
	width: 100%;
	height: 100%;
	display: block;
}
</style>
