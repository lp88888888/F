<template>
	<view class='container-box' :data-theme="pageTheme">
		<up-sticky :bgColor="navBgColor">
			<!-- <up-navbar :title="detail.status == 2?'已评价':detail.status == 1?'已完成':'待服务'" bgColor='none'
				@leftClick="toBack" placeholder :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar> -->
				<up-navbar title="预约详情" bgColor='none'
					@leftClick="toBack" placeholder :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
				
		</up-sticky>
		<view v-if="detail.id">
			<view class="heeaer-box">
				<image :src="detail.prCarTypeVo?.picture" mode="" class="icon-header"></image>
				<view class="heeaer-box-right">
					<view class="tit-name">
						{{ detail.prCarTypeVo?.name }}
					</view>
					<view class="tit-time">
						<image :src="imgUrl+'static/wx-time-icon.png'" mode="" class="icon-header-2"></image>
						{{detail.createTime}}
					</view>
				</view>
			</view>

			<view class="box_2" v-if='detail.receptionist'>
				<view class="box_2_title">
					<text>商家受理信息</text>
				</view>
				<view class="box_2_item">
					<text>受理人员</text>
					<text>{{detail.receptionist}}</text>
				</view>
				<view class="box_2_item">
					<text>受理时间</text>
					<text>{{detail.receptionTime}}</text>
				</view>
			</view>

			<view class="container">
				<!-- 预约信息 -->
				<view class="section">
					<view class="section-title">预约信息</view>
					<view class="info-item" style="border-top: 2rpx solid #ebebeb;">
						<text class="label">姓名</text>
						<text class="value">{{ detail?.name }}</text>
					</view>
					<view class="info-item">
						<text class="label">手机号</text>
						<text class="value">{{ detail?.phone }}</text>
					</view>
					<view class="info-item">
						<text class="label">品牌</text>
						<text class="value">{{ detail?.brandName }}</text>
					</view>
					<view class="info-item">
						<text class="label">车系</text>
						<text class="value">{{ detail?.seriesName }}</text>
					</view>
					<view class="info-item">
						<text class="label">到店时间</text>
						<text class="value">{{ detail?.appointmentTime}}</text>
					</view>
					<view class="info-item">
						<text class="label">预约单号</text>
						<text class="value">{{ detail.id || '' }}</text>
					</view>
					<view class="info-item">
						<text class="label">下单时间</text>
						<text class="value">{{ detail?.createTime || '' }}</text>
					</view>
					<view class="info-item">
						<text class="label">状态</text>
						<text class="status-text" v-if="statuszt(detail.status)=='待服务'">{{statuszt(detail.status)}}</text>
						<text v-else>{{statuszt(detail.status)}}</text>
					</view>
				</view>

				<!-- 门店信息 -->
				<view class="section" style="padding: 10rpx 37rpx 20rpx;"
					@click="navigateToApp(detail.prIndustry4sVo.name,detail.prIndustry4sVo.latitude,detail.prIndustry4sVo.longitude)">
					<view class="section-title"
						style="width: 100%;padding-bottom: 20rpx;border-bottom: 1px solid #ebebeb;">门店信息</view>
					<view class="store-info">
						<image :src="detail.prIndustry4sVo?.image" class="store-image"></image>
						<view class="store-details">
							<view class="store-name">{{ detail.prIndustry4sVo?.name }}</view>
							<view class="store-address">
								<image :src="imgUrl+'static/wx-weizhi-icon.png'" class="store-image-1"></image>
								<text class='map-ad'>{{ detail.prIndustry4sVo?.address }}</text>
							</view>
							<view class="bdphone" v-if="detail.prIndustry4sVo.contactNumber"
								@click.stop="makePhoneCall(detail.prIndustry4sVo?.contactNumber)">
								拨打商家电话
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="" style="height: 180rpx;"></view>
			<!-- <view class="foot-box" v-if="!detail.sysReviewVo && detail.status == 1">
				<view v-if="detail.status == 1" class="edit-button" @click="toEvaluate">服务评价</view>
			</view> -->
		</view>

	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { imgUrl } from '@/config';
	import { toNav, toBack } from '@/utils/route';
	import { debounce, toast } from '@/utils/common';
	import { makePhoneCall, openLocation } from '@/utils/util';
	import { onLoad, onPageScroll } from '@dcloudio/uni-app';
	import { ckappointmentRentCar } from '@/api/car.ts';
	const detail = ref({});
	const navBgColor = ref('transparent')
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const statuszt = (val) => {
		const num = Number(val);
		switch (num) {
			case 0:
				return '待服务'
			case 1:
				return '已服务'
			case '':
				return '未知'
		}
	}
	const toEvaluate = () => {
		toNav(`/pages_D/usedCar/orderEvaluate?id=${detail.value.id}&merchantId=${detail.value.prIndustry4sVo?.id}&type=2`)
	}

	const getDetail = async (id) => {
		let res = await ckappointmentRentCar(id);
		if (res.code == 200) {
			detail.value = res.data;
		} else {
			toast(res.msg)
		}
	};
	const navigateToApp = (name, lat, long) => {
		openLocation({
			latitude: Number(lat),//维度
			longitude: Number(long),//经度
			scale: 18,//缩放比例，范围5~18，默认为18
			name: name,
		})
	}
	onLoad((opticons) => {
		getDetail(opticons.id)
	})
	onPageScroll((e) => {
		let bag = ''
		if (pageTheme.value == 'green') {
			bag = '#edf8f0'
		} else {
			bag = '#c0e1ff'
		}

		if (e.scrollTop > 10) {
			navBgColor.value = bag
		} else {
			navBgColor.value = 'transparent'
		}

	})
</script>

<style scoped lang="scss">
	.container-box {
		background: var(--head-color);
	}

	.foot-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
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
		border-top: 1px solid #f5f5f5;
	}

	.phone-button {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.phone-icon {
		width: 36rpx;
		height: 36rpx;
	}

	.phone-text {
		font-size: 28rpx;
		color: #333;
	}

	.edit-button {
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		font-size: 30rpx;
		color: #fff;
		width: 580rpx;
		height: 80rpx;
		background: var(--primary-color);
		border-radius: 40rpx;
		margin: 0 auto;
	}

	.bdphone {
		width: 210rpx;
		text-align: center;
		padding: 10rpx 0;
		display: flex;
		margin-left: auto;
		align-items: center;
		justify-content: center;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		border: 1px solid var(--primary-color);
		color: var(--primary-color)
	}

	.heeaer-box {
		margin: 30rpx 32rpx 0;
		padding: 30rpx;
		display: flex;
		align-items: center;
		background-color: #fff;
		border-radius: 20rpx;
		position: relative;
		box-shadow: 0rpx 4rpx 16rpx 0rpx var(--bgqtmd);
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
		background: var(--head-color);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	::v-deep .u-navbar__content {
		background: none !important;
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
		padding: 10rpx 37rpx;
		box-shadow: 0rpx 4rpx 16rpx 0rpx var(--bgqtmd);
	}

	.section-title {
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
		margin: 20rpx 0;
	}

	.info-item {
		height: 70rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
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
		font-weight: 700;
		font-size: 28rpx;
		color: #000;
		margin: 10rpx 0;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.store-image-1 {
		width: 20rpx;
		height: 24rpx;
		margin-left: 10rpx;
		display: inline-block;
	}

	.store-address {
		display: flex;
		align-items: center;
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
		gap: 10rpx;
		margin-bottom: 20rpx;
	}

	.map-ad {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.box_2 {
		width: 690rpx;
		padding: 0 30rpx 10rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 16rpx var(--bgqtmd);
		background: #fff;
		margin: 30rpx auto 0;
		box-sizing: border-box;

		.box_2_title {
			width: 100%;
			height: 80rpx;
			border-bottom: 2rpx solid #ebebeb;

			text {
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;
				line-height: 85rpx;
			}
		}

		.box_2_item {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 20rpx 0;

			text:nth-child(1) {
				font-weight: 400;
				font-size: 28rpx;
				color: #999999;
			}

			text:nth-child(2) {
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
			}
		}
	}
	.status-text {
			color: var(--secondary-color) !important;
		}
</style>