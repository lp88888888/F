<template>
	<view class="container" :data-theme="pageTheme">
		<!-- <cos-header title='收货地址' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="100"></cos-header> -->
		<up-navbar title="收货地址" @leftClick="toBack" placeholder fixed :titleStyle="{ fontWeight: 'bold' }"></up-navbar>
		<view class="address-edit-page" :style="{ paddingTop: '10rpx' }">
			<!-- 表单区域 -->
			<view class="form-card">
				<view class="form-item">
					<text class="label">收货人</text>
					<up-input placeholder="请输入您的姓名" v-model="formData.name" border="surround" maxlength="12"></up-input>
					<!-- <input v-model="formData.name" class="input" placeholder="请输入您的姓名" placeholder-class="placeholder"
						placeholder-style="color: #C8C9CB" /> -->
				</view>

				<view class="form-item">
					<text class="label">手机号码</text>
					<up-input placeholder="请输入手机号码" v-model="formData.phone" type="number" border="surround" maxlength="11"></up-input>
					<!-- <input v-model="formData.phone" class="input" type="number" placeholder="请输入手机号码"
						placeholder-class="placeholder" placeholder-style="color: #C8C9CB" /> -->
				</view>
				<view class="form-item">
					<text class="label">通讯地址</text>
					<view @click="toJump('./city')" class="inputView" style="">
						<text v-if="address">{{ address }}</text>
						<text v-else class="deText">请选择省市区</text>
						<uni-icons type="arrowright" size="16" color="#333"></uni-icons>
					</view>
				</view>
				<view class="form-item">
					<text class="label"></text>
					<!-- <input v-model="formData.addressDetail" class="input full-width" placeholder="请输入详细地址"
						placeholder-class="placeholder" placeholder-style="color: #C8C9CB" /> -->
					<up-textarea v-model="formData.addressDetail" placeholder="请输入详细地址" autoHeight maxlength="30"></up-textarea>
				</view>
			</view>

			<view class="form-card">
				<view class="form-item-label">
					<text class="label">标签</text>
					<view class="tag-container">
						<view
							v-for="(tag, index) in memberAddressLabelList"
							:key="index"
							:class="['tag', labelName === tag.labelName && 'active']"
							@click="tagFun(index, tag)"
							@longpress="confirmDelete(index)"
						>
							{{ tag.labelName }}
						</view>
						<!-- 	<view :class="['tag', isCustomTag && 'active']" @click="custom()">
							自定义
						</view> -->
						<!-- <view v-if="zdy">
							<view class="tag" @click="custom()">
								自定义
							</view>
							<input v-if="showCustomTag" v-model="customTag" class="custom-input" placeholder="输入标签"
								border="none" @blur="saveMemberLabelAddressFun" />
						</view> -->
					</view>
				</view>
			</view>

			<!-- 保存按钮 -->
			<view class="bottom-bar">
				<view class="save-btn" @click="doSearch" :class="{ disabledBtn: isSubmitting }"> 保存 </view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { toBack } from '@/utils/route';
import { debounce } from '@/utils/common';
import CosHeader from '@/components/customNavBar/index.vue';
import { saveOrUpdateMemberDeliveryAddress, getAddressByIdAddress, saveMemberLabelAddress, getMemberLabelListAddress } from '@/api/user';
const phoneReg = /^[1][3-9]\d{9}$/;
// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = ref(themeStore.imgUrl);

const fontColor = ref<string>('#000');
const fixed = ref<boolean>(true);
const navBarHeight = ref(0);
const address = ref<string>('');
const cityCode = ref<string>('');
const districtCode = ref<string>('');
const provinceCode = ref<string>('');
const memberAddressLabelList = ref<any>([
	{ labelName: '家', cureLabelFlag: false, id: '1' },
	{ labelName: '公司', cureLabelFlag: false, id: '2' },
	{ labelName: '学校', cureLabelFlag: false, id: '3' },
	{ labelName: '其他', cureLabelFlag: false, id: '4' },
]);
const id = ref<string>('');
const province = ref<string>('');
const city = ref<string>('');
const district = ref<string>('');
const labelId = ref<string>('');
const labelName = ref<string>('');
// 自定义标签
const showCustomTag = ref<boolean>(false);
const customTag = ref<string>('');
const isCustomTag = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const zdy = ref<boolean>(true);
onMounted(() => {
	// 从cos-header组件获取实际高度或计算
	const sysInfo = uni.getSystemInfoSync();
	navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
});
onShow(() => {
	console.log('-0-0-0onShow-0-0-');
	// #ifdef APP
	if (uni.getStorageSync('appaddress')) {
		const addr = uni.getStorageSync('appaddress');
		setSelectedAddress(addr);
		uni.removeStorageSync('appaddress');
	}
	if (uni.getStorageSync('selectedAddress')) {
		const addr = uni.getStorageSync('selectedAddress');
		setSelectedAddress(addr);
		uni.removeStorageSync('selectedAddress');
	}
	// #endif
});
// 表单数据类型
interface FormData {
	id: string;
	name: string;
	phone: string;
	region: Array;
	addressDetail: string;
	tag: string;
}
// 定义接收地址的方法，供下一页调用
const setSelectedAddress = (selectedAddress: any) => {
	console.log('---------90093====----', selectedAddress);
	if (!selectedAddress) return;
	// 保存接收的地址数据
	address.value = selectedAddress.province + '/' + selectedAddress.city + '/' + selectedAddress.district;
	province.value = selectedAddress.province;
	city.value = selectedAddress.city;
	district.value = selectedAddress.district;
	provinceCode.value = selectedAddress.provinceCode;
	cityCode.value = selectedAddress.cityCode;
	districtCode.value = selectedAddress.districtCode;
	console.log(province.value, city.value, district.value);
	// 可以在这里执行其他操作，如刷新数据等
	console.log('接收到的地址：', selectedAddress);
};

// 响应式数据
const formData = reactive<FormData>({
	addrId: '',
	name: '',
	phone: '',
	region: [],
	addressDetail: '',
	tag: '',
	defaultFlag: null,
});

const toJump = (url: string) => {
	uni.navigateTo({
		url: url,
	});
};
const custom = () => {
	// // 先将所有地址设为非默认
	// memberAddressLabelList.value.forEach(item => {
	// 	item.cureLabelFlag = false
	// })
	// isCustomTag.value = true
	showCustomTag.value = true;
};
const tagFun = (index: number, tab: any) => {
	memberAddressLabelList.value.forEach((item) => {
		item.cureLabelFlag = false;
	});
	memberAddressLabelList.value[index].cureLabelFlag = true;
	isCustomTag.value = false;
	showCustomTag.value = false;
	labelId.value = tab.id;
	labelName.value = tab.labelName;
};
// 处理自定义标签
const handleCustomTagBlur = () => {
	if (customTag.value.trim()) {
		formData.tag = customTag.value;
		isCustomTag.value = true;
	}
	showCustomTag.value = false;
};
const getAddresEchoFun = async (id: string) => {
	let params = {
		addressId: id,
	};
	const res = await getAddressByIdAddress(id);
	if (res?.code == '200') {
		let data = res.data;
		const selectedAddress = {
			province: data.province,
			provinceCode: data.provinceId,
			city: data.city,
			cityCode: data.cityId,
			district: data.area,
			districtCode: data.areaId,
			code: data.cityId,
		};
		uni.setStorageSync('selectedAddress', selectedAddress);
		formData.name = data.consignee;
		formData.phone = data.mobile;
		formData.defaultFlag = data.defaultFlag;
		formData.addrId = data.addrId;
		labelName.value = data.tag;

		address.value = data.province + '-' + data.city + '-' + data.area;
		formData.addressDetail = data.addr;
		// memberAddressLabelList.value = data.memberAddressLabelList
		province.value = data.province;
		city.value = data.city;
		district.value = data.area;
		labelId.value = data.labelId;
		// if(data.memberAddressLabelList){
		// 	for(let i in data.memberAddressLabelList){
		// 		if(data.memberAddressLabelList[i].id == labelId.value){
		// 			labelName.value = data.memberAddressLabelList[i].labelName
		// 		}
		// 	}
		// }
	}
};
//防抖
const doSearch = debounce(() => {
	handleSave();
}, 600);
// 保存地址
const handleSave = async () => {
	if (isSubmitting.value) return;
	
	if (!formData.name.replace(/\s+/g, '')) {
		uni.showToast({ title: '请输入收货人姓名', icon: 'none' });
		return;
	}
	if (!formData.phone) {
		uni.showToast({ title: '请输入手机号码', icon: 'none' });
		return;
	}
	if (!formData.region) {
		uni.showToast({ title: '请选择地区', icon: 'none' });
		return;
	}

	if (!formData.addressDetail) {
		uni.showToast({ title: '请输入详细地址', icon: 'none' });
		return;
	}
	if (!phoneReg.test(formData.phone)) {
		return uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
	}
	
	isSubmitting.value = true;
	let params = {
		addr: formData.addressDetail,
		city: city.value,
		province: province.value,
		area: district.value,
		consignee: formData.name.replace(/\s+/g, ''),
		mobile: formData.phone,
		labelId: labelId.value,
		tag: labelName.value,
		addrId: formData.addrId,
		defaultFlag: formData.defaultFlag,
		provinceId: provinceCode.value,
		cityId: cityCode.value,
		areaId: districtCode.value,
	};
	try {
		const res = await saveOrUpdateMemberDeliveryAddress(params);
		// 这里可以调用保存接口
		if (res?.code == '200') {
			uni.showToast({ title: '保存成功' });
			uni.removeStorage({ key: 'selectedAddress' });
			console.log('ssssssssooosoosokkkkkkkkk');
			uni.navigateBack();
		} else {
			uni.showToast({ title: res.msg });
		}
	} catch (error) {
		uni.showToast({ title: '保存失败', icon: 'none' });
	} finally {
		isSubmitting.value = false;
	}
};
const saveMemberLabelAddressFun = async () => {
	if (!customTag.value) {
		uni.showToast({
			title: '请输入标签',
			icon: 'none',
		});
		return;
	}
	let params = {
		labelName: customTag.value,
	};
	const res = await saveMemberLabelAddress(params);
	if (res?.code == '200') {
		uni.showToast({
			title: '添加成功',
			icon: 'success',
		});
		zdy.value = false;
		getMemberLabelListAddressFun();
	}
};
const getMemberLabelListAddressFun = async () => {
	let params = {
		labelName: customTag.value,
	};
	const res = await getMemberLabelListAddress(params);
	if (res?.code == '200') {
		memberAddressLabelList.value = res.clazz;
	}
};
// 初始化数据（如果是编辑）
onLoad((options) => {
	if (options.id) {
		// 加载地址数据
		getAddresEchoFun(options.id);
		id.value = options.id;
	} else {
		// getMemberLabelListAddressFun()
	}
});
// 关键：需要将方法暴露出去，否则下一页无法访问
defineExpose({
	setSelectedAddress,
});
</script>

<style lang="scss" scoped>
.inputView {
	width: calc(100% - 170rpx);
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 40rpx 0 20rpx;
	box-sizing: border-box;
}
.deText {
	color: #c0c4cc;
}
.address-edit-page {
	padding: 0 32rpx;
	background-color: #f1efec;
	min-height: 100vh;
	box-sizing: border-box;

	.form-card {
		width: 686rpx;
		background: #ffffff;
		border-radius: 26rpx;
		margin-top: 30rpx;
	}

	.form-item-label {
		padding: 10rpx 0 10rpx 30rpx;
		display: flex;
		justify-content: flex-start;

		.label {
			width: 170rpx;
			font-weight: 500;
			font-size: 28rpx;
			color: #000000;
			margin-top: 10rpx;
		}
	}

	.form-item {
		display: flex;
		align-items: center;
		padding: 10rpx 0 10rpx 30rpx;
		border-bottom: 1rpx solid #eee;

		.label {
			width: 170rpx;
			font-weight: 500;
			font-size: 28rpx;
			color: #7f7f7f;
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
					color: #c8c9cb;
				}
			}
		}

		.placeholder {
			color: #c8c9cb;
		}
	}

	.tag-container {
		display: flex;
		flex-wrap: wrap;
		flex: 1;

		.tag {
			min-width: 130rpx;
			height: 56rpx;
			padding: 10rpx 30rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			background: #f6f6f6;
			border-radius: 28rpx;
			font-size: 28rpx;
			color: #000000;
			box-sizing: border-box;
			text-align: center;

			&.active {
				background: var(--but-color-line);
				color: #fff;
			}
		}

		.custom-input {
			width: 150rpx;
			height: 60rpx;
			background-color: #f5f5f5;
			border-radius: 30rpx;
			padding: 0 20rpx;
			font-size: 26rpx;
		}
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 15rpx 32rpx 63rpx;
		background-color: #fff;

		.save-btn {
			height: 80rpx;
			background: var(--but-color-line);
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #ffffff;
			text-align: center;
			line-height: 80rpx;
		}
	}
}

::v-deep .u-input {
	height: 50rpx;
	border: none !important;
}

::v-deep .u-textarea {
	border: none !important;
}

::v-deep .uni-icons {
	margin-left: 42rpx;
}
</style>
