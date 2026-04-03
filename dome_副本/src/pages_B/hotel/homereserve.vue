<template>
	<view class="page" :data-theme="pageTheme" :style="{ paddingTop: `${statusBarHeight + titleBarHeight+15}px` }">
		<!-- 自定义导航栏 -->
		<view class="back" :style="{ top: statusBarHeight + 'px', height: titleBarHeight + 'px' }" @click="goBack">
			<u-icon name="arrow-left" size="16" color="#333"></u-icon>
			<text class="back-tit">房间预定</text>
		</view>

		<!-- 预订信息卡片 -->
		<view class="booking-card">
			<view class="date-range" @click="showCalendar = true">
				{{ formatDate(startDate) }} {{ getDayText(startDate) }} → {{ formatDate(endDate) }}
				{{ getDayText(endDate) }} | {{ nights }}晚
			</view>

			<u-calendar :show="showCalendar" mode="range" :defaultDate="defaultDate" @confirm="confirmDate"
				@close="showCalendar = false" :minDate="minDate" :maxDate="maxDate" :monthNum="monthNum"></u-calendar>
			<view class="room-info">
				<view class="room-type">{{roominfo.roomTypeName}}</view>
				<view class="details">{{roominfo.bedType}} | {{roominfo.area}}㎡ | 2人入住 | {{roominfo.hasWindowsDesc}} |
					{{roominfo.breakfast}}
				</view>
			</view>
			<view class="cancel-policy">
				<u-icon name="info-circle" size="16" :color="themeStore.themeColors.$primaryColor" />
				<text>请您按时到店办理入住，以免影响行程</text>
			</view>
		</view>

		<!-- 订房信息卡片 -->
		<view class="booking-details-card">
			<view class="section-title">订房信息</view>
			<view class="info-item">
				<text class="label">房间数</text>
				<view class="room-counter">
					<u-icon name="minus" size="16" color="#999" @click="decreaseRoom"
						:class="{ disabled: roomCount <= 1 }" />
					<text class="value">{{ roomCount }}间</text>
					<u-icon name="plus" size="16" color="#999" @click="increaseRoom" />
				</view>
			</view>
			<view class="info-item">
				<view style="display: flex;align-items: center;">
					<text class="label">入住人</text>
					<input class="value" style="text-align: left;" type="text" v-model="userName" placeholder="请输入姓名" />
				</view>

			</view>
			<view class="info-item">
				<view style="display: flex;align-items: center;">
					<text class="label">联系电话</text>
					<input class="value" style="text-align: left;" type="number" maxlength="11" v-model="userPhone"
						placeholder="请输入联系电话" />
				</view>

			</view>
			<view class="info-item" @click="showTimePicker = true">
				<view style="display: flex;align-items: center;">
					<text class="label">预计到店</text>
					<text class="value">{{ selectedTime }} 房间整晚保留</text>
				</view>

				<u-icon name="arrow-right" size="16" color="#999" />
			</view>
			<up-datetime-picker :show="showTimePicker" v-model="timeValue" mode="time" :minuteStep="30" :maxHour="20"
				@confirm="confirmTime" @cancel="showTimePicker = false"></up-datetime-picker>
		</view>

		<!-- 费用明细 -->
		<view class="fee-details">
			<view class="title">费用明细</view>
			<view class="fee-item">
				<text class="label">房费</text>
				<text class="value">¥ {{(roominfo.basePrice*nights)*roomCount}}</text>
			</view>

			<view class="discount-section">
				<view class="discount-item" v-if="roominfo.basePrice-roominfo.salePrice > 0">
					<text class="label">限时优惠</text>
					<text class="value">- ¥ {{((roominfo.basePrice-roominfo.salePrice)*nights)*roomCount}}</text>
				</view>
				<!-- <view class="discount-item" @click="goToCoupon">
					<text class="label">限时优惠</text>
					<text class="exchange-link">兑换优惠券 ></text>
				</view> -->
			</view>

			<view class="total-price">¥ {{(roominfo.salePrice*nights)*roomCount}}</view>
		</view>

		<!-- 退款说明 -->
		<view class="fee-details">
			<view class="title">更改说明</view>
			<view class="title1">
				预定订单生效后，更改需提前联系商家处理。
			</view>
			<view class="title" style=" margin-top: 24rpx;" >预定说明</view>
			<view class="title1">
			预定订单需商家确认后生效，确认结果以短信或App消息通知为准；本订单为预约凭证，非消费凭证。请您在订单约定的“最晚到达时间”前到店，按商家规定支付房费并办理入住。 预订服务由爱上高速平台提供，住宿服务由供应商商家提供，业务实际运营和责任由供应商主体承担，提交订单前请阅读相关条款。
			</view>
		</view>
	<view class="agreement-box">
				<view class="agreement">
					<up-checkbox :customStyle="{ marginBottom: '4px' }" name="agree" usedAlone shape="square" size="14"
						activeColor="#628F2F" v-model:checked="aloneChecked" @change="chengaloneChecked">
					</up-checkbox>
					<text class="agreement-text">已阅读并同意</text>
					<text class="protocol-text" @click="openProtocol('hotel_tk')">《酒店/服务区客房预约条款》</text>
				</view>
			</view>
		<!-- 底部操作栏 -->
		<view class="booking-container">
			<view class="price-display">
				<text class="current-price">¥ {{(roominfo.salePrice*nights)*roomCount}}</text>
				<text class="original-price">¥ {{(roominfo.basePrice*nights)*roomCount}}</text>
			</view>
			<view
			class="bottom-btn"
				style="height: 78rpx;text-align: center;line-height: 78rpx; color: white; border-radius: 50rpx; font-weight: bold; font-size: 32rpx;width: 50%;"
				@click="confirmBooking">
				立即预订
			</view>
		</view>

	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import { ref, onMounted } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { imgUrl } from '@/config';
	import { getdetail, getordercreate } from '@/api/hotel';
	// 模拟 imgUrl（实际可从 API 或配置中获取）
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);	
	// 状态栏 & 标题栏高度
	const statusBarHeight = ref(0)
	const titleBarHeight = ref(0)
	const showTimePicker = ref(false)
	const timeValue = ref('21:00')
	const selectedTime = ref('21:00')
	const roomCount = ref(1)
	const showCalendar = ref(false)
	const startDate = ref(new Date())
	const endDate = ref(new Date(Date.now() + 24 * 60 * 60 * 1000))
const maxTime = computed(() => {
  const now = new Date()
  const max = new Date(now)
  max.setHours(21, 0, 0, 0) // 设置为 21:00:00.000
  return max
})
	const aloneChecked = ref(false);
	const chengaloneChecked = () => {
		if (aloneChecked.value) {
			aloneChecked.value = false;
		} else {
			aloneChecked.value = true;
		}
	};
	const openProtocol = (type) : void => {
		uni.navigateTo({ url: '/pages_C/xieyi/index?type=' + type });
	};
	// 日历默认选中日期
	const defaultDate = computed(() => [startDate.value, endDate.value])

	// 最小可选日期（今天）
	const minDate = computed(() => new Date().getTime())

	// 最大可选日期（90天后）
	const maxDate = computed(() => {
		const date = new Date()
		date.setDate(date.getDate() + 90)
		return date.getTime()
	})

	// 显示的月份数量
	const monthNum = 3

	// 计算晚数
	const nights = computed(() => {
		if (!startDate.value || !endDate.value) return 0
		const start = new Date(startDate.value)
		const end = new Date(endDate.value)
		const diff = end.getTime() - start.getTime()
		return Math.ceil(diff / (24 * 60 * 60 * 1000))
	})

	const formatDate = (date) => {
		if (!date) return ''
		const d = new Date(date)
		const year = d.getFullYear()
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	const getDayText = (date) => {
		if (!date) return ''
		const today = new Date()
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)

		const d = new Date(date)
		if (d.toDateString() === today.toDateString()) {
			return '今天'
		} else if (d.toDateString() === tomorrow.toDateString()) {
			return '明天'
		}
		return ''
	}

	const confirmDate = (e) => {
		if (e && e.length >= 2) {
			startDate.value = e[0]
			endDate.value = e[e.length - 1]
		}
		showCalendar.value = false
	}
	const increaseRoom = () => {
		roomCount.value++
	}

	const decreaseRoom = () => {
		if (roomCount.value > 1) {
			roomCount.value--
		}
	}
	onMounted(() => {
		const systemInfo = uni.getSystemInfoSync()
		statusBarHeight.value = systemInfo.statusBarHeight || 0
		// 默认标题栏高度 = 44px（iOS/Android 通用）
		titleBarHeight.value = 44
	})
	const confirmTime = (e) => {
		selectedTime.value = e.value
		showTimePicker.value = false
	}
	const userName = ref('')
	const userPhone = ref('')
	// 返回
	const goBack = () => {
		// 根据需求：返回首页（tabBar 页面）
		uni.navigateBack()
	}
	const roomid = ref('')
	const roominfo = ref({})
	const getroomdetail = async () => {
		const res = await getdetail(roomdelid.value);
		roominfo.value = res.data
	};
	const hotelId = ref('');
	const roomdelid = ref('');
	onLoad((options) => {
		roomdelid.value = options.roomid
		roomid.value = options.id; // 修正了这一行
		hotelId.value = options.hotelId;
		getroomdetail();
	})
	// 跳转到预计到店时间
	const goToArriveTime = () => {
		uni.navigateTo({ url: '/pages/arrive-time/arrive-time' })
	}

	// 跳转到优惠券页面
	const goToCoupon = () => {
		uni.navigateTo({ url: '/pages/coupon-exchange/coupon-exchange' })
	}

	// 确认预订
	const confirmBooking = () => {
	if (!aloneChecked.value) {
		uni.showToast({ title: '请勾选条款', icon: 'error' })
		return
	}
		if (!userName.value) {
			uni.showToast({ title: '请填写入住人', icon: 'error' })
			return
		}
		if (!userPhone.value) {
			uni.showToast({ title: '请填写联系电话', icon: 'error' })
			return
		}
		const phoneRegex = /^1[3-9]\d{9}$/
		if (!phoneRegex.test(userPhone.value)) {
			uni.showToast({ title: '请输入正确的手机号码', icon: 'error' })
			return
		}
		getordercreate({
			userId: '1',
			roomTypeId: roomid.value,
			hotelId: hotelId.value,
			checkInDate: formatDate(startDate.value),
			checkOutDate: formatDate(endDate.value),
			roomCount: roomCount.value,
			guestName: userName.value,
			guestPhone: userPhone.value,
			remark: selectedTime.value,
		}).then(res => {
			if (res.code == 200) {
				uni.showToast({
					title: '预订成功',
					icon: 'success',
					duration: 2000,
					complete: () => {
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages_B/hotel/order'
							})
						}, 2000)
					}
				})
			}
			else {
				uni.showToast({ title: res.msg, icon: 'error' })
			}
		}).catch(err => {
			console.error(err, 'err')
			// 处理预订失败逻辑
		})
	}
</script>

<style scoped lang="scss">
	.title{
		font-weight: bold;
		
	}
	.agreement-box{
		padding-left: 32rpx;
	}
	.room-counter {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.value {
		min-width: 40px;
		text-align: center;
	}

	.disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	.date-range {
		padding: 10px;
		background: #fff;
		border-radius: 8px;
	}

	.page {
		background: var(--head-color);
		padding-bottom: 160rpx;

	}

	.back {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		padding-left: 32rpx;
		box-sizing: border-box;
		transition: top 0.3s ease-in-out;
	}

	.back-tit {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
	}

	.booking-card,
	.booking-details-card,
	.fee-details {
		background-color: #fff;
		border-radius: 10rpx;
		margin: 20rpx 32rpx 0;
		padding: 40rpx 28rpx;
	}

	.booking-details-card {
		padding: 40rpx;
	}

	.date-range {
		font-size: 32rpx;
		font-weight: 700;
		color: #666;
		margin-bottom: 12rpx;
	}

	.room-type {
		font-size: 40rpx;
		color: #333;
		margin-bottom: 12rpx;
		font-weight: bold;
	}

	.details {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.cancel-policy {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: var(--primary-color);
		margin-top: 30rpx;
	}

	.section-title {
		font-size: 36rpx;
		font-weight: 700;
		color: #333;
		margin-bottom: 20rpx;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		color: #333;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.label {
		display: inline-block;
		width: 160rpx;
		font-size: 28rpx;
		color: #333;
	}

	.value {
		color: #666;
	}

	.fee-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 96rpx;
		padding: 0 16rpx;
		background-color: #f5f5f5;
		margin-bottom: 20rpx;
		line-height: 96rpx;
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

	.title1 {
		font-size: 28rpx;
		color: #333333;
		line-height: 44rpx;
	}

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
	}

	.price-display {
		display: flex;
		align-items: baseline;
	}

	.current-price {
		font-size: 48rpx;
		color:var(--primary-color);
		margin-right: 10rpx;
	}

	.original-price {
		font-size: 28rpx;
		color: #999;
		text-decoration: line-through;
	}
	
	.bottom-btn {
		background: var(--primary-color);
	}
	/* 协议区域样式 */
	.agreement {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
		margin-bottom: 30rpx;
	}
	
	/* 协议复选框样式，可根据需求自定义或使用 uni-app 内置 checkbox 样式调整 */
	.agreement-checkbox {
		transform: scale(0.8);
		margin-right: 10rpx;
	}
	
	/* 协议文字样式 */
	.agreement-text {
		margin-right: 10rpx;
	}
	
	/* 协议链接文字样式 */
	.protocol-text {
		color: #80A653;
		margin: 0 5rpx;
	}
</style>