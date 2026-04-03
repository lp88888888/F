<template>
	<up-sticky z-index="8888">
		<view :style="{ background: themeStore.themeColors.$color2 }">
			<up-navbar title="送礼物" bgColor="transparent" @leftClick="toBack" leftIconColor="#000000" placeholder
				:fixed="false" :titleStyle="{ fontWeight: 'bold' }"></up-navbar>
		</view>
	</up-sticky>
	<view class="container" :data-theme="pageTheme">
		<!-- 顶部自定义导航 -->
		<view class="receiver-section">
			<view class="receiver-header" @click="toggleInput">
				<text class="label">送给谁</text>
				<input v-model="friendPhone" placeholder="填写朋友手机号" maxlength="11" type="number" class="phone-input"
					v-if="!isVirtualgoods" />
			</view>
			<view style="height: 200rpx;color: #BDC0BF;margin-top: 16rpx;" >
				<text>出发！带上我的心意，一起解锁美好旅途✨</text>
			</view>
		</view>
		<view class="card address-card" style="border-radius: 20rpx" @click="onChooseAddress" v-if="isVirtualgoods">
			<view class="addr-row">
				<!-- <u-badge text="收" type="warning" :absolute="false" class="m-l-12" /> -->
				<!-- <u-icon name="map" color="#FF9900" size="22" class="m-r-12" /> -->
				<view class="addr-main" v-if="address.addressText">
					<view class="addr-title">{{ address.addressText }}</view>
					<view class="addr-user"> {{ address.consignee }} {{ address.mobile }} </view>
				</view>
				<view class="addr-main" v-else>
					<view class="addr-title">请选择地址</view>
				</view>
				<u-icon name="arrow-right" color="#C0C4CC" size="18" />
			</view>
		</view>
		<view class="goods-item">
			<u-image :src="pointsDetail.productSpuDetailRespVO.picUrl" mode="aspectFill" width="96rpx" height="96rpx"  radius="12rpx" />
			<view class="g-name m-b-5 m-l-20 u-line-2 flex-1">{{ pointsDetail.productSpuDetailRespVO.name }}</view>
			<view class="g-info flex flex-col">
				<view class="g-score">{{ detailsPoint }} 积分</view>
				<view class="g-sub">x 1</view>
			</view>
		</view>
		<!-- 操作按钮 -->
		<view class="action-buttons">
			<button class="pay-btn" @click="onPay">付款并赠送</button>
			<text class="refund-tip">未收下的礼物，将于48小时后自动退款</text>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, computed, onMounted } from 'vue';
	import { onLoad, onPageScroll, onShow } from '@dcloudio/uni-app';
	import { showToastSuccess } from '@/utils/util';
	import { payInfoPrShopCarOrder, detailActivityPoints, tradeordercreate,addCartPoints } from '@/api/points';
	import { getMemberDeliveryAddress } from '@/api/user';
	import { toBack, toRec } from '@/utils/route';
	import { toast, debounce } from '@/utils/common';
	import { imgUrl } from '../../config';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	/** 顶部栏 */
	const friendPhone = ref('')
	const giftImage = '/static/images/gift-ticket.png' // 替换为你的图片路径
	onMounted(() => {

	});
	const pointsDetail = ref({})
	const detailsPoint = ref(null)
	const getDetail = async (id : string) => {
		const res : any = await detailActivityPoints(id);
		console.log('查询的商品数据', res);
		if (res.code == 200) {

			if (res.data.returnActivityType == 3 || res.data.returnActivityType == 4) {
				detailsPoint.value = res.data.activityPoint;
			} else {
				detailsPoint.value = res.data.point;
			}
			pointsDetail.value = res.data;
			isVirtualgoods.value = res.data.productSpuDetailRespVO?.couponFlag != 1
			if(isVirtualgoods.value){
				loadDefaultAddress()
			}

		} else {
			toast(res.msg);
		}
	};
	const isVirtualgoods = ref(true)
	// 选择地址
	const onChooseAddress = () => {
		uni.navigateTo({
			url: '/pages_A/address/index?from=select',
			events: {
				chooseAddressCb(data : { id : string | number; fullAddress : string }) {
					addressId.value = data.id;
					let assobj=uni.getStorageSync('address1')
					const fullAddress = (assobj.province || '') + (assobj.city || '') + (assobj.area || '') + (assobj.addr || '');
					addressId.value = assobj.addrId || assobj.id;
					const addressText = fullAddress || assobj.addr || '';
					address.value= {
						...assobj, 
						addressText: addressText,
					};
					uni.removeStorageSync('address1')
				},
			},
		});
	};
	// const address = computed(() => {
	// 	let item = addArr.value.find((e) => e.addrId == addressId.value);
	// 	console.log('查询的地址信息', item);
	// 	if (!item) {
	// 		addressId.value = '';
	// 		return {};
	// 	}
	// 	const fullAddress = (item.province || '') + (item.city || '') + (item.area || '') + (item.addr || '');
	// 	addressId.value = item.addrId || item.id;
	// 	const addressText = fullAddress || item.addr || '';
	// 	return {
	// 		...item,
	// 		addressText: addressText,
	// 	};
	// });
	const address=ref({})
	const addressId = ref('');
	const addArr = ref([]);
	const loadDefaultAddress = async () => {
		try {
			const userInfo = uni.getStorageSync('userInfo') || {};
			if (!userInfo.id) return;

			const params = {
				memberId: userInfo.id,
				pageNum: 1,
				pageSize: 99,
				status: 1,
			};
			const res : any = await getMemberDeliveryAddress(params);
			console.log('查询的默认地址', res);
			const rows = res?.rows || [];
			addArr.value = rows;
			if (rows.length && !addressId.value) {
				const defaultItem = rows.find((item : any) => item.defaultFlag == 1) || rows[0];
				const fullAddress = (defaultItem.province || '') + (defaultItem.city || '') + (defaultItem.area || '') + (defaultItem.addr || '');
				addressId.value = defaultItem.addrId || defaultItem.id;
				const addressText = fullAddress || defaultItem.addr || '';
				address.value = {
					...defaultItem,
					addressText: addressText,
				};
			}
		} catch (e) {
			console.error('加载默认地址失败：', e);
		}
	};
	const handlePay = debounce(() => {
		onPay()
	}, 600)
	const cartId = ref(null);
	const onPay = async () => {
		console.log('商品详情', pointsDetail.value);
		if (!addressId.value && isVirtualgoods.value) {
			toast('请选择地址');
			return;
		}
		 if(addressId.value){
			 friendPhone.value= address.value.mobile
		 }
		if (!friendPhone.value) {
			toast('请输入手机号');
			return;
		}
		const phoneReg = /^1[3-9]\d{9}$/;
		if (!phoneReg.test(friendPhone.value)) {
			toast('请输入正确的手机号');
			return;
		}
		console.log('商品详情1', pointsDetail.value);
			const res : any = await addCartPoints({
				count: 1,
				skuId: pointsDetail.value.productSpuDetailRespVO.skus[0].id,
				pointActivityId: pointsDetail.value.id,
			});
			cartId.value = res.data;
			console.log('商品详情2', pointsDetail.value);
			goToPay()

	};
	const goToPay = async () => {
		let r = {
			skuId: pointsDetail.value.productSpuDetailRespVO.skus[0].id,
			count: 1,
			pointActivityId: pointsDetail.value.id,
			cartId: cartId.value
		}
		let params = {
			items: [r],
			giftFlag: 1,
			pointStatus: true,
			addressId: address.value.addrId || '',
			receiverPhone: friendPhone.value,
			pointActivityId: 0
		}
		const res : any = await tradeordercreate(params);
		if (res.code == 200) {
			uni.redirectTo({
				url: `/pages_A/points/PaymentSuccessful?id=${shopid.value}&phone=${friendPhone.value}`,
			});
		}
	};
	onShow(() => {
	});
	const shopid = ref('');
	onLoad((e) => {
		shopid.value = e.id;
		getDetail(e.id);
	});
</script>

<style scoped lang="scss">
	/* 地址卡片 */
	.address-card {
		padding: 24rpx;
		border-radius: 0 0 20rpx 20rpx;
		background-color: #fff;
		margin-bottom: 32rpx;

		.addr-row {
			display: flex;
			align-items: flex-start;
		}

		.addr-main {
			flex: 1;
			margin: 0 16rpx;
		}

		.addr-title {
			font-size: 28rpx;
			font-weight: 600;
			color: #333;
			display: flex;
			align-items: center;
		}

		.addr-detail {
			font-size: 28rpx;
			color: #111;
			margin-top: 8rpx;
			line-height: 40rpx;
		}

		.addr-user {
			margin-top: 8rpx;
			font-size: 24rpx;
			color: #666;
		}
	}

	.container {
		min-height: 100vh;
		background: var(--head-color);
		display: flex;
		flex-direction: column;
		padding: 40rpx 32rpx;
		box-sizing: border-box;
	}

	.goods-item {
		display: flex;
		align-items: flex-start;
		padding: 25rpx;
		background-color: #fff;
		border-radius: 16rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

		.g-info {
			align-items: flex-end;

			.g-name {
				font-size: 28rpx;
				line-height: 38rpx;
			}

			.g-sub {
				margin-top: 8rpx;
				font-size: 24rpx;
				color: #999;
			}
		}

		.g-score {
			font-size: 26rpx;
			color: var(--primary-color);
			white-space: nowrap;
		}
	}




	.receiver-section {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 32rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.receiver-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #eee;
	}

	.label {
		display: inline-block;
		font-weight: 600;
		font-size: 36rpx;
		color: #333333;
	}

	.hint {
		font-size: 28rpx;
		color: #999;
	}

	/* 内联输入区域 */
	.input-area {
		padding-top: 20rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.phone-input {
		width: 60%;
		height: 80rpx;
		border-radius: 12rpx;
		font-size: 28rpx;
		text-align: right;
	}

	.confirm-btn {
		width: 100%;
		height: 80rpx;
		background-color: #FFB700;
		color: white;
		border-radius: 12rpx;
		font-size: 32rpx;
		line-height: 80rpx;
	}

	.gift-item {
		background-color: white;
		border-radius: 16rpx;
		padding: 32rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		display: flex;
		align-items: center;
	}

	.gift-img {
		width: 136rpx;
		height: 136rpx;
		border-radius: 8rpx;
		margin-right: 24rpx;
	}

	.gift-info {
		flex: 1;
	}

	.gift-name {
		font-size: 32rpx;
		color: #333;
		line-height: 1.4;
	}

	.gift-points {
		font-size: 28rpx;
		color: #ff6600;
		margin: 8rpx 0;
	}

	.gift-count {
		font-size: 24rpx;
		color: #999;
	}

	.action-buttons {
		text-align: center;
		margin-top: 400rpx;
	}

	.pay-btn {
		width: 334rpx;
		height: 70rpx;
		background: linear-gradient(270deg, #E89C56 0%, #F9D87C 100%);
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		font-weight: 500;
		font-size: 28rpx;
		color: #4D2402;
		margin-bottom: 35rpx;
	}

	.refund-tip {
		font-size: 28rpx;
		color: #909599;
		line-height: 1.4;
	}
</style>