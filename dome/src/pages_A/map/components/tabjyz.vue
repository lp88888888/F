<template>
	<view class="container" :data-theme="pageTheme" style="height: 800rpx;  box-sizing: border-box;">
		<!-- 标题区域 -->
		<view class="header">
			<view class="title">
				<view>沿途共计<text class="count">{{total}}</text>个收费站</view>
				<u-icon name="close" color="#000" size="24" @click="onClose"></u-icon>

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
			<view v-for="item in fwqlist " :key="item.id" class="station-item" @click="goStation(item.id)" >
				<image v-if="item?.detailList" :src="item?.detailList[0]?.serviceInfoPicUrl" mode="aspectFill"
					class="bg-img"></image>
				<image src="https://tranalioss.shanyitong.com/images/20230225/1677317200274.jpeg" v-else
					mode="aspectFill" class="bg-img"></image>
				<view class="content">
					<view class="row">
						<text class="name">{{ item.tollStationName }}</text>
						<image :src="imgUrl+'img/daohang.png'" mode="aspectFill" @click.stop="goMap1(item)"  class="icon"></image>
					</view>
					<view class="distance">{{item.distance}}</view>
					<view class="address texNoWrap2">{{ item.tollStationAddress }}</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue'
	import { imgUrl } from '../../../config';
	import {openLocation} from '@/utils/util'
	import {
		getTollStationByLngLatList
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
	const pageNum = ref(1)
	// 页面显示
	onMounted(() => {
		getlist()
	})
	const chengtags = (id) => {
		activeTag.value = id
		getlist()
	}
	const goMap1 = (item) => {
		console.log();
		openLocation({
			latitude: Number(item.latitude),//维度
			longitude: Number(item.longitude),//经度
			scale: 18,//缩放比例，范围5~18，默认为18
			name: item.tollStationName,
		})
	}
	const goStation = (id : any) => {
		// uni.navigateTo({
		// 	url: '/pages_A/stationDetails/index?id=' + id
		// })
	}
	const getlist = async () => {
		const params = {
			pageNum: pageNum.value,
			pageSize: 100,
			myLongitude: props.fromcurrentLng,
			myLatitude: props.fromcurrentLat,
			startLongitude: props.fromcurrentLng,
			startLatitude: props.fromcurrentLat,
			endLongitude: props.tolongitude,
			endLatitude: props.tolatitude,
			operationalStatus: activeTag.value
		};
		const res = await getTollStationByLngLatList(params)
		fwqlist.value = res.data.list
		const arr = res.data.list.map((shop, index) => ({
			id:index + 1, // 确保id唯一且不为0（0用于用户位置）
			delid:shop.id,
			latitude: shop.latitude,
			longitude: shop.longitude,
			title: shop.tollStationName,
			iconPath: imgUrl +
				'map/sfzdingwei-icon.png', // 可替换为自己的图标
			width: 24,
			height: 24,
			type: 'sfz',
			callout: {
				content: shop.tollStationName,
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
	};
	// 标签列表
	const invoiceList = ref([
		{ id: "", rkname: '全部' },
		{ id: "01", rkname: '正常' },
		{ id: "02", rkname: '关闭' },
		{ id: "05", rkname: '管制' }
	])

	// 收费站列表
	const fwqlist = ref([

	])

	// 当前选中标签
	const activeTag = ref('')
	const total = ref(0)
	// 关闭事件
	const emit = defineEmits<{
		(e : 'call-parent', data : string) : void
	}>()

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
		height: 200rpx;
		margin: 20rpx 30rpx;
		background: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
	}

	.bg-img {

		width: 160rpx;
		height: 120rpx;
		border-radius: 26rpx;
		margin-left: 30rpx;
	}

	.content {
		max-width: 460rpx;
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
		color: #666;
		margin: 16rpx 0;
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