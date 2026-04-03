<!-- 上传图片/视频 -->
<template>
	<view>
		<view class="formImages">
			<view v-for="(item, index) in urls" :key="index">
				<view class="formImages-item" v-if="item.type == 'video'">
					<video class="myVideo" :src="item.url" @error="videoErrorCallback" :danmu-list="danmuList"
						enable-danmu danmu-btn controls>
						<cover-image class="img-del2" :src="imgUrl+'static/img-del-icon.png'"
							@click="deleteFile(index)"></cover-image>
					</video>

				</view>
				<view class="formImages-item" v-else>
					<image class="myImage" :src="item.url" mode=""></image>
					<view class="img-del" @click="deleteFile(index)"></view>
				</view>
			</view>
			<template v-if="type == 'video'">
				<view class="formImages-item addView" v-if="!urls.length" @click="selectClick">
					<image class="myImage2" :src="imgUrl+'video-icon.png'" mode=""></image>
					<text class="addView-text">上传视频</text>
				</view>
			</template>
			<template v-else>
				<view class="formImages-item addView" v-if="urls.length <= limit" @click="selectClick">
					<image class="myImage2" :src="imgUrl+'pic-icon.png'" mode=""></image>
					<text class="addView-text">上传图片</text>
				</view>
			</template>
		</view>
		<!-- <text class="iconText">{{describeText}}</text> -->

		<u-action-sheet :actions="typeList" title="文件类型" :show="typeShow" closeOnClickOverlay @select="selectChange"
			@close="typeShow = false"></u-action-sheet>
	</view>
</template>

<script setup>
	import {
		ref,
		watch,
		computed,
		onMounted
	} from "vue";
	import {
		toast
	} from "@/utils/common"
	import {
		imgUrl
	} from '@/config';
	import uploadFile from '@/utils/upload' // 您的封装的 uni.uploadFile

	const typeShow = ref(false);
	const type = ref(""); // image 或 video
	const typeList = ref([{
			name: "图片",
			type: "image",
		},
		{
			name: "视频",
			type: "video",
		},
	]);
	const emits = defineEmits(["deleteFile", "thumbTempUploadFile", "uploadFile"]);
	const props = defineProps({
		// 最大数量
		limit: {
			type: [String, Number],
			default: "6",
		},
		// 图片视频数组
		urls: {
			type: Array,
			default: () => {},
		},
		isType: {
			type: String,
			default: "image",
		},
		// 自定义描述
		describe: {
			type: String,
			default: "",
		}
	});

	const describeText = computed(() => {
		let title = ''
		if (props.describe) {
			title = props.describe
		} else {
			if (props.isType == 'all') {
				title = "图片视频最大不超过20MB"
			} else if (props.isType == 'image') {
				title = "图片最大不超过20MB"
			} else if (props.isType == 'video') {
				title = "视频最大不超过20MB"
			} else {

			}
		}
		return title
	})
	
	onMounted(() => {
		if (props.urls.length > 0) {
			type.value = props.urls[0].type;
		} else {
			type.value = props.isType
		}
	});
	watch(() => props.urls, (newValue, oldValue) => {
		// 当props的数据发生变化时，执行相应的逻辑
		console.log(newValue);
		console.log(newValue.length);
		if (props.urls.length > 0) {
			if (props.urls[0].type == 1 || props.urls[0].type == 2) {
				type.value = props.urls[0].type == 1 ? "image" : "video";
			} else {
				console.log(props.urls[0]);
				type.value = props.urls[0].type
			}
		}
	});
	// 按钮上传
	const selectClick = () => {
		if (props.urls.length == 0) {
			type.value = props.isType;
		}
		if (props.isType == "image") {
			chooseImage();
		} else if (props.isType == "video") {
			chooseVideo();
		} else {
			// 判断当前type类型，若为空，请先选择类型（视频，图片）
			if (type.value == "image") {
				chooseImage();
			} else if (type.value == "video") {
				chooseVideo();
			} else {
				typeShow.value = true;
			}
		}
	};
	const selectChange = (event) => {
		type.value = event.type;
		if (event.type == "image") {
			chooseImage();
		} else if (event.type == "video") {
			chooseVideo();
		}
		typeShow.value = false;
	};
	// 选择图片
	const chooseImage = () => {
		let count = parseFloat(props.limit) - props.urls.length;
		uni.chooseImage({
			count,
			sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ["album", "camera"], //album 从相册选图，camera 使用相机
			success: (res) => {
				//
				console.log(res);
				console.log(JSON.stringify(res.tempFilePaths));
				for (let i in res.tempFilePaths) {
					console.log('压缩前', res.tempFilePaths[i]);
					uploadsFile(res.tempFilePaths[i], 1);
				}
			},
			fail: (err) => {
				console.log(err);
			},
		});
	};
	const chooseVideo = () => {
		uni.chooseVideo({
			sourceType: ['album', 'camera'],
			maxDuration: 60,
			camera: 'back',
			success: (res) => {
				console.log(res,'sssssssssssssssssssssssss')
				if (res.errMsg === 'chooseVideo:ok') {
					uploadsFile(res.tempFilePath, 2);
					thumbTempUploadFile(res.thumbTempFilePath);
				}
			},
			fail: (err) => {
				console.error('选择视频失败：', err);
				util.showToast('选择失败');
			},
		});
		// uni.chooseMedia({
		//   count: 1, //传一个
		//   mediaType: ["video"],
		//   sourceType: ["album", "camera"],
		//   success: (res) => {
		// 	console.log("-------video-------");
		// 	console.log(res.tempFiles[0]);
		// 	console.log(res.tempFiles[0].tempFilePath);
		// 	console.log(res.tempFiles[0].thumbTempFilePath);
		// 	uploadsFile(res.tempFiles[0].tempFilePath, 2);
		// 	thumbTempUploadFile(res.tempFiles[0].thumbTempFilePath);
		//   },
		// });
	};
	// 删除
	const deleteFile = (index) => {
		emits('deleteFile', index)
	};
	// 视频上传封面
	const thumbTempUploadFile = async (filePath) => {
		console.log("封面", filePath);
		// let res = await configApi.uploadData(filePath);
		let res = await uploadFile({
			url: '/file/upload', // 替换为您的上传接口
			filePath
		})
		// console.log(res);
		// res = JSON.parse(res);
		// console.log();
		// if (res.code == 200) {
		//   console.log(res);
		//   let dataObj = res.data;
		//   dataObj.type = "image";
		//   dataObj.url = res.data.imageUrl;
		//   emits("thumbTempUploadFile", dataObj);
		// } else {
		//   toast(res.msg);
		// }
	};
	// 上传
	const uploadsFile = async (filePath, type) => {
		if (type == 1) {
			let res = await uploadFile({
				url: '/file/upload', // 替换为您的上传接口
				filePath
			})
			console.log(res);
			if (res.code == 200) {
				console.log(res);
				let dataObj = res.data;
				dataObj.type = "image";
				dataObj.url = res.data.url;
				emits("uploadFile", dataObj);
			} else {
				toast(res.msg);
			}
		} else {
			console.log(filePath,'filePath')
			let res = await uploadFile({
				url: '/file/upload', // 替换为您的上传接口
				filePath
			})
			// res = JSON.parse(res);
			if (res.code == 200) {
				let dataObj = res.data;
				dataObj.type = "video";
				dataObj.url = res.data.url;
				emits("uploadFile", dataObj);
			} else {
				toast(res.msg);
			}
		}
	};

	// export default {
	// 	name:"ssg-form-file",

	// 	watch:{
	// 		urls:{
	// 			handler(){
	// 				// 获取文件类型
	// 				if(urls.value.length > 0){
	// 					if(urls.value[0].type == 1 || urls.value[0].type == 2){
	// 						type.value = urls.value[0].type == 1?'image':'video'
	// 					}else{
	// 						type.value = urls.value[0].type
	// 					}

	// 				}
	// 			},
	// 			deep:true
	// 		}
	// 	},
	// 	methods:{

	// 	}
	// }
</script>

<style lang="scss" scoped>
	.addView {
		width: 180rpx;
		height: 180rpx;
		border-radius: 20rpx;
		background: #F8F9FA;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.addView-text {
			font-weight: 400;
			font-size: 24rpx;
			color: #333333;
			line-height: 34rpx;
			margin-top: 10rpx;
		}
	}

	.myImage2 {
		width: 50rpx;
		height: 50rpx;
	}

	.iconText {
		padding: 20rpx;
		box-sizing: border-box;
		color: #666666;
		font-size: 22rpx;
	}

	.formImages {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		.formImages-item {
			width: 180rpx;
			height: 180rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			position: relative;

			.myImage,
			.myVideo {
				width: 180rpx;
				height: 180rpx;
				position: absolute;
			}

			.img-del2 {
				width: 56rpx;
				height: 56rpx;
				position: absolute;
				right: -18rpx;
				top: -18rpx;
			}

			.img-del {
				width: 36rpx;
				height: 36rpx;
				position: absolute;
				right: -18rpx;
				top: -18rpx;
				background-color: #eb0909;
				border-radius: 50%;
				color: white;
				font-size: 34rpx;
				z-index: 20;

				&::before {
					content: "";
					width: 16rpx;
					height: 1px;
					position: absolute;
					left: 10rpx;
					top: 18rpx;
					background-color: #fff;
				}
			}
		}
	}
</style>