<template>
	<view class="page-container" :data-theme="pageTheme">
		<up-navbar title="预约" leftIconColor="#000000" bgColor="transparent" @leftClick="toBack" :placeholder="true"
			:fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<!-- <view class="topView">
			<view class="topView-text">放心购  安全开</view>
			<image :src="imgUrl+'del/car-back1.png'" mode=""></image>
		</view> -->
		<!-- <up-image :src="imgUrl+'static/old-car-sell-top.png'" width="690rpx" height="250rpx" lazyLoad></up-image> -->
		<view class="topCar fl-ce-sb">
			<view class="flex" style="flex-direction: column;">
				<image class="img1" :src="imgUrl+'static/useCar-car-Item1.png'" lazyLoad mode="scaleToFill" />
				<image class="img2" :src="imgUrl+'static/useCar-car-Item2.png'" lazyLoad mode="scaleToFill" />
			</view>
			<image class="topCar-right" :src="imgUrl+'static/useCar-car-Item.png'" lazyLoad mode="scaleToFill" />
		</view>
		<!-- 表单数据 -->
		<view class="formCard">
			<view class="formView">
				<view class="formData-label">姓名</view>
				<view class="formData-center">
					<up-input placeholder="请输入您的姓名" border="none" v-model="formData.name"></up-input>
				</view>
			</view>
			<view class="formView">
				<view class="formData-label">手机号码</view>
				<view class="formData-center">
					<up-input placeholder="请输入您的手机号" type="number" border="none" maxlength="11"
						v-model="formData.phone">
						<!-- <template #suffix>
							<view class="inpuBut">获取</view>
						</template> -->
					</up-input>
				</view>
			</view>
			<view class="formView" @click="brandOpen">
				<view class="formData-label">品牌</view>
				<view class="formData-center">
					<up-input placeholder="请选择品牌" readonly border="none" v-model="formData.brandName"></up-input>
				</view>
			</view>
			<view class="formView" @click="brandOpen">
				<view class="formData-label">车系</view>
				<view class="formData-center">
					<up-input placeholder="请选择车系" readonly border="none" v-model="formData.seriesName"></up-input>
				</view>
			</view>
			<view class="formView" @click="brandOpen">
				<view class="formData-label">车型</view>
				<view class="formData-center">
					<up-input placeholder="请选择车型" readonly border="none" v-model="formData.typeName"></up-input>
				</view>
			</view>
			<view class="formView" v-if="formData.brandId" @click="dealerShow=true">
				<view class="formData-label">门店</view>
				<view class="formData-center">
					<up-input placeholder="请选择门店" readonly border="none" v-model="formData.industryName"></up-input>
				</view>
			</view>
			<!-- <view class="formCard-item" @click="dealerShow=true">
				<up-input v-model="formData.industryName" placeholder="请选择门店" readonly placeholderStyle="color: #9C948D" fontSize="28rpx" border="none" ></up-input>
			</view> -->
			<view class="formView">
				<view class="formData-label">到店时间</view>
				<view class="formData-center" @click="timeShow = true">
					<up-input placeholder="请选择到店时间" readonly border="none" v-model="formData.appointmentTime">
						<template #suffix>
							<up-icon name="arrow-right" size="16"></up-icon>
						</template>
					</up-input>
				</view>
			</view>
			<view class="formView">
				<view class="formData-label">预算</view>
				<view class="formData-center">
					<up-input placeholder="请输入预算" type='digit' border="none" v-model="formData.budget"></up-input>
				</view>
			</view>
			<view class="formView">
				<view class="formData-label">备注</view>
				<view class="formData-center">
					<up-input placeholder="请输入备注" border="none" v-model="formData.remark"></up-input>
				</view>
			</view>
		</view>

		<!-- 店铺信息 -->
		<!-- <up-gap height="12"></up-gap>
		<view class="shopCard">
			<up-image :src="imgUrl+'del/car-back2.png'" radius="5" :lazy-load="true" width="106rpx"  height="106rpx"></up-image>
			<view class="shopCard-cnet">
				<view class="shopCard-cnet-name texNoWrap">陕西盛德鸿泰汽车销售有限公司</view>
				<up-gap height="10"></up-gap>
				<view class="shopCard-cnet-text">
					<up-icon name="map" size="16"></up-icon>
					<text class="texNoWrap">陕西省未央区科技路89号陕西汽贸集团...</text>
				</view>
			</view>
		</view> -->
		<!-- 底部按钮 -->
		<view class="fixeView">
			<view class="fixeView-item butIcon1" @click="toNav('/pages_F/appointment/myAppointment?type='+3)">我的预约</view>
			<view class="fixeView-item butIcon2" @click="submit">提交</view>
		</view>
		<up-gap height="100"></up-gap>
		<u-picker :show="dealerShow" :columns="columns" keyName="name"
			:confirmColor="themeStore.themeColors.$primaryColor" @close="prickClose" @cancel="prickClose"
			@confirm="prickConfirm"></u-picker>
		<BrandSelectPopup ref="brandSelectRef" @change="brandChange"></BrandSelectPopup>
		<up-datetime-picker :show="timeShow" v-model="timeValue" :minDate="minDate" closeOnClickOverlay mode="datetime"
			@cancel="timeClose" @close="timeClose" @confirm="timeConfirm"></up-datetime-picker>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, reactive } from 'vue';
	import { imgUrl } from '@/config';
	import BrandSelectPopup from '@/components/BrandSelectPopup/index.vue';
	import { timeFormat } from '@/uni_modules/uview-plus';
	import { isPhoneAvailable, showToastSuccess } from '@/utils/util';
	import { toNav, toBack, toRec } from '@/utils/route';
	import { debounce, toast } from '@/utils/common';
	import { onShow } from '@dcloudio/uni-app';
	import { addPrAppointmentOldCar } from '@/api/oldCar';
	import { prIndustry4sList } from '@/api/car';
	import type { Form } from './types';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const brandSelectRef = ref(null);
	const timeShow = ref(false)
	const timeValue = ref<Date>(new Date())
	const minDate = ref<Date>(new Date())
	const formData = reactive<Form>({
		name: '',
		phone: '',
		brandName: '',
		seriesName: '',
		typeName: '',
		brandId: '',
		seriesId: '',
		typeId: '',
		appointmentTime: '',
		industryId: '',
		industryName: '',
		budget: '',
		remark: '',
	});
	const columns = ref([]);
	const dealerShow = ref(false);
	const prickClose = () => {
		dealerShow.value = false;
	};
	const prickConfirm = (event) => {
		const { value } = event;
		formData.industryId = value[0].id;
		formData.industryName = value[0].name;
		prickClose();
	};
	const timeClose = () => {
		timeShow.value = false;
	}
	const brandOpen = () => {
		brandSelectRef.value.open()
	}
	const brandChange = (event) => {
		const { brandName, seriesName, modelsName, brandId, seriesId, modelsId } = event;
		formData.industryName = '';
		formData.industryId = '';
		formData.brandName = brandName
		formData.seriesName = seriesName
		formData.typeName = modelsName
		formData.brandId = brandId
		formData.seriesId = seriesId
		formData.typeId = modelsId
		columns.value = [];
		getIndustry4()
	};
	const timeConfirm = (event) => {
		timeValue.value = event.value
		formData.appointmentTime = timeFormat(event.value, 'yyyy-mm-dd hh:MM')
		timeClose()
	}
	const getIndustry4 = async () => {
		try {
			let res = await prIndustry4sList({
				pageNum: 1,
				pageSize: 1000,
				// typeCode:formData.typeId,
				typeId: formData.typeId,
			});
			if (res.code === 200) {
				columns.value.push(res.rows);
			}

		} catch (err) {
			console.log("err", err)
		}
	}
	// 提交预约
	const submit = debounce(async () => {
		if (!formData.name) return toast('请填写姓名');
		if (!formData.phone) return toast('请填写手机号码');
		if (!isPhoneAvailable(formData.phone)) return toast('输入的手机号格式不正确');
		if (!formData.brandId) return toast('请选择品牌');
		if (!formData.seriesId) return toast('请选择车系');
		if (!formData.typeId) return toast('请选择车型');
		if (!formData.appointmentTime) return toast('请选择到店时间');
		if (!formData.industryId) return toast('请选择4S门店');
		if (!formData.budget) return toast('请输入预算');

		try {
			const res = await addPrAppointmentOldCar(formData)
			if (res.code === 200) {
				toast('预约成功');
				setTimeout(() => {
					toRec('/pages_F/appointment/myAppointment?type='+3)
				}, 1000)
			} else {
				toast(res.msg)
			}
		} catch (err) {
			console.log("err", err)
		}
	}, 300)

	onShow(() => {
		if (uni.getStorageSync('carBrand')) {
			formData.brandId = uni.getStorageSync('carBrand').brandId;
			formData.brandName = uni.getStorageSync('carBrand').brandName;
			formData.seriesId = uni.getStorageSync('carBrand').seriesId;
			formData.seriesName = uni.getStorageSync('carBrand').seriesName;
			formData.typeId = uni.getStorageSync('carBrand').typeId;
			formData.typeName = uni.getStorageSync('carBrand').typeName;
			formData.industryId = uni.getStorageSync('carBrand').industryId;
			formData.industryName = uni.getStorageSync('carBrand').industryName;
			getIndustry4()
			uni.removeStorageSync('carBrand')
		}
	})
</script>

<style lang="scss" scoped>
	.page-container {
		min-height: 100vh;
		background: var(--head-color);
	}

	.topCar {
		padding-left: 20rpx;
		width: 100%;
		margin-bottom: 20rpx;

		.img1 {
			width: 340rpx;
			height: 78rpx;
		}

		.img2 {
			width: 308rpx;
			height: 28rpx;
			margin-top: 20rpx;
		}

		.topCar-right {
			width: 400rpx;
			height: 252rpx;
		}
	}

	.iconBox {
		margin-top: 30rpx;
		width: 100%;
		height: 80rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 266rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.iconBox-item {
			display: flex;
			font-weight: 500;
			font-size: 26rpx;
			color: var(--primary-color);
			line-height: 28rpx;

			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
		}
	}

	.topView {
		width: 750rpx;
		height: 750rpx;
		position: relative;

		image {
			width: 750rpx;
			height: 750rpx;
		}

		.topView-text {
			position: absolute;
			left: 0;
			top: 180rpx;
			z-index: 2;
			width: 100%;
			font-weight: 400;
			font-size: 80rpx;
			font-weight: 600;
			color: #FFFFFF;
			text-align: center;
		}
	}

	.formCard {
		width: 686rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		margin: 0 auto;
		// margin-top: -120rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 4;

		.formView {
			width: 100%;
			height: 116rpx;
			display: flex;
			align-items: center;

			.formData-label {
				width: 160rpx;
				font-weight: bold;
				font-size: 28rpx;
				color: #000000;
			}

			.formData-center {
				width: calc(100% - 160rpx);
			}
		}

		.inpuBut {
			font-weight: 400;
			font-size: 28rpx;
			color: #FF9600;
		}
	}

	.shopCard {
		width: 686rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx 32rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

		margin: 0 auto;

		.shopCard-cnet {
			width: calc(100% - 132rpx);
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		.shopCard-cnet-name {
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}

		.shopCard-cnet-text {
			font-weight: 500;
			font-size: 24rpx;
			color: #666666;
			display: flex;
			align-items: center;

			text {
				margin-left: 6rpx;
			}
		}
	}



	.fixeView {
		width: 100%;
		height: 158rpx;
		background: #FFFFFF;
		position: fixed;
		z-index: 10;
		left: 0;
		bottom: 0;
		padding: 15rpx 32rpx 0 32rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		// display: grid;
		// grid-template-columns: repeat(2, 2fr);
		// grid-gap: 30rpx;

		.fixeView-item {
			// width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			border: 1px solid transparent;
		}

		.butIcon1 {
			width: 242rpx;
			border: 1px solid var(--primary-color);
			color: var(--primary-color);
		}

		.butIcon2 {
			width: 398rpx;
			background: var(--primary-color);
			color: #FFFFFF;
		}
	}
</style>