<template>
	<view>
		<view class="topSele" :style="selectStyle">
			<view class="topSele-item" @click="barOpen" @select-brandname="brandChange">
				<text>{{brandName?brandName:'全部'}}</text>
				<up-icon name="arrow-down" color="#666666"></up-icon>
			</view>
			<view class="topSele-item" @click="addrOpen">
				<text class="sl">{{ fullAddress?fullAddress:currentCity }}</text>
				<!-- <text class="sl">{{fullAddress ? fullAddress : (currentCity ? currentCity : '全国') }}</text> -->
				<up-icon name="arrow-down" color="#666666"></up-icon>
			</view>
			<view @click="require">重置</view>
		</view>
		<view class="addressBox" @click="close" v-if="isshoww">
			<view class='addressBox-pr' @click.stop>
				<Address ref="childRef" @select-address="handleSelectAddress" :on-call-parent="handleParentMethod" />
			</view>
		</view>
		<BrandSelectPopup ref="brandSelect" @change="brandChange" type='brand'></BrandSelectPopup>
	</view>
</template>
<script setup lang="ts">
	import { ref, computed } from 'vue';
	import Address from './Address.vue' // 地址
	import { onLoad } from '@dcloudio/uni-app';
	import { useCommonStore } from '@/store/modules/common';
	const isshoww = ref<boolean>(false);
	const currentCity = ref<any>('')
	import BrandSelectPopup from '@/components/BrandSelectPopup/index';
	import QQMapWX from "../../../common/qqmap-wx-jssdk.js"
	import jsonData from '../../../../cascaderData.json';
	const commonState = useCommonStore();
	const brandSelect = ref('');
	const brandName = ref('');
	const brandId = ref('');
	const activeProvince = ref('');
	const cityCode = ref('');

	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB' // 请替换为你的腾讯地图key
	});
	interface Props {
		bgColor : string
		padding : string
	}
	const barOpen = () => {
		brandSelect.value.open()
	}
	const brandChange = (event) => {
		brandName.value = event.brandName
		brandId.value = event.brandId
		emit('select-brandname', {
			brandName: brandName.value,
			brandId: brandId.value
		})
	}

	const props = withDefaults(defineProps<Props>(), {
		bgColor: '#FFFFFF',
		padding: '20rpx 40rpx 40rpx 40rpx'
	});

	const selectStyle = computed(() => {
		let style : any = {}
		style.background = props.bgColor;
		style.padding = props.padding;
		return style
	})
	//获取当前位置 //遍历获取code
	const getUserAddress = () => {
		let objData=uni.getStorageSync('address')
		// 更新显示字段
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
		if (provinceInfo) {
			activeProvince.value = provinceInfo.code;
			commonState.selectPopAddress.province = objData.province;
			commonState.selectPopAddress.provinceCode = provinceInfo.code;
		}
		if (cityInfo) {
			cityCode.value = cityInfo.code;
			commonState.selectPopAddress.city = objData.city;
			commonState.selectPopAddress.code = cityInfo.code;
		}
	}

	// 定义子组件实例的类型（结合子组件暴露的方法类型）
	type ChildInstance = ComponentPublicInstance & {
		updateData : (value : string) => number;
	};
	const childRef = ref<ChildInstance | null>(null);
	// 父组件调用子组件方法
	const callChildMethod = () => {
		isshoww.value = true
		if (childRef.value) {
			// 调用子组件的 handleReset 方法
			const { updateData } = childRef.value;
			updateData('')
		}
	};
	// 关闭选址
	const close = () => {
		isshoww.value = false
	}
	const addrOpen = () => {
		isshoww.value = true;
		childRef.value?.setInitialValue(activeProvince.vlaue, cityCode.vlaue);
		console.log("1111111111111111111")
	};
	const handleParentMethod = (val : any) => {
		isshoww.value = val;
		// callChildMethod()
	}
	interface Address {
		province : string
		city : string
		district : string
		provinceCode : string
		cityCode : string
		districtCode : string,
		brandName : string,
		brandId : string,
		code ?: string
	}
	const selected = reactive({
		province: '',
		city: '',
		district: '',
		provinceCode: '',
		cityCode: '',
		districtCode: '',
	})
	const emit = defineEmits<{
		(e : 'select-address', addr : Address) : void,
		(e : 'select-brandname', value : string) : void,
		(e : 'parentEvent') : void // 无参数的事件也需要函数形式
	}>()

	// 当用户选择完地址后调用：
	const fullAddress = computed(() =>
		// [selected.province, selected.city, selected.district].filter(Boolean).join('/')
		[selected.province, selected.city].filter(Boolean).join('/')
	)
	// 获取code 省市区
	const handleSelectAddress = (addr : Address) => {
		Object.assign(selected, addr)
		activeProvince.vlaue = addr.provinceCode
		cityCode.vlaue = addr.cityCode
		emit('select-address', {
			province: addr.province,
			city: addr.city,
			district: addr.district,
			code: addr.cityCode,
			districtCode: addr.districtCode,
			provinceCode: addr.provinceCode,
		})
	}
	const require = () => {
		brandName.value = ''
		brandId.value = '';
		Object.assign(selected, {
			city: "西安市",
			code: "610100",
			district: '',
			districtCode: '',
			province: "陕西省",
			provinceCode: "610000",
		});
		commonState.selectPopAddress = {
			province: '陕西省',
			city: '西安市',
			district: '',
			code: '610100',
			districtCode: '',
			provinceCode: '610000',
		};
		emit('select-brandname', {
			brandName: '',
			brandId: '',
			city: "西安市",
			code: "610100",
			district: undefined,
			districtCode: undefined,
			province: "陕西省",
			provinceCode: "610000",
		});
		emit('parentEvent')
	}
	onLoad(() => {
		getUserAddress()
	})
</script>

<style lang="scss" scoped>
	.topSele {
		// padding: 20rpx 40rpx 40rpx 40rpx;
		box-sizing: border-box;
		// background: #FFFFFF;
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

	.addressBox {
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, .5);
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;

		.addressBox-pr {
			width: 100%;
			position: fixed;
			bottom: 110rpx;
		}
	}

	.sl {
		width: 180rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}
</style>