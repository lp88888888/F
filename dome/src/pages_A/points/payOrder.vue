<template>
	<view class="container" :style="{ background: themeStore.themeColors.$pageBgColor }" :data-theme="pageTheme">
		<!-- 顶部自定义导航 -->
		<up-sticky z-index="8888">
			<view :style="{ background: themeStore.themeColors.$color2 }">
				<up-navbar title="提交订单" bgColor="transparent" @leftClick="toBack" leftIconColor="#000000" placeholder
					:fixed="false" :titleStyle="{ fontWeight: 'bold' }"></up-navbar>
			</view>
		</up-sticky>
		<!-- 页面内容 -->
		<view class="content">
			<!-- 自提 / 快递 tabs -->
			<!-- <view class="tabs-wrap flex">
				<view class="tab">
					到店自取
				</view>
				<view class="tab">
					快递到家
				</view>
			</view> -->

			<!-- 地址卡片 -->
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

			<!-- 商品信息 -->
			<view class="card goods-card">
				<view class="section-title">商品信息</view>

				<view class="goods-item" v-for="(item, index) in detail" :key="index">
					<u-image :src="item.pointActivity.picUrl" width="96rpx" height="96rpx" radius="12rpx" mode="aspectFit" />
					<view class="g-name m-b-5 m-l-20 u-line-2 flex-1">{{ item.pointActivity.spuName }}</view>
					<view class="g-info flex flex-col">
						<view class="g-score">{{ item.pointActivity.point }} 积分</view>
						<view class="g-sub">x {{ item.count }}</view>
					</view>
				</view>
			</view>

			<!-- 运费与合计行 -->
			<!-- <view class="card fee-card m-t-20">
				<view class="fee-row flex just-sb fs-28 col6 fw-500">
					<text class="col6">运费</text>
					<text class="col3">免运费</text>
				</view>
				<view class="line" color="#F2F2F2"></view>
				<view class="sum-row">
					<text class="fs-24 col3">共 {{ totalQty }} 件，合计：</text>
					<text class="sum-score">
						<text class="fs-36 colff9 m-r-8">{{ detail.totalFee || 0 }}</text>
						<text class="fs-24 colff9 fw-b">积分</text>
					</text>
				</view>
			</view> -->

			<view class="safe-bottom"></view>
		</view>

		<!-- 底部结算条 -->
		<u-gap height="90" />
		<view class="bottom-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
			<view class="total">
				<text>总计：</text>
				<text class="total-num">
					<text class="fs-44 fw-b">{{ totalScore }}</text>
					积分
				</text>
			</view>
			<view class="pay-btn" @click="handlePay">立即支付</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, computed, onMounted } from 'vue';
	import { onLoad, onPageScroll, onShow } from '@dcloudio/uni-app';
	import { showToastSuccess } from '@/utils/util';
	import { payInfoPrShopCarOrder, addCartPoints, orderCreate, detailActivityPoints, getshopcarinfo } from '@/api/points';
	import { getMemberDeliveryAddress } from '@/api/user';
	import { toBack, toRec } from '@/utils/route';
	import { toast, debounce } from '@/utils/common';
	import { imgUrl } from '../../config';
	// 如果你有公共图片前缀，可替换为自己的 imgUrl
	const imgBase = 'https://cdn.uviewui.com/uview/album/';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	/** 顶部栏 */
	const backgroundColor = ref<string>('transparent');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const safeAreaBottom = ref(0);
	onMounted(() => {
		const sys = uni.getSystemInfoSync();
		navBarHeight.value = (sys.statusBarHeight || 0) + 44;
		// H5/小程序的安全区（iOS 刘海屏等）
		// 这里做个兜底：如果没有 safeAreaInsets 使用固定 10
		// @ts-ignore
		safeAreaBottom.value = sys.safeAreaInsets?.bottom ?? 10;
	});
	onPageScroll((e) => {
		if (e.scrollTop < 1) {
			backgroundColor.value = 'transparent';
		} else {
			backgroundColor.value = themeStore.themeColors.$primaryColor;
		}
	});

	/** Tabs */
	const tabs = ref([{ name: '到店自取' }, { name: '快递到家' }]);
	const currentTab = ref(0);
	const onTabChange = (e : any) => {
		currentTab.value = e.index;
	};

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

	/** 商品数据（演示） */
	const goods = ref([]);

	/** 计算项 */
	const goodsScoreSum = computed(() => goods.value.reduce((sum, g) => sum + g.score * g.qty, 0));
	const totalQty = computed(() => goods.value.reduce((n, g) => n + (g.count || 1), 0));

	/** 支付 */
	const paystatus = ref(true)
	const handlePay = () => {
		if(paystatus.value){
			onPay()
		}
	}
	const onPay = async () => {
		if (!addressId.value && isVirtualgoods.value) {
			toast('请选择地址');
			return;
		}
		try {
			let cartId = '';
			paystatus.value = false
			if (fromtype.value === 'goods') {
				const res : any = await addCartPoints({
					count: count.value,
					skuId: skuId.value,
					pointActivityId: detailId.value,
				});
				console.log('直接购买提交订单', res);
				cartId = res.data;
			}

			let shopCartItem = detail.value.map((item) => {
				return {
					skuId: item.sku.id,
					count: item.count,
					cartId: cartId ? cartId : item.id,
					pointActivityId: item.pointActivityId,
				};
			});
			console.log('中介也提交的数据', shopCartItem);
			let seckillActivityId = ''
			let discountActivityId = ''
			console.log('中介也提交的数据', fromshopcarinfo.value);
			if (youhutype.value == 3) {
				seckillActivityId = youhuiid.value
			}
			if (youhutype.value == 4) {
				discountActivityId = youhuiid.value
			}

			const orderRes : any = await orderCreate({
				items: shopCartItem,
				pointStatus: true,
				deliveryType: 1,
				addressId: address.value.addrId || '',
				pointActivityId: 0,
				seckillActivityId: seckillActivityId,
				discountActivityId: discountActivityId,
				generalActivityPointId:generalActivityPointId.value
			});
			console.log('立即支付提交成功', orderRes);
			if (orderRes.code === 200) {
				const orderId = orderRes.data?.id || '';
				uni.showToast({
					icon: 'success',
					title: '支付成功',
				});
				paystatus.value = true
				setTimeout(() => {
					if (orderRes.data?.returnCouponInfo?.activityType == 1) {
						uni.redirectTo({
						 url: `/pages_A/points/fqpaysuccess?name=${orderRes.data?.returnCouponInfo.couponName }&time=${orderRes.data?.returnCouponInfo.couponEndTime}`
						});
					} else {
						uni.redirectTo({
							url: '/pages_A/order/index',
						});
					}
				}, 1500);
			}
		} catch (err) {
			console.error('订单流程异常：', err);
			// #ifdef MP-WEIXIN
			uni.showToast({ title: err.msg, icon: 'none', duration: 4000 });
			// #endif
			// #ifdef APP
			uni.showToast({ title: err.msg, icon: 'none' });
			// #endif
			paystatus.value = true
		}
	};

	const totalScore = computed(() => {
		let num = detail.value.reduce((acc, cur) => {
			return acc + cur.pointActivity.point * 100 * cur.count;
		}, 0);
		return (num / 100).toFixed(2);
	});
	const detailId = ref('');
	const count = ref(0);
	const skuId = ref('');
	const pointsnum = () => {
		let item = detail.value[0].productSpuDetailRespVO.skus.find((e) => e.id == skuId.value);
		console.log('查看的规格的积分', item);
		return item?.point || 0;
	};
	// 查询商品详情

	const detail = ref([]);
	const getdetail = async () => {
		try {
			const res = await detailActivityPoints(detailId.value);
			console.log('商品信息', res);
			let data = res.data;
			let pic = 0
			if (data.returnActivityType == 3 || data.returnActivityType == 4) {
				pic = data.productSpuDetailRespVO.skus[0].activityPoint
			} else {
				pic = data.productSpuDetailRespVO.skus[0].point
			}

			const item = data.productSpuDetailRespVO.skus.find((e) => e.id == skuId.value) || {};
			detail.value = [
				{
					count: count.value,
					pointActivityId: data.id,
					sku: {
						id: item.id,
					},
					pointActivity: {
						id: data.id,
						spuId: data.spuId,
						spuName: data.productSpuDetailRespVO.name || '',
						picUrl: data.productSpuDetailRespVO.picUrl || '',
						point: pic || 0,
					},
				},
			];
			isVirtualgoods.value = data.productSpuDetailRespVO?.couponFlag != 1
		} catch (err) {
			console.log('详情失败', err);
		}
	};

	const isVirtualgoods = ref(true)
	const fromshopcarinfo = ref([]);
	const getData = async () => {
		let ids = fromshopcarinfo.value.map((e) => e.cartId);
		console.log('过滤的ids', ids);
		try {
			const res = await getshopcarinfo({ ids: ids.join(',') });
			console.log('查询的购物车商品详情', res);
			let arr = res.data.validList;
			isVirtualgoods.value = arr.some(e => e.spu.couponFlag != 1)
			console.log("当前商品是不是实物商品", isVirtualgoods.value)
			detail.value = arr.map((e) => {
				// 先找到购物车中的 count
				const cartItem = fromshopcarinfo.value.find((s) => s.cartId == e.id);
				const count = cartItem ? cartItem.count : 0; // 防止找不到

				// 处理 pointActivity
				let pointActivity = e.pointActivity;
				if (pointActivity && pointActivity.returnActivityType === 4) {
					// 深拷贝或新建对象，避免修改原始数据
					pointActivity = {
						...pointActivity,
						point: pointActivity.activityPoint // 用 activityPoint 覆盖 point
					};
				}

				return {
					...e,
					count,
					pointActivity // 使用可能被修改过的 pointActivity
				};
			});
		} catch (err) {
			console.error('购物车详情失败', err);
		}
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

	const fromtype = ref('goods');

	onShow(() => {
		loadDefaultAddress();
	});
	const youhutype = ref('')
	const youhuiid = ref('')
	const generalActivityPointId=ref('')
	onLoad((e) => {
		if (e.obj) {
			let obj = JSON.parse(e.obj);
			console.log('提交订单接收的参数', obj);
			if (Array.isArray(obj)) {
				console.log('变量是一个数组');
				fromtype.value = 'shopcar';
				fromshopcarinfo.value = obj;
				getData();
			} else {
				console.log('变量不是一个数组');
				fromtype.value = 'goods';
				detailId.value = obj.detailId;
				skuId.value = obj.skuId;
				count.value = obj.count;
				youhutype.value = obj.type
				youhuiid.value = obj.aid
				generalActivityPointId.value=obj.campaignId
				getdetail();
			}
		}
	});
</script>

<style scoped lang="scss">
	.container {
		min-height: 100vh;
		background: linear-gradient(180deg, rgba(255, 150, 0, 1) 0%, rgba(246, 206, 148, 1) 31%, rgba(241, 237, 230, 1) 50%, rgba(241, 239, 236, 1) 100%);
		display: flex;
		flex-direction: column;
	}

	.content {
		padding: 0 32rpx 140rpx; // 预留底部结算条空间
	}

	.tabs-wrap {
		.tab {
			width: 50%;
			height: 68rpx;
			background: #fff6e6;
			// border-radius: 20rpx 20rpx 0 0;
			text-align: center;
			line-height: 68rpx;
		}

		.tab-active {
			width: 356rpx;
			height: 91rpx;
			background: #ffffff;
			border-radius: 20rpx 20rpx 0rpx 0rpx;
		}
	}

	/* 卡片通用 */
	.card {
		background: #fff;
		border-radius: 20rpx;
		border: 3px solid #fff;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.04);
	}

	/* 地址卡片 */
	.address-card {
		padding: 24rpx;
		border-radius: 0 0 20rpx 20rpx;

		.addr-row {
			display: flex;
			align-items: center;
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

	/* 商品卡片 */
	.goods-card {
		margin-top: 24rpx;
		padding: 36rpx 30rpx 10rpx;

		.section-title {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
		}

		.goods-item {
			display: flex;
			align-items: flex-start;
			padding: 25rpx 0;

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
	}

	/* 运费与合计行 */
	.fee-card {
		padding: 36rpx 30rpx;

		.fee-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.sum-row {
			text-align: right;
		}

		.sum-score {
			color: #333;
			font-weight: 600;

			.m-r-8 {
				margin-right: 8rpx;
				margin-top: 2rpx;
			}
		}

		.line {
			border-bottom: 1rpx solid #f2f2f2;
			margin: 37rpx 0 29rpx;
		}
	}

	/* 底部结算条 */
	.bottom-bar {
		width: 750rpx;
		height: 158rpx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 18rpx 30rpx 62rpx;
		box-sizing: border-box;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 999;

		.total {
			font-size: 24rpx;
			color: #333;

			.total-num {
				margin-left: 8rpx;
				font-size: 24rpx;
				color: var(--primary-color);
				font-weight: bold;
			}
		}

		.pay-btn {
			width: 276rpx;
			height: 78rpx;
			border-radius: 39rpx;
			line-height: 78rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #ffffff;
			text-align: center;
			background: var(--but-color-line);
		}
	}

	.m-r-12 {
		margin-right: 12rpx;
	}

	.m-l-12 {
		margin-left: 12rpx;
	}

	.safe-bottom {
		height: 160rpx;
	}
</style>