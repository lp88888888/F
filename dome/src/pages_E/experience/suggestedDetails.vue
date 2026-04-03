<template>
  <view class="audit-detail-page">
    <scroll-view scroll-y class="audit-detail-page__scroll">
      <!-- 顶部审核状态 -->
      <view class="status-box">
        <image
          class="status-icon"
          :src="imgUrl + statusConfig.icon"
          mode="aspectFit"
        />
        <text class="status-text">
          {{ statusConfig.title }}
        </text>
      </view>

      <!-- 平台回复气泡 -->
      <view class="reply-box">
        <view class="reply-bubble">
          <image
            class="reply-avatar"
            :src="imgUrl + 'experience/ex_kefu.png'"
            mode="aspectFit"
          />
		  <text class="reply-value">{{replyText}}</text>
        </view>
      </view>

      <!-- 建议分类标签 -->
      <view class="section">
        <text class="section-title">建议分类标签：</text>
        <view class="tag-wrapper">
          <view class="tag-pill">
            <text class="tag-pill__text">{{ tag }}</text>
          </view>
        </view>
      </view>

      <view class="line" />

      <!-- 建议内容 + 图片/视频 -->
      <view class="section">
        <text class="section-title">建议内容：</text>
        <view class="content-wrapper">
          <text class="content-text">
            {{ content }}
          </text>

          <!-- 图片 / 视频展示区 -->
          <view class="media-list">
            <!-- 图片：最多三张 -->
            <view
              v-for="(item, index) in displayImageList"
              :key="'img-' + index"
              class="img-item"
              @tap="onPreviewImage(index)"
            >
              <image
                class="img-item__image"
                :src="item"
                mode="aspectFill"
              />
            </view>

            <!-- 视频：最多一条，有就显示 -->
            <view v-if="videoUrl" class="video-item" @tap.stop="onPreviewVideo">
              <!-- <video
                class="video-item__video"
                :src="videoUrl"
                :poster="videoPoster"
                :controls="false"
				:show-fullscreen-btn="true"
              /> -->
			   <video class="video-item__video" direction="0" :src="videoUrl" controls></video>
            </view>
          </view>
        </view>
      </view>

      <view class="line" />

      <!-- 提交时间 / 处理状态 / 审核时间 -->
      <view class="section section--flat">
        <view class="row-item">
          <text class="row-label">提交时间</text>
          <text class="row-value">{{ submitTime }}</text>
        </view>
        <view class="row-item">
          <text class="row-label">处理状态</text>
          <text class="row-value">
            {{ statusConfig.processText }}
          </text>
        </view>
        <view class="row-item" v-if="auditTime">
          <text class="row-label">审核时间</text>
          <text class="row-value">{{ auditTime }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { imgUrl } from '@/config'
import { feedbackInfo } from '@/api/home'

/**
 * 审核状态：与前端展示绑定
 * pass-通过 / pending-待处理 / reject-未通过
 */
type AuditStatus = 'pass' | 'pending' | 'reject'

// 当前状态（默认 pending，实际从接口赋值）
const status = ref<AuditStatus>('pending')

// 后端 reviewStatus 数字 -> 前端状态
// reviewStatus: 0 待处理, 1 已通过, 2 未通过
const reviewStatusMap: Record<number, AuditStatus> = {
  0: 'pending',
  1: 'pass',
  2: 'reject'
}

// 不同状态对应的文案、图标
const statusMap: Record<
  AuditStatus,
  { title: string; processText: string; icon: string; replyDefault: string }
> = {
  pass: {
    title: '审核通过',
    processText: '已通过',
    icon: 'experience/ex_success.png',
    replyDefault: '平台回复：您的建议已接受！',
	status: 1
  },
  pending: {
    title: '待处理',
    processText: '待处理',
    icon: 'experience/ex_audit.png', // 待处理图标
    replyDefault: '您的建议待处理，请耐心等待~',
	status: 0
  },
  reject: {
    title: '审核未通过',
    processText: '未通过',
    icon: 'experience/ex_fail.png', // 未通过图标
    replyDefault: '您提交的内容暂未通过审核，感谢您的反馈！',
	status: 2
  }
}

const statusConfig = computed(() => statusMap[status.value])

// 平台回复内容
const replyText = ref('')

// 分类标签文案
const tag = ref<string>('')

// 建议正文内容
const content = ref('')

// 图片列表（全部），displayImageList 只取前三张展示
const imageList = ref<string[]>([])
const displayImageList = computed(() => imageList.value.slice(0, 3))

// 视频（最多一条）
const videoUrl = ref<string>('')
const videoPoster = ref<string>('')

// 时间信息
const submitTime = ref('')
const auditTime = ref('')

/**
 * 详情接口
 */
const getInfo = async (id: string) => {
  try {
    const res: any = await feedbackInfo(id)
    if (res?.code !== 200 || !res.data) return

    const data = res.data

    // 1）状态映射：reviewStatus -> pass/pending/reject
    const reviewStatusNum = Number(data.reviewStatus)
    status.value = reviewStatusMap[reviewStatusNum] || 'pending'

    // 2）平台回复：后端 remark/remeak（你接口字段里是 remake？）没有给就用状态默认文案
    // 优先顺序：data.remark || data.remake || 默认
    replyText.value =
      data.remake || statusConfig.value.replyDefault

    // 4）建议正文
    content.value = data.coreFeedback || ''

    // 5）时间：优先用后端给的字段
    submitTime.value = data.submitTime || ''
    auditTime.value = data.reviewTime || ''

    // 6）图片 / 视频解析：从 imgUrls 拆分
    const allUrls: string[] = String(data.imgUrls || '')
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)

    const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
    const videoExts = ['mp4', 'mov', 'm4v', 'avi', 'mkv']

    const imgs: string[] = []
    let video = ''

    allUrls.forEach(url => {
      const ext = url.split('.').pop()?.toLowerCase() || ''
      if (videoExts.includes(ext)) {
        if (!video) video = url // 只取第一个视频
      } else if (imgExts.includes(ext)) {
        imgs.push(url)
      }
    })

    imageList.value = imgs
    videoUrl.value = video
    videoPoster.value = '' // 如有单独封面字段可在这里赋值

  } catch (err) {
    console.error('获取建议详情失败：', err)
  }
}

// 预览图片
const onPreviewImage = (index: number) => {
  if (!displayImageList.value.length) return
  uni.previewImage({
    urls: displayImageList.value,
    current: index
  })
}

// 预览视频（全屏）
const onPreviewVideo = () => {
  if (!videoUrl.value) return
  uni.previewMedia({
    sources: [
      {
        url: videoUrl.value,
        type: 'video',
        poster: videoPoster.value || ''
      }
    ],
    current: 0,
    showmenu: true
  })
}

// 页面入参中拿 id
onLoad(async (options: any) => {
  if (options?.id) {
    await getInfo(options.id)
	tag.value = options.tag
  }
})
</script>

<style scoped lang="scss">
.audit-detail-page {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;

  &__scroll {
    flex: 1;
    padding: 30rpx;
    box-sizing: border-box;
  }
}

/* 顶部审核状态 */
.status-box {
  margin-top: 8rpx;
  margin-bottom: 42rpx;
  display: flex;
  align-items: center;

  .status-icon {
    width: 56rpx;
    height: 56rpx;
    margin-right: 12rpx;
  }

  .status-text {
    font-size: 42rpx;
    font-weight: 600;
  }
}

/* 平台回复气泡区域 */
.reply-box {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;

  .reply-bubble {
    flex: 1;
    background-color: #f6f7f9;
    border-radius: 24rpx;
    padding: 14rpx 24rpx;
    font-size: 26rpx;
    color: #4d4f56;
    display: flex;
    align-items: center;
  }

  .reply-avatar {
    width: 72rpx;
    height: 72rpx;
    margin-right: 30rpx;
  }

  .reply-label {
    font-weight: 500;
  }

  .reply-text {
    margin-left: 4rpx;
  }
}

/* 通用块区域 */
.section {
  margin-bottom: 24rpx;
  padding: 24rpx 0;
  background-color: #ffffff;
  border-radius: 16rpx;

  &--flat {
    padding-top: 24rpx;
    padding-bottom: 24rpx;
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
}

/* 分割线 */
.line {
  width: 100%;
  height: 2rpx;
  background-color: #dfdfdf;
}

/* 标签 pill */
.tag-wrapper {
  margin-top: 20rpx;
  display: flex;
  flex-wrap: wrap;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14rpx 30rpx;
  border: 2rpx solid #171715;
  border-radius: 4rpx;
  background-color: #ffffff;
  margin-right: 16rpx;
  margin-top: 16rpx;

  &__text {
    font-size: 24rpx;
  }
}

/* 建议内容 + 媒体 */
.content-wrapper {
  margin-top: 16rpx;
}

.content-text {
  font-size: 28rpx;
}

/* 图片 / 视频容器 */
.media-list {
  margin-top: 50rpx;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

/* 图片卡片 */
.img-item {
  width: 154rpx;
  height: 154rpx;
  border-radius: 10rpx;
  overflow: hidden;
  margin-right: 24rpx;
  margin-bottom: 24rpx;
  background-color: #f4f4f4;

  &__image {
    width: 100%;
    height: 100%;
  }
}

/* 视频卡片 */
.video-item {
  width: 324rpx;
  height: 190rpx;
  border-radius: 10rpx;
  overflow: hidden;
  background-color: #000000;
}

.video-item__video {
  width: 100%;
  height: 100%;
}

/* 底部信息行 */
.row-item {
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row-label {
  font-size: 26rpx;
  color: #131313;
}

.row-value {
  font-size: 26rpx;
  color: #6b7073;
}
</style>
