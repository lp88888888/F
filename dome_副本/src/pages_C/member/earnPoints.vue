<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-navbar title="赚积分" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
			<!-- <up-sticky>
				<view class="searchView" >
					<up-navbar bgColor="transparent" title='积分榜单' @leftClick="toBack" placeholder fixed></up-navbar>
				</view>
			</up-sticky> -->
		<view style="box-shadow: 0rpx 0rpx 8rpx 0rpx #D3E7D1;border-radius: 10rpx;">

			<view class="titleBox">
				<up-icon :name="`${imgUrl}vipcard/zhuan-1icon.png`" size="30"></up-icon>
				<text class="titleBox-text">新人任务</text>
			</view>
			<view class="cardBox">
				<view class="cardBox-cenr">
					<text class="cardBox-cenr-title">注册成功获得</text>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text1">注册成功可领{{makeinfo.registerPointRule?.point||0}}积分</text>
				</view>
				<view class="fontTetx" v-if="makeinfo.registerPointRule?.getPoint==false">
					奖励已发放</view>
			</view>
			<!-- <view class="cardBox">
				<view class="cardBox-icon" v-if="makeinfo.infoAUthPointRule.pointType=='common'">活动积分</view>
				<view class="cardBox-cenr">
					<text class="cardBox-cenr-title">信息认证</text>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text1">信息认证可领{{makeinfo.infoAUthPointRule.point}}积分</text>
				</view>
				<view class="cardBox-but">可领{{makeinfo.infoAUthPointRule.point}}活动积分</view>
			</view> -->
			<!-- 	<view class="cardBox">
				<view class="cardBox-cenr">
					<text class="cardBox-cenr-title">绑定银行卡</text>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text1">绑定后，可领{{makeinfo.bindCardPointRule.point}}积分</text>
				</view>
				<view class="cardBox-but" v-if="makeinfo.bindCardPointRule.getPoint==false">去绑定</view>
			</view> -->
			<view class="cardBox">
				<view class="cardBox-cenr">
					<text class="cardBox-cenr-title">用户绑定车辆</text>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text1">{{makeinfo.bindVehiclePointRule?.point||0}}积分/车</text>
				</view>
				<view class="fl-al-ce">
					<!-- <view class="cardBox-but"  v-if="makeinfo.bindVehiclePointRule?.getPoint==false" @click="toNav('/pages_A/car/addCar')">继续绑定</view> -->
					<!-- <view class="cardBox-but" v-if="makeinfo.bindVehiclePointRule.getPoint==false">继续绑定</view> -->
					<!-- <view class="fontTetx">可领{{makeinfo.bindVehiclePointRule.point}}积分</view> -->
					<view class="fontTetx">奖励已发放</view>
				</view>
			</view>
			<view class="cardBox">
				<view class="cardBox-cenr">
					<text class="cardBox-cenr-title">ETC卡成功后获得</text>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text1">{{makeinfo.etcGetPointRule?.point||0}}积分/个</text>
				</view>
				<view class="cardBox-but" v-if="makeinfo.etcGetPointRule?.getPoint==false">去绑定</view>
			</view>
			<view class="cardBox">
				<view class="cardBox-cenr">
					<text class="cardBox-cenr-title">用户完善基础信息</text>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text1">最高得{{makeinfo.completeInfoPointRule?.point||0}}积分</text>
				</view>
				<view v-if="makeinfo.completeInfoPointRule?.getPoint==false" @click="toNav('/pages_A/personalinformation/personal')"
					class="cardBox-but">去完善</view>
				<view v-else class="fontTetx">奖励已发放</view>
			</view>
			<view class="cardBox">
				<view class="cardBox-cenr">
					<text class="cardBox-cenr-title">完善收货地址</text>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text1">最高得{{makeinfo.completeReceiveAddressPointRule?.point||0}}积分</text>
				</view>
				<view v-if="makeinfo.completeReceiveAddressPointRule?.getPoint==false" class="cardBox-but"
					@click="toNav('/pages_A/address/edit')">去完善</view>
				<view v-else class="fontTetx">奖励已发放</view>
			</view>
			<view class="cardBox">
				<view class="cardBox-cenr">
					<text class="cardBox-cenr-title">完善我的常用联系人</text>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text1">最高得{{makeinfo.completeContactPersonPointRule?.point||0}}积分</text>
				</view>

				<view v-if="makeinfo.completeContactPersonPointRule?.getPoint==false"
					@click="toNav('/pages_B/scenicSpotTicket/contactsList')" class="cardBox-but">去完善</view>
				<view v-else class="fontTetx">奖励已发放</view>
			</view>
		</view>
		<up-gap height="15"></up-gap>
		<view style="box-shadow: 0rpx 0rpx 8rpx 0rpx #D3E7D1;border-radius: 10rpx;">
			<view class="titleBox">
				<up-icon :name="`${imgUrl}vipcard/zhuan-2icon.png`" size="30"></up-icon>
				<text class="titleBox-text">日常任务</text>
			</view>
			<view class="cardBox">
				<view class="cardBox-cenr">
					<view class="cardBox-cenr-title">每日签到
						<text class="cardBox-cenr-title-icon">已连续{{makeinfo.signInPointRule?.haveDays||0}}天</text>
					</view>
					<up-gap height="8"></up-gap>
					<text class="cardBox-cenr-text1">每日赠送{{makeinfo.signInPointRule?.dayPoint||0}}积分</text>
				</view>
				<view class="cardBox-but" v-if="makeinfo.signInPointRule?.signFlag==false" @click="topiandano">签到</view>
			</view>
			<view class="cardBox">
				<view class="cardBox-cenr">
					<text class="cardBox-cenr-title">浏览与阅读</text>
					<up-gap height="8"></up-gap>
					<text
						class="cardBox-cenr-text1">{{makeinfo.lookReadPointRule?.seconds||0}}秒得{{makeinfo.lookReadPointRule?.point||0}}积分，每日上限{{makeinfo.lookReadPointRule?.limitPoint||0}}积分</text>
				</view>
				<view class="fontTetx2">
					今日：{{makeinfo.lookReadPointRule?.havePoint||0}}/{{makeinfo.lookReadPointRule?.limitPoint||0}}</view>
			</view>
			<view class="cardBox">
				<view class="cardBox-cenr">
					<text class="cardBox-cenr-title">转发分享</text>
					<up-gap height="8"></up-gap>
					<text
						class="cardBox-cenr-text1">单次{{makeinfo.forwardSharePointRule?.point||0}}，每日上限{{makeinfo.forwardSharePointRule?.limtTimes||0}}次</text>
				</view>
				<view class="fontTetx2">
					今日：{{makeinfo.forwardSharePointRule?.havePoint||0}}/{{makeinfo.forwardSharePointRule?.point*makeinfo.forwardSharePointRule?.limtTimes||0}}
				</view>
			</view>
		</view>
		<PageDurationTracker pageName="赚积分" />
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import {
		getmembermakePoint,
		postsaveSignInPoint
	} from '@/api/member';
	const backgroundColor = ref<string>('#EEFDF1');
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	import { getByUserIdAndVehicleAll } from '@/api/user';
	onMounted(() => {
		getMakePoint();
	})
	const makeinfo = ref({});
	const getMakePoint = async () => {
		const res = await getmembermakePoint();
		makeinfo.value = res.data;
		// getcarlist();
	}
	const topiandano = async () => {
		const res = await postsaveSignInPoint();
		getMakePoint(0)
	}
	const carlist = ref([]);
	const getcarlist = async () => {
		const userId = uni.getStorageSync('userInfo')?.id;
		if (!userId) return;
		const params = {
			userId: userId,
		};
		const res = await getByUserIdAndVehicleAll(params)
		carlist.value = res.data;
		if (carlist.value.length >= 3) {
			makeinfo.value.bindVehiclePointRule.getPoint = true
		}
	
	
	}
</script>

<style lang="scss" scoped>
	.pageView {
		width: 100%;
		min-height: 100vh;
		padding: 25rpx;
		box-sizing: border-box;
		background: var(--linear-color);
	}

	.titleBox {
		display: flex;
		align-items: center;
		padding: 25rpx;
		background: #FFFFFF;

		.titleBox-text {
			font-size: 30rpx;
			margin-left: 10rpx;
		}
	}

	.cardBox {
		width: 100%;
		min-height: 140rpx;
		margin: 0 auto;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;

		.cardBox-icon {
			position: absolute;
			right: 25rpx;
			top: 0;
			font-size: 22rpx;
			color: red;
			text-align: center;
			background: rgba(255, 139, 14, 0.13);
			border-radius: 0rpx 0rpx 8rpx 8rpx;
			color: #F6B027;
		}

		.cardBox-cenr {
			display: flex;
			flex-direction: column;

			.cardBox-cenr-title {
				font-size: 32rpx;
				font-weight: bold;
				display: flex;
				align-items: center;

				.cardBox-cenr-title-icon {
					margin-left: 10rpx;
					font-size: 22rpx;
					color: var(--primary-color);
					padding: 4rpx 20rpx;
					border-radius: 20rpx;
				}
			}

			.cardBox-cenr-text {
				font-size: 28rpx;
			}

			.cardBox-cenr-text1 {
				font-size: 22rpx;
				color: #999999;
				margin-top: 4rpx;
			}
		}

		.cardBox-but {
			padding: 17rpx 26rpx;
			background: var(--but-color-line);
			border-radius: 8rpx;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
		}
	}

	.fontTetx {
		padding: 17rpx 26rpx;
		background: #EFEFEF;
		border-radius: 8rpx;
		font-weight: 400;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999999;
	}

	.fontTetx2 {
		font-weight: 400;
		font-size: 28rpx;
		color: var(--primary-color);
	}
</style>