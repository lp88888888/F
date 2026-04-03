<template>
	<view class="container">
		<up-navbar title="相关服务" bgColor="transparent" @leftClick="toBack" :placeholder="true" :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<!-- 内容区域 -->
		<view class="content-scroll">
			<!-- 高速社群模块 -->
			<view class="section-card">
				<view class="section-header">
					<view class="header-title-bg">
						<image class="header-title-bg-img" :src="imgUrl+'static/C-truck/card-icon6.png'" mode="">
						</image>
						<view class="header-title">高速社群</view>
					</view>
					<view class="header-more"
						@click="toNav('/pages_C/truckFestival/highSpeedList?id='+props.campaignId)">
						<text>查看更多内容</text>
						<up-icon name="arrow-right" color="#000000" size="14"></up-icon>
					</view>
				</view>
				<view class="card-body">
					<!-- 社群条目 1 -->
					<view class="list-item" v-for="(item,index) in tionList" :key="index">
						<view class="item-icon ">
							<image class="item-icon-img" :src="item.pic" mode=""></image>
							<!-- <text class="blue-bg">{{item.item}}</text> -->
						</view>
						<view class="item-info">
							<view class="item-name">{{item.title}}</view>
							<view class="item-desc">{{item.userNum}}+用户</view>
						</view>
						<button class="btn-subscribe" @click="openqr(item)">订阅</button>
					</view>
				</view>
			</view>

			<!-- 信息撮合模块 -->
			<view class="section-card mt-20">
				<view class="section-header">
					<view class="header-title-bg">
						<image class="header-title-bg-img" :src="imgUrl+'static/C-truck/card-icon6.png'" mode="">
						</image>
						<view class="header-title">信息撮合</view>
					</view>
					<view class="header-more" @click="toNav('/pages_D/informationMatch/index')">
						<text>查看更多内容</text>
						<up-icon name="arrow-right" color="#000000" size="14"></up-icon>
					</view>
				</view>

				<view class="card-body">
					<!-- 撮合条目 1 -->
					<view class="match-item" v-for="item in huoyuanList"
						@click="toNav('/pages_D/informationMatch/detail?id='+item.id)">
						<view class="match-top">
							<view class="route">
								<text class="city"> {{firName(item.loadingAddrName)}} </text>
								<image class="route-line" :src="icoUrl+'to_line.png'" mode=""></image>
								<text class="city"> {{firName(item.unloadingAddrName)}}</text>
							</view>
							<view class="goods-weight">{{item.goodsName}}</view>
						</view>
						<view class="match-bottom">
							<view class="detail-info">
								<view class="info-row">
									<text class="label">发布时间</text>
									<text class="value">{{item.createTime}}</text>
								</view>
								<view class="info-row">
									<text class="label">发布人</text>
									<text class="value">{{item.contactPerson}}</text>
								</view>
							</view>
							<button class="btn-grab">抢单</button>
						</view>
					</view>

					<!-- 撮合条目 2 -->
					<!-- 	<view class="match-item">
						<view class="match-top">
							<view class="route">
								<text class="city">西安</text>
								<image class="route-line" :src="icoUrl+'to_line.png'" mode=""></image>
								<text class="city">郑州</text>
							</view>
							<view class="goods-weight">10吨苹果</view>
						</view>
						<view class="match-bottom">
							<view class="detail-info">
								<view class="info-row">
									<text class="label">发布时间</text>
									<text class="value">2025-12-18 22:20:00</text>
								</view>
								<view class="info-row">
									<text class="label">发布人</text>
									<text class="value">某某公司</text>
								</view>
							</view>
							<button class="btn-grab">抢单</button>
						</view>
					</view> -->
				</view>
			</view>

		</view>
		<up-popup mode="center" bgColor="transparent" :safeAreaInsetBottom="false" :show="qrshow" @close="close">
			<view style="width: 600rpx;">
				<view class="modal-container">
					<view class="list2-item">
						<view class="item-icon ">
							<image class="item-icon-img" :src="qrobj.pic" mode=""></image>
							<text class="orange-bg">卡友</text>
						</view>
						<view class="item-info">
							<view class="item-name">{{qrobj.title}}</view>
							<view class="item-desc">{{qrobj.userNum}}+用户</view>
						</view>
					</view>
					<view class="fl-ce-ce" style="width: 100%;">
						<image class="modal-img" :src="qrobj.qrCode" mode=""></image>
					</view>

					<view class="footer-btns">
						<button class="btn-submit" @click="handleSubmit">保存到相册</button>
					</view>
					<view class="modal-text" style="margin-top: 20rpx;">用微信扫一扫，扫码进入社群</view>
				</view>
				<view class="close-wrapper" @click="close">
					<image class="close-wrapper-img" :src="imgUrl+'static/C-truck/close-icon.png'" mode=""></image>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	import { getCurrentTruckFestival, getassociationList } from '@/api/truck';
	import { listPrSupplySource } from '@/api/premium';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	interface Props {
		campaignId : number;
		type : string;
	}
	const qrshow = ref(false);
	const close = () => {
		qrshow.value = false;
	}
	const show = () => {
		qrshow.value = true;
	}
	const huoyuanList = ref([])
	const gethylist = async () => {
		try {
			const res = await listPrSupplySource(
			)
			huoyuanList.value = (res.rows || []).slice(0, 2);
			console.log(res.data, 'res.data')
		} catch (err) {
		}
	}
	const handleSubmit = () => {
		uni.saveImageToPhotosAlbum({
			filePath: imgUrl + 'del/dowl-apk-icon.png',
			success: function () {
				uni.showToast({
					title: '保存成功',
					icon: 'success',
					duration: 2000
				});
			},
			fail: function (err) {
				uni.showToast({
					title: '保存失败',
					icon: 'none',
					duration: 2000
				});
			}
		});
	}
	const qrobj = ref({})
	const openqr = async (obj) => {
		try {
			qrobj.value = obj
			show()
		} catch (err) {
		}
	}

	const props = defineProps<Props>();
	const tionList = ref([])
	const getiationList = async () => {
		try {
			const res = await getassociationList(
				props.campaignId
			)
			tionList.value = (res.data || []).slice(0, 2);
			console.log(tionList.value, 'tionList.value')
		} catch (err) {
		}
	}
	const firName = computed(() => {
		return (arr : string[] | any[]) : string => {
			if (Array.isArray(arr) && arr.length > 0) {
				let newArr = arr.slice(0, 1);
				return newArr.map(item => (typeof item === 'object' && item !== null ? item.name : String(item))).join('-');
			}
			return '';
		};
	});
	onMounted(() => {
		getiationList()
		gethylist()
	})
</script>

<style lang="scss" scoped>
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

	.modal-text {
		font-size: 28rpx;
		font-weight: 350;
		line-height: 48rpx;
		text-align: center;
		color: #333333;
		margin-bottom: 20rpx;
	}

	.modal-img {
		margin: 20rpx auto;
		width: 260rpx;
		height: 260rpx;
	}

	/* 底部按钮 */
	.footer-btns {
		display: flex;
		justify-content: space-between;
		gap: 30rpx;
	}

	/* 外部关闭按钮 */
	.close-wrapper {
		margin-top: 60rpx;
		display: flex;
		justify-content: center;
	}

	.close-wrapper-img {
		width: 60rpx;
		height: 60rpx;
	}

	.container {
		min-height: 100vh;
		background: linear-gradient(180deg, #CAECD0 0%, #F5F8F5 25%);
		display: flex;
		flex-direction: column;
	}

	.content-scroll {
		flex: 1;
		padding: 30rpx;
		box-sizing: border-box;
	}

	.section-card {
		background: linear-gradient(119deg, #FEFEFE 1%, #EBF8EE 99%);
		border-radius: 32rpx;
		box-shadow: 0px 2px 8px 0px #D3E7D1;
		margin-bottom: 40rpx;
	}

	.section-header {
		height: 90rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-right: 30rpx;
		position: relative;
	}

	.header-title-bg {
		height: 90rpx;
		position: relative;

		.header-title-bg-img {
			width: 272rpx;
			height: 94rpx;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 0;
		}

		.header-title {
			color: #ffffff;
			font-weight: bold;
			font-size: 32rpx;
			position: relative;
			z-index: 1;
			margin-top: 6rpx;
			margin-left: 40rpx;
		}
	}

	.header-more {
		font-size: 24rpx;
		color: #666666;
		display: flex;
		align-items: center;

		.arrow {
			margin-left: 8rpx;
		}
	}

	.card-body {
		padding: 30rpx;
	}

	/* 列表条目样式 */
	.list-item {
		display: flex;
		align-items: center;
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
		border: 1px solid #f0f0f0;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.04);

		&:last-child {
			margin-bottom: 0;
		}
	}

	.item-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		margin-right: 24rpx;
		background-size: 80rpx 80rpx;
		position: relative;

		.item-icon-img {
			width: 80rpx;
			height: 80rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}
	}

	.blue-bg {
		position: relative;
		z-index: 1;
		color: #2D93FF;
	}

	.orange-bg {
		position: relative;
		z-index: 1;
		color: #e67e22;
	}

	.item-info {
		flex: 1;

		.item-name {
			font-size: 15px;
			font-weight: 500;
			color: #333;
			margin-bottom: 4px;
		}

		.item-desc {
			font-size: 12px;
			color: #999;
		}
	}

	.btn-subscribe {
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #628F2F;
		color: #fff;
		font-size: 28rpx;
		border-radius: 30rpx;
		padding: 0;
		margin: 0;
		border: none;
	}

	/* 撮合条目样式 */
	.match-item {
		background: linear-gradient(112deg, #F8FCF9 1%, #EDFFF1 100%);
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		border: 1px solid #f0f0f0;
		box-shadow: 0px 2px 8px 0px rgba(211, 231, 209, 0.5);

		&:last-child {
			margin-bottom: 0;
		}
	}

	.match-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}

	.route {
		display: flex;
		align-items: center;

		.city {
			font-size: 18px;
			font-weight: bold;
			color: #628F2F;
		}

		.route-line {
			// width: 60px;
			// height: 2px;
			width: 140rpx;
			height: 26rpx;
			// background-color: #68945c;
			margin: 0 20rpx;
		}
	}

	.goods-weight {
		font-size: 36rpx;
		font-weight: bold;
		color: #e67e22;
	}

	.match-bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.detail-info {
		.info-row {
			margin-bottom: 12rpx;
			font-size: 28rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.label {
				color: #333333;
				margin-right: 20rpx;
			}

			.value {
				color: #333333;
			}
		}
	}

	.btn-grab {
		width: 160rpx;
		height: 64rpx;
		line-height: 64rpx;
		background-color: #f39c12;
		color: #fff;
		font-size: 28rpx;
		border-radius: 12rpx;
		padding: 0;
		margin: 0;
		border: none;
	}

	.mt-20 {
		margin-top: 40rpx;
	}
</style>