<template>
	<view :data-theme="pageTheme">
		<u-sticky bgColor="transparent" z-index="99999">
		  	<view class="searchView">
		       <up-navbar title="新增联系人" bgColor="transparent"  @leftClick="toBack" placeholder
		       		:fixed="true"></up-navbar>
		  	</view>
		</u-sticky>
				<view class="ticket-form-page">
					<view class="form-container">
						<!-- 乘客类型选择 -->
						<!-- 	<view class="form-item">
							<text class="form-label">乘客类型</text>
							<view class="raidoCon" style="padding:20rpx 0">
								<view class="rowCon" v-for="item in passengerTypeOptions" :key="item.value"
									@click="handleRadioChange(item.value)">
									<image class="icAddRaido"
										:src="`${imgUrl}${passengerType == item.value ? 'car_select.png' : 'car_normal.png'}`" />
									<text class="tex32_33">{{item.label}}</text>
								</view>
							</view>
						</view> -->
						<view class="formView" @click="documentShow = true">
							<view class="formData-label">证件类型</view>
							<view class="formData-center">
								<!-- <up-input placeholder="请选择证件类型" readonly border="none" v-model="documentTypeLabel">
									<template #suffix>
										<up-icon name="arrow-right" size="16"></up-icon>
									</template>
								</up-input> -->
								<view class="inputBoooxxx">
									<text class="inputBoooxxx-text1" v-if="documentTypeLabel">{{documentTypeLabel}}</text>
									<text class="inputBoooxxx-text2" style="color: #9C948D" v-else>请选择证件类型</text>
									<up-icon name="arrow-right" size="16"></up-icon>
								</view>
							</view>
						</view>
						<u-picker :show="documentShow" :columns="[documentTypeList]" keyName="dictLabel"
							:confirmColor="themeStore.themeColors.$primaryColor" @close="prickClose" @cancel="prickClose"
							@confirm="prickConfirm"></u-picker>
						<!-- 姓名输入 -->
						<view class="form-item border-bottom">
							<text class="form-label">姓名</text>
							<u-input v-model="name" placeholder="请输入姓名" :border="false" class="form-input" />
						</view>
				
						<!-- 证件号码输入 -->
						<view class="form-item border-bottom">
							<text class="form-label">证件号码</text>
							<u-input v-model="idNumber" placeholder="请输入证件号" maxlength="30" :border="false" class="form-input" />
						</view>
				
						<!-- 手机号码输入 -->
						<view class="form-item border-bottom">
							<text class="form-label">手机号码</text>
							<u-input v-model="phoneNumber" placeholder="请输入手机号码" maxlength="11" :border="false" type="number"
								class="form-input" />
						</view>
				
						<!-- 提示信息 -->
						<view class="tips-text">
							<text class="required">*</text>
							<text style="color:#666666 ;">须提供<text style="color:#DD4F63;">本人手机号</text>进行购票，未成年/老人等重点旅客可填写<text
									style="color:#DD4F63;">亲友手机号</text></text>
						</view>
					</view>
				
					<!-- 底部确定按钮 -->
					<view class="bottom-btn-container">
						<view class="foot-bott" @click="handleSubmit">确认</view>
					</view>
				
					<!-- 证件类型选择弹窗 -->
					<!--    <u-select
				  v-model="showDocumentType"
				  :list="documentTypeList"
				  @confirm="handleDocumentTypeConfirm"
				  title="选择证件类型"
				></u-select> -->
				</view>
				
	</view>

</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import theme from '@/utils/theme';
	import { imgUrl } from '@/config';
	import { postsysIdentityInfo } from '@/api/scenicArea';
	import { getDict } from '@/api/config';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	import { toNav, toBack } from '@/utils/route';
	// 乘客类型数据
	const passengerType = ref<string>('adult');
	const title = ref('新增联系人');
	const passengerTypeOptions = [
		{ label: '成人票', value: 'adult' },
		{ label: '儿童票', value: 'child' },
		{ label: '老人票', value: 'elder' }
	];

	const documentShow = ref(false);
	// 证件类型数据
	const documentTypeList = ref([

	]);
	const documentType = ref<string>('idCard');
	// const documentTypeLabel = computed(() => {
	// 	const item = documentTypeList.find(item => item.value === documentType.value);
	// 	return item ? item.label : '';
	// });
	const documentTypeLabel = ref<string>('');
	const showDocumentType = ref<boolean>(false);
	const documentTypeid = ref<string>('');

	// 表单数据
	const name = ref<string>('');
	const idNumber = ref<string>('');
	const phoneNumber = ref<string>('');

	// 进度条
	const progress = ref<number>(25);

	// 表单验证
	const isFormValid = computed<boolean>(() => {
		return !!name.value && !!idNumber.value && !!phoneNumber.value;
	});
	const rid = ref('');
	onLoad((option) => {
		if (option.id) {
			rid.value = option.id
			name.value = option.name,
				documentTypeid.value = option.certType,
				phoneNumber.value = option.contactPhone,
				idNumber.value = option.certNo,
				title.value = '编辑联系人'
		}
		gettypelist();
	});
	const getinfo = async (e) => {
		try {
			const res = await getDict(e);
			name.value = res.data.name,
				documentTypeid.value = res.data.certType,
				phoneNumber.value = res.data.contactPhone,
				idNumber.value = res.data.certNo
			gettypelist();
		} catch (err) {

		}
	};
	const gettypelist = async () => {
		try {
			const res = await getDict('identity_cert_type');
			// 补充"全部"选项
			documentTypeList.value = res.data;
			documentTypeList.value.forEach((item, index) => {
				if (item.dictValue == documentTypeid.value) {
					documentTypeLabel.value = item.dictLabel
				}
			})
			console.log(documentTypeList.value, 'documentTypeList.value')
		} catch (err) {

		}
	};
	const handleSubmit = async () => {
		if (documentTypeid.value == '') {
			uni.showToast({
				title: '请选择证件类型',
				icon: 'none'
			})
			return
		}
		if (name.value == '') {
			uni.showToast({
				title: '请输入姓名',
				icon: 'none'
			})
			return
		}
		if (idNumber.value == '') {
			uni.showToast({
				title: '请输入证件号码',
				icon: 'none'
			})
			return
		}
		if (phoneNumber.value == '') {
			uni.showToast({
				title: '请输入手机号码',
				icon: 'none'
			})
			return
		}
		if (phoneNumber.value.length != 11) {
			uni.showToast({
				title: '请输入正确的手机号码',
				icon: 'none'
			})
			return
		}
		const phoneRegex = /^1[3-9]\d{9}$/;
		if (!phoneRegex.test(phoneNumber.value)) {
			uni.showToast({
				title: '手机号格式不正确',
				icon: 'none'
			});
			return;
		}
		try {
			let params = {
				certType: documentTypeid.value,
				name: name.value,
				contactPhone: phoneNumber.value,
				certNo: idNumber.value,
				id: rid.value || null
			}
			const res = await postsysIdentityInfo(params);
			if (res.code == 200) {
				uni.showToast({
					title: '提交成功',
					icon: 'success'
				});
				uni.navigateBack(1)
				// uni.redirectTo({
				// 	url: '/pages_B/scenicSpotTicket/contactsList'
				// })
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'success'
				});
			}
			// 补充"全部"选项
			console.log(res, 'documentTypeList.value')
		} catch (err) {

		}
	};
	const prickClose = () => {
		documentShow.value = false;
	};
	const prickConfirm = (event) => {
		console.log(event, 'event')
		const { value } = event;
		// documentTypeLabel.value = value[0].value;
		documentTypeid.value = value[0].dictValue
		documentTypeLabel.value = value[0].dictLabel;
		prickClose();
	};

	// 事件处理
	const handleRadioChange = (value : string) => {
		passengerType.value = value;
	};

	const handleDocumentTypeConfirm = (e : { value : string, label : string }) => {
		documentType.value = e.value;
	};
</script>

<style lang="scss" scoped>
	.searchView{
	 background:var(--head-color);
	}
	.inputBoooxxx {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;

		.inputBoooxxx-text1 {}

		.inputBoooxxx-text2 {
			color: #C1C5CD;
		}
	}

	.ticket-form-page {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding-bottom: 120rpx;
	}

	.form-container {
		background-color: #ffffff;
		margin-top: 16rpx;
		padding: 0 30rpx;
	}

	.form-item {
		display: flex;
		align-items: center;
		height: 112rpx;
		position: relative;

		&.border-bottom::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 30rpx;
			right: 30rpx;
			height: 1rpx;
			background-color: #f2f2f2;
		}
	}

	.form-label {
		font-size: 32rpx;
		color: #333333;
		width: 160rpx;
	}

	.radio-group {
		display: flex;
		gap: 40rpx;
		margin-left: auto;
	}

	.form-value {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: calc(100% - 160rpx);
		font-size: 32rpx;
		color: #333333;
	}

	.form-input {
		width: calc(100% - 160rpx);
		font-size: 32rpx;
	}

	.tips-text {
		padding: 24rpx 30rpx;
		font-size: 26rpx;
		color: #ff4d4f;
		display: flex;
		align-items: center;

		.required {
			color: #ff4d4f;
			margin-right: 6rpx;
		}
	}

	.bottom-btn-container {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 30rpx;
		background-color: #ffffff;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		padding-bottom: 60rpx;

		.foot-bott {
			width: 622rpx;
			height: 96rpx;
			background: var(--but-color-line);
			border-radius: 48rpx 48rpx 48rpx 48rpx;
			font-weight: 500;
			font-size: 32rpx;
			color: #FFFFFF;
			line-height: 96rpx;
			text-align: center;
		}
	}

	.raidoCon {
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 50rpx 0;
	}

	.rowCon {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-right: 20rpx;
	}

	.icAddRaido {
		width: 45rpx;
		height: 44rpx;
		margin-right: 20rpx;
	}

	.formView {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;

		.formData-label {
			width: 182rpx;
			font-size: 32rpx;
			color: #333333;
		}

		.formData-center {
			width: calc(100% - 160rpx);
		}
	}
</style>