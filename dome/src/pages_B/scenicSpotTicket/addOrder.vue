<template>
	<view class="pagess" :data-theme="pageTheme">
		<!-- <up-navbar title="预定" leftIconSize="22" bgColor="#FFFFFF" placeholder fixed autoBack
			:titleStyle="{fontWeight: 'bold'}"></up-navbar> -->
		<up-navbar title="预定" bgColor="transparent" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
		<view class="pageView">
			<view v-if="pageType == 'tickets'" class="cardBox u-m-b-24" style="padding: 32rpx 16rpx">
				<view class="cardBox-name" style="padding: 0 16rpx">{{ scenicSpotTicketinfo.poiName }}</view>
				<up-gap height="12"></up-gap>
				<view class="timeCard fl-ce-sb">
					<view class="fl-al-ce">
						<image class="timeCard-leftimg" :src="imgUrl + 'static/B-scen-order-icon.png'" mode=""></image>
						<view>
							<view class="timeCard-leftText">{{ mpinfo.dateSelect }}{{ mpinfo.label }}</view>
							<up-gap height="8"></up-gap>
							<view class="timeCard-leftText">{{ mpinfo.lotSelect }}{{ mpinfo.timeSelect }} 入园</view>
						</view>
					</view>
					<view class="fl-al-ce" @click="ticketOpen">
						<text class="timeCard-rightText">修改</text>
						<up-icon name="arrow-down-fill" :color="themeStore.themeColors.$primaryColor" size="12"></up-icon>
					</view>
				</view>
			</view>
			<view v-else class="cardBox u-m-b-24" style="padding: 32rpx 16rpx">
				<view class="cardTBox-name" v-if="pageType == 'annual'" style="padding: 0 16rpx"
					>[2025西安游览年票]仅需79元/张 一票畅玩翠华山 ，塔云山，动物园与海洋馆，多家温泉+优质景区</view
				>
				<view class="cardTBox-name" v-if="pageType == 'rights'" style="padding: 0 16rpx">xxx景区，xxx景区等九折权益卡 </view>
				<up-gap height="12"></up-gap>
				<view class="timeCard">
					<view class="timeCard-leftText">使用日期:预计日期截止到指定日期2025-12-31 有效</view>
					<up-gap height="8"></up-gap>
					<view class="timeCard-leftText">使用时间:不限</view>
				</view>
			</view>

			<view class="cardBox u-m-b-24">
				<view class="cardBox-name">填写数量</view>
				<view v-if="pageType == 'tickets'">
					<view class="teckBox" :style="{ height: openShow ? 'auto' : '200rpx' }">
						<view>
							<up-line color="rgba(0,0,0,0.06)" v-if="index > 0"></up-line>
							<up-gap height="16"></up-gap>
							<view class="fl-ce-sb">
								<view>
									<view class="teckName">{{ menpiaolist.productName }}</view>
									<up-gap height="12"></up-gap>
									<view class="iconBox fl-al-ce">
										<view class="iconBox-item iconsColor1">随买随用</view>
										<view class="iconBox-item iconsColor2">随时退</view>
									</view>
								</view>
								<view class="fl-al-ce">
									<view class="deaPric u-m-r-12">
										<text class="fh" style="font-size: 24rpx !important">￥</text>
										<text class="num" style="font-size: 32rpx !important">{{ totalAmount }}</text>
									</view>
									<up-number-box v-model="menpiaolist.minNum" @change="totalNumbelChange" max="5" bgColor="none">
										<template #minus>
											<up-icon name="minus-circle" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
										</template>
										<template #plus>
											<up-icon name="plus-circle-fill" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
										</template>
									</up-number-box>
								</view>
							</view>
							<template>
								<up-gap height="16"></up-gap>
								<view class="texkText">每笔订单最多购买5张</view>
							</template>
							<up-gap height="16"></up-gap>
						</view>
					</view>
					<up-gap height="16"></up-gap>
					<view class="openBox fl-ce-ce" @click="openShow = !openShow">
						<text class="u-m-r-5">{{ openShow ? '收起' : '展开' }}</text>
						<up-icon :name="openShow ? 'arrow-up' : 'arrow-down'" size="11"></up-icon>
					</view>
				</view>
				<view v-else>
					<up-gap height="10"></up-gap>
					<view class="fl-ce-sb">
						<view class="deaPric u-m-r-12">
							<text class="fh" style="font-size: 24rpx !important">￥</text>
							<text class="num" style="font-size: 32rpx !important">{{ unitPrice }}/张</text>
						</view>
						<up-number-box v-model="totalNumbel" bgColor="none">
							<template #minus>
								<up-icon name="minus-circle" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
							</template>
							<template #plus>
								<up-icon name="plus-circle-fill" size="20" :color="themeStore.themeColors.$primaryColor"></up-icon>
							</template>
						</up-number-box>
					</view>
				</view>
			</view>
			<view v-if="pageType != 'rights'">
				<view class="cardBox u-m-b-24">
					<view class="cardBox-name">游客信息</view>
					<view class="peopBox">
						<up-gap height="16"></up-gap>
						<view class="peopBox-name">{{ menpiaolist.productName }}</view>
						<up-gap height="12"></up-gap>
						<view class="peopView fl-al-ce">
							<view v-for="(item, index) in rlist" :key="index" >
								<view class="peopView-item " :style="{
									color: themeStore.themeColors.$primaryColor,
									background: themeStore.themeColors.$badgeBgColor,
									borderColor: themeStore.themeColors.$primaryColor,
								}" v-if="item.name">{{ item.name }}</view>
							</view>
							<view @click="toeite()" class="peopView-item">新增/编辑游客</view>
						</view>
					</view>
					<!-- <view class="peopBox" v-if="pageType == 'tickets'">
						<up-gap height="16"></up-gap>
						<view class="peopBox-name">学生票(需至少添加1位)</view>
						<up-gap height="12"></up-gap>
						<view class="peopView fl-al-ce">
							<view class="peopView-item peopAcitve">张小明</view>
							<view class="peopView-item">新增/编辑游客</view>
						</view>
					</view> -->
				</view>
				<view class="cardBox u-m-b-24">
					<view class="cardBox-name">联系人信息</view>
					<up-gap height="20"></up-gap>
					<view class="fl-al-ce">
						<view class="labelBox">手机号</view>
						<view class="tetxCnetBox">
							<up-input
								v-model="formData.tel"
								placeholder="请输入手机号码"
								placeholderStyle="color: #9C948D"
								type="number"
								maxlength="11"
								fontSize="28rpx"
								border="none"
							>
							</up-input>
						</view>
					</view>
				</view>
			</view>

			<!-- <view class="cardBox u-m-b-24">
				<view class="cardBox-name">本单可享</view>
				<up-gap height="20"></up-gap>
				<view class="fl-ce-sb">
					<view class="labelBox">优惠券</view>
					<view class="fl-al-ce" @click="coupOpen">
						<text class="yhText fs-28 m-r-10">-{{ copAmount }}元</text>
						<up-icon name="arrow-right" size="12"></up-icon>
					</view>
				</view>
			</view> -->
			<!-- <view class="xzBox">购买须知</view> -->
		</view>
		<!-- 底部 -->
		<view class="fixBox fl-ce-sb">
			<view>
				<view class="deaPric">
					<text class="fh">￥</text>
					<text class="num">{{ totalAmount }}</text>
				</view>
				<!-- <up-gap height="8"></up-gap>
				<view class="yhText fs-24">已优惠¥{{copAmount}}</view> -->
			</view>
			<!-- toNav('/pages_B/scenicSpotTicket/confirmOrder?type='+pageType) -->
			<view class="fixBut-1" @click="gopayment">去支付</view>
		</view>
		<up-gap height="80"></up-gap>

		<!-- 优惠券 -->
		<CouponPopup ref="couponRef"></CouponPopup>
		<!-- 选择时间 -->
		<TicketsTimePopup ref="ticketsTimeRef"></TicketsTimePopup>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad, onPageScroll, onReady, onShow } from '@dcloudio/uni-app';
import CouponPopup from './components/CouponPopup.vue';
import TicketsTimePopup from './components/TicketsTimePopup.vue';
import { toNav, toBack } from '@/utils/route';
import { postcompute, postpayScenicSpotOrder } from '@/api/scenicArea';
import { imgUrl } from '@/config';
import theme from '@/utils/theme';
const backgroundColor = ref<string>('#D1E5F9');
// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);

const couponRef = ref(null);
const ticketsTimeRef = ref(null);
const pageType = ref('tickets'); // tickets ,annual,rights
const productId = ref('');
const openShow = ref(false);
const mpinfo = ref({});
const scenicSpotTicketinfo = ref({});
const formData = ref({
	tel: '',
});
//单价 年卡和权益卡
const unitPrice = ref(88);
const totalNumbel = ref(1);
const rlist = ref([]);
onShow(() => {
	if (uni.getStorageSync('contacts')) {
		rlist.value = uni.getStorageSync('contacts');
		uni.removeStorageSync('contacts');
	}
});
// 总价
const oldTotalAmouont = computed(() => {
	let total: number = 0;
	for (let item of ticketsList.value) {
		total += item.price * item.number;
	}

	return total.toFixed(2);
});
const toeite = () => {
	uni.navigateTo({
		url: '/pages_B/scenicSpotTicket/contactsList',
	});
};
// 去支付
const gopayment = async () => {
	if(!rlist.value.length) return uni.showToast({title: '请填写游客信息',icon: 'none'});
	if(!formData.value.tel) return uni.showToast({title: '请填写联系人信息',icon: 'none'});
	const mobileReg = /^1[3-9]\d{9}$/
	if (!mobileReg.test(formData.value.tel)) {
		uni.showToast({ title: '手机号格式不正确', icon: 'none' })
		return false
	}
	let id = uni.getStorageSync('invitationId') ? uni.getStorageSync('invitationId') : '657649';
	let params = {
		productId: menpiaolist.value.productId,
		poiId: scenicSpotTicketinfo.value.poiId,
		quantity: menpiaolist.value.minNum,
		travelDate: mpinfo.value.date,
		buyer: rlist.value[0].name,
		mobile: formData.value.tel,
		timeSlot: JSON.stringify({
			startTime: mpinfo.value.timeSelect.split('-')[0],
			endTime: mpinfo.value.timeSelect.split('-')[1],
		}),
		sysIdentityInfoIds: rlist.value,
		distributionMemberId: id,
	};
	console.log("提交的数据", params)
	let res: any = await postpayScenicSpotOrder(params);
	if (res.code == 200) {
		uni.showToast({
			title: '创建成功',
			icon: 'none',
		});
		uni.redirectTo({
			url: '/pages_B/scenicSpotTicket/confirmOrder?id=' + res.data.orderId,
		});
	} else {
		uni.showToast({
			title: res.msg,
			icon: 'none',
		});
	}
};

const getpic = async (e) => {
	console.log(mpinfo.value.data, 'mpinfo.value.data');
	let params = {
		productId: menpiaolist.value.productId,
		count: e,
		date: mpinfo.value.date,
	};
	let res: any = await postcompute(params);
	totalAmount.value = res.data;
	console.log(res, 'ssssssssssssssssssssssss');
};
// 优惠外的总价
const totalAmount = ref(0);
const totalNumbelChange = (e) => {
	getpic(e.value);
};
const copAmount = ref(25);
const ticketsList = ref([
	{ name: '门票(成人票)', price: 168, number: 1, text: '同一身份证一天最多购买10张' },
	{ name: '门票(学生票)', price: 84, number: 1, text: '' },
	{ name: '门票(退役军人票)', price: 84, number: 1, text: '' },
]);
// 预定票选择规格弹窗
const coupOpen = () => {
	console.log('0000000');
	couponRef.value.open();
};
// 预定票选择规格弹窗
const ticketOpen = () => {
	ticketsTimeRef.value.open(mpinfo.value);
};
const menpiaolist = ref({});
onLoad((opticon) => {
	scenicSpotTicketinfo.value = uni.getStorageSync('scenicSpotTicketinfo');
	mpinfo.value = uni.getStorageSync('mpinfo');
	console.log("传递的参数", mpinfo.value)
	// uni.removeStorageSync('scenicSpotTicketinfo')
	// uni.removeStorageSync('mpinfo')
	if (uni.getStorageSync('contacts')) {
		rlist.value = uni.getStorageSync('contacts');
		uni.removeStorageSync('contacts');
	}
	let arr = [];
	arr = scenicSpotTicketinfo.value.productGroupVoList[0].odsJjbProductVoList;
	arr.forEach((item, index) => {
		if (mpinfo.value.productId == item.productId) {
			menpiaolist.value = item;
			console.log('menpiaolist.value', menpiaolist.value );
		}
	});
	
	if (pageType.value != 'tickets') {
		openShow.value = true;
	}
	getpic(1);
});
</script>

<style lang="scss">
@import url('./style.scss');

.pagess {
	background: var(--head-color);
}

.pageView {
	padding: 32rpx;
	box-sizing: border-box;
}

.cardBox {
	width: 100%;
	border-radius: 16rpx;
	background: #ffffff;
	padding: 32rpx;
	box-sizing: border-box;
	/* 卡片投影 */
	box-shadow: 0px 8px 20px 0px rgba(138, 78, 0, 0.05);

	.cardBox-name {
		font-size: 36rpx;
		font-weight: bold;
		line-height: 36rpx;
		color: #333333;
	}

	.cardTBox-name {
		font-weight: 700;
		font-size: 32rpx;
		color: #333333;
		line-height: 48rpx;
	}
}

.fixBut-1 {
	width: 252rpx;
	height: 96rpx;
	border-radius: 48rpx;
	background: var(--primary-color);
	font-size: 32rpx;
	font-weight: 700;
	line-height: 96rpx;
	text-align: center;
	color: #fff;
}

.timeCard {
	height: 112rpx;
	background: linear-gradient(270deg, #fdfdfd 0%, #f9f7f6 54%, #fcfcfb 100%);
	padding: 20rpx 24rpx;
	box-sizing: border-box;

	.timeCard-leftimg {
		width: 34rpx;
		height: 34rpx;
		margin-right: 16rpx;
	}

	.timeCard-leftText {
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
		line-height: 24rpx;
	}

	.timeCard-rightText {
		font-weight: 400;
		font-size: 24rpx;
		color: var(--primary-color);
		line-height: 24rpx;
		margin-right: 10rpx;
	}
}

.teckBox {
	overflow: hidden;
	/* 超出部分隐藏 */
}

.teckName {
	font-weight: 500;
	font-size: 32rpx;
	color: #333333;
	line-height: 32rpx;
}

.texkText {
	font-weight: 400;
	font-size: 24rpx;
	color: #999999;
	line-height: 24rpx;
}

.iconBox {
	flex-wrap: wrap;

	.iconBox-item {
		font-size: 24rpx;
		font-weight: normal;
		line-height: 24rpx;
		padding: 8rpx;
		box-sizing: border-box;
		border: 1rpx solid none;
		border-radius: 8rpx;
		margin-right: 10rpx;
	}

	.iconsColor1 {
		color: var(--primary-color);
		background: rgba(255, 144, 0, 0.1);
	}

	.iconsColor2 {
		border: 1rpx solid #999999;
		color: #999999;
	}
}

.openBox {
	width: 120rpx;
	height: 48rpx;
	background: #ffffff;
	border-radius: 32rpx 32rpx 32rpx 32rpx;
	border: 2rpx solid #e5e5e5;
	font-weight: 400;
	font-size: 24rpx;
	color: #666666;
	line-height: 24rpx;
	margin: 0 auto;
}

.labelBox {
	width: 130rpx;
	font-weight: 400;
	font-size: 28rpx;
	color: #666666;
	line-height: 28rpx;
}

.peopView {
	flex-wrap: wrap;

	.peopView-item {
		padding: 22rpx 32rpx;
		box-sizing: border-box;
		background: rgba(241, 240, 239, 0.7);
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid none;
		font-weight: 350;
		font-size: 28rpx;
		color: #666666;
		line-height: 28rpx;
		margin-right: 16rpx;
		border: 2rpx solid rgba(241, 240, 239, 0.7); 
	}

	.peopAcitve {
		background: #f7f0e4 !important;
		border: 2rpx solid $color !important;
		color: $color !important;
	}
}

.tetxCnetBox {
	font-weight: 400;
	font-size: 28rpx;
	color: #333333;
	line-height: 28rpx;
}

.xzBox {
	font-size: 28rpx;
	font-weight: normal;
	line-height: 28rpx;
	color: #333333;
}
</style>
