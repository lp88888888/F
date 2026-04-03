<template>
	<view class="container" :data-theme="pageTheme" >
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="表单" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<!-- 表单区域 -->
		<form class="form">
			<view class="form-items">
				<!-- 姓名 -->
				<view class="form-item">
					<text class="label">填报人 <text class="required">*</text></text>
					<template v-if="mode === 'edit'">
						<input class="input" v-model="formData.userName" placeholder="请输入姓名" />
					</template>
					<text v-else class="value-text">{{ delinfo.userName || '—' }}</text>
				</view>

				<!-- 联系方式 -->
				<view class="form-item">
					<text class="label">联系方式<text class="required">*</text></text>
					<template v-if="mode === 'edit'">
						<input class="input" v-model="formData.phone" maxlength="11" placeholder="请输入联系方式" />
					</template>
					<text v-else class="value-text">{{ delinfo.phone || '—' }}</text>
				</view>

				<!-- 上报事件类型 -->
				<view class="form-item">
					<text class="label">上报事件类型<text class="required">*</text></text>
					<template v-if="mode === 'edit'">
						<view style="display: flex;align-items: center;">
							<view style="width: 200rpx;">
								<up-picker-data v-model="formData.reportCategory" title="请选择事件类型" :options="eventTypes"
									@confirm="hendchange" valueKey="id" labelKey="name">
								</up-picker-data>
							</view>

							<up-icon name="arrow-right" color="#999999" size="24"></up-icon>
						</view>

					</template>
					<text v-else class="value-text">{{ delinfo.reportCategoryName || '—' }}</text>
				</view>

				<!-- 上报事件级别 -->
				<view class="form-item">
					<text class="label">上报事件类别<text class="required">*</text></text>
					<template v-if="mode === 'edit'">
						<view style="display: flex;align-items: center;">
							<view style="width: 200rpx;">
								<up-picker-data v-model="formData.reportType" title="请选择事件类别" :options="levels"
									valueKey="id" labelKey="name">
								</up-picker-data>
							</view>

							<up-icon name="arrow-right" color="#999999" size="24"></up-icon>
						</view>
					</template>
					<text v-else class="value-text">{{ delinfo.reportTypeName  || '—' }}</text>
				</view>

				<!-- 是否为路政道路拥堵 -->
				<view class="form-item">
					<text class="label">是否为路政道路拥堵<text class="required">*</text></text>
					<template v-if="mode === 'edit'">
						<view style="display: flex;align-items: center;">
							<view style="width: 200rpx;">

								<up-picker-data v-model="formData.blockStatus" title="请选择事件类别" :options="yesNoOptions"
									valueKey="id" labelKey="name">
								</up-picker-data>
							</view>

							<up-icon name="arrow-right" color="#999999" size="24"></up-icon>
						</view>
					</template>
					<text v-else class="value-text">{{ yesNoOptions[delinfo.blockStatus].name || '—' }}</text>
				</view>

				<!-- 阻断区域 -->
				<view class="form-item">
					<text class="label">阻断区域<text class="required">*</text></text>
					<template v-if="mode === 'edit'">
						<input class="input" v-model="formData.blockArea"  placeholder="请输入手面积" />
					</template>
					<text v-else class="value-text">{{ delinfo.blockArea || '—' }}</text>
				</view>
			</view>

			<!-- 图片上传 -->
			<view class="form-items">
				<view class="form-item" style="flex-direction: column; align-items: self-start;">
					<text class="label">上传不同角度的图片<text class="required">*</text><text
							style="font-weight: 400;font-size: 24rpx;color: #999999;">（至少2张）</text></text>
					<template v-if="mode === 'edit'">
						<view style="margin-top: 32rpx;">
							<FormFile :urls="imageList" :limit="2" @deleteFile="deleteFile" @uploadFile="uploadFile">
							</FormFile>
						</view>
					</template>

					<view v-else class="preview-images">
						<image v-for="(img, i) in delinfo.photoPaths" :key="'img-' + i" :src="img" mode="aspectFill"
							class="preview-image" @click="previewImage(img)"></image>
						<text v-if="delinfo.length === 0" class="empty-text">无</text>
					</view>
				</view>
			</view>

			<!-- 视频上传 -->
			<view class="form-items">
				<view class="form-item" style="flex-direction: column; align-items: self-start;">
					<text class="label">上传视频<text class="required">*</text></text>
					<template v-if="mode === 'edit'">
						<!-- <FormFile :urls="videoList" :limit="0" isType="video" @deleteFile="deletevideo"
							@uploadFile="uploadvideo"></FormFile> -->
						<SingleVideoUploader v-model="formData.videoPath" @upload-success="uploadvideo"
							@delete="deletevideo" />

					</template>

					<view v-else class="preview-images">
						<!-- <view v-for="(video, i) in videoList" :key="'vid-' + i" class="video-item"> -->
						<video id="myVideo" :src="delinfo.videoPath" controls show-center-play-btn
							style="width: 150rpx; height: 150rpx;"></video>
						<!-- </view> -->
						<text v-if="delinfo.videoPath === ''" class="empty-text">无</text>
					</view>
				</view>
				<view class="note">
					<text style="font-weight: 400;font-size: 24rpx;color: #999999;">提示：上传视频格式avi、MP4，大小不超过20mb</text>
				</view>
			</view>

			<!-- 评述描述 -->
			<view class="form-items">
				<view class="form-item" style="flex-direction: column; align-items: self-start;">
					<text class="label">详细描述</text>
					<template v-if="mode === 'edit'">
						<view class="textarea-wrapper">
							<textarea v-model="formData.description" class="textarea" placeholder="请填写问题描述"
								maxlength="200" :show-confirm-bar="false" />
							<text class="word-count">{{ formData.description.length }}/200</text>
						</view>
						<!-- 	<up-textarea v-model="formData.description" class="textarea" placeholder="请填写问题描述" count
							maxlength="200"></up-textarea> -->
					</template>
					<text v-else class="value-text description-text">{{ delinfo.description || '暂无内容' }}</text>
				</view>

				<!-- 地址与地图 -->
				<view class="form-item">
					<text class="label">地址<text class="required">*</text></text>
					<view class="map-container">
						<view style="display: flex;align-items: center;">
							<text v-if="mode === 'edit'">{{
							formData.locationAddress
						}}</text>
							<text v-else class="value-text">{{ delinfo.locationAddress }}</text>
							<text v-if="mode === 'edit'" class="map-btn" @click="openMap">选择地址</text>
						</view>

					</view>
				</view>

				<!-- 地图 -->
				<view class="form-item" style="flex-direction: column; align-items: self-start;">
					<view class="map-container-map">
						<map :latitude="currentLat" v-if="currentLat" :longitude="currentLng" :scale="scale" :markers="markers"
							style="width: 630rpx; height: 300rpx;" :show-location="mode === 'edit'" id="myMap"></map>
					</view>
				</view>

				<!-- 其他字段 -->
				<view class="form-item">
					<text class="label">高速名称<text class="required">*</text></text>
					<template v-if="mode === 'edit'">
						<input class="input" v-model="formData.highwayName" placeholder="请输入高速名称" />
					</template>
					<text v-else class="value-text">{{ delinfo.highwayName || '—' }}</text>
				</view>

				<view class="form-item">
					<text class="label">桩号<text class="required">*</text></text>
					<template v-if="mode === 'edit'">
						<input class="input" v-model="formData.pileNumber" placeholder="请输入桩号" />
					</template>
					<text v-else class="value-text">{{ delinfo.pileNumber || '—' }}</text>
				</view>

				<view class="form-item">
					<text class="label">方向<text class="required">*</text></text>
					<template v-if="mode === 'edit'">
						<input class="input" v-model="formData.direction" placeholder="请输入方向" />
					</template>
					<text v-else class="value-text">{{ delinfo.direction || '—' }}</text>
				</view>

				<view class="form-item">
					<text class="label">车道<text class="required">*</text></text>
					<template v-if="mode === 'edit'">
						<input class="input" v-model="formData.lane" placeholder="请输入车道" />
					</template>
					<text v-else class="value-text">{{ delinfo.lane || '—' }}</text>
				</view>
			</view>

			<!-- 提交按钮（仅编辑模式） -->
			<button v-if="mode === 'edit'" @click="submitflie" class="submit-btn">立即上报</button>
		</form>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		onMounted
	} from 'vue';
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app';
	import FormFile from '@/components/FormFile.vue';
	import SingleVideoUploader from '@/components/SingleVideoUploader.vue';
	import {
		getcategorylist,
		postinsertopInc,
		postupdateopInc,
		getopIncidentReportinfo
	} from '@/api/snapShare';
	import {
		imgUrl
	} from '../../config';
	import { useCommonStore } from '@/store/modules/common';
	const commonState = useCommonStore();
	import { toNav, toBack } from '@/utils/route';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	// ====== 控制模式：'edit' 或 'detail' ======
	const mode = ref('edit'); // 可通过 props 接收，如 defineProps({ mode: String })
	const delinfo = ref();
	// 表单数据
	const formData = reactive({
		// 填报人姓名
		userName: '',
		// 手机号
		phone: '',
		//详细描述
		description: '',
		// 高速名称
		highwayName: '',
		// 桩号
		pileNumber: '',
		// 方向（必填）
		direction: '',
		// 车道（必填）
		lane: '',
		//上报事件类型
		reportType: '',
		//上报事件类别
		reportCategory: '',
		// 定位地址
		blockArea: null,
		locationAddress: '',
		longitude: '',
		latitude: '',
		photoPaths: [],
		blockStatus: '',
		id: null,
		videoPath: ''

	});

	// 下拉选项
	const eventTypes = ref([]);
	const levels = ref([]);
	const yesNoOptions = [{
			id: '0',
			name: '是'
		},
		{
			id: '1',
			name: '否'
		}

	];




	// 选中索引
	const selectedTypeIndex = ref(0);
	const selectedLevelIndex = ref(0);
	const isCongestionIndex = ref(null);
	const selectedAreaIndex = ref(0);

	// 地图
	const currentLat = ref(uni.getStorageSync('address').lat);
	const currentLng = ref(uni.getStorageSync('address').lng);
	const scale = ref(14);
	const markers = ref([]);
	// 文件列表
	const imageList = ref([
		// 示例数据（实际可从 API 加载）
		// '/static/demo1.jpg',
		// '/static/demo2.jpg'
	]);
	const videoList = ref([
		// '/static/demo.mp4'
	]);
	const parseToken = (token) => {
		if (!token) return null;

		try {
			const payloadBase64 = token.split('.')[1];
			if (!payloadBase64) return null;

			const buffer = wx.base64ToArrayBuffer(payloadBase64);
			const uint8Arr = new Uint8Array(buffer);

			let binary = '';
			for (let i = 0; i < uint8Arr.length; i++) {
				binary += String.fromCharCode(uint8Arr[i]);
			}

			const payloadString = decodeURIComponent(escape(binary));
			return JSON.parse(payloadString);
		} catch (e) {
			console.error('Token 解析失败:', e);
			return null;
		}
	};
	onLoad((option) => {
		if (option.id) {
			console.log(option.id, 'option.id')
			mode.value = 'detail';
			getdetail(option.id);
		}
	});
	const getdetail = async (e) => {
		const res = await getopIncidentReportinfo(e);
		if (res.code == 200) {
			delinfo.value = res.data;
		}
	}
	onMounted(() => {
		const token = uni.getStorageSync('Token');
		const userInfo = parseToken(token);

		formData.phone = userInfo.member_phone
		gettypelist();
	});
	const gettypelist = async () => {
		const res = await getcategorylist({
			status: '0',
			parentId: '0'

		});
		eventTypes.value = res.data;
		console.log(res);
	};
	const hendchange = async (e) => {
		console.log(e)
		const res = await getcategorylist({
			status: '0',
			parentId: formData.reportCategory

		});
		levels.value = res.data;
	};
	const submitflie = async () => {
		if (!formData.userName) {
			uni.showToast({
				title: '请输入填报人姓名',
				icon: 'none'
			});
			return;
		}
		if (!formData.phone) {
			uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			});
			return;
		}
		if (!formData.blockArea) {
			uni.showToast({
				title: '请输入阻断区域面积',
				icon: 'none'
			});
			return;
		}
		const phoneRegex = /^1[3-9]\d{9}$/;
		if (!phoneRegex.test(formData.phone)) {
			uni.showToast({
				title: '手机号格式不正确',
				icon: 'none'
			});
			return;
		}
		if (!formData.highwayName) {
			uni.showToast({
				title: '请输入高速名称',
				icon: 'none'
			});
			return;
		}
		if (!formData.pileNumber) {
			uni.showToast({
				title: '请输入桩号',
				icon: 'none'
			});
			return;
		}
		if (!formData.direction) {
			uni.showToast({
				title: '请输入方向',
				icon: 'none'
			});
			return;
		}
		if (!formData.lane) {
			uni.showToast({
				title: '请输入车道',
				icon: 'none'
			});
			return;
		}
		if (!formData.reportType) {
			uni.showToast({
				title: '请选择上报事件类别',
				icon: 'none'
			});
			return;
		}
		if (!formData.reportCategory) {
			uni.showToast({
				title: '请选择上报事件类别',
				icon: 'none'
			});
			return;
		}
		if (!formData.locationAddress) {
			uni.showToast({
				title: '请选择定位地址',
				icon: 'none'
			});
			return;
		}
		if (!formData.blockStatus) {
			uni.showToast({
				title: '请选择是否为路政道路拥堵',
				icon: 'none'
			});
			return;
		}
		if (imageList.value.length < 2) {
			uni.showToast({
				title: '请至少上传两张',
				icon: 'none'
			});
			return;
		}
		if (!formData.videoPath) {
			uni.showToast({
				title: '请上传视频',
				icon: 'none'
			});
			return;
		}

		// formData.blockStatus = isCongestionIndex.value
		if (formData.id != null) {
			const res = await postupdateopInc({
				...formData,

			});
			if (res.code == 200) {
				uni.showToast({
					title: '修改成功',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1000);
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
			}
		} else {
			const res = await postinsertopInc({
				...formData,

			});
			if (res.code == 200) {
				uni.showToast({
					title: '上传成功',
					icon: 'none'
				});

				setTimeout(() => {
					uni.navigateBack();
				}, 1000);
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
			}
		}
		uni.showToast({
			title: '提交成功',
			icon: 'success'
		});

	}
	/** 删除视频 */
	// const removeVideo = () => {
	//     uni.showModal({
	//         title: '确认删除',
	//         content: '确定要删除这个视频吗？',
	//         success: (res) => {
	//             if (res.confirm) {
	//                 videoPath.value = '';
	//                 util.showToast('已删除');
	//             }
	//         },
	//     });
	// }
	// const choosevideo = () => {
	//     uni.chooseVideo({
	//         sourceType: ['album', 'camera'],
	//         maxDuration: 60,
	//         camera: 'back',
	//         success: (res: any) => {
	//             if (res.errMsg === 'chooseVideo:ok') {
	//                 util.showToast("开始上传...");
	//                 uploadVideo(
	//                     res.tempFilePath,
	//                     '随手拍',
	//                     (uploadRes: any) => {
	//                         videoPath.value = uploadRes.readUrl;
	//                         util.hideLoading();
	//                     },
	//                     (err: any) => util.showToast('视频上传失败')
	//                 );
	//             }
	//         },
	//         fail: (err: any) => {
	//             console.error('选择视频失败：', err);
	//             util.showToast('选择失败');
	//         },
	//     });
	// }
	// 方法
	const onTypeChange = (e) => {
		selectedTypeIndex.value = e.detail.value;
	};
	const onLevelChange = (e) => {
		selectedLevelIndex.value = e.detail.value;
	};
	const onCongestionChange = (e) => {
		isCongestionIndex.value = e.detail.value;
		console.log(isCongestionIndex.value)
	};
	const onAreaChange = (e) => {
		selectedAreaIndex.value = e.detail.value;
	};

	const deleteFile = (index) => {
		imageList.value.splice(index, 1);
		formData.photoPaths.splice(index, 1);
	};
	const uploadFile = (url) => {
		console.log(url, '图片上传')
		if (imageList.value.length <= 2) {
			imageList.value.push(url);
			formData.photoPaths.push(url.url)
		}
	};
	const deletevideo = (index) => {
		videoList.value.splice(index, 1);
		formData.videoPath = ''
	};
	const uploadvideo = (url) => {
		console.log(url, '视频上传')
		if (videoList.value.length < 2) {
			videoList.value.push(url);
			formData.videoPath = url.url
		}
	};

	const previewImage = (url) => {
		uni.previewImage({
			current: url,
			urls: [url]
		});
	};
	
	// 处理选择的地址
	const applyaddressdata = (res) => {
		console.log("选择 的地址", res)
		formData.locationAddress = res.name;
		formData.longitude = res.longitude;
		formData.latitude = res.latitude;
		currentLat.value = res.latitude;
		currentLng.value = res.longitude;
		markers.value = [{
			id: 1,
			latitude: res.latitude,
			longitude: res.longitude,
			iconPath: imgUrl + 'ind-icon20.png',
			width: 30,
			height: 30
		}];
		console.log('位置:', res);
	};

	const openMap = () => {
		// #ifdef APP
		toNav('/pages/mapSearch/indexBD');
		// #endif
		// #ifdef MP-WEIXIN
		uni.chooseLocation({
			success: (res) => {
				if (res.name) {
					applyaddressdata(res);
				}
			},
			fail: (err) => {
				if (err.errMsg.includes('cancel')) {
					console.log('用户取消选择');
				} else {
					uni.showToast({
						title: '获取位置失败',
						icon: 'none',
					});
				}
			},
		});
		// #endif
	};
	
	onShow(() => {
		// #ifdef APP
		if (commonState.chooseLocation) {
			console.log('IOS选择的地址', commonState.chooseLocation);
			let res = {
				name: commonState.chooseLocation.name,
				address: commonState.chooseLocation.address,
				latitude: commonState.chooseLocation.location.latitude,
				longitude: commonState.chooseLocation.location.longitude,
			};
			applyaddressdata(res);
			commonState.chooseLocation = null;
		}
		// #endif
	});

	// const onSubmit = (e) => {
	// 	e.preventDefault();
	// 	console.log('提交数据:', {
	// 		...formData,
	// 		eventType: eventTypes[selectedTypeIndex.value],
	// 		level: levels[selectedLevelIndex.value],
	// 		isCongestion: yesNoOptions[isCongestionIndex.value],
	// 		area: areas[selectedAreaIndex.value],
	// 		images: imageList.value,
	// 		videos: videoList.value
	// 	});
	// 	uni.showToast({
	// 		title: '上报成功',
	// 		icon: 'success'
	// 	});
	// };
</script>

<style scoped>
	.searchView {
		background: var(--head-color);
	}
	.container {
		background: #f8f9fb;
	}

	.form {
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.05);
		margin: 30rpx;
	}

	.form-items {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
	}

	.form-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2rpx solid #eaeaea;
		padding: 30rpx 0;

	}

	.label {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		min-width: 180rpx;
		display: flex;
		align-items: center;
	}

	.required {
		font-size: 24rpx;
		color: #ff4d4f;
		margin-left: 6rpx;
	}

	.input,
	.picker-value {
		font-size: 28rpx;
		color: #333;
		border-radius: 12rpx;
		background-color: #fff;
		text-align: right;
		flex: 1;
		margin-left: 20rpx;
	}

	.textarea-wrapper {
		position: relative;
		width: 100%;
	}


	.word-count {
		position: absolute;
		right: 20rpx;
		/* 与 textarea 内边距一致 */
		bottom: 10rpx;
		/* 贴近底部，可微调 */
		font-size: 24rpx;
		color: #999;
		background: rgba(255, 255, 255, 0.8);
		/* 半透明背景，避免文字重叠看不清 */
		padding: 0 8rpx;
		border-radius: 4rpx;
	}

	.textarea {
		font-size: 28rpx;
		color: #333;
		padding: 20rpx;
		border: 1rpx solid #ddd;
		border-radius: 12rpx;
		background-color: #fff;
		line-height: 1.6;
		height: 120rpx;
		width: 100%;
		box-sizing: border-box;
		margin-top: 20rpx;
	}

	.value-text {
		font-size: 28rpx;
		color: #333;
		text-align: left;
		margin-left: 20rpx;
	}

	.description-text {
		padding: 20rpx 0 0 0;
		line-height: 1.6;
	}

	.map-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-left: 20rpx;
	}

	.map-btn {
		color: #00bebe;
		font-size: 24rpx;
		margin-left: 20rpx;
	}

	.map-container-map {
		width: 630rpx;
		height: 300rpx;
		margin-top: 20rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.preview-images {
		display: flex;
		gap: 20rpx;
		margin-top: 20rpx;
		flex-wrap: wrap;
		margin-top: 32rpx;
	}

	.preview-image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.video-item {
		margin-top: 10rpx;
	}

	.empty-text {
		color: #999;
		font-size: 28rpx;
	}

	.note {
		font-size: 24rpx;
		color: #999;
		margin: 20rpx 0;
		text-align: left;
	}

	.submit-btn {
		width: 600rpx;
		height: 80rpx;
		margin: 40rpx auto 30rpx;
		font-size: 32rpx;
		color: #fff;
		background-color: #00bebe;
		border-radius: 40rpx;
		line-height: 80rpx;
		border: none;
	}
</style>