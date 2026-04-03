<template>
	<view class="container">
		<view class="form-info">
			<!-- <view class="form-info-jd">
				<u-steps :current="stepsPz">
					<u-steps-item title="填写"></u-steps-item>
					<u-steps-item title="已受理"></u-steps-item>
					<u-steps-item title="进行中"></u-steps-item>
					<u-steps-item title="已结束"></u-steps-item>
				</u-steps>
			</view> -->
			<view v-if="stepsPz==0">
				<view class="form-card">
					<view class="form-item">
						<text class="label">被救援人姓名:</text>
						<input v-model="formData.customerName" maxlength="12" class="input" placeholder="请输入姓名"
							placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
					<view class="form-item">
						<text class="labels">被救援人电话</text>
						<view class="input">
							<input v-model="formData.customerPhone" maxlength="11" class="input" type="number"
								placeholder="请输入电话" placeholder-class="placeholder"
								placeholder-style="color: #C8C9CB" />
						</view>
					</view>

					<view class="whiteBg">
						<text class="fs-32 fw-600">故障车牌号</text>
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
									<view class="carNumBg bg_yellow" v-if="item !== '?'"
										@click.stop="selectCity(index)">
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
										<view class="carNumBg bg_yellow" v-if="item !== '?'"
											@click.stop="selectCity(index)">
											{{ item }}
										</view>
										<view class="carNumBg bg_normal" v-else></view>
									</block>
									<block v-else>
										<view class="carNumBg bg_green" v-if="item !== '?'"
											@click.stop="selectCity(index)">
											{{ item }}
										</view>
										<view class="carNumBg bg_normal" v-else></view>
									</block>
								</block>
							</view>
							<view class="carNumBg3" v-if="carType !== 'g' && carType !== 'yg'"
								@click="changeCarType('g')">
								新能源</view>
						</view>
					</view>
					<view style="padding-bottom: 20rpx;">
						<view class="rowCon between">
							<view class="colCenter colCenter-car" @click="changeCarType('b')">
								<image class="carImg" :src="imgUrl + 'mine/car_b.png'" />
								<text class="car-txt w">蓝牌</text>
								<image v-if="carType === 'b'" class="car-select-icon" :src="imgUrl + 'car_select1.png'"
									mode="">
								</image>
								<image v-else class="car-select-icon" :src="imgUrl + 'car_normal1.png'" mode=""></image>
								<text class="fs-24 col3">小型货车/小型客车</text>
							</view>
							<view class="colCenter colCenter-car" @click="changeCarType('y')">
								<image class="carImg" :src="imgUrl + 'mine/car_y.png'" />
								<text class="car-txt">黄牌</text>
								<image v-if="carType === 'y'" class="car-select-icon" :src="imgUrl + 'car_select1.png'"
									mode="">
								</image>
								<image v-else class="car-select-icon" :src="imgUrl + 'car_normal1.png'" mode=""></image>
								<text class="fs-24 col3">大型货车/大型客车</text>
							</view>
						</view>
						<view class="rowCon between">
							<view class="colCenter colCenter-car" @click="changeCarType('g')">
								<image class="carImg" :src="imgUrl + 'mine/car_g.png'" />
								<text class="car-txt">渐变绿牌</text>
								<image v-if="carType === 'g'" class="car-select-icon" :src="imgUrl + 'car_select1.png'"
									mode="">
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

					</view>
				</view>
				<view class="form-card">
					<view class="form-item" @click='vehicleTypeFun()'>
						<text class="labels">车辆类型:</text>
						<input v-model="formData.vehicleType" class="input" placeholder="请选择车辆"
							placeholder-class="placeholder" placeholder-style="color: #C8C9CB" disabled />
					</view>
					<view class="form-item" @click="openMap(1)">
						<text class="label">救援地址</text>
						<view class="input">
							<text style="color: #C8C9CB" v-if="!formData.fault.address">请选择救援地址</text>
							<text v-else>{{formData.fault.address}}</text>
							<!-- <input v-model="formData.fault.address" class="input" placeholder="请选择救援地址" disabled
								placeholder-class="placeholder" placeholder-style="color: #C8C9CB" /> -->
						</view>
					</view>
					<view class="form-item" @click="openMap(2)">
						<text class="label">目的地地址</text>
						<view class="input">
							<text style="color: #C8C9CB" v-if="!formData.destination.address">请选择救援地址</text>
							<text v-else>{{formData.destination.address}}</text>
							<!-- <input v-model="formData.destination.address" class="input" placeholder="请选择目的地地址" disabled
								placeholder-class="placeholder" placeholder-style="color: #C8C9CB" /> -->
						</view>
					</view>
					<view class="form-item">
						<text class="label">行驶方向</text>
						<view class="input">
							<input v-model="formData.direction" class="input" placeholder="请输入行驶方向"
								placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
						</view>
					</view>
					<view class="form-item">
						<text class="label" style="width: 250rpx;">高速公路路段名称</text>
						<view class="input" @click="sectionListFun()" style="height: 70rpx;">
							<input v-model="formData.highwayName" class="input" placeholder="高速公路路段名称"
								placeholder-class="placeholder" disabled placeholder-style="color: #C8C9CB" />
						</view>
					</view>
					<view class="form-item">
						<text class="label">故障描述</text>
						<view class="input">
							<input v-model="formData.faultDescription" class="input" placeholder="请输入故障描述"
								placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
						</view>
					</view>
					<view class="form-item">
						<text class="label">占据车道</text>
						<view class="input">
							<input v-model="formData.lane" class="input" disabled placeholder="请选择占据车道"
								placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
						</view>
					</view>
					<view class="lane">
						<view class="item" :class="laneStyle==1?'items':''" @click="laneFun(1,'超车道')">
							<image :src="imgUrl + 'static/zj-1.png'" class="img"></image>
							<text>超车道</text>
						</view>
						<view class="item" :class="laneStyle==2?'items':''" @click="laneFun(2,'主车道')">
							<image :src="imgUrl + 'static/zj-2.png'" class="img"></image>
							<text>主车道</text>
						</view>
						<view class="item" :class="laneStyle==3?'items':''" @click="laneFun(3,'应急车道')">
							<image :src="imgUrl + 'static/zj-3.png'" class="img"></image>
							<text>应急车道</text>
						</view>
					</view>
				</view>
			</view>
			<view v-if="stepsPz==1">
				<view class="rescue-box">
					<view class="order-info">救援信息</view>
					<view class="order-item">
						<view class="label">车俩类型:</view>
						<view class="value"></view>
					</view>
					<view class="order-item">
						<view class="label">行驶方向:</view>
						<view class="value"></view>
					</view>
					<view class="order-item">
						<view class="label">路段名称:</view>
						<view class="value"></view>
					</view>
					<view class="order-item">
						<view class="label">救援司机:</view>
						<view class="value"></view>
					</view>
				</view>
				<view class="rescue-box">
					<view class="order-info">工单信息</view>
					<view class="order-item">
						<view class="label">工单号:&nbsp;&nbsp;</view>
						<view class="value"></view>
					</view>
					<view class="order-item">
						<view class="label">工单时间:</view>
						<view class="value"></view>
					</view>
					<view class="order-item">
						<view class="label">被救援人姓名:</view>
						<view class="value"></view>
					</view>
					<view class="order-item">
						<view class="label">被救援人电话:</view>
						<view class="value"></view>
					</view>
					<view class="order-item">
						<view class="label">故障车牌号:</view>
						<view class="value"></view>
					</view>
					<view class="order-item">
						<view class="label">车辆类型:</view>
						<view class="value"></view>
					</view>
					<view class="order-item">
						<view class="label">占据车道:</view>
						<view class="value"></view>
					</view>
				</view>
				<view class="rescue-box">
					<view class="rescue-box">
						<view class="order-info">地址信息</view>
					</view>
					<view class="order-item">
						<view class="label">救援地址:</view>
						<view class="value"></view>
					</view>
					<view class="order-item">
						<view class="label">目的地地址:</view>
						<view class="value"></view>
					</view>
				</view>
			</view>
		</view>

		<view class="bottom" v-if="stepsPz==0">
			<view class="bottom-box" @click="submit">
				确认救援
			</view>
		</view>

		<!-- 车牌键盘 -->
		<u-keyboard v-model:show="showPlateInput" mode="car" :random="false" :autoChange="true" :overlay="true"
			:closeOnClickOverlay="true" :zIndex="10086" @change="onKeyChange" @backspace="onBackspace"
			@confirm="onConfirm" @close="onClose" @cancel="onClose" />
		<!-- 高速路段弹出 -->
		<!-- keyName="sectionNumber" valueName="sectionId" -->
		<u-popup :show="isshow" mode="bottom" @close="tkclose" round="10" closeable>
			<view class="actionText">
				<up-input placeholder="搜索路段名称" border="surround" clearable v-model="keyword" @change="highSpeedFun"
					:customStyle="{ 
						  backgroundColor: '#f5f5f5',
						  borderRadius: '4px',
						  padding: '5px 10px'
						}"></up-input>
			</view>
			<scroll-view scroll-y style="height: 400rpx;">
				<view class="section-box">
					<view v-for="(item,index) in columns" :key="index" class="list-text" @click="confirmDown(item)">
						{{item.sectionNumber}}
					</view>
				</view>
			</scroll-view>
		</u-popup>
		<!-- 车辆类型弹出 -->
		<up-picker :show="carisshow" :columns="carcolumns" @cancel='carisshow=false' @confirm='confirmdownCar'
			keyName="label" valueName="value"></up-picker>
	</view>

</template>
<script setup lang="ts">
	import { ref, reactive } from 'vue'
	import { imgUrl } from '../../config';
	import { onLoad } from '@dcloudio/uni-app'
	import { debounce } from '@/utils/common';
	import { selectionLocation } from '@/utils/util';
	import { sectionList, carTypeList, submitObj } from '@/api/rescue';
	import carPlate from '@/components/carNumInput/carNumInput.vue';
	import { getByUserIdAndVehicleAll } from '@/api/user';
	const props = defineProps<{
		show ?: boolean
		carType ?: 'b' | 'y' | 'g' | 'yg'
	}>();
	const showPlateInput = ref(false);
	const currentIndex = ref<number>(-1);        // 当前编辑的位
	const btnEnabled = ref<boolean>(true);
	const saveFlag = ref<boolean>(true);
	const modalIsShow = ref<boolean>(false);     // 简化为确认绑定弹窗
	const isshow = ref<boolean>(false);
	const carisshow = ref<boolean>(false);
	const inputType = ref(1);
	const carNum = ref('??????');
	const translateSpace = ref<number>(0);
	const carType = ref<'b' | 'y' | 'g' | 'yg'>(props.carType ?? 'b');
	const ownerTex = ref<string>('');
	const stepsPz = ref<number>(0);
	const columns = ref<any>();
	const carcolumns = ref<any>([]);
	// #ifdef APP
	const bdMapPlugin = uni.requireNativePlugin('bdMapPlugin')
	// #endif
	// 布局
	const keyword = ref<string>('');
	const backgroundColor = ref<string>("#FFFFFF");
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref<number>(0);
	const selectedLocation = ref(null);
	const laneStyle = ref<string>('');
	const phoneReg = /^1[3-9]\d{9}$/;
	// Props（保留不动）


	// 表单数据类型
	interface FormData {
		name : string
		type : string
		taxid : string
		email : string
	}
	// 响应式数据
	const formData = reactive<FormData>({
		memberId: '',
		// 被救援人姓名
		customerName: '',
		// 被救援人电话
		customerPhone: '',
		// 故障车牌号
		handFilledLicensePlate: '',
		// 车辆类型
		vehicleType: '',
		// 车辆类型值
		vehicleTypeValue: '',
		// 车牌颜色
		licensePlateColor: '',
		// 救援地址
		fault: {
			address: '',
			longitude: '',
			latitude: ''
		},
		// 目的地址
		destination: {
			address: '',
			longitude: '',
			latitude: ''
		},
		// 行驶方向
		direction: '',
		// 高速公路路段
		highwayName: '',
		// 高速公路路段
		highwayNameId: '',
		// 故障描述（救援描述）
		faultDescription: '',
		// 占据车道
		lane: ''
	})
	const laneFun = (val, name) => {
		laneStyle.value = val
		formData.lane = name
	}
	// 不同车牌类型期望长度
	const typeMaxLen = (t : 'b' | 'y' | 'g' | 'yg') => (t === 'g' || t === 'yg') ? 8 : 7;
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
	const handlePlateChange = (e : any) => {
		const value = e.detail.value;
		const type = e.detail.type;
		let carNumValue = carNum.value;

		if (type === 1) {
			carNumValue = value + carNumValue.substring(1);
			if (!carNumValue.includes('?')) {
				carNum.value = carNumValue;
				showPlateInput.value = false;
				if (isCarPlate(carNum.value)) {

				}
				return;
			}
		} else {
			const holderIndex = carNumValue.indexOf('?');
			if (carType.value === 'g' || carType.value === 'yg') {
				if (holderIndex <= 7) {
					carNumValue = carNumValue.replace('?', value);
				}
			} else {
				if (holderIndex <= 6) {
					carNumValue = carNumValue.replace('?', value);
				}
			}
		}

		if (type === 1) {
			inputType.value = 2;
		}
		carNum.value = carNumValue;
	};
	const handlePlateConfirm = () => {
		if (!isCarPlate(carNum.value)) {
			wx.showToast({
				title: '请输入正确的车牌号',
				icon: 'none',
			});
			return false;
		}
		translateSpace.value = 0;
		showPlateInput.value = false;
		inputType.value = 1;


	};
	const handlePlateDelete = () => {
		let carNumValue = carNum.value;
		const holderIndex = carNumValue.indexOf('?');
		if (holderIndex !== -1) {
			carNumValue = carNumValue.substring(0, holderIndex - 1) + '?' + carNumValue.substring(holderIndex);
		} else {
			carNumValue = carNumValue.substring(0, carNumValue.length - 1) + '?';
		}

		if (carNumValue === '???????' || carNumValue === '????????') {
			inputType.value = 1;
		}
		carNum.value = carNumValue;
	};
	const handlePlateClose = () => {
		translateSpace.value = 0;
		showPlateInput.value = false;
		inputType.value = 1;


	};
	// 车牌校验（7位普通、8位新能源）
	const isCarPlate = (value : string) : boolean => {
		// 只要包含 '?' 就视为不完整
		if (value.includes('?')) return false;
		// 普通车牌（蓝牌、黄牌）：7位，规则：省份+字母+5位序号（数字/字母，不含I、O）
		const commonReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-HJ-NP-Z]{1}[A-HJ-NP-Z0-9]{5}$/;
		// 新能源车牌（绿牌）：8位，规则：省份+字母+6位序号（数字/字母，不含I、O）
		const newEnergyReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-HJ-NP-Z]{1}[A-HJ-NP-Z0-9]{6}$/;

		if (value.length === 7) return commonReg.test(value);
		if (value.length === 8) return newEnergyReg.test(value);
		return false;
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
	// 生成当前实际车牌字符串（截到 maxLen，去掉多余 '?')
	const currentPlateString = () : string => {
		const s = normalizeCarNumToMaxLen(carNum.value, maxLen.value);
		// 允许末尾存在 '?' 时视为不完整
		return s;
	};
	// 键盘：确认
	const onConfirm = () => {
		showPlateInput.value = false;
		if (!isCarPlate(currentPlateString())) {
			uni.showToast({ title: '请输入正确的车牌号', icon: 'none' });
			return;
		}
		formData.handFilledLicensePlate = carNum.value
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
	const openMap = (val) => {
		// #ifdef APP
		bdMapPlugin.selectionLocation((e) => {
			const res = JSON.parse(e);
			if (res.location?.latitude) {
				const location = {
					name: res.name || '未知地点',
					address: res.address || '无详细地址',
					latitude: parseFloat(res.location.latitude),
					longitude: parseFloat(res.location.longitude)
				};

				// 赋值到 formData
				if (val === 1) {
					formData.fault.address = location.address;
					formData.fault.longitude = location.longitude;
					formData.fault.latitude = location.latitude;
				} else {
					formData.destination.address = location.address;
					formData.destination.longitude = location.longitude;
					formData.destination.latitude = location.latitude;
				}
			}
		});

		// #endif
		// #ifdef MP-WEIXIN
		uni.chooseLocation({
			success: (res) => {
				selectedLocation.value = {
					name: res.name || '未知地点',
					address: res.address || res.formattedAddress || '无详细地址',
					latitude: res.latitude,
					longitude: res.longitude
				}
				if (val == 1) {
					formData.fault.address = res.address
					formData.fault.longitude = res.longitude
					formData.fault.latitude = res.latitude
				} else {
					formData.destination.address = res.address
					formData.destination.longitude = res.longitude
					formData.destination.latitude = res.latitude
				}
			},
			fail: (err) => {
				if (err.errMsg.includes('cancel')) {
					console.log('用户取消选择')
				} else {
					uni.showToast({
						title: '获取位置失败',
						icon: 'none'
					})
				}
			}
		})
		// #endif

	}
	// 高速路段列表查询
	const sectionListFun = async (val : string) => {
		let text = val ? val : ''
		const res = await sectionList(text);
		isshow.value = true
		columns.value = res.data
	}
	const tkclose = () => {
		keyword.value = ''
		columns.value = ''
		isshow.value = false
	}
	//汽车类型
	const carTypefun = async () => {
		const res = await carTypeList();
		carcolumns.value = [res.data]
	}
	const vehicleTypeFun = () => {
		carisshow.value = true
	}
	const confirmdownCar = (e : any) => {
		const station = e.value[0]
		formData.vehicleType = station.label
		formData.vehicleTypeValue = station.value
		carisshow.value = false
	}
	const highSpeedFun = (e : any) => {
		sectionListFun(e)
		uni.hideKeyboard();
		if (uni.getSystemInfoSync().platform === 'app-plus') {
			plus.key.hideSoftKeybord();
		}
	}
	const confirmDown = (e : any) => {
		const station = e
		formData.highwayName = station.sectionName
		formData.highwayNameId = station.highwayNameId
		isshow.value = false
	}
	// 防抖处理的提交方法
	const submit = debounce(() => {
		// if (!formData.customerName) {
		// 	uni.showToast({
		// 		title: '请输入被救援人姓名',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// 	return
		// }
		if (!phoneReg.test(formData.customerPhone)) {
			uni.showToast({
				title: '请输入正确的手机号格式',
				icon: 'none',
				duration: 1000
			})
			return
		}
		// if(!formData.handFilledLicensePlate) {
		// 	uni.showToast({
		// 		title: '请输入正确的车牌号',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// 	return
		// }
		if (!formData.vehicleType) {
			uni.showToast({
				title: '请选择车辆类型',
				icon: 'none',
				duration: 1000
			})
			return
		}
		// if(!formData.fault.address) {
		// 	uni.showToast({
		// 		title: '请选择车救援地址',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// 	return
		// }
		// if(!formData.destination.address) {
		// 	uni.showToast({
		// 		title: '请选择目的地址',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// 	return
		// }
		// if (!formData.direction) {
		// 	uni.showToast({
		// 		title: '请选择行驶方向',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// 	return
		// }
		// if (!formData.highwayName) {
		// 	uni.showToast({
		// 		title: '请选择高速公路路段',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// 	return
		// }
		// if (!formData.lane) {
		// 	uni.showToast({
		// 		title: '请选择占据车道',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// 	return
		// }

		// if (!formData.faultDescription) {
		// 	uni.showToast({
		// 		title: '请输入故障描述',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// 	return
		// }

		// if (!formData.lane) {
		// 	uni.showToast({
		// 		title: '请输入占据车道',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// 	return
		// }
		if (carType.value === 'y') formData.licensePlateColor = '3';
		else if (carType.value === 'b') formData.licensePlateColor = '1';
		else if (carType.value === 'g') formData.licensePlateColor = '2';
		else if (carType.value === 'yg') formData.licensePlateColor = '6';
		sysReviewFun();
	}, 2000);

	const sysReviewFun = async () => {
		let params = formData
		const res = await submitObj(params);
		if (res.code == 200) {
			uni.showToast({
				title: '提交成功',
				icon: 'success',
				duration: 1000
			})
		} else {
			uni.showToast({
				title: res.msg,
				icon: '',
				duration: 1000
			})
		}
		setTimeout(() => {
			uni.redirectTo({
				url: '/pages_A/roadRescue/workOrder',
			})
		}, 1500);
	}
	const getcarData = async () => {
		try {
			const userId = uni.getStorageSync('userInfo')?.id;
			const params = {
				userId: userId
			}
			const res : any = await getByUserIdAndVehicleAll(params);
			if (res.data) {
				let data = res.data[0]
				carNum.value = data.licensePlate
				formData.customerPhone = data.ownerPhone
				if (data.plateColor == '3') carType.value = 'y';
				else if (data.plateColor == '1') carType.value = 'b';
				else if (data.plateColor == '2') carType.value = 'g';
				else if (data.plateColor == '6') carType.value = 'yg'
				formData.handFilledLicensePlate = data.licensePlate
			}
		} catch (e) {
		}
	};
	onLoad(() => {
		let id = uni.getStorageSync('userInfo').id
		let carName = uni.getStorageSync('carName')
		formData.customerName = carName ? carName : ''
		formData.memberId = id
		carTypefun()
		getcarData()
	})
</script>

<style scoped lang="scss">
	.iamge-phone {
		position: -webkit-sticky;
		width: 120rpx;
		height: 120rpx;
		position: fixed;
		top: 70%;
		z-index: 99;
		right: 0;
	}

	.bottom {
		height: 100rpx;
		padding: 20rpx 40rpx 40rpx;
		background-color: #fff;

		.bottom-box {
			width: 100%;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			background: #FD4848;
			color: #fff;
			border-radius: 48rpx;
		}
	}

	.whiteBg {
		padding: 40rpx 30rpx 0;
		margin: 20rpx 0;
		background-color: #ffffff;
		border-radius: 20rpx;
		box-sizing: border-box;
	}

	.form-card {
		width: 686rpx;
		background: #FFFFFF;
		border-radius: 26rpx;
		margin-bottom: 40rpx;
	}

	.container {
		height: calc(100vh - 88rpx);
		background: url(data:image/png;base64,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noOBLU+AAAECBAgQINBHQHju00uVECBAgAABAgQIBAsIz8HAlidAgAABAgQIEOgjIDz36aVKCBAgQIAAAQIEggWE52BgyxMgQIAAAQIECPQREJ779FIlBAgQIECAAAECwQLCczCw5QkQIECAAAECBPoICM99eqkSAgQIECBAgACBYAHhORjY8gQIECBAgAABAn0EhOc+vVQJAQIECBAgQIBAsIDwHAxseQIECBAgQIAAgT4CwnOfXqqEAAECBAgQIEAgWEB4Dga2PAECBAgQIECAQB8B4blPL1VCgAABAgQIECAQLCA8BwNbngABAgQIECBAoI+A8NynlyohQIAAAQIECBAIFhCeg4EtT4AAAQIECBAg0EdAeO7TS5UQIECAAAECBAgECwjPwcCWJ0CAAAECBAgQ6CMgPPfppUoIECBAgAABAgSCBYTnYGDLEyBAgAABAgQI9BEQnvv0UiUECBAgQIAAAQLBAsJzMLDlCRAgQIAAAQIE+ggIz316qRICBAgQIECAAIFgAeE5GNjyBAgQIECAAAECfQSE5z69VAkBAgQIECBAgECwgPAcDGx5AgQIECBAgACBPgLCc59eqoQAAQIECBAgQCBYQHgOBrY8AQIECBAgQIBAHwHhuU8vVUKAAAECBAgQIBAsIDwHA1ueAAECBAgQIECgj4Dw3KeXKiFAgAABAgQIEAgWEJ6DgS1PgAABAgQIECDQR0B47tNLlRAgQIAAAQIECAQLCM/BwJYnQIAAAQIECBDoIyA89+mlSggQIECAAAECBIIFhOdgYMsTIECAAAECBAj0ERCe+/RSJQQIECBAgAABAsECwnMwsOUJECBAgAABAgT6CAjPfXqpEgIECBAgQIAAgWAB4TkY2PIECBAgQIAAAQJ9BITnPr1UCQECBAgQIECAQLCA8BwMbHkCBAgQIECAAIE+AsJzn16qhAABAgQIECBAIFhAeA4GtjwBAgQIECBAgEAfAeG5Ty9VQoAAAQIECBAgECwgPAcDW54AAQIECBAgQKCPgPDcp5cqIUCAAAECBAgQCBYQnoOBLU+AAAECBAgQINBHQHju00uVECBAgAABAgQIBAsIz8HAlidAgAABAgQIEOgjIDz36aVKCBAgQIAAAQIEggWE52BgyxMgQIAAAQIECPQREJ779FIlBAgQIECAAAECwQLCczCw5QkQIECAAAECBPoICM99eqkSAgQIECBAgACBYAHhORjY8gQIECBAgAABAn0EhOc+vVQJAQIECBAgQIBAsIDwHAxseQIECBAgQIAAgT4CwnOfXqqEAAECBAgQIEAgWEB4Dga2PAECBAgQIECAQB8B4blPL1VCgAABAgQIECAQLCA8BwNbngABAgQIECBAoI+A8NynlyohQIAAAQIECBAIFvgWnv9+eXn5j+AHWZ4AAQIECBAgQIBAdYH/+fQ/f//7/76+vv6f6pXYPwECBAgQIECAAIFIgU+fPv39/wHZruN42nlacQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;
		background-position: center;
	}

	.form-info {
		padding: 30rpx;

		.form-info-jd {
			height: 150rpx;
			background: #fff;
			border-radius: 25rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 30rpx;

		}
	}

	.form-item {
		display: flex;
		align-items: center;
		padding: 40rpx 0 40rpx 40rpx;
		border-bottom: 1rpx solid #eee;

		.label,
		.labels {
			width: 200rpx;
			font-weight: 500;
			font-size: 28rpx;
			color: #7F7F7F;
			position: relative;
			display: inline-block;
		}

		.labels::before {
			content: "*";
			color: red;
			position: absolute;
			left: -20rpx;
		}

		.input {
			flex: 1;
			display: flex;
			align-items: center;
			font-weight: 500;
			font-size: 28rpx;
			color: #000000;
			padding-right: 20rpx;

			&.full-width {
				margin-left: 170rpx;
			}

			.value {
				flex: 1;

				&.placeholder {
					color: #C8C9CB;
				}
			}
		}

		.placeholder {
			color: #C8C9CB;
		}
	}

	.numCon {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
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

	.lane {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: .625rem 0;
		width: 100%;

		.item {
			width: 30%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border: 1px solid #AFB1B3;
			overflow: hidden;
			border-radius: 20rpx;

			.img {
				width: 100%;
				height: 160rpx;
			}
		}
	}

	.items {
		border: 1px solid #3280FE !important;
		color: #3280FE;
	}

	/* 容器样式 */
	.order-info {
		position: relative;
		/* 为伪元素定位做容器 */
		padding-left: 12px;
		/* 给竖线留空间 */
		font-size: 16px;
		font-weight: bold;
		margin-left: 10rpx;
	}

	/* 左侧竖线伪元素 */
	.order-info::before {
		content: "";
		position: absolute;
		left: 0;
		top: 8rpx;
		bottom: 0;
		width: 8rpx;
		height: 30rpx;
		background-color: #007aff;
		border-radius: 1px;
	}

	.order-item {
		width: 95%;
		display: flex;
		margin: 20rpx auto 10rpx;
		font-size: 30rpx;
		background: #fff;
		border-radius: 10rpx;

	}

	.rescue-box {
		padding: 28rpx 20rpx 20rpx;
		border-radius: 20rpx;
		background: #fff;
		margin-bottom: 20rpx;
	}

	/* 标签列：设置固定宽度，实现对齐 */
	.label {
		text-align: left;
		color: #000;
	}

	/* 内容列：自动填充剩余宽度 */
	.value {
		flex: 1;
		color: #333;
		/* 内容颜色，可选 */
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
		border: 1px dashed $color;
		margin-top: 50rpx;
	}

	.cardImg {
		width: 300rpx;
		height: 168rpx;
		background: #FFFAF3;
		border-radius: 16rpx;
		border: 1px solid $color;
		// position: absolute;
		// top: 0; left: 0;
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

	::v-deep .u-textarea__field {
		color: #000 !important;
		font-size: 28rpx !important;
		font-weight: 100;
	}

	.custom-textarea ::v-deep input::placeholder,
	.custom-textarea ::v-deep textarea::placeholder {
		color: #eee;
		/* 自定义颜色（例如红色） */
		opacity: 1;
		/* 可选：部分浏览器默认有透明度，强制设为1更准确 */
	}

	.list-text {
		text-align: center;
		line-height: 80rpx;
	}

	.actionText {
		width: 80%;
		height: 60rpx;
		margin: 85rpx auto 20rpx;
	}

	.section-box {
		margin-top: 10rpx;
	}
</style>