<template>
	<view class="container" :data-theme="pageTheme">
		<view class="address-edit-page">
			<!-- 表单区域 -->
			<view class="form-card">
				<view class="form-items">
					<text class="label-req">抬头类型</text>
					<view
						style="margin: 4px 0 0 130rpx; display: flex;flex-direction: column;justify-content: space-between;">
						<up-radio-group v-model="formData.titleType" placement="row" :disabled="formData.type=='look'"
							:activeColor='themeStore.themeColors.$color'>
							<up-radio :customStyle="{marginBottom: '8px'}" labelSize="14" size="14" label="个人"
								:name="1">
							</up-radio>
							<up-radio :customStyle="{marginBottom: '8px'}" labelSize="14" size="14" label="公司"
								:name="2">
							</up-radio>
						</up-radio-group>
					</view>
				</view>
				<view class="form-item" style="margin-top: 10rpx;">
					<text class="label-req">发票抬头名称</text>
					<view class="input-box">
						<input v-model="formData.titleName" class="input" maxlength="20" placeholder="请填写发票抬头"
							placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
				</view>
				<view class="form-item">
					<view :class="formData.titleType==2?'label-req':'label'"
						style="width: 100%;display: flex;gap: 70rpx;">
						<text>纳税人识别号</text>
						<view style="display: flex;align-items: center;font-size: 22rpx;gap: 10rpx;margin-right: 20px;">
							<up-icon name="info-circle" size="14"></up-icon>
							<text>选填，个人无需填写</text>
						</view>
					</view>
					<view class="input-box">
						<input v-model="formData.taxNum" class="input" maxlength="30" :disabled="formData.type=='look'"
							placeholder="请输入公司税号" placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
				</view>
				<view class="form-item">
					<text class="label">开票金额(元)</text>
					<view class="input-box">
						<input v-model="formData.money" class="input" maxlength="100" disabled
							placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
				</view>
				<view class="form-item">
					<text class="label">单位地址</text>
					<view class="input-box">
						<input v-model="formData.address" class="input" maxlength="30" placeholder="请输入单位地址"
							placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
				</view>
				<view class="form-item">
					<text class="label">开户行名称</text>
					<view class="input-box">
						<input v-model="formData.bankName" class="input" maxlength="19" placeholder="请输入开户行名称"
							placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
				</view>
				<view class="form-item">
					<text class="label">开户行账号</text>
					<view class="input-box">
						<input v-model="formData.bankAccount" class="input" maxlength="20" placeholder="请输入开户行账号"
							placeholder-class="placeholder" placeholder-style="color: #C8C9CB"></input>
					</view>
				</view>
				<!-- 	<view class="form-item">
					<view class="label" style="width: 100%;display: flex;gap: 20rpx;">
						<text>邮箱</text>
						<view style=" display: flex;align-items: center;font-size: 22rpx;gap: 10rpx;">
							<up-icon name="info-circle" size="14"></up-icon>
							<text> 电子发票将发送至此邮箱，请确保地址准确</text>
						</view>
					</view>
					<view class="input-box">
						<input v-model="formData.email" class="input" maxlength="50" placeholder="请输入邮箱"
							placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
				</view> -->
				<view class="form-item" style="padding-bottom: 40rpx;">
					<text class="label">备注(选填)</text>
					<view class="input-box">
						<up-textarea v-model="formData.remark" placeholder="请输入内容" count border='none'
							maxlength="200"></up-textarea>
					</view>
				</view>
				<view class="form-item" v-if="isishow" style="padding-bottom: 40rpx;">
					<text class="label-req">重开原因</text>
					<view class="input-box">
						<up-textarea v-model="formData.reInvoiceReason" placeholder="请输入内容" count border='none'
							maxlength="200"></up-textarea>
					</view>
				</view>
				<!-- <view class="more">
					更多信息<uni-icons type="bottom" size="16" color="#999"></uni-icons>
				</view> -->
			</view>
			<view style="height:200rpx;"></view>
			<!-- 保存按钮 -->
			<view class="bottom-bar">
				<view class="save-btn" @click="submitFun()">
					提交
				</view>
			</view>
		</view>
		<u-popup :show="check" mode="bottom" @close="check=false" :closeable='true'>
			<view class="popup-box">
				<view class="popup-tit">
					开票信息确认
				</view>
				<view class="popup-card">
					<view class="popup-card-box">
						<view class="fptitle">发票抬头 :</view>
						<view>{{formData.titleName}}</view>
					</view>
					<view class="popup-card-box">
						<view class="fptitle">税号 :</view>
						<view>{{formData.taxNum}}</view>
					</view>
					<!-- <view class="popup-card-box">
						<view class="fptitle">电子邮箱 :</view> <view>{{formData.email}}</view>
					</view> -->
					<view class="popup-card-box">
						<view class="fptitle">金额 :</view>
						<view>￥{{formData.money}}</view>
					</view>
					<!-- <view class="tishi">
						<image :src="imgUrl+'img/heigantan.png'" mode=""></image>
						如无特殊情况，我们将在24小时内将发票发送至邮箱
					</view> -->
				</view>
				<view class="popop-bot" @click="doSearch1 " v-if="isishow">
					确认开票
				</view>
				<view class="popop-bot" @click="doSearch" v-else>
					确认开票
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive } from 'vue';
	import { onLoad, onShow,onBackPress  } from '@dcloudio/uni-app';
	import { imgUrl } from '../../config';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { applyForm, invoiceobj, reInvoiceForm } from '@/api/invoice';
	import { test } from '@/uni_modules/uview-plus';
	import { showToast, showToastSuccess, showLoading, hideLoading } from '@/utils/util';
	import { debounce } from '@/utils/common'
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const backgroundColor = ref<string>("#FFFFFF");
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const check = ref(false);
	const navBarHeight = ref(0);
	const layerShow = ref<boolean>(false);
	const orderItems = ref({});
	const isishow = ref(false);
	onMounted(() => {
		// 从cos-header组件获取实际高度或计算
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});

	// 表单数据类型
	interface FormData {
		titleType : number | string;
		titleId : number;
		titleName : string;
		taxNum : string;
		address : string;
		bankName : string;
		bankAccount : string;
		email : string;
		money : number | string;
		remark : string,
		reInvoiceReason : string
	}

	// 响应式数据
	const formData = reactive<FormData>({
		titleType: 1,
		titleId: '',
		titleName: '',
		taxNum: '',
		address: '',
		bankName: '',
		bankAccount: '',
		email: '',
		money: '',
		remark: '',
	})
	// 回填
	const invoiceobjFun = async (id) => {
		try {
			const res = await invoiceobj(id);
			if (res.code == 200) {
				// formData.titleType=res.data.titleType
				// formData.titleName=res.data.titleName
				// formData.taxNum = res.data.taxNum
				// formData.address =res.data.address
				// formData.bankName = res.data.bankName
				// formData.bankAccount = res.data.bankAccount
				// formData.email = res.data.email
				formData.money = res.data.invoiceAmount
				// formData.remark = res.data.remark
				formData.titleId = res.data.id
			}
		} catch (error) {
			console.error('获取订单列表失败：', error);
		}
	};
	const submitFun = () => {
		if (!formData.titleName) {
			return showToast('请输入抬头名称')
		}
		if (formData.titleType == 2 && !formData.taxNum) {
			return showToast('请输入税号')
		}
		if (formData.email) {
			if (test.email(formData.email) == false) {
				return showToast('邮箱格式不正确')
			}
		}
		if (isishow.value) {
			if (!formData.reInvoiceReason) {
				return showToast('请输入重开原因')
			}
		}
		check.value = true
	}
	const toJump = (url : String) => {
		uni.navigateTo({
			url: url
		})
	}
	const doSearch = debounce(() => {
		handleSave();
	}, 500);
	const doSearch1 = debounce(() => {
		reInvoiceFun();
	}, 500);
	// 保存提交
	const handleSave = async () => {
		// 组装参数
		const params = {
			orderItems: orderItems.value,
			titleType: formData.titleType,
			titleName: formData.titleName,
			taxNum: formData.taxNum,
			address: formData.address,
			bankName: formData.bankName,
			bankAccount: formData.bankAccount,
			email: formData.email,
			remark: formData.remark
		}

		try {
			// 等待接口返回
			const res = await applyForm(params)
			if (res.code === 200) {
				uni.redirectTo({ url: '/pages_F/myInvoice/scusses' })
				// setTimeout(() => {
				// 	uni.redirectTo({ url: '/pages_F/myInvoice/scusses' })
				// }, 800)
				uni.removeStorageSync('selectedInvoiceOrders')
				uni.setStorageSync('selecteShowe', '1');
			} else {
				 uni.showToast(res.data?.msg || '提交失败')
			}
		} catch (err) {
           uni.showToast({ title: err.msg, icon: 'none',duration: 4000 });
		} finally {
	
		}
	}

	// 重新开票
	const reInvoiceFun = async () => {
		const params = {
			titleType: formData.titleType,
			invoiceRecordId: formData.titleId,
			titleName: formData.titleName,
			taxNum: formData.taxNum,
			address: formData.address,
			bankName: formData.bankName,
			bankAccount: formData.bankAccount,
			email: formData.email,
			remark: formData.remark,
			reInvoiceReason: formData.reInvoiceReason,
		}
		try {
			showLoading()
			const res = await reInvoiceForm(params)
			if (res.code === 200) {
				uni.redirectTo({ url: '/pages_F/myInvoice/scusses' })
				// setTimeout(() => {
				// 	uni.redirectTo({ url: '/pages_F/myInvoice/scusses' })
				// }, 800)
			} else {
				 uni.showToast(res.data?.msg || '重新开票失败')
			}
		} catch (err) {
			uni.showToast({ title: err.msg, icon: 'none',duration: 4000 });
		} finally {
			
		}
	}
	const closePop = () => {
		layerShow.value = false
	}
	// 初始化数据（如果是编辑）
	onLoad((options) => {
		if (uni.getStorageSync('selectedInvoiceOrders')) {
			orderItems.value = uni.getStorageSync('selectedInvoiceOrders');
		}
		if (options.money) {
			formData.money = options.money
		}
		if (options.id) {
			isishow.value = true
			invoiceobjFun(options.id)
		}
	})
</script>

<style lang="scss" scoped>
	.popup-box {
		padding: 32rpx;
		z-index: 9999;

		.popup-tit {
			font-weight: 700;
			font-size: 36rpx;
			color: #3D3D3D;
			line-height: 72rpx;
			text-align: center;
		}

		.popup-card {
			width: 622rpx;
			background: rgba(103, 58, 0, 0.03);
			border-radius: 24rpx;
			padding: 32rpx;
			margin-top: 32rpx;

			.tishi {
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;
				display: flex;
				align-items: center;

				image {
					height: 32rpx;
					width: 32rpx;
					margin-right: 20rpx;

				}
			}

			.popup-card-box {
				font-weight: 500;
				font-size: 28rpx;
				font-weight: 800;
				color: #000;
				margin-bottom: 40rpx;
				display: flex;

				text {
					display: inline-block;
					width: 140rpx;
					font-weight: 400;
					font-size: 28rpx;
					color: #666666;
					text-align: right;
				}


			}

		}

	}

	.popop-bot {
		width: 622rpx;
		height: 80rpx;
		background: var(--but-color-line);
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		font-weight: 700;
		font-size: 32rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 80rpx;
		margin: 60rpx auto 0;
	}

	.more {
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.text-a {
		font-weight: 500;
		font-size: 28rpx;
		color: #666666;
		line-height: 28rpx;
		margin-bottom: 24rpx;
		display: inline-block;
	}

	.check-box {
		display: flex;
		align-items: center;
		font-weight: 400;
		font-size: 28rpx;
		color: #999999;
		line-height: 28rpx;

	}

	.address-edit-page {
		padding: 40rpx 32rpx 0;
		background-color: #F1EFEC;
		min-height: 100vh;
		box-sizing: border-box;

		.form-card {
			width: 686rpx;
			background: #FFFFFF;
			border-radius: 26rpx;
			margin-bottom: 40rpx;
			border-radius: 16rpx;
		}

		.form-item-label {
			padding: 40rpx 0 40rpx 30rpx;
			display: flex;
			justify-content: flex-start;

			.label {

				width: 170rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #000000;
			}

		}

		.form-items {
			display: flex;
			align-items: center;
			padding: 20rpx 0 20rpx 40rpx;
			border-bottom: 1rpx solid #eee;
			gap: 160rpx;
		}

		.form-item {
			padding: 10rpx 0 10rpx 40rpx;

			.label-req,
			.label {
				width: 170rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #7F7F7F;
				position: relative;
				display: inline-block;
				margin-bottom: 20rpx;
			}

			.label-req::before {
				content: "*";
				color: red;
				position: absolute;
				left: -20rpx;
			}

			.input-box {
				background: #F8F9FA;
				padding: 16rpx 0;
				width: 94%;
				border-radius: 16rpx;
			}

			.input {
				font-size: 28rpx;
				color: #000000;
				padding: 0 20rpx;

				&.full-width {
					margin-left: 170rpx;
				}

				.value {
					flex: 1;

					&.placeholder {
						color: #C8C9CB;
					}
				}
			}

			.placeholder {
				color: #C8C9CB;
			}
		}

		.tag-container {
			display: flex;
			flex-wrap: wrap;
			flex: 1;

			.tag {
				min-width: 130rpx;
				height: 56rpx;
				padding: 10rpx 30rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				background: #F6F6F6;
				border-radius: 28rpx;
				font-size: 28rpx;
				color: #000000;
				box-sizing: border-box;
				text-align: center;

				&.active {
					background-color: var(--primary-color);
					color: #fff;
				}
			}

			.custom-input {
				width: 150rpx;
				height: 60rpx;
				background-color: #f5f5f5;
				border-radius: 30rpx;
				padding: 0 20rpx;
				font-size: 26rpx;
			}
		}

		.bottom-bar {
			background: #fff;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 30rpx 32rpx 30rpx;
			display: flex;
			justify-content: center;
			z-index: 9999;

			.save-btn {
				width: 622rpx;
				height: 86rpx;
				background: var(--but-color-line);
				border-radius: 45rpx;
				font-weight: 500;
				font-size: 30rpx;
				color: #FFFFFF;
				text-align: center;
				line-height: 86rpx;

			}
		}
	}

	.fptitle {
		min-width: 200rpx;
	}

	::v-deep .u-textarea {
		background: transparent !important;
	}

	::v-deep .u-textarea__field {
		height: 260rpx !important;
	}

	::v-deep .u-textarea__count {
		background: transparent !important;
	}
</style>