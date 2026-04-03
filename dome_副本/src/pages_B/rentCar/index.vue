<template>
	<view class="box-car" :data-theme="pageTheme" >
		<up-navbar title="预约" bgColor="transparent" @leftClick="toBack" :placeholder="false" :fixed="true"></up-navbar>
		<view class="box-header">
			<image class="topImg" :src="imgUrl+'zc_bg.png'" lazy-load mode=""></image>
			<image class="zccar" :src="imgUrl+'zc_car.png'" lazy-load mode=""></image>
			<image class="czxy" :src="imgUrl+'czxy.png'" lazy-load mode=""></image>
			<view class="box-text">租车无忧，奔赴每段向往</view>
		</view>

		<view class="pageView">
			<view class="cards">
				<FormTemp label="姓名" borderBottom>
					<up-input v-model="formData.name" border="none" fontSize="14" maxlength="14"
						placeholder="请输入您的姓名"></up-input>
				</FormTemp>
				<FormTemp label="手机号码" borderBottom>
					<up-input v-model="formData.phone" type="number" border="none" maxlength="11" fontSize="14"
						placeholder="请输入手机号">
					</up-input>
				</FormTemp>
				<FormTemp label="品牌" borderBottom>
					<view @click="barOpen">
						<!-- <up-input v-model="brandName" readonly border="none" fontSize="14" placeholder="请选择品牌">
							<template #suffix>
								<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
							</template>
						</up-input> -->
						<view class="inputBoooxxx">
							<text class="inputBoooxxx-text1" v-if="brandName">{{brandName}}</text>
							<text class="inputBoooxxx-text2" v-else>请选择品牌</text>
							<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
						</view>
					</view>
				</FormTemp>
				<FormTemp label="车系" borderBottom>
					<!-- <up-input v-model="seriesName" readonly border="none" fontSize="14" placeholder="请选择品牌">
						<template #suffix>
							<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
						</template>
					</up-input> -->
					<view class="inputBoooxxx" @click="barOpen">
						<text class="inputBoooxxx-text1" v-if="seriesName">{{seriesName}}</text>
						<text class="inputBoooxxx-text2" v-else>请选择车系</text>
						<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
					</view>
				</FormTemp>
				<FormTemp label="车型" borderBottom>
					<!-- <up-input v-model="modelsName" readonly border="none" fontSize="14" placeholder="请选择车型">
						<template #suffix>
							<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
						</template>
					</up-input> -->
					<view class="inputBoooxxx" @click="barOpen">
						<text class="inputBoooxxx-text1" v-if="modelsName">{{modelsName}}</text>
						<text class="inputBoooxxx-text2" v-else>请选择车型</text>
						<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
					</view>
				</FormTemp>
				<FormTemp label="用车时间" borderBottom>
					<view class="fl-ce-sb"  @click="openTime('start')">
						<view class="fl-ce-sb" style="width: 365rpx;">
							<view>
								<text v-if="formData.appointmentTime">{{formData.appointmentTime}}</text>
								<text class="placText" v-else>开始时间</text>
							</view>
						</view>
						<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
					</view>
				</FormTemp>
				<!-- <FormTemp label="到店时间"  borderBottom>
					<view class="fl-ce-sb">
						<view class="fl-ce-sb" style="width: 365rpx;">
							<view @click="openTime('start')">
								<text v-if="formData.startTime">{{formData.startTime}}</text>
								<text class="placText" v-else>开始时间</text>
							</view>
							<text >-</text>
							<view  @click="openTime('end')">
								<text v-if="formData.endTime">{{formData.endTime}}</text>
								<text class="placText" v-else>结束时间</text>
							</view>
						</view>
						<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
					</view>
				</FormTemp> -->
				<FormTemp label="门店" borderBottom>
					<!-- <view @click="selectListFun">
						<up-input v-model="storeName" readonly border="none" fontSize="14" placeholder="请选择门店">
							<template #suffix>
								<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
							</template>
						</up-input>
					</view> -->
					<view class="inputBoooxxx" @click="selectListFun">
						<text class="inputBoooxxx-text1" v-if="storeName">{{storeName}}</text>
						<text class="inputBoooxxx-text2" v-else>请选择门店</text>
						<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
					</view>
				</FormTemp>
			</view>
			<up-datetime-picker :show="timeShow" :minDate="minDate" :title="timeTitle" v-model="timeValue"
				closeOnClickOverlay @cancel="closeTime" @close="closeTime" @confirm="timeConfirm"></up-datetime-picker>
			<up-gap height="15"></up-gap>
		</view>
		<view class="box-foot">
			<view class="btn-yy" @click="myappointment">我的预约</view>
			<view class="btn-tj" @click="sumbit">提交</view>
		</view>
		<BrandSelectPopup ref="brandSelect" @change="brandChange"></BrandSelectPopup>

		<up-popup :show="dealerShow" mode="bottom" @close="prickClose" @open="open" closeable bgColor="#F8F9FB" round="10">
			<view style="width: 100%;height: 80rpx;"></view>
			<scroll-view scroll-y :style="{maxHeight: '50vh'}">
				<view class="store-center">
					<view>
						<view class="store" :class="active==item.id?'activeStyle':''" v-for="(item,index) in columns" :key="index" @click="prickConfirm(item)">
							<view class="store-name">{{item.name}}</view>
							<view class="store-address">{{item.address}}</view>
							<view class="store-box">
								<view class="store-phone">
									<image :src="imgUrl+'static/rgeg.png'" class="phone-icon"></image>	
									{{item.contactNumber}}
								</view>
								<view class="store-distance">
									<image :src="imgUrl+'static/hrt.png'" class="phone-icon"></image>	
									{{item.distance}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</up-popup>
		<PageDurationTracker pageName="租车" type='count'/>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import { timeFormat } from '@/uni_modules/uview-plus';
	import { toNav, toBack } from '@/utils/route';
	import FormTemp from "./components/FormTemp.vue";
	import BrandSelectPopup from '@/components/BrandSelectPopup/index';
	import { imgUrl } from '@/config';
	import { showToast } from "@/utils/util";
	import { onReady } from '@dcloudio/uni-app';
	import { debounce } from '@/utils/common';
	import { addRentCar } from '@/api/rentCar';
	import theme from '@/utils/theme';
	import { selectList } from '@/api/car';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const phoneReg = /^1[3-9]\d{9}$/;
	const uFormRef = ref(null);
	const brandSelect = ref(null);
	const timeShow = ref(false);
	const timeValue = ref<number>(Date.now());
	const minDate = ref<number>(Date.now())
	const timeType = ref('');
	const timeTitle = ref('');
	const brandName = ref<any>('')
	const modelsName = ref<any>('')
	const seriesName = ref<any>('')
	const storeName = ref<any>('')
	const seriesId = ref('');
	const typeId = ref('');
	const columns = ref([]);
	const active= ref();
	const dealerShow = ref(false);
	// 表单引用  

	const formData = reactive({
		name: '',
		phone: '',
		seriesId: '',
		typeId: '',
		appointmentTime: '',
		storeId: '1',
	})
	const barOpen = () => {
		brandSelect.value.open()
	}
	const brandChange = (event) => {
		console.log(event)
		brandName.value = event.brandName
		modelsName.value = event.modelsName
		seriesName.value = event.seriesName
		formData.brandId = event.brandId
		formData.seriesId = event.seriesId
		formData.typeId = event.modelsId
	}


	const sumbit = debounce(() => {
		addRentCarFun()
	}, 300)
	const addRentCarFun = async () => {
		if (!formData.name) {
			uni.showToast({
				title: '请输入姓名',
				icon: 'none',
				duration: 1000
			});
			return
		} else if (!formData.phone) {
			uni.showToast({
				title: '请输入手机号',
				icon: 'none',
				duration: 1000
			});
			return
		} else if (!phoneReg.test(formData.phone)) {
			uni.showToast({
				title: '请输入正确的手机号格式',
				icon: 'none',
				duration: 1000
			});
			return
		} else if (!formData.appointmentTime) {
			uni.showToast({
				title: '请选择到店时间',
				icon: 'none',
				duration: 1000
			});
			return
		} else if (!formData.brandId) {
			uni.showToast({
				title: '请选择品牌',
				icon: 'none',
				duration: 1000
			});
			return
		} else if (!formData.storeId) {
			uni.showToast({
				title: '请选择门店',
				icon: 'none',
				duration: 1000
			});
			return
		}
		let params = {
			name: formData.name,
			phone: formData.phone,
			brandId: formData.brandId,
			seriesId: formData.seriesId,
			typeId: formData.typeId,
			appointmentTime: formData.appointmentTime,
			storeId: formData.storeId
		}
		const res : any = await addRentCar(params);
		if (res.code == 200) {
			uni.showToast({
				title: '预约成功',
				icon: 'success',
				duration: 500
			});
			formData.name = ''
			formData.phone = ''
			brandName.value = ''
			seriesName.value = ''
			modelsName.value = ''
			formData.typeId=''
			formData.appointmentTime = ''
			formData.storeId = ''
			storeName.value = ''
			setTimeout(() => {
				uni.navigateTo({
				  url: '/pages_F/appointment/myAppointment?type='+4
				});
			}, 800)
		}
	};
	const myappointment = () => {
		uni.navigateTo({
			url: '/pages_F/appointment/myAppointment?type='+4
		});
	}
	// 打开时间选择
	const openTime = (type) => {
		console.log(type);
		timeType.value = type;
		if (type == 'start') {
			timeTitle.value = '选择开始时间'
		}
		if (type == 'end') {
			timeTitle.value = '选择结束时间'
		}
		minDate.value = Date.now();
		timeShow.value = true
	}
	const closeTime = () => {
		timeShow.value = false;
		timeType.value = '';
	}
	const timeConfirm = (event) => {
		formData.appointmentTime = timeFormat(event.value, "yyyy-mm-dd hh:MM:ss")
		// if (timeType.value == 'start') {
		// 	formData.appointmentTime = timeFormat(event.value, "yyyy-mm-dd")
		// }
		// if (timeType.value == 'end') {
		// 	formData.endTime = timeFormat(event.value, "yyyy-mm-dd")
		// }
		closeTime()
	};

	const prickClose = () => {
		dealerShow.value = false;
	};
	const open = () => {
		dealerShow.value = true;
	}
	const prickConfirm = (value) => {
		const selectedId = value.id;
		active.value=selectedId
		formData.storeId = selectedId;
		storeName.value = value.name
		prickClose();

	};
	const selectListFun = async () => {
		if(!formData.typeId){
			uni.showToast({
				title: '请选择品牌',
				icon: 'none',
				duration: 500
			});
			return
		}
		let address = uni.getStorageSync('address')
		columns.value = []
		let params = {
			pageNum: 1,
			pageSize: 20,
			typeCode: '4',
			typeId: formData.typeId,
			latitude: address.lat,
			longitude: address.lng
		}
		const res = await selectList(params);
		columns.value=res.rows
		dealerShow.value = true
	}
</script>

<style lang="scss" scoped>
	.inputBoooxxx{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		.inputBoooxxx-text1{}
		.inputBoooxxx-text2{
			color: #C1C5CD;
		}
	}
	.topImg {
		width: 750rpx;
		height: 650rpx;

	}

	.pageView {
		padding: 32rpx;
		box-sizing: border-box;
	}

	.cards {
		width: 100%;
		background: #FFFFFF;
		border-radius: 20rpx;
		position: relative;
		z-index: 1;
		margin-top: -178rpx;
		padding: 0 36rpx;
		box-sizing: border-box;
	}

	.textBut {
		font-weight: 500;
		font-size: 28rpx;
		color: var(--primary-color);
		background: none !important;
		border: none !important;
	}

	.textBut::after {
		border: none;
	}

	.placText {
		font-weight: 500;
		font-size: 28rpx;
		color: #C0C3CB;
	}

	.fixBot {
		// position: fixed;
		// bottom: 0;
		// left: 30rpx;
		// z-index: 9;
		width: 100%;
		background: linear-gradient(0deg, #FFFFFF, #FFF3E0);
		border-radius: 53rpx;
		border: 6rpx solid #FFFFFF;
		padding: 13rpx;
		box-sizing: border-box;

		.fixBot-left {
			.fixBot-left-text {
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
			}

			.price {
				font-weight: 800;
				color: var(--primary-color);
			}
		}

		.fixBot-vut {
			width: 300rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background: var(--primary-color);
			border-radius: 40rpx;
			font-weight: bold;
			font-size: 30rpx;
			color: #FFFFFF;
		}
	}

	.box-car {
		width: 100%;
		height: 100vh;
		background: var(--head-color);
	}

	.box-header {
		position: relative;
	}

	.zccar {
		width: 350rpx;
		height: 250rpx;
		position: absolute;
		right: -8px;
		top: 30%;
	}

	.czxy {
		width: 300rpx;
		height: 60rpx;
		position: absolute;
		left: 50rpx;
		top: 45%;
	}

	.box-text {
		position: absolute;
		left: 50rpx;
		top: 60%;
		color: #666666;
		font-size: 30rpx;
	}

	.box-foot {
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 30rpx;
		position: fixed;
		bottom: 100rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.btn-yy {
		width: 242rpx;
		height: 76rpx;
		background: #FFFFFF;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		border: 2rpx solid var(--primary-color);
		text-align: center;
		line-height: 76rpx;
		font-size: 28rpx;
		color: var(--primary-color);
	}

	.btn-tj {
		width: 398rpx;
		height: 76rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 76rpx;
		background: var(--primary-color);
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		text-align: center;
	}
	.store{
		width: 95%;
		margin: 0 auto 20rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
	}
	.store-box{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.store-name{
		font-size: 30rpx;
		font-weight: bold;
		padding: 10rpx 0;
	}
	.store-address{
		padding:0 0 10rpx;
	}
	.store-box{
		padding-bottom: 10rpx;
	}
	.store-phone,.store-distance{
		display: flex;
		align-items: center;
	}
	.phone-icon{
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	.activeStyle{
		border: 1px solid var(--primary-color);
	}
</style>