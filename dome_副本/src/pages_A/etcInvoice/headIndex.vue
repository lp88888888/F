<template>
	<view class="contant" :data-theme="pageTheme">
		<!-- <up-navbar title="关联发票抬头" bgColor="none" @leftClick="leftClick" placeholder :fixed="false"></up-navbar> -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="关联发票抬头" bgColor="transparent" @leftClick="leftClick" placeholder
					:fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<!-- <image class="backImg" :src="`${imgUrl}invoice-bg.png`" mode=""></image> -->
		<view class="search-view">
		    <image :src="`${imgUrl}selfDrive_search.png`" />
		    <input class="tex24_33" v-model="searchTex" placeholder-class="tex24_66" placeholder="请输入抬头关键字" @input="getInput" confirm-type="search" @confirm="search" />
		</view>
		
		<view class="change-view">
		    <view @click="truth(1)" >
		        <text :class="[changeIndex==1?'tex32_33_b':'tex28_66']">个人/非企业单位</text>
		        <text :class="[changeIndex==1?'':'tran']"></text>
		    </view>
		    <view @click="truth(2)" >
		        <text :class="[changeIndex==2?'tex32_33_b':'tex28_66']">企业单位</text>
		        <text :class="[changeIndex==2?'':'tran']"></text>
		    </view>
		</view>
		 
		<view class="no-cont" v-if="noContShow">
		    <image :src="`${imgUrl}no-invoice-cont-icon.png`" mode="" />
		    <text>暂无相关抬头结果~</text>
		    <text @click="add">添加</text>
		</view>
		
		<block v-if="type=='my'">
		    <view class="my-title">
		        <view class="tit-item" v-for="(item,index) in list" :key="index">
		            <view>
		                <text class="tex24_66" style="display: inline-block;width: 160rpx;">抬头名称：</text>
		                <text class="texNoWrap tex28_33_b">{{item.name}}</text>
		            </view>
		            <view v-if="changeIndex==2">
		                <text class="tex24_66" style="display: inline-block;width: 160rpx;">税　　号：</text>
		                <text class="texNoWrap tex28_33_b">{{item.taxNum}}</text>
		            </view>
		            <view style="height: 0;" v-else></view>
		            <view @click="lookEtcCard(item.titleId)">
		                <image :src="`${imgUrl}head-title-card-icon.png`" mode="" />
		                <view>
		                    <text class="tex24_33_b">关联卡</text>
		                    <text class="tex24_red_b">【{{item.bindCardNum}}】</text>
		                    <text class="tex24_33_b">张</text>
		                </view>
		            </view>
		            <view>
		                <text @click="remove(item.titleId)">删除</text>
		                <text @click="goDetail(item.titleId)">查看详情</text>
		            </view>
		        </view>
		    </view>
		    <view class="btn-view"></view>
		    <view class="btn" @click="add" v-if="!noContShow">
		        <view>+添加发票抬头</view>
		    </view>
		</block>
		<block v-else>
		    <view class="truth-title" v-for="(item,index) in list" :key="index" @click="truthTitle(index)" >
		        <view>
		            <view class="image" :class="[truthIndex==index?'no-border':'']">
		                <image :src="`${imgUrl}bindetc-truth.png`" v-if="truthIndex==index" />
		            </view>
		            <view>
		                <view>
		                    <text class="tex24_66"  style="display: inline-block;width: 160rpx;">抬头名称：</text>
		                    <text class="texNoWrap tex24_33_b">{{item.name}}</text>
		                </view>
		                <view v-if="changeIndex==2">
		                    <text class="tex24_66" style="display: inline-block;width: 160rpx;">税　　号：</text>
		                    <text class="texNoWrap tex24_33_b">{{item.taxNum}}</text>
		                </view>
		            </view>
		        </view>
		    </view>
		    <view class="add" @click="add" v-if="!noContShow">+添加发票抬头</view>
		    <view class="btn-view" v-if="!noContShow"></view>
		    <block v-if="type=='change'">
		        <view class="btn" @click="changeTitle" v-if="!noContShow">
		            <view>确定换开发票</view>
		        </view>
		    </block>
		    <block v-else>
		        <view class="btn" @click="correlation" v-if="!noContShow">
		            <view>确定关联发票抬头</view>
		        </view>
		    </block>
		</block>
		<etc-login v-if="layerShow" @closePop="closePop" @loginSuc="loginSuc" :phone='phone'></etc-login>
	</view>
	
</template>

<script setup lang="ts">
	import {ref} from 'vue';
	import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
	import EtcLogin from './components/EtcLogin.vue';
	import { imgUrl } from '@/config';
	import { etcInvoice,getTicketId } from '@/api/etcInvoice';
	import {showToastSuccess,showToast,hideLoading,showLoading,showAlert2,CurrentPage} from '@/utils/util'
	import { useAppStore } from '@/store/modules/app';
	const appStore = useAppStore();
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	// const isLogin = ref(appStore.checkLogin());
	const isLogin = computed(()=>{
		return appStore.checkLogin()
	})
	const type = ref<string>('');
	const searchTex = ref<string>('');
	const list = ref<any>([]);
	const headList = ref<any>([]);
	const changeIndex = ref<number>(1);
	const truthIndex = ref<number>(-1);
	const cardNum = ref<string|number>('');
	const applyId = ref<string>('');
	const noContShow = ref<boolean>(false);
	const cardType = ref<string>('');
	const carNum = ref<string>('');
	const layerShow = ref<boolean>(false);
	const etcUser = ref<any>({});
	const style = ref<string>('background: transparent');
	const phone= ref<string>('');
	const leftClick = () =>{
		uni.navigateBack({
			delta:1,
			fail: () => {
				uni.navigateTo({
					url:"/pages/home/home"
				})
			}
		})
	}
	
	onPageScroll((e) =>{
	  console.log()
	  if (e.scrollTop > 0) {
		  style.value = 'background:#fff'
	  } else {
		  style.value = 'background:transparent'
	  }
	})
	onLoad((options)=>{
		type.value = options.type ? options.type : 'my';
		cardType.value = options.cardType;
		carNum.value = options.carNum;
		cardNum.value = options.id;
		applyId.value = options.applyId;
		noContShow.value = true;
		const token = uni.getStorageSync('Token');
		// #ifdef APP-PLUS
		phone.value = parseToken(token).member_phone
		//#endif
		// #ifdef MP-WEIXIN || APP-HARMONY
		phone.value = parseTokens(token).member_phone
		//#endif   
	})
	onShow(()=>{
		checkUser()
	})
	//app
	const parseToken = (token) => {
		if (!token) return null;
	
		try {
			// JWT 由三部分组成：header.payload.signature
			const payloadBase64 = token.split('.')[1];
			// Base64Url 解码
			const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
			return JSON.parse(payloadJson);
		} catch (e) {
			console.error('Token 解析失败:', e);
			return null;
		}
	}
	//小程序
	const parseTokens = (token) => {
		if (!token) return null;
	
		try {
			const payloadBase64 = token.split('.')[1];
			if (!payloadBase64) return null;
	
			const buffer = wx.base64ToArrayBuffer(payloadBase64);
			const uint8Arr = new Uint8Array(buffer);
	
			let binary = '';
			for (let i = 0; i < uint8Arr.length; i++) {
				binary += String.fromCharCode(uint8Arr[i]);
			}
	
			const payloadString = decodeURIComponent(escape(binary));
			return JSON.parse(payloadString);
		} catch (e) {
			console.error('Token 解析失败:', e);
			return null;
		}
	}
	const lookEtcCard =(id:string)=> {
	  uni.navigateTo({
	    url: '/pages_A/etcInvoice/etcCards?type=title&titleId=' + id,
	  })
	}
	const add=() =>{
	  uni.navigateTo({
	    url: '/pages_A/tollInvoice/association?typeIndex=' + changeIndex.value,
	  })
	}
	const truth=(index:number)=> {
	  if (index == changeIndex.value) return
	  changeIndex.value= index
	  list.value= headList.value.filter(item => item.titleType == index)
	  
	  noContShow.value = list.value.length?false:true
	}
	
	const goDetail=(titleId:string)=> {
		console.log('0------------------',titleId);
	  uni.setStorageSync('updateTitle', list.value.filter(item => item.titleId == titleId)[0])
	  // console.log("---------->>>>",uni.getStorageSync('updateTitle'));
	  // return
	  add()
	}
	
	const remove=(titleId:string) =>{
	  var that = this
	  let id = titleId
	  let headIndex = headList.value.findIndex(item => item.titleId == id)
	  let index = list.value.findIndex(item => item.titleId == id)
	
	  if (headList.value[headIndex].bindCardNum > 0) {
	    showToast('该抬头已关联etc卡，不支持删除')
	    return
	  }
	  showAlert2('删除发票抬头', '删除后，同时解除该发票与ETC卡的绑定关系，确定删除该发票抬头吗？', true, '取消', '确认', function () {
	    var params = {
	      serverUrl: 'appTitleDeleteRequest',
	      titleId: id,
	    }
	    showLoading();
		etcInvoice(params).then(res =>{
			hideLoading()
			let headeList = headList.value;
			let liest = list.value;
			headeList.splice(headIndex, 1);
			liest.splice(index, 1);
			headList.value = [...headeList]
			list.value = [...liest]
			if (list.value.length == 0) {
				noContShow.value = true;
			}
		}).catch(err=>{
			hideLoading()
			if (err == 'etcTokenLoad') {
				layerShow.value = true;
			} else {
			  showToast(err)
			}
		})
	    
	  },()=>{});
	}
	const truthTitle=(index) =>{
	  if (truthIndex.value == index) {
		  truthIndex.value = -1
	    return
	  }
	  truthIndex.value = index
	}
	// 换开发票
	const changeTitle=()=> {
	  var that = this
	  if (truthIndex.value == -1) {
	    showToast('请先选择抬头信息')
	    return
	  }
	  let title = list.value[truthIndex.value]
	  let titleId = title.titleId
	  title['titleName'] = title['name']
	  var params = {
	    serverUrl: 'appInvoiceChangeTitleRequest',
	    titleId: titleId,
	    applyId: applyId.value,
	    cardId: cardNum.value,
	    titleData: title
	  }
	  showLoading()
	  etcInvoice(params).then(res =>{
		  hideLoading()
		  uni.redirectTo({
		    url: './success?type=' + type.value,
		  })
	  }).catch(err=>{
		  hideLoading()
		  if (err == 'etcTokenLoad') {
			  layerShow.value = true;
		  } else {
		    showToast(err)
		  }
	  })
	}
	
	const correlation=()=> {
	  if (truthIndex.value == -1) {
	    showToast('请先选择抬头信息')
	    return
	  }
	  
	  let titleId = list.value[truthIndex.value].titleId
	  let tits = new Array()
	  tits.push({
	    cardId: cardNum.value
	  })
	  var params = {
	    serverUrl: 'appTitleAddCardRequest',
	    titleId: titleId,
	    cardIds: tits,
	  }
	  showLoading()
	  etcInvoice(params).then(res =>{
		  hideLoading()
		  if(res.data.success){
			  if (cardType.value) {
			    showToastSuccess('关联抬头成功')
			    setTimeout( ()=> {
					uni.navigateBack()
			      // uni.redirectTo({
			      //   url: `/pages_A/etcInvoice/makeIndex?id=${cardNum}&car=${carNum.value}&cardtype=${cardType.value}`
			      // })
			    }, 1000)
			  } else {
			    uni.redirectTo({
			      url: './success',
			    })
			  }
		  }
		 
	  }).catch(err =>{
		  hideLoading()
		  if (err == 'etcTokenLoad') {
		    layerShow.value = true;
		  } else {
		    showToast(err)
		  }
	  })
	}
	
	const loadData=()=> {
	  var that = this;
	  list.value = [];
	  noContShow.value = false;
	  
	  var params = {
	    serverUrl: 'appTitleSearchRequest',
	    queryStr: searchTex.value,
	  }
	  showLoading()
	  etcInvoice(params).then(res =>{
		  hideLoading()
		  if(res.data.success){
			  let headsList = res.data.items
			  // let headList = []
			  list.value = headsList.filter(item => item.titleType == changeIndex.value)
			  headList.value = headsList
			  if (list.value.length == 0) {
			  	noContShow.value = true
			  }
		  }else{
			  showToast(res.data.msg)
		  }
		  
	  }).catch(err =>{
		  hideLoading()
		  if (err == 'etcTokenLoad') {
			  layerShow.value = true
		    
		  } else {
		    showToast('查询失败')
		  }
	  })
	}
	
	const makeInvoice=() =>{
	  uni.navigateTo({
	    url: '../etcCards?type=make',
	  })
	}
	
	const search=()=> {
	  loadData()
	}
	
	const getInput=(e)=> {
	  var value = e.detail.value;
	  searchTex.value = value
	}

	const checkUser =() =>{
	  let index = null
	  if (uni.getStorageSync('truthIndex')) {
	    index = uni.getStorageSync('truthIndex')
	    uni.removeStorageSync('truthIndex')
	  }
	  var that = this
	  if (!isLogin.value) {
	    showAlert2('提示', '本次操作需要您进行登录验证', false, '取消', '确定', function success() {
	      // #ifdef MP-WEIXIN
	      uni.navigateTo({
	      	url: '/pages_A/login/login?fromPage=' + CurrentPage(),
	      });
	      // #endif
	      // #ifdef APP
	      uni.navigateTo({ url: '/pages_A/login_password/login' });
	      // #endif
	    },()=>{})
	    return
	  } else {
		  getTicketIdFun(index)
	  }
	}
	
	// const checkEtcUser = async (index:number) =>{
	// 	let etcsUser = uni.getStorageSync('etcUser')
	// 	if (!etcsUser || !etcsUser.mobile) {
	// 		layerShow.value = true;
	// 	}else{
			
			
			
	// 	}
	// }
	const closePop=() =>{
		layerShow.value = false
	}
	
	const loginSuc=(res) =>{
		changeIndex.value =1;
		etcUser.value =res;
		loadData()
	}
	
	const getTicketIdFun = (index) => {
		var params = {
			userType: '1',
			mobile: phone.value
		}
		getTicketId(params).then(res => {
			if (res.data) {
				layerShow.value = false
				let result = {
					ticketId: res.data,
					mobile: phone.value
				}
				etcUser.value = result
				loadData()
			} else {
				layerShow.value = true
			}
		}).catch(err => {
			// showToast(err)
			hideLoading()
		})
		
		
		
		// if (res.data) {
		// 	let result = {
		// 		ticketId: res.data,
		// 		mobile: phone.value
		// 	}
		// 	if(index) changeIndex.value = index
			
		// 	etcUser.value = result
		// 	loadData()
		// } else {
		// 	layerShow.value = true
		// }
		// var params = {
		// 	userType: '1',
		// 	mobile: phone.value
		// }
		// getTicketId(params).then(res => {
		// 	if (res.data) {
		// 		layerShow.value = false
		// 		var params = {
		// 			serverUrl: 'getTicketId',
		// 			mobile:phone.value
		// 		}
		// 		showLoading('鉴权中')
		// 		etcInvoice(params).then(res =>{
					
		// 			hideLoading()
		// 		}).catch(err=>{
		// 			showToast(err)
		// 			hideLoading()
		// 		})
		// 	} else {
		// 		layerShow.value = true
		// 	}
		// }).catch(err => {
		// 	showToast(err)
		// 	hideLoading()
		// })
	}
</script>

<style lang="scss" >
	.contant{
		width: 100vw;
		background: var(--head-color);
	}
	.backImg{
		width: 750rpx;
		height: 412rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.search-view {
	    width: 702rpx;
	    height: 80rpx;
	    background-color: #ffffff;
	    border-radius: 40rpx;
	    display: flex;
	    align-items: center;
	    margin: 40rpx auto 8rpx;
	}
	
	.search-view image {
	    width: 32rpx;
	    height: 32rpx;
	    margin: 0 28rpx;
	}
	
	.search-view input {
	    flex: 1;
	    height: 40rpx;
	    padding-left: 20rpx;
	    box-sizing: border-box;
	    border-left: solid 1rpx #e1e1e1;
	}
	
	.change-view {
	    width: 100%;
	    height: 116rpx;
	    display: flex;
	    align-items: center;
	    padding: 0 28rpx;
	    box-sizing: border-box;
	}
	
	.change-view>view {
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	}
	
	.change-view>view:nth-child(1) {
	    margin-right: 70rpx;
	}
	
	.change-view>view>text:nth-child(2) {
	    display: block;
	    width: 60rpx;
	    height: 6rpx;
	    background-color: var(--primary-color);
	    margin-top: 6rpx;
	}
	
	.tran {
	    background-color: transparent !important;
	}
	
	.my-title {
	    width: 100%;
	    padding: 0 24rpx;
	    box-sizing: border-box;
	    box-sizing: border-box;
	}
	
	.my-title .tit-item {
	    width: 100%;
	    /* height: 302rpx; */
	    background-color: #ffffff;
	    border-radius: 10rpx;
	    margin-bottom: 20rpx;
	    padding: 15rpx 24rpx 0;
	    box-sizing: border-box;
	    display: flex;
	    flex-direction: column;
	}
	
	.my-title .tit-item>view:nth-child(1),
	.my-title .tit-item>view:nth-child(2) {
	    display: flex;
	    align-items: center;
	    height: 60rpx;
	}
	
	.my-title .tit-item>view:nth-child(1)>text:nth-child(1),
	.my-title .tit-item>view:nth-child(2)>text:nth-child(1) {
	    display: block;
	    width: 130rpx;
	}
	
	.my-title .tit-item>view:nth-child(1)>text:nth-child(2),
	.my-title .tit-item>view:nth-child(2)>text:nth-child(2) {
	    flex: 1;
	}
	
	.my-title .tit-item>view:nth-child(3) {
	    display: flex;
	    align-items: center;
	    margin-top: 5rpx;
	    width: 100%;
	    height: 82rpx;
	    border-bottom: solid 1rpx #e1e1e1;
	}
	
	.my-title .tit-item>view:nth-child(3) image {
	    width: 44rpx;
	    height: 32rpx;
	    margin-right: 24rpx;
	}
	
	.my-title .tit-item>view:nth-child(3)>view {
	    display: flex;
	    align-items: center;
	}
	
	.my-title .tit-item>view:nth-child(4) {
	    display: flex;
	    justify-content: flex-end;
	    align-items: center;
	    height: 100rpx;
	}
	
	.my-title .tit-item>view:nth-child(4)>text:nth-child(1) {
	    width: 150rpx;
	    height: 50rpx;
	    background-color: #ffffff;
	    border-radius: 10rpx;
	    border: solid 1rpx var(--primary-color);
	    font-size: 28rpx;
	    font-weight: normal;
	    font-stretch: normal;
	    letter-spacing: 0rpx;
	    color: var(--primary-color);
	    text-align: center;
	    line-height: 50rpx;
	    margin-right: 24rpx;
	}
	
	.my-title .tit-item>view:nth-child(4)>text:nth-child(2) {
	    width: 150rpx;
	    height: 50rpx;
	    background-color: var(--primary-color);
	    border-radius: 10rpx;
	    font-size: 28rpx;
	    font-weight: normal;
	    font-stretch: normal;
	    letter-spacing: 0rpx;
	    color: #fff;
	    text-align: center;
	    line-height: 50rpx;
	}
	
	.btn-view {
	    width: 750rpx;
	    height: 140rpx;
	}
	
	.btn {
	    position: fixed;
	    width: 750rpx;
	    height: 140rpx;
	    background-color: #ffffff;
	    bottom: 0;
	    left: 0;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	}
	
	.btn view {
	    width: 703rpx;
	    height: 91rpx;
	    background-color: var(--primary-color);
	    border-radius: 10rpx;
	    line-height: 91rpx;
	    text-align: center;
	    font-size: 32rpx;
	    color: #ffffff;
	}
	
	.add {
	    text-align: right;
	    font-size: 28rpx;
	    color: #333333;
	    padding: 0 30rpx;
	    width: 100%;
	    box-sizing: border-box;
	    margin: 50rpx 0;
	    text-decoration: underline
	}
	
	.truth-title {
	    width: 100%;
	    padding: 0 26rpx;
	    box-sizing: border-box;
	}
	
	.truth-title>view {
	    width: 100%;
	    margin-bottom: 6rpx;
	    display: flex;
	    align-items: center;
	    box-sizing: border-box;
	}
	
	.truth-title>view .image {
	    width: 36rpx;
	    height: 37rpx;
	    border: solid 1rpx #999;
	    border-radius: 100%;
	    box-sizing: border-box;
	    margin-right: 24rpx;
	}
	
	.truth-title>view .no-border {
	    border: 0 !important;
	}
	
	.truth-title>view .image image {
	    width: 36rpx;
	    height: 37rpx;
	}
	
	.truth-title>view>view:nth-child(2) {
	    // flex: 1;
	    /* height: 130rpx; */
	    background-color: #ffffff;
	    border-radius: 10rpx;
	    padding: 0 24rpx;
	    box-sizing: border-box;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	}
	
	.truth-title>view>view:nth-child(2)>view {
	    display: flex;
	    align-items: center;
	}
	
	.truth-title>view>view:nth-child(2)>view:nth-child(1) {
	    height: 65rpx;
	}
	
	.truth-title>view>view:nth-child(2)>view:nth-child(2) {
	    height: 65rpx;
	}
	
	.truth-title>view>view:nth-child(2)>view>text:nth-child(2) {
	    // flex: 1;
	}
	
	.no-cont {
	    width: 100%;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	    margin-top: 100rpx;
	}
	
	.no-cont>image {
	    width: 180rpx;
	    height: 118rpx;
	    margin-bottom: 30rpx;
	}
	
	.no-cont>text:nth-child(2) {
	    font-size: 28rpx;
	    color: #333;
	    margin-bottom: 30rpx;
	}
	
	.no-cont>text:nth-child(3) {
	    width: 220rpx;
	    height: 80rpx;
	    line-height: 80rpx;
	    background-color: var(--primary-color);
	    border-radius: 10rpx;
	    text-align: center;
	    line-height: 80rpx;
	    color: #fff;
	    font-size: 28rpx;
	}
	::v-deep .u-navbar__content{
		background: none !important;
	}
</style>