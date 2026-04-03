<template>
	<view class="page" :data-theme="pageTheme">
		<!-- 头部背景色 -->
		<view class="bgcolor" :style="{ background: themeStore.themeColors.$pageheadbg }"></view>

		<up-navbar title="预约详情" bgColor="transparent" autoBack :placeholder="true" :fixed="false"></up-navbar>

		<scroll-view scroll-y="true" class="scrollview">
			<view class="scrollbox">
				<view class="box_1" :style="{ background: themeStore.themeColors.$linear3Color }">
					<view class="box_1_title">
						<text class="wdjc">我的旧车</text>
						<image :src="imgUrl+'greed-icon.png'" class="icon1"></image>
					</view>
					<view class="box_1_info">
						<image :src="ckprCarOldForObj.prCarOldBrandVo?.logo" mode=""></image>
						<view class="box_1_info_r">
							<text>{{ckprCarOldForObj.prCarOldTypeVo?.name}}</text>
							<text>{{ckprCarOldForObj.prCarOldBrandVo?.name}}  {{ckprCarOldForObj.prCarOldSeriesVo.name}}</text>
						</view>
					</view>
				</view>

				<view class="box_1" :style="{ background: themeStore.themeColors.$linear3Color }">
					<view class="box_1_title">
						<text class="wdxc">我的新车</text>
						<image :src="imgUrl+'blue-icon.png'" class="icon1"></image>
					</view>
					<view class="box_1_info">
						<image :src="ckprCarOldForObj.prCarNewBrandVo?.logo" mode=""></image>
						<view class="box_1_info_r">
							<text>{{ckprCarOldForObj.prCarNewTypeVo?.name}}</text>
							<text>{{ckprCarOldForObj.prCarNewBrandVo?.name}}  {{ckprCarOldForObj.prCarNewSeriesVo.name}}</text>
						</view>
					</view>
				</view>

				<view class="box_2" v-if="ckprCarOldForObj.serviceStaff">
					<view class="box_2_title">
						<text>商家受理信息</text>
					</view>
					<view class="box_2_item">
						<text>受理人员</text>
						<text>{{ckprCarOldForObj.serviceStaff}}</text>
					</view>
					<view class="box_2_item">
						<text>受理时间</text>
						<text>{{ckprCarOldForObj.serviceTime}}</text>
					</view>
				</view>

				<view class="box_2">
					<view class="box_2_title">
						<text>预约信息</text>
					</view>
					<view class="box_2_item">
						<text>预约单号</text>
						<text>{{ckprCarOldForObj.id}}</text>
					</view>
					<view class="box_2_item">
						<text>下单时间</text>
						<text>{{ckprCarOldForObj?.createTime}}</text>
					</view>
					<view class="box_2_item">
						<text>状态</text>
						<text class="status-text" v-if="statuszt(ckprCarOldForObj.status)=='待服务'">{{statuszt(ckprCarOldForObj.status)}}</text>
						<text v-else>{{statuszt(ckprCarOldForObj.status)}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { imgUrl } from '@/config';
import { ckprCarOldForNew } from '@/api/car'
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = computed(() => themeStore.imgUrl);
const ckprCarOldForObj=ref({})
const ckprCarOldForNewFun = async (id) => {
		try {
			const res = await ckprCarOldForNew(id)
			if (res.code == 200) {
				ckprCarOldForObj.value=res.data
			}
		} catch (error) {

		} finally {

		}
	}
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
onLoad((options)=>{
	if(options.id){
	  ckprCarOldForNewFun(options.id)
	}
	
})
</script>

<style lang="scss" scoped>
view {
	box-sizing: border-box;
}
.page {
	width: 750rpx;
	height: 100vh;
	display: flex;
	flex-direction: column;

	.bgcolor {
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 448rpx;
		z-index: 0;
	}
	.scrollview {
		width: 750rpx;
		flex: 1 0;
		height: 0;
		position: relative;
		z-index: 1;
		.scrollbox {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}

	.box_1 {
		width: 690rpx;
		height: 260rpx;
		box-shadow: 0rpx 4rpx 16rpx 0rpx var(--bgqtmd);
		position: relative;
		border-radius: 20rpx;
		padding: 0 38rpx 34rpx 38rpx;
		display: flex;
		align-items: flex-end;
		overflow: hidden;
		margin-bottom: 30rpx;
		.box_1_title {
			width: 360rpx;
			height: 110rpx;
			position: absolute;
			top: 0;
			left: 0;
			text {
				font-weight: 500;
				font-size: 32rpx;
				color: #ffffff;
				z-index: 2;
				position: absolute;
				left: 30rpx;
				top: 10rpx;
			}
			image {
				width: 300rpx;
				height: 100rpx;
				position: absolute;
				top: 0;
				left: 0;
			}
		}
		.box_1_info {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			image {
				width: 120rpx;
				height: 120rpx;
				margin-right: 36rpx;
			}
			view {
				flex: 1 0;
				width: 0;
				height: 120rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				text:nth-child(1) {
					width: 100%;
					font-weight: 500;
					font-size: 28rpx;
					color: #333333;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				text:nth-child(2) {
					width: 100%;
					font-weight: 400;
					font-size: 24rpx;
					color: #666666;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}

	.box_2 {
		width: 690rpx;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		box-shadow: 0rpx 4rpx 16rpx 0rpx var(--bgqtmd);
		margin-bottom: 30rpx;
		padding: 0 30rpx;
		.box_2_title {
			width: 100%;
			height: 96rpx;
			border-bottom: 2rpx solid #ebebeb;
			margin-bottom: 30rpx;
			text {
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;
				line-height: 96rpx;
			}
		}
		.box_2_item {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;
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
}
	.status-text {
		color: var(--secondary-color) !important;
	}
</style>
