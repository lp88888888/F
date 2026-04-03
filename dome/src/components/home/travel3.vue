<!-- 出现 -->
<template>
	<view class="travel-box">
		<view class="travel-head">
			 <image :src="imgUrl + 'banner.png'" class="img"></image>
		</view>
		<view class="grid-container">
			<view class="grid-item" @click="navLink('wxe442a27a2747b061')">
				 <image :src="imgUrl + 'tr3-icon1.png'" class="img"></image>
				<text class="item-text">ETC业务申办</text>
			</view>
			<view class="grid-item" @click="navLink('https://yjglfp.sx12122.cn/')">
				<image :src="imgUrl + 'tr3-icon2.png'" class="img"></image>
				<view class="item-text">通行费发票<br /> 查询</view>
			</view>
		</view>
		<view class="grid-container">
			<view class="grid-item-three" @click="navLink('wxf52b8d2bb696e5f4')">
				<image :src="imgUrl + 'tr3-icon3.png'" class="img"></image>
				<text class="item-text">通行费补缴</text>
			</view>
			<!-- <view class="grid-item-three" @click="toJump('../../pages_A/pricingVolume/index')">
				<image :src="imgUrl + 'tr3-icon4.png'" class="img"></image>
				<text class="item-text">以量定价</text>
			</view> -->
			<view class="grid-item-three" @click="toJump('/pages_D/volumePricing/activity/apply')">
				<image :src="imgUrl + 'tr3-icon4.png'" class="img"></image>
				<text class="item-text">以量定价</text>
			</view>
			<view class="grid-item-three">
				<image :src="imgUrl + 'tr3-icon5.png'" class="img"></image>
				<text class="item-text">扫码付</text>
			</view>
		</view>

		<view class="grid-container">
			<view class="grid-item" @click="navLink('wx00a6d2bbd6cf9160')">
				<image :src="imgUrl + 'tr3-icon6.png'" class="img"></image>
				<text class="item-text">运政办理</text>
			</view>
			
			
			<view class="grid-item" @click="navLink('wxa153df20e8888c68')" >
				<image :src="imgUrl + 'tr3-icon7.png'" class="img"></image>
				<text class="item-text">绿通预约</text>
			</view>
			<!-- <view class="grid-item" @click="toJump('../../pages_A/greenPass/index')" >
				<image :src="imgUrl + 'tr3-icon7.png'" class="img"></image>
				<text class="item-text">绿通预约</text>
			</view> -->
		</view>
		<up-gap :height="bottomHeight" ></up-gap>
		<!-- 底部服务 -->
	  <view class="container-bottom">
	  	<view class="line-img" id="FixedBoot" :style="{
	  	  background: 'url(' + imgUrl + 'line.png) no-repeat',
	  	  'background-size': '100% 100%',
	  	  'background-position': 'center'
	  	}">
	      <view class="nodes item1" @click="handleCallParent('travel')">
	  		<view class="node-wenzi">出行</view>
	  		<view >服务</view>
	  	</view>
	  	<view class="nodes item2" @click="handleCallParent('travel2')">
	  		<view class="node-wenzi">生活</view>
	  		<view >服务</view>
	  	</view>
	  	<view class="node item3" @click="handleCallParent('travel3')">
	  		<view class="node-wenzi">业务</view>
	  		<view>办理</view>
	  	</view>
	  	<view class="nodes item4" @click="handleCallParent('travel4')">
	  		<view class="node-wenzi">车辆</view>
	  		<view >服务</view>
	  	</view>
	  </view>	
	    </view>
	</view>
	<SateLayer ref="sateLayerRef"></SateLayer>
</template>

<script setup lang="ts">
	import {
		ref,onMounted
	} from 'vue';
	import { imgUrl } from '../../config';
	import SateLayer from '../SateLayer/index.vue';
	import {CurrentPage,showAlert2} from '@/utils/util'
	import {getAdvertisingListByType} from "@/api/index"
	import { useAppStore } from '@/store/modules/app';
	const appStore = useAppStore();
	const isLogin = computed(()=>{
		return appStore.checkLogin()
	})
	const sateLayerRef = ref(null);
	const props = defineProps<{
	  parentMethod: (msg: string) => void;
	  bottomHeight:number|string
	}>();
	const activityList = ref([])
	// 子组件内部调用父组件方法
	const handleCallParent = (name:string) => {
	  // 调用父组件传递的方法，并传入参数
	  props.parentMethod(name);
	};
	const toJump = (url : String) => {
		uni.navigateTo({
			url: url
		})
	}
	onMounted(()=>{
		// getData()
		
	})
	const getData = async () =>{
		try{
			const res:any = await getAdvertisingListByType({type:'homeSpecialService'})
			if (!res.clazz.list || res.clazz.list.length == 0) return
			activityList.value = res.clazz.list
		}catch(err){
			
		}
	}
	const navLink = (appid:string) =>{
		// 登录校验
		if (!isLogin.value) {
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
		let arr = activityList.value.filter(item => item.appid == appid);
		if(arr.length > 0){
			sateLayerRef.value.open(arr[0])
			return
		}
		if(appid == 'wxe442a27a2747b061'){
			sateLayerRef.value.open({
				address: "",
				appId: "wxe442a27a2747b061",
				appSrcId: "gh_95045762f7a8",
				enterprise: "陕西高速公路电子收费有限公司",
				name: "ETC申请",
				state: "01",
				status: "01",
			});
		}
		if(appid ==  'wxf52b8d2bb696e5f4'){
			sateLayerRef.value.open({
				address: "",
				appId: "wxf52b8d2bb696e5f4",
				appSrcId: "gh_dd4bedd2010f",
				enterprise: "行云数聚（北京）科技有限公司",
				name: "通行费补缴",
				state: "01",
				status: "01",
			});
		}
		if(appid == 'wxa153df20e8888c68'){
			sateLayerRef.value.open({
				address: "/pages/appointment/view/index/index",
				appId: "wxa153df20e8888c68",
				appSrcId: "gh079c162b7d29",
				enterprise: "陕西蓝德智慧交通科技有限公司",
				name: "绿通预约",
				state: "01",
				status: "01",
			});
		}
		
		if(appid == 'wx00a6d2bbd6cf9160'){
			sateLayerRef.value.open({
				address: "",
				appId: "wx00a6d2bbd6cf9160",
				appSrcId: "",
				enterprise: "中国交通通信信息中心",
				name: "运政办理",
				state: "01",
				status: "01",
			});
		}
		
		if(appid == 'https://yjglfp.sx12122.cn/'){
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
			})
		}
	}
</script>

<style scoped lang="scss">
	.travel-box {
		padding: 0 30rpx;
		box-sizing: border-box;
		min-height: 100vh;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/home-bj-z.png')no-repeat;
		background-position: center;
		background-size: 100% 100%;
		overflow: hidden;
	}

	.travel-head {
		width: 100%;
		height: 220rpx;
		margin: 30% 0 30rpx;
		.img{
			width: 100%;
			height: 220rpx;
		}
	}

	.grid-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.grid-item {
		width: 48%;
		height: 150rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center; 
		justify-content: flex-start; 
		background-color: #fff;
		border-radius: 10rpx;
		.img {
			width: 60rpx;
			height: 60rpx;
			margin:0 20rpx 0 50rpx;
		}
	}

	.grid-item-three {
		width: 31%;
		/* 一行三个，每个约占31%宽度，留出3%的间距 */
		height: 210rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		border-radius: 10rpx;
		.img {
			width: 50rpx;
			height:50rpx;
			margin-bottom: 20rpx;
		}
	}

	.item-text {
		font-size: 28rpx;
		color: #333;
		
	}

	

	.container-bottom {
		width: 100%;
		position: fixed;
		left:0;
		bottom:-20rpx;
	}

	.node,.nodes{
		width: 106rpx;
		height: 106rpx;
		border-radius: 50%;
		
		font-size: 26rpx;
		text-align: center;
	}
	.node-wenzi {
		margin-top: 20rpx;
	}
	.node{
		color: #fff;
		background: linear-gradient(-40deg, #FF7E00, #FF9600);
		border: 5px solid #FFD5A3;;
	}
    .nodes{
		color: #000;
		background: #fff;
		box-shadow: #C9BFC0;
	}
	.line {
		color: #000;
		position: absolute;
		top: 12px;
		height: 2px;
		background-color: #ccc;
	}

	.customer {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 350rpx;
		right: 40rpx;

		.img {
			width: 100%;
			height: 110rpx;
		}
	}

	.line-img {
		width: 100%;
		height: 200rpx;
		position: relative;
		z-index: 9;

	}

	.item1 {
		position: absolute;
		top: 13%;
		left: 8%;
		z-index: 99;
	}

	.item2 {
		position: absolute;
		top: -25%;
		left: 31%;
		z-index: 99;
	}

	.item3 {
		position: absolute;
		top: -25%;
		left: 54%;
		z-index: 99;
	}

	.item4 {
		position: absolute;
		top: 15%;
		left: 76%;
		z-index: 99;
	}
</style>