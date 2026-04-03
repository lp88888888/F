<template>
	<view class="container">
			<up-navbar title="选择城市" @leftClick="toBack" placeholder fixed :titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<view class="address-select-page" :style="{ paddingTop:'0' }">
			<!-- 搜索框 -->
			<view class="search-bar">
				<u-search v-model="searchKeyword" placeholder="输入省份、城市或区县进行搜索" :showAction="false" bgColor="#f5f5f5"
					@change="handleSearch" @clear="clearSearch"></u-search>
			</view>
			<!-- 搜索结果 -->
			<view v-if="showSearchResults" class="search-results">
				<view v-if="searchResults.length > 0" class="results-container">
					<view class="search-title">搜索结果</view>
					<scroll-view scroll-y class="results-list" :style="{ height: searchResultsHeight }">
						<view v-for="result in searchResults" :key="result.fullCode || result.code" 
							class="result-item" @click="handleSearchResultSelect(result)">
							<text class="result-text">{{ result.fullName || result.name }}</text>
							<uni-icons v-if="result.selected" type="checkmarkempty" color="#FF5000" size="16" />
						</view>
					</scroll-view>
				</view>
				<view v-else class="no-results">
					<text class="no-result-text">未找到相关地区</text>
				</view>
			</view>

			<!-- 当前定位 -->
			<view class="current-location" v-if="currentCity && !showSearchResults">
				<text class="title">当前位置</text>
				<view class="city-tag" @click="currentlocation()">
					<text>{{currentCity}}</text>
				</view>
			</view>

			<!-- 地区选择器（仅在不显示搜索结果时显示） -->
			<view class="region-selector" v-if="!showSearchResults">
				<!-- 省份 -->
				<scroll-view scroll-y class="province-list" :style="{height: scrollHeight}">
					<view v-for="province in provinces" :key="province.code"
						:class="['province-item', activeProvince === province.code && 'active']"
						@click="selectProvince(province)">
						{{ province.name }}
						<uni-icons v-if="activeProvince === province.code" type="checkmarkempty" color="#FF5000"
							size="16" />
					</view>
					<view style="height: 180rpx;"></view>
				</scroll-view>

				<!-- 城市 -->
				<scroll-view scroll-y class="city-list" :style="{height: scrollHeight}" v-if="activeProvince">
					<view v-for="city in currentCities" :key="city.code"
						:class="['city-item', activeCity === city.code && 'active']" @click="selectCity(city)">
						{{ city.name }}
						<uni-icons v-if="activeCity === city.code" type="checkmarkempty" color="#FF5000" size="16" />
					</view>
					<view style="height: 180rpx;"></view>
				</scroll-view>

				<!-- 区县 -->
				<scroll-view scroll-y class="district-list" :style="{height: scrollHeight}" v-if="activeCity">
					<view v-for="district in currentDistricts" :key="district.code"
						:class="['district-item', activeDistrict === district.code && 'active']"
						@click="selectDistrict(district)">
						{{ district.name }}
						<uni-icons v-if="activeDistrict === district.code" type="checkmarkempty" color="#FF5000"
							size="16" />
					</view>
					<view style="height: 180rpx;"></view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	// import jsonData from '../../../cascaderDatas.json';
	import { ref, computed, onMounted } from 'vue'
	import {toBack} from '@/utils/route';
	import { onLoad, onShow } from '@dcloudio/uni-app'
	
	import CosHeader from '@/components/customNavBar/index.vue';
	import { useAppStore } from '@/store/modules/app';
	const appStore = useAppStore();
	const jsonData = appStore.cascaderDatas
	
	// 主题 使用 （主题颜色 var( --theme-color)）（组件 componentColor.$pageBgColor） 图标地址（icoUrl）
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = ref(themeStore.imgUrl);
	
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	
	onMounted(() => {
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight+44;
	});

	interface Region {
		code: string
		name: string
		city?: Region[]
		area?: Region[]
	}

	interface SearchResult {
		type: 'province' | 'city' | 'district'
		code: string
		name: string
		fullCode: string
		fullName: string
		provinceCode?: string
		provinceName?: string
		cityCode?: string
		cityName?: string
		selected?: boolean
	}

	const scrollHeight = ref('0px')
	const searchResultsHeight = ref('0px')
	const currentCity = ref('')
	const searchKeyword = ref('')
	const activeProvince = ref('')
	const activeCity = ref('')
	const activeDistrict = ref('')
	
	// 搜索结果相关
	const searchResults = ref<SearchResult[]>([])
	const showSearchResults = ref(false)

	// 地区数据
	const provinces = ref<Region[]>([])
	const cities = ref<Region[]>([])
	const districts = ref<Region[]>([])

	const city= ref<string>('')
	const cityCode= ref<string>('')
	const province= ref<string>('')
	const provinceCode= ref<string>('')
	const district= ref<string>('')
	const districtCode= ref<string>('')

	// 计算当前显示的城市列表
	const currentCities = computed(() => {
		if (!activeProvince.value || !cities.value.length) return [];
		return cities.value.filter(city => city.code.startsWith(activeProvince.value.substring(0, 2)));
	})

	// 计算当前显示的区县列表
	const currentDistricts = computed(() => {
		if (!activeCity.value) return []
		return districts.value.filter(district => district.code.startsWith(activeCity.value.substring(0, 4)))
	})

	const currentlocation = () => {
		const selectedAddress = {
			province: province.value,
			provinceCode: provinceCode.value,
			city: city.value,
			cityCode: cityCode.value,
			district: district.value,
			districtCode: districtCode.value,
			code:districtCode.value
		};
	
		saveSelectedAddress(selectedAddress);
		
		const pages = getCurrentPages();
		const prevPage = pages[pages.length - 2];
		
		if (prevPage) {
			prevPage.$vm.setSelectedAddress && prevPage.$vm.setSelectedAddress(selectedAddress);
		}
		uni.navigateBack();
	};

	// 选择省份
	const selectProvince = (province: Region) => {
		activeProvince.value = province.code;
		activeCity.value = '';
		activeDistrict.value = '';
		cities.value = province.city || [];
		districts.value = [];
	}

	// 选择城市
	const selectCity = (city: Region) => {
		activeCity.value = city.code;
		activeDistrict.value = '';
		districts.value = city.area || [];
		if(city.area.length==0){
			const selectedAddress = {
				province: province?.name || '',
				city: city?.name || '',
				district: district?.name || '',
				code: district.code,
				provinceCode: activeProvince.value,
				cityCode: activeCity.value,
				districtCode: district?.code || '',
				
			}
			saveSelectedAddress(selectedAddress);
			const pages = getCurrentPages()
			const prevPage = pages[pages.length - 2]
			if (prevPage) {
				prevPage.$vm.setSelectedAddress && prevPage.$vm.setSelectedAddress(selectedAddress)
			}
			uni.navigateBack()
			
		}
	}
	
	// 选择区县
	const selectDistrict = (district: Region) => {
		activeDistrict.value = district.code
		const province = provinces.value.find(p => p.code === activeProvince.value)
		const city = cities.value.find(c => c.code === activeCity.value)

		const selectedAddress = {
			province: province?.name || '',
			city: city?.name || '',
			district: district.name,
			code: district.code,
			provinceCode: activeProvince.value,
			cityCode: activeCity.value,
			districtCode: district.code,
		}
		saveSelectedAddress(selectedAddress);
		
		const pages = getCurrentPages()
		const prevPage = pages[pages.length - 2]
		if (prevPage) {
			prevPage.$vm.setSelectedAddress && prevPage.$vm.setSelectedAddress(selectedAddress)
		}
		// #ifdef APP
		  uni.setStorageSync('appaddress', selectedAddress)
		// #endif
		uni.navigateBack()
	}

	// 保存选中地址
	const saveSelectedAddress = (address: any) => {
		console.log('-0900-====',address);
		uni.setStorageSync('selectedAddress', address);
	};

	// 处理搜索
	const handleSearch = (e: any) => {
		const keyword = e.value || searchKeyword.value;
		if (!keyword.trim()) {
			clearSearch();
			return;
		}
		
		searchKeyword.value = keyword;
		showSearchResults.value = true;
		
		// 执行搜索
		performSearch(keyword);
	}

	// 执行搜索逻辑 - 修复版本
	const performSearch = (keyword: string) => {
		const results: SearchResult[] = [];
		
		// 遍历所有省份
		provinces.value.forEach(province => {
			// 搜索省份 - 使用更灵活的匹配方式
			if (province.name && province.name.includes(keyword)) {
				results.push({
					type: 'province',
					code: province.code,
					name: province.name,
					fullCode: province.code,
					fullName: province.name,
					selected: province.code === activeProvince.value
				});
			}
			
			// 搜索城市
			if (province.city && Array.isArray(province.city)) {
				province.city.forEach(city => {
					if (city.name && city.name.includes(keyword)) {
						results.push({
							type: 'city',
							code: city.code,
							name: city.name,
							fullCode: `${province.code}|${city.code}`,
							fullName: `${province.name} ${city.name}`,
							provinceCode: province.code,
							provinceName: province.name,
							cityCode: city.code,
							cityName: city.name,
							selected: city.code === activeCity.value
						});
					}
					
					// 搜索区县
					if (city.area && Array.isArray(city.area)) {
						city.area.forEach(district => {
							if (district.name && district.name.includes(keyword)) {
								results.push({
									type: 'district',
									code: district.code,
									name: district.name,
									fullCode: `${province.code}|${city.code}|${district.code}`,
									fullName: `${province.name} ${city.name} ${district.name}`,
									provinceCode: province.code,
									provinceName: province.name,
									cityCode: city.code,
									cityName: city.name,
									selected: district.code === activeDistrict.value
								});
							}
						});
					}
				});
			}
		});
		
		searchResults.value = results;
		
		// 如果没有结果，显示提示
		if (results.length === 0) {
			console.log('未找到匹配的地区');
		}
	}

	// 清除搜索
	const clearSearch = () => {
		searchKeyword.value = '';
		searchResults.value = [];
		showSearchResults.value = false;
	}

	// 处理搜索结果选择
	const handleSearchResultSelect = (result: SearchResult) => {
		clearSearch();
		
		if (result.type === 'province') {
			// 选中省份
			const province = provinces.value.find(p => p.code === result.code);
			if (province) {
				selectProvince(province);
			}
		} else if (result.type === 'city') {
			// 选中城市
			const province = provinces.value.find(p => p.code === result.provinceCode);
			if (province) {
				selectProvince(province);
				// 使用setTimeout确保cities数组已更新
				setTimeout(() => {
					const city = cities.value.find(c => c.code === result.code);
					if (city) {
						selectCity(city);
					}
				}, 100);
			}
		} else if (result.type === 'district') {
			// 选中区县
			const province = provinces.value.find(p => p.code === result.provinceCode);
			if (province) {
				selectProvince(province);
				setTimeout(() => {
					const city = cities.value.find(c => c.code === result.cityCode);
					if (city) {
						selectCity(city);
						setTimeout(() => {
							const district = districts.value.find(d => d.code === result.code);
							if (district) {
								selectDistrict(district);
							}
						}, 100);
					}
				}, 100);
			}
		}
	}

	// 优化搜索 - 支持模糊搜索
	const enhancedSearch = (keyword: string) => {
		const results: SearchResult[] = [];
		const lowerKeyword = keyword.toLowerCase();
		
		// 深度遍历函数
		const traverseRegions = (provinceData: Region) => {
			// 检查省份
			if (provinceData.name && provinceData.name.toLowerCase().includes(lowerKeyword)) {
				results.push({
					type: 'province',
					code: provinceData.code,
					name: provinceData.name,
					fullCode: provinceData.code,
					fullName: provinceData.name,
					selected: provinceData.code === activeProvince.value
				});
			}
			
			// 检查城市
			if (provinceData.city) {
				provinceData.city.forEach(cityData => {
					if (cityData.name && cityData.name.toLowerCase().includes(lowerKeyword)) {
						results.push({
							type: 'city',
							code: cityData.code,
							name: cityData.name,
							fullCode: `${provinceData.code}|${cityData.code}`,
							fullName: `${provinceData.name} ${cityData.name}`,
							provinceCode: provinceData.code,
							provinceName: provinceData.name,
							cityCode: cityData.code,
							cityName: cityData.name,
							selected: cityData.code === activeCity.value
						});
					}
					
					// 检查区县
					if (cityData.area) {
						cityData.area.forEach(districtData => {
							if (districtData.name && districtData.name.toLowerCase().includes(lowerKeyword)) {
								results.push({
									type: 'district',
									code: districtData.code,
									name: districtData.name,
									fullCode: `${provinceData.code}|${cityData.code}|${districtData.code}`,
									fullName: `${provinceData.name} ${cityData.name} ${districtData.name}`,
									provinceCode: provinceData.code,
									provinceName: provinceData.name,
									cityCode: cityData.code,
									cityName: cityData.name,
									selected: districtData.code === activeDistrict.value
								});
							}
						});
					}
				});
			}
		};
		
		// 遍历所有省份
		provinces.value.forEach(traverseRegions);
		
		// 如果没有结果，尝试使用开头匹配
		if (results.length === 0) {
			provinces.value.forEach(provinceData => {
				// 检查省份开头
				if (provinceData.name && provinceData.name.startsWith(keyword)) {
					results.push({
						type: 'province',
						code: provinceData.code,
						name: provinceData.name,
						fullCode: provinceData.code,
						fullName: provinceData.name,
						selected: provinceData.code === activeProvince.value
					});
				}
			});
		}
		
		return results;
	}

	const getUserAddress = () => {
		let objData = uni.getStorageSync('address')
		console.log('-0-0-0-00-0-',objData);
		currentCity.value = objData.province + '/' + objData.city + '/' + objData.district
		city.value= objData.city
		cityCode.value= objData.cityCode
		province.value= objData.province
		provinceCode.value= objData.provinceCode
		district.value= objData.district
		districtCode.value= objData.districtCode
	}

	// 计算滚动区域高度
	const calculateScrollHeight = () => {
		const systemInfo = uni.getSystemInfoSync()
		scrollHeight.value = `${systemInfo.windowHeight - 100}px`
		searchResultsHeight.value = `${systemInfo.windowHeight - 150}px`
	}

	onLoad(() => {
		calculateScrollHeight();
		getUserAddress();
		// 确保数据在onLoad中加载
		provinces.value = jsonData;
		console.log('省份数据加载完成，数量:', provinces.value.length);
		
		// 测试搜索
		if (provinces.value && provinces.value.length > 0) {
			console.log('第一个省份:', provinces.value[0].name);
		}
	});
	
	onShow(() => {
		// 如果provinces还没有数据，重新加载
		if (!provinces.value || provinces.value.length === 0) {
			provinces.value = jsonData;
		}
		
		const saved = uni.getStorageSync('selectedAddress');
		if (saved && saved.provinceCode) {
			activeProvince.value = saved.provinceCode;
			const provinceData = provinces.value.find(p => p.code === saved.provinceCode);
			if (provinceData) {
				cities.value = provinceData.city || [];
			}

			if (saved.cityCode) {
				activeCity.value = saved.cityCode;
				const cityData = cities.value.find(c => c.code === saved.cityCode);
				if (cityData) {
					districts.value = cityData.area || [];
				}

				if (saved.districtCode) {
					activeDistrict.value = saved.districtCode;
				}
			}
		}
	});
</script>

<style lang="scss" scoped>
	.container{
		height: 100vh;
		overflow: hidden;
	}
	.address-select-page {
		background-color: #f5f5f5;
		min-height: 100vh;

		.search-bar {
			padding: 15rpx 30rpx;
			background-color: #fff;
			position: sticky;
			top: 0;
			z-index: 10;
		}

		.search-results {
			background-color: #fff;
			
			.results-container {
				.search-title {
					padding: 20rpx 30rpx;
					font-size: 28rpx;
					color: #999;
					border-bottom: 1rpx solid #f5f5f5;
				}
				
				.results-list {
					.result-item {
						padding: 25rpx 30rpx;
						font-size: 28rpx;
						color: #333;
						display: flex;
						justify-content: space-between;
						align-items: center;
						border-bottom: 1rpx solid #f5f5f5;
						
						&:active {
							background-color: #f9f9f9;
						}
						
						.result-text {
							flex: 1;
						}
					}
				}
			}
			
			.no-results {
				padding: 40rpx 30rpx;
				text-align: center;
				
				.no-result-text {
					font-size: 28rpx;
					color: #999;
				}
			}
		}

		.current-location {
			padding: 20rpx 30rpx;
			background-color: #fff;
			margin-bottom: 20rpx;
			display: flex;
			align-items: center;

			.title {
				font-size: 28rpx;
				color: #999;
				margin-right: 30rpx;
			}

			.city-tag {
				:deep(.uni-tag) {
					background-color: #fff;
					border: 1rpx solid $color;
					color: $color;
				}
			}
		}

		.region-selector {
			display: flex;
			background-color: #fff;

			.province-list,
			.city-list,
			.district-list {
				flex: 1;
				height: 100%;

				.province-item,
				.city-item,
				.district-item {
					padding: 25rpx 30rpx;
					font-size: 28rpx;
					color: #333;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1rpx solid $pageBgColor;

					&.active {
						color: $color;
						background-color: #FFF9F7;
					}
				}
			}

			.province-list {
				background-color: #f9f9f9;
			}
		}
	}
</style>