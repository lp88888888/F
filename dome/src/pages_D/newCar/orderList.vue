<template>
	<view  class="container" :data-theme="pageTheme" >
		<up-sticky>
			<view class="topBack">
				<up-navbar title="我的预约" leftIconSize="22" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
				<view style="padding: 0 32rpx;box-sizing: border-box;">
					<up-gap height="5"></up-gap>
					<view class="searchView">
						<up-input placeholder="请输入预约车名称" fontSize="28rpx" border="none" v-model="keyword" @change="selectByUserIdFun"></up-input>
						<up-icon name="search" size="22" color="#333333"></up-icon>
					</view>
					<view class="selectView">
						<scroll-view class="scroll-view_H tabs" scroll-x="true" >
							<view :class="['tabs-item',sjType == 2?'tabsActive':'']" @click="tabsChange(2)">全部</view>
							<view :class="['tabs-item',sjType == 0?'tabsActive':'']" @click="tabsChange(0)">待试驾</view>
							<view :class="['tabs-item',sjType == 1?'tabsActive':'']"  @click="tabsChange(1)">已试驾</view>
							<!-- <view :class="['tabs-item',tabsType == 4?'tabsActive':'']" @click="tabsChange(4)">已取消</view> -->
						</scroll-view>
						<!-- <view class="tabs">
							
						</view> -->
						<view class="timView" @click="sortTime">
							<text>时间</text>
							<up-icon :name="`${imgUrl}static/${times==2?'sort-ascend-icon':times==1?'sort-descend-icon':'sort-icon'}.png`" size="14"></up-icon>
							<!-- <up-icon name="arrow-down-fill" size="10" color="#979AA7"></up-icon> -->
						</view>
					</view>
				</view>
			</view>
		</up-sticky>
		<view class="pageView">
			<view v-for="(item,index) in dataList" :key="index">
				<view class="card" @click="toNav('/pages_D/newCar/orderDetail?id='+item.id)">
				    <view style="display: flex;justify-content: space-between;">
							<view class="card-name texNoWrap">{{item.carName}}</view>
							<view class="card-name texNoWrap" style="color: #FF9600;" v-if="item.status==0">{{statusFun(item.status) }}</view>
							<view class="card-name texNoWrap" style="color: #ccc;" v-else>{{statusFun(item.status) }}</view>
					</view>
					<up-line color="#F2F2F2"></up-line>
					<view class="card-view">
						<up-image :src="item.prIndustry4sVo.image" width="130rpx" height="130rpx" radius="5" :lazy-load="true"></up-image>
						<view class="card-view-center" >
							<view class="card-view-item">
								<up-icon name="clock" size="13" color="#000000"></up-icon>
								<text class="texNoWrap">{{item.createTime}}</text>
							</view>
							<up-gap height="15"></up-gap>
							<view class="card-view-item">
								<up-icon name="map" size="13" color="#000000"></up-icon>
								<text class="texNoWrap">{{item.prIndustry4sVo?item.prIndustry4sVo.address:''}}</text>
							</view>
						</view>
					</view>
				</view>
				<up-gap height="15"></up-gap>
			</view>
			<ser-empty v-if="dataList.length == 0"></ser-empty>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { onLoad, onShow,onPageScroll } from '@dcloudio/uni-app';
	import { selectByUserId } from '@/api/car';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const times = ref(2); // 0-默认，1降序，2-升序
	const tabsType= ref<number>('');
	const sjType= ref<number>(2);
	const keyword = ref<any>('');
	const timeBy= ref<string>('');
	const dataList = ref([
		{name:'畅享版蓝鲸 NE1.4T 超享型',imgSrc:imgUrl+'del/car-back3.png',time:'2025-03-26 09:10:26',addr:'陕西省未央区天台路89号陕西汽贸'},
		{name:'奔驰CLA 2016款 CLA 260 4MATIT',imgSrc:imgUrl+'del/car-back3.png',time:'2025-03-26 09:10:26',addr:'陕西省未央区天台路89号陕西汽贸'},
		{name:'奥迪Q5(进口)2010款 3.2FSI 运动版',imgSrc:imgUrl+'del/car-back3.png',time:'2025-03-26 09:10:26',addr:'陕西省未央区天台路89号陕西汽贸'},
		{name:'夏 2025款 DM-i 100KM超越型',imgSrc:imgUrl+'del/car-back3.png',time:'2025-03-26 09:10:26',addr:'陕西省未央区天台路89号陕西汽贸'},
	])
	const sortTime=()=>{
		if(times.value == 2){
			times.value = 1;
			timeBy.value='desc'
		}else if(times.value == 1){
			times.value = times.value + 1;
			timeBy.value='asc'
		}
		selectByUserIdFun()
	}
	const tabsChange = (type:number)=>{
		if(type==2){
		 sjType.value = '2';
		}else{
		 sjType.value = type;
		 tabsType.value = type;
		}
		
		selectByUserIdFun()
	}
	const selectByUserIdFun=async () =>{
		if(sjType.value==2){
		  tabsType.value = '';
		}
		let params={
			carName:keyword.value,
			timeBy:timeBy.value,
			status:tabsType.value,
		}
	 const res = await selectByUserId(params);
	 dataList.value=res.data
	}
	const statusFun=(val)=>{
		if(val=='0'){
			return '待试驾'
		}else if(val=='1'){
			return '已试驾'
		}
	}
	onLoad(()=>{
		selectByUserIdFun()
	})
</script>

<style lang="scss">
	.container{
		background: var(--head-color);
	}
	.topBack{
		width: 750rpx;
		background: linear-gradient(0deg, #FFFFFF, #FFECCE);
	}
	.pageView{
		padding: 32rpx ;
		box-sizing: border-box;
	}
	.searchView{
		width: 100%;
		height: 72rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
		
		background: #FFFFFF;
		border-radius: 16rpx;
		border: 1px solid #CBD1D8;
	}
	.selectView{
		width: 100%;
		padding: 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.tabs{
		white-space: nowrap;
		width: 560rpx;
		display: flex;
		align-items: center;
		.tabs-item{
			min-width: 150rpx;
			height: 56rpx;
			line-height: 56rpx;
			text-align: center;
			background: #F7F8F9;
			font-weight: 500;
			font-size: 26rpx;
			color: #666666;
			border-radius: 28rpx;
			margin-right: 20rpx;
			display: inline-block;
		}
		.tabsActive{
			background: var(--primary-color);
			color: #FFFFFF;
		}
	}
	
	.timView{
		display: flex;
		align-items: center;
		text{
			margin-right: 10rpx;
		}
	}
	
	.card{
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 20rpx;
		
		.card-name{
			line-height: 100rpx;
			font-weight: bold;
			font-size: 30rpx;
			color: #000000;
		}
		.card-view{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 25rpx 0 30rpx 0;
			
			.card-view-center{
				width: calc(100% - 150rpx);
			}
			.card-view-item{
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 26rpx;
				color: #666666;
				text{
					margin-left: 8rpx;
				}
			}
		}
	}
</style>