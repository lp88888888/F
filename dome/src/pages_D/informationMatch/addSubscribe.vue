<template>
	<view class="" :data-theme="pageTheme"  >
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="topView">
				<up-navbar bgColor="none" title="添加订阅路线" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
			</view>
		</u-sticky>
		<view class="pageView">
			<view class="card inpView">
				<view class="inpView-icon">
					<view class="inpView-icon-item" style="background: #222836;">装</view>
					<view class="inpView-icon-line"></view>
					<view class="inpView-icon-item" style="background: #FF9600;">卸</view>
				</view>
				<view class="inpView-cente">
					<view class="inpView-cente-item" @click="type='start';toNav('/pages_A/address/city')">
						<text class="inpView-cente-item-text" v-if="formData.startAdress">{{formData.startAdress}}</text>
						<text class="inpView-cente-item-textPlod" v-else>请选择装货地址</text>
						<up-icon name="arrow-right" color="#999999" size="12"></up-icon>
					</view>
					<up-gap height="12"></up-gap>
					<view class="inpView-cente-item" @click="type='end';toNav('/pages_A/address/city')">
						<text class="inpView-cente-item-text" v-if="formData.endAdress">{{formData.endAdress}}</text>
						<text class="inpView-cente-item-textPlod" v-else>请选择卸货地址</text>
						<up-icon name="arrow-right" color="#999999" size="12"></up-icon>
					</view>
				</view>
			</view>
			<up-gap height="10"></up-gap>
			<view class="card">
				<view class="title">
					<view class="title-item">车长</view>
					<view class="title-butText" @click="clear('len')">清空</view>
				</view>
				<view class="cenGrid">
					<view :class="['cenGrid-item',bodyworkLen == item.value?'gridActive':'']" v-for="(item,index) in options1" :key="index" @click="selectClick(item,'len')">{{item.label}}</view>
				</view>
			</view>
			<up-gap height="10"></up-gap>
		<!-- 	<view class="card">
				<view class="title">
					<view class="title-item">车型<text>（单选）</text></view>
					<view class="title-butText" @click="clear('ty')">清空</view>
				</view>
				<view class="cenGrid">
					<view :class="['cenGrid-item',formData.carType == item.label?'gridActive':'']" v-for="(item,index) in options2" :key="index" @click="selectClick(item,'ty')">{{item.label}}</view>
				</view>
			</view> -->
			
			<view class="fixedBut">
				<view class="fixedBut-item" @click="submit">确认添加</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import { debounce,toast } from '@/utils/common'
	import {addPrSupplyRouteSubscription,getPrSupplyRouteSubscription} from '@/api/premium';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const type  = ref<'start'|'end'>('start'); // start/end
	interface FormData {
		startAdress?:string;
		endAdress?:string;
		loadingProvince?:string;
		loadingCity?:string;
		loadingDistrict?:string;
		unloadingProvince?:string;
		unloadingCity?:string;
		unloadingDistrict?:string;
		bodyworkLenMin?:string;
		bodyworkLenMax?:string;
		carType?:string;
		loadingProvinceName?:string;
		loadingCityName?:string;
		loadingDistrictName?:string;
		unloadingProvinceName?:string;
		unloadingCityName?:string;
		unloadingDistrictName?:string;
	}
	const formData = ref<FormData>({
		startAdress:'', // 装货地址名称
		endAdress:'',// 卸货地址名称
		loadingProvince:'',// 装货地省
		loadingCity:'',// 装货地市
		loadingDistrict:'',// 装货地区
		unloadingProvince:'',// 卸货地省	
		unloadingCity:'',// 卸货地市	
		unloadingDistrict:'',// 卸货地区	
		bodyworkLenMin:'',// 车身最小长度
		bodyworkLenMax:'',// 车身最大长度
		// carType:'',// 车型
		loadingProvinceName:'',
		loadingCityName:'',
		loadingDistrictName:'',
		unloadingProvinceName:'',
		unloadingCityName:'',
		unloadingDistrictName:'',
	});
	const mySubscribeDetail=ref({})
	const options1= ref([
		{label: '6.9米以下',value:'0-6.9'},{label: '7-9.9米',value:'7-9.9'},{label: '11米以上',value:'11-99'}
	])
	const options2= ref([
		{label: '半挂'},{label: '侧翻半挂'},{label: '自卸'},{label: '高栏吨车'},{label: '前四后八'}
	])
	const bodyworkLen = ref(''); //车长选择
	
	// 提交
	const submit = debounce(async () => {
		if(!formData.value.loadingProvince) return toast('请选择装货地址');
		if(!formData.value.unloadingProvince) return toast('请选择卸货地址');
		if(!bodyworkLen.value) return toast('请选择车长');
		// if(!formData.value.carType) return toast('请选择车型');
		let arr = bodyworkLen.value.split('-')
		formData.value.bodyworkLenMin = arr[0]
		formData.value.bodyworkLenMax = arr[1]
		console.log(formData.value);
		try{
			let res = await addPrSupplyRouteSubscription(formData.value);
			if(res.code == 200 || res.code == 0){
				toast('提交成功');
				toBack(1)
			}else{
				toast(res.msg);
			}
		}catch(err){
			console.log(err);
		}
		// toBack(1)
	}, 300);
	
	// 选择车型，车长
	const selectClick = (item,type:'len'|'ty') =>{
		if(type == 'len'){
			bodyworkLen.value = item.value;
		}
		if(type == 'ty'){
			formData.value.carType = item.label;
		}
	}
	// 清空列表
	const clear = (type:'len'|'ty')=>{
		if(type == 'len'){
			bodyworkLen.value = '';
		}
		if(type == 'ty'){
			formData.value.carType = ''
		}
	}
	onShow(() => {
		// #ifdef APP
		if (uni.getStorageSync('appaddress')) {
			const addr = uni.getStorageSync('appaddress')
			setSelectedAddress(addr)
			uni.removeStorageSync('appaddress')
		}
		// #endif
	
	})
	// 定义接收地址的方法，供下一页调用
	const setSelectedAddress = (selectedAddress : any) => {
		// 保存接收的地址数据
		console.log(type.value,"selectedAddress",selectedAddress);
		if(type.value == 'start'){
			formData.value.startAdress = selectedAddress.province + '-' + selectedAddress.city + '-' + selectedAddress.district;
			formData.value.loadingProvinceName = selectedAddress.province
			formData.value.loadingCityName = selectedAddress.city
			formData.value.loadingDistrictName = selectedAddress.district
			
			formData.value.loadingProvince = selectedAddress.provinceCode
			formData.value.loadingCity = selectedAddress.cityCode
			formData.value.loadingDistrict = selectedAddress.code || selectedAddress.districtCode
			
		}
		if(type.value == 'end'){
			formData.value.endAdress = selectedAddress.province + '-' + selectedAddress.city + '-' + selectedAddress.district
			
			formData.value.unloadingProvinceName = selectedAddress.province
			formData.value.unloadingCityName = selectedAddress.city
			formData.value.unloadingDistrictName = selectedAddress.district
			formData.value.unloadingProvince = selectedAddress.provinceCode
			formData.value.unloadingCity=selectedAddress.cityCode
			formData.value.unloadingDistrict=selectedAddress.code || selectedAddress.districtCode
			
		}
	}
	// 查询订阅路线
	const getUserPro =async()=>{
		try{
			const res : any = await getPrSupplyRouteSubscription()
			if(res.data && res.code == 200){
				mySubscribeDetail.value = res.data
				
				for(let key in formData.value){
					formData.value[key] = res.data[key];
				}
				formData.value.startAdress = res.data.loadingProvinceName?`${res.data.loadingProvinceName}-${res.data.loadingCityName}-${res.data.loadingDistrictName}`:'' // 装货地址名称
				formData.value.endAdress = res.data.unloadingProvinceName?`${res.data.unloadingProvinceName}-${res.data.unloadingCityName}-${res.data.unloadingDistrictName}`:"" // 卸货地址名称
				// bodyworkLen.value = res.data.bodyworkLenMax?`${res.data.bodyworkLenMin}-${res.data.bodyworkLenMax}`:''
				bodyworkLen.value = `${res.data.bodyworkLenMin || 0}-${res.data.bodyworkLenMax}`
			}
		}catch(error){
			console.error('提交订阅路线失败:', error);
			// toast('提交失败，请重试');
		}
	}
	onLoad(()=>{
		getUserPro()
	});
	
	defineExpose({
		setSelectedAddress
	})
</script>

<style lang="scss" >
	page{
		background: #F1EFEC;
	}
	.pageView{
		padding: 32rpx;
		box-sizing: border-box;
	}
	.inpView{
		display: flex;align-items: center;
		justify-content:space-between;
		.inpView-icon{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.inpView-icon-item{
				width: 38rpx;
				height: 38rpx;
				border-radius: 8rpx;
				font-weight: 500;
				font-size: 24rpx;
				color: #FFFFFF;
				line-height: 38rpx;
				text-align: center;
			}
			.inpView-icon-line{
				width: 1rpx;
				height: 82rpx;
				border-left: 1px dashed #666666;
				// margin-left: 18rpx;
				margin: 10rpx 0;
			}
		}
		.inpView-cente{
			
			.inpView-cente-item{
				width: 562rpx;
				height: 110rpx;
				background: #F5F5F5;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx;
				box-sizing: border-box;
				.inpView-cente-item-text{
					font-weight: 500;
					font-size: 28rpx;
					color: #000000;
				}
				.inpView-cente-item-textPlod{
					font-weight: 500;
					font-size: 28rpx;
					color: #BBBBBB;
				}
			}
		}
	}
	.card{
		width: 100%;
		padding: 36rpx 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
	}
	.title{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.title-item{
			display: flex;
			align-items: center;
			
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
			text{
				font-weight: 500 !important;
				color: #999999 !important;
			}
		}
		.title-butText{
			font-weight: 500;
			font-size: 24rpx;
			color: #999999;
		}
	}
	
	.cenGrid{
		padding: 30rpx 0;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(4,1fr);
		grid-gap: 22rpx;
		.cenGrid-item{
			width: 100%;
			height: 67rpx;
			line-height: 67rpx;
			text-align: center;
			font-weight: 500;
			font-size: 26rpx;
			color: #333333;
			background: #F5F5F5;
			border-radius: 12rpx;
			border: 1px solid #F5F5F5;
		}
		.gridActive{
			background: #FDF9F5;
			border-radius: 16rpx;
			border: 1px solid var(--primary-color);
			color: var(--primary-color);
		}
	}
	.topView{
		width: 750rpx;
		background: var(--head-color);
	}
	.fixedBut{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: 15rpx 32rpx 55rpx 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		.fixedBut-item{
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			border-radius: 44rpx;
			text-align: center;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
		}
	}
	
	::v-deep .u-navbar__content{
		background: none !important;
	}
</style>