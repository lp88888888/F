<!-- SingleVideoUploader.vue -->
<template>
	<view class="form-video">
		<!-- 已上传视频 -->
		<view v-if="hasVideo" class="form-video-item">
			<video class="my-video" :src="videoUrl" @error="handleVideoError" controls show-center-play-btn>
				<cover-image class="img-del" :src="imgUrl + 'static/img-del-icon.png'" @click="deleteVideo" />
			</video>
		</view>
		<!-- 未上传时：点击上传 -->
		<view v-else class="add-view" @click="chooseVideo">
			<image class="icon" :src="imgUrl + 'video-icon.png'" mode="aspectFit" />
			<text class="add-text">上传视频</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	import {
		toast
	} from '@/utils/common';
	import {
		imgUrl
	} from '@/config';
	import uploadFile from '@/utils/upload';

	const props = defineProps({
		// 是否已存在视频（用于回显）
		modelValue: {
			type: String,
			default: '',
		},
	});

	const emits = defineEmits(['update:modelValue', 'uploadSuccess', 'delete']);

	// 当前视频 URL（内部状态）
	const internalVideo = ref(props.modelValue);

	// 是否有视频
	const hasVideo = computed(() => !!internalVideo.value);

	// 视频完整 URL（用于展示）
	const videoUrl = computed(() => internalVideo.value);

	const chooseVideo = () => {
		uni.chooseVideo({
			sourceType: ['album', 'camera'],
			maxDuration: 60,
			camera: 'back',
			success: async (res) => {
				if (res.errMsg !== 'chooseVideo:ok') return;

				const filePath = res.tempFilePath;

				try {
					const fileInfo = await getFileInfo(filePath);
					const fileSizeInMB = fileInfo.size / (1024 * 1024);

					if (fileSizeInMB > 20) {
						toast('视频不能超过 20MB');
						return;
					}

					// 文件合格，开始上传
					await handleUpload(filePath);

					// 如需上传封面（可选）
					// if (res.thumbTempFilePath) {
					//   await uploadThumb(res.thumbTempFilePath);
					// }
				} catch (error) {
					console.error('获取文件信息失败:', error);
					toast('无法读取视频文件信息');
				}
			},
			fail: (err) => {
				console.error('选择视频失败:', err);
				toast('选择视频失败');
			},
		});
	};
	const getFileInfo = (filePath) => {
		return new Promise((resolve, reject) => {
			uni.getFileInfo({
				filePath,
				success: resolve,
				fail: reject,
			});
		});
	};
	// 上传视频
	const handleUpload = async (filePath) => {
		uni.showLoading({
			title: '正在上传...',
			mask: true
		});

		try {
			const res = await uploadFile({
				url: '/file/upload',
				filePath,
			});

			uni.hideLoading(); // 上传完成，隐藏

			if (res?.code === 200 && res.data?.url) {
				const videoUrl = res.data.url;
				internalVideo.value = videoUrl;
				emits('update:modelValue', videoUrl);
				emits('uploadSuccess', {
					url: videoUrl,
					data: res.data
				});
			} else {
				toast(res?.msg || '上传失败');
			}
		} catch (error) {
			uni.hideLoading(); // 出错也要隐藏
			console.error('上传失败:', error);
			toast('上传失败，请重试');
		}
	};
	// 删除视频
	const deleteVideo = () => {
		internalVideo.value = '';
		emits('update:modelValue', '');
		emits('delete');
	};

	// 视频错误处理
	const handleVideoError = (e) => {
		console.warn('视频加载失败:', e);
		toast('视频无法播放');
	};
</script>

<style lang="scss" scoped>
	.form-video {
		width: 100%;

		.form-video-item {
			width: 180rpx;
			height: 180rpx;
			position: relative;

			.my-video {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}

			.img-del {
				width: 56rpx;
				height: 56rpx;
				position: absolute;
				right: -18rpx;
				top: -18rpx;
				z-index: 10;
			}
		}

		.add-view {
			width: 180rpx;
			height: 180rpx;
			border-radius: 20rpx;
			background: #f8f9fa;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			.icon {
				width: 50rpx;
				height: 50rpx;
			}

			.add-text {
				margin-top: 10rpx;
				font-size: 24rpx;
				color: #333;
			}
		}
	}
</style>