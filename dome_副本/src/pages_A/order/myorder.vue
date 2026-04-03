<template>
	<view class="page-conent" :data-theme="pageTheme">
		<up-sticky>
			<view class="searchView">
				<up-navbar title="我的订单" leftIconColor="#000000" bgColor="transparent" @leftClick="toBack"
					:placeholder="true" :fixed="true" :titleStyle="{ fontWeight: 'bold' }"></up-navbar>
				<view class="container-bg">
					<!-- 标签 -->
					<view class="label-container" style="margin-top: 20rpx">
						<scroll-view class="label-scroll" scroll-x="true" scroll-left="scrollLeft"
							:show-scrollbar="false">
							<view id="demo1" v-for="(item, index) in labelList" :key="index" class="label-item fs28"
								:class="{ 'label-active': activeLabel == item.id }" @click="changeLabel(item.id, 1)">
								{{ item.name }}
							</view>
						</scroll-view>
					</view>

					<view class="label-container p-l-30 p-r-70">
						<scroll-view class="label-scroll" scroll-x="true" scroll-left="scrollLeft"
							:show-scrollbar="false">
							<view id="demo1" v-for="(item, index) in statusTabList" :key="index"
								class="label-item bg-f5 m-r-30 fs26"
								:class="{ 'label-actived': activeStatus == item.id }" @click="changeLabel(item.id, 2)">
								{{ item.name }}
							</view>
						</scroll-view>
					</view>
					<view class="liwu-box-1" v-if="activeLabel==4">
						<view class="liwu-box" :class="{'active': giftFlag == 1}" @click="changeGiftFlag">
							<image class="liwu-icon-img" :src="imgUrl + 'liwuhezi-icon.png'" mode=""></image>
							转赠订单
						</view>
					</view>
				</view>
			</view>
		</up-sticky>

		<!-- 订单列表区域 - 增加下拉刷新和上拉加载 -->
		<scroll-view class="list-card" scroll-y="true" refresher-enabled="true" :refresher-triggered="refreshing"
			@refresherpulling="onRefresherPulling" @refresherrefresh="onRefresherRefresh"
			@scrolltolower="onScrollToLower" :style="{ height: listHeight + 'px' }">
			<!-- 订单列表 -->
			<view v-if="activeLabel == 4">
				<view v-for="(item,index) in dataList.list" :key="index">
					<view class="list2-item" @click="navtoDetail(item)">
						<view class="card-h" v-if="item.baseOrderInfoResponse.receiveStatus!=null">
							<view style="display:flex;align-items: center;">
								<image style="width: 36rpx;height: 36rpx;margin-right: 20rpx;"
									:src="imgUrl + 'liwuhezi-icon.png'" mode=""></image>
								<text v-if="item.baseOrderInfoResponse.roleType==1">送给他的礼物</text>
								<text v-if="item.baseOrderInfoResponse.roleType==2">我收到的礼物</text>
							</view>
							<text class="lingqu-text-1" v-if="item.baseOrderInfoResponse.receiveStatus==0">待领取</text>
							<text class="lingqu-text-2" v-if="item.baseOrderInfoResponse.receiveStatus==1">已领取</text>
						</view>
						<view class="list-header flex just-sb ali-cen">
							<view class="title flex ali-cen">
								<!-- <image class="icon-40 m-r-20" :src="imgUrl + 'sm.png'" mode=""></image> -->
								<text class="fw-b">积分商城</text>
							</view>
							<view class="status flex ali-cen" v-if="item?.baseOrderInfoResponse">
								<view class="status-txt fs26 colf fw-500" v-if="item?.baseOrderInfoResponse.status==0">
									待支付</view>
								<view class="status-txt fs26 colf fw-500" v-if="item.baseOrderInfoResponse.status==10">
									待发货</view>
								<view class="status-txt fs26 colf fw-500" v-if="item.baseOrderInfoResponse.status==20">
									已发货</view>
								<view class="status-txt fs26 colf fw-500" v-if="item.baseOrderInfoResponse.status==30">
									已完成</view>
								<view class="status-txt fs26 colf fw-500" v-if="item.baseOrderInfoResponse.status==40">
									已取消</view>
							</view>
						</view>
						<view v-if="item.baseOrderInfoResponse.items">
							<view class="list-con flex ali-cen m-t-20 p-b-30"
								v-for="(el,indx) in item.baseOrderInfoResponse.items" :key="indx">
								<view class="list-food flex" style="width: 70%;">
									<image class="food-img" :src="el.picUrl" mode=""></image>
									<text>{{el.spuName}}</text>
								</view>
								<view class="total flex flex-col ali-cen">
									<text class="fs-32 fw-600 m-b-15">{{el.usePoint}}积分</text>
									<text class="fs-24 fw-500 col9">共{{el.count}}件</text>
								</view>
							</view>
						</view>

						<view class="list-bottom flex just-sb ali-cen">
							<text class="fs-24 col9 fw-500">{{item?.baseOrderInfoResponse?.createTime}}</text>
							<view class="btns flex">
								<view class="pay-btn">查看详情</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="listBox" v-else-if="activeLabel == 1">
				<view v-for="(item,index) in dataList.list" :key="index">
					<view class="cardBox" :style="{opacity: item.payStatus == 4?.6:1}"
						@click="toNav('/pages_B/scenicSpotTicket/detailOrder?id='+item.id)">
						<view class="fl-fs-sb" style="border-bottom:2rpx solid #EBEBEB;padding-bottom: 10rpx;">
							<view class="cardBox-name">{{item.orderTitle}}</view>
							<view class="cardBox-icon"
								:style="{color:statusObj[item.payStatus].color,background:statusObj[item.payStatus].bgColor}">
								{{statusObj[item.payStatus].text}}
							</view>
						</view>
						<up-gap height="12"></up-gap>
						<view class="cardBox-time">下单时间：{{item.orderTime}}</view>
						<up-gap height="16"></up-gap>
						<view class="fl-ce-sb">
							<up-image :src="item.orderImage" width="128rpx" height="128rpx" radius="4"></up-image>
							<view style="width: calc(100% - 345rpx);">
								<view class="cardBox-text">门票：{{item.baseOrderInfoResponse.quantity}}张</view>
								<up-gap height="12"></up-gap>
								<view class="cardBox-text">总价：{{item.orderAmount}}元</view>
							</view>
							<view @click.stop="toNav()" v-if='item.payStatus==6'>
								<view class="pay-btns" v-if='item.invoiceStatus==0' @click="toNav('/pages_F/myInvoice/index?orderId='+item.id+'&type='+'0')">{{formatCardStatusStr(item.invoiceStatus)}}</view>
							  <!--  <view class="pay-btns" v-if='item.invoiceStatus==1'  @click="toNav('/pages_F/myInvoice/invoicedetails?id='+item.invoiceId)">{{formatCardStatusStr(item.invoiceStatus)}}</view> -->
							</view>
							<view v-else style="width: 150rpx;"></view>
						</view>
					</view>
					<up-gap height="12"></up-gap>
				</view>
			</view>
			<view class="listBox" v-else-if="activeLabel == 5">
				<view v-for="(item,index) in dataList.list" :key="index">
					<view class="cardBox" 
						@click="toNav('/pages_B/hotel/orderDetails?id='+item.baseOrderInfoResponse.id)">
						<view class="fl-fs-sb" style="border-bottom:2rpx solid #EBEBEB;padding-bottom: 10rpx;">
							<view class="cardBox-name">{{item.orderTitle}}</view>
							<view class="cardBox-icon"
								:style="{color:statusObj[item.baseOrderInfoResponse?.orderStatus].color,background:statusObj[item.baseOrderInfoResponse?.orderStatus].bgColor}">
								{{statusObj[item.baseOrderInfoResponse?.orderStatus].text}}
							</view>
						</view>
						<up-gap height="12"></up-gap>
						<view class="cardBox-time">下单时间：{{item.createTime}}</view>
						<up-gap height="16"></up-gap>
						<view style="display: flex;gap:20rpx">
							<up-image :src="item.orderImage" width="128rpx" height="128rpx" radius="4"></up-image>
							<view style="width: calc(100%-345rpx);">
								<up-gap height="12"></up-gap>
								<view class="cardBox-text">{{ item.baseOrderInfoResponse.hotelRoomTypeInfo?.roomTypeName }}共{{item.baseOrderInfoResponse?.roomCount}}间{{item.baseOrderInfoResponse?.stayDays}}晚</view>
								<up-gap height="12"></up-gap>
								<view class="cardBox-text">总价：{{item.orderAmount}}元</view>
							</view>
						</view>
					</view>
					<up-gap height="12"></up-gap>
				</view>
			</view>
			<view v-else-if="activeLabel == 6">
				<view v-for="(item,index) in dataList.list" :key="index">
					<view class="list2-item" @click="navtoDetail(item)">
						<view class="list-header flex just-sb ali-cen">
							<view class="title flex ali-cen">
								<!-- <image class="icon-40 m-r-20" :src="imgUrl + 'sm.png'" mode=""></image> -->
								<text class="fw-b">自驾行</text>
							</view>
							<view class="status flex ali-cen" v-if="item?.baseOrderInfoResponse?.orderStatus != null">
								<view class="status-txt fs26 colf fw-500">
									{{ handleGetStatus(item?.baseOrderInfoResponse.orderStatus) }}

								</view>
							</view>
						</view>
						<view>
							<view class="list-con flex ali-cen m-t-20 p-b-30">
								<view class="list-food flex" style="width: 100%;">
									<image class="food-img" :src="item.baseOrderInfoResponse.imagesContraction" mode="">
									</image>
									<view style="padding-left: 20rpx;box-sizing: border-box;flex: 1;">
										<view class="texNoWrap2" style="font-weight: bold;margin-bottom: 12rpx;">
											{{item.baseOrderInfoResponse.roadTripName}}
										</view>
										<view class="texNoWrap2" style="color: #999999;">
											{{item.baseOrderInfoResponse?.roadTripTheme}}
										</view>
									</view>
								</view>
								<!-- <view class="total flex flex-col ali-cen">
												<text class="fs-32 fw-600 m-b-15">{{el.usePoint}}积分</text>
												<text class="fs-24 fw-500 col9">共{{el.count}}件</text>
											</view> -->
							</view>
						</view>

						<view class="list-bottom flex just-sb ali-cen">
							<text class="fs-24 col9 fw-500">{{item?.createTime}}</text>
							<view @click.stop="toNav()" v-if='item.payStatus==6'>
								<view class="pay-btns" v-if='item.invoiceStatus==0' @click="toNav('/pages_F/myInvoice/index?orderId='+item.id+'&type='+'1')">{{formatCardStatusStr(item.invoiceStatus)}}</view>
							   <!-- <view class="pay-btns" v-if='item.invoiceStatus==1'  @click="toNav('/pages_F/myInvoice/invoicedetails?id='+item.invoiceId)">{{formatCardStatusStr(item.invoiceStatus)}}</view> -->
							</view>
							<view class="btns flex">
								<view class="pay-btn">查看详情</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else-if="activeLabel == 0">
				<view v-for="item in dataList.list" :key="item.id" class="item-con" @click="navtoDetail(item)">
					<view :class="['item-bg', cancelMap[item.payStatus] && 'item-bg--disabled']">
						<!-- 订单号 + 支付状态 -->
						<view class="between-row">
							<view>订单号 | {{ item.id }}</view>
							<view>
								<template v-if="item.payStatus === 0">待支付</template>
								<template v-if="item.payStatus === 1">已支付</template>
								<template v-if="item.payStatus === 2">已取消</template>
								<template v-if="item.payStatus === 3">退款中</template>
								<template v-if="item.payStatus === 4">已退款</template>
							</view>
						</view>

						<!-- 订单标题 + 创建时间 -->
						<view class="between-row" style="margin-top: 26rpx">
							<view style="font-size: 28rpx; font-weight: 700; color: #000">
								{{ item.orderTitle }}
							</view>
							<view>{{ item.createTime }}</view>
						</view>

						<!-- 订单详情 -->
						<view class="jiayoulist">
							<view class="list-box-q">
								<text class="list-box-1">能源类型</text>
								<text class="list-box-2">{{ item.baseOrderInfoResponse.oilName }}汽油</text>
							</view>
							<view class="list-box-q">
								<text class="list-box-1">规格</text>
								<text class="list-box-2">{{ item.baseOrderInfoResponse.totalLitre }}L</text>
							</view>
							<view class="list-box-q">
								<text class="list-box-1">价格</text>
								<text class="list-box-2">¥{{ item.baseOrderInfoResponse.orderAmount }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else>
				<view class="list-item" v-for="(item, index) in dataList.list" :key="index" @click="navtoDetail(item)">
					<view class="list-header flex just-sb ali-cen">
						<!-- <view class="title flex ali-cen">
							<text class="fw-b">{{ labelName(item.bizOrderType) }}</text>
						</view> -->
						<view class="status flex ali-cen" style="width: 100rpx">
							<view class="time fs26 flex just-sb">
								<view class="status-txt fs26 colf fw-500"
									style="background-color: #fff; color: #0077ff">
									{{ labelStatus(item.status) }}
								</view>
							</view>
						</view>
					</view>
					<view class="list-con flex ali-cen just-sb m-t-20 p-b-30">
						<view class="list-food flex">
							<view class="food-con flex flex-col" style="width: 630rpx">
								<view class="fs-30 fw-b" style="display: flex; justify-content: space-between">
									{{ item.orderTitle }}<text
										class="fs-32 fw-600 m-b-15">{{ item.bizOrderType == 4 ? item.point : item.orderAmount }}</text>
								</view>
								<text class="fs-24 col3 fw-500 mar-20">订单编号:{{ item.id }}</text>
								<text class="fs-24 col3 fw-500">订单时间:{{ item.createTime }}</text>
							</view>
						</view>
						<!-- <view class="total flex flex-col ali-cen">
				
						</view> -->
					</view>
				</view>
			</view>


			<!-- 加载状态提示 -->
			<view class="load-more" v-if="dataList.list && dataList.list.length > 0">
				<text v-if="loading">{{ loadingText }}</text>
				<text v-else-if="!hasMore" class="no-more">没有更多数据了</text>
			</view>

			<!-- 空数据提示 -->
			<view class="empty-data" v-if="!refreshing && (!dataList.list || dataList.list.length === 0)">
				<ser-empty></ser-empty>
			</view>
		</scroll-view>
		<PageDurationTracker pageName="我的订单" />
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, computed } from 'vue';
	import { onLoad, onPageScroll, onReady, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '../../config';
	import { random, guid, timeFormat } from '@/uni_modules/uview-plus';
	import { toNav, toBack } from '@/utils/route';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { payOrderInfo } from '@/api/home';
	import { toast } from '@/utils/common';
	import { formatTimestamp } from '@/utils/util';
	import { getDict } from '@/api/config'

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	// 导航栏样式
	const backgroundColor = ref<string>('#D1E5F8');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const statusObj = ref({
		0: { text: '待支付', color: '#00964E', bgColor: '#F0F8F4' },
		1: { text: '已支付', color: '#005FEE', bgColor: '#F0F6FE' },
		2: { text: '已取消', color: '#999999', bgColor: '#F9F9F9' },
		3: { text: '退款中', color: '#999999', bgColor: '#F9F9F9' },
		4: { text: '已退款', color: '#FF9000', bgColor: '#F9F9F9' },
		5: { text: '退款失败', color: '#005FEE', bgColor: '#F0F6FE' },
		6: { text: '已完成', color: '#FF9000', bgColor: '#FFF9F0' },
		10: { text: '出票中', color: '#00964E', bgColor: '#F0F8F4' },
		11: { text: '待核销', color: '#999999', bgColor: '#F9F9F9' },
		12: { text: '出票失败', color: '#999999', bgColor: '#F9F9F9' },
	})
	// 列表数据
	const dataList = ref<any>({ list: [] });
	const total = ref<number>(0);
	const listQuery = ref({
		pageNum: 1,
		pageSize: 10, // 改为合理的分页大小
	});

	// 下拉刷新和上拉加载状态
	const refreshing = ref<boolean>(false); // 下拉刷新状态
	const loading = ref<boolean>(false); // 上拉加载状态
	const hasMore = ref<boolean>(true); // 是否有更多数据
	const loadingText = ref<string>('加载中...'); // 加载提示文本
	const listHeight = ref<number>(0); // 列表区域高度

	// 标签数据
	type labelItem = {
		id : number | string;
		name : string;
		labelValue ?: string
	};
	const labelList = ref<labelItem[]>([
		{ id: 0, name: '加油', labelValue: 'gas_station_order_status' },
		{ id: 1, name: '景区门票', labelValue: 'scenic_spot_order_status' },
		// { id: 2, name: '客运售票' ,labelValue:'bus_ticket_order_status'},
		// { id: 3, name: '直营零售' ,labelValue:'bus_ticket_order_status'},
		{ id: 4, name: '积分商城', labelValue: 'merchant_order_status' },
		// { id: 5, name: '酒店住宿' ,labelValue:'hotel_order_status'},
		{ id: 6, name: '自驾行', labelValue: 'road_trip_order_status' },
		// { id: 6, name: '货车节', labelValue: 'road_trip_order_status' }
	]);
	const statusList = ref<labelItem[]>([
		{ id: '999999', name: '全部' },
		{ id: 1, name: '已支付' },
		{ id: 2, name: '已取消' },
		{ id: 3, name: '退款中' },
		{ id: 4, name: '已退款' },
		{ id: 5, name: '退款失败' },
		{ id: 6, name: '已完成' },
		{ id: 10, name: '出票中' },
		{ id: 11, name: '待核销' },
		{ id: 12, name: '出票失败' },
	]);
	// 6. 筛选配置（修复第40行textValue错误）
	const cancelMap = ref({
		2: true, // 已取消
		4: true, // 已退款
		'04': true,
		CANCELLED: true,
		已取消: true,
	});
	const statusTabList = computed(() => {
		// let tabs = [{ id: '', name: '全部' },]
		let tabs = statusList.value
		if (activeLabel.value == 4) {
			tabs = statusList.value
			// tabs = [
			// 	{ id: '', name: '全部' },
			// 	{ id: '0', name: '待支付' },
			// 	{ id: 1, name: '待发货' },
			// 	{ id: 1, name: '进行中' },
			// 	{ id: 6, name: '已完成' },
			// 	{ id: 2, name: '已取消' }

			// 	// { id: 0, name: '待支付' },
			// 	// { id: 10, name: '待发货' },
			// 	// { id: 20, name: '进行中' },
			// 	// { id: 30, name: '已完成' },
			// 	// { id: 40, name: '已取消' }
			// ]
		}
		if (activeLabel.value == 0) {
			tabs = statusList.value
		}
		return tabs
	})
	// 选中的标签
	const activeLabel = ref(0);
	const activeStatus = ref('999999');
	const scrollLeft = ref(0);

	// 计算列表高度（适配不同设备）
	const calcListHeight = () => {
		const sysInfo = uni.getSystemInfoSync();
		const windowHeight = sysInfo.windowHeight;
		// 减去导航栏和标签栏的高度（根据实际情况调整）
		listHeight.value = windowHeight - 200; // 可根据实际UI调整数值
	};
	const formatCardStatusStr = (num) => {
		switch (num) {
		case 0:
			return '待开票';
		case 1:
			return '已开票';
		case 2:
			return '重开发票';
		case 3:
			return '驳回开票';
		case 5:
			return '开票中';
		}
	}

	// 标签名称转换
	const labelName = (id : string | number) => {
		switch (id) {
			case 0:
				return '加油';
			case 1:
				return '景区门票';
			case 2:
				return '客用售票';
			case 3:
				return '直营零售';
			case 4:
				return '积分商城';
			default:
				return '';
		}
	};

	// 状态名称转换
	const labelStatus = (id : string | number) => {
		switch (id) {
			case 0:
				return '待支付';
			case 10:
				return '待发货';
			case 20:
				return '已发货';
			case 30:
				return '已完成';
			case 40:
				return '已取消';

			default:
				return '';
		}
	};

	// 切换标签
	const changeLabel = (index : number | string, type : number) => {
		if (type == 1) {
			activeLabel.value = index as number;
			activeStatus.value = '999999'
			giftFlag.value = 0
		} else {
			activeStatus.value = index as string;
		}
		let labItem = labelList.value.filter(item => item.id == activeLabel.value)[0] || {}

		// 切换标签时重置分页并刷新数据
		listQuery.value.pageNum = 1;
		hasMore.value = true;
		getLabel(labItem.labelValue)
		getData(true);
		// 计算滚动位置使选中标签居中
		scrollLeft.value = (index as number) * 120 - 150;
	};
	const getLabel = async (type) => {
		if (!type) return
		try {
			console.log('-0-0-0', type);
			const res = await getDict(type);
			statusList.value = [{ id: '999999', name: '全部' }, ...res.data.map(item => {
				item.id = item.dictValue
				item.name = item.dictLabel
				return item
			})]
			console.log('i009949332', res);
		} catch (err) {
			toast(err)
		}
	}

	// 获取状态
	const handleGetStatus = (e) => {
		// console.log("传递的状态",e)
		// console.log("小tab数据",statusList.value)
		let item = statusList.value.find(a => a.id == e)
		// console.log("获取的状态",item)
		return item ? item.name : ''
	}
	const giftFlag = ref(0)
	const changeGiftFlag = () => {
		if (giftFlag.value == 1) {
			giftFlag.value = 0
		} else {
			giftFlag.value = 1
		}
		listQuery.value.pageNum = 1;
		hasMore.value = true;
		getData(true);
	}
	// 加载数据
	const getData = async (isRefresh = false) => {
		// 加载中状态
		if (isRefresh) {
			refreshing.value = true;
		} else if (!loading.value) {
			loading.value = true;
			loadingText.value = '加载中...';
		}

		try {
			let params = {
				...listQuery.value,
				bizOrderType: activeLabel.value,
				payStatus: activeStatus.value != '999999' ? activeStatus.value : '',
				giftFlag: giftFlag.value,
			};
			console.log('-0-0--00--00params--0', params);
			const res = await payOrderInfo(params);
			console.log('我的订单数据', res);
			if (res.code == 200) {
				// 下拉刷新 - 替换数据
				if (isRefresh) {
					dataList.value = res.data;
				}
				// 上拉加载 - 追加数据
				else {
					dataList.value.list = [...dataList.value.list, ...res.data.list];
				}

				// 做过滤防止baseOrderInfoResponse=null
				dataList.value.list = dataList.value.list.filter(item => item.baseOrderInfoResponse)
				total.value = res.data.total || 0;

				// 判断是否还有更多数据
				hasMore.value = dataList.value.list.length < total.value;

				// 如果没有更多数据了
				if (!hasMore.value && !isRefresh) {
					loadingText.value = '没有更多数据了';
				}
			} else {
				toast(res.msg);
			}
		} catch (error) {
			// toast('数据加载失败，请重试');
			console.error('getData error:', error);
		} finally {
			// 结束加载状态
			refreshing.value = false;
			loading.value = false;
		}
	};

	// 初始化
	const init = () => {
		calcListHeight();
		let labItem = labelList.value.filter(item => item.id == activeLabel.value)[0] || {}
		getLabel(labItem.labelValue)
		listQuery.value.pageNum = 1;
		getData(true);
	};

	// 下拉刷新触发
	const onRefresherRefresh = () => {
		listQuery.value.pageNum = 1;
		hasMore.value = true;
		getData(true);
	};

	// 下拉刷新中
	const onRefresherPulling = (e : any) => {
		// 可自定义下拉刷新的动画效果
	};

	// 上拉到底部加载更多
	const onScrollToLower = () => {
		// 如果没有更多数据或正在加载中，则返回
		if (!hasMore.value || loading.value || refreshing.value) {
			return;
		}
		// 增加页码
		listQuery.value.pageNum++;
		// 加载更多数据
		getData(false);
	};

	// 页面卸载时取消所有请求（如果需要）
	const cancelRequest = () => {
		// 可在这里取消未完成的请求
	};

	// 跳转
	const navtoDetail = (item) => {
		console.log('-90-------------', activeLabel.value);
		if (activeLabel.value == 0) {
			toNav('/pages_D/refuelingRefilling/orderDetails?id=' + item.id);
		}
		if (activeLabel.value == 3) {
			toNav('/pages_B/directRetail/orderDetail?id=' + item.id);
		}
		if (activeLabel.value == 4) {
			toNav('/pages_A/orderDetails/index?type=all&orderId=' + item.baseOrderInfoResponse.id);
		}
		if (activeLabel.value == 6) {
			toNav('/pages_C/carOwner/carOrderDetail?orderId=' + item.baseOrderInfoResponse?.parentOrderId);
		}
	};
	onLoad((opticon) => {
		if (opticon.type) activeLabel.value = opticon.type
	})
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44;
		init();
		// 监听窗口大小变化，重新计算列表高度
		uni.onWindowResize(calcListHeight);
	});
	onShow(() => {
		init();
	})

	onUnmounted(() => {
		cancelRequest();
		uni.offWindowResize(calcListHeight);
	});
</script>

<style scoped lang="scss">
	.listBox {
		padding: 0 32rpx 32rpx 32rpx;
		box-sizing: border-box;
		border-radius: 32rpx;

		.cardBox {
			padding: 32rpx;
			box-sizing: border-box;
			background: #FFFFFF;
			box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);

			.cardBox-name {
				width: 392rpx;
				font-weight: 700;
				font-size: 32rpx;
				color: #333333;
				line-height: 44rpx;
			}

			.cardBox-icon {
				padding: 12rpx 24rpx;
				box-sizing: border-box;
				border-radius: 48rpx;

				font-weight: 400;
				font-size: 24rpx;
				line-height: 24rpx;
			}

			.cardBox-time {
				font-weight: 400;
				font-size: 24rpx;
				color: #666666;
				line-height: 24rpx;
			}

			.cardBox-text {
				font-weight: 400;
				font-size: 28rpx;
				color: #666666;
				line-height: 28rpx;
			}
		}


	}

	.searchView {
		background: var(--head-color);
	}

	.list2-item {
		background: #FFFFFF;
		border-radius: 20rpx;
		margin: 0 32rpx 40rpx;
		padding: 26rpx 30rpx;
		background: linear-gradient(180deg, #EBF8EE 0%, #FEFEFE 30%);

		.lingqu-text-1 {
			font-weight: 400;
			font-size: 26rpx;
			color: #666666;
		}

		.lingqu-text-2 {
			font-weight: 400;
			font-size: 26rpx;
			color: var(--primary-color);
		}

		.card-h {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 102rpx;

		}

		.list-header {

			.label {
				width: 60rpx;
				height: 28rpx;
				border-radius: 6rpx;
				border: 1px solid var(--primary-color);
				font-weight: 500;
				font-size: 22rpx;
				color: var(--primary-color);
				text-align: center;
				line-height: 28rpx;
			}

			.status-txt {
				width: 116rpx;
				height: 40rpx;
				line-height: 40rpx;
				background: #FF5A27;
				border-radius: 16rpx;
				text-align: center;
			}

			.time {
				font-weight: 500;
				font-size: 26rpx;
				color: #FF5A27;
				width: 220rpx;
				height: 32rpx;
				line-height: 32rpx;
				background: #FFF3EE;
				border-radius: 16rpx;
				text-align: center;
			}
		}

		.address {
			width: 626rpx;
			height: 66rpx;
			background: #FFFBF6;
			border-radius: 16rpx;
			font-weight: 500;
			font-size: 24rpx;
			color: #000000;
			padding-left: 27rpx;
			line-height: 66rpx
		}

		.list-con {
			border-bottom: 1rpx solid #EEEEEE;

			.food-img {
				width: 136rpx;
				height: 136rpx;
				background: #F5F5F5;
				border-radius: 16rpx;
				margin-right: 15rpx;
			}

			.food-con {
				justify-content: space-around;

				.food-title {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					width: 320rpx;
				}
			}

			.total {
				align-items: flex-end;
				width: 160rpx;
				height: 136rpx;
				background: #FFFFFF;
				opacity: 0.93;
			}
		}

		.list-bottom {
			margin-top: 18rpx;

			.cancel-btn {
				width: 160rpx;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 30rpx;
				border: 1px solid #CCCCCC;
				font-weight: 500;
				font-size: 28rpx;
				color: #666666;
				text-align: center;
			}

			.pay-btn {
				width: 150rpx;
				height: 50rpx;
				line-height: 50rpx;
				border-radius: 30rpx;
				border: 1px solid var(--primary-color);
				font-weight: 500;
				font-size: 28rpx;
				color: var(--primary-color);
				text-align: center;
			}
		}

	}

	.pay-btns {
		width: 150rpx;
		height: 50rpx;
		line-height: 50rpx;
		border-radius: 30rpx;
		border: 1px solid var(--primary-color);
		font-weight: 500;
		font-size: 28rpx;
		color: var(--primary-color);
		text-align: center;
	}

	.page-conent {
		height: 100vh;

		overflow: hidden;
	}

	.container-bg {
		width: 750rpx;
	}

	.liwu-box {
		padding: 12rpx 18rpx;
		border-radius: 54rpx 54rpx 54rpx 54rpx;
		border: 1rpx solid #7B7E7C;
		align-items: center;
		margin-right: 20rpx;
		display: inline-flex;
	}

	.liwu-box-1 {
		margin-left: 20rpx;
		margin-bottom: 20rpx;
	}

	// .liwu-box-text {
	// 	font-weight: 500;
	// 	font-size: 24rpx;
	// 	color: #7B7E7C;
	// 	line-height: 24rpx;
	// }

	.liwu-icon-img {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}

	.label-container {
		width: 100%;
		padding-bottom: 20rpx;
		position: relative;

		.label-scroll {
			width: 100%;
			white-space: nowrap;
			height: 60rpx;
			padding-right: 70rpx;

			.label-item {
				display: inline-block;
				height: 56rpx;
				line-height: 56rpx;
				box-sizing: border-box;
				padding: 0 30rpx;
				border-radius: 28rpx;
				color: #000;

				&:last-child {
					margin-right: 0;
				}

				&.label-active {
					color: var(--primary-color);
				}

				&.label-actived {
					background: #fff;
					border: 1px solid var(--primary-color);
					background: #fffbf6;
					color: var(--primary-color);
				}
			}
		}

		.label-item:last-child {
			margin-right: 100rpx !important;
		}
	}

	// 列表区域样式优化
	.list-card {
		width: 100%;
		overflow: hidden;

		.list-item {
			background: #ffffff;
			border-radius: 20rpx;
			margin: 0 32rpx;
			padding: 0 30rpx;

			.list-header {
				border-bottom: 1rpx solid #eeeeee;
				padding: 5rpx 0 10rpx;

				.status-txt {
					width: 116rpx;
					height: 40rpx;
					line-height: 40rpx;
					background: #ff5a27;
					border-radius: 16rpx;
					text-align: center;
				}

				.time {
					font-weight: 500;
					font-size: 26rpx;
					color: #ff5a27;
					width: 220rpx;
					height: 32rpx;
					line-height: 32rpx;
					background: #fff3ee;
					border-radius: 16rpx;
					text-align: center;
				}
			}

			.list-con {
				.food-con {
					justify-content: space-around;

					.food-title {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						width: 320rpx;
					}
				}

				.total {
					align-items: flex-end;
					width: 160rpx;
					height: 136rpx;
					background: #ffffff;
					opacity: 0.93;
				}
			}
		}

		// 加载更多提示
		.load-more {
			text-align: center;
			padding: 20rpx 0;
			font-size: 24rpx;
			color: #999;

			.no-more {
				color: #ccc;
			}
		}

		// 空数据提示
		.empty-data {
			text-align: center;
			padding: 100rpx 0;
			font-size: 28rpx;
			color: #999;
		}
	}

	.active {
		background-color: #FF9BA2;
		color: #333333;
		border: 0rpx solid #7B7E7C;
	}


	.mar-20 {
		margin: 20rpx 0;
	}

	.p-l-30 {
		padding-left: 30rpx;
	}

	.p-r-70 {
		padding-right: 70rpx;
	}

	.m-r-30 {
		margin-right: 30rpx;
	}

	.m-t-20 {
		margin-top: 20rpx;
	}

	.p-b-30 {
		padding-bottom: 30rpx;
	}

	.flex {
		display: flex;
	}

	.just-sb {
		justify-content: space-between;
	}

	.ali-cen {
		align-items: center;
	}

	.flex-col {
		flex-direction: column;
	}

	.fs28 {
		font-size: 28rpx;
	}

	.fs26 {
		font-size: 26rpx;
	}

	.fs-30 {
		font-size: 30rpx;
	}

	.fs-24 {
		font-size: 24rpx;
	}

	.fs-32 {
		font-size: 32rpx;
	}

	.fw-b {
		font-weight: bold;
	}

	.fw-500 {
		font-weight: 500;
	}

	.fw-600 {
		font-weight: 600;
	}

	.col3 {
		color: #333;
	}

	.col9 {
		color: #999;
	}

	.colf {
		color: #fff;
	}

	.bg-f5 {
		background-color: #f5f5f5;
	}

	.m-b-15 {
		margin-bottom: 15rpx;
	}

	/* 订单项 */
	.item-con {
		width: 690rpx;
		margin: 0 auto;
		margin-bottom: 24rpx;
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(138, 78, 0, 0.05);
	}

	.item-bg {
		background-color: #ffffff;
		padding: 32rpx;
		border-radius: 20rpx;
	}

	.item-bg--disabled {
		opacity: 0.6;
	}

	/* 行布局 */
	.between-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 26rpx;
		border-bottom: 2rpx solid #ebebeb;
		font-size: 26rpx;
	}

	/* 订单详情行 */
	.jiayoulist {
		height: 118rpx;
		padding: 20rpx 60rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f8f9fb;
		border-radius: 12rpx;
		margin-top: 20rpx;
	}

	.list-box-q {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.list-box-1 {
		font-weight: 400;
		font-size: 20rpx;
		color: #666666;
	}

	.list-box-2 {
		line-height: 56rpx;
		font-weight: 500;
		font-size: 28rpx;
		color: #000;
	}

	/* 加载提示 */
	.load-more {
		text-align: center;
		padding: 20rpx 0;
		font-size: 24rpx;
		color: #999;
	}
</style>