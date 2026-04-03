<template>
	<view class="pageView" :data-theme="pageTheme" >
		<view class="card">
			<view class="scoreView" v-for="(item, index) in evaluatelist" :key="index">
				<text class="scoreView-label fn-6-28-000">{{ item.dimensionName }}</text>
				<up-rate count="5" v-model="item.score" size="25" activeColor="#FF9600"
					inactiveColor='#FF9600'></up-rate>
			</view>
		</view>
		<up-gap height="12"></up-gap>
		<view class="card">
			<view class="fn-6-28-000">服务感受</view>
			<up-gap height="10"></up-gap>
			<view class="textAreView">
				<up-textarea v-model="remarks" placeholder="点击输入正文，您可在此分享您的看车感受"
					:customStyle="{backgroundColor:'transparent',fontSize:'28rpx'}" border="none"></up-textarea>
			</view>
		</view>
		<view class="fixeView">
			<view class="fixeView-item" @click="submit">立即提交</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { debounce } from '@/utils/common';
	import { sysReview, bizType } from '@/api/car';
	import { onLoad } from '@dcloudio/uni-app';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	// 定义评分项数据结构接口（增强类型安全）
	interface EvaluateItem {
		dimensionName : string;
		dimensionConfigId : string; // 维度配置ID，用于提交时标识评分项
		score : number; // 评分值
	}

	const remarks = ref<string>('');
	const bizId = ref<any>('');
	const merchantId = ref<any>('');
	const evaluatelist = ref<EvaluateItem[]>([]); // 明确类型为评分项数组
	const type = ref<string>('');

	// 提交评价接口调用
	const sysReviewFun = async () => {
		// 验证是否所有评分项都已选择
		const unratedItems = evaluatelist.value.filter(item => item.score === 0);
		if (unratedItems.length > 0) {
			uni.showToast({
				title: `请为【${unratedItems[0].dimensionName}】评分`,
				icon: 'none'
			});
			return;
		}
		if (!remarks.value) {
			uni.showToast({
				title: '请输入服务感受',
				icon: 'none'
			});
			return;
		}
		// 构建评分项数组（按接口要求格式）
		const pjList = evaluatelist.value.map(item => ({
			bizType: item.bizType,
			dimensionName: item.dimensionName,
			dimensionConfigId: item.id,
			score: item.score.toString() // 转换为字符串类型，根据接口要求调整
		}));

		try {
			const params = {
				bizType: type.value,
				bizId: bizId.value,
				merchantId: merchantId.value,
				content: remarks.value,
				sysReviewDimensionScoreDtoList: pjList // 添加评分项数组
			};

			const res = await sysReview(params);
			if (res.code == 200) {
				uni.showToast({ title: '评价提交成功', icon: 'success' });
				// 延迟返回上一页
				setTimeout(() => {
					if (type.value == 'NEW_CAR_APPOINTMENT') {
						uni.navigateTo({
							url: '/pages_D/newCar/orderList'
						})
					} else if (type.value == 'OLD_CAR_APPOINTMENT') {
						uni.navigateTo({
							url: '/pages_D/usedCar/orderList'
						})
					} else if (type.value == 'CAR_RENTAL_APPOINTMENT') {
						uni.navigateTo({
							url: '/pages_B/rentCar/appointment'
						})
					} else {
						uni.navigateTo({
							url: '/pages_D/repair/carRepair'
						})
					}

				}, 1000);
			} else {
				uni.showToast({ title: res.message || '提交失败', icon: 'none' });
			}
		} catch (error) {
			console.error('评价提交失败:', error);
		}
	};

	// 防抖处理的提交方法
	const submit = debounce(() => {
		sysReviewFun();
	}, 800);

	// 页面加载时获取评分维度配置
	const bizTypeFun = async () => {
		try {
			const res = await bizType(type.value);
			// 初始化评分项的分数为0
			evaluatelist.value = res.rows.map((item : any) => ({
				...item,
				score: 0
			}));
		} catch (error) {
			console.error('获取评分维度失败:', error);
			uni.showToast({ title: '加载评分项失败', icon: 'none' });
		}
	};

	// 页面加载时获取参数并初始化
	onLoad((options) => {
		bizId.value = options.id;
		merchantId.value = options.merchantId;

		// 根据类型参数设置业务类型
		switch (options.type) {
			case '1':
				type.value = 'NEW_CAR_APPOINTMENT'; // 新车预约
				break;
			case '2':
				type.value = 'OLD_CAR_APPOINTMENT'; // 二手车
				break;
			case '3':
				type.value = 'AUTO_REPAIR_APPOINTMENT'; // 汽车维修
				break;
			case '4':
				type.value = 'CAR_RENTAL_APPOINTMENT'; // 租车
				break;
			default:
				type.value = '';
		}

		if (type.value) {
			bizTypeFun();
		} else {
			uni.showToast({ title: '参数错误', icon: 'none' });
		}
	});
</script>

<style lang="scss">
	page {
		background: var(--head-color);
		padding-bottom: 158rpx; // 预留底部按钮区域高度
	}

	.pageView {
		padding: 30rpx 32rpx;
		box-sizing: border-box;
	}

	.card {
		padding: 30rpx 35rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
	}

	.scoreView {
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: space-between; // 让评分项和星星靠右对齐

		.scoreView-label {
			width: 180rpx; // 加宽标签宽度，避免文字换行
		}
	}

	.fn-6-28-000 {
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;
	}

	.textAreView {
		background: #F7F8F9;
		border-radius: 20rpx;
		padding: 15rpx;
		box-sizing: border-box;
		min-height: 200rpx; // 给文本域设置最小高度
	}

	.fixeView {
		width: 100%;
		height: 158rpx;
		background: #FFFFFF;
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
			color: #FFFFFF;

			// 添加点击反馈
			&:active {
				opacity: 0.9;
				transform: scale(0.99);
			}
		}
	}
</style>