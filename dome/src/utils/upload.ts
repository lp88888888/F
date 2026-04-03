import { baseUrl } from '@/config'
import { getToken } from '@/utils/token'
import { errCode } from '@/utils/errorCode'
import { toast } from '@/utils/common'

interface UploadConfig {
  url: string
  filePath: string
  name?: string
  formData?: Record<string, any>
  headers?: {
    isToken?: boolean
    [key: string]: any
  }
  timeout?: number
}

interface UploadResponse<T = any> {
  code: string
  msg?: string
  data: T
}

const DEFAULT_TIMEOUT = 10000
const DEFAULT_UPLOAD_NAME = 'file'

/**
 * 封装的文件上传方法
 * @param config 上传配置
 * @returns
 */
export const uploadFile = <T = any>(config: UploadConfig): Promise<UploadResponse<T>> => {
  // 处理请求头
  let wxOauthDate = wx.getStorageSync('wxOauthDate')
  const isTokenDisabled = config.headers?.isToken === false
  const h: Record<string, any> = {}
  
  // 添加认证 token
  if (getToken() && !isTokenDisabled) {
    h['Authorization'] = getToken()
    h['cacheId'] = wxOauthDate['sid']
    h['Content-Type'] = 'multipart/form-data'
  }

  console.log('请求头', h);

  // 图片压缩处理
  const compressImage = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      uni.compressImage({
        src: filePath, // 源图片路径
        quality: 80,    // 压缩质量（0-100，100为不压缩）
        success: (res) => {
          resolve(res.tempFilePath)  // 返回压缩后的临时路径
        },
        fail: (err) => {
          reject(err)  // 压缩失败
        }
      })
    })
  }

  return new Promise((resolve, reject) => {
    // 如果是图片文件，先进行压缩
    if (config.filePath && isImage(config.filePath)) {
      compressImage(config.filePath)
        .then((compressedPath) => {
          // 使用压缩后的图片路径上传
          uni.uploadFile({
            url: baseUrl + config.url,
            filePath: compressedPath,
            name: config.name || DEFAULT_UPLOAD_NAME,
            formData: config.formData || {},
            header: h,
            timeout: config.timeout || DEFAULT_TIMEOUT,
            success: (res) => {
              console.log("res", res)
              try {
                const result: UploadResponse<T> = JSON.parse(res.data)

                // 业务状态码处理
                if (result.code === '0' || result.code == 200) {
                  resolve(result)
                } else if (result.code == '1') {
                  toast(result.msg || '服务器内部错误')
                  reject(result)
                } else {
                  errCode(result.code)
                  reject(result)
                }
              } catch (e) {
                toast('响应数据解析失败')
                reject({
                  code: -1,
                  msg: '响应数据解析失败',
                  data: null
                })
              }
            },
            fail: (err) => {
              console.log("err", err)
              const error = normalizeUploadError(err)
              toast(error.msg)
              reject({
                code: -2,
                msg: error.msg,
                data: null
              })
            }
          })
        })
        .catch((err) => {
          toast('图片压缩失败')
          reject({
            code: -3,
            msg: '图片压缩失败',
            data: null
          })
        })
    } else {
      // 如果不是图片，直接上传
      uni.uploadFile({
        url: baseUrl + config.url,
        filePath: config.filePath,
        name: config.name || DEFAULT_UPLOAD_NAME,
        formData: config.formData || {},
        header: h,
        timeout: config.timeout || DEFAULT_TIMEOUT,
        success: (res) => {
          try {
            const result: UploadResponse<T> = JSON.parse(res.data)

            // 业务状态码处理
            if (result.code === '0' || result.code==200) {
              resolve(result)
            } else if (result.code == '1') {
              toast(result.msg || '服务器内部错误')
              reject(result)
            } else {
              errCode(result.code)
              reject(result)
            }
          } catch (e) {
            toast('响应数据解析失败')
            reject({
              code: -1,
              msg: '响应数据解析失败',
              data: null
            })
          }
        },
        fail: (err) => {
          const error = normalizeUploadError(err)
          toast(error.msg)
          reject({
            code: -2,
            msg: error.msg,
            data: null
          })
        }
      })
    }
  })
}

/**
 * 判断文件是否为图片
 * @param filePath 文件路径
 * @returns boolean
 */
const isImage = (filePath: string): boolean => {
  const ext = filePath.split('.').pop()?.toLowerCase()
  return ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif'
}


/**
 * 标准化上传错误信息
 */
const normalizeUploadError = (err: UniApp.UploadFileError): { msg: string } => {
  let message = err.errMsg || '上传失败'
  
  if (message.includes('fail timeout')) {
    message = '上传超时，请重试'
  } else if (message.includes('fail abort')) {
    message = '上传被取消'
  } else if (message.includes('fail file not found')) {
    message = '文件不存在'
  }

  return { msg: message }
}

export default uploadFile