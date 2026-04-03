<template>
	<view style="background: #F1EFEC;">

		<view>
			<up-navbar title="" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"
				:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		</view>
		<view class="fixBg"></view>

		<view class="container">
			<!-- 预约信息 -->
			<view class="input-group">
				<text class="label">姓名</text>
				<up-input v-model="formData.name" placeholder="请输入您的姓名" border='none'></up-input>
			</view>

			<!-- 手机号码输入框 -->
			<view class="input-group">
				<view style="display: flex;align-items: center;">
					<text class="label">手机号码</text>
					<up-input v-model="formData.phone" type="number" placeholder="请输入手机号码" border='none'></up-input>
				</view>
			</view>

			<!-- 表格信息 -->
			<view class="table">
				<view class="row" @click="barOpen">
					<text class="cell label">品牌</text>
					<up-input v-model="carBrandName" placeholder="请选择品牌" readonly border="none"></up-input>
				</view>
				<view class="row" @click="barOpen">
					<text class="cell label">车系</text>
					<up-input v-model="carSeriesName" placeholder="请选择车系" readonly border="none"></up-input>
				</view>
				<view class="row" @click="barOpen">
					<text class="cell label">车型</text>
					<up-input v-model="carTypeName" placeholder="请选择车型" readonly border="none"></up-input>
				</view>
				<view class="row">
					<text class="cell label">维修项目</text>
					<text v-if="repairTypeName" class="cell repair" @click="selectRepairItems">{{repairTypeName}}</text>
					<text v-else class="cell value" @click="selectRepairItems">请选择维修项目</text>
				</view>
				<view class="row" @click="timeShow=true">
					<text class="cell label">到店时间</text>
					<up-input v-model="formData.appointmentTime" placeholder="请选择到店时间" readonly
						border="none"></up-input>
				</view>
				<view class="input-group">
					<text class="label">门店地址</text>
					<up-input v-model="formData.industryAddress" placeholder="请输入门店地址" border='none'></up-input>
				</view>
				<view class="row">
					<text class="cell label">门店</text>
					<text class="cell repair">{{ industryName }}</text>
				</view>
			</view>
			<up-datetime-picker :show="timeShow" v-model="timeValue" :minDate="minDate" closeOnClickOverlay
				mode="datetime" @cancel="timeClose" @close="timeClose" @confirm="timeConfirm"></up-datetime-picker>
			<BrandSelectPopup ref="brandSelect" @change="brandChange"></BrandSelectPopup>
			<up-picker :show="dealerShow" :columns="[repairTypeColumns]" :confirmColor="themeStore.themeColors.$primaryColor"
				@close="prickClose" @cancel="prickClose" @confirm="prickConfirm" keyName="dictLabel"
				valueName="dictValue"></up-picker>
		</view>
		<view class="" style="height: 178rpx;background: #F1EFEC;"></view>
		<view class="foot-box">
			<!-- 电话按钮 -->


			<!-- 删除预约按钮 -->
			<view class="delete-button" @click="toNav('/pages_D/repair/myAppointment')">我的预约记录</view>

			<!-- 修改预约按钮 -->
			<view class="edit-button" v-if="formData.serviceArea!=1"  @click="editReservation">立即预约</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import theme from '@/utils/theme';
	import { timeFormat } from '@/uni_modules/uview-plus';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { onLoad, onPageScroll } from '@dcloudio/uni-app';
	import BrandSelectPopup from '@/components/BrandSelectPopup/index';
	import { addPrRepairAppointment, getweixinlist,getprRepairAppointment } from '@/api/car';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	// 定义数据
	const formData = ref({
		name: '',
		phone: '',
		carBrandId: '', // 品牌id
		carSeriesId: '', // 车系id
		carTypeId: '', // 车型id
		appointmentTime: '', // 预约时间
		repairType: '', // 维修类型
		industryId: '', // 门店id
		manualFormData: 0, // 手动填写表单：0：否，1：是
		industryAddress:'',
		repairTypeName:''
	})
	const carBrandName = ref('');
	const carSeriesName = ref('');
	const carTypeName = ref('');
	const industryName = ref('');
	const timeShow = ref(false);
	const brandSelect = ref(null);
	const timeValue = ref<Date>(new Date())
	const minDate = ref<Date>(new Date());
	const dealerShow = ref(false);
	const repairTypeName = ref('');
	const repairTypeColumns = ref([
		
	])
	onLoad((options) => {
		if(options.weixiuid){
			getRepairAppointment(options.weixiuid)
			formData.value.industryId = options.id
			industryName.value = options.name
			
		}else{
			formData.value.industryId = options.id
			industryName.value = options.name
			getweixinlistData()
		}
		
	})
	const getRepairAppointment = async (id) => {
		const res = await getprRepairAppointment(id);
		formData.value = res.data
		carBrandName.value = formData.value.carBrandName
		carSeriesName.value = formData.value.carSeriesName
		carTypeName.value = formData.value.carTypeName
		repairTypeName.value = formData.value.repairTypeName
	}
	const getweixinlistData = async () => {
		const res = await getweixinlist('repair_appointment_type')
		repairTypeColumns.value = res.data
	}
	const barOpen = () => {
		brandSelect.value.open()
	}
	const brandChange = (event) => {
		formData.value.carBrandId = event.brandId
		formData.value.carSeriesId = event.seriesId
		formData.value.carTypeId = event.modelsId
		carBrandName.value = event.brandName
		carSeriesName.value = event.seriesName
		carTypeName.value = event.modelsName
	}
	const prickClose = () => {
		dealerShow.value = false;
	};
	const prickConfirm = (event) => {
		const { value } = event;
		formData.value.repairType = value[0].dictValue;
		formData.value.repairTypeName = value[0].dictLabel;
		repairTypeName.value = value[0].dictLabel;
		prickClose();
	};
	const timeClose = () => {
		timeShow.value = false;
	}
	const timeConfirm = (event) => {
		timeValue.value = event.value
		formData.value.appointmentTime = timeFormat(event.value, 'yyyy-mm-dd hh:MM:ss')
		timeClose()
	}

	const selectRepairItems = () => {
		dealerShow.value = true
	};

	const deleteReservation = () => {
		// 处理删除预约的逻辑
		console.log('Deleting reservation...');
	};
	const editReservation = async () => {
		try {
			const res = await addPrRepairAppointment(formData.value);
			uni.showToast({ title: res.msg, icon: 'none' });
			uni.navigateTo({
				url: '/pages_D/repair/myAppointment'
			})

		} catch (e : any) {
			uni.showToast({ title: e?.msg || '预约失败', icon: 'none' });
		}
	};
</script>

<style scoped lang="scss">
	page {
		background: #F1EFEC;
	}

	.foot-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 750rpx;
		height: 158rpx;
		background: #FFFFFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 40rpx;
		padding-top: 15rpx;
		padding-right: 30rpx;
		box-sizing: border-box;
	}

	.phone-button {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.phone-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}

	.phone-text {
		font-size: 28rpx;
		color: #333;
	}

	.delete-button {
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		font-size: 30rpx;
		color: $color;
		width: 330rpx;
		height: 80rpx;
		background: #FFFFFF;
		border-radius: 40rpx;
		border: 1px solid $color;
	}

	.edit-button {
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		font-size: 30rpx;
		color: #fff;
		width: 330rpx;
		height: 80rpx;
		background: $bgLgColor;
		border-radius: 40rpx;
	}


	.heeaer-box {
		margin: 30rpx 32rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		background-color: #fff;
		border-radius: 20rpx;
		position: relative;
		/* 确保内部元素可以相对于这个容器定位 */
		z-index: 2;
	}

	.icon-header {
		width: 130rpx;
		height: 130rpx;
		border-radius: 20rpx;
		margin-right: 27rpx;
	}

	.heeaer-box-right {
		padding: 20rpx 0;
	}

	.tit-name {
		margin-bottom: 38rpx;
		font-weight: bold;
		font-size: 30rpx;
		color: #000000;
	}

	.icon-header-2 {
		width: 24rpx;
		height: 24rpx;
		margin-right: 16rpx;
	}

	.tit-time {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #666666;
	}

	.fixBg {
		width: 750rpx;
		height: 750rpx;
		background-image: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/wf.png');
		background-repeat: no-repeat;
		background-size: 750rpx 750rpx;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}


	.container {
		border-radius: 20rpx;
		margin-top: 450rpx;
		position: relative;
		/* 确保内部元素可以相对于这个容器定位 */
		z-index: 2;
		/* 设置比背景层更高的z-index值 */
		padding: 39rpx 39rpx 0 39rpx;
		background: #fff;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.input-group {
		height: 116rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #eee;
	}

	.label {
		width: 150rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;
	}

	.input {
		flex: 1;
		height: 80rpx;
		border: 1rpx solid #ccc;
		border-radius: 8rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
	}

	.get-code-button {
		margin-left: 20rpx;
		color: $color;
		font-size: 28rpx;
	}

	.table {
		margin-top: 20rpx;
	}

	.row {
		height: 116rpx;
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #eee;
	}

	.cell {
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;
	}

	.cell.value {
		font-weight: 500;
		font-size: 28rpx;
		color: #C0C3CB;
	}

	.repair {
		font-weight: 500;
		font-size: 28rpx;
		color: #000000;
	}
</style>