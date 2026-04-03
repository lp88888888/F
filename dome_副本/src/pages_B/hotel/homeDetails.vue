<template>
	<view class="container" :data-theme="pageTheme" >
		<!-- 轮播图 Banner -->
		<view class="bannerCon" v-if="banners.length > 0">
			<u-swiper :list="banners" height="486rpx" radius="0" indicator="none" img-mode="widthFix"
				@change="swiperChange" :current="swiperCurrent"></u-swiper>
			<view class="custom-indicator">
				{{ swiperCurrent + 1 }} / {{ banners.length }}
			</view>
			<view class="custom-icon-btn" @click="ongoback">
				<image class="custom-icon" :src="`${imgUrl}trip-pro/arrow-left-icon_w.png`" />
			</view>

		</view>

		<!-- 房间详情 -->
		<view class="room-details">
			<!-- 房间标题 -->
			<view class="room-title">{{roominfo.roomTypeName}}-无早餐</view>

			<!-- 房间基本信息 -->
			<view class="room-info">
				<view v-for="(item, index) in roomInfoList" :key="index" class="info-item">
					<text>{{ item.value }}</text>
					<text>{{ item.label }}</text>
				</view>
			</view>

			<!-- 房间设施列表 -->
			<block v-for="(section, index) in facilities" :key="index">
				<view class="facility-section">
					<view class="section-title">
						<image :src="imgUrl + section.icon" mode="aspectFit" class="icon" />
						<text>{{ section.title }}</text>
					</view>
					<view class="section-content">
						<block v-for="(subItem, subIndex) in section.items" :key="subIndex">
							<view class="content-item">
								<text>{{ subItem }}</text>
							</view>
						</block>
					</view>
				</view>
			</block>
		</view>

		<!-- <view class="policy-service">
			<view class="title">政策与服务</view>

			<view class="cancel-policy">
				<image src="" mode="aspectFit" class="icon" />
				<text class="description">今天18点前可以免费取消</text>
			</view>

			<view class="schedule">
				<view class="row header">
					<view class="time">北京时间</view>
					<view class="status">北京时间</view>
				</view>
				<view v-for="(item, index) in scheduleList" :key="index" class="row">
					<view class="time">{{ item.time }}</view>
					<view :class="['status', { 'yanse': item.isFree }]">{{ item.status }}</view>
				</view>
			</view>

			<view class="order-confirmation">
				订单需等酒店确认后生效，订单确认结果以短信或app通知为准，如订单不确认将全额退款至您的付款账户
			</view>

			<block v-for="(service, sIndex) in serviceList" :key="sIndex">
				<view class="instant-confirmation">
					<image :src="service.icon" mode="aspectFit" class="icon" />
					<text class="description1">{{ service.title }}</text>
				</view>
				<text class="sub-description">{{ service.desc }}</text>
			</block>
		</view> -->

		<!-- 费用明细 -->
		<view class="fee-details">
			<!-- 标题 -->
			<!-- <view class="title">费用明细</view> -->

			<!-- 房费 -->
			<view class="fee-item">
				<text class="label">房费</text>
				<text class="value">¥ {{roominfo.basePrice}}</text>
			</view>

			<!-- 限时优惠部分 -->
			<view class="discount-section">
				<view class="discount-item" v-if="roominfo.basePrice-roominfo.salePrice > 0">
					<text class="label">限时优惠</text>
					<text class="value" style="color: #FD4848;">- ¥ {{roominfo.basePrice-roominfo.salePrice}}</text>
				</view>
				<!-- <view class="discount-item">
					<text class="label">限时优惠</text>
					<navigator url="/pages/coupon-exchange/coupon-exchange" class="exchange-link">兑换优惠卷 ></navigator>
				</view> -->
			</view>

			<!-- 总价 -->
			<view class="total-price">¥ {{roominfo.salePrice}}</view>
		</view>

		<!-- 预订按钮容器 (底部固定) -->
		<view class="booking-container">
			<!-- 价格展示 -->
			<view class="price-display">
				<text class="current-price">¥ {{roominfo.salePrice}}</text>
				<text class="original-price">¥ {{roominfo.basePrice}}</text>
			</view>

			<!-- 预订按钮 -->
			<view class="booking-button" @tap="tohomereserve">立即预订</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	// 引入工具和API
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '@/config';
	import { getdetail } from '@/api/hotel';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	// 定义数据类型
	interface Facility {
		icon : string;
		title : string;
		items : string[];
	}

	interface RoomInfoItem {
		label : string;
		value : string;
	}

	interface ScheduleItem {
		time : string;
		status : string;
		isFree ?: boolean;
	}

	interface ServiceItem {
		icon : string;
		title : string;
		desc : string;
	}
	onLoad((options) => {
		roomId.value = options.id; // 修正了这一行
		getroomdetail();
	})
	// 页面数
	const roominfo = ref({}); // 房间类型名称
	const roomId = ref(0); // 房间ID
	const banners = ref<{ img : string;[key : string] : any }[]>([]);
	const mainIndex = ref(1); // 假设这个值来自其他地方
	const getroomdetail = async () => {

		const res = await getdetail(roomId.value);
		roominfo.value = res.data;
		facilities.value[0].title = roominfo.value.bedType
		if (roominfo.value.hasWindows) {
			facilities.value[1].title = '有窗'
		} else {
			facilities.value[1].title = '无窗'
		}
		banners.value = roominfo.value.mainImage.split(',')
		if (roominfo.value.toiletries) {
			facilities.value[2].items = roominfo.value.toiletries.split(',')
		} else {
			facilities.value[2].items = []
		}
		if (roominfo.value.breakfast) {
			facilities.value[3].items = roominfo.value.breakfast.split(',')
		} else {
			facilities.value[3].items = []
		}
		if (roominfo.value.roomFacilities) {
			facilities.value[4].items = roominfo.value.roomFacilities.split(',')
		} else {
			facilities.value[4].items = []
		}
		// facilities.value[2].items = roominfo.value.toiletries.split(',')
		// facilities.value[3].items = roominfo.value.breakfast.split(',')
		// facilities.value[4].items = roominfo.value.roomFacilities.split(',')
		roomInfoList.value[0].value = roominfo.value.floor
		roomInfoList.value[1].value = roominfo.value.area + '㎡'
		roomInfoList.value[2].value = roominfo.value.network
		roomInfoList.value[3].value = roominfo.value.hasWindowsDesc
		roomInfoList.value[4].value = roominfo.value.isSmokeFreeDesc
	};
	const swiperCurrent = ref(0);
	const facilities = ref<Facility[]>([
		{
			icon: 'hotel/chuang1.png',
			title: '一张1.8米的单人床',
			items: [],
		},
		{
			icon: 'hotel/zaocan-idon.png',
			title: '无早餐',
			items: [],
		},
		{
			icon: 'hotel/xishu1.png',
			title: '洗漱用品',
			items: ['印刷', '牙膏', '沐浴露', '洗发水', '护发素', '香皂', '浴帽', '梳子', '剃须刀'],
		},
		{
			icon: 'hotel/chifan.png',
			title: '食品饮品',
			items: ['咖啡壶', '茶包', '瓶装水', '电热水壶'],
		},
		{
			icon: 'hotel/shafa1.png',
			title: '客房设施',
			items: ['电视', '空调', 'WIFI', '电话'],
		},
	]);

	// 房间基本信息 - 提取为数组便于v-for
	const roomInfoList = ref<RoomInfoItem[]>([
		{ label: '楼层', value: '1-4层' },
		{ label: '空间', value: '23㎡' },
		{ label: '网络', value: 'WIFI免费' },
		{ label: '窗户', value: '有窗' },
		{ label: '吸烟', value: '禁烟' },
	]);

	// 时间表数据
	const scheduleList = ref<ScheduleItem[]>([
		{ time: '04月10日 18:00前', status: '免费', isFree: true },
		{ time: '04月10日 18:00后', status: '不可取消' },
	]);

	// 服务列表数据
	const serviceList = ref<ServiceItem[]>([
		{
			icon: '/path/to/check-icon.png',
			title: '立即确认',
			desc: '预订此房型后酒店可快速确认订单',
		},
		{
			icon: '/path/to/invoice-icon.png',
			title: '开具发票',
			desc: '下单后可告知酒店前提需开具发票，退房时直接在前台领取',
		},
	]);
	const ongoback = () => {
		uni.navigateBack()
	}
	// 获取广告Banner
	const getBanner = async () => {
		const params = {
			type: 'photoTrucks',
		};


	};

	// 跳转到预订页
	const tohomereserve = () => {
		uni.navigateTo({
			url: `/pages_B/hotel/homereserve?id=${roominfo.value.roomTypeId}&hotelId=${roominfo.value.hotelId}&roomid=${roominfo.value.id}`,
		});
	};

	// 生命周期钩子
	onMounted(() => {
		// 页面加载完成
	});
</script>

<style lang="scss" scoped>
	// 注意：uni-app 中使用 rpx 单位
	.bannerCon {
		position: relative;
		height: 486rpx;
	}

	.custom-indicator {
		position: absolute;
		bottom: 20rpx; // 调整距离底部的距离
		right: 20rpx; // 调整距离右侧的距离
		background-color: rgba(0, 0, 0, 0.3); // 半透明黑色背景
		color: #ffffff; // 白色文字
		padding: 6rpx 16rpx; // 内边距
		border-radius: 20rpx; // 圆角
		font-size: 24rpx; // 字体大小
		z-index: 10; // 确保在轮播图之上
	}

	.custom-icon-btn {
		width: 48rpx;
		height: 48rpx;
		background: rgba(0,0,0,0.4);
		position: absolute;
		top: 106rpx; // 调整距离底部的距离
		left: 20rpx; // 调整距离右侧的距离
		z-index: 10; // 确保在轮播图之上
		border: 50%;
		text-align: center;
		line-height: 48rpx;
		border-radius: 50%;
	}
	.custom-icon {
		width: 32rpx;
		height: 32rpx;
		margin-top: 6rpx;
	}

	.container {
		background: var(--head-color);
		min-height: 100vh;
		padding-bottom: 160rpx; // 为底部按钮留出空间
	}

	/* Banner 样式 */
	.banner-con {
		position: relative;
		height: 486rpx;
	}

	// uView Swiper 指示器样式需要覆盖
	.banner-line {
		position: absolute;
		bottom: 12rpx;
		right: 12rpx;
		display: flex;
		align-items: center;
		height: 48rpx;
		border-radius: 32rpx;
		opacity: 1;
		background: rgba(0, 0, 0, 0.7);
		padding-left: 10rpx;
	}

	.tab {
		font-size: 20rpx;
		color: #fff;
		line-height: 40rpx;
		text-align: center;
		border-radius: 24rpx;
		width: 86rpx;
		height: 40rpx;
	}

	/* 房间详情 */
	.room-details {
		background-color: #fff;
		padding: 32rpx;
		margin-bottom: 20rpx;
	}

	.room-title {
		font-size: 40rpx;
		color: #333;
		margin-bottom: 20rpx;
		font-weight: 700;
	}

	.room-info {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}

	.info-item {
		width: 20%;
		text-align: center;
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: column;
		height: 76rpx;
		justify-content: space-between;
	}

	.info-item text:first-child {
		font-size: 28rpx;
		color: #333;
		font-weight: 700;
	}

	.info-item text:last-child {
		font-size: 24rpx;
		color: #999;
	}

	.facility-section {
		margin-bottom: 20rpx;
		padding: 24rpx 24rpx;
	}

	.section-title {
		font-size: 28rpx;
		font-weight: 700;
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.icon {
		width: 64rpx;
		height: 64rpx;
		margin-right: 10rpx;
	}

	.section-title text {
		font-size: 32rpx;
		color: #333;
	}

	.section-content {
		display: flex;
		flex-wrap: wrap;
		padding-left: 74rpx;
	}

	.content-item {
		width: 50%;
		margin-bottom: 10rpx;
	}

	.content-item text {
		font-size: 28rpx;
		color: #333;
	}

	/* 政策与服务 */
	.policy-service {
		background-color: #fff;
		padding: 32rpx;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 40rpx;
		color: #333;
		margin-bottom: 24rpx;
		font-weight: 700;
	}

	.cancel-policy {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.description {
		font-size: 32rpx;
		color: var(--primary-color);
		font-weight: 700;
	}

	.schedule {
		box-sizing: border-box;
		margin-bottom: 20rpx;
		border: 2rpx solid rgba(0, 0, 0, 0.06);
		border-radius: 16rpx;
	}

	.row {
		display: flex;
		justify-content: space-between;
		height: 94rpx;
		border-bottom: 1rpx solid #ddd;
	}

	.header {
		background: #faf9f8;
	}

	.time,
	.status {
		width: 50%;
		text-align: center;
		font-size: 28rpx;
		color: #333;
		line-height: 96rpx;
	}

	.time {
		border-right: 1rpx solid #ddd;
	}

	.yanse {
		color: #fd4848;
	}

	.order-confirmation {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 20rpx;
		line-height: 44rpx;
	}

	.instant-confirmation {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.description1 {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}

	.sub-description {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}

	/* 费用明细 */
	.fee-details {
		background-color: #fff;
		padding: 32rpx;
		margin-bottom: 20rpx;
	}

	.fee-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 96rpx;
		padding: 0 16rpx;
		line-height: 96rpx;
		background-color: #f5f5f5;
		margin-bottom: 20rpx;
	}

	.label {
		font-size: 28rpx;
		color: #666;
	}

	.value {
		font-size: 28rpx;
		color: #333;
	}

	.discount-section {
		background: rgba(178, 100, 0, 0.05);
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}

	.discount-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 96rpx;
		padding: 0 16rpx;
		line-height: 96rpx;
	}

	.exchange-link {
		font-size: 24rpx;
		color: #fd4848;
	}

	.total-price {
		font-size: 36rpx;
		color: #333;
		font-weight: 700;
		text-align: right;
		padding-bottom: 30rpx;
	}

	/* 底部预订按钮 */
	.booking-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 160rpx;
		box-sizing: border-box;
		padding: 32rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0px -8px 20px 0px rgba(0, 0, 0, 0.03);
		z-index: 9;
	}

	.price-display {
		display: flex;
		align-items: baseline;
	}

	.current-price {
		font-size: 48rpx;
		color: var(--primary-color);
		margin-right: 10rpx;
	}

	.original-price {
		font-size: 28rpx;
		color: #999;
		text-decoration: line-through;
	}

	.booking-button {
		background:var(--primary-color);
		color: #fff;
		border-radius: 50rpx;
		padding: 20rpx 40rpx;
		font-size: 32rpx;
		font-weight: 700;
		z-index: 99;
	}
</style>