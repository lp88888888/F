<template>
  <view class="container" :data-theme="pageTheme">
    <u-navbar title="添加出行人" safeAreaInsetTop placeholder autoBack fixed></u-navbar>
    
    <view class="page-content">
      <u-form :model="traveler" ref="formRef" labelWidth="160rpx">
        <view class="group-title">身份信息</view>
        <view class="card-form">
          <u-form-item label="出行人姓名" prop="name" required borderBottom>
            <u-input v-model="traveler.name" border="none" placeholder="请输入真实姓名"></u-input>
          </u-form-item>
          <u-form-item label="证件类型" prop="idType" required borderBottom @click="showIdPicker = true">
            <!-- <u-input v-model="traveler.idType" border="none" placeholder="请选择" disabled disabledColor="#ffffff"></u-input> -->
			<text :class="{textActive:typeText == ''}">{{typeText || '请选择'}}</text>
            <template #right><u-icon name="arrow-right" color="#ccc"></u-icon></template>
          </u-form-item>
          <u-form-item label="证件号码" prop="idNumber" required borderBottom>
            <u-input v-model="traveler.idNumber" border="none" placeholder="请输入您的证件号码"></u-input>
          </u-form-item>
        </view>

        <view class="group-title">其他</view>
        <view class="card-form">
          <u-form-item label="类型" required borderBottom>
            <u-radio-group v-model="traveler.type" :activeColor="themeStore.themeColors.$primaryColor">
              <u-radio label="成人" name="1" customStyle="margin-right: 40rpx"></u-radio>
              <u-radio label="儿童" name="2"></u-radio>
            </u-radio-group>
          </u-form-item>
          <u-form-item label="性别" required borderBottom>
            <u-radio-group v-model="traveler.gender" :activeColor="themeStore.themeColors.$primaryColor">
              <u-radio label="男" name="1" customStyle="margin-right: 40rpx"></u-radio>
              <u-radio label="女" name="2"></u-radio>
            </u-radio-group>
          </u-form-item>
          <u-form-item label="手机号码" required borderBottom>
            <u-input v-model="traveler.mobile" border="none" maxlength="11" placeholder="请输入出行人本人手机号码"></u-input>
          </u-form-item>
          <u-form-item label="生日" required borderBottom @click="showCalendar = true">
            <!-- <u-input v-model="traveler.birthday" border="none" placeholder="选择生日" disabled disabledColor="#ffffff"></u-input> -->
			<text :class="{textActive:traveler.birthday == ''}">{{traveler.birthday || '请选择'}}</text>
            <template #right><u-icon name="arrow-right" color="#ccc"></u-icon></template>
          </u-form-item>
          <!-- <u-form-item label="医疗救急卡(选填)" borderBottom>
            <u-input border="none" placeholder="未填写" disabled disabledColor="#ffffff" inputAlign="right"></u-input>
            <template #right><u-icon name="arrow-right" color="#ccc" style="margin-left:10rpx"></u-icon></template>
          </u-form-item> -->
        </view>
      </u-form>

      <view class="agreement-box">
        <u-checkbox-group v-model="agree">
          <u-checkbox shape="circle" :activeColor="themeStore.themeColors.$primaryColor" name="agree"></u-checkbox>
        </u-checkbox-group>
        <view class="agreement-content">
          阅读并同意以下内容
          <view class="notice-text">
            您已知晓您在爱上高速录入的出行人身份证件信息，将用于您购买的旅游服务等所有需要实名制的旅游产品，并在使用时进行验证，请确保此信息的真实有效。爱上高速将通过加密等方式保护此信息，且仅在有具体交易时授权提供给相关第三方:
          </view>
        </view>
      </view>

      <view class="btn-area">
        <u-button text="提交" :color="themeStore.themeColors.$primaryColor" shape="circle" @click="handleConfirm"></u-button>
      </view>
    </view>

    <u-picker :show="showIdPicker" :columns="columns" keyName="dictLabel" @confirm="idConfirm" @cancel="showIdPicker = false"></u-picker>
	<!-- $$-631,152,000,000 \text{ 毫秒}$$ -->
    <!-- <u-datetime-picker :show="showCalendar" mode="date"  @confirm="dateConfirm" @cancel="showCalendar = false" :minDate="31536000000"></u-datetime-picker> -->
    <u-datetime-picker :show="showCalendar" mode="date"  @confirm="dateConfirm" @cancel="showCalendar = false" :minDate="-1041379200000"></u-datetime-picker>
  </view>
</template>

<script setup>
	import { ref, reactive,computed } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { roadTripSaveOrUpdate} from '@/api/carOwner';
	import { toast ,debounce} from '@/utils/common';
	import { toNav, toBack } from '@/utils/route';
	import { deepClone } from '@/uni_modules/uview-plus';
	
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const traveler = reactive({
		id:'',
		idType:'1', //证件类型（1身份证、2护照、3港澳通行证、4港澳居住证、5台胞证、6军官证、7回乡证、8其他）
		name: '', // 真实姓名
		idNumber: '', // 证件号码
		type: '1', // 类型1成人2儿童
		gender: '1', // 性别1男2女
		mobile: '', // 手机号
		birthday: '', // 生日
		englishName:'',
		placeOfIssue:'',
		validity:'',
		bloodType:'',
		height:'',
		weight:'',
		emergencyContact:'',
		relation:'',
		emergencyContactMobile:'',
		allergicHistory:'',
		medicalHistory:'',
		memberId:uni.getStorageSync('userInfo').id,
	});
	
	const columns = [
		[
			{dictLabel:'身份证',dictValue:'1'},
			// {dictLabel:'护照',dictValue:'2'},
			{dictLabel:'港澳通行证',dictValue:'3'},
			// {dictLabel:'港澳居住证',dictValue:'4'},
			// {dictLabel:'台胞证',dictValue:'5'},
			// {dictLabel:'军官证',dictValue:'6'},
			// {dictLabel:'回乡证',dictValue:'7'},
			// {dictLabel:'其他',dictValue:'8'},
		]
	]
	const typeText = computed(()=>{
		let arr = columns[0]
		let srt = ''
		for(let i in arr){
			if(arr[i].dictValue == traveler.idType){
				srt = arr[i].dictLabel
			}
		}
		return srt
	})
	const agree = ref([]);
	const showIdPicker = ref(false);
	const showCalendar = ref(false);

	const idConfirm = (e) => {
	  traveler.idType = e.value[0].dictValue;
	  showIdPicker.value = false;
	};

	const dateConfirm = (e) => {
		console.log('-0-000-0-0--00-0--0-0-0',e);
		let value = e.value?e.value:-1041379200000
		if(value){
			const date = new Date(value);
			let Month = date.getMonth() + 1
			let Day = date.getDate()
			traveler.birthday = `${date.getFullYear()}-${Month>9?Month:'0'+Month}-${Day>9?Day:'0'+Day}`;
		}
	  
	  showCalendar.value = false;
	};

	
	const handleConfirm = debounce(() => {
		handleSave();
	}, 600);
	const handleSave = async () => {
	  if(agree.value.length === 0) return uni.showToast({ title: '请勾选同意内容', icon: 'none' });
	  if(!traveler.name) return toast('请输入出行人姓名');
	  if(!traveler.idType) return toast('请选择证件类型');
	  if(!traveler.idNumber) return toast('请输入证件号码');
	  if(!traveler.birthday) return toast('请选择生日');
	  
		// let datas = deepClone(traveler)
		// datas.birthday = traveler.birthday?traveler.birthday.slice(-5):''
		// datas.birthday = '2011-06-19'
		// console.log(datas);
	  try{
		  const res = await roadTripSaveOrUpdate(traveler)
		  if(res.code == 200){
			  toast('提交成功')
			  setTimeout(()=>{
				  toBack()
			  },1500)
			  
		  }else{
			  console.log('-0-0-0-0-0-',res);
			  toast(res.msg)
		  }
	  }catch(err){
		  console.log('-0-0-0-err0-0-',err);
		  toast(err.msg)
	  }
	  // uni.navigateBack();
	};
	
	onLoad(()=>{
		if(uni.getStorageSync('VisitorItem')){
			for(let key in uni.getStorageSync('VisitorItem')){
				traveler[key] = uni.getStorageSync('VisitorItem')[key]
			}
			uni.removeStorageSync('VisitorItem')
		}
	})
</script>

<style lang="scss" scoped>
	.textActive{color:#c0c4cc;}
	.container { background-color: #F7F8FA; min-height: 100vh; padding-bottom: 60rpx; }
	.page-content { padding: 0 30rpx; }
	.group-title { font-size: 30rpx; font-weight: bold; padding: 30rpx 0 20rpx; }
	.card-form { background: #fff; border-radius: 16rpx; padding: 0 24rpx; }
	.pink-tip { color: #E91E63; font-size: 20rpx; line-height: 1.2; padding-bottom: 10rpx; }
	.agreement-box { display: flex; margin-top: 40rpx; .agreement-content { font-size: 26rpx; margin-left: 10rpx; .notice-text { font-size: 22rpx; color: #999; margin-top: 20rpx; line-height: 1.5; } } }
	.btn-area { margin-top: 60rpx; padding: 0 20rpx; }
</style>