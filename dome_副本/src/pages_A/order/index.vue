<template>
	<view class="page-conent" :data-theme="pageTheme">
		<!-- <cos-header title='我的订单' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="80"></cos-header> -->
		<view class="searchView" :style="{background:backgroundColor}">
			<up-navbar title="商品订单" leftIconColor="#000000" bgColor="transparent" @leftClick="toBack"
				:placeholder="true" :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		</view>

		<view class="container-bg">
			<!-- 标签 -->
			<view class="label-container">
				<scroll-view class="label-scroll" scroll-x="true" scroll-left="scrollLeft" :show-scrollbar="false">
					<view id="demo1" v-for="(item, index) in labelList" :key="index" class="label-item fs28"
						:class="{ 'label-active': activeLabel === index }" @click="changeLabel(index,item)">
						{{ item.name }}
					</view>
				</scroll-view>

			</view>

			<!-- <view class="label-container p-l-30 p-r-70">
				<scroll-view class="label-scroll" scroll-x="true" scroll-left="scrollLeft" :show-scrollbar="false">
					<view id="demo1" v-for="(item, index) in labelList" :key="index"
						class="label-item bg-f5 m-r-30 fs26" :class="{ 'label-actived': activeLabel === index }"
						@click="changeLabel(index)">{{ item.name }}
					</view>
				</scroll-view>
				<view class="filter">
					<image class="filter-img" :src="imgUrl + 'jf/filter.png'" mode=""></image>
				</view>
			</view> -->
		</view>
		<view class="liwu-box-1">
			<view class="liwu-box" :class="{'active': giftFlag == 1}" @click="changeGiftFlag">
				<image class="liwu-icon-img" :src="imgUrl + 'liwuhezi-icon.png'" mode=""></image>
				转赠订单
			</view>
		</view>
		<scroll-view scroll-y @scrolltolower="onReachBottom" class="list-card">
			<view style="padding-top: 100rpx;" v-if="!dataList.length">
				<ser-empty text="暂无订单"></ser-empty>
			</view>
			<view v-for="(item,index) in dataList" :key="index">
				<view class="list-item" @click="toNav('/pages_A/orderDetails/index?orderId='+item.id)">
					<view class="card-h" v-if="item.receiveStatus!=null" >
						<view style="display:flex;align-items: center;">
							<image style="width: 36rpx;height: 36rpx;margin-right: 20rpx;"
								:src="imgUrl + 'liwuhezi-icon.png'" mode=""></image>
							<text v-if='item.roleType==1' >送给他的礼物</text>
							<text v-if='item.roleType==2'  >我收到的礼物</text>
						</view>
						<text class="lingqu-text-1" v-if="item.receiveStatus==0" >待领取</text>
						<text class="lingqu-text-2" v-if="item.receiveStatus==1" >已领取</text>
					</view>
					<view class="list-header flex just-sb ali-cen">
						<view class="title flex ali-cen">
							<!-- <image class="icon-40 m-r-20" :src="imgUrl + 'sm.png'" mode=""></image> -->
							<text class="fw-b">积分商城</text>
						</view>
						<view class="status flex ali-cen">
							<view class="status-txt fs26 colf fw-500" v-if="item.status==0">待支付</view>
							<view class="status-txt fs26 colf fw-500" v-if="item.status==10">待发货</view>
							<view class="status-txt fs26 colf fw-500" v-if="item.status==20">已发货</view>
							<view class="status-txt fs26 colf fw-500" v-if="item.status==30">已完成</view>
							<view class="status-txt fs26 colf fw-500" v-if="item.status==40">已取消</view>
						</view>
					</view>
					<view class="list-con flex ali-cen m-t-20 p-b-30" v-for="(el,indx) in item.items" :key="indx">
						<view class="list-food flex" style="width: 70%;">
							<image class="food-img" :src="el.picUrl" mode=""></image>
							<text>{{el.spuName}}</text>
						</view>
						<view class="total flex flex-col ali-cen">
							<text class="fs-32 fw-600 m-b-15">{{el.usePoint}}积分</text>
							<text class="fs-24 fw-500 col9">共{{el.count}}件</text>
						</view>
					</view>
					<view class="list-bottom flex just-sb ali-cen">
						<text class="fs-24 col9 fw-500">{{item.createTime}}</text>
						<view class="btns flex">
							<!-- <view class="cancel-btn m-r-20">取消订单</view> -->
							<!-- <view class="pay-btn">去支付</view> -->
							<view class="pay-btn">查看详情</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="list-item">
				<view class="list-header flex just-sb ali-cen">
					<view class="title flex ali-cen">
						<image class="icon-40 m-r-20" :src="imgUrl + 'sm.png'" mode=""></image>
						<text class="fw-b">积分商城</text>
						<view class="label m-l-15">自取</view>
					</view>
					<view class="status flex ali-cen" style="width: 100rpx;">
						<view class="time fs26 flex just-sb" >
							<view class="status-txt fs26 colf fw-500" style="background-color: #fff;color: #0077FF;">待确定</view>
						</view>
					</view>
				</view>

				<view class="address m-t-20">
					宝鸡西服务区 朋乐乐购
				</view>

				<view class="list-con flex ali-cen just-sb m-t-20 p-b-30">
					<view class="list-food flex">
						<image class="food-img" :src="imgUrl + 'logo.png'" mode=""></image>
						<view class="food-con flex flex-col">
							<view class="food-title fs-30 fw-b">西安城墙 碑林历史文化景区</view>
							<text class="fs-24 col3 fw-500">大床房 共一晚一间</text>
							<text class="fs-24 col3 fw-500">2025.03.10 至 2025.03.11</text>
						</view>

					</view>
					<view class="total flex flex-col ali-cen">
						<text class="fs-32 fw-600 m-b-15">2800积分</text>
						<text class="fs-24 fw-500 col9">共1件</text>
					</view>
				</view>

				<view class="list-bottom flex just-sb ali-cen">
					<text class="fs-24 col9 fw-500">2025-03-27 10:30:28</text>
					<view class="btns flex">
						<view class="cancel-btn m-r-20">取消订单</view>
						<view class="pay-btn">去支付</view>
					</view>
				</view>
			</view> -->
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '../../config';
	import { random, guid, timeFormat } from '@/uni_modules/uview-plus';
	import { toNav, toBack } from '@/utils/route';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { orderPage } from '@/api/points';
	import { toast } from '@/utils/common';
	import { onReachBottom } from '@dcloudio/uni-app';
	import { formatTimestamp } from '@/utils/util';

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	const backgroundColor = ref<string>('#FFFFFF');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const dataList = ref<any[]>([]);
	const total = ref<number>(0);
	const listQuery = ref({
		pageNum: 1,
		pageSize: 10,
		shopType: 1,
	})

	type labelItem = {
		id : number;
		name : string;
	};
	// 标签
	const labelList = ref<labelItem[]>([
		{ id: '', name: '全部' },
		{ id: 0, name: '待支付' },
		{ id: 10, name: '待发货' },
		{ id: 20, name: '进行中' },
		{ id: 30, name: '已完成' },
		{ id: 40, name: '已取消' }
	]);
	const toTabbar = (url : String) => {
		uni.navigateTo({
			url: url
		})
	}

	const activeLabel = ref(0); // 当前选中的标签索引
	const scrollLeft = ref(0);  // 滚动位置
	const status = ref('');
	// 切换标签
	const changeLabel = (index : number, item) => {
		activeLabel.value = index;
		status.value = item.id
		init()
		// 计算滚动位置使选中标签居中
		scrollLeft.value = index * 120 - 150; // 120是每个标签的宽度，150是屏幕一半宽度
	};
	// 初始化加载
	const init = () => {
		listQuery.value.pageNum = 1;
		dataList.value = [];
		getData()
	}
	const changeGiftFlag = () => {
		if (giftFlag.value == 1) {
			giftFlag.value = 0
		} else {
			giftFlag.value = 1
		}
		init()
	}
	const giftFlag = ref(0);
	const getData = async () => {
		let params = {
			...listQuery.value,
			status: status.value,
			giftFlag: giftFlag.value
		}
		const res = await orderPage(params);
		console.log("查询的订单数", res)
		if (res.code == 200) {
			dataList.value = listQuery.value.pageNum == 1 ? res.data.list : [...dataList.value, ...res.data.list];
			total.value = res.data.total;
		} else {
			toast(res.msg);
		}
	}

	onMounted(() => {
		// 从cos-header组件获取实际高度或计算
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
		init()
	});
	const onReachBottom = () => {
		if (total.value > dataList.value.length) {
			listQuery.value.pageNum += 1;
			getData()
		}
	}
</script>

<style scoped lang="scss">
	.page-conent {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #F1EFEC;
	}

	.active {
		background-color:#FF9BA2 ;
		color: #333333;
		border: 0rpx solid #FF9BA2;
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
		margin-top: 24rpx;
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

	.container-bg {
		width: 750rpx;

		.label-container {
			width: 100%;
			background-color: #fff;
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
						background: var(--primary-color);
						border: 1px solid var(--primary-color);
						background: #FFFBF6;
						color: var(--primary-color);
					}
				}
			}

			.label-item:last-child {
				margin-right: 100rpx !important;
			}

			.filter {
				position: absolute;
				bottom: 6rpx;
				right: 98rpx;
				width: 70rpx;
				height: 88rpx;
				background: #fff;
				box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(0, 0, 0, 0.1);

				.filter-img {
					position: absolute;
					top: 50%;
					right: 21rpx;
					transform: translateY(-50%);
					width: 28rpx;
					height: 28rpx;
				}
			}
		}
	}

	.list-card {
		width: 100%;
		flex: 1 0;
		height: 0;
		background: #F1EFEC;
		padding: 30rpx 0;
		box-sizing: border-box;


		.list-item {
			background: linear-gradient(180deg, #EBF8EE 0%, #FEFEFE 30%);
			border-radius: 20rpx;
			margin: 0 32rpx 40rpx;
			padding: 26rpx 30rpx;

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
					width: 160rpx;
					height: 60rpx;
					line-height: 60rpx;
					border-radius: 30rpx;
					border: 1px solid var(--primary-color);
					font-weight: 500;
					font-size: 28rpx;
					color: var(--primary-color);
					text-align: center;
				}
			}

		}
	}
</style>