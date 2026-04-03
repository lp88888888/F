<template>
	<view style="background: #F1EFEC;">
		<view>
			<up-navbar :title="title" :bgColor="navBgColor" @leftClick="toBack" placeholder :fixed="true"
				:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		</view>
		<view class="fixBg"></view>
		<view class="heeaer-box">
			<image :src="imgUrl+'static/wx-gongju-icon.png'" mode="" class="icon-header"></image>
			<view class="heeaer-box-right">
				<view class="tit-name">
					{{fuwuinfo.repairTypeName}}
				</view>
				<view class="tit-time">
					<image :src="imgUrl+'static/wx-time-icon.png'" mode="" class="icon-header-2"></image>
					{{fuwuinfo.appointmentTime}}
				</view>
			</view>
		</view>
		<view class="container">
			<!-- 预约信息 -->
			<view class="section">
				<text class="section-title">预约信息</text>
				<view class="info-item" v-for="(item, index) in reservationInfo" :key="index">
					<text class="label">{{ item.label }}</text>
					<text class="value">{{ item.value }}</text>
				</view>
			</view>

			<!-- 门店信息 -->
			<view class="section">
				<text class="section-title">门店信息</text>
				<view class="store-info">
					<image :src="imgUrl+storeInfo.image" class="store-image"></image>
					<view class="store-details">
						<view class="store-name">{{ storeInfo.name }}</view>
						<view class="store-address" @click="navigateTo()">
							<image :src="imgUrl+'static/wx-weizhi-icon.png'" class="store-image-1"></image>
							{{ storeInfo.address }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="" style="height: 248rpx;background: #F1EFEC;"></view>
		<view class="foot-box">
			<!-- 电话按钮 -->
			<view class="phone-button" @click="callPhone()">
				<image :src="imgUrl+'static/wx-phone-icon.png'" class="phone-icon"></image>
				<text class="phone-text">电话</text>
			</view>

			<!-- 删除预约按钮 -->
			<!-- <view class="delete-button" v-if="fuwuinfo.appointmentStatus==0" @click="deleteReservation">取消预约</view> -->

			<!-- 修改预约按钮 -->
			<!-- <view v-if="fuwuinfo.appointmentStatus==0" class="edit-button" @click="toxiugai(fuwuinfo)">修改预约</view> -->
			<view class="pingjia-button" @click="editReservation(fuwuinfo)">服务评价</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	
	import { toNav, toBack } from '@/utils/route';
	import { onLoad, onPageScroll } from '@dcloudio/uni-app';
	import { getprRepairAppointment,putcancel } from '@/api/car';
	import { openAPPLocation,openLocation,makePhoneCall } from '@/utils/util';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	
	const title = ref('待服务');
	const navBgColor = ref('transparent');
	const reservationInfo = ref([
		{ label: '姓名', value: '李**' },
		{ label: '手机号', value: '15619153036' },
		{ label: '品牌', value: '深蓝' },
		{ label: '车型', value: '深蓝S07' },
		{ label: '到店时间', value: '2025-03-26' }
	]);

	const storeInfo = ref({
		imageUrl: 'https://via.placeholder.com/100x100', // 替换为真实图片 URL
		name: '陕西盛德鸿泰汽车销售有限公司',
		address: '陕西省未央区天台路89号陕西汽贸集团二手车中心'
	});
	onLoad((option) => {

		getRepairAppointment(option.id);
	})
	const fuwuinfo = ref({})
	const getRepairAppointment = async (id) => {
		const res = await getprRepairAppointment(id);
		fuwuinfo.value = res.data
		switch (fuwuinfo.value.appointmentStatus) {
			case 0:
				title.value = '待服务'
				break;
			case 1:
				title.value = '服务中'
				break;
			case 2:
				title.value = '已完成'
				break;
			case 3:
				title.value = '已取消'
				break;
			default:
				break;
		}
		reservationInfo.value = [
			{ label: '姓名', value: res.data.name },
			{ label: '手机号', value: res.data.phone },
			{ label: '品牌', value: res.data.carSeriesName },
			{ label: '车型', value: res.data.carTypeName },
			{ label: '到店时间', value: res.data.appointmentTime }
		]
		storeInfo.value = {
			imageUrl: res.data.prIndustry4sVo.image, // 替换为真实图片 URL
			name: res.data.prIndustry4sVo.name,
			address: res.data.prIndustry4sVo.address
		}
	}
	const navigateTo = () => {
		openLocation({
			latitude: res.data.prIndustry4sVo.latitude,//维度
			longitude: res.data.prIndustry4sVo.longitude,//经度
			scale: 18,//缩放比例，范围5~18，默认为18
			name: res.data.prIndustry4sVo.name,
		})
	};
	const callPhone = () => {
		makePhoneCall(fuwuinfo.value.phone)
	};
	// 定义方法
	const deleteReservation = () => {
		putcancel(fuwuinfo.value.id).then(res => {
			uni.showToast({
				title: '取消成功',
				icon: 'success'
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1000);
		}).catch(err => {
			uni.showToast({
				title: '取消失败',
				icon: 'error'
			});
		})
	};
	const toxiugai = (shop) => {
		uni.navigateTo({
			url: `/pages_D/repair/ScheduleRepair?weixiuid=${shop.id}&id=${shop.prIndustry4sVo.id}&name=${shop.prIndustry4sVo.name}`
		})
	};
	const editReservation = (shop) => {
		// 处理预约的逻辑
		uni.navigateTo({
			url: `/pages_D/usedCar/orderEvaluate?id=${shop.id}&merchantId=${shop.prIndustry4sVo.id}&type=${3}`
		})
		// 处理修改预约的逻辑
		console.log('Editing reservation...');
	};
	onPageScroll((e) => {
		if (e.scrollTop > 20) {

			navBgColor.value = themeStore.themeColors.$primaryColor;
		} else {
			navBgColor.value = 'transparent';
		}
	})
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
		color: #000;
		width: 280rpx;
		height: 80rpx;
		background: #FFFFFF;
		border-radius: 40rpx;
		border: 1px solid #C5C5C5;
	}

	.pingjia-button {
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		font-size: 30rpx;
		color: #fff;
		width: 580rpx;
		height: 80rpx;
		background: $bgLgColor;
		border-radius: 40rpx;
	}

	.edit-button {
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		font-size: 30rpx;
		color: #fff;
		width: 280rpx;
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
		background: linear-gradient(180deg, #FCA831 0%, #F1EFEC 100%);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.container {
		position: relative;
		/* 确保内部元素可以相对于这个容器定位 */
		z-index: 2;
		/* 设置比背景层更高的z-index值 */
		padding: 30rpx;
	}

	.section {
		background-color: #ffffff;
		border-radius: 20rpx;
		margin-bottom: 29rpx;
		padding: 35rpx 37rpx;
	}

	.section-title {
		font-weight: bold;
		font-size: 34rpx;
		color: #000000;
		margin-bottom: 31rpx;
	}

	.info-item {
		height: 116rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #f2f2f2;
		line-height: 116rpx;
	}

	.label {
		font-weight: 500;
		font-size: 28rpx;
		color: #888B93;
	}

	.value {
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
	}

	.store-info {
		display: flex;
		align-items: center;
		margin-top: 32rpx;
	}

	.store-image {
		width: 130rpx;
		height: 106rpx;
		border-radius: 10rpx;
		margin-right: 28rpx;
	}

	.store-details {
		flex: 1;
	}

	.store-name {
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;
		margin-bottom: 10rpx;
	}

	.store-image-1 {
		width: 20rpx;
		height: 24rpx;
		margin-right: 20rpx;
	}

	.store-address {
		display: flex;
		align-items: center;
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
	}
</style>