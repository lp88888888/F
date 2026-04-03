<!-- components/PageDurationTracker.vue -->
<template>
	<view style="display: none;"></view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { onPageShow, onPageHide } from '@dcloudio/uni-app';
import { postinsert, getLookReadPoint, saveLookReadPoint } from '@/api/user';

const props = defineProps<{
	pageName: string;
	 type: {
	    type: String,
	    default: 'time' //  设置默认值
	  }
}>();

const startTime = ref<number | null>(null);
const hasReportedBasic = ref(false);     // 基础停留是否已上报
const hasReportedPoint = ref(false);     // 积分任务是否已上报
const pointConfig = ref<{ pageList: any[]; seconds: number; getPoint: boolean } | null>(null);

// 获取积分任务配置
const fetchPointConfig = async () => {
	if (!uni.getStorageSync('Token')) return;
	try {
		const res = await getLookReadPoint();
		pointConfig.value = res.data;
		console.log('[PageDuration] 获取阅读时长配置:', res.data);
	} catch (err) {
		console.warn('[PageDuration] 获取阅读配置失败:', err);
	}
};

// 获取已过去的时间（秒）
const getDuration = (): number => {
	if (startTime.value === null) return 0;
	return Math.round((Date.now() - startTime.value) / 1000);
};

// 上报基础停留时长（用于埋点分析）
const reportBasicDuration = async () => {
	if (hasReportedBasic.value || startTime.value === null) return;

	const duration = getDuration();
	hasReportedBasic.value = true;

	const uuid = uni.getStorageSync('session_uuid') || '';
	const params = {
		name: props.pageName,
		type: props.type || 'time',
		seconds: duration,
		deviceType: 'wx',
		sessionId: uuid
	};

	try {
		await postinsert(params);
		console.log('[PageDuration] 基础停留上报成功:', params);
	} catch (err) {
		console.error('[PageDuration] 基础停留上报失败:', err);
	}
};

// 检查并上报阅读积分任务
const tryReportPointTask = async () => {
	if (hasReportedPoint.value || !pointConfig.value || pointConfig.value.getPoint) return;

	const duration = getDuration();
	const { pageList, seconds: requiredSeconds } = pointConfig.value;

	const matchedItem = pageList.find((item: any) => item.name === props.pageName);
	if (matchedItem && duration >= requiredSeconds) {
		hasReportedPoint.value = true;
		try {
			const res = await saveLookReadPoint({
				pageRout: props.pageName,
				seconds: duration
			});
			console.log('[PageDuration] 阅读积分任务上报成功:', res);
		} catch (err) {
			console.error('[PageDuration] 阅读积分任务上报失败:', err);
			// 失败可考虑重试 or 保留状态下次再试（此处简化）
			hasReportedPoint.value = false;
		}
	}
};

// 停止计时并执行所有上报
const stopAndReport = () => {
	if (startTime.value === null) return;
	if (!uni.getStorageSync('Token')) return;
	reportBasicDuration();
	if (pointConfig.value) {
		tryReportPointTask();
	}

	startTime.value = null; // 重置
};

// 开始计时
const startTiming = () => {
	if (startTime.value === null) {
		startTime.value = Date.now();
		hasReportedBasic.value = false;
		hasReportedPoint.value = false;
	}
};

// ====== 生命周期 ======

onMounted(() => {
	startTiming();
	if (uni.getStorageSync('Token')){
		fetchPointConfig();
	}
});

// 页面卸载（组件销毁）
onUnmounted(() => {
	stopAndReport();
});

// 小程序/App：页面隐藏（切后台）
onPageHide(() => {
	stopAndReport();
});

// 小程序/App：页面显示（切回前台）
onPageShow(() => {
	// 如果之前已上报，重新开始计时
	if (hasReportedBasic.value || startTime.value === null) {
		startTiming();
	}
});

// H5：监听页面关闭/刷新
if (process.env.UNI_PLATFORM === 'h5') {
	const handleBeforeUnload = () => {
		stopAndReport();
	};
	window.addEventListener('beforeunload', handleBeforeUnload);
	onUnmounted(() => {
		window.removeEventListener('beforeunload', handleBeforeUnload);
	});
}
</script>