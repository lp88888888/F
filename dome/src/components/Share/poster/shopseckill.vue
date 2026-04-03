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

	export default {
		data() {
			return {
				canvasWidth: 528,
				canvasHeight: 701,
				postUrl: ''
			};
		},
		props: {
			posterData: {
				type: Object,
				required: true,
				default: () => ({
					backImg: '',
					backImg1: '',
					logo: '',
					title: '',
					price: 0,
					QrCodeObj: {}
				})
			}
		},
		mounted() {
			this.setPoster();
		},
		methods: {
			/* 入口：先并行下完所有图片，再统一绘图 */
			async setPoster() {
				// uni.showLoading({ title: '海报生成中…' });
				try {
					const [back, logo, qrBase64] = await Promise.all([
						this.downloadToPath(this.posterData.backImg),
						this.downloadToPath(this.posterData.logo),
						// this.downloadToPath(this.posterData.backImg1),
						shareQrCode(this.posterData.QrCodeObj).then(r => r.data)
					]);
					// const reedd = await base64ToPath(`${qrBase64}`)
					// console.log('099--0-90-00-9-0-990-=',reedd);
					const qrPath = await this.base64ToTempPath(`data:image/png;base64,${qrBase64}`);
					
					const ctx = uni.createCanvasContext('mycanvas', this);
					/* 1. 背景图 */
					ctx.drawImage(back, 0, 0, this.canvasWidth, this.canvasHeight);
					/* 2. 圆角商品图 */
					this.drawRoundImg(ctx, logo, 20, 120, 488, 224, 15);
					// this.drawRoundImg1(ctx, backImg1, 0, 0, 400, 52);
					/* 3. 标题 */
					this.drawText(ctx);
					/* 4. 价格 */
					this.drawPrice(ctx);
					/* 5. 二维码 & 文字 */
					this.drawQr(ctx, qrPath);
					/* 6. 一次性 draw */
					setTimeout(() => {
						ctx.draw(false, () => this.toTempFile(ctx));
					}, 100)

				} catch (e) {
					uni.hideLoading();
					toast(e.message || '海报生成失败');
					console.error(e);
				}
			},

			/* 通用下载 */
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

			/* 圆角裁剪画商品图 */
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
			drawRoundImg1(ctx, path, x, y, w, h, r) {
				ctx.drawImage(path, x, y, w, h);
			},

			/* 标题 */
			drawText(ctx) {
				ctx.setFontSize(28);
				ctx.setFillStyle('#333');
				ctx.fillText(this.posterData.title || '', 38, 414);
			},

			/* 价格 */
			drawPrice(ctx) {
				const x = 38,
					y = 468,
					price = String(this.posterData.price || 0);
				ctx.setFillStyle('#FF5405');
				ctx.setFontSize(20);
				ctx.fillText('积分', x, y);
				ctx.setFontSize(38);
				ctx.fillText(price, x + 40, y);
				ctx.setFillStyle('#666');
				ctx.setFontSize(22);
				ctx.fillText('起', x + 40 + price.length * 22, y);
			},

			/* 二维码 & 右侧文字 */
			drawQr(ctx, qrPath) {
				const x = 44,
					y = 534,
					s = 110;
				ctx.setFillStyle('#000');
				ctx.setFontSize(28);
				ctx.fillText('兑换商品', x + s + 20, y+50 );
				ctx.setFillStyle('#666');
				ctx.setFontSize(24);
				ctx.fillText('扫码打开', x + s + 20, y + s/2+50);
				ctx.drawImage(qrPath, x, y, s, s);
			},

			/* 转临时文件 */
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

			/* base64 转临时路径（兼容微信/App/H5） */
			base64ToTempPath(base64) {
				return new Promise((resolve, reject) => {
					// const data = base64.replace(/^data:\w+\/\w+;base64,/, '');
					const data = base64.replace(/^data:image\/\w+;base64,/, '').replace(/\s/g, '');
					// const data = base64.replace(/^data:image\/\w+;base64,/, '');
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
		width: 528rpx;
		height: 628rpx;
		margin: 0 auto;
	}

	.imgBox {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}
</style>