<template>
	<view class="page-container"  :data-theme="pageTheme">
	<up-sticky :bgColor="navBgColor">
			<up-navbar title="车辆估价" bgColor='none' @leftClick="toBack" placeholder :fixed="true"
				:titleStyle="{fontWeight: 'bold'}"></up-navbar>
			
	</up-sticky>
		<view class="pageView">
			<view class="title">免费估值 精准报价</view>
			<view class="titleText m-t-20">累计服务99万位车主</view>
			<view class="cardBox m-t-30">
				<view class="cardBox-title m-b-20">为爱车估值</view>
				<view v-if="formData.brandId" class="cardBox-car  m-b-20" @click="brandOpen">
					<image :src="carImg?carImg:imgUrl+'del/car-img.png'" class="cardBox-car-img"/>
					<view class="cardBox-car-center">
						<view class="titleFont">{{ formData.seriesName }}</view>
						<view class="textFont">{{ formData.typeName }}</view>
					</view>
					<up-icon name="arrow-right" size="16"></up-icon>
				</view>
				<view v-else class="formView m-t-20" @click="brandOpen">
					<view class="formData-label">车型</view>
					<view class="formData-center">
						<view class="inputBoooxxx">
							<text class="inputBoooxxx-text1" v-if="formData.typeName">{{formData.typeName}}</text>
							<text class="inputBoooxxx-text2" v-else>请选择车型</text>
							<up-icon name="arrow-right" size="16"></up-icon>
						</view>
						<!-- <up-input placeholder="请选择车型" readonly border="none" v-model="formData.typeName">
							<template #suffix>
								<up-icon name="arrow-right" size="16"></up-icon>
							</template>
						</up-input> -->
					</view>
				</view> 
				<u-line></u-line>
				<view class="formView m-t-20" @click="timeShow = true">
					<view class="formData-label">上牌时间</view>
					<view class="formData-center">
						<view class="inputBoooxxx">
							<text class="inputBoooxxx-text1" v-if="formData.upLicenseTime">{{formData.upLicenseTime}}</text>
							<text class="inputBoooxxx-text2" v-else>请选择上牌时间</text>
							<up-icon name="arrow-right" size="16"></up-icon>
						</view>
						<!-- <up-input placeholder="请选择上牌时间" readonly border="none" v-model="formData.upLicenseTime">
							<template  #suffix>
								<up-icon name="arrow-right" size="16"></up-icon>
							</template>
						</up-input> -->
					</view>
				</view> 
				<view class="formView" >
					<view class="formData-label">表显里程</view>
					<view class="formData-center">
						<up-input placeholder="请选择表显里程" type='digit' border="none" v-model="formData.mileage" maxlength="5">
							<template  #suffix>
								万/公里
							</template>
						</up-input>
					</view>
				</view> 
				<view class="formView" @click.native="addressFun()" >
					<view class="formData-label">上牌城市</view>
					<view class="formData-center">
						<view class="inputBoooxxx">
							<text class="inputBoooxxx-text1" v-if="formData.upLicenseCity">{{formData.upLicenseCity}}</text>
							<text class="inputBoooxxx-text2" v-else>请选择上牌城市</text>
							<up-icon name="arrow-right" size="16"></up-icon>
						</view>
						<!-- <up-input placeholder="请选择上牌城市" readonly  border="none" v-model="formData.upLicenseCity">
							<template  #suffix>
								<up-icon name="arrow-right" size="16"></up-icon>
							</template>
						</up-input> -->
					</view>
				</view> 
				<view class="formView" @click.native="handleCloseAddressPicker('open','')">
					<view class="formData-label">估值地区</view>
					<view class="formData-center">
						<view class="inputBoooxxx">
							<text class="inputBoooxxx-text1" v-if="formData.address">{{formData.address}}</text>
							<text class="inputBoooxxx-text2" v-else>请选择估值地区</text>
							<up-icon name="arrow-right" size="16"></up-icon>
						</view>
						<!-- <up-input placeholder="请选择估值地区" readonly border="none" v-model="formData.address">
							<template  #suffix>
								<up-icon name="arrow-right" size="16"></up-icon>
							</template>
						</up-input> -->
					</view>
				</view> 
			</view>
			<view class="cardBox m-t-30">
				<view class="cardBox-title m-b-20">估值流程</view>
				<view class="fl-ce-sb" style="padding:0 30rpx;">
					<view class="ItemBox">
						<image :src="imgUrl+'static/oldCar-appr-icon-1.png'" />
						<text>填写信息</text>
					</view>
					<view class="ItemBox">
						<image :src="imgUrl+'static/oldCar-appr-icon-2.png'" />
						<text>免费检验</text>
					</view>
					<view class="ItemBox">
						<image :src="imgUrl+'static/oldCar-appr-icon-3.png'" />
						<text>精准报价</text>
					</view>
				</view>
			</view>
			<view class="cardBox m-t-30">
				<view class="cardBox-title m-b-20">车主权益</view>
				<view class="fl-ce-sb" style="padding:0 30rpx;">
					<view class="ItemBox">
						<image :src="imgUrl+'static/oldCar-appr-icon-4.png'" />
						<text>一键提交</text>
					</view>
					<view class="ItemBox">
						<image :src="imgUrl+'static/oldCar-appr-icon-5.png'" />
						<text>零费用</text>
					</view>
					<view class="ItemBox">
						<image :src="imgUrl+'static/oldCar-appr-icon-6.png'" />
						<text>精准估算</text>
					</view>
				</view>
			</view>
		</view>
		<view class="fixeView">
			<view class="fixeView-item" @click="submit">免费估价</view>
		</view>
		<up-gap height="90"></up-gap>
		<BrandSelectPopup ref="brandSelectRef" @change="brandChange"></BrandSelectPopup>
		<u-picker :show="dealerShow" :columns="columns" keyName="label" :confirmColor="themeStore.themeColors.$primaryColor" @close="prickClose" @cancel="prickClose" @confirm="prickConfirm" ></u-picker>
		<up-datetime-picker :show="timeShow" v-model="timeValue" :minDate="815788800000" closeOnClickOverlay mode="date" @cancel="timeClose" @close="timeClose" @confirm="timeConfirm" ></up-datetime-picker>
		<up-popup :show="showAddressPicker" round="20" @close="handleCloseAddressPicker">
			<view>
				<Address :type="addressType" :onCallParent="handleCloseAddressPicker" @select-address="handleSelectAddress"></Address>
			</view>
		</up-popup>
		<popSuccess v-if="successShow" @close="successShow = false;toBack(1)"></popSuccess>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed,reactive} from 'vue';
	import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
	import { toNav,toBack } from '@/utils/route';
	import { debounce, toast} from '@/utils/common';
	import BrandSelectPopup from '@/components/BrandSelectPopup/index.vue';
	import popSuccess from './components/success.vue';
	import {timeFormat} from '@/uni_modules/uview-plus';
	import {imgUrl} from '@/config';
	import Address from '@/pages_D/newCar/components/Address.vue';
	import { addPrEvaluate } from '@/api/oldCar';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const showAddressPicker = ref(false);
	const brandSelectRef = ref(null);
	const successShow = ref(false);
	const navBgColor  = ref('transparent')
	const formData = reactive({
		brandName:'',
		seriesName:'',
		typeName:'',
		brandId:'',
		seriesId:'',
		typeId:'',
		mileage:'',//表显里程
		mileageName:'',// 表显里程名称
		upLicenseTime:'',//上牌时间
		upLicenseCity:'',//上牌城市
		address:'',
		evaluateProvince:'',//估价省份
		evaluateCity:'',//估价城市
		evaluateArea:null,//估价区县
	});
	const carImg = ref('')
	const dealerShow = ref(false);
	const columns = ref([
		[{value:0.5,label:'0.5万'},{value:1,label:'1万'},{value:2,label:'2万'},{value:3,label:'3万'},{value:4,label:'4万'},{value:5,label:'5万'},{value:6,label:'6万'},{value:7,label:'7万'},{value:8,label:'8万'},{value:9,label:'9万'},{value:10,label:'10万'},{value:11,label:'11万'},{value:12,label:'12万'},{value:13,label:'13万'},{value:14,label:'14万'},{value:15,label:'15万'},{value:16,label:'16万'},{value:17,label:'17万'},{value:18,label:'18万'},{value:19,label:'19万'},{value:20,label:'20万'},{value:21,label:'21万'},{value:22,label:'22万'},{value:23,label:'23万'},{value:24,label:'24万'},{value:25,label:'25万'},{value:26,label:'26万'},{value:27,label:'27万'},{value:28,label:'28万'},{value:29,label:'29万'},{value:30,label:'30万'},{value:31,label:'31万'},{value:32,label:'32万'},{value:33,label:'33万'},{value:34,label:'34万'},{value:35,label:'35万'},{value:36,label:'36万'},{value:37,label:'37万'},{value:38,label:'38万'},{value:39,label:'39万'},{value:40,label:'40万'},{value:41,label:'41万'},{value:42,label:'42万'},{value:43,label:'43万'},{value:44,label:'44万'}]
	])
	
	const timeShow = ref(false)
	const timeValue = ref<Date>(new Date())
	const addressType = ref('');
	const timeClose = ()=>{
		timeShow.value = false;
	}
	const timeConfirm = (event)=>{
		timeValue.value = event.value
		formData.upLicenseTime = timeFormat(event.value,'yyyy-mm-dd')
		timeClose()
	}
	const prickClose = ()=>{
		dealerShow.value = false;
	};
	const prickConfirm = (event)=>{
		const {value} = event;
		formData.mileage = value[0].value;
		formData.mileageName = value[0].label;
		prickClose();
	};
	onShow(() => {
		// #ifdef APP
		if (uni.getStorageSync('appaddress')) {
			const addr = uni.getStorageSync('appaddress')
			setSelectedAddress(addr)
			uni.removeStorageSync('appaddress')
		}
		// #endif
	
	})
	onPageScroll((e) => {
		let bag=''
		if(pageTheme.value=='green'){
			bag='#edf8f0'
		}else{
			bag='#c0e1ff'
		}
		
		if(e.scrollTop > 10){
			navBgColor.value = bag
		}else{
			navBgColor.value = 'transparent'
		}
	
	})
	// 定义接收地址的方法，供下一页调用
	const setSelectedAddress = (selectedAddress : any) => {
		formData.upLicenseCity = selectedAddress.city 
	}
	const addressFun=()=>{
		uni.navigateTo({
			url:"/pages_A/address/city"
		})
	}
	const handleCloseAddressPicker = (msg: string,type:string='') => {
		showAddressPicker.value = false
		addressType.value = type;
		 if (msg == 'open') {
			showAddressPicker.value = true;
		}
	};
	const handleSelectAddress = (address) => {
		const {province,city,district} = address;
		if(addressType.value == 'city'){
			formData.upLicenseCity = city;
		}else{
			formData.address = `${province}${city}${district || ''}`;
			formData.evaluateProvince = province;
			formData.evaluateCity = city;
			formData.evaluateArea = district;
		}
		handleCloseAddressPicker('close');
	}
	const brandOpen = (type:string)=>{
		// addressType.value = type;
		brandSelectRef.value.open()
	}
	const brandChange = (event)=>{
		console.log("object", event)
		const {brandName,seriesName,modelsName,brandId,seriesId,modelsId,models} = event;
		formData.brandName = brandName
		formData.seriesName = seriesName
		formData.typeName = modelsName
		formData.brandId = brandId
		formData.seriesId = seriesId
		formData.typeId = modelsId
		if(models){
			carImg.value = models.picture
		}
	};
	const submit = debounce(async () => {
		if(!formData.brandId) return toast('请选择车型');
		if(!formData.upLicenseTime) return toast('请选择上牌时间');
		if(!formData.mileage) return toast('请选择表显里程');
		if(!formData.upLicenseCity) return toast('请选择上牌城市');
		if(!formData.evaluateProvince) return toast('请选择估值地区');
		formData.mileageName=formData.mileage+'万'
		try{
			const res = await addPrEvaluate(formData)
			if(res.code === 200){
				successShow.value = true;
				uni.setStorageSync('selectedAddress', '');
			}else{
				toast(res.msg)
			}
		}catch(err){
			console.log("err", err)
		}
	}, 300)
	
	defineExpose({
		setSelectedAddress
	})
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


	.page-container{
		width: 750rpx;
		min-height: 100vh;
		background: var(--head-color);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
	}
	.pageView{
		padding: 32rpx;
		box-sizing: border-box;
		
	}
	.ItemBox{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		image{
			width: 100rpx;
			height: 100rpx;

		}
		text{
			font-weight: 400;
			font-size: 28rpx;
			color: #333333;
			line-height: 48rpx;
			margin-top: 8rpx;
		}
	}
	.cardBox-car{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.cardBox-car-img{
			width: 220rpx;
			height: 160rpx;
		}
		.cardBox-car-center{
			width: calc(100% - 240rpx - 40rpx);
			.titleFont{
				font-weight: 500;
				font-size: 32rpx;
				color: #333333;
				line-height: 48rpx;
			}
			.textFont{
				font-weight: 400;
				font-size: 28rpx;
				color: #999999;
				line-height: 48rpx;
			}
		}
	}
	.formView {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;

		.formData-label {
			width: 160rpx;
			// font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}
		.formData-center{
			width: calc(100% - 160rpx);
		}
	}
	.title{
		font-weight: 600;
		font-size: 68rpx;
		color: #333333;
		line-height: 78rpx;
		text-align: center;
	}
	.titleText{
		font-weight: 500;
		font-size: 28rpx;
		color: #666666;
		line-height: 28rpx;
		text-align: center;
	}
	.cardBox{
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0,0,0,0.05);
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		padding: 34rpx 38rpx;
		box-sizing: border-box;
		.cardBox-title{
			font-weight: 500;
			font-size: 32rpx;
			color: #333333;
			line-height: 48rpx;
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
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0,0,0,0.03);

		.fixeView-item {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			border: 1px solid transparent;
			background:var(--primary-color);
			color: #FFFFFF;
		}

	}
</style>