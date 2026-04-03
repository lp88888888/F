<!-- pages/flash-sale/FlashSalePage.vue -->
<template>
	<up-sticky z-index="8888">
		<up-navbar title="" bgColor="transparent" @leftClick="toBack" leftIconColor="#000000" placeholder :fixed="false"
			:titleStyle="{ fontWeight: 'bold' }"></up-navbar>
	</up-sticky>
	<view class="flash-sale-page">
		<!-- 头部背景 -->
		<image :src="imgUrl + 'qing-hea-bj.png'" mode="aspectFill" class="bg-image"></image>


		<view class="box-list">
			<!-- 时间区域 -->
			<view class="time-area">
				<!-- 当前倒计时 -->
				<view class="current-time" @click="chengtab(1,peizhilist[0]?.id)" :style="leftnjum">
					<text class="time-label">{{peizhilist[0]?.startTimeStr}}</text>
					<view class="countdown">仅剩 <up-count-down :time="timeshengyu" format="HH:mm:ss" autoStart
							 @change="onChange">
							<view class="time">
								<view class="time__custom">
									<text
										class="time__custom__item">{{ timeData.hours>10?timeData.hours:'0'+timeData.hours}}</text>
								</view>
								<text class="time__doc">:</text>
								<view class="time__custom">
									<text class="time__custom__item">{{ timeData.minutes }}</text>
								</view>
								<text class="time__doc">:</text>
								<view class="time__custom">
									<text class="time__custom__item">{{ timeData.seconds }}</text>
								</view>
							</view>
						</up-count-down></view>
				</view>

				<!-- 即将开抢 -->
				<view class="next-time" @click="chengtab(2,peizhilist[1]?.id)" :style="rightnjum">
					<text class="time-label">{{peizhilist[1]?.startTimeStr}}</text>
					<view class="countdown">即将开抢</view>
				</view>
			</view>

			<!-- 商品列表 -->
			<scroll-view class="goods-list">
				<view v-for="(item, index) in goodsList" :key="index"
					@click="toNav('/pages_A/points/details?id=' + item.pointActivityId)" class="goods-item">
					<!-- 图标 -->
					<image :src="item.picUrl" mode="aspectFit" class="goods-icon"></image>
					<view class="goods-item-1">
						<view class="goods-name">{{ item.spuName }}</view>
						<view class="sold-count">已兑{{ item.soldStock }}+</view>
						<view class="price-area" :style="{
	  backgroundImage:  `url(${imgUrl}qiang-icon.png)`,
	  backgroundSize: 'cover',
	  backgroundPosition: 'center',
	  backgroundRepeat: 'no-repeat'
	}">
							<text class="price">{{ item.point }}积分</text>
							<image :src="imgUrl + 'qing-jb.png'" mode="aspectFill" class="jinbi-icon"></image>
							<text class="original-price"> {{ item.pointPrice }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, computed, onMounted } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { imageUrl } from '@/config'
	import { toNav, toBack, toRec } from '@/utils/route'
	import {
		getgetSeckillActivity,
		getSeckillProductGoodslist
	} from '@/api/points';
	// 图片路径
	const imageUrl = ref('/static/images/')
	import { imgUrl } from '../../config';
	// 倒计时
	const currentTime = ref(10 * 60 * 60) // 10:00 对应的秒数
	const countdown = computed(() => {
		const totalSeconds = Math.floor(currentTime.value / 1000)
		const hours = Math.floor(totalSeconds / 3600)
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const seconds = totalSeconds % 60
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	})
	const timeData = ref({});
	const peizhilist = ref([]);
	const activityConfigId = ref(null);
	// 定义 onChange 方法  
	const onChange = (e) => {
		timeData.value = e;
	};
	const leftnjum = ref({})
	const rightnjum = ref({
		backgroundImage: `url(${imgUrl}right-bj.png)`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat'

	})
	onLoad(() => {
		getSeckillActivitylist()
	})
	const chengtab = (index,id) => {
		if(!id){
			uni.showToast({
				title: '暂无活动',
				icon: 'none'
			})
			return
		}

		if (index == 1) {
			leftnjum.value = {

			}
			rightnjum.value = {
				backgroundImage: `url(${imgUrl}right-bj.png)`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat'
			}
		} else {
			leftnjum.value = {
				backgroundImage: `url(${imgUrl}left-bj.png)`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat'
			}
			rightnjum.value = {

			}

		}
		activityConfigId.value = id
		getshoplist()
	}
	const timeshengyu = ref(null)
	const getSeckillActivitylist = async () => {
		const res = await getgetSeckillActivity();
		peizhilist.value = res.data;
		if (peizhilist.value != []) {
			activityConfigId.value = peizhilist.value[0].id
			const endTimeStr = res.data[0].endTime; // 从接口 res.data.endTime 获取

			const [datePart, timePart] = endTimeStr.split(' ');
			const [y, m, d] = datePart.split('-').map(Number);
			const [h, min, s] = timePart.split(':').map(Number);
			timeshengyu.value = Math.max(0, new Date(y, m - 1, d, h, min, s).getTime() - Date.now());
			console.log('剩余毫秒数:', timeshengyu.value); // 如：86400000
			getshoplist()
		}
	}
	const getshoplist = async () => {
		let params = {
			pageNum: '1',
			pageSize: 99999,
			activityConfigId: activityConfigId.value

		}
		const res = await getSeckillProductGoodslist(params);
		goodsList.value = res.data.list;
	}
	// 模拟数据
	const goodsList = ref([
		{
			id: 1,
			name: '车小芒车载香薰车小芒车载香薰',
			icon: '/static/images/goods-icon.png',
			price: 820,
			originalPrice: 100,
			soldCount: '已兑500+'
		},
		{
			id: 2,
			name: '车小芒车载香薰车小芒车载香薰',
			icon: '/static/images/goods-icon.png',
			price: 820,
			originalPrice: 100,
			soldCount: '已兑500+'
		},
		{
			id: 3,
			name: '车小芒车载香薰车小芒车载香薰',
			icon: '/static/images/goods-icon.png',
			price: 820,
			originalPrice: 100,
			soldCount: '已兑500+'
		},
		{
			id: 4,
			name: '车小芒车载香薰车小芒车载香薰',
			icon: '/static/images/goods-icon.png',
			price: 820,
			originalPrice: 100,
			soldCount: '已兑500+'
		}
	])

	// 页面逻辑
	onMounted(() => {
		// 启动倒计时
		const interval = setInterval(() => {
			currentTime.value -= 1000
			if (currentTime.value <= 0) {
				clearInterval(interval)
			}
		}, 1000)
	})

	// 跳转商品详情
	const goToDetail = (id : number) => {
		uni.navigateTo({
			url: `/pages/goods-detail/goods-detail?id=${id}`
		})
	}
</script>

<style scoped lang="scss">
	.box-list {
		// width: 100%;
		// position: absolute;
		// top: 323rpx;
		// background: #F3F3F3;
		// border-radius: 16rpx;
		width: 100%;
		    position: absolute;
		    top: 323rpx;
		    background: #F3F3F3;
		    border-radius: 16rpx;
		    z-index: 99; /* 确保大于背景图的 9 */
	}

	.jinbi-icon {
		width: 24rpx;
		height: 24rpx;
		margin: 0 14rpx;
	}

	.qiang-icon {
		width: 80rpx;
		height: 80rpx;
		margin-left: 20rpx;
	}

	.time {
		@include flex;
		align-items: center;
		margin-right: 24rpx;

		&__custom {
			margin-top: 4px;
			width: 22px;
			height: 22px;
			background-color: #000;
			border-radius: 4px;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			justify-content: center;
			align-items: center;

			&__item {
				color: #fff;
				font-size: 12px;
				text-align: center;
			}
		}

		&__doc {
			color: #000;
			padding: 0px 4px;
		}

		&__item {
			color: #606266;
			font-size: 15px;
			margin-right: 4px;
		}
	}

	.flash-sale-page {
		position: relative;
		background-color: #fff;
		min-height: 100vh;
	}

	.bg-image {
		width: 100%;
		height: 490rpx;
		z-index: 9;
	}

	.title-area {
		padding: 60rpx 32rpx 30rpx;
		text-align: center;
	}

	.main-title {
		font-size: 64rpx;
		color: white;
		font-weight: bold;
		letter-spacing: 2rpx;
	}

	.sub-title {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
		margin-top: 10rpx;
	}

	.time-area {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 16rpx;
		height: 132rpx;
		position: relative;
		z-index: 100;
	}

	.current-time,
	.next-time {
		height: 132rpx;
		display: flex;
		flex-direction: column;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	.time-label {
		font-size: 36rpx;
		color: #D32829;
		font-weight: bold;
	}

	.countdown {
		font-size: 28rpx;
		color: #000;
		display: flex;
		align-items: center;
		font-weight: bold;
		margin-top: 8rpx;
		gap: 10rpx;
	}

	.goods-list {
		padding: 0 12rpx;
		box-sizing: border-box;
	}

	.goods-item {
		display: flex;
		align-items: center;
		background: linear-gradient(135deg, #FEFEFE 0%, #EBF8EE 100%);
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 14rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.goods-item-1 {
		flex: 1;
		height: 100%;
		padding-left: 38rpx;
	}

	.goods-icon {
		width: 208rpx;
		height: 208rpx;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		padding: 24rpx;
	}

	.goods-info {
		flex: 1;
	}

	.goods-name {
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.sold-count {
		text-align: right;
		font-weight: 400;
		font-size: 24rpx;
		color: #6E6E6E;
		margin: 18rpx 12px 18rpx 0;
	}

	.price-area {
		display: flex;
		align-items: center;
		margin-right: 20rpx;
		height: 79rpx;
		padding-left: 30rpx;
	}

	.price {
		font-size: 28rpx;
		color: #FF9B36;
		font-weight: bold;
	}

	.original-price {
		font-size: 20rpx;
		color: #999;
		text-decoration: line-through;
	}

	.grab-btn {
		width: 120rpx;
		height: 40rpx;
		background-color: #e74c3c;
		color: white;
		border-radius: 20rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		padding: 0;
		margin: 0;
		border: none;
	}

	.grab-text {
		font-size: 28rpx;
		color: white;
	}
</style>