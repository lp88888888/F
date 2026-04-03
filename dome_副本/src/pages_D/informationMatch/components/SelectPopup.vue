<template>
	<up-popup :show="show" mode="top" z-index="999" @close="close">
		<view class="popView" :data-theme="pageTheme" >
			<template  v-if="type == 1">
				<view></view>
			</template>
			<template v-if="type == 2 || type == 3">
				<view class="popView-title">请选择卸货地址</view>
				<view class="seleView" v-if="nextIndex != 0">
					<view class="seleView-left texNoWrap">
						<view :class="['seleView-left-text']" @click="nextIndex  = 0">{{formatProvince(provinceObj.name)}}</view>
						<up-icon name="arrow-right" color="#000000"></up-icon>
						<view v-if="nextIndex > 0" :class="['seleView-left-text',nextIndex == 1?'selectActive':'']" @click="nextIndex  = 1">
							<text>{{cityObj.name?cityObj.name:'请选择市'}}</text>
							<view class="selectActive-line"></view>
						</view>
						<up-icon v-if="nextIndex > 1" name="arrow-right" color="#000000"></up-icon>
						<view v-if="nextIndex > 1" :class="['seleView-left-text',nextIndex == 2?'selectActive':'']" @click="nextIndex  = 2">
							<text>{{districtObj.name?districtObj.name:'请选择区/县'}}</text>
							<view class="selectActive-line"></view>
						</view>
					</view>
					<view class="seleView-right" @click="selBack">返回上一级</view>
				</view>
				<view class="popView-cenGrid" v-if="nextIndex == 0">
					<view :class="['popView-cenGrid-item','texNoWrap',provinceObj.name == item.name?'gridActive':'']" v-for="(item,index) in provinceList" :key="index" @click="addrClick(item,'province')">{{formatProvince(item.name)}}</view>
				</view>
				<view class="popView-cenGrid" v-if="nextIndex == 1">
					<view :class="['popView-cenGrid-item','texNoWrap',cityObj.name == item.name?'gridActive':'']" v-for="(item,index) in cityList" :key="index" @click="addrClick(item,'city')">{{item.name}}</view>
				</view>
				<view class="popView-cenGrid" v-if="nextIndex == 2">
					<view :class="['popView-cenGrid-item','texNoWrap',districtObj.name == item.name?'gridActive':'']" v-for="(item,index) in districtList" :key="index" @click="addrClick(item,'district')">{{item.name}}</view>
				</view>
			</template>
			<template v-if="type == 4">
				<!-- <view class="popView-title">货物类型<text>（可多选）</text></view> -->
				<view class="popView-title">货物类型<text>（单选）</text></view>
				<view class="popView-cenGrid">
					<view :class="['popView-cenGrid-item',screenObj.goodsType == item.dictValue?'gridActive':'']" v-for="(item,index) in goodsList" :key="index" @click="selectClick(item,1)">{{item.dictLabel}}</view>
				</view>
				<view class="popView-title">重量<text>（单选）</text></view>
				<view class="popView-cenGrid">
					<view :class="['popView-cenGrid-item',screenObj.weight == item.remark?'gridActive':'']" v-for="(item,index) in weightList" :key="index" @click="selectClick(item,2)">{{item.dictLabel}}</view>
				</view>
				<view class="popView-title">体积<text>（单选）</text></view>
				<view class="popView-cenGrid">
					<view :class="['popView-cenGrid-item',screenObj.volume == item.remark?'gridActive':'']" v-for="(item,index) in volumeList" :key="index" @click="selectClick(item,3)">{{item.dictLabel}}</view>
				</view>
			</template>
			<view class="fiexView">
				<view class="fiexView-item" @click="reset">{{type==4?'重置':'清空筛选'}}</view>
				<view class="fiexView-item iconBut" @click="submit">确认</view>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import {ref,computed,reactive,onMounted} from 'vue';
	import {deepClone} from '@/uni_modules/uview-plus';
	// import jsonData from '../../../../cascaderDatas.json';
	import {formatProvince} from "@/utils/util";
	import { getDict } from '@/api/config';
	import { useAppStore } from '@/store/modules/app';
	const appStore = useAppStore();
	const jsonData = appStore.cascaderDatas
	
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const emits = defineEmits(["change"]);
	
	const show = ref<boolean>(false);
	const type = ref<0|1|2|3|4>(0); // 1 距离排序，2装/3卸货地址,4筛选
	const options1 = ref([
	  {
	    label: '默认排序',
	    value: 1,
	  },
	  {
	    label: '距离优先',
	    value: 2,
	  },
	  {
	    label: '价格优先',
	    value: 3,
	  }
	]);
	interface SelectArr {
		name:string
	}
	const goodsList = ref<Array<SelectArr>>([{name:'煤炭',value:'煤炭'},{name:'建材',value:'建材'},{name:'化工',value:'化工'},{name:'钢材',value:'钢材'},{name:'水果',value:'水果'},{name:'食品饮料',value:'食品饮料'}]);
	const weightList = ref<Array<SelectArr>>([{name:'0-5',value:'0-5'},{name:'5-10',value:'5-10'},{name:'10-20',value:'10-20'},{name:'20-30',value:'20-30'},{name:'30以上',value:'30-99'}]);
	const volumeList = ref<Array<SelectArr>>([{name:'0-25',value:'0-25'},{name:'25-40',value:'25-40'},{name:'40-60',value:'40-60'},{name:'60-80',value:'60-80'},{name:'80以上',value:'80-99'}]);
	
	const provinceList = ref(jsonData);
	const cityList = ref<any>([]);
	const districtList = ref([]);
	const provinceObj = ref({});
	const cityObj = ref({});
	const districtObj = ref({});
	const nextIndex = ref<0|1|2>(0); // 0-省，1-市，2区
	
	
	const selectLsit = ref([]);
	const screenObj = ref({
		goodsType:'', // 货物类型
		volume:'', // 体积
		weight:'', // 重量
	})
	const close = ()=>{
		show.value = false;
		type.value = 0;
		reset()
	}
	const open = (type:number,event)=>{
		show.value = true;
		if(type == 4){
			// selectLsit.value = deepClone(event.screenList);
			screenObj.value= deepClone(event.screenObj)
			
		}
		if(type == 3 || type == 2){
			let {province,city,district} = deepClone(event);
			provinceList.value = jsonData;
			provinceObj.value = province;
			cityObj.value = city;
			districtObj.value = district;
			nextIndex.value = 0
			if(province.code){
				cityList.value  = provinceList.value.filter(item => item.code == province.code)[0].city;
				nextIndex.value = 1
			}
			if(city.code){
				districtList.value  = cityList.value.filter(item => item.code == city.code)[0].area
				nextIndex.value = 2
			}
		}
		if(type == 1){
			
		}
	}
	const addrClick = (item,type)=>{
		if(type == 'province'){
			if(item.code != provinceObj.value.code){
				provinceObj.value.name = item.name
				provinceObj.value.code = item.code
				cityList.value = item.city
				cityObj.value  = {}
				districtObj.value  = {}
				districtList.value  = []
			}
			nextIndex.value = 1
		}
		if(type == 'city'){
			if(item.code != cityObj.value.code){
				cityObj.value.name = item.name
				cityObj.value.code = item.code
				districtList.value = item.area
				districtObj.value  = {}
			}
			
			nextIndex.value = 2
		}
		if(type == 'district'){
			districtObj.value.name = item.name
			districtObj.value.code = item.code
		}
	}
	const selBack = ()=>{
		nextIndex.value--
	}
	//
	const selectClick = (item,type)=>{
		if(type == 1){
			screenObj.value.goodsType = item.dictValue
		}
		if(type == 2){
			screenObj.value.weight = item.remark
		}
		if(type == 3){
			screenObj.value.volume = item.remark
		}
		// 多选
		// if(selectLsit.value.indexOf(item.name) == -1){
		// 	selectLsit.value.push(item.name);
		// }else{
		// 	selectLsit.value = selectLsit.value.filter(el => el != item.name);
		// }
	}
	// 确定
	const submit = () =>{
		if(type.value == 4){
			emits('change',{
				type:4,
				// screenList:selectLsit.value,
				screenObj:screenObj.value,
			});
		}
		if(type.value == 3 || type.value == 2){
			// if(!cityObj.value.code) return 
			emits('change',{
				type:type.value,
				province:provinceObj.value,
				city:cityObj.value,
				district:districtObj.value
			});
		}
		if(type.value == 1){}
		close()
	}
	// 清空，重置
	const reset = () =>{
		if(type.value == 4){
			screenObj.value = {
				goodsType:'', // 货物类型
				volume:'', // 体积
				weight:'', // 重量
			}
		}
		if(type.value == 3 || type.value == 2){
			
		}
		selectLsit.value = [];
		cityList.value = [];
		districtList.value = [];
		provinceObj.value = {};
		cityObj.value = {};
		districtObj.value = {};
		nextIndex.value = 0;
	}
	const getData = async ()=>{
		try{
			let res = await getDict('goods_type');
			let res2 = await getDict('goods_weight');
			let res3 = await getDict('goods_volume');
			if(res.code == 200){
				goodsList.value = res.data 
			}
			if(res2.code == 200){
				weightList.value = res2.data 
			}
			if(res3.code == 200){
				volumeList.value = res3.data 
			}
		}catch(err){

		}
	}
	onMounted(()=>{
		getData()
	})
	defineExpose({
		show,
		type,
		open,
		close
	})
</script>

<style lang="scss" scoped>
	.popView{
		height: 100vh;
		padding: 320rpx 32rpx 0 32rpx;
		box-sizing: border-box;
		background: #F1EFEC;
		position: relative;
		.popView-title{
			font-weight: bold;
			font-size: 28rpx;
			color: #000000;
			text{
				color: #999999;
				font-weight: 500;
			}
		}
		.seleView{
			width: 686rpx;
			height: 88rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 35rpx;
			box-sizing: border-box;
			margin-top: 20rpx;
			
			.seleView-left{
				// width: 400rpx;
				display: flex;
				align-items: center;
				
				.seleView-left-text{
					font-weight: bold;
					font-size: 30rpx;
					color: #000000;
					line-height: 88rpx;
				}
				.selectActive{
					color: var(--primary-color)!important;
					position: relative;
					.selectActive-line{
						width: 52rpx;
						height: 6rpx;
						background: var(--primary-color);
						border-radius: 4rpx 4rpx 0rpx 0rpx;
						position: absolute;
						left: calc((100% - 52rpx) / 2);
						bottom: 0;
					}
				}
			}
			.seleView-right{
				font-weight: 500;
				font-size: 24rpx;
				color: var(--primary-color);
			}
		}
		.popView-cenGrid{
			padding: 30rpx 0;
			width: 100%;
			display: grid;
			grid-template-columns: repeat(4,1fr);
			grid-gap: 22rpx;
			.popView-cenGrid-item{
				width: 100%;
				height: 67rpx;
				line-height: 67rpx;
				text-align: center;
				font-weight: 500;
				font-size: 26rpx;
				color: #333333;
				background: #FFFFFF;
				border-radius: 16rpx;
				border: 1px solid #FFFFFF;
			}
			.gridActive{
				background: $pageBgColor;
				border-radius: 16rpx;
				border: 1px solid var(--primary-color);
				color: var(--primary-color);
			}
		}
		
		.fiexView{
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 158rpx;
			background: #FFFFFF;
			padding: 15rpx 32rpx 0 32rpx;
			box-sizing: border-box;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			.fiexView-item{
				width: 328rpx;
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				background: #FFFFFF;
				border-radius: 44rpx;
				border: 1px solid #CCCCCC;
				font-weight: 500;
				font-size: 30rpx;
				color: #000000;
			}
			.iconBut{
				background: var(--primary-color);
				border: 1px solid var(--primary-color);
				color: #FFFFFF;
			}
		}
	}
	
</style>