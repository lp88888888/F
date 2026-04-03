<template>
	<view class="integral-detail">
		<!-- <cos-header title='购物车' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="90"></cos-header> -->
		<up-navbar title="购物车" bgColor="#FFFFFF" @leftClick="toBack" placeholder :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="headen-box">
			<view class="headen-box-left">
				<image :src="imgUrl+'img/tabetc.png'" mode=""></image>
				<view class="">
					直营零售
				</view>
			</view>
			<view class="headen-box-right" @click="editClick">
				{{isEdit?'完成':'编辑'}}
			</view>
		</view>
		<view class="card-box" v-for="(item,index) in dataList" :key="index">
			<view v-if="isEdit">
				<view v-if="item.isDel==0" @click="item.isDel=1"
					style="width: 38rpx;height: 38rpx;border-radius: 50%;border:1px solid #8C8C8C;margin:  auto 0;">
				</view>
				<u-icon v-if="item.isDel==1" @click="item.isDel=0" name="checkmark-circle-fill" color="#FF9600"
					size="19"></u-icon>
			</view>
			<view v-else>
				<view v-if="item.isChecked==0" @click="item.isChecked=1"
					style="width: 38rpx;height: 38rpx;border-radius: 50%;border:1px solid #8C8C8C;margin:  auto 0;">
				</view>
				<u-icon v-if="item.isChecked==1" @click="item.isChecked=0" name="checkmark-circle-fill" color="#FF9600"
					size="19"></u-icon>
			</view>

			<image :src="item.dimServiceAreaMerchantProduct?item.dimServiceAreaMerchantProduct.imgUrl:''" style="width: 176rpx; height: 176rpx;"
				mode="scaleToFill"></image>
			<view class="card-right">
				<view class="card-right-1">
					{{item.dimServiceAreaMerchantProduct?item.dimServiceAreaMerchantProduct.productName:''}}
				</view>
				<view class="card-right-3">
					{{item.dimServiceAreaMerchantProduct?item.dimServiceAreaMerchantProduct.sellingPrice:''}} <text>元</text>
				</view>
				<view class="card-right-2">
					<u-number-box v-model="item.count" :min="0" :max="99999" @change="numBox($event,item)">
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
		<ser-empty v-if="!dataList.length" text="购物车为空"></ser-empty>
		<view class="bottom-foot">
			<view class="bottom-foot-left">
				<template v-if="isEdit"></template>
				<template v-else></template>
				<view v-if="ischenck==0" @click="selectAll(true)"
					style="width: 38rpx;height: 38rpx;border-radius: 50%;border:1px solid #8C8C8C;margin:  auto 0;">
				</view>
				<u-icon v-if="ischenck==1" @click="selectAll(false)" name="checkmark-circle-fill" color="#FF9600"
					size="19"></u-icon>
				<view style="margin-left: 30rpx;">
					全选
				</view>
			</view>
			<view v-if="isEdit" class="bottom-foot-right" @click="delCar">
				删除 ({{ delTotal }})
			</view>
			<view v-else class="bottom-foot-right2">
				<view class="bottom-foot-right2-price">
					<text class="pText1">总价：</text>
					<text class="pText2">{{totalAmount}}</text>
					<text class="pText3">元</text>
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
		getCarlist,
		addShopCar,
		postshopremoveItem,
		confirmPrShopOrder,
		submitPrShopCarOrder,
		postshopCarPriceCompute,
		postaddcar,
		getShopOrderlist
	} from '@/api/points';
	import {
		userDefaultAddr
	} from '@/api/user';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		toast,
		debounce
	} from '@/utils/common';
	import {
		toNav,
		toBack
	} from '@/utils/route';
	const isEdit = ref(false);
	const ischenck = ref(0)
	const addrId = ref(null);

	const dataList = ref([]);
	const value = ref(1);
	// 总价
	// const totalAmount = computed(()=>{
	// 	let total = 0;
	// 	for(let item of dataList.value){ 
	// 		if(item.isChecked==1){
	// 			total += item.skuPriceFee * item.count;
	// 		}
	// 	}
	// 	return total;
	// })
	const totalAmount = ref(0)
	watch(dataList, (newVal, oldVal) => {
		console.log('数组变了:', newVal)
		setTimeout(() => {
			calculate()
			fanxuan()
		}, 1000) // 1000 毫秒 = 1 秒
	}, {
		deep: true
	})
	const fanxuan = () => {
		if (isEdit) {
			if (dataList.value.length === 0) {
				ischenck.value = 0; // 空列表，不选中
			} else {
				ischenck.value = dataList.value.every(item => item.isChecked === 1) ? 1 : 0;
			}
		} else {
			if (dataList.value.length === 0) {
				ischenck.value = 0; // 空列表，不选中
			} else {
				ischenck.value = dataList.value.every(item => item.isDel === 1) ? 1 : 0;
			}
			// dataList.value.forEach((item, index) => {
			// 	if (item.isDel == 0) {
			// 		ischenck.value = 0
			// 	} else {
			// 		ischenck.value = 1
			// 	}
			// })
		}

	}

	const delTotal = computed(() => {
		let arr = dataList.value.filter(item => item.isDel == 1);
		return arr.length
	})
	const selectAll = (type) => {
		if (isEdit.value) {
			ischenck.value = type ? 1 : 0;
			if (type) {
				dataList.value = dataList.value.map(item => {
					item.isDel = 1;
					return item
				})
			} else {
				dataList.value = dataList.value.map(item => {
					item.isDel = 0;
					return item
				})
			}
		} else {
			ischenck.value = type ? 1 : 0;
			if (type) {
				dataList.value = dataList.value.map(item => {
					item.isChecked = 1;
					return item
				})
			} else {
				dataList.value = dataList.value.map(item => {
					item.isChecked = 0;
					return item
				})
			}
		}

	}
	const calculate = async () => {
		if (dataList.length == 0) {
			return
		}
		let arr = dataList.value.filter(item => item.isChecked == 1)
		if (arr.length === 0) {
			totalAmount.value = 0
			return;
		}
		let shopCartItem = arr.map(item => {
			return {
				spuId: item.spuId
			}
		})

		const res = await postshopCarPriceCompute(shopCartItem)
		if (res.code == 200) {
			totalAmount.value = res.data
			console.log(res)
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}

	}
	const editClick = () => {
		isEdit.value = !isEdit.value;
		let arr = []
		if (isEdit.value) {
			arr = dataList.value.filter(item => item.isDel == 0)
		} else {
			arr = dataList.value.filter(item => item.isChecked == 0)
		}
		ischenck.value = arr.length ? 0 : 1;

	};
	// 删除
	const delCar = async () => {
		if (delTotal.value == 0) return
		let arr = dataList.value.filter(item => item.isDel == 1).map(item => ({
			cartItemId: item.cartItemId
		}))
		const res = await postshopremoveItem(
			arr
		);
		if (res.code === 200) {
			toast('删除成功')
			isEdit.value = false;
			getData()
		} else {
			toast(res.msg);
		}
	}
	const getData = async () => {
		let params = {
			pageNum: 1,
			pageSize: 9999
		}
		const res = await getCarlist()
		if (res.code === 200) {
			if (res.data.list != null) {
				dataList.value = res.data.list
				dataList.value = dataList.value.map(item => {
					item.isChecked = 0;
					item.isDel = 0;
					return item
				})
				
				console.log('7897779097090',dataList.value);
			} else {
				dataList.value = []
			}

			ischenck.value = 0;
		}
	}
	const numBox = async (e, item) => {
		const res = await postaddcar({
			count: e.value,
			shopId: item.shopId,
			spuId: item.spuId,
		});
		if (e.value == 0) {
			getData();
		}
		if (res.code != 200) {
			toast(res.msg)
			getData();
		}
	}

	// 去结算
	const payAmount = debounce(async () => {
		if (!addrId.value) return toast('请先添加地址');
		const res = await getShopOrderlist({
			payRetailShopOrderItemDtoList: dataList.value.filter(item => item.isChecked == 1).map(
				item => {
					return {
						shopId: item.shopId,
						count: item.count,
						spuId: item.spuId,
					}
				}),
			orderAddrId: addrId.value,
		})
		if (res.code == 200) {
			toNav('/pages_B/directRetail/list')
		} else {
			toast(res.msg);
		}

	}, 1000)
	const getAddr = async () => {
		try {
			const res = await userDefaultAddr()
			if (res.code == 200) {
				addrId.value = res.data.addrId
			}
		} catch (err) {
			console.log(err);
		}
	}
	onLoad(() => {
		getData();
		getAddr();
	});
</script>

<style scoped lang="scss">
	.headen-box {
		background-color: #FFFFFF;
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
			border-left: 1rpx solid #CECECE;
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
		background: #FFFFFF;
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
			background: #FFFFFF;
			border-radius: 39rpx;
			border: 1px solid #FF3800;
			font-size: 30rpx;
			color: #FF3800;
			line-height: 78rpx;
			text-align: center;
		}

		.bottom-foot-right2 {
			display: flex;
			align-items: center;

			&-but {
				width: 226rpx;
				height: 78rpx;
				background: $bgLgColor;
				color: #FFFFFF;
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
					color: $color;
					margin: 0 6rpx;
				}

				.pText3 {
					font-weight: bold;
					font-size: 24rpx;
					line-height: 24rpx;
					color: $color;
				}
			}
		}
	}

	.integral-detail {
		min-height: 100vh;
		padding: 0;
		background: $pageBgColor;
		box-sizing: border-box;
		margin-bottom: 158rpx;
	}

	.card-box {
		display: flex;
		padding: 30rpx;
		background-color: #FFFFFF;
		border-radius: 26rpx;
		margin-bottom: 25rpx;
		box-sizing: border-box;

		image {
			width: 176rpx;
			height: 176rpx;
			background: #F5F5F5;
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
				color: $color;

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
					border: 1px solid $color;
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
					background: $bgLgColor;
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