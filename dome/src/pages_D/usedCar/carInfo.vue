<template>
	<view class="pageView">
		<view class="card" v-if="detail.id">
            <view v-for="(item,key) in obj" class="card-item" :key="key">
                <view class="card-item-label">{{ item}}:</view>
                <view class="card-item-text" v-if="key == 'segment'">{{ segmentText(detail[key])}}</view>
                <view class="card-item-text" v-else-if="key == 'energyType'">{{ energyTypeText(detail[key])}}</view>
                <view class="card-item-text" v-else>{{detail[key]}}</view>
            </view>
        </view>
	</view>
</template>

<script setup lang="ts">
	import {ref} from 'vue';
	import { imgUrl } from '@/config';
	import { toNav,toBack } from '@/utils/route';
	import { getPrOldCarDetail } from '@/api/oldCar';
    import { onLoad } from '@dcloudio/uni-app';
    import {getDict} from '@/api/config';
    const detail = ref({});
    const options1 = ref([]);
	const options2 = ref([]);
	const options3 = ref([]);
    
    const obj = ref({
        name:'车型名称',
        price:'指导价（万）',
        segment:'类型', // 轿车：limousine，SUV：suv，MPV，mpv
        displacement:'排量',
        power:'功率（KW）',
        fuelConsumption:'油耗',
        specification:'规格长宽高（mm）',
        basicPriceDiscounted:'经销商报价',
        // basicSegment:'级别', //mini_car:微型车,small_car:小型车,compact_car:紧凑型车,mid_size_car:中型车,executive_car:中大型车,luxury_car:豪华车,mini_suv:微型SUV,compact_suv:紧凑型SUV,mid_size_suv:中型SUV,full_size_suv:全尺寸SUV
        basicEngineModel:'发动机型号',
        basicCarBodyMaterial:'车身结构',
        basicMaximumSpeed:'最大车速（km/h）',
        basicMaximumTorque:'最大扭矩（N/m）',
        basicFuelConsumption:'油耗(L/100km)',
        basicTransmission:'变速箱',
        basicColor:'颜色',
        basicWheelbase:'轴距(mm)',
        basicFrontTrack:'前轮距(mm)',
        basicCurbWeight:'整备质量(kg)',
        basicFuelTankCapacity:'整燃油箱容积(L)',
        basicLuggageVolume:'行李厢容积(L)',
        basicEngineDisplacement:'发动机排量(L)',
        basicIntakeType:'进气形式',
        basicMaxHorsepower:'最大马力(Ps)',
        basicMaxPower:'最大功率(kW)',
        energyType:'能源类型',
        mileageFormat:'表显里程',
        upLicenseTime:'上牌时间',
    });

    const segmentText = computed(()=>{
		return (val)=>{
			return options3.value.find(item=>item.dictValue == val)?.dictLabel;
		}
	})
    /**
 * 根据字典值查找对应的字典标签
 * @param {string} val - 要查找的字典值
 * @returns {string|undefined} 匹配到的字典标签，未找到则返回undefined
 */
    const energyTypeText = computed(()=>{
		return (val)=>{
			return options2.value.find(item=>item.dictValue == val)?.dictLabel;
		}
	})
    const getDictList = async ()=>{
		try{
			// const res:any = await getDict('old_car_price_range');
			const res2:any = await getDict('energy_type');
			const res3:any = await getDict('segment');
			// if(res.code == 200){
			// 	options1.value = res.data;
			// }
			if(res2.code == 200){
				options2.value = res2.data;
			}
			if(res3.code == 200){
				options3.value = res3.data;
			}
		}catch{

		}
	};
    const getDetail = async (id)=>{
		try{
			let res = await getPrOldCarDetail(id);
			if(res && res.data){
				detail.value = res.data;
			}
		}catch(err){
			console.log(err)
		}
	}
    onLoad((opticon)=>{
		getDetail(opticon.id)
        getDictList();
	})
</script>

<style lang="scss">
	.pageView{
        width: 100%;
        min-height: 100vh;
        background: #F1EFEC;
        padding: 25rpx 30rpx;
        box-sizing: border-box;
    }
    .card{
     padding: 30rpx 30rpx;
     box-sizing: border-box;
     background: #FFFFFF;
     border-radius: 20rpx;
     .card-item{
        padding: 20rpx 0;
        display: flex;
        align-items: center;
        font-size: 26rpx;
        border-bottom: 1px solid #2979ff;
        .card-item-label{
            width: 200rpx;
            margin-right: 20rpx;
            color: #333333;
        }
        .card-item-text{
             font-weight: 600;
        }
     }
    }
</style>