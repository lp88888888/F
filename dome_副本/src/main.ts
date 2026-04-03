import { createSSRApp } from 'vue';
import App from './App.vue';
import uviewPlus from '@/uni_modules/uview-plus';
import { setupStore } from './store/index';
import directives from '@/directives/index';
import * as Pinia from 'pinia';

import PageDurationTracker from '@/components/PageDurationTracker.vue'
// #ifdef APP
import { createRequestPermissionListener } from '@/uni_modules/x-perm-apply-instr-v2/js_sdk/index.js';
createRequestPermissionListener()
// #endif
// #ifndef MP-WEIXIN
import showMsg from '@/tsx/message';
// #endif

export function createApp() {
	
	const app = createSSRApp(App);
	  app.use(Pinia.createPinia());
	app.use(uviewPlus,() => {
		return {
			options: {
				// 修改config对象的属性
				config: {
					// 只加载一次字体图标
					loadFontOnce: true
				}
			}
		}
	});
	app.component('PageDurationTracker', PageDurationTracker)
	app.use(directives);
	setupStore(app);
	// #ifndef MP-WEIXIN
	app.config.globalProperties['$msg'] = {
		show(msg: string, click: number) {
			showMsg(msg, click);
			
		},
	};
	// #endif
	return {
		app,
		Pinia, // 此处必须将 Pinia 返回
	};
}

// #ifndef MP
// 处理 wx.connectSocket promisify 兼容问题，强制返回 SocketTask
uni.connectSocket = (function(connectSocket) {
    return function(options) {
        console.log(options)
        options.success = options.success || function() {}
        return connectSocket.call(this, options)
    }
})(uni.connectSocket)
// #endif
