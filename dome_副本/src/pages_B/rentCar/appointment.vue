<template>
	<view class="box-container" :data-theme="pageTheme" >
		<up-navbar title="我的预约" leftIconSize="22" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="container">
			<!-- 搜索栏 -->
			<view class="search-bar">
				<up-search placeholder="请搜索" v-model="carName" searchIconColor="#000000" shape="round" bgColor="#FFFFFF"
					@change="selectRentCarlistFun" actionText :showAction="false" clearabled></up-search>
			</view>

			<!-- 标签栏 -->
			<view class="tab-bar">
				<view class="tab-bar-bql">
					<view v-for="(item,index) in list" :key="index"
						:class="['tab-item', { active: activeisow== index }]" @click="handleTabClick(item.type,index)">
						{{item.name}}</view>
				</view>
				<view class="time-filter" @click="openTime()">
					时间筛选
					<image :src="imgUrl+'rentCar-iocn4.png'" mode="" class="icon" v-if="!timeBy"></image>
					{{timeBy}}
				</view>
				
			</view>
		</view>
		<!-- 预约列表 -->
		<view class="appointment-list">
			<view class="appointment-item" v-for="(item,index) in appointmentList" :key="index" @click="pathUrl(item.id)">
				<view class="item-top">
					<text class="car-name">{{item.typeName}}</text>
					<text class="status completed" v-if="item.status==1">已完成</text>
					<text class="status pending" v-else>待服务</text>
				</view>
				<view class="item-info">
					<image :src="imgUrl+'rentCar-iocn1.png'" mode="" class="icon"></image>
					<text class="info-label">创建时间 |</text>
					<text class="info-value">{{item.createTime}}</text>
				</view>
				<view class="item-info item-info-flex">
					<view>
						<image :src="imgUrl+'rentCar-iocn2.png'" mode="" class="icon"></image>
						<text class="info-label">门店名称 |</text>
						<text class="info-value">{{item.prIndustry4sVo.name}}</text>
					</view>
					<!-- <view class="dh">
						<image :src="imgUrl+'rentCar-iocn3.png'" mode="" class="icon"></image>
						<text class="go-store">去门店</text>
					</view> -->
				</view>
			</view>
			<ser-empty v-if="appointmentList.length == 0"></ser-empty>
		</view>
		<up-datetime-picker :show="timeShow" v-model="timeValue" closeOnClickOverlay mode="date"
			@cancel="closeTime" @close="closeTime" @confirm="timeConfirm"></up-datetime-picker>
			
		<up-picker :show="dealerShow" :columns="columns" :confirmColor="themeStore.themeColors.$primaryColor"
		 keyName="name" valueName="id"
		 @close="prickClose" @cancel="prickClose" @confirm="prickConfirm" ></up-picker>	
	</view>
</template>
<script setup lang="ts">
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		imgUrl
	} from '@/config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import theme from '@/utils/theme';
	import { timeFormat } from '@/uni_modules/uview-plus';
	import {
		selectRentCarList
	} from '@/api/rentCar';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);	
	
	const timeShow = ref(false);
	import { toNav,toBack } from '@/utils/route';
	const list = ref([{
		name: '全部',
		type: ''
	}, {
		name: '待服务',
		type: '0'
	}, {
		name: '已完成',
		type: '1'
	}])
	const activeisow = ref(0)
	const active= ref('')
	const activetetx = ref('')
	const carName = ref('')
	const fixed = ref < boolean > (true);
	const navBarHeight = ref(0);
	const timeBy= ref('')
	const timeValue =ref(Date.now());
	const minDate = ref(Date.now())
	const dealerShow = ref(false);
	const appointmentList= ref([])
	const selectRentCarlistFun = async () => {
		let params = {
			carName: carName.value,
			status: active.value,
			startTime: timeBy.value,
			endTime:timeBy.value,
		}
		const res = await selectRentCarList(params);
		appointmentList.value=res.rows
	}
	const handleTabClick = (type,index) => {
		active.value=type
		activeisow.value = index
		selectRentCarlistFun()
	}
	const pathUrl = (id) => {
		uni.navigateTo({
			url: `/pages_B/rentCar/rentCarDetails?id=` + id
		});
	}
	const timeConfirm = (event) => {
		timeBy.value = timeFormat(event.value, "yyyy-mm-dd")
		timeShow.value = false;
		selectRentCarlistFun()
	};
	const closeTime = () => {
		timeShow.value = false;
		timeBy.value=''
		selectRentCarlistFun()
	}
	const openTime = (type) => {
		minDate.value = Date.now();
		timeShow.value = true
	}
	onMounted(() => {
		// 从cos-header组件获取实际高度或计算
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});
	onLoad(() => {
		selectRentCarlistFun()
	});
</script>
<style scoped>
	.box-container {
		width: 100%;
		height: 100vh;
		background: var(--head-color);
		z-index: 999;
		overflow: hidden;
	}

	.container {
		padding: 10px;

	}

	.search-bar {
		border-radius: 40rpx;
		padding: 6rpx 0;
		background: #fff;
		margin-bottom: 10px;
	}

	.search-icon {
		margin-right: 5px;
	}

	.search-placeholder {
		color: #999;
	}

	.tab-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 8px;
		padding: 0 20rpx;
	}

	.tab-bar-bql {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #666;
		/* 给下划线留空间 */
		position: relative;
		/* 伪元素定位基准 */
	}

	.tab-item {
		padding: 5px 10px;
		border-radius: 4px;
		position: relative;
		font-size: 28rpx;
	}

	.active {
		color: #333333;
	}

	/* 激活态底部下划线（伪元素实现） */
	.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 12rpx;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/zcby.png');
		background-size: 100% 100%;
	}

	.time-filter {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #FFFFFF;
		border-radius: 322rpx 322rpx 322rpx 322rpx;
		color: #3D3D3D;
		padding: 5rpx 10rpx;
	}

	.appointment-list {
		height: 80vh;
		padding: 0 10px;
		overflow-x: scroll;
	}

	.appointment-item {
		padding: 20rpx;
		margin-bottom: 10px;
		background-color: #fff;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
	}

	.appointment-item:last-child {
		padding: 20rpx;
		border-bottom: none;
		margin-bottom: 0;
	}

	.item-top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 5px;
	}

	.car-name {
		width: 550rpx;
		font-weight: bold;
		font-size: 16px;
	}

	.status {
		font-size: 14px;
		border-radius: 4px;
		padding: 2px 5px;
	}

	.status.pending {
		color: #4381ED;
	}

	.status.completed {
		color: #666666;
	}

	.item-info {
		display: flex;
		align-items: center;
		margin-bottom: 5px;
		font-size: 28rpx;
		color: #333333;
	}

	.item-info-flex {
		justify-content: space-between;
	}

	.info-label {
		color: #333333;
		margin-right: 5px;
	}

	.go-store {
		color: #666666;
		padding-bottom: 5rpx;
		margin-right: 13rpx;
		border-bottom: 1px solid #666666;
	}

	.icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
		vertical-align: middle;
	}

	.dh {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>