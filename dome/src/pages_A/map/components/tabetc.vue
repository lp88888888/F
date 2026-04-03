<template>
	<view class="container" :data-theme="pageTheme" style="height: 800rpx;  box-sizing: border-box;">
		<!-- 标题区域 -->
		<view class="header">
			<view class="title">
				<view>沿途共计<text class="count">{{total}}</text>个ETC网点</view>
				<u-icon name="close" color="#000" size="20" @click="onClose"></u-icon>
			</view>

			<!-- 状态标签列表 -->
			<view class="tag-list">
				<view v-for="item in invoiceList " :key="item.id" class="tag" :class="{ active: item.id === activeTag }"
					@click="chengtags(item.id) ">
					{{ item.rkname }}
				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" style="height: calc(100% - 200rpx);background-color:  #EFF1F6;"
			:show-scrollbar="false">
			<view v-for="item in fwqlist " :key="item.id" class="station-item">
				<view class="content">
					<view class="content-1">

					</view>
					<view class="content-2">
						<text class="name">{{ item.name }}</text>
						<view class="address">{{item.address}}</view>
					</view>
					<view class="content-3">
						<view class="distance">{{item.distance}}</view>
						<image :src="imgUrl+'img/daohang.png'" mode="aspectFill" @click="goMap1(item)" class="icon"></image>
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
		getEtcBranchListByLngLatlist
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
		{ id: 0, rkname: '全部' },
		{ id: 1, rkname: '绕城包年网点' },
		{ id: 2, rkname: '收费站网点' },
		{ id: 3, rkname: '服务区网点' }
	])

	// 收费站列表
	const fwqlist = ref([])
	const pageNum = ref(1)
	const chengtags = (id) => {
		activeTag.value = id
		getlist()
	}
	onMounted(() => {
		getlist()
	})
	// 当前选中标签
	const activeTag = ref(0)

	const total = ref(0)
	// 关闭事件
	const emit = defineEmits<{
		(e : 'call-parent', data : string) : void
	}>()
	const goMap1 = (item) => {
		openLocation({
			latitude: Number(item.latitude),//维度
			longitude: Number(item.longitude),//经度
			scale: 18,//缩放比例，范围5~18，默认为18
			name: item.name,
		})
	}
	const getlist = () => {
		getEtcBranchListByLngLatlist({
			pageNum: pageNum.value,
			pageSize: 100,
			startLatitude: props.fromcurrentLat,
			startLongitude: props.fromcurrentLng,
			endLatitude: props.tolatitude,
			endLongitude: props.tolongitude,
			type: activeTag.value
		}).then(res => {
			fwqlist.value = res.data.list
			const arr = res.data.list.map((shop, index) => ({
				id: index + 1, // 确保id唯一且不为0（0用于用户位置）
				latitude: shop.latitude,
				delid: shop.id,
				longitude: shop.longitude,
				title: shop.name,
				iconPath: imgUrl +
					'map/etcdianwei-icon.png', // 可替换为自己的图标
				width: 20,
				height: 20,
				type: 'etc',
				callout: {
					content: shop.name,
					color: '#333',
					fontSize: 12,
					borderRadius: 4,
					bgColor: '#fff',
					padding: 5,
					display: 'BYCLICK'
				}
			}));
			emit('maptq', arr) // 触发事件并传值
			total.value = res.data.total
			// console.log(fwqlist.value)
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
		margin-bottom: 29rpx;
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
		padding-left: 30rpx;
		padding-right: 30rpx;
		text-align: center;
		line-height: 56rpx;
		height: 56rpx;
		background: #F7F8FA;
		border-radius: 16rpx;
		font-weight: bold;
		font-size: 24rpx;
		color: #000000;

		&.active {
			padding-left: 10rpx;
			padding-right: 10rpx;
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
		height: 200rpx;
		margin: 20rpx 30rpx;
		background: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
	}

	.content {
		padding: 30rpx;
		color: #333;
		border-radius: 30rpx;
		display: flex;
	}

	.content-1 {
		width: 12rpx;
		height: 12rpx;
		background:var(--success-color);
		border-radius: 50%;
		margin-right: 10rpx;
		margin-top: 20rpx;
	}

	.content-2 {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
	}

	.content-3 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
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
		color: #666;
		margin: 16rpx 0;
		color:var(--primary-color);
	}

	.address {
		font-size: 24rpx;
		color: #999;
	}

	.icon {
		width: 32rpx;
		height: 32rpx;
		margin-left: 16rpx;
	}
</style>