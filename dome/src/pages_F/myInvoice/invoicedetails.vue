<template>
	<view class="invoice-page" :data-theme="pageTheme">
		<!-- 顶部提示栏 -->
		<view class="header-tip" style="background: #E8F1FF;" v-if="invoiceInfoList.invoiceStatus==5">
			<text class="tip-title" style="color: #4788FA;">开票中</text>
			<text class="tip-desc">申请正在审核中，请耐心等待～～</text>
		</view>
		<view class="header-tip" style="background: #FFEEEE;" v-if="invoiceInfoList.invoiceStatus==3">
			<text class="tip-title" style="color: #FD4848;">已驳回</text>
			<text class="tip-desc">{{invoiceInfoList.rejectReason}}～</text>
		</view>
		<view class="header-tip" v-if="invoiceInfoList.invoiceStatus==1">
			<text class="tip-title">已开票</text>
			<text class="tip-desc"></text>
		</view>

		<!-- 发票信息卡片 -->
		<view class="invoice-card">
			<!-- 发票基础信息列表 -->
			<view class="info-list">
				<view class="info-item">
					<text class="info-label">发票抬头</text>
					<text class="info-value">{{ invoiceInfoList.titleName}}</text>
				</view>
				<view class="info-item">
					<text class="info-label">纳税人识别号</text>
					<text class="info-value">{{ invoiceInfoList.taxNum }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">发票类型</text>
					<text class="info-value">普票</text>
				</view>
				<view class="info-item">
					<text class="info-label">开票金额</text>
					<text class="info-value">{{ invoiceInfoList.invoiceAmount }}元</text>
				</view>
			<!-- 	<view class="info-item">
					<text class="info-label">电子邮箱</text>
					<text class="info-value">{{ invoiceInfoList.email }}</text>
				</view> -->
				<view class="info-item">
					<text class="info-label">提交时间</text>
					<text class="info-value">{{ invoiceInfoList.createTime }}</text>
				</view>
			</view>
			<!-- 备注信息区域 -->
			<view class="remark-section" v-if="invoiceInfoList.remark">
				<text class="info-label">备注信息</text>
				<view class="remark-box">
					<text class="remark-text">{{ invoiceInfoList.remark }}</text>
				</view>
			</view>
			<view class="remark-section" v-if="invoiceInfoList.reInvoiceReason">
				<text class="info-label">重开原因</text>
				<view class="remark-box">
					<text class="remark-text">{{ invoiceInfoList.reInvoiceReason }}</text>
				</view>
			</view>
		</view>

		<!-- 底部操作按钮组 -->
		<view class="btn-group" v-if="invoiceInfoList.invoiceStatus==1">
			<button class="action-btn" @click="handleDownload()">下载发票</button>
			<button class="action-btn" @click="handleViewPdf()">查看pdf</button>
			<button class="action-btn" @click="topath(invoiceInfoList.id)">申请重开</button>
		</view>
		<view class="btn-group" v-if="invoiceInfoList.invoiceStatus==3">
			<button style="width: 400rpx;"></button>
		<button class="action-btn" @click="toNav('/pages_F/myInvoice/invoice?id='+invoiceInfoList.id)">
			申请重开
		</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { onLoad } from "@dcloudio/uni-app";
	import { useTheme } from "@/composables/useTheme";
	const { themeStore, pageTheme } = useTheme();
	import { toNav, toBack } from '@/utils/route';
	import { invoiceobj, download } from "@/api/invoice";
	// 定义发票信息项TS类型接口
	interface InvoiceInfoItem {
		label : string
		value : string
	}
	const invoiceInfoList = ref({})
	const fileName = ref("发票.pdf");
	const invoiceobjFun = async (id) => {
		try {
			const res = await invoiceobj(id);
			if (res.code == 200) {
				invoiceInfoList.value = res.data
			}
		} catch (error) {
			console.error('获取订单列表失败：', error);
		}
	};
	const topath = (val) => {
			uni.navigateTo({
				url: "/pages_F/myInvoice/invoice?id=" + val
			})
		}
	// 备注信息（\n 实现换行，匹配截图格式）
	const remarkInfo = ref<string>('')
	/** 下载 */
	const handleDownload = async () => {
		if (! invoiceInfoList.value.invoiceUrl) {
		  uni.showToast({ title: '下载失败', icon: 'none' })
		  return
		}

		// #ifdef APP
		downloadForApp()
		// #endif
		// #ifdef MP-WEIXIN
		downloadForWechatMini()
		// #endif
	}
	// 1. App端
	const downloadForApp = () => {
	     if (!invoiceInfoList.value.invoiceUrl) return uni.showToast({ title: '链接无效', icon: 'none' }); 
	       plus.runtime.openURL(
	        invoiceInfoList.value.invoiceUrl,
	         (err) => {
	           // 打开失败回调（如URL格式错误、无浏览器应用等）
	           uni.showToast({ title: '打开失败', icon: 'none' });
	           console.error('打开浏览器失败:', err);
	         }
	       );
	}

	// 3. 微信小程序端
	const downloadForWechatMini = () => {
	  uni.downloadFile({
	    url: invoiceInfoList.value.invoiceUrl,
	    success: (res) => {
	      if (res.statusCode === 200) {
	        uni.saveFile({
	          tempFilePath: res.tempFilePath,
	          success: (saveRes) => {
	            uni.hideLoading()
	            uni.showModal({
	              title: '下载完成',
	              content: '文件已暂存，是否立即查看并保存到系统？',
	              confirmText: '查看',
	              success: (modalRes) => {
	                if (modalRes.confirm) {
	                  uni.openDocument({
	                    filePath: saveRes.savedFilePath,
	                    fileType: 'pdf',
	                    showMenu: true
	                  })
	                }
	              }
	            })
	          },
	          fail: () => {
	            uni.hideLoading()
	            uni.openDocument({
	              filePath: res.tempFilePath,
	              fileType: 'pdf',
	              showMenu: true
	            })
	          }
	        })
	      } else {
	        handleFail(`下载失败，状态码：${res.statusCode}`)
	      }
	    },
	    fail: (err) => handleFail(`下载失败：${JSON.stringify(err)}`)
	  })
	}
	
	// 统一错误处理
	const handleFail = (msg) => {
	  uni.hideLoading()
	  uni.showToast({ title: msg, icon: 'none', duration: 3000 })
	}
	/** 查看PDF */
	const handleViewPdf = () => {
		viewOnlinePdf(2)
	}
	const viewOnlinePdf = (val) => {
		 uni.downloadFile({
		    url: invoiceInfoList.value.invoiceUrl,
		    success: (res) => {
		      if (res.statusCode === 200) {
		        // 2. 下载成功后打开查看
				if(val==2){
					openPdf(res.tempFilePath)
				}
		      } else {
		        handleError('下载失败')
		      }
		    },
		    fail: (err) => {
		      handleError('网络错误')
		      console.error('downloadFile error:', err)
		    }
		  })
	}

	const openPdf = (filePath) => {
		uni.openDocument({
			filePath: filePath,
			fileType: 'pdf', // 必须指定文件类型为 pdf
			showMenu: true, // 开启右上角菜单（支持保存、转发等，仅小程序/App 有效）
			success: () => {
			},
			fail: (err) => {
				handleError('打开失败')
				console.error('openDocument error:', err)
			}
		})
	}
	onLoad((options) => {
		if (options.id) {
			invoiceobjFun(options.id)
		}
	});
</script>

<style lang="scss" scoped>
	.invoice-page {
		min-height: 100vh;
		background-color: #f5f7f9;
		padding-bottom: 40rpx;
		box-sizing: border-box;
	}

	/* 顶部提示栏样式 */
	.header-tip {
		background-color: #eeeeee;
		padding: 30rpx 40rpx;
		display: flex;
		flex-direction: column;
		gap: 10rpx;

		.tip-title {
			font-size: 30rpx;
			font-weight: 600;
			color: #333333;
		}

		.tip-desc {
			font-size: 28rpx;
			color: #666666;
		}
	}

	/* 发票卡片容器 */
	.invoice-card {
		margin: 30rpx 30rpx 60rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		box-shadow: 0rpx 0rpx 20rpx 0rpx #E7EBF1;
	}

	/* 信息列表通用样式 */
	.info-list {
		display: flex;
		flex-direction: column;
		gap: 36rpx;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.info-label {
		font-size: 30rpx;
		color: #666666;
		flex-shrink: 0;
		margin-right: 20rpx;
	}

	.info-value {
		font-size: 30rpx;
		color: #333333;
		text-align: right;
		word-break: break-all;
		flex: 1;
	}

	/* 备注信息区域 */
	.remark-section {
		margin-top: 36rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.remark-box {
		background-color: #f8f9fa;
		border-radius: 12rpx;
		padding: 30rpx 24rpx;
		box-sizing: border-box;
		margin-top: 10rpx;
	}

	.remark-text {
		font-size: 30rpx;
		color: #333333;
		line-height: 1.6;
		white-space: pre-line;
		/* 识别换行符，实现文本换行 */
	}

	/* 底部按钮组 */
	.btn-group {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 24rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #fff;
		height: 150rpx;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.action-btn {
		flex: 1;
		height: 70rpx;
		line-height: 70rpx;
		border: 1rpx solid var(--secondary-color);
		border-radius: 40rpx;
		background-color: #ffffff;
		color: var(--primary-color);
		font-size: 30rpx;
		padding: 0;
		margin: 0;

		/* 清除uni-app按钮默认边框样式 */
		&::after {
			border: none;
		}
	}
</style>