<template>
	<view class="service-evaluation" :data-theme="pageTheme">
		<!-- 评分项 -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="服务评价" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<view class="box">
			<view class="rating">
				<view v-for="(item, index) in ratingList" :key="index" class="rating-box">
					<text class="rating-title">{{ item.title }}</text>
					<u-rate
						v-model="ratingList[index].score"
						:active-icon="`${imgUrl}hotel/star_active.png`"
						:inactive-icon="`${imgUrl}hotel/star_inactive.png`"
						:count="5"
						active-color="#FF9000"
						inactive-color="#E0E0E0"
						size="20"
						@change="onRatingChange(index, $event)"
					/>
				</view>
			</view>
			
			<!-- 评价内容 -->
			<view class="eva-content">
				<view class="eva-title">评价</view>
				<textarea v-model="evaluationText" placeholder="点击输入其他评价内容" class="eva-textarea" placeholder-class="area-plh" />
			</view>
			
			<view class="card">
				<view class="eva-title">图片</view>
				<up-gap height="10"></up-gap>
				<FormFile :urls="imageList" @deleteFile="deleteFile" @uploadFile="uploadFile"></FormFile>
			</view>
			<view style='height: 400rpx;'></view>
			<!-- 提交按钮（固定底部） -->
			<view class="bottom-bar">
				<view class="sub-btn" @click="onSubmit">提交评价</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { imgUrl } from '@/config';
import { getcommentsubmit } from '@/api/hotel';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { toNav, toBack } from '@/utils/route';
import FormFile from '@/components/FormFile.vue';
import { useTheme } from '@/composables/useTheme';
import { debounce } from '@/utils/common';
const { themeStore, pageTheme } = useTheme();
// 假设 activityApi 导出 imgUrl（虽然本页未用到图片）
// import { imgUrl } from '@/networkService/activityApi'

// 评分项数据结构
interface RatingItem {
	title: string;
	score: number; // u-rate 使用 number
}
onLoad((option) => {
	orderId.value = option.id;
});

const imageList = ref([]);
// 删除图片
const deleteFile = (index) => {
	// form.value.coverPicture = ''
	imageList.value.splice(index, 1);
};
// 上传成功
const uploadFile = (event) => {
	imageList.value.push(event);
};

const ratingList = ref<RatingItem[]>([
	{ title: '位置', score: 0, scoreType: 1 },
	{ title: '设施', score: 0, scoreType: 2 },
	{ title: '服务', score: 0, scoreType: 3 },
	{ title: '卫生', score: 0, scoreType: 4 },
]);

const evaluationText = ref<string>('');

// 评分变化处理（u-rate 的 change 事件返回 number）
const onRatingChange = (index: number, value: number) => {
	ratingList.value[index].score = value;
};
const orderId = ref<string>('');
// 提交评价（可扩展）
const onSubmit = debounce(() => {
	const unratedItems = ratingList.value.filter((item) => item.score === 0);
	if (unratedItems.length > 0) {
		uni.showToast({
			title: `请为【${unratedItems[0].title}】评分`,
			icon: 'none',
		});
		return;
	}
	if (!evaluationText.value) {
		uni.showToast({
			title: '请输入评价',
			icon: 'none',
		});
		return;
	}
	
	let imgs = '';
	if (imageList.value.length) {
		imgs = imageList.value.map((item) => item.url).join(',');
	}
	let params = {
		scoreList: ratingList.value.map((item) => ({
			scoreType: item.scoreType,
			score: item.score,
		})),
		commentContent: evaluationText.value,
		orderId: orderId.value,
		picUrl: imgs,
	};
	getcommentsubmit(params)
		.then((res) => {
			uni.showToast({ title: '提交成功', icon: 'success' });
			setTimeout(() => {
				uni.navigateBack();
			}, 2000);
		})
		.catch((err) => {});
	console.log('评分数据:', ratingList.value);
	console.log('评价内容:', evaluationText.value);
}, 300);
</script>

<style scoped>
.box{
	height: 100vh;
	overflow: scroll;
}
.service-evaluation {
	background: var(--head-color);
	padding-top: 10rpx;
}

.rating {
	background: #ffffff;
	box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);
	border-radius: 16rpx;
	margin: 24rpx 32rpx;
	padding: 20rpx 32rpx;
}

.rating-box {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
}

.rating-box:last-child {
	margin-bottom: 0;
}

.rating-title {
	font-weight: 600;
	font-size: 32rpx;
	color: #333333;
	margin-right: 50rpx;
}

.eva-content {
	background: #ffffff;
	margin: 0 32rpx;
	padding: 32rpx;
	box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);
	border-radius: 16rpx;
}

.card {
	margin: 20rpx 32rpx;
	padding: 30rpx 35rpx;
	background: #fff;
	border-radius: 16rpx;
	box-sizing: border-box;
	box-shadow: 0 8rpx 20rpx rgba(138, 78, 0, 0.05);
}

.eva-title {
	font-weight: 600;
	font-size: 40rpx;
	color: #333333;
	margin-bottom: 32rpx;
}

.eva-textarea {
	width: 622rpx;
	height: 622rpx;
	background: rgba(103, 58, 0, 0.03);
	border-radius: 16rpx;
	padding: 32rpx;
	box-sizing: border-box;
	font-size: 28rpx;
	color: #333;
}

.area-plh {
	font-weight: 400;
	font-size: 28rpx;
	color: #999999;
}

.bottom-bar {
	width: 750rpx;
	height: 160rpx;
	background: #ffffff;
	box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.03);
	border-top: 2rpx solid rgba(0, 0, 0, 0.1);
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 999;
	display: flex;
	justify-content: center;
	align-items: center;
}

.sub-btn {
	width: 484rpx;
	height: 96rpx;
	background: var(--primary-color);
	border-radius: 48rpx;
	font-weight: 700;
	font-size: 32rpx;
	color: #ffffff;
	text-align: center;
	line-height: 96rpx;
}
</style>
