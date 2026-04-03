import { defineStore } from 'pinia';

export const useCommonStore = defineStore('common', () => {
  // 定义类型
  interface PoiItem {
    id?: string;
    title?: string;
    address?: string;
    tel?: string;
    category?: string;
    location?: {
      lat: number;
      lng: number;
    };
    ad_info?: {
      adcode?: string;
      province?: string;
      city?: string;
      district?: string;
    };
    _distance?: number;
  }
  const selectPopAddress = ref({
    // province: '陕西省',
    // city:'西安市',
    // district: '',
    // code:'610100',
    // districtCode:'',
    // provinceCode:'610000'
    province: '',
    city:'',
    district: '',
    code:'',
    districtCode:'',
    provinceCode:''
  });
// 清除pop地址
  const clearPopAddress = () => {
    selectPopAddress.value = {
      province: '',
      city:'',
      district: '',
      code:'',
      districtCode:'',
      provinceCode:''
    }
  }
  
	const chooseLocation = ref<any>(null);
  // 添加选中的位置
  const addChoLoca = (item: any) => {
    chooseLocation.value = { ...item }; // 使用解构避免引用污染
	chooseLocation.value.location.latitude = chooseLocation.value.location.lat
	chooseLocation.value.location.longitude = chooseLocation.value.location.lng
	console.log('8900',chooseLocation.value);
  };

  // 获取选中的位置（不自动清空）
  const getChoLoca = () => {
    const obj = chooseLocation.value;
    if (obj && obj.address && obj.location?.lat !== undefined && obj.location?.lng !== undefined) {
      return {
        name: obj.title || '',
        address: obj.address,
        latitude: obj.location.lat,
        longitude: obj.location.lng,
      };
    }
    return null;
  };

  // 如果确实需要获取后清空，提供一个单独的方法
  const getAndClearChoLoca = () => {
    const result = getChoLoca();
	setTimeout(()=>{
		clearChoLoca();
	},50)
    
    return result;
  };

  // 清空选择的位置
  const clearChoLoca = () => {
    chooseLocation.value = null;
  };
  // 货车节活动暂存
	const truckFestivalInfo= ref({})
  // 最后返回需要导出的内容
  return {
    chooseLocation:chooseLocation,
    addChoLoca,
    getChoLoca,
    getAndClearChoLoca,
    clearChoLoca,
    selectPopAddress,
    clearPopAddress,
	truckFestivalInfo
  };
});