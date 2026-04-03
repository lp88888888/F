<template>
	<view class="searchView" :data-theme="pageTheme">
		<view class="container">
			<up-sticky>
				<view class="searchView">
					<up-navbar title="开票提交成功" leftIconColor="#000000" bgColor="transparent" @leftClick="toBack"
						:placeholder="true" :fixed="true"></up-navbar>
				</view>
			</up-sticky>
			<!-- 顶部成功提示区域 -->
			<view class="success-top">
				<view>
					<image :src="imgUrl + 'scusses-jcd.png'" class="success-icon" />
				</view>
				<text class="main-title">提交成功</text>
				<text class="sub-desc">我们将在10个工作日内 为您开具发票， 请耐心等待</text>
			</view>

			<!-- 奖励提示卡片 -->
			<view class="reward-card">
				<view style="margin-top: 4rpx;"><u-icon name="info-circle" size="14"></u-icon></view>
				<view class="reward-content">
					温馨提示：如需重开，请在开票成功后的30天内提交申请
				</view>
			</view>

			<!-- 底部返回按钮 -->
			<view class="btn-bar" @click="pathTo(1)">
				查看开票记录
			</view>
			<view class="btn-bars" @click="pathTo(2)">
				返回订单列表
			</view>
			
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		ref,
		reactive
	} from 'vue';
	import {
		onLoad,
		onShow,
		onHide,
		onBackPress
	} from '@dcloudio/uni-app';
	import {
		imgUrl
	} from '../../config';
	import {
		toNav,
		toBack
	} from '@/utils/route';
	import {
		useTheme
	} from '@/composables/useTheme';
	import { getById,getChargeStationErrorPoint } from '@/api/errorcorrection'
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const point=ref('')
	const tollStatiobj=ref({})
	  const getChargeStationErrorPointFun=async()=>{
		  const res = await getChargeStationErrorPoint()
		  if (res.code == 200) {
		     point.value=res.data.point
		  }
	  }
	const getByIdFun = async (id : Number | string) => {
		let params = {
			id:id
		};
		try {
			const res = await getById(params)
			if (res.code == 200) {
	           tollStatiobj.value=res.data
			}
		} catch (error) {
	
		} finally {
	
		}
	}
	const pathTo=(val)=>{
		if(val==1){
			uni.reLaunch({
				url: '/pages_F/myInvoice/invoicingcenter'
			})
		}else{
			uni.reLaunch({
				url: '/pages_F/myInvoice/index'
			})
		}
	}
	onLoad((options) => {
		getChargeStationErrorPointFun()
		if (options.id) {
			getByIdFun(options.id)
		}
	})
	// onBackPress((options) => {
	//   // 只禁止 物理键/导航栏返回
	//   if (options.from === 'backbutton') {
	//     return true
	//   }
	//   return false
	// })
</script>

<style lang="scss" scoped>
	/* 页面全局背景 */

	.container {
		box-sizing: border-box;
		padding: 120rpx 30rpx 80rpx;
		height: 26vh;
		background: var(--bgqscolor);
		display: flex;
		flex-direction: column;
	}

	/* 顶部成功区域 */
	.success-top {
		text-align: center;
		margin: 180rpx 0 46rpx;
	}

	.success-icon {
		width: 120rpx;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 40rpx;
	}

	.check-icon {
		color: #ffffff;
		font-size: 60rpx;
		font-weight: bold;
		line-height: 1;
	}

	.main-title {
		display: block;
		font-size: 36rpx;
		font-weight: 500;
		color: #333333;
		margin-bottom: 30rpx;
	}

	.sub-desc {
		width: 576rpx;
		margin: 0 auto;
		display: block;
		font-size: 28rpx;
		color: #333333;
		line-height: 36rpx;
		padding: 0 20rpx;
	}

	/* 信息卡片 */
	.info-card {
		background: #ffffff;
		border-radius: 20rpx;
		padding:20rpx 30rpx;
		margin-bottom: 60rpx;
		box-shadow: 0rpx 0rpx 20rpx 0rpx var(--bgqtmd);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 25rpx;
	}

	.card-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333333;
	}

	.status-tag {
		font-size: 28rpx;
		color: #ff9500;
		font-weight: 500;
	}

	.info-item {
		display: flex;
		margin-bottom: 20rpx;
		line-height: 1.5;
	}

	.info-item:last-child {
		margin-bottom: 0;
	}

	.item-label {
		font-size: 30rpx;
		color: #666666;
		flex-shrink: 0;
	}

	.item-value {
		font-size: 30rpx;
		color: #333333;
		flex: 1;
		text-align: right;
	}

	/* 奖励卡片 */
	.reward-card {
		background: #FFF1F1;
		border-image: linear-gradient(104deg, rgba(255, 178.27433466911316, 178.27433466911316, 1), rgba(255, 255, 255, 0.5099999904632568)) 2 2;
		border-radius: 20rpx;
		padding:16rpx 30rpx;
		display: flex;
		align-items: self-start;
		margin:40rpx 0 150rpx;
		gap:12rpx
	}

	.gift-icon {
		width: 120rpx;
		flex-shrink: 0;
		margin:-100rpx 40rpx 0 0;
	}

	.gift-img {
		width: 150rpx;
		height: 180rpx;
	}

	.reward-content {
		flex: 1;
		font-size:24rpx
	}

	.reward-title {
		display: block;
		font-size: 24rpx;
		color: #C85E5E;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.reward-desc {
		display: block;
		font-size: 24rpx;
		color: #C85E5E;
		line-height: 1.6;
	}

	/* 底部按钮 */
	.btn-wrapper {
		margin-top: auto;
	}

	.back-btn {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		background:var(--but-color-line);
		color: #ffffff;
		font-size: 34rpx;
		border-radius: 45rpx;
		border: none;
		padding: 0;
		margin: 0;
	}

	/* 去除uniapp按钮默认边框 */
	.back-btn::after {
		border: none;
	}
    .btn-bars {
 		width: 622rpx;
		height: 96rpx;
		border-radius: 50rpx;
		font-size: 30rpx;
		color: var(--primary-color);
		text-align: center;
		line-height: 96rpx;
		margin: 0 auto ;
		border:1px solid var(--secondary-color)
	}
	.btn-bar {
		width: 622rpx;
		height: 96rpx;
		background: var(--but-color-line);
		border-radius: 50rpx;
		font-size: 30rpx;
		color: #fff;
		text-align: center;
		line-height: 96rpx;
		margin: 0 auto 40rpx;
	}

	::v-deep .u-navbar__placeholder {
		height: 0 !important;
	}
</style>