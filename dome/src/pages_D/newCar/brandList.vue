<template>
	<view class="contactbox" :data-theme="pageTheme" >
		<!-- <view class="topView">
			<view class="labelView">
				<view class="labelView-item" :class="[indexLabel1 == index?'labeActive':'']" v-for="(item,index) in labelList1" :key="index" @click="labelClick(index,1)">{{item.name}}</view>
			</view>
			<up-gap height="12"></up-gap>
			<view class="labelView">
				<view class="labelView-item" :class="[indexLabel2 == index?'labeActive':'']" v-for="(item,index) in labelList2" :key="index" @click="labelClick(index,2)">{{item.name}}</view>
			</view>
		</view> -->
		<view class="searView">
			<up-input placeholder="请输入车品牌名称" border="none" v-model="keyword" @change="getCarBrandList" @confirm="getCarBrandList" @blur="getCarBrandList"></up-input>
			<up-icon name="search" size="22" color="#D8D8D8" @click="getCarBrandList"></up-icon>
		</view>
		<up-index-list v-if=" itemArr.length > 0" activeColor="#333333" :index-list="indexList" customNavHeight="134">
			<template v-for="(item, index) in itemArr">
				<up-index-item>
					<view class="indText"></view>
				<!-- 	<view class="indText">{{indexList[index]}}</view> -->
					<view class="list-cell" v-for="(cell, indesx) in item.items" :key="indesx" @click="toNav('/pages_D/newCar/typeList?id='+cell.id)">{{cell.name}}</view>
				</up-index-item>
			</template>
		</up-index-list>
	</view>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app';
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import { prCarSeries} from '@/api/car';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const brandId=ref<any>('')
	const keyword = ref<string>('')
	const indexList  = computed(()=>{
		return ['']
	})
	const originalItemArr = ref<any[]>([]);
	const itemArr = ref<any[]>([]);
	const indexLabel1 = ref(0)
	const indexLabel2 = ref(0)
	const labelList1 = ref([
		{name:'全部类型'},
		{name:'新能源'},
		{name:'燃油'}
	])
	const labelList2 = ref([
		{name:'全部级别'},
		{name:'轿车'},
		{name:'SUV'},
		{name:'MPV'}
	])
	
	const labelClick = (index:number,type:1|2)=>{
		if(type == 1){
			indexLabel1.value = index
		}
		if(type == 2){
			indexLabel2.value = index
		}
	}
	// 获取车系
	// const getCarSeriesList = async (brandId: number | string) => {
	// 	const res = await prCarSeries(brandId);
	// 	const groupedData: Record<string, { initial: string; items: any[] }> = {};
	// 	res.rows.forEach(series => {
	// 		const initial = series.initial;
	// 		if (!groupedData[initial]) {
	// 			groupedData[initial] = { initial, items: [] };
	// 		}
	// 		groupedData[initial].items.push({ id: series.id, name: series.name });
	// 	});
	// 	itemArr.value = Object.values(groupedData).sort((a, b) => a.initial.localeCompare(b.initial));
	// };
	const getCarSeriesList = async (brandId: number | string) => {
			const res = await prCarSeries(brandId);
			console.log("查询的列表数据",res)
			const groupedData: Record<string, { initial: string; items: any[] }> = {};
			res.rows.forEach(series => {
				const initial = series.initial;
				if (!groupedData[initial]) {
					groupedData[initial] = { initial, items: [] };
				}
				groupedData[initial].items.push({ id: series.id, name: series.name });
			});
			const formattedData = Object.values(groupedData).sort((a, b) => a.initial.localeCompare(b.initial));
			itemArr.value = formattedData;
			originalItemArr.value = JSON.parse(JSON.stringify(formattedData)); // 保存原始数据
		};
	
		// 新增：搜索功能实现
		const getCarBrandList = () => {
			if (!keyword.value.trim()) {
				// 如果搜索词为空，恢复原始数据
				itemArr.value = JSON.parse(JSON.stringify(originalItemArr.value));
				return;
			}
	
			// 过滤逻辑：保留包含关键词的项
			const filtered = originalItemArr.value.map(group => {
				const filteredItems = group.items.filter((item: any) => 
					item.name.toLowerCase().includes(keyword.value.toLowerCase())
				);
				return { ...group, items: filteredItems };
			}).filter(group => group.items.length > 0); // 过滤掉没有匹配项的分组
			console.log("开始过滤",filtered)
			itemArr.value = filtered;
		};

	onLoad((options)=>{
		uni.setNavigationBarTitle({
		  title: options.name
		})
		getCarSeriesList(options.id)
	})
</script>

<style lang="scss" scoped>
	.contactbox{
		background: var(--head-color);
	}
	.topView{
		padding: 40rpx;
		box-sizing: border-box;
	}
	.labelView{
		width: 100%;
		
		box-sizing: border-box;
		display: grid;
		grid-template-columns: repeat(4,1fr);
		grid-gap: 16rpx;
		.labelView-item{
			width: 100%;
			height: 72rpx;
			line-height: 72rpx;
			text-align: center;
			background: rgba(241,240,239,0.7);
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			
			font-weight: 500;
			font-size: 24rpx;
			color: #333333;
		}
		.labeActive{
			background: var(--label-color);
			font-weight: 700;
		}
	}
	.indText{
		width: 100%;
		height: 15rpx;
		line-height: 64rpx;
		// background: linear-gradient( 270deg, #F6F5F4 0%, rgba(216,216,216,0) 100%);
		background: #F6F5F4;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		font-weight: 500;
		font-size: 24rpx;
		color: #3D3D3D;
		padding-left:52rpx;
		box-sizing: border-box;
	}
	.list-cell {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		min-height: 96rpx;
		padding: 0 48rpx;
		box-sizing: border-box;
		
		.list-cell-line{
			width: 120rpx;
			display: flex;align-items: center;
			justify-content: center;
			image{
				height: 70rpx;
			}
		}
		.list-cell-text{
			font-weight: 700;
			font-size: 28rpx;
			color: #3D3D3D;
			line-height: 28rpx;
		}
	}
	.searView {
		width: 90%;
		height: 72rpx;
		background: #FCFCFC;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #EBEBEB;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
		margin: 0 auto 20rpx;
	}
</style>