<template>
	<up-popup :show="show" mode="center" round="5" @open="open">
		<view class="layer-input" :style="{background: `url('${imgUrl}/layer-login-bg.png') no-repeat;`}" :data-theme="pageTheme" >
		    <view class="login-title tex36_33_b">ETC发票服务授权</view>
		    <view class="cell">
		        <input class="tex32_33" disabled v-model="mobile" placeholder-class="tex28_99" placeholder="请输入手机号码" type="number" />
		    </view>
		    <view class="cell">
		        <input class="tex28_33" v-model="vertifiCode" placeholder-class="tex28_99" placeholder="请输入验证码" type="number" maxlength="8" @input="getInput"  />
		        <text @click="getVertifyCode">{{(count == 60||count <=0) ? '获取验证码' :count+'s'}}</text>
		    </view>
		    <view class="btns" @click="commit">授权</view>
		    <!-- <image v-if="shwoClose" class="icClose" :src="`${imgUrl}/ic_close.png`" @click="closePop" /> -->
			<view class="icClose" v-if="shwoClose" @click="closePop">
				<up-icon name="close-circle" size="20"></up-icon>
			</view>
			
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import {ref} from 'vue';
	// import { imgUrl } from '@/config';
	const imgUrl = ref('https://tranalioss.shanyitong.com');
	import { etcInvoice } from '@/api/etcInvoice';
	import {isEmpty,showToast,hideLoading,isPhoneAvailable,showLoading} from '@/utils/util';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	import { useAppStore } from '@/store/modules/app';
	const appStore = useAppStore();
	const emits = defineEmits(["closePop","loginSuc"]);
	
	const props = defineProps({
		phone:{
			type:String,
			default:false,
		},
		shwoClose:{
			type:Boolean,
			default:true,
		},
	});
	
	const show = ref(true);
	// const mobile = ref('18509342729');
	// const mobile = ref('13279387030');
	
	//const mobile = ref('13109518617');
	const mobile = ref(props.phone);
	const vertifiCode = ref('');
	const count = ref(60);
	
	const closePop = ()=>{
		
		vertifiCode.value = ''
		emits('closePop');
	}
	const open = ()=>{
		// mobile.value=uni.getStorageSync('userInfo').mobile
		// mobile.value='18309225622'
	}
	
	const getVertifyCode =() =>{
	  if (count.value < 60) {
	    return
	  }
	  if (isEmpty(mobile.value)) {
	    showToast('请输入手机号')
	    return
	  } else if (!isPhoneAvailable(mobile.value)) {
	    showToast('手机号码格式有误')
	    return
	  }
	  var params = {
	    serverUrl: 'appAuthMobileRequest',
	    mobile: mobile.value
	  }
	  showLoading()
	  etcInvoice(params).then(res=>{
		  hideLoading();
		  showToast('验证码已发送~');
		  startTimer();
	  }).catch(err =>{
		  hideLoading()
		  showToast(err);
	  })
	 
	}
	const startTimer=()=> {
	  
	  var timer = setInterval(function () {
	    let newCou = count.value - 1
		count.value = newCou
	    if (newCou <= 0) {
	      stopTimer(timer);
		  count.value = 60
	    }
	  }, 1000)
	}
	const stopTimer=(timer)=> {
	  clearInterval(timer)
	}
	
	const getInput=(e) =>{
	  vertifiCode.value = e.detail.value
	}
	const commit=()=> {
	  if (isEmpty(mobile.value)) {
	    showToast('请输入手机号')
	    return
	  }
	  if (isEmpty(vertifiCode.value)) {
	    showToast('请输入验证码')
	    return
	  }
	  
	  var params = {
		serverUrl: 'appAuthLoginRequest',
	    mobile: mobile.value,
	    validCode: vertifiCode.value,
	  }
	  showLoading();
	  
	  etcInvoice(params).then(res=>{
		 hideLoading()
		 if(res.data.ticketId){
			 let result = {
			   ticketId: res.data.ticketId,
			   mobile: mobile.value
			 }
			 appStore.updateEtcUserInfo(result)
			 emits('loginSuc',result);
			 closePop()
		 }else{
			 showToast(res.data.msg)
		 }
		 
	  }).catch(err =>{
		 hideLoading()
		 showToast(err)
	  })
	  
	}
	
	defineExpose({ open, close: closePop })
</script>

<style lang="scss" scoped>
	.layer-input {
	    width: 620rpx;
	    height: 566rpx;
	    background-color: #fff;
	    border-radius: 10rpx;
	    
	    background-size: 100% 100%;
	    padding: 0 36rpx;
	    box-sizing: border-box;
	    position: relative;
	}
	
	.layer-input .icClose {
	    width: 24rpx;
	    height: 24rpx;
	    position: absolute;
	    top: 20rpx;
	    right: 30rpx;
	}
	
	.login-title {
	    width: 100%;
	    height: 120rpx;
	    line-height: 120rpx;
	}
	
	
	.cell {
	    width: 100%;
	    height: 130rpx;
	    display: flex;
	    flex-direction: row;
	    align-items: center;
	    box-sizing: border-box;
	    border-bottom: solid 1rpx #e1e1e1;
	}
	
	.cell input{
	    flex:1;
	    height: 100rpx;
	}
	
	.cell text{
	    width: 218rpx;
	    border-left: solid 1rpx #e1e1e1;
	    text-align: center;
	    font-size: 28rpx;
		font-weight: bold;
		color: var(--primary-color);
	}
	
	.tex32_33{
	    font-size: 32rpx;
	    color: #333;
	}
	
	.tex28_99{
	    font-size: 28rpx;
	    color: #999;
	}
	
	.tex36_33_b{
	    font-size: 36rpx;
	    color: #333;
	    font-weight: bold;
	}
	
	.btns {
	    width: 518rpx;
	    height: 90rpx;
	    background-color:var(--primary-color);
	    border-radius: 45rpx;
	    margin: 50rpx auto 0;
	    font-size: 36rpx;
	    color: #ffffff;
	    text-align: center;
	    line-height: 90rpx;
	}
</style>