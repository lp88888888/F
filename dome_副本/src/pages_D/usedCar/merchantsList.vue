<template>
	<view class="app-container" :data-theme="pageTheme">
		<up-sticky>
			<up-navbar title="门店列表" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>
		</up-sticky>
		<view class="topView">
			<view class="fl-ce-sb">
				<view class="searView">
					<input placeholder="请输入店铺名称" border="none" shape='circle' clearable v-model="keyword"
						@input='selectListFun' class="input"></input>
					<up-icon name="close-circle" size="18" color="#D8D8D8" @click='clearFun' v-if="keyword"></up-icon>
					<view style='heigth:20rpx'></view>
				</view>
				<view class="mapBut" @click="toNav('/pages_D/usedCar/merchantsMapList')">地图</view>
			</view>
			<SelectProp padding="30rpx 10rpx 25rpx 10rpx" @select-address="handleSelectAddress"
				@select-brandname='prCarBrandFun' :bgColor='null' @parentEvent="parentEvent"></SelectProp>
		</view>
		<view class="pageView">
			<DealerList :list="dataList"></DealerList>
			<template v-if="!dataList.length">
				<ser-empty></ser-empty>
			</template>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, computed, defineExpose } from 'vue';
	import { onLoad, onReachBottom } from '@dcloudio/uni-app'
	import { selectList } from '@/api/car';
	import SelectProp from '@/pages_D/newCar/components/SelectProp.vue';
	import DealerList from './components/DealerList.vue';
	import { toNav, toBack } from '@/utils/route';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	import QQMapWX from "../../common/qqmap-wx-jssdk.js"
	import jsonData from '../../../cascaderData.json';
	const isshoww = ref<boolean>(false);
	const currentCity = ref<any>('')
	const lat = ref<any>('')
	const lng = ref<any>('')
	const province = ref<any>('')
	const city = ref<any>('')
	const area = ref<any>('')
	const keyword = ref<any>('')
	const brandName = ref('');
	const brandId = ref('');
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});
	const dataList = ref([]);
	const total = ref(0);
	const listQuery = ref({
		pageNum: 1,
		pageSize: 20,
		typeCode: 2,
	})
	onLoad(() => {
		getUserAddress()
	})

	//获取当前位置 //遍历获取code
	const getUserAddress = () => {
		let objData = uni.getStorageSync('address')
		// 更新显示字段
		lng.value = objData.lng
		lat.value = objData.lat
		currentCity.value = `${objData.province}/${objData.city}`;
		// 从本地 JSON 数据中查找对应的 code
		const provinceInfo = jsonData.find(item => item.name === objData.province);
		if (!provinceInfo) {
			console.warn('未找到匹配的省份:', province);
			return;
		}
		const cityInfo = provinceInfo.city.find(c => c.name === objData.city);
		if (!cityInfo) {
			console.warn('未找到匹配的城市:', city);
			activeProvince.value = provinceInfo.code;
			return;
		}
		init()
	}
	const parentEvent = () => {
		keyword.value = '';
		province.value = '';
		city.value = '';
		area.value = '';
		brandId.value = '';
		init()
	}
	const clearFun = () => {
		listQuery.value.pageNum = 1;
		keyword.value = '';
		selectListFun();
	}
	const init = () => {
		listQuery.value.pageNum = 1;
		selectListFun();
	}

	const selectListFun = async () => {
		let params = {
			...listQuery.value,
			name: keyword.value,
			longitude: lng.value,
			latitude: lat.value,
			province: province.value,
			city: city.value,
			area: area.value,
			prIndustryCarBrandId: brandId.value
		}
		const res = await selectList(params);
		dataList.value = res.rows
	}
	// 关闭选址
	const close = () => {
		isshoww.value = false
	}
	const handleParentMethod = (val : any) => {
		isshoww.value = val
	}
	interface Address {
		province : string
		city : string
		district : string
		code : string
	}
	const selected = reactive({
		province: '',
		city: '',
		district: '',
		code: ''
	})
	const fullAddress = computed(() =>
		[selected.province, selected.city, selected.district].filter(Boolean).join('/')
	)

	const handleSelectAddress = (addr : Address) => {
		Object.assign(selected, addr)
		province.value = addr.province
		city.value = addr.city
		area.value = addr.district
		init()
	}
	const prCarBrandFun = (value : string) => {
		brandId.value = value.brandId
		init()
	}
	onReachBottom(() => {
		if (listQuery.value.pageNum * listQuery.value.pageSize < total.value) {
			listQuery.value.pageNum++
			selectListFun()
		}
	})
</script>

<style lang="scss">
	.mapBut {
		background: var(--primary-color);
		color: #FFFFFF;
		font-size: 26rpx;
		display: inline-block;
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
		margin-left: 20rpx;
	}

	.topView {
		position: sticky;
		top: 0;
		z-index: 10;
		padding: 10rpx 32rpx 10rpx 32rpx;
		box-sizing: border-box;
		// background: #FFFFFF;
	}

	.pageView {
		flex: 1;
		/* 占据剩余全部空间 */
		overflow-y: auto;
		/* 内容超出时显示垂直滚动条 */
		padding: 24rpx 32rpx;
		box-sizing: border-box;
	}

	.addressBox {
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, .5);
		position: fixed;
		top: 0;
		z-index: 999;

		.addressBox-pr {
			width: 100%;
			position: fixed;
			bottom: 110rpx;
		}
	}

	.topSele {
		padding: 30rpx 10rpx 25rpx 10rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;

		.topSele-item {
			height: 56rpx;
			background: #F0F0F0;
			border-radius: 28rpx 28rpx 28rpx 28rpx;
			margin-right: 24rpx;
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			box-sizing: border-box;
			font-weight: 400;
			font-size: 28rpx;
			color: #666666;

			text {
				margin-right: 10rpx;
			}
		}
	}

	.sl {
		width: 300rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}

	.searView {
		width: 560rpx;
		height: 65rpx;
		border: 2rpx solid #EBEBEB;
		display: flex;
		align-items: center;
		padding: 20rpx;
		box-sizing: border-box;
		justify-content: space-between;
		border-radius: 40rpx;
		background-color: #F5F5F5;
	}

	.app-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
		background: var(--head-color);
	}
	.input{
		width: 440rpx; 
	}
</style>