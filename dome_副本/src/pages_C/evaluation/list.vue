<template>
	<view class="page-container" :data-theme="pageTheme">
		<up-navbar
			:title="pageType == 'user' ? '我的评价' : '评价列表'"
			@leftClick="toBack"
			placeholder
			:fixed="true"
		></up-navbar>

		<ser-empty v-if="!dataList.length"></ser-empty>

		<view class="details-eva" v-else>
			<view class="eva-item flex flex-col m-b-30" v-for="(item, index) in dataList" :key="index">
				<view class="flex just-sb ali-cen m-b-25">
					<view class="flex ali-cen">
						<!-- <image class="icon-44 br50 m-r-15" :src="item.avatar" mode=""></image> -->
						<up-avatar :src="item.avatar || item.userAvatar" size="22"></up-avatar>
						<text class="fs-24 fw-b m-l-15">{{ item.nickName || item.userNickname }}</text>
					</view>
					<text class="fs-24 col6">{{ item.createTime || '' }}</text>
				</view>
				<view class="eva-info">
					{{ item.content || item.commentContent }}
				</view>
				<view class="eva-img-box flex" v-if="pageType == 'hotel'">
					<template v-if="item?.picUrl">
						<image
							class="eva-img"
							v-for="(url, inx) in (item?.picUrl || '').split(',')"
							:key="inx"
							:src="url"
							@click="$previewListImage(inx, (item?.picUrl || '').split(','))"
							mode=""
						></image>
					</template>
				</view>
				<view class="eva-img-box flex" v-else>
					<image
						class="eva-img"
						v-for="(url, inx) in item.imageUrls"
						:key="inx"
						:src="url"
						@click="$previewListImage(inx, item.imageUrls)"
						mode=""
					></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { toNav, toBack } from '@/utils/route';
import { imgUrl } from '@/config';
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app';
import { listReview, listUserReview } from '@/api/points';
import { getcommenthotel } from '@/api/hotel';
import { toast } from '@/utils/common';
import { $previewListImage } from '@/utils/util';
// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);
const pageType = ref('');

const imgList = computed(() => {
	return () => {};
});
const dataList = ref([]);

const listQuery = ref({
	pageNum: 1,
	pageSize: 10,
	bizType: 'MERCHANT_POINT_APPPOINTMENT', // 业务类型
	merchantId: '', // 商户ID
	bizId: '', // 业务id(订单ID/服务单ID)  积分商城订单id传drderItemId
	spuId: '', // 商品iD
});
const total = ref(0);

const init = () => {
	listQuery.value.pageNum = 1;
	getData();
};
// 获取数据
const getData = async () => {
	try {
		if (pageType.value == 'user') {
			let params = {
				pageNum: listQuery.value.pageNum,
				pageSize: listQuery.value.pageSize,
			};
			const res = await listUserReview(params);
			if (res.code == 200) {
				total.value = res.data.total;
				dataList.value = listQuery.value.pageNum == 1 ? res.data.list : [...dataList.value, ...res.data.list];
			} else {
				toast(res.msg);
			}
		} else if (pageType.value == 'hotel') {
			const res = await getcommenthotel({
				hotelId: listQuery.value.spuId,
				pageNum: listQuery.value.pageNum,
				pageSize: listQuery.value.pageSize,
			});
			console.log('查询的酒店评价', res);
			total.value = res.total;
			dataList.value = listQuery.value.pageNum == 1 ? res.rows : [...dataList.value, ...res.rows];
		} else {
			const res = await listReview(listQuery.value);
			if (res.code == 200) {
				total.value = res.data.total;
				dataList.value = listQuery.value.pageNum == 1 ? res.data.list : [...dataList.value, ...res.data.list];
			} else {
				toast(res.msg);
			}
		}
		console.log('查询的数据', dataList.value.length);
	} catch (err) {}
};

onLoad((opticon) => {
	if (opticon.spuId) {
		listQuery.value.spuId = opticon.spuId;
	}
	pageType.value = opticon.type || '';
});
onShow(() => {
	init();
});
onReachBottom(() => {
	if (listQuery.value.pageNum * listQuery.value.pageSize < total.value) {
		getData();
	}
});
</script>

<style lang="scss" scoped>
.page-container {
	min-height: 100vh;
}
.details-eva {
	padding: 30rpx 30rpx;
	box-sizing: border-box;

	.eva-item {
		background: #ffffff;
		padding-bottom: 40rpx;
		border-bottom: 1rpx solid #ececec;
		padding: 25rpx;
		box-sizing: border-box;
		border-radius: 20rpx;

		.eva-info {
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			line-height: 50rpx;
		}

		.eva-img-box {
			border-radius: 16rpx 16rpx 16rpx 16rpx;

			margin-top: 25rpx;
			grid-gap: 25rpx;
			flex-wrap: wrap;

			.eva-img {
				width: 196rpx;
				height: 196rpx;
				font-weight: 500;
				font-size: 26rpx;
				color: #333333;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				line-height: 50rpx;
			}
		}
	}
}
</style>
