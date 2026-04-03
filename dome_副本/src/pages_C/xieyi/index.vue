<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-parse :content="content"></up-parse>
		<view class="btn-bar" v-if="type == 'privacy' && isLogin" @click="editXy">
			撤销隐私协议授权
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import { richTextList , richTextInfo } from '@/api/config'
	import { updateUserAgreement }from '@/api/user';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	import { onLoad } from '@dcloudio/uni-app';
	import {useAppStore} from '@/store/modules/app';
	import { CurrentPage, showAlert2, openAPPLocation ,openLocation} from '@/utils/util'
	const { themeStore, pageTheme } = useTheme();
	
	const appStore = useAppStore();
	const icoUrl = ref(themeStore.imgUrl);
	const content = ref('')
	const type = ref('')
	
	const isLogin = computed(() => {
		return appStore.checkLogin();
	});
	
	const editXy =()=>{
		uni.showModal({
		  title: '提示',
		  content: '取消协议授权后，账户会退出登录！',
		  cancelText: '取消',
		  confirmText: '确定',
		  success:(res)=> {
		   if (res.confirm) {
		         clear()
		       } else if (res.cancel) {
				
		       }
		  }
		})
	}
	const clear = async () => {
		await updateUserAgreement(0);
		appStore.clearUserInfo()
		// #ifdef MP-WEIXIN
		uni.reLaunch({
			url: '/pages_A/login/login?fromPage=' + CurrentPage(),
		});
		// #endif
		// #ifdef APP
		uni.reLaunch({ url: '/pages_A/login_password/login' });
		// #endif
		
	}
	
	const getData = async ()=>{
		let res = await richTextList()
		if(res.code == 200){
			let arr = []
			if(type.value == 'userService'){
				arr = res.rows.filter(item => item.popupType == '用户协议')
			}
			if(type.value == 'privacy'){
				arr = res.rows.filter(item => item.popupType == '隐私政策弹窗')
			}
			if(type.value == 'listOfThirdPartyInformationSharing'){
				arr = res.rows.filter(item => item.popupType == '第三方信息共享清单')
			}
			if(type.value == 'personalInformationCollectionAndUseList'){
				arr = res.rows.filter(item => item.popupType == '个人信息收集与使用清单')
			}
			if(type.value == 'handPattedInstructions'){
				arr = res.rows.filter(item => item.popupType == '随手拍使用说明')
			}
			if(type.value == 'hotel_tk'){
				arr = res.rows.filter(item => item.popupType == '酒店预约条款')
			}
			if(type.value == 'carOwner'){
				arr = res.rows.filter(item => item.popupType == '自驾参加协议')
			}
			
			if(arr.length){
				let ress = await richTextInfo(arr[0].id)
				content.value = ress.data.content
			}
			
		}
	}
	onLoad((opticon)=>{
		type.value = opticon.type
		if(type.value == 'userService'){
			uni.setNavigationBarTitle({
				title: '用户协议'
			})
		}
		if(type.value == 'privacy'){
			uni.setNavigationBarTitle({
				title: '隐私政策'
			})
		}
		if(type.value == 'listOfThirdPartyInformationSharing'){
			uni.setNavigationBarTitle({
				title: '第三方信息共享清单'
			})
		}
		if(type.value == 'personalInformationCollectionAndUseList'){
			uni.setNavigationBarTitle({
				title: '个人信息收集与使用清单'
			})
		}
		if(type.value == 'handPattedInstructions'){
			uni.setNavigationBarTitle({
				title: '随手拍使用说明'
			})
		}
		if(type.value == 'carOwner'){
			uni.setNavigationBarTitle({
				title: '自驾参加协议'
			})
		}
		
		getData()
	})
</script>

<style lang="scss" scoped>
	.pageView{
		padding: 20rpx;
		box-sizing: border-box;
	}
	.btn-bar {
		width: 100%;
		height: 80rpx;
		background: linear-gradient(to bottom,#5ad6d6,#069fa4);
		border-radius: 40rpx;
		font-weight: 500;
		font-size: 30rpx;
		color: #fff;
		text-align: center;
		line-height: 80rpx;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		// position: fixed;
		// bottom: 63rpx;
	}
</style>