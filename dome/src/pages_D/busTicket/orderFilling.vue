<template>
	<view class="container" :data-theme="pageTheme">
	<up-navbar :title="title" bgColor="none" @leftClick="toBack" placeholder :fixed="true"
		:titleStyle="{fontWeight: 'bold'}"></up-navbar>

		<view class="ticket-detail">
			<!-- 车票信息 -->
			<view class="date">{{orderInfo.departDate}} {{ weekText }}</view>
			<view class="ticket-info">

				<view class="time-and-stations">
					<view class="time-and-stations-left">
						<text class="departure-time">{{orderInfo.departTime}}</text>
						<text class="duration">大约{{orderInfo.runtime}}h</text>
					</view>
					<view class="stations">
						<view class="stations-lux">
							<view class="circle-icon"></view>
							<text>{{orderInfo.startStationName || ''}}</text>
						</view>
						<view class="arrow-icon"></view>
						<view class="stations-lux">
							<view class="circle-icon"></view>
							<text>{{orderInfo.reachStationName || ''}}</text>
						</view>
					</view>
				</view>
				<view class="notice">
					<view class="notice-left">
						<image :src="imgUrl+'car_info.png'" class="notice-icon-1"></image>
						<text>发车前5分钟可在线退票</text>
					</view>
					<view class="notice-right" @click="showNotice = true">
						<text>购票须知及退改说明</text>
						<image :src="imgUrl+'more.png'" class="notice-icon"></image>
					</view>
				</view>
				<view class="station-box">
					<image :src="imgUrl+'car_reject.png'" class="station-box-icon-1" mode=""></image>
					<view class="station-box-right">

						<view class="station-box-1">
							车站地址
						</view>
						<view class="station-box-2 station-box-z" @click="showMap">
							<image :src="imgUrl+'gruue-map-icon.png'" class="station-box-icon-2" mode=""></image>
							{{address}}
						</view>
						<view class="station-box-3">
							联系电话
						</view>
						<view class="station-box-4 station-box-z" @click="makeCall">
							<image :src="imgUrl+'home-phone.png'" class="station-box-icon-2" mode=""></image>
							{{tel}}
						</view>
					</view>
				</view>
			</view>
			<!-- 乘客选择 -->
			<view class="passenger-selection">
				<view class="title">请选择乘车人<text>(每笔订单最多五人)</text></view>
				<view class="passenger-box" v-if="contacts.length > 0" v-for="(item, index) in contacts" :key="index">
					<text class="fs-28 col3 fw-600">{{item.name}}</text>
					<view class="flex ali-cen just-sb m-t-10">
						<text class="fs-28 col6 fw-400">{{maskIdNumber(item.certNo)}}</text>
						<image :src="imgUrl+'home-del.png'" class="station-del" mode="" @click.stop="onDeletePassenger(item, index)"></image>
					</view>
				</view>
				<view class="add-passenger" @click="addContacts">添加/编辑乘客</view>
				<view class="pickup-phone">
					<text>取票电话</text>
					<input v-model="orderPhone" type="number" placeholder="用以接收售票短信" />
				</view>
			</view>
		</view>
		<view class="foot-box">
			<view class="foot-box-left">
				<view class="foot-box-1">
					<view class="foot-box-text-1">
						¥{{(Number(orderInfo.fullPrice) * contacts.length) > 0 ? (Number(orderInfo.fullPrice) * contacts.length) : '--'}}
					</view>
					<view class="foot-box-text-2">
						订单总价
					</view>
				</view>
				<view class="foot-box-1">
					<view class="foot-box-text-2">
						当前{{contacts.length}}人
					</view>
					<view v-if="contacts.length == 0" class="foot-box-text-2">
						请添加乘客
					</view>
				</view>
			</view>

			<view class="foot-box-2" @click="busTicketOrderFun">
				去支付
			</view>
		</view>

		<!-- 购票须知弹窗 -->
		<u-popup :show="showNotice" mode="bottom" :round="20" :closeOnClickOverlay="true" @close="showNotice = false">
			<view class="notice-popup">
				<!-- 弹窗标题栏 -->
				<view class="popup-header">
					<view class="tabs">
						<text class="tab-item" :class="currentTab == 'ticket' ? 'active' : ''"
							@click="currentTab = 'ticket'">购票须知</text>
						<text class="tab-item" :class="currentTab == 'refund' ? 'active' : ''"
							@click="currentTab = 'refund'">改退须知</text>
					</view>
					<image src="/static/close.png" class="close-icon" @click="showNotice = false"></image>
				</view>

				<!-- 弹窗内容区 -->
				<scroll-view class="popup-content" scroll-y>
					<!-- 购票须知内容 -->
					<view v-if="currentTab === 'ticket'">
						<view class="section">
							<text class="section-title">购票</text>
							<view class="section-content">
								<view class="info-item">
									<view class="info-label">购票证件</view>
									<view class="info-value">二代身份证</view>
								</view>
								<view class="info-item">
									<view class="info-label">支持票种</view>
									<view class="info-value">成人票</view>
								</view>
								<view class="info-item">
									<view class="info-label">购票限制</view>
									<view class="info-value">受车站限制，每笔订单最多支持购买5张票，超出需要分开下单</view>
								</view>
								<view class="info-item">
									<view class="info-label">购票提醒</view>
									<view class="info-value">若购票未成功，金额票款将在1～7个工作日内返至您的原支付账户</view>
								</view>
								<view class="info-item">
									<view class="info-label">联系电话</view>
									<view class="info-value">{{tel}}</view>
								</view>
							</view>
						</view>

						<view class="section">
							<view class="section-title">取票/乘车</view>
							<view class="section-content">
								<view class="info-item">
									<view class="info-label">取票/乘车地址</view>
									<view class="info-value">{{address}}</view>
								</view>
								<view class="info-item">
									<view class="info-label">取票方式</view>
									<view class="info-value">
										此车站支持电子客票，旅客可使用身份证直接检票上车，可无需取票。如需报销，请前往服务台窗口或自助取票机（位于窗口对面，服务台前方）打印纸质车票</view>
								</view>
								<view class="info-item">
									<view class="info-label">取票时间</view>
									<view class="info-value">06:00-20:00</view>
								</view>
								<view class="info-item">
									<view class="info-label">检票方式</view>
									<view class="info-value">支持纸质票、刷身份证、扫描二维码乘车</view>
								</view>
							</view>
						</view>

						<!-- <view class="section">
							<view class="section-title">报销</view>
							<view class="section-content">
								<view class="info-item">
									<view class="info-label">车票</view>
									<view class="info-value">纸质车票可作为报销凭证</view>
								</view>
							</view>
						</view> -->

						<!-- <view class="section">
							<view class="info-value">* 附加产品 服务费、保险等其它附加产品可在订单完成后申</view>
						</view> -->
						<view class="section">
							<view class="info-value"></view>
						</view> 
					</view>

					<!-- 改退须知内容 (可根据实际需求补充) -->
					<view v-if="currentTab === 'refund'">
						<view class="section">
							<view class="section-title">改退政策</view>
							<view class="section-content">
								<view class="info-item">
									<view class="info-value-s">1. 发车前2小时以上退票，收取票价10%的手续费</view>
								</view>
								<view class="info-item">
									<view class="info-value-s">2. 发车前1-2小时退票，收取票价20%的手续费</view>
								</view>
								<view class="info-item">
									<view class="info-value-s">3. 发车前1小时内退票，收取票价30%的手续费</view>
								</view>
								<view class="info-item">
									<view class="info-value-s">4. 发车后不支持退票</view>
								</view>
								<view class="info-item">
									<view class="info-value-s">5. 改签需在发车前2小时办理，每张车票限改签一次</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

	</view>
</template>

<script setup lang="ts">
	import { ref, computed, reactive } from 'vue';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { onLoad, onShow, onPageScroll } from '@dcloudio/uni-app';
	import { useBusTicketStore } from '../../stores/busTicket'
	import { stationInfo, busTicketOrder } from '@/api/busticket';
	import { openAPPLocation ,openLocation,makePhoneCall} from '@/utils/util';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const busTicketStore = useBusTicketStore()
	const title = ref('订单填写');
	// 控制弹窗显示
	const showNotice = ref(false);
	// 当前选中的标签页
	const currentTab = ref('ticket'); // 'ticket' 或 'refund'
	const address = ref('');
	const tel = ref('');
	const contacts = ref([])
	const orderPhone = ref('')
	const orderInfo = reactive({
		departTime: '',
		runtime: '',
		startStationName: '',
		reachStationName: '',
		fullPrice: '',
		departDate: '',
		passengers: []
	})
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	const latitude = ref<number | null>(null)
	const longitude = ref<number | null>(null)
	const stationName = ref('')
	onLoad(() => {
		orderInfo.departTime = busTicketStore.formData.departTime
		orderInfo.runtime = busTicketStore.formData.runtime
		orderInfo.startStationName = busTicketStore.startPlace.name
		orderInfo.reachStationName = busTicketStore.endPlace.name
		orderInfo.fullPrice = busTicketStore.formData.fullPrice
		orderInfo.departDate = busTicketStore.selectedDate
		stationInfoFun()
	})
	onShow(() => {
		contacts.value = uni.getStorageSync('contacts') || []
		// orderPhone.value = uni.getStorageSync('contacts')[0]?.contactPhone || ''
	})
	
	// 删除乘客：同时删除 contacts 缓存中的该条
	const onDeletePassenger = (item: any, index: number) => {
	  uni.showModal({
	    title: '提示',
	    content: `确定删除乘客「${item?.name || ''}」吗？`,
	    confirmText: '删除',
	    success: (res) => {
	      if (!res.confirm) return
	       orderPhone.value=''
	      const list = Array.isArray(contacts.value) ? [...contacts.value] : []
	
	      // 优先用 id 精确删除；没有 id 时用证件号兜底
	      const keyId = item?.id
	      const keyCert = item?.certNo
	
	      const next = list.filter((c, i) => {
	        if (keyId) return c?.id !== keyId
	        if (keyCert) return c?.certNo !== keyCert
	        // 最后兜底：用 index
	        return i !== index
	      })
	
	      contacts.value = next
	
	      if (next.length > 0) {
	        uni.setStorageSync('contacts', next)
	      } else {
	        uni.removeStorageSync('contacts')
	      }
	    }
	  })
	}

	
	const weekText = computed(() => {
	  if (!orderInfo.departDate) return '';
	
	  const date = new Date(orderInfo.departDate.replace(/-/g, '/'));
	  const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
	
	  return weekMap[date.getDay()];
	});
	
	const stationInfoFun = async () => {
		const params = {
			stationCode: busTicketStore.startPlace.code
		};
		const res = await stationInfo(params);
		if (res.code === 200 && res.data) {
			address.value = res.data.address;
			tel.value = res.data.tel;
			latitude.value = Number(res.data.latitude)
			longitude.value = Number(res.data.longitude)
			stationName.value = res.data.address
		}
	};
	
	const passengers = computed(() => {
	  return (contacts.value || [])
	    .filter(item => item.checked)
	    .map(item => ({
	      customerName: item.name,
	      certificateType: item.certType,
	      certificateNo: item.certNo,
	      phone: item.contactPhone,
	      price: busTicketStore.formData.fullPrice,
		  ticketType: 'Q',
		  takeKid: '0'
	    }))
	})
	
	// 创建订单
	const busTicketOrderFun = async () => {
		if(passengers.value.length==0){
			uni.showToast({
				title: '请选择乘车人',
				icon: 'none'
			});
			return
		}
		if(!orderPhone.value){
			uni.showToast({
				title: '请填写取票电话',
				icon: 'none'
			});
			return
		}
		const params = {
			departDate: orderInfo.departDate,
			departTime: orderInfo.departTime,
			scheduleCode: busTicketStore.formData.scheduleCode,
			startStationName: orderInfo.startStationName,
			startStationCode: busTicketStore.startPlace.code,
			reachStationCode: busTicketStore.formData.stationCode,
			reachStationName: orderInfo.reachStationName,
			seatType: busTicketStore.formData.seatType,
			seatNum: passengers.value.length,
			runtime: orderInfo.runtime,
			orderCustomerName: passengers.value[0].customerName,
			orderCertificateType: passengers.value[0].certificateType,
			orderCertificateNo: passengers.value[0].certificateNo,
			orderPhone: orderPhone.value,
			inStation: 0,
			ticketType: 1,
			passengers: passengers.value
		};
		const res = await busTicketOrder(params);
		if (res.code === 200 && res.data) {
			uni.removeStorageSync('contacts')
			uni.navigateTo({
				url: `/pages_D/busTicket/details?id=${res.data.orderNo}`
			})
		}else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	};
	const showMap = () => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": longitude.value,
					"latitude": latitude.value,
					"address": address.value
				}
			}
			openAPPLocation(navigationInfo)
		} else {
			openLocation({
				latitude: latitude.value,
				longitude: longitude.value,
				scale: 18,
				name: stationName.value,
				address: address.value,
			});
		}
	
	};
	const makeCall = () => {
		makePhoneCall(tel.value)
	};
	onPageScroll((e) => {
		console.log(e);
	})
	onPageScroll((e) => {
		console.log(e);
	})
	// 身份证号脱敏处理
	const maskIdNumber = (id : string) => {
		return id.replace(/^(.{6})(?:\d+)(.{4})$/, '$1********$2');
	};
	
	const addContacts = () => {
		if (contacts.value.length >= 5) {
			 uni.showToast({
			 	title: '每笔订单最多五人',
			 	icon: 'none'
			 });
		} else {
			uni.navigateTo({
				url: '/pages_B/scenicSpotTicket/contactsList?count=5'
			})
		}
	}
</script>

<style scoped lang="scss">
	.container_bg {
		width: 750rpx;
		height: 725rpx;
		background-image: var(--linear-color);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}
	
	.container {
		width: 750rpx;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.stations-lux {
		display: flex;
		align-items: baseline;
	}

	.foot-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 750rpx;
		height: 158rpx;
		background: #FFFFFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 40rpx;
		padding-top: 15rpx;
		padding-right: 30rpx;
		box-sizing: border-box;
		z-index: 10;
	}

	.foot-box-left {
		display: flex;
		align-items: center;
	}

	.foot-box-1 {
		display: flex;
		flex-direction: column;
		height: 72rpx;
		justify-content: space-between;
		margin-right: 48rpx;
	}

	.foot-box-text-1 {
		font-weight: 700;
		font-size: 24rpx;
		color: #FF6200;
	}

	.foot-box-text-2 {
		font-weight: 350;
		font-size: 24rpx;
		color: #666666;
	}

	.foot-box-2 {
		width: 256rpx;
		height: 96rpx;
		background: var(--but-color-line);
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		text-align: center;
		line-height: 96rpx;
		font-size: 32rpx;
		color: #FFFFFF;
	}

	::v-deep .u-navbar__content {
		background: none !important;
	}

	.ticket-detail {
		position: relative;
		z-index: 2 !important;
		margin: 30rpx;
		padding-bottom: 160rpx;

		.date {
			background: var(--linear-color);
			height: 56rpx;
			line-height: 56rpx;
			padding: 14rpx 32rpx;
			font-weight: 700;
			font-size: 28rpx;
			color: #333333;
			border-radius: 16rpx 16rpx 0rpx 0rpx;
		}

		.ticket-info {
			background-color: #fff;
			padding: 40rpx 36rpx;
			margin-bottom: 20rpx;
			border-radius: 0rpx 0rpx 16rpx 16rpx;


			.time-and-stations {
				display: flex;
				margin-bottom: 10rpx;
				align-items: center;

				.time-and-stations-left {
					display: flex;
					flex-direction: column;
					align-items: baseline;
					margin-right: 40rpx;
				}

				.stations {
					display: flex;
					flex-direction: column;
					align-items: baseline;

					.circle-icon {
						width: 14rpx;
						height: 14rpx;
						border: 2rpx solid #999999;
						border-radius: 50rpx;
						margin-right: 24rpx;
					}

					.arrow-icon {
						height: 63rpx;
						width: 2rpx;
						border-left: 2rpx solid #D8D8D8;
						margin-left: 7rpx;
					}
				}

				.duration {
					font-size: 24rpx;
					color: #999;
					margin-top: 24rpx;
				}
			}

			.notice {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 20rpx;

				.notice-left {
					display: flex;
					align-items: center;

					.notice-icon-1 {
						width: 32rpx;
						height: 32rpx;
						margin-right: 16rpx;
					}

					text {
						font-weight: 400;
						font-size: 24rpx;
						color: #666666;
					}
				}

				.notice-right {
					display: flex;
					align-items: center;

					.notice-icon {
						width: 32rpx;
						height: 32rpx;
						margin-left: 16rpx;
					}

					text {
						font-weight: 700;
						font-size: 24rpx;
						color: #333333;
					}
				}

			}
		}

		.station-info {
			background-color: #fff;
			border-radius: 10rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;

			.address {
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;

				.location-icon {
					width: 20rpx;
					height: 20rpx;
					margin-right: 10rpx;
				}

				text {
					font-size: 28rpx;
					color: #333;
				}
			}

			.contact {
				display: flex;
				align-items: center;

				text {
					font-size: 28rpx;
					color: #333;
					margin-right: 10rpx;
				}
			}
		}

		.passenger-selection {
			margin-top: 30rpx;
			background-color: #fff;
			border-radius: 16rpx;
			padding: 32rpx;
			margin-bottom: 24rpx;

			.title {
				font-weight: 700;
				font-size: 32rpx;
				color: #333333;
				margin-bottom: 54rpx;

				text {
					font-size: 26rpx;
					color: #666666;
				}
			}

			.add-passenger {
				width: 256rpx;
				height: 72rpx;
				background: var(--but-color-line);
				border-radius: 36rpx 36rpx 36rpx 36rpx;
				font-weight: 700;
				font-size: 28rpx;
				color: #fff;
				text-align: center;
				line-height: 72rpx;
				margin: 0 auto;
			}
		}

		.pickup-phone {
			background-color: #fff;
			display: flex;
			align-items: center;
			padding-top: 30rpx;
			padding-bottom: 18rpx;
			border-top: 2rpx solid #F1F1F1;
			margin-top: 32rpx;

			text {
				display: inline-block;
				font-size: 28rpx;
				color: #333;
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
				margin-right: 24rpx;
			}

			input {
				font-size: 28rpx;
				color: #333;
				border: none;
				outline: none;
			}
		}
	}

	.station-box {
		margin-top: 70rpx;

		display: flex;
		align-items: center;

	}

	.station-box-icon-1 {
		width: 186rpx;
		height: 82rpx;
		margin-right: 40rpx;
	}

	.station-box-icon-2 {
		width: 28rpx;
		height: 28rpx;
		margin-left: 16rpx;
		margin-right: 24rpx;
	}

	.station-box-z {
		display: flex;
		align-items: center;
	}

	.station-box-1 {
		display: flex;
		align-items: center;
		font-weight: 400;
		font-size: 24rpx;
		color: #666666;
		margin-bottom: 22rpx;
	}

	.station-box-2 {
		font-weight: 700;
		font-size: 24rpx;
		color: #333333;
		margin-bottom: 22rpx;
	}

	.station-box-3 {

		color: #666666;
		margin-bottom: 22rpx;
	}

	.station-box-4 {
		font-weight: 700;
		font-size: 24rpx;
		color: #333333;
	}

	// 弹窗相关样式
	.notice-popup {
		background-color: #fff;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.popup-header {
		position: relative;
		padding: 30rpx 32rpx;
		border-bottom: 1px solid #F5F5F5;

		.tabs {
			display: flex;
			height: 56rpx;
			border-radius: 28rpx;
			overflow: hidden;
		}

		.tab-item {
			flex: 1;
			text-align: center;
			line-height: 56rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #666;
			position: relative;
		}

		.tab-item.active {
			&::after{
				content:'';
				width: 54rpx;
				height: 6rpx;
				background-color: var(--primary-color);
				border-radius: 182rpx;
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
			}
		}

		.close-icon {
			position: absolute;
			top: 30rpx;
			right: 32rpx;
			width: 32rpx;
			height: 32rpx;
		}
	}

	.popup-content {
		max-height: 700rpx;
		padding: 32rpx;
		box-sizing: border-box;
		padding-bottom: 60rpx;
	}

	.section {
		margin-bottom: 30rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.section-title {
		font-size: 28rpx;
		font-weight: 700;
		color: #333;
		display: block;
		margin-bottom: 20rpx;
		padding-left: 10rpx;
		border-left: 4rpx solid var(--primary-color);
	}

	.section-content {
		padding-left: 14rpx;
	}

	.info-item {
		display: flex;
		margin-bottom: 24rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.info-label {
		width: 160rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #333;
		display: block;
		margin-bottom: 8rpx;
		margin-right: 30rpx;
	}
	
	.info-value-s {
		width: 660rpx !important;
		font-size: 24rpx;
		color: #666;
		line-height: 1.6;
	}

	.info-value {
		width: 460rpx;
		font-size: 24rpx;
		color: #666;
		line-height: 1.6;
	}
	
	.station-del {
		width: 32rpx;
		height: 32rpx;
	}
	
	.passenger-box {
		padding-bottom: 40rpx;
		margin-bottom: 30rpx;
		border-bottom: 2rpx solid #EAEAEA;
	}
</style>