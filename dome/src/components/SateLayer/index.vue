<template>
	<up-popup :show="show" mode="center" @close="close" round="10" :safeAreaInsetBottom="false">
		<!-- <view class="statement">
			<view class="statement-item">
				<view class="statement-item-title">用户隐私保护提示</view>
				<view class="statement-item-text">
					本服务由第三方机构{{appData.enterprise?appData.enterprise:'陕西高速公路电子收费有限公司'}}提供，相关责任将由该服务提供方承担，如有问题请咨询该公司客服。
				</view>
				<view class="statement-item-text">
					<text>点击</text>
					<text class="agree" @click="toLink">《服务隐私及数据提示》</text>
					<text>了解个人信息处理规则</text>
				</view>
			</view>
			<view class="closeView" @click="submClick">
				我知道了
			</view>
		</view> -->
		<view class="privacy-dialog-content" :style="{ background: themeStore.themeColors.$bgTemToPageColor }">
			<view class="privacy-dialog-title">用户隐私保护提示</view>
			<scroll-view scroll-y="true" class="scroll-Y">
				<view class="statement-item-text">
					本服务由第三方机构<text :style="{color: themeStore.themeColors.$color } ">{{appData.enterprise?appData.enterprise:'陕西高速公路电子收费有限公司'}}</text>提供，相关责任将由该服务提供方承担，如有问题请咨询该公司客服。
				</view>
			</scroll-view>
			<view class="privacy-dialog-btns">
				<text class="privacy-dialog-btn buts1"
					:style="{border: `2rpx solid ${themeStore.themeColors.$color}`,color: themeStore.themeColors.$color } "
					@click="show=false">取消</text>
				<text class="privacy-dialog-btn buts2" :style="{ background: themeStore.themeColors.$butColor }"
					@click="submClick">同意</text>
			</view>
		</view>
	</up-popup>
	
	
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import {updateClickVolume} from "@/api/index";
	import { AppLaunchMiniProgram } from '@/utils/util';
	// #ifdef APP-HARMONY
		import { registerApp, launchMiniProgram } from '@/uni_modules/weixin-open';
	// #endif
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const show = ref<Boolean>(false);
	
	interface appTypeData {
	  appId: string
	  address?: string
	  appSrcId?: string
	  enterprise?: string
	  name?: string
	  state?: string
	  status?: string
	}
	const appData = ref<appTypeData>({
		appId: ""
	})
	
	const props = defineProps<{
		stataLayerTxt : string;
	}>();
	
	
	const close = () => {
		show.value = false
	}
	const open = (obj:appTypeData) => {
		console.log('----------ovj---------',obj);
		appData.value = obj
		show.value = true
	}
	const toLink = () =>{
		uni.navigateTo({
			url:"/pages_A/xieyi/privacy_agreement"
		})
	}
	
	const submClick = () => {
		close();
		console.log("--------->>>",appData.value);
		// #ifdef MP-WEIXIN
			uni.navigateToMiniProgram({
			  appId: appData.value.appId, // 必填
			  path: appData.value.address?appData.value.address:'',
			  envVersion: 'release',
			  success:(rees)=> {
			    // 打开成功
			    // updateClickVolumes(appData.value.appId);
			  },
			  fail:(eerr)=> {
			    // 跳转失败
			    console.error('跳转失败:', eerr);
			  }
			});
		// #endif
		// #ifdef APP-HARMONY
			launchMiniProgram('wx90c850f92690cb19',appData.value.appSrcId,'/')
		// #endif
		// #ifdef APP-PLUS
		AppLaunchMiniProgram(appData.value.appSrcId)
		// #endif
	}
	
	const updateClickVolumes = async (appid:string)=> {
		if (!checkAppid(appid)) return
		const params = {
			'sourceType': checkAppid(appid),
			"userId": uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo').id : '',
		}
		try{
			// const res:any = await updateClickVolume(params)
		}catch (err : any) {
			uni.showToast({
				title: err?.message || '请求失败',
				icon: 'none',
				duration: 3000
			});
		}
		
		
	}
	const checkAppid = (id:string)=> {
		let appidList = [{
				appid: 'wxe442a27a2747b061',
				name: '三秦通',
				value: '02'
			},
			{
				appid: 'wx418690329a7c6b31',
				name: '高速电子票',
				value: '04'
			},
			{
				appid: 'wx9040bb0d3f910004',
				name: '票根',
				value: '03'
			},
			{
				appid: 'wxf52b8d2bb696e5f4',
				name: '行云-通行费补缴',
				value: '19'
			},
			{
				appid: 'wx00a6d2bbd6cf9160',
				name: '运政办理',
				value: '25'
	
			}, {
				appid: 'htjy',
				name: '昊通救援',
				value: '26'
	
			}
		]
		let filterItem = appidList.filter(item => item.appid == id)
		return filterItem.length > 0 ? filterItem[0].value : ''
	}
	onMounted(()=>{
		// #ifdef APP-HARMONY
			registerApp('wx90c850f92690cb19')
		// #endif
		
	})
	defineExpose({
	    open
	})
</script>

<style lang="scss" scoped>
	.statement {
		width: 720rpx;
		    border-radius: 10rpx;
		    background-color: #fff;
		    position: fixed;
		    left: 50%;
		    transform: translate(-50%,-50%);
		    margin: 0 auto;
		    top: 50%;
		.statement-item {
			padding: 30rpx 30rpx 0;
			box-sizing: border-box;
			.statement-item-title{
				font-size: 34rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
				color: #333;
			}
			.statement-item-text{
				font-size: 32rpx;
				color: #333;
				margin-bottom: 20rpx;
				.agree{
					color: #b04b06;
				}
			}
		}
		.closeView{
			width: 300rpx;
			padding: 20rpx 0;
			background: linear-gradient(-40deg, #FF9600, #F4AA31);
			text-align: center;
			color: #fff;
			font-size: 30rpx;
			margin: 0 auto 50rpx;
			border-radius: 10rpx;
		}
	}
	.scroll-Y{
		max-height: 600rpx;
	}
	.agreement {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		font-size: 24rpx;
		color: #999;
		margin-top: 50rpx;
		margin-bottom: 30rpx;
	}
	
	.agreement-text {
		margin-right: 10rpx;
	}
	
	.protocol-text {
		margin: 0 5rpx;
	}
	
	.privacy-dialog-content {
		position: relative;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		padding: 48rpx 40rpx 0;
		box-sizing: border-box;
		width: 630rpx;
	
		.privacy-dialog-title {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			font-weight: 400;
			font-size: 32rpx;
			color: #333333;
			line-height: 46rpx;
			text-align: center;
			margin-bottom: 20rpx;
		}
	
		.privacy-dialog-text {
			// font-size: 14px;
			// color: #7a7e83;
			// margin-bottom: 10px;
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 630rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #333333;
			line-height: 48rpx;
			text-align: left;
		}
	
		.privacy-dialog-btns {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 540rpx;
			padding: 30rpx 0;
		}
	
		.privacy-dialog-btn {
			display: inline-block;
			text-align: center;
			line-height: 76rpx;
			width: 250rpx;
			height: 76rpx;
			margin: 0 10px;
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			font-size: 28rpx;
			font-weight: 500;
			margin-top: 30rpx;
		}
	
		.buts1 {}
	
		.buts2 {
			color: #FFFFFF;
		}
	
		.buts3 {
			color: #00BEBE;
		}
	
		.link {
			color: #18bc37;
			text-decoration: underline;
		}
	}
	.statement-item-text{
		line-height: 50rpx;
	}
</style>