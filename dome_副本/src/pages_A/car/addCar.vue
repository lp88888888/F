<template>
	<view class="container" :data-theme="pageTheme">
		<!-- <cos-header title='新增车辆'  :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="100"></cos-header> -->
		<up-navbar title="新增车辆" bgColor="transparent" @leftClick="toBack" :placeholder="true" :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>

		<scroll-view class="pageCon">
			<view class="whiteBg" :style="{
				marginTop: '40rpx',
				background: `url(${backgroundImage}) no-repeat center/cover`
			  }">
				<text class="fs-32 fw-600">车牌号码</text>
				<view class="numCon" style="margin-top: 40rpx;" @click="showCarKeyboard">
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
						<image v-if="carType === 'b'" class="car-select-icon" :src="imgUrl + 'car_select1.png'" mode="">
						</image>
						<image v-else class="car-select-icon" :src="imgUrl + 'car_normal1.png'" mode=""></image>
						<text class="fs-24 col3">小型货车/小型客车</text>
					</view>
					<view class="colCenter colCenter-car" @click="changeCarType('y')">
						<image class="carImg" :src="imgUrl + 'mine/car_y.png'" />
						<text class="car-txt">黄牌</text>
						<image v-if="carType === 'y'" class="car-select-icon" :src="imgUrl + 'car_select1.png'" mode="">
						</image>
						<image v-else class="car-select-icon" :src="imgUrl + 'car_normal1.png'" mode=""></image>
						<text class="fs-24 col3">大型货车/大型客车</text>
					</view>
				</view>
				<view class="rowCon between">
					<view class="colCenter colCenter-car" @click="changeCarType('g')">
						<image class="carImg" :src="imgUrl + 'mine/car_g.png'" />
						<text class="car-txt">渐变绿牌</text>
						<image v-if="carType === 'g'" class="car-select-icon" :src="imgUrl + 'car_select1.png'" mode="">
						</image>
						<image v-else class="car-select-icon" :src="imgUrl + 'car_normal1.png'" mode=""></image>
						<text class="fs-24 col3">小型新能源车</text>
					</view>
					<view class="colCenter colCenter-car" @click="changeCarType('yg')">
						<image class="carImg" :src="imgUrl + 'mine/car_yg1.png'" />
						<text class="car-txt">黄绿双牌</text>
						<image v-if="carType === 'yg'" class="car-select-icon" :src="imgUrl + 'car_select1.png'"
							mode=""></image>
						<image v-else class="car-select-icon" :src="imgUrl + 'car_normal1.png'" mode=""></image>
						<text class="fs-24 col3">大型新能源车</text>
					</view>
				</view>
				<view class="flex just-sb ali-cen" v-if="vehicleNameType">
					<text class="fs-32 fw-600">车辆类型</text>
					<view class="raidoCon" style="width: 430rpx;" >
						{{ vehicleNameType ? vehicleNameType:'自动回显' }}
					</view>
				</view>
			</view>

			<view class="whiteBg m-t-20">
				<text class="fs-32 fw-600">上传行驶证</text>
				<view class="raidoCon" style="padding:20rpx 0">
					<view class="rowCon" @click="changeRadioTypes('03')">
						<image class="icAddRaido"
							:src="`${imgUrl}${radioTypes === '03' ? 'car_select.png' : 'car_normal.png'}`" />
						<text class="tex32_33">纸质行驶证</text>
					</view>
					<view class="rowCon" @click="changeRadioTypes('04')">
						<image class="icAddRaido"
							:src="`${imgUrl}${radioTypes === '04' ? 'car_select.png' : 'car_normal.png'}`" />
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

			<view class="whiteBg m-t-20" style="padding-top: 0;">
				<view class="flex just-sb ali-cen">
					<text class="fs-32 fw-600">车辆所属</text>
					<view class="raidoCon">
						<view class="rowCon m-r-50" @click="changeRadioType('02')">
							<image class="icAddRaido"
								:src="`${imgUrl}${radioType === '02' ? 'car_select.png' : 'car_normal.png'}`" />
							<text class="tex32_33">个人</text>
						</view>
						<view class="rowCon" @click="changeRadioType('01')">
							<image class="icAddRaido"
								:src="`${imgUrl}${radioType === '01' ? 'car_select.png' : 'car_normal.png'}`" />
							<text class="tex32_33">公司</text>
						</view>
					</view>
				</view>

				<view class="rowCon flex just-sb ali-cen">
					<text class="fs-32 fw-600" style="width: 220rpx;">{{ radioType === '02' ? '所属人姓名' : '公司名称' }}</text>
					<input class="tex32_33" style="text-align: right;" placeholder-class="tex30_66" placeholder="请输入"
						v-model="ownerTex" />
				</view>
			</view>

			<view class="bottom-px2"></view>
		</scroll-view>
		<!-- 车牌键盘 -->
		<u-keyboard v-model:show="showPlateInput" mode="car" :random="false" :autoChange="true" :overlay="true"
			:closeOnClickOverlay="true" :zIndex="10086" @change="onKeyChange" @backspace="onBackspace"
			@confirm="onConfirm" @close="onClose" @cancel="onClose" />

		<!-- 绑车提示（简化为确认弹框） -->
		<view v-if="modalIsShow" class="mask"></view>
		<view v-if="modalIsShow" class="my-dialog">
			<view class="my-dialog__hd">
				<view class="my-dialog__title">提示</view>
			</view>
			<view class="my-dialog_bd">
				确定绑定
				<text style="color:red;font-weight: bold;font-size: 36rpx;">{{ kycCarNum }}</text> 吗？
			</view>
			<view class="my-dialog__ft">
				<view class="my-dialog__btn my-dialog__btn_default r-line" @click="goBackToUpdate">取消</view>
				<view class="my-dialog__btn my-dialog__btn_primary" @click="calSynKycVehicleAndUser">确定</view>
			</view>
		</view>

		<!-- 新增车辆按钮 -->
		<view class="bottom-bar">
			<view class="add-vehicle" @click="popShow">
				<text>保存</text>
			</view>
		</view>
		<u-picker :show="dealerShow" :columns="columns" keyName="dictLabel"
			:confirmColor="themeStore.themeColors.$primaryColor" @close="prickClose" @cancel="prickClose"
			@confirm="prickConfirm"></u-picker>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '../../config';
	import { debounce } from '@/utils/common'
	import CosHeader from '@/components/customNavBar/index.vue';
	import { queryEnterpriseValue, verifyLicensePlateNumber, bindVehicle, calSynKycVehicleAndUserInfo, getKycVehicleAndUserInfo, getUserVehicleByUserId } from '@/api/user';
	import uploadFile from '@/utils/upload';
	// import {OcrRecognition} from '@/utils/ocr';
	import { ocrRecognition, getDict } from '@/api/config';
	import { toBack } from '@/utils/route';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	// Props（保留不动）
	const props = defineProps<{
		show ?: boolean
		carType ?: 'b' | 'y' | 'g' | 'yg'
	}>();

	// 基本状态
	const carType = ref<'b' | 'y' | 'g' | 'yg'>(props.carType ?? 'b');
	// 默认“陕??????”便于演示；生产中可设为 '???????' 或带常用省份
	const carNum = ref<string>('???????');       // 使用字符串存储，再由计算属性拆成数组展示
	const hasCar = ref<string>('');
	const ownerTex = ref<string>('');
	const kycCarNum = ref<string>('');
	const radioType = ref<'01' | '02'>('02');    // 车辆所属（公司/个人）
	const radioTypes = ref<'03' | '04'>('03');   // 行驶证类型
	const driverCardFrontRead = ref<string>('');
	const driverCardFront = ref<string>('');
	const driverCardFrontReads = ref<string>('');
	const driverCardBackRead = ref<string>('');
	const driverCardBack = ref<string>('');
	const bindRule = ref<string>('');
	const ocrDataFront = ref<Record<string, any>>({});
	const ocrDzDataFront = ref<Record<string, any>>({});
	const vehicleType = ref<string | number | null>(''); // 车辆类型vlaue
	const vehicleNameType = ref<string | null>(''); // 车辆类型名称
	const carTypeList = ref<any[]>([]); // 车辆类型列表

	const dealerShow = ref<boolean>(false);
	const columns = ref<any[]>([]);

	const ocrDataBack = ref<Record<string, any>>({});
	const userName = ref<string>('');
	const userIdCard = ref<string>('');
	const drivingLicenseType = ref<string>('');
	const backgroundImage = ref(imgUrl + 'car_bg_w.png')
	// 键盘与输入控制
	const showPlateInput = ref<boolean>(false);
	const currentIndex = ref<number>(-1);        // 当前编辑的位
	const btnEnabled = ref<boolean>(true);
	const saveFlag = ref<boolean>(true);
	const modalIsShow = ref<boolean>(false);     // 简化为确认绑定弹窗

	// 布局
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref<number>(0);

	const vehicleId = ref('')
	const infoData = ref<Record<string, any>>({});
	onLoad((options) => {
		if (options.vehicleId) {
			vehicleId.value = options.vehicleId
			getUserVehicleByUser()
		} else {
			getKycVehicleAndInfo()
		}
		if (options.radioType) {
			radioType.value = options.radioType
		}
		getCarTypeList();
	})

	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = (sysInfo.statusBarHeight || 0) + 44; // 44是默认导航栏高度
	});
	const prickClose = () => {
		dealerShow.value = false;
	};
	const prickConfirm = (event) => {
		console.log("event", event)
		const { value } = event;
		vehicleNameType.value = value[0].dictLabel;
		vehicleType.value = value[0].dictValue;
		prickClose();
	};
	// 获取车辆类型
	const getCarTypeList = async () => {
		try {
			const res = await getDict('vehicle_type');
			if (res.data) {
				columns.value.push(res.data);
			}
		} catch (e) {

		}
	};
	// 01黄、02蓝、03绿、04黄绿 → 'y' | 'b' | 'g' | 'yg'
	const colorCodeToType = (code ?: string) : 'b' | 'y' | 'g' | 'yg' => {
		switch (code) {
			case '01': return 'y';
			case '02': return 'b';
			case '03': return 'g';
			case '04': return 'yg';
			default: return 'b';
		}
	};

	// 不同车牌类型期望长度
	const typeMaxLen = (t : 'b' | 'y' | 'g' | 'yg') => (t === 'g' || t === 'yg') ? 8 : 7;

	// 规范化到期望长度（不足补'?'，超出截断）
	const padToLen = (s : string, len : number) =>
		(s.length < len) ? s + '?'.repeat(len - s.length) : s.substring(0, len);

	// 车辆详情
	const getUserVehicleByUser = async () => {
		const params = {
			vehicleId: vehicleId.value
		}
		const res = await getUserVehicleByUserId(params)
		const data = res?.clazz || {}
		infoData.value = data
		// carNumArr.value = infoData.value.vehicleNumber
		// 1) 回显车牌颜色 → carType
		const type = colorCodeToType(data.licensePlateColor);
		carType.value = type;

		// 2) 回显车牌号 → carNum（注意长度与类型匹配）
		const plate : string = (data.vehicleNumber || '').toUpperCase();
		const len = typeMaxLen(type);
		carNum.value = padToLen(plate, len);

		// if (isCarPlate(plate)) {
		// 	queryVehicleOwner();
		// 	checkVehicleBindStatus();
		// }

		radioType.value = (data.vehicleOwnership === '01' || data.vehicleOwnership === '02') ? data.vehicleOwnership : '02';
		ownerTex.value = data.corporateName || ownerTex.value;
		userName.value = data.name;
		userIdCard.value = data.userIdCard;
		drivingLicenseType.value = data.drivingLicenseType;
		driverCardFrontRead.value = data.frontReadUrl
		driverCardFrontReads.value = data.frontReadUrl
		driverCardBack.value = data.frontReadUrl
		driverCardBackRead.value = data.backReadUrl
		driverCardFront.value = data.frontReadUrl
		ocrDataFront.value = {
			carNo: data.carNo,
			carType: data.carType,
			engine: data.engine,
			vin: data.vin,
			address: data.address,
			registrationTime: data.registrationTime,
			licenseDateIssue: data.licenseDateIssue,
		}
	}
	const cartypename = (e) => {
		console.log(e,columns.value,'sssssssssssssssssssssssss')
		columns.value[0].forEach((item, index) => {
			if (item.dictValue == e) {
				vehicleNameType.value = item.dictLabel;
				vehicleType.value = item.dictValue;
			}
		})
	}
	const getKycVehicleAndInfo = async () => {
		const params = {
			userId: uni.getStorageSync('userInfo').id
		}
		// const res = await getKycVehicleAndUserInfo(params)
		// if (res.clazz == '01') {
		// 	modalIsShow.value = true
		// 	kycCarNum.value = res.remarks
		// }
	}

	// 计算当前最大长度（绿牌、黄绿=8，否则=7）
	const maxLen = computed(() => (carType.value === 'g' || carType.value === 'yg') ? 8 : 7);

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
	const selectCity = (index : number) => {
		console.log(index)
		currentIndex.value = index;
		showPlateInput.value = true;
	};

	// 改变车牌颜色类型时，智能补/裁 '?'
	const changeCarType = (type : 'b' | 'y' | 'g' | 'yg') => {
		if (carType.value === type) return;
		const oldMax = (carType.value === 'g' || carType.value === 'yg') ? 8 : 7;
		const newMax = (type === 'g' || type === 'yg') ? 8 : 7;

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
		currentIndex.value = firstQ !== -1 ? firstQ : (newMax - 1);
	};

	// 行驶证类型
	const changeRadioTypes = (type : '03' | '04') => {
		if (type === radioTypes.value) return;
		radioTypes.value = type;
		// 互斥清空
		if (type === '03') {
			// 纸质：清空电子
			// driverCardFrontReads.value = '';
		} else {
			// 电子：清空纸质
			// driverCardFrontRead.value = '';
			// driverCardBackRead.value = '';
		}
	};
	// 车辆所属
	const changeRadioType = (type : '01' | '02') => {
		if (type !== radioType.value) radioType.value = type;
	};

	// 键盘：输入一个字符（u-keyboard car 会自动进行省份->字母数字两段切换）
	const onKeyChange = (val : string) => {
		if (!showPlateInput.value) return;
		// 防守：无有效 index 时回到首个 '?'
		if (currentIndex.value < 0 || currentIndex.value >= maxLen.value) {
			const firstQ = carNum.value.indexOf('?');
			currentIndex.value = firstQ !== -1 ? firstQ : (maxLen.value - 1);
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
	const currentPlateString = () : string => {
		const s = normalizeCarNumToMaxLen(carNum.value, maxLen.value);
		// 允许末尾存在 '?' 时视为不完整
		return s;
	};

	// 工具函数
	const normalizeCarNumToMaxLen = (s : string, len : number) : string => {
		if (s.length < len) s = s + '?'.repeat(len - s.length);
		if (s.length > len) s = s.substring(0, len);
		return s;
	};
	const replaceAt = (s : string, idx : number, ch : string) : string =>
		s.substring(0, idx) + ch + s.substring(idx + 1);
	const lastFilledIndex = (s : string) : number => {
		for (let i = Math.min(s.length, maxLen.value) - 1; i >= 0; i--) {
			if (s[i] !== '?') return i;
		}
		return -1;
	};

	// 车牌校验（7位普通、8位新能源）
	const isCarPlate = (value : string) : boolean => {
		// 只要包含 '?' 就视为不完整
		if (value.includes('?')) return false;
		const xny = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DABCEFGHJK]$)|([DABCEFGHJK][A-HJ-NP-Z0-9][0-9]{4}$))/;
		const ryc = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;

		if (value.length === 7) return ryc.test(value);
		if (value.length === 8) return xny.test(value);
		return false;
	};

	// 统一 OCR 调用（回调 => Promise）
	const callOCR = (filePath : string, side : 'front' | 'back' | 'elec') => {
		const ocrType =
			side === 'front'
				? 'LICENSE_DEPARTURE_FRONT'
				: side === 'back'
					? 'LICENSE_DEPARTURE_BACK'
					: 'LICENSE_DEPARTURE_ELECTRONIC'; // 电子行驶证（后端类型码按需调整）

		uni.showLoading({ title: '识别中...' });

		return new Promise<any>((resolve, reject) => {
			ocrRecognition(
				filePath,
				'行驶证',
				ocrType,
				(res : any) => {
					uni.hideLoading();
					console.log('------res+++++>', res);
					resolve(res); // 预期结构：{ url:{readUrl,imageUrl}, data:{ name, ... } }
				},
				(err : any) => {
					uni.hideLoading();
					console.log('------+++++>', err);
					reject(err);
				}
			);
		});
	};

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

	// 上传
	const uploadImg = async (type : 'front' | 'back') => {
		if (radioTypes.value !== '03') {
			uni.showToast({ title: '纸质和电子二选一即可', icon: 'none' });
			return;
		}
		try {
			const path = await chooseOneImage();
			if (path) {
				const uploadRes : any = await uploadFile({
					url: '/file/upload',
					filePath: path, // 使用微信返回的头像路径
					// moduleName: '',
				});
				if (uploadRes.code == 200) {
					if (type === 'front') {

						// const res = await uploadFile({
						// 	url: '/system/api/recognition/v1/unifiedOcrRecognition',
						// 	filePath:path,
						// 	formData:{
						// 		path:uploadRes.data.url,
						// 		code:5
						// 	}
						// });
						const res = await ocrRecognition({
							path: uploadRes.data.url,
							code: 5
						})
						if (res.code == 200 && res.data.carNo) {
							driverCardFront.value = uploadRes.data.url;
							driverCardFrontRead.value = uploadRes.data.url;
							ocrDataFront.value = res.data
							ownerTex.value = res?.data?.name || ownerTex.value
							console.log(res.data,'rrrrrrrrrrrrrrrrrrrrrrr')
							cartypename(res?.data?.vehicleType)
						} else {
							console.log("object", res)
							uni.showToast({ title: res?.msg || '识别失败', icon: 'none' });
						}
					}
					if (type === 'back') {
						driverCardBack.value = uploadRes.data.url;
						driverCardBackRead.value = uploadRes.data.url;
					}
				}
				console.log('上传结果', uploadRes);
			}

			// const res = await callOCR(path, type)
			// if (type === 'front') {
			// 	console.log('正面=====', res);
			// 	driverCardFrontRead.value = res?.url?.readUrl || path
			// 	driverCardFront.value = res?.url?.imageUrl
			// 	ocrDataFront.value = res.data
			// 	ownerTex.value = res?.data?.name || ownerTex.value
			// 	drivingLicenseType.value = '1'
			// } else {
			// 	driverCardBackRead.value = res?.url?.readUrl || path
			// 	driverCardBack.value = res?.url?.imageUrl
			// 	ocrDataBack.value = res.data
			// 	drivingLicenseType.value = '1'
			// }
		} catch (e : any) {
			uni.showToast({ title: e?.resultMsg || '选择失败', icon: 'none' });
		}
	};

	const uploadImgs = async (_type : 'front') => {
		if (radioTypes.value !== '04') {
			uni.showToast({ title: '纸质和电子二选一即可', icon: 'none' });
			return;
		}
		try {
			const path = await chooseOneImage();
			const uploadRes : any = await uploadFile({
				url: '/file/upload',
				filePath: path, // 使用微信返回的头像路径
				// moduleName: '',
			});
			console.log('上传结果', uploadRes);
			if (uploadRes.code == 200) {
				// driverCardFrontReads.value  = uploadRes.data.url;
				const res = await ocrRecognition({
					path: uploadRes.data.url,
					code: 5
				})
				if (res.code == 200 && res.data.carNo) {
					driverCardFrontReads.value = uploadRes.data.url
					ocrDzDataFront.value = res.data
					ownerTex.value = res?.data?.name || ownerTex.value
					cartypename(res?.data?.vehicleType)
				} else {
					uni.showToast({ title: res?.msg || '识别失败', icon: 'none' });
				}
			}
			// const res = await callOCR(path, 'elec')
			// driverCardFrontReads.value = res?.url?.readUrl || path
			// driverCardFront.value = res?.url?.imageUrl
			// ocrDataFront.value = res.data
			// ownerTex.value = res?.data?.name || ownerTex.value
			// drivingLicenseType.value = '2'
		} catch (e : any) {
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
		// if(!ownerTex.value) return uni.showToast({ title: '请输入车辆所属人姓名', icon: 'none' });
		if (radioTypes.value === '04') {
			if (!driverCardFrontReads.value) return uni.showToast({ title: '请上传电子行驶证', icon: 'none' });
		} else {
			if (!driverCardFrontRead.value) return uni.showToast({ title: '请上传行驶证正面', icon: 'none' });
			if (!driverCardBackRead.value) return uni.showToast({ title: '请上传行驶证反面', icon: 'none' });
		}
		if (!vehicleType.value) return uni.showToast({ title: '请选择车辆类型', icon: 'none' });
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
		// if (carType.value === 'y') licensePlateColor = '01';
		// else if (carType.value === 'b') licensePlateColor = '02';
		// else if (carType.value === 'g') licensePlateColor = '03';
		// else if (carType.value === 'yg') licensePlateColor = '04';
		if (carType.value === 'y') licensePlateColor = '3';
		else if (carType.value === 'b') licensePlateColor = '1';
		else if (carType.value === 'g') licensePlateColor = '2';
		else if (carType.value === 'yg') licensePlateColor = '6';

		let ocrData = radioTypes.value === '04' ? ocrDzDataFront.value : ocrDataFront.value;
		try {
			const params = {
				licensePlate: carNum.value,//车牌号
				plateColor: licensePlateColor, // 车牌颜色
				// vehicleType:1, // 车辆类型 1：货车 2：客车 3：其他
				vehicleType: vehicleType.value, // 车辆类型 1：货车 2：客车 3：其他
				// drivingLicenseFront:driverCardFront.value, // 行驶证正面照片
				// drivingLicenseBack:driverCardBack.value, // 行驶证反面照片
				driverId: uni.getStorageSync('userInfo').id, // 司机id
				// vehicleVin:'V123405950660',
				// registerTime:'2022-12-12',
				vehicleVin: ocrData ? ocrData.vin : '',
				registerTime: ocrData ? ocrData.registrationTime : '',
				ownerName: ocrData ? ocrData.name : '',
				// drivingLicenseBackUrl: driverCardBack.value || '',
				// vehicleId: vehicleId.value ? vehicleId.value : '',
				// drivingLicenseFrontUrl: driverCardFront.value || '',
				// plateColor: licensePlateColor,
				// userId: uni.getStorageSync('userInfo').id,
				// vehicleNumber: carNum.value,
				// vehicleOwnership: radioType.value,   // 01公司 02个人
				// corporateName: ownerTex.value,
				//ocr识别数据
				// carNo: ocrDataFront.value ? ocrDataFront.value.carNo : '',
				// carType: ocrDataFront.value ? ocrDataFront.value.carType : '',
				// name: ownerTex.value,
				// engine: ocrDataFront.value ? ocrDataFront.value.engine : '',
				// vin: ocrDataFront.value ? ocrDataFront.value.vin : '',
				// address: ocrDataFront.value ? ocrDataFront.value.address : '',
				// registrationTime: ocrDataFront.value ? ocrDataFront.value.registrationTime : '',
				// licenseDateIssue: ocrDataFront.value ? ocrDataFront.value.licenseDateIssue : '',
				// userName: userName.value,
				// userIdCard: userIdCard.value,
				// drivingLicenseType: drivingLicenseType.value, 
			};
			if (radioTypes.value === '04') {
				params.drivingLicenseFront = driverCardFrontReads.value;
				params.drivingLicenseType = 2
				// params.files = [
				// 	{fileType:'7',filePath:driverCardFrontReads.value}
				// ]
			} else {
				params.drivingLicenseFront = driverCardFrontRead.value // 行驶证正面照片
				params.drivingLicenseBack = driverCardBackRead.value// 行驶证反面照片
				params.drivingLicenseType = 1

				// params.files = [
				// 	{fileType:'1',filePath:driverCardFrontRead.value},
				// 	{fileType:'2',filePath:driverCardBackRead.value}
				// ]
			}
			if (radioType.value === '01') {
				// params.enterpriseId = uni.getStorageSync('userInfo').id; //企业id
				// params.enterpriseName = ownerTex.value;//企业名称
			} else {
				params.vehicleOwnerId = uni.getStorageSync('userInfo').id; //车辆所属人ID（会员ID）
				params.vehicleOwnerName = ownerTex.value;//车辆所属人名称（会员姓名）
			}
			console.log("---------------params------------", params);

			// return
			// return 
			const res = await bindVehicle(params)
			uni.setStorageSync('carName', ocrData.name)
			uni.setStorageSync('carNumber', carNum.value)
			uni.setStorageSync('vclType', vehicleType.value)
			uni.showToast({ title: '添加成功', icon: 'none' });
			toBack(1)
			// uni.navigateTo({
			// 	url: '/pages_A/car/myCar'
			// })
		} catch (e : any) {
			uni.showToast({ title: e.resultMsg, icon: 'none' });
		}
		// 保存结束
		saveFlag.value = true;
	}, 300);
	const vehicleText = (text : string) => {
		// 1：货车 2：客车 3：其他
		let value = 3
		if (text.indexOf('货') != -1 && text.indexOf('非') == -1) {
			value = 1
		} else if (text.indexOf('客') != -1 && text.indexOf('非') == -1) {
			value = 2
		} else {
			value = 3
		}
		return value
	}
	//查询平台是否导入有车牌号
	const queryVehicleOwner = async () => {
		const params = {
			licensePlate: carNum.value,
		}
		// const res = await queryEnterpriseValue(params)
		// hasCar.value = res.clazz.licensePlateOwnerType == '02' ? '01' : '02'
		// ownerTex.value = res.clazz.enterpriseName ? res.clazz.enterpriseName : ''
	}
	//查询车辆是否绑定
	const checkVehicleBindStatus = async () => {
		try {
			const params = {
				licensePlateNumber: carNum.value,
			}
			const res = await verifyLicensePlateNumber(params)
			if (res.code == 200) {
				uni.showToast({ title: '该车辆可以正常添加', icon: 'none' });
			} else {
				uni.showToast({ title: res.msg, icon: 'none' });
			}
			hasCar.value = '01'
		} catch (e : any) {
			console.log("e", e)
			uni.showToast({ title: e?.msg || '', icon: 'none' });
		}
	}
</script>

<style scoped lang="scss">
	.container {
		background: var(--head-color);
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
		background-color: #4B88F5;
		color: #ffffff;
	}

	.bg_yellow {
		background-color: #FFDE23;
		color: #000000;
	}

	.bg_green {
		background: linear-gradient(0deg, #6DBF5B, #E9F5E7);
		color: #000000;
	}

	.bg_normal {
		background-color: #f0f0f0;
		color: #333333;
	}

	.carNumBg3 {
		width: 67rpx;
		height: 82rpx;
		background-color: #EEFCF8;
		border-radius: 10rpx;
		border: dashed 1rpx #00BD75;
		font-size: 22rpx;
		color: #00BD75;
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
		background: #FFFAF3;
		border-radius: 16rpx;
		border: 1px dashed var(--primary-color);
		margin-top: 50rpx;
	}

	.cardImg {
		width: 300rpx;
		height: 168rpx;
		background: #FFFAF3;
		border-radius: 16rpx;
		border: 1px solid var(--primary-color);
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
		background: rgba(0, 0, 0, .4);
		z-index: 1;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 简易弹窗 */
	.my-dialog {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 600rpx;
		background: #fff;
		border-radius: 20rpx;
		z-index: 2;
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
		background: #FFFFFF;
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
		color: #FFFFFF;
		width: 686rpx;
		height: 80rpx;
		background: var(--primary-color);
		border-radius: 40rpx;
		margin: 0 auto;

		text {
			margin-left: 10rpx;
		}
	}

	.car-select-icon {
		width: 45rpx;
		height: 44rpx;
		border: 4rpx solid #FFFFFF;
		border-radius: 50%;
		position: absolute;
		top: 100rpx;
		right: 0;
		background: #FFFFFF;
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
</style>