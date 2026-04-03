<template>
	<view class="app-container" :data-theme="pageTheme" >
		<view class="topView">
			<!-- <CarSearch placeholder="请输入经销商名称/地址"></CarSearch> -->
			<view class="searView">
				<input placeholder="请输入经销商名称" border="none" v-model="keyword" @input='selectListFun' class="inputbox"></input>
				<up-icon name="search" size="22" color="#D8D8D8"></up-icon>
				<view style='heigth:20rpx'></view>
			</view>
			<SelectProp padding="30rpx 10rpx 25rpx 10rpx" @select-address="handleSelectAddress"
				@select-brandname='prCarBrandFun' @parentEvent="parentEvent"></SelectProp>
		</view>
		<view class="pageView">
			<DealerList :list="dataList"></DealerList>
			<template v-if="!dataList.length">
				<ser-empty></ser-empty>
			</template>
		</view>
		<PageDurationTracker pageName="4s店" type='count'/>
	</view>
</template>
<script setup lang="ts">
	import { ref, computed, defineExpose } from 'vue';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { selectList } from '@/api/car';
	import SelectProp from './components/SelectProp.vue';
	import CarSearch from './components/CarSearch.vue';
	import DealerList from './components/DealerList.vue';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	import type { ComponentPublicInstance } from "vue";
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
	const provinces=ref<any>('');
	const cityes = ref<any>('')
	const citys = ref<any>('')
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});
	const dataList = ref([])
	onLoad(() => {
		getUserAddress()
	})
	// 重置
	const parentEvent = ()=>{
		keyword.value = '';
		selectListFun();
	}
	//获取当前位置 //遍历获取code
	const getUserAddress = () => {
		lng.value = uni.getStorageSync('address').lng
		lat.value = uni.getStorageSync('address').lat
		const { province, city, district } = uni.getStorageSync('address');
		// 更新显示字段
		currentCity.value = `${province}/${city}/${district}`;
		// 从本地 JSON 数据中查找对应的 code
		const provinceInfo = jsonData.find(item => item.name === province);
		if (!provinceInfo) {
			console.warn('未找到匹配的省份:', province);
			return;
		}
		const cityInfo = provinceInfo.city.find(c => c.name === city);
		if (!cityInfo) {
			console.warn('未找到匹配的城市:', city);
			activeProvince.value = provinceInfo.code;
			return;
		}
		 provinces.value=province
		 citys.value=city
		selectListFun()
	}

	const selectListFun = async () => {
		
		console.log(cityes.value,999999999999999999)
		let params = {
			pageNum: 1,
			pageSize: 99,
			name: keyword.value,
			longitude: lng.value,
			latitude: lat.value,
			province: province.value?province.value:provinces.value,
			city: cityes.value?cityes.value:city.value,
			area: area.value,
			prIndustryCarBrandId: brandId.value,
			typeCode:'1'
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
		console.log("selected", selected)
		Object.assign(selected, addr)
		province.value = addr.province
		city.value = addr.city
		cityes.value = addr.city
		area.value = addr.district
		selectListFun()
	}
	const prCarBrandFun = (value : string) => {
		console.log(city.value,11111111111)
		brandId.value = value.brandId
		province.value = value.province
		cityes.value = value.city
		area.value = value.district
		selectListFun()
	}
</script>

<style lang="scss">
	.topView {
		position: sticky;
		top: 0;
		z-index: 10;
		padding: 10rpx 32rpx 10rpx 32rpx;
		box-sizing: border-box;
		background: #FFFFFF;
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
            max-width: 270rpx;
			text {
				margin-right: 10rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				text-overflow: ellipsis;
				overflow: hidden;
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
		width: 95%;
		height: 72rpx;
		background: #FCFCFC;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #EBEBEB;
		display: flex;
		align-items: center;
		padding: 20rpx 10rpx;
		box-sizing: border-box;
		margin: 0 auto 20rpx;
	}

	.app-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
		background: var(--head-color);
	}
	.inputbox{
		width: 100%;
	}
</style>