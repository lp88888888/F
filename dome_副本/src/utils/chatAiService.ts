// utils/chatAiService.ts
import { aiUrl } from "@/config";
import { getOpenToken } from "@/api/openApi";
import { formatTimestamp, getUUID } from "@/utils/util";
// #ifdef APP-PLUS
import { request } from '@/uni_modules/hans-request'; // 仅在APP端引入
// #endif

// 定义通用的回调接口
export interface ChatOptions {
    query: string;
    sessionId: string;
    skillId?: string | number;
    params: any;
    appClientRef?: any; // 用于 Android 端的 SSE 组件实例
    onMessage: (parsedData: any, messageId: string) => void;
    onError: (err: any) => void;
    onFinish: () => void;
}

export class chatAiService {
    static async sendChat(options: ChatOptions) {
        const { query, sessionId, skillId, params, appClientRef, onMessage, onError, onFinish } = options;
        const requestTime = formatTimestamp((new Date().getTime() - 1000), 'YYYY-MM-DD HH:mm:ss');
        const messageId = getUUID();

        try {
            // 1. 统一获取 Token
            const tokenRes = await getOpenToken(requestTime);
            if (tokenRes.status !== 200) {
                throw new Error(tokenRes.message || 'Token获取失败');
            }
            const token = tokenRes.result;

            // 2. 统一请求参数和请求头
            const reqBody = {
                type: 'IM_CLICK',
                assistantId: 118,
                query: query,
                sessionId: sessionId,
                skillId: skillId || undefined,
                params: params
            };

            const headers = {
                copilotToken: token,
                requestTime: requestTime,
                copilotAk: 'copilot_ak_4qZ84MGWrRoXcMwY',
                assistantId: '118',
            };

            // 3. 多端策略路由
            // #ifdef APP-PLUS
            if (uni.getSystemInfoSync().platform === 'ios') {
                this.iosStream(reqBody, headers, messageId, options);
            } else {
                this.androidStream(reqBody, headers, messageId, appClientRef, options);
            }
            // #endif

            // #ifdef MP-WEIXIN || APP-HARMONY
            this.mpStream(reqBody, headers, messageId, options);
            // #endif

        } catch (error) {
            onError(error);
        }
    }

    // ==========================================
    // 策略 A: 微信小程序 / 鸿蒙端 (ArrayBuffer 分块)
    // ==========================================
    // #ifdef MP-WEIXIN || APP-HARMONY
    private static mpStream(reqBody: any, headers: any, messageId: string, options: ChatOptions) {
        const task = uni.request({
            url: aiUrl + '/copilot/v1/openApi/chat',
            header: headers,
            enableChunked: true,
            responseType: 'arraybuffer',
            method: 'POST',
            data: reqBody,
            success: () => options.onFinish(),
            fail: (err) => options.onError(err)
        });

        let textBuf = '';
        let byteBuf = new ArrayBuffer(0);

        task.onChunkReceived(({ data }) => {
            if (!data || data.byteLength === 0) return;
            const tmp = new Uint8Array(byteBuf.byteLength + data.byteLength);
            tmp.set(new Uint8Array(byteBuf), 0);
            tmp.set(new Uint8Array(data), byteBuf.byteLength);

            const { str, remain } = this.safeDecode(tmp.buffer);
            textBuf += str;
            byteBuf = tmp.buffer.slice(tmp.buffer.byteLength - remain);

            const pieces = textBuf.split('\n\n');
            textBuf = pieces.pop() || '';

            pieces.forEach(chunk => {
                if (!chunk.startsWith('data:')) return;
                const jsonStr = chunk.slice(5).trim();
                try {
                    if (jsonStr && jsonStr !== '[DONE]') {
                        options.onMessage(JSON.parse(jsonStr), messageId);
                    }
                } catch (e) {
                    console.warn('JSON 解析失败:', e, jsonStr);
                }
            });
        });
    }

    /* UTF-8 解码工具集 (仅小程序/鸿蒙需要) */
    private static safeDecode(ab: ArrayBuffer) {
        const view = new DataView(ab);
        let cutPos = view.byteLength;
        while (cutPos > 0 && (view.getUint8(cutPos - 1) & 0x80) !== 0) {
            cutPos--;
            const b = view.getUint8(cutPos);
            if ((b & 0xE0) === 0xC0 && view.byteLength - cutPos >= 2) break;
            if ((b & 0xF0) === 0xE0 && view.byteLength - cutPos >= 3) break;
            if ((b & 0xF8) === 0xF0 && view.byteLength - cutPos >= 4) break;
        }
        const slice = view.buffer.slice(0, cutPos);
        return { str: this.utf8Decode(slice), remain: view.byteLength - cutPos };
    }

    private static utf8Decode(ab: ArrayBuffer): string {
        const view = new DataView(ab);
        let out = '', i = 0;
        while (i < view.byteLength) {
            const byte1 = view.getUint8(i++);
            if (byte1 < 0x80) { out += String.fromCharCode(byte1); }
            else if (byte1 < 0xE0) { out += String.fromCharCode(((byte1 & 0x1F) << 6) | (view.getUint8(i++) & 0x3F)); }
            else if (byte1 < 0xF0) { out += String.fromCharCode(((byte1 & 0x0F) << 12) | ((view.getUint8(i++) & 0x3F) << 6) | (view.getUint8(i++) & 0x3F)); }
            else {
                const code = (((byte1 & 0x07) << 18) | ((view.getUint8(i++) & 0x3F) << 12) | ((view.getUint8(i++) & 0x3F) << 6) | (view.getUint8(i++) & 0x3F)) - 0x10000;
                out += String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
            }
        }
        return out;
    }
    // #endif

    // ==========================================
    // 策略 B: APP-iOS 端 (hans-request 文本分块)
    // ==========================================
    // #ifdef APP-PLUS
    private static iosStream(reqBody: any, headers: any, messageId: string, options: ChatOptions) {
        let sseBuffer = '';
        
        headers['Accept'] = 'text/event-stream';
        headers['Content-Type'] = 'application/json';

        const task = request({
            url: aiUrl + '/copilot/v1/openApi/chat',
            method: 'POST',
            responseType: 'text',
            enableChunked: true,
            timeout: 10 * 60 * 1000,
            header: headers,
            data: reqBody,
            success: () => {},
            fail: (err) => options.onError(err),
        });

        const handleChunk = (res: any) => {
            const text = res.text || '';
            if (!text) return;
            sseBuffer += text;

            let boundaryIndex;
            while ((boundaryIndex = sseBuffer.indexOf('\n\n')) !== -1) {
                const chunk = sseBuffer.substring(0, boundaryIndex);
                sseBuffer = sseBuffer.substring(boundaryIndex + 2);
                
                const dataLines = chunk.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.startsWith('data:'))
                    .map(line => line.substring(5).trim());

                const dataStr = dataLines.join('\n');
                if (!dataStr) continue;

                if (dataStr === '[DONE]') {
                    options.onFinish();
                    return;
                }

                try {
                    options.onMessage(JSON.parse(dataStr), messageId);
                } catch (e) {
                    console.warn('iOS JSON 解析失败:', dataStr);
                }
            }
        };

        if (task && typeof task.onTextChunkReceived === 'function') {
            task.onTextChunkReceived(handleChunk);
        } else if (task && typeof task.onChunkReceived === 'function') {
            task.onChunkReceived(handleChunk);
        }
    }

    // ==========================================
    // 策略 C: APP-Android 端 (gao-ChatSSEClient)
    // ==========================================
    private static androidStream(reqBody: any, headers: any, messageId: string, appClientRef: any, options: ChatOptions) {
        if (!appClientRef) {
            options.onError(new Error("缺失 SSE 组件实例"));
            return;
        }

        appClientRef.startChat({
            url: aiUrl + '/copilot/v1/openApi/chat',
            headers: headers,
            method: 'post',
            body: reqBody,
            onMessage: (msg: any) => {
                try {
                    options.onMessage(JSON.parse(msg.data), messageId);
                } catch(e) {}
            },
            onError: (err: any) => options.onError(err),
            onFinish: () => options.onFinish()
        });
    }
    // #endif
}