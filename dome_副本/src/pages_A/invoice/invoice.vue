<template>
	<view class="">
		<view class="invoice" v-for="(item,index) in invoiceList" :style="{marginTop:index==0?'30rpx':''}">
		    <view>
		        <view>
		            <text class="tex24_66">发票金额</text>
		            <text class="tex32_33_b">{{item.totalAmount}}元</text>
		        </view>
		        <view class="tex28_33" @click="preview(index)">预览发票</view>
		    </view>
		    <view>
		        <view>
		            <text class="tex28_66">付款方：</text>
		            <text class="tex28_33 texNoWrap">{{item.buyerName}}</text>
		        </view>
		        <view v-if="item.buyerTaxpayerCode">
		            <text class="tex28_66">付款方税号</text>
		            <text class="tex28_33 texNoWrap">{{item.buyerTaxpayerCode}}</text>
		        </view>
		        <view>
		            <text class="tex28_66">收款方:</text>
		            <text class="tex28_33 texNoWrap">{{item.sellerName}}</text>
		        </view>
		        <view>
		            <text class="tex28_66">发票代码：</text>
		            <text class="tex28_33 texNoWrap">{{item.invoiceCode}}</text>
		        </view>
		        <view>
		            <text class="tex28_66">发票号码：</text>
		            <text class="tex28_33 texNoWrap">{{item.invoiceNum}}</text>
		        </view>
		        <view>
		            <text class="tex28_66">开票时间：</text>
		            <text class="tex28_33 texNoWrap">{{item.invoiceMakeTime}}</text>
		        </view>
		    </view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
	import { etcInvoice } from '@/api/etcInvoice';
	import {showToast,showToastSuccess,showLoading,hideLoading,isEmpty,isEmail} from '@/utils/util';
	const cardId = ref('');
	const applyId = ref('');
	const tradeId = ref('');
	const layerShow = ref(false);
	const invoiceList = ref([]);
	
	const getInvoice =()=> {
	  
	  showLoading()
	  let params = {
	    serverUrl: 'appInvoiceInvoiceListRequest',
	    cardId: cardId.value,
	  }
	
	  if (applyId.value) {
	    params.applyId = applyId.value
	  } else {
	    params.tradeId = tradeId.value
	  }
	  etcInvoice(params).then(res =>{
		 hideLoading();
		 if(res.data.success){
			 let invoicesList = res.data.items
			 if (invoicesList.length > 0) {
			   invoicesList.forEach(item => {
			     item['totalAmount'] = toPrice(item['totalAmount'])
			     item['invoiceMakeTime'] = item['invoiceMakeTime'].replace(/T/, ' ')
			   })
			 }
			 invoiceList.value = invoicesList;
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
	
	const preview =(index)=> {
		console.log(invoiceList.value[index].invoiceHtmlUrl);
	  uni.navigateTo({
	    url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(invoiceList.value[index].invoiceHtmlUrl),
	  })
	}
	
	onLoad((options)=>{
		if(options.apply) applyId.value = options.apply;
		if(options.card) cardId.value = options.card;
		if(options.tradeId) tradeId.value = options.tradeId;
		
		getInvoice()
	})
	
</script>

<style lang="scss">
	page {
	    background: url('https://tranalioss.shanyitong.com/wximage/trip-pro/invoice/invoice-bg.png') no-repeat, #F0F0F2;
	    background-size: 100% 412rpx;
	    padding-bottom: 30rpx;
	}
	
	.invoice {
	    width: 702rpx;
	    height: 503rpx;
	    background: url('https://tranalioss.shanyitong.com/wximage/trip-pro/invoice/invoce-detail-bg.png') no-repeat;
	    background-size: 100% 100%;
	    margin: 0 auto 20rpx;
	    padding: 0 24rpx 0 40rpx;
	    box-sizing: border-box;
	}
	
	.invoice>view:nth-child(1){
	    width: 100%;
	    height: 110rpx;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	}
	
	.invoice>view:nth-child(1)>view:nth-child(1){
	    height: 74rpx;
	    display: flex;
	    flex-direction: column;
	    justify-content: space-between;
	}
	
	.invoice>view:nth-child(1)>view:nth-child(2){
		width: 160rpx;
		height: 50rpx;
		background-color: #ffffff;
		border-radius: 25rpx;
	    border: solid 1rpx #666666;
	    box-sizing: border-box;
	    text-align: center;
	    line-height: 50rpx;
	}
	
	.invoice>view:nth-child(2){
	    flex: 1;
	    width: 100%;
	    padding-top: 16rpx;
	    box-sizing: border-box;
	}
	
	.invoice>view:nth-child(2)>view{
	    height: 60rpx;
	    display: flex;
	    align-items: center;
	}
	
	.invoice>view:nth-child(2)>view>text:nth-child(1){
	    width: 200rpx;
	}
	
	.invoice>view:nth-child(2)>view>text:nth-child(2){
	    flex: 1;
	    max-width: 440rpx;
	}
	
	.tex24_66{
		font-size: 24rpx;
		color: #666666;
	}
	.tex32_33_b{
		font-size: 32rpx;
		color: #333333;
		font-weight: bold;
	}
	.tex28_66{
		font-size: 28rpx;
		color: #666666;
	}
	.tex28_33{
		font-size: 28rpx;
		color: #333333;
	}
</style>