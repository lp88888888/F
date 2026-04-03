# hans-request

uni-app / uni-app x APP 平台的 UTS 网络请求封装（Android: OkHttp；iOS: URLSession）。

当前阶段仅保留 **网络请求模块**：
- `request(options)`（支持 `task.onHeadersReceived` / `task.onChunkReceived` / `task.onTextChunkReceived`）
- `setNetworkLogEnabled(enabled)`（开启插件内部日志）

## 平台支持

- `APP-PLUS`：Android / iOS
- 其它平台：未实现（H5 / 小程序等）

## API

### `request(options): RequestTask`

- `options.url: string`
- `options.method?: "GET" | "POST" | ...`（默认 `GET`）
- `options.data?: UTSJSONObject | string | ArrayBuffer | object`
- `options.header?: UTSJSONObject`
- `options.timeout?: number`（毫秒）
- `options.responseType?: "json" | "text" | "arraybuffer"`（默认 `json`；SSE/流式建议 `text`）
- `options.enableChunked?: boolean`（启用分块回调；iOS 必须为 `true` 才会触发 chunk 回调）
- `options.success?: (res) => void`
- `options.fail?: (err) => void`
- `options.complete?: (resOrErr) => void`

`success` 回调入参：
- `statusCode: number`
- `data: any | null`（由 `responseType` 决定：`json`/`text`/`arraybuffer`）
- `header: UTSJSONObject`
- `cookies: string[]`

`RequestTask`：
- `abort()`
- `onHeadersReceived(listener)` / `offHeadersReceived(id?)`
- `onChunkReceived(listener)` / `offChunkReceived(id?)`（回调入参 `res.data: ArrayBuffer`；uni-app 环境不支持，使用 `onTextChunkReceived`）
- `onTextChunkReceived(listener)` / `offTextChunkReceived(id?)`（回调入参 `res.text: string`；uni-app 必选，iOS 推荐）

### `setNetworkLogEnabled(enabled: boolean): void`

开启/关闭插件内部 `console.log` 输出（默认关闭）。

## 使用示例

### 普通请求（JSON）

```js
import { request } from '@/uni_modules/hans-request'

request({
  url: 'http://10.0.2.2:8788/echo?hello=world',
  method: 'GET',
  responseType: 'json',
  timeout: 60000,
  success: (res) => console.log('success', res.statusCode, res.data),
  fail: (err) => console.log('fail', err),
})
```

### POST（JSON Body）

```js
import { request } from '@/uni_modules/hans-request'

request({
  url: 'http://10.0.2.2:8788/echo',
  method: 'POST',
  responseType: 'json',
  header: { 'Content-Type': 'application/json' },
  data: { hello: 'world' },
  success: (res) => console.log('success', res.statusCode, res.data),
  fail: (err) => console.log('fail', err),
})
```

### SSE / 流式（分块回调）

> 说明：插件只提供原始文本/字节分块回调；SSE 协议解析需要在上层自行完成（见 demo 页）。

```js
import { request } from '@/uni_modules/hans-request'

function decodeChunkToText(buf) {
  const u8 = new Uint8Array(buf)
  let out = ''
  for (let i = 0; i < u8.length; i++) out += String.fromCharCode(u8[i])
  return out
}

const task = request({
  url: 'http://10.0.2.2:8788/sse?count=5&interval=200&text=tick-',
  method: 'GET',
  responseType: 'text',
  enableChunked: true,
  header: { Accept: 'text/event-stream' },
  timeout: 10 * 60 * 1000,
})

task.onHeadersReceived((res) => console.log('headers', res.statusCode, res.header))
// uni-app（非 x）：只能使用 onTextChunkReceived（onChunkReceived 在 uni-app 不可用）
if (typeof task.onTextChunkReceived === 'function') {
  task.onTextChunkReceived((res) => console.log('chunk(text)', res.text))
} else {
  task.onChunkReceived((res) => console.log('chunk(buf)', decodeChunkToText(res.data)))
}
// task.abort()
```

## 常见问题

- `responseType: "json"` 会对响应体执行 `JSON.parse`；若不是合法 JSON，会触发 `fail`（`errCode=100001`），并在 `err.data` 中保留原始文本。
- 当 `responseType: "json"` 且响应体为空字符串时（例如 204，或部分网关/鉴权失败返回空 body），`success.data` 会是 `null`（不会触发 `fail`）。此时请根据 `statusCode` 判断是否需要当作错误处理。
- iOS 访问 `http://` 可能受 ATS 限制；建议优先使用 `https://` 或按项目需要配置放行策略。
