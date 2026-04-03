<template>
	<view class="container" :data-theme="pageTheme">
		<!-- <cos-header title="我的卡包" :background-color="backgroundColor" style="position:fixed;top:0;z-index:999;"
			:font-color="fontColor" :fixed="fixed" :defaultNavBarheight="100" /> -->
			<view class="searchView">
		<up-navbar title="我的卡包"  @leftClick="toBack" placeholder :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		</view>
		<view class="tab-con" :style="{ top: 20 + 'px' }">
			<view class="tab-con1">
				<view v-for="(tab, index) in tabs" :key="index" class="tab-item" @click="tabChange(index)">
					<text :class="['tab-text', tabIndex === tab.value ? 'tab-select' : 'tab-normal']">
						{{ tab.label }}
					</text>
					<image v-if="tabIndex === tab.value" style="width: 30rpx; height: 8rpx;"
						:src="imgUrl + 'zcby.png'" />
				</view>
			</view>
		</view>

		<!-- 列表区域 -->
		<scroll-view scroll-y class="list-con" :style="{ paddingTop: (0) + 'px', height: '90vh' }"
			@scrolltolower="onReachBottom" v-if="addgasolinelist.length">
			<view v-for="item in addgasolinelist" :key="item.id" class="item-con"
				:class="{ 'is-disabled': tabIndex == 2 || tabIndex == 3 }" :style="bgStyle">
				<view class="item-line">
					<!-- <text class="item-title">满<text class="fs-44">500</text>减<text class="fs-44">15</text>元加油优惠券 </text> -->
					<text class="item-type">{{item.name}}</text>
				</view>
				<view class="item-line">
					<text class="fs-24 col6 fw-400">有效期限:{{ item.validEndTime || '-' }}</text>
					<view class="item-btn" @click="qrCodeFun(item)" v-if="item.writeOffPlatform==1">核销码</view>
				</view>
			</view>

			<view class="loading-tip" v-if="loading">加载中...</view>
			<view class="loading-tip" v-else-if="finished && addgasolinelist.length">没有更多数据了</view>
		</scroll-view>

		<!-- 空组件 -->
		<view :style="{ marginTop: (68) + 'px', background: '#f8f9fb' }">
			<ser-empty v-if="!addgasolinelist.length && !loading"></ser-empty>
		</view>

		<up-popup :show="show" @close="close" @open="open" mode="center">
			<view>
				<view style="margin: 30rpx;"> 凭【二维码】到店消费</view>
				<view class="ewm" :style="{ backgroundImage: 'url(' + img + ')' }"></view>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue'
	import { imgUrl } from '@/config'
	import { toNav, toBack } from '@/utils/route';
	import CosHeader from '@/components/customNavBar/index.vue'
	import { busTicketOrderList } from '@/api/busticket'
	import {
		getcouponslist, qrCode
	} from '@/api/index';
	const navBarHeight = ref(0)
	const show = ref(false)
	const backgroundColor = ref<string>('transparent')
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const img = ref('')
	const fontColor = ref('#000000')
	const fixed = ref(true)
	const backgroundImage = ref(imgUrl + 'coupon_bg.png')
	const bgStyle = computed(() => {
		if (!backgroundImage.value) return {}
		return {
			backgroundImage: `url(${backgroundImage.value})`,
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat'
		}
	})
	// Tabs
	const tabs = [
		{ label: '待使用', value: '1' },
		{ label: '已使用', value: '2' },
		{ label: '已过期', value: '3' },
	]
	const tabIndex = ref<string>('1')

	// 列表 & 分页
	const addgasolinelist = ref<any[]>([])
	const pageNum = ref(1)
	const loading = ref(false)
	const finished = ref(false)

	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync()
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44

		pageNum.value = 1
		finished.value = false
		loadData(true)
	})
	const open = () => {
		show.value = true;
	}

	const close = () => {
		show.value = false;
	}
	const orderStatusText = (status : number | string) => {
		const map : Record<string | number, string> = {
			0: '待使用',
			1: '即将过期',
			2: '已过期',
			3: '已使用'
		}
		return map[status] || 0
	}

	const qrCodeFun = async (val : any) => {
		const params = {
			couponId: val.couponId
		}
		const res = await qrCode(params)
		if (res.code == 200) {
			img.value = "data:image/png;base64," + res.data
			show.value = true;
		}
	}

	const loadData = async (reset = false) => {
		if (loading.value) return
		if (!reset && finished.value) return

		loading.value = true

		const params = {
			pageNum: pageNum.value,
			pageSize: 10,
			status: tabIndex.value,
			categoryName: ''

			// status: tabIndex.value, // 仅保留状态筛选
		}

		try {
			const res = await getcouponslist(params)
			if (res.code === 200 && res.data) {
				const list = res.data.list || []
				if (reset) addgasolinelist.value = list
				else addgasolinelist.value = addgasolinelist.value.concat(list)

				if (list.length < params.pageSize) finished.value = true
			}
		} finally {
			loading.value = false
		}
	}

	const onReachBottom = () => {
		if (finished.value) return
		pageNum.value++
		loadData()
	}

	const tabChange = (index : number) => {
		tabIndex.value = tabs[index].value
		pageNum.value = 1
		finished.value = false
		addgasolinelist.value = []
		loadData(true)
	}

	const itemClick = (item : any) => {
		uni.navigateTo({
			url: `/pages_D/busTicket/details?id=${item.orderNo}&startStationCode=${item.startStationCode}`,
		})
	}
</script>

<style scoped lang="scss">
	.searchView {
		background: var(--head-color);
	}
	.container {
		min-height: 100vh;
	}

	.tab-con {
		width: 100%;
		padding: 0 40rpx 4rpx;
		box-sizing: border-box;
		background: var(--head-color);
		// position: fixed;
		// left: 0;
		// z-index: 999;
	}

	.tab-con1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
	}

	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tab-text {
		font-size: 32rpx;
		margin-bottom: 12rpx;
	}

	.tab-select {
		font-weight: bold;
		color: #333;
	}

	.tab-normal {
		font-weight: 500;
		color: #333;
	}

	.list-con {
		padding: 0 32rpx;
		box-sizing: border-box;
	}

	.item-con {
		background: #fff;
		border-radius: 16rpx;
		padding: 40rpx 40rpx 28rpx 58rpx;
		margin-bottom: 20rpx;
		box-sizing: border-box;
		height: 188rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.item-line {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		color: #333;
		margin-bottom: 12rpx;
	}

	.item-title {
		font-weight: 700;
		font-size: 32rpx;
		color: #FF2749;
	}

	.item-type {
		font-weight: 700;
		font-size: 40rpx;
	}

	.item-btn {
		width: 134rpx;
		height: 38rpx;
		line-height: 38rpx;
		background: linear-gradient(170deg, #FFEDDB 0%, #FFE1B9 100%);
		border-radius: 156rpx 156rpx 156rpx 156rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #EA072B;
		text-align: center;
	}

	.loading-tip {
		text-align: center;
		color: #999;
		font-size: 24rpx;
		padding: 20rpx 0 40rpx;
	}

	.is-disabled {
		opacity: 0.55;
		pointer-events: none;
	}

	.ewm {
		width: 620rpx;
		height: 520rpx;
		margin: 0 auto;
		background-size: 100% 100%;
	}
	::v-deep .u-status-bar{
		background: transparent !important;
	}
</style>