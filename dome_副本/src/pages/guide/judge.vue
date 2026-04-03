<template>
	<view class="content"></view>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app';
	// import { preload } from '@/utils/imgCache'
	onLoad(()=>{
		// 对图片偏进行缓存
		// preload([
		//       imgUrl+'BdDigitalMan/idle_2.gif',
		//       imgUrl+'BdDigitalMan/kefu.gif',
		//       imgUrl+'BdDigitalMan/bobao_2.gif',
		//     ])
		checkGuide();
	})
	const checkGuide=()=> {
		console.log("进入checkGuide判断页");
		// 思路： 检测是否有启动缓存，如果没有，就是第一次启动，第一次启动就去 启动介绍页面
		try {
			var launchFlag = uni.getStorageSync('launchFlag');
			
			if (launchFlag) { //判断本地缓存跳转首页
				uni.redirectTo({
					url: '/pages/home/home'
				});
			} else { //没有缓存进入启动页引导页
				console.log('去引导页');
				uni.redirectTo({
					url: '/pages/guide/guide'
				});
			}
			// uni.redirectTo({
			// 	url: '/pages/guide/guide'
			// });
		} catch (e) {
			console.log(e.message);
		}
	}
</script>
