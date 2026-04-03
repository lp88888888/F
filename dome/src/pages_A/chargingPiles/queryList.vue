<template>
	<view class="">
		<up-sticky>
			<Search @change="searchChange"></Search>
		</up-sticky>
		<view class="pageView" @scroll="handleScroll" ref="scrollContainer">
			<view v-for="(item, index) in dataList" :key="index">
				<ItemCard :detail="item"></ItemCard>
				<up-gap height="12"></up-gap>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import Search from "./components/Search.vue";
	import ItemCard from "./components/ItemCard.vue";
	import {
		getchargingList
	} from "@/api/chargingPiles.ts";
	import {
		onLoad
	} from '@dcloudio/uni-app';
	const dataList = ref([]);
	const loadStatus = ref('loadmore')
	const pageNum = ref(1);
	const scrollContainer = ref(null)
	const loading = ref(false)
	const hasMore = ref(true)
	const searchChange = (event) => {
		listQuery.value.stationName = event.stationName;
		listQuery.value.stationStatus = event.stationStatus;
		listQuery.value.chargingStatus = event.chargingStatus;
		listQuery.value.distanceRange = event.distanceRange;
		listQuery.value.power = event.power;
		pageNum.value = 1
		dataList.value = []
		loadMore()
	}
	const loadMore = async () => {
		if (loading.value || !hasMore.value) return

		loading.value = true
		try {
			let params = {
				pageNum: pageNum.value,
				pageSize: 20,
				latitude: uni.getStorageSync('address').lat,
				longitude: uni.getStorageSync('address').lng,
			}
			const res = await getchargingList(params);

			if (res.data.list.length < 20) {
				hasMore.value = false
			} else {

				pageNum.value++
			}

			dataList.value = [...dataList.value, ...res.data.list]
		} catch (error) {
			console.error('加载数据失败:', error)
		} finally {
			loading.value = false
		}
	}
	const handleScroll = (e) => {
		const {
			scrollTop,
			scrollHeight,
			clientHeight
		} = e.target
		// 当滚动到距离底部50px时触发加载
		if (scrollHeight - scrollTop - clientHeight <= 50) {
			loadMore()
		}
	}
	onMounted(() => {
		loadMore()
	})
</script>

<style lang="scss">
	page {
		background: #F6F5F4;
	}

	.pageView {
		padding: 24rpx 32rpx;
		box-sizing: border-box;
	}
</style>