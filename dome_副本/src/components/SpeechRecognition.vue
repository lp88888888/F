<template>
	<view class="mic" :style="{ height: screenHeight + 'px' }" v-if="props.show">
		<text></text>
		<view class="mic_main">
			<text class="mic_text">{{ queryText }}</text>
			<image class="speek_icon" :src="`${imgUrl}search_speech_icon.png`" mode=""></image>
			<text class="mic_text1">正在语音识别中~</text>
		</view>

		<uni-icons class="close_btn" type="close" size="30" color="#ffffff" @click="handleClose"></uni-icons>
	</view>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { imgUrl } from '../config';
import { toNav } from '@/utils/route';

const screenHeight = ref(0);
const queryText = ref('');

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
});

watch(
	() => props.show,
	(newVal) => {
		if (newVal) {
			speechStart();
		}
	},
	{ deep: true }
);

const speechTimeout = ref(null);
const speechStartTime = ref(0);
/* 
		设置超时时间 
		2026-01-12 修改由30s调整为6s
	 */
const startTiem = () => {
	console.log('------------开始退出计时-------------');
	// 设置20秒超时
	speechTimeout.value = setTimeout(() => {
		if (Date.now() - speechStartTime.value >= 10000) {
			speechStop();
		}
	}, 10000);
};
const clearTime = () => {
	console.log('------------清空倒计时-------------');
	clearTimeout(speechTimeout.value);
	speechTimeout.value = null;
};
// 说话
const speechStart = () => {
	console.log('开始录音');
	// if(isLoading.value) return;
	speechStartTime.value = Date.now();

	// 清除之前的定时器
	if (speechTimeout.value) {
		clearTime();
	}
	startTiem();
	console.log('---------------------------开始识别---------speechStart------------------------');
	plus.speech.startRecognize(
		{
			engine: 'baidu',
			lang: 'zh-cn',
			userInterface: false,
			continue: true,
			vadEos: 500,
			nbest: 1,
			punctuation: true,
			interimResults: true,
		},
		function (result) {
			console.log('实时识别：' + result);
			if (speechTimeout.value) {
				clearTime();
			}
			queryText.value = result;
			uni.setStorageSync('globalsearchval', result);
			speechStop();
			// #ifdef MP-WEIXIN
			toNav('/pages_E/digitalHuman/index');
			// #endif
			// #ifdef APP
			if (!result) {
			} else {
				console.log('讲话的语音', result);
				toNav('/pages_E/digitalHuman/openAi');
			}
			// #endif
		},
		function (error) {
			if (speechTimeout.value) {
				clearTime();
			}
			console.error('识别错误：', error);
		}
	);
};

// 停止
const speechStop = () => {
	console.log('停止录音');
	plus.speech.stopRecognize();
	queryText.value = '';
	emit('close', false);
};

const emit = defineEmits(['close']);
const handleClose = () => {
	speechStop();
	if (speechTimeout.value) clearTime();
};

onMounted(() => {
	screenHeight.value = uni.getSystemInfoSync().screenHeight;
	console.log('屏幕的高度', screenHeight.value);
	
});
</script>

<style lang="scss" scoped>
.mic {
	width: 750rpx;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 999999;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	overflow: hidden;
	padding-bottom: 100rpx;
	

	.mic_main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.speek_icon {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
		margin-top: 30rpx;
	}

	.mic_text,
	.mic_text1 {
		color: #ffffff;
	}

	.close_btn {
		// position: relative;
		// bottom: 100rpx;
	}
}
</style>
