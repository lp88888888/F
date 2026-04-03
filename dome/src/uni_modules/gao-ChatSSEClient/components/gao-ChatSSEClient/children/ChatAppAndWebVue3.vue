<!-- ChatSse.vue -->
<template>
  <!-- renderjs 仍然依赖 :change:xxx 触发 -->
  <view
    :renderjsData="renderjsData"
    :change:renderjsData="chat.startChatCore"
    :stopCount="stopCount"
    :change:stopCount="chat.stopChatCore"
  />
</template>

<script setup>
/* -------------------- Vue3 逻辑层 -------------------- */
import { ref, reactive, watch, defineEmits, defineExpose } from 'vue'

/* props */
const props = defineProps({
  timeout: Number,
  heartbeatTimeout: Number,
  maxRetryCount: Number
})

/* emit */
const emit = defineEmits([
  'onInnerOpen',
  'onInnerMessage',
  'onInnerError',
  'onInnerFinish',
  'onInnerRetryuUpperlimit'
])

/* 响应式数据 */
const stopCount = ref(0)
const renderjsData = reactive({
  url: '',
  key: 0,
  body: '',
  method: '',
  timeout: props.timeout,
  heartbeatTimeout: props.heartbeatTimeout,
  maxRetryCount: props.maxRetryCount
})

/* watch props 变化，同步到 renderjsData */
watch(
  () => [props.timeout, props.heartbeatTimeout, props.maxRetryCount],
  ([t, h, m]) => {
    renderjsData.timeout = t
    renderjsData.heartbeatTimeout = h
    renderjsData.maxRetryCount = m
  }
)

/* 供父组件调用的方法 */
function stopChat() {
  stopCount.value += 1
}

function startChat(config = {}) {
  Object.assign(renderjsData, {
    ...config,
    key: renderjsData.key + 1,
    timeout: config.timeout ?? props.timeout,
    heartbeatTimeout: config.heartbeatTimeout ?? props.heartbeatTimeout,
    maxRetryCount: config.maxRetryCount ?? props.maxRetryCount
  })
}

/* 把方法暴露给父组件 */
defineExpose({ startChat, stopChat })
</script>

<!-- -------------------- renderjs 层（无改动）-------------------- -->
<script module="chat" lang="renderjs">
import { fetchEventSource } from '../fetch-event-source'

export default {
  data() {
    return { ctrl: null }
  },
  methods: {
    objToJson(obj) {
      const json = {}
      for (const k in obj) {
        const v = obj[k]
        json[k] = typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'
          ? v
          : v.toString()
      }
      return json
    },

    stopChatCore() {
      this.ctrl?.abort()
    },

    startChatCore(data) {
      const {
        url,
        body,
        headers,
        method,
        timeout,
        heartbeatTimeout,
        maxRetryCount
      } = data
      if (!url) return

      this.ctrl = new AbortController()

      fetchEventSource(url, {
        readJson: true,
        method,
        openWhenHidden: true,
        signal: this.ctrl.signal,
        timeout: timeout || 300_000,
        heartbeatTimeout: heartbeatTimeout || 120_000,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined,
        onopen: async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
          this.$ownerInstance.callMethod('open', res)
        },
        onmessage: (msg) => {
          this.$ownerInstance.callMethod('message', msg)
        },
        onerror: (err) => {
          console.error('❌ SSE错误:', err)
          this.$ownerInstance.callMethod('error', JSON.stringify(err))
          return 3000 // 3 秒后重试
        },
        onRetryuUpperlimit: () => {
          this.$ownerInstance.callMethod('onRetryuUpperlimit')
        }
      })
        .then(() => this.$ownerInstance.callMethod('finish'))
        .catch((e) => this.$ownerInstance.callMethod('error', e))
    }
  }
}
</script>