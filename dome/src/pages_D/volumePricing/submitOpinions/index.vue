<template>
	<view class="header-from">
		<view class="form-item">
			<view class="label">
				<view class="label-name">选择高速<text class="required">*</text></view>
			</view>
			<picker @change="changeType" :range="gslist" range-key="name" :value="gslist.findIndex((item) => item.data === gaosuid)">
				<view class="box-right border_b" @tap="chooseHighway">
					<input class="input" :placeholder="highwayError || '请选择通行高速'" placeholder-class="placeholder" disabled />
					<view wx:if="highwayError" class="error-message">{{ highwayError }}</view>
					<image :src="`${imgUrl}/wximage/trip-pro/activity/etc-appoint-arr-right.png`" class="arrow"></image>
				</view>
			</picker>
		</view>

		<view class="form-item">
			<view class="label">
				<view class="label-name">选择路段<text class="required">*</text></view>
			</view>
			<view @tap="tipsEvt">
				<picker
					@change="changeTypeludun"
					:disabled="luduanlist.length === 0"
					:range="luduanlist"
					range-key="name"
					:value="luduanlist.findIndex((item) => item.id === roadId)"
				>
					<view class="box-right" :class="{ border_b: roadId }">
						<input class="input" :placeholder="sectionError || '请选择通行路段'" placeholder-class="placeholder" disabled @tap="chooseSection" />
						<view class="error-message" v-if="sectionError">{{ sectionError }}</view>
						<image :src="`${imgUrl}/wximage/trip-pro/activity/etc-appoint-arr-right.png`" class="arrow"></image>
					</view>
				</picker>
			</view>
		</view>

		<view class="form-item" v-if="roadId">
			<view class="label">
				<view class="label-name">选择车辆<text class="required">*</text></view>
			</view>
			<picker
				@change="changeTypecarlist"
				:range="carlist"
				range-key="vehicleNumber"
				:value="carlist.findIndex((item) => item.vehicleNumber === carId)"
			>
				<view class="box-right" @tap="chooseVehicle">
					<input class="input" :placeholder="carError || '请选择您的车辆'" placeholder-class="placeholder" disabled />
					<view class="error-message" v-if="carError">{{ carError }}</view>
					<image :src="`${imgUrl}/wximage/trip-pro/activity/etc-appoint-arr-right.png`" class="arrow"></image>
				</view>
			</picker>
		</view>
	</view>

	<view class="box-input-updata">
		<view class="section feedback-content">
			<view class="title">
				<image :src="`${imgUrl}volumePricing/fankui.png`" class="icon"></image>
				<text>反馈内容</text>
				<text class="required">*</text>
			</view>
			<view class="options">
				<view
					v-for="item in tablist"
					:key="item.data"
					class="option-btn"
					:class="[feedBackType === item.data ? 'red' : 'gray']"
					@tap="selectOption(item.data)"
				>
					{{ item.name }}
				</view>
			</view>
		</view>

		<view class="section1 feedback-input">
			<view class="input-area">
				<image :src="`${imgUrl}volumePricing/qianbi-icon.png`" class="icon"></image>
				<textarea class="input1" :placeholder="placeholderText" v-model="feedbackText" @input="onFeedbackInput" />
				<!-- <view class="voice-icon-box" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
					<image :src="`${imgUrl}volumePricing/huatong-icon.png`" class="voice-icon" />
					<view v-if="showPopup" class="recording-popup">
						<view class="popup-content">
							<image class="popup-content-backg" :src="`${imgUrl}static/dh_sp_back.png`" mode=""></image>
							<image class="popup-content-line" :src="`${imgUrl}static/dh_sp_line.png`" mode=""></image>
							<view class="popup-content-text">{{ popupText }}</view>
							<image class="popup-content-icon" :src="`${imgUrl}static/dh_sp_see.png`" mode=""></image>
						</view>
					</view>
				</view> -->
			</view>
		</view>

		<view class="upload-area">
			<block v-if="img">
				<view class="video-container">
					<image class="uploaded-image" :src="img" mode="aspectFill"></image>
					<view class="delete-icon" @tap="removeimg">
						<view class="delete-x">×</view>
					</view>
				</view>
			</block>
			<view class="upload-btn" @tap="chooseImage">
				<image :src="`${imgUrl}volumePricing/updata-tu.png`" class="updata-icon"></image>
				<text>上传照片</text>
			</view>
			<block v-if="videoPath">
				<view class="video-container">
					<video
						:src="videoPath"
						controls
						autoplay="false"
						loop="false"
						muted="false"
						class="uploaded-uploaded"
						style="width: 154rpx; height: 154rpx"
					></video>
					<view class="delete-icon" @tap="removeVideo">
						<view class="delete-x">×</view>
					</view>
				</view>
			</block>
			<view class="upload-btn" @tap="choosevideo">
				<image :src="`${imgUrl}volumePricing/updata-vol.png`" class="updata-icon"></image>
				<text>上传视频</text>
			</view>
		</view>
	</view>

	<view class="footer-box">
		<view class="message-section">
			<view class="title1">
				<image :src="`${imgUrl}volumePricing/yiwen-icon.png`" class="icon"></image>
				温馨提示：
			</view>
			<view class="message">
				<text>1. 您的反馈意见将会进入工单处理流程；</text>
				<text>2. 我们会通过消息提醒向您发送处理结果，您也可以在【意见反馈】查看工单处理状态。</text>
			</view>
		</view>
		<view class="submit-btn" @tap="handleSubmit">提交评价</view>
	</view>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
import { toast } from '@/utils/common';
import uploadFile from '@/utils/upload';
import { vehiclePageByRoadId, getgaosulist, getgaosuluduanlist, postvsaveFeedback, uploadMerchantImage, uploadVideo } from '@/api/volumePricing';

// 微信录音插件（在 UniApp 中，我们通常直接使用 uni.getRecorderManager）
// 如果必须使用插件，请确保已配置。这里我们先使用 uni 的原生 API。
const recorderManager = uni.getRecorderManager();

// --- 接口数据类型定义 ---
interface ListItem {
	data?: string;
	name: string;
	id?: string;
	roadCode1?: string;
	roadCode2?: string;
	roadName1?: string;
	roadName2?: string;
	vehicleNumber?: string;
	// ... 其他可能的字段
}
interface CarItem extends ListItem {
	vehicleNumber: string;
}

// --- 状态数据 (Ref/Reactive) ---
const gslist = ref<ListItem[]>([]); // 高速列表
const gaosuid = ref(''); // 选中的高速ID (data)
const luduanlist = ref<ListItem[]>([]); // 路段列表
const roadId = ref(''); // 选中的路段ID (id)
const luduanId1 = ref(''); // 路段Code 1
const luduanId2 = ref(''); // 路段Code 2
const carlist = ref<CarItem[]>([]); // 车辆列表
const carId = ref(''); // 选中的车牌号 (vehicleNumber)
const tablist = ref<ListItem[]>([]); // 反馈类型列表
const feedBackType = ref(''); // 选中的反馈类型

const feedbackText = ref(''); // 反馈内容
const img = ref(''); // 图片URL
const imagsData = ref<any>({});
const videoPath = ref(''); // 视频URL

// 校验错误信息
const highwayError = ref('');
const sectionError = ref('');
const carError = ref('');

// 录音相关状态
const isRecording = ref(false); // 是否正在录音
const isSlideOut = ref(false); // 是否上滑取消
const showPopup = ref(false); // 是否显示录音弹窗
const popupText = ref('上滑取消'); // 弹窗提示文本
const isLocked = ref(false); // 防频发锁
const hasRecordAuth = ref(false); // 录音权限状态
const startY = ref(0); // 触摸起始Y坐标
const RECORD_COOLDOWN = 500; // 录音冷却时间（ms）
const placeholderText = ref('请输入您的反馈内容');
const startTime = ref(0); // 触摸开始时间

// --- 逻辑函数 ---

/** 获取车辆列表 */
const getcarlist = async () => {
	if (!roadId.value) return;
	const params = {
		pageNum: '1',
		pageSize: '10000',
		roadId: roadId.value,
	};
	const res = await vehiclePageByRoadId(params);
	carlist.value = res.page.records || [];
};

/** 选中车辆 */
const changeTypecarlist = (e: any) => {
	const index = e.detail.value;
	const list = carlist.value[index];
	carId.value = list.vehicleNumber;
	carError.value = list.vehicleNumber; // 车辆选择成功时，将车牌号显示在错误区域（这似乎是原逻辑中的一种展示方式）
};

/** 获取高速和反馈类型列表 */
const getgslist = async (type: string) => {
	const params = { type };
	const res = await getgaosulist(params);
	console.log('查询的高速和反馈', res);
	if (type === '10') {
		gslist.value = res.clazz || [];
		// 自动选中第一个高速
		if (gslist.value.length > 0) {
			const first = gslist.value[0];
			gaosuid.value = first.data || '';
			highwayError.value = first.name;
			getluduanlist();
		}
	} else if (type === 'yldjFeedback') {
		tablist.value = res.clazz || [];
	}
};

/** 选中高速 */
const changeType = (e: any) => {
	const index = e.detail.value;
	const list = gslist.value[index];
	gaosuid.value = list.data || '';
	highwayError.value = list.name;
	// 重置路段和车辆
	roadId.value = '';
	sectionError.value = '';
	carId.value = '';
	carError.value = '';
	luduanlist.value = [];
	carlist.value = [];
	getluduanlist();
};

/** 路段列表为空时提示 */
const tipsEvt = () => {
	if (luduanlist.value.length === 0) {
		toast('请申请路段');
	}
};

/** 选中路段 */
const changeTypeludun = (e: any) => {
	const index = e.detail.value;
	const list = luduanlist.value[index];
	luduanId1.value = list.roadCode1 || '';
	luduanId2.value = list.roadCode2 || '';
	sectionError.value = list.name;
	roadId.value = list.id || '';

	// 重置车辆
	carId.value = '';
	carError.value = '';

	getcarlist();
};

/** 获取路段列表 */
const getluduanlist = async () => {
	if (!gaosuid.value) return;
	const params = { highId: gaosuid.value };
	const res = await getgaosuluduanlist(params);
	luduanlist.value = (res.clazz || []).map((item: any) => ({
		...item,
		name: `${item.roadName1}-${item.roadName2}`,
	}));
	// 每次获取新路段后，清空已选路段状态
	roadId.value = '';
	sectionError.value = '';
	luduanId1.value = '';
	luduanId2.value = '';
	carId.value = '';
	carError.value = '';
	carlist.value = [];
};

/** 选中反馈类型 */
const selectOption = (data: string) => {
	feedBackType.value = data;
};

/** 反馈内容输入 */
const onFeedbackInput = (e: any) => {
	feedbackText.value = e.detail.value;
};

/** 图片上传 */
const chooseImage = () => {
	uni.chooseMedia({
		count: 1,
		mediaType: ['image'],
		sourceType: ['album', 'camera'],
		success: async (res: any) => {
			console.log('选择的图片', res);
			if (res.tempFiles.length > 0) {
				// toast('开始上传...');
				const res1 = await uploadFile({
					url: '/file/upload',
					filePath: res.tempFiles[0].tempFilePath,
				});
				console.log(res1, '上传的图片');
				img.value = res1.data.url;
			}
		},
		fail(err: any) {
			console.error('选择图片失败：', err);
		},
	});
};

/** 视频上传 */
const choosevideo = () => {
	uni.chooseVideo({
		sourceType: ['album', 'camera'],
		maxDuration: 60,
		camera: 'back',
		success: async (res: any) => {
			console.log('选择的视频', res);
			const res1 = await uploadFile({
				url: '/file/upload',
				filePath: res.tempFilePath,
			});
			console.log(res1, '上传的视频');
			videoPath.value = res1.data.url;
		},
		fail: (err: any) => {
			console.error('选择视频失败：', err);
			toast('选择失败');
		},
	});
};

/** 删除图片 */
const removeimg = () => {
	uni.showModal({
		title: '确认删除',
		content: '确定要删除这个图片吗？',
		success: (res) => {
			if (res.confirm) {
				img.value = '';
				imagsData.value = {};
				toast('已删除');
			}
		},
	});
};

/** 删除视频 */
const removeVideo = () => {
	uni.showModal({
		title: '确认删除',
		content: '确定要删除这个视频吗？',
		success: (res) => {
			if (res.confirm) {
				videoPath.value = '';
				toast('已删除');
			}
		},
	});
};

/** 提交表单 */
const handleSubmit = async () => {
	// 表单校验
	if (!gaosuid.value) return toast('请选择高速');
	if (!luduanId1.value) return toast('请选择路段');
	if (!carId.value) return toast('请选择车辆');
	if (!feedbackText.value) return toast('请输入反馈内容');
	if (!feedBackType.value) return toast('请选择反馈类型'); // 补充反馈类型校验

	// 提交参数
	const params = {
		highId: gaosuid.value,
		vehicleNumber: carId.value,
		roadCode1: luduanId1.value,
		roadCode2: luduanId2.value,
		content: feedbackText.value,
		imgUrl: img.value,
		videoUrl: videoPath.value,
		feedBackType: feedBackType.value,
	};

	const res = await postvsaveFeedback(params);
	console.log('反馈提交', res);
	toast('提交成功');
	uni.navigateBack();
	// 提交成功后重置表单
	feedbackText.value = '';
	img.value = '';
	videoPath.value = '';
	// 错误提示清空
	highwayError.value = '';
	sectionError.value = '';
	carError.value = '';
	feedBackType.value = '';
};

// --- 录音核心逻辑 ---

/** 检查录音权限 */
const checkRecordPermission = (): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		// UniApp 统一获取权限
		uni.getSystemInfo({
			success: (info) => {
				if (info.platform === 'web') {
					// Web 平台可能不支持或需要特殊处理
					return resolve(false);
				}

				uni.authorize({
					scope: 'scope.record',
					success: () => {
						hasRecordAuth.value = true;
						resolve(true);
					},
					fail: (err) => {
						console.error('授权失败:', err);
						hasRecordAuth.value = false;
						resolve(false);
					},
				});
			},
		});
	});
};

/** 初始化录音管理器事件监听 */
const initRecord = () => {
	// 录音开始
	recorderManager.onStart(() => {
		console.log('成功开始识别');
		isRecording.value = true;
		isSlideOut.value = false;
		popupText.value = '上滑取消';
		placeholderText.value = '正在聆听...';
	});

	// 实时识别结果（原代码中未用于更新 v-model，这里也只做 log）
	recorderManager.onRecognize((res: any) => {
		console.log('实时识别结果：', res.result);
		// feedbackText.value += res.result; // 如果需要实时更新
	});

	// 录音结束
	recorderManager.onStop((res: any) => {
		isRecording.value = false;
		showPopup.value = false;
		placeholderText.value = '请输入您的反馈内容';

		if (!res.tempFilePath) return toast('录音失败');
		if ((res.duration || 0) < 800) return toast('录音时间太短');
		if (isSlideOut.value) return toast('已取消录音');

		// 将识别结果添加到输入框
		feedbackText.value += res.result || '';
	});

	// 录音错误
	recorderManager.onError((err: any) => {
		console.error('录音错误：', err);
		isRecording.value = false;
		showPopup.value = false;
		isLocked.value = false;
		placeholderText.value = '请输入您的反馈内容';
		toast(err.msg || '录音出错');
	});
};

/** 开始录音 */
const startRecord = () => {
	console.log('开始录音');
	// 这里的 startRecord 不应该在 onTouchStart 中被立即调用，
	// 而是应该作为 long-press 的 action。但原代码是立即调用，我们遵循其逻辑，并进行防抖/防锁。

	if (isLocked.value || isRecording.value) return;

	// 启动录音的 UI 状态
	showPopup.value = true;
	isLocked.value = true;
	startY.value = 0; // 重置 Y 坐标

	try {
		// 启动录音（最长30秒，中文识别）
		recorderManager.start({
			duration: 30000,
			format: 'mp3', // 最好指定格式
			lang: 'zh_CN',
		});
	} catch (err) {
		console.error('启动录音失败：', err);
		showPopup.value = false;
		isLocked.value = false;
		toast('启动录音失败');
	}
};

/** 取消录音 */
const cancelRecord = () => {
	if (!isRecording.value) return;
	isRecording.value = false;
	showPopup.value = false;
	recorderManager.stop(); // 调用 stop 会触发 onStop，并在 onStop 中处理 isSlideOut 的逻辑
};

/** 停止录音（正常提交） */
const stopRecord = () => {
	if (!isRecording.value) return;
	recorderManager.stop();
};

/** 触摸开始（按下语音按钮） */
const onTouchStart = async (e: any) => {
	if (isLocked.value) return;

	startTime.value = new Date().getTime(); // 记录触摸时间

	// 检查并请求录音权限
	const hasPermission = await checkRecordPermission();
	if (!hasPermission) {
		uni.showModal({
			title: '权限提醒',
			content: '需要录音权限才能使用语音输入功能，是否前往设置开启？',
			success: (res) => {
				if (res.confirm) {
					uni.openSetting(); // 引导用户去设置页
				}
			},
		});
		return;
	}

	// 记录触摸起始位置
	startY.value = e.touches[0].clientY;

	// 立即启动录音（这是原JS代码的逻辑）
	startRecord();
};

/** 触摸移动（判断是否上滑取消） */
const onTouchMove = (e: any) => {
	if (!isRecording.value) return;

	const currentY = e.touches[0].clientY;
	const moveY = startY.value - currentY; // 向上为正

	if (moveY > 60 && !isSlideOut.value) {
		// 上滑取消状态
		isSlideOut.value = true;
		popupText.value = '松手取消';
	} else if (moveY <= 60 && isSlideOut.value) {
		// 移回状态
		isSlideOut.value = false;
		popupText.value = '上滑取消';
	}
};

/** 触摸结束/中断（停止/取消录音） */
const onTouchEnd = () => {
	showPopup.value = false; // 隐藏弹窗

	const endTime = new Date().getTime();

	// 优化：处理短按（防误触）逻辑
	if (endTime - startTime.value < 300) {
		// 短按，直接取消录音，不触发 onStop
		if (isRecording.value) {
			cancelRecord(); // 在这里直接调用 uni.getRecorderManager().stop()
			toast('录音时间太短');
		}
	}

	if (!isRecording.value) return;

	// 根据上滑状态决定停止还是取消
	if (isSlideOut.value) {
		cancelRecord(); // 上滑取消，会停止录音，onStop 中会判断 isSlideOut
	} else {
		stopRecord(); // 正常松手，会停止录音
	}

	// 冷却期：防止短时间重复触发
	setTimeout(() => {
		isLocked.value = false;
	}, RECORD_COOLDOWN);
};

// --- 生命周期钩子 ---

onLoad(() => {
	getgslist('10'); // 获取高速列表
	getgslist('yldjFeedback'); // 获取反馈类型列表
	// initRecord(); // 初始化录音管理器
	// checkRecordPermission(); // 在 onTouchStart 中检查权限
});

onMounted(() => {
	// onMounted 适合用于访问 DOM，在 UniApp 中较少使用，但保留以防万一
});

// --- 原代码中未绑定的点击事件，但为了完整性保留 ---
const chooseHighway = () => {
	console.log('chooseHighway tapped');
};
const chooseSection = () => {
	console.log('chooseSection tapped');
};
const chooseVehicle = () => {
	console.log('chooseVehicle tapped');
};
</script>

<style scoped>
/* 容器 */
.header-from {
	padding: 30rpx 30rpx 0;
	background-color: #fff;
}

page {
	background: #f4f4f4;
}

/* 表单项 */
.form-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
	position: relative;
	margin-top: 30rpx;
}

.label {
	font-size: 32rpx;
	color: #3d3d3d;
	display: flex;
}

.label-name {
	width: 160rpx;
}

.required {
	color: #ff4500;
	font-size: 32rpx;
	margin-left: 10rpx;
	/* margin-right: 43rpx; */
}

.input {
	font-size: 28rpx;
	color: #666;
	text-align: left;
	padding-right: 60rpx;
}

.input1 {
	font-size: 28rpx;
	color: #666;
	text-align: left;
	height: 200rpx;
	padding-right: 60rpx;
}

.arrow {
	width: 16rpx;
	height: 22rpx;
}

.placeholder {
	font-weight: 400;
	font-size: 28rpx;
	color: #d6d6d6;
}

.error-message {
	font-size: 28rpx;
	font-weight: 700;

	color: #000000;
}

.box-right {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 500rpx;
	padding-bottom: 40rpx;
}

.border_b {
	border-bottom: 1rpx solid #d8d8d8;
}

/* 容器 */
.box-input-updata {
	background-color: #f8f8f8;
	padding-top: 20rpx;
}

/* 分区 */
.section {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 30rpx;
}

/* 反馈内容标题 */
.title {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
}

.required {
	color: #ff4500;
	font-size: 32rpx;
	margin-left: 10rpx;
}

/* 选项按钮 */
.options {
	display: flex;
	flex-wrap: wrap;
	padding-bottom: 30rpx;
	border-bottom: 1rpx solid #d8d8d8;
}

.option-btn {
	height: 56rpx;
	line-height: 56rpx;
	margin-right: 30rpx;
	margin-bottom: 20rpx;
	padding: 0rpx 20rpx;
	border-radius: 28rpx;
	font-size: 25rpx;
}

.red {
	background-color: #ffe6e6;
	color: #ff4500;
}

.gray {
	background-color: #f5f5f5;
	color: #666;
}

/* 反馈内容输入 */
.input-area {
	position: relative;
	display: flex;
	height: 200rpx;
}

.input {
	width: 100%;
	font-size: 28rpx;
	color: #333;
}

.clear-icon {
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 66rpx;
	height: 66rpx;
}

.section1 {
	padding: 0rpx 30rpx 30rpx 30rpx;
	background-color: #fff;
}

.voice-btn {
	display: flex;
	justify-content: flex-end;
}

.voice-btn .icon {
	width: 60rpx;
	height: 60rpx;
}

/* 图片上传区域 */
.upload-area {
	display: flex;
	flex-wrap: wrap;
	padding: 30rpx;
	background-color: #fff;
}

.uploaded-image,
.upload-btn {
	width: 150rpx;
	height: 150rpx;
	margin-right: 32rpx;
	margin-bottom: 20rpx;
	border: 1rpx solid #ddd;
	border-radius: 10rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #f4f4f4;
	font-weight: 400;
	font-size: 24rpx;
	color: #000000;
}

.video-container {
	position: relative;
	width: 150rpx;
	height: 150rpx;
	margin-right: 32rpx;
	margin-bottom: 20rpx;
}

.delete-icon {
	position: absolute;
	top: -20rpx;
	right: -20rpx;
	width: 50rpx;
	height: 50rpx;
	background-color: #fa3534;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
}

/* × 符号样式 */
.delete-x {
	color: #fff;
	font-size: 40rpx;
	font-weight: bold;
	line-height: 1;
	transform: translateY(-1rpx);
	/* 微调居中 */
}

.upload-btn .icon {
	width: 60rpx;
	height: 60rpx;
}

/* 容器 */
.footer-box {
	padding: 23rpx;
}

/* 提示信息区域 */
.message-section {
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.title1 {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #333;
	margin-bottom: 20rpx;
}

.message {
	font-size: 24rpx;
	color: #868686;
	line-height: 48rpx;
}

.message text {
	display: block;
}

/* 提交按钮 */
.submit-btn {
	margin: 0 auto;
	width: 600rpx;
	height: 90rpx;
	background: linear-gradient(270deg, #fd7410 0%, #f49f42 100%);
	color: #fff;
	font-size: 36rpx;
	border-radius: 42rpx;
	line-height: 90rpx;
	text-align: center;
}

.updata-icon {
	width: 108rpx;
	height: 72rpx;
}

/* ---------------------- 新增：录音相关样式 ---------------------- */
/* 语音按钮样式（替换原 clear-icon） */
.voice-icon-box {
	display: flex;
	align-items: center;
}

.voice-icon {
	width: 68rpx;
	height: 66rpx;
}

/* 录音弹窗样式 */
.recording-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: flex-end;
	justify-content: center;
	z-index: 999;
	/* 确保弹窗在最上层 */
}

.popup-content {
	width: 100%;
	height: 55%;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.popup-content-backg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	/* 背景图置于底层 */
}

.popup-content-line {
	width: 194rpx;
	height: 30rpx;
	margin-bottom: 32rpx;
}

.popup-content-text {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 32rpx;
}

.popup-content-icon {
	width: 216rpx;
	height: 216rpx;
}
</style>
