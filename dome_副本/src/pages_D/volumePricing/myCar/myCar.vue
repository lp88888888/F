<template>
	<view class="container">
		<!-- 审核中或已通过 -->
		<view class="colCon" v-if="info.auditStatus === '01' || info.auditStatus === '02'">
			<view class="col-con">
				<view class="rejectTip" v-if="info.auditStatus === '01'">您的资料正在审核中...</view>
				<view class="con">
					<!-- 审核驳回 -->
					<view class="colCon" v-if="info.auditStatus === '03'">
						<text class="tex28_red_b">审核被驳回</text>
					</view>

					<!-- 车牌号展示 -->
					<view class="numCon">
						<view v-for="(item, index) in info.vehicleNumber" :key="index">
							<!-- 蓝牌 -->
							<template v-if="info.licensePlateColor === '0'">
								<view class="carNumBg bg_blue">{{ item }}</view>
							</template>
							<!-- 黄牌 -->
							<template v-else-if="info.licensePlateColor === '1'">
								<view class="carNumBg bg_yellow">{{ item }}</view>
							</template>
							<!-- 绿牌 -->
							<template v-else-if="info.licensePlateColor === '4'">
								<view class="carNumBg bg_green">{{ item }}</view>
							</template>
							<!-- 黄绿 -->
							<template v-else-if="info.licensePlateColor === '5'">
								<view class="carNumBg bg_yellow" v-if="index < 2">{{ item }}</view>
								<view class="carNumBg bg_green" v-else>{{ item }}</view>
							</template>
						</view>
						<view class="carNumBg3" v-if="info.licensePlateColor !== '4' && info.licensePlateColor !== '5'">新能源</view>
					</view>

					<view class="tex32_33_b">我的车牌</view>
					<!-- 车牌图片 -->
					<template v-if="info.licensePlateColor === '0'">
						<view class="plateBg">
							<image class="plateImg" :src="imgUrl + 'mine/car_b.png'" mode="" />
							<text class="texBlack" style="color: white">{{ info.vehicleNumber }}</text>
						</view>
					</template>
					<template v-else-if="info.licensePlateColor === '1'">
						<view class="plateBg">
							<image class="plateImg" :src="imgUrl + 'mine/car_y.png'" mode="" />
							<text class="texBlack">{{ info.vehicleNumber }}</text>
						</view>
					</template>
					<template v-else-if="info.licensePlateColor === '4'">
						<view class="plateBg">
							<image class="plateImg" :src="imgUrl + 'mine/car_g.png'" mode="" />
							<text class="texBlack">{{ info.vehicleNumber }}</text>
						</view>
					</template>
					<template v-else-if="info.licensePlateColor === '5'">
						<view class="plateBg">
							<image class="plateImg" :src="imgUrl + 'mine/car_yg1.png'" mode="" />
							<text class="texBlack">{{ info.vehicleNumber }}</text>
						</view>
					</template>

					<!-- 行驶证照片 -->
					<view class="" style="margin-top: 30rpx">
						<text class="tex32_33_b">行驶证照片</text>
					</view>
					<!-- 纸质行驶证 -->
					<view class="rowCon" style="margin-top: 30rpx" v-if="drivingLicenseType === '1'">
						<view class="colCon" style="align-items: center">
							<view class="imgCon" :data-type="'front'">
								<image class="cardBg" :src="driverCardFrontRead" @tap="previewImg(1)" />
							</view>
							<text class="tex24_33 cardTip">行驶证主页</text>
						</view>
						<view class="colCon" style="margin-left: 90rpx; align-items: center">
							<view class="imgCon" :data-type="'back'">
								<image class="cardBg" :src="driverCardBackRead" @tap="previewImg(2)" />
							</view>
							<text class="tex24_33 cardTip">行驶证副页</text>
						</view>
					</view>
					<!-- 电子行驶证 -->
					<view class="rowCon" style="margin-top: 30rpx" v-if="drivingLicenseType === '2'">
						<view class="colCon" style="align-items: center">
							<view class="imgCon" :data-type="'front'">
								<image class="cardBg" :src="driverCardFrontReads" @tap="previewImg(1)" />
							</view>
							<text class="tex24_33 cardTip">电子行驶证</text>
						</view>
					</view>

					<!-- 车辆所属 -->
					<view class="rowCon" style="margin-top: 50rpx">
						<text class="tex32_33_b" style="flex: 1">车辆所属</text>
					</view>

					<!-- 非编辑状态 -->
					<template v-if="!showModify">
						<view class="rowCon" style="padding: 50rpx 0">
							<image class="icAddRaido" :src="imgUrl + '/wximage/trip-pro/ic_ad_select.png'" />
							<text class="tex32_33">{{ info.ocrBindType === '01' ? '个人' : '公司' }}</text>
						</view>
						<view class="rowCon">
							<view class="tex32_00" style="width: 180rpx">
								{{ info.ocrBindType === '01' ? '所属者姓名' : '公司名称' }}
							</view>
							<view class="tex32_00">{{ info.userName || '' }}</view>
						</view>
						<view class="rowCon mt20" v-if="!isUser">
							<view class="tex32_00" style="width: 180rpx"> 所属企业 </view>
							<view class="tex32_00" style="width: 400rpx">{{ info.enterpriseName || '' }}</view>
						</view>
						<view class="rowCon mt20">
							<text class="tex32_00" style="width: 180rpx">身份所属</text>
							<view class="tex32_00" style="width: 400rpx">{{ info.bindType === '01' ? '个人' : '企业' }}</view>
						</view>
					</template>

					<!-- 编辑状态 -->
					<template v-else>
						<view class="raidoCon">
							<view class="rowCon" @tap="changeRadioType('01')" :data-type="'1'">
								<image class="icAddRaido" :src="imgUrl + '/wximage/trip-pro/' + (radioType === '01' ? 'ic_ad_select.png' : 'ic_ad_normal.png')" />
								<text class="tex32_33">个人</text>
							</view>
							<view class="rowCon" @tap="changeRadioType('02')" :data-type="'2'">
								<image class="icAddRaido" :src="imgUrl + '/wximage/trip-pro/' + (radioType === '02' ? 'ic_ad_select.png' : 'ic_ad_normal.png')" />
								<text class="tex32_33">公司</text>
							</view>
							<view></view>
						</view>
						<view class="rowCon bottomLine">
							<text class="tex32_00" style="width: 220rpx">{{ radioType === '01' ? '所属人姓名' : '公司名称' }}</text>
							<input
								class="tex32_33"
								:placeholder-class="'tex30_66'"
								placeholder="请输入"
								:data-name="'ownerTex'"
								:value="ownerTex"
								@input="getInputKey"
							/>
						</view>
						<view class="btnCon">
							<view></view>
							<view class="modifyBtn" @tap="update">提交</view>
						</view>
					</template>

					<!-- 备注和解绑 -->
					<view class="remark">
						<!-- <text class="tex28_66">如在使用过程中,需要修改车辆资料信息,添加客服微信。</text> -->
						<!-- <text class="texCopy" @tap="copyWx">添加微信</text> -->
						<view style="flex: 1"></view>
						<view class="unbindLight" @tap="unbindSubmit"> 我要解绑 </view>
						<view class="unbindCon">
							<text class="unbind" @tap="unbindTip">解绑须知</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 审核驳回 -->
		<view v-else>
			<view class="pageCon">
				<view class="col-con">
					<view class="colCon" v-if="info.auditStatus === '03'">
						<text class="tex28_red_b">审核被驳回</text>
						<text class="tex28_red">{{ info.auditOpinions || '请核实信息后重新提交!' }}</text>
					</view>

					<!-- 车牌号码输入 -->
					<view class="whiteBg" style="margin-top: 40rpx">
						<text class="tex32_33_b">车牌号码</text>
						<view class="numCon" style="margin-top: 40rpx" @tap="showCarKeyboard">
							<view v-for="(item, index) in carNum" :key="index">
								<!-- 蓝牌 -->
								<template v-if="carType === 'b'">
									<view class="carNumBg bg_blue" v-if="item !== '?'" @tap="selectCity" :data-index="index">
										{{ item }}
									</view>
									<view class="carNumBg bg_normal" v-else></view>
								</template>
								<!-- 黄牌 -->
								<template v-else-if="carType === 'y'">
									<view class="carNumBg bg_yellow" v-if="item !== '?'" @tap="selectCity" :data-index="index">
										{{ item }}
									</view>
									<view class="carNumBg bg_normal" v-else></view>
								</template>
								<!-- 绿牌 -->
								<template v-else-if="carType === 'g'">
									<view class="carNumBg bg_green" v-if="item !== '?'" @tap="selectCity" :data-index="index">
										{{ item }}
									</view>
									<view class="carNumBg bg_normal" v-else></view>
								</template>
								<!-- 黄绿 -->
								<template v-else-if="carType === 'yg'">
									<template v-if="index < 2">
										<view class="carNumBg bg_yellow" v-if="item !== '?'" @tap="selectCity" :data-index="index">
											{{ item }}
										</view>
										<view class="carNumBg bg_normal" v-else></view>
									</template>
									<template v-else>
										<view class="carNumBg bg_green" v-if="item !== '?'">{{ item }}</view>
										<view class="carNumBg bg_normal" v-else></view>
									</template>
								</template>
							</view>
							<view class="carNumBg3" v-if="carType !== 'g' && carType !== 'yg'">新能源</view>
						</view>

						<!-- 车牌颜色选择 -->
						<text class="tex32_33_b">车牌颜色</text>
						<view class="rowCon between">
							<view class="colCenter" @tap="changeCarType('b')" :data-type="'b'">
								<image class="carImg" :src="imgUrl + '/wximage/trip-pro/car_b.png'" />
								<image class="icSelect" :src="imgUrl + '/wximage/trip-pro/' + (carType === 'b' ? 'car_select.png' : 'car_normal.png')" />
								<text class="tex24_33">小型货车/小型客车</text>
							</view>
							<view class="colCenter" @tap="changeCarType('y')" :data-type="'y'">
								<image class="carImg" :src="imgUrl + '/wximage/trip-pro/car_y.png'" />
								<image class="icSelect" :src="imgUrl + '/wximage/trip-pro/' + (carType === 'y' ? 'car_select.png' : 'car_normal.png')" />
								<text class="tex24_33">大型货车/大型客车</text>
							</view>
						</view>
						<view class="rowCon between">
							<view class="colCenter" @tap="changeCarType('g')" :data-type="'g'">
								<image class="carImg" :src="imgUrl + '/wximage/trip-pro/car_g.png'" />
								<image class="icSelect" :src="imgUrl + '/wximage/trip-pro/' + (carType === 'g' ? 'car_select.png' : 'car_normal.png')" />
								<text class="tex24_33">小型新能源车</text>
							</view>
							<view class="colCenter" @tap="changeCarType('yg')" :data-type="'yg'">
								<image class="carImg" :src="imgUrl + '/wximage/trip-pro/car_y2g.png'" />
								<image class="icSelect" :src="imgUrl + '/wximage/trip-pro/' + (carType === 'yg' ? 'car_select.png' : 'car_normal.png')" />
								<text class="tex24_33">大型新能源车</text>
							</view>
						</view>
					</view>

					<!-- 上传行驶证 -->
					<view class="whiteBg" style="margin-top: 12rpx">
						<text class="tex32_33_b">上传行驶证</text>
						<view class="raidoCon" style="padding: 20rpx 0">
							<view class="rowCon" @tap="changeRadioTypes('1')" :data-type="'1'">
								<image
									class="icAddRaido"
									:src="imgUrl + '/wximage/trip-pro/' + (drivingLicenseType === '1' ? 'ic_ad_select.png' : 'ic_ad_normal.png')"
								/>
								<text class="tex32_33">纸质行驶证</text>
							</view>
							<view class="rowCon" @tap="changeRadioTypes('2')" :data-type="'2'">
								<image
									class="icAddRaido"
									:src="imgUrl + '/wximage/trip-pro/' + (drivingLicenseType === '2' ? 'ic_ad_select.png' : 'ic_ad_normal.png')"
								/>
								<text class="tex32_33">电子行驶证</text>
							</view>
							<view></view>
						</view>

						<!-- 纸质行驶证上传 -->
						<view class="rowCon" style="margin-top: 30rpx" v-if="drivingLicenseType === '1'">
							<view class="colCon" @tap="updateImg('front')" :data-type="'front'" style="align-items: center">
								<view class="imgCon">
									<image class="cardBg" :src="driverCardFrontRead" />
									<image class="ic_camera" :src="imgUrl + '/wximage/trip-pro/car_camrea.png'" v-if="!driverCardFrontRead" />
								</view>
								<text class="tex24_33 cardTip">行驶证正面</text>
							</view>
							<view class="colCon" @tap="updateImg('back')" :data-type="'back'" style="margin-left: 90rpx; align-items: center">
								<view class="imgCon">
									<image class="cardBg" :src="driverCardBackRead" />
									<image class="ic_camera" :src="imgUrl + '/wximage/trip-pro/car_camrea.png'" v-if="!driverCardBackRead" />
								</view>
								<text class="tex24_33 cardTip">行驶证副页</text>
							</view>
						</view>

						<!-- 电子行驶证上传 -->
						<view class="rowCon" style="margin-top: 30rpx" v-if="drivingLicenseType === '2'">
							<view class="colCon" @tap="uploadImgs('front')" :data-type="'front'" style="align-items: center">
								<view class="imgCon">
									<image class="cardBg" :src="driverCardFrontReads" />
									<image class="ic_camera" :src="imgUrl + '/wximage/trip-pro/car_camrea.png'" v-if="!driverCardFrontReads" />
								</view>
								<text class="tex24_33 cardTip">电子行驶证</text>
							</view>
						</view>
					</view>

					<!-- 车辆所属 -->
					<view class="whiteBg" style="margin-top: 12rpx">
						<text class="tex32_33_b">车辆所属</text>
						<view class="raidoCon">
							<view class="rowCon" @tap="changeRadioType('01')" :data-type="'01'">
								<image class="icAddRaido" :src="imgUrl + '/wximage/trip-pro/' + (radioType === '01' ? 'ic_ad_select.png' : 'ic_ad_normal.png')" />
								<text class="tex32_33">个人</text>
							</view>
							<view class="rowCon" @tap="changeRadioType('02')" :data-type="'02'">
								<image class="icAddRaido" :src="imgUrl + '/wximage/trip-pro/' + (radioType === '02' ? 'ic_ad_select.png' : 'ic_ad_normal.png')" />
								<text class="tex32_33">公司</text>
							</view>
							<view></view>
						</view>
						<view class="rowCon bottomLine">
							<text class="tex32_00" style="width: 220rpx">{{ radioType === '01' ? '所属人姓名' : '公司名称' }}</text>
							<input
								class="tex32_33"
								:placeholder-class="'tex30_66'"
								placeholder="请输入"
								:data-name="'ownerTex'"
								:value="ownerTex"
								@input="getInputKey"
							/>
						</view>

						<!-- 所属企业 -->
						<view class="rowCon mt20" v-if="isUser !== 1">
							<text class="tex30_00" style="width: 180rpx">所属企业</text>
							<picker mode="selector" :range-key="'enterpriseName'" :value="id" :range="enterpriseList" @change="handleEnterpriseChange">
								<view class="filter-item">
									<view class="rowCon">
										<text class="tex30_33">{{ enterpriseError || '请选择' }}</text>
										<image class="arrow-icon" :src="imgUrl + '/volumePricing/vp_drop.png'" />
									</view>
								</view>
							</picker>
						</view>

						<!-- 提交按钮 -->
						<view class="btn" @tap="popShow">提交</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 弹窗 -->
		<up-popup :show="showPop" mode="center" :safeAreaInsetBottom="false">
			<view class="popCon">
				<view class="popTitle">提示</view>
				<view class="popContent">
					<text>请确认车辆信息无误，提交后将进入审核流程</text>
				</view>
				<view class="popFooter">
					<view class="popBtn" @tap="popClose">取消</view>
					<view class="popBtn popBtnActive" @tap="sure">确认</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { yldjCarEnterprise, yldjRevokeApply, getUnbindRules, yldjunBindVehicle } from '@/api/volumePricing';
import { ocrRecognition } from '@/utils/ocr';
import { imgUrl, baseUrl } from '@/config';

// 数据定义
const info = ref({});
const showModify = ref(false);
const radioType = ref('01');
const ownerTex = ref('');
const driverCardFront = ref('');
const driverCardFrontRead = ref('');
const driverCardFrontReads = ref('');
const driverCardBack = ref('');
const driverCardBackRead = ref('');
const carNum = ref('陕??????');
const carType = ref('b');
const translateSpace = ref(0);
const inputType = ref(1);
const showPlateInput = ref(false);
const btnEnabled = ref(true);
const timer = ref(3);
const showPop = ref(false);
const bindRule = ref('');
const ocrDataFront = ref({});
const ocrDataBack = ref({});
const unBindButtonStatus = ref('03');
const drivingLicenseType = ref('');
const radioTypes = ref('03');
const ocrName = ref('');
const ocrCarNo = ref('');
const ocrCarType = ref('');
const bindType = ref('');
const carId = ref('');
const enterpriseId = ref('');
const enterpriseList = ref([]);
const enterpriseError = ref('');
const isUser = ref('');
const id = ref('');

const baseurlnew = computed(() => {
	return 'https://services.sxjk-cloud.com:32570';
});

// 生命周期函数
onLoad((options) => {
	if (options.id) {
		id.value = options.id;
		loadData();
	} else {
		loadData();
	}
	getEnterpriseList();
	getUnbindRuless();
});

// 方法定义
const getEnterpriseList = async () => {
	try {
		const params = {
			pageNum: 1,
			pageSize: 1000,
		};
		const res = await yldjCarEnterprise(params);
		enterpriseList.value = res.page.records;
	} catch (error) {
		uni.showToast({ title: error.message, icon: 'none' });
	}
};

const chooseOneImage = () => {
	return new Promise((resolve, reject) => {
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

// 统一 OCR 调用（回调 => Promise）
const callOCR = (filePath, side) => {
	const ocrType = side === 'front' ? 'LICENSE_DEPARTURE_FRONT' : side === 'back' ? 'LICENSE_DEPARTURE_BACK' : 'LICENSE_DEPARTURE_ELECTRONIC'; // 电子行驶证（后端类型码按需调整）

	uni.showLoading({ title: '识别中...' });

	return new Promise((resolve, reject) => {
		ocrRecognition(
			filePath,
			'行驶证',
			ocrType,
			(res) => {
				resolve(res); // 预期结构：{ url:{readUrl,imageUrl}, data:{ name, ... } }
			},
			(err) => {
				reject(err);
			}
		);
	});
};

const handleEnterpriseChange = (e) => {
	const index = e.detail.value;
	const list = enterpriseList.value[index];
	enterpriseError.value = list.enterpriseName;
	enterpriseId.value = list.id;
};

const updateImg = async (type) => {
	// 已上传的暂不支持更新操作
	// if (!needUpload.value) {
	//   return
	// }

	try {
		const path = await chooseOneImage();
		const res = await callOCR(path, type);
		if (type === 'front') {
			driverCardFrontRead.value = res.readUrl;
			driverCardFront.value = res.imageUrl;
			ownerTex.value = res.data.name;
			ocrName.value = res.data.name;
			ocrCarNo.value = res.data.carNo;
			ocrCarType.value = res.data.carType;
		} else {
			driverCardBackRead.value = res.readUrl;
			driverCardBack.value = res.imageUrl;
		}
	} catch (e) {
		uni.showToast({ title: e?.message || '选择失败', icon: 'none' });
	}

	// uni.chooseImage({
	// 	count: 1,
	// 	sizeType: ['original', 'compressed'],
	// 	sourceType: ['album', 'camera'],
	// 	success: async (res) => {
	// 		const path = res.tempFilePaths[0];
	// 		uni.showLoading({ title: '上传中...' });
	// 		try {
	// 			// 这里需要替换为实际的 API 调用
	// 			// const res = await dataApi.uploadMerchantImage(path, '行驶证')
	// 			// if (type === 'front') {
	// 			//   driverCardFrontRead.value = res.readUrl
	// 			//   driverCardFront.value = res.imageUrl
	// 			//   ownerTex.value = res.data.name
	// 			//   ocrName.value = res.data.name
	// 			//   ocrCarNo.value = res.data.carNo
	// 			//   ocrCarType.value = res.data.carType
	// 			// } else {
	// 			//   driverCardBackRead.value = res.readUrl
	// 			//   driverCardBack.value = res.imageUrl
	// 			// }
	// 		} catch (error) {
	// 			uni.showToast({ title: '上传失败', icon: 'none' });
	// 		} finally {
	// 			uni.hideLoading();
	// 		}
	// 	},
	// });
};

const getUnbindRuless = async () => {
	try {
		// 这里需要替换为实际的 API 调用
		const res = await getUnbindRules();
		bindRule.value = res.clazz.vehicleUnbindRule || '';
	} catch (error) {
		// 忽略错误
	}
};

const unbindTip = () => {
	uni.showModal({
		title: '温馨提示',
		content: bindRule.value,
		showCancel: false,
		confirmText: '我知道了',
	});
};

const previewImg = (type) => {
	const imgs = [];
	if (type === 1) {
		imgs.push(driverCardFrontRead.value);
	} else {
		imgs.push(driverCardBackRead.value);
	}
	uni.previewImage({
		urls: imgs,
	});
};

const recoveryVehicle = async () => {
	try {
		const params = {
			userId: uni.getStorageSync('userInfo').id,
		};
		uni.showLoading({ title: '加载中...' });
		// 这里需要替换为实际的 API 调用
		// const res = await userApi.recoveryVehicle(params)
		// getUserInfo()
	} catch (error) {
		uni.showToast({ title: error.message, icon: 'none' });
	} finally {
		uni.hideLoading();
	}
};

const loadData = async () => {
	try {
		const params = {
			id: id.value,
		};
		// 这里需要替换为实际的 API 调用
		const res = await yldjRevokeApply(params);
		console.log('我的车辆的详情', res);
		info.value = res.clazz;
		ownerTex.value = res.clazz.userName;

		// 处理frontLicense，移除多余的域名
		let frontLicense = res.clazz.frontLicense || '';
		const processedFrontLicense = frontLicense.includes(baseurlnew.value)
			? frontLicense.replace('https://tranalioss.shanyitong.com', '')
			: frontLicense;
		console.log('处理的接口', baseurlnew.value);
		console.log('处理的点至', processedFrontLicense);

		// 处理backLicense，移除多余的域名
		let backLicense = res.clazz.backLicense || '';
		const processedBackLicense = backLicense.includes(baseurlnew.value) ? backLicense.replace('https://tranalioss.shanyitong.com', '') : backLicense;

		driverCardFrontRead.value = res.clazz.drivingLicenseType === '1' ? processedFrontLicense : '';
		driverCardFrontReads.value = res.clazz.drivingLicenseType === '2' ? processedFrontLicense : '';
		driverCardFront.value = processedFrontLicense;
		driverCardBackRead.value = processedBackLicense;
		driverCardBack.value = processedBackLicense;
		drivingLicenseType.value = res.clazz.drivingLicenseType;
		ocrName.value = res.clazz.userName;
		ocrCarNo.value = res.clazz.vehicleNumber;
		ocrCarType.value = res.clazz.carType;
		carId.value = res.clazz.id;
		enterpriseId.value = res.clazz.enterpriseId;
		enterpriseError.value = res.clazz.enterpriseName;
		bindType.value = res.clazz.bindType;
		isUser.value = res.clazz.bindType === '01' ? 1 : 0;

		// 审核状态：01待审核，02同意，03拒绝，04作废
		// 被驳回数据回显
		if (res.clazz && res.clazz.auditStatus === '03') {
			let carTypeVal = '';
			if (res.clazz.licensePlateColor === '01') {
				carTypeVal = 'y';
			} else if (res.clazz.licensePlateColor === '02') {
				carTypeVal = 'b';
			} else if (res.clazz.licensePlateColor === '03') {
				carTypeVal = 'g';
			} else if (res.clazz.licensePlateColor === '04') {
				carTypeVal = 'yg';
			}
			// ocr数据
			const ocrData = {
				carNo: res.clazz.carNo,
				carType: res.clazz.carType,
				name: res.clazz.name,
				engine: res.clazz.engine,
				vin: res.clazz.vin,
				address: res.clazz.address,
				registrationTime: res.clazz.registrationTime,
				licenseDateIssue: res.clazz.licenseDateIssue,
			};
			carNum.value = res.clazz.vehicleNumber;
			carType.value = carTypeVal;
			ownerTex.value = res.clazz.name || ownerTex.value;
			radioType.value = res.clazz.ocrBindType;
		}
	} catch (error) {
		uni.showToast({ title: error.message, icon: 'none' });
	} finally {
		uni.hideLoading();
	}
};

const copyWx = () => {
	uni.previewImage({
		urls: ['https://tranalioss.shanyitong.com/wximage/trip-pro/enterprise-wx.jpg'],
	});
};

const modify = () => {
	showModify.value = !showModify.value;
};

const update = async () => {
	let licensePlateColor = '';
	if (carType.value === 'y') {
		licensePlateColor = '01';
	} else if (carType.value === 'b') {
		licensePlateColor = '02';
	} else if (carType.value === 'g') {
		licensePlateColor = '03';
	} else if (carType.value === 'yg') {
		licensePlateColor = '04';
	}

	if (!ownerTex.value) {
		const str = radioType.value === '01' ? '请输入所属者姓名' : '请输入公司名称';
		uni.showToast({ title: str, icon: 'none' });
		return;
	}

	const params = {
		userName: ownerTex.value,
		ocrBindType: radioType.value,
		vehicleNumber: carNum.value,
		licensePlateColor: licensePlateColor,
		drivingLicenseType: drivingLicenseType.value,
		id: carId.value,
		enterpriseId: enterpriseId.value,
		// ocr数据
		carNo: ocrCarNo.value,
		carType: ocrCarType.value,
		name: ocrName.value,
		backLicense: driverCardBack.value,
		frontLicense: driverCardFront.value,
		bindType: bindType.value,
	};

	try {
		uni.showLoading({ title: '更新中...' });
		// 这里需要替换为实际的 API 调用
		// const res = await dataApi.updateVehicle(params)
		showModify.value = false;
		loadData();
	} catch (error) {
		uni.showToast({ title: error.message, icon: 'none' });
	} finally {
		uni.hideLoading();
	}
};

const updateDriverCard = async () => {
	if (!driverCardFront.value) {
		uni.showToast({ title: '请上传行驶证正面', icon: 'none' });
		return;
	}
	if (!driverCardBack.value) {
		uni.showToast({ title: '请上传行驶证副页', icon: 'none' });
		return;
	}

	const params = {
		drivingLicenseFrontUrl: driverCardFront.value,
		drivingLicenseBackUrl: driverCardBack.value,
		creator: uni.getStorageSync('userInfo').id,
		vehicleId: info.value.vehicleId,
	};

	try {
		uni.showLoading({ title: '更新中...' });
		// 这里需要替换为实际的 API 调用
		// const res = await userApi.updateEnterpriseVehicle(params)
		loadData();
	} catch (error) {
		uni.showToast({ title: error.message, icon: 'none' });
	} finally {
		uni.hideLoading();
	}
};

const changeRadioType = (type) => {
	if (type !== radioType.value) {
		radioType.value = type;
	}
};

const getInputKey = (e) => {
	const key = e.currentTarget.dataset.name;
	const value = e.detail.value;
	if (key === 'ownerTex') {
		ownerTex.value = value;
	}
};

const unbindSubmit = async () => {
	uni.showModal({
		title: '确认解绑',
		content: '确定要解绑当前车辆吗?',
		cancelText: '再想想',
		confirmText: '解绑',
		success: async (res) => {
			if (res.confirm) {
				try {
					const params = {
						id: info.value.id,
					};
					uni.showLoading({ title: '解绑中...' });
					// 这里需要替换为实际的 API 调用
					const res = await yldjunBindVehicle(params);
					console.log('解绑的草所', res);
					uni.showToast({ title: '操作成功', icon: 'success' });
					setTimeout(() => {
						uni.navigateBack();
					}, 600);
				} catch (error) {
					uni.showToast({ title: error.message, icon: 'none' });
				} finally {
					uni.hideLoading();
				}
			}
		},
	});
};

const popShow = () => {
	if (!isCarPlate(carNum.value)) {
		uni.showToast({ title: '请输入正确的车牌号', icon: 'none' });
		return false;
	}

	if (!ownerTex.value) {
		const str = radioType.value === '01' ? '请输入所属者姓名' : '请输入公司名称';
		uni.showToast({ title: str, icon: 'none' });
		return;
	}

	sure(); // 2024.10.9需求绑车取消弹窗
};

const popClose = () => {
	stopTimer();
	showPop.value = false;
	timer.value = 3;
};

const startTimer = () => {
	let nowTimer = setInterval(() => {
		const seconds = timer.value - 1;
		timer.value = seconds;

		if (seconds === 0) {
			stopTimer();
			// timerStatus.value = true
		}
	}, 1000);
};

const stopTimer = () => {
	clearInterval(window.nowTimer);
};

const changeCarType = (type) => {
	let carNumVal = carNum.value;
	const carTypeVal = carType.value;
	// 非新能源切换为新能源,增加占位符
	if (carTypeVal !== 'g' && carTypeVal !== 'yg') {
		if (type === 'g' || type === 'yg') {
			carNumVal += '?';
		}
	}
	// 新能源切换为非新能源,减少占位符
	if (carTypeVal !== 'b' && carTypeVal !== 'y') {
		if (type === 'b' || type === 'y') {
			carNumVal = carNumVal.substring(0, carNumVal.length - 1);
		}
	}
	carType.value = type;
	carNum.value = carNumVal;
};

const showCarKeyboard = () => {
	if (!carNum.value.startsWith('?')) {
		inputType.value = 2;
	}
	showPlateInput.value = true;
};

const sure = async () => {
	if (!btnEnabled.value) {
		return;
	}
	popClose();

	// 01，黄色（大型货车/大型客车）02，蓝色（小型客车/小型货车）03，渐变绿色（小型新能源车）04，黄绿色（大型新能源车）
	let licensePlateColor = '';
	if (carType.value === 'y') {
		licensePlateColor = '01';
	} else if (carType.value === 'b') {
		licensePlateColor = '02';
	} else if (carType.value === 'g') {
		licensePlateColor = '03';
	} else if (carType.value === 'yg') {
		licensePlateColor = '04';
	}

	const params = {
		drivingLicenseBackUrl: driverCardBack.value,
		drivingLicenseFrontUrl: driverCardFront.value,
		licensePlateColor: licensePlateColor,
		userId: uni.getStorageSync('userInfo').id,
		vehicleNumber: carNum.value,
		vehicleOwnership: radioType.value, // "车辆所属：01个人或02公司"
		corporateName: ownerTex.value,
		// ocr识别数据
		carNo: ocrDataFront.value ? ocrDataFront.value.carNo : '',
		carType: ocrDataFront.value ? ocrDataFront.value.carType : '',
		name: ownerTex.value,
		engine: ocrDataFront.value ? ocrDataFront.value.engine : '',
		vin: ocrDataFront.value ? ocrDataFront.value.vin : '',
		address: ocrDataFront.value ? ocrDataFront.value.address : '',
		registrationTime: ocrDataFront.value ? ocrDataFront.value.registrationTime : '',
		licenseDateIssue: ocrDataFront.value ? ocrDataFront.value.licenseDateIssue : '',
		userVehicleId: info.value.id, // 驳回重新提交
		userName: '',
	};

	try {
		uni.showLoading({ title: '提交中...' });
		// 这里需要替换为实际的 API 调用
		// const res = await dataApi.bindVehicle(params)
		uni.showToast({ title: '提交成功', icon: 'success' });
		setTimeout(() => {
			uni.navigateBack();
		}, 600);
	} catch (error) {
		uni.showToast({ title: error.message, icon: 'none' });
	} finally {
		uni.hideLoading();
	}
};

// 辅助方法
const isCarPlate = (plate) => {
	// 简单的车牌验证
	return plate.length >= 7;
};

const getUserInfo = async () => {
	// 获取用户信息
};

const changeRadioTypes = (type) => {
	drivingLicenseType.value = type;
};

const uploadImgs = (type) => {
	uni.chooseImage({
		count: 1,
		sizeType: ['original', 'compressed'],
		sourceType: ['album', 'camera'],
		success: async (res) => {
			const path = res.tempFilePaths[0];
			uni.showLoading({ title: '上传中...' });
			try {
				// 这里需要替换为实际的 API 调用
				// const res = await dataApi.uploadMerchantImage(path, '行驶证')
				// driverCardFrontReads.value = res.readUrl
				// driverCardFront.value = res.imageUrl
				// ownerTex.value = res.data.name
				// ocrName.value = res.data.name
				// ocrCarNo.value = res.data.carNo
				// ocrCarType.value = res.data.carType
			} catch (error) {
				uni.showToast({ title: '上传失败', icon: 'none' });
			} finally {
				uni.hideLoading();
			}
		},
	});
};

const selectCity = (e) => {
	// 选择城市
};
</script>

<style scoped>
/* 样式定义 */
.container {
	background: linear-gradient(180deg, rgba(211, 230, 255, 1) 0%, rgba(223, 235, 250, 1) 25%, rgba(240, 240, 242, 1) 100%);
	min-height: 100vh;
}

.col-con {
	margin: 40rpx 24rpx;
}

.con {
	background-color: #ffffff;
	border-radius: 10rpx;
	padding: 50rpx 20rpx;
	margin: 40rpx 24rpx 20rpx;
}

.remark {
	margin: 0 24rpx;
	padding-bottom: 30rpx;
	flex: 1;
}

.numCon {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	margin-bottom: 50rpx;
}

.carNumBg {
	width: 70rpx;
	height: 90rpx;
	border-radius: 10rpx;
	font-size: 36rpx;
	font-weight: bold;
	line-height: 90rpx;
	text-align: center;
}

.bg_blue {
	background-color: #1342b8;
	color: #ffffff;
}

.bg_yellow {
	background-color: #fcde3a;
	color: #333333;
}

.bg_green {
	background-color: #88eba9;
	color: #333333;
}

.bg_normal {
	background-color: #f0f0f0;
	color: #333333;
}

.carNumBg3 {
	width: 66rpx;
	height: 86rpx;
	background-color: #f2fff6;
	border-radius: 10rpx;
	border: dashed 1rpx #46d375;
	font-size: 24rpx;
	color: #6ebf89;
	writing-mode: vertical-rl;
	text-align: center;
	line-height: 70rpx;
}

.carImg {
	width: 260rpx;
	height: 90rpx;
	margin: 40rpx 0 20rpx;
}

.cardBg {
	width: 250rpx;
	height: 140rpx;
	background-color: #fff7f1;
	border-radius: 10rpx;
}

.cardTip {
	margin-top: 20rpx;
}

.texCopy {
	font-size: 26rpx;
	background-color: #fe7215;
	color: #fff;
	height: 50rpx;
	line-height: 50rpx;
	padding: 0 10rpx;
	border-radius: 10rpx;
	width: 140rpx;
	box-sizing: border-box;
	text-align: center;
	margin-top: 10rpx;
}

.remark {
	display: flex;
	flex-direction: column;
}

.plateBg {
	width: 260rpx;
	height: 90rpx;
	margin: 40rpx 0 20rpx;
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.texBlack {
	font-size: 28rpx;
	color: #000000;
	font-weight: bold;
	position: absolute;
	z-index: 1;
	letter-spacing: 4rpx;
}

.plateImg {
	width: 260rpx;
	height: 90rpx;
	position: absolute;
	top: 0;
	left: 0;
}

.icAddRaido {
	width: 45rpx;
	height: 44rpx;
	margin-right: 20rpx;
}

.modifyImg {
	width: 38rpx;
	height: 38rpx;
	margin-right: 6rpx;
}

.raidoCon {
	background-color: #ffffff;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 50rpx 0;
}

.bottomLine {
	border-bottom: 1rpx solid #e1e1e1;
	padding-bottom: 20rpx;
}

.btnCon {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 30rpx;
}

.modifyBtn {
	background-image: linear-gradient(178deg, #ffd9b2 0%, #e7771a 100%, #ec6132 100%, #f14a4a 100%, #f85f30 100%, #fe7416 100%),
		linear-gradient(#3998bf, #3998bf);
	box-shadow: 0rpx 1rpx 0rpx 0rpx #bcbcbc;
	font-size: 32rpx;
	color: #ffffff;
	border-radius: 10rpx;
	padding: 10rpx 30rpx;
}

.unbindCon {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20rpx;
}

.unbind {
	font-size: 28rpx;
	color: #ff0000;
	border-bottom: 1px solid #ff0000;
}

.imgCon {
	display: flex;
	justify-content: center;
	align-items: center;
}

.ic_camera {
	width: 39rpx;
	height: 33rpx;
	position: absolute;
}

.layer-view {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.33);
	z-index: 9;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.layer-view .rule-view {
	width: 690rpx;
	height: 822rpx;
}

.layer-view .popClose {
	width: 82rpx;
	height: 82rpx;
	margin-top: 40rpx;
}

.pageCon {
}

.whiteBg {
	padding: 40rpx 20rpx 30rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
	box-sizing: border-box;
}

.between {
	justify-content: space-between;
}

.colCenter {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	margin-right: 30rpx;
}

.icSelect {
	width: 50rpx;
	height: 50rpx;
	position: absolute;
	bottom: 30rpx;
	right: -20rpx;
}

.icCamera {
	width: 39rpx;
	height: 33rpx;
	margin-bottom: 20rpx;
}

.cameraBg {
	width: 250rpx;
	height: 140rpx;
	background-color: #fff7f1;
	margin-top: 50rpx;
	border-radius: 10rpx;
}

.btn {
	width: 702rpx;
	height: 100rpx;
	background-image: linear-gradient(178deg, #ffd9b2 0%, #e7771a 100%, #ec6132 100%, #f14a4a 100%, #f85f30 100%, #fe7416 100%),
		linear-gradient(#3998bf, #3998bf);
	box-shadow: 0rpx 1rpx 0rpx 0rpx #bcbcbc;
	font-size: 36rpx;
	color: #ffffff;
	text-align: center;
	line-height: 100rpx;
	margin-top: 50rpx;
	border-radius: 10rpx;
}

.cardImg {
	width: 250rpx;
	height: 140rpx;
	position: absolute;
	top: 0;
	left: 0;
}

.mask {
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 1;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.popCon {
	width: 100%;
	margin: 60rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.popBtn {
	height: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	font-size: 32rpx;
	color: #888888;
}

.popTitle {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
	margin: 40rpx 0;
}

.popContent {
	font-size: 28rpx;
	color: #666666;
	text-align: center;
	padding: 0 40rpx;
	margin-bottom: 60rpx;
}

.popFooter {
	width: 100%;
	display: flex;
	flex-direction: row;
	border-top: 1rpx solid #e1e1e1;
}

.popBtnActive {
	color: #fe7215;
	font-weight: bold;
	border-left: 1rpx solid #e1e1e1;
}

.rejectTip {
	font-size: 30rpx;
	color: #ff0000;
	font-weight: bold;
	margin: 30rpx 24rpx 0;
}

.unbindLight {
	height: 100rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
	font-size: 28rpx;
	color: #333333;
	font-weight: bold;
	text-align: center;
	line-height: 100rpx;
	margin-top: 30rpx;
}

.unbindGray {
	background-color: #e1e1e1 !important;
	color: #999999 !important;
	font-weight: normal !important;
}

.arrow-icon {
	width: 30rpx;
	height: 30rpx;
	margin-left: 20rpx;
}

.mt20 {
	margin-top: 20rpx;
}

/* 字体样式 */
.tex28_red_b {
	font-size: 28rpx;
	color: #ff0000;
	font-weight: bold;
}

.tex28_red {
	font-size: 28rpx;
	color: #ff0000;
}

.tex32_33_b {
	font-size: 32rpx;
	color: #333333;
	font-weight: bold;
}

.tex32_33 {
	font-size: 32rpx;
	color: #333333;
}

.tex32_00 {
	font-size: 32rpx;
	color: #000000;
}

.tex28_66 {
	font-size: 28rpx;
	color: #666666;
}

.tex24_33 {
	font-size: 24rpx;
	color: #333333;
}

.tex30_66 {
	font-size: 30rpx;
	color: #666666;
}

/* 布局样式 */
.rowCon {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.colCon {
	display: flex;
	flex-direction: column;
}
</style>
