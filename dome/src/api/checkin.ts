import request from '@/utils/request'

// 获取打卡活动信息 campaignKey == 车主节：car_owner_festival
export function getCheckinInfo(campaignKey: string) {
  return request({
    url: `/membership/api/activity/clock/v1/getInfo/${campaignKey}`,
    method: 'GET'
  })
}
// 获取打卡收费站 
export function getCheckinTollList(params: any) {
  return request({
    url: `/membership/api/activity/clock/v1/getStationList`,
    method: 'GET',
    params
  })
}

// 我的打卡统计 activityId
export function getMyCheckinStats(params: any) {
  return request({
    url: `/membership/api/activity/clock/v1/getClockStats`,
    method: 'GET',
    params
  })
}

// 打卡
export function checkin(data: any) {
  return request({
    url: `/membership/api/activity/clock/v1/clock`,
    method: 'POST',
    data
  })
}

// 自动打卡
export function autoCheckin(data: any) {
  return request({
    url: `/membership/api/activity/clock/v1/autoClock`,
    method: 'POST',
    data
  })
}

// 自动打卡授权状态查询
export function getAutoCheckinAuthStatus(params: any) {
  return request({
    url: `/membership/api/activity/clock/v1/getAutoClockState`,
    method: 'GET',
    params
  })
}

// 自动打卡授权
export function authAutoCheckin(params: any) {
  return request({
    url: `/membership/api/activity/clock/v1/agreeAutoClockAuth`,
    method: 'GET',
    params
  })
}





