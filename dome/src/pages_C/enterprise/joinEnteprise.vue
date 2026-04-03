<template>
	<view class="box-center" :data-theme="pageTheme">
		<view class="reasons">
			<view class="reasons_box" style="background: #E8F1FF;" v-if="auditStatus==0">
				<view class="ybh" style="color: #4788FA;">{{auditStatusFun(auditStatus)}}</view>
				<view class="bo_reasons">申请正在审核中，请耐心等待～</view>
			</view>
			<view class="reasons_box flex-item" v-if="auditStatus==1">
				<view>
					<view class="ybh" style="color: #00BEBE;">{{auditStatusFun(auditStatus)}}</view>
					<view class="opk">去管理车辆<up-icon name="arrow-right-double" color="#333333" size="14"></up-icon>
					</view>
				</view>
				<view class="qglcl"
					@click="toNav(`/pages_C/enterprise/entercar?id=${id}&name=${formData.companyName}`)">
					管理车辆
				</view>
			</view>
			<view class="reasons_box" v-if="auditStatus==2">
				<view class="ybh">{{auditStatusFun(auditStatus)}}</view>
				<view class="bo_reasons">驳回原因:</view>
				<view>{{auditOpinion}}</view>
			</view>
		</view>
		<view class="page-container">
			<view class="scroll-content" scroll-y>
				<!-- 营业执照上传 -->
				<view class="form-section">
					<text class="section-title">上传营业执照图片</text>
					<view class="upload-box" @click="uploadImg(1)">
						<view class="upload-placeholder" v-if="!businessLicenseList">
							<image :src="imgUrl+'static/img_up.png'" class="icon"></image>
							<text class="upload-text">上传图片</text>
						</view>
						<image :src="businessLicenseList" v-else class="img_up"></image>
						<view class="upload-box-bg" @click="imgPreview(businessLicenseList)" v-if="editlook">
							<image :src="imgUrl+'static/img_view.png'" class="icon-look"></image>
						</view>
					</view>
				</view>
				<!-- 企业信息 -->
				<view class="form-section">
					<view class="form-item">
						<text class="label">企业名称</text>
						<up-input v-model="formData.companyName" :disabled="edit" border='none' inputAlign='right'
							placeholder="自动带入" ></up-input>
					</view>
					<view class="form-item">
						<text class="label">组织机构代码</text>
						<up-input v-model="formData.orgCode" :disabled="edit" border='none' inputAlign='right'
							placeholder="自动带入"></up-input>
					</view>
				</view>

				<!-- 企业授权书 -->
				<view class="form-section">
					<text class="section-title">上传企业授权书</text>
					<view class="upload-box" @click="uploadImg(2)">
						<view class="upload-placeholder" v-if="!authorizationList">
							<image :src="imgUrl+'static/img_up.png'" class="icon"></image>
							<!-- <image src=""></image> -->
							<text class="upload-text">上传图片</text>
						</view>
						<image :src="authorizationList" v-else class="img_up"></image>
						<view class="upload-box-bg" @click="imgPreview(authorizationList)" v-if="editlook">
							<image :src="imgUrl+'static/img_view.png'" class="icon-look"></image>
						</view>
					</view>

				</view>

				<!-- 联系人信息 -->
				<view class="form-section">
					<view class="form-item">
						<text class="label">联系人姓名</text>
						<up-input v-model="formData.contactName" placeholder="请输入" :disabled="edit" border='none'
							inputAlign='right' type="text"></up-input>
					</view>
					<view class="form-item">
						<text class="label">联系人电话</text>
						<up-input v-model="formData.contactPhone" placeholder="请输入" maxlength="11" :disabled="edit"
							border='none' inputAlign='right' type="number"></up-input>
					</view>
				</view>

				<!-- 法人身份证 -->
				<view class="form-section">
					<text class="section-title1">法人身份证照片</text>
					<view class="id-card-upload">
						<view class="upload-box" @click="uploadImg(3)">
							<view class="upload-placeholder" v-if="!idCardFrontList">
								<!-- <view class="close" @click="closeImg(1)">
									<up-icon name="close-circle" color="#000" size="14"></up-icon>
								</view> -->
								<image :src="imgUrl+'static/sfz_front.png'" class="icon-sfz"></image>
								<!-- <image src=""></image> -->
								<text class="upload-text">上传正面</text>
							</view>
							<image :src="idCardFrontList" v-else class="img_up"></image>
							<view class="upload-box-bg" @click="imgPreview(idCardFrontList)" v-if="editlook">
								<image :src="imgUrl+'static/img_view.png'" class="icon-look"></image>
							</view>
						</view>
						<view class="upload-box" @click="uploadImg(4)">
							<view class="upload-placeholder" v-if="!idCardBackList">
								<!-- <view class="close" @click="closeImg(2)" v-if="idCardBackList">
									<up-icon name="close-circle" color="#000" size="14"></up-icon>
								</view> -->
								<image :src="imgUrl+'static/sfz_back.png'" class="icon-sfz"></image>
								<!-- <image src=""></image> -->
								<text class="upload-text">上传反面</text>
							</view>
							<image :src="idCardBackList" v-else class="img_up"></image>
							<view class="upload-box-bg" @click="imgPreview(idCardBackList)" v-if="editlook">
								<image :src="imgUrl+'static/img_view.png'" class="icon-look"></image>
							</view>
						</view>
					</view>
				</view>
				<view style='height: 100rpx;'></view>
				<view style='height: 200rpx;' v-if="auditStatus==1 || auditStatus==2"></view>
			</view>
			<!-- 提交按钮 -->
			<view class="submit-section">
				<view class="btn" @click="handleSubmit" v-if="isshow">
					提交
				</view>

				<view class="btn" @click="handleSubmit" v-if="auditStatus==2">
					重新提交
				</view>
			</view>
			<!-- 加载提示 -->
			<u-toast ref="uToast"></u-toast>
			<u-loading-icon v-if="loading" text="提交中..."></u-loading-icon>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import uploadFile from '@/utils/upload';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import { enterpriseList } from '@/api/car';
	import { registerEnterprise, enterpriseDetail, againSubmit } from '@/api/enterprise';
	import { ocrRecognition } from '@/api/config';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	// 表单数据类型
	interface FormData {
		companyName : string
		orgCode : string
		contactName : string
		contactPhone : string
	}

	// 编辑
	const isshow = ref(true)
	const edit = ref(false)
	const editlook = ref(false)
	const id = ref('')
	const auditStatus = ref('3')
	//理由
	const auditOpinion = ref('')
	// 表单数据
	const formData = reactive<FormData>({
		companyName: '', // 这里应该从接口获取
		orgCode: '', // 这里应该从接口获取
		contactName: '',
		contactPhone: ''
	})
	const handleInput = (value) => {
		// 只保留：中文、英文字母（大小写）、空格
		// 如果你也想保留英文，用这个正则：
		const filtered = value.replace(/[^a-zA-Z\u4e00-\u9fa5\s]/g, '');

		// 如果你只想保留中文和空格（不要英文），用这个：
		// const filtered = value.replace(/[^\u4e00-\u9fa5\s]/g, '');

		formData.value.companyName = filtered;
	};
	// 上传文件列表
	const businessLicenseList = ref('')
	const authorizationList = ref('')
	const idCardFrontList = ref('')
	const idCardBackList = ref('')
	// 加载状态
	const loading = ref(false)

	// 验证表单
	const isFormValid = computed(() => {
		return (
			formData.contactName.trim() !== '' &&
			formData.contactPhone.trim() !== '' &&
			/^1[3-9]\d{9}$/.test(formData.contactPhone)
		)
	})
	const auditStatusFun = (val : string) => {
		switch (val) {
			case 0:
				return '待审核';
			case 1:
				return '已通过';
			case 2:
				return '已驳回';
			default:
				return '';
		}
	}
	// 预览
	const imgPreview = (url) => {
		uni.previewImage({
			urls: [url]
		})
	}
	// 统一 OCR 调用（回调 => Promise）

	// 提交按钮样式
	const submitButtonStyle = computed(() => ({
		width: '90%',
		height: '90rpx',
		fontSize: '32rpx',
		borderRadius: '12rpx',
		backgroundColor: isFormValid.value ? '#2979ff' : '#c0c4cc'
	}))
	// 上传
	const chooseOneImage = () : Promise<string> => {
		return new Promise<string>((resolve, reject) => {
			// #ifdef MP-WEIXIN
			uni.chooseMedia({
				count: 1,
				mediaType: ['image'],
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				camera: 'back',
				success: (res) => {
					const file = res.tempFiles?.[0];
					if (file?.tempFilePath) {
						console.log('压缩后大小：', file.size, '字节');
						resolve(file.tempFilePath);
					} else {
						reject(new Error('未选择图片'));
					}
				},
				fail: (err) => reject()
			});
			// #endif
			// #ifndef MP-WEIXIN
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					const path = res.tempFilePaths?.[0];
					if (path) resolve(path);
					else reject(new Error('未选择图片'));
				},
				fail: (err) => reject()
			});
			// #endif
		});
	};
	const callOCR = async () => {
		const res = await ocrRecognition({
			path: businessLicenseList.value,
			code: 9
		})
		formData.companyName = res.data.enterpriseName
		formData.orgCode = res.data.socialCreditCode
	};
	// 上传
	const uploadImg = async (type : string | number) => {
		console.log(auditStatus.value)
		if (edit.value == true) return
		try {
			const path = await chooseOneImage();
			if (path) {
				const uploadRes : any = await uploadFile({
					url: '/file/upload',
					filePath: path,
				});
				if (uploadRes.code == 200) {
					if (type == 1) {
						businessLicenseList.value = uploadRes.data.url
						callOCR()
					} else if (type == 2) {
						authorizationList.value = uploadRes.data.url
					} else if (type == 3) {
						idCardFrontList.value = uploadRes.data.url
					} else if (type == 4) {
						idCardBackList.value = uploadRes.data.url
					}
				}
				console.log('上传结果', uploadRes);
			}

		} catch (e : any) {
			uni.showToast({ title: e?.resultMsg || '选择失败', icon: 'none' });
		}
	};


	// 表单验证
	const validateForm = () => {
		// 实时验证已在 computed 中处理
	}

	// 提交处理
	const handleSubmit = async () => {
		if (!businessLicenseList.value) {
			uni.showToast({
				title: '请上传营业执照',
				icon: 'none',
			});
			return
		}
		if (!formData.companyName) {
			uni.showToast({
				title: '填写企业名称',
				icon: 'none',
			});
			return
		}
		if (/\d/.test(formData.companyName)) {
		   uni.showToast({ title: `请输入正确的企业名称`, icon: 'none' });
		    return;
		  }
		if (!formData.orgCode) {
			uni.showToast({
				title: '填写组织机构代码',
				icon: 'none',
			});
			return
		}
		if (!authorizationList.value) {
			uni.showToast({
				title: '请上传企业授权书照片',
				icon: 'none',
			});
			return
		}
		if (!formData.contactName) {
			uni.showToast({
				title: '联系人姓名填写有误',
				icon: 'none',
			});
			return
		}
		const phoneReg = /^1[3-9]\d{9}$/;
		if (!phoneReg.test(formData.contactPhone)) {
			uni.showToast({
				title: '请输入正确的手机号格式',
				icon: 'none',
			});
			return
		}
		if (!formData.contactPhone) {
			uni.showToast({
				title: '手机号填写有误',
				icon: 'none',
			});
			return
		}
		// if (!idCardFrontList.value) {
		// 	uni.showToast({
		// 		title: '请上传人身份证正面',
		// 		icon: 'none',
		// 	});
		// 	return
		// }
		// if (!idCardBackList.value) {
		// 	uni.showToast({
		// 		title: '请上传人身份证背面',
		// 		icon: 'none',
		// 	});
		// 	return
		// }
		let params = {
			id: id.value,
			memberId: uni.getStorageSync('userInfo').id,
			enterpriseName: formData.companyName, // 企业名称（必填）
			orgCode: formData.orgCode,// 组织机构代码（必填）
			businessLicenseUrl: businessLicenseList.value,//营业执照照片存储路径
			authorizationLetterUrl: authorizationList.value, //企业授权书照片存储路径
			contactName: formData.contactName,//联系人姓名
			contactMobile: formData.contactPhone,//联系人手机号
			legalIdFrontUrl: idCardFrontList.value,//法人身份证正面照片
			legalIdBackUrl: idCardBackList.value//法人身份证背面
		}

		if (auditStatus.value == 2) {
			let res = await againSubmit(params)
			if (res.code == 200) {
				uni.navigateBack(1)
				// uni.navigateTo({
				// 	url: '/pages_C/enterprise/myenteprise',
				// });
			}
		} else {
			let res = await registerEnterprise(params)
			if (res.code == 200) {
				uni.navigateBack(1)
				// uni.navigateTo({
				// 	url: '/pages_C/enterprise/myenteprise',
				// });
			}
		}

	}

	// 重置表单
	const resetForm = () => {
		formData.companyName = ''
		formData.orgCode = ''
		formData.contactName = ''
		formData.contactPhone = ''
		businessLicenseList.value = ''
		authorizationList.value = ''
		idCardFrontList.value = ''
		idCardBackList.value = ''
	}
	const loadData = () => {
		enterpriseDetail(id.value).then(res => {
			if (res.code == 200) {
				let data = res.data
				formData.companyName = data.enterpriseName,
					formData.orgCode = data.orgCode,
					formData.contactName = data.contactName,
					formData.contactPhone = data.contactMobile,
					businessLicenseList.value = data.businessLicenseUrl,
					authorizationList.value = data.authorizationLetterUrl,
					idCardFrontList.value = data.legalIdFrontUrl,
					idCardBackList.value = data.legalIdBackUrl
				auditStatus.value = data.auditStatus
				id.value = data.id
				auditOpinion.value = data.auditOpinion
				if (auditStatus.value == 2) {
					edit.value = false
					isshow.value = false
					editlook.value = false
				} else if (auditStatus.value == 0 || auditStatus.value == 1) {
					edit.value = true
					isshow.value = false
					editlook.value = true
				}
			}

		}).catch(err => {
		}).finally(() => {
		});

	};
	const closeImg = (val) => {
		if (val == 1) {
			idCardFrontList.value = ''
		} else {
			idCardBackList.value = ''
		}
	}
	onLoad((options : any) => {
		if (options.id) {
			id.value = options.id
			loadData()
		}
	})
	// 页面加载时获取企业信息
	onMounted(() => {
		// 这里应该调用接口获取企业信息
		// fetchCompanyInfo()
	})
</script>

<style lang="scss" scoped>
	.box-center {
		height: 100vh;
		overflow: hidden;
		background: var(--head-color);
	}

	.page-container {
		height: 90vh;
		overflow-x: scroll;
		background-color: #F8F9FB;
		padding: 30rpx 30rpx 0;
	}

	.scroll-content {}

	.form-section {
		background-color: #fff;
		padding: 30rpx;

		.section-title {
			display: block;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 20rpx;

			&::after {
				content: '*';
				color: #FD4848;
				margin-left: 4rpx;
			}
		}

		.section-title1 {
			display: block;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 20rpx;
		}
	}

	.form-item {
		margin-bottom: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2rpx solid #EAEAEA;
		padding: 15rpx 0;

		&:last-child {
			margin-bottom: 0;
		}

		.label {
			width: 200rpx;
			display: block;
			font-size: 28rpx;
			color: #333;

			&::after {
				content: '*';
				color: #f56c6c;
				margin-left: 4rpx;
			}
		}
	}

	.upload-box {
		width: 190rpx;
		height: 190rpx;
		border-radius: 12rpx;
		background-color: #F8F9FA;
		position: relative;

		.upload-placeholder {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			width: 190rpx;
			height: 190rpx;

			.upload-text {
				font-size: 24rpx;
				color: #333333;
				margin-top: 16rpx;
			}
		}

		.img_up {
			width: 190rpx;
			height: 190rpx;
		}
	}

	.id-card-upload {
		display: flex;
		gap: 30rpx;

		.id-card-side {

			.id-card-placeholder {
				border-radius: 12rpx;
				background-color: #F8F9FA;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 190rpx;
				height: 190rpx;

				.upload-text {
					font-size: 26rpx;
					color: #999;
					margin-top: 16rpx;
				}
			}
		}
	}

	.submit-section {
		padding: 30rpx 64rpx 50rpx;
		background-color: #FFFFFF;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;

		.btn {
			width: 622rpx;
			padding: 20rpx 0;
			background: var(--but-color-line);
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			text-align: center;
			font-weight: 500;
			font-size: 32rpx;
			color: #FFFFFF;
		}
	}

	// 响应式适配
	@media (max-width: 750px) {
		.id-card-upload {
			gap: 20rpx;
		}
	}

	::v-deep .up-input {
		background: none !important;
		border: none;
		text-align: right;
	}

	::v-deep .up-input__content__field-wrapper__field {
		text-align: right !important;
	}

	::v-deep .u-upload__wrap {
		width: 190rpx;
		height: 190rpx;
		background: #F8F9FA;
	}

	::v-deep .u-upload {
		display: flex;
	}

	.reasons {
		width: 100%;
		background: #FFF0F0;
	}

	.reasons_box {
		padding: 20rpx;
	}

	.ybh {
		font-size: 32rpx;
		color: #FD4848;
		margin-bottom: 10rpx;
	}

	.bo_reasons {
		font-size: 24rpx;
		color: #333333;
	}

	.icon {
		width: 60rpx;
		height: 60rpx;
	}

	.icon-sfz {
		width: 80rpx;
		height: 80rpx;
	}

	.qglcl {
		width: 162rpx;
		height: 56rpx;
		line-height: 56rpx;
		background: #00BEBE;
		border-radius: 48rpx;
		text-align: center;
		font-size: 28rpx;
		color: #FFFFFF;
	}

	.flex-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #E0F7F7;
	}

	.opk {
		display: flex;
		align-items: center;
		font-size: 24rpx;
	}

	.upload-box-bg {
		width: 190rpx;
		height: 190rpx;
		background: rgba(0, 0, 0, .5);
		position: absolute;
		top: 0;
	}

	.icon-look {
		width: 50rpx;
		height: 50rpx;
		display: flex;
		margin: 0 auto;
		padding-top: 70rpx;
	}

	.close {
		position: absolute;
		top: 0;
		right: 10rpx;
	}

	::v-deep .u-input {
		background: #fff !important;
	}
</style>