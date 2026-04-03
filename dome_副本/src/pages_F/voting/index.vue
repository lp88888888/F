<template>
	<view class="activity-page">
		<view class="banner">
			<view style="padding: 15% 30rpx 0" @click="leftClickFun">
				<up-icon name="arrow-left" color="#000" size="20"></up-icon>
			</view>
			<view class="banner-rule" @click="openRule">
				<text class="rule-icon">i</text>
				<text class="rule-text">活动规则</text>
			</view>
		</view>


		<view style="padding: 0 30rpx;box-sizing:border-box;z-index: 99;">
			<!-- 活动基本信息 -->
			<view class="activity-info">
				<view class="info-title">
					<text class="title-text">爱上高速"品牌共创"征集活动</text>
					<text class="title-tag">参与有奖</text>
				</view>
				<view class="info-meta">
					<view class="meta-text">{{objdata.openStart}}-{{objdata.openEnd}}</view>
					<view class="meta-text">{{numberPeople}}人已投稿</view>
				</view>
				<!-- 倒计时区域 -->
				<view class="countdown">
					<image :src="imgUrl+'static/bg-time.png'" class="store-bg"></image>
					<text class="countdown-tip">距离活动结束还剩</text>
					<view class="countdown-box">
						<view class="countdown-item">
							<text class="num">{{ days }}</text>
						</view>
						<view class="countdown-item">
							<text class="unit">天</text>
						</view>
						<view class="countdown-item">
							<text class="num">{{ hours }}</text>
						</view>
						<view class="countdown-item">
							<text class="unit">时</text>
						</view>
						<view class="countdown-item">
							<text class="num">{{ minutes }}</text>
						</view>
						<view class="countdown-item">
							<text class="unit">分</text>
						</view>
						<view class="countdown-item">
							<text class="num">{{ seconds }}</text>
						</view>
						<view class="countdown-item">
							<text class="unit">秒</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 搜索框 -->
			<view class="search-box">
				<input class="search-input" type="text" placeholder="搜索作品编号" v-model="searchValue"
					@input="searchWorks" />
				<view class="search-btn" @click="searchWorks">搜索</view>
			</view>

			<!-- 标签切换栏 -->
			<view class="tab-bar">
				<!-- 一级标签：活动作品/我的作品 -->
				<view class="tab-primary">
					<view class="tab-item" :class="{ active: activePrimaryTab === 0 }" @click="switchPrimaryTab(0)">
						活动作品
					</view>
					<view class="tab-item" :class="{ active: activePrimaryTab === 1 }" @click="switchPrimaryTab(1)">
						我的作品
					</view>
				</view>

				<!-- 二级标签：投票最多/最新发布（仅活动作品显示） -->
				<view class="tab-secondary" v-if="isshow">
					<view class="tab-item" :class="{ active: activeSecondaryTab === 0 }" @click="switchSecondaryTab(0)">
						投票最多
					</view>
					<view class="tab-item" :class="{ active: activeSecondaryTab === 1 }" @click="switchSecondaryTab(1)">
						最新发布
					</view>
				</view>
			</view>

			<!-- 作品列表 -->
			<scroll-view class="works-list" scroll-y refresher-enabled :refresher-triggered="refreshing"
				@refresherrefresh="onRefresh" @scrolltolower="loadMore" :refresher-threshold="80"
				:refresher-default-style="'black'">
				<ser-empty v-if="workData.length == 0 && !loading"></ser-empty>

				<!-- 下拉刷新提示 -->
				<view v-if="refreshing" class="refresh-tips">
					<u-loading-icon size="36"></u-loading-icon>
					<text>正在刷新...</text>
				</view>
				<view class="work-item" v-for="(item, index) in workData" :key="index">
					<view class="work-header">
						<view>
							<view v-if="!isshow">
								<view class="status status1" v-if="item.auditStatus==1">已通过</view>
								<view class="status status2" v-if="item.auditStatus==2">已驳回</view>
								<view class="status status3" v-if="item.auditStatus==0">待审核</view>
							</view>
							<up-image class="avatar" :src="item.avatar" width="60px" height="60px" shape="circle"
								@click="pathTo(activePrimaryTab,item.id)"></up-image>
							<view class="meta-bottom"
								style="display: flex;flex-direction: column;flex-wrap: nowrap; align-items: center;">
								<view class="author">{{ item.name }}</view>
								<view class="work-id">编号{{ item.id }}</view>
							</view>
						</view>
						<view class="work-meta">
							<view class="meta-top">
								<view @click="pathTo(activePrimaryTab,item.id)">标语:</view>
								<view @click="pathTo(activePrimaryTab,item.id)" style="width:340rpx;
								color: #628F2F;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								">{{ item.slogan }}</view>
								<view class="share-btn" @click="generatePoster(item.id)">
									<image :src="imgUrl+'static/fb-fx.png'" class="store-image"></image>
								</view>
							</view>

							<view class="meta-middle">
								<text class="rank">当前排名：{{ item.ranking }}名</text>
								<text class="votes">已获得{{ item.voteCount }}票</text>
							</view>

						</view>
					</view>

					<view class="work-images">
						<view style="position: relative;" @click="imgPreview(item.logo)">
							<image :src="item.logo" class="logo-img"></image>
							<view class="foot-ys">logo图片</view>
						</view>
						<view style="position: relative;" @click="imgPreview(item.ipImg.split(',')[0])">
							<image :src="item.ipImg.split(',')[0]" class="ip-img"></image>
							<view class="foot-ys">IP形象正面</view>
						</view>
					</view>

					<view class="work-footer">
						<text class="publish-time">发布时间:{{ item.approvalTime }}</text>
						<view class="vote-btn" @click="memSloganActivityFun(item.id)" v-if="isshow">投票</view>
					</view>
				</view>

				<!-- 加载更多提示 -->
				<view v-if="loading && !refreshing" class="load-more">
					<u-loading-icon size="36"></u-loading-icon>
					<text>加载中...</text>
				</view>

				<!-- 没有更多数据提示 -->
				<view v-if="!hasMore && workData.length > 0" class="no-more">
					<text>没有更多数据了</text>
				</view>
			</scroll-view>
		</view>


		<!-- 海报弹窗 -->
		<view class="bg-hbtc" v-if="posterShow">
			<view class="poster-container" @click="savePosterToAlbum">
				<canvas canvas-id="posterCanvas" id="posterCanvas" class="poster-canvas"></canvas>
			</view>
			<view class="djText">点击去保存图片</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="boxView">
				<view class="shearBox">
					<view class="shearBox-left"></view>
					<view class="shearBox-text">分享到</view>
					<view class="shearBox-left">
						<u-icon name="close" size="15" @click="posterShow=false"></u-icon>
					</view>
				</view>
				<view class="shareView">
					<button class="shareView-item" open-type="share">
						<u-icon :name="imgUrl+'static/shear-icon-1.png'" size="40"></u-icon>
						<text class="fontSize26">微信好友</text>
					</button>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<view class="publish-btn" v-if="isshow" @click="publishWork">发布作品</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted } from 'vue';
	import { onLoad, onReady } from '@dcloudio/uni-app';
	import { imgUrl } from '@/config';
	import { config, selectWorkPage, selectMyWorkPageW, workSubmitCount, memSloganActivity } from '@/api/voting';
	import { toNav, toBack } from '@/utils/route';
	// 定义作品数据接口
	interface WorkItem {
		id : string;
		avatar : string;
		slogan : string;
		rank : number;
		votes : number;
		author : string;
		logo : string;
		ipImage : string;
		publishTime : string;
	}

	const shearRef = ref(null);
	const objdata = ref<any>('');
	const numberPeople = ref('');

	// 搜索框绑定值
	const searchValue = ref('');

	// 标签切换状态
	const activePrimaryTab = ref(0); // 0:活动作品 1:我的作品
	const activeSecondaryTab = ref(0); // 0:投票最多 1:最新发布
	const workData = ref<any[]>([]);
	const isshow = ref(true);
	const votingxz = ref(1);
	const newxz = ref(0);
	const qrCodezjUrl = ref('');
	const posterShow = ref(false);

	// 倒计时相关
	const days = ref('00');
	const hours = ref('00');
	const minutes = ref('00');
	const seconds = ref('00');
	let countdownTimer : NodeJS.Timeout | null = null;

	// 分页相关
	const refreshing = ref(false); // 下拉刷新状态
	const loading = ref(false); // 加载更多状态
	const hasMore = ref(true); // 是否有更多数据
	const pageNum = ref(1); // 当前页码
	const pageSize = ref(20); // 每页条数
	const total = ref(0); // 总数据量
	const posterUrl = ref('');
	// 海报相关
	const posterCanvasId = 'posterCanvas';
	const posterPath = ref(''); // 生成的图片临时路径

	const pathTo = (val : any, id : string | number) => {
		if (val == 1) {
			uni.navigateTo({
				url: `/pages_F/voting/contributeDetail?id=${id}`
			})
		} else {
			uni.navigateTo({
				url: `/pages_F/voting/detail?id=${id}`
			})
		}
	}

	// 分享
	const shearOpen = () => {
		if (shearRef.value) {
			shearRef.value.open()
		} else {
			console.error('shearRef is null')
		}
	}

	// 切换一级标签
	const switchPrimaryTab = (tabIndex : number) => {
		activePrimaryTab.value = tabIndex;
		// 重置分页状态
		resetPageState();
		// 切换到我的作品时重置二级标签
		if (tabIndex === 1) {
			selectMyWorkPageWFun(true);
			isshow.value = false;
		} else {
			selectWorkPageFun(true);
			isshow.value = true;
		}
	};

	// 切换二级标签
	const switchSecondaryTab = (tabIndex : number) => {
		activeSecondaryTab.value = tabIndex;
		if (tabIndex == 1) {
			votingxz.value = 0;
			newxz.value = 1;
		} else {
			votingxz.value = 1;
			newxz.value = 0;
		}
		// 重置分页并重新加载
		resetPageState();
		selectWorkPageFun(true);
	};

	// 重置分页状态
	const resetPageState = () => {
		pageNum.value = 1;
		hasMore.value = true;
		refreshing.value = false;
		loading.value = false;
		workData.value = [];
	};

	// 搜索作品
	let searchTimer = null;
	const searchWorks = () => {
		if (searchTimer) clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			resetPageState();
			if (activePrimaryTab.value === 0) {
				selectWorkPageFun(true);
			} else {
				selectMyWorkPageWFun(true);
			}
		}, 500);
	};

	// 分享作品
	const shareWork = (item : WorkItem) => {
		console.log('分享作品', item.id);
		// 实际项目中调用uni-app分享API
	};

	// 发布作品
	const publishWork = () => {
		uni.navigateTo({ url: '/pages_F/voting/contribute' });
	};

	// 打开活动规则
	const openRule = () => {
		uni.navigateTo({ url: '/pages_F/voting/activityRule' });
	};

	// 投票操作
	const memSloganActivityFun = async (id : string | number) => {
		try {
			// 显示投票中状态
			uni.showLoading({
				title: '投票中...',
				mask: true
			});

			const res = await memSloganActivity(id);

			if (res.code == 200) {
				// 投票成功提示
				uni.showToast({
					title: '投票成功',
					icon: 'success'
				});

				// 使用防抖处理，避免频繁刷新
				setTimeout(() => {
					// 不清空现有数据，直接刷新列表
					selectWorkPageFun(true);
				}, 300);
			}
		} catch (error) {
			uni.showToast({
				title: '今日的投票次数已满，明天再来吧～',
				icon: 'none'
			});
		} finally {
			uni.hideLoading();
		}
	};

	// 下拉刷新
	const onRefresh = () => {
		if (refreshing.value) return;

		refreshing.value = true;
		pageNum.value = 1;
		hasMore.value = true;

		// 根据当前标签重新加载数据
		if (activePrimaryTab.value === 0) {
			selectWorkPageFun(true);
		} else {
			selectMyWorkPageWFun(true);
		}
	};

	// 加载更多
	const loadMore = () => {
		if (loading.value || !hasMore.value || refreshing.value) return;

		loading.value = true;
		pageNum.value += 1;

		// 根据当前标签加载更多数据
		if (activePrimaryTab.value === 0) {
			selectWorkPageFun(false);
		} else {
			selectMyWorkPageWFun(false);
		}
	};

	//查询投票活动配置
	const configFun = async () => {
		const res = await config();
		if (res.code == 200) {
			objdata.value = res.data;
			// 配置加载完成后开始倒计时
			updateCountdown();
		}
	};

	// 投稿人数
	const workSubmitCountFun = async () => {
		const res = await workSubmitCount();
		if (res.code == 200) {
			numberPeople.value = res.data;
		}
	};

	// 活动作品查询
	const selectWorkPageFun = async (isRefresh = false) => {
		if (loading.value && !isRefresh) return;

		// 如果是刷新且不是第一次加载，保留原有数据
		if (isRefresh && pageNum.value > 1) {
			// 保留当前数据，避免出现空白
			loading.value = true;
		} else if (isRefresh) {
			pageNum.value = 1;
			// 不清空数据，直接加载
			loading.value = true;
		}

		let params = {
			pageNum: pageNum.value,
			pageSize: pageSize.value,
			search: searchValue.value,
			createTimeSort: newxz.value,
			voteCountSort: votingxz.value
		};

		try {
			const res = await selectWorkPage(params);
			if (res.code == 200) {
				const newList = res.data.list || [];

				if (isRefresh) {
					workData.value = newList;
				} else {
					workData.value = [...workData.value, ...newList];
				}

				total.value = res.data.total || 0;
				hasMore.value = workData.value.length < total.value;

				// 如果数据为空，显示空状态
				if (workData.value.length === 0) {
					loading.value = false;
				}
			}
		} catch (error) {
			console.error('加载数据失败:', error);
			if (!isRefresh) {
				pageNum.value = Math.max(1, pageNum.value - 1);
			}
		} finally {
			if (isRefresh) {
				refreshing.value = false;
				loading.value = false;
				uni.stopPullDownRefresh();
			}
		}
	};

	// 个人作品查询
	const selectMyWorkPageWFun = async (isRefresh = false) => {
		if (loading.value && !isRefresh) return;

		if (isRefresh) {
			pageNum.value = 1;
			workData.value = [];
		}

		let params = {
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		};

		try {
			const res = await selectMyWorkPageW(params);
			if (res.code == 200) {
				const newList = res.data.list || [];

				if (isRefresh) {
					workData.value = newList;
				} else {
					workData.value = [...workData.value, ...newList];
				}

				// 更新总条数
				total.value = res.data.total || 0;

				// 判断是否还有更多数据
				hasMore.value = workData.value.length < total.value;
			}
		} catch (error) {
			console.error('加载数据失败:', error);
			// 加载失败时回退页码
			if (!isRefresh) {
				pageNum.value = Math.max(1, pageNum.value - 1);
			}
		} finally {
			if (isRefresh) {
				refreshing.value = false;
				uni.stopPullDownRefresh();
			}
			loading.value = false;
		}
	};

	// 倒计时逻辑
	const updateCountdown = () => {
		if (!objdata.value || !objdata.value.openEnd) return;

		// 目标结束时间
		const endTime = new Date(objdata.value.openEnd).getTime();
		const now = new Date().getTime();
		const diff = endTime - now;

		if (diff <= 0) {
			days.value = '00';
			hours.value = '00';
			minutes.value = '00';
			seconds.value = '00';
			if (countdownTimer) clearInterval(countdownTimer);
			return;
		}

		// 计算天、时、分、秒
		days.value = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
		hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
		minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
		seconds.value = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
	};

	// 预览图片
	const imgPreview = (url : string) => {
		if (!url) return;
		uni.previewImage({
			urls: [url]
		});
	};

	// 启动倒计时定时器
	const startCountdown = () => {
		if (countdownTimer) clearInterval(countdownTimer);
		countdownTimer = setInterval(updateCountdown, 1000);
	};

	const leftClickFun = () => {
		uni.navigateBack({
			delta: 1 // 返回的页面数，默认是1
		})
	}

	// 下载图片工具函数
	const downloadImage = (url) => {
		return new Promise((resolve, reject) => {
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						resolve(res.tempFilePath);
					} else {
						reject(new Error('下载图片失败'));
					}
				},
				fail: (err) => {
					reject(err);
				}
			});
		});
	};

	// 生成海报图片
	const generatePoster = async (id) => {
		// 1. 生成二维码URL
		let urlLj = `https://tydwfwpt.shanyitong.com:31082/xxzj?id=${id}`;
		const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(urlLj)}`;
		qrCodezjUrl.value = qrUrl;
		drawPoster(qrUrl);
		posterShow.value = true
	};

	// 绘制海报到canvas
	const drawPoster = async (qrUrl) => {
		return new Promise(async (resolve, reject) => {
			try {
				// 海报尺寸（使用rpx转换为px）
				const systemInfo = uni.getSystemInfoSync();
				const scale = systemInfo.windowWidth / 750; // 750rpx为设计稿宽度
				const canvasWidth = 594 * scale;
				const canvasHeight = 861 * scale;

				// 创建canvas上下文
				const ctx = uni.createCanvasContext(posterCanvasId, this);

				// 1. 绘制背景
				const bgImg = await downloadImage(imgUrl + 'static/bg-xxzj.png');
				ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);

				// 2. 绘制顶部图片
				const topImg = await downloadImage(imgUrl + 'static/bg2-xxzj.png');
				const topImgWidth = 560 * scale;
				const topImgHeight = 400 * scale;
				const topImgX = (canvasWidth - topImgWidth) / 2;
				const topImgY = canvasHeight * 0.22; // 22%位置
				ctx.drawImage(topImg, topImgX, topImgY, topImgWidth, topImgHeight);

				// 3. 绘制文字
				ctx.setFillStyle('#A3A6AF');
				ctx.setFontSize(18 * scale);
				ctx.setTextAlign('left');
				ctx.fillText('快来为我助力吧， 参加爱上高速"品牌共创"征集活动 赢好礼~',
					30 * scale, topImgY + topImgHeight + 40 * scale);

				// 4. 绘制图标和文字
				const iconSize = 50 * scale;
				const icon1 = await downloadImage(imgUrl + 'static/zj-icon7.png');
				const icon2 = await downloadImage(imgUrl + 'static/zj-icon8.png');

				// 第一个图标
				ctx.drawImage(icon1, 30 * scale, topImgY + topImgHeight + 80 * scale, iconSize, iconSize);
				ctx.setFillStyle('#000000');
				ctx.setFontSize(22 * scale);
				ctx.fillText('新鲜作品出路', 30 * scale + iconSize + 10 * scale,
					topImgY + topImgHeight + 80 * scale + iconSize / 2 + 8 * scale);

				// 第二个图标
				ctx.drawImage(icon2, 30 * scale + iconSize + 150 * scale,
					topImgY + topImgHeight + 80 * scale, iconSize, iconSize);
				ctx.fillText('积分奖励多多', 30 * scale + iconSize + 160 * scale,
					topImgY + topImgHeight + 80 * scale + iconSize / 2 + 8 * scale);

				// 5. 绘制二维码区域背景
				const qrBgHeight = 200 * scale;
				ctx.setFillStyle('#F8F8F8');
				ctx.fillRect(0, canvasHeight - qrBgHeight, canvasWidth, qrBgHeight);

				// 6. 绘制提示文字
				ctx.setFillStyle('#6E6E6E');
				ctx.setFontSize(24 * scale);
				ctx.fillText('长按识别二维码参加活动', 30 * scale, canvasHeight - 150 * scale);

				// 7. 绘制二维码
				const qrImg = await downloadImage(qrUrl);
				const qrSize = 150 * scale;
				const qrX = canvasWidth - 30 * scale - qrSize;
				const qrY = canvasHeight - 180 * scale;
				ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
				// 绘制完成
				ctx.draw(false, () => {
					// 生成临时图片
					uni.canvasToTempFilePath({
						canvasId: posterCanvasId,
						success: (res) => {
							posterPath.value = res.tempFilePath;
							uni.setStorageSync('qrCodezjUrl', posterPath.value);
							console.log(posterPath.value, 999999999)
							resolve(res.tempFilePath);
						},
						fail: (err) => {
							reject(err);
						}
					});
				});

			} catch (error) {
				reject(error);
			}
		});
	};

// 保存海报到相册
const savePosterToAlbum = () => {
  if (!posterPath.value) {
    uni.showToast({
      title: '海报生成中，请稍后',
      icon: 'none'
    });
    return;
  }

  uni.saveImageToPhotosAlbum({
    filePath: posterPath.value,
    success: () => {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });
      posterShow.value = false;
    },
    fail: (err) => {
      console.error('保存失败', err);
      if (err.errMsg.includes('auth deny')) {
        uni.showModal({
          title: '提示',
          content: '需要您授权保存图片到相册',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting();
            }
          }
        });
      } else {
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    }
  });
};
	// 挂载时启动倒计时
	onMounted(() => {
		startCountdown();
	});

	// 卸载时清除定时器
	onUnmounted(() => {
		if (countdownTimer) clearInterval(countdownTimer);
	});

	onLoad((options) => {
		configFun();
		selectWorkPageFun(true);
		workSubmitCountFun();
		if (options.q) {
			const regex = /id%3D(\d+)/i;
			const matchResult = options.q.match(regex);
			let targetValue = null;
			if (matchResult && matchResult.length > 1) {
				uni.navigateTo({
					url: `/pages_F/voting/detail?id=${matchResult[1]}`
				})
			}
		}
	});
</script>

<style scoped lang="scss">
	.activity-page {
		background-color: #F2F2F2;
		min-height: 100vh;
	}

	// Banner样式
	.banner {
		width: 100%;
		height: 520rpx;
		z-index: 1;
		background: url('https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/static/zj-bg.png');
		background-repeat: no-repeat;
		background-size: 100%;

		.banner-rule {
			position: absolute;
			top: 15%;
			right: 0;
			display: flex;
			align-items: center;
			color: #3D3D3D;
			background: #EEF9FF;
			border-radius: 12rpx 0rpx 0rpx 12rpx;
			padding: 15rpx 20rpx;

			.rule-icon {
				display: inline-block;
				width: 32rpx;
				height: 32rpx;
				line-height: 32rpx;
				text-align: center;
				background-color: rgba(0, 0, 0, 0.3);
				border-radius: 50%;
				margin-right: 8rpx;
			}

			.rule-text {
				font-size: 24rpx;
			}
		}
	}

	// 活动信息
	.activity-info {
		padding: 20rpx;
		background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%);
		box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(165, 165, 165, 0.05);
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		margin-top: -30rpx;
		z-index: 99;

		.info-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;

			.title-text {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}

			.title-tag {
				margin-left: 16rpx;
				padding: 8rpx 12rpx;
				background-color: #ff4400;
				color: #fff;
				font-size: 20rpx;
				border-radius: 8rpx;
			}
		}

		.info-meta {
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			color: #666;
		}
	}

	// 倒计时
	.countdown {
		padding: 30rpx 30rpx;
		margin-top: 10rpx;
		text-align: center;
		position: relative;

		.store-bg {
			width: 100%;
			position: absolute;
			height: 270rpx;
			left: 0;
		}

		.countdown-tip {
			font-size: 30rpx;
			color: #666;
			margin-bottom: 16rpx;
			display: block;
			margin-top: 15rpx;
		}

		.countdown-box {
			display: flex;
			justify-content: center;
			background: linear-gradient(180deg, #EF4519 0%, #FF9492 100%);
			border-radius: 17rpx 17rpx 17rpx 17rpx;
			gap: 15rpx;

			.countdown-item {
				display: flex;
				align-items: center;
				padding: 40rpx 0;

				.num {
					width: 68rpx;
					height: 96rpx;
					background: #FAFAFA;
					display: block;
					font-size: 40rpx;
					font-weight: bold;
					color: #FD5B59;
					line-height: 96rpx;
					border-radius: 14rpx;
				}

				.unit {
					display: block;
					font-size: 24rpx;
					color: #fff;
					text-align: center;
				}
			}
		}
	}

	// 搜索框
	.search-box {
		display: flex;
		align-items: center;
		padding: 20rpx 10rpx;
		margin-top: 10rpx;

		.search-input {
			flex: 1;
			height: 70rpx;
			border: 1px solid #e5e5e5;
			border-radius: 20rpx;
			padding: 0 20rpx;
			font-size: 28rpx;
			background: #fff;
		}

		.search-btn {
			width: 120rpx;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 20rpx;
			margin-left: 20rpx;
			font-size: 28rpx;
			color: #333;
			text-align: center;
		}
	}

	// 标签栏
	.tab-bar {
		margin-top: 10rpx;

		.tab-primary {
			display: flex;

			.tab-item {
				flex: 1;
				text-align: center;
				padding: 20rpx 0;
				font-size: 30rpx;
				color: #666;

				&.active {
					color: #000;
					position: relative;

					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						width: 60rpx;
						height: 6rpx;
						background-color: #7CAE40;
					}
				}
			}
		}

		.tab-secondary {
			display: flex;
			margin: 20rpx 10rpx;
			gap: 10rpx;

			.tab-item {
				padding: 16rpx 20rpx 0 0;
				font-size: 26rpx;
				color: #666;

				&.active {
					color: #7cae40;
					font-weight: bold;
				}
			}
		}
	}

	// 作品列表
	.works-list {
		height: calc(100vh - 650rpx);

		// 下拉刷新提示样式
		.refresh-tips {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 30rpx 0;
			color: #999;
			font-size: 24rpx;

			text {
				margin-top: 10rpx;
			}
		}

		// 加载更多提示样式
		.load-more {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 30rpx 0;
			color: #999;
			font-size: 24rpx;

			text {
				margin-top: 10rpx;
			}
		}

		// 没有更多数据提示样式
		.no-more {
			text-align: center;
			padding: 30rpx 0;
			color: #999;
			font-size: 24rpx;
			border-top: 1rpx solid #f0f0f0;
		}

		.work-item {
			background-color: #fff;
			margin: 20rpx 0;
			border-radius: 24rpx;
			padding: 40rpx 20rpx 20rpx;
			position: relative;

			.work-header {
				display: flex;
				gap: 30rpx;

				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}

				.work-meta {
					flex: 1;

					.meta-top {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.slogan {
							font-size: 30rpx;
							color: #000;
						}

						.share-btn {
							.store-image {
								width: 35rpx;
								height: 35rpx;
							}
						}
					}

					.meta-middle {
						margin: 8rpx 0;

						.rank {
							font-size: 24rpx;
							color: #ff9900;
							margin-right: 30rpx;
						}

						.votes {
							font-size: 24rpx;
							color: #666;
						}
					}

					.meta-bottom {}
				}
			}

			.work-footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-top: 1rpx solid #D8D8D8;
				padding: 24rpx 0 0;

				.publish-time {
					font-size: 24rpx;
					color: #999;
				}

				.vote-btn {
					padding: 10rpx 30rpx;
					border: 1px solid #628F2F;
					color: #628F2F;
					border-radius: 20rpx;
					font-size: 24rpx;
					background-color: #fff;
				}
			}
		}
	}

	.author {
		width: 120rpx;
		font-size: 24rpx;
		color: #11141A;
		margin: 10rpx 0;
		color: #628F2F;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: center;
	}

	.work-id {
		font-size: 24rpx;
		color: #848987;
	}

	// 发布作品按钮（悬浮效果）
	.publish-btn {
		position: fixed;
		top: 90%;
		left: 50%;
		transform: translate(-50%, -90%);
		width: 200rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: linear-gradient(270deg, #80A653 0%, #B2D38A 100%);
		box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(59, 1, 1, 0.3);
		color: #fff;
		border-radius: 62rpx 62rpx 62rpx 62rpx;
		font-size: 30rpx;
		z-index: 10;
		text-align: center;
	}

	.work-images {
		display: flex;
		justify-content: center;
		gap: 50rpx;
		margin: -50rpx 0 40rpx;

		.logo-img,
		.ip-img {
			width: 148rpx;
			height: 148rpx;
			border-radius: 12rpx;
		}
	}

	.status {
		width: 112rpx;
		height: 41rpx;
		border-radius: 24rpx 0rpx 24rpx 0rpx;
		position: absolute;
		text-align: center;
		font-size: 24rpx;
		color: #FFFFFF;
		line-height: 41rpx;
		top: 0;
		left: 0;
	}

	.status1 {
		background: #11A567;
	}

	.status2 {
		background: #FF0000;
	}

	.status3 {
		background: #00A6FF;
	}

	.foot-ys {
		width: 148rpx;
		height: 40rpx;
		line-height: 40rpx;
		position: absolute;
		bottom: 0;
		font-size: 20rpx;
		color: #FFFFFF;
		background: RGBA(174, 174, 174, .8);
		text-align: center;
		border-bottom-left-radius: 12rpx;
		border-bottom-right-radius: 12rpx;
	}

	.icon-sfz {
		width: 100%;
		z-index: 1;
	}

	.left {
		position: fixed;
		top: 0;
		left: 0;
	}

	::v-deep .u-navbar__content {
		background: none !important;
	}

	::v-deep .u-status-bar {
		background: none !important;
	}

	// 海报容器
	.poster-container {
		width: 650rpx;
		border-radius: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
		margin: 30% auto;
	}

	// canvas容器
	.poster-canvas {
		width: 594rpx;
		height: 861rpx;
	}

	// 海报操作按钮
	.poster-actions {
		margin-top: 40rpx;
		display: flex;
		justify-content: center;

		.save-btn {
			width: 300rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: linear-gradient(270deg, #80A653 0%, #B2D38A 100%);
			color: #fff;
			border-radius: 40rpx;
			font-size: 32rpx;
			border: none;

			&::after {
				border: none;
			}

			&:active {
				opacity: 0.9;
			}
		}
	}

	.bg-hbtc {
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		position: fixed;
		top: 0;
		z-index: 999999;
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

	.djText {
		position: absolute;
		bottom: 400rpx;
		left: 50%;
		transform: translateX(-50%);
		color: #fff;
		font-size: 30rpx;
	}
</style>