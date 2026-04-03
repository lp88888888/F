<template>
	<view class="container" :data-theme="pageTheme"  >
		<up-sticky>
			<view class="topBack">
				<up-navbar title="我的预约" leftIconSize="22" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
				<view style="padding: 0 32rpx;box-sizing: border-box;">
					<up-gap height="5"></up-gap>
					<view class="searchView">
						<up-input placeholder="请输入车辆名称" fontSize="28rpx" border="none" v-model="keyword" @confirm="init" @blur="init" @clear="init"></up-input>
						<up-icon name="search" size="22" color="#333333"></up-icon>
					</view>
					<view class="selectView">
						<scroll-view class="scroll-view_H tabs" scroll-x="true" >
							<view :class="['tabs-item',tabsType == 9?'tabsActive':'']" @click="tabsChange(9)">全部</view>
							<view :class="['tabs-item',tabsType == 0?'tabsActive':'']" @click="tabsChange(0)">待服务</view>
							<view :class="['tabs-item',tabsType == 1?'tabsActive':'']" @click="tabsChange(1)">已完成</view>
						</scroll-view>
						<view class="timView" @click="sortTime">
							<text>时间</text>
							<up-icon :name="`${imgUrl}static/${orderType== 'ASC'?'sort-ascend-icon':'sort-descend-icon'}.png`" size="14"></up-icon>
							<!-- <up-icon name="arrow-down-fill" size="10" color="#979AA7"></up-icon> -->
						</view>
					</view>
				</view>
			</view>
		</up-sticky>
		<view class="pageView">
			<view v-for="(item,index) in dataList" :key="index">
				<view class="card" @click="toNav('/pages_D/usedCar/orderDetail?id='+item.id)">
					<view class="card-name texNoWrap">{{item.prCarTypeVo?.name}}</view>
					<up-line color="#F2F2F2"></up-line>
					<view class="card-view">
						<up-image :src="item.prCarTypeVo?.picture" width="130rpx" height="130rpx" radius="5" :lazy-load="true"></up-image>
						<view class="card-view-center" >
							<view class="card-view-item">
								<up-icon name="clock" size="13" color="#000000"></up-icon>
								<text class="texNoWrap">{{item.createTime}}</text>
							</view>
							<up-gap height="15"></up-gap>
							<view class="card-view-item">
								<up-icon name="map" size="13" color="#000000"></up-icon>
								<text class="texNoWrap">{{item.prIndustry4sVo?.address}}</text>
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
	import theme from '@/utils/theme'
	import {ref,computed} from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import { listPrAppointmentOldCar } from '@/api/oldCar';
	import { onLoad, onReachBottom } from '@dcloudio/uni-app';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const times = ref(0); // 0-默认，1降序，2-升序
	const tabsType= ref<number>(9);
	const keyword = ref<string>('');
	const listQuery = ref({
		pageNum:1,
		pageSize:10,
	});
	const orderType = ref('ASC');// ASC、DESC
	const total = ref(0);
	const dataList = ref([])
	const sortTime=()=>{
		if(orderType.value == 'DESC'){
			orderType.value = 'ASC';
		}else{
			orderType.value = 'DESC';
		}
		init();
	}
	const tabsChange = (type:number)=>{
		tabsType.value = type;
		listQuery.value.pageNum = 1;
		init();
	}
	const init = ()=>{
		listQuery.value.pageNum = 1;
		getData();
	}
	const getData = async ()=>{
		try{
			let res = await listPrAppointmentOldCar({
				pageNum:listQuery.value.pageNum,
				pageSize:listQuery.value.pageSize,
				status:tabsType.value == 9?undefined : tabsType.value,
				orderColumn:'create_time', //  create_time、appointment_time
				orderType:orderType.value,
				carTypeName:keyword.value || undefined,
			})
			if(res.code == 0 || res.code == 200){
				total.value = res.total;
				dataList.value = listQuery.value.pageNum == 1?res.rows:[...dataList.value,...res.rows];
			}
		}catch(e){
		    console.log(e);
		}		
	}
	onLoad(()=>{
		init();
	})
	onReachBottom(()=>{
		if(listQuery.value.pageNum * listQuery.value.pageSize < total.value){
			getData()
		}
	})
</script>

<style lang="scss">
	.container{
		background:var(--head-color);
	}
	.topBack{
		width: 750rpx;
		// background: $bgTopColor;
	}
	.pageView{
		padding: 32rpx ;
		box-sizing: border-box;
		height: 80vh;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
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