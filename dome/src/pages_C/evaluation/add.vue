<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-navbar title="评价" autoBack bgColor="transparent" placeholder :fixed="true"></up-navbar>
		<view class="toNavBg"></view>
		<view class="centerBox">
			<view class="card">
				<view class="scoreView" v-for="(item, index) in evaluatelist" :key="index">
					<text class="scoreView-label fn-6-28-000">{{ item.dimensionName }}</text>
					<up-rate count="5" v-model="item.score" size="25" activeColor="#FF9600" inactiveColor="#FF9600"></up-rate>
					<text class="">{{ item.score }}分</text>
				</view>
			</view>
			<up-gap height="12"></up-gap>
			<view class="card">
				<view class="fn-6-28-000">评价</view>
				<up-gap height="10"></up-gap>
				<view class="textAreView">
					<up-textarea
						v-model="remarks"
						placeholder="点击输入评价内容"
						height="150"
						:customStyle="{ backgroundColor: 'transparent', fontSize: '28rpx' }"
						border="none"
					></up-textarea>
				</view>
			</view>
			<up-gap height="12"></up-gap>
			<view class="card">
				<view class="fn-6-28-000">图片</view>
				<up-gap height="10"></up-gap>
				<FormFile :urls="imageList" @deleteFile="deleteFile" @uploadFile="uploadFile"></FormFile>
			</view>
			<view class="fixeView">
				<view class="fixeView-item" @click="submit">提交</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { toNav, toBack, toRec } from '@/utils/route';
import { imgUrl } from '@/config';
import { debounce } from '@/utils/common';
import { sysReview, bizType } from '@/api/car';
import { addReview } from '@/api/points';
import { onLoad } from '@dcloudio/uni-app';
import FormFile from '@/components/FormFile.vue';
// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
import { join } from 'path';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);

// 定义评分项数据结构接口（增强类型安全）
interface EvaluateItem {
	dimensionName: string;
	dimensionConfigId: string; // 维度配置ID，用于提交时标识评分项
	score: number; // 评分值
}

const remarks = ref<string>('');
const bizId = ref<any>('');
const spuId = ref<any>('');
const shopId = ref<any>('');

const evaluatelist = ref<EvaluateItem[]>([]); // 明确类型为评分项数组
const type = ref<string>('');
const imageList = ref([]);

// 防抖处理的提交方法
const submit = debounce(() => {
	sysReviewFun();
}, 800);

// 提交评价接口调用
const sysReviewFun = async () => {
	// toRec('/pages_C/evaluation/success')
	// return;
	// 验证是否所有评分项都已选择
	const unratedItems = evaluatelist.value.filter((item) => item.score === 0);
	if (unratedItems.length > 0) {
		uni.showToast({
			title: `请为【${unratedItems[0].dimensionName}】评分`,
			icon: 'none',
		});
		return;
	}
	if (!remarks.value) {
		uni.showToast({
			title: '请输入评价',
			icon: 'none',
		});
		return;
	}
	// // 构建评分项数组（按接口要求格式）
	const pjList = evaluatelist.value.map((item) => ({
		bizType: item.bizType,
		dimensionName: item.dimensionName,
		dimensionConfigId: item.id,
		score: item.score.toString(), // 转换为字符串类型，根据接口要求调整
	}));
	let imgs = [];
	if (imageList.value.length) {
		imgs = imageList.value.map((item) => item.url);
	}

	try {
		const params = {
			bizType: 'MERCHANT_POINT_APPPOINTMENT',
			merchantId: shopId.value,
			bizId: bizId.value,
			spuId: spuId.value,
			content: remarks.value,
			imageUrls: imgs,
			sysReviewDimensionScoreDtoList: pjList, // 添加评分项数组
		};
		console.log('----imageList-----', imageList.value);
		console.log('----params-----', params);
		// return
		const res = await addReview(params);
		if (res.code == 200) {
			uni.showToast({ title: '评价提交成功', icon: 'success' });
			toRec('/pages_C/evaluation/success');
		} else {
			uni.showToast({ title: res.message || '提交失败', icon: 'none' });
		}
	} catch (error) {
		console.error('评价提交失败:', error);
	}
};

// 页面加载时获取评分维度配置
const bizTypeFun = async () => {
	try {
		const res = await bizType('MERCHANT_POINT_APPPOINTMENT');
		console.log('查询的评分维度', res);
		// 初始化评分项的分数为0
		evaluatelist.value = res.rows.map((item: any) => ({
			...item,
			score: 0,
		}));
	} catch (error) {
		console.error('获取评分维度失败:', error);
		uni.showToast({ title: '加载评分项失败', icon: 'none' });
	}
};

// 删除图片
const deleteFile = (index) => {
	// form.value.coverPicture = ''
	imageList.value.splice(index, 1);
};
// 上传成功
const uploadFile = (event) => {
	imageList.value.push(event);
};

// 页面加载时获取参数并初始化
onLoad((options) => {
	bizId.value = options.id || '';
	spuId.value = options.spuId || '';
	shopId.value = options.shopId || '';

	// merchantId.value = options.merchantId;

	// 根据类型参数设置业务类型
	// 	switch (options.type) {
	// 		case '1':
	// 			type.value = 'NEW_CAR_APPOINTMENT'; // 新车预约
	// 			break;
	// 		case '2':
	// 			type.value = 'OLD_CAR_APPOINTMENT'; // 二手车
	// 			break;
	// 		case '3':
	// 			type.value = 'AUTO_REPAIR_APPOINTMENT'; // 汽车维修
	// 			break;
	// 		case '4':
	// 			type.value = 'CAR_RENTAL_APPOINTMENT'; // 租车
	// 			break;
	// 		default:
	// 			type.value = 'CAR_RENTAL_APPOINTMENT';
	// 	}

	bizTypeFun();
});
</script>

<style lang="scss" scoped>
.pageView {
	padding: 30rpx 32rpx;
	box-sizing: border-box;
	min-height: 100vh;
	background: #f8f9fb;
}

.toNavBg {
	width: 750rpx;
	height: 448rpx;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
	background: var(--head-color);
	border-radius: 0rpx 0rpx 0rpx 0rpx;
}
.centerBox {
	position: relative;
	z-index: 1;
}

.card {
	padding: 30rpx 35rpx;
	background: #ffffff;
	border-radius: 20rpx;
}

.scoreView {
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: space-between; // 让评分项和星星靠右对齐

	.scoreView-label {
		// width: 180rpx; // 加宽标签宽度，避免文字换行
	}
}

.fn-6-28-000 {
	font-weight: bold;
	font-size: 28rpx;
	color: #000000;
}

.textAreView {
	background: #f7f8f9;
	border-radius: 20rpx;
	padding: 15rpx;
	box-sizing: border-box;
	min-height: 300rpx; // 给文本域设置最小高度
}

.fixeView {
	width: 100%;
	height: 158rpx;
	background: #ffffff;
	position: fixed;
	z-index: 10;
	left: 0;
	bottom: 0;
	padding: 15rpx 32rpx 0 32rpx;
	box-sizing: border-box;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05); // 添加顶部阴影

	.fixeView-item {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: var(--primary-color);
		border-radius: 40rpx;
		font-weight: 500;
		font-size: 30rpx;
		color: #ffffff;

		// 添加点击反馈
		&:active {
			opacity: 0.9;
			transform: scale(0.99);
		}
	}
}
</style>
