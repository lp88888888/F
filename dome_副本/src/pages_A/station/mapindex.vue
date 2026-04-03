<template>
	<view class="toll-container">
		<view class="topCon-s hCon" :class="{ absolute: isAbsolute }">
			<view class="searchBg-s">
				<up-icon name="search" color="#000000" size="28"></up-icon>
				<!-- <image class="icSearch-s" :src="`${imgUrl}wximage/trip-pro/activity/e_search.png`" /> -->
				<input v-model="keyWords" class="texSearchTip-s" placeholder="请输入服务区关键字" type="text"
					confirm-type="search" @input="onSearchInput" />
			</view>
			<view class="change-tab">
				<view :class="{ active: changeIndex === 1 }" @click="changeEvt(1)">
					<text>全部({{ total }})</text>
					<text></text>
				</view>
				<view :class="{ active: changeIndex === 2 }" @click="changeEvt(2)">
					<text>正常({{ openTotal }})</text>
					<text></text>
				</view>
				<view :class="{ active: changeIndex === 3 }" @click="changeEvt(3)">
					<text>关闭({{ closeTotal }})</text>
					<text></text>
				</view>
			</view>
		</view>

		<view v-if="isAbsolute">
			<view class="searchBg-s"></view>
			<view class="change-tab"></view>
		</view>

		<view class="show-list" v-if="stationList.length > 0">
			<view class="s-view" v-for="(item, index) in stationList" :key="index" @click="goStation(item.id)">
				<view class="cont">
					<view class="cont-img">
						<image class="image" :src="item.serviceAreaPicture || `${imgUrl}service-list-default.png`"
							lazy-load />
					</view>
					<view>
						<view class="texNoWrap"
							:style="{ marginBottom: (!item.detailList || item.detailList.length === 0) ? '36rpx' : '' }">
							{{ item.serviceAreaName }}
						</view>
						<view class="texNoWrap" :style="{ margin: !item.detailList ? '0' : '' }">
							{{ item.address }}
						</view>
						<view v-if="item.detailList && item.detailList.length > 0">
							<image v-for="(subItem, index2) in item.detailList" :key="index2"
								:src="subItem.serviceInfoPicUrl" />
						</view>
					</view>
					<view class="map-icon">
						<image @click.stop="openAdd(item)" :src="`${imgUrl}go-map-icon-new.png`" />
						<view>{{ item.distance || '0km' }}</view>
					</view>
					<view class="status" :class="{ gray: item.operationalStatus === '02' }">
						{{ item.operationalStatus === '02' ? '关闭' : '正常' }}
					</view>
				</view>
			</view>
		</view>

		<view v-if="noContShow" style="margin-top: 400rpx">
			<emptyview />
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { onLoad, onPageScroll, onReachBottom, onPullDownRefresh, onShareAppMessage } from '@dcloudio/uni-app'
	import { getgetServiceAreaPageList } from '@/api/map'
	import { imgUrl } from '../../config';
	import { openAPPLocation,openLocation } from '@/utils/util';
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	// 类型定义
	interface StationItem {
		id : string
		serviceAreaName : string
		address : string
		latitude : string
		longitude : string
		serviceAreaPicture ?: string
		operationalStatus : '01' | '02'
		detailList ?: Array<{
			labelFlag : string
			serviceInfoPicUrl : string
		}>
		distance ?: string
	}

	interface CenterLocation {
		latitude : string
		longitude : string
	}

	interface PageInfo {
		total : number
		pages : number
		records : StationItem[]
	}

	// 响应式数据
	const keyWords = ref('')
	const changeIndex = ref(1) // 当前状态 1-全部, 2-正常, 3-关闭
	const page = ref(1)
	const lastPage = ref(0)
	const stationList = ref<StationItem[]>([])
	const total = ref(0)
	const openTotal = ref(0)
	const closeTotal = ref(0)
	const noContShow = ref(false)
	const isAbsolute = ref(false)
	const center = ref<CenterLocation>({
		latitude: '34.22259',
		longitude: '108.94878'
	})
	// 服务区切换
	const changeEvt = (index : number) => {
		page.value = 1
		noContShow.value = false
		changeIndex.value = index
		stationList.value = [] // 清空数据
		getList()
	}

	const goStation = (id : any) => {
		uni.navigateTo({
			url: '/pages_A/stationDetails/index?id=' + id
		})
	}

	// 搜索框输入事件
	const onSearchInput = () => {
		page.value = 1
		stationList.value = []
		getList()
	}

	// 服务区信息查询
	const getList = async () => {
		let params = {
			latitude: center.value.latitude,
			longitude: center.value.longitude,
			pageNum: page.value,
			pageSize: 10,
			serviceAreaName: keyWords.value,
			operationalStatus: changeIndex.value == 1 ? '' : (changeIndex.value == 2 ? '01' : '02')
		}
		const res = await getgetServiceAreaPageList(params)
		const records = res.rows
		if (records.length > 0) {
			records.map(item => {
				if (item.detailList && item.detailList.length > 0) {
					item.detailList = item.detailList.filter(tag => tag.labelFlag == '01')
					if (item.detailList.length > 5) item.detailList.length = 5
				}
			})

			stationList.value = stationList.value.concat(records)
			page.value++
			// 更新总数
			if (changeIndex.value === 1) {
				total.value = res.total
			} else if (changeIndex.value === 2) {
				openTotal.value = res.total
			} else {
				closeTotal.value = res.total
			}
			if (res.total == 0) {
				noContShow.value = true
			}

			lastPage.value = Math.ceil(res.total / 10)
		}
	}

	const getListOpen = async () => {
		let that = this
		let params = {
			latitude: center.value.latitude,
			longitude: center.value.longitude,
			pageNum: page.value,
			pageSize: 10,
			serviceAreaName: keyWords.value,
			operationalStatus: '01'
		}
		const res = await getgetServiceAreaPageList(params)
		openTotal.value = res.total
	}

	const getListClose = async () => {
		let that = this
		let params = {
			latitude: center.value.latitude,
			longitude: center.value.longitude,
			pageNum: page.value,
			pageSize: 10,
			serviceAreaName: keyWords.value,
			operationalStatus: '02'
		}
		const res = await getgetServiceAreaPageList(params)
		closeTotal.value = res.total
	}

	onLoad((options) => {
		let center = {
			"latitude": options.latitude ? options.latitude : '34.22259',
			"longitude": options.longitude ? options.longitude : '108.94878',
		}
		center.value = center
		getList()
		getListOpen()
		getListClose()
	})

	const openAdd = (station : any) => {
		// 获取点击的服务区索引
		const latitude = parseFloat(station.latitude) // 获取服务区纬度
		const longitude = parseFloat(station.longitude) // 获取服务区经度
		const address = station.address // 获取服务区地址
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": Number(longitude),
					"latitude": Number(latitude),
					"address": address
				}
			}
			openAPPLocation(navigationInfo)
		} else{
			openLocation({
				latitude: latitude, // 纬度
				longitude: longitude, // 经度
				name: station.serviceAreaName, // 地址名称（服务区名称）
				address: address, // 地址
				scale: 18, // 缩放级别，1~20，数值越大，地图越精细
				
			})
		}



	}


	// 页面滚动事件，控制是否固定搜索栏
	onPageScroll((e) => {
		if (e.scrollTop > 0) {
			isAbsolute.value = true
		} else {
			isAbsolute.value = false
		}
	})

	onReachBottom(() => {
		if (page.value > total.value) {
			uni.showToast({ title: '没有更多了' })
			return
		}
		getList()
	})
</script>

<style scoped lang="scss">
	page {
		background-color: #F0F0F2;
	}

	.toll-container {
		width: 100%;
		position: relative;

	}

	.topCon-s {
		padding: 0 24rpx;
		width: 100%;
		box-sizing: border-box;
		background: #fff;
	}

	.hCon {
		display: flex;
		flex-direction: column;
	}

	.vCon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.msgTex {
		font-size: 28rpx;
		color: #333333;
	}

	.searchBg-s {
		background-color: #F0F0F0;
		border-radius: 10rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
	}

	.icSearch-s {
		width: 30rpx;
		height: 30rpx;
		margin-left: 26rpx;
		margin-right: 30rpx;
	}

	.texSearchTip-s {
		font-size: 28rpx;
		color: #333;
		min-width: 80%;
		height: 80rpx;
	}

	.change-tab {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: flex-end;
		height: 100rpx;
		padding-bottom: 15rpx;
		box-sizing: border-box;
	}

	.change-tab .active>text:nth-child(2) {
		background-color: $color;
	}

	.change-tab .active>text:nth-child(1) {
		color: $color;
	}

	.change-tab>view {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 100rpx;
	}

	.change-tab>view>text:nth-child(1) {
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 10rpx;
	}


	.change-tab>view>text:nth-child(2) {
		display: inline-block;
		width: 60rpx;
		height: 6rpx;
		background: transparent;
		border-radius: 6rpx;
	}

	.imgArr {
		width: 40rpx;
		height: 16rpx;
		padding: 20rpx;
		position: absolute;
		top: 20rpx;
		right: 0;
	}

	.emptyView {
		font-size: 26rpx;
		color: #333333;
		text-align: center;
		padding-top: 200rpx;
	}


	.show-list {
		width: 100%;
		padding: 0 22rpx 22rpx;
		box-sizing: border-box;
		background-color: #fff;
		margin-top: 14rpx;
	}

	.show-list .s-view:last-child {
		margin-bottom: 0 !important;
		border: none !important;
	}

	.show-list .s-view {
		width: 100%;
		height: 130rpx;
		border-bottom: solid 1rpx #e1e1e1;
		padding: 20rpx 0;
	}

	.show-list .s-view .cont {
		width: 100%;
		height: 130rpx;
		display: flex;
		box-sizing: border-box;
		position: relative;
	}

	.cont-img {
		width: 186rpx;

		height: 130rpx;
		border-radius: 10rpx;
		margin-right: 25rpx;
	}

	.show-list .s-view .cont .status {
		padding: 0 10rpx;
		height: 30rpx;
		background-color: $color;
		border-radius: 0px 0px 10rpx 0px;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 10rpx 0 10rpx 0;
		font-size: 24rpx;
		color: #ffffff;
		text-align: center;
		line-height: 30rpx;
	}

	.show-list .s-view .cont .gray {
		background-color: #959595 !important;
	}

	.show-list .s-view .cont .map-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.show-list .s-view .cont .map-icon image {
		width: 45rpx;
		height: 45rpx;
		margin-bottom: 12rpx;
	}

	.show-list .s-view .cont .map-icon view {
		font-size: 24rpx;
		letter-spacing: 0px;
		color: #333333;
	}

	.show-list .s-view .cont .image {
		width: 186rpx;
		height: 130rpx;
		border-radius: 10rpx;
		margin-right: 25rpx;
	}

	.show-list .s-view .cont>view:nth-child(2) {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.show-list .s-view .cont>view:nth-child(2)>view:nth-child(1) {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin: 0 0 10rpx;
	}

	.show-list .s-view .cont>view:nth-child(2)>view:nth-child(2) {
		font-size: 24rpx;
		color: #666666;
		line-height: 24rpx;
		height: 24rpx;
		margin: 0 0 15rpx;
		max-width: 300rpx;
	}


	.show-list .s-view .cont>view:nth-child(2)>view:nth-child(3) {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.show-list .s-view .cont>view:nth-child(2)>view:nth-child(3) image {
		width: 26rpx;
		height: 26rpx;
		margin-right: 20rpx;
	}


	.absolute {
		position: fixed;
		top: 0;
		left: 0;
		box-shadow: 0 12rpx 16rpx 0 rgba(0, 0, 0, 0.1);
		z-index: 1;
	}
</style>