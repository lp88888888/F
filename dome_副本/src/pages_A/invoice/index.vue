<template>
	<view class="content">
		<cos-header title="我的发票" :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="90"></cos-header>
		<view class="search-bar">
			<view class="search-input-wrap">
				<view class="u-demo-block__content">
					<!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
					<!-- #ifndef APP-NVUE -->
					<up-input placeholder="请输入关键字搜索" shape='circle'>
					<!-- #endif -->
						<!-- #ifdef APP-NVUE -->
						<up-input placeholder="请输入关键字搜索" shape='circle'>
						<!-- #endif -->
							<template #prefix>
								<up-icon name="search" color="#000000" size="28"></up-icon>
							</template>
						<!-- #ifndef APP-NVUE -->
						</up-input>
						<!-- #endif -->
					<!-- #ifdef APP-NVUE -->
					</up-input>
					<!-- #endif -->
				</view>
			</view>
			<view style="width: 14rpx;"></view>
			<view class="my-avatar" @click="invoicetitleFun">
				<view style="padding-top: 10rpx;">我 的</view>
				<view>抬 头</view>
			</view>
		</view>
		<!-- 筛选栏 -->
		<view class="filter-bar">
			<view class="filter-item filter-ls">
				<picker class="picker" mode="date" :end="endMounth" :value="monthValue" fields="month" @change="mounthChange">
				  <text style="color: #000000;">{{ monthValue }}</text>
				  <view class="down"><up-icon name="arrow-down-fill" color="#000000" size="12"></up-icon></view>
				</picker>
			</view>
			<view class="filter-item filter-ls" @click="categoryFun(1)">
				<text style="color: #2979ff;">{{changeIndex == 1?'按开票申请':'按行程'}}</text>
				<view class="down"><up-icon name="arrow-down-fill" color="#2979ff" size="12"></up-icon></view>
			</view>
			<view class="filter-item  filter-ls" @click="categoryFun(2)">
				<text style="margin-left: 50rpx;" :style="{color:statusSelect ==0?'#000000':'#2979ff'}">{{statusSelect ==0?'状态':realStatus(statusSelect)}}</text>
				<view class="down"><up-icon name="arrow-down-fill" :color="statusSelect ==0?'#000000':'#2979ff'" size="12"></up-icon></view>
			</view>
			<view class="category" v-if="iscategory">
				<template v-if="downType == 1">
					<view class="categoryItem" v-for="(item,index) in options1" :key="index" :style="{color:changeIndex == item.value?'#2979ff':'#000000'}" @click="typeCahnge(item)"> {{item.label}}</view>
				</template>
				<template v-if="downType == 2">
					<view class="categoryItem" v-for="(item,index) in options2" :key="index" :style="{color:statusSelect == item.value?'#2979ff':'#000000'}" @click="statusCahnge(item)"> {{item.label}}</view>
				</template>
			</view>
		</view>
		<view class="bill-list">
			<template v-if="changeIndex == 1">
				<view class="apply-view">
				    <view class="apply" v-for="(item,index) in dataList" :key="index" @click="goApplyDetail(index)">
				        <view class="tex24_66">申请时间:{{item.applyTime}}</view>
				        <view>
				            <view class="tex28_33_b" :class="[(item.applyType==7 || item.applyType==9)?'light-text':'']">{{item.applyTypeStr}}</view>
				            <view>
				                <view>
				                    <text class="tex28_33_b">{{item.sumInvoice}}</text>
				                    <text class="tex24_66">发票</text>
				                </view>
				                <view>
				                    <text class="tex28_33_b">{{item.tradeIdNum}}</text>
				                    <text class="tex24_66">行程</text>
				                </view>
				                <view>
				                    <text class="tex28_33_b">{{item.sumAmount}}</text>
				                    <text class="tex24_66">金额(元)</text>
				                </view>
				            </view>
				        </view>
				        <view class="status" :style="{color:(item.status==1 ||item.status==4 )?'red':''}">{{item.statusStr}}</view>
				    </view>
				</view>
				<!-- <view class="bill-box" v-for="(item,index) in dataList" :key="index" @click="goApplyDetail(index)">
					<view class="bill-item">
						<view class="bill-time-box">
							<view class="bill-time">
								<image :src="imgUrl + 'time.png'" class="img"></image>
								<text>开票时间：{{item.exTime}} </text>
							</view>
							<view class="bill-kp">
								{{item.statusStr}}
							</view>
						</view>
						<view class="bill-header">
							<view class="bill-tag">
								<image :src="imgUrl + 'ETC.png'" class="img"></image>
							</view>
							<view class="bill-etc-no">{{carNumStr}}</view>
						</view>
					<view class="toll-container">
						<view class="toll-item">
						 <image :src="imgUrl + 'open.png'" class="img"></image>
						  <view class="text-info">
							<view class="title">{{item.enStationName}}</view>
							<view class="time">{{item.enTime}}</view>
						  </view>
						</view>
						<view class="xian"></view>
						<view class="fee-info">
						  <text class="fee-symbol">¥</text>
						  <text class="fee-amount">{{item.feeStr}}</text>
						</view>
						<view class="toll-item">
						   <image :src="imgUrl + 'stop.png'" class="img"></image>
						  <view class="text-info">
							<view class="title">{{item.exStationName}}</view>
							<view class="time">{{item.exTime}}</view>
						  </view>
						</view>
					  </view>
					</view>
				</view> -->
			</template>
			<template v-if="changeIndex == 2">
				<view class="bill-box" v-for="(item,index) in dataList" :key="index" @click="goApplyDetail(index)">
					<view class="bill-item">
						<view class="bill-time-box">
							<view class="bill-time">
								<image :src="imgUrl + 'time.png'" class="img"></image>
								<text>开票时间：{{item.exTime}} </text>
							</view>
							<view class="bill-kp">
								{{item.statusStr}}
							</view>
						</view>
						<view class="bill-header">
							<view class="bill-tag">
								<image :src="imgUrl + 'ETC.png'" class="img"></image>
							</view>
							<view class="bill-etc-no">{{carNumStr}}</view>
						</view>
					<view class="toll-container">
						<!-- 起点信息 -->
						<view class="toll-item">
						 <image :src="imgUrl + 'open.png'" class="img"></image>
						  <view class="text-info">
							<view class="title">{{item.enStationName}}</view>
							<view class="time">{{item.enTime}}</view>
						  </view>
						</view>
						<view class="xian"></view>
						<!-- 费用信息（右侧） -->
						<view class="fee-info">
						  <text class="fee-symbol">¥</text>
						  <text class="fee-amount">{{item.feeStr}}</text>
						</view>
						<!-- 终点信息 -->
						<view class="toll-item">
						   <image :src="imgUrl + 'stop.png'" class="img"></image>
						  <view class="text-info">
							<view class="title">{{item.exStationName}}</view>
							<view class="time">{{item.exTime}}</view>
						  </view>
						</view>
					  </view>
					</view>
				</view>
			</template>
			
				
		</view>
		<view class="no-cont" v-if="!dataList.length">
		    <image src="https://tranalioss.shanyitong.com/wximage/trip-pro/invoice/no-title-cont-icon.png" mode="" />
		    <text>暂未已开/未开发票~</text>
		</view>
	</view>
	<!-- 日历 -->
	<up-calendar :show="show" :mode="mode" maxRange='10' :maxDate="maxDate" @confirm="confirm"
		@close='show=false'></up-calendar>
	<etc-login v-if="layerShow" @closePop="closePop" @loginSuc="loginSuc"></etc-login>
</template>

<script setup lang="ts">
	import { imgUrl } from '../../config';
	import theme from '@/utils/theme'
	import { ref, onUnmounted } from 'vue';
	import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
	import {showAlert2,CurrentPage} from '@/utils/util';
	import EtcLogin from '@/pages_A/etcInvoice/components/EtcLogin.vue';
	// 引入组件，这里假设 CosHeader 组件的类型后续补充，先简单断言
	import CosHeader from '@/components/customNavBar/index.vue';
	import { etcInvoice } from '@/api/etcInvoice';
	import {showLoading,hideLoading,showToast,formatPlateNum} from '@/utils/util';
	import {formatMonthDate,formatDate} from '@/utils/date';
	import { useAppStore } from '@/store/modules/app';
	const appStore = useAppStore();
	const isLogin = ref(appStore.checkLogin());
	// 定义组件 props 的类型约束，实际应根据 CosHeader 真实 props 完善，这里示例
	interface CosHeaderProps {
		title : string;
		backgroundColor : string;
		fontColor : string;
		fixed : boolean;
		defaultNavBarheight : number;
	}

	const show = ref<boolean>(false);
	const mode = ref<string>('range');
	const d = new Date();
	const year = d.getFullYear();
	let month:string|number = d.getMonth() + 1;
	month = month < 10 ? `0${month}` : month;
	const date = d.getDate();
	const maxDate = `${year}-${month}-${date + 10}`;

	const confirm = (e) => {
		show.value = false
	};
	// 响应式变量
	const backgroundColor = ref<string>('#FFFFFF');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const iscategory = ref<boolean>(false);
	// 搜索关键字
	const searchKeyword = ref('');

	// 日期范围
	const dateRange = ref('2024.03 至 2024.06');

	
	const detailsFun=()=>{
		uni.navigateTo({
			url: '/pages_A/invoice/details'
		})
	}
	const invoicetitleFun=()=>{
		uni.navigateTo({
			url: '/pages_A/etcInvoice/headIndex'
		})
	}
	
	const carNum = ref('');
	const carNumStr = ref('');
	const cardId = ref('');
	const cardType = ref('');
	const endMounth = ref('');
	const monthValue = ref(null);
	
	const changeIndex = ref(1); //1按开票申请 2按行程
	const noContAppShow = ref(false);
	const noContPassShow = ref(false);
	const layerShow = ref(false);
	const passList = ref([]);
	const applyList = ref([]);
	const downType = ref(null);
	const statusSelect = ref(0);
	
	const options1 = ref([
		{
		    label: '按开票申请',
		    value: 1,
		  },
		  {
		    label: '按行程',
		    value: 2,
		  }
	]);
	const options2 = ref([
		{
		    label: '全部',
		    value: 0,
		  },
		{
		    label: '开票中',
		    value: 1,
		  },
		  {
		    label: '开票完成',
		    value: 2,
		  },
		  {
		    label: '发票已发送',
		    value: 3,
		  },
		  {
		    label: '开票失败',
		    value: 4,
		  }
	]);
	const statusItem = ref(null); 
	const categoryFun = (type) => {
		iscategory.value = !iscategory.value
		downType.value = type
	}
	const typeCahnge = (item) => {
		iscategory.value = false
		changeIndex.value = item.value;
		statusSelect.value = 0
		console.log("data",changeIndex.value,dataList.value);
	}
	const statusCahnge = (item) => {
		iscategory.value = false
		statusSelect.value = item.value
	}
	
	const dataList = computed(()=>{
		let arr = []
		if(changeIndex.value == 2){
			if(statusSelect.value > 0){
				console.log("))))))000");
				arr = passList.value.filter(item => item.invoiceProgressStatus == statusSelect.value)
			}else{
				arr = passList.value
			}
		}
		if(changeIndex.value == 1){
			if(statusSelect.value > 0){
				arr = applyList.value.filter(item => item.status == statusSelect.value)
			}else{
				arr = applyList.value
			}
		}
		
		console.log('------------>>>',arr,passList.value,applyList.value);
		return arr
	})
	
	const getApply =() =>{
	  
	  noContAppShow.value = false;
	  applyList.value = [];
	 
	  showLoading()
	  let params = {
	    serverUrl: 'appInvoiceSearchApplyRequest',
	    cardId: cardId.value,
	    month: monthValue.value,
	    pageSize: 1000,
	    pageNum: 1,
	  }
	  etcInvoice(params).then(res =>{
		  hideLoading()
		  if(res.data.success){
			  let records = res.data.items
			  if (records.length > 0) {
			    records.forEach(item => {
			      item['applyTime'] = item['applyTime'].replace(/T/, ' ')
			      item['sumAmount'] = toPrice(item.sumAmount)
			      item['statusStr'] = realStatus(item.status, item.applyType)
			      item['applyTypeStr'] = realType(item.applyType)
			    })
				applyList.value = records;
			  }
			  if (!res.data.total) {
				  noContAppShow.value = true;
			  }
		  }else{
			  showToast(res.data.msg)
		  }
		  
	  }).catch(err=>{
		  hideLoading()
		  if (err == 'etcTokenLoad') {
			  layerShow.value = true;
		  } else {
		    showToast(err)
		  }
	  })
	  
	}
	
	const getPass =()=> {
	  noContPassShow.value = false
	  passList.value = []
	  showLoading()
	  let params = {
	    serverUrl: 'appInvoiceSearchTransRequest',
	    cardId: cardId.value,
	    month: monthValue.value,
	    pageSize: 1000,
	    pageNum: 1,
	  }
	  etcInvoice(params).then(res =>{
		  hideLoading();
		  if(res.data.success){
			  let records = res.data.items
			  if (records.length > 0) {
			    records.forEach(item => {
			      item['exTime'] = item['exTime'].replace(/T/, ' ')
			      item['feeStr'] =toPrice(item.fee)
				  item['statusStr'] = realStatus(item.invoiceProgressStatus, 0)
			    })
			  }
			  passList.value = records
			  console.log("passList.value",passList.value);
			  if (records.length == 0) {
				  noContPassShow.value = true
			  }
		  }else{
			  
			  showToast(res.data.msg)
		  }
		  
	  }).catch(err =>{
		  hideLoading()
		  if (err == 'etcTokenLoad') {
			  layerShow.value = true
		  } else {
		    showToast(err)
		  }
	  })
	}
	const goApplyDetail =(index)=> {
	  let list:any = changeIndex.value == 1 ? applyList.value : passList.value
	  let applyData = list[index]
	  applyData['carNum'] = carNum.value
	  applyData['carNumStr'] = carNumStr.value
	  applyData['cardId'] = cardId.value
	  applyData['month'] = monthValue.value
	  uni.setStorageSync('applyData', applyData)
	  uni.navigateTo({
	    url: './details?type=' + (changeIndex.value == 1 ? 'apply' : 'pass'),
	  })
	}
	const realType =(type:number) => {
	  switch (type) {
	    case 1:
	      return '消费发票申请'
	    case 2:
	      return '充值发票申请'
	    case 7:
	      return '变更抬头申请'
	    case 9:
	      return '红冲申请'
	    default:
	      return '异常分类申请'
	
	  }
	}
	
	const realStatus=(status:number, type:any)=> {
	  switch (status) {
	    case 1:
	      if (type == 7) {
	        return '换票中'
	      }
	      return '开票中'
	    case 2:
	      if (type == 7) {
	        return '换票完成'
	      }
	      return '开票完成'
	    case 3:
	      return '发票已发送'
	    case 4:
	      return '开票失败'
	  }
	}
	
	const toPrice =(x) =>{
	  if (x !== null) {
	    let xx = x / 100;
	    let f = Math.round(xx * 100) / 100;
	    let s = f.toString();
	    let rs = s.indexOf('.');
	    if (rs < 0) {
	      rs = s.length;
	      s += '.';
	    }
	    while (s.length <= rs + 2) {
	      s += '0';
	    }
	    return s;
	  }
	  return x;
	}
	
	const change =(index)=> {
	  if (index == changeIndex.value) return
	  changeIndex.value = index
	}
	const closePop =()=> {
		layerShow.value = false
	}
	const loginSuc =()=> {
		getApply()
		getPass()
	}
	const mounthChange = (e: any) => {
	  const val = e.detail.value;
	  if (val === monthValue.value) return;
	  monthValue.value = val;
	  
	  
	  getApply()
	  getPass()
	};
	// 检查用户登录状态
	const checkUser = () => {
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
		}else{
			// checkEtcUser()
		}
	}
	const checkEtcUser = async () =>{
		let etcsUser = uni.getStorageSync('etcUser')
		if (!etcsUser || !etcsUser.mobile) {
			layerShow.value = true;
		}else{
			let loginMobile = uni.getStorageSync('userInfo').mobile
			// if (loginMobile != etcsUser.mobile) {
			// 	layerShow.value = true
			// }
			var params = {
				serverUrl: 'getTicketId',
				mobile: etcsUser.mobile
			}
			showLoading('鉴权中')
			etcInvoice(params).then(res =>{
				if (res.data) {
					let result = {
						ticketId: res.data,
						mobile: etcsUser.mobile
					}
					etcUser.value = result
					etcCards.value = []
					appStore.updateEtcUserInfo(result)
					// if (type.value == 'title') {
					//   getTitleCard()
					// } else {
					//   getEtcCard(1)
					// }
					
				} else {
					layerShow.value = true
				}
				hideLoading()
			}).catch(err=>{
				showToast(err)
				hideLoading()
			})
			
		}
	}
	onLoad((options)=>{
		cardId.value = options.id ? options.id : '';
		carNum.value = options.car ? options.car : ''
		carNumStr.value = options.car ? formatPlateNum(options.car) : ''
		cardType.value = options.cardtype ? options.cardtype : '';
		monthValue.value = formatMonthDate(new Date());
		endMounth.value = formatDate(new Date());
		// monthValue.value = "2025-02"
		// endMounth.value = "2025-02"
	})
	onShow(()=>{
		getApply()
		getPass();
		checkUser()
	})
</script>

<style scoped lang="scss">
	@import './index.scss';
	
	.categoryItem{
		line-height: 80rpx;
		font-size: 26rpx;
		padding: 0 25rpx;
		box-sizing: border-box;
	}
	.no-cont {
	    width: 100%;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	    margin-top: 300rpx;
	}
	
	.no-cont>image {
	    width: 114rpx;
	    height: 100rpx;
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
	    background-color: $color;
	    border-radius: 10rpx;
	    text-align: center;
	    line-height: 80rpx;
	    color: #fff;
	    font-size: 28rpx;
	}
	
	.apply-view {
	    width: 100%;
	    padding: 0 28rpx;
	    box-sizing: border-box;
	}
	
	.apply-view .time {
	    width: 100%;
	    height: 94rpx;
	    line-height: 94rpx;
	}
	
	.apply-view .apply {
	    width: 100%;
	    height: 274rpx;
	    background-color: #ffffff;
	    border-radius: 10rpx;
	    margin-bottom: 10rpx;
	    padding: 0 24rpx;
	    box-sizing: border-box;
	    position: relative;
	}
	
	.apply-view .apply>view:nth-child(1) {
	    width: 100%;
	    height: 66rpx;
	    line-height: 66rpx;
	    border-bottom: solid 1rpx #e1e1e1;
	}
	
	.apply-view .apply>view:nth-child(2) {
	    display: flex;
	    flex-direction: column;
	}
	
	.apply-view .apply>view:nth-child(2)>view:nth-child(1) {
	    width: 100%;
	    height: 76rpx;
	    line-height: 76rpx;
	}
	
	.apply-view .apply>view:nth-child(2)>view:nth-child(2) {
	    width: 100%;
	    height: 100rpx;
	    background-color: #f7f7f7;
	    display: flex;
	    align-content: center;
	}
	
	.apply-view .apply>view:nth-child(2)>view:nth-child(2)>view {
	    flex: 1;
	    height: 100rpx;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	}
	
	.apply-view .apply>view:nth-child(2)>view:nth-child(2)>view>text:nth-child(1) {
	    margin-bottom: 10rpx;
	}
	
	.apply-view .apply .status {
	    font-weight: bold;
	    font-size: 24rpx;
	    color: $color;
	    position: absolute;
	    top: 18rpx;
	    right: 24rpx;
	}
	
	.apply-view .apply .red {
	    color: #ff0000 !important;
	}
	.light-text{
		color: $color;
	}
	::v-deep .u-input {
		background: #F7F7F7;
		border: none;
	}
</style>