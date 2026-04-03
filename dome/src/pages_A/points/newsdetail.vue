<template>
	<view class="page">
		<view class="info_box">
			<view class="info_title">{{ detaildata.title || '' }}</view>
			<view class="info_sub">
				<text>{{ detaildata.createTime || '' }}</text>
				<image :src="`${imgUrl}mine/read_num.png`" />
				<text>阅读{{ detaildata.browseCount || '0' }}</text>
			</view>
			<view class="info_count">
				<rich-text :nodes="detaildata.content || ''"></rich-text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow, onReachBottom, onLoad } from '@dcloudio/uni-app';
import { pointsnewsdetail } from '@/api/points';
import { getHotelArticleDetail } from '@/api/hotel';
import { imgUrl } from '@/config';

const pagetype = ref('')
const detaildata = ref({});
const getdetail = async (id) => {
	try {
		let res = {};
		if (pagetype.value === 'hotel') {
			res = await getHotelArticleDetail(id);
		} else {
			res = await pointsnewsdetail({ id });
		}
		console.log('资讯的详情', res);
		detaildata.value = res.data;
	} catch (err) {
		console.log('资讯详情失败', err);
	}
};


onLoad((e) => {
	console.log('资讯的详情', e);
	if(e.type){
		pagetype.value = e.type
	}
	getdetail(e.id);
});
</script>

<style lang="scss" scoped>
view,
text {
	box-sizing: border-box;
}
.page {
	width: 750rpx;
	min-height: 100vh;
	background-color: #f8f9fa;
	padding-top: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;

	.info_box {
		width: 750rpx;
		flex: 1 0;
		background-color: #ffffff;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		padding: 30rpx;

		.info_title {
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 8rpx;
		}

		.info_sub {
			width: 100%;
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;

			text {
				font-size: 24rpx;
				color: #666666;
			}

			text:nth-child(1) {
				flex: 1 0;
			}

			image {
				width: 28rpx;
				height: 28rpx;
				margin-right: 12rpx;
			}
		}

		.info_count {
			font-size: 28rpx;
			color: #666666;
		}
	}
}
</style>
