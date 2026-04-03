<template>
	<view class="container" :data-theme="pageTheme" style="height: 800rpx;  box-sizing: border-box;">
		<!-- 标题区域 -->
		<view class="header">
			<view class="title">
				<view>沿途共计<text class="count">{{fwqlist.length}}</text>个地区的天气</view>
				<u-icon name="close" color="#000" size="20" @click="onClose"></u-icon>
			</view>
		</view>
		<scroll-view scroll-y="true" v-if='fwqlist.length>0'
			style="height: calc(100% - 200rpx);background-color:   #EFF1F6;" :show-scrollbar="false">
			<view v-for="(item,index) in fwqlist " :key="index" class="station-item">
				<view style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 24rpx;">
					<view style="font-weight: bold;font-size: 28rpx;color: #000000; display:flex;align-items: center;">
						{{item.district}}
						<view class="alert-tags" v-if="item.alerts!=null" >
							<!-- 多个预警标签 -->
							<view  class="alert-tag"
								:class="getLevelClass(item.alerts[0]?.color?.code)">
								<text class="type">{{ item.alerts[0]?.eventType?.name }}预警</text>

							</view>
						</view>
					</view>
					<view @click="topath(item)"
						style="display: flex;align-items: center;justify-content: space-between;font-weight: 500;font-size: 24rpx;color: #999999;">
						更多<u-icon name="arrow-right" color="#000" size="18"></u-icon>
					</view>
				</view>
				<view style="display: flex;align-items: center;">
					<view style="font-weight: bold;font-size: 60rpx;color: #000000;margin-right: 44rpx;">
						{{item.temp}}<text style="font-size: 24rpx;">℃</text>
					</view>
					<view style="display: flex;flex-direction: column;">
						<view style="display: flex;flex-direction: column;">
							<view
								style="display: flex;align-items: center;font-weight: bold;font-size: 36rpx;color: #000000;">
								{{item.text}}<text class="dayText">(今天)</text>
							</view>

						</view>
						<view style="display: flex;align-items: center;">
							<view style="margin-right: 40rpx;">
								<image :src="imgUrl+'img/kongqi.png'" mode="aspectFill" class="icon"></image> <text
									style="font-weight: 500;font-size: 24rpx;color: #000000;">空气{{item.category}}</text>
							</view>
							<view style="margin-right: 66rpx;">
								<image :src="imgUrl+'img/fenicon.png'" mode="aspectFill" class="icon"></image>
								<text
									style="font-weight: 500;font-size: 24rpx;color: #000000;">风力{{item.windScale}}级</text>
							</view>
							<image :src="`https://tranalioss.shanyitong.com/wximage/trip-pro/weather/${item.icon}.png`"
								mode="aspectFill" style="width: 66rpx;height: 66rpx;">
							</image>
						</view>
					</view>

				</view>
				<view>
					<swiper v-if="item.alerts!= null" class="swiper-container" :indicator-dots="true"
						:autoplay="true" :interval="4000" :duration="500" circular @change="onSwiperChange(item)">
						<swiper-item v-for="(item2, index2) in item.alerts" :key="index2">
							<view class="swiper-card"  :class="getLevelClass(item2.color?.code)"
								@click="handleClick(item)">
								<view class="icon1">⚠️</view>
								<view class="title1">{{ item2.headline }}</view>
							</view>
						</swiper-item>
					</swiper>
				</view>

			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted } from 'vue'
	import { imgUrl } from '../../../config';
	import { onLoad, onShow, onPageScroll } from '@dcloudio/uni-app';
	import {
		getqueryAllWeather
	} from '@/api/map';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const props = defineProps({
		from: {
			type: String,
			default: '',
		},
		to: {
			type: String,
			default: '',
		}
	});
	const coordinate = ref('')
	// 标签列表
	const invoiceList = ref([
		{ id: 1, rkname: '全部' },
		{ id: 2, rkname: '正常' },
		{ id: 3, rkname: '关闭' }
	])
	const onSwiperChange = (item) => {
		// uni.navigateTo({
		// 	url: `/pages_A/weather/warning?location=${item.locationId}`
		// })
		console.log(item);
	}
	// 收费站列表
	const fwqlist = ref([

	])
	// 根据 level 返回背景 class
	const getLevelClass = (level : string | undefined) => {
		const map : Record<string, string> = {
			blue: 'bg-blue',
			yellow: 'bg-yellow',
			orange: 'bg-orange',
			red: 'bg-red'
		}
		return map[level || ''] || 'bg-default'
	}
const handleClick = (item : any) => {
		uni.navigateTo({
			url: `/pages_A/weather/warning?location=${item.locationId}`
		})
	}
	// 时间格式化
	const formatTime = (timeStr : string) => {
		if (!timeStr) return ''
		const date = new Date(timeStr)
		return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
	}
	// 当前选中标签
	const activeTag = ref(1)

	// 关闭事件
	const emit = defineEmits<{
		(e : 'call-parent', data : string) : void
	}>()

	// 关闭事件
	const onClose = () => {
		emit('closetab')
	}
	// 页面显示
	onMounted(() => {
		getlist()
	})
	const getlist = async () => {
		console.log(props.from, 'props.from')
		const params = {
			from: props.from,
			to: props.to
		};
		const wealiat = await getqueryAllWeather(params)

		fwqlist.value = wealiat?.data
		const arr = wealiat?.data.map((shop, index) => ({

			id: index + 1, // 确保id唯一且不为0（0用于用户位置）
			latitude: shop.coordinate.lat,
			longitude: shop.coordinate.lng,
			locationId: shop.locationId,
			title: shop.district,
			city: shop.city,
			iconPath: `https://tranalioss.shanyitong.com/wximage/trip-pro/weather/${shop.icon}.png`, // 可替换为自己的图标
			width: 24,
			height: 24,
			type: 'tq',
			callout: {
				content: shop.district,
				color: '#333',
				fontSize: 12,
				borderRadius: 4,
				bgColor: '#fff',
				padding: 5,
				display: 'BYCLICK'
			}
		}));
		emit('maptq', arr) // 触发事件并传值
		console.log('天气列表', arr, wealiat);
	};
	const topath = (item) => {
		coordinate.value = `${item.coordinate.lng},${item.coordinate.lat}`
		uni.navigateTo({
			url: `/pages_A/weather/index?coordinate=${item.locationId}&district=${item.district}&city=${item.city}`
		})
	};
</script>

<style scoped lang="scss">
	.container {
		height: 800rpx;
		position: relative;
		background: #EFF1F6;
		border-radius: 36rpx 36rpx 0rpx 0rpx;
		border: 3px solid #FFFFFF;
	}

	.alert-tags {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.alert-tag {
		margin-left: 24rpx;
		border-radius: 24rpx;
		font-size: 24rpx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 160rpx;
		text-align: center;
	}

	.alert-tag .type {
		font-weight: bold;
		margin-bottom: 4rpx;
	}

	.alert-tag .level {
		font-size: 22rpx;
		opacity: 0.9;
	}

	.alert-tag .source {
		font-size: 22rpx;
		margin-top: 4rpx;
	}

	.alert-tag .time {
		font-size: 20rpx;
		opacity: 0.8;
	}

	/* 背景色定义 */
	.bg-blue {
		background-color: #007AFF;
		/* 蓝色 */
	}

	.bg-yellow {
		background-color: #FFC107;
		/* 黄色 */
	}

	.bg-orange {
		background-color: #FF9800;
		/* 橙色 */
	}

	.bg-red {
		background-color: #F44336;
		/* 红色 */
	}

	.bg-default {
		background-color: #9E9E9E;
	}

	.dayText {
		color: var(--primary-color);
		font-size: 26rpx;
		font-weight: bold;
	}

	/* 轮播容器 */
	.swiper-container {
		height: 130rpx;
		margin-top: 20rpx;
	}

	.swiper-card {
		border-radius: 16rpx;
		color: #fff;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		height: 88rpx;
	}

	.swiper-card .icon1 {
		font-size: 36rpx;
		margin-right: 12rpx;
		margin-left: 20rpx;
	}

	.swiper-card .title1 {
		font-weight: bold;
		color: #fff;
	}

	.swiper-card .desc {
		font-size: 24rpx;
		margin-bottom: 12rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.swiper-card .info {
		font-size: 22rpx;
		opacity: 0.9;
	}

	.empty-tip {
		text-align: center;
		color: #999;
		font-size: 28rpx;
		padding: 40rpx 0;
	}

	.header {
		padding: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;
		margin-bottom: 20rpx;
	}

	.count {
		color: var(--primary-color);
		font-weight: bold;
		margin: 0 8rpx;
	}

	.tag-list {
		display: flex;
		gap: 20rpx;
		flex-wrap: wrap;
	}

	.tag {
		text-align: center;
		line-height: 56rpx;
		width: 126rpx;
		height: 56rpx;
		background: #F7F8FA;
		border-radius: 16rpx;
		font-weight: bold;
		font-size: 24rpx;
		color: #000000;

		&.active {
			width: 126rpx;
			height: 56rpx;
			background: #FFFAF2;
			border-radius: 16rpx;
			border: 1px solid var(--primary-color);
			font-weight: bold;
			font-size: 24rpx;
			color: var(--primary-color);
		}
	}

	.station-item {
		position: relative;
		min-height: 200rpx;
		margin: 20rpx 30rpx;
		background: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		justify-content: space-between;

	}

	.bg-img {

		width: 160rpx;
		height: 120rpx;
		border-radius: 26rpx;
		margin-left: 30rpx;
	}

	.content {
		padding: 30rpx;
		color: #333;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;

	}

	.name {
		font-size: 34rpx;
		font-weight: bold;
		color: #000;
	}

	.distance {
		font-size: 28rpx;
		color: var(--primary-color);
		margin: 16rpx 0;
	}

	.address {
		font-size: 24rpx;
		color: #666;
	}

	.icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 18rpx;
	}
</style>