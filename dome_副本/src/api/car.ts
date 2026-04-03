import request from '@/utils/request'

// 获取品牌
export function prCarBrand(data: any) {
  return request({
    url: '/premium/api/prCarBrand/v1/brand',
    method: 'GET',
	params: data
  })
}

// 获取车系
export function prCarSeries(id) {
  return request({
    url: `/premium/api/prCarBrand/v1/series/${id}`,
    method: 'GET'
  })
}

// 获取车型
export function prCarType(id) {
  return request({
    url: `/premium/api/prCarBrand/v1/type/${id}`,
    method: 'GET'
  })
}

// 汽车维修 - 门店列表
export function prIndustry4sList(data: any) {
  return request({
    url: `/premium/api/prIndustry4s/v1/selectList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'POST',
	data: data
  })
}

// 汽车维修 - 门店详情
export function prIndustry4sDetails(id) {
  return request({
    url: `/premium/api/prIndustry4s/v1/selectOne/${id}`,
    method: 'GET'
  })
}

// 汽车维修 - 预约列表
export function prRepairAppointment(data: any) {
  return request({
    url: '/premium/api/prRepairAppointment/v1',
    method: 'GET',
	params: data
  })
}

// 汽车维修 - 预约修车
export function addPrRepairAppointment(data: any) {
  return request({
    url: '/premium/api/prRepairAppointment/v1',
    method: 'POST',
	data: data
  })
}

//根据新车id查询车辆详情
export function selectNewCarDetail(id,lng,lat) {
  return request({
    url: `/premium/api/prCarAppointmentTestDrive/v1/selectNewCarDetail/${id}?longitude=${lng}&latitude=${lat}`,
    method: 'GET',
  })
}

// 热销品牌查询
export function selectHotCarBrand(data: any) {
  return request({
    url: '/premium/api/prCarAppointmentTestDrive/v1/selectHotCarBrand',
    method: 'POST',
	data: data
  })
}

//新增预约试驾
export function insertAppointmentTes(data: any) {
  return request({
    url: '/premium/api/prCarAppointmentTestDrive/v1/insertAppointmentTes',
    method: 'POST',
	data: data
  })
}
//4S 查询
export function selectList(data: any) {
  return request({
    url: `/premium/api/prIndustry4s/v1/selectList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'POST',
	data: data
  })
}

//查询用户下所有预约列表
export function selectByUserId(data: any) {
  return request({
    url: '/premium/api/prCarAppointmentTestDrive/v1/selectByUserId',
    method: 'POST',
	data: data
  })
}
// 查询活动列表
export function selectActivityList(data: any) {
  return request({
    url: `/premium/api/prCarAppointmentTestDrive/v1/selectActivityList`,
    method: 'GET',
	params: data
  })
}

// 查询活动详情
export function selectActivityInfo(id,lng,lat) {
  return request({
    url: `/premium/api/prCarAppointmentTestDrive/v1/selectActivity/${id}/${lng}/${lat}`,
    method: 'GET',
  })
}
export function selectHotNewCar(data:any) {
  return request({
    url: `/premium/api/prCarAppointmentTestDrive/v1/selectHotNewCar?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'POST',
	data: data
  })
}
export function selectOne(id) {
  return request({
    url: `/premium/api/prIndustry4s/v1/selectOne/${id}`,
    method: 'GET',
  })
}

export function selectListBY4sId(data: any) {
  return request({
    url: '/premium/api/prCarAppointmentTestDrive/v1/selectListBY4sId',
    method: 'POST',
	params: data
  })
}

export function selectDetailById(id) {
  return request({
    url: `/premium/api/prCarAppointmentTestDrive/v1/selectDetailById/${id}`,
    method: 'GET',
  })
}

export function sysReview(data: any) {
  return request({
    url: '/system/api/sysReview/v1',
    method: 'POST',
	data: data
  })
}
// 根据业务类型查询维度
export function bizType(type) {
  return request({
    url: `/system/api/sysReview/v1/bizType/${type}`,
    method: 'GET',
  })
}
//根据根据业务类型查询维度pingjia
export function getcomlist(id,type) {
  return request({
    url: `/system/api/sysReview/v1/${type}/${id}`,
    method: 'GET',
  })
}
//根据根据业务类型查询维度pingjia
export function getweixinlist(type) {
  return request({
    url: `/system/api/dict/v1/${type}`,
    method: 'GET',
  })
}
//根据根据业务类型查询维度pingjia
export function getprRepairAppointment(id) {
  return request({
    url: `/premium/api/prRepairAppointment/v1/${id}`,
    method: 'GET',
  })
}
export function getprIndustry4simglist(id) {
  return request({
    url: `/premium/api/prIndustry4s/v1/selectOne/${id}`,
    method: 'GET',
  })
}

export function gridMenu(businessType) {
  return request({
    url: `/system/api/gridMenu/v1/business/${businessType}`,
    method: 'GET',
  })
}
export function putcancel(id) {
  return request({
    url: `/premium/api/prRepairAppointment/v1/cancel/${id}`,
    method: 'PUT',
  })
}
export function selectNewCarByType(seriesId) {
  return request({
    url: `/premium/api/prCarAppointmentTestDrive/v1/selectNewCarByType/${seriesId}`,
    method: 'GET',
  })
}

export function listActivityApplyList(params) {
  return request({
    url: '/premium/api/prCarAppointmentTestDrive/v1/selectActivityApply',
    method: 'GET',
    params
  })
}

export function bannerList(id, data) {
  return request({
    url: `/system/api/banner/v1/${id}`,
    method: 'GET',
	params: data
  })
}
export function getMerchantByIdinfo(data) {
  return request({
    url: `/travel/unLoginApi/getMerchantById`,
    method: 'POST',
	data: data
  })
}

// 新增二手车以旧换新记录
export function prCarOldForNew(data) {
  return request({
    url: `/premium/api/prCarOldForNew`,
    method: 'POST',
	data: data
  })
}


// 分页查询所有数据
export function prOldCarPolicy(params) {
  return request({
    url: `/premium//api/prOldCarPolicy/v1/list`,
    method: 'GET',
	params
  })
}


// 通过主键查询单条数据
export function prOldCarPolicyID(id) {
  return request({
    url: `/premium/api/prOldCarPolicy/v1/detail/${id}`,
    method: 'GET',
  })
}

// 企业车辆绑定
export function etBindVehicle(data: any) {
	return request({
		url: '/system/api/enterprise/vehicle/v1/bind',
		method: 'POST',
		data,
	});
}

// 企业车辆列表
export function enterpriseVehicle(data: any) {
	return request({
		url: '/system/api/enterprise/vehicle/v1/list',
		method: 'POST',
		data,
	});
}
// 企业车辆列表
export function postapplylist(data: any) {
	return request({
		url: '/system/api/enterprise/vehicle/v1/apply/list',
		method: 'POST',
		data,
	});
}

// 获取企业列表
export function enterpriseList(data: any) {
	return request({
		url: '/membership/api/enterprise/v1',
		method: 'POST',
		data,
	});
}

// 解绑企业车辆
export function unbindVehicle(data: any) {
	return request({
		url: '/system/api/enterprise/vehicle/v1/unbind',
		method: 'POST',
		data,
	});
}

// 企业车辆详情
export function getUserVehicleByUserId(id) {
  return request({
    url: `/system/api/enterprise/vehicle/v1/details/${id}`,
    method: 'GET',
  })
}

// 获取当前用户企业身份
export function enterpriseUserIdentity() {
	return request({
		url: '/membership/api/enterprise/v1/enterpriseUserIdentity',
		method: 'GET',
	});
}

// 批量审核企业车辆
export function batchAudit(data: any) {
	return request({
		url: '/system/api/enterprise/vehicle/v1/batchAudit',
		method: 'POST',
		data,
	});
}

// 审核企业车辆
export function vehicleAudit(data: any) {
	return request({
		url: '/system/api/enterprise/vehicle/v1/audit',
		method: 'POST',
		data,
	});
}

// 企业管理员更新分成比例
export function updateRatio(data: any) {
	return request({
		url: '/system/api/enterprise/vehicle/v1/updateRatio',
		method: 'POST',
		data,
	});
}

// 催办
export function urgeAudit(enterpriseId: any) {
	return request({
		url: `/membership/api/enterprise/v1/urgeAudit/${enterpriseId}`,
		method: 'GET',
	});
}


export function prAppointmentOldCar(data: any) {
  return request({
    url: '/premium/api/prAppointmentOldCar/v1',
    method: 'GET',
	params: data
  })
}

// 二手车以旧换新记录列表
export function prCarOldForNewlist(data: any) {
  return request({
    url: '/premium/api/prCarOldForNew/list',
    method: 'GET',
	params: data
  })
}
// 二手车以旧换新记录详情
export function ckprCarOldForNew(id) {
  return request({
    url: `/premium/api/prCarOldForNew/${id}`,
    method: 'GET',
  })
}
// 上门估计
export function prEvaluateOldCar(data: any) {
  return request({
    url: '/premium/api/prEvaluateOldCar/v1',
    method: 'GET',
	params: data
  })
}
// 上门估计详情
export function ckprEvaluateOldCar(id) {
  return request({
    url: `/premium/api/prEvaluateOldCar/v1/${id}`,
    method: 'GET',
  })
}
//租车
export function appointmentRentCar(data: any) {
  return request({
    url: '/premium/api/appointmentRentCar/v1/selectRentCarList',
   method: 'POST',
   data: data
  })
}
//租车详情
export function ckappointmentRentCar(id) {
  return request({
    url: `/premium/api/appointmentRentCar/v1/${id}`,
    method: 'GET',
  })
}