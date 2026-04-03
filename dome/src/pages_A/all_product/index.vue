<template>
	<view class="page-container">
		<!-- 顶部区域 -->
		<u-sticky bgColor="transparent" z-index="99">
			<view class="container-bg">
				<up-navbar title="全部商品" bgColor="transparent" @leftClick="toBack" placeholder :fixed="false" :titleStyle="{fontWeight: 'bold'}"></up-navbar>
				<view class="options p-lr-32 flex just-sb">
					<view class="flex ali-cen" @click="tabClick(1)">
						<text>销量优先</text>
						<up-icon :name="`${imgUrl}static/${listQuery.saleNumSort===1?'sort-ascend-icon':listQuery.saleNumSort===0?'sort-descend-icon':'sort-icon'}.png`" size="14"></up-icon>
					</view>
					<view class="flex ali-cen" @click="tabClick(2)">
						<text>{{categoryName}}</text>
						<up-icon name="arrow-down-fill" size="12"></up-icon>
					</view>
					<view class="flex ali-cen" @click="tabClick(3)">
						<text>积分</text>
						<up-icon :name="`${imgUrl}static/${listQuery.priceFeeSort==1?'sort-ascend-icon':listQuery.priceFeeSort===0?'sort-descend-icon':'sort-icon'}.png`" size="14"></up-icon>
					</view>
					<view class="line"></view>
					<view class="flex ali-cen"  @click="tabClick(4)">
						<up-icon :name="imgUrl+`${listQuery.redeemable==1?'bindetc-truth.png':'car_normal1.png'}`" size="12"></up-icon>
						<text class="colff9 m-l-15">可兑换</text>
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="content p-lr-32">
			<!-- <ProductList title="热门商品" :grid="true" :products="productList" @item-click="handleProductClick" /> -->
			<ProductList title="热门商品" :grid="true" :products="productList" @item-click="handleProductClick" />
			<ser-empty v-if="!productList.length"></ser-empty>
		</view>
		<u-picker :show="dealerShow" :columns="columns" keyName="dictLabel" :confirmColor="themeStore.themeColors.$primaryColor" @close="prickClose" @cancel="prickClose" @confirm="prickConfirm" ></u-picker>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { toNav,toBack } from '@/utils/route';
	import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app'
	import { imgUrl } from '@/config';
	import ProductList from '@/components/integrate/ProductList.vue';
	import {  listPrShopSpu,getShopCarProdCount} from '@/api/points';
	import { getDict } from '@/api/config';
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const dealerShow = ref(false);
	const columns = ref([]);
	const sales = ref(0); // 0-默认，1降序，2-升序
	const points = ref(0); // 0-默认，1降序，2-升序
	type ProductItem = {
		id : number;
		name : string;
		image : string;
		price : number;
		stock : number;
		requiredPoints : number;
		category ?: string;
	};
	const productList = ref([]);
	const listQuery = ref({
		pageNum:1,
		pageSize:10,
		shopType:1,
		redeemable:undefined, //0：全部 1：可兑换
		categoryId:9999,
		priceFeeSort:undefined, //0：倒序 1：顺序
		saleNumSort:undefined, //0：倒序 1：顺序
	});
	const categoryName = ref('全部');
	const total = ref<number>(0);
	const loading = ref(false);
	const finished = ref(false);
	const page = ref(1);
	const pageSize = ref(10);
	const labelList = ref([]);
	const prickClose = ()=>{
		dealerShow.value = false;
	};
	const prickConfirm = (event)=>{
		const {value} = event;
		listQuery.value.categoryId = value[0].dictValue;
		categoryName.value = value[0].dictLabel;
		prickClose();
		init();
	};
	const handleProductClick = (product) => {
		uni.navigateTo({
			url: `/pages_A/points/details?spuId=${product.spuId}`
		});
	};
	const tabClick = (type)=>{
		switch(type){
			case 1:
				listQuery.value.saleNumSort = listQuery.value.saleNumSort == 1?0:1;
				listQuery.value.priceFeeSort = undefined;
				init();
			break;
			case 2:
				dealerShow.value = true;
			break;
			case 3:
				listQuery.value.priceFeeSort = listQuery.value.priceFeeSort == 1?0:1;
				listQuery.value.saleNumSort = undefined;
				init();
			break;
			case 4:
				listQuery.value.redeemable = listQuery.value. redeemable== 1?undefined:1;
				init();
			break;
			default:
			break;
		}
	}
	const init = ()=>{
		listQuery.value.pageNum = 1;
		getData();
	}
	// 获取商品列表
	const getData = async ()=>{
		let params = {...listQuery.value,categoryId:listQuery.value.categoryId === 9999?undefined:listQuery.value.categoryId}
		const res = await listPrShopSpu(params);
		if(res.code == 200){
			productList.value = listQuery.value.pageNum == 1?res.rows:[...productList.value,...res.rows];
			total.value = Number(res.total)
		}else{

		}
	}
	// 获取标签列表getDictList
	const getDictData = async ()=>{
		const res = await getDict('shop_category')
		if(res.code == 200 && res.data.length){
			let arr = [{dictValue:9999,dictLabel:'全部'},...res.data]
			columns.value.push(arr);
		}
	}

	onReachBottom(()=>{
		if(listQuery.value.pageNum*listQuery.value.pageSize<total.value){
			listQuery.value.pageNum++;
			getData();
		}
	})

	onLoad(()=>{
		init();
		getDictData();

	})
</script>

<style scoped lang="scss">
	.page-container{
		min-height: 100vh;
		background: #F1EFEC;
	}
	.container-bg {
		width: 750rpx;
		// height: 263rpx;
		padding-bottom: 20rpx;
		background:$bgTopColor;
	}
	.line {
		width: 1rpx;
		height: 36rpx;
		background: #E6E6E6;
	}
	
	.content {
		
	}
</style>