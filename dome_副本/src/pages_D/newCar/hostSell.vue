<template>
	<view class="app-container" :data-theme="pageTheme" >
		<view class="header">
			<up-navbar :bgColor="topBgColor" :leftIconColor="topBgColor != 'transparent'?'#333333':'#FFFFFF'" 
			:title="topBgColor != 'transparent'?'热销榜':''" @leftClick="toBack" :placeholder="false" 
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
			<!-- <view class="topfixView"></view> --> 
			<image class="topfixView" :src="imgUrl+'del/newCar-ban1.jpg'" mode=""></image>
			<view class="seachViee">
				<view class="searView">
					<input placeholder="请输入车品牌名称" border="none" v-model="keyword" @input='getCarModelsList' class="inputbox"></input>
					<up-icon name="search" size="22" color="#D8D8D8"></up-icon>
				</view>
			</view>
			<up-gap height="20"></up-gap>
			<view class="topView">
				<view class="scroView">
					<scroll-view class="scroView-item" scroll-x="true" >
						<view :class="['scroView-item-text',seleIndex2 == item.name?'textActive':'']" v-for="(item,index) in opticon2" :key="index" @click="scroClick(item,2)">{{item.name}}</view>
					</scroll-view>
				</view>
				<up-gap height="15"></up-gap>
				<view class="scroView">
					<scroll-view class="scroView-item" scroll-x="true" >
						<view :class="['scroView-item-text',seleIndex3 == item.name?'textActive':'']" v-for="(item,index) in opticon3" :key="index" @click="scroClick(item,3)">{{item.name}}</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<view class="pageView">
			<CarList :list="dataList" isIcon :user="1" ></CarList>
			<template v-if="!dataList.length">
				<ser-empty></ser-empty>
			</template>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
	import CarSearch from './components/CarSearch.vue';
	import CarList from './components/CarList.vue';
	import { toNav,toBack } from '@/utils/route';
	import { selectHotCarBrand,selectHotNewCar } from '@/api/car';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	import { imgUrl } from '@/config';
	const topBgColor = ref<string>('transparent');
	const opticon1 = ref([{name:'不限',type:''},{name:'10万以下',type:'100000'},{name:'10-15万',type:'120000'},{name:'15-20万',type:'200000'},{name:'20-25万',type:'250000'}]);
	const opticon2 = ref([{name:'全部',type:''},{name:'轿车',type:'limousine'},{name:'SUV',type:'suv'},{name:'MPV',type:'mpv'}]);
	const opticon3 = ref([{name:'全部',type:''},{name:'新能源',type:'newenergy'},{name:'燃油',type:'fuel'}]);
	const seleIndex1 = ref('不限');
	const seleIndex2 = ref('全部');
	const seleIndex3 = ref('全部');
	const fuelType= ref('')
	const segment= ref('')
	const keyword= ref('')
	const newenergy= ref('')
	const fuel= ref('')
	const dataList = ref([
		{name:'上海大众 朗逸 2025款 新锐 1.5L自动新逸版',icon:imgUrl+'static/new-car-logo-icon1.png'},
		{name:'逸动 2025款 畅享版 蓝鲸 NE1.4T 尊贵版',icon:imgUrl+'static/new-car-logo-icon2.png'},
		{name:'长安CS75 2025款 畅享版 1.5T 自动尊贵版',icon:imgUrl+'static/new-car-logo-icon3.png'},
		{name:'上海大众 朗逸 2025款 新锐 1.5L自动新逸版',icon:imgUrl+'static/new-car-logo-icon4.png'},
		// {name:'逸动 2025款 畅享版 蓝鲸 NE1.4T 尊贵版',icon:imgUrl+'static/new-car-logo-icon1.png'},
		// {name:'长安CS75 2025款 畅享版 1.5T 自动尊贵版',icon:imgUrl+'static/new-car-logo-icon1.png'},
	])
	
	const scroClick  = (item,type:number)=>{
		switch(type){
			case 1:
				seleIndex1.value = item.name;
				break;
			case 2:
				seleIndex2.value = item.name;
				segment.value=item.type
				break;
			case 3:
				seleIndex3.value = item.name;
				fuelType.value=item.type
				break;
			default:
				break;
		}
		getCarModelsList()
	}
	
	onLoad(()=>{
		// 初始化状态栏颜色
		uni.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor:'#131313'
		})
		getCarModelsList()
	})
	onPageScroll((e) =>{
	  if (e.scrollTop < 50) {
		  topBgColor.value = 'transparent'
		  uni.setNavigationBarColor({
		  	frontColor: '#131313',
		  	backgroundColor:'#ffffff'
		  })
	  } else {
		  console.log(e);
		  topBgColor.value = '#FFFFFF'
		  uni.setNavigationBarColor({
		  	frontColor: '#ffffff',
		  	backgroundColor:'#131313'
		  })
	  }
	})
	
	// 获取车型
	const getCarModelsList = async () => {
		let params={
			name:keyword.value,
			segment:segment.value,
			fuelType:fuelType.value,
			pageNum:1,
			pageSize:30
		}
		const res = await selectHotNewCar(params);
      	dataList.value=res.rows
	}
</script>

<style lang="scss">
	.topfixView{
		width: 750rpx;
		height: 546rpx;
		// background: linear-gradient( 180deg, #FF9600 0%, rgba(255,158,0,0) 100%);
		background: #000000;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		
	}
	.pageView{
		flex: 1;	
		overflow-y: auto;
		padding: 24rpx 32rpx;
		box-sizing: border-box;
	}
	.seachViee{
		width: 100%;
		padding: 0 32rpx;
		box-sizing: border-box;
		margin-top: -150rpx;
		position: relative;
		z-index: 1;
	}
	.topView{
		width: 100%;
		padding: 32rpx 32rpx 32rpx 32rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}
	.scroView{
		width: 100%;
		height: 56rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		.scroView-label{
			font-weight: 400;
			font-size: 24rpx;
			color: #333333;
		}
		.scroView-item{
			width:100%;
			white-space: nowrap;
			display: flex;
			align-items: center;
			.scroView-item-text{
				display:inline-block;
				width: 120rpx;
				height: 56rpx;
				line-height: 56rpx;
				text-align: center;
				background: var(--safebottom);
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				margin-right: 16rpx;
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
			}
			.textActive{
				background: var(--label-color);
				font-weight: 700;
			}
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
	.app-container {
			display: flex;
			flex-direction: column;
			height: 100vh;
			overflow: hidden;
			background: var(--head-color);;
		}
	
		.header {
			position: sticky;
			top: 0;
			z-index: 10;
			/* 确保在内容上方 */
		}
		.inputbox{
			width: 100%;
		}
</style>