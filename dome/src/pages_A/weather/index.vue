<template>
	<view class="container">
		<!-- 导航栏 -->
		<up-navbar title="天气详情" bgColor="transparent" @leftClick="toBack" :placeholder="false" fixed
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<!-- 顶部背景 -->
		<view class="topBg">
			<!-- <cos-header title='天气详情' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
				:defaultNavBarheight="240"></cos-header> -->
			<!-- 今日天气 -->
			<view class="today">
				<view class="plus">
					<view @click="toNav('/pages_A/address/city')"
						style="display: flex;align-items: center;justify-content: center; gap: 10rpx;">
						<text>{{city}}</text>
						<up-icon name="arrow-down" color="#000" size="12"></up-icon>
					</view>
					<view class="btn_cz" @click="cityFun">获取当前</view>
				</view>
				<image v-if="weatherNow.icon"
					:src="`https://tranalioss.shanyitong.com/wximage/trip-pro/weather/${weatherNow.icon}.png`"
					class="todayImg" />
				<view class="colCon" style="margin-left: 80rpx">
					<view class="tex24_33_b">{{ name }}</view>
					<view style="margin-top: 30rpx">
						<text class="tex24_33_b" style="font-size: 80rpx">{{ weatherNow.temp }}</text>
						<text class="tex24_33_b" style="font-size: 34rpx">℃</text>
						<text class="tex24_33_b" style="margin-left: 20rpx">{{ weatherNow.text }}</text>
					</view>
					<view>
						<image src="https://tranalioss.shanyitong.com/wximage/trip-pro/weather/ic_air.png'"
							class="icAir" />
						<text class="tex24_33_b" style="margin-left: 10rpx">空气</text>
						<text class="tex24_33_b" style="color: #00ac3d; margin-left: 10rpx">{{ airNow.category }}</text>
						<image src="https://tranalioss.shanyitong.com/wximage/trip-pro/weather/ic_wind.png'"
							class="icWind" />
						<text class="tex24_33_b" style="margin-left: 10rpx">风力</text>
						<text class="tex24_33_b"
							style="color: #bb9c2f; margin-left: 10rpx">{{ weatherNow.windScale }}级</text>
					</view>
				</view>
			</view>
		</view>
		<view class="warning-container">
			<!-- 轮播区域 -->
			<swiper v-if="warnings.length > 0" class="warning-swiper" :indicator-dots="false" :autoplay="true"
				:interval="5000" :duration="500" circular @change="onSwiperChange">
				<swiper-item v-for="(item, index) in warnings" :key="item.id || index">
					<view class="warning-card" :class="getBgClass(item.color?.code)" @click="handleClick(item)">
						<text class="icon">⚠️</text>
						<view class="content">
							<text class="title">{{ item.headline }}</text>
							<text class="info">{{ item.eventType?.name }} · {{ formatTime(item.issuedTime) }}</text>
						</view>
						<text class="arrow">→</text>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 详情内容 -->
		<view class="detailCon">
			<!-- 24小时天气 -->
			<view class="tex28_33_b">24小时天气</view>
			<scroll-view class="conHour" scroll-x="true">
				<view class="scrollview">
					<view v-for="(item, index) in weather24List" :key="index" class="cellHour">
						<text class="tex24_33">{{ item.hour === 24 ? 0 : item.hour }}:00</text>
						<image :src="`https://tranalioss.shanyitong.com/wximage/trip-pro/weather/${item.icon}.png`"
							class="icWeatherSmall" />
						<text class="tex24_33_b" style="color: #666666">{{ item.temp }}℃</text>
					</view>
				</view>
			</scroll-view>

			<!-- 未来一周 -->
			<view class="tex28_33_b" style="margin-top: 20rpx">未来一周天气</view>
			<view class="weekCon">
				<view v-for="(item, index) in weather7dList" :key="index" class="weekCell">
					<text class="tex32_33" style="flex: 1">{{ item.week }}</text>
					<view class="centerCon">
						<image :src="`https://tranalioss.shanyitong.com/wximage/trip-pro/weather/${item.iconDay}.png`"
							class="icWeatherSmall" />
					</view>
					<view style="width: 170rpx; text-align: end">
						<text class="tex28_33">{{ item.tempMin }}℃~{{ item.tempMax }}℃</text>
					</view>
				</view>
			</view>

			<!-- 生活指数 -->
			<view class="tex28_33_b" style="margin-top: 20rpx">生活指数</view>
			<view class="life">
				<view v-for="(item, index) in lifeCategory" :key="index" class="lifeCell">
					<image :src="item.img" class="liftImg" />
					<view class="colCon">
						<text class="tex24_66">{{ item.name }}</text><br />
						<text class="tex28_33" style="margin-top: 4rpx">{{ item.category }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		onLoad,
		onShow,
		onPageScroll,
		onHide
	} from '@dcloudio/uni-app';
	import { getWeatherWarnings } from '@/api/weather' // 假设你的API接口
	import {
		toNav,
		toBack
	} from '@/utils/route';
	// 全局变量
	import {
		imgUrl
	} from '../../config';
	const weatherKey = 'c378003293184af18adad854cc0c12bc';
	import CosHeader from '@/components/customNavBar/index.vue';
	import {
		getTadayApi,
		getairNowapi,
		getWeather24api,
		getWeather7dapi,
		getIndices1dapi
	} from '@/api/weather.ts';
	import { getLocationInfoid } from "@/api/index";
	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const city = ref('');
	// 页面数据
	const name = ref('')
	const locationId = ref('')

	const weatherNow = ref({})
	const airNow = ref({})
	const weather24List = ref([])
	const weather7dList = ref([])
	const lifeCategory = ref([])
	const lat = ref('')
	const cityFun = () => {
		let map = uni.getStorageSync('address')
		city.value = map.city + '/' + map.district
		locationId.value = uni.getStorageSync('locationId')
		getWeatherNow()
		// getAirNow()
		getWeather24()
		getWeather7d()
		getIndices1d()
	}
	// 获取系统信息
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync()
		// 动态获取导航栏高度（H5/小程序）
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度


	})
	const getyujing = async () => {
		let params = {
			location: locationId.value,
		}
		try {
			const res = await getWeatherWarnings(params)
			warnings.value = res.data.alerts || []
		} catch (error) {
			console.error('获取天气预警失败', error)
			uni.showToast({ title: '加载失败', icon: 'none' })
		}
	}

	onShow(() => {
		// #ifdef APP

		// #endif
		if (uni.getStorageSync('appaddress')) {
			const addr = uni.getStorageSync('appaddress')
			setSelectedAddress(addr)
			uni.removeStorageSync('appaddress')
		}
		
	})

	onLoad((options) => {
		if (options.coordinate) {
			locationId.value = options.coordinate
		} else {
			locationId.value = uni.getStorageSync('locationId')
		}
		if (options.district) {
			city.value = options.city + '/' + options.district
		} else {
			let map = uni.getStorageSync('address')
			city.value = map.city + '/' + map.district
		}

		getWeatherNow()
		// getAirNow()
		getWeather24()
		getWeather7d()
		getIndices1d()
		getyujing()

	})
	onHide(() => {
		uni.removeStorage({ key: 'selectedAddress' })
	})
	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}
	// 预警数据
	const warnings = ref<any[]>([])
	const getBgClass = (level : string) => {
		const map : Record<string, string> = {
			blue: 'bg-blue',
			yellow: 'bg-yellow',
			orange: 'bg-orange',
			red: 'bg-red'
		}
		return map[level] || 'bg-default'
	}

	// 时间格式化（可选）
	const formatTime = (timeStr : string) => {
		if (!timeStr) return ''
		return timeStr.replace(' ', ' ')
	}

	// 点击跳转详情
	const handleClick = (item : any) => {
		uni.navigateTo({
			url: `/pages_A/weather/warning?location=${locationId.value}`
		})
	}

	const onSwiperChange = (e : any) => {
		console.log('当前轮播索引:', e.detail.current)
	}
	// 获取实时天气
	const getWeatherNow = async () => {
		const params = {
			key: weatherKey,
			location: locationId.value,
			lang: 'zh-hans',
			unit: 'm'
		}
		try {
			const response = await getTadayApi(params);
			console.error(response)
			weatherNow.value = response.now;
		} catch (error) {
			console.error(error);
		}
	}

	// 获取空气质量
	// const getAirNow = async () => {
	// 	const params = {
	// 		key: weatherKey,
	// 		location: locationId.value,
	// 		lang: 'zh-hans',
	// 		unit: 'm'
	// 	}
	// 	try {
	// 		const response = await getairNowapi(params);
	// 		console.error(response)
	// 		airNow.value = response.now;
	// 	} catch (error) {
	// 		console.error(error);
	// 	}

	// }

	// 获取24小时天气
	const getWeather24 = async () => {
		const params = {
			key: weatherKey,
			location: locationId.value,
			lang: 'zh-hans',
			unit: 'm'
		}

		try {
			const response = await getWeather24api(params);
			const nowHour = new Date().getHours()
			const result = response.hourly.map((item, index) => {
				const nextHour = nowHour + index
				return {
					...item,
					hour: nextHour > 24 ? nextHour - 24 : nextHour
				}
			})
			weather24List.value = result
		} catch (error) {
			console.error(error);
		}

	}

	// 获取7天天气
	const getWeather7d = async () => {
		const params = {
			key: weatherKey,
			location: locationId.value,
			lang: 'zh-hans',
			unit: 'm'
		}
		try {
			const response = await getWeather7dapi(params);
			const nowWeek = new Date().getDay()
			const result = response.daily.map((item, index) => {
				const nextWeek = nowWeek + index
				return {
					...item,
					week: getWeek(nextWeek > 6 ? nextWeek - 7 : nextWeek)
				}
			})
			weather7dList.value = result
		} catch (error) {
			console.error(error);
		}
	}

	// 获取生活指数
	const getIndices1d = async () => {
		const params = {
			key: weatherKey,
			location: locationId.value,
			type: '2,3,5,9'
		}
		try {
			const response = await getIndices1dapi(params);
			const result = response.daily.map((item) => {
				let img = ''
				if (item.type == 2) {
					img = 'https://tranalioss.shanyitong.com/wximage/trip-pro/weather/xiche@2x.png'
				} else if (item.type == 3) {
					img = 'https://tranalioss.shanyitong.com/wximage/trip-pro/weather/chuanyi@2x.png'
				} else if (item.type == 5) {
					img = 'https://tranalioss.shanyitong.com/wximage/trip-pro/weather/ziwaix@2x.png'
				} else {
					img = 'https://tranalioss.shanyitong.com/wximage/trip-pro/weather/gaomao@2x.png'
				}
				return {
					...item,
					img
				}
			})
			lifeCategory.value = result
		} catch (error) {
			console.error(error);
		}

	}

	// 转换星期
	const getWeek = (num) => {
		const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
		return weeks[num]
	}
	const setSelectedAddress = async (selectedAddress : any) => {
		console.log('okokokokok')
		// // 保存接收的地址数据
		// address.value = selectedAddress.province + '/' + selectedAddress.city + '/' + selectedAddress.district
		// province.value = selectedAddress.province
		// district.value = selectedAddress.district
		city.value = selectedAddress.city + '/' + selectedAddress.district
		let params = {
			locationNameZh: selectedAddress.district,
			adm2NameZh: selectedAddress.city
		}
		const response = await getLocationInfoid(params)
		if (response.code == 200) {
			locationId.value = response.data.locationId
			getWeatherNow()
			// getAirNow()
			getWeather24()
			getWeather7d()
			getIndices1d()
			getyujing()
		}
	}
	defineExpose({
		setSelectedAddress
	})
</script>

<style lang="scss" scoped>
	.warning-container {
		padding: 20rpx;
	}

	.warning-swiper {
		height: 150rpx;
	}

	.warning-card {
		display: flex;
		align-items: center;
		padding: 24rpx 30rpx;
		border-radius: 16rpx;
		color: #fff;
		font-size: 28rpx;
	}

	.warning-card .icon {
		font-size: 36rpx;
		margin-right: 16rpx;
	}

	.content {
		flex: 1;
		overflow: hidden;
	}

	.title {
		font-weight: bold;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.info {
		font-size: 24rpx;
		opacity: 0.9;
		margin-top: 6rpx;
	}

	.arrow {
		font-size: 32rpx;
		margin-left: 12rpx;
	}

	/* 背景色（与 color.code 对应） */
	.bg-blue {
		background-color: #007AFF;
		/* 蓝色 */
	}

	.bg-yellow {
		background-color: #FFC107;
		/* 黄色 */
	}

	.bg-orange {
		background-color: #FF9800;
		/* 橙色 */
	}

	.bg-red {
		background-color: #F44336;
		/* 红色 */
	}

	.bg-default {
		background-color: #9E9E9E;
	}

	.empty-tip {
		text-align: center;
		color: #999;
		font-size: 28rpx;
		padding: 40rpx 0;
	}

	.container {
		background-color: #ffffff;
	}

	.topBg {
		width: 750rpx;
		height: 610rpx;
		background-image: url('https://tranalioss.shanyitong.com/wximage/trip-pro/weather/topBg.png');
		background-size: 750rpx 610rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.back {
		position: absolute;
		left: 0;
		right: 0;
		z-index: 99;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
	}

	.arrow-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}

	.today {
		width: 702rpx;
		height: 310rpx;
		border-radius: 10rpx;
		background-color: rgba(255, 255, 255, 0.8);
		margin-top: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 50rpx;
		box-sizing: border-box;
		position: relative;
	}

	.todayImg {
		width: 160rpx;
		height: 160rpx;
	}

	.icAir {
		width: 24rpx;
		height: 18rpx;
	}

	.icWind {
		width: 26rpx;
		height: 20rpx;
		margin-left: 30rpx;
	}

	.detailCon {
		width: 750rpx;
		min-height: 1506rpx;
		background-color: #ffffff;
		border-radius: 30rpx 30rpx 0 0;
		padding: 30rpx 24rpx;
		box-sizing: border-box;
		position: relative;
		top: -20rpx;
	}

	.conHour {
		width: 702rpx;
		background-color: #f8f8f8;
		margin-top: 24rpx;
		padding: 20rpx;
		box-sizing: border-box;
		white-space: nowrap;
	}

	.scrollview {
		display: inline-flex;
		white-space: nowrap;
	}

	.cellHour {
		width: 80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 50rpx 0 10rpx;
	}

	.centerCon {
		width: 36rpx;
		height: 36rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icWeatherSmall {
		width: 36rpx;
		height: 36rpx;
		margin: 14rpx 0;
	}

	.weekCon {
		width: 702rpx;
		background-color: #f8f8f8;
		padding: 20rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
	}

	.weekCell {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.life {
		width: 702rpx;
		background-color: #f8f8f8;
		margin-top: 20rpx;
		padding: 20rpx 40rpx;
		box-sizing: border-box;
		flex-wrap: wrap;
		display: flex;
		flex-direction: row;
	}

	.lifeCell {
		width: 310rpx;
		height: 110rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.liftImg {
		width: 60rpx;
		height: 60rpx;
		margin-right: 20rpx;
	}

	.tex24_33_b {
		font-size: 24rpx;
		color: #333;
		font-weight: bold;
	}

	.tex24_33 {
		font-size: 24rpx;
		color: #333;
	}

	.tex28_33_b {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}

	.tex32_33_b {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}

	.tex32_33 {
		font-size: 32rpx;
		color: #333;
	}

	.tex24_66 {
		font-size: 24rpx;
		color: #666;
	}

	.plus {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
		position: absolute;
		top: 11px;
		left: 13px;
	}

	.btn_cz {
		margin-left: 10px;
		background: linear-gradient(to bottom, #5AD6D6, #069FA4);
		padding: 10rpx 38rpx;
		border-radius: 35rpx;
		color: #fff;
		font-size: 24rpx;
	}
</style>