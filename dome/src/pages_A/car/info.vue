<template>
	<view class="container" :data-theme="pageTheme" >
		<!-- <cos-header :title="infoData.auditStatus == '2' ? '通过' : infoData.auditStatus == '3' ? '驳回' : infoData.auditStatus == '04' ? '作废' : infoData.auditStatus == '0' ? '待审核' : ''" :carIcon="infoData.auditStatus == '02' ? 'car_pass.png' : infoData.auditStatus == '03' ? 'car_reject.png' : ''" :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="100" :backUrl="'/pages_A/car/myCar'"></cos-header> -->
			<!-- 0待审核、1审核通过、2审核驳回 -->

			<up-navbar bgColor="transparent" :title="infoData.auditStatus == '1' ? '通过' : infoData.auditStatus == '2' ? '驳回' : infoData.auditStatus == '4' ? '作废' : infoData.auditStatus == '0' ? '待审核' : ''" @leftClick="toBack" :placeholder="true"
			:fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<!-- <scroll-view class="pageCon" :style="{ paddingTop: navBarHeight + 'px' }"> -->
		<scroll-view class="pageCon"> 
			<view class="whiteBg flex flex-col">
				<text v-if="infoData.auditStatus == '2'" class="fs-24 colff9 m-b-20">驳回原因：{{infoData.auditOpinion}}</text>
				<view class="title flex ali-cen m-b-25">
					<view class="line"></view>
					<text class="fs-32 fw-600">行驶证</text>
				</view>
				<view class="flex just-sb ali-cen">
					<u-image class="dri-img" width="300rpx" radius="8" height="168rpx" :src="infoData.drivingLicenseFront" mode="aspectFill" @click="previewImage(infoData.drivingLicenseFront)" lazy-load></u-image>
					<u-image v-if="infoData.drivingLicenseBack" radius="8" class="dri-img" width="300rpx" height="168rpx" :src="infoData.drivingLicenseBack" mode="aspectFill" @click="previewImage(infoData.drivingLicenseBack)" lazy-load></u-image>
				</view>
			</view>
			
			<view class="whiteBg flex flex-col">
				<view class="title flex ali-cen">
					<view class="line"></view>
					<text class="fs-32 fw-600">车牌号码</text>
				</view>
				<view class="numCon" style="margin-top: 40rpx;">
					<view v-for="(item, index) in infoData.licensePlate" :key="index">
						<!-- 蓝牌 -->
						<block v-if="infoData.plateColor == '1'">
							<view class="carNumBg bg_blue" v-if="item !== '?'" 
								:data-index="index">{{ item }}</view>
							<view class="carNumBg bg_normal" v-else></view>
						</block>
						<!-- 黄牌 -->
						<block v-else-if="infoData.plateColor == '3'">
							<view class="carNumBg bg_yellow" v-if="item !== '?'"
								:data-index="index">{{ item }}</view>
							<view class="carNumBg bg_normal" v-else></view>
						</block>
						<!-- 绿牌 -->
						<block v-else-if="infoData.plateColor == '2'">
							<view class="carNumBg bg_green" v-if="item !== '?'" 
								:data-index="index">{{ item }}</view>
							<view class="carNumBg bg_normal" v-else></view>
						</block>
						<!-- 黄绿 -->
						<block v-else-if="infoData.plateColor == '6'">
							<block v-if="index < 2">
								<view class="carNumBg bg_yellow" v-if="item !== '?'"
									:data-index="index">{{ item }}</view>
								<view class="carNumBg bg_normal" v-else></view>
							</block>
							<block v-else>
								<view class="carNumBg bg_green" v-if="item !== '?'">{{ item }}</view>
								<view class="carNumBg bg_normal" v-else></view>
							</block>
						</block>
					</view>
					<view class="carNumBg3" v-if="carType !== 'g' && carType !== 'yg'">新能源</view>
				</view>
			</view>
			
			<view class="whiteBg flex flex-col">
				<view class="title flex ali-cen">
					<view class="line"></view>
					<text class="fs-32 fw-600">车牌颜色</text>
				</view>
				<view class="flex just-sb ali-cen">
					<block v-if="infoData.plateColor == '1'">
						<view class="car-box">
							<image class="carImg m-t-25" :src="imgUrl + 'mine/car_b.png'"/>
							<text class="car-text w">蓝牌</text>
						</view>
					<!-- 	<text class="m-t-25 fs28 fw-500 col3">小型货车/小型客车</text> -->
					</block>
					<block v-if="infoData.plateColor == '3'">
						<view class="car-box">
							<image class="carImg m-t-25" :src="imgUrl + 'mine/car_y.png'" />
							<text class="car-text b">黄牌</text>
						</view>
					<!-- 	<text class="m-t-25">大型货车/大型客车</text> -->
					</block>
					<block v-if="infoData.plateColor == '2'">
						<view class="car-box">
							<image class="carImg m-t-25" :src="imgUrl + 'mine/car_g.png'" />
							<text class="car-text b">渐变绿牌</text>
						</view>
					<!-- 	<text class="m-t-25">小型新能源车</text> -->
					</block>
					<block v-if="infoData.plateColor == '6'">
						<view class="car-box">
							<image class="carImg m-t-25" :src="imgUrl + 'mine/car_yg.png'" />
							<text class="car-text b">黄绿双牌</text>
						</view>
					<!-- 	<text class="m-t-25">大型新能源车</text> -->
					</block>
					
				</view>
			</view>
			
			<view class="whiteBg flex just-sb ali-cen">
				<view class="title flex ali-cen">
					<view class="line"></view>
					<text class="fs-32 fw-600">所属人姓名</text>
				</view>
				<text class="fs28 fw-500 col3" v-if="infoData.enterpriseName">{{infoData.enterpriseName}}</text>
				<text class="fs28 fw-500 col3" v-else>{{infoData.vehicleOwnerName}}</text>
			</view>
		</scroll-view>
		
		<!-- 解绑车辆按钮 -->
		<view class="bottom-bar" v-if="infoData.auditStatus== '1'">
			<view class="add-vehicle" v-if="!infoData.enterpriseId || (infoData.enterpriseId && userIdentity.identityType == 2)" @click="handleUnbind(infoData)">
				<text>解绑</text>
			</view>
			
		</view>
		<!-- <view class="bottom-bar">
			<view v-if="infoData.auditStatus == '02'" class="add-vehicle" @click="handleUnbind(infoData)">
				<text>解绑</text>
			</view>
			<view v-else class="flex just-sb">
				<view class="un-btn" @click="handleUnbind(infoData)">解绑</view>
				<view class="re-btn" @click="toJump(`/pages_A/car/addCar?vehicleId=${infoData.vehicleId}`)">重新上传</view>
			</view>
		</view> -->
		<up-gap height="90"></up-gap>
	</view>
</template>

<script setup lang="ts">
	
	import { ref, onMounted } from 'vue';
	import { imgUrl } from '../../config';
	import { toBack } from '@/utils/route';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import CosHeader from '@/components/customNavBar/index.vue';
	import { getUserVehicleByUserId, unBindVehicle } from '@/api/user';
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	const carNum = ref('');
	const carType = ref('b');
	const vehicleId = ref('')
	const status = ref(1)
	const infoData = ref<Record<string, any>>({});
	const userIdentity = ref({}); // 企业身份 0-无 1-普通成员，2-企业管理员
	
	onLoad((options) => {
		if (options) {
			vehicleId.value = options.vehicleId
			// getUserVehicleByUser();
			
			
		}
		if(uni.getStorageSync('userIdentity')){
			userIdentity.value = uni.getStorageSync('userIdentity');
		}
		if(uni.getStorageSync('mycar')){
			infoData.value = uni.getStorageSync('mycar');
			console.log("infoData", infoData.value)
			// uni.removeStorageSync('mycar');
		}
	})
	onMounted(() => {
		// 从cos-header组件获取实际高度或计算
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});
	// 图片预览
	const previewImage = (img) => {
	  uni.previewImage({
	    current: img,
	    urls: [img]
	  });
	};
	// 车辆详情
	const getUserVehicleByUser = async () => {
		const params = {
			vehicleId: vehicleId.value
		}
		const res = await getUserVehicleByUserId(params)
		infoData.value = res.clazz
	}
	
	/** 跳转 */
	const toJump = (url : string) => {
		uni.navigateTo({ url });
	};
	
	/** 解绑车辆 */
	const handleUnbind = async (item: VehicleItem) => {
	  try {
	    const result = await uni.showModal({
	      title: '提示',
	      content: `确定要解绑车牌号为 ${item.licensePlate} 的车辆吗？`,
	    });
	
	    if (!result.confirm) return;
	
	    const userInfo = uni.getStorageSync('userInfo');
	    if (!userInfo?.id) {
	      uni.showToast({ title: '用户信息获取失败', icon: 'error' });
	      return;
	    }
	
	    const params = {
	    //   userId: userInfo.id,
	      vehicleId: item.id
	    };
	
	    await unBindVehicle(params);
		uni.showToast({ title: '解绑成功', icon: 'success' });
		setTimeout(() => {
		   uni.navigateBack({ delta: 1 });
		    }, 500)
	  } catch (error) {
	    uni.showToast({ title: '解绑失败', icon: 'error' });
	  }
	};
</script>

<style scoped lang="scss">
	.container {
		background: var(--head-color);
	}
	
	.pageCon {
		// height: calc(100vh - 400rpx);
		padding-bottom: 200rpx;
	}
	
	.whiteBg {
		padding: 40rpx 30rpx 30rpx;
		margin: 20rpx 32rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		box-sizing: border-box;
		
		.title {
			.line {
				width: 8rpx;
				height: 34rpx;
				background: var(--primary-color);
				border-radius: 0rpx 4rpx 4rpx 0rpx;
				margin-right: 17rpx;
			}
		}
		
		.dri-img {
			width: 300rpx;
			height: 168rpx;
			background: #F5F6F7;
			border-radius: 16rpx;
			margin-top: 27rpx;
		}
		
		.numCon {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;
			margin-bottom: 50rpx;
			
			.carNumBg3 {
				width: 67rpx;
				height: 82rpx;
				background-color: #EEFCF8;
				border-radius: 10rpx;
				border: dashed 1rpx #00BD75;
				font-size: 22rpx;
				color: #00BD75;
				writing-mode: vertical-rl;
				text-align: center;
				line-height: 70rpx;
				letter-spacing: 2rpx;
			}
			
			.carNumBg {
				width: 67rpx;
				height: 82rpx;
				border-radius: 10rpx;
				font-size: 30rpx;
				font-weight: 500;
				line-height: 82rpx;
				text-align: center;
			}
			
			.bg_blue {
				background-color: #4B88F5;
				color: #ffffff;
			}
			
			.bg_yellow {
				background-color: #FFDE23;
				color: #000000;
			}
			
			.bg_green {
				background: linear-gradient(0deg, #6DBF5B, #E9F5E7);
				color: #000000;
			}
			
			.bg_normal {
				background-color: #f0f0f0;
				color: #333333;
			}
		}
		
		.carImg {
			width: 230rpx;
			height: 70rpx;
		}
	}
	
	.bottom-bar {
		width: 100%;
		height: 158rpx;
		background: #FFFFFF;
		position: fixed;
		bottom: 0;
		padding: 15rpx 32rpx;
		z-index: 8;
		box-sizing: border-box;
		
		.add-vehicle {
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
			width: 686rpx;
			height: 80rpx;
			background: var(--primary-color);
			border-radius: 40rpx;
		
		
			text {
				margin-left: 10rpx;
			}
		}
		
		.un-btn {
			width: 330rpx;
			height: 80rpx;
			background: #FFFFFF;
			border-radius: 40rpx;
			border: 1px solid var(--primary-color);
			font-weight: 500;
			font-size: 30rpx;
			color: var(--primary-color);
			text-align: center;
			line-height: 80rpx;
		}
		
		.re-btn {
			width: 330rpx;
			height: 80rpx;
			background: var(--primary-color);
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #FFFFFF;
			text-align: center;
			line-height: 80rpx;
		}
	}
	
	.car-box {
		position: relative;
	}
	.car-text {
		position: absolute;
		left: 50%;
		top: 45rpx;
		transform: translateX(-50%);
		font-weight: 500;
		font-size: 26rpx;
	}
	.w {
		color: #fff;
	}
	
	.b {
		color: #000000;
	}
	
	::v-deep .u_image__image {
		width: 300rpx;
		height: 168rpx;
	}
</style>