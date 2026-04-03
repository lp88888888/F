<template>
	<web-view :src="linkUrl"></web-view>
</template>

<script setup>
	import {ref} from 'vue';
	import { onLoad, onUnload,onPageScroll } from '@dcloudio/uni-app';
	import {getUUID,showAlert2,CurrentPage} from '@/utils/util';
	import {myencrypt} from '@/utils/rsaUtil';
	import { useAppStore } from '@/store/modules/app';
	const appStore = useAppStore();
	// const isLogin = ref(appStore.checkLogin());
	const isLogin = computed(()=>{
		return appStore.checkLogin()
	})
	const linkUrl = ref('');
	const uuid = ref('');
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad((options) =>{
	  var that = this
		let url=''
	   linkUrl.value = decodeURIComponent(options.linkUrl)
	   //昊通救援参数处理
	   if (linkUrl.value.indexOf('https://www.sx96113.com') != -1) {
		   if(isLogin.value){
			   var params = {
			     phone: wx.getStorageSync('userInfo').mobile,
			     time: new Date().getTime()
			   }
			   console.log(JSON.stringify(params))
			   linkUrl.value += '?sign=' + myencrypt(JSON.stringify(params))
			   console.log(linkUrl.value)
		   }else{
			   showAlert2('提示', '本次操作需要您进行登录验证', false, '取消', '确定', (success)=> {
			    // #ifdef MP-WEIXIN
			    uni.navigateTo({
			    	url: '/pages_A/login/login?fromPage=' + CurrentPage(),
			    });
			    // #endif
			    // #ifdef APP
			    uni.navigateTo({ url: '/pages_A/login_password/login' });
			    // #endif
			   },null)
			   return
		   }
	   }
	})
</script>

<style lang="scss" scoped>
	
</style>