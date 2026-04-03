<template>
	<view class="container-header">
		<!-- 审核状态提示 -->
		<view class="audit-box" v-if="auditStatus === '03'">驳回原因：{{ auditMsg }}</view>
		<view class="audit-box-b" v-if="auditStatus === '01'">您的申请正在审核中，请耐心等待！</view>

		<!-- 标题 -->
		<view class="tou">
			<view class="lanjie"></view>
			<view class="title">请选择身份</view>
		</view>

		<!-- 身份类型选择 -->
		<view class="identity-type">
			<text>身份类型</text>
			<view class="identity-box">
				<view class="identity-text" v-if="!isComplete">请选择</view>
				<view class="radio-item" @click="selectIdentity('1')" :class="{ disabled: isDefault === '1' || isComplete }">
					<image :src="bindType === '1' ? `${imgUrl}volumePricing/cri-xz-icon.png` : `${imgUrl}volumePricing/cri-wxz-icon.png`" class="cri-img" />
					<text>个人</text>
				</view>
				<view class="radio-item" @click="selectIdentity('2')" :class="{ disabled: isDefault === '1' || isComplete }">
					<image :src="bindType === '2' ? `${imgUrl}volumePricing/cri-xz-icon.png` : `${imgUrl}volumePricing/cri-wxz-icon.png`" class="cri-img" />
					<text>企业</text>
				</view>
			</view>
		</view>
	</view>

	<!-- 企业认证 -->
	<view v-if="bindType === '2'">
		<view class="container-header">
			<view class="tou">
				<view class="lanjie"></view>
				<view class="title">上传营业执照</view>
			</view>
			<view class="camera-view" @click="!isComplete || type === '1' ? uploadImg() : look('busLicense')">
				<view class="no-cont" v-if="!busLicense">
					<image :src="`${imgUrl}volumePricing/bus-upload_qyrz@2x.png`" class="n-data" />
				</view>
				<image :src="busLicense" class="has-cont" v-else />
			</view>
		</view>

		<view class="tip-text" v-if="!isComplete || type === '1'">
			<image :src="`${imgUrl}volumePricing/bus-explain@2x.png`" />
			<text>以下信息为系统自动识别，如不正确请修改：</text>
		</view>

		<view class="ocr-res-view">
			<view class="input-style">
				<view class="tex28_33">企业名称</view>
				<input
					class="tex28_33"
					:disabled="isComplete && type !== '1'"
					type="text"
					@input="(e) => getInput(e, 'enterpriseName')"
					v-model="enterpriseName"
					placeholder="请输入"
				/>
			</view>
			<view class="input-style">
				<view class="tex28_33">信用代码</view>
				<input
					class="tex28_33"
					:disabled="isComplete && type !== '1'"
					type="text"
					@input="(e) => getInput(e, 'socialCreditCode')"
					v-model="socialCreditCode"
					placeholder="请输入"
				/>
			</view>
			<view class="input-style">
				<view class="tex28_33">法人姓名</view>
				<input
					class="tex28_33"
					:disabled="isComplete && type !== '1'"
					type="text"
					@input="(e) => getInput(e, 'legalPerson')"
					v-model="legalPerson"
					placeholder="请输入"
				/>
			</view>
			<view class="input-style">
				<view class="tex28_33">手机号</view>
				<input
					class="tex28_33"
					:disabled="isComplete && type !== '1'"
					type="text"
					@input="(e) => getInput(e, 'mobiles')"
					v-model="mobiles"
					placeholder="请输入"
				/>
			</view>
			<view class="input-style">
				<view class="tex28_33">营业期限起</view>
				<picker :disabled="isComplete && type !== '1'" mode="date" @change="(e) => timerChange(e, 'busTimeStart')">
					<view>
						<view :class="`selectbox ${!busTimeStart ? 'tex28_99' : 'tex28_33_b'}`">
							{{ busTimeStart || '请选择' }}
							<image class="more-icon" :src="`${imgUrl}/wximage/trip-pro/arrow-right-icon.png`" mode="widthFix" />
						</view>
					</view>
				</picker>
			</view>
			<view class="input-style">
				<view class="tex28_33">营业期限止</view>
				<view>
					<picker :disabled="isComplete && type !== '1'" mode="date" @change="(e) => timerChange(e, 'busTimeEnd')" v-if="busTimeEnd !== '长期'">
						<view>
							<view :class="`selectbox ${!busTimeEnd ? 'tex28_99' : 'tex28_33_b'}`">
								<template v-if="isComplete && type !== '1'">
									{{ busTimeEnd || '' }}
								</template>
								<template v-else>
									{{ busTimeEnd || '请选择' }}
								</template>
								<image class="more-icon" :src="`${imgUrl}/wximage/trip-pro/arrow-right-icon.png`" mode="widthFix" />
							</view>
						</view>
					</picker>
					<view :class="`selectbox ${!busTimeEnd ? 'tex28_99' : 'tex28_33_b'}`" v-else>
						{{ busTimeEnd }}
						<image class="more-icon" :src="`${imgUrl}/wximage/trip-pro/arrow-right-icon.png`" mode="widthFix" />
					</view>
					<text class="along-btn" v-if="busTimeEnd !== '长期' && !creditCode" @click="setText"> 长期 </text>
				</view>
			</view>
		</view>
	</view>

	<!-- 个人认证 -->
	<view v-if="bindType === '1'">
		<view class="container-header">
			<view class="tou">
				<view class="lanjie"></view>
				<view class="title">上传身份证照片</view>
			</view>
			<view class="sf-top" @click="!isUser || type === '1' || auditStatus === '03' ? uploadIdFront() : look('front')">
				<view class="sf-text">
					<view class="sf-text-1">头像面</view>
					<view class="sf-text-2">上传您的身份证正面</view>
				</view>
				<image :src="idCardFrontUrl || `${imgUrl}volumePricing/shengenz-ren-icon.png`" class="n-data-1" />
			</view>
			<view class="sf-top" @click="!isUser || type === '1' || auditStatus === '03' ? uploadIdBack() : look('back')">
				<view class="sf-text">
					<view class="sf-text-1">国徽面</view>
					<view class="sf-text-2">上传您的身份证背面</view>
				</view>
				<image :src="idCardBackUrl || `${imgUrl}volumePricing/shengfenz-guohui-icon.png`" class="n-data-1" />
			</view>
		</view>

		<view class="tip-text" v-if="!isUser || type === '1'">
			<image :src="`${imgUrl}volumePricing/bus-explain@2x.png`" />
			<text>以下信息为系统自动识别，如不正确请修改：</text>
		</view>

		<view class="ocr-res-view">
			<view class="input-style">
				<view class="tex28_33">姓名</view>
				<input
					class="tex28_99"
					:disabled="isUser && type !== '1' && auditStatus !== '03'"
					type="text"
					@input="(e) => getInput(e, 'userName')"
					v-model="userName"
					placeholder="请输入"
				/>
			</view>
			<view class="input-style">
				<view class="tex28_33">身份证</view>
				<input
					class="tex28_99"
					:disabled="isUser && type !== '1' && auditStatus !== '03'"
					type="text"
					@input="(e) => getInput(e, 'userIdCard')"
					v-model="userIdCard"
					placeholder="请输入"
				/>
			</view>
			<view class="input-style">
				<view class="tex28_33">手机号</view>
				<input
					class="tex28_99"
					:disabled="isUser && type !== '1' && auditStatus !== '03'"
					type="text"
					@input="(e) => getInput(e, 'mobile')"
					v-model="mobile"
					placeholder="请输入"
				/>
			</view>
		</view>
	</view>

	<!-- 协议弹窗 -->
	<protocol v-if="isProtocolVisible" @close="handleCloseProtocol" @onConfirmProtocol="onConfirmProtocol"></protocol>

	<!-- 协议勾选 -->
	<view class="checkbox-container" @click="onCheckChange" v-if="!isUser || type === '1'">
		<image class="agree-icon" :src="`${imgUrl}volumePricing/${checked ? 'vp_agreed' : 'vp_agree'}.png`" />
		<view class="label">
			已阅读并同意
			<text>《服务协议》</text>
		</view>
	</view>

	<!-- 提交按钮 -->
	<view class="add-btn" v-if="!isUser || type === '1' || auditStatus === '03'" @click="submit">
		<text>{{ auditStatus === '03' ? '重新' : '确认' }}提交</text>
	</view>

	<view style="height: 258rpx"></view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onShow, onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
import uploadFile from '@/utils/upload';
import protocol from '../../components/protocol.vue';
import { yldjUser, getByCreditCode, yldjSaveUser, yldjEditUser, yldjSaveEnterprise } from '@/api/volumePricing';
import { ocrRecognitionYldj } from '@/utils/ocr';
import { toNav, toRec } from '@/utils/route';

// 类型定义
interface OcrData {
	name?: string;
	idCardNo?: string;
	enterpriseName?: string;
	socialCreditCode?: string;
	legalPerson?: string;
	operationPeriod?: string;
	[key: string]: any;
}

interface UserInfo {
	id?: number;
	userName?: string;
	userIdCard?: string;
	mobile?: string;
	idCardFrontUrl?: string;
	idCardBackUrl?: string;
	auditStatus?: string;
	rejectedReason?: string;
	[key: string]: any;
}

interface EnterpriseInfo {
	enterpriseName?: string;
	creditCode?: string;
	legalRepresentative?: string;
	businessLicenseImage?: string;
	businessStartDate?: string;
	businessEndDate?: string;
	contactPhone?: string;
	[key: string]: any;
}

// 响应式数据
const id = ref<string>('');
const bindType = ref<string>('1'); // 1-个人，2-企业
const busLicense = ref<string>('');
const userName = ref<string>('');
const userIdCard = ref<string>('');
const mobile = ref<string>('');
const mobiles = ref<string>('');
const enterpriseName = ref<string>('');
const socialCreditCode = ref<string>('');
const legalPerson = ref<string>('');
const busTimeStart = ref<string>('');
const busTimeEnd = ref<string>('');
const idCardFrontUrl = ref<string>('');
const idCardBackUrl = ref<string>('');
const comId = ref<string>('');
const disable = ref<boolean>(false);
const checked = ref<boolean>(false);
const isProtocolVisible = ref<boolean>(false);
const creditCode = ref<string>('');
const type = ref<string>('');
const isUploading = ref<boolean>(false);
const ocrData = ref<OcrData>({});
const busOcrData = ref<OcrData>({});
const setStatus = ref<boolean>(false);
const isDefault = ref<string>(''); // 1为指定企业
const auditStatus = ref<string>('');
const auditMsg = ref<string>('');
const editId = ref<number | undefined>();
const isComplete = ref<boolean>(false);
const isUser = ref<number>(1);

// 页面加载时获取参数
onLoad((options) => {
	console.log('完善信息页面接收的参数', options);
	id.value = options.id || '';
	type.value = options.type || '';
	creditCode.value = options.creditCode || '';
	bindType.value = options.bindType || '1';

	// 初始化身份类型
	if (options.bindType) {
		isDefault.value = '1';
	}
});

// 页面显示时获取数据
onShow(() => {
	if (isUploading.value) return;

	// 根据身份类型获取对应信息
	if (bindType.value === '2') {
		getyldjEnterprise();
	} else {
		console.log('没有企业信用码，获取个人信息');
		getyldjUser();
	}
});

/**
 * 选择身份类型
 */
const selectIdentity = (value: string) => {
	if (isDefault.value === '1' || isComplete.value) return;
	bindType.value = value;
	console.log('选择身份：', value);
};

/**
 * 协议勾选触发（显示协议弹窗）
 */
const onCheckChange = () => {
	if (!checked.value) {
		isProtocolVisible.value = true;
	}
};

/**
 * 关闭协议弹窗
 */
const handleCloseProtocol = () => {
	isProtocolVisible.value = false;
};

/**
 * 确认同意协议
 */
const onConfirmProtocol = (e) => {
	console.log('同意协议', e);
	checked.value = e;
	isProtocolVisible.value = false;
};

/**
 * 获取个人认证信息
 */
const getyldjUser = async () => {
	try {
		const res = await yldjUser();
		console.log('获取个人认证信息', res);
		const clazz = res.clazz || {};
		const userInfo = clazz.user || {};
		const listData = clazz.list || {};

		isComplete.value = res.clazz ? true : false;
		isUser.value = clazz.user ? 1 : 0;
		idCardFrontUrl.value = userInfo.idCardFrontUrl || idCardFrontUrl.value;
		idCardBackUrl.value = userInfo.idCardBackUrl || idCardBackUrl.value;
		userName.value = userInfo.userName || userName.value;
		userIdCard.value = userInfo.userIdCard || userIdCard.value;
		mobile.value = userInfo.mobile || mobile.value;
		auditStatus.value = userInfo.auditStatus || auditStatus.value;
		auditMsg.value = userInfo.rejectedReason || auditMsg.value;
		editId.value = userInfo.id;
		ocrData.value = userInfo || listData;
	} catch (error) {
		uni.showToast({ title: error, icon: 'none' });
	}
};

/**
 * 获取企业认证信息
 */
const getyldjEnterprise = async () => {
	try {
		const res = await getByCreditCode({ creditCode: creditCode.value });
		console.log('获取企业认证信息', res);
		const clazz = res.clazz || {};
		isComplete.value = res.clazz ? true : false;
		bindType.value = '2';
		busLicense.value = clazz.businessLicenseImage || '';
		enterpriseName.value = clazz.enterpriseName || '';
		socialCreditCode.value = clazz.creditCode || '';
		legalPerson.value = clazz.legalRepresentative || '';
		busTimeStart.value = clazz.businessStartDate || '';
		mobiles.value = clazz.contactPhone || '';
		busTimeEnd.value = clazz.businessEndDate || '';
	} catch (error) {
		uni.showToast({ title: error, icon: 'none' });
	}
};

/**
 * 上传营业执照（含OCR识别）
 */
const uploadImg = async () => {
	isUploading.value = true;

	try {
		// 选择图片
		const path = await chooseOneImage();
		const uploadRes: any = await uploadFile({
			url: '/file/upload',
			filePath: path,
		});
		console.log('上传结果', uploadRes);
		// busLicense.value = uploadRes.data.url;
		if (uploadRes.code == 200) {
			// 调用OCR接口识别营业执照
			const ocrRes = await ocrRecognitionYldj(path, '9');
			console.log('营业执照信息的ocr', ocrRes);
			// 处理OCR结果
			const timeArr = ocrRes.operationPeriod ? ocrRes.operationPeriod.split('至') : [];

			busLicense.value = uploadRes.data.url;
			enterpriseName.value = ocrRes.enterpriseName || '';
			socialCreditCode.value = ocrRes.socialCreditCode || '';
			legalPerson.value = ocrRes.legalPerson || '';
			busTimeStart.value = timeArr[0] || '';
			busTimeEnd.value = timeArr[1] || '';
			bindType.value = '2';
			busOcrData.value = ocrRes;
		}
	} catch (error) {
		uni.showToast({ title: error, icon: 'none' });
	} finally {
		isUploading.value = false;
	}
};

const chooseOneImage = (): Promise<string> => {
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
			fail: (err) => reject(),
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
			fail: (err) => reject(),
		});
		// #endif
	});
};

/**
 * 上传身份证正面
 */
const uploadIdFront = () => {
	uploadId('front');
};

/**
 * 上传身份证背面
 */
const uploadIdBack = () => {
	uploadId('back');
};

/**
 * 上传身份证（通用方法）
 */
const uploadId = async (type: 'front' | 'back') => {
	try {
		// 选择图片
		const path = await chooseOneImage();
		const code = type === 'front' ? '1' : '2';
		if (path) {
			const uploadRes: any = await uploadFile({
				url: '/file/upload',
				filePath: path,
			});

			if (uploadRes.code == 200) {
				// 调用OCR接口识别身份证
				const ocrRes = await ocrRecognitionYldj(path, code);
				console.log('身份证信息的ocr', ocrRes);

				// 根据类型更新数据
				if (type === 'front') {
					idCardFrontUrl.value = uploadRes.data.url;
					userName.value = ocrRes.name || '';
					userIdCard.value = ocrRes.idCardNo || '';
					ocrData.value = ocrRes;
					uni.setStorageSync('ocrData', ocrRes);
				} else {
					idCardBackUrl.value = uploadRes.data.url;
				}
			}
		}
	} catch (e: any) {
		// uni.showToast({ title: e?.resultMsg || '选择失败', icon: 'none' });
	}
};

/**
 * 设置营业期限止为"长期"
 */
const setText = () => {
	busTimeEnd.value = '长期';
	setStatus.value = true;
};

/**
 * 输入框内容变化（动态更新字段）
 */
const getInput = (e: Event, fieldName: string) => {
	console.log('输入的数据', e);
	const value = e.detail.value;

	// 根据字段名动态更新响应式数据
	switch (fieldName) {
		case 'userName':
			userName.value = value;
			break;
		case 'userIdCard':
			userIdCard.value = value;
			break;
		case 'mobile':
			mobile.value = value;
			break;
		case 'mobiles':
			mobiles.value = value;
			break;
		case 'enterpriseName':
			enterpriseName.value = value;
			break;
		case 'socialCreditCode':
			socialCreditCode.value = value;
			break;
		case 'legalPerson':
			legalPerson.value = value;
			break;
		default:
			break;
	}
};

/**
 * 日期选择变化
 */
const timerChange = (e, fieldName: string) => {
	const value = e.detail.value;

	switch (fieldName) {
		case 'busTimeStart':
			busTimeStart.value = value;
			break;
		case 'busTimeEnd':
			busTimeEnd.value = value;
			break;
		default:
			break;
	}
};

/**
 * 预览图片
 */
const look = (type: 'front' | 'back' | 'busLicense') => {
	let imageUrl = '';

	switch (type) {
		case 'front':
			imageUrl = idCardFrontUrl.value;
			break;
		case 'back':
			imageUrl = idCardBackUrl.value;
			break;
		case 'busLicense':
			imageUrl = busLicense.value;
			break;
	}

	console.log('当前图片链接: ', imageUrl);
	if (imageUrl) {
		uni.previewImage({
			current: imageUrl,
			urls: [imageUrl],
		});
	} else {
		console.log('图片链接无效，无法预览');
	}
};

/**
 * 表单校验
 */
const validateForm = (): boolean => {
	// 校验协议勾选
	if (!checked.value) {
		isProtocolVisible.value = true;
		return false;
	}

	// 企业认证校验
	if (bindType.value === '2') {
		// 校验营业执照
		if (!busLicense.value) {
			uni.showToast({ title: '请上传营业执照', icon: 'none' });
			return false;
		}

		// 校验企业名称
		if (!enterpriseName.value) {
			uni.showToast({ title: '请输入企业名称', icon: 'none' });
			return false;
		}

		// 校验信用代码
		if (!socialCreditCode.value) {
			uni.showToast({ title: '请输入信用代码', icon: 'none' });
			return false;
		}

		// 校验法人姓名
		if (!legalPerson.value) {
			uni.showToast({ title: '请输入法人姓名', icon: 'none' });
			return false;
		}

		// 校验营业期限起
		if (!busTimeStart.value) {
			uni.showToast({ title: '请输入营业期限起始时间', icon: 'none' });
			return false;
		}

		// 校验手机号
		const phoneRegex = /^1[3-9]\d{9}$/;
		if (!mobiles.value || !phoneRegex.test(mobiles.value)) {
			uni.showToast({ title: '请输入有效的手机号', icon: 'none' });
			return false;
		}
	}

	// 个人认证校验
	if (bindType.value === '1') {
		// 校验姓名
		if (!userName.value) {
			uni.showToast({ title: '请输入姓名', icon: 'none' });
			return false;
		}

		// 校验身份证号（18位）
		const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
		if (!userIdCard.value || !idCardRegex.test(userIdCard.value)) {
			uni.showToast({ title: '请输入有效的身份证号', icon: 'none' });
			return false;
		}

		// 校验手机号
		const phoneRegex = /^1[3-9]\d{9}$/;
		if (!mobile.value || !phoneRegex.test(mobile.value)) {
			uni.showToast({ title: '请输入有效的手机号', icon: 'none' });
			return false;
		}

		// 校验身份证正反面
		if (!idCardFrontUrl.value || !idCardBackUrl.value) {
			uni.showToast({ title: '请上传身份证正反面', icon: 'none' });
			return false;
		}
	}

	return true;
};

/**
 * 提交按钮点击
 */
const submit = () => {
	// 表单校验
	if (!validateForm()) return;

	// 校验通过，提交数据
	submitEvt();
};

/**
 * 提交数据到接口
 */
const submitEvt = async () => {
	try {
		// 个人认证提交
		if (bindType.value === '1') {
			const params = {
				idCardFrontUrl: idCardFrontUrl.value,
				idCardBackUrl: idCardBackUrl.value,
				userName: userName.value,
				userIdCard: userIdCard.value,
				mobile: mobile.value,
				idCardVo: uni.getStorageSync('ocrData') || ocrData.value,
				id: editId.value,
			};

			console.log('个人提交数据:', params);

			// 编辑/新增接口选择
			const res = editId.value ? await yldjEditUser(params) : await yldjSaveUser(params);

			uni.showToast({ title: res.resultMsg || '提交成功', icon: 'none' });
			// 跳转审核页面
			uni.navigateTo({
				url: `/pages_D/volumePricing/review/index?id=${id.value}&bindType=${bindType.value}&auditType=${res.clazz?.auditType}`,
			});
		}

		// 企业认证提交
		if (bindType.value === '2') {
			const params = {
				enterpriseName: enterpriseName.value,
				creditCode: socialCreditCode.value,
				businessLicenseImage: busLicense.value,
				legalRepresentative: legalPerson.value,
				contactPhone: mobiles.value,
				businessStartDate: busTimeStart.value,
				businessEndDate: busTimeEnd.value,
				businessLicenseVo: busOcrData.value,
			};

			console.log('企业提交参数:', params);

			const res = await yldjSaveEnterprise(params);
			uni.showToast({ title: res.resultMsg || '提交成功', icon: 'none' });
			// 跳转审核页面
			uni.navigateTo({
				url: `/pages_D/volumePricing/review/index?bindType=${bindType.value}&creditCode=${socialCreditCode.value}`,
			});
		}
	} catch (error) {
		uni.showToast({ title: error, icon: 'none' });
	}
};
</script>

<style lang="scss" scoped>
/* pages_D/volumePricing/improve/index.wxss */
page {
	background-color: #f6f5f4;
	height: 100%;
	padding: 24rpx;
	box-sizing: border-box;
}

/* index.wxss */
.container-header {
	display: flex;
	box-sizing: border-box;
	flex-direction: column;
	padding: 30rpx;
	background-color: #fff;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
}

.audit-box {
	font-weight: 500;
	font-size: 26rpx;
	color: #ff0000;
	margin-bottom: 20rpx;
}

.audit-box-b {
	font-weight: 500;
	font-size: 26rpx;
	color: #333333;
	margin-bottom: 20rpx;
}

.title {
	font-size: 28rpx;
	font-weight: bold;
}

.tou {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.lanjie {
	width: 6rpx;
	height: 36rpx;
	border-radius: 4rpx;
	opacity: 1;
	margin-right: 20rpx;
	background: #37b1ff;
}

.identity-type {
	display: flex;
	justify-content: space-between;
	width: 100%;
	box-sizing: border-box;
}

.identity-type text {
	font-size: 28rpx;
	color: #000;
}

.identity-text {
	font-size: 28rpx;
	color: #999999;
}

.radio-group {
	display: flex;
	align-items: center;
}

.identity-box {
	display: flex;
	align-items: center;
}

.radio-item {
	display: flex;
	align-items: center;
	margin-left: 20rpx;
	font-size: 28rpx;
	color: #000;
}

.radio-item radio {
	margin-right: 10rpx;
}

.no-cont {
	width: 431rpx;
	height: 312rpx;
	background-color: #f7f8f9;
	border-radius: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20rpx;
}

.n-data {
	width: 282rpx;
	height: 141rpx;
}

.camera-view {
	width: 100%;
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tip-text {
	width: 702rpx;
	height: 76rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
	margin: 20rpx auto;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	box-sizing: border-box;
}

.tip-text > image {
	width: 32rpx;
	height: 32rpx;
	margin-right: 18rpx;
}

.tip-text > text {
	font-size: 24rpx;
	color: #ff9600;
}

.ocr-res-view {
	width: 702rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
	margin: 0 auto;
	padding: 0 24rpx;
	box-sizing: border-box;
	box-shadow: 0px -3px 12px 0px #f7f9fb;
}

.ocr-res-view .input-style:last-child {
	border: none !important;
}

.ocr-res-view .input-style {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 106rpx;
	border-bottom: solid 1rpx #e1e1e1;
	text-align: right;
}

.ocr-res-view .input-style > view:nth-child(2) {
	flex: 1;
	display: flex;
	justify-content: flex-end;
}

.ocr-res-view .input-style > view:nth-child(2) input {
	width: 480rpx;
	height: 80rpx;
	text-align: right;
}

.ocr-res-view .input-style > view:nth-child(2) {
	display: flex;
	align-items: center;
}

.ocr-res-view .input-style > view:nth-child(2) image {
	width: 11rpx;
	height: 21rpx;
	margin-left: 20rpx;
}

.ocr-res-view .input-style > view:nth-child(2) .p-view {
	width: 100%;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.ocr-res-view .input-style > view:nth-child(2) .p-view view {
	display: flex;
	align-items: center;
}

.add-btn {
	width: 100%;
	height: 158rpx;
	background-color: #ffffff;
	position: fixed;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 24rpx;
	box-sizing: border-box;
	z-index: 10;
}

.add-btn > text {
	flex: 1;
	height: 88rpx;
	background: linear-gradient(180deg, #f7b77f 0%, #ec8733 100%), #ff6503;
	background-blend-mode: normal, normal;
	box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(62, 169, 254, 0.3);
	font-size: 30rpx;
	color: #ffffff;
	font-weight: bold;
	text-align: center;
	line-height: 88rpx;
}

.along-btn {
	width: 130rpx;
	font-size: 28rpx !important;
	color: #34b2fe;
	border-radius: 10rpx;
	border: solid 2rpx #34b2fe;
	box-sizing: border-box;
	text-align: center;
	height: 50rpx !important;
	line-height: 50rpx;
	margin-left: 20rpx;
}

/* checkbox.wxss */
.checkbox-container {
	display: flex;
	align-items: center;
	margin-top: 40rpx;
}

.label {
	font-size: 30rpx;
	/* 字体大小 */
	color: #333;
	margin-left: 20rpx;
	/* 左边距 */
}

.label > text {
	color: #1876ff;
}

.checkbox-container .checkbox {
	width: 40rpx;
	/* 宽度 */
	height: 40rpx;
	/* 高度 */
}

.sf-top {
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	background-color: #f4f6f8;
	border: 2rpx #999 dashed;
	margin-bottom: 20rpx;
}

.cri-img {
	width: 32rpx;
	height: 32rpx;
	margin-right: 20rpx;
}

.n-data-1 {
	width: 304rpx;
	height: 203rpx;
}

.sf-text-1 {
	font-size: 30rpx;
	font-weight: 700;
	margin-bottom: 15rpx;
}

.sf-text-2 {
	font-size: 24rpx;
	color: #c8cee0;
}

.agree-icon {
	width: 32rpx;
	height: 32rpx;
	margin-left: 10rpx;
}

.more-icon {
	width: 28rpx !important;
	height: 28rpx !important;
	margin-left: 20rpx !important;
}

.selectbox {
	display: flex;
	align-items: center;
}
</style>
