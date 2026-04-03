<template>
	<view class="container" :data-theme="pageTheme" >
		<view class="header">
			<u-sticky bgColor="transparent" z-index="99999">
				<view class="searchView">
					<up-navbar title="通行费发票" bgColor="transparent" @leftClick="toBack" placeholder
						:fixed="true"></up-navbar>
				</view>
			</u-sticky>
			<view class="etc-card etc-cards m-t-240">
				<view class="flex flex-col">
					<view class="flex ali-cen">

						<image class="etc-img" :src="imgUrl + 'etc.png'" mode=""></image>

						<view class="flex flex-col">
							<text class="fs-32 col3 fw-600 m-b-35">ETC开票</text>
							<view class="flex">
								<image class="icon-32 m-r-15" :src="imgUrl +'tip.png'" mode=""></image>
								<view class="flex flex-col">
									<text class="fs-24 col6 fw-400 m-b-15">绑定ETC卡，便捷开票</text>
									<text class="fs-24 col6 fw-400">根据ETC车辆获取通行记录并申请开票</text>
								</view>
							</view>
						</view>
					</view>
					<view class="btn-card flex ali-cen">
						<view class="btn" @click="toNav('/pages_A/etcInvoice/etcCards?type=make')">开票</view>
					</view>
				</view>
			</view>
		</view>

		<view class="content">
			<!-- <view class="etc-card m-t-50">
				<view class="flex flex-col">
					<view class="flex ali-cen">

						<image class="etc-img" :src="imgUrl+'rgcd.png'" mode=""></image>
						<view class="flex flex-col">
							<text class="fs-32 col3 fw-600 m-b-35">人工车道开票</text>
							<view class="flex">
								<image class="icon-32 m-r-15" :src="imgUrl+'tip.png'" mode=""></image>
								<view class="flex flex-col">
									<text class="fs-24 col6 fw-400 m-b-15">无需绑定，临时开票</text>
									<text class="fs-24 col6 fw-400">扫描支付小票或输入支付订单号申 请开票</text>
								</view>
							</view>
						</view>
					</view>
					<view class="btn-card flex ali-cen" @click="toartificial" >
						<view class="btn">开票</view>
					</view>
				</view>
			</view> -->

			<view class="item-card flex just-sb ali-cen m-t-25">
				<view class="item flex flex-col ali-cen" v-for="(item, index) in cardList" :key="index" @click="toNav(item.url)">
					<image class="icon-72 m-b-25" :src="imgUrl+item.img" mode=""></image>
					<text class="fs-28 col6 fw-500">{{item.title}}</text>
				</view>
			</view>

			<view class="process-card flex just-sb ali-cen m-t-25">
				<view class="pro flex flex-col pro_1" @click="previewImage(imgUrl+'static/file-read-932.png')">
					<text>ETC</text>
					<text>开票流程</text>
				</view>
				<!-- <view class="pro flex flex-col pro_2" >
					<text>人工车道</text>
					<text>开票流程</text>
				</view> -->
			</view>

			<view class="problem-card m-t-25">
				<view class="fs-32 col3 fw-600 m-b-25">常见问题</view>
				<up-collapse :value="['2']">
					<up-collapse-item v-for="(item,index) in answerList" :key="index" :title="item.question">
						<text class="u-collapse-content">{{item.answer}}</text>
					</up-collapse-item>
					<!-- <up-collapse-item  title="最早可以开多长时间前的发票？">
						<text class="u-collapse-content">涵盖uniapp各个方面，给开发者方向指导和设计理念，让您茅塞顿开，一马平川</text>
					</up-collapse-item>
					<up-collapse-item title="换票的步骤？">
						<text class="u-collapse-content">众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用</text>
					</up-collapse-item>
					<up-collapse-item name="2" title="非陕西省的ETC卡可以绑定吗？">
						<text class="u-collapse-content">众多的贴心小工具，是您开发过程中召之即来的利器，让您飞镖在手，百步穿杨</text>
					</up-collapse-item> -->
				</up-collapse>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
	import CosHeader from '@/components/customNavBar/index.vue';
	import {questionAnswerList} from "@/api/etcInvoice";
	import { toNav,toBack } from '@/utils/route';
	import {showToast,showToastSuccess,showLoading,hideLoading} from '@/utils/util';
	import { imgUrl } from '@/config';
	import theme from '@/utils/theme'
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const answerList = ref([]); // 常见问题

	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
		getAnswerList()
	});
	const toartificial = () => {
		uni.navigateTo({
			url: '../../pages_A/tollInvoice/artificial',
		})
	}
	const cardList = ref([
		{
			id: 1,
			img: 'tt_icon.png',
			title: '发票抬头',
			url:'/pages_A/etcInvoice/headIndex'
		},
		{
			id: 2,
			img: 'etc_icon.png',
			title: '我的ETC',
			url:'/pages_A/etcInvoice/etcCards'
		},
		{
			id: 3,
			img: 'fp_icon.png',
			title: '我的发票',
			url:'/pages_A/etcInvoice/etcCards?type=my'
		}
	])
	const getAnswerList = () =>{
		questionAnswerList({size:5}).then(res =>{
			if(res.code == 0 || res.code == 200){
				answerList.value = res.clazz
			}
			
		})
	}
	// 图片预览
		const previewImage = (img) => {
		  uni.previewImage({
		    current: img,
		    urls: [img]
		  });
		};
	onPageScroll((e) =>{
	  if (e.scrollTop < 1) {
		  backgroundColor.value = 'transparent';
	  } else {
		  backgroundColor.value = "#FFFFFF"
	  }
	})
</script>

<style scoped lang="scss">
	.searchView {
		background: var(--head-color);
	}
	
	.container {
		min-height: 100vh;
		background: var(--linear-color);
	}

	.header {
		width: 750rpx;
		height: 546rpx;
		background: var(--head-color);
		border-radius: 0rpx 0rpx 0rpx 0rpx;


	}

	.m-t-240 {
		margin: 20rpx 32rpx 0;
		position: absolute;
	}
	
	.etc-cards {
		width: 686rpx;
	}

	.etc-card {
		// width: 100%;
		box-sizing: border-box;
		background: linear-gradient(180deg, #FFFCF6 0%, #FFFFFF 100%);
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);
		border-radius: 20rpx;
		padding: 40rpx 46rpx 40rpx 46rpx;
		margin-bottom: 24rpx;
		.etc-img {
			// width: 176rpx;
			// height: 214rpx;
			width: 112rpx;
			height: 176rpx;
			border-radius: 0rpx 0rpx 0rpx 0rpx;
			margin-right: 38rpx;
		}

		.btn-card {
			justify-content: center;

			.btn {
				width: 320rpx;
				height: 72rpx;
				background: var(--primary-color);
				border-radius: 48rpx 48rpx 48rpx 48rpx;
				margin-top: 48rpx;
				text-align: center;
				line-height: 72rpx;
				font-weight: 400;
				font-size: 28rpx;
				color: #FFFFFF;
			}
		}
	}

	.content {
		padding: 0 32rpx;
		margin-top: 68rpx;

		.item-card {
			width: 100%;
			height: 196rpx;

			.item {
				width: 214rpx;
				height: 196rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138, 78, 0, 0.05);
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				justify-content: center;
			}
		}

		.process-card {
			.pro {
				width: 100%;
				height: 240rpx;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				font-weight: 600;
				font-size: 32rpx;
				color: #FFFFFF;
				padding: 38rpx 44rpx;
				box-sizing: border-box;
				display: flex;
				    align-items: center;
				    justify-content: center;
			}
			
			.pro_1 {
				background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/etc_bg.png') no-repeat;
				background-size: 100% 100%;
			}
			
			.pro_2 {
				background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/rgcd_bg.png') no-repeat;
				background-size: 100% 100%;
			}
		}

		.problem-card {
			background: #FFFFFF;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			padding: 40rpx 32rpx;
		}
	}

	::v-deep .up-collapse-item__header {
		border-bottom: none !important;
	}

	::v-deep .up-collapse-item__content {
		border-bottom: none !important;
	}
</style>