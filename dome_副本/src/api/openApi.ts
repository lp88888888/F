import request from '@/utils/request';
import {aiUrl} from '@/config'

// 授权码：
const ak = 'copilot_ak_4qZ84MGWrRoXcMwY'; // Access Key 
const sk = 'SK_cWjDuPvXiuBFEiIHyzBrjuuV'; // Secrect Key
const assistantId = 118; // 助手ID

// 获取token
export function getOpenToken(requestTime) {
  return request({
    baseUrl:aiUrl,
    // baseUrl:'http://super-apaas.baidu.com',
    url: '/copilot/v1/openApi/getToken',
    method: 'GET',
    headers:{
        isToken:false,
    },
	params: {
        ak:ak,
        sk:sk,
        assistantId:assistantId,
        requestTime:requestTime
    }
  })
}

/**
 * skillId 说明
 * 天气查询：190
 * 一键触达：189
 * 周边查询：192
 * 货车节问题：195
 * 服务区查询：213
 * 路况查询：191
 * 驾驶咨询：212
 * 应急咨询：211
 * 积分问题：193
 */
interface DataChat {
  type: 'IM_CLICK';
  sessionId:string;
  query:string;
  assistantId:number;
skillId?:190 | 189 | 192 | 195 | 213 | 191 | 212 | 211 | 193;

}
/**
 * 
 * @param copilotToken 
 * @param data 
 * @returns 
 */
// 获取会话
export function openChat(copilotToken:string,requestTime,data) {
  const newData:DataChat = Object.assign({
    type:'IM_CLICK',
    assistantId:assistantId,
  },data)
  return request({
    baseUrl:aiUrl,
    url: '/copilot/v1/openApi/chat',
    method: 'POST',
    header:{
        copilotToken:copilotToken,
        requestTime:requestTime,
        copilotAk:ak,
        assistantId:assistantId,
    },
    headers:{
        isToken:false,
    },
	data:newData
  })
}
// 助手详情接口
export function getAssistant(token,time) {
  return request({
    baseUrl:aiUrl,
    url: '/copilot/v1/openApi/getAssistant',
    method: 'POST',
    header:{
        copilotToken:token,
        requestTime:time,
        copilotAk:ak,
        assistantId:assistantId,
    },
    data:{
      id:118
    }
  })
}

// 会话反馈接口（点赞、点踩）
export function feedbackAi(token,data) {
	data.assistantId = assistantId
	data.pageType = 'API'
	console.log('------------',data);
  return request({
    baseUrl:aiUrl,
    url: '/copilot/v1/openApi/feedback',
    method: 'POST',
    header:{
        copilotToken:token,
        requestTime:data.requestTime,
        copilotAk:ak,
        assistantId:assistantId,
    },
    data:data
  })
}
// 取消反馈
export function feedbackDeleteAi(token,data) {
	
  return request({
    baseUrl:aiUrl,
    url: '/copilot/v1/openApi/feedbackDelete',
    method: 'POST',
    header:{
        copilotToken:token,
        requestTime:data.requestTime,
        copilotAk:ak,
        assistantId:assistantId,
    },
    data:data
  })
}
