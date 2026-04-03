<template>
	<view class="page-container" :data-theme="pageTheme" >
		<up-navbar title="全部车源" bgColor="transparent" @leftClick="toBack" placeholder fixed="true"></up-navbar>
		<up-sticky>
			<view class="searchView">
				<view class="m-b-30">
					<up-search placeholder="请输入车辆关键字" v-model="keyword" searchIconColor="#000000" 
					shape="round" bgColor="#F5F5F5" @change="searchChange" @clear='searchChange' :showAction="false"></up-search>
				</view>
				<view class="selectView">
					<scroll-view class="selectView-H" scroll-x="true">
						<view class="selectView-item" @click="selectOpen(1)">
							<text class="">{{ brandName?brandName:'品牌' }}</text>
							<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
						</view>
						<view class="selectView-item" @click="selectOpen(2)">
							<text class="">{{basicName || "类型"}}</text>
							<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
						</view>
						<view class="selectView-item" @click="selectOpen(3)">
							<text class="">{{energyName || "能源"}}</text>
							<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
						</view>
						<view class="selectView-item" @click="selectOpen(4)">
							<text class="">{{priceName || "价格"}}</text>
							<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
						</view>
						<view class="selectView-item"  @click="selectOpen(5)">
							<text class="">{{listQuery.province || "地区"}}</text>
							<up-icon name="arrow-down" size="10" color="#333333"></up-icon>
						</view>
					</scroll-view>
					<view class="selectView-right" @click="requst">重置</view>
				</view>
			</view>
		</up-sticky>
		<view class="pageView">
			<view v-for="(item,index) in dataList" :key="index">
				<view class="card" @click="toNav('/pages_D/usedCar/carDetail?id='+ item.id)">
					<up-image :src="item.picture" width="172rpx" height="172rpx" radius="16rpx" :lazy-load="true"></up-image>
					<view class="card-center">
						<view class="card-name texNoWrap2">{{item.name}}</view>
						<up-gap height="10"></up-gap>
						<view class="fl-fe-sb" >
							<view class="center-text">{{item.mileageFormat}}万公里/ {{ item.transactionsNumber || 0}}手</view>
							<view class="card-price">{{item.price}}万起</view>
						</view>
						
					</view>
				</view>
				<up-gap height="12" ></up-gap>
			</view>
			<ser-empty v-if="!dataList.length"></ser-empty>
		</view>
		<up-picker :show="pickShow" :columns="columns" keyName="dictLabel" @close="pickClose" @cancel="pickClose" @confirm="pickConfirm"></up-picker>
	<BrandSelectPopup ref="brandSelectRef" type="brand" @change="brandChange"></BrandSelectPopup>
	<up-popup :show="showAddressPicker" round="20" @close="handleCloseAddressPicker">
		<view>
			<Address type="city" :onCallParent="handleCloseAddressPicker" @select-address="handleSelectAddress"></Address>
		</view>

	</up-popup>
	</view>
</template>

<script setup lang="ts">
	import {ref,computed} from 'vue';
	import { random, guid,timeFormat } from '@/uni_modules/uview-plus';
	import { toNav,toBack } from '@/utils/route';
	import {imgUrl} from '@/config';
	import BrandSelectPopup from '@/components/BrandSelectPopup/index.vue';
	import Address from '@/pages_D/newCar/components/Address.vue';
	import { onLoad,onReachBottom } from '@dcloudio/uni-app';
	import { listPrOldCarDetail,listPics } from '@/api/oldCar';
	import {getDict} from '@/api/config';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const brandSelectRef = ref(null);
	const dataList = ref([]);
	const keyword  = ref<string>('');
	const brandName = ref('');
	const listQuery = ref({
		pageNum:1,
		pageSize:10,
		brandId: '',
		minPrice:undefined,
		maxPrice:undefined,
		energyType:undefined,
		segment:undefined,
		province:undefined,
		city:undefined,
	});

	const showAddressPicker = ref(false);
	// 类型
	const options1 = ref([]);
	const options2 = ref([]);
	const options3 = ref([]);

	const pickShow = ref(false);
	const columns = ref([]);
	const selectType = ref(0);
	const priceName = ref('');
	const energyName = ref('');
	const basicName = ref('');
	const total = ref(0);


	const requst = ()=>{
		listQuery.value = {
			pageNum:1,
			pageSize:10,
			brandId: '',
			minPrice:undefined,
			maxPrice:undefined,
			energyType:undefined,
			segment:undefined,
			province:undefined,
			city:undefined,
		};
		keyword.value=''
		priceName.value = '';
		energyName.value = '';
		basicName.value = '';
		brandName.value = '';
		init();
	};
	const swiperChange = (event) =>{
		currentNum.value = event.current
	}
	// 筛选打开
	const selectOpen = (type) =>{
		selectType.value = type;
		if(type == 1){
			brandSelectRef.value.open();
		}
		
		// 类型、能源、价格
		if(type == 2){
			pickShow.value = true;
			columns.value.push(options3.value);
		}
		if(type == 3){
			pickShow.value = true;
			columns.value.push(options2.value);
		}
		if(type == 4){
			pickShow.value = true;
			columns.value.push(options1.value);
		}
		if(type == 5){
			// showAddressPicker.value = true;
			handleCloseAddressPicker('open');
		}
	};
	const pickClose = ()=>{
		pickShow.value = false;
		columns.value = [];
	};
	const pickConfirm = (event)=>{
		console.log("event", event)
		const { value } = event;
		if(selectType.value == 2){
			basicName.value = value[0].dictLabel;
			listQuery.value.segment = value[0].dictValue;
		}
		if(selectType.value == 3){
			energyName.value = value[0].dictLabel;
			listQuery.value.energyType = value[0].dictValue;
		}
		if(selectType.value == 4){
			priceName.value = value[0].dictLabel;
			const arr = value[0].dictValue.split('-') || [];
			if(arr.length == 2){
				listQuery.value.minPrice = arr[0];
				listQuery.value.maxPrice = arr[1];
			}
			if(arr.length == 1){
				listQuery.value.minPrice = arr[0];
				listQuery.value.maxPrice = 0;
			}
		}
		init();
		pickClose();
	};
	
	const handleCloseAddressPicker = (msg: string) => {
		showAddressPicker.value = false
		 if (msg == 'open') {
			showAddressPicker.value = true;
		}
		console.log("showAddressPicker", showAddressPicker.value)
	};
	const handleSelectAddress = (address) => {
		console.log("address", address)
		const {province,city} = address;

		listQuery.value.province = province;
		listQuery.value.city = city;
		init()
	//   address.value = address
	}
	const brandChange = (event)=>{
		brandName.value = event.brandName;
		listQuery.value.brandId = event.brandId;
		init()
	};
	const searchChange = ()=>{
		init()
	}	
	const init = () => {
		listQuery.value.pageNum = 1;
		getData();
	};
	const getDictList = async ()=>{
		try{
			const res:any = await getDict('old_car_price_range');
			const res2:any = await getDict('energy_type');
			const res3:any = await getDict('segment');
			if(res.code == 200){
				options1.value = res.data;
			}
			if(res2.code == 200){
				options2.value = res2.data;
			}
			if(res3.code == 200){
				options3.value = res3.data;
			}
		}catch{

		}
	};
	const getData = async()=>{
		// let params = {
		// 	pageNum:listQuery.value.pageNum,
		// 	pageSize:listQuery.value.pageSize,
		// 	brandId: listQuery.value.brandId || undefined,
		// 	name: keyword.value || undefined,
		// }
		let params = {...listQuery.value,name: keyword.value || undefined,}
		try{
			let res:any = await listPrOldCarDetail(params)
			if(res.code == 200){
				dataList.value = listQuery.value.pageNum == 1?res.rows:[...dataList.value,...res.rows];
				total.value = res.total;
			}
		}catch{
		}
	}
	onLoad(()=>{
		init();
		getDictList();
	});
	onReachBottom(()=>{
		if(listQuery.value.pageNum * listQuery.value.pageSize < total.value){
			listQuery.value.pageNum++
			getData()
		}
	})
</script>

<style lang="scss" scoped>
	.page-container{
        width: 100%;
        min-height: 100vh;
       background: var(--head-color);
    }
	.card{
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 14rpx;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(138,78,0,0.05);
		
		display: flex;
		justify-content: space-between;
		position: relative;
		.card-icon{
			width: 126rpx;
			height: 40rpx;
			position: absolute;
			left: 24rpx;
			top: 16rpx;
		}
		.card-center{
			width: calc(100% - 172rpx - 30rpx);
			
			.card-name{
				font-weight: 700;
				font-size: 32rpx;
				color: #333333;
				line-height: 46rpx;
			}
			.center-text{
				font-size: 24rpx;
				font-weight: 400;
				color: #A5A5A5;
				padding: 10rpx 0;
			}
			.card-price{
				font-weight: 700;
				font-size: 28rpx;
				color:var(--primary-color);
			}
			
		}
		
	}
	.pageView{
		padding: 30rpx;
		box-sizing: border-box;
	}
	.searchView{
		width: 100%;
		padding: 25rpx 32rpx;
		box-sizing: border-box;
		background: var(--head-color);
	}
	.selectView{
		width: 100%;
		
		display: flex;
		align-items: center;
		justify-content: space-between;
		// padding: 30rpx 0;
		box-sizing: border-box;
		.selectView-H{
			width: calc(100% - 100rpx);
			white-space: nowrap;
			display: flex;
			align-items: center;
		}
		.selectView-right{
			width: 90rpx;
			text-align: center;
			font-size: 28rpx;
			color: #666666;
		}
		.selectView-item{
			display: inline-flex;
			background: #F1EFEC;
			font-size: 24rpx;
			font-weight: 400;
			color: #333333;
			padding: 10rpx 16rpx;
			box-sizing: border-box;
			margin-right: 20rpx;
			border-radius: 50rpx;
			text{
				margin-right: 8rpx;
			}
		}
	}
</style>