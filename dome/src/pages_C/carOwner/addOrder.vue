<template>
	<view class="order-page" :data-theme="pageTheme">
		<u-navbar title="填写订单" @leftClick="toBack" :fixed="true" :placeholder="true" bgColor="transparent"></u-navbar>

		<view class="content" v-if="info.id">
			<view class="card product-card">
				<view class="product-title">{{info.name}}</view>
				<!-- <view class="tag-group" v-if="info.spotTag.length > 0">
					<u-tag v-for="(tag, index) in info.spotTag" :key="index" :text="tag" plain size="mini" :color="themeStore.themeColors.$primaryColor" :borderColor="themeStore.themeColors.$primaryColor"></u-tag>
				</view> -->
				<view class="tag-wrap" v-if="info.spotTag.length > 0">
					<text v-for="(tag, index) in info.spotTag" :key="index">{{ tag }}</text>
				</view>
				<view class="date-box">
					<view class="date-item">
						<text class="label">出发日期</text>
						<text class="date-val">{{timeStart}}({{formatTimestamp(timeStart,'week')}})</text>
					</view>
					<view class="duration">
						<text>{{info.activityDays || ''}}天</text>
						<view class="line"></view>
					</view>
					<view class="date-item">
						<text class="label">结束日期</text>
						<text class="date-val">{{timeEnd}}({{formatTimestamp(timeEnd,'week')}})</text>
					</view>
				</view>
			</view>

			<view class="card">
				<view class="section-title">
					联系人信息<text class="sub">(合同签署及出团通知接收)</text>
				</view>
				<u-form :model="form" ref="uForm" labelWidth="160rpx" :labelStyle="{fontSize:'28rpx',fontWeight: 'bold'}">
					<u-form-item label="姓名" prop="contactName" borderBottom required>
						<u-input v-model="form.contactName" border="none" placeholder="请输入您的真实姓名"></u-input>
					</u-form-item>
					<u-form-item label="手机号码" prop="contactPhone" borderBottom required>
						<u-input v-model="form.contactPhone" border="none" maxlength="11" type="number" placeholder="请输入中国大陆手机号"></u-input>
					</u-form-item>
				</u-form>
			</view>

			<view class="card">
				<view class="section-title">出行人信息</view>
				<view class="stepper-row">
					<view class="info">
						<text class="type" style="font-size: 28rpx;font-weight: bold;">成人</text>
						<text class="price" style="font-size: 28rpx;font-weight: bold;">¥{{manCost}}</text>
					</view>
					<u-number-box v-model="adultCount" integer :min="1" buttonSize="30" :disabledInput="adultCount>1?false:true" disabledBgColor="#CCCCCC" color="#000" :bgColor="themeStore.themeColors.$primaryColor"
						iconStyle="color: #EBEFFF" @change="numBoxChange1" ></u-number-box>
				</view>
				<view class="stepper-row">
					<view class="info">
						<text class="type" style="font-size: 28rpx;font-weight: bold;">儿童</text>
						<text class="price" style="font-size: 28rpx;font-weight: bold;">¥{{childCost}}</text>
					</view>
					<u-number-box v-model="childCount" integer :min="0" buttonSize="30" disabledBgColor="#CCCCCC" color="#000" :bgColor="themeStore.themeColors.$primaryColor"
						iconStyle="color: #EBEFFF" @change="numBoxChange2"></u-number-box>
				</view>
				
				<view class="info-card" v-if="visitorId">
					<view class="delete-icon">
						<u-icon name="minus-circle" color="#ff4d4f" size="24" @click="visitorId=''"></u-icon>
					</view>
					<view class="content">
						<view class="top-row">
							<text class="name">{{visitorItem.name}}</text>
							<text class="gender">{{visitorItem.gender == 1?'男':'女'}}</text>
							<view class="tag-box">
								<text class="tag-text">{{visitorItem.type == 1?'成人':'儿童'}}</text>
							</view>
						</view>
						<view class="bottom-row">
							<text class="label">证件号码</text>
							<text class="id-number">{{visitorItem.idNumber}}</text>
						</view>
					</view>
					<view class="edit-icon">
						<u-icon name="edit-pen" @click="editVisitor(visitorItem)" color="#999" size="24"></u-icon>
					</view>
				</view>
				<view class="add-traveler-bar" v-else @click="groupShow = true">
					<view>
						<text style="font-size: 28rpx;color: #333333;">还需要添加 1成人</text>
						<!-- <text v-if="childCount>0">,{{childCount}}小孩</text> -->
					</view>
					<view class="add-btn">添加出行人</view>
				</view>
			</view>

			<view class="card">
				<view class="section-title">备注信息<text class="required">*</text></view>
				<u-textarea v-model="form.remark" placeholder="如有特殊病史或不宜参加的项目(项目),男女报名无法同住、分开报名需安排同住同车等,请备注。" count
					height="160rpx" bgColor="#f0f0f0" border="none" maxlength="140"></u-textarea>
			</view>

			<!-- <view class="card flex-between">
				<text class="section-title no-margin">优惠信息</text>
				<view class="coupon-val">
					<text>暂无可用</text>
					<u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
				</view>
			</view> -->

			<!-- <view class="agreement">
				<u-checkbox-group v-model="agreement">
					<u-checkbox shape="circle" :activeColor="themeStore.themeColors.$primaryColor" name="1"></u-checkbox>
				</u-checkbox-group>
				<view class="agreement-text">
					提交订单表示已阅读并接受<text class="link" @click="toNav('/pages_C/xieyi/index?type=carOwner')">《合同范本》</text>
					<view class="tips">
						*蓝色文字可点击查看详细内容，为支持绿色环保，默认签署电子合同，如有异议，请致电客服。
						*本产品有陕西西爱上高速有限公司提供代订服务。
					</view>
				</view>
			</view> -->
		</view>

		<view class="footer-bar">
			<view class="price-section">
				<view class="total">
					金额：<text class="symbol">¥</text><text class="amount">{{ amountItem.payableAmount }}</text>
				</view>
				<view class="detail" @click="showDetail = !showDetail">
					明细 <u-icon :name="showDetail ? 'arrow-down' : 'arrow-up'" size="12" :color="themeStore.themeColors.$primaryColor"></u-icon>
				</view>
			</view>
			<view class="submit-btn" @click="submitOrder">提交订单</view>
		</view>
		
		<!-- 明细 -->
		<up-popup mode="bottom" bgColor="#FFFFFF" :safeAreaInsetBottom="false" :show="showDetail" @close="showDetail=false">
			<view class="selectBox">
			  <view class="selectBox-top">
				  <text ></text>
				  <text class="selectBox-top-title">费用明细</text>
				  <text></text>
			  </view>
			  <view class="lebelBox" style="border-bottom: 1rpx solid #ccc;">
				  <text class="lebelBox-left">活动费用</text>
				  <text class="lebelBox-right" style="color: red;">{{amountItem.payableAmount}}</text>
			  </view>
			  <view class="lebelBox">
				  <text class="lebelBox-left">成人</text>
				  <text class="lebelBox-right">￥{{manCost}}x{{adultCount}}</text>
			  </view>
			  <view class="lebelBox">
				  <text class="lebelBox-left">儿童</text>
				  <text class="lebelBox-right">￥{{childCost}}x{{childCount}}</text>
			  </view>
			  <view class="lebelBox">
				  <text class="lebelBox-left">保险费用</text>
				  <text class="lebelBox-right">{{amountItem.insuranceAmount}}</text>
			  </view>
				<view class="btn-area">
				  <u-button text="确定" :color="themeStore.themeColors.$primaryColor" shape="circle" @click="showDetail=false"></u-button>
				</view>
			</view>
		</up-popup>
		<up-popup mode="bottom" bgColor="#FFFFFF" :safeAreaInsetBottom="false" :show="groupShow" @close="closeGroup">
			<view class="selectBox">
			  <view class="selectBox-top">
				  <text @click="closeGroup">取消</text>
				  <text class="selectBox-top-title">选择出行人</text>
				  <text @click="changeGroup">确定</text>
			  </view>
			  <view class="selectBox-add" @click="closeGroup;toNav('/pages_C/carOwner/addTraveler');">
				  +添加出行人
			  </view>
				<view>
					<view class="info-card" v-for="(item,index) in visitorList" :key="index"  style="background: none;margin-bottom:20rpx" @click="visitorCheckId = item.id">
						<view class="delete-icon">
							<u-icon :name="visitorCheckId == item.id?icoUrl+'check-car-icon.png':imgUrl+'car_normal1.png'" size="22"></u-icon>
						</view>
						<view class="content">
							<view class="top-row">
								<text class="name">{{item.name}}</text>
								<text class="gender">{{item.gender == 1?'男':'女'}}</text>
								<view class="tag-box">
									<text class="tag-text">{{item.type == 1?'成人':'儿童'}}</text>
								</view>
							</view>
							<view class="bottom-row">
								<text class="label">证件号码</text>
								<text class="id-number">{{item.idNumber}}</text>
							</view>
						</view>
						<view class="edit-icon">
							<u-icon name="edit-pen" color="#999" size="24" @click="editVisitor(item)"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</up-popup>
		<up-popup mode="center" bgColor="transparent" :safeAreaInsetBottom="false" :show="mouldhow" >
			<view style="width: 600rpx;">
				<view class="modal-container">
				  <view class="modal-title">恭喜您</view>
				  <view class="modal-text">{{info.resultMsg || "订单已受理，稍后爱上高速客服人员联系您完成本次自驾行报名后续步骤，请保持联系人通信畅通"}}</view>
				  <view class="footer-btns">
				    <button class="btn-submit" @click="handleSubmit">好的</button>
				  </view>
				</view>
			</view>
		</up-popup>
		<PageDurationTracker pageName="车主节下单" />
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { toNav,toBack,toRec } from '@/utils/route';
	import { roadTripInfo ,roadTripVisitorList,roadTripCreate,roadTripCalculateAmount,roadTripOrderDetails} from '@/api/carOwner';
	import { fetchWechatInfo, fetchWechatInfoAuthorization, getMiniUserInfo } from '@/api/login';
	import {addDays,formatTimestamp} from '@/utils/util'
	import { toast ,debounce} from '@/utils/common';
	import { postcreateOrder } from '@/api/scenicArea';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const mouldhow = ref(false)
	// 尝试初始化为带长度的空值
	const timeStart = ref('');
	const timeEnd = ref('');
	const timeRange = ref([]);
	const timeShow = ref(false)
	
	const form = ref({
		contactName: '',
		contactPhone: '',
		remark: ''
	});

	const adultCount = ref(1);
	const childCount = ref(0);
	const agreement = ref([]);
	const showDetail = ref(false);
	const manCost = ref(0);
	const childCost = ref(0);
	const groupShow = ref(false);
	const closeGroup = ()=>{
		groupShow.value = false;
	}
	const changeGroup = ()=>{
		if(!visitorCheckId.value) return toast('请选择出行人')
		// let arr = visitorList.value
		let items = visitorList.value.filter(item=> item.id == visitorCheckId.value)[0]
		if(items.type != 1) return toast('请选择成人')
		console.log('--00--00-0--0----0-',items);
		visitorId.value = visitorCheckId.value;
		groupShow.value = false;
		console.log('-0-0-0-0-0-0-0',groupShow.value);
	}
	const editVisitor = (item)=>{
		groupShow.value = false
		uni.setStorageSync('VisitorItem',item)
		toNav('/pages_C/carOwner/addTraveler')
	}
	// 价格计算
	// const totalPrice = computed(() => {
	// 	return (adultCount.value * 1888 + childCount.value * 988).toFixed(2);
	// });
	const totalPrice = ref(0)
	const goBack = () => {
		uni.navigateBack();
	};
	const handleAdultBlur = () => {
	    // 失去焦点时，如果值不合法，强制回填 1
	    if (!adultCount.value || adultCount.value < 1) {
	        adultCount.value = 1;
	        amountChange();
	    }
	}
	const numBoxChange1 = (e: any) => {
	    // 增加对空值 (e === '') 的判断
		console.log('-0-00-0-0--00',e);
	    if (!e || e.value < 1) {
	        // 使用 nextTick 强制 UI 层重新渲染为 1
			adultCount.value = 1;
	    } else {
			adultCount.value = e.value
	    }
		setTimeout(()=>{
			amountChange()
		},100)
	}
	// const numBoxChange1 = (e)=>{
	// 	if(adultCount.value < 1) adultCount.value = 1
	// 	setTimeout(()=>{
	// 		amountChange()
	// 	},100)
	// }
	const numBoxChange2 = (e)=>{
		setTimeout(()=>{
			amountChange()
		},100)
	}
	const amountItem = ref({
		payableAmount:0,//应付金额
		discountAmount:0,//优惠金额	
		insuranceAmount:0,//保险金额	
		isGroupPrice:false,//是否团期价格	
	})
	const amountChange = async () => {
		try{
			console.log('-00-0-0-0-0-0-',{
				roadTripId:info.value.id,
				startDate:timeStart.value,
				manNumber:adultCount.value,
				childNumber:childCount.value,
				insuranceStatus:true,
				memberId:uni.getStorageSync('userInfo').id,
			});
			const res = await roadTripCalculateAmount({
				roadTripId:info.value.id,
				startDate:timeStart.value,
				manNumber:adultCount.value,
				childNumber:childCount.value,
				insuranceStatus:true,
				memberId:uni.getStorageSync('userInfo').id,
			})
			amountItem.value = res.data
			console.log('-00-0-0-0-0-0-',res);
		}catch(err){
			console.log('-00-0-amountChange0-0-0-0-',err);
		}
	}
	const submitOrder = debounce(() => {
		handleSave();
	}, 600);
	const handleSave = async () => {
	  // if (agreement.value.length === 0) {
	  // 	uni.showToast({ title: '请先阅读并同意合同', icon: 'none' });
	  // 	return;
	  // }
	  if (!form.value.contactName) {
	  	uni.showToast({ title: '请输入联系人姓名', icon: 'none' });
	  	return;
	  }
	  if (!form.value.contactPhone) {
	  	uni.showToast({ title: '请输入联系人手机号', icon: 'none' });
	  	return;
	  }
	  if (!form.value.remark) {
	  	uni.showToast({ title: '请输入备注信息', icon: 'none' });
	  	return;
	  }
	  
	  if (!visitorId.value) {
	  	uni.showToast({ title: '请选择出行人信息', icon: 'none' });
	  	return;
	  }
	  // 此处触发提交逻辑
	  console.log('提交订单', { ...form.value, startDate:timeStart.value,
			  endDate:timeEnd.value,
			  manNumber: adultCount.value, 
			  childNumber: childCount.value,
			  roadTripId:info.value.id,
			  visitorIds:[visitorId.value] });
	  
	  try{
		  const res = await roadTripCreate({
			  ...form.value,
			  startDate:timeStart.value,
			  endDate:timeEnd.value,
			  manNumber: adultCount.value, 
			  childNumber: childCount.value,
			  roadTripId:info.value.id,
			  visitorIds:[visitorId.value],
			  insuranceStatus:true,
		  })
		  console.log('提交成功',res);
		  if(res.code == 200){
			  toast('提交成功')
			  getOrderDetail(res.data.parentOrderId)
			  // setTimeout(()=>{
				 //  toBack()
			  // },1500)
			  
		  }else{
			  toast(res.msg)
		  }
	  }catch(err){
		  toast(err.msg)
	  }
	  // uni.navigateBack();
	};
	const getOrderDetail = async (parentOrderId)=>{
		try{
			const res = await roadTripOrderDetails(parentOrderId)
			if(res.data.orderStatus == 0){
				topay(parentOrderId)
			}else{
				mouldhow.value = true
			}
			// 
		}catch(err){
			
		}
	}
	const info = ref({});
	const infoId = ref('')
	const getData = async ()=>{
		try{
			const res = await roadTripInfo({
				id:infoId.value,
				longitude:uni.getStorageSync('address').lng,
				latitude:uni.getStorageSync('address').lat,
			})
			info.value = res.data
			info.value.spotTag = res.data.spotTag ? res.data.spotTag.split(",") : []
			// timeEnd.value = addDays(Number(timeStart.value,info.value.activityDays) - 1)
			timeEnd.value = addDays(timeStart.value,Number(info.value.activityDays) - 1)
			console.log('-0-0-00-----0--0-0-0',res);
			amountChange()
		}catch(err){
			console.log({
				id:infoId.value,
				longitude:uni.getStorageSync('address').lng,
				latitude:uni.getStorageSync('address').lat,
			});
			console.log('-00-00-0err- -0-0-',err);
		}
	}
	const visitorItem = computed(()=>{
		let item = {}
		for(let i in visitorList.value){
			if(visitorId.value == visitorList.value[i].id){
				item = visitorList.value[i]
			}
		}
		return item
	})
	const visitorId = ref('');
	const visitorCheckId = ref('');
	const visitorList = ref([])
	const getVisitor = async ()=>{
		try{
			const res = await roadTripVisitorList()
			visitorList.value = res.data
			console.log('-00-00-getVisitor0--0-0-',res);
		}catch(err){
			console.log('-00-00getVisitor-0err--0-0-',err);
		}
	}
	const topay = async (outTradeNo) => {
		// 增加数据校验
		if (!info.value?.name) {
			uni.showToast({ title: '订单信息加载中', icon: 'none' });
			return;
		}
		let params = {
			description: info.value.name,
			outTradeNo: outTradeNo,
			// totalAmount: 0.01,
			totalAmount: Number(amountItem.value.payableAmount),
			// #ifdef MP-WEIXIN
				openId: openid.value
			// #endif
		}
		console.log('params', params);
		try {
			const res = await postcreateOrder(params);
			if (res.code==200) {
				console.log(res)
				// 1. 发起支付
				// 1.1 获取支付参数
				// 1.2 调起微信支付
				// 2. 调起微信支付
				uni.requestPayment({
					// #ifdef APP-PLUS
						provider: 'wxpay',
						orderInfo: {
							"appid": res.data.appId,        // 对应后端 appId
							"noncestr": res.data.nonceStr,  // 对应后端 nonceStr
							"package": res.data.packageVal, // 对应后端 packageVal
							"partnerid": res.data.partnerId,// 对应后端 partnerId
							"prepayid": res.data.prepayId,  // 对应后端 prepayId
							"timestamp": res.data.timeStamp,// 对应后端 timeStamp
							"sign": res.data.sign,// 对应后端 sign
						},
					// #endif
					// #ifdef APP-HARMONY
						provider: 'wxpay',
						orderInfo: JSON.stringify({
							"appid": res.data.appId,
							"noncestr": res.data.nonceStr,
							"package": res.data.packageVal,
							"partnerid": res.data.partnerId,
							"prepayid": res.data.prepayId,
							"timestamp": res.data.timeStamp,
							"sign": res.data.sign,
						}),
					// #endif
					// #ifdef MP-WEIXIN
						appId: res.data.appId,
						timeStamp: res.data.timeStamp,
						nonceStr: res.data.nonceStr,
						package: res.data.packageVal,
						paySign: res.data.paySign,
						signType: 'RSA',
					// #endif
						
					success: (payRes) => {
						uni.showToast({
							title: '支付成功',
							icon: 'none',
						});
						toRec('/pages_A/order/myorder?type=6');
					},
					fail: (err) => {
						console.error('支付失败', err)
						uni.showToast({ title: '支付失败', icon: 'error' })
						toRec('/pages_A/order/myorder?type=6');
					}
				})
			}
		} catch (error) {
			console.error('支付请求捕获错误', error)
			uni.showToast({ title: '请求失败', icon: 'error' })
		}
	
	};
	const handleSubmit = ()=>{
		mouldhow.value = false
		toRec('/pages_A/order/myorder?type=6');
	}
	onLoad((opticon)=>{
		infoId.value = opticon.id
		adultCount.value = uni.getStorageSync('carOwner-carDetails').adultNum
		childCount.value = uni.getStorageSync('carOwner-carDetails').kidNum
		timeStart.value = uni.getStorageSync('carOwner-carDetails').date
		manCost.value = uni.getStorageSync('carOwner-carDetails').manCost
		childCost.value = uni.getStorageSync('carOwner-carDetails').childCost
		
		uni.removeStorageSync('carOwner-carDetails')
		
		
		console.log('-0-0-00-----0--0-0-0',opticon);
		getData()
	})
	onShow(() => {
		getVisitor()
		// #ifdef MP-WEIXIN
		getOpenId()
		// #endif
	});
	const openid = ref('')
	const getOpenId = async ()=>{
		try{
			const wxCode = await getWxLoginCode();
			console.log('获取到的wxCode', wxCode);
			const wxInfoResp : any = await fetchWechatInfo({ code: wxCode });
			console.log('微信信息响应', wxInfoResp);
			openid.value = wxInfoResp.clazz.openid
		}catch(err){
			openid.value = uni.getStorageSync('wxPayOpenid')
		}
		console.log('openidopenidopenidopenid', openid.value);
	}
	const getWxLoginCode = () : Promise<string> => {
		return new Promise((resolve, reject) => {
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				success: (res) => {
					if (res?.code) {
						resolve(res.code);
					} else {
						reject(new Error('未返回 code'));
					}
				},
				fail: (e) => {
					reject(e);
				},
			});
			// #endif
	
			// #ifndef MP-WEIXIN
			reject(new Error('非小程序环境'));
			// #endif
		});
	};
</script>

<style lang="scss" scoped>
	.tag-wrap {
		width: 100%;
		display: flex;
		flex-wrap: wrap; // 开启自动换行
		align-items: center;
		gap: 12rpx 12rpx; // 行列间距（替代column-gap）
		row-gap: 10rpx; // 行间距
		
		text {
			display: inline-block;
			padding:4rpx 10rpx;
			border-radius: 2rpx;
			border: 1rpx solid var(--primary-color);
			// font-weight: 400;
			font-size: 24rpx;
			color: var(--primary-color);
			text-align: left;
			// 可选：限制标签最大宽度，防止单个标签过长
			max-width: 100%;
			// white-space: nowrap;
			// overflow: hidden;
			// text-overflow: ellipsis;
		}
	}
	.modal-container {
		  width: 600rpx;
		  background: linear-gradient(0deg, #FCFFFC 70%, #D8F7DE 100%);
		  border-radius: 24rpx;
		  padding: 60rpx 40rpx 40rpx;
		  box-sizing: border-box;
		}
		.modal-title {
		  text-align: center;
		  font-size: 32rpx;
		  font-weight: 500;
		  color: #333;
		  margin-bottom: 20rpx;
		}
		.modal-text{
			font-size: 28rpx;
			font-weight: 350;
			line-height: 48rpx;
			text-align: center;
			color: #333333;
			margin-bottom: 20rpx;
		}
	/* 底部按钮 */
		.footer-btns {
		  display: flex;
		  justify-content: space-between;
		  gap: 30rpx;
		}
		
		.btn-cancel {
		  flex: 1;
		  height: 90rpx;
		  line-height: 90rpx;
		  background-color: transparent;
		  border: 2rpx solid var(--primary-color);
		  color: var(--primary-color);
		  border-radius: 50rpx;
		  font-size: 32rpx;
		}
		
		.btn-submit {
		  flex: 1;
		  height: 90rpx;
		  line-height: 90rpx;
		  background: var(--but-color-line);
		  color: #ffffff;
		  border-radius: 50rpx;
		  font-size: 32rpx;
		  border: none;
		  
		  &::after {
		    border: none;
		  }
		}
	.selectBox{
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		.lebelBox{
			width: 100%;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			.lebelBox-left{
				
			}
			.lebelBox-right{
				color: #666;
			}
		}
		
		
		.selectBox-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding:20rpx 0;
			.selectBox-top-title{
				font-size:32rpx;font-weight: bold;
			}
		}
		.selectBox-add{
			width: 100%;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #E6E6E6;
			color: var(--primary-color);
		}
	}
	
	
	.info-card {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		background-color: #E5E6E6; // 对应图中的浅灰色背景
		border-radius: 12rpx;
		margin-top: 20rpx;
		.delete-icon {
			margin-right: 20rpx;
		}
	
		.content {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 12rpx;
	
			.top-row {
				display: flex;
				align-items: center;
				gap: 20rpx;
	
				.name {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
				}
	
				.gender {
					font-size: 28rpx;
					color: #333;
				}
	
				.tag-box {
					border: 1rpx solid #ccc;
					padding: 2rpx 12rpx;
					border-radius: 4rpx;
					background-color: #fff;
					
					.tag-text {
						font-size: 24rpx;
						color: #666;
					}
				}
			}
	
			.bottom-row {
				display: flex;
				align-items: center;
				gap: 20rpx;
	
				.label {
					font-size: 26rpx;
					color: #666;
				}
	
				.id-number {
					font-size: 26rpx;
					color: #333;
					font-family: Arial, Helvetica, sans-serif; // 保证数字展示更清晰
				}
			}
		}
	
		.edit-icon {
			padding-left: 20rpx;
		}
	}
	.order-page {
		background: var(--head-color);
		min-height: 100vh;
		padding-bottom: 140rpx;
	}
	.inCard-item{
		width: 100%;
		height: 150rpx;
		background: #EFEFEF;
		margin-top: 20rpx;
	}
	.content {
		padding: 20rpx;
	}

	.card {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}

	.product-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.tag-group {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
		margin-bottom: 30rpx;
	}

	.date-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1rpx solid #eee;
		padding-top: 20rpx;

		.date-item {
			display: flex;
			flex-direction: column;

			.label {
				font-size: 24rpx;
				color: #333;
			}

			.date-val {
				font-size: 28rpx;
				font-weight: bold;
				margin: 8rpx 0;
			}

			.sub-tip {
				font-size: 20rpx;
				color: var(--primary-color);
			}

			.pink {
				color: #ff4d94;
			}
		}

		.duration {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 22rpx;
			color: #999;

			.line {
				width: 60rpx;
				height: 2rpx;
				background-color: #ddd;
				margin-top: 10rpx;
				position: relative;

				&::after {
					content: '';
					position: absolute;
					right: 0;
					top: -4rpx;
					width: 10rpx;
					height: 10rpx;
					border-right: 2rpx solid #ddd;
					border-top: 2rpx solid #ddd;
					transform: rotate(45deg);
				}
			}
		}
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 24rpx;
		display: flex;
		align-items: center;

		.sub {
			font-size: 28rpx;
			color: #999;
			font-weight: normal;
			margin-left: 10rpx;
		}

		.required {
			color: #fa3534;
			margin-left: 6rpx;
		}
	}

	.no-margin {
		margin-bottom: 0;
	}

	.stepper-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;

		.info {
			.type {
				font-size: 28rpx;
				margin-right: 20rpx;
			}

			.price {
				font-size: 28rpx;
				font-weight: bold;
			}
		}
	}

	.add-traveler-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #f0f7f2;
		padding: 16rpx 24rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #666;

		.add-btn {
			color: var(--primary-color);
			border: 1rpx solid var(--primary-color);
			padding: 4rpx 20rpx;
			border-radius: 40rpx;
			font-size: 28rpx;
			font-weight: bold;
		}
	}

	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.coupon-val {
		display: flex;
		align-items: center;
		color: #fa3534;
		font-size: 26rpx;
		gap: 10rpx;
	}

	.agreement {
		display: flex;
		padding: 20rpx 10rpx;

		.agreement-text {
			font-size: 26rpx;
			color: #333;
			line-height: 1.6;
			margin-left: 10rpx;

			.link {
				color: var(--primary-color);
			}

			.tips {
				font-size: 22rpx;
				color: #999;
				margin-top: 10rpx;
			}
		}
	}

	.footer-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		padding-bottom: env(safe-area-inset-bottom);
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		z-index: 100;

		.price-section {
			flex: 1;

			.total {
				font-size: 26rpx;

				.symbol {
					color: #fa3534;
					font-weight: bold;
					margin-left: 10rpx;
				}

				.amount {
					color: #fa3534;
					font-size: 36rpx;
					font-weight: bold;
				}
			}

			.detail {
				font-size: 24rpx;
				color: var(--primary-color);
				display: flex;
				align-items: center;
				gap: 4rpx;
			}
		}

		.submit-btn {
			width: 320rpx;
			height: 84rpx;
			background: var(--but-color-line);
			color: #fff;
			border-radius: 42rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30rpx;
			font-weight: bold;
		}
	}
</style>