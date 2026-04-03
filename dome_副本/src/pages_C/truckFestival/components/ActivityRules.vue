<template>
	<view class="page-view" :data-theme="pageTheme">
		<up-navbar title="活动规则" bgColor="transparent" @leftClick="toBack" :placeholder="true" :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="topBox" v-if='hdobj!=null' >
			<view class="topBox-cent">
				<view class="topBox-cent-title">
					<text class="topBox-cent-title-text" v-if='hdobj.applyType==1'>个人车主</text>
					<text class="topBox-cent-title-text" v-if='hdobj.applyType==2'>企业车主</text>
					<image class="topBox-cent-title-img" :src="imgUrl+'static/C-truck/qiehuan-icon.png'" mode="">
					</image>
				</view>
				<view class="topBox-cent-text" v-if="hdobj.licensePlates?.lenght>0">
					<view class="topBox-cent-text-2">已参加活动车辆：{{hdobj.licensePlates?.lenght}} </view>
					<view class="topBox-cent-text-labs">
						<text v-for="item in hdobj.licensePlates">{{item.licensePlate}}</text>
					</view>
				</view>
			</view>
			<view class="topBox-but" v-if="hdobj. status==0||hdobj. status==1">已报名</view>
		</view>
		<view class="content-scroll">
			<view class="banner-box">
				<image class="banner-img" :src="imgUrl+'static/C-truck/组 14457@1x.png'" mode="aspectFill" />
			</view>

			<view class="stats-row">
				<view class="stats-card" :style="{background: `url(${imgUrl}static/C-truck/card1.png) no-repeat`}">
					<view class="tag" :style="{background: `url(${imgUrl}static/C-truck/card1-icon.png) no-repeat`}">
						已报名企业用户</view>
					<view class="count-box">
						<text class="number">{{statsObj.enterpriseCount || 0}}</text>
					</view>
				</view>
				<view class="stats-card" :style="{background: `url(${imgUrl}static/C-truck/card2.png) no-repeat`}">
					<view class="tag" :style="{background: `url(${imgUrl}static/C-truck/card2-icon.png) no-repeat`}">
						已报名个人用户</view>
					<view class="count-box">
						<text class="number">{{statsObj.personalCount || 0}}</text>
					</view>
				</view>
			</view>
			<view class="video-container">
				<!-- <video 
		      id="myVideo" 
		      class="video-player"
		      src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400"
		      poster="https://via.placeholder.com/690x380"
		      controls
		    ></video> -->
			</view>
			<view class="text-rules" v-html="activitydel.clockRulesDesc" >
			</view>
			<view class="detail-poster">
				<!-- <view class="poster-inner">
					<view class="poster-header">
						<text class="main-title">通行高速</text>
						<text class="sub-title">省心·放心·赚积分</text>
					</view>

					<view class="info-section">
						<view class="section-title">● 活动路段 ●</view>
						<view class="section-content">
							绕城高速全网、西咸南通延延网<br />
							宝汉高速全段、临蓝高速全段、神府高速等各主要路段<br />
							宝鸡绕城全段、延西高速全段、建铜高速等各相关路段
						</view>
					</view>

					<view class="reward-box">
						<view class="reward-item">新用户首次通行可享受 <text class="highlight">“10倍积分激励”</text></view>
						<view class="reward-item">某积分公司商事业务流程可享受 <text class="highlight">5倍积分激励</text></view>
						<view class="reward-item">通行路段即可兑换积分补贴产品</view>
						<view class="reward-total">
							<text class="total-num">1.1</text>
							<text class="total-unit">亿余元的权益资源任您兑</text>
						</view>
					</view>
				</view> -->
				<image class="aivimg" :src="activitydel.mainPageImg" mode="aspectFill" />
			</view>
				
			<view class="safe-area-bottom"></view>
		</view>
		<view class="btn-group">
			<view class="btn btn-blue" @click="qiyeopen">企业报名</view>
			<view class="btn btn-orange" @click="submit(1)">个人报名</view>
		</view>
		<up-popup mode="center" bgColor="transparent" :safeAreaInsetBottom="false" :show="show" @close="close">
			<view style="width: 600rpx;">
				<view class="modal-container">
					<view class="modal-title">请选择您名下的要报名的企业</view>
					<view class="company-list">
						<view v-for="(item, index) in enterlist" :key="item.id" class="company-card"
							:class="{ 'active-card': selectedId === item.id }" @click="selectCompany(index)">
							<view class="card-left">
								<image class="building-icon" :src="imgUrl+'static/C-truck/qy-icon.png'"
									mode="aspectFit"></image>
								<view class="info">
									<view class="company-name">{{ item.enterpriseName }}</view>
									<view class="truck-count">共计：{{ item.vehicleQuantity }}辆货车</view>
								</view>
							</view>

							<view class="radio-box">
								<image v-if="item.istype" class="unchecked-circle" :src="icoUrl+'check-car-icon.png'"
									mode=""></image>
								<image v-else class="unchecked-circle" :src="icoUrl+'car_normal1.png'" mode=""></image>
							</view>
						</view>
					</view>
					<view class="footer-btns">
						<button class="btn-cancel" @click="close">取消</button>
						<button class="btn-submit" @click="handleSubmit">报名</button>
					</view>
				</view>
				<view class="close-wrapper" @click="close">
					<image class="close-wrapper-img" :src="imgUrl+'static/C-truck/close-icon.png'" mode=""></image>
				</view>
			</view>
		</up-popup>
		<up-gap height="100"></up-gap>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { toast, debounce } from '@/utils/common';
	import { enterpriseList } from '@/api/car';
	import { getRegistrationStats, applyRegistration, getMyRegistrations, getCurrentTruckFestival } from '@/api/truck';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	const props = defineProps<{
		campaignId : number,
		type : string,
	}>()
	const show = ref(false);
	const close = () => {
		show.value = false
	}
	const userinfo = ref(uni.getStorageSync('userInfo'))
	const enterlist = ref([])
	const getenterlist = async () => {
		const res = await enterpriseList({
			memberId: uni.getStorageSync('userInfo').id,
			auditStatus: 1,
		})
		if (res?.code == 200) {
			enterlist.value = res.data.list
			enterlist.value.forEach((item) => {
				item.istypr = false
			})
		}
	}
	const activitydel = ref({})
	const getactivity = async () => {
		try {
			const res = await getCurrentTruckFestival({
				campaignId: props.campaignId
			})
			activitydel.value = res.data
			// myregistrations()
		} catch (err) {
		}
	}
	const enterpriseIdlist = ref([])
	const qiyeopen = () => {
		if (enterlist.value?.length > 1) {
			show.value = true
		} else {
			enterpriseIdlist.value.push(enterlist.value[0].id)
			qiyesave()
		}
	}
	// 默认选中第一个
	const selectedId = ref(null);

	const selectCompany = (index) => {
		entrlist.value[index].istype = !entrlist.value[index].istype
	};

	const handleClose = () => {
		console.log('关闭/取消');
	};

	// 报名
	const submit = async (applyType) => {
		try {
			const res = await applyRegistration({
				campaignId: props.campaignId,
				applyType: applyType,
			})
			toast('报名成功')
		} catch (err) {
			console.log('0-applyRegistrationerr', err);
		}
	}
	const handleSubmit = () => {
		enterlist.value.forEach((item) => {
			if (item.istypr) {
				enterpriseIdlist.value.push(item.id)
			}
		})
		qiyesave()
	};
	const qiyesave = async () => {
		try {
			const res = await applyRegistration({
				campaignId: props.campaignId,
				applyType: 2,
				enterpriseId: enterpriseIdlist.value,
			})
			enterpriseIdlist.value = []
			toast('报名成功')
		} catch (err) {
			console.log('0-applyRegistrationerr', err);
		}
	}

	const statsObj = ref({
		campaignId: "",
		campaignName: "",
		enterpriseCount: 0, // 企业报名数量
		personalCount: 0, // 个人报名数量
		totalVehicleCount: 0, // 总报名车辆数
	})

	// 查询报名数量信息
	const init = async () => {
		try {
			const res = await getRegistrationStats({
				campaignId: props.campaignId
			})
			statsObj.value = res.data
		} catch (err) {
		}
	}
	const hdobj = ref({})
	const myregistrations = async () => {
		try {
			const res = await getMyRegistrations({
				campaignId: props.campaignId
			})
			hdobj.value = res.data
		} catch (err) {
		}
	}
	onMounted(() => {
		init()
		getenterlist()
		myregistrations()
		getactivity()
	})
</script>

<style lang="scss" scoped>
	.btn-group {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 120rpx;
		display: flex;
		justify-content: space-around;
		padding: 20rpx 30rpx;
		box-sizing: border-box;

		.btn {
			width: 320rpx;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			border-radius: 44rpx;
			color: #fff;
			font-size: 30rpx;
			font-weight: bold;
		}

		.btn-blue {
			background: #4881F5;
		}

		.btn-orange {
			background: #FF8605;
		}
	}

	.topBox {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		box-sizing: border-box;

		.topBox-cent {
			width: calc(100% - 150rpx);

			.topBox-cent-title {
				display: flex;
				align-items: center;

				.topBox-cent-title-text {
					font-size: 28rpx;
					font-weight: bold;
					color: #333333;
					margin-right: 10rpx;
				}

				.topBox-cent-title-img {
					width: 24rpx;
					height: 24rpx;
				}
			}

			.topBox-cent-text {

				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #666666;
				margin-top: 12rpx;

				.topBox-cent-text-2 {}

				.topBox-cent-text-labs {
					display: flex;
					flex-wrap: wrap;
					gap: 10rpx;
				}
			}

		}

		.topBox-but {
			width: 120rpx;
			height: 54rpx;
			line-height: 54rpx;
			text-align: center;
			border-radius: 12rpx;
			background: #DFDFDF;
			font-size: 24rpx;
			color: #666666;
		}
	}

	.content-scroll {
		flex: 1;
		overflow: hidden;
	}

	/* 1. Banner */
	.banner-box {
		padding: 20rpx 30rpx;

		.banner-img {
			width: 690rpx;
			height: 320rpx;
			border-radius: 20rpx;
		}
	}

	/* 2. 统计卡片 */
	.stats-row {
		display: flex;
		padding: 0 30rpx;
		justify-content: space-between;
		margin-top: 10rpx;

		.stats-card {
			width: 330rpx;
			height: 132rpx;
			// background: #fff;
			background-size: 330rpx 132rpx;
			border-radius: 16rpx;
			position: relative;
			// overflow: hidden;
			padding: 15rpx 20rpx;
			box-sizing: border-box;
			box-shadow: 0px 0px 10px 0px rgba(137, 162, 107, 0.1);

			.tag {
				width: 250rpx;
				height: 52rpx;
				line-height: 52rpx;
				font-size: 28rpx;
				padding: 0 12rpx;
				box-sizing: border-box;
				border-radius: 0 0 16rpx 0;
				position: absolute;
				top: 0;
				left: 0;
				color: #fff;
			}

			.count-box {
				margin-top: 45rpx;
				display: flex;
				justify-content: center;
				align-items: flex-end;

				.number {
					font-size: 40rpx;
					font-weight: bold;
					color: #333333;
				}
			}

		}
	}

	/* 3. 视频 */
	.video-container {
		padding: 30rpx;

		.video-player {
			width: 100%;
			height: 380rpx;
			border-radius: 16rpx;
		}
	}

	/* 4. 文本 */
	.text-rules {
		padding: 0 40rpx;
		font-size: 24rpx;
		color: #333;
		line-height: 1.6;
	}

	/* 5. 详情海报 */
	.detail-poster {
		margin: 40rpx 30rpx;
		// background: linear-gradient(180deg, #5C9FFF 0%, #4A88FF 100%);
		// border-radius: 20rpx;
		// color: #fff;
		// padding: 60rpx 40rpx;
		// text-align: center;
		.aivimg{
			width: 100%;
			height:680rpx;
		}
		.poster-header {
			margin-bottom: 40rpx;

			.main-title {
				font-size: 80rpx;
				font-weight: 800;
				display: block;
				letter-spacing: 4rpx;
			}

			.sub-title {
				font-size: 40rpx;
				font-weight: 600;
			}
		}

		.info-section {
			margin-top: 40rpx;

			.section-title {
				color: #FFD54F;
				font-size: 28rpx;
				margin-bottom: 15rpx;
			}

			.section-content {
				font-size: 20rpx;
				line-height: 1.5;
				opacity: 0.9;
			}
		}

		.reward-box {
			margin-top: 50rpx;
			background: rgba(255, 255, 255, 0.15);
			border: 1px solid rgba(255, 255, 255, 0.3);
			border-radius: 20rpx;
			padding: 30rpx;
			font-size: 22rpx;

			.reward-item {
				margin-bottom: 10rpx;
			}

			.highlight {
				color: #FFEB3B;
				font-weight: bold;
			}

			.reward-total {
				margin-top: 20rpx;

				.total-num {
					font-size: 48rpx;
					color: #FFEB3B;
					font-weight: bold;
				}
			}
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
		margin-bottom: 50rpx;
	}

	.company-list {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
		margin-bottom: 60rpx;
	}

	.company-card {
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 4rpx solid transparent; // 预留边框位置防止跳动
		transition: all 0.2s;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

		&.active-card {
			border-color: #7ab34d;
		}
	}

	.card-left {
		display: flex;
		align-items: center;
	}

	.building-icon {
		width: 60rpx;
		height: 60rpx;
		margin-right: 10rpx;
		// 这里如果没图片可以用CSS画两个方块代替
	}

	.company-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
	}

	.truck-count {
		font-size: 22rpx;
		color: #666666;
		margin-top: 8rpx;
	}

	/* 单选框样式 */
	.radio-box {
		.unchecked-circle {
			width: 28rpx;
			height: 28rpx;
		}

		.checked-icon {
			width: 44rpx;
			height: 44rpx;
			background-color: #7ab34d;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;

			.check-mark {
				color: #fff;
				font-size: 24rpx;
			}
		}
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
		border: 2rpx solid #7ab34d;
		color: #7ab34d;
		border-radius: 50rpx;
		font-size: 32rpx;
	}

	.btn-submit {
		flex: 1;
		height: 90rpx;
		line-height: 90rpx;
		background: linear-gradient(90deg, #80A653 4%, #B2D38A 92%);
		color: #ffffff;
		border-radius: 50rpx;
		font-size: 32rpx;
		border: none;

		&::after {
			border: none;
		}
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
</style>