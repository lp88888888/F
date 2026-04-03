<template>
	<view class="container" :data-theme="pageTheme">
		<up-navbar title=" " @leftClick="toBack" bgColor="transparent" :placeholder="false" :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<image class="navTopBg" :src="imgUrl+'static/partner_bgcolor.png'" mode=""></image>
		<view class="partner-page">
			<!-- 表单内容 -->
			<view class="form-content">
				<view class="statusBox statusIcon1" v-if="detailStatus == 'PENDING_AUDIT'">
					<text class="statusTitle" style="width: 140rpx;">{{detail.statusDesc}}</text>
				</view>
				<view class="statusBox1 statusIcon2" v-if="detailStatus == 'REJECTED'">
					<text class="statusTitle">{{detail.statusDesc}}</text>
					<text class="statusBox-text">{{detail.rejectReason}}</text>
				</view>

				<view class="formBox">
					<!-- 申请人姓名 -->
					<view class="formView">
						<view class="formView-label">
							<up-icon :name="imgUrl+'static/partner_icon1.png'" size="16"></up-icon>
							<text class="formView-label-text">申请人姓名</text>
							<text class="formView-label-icons">*</text>
						</view>
						<view class="formView-input">
							<input class="item-input" placeholder="请输入您的姓名" v-model="formData.name"
								placeholder-class="placeholder" :disabled="editor"  />
						</view>
					</view>

					<!-- 手机号 -->
					<view class="formView">
						<view class="formView-label">
							<up-icon :name="imgUrl+'static/partner_icon2.png'" size="16"></up-icon>
							<text class="formView-label-text">申请人手机号</text>
							<text class="formView-label-icons">*</text>
						</view>
						<view class="formView-input">
							<input class="item-input" type="number" placeholder="请输入您的手机号" v-model="formData.phone"
								placeholder-class="placeholder" maxlength="11"  :disabled="editor"  />
						</view>
					</view>

					<!-- 性别 -->
					<view class="formView">
						<view class="formView-label">
							<up-icon :name="imgUrl+'static/partner_icon3.png'" size="16"></up-icon>
							<text class="formView-label-text">性别</text>
							<text class="formView-label-icons">*</text>
						</view>
						<view class="formView-input"  @click="sexshowfun">
							<input class="item-input" placeholder="请选择性别" v-model="formData.genderText" disabled />
						</view>
					</view>

					<!-- 身份证号 -->
					<view class="formView">
						<view class="formView-label">
							<up-icon :name="imgUrl+'static/partner_icon4.png'" size="16"></up-icon>
							<text class="formView-label-text">身份证号</text>
							<text class="formView-label-icons">*</text>
						</view>
						<view class="formView-input">
							<input class="item-input" placeholder="请输入" v-model="formData.idCard"
								placeholder-class="placeholder" maxlength="18" :disabled="editor"  />
						</view>
					</view>
					
					<!-- 公司选择 - 修复绑定错误 -->
					<view class="formView" @click="showFun" v-if="sfType">
						<view class="formView-label">
							<up-icon :name="imgUrl+'static/partner_icon4.png'" size="16"></up-icon>
							<text class="formView-label-text">公司</text>
							<text class="formView-label-icons">*</text>
						</view>
						<view class="formView-input">
							<input class="item-input" placeholder="请选择公司" v-model="formData.companyName" disabled />
						</view>
					</view>
				</view>
			</view>
			<view class="agreement-box" v-if="isshow">
				<view class="agreement">
					<up-checkbox :customStyle="{marginBottom: '4px'}" name="agree" usedAlone shape="circle" size="14"
						activeColor='#069FA4' v-model:checked="aloneChecked">
					</up-checkbox>
					<text class="agreement-text">已阅读并同意</text>
					<text class="protocol-text" @click="openProtocol('userService')">《用户服务协议》</text>
					<text class="protocol-text" @click="openProtocol('privacy')">《隐私政策》</text>
				</view>
			</view>
			<view class="info-card flex flex-col" v-if="detailStatus=='NORMAL' ||  (detail && detail.level==2)">
				<image class="info-card-img" :src="imgUrl+'static/partner_card_bg.png'" mode=""></image>
				<view class="info-card-box">
					<view class="fl-ce-ce" style="flex-direction: column;">
					
						<view  class="code-img" @click="showPic">
							<view style="position: relative;">
								<image :src="qrCodeDataUrl" mode="widthFix" style="width: 200rpx;height: 195rpx;"></image>
							</view>
						</view>
						<view class="info-card-box-codeText">
							<view>分享二维码</view>
							<up-icon name="arrow-right-double" color="#fff" size="14"></up-icon>
						</view>
					</view>
					<view class="info-card-box-center">
						<text class="name fs-36 fw-600 colf">{{formData.name}}</text>
						<view class="fs-26 fw-500 colf" style="padding: 15rpx 0;">{{formData.phone}}</view>
						<view class="boxCenView" @click="PathNav()">
							<up-icon :name="imgUrl+'static/partner_shopIcon.png'" size="16"></up-icon>
							<text class="boxCenView-text">我的小店</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view >
			<up-gap height="90"></up-gap>
			<view class="bottom-bar" v-if="isshow">
				<view class="btn" @click="doSearch">提交</view>
			</view>
			<view class="bottom-bar" v-if="detailStatus == 'REJECTED'" >
				<view class="btn"  @click="editorFun" v-if='editorNew'>编辑</view>
				<view class="btn"  @click="doSearch" v-else>提交</view>
			</view>
		</view>
		
		<!-- 修复up-picker配置错误 -->
		<up-picker 
			:show="show" 
			:columns="columns" 
			@cancel='show = false' 
			@confirm='companyFun'
			keyName="deptName" 
			valueName="deptId"
		></up-picker>
		
		<up-picker
			:show="sexshow" 
			:columns="branchOptions" 
			@cancel='sexshow = false' 
			@confirm='handleBranchChange'
			keyName="name" 
			valueName="id"
		></up-picker>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { imgUrl } from '@/config';
	import { onLoad, onShow, onPageScroll, onHide } from '@dcloudio/uni-app';
	import { debounce } from '@/utils/common'
	import {
		toNav,
		toBack
	} from '@/utils/route';
	import { useTheme } from "@/composables/useTheme";
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const backgroundColor = ref<string>(themeStore.themeColors.$primaryColor);
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const status = ref(false);
	const aloneChecked = ref(false); // 协议勾选状态
	const detailStatus= ref('');
	const detail= ref({});
	const sexshow= ref(false);

	import { distributorList, getAllCompany,distributorDetail } from '@/api/distribution';
	const qrCodeDataUrl=ref('')
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});
	const sfType= ref(false);
	const newType= ref('');
	const editor= ref(false);
	const editorNew= ref(true);
	const orderStatus = ref(0);
	const show = ref(false);
	const columns = ref([]); // 初始化为空数组，避免undefined
	const isshow= ref(true);
	const listColumns = ref([]);
	// 扩展表单数据类型，新增公司相关字段
	interface FormData {
		name: string;
		phone: string;
		gender: string;       // 性别值（0/1）
		genderText: string;   // 性别文本（男/女）
		idCard: string;       // 身份证号
		branch: string;       // 废弃字段，建议删除
		site: string;         // 站点
		companyName: string;  // 公司名称
		companyId: string;    // 公司ID
	}
	const sexshowfun=()=>{
		if(detailStatus.value=='PENDING_AUDIT' || detailStatus.value=='NORMAL'){
			sexshow.value=false
		}else{
			sexshow.value =true
		}
		
	}
	const showFun=()=>{
		if(detailStatus.value=='PENDING_AUDIT' || detailStatus.value=='NORMAL'){
			show.value=false
		}else{
			show.value= true
		}
		
	}
	const editorFun=()=>{
		setTimeout(() => {
			editorNew.value=false
		}, 500);
	}
	// 初始化表单数据
	const formData = ref<FormData>({
		name: '',
		phone: '',
		gender: '',          // 初始化为空
		genderText: '',      // 性别文本初始为空
		idCard: '',
		branch: '',
		site: '',
		companyName: '',     // 公司名称初始为空
		companyId: ''        // 公司ID初始为空
	});
	
	// 性别选项
	const branchOptions = ref([
		[
			{
				name:'男',
				id:'0'
			},
			{
				name:'女',
				id:'1'
			}
		]
	]);
	 const PathNav=()=>{
		 uni.navigateBack({
		    delta: 1, 
		  }); 
	 }
	 const generateQRCode=()=> {
	      qrCodeDataUrl.value= uni.getStorageSync('qrCodeDataUrl')
	     }
	const showPic=()=> {
		let url =  qrCodeDataUrl.value
		console.log(url)
		uni.previewImage({
			index: 0,
			urls: [url],
			showmenu: true,
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
				success(data) {
					console.log('长按保存',data)
					saveImage(url)
				},
				fail: function(err) {
					console.log(err.errMsg);
				}
			}
		})
	}
	const saveImage=(imgurl)=>{
		// console.log(imgurl)
		uni.downloadFile({
			url:imgurl,
			success(res){
				// console.log(res)
				let url = res.tempFilePath
				uni.saveImageToPhotosAlbum({
					filePath:url,
					success() {
						uni.showToast({
							title:'保存成功',
							icon:"none"
						})
					},
					fail(err) {
						console.log('保存失败',err)
						uni.showToast({
							title:'保存失败',
							icon:"none"
						})
					}
				})
			}
		})
	}
	// 性别选择 - 修复逻辑
	const handleBranchChange = (e: any) => {
		formData.value.genderText = e.value[0].name;
		formData.value.gender =e.value[0].id;
		sexshow.value=false
	};
	const doSearch = debounce(() => {
		handleSubmit();
	}, 500);
	// 表单提交 - 增加协议校验和身份证格式校验
	const handleSubmit = async () => {
		// 1. 验证协议勾选
		if(detailStatus.value != 'REJECTED'){
			if (!aloneChecked.value) {
				uni.showToast({ title: '请阅读并同意用户服务协议和隐私政策', icon: 'none' });
				return;
			}
		}

		// 2. 验证必填项
		if (!formData.value.name) {
			uni.showToast({ title: '请输入申请人姓名', icon: 'none' });
			return;
		}
		
		if (!formData.value.phone || !/^1[3-9]\d{9}$/.test(formData.value.phone)) {
			uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
			return;
		}
		
		if (!formData.value.gender) {
			uni.showToast({ title: '请选择性别', icon: 'none' });
			return;
		}
		
		// 3. 身份证号格式校验（简单版）
		const idCardReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		if (!formData.value.idCard) {
			uni.showToast({ title: '请输入正确的身份证号', icon: 'none' });
			return;
		}
		
		// 4. 验证公司选择
		if (!formData.value.companyId) {
			uni.showToast({ title: '请选择公司', icon: 'none' });
			return;
		}
		
		// 构造提交参数
		const params = {
			realName: formData.value.name,
			mobile: formData.value.phone,
			idCard: formData.value.idCard,
			parentId: '',
			deptId: '',
			companyId: formData.value.companyId,
			isInternal: '1',
			sex: formData.value.gender
		};
		try {
			const res = await distributorList(params);
			uni.showToast({ title: '提交成功', icon: 'success' });
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/home/home?type='+'mine',
				})
			}, 1000);
		} catch (error) {
			console.log(error)
			uni.hideLoading();
			uni.showToast({ title:error.msg, icon: 'none' });
			console.error('提交失败:', error);
		}
	};
	
	// 公司选择确认 - 修复逻辑
	const companyFun = (e) => {
		console.log('选中的公司:', e.value);
		formData.value.companyId = e.value[0].deptId;    
		formData.value.companyName = e.value[0].deptName;  
		show.value = false; 
	};
	
	// 获取公司下拉框数据 - 增加加载状态和空数据处理
	const getAllCompanyFun = async () => {
		try {
			uni.showLoading({ title: '加载中...' });
			const response = await getAllCompany();
			uni.hideLoading();
			
			// 校验返回数据
			if (response && response.data && Array.isArray(response.data)) {
				columns.value =[response.data] // 赋值给columns
				listColumns.value=response.data
				console.log('公司列表数据:', columns.value);
			} else {
				columns.value = [];
				uni.showToast({ title: '暂无公司数据', icon: 'none' });
			}
		} catch (error) {
			uni.hideLoading();
			columns.value = [];
			console.error('获取公司列表失败:', error);
			uni.showToast({ title: '加载公司数据失败', icon: 'none' });
		}
	};
	
	const openProtocol = (type:string )=> {
		uni.navigateTo({ url: '/pages_C/xieyi/index?type='+type });
	};
	
	
	// 返回按钮逻辑（补充实现）
	const toBack = () => {
		uni.navigateBack();
	};
	const distributorDetailFun= async ()=>{
		const res = await distributorDetail();
		detail.value=res.data
		if(res.data.status=='PENDING_AUDIT'){
			editor.value=true
		}else{
			editor.value=false
		}
		detailStatus.value=detail.value.status
		formData.value.name=res.data.realName,
	    formData.value.phone=res.data.mobile
		formData.value.idCard=res.data.idCard,
		formData.value.companyId=res.data.companyId, // 传入选中的公司ID
		formData.value.genderText =res.data.sex='0'?'男':'女'
		formData.value.gender=res.data.sex
		formData.value.companyName= getDeptNameById(res.data.companyId)
		if(formData.value.companyName){
			sfType.value=true
		}
		
	}
	const getDeptNameById= (deptId)=> {
	  const dept = listColumns.value.find(item => item.deptId === deptId);
	  return dept ? dept.deptName : null;
	}
	onLoad((options) => {
		generateQRCode()
		getAllCompanyFun(); 
		if(options.type==1){
			newType.value=1
			distributorDetailFun()
			isshow.value=false
		}
		if (options.q) {
			sfType.value=true
			const regex = /id%3D(\d+)/i;
			const matchResult = options.q.match(regex);
			let targetValue = null;
			if (matchResult && matchResult.length > 1) {
				uni.setStorageSync('invitationId', matchResult[1]);
			}
		}
		if(uni.getStorageSync('invitationId')){
			sfType.value=true
		}
		
	});
	onShow(()=>{
		if(newType.value=1){
			distributorDetailFun()
		}
		
	})
</script>

<style scoped lang="scss">
	// 样式部分保持不变，省略重复代码
	.container {

		background: #f8f9fb;
	}

	.navTopBg {
		width: 750rpx;
		height: 506rpx;
	}

	.formView {
		padding-top: 30rpx;
		box-sizing: border-box;

		.formView-label {
			height: 80rpx;
			display: flex;
			align-items: center;

			.formView-label-text {
				font-weight: 500;
				font-size: 28rpx;
				color: #7F7F7F;
				text-indent: 10rpx;
			}

			.formView-label-icons {
				color: #FE0000;
			}
		}

		.formView-input {
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			box-sizing: border-box;
			width: 100%;
			height: 80rpx;
			background: #F8F9FB;
			border-radius: 16rpx;
		}
	}

	.partner-page {
		background: #F8F9FB;
		border-radius: 30rpx 30rpx 26rpx 26rpx;
		padding: 32rpx;

		.form-content {
			background: #FFFFFF;
			border-radius: 26rpx;
			margin-top: -90rpx;
			position: relative;
			z-index: 1;

			.statusBox {
				width: 100%;
				height: 100rpx;
				border-radius: 24rpx 24rpx 0rpx 0rpx;
				display: flex;
				align-items: center;
				padding: 0 30rpx;
				box-sizing: border-box;

				.statusBox-text {
					font-weight: 400;
					font-size: 28rpx;
					color: #FFFFFF;
					line-height: 36rpx;
					margin-left: 10rpx;
				}
			}

			.statusIcon1 {
				background: #4788FA;
			}

			.statusIcon2 {
				background: #FF9000;
			}

			.statusTitle {
				font-weight: 700;
				font-size: 36rpx;
				color: #FFFFFF;
				line-height: 36rpx;
			}

			.formBox {
				padding: 0 30rpx;
				padding-bottom: 35rpx;
			}
		}

		.info-card {
			height: 296rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			margin-top: 25rpx;
			margin-bottom: 100rpx;
			box-sizing: border-box;
			position: relative;

			.info-card-img {
				width: 100%;
				height: 296rpx;
				position: absolute;
				top: 0;
				left: 0;
			}

			.info-card-box {
				width: 100%;
				height: 296rpx;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
				padding: 30rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.code-img {
					width: 200rpx;
					height: 200rpx;
					background: #FFFFFF;
					padding: 10rpx;
				}

				.info-card-box-codeText {
					display: flex;
					align-items: center;
					font-weight: 500;
					font-size: 26rpx;
					color: #FFFFFF;
					line-height: 36rpx;
					margin-top: 4rpx;
				}

				.info-card-box-center {
					width: calc(100% - 250rpx);
					display: flex;
					flex-direction: column;

					.boxCenView {
						width: 206rpx;
						height: 70rpx;
						background: #FFFFFF;
						border-radius: 266rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						.boxCenView-text {
							font-weight: 500;
							font-size: 28rpx;
							color: #4788FA;
							line-height: 36rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
		}
	}

	.bottom-bar {
		width: 750rpx;
		height: 158rpx;
		background: #FFFFFF;
		position: fixed;
		z-index: 9;
		bottom: 0;
		padding: 15rpx 32rpx;
	}

	.btn {
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 500;
		font-size: 30rpx;
		color: #FFFFFF;
		width: 686rpx;
		height: 96rpx;
		background: var(--but-color-line);
		border-radius: 48rpx;
		margin-top: 20rpx;
	}

	.agreement-box {
		width: 80%;
        margin:30rpx auto;
	}

	.agreement {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
		margin-bottom: 30rpx;
	}

	.agreement-text {
		margin-right: 10rpx;
	}

	.protocol-text {
		color: #666;
		margin: 0 5rpx;
	}
	
	.statusBox1 {
		min-height: 100rpx;
	  /* 垂直布局，让标题和文本上下排列 */
	  display: flex;
	  padding: 10rpx 15rpx;
	  /* 可选：添加边框/背景，方便查看对齐效果 */
	  border: 1px solid #eee;
	  border-radius: 24rpx 24rpx 0rpx 0rpx;
	}
	
	/* 状态标题样式 */
	.statusTitle {
	   width: 100rpx;
	  /* 标题样式，可根据需求调整 */
	  font-size: 32rpx;
	  font-weight: bold;
	  color: #f53f3f;
	  /* 与下方文本保留间距 */
	  margin-bottom: 8rpx;
	}
	
	/* 拒绝理由文本样式：核心换行设置 */
	.statusBox-text {
	  /* 强制文本换行（解决小程序文本默认不换行问题） */
	  white-space: normal;
	  /* 长单词/数字强制换行 */
	  word-wrap: break-word;
	  word-break: break-all;
	  /* 文本对齐（与容器对齐保持一致） */
	  text-align: left;
	  /* 文本样式，可根据需求调整 */
	  font-size: 28rpx;
	  color: #fff;
	  /* 可选：设置最大宽度，避免文本溢出 */
	  max-width: 85%;
	}
</style>