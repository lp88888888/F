<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<u-popup mode="bottom" round="10" bgColor="transparent" :safeAreaInsetBottom="false" :show="show" @close="close"
			@open="open">
			<view>
				<view class="fl-ce-ce"
					style="flex: 1;height: 800rpx;flex-direction: column;justify-content: flex-start;">
					<image class="imageBox" :src="posterUrl" mode="" @click="$previewItemImage(posterUrl)"></image>
					<view class="djText">点击去保存图片</view>
				</view>
				<view class="boxView" style="width: 750rpx;">
					<view class="shearBox">
						<view class="shearBox-left"></view>
						<view class="shearBox-text">分享到</view>
						<view class="shearBox-left">
							<u-icon name="close" size="15" @click="close"></u-icon>
						</view>
					</view>
					<view class="shareView">
						<view class="shareView-item" @click="shearApp(1)">
							<u-icon :name="imgUrl+'static/shear-icon-1.png'" size="50"></u-icon>
							<text class="fontSize26">好友</text>
						</view>
						<view class="shareView-item" @click="shearApp(2)">
							<u-icon :name="imgUrl+'static/shear-icon-2.png'" size="50"></u-icon>
							<text class="fontSize26">朋友圈</text>
						</view>
					</view>
				</view>

			</view>
		</u-popup>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<u-popup mode="bottom" round="10" bgColor="transparent" :safeAreaInsetBottom="false" :show="show" @close="close"
			@open="open">
			<view>
				<view class="fl-ce-ce" v-if="posterShow == true"
					style="flex: 1;height: 800rpx;flex-direction: column;justify-content: flex-start;">
					<image class="imageBox" :src="posterUrl" mode="" @click="$previewItemImage(posterUrl)"></image>
					<view class="djText">点击去保存图片</view>
				</view>
				<view class="boxView">
					<view class="shearBox">
						<view class="shearBox-left"></view>
						<view class="shearBox-text">分享到</view>
						<view class="shearBox-left">
							<u-icon name="close" size="15" @click="close"></u-icon>
						</view>
					</view>
					<view class="shareView">
						<button class="shareView-item" open-type="share">
							<u-icon :name="imgUrl+'static/shear-icon-1.png'" size="40"></u-icon>
							<text class="fontSize26">微信好友</text>
						</button>
						<!-- 	<button class="shareView-item" @click="posterShow = true">
								<u-icon :name="imgUrl+'static/shear-icon-3.png'" size="40"></u-icon>
								<text class="fontSize26">海报</text>
							</button> -->
						<!-- <button class="shareView-item" open-type="share">
								<u-icon :name="imgUrl+'static/shear-icon-2.png'" size="40"></u-icon>
								<text class="fontSize26">朋友圈</text>
							</button> -->
						<!-- <button class="shareView-item" open-type="share">
								<u-icon :name="imgUrl+'static/shear-icon-1.png'" size="50"></u-icon>
								<text class="fontSize26">分享</text>
							</button>
							<button class="shareView-item" @click="posterShow = true;close()">
								<u-icon :name="imgUrl+'static/shear-icon-2.png'" size="50"></u-icon>
								<text class="fontSize26">海报</text>
							</button> -->
					</view>
				</view>

			</view>
		</u-popup>
		<!-- #endif -->

		<CareerPoster v-if="pageType == 'scenicSpotTicket' && posterShow == true" :posterData="posterData"
			@change="posterChange"></CareerPoster>
		<CareerPosters v-if="pageType == 'fx' && posterShow == true" :posterData="posterData" @change="posterChange">
		</CareerPosters>
		<shopseckill v-if="pageType == 'mx' && posterShow == true" :posterData="posterData" @change="posterChange">
		</shopseckill>
		<givepresent v-if="pageType == 'zs' && posterShow == true" :posterData="posterData" @change="posterChange">
		</givepresent>
	</view>

</template>

<script setup>
	import {
		ref,
		reactive,
		computed,
		watch
	} from 'vue';
	import {
		onLoad,
		onShareAppMessage,
		onShareTimeline
	} from "@dcloudio/uni-app";
	import CareerPoster from "./poster/CareerPoster.vue";
	import CareerPosters from "./poster/CareerPosters.vue";
	import shopseckill from "./poster/shopseckill.vue";
	import givepresent from "./poster/givepresent.vue";
	// import GeneralPoster from "./poster/GeneralPoster.vue";
	// import PrizeDrawPoster from "./poster/PrizeDrawPoster.vue";
	import {
		imgUrl,
		envVersionWeixin
	} from '@/config';
	import {
		$previewItemImage
	} from '@/utils/util'

	const show = ref(false);
	const posterShow = ref(true);
	const posterUrl = ref('')
	const props = defineProps({
		pageType: {
			type: String,
			default: '',
		},
		invitationId: {
			type: String,
			default: '',
		},
		itemObj: {
			type: Object,
			default: () => {}
		}
	});
	const posterData = computed(() => {
		let obj = {}
		if (props.pageType == 'scenicSpotTicket') {
			obj = {
				logo: JSON.parse(props.itemObj.images)[0],
				title: props.itemObj.poiName,
				backImg: imgUrl + 'static/shear-bg-icon1.png',
				// backImg:'/pages_B/static/share-bg.png',
				price: props.itemObj.productGroupVoList[0].odsJjbProductVoList[0].odsJjbStockVo.salesPrice || '',
				QrCodeObj: {
					scene: `id=${props.itemObj.id || ''}&invitationId=${props.itemObj.invitationId || ''}`,
					// page:'/pages_A/login/login',
					check_path: false,
					page: 'pages_B/scenicSpotTicket/detail',
					env_version: envVersionWeixin, // 正式版为 "release"，体验版为 "trial"，开发版为 "develop"
					width: 280,
					is_hyaline: false,
				}
			}
		} else if (props.pageType == 'fx') {
			let url = uni.getStorageSync('qrCodeDataUrl')
			obj = {
				logo: url,
				backImg: imgUrl + 'static/shops_fx.png'
			}
		} else if (props.pageType == 'mx') {
			obj = {
				logo: props.itemObj.sliderPicUrls[0] || props.itemObj.picUrl ,
				title: props.itemObj.name,
				backImg: imgUrl + 'miaoshear-bg-icon.png',
				price: props.itemObj.point,
				QrCodeObj: {
					scene: `id=${props.invitationId}`,
					// page:'/pages_A/login/login',
					check_path: false,
					page: 'pages_A/points/details',
					env_version: envVersionWeixin, // 正式版为 "release"，体验版为 "trial"，开发版为 "develop"
					width: 280,
					is_hyaline: false,
				}
			}
		} else if (props.pageType == 'zs') {
			obj = {
				logo: imgUrl + 'fx-icon3.png', 
				title: '出发！带上我的心意，一起解锁美好旅途',
				backImg: imgUrl + 'zs-tc-bj.png',
				goodsImg: imgUrl + 'dsewf.png', // 商品图
				mobile: '156****6679',
				goodsImg: '', // 商品图
				goodsName: '商品名称商品名称商品名称',
				QrCodeObj: {
					scene: `id=${1}`,
					// page:'/pages_A/login/login',
					check_path: false,
					page: 'pages_A/points/details',
					env_version: envVersionWeixin, // 正式版为 "release"，体验版为 "trial"，开发版为 "develop"
					width: 280,
					is_hyaline: false,
				}
			}
		}

		console.log('---------------57575875', obj);
		console.log('---------------57575875', props.itemObj);
		return obj
	})
	const posterChange = async (event) => {
		posterUrl.value = event
	}
	const open = () => {
		// #ifdef MP-WEIXIN
		show.value = true;
		posterShow.value = true
		// #endif
		// #ifdef APP-PLUS
		show.value = true;
		posterShow.value = true
		// #endif
		// #ifdef APP-HARMONY
		uni.shareWithSystem({
			type: 'image',
			summary: '',
			imageUrl: posterUrl.value,
			success() {
				// 分享完成，请注意此时不一定是成功分享
			},
			fail() {
				// 分享失败
			}
		})
		// #endif


	}
	const close = () => {
		show.value = false
	}
	//  // 分享好友
	onShareAppMessage(() => (res) => {
		if (res.from === 'button') { // 来自页面内分享按钮
			console.log(res.target)
		}
		show.value = false
		close()
		let path = '';
		let imageUrl = '';
		if (props.pageType == 'scenicSpotTicket') {
			path = '/pages_B/scenicSpotTicket/detail?id=' + props.itemObj.id
			imageUrl = JSON.parse(props.itemObj.images)[0] || ""
		}
		if (props.pageType == 'mx') {
			path = 'pages_A/points/details?id=' + props.invitationId
			imageUrl = itemObj.sliderPicUrls[0] || ""
		}

		return {
			title: details.value.title,
			path: path,
			imageUrl: imageUrl
		}
	})
	// // 分享朋友圈
	// onShareTimeline((res) => {
	// 	if (res.from === 'button') {// 来自页面内分享按钮
	// 		console.log(res.target)
	// 	}
	// 	let path = '';
	// 	let imageUrl = '';
	// 	if(props.pageType == 'scenicSpotTicket'){
	// 		path = '/pages_B/scenicSpotTicket/detail?id=' + props.itemObj.id
	// 		imageUrl = JSON.parse(props.itemObj.images)[0] || ""
	// 	}

	// 	return {
	// 		title: details.value.title,
	// 		path: path,
	// 		imageUrl: imageUrl,
	// 	}
	// })

	const shearApp = (type) => {
		let provider = 'weixin'
		let scene = 'WXSceneSession'
		if (type == 1) {
			scene = 'WXSceneSession'
		}
		if (type == 2) {
			scene = 'WXSceneTimeline'
		}
		uni.share({
			provider: provider,
			scene: scene,
			type: 2,
			imageUrl: posterUrl.value,
			success: function(res) {
				console.log("success:" + JSON.stringify(res));
			},
			fail: function(err) {
				console.log("fail:" + JSON.stringify(err));
			}
		});
		close()
	}
	defineExpose({
		open,
		close,
	})
</script>

<style lang="scss" scoped>
	.djText {
		flex: 1;
		font-size: 28rpx;
		color: #FFFFFF;
		text-align: center;
		margin-top: 20rpx;
	}

	.imageBox {
		margin: 0 auto;
		width: 528rpx;
		height: 628rpx;
	}

	.boxView {
		background: #FFFFFF;
		border-radius: 20rpx 20rpx 0 0;

	}

	.fontSize26 {
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
		line-height: 40rpx;
	}

	.shearBox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 90rpx;
		padding: 0 30rpx;
		border-bottom: 1rpx solid #EEE;

		.shearBox-left {
			width: 90rpx;
		}

		.shearBox-text {
			flex: 1;
			text-align: center;
		}
	}

	.shareView {
		width: 100%;
		min-height: 100rpx;
		padding: 20rpx;
		padding-bottom: 40rpx;
		box-sizing: border-box;
		// display: flex;
		// align-items: center;
		// justify-content: space-around;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 10rpx;

		&-item {
			// width: 100rpx;
			// height: 100rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			text {
				margin-top: 10rpx;
			}
		}

		button {
			// width: 100rpx;
			// height: 100rpx;
			border: none !important;
			border-radius: 0;
			background: none;
			line-height: inherit;
		}

		button::after {
			border: none;
		}
	}
</style>