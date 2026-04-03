<template>
	<view class="box" :data-theme="pageTheme">
		<view id="navBar" style="position: fixed;top: 0;left: 0;z-index: 9999;width: 100%;">
			<up-navbar title=" " leftIconSize="22" :bgColor="navBgColor" :placeholder="false" :fixed="false"
				:titleStyle="{fontWeight: 'bold'}">
				<template #left>
					<up-icon :name="imgUrl+'static/B-scen-back-icon.png'" size="28" @click="toBack"></up-icon>
				</template>
				<!-- #ifdef MP-WEIXIN -->
				<template #center>
					<view class="navCenter fl-al-ce">
						<up-icon :name="imgUrl+'static/B-scen-coll-icon.png'" size="28"></up-icon>
					</view>
				</template>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<template #right>
					<up-icon :name="imgUrl+'static/B-scen-coll-icon.png'" size="28"></up-icon>
				</template>
				<!-- #endif -->
			</up-navbar>
		</view>

		<!-- 轮播图 -->
		<view class="swipBox" id="swipId">
			<swiper class="swipBox-swp" :current="swpCurrent" :autoplay="true" :circular="true">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<up-image :src="item.url" width="750rpx" height="490rpx"></up-image>
				</swiper-item>
			</swiper>
			<!-- <view class="swipBox-dots fl-al-ce">
				<text>{{swpCurrent + 1}}/{{swiperList.length}}</text>
				<up-icon name="arrow-right" size="10" color="#FFFFFF"></up-icon>
			</view> -->
		</view>
		<!-- 详情内容 -->
		<view id="cardId" class="cardBox" v-if="pageType == 'tickets'">
			<view class="deaName fl-al-ce">
				<text class="texNoWrap m-r-15">{{scebinfo.poiName}}</text>
				<up-icon :name="imgUrl+'static/B-scen-detail-icons.png'" size="20"></up-icon>
			</view>
			<up-gap height="12"></up-gap>

			<view class="fl-ce-sb">
				<view class="deaTime">
					开放时间:{{scebinfo.productGroupVoList[0].odsJjbProductVoList[0].odsJjbStockVo.timeSlot[0]?.startTime||'8:00'}}
					~
					{{scebinfo.productGroupVoList[0].odsJjbProductVoList[0].odsJjbStockVo.timeSlot[0]?.endTime||'22:00'}}
				</view>
				<view class="fl-al-ce" @click="shearOpen">
					<up-icon :name="imgUrl+'static/share-icon1.png'" size="20"></up-icon>
					<text
						style="font-weight: 400;font-size: 28rpx;color: #333333;line-height: 28rpx;margin-left: 10rpx;">分享</text>
				</view>
			</view>
			<up-gap height="12"></up-gap>
			<view class="deaPric">
				<text class="fh">￥</text>
				<text
					class="num">{{scebinfo.productGroupVoList[0].odsJjbProductVoList[0].odsJjbStockVo.salesPrice ||''}}</text>
				<text class="dw">起</text>
			</view>
			<up-gap height="16"></up-gap>
			<view class="fl-ce-sb">
				<view style="width: 430rpx;">
					<view class="deaAddr texNoWrap">{{scebinfo.address}}</view>
					<up-gap height="12"></up-gap>
					<view class="fl-al-ce">
						<up-icon name="map" size="12"></up-icon>
						<text class="deaJl texNoWrap">距您{{scebinfo.straightLineDistance}}</text>
					</view>
				</view>
				<view class="fl-al-ce">
					<view class="deaIcon" v-if="scebinfo?.poiPhone" @click.stop="makePhoneCall(scebinfo.poiPhone)">
						<up-icon :name="imgUrl+'static/B-scen-tel-icon.png'" size="40"></up-icon>
						<view class="m-t-10">电话</view>
					</view>
					<view class="deaIcon m-l-30" @click.stop="addrsOpen(scebinfo)">
						<up-icon :name="imgUrl+'static/B-scen-address-icon.png'" size="40"></up-icon>
						<view class="m-t-10">地图</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view id="cardId" class="cardBox" v-if="pageType != 'tickets'">
			<view class="deaNameTwo">[2025西安游览年票]仅需79元/张 一票畅玩翠华山 ，塔云山，动物园与海洋馆，多家温泉+优质景区</view>
			<up-gap height="12"></up-gap>
			<view class="fl-ce-sb">
				<view>
					<view class="deaPric">
						<text class="fh">￥</text>
						<text class="num">79</text>
						<text class="old">￥88</text>
					</view>
					<up-gap height="10"></up-gap>
					<view class="deaIconBox">不支持退票</view>
				</view>
				<view class="deaIcon">
					<up-icon :name="imgUrl+'static/B-scen-tel-icon.png'" size="40"></up-icon>
				</view>
			</view>
			<up-gap height="12"></up-gap>
			<view class="sytextBox">使用日期:预计日期截止到指定日期2025-12-31 有效</view>
			<up-gap height="12"></up-gap>
			<view class="sytextBox">使用时间:不限</view>
		</view> -->
		<!-- 门票内容 -->
		<view>
			<up-sticky bgColor="#FFFFFF" :offsetTop="tabsHeight">
				<view id="tabId">
					<view class="tabs" v-if="pageType == 'tickets'">
						<view :class="['tabs-item', tabsId == item.id?'tabsActive':'']"
							v-for="(item,index)  in tabsList" :key="index" @click.stop="tabsChane(item)">
							<view class="tabs-item-text">{{item.name}}</view>
							<view class="tabs-item-line"></view>
						</view>
					</view>
					<view class="tabs" v-else>
						<view :class="['tabs-item', tabsId == item.id?'tabsActive':'']"
							v-for="(item,index)  in tabsListTwo" :key="index" @click.stop="tabsChane(item)">
							<view class="tabs-item-text">{{item.name}}</view>
							<view class="tabs-item-line"></view>
						</view>
					</view>
					<up-line color="rgba(0, 0, 0, 0.06)"></up-line>
				</view>
			</up-sticky>
			<template v-if="tabsId == 1">
				<view v-if="pageType == 'tickets'" class="ticketBox"
					:style="{maxHeight:`calc(100vh - ${ticketTabsHeight}px)`}">
					<view class="ticketBox-tabs" :style="{maxHeight:`calc(100vh - ${ticketTabsHeight}px)`}">
						<view v-for="(item,index) in scebinfo.productGroupVoList"
							:class="['ticketBox-tabs-item',ticketTabType == item.groupName?'ticketActive':'']"
							@click="ticketTabs(item)">{{item.groupName}}</view>
						<!-- 	<view :class="['ticketBox-tabs-item',ticketTabType == 2?'ticketActive':'']"
							@click="ticketTabs(2)">门票套餐</view> -->
					</view>
					<scroll-view class="ticketBox-list" :scroll-y="true"
						:style="{maxHeight:`calc(100vh - ${ticketTabsHeight}px)`}">
						<view v-for="(item,index) in dataList" :key="index">
							<view class="lisBox fl-ce-sb">
								<view>
									<view class="lisBox-name">{{item.productName}}</view>
									<up-gap height="12"></up-gap>
									<view class="lisBox-sales">已售1000+</view>
									<up-gap height="12"></up-gap>
									<view class="lisBox-icons fl-al-ce">
										<view class="lisBox-icons-item iconsColor1">随买随用</view>
										<view @click="openxizhi(item)" class="lisBox-icons-item  iconsColor2">购买须知
										</view>
										<view style="color: red;font-size: 20rpx;"
											v-if="item.odsJjbStockVo.quantity<=5">剩余{{item.odsJjbStockVo.quantity}}
										</view>
									</view>
								</view>
								<view class="lisBox-right">
									<view class="deaPric">
										<text class="fh">￥</text>
										<text class="num">{{item.odsJjbStockVo.salesPrice}}</text>
										<text class="dw">起</text>
									</view>
									<up-gap height="14"></up-gap>
									<view class="tetxIcon" @click="ticketOpen(item)">订</view>
								</view>
							</view>
							<up-gap height="10"></up-gap>
						</view>
						<up-gap height="250"></up-gap>
					</scroll-view>
				</view>
				<!-- <view v-if="pageType == 'annual'" class="centBox">
					<view class="centBox-name">2025西安游览年票</view>
					<up-gap height="10"></up-gap>
					<view class="centBox-text">—— 80+优质景区一票畅玩 ——</view>
					<view class="centBox-text">钜惠价79元/张</view>
					<view class="centBox-text"> 总价值近5000元</view>
					<view class="centBox-text m-t-40">温馨提示：各景区具体使用时间请看景区列表详情，部分景区指定使用月份，逾期无效。详情以“西安游览年票”</view>
					<view class="centBox-text m-t-40">微信公众号-“目录”为准”公众号内各景区使用</view>
					<view class="centBox-text">使用方式：一人一卡，不可转借。使用时向工作人员出示 公众号“绑定验票”栏目中验票扫码核销。本年卡各景区使用规则以官方公众号为准。</view>
					<view class="centBox-text m-t-40">
						年卡绑定激活流程：购买成功后凭收到的手机短信内激活码，在“西安游览年票”公众号底部菜单点击“绑定验票”进入实名认证后生成电子年卡即可使用。</view>
				</view> -->
				<!-- <view v-if="pageType == 'rights'" class="centBox">
					<view class="centBox-name">2025西安游览权益卡</view>
					<up-gap height="10"></up-gap>
					<view class="centBox-text">xxx景区、xxx景区等9折权益卡每个景区只能使用一次折扣领取3个月内有效，超期失效xxx景区、xxx景区等9折权益卡</view>
					<view class="centBox-text">每个景区只能使用一次折扣领取3个月内有效，超期失效xxx景区、xxx景区等9折权益卡每个景区只能使用一次折扣</view>
					<view class="centBox-text">领取3个月内有效，超期失效xxx景区、xxx景区等9折权益卡</view>
					<view class="centBox-text">每个景区只能使用一次折扣领取3个月内有效，超期失效</view>
					<view class="centBox-text">xxx景区、xxx景区等9折权益卡每个景区只能使用一次折扣</view>
					<view class="centBox-text">领取3个月内有效，超期失效</view>
					<view class="centBox-text">产品描述</view>
				</view> -->
			</template>
			<template v-if="tabsId == 2">
				<view class="centBox">
					<view class="centBox-card">
						<view class="centBox-name">景区介绍</view>
						<up-gap height="8"></up-gap>
						<view class="centBox-text">{{scebinfo.introduction}}</view>
					</view>

				</view>
			</template>

		</view>
		<!-- 底部 -->
		<template v-if="pageType != 'tickets'">
			<view class="fixBox fl-ce-sb">
				<view>
					<view class="deaPric">
						<text class="fh">￥</text>
						<text class="num">79</text>
					</view>
				</view>
				<view class="fixBut" @click="toNav('/pages_B/scenicSpotTicket/addOrder?type='+pageType)">预定</view>
			</view>
			<up-gap height="80"></up-gap>
		</template>
		<up-popup :show="gmshow" @close="close" round="8">
			<view class="centBox">
				<view class="centBox-card">
					<view class="centBox-name">购买须知</view>
					<up-gap height="8"></up-gap>
					<view class="centBox-text">重要条款:{{gmtit.importantNote||''}}</view>
					<up-gap height="16"></up-gap>
					<view class="centBox-text">景点内门票包含项目:{{gmtit.containProjects||''}}</view>
					<up-gap height="16"></up-gap>
					<view class="centBox-text">对于门票种类(人群)的补充说明:{{gmtit.userTypeNote||''}}</view>
					<up-gap height="16"></up-gap>
					<view class="centBox-text">取票地点:{{gmtit.voucherAddr||''}}</view>
					<up-gap height="16"></up-gap>
					<view class="centBox-text">取票时间:{{gmtit.voucherTime||''}}</view>
					<up-gap height="16"></up-gap>
					<view class="centBox-text">兑换方式:{{gmtit.voucherWay||''}}</view>
				</view>

			</view>
		</up-popup>
		<TicketsTimePopup :info='productId' ref="ticketsTimeRef"></TicketsTimePopup>
		<Share ref="shearRef" pageType="scenicSpotTicket" :itemObj="scebinfo" :invitationId='invitationId'></Share>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { makePhoneCall, openLocation, openAPPLocation } from '@/utils/util';
	import { parseQueryString } from '@/utils/util';
	import TicketsTimePopup from './components/TicketsTimePopup.vue';
	import Share from '@/components/Share/index';
	import { useElementRects } from '@/utils/useElementRect';
	import { onLoad, onPageScroll, onReady, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
	import { odsJjbScenicSpotid, odsJjbScenicSpotpic } from '@/api/scenicArea';
	import { useTheme } from '@/composables/useTheme';
	const { queryAll } = useElementRects(['#navBar', '#tabId'])
	const shearRef = ref(null);
	const pageType = ref('tickets');// tickets ,annual,rights
	const ticketsTimeRef = ref(null);
	const poiId = ref('');
	const tabsHeight = ref(60);
	const ticketTabsHeight = ref(100); //门票内容距离顶部的距离，通过改距离计算门票内容高度
	const scebinfo = ref({})
	const productId = ref({})
	const gmshow = ref(false)
	const invitationId = ref({})
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = computed(() => {
		return themeStore.imgUrl
	})
	const close = () => {
		gmshow.value = false
	}
	const gmtit = ref({})
	const navBgColor = ref('transparent')
	const swpCurrent = ref<number>(0);
	const swiperList = ref([
		{ url: imgUrl + 'del/details.png' },
		{ url: imgUrl + 'del/details.png' },
		{ url: imgUrl + 'del/details.png' },
		{ url: imgUrl + 'del/details.png' },
	])

	const tabsId = ref<number>(1);
	const tabsList = ref([
		{ name: '预定', id: 1 },
		// { name: '景区介绍', id: 2 },

	])
	const tabsListTwo = ref([
		{ name: '预定须知', id: 1 },
		{ name: '产品描述', id: 2 },
	])
	const ticketTabType = ref(1)
	const dataList = ref([
	]);
	const tabsChane = (item) => {
		tabsId.value = item.id
	}

	const ticketTabs = (type) => {
		ticketTabType.value = type.groupName;
		dataList.value = type.odsJjbProductVoList
	}
	// 预定票选择规格弹窗
	const ticketOpen = (item) => {
		// getpic(item)
		productId.value = item
		ticketsTimeRef.value.open(item)
	}
	const openxizhi = (item) => {
		gmshow.value = true
		gmtit.value = item.odsJjbBuyNoteVo || {}
	}
	const addrsOpen = (item) => {
		// #ifdef APP
		let start = { "lat": 34.2778, "lng": 108.953098, "address": "西安市" }
		if (uni.getStorageSync('address')) {
			start.lat = uni.getStorageSync('address').lat
			start.lng = uni.getStorageSync('address').lng
			start.address = uni.getStorageSync('address').standardAddress || uni.getStorageSync('address').city
		}
		openAPPLocation({
			startLocation: {
				longitude: start.lng,
				latitude: start.lat,
				address: start.address,
			},
			endLocation: {
				longitude: item.longitude,
				latitude: item.latitude,
				address: item.poiName,
			}
		})
		// #endif
		// #ifdef MP-WEIXIN
		openLocation({ latitude: item.latitude, longitude: item.longitude, name: item.poiName })
		// #endif

	}
	const handleQuery = async () => {
		try {
			const result = await queryAll()
			if (result.length) {
				let totalHeight = 0;
				for (let i in result) {
					if (result[i].id == 'navBar') {
						tabsHeight.value = result[i].height
					}
					if (result[i].id == 'tabId') {

					}
					totalHeight += result[i].height
				}
				ticketTabsHeight.value = totalHeight
			}

		} catch (err) {
		}
	}
	const shearOpen = () => {
		shearRef.value.open()
	}
	onLoad((opticon) => {
		if (opticon.id) {
			poiId.value = opticon.id
		}
		if (opticon.memberShowId) {
			invitationId.value = opticon.memberShowId
		}
		if (opticon.scene) {
			const scene = decodeURIComponent(opticon.scene);
			const params = parseQueryString(scene);
			poiId.value = params.id
			invitationId.value = params.invitationId
			uni.setStorageSync('invitationId', params.invitationId);
			console.log('87987779978909090-----------------', params);
		}
		getdel()
	})
	const getdel = async () => {
		let params = {
			id: poiId.value,
			lat: uni.getStorageSync('address').lat,
			lng: uni.getStorageSync('address').lng
		}

		try {
			let res : any = await odsJjbScenicSpotid(params);
			console.log(res);
			if (res.code == 200) {
				scebinfo.value = res.data
				uni.setStorageSync('scenicSpotTicketinfo', scebinfo.value);
				ticketTabType.value = scebinfo.value.productGroupVoList[0].groupName || '';
				dataList.value = scebinfo.value.productGroupVoList[0].odsJjbProductVoList || []
				let images = res.data.images ? JSON.parse(res.data.images) : []
				swiperList.value = images.length ? images.map(item => {
					return { url: item }
				}) : [],
					console.log('9887798', swiperList.value);
			} else {
				uni.showToast({ title: res.msg, icon: 'none' })
			}
		} catch (err) {

		}
	}
	onShareTimeline((res) => {
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log(res.target)
		}
		let path = '/pages_B/scenicSpotTicket/detail?id=' + scebinfo.value.id;
		let imageUrl = '';
		if (JSON.parse(scebinfo.value.images).length) {
			imageUrl = JSON.parse(scebinfo.value.images)[0]
		}

		return {
			title: scebinfo.value.poiName,
			path: path,
			imageUrl: imageUrl,
		}
	})
	onShareAppMessage((res) => {
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log(res.target)
		}
		let path = '/pages_B/scenicSpotTicket/detail?id=' + scebinfo.value.id;
		let imageUrl = '';
		if (JSON.parse(scebinfo.value.images).length) {
			imageUrl = JSON.parse(scebinfo.value.images)[0]
		}

		return {
			title: scebinfo.value.poiName,
			path: path,
			imageUrl: imageUrl,
		}
	})
	onReady(() => {
		nextTick(() => {
			setTimeout(() => {
				handleQuery()
			}, 50)
		})
		// 初始化状态栏颜色
		uni.setNavigationBarColor({
			frontColor: "#ffffff",
			backgroundColor: "#131313"
		})
	})
	onPageScroll((e) => {

		if (e.scrollTop < 50) {
			navBgColor.value = 'transparent'
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#ffffff"
			})
		} else {
			navBgColor.value = "#FFFFFF"
			uni.setNavigationBarColor({
				frontColor: "#ffffff",
				backgroundColor: "#131313"
			})
		}
	})
</script>

<style lang="scss">
	@import url('./style.scss');

	page {
		background: #F6F5F4;
	}

	.navCenter {
		width: calc(100% - 400rpx);
		justify-content: flex-end;
	}

	.swipBox {
		width: 100%;
		position: relative;
		top: 0;
		left: 0;

		.swipBox-swp {
			width: 100%;
			height: 490rpx;
		}

		.swipBox-dots {
			position: absolute;
			right: 48rpx;
			bottom: 56rpx;
			z-index: 1;
			background: rgba(0, 0, 0, 0.7);
			border-radius: 32rpx 32rpx 32rpx 32rpx;
			padding: 0 30rpx;
			min-width: 120rpx;
			height: 48rpx;
			box-sizing: border-box;
			font-weight: 400;
			font-size: 20rpx;
			color: #FFFFFF;
			line-height: 24rpx;

			text {
				margin-right: 10rpx;
			}
		}
	}

	.deaIconBox {
		display: inline-block;
		font-weight: 400;
		font-size: 24rpx;
		color: #999999;
		line-height: 24rpx;
		padding: 8rpx;
		box-sizing: border-box;
		border-radius: 4rpx 4rpx 4rpx 4rpx;
		border: 1rpx solid #999999;
	}

	.sytextBox {
		font-weight: 400;
		font-size: 24rpx;
		color: #999999;
		line-height: 24rpx;
	}

	.cardBox {
		position: relative;
		top: -24rpx;
		padding: 32rpx;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		box-sizing: border-box;
		background: #FFFFFF;
	}

	.deaName {
		font-weight: 700;
		font-size: 40rpx;
		color: #333333;
		line-height: 40rpx;
	}

	.deaNameTwo {
		font-weight: 700;
		font-size: 32rpx;
		color: #333333;
		line-height: 48rpx;
	}

	.deaTime {
		font-weight: 500;
		font-size: 28rpx;
		color: #666666;
		line-height: 28rpx;
	}

	.deaPric {
		.fh {
			font-size: 32rpx;
			font-weight: 700;
			line-height: 32rpx;
			color: #FF5405;
		}

		.num {
			font-size: 48rpx;
			font-weight: 700;
			line-height: 48rpx;
			color: #FF5405;
			margin-right: 6rpx;
		}

		.dw {
			font-size: 28rpx;
			font-weight: 400;
			line-height: 28rpx;
			color: #666666;
		}

		.old {
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;
			line-height: 28rpx;
			text-decoration: line-through;
			margin-left: 10rpx;
		}
	}

	.deaAddr {
		font-weight: 700;
		font-size: 28rpx;
		color: #333333;
		line-height: 28rpx;
	}

	.deaJl {
		font-weight: 400;
		font-size: 28rpx;
		color: #666666;
		line-height: 28rpx;
	}

	.deaIcon {
		text-align: center;
		font-weight: 500;
		font-size: 24rpx;
		color: #666666;
		line-height: 24rpx;
	}


	.ticketBox {
		width: 100%;
		display: flex;
		background: #FFFFFF;

		.ticketBox-tabs {
			width: 176rpx;

			.ticketBox-tabs-item {
				width: 100%;
				height: 96rpx;
				line-height: 96rpx;
				text-align: center;
				background: #F6F5F4;
				border-radius: 0rpx 24rpx 0rpx 0rpx;
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
			}

			.ticketActive {
				background: #FFFFFF;
				font-weight: 700;
				color: var(--primary-color);
				border-radius: 24rpx 0rpx 0rpx 24rpx !important;
			}
		}

		.ticketBox-list {
			width: calc(100% - 176rpx);
			height: 1000rpx;
			padding: 32rpx;
			box-sizing: border-box;
            overflow-y:scroll;
			.lisBox {
				padding-bottom: 20rpx;
				box-sizing: border-box;
				border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);

				.lisBox-name {
					font-weight: 700;
					font-size: 32rpx;
					color: #333333;
					line-height: 36rpx;
				}

				.lisBox-sales {
					font-weight: 400;
					font-size: 28rpx;
					color: #666666;
					line-height: 28rpx;
				}

				.lisBox-icons {
					flex-wrap: nowrap;
				}

				.lisBox-icons-item {
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
					background: var(--head-color);
				}

				.iconsColor2 {
					border: 1rpx solid #999999;
					color: #999999;
				}

				.lisBox-right {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
				}

				.tetxIcon {
					width: 72rpx;
					height: 72rpx;
					line-height: 72rpx;
					text-align: center;
					background: var(--but-color-line);
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					font-weight: 700;
					font-size: 28rpx;
					color: #FFFFFF;
				}
			}
		}
	}

	.centBox {
		padding: 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;

		.centBox-card {
			padding-bottom: 32rpx;
			box-sizing: border-box;
			border: 2rpx solid rgba(0, 0, 0, 0.06);
		}

		.centBox-name {
			font-weight: 700;
			font-size: 28rpx;
			color: #333333;
			line-height: 36rpx;
		}

		.centBox-text {
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;
			line-height: 44rpx;
		}
	}
	.tabs-item-text{
		color: var(--primary-color) !important;
	}
	.box{
		height: 100vh;
		overflow: hidden;
	}
</style>