<template>
	<view class="integral-detail" :data-theme="pageTheme">
		<view class="headen-box">
			<view class="headen-box-left">
				<image :src="imgUrl + 'img/tabetc.png'" mode=""></image>
				<view class=""> 积分商城 </view>
			</view>
			<view class="headen-box-right" @click="editClick">
				{{ isEdit ? '完成' : '编辑' }}
			</view>
		</view>
		<view v-if="dataList.length == 0">
			<ser-empty></ser-empty>
		</view>
		<view class="card-box" v-for="(item, index) in dataList" :key="index">
			<view v-if="isEdit">
				<view v-if="item.isDel == 0" @click="calkul(index, 1)"
					style="width: 38rpx; height: 38rpx; border-radius: 50%; border: 1px solid #8c8c8c; margin: auto 0">
				</view>
				<u-icon v-if="item.isDel == 1" @click="calkul(index, 0)" name="checkmark-circle-fill"
					:color="themeStore.themeColors.$primaryColor" size="19"></u-icon>
			</view>
			<view v-else>
				<view v-if="item.isChecked == 0" @click="updateCheck(index, 1)"
					style="width: 38rpx; height: 38rpx; border-radius: 50%; border: 1px solid #8c8c8c; margin: auto 0">
				</view>
				<u-icon v-if="item.isChecked == 1" @click="updateCheck(index, 0)" name="checkmark-circle-fill"
					:color="themeStore.themeColors.$primaryColor" size="23"></u-icon>
			</view>
			<image :src="item.spu.picUrl" style="width: 176rpx; height: 176rpx" mode="scaleToFill"></image>
			<view class="card-right">
				<view class="card-right-1">
					{{ item.spu.name }}
				</view>
				<view class="card-right-3" v-if='item.pointActivity.returnActivityType!=4'>
					{{ item.pointActivity ? item.pointActivity.point : '' }} <text>积分</text> </view>
				<view class="card-right-3" v-if='item.pointActivity.returnActivityType==4'>
					{{ item.pointActivity ? item.pointActivity.activityPoint : '' }} <text>积分</text> <text
						style="font-size: 24rpx;color: #666;text-decoration: line-through">{{ item.pointActivity ? item.pointActivity.point : '' }}积分</text>
				</view>
				<view class="card-right-2">
					<u-number-box v-model="item.count" :min="0" :max="99999" @change="numBox($event, item)">
						<!-- 减号按钮 -->
						<template #minus>
							<view class="minus">
								<u-icon name="minus" size="12" color="#000" />
							</view>
						</template>

						<!-- 输入框 -->
						<template #input>
							<text class="input">{{ item.count }}</text>
						</template>

						<!-- 加号按钮 -->
						<template #plus>
							<view class="plus">
								<u-icon name="plus" color="#FFFFFF" size="12" />
							</view>
						</template>
					</u-number-box>
				</view>
			</view>
		</view>
		<view class="bottom-foot">
			<view class="bottom-foot-left">
				<template v-if="isEdit"></template>
				<template v-else></template>
				<view v-if="ischenck == 0" @click="selectAll(true)"
					style="width: 38rpx; height: 38rpx; border-radius: 50%; border: 1px solid #8c8c8c; margin: auto 0">
				</view>
				<u-icon v-if="ischenck == 1" @click="selectAll(false)" name="checkmark-circle-fill"
					:color="themeStore.themeColors.$primaryColor" size="19"></u-icon>
				<view style="margin-left: 30rpx"> 全选 </view>
			</view>
			<view v-if="isEdit" class="bottom-foot-right" @click="delCar"> 删除 </view>
			<view v-else class="bottom-foot-right2">
				<view class="bottom-foot-right2-price">
					<text class="pText1">总价：</text>
					<text class="pText2">{{ totalAmount }}</text>
					<text class="pText3">积分</text>
				</view>
				<view class="bottom-foot-right2-but" @click="payAmount">去结算</view>
			</view>
		</view>
		<up-gap height="90"></up-gap>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		watch
	} from 'vue';
	import {
		imgUrl
	} from '../../config';
	import {
		listShopCar,
		addShopCar,
		deleteIdsShopCar,
		confirmPrShopOrder,
		submitPrShopCarOrder,
		listCartPoints,
		updatecount,
		deleteShopping,
		orderCreate,
		settlement,
	} from '@/api/points';

	import {
		userDefaultAddr
	} from '@/api/user';
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app';
	import {
		toast,
		debounce
	} from '@/utils/common';
	import {
		toNav
	} from '@/utils/route';

	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const isEdit = ref(false);
	const ischenck = ref(0);
	const addrId = ref(null);

	const delTotal = ref(0);
	const dataList = ref([]);
	const value = ref(1);

	const calkul = (i, e) => {
		dataList.value[i].isDel = e;
		xuanzei();
	};
	const xuanzei = () => {
		ischenck.value = dataList.value.every((item) => item.isDel === 1) ? 1 : 0;
	};

	// 总价
	// const totalAmount = computed(() => {
	// 	let arr = dataList.value.filter((item) => item.isChecked == 1);
	// 	if (!arr.length) return 0;
	// 	let num = arr.reduce((acc, cur) => {
	// 		return acc + cur.pointActivity.point * 100 * cur.count;
	// 	}, 0);
	// 	return (num / 100).toFixed(2);
	// });
	const totalAmount = ref(0);
	watch(
		dataList,
		(newVal, oldVal) => {
			console.log('数组变了:', newVal);
			calculate();
		}, {
			deep: true
		}
	);
	const calculate = async () => {
		let arr = dataList.value.filter((item) => item.isChecked == 1);
		if (arr.length === 0) {
			totalAmount.value = 0;
			return;
		}
		let shopCartItem = arr.map((item) => {
			return {
				skuId: item.sku.id,
				count: item.count,
				cartId: item.id,
				pointActivityId: item.pointActivityId,
			};
		});
		let params = {
			items: shopCartItem,
			addressId: addrId.value,
			pointStatus: true,
			deliveryType: 1,
			pointActivityId: 0,
		};
		try {
			const res = await settlement(params);
			console.log('计算的总价数据', res);
			totalAmount.value = res.data.usePoint;
		} catch (err) {
			console.error('计算总价错误', err);
			// uni.showToast({
			// 	title: err.msg,
			// 	icon: 'none',
			// });
		}
	};

	const selectAll = (type) => {
		if (isEdit.value) {
			ischenck.value = type ? 1 : 0;
			if (type) {
				dataList.value = dataList.value.map((item) => {
					item.isDel = 1;
					return item;
				});
			} else {
				dataList.value = dataList.value.map((item) => {
					item.isDel = 0;
					return item;
				});
			}
		} else {
			ischenck.value = type ? 1 : 0;
			if (type) {
				dataList.value = dataList.value.map((item) => {
					item.isChecked = 1;
					return item;
				});
			} else {
				dataList.value = dataList.value.map((item) => {
					item.isChecked = 0;
					return item;
				});
			}
		}
	};
	const editClick = () => {
		isEdit.value = !isEdit.value;
		dataList.value = dataList.value.map((item) => {
			item.isChecked = 0;
			item.isDel = 0;
			return item;
		});
		ischenck.value = 0;
		// let arr = []
		// if (isEdit.value) {
		// 	arr = dataList.value.filter(item => item.isDel == 0)
		// } else {
		// 	arr = dataList.value.filter(item => item.isChecked == 0)
		// }
	};
	const updateCheck = (i, e) => {
		dataList.value[i].isChecked = e;
		xuanzeijs();
	};
	const xuanzeijs = () => {
		ischenck.value = dataList.value.every((item) => item.isChecked === 1) ? 1 : 0;
	};
	// 删除
	const delCar = async () => {
		// if (delTotal.value == 0) return
		console.log('delTotal', dataList.value);
		let arr = dataList.value.filter((item) => item.isDel == 1).map((item) => item.id);
		let ids = arr.join(',');
		if (ids == '') {
			uni.showToast({
				title: '请选择要删除的商品',
				icon: 'none',
			});
			return;
		}
		console.log('传参--------------------', ids);

		const res = await deleteShopping(ids);
		if (res.code === 200) {
			toast('删除成功');
			isEdit.value = false;
			getData();
		} else {
			toast(res.msg);
		}
	};
	//列表
	const getData = async () => {
		const res = await listCartPoints();
		console.log('查询的购物车', res);
		if (res.code === 200) {
			dataList.value = res.data.validList;
			dataList.value = dataList.value.map((item) => {
				item.isChecked = 0;
				item.isDel = 0;
				return item;
			});
			ischenck.value = 0;
		}
	};

	const numBox = debounce(async (e, item) => {
		let params = {
			id: item.id,
			count: e.value,
		};
		if (e.value > 0) {
			const res = await updatecount(params);
			console.log('更新了商品数量', res);
			dataList.value.forEach((i, index) => {
				if (i.id == item.id) {
					i.count = e.value;
				}
			});
		} else {
			deleteShoppingFun(item.id);
		}
	}, 300);
	//删除
	const deleteShoppingFun = async (id) => {
		const res = await deleteShopping(id);
		toast('删除成功');
		getData();
	};
	// 去结算
	const payAmount = debounce(async () => {
		// if (!addrId.value) {
		// 	uni.navigateTo({
		// 		url: '/pages_A/address/index',
		// 	});
		// }
		let arr = dataList.value.filter((item) => item.isChecked == 1);
		console.log('结算的数据', arr);
		if (!arr.length) return toast('请勾选结算商品');
		let shopCartItem = arr.map((item) => {
			return {
				skuId: item.sku.id,
				count: item.count,
				cartId: item.id,
				pointActivityId: item.pointActivityId,
			};
		});
		console.log('传递的参数', shopCartItem);
		toNav(`/pages_A/points/payOrder?obj=${JSON.stringify(shopCartItem)}`);
		// let shopCartItem = arr.map((item) => {
		// 	return {
		// 		skuId: item.sku.id,
		// 		count: item.count,
		// 		cartId: item.id,
		// 		pointActivityId: item.pointActivityId,
		// 	};
		// });
		// let params = {
		// 	items: shopCartItem,
		// 	addressId: addrId.value,
		// 	pointStatus: true,
		// 	deliveryType: 1,
		// 	pointActivityId: 0,
		// };
		// const res = await orderCreate(params);
		// if (res.code == 200) {
		// 	uni.redirectTo({
		// 		url: '/pages_A/order/index',
		// 	});
		// } else {
		// 	toast(res.msg);
		// }
	}, 300);
	const getAddr = async () => {
		try {
			const res = await userDefaultAddr();
			console.log('查询的默认地址', res);
			if (res.code == 200) {
				addrId.value = res.data.addrId;
			}
		} catch (err) {
			console.log(err);
		}
	};
	onShow(() => {
		getData();
		getAddr();
	});
</script>

<style scoped lang="scss">
	.headen-box {
		background-color: #ffffff;
		padding: 33rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 25rpx;

		.headen-box-left {
			display: flex;
			align-items: center;
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;

			image {
				width: 34rpx;
				height: 30rpx;
				margin-right: 15rpx;
			}
		}

		.headen-box-right {
			padding-left: 34rpx;
			border-left: 1rpx solid #cecece;
			font-weight: 500;
			font-size: 24rpx;
			color: #000000;
		}
	}

	.bottom-foot {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		box-sizing: border-box;
		height: 158rpx;
		background: #ffffff;
		padding-top: 18rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;

		.bottom-foot-left {
			display: flex;
			height: 78rpx;
			align-items: center;
			font-weight: 500;
			font-size: 24rpx;
			color: #999999;
		}

		.bottom-foot-right {
			width: 226rpx;
			height: 78rpx;
			background: #ffffff;
			border-radius: 39rpx;
			border: 1px solid #ff3800;
			font-size: 30rpx;
			color: #ff3800;
			line-height: 78rpx;
			text-align: center;
		}

		.bottom-foot-right2 {
			display: flex;
			align-items: center;

			&-but {
				width: 226rpx;
				height: 78rpx;
				background: var(--but-color-line);
				color: #ffffff;
				border-radius: 39rpx;
				font-size: 30rpx;
				line-height: 78rpx;
				text-align: center;
			}

			&-price {
				height: 34rpx;
				display: flex;
				align-items: flex-end;
				margin-right: 20rpx;

				.pText1 {
					font-weight: 500;
					font-size: 24rpx;
					line-height: 24rpx;
					color: #333333;
				}

				.pText2 {
					font-weight: bold;
					font-size: 44rpx;
					line-height: 34rpx;
					color: var(--primary-color);
					margin: 0 6rpx;
				}

				.pText3 {
					font-weight: bold;
					font-size: 24rpx;
					line-height: 24rpx;
					color: var(--primary-color);
				}
			}
		}
	}

	.integral-detail {
		min-height: 100vh;
		padding: 0;
		background: #f1efec;
		box-sizing: border-box;
		margin-bottom: 158rpx;
	}

	.card-box {
		display: flex;
		padding: 30rpx;
		background-color: #ffffff;
		border-radius: 26rpx;
		margin-bottom: 25rpx;
		box-sizing: border-box;

		image {
			width: 176rpx;
			height: 176rpx;
			background: #f5f5f5;
			border-radius: 20rpx;
			margin-right: 28rpx;
			margin-left: 30rpx;
		}

		.card-right {
			width: 450rpx;
			display: flex;
			flex-direction: column;
			position: relative;

			.card-right-1 {
				font-weight: 500;
				font-size: 28rpx;
				color: #000000;
				line-height: 36rpx;
			}

			.card-right-3 {
				margin-top: 33rpx;
				font-weight: bold;
				font-size: 34rpx;
				color: var(--primary-color);

				text {
					font-size: 24rpx;
				}
			}

			.card-right-2 {
				position: absolute;
				right: 0;
				bottom: 0;
				display: flex;

				.minus {
					width: 22px;
					height: 22px;
					border: 1px solid var(--primary-color);
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					box-sizing: border-box;
				}

				.input {
					width: 50px;
					text-align: center;
					font-size: 16px;
				}

				.plus {
					width: 22px;
					height: 22px;
					background: var(--primary-color);
					border-radius: 50%;
					/* #ifndef APP-NVUE */
					display: flex;
					/* #endif */
					justify-content: center;
					align-items: center;
				}
			}
		}
	}
</style>