<template>
	<view class="container">
		<up-navbar bgColor="#F0F0F2" placeholder :fixed="true" title="新增车辆" autoBack></up-navbar>

		<scroll-view class="pageCon">
			<view
				class="whiteBg"
				:style="{
					marginTop: '40rpx',
					background: `url(${backgroundImage}) no-repeat center/cover`,
				}"
			>
				<text class="fs-32 fw-600">车牌号码</text>
				<view class="numCon" style="margin-top: 40rpx" @click="showCarKeyboard">
					<view v-for="(item, index) in carNumArr" :key="index">
						<!-- 蓝牌 -->
						<block v-if="carType === 'b'">
							<view class="carNumBg bg_blue" v-if="item !== '?'" @click.stop="selectCity(index)">
								{{ item }}
							</view>
							<view class="carNumBg bg_normal" v-else></view>
						</block>
						<!-- 黄牌 -->
						<block v-else-if="carType === 'y'">
							<view class="carNumBg bg_yellow" v-if="item !== '?'" @click.stop="selectCity(index)">
								{{ item }}
							</view>
							<view class="carNumBg bg_normal" v-else></view>
						</block>
						<!-- 绿牌 -->
						<block v-else-if="carType === 'g'">
							<view class="carNumBg bg_green" v-if="item !== '?'" @click.stop="selectCity(index)">
								{{ item }}
							</view>
							<view class="carNumBg bg_normal" v-else></view>
						</block>
						<!-- 黄绿（前两位黄，后面绿 -->
						<block v-else-if="carType === 'yg'">
							<block v-if="index < 2">
								<view class="carNumBg bg_yellow" v-if="item !== '?'" @click.stop="selectCity(index)">
									{{ item }}
								</view>
								<view class="carNumBg bg_normal" v-else></view>
							</block>
							<block v-else>
								<view class="carNumBg bg_green" v-if="item !== '?'" @click.stop="selectCity(index)">
									{{ item }}
								</view>
								<view class="carNumBg bg_normal" v-else></view>
							</block>
						</block>
					</view>
					<view class="carNumBg3" v-if="carType !== 'g' && carType !== 'yg'" @click="carType = 'g'">新能源</view>
				</view>

				<text class="fs-32 fw-600">车牌颜色</text>
				<view class="rowCon between">
					<view class="colCenter colCenter-car" @click="changeCarType('b')">
						<image class="carImg" :src="imgUrl + 'mine/car_b.png'" />
						<text class="car-txt w">蓝牌</text>
						<image v-if="carType === 'b'" class="car-select-icon" :src="imgUrl + 'car_select1.png'" mode=""> </image>
						<image v-else class="car-select-icon" :src="imgUrl + 'car_normal1.png'" mode=""></image>
						<text class="fs-24 col3">小型货车/小型客车</text>
					</view>
					<view class="colCenter colCenter-car" @click="changeCarType('y')">
						<image class="carImg" :src="imgUrl + 'mine/car_y.png'" />
						<text class="car-txt">黄牌</text>
						<image v-if="carType === 'y'" class="car-select-icon" :src="imgUrl + 'car_select1.png'" mode=""> </image>
						<image v-else class="car-select-icon" :src="imgUrl + 'car_normal1.png'" mode=""></image>
						<text class="fs-24 col3">大型货车/大型客车</text>
					</view>
				</view>
				<view class="rowCon between">
					<view class="colCenter colCenter-car" @click="changeCarType('g')">
						<image class="carImg" :src="imgUrl + 'mine/car_g.png'" />
						<text class="car-txt">渐变绿牌</text>
						<image v-if="carType === 'g'" class="car-select-icon" :src="imgUrl + 'car_select1.png'" mode=""> </image>
						<image v-else class="car-select-icon" :src="imgUrl + 'car_normal1.png'" mode=""></image>
						<text class="fs-24 col3">小型新能源车</text>
					</view>
					<view class="colCenter colCenter-car" @click="changeCarType('yg')">
						<image class="carImg" :src="imgUrl + 'mine/car_yg1.png'" />
						<text class="car-txt">黄绿双牌</text>
						<image v-if="carType === 'yg'" class="car-select-icon" :src="imgUrl + 'car_select1.png'" mode=""></image>
						<image v-else class="car-select-icon" :src="imgUrl + 'car_normal1.png'" mode=""></image>
						<text class="fs-24 col3">大型新能源车</text>
					</view>
				</view>
			</view>

			<view class="whiteBg m-t-20">
				<text class="fs-32 fw-600">上传行驶证</text>
				<view class="raidoCon" style="padding: 20rpx 0">
					<view class="rowCon" @click="changeRadioTypes('03')">
						<image class="icAddRaido" :src="`${imgUrl}${radioTypes === '03' ? 'car_select.png' : 'car_normal.png'}`" />
						<text class="tex32_33">纸质行驶证</text>
					</view>
					<view class="rowCon" @click="changeRadioTypes('04')">
						<image class="icAddRaido" :src="`${imgUrl}${radioTypes === '04' ? 'car_select.png' : 'car_normal.png'}`" />
						<text class="tex32_33">电子行驶证</text>
					</view>
				</view>
				<view class="rowCon between" v-if="radioTypes === '03'">
					<view class="colCenter cameraBg" @click="uploadImg('front')" style="margin-top: 0rpx">
						<block v-if="!driverCardFrontRead">
							<image class="icCamera" :src="imgUrl + 'mine/camera.png'" />
							<text class="fs-22 fw-500 col9">行驶证正面</text>
						</block>
						<block v-else>
							<image class="cardImg" :src="driverCardFrontRead" mode="aspectFill" />
						</block>
					</view>
					<view class="colCenter cameraBg" @click="uploadImg('back')" style="margin-top: 0rpx">
						<block v-if="!driverCardBackRead">
							<image class="icCamera" :src="imgUrl + 'mine/camera.png'" />
							<text class="fs-22 fw-500 col9">行驶证副页</text>
						</block>
						<block v-else>
							<image class="cardImg" :src="driverCardBackRead" mode="aspectFill" />
						</block>
					</view>
				</view>
				<view class="rowCon between" v-if="radioTypes === '04'">
					<view class="colCenter cameraBg" @click="uploadImgs('front')" style="margin-top: 0rpx">
						<block v-if="!driverCardFrontReads">
							<image class="icCamera" :src="imgUrl + 'mine/camera.png'" />
							<text class="fs-22 fw-500 col9">电子行驶证</text>
						</block>
						<block v-else>
							<image class="cardImg" :src="driverCardFrontReads" mode="aspectFill" />
						</block>
					</view>
				</view>
			</view>

			<view class="whiteBg m-t-20" style="padding-top: 0">
				<view class="flex just-sb ali-cen">
					<text class="fs-32 fw-600">车辆所属</text>
					<view class="raidoCon">
						<view class="rowCon m-r-50" @click="changeRadioType('02')">
							<image class="icAddRaido" :src="`${imgUrl}${radioType === '02' ? 'car_select.png' : 'car_normal.png'}`" />
							<text class="tex32_33">个人</text>
						</view>
						<view class="rowCon" @click="changeRadioType('01')">
							<image class="icAddRaido" :src="`${imgUrl}${radioType === '01' ? 'car_select.png' : 'car_normal.png'}`" />
							<text class="tex32_33">公司</text>
						</view>
					</view>
				</view>

				<view class="rowCon flex just-sb ali-cen">
					<text class="fs-32 fw-600" style="width: 220rpx">{{ radioType === '02' ? '所属人姓名' : '公司名称' }}</text>
					<input class="tex32_33" style="text-align: right" placeholder-class="col6" placeholder="请输入" v-model="ownerTex" />
				</view>
				<view v-if="isUser != 1" class="rowCon m-t-40">
					<text class="fs-32 fw-600" style="width: 180rpx">所属企业</text>

					<picker mode="selector" :range="enterpriseList" range-key="enterpriseName" :value="selectedIndex" @change="handleEnterpriseChange">
						<view class="filter-item">
							<view class="rowCon">
								<text class="fs-30 col6">{{ selectedEnterpriseName || '请选择' }}</text>
								<image class="arrow-icon" :src="imgUrl + 'volumePricing/vp_drop.png'" />
							</view>
						</view>
					</picker>
				</view>
			</view>

			<view class="bottom-px2"></view>
		</scroll-view>
		<!-- 车牌键盘 -->
		<u-keyboard
			v-model:show="showPlateInput"
			mode="car"
			:random="false"
			:autoChange="true"
			:overlay="true"
			:closeOnClickOverlay="true"
			:zIndex="10086"
			@change="onKeyChange"
			@backspace="onBackspace"
			@confirm="onConfirm"
			@close="onClose"
			@cancel="onClose"
		/>

		<!-- 绑车提示（简化为确认弹框） -->
		<up-popup :show="modalIsShow" mode="center" :safeAreaInsetBottom="false">
			<view class="my-dialog">
				<view class="my-dialog__hd">
					<view class="my-dialog__title">提示</view>
				</view>
				<view class="my-dialog_bd">
					确定绑定
					<text style="color: red; font-weight: bold; font-size: 36rpx">{{ kycCarNum }}</text> 吗？
				</view>
				<view class="my-dialog__ft">
					<view class="my-dialog__btn my-dialog__btn_default r-line" @click="goBackToUpdate">取消</view>
					<view class="my-dialog__btn my-dialog__btn_primary" @click="calSynKycVehicleAndUser">确定</view>
				</view>
			</view>
		</up-popup>

		<!-- 新增车辆按钮 -->
		<view class="bottom-bar">
			<view class="add-vehicle" @click="popShow">
				<text>保存</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
import { debounce } from '@/utils/common';
import CosHeader from '@/components/customNavBar/index.vue';
// import { ocrRecognition } from '@/utils/ocr';
import { ocrRecognition, getDict } from '@/api/config';
import { toNav, toRec } from '@/utils/route';
import uploadFile from '@/utils/upload';

import { verifyLicensePlateNumber, bindVehicle, calSynKycVehicleAndUserInfo, getUserVehicleByUserId } from '@/api/user';
import { getEnterList, getKycVehicleAndUserInfo, saveVehicle, queryEnterpriseValue } from '@/api/volumePricing';

// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);

// Props（保留不动）
const props = defineProps<{
	show?: boolean;
	carType?: 'b' | 'y' | 'g' | 'yg';
}>();

// 基本状态
const carType = ref<'b' | 'y' | 'g' | 'yg'>(props.carType ?? 'b');
// 默认“陕??????”便于演示；生产中可设为 '???????' 或带常用省份
const carNum = ref<string>('???????'); // 使用字符串存储，再由计算属性拆成数组展示
const hasCar = ref<string>('');
const ownerTex = ref<string>('');
const kycCarNum = ref<string>('');
const radioType = ref<'01' | '02'>('02'); // 车辆所属（公司/个人）
const radioTypes = ref<'03' | '04'>('03'); // 行驶证类型
const driverCardFrontRead = ref<string>('');
const driverCardFront = ref<string>('');
const driverCardFrontReads = ref<string>('');
const driverCardBackRead = ref<string>('');
const driverCardBack = ref<string>('');
const bindRule = ref<string>('');
const ocrDataFront = ref<Record<string, any>>({});
const ocrDataBack = ref<Record<string, any>>({});
const userName = ref<string>('');
const userIdCard = ref<string>('');
const drivingLicenseType = ref<string>('');
const backgroundImage = ref(imgUrl + 'car_bg_w.png');

const isUser = ref(''); // 1 用戶
// 键盘与输入控制
const showPlateInput = ref<boolean>(false);
const currentIndex = ref<number>(-1); // 当前编辑的位
const btnEnabled = ref<boolean>(true);
const saveFlag = ref<boolean>(true);
const modalIsShow = ref<boolean>(false); // 简化为确认绑定弹窗

// 布局
const fontColor = ref<string>('#000');
const fixed = ref<boolean>(true);
const navBarHeight = ref<number>(0);

const vehicleId = ref('');
const infoData = ref<Record<string, any>>({});
interface Enterprise {
	id: number;
	enterpriseName: string;
}
const enterpriseList = ref<Enterprise[]>([]);
const enterpriseId = ref<number | null>(null);
const selectedIndex = ref<number>(0);
const enterpriseError = ref<string>('');
const selectedEnterpriseName = computed(() => {
	return enterpriseError.value || enterpriseList.value[selectedIndex.value]?.enterpriseName || '';
});
onLoad((options) => {
	console.log('添加车辆接受的擦描述', options);
	isUser.value = options.isUser;
	enterpriseId.value = options.enterpriseId;
	enterpriseError.value = options.enterpriseError;
	getEnterpriseList();
	// getKycVehicleAndInfo();
});

onMounted(() => {
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
});
// 01黄、02蓝、03绿、04黄绿 → 'y' | 'b' | 'g' | 'yg'
const colorCodeToType = (code?: string): 'b' | 'y' | 'g' | 'yg' => {
	switch (code) {
		case '01':
			return 'y';
		case '02':
			return 'b';
		case '03':
			return 'g';
		case '04':
			return 'yg';
		default:
			return 'b';
	}
};

// 不同车牌类型期望长度
const typeMaxLen = (t: 'b' | 'y' | 'g' | 'yg') => (t === 'g' || t === 'yg' ? 8 : 7);

// 规范化到期望长度（不足补'?'，超出截断）
const padToLen = (s: string, len: number) => (s.length < len ? s + '?'.repeat(len - s.length) : s.substring(0, len));

const getEnterpriseList = async () => {
	const params = {
		pageNum: 1,
		pageSize: 1000,
	};

	try {
		const res = await getEnterList(params);
		console.log('企业列表接口返回数据:', res);

		if (res && res.page) {
			enterpriseList.value = res.page.records;
			console.log('企业列表已成功更新，数量:', res.page.records.length);
		} else {
			console.error('企业列表数据结构异常', res);
		}
	} catch (error) {
		console.error('获取企业列表失败:', error);
	}
};
const handleEnterpriseChange = (e: any) => {
	const index = Number(e.detail.value);

	const selectedItem = enterpriseList.value[index];

	if (selectedItem) {
		selectedIndex.value = index;
		enterpriseError.value = selectedItem.enterpriseName;
		enterpriseId.value = selectedItem.id;
	}
};

const getKycVehicleAndInfo = async () => {
	const params = {
		userId: uni.getStorageSync('userInfo').id,
	};
	const res = await getKycVehicleAndUserInfo(params);
	conslog('校验是否卡一车用户车辆信息', res);
	if (res.clazz == '01') {
		modalIsShow.value = true;
		kycCarNum.value = res.remarks;
	}
};

// 计算当前最大长度（绿牌、黄绿=8，否则=7）
const maxLen = computed(() => (carType.value === 'g' || carType.value === 'yg' ? 8 : 7));

// 视图展示数组
const carNumArr = computed(() => {
	// 只展示 maxLen 位，防止多余
	let s = carNum.value;
	if (s.length < maxLen.value) s = s + '?'.repeat(maxLen.value - s.length);
	if (s.length > maxLen.value) s = s.substring(0, maxLen.value);
	return s.split('');
});

// 调起键盘：若未选中任何位，默认编辑第一个“？”；若已全满，则编辑最后一位
const showCarKeyboard = () => {
	const firstQ = carNum.value.indexOf('?');
	if (firstQ !== -1 && firstQ < maxLen.value) {
		currentIndex.value = firstQ;
	} else {
		currentIndex.value = maxLen.value - 1;
	}
	showPlateInput.value = true;
};

// 点击某一位定点编辑
const selectCity = (index: number) => {
	console.log(index);
	currentIndex.value = index;
	showPlateInput.value = true;
};

// 改变车牌颜色类型时，智能补/裁 '?'
const changeCarType = (type: 'b' | 'y' | 'g' | 'yg') => {
	if (carType.value === type) return;
	const oldMax = carType.value === 'g' || carType.value === 'yg' ? 8 : 7;
	const newMax = type === 'g' || type === 'yg' ? 8 : 7;

	let s = carNum.value;
	// 先确保长度 == oldMax
	if (s.length < oldMax) s = s + '?'.repeat(oldMax - s.length);
	if (s.length > oldMax) s = s.substring(0, oldMax);

	// 再调整到 newMax
	if (newMax > oldMax) {
		s = s + '?'.repeat(newMax - oldMax);
	} else if (newMax < oldMax) {
		s = s.substring(0, newMax);
	}

	carType.value = type;
	carNum.value = s;
	// 切换类型后如全满，光标指到最后一位；否则指到第一个“？”
	const firstQ = s.indexOf('?');
	currentIndex.value = firstQ !== -1 ? firstQ : newMax - 1;
};

// 行驶证类型
const changeRadioTypes = (type: '03' | '04') => {
	if (type === radioTypes.value) return;
	radioTypes.value = type;
	// 互斥清空
	if (type === '03') {
		// 纸质：清空电子
		driverCardFrontReads.value = '';
	} else {
		// 电子：清空纸质
		driverCardFrontRead.value = '';
		driverCardBackRead.value = '';
	}
};
// 车辆所属
const changeRadioType = (type: '01' | '02') => {
	if (type !== radioType.value) radioType.value = type;
};

// 键盘：输入一个字符（u-keyboard car 会自动进行省份->字母数字两段切换）
const onKeyChange = (val: string) => {
	if (!showPlateInput.value) return;
	// 防守：无有效 index 时回到首个 '?'
	if (currentIndex.value < 0 || currentIndex.value >= maxLen.value) {
		const firstQ = carNum.value.indexOf('?');
		currentIndex.value = firstQ !== -1 ? firstQ : maxLen.value - 1;
	}

	let s = normalizeCarNumToMaxLen(carNum.value, maxLen.value);
	s = replaceAt(s, currentIndex.value, val);
	carNum.value = s;

	// 移动到下一个 '?'
	const nextQ = s.indexOf('?', currentIndex.value + 1);
	if (nextQ !== -1 && nextQ < maxLen.value) {
		currentIndex.value = nextQ;
	} else {
		// 若已经填满，置为最后一位，便于继续修正
		currentIndex.value = maxLen.value - 1;
	}
};

// 键盘：退格
const onBackspace = () => {
	let s = normalizeCarNumToMaxLen(carNum.value, maxLen.value);

	// 如果当前位是 '?' 或未选定，寻找最后一个非 '?' 的位删除
	let idx = currentIndex.value;
	if (idx < 0 || idx >= maxLen.value || s[idx] === '?') {
		idx = lastFilledIndex(s);
	}
	if (idx >= 0) {
		s = replaceAt(s, idx, '?');
		carNum.value = s;
		currentIndex.value = idx; // 光标停留在被清空的位置
	}
};

// 键盘：确认
const onConfirm = () => {
	showPlateInput.value = false;
	if (!isCarPlate(currentPlateString())) {
		uni.showToast({ title: '请输入正确的车牌号', icon: 'none' });
		return;
	}
	console.log('点击确认');
	// 触发后续联动
	queryVehicleOwner();
	checkVehicleBindStatus();
};

// 键盘：关闭
const onClose = () => {
	showPlateInput.value = false;
	// 关闭时如果格式合法就联动查询，否则清空所属人
	if (isCarPlate(currentPlateString())) {
		queryVehicleOwner();
		checkVehicleBindStatus();
	} else {
		ownerTex.value = '';
	}
};

// 生成当前实际车牌字符串（截到 maxLen，去掉多余 '?')
const currentPlateString = (): string => {
	const s = normalizeCarNumToMaxLen(carNum.value, maxLen.value);
	// 允许末尾存在 '?' 时视为不完整
	return s;
};

// 工具函数
const normalizeCarNumToMaxLen = (s: string, len: number): string => {
	if (s.length < len) s = s + '?'.repeat(len - s.length);
	if (s.length > len) s = s.substring(0, len);
	return s;
};
const replaceAt = (s: string, idx: number, ch: string): string => s.substring(0, idx) + ch + s.substring(idx + 1);
const lastFilledIndex = (s: string): number => {
	for (let i = Math.min(s.length, maxLen.value) - 1; i >= 0; i--) {
		if (s[i] !== '?') return i;
	}
	return -1;
};

// 车牌校验（7位普通、8位新能源）
const isCarPlate = (value: string): boolean => {
	// 只要包含 '?' 就视为不完整
	if (value.includes('?')) return false;
	const xny =
		/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DABCEFGHJK]$)|([DABCEFGHJK][A-HJ-NP-Z0-9][0-9]{4}$))/;
	const ryc = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;

	if (value.length === 7) return ryc.test(value);
	if (value.length === 8) return xny.test(value);
	return false;
};

// 统一 OCR 调用（回调 => Promise）
const callOCR = (filePath: string, side: 'front' | 'back' | 'elec') => {
	const ocrType = side === 'front' ? 'LICENSE_DEPARTURE_FRONT' : side === 'back' ? 'LICENSE_DEPARTURE_BACK' : 'LICENSE_DEPARTURE_ELECTRONIC'; // 电子行驶证（后端类型码按需调整）

	uni.showLoading({ title: '识别中...' });

	return new Promise<any>((resolve, reject) => {
		ocrRecognition(
			filePath,
			'行驶证',
			ocrType,
			(res: any) => {
				resolve(res); // 预期结构：{ url:{readUrl,imageUrl}, data:{ name, ... } }
			},
			(err: any) => {
				reject(err);
			}
		);
	});
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

// 上传
const uploadImg = async (type: 'front' | 'back') => {
	if (radioTypes.value !== '03') {
		uni.showToast({ title: '纸质和电子二选一即可', icon: 'none' });
		return;
	}
	try {
		const path = await chooseOneImage();
		if (path) {
			const uploadRes: any = await uploadFile({
				url: '/file/upload',
				filePath: path, // 使用微信返回的头像路径
				// moduleName: '',
			});
			console.log('上传的照片', uploadRes);
			if (uploadRes.code == 200) {
				const res = await ocrRecognition({
					path: uploadRes.data.url,
					code: 5,
				});
				console.log('添加车辆的ocr', res);
				if (type === 'front') {
					driverCardFrontRead.value = uploadRes.data.url || path;
					driverCardFront.value = uploadRes.data.url;
					ocrDataFront.value = res.data;
					ownerTex.value = res?.data?.name || '';
					drivingLicenseType.value = '1';
				}
				if (type === 'back') {
					driverCardBackRead.value = uploadRes.data.url || path;
					driverCardBack.value = uploadRes.data.url;
					ocrDataBack.value = res.data;
					drivingLicenseType.value = '1';
				}
			}
			console.log('上传结果', uploadRes);
		}
	} catch (e: any) {
		uni.showToast({ title: e?.resultMsg || '选择失败', icon: 'none' });
	}
};

const uploadImgs = async (_type: 'front') => {
	if (radioTypes.value !== '04') {
		uni.showToast({ title: '纸质和电子二选一即可', icon: 'none' });
		return;
	}
	try {
		const path = await chooseOneImage();
		const uploadRes: any = await uploadFile({
			url: '/file/upload',
			filePath: path, // 使用微信返回的头像路径
		});
		const res = await ocrRecognition({
			path: uploadRes.data.url,
			code: 5,
		});
		driverCardFrontReads.value = uploadRes.data.url || path;
		driverCardFront.value = uploadRes.data.url;
		ocrDataFront.value = res.data;
		ownerTex.value = res?.data?.name || '';
		drivingLicenseType.value = '2';
	} catch (e: any) {
		uni.showToast({ title: e?.message || '选择失败', icon: 'none' });
	}
};

// 保存 -> 简化为弹出确认绑定框
const popShow = () => {
	const plate = currentPlateString();
	if (!isCarPlate(plate)) {
		uni.showToast({ title: '请输入正确的车牌号', icon: 'none' });
		return;
	}
	kycCarNum.value = plate;
	modalIsShow.value = true;
};

const goBackToUpdate = () => {
	modalIsShow.value = false;
};
const calSynKycVehicleAndUser = debounce(async () => {
	if (!btnEnabled.value) return;
	modalIsShow.value = false;
	if (!saveFlag.value) return;
	saveFlag.value = false;

	let licensePlateColor = '';
	if (carType.value === 'y') licensePlateColor = '01';
	else if (carType.value === 'b') licensePlateColor = '02';
	else if (carType.value === 'g') licensePlateColor = '03';
	else if (carType.value === 'yg') licensePlateColor = '04';

	try {
		const params = {
			backLicense: driverCardBack.value || '',
			frontLicense: driverCardFront.value || '',
			licensePlateColor: licensePlateColor,
			userId: uni.getStorageSync('userInfo').id,
			vehicleNumber: carNum.value,
			vehicleOwnership: radioType.value, // 01公司 02个人
			userName: ownerTex.value,

			// corporateName: ownerTex.value,
			//ocr识别数据
			carNo: ocrDataFront.value ? ocrDataFront.value.carNo : '',
			carType: ocrDataFront.value ? ocrDataFront.value.carType : '',
			name: ocrDataFront.value ? ocrDataFront.value.name : '',

			engine: ocrDataFront.value ? ocrDataFront.value.engine : '',
			vin: ocrDataFront.value ? ocrDataFront.value.vin : '',
			address: ocrDataFront.value ? ocrDataFront.value.address : '',
			registrationTime: ocrDataFront.value ? ocrDataFront.value.registrationTime : '',
			licenseDateIssue: ocrDataFront.value ? ocrDataFront.value.licenseDateIssue : '',

			userIdCard: userIdCard.value,
			drivingLicenseType: drivingLicenseType.value,
			ocrBindType: radioType.value,
			bindType: isUser.value == 1 ? '01' : '02',
			enterpriseId: enterpriseId.value,
		};
		console.log('保存的车辆的数据', params);
		const res = await saveVehicle(params);
		console.log('保存成功的车辆数据', res);
		uni.showToast({ title: '添加成功', icon: 'none' });
		uni.navigateBack();
	} catch (e: any) {
		uni.showToast({ title: e.resultMsg, icon: 'none' });
	}
	// 保存结束
	saveFlag.value = true;
}, 300);
//查询平台是否导入有车牌号
const queryVehicleOwner = async () => {
	const params = {
		licensePlate: carNum.value,
	};
	const res = await queryEnterpriseValue(params);
	console.log('查询频台是否导入有车牌号', res);
	radioType.value = res.clazz.licensePlateOwnerType == '02' ? '01' : '02';
};
//查询车辆是否绑定
const checkVehicleBindStatus = async () => {
	try {
		const params = {
			licensePlateNumber: carNum.value,
		};
		const res = await verifyLicensePlateNumber(params);
		uni.showToast({ title: '该车辆可以正常添加', icon: 'none' });
		hasCar.value = '01';
	} catch (e: any) {
		uni.showToast({ title: e?.resultMsg || '', icon: 'none' });
	}
};
</script>

<style scoped lang="scss">
.container {
	background: $pageBgColor;
}

.pageCon {
	padding-bottom: 200rpx;
}

.whiteBg {
	padding: 40rpx 30rpx 30rpx;
	margin: 20rpx 32rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
	box-sizing: border-box;
}

.rowCon {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.colCenter {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.colCenter-car {
	position: relative;
	padding: 0 20rpx;
}

.numCon {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	margin-bottom: 50rpx;
}

.carNumBg {
	width: 67rpx;
	height: 82rpx;
	border-radius: 10rpx;
	font-size: 30rpx;
	font-weight: 500;
	line-height: 82rpx;
	text-align: center;
}

.bg_blue {
	background-color: #4b88f5;
	color: #ffffff;
}

.bg_yellow {
	background-color: #ffde23;
	color: #000000;
}

.bg_green {
	background: linear-gradient(0deg, #6dbf5b, #e9f5e7);
	color: #000000;
}

.bg_normal {
	background-color: #f0f0f0;
	color: #333333;
}

.carNumBg3 {
	width: 67rpx;
	height: 82rpx;
	background-color: #eefcf8;
	border-radius: 10rpx;
	border: dashed 1rpx #00bd75;
	font-size: 22rpx;
	color: #00bd75;
	writing-mode: vertical-rl;
	text-align: center;
	line-height: 70rpx;
	letter-spacing: 2rpx;
}

.carImg {
	width: 260rpx;
	height: 90rpx;
	margin: 40rpx 0 20rpx;
}

.icAddRaido {
	width: 45rpx;
	height: 44rpx;
	margin-right: 20rpx;
}

.raidoCon {
	background-color: #ffffff;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 50rpx 0;
}

.icSelect {
	width: 50rpx;
	height: 50rpx;
	position: absolute;
	bottom: 30rpx;
	right: -20rpx;
}

.icCamera {
	width: 50rpx;
	height: 50rpx;
	margin-bottom: 20rpx;
}

.cameraBg {
	width: 300rpx;
	height: 168rpx;
	background: #fffaf3;
	border-radius: 16rpx;
	border: 1px dashed #ff9600;
	margin-top: 50rpx;
}

.cardImg {
	width: 300rpx;
	height: 168rpx;
	background: #fffaf3;
	border-radius: 16rpx;
	border: 1px solid #ff9600;
	// position: absolute;
	// top: 0; left: 0;
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
	justify-content: center;
	align-items: center;
}

/* 简易弹窗 */
.my-dialog {
	// position: fixed;
	// left: 50%;
	// top: 50%;
	// transform: translate(-50%, -50%);
	width: 600rpx;
	background: #fff;
	border-radius: 20rpx;
	// z-index: 2;
	overflow: hidden;
}

.my-dialog__hd {
	padding: 32rpx;
	border-bottom: 1rpx solid #eee;
}

.my-dialog__title {
	font-size: 32rpx;
	font-weight: 600;
}

.my-dialog_bd {
	padding: 40rpx;
	font-size: 28rpx;
	text-align: center;
}

.my-dialog__ft {
	display: flex;
	border-top: 1rpx solid #eee;
}

.my-dialog__btn {
	flex: 1;
	text-align: center;
	padding: 28rpx 0;
	font-size: 30rpx;
}

.my-dialog__btn_default {
	color: #666;
}

.my-dialog__btn_primary {
	color: #007aff;
}

.r-line {
	border-right: 1rpx solid #eee;
}

.bottom-bar {
	height: 158rpx;
	background: #ffffff;
	position: fixed;
	bottom: 0;
	padding: 15rpx 32rpx;
	z-index: 8;
	width: 100%;
	box-sizing: border-box;
}

.add-vehicle {
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 500;
	font-size: 30rpx;
	color: #ffffff;
	width: 686rpx;
	height: 80rpx;
	background: linear-gradient(-40deg, #ff9600, #f4aa31);
	border-radius: 40rpx;
	margin: 0 auto;

	text {
		margin-left: 10rpx;
	}
}

.car-select-icon {
	width: 45rpx;
	height: 44rpx;
	border: 4rpx solid #ffffff;
	border-radius: 50%;
	position: absolute;
	top: 100rpx;
	right: 0;
	background: #ffffff;
}

.car-txt {
	position: absolute;
	top: 65rpx;
	left: 50%;
	transform: translateX(-50%);
}

.w {
	color: #fff;
}

.filter-item {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	border-radius: 10rpx;
	font-size: 32rpx;
	color: #000000;
	text-align: right;
}

.arrow-icon {
	width: 30rpx;
	height: 30rpx;
	margin-left: 20rpx;
}
</style>
