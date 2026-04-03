<template>
	<view class="pageView" :data-theme="pageTheme">
		<up-navbar title="会员权益" @leftClick="toBack" bgColor="transparent" placeholder :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<up-gap height="5"></up-gap>

		<view class="cards" v-for="(i,v) in duolist" :key="v">
			<view class="cards-title">
				<text class="fontTitle">{{i.title}}</text>
			</view>
			<view class="gridBox">
				<view class="gridBox-item" v-for="(item,index) in i.memRightList" :key="index">
					<image class="gridBox-item-img" :src="item.pic" mode=""></image>
					<view class="gridBox-item-title">{{item.name}}</view>
					<view class="gridBox-item-text">{{item.description}}</view>
				</view>
			</view>
		</view>
		<!-- <up-gap height="10"></up-gap> -->

		<view class="gridBox1">
			<view v-for="(i,v) in dlist" :key="v" class="cards">
				<view class="cards-title">
					<text class="fontTitle">{{i.title}}</text>
				</view>
				<view class="gridBox2">
					<view class="gridBox-item" v-for="(item,index) in i.memRightList" :key="index">
						<image class="gridBox-item-img" :src="item.pic" mode=""></image>
						<view class="gridBox-item-title">{{item.name}}</view>
						<view class="gridBox-item-text">{{item.description}}</view>
					</view>
				</view>
			</view>

		</view>

	</view>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { imgUrl } from '@/config';
	import {
		getmemRightsGroupTypePage
	} from '@/api/member';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);

	const tabsIndex = ref(0)
	const tabs = ref([
		{ name: '普通' },
		{ name: '铂金' },
		{ name: '钻石' },
		{ name: '黑钻' }
	]);
	onMounted(() => {
		getlist()
	})
	const tabsClick = (item, index) => {
		tabsIndex.value = index
	};
	const dlist = ref([])
	const duolist = ref([])
	const getlist = async () => {
		let res = await getmemRightsGroupTypePage()
		if (res.code == 200) {
			res.data.forEach(item => {
				const list = item.memRightList || []; // 防止 memRightList 为 undefined

				if (list.length === 1) {
					dlist.value.push(item);
				} else if (list.length > 1) {
					duolist.value.push(item);
				}
			});
			console.log(dlist.value, 'dlist.value', duolist.value, 'duolist.value')
		}
	}

	const list1 = ref([

		{ title: '加气优惠', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
		{ title: '轮胎补气券', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
		{ title: '审车优惠', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
	], [
		{ title: '加气优惠', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
		{ title: '轮胎补气券', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
		{ title: '审车优惠', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
	], [
		{ title: '加气优惠', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
		{ title: '轮胎补气券', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
		{ title: '审车优惠', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
	])

	const list2 = ref([
		{ title: '加气优惠', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },

	]);

	const list3 = ref([
		{ title: '加气优惠', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
		{ title: '轮胎补气券', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
		{ title: '审车优惠', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
		{ title: '洗车券', icon: imgUrl + 'road-show-shijian.png', tetx: '描述描述描述描述描述描述' },
	])
</script>

<style lang="scss" scoped>
	.pageView {
		width: 100%;
		min-height: 100vh;
		padding: 25rpx;
		box-sizing: border-box;
		background: var(--label-color);
	}

	.cards {
		padding: 20rpx 0;
		box-sizing: border-box;

		.cards-title {}

		.fontTitle {
			font-size: 30rpx;
			color: var(--primary-color);
			line-height: 36rpx;
			font-weight: bold;
		}

		.fontTetx {
			font-size: 24rpx;
			color: #666666;
			margin-left: 6rpx;
		}


		.gridBox {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 20rpx 12rpx;
			padding: 20rpx 0;
			margin-top: 20rpx;

			.gridBox-item {
				display: flex;
				flex-direction: column;
				// justify-content: center;
				align-items: center;
				background: linear-gradient(2deg, #F0FFF6 0%, #FDFFFE 100%);
				box-shadow: 0rpx 2rpx 4rpx 0rpx #D3E7D1;
				border-radius: 10rpx;
				padding: 20rpx;
				box-sizing: border-box;
				border-radius: 20rpx;

				.gridBox-item-img {
					width: 80rpx;
					height: 80rpx;
				}

				.gridBox-item-title {
					font-weight: 500;
					font-size: 28rpx;
					color: #2E3133;
					text-align: center;
					margin: 20rpx 0;
				}

				.gridBox-item-text {
					font-weight: 400;
					font-size: 20rpx;
					color: #909599;
					text-align: center;
				}
			}

		}

		.gridBox2 {
			display: grid;
			grid-template-columns: repeat(1, 1fr);
			grid-gap: 20rpx 12rpx;
			padding: 20rpx 0;
			margin-top: 20rpx;

			.gridBox-item {
				display: flex;
				flex-direction: column;
				// justify-content: center;
				align-items: center;
				background: linear-gradient(2deg, #F0FFF6 0%, #FDFFFE 100%);
				box-shadow: 0rpx 2rpx 4rpx 0rpx #D3E7D1;
				border-radius: 10rpx;
				padding: 20rpx;
				box-sizing: border-box;
				border-radius: 20rpx;

				.gridBox-item-img {
					width: 80rpx;
					height: 80rpx;
				}

				.gridBox-item-title {
					font-weight: 500;
					font-size: 28rpx;
					color: #2E3133;
					text-align: center;
					margin: 20rpx 0;
				}

				.gridBox-item-text {
					font-weight: 400;
					font-size: 20rpx;
					color: #909599;
					text-align: center;
				}
			}

		}
	}

	.gridBox1 {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 20rpx 12rpx;
		padding: 20rpx 0;
		margin-top: 20rpx;

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