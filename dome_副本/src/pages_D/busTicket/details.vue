<template>
	<view class="page" :data-theme="pageTheme">

		<up-navbar bgColor="transparent" autoBack placeholder :fixed="true">
			<template #center>
				<text>{{ORDER_STATUS_MAP[dataInfo.payStatus]||'详情'}}</text>
			</template>
		</up-navbar>
		
		<view v-if="dataInfo.payStatus == 0" class="pay-time">
			剩余支付时间 | {{ remainTimeText }}
		</view>
		<view class="order-detail-page" :class="dataInfo.payStatus != 0 ? 'm-t-100' : ''">
			<!-- 顶部：乘车日期 & 状态 -->
			<view class="top-bar">
				<text class="date">乘车日期 | {{ dataInfo.departDate }}</text>
				<text class="status" :class="`status-${dataInfo.payStatus}`">{{orderStatusText}}</text>
			</view>
			<!-- 主体：行程信息 -->
			<view class="trip-info">
				<!-- 左侧：时间 -->
				<view class="time-box">
					<text class="time">{{ dataInfo.departTime }}</text><br />
					<text class="duration" v-if="dataInfo.runtime != 0">大约{{ dataInfo.runtime }}h</text>
				</view>

				<!-- 中间：路线 -->
				<view class="route">
					<view class="station-item">
						<view
							style="width: 14rpx;height: 14rpx;border: 2rpx solid #4381ED;margin-right:28rpx;border-radius: 14rpx;">
						</view>
						<text class="station-name">{{ dataInfo.startStationName }}</text>
					</view>
					<view class="arrow"></view>
					<view class="station-item">
						<view
							style="width: 14rpx;height: 14rpx;border: 2rpx solid #4381ED;margin-right:28rpx;border-radius: 14rpx;">
						</view>
						<text class="station-name">{{ dataInfo.reachStationName }}</text>
					</view>
				</view>

				<!-- 右侧：票价 -->
				<view class="price-box">
					<text class="price">¥{{ dataInfo.passengers[0].price }}</text><br />
					<text class="count">x{{dataInfo.seatNum}}</text>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<text class="order-time">下单时间 | {{ dataInfo.createTime }}</text>
			<text class="total-pay">合计支付：¥{{ dataInfo.totalPrice }}</text>
		</view>
		<view class="passenger-info-page">
			<!-- 标题 -->
			<view class="title">乘车人信息</view>
			<!-- 乘客列表 -->
			<view class="passenger-list">
				<!-- 单个乘客卡片 -->
				<view v-for="(passenger, index) in dataInfo.passengers" :key="index" class="passenger-card">
					<!-- 姓名 + 票种 -->
					<view
						style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 30rpx;">
						<view style="width: 100%;flex: 1;">
							<view class="name-section">
								<text class="name">{{ passenger.customerName }}</text>
								<text class="ticket-type">成人票</text>
							</view>
							<!-- 身份证号 -->
							<view class="id-number flex ali-cen just-sb">
								<text>{{ maskIdNumber(passenger.certificateNo) }}</text>
								<text class="fs-24" style="color: #FD4848;" v-if="passenger.refundFlag == 1">已退款</text>
							</view>
						</view>
						<!-- 二维码区域 -->
						<view class="qrcode-area" v-if="(dataInfo.payStatus == 1 || dataInfo.payStatus == 3 || dataInfo.payStatus == 21) && passenger.refundFlag == 0" @click.stop="openQrPopup(passenger.ticketNo)">
							<image :src="imgUrl+'qrcode-icon.png'" class="qrcode-icon" mode="widthFix" />
							<text class="qrcode-text">扫二维码进站</text>
						</view>
					</view>
					<!-- 座位信息 -->
					<view class="seat-info">
						<text class="info-item">乘车位 | {{ passenger.busPark }}</text>
						<text class="info-item">座位号 | {{ passenger.seatNo }}</text>
						<text class="info-item">班次 | {{ dataInfo.scheduleCode }}</text>
					</view>
					<view v-if="(dataInfo.payStatus == 21 && passenger.refundFlag == 0) || (dataInfo.payStatus == 1 && passenger.refundFlag == 0)" class="refund-btn-s-box">
						<view class="refund-btn-s" @click="onApplyRefund(passenger.netTicketId)">申请退票</view>
					</view>
				</view>
			</view>
			<!-- 提示栏 -->
			<view class="notice-bar">
				<view class="notice-item">
					<image :src="imgUrl+'car_info.png'" style="width: 28rpx;height: 28rpx;margin-right: 20rpx;"
						mode="widthFix" />
					<text class="text">发车前5分钟可在线退票</text>
				</view>
				<view class="notice-item">
					<text class="text">购票须知及改退说明</text>
					<image :src="imgUrl+'arrow-right-icon.png'" style="width: 28rpx;height: 28rpx;margin-right: 20rpx;"
						mode="widthFix" />
				</view>
			</view>
		</view>
		<view class="check-info-page">
			<!-- 标题栏 -->
			<view class="title-bar" @click="toggle">
				<text class="title">检票信息</text>
				<text class="collapse-btn" :class="{ 'rotate': isExpanded }">
					{{ isExpanded ? '▼' : '▽' }}
				</text>
			</view>

			<!-- 内容区域（可折叠） -->
			<view v-show="isExpanded" class="content-area">
				<!-- 检票方式 -->
				<view class="info-item">
					<text class="label">检票方式</text>
					<text class="value">二代身份证/二维码/纸质票</text>
				</view>

				<!-- 取票凭证 -->
				<view class="info-item">
					<text class="label">取票凭证</text>
					<text class="value">
						此车站支持电子客票，旅客可使用身份证直接检票上车，可无需取票。如需要报销请前往服务窗口或自主售票区打印纸质车票。
					</text>
				</view>
			</view>
		</view>
		<view class="pickup-guide-page">
			<!-- 标题 -->


			<!-- 地址卡片 -->
			<view class="address-card">
				<!-- 地址内容 -->
				<view>
					<view class="title">上车位置指引</view>
					<view class="address-content">
						<image :src="imgUrl+'gruue-map-icon.png'" class="location-icon" mode="widthFix" />
						<text class="address-text">{{address}}</text>
					</view>
				</view>


				<!-- 右侧操作按钮 -->
				<view class="action-buttons">
					<!-- 导航按钮 -->
					<view class="nav-btn" @click="showMap">
						<image :src="imgUrl+'cd-daohang.png'" class="btn-icon-1" mode="widthFix" />
						<text class="btn-text">导航</text>
					</view>

					<!-- 电话按钮 -->
					<view class="call-btn" @click="makeCall">
						<image :src="imgUrl+'cd-phone.png'" class="btn-icon-1" mode="widthFix" />
						<text class="btn-text">电话</text>
					</view>
				</view>
			</view>

			<view v-if="dataInfo.payStatus == 0" class="bottom-bar-s flex just-sb ali-cen">
				<view class="bar-price-box flex flex-col ali-cen">
					<view class="bar-price m-b-15">
						<text class="fs-24">¥</text>
						<text class="fs-36">{{dataInfo.totalPrice}}</text>
					</view>
					<text class="fs-24 col6">合计</text>
				</view>
				<view class="bar-btn-box flex ali-cen just-sb">
					<view class="bar-btn cancel-btn" @click="onCancelClick">取消订单</view>
					<view class="bar-btn pay-btn" @click="onPayClick">去支付</view>
				</view>
			</view>
		</view>

		<u-popup :show="showPayPopup" mode="bottom" round="24" @close="showPayPopup = false">
			<view class="pay-popup">
				<!-- 标题 -->
				<view class="pay-header">
					<text class="pay-title">确认支付</text>
					<image class="close-icon" :src="imgUrl + 'close.png'" @click="showPayPopup = false" />
				</view>

				<!-- 金额 -->
				<view class="pay-amount">
					<text class="label">支付金额</text>
					<view class="price">
						<text class="unit">¥</text>
						<text class="num">{{ dataInfo.totalPrice }}</text>
					</view>
				</view>

				<!-- 支付方式 -->
				<view class="pay-method">
					<text class="method-title">支付方式</text>
					<view class="method-item">
						<image class="wx-icon" :src="imgUrl + 'wxpay-icon.png'" />
						<text class="method-name">微信支付</text>
						<image class="checked-icon" :src="imgUrl + 'checked.png'" />
					</view>
				</view>

				<!-- 支付按钮 -->
				<view class="pay-btn-s" @click="startWechatPay">
					立即支付
				</view>

				<!-- 取消 -->
				<view class="cancel-btn-text" @click="showPayPopup = false">
					取消
				</view>
			</view>
		</u-popup>

		<u-popup :show="showRefundPopup" mode="bottom" round="24" @close="showRefundPopup = false">
			<view class="refund-popup">
				<!-- 头部 -->
				<view class="refund-header">
					<text class="refund-title">退票提醒</text>
					<text class="close-x" @click="showRefundPopup = false">×</text>
				</view>

				<!-- 费用说明 -->
				<view class="refund-section">
					<view class="section-title flex ali-cen">
						<view class="s-line"></view>
						<text>费用说明</text>
					</view>
					<view class="fee-item">
						<text class="fee-label">原支付金额</text>
						<text class="fee-value">¥{{ totalPrice }}</text>
					</view>

					<view class="fee-item">
						<text class="fee-label">退票手续费</text>
						<text class="fee-value">¥{{ refundFee }}</text>
					</view>

					<view class="fee-item total">
						<text class="fee-label">预计退款金额</text>
						<text class="fee-value">¥{{ refundAmount }}</text>
					</view>
				</view>

				<!-- 退票说明 -->
				<view class="refund-section">
					<view class="section-title flex ali-cen">
						<view class="s-line"></view>
						<text>退票说明</text>
					</view>
					<view class="refund-desc">
						退票费按距开车时间分梯次收取，且以5角为单位折算，最低按2元计收。具体为开车前2小时(含)以上退票免手续费;发车两小时以内按照10%计;发车前五分钟内按 20%计;晚于发车时间线上不可退。
					</view>
				</view>

				<!-- 确认按钮 -->
				<view class="refund-btn" @click="onRefundConfirm">
					确认退票
				</view>
			</view>
		</u-popup>

		<!-- 二次确认退票弹窗 -->
		<u-popup :show="showRefundConfirm" mode="center" round="16" :overlayOpacity="0.6"
			@close="showRefundConfirm = false" :safeAreaInsetBottom="false">
			<view class="confirm-modal">
				<view class="confirm-title">提醒</view>
				<view class="confirm-content">确认是否退票！</view>

				<view class="confirm-actions">
					<view class="btn cancel" @click="showRefundConfirm = false">
						取消
					</view>
					<view class="btn confirm" @click="doRefund">
						确定
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-popup
		  :show="showQrPopup"
		  mode="center"
		  round="24"
		  :overlayOpacity="0.6"
		  @close="showQrPopup = false"
		  :safeAreaInsetBottom="false"
		>
		  <view class="qr-modal" v-if="showQrPopup">
		    <view class="qr-title">乘车二维码</view>
		
		    <up-qrcode
			  :cid="qrCid"
			  :size="260"
			  :val="qrVal"
			  showLoading
			  loadingText="二维码生成中"
			  @result="onQrReady"
		        />
				<image v-if="qrImgPath" :src="qrImgPath" class="qr-img" mode="widthFix" />
		    <view class="qr-desc">
		      <text class="qr-name">{{ qrPassengerName }}</text>
		      <text class="qr-no">票号：{{ qrVal }}</text>
		    </view>
		
		    <view class="qr-actions">
		      <view class="qr-btn" @click="copyQrText">复制票号</view>
		      <view class="qr-btn primary" @click="showQrPopup = false">关闭</view>
		    </view>
		  </view>
		</u-popup>


	</view>
</template>

<script setup lang="ts">
	import { ref, nextTick } from 'vue'
	import theme from '@/utils/theme'
	import { onLoad, onShow, onUnload } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { openAPPLocation,openLocation,makePhoneCall } from '@/utils/util';
	import { getpayOrderInfodel } from '@/api/index'
	import { useBusTicketStore } from '../../stores/busTicket'
	import { busTicketOrderInfo, stationInfo, cancelBusTicketOrder, getPayParam, calculateRefundFee, refundBusTicketOrder } from '@/api/busticket';
	import { toNav, toBack } from '@/utils/route';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const busTicketStore = useBusTicketStore()
	const systemInfo = uni.getSystemInfoSync()
	const isWechatMP = systemInfo.uniPlatform === 'mp-weixin'
	const isApp = systemInfo.uniPlatform === 'app'
	const orderifno = ref({
		payStatus: 1
	})
	const showPayPopup = ref(false)
	const orderId = ref<string>('')              // 保存页面传入的 options.id
	const hasTimeoutRefreshed = ref<boolean>(false) // 防止倒计时结束重复刷新
	const passengers = ref([])
	const isExpanded = ref(true);
	const dataInfo = ref({});
	const orderStatusText = ref('')
	const address = ref('');
	const tel = ref('');
	const ORDER_STATUS_MAP = {
		0: '待支付',
		1: '已支付',
		2: '已取消',
		3: '已完成',
		4: '退款',
		21: '部分退款'
	}
	const latitude = ref<number | null>(null)
	const longitude = ref<number | null>(null)
	const stationName = ref('')
	const startStationCode = ref('')
	const showRefundConfirm = ref(false)
	const currentNetTicketId = ref<string | null>(null)
	const countdownBusy = ref(false)
	onUnload(() => {
		if (countdownTimer) {
			clearInterval(countdownTimer)
			countdownTimer = null
		}
	})
	const remainTimeText = ref('--')
	let countdownTimer: ReturnType<typeof setInterval> | null = null
	const stopCountdown = () => {
	  if (countdownTimer) {
	    clearInterval(countdownTimer)
	    countdownTimer = null
	  }
	}
	
	const parseLocalDateTimeMs = (s: string) => {
	  if (!s) return NaN
	  const m = s.match(
	    /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})(?:\s|T)(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/
	  )
	  if (!m) return NaN
	  const y = Number(m[1])
	  const mo = Number(m[2])
	  const d = Number(m[3])
	  const h = Number(m[4])
	  const mi = Number(m[5])
	  const se = Number(m[6] || '0')
	  return new Date(y, mo - 1, d, h, mi, se).getTime()
	}
	
	const calcRemainSeconds = (createTime: string) => {
	  const startMs = parseLocalDateTimeMs(createTime)
	  if (Number.isNaN(startMs)) return NaN
	  const endMs = startMs + 10 * 60 * 1000
	  return Math.floor((endMs - Date.now()) / 1000)
	}
	
	const formatRemainTime = (seconds: number) => {
	  if (seconds <= 0) return '已超时'
	  const m = Math.floor(seconds / 60)
	  const s = seconds % 60
	  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
	}

	const showQrPopup = ref(false)
	const qrVal = ref('')                 // 当前要生成二维码的 ticketNo
	const qrCid = ref('')                 // 必须唯一，否则可能复用旧canvas
	const qrImgPath = ref('')             // 导出的二维码图片路径（tempFilePath）
	const qrPassengerName = ref('')   // 展示用
	
	const openQrPopup = async (ticketNo: string | number) => {
	  if (!ticketNo) {
	    uni.showToast({ title: '未获取到票号', icon: 'none' })
	    return
	  }
	  qrVal.value = String(ticketNo)
	  qrImgPath.value = ''
	
	  // cid 必须有，且建议每次打开都唯一，避免缓存/复用导致不刷新
	  qrCid.value = `ticket_qr_${qrVal.value}_${Date.now()}`
	
	  showQrPopup.value = true
	}
	
	const closeQrPopup = () => {
	  showQrPopup.value = false
	  qrImgPath.value = ''
	}
	
	const onQrReady = async () => {
	  // up-qrcode 绘制完成后，如果你要“二维码图片”，这里把 canvas 导出成图片
	  await nextTick()
	
	  uni.canvasToTempFilePath({
	    canvasId: qrCid.value,
	    success: (res) => {
	      qrImgPath.value = res.tempFilePath
	    },
	    fail: (err) => {
	      // 只展示二维码也没问题；如果你必须要图片，再排查这里
	      console.log('canvasToTempFilePath fail:', err)
	    }
	  })
	}
	
	const copyQrText = () => {
	  if (!qrVal.value) return
	  uni.setClipboardData({
	    data: qrVal.value,
	    success: () => uni.showToast({ title: '已复制', icon: 'none' })
	  })
	}

	const onCancelClick = () => {
		uni.showModal({
			title: '取消订单',
			content: '确认要取消该订单吗？',
			confirmText: '确认取消',
			cancelText: '再想想',
			confirmColor: '#FF4D4F',
			success: async (res) => {
				if (res.confirm) {
					await doCancelOrder()
				}
			}
		})
	}

	const doCancelOrder = async () => {
		try {
			const res = await cancelBusTicketOrder({
				orderId: dataInfo.value.id
			})

			if (res.code === 200) {
				uni.showToast({
					title: '订单已取消',
					icon: 'success'
				})

				// 重新拉订单详情
				busTicketOrderInfoFun(dataInfo.value.id)
				uni.reLaunch({
					url: '/pages_D/busTicket/list'
				})
			} else {
				uni.showToast({
					title: res.msg || '取消失败',
					icon: 'none'
				})
			}
		} catch (err) {
			uni.showToast({
				title: '取消失败',
				icon: 'none'
			})
		}
	}

	const onPayClick = () => {
		showPayPopup.value = true
	}

	const startWechatPay = async () => {
		const openId= uni.getStorageSync('userInfo').openId;
		try {
			const res = await getPayParam({
				odrNo: dataInfo.value.orderNo,
				openId:openId,
				odrAmt:'10',
				payChnl:'010'
			})

			if (res.code !== 200 || !res.data) {
				uni.showToast({
					title: '支付信息获取失败',
					icon: 'none'
				})
				return
			}

			const payData = res.data
        
			uni.requestPayment({
				// provider: 'wxpay',
				timeStamp: payData.tmStmp,
				nonceStr: payData.rdomStr,
				package: payData.odrDetEtd,
				signType: payData.signTp || 'RSA',
				paySign: payData.paySign,
				success: () => {
					uni.showToast({
						title: '支付成功',
						icon: 'success'
					})

					// 刷新订单状态
					busTicketOrderInfoFun(dataInfo.value.orderNo)
				},
				fail: () => {
					uni.showToast({
						title: '支付取消',
						icon: 'none'
					})
				}
			})
		} catch (err) {
			uni.showToast({
				title: '支付失败',
				icon: 'none'
			})
		}
	}


const startCountdown = (createTime: string) => {
  stopCountdown()
  hasTimeoutRefreshed.value = false

  const tick = async () => {
    // 防止 async interval 重入
    if (countdownBusy.value) return
    countdownBusy.value = true

    try {
      const remainSeconds = calcRemainSeconds(createTime)

      // 解析失败：停止，避免 NaN 造成异常
      if (Number.isNaN(remainSeconds)) {
        remainTimeText.value = '--'
        stopCountdown()
        return
      }

      // 到点：停止倒计时 + 刷新一次详情
      if (remainSeconds <= 0) {
        remainTimeText.value = '已超时'
        stopCountdown()

        if (!hasTimeoutRefreshed.value) {
          hasTimeoutRefreshed.value = true // 先置 true，避免并发重复触发
          if (orderId.value) {
            await busTicketOrderInfoFun(orderId.value) // 刷新页面数据
          }
        }
        return
      }

      remainTimeText.value = formatRemainTime(remainSeconds)
    } finally {
      countdownBusy.value = false
    }
  }

  void tick()
  countdownTimer = setInterval(() => { void tick() }, 1000) as unknown as number
}



	// 切换展开状态
	const toggle = () => {
		isExpanded.value = !isExpanded.value;
	};
	const makeCall = () => {
		makePhoneCall(tel.value)
	};
	const busTicketOrderInfoFun = async (id: string) => {
	  const res = await busTicketOrderInfo(id)
	  if (res.code !== 200 || !res.data) return
	
	  dataInfo.value = res.data
	
	  const status = res.data.payStatus
	  orderStatusText.value =
	    status === null || status === undefined ? '全部' : (ORDER_STATUS_MAP as any)[status] || '未知状态'
	
	  // 只在待支付时处理倒计时
	  if (status === 0 && res.data.createTime) {
	    // 你测试写死时间就替换成写死的
	    const createTime = res.data.createTime // 或 '2025-12-18 19:01:14'
	
	    const remainSeconds = calcRemainSeconds(createTime)
	
	    // 已超时：只展示，不启动倒计时（防止“刷新后又启动”）
	    if (Number.isNaN(remainSeconds) || remainSeconds <= 0) {
	      remainTimeText.value = '已超时'
	      stopCountdown()
	    } else {
	      // 未超时：启动倒计时（这里会在结束时刷新一次）
	      startCountdown(createTime)
	    }
	  } else {
	    remainTimeText.value = '--'
	    stopCountdown()
	  }
	
	  stationInfoFun(res.data.startStationCode)
	}


	const onRefundConfirm = () => {
		// 先关掉退票说明
		showRefundPopup.value = false

		// 再弹出二次确认
		showRefundConfirm.value = true
	}

	const doRefund = async () => {
		showRefundConfirm.value = false

		try {
			const res = await refundBusTicketOrder({
				orderNo: dataInfo.value.orderNo,
				netTicketId: currentNetTicketId.value
			})

			if (res.code == 200) {
				uni.showToast({
					title: '退票申请已提交',
					icon: 'none'
				})
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}

			// 刷新订单详情
			busTicketOrderInfoFun(dataInfo.value.id)
		} catch (e) {
			uni.showToast({
				title: '退票失败',
				icon: 'none'
			})
		}
	}
	const onApplyRefund = (netTicketId : string) => {
		currentNetTicketId.value = netTicketId
		calculateRefundFeeFun()
	}


	const stationInfoFun = async (code) => {
		const params = {
			stationCode: code
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

	const calculateRefundFeeFun = async () => {
		const res = await calculateRefundFee(currentNetTicketId.value);
		if (res.code === 200 && res.data) {
			totalPrice.value = res.data[0]
			refundFee.value = res.data[1]
			refundAmount.value = res.data[2]
			showRefundPopup.value = true
		}
	};
	const orderStatus = ref('')

	onLoad((options) => {
		startStationCode.value = options.startStationCode
		orderId.value = options.id || ''
		busTicketOrderInfoFun(options.id)
	})
	
	// 身份证号脱敏处理
	const maskIdNumber = (id : string) => {
		return id.replace(/^(.{6})(?:\d+)(.{4})$/, '$1********$2');
	};

	const showMap = () => {
		if (isApp) {
			const navigationInfo = {
				"endLocation": {
					"longitude": longitude.value,
					"latitude": latitude.value,
					"address": dataInfo.value.address
				}
			}
			openAPPLocation(navigationInfo)
		} else{
			openLocation({
				latitude: latitude.value,
				longitude: longitude.value,
				scale: 18,
				name: stationName.value,
				address: dataInfo.value.address,
			});
		}

	};

	const showRefundPopup = ref(false)

	const totalPrice = ref(0)
	const refundFee = ref(0)
	const refundAmount = ref(0)

	const openRefundPopup = () => {
		showRefundPopup.value = true
	}

	const confirmRefund = () => {
		uni.showModal({
			title: '确认退票',
			content: '确认提交退票申请吗？',
			confirmColor: theme.$bgLgColor,
			success: async (res) => {
				if (res.confirm) {
					showRefundPopup.value = false
					// TODO：这里调用退票接口
					uni.showToast({
						title: '退票申请已提交',
						icon: 'success'
					})
				}
			}
		})
	}
</script>

<style scoped lang="scss">
	.btn-icon-1 {
		width: 50rpx;
		height: 50rpx;
		margin-bottom: 20rpx;
	}

	.page {
		background:
			linear-gradient(180deg, #D1E5F9 0%, rgba(255, 255, 255, 0) 40%),
			#F8F9FB;
		background-size: 100% 100%, 100% 100%;
		background-repeat: no-repeat;
		width: 750rpx;
		height: 100vh;
		padding-bottom: 40rpx;
		color: #333;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.pay-time {
		width: 690rpx;
		height: 80rpx;
		background: linear-gradient( 270deg, #FFFFFF 0%, rgba(255,255,255,0) 100%);
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		margin: 0 30rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		font-weight: 600;
		font-size: 28rpx;
		color: #333333;
		margin-top: 110rpx
	}

	.order-detail-page {
		background-color: #fff;
		margin: 30rpx 30rpx 0rpx 30rpx;
		font-size: 28rpx;
		padding: 30rpx;
		border-radius: 24rpx 24rpx 0rpx 0rpx;
	}

	/* 顶部栏 */
	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		border-bottom: 1rpx solid #e5e5e5;
		padding-bottom: 20rpx;
	}

	.date {
		color: #333;
		font-weight: 500;
	}

	.status {
		color: #666;
		font-size: 26rpx;
	}

	/* 行程信息 */
	.trip-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.time-box {
		text-align: left;
		// width: 180rpx;
	}

	.time {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
	}

	.duration {
		color: #999;
		font-size: 24rpx;
	}

	.route {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin: 0 40rpx;
		position: relative;

	}

	.station-item {
		display: flex;
		align-items: center;
		width: 100%;
		text-align: left;
		margin: 10rpx 0;
	}

	.station-name {
		color: #333;
		font-size: 28rpx;
	}

	.arrow {
		padding: 20rpx 0;
		color: #ccc;
		font-size: 24rrne;
		border-left: 2rpx solid #D8D8D8;
		margin-left: 10rpx;
	}

	.price-box {
		text-align: right;
		width: 180rpx;
	}

	.price {
		font-size: 36rpx;
		color: #ff5a00;
		font-weight: bold;
	}

	.count {
		color: #999;
		font-size: 24rpx;
	}

	/* 底部栏 */
	.bottom-bar {
		background-color: #F0F8FF;
		margin: 0 30rpx;
		display: flex;
		padding: 26rpx 30rpx;
		justify-content: space-between;
		align-items: center;
		color: #333;
		font-size: 26rpx;
		border-radius: 0rpx 0rpx 24rpx 24rpx;
	}

	.order-time {
		color: #666;
	}

	.total-pay {
		color: #ff5a00;
		font-weight: bold;
	}

	.passenger-info-page {
		background-color: #fff;
		padding: 30rpx;
		margin: 30rpx;
		font-size: 28rpx;
	}

	/* 标题 */
	.title {
		color: #333;
		font-weight: bold;
		margin-bottom: 30rpx;
		font-size: 32rpx;
	}

	/* 乘客列表 */
	.passenger-list {
		margin-bottom: 30rpx;
	}

	/* 单个乘客卡片 */
	.passenger-card {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		border-bottom: 2rpx solid #EBEBEB;

	}

	/* 姓名 + 票种 */
	.name-section {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.ticket-type {
		margin-left: 10rpx;
		padding: 4rpx 12rpx;
		background: #e6f7ff;
		color: #0066cc;
		border-radius: 4rpx;
		font-size: 24rpx;
	}

	/* 身份证号 */
	.id-number {
		color: #666;
		margin-bottom: 20rpee;
		font-size: 26rpx;
	}

	/* 二维码区域 */
	.qrcode-area {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-bottom: 20rpx;
	}

	.qrcode-icon {
		width: 56rpx;
		height: 56rpx;
		margin-right: 10rpx;
		margin-bottom: 20rpx;
	}

	.qrcode-text {
		color: #999;
		font-size: 24rpx;
	}

	/* 座位信息 */
	.seat-info {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		height: 74rpx;
		background: #F8F9FB;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		gap: 20rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	.info-item {
		color: #333;
		font-size: 26rpx;
	}

	/* 提示栏 */
	.notice-bar {
		background: #fff;
		border-radius: 16rpx;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #333;
		font-size: 26rpx;
	}

	.notice-item {
		display: flex;
		align-items: center;
	}

	.icon {
		margin-right: 8rpx;
		color: #999;
	}

	.arrow1 {
		color: #0066cc;
		margin-left: 8rpx;
	}

	.check-info-page {
		background-color: #fff;
		margin: 30rpx;
		padding: 30rpx;
		font-size: 28rpx;
	}

	/* 标题栏 */
	.title-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		border-bottom: 1rpx solid #e5e5e5;
		padding-bottom: 16rpx;
		cursor: pointer;
	}

	.title {
		color: #333;
		font-weight: bold;
		font-size: 32rpx;
	}

	.collapse-btn {
		color: #666;
		font-size: 24rpx;
		transition: transform 0.3s ease;
	}

	.rotate {
		transform: rotate(180deg);
	}

	/* 内容区域 */
	.content-area {
		background: #fff;
		border-radius: 16rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.info-item {
		display: flex;
		margin-bottom: 20rpx;
		line-height: 1.6;
	}

	.label {
		width: 120rpx;
		color: #333;
		font-weight: 500;
	}

	.value {
		flex: 1;
		color: #666;
		font-size: 26rpx;
	}

	.pickup-guide-page {
		background-color: #fff;
		padding: 30rpx;
		margin: 30rpx;
		font-size: 28rpx;
		margin-bottom: 160rpx;
	}

	/* 标题 */
	.title {
		color: #333;
		font-weight: bold;
		margin-bottom: 30rpx;
		font-size: 32rpx;
	}

	/* 地址卡片 */
	.address-card {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	/* 地址内容 */
	.address-content {
		display: flex;
		align-items: center;
		flex: 1;
		margin-right: 20rpx;
	}

	.location-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}

	.address-text {
		display: inline-block;
		max-width: 80%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #333;
		font-size: 28rpx;

	}

	/* 操作按钮组 */
	.action-buttons {
		width: 20%;
		display: flex;
		gap: 20rpx;
	}

	/* 按钮样式 */
	.nav-btn,
	.call-btn {
		width: 120rpx;
		border: none;
		border-radius: 30rpx;
		color: #333;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 0;
		cursor: pointer;
	}

	.nav-btn {
		color: #333;
	}

	.btn-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 8rpx;
	}

	.bottom-bar-s {
		width: 750rpx;
		height: 176rpx;
		background: #FFFFFF;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.bottom-bar-s .bar-price {
		font-weight: 600;
		color: #FF5405;
	}

	.bar-btn {
		width: 220rpx;
		height: 76rpx;
		line-height: 76rpx;
		background: #FFFFFF;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		text-align: center;
	}

	.cancel-btn {
		background: #FFFFFF;
		border: 2rpx solid var(--primary-color);
		color: var(--primary-color);
		margin-right: 40rpx;
	}

	.pay-btn {
		background: var(--but-color-line);
		color: #FFFFFF;
	}

	.pay-popup {
		padding: 32rpx;
		background: #fff;
	}

	.pay-header {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		padding-bottom: 24rpx;
	}

	.pay-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}

	.close-icon {
		position: absolute;
		right: 0;
		width: 32rpx;
		height: 32rpx;
	}

	.pay-amount {
		text-align: center;
		padding: 40rpx 0;
		border-bottom: 1rpx solid #eee;

		.label {
			font-size: 24rpx;
			color: #999;
			margin-bottom: 16rpx;
			display: block;
		}

		.price {
			display: flex;
			justify-content: center;
			align-items: baseline;

			.unit {
				font-size: 32rpx;
				color: #ff5405;
				margin-right: 6rpx;
			}

			.num {
				font-size: 56rpx;
				font-weight: 700;
				color: #ff5405;
			}
		}
	}

	.pay-method {
		margin-top: 32rpx;

		.method-title {
			font-size: 28rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 20rpx;
		}

		.method-item {
			display: flex;
			align-items: center;
			background: #f8f9fb;
			padding: 24rpx;
			border-radius: 16rpx;
			margin-top: 20rpx;

			.wx-icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 20rpx;
			}

			.method-name {
				flex: 1;
				font-size: 28rpx;
				color: #333;
			}

			.checked-icon {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}

	.pay-btn-s {
		margin-top: 48rpx;
		height: 96rpx;
		background: var(--but-color-line);
		border-radius: 48rpx;
		text-align: center;
		line-height: 96rpx;
		font-size: 32rpx;
		color: #fff;
		font-weight: 600;
	}

	.cancel-btn-text {
		line-height: 96rpx;
		height: 96rpx;
		text-align: center;
		margin-top: 24rpx;
		font-size: 32rpx;
		border-radius: 60rpx;
		border: 2rpx solid var(--primary-color);
		color: var(--primary-color);
	}

	.refund-popup {
		padding: 32rpx;
	}

	.refund-header {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin-bottom: 24rpx;
	}

	.refund-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}

	.close-x {
		position: absolute;
		right: 0;
		font-size: 40rpx;
		color: #999;
	}

	.refund-section {
		margin-bottom: 32rpx;
	}

	.section-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 20rpx;
	}

	.fee-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 36rpx;
		font-size: 26rpx;
		color: #666;
	}

	.fee-item.total {
		margin-top: 12rpx;
	}

	.fee-label {
		width: 180rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.fee-value {
		font-weight: 400;
		font-size: 28rpx;
		color: #666666;
	}

	.refund-desc {
		font-weight: 400;
		font-size: 28rpx;
		color: #666666;
		line-height: 1.6;
	}

	.refund-btn {
		height: 88rpx;
		background: var(--but-color-line);
		border-radius: 44rpx;
		text-align: center;
		font-weight: 400;
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 88rpx;
	}

	.s-line {
		width: 4rpx;
		height: 26rpx;
		background: var(--primary-color);
		border-radius: 0rpx 4rpx 4rpx 0rpx;
		margin-right: 16rpx;
	}

	.confirm-modal {
		width: 570rpx;
		height: 332rpx;
		background: linear-gradient(180deg, #C8FFFD 0%, #FFFFFF 30%);
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		padding: 48rpx 50rpx 0;
		box-sizing: border-box;
	}

	.confirm-title {
		text-align: center;
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 24rpx;
	}

	.confirm-content {
		text-align: center;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 48rpx;
	}

	.confirm-actions {
		display: flex;
		justify-content: space-between;
	}

	.confirm-actions .btn {
		width: 220rpx;
		height: 72rpx;
		line-height: 72rpx;
		text-align: center;
		border-radius: 48rpx;
		font-size: 28rpx;
	}

	.confirm-actions .cancel {
		border: 2rpx solid var(--primary-color);
		color: var(--primary-color);
		background: #fff;
	}

	.confirm-actions .confirm {
		background: var(--but-color-line);
		color: #fff;
	}

	.refund-btn-s {
		width: 172rpx;
		height: 64rpx;
		line-height: 64rpx;
		background: #FFFFFF;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		border: 2rpx solid var(--primary-color);
		color: var(--primary-color);
		font-weight: 500;
		font-size: 28rpx;
		text-align: center;
	}

	.refund-btn-s-box {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		margin-top: 20rpx;
	}
	
	/* ===== 固定头部 ===== */
	.fixed-header {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100%;
	  z-index: 100;
	  // background: #d1e5f9;
	  background: transparent;
	}
	
	/* 状态样式 */
	.status-0 {
		color: #005fee;
	}
	
	.status-1,
	.status-2,
	.status-4 {
		color: #333;
	}
	
	.status-3 {
		color: #008042;
	}
	
	.status-4 {
		color: #999;
	}
	
	
	.m-t-100 {
		margin-top: 110rpx;
	}
	
	.qr-modal {
	  width: 620rpx;
	  background: #fff;
	  border-radius: 24rpx;
	  padding: 36rpx 32rpx 28rpx;
	  box-sizing: border-box;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}
	
	.qr-title {
	  font-size: 32rpx;
	  font-weight: 600;
	  color: #333;
	  margin-bottom: 28rpx;
	}
	
	.qr-desc {
	  margin-top: 20rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  color: #666;
	  font-size: 26rpx;
	  line-height: 1.6;
	}
	
	.qr-name {
	  color: #333;
	  font-weight: 600;
	}
	
	.qr-actions {
	  margin-top: 28rpx;
	  width: 100%;
	  display: flex;
	  justify-content: space-between;
	}
	
	.qr-btn {
	  width: 270rpx;
	  height: 76rpx;
	  line-height: 76rpx;
	  text-align: center;
	  border-radius: 48rpx;
	  border: 2rpx solid $color;
	  color: $color;
	  background: #fff;
	  font-size: 28rpx;
	}
	
	.qr-btn.primary {
	  background: $bgLgColor;
	  color: #fff;
	}

</style>