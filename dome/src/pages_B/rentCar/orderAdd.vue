<template>
	<view class="">
		<up-navbar title=" " bgColor="transparent" @leftClick="toBack" :placeholder="false" :fixed="true"></up-navbar>
		<image class="topImg" :src="imgUrl+'del/backImg.png'" lazy-load mode=""></image>
		
		<view class="pageView">
			<view class="cards" >
				<FormTemp label="姓名" borderBottom>
					<up-input v-model="formData.name" border="none" fontSize="14" placeholder="请输入您的姓名"></up-input>
				</FormTemp>
				<FormTemp label="手机号码" borderBottom>
					<up-input v-model="formData.tel" border="none" fontSize="14" placeholder="请输入手机号">
						<template #suffix>
							<button class="textBut" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取</button>
						</template>
					</up-input>
				</FormTemp>
				<FormTemp label="品牌" borderBottom>
					<up-input v-model="formData.brandName" readonly border="none" fontSize="14" placeholder="请选择品牌">
						<template #suffix>
							<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
						</template>
					</up-input>
				</FormTemp>
				<FormTemp label="车型" borderBottom>
					<up-input v-model="formData.modelsName" readonly border="none" fontSize="14" placeholder="请选择车型">
						<template #suffix>
							<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
						</template>
					</up-input>
				</FormTemp>
				<FormTemp label="到店时间"  borderBottom>
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
				</FormTemp>
				<FormTemp label="取车地点" borderBottom @cenClick="getChooseLocation('pickLocations')">
					<up-input v-model="formData.pickLocations" readonly border="none" fontSize="14" placeholder="请选择取车地点">
						<template #suffix>
							<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
						</template>
					</up-input>
				</FormTemp>
				<FormTemp label="还车地点" borderBottom @cenClick="getChooseLocation('dropLocations')">
					<up-input v-model="formData.dropLocations" readonly border="none" fontSize="14" placeholder="请选择还车地点">
						<template #suffix>
							<up-icon name="arrow-right" color="#C2C2C2" size="17"></up-icon>
						</template>
					</up-input>
				</FormTemp>
			</view>
			<up-datetime-picker :show="timeShow" :minDate="minDate" :title="timeTitle" v-model="timeValue" closeOnClickOverlay mode="datetime" @cancel="closeTime" @close="closeTime" @confirm="timeConfirm"></up-datetime-picker>
			<up-gap height="15" ></up-gap>
			<view class="fixBot fl-ce-sb">
				<view class="fixBot-left">
					<text class="fixBot-left-text">预计：</text>
					<text class="price fs-26">￥</text>
					<text class="price fs-50">150.00</text>
				</view>
				<view class="fixBot-vut">立即预约</view>
			</view>
		</view>
		
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import {timeFormat} from '@/uni_modules/uview-plus';
	import { toNav,toBack } from '@/utils/route';
	import FormTemp from "./components/FormTemp.vue";
	import {imgUrl} from '@/config';
	import {showToast} from "@/utils/util";
	import { onReady } from '@dcloudio/uni-app';
	const uFormRef = ref(null);
	
	const timeShow = ref(false);
	const timeValue = ref<number>(Date.now());
	const minDate = ref<number>(Date.now())
	const timeType = ref('');
	const timeTitle  = ref('');
	
	// 表单引用  
	
	const formData = reactive({
		name:'',
		tel:'',
		brandName:'',
		modelsName:'',
		storesName:'',
		startTime:'',
		endTime:'',
		pickLocations:'',
		dropLocations:'',
	})
	
	const rules= ref({
		'name': {
		  type: 'string',  
		  required: true,  
		  message: '请填写姓名',  
		  trigger: ['blur', 'change'],  
		},  
	})
	// 获取手机号
	const getPhoneNumber = async (e : any) => {
	
		if (!e.detail) {
			return showToast('获取信息失败，请重试');
		}
		try {
			// 用户拒绝授权
			if (!e.detail?.code) {
				showToast('已取消手机号授权');
				return;
			}
	
			const phoneCode = e.detail.code;
			let loadingShown = false;
	
			try {
				// 显示加载中
				uni.showLoading({
					title: '登录中...',
					mask: true
				});
				loadingShown = true;
	
				// 1. 获取微信登录code
				const wxCode = await getWxLoginCode();
				console.log('获取到的wxCode', wxCode);
				uni.hideLoading();
			} finally {
				if (loadingShown) {
					uni.hideLoading();
				}
			}
		} catch (err : any) {
			console.log('登录过程出错', err);
			showToast(err?.message || '登录失败',3000);
		}
	};
	const getWxLoginCode = () : Promise<string> => {
		return new Promise((resolve, reject) => {
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin', 
				success: (res) => {
					if (res?.code) {
						resolve(res.code);
					} else {
						reject(new Error('未返回 code'));
					}
				},
				fail: (e) => {
					reject(e);
				}
			});
			// #endif
	
			// #ifndef MP-WEIXIN
			reject(new Error('非小程序环境'));
			// #endif
		});
	};
	// 打开时间选择
	const openTime = (type)=>{
		console.log(type);
		timeType.value = type;
		if(type == 'start'){
			timeTitle.value = '选择开始时间'
		}
		if(type == 'end'){
			timeTitle.value = '选择结束时间'
		}
		minDate.value = Date.now();
		timeShow.value = true
	}
	const closeTime= ()=>{
		timeShow.value = false;
		timeType.value = '';
	}
	const timeConfirm = (event)=>{
		if(timeType.value == 'start'){
			formData.startTime = timeFormat(event.value,"yyyy-mm-dd")
		}
		if(timeType.value == 'end'){
			formData.endTime = timeFormat(event.value,"yyyy-mm-dd")
		}
		closeTime()
	};
	
	// 选择地址
	const getChooseLocation = (fied:string) => {
		uni.chooseLocation({
			success: (res) => {
				formData[fied] = res.address
			},
			fail: (error) => {
				console.error('获取位置失败：', error);
				showToast('获取位置失败：', error);
			}
		});
	}
</script>

<style lang="scss" scoped>
	
	.topImg{
		width: 750rpx;
		height: 750rpx;
		
	}
	.pageView{
		padding: 32rpx;
		box-sizing: border-box;
	}
	.cards{
		width: 100%;
		background: #FFFFFF;
		border-radius: 20rpx;
		position: relative;
		z-index: 1;
		margin-top: -148rpx;
		padding: 0 36rpx;
		box-sizing: border-box;
	}
	.textBut{
		font-weight: 500;
		font-size: 28rpx;
		color: #FF9600;
		background: none !important;
		border: none !important ;
	}
	.textBut::after {
		border: none;
	}
	.placText{
		font-weight: 500;
		font-size: 28rpx;
		color: #C0C3CB;
	}
	
	.fixBot{
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
		.fixBot-left{
			.fixBot-left-text{
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
			}
			.price{
				font-weight: 800;
				color: #FF9600;
			}
		}
		.fixBot-vut{
			width: 300rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			border-radius: 40rpx;
			font-weight: bold;
			font-size: 30rpx;
			color: #FFFFFF;
		}
	}
</style>