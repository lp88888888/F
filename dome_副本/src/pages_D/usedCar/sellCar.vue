<template>
	<view class="page-container" :data-theme="pageTheme" >
		<up-navbar title="高价卖车" bgColor='transparent' @leftClick="toBack" placeholder :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="pageView">
			<up-image :src="imgUrl+'static/old-car-sell-top.png'" width="690rpx" height="250rpx" lazyLoad></up-image>
			<view class="iconBox">
				<view class="iconBox-item">
					<image :src="imgUrl+'static/old-car-sell-select-icon.png'"/>
					<text>上门检车</text>
				</view>
				<view class="iconBox-item">
					<image :src="imgUrl+'static/old-car-sell-select-icon.png'"/>
					<text>全场免费</text>
				</view>
				<view class="iconBox-item">
					<image :src="imgUrl+'static/old-car-sell-select-icon.png'"/>
					<text>平台交易0风险</text>
				</view>
			</view>
			<view class="card m-t-40">
				<view class="titleBox">卖车地区</view>
				<view class="input" @click="handleCloseAddressPicker('open');">
					<up-input placeholder="请选择地区" readonly border="none" v-model="formData.address">
						<template  #suffix>
							<up-icon name="arrow-right" size="16"></up-icon>
						</template>
					</up-input>
				</view>
				<view class="titleBox">
					<image
					:src="imgUrl+'static/old-car-sell-tel-icon.png'"
					mode="scaleToFill"
				/> 电话</view>
				<view class="input">
					<up-input placeholder="请输入电话" border="none" maxlength="11" v-model="formData.phone"></up-input>
				</view>
				<view class="butIcon2" @click="submit">免费高价卖车</view>
			</view>
			<view class="tishi" @click="check = !check">
				<image
					:src="`${imgUrl}static/${check?'cart-checked':'cart-check'}.png`"
					mode="scaleToFill"
				/>
				<view class="tishi-text">已阅读并同意 《个人信息保护声明》，提交后将会有1-3家服务商为您提供报价服务。</view>
			</view>
		</view>
		
		<up-popup :show="showAddressPicker" round="20" @close="handleCloseAddressPicker">
			<view>
				<Address :onCallParent="handleCloseAddressPicker" @select-address="handleSelectAddress"></Address>
			</view>
		</up-popup>
		<popSuccess v-if="successShow" @close="successShow = false;toBack(1)"></popSuccess>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed,reactive} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import { debounce, toast} from '@/utils/common';
	import { isPhoneAvailable ,showToastSuccess} from '@/utils/util';
	import {imgUrl} from '@/config';
	import { addPrSaleOldCar } from '@/api/oldCar';
	import popSuccess from './components/success.vue';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	import Address from '@/pages_D/newCar/components/Address.vue';
	const showAddressPicker = ref(false);
	const successShow = ref(false);
	const formData = reactive({
		phone: '',
		address:'',
		saleProvince: '',
		saleCity: '',
		saleArea:'',
	});
	const check = ref(true);
	const cityOpen = ()=>{
		handleCloseAddressPicker('open');
	}
	const handleCloseAddressPicker = (msg: string) => {
		showAddressPicker.value = false
		 if (msg == 'open') {
			showAddressPicker.value = true;
		}
	};
	const handleSelectAddress = (address) => {
		const {province,city,district} = address;
		formData.address = `${province}${city}${district}`;
		formData.saleProvince = province;
		formData.saleCity = city;
		formData.saleArea = district;
		handleCloseAddressPicker('close');
	}
	const submit = debounce(async ()=>{
		
		if(!check.value) return toast('请选择同意协议');
		if(!formData.saleProvince) return toast('请选择地区');
		if(!formData.phone) return toast('请输入手机号');
		if(!isPhoneAvailable(formData.phone)) return toast('输入的手机号格式不正确');
		try{
			let res = await addPrSaleOldCar(formData);
			if(res.code === 200){
				// showToastSuccess('提交成功');
				successShow.value = true;
				// setTimeout(()=>{
				// 	toBack(1)
				// },2000)
			}else{
				toast(res.msg);
			}
		}catch(e){
			toast('提交失败，请稍后重试');
		}
	},300)
</script>

<style lang="scss" scoped>
	.page-container{
		width: 750rpx;
		min-height: 100vh;
		background: var(--head-color);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
	}
	.pageView{
		padding: 30rpx;
		box-sizing: border-box;
	}
	.iconBox{
		margin-top: 30rpx;
		width: 100%;
		height: 80rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 266rpx ;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.iconBox-item{
			display: flex;
			font-weight: 500;
			font-size: 26rpx;
			color:var(--primary-color);
			line-height: 28rpx;
			image{
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
		}
	}
	.card{
		width: 100%;
		padding: 40rpx 46rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
	}
	.tishi{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		image{
			width: 32rpx;
			height: 32rpx;
			margin-right: 10rpx;
			margin-top: 10rpx;
		}
		.tishi-text{
			width: calc(100% - 52rpx);
			font-weight: 400;
			font-size: 24rpx;
			color: #999999;
			line-height: 48rpx;
		}
	}
	.titleBox{
		display: flex;
		align-items: center;
		font-weight: 500;
		font-size: 32rpx;
		color: #333333;
		line-height: 36rpx;
		image{
			width: 36rpx;
			height: 36rpx;
			margin-right: 10rpx;
		}
	}
	.input{
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
		height: 80rpx;
		display: flex;
		align-items: center;
		background: #F4F4F4;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		margin: 30rpx 0;
	}
		.butIcon2 {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			border: 1px solid transparent;
			background: var(--primary-color);
			color: #FFFFFF;
		}
</style>