<template>
	<view class="container">
		<view class="address-select-page">
			<!-- 搜索框 -->
			<view class="search-bar">
				<u-search v-model="searchKeyword" placeholder="输入城市名进行搜索" :showAction="false" bgColor="#f5f5f5"
					@change="handleSearch" @clear="clearSearch"></u-search>
			</view>
			<!-- 搜索结果展示区 -->
			<view class="search-result" v-if="searchResults.length > 0 && searchKeyword.trim()">
				<view v-for="item in searchResults" :key="item.code" 
					class="search-result-item" @click="selectSearchResult(item)">
					{{ item.fullName }}
					<uni-icons type="checkmarkempty" color="#FF5000" size="16" />
				</view>
			</view>
			<!-- 地区选择器（搜索为空时显示） -->
			<view class="region-selector" v-else>
				<!-- 省份 -->
				<scroll-view scroll-y class="province-list" style="height: 70vh;">
					<view v-for="province in provinces" :key="province.code"
						:class="['province-item', activeProvince === province.code && 'active']"
						@click="selectProvince(province)">
						{{ province.name }}
						<uni-icons v-if="activeProvince === province.code" type="checkmarkempty" color="#FF5000"
							size="16" />
					</view>
				</scroll-view>

				<!-- 城市 -->
				<scroll-view scroll-y class="city-list" style="height:70vh;" v-if="activeProvince">
					<view v-for="city in currentCities" :key="city.code"
						:class="['city-item', activeCity === city.code && 'active']" @click="selectCity(city)">
						{{ city.name }}
						<uni-icons v-if="activeCity === city.code" type="checkmarkempty" color="#FF5000" size="16" />
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import jsonData from '../../../../cascaderData.json';
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useCommonStore } from '@/store/modules/common';
import QQMapWX from "../../../common/qqmap-wx-jssdk.js";
const commonState = useCommonStore();
const qqmapsdk = new QQMapWX({
	key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB'
});
onLoad(()=>{
	commonState.clearPopAddress()
})
onMounted(() => {
	activeProvince.value = commonState.selectPopAddress.provinceCode;
	activeCity.value = commonState.selectPopAddress.code;
	provinces.value = jsonData;
	if(activeProvince.value) {
		cities.value = jsonData.find(item => item.code === activeProvince.value)?.city || [];
	}
});

const props = defineProps<{
	onCallParent: (msg: string) => void;
	type: '';
}>();

// 地区数据类型
interface Region {
	code: string;
	name: string;
	city?: Region[];
	area?: Region[];
}

// 搜索结果类型，新增fullName用于显示完整地址
interface SearchResult extends Region {
	fullName: string;
	type: 'province' | 'city';
}

// 响应式数据
const searchKeyword = ref('');
const activeProvince = ref('');
const activeCity = ref('');
const activeDistrict = ref('');
const provinces = ref<Region[]>([]);
const cities = ref<Region[]>([]);
const districts = ref<Region[]>([]);
// 新增：存储搜索结果
const searchResults = ref<SearchResult[]>([]);

interface Address {
	province: string;
	city: string;
	district?: string;
	provinceCode: string;
	cityCode: string;
	districtCode?: string;
}

const emit = defineEmits<{
	(e: 'select-address', address: Address): void;
}>();

// 计算当前显示的城市列表
const currentCities = computed(() => {
	console.log("--------------",cities.value)
	if (!activeProvince.value || !cities.value.length) return [];
	return cities.value.filter(city => city.code.startsWith(activeProvince.value.substring(0, 2)));
});

// 选择省份
const selectProvince = (province: Region) => {
	activeProvince.value = province.code;
	activeCity.value = '';
	activeDistrict.value = '';
	cities.value = province.city || [];
	districts.value = [];
};

// 选择城市
const selectCity = (city: Region) => {
	activeCity.value = city.code;
	activeDistrict.value = '';
	districts.value = city.area || [];
	const province = provinces.value.find(p => p.code === activeProvince.value);
	
	commonState.selectPopAddress = {
		province: province?.name || '',
		city:city?.name || '',
		district: '',
		code:city?.code || '',
		districtCode:'',
		provinceCode:province?.code || '',
	}
	emit('select-address', {
		province: province?.name || '',
		city: city?.name || '',
		provinceCode: province?.code || '',
		cityCode: city.code,
	});
	props.onCallParent(false);
};

// 完善：处理搜索逻辑
const handleSearch = (e: any) => {
    // 兼容不同的事件参数格式
    const keyword = typeof e === 'string' ? e : (e.value || e.detail?.value || '');
    const trimmedKeyword = keyword.trim().toLowerCase();
    
    searchResults.value = [];
    
    if (!trimmedKeyword) {
        return;
    }

    // 1. 匹配省份
    provinces.value.forEach(province => {
        if (province.name.toLowerCase().includes(trimmedKeyword)) {
            searchResults.value.push({
                ...province,
                fullName: province.name,
                type: 'province'
            });
        }

        // 2. 匹配该省份下的城市
        province.city?.forEach(city => {
            if (city.name.toLowerCase().includes(trimmedKeyword)) {
                searchResults.value.push({
                    ...city,
                    fullName: `${province.name} - ${city.name}`,
                    type: 'city'
                });
            }
        });
    });

    // 去重（避免重复结果）
    searchResults.value = Array.from(new Map(searchResults.value.map(item => [item.code, item])).values());
};

// 新增：清空搜索
const clearSearch = () => {
	searchKeyword.value = '';
	searchResults.value = [];
};

// 新增：选择搜索结果
const selectSearchResult = (item: SearchResult) => {
	if (item.type === 'province') {
		// 选中的是省份
		selectProvince(item);
	} else if (item.type === 'city') {
		// 选中的是城市，先找到对应的省份
		const targetProvince = provinces.value.find(prov => 
			item.code.startsWith(prov.code.substring(0, 2))
		);
		if (targetProvince) {
			selectProvince(targetProvince);
			// 延迟执行确保cities已更新
			setTimeout(() => {
				const targetCity = cities.value.find(city => city.code === item.code);
				if (targetCity) selectCity(targetCity);
			}, 50);
		}
	}
	// 选中后清空搜索
	clearSearch();
};

const open = () => {
	console.log("open610000");
	activeProvince.value = '610000';
	activeCity.value = '';
};

const updateData = () => {
	console.log("--updateData----");
	provinces.value = jsonData;
};

const setInitialValue = (provinceCode: string, cityCode: string) => {
	console.log(provinceCode);
	activeProvince.value = provinceCode;
	activeCity.value = cityCode;
	const province = provinces.value.find(p => p.code === provinceCode);
	if (province) {
		cities.value = province.city || [];
	}
};

defineExpose({
	open,
	activeProvince,
	activeCity,
	setInitialValue
});
</script>

<style lang="scss" scoped>
.address-select-page {
	background-color: #f5f5f5;
	height: 70vh;
	border-top-right-radius: 20px;
	border-top-left-radius: 20px;

	.search-bar {
		padding: 30rpx 30rpx 15rpx;
		background-color: #fff;
		position: sticky;
		top: 0;
		z-index: 10;
		border-top-right-radius: 20px;
		border-top-left-radius: 20px;
	}

	// 新增：搜索结果样式
	.search-result {
		background-color: #fff;
		padding: 15rpx 30rpx;
		max-height: 70vh;
		overflow-y: auto;
	}

	.search-result-item {
		padding: 25rpx 0;
		font-size: 28rpx;
		color: #333;
		border-bottom: 1rpx solid #f5f5f5;
		display: flex;
		justify-content: space-between;
		align-items: center;
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
				border-bottom: 1rpx solid #f5f5f5;

				&.active {
					color: #FF5000;
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