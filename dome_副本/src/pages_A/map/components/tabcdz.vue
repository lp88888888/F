<template>
	<view class="container" :data-theme="pageTheme"  style="height: 800rpx;  box-sizing: border-box;">
		<!-- 标题区域 -->
		<view class="header">
			<view class="title">
				<view>沿途共计<text class="count">{{total}}</text>个充电桩</view>
				<u-icon name="close" color="#000" size="20" @click="onClose"></u-icon>
			</view>

			<!-- 状态标签列表 -->
			<view class="tag-list">
				<view v-for="item in invoiceList " :key="item.id" class="tag" :class="{ active: item.id === activeTag }"
					@click="chengtags(item.id)">
					{{ item.rkname }}
				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" style="height: calc(100% - 200rpx);background-color:  #EFF1F6;"
			:show-scrollbar="false">
			<view v-for="item in fwqlist " :key="item.id" class="service-card" @click="goStation(item)" >
				<view class="info-block">
					<view class="name">{{item.stationName}}</view>
					<view class="distance">
						<image class="icon" :src="imgUrl+'img/daohang.png'" @click.stop="goMap1(item)" mode="aspectFit"></image>
						距您{{item.distance}}km
					</view>
					<view class="price"><text style="font-size: 24rpx;">¥</text>{{item.minPrice}}/度<text
							style="font-size: 24rpx;color: #999999;">起</text></view>
				</view>
				<!-- 状态与充电信息 -->
				<view class="status-block">
					<view class="operating-status" v-if="item.stationStatus==50">营业中</view>
					<view class="operating-status" v-else>关闭</view>
					<view class="charge-status-fast">
						<view class="type">快</view>
						<view class="availability">{{item.fastFree || 0}}/{{ item.fastTotal }}</view>
					</view>
					<view class="charge-status-slow">
						<view class="type">慢</view>
						<view class="availability">{{item.slowFree || 0}}/{{ item.slowTotal }}</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted } from 'vue'
	import { imgUrl } from '../../../config';
	import {openLocation} from '@/utils/util'
	import {
		getStationByLngLatlist
	} from '@/api/map';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const props = defineProps({
		fromcurrentLat: {
			type: String,
			default: '',
		},
		fromcurrentLng: {
			type: String,
			default: '',
		},
		tolatitude: {
			type: String,
			default: '',
		},
		tolongitude: {
			type: String,
			default: '',
		}
	});
	// 标签列表
	const invoiceList = ref([
		{ id: '', rkname: '全部' },
		{ id: '50', rkname: '营业中' },
		{ id: '5', rkname: '关闭' }
	])
	const goMap1 = (item) => {
		console.log();
		openLocation({
			latitude: Number(item.stationLat),//维度
			longitude: Number(item.stationLng),//经度
			scale: 18,//缩放比例，范围5~18，默认为18
			name: item.stationName,
		})
	}
	// 收费站列表
	const fwqlist = ref([

	])
	const triggerParentMethod = () => {

	}
	// 当前选中标签
	const activeTag = ref('')
	const chengtags = (id) => {
		activeTag.value = id
		getlist()
	}
	const pageNum = ref(1)
	const total = ref(0)
	const emit = defineEmits<{
		(e : 'call-parent', data : string) : void
	}>()
	onMounted(() => {
		getlist()
	})
	const goStation = (item) => {
		const id = item.stationId
		uni.navigateTo({
		  url: '/pages_A/chargingPiles/queryDetail?id=' + id 
		})
	}
	const getlist = () => {
		getStationByLngLatlist({
			pageNum: pageNum.value,
			pageSize: 100,
			startLatitude: props.fromcurrentLat,
			startLongitude: props.fromcurrentLng,
			endLatitude: props.tolatitude,
			endLongitude: props.tolongitude,
			stationStatus: activeTag.value
		}).then(res => {

			fwqlist.value = res.data.list
			total.value = res.data.total
			const arr = res.data.list.map((shop, index) => ({
				id:index + 1, // 确保id唯一且不为0（0用于用户位置）
				delid:shop.stationId,
				latitude : Number(shop.stationLat),
				longitude : Number(shop.stationLng),
				title: shop.stationName,
				iconPath: imgUrl + 'static/oil-map-icon.png',// 可替换为自己的图标
				width: 20,
				height: 20,
				type: 'cdz',
				callout: {
					content: shop.stationName,
					color: '#333',
					fontSize: 12,
					borderRadius: 4,
					bgColor: '#fff',
					padding: 5,
					display: 'BYCLICK'
				}
			}));
			 emit('maptq', arr) // 触发事件并传值
		})
	}
	// 关闭事件
	const onClose = () => {
		emit('closetab')
	}
</script>

<style scoped lang="scss">
	.container {
		height: 800rpx;
		position: relative;
		background: #EFF1F6;
		border-radius: 36rpx 36rpx 0rpx 0rpx;
		border: 3px solid #FFFFFF;
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
		color:  var(--primary-color);
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
			border: 1px solid  var(--primary-color);
			font-weight: bold;
			font-size: 24rpx;
			color:  var(--primary-color);
		}
	}

	.service-card {
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 32rpx;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
		margin: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}


	.info-block {
		height: 200rpx;
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
	}

	.status-block {
		height: 200rpx;
		margin-bottom: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
	}

	.name {
		font-weight: bold;
		font-size: 30rpx;
		color: #333333;
		line-height: 60rpx;
	}

	.distance {
		font-weight: 500;
		font-size: 24rpx;
		color: #999999;
	}

	.price {
		font-weight: 500;
		font-size: 38rpx;
		color:  var(--primary-color);
	}

	.operating-status {
		width: 100rpx;
		height: 42rpx;
		background: #F0F8F4;
		border-radius: 21rpx;
		font-weight: 500;
		font-size: 22rpx;
		color: #00964E;
		text-align: center;
		line-height: 42rpx;
	}

	.icon {
		width: 16px;
		height: 16px;
		margin-right: 4px;
		vertical-align: middle;
	}

	.charge-status-slow {
		display: flex;
		width: 158rpx;
		height: 56rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		border: 1px solid #00ACA6;

		.type {
			width: 56rpx;
			height: 56rpx;
			background: #00ACA6;
			text-align: center;
			line-height: 56rpx;
			color: #fff;

		}

		.availability {
			width: 102rpx;
			height: 56rpx;
			font-weight: 500;
			font-size: 24rpx;
			color: #00ACA6;
			text-align: center;
			line-height: 56rpx;
		}
	}

	.charge-status-fast {
		display: flex;
		width: 158rpx;
		height: 56rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		border: 1px solid #00964E;

		.type {
			width: 56rpx;
			height: 56rpx;
			background: #00964E;
			text-align: center;
			line-height: 56rpx;
			color: #fff;

		}

		.availability {
			width: 102rpx;
			height: 56rpx;
			font-weight: 500;
			font-size: 24rpx;
			color: #00964E;
			text-align: center;
			line-height: 56rpx;
		}
	}
</style>