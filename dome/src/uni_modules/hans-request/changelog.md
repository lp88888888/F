## 1.0.2（2026-01-16）
修复异常解析问题
## 1.0.0（2026-01-07）
支持 sse
# 更新日志

本文档记录 `hans-request` 的变更。

## [1.0.1] - 2026-01-07

### 变更

- 更新 README：与当前 API 保持一致（移除 `request<T>`，补充 `data` 类型与 `success.data` 说明）。
- 更新 README：补充流式回调 `onTextChunkReceived`，并说明 uni-app（非 x）环境下无法使用 `onChunkReceived`。

## [1.0.2] - 2026-01-16

### 修复

- `responseType: "json"` 且响应体为空时不再触发 `JSON.parse('')` 异常，返回 `data: null`。
