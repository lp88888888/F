<template>
	<view class="station-box" :data-theme="pageTheme">
		<!-- <cos-header title='加油详情' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="80"></cos-header> -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="加油站详情" bgColor="transparent" @leftClick="toBack" placeholder
					:fixed="fixed"></up-navbar>
			</view>
		</u-sticky>

		<view class="map">
			<view class="station-header">
				<view class="station-img">
					<image v-if="merchantInfo.logo" :src="merchantInfo.logo" class="img"></image>
					<image v-else :src="imgUrl + 'yq-zgsy.png'" class="img"></image>
				</view>

				<view class="station-info">
					<text class="station-name  ">{{merchantInfo?.stationName}}</text>
					<view style="display: flex;align-items: center;margin: 16rpx 0;">

						<view class="yinyesta-1" v-if="merchantInfo.openStatus=='00'">
							歇业
						</view>
						<view class="yinyesta" v-else>
							营业中
						</view>
						<text style="font-size: 24rpx;color: #666666;">距您{{merchantInfo?.straightLineDistance}}</text>
					</view>
					<view class="station-tags">
						<text class="tag">加油</text>
						<text class="tag">加气</text>
						<text class="tag">洗车</text>
						<text class="tag">便利店</text>
					</view>
				</view>
			</view>
			<view class="merchant-info">
				<view class="merchant-desc">
					<view class="merchant-location">
						<up-icon name="map" color="#000000" size="14"></up-icon>{{merchantInfo?.address}}
					</view>
					<view class="merchant-location">
						<up-icon name="clock" color="#000000"
							size="14"></up-icon>营业时间{{merchantInfo?.openStartTime||'8:00'}}-{{merchantInfo?.openEndTime||"24:00"}}
					</view>
				</view>
				<view class="merchant-icons">
					<view @tap="goMap1">
						<image :src="imgUrl + 'cd-daohang.png'" class="icon"></image>
						<view>导航</view>
					</view>
					<view @click="callPhone" style="margin-left: 30rpx;" v-if="merchantInfo.stationPhone!=null">
						<image :src="imgUrl + 'cd-phone.png'" class="icon"></image>
						<view>电话</view>
					</view>

				</view>
			</view>
		</view>
		<view class="coupon-banner">
			<!-- <image :src="imgUrl + 'yq-banner.png'" class="img"></image> -->
			<view
				style="background-color: #fff;padding: 30rpx;border-radius: 16rpx;width: 690rpx;box-sizing: border-box;">
				<view style="margin-bottom: 30rpx;font-size:28rpx;font-weight: 600;">
					油价
				</view>
				<view>
					<view style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 25rpx;"
						v-for="(item,index) in merchantInfo.odsGasStationOilPriceVoList" :key="index">
						<text class="cou-text">{{item.oilName}}</text>
						<text class="cou-text"> {{item.price}}元/L</text>
						<text class="cou-text">国标:{{item.stationPrice}}元/L</text>
					</view>

				</view>
			</view>
		</view>
		<view class="usage-process">
			<view class="usage-wenzi">
				<text class="process-title">使用须知</text>
				<!-- <text class="process-tip">先加油、再付款</text> -->
			</view>
			<view class="process-steps">
				<view class="step">
					<image :src="imgUrl + 'yq-jy.png'" class="step-icon"></image>
					<text class="step-text">到站加油</text>
				</view>
				<image :src="imgUrl + 'yq--jt.png'" class="step-jt-icon"></image>
				<view class="step">
					<image :src="imgUrl + 'yq-gun.png'" class="step-icon"></image>
					<text class="step-text">选择油枪</text>
				</view>
				<image :src="imgUrl + 'yq--jt.png'" class="step-jt-icon"></image>
				<view class="step">
					<image :src="imgUrl + 'yq-zf.png'" class="step-icon"></image>
					<text class="step-text">输入金额</text>
				</view>
				<image :src="imgUrl + 'yq--jt.png'" class="step-jt-icon"></image>
				<view class="step">
					<image :src="imgUrl + 'yq-cg.png'" class="step-icon" style="width: 42px"></image>
					<text class="step-text">完成支付</text>
				</view>
			</view>
		</view>
		<view class="discount-refuel">
			<view class="price-info">
				<text class="discount-title">优惠加油</text>
				<!-- <view>
					<text class="price">¥7.04/L</text>
					<text class="original-price">油价 ¥7.45/L</text>
				</view> -->
			</view>
			<view class="oil-gun-select">
				<view @click="oilGradeFun">
					<up-input v-model="oilGradevalue" placeholder="请选择油号码" suffixIcon="arrow-down-fill"
						suffixIconStyle="font-size: 12px;color: #000" disabled></up-input>
				</view>
				<view @click="gunshowFun">
					<up-input v-model="gunvalue" placeholder="请选择油枪" suffixIcon="arrow-down-fill" disabled
						suffixIconStyle="font-size: 12px;color: #000" @confirm=''></up-input>
				</view>
			</view>
			<view class="u-demo-block__content">
				<view class="u-demo-block">
					<view class="u-demo-block__content">
						<!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
						<!-- #ifndef APP-NVUE -->
						<up-input v-model="picjz" @blur="getpic" placeholder="请输入金额，实时计算优惠" type="digit">
						<!-- #endif -->
							<!-- #ifdef APP-NVUE -->
							<up-input v-model="picjz" @blur="getpic" placeholder="请输入金额，实时计算优惠" type="digit">
							<!-- #endif -->
								<template #prefix>
									<text>￥</text>
								</template>
							<!-- #ifndef APP-NVUE -->
							</up-input>
							<!-- #endif -->
						<!-- #ifdef APP-NVUE -->
						</up-input>
						<!-- #endif -->
					</view>
				</view>
			</view>
			<view class="amount-options">
				<text @click="dianjijiage(200) " class="option">¥200</text>
				<text @click="dianjijiage(300)" class="option">¥300</text>
				<text @click="dianjijiage(400)" class="option">¥400</text>
			</view>
		</view>
		<view class="coupon-pay" @click="tocoupon">
			<view class="coupon">
				<view class="coupon-text">
					<image :src="imgUrl + 'yq-q.png'" class="icon"></image>
					优惠券
				</view>
				<view class="exchange">{{couponname}}<up-icon name="arrow-right" color="#666" size="12"></up-icon>
				</view>
			</view>
		</view>
		<view :style="{width:'750rpx',height:(payBoxHeight+10)+'px'}"></view>
		<view class="pay-box" id="payBox">
			<view class="pay-sa">
				<view class="pay-info">
					<text class="pay-amount"><text style="font-size: 22rpx;">¥</text>{{yhjg}}</text>
					<view class="save-amount"><text
							style="font-weight: 400;font-size: 24rpx;color: #666666;display: inline-block;margin-right: 20rpx;">合计:</text>
						<text style="color: #000;">预计加油</text> {{yhjy}}L
					</view>
				</view>
				<view class="pay-btn" @click="postdingdan">立即支付</view>
			</view>
		</view>
	</view>
	<up-picker :show="isshow" :columns="columnsNumber" keyName="oilName" valueName="oilId" @confirm='oilGradePicker'
		@cancel='isshow=false'></up-picker>
	<up-picker :show="gunshow" :columns="columnsGun" @confirm='gunPicker' @cancel='gunshow=false'></up-picker>
</template>
<script setup lang="ts">
	import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
	import { odsGasStationdel, postpayGasStationOrder, odsGasStationpic } from '@/api/index';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '../../config';
	import { onLoad, onReady } from '@dcloudio/uni-app';
	import { useElementRects } from '@/utils/useElementRect';
	import { openAPPLocation, openLocation, makePhoneCall,AppLaunchMiniProgram } from '@/utils/util';
	// #ifdef APP-HARMONY
		import { registerApp, launchMiniProgram } from '@/uni_modules/weixin-open';
	// #endif
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	const { queryAll } = useElementRects(['#payBox']);
	const payBoxHeight = ref(60);
	const backgroundColor = ref<string>('#D1E5F9');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const isshow = ref<boolean>(false);
	const gunshow = ref<boolean>(false);
	const oilGradevalue = ref<string>('');
	const oilId = ref<string>('');
	const oilGun = ref<string>('');
	const gunvalue = ref<string>('');
	const columnsNumber = ref([
	]);
	const columnsGun = ref([
	]);
	const pageType = ref('');
	const merId = ref('');
	const merchantInfo = ref<any>({})  // 详情
	const picjz = ref<any>(0)  // 详情
	const yhjg = ref<any>(0)  // 预计费用
	const yhjy = ref<any>(0)  // 预计加油
	const selectedCoupon = ref(null);
	watch(picjz, (newValue, oldValue) => {
		getpic()
	})
	onMounted(() => {
		uni.$on('selectCoupon', handleSelectCoupon);
	});
	const couponId = ref('')
	const couponname = ref('兑换优惠券')
	const handleSelectCoupon = (data) => {
		console.log(data, 'data')
		if (data == null) {
			couponId.value = ''
			couponname.value = '兑换优惠券'
			getpic()
			return
		}
		selectedCoupon.value = data;
		couponId.value = data.id
		couponname.value = data.name
		getpic()
		console.log(selectedCoupon.value, 'selectedCoupon.value')
	};
	onUnmounted(() => {
		uni.$off('selectCoupon', handleSelectCoupon);
	});

	const tocoupon = () => {

		uni.navigateTo({
			url: '/pages_D/refuelingRefilling/coupon?id=' + couponId.value
		})
	}
	const oilGradeFun = () => {
		isshow.value = true
	}
	const dianjijiage = (e : any) => {
		picjz.value = e
		getpic()
	}
	const gunshowFun = () => {
		gunshow.value = true
	}
	//油号
	const oilGradePicker = (e : any) => {
		console.log(e.value[0])
		oilGradevalue.value = e.value[0].oilName
		columnsGun.value[0] = e.value[0].oilGunNo
		oilId.value = e.value[0].oilId
		getpic()
		isshow.value = false
	}

	const getpic = async () => {
		if (oilId.value == '') {
			return
		}
		if (picjz.value == 0) {
			return
		}
		try {
			let params = {
				stationId: merchantInfo.value?.stationId,
				oilId: oilId.value,
				amounts: picjz.value,
				couponId: couponId.value
			}
			const res = await odsGasStationpic(params)
			if (res.code == 200) {
				yhjy.value = res.data.totalLitre
				yhjg.value = res.data.payableAmount

			}
		} catch (err) {
		}
	}
	//油枪
	const gunPicker = (e : any) => {
		gunvalue.value = e.value[0]
		gunshow.value = false
	}
	const gopay = () => {
		uni.navigateTo({
			url: '/pages_D/refuelingRefilling/Payment'
		})
	}
	const postdingdan = async () => {
		if (oilId.value == '') {
			uni.showToast({
				title: '请选择油号',
				icon: 'none'
			})
			return
		}
		if (picjz.value == 0) {
			uni.showToast({
				title: '请输入金额',
				icon: 'none'
			})
			return
		}
		try {
			let params = {
				stationId: merchantInfo.value?.stationId,
				oilId: oilId.value,
				oilGun: Number(gunvalue.value),
				orderAmount: picjz.value,
				couponId: couponId.value,
				payType: 2
			}
			const res = await postpayGasStationOrder(params)
			if (res.code == 200) {
				console.log(res);
				// #ifdef MP-WEIXIN
				wx.navigateToMiniProgram({
					appId: res.data.payParamVo.appId,
					path: res.data.payParamVo.pageUrl,
					extraData: {

					},
					envVersion: 'release',
					success(res) {
						console.log('跳转成功', res);
					},
					fail(err) {
						console.error('跳转失败', err);
					}
				});
				// #endif
				// #ifdef APP-HARMONY
					launchMiniProgram('wx90c850f92690cb19',res.data.payParamVo.ghAppId || 'gh_478220ef5145',res.data.payParamVo.pageUrl)
				// #endif
				// #ifdef APP-PLUS
				AppLaunchMiniProgram(res.data.payParamVo.ghAppId || 'gh_478220ef5145',res.data.payParamVo.pageUrl)
				// #endif

			}
		} catch (err) {
		}
	}
	//地图
	const goMap1 = () => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": Number(merchantInfo.value.longitude),
					"latitude": Number(merchantInfo.value.latitude),
					"address": merchantInfo.value.stationName
				}
			}
			openAPPLocation(navigationInfo)
		} else {
			openLocation({
				latitude: Number(merchantInfo.value?.latitude),//维度
				longitude: Number(merchantInfo.value?.longitude),//经度
				scale: 18,//缩放比例，范围5~18，默认为18
				name: merchantInfo.value?.stationName,
			})
		}
	}
	// 拨打电话
	const callPhone = () => {
		makePhoneCall(merchantInfo.value?.stationPhone)
	}
	const handleQuery = async () => {
		try {
			const result : any = await queryAll()
			console.log("---------->>>", result);
			for (let i in result) {
				if (result[i].id == 'payBox') {
					payBoxHeight.value = result[i].height
				}
			}
		} catch (err) {
			console.log('卡片尺寸shib:', err)
		}
	}
	const getDetail = async () => {
		let params = {
			merId: merId.value,
			lat: uni.getStorageSync('address').lat,
			lng: uni.getStorageSync('address').lng
		}
		try {
			const result = await odsGasStationdel(params)
			merchantInfo.value = result.data
			columnsNumber.value[0] = merchantInfo.value.odsGasStationOilPriceVoList


		} catch (err) {
		}
	}
	onReady(() => {
		// 从cos-header组件获取实际高度或计算
		nextTick(() => {
			setTimeout(() => {
				handleQuery()
			}, 100)
		})

	})
	onLoad((options) => {
		merId.value = options.merId
		getDetail()
		// #ifdef APP-HARMONY
			registerApp('wx90c850f92690cb19')
		// #endif
		// if (uni.getStorageSync('k1yMerInfo')) {
		// 	merchantInfo.value = uni.getStorageSync('k1yMerInfo');
		// }
	})
</script>
<style scoped lang="scss">
	.searchView {
		background: var(--head-color);
	}

	.step-jt-icon {
		width: 32rpx;
		height: 32rpx;
		margin-bottom: 30rpx;
	}

	.cou-text {
		display: inline-block;
		width: 30%;
		text-align: left;
	}

	.yinyesta {
		width: 70rpx;
		height: 32rpx;
		background: #EAFFFF;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #47DFDA;
		color: #47DFDA;
		text-align: center;
		line-height: 32rpx;
		font-size: 22rpx;
		margin-right: 10rpx;
	}

	.yinyesta-1 {
		width: 70rpx;
		height: 32rpx;
		background: #e68e8a;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #ff1107;
		color: #fff;
		text-align: center;
		line-height: 32rpx;
		font-size: 22rpx;
		margin-right: 10rpx;
	}

	.station-box {
		min-height: 100vh;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: var(--head-color);
	}

	.station-header {
		display: flex;
		padding: 30rpx 20rpx;
		align-items: flex-start;
		// margin-top: 40rpx;
		// background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
	}

	.station-img {
		width: 164rpx;
		height: 164rpx;
		box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(0, 0, 0, 0.06);
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		margin-right: 20rpx;

		.img {
			width: 164rpx;
			height: 164rpx;
		}
	}

	.station-name {
		font-size: 30rpx;
		font-weight: bold;
		display: block;
		margin: 10rpx 0 20rpx;
	}

	.station-tags {
		display: flex;
		margin-bottom: 5px;
	}

	.tag {
		font-size: 12px;
		color: #4788FA;
		background-color: #EAF1FF;
		padding: 2px 6px;
		border-radius: 16rpx;
		margin-right: 5px;
	}

	.station-address {
		font-size: 14px;
		color: #999;
		display: block;
		margin-bottom: 5px;
	}

	.station-actions {
		display: flex;
	}

	.action {
		font-size: 14px;
		color: #007aff;
		margin-right: 10px;
	}

	.coupon-banner {
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30rpx;

		.img {
			width: 164rpx;
			height: 164rpx;
			box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(0, 0, 0, 0.06);
			border-radius: 12rpx 12rpx 12rpx 12rpx;
		}
	}

	.coupon-title {
		font-size: 18px;
		font-weight: bold;
		color: #fff;
	}

	.coupon-subtitle {
		font-size: 14px;
		color: #fff;
		display: block;
		margin-top: 5px;
	}

	.coupon-img {
		width: 120px;
		height: 80px;
	}

	.usage-process {
		padding: 15px 25rpx;
		background: #FFFFFF;
		margin-top: 30rpx;
		border-radius: 20rpx;
		border: 4rpx solid #FFFFFF;

		.usage-wenzi {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}

	.process-title {
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.process-tip {
		font-size: 14px;
		color: #FF9600;
		display: block;
		margin-bottom: 10px;
	}

	.process-steps {
		display: flex;
		justify-content: space-between;
		align-items: center;

	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.step-icon {
		width: 40px;
		height: 40px;
		margin-bottom: 5px;
	}

	.step-text {
		font-size: 26rpx;
		color: #000000;
	}

	.discount-refuel {
		padding: 30rpx 25rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		margin-top: 30rpx;
	}

	.price-info {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.discount-title {
		font-size: 28rpx;
		font-weight: bold;
	}

	.price {
		font-size: 24rpx;
		color: #FF9600;
		margin-right: 10rpx;
	}

	.original-price {
		font-size: 12px;
		color: #999;

	}

	.oil-gun-select {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		gap: 20rpx;
	}

	.picker {
		border: 1px solid #eee;
		border-radius: 4px;
		padding: 8px;
		width: 45%;
	}

	.amount-input {
		border: 1px solid #eee;
		border-radius: 4px;
		padding: 8px;
		margin-bottom: 10px;
	}

	.amount-options {
		display: flex;
		justify-content: space-between;
		gap: 30rpx;
	}

	.option {
		border: 1px solid #eee;
		padding: 8px;
		width: 30%;
		text-align: center;
		background: #F5F5F5;
		border-radius: 20rpx;
		font-weight: bold;
	}

	.coupon-pay {
		padding: 30rpx 25rpx;
		background-color: #fff;
		margin-top: 30rpx;
		border-radius: 20rpx;
	}

	.coupon {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.coupon-text {
		display: flex;
		gap: 10rpx;
		font-size: 26rpx;
		color: #000000;

		.icon {
			width: 30rpx;
			height: 30rpx;
			padding-top: 4rpx;
		}
	}

	.exchange {

		font-size: 26rpx;
		color: #666666;
		display: flex;
		justify-content: center;
		align-content: center;
	}

	.pay-info {
		margin-bottom: 10px;
	}

	.pay-amount {
		font-weight: 700;
		font-size: 38rpx;
		color: #FF5405;
	}

	.save-amount {
		font-size: 24rpx;
		display: flex;
		align-items: center;
		margin-top: 10rpx;
		font-size: 28rpx;
		font-weight: 700;
		color: #FFA41D;
	}

	.pay-box {
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.pay-sa {
		padding: 20rpx 30rpx 10rpx;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.pay-btn {
		width: 224rpx;
		height: 84rpx;
		background: var(--primary-color);
		border-radius: 414rpx 414rpx 414rpx 414rpx;
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
		text-align: center;
		line-height: 84rpx;
	}

	.map {
		margin-top: 30rpx;
		background-color: #fff;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
	}

	/* 商家信息样式 */
	.merchant-info {
		display: flex;
		align-items: center;
		border-top: 1px solid #F2F2F2;
		padding: 20rpx 0;
		width: 92%;
		margin: 0 auto;
	}

	.merchant-img {
		width: 60px;
		height: 60px;
		background: salmon;
		border-radius: 4px;
	}

	.merchant-desc {
		flex: 1;
		// width: calc(100% - 165rpx);
	}

	.merchant-name {
		margin-bottom: 5px;
		font-size: 24rpx;
		color: #999999;
		display: block;
		margin-left: 32rpx;
	}

	.merchant-location {
		width: 450rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: flex;
		gap: 2px;
		font-size: 26rpx;
		color: #333333;
		margin-bottom: 10rpx;

	}

	.merchant-icons {
		display: flex;
		gap: 25px;
		margin-right: 30rpx;
		font-size: 22rpx;
		color: #333333;
		text-align: center;

		.icon {
			width: 50rpx;
			height: 50rpx;
		}
	}



	.u-demo-block__content {
		margin-bottom: 20rpx;
	}

	::v-deep .u-input {
		background-color: #F5F5F5 !important;
		border: none;
	}

	::v-deep .u-status-bar {
		background: transparent !important;
	}
</style>