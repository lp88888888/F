<template>
	<view class="colCenter" :data-theme="pageTheme" >
		<view class="topView">
			<view class="searView">
				<up-input 
					placeholder="请输入车品牌名称" 
					border="none" 
					v-model="keyword" 
					@change='handleSearch'
				></up-input>
				<up-icon name="search" size="22" color="#D8D8D8"></up-icon>
			</view>
		</view>
		<view class="pageView">
			<CarList :list="filteredList" :user='2'></CarList>
			<template v-if="!filteredList.length">
				<ser-empty></ser-empty>
			</template>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { prCarType,selectNewCarByType } from '@/api/car';
	import CarList from './components/CarList.vue';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	// 原始数据列表
	const dataList = ref([]);
	// 搜索关键词
	const keyword = ref('');
	// 系列ID
	const seriesId = ref('');

	// 获取车型列表
	const getCarModelsList = async (id: number | string) => {
		const res = await selectNewCarByType(id);
		dataList.value = res.rows;
	}

	// 处理搜索逻辑
	const handleSearch = () => {
		getCarModelsList(seriesId.value, keyword.value)
	}

	// 计算过滤后的列表
	const filteredList = computed(() => {
		if (!keyword.value.trim()) {
			return dataList.value;
		}
		// 假设车型名称字段为name，根据实际字段调整
		return dataList.value.filter(item => 
			item.name?.toLowerCase().includes(keyword.value.trim().toLowerCase())
		);
	});

	onLoad((options) => {
		seriesId.value = options.id;
		getCarModelsList(options.id);
	})
</script>

<style lang="scss" scoped >
	/* 样式保持不变 */
	.colCenter{
		background: var(--head-color);
	}
	.topView{
		padding: 10rpx 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;
	}
	
	.pageView{
		padding: 24rpx 32rpx;
		box-sizing: border-box;
	}
	.searView {
		width: 95%;
		height: 72rpx;
		background: #FCFCFC;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #EBEBEB;
		display: flex;
		align-items: center;
		padding:20rpx 10rpx;
		box-sizing: border-box;
		margin: 0 auto 20rpx;
	}
</style>