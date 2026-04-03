import CryptoJS from 'crypto-js'
/**
 * 生成数字人的访问令牌
 * @param {number} expireHours - 令牌过期时间（小时），默认为1小时
 * @returns {string} 返回格式为"appId/signature/expireTime"的访问令牌
 */
export const digitalHumanToken = (expireHours:number = 1) => {
    const appId= 'i-rksrpasm77yub';
    const appKey= 'u499w5vpswy5yjk3q65z';
  // 计算过期时间，将当前时间加上指定小时数
  const expireTime = new Date(Date.now() + expireHours * 60 * 60 * 1000).toISOString()
  // 组合消息内容：应用ID和过期时间
  const message = appId + expireTime
  // 使用HmacSHA256算法生成签名，确保令牌安全性
  const signature = CryptoJS.HmacSHA256(message, appKey).toString()
  return `${appId}/${signature}/${expireTime}`
}
