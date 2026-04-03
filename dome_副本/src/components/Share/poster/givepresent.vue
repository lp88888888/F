<template>
	<view class="pageView">
		<!-- 绘制canvas（隐藏） -->
		<canvas class="mycanvas" canvas-id="mycanvas"
			:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>
		<!-- 预览生成的海报 -->
		<!-- <image v-if="postUrl" class="imgBox" :src="postUrl" mode="widthFix"></image> -->
	</view>
</template>

<script>
	import {
		toast
	} from '@/utils/common';
	import {
		shareQrCode
	} from '@/api/config';
	import {
		base64ToPath
	} from '@/js_sdk/mmmm-image-tools/index';
	import {
		imgUrl,
		envVersionWeixin
	} from '@/config';
	export default {
		data() {
			return {
				canvasWidth: 594,
				canvasHeight: 881,
				postUrl: ''
			};
		},
		props: {
			posterData: {
				type: Object,
				required: true,
				default: () => ({
					backImg: '', // 背景图（可选）
					logo: '', // 礼物盒图标
					title: '',
					mobile: '156****6679',
					goodsImg: '', // 商品图
					goodsName: '商品名称商品名称商品名称',
					QrCodeObj: {}, // 二维码参数
					qrCode: '' // 或直接传 base64
				})
			}
		},
		mounted() {
			this.setPoster();
		},
		methods: {
			async setPoster() {
				try {
					const [back, gift, goods, qrBase64] = await Promise.all([
						this.downloadToPath(this.posterData.backImg || '/static/poster/back.png'),
						this.downloadToPath(this.posterData.logo || '/static/poster/gift.png'),
						this.downloadToPath(this.posterData.goodsImg),
						this.posterData.qrCode ?
						Promise.resolve(this.posterData.qrCode) :
						shareQrCode(this.posterData.QrCodeObj).then(r => r.data)
					]);

					const qrPath = await this.base64ToTempPath(`data:image/png;base64,${qrBase64}`);
					const ctx = uni.createCanvasContext('mycanvas', this);

					// 1. 背景图
					ctx.drawImage(back, 0, 0, this.canvasWidth, this.canvasHeight);



					// 4. 手机号
					this.drawText(ctx, 152, 361, `${this.posterData.mobile}，送你一份礼物`, '#A1591F', 24);

					// 5. 圆角商品图
					this.drawRoundImg(ctx, goods, 211, 410, 154, 154, 15);

					// 6. 商品名称
					this.drawText(ctx, 182, 592, this.posterData.goodsName, '#4D2402', 18);

					// 8. 二维码 & 文字
					this.drawQr(ctx, qrPath);

					// 10. 一次性 draw
					setTimeout(() => {
						ctx.draw(false, () => this.toTempFile(ctx));
					}, 100);
				} catch (e) {
					uni.hideLoading();
					toast(e.message || '海报生成失败');
					console.error(e);
				}
			},
			downloadToPath(url) {
				return new Promise((resolve, reject) => {
					uni.downloadFile({
						url,
						success: res => {
							if (res.statusCode === 200) resolve(res.tempFilePath);
							else reject(new Error('图片下载失败'));
						},
						fail: err => reject(err)
					});
				});
			},

			drawText(ctx, x, y, text, color, size) {
				ctx.setFontSize(size);
				ctx.setFillStyle(color);
				ctx.fillText(text, x, y);
			},

			drawRoundImg(ctx, path, x, y, w, h, r) {
				ctx.save();
				ctx.beginPath();
				ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
				ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, 0);
				ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
				ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(path, x, y, w, h);
				ctx.restore();
			},

			drawQr(ctx, qrPath) {
				const x = 430,
					y = 706,
					s = 156;
				ctx.drawImage(qrPath, x, y, s, s);
			},

			toTempFile(ctx) {
				const sys = uni.getSystemInfoSync();
				const scale = sys.pixelRatio;
				uni.canvasToTempFilePath({
					canvasId: 'mycanvas',
					destWidth: this.canvasWidth * scale,
					destHeight: this.canvasHeight * scale,
					quality: 1,
					success: res => {
						this.postUrl = res.tempFilePath;
						this.$emit('change', res.tempFilePath);
					},
					fail: err => toast('生成图片失败')
				}, this);
				uni.hideLoading();
			},

			base64ToTempPath(base64) {
				return new Promise((resolve, reject) => {
					const data = base64.replace(/^data:image\/\w+;base64,/, '').replace(/\s/g, '');
					//#ifdef APP-HARMONY
					base64ToPath(base64)
					  .then(path => {
					    console.log('09899-090',path)
						resolve(path)
					  })
					  .catch(error => {
						reject(error)
					  })
					//#endif
					//#ifdef MP-WEIXIN
					const fsm = uni.getFileSystemManager();
					const file = `${wx.env.USER_DATA_PATH}/qr_${Date.now()}.png`;
					fsm.writeFile({
						filePath: file,
						data,
						encoding: 'base64',
						success: () => resolve(file),
						fail: e => reject(e)
					});
					//#endif
					//#ifdef APP-PLUS
					const bitmap = new plus.nativeObj.Bitmap('qr');
					bitmap.loadBase64Data(data, () => {
						const file = `_doc/qr_${Date.now()}.png`;
						bitmap.save(file, {
							overwrite: true
						}, () => {
							bitmap.clear();
							resolve(plus.io.convertLocalFileSystemURL(file));
						}, err => {
							bitmap.clear();
							reject(err);
						});
					}, err => {
						bitmap.clear();
						reject(err);
					});
					//#endif
					//#ifdef H5
					resolve(base64);
					//#endif
					//#ifndef MP-WEIXIN || APP-PLUS || H5 || APP-HARMONY
					reject(new Error('当前平台不支持'));
					//#endif
				});
			}
		}
	};
</script>

<style scoped>
	.mycanvas {
		position: fixed;
		top: -9999px;
		left: -9999px;
		z-index: -1;
		background: transparent;
	}

	.pageView {
		width: 584rpx;
		height: 881rpx;
		margin: 0 auto;
	}

	.imgBox {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}
</style>