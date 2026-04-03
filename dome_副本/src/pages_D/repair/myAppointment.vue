<template>
	<view>
		<up-navbar title="我的预约" :bgColor="navBgColor" @leftClick="toBack" placeholder :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
	</view>
	<view class="fixBg"></view>
	<view class="input-box">
		<view class="input-box-left">
			<up-input placeholder="请输入服务区/收费站名称" border="none" @blur="sechlist" style="margin-left: 25rpx;" v-model="keyword"></up-input>
			<up-icon name="search" size="28" color="#333" @click="sechlist" ></up-icon>
		</view>
	</view>
	<view class="selectView">
		<scroll-view class="scroll-view_H tabs" scroll-x="true">
			<view :class="['tabs-item',!tabsType&& tabsType != 0 ?'tabsActive':'']" @click="tabsChange()">全部</view>
			<view :class="['tabs-item',tabsType == 0?'tabsActive':'']" @click="tabsChange(0)">待服务</view>
			<view :class="['tabs-item',tabsType == 1?'tabsActive':'']" @click="tabsChange(1)">维修中</view>
			<view :class="['tabs-item',tabsType == 2?'tabsActive':'']" @click="tabsChange(2)">已完成</view>
			<view :class="['tabs-item',tabsType == 3?'tabsActive':'']" @click="tabsChange(3)">已取消</view>
		</scroll-view>
		<view class="timView" @click="showCalendar = true">
			<text>时间</text>
			<up-icon
				:name="`${imgUrl}static/${times==2?'sort-ascend-icon':times==1?'sort-descend-icon':'sort-icon'}.png`"
				size="14"></up-icon>
		</view>
		<u-calendar :show="showCalendar" mode="range" :defaultDate="defaultDate" @confirm="confirmDate"
			@close="showCalendar = false" :minDate="maxDate" :maxDate="minDate"></u-calendar>
	</view>
	<view class="container">
		<view class="service-item" v-for="(service, index) in shops" :key="index"
			@click="toNav('/pages_D/repair/repairDetails?id='+service.id)">
			<!-- 左侧图标 -->
			<view class="service-top">
				<image v-if="service.appointmentStatus==0" :src="imgUrl+'static/huang.png'" class="service-icon">
				</image>
				<image v-if="service.appointmentStatus==1" :src="imgUrl+'static/sd.png'" class="service-icon"></image>
				<image v-if="service.appointmentStatus==2" :src="imgUrl+'static/gvwe.png'" class="service-icon"></image>
				<image v-if="service.appointmentStatus==3" :src="imgUrl+'static/dwa.png'" class="service-icon"></image>
				<text class="service-title">{{ service.repairTypeName }}</text>
			</view>
			<!-- 中间信息 -->
			<view class="service-info">
				<view style="display: flex;align-items: center;margin-bottom: 39rpx;">
					<image class="time-icon" :src="imgUrl + 'static/wx-time-icon.png'" />
					<text class="service-date">{{ service.appointmentTime }}</text>
				</view>
				<view style="display: flex;align-items: center;margin-bottom: 30rpx;">
					<image class="time-icon" :src="imgUrl + 'static/wx-weizhi-icon.png'" />
					<text class="service-location">{{ service.industryAddress }}</text>
				</view>
			</view>
		</view>
	</view>
	<!-- <up-datetime-picker hasInput :show="show" mode="datetime"></up-datetime-picker> -->
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { prRepairAppointment } from '@/api/car';
	import { onLoad, onPageScroll } from '@dcloudio/uni-app';
	const navBgColor = ref('transparent');
	const times = ref(0); // 0-默认，1降序，2-升序
	const currentNum = ref(0);
	const value1 = ref(Date.now());
	const show = ref(false);
	const keyword = ref('');
	const tabsType = ref();
	const showCalendar = ref(false)
	const startDate = ref('')
	const endDate = ref('')
	const pageNum = ref(1)
	// 最小可选日期（今天）
	const minDate = computed(() => new Date().getTime())

	// 最大可选日期（90天后）
	const maxDate = computed(() => {
		const date = new Date()
		date.setDate(date.getDate() - 30)
		return date.getTime()
	})
	const shops = ref([
		{
			id: 1,
			title: '配件维修',
			date: '2025-03-26 09:10:26',
			location: '陕西省未央区天台路89号陕西汽贸集团二手车中心',
			icon: 'static/huang.png' // 替换为真实图标 URL
		},
		{
			id: 2,
			title: '故障维修',
			date: '2025-03-25 08:10:07',
			location: '陕西省高新区丈八北路途虎养车中心服务',
			icon: 'static/sd.png'
		},
		{
			id: 3,
			title: '汽车贴膜',
			date: '2025-03-20 10:16:00',
			location: '陕西省西安市新城区养车二手车中心指定服务店...',
			icon: 'static/gvwe.png'
		},
		{
			id: 4,
			title: '更换蓄电池',
			date: '2025-03-15 14:30:00',
			location: '陕西省咸阳市秦都区汽车服务中心',
			icon: 'static/dwa.png'
		}

	]);
	const confirmDate = (e) => {
		if (e && e.length >= 2) {
			startDate.value = e[0] + ' 00:00:00'
			endDate.value = e[e.length - 1] + ' 00:00:00'
		}
		sechlist()
		showCalendar.value = false
	}
	const sechlist=()=>{
		shops.value=[]
		pageNum.value=1
		getPrRepairAppointment()
	}
	// 获取预约列表
	const getPrRepairAppointment = async () => {
		let params = {
			pageNum: pageNum.value,
			pageSize: 10,
			startTime: startDate.value,
			endTime: endDate.value,
			appointmentStatus: tabsType.value,
			carRepairingSearch:keyword.value,
		}
		const res = await prRepairAppointment(params);
		shops.value = res.rows;
	}
	const tabsChange = (type : number) => {
		tabsType.value = type;
		sechlist()
	}
	const sortTime = () => {
		if (times.value == 2) {
			times.value = 0;
		} else {
			times.value = times.value + 1;
		}
	}

	onLoad(() => {
		getPrRepairAppointment()
	})

	onPageScroll((e) => {
		if (e.scrollTop > 20) {
			navBgColor.value = '#FFFFFF';
		} else {
			navBgColor.value = 'transparent';
		}
	})
</script>

<style scoped lang="scss">
	page {
		height: 100%;
		background: #F1EFEC;
	}

	.selectView {
		width: 100%;
		padding: 20rpx 32rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tabs {
		white-space: nowrap;
		width: 560rpx;
		display: flex;
		align-items: center;

		.tabs-item {
			min-width: 150rpx;
			height: 56rpx;
			line-height: 56rpx;
			text-align: center;
			background: #F7F8F9;
			font-weight: 500;
			font-size: 26rpx;
			color: #666666;
			border-radius: 28rpx;
			margin-right: 20rpx;
			display: inline-block;
		}

		.tabsActive {
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			color: #FFFFFF;
		}
	}

	.timView {
		margin-left: 30rpx;
		display: flex;
		align-items: center;

		text {
			margin-right: 10rpx;
		}
	}

	.pickers {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		box-sizing: content-box;
		z-index: 99;
		margin-top: 20rpx;
		margin-bottom: 18rpx;
	}

	.time-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 16rpx;
	}

	.filter-item {
		width: 150rpx;
		height: 56rpx;
		background: #F7F8F9;
		border-radius: 28rpx;
		font-weight: 500;
		font-size: 26rpx;
		color: #333333;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.arrow-icon {
		width: 18rpx;
		height: 18rpx;
		margin-left: 19rpx;

	}

	.input-box-right {
		width: 72rpx;
		height: 72rpx;
		background: $bgLgColor;
		border-radius: 20rpx;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 20rpx;
		color: #FFFFFF;
		padding: 15rpx;
		box-sizing: border-box;
		margin-left: 10rpx;
	}

	.input-box {
		padding: 0 32rpx;
		box-sizing: content-box;
	}

	.icon-s {}

	.input-box-left {
		padding-left: 30rpx;
		box-sizing: content-box;
		height: 72rpx;
		border-radius: 16rpx;
		border: 1px solid #CBD1D8;
		display: flex;
		align-items: center;
		padding-right: 30rpx;
	}

	.fixBg {
		width: 750rpx;
		height: 351rpx;
		background: linear-gradient(0deg, #FFFFFF, #FFECCE);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}


	.container {
		padding: 35rpx;
		background: #F1EFEC;
	}

	.service-item {
		display: flex;
		flex-direction: column;
		margin-bottom: 20rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
		padding: 22rpx 36rpx;
	}

	.service-icon {
		width: 56rpx;
		height: 56rpx;
		border-radius: 16rpx;
		margin-right: 24rpx;
		flex-shrink: 0;
	}

	.service-info {
		margin-top: 36rpx;
		flex: 1;
		overflow: hidden;
	}

	.service-title {
		font-size: 30rpx;
		color: #000;
		font-weight: bold;
		display: block;
		margin-bottom: 12rpx;
	}

	.service-date {
		font-size: 26rpx;
		color: #666;
		display: block;
		margin-bottom: 8rpx;
	}

	.service-location {
		font-size: 24rpx;
		color: #999;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.service-top {
		display: flex;
		align-items: center;
		padding-bottom: 22rpx;
		border-bottom: 1rpx solid #F2F2F2;
		;
	}
</style>