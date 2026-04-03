import request from '@/utils/request';

/**
 * 
 * @param dictType 
 * @returns 
    订阅路线（车长）supply_route_subscription_vehicle_length
    订阅路线（车型）supply_route_subscription_car_type
    货源大厅（货物类型）goods_type
    货源大厅（重量）goods_weight
    货源大厅（体积）goods_volume

    二手车价格区间 old_car_price_range
    能源类型 energy_type
    汽车级别 segment

    积分商城商品分类 
    
    车辆审核状态 sys_common_audit_stauts
    车辆类型字典 vehicle_type
    车牌颜色 vehicle_plate_color 
	
	数字人 app_digital_human(hello--唤醒词，question--常用问题)
	人工客服 customer_business_type
	
 */
/**
 * 获取指定类型的字典数据
 * @param {string} dictType - 字典类型标识符
 * @returns {Promise} 包含字典数据的Promise对象
 * @throws {Error} 当请求失败时抛出错误
 */
export function getDict(dictType: string) {
	return request({
		url: `/system/api/dict/v1/${dictType}`,
		method: 'GET',
	});
}
// 获取字典值详情
export function getDictValue(dictType: string, dictValue: string) {
	return request({
		url: `/system/api/dict/v1/${dictType}${dictValue}`,
		method: 'GET',
	});
}

/**
 * 根据业务类型查询搜索记录
 * @param {string} businessType - 字典类型标识符
 * @returns {Promise} 0-餐饮-列表搜索 , 1-餐饮-菜品搜索
 */
export function listSearchRecord(businessType) {
	return request({
		url: `/system/api/sysSearchRecord/v1/${businessType}`,
		method: 'GET',
	});
}
/**
 * 保存搜索记录
 * @param {string} businessType - 业务类型
 * @param {string} searchName - 搜索内容
 * @returns {Promise} 0-餐饮-列表搜索 , 1-餐饮-菜品搜索
 */
export function addSearchRecord(data) {
	return request({
		url: '/system/api/sysSearchRecord/v1',
		method: 'POST',
		data,
	});
}

// 根据id单独删除搜索记录
export function delSearchRecord(id) {
	return request({
		url: `/system/api/sysSearchRecord/v1/${id}`,
		method: 'PUT',
	});
}
export function delAllSearchRecord(businessType) {
	return request({
		url: `/system/api/sysSearchRecord/v1/${businessType}`,
		method: 'DELETE',
	});
}

export function ocrRecognition(data) {
	return request({
		url: '/system/api/recognition/v1/unifiedOcrRecognition',
		method: 'POST',
		params: data,
	});
}

export function getCheckVersion(versionCode) {
	return request({
		url: `/system/api/appVersion/v1/checkVersion/${versionCode}`,
		method: 'GET',
	});
}

// 查询富文本列表（隐私）
export function richTextList(versionCode) {
	return request({
		url: '/system/richTextPopup/list',
		method: 'GET',
	});
}
export function richTextInfo(id) {
	return request({
		url: `/system/richTextPopup/${id}`,
		method: 'GET',
	});
}
// 获取小程序二维码
export function shareQrCode(data) {
	return request({
		url: `/system/api/share/v1/share`,
		method: 'POST',
		data,
	});
}

// 查询全部启用的技能及引导问题列表
export function skillList(data = {}) {
	return request({
		url: `/operation/api/skill/v1/list`,
		method: 'GET',
		params: data,
	});
}
// 查询全部启用的人工客服列表
export function manualServiceList(data = {}) {
	return request({
		url: `/operation/api/manual-service/v1/list`,
		method: 'GET',
		params: data,
	});
}

// 查询主题列表
export function getThemeData() {
	return request({
		url: '/operation/api/theme/v1',
		method: 'GET',
	});
}
export function configKeyTiyanguan() {
	return request({
		url: '/system/config/configKey/tiyanguan',
		method: 'GET',
	});
}
