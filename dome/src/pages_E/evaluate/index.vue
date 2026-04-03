<template>
	<view class="pj_page" :data-theme="pageTheme">
		<view class="pg_bg"></view>
		<up-navbar bgColor="transparent" placeholder :fixed="true" title="评价中心" autoBack></up-navbar>

		<view class="title_box">
			<text class="t_txt">全部待评价</text>
			<text class="t_txt1" @click="toNav('/pages_E/evaluate/alreadyrated')">查看已评价</text>
			<uni-icons type="right" size="14" color="#333333" @click="toNav('/pages_E/evaluate/alreadyrated')"></uni-icons>
		</view>

		<scroll-view scroll-y="true" class="scroll-Y" @scrolltolower="lower">
			<template v-if="notreviewlist.length">
				<view class="item_box" v-for="(item, index) in notreviewlist" :key="index">
					<view class="info_box">
						<image class="info_img" :src="item.orderImage" mode=""></image>
						<view class="info_txts">
							<text class="info_title">{{ item.orderTitle }}</text>
							<text class="info_time">下单时间：{{ item.createTime }}</text>
						</view>
					</view>
					<view class="btn_box">
						<text class="btn_txt" @click="handelAddReview(item)">去评价</text>
					</view>
				</view>
			</template>

			<!-- 没有数据 -->
			<ser-empty v-else text="暂无待评价"></ser-empty>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { toNav, toBack } from '@/utils/route';
// 主题
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();

import { getNotReview, getMerchantIdByOrderId } from '@/api/points';
import { ref } from 'vue';

const handelAddReview = async (item) => {
	// 酒店：5
	// 积分商城：4
	// 景区门票：1
	try {
		const res = await getMerchantIdByOrderId(item.id, item.bizOrderType);
		console.log('查询商户spuid参数', res);
		let spuid = res.data;
		if (item.bizOrderType == 5) {
			toNav(`/pages_B/hotel/orderEvaluate?id=${spuid}`);
		} else {
			toNav(`/pages_C/evaluation/add?id=${item.id}&spuId=${item.bizOrderType == 4 ? spuid : ''}&shopId=${item.bizOrderType == 4 ? 0 : spuid}`);
		}
	} catch (err) {
		console.error('查询spuid出错', err);
	}
};

const pageNum = ref(1);
const pageSize = ref(20);
const total = ref(0);
const notreviewlist = ref([]);
const getList = async () => {
	try {
		const res = await getNotReview({
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		});
		console.log('查询的未评价的数据', res);
		notreviewlist.value = pageNum.value == 1 ? res.data.list || [] : notreviewlist.value.concat(res.data.list || []);
		total.value = res.data.total;
	} catch (err) {
		console.error('查询未评价失败', err);
	}
};

// 触底加载
const lower = () => {
	console.log('上拉加载');
	if (total.value > notreviewlist.value.length) {
		pageNum.value += 1;
		getList();
	}
};

onShow(() => {
	getList();
});
</script>

<style scoped lang="scss">
.pg_bg {
	width: 750rpx;
	height: 448rpx;
	background-image: var(--linear-color);
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: -1;
}
.pj_page {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;

	.title_box {
		width: 690rpx;
		height: 92rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.t_txt {
			flex: 1;
			font-weight: 500;
			font-size: 32rpx;
			color: #333333;
		}
		.t_txt1 {
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;
		}
	}

	.scroll-Y {
		width: 690rpx;
		flex: 1;
		height: 0;
		white-space: nowrap;
	}

	.item_box {
		width: 690rpx;
		height: 262rpx;
		background: #ffffff;
		box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(209, 215, 231, 0.4);
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin-bottom: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.info_box {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.info_img {
				width: 140rpx;
				height: 140rpx;
				background: #f4f4f4;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				margin-right: 26rpx;
			}
			.info_txts {
				flex: 1 0;
				width: 0;
				height: 140rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.info_title {
					display: -webkit-box !important;
					font-weight: 500;
					font-size: 28rpx;
					color: #333333;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					white-space: normal;
				}
				.info_time {
					font-weight: 400;
					font-size: 24rpx;
					color: #666666;
				}
			}
		}

		.btn_box {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			.btn_txt {
				display: block;
				width: 136rpx;
				height: 56rpx;
				border-radius: 48rpx;
				border: 2rpx solid;
				border-color: var(--primary-color);
				font-weight: 500;
				font-size: 24rpx;
				color: var(--primary-color);
				text-align: center;
				line-height: 52rpx;
			}
		}
	}
}
</style>
