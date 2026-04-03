<template>
	<view class="record-button-container" @click="toggleRecording">
		<!-- 录音按钮 -->
		<!-- <view class="reText">{{ buttonText }}</view> -->

		<!-- 弹窗提示：点击任意位置即结束录音 -->
		<view v-if="showPopup" class="recording-popup" @click.stop="stopRecord">
			<view class="popup-content">
				<image class="popup-content-backg" :src="`${imgUrl}static/dh_sp_back.png`" mode=""></image>
				<image class="popup-content-line" :src="imgUrl + 'static/dh_sp_line.png'" mode=""></image>
				<view class="popup-content-text">{{buttonText}}</view>
				<image class="popup-content-icon" :src="imgUrl + 'static/dh_sp_see.png'" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { imgUrl } from '@/config';
import { showToast } from '@/utils/util';

const emits = defineEmits(['change']);

var plugin = requirePlugin("WechatSI");
let recorderManager = plugin.getRecordRecognitionManager();

const isRecording = ref(false);
const showPopup = ref(false);
const isLocked = ref(false); // 防频繁点击
const hasRecordAuth = ref(false);
const RECORD_COOLDOWN = 600;
const buttonText = ref('点击说话');
const voiceState = ref('')

// 开始录音
const startRecord = () => {
	if (isLocked.value || isRecording.value) return;

	isLocked.value = true;
	isRecording.value = true;
	showPopup.value = true;
	buttonText.value = '录音中...';

	try {
		recorderManager.start({
			duration: 5000,
			lang: "zh_CN",
		});
	} catch (err) {
		console.error('recorderManager.start failed', err);
		resetState();
	}
};

// 停止录音（发送）
const stopRecord = () => {
	showPopup.value = false;
	if (!isRecording.value) return;

	isRecording.value = false;
	showPopup.value = false;
	buttonText.value = '点击说话';

	recorderManager.stop();

	// 冷却期
	setTimeout(() => {
		isLocked.value = false;
	}, RECORD_COOLDOWN);
};

// 重置状态（用于错误处理）
const resetState = () => {
	isRecording.value = false;
	showPopup.value = false;
	isLocked.value = false;
	buttonText.value = '点击说话';
};

// 切换录音状态：点击一次开始，再点弹窗结束
const toggleRecording = async () => {
	if (showPopup.value) {
		// 如果弹窗已显示，说明正在录音，此时点击应结束（但这个逻辑其实由弹窗@click处理了）
		// 所以这里只处理“开始”
		return;
	}

	if (isLocked.value) return;

	try {
		await checkRecordPermission();
		if (!hasRecordAuth.value) return;
		startRecord();
	} catch (error) {
		console.error('录音权限异常', error);
	}
};

// 初始化录音回调
const initRecord = () => {
	recorderManager.onStart = (res) => {
		console.log('正在录音', res);
	};

	recorderManager.onRecognize = (res) => {
		console.log('实时结果',res);
		// 实时识别结果（可选）
	};

	recorderManager.onStop = (res) => {
		console.log('结束录音', res)
		if (!res.tempFilePath) {
			showToast('录音失败');
			return;
		}

		const duration = res.duration || 0;
		if (duration < 300) {
			showToast('录音时间太短');
			return;
		}

		emits('change', {
			success: true,
			filePath: res.tempFilePath,
			voiceState: res.result,
			duration: res.duration,
			size: res.fileSize
		});
	};

	recorderManager.onError = (err) => {
		console.error('RecorderManager Error:', err);
		resetState();
		showToast(err.msg || '录音出错');
	};
};

// 检查录音权限
const checkRecordPermission = () => {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success: (res) => {
				const isAuth = res.authSetting['scope.record'] ?? false;
				if (isAuth) {
					hasRecordAuth.value = true;
					resolve(true);
				} else {
					uni.authorize({
						scope: 'scope.record',
						success: () => {
							hasRecordAuth.value = true;
							resolve(true);
						},
						fail: () => {
							uni.showModal({
								title: '需要录音权限',
								content: '请在设置中开启麦克风权限',
								confirmText: '去设置',
								success: (modalRes) => {
									if (modalRes.confirm) {
										uni.openSetting({
											success: (settingRes) => {
												const granted = settingRes.authSetting['scope.record'];
												hasRecordAuth.value = granted;
												resolve(granted);
											}
										});
									} else {
										reject(new Error('用户拒绝授权'));
									}
								}
							});
						}
					});
				}
			},
			fail: () => reject(new Error('获取权限失败'))
		});
	});
};
const openRecorder = ()=>{
	toggleRecording();
	voiceState.value  = ''
}
onMounted(() => {
	initRecord();
});
defineExpose({
	openRecorder,
});
</script>

<style scoped lang="scss">
.record-button-container {
	position: relative;
	display: inline-block;
}

.reText {
	width: 546rpx;
	text-align: center;
	font-weight: bold;
	font-size: 32rpx;
	color: #FFFFFF;
}

.recording-popup {
	width: 100%;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: flex-end;
	justify-content: center;
	z-index: 100;
}

.popup-content {
	width: 100%;
	height: 450rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;

	.popup-content-backg {
		width: 100%;
		height: 450rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.popup-content-line {
		width: 194rpx;
		height: 30rpx;
	}

	.popup-content-text {
		font-weight: 500;
		font-size: 26rpx;
		color: #666666;
		padding: 32rpx 0;
	}

	.popup-content-icon {
		width: 216rpx;
		height: 216rpx;
	}
}
</style>