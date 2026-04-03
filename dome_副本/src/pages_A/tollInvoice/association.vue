<template>
	<view class="container" :data-theme="pageTheme">
		<view class="address-edit-page">
			<!-- 表单区域 -->
			<text class="text-a">发票信息</text>
			<view class="form-card">
				<view class="form-item">
					<text class="label-req">抬头类型</text>
					<view style="height: 112rpx; display: flex;flex-direction: column;justify-content: space-between;">
						<up-radio-group v-model="formData.titleType" placement="column"
							:disabled="formData.type=='look'">
							<up-radio :customStyle="{marginBottom: '8px'}" labelSize="14" size="14" label="个人/非企业单位"
								:name="1">
							</up-radio>
							<up-radio :customStyle="{marginBottom: '8px'}" labelSize="14" size="14" label="企业单位"
								:name="2">
							</up-radio>
						</up-radio-group>
					</view>
				</view>
				<view class="form-item">
					<text class="label-req">抬头名称</text>
					<input v-model="formData.name" class="input" maxlength="50" placeholder="请输入抬头名称"
						placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
				</view>
				<view class="form-item">
					<text :class="formData.titleType==2?'label-req':'label'">公司税号</text>
					<view class="input">
						<input v-model="formData.taxNum" class="input" maxlength="50" :disabled="formData.type=='look'"
							placeholder="请输入公司税号" placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
				</view>
				<view class="form-item">
					<text class="label">公司地址</text>
					<view class="input">
						<input v-model="formData.address" class="input" maxlength="100" placeholder="请输入公司地址"
							placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
				</view>
				<view class="form-item">
					<text class="label">注册电话</text>
					<view class="input">
						<input v-model="formData.tel" class="input" type="number" maxlength="20" placeholder="请输入公司注册电话"
							placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
				</view>
				<view class="form-item">
					<text class="label">开户银行</text>
					<view class="input">
						<input v-model="formData.bank" class="input" maxlength="50" placeholder="请输入公司开户银行"
							placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
				</view>
				<view class="form-item">
					<text class="label">银行账号</text>
					<view class="input">
						<input v-model="formData.bankAccount" class="input" type="number" maxlength="50"
							placeholder="请输入银行账号" placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
					</view>
				</view>
				<view class="form-item">
					<text class="label-req">邮箱</text>
					<input v-model="formData.email" class="input" maxlength="50" placeholder="请输入邮箱"
						placeholder-class="placeholder" placeholder-style="color: #C8C9CB" />
				</view>
				<!-- <view class="more">
					更多信息<uni-icons type="bottom" size="16" color="#999"></uni-icons>
				</view> -->
			</view>
			<!-- <text class="text-a">接收邮箱</text>
			<view class="form-card">
				<view class="form-item">
					<text class="label">邮箱</text>
					<input v-model="formData.email" class="input" placeholder="请输入您的邮箱" placeholder-class="placeholder"
						placeholder-style="color: #C8C9CB" />
				</view>
			</view> -->
			<!-- 保存按钮 -->
			<view class="bottom-bar">
				<view class="save-btn" @click="check=true">
					提交
				</view>
			</view>
		</view>
		<u-popup :show="check" mode="bottom" @close="check=false" :closeable='true'>
			<view class="popup-box">
				<view class="popup-tit">
					电子发票开具确认
				</view>
				<view class="popup-card">
					<view class="popup-card-box">
						<text>抬头类型 :</text> {{formData.titleType == 2?'企业单位':'个人/非企业单位'}}
					</view>

					<view class="popup-card-box">
						<text>抬头名称 :</text> {{formData.name}}
					</view>
					<view class="popup-card-box">
						<text>税号 :</text> {{formData.taxNum}}
					</view>
					<view class="popup-card-box">
						<text>地址 :</text> {{formData.address}}
					</view>
					<view class="popup-card-box">
						<text>电话 :</text> {{formData.tel}}
					</view>
					<view class="popup-card-box">
						<text>开户银行 :</text> {{formData.bank}}
					</view>
					<view class="popup-card-box">
						<text>银行账号 :</text> {{formData.bankAccount}}
					</view>
					<view class="popup-card-box">
						<text>邮箱:</text> {{formData.email}}
					</view>
					
					<!-- <view class="popup-card-box">
						<text>开票金额 :</text> 1968.00
					</view> -->
					<!-- <view class="popup-card-box">
						<text>电子邮箱 :</text> xxxxxxxxxxxxxxxxx@163.com
					</view> -->
					<view class="tishi">
						<image :src="imgUrl+'img/heigantan.png'" mode=""></image>
						如无特殊情况，我们将在24小时内将发票发送至邮箱
					</view>
				</view>
				<view class="popop-bot" @click="handleSave">
					确认提交
				</view>
			</view>
		</u-popup>
		<etc-login v-if="layerShow" ref="etcLoginRef" @closePop="closePop"></etc-login>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '../../config';
	import EtcLogin from '../etcInvoice/components/EtcLogin.vue';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { etcInvoice } from '@/api/etcInvoice';
	import { showToast, showToastSuccess, showLoading, hideLoading } from '@/utils/util';
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
	onMounted(() => {
		// 从cos-header组件获取实际高度或计算
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});

	// 表单数据类型
	interface FormData {
		titleType : number | string;
		name : string;
		taxNum : string;
		address : string;
		tel : string;
		bank : string;
		bankAccount : string;
		ticketId : string;
		type : string;
		titleId : string;
		email:string
	}

	// 响应式数据
	const formData = reactive<FormData>({
		titleId: '',
		type: '',
		titleType: 1,
		name: '',
		taxNum: '',
		address: '',
		tel: '',
		bank: '',
		bankAccount: '',
		ticketId: '',
		email:''
	})
	const toJump = (url : String) => {
		uni.navigateTo({
			url: url
		})
	}
	// 保存地址
	const handleSave = () => {
		console.log(formData);
		console.log(formData.name);

		if (!formData.name) {
			return showToast('请输入抬头名称')
		}

		if (formData.titleType == 2 && !formData.taxNum) {
			return showToast('请输入税号')
		}
		if (!formData.email) {
			return showToast('请输入邮箱')
		}
		let params = {
			serverUrl: formData.titleId ? 'appTitleEditRequest' : 'appTitleAddRequest',
			titleType: formData.titleType,
			name: formData.name,
			taxNum: formData.taxNum,
			address: formData.address,
			tel: formData.tel,
			bank: formData.bank,
			bankAccount: formData.bankAccount,
			email:formData.email
		}
		if (formData.titleId) {
			params['titleId'] = formData.titleId
		}
		showLoading()
		etcInvoice(params).then(res => {
			hideLoading();
			if (res.data.success) {
				let toastStr = (formData.titleId ? '修改' : '添加') + '抬头信息成功'
				showToastSuccess(toastStr)
				setTimeout(function () {
					uni.setStorageSync('truthIndex', formData.titleType)
					uni.navigateBack()
				}, 1000)
			} else {
				showToast(res.data.msg)
			}

		}).catch(err => {
			hideLoading();
			if (err == 'etcTokenLoad') {
				layerShow.value = true;
			} else {
				showToast(err)
			}
		})
	}
	const closePop = () => {
		layerShow.value = false
	}
	// 初始化数据（如果是编辑）
	onLoad((options) => {
		if (options.typeIndex) formData.titleType = (options.typeIndex) * 1
	})
	onShow(() => {
		if (uni.getStorageSync('updateTitle')) {
			let updateTitle : any = uni.getStorageSync('updateTitle')
			uni.removeStorageSync('updateTitle')
			formData.titleId = updateTitle.titleId
			formData.titleType = updateTitle.titleType
			formData.name = updateTitle.name
			formData.taxNum = updateTitle.taxNum
			formData.address = updateTitle.address
			formData.tel = updateTitle.tel
			formData.bank = updateTitle.bank
			formData.bankAccount = updateTitle.bankAccount
			formData.email=updateTitle.email
		}
	})
</script>

<style lang="scss" scoped>
	.popup-box {
		padding: 32rpx;

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
		width: 480rpx;
		height: 96rpx;
		background: var(--primary-color);
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		font-weight: 700;
		font-size: 32rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 96rpx;
		margin: 0 auto;
		margin-top: 60rpx;
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

		.form-item {
			display: flex;
			align-items: center;
			padding: 40rpx 0 40rpx 62rpx;
			border-bottom: 1rpx solid #eee;

			.label-req,
			.label {
				width: 170rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #7F7F7F;
				position: relative;
				display: inline-block;
			}

			.label-req::before {
				content: "*";
				color: red;
				position: absolute;
				left: -20rpx;
			}

			.input {
				flex: 1;
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 28rpx;
				color: #000000;
				padding-right: 20rpx;

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
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 15rpx 32rpx 63rpx;
			display: flex;
			justify-content: center;

			.save-btn {
				width: 480rpx;
				height: 96rpx;
				background: var(--primary-color);
				border-radius: 45rpx;
				font-weight: 500;
				font-size: 30rpx;
				color: #FFFFFF;
				text-align: center;
				line-height: 90rpx;

			}
		}
	}
</style>