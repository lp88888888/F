<template>
	<view class="toll-container">
		<view class="topCon-s hCon" :class="{ absolute: isAbsolute }">
			<view class="searchBg-s">
				<up-icon name="search" color="#000000" size="28"></up-icon>
				<input v-model="keyWords" class="texSearchTip-s" placeholder="请输入收费站关键字" type="text"
					confirm-type="search" @input="onSearchInput" />
			</view>
			<scroll-view scroll-x class="change-tab">
				<view class="tab-item" :class="{ active: changeIndex === 1 }" @click="changeEvt(1)">
					<text>全部({{ total }})</text>
					<text></text>
				</view>
				<view class="tab-item" :class="{ active: changeIndex === 2 }" @click="changeEvt(2)">
					<text>正常({{ openTotal }})</text>
					<text></text>
				</view>
				<view class="tab-item" :class="{ active: changeIndex === 3 }" @click="changeEvt(3)">
					<text>关闭({{ closeTotal }})</text>
					<text></text>
				</view>
				<view class="tab-item" :class="{ active: changeIndex === 6 }" @click="changeEvt(6)">
					<text>管制({{ controlTotal }})</text>
					<text></text>
				</view>
				<view class="tab-item" :class="{ active: changeIndex === 4 }" @click="changeEvt(4)">
					<text>入口关闭({{ innerCloseTotal }})</text>
					<text></text>
				</view>
				<view class="tab-item" :class="{ active: changeIndex === 5 }" @click="changeEvt(5)">
					<text>出口关闭({{ outerCloseTotal }})</text>
					<text></text>
				</view>
			</scroll-view>
		</view>

		<view v-if="isAbsolute">
			<view class="searchBg-s"></view>
			<view class="change-tab"></view>
		</view>

		<view class="show-list" v-if="stationList.length > 0">
			<view class="s-view" v-for="(item, index) in stationList" :key="index"
				@click.stop="item.operationalStatus === '05' ? showPopFn(index) : ''">
				<view class="cont">
					<image class="image" :src="item.tollStationImg || `${imgUrl}service-list-default.png`" lazy-load />
					<view>
						<view class="texNoWrap"
							:style="{ marginBottom: (!item.detailList || item.detailList.length === 0) ? '36rpx' : '' }">
							{{ item.tollStationName }}
						</view>
						<view class="texNoWrap" :style="{ margin: !item.detailList ? '0' : '' }">
							{{ item.tollStationAddress }}
						</view>
						<view v-if="item.detailList && item.detailList.length > 0">
							<image v-for="(subItem, index2) in item.detailList" :key="index2"
								:src="subItem.serviceInfoPicUrl" />
						</view>
					</view>
					<view class="map-icon">
						<image @click.stop="openAdd(item)" :src="`${imgUrl}go-map-icon-new.png`" />
						<view>{{ item.distance || '0km' }}</view>
						<view class="btnDetail" v-if="item.operationalStatus === '05'">管制详情></view>
					</view>
					<view class="status green" v-if="item.operationalStatus === '01'">正常</view>
					<view class="status gray" v-if="item.operationalStatus === '02'">关闭</view>
					<view class="status" v-if="item.operationalStatus === '05'">管制</view>
					<view class="status halfClose" v-if="item.operationalStatus === '03'">入口关闭，出口正常</view>
					<view class="status halfClose" v-if="item.operationalStatus === '04'">入口正常，出口关闭</view>
				</view>
			</view>
		</view>

		<view v-if="noContShow" style="margin-top: 400rpx">
			<emptyview />
		</view>
	</view>
	<view class="mask" v-if="showPop" @click="closePop" @touchmove.prevent="closePop">
		<view class="pop" @click.stop>
			<view class="rowCon">
				<img class="popImg"
					:src="clickItem.tollStationImg || `${imgUrl}/wximage/trip-pro/toll-list-default.png`" />
				<view class="colCon flex flex-col" style="flex: 1;">
					<view class="texNoWrap">
						<span class="fs-32 col3 fw-b">{{ clickItem.tollStationName }}</span>
						<span class="tex24_red">{{ clickItem.operationalStatus === '05' ? '(管制)' : '' }}</span>
					</view>
					<view class="texNoWrap fs-24 col6" style="margin-top: 20rpx;">{{ clickItem.tollStationAddress }}
					</view>
				</view>
				<view class="map-icon" @click.stop="openAdd(clickItem)">
					<img :src="`${imgUrl}go-map-icon-new.png`" />
					<view>{{ clickItem.distance || '0km' }}</view>
				</view>
			</view>
			<view class="popDes">{{ clickItem.eventDesc || '暂无描述' }}</view>
			<view class="correct-btn"
				@click="goCorrect(clickItem.id, clickItem.tollStationName, clickItem.operationalStatus)">
				<view>路况纠错</view>
				<view>
					<img :src="`${imgUrl}intel-map-correct.png`" />
					<span class="btn-num">+{{ clickItem.correctionIntegral }}</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { imgUrl } from '../../config';
	import { onLoad, onPageScroll, onReachBottom, onPullDownRefresh, onShareAppMessage, onShow } from '@dcloudio/uni-app'
	import {
		checkDistanceRequirement,
		getgetTollStationByIdList
	} from '@/api/map'
	import { useAppStore } from '@/store/modules/app';
	const appStore = useAppStore();
	// const isLogin = ref(appStore.checkLogin());
	const isLogin = computed(()=>{
		return appStore.checkLogin()
	})
	import { CurrentPage, showAlert2, openAPPLocation ,openLocation} from '@/utils/util'
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
	const changeIndex = ref(1)
	const page = ref(1)
	const lastPage = ref(0)
	const stationList = ref<StationItem[]>([])
	const noContShow = ref(false)
	const isAbsolute = ref(false)
	const showPop = ref(false)
	const clickItem = ref<TollStation>({} as TollStation)

	// 统计数量
	const total = ref(0)
	const openTotal = ref(0)
	const closeTotal = ref(0)
	const controlTotal = ref(0)
	const innerCloseTotal = ref(0)
	const outerCloseTotal = ref(0)

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
		getListCount()
		getList()
	}

	// 搜索框输入事件
	const onSearchInput = () => {
		page.value = 1
		stationList.value = []
		getListCount()
		getList()
	}

	// 服务区信息查询
	const getList = async () => {
		let operationalStatus = ''

		switch (changeIndex.value) {
			case 2:
				operationalStatus = '01'
				break
			case 3:
				operationalStatus = '02'
				break
			case 4:
				operationalStatus = '03'
				break
			case 5:
				operationalStatus = '04'
				break
			case 6:
				operationalStatus = '05'
				break
		}

		const params = {
			latitude: center.value.latitude,
			longitude: center.value.longitude,
			pageNum: page.value,
			pageSize: 10,
			tollStationName: keyWords.value,
			operationalStatus
		}

		uni.showLoading()

		try {
			const res = await getgetTollStationByIdList(params)
			const records = res.rows

			if (records.length > 0) {
				records.forEach(item => {
					if (item.detailList && item.detailList.length > 0) {
						item.detailList = item.detailList.filter(tag => tag.labelFlag === '01')
						if (item.detailList.length > 5) {
							item.detailList.length = 5
						}
					}
				})
			}

			stationList.value = stationList.value.concat(records)
			page.value += 1
			lastPage.value = Math.ceil(res.total / 10)

			// 更新对应的统计数量
			switch (changeIndex.value) {
				case 1:
					total.value = res.total
					break
				case 2:
					openTotal.value = res.total
					break
				case 3:
					closeTotal.value = res.total
					break
				case 4:
					innerCloseTotal.value = res.total
					break
				case 5:
					outerCloseTotal.value = res.total
					break
				case 6:
					controlTotal.value = res.total
					break
			}

			if (res.total === 0) {
				noContShow.value = true
			}

		} catch (error : any) {
		} finally {
			uni.hideLoading()
		}
	}
	// 获取统计数量
	const getListCount = async () => {
		const params : TollListParams = {
			latitude: center.value.latitude,
			longitude: center.value.longitude,
			pageNum: 1,
			pageSize: 999,
			operationalStatus: '',
			tollStationName: keyWords.value,
		}
		try {
			const res = await getgetTollStationByIdList(params)
			const list = res.rows ? res.rows : []
			total.value = res.total
			openTotal.value = list.filter(item => item.operationalStatus === '01').length
			closeTotal.value = list.filter(item => item.operationalStatus === '02').length
			controlTotal.value = list.filter(item => item.operationalStatus === '05').length
			innerCloseTotal.value = list.filter(item => item.operationalStatus === '03').length
			outerCloseTotal.value = list.filter(item => item.operationalStatus === '04').length
		} catch (error : any) {
		}
	}
	onLoad((options) => {
		let center = {
			// "latitude": options.latitude ? options.latitude : '34.22259',
			// "longitude": options.longitude ? options.longitude : '108.94878',
			"latitude": options.latitude ? options.latitude : '34.214874',
			"longitude": options.longitude ? options.longitude : '108.876772',
		}
		center.value = center
		getList()
		getListCount()
	})

	const goStation = (id : any) => {
		uni.navigateTo({
			url: '/pages_A/stationDetails/index?id=' + id
		})
	}
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
		} else {
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
			uni.showToast({
				title: '没有更多了',
				icon: 'none'
			})
			return
		}
		getList()
	})

	// 显示弹窗
	const showPopFn = (index : number) => {
		clickItem.value = stationList.value[index]
		showPop.value = true
	}

	// 关闭弹窗
	const closePop = () => {
		clickItem.value = {} as TollStation
		showPop.value = false
	}

	// 路况纠错
	const goCorrect = async (id : string, name : string, status : string) => {
		if (!isLogin.value) {
			showAlert2('提示', '本次操作需要您进行登录验证', false, '取消', '确定', (success) => {
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages_A/login/login?fromPage=' + CurrentPage(),
				});
				// #endif
				// #ifdef APP
				uni.navigateTo({ url: '/pages_A/login_password/login' });
				// #endif
			}, null)
			return
		}

		const params = {
			latitude: center.value.latitude,
			longitude: center.value.longitude,
			tollStationId: id
		}

		try {
			const res = await checkDistanceRequirement(params)
			showPop.value = false
			if (!res.clazz) {
				uni.showToast({
					title: '您当前定位已超出纠错申请范围',
					icon: 'none'
				})
				return
			}
			uni.navigateTo({
				url: `/pages_A/correct/index?id=${id}&name=${name}&status=${status}`,
			})
		} catch (error : any) {
			uni.showToast({
				title: error.message || '操作失败',
				icon: 'none'
			})
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #F0F0F2;
	}

	.toll-container {
		width: 100%;
		position: relative;
		background-color: #F0F0F2;
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
		align-items: center;
		height: 100rpx;
		/* line-height: 100rpx; */
		box-sizing: border-box;
		white-space: nowrap;
		overflow-x: auto;
	}

	.tab-item {
		display: inline-block;
		text-align: center;
		font-size: 28rpx;
		color: #333;
		cursor: pointer;
		margin-right: 50rpx;
		position: relative;
		margin-top: 35rpx;
	}

	.tab-item.active {
		color: $color;
		font-weight: bold;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 6rpx;
		background-color: $color;
		border-radius: 6rpx;
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

	.show-list .s-view .cont .status {
		padding: 0 10rpx;
		height: 30rpx;
		background-color: #128000;
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

	.map-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.map-icon image {
		width: 45rpx;
		height: 45rpx;
		margin-bottom: 12rpx;
	}

	.map-icon view {
		font-size: 24rpx;
		letter-spacing: 0px;
		color: #333333;
	}


	.absolute {
		position: fixed;
		top: 0;
		left: 0;
		box-shadow: 0 12rpx 16rpx 0 rgba(0, 0, 0, 0.1);
		z-index: 1;
	}

	.btnDetail {
		font-size: 24rpx;
		color: #70C1E4 !important;
		margin-top: 10rpx;
		display:flex;
		align-items: center;
		justify-content: center;
	}

	.mask {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.pop {
		width: 702rpx;
		transition: all 0.5s;
		z-index: 99;
		background: #fff;
		border-radius: 10rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 20rpx;
	}

	.popImg {
		width: 186rpx;
		height: 130rpx;
		border-radius: 10rpx;
		margin-right: 25rpx;
	}

	.popDes {
		width: 664rpx;
		background-color: #f0f0f0;
		font-size: 24rpx;
		color: #666;
		margin: 20rpx 0;
		padding: 12rpx;
		box-sizing: border-box;
	}

	.correct-btn {
		width: 260rpx;
		height: 70rpx;
		background-color: $color;
		border-radius: 35rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		margin: auto;
	}

	.correct-btn>view:nth-child(1) {
		font-size: 28rpx;
		color: #ffffff;
		font-weight: bold;
		margin-right: 20rpx;
	}

	.correct-btn>view:nth-child(2) {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 93rpx;
		height: 46rpx;
		background-color: #ffffff;
		border-radius: 23rpx;
	}

	.correct-btn>view:nth-child(2) image {
		width: 26rpx;
		height: 24rpx;
	}

	.correct-btn>view:nth-child(2) text {
		font-size: 28rpx;
		color: $color;
		margin-left: 2rpx;
	}

	.colCon {
		justify-content: center;
	}

	.rowCon {
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
	}

	.tex24_red {
		font-size: 24rpx;
		color: red;
	}

	.btn-num {
		font-size: 28rpx;
		color: $color;
		margin-left: 2rpx;
	}
</style>