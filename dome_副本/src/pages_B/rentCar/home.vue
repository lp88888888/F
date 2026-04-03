<template>
	<view class="">
		<up-sticky zIndex="99999">
			<view id="toBox" class="topView" >
				<up-navbar title="租车" bgColor="transparent" @leftClick="toBack" placeholder :fixed="false"></up-navbar>
				<view class="searchView fl-ce-sb">
					<up-search placeholder="请输入门店名称" v-model="keyword" :showAction="false" searchIconColor="#000000"></up-search>
					<view class="searchView-right fl-ce-ce" v-if="isMap" @click="isMap= !isMap">
						<image :src="imgUrl+'static/D-inf-list-lt-icon.png'" mode=""></image>
						<text>列表</text>
					</view>
					<view class="searchView-right fl-ce-ce" v-else  @click="isMap= !isMap">
						<image :src="imgUrl+'static/wx-weizhi-icon.png'" mode=""></image>
						<text>地图</text>
					</view>
				</view>
				<view  class="slectView fl-ce-sb">
					<view class="slectView-item fl-al-ce" @click="selectOpen(1)">
						<text class="m-r-10">距离优先</text>
						<up-icon :name="imgUrl+'static/sj-bottom.png'" size="10"></up-icon>
					</view>
					<view class="slectView-item fl-al-ce">
						<text class="m-r-10">品牌</text>
						<up-icon :name="imgUrl+'static/sj-bottom.png'" size="10"></up-icon>
					</view>
					<view class="slectView-item fl-al-ce" >
						<text class="m-r-10">价格</text>
						<up-icon :name="imgUrl+'static/sj-bottom.png'" size="10"></up-icon>
					</view>
					<view class="slectView-item fl-al-ce" @click="selectOpen(4)">
						<text class="m-r-10" :style="{color: popType == 4?'#FF9600':'#000000'}">筛选</text>
						<up-icon :name="imgUrl+'static/D-inf-sift-icon.png'" :color="popType == 4?'#FF9600':'#000000'" size="14"></up-icon>
					</view>
				</view>
			</view>
		</up-sticky>
		<SelectPopup ref="selectPop" :paddingTop="selePaddTopHeight" @change="selectChange"></SelectPopup>
		<MapList v-if="isMap"></MapList>
		<view v-else class="pageView">
			<view v-for="(item,index) in dataList" :key="index">
				<BusinessItem :detail="item"></BusinessItem>
			</view>
			<ser-empty v-if="!dataList.length"></ser-empty>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed,onMounted,getCurrentInstance} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import BusinessItem from "./components/BusinessItem.vue";
	import SelectPopup  from "./components/SelectPopup.vue";
	import MapList from "./map.vue";
	import type {Business} from './types';
	import { useElementSingle} from '@/utils/useElementRect';
	import { onReady } from '@dcloudio/uni-app';
	const instance = getCurrentInstance()
	const { querySingle } = useElementSingle('#toBox',instance)
	const selectPop = ref(null);
	const keyword = ref<string>('');
	const isMap = ref(true);
	const selePaddTopHeight = ref(100);
	const dataList = ref<Array<Business>>([
		{url:'',name:'安康宏晖鑫达商贸有限公司',price:68,dNum:'100.15KM',addr:'宁陕县江口回族镇'},
		{url:'',name:'西安悦达商贸有限公司',price:200,dNum:'100.15KM',addr:'广泽大厦丈八东路南途虎养车'},
		{url:'',name:'西安悦达商贸有限公司',price:200,dNum:'100.15KM',addr:'广泽大厦丈八东路南途虎养车'},
		{url:'',name:'西安悦达商贸有限公司',price:200,dNum:'100.15KM',addr:'广泽大厦丈八东路南途虎养车'},
		{url:'',name:'西安悦达商贸有限公司',price:200,dNum:'100.15KM',addr:'广泽大厦丈八东路南途虎养车'},
	])
	const screenList = ref([]);//筛选内容
	const popType = computed(()=>{
		return selectPop.value?.type
	})
	
	const selectOpen =(type:number)=>{
		console.log(selectPop.value);
		if(selectPop.value.type == type){
			selectPop.value.close()
		}else{
			selectPop.value.type = type
			if(type == 4){
				selectPop.value.open(type,{screenList:screenList.value})
			}
			if(type == 1){
				selectPop.value.open(type)
			}
			// if(type == 3){
			// 	selectPop.value.open(type,{...endCity.value})
			// }
			// if(type == 2){
			// 	selectPop.value.open(type,{...startCity.value})
			// }
		}
	}
	
	const selectChange  = (event)=>{
		if(event.type == 4){
			screenList.value = event.screenList
		}
		
		// if(event.type == 3){
		// 	endCity.value.province = event.province
		// 	endCity.value.city = event.city
		// 	endCity.value.district = event.district
		// }
		// if(event.type == 2){
		// 	startCity.value.province = event.province
		// 	startCity.value.city = event.city
		// 	startCity.value.district = event.district
		// }
		
	}
	const handleQuery = async () => {
		try{
			const result =await querySingle() 
			if(result){
				selePaddTopHeight.value = result.height
			}
		}catch(err){
			console.log('卡片尺寸shib:', err)
		}
	}
	onMounted(()=>{
		nextTick(() => {
			setTimeout(() => {
			  handleQuery()
			}, 300)
		})
	})
</script>

<style lang="scss" scoped>
	
	.topView{
		width: 100%;
		background: linear-gradient(0deg, #FFFFFF, #FFECCE);
	}
	.pageView{
		padding: 32rpx;
		box-sizing: border-box;
	}
	.searchView{
		width: 100%;
		padding: 0 32rpx;
		box-sizing: border-box;
		.searchView-right{
			margin-left: 20rpx;
			width: 72rpx;
			height: 72rpx;
			background: #F4F6FA;
			border-radius: 36rpx;
			flex-direction: column;
			font-weight: 500;
			font-size: 18rpx;
			color: #000000;
			line-height: 18rpx;
			image{
				width: 20rpx;
				height: 24rpx;
				margin-bottom: 4rpx;
			}
		}
	}
	.slectView{
		height: 90rpx;
		padding: 0 50rpx;
		box-sizing: border-box;
		.slectView-item{
			font-weight: 500;
			font-size: 28rpx;
			color: #000000;
			line-height: 36rpx;
		}
	}
</style>