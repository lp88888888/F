<template>
  <view class="feedback-page">
    <scroll-view class="feedback-page__scroll" scroll-y>
      <view class="section">
        <text class="section-tips">使用了一段时间，您对平台还满意吗？</text>
        <view class="satisfy-list">
          <view
            v-for="item in satisfyList"
            :key="item.value"
            class="satisfy-item"
            :class="{ 'satisfy-item--active': item.value === satisfyValue }"
            @tap="onSelectSatisfy(item.value)"
          >
            <image
              class="satisfy-item__icon"
              :src="item.value === satisfyValue ? item.activeIcon : item.icon"
              mode="aspectFit"
            />
            <text class="satisfy-item__text">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title"><text class="required">*</text>建议分类</text>
          <text class="section-sub">[单选]</text>
        </view>

        <view class="tag-grid">
          <view
            v-for="item in tagList"
            :key="item.value"
            class="tag-item"
            :class="{ 'tag-item--active': item.value === tagValue }"
            @tap="onSelectTag(item.value)"
          >
            <image
              class="tag-item__icon"
              :src="item.value === tagValue ? item.activeIcon : item.icon"
              mode="aspectFit"
            />
            <text class="tag-item__text">{{ item.dictLabel }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">
          <text class="required">*</text>
          您的建议
        </text>
        <view class="suggest-textarea">
          <textarea
            v-model="suggestion"
            placeholder="尽量详细描述您的建议"
            maxlength="300"
            class="suggest-textarea__input"
          />
          <view class="suggest-textarea__count">
            {{ suggestion.length }}/300
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">上传图片/视频</text>
        <view class="upload-wrapper">
          <view class="custom-file-list">
            <view
              v-for="(file, index) in fileList"
              :key="index"
              class="upload-file-item"
              @tap="onPreviewFile(file, index)"
            >
              <view class="delete-btn" @tap.stop="onDeleteFile(index)">
                <text class="delete-icon">×</text>
              </view>

              <template v-if="file.fileType === 'video'">
				  <!-- #ifdef APP -->
				  
					<!-- <video class="upload-file-image" direction="0" :src="file.thumb || file.url" controls></video> -->
				  <!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
					<!-- <image
					  class="upload-file-image"
					  :src="file.thumb || file.url"
					  mode="aspectFill"
					/> -->
				<!-- #endif -->
				<image
				  class="upload-file-image"
				  :src="file.thumb || file.url"
				  mode="aspectFill"
				/>
				
                <!-- <view class="video-play-btn">
                  <image
                    class="play-icon"
                    :src="imgUrl + 'experience/icon_play.png'"
                    mode="aspectFit"
                  />
                </view> -->
              </template>

              <image
                v-else
                class="upload-file-image"
                :src="file.url"
                mode="aspectFill"
              />
            </view>

            <view
              class="upload-card"
              v-if="fileList.length < currentMaxCount"
              @tap="onChooseMedia"
            >
              <image
                class="upload-card__icon"
                :src="imgUrl + 'experience/ex_add.png'"
                mode="aspectFit"
              />
              <text class="upload-card__text">
                {{ mediaType ? tipsUploadLabel : '添加图片/视频' }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="submit-bar">
      <view class="submit-btn" @tap="onSubmit">提交</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { imgUrl } from '@/config'
import uploadFile from '@/utils/upload' // 您的封装的 uni.uploadFile
import { addFeedback } from '@/api/home'
import { getDict } from '@/api/config'

interface SatisfyItem {
  value: number
  label: string
  icon: string
  activeIcon: string
}

interface DictItem {
  dictCode: string
  dictLabel: string
  dictValue: string
  remark?: string
  status?: string
}

interface TagItem {
  value: string
  dictLabel: string
  icon: string
  activeIcon: string
}

interface UploadFileItem {
  url: string
  path: string
  thumb: string
  size: number
  fileType: 'image' | 'video'
}

type MediaType = 'image' | 'video' | null

// 大小限制（字节）
const MAX_IMAGE_SIZE = 10 * 1024 * 1024       // 10MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024      // 500MB

/* ================= 满意度 & 建议分类 (不变) ================= */
// ... (所有满意度、标签和字典相关的代码保持不变)
const satisfyList = ref<SatisfyItem[]>([
  {
    value: 1,
    label: '一般',
    icon: imgUrl + 'experience/satisfy_1.png',
    activeIcon: imgUrl + 'experience/satisfy_1_active.png'
  },
  {
    value: 2,
    label: '还待进步',
    icon: imgUrl + 'experience/satisfy_2.png',
    activeIcon: imgUrl + 'experience/satisfy_2_active.png'
  },
  {
    value: 3,
    label: '推荐',
    icon: imgUrl + 'experience/satisfy_3.png',
    activeIcon: imgUrl + 'experience/satisfy_3_active.png'
  },
  {
    value: 4,
    label: '非常推荐',
    icon: imgUrl + 'experience/satisfy_4.png',
    activeIcon: imgUrl + 'experience/satisfy_4_active.png'
  }
])
const satisfyValue = ref<number>(0)
const onSelectSatisfy = (val: number) => {
  satisfyValue.value = val
}

const tagList = ref<TagItem[]>([])
const tagValue = ref<string>('')
const parseRemarkIcons = (remark?: string): { icon: string; activeIcon: string } => {
  if (!remark) {
    return {
      icon: imgUrl + 'experience/tag_other.png',
      activeIcon: imgUrl + 'experience/tag_other_active.png'
    }
  }

  try {
    const jsonStr = remark.replace(/'/g, '"')
    const arr = JSON.parse(jsonStr)
    const normal = arr?.[0] ? imgUrl + arr[0] : imgUrl + 'experience/tag_other.png'
    const active = arr?.[1] ? imgUrl + arr[1] : normal
    return {
      icon: normal,
      activeIcon: active
    }
  } catch (e) {
    console.warn('remark 解析失败：', remark, e)
    return {
      icon: imgUrl + 'experience/tag_other.png',
      activeIcon: imgUrl + 'experience/tag_other_active.png'
    }
  }
}
const getDictData = async () => {
  try {
    const res: any = await getDict('sys_experience_feedback')
    if (res.code === 200 && Array.isArray(res.data)) {
      const rawList: DictItem[] = res.data
      tagList.value = rawList
        .filter(item => item.status === '0')
        .map(item => {
          const { icon, activeIcon } = parseRemarkIcons(item.remark)
          return {
            value: item.dictValue,
            dictLabel: item.dictLabel,
            icon,
            activeIcon
          }
        })
    }
  } catch (e) {
    console.error('获取建议分类字典失败：', e)
  }
}
const onSelectTag = (val: string) => {
  tagValue.value = val
}

/* ================= 建议内容 ================= */

const suggestion = ref<string>('')

/* ================= 自定义上传图片 / 视频 (核心修改) ================= */

const fileList = ref<UploadFileItem[]>([])
const mediaType = ref<MediaType>(null)

const MAX_IMAGE_COUNT = 3
const MAX_VIDEO_COUNT = 1

const currentMaxCount = computed(() =>
  mediaType.value === 'video' ? MAX_VIDEO_COUNT : MAX_IMAGE_COUNT
)

const tipsUploadLabel = computed(() =>
  mediaType.value === 'video' ? '最多上传1个视频' : '最多上传3张图片'
)

// 判断文件类型 (保持不变)
const resolveFileType = (path: string, mimeType?: string): MediaType => {
  const ft = (mimeType || '').toLowerCase()
  if (ft.startsWith('image')) return 'image'
  if (ft.startsWith('video')) return 'video'

  const ext = path.split('.').pop()?.toLowerCase()
  if (!ext) return null
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image'
  if (['mp4', 'mov', 'm4v', 'avi', 'mkv', 'flv'].includes(ext)) return 'video'
  return null
}

// 获取视频缩略图 (保持不变，使用占位图兼容处理)
const getVideoThumbnail = (filePath: string): Promise<string> => {
  return new Promise((resolve) => {
    // #ifdef APP-PLUS
    // APP端获取缩略图的复杂实现，此处简化
    resolve(imgUrl + 'experience/video_placeholder.png')
    // #endif

    // #ifndef APP-PLUS
    // H5/小程序端使用默认占位图
    resolve(imgUrl + 'experience/video_placeholder.png')
    // #endif
  })
}

// 上传文件到服务器 (使用 uploadFile 返回的 res.data.url)
const doUpload = async (filePath: string) => {
  try {
    const res: any = await uploadFile({
      url: '/file/upload', // 替换为您的上传接口
      filePath
    })

    // 假设 res.data 是一个 JSON 字符串，需要解析
    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data

    // 确保使用 uploadFile 返回的 res.data.url
    const serverUrl = data?.url || ''
    return serverUrl
  } catch (e) {
    console.error('文件上传失败：', e)
    return null
  }
}

/**
 * 启动文件选择器：图片或视频
 */
const onChooseMedia = () => {
  // 检查数量限制
  if (fileList.value.length >= currentMaxCount.value) {
    uni.showToast({ title: tipsUploadLabel.value, icon: 'none' })
    return
  }

  if (mediaType.value === 'video') {
    // 已经锁定视频，直接调用视频选择
    handleChooseVideoSelection()
  } else if (mediaType.value === 'image') {
    // 已经锁定图片，直接调用图片选择
    handleChooseImageSelection()
  } else {
    // 未锁定类型，弹窗询问用户选择
    uni.showActionSheet({
      itemList: ['选择图片', '选择视频'],
      success: (res) => {
        if (res.tapIndex === 0) { // 选择图片
          handleChooseImageSelection()
        } else if (res.tapIndex === 1) { // 选择视频
          handleChooseVideoSelection()
        }
      },
      fail: (err) => {
        console.log('用户取消选择类型', err)
      }
    })
  }
}

/**
 * 启动图片选择
 */
const handleChooseImageSelection = () => {
  uni.chooseImage({
    count: currentMaxCount.value - fileList.value.length,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (imageRes) => {
      handleChooseImageResult(imageRes)
    },
    fail: (err) => {
      console.log('选择图片失败', err)
    }
  })
}

/**
 * 启动视频选择
 */
const handleChooseVideoSelection = () => {
  uni.chooseVideo({
    count: 1, // 视频只允许选一个
    sourceType: ['album', 'camera'],
    compressed: true,
    maxDuration: 60,
    success: (videoRes) => {
      // **这里直接调用处理函数，不再嵌套 ActionSheet**
      handleChooseVideoResult(videoRes)
    },
    fail: (err) => {
      console.log('选择视频失败', err)
      // 可以添加更友好的提示
      uni.showToast({ title: '选择视频失败，请重试', icon: 'none' })
    }
  })
}


// 处理图片选择结果 (保持不变)
const handleChooseImageResult = async (res: UniApp.ChooseImageSuccessCallbackResult) => {
  const filesToProcess = res.tempFiles || res.tempFilePaths.map(path => ({ path, size: 0 }))
  
  if (!filesToProcess || filesToProcess.length === 0) return

  uni.showLoading({ title: '上传中...', mask: true })

  for (const f of filesToProcess) {
    const filePath = f.path || f.tempFilePath
    const ft = resolveFileType(filePath)
    const size = f.size || 0

    if (ft !== 'image') {
      uni.showToast({ title: '只能选择图片', icon: 'none' })
      continue
    }

    if (!mediaType.value) {
      mediaType.value = ft
    } else if (mediaType.value !== ft) {
      uni.showToast({ title: '图片和视频只能选择一种', icon: 'none' })
      continue
    }

    if (size > MAX_IMAGE_SIZE) {
      uni.showToast({ title: '单张图片不能超过10MB', icon: 'none' })
      continue
    }

    if (fileList.value.length >= MAX_IMAGE_COUNT) break

    const serverUrl = await doUpload(filePath)
    if (serverUrl) {
      fileList.value.push({
        url: serverUrl,
        path: filePath,
        thumb: '',
        size: size,
        fileType: ft as 'image'
      })
    }
  }

  uni.hideLoading()
}

// 处理视频选择结果 (已优化)
const handleChooseVideoResult = async (res: UniApp.ChooseVideoSuccessCallbackResult) => {
  const filePath = res.tempFilePath
  // **注意：在某些平台（如微信小程序），需要从 tempFiles 获取 size**
  const size = res.size || res.tempFiles?.[0]?.size || 0
  const ft: MediaType = 'video'

  if (!filePath) {
    uni.showToast({ title: '未获取到视频文件路径', icon: 'none' })
    return
  }

  uni.showLoading({ title: '上传中...', mask: true })

  // 检查类型锁定
  if (!mediaType.value) {
    mediaType.value = ft
  } else if (mediaType.value !== ft) {
    uni.showToast({ title: '图片和视频只能选择一种', icon: 'none' })
    uni.hideLoading()
    return
  }

  // 检查大小
  if (size > MAX_VIDEO_SIZE) {
    uni.showToast({ title: '单个视频不能超过500MB', icon: 'none' })
    uni.hideLoading()
    return
  }

  // 检查数量 (视频 maxCount=1)
  if (fileList.value.length >= MAX_VIDEO_COUNT) {
    uni.hideLoading()
    return
  }

  // 开始上传
  const serverUrl = await doUpload(filePath)
  if (serverUrl) {
    const thumb = await getVideoThumbnail(filePath)
    
    fileList.value.push({
      url: serverUrl,
      path: filePath,
      thumb: thumb,
      size: size,
      fileType: ft
    })
  }

  uni.hideLoading()
}

// 预览文件 (保持不变)
const onPreviewFile = (file: UploadFileItem, index: number) => {
  const isVideo = file.fileType === 'video'

  if (isVideo) {
	  // #ifdef MP-WEIXIN
		
	  // #endif
   uni.previewMedia({
     sources: fileList.value
       .filter(f => f.fileType === 'video')
       .map(f => ({ url: f.url, type: 'video' })),
     current: 0, 
     fail: (err) => {
       console.error('视频预览失败:', err)
       uni.showToast({ title: '无法播放视频', icon: 'none' })
     }
   })
  } else {
    const images = fileList.value.filter(f => f.fileType !== 'video')
    const currentIndex = images.findIndex(f => f.url === file.url)
    
    uni.previewImage({
      urls: images.map(f => f.url),
      current: currentIndex !== -1 ? currentIndex : 0,
    })
  }
}

// 删除文件 (保持不变)
const onDeleteFile = (index: number) => {
  fileList.value.splice(index, 1)
  if (!fileList.value.length) {
    mediaType.value = null // 清空列表后重置媒体类型
  }
}

/* ================= 表单校验 & 提交 (不变) ================= */

const validateForm = (): boolean => {
  if (!tagValue.value) {
    uni.showToast({ title: '请选择建议分类', icon: 'none' })
    return false
  }
  if (!suggestion.value.trim()) {
    uni.showToast({ title: '请填写您的建议', icon: 'none' })
    return false
  }
  return true
}

const onSubmit = async () => {
  if (!validateForm()) return

  uni.showLoading({ title: '提交中...', mask: true })
  
  const params: any = {
    score: satisfyValue.value,
    feedbackType: tagValue.value,
    coreFeedback: suggestion.value,
    imgUrls: fileList.value.map(item => item.url).join(',')
  }

  try {
    const res: any = await addFeedback(params)
    uni.hideLoading()
    
    if (res?.code === '200' || res?.code === 200) {
      uni.showToast({ title: '感谢您的反馈', icon: 'success' })
	  setTimeout(() => {
	  	// uni.navigateBack({
	  	// 	url: '/pages_E/experience/suggest'
	  	// })
		uni.navigateBack({
		    delta: 1,			
      });
	  }, 1000)
      satisfyValue.value = 0
      tagValue.value = ''
      suggestion.value = ''
      fileList.value = []
      mediaType.value = null
    } else {
      uni.showToast({ title: res?.msg || '提交失败', icon: 'none' })
    }
  } catch (e) {
    uni.hideLoading()
    console.error('提交失败：', e)
    uni.showToast({ title: '提交失败，请稍后重试', icon: 'none' })
  }
}

/* ================= 生命周期 (不变) ================= */

onMounted(() => {
  getDictData()
})
</script>

<style scoped lang="scss">
.feedback-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;

  &__scroll {
    flex: 1;
    padding: 0 30rpx 160rpx;
    box-sizing: border-box;
  }
}

.section {
  padding: 30rpx 0;
  background-color: #ffffff;
}

.section-header {
  display: flex;
  align-items: center;
}

.section-tips {
  font-size: 28rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.required {
  color: #E53D3D;
}

.section-sub {
  margin-left: 8rpx;
  font-size: 26rpx;
  color: #2c69c3;
}

/* 满意度行 */
.satisfy-list {
  display: flex;
  justify-content: space-between;
  border-bottom: 4rpx solid #f8f8f8;
  margin: 20rpx 20rpx 0;
  padding-bottom: 40rpx;
}

.satisfy-item {
  flex: 1;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 4px 0;
  border-radius: 8px;

  &__icon {
    width: 90rpx;
    height: 90rpx;
    margin-bottom: 8rpx;
  }

  &__text {
    font-size: 12px;
    color: #666666;
  }

  &--active {
    .satisfy-item__text {
      color: #ff7a00;
      font-weight: 500;
    }
  }
}

/* 标签栅格 */
.tag-grid {
  margin-top: 30rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.tag-item {
  width: 23%;
  height: 154rpx;
  margin-bottom: 22rpx;
  border-radius: 10rpx;
  background-color: #f4f4f8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  &__icon {
    width: 72rpx;
    height: 72rpx;
  }

  &__text {
    font-size: 24rpx;
    color: #1c1c1c;
  }

  &--active {
    background-color: #008cff;

    .tag-item__text {
      color: #ffffff;
    }
  }
}

/* 文本域 */
.suggest-textarea {
  margin-top: 30rpx;
  border-radius: 8rpx;
  min-height: 428rpx;
  border: 2rpx solid #b1b1b1;
}

/* 上传区域 */
.upload-wrapper {
  margin-top: 30rpx;
  margin-bottom: 50rpx;
}

.upload-card {
  width: 180rpx;
  height: 180rpx;
  border-radius: 8rpx;
  box-sizing: border-box;
  border: 2rpx dashed #a9a9a9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__icon {
    width: 60rpx;
    height: 60rpx;
    margin-bottom: 24rpx;
  }

  &__text {
    font-size: 24rpx;
    color: #a9a9a9;
  }
}

/* 底部提交按钮 */
.submit-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 160rpx;
  padding: 20rpx 40rpx 50rpx;
  box-sizing: border-box;
  background-color: #ffffff;
  box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.3);
  z-index: 20;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  border-radius: 16rpx;
  background-color: #000000;
  color: #ffffff;
  font-size: 32rpx;
  text-align: center;
  line-height: 90rpx;
}

.upload-file-item {
  width: 180rpx;
  height: 180rpx;
  margin-right: 16rpx;
  margin-bottom: 16rpx;
  border-radius: 8rpx;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}

.upload-file-image {
  width: 100%;
  height: 100%;
}

/* 视频容器样式 */
.video-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}

.upload-file-video-thumb {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.video-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.play-icon {
  width: 30rpx;
  height: 30rpx;
}

.upload-file-video {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  opacity: 0;
  /* 初始隐藏，点击播放按钮后可显示 */
}

/* 点击播放后显示视频 */
.upload-file-video.play {
  opacity: 1;
  z-index: 3;
}

// 新增样式来自原生 textarea
.suggest-textarea {
  margin-top: 30rpx;
  border-radius: 8rpx;
  min-height: 428rpx;
  border: 2rpx solid #b1b1b1;
  padding: 20rpx;
  box-sizing: border-box;
  position: relative; // 为了计数器定位

  &__input {
    width: 100%;
    min-height: 300rpx; // 调整高度以适应新的布局
    font-size: 28rpx;
    line-height: 1.5;
  }

  &__count {
    position: absolute;
    bottom: 10rpx;
    right: 20rpx;
    font-size: 24rpx;
    color: #999999;
  }
}

/* 文件列表容器 */
.custom-file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx; /* 使用 gap 替代 margin-right/bottom */
}

/* 文件预览项 */
.upload-file-item {
  width: 180rpx;
  height: 180rpx;
  border-radius: 8rpx;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}

/* 删除按钮 */
.delete-btn {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 8rpx;
  z-index: 10;
}

.delete-icon {
  color: #ffffff;
  font-size: 30rpx;
  line-height: 1;
}

/* 视频播放按钮 (使用图片作为播放图标) */
.video-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.play-icon {
  width: 60rpx;
  height: 60rpx;
}
</style>