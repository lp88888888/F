<template>
	<view class="pagess" :data-theme="pageTheme">
		<!-- <up-sticky bgColor="#FFFFFF">
			<view class="tabs">
				<view :class="['tabs-item', tabsId == item.id?'tabsActive':'']" v-for="(item,index) in tabsList" :key="index" @click.stop="tabsChane(item)">
					<view class="tabs-item-text">{{item.name}}</view>
					<view class="tabs-item-line"></view>
				</view>
			</view>
		</up-sticky> -->
		<up-navbar title="我的订单" :bgColor="backgroundColor" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
		<view class="searchBox fl-ce-sb">
			<view class="searchBox-item fl-ce-sb">
				<up-input placeholder="请输入景点名称" border="none" v-model="keyword" fontSize="14"></up-input>
				<up-icon name="search" color="#666666" size="20"></up-icon>
			</view>
			<view class="searchBox-right fl-ce-sb" @click="documentShow=true">
				<text>{{statusname}}</text>
				<up-icon name="arrow-down" color="#666666" size="11"></up-icon>
			</view>
		</view>
		<u-picker :show="documentShow" :columns="[documentTypeList]" keyName="dictLabel"
			:confirmColor="themeStore.themeColors.$primaryColor" @close="prickClose" @cancel="prickClose"
			@confirm="prickConfirm"></u-picker>
		<view class="listBox">
			<view v-for="(item,index) in dataList" :key="index">
				<view class="cardBox" :style="{opacity: item.payStatus == 4?.6:1}"
					@click="toNav('/pages_B/scenicSpotTicket/detailOrder?id='+item.id)">
					<view class="fl-fs-sb" style="border-bottom:2rpx solid #EBEBEB ;" >
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
						<up-image :src="item?.orderImage" width="128rpx" height="128rpx" radius="4"></up-image>
						<view style="width: calc(100% - 158rpx);">
							<view class="cardBox-text">门票：{{item.baseOrderInfoResponse.quantity}}张</view>
							<up-gap height="12"></up-gap>
							<view class="cardBox-text">总价：{{item.orderAmount}}元</view>
						</view>
					</view>
				</view>
				<up-gap height="12"></up-gap>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { onLoad, onPageScroll, onReady } from '@dcloudio/uni-app';
	import { payScenicSpotOrderlist } from '@/api/scenicArea';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const backgroundColor = ref<string>('transparent');
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const keyword = ref('');
	const tabsId = ref('tickets');
	const documentShow = ref(false);
	const documentTypeList = ref([
		{ dictLabel: '全部', dictValue: '' },
		{ dictLabel: '待支付', dictValue: '0' },
		{ dictLabel: '已支付', dictValue: '1' },
		{ dictLabel: '已取消', dictValue: '2' },
		{ dictLabel: '退款中', dictValue: '3' },
		{ dictLabel: '已退款', dictValue: '4' },
		{ dictLabel: '退款失败', dictValue: '5' },
		{ dictLabel: '出票中', dictValue: '10' },
		{ dictLabel: '待核销', dictValue: '11' },
		{ dictLabel: '出票失败', dictValue: '12' },
		{ dictLabel: '已完成', dictValue: '6' },
	])
	const status = ref('');
	const statusname = ref('全部');
	const prickClose = () => {
		documentShow.value = false;
	}
	const prickConfirm = (e) => {
		const { value } = e;
		status.value = value[0].dictValue;
		statusname.value = value[0].dictLabel;
		getPayScenicSpotOrderlist()
		prickClose();
	}
	const tabsList = ref([
		{ name: '门票订单', id: 'tickets' },
		{ name: '年卡', id: 'annual' },
		{ name: '权益卡', id: 'rights' },
	])
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
	// status 0-待支付，1待核销，2已完成，3退款中，4已退款
	const dataList = ref([
		{ name: '西安城墙 碑林历史文化景区 (含光门)', img: imgUrl + 'del/order-icon.png', createTime: '2025-04-22 11:37:36', status: 2, price: 156.0, text: '成人票2张，学生票1张' },
		{ name: '西安城墙 碑林历史文化景区 (含光门)', img: imgUrl + 'del/order-icon.png', createTime: '2025-04-22 11:37:36', status: 0, price: 156.0, text: '成人票2张，学生票1张' },
		{ name: '西安城墙 碑林历史文化景区 (含光门)', img: imgUrl + 'del/order-icon.png', createTime: '2025-04-22 11:37:36', status: 1, price: 156.0, text: '成人票2张，学生票1张' },
		{ name: '西安城墙 碑林历史文化景区 (含光门)', img: imgUrl + 'del/order-icon.png', createTime: '2025-04-22 11:37:36', status: 3, price: 156.0, text: '成人票2张，学生票1张' },
		{ name: '西安城墙 碑林历史文化景区 (含光门)', img: imgUrl + 'del/order-icon.png', createTime: '2025-04-22 11:37:36', status: 4, price: 156.0, text: '成人票2张，学生票1张' },
	])
	const getPayScenicSpotOrderlist = async () => {
		let params = {
			keyword: keyword.value,
			payStatus: status.value
		}
		const res = await payScenicSpotOrderlist(params);
		console.log("景区门票订单",res)
		dataList.value = res.data.list;
	}
	onLoad(() => {
		getPayScenicSpotOrderlist();
	})
	const tabsChane = (item) => {
		tabsId.value = item.id
	}
</script>

<style lang="scss">
	@import url('./style.scss');
	.pagess {
		background: var(--head-color);
	}
	// page {
	// 	background: linear-gradient(180deg, #D1E5F9 0%, #F8F9FB 96%);
	// 	background-repeat: no-repeat;
	// 	background-size: 100% 100%;
	// }

	.searchBox {
		padding: 32rpx;
		box-sizing: border-box;

		.searchBox-item {
			background: rgba(255, 255, 255, 0.6);
			border-radius: 322rpx 322rpx 322rpx 322rpx;
			width: calc(100% - 210rpx);
			height: 72rpx;
			border: 2rpx solid #EBEBEB;
			padding: 0 32rpx;
			box-sizing: border-box;
		}

		.searchBox-right {
			width: 190rpx;
			height: 72rpx;
			background: rgba(255, 255, 255, 0.6);
			border-radius: 322rpx 322rpx 322rpx 322rpx;
			padding: 0 24rpx;
			box-sizing: border-box;
			font-weight: 400;
			font-size: 28rpx;
			color: #999999;
			line-height: 28rpx;
		}
	}

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
</style>