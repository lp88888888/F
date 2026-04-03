<template>
    <view>
        {{ answerText }}
    </view>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { toast } from '@/utils/common';
import { getUUID } from '@/utils/util';
import { onLoad } from '@dcloudio/uni-app';
import { getOpenToken,openChat } from '@/api/openApi';
import {formatTimestamp} from '@/utils/util';
const uuid = getUUID(); 
const queryText = ref('北京今天天气如何'); // 用户输入
const answerText = ref('');// 查询回复
const setChat = async ()=>{
    const requestTime = formatTimestamp(new Date().getTime() - 1000,'YYYY-MM-DD HH:mm:ss')
    console.log("requestTime", requestTime)
    try{
        const tokenRes = await getToken(requestTime);
        if(tokenRes.status === 200){
            // const res = await openChat(tokenRes.result,requestTime,{
            //     query:'查询西安天气',
            //     sessionId:uuid,
            //     skillId:193,
            //     params: {
            //         "query_data":formatTimestamp(new Date().getTime(),'YYYY-MM-DD')
            //     }
            // })
           const task = uni.request({
                url: 'https://super-apaas.baidu.com/copilot/v1/openApi/chat',
                 header: {
                    copilotToken:tokenRes.result,
                    requestTime:requestTime,
                    copilotAk:'copilot_ak_4qZ84MGWrRoXcMwY',
                    assistantId:118,
                },
                enableChunked: true,          // 关键 1
                responseType: 'arraybuffer',  // 关键 2
                method: 'POST',
                data:{
                    type:'IM_CLICK',
                    assistantId:118,
                     query:queryText.value,
                     sessionId:uuid,
                     skillId:190,
                    params: {
                        "query_data":formatTimestamp(new Date().getTime(),'YYYY-MM')
                    }
                },
                success: (res) => {
                    console.log(res)
                },
                fail: (err) => {
                    console.log('err',err)
                }
            })

            // 2. 监听流式片段
            let buffer = ''   // 处理半包
            task.onChunkReceived(res => {
                const text = buffer + utf8Decode(res.data) 
                // const text = buffer + TextDecoder('utf-8',{stream:true}).decode()
                const pieces = text.split('\n\n')             // SSE 以双换行分片
                buffer = pieces.pop() || ''                   // 最后一段可能不完整，先缓存
                pieces.forEach(p => {
                    if (p.startsWith('data:')) {
                    const json = p.slice(5).trim()
                    try {
                        const msg = JSON.parse(json)
                        console.log('收到消息:', msg)
                        if(msg.code == 200){
                            answerText.value = msg.data.answer
                        }
                        // ↑ 这里直接 setData / pinia / vuex 即可
                    } catch {}
                    }
                })
            })
        }else{
            toast(tokenRes.message)
        }
    }catch(e){
         toast(e.message)
    }
}
/* utf8.js (Tiny UTF-8 decoder) */
const utf8Decode =(ab)=> {
  const view = new DataView(ab)
  let out = ''
  for (let i = 0; i < view.byteLength; ) {
    const c = view.getUint8(i++)
    if (c < 0x80) { out += String.fromCharCode(c); continue }
    if (c < 0xE0) { out += String.fromCharCode(((c & 0x1F) << 6) | (view.getUint8(i++) & 0x3F)); continue }
    if (c < 0xF0) {
      const c2 = view.getUint8(i++)
      out += String.fromCharCode(((c & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (view.getUint8(i++) & 0x3F))
      continue
    }
    const c2 = view.getUint8(i++), c3 = view.getUint8(i++), c4 = view.getUint8(i++)
    out += String.fromCharCode(
      ((c & 0x07) << 18) | ((c2 & 0x3F) << 12) | ((c3 & 0x3F) << 6) | (c4 & 0x3F) - 0x10000
    )
  }
  return out
}
const ab2str = (buf) => {
    return String.fromCharCode(...new Uint8Array(buf))
}
onLoad(()=>{
    setChat()
})
</script>
<style lang="scss" scoped>

</style>