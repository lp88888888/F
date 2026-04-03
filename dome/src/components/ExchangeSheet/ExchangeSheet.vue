<template>
	<u-popup :show="show" mode="bottom" round="20" closeable closeIcon="close" closeIconPos="top-right" :overlay="true"
		@close="onClose" bgColor="#fff" :safeAreaInsetBottom="false">
		<view class="sheet" :data-theme="pageTheme">
			<!-- 商品信息 -->
			<view class="sheet__header">
				<up-image :src="imgPicUrl" width="200rpx" height="200rpx" radius="12"></up-image>
				<view class="sheet__meta">
					<view class="meta__score">
						<text class="score__num">{{ data.price }}</text>
						<text class="score__unit"> 积分</text>
					</view>
					<!-- <view class="meta__stock">库存：{{ data.stock }}件</view> -->
					<!-- <view class="meta__stock">库存：{{ totalStock }}件</view> -->
					<view class="meta__stock">库存：{{ totalStock }}件</view>
					<!-- <view class="meta__title u-line-1">{{ data.title }}</view> -->
				</view>
			</view>

			<!-- 规格 -->
			<view class="ggBox">
				<view class="ggBox__title">规格</view>
				<view class="ggBox__list">
					<view v-for="item in data.skus" :key="item.id" @click="sukClick(item)">
						<!-- <view v-for="items in item.properties" :key="items.valueName" :class="['ggBox__item', skuId == item.id ? 'gridActive' : '']">
							{{ items.valueName }}
						</view> -->

						<view :class="['ggBox__item', skuId == item.id ? 'gridActive' : '']">{{ handleGginfo(item) }}
						</view>
					</view>
				</view>
			</view>

			<!-- 数量 -->
			<view class="sheet__row">
				<text class="row__label">数量</text>
				<view class="row__num">
					<view class="btn1" :class="{ disabled: qty <= 1 }" @click="dec">－</view>
					<view class="num">{{ qty }}</view>
					<view class="btn2" :class="{ disabled: qty >= maxQty }" @click="inc">＋</view>
				</view>
			</view>

			<!-- 地址 -->
			<!-- <view class="sheet__row sheet__row--addr" @click="chooseAddress" v-if="couponFlag != 1">
				<text class="row__label">收货地址</text>
				<view class="row__addr">
					<text class="row__addr-text u-line-1">
						{{ addressText || '请选择收货地址' }}
					</text>
					<u-icon name="arrow-right" size="18" color="#999" />
				</view>
			</view> -->

			<!-- 底部操作 -->
			<view class="sheet__footer safe-area-inset-bottom">
				<view class="footer__left">
					<!-- <text class="total__num">{{ totalPoints }}</text>
          <text class="total__unit"> 积分</text> -->
				</view>
				<view type="warning" shape="circle" class="footer__btn" :customStyle="{
						height: '78rpx',
						lineHeight: '78rpx',
						background: 'linear-gradient(to bottom,#5AD6D6,#069FA4)',
					}" @click="confirm">
					{{ text }}
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	import { computed, reactive, ref, defineProps, defineEmits } from 'vue';
	import { addCartPoints, orderCreate } from '@/api/points';
	import { toast } from '@/utils/common';
	import { getMemberDeliveryAddress } from '@/api/user';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const show = ref(false);
	const qty = ref(1);
	const maxQty = ref(0);
	const text = ref('加入购物车');
	const list = ref([]);
	const type = ref<any>(1);
	const props = defineProps({
		couponFlag: {
			type: Number,
			default: 0,
		},
		totalStock: {
			type: [Number, String],
			default: 0,
		},
	});
	const data = reactive<any>({
		id: '',
		title: '',
		point: 0,
		v: 0,
		cover: '',
		skus: [],
		type: '',
		price: 0,
	});

	const detailId = ref('');
	const skuKey = ref('');
	const skuId = ref('');
	const skuImg = ref('');
	const skustock = ref(0);
	const returnActivityType = ref(0)
	const activityConfigId = ref('')
	// 地址相关
	const addressId = ref<number | string | null>(null);
	const addressText = ref<string>('');

	const emit = defineEmits(['onSku', 'confirm']);
	const imgPicUrl = ref('')
	// 选择规格
	const sukClick = (item : any) => {
		console.log('---------', item);
		skuId.value = item.id;
		imgPicUrl.value = item.picUrl
		if (returnActivityType.value == 3 || returnActivityType.value == 4) {
			data.price = item.activityPoint || 0;
		} else {
			data.price = item.point || 0;
		}
		skustock.value = item.stock;
		emit('onSku', item);
	};

	// 规格数据
	const handleGginfo = (item) => {
		if (item.properties) {
			const arr = item.properties.map((e) => e.valueName);
			return arr.join(' ');
		}
		return '';
	};

	/**
	 * 拉取默认地址
	 */
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
			const rows = res?.rows || [];
			if (!rows.length) return;

			const defaultItem = rows.find((item : any) => item.defaultFlag == 1) || rows[0];

			const fullAddress = (defaultItem.province || '') + (defaultItem.city || '') + (defaultItem.area || '') + (defaultItem.addr || '');

			addressId.value = defaultItem.addrId || defaultItem.id;
			addressText.value = fullAddress || defaultItem.addr || '';
		} catch (e) {
			console.error('加载默认地址失败：', e);
		}
	};

	// 打开地址列表，选择后回填
	const chooseAddress = () => {
		uni.navigateTo({
			url: '/pages_A/address/index?from=select',
			events: {
				chooseAddressCb(data : { id : string | number; fullAddress : string }) {
					addressId.value = data.id;
					addressText.value = data.fullAddress;
				},
			},
		});
	};
	const campaignId = ref('')
	/** 对外暴露：打开弹窗 */
	const open = (val : any, openType : number, id : string, Type : number, paignId : string) => {
		console.log('open', val, openType, id, Type);
		campaignId.value = paignId
		// 重置数量和规格
		qty.value = 1;
		maxQty.value = val.stock;
		skuImg.value = val.picUrl;
		data.stock = val.stock;
		data.skus = val.skus;
		imgPicUrl.value = val.skus[0].picUrl
		if (Type == 3 || Type == 4) {
			data.price = val.skus[0].activityPoint;
		} else {
			data.price = val.skus[0].point;
		}
		data.type = openType;
		detailId.value = id;
		console.log('ssssssssssssssooooooooooooooooooooiiiiiiiiiiiiiiiiiiii')
		returnActivityType.value = Type;

		if (val.skus.length) {
			skuId.value = val.skus[0].id;
			skustock.value = val.skus[0].stock;
			activityConfigId.value = val.skus[0].activityConfigId
		}

		// 每次打开时重置地址显示，再加载默认地址
		addressId.value = null;
		addressText.value = '';

		loadDefaultAddress();
		console.log(data, 'ssssssssssssssssssss');
		if (openType == 1) {
			text.value = '加入购物车';
		} else {
			text.value = '立即兑换';
		}
		show.value = true;
	};

	const onClose = () => (show.value = false);

	const inc = () => {
		if (qty.value < maxQty.value) qty.value++;
	};
	const dec = () => {
		if (qty.value > 1) qty.value--;
	};

	const totalPoints = computed(() => (data.price || 0) * qty.value);

	/** 点击确定 */
	const confirm = () => {
		if (!skuId.value) {
			uni.showToast({
				title: '请选择规格',
				icon: 'none',
			});
			return;
		}
		if (qty.value > maxQty.value) {
			uni.showToast({
				title: `最多只能兑换${maxQty.value}件`,
				icon: 'none',
			});
			return;
		}
		// if (props.couponFlag != 1) {
		// 	if (data.type != 1 && !addressId.value) {
		// 		toast('请选择收货地址');
		// 		return;
		// 	}
		// }

		// 加入购物车1 支付2
		if (data.type == 1) {
			addCart();
		} else {
			emit('confirm', { count: qty.value, skuId: skuId.value, detailId: detailId.value, type: returnActivityType.value, aid: activityConfigId.value, campaignId: campaignId.value });
			// if (props.couponFlag != 1) {
			// 	emit('confirm', { count: qty.value, skuId: skuId.value, detailId: detailId.value,type:returnActivityType.value,aid:activityConfigId.value });
			// } else {
			// 	submitOrder();
			// }
		}

		onClose();
	};

	/** 调用结算接口并创建支付订单 */
	const submitOrder = async () => {
		let deliveryTypeNew = '';
		if (!skuId.value) return toast('请选择规格');
		if (props.couponFlag != 1) {
			if (!addressId.value) return toast('请选择收货地址');
			deliveryTypeNew = 1;
		} else {
			deliveryTypeNew = 2;
		}

		try {
			const res : any = await addCartPoints({
				count: qty.value,
				skuId: skuId.value,
				pointActivityId: detailId.value,
			});
			let seckillActivityId = ''
			let discountActivityId = ''
			if (returnActivityType.value == 3) {
				seckillActivityId = activityConfigId.value
			}
			if (returnActivityType.value == 4) {
				discountActivityId = activityConfigId.value
			}
			if (res.code == 200) {
				const orderRes : any = await orderCreate({
					items: [
						{
							skuId: skuId.value,
							count: qty.value,
							pointActivityId: detailId.value,
							cartId: res.data,
						},
					],
					pointStatus: true,
					deliveryType: deliveryTypeNew,
					addressId: addressId.value,
					pointActivityId: 0,
					seckillActivityId: seckillActivityId,
					discountActivityId: discountActivityId
				});

				if (orderRes.code === 200) {
					onClose();
					uni.showToast({
						icon: 'success',
						title: '兑换成功',
					});
					setTimeout(() => {
						if (orderRes.data?.returnCouponInfo?.activityType == 1) {
							uni.redirectTo({
								url: '/pages_A/points/fqpaysuccess?name=' + orderRes.data?.returnCouponInfo.couponName,
							});
						} else {
							uni.redirectTo({
								url: '/pages_A/order/index',
							});
						}

					}, 1000);
				} else {
					console.log('ssssssss');
					// toast(orderRes.msg || '创建订单失败');
				}
			} else {
				uni.showToast({ title: res.msg, icon: 'none' });
			}
		} catch (err) {
			if (err.code == 100) {
				// toast(err.msg);
				// #ifdef MP-WEIXIN
				// onClose();
				// setTimeout(() => {
				// 	wx.showToast({ title: err.msg, icon: 'error' });
				// }, 100);
				// #endif
				// #ifdef APP
				// uni.showToast({ title: err.msg, icon: 'error' });
				// #endif
			}
			// #ifdef MP-WEIXIN
			uni.showToast({ title: err.msg, icon: 'none', duration: 4000 });
			// #endif
			// #ifdef APP
			uni.showToast({ title: err.msg, icon: 'none' });
			// #endif
			console.log('订单流程异常：', err.code);
			console.error('订单流程异常：', err);
		}
	};

	// 加入购物车
	const addCart = async () => {
		const res : any = await addCartPoints({
			count: qty.value,
			skuId: skuId.value,
			pointActivityId: detailId.value,
		});
		if (res.code == 200) {
			uni.showToast({ title: '加入购物车成功', icon: 'success' });
			emit('confirm', '');
		} else {
			uni.showToast({ title: res.msg, icon: 'none' });
		}
	};

	/** 暴露方法给父组件 */
	defineExpose({ open, close: onClose });
</script>

<style lang="scss" scoped>
	.ggBox {
		padding: 20rpx;
		box-sizing: border-box;

		.ggBox__title {
			font-size: 28rpx;
			font-weight: 600;
			margin-bottom: 20rpx;
		}

		.ggBox__list {
			display: flex;
			flex-wrap: wrap;
		}

		.ggBox__item {
			display: inline-block;
			font-size: 24rpx;
			line-height: 24rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			padding: 6rpx 15rpx;
			color: #333333;
			background: #f9f9f9;
			border-radius: 16rpx;
			border: 1px solid #ffffff;
		}

		.gridActive {
			background: #fdf9f5;
			border-radius: 16rpx;
			border: 1px solid var(--primary-color);
			color: var(--primary-color);
		}
	}

	.sheet {
		position: relative;
		padding: 40rpx 0 178rpx;

		&__header {
			display: flex;
			gap: 24rpx;
			align-items: center;
			margin-top: 10rpx;
			padding: 0 32rpx 30rpx;
			border-bottom: 1rpx solid #ececec;

			.sheet__meta {
				flex: 1;
				min-width: 0;
			}

			.meta__score {
				display: flex;
				align-items: baseline;

				.score__num {
					font-size: 50rpx;
					font-weight: bold;
					color: var(--primary-color);
				}

				.score__unit {
					font-size: 26rpx;
					color: var(--primary-color);
					margin-left: 10rpx;
					font-weight: bold;
				}
			}

			.meta__stock {
				margin-top: 20rpx;
				font-size: 24rpx;
				color: #999;
			}

			.meta__title {
				margin-top: 8rpx;
				font-size: 28rpx;
				color: #333;
				max-width: 520rpx;
			}
		}

		&__row {
			margin-top: 20rpx;
			padding: 24rpx 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.row__label {
				font-size: 26rpx;
				color: #333;
				font-weight: bold;
			}

			.row__num {
				display: inline-flex;
				align-items: center;

				.btn1 {
					width: 43rpx;
					height: 43rpx;
					background: #f2f2f2;
					border-radius: 50%;
					text-align: center;
					line-height: 43rpx;
					font-size: 34rpx;

					&.disabled {
						color: #bbb;
					}
				}

				.btn2 {
					width: 43rpx;
					height: 43rpx;
					background: var(--but-color-line);
					border-radius: 50%;
					color: #fff;
					text-align: center;
					line-height: 43rpx;
					font-size: 34rpx;
				}

				.num {
					width: 88rpx;
					text-align: center;
					font-size: 26rpx;
					color: #000;
					font-weight: bold;
				}
			}
		}

		&__row--addr {
			border-top: 1rpx solid #f5f5f5;
		}

		.row__addr {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 12rpx;
		}

		.row__addr-text {
			max-width: 420rpx;
			text-align: right;
			font-size: 26rpx;
			color: #666;
		}

		&__footer {
			margin-top: 18rpx;
			padding-top: 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.footer__left {
				display: flex;
				align-items: baseline;

				.total__num {
					font-size: 44rpx;
					color: #ff9600;
					font-weight: bold;
				}

				.total__unit {
					margin-left: 8rpx;
					font-size: 24rpx;
					color: #ff9600;
					font-weight: bold;
				}
			}

			.footer__btn {
				width: 276rpx;
				height: 78rpx;
				background: var(--but-color-line);
				border-radius: 39rpx;
				font-weight: 500;
				font-size: 30rpx;
				color: #ffffff;
				text-align: center;
				line-height: 78rpx;
			}
		}
	}

	.sheet__footer {
		width: 100%;
		height: 158rpx;
		background: #ffffff;
		box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.06);
		position: fixed;
		bottom: 0;
		padding: 0 32rpx;
		box-sizing: border-box;
	}

	.sheet__row {
		margin-top: 0;
	}
</style>