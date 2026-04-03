import upload from '@/utils/upload'
import request from '@/utils/request'

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'PUT',
    params: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'GET'
  })
}

// 修改用户个人信息
export function updateUserProfile(data: any) {
  return request({
    url: '/system/user/profile',
    method: 'PUT',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data: any) {
  return upload({
    url: '/system/user/profile/avatar',
    name: data.name,
    filePath: data.filePath
  })
}

// 上传图片
export function uploadMerchantImage(data: any) {
	return request({
		url: '/file/upload',
		method: 'POST',
		data,
	});
}

// 获取地址列表
export function getMemberDeliveryAddress(data: any) {
	return request({
		url: '/system/api/userAddr/v1/list',
		method: 'GET',
		data,
	});
}
// 获取用户默认地址
export function userDefaultAddr() {
	return request({
		url: '/system/api/userAddr/v1',
		method: 'GET',
	});
}


// 新增或者更新地址
export function saveOrUpdateMemberDeliveryAddress(data: any) {
	return request({
		url: '/system/api/userAddr/v1/save',
		method: 'POST',
		data,
	});
}

// 设置默认
export function updateDfMemberDeliveryAddress(data: any) {
	return request({
		url: '/management/api/memberDeliveryAddress/updateDfMemberDeliveryAddress',
		method: 'POST',
		params: data,
	});
}

// 回显接口
export function getAddressByIdAddress(id) {
	return request({
		url: `/system/api/userAddr/v1/${id}`,
		method: 'GET',
	});
}

// 删除地址
export function deleteMemberDeliveryAddress(id) {
	return request({
		url:`/system/api/userAddr/v1/delete/${id}`,
		method: 'POST',
	});
}
//添加自定义
export function saveMemberLabelAddress(data: any) {
	return request({
		url: '/management/api/memberAddressLabel/saveMemberLabel',
		method: 'POST',
		data,
	});
}
// 获取自定义
export function getMemberLabelListAddress(data: any) {
	return request({
		url: '/management/api/memberAddressLabel/getMemberLabelList',
		method: 'GET',
		data,
	});
}

// 会员中心广告位
export function getAdvertisingListByType(data: any) {
	return request({
		url: '/management/api/advertisement/getAdvertisingListByType',
		method: 'POST',
		data,
	});
}

// 修改用户信息
export function updateMember(data: any) {
	return request({
		url: '/membership/member/info/v1',
		method: 'PUT',
		data,
	});
}
// 我的车辆列表查询
export function getByUserIdAndVehicleAll(data: any) {
	return request({
		// url: '/management/api/user-vehicle/getByUserIdAndVehicleAll',
		url: '/system/vehicle/info/v1/getAllVehicleByUserId',
		method: 'POST',
		data:data,
	});
}
// 我的车辆列表查询
export function postboundlist(data: any) {
	return request({
		// url: '/management/api/user-vehicle/getByUserIdAndVehicleAll',
		url: '/system/vehicle/info/v1/bound/list',
		method: 'POST',
		data:data,
	});
}
// 车辆绑定
export function bindVehicle(data: any) {
	return request({
		url: '/system/vehicle/info/v1/bindVehicle',
		method: 'POST',
		data,
	});
}
// 绑车输入车牌号后校验
export function verifyLicensePlateNumber(data: any) {
	return request({
		// url: '/management/api/user-vehicle/verifyLicensePlateNumber',
		url: '/system/vehicle/info/v1/verifyLicensePlateNumber',
		method: 'POST',
		params:data,
	});
}
// 解绑车辆
export function unBindVehicle(data: any) {
	return request({
		url: '/system/vehicle/info/v1/unbind',
		method: 'POST',
		data,
	});
}

// 车辆的审核状态
export function getVehicleAuditStatus() {
	return request({
		url: '/management/api/user-vehicle/getVehicleAuditStatus',
		method: 'POST',
	});
}
// 车辆的类型状态
export function getVehicleType() {
	return request({
		url: '/management/api/user-vehicle/getVehicleType',
		method: 'POST',
	});
}

// 根据车牌号查询车辆所属人和公司名称接口
export function queryEnterpriseValue(data: any) {
	return request({
		url: '/management/api/promotionManage/queryEnterpriseValue',
		method: 'POST',
		data,
	});
}



// 用户同步对应的车辆用户信息
export function calSynKycVehicleAndUserInfo(data: any) {
	return request({
		url: '/management/api/user-vehicle/calSynKycVehicleAndUserInfo',
		method: 'POST',
		data,
	});
}

// 用户同步对应的车辆用户信息
export function getKycVehicleAndUserInfo(data: any) {
	return request({
		url: '/management/api/user-vehicle/getKycVehicleAndUserInfo',
		method: 'POST',
		params:data,
	});
}

// 车辆详情
export function getUserVehicleByUserId(data: any) {
	return request({
		url: '/management/api/user-vehicle/getUserVehicleByUserId',
		method: 'POST',
		params:data,
	});
}

// 消息管理
export function getMessageInfo(data: any) {
	return request({
		url: '/management/api/messageInfo/getMessageInfo',
		method: 'POST',
		data,
	});
}

// 消息类型
export function getMessageTypeByMemberId() {
	return request({
		url: '/management/api/messageInfo/getMessageTypeByMemberId',
		method: 'GET',
	});
}

// 一键清空消息
export function oneKeyClear() {
	return request({
		url: '/management/api/messageInfo/oneKeyClear',
		method: 'POST',
	});
}

// 获取未读消息数量
export function getMessageCount() {
	return request({
		url: '/management/api/messageInfo/getMessageCount',
		method: 'GET',
	});
}

// 修改消息类型启用状态
export function changeMessageTypeEnableStatus(data: any) {
	return request({
		url: '/management/api/messageInfo/changeMessageTypeEnableStatus',
		method: 'POST',
		data,
	});
}
// 记录用户密码修改弹窗展示
export function recordPasswordChangeShow() {
	return request({
		url: '/system/api/system/popup/recordPasswordChangeShow',
		method: 'POST',
	});
}
// 判断用户是否应该显示密码修改弹窗
export function shouldShowPasswordChange() {
	return request({
		url: '/system/api/system/popup/shouldShowPasswordChange',
		method: 'GET'
	});
}
// 判断用户是否应该显示密码修改弹窗
export function updateUserAgreement(code) {
	return request({
		url: '/system/userAgreement/updateUserAgreement/'+code,
		method: 'POST'
	});
}
// 判断用户是否应该显示密码修改弹窗
export function getUserAgreementStatus() {
	return request({
		url: '/system/userAgreement/getUserAgreementStatus',
		method: 'GET'
	});
}
export function updateUserAgreementIsPop(code) {
	return request({
		url: '/system/userAgreement/updateUserAgreementIsPop/'+code,
		method: 'POST'
	});
}
export function postinsert(data) {
	return request({
		url: '/operation/opTrackingData/insert',
		method: 'POST',
		data
	});
}

// 获取浏览与阅读积分规则
export function getLookReadPoint() {
	return request({
		url: '/membership/api/member/v1/getLookReadPoint',
		method: 'GET'
	});
}
export function saveLookReadPoint(data) {
	return request({
		url: '/membership/api/member/v1/saveLookReadPoint',
		method: 'POST',
		data
	});
}