<template>
	<view class="app-container" :data-theme="pageTheme"  >
		<view class="topView">
            <view class="fl-ce-sb">
                <view class="searView">
                    <up-input placeholder="请输入店铺名称" border="none" v-model="keyword" @change='selectListFun'></up-input>
                    <up-icon name="search" size="22" color="#D8D8D8"></up-icon>
                    <view style='heigth:20rpx'></view>
                </view>
                <!-- <view class="mapBut">地图</view> -->
            </view>
			<SelectProp padding="30rpx 10rpx 25rpx 10rpx" @select-address="handleSelectAddress"
				@select-brandname='prCarBrandFun' @parentEvent="parentEvent"></SelectProp>
		</view>
		<map v-if="lat" :latitude="lat" :longitude="lng" :markers="markers" @markertap="handleMarkerTap"
			:scale="scale" class="map"></map>
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
	import { onShow ,onReachBottom} from '@dcloudio/uni-app';
	import { toNav, toBack } from '@/utils/route';
	import { selectList } from '@/api/car';
	import {imgUrl} from '@/config';
    import SelectProp from '@/pages_D/newCar/components/SelectProp.vue';
	import DealerList from './components/DealerList.vue';
	import QQMapWX from "../../common/qqmap-wx-jssdk.js"
	import jsonData from '../../../cascaderData.json';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const isshoww = ref<boolean>(false);
	const currentCity = ref<any>('');
	const markers = ref([]);
	const scale = ref(12);
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
        typeCode:2,
    })
	onShow(() => {
		getUserAddress()
	})
	//获取当前位置 //遍历获取code
	const getUserAddress = () => {
		qqmapsdk.reverseGeocoder({
			success: (res) => {
				console.log(res, '位置信息');
				lng.value = res.result.location.lng
				lat.value = res.result.location.lat
				const { province, city, district } = res.result.address_component;
				// 更新显示字段
				currentCity.value = `${province}/${city}/${district}`;
				// 从本地 JSON 数据中查找对应的 code
				const provinceInfo = jsonData.find(item => item.name === province);
				if (!provinceInfo) {
					console.warn('未找到匹配的省份:', province);
					return;
				}
				if(provinceInfo){
					const cityInfo = provinceInfo.city.find(c => c.name === city);
					if (!cityInfo) {
						console.warn('未找到匹配的城市:', city);
						activeProvince.value = provinceInfo.code;
						return;
					}
				}
				
				// const areaInfo = cityInfo.area.find(a => a.name === district);
				// if (!areaInfo) {
				// 	console.warn('未找到匹配的区县:', district);
				// }
				// // 赋值 code
				// activeProvince.value = provinceInfo.code;
				// activeCity.value = cityInfo.code;
				// dcode.value = areaInfo?.code || ''; // 使用可选链避免报错

				init()
			},
			fail: (err) => {
				console.error('逆地理编码失败:', err);
			}
		});
	}
    const parentEvent = ()=>{
        keyword.value='';
        province.value='';
        city.value='';
        area.value='';
        brandId.value='';
        init()
    }
    const init  = ()=>{
        listQuery.value.pageNum = 1;
		markers.value = []
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
		console.log("搜索的数据",res)
		dataList.value = listQuery.value.pageNum === 1?res.rows:[...dataList.value,...res.rows];
		markers.value = dataList.value.map((item, index) => {
			item.width = '28'
			item.height = '31'
			item.id = Number(item.id)
			item.iconPath = imgUrl + 'static/userCar-list-map-icon.png'
			return item
		})
		if(dataList.value && dataList.value.length){
			lng.value = dataList.value[0].longitude
			lat.value = dataList.value[0].latitude
		}
	};
	const handleMarkerTap = (event) => {
		console.log(event);
		var makerId = event.detail.markerId
		toNav('/pages_D/usedCar/merchantsDetail?id='+makerId)
		// uni.setStorageSync('k1yMerInfo', filterMaker)
		// uni.navigateTo({
		// 	url: '/pages_D/refuelingRefilling/details?merId=' + filterMaker.stationId + (pageType.value == 'check' ? '&type=check' : '')
		// })
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
    onReachBottom(()=>{
        if(listQuery.value.pageNum*listQuery.value.pageSize<total.value){
            listQuery.value.pageNum++
            selectListFun()
        }
    })
</script>

<style lang="scss">
	
	.map {
		width: 750rpx;
		height: 700rpx;
	}
    .mapBut{
        background:var(--primary-color);
        color: #FFFFFF;
        font-size: 26rpx;
        display: inline-block;
        padding: 10rpx 20rpx;
        border-radius: 10rpx;
        margin-left:20rpx;
    }
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
		width: 100%;
		height: 72rpx;
		background: #FCFCFC;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		border: 2rpx solid #EBEBEB;
		display: flex;
		align-items: center;
		padding: 20rpx 20rpx;
		box-sizing: border-box;
		// margin: 0 auto 20rpx;
	}

	.app-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
		background: var(--head-color);
	}
</style>