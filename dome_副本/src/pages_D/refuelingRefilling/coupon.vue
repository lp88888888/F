<template>
	<view class="coupon-container">
		<view class="title">可用优惠券

			<view class="addcoupon" @click="chengcoupon">兑换优惠券</view>
		</view>

		<view v-for="(item, index) in coupons" :key="index" :style="bgStyle" class="coupon-item">
			<view class="item-line">
				<text class="item-title">{{ item.name  }} </text>
			</view>
			<view class="item-line">
				<view style="display:flex;">
					<view>有效期限</view>
					<view>{{ item.validEndTime || '-' }}过期</view>
				</view>
				<view v-if="item.isDel==0" @click="selectCoupon(item,index)"
					style="width: 38rpx;height: 38rpx;border-radius: 50%;border:1px solid #fff;margin:  auto 0;">
				</view>
				<u-icon v-if="item.isDel==1" @click="selectCoupon(null,index)" name="checkmark-circle-fill"
					color="#FF9600" size="19"></u-icon>
				<!-- <view class="item-btn">去使用</view> -->
			</view>
			<!-- <view v-if="selectedIndex === index" class="selected-tag">已选择</view> -->
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		imgUrl
	} from '@/config'
	import {
		getcouponslist
	} from '@/api/index';
	import {
		onLoad,
		onReady
	} from '@dcloudio/uni-app';
	const backgroundImage = ref(imgUrl + 'coupon_bg.png')
	const mid = ref('');
	onLoad((option) => {
		mid.value = option.id
		getlist()
	})
	const bgStyle = computed(() => {
		if (!backgroundImage.value) return {}
		return {
			backgroundImage: `url(${backgroundImage.value})`,
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat'
		}
	})
	const coupons = ref([]);
	const getlist = async () => {
		let params = {
			pageNum: 1,
			pageSize: 999,
			status: 1,
			categoryName: '加油加气'

		}
		const res = await getcouponslist(params);
		coupons.value = res.data.list;
		coupons.value.forEach(item => {
			if (mid.value == item.id) {
				item.isDel = 1
			} else {
				item.isDel = 0
			}
		})
		console.log(res);
	}

	const selectedIndex = ref(-1);

	const selectCoupon = (item, index) => {
		console.log(index);
		coupons.value[index].isDel = 1
		selectedIndex.value = item;
		uni.$emit('selectCoupon', item);
		// 返回上一页
		uni.navigateBack();
	};
	const chengcoupon = () => {
		uni.redirectTo({
				url:'/pages/home/home?type=points'
			})
	};
</script>

<style scoped lang="scss">
	.item-line {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		color: #333;
		margin-bottom: 12rpx;
	}

	.item-title {
		display: inline-block;
		max-width: 300rpx;
		font-weight: 700;
		font-size: 32rpx;
		color: #FF2749;
	}

	.item-type {
		font-weight: 700;
		font-size: 40rpx;
		color: #FFFFFF;
	}

	.item-btn {
		width: 134rpx;
		height: 38rpx;
		line-height: 38rpx;
		background: linear-gradient(170deg, #FFEDDB 0%, #FFE1B9 100%);
		border-radius: 156rpx 156rpx 156rpx 156rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #EA072B;
		text-align: center;
	}

	.coupon-container {
		padding: 32rpx;
		background-color: #f8f8f8;
		height: 100vh;
	}

	.title {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.addcoupon {
		font-size: 28rpx;
		color: $color;
	}

	.coupon-item {
		background-color: #fff;
		border: 1rpx solid #e5e5e5;
		border-radius: 8rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		height: 135rpx;
	}

	.coupon-content {
		flex: 1;
	}

	.coupon-title {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 8rpx;
	}

	.coupon-info {
		font-size: 24rpx;
		color: #999;
	}

	.selected-tag {
		font-size: 26rpx;
		color: #FFA500;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
		background-color: #FFF5E6;
	}
</style>