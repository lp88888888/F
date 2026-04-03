<!-- 获取验证码 -->
<template>
    <view>
        <text class="codeTextClass" @click="codeClick">{{ seconds === totalSecond ? '获取验证码' : seconds + `秒后重新发送` }}</text>
    </view>
</template>

<script setup>
import { ref } from 'vue';
import { showToast ,isEmpty,isPhoneAvailable} from "@/utils/util";
import { requestEtc } from '@/api/etcInvoice';

const totalSecond = ref(60); // 总秒数
const seconds = ref(60); // 倒计时的秒数
const timer = ref(null); // 定时器 id
const tip = ref('获取验证码');
const startTimer = () =>{
	if (!timer.value && seconds.value === totalSecond.value) {
		timer.value = setInterval(() => {
				seconds.value--
				if (seconds.value <= 0) {
				   clearInterval(timer.value)
				   timer.value = null // 重置定时器 id
				   seconds.value = totalSecond.value // 归位
				}
		}, 1000)
	}
}
// 获取验证码
const getCode = async () => {
    // 当前目前没有定时器开着，且 totalSecond 和 seconds 一致 (秒数归位) 才可以倒计时
	let res = {}
	 if(props.type == "vertifyCode"){
		if (isEmpty(props.formData.etcNumber)) {
		  showToast('请输入ETC卡编号');
		  return;
		}
		if (isEmpty(props.formData.mobile)) {
		  showToast('请输入ETC卡预留手机号码');
		  return;
		} else if (!isPhoneAvailable(props.formData.mobile)) {
		  showToast('手机号码格式有误');
		  return;
		}
		try{
			showLoading();
			const res = await etcInvoice({
			  serverUrl: 'appCardBindCheckRequest',
			  cardId: props.formData.etcNumber,
			});
			
			hideLoading();
			const bindPhone = res.clazz.mobile;
			const bindPhoneSub = bindPhone.substring(bindPhone.length - 4);
			const mobileSub = mobile.value.substring(mobile.value.length - 4);
			
			if (bindPhoneSub !== mobileSub) {
			  showToast('输入手机号和卡预留手机号不一致，请重新输入');
			} else {
			  senCode();
			}
		}catch (error) {
			hideLoading();
			if (error === 'etcTokenLoad') {
			  layerShow.value = true;
			} else {
			  if (error === '请勿频繁绑卡！') {
				showToast('请10分钟后重试~');
			  } else if (error.indexOf(props.formData.etcNumber) > -1) {
				const msgStr = error.replace(props.formData.etcNumber, '');
				showToast(msgStr);
			  } else {
				showToast(error);
			  }
			}
		  }
	 }else if(props.type == "vertifyQueryCode"){
		
	 }else{
		 if (!props.tel) return toast("请输入手机号")
	 }
	
   if (res.code == 200) {
	   // 开启倒计时
	  
	   toast('发送成功，请注意查收')
   } else {
	   toast(res.msg)
   }
}
const senCode = async () => {
  try {
    showLoading();
    await etcInvoice({
      serverUrl: 'appCardBindSendCodeRequest',
      mobile: props.formData.mobile,
      cardId: props.formData.etcNumber,
    });
    
    hideLoading();
    showToast('验证码已发送~');
    startTimer();
  } catch (error) {
    hideLoading();
    if (error === 'etcTokenLoad') {
      layerShow.value = true;
    } else {
      showToast(error);
    }
  }
};
 const codeClick = () =>{
	 if (!timer.value && seconds.value === totalSecond.value) {
		 if(props.type == "vertifyCode"){
			
		 }else if(props.type == "vertifyQueryCode"){
			
		 }else{
			 if (!props.tel) return toast("请输入手机号")
		 }
	     
	 }
 }

</script>

<style lang="scss">
.codeTextClass {
    font-size: 26rpx;
    color: #ffa84d;
}
</style>