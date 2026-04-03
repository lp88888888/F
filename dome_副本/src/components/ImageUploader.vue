<template>
  <view class="image-uploader">
    <!-- 已上传图片预览 -->
    <view class="preview-list">
      <view
        v-for="(image, index) in uploadedImages"
        :key="index"
        class="preview-item"
      >
        <!-- 图片 -->
        <image
          :src="image.url"
          mode="aspectFill"
          class="preview-img"
          @click="previewImage(index)"
        />

        <!-- 删除按钮 -->
        <view class="delete-btn" @click="removeImage(index)">
          <uni-icons type="close" size="16" color="#fff"></uni-icons>
        </view>

        <!-- 上传进度 -->
        <view v-if="image.uploading" class="upload-progress">
          <progress :percent="image.progress" stroke-width="6" />
        </view>
      </view>

      <!-- 添加按钮 -->
      <view
        v-if="uploadedImages.length < max"
        class="add-btn"
        @click="selectImage"
      >
        <uni-icons type="plusempty" size="30" color="#ccc"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 接收 props
const props = defineProps({
  max: {
    type: Number,
    default: 9
  },
  uploadUrl: {
    type: String,
    required: true
  },
  header: {
    type: Object,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['success', 'remove', 'fail'])

// 已上传的图片列表
const uploadedImages = ref([])

// 计算属性：是否还能添加
const canAdd = computed(() => uploadedImages.value.length < props.max)

// 选择图片
const selectImage = () => {
  if (!canAdd.value) return

  uni.chooseImage({
    count: props.max - uploadedImages.value.length,
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFiles = res.tempFiles
      tempFiles.forEach(file => {
        uploadImage(file)
      })
    },
    fail: (err) => {
      console.error('选择图片失败', err)
      uni.showToast({ title: '选择图片失败', icon: 'none' })
    }
  })
}

// 上传图片
const uploadImage = (file) => {
  const imageItem = {
    url: file.tempFilePath,
    tempFilePath: file.tempFilePath,
    name: file.name || `image_${Date.now()}.jpg`,
    uploading: true,
    progress: 0
  }

  // 添加到列表
  uploadedImages.value.push(imageItem)

  const index = uploadedImages.value.length - 1

  // 上传文件
  const uploadTask = uni.uploadFile({
    url: props.uploadUrl,
    filePath: file.tempFilePath,
    name: 'file', // 后端接收字段名
    header: props.header,
    formData: {
      // 可附加额外参数
      filename: imageItem.name
    },
    success: (res) => {
      if (res.statusCode === 200) {
        try {
          const data = JSON.parse(res.data)
          // 假设后端返回 { code: 0, data: { url: 'https://xxx.com/1.jpg' } }
          if (data.code === 0 || data.success) {
            uploadedImages.value[index].url = data.data.url
            uploadedImages.value[index].uploading = false
            uploadedImages.value[index].serverData = data.data

            // 触发成功事件
            emit('success', data.data, index)
          } else {
            failHandle(index, data.message || '上传失败')
          }
        } catch (e) {
          failHandle(index, '解析响应失败')
        }
      } else {
        failHandle(index, `HTTP ${res.statusCode}`)
      }
    },
    fail: (err) => {
      failHandle(index, err.errMsg || '上传失败')
    }
  })

  // 监听上传进度
  uploadTask.onProgressUpdate((res) => {
    uploadedImages.value[index].progress = res.progress
  })
}

// 失败处理
const failHandle = (index, msg) => {
  uploadedImages.value[index].uploading = false
  uni.showToast({ title: msg, icon: 'none', duration: 2000 })
  emit('fail', msg, index)
}

// 删除图片
const removeImage = (index) => {
  const item = uploadedImages.value[index]
  uploadedImages.value.splice(index, 1)
  emit('remove', item, index)
}

// 预览图片
const previewImage = (index) => {
  const urls = uploadedImages.value.map(img => img.url)
  uni.previewImage({
    current: index,
    urls: urls
  })
}

// 暴露方法给父组件
defineExpose({
  uploadedImages,
  clear: () => {
    uploadedImages.value = []
  },
  getUrls: () => {
    return uploadedImages.value
      .filter(img => !img.uploading && img.serverData?.url)
      .map(img => img.serverData.url)
  }
})
</script>

<style scoped>
.image-uploader {
  padding: 20rpx 0;
}

.preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.preview-item {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #f4333c;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.upload-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10rpx;
  background: rgba(0, 0, 0, 0.5);
}

.add-btn {
  width: 160rpx;
  height: 160rpx;
  background-color: #f5f5f5;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>