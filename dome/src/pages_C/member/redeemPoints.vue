<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-navbar title="里程换积分" @leftClick="toBack" placeholder :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<up-gap height="5"></up-gap>
		<view class="tabsBox">
			<view
				:class="['tabsBox-item',tabsIndex == index?'tabActive':'',index == 0?'itemBorderRaLeft':'',index == (tabs.length - 1)?'itemBorderRaRight':'']"
				v-for="(item,index) in tabs" :key="index" :style="{borderLeft:index>0?'1rpx solid #4E4E4E':'none'}"
				@click="tabsClick(item,index)">{{item.name}}</view>
		</view>
		<up-gap height="20"></up-gap>
		<template v-if="tabsIndex == 1">  
			<view class="textFoont3">
				<view>
					<text class="textFont1">{{messageinfo.activityOne.jointFirst}}</text>
					<text class="textFont2">{{messageinfo.activityOne.jointEnd}}</text>
				</view>
				<view>
					<text class="textFont1">{{messageinfo.activityThree.jointFirst}}</text>
					<text class="textFont2">{{messageinfo.activityThree.jointEnd}}</text>
				</view>
				<view>
					<text class="textFont1">{{messageinfo.activityTwo.jointFirst}}</text>
					<text class="textFont2">{{messageinfo.activityTwo.jointEnd}}</text>
				</view>
				<view>
					<text class="textFont1">{{messageinfo.commonOne.jointFirst}}</text>
					<text class="textFont2">{{messageinfo.commonOne.jointEnd}}</text>
				</view>
				<view>
					<text class="textFont1">{{messageinfo.commonThree.jointFirst}}</text>
					<text class="textFont2">{{messageinfo.commonThree.jointEnd}}</text>
				</view>
				<view>
					<text class="textFont1">{{messageinfo.commonTwo.jointFirst}}</text>
					<text class="textFont2">{{messageinfo.commonTwo.jointEnd}}</text>
				</view>
			</view>
		</template>
		<template v-if="tabsIndex == 0">
			<view class="cardText">
				每天凌晨2：00，系统会自动从高速出行数据中，同步每一位车主的里程数据，自动换算成积分，累加在每位车主。
				这里显示的是每一次的同步换算记录
			</view>
			<up-gap height="20"></up-gap>

			<view class="listView">
				<view class="listView-item" v-for="(item,index) in pointList" :key="index" >
					<view class="listView-item-top"  >
						<view class="times">{{item.operateTime}}</view>
						<view class="textFont2">余额：{{item.pointsBalance}}</view>
					</view>
					<view class="listView-card fl-ce-sb">
						<view class="listView-card-left textFont">{{item.mileage}}km</view>
						<view class="listView-card-center">
							<view class="textFont2">兑换比例 {{item.exchangeRate}}</view>
							<view class="exchange-ratio">
								<view class="line"></view>
								<view class="dot"></view>
								<view class="arrow"></view>
							</view>
							<view class="textFont2">{{item.licensePlate}}</view>
						</view>
						<view class="listView-card-right fl-ce-ce">
							<text class="textFont">{{item.pointsNum}}</text>
							<text class="textFont2">普通积分</text>
						</view>
					</view>
				</view>
				<view class="empty-data" v-if="!pointList || pointList.length === 0">
					<ser-empty></ser-empty>
				</view>
			</view>
		</template>

	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import {
		getmembermileageExchangePointMessage,
		getmembermileageExchangePointDetailList
	} from '@/api/member';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	onMounted(() => {
		havePointMessage()
		havePointList()
	})
	const tabsIndex = ref(0)
	const tabs = ref([
		{ name: '兑换记录' },
		{ name: '车辆兑换规则' }
	]);
	const tabsClick = (item, index) => {
		tabsIndex.value = index
	};
	const messageinfo = ref({})
	const havePointMessage = async () => {
		const res = await getmembermileageExchangePointMessage();
		console.log(res)
		messageinfo.value = res.data
	}
	const pointList = ref([])
	const havePointList = async () => {
		const res = await getmembermileageExchangePointDetailList();
		console.log(res)
		pointList.value = res.data.list
	}
</script>

<style lang="scss" scoped>
	.pageView {
		padding: 30rpx 40rpx;
		box-sizing: border-box;
	}

	.listView {
		.listView-item {
			// padding: 0 20rpx;
			box-sizing: border-box;
			margin-bottom: 30rpx;

			.listView-item-top {
				height: 90rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 26rpx;
			}
		}

		.listView-card {
			min-height: 140rpx;
			background: #F8F8F8;
			border-radius: 20rpx;
			padding: 40rpx 20rpx;
			box-sizing: border-box;

			.listView-card-left {}

			.listView-card-center {
				text-align: center;
			}

			.listView-card-right {
				color: #999999;
				flex-direction: column;
			}
		}
	}

	.textFoont3 {
		font-size: 28rpx;
		color: #F6B027;
	}

	.exchange-ratio {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 300rpx;
		position: relative;
		font-family: "Microsoft YaHei", sans-serif;
		color: #666;
		background-color: #f5f5f5;
		border-radius: 4rpx;
		padding: 10rpx;

		.line {
			position: absolute;
			top: 50%;
			left: 20px;
			right: 20px;
			height: 2px;
			background-color: #ccc;
			transform: translateY(-50%);
		}

		.dot {
			position: absolute;
			left: 20rpx;
			top: 50%;
			width: 24rpx;
			height: 24rpx;
			background-color: #999;
			border-radius: 50%;
			transform: translateY(-50%);
		}

		.arrow {
			position: absolute;
			right: 20rpx;
			top: 50%;
			width: 0;
			height: 0;
			border-top: 20rpx solid transparent;
			border-right: 20rpx solid transparent;
			border-left: 20rpx solid #ccc;
			border-bottom: 20rpx solid transparent;
			transform: translateY(-50%);
		}
	}




	.textFont {
		font-size: 28rpx;
		font-weight: bold;
	}

	.textFont1 {
		font-size: 26rpx;
		color: #999999;
	}

	.textFont2 {
		font-size: 24rpx;
		color: #999999;
	}

	.pageView {
		width: 100%;
		min-height: 100vh;
		padding: 25rpx;
		box-sizing: border-box;
		background: #FFFFFF;
	}

	.cardText {
		background: #F8F8F8;
		color: #666666;
		border-radius: 20rpx;
		font-size: 24rpx;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.tabsBox {
		margin: 0 auto;
		width: 560rpx;
		height: 60rpx;
		border-radius: 10rpx;
		border: 1rpx solid #4E4E4E;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.tabsBox-item {
			flex: 1;
			line-height: 60rpx;
			text-align: center;
			font-size: 26rpx;
		}

		.itemBorderRaLeft {
			border-radius: 10rpx 0 0 10rpx;
		}

		.itemBorderRaRight {
			border-radius: 0 10rpx 10rpx 0;
		}

		.tabActive {
			background: #4E4E4E;
			color: #FFFFFF;
		}
	}
</style>