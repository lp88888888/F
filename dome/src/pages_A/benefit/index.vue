<template>
	<view class="container">
		<view class="member-container" >
			<cos-header title='会员权益' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
				:defaultNavBarheight="100"></cos-header>
			<!-- 静态会员等级标签 -->
			<view class="level-tabs">
				<view v-for="(level, index) in levels" :key="index" :class="{ 'active': activeLevel === index}" class="level-tab" @click="changeLevel(index)">
					<view v-if="level.id==1">
						<image :src="imgUrl+'pt.png'" class="img-icon"></image>
					</view>
					<view v-if="level.id==2">
						<image :src="imgUrl+'pt1.png'" class="img-icon"></image>
					</view>
					<view v-if="level.id==3">
						<image :src="imgUrl+'pt2.png'" class="img-icon"></image>
					</view>
					<view v-if="level.id==4">
						<image :src="imgUrl+'pt4.png'" class="img-icon"></image>
					</view>
					<view> {{ level.levelName }}</view>
				</view>
			</view>
			<!-- 特权内容区域 -->
			<view class="privilege-content">
				<!-- 积分特权 -->
				<view class="privilege-section">
					<view class="section-header flex ali-cen">
						<text class="title">会员特权</text>
						<!-- <view class="line m-lr-20 m-t-5"></view>
						<text class="count">共4项特权</text> -->
					</view>
					<view class="privilege-items">
						<view class="privilege-item" v-for="(items,index) in levelsList" :key="index">
							<image class="privilege-icon" :src="items.pic" mode="aspectFit" />
							<text class="item-name">{{ items.name }}</text>
						</view>
					</view>
				</view>

				<!-- 出行优惠 -->
				<!-- <view class="privilege-section">
					<view class="section-header flex ali-cen">
						<text class="title">出行优惠</text>
						<view class="line m-lr-20 m-t-5"></view>
						<text class="count">共8项特权</text>
					</view>
					<view class="privilege-items">
						<view class="privilege-item" v-for="(item, index) in travelItems" :key="index">
							<image class="privilege-icon" :src="item.icon" mode="aspectFit" />
							<text class="item-name">{{ item.name }}</text>
						</view>
					</view>
				</view> -->

				<!-- 服务特权 -->
			<!-- 	<view class="privilege-section">
					<view class="section-header flex ali-cen">
						<text class="title">服务特权</text>
						<view class="line m-lr-20 m-t-5"></view>
						<text class="count">共4项特权</text>
					</view>
					<view class="privilege-items">
						<view class="privilege-item" v-for="(item, index) in serviceItems" :key="index">
							<image class="privilege-icon" :src="item.icon" mode="aspectFit" />
							<text class="item-name">{{ item.name }}</text>
						</view>
					</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { onShow, onLoad } from '@dcloudio/uni-app'
	import CosHeader from '@/components/customNavBar/index.vue';
	import theme from '@/utils/theme';
	import { imgUrl } from '@/config';
	const backgroundColor = ref<string>('');
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	import { pageList } from '@/api/member';
	onMounted(() => {
		// 从cos-header组件获取实际高度或计算
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});

	// 会员等级数据
	const levels = ref([]);
	const activeLevel = ref(0);
	const levelsList = ref([]);
	// 特权数据
	const integralItems = ref([
		{ name: '加气优惠', icon: imgUrl + 'mine/hy_jqyh.png' },
		{ name: '轮胎补气券', icon: imgUrl + 'mine/hy_ltbq.png' },
		{ name: '审车优惠', icon: imgUrl + 'mine/hy_scyh.png' },
		{ name: '洗车券', icon: imgUrl + 'mine/hy_xc.png' },
	]);

	const travelItems = ref([
		{ name: '加气优惠', icon: imgUrl + 'mine/hy_jqyh.png' },
		{ name: '轮胎补气券', icon: imgUrl + 'mine/hy_ltbq.png' },
		{ name: '审车优惠', icon: imgUrl + 'mine/hy_scyh.png' },
		{ name: '洗车券', icon: imgUrl + 'mine/hy_xc.png' },
		{ name: '租车优惠', icon: imgUrl + 'mine/hy_zc.png' },
		{ name: '商城优惠', icon: imgUrl + 'mine/hy_scyh.png' },
		{ name: '基础维修优惠', icon: imgUrl + 'mine/hy_jcwx.png' }
	]);

	const serviceItems = ref([
		{ name: '加气优惠', icon: imgUrl + 'mine/hy_jqyh.png' },
		{ name: '轮胎补气券', icon: imgUrl + 'mine/hy_ltbq.png' },
		{ name: '审车优惠', icon: imgUrl + 'mine/hy_scyh.png' },
		{ name: '洗车券', icon: imgUrl + 'mine/hy_xc.png' },
	]);
	const pageListFun = async () => {
		let params = {
			levelType: '1'
		}
		const res = await pageList(params);
		levels.value = res.rows
		levelsList.value = res.rows[activeLevel.value].memRightsList
	}
	// 切换会员等级
	const changeLevel = (index : number) => {
		activeLevel.value = index;
		pageListFun()
	};

	onLoad(() => {
		pageListFun()
	});
</script>

<style scoped lang="scss">
	.container {
		height: 30vh;
		background: $bgTopColor;
	}
	.member-container{
		height: 100vh;
		overflow: hidden;
	}

	/* 会员标签样式 */
	.level-tabs {
		display: flex;
		border-radius: 12rpx;
		padding: 20rpx 0;
		margin:180rpx 0 20rpx;
		display: flex;
		justify-content: space-evenly;

		.level-tab {
			padding: 5rpx 10rpx;
			text-align: center;
			font-size: 26rpx;
			color: #63300E;
			border-radius: 25rpx;
			position: relative;

		}
	}

	.active {
		padding: 8rpx 10rpx !important;
		border-radius: 10rpx !important;
		background: #F4FDFD,;
		color: #fff;
	}

	.privilege-content {
		height: 100vh;
		overflow: hidden;
		background: #F1EFEC;
		background: $bgTopColor;
		border: 1px solid #eee;
	}

	/* 特权区块 */
	.privilege-section {
		background: $bgTopColor;
		border-radius: 20rpx;
		border: 3px solid #FFFFFF;
		margin-bottom: 20rpx;
		margin: 40rpx 32rpx 0;
		padding: 20rpx;

		.section-header {
			margin-bottom: 20rpx;

			.title {
				font-weight: 600;
				font-size: 34rpx;
				color: #63300E;
			}

			.line {
				width: 1rpx;
				height: 23rpx;
				background: #63300E;
			}

			.count {
				font-weight: 500;
				font-size: 24rpx;
				color: #63300E;
			}
		}

		.privilege-items {
			display: flex;
			flex-wrap: wrap;

			.privilege-item {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-bottom: 20rpx;

				.privilege-icon {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 10rpx;
				}

				.item-name {
					font-size: 24rpx;
					color: #333;
					text-align: center;
				}
			}
		}
	}

	.img-icon {
		width: 80rpx;
		height: 80rpx;
	}
</style>