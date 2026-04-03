<template>
	<view class="contant" :data-theme="pageTheme" >
		<!-- <up-navbar title="选择ETC卡" bgColor="none" @leftClick="leftClick" placeholder :fixed="false"></up-navbar> -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="选择ETC卡" bgColor="transparent" @leftClick="leftClick" placeholder
					:fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<!-- <view class="backImg" ></view> -->
		<view class="etc-cards">
			<view class="tex32_33_b base-tit" v-if="type=='make'">请选择要开票的ETC卡</view>
			<view class="card" v-for="(item,index) in etcCards" :key="index" @click="changeCard(index)">
				<view :class="[(item.status==2 ||item.status==3)?'gray-bg':'']"
					:style="{borderRadius: type!='title'?'':'10rpx'}">
					<view>{{item.plateNumStr}}</view>
					<view>
						<view>
							<text>{{item.cardType==2?'储值':'记账'}}卡：</text>
							<text>{{item.cardIdStr}}</text>
						</view>
						<view>
							<text>卡状态：</text>
							<text>{{item.statusStr}}</text>
						</view>
					</view>
					<view>{{item.cardTypeStr}}</view>
				</view>
				<view v-if="type!='title'">
					<view>
						<view class="tex24_66">关联抬头名称：</view>
						<view class="use-view">
							<view :class="[item.titleId?'tex24_33 texNoWrap':'tex24_66']">
								{{item.titleId?item.titleName:'无'}}
							</view>
							<block v-if="!type">
								<block v-if="item.titleId">
									<view class="use-btn" @click="goDetail(item.titleId)">
										<image class="add" :src="`${imgUrl}card-edit-icon.png`" mode="" />
									</view>
								</block>
								<block v-else>
									<view class="use-btn" @click="goHead(item.cardId)">
										<image class="add" :src="`${imgUrl}card-add-icon.png`" mode="" />
										<text>添加抬头</text>
									</view>
								</block>
							</block>
						</view>
					</view>
					<view @click="unBind(item.cardId)" v-if="type!='make' && type!='my'">解绑</view>
					<view :class="['image',truthIndex==index?'no-border':'']" v-else>
						<image :src="`${imgUrl}bindetc-truth.png`" v-if="truthIndex==index" />
					</view>
				</view>
			</view>
			<view class="no-cont" v-if="!etcCards.length && loadingShow">
				<image :src="`${imgUrl}no-etc-cont-icon.png`" mode="" />
				<text>暂未{{type=='title'?'相关关联ETC卡':'绑定ETC卡，去绑定吧'}}~</text>
				<text @click="bind" v-if="type=='make'">去绑定</text>
			</view>
		</view>

		<view class="btn-view"></view>
		<view class="btn" @click="bind"
			v-if="type!='make' && type!='my' && etcCards.length<5 && type!='title' && loadingShow">
			<view>绑定ETC卡</view>
		</view>
		<view class="btn" @click="next" v-if="!noContShow && (type=='make' || type=='my') && loadingShow">
			<view>下一步</view>
		</view>
		<etc-login v-if="layerShow" @closePop="closePop" @loginSuc="loginSuc" :phone='phone'></etc-login>
		<!-- <etc-login @closePop="closePop" @loginSuc="loginSuc" :phone='phone'></etc-login> -->
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
	import { onLoad, onShow, onPageScroll } from '@dcloudio/uni-app';
	import EtcLogin from './components/EtcLogin.vue';
	import { imgUrl } from '@/config';
	import { etcInvoice, getTicketId } from '@/api/etcInvoice';
	import { CurrentPage, showAlert2, showToast, showToastSuccess, showLoading, hideLoading, formatPlateNum, formatBankCardNumWithMaskNew, formatCardTypeStr, formatCardStatusStr } from '@/utils/util'
	import { useAppStore } from '@/store/modules/app';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const appStore = useAppStore();
	// const isLogin = ref(appStore.checkLogin());
	const isLogin = computed(() => {
		return appStore.checkLogin()
	})
	// 定义页面参数类型
	interface PageOptions {
		type ?: string
		titleId ?: string
	}

	// 获取页面参数
	const options = defineProps<PageOptions>()
	// 定义etcUser类型
	interface EtcUser {
		EtcUser ?: string
		mobile ?: string
	}
	// 定义etcUser类型
	interface EtcCards {
		EtcUser : string
		mobile : string
		cardTypeStr ?: string
		statusStr ?: string
		plateNumStr ?: string
		cardType ?: string | number
		cardIdStr ?: string
		status ?: string | number
		titleId ?: string
		titleName ?: string
		cardId ?: string
	}
	const etcUser = ref<EtcUser>({});
	const etcCards = ref<Array<EtcCards>>([]);
	const type = ref<string>('');
	const truthIndex = ref<number>(-1);
	const noContShow = ref<boolean>(false);
	const titleId = ref<string>('');
	const layerShow = ref<boolean>(false);
	const style = ref<string>('background: transparent')
	const phone = ref('')
	const loadingShow = ref(false);
	// 页面加载
	onLoad((options) => {
		type.value = options.type || ''
		titleId.value = options.titleId || ''
		const token = uni.getStorageSync('Token');
		// #ifdef APP-PLUS
		phone.value = parseToken(token).member_phone
		//#endif
		// #ifdef MP-WEIXIN || APP-HARMONY
		phone.value = parseTokens(token).member_phone
		//#endif   
		uni.setStorageSync('phoneEtc', phone.value)
	})
	//app
	const parseToken = (token) => {
		if (!token) return null;

		try {
			// JWT 由三部分组成：header.payload.signature
			const payloadBase64 = token.split('.')[1];
			// Base64Url 解码
			const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
			return JSON.parse(payloadJson);
		} catch (e) {
			console.error('Token 解析失败:', e);
			return null;
		}
	}
	//小程序
	const parseTokens = (token) => {
		if (!token) return null;

		try {
			const payloadBase64 = token.split('.')[1];
			if (!payloadBase64) return null;

			const buffer = wx.base64ToArrayBuffer(payloadBase64);
			const uint8Arr = new Uint8Array(buffer);

			let binary = '';
			for (let i = 0; i < uint8Arr.length; i++) {
				binary += String.fromCharCode(uint8Arr[i]);
			}

			const payloadString = decodeURIComponent(escape(binary));
			return JSON.parse(payloadString);
		} catch (e) {
			console.error('Token 解析失败:', e);
			return null;
		}
	}
	const getTicketIdFun = () => {
		var params = {
			userType: '1',
			mobile: phone.value
		}
		getTicketId(params).then(res => {
			if (res.data) {
				layerShow.value = false
				var params = {
					serverUrl: 'getTicketId',
					mobile: phone.value
				}
				// showLoading('鉴权中')
				console.log('2222222222222222222222222222');
				let result = {
					ticketId: res.data,
					mobile: phone.value
				}
				etcUser.value = result
				etcCards.value = []
				appStore.updateEtcUserInfo(result)
				if (type.value == 'title') {
					getTitleCard()
				} else {
					getEtcCard(1)
				}
			} else {
				layerShow.value = true
			}
		}).catch(err => {
			showToast(err)
			hideLoading()
		})
	}

	// 页面显示
	onShow(() => {
		checkUser()
	})

	// 页面滚动监听 (UniApp 提供 onPageScroll 钩子)
	onPageScroll((e) => {
		// console.log(e) // 原代码中为空，保留
		style.value = e.scrollTop > 0 ? 'background:#fff' : 'background: transparent'
	})
	// 检查用户登录状态
	const checkUser = () => {
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
		} else {
			console.log("----------------");
			getTicketIdFun()
		}
	}
	// 切换选中的ETC卡
	const changeCard = (index : number) => {
		console.log('090909090090,', etcCards.value[index]);
		if (type.value == 'make' || type.value == 'my') {
			truthIndex.value = index
		}
	}

	// 返回首页
	const goBack = () => {
		uni.reLaunch({
			url: `/pages/home/home`,
		})
	}

	// 下一步操作
	const next = () => {
		const truthIndexVal = truthIndex.value
		if (truthIndexVal < 0) {
			showToast('请先选择一张ETC卡')
			return
		}

		const selectedCard = etcCards.value[truthIndexVal]
		const cardId = selectedCard.cardId
		const carNum = selectedCard.plateNum
		const cardType = selectedCard.cardType
		const titleIdCard = selectedCard.titleId
		if (!titleIdCard) {
			uni.navigateTo({
				url: `/pages_A/etcInvoice/headIndex?type=bind&cardType=${cardType}&carNum=${carNum}&id=${cardId}`,
			})
			return
		}
		if (type.value === 'make') {
			// if (!titleIdCard) {
			// 	uni.navigateTo({
			// 		url: `/pages_A/etcInvoice/headIndex?type=bind&cardType=${cardType}&carNum=${carNum}&id=${cardId}`,
			// 	})
			// 	return
			// }
			// 注意：原代码中 if (type == 'make') 出现了两次，逻辑可能有误。这里按原逻辑保留。
			const successData = {
				cardId,
				carNum,
				cardType,
			}
			uni.setStorageSync('successData', successData)
			uni.navigateTo({
				url: `/pages_A/etcInvoice/makeIndex?id=${cardId}&car=${carNum}&cardtype=${cardType}`,
			})
		} else {
			uni.navigateTo({
				url: `/pages_A/invoice/index?id=${cardId}&car=${carNum}&cardtype=${cardType}`,
			})
		}
	}

	// 跳转到抬头信息页
	const goHead = (id) => {
		// const id = e.currentTarget.dataset.id
		const filter = etcCards.value.filter((item) => item.cardId === id)
		if (!type.value) {
			uni.navigateTo({
				url: `/pages_A/invoice/invoiceTitle?type=bind`,
			})
			return
		}
		uni.navigateTo({
			url: `/pages_A/invoice/invoiceTitle?type=bind&cardType=${filter[0].cardType}&carNum=${filter[0].plateNum}&id=${id}`,
		})
	}

	// 跳转到详情页
	const goDetail = (titleId) => {
		const filtered = etcCards.value.filter((item) => item.titleId === titleId)
		console.log('titleId', titleId)
		console.log('etcCards', etcCards.value)
		console.log('filtered', filtered)
		if (filtered.length > 0) {
			uni.setStorageSync('updateTitle', filtered[0])
		}
		uni.navigateTo({
			url: '/pages_A/tollInvoice/association',
		})
	}

	// 关闭弹窗
	const closePop = () => {
		layerShow.value = false
	}

	// 登录成功回调
	const loginSuc = (res : { detail : Record<string, any> }) => {
		etcUser.value = res.detail
		etcCards.value = []
		getTicketIdFun()
		if (type.value === 'title') {
			getTitleCard()
		} else {
			getEtcCard(1)
		}
	}

	// 获取抬头关联的ETC卡列表
	const getTitleCard = async () => {
		const params = {
			serverUrl: 'appTitleCardListRequest',
			titleId: titleId.value,
			pageNum: 1,
			pageSize: 1000,
		}

		showLoading()
		const res = await etcInvoice(params);
		try {
			loadingShow.value = true
			hideLoading()
			let cardItems = res.data.items || []
			if (cardItems.length > 0) {
				cardItems = cardItems.map((item : Record<string, any>) => {
					return {
						...item,
						plateNumStr: formatPlateNum(item.plateNum),
						cardIdStr: formatBankCardNumWithMaskNew(item.cardId),
						cardTypeStr: formatCardTypeStr(item.cardType),
						statusStr: formatCardStatusStr(item.status),
					}
				})
			}
			etcCards.value = cardItems

			if (etcCards.value.length === 0) {
				noContShow.value = true
			}
		} catch (msg : any) {
			hideLoading()
			if (msg === 'etcTokenLoad') {
				// layerShow.value = true // 原代码被注释
			} else {
				showToast(msg)
			}
		}


	}

	// 获取用户ETC卡列表 (递归)
	const getEtcCard = async (userType : number) => {
		if (userType > 2) return

		const params = {
			serverUrl: 'appCardListRequest',
			mobile: etcUser.value.mobile,
			userType: String(userType),
			cardIdQueryStr: '',
			plateNumQueryStr: '',
		}

		// showLoading()
		const res = await etcInvoice(params);
		try {
			hideLoading()
			let cardItems = res.data.items || []
			loadingShow.value = true
			if (cardItems.length > 0) {
				cardItems = cardItems.map((item : Record<string, any>) => {
					return {
						...item,
						plateNumStr: formatPlateNum(item.plateNum),
						cardIdStr: formatBankCardNumWithMaskNew(item.cardId),
						cardTypeStr: formatCardTypeStr(item.cardType),
						statusStr: formatCardStatusStr(item.status),
					}
				})
			}
			etcCards.value = [...etcCards.value, ...cardItems]

			if (userType === 2 && etcCards.value.length === 0) {
				noContShow.value = true
			}
			getEtcCard(userType + 1) // 递归调用
		} catch (msg : any) {
			hideLoading()
			if (msg === 'etcTokenLoad') {
				layerShow.value = true // 原代码被注释
			} else {
				showToast(msg)
			}
		}
	}

	// 跳转到绑定ETC页面
	const bind = () => {
		uni.navigateTo({
			url: './bindEtc?from=list',
		})
	}

	// 解绑ETC卡
	const unBind = (cardId : string) => {
		const id = cardId

		showAlert2('ETC卡解绑', '解绑后，将不能继续开票，确定解绑该ETC卡吗？', true, '取消', '确认', () => {
			var params = {
				serverUrl: 'appCardUnbindRequest',
				cardId: id,
			}
			showLoading()
			etcInvoice(params).then(res => {
				let newArr = etcCards.value
				let spIndex = newArr.findIndex(item => item.cardId == id)
				newArr.splice(spIndex, 1)
				etcCards.value = newArr
				if (newArr.length == 0) {
					noContShow.value = true
				}
				showToastSuccess('解绑成功')
			}).catch(err => {
				hideLoading()
				if (err == 'etcTokenLoad') {
					layerShow.value = true
				} else {
					showToast(err)
				}
			})
		}, () => { })

	}

	const leftClick = () => {
		uni.navigateBack({
			delta: 1,
			fail: () => {
				uni.navigateTo({
					url: "/pages/index/index"
				})
			}
		})
	}
</script>

<style lang="scss">
	.contant{
		width: 100vw;
		background: var(--head-color);
	}
	.backImg {
		width: 750rpx;
		height: 412rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.etc-cards {
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
		margin-top: 40rpx;
	}

	.etc-cards .card {
		width: 100%;
		/* height: 266rpx; */
		background-color: #ffffff;
		border-radius: 0rpx 0rpx 10rpx 10rpx;
		display: flex;
		flex-direction: column;
		margin-bottom: 15rpx;
		border-radius: 10rpx;
	}

	.etc-cards .card>view:nth-child(1) {
		width: 100%;
		height: 186rpx;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/my-cards-has-bg.png') no-repeat;
		background-size: 100% 186rpx;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-top: 22rpx;
		padding-left: 22rpx;
		box-sizing: border-box;
	}

	.etc-cards .card>view:nth-child(1)>view:nth-child(1) {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
	}

	.etc-cards .card>view:nth-child(1)>view:nth-child(2) {
		display: flex;
		flex-direction: column;
	}

	.etc-cards .card>view:nth-child(1)>view:nth-child(2)>view {
		display: flex;
		align-items: center;
		margin-bottom: 14rpx;
	}

	.etc-cards .card>view:nth-child(1)>view:nth-child(2)>view>text {
		font-size: 24rpx;
		color: #333333;
	}


	.etc-cards .card>view:nth-child(1)>view:nth-child(2)>view>text:nth-child(2) {
		font-weight: bold;
	}

	.etc-cards .card>view:nth-child(1)>view:nth-child(3) {
		width: 112rpx;
		height: 40rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		position: absolute;
		top: 12rpx;
		right: 12rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 22rpx;
		color: var(--primary-color);
		font-weight: bold;
	}

	.gray-bg {
		background-image: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/my-cards-gray-bg.png') !important;
		background-size: 100% 186rpx;
		background-repeat: no-repeat;
	}

	.etc-cards .card>view:nth-child(2) {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 22rpx;
		box-sizing: border-box;
	}

	.etc-cards .card>view:nth-child(2)>view:nth-child(1) {
		flex: 1;
		display: flex;
		align-items: center;
	}


	.etc-cards .card>view:nth-child(2)>view:nth-child(2) {
		width: 80rpx;
		height: 40rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		border: solid 1rpx var(--primary-color);
		box-sizing: border-box;
		line-height: 40rpx;
		text-align: center;
		font-size: 24rpx;
		color: var(--primary-color);
	}

	.etc-cards .card>view:nth-child(2) .image {
		width: 36rpx !important;
		height: 37rpx !important;
		border: solid 1rpx #999 !important;
		border-radius: 100% !important;
		box-sizing: border-box;
	}



	.etc-cards .card>view:nth-child(2) .no-border {
		border: 0 !important;
	}

	.etc-cards .card>view:nth-child(2) .image image {
		width: 36rpx;
		height: 37rpx;
	}

	.use-view {
		display: flex;
		align-items: center;
	}

	.use-view>view:nth-child(1) {
		max-width: 220rpx;
	}

	.use-view .use-btn {
		display: flex;
		align-items: center;
	}

	.use-view .use-btn .edit {
		width: 22rpx;
		height: 22rpx;
		margin-left: 8rpx;
	}

	.use-view .use-btn .add {
		width: 28rpx;
		height: 28rpx;
		margin-right: 5rpx;
		margin-left: 20rpx;
	}

	.use-view .use-btn text {
		font-size: 24rpx;
		color: var(--primary-color);
	}

	.btn-view {
		width: 750rpx;
		height: 140rpx;
	}

	.btn {
		position: fixed;
		width: 750rpx;
		height: 140rpx;
		background-color: #ffffff;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn view {
		width: 703rpx;
		height: 91rpx;
		background: var(--primary-color);
		border-radius: 10rpx;
		line-height: 91rpx;
		text-align: center;
		font-size: 32rpx;
		color: #ffffff;
	}

	.no-cont {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 400rpx;
	}

	.no-cont>image {
		width: 180rpx;
		height: 110rpx;
		margin-bottom: 30rpx;
	}

	.no-cont>text:nth-child(2) {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 30rpx;
	}

	.no-cont>text:nth-child(3) {
		width: 220rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: var(--primary-color);
		border-radius: 10rpx;
		text-align: center;
		line-height: 80rpx;
		color: #fff;
		font-size: 28rpx;
	}

	.base-tit {
		margin-bottom: 30rpx;
	}

	::v-deep .u-navbar__content {
		background: none !important;
	}
</style>