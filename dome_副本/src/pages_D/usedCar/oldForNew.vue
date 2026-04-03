<template>
	<view class="page-container" :data-theme="pageTheme" >
		<up-navbar title=" " bgColor='transparent' @leftClick="toBack" :placeholder="false" :fixed="true"
			:titleStyle="{fontWeight: 'bold'}"></up-navbar>
		<image class="topImg" :src="imgUrl+'static/oldCar-old-new-back.png'" />
		<view class="pageView">
			<view class="cardBox">
				<view class="cardBox-icon1">我的旧车</view>
				<view v-if="formData.brandId" @click="brandOpen('old')" class="m-t-40">
					<view class="cardBox-car">
						<image :src="carImg?carImg:imgUrl+'del/car-img.png'" class="cardBox-car-img" />
						<view class="cardBox-car-center">
							<view class="titleFont">{{ formData.seriesName }}</view>
							<view class="textFont">{{ formData.typeName }}</view>
						</view>
					</view>
					<view class="editBox">
						<image :src="imgUrl+'static/oldCar-old-new-edit.png'" />
						<text>编辑</text>
					</view>
				</view>
				<view v-else class="formView m-t-20" @click="brandOpen('old')">
					<view class="formData-label">旧车</view>
					<view class="formData-center">
						<view class="inputBoooxxx">
							<text class="inputBoooxxx-text1" v-if="formData.typeName">{{formData.typeName}}</text>
							<text class="inputBoooxxx-text2" v-else>请选择旧车</text>
							<up-icon name="arrow-right" size="16"></up-icon>
						</view>
						<!-- <up-input placeholder="请选择旧车" readonly border="none" v-model="formData.typeName">
							<template #suffix>
								<up-icon name="arrow-right" size="16"></up-icon>
							</template>
						</up-input> -->
					</view>
				</view>
			</view>
			<view class="cardBox m-t-30">
				<view class="cardBox-icon2">意向新车</view>
				<view v-if="formData.brandNewId" @click="brandOpen('new')" class="m-t-40">
					<view class="cardBox-car">
						<image :src="carNewImg?carNewImg:imgUrl+'del/car-img.png'" class="cardBox-car-img" />
						<view class="cardBox-car-center">
							<view class="titleFont">{{ formData.seriesNewName }}</view>
							<view class="textFont">{{ formData.typeNewName }}</view>
						</view>
					</view>
					<view class="editBox">
						<image :src="imgUrl+'static/oldCar-old-new-edit.png'" />
						<text>编辑</text>
					</view>
				</view>
				<view v-else class="formView m-t-20" @click="brandOpen('new')">
					<view class="formData-label">新车</view>
					<view class="formData-center">
						<view class="inputBoooxxx">
							<text class="inputBoooxxx-text1" v-if="formData.typeNewName">{{formData.typeNewName}}</text>
							<text class="inputBoooxxx-text2" v-else>请选择新车</text>
							<up-icon name="arrow-right" size="16"></up-icon>
						</view>
						<!-- <up-input placeholder="请选择新车" readonly border="none" v-model="formData.typeNewName">
							<template #suffix>
								<up-icon name="arrow-right" size="16"></up-icon>
							</template>
						</up-input> -->
					</view>
				</view>
			</view>
           <view class="btzc" @click="toNav('/pages_D/usedCar/marketActivity')">
			   <view>补贴政策</view>
			  <view class="ckxq">
				  <view class="ckxq-text">查看详情</view>
				  <view><up-icon name="arrow-right" color="#575B66" size="16"></up-icon></view>
			  </view>
		   </view>
			<view class="cardBox m-t-30">
				<view class="cardBox-title m-b-20">四步换新·好价比出来</view>
				<view class="fl-ce-sb qtmd" style="padding:0 30rpx;">
					<view class="xian">
						<image :src="imgUrl+'xian.png'" class="xian-img"></image>
					</view>
					<view class="ItemBox">
						<image :src="imgUrl+'static/oldCar-old-new-icon1.png'" />
						<text>卖车</text>
					</view>
					<view class="ItemBox">
						<image :src="imgUrl+'static/oldCar-old-new-icon2.png'" />
						<text>车款到账</text>
					</view>
					<view class="ItemBox">
						<image :src="imgUrl+'static/oldCar-old-new-icon3.png'" />
						<text>买选新车</text>
					</view>
					<view class="ItemBox">
						<image :src="imgUrl+'static/oldCar-old-new-icon4.png'" />
						<text>领取补贴</text>
					</view>
				</view>
			</view>
			<view class="tishi m-t-20">
				<image :src="`${imgUrl}static/${check?'cart-checked':'cart-check'}.png`" mode="scaleToFill"   @click="check = !check"/>
				<view class="tishi-text" @click="path">已阅读并同意 《个人信息保护声明》，提交后将会有1-3家服务商为您提供报价服务。</view>
			</view>
		</view>
		<view class="fixeView">
			<view class="fixeView-item" @click="submit">免费估价</view>
		</view>
		<up-gap height="90"></up-gap>
		<BrandSelectPopup ref="brandSelectRef" @change="brandChange"></BrandSelectPopup>
		<popSuccess v-if="successShow" @close="successShow = false;toBack(1)"></popSuccess>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, reactive } from 'vue';
	import { toNav, toBack } from '@/utils/route';
	import { debounce, toast } from '@/utils/common';
	import BrandSelectPopup from '@/components/BrandSelectPopup/index.vue';
	import popSuccess from './components/success.vue';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	import { imgUrl } from '@/config';
	import { prCarOldForNew } from '@/api/car.ts'
	const brandSelectRef = ref(null);
	const successShow = ref(false);
	const check = ref(false);
	const formData = reactive({
		brandName: '',
		seriesName: '',
		typeName: '',
		brandId: '',
		seriesId: '',
		typeId: '',
		brandNewName: '',
		seriesNewName: '',
		typeNewName: '',
		brandNewId: '',
		seriesNewId: '',
		typeNewId: '',

	});
	const carType = ref('old');
	const carImg = ref('')
	const carNewImg = ref('');
	const path=()=>{
		uni.navigateTo({
			url:'/pages_C/xieyi/index?type='+'privacy'
		})
	}
	const brandOpen = (type : string) => {
		carType.value = type;
		brandSelectRef.value.open()
	}
	const brandChange = (event) => {
		const { brandName, seriesName, modelsName, brandId, seriesId, modelsId, models } = event;
		if (carType.value == 'old') {
			formData.brandName = brandName
			formData.seriesName = seriesName
			formData.typeName = modelsName
			formData.brandId = brandId
			formData.seriesId = seriesId
			formData.typeId = modelsId
			carImg.value = models.picture || '';
		} else {
			formData.brandNewName = brandName
			formData.seriesNewName = seriesName
			formData.typeNewName = modelsName
			formData.brandNewId = brandId
			formData.seriesNewId = seriesId
			formData.typeNewId = modelsId
			carNewImg.value = models.picture || '';
		}
	};
	const prCarOldForNewFun = async () => {
		if (!formData.brandId) return toast('请选择旧车');
		if (!formData.brandNewId) return toast('请选择新车');
		if (!check.value) return toast('请选择同意协议');
		let params={
			oldBrandId:formData.brandId,
			oldSeriesId:formData.seriesId,
			oldTypeId:formData.typeId,
			newBrandId:formData.brandNewId,
			newSeriesId:formData.seriesNewId,
			newTypeId:formData.typeNewId
		}
		let res = await prCarOldForNew(params)
		successShow.value = true
	}
	const submit = debounce(async () => {
         prCarOldForNewFun()    
	}, 300)
</script>

<style lang="scss" scoped>
	.inputBoooxxx{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		.inputBoooxxx-text1{}
		.inputBoooxxx-text2{
			color: #C1C5CD;
		}
	}
	.page-container {
		width: 750rpx;
		min-height: 100vh;
		background: var(--head-color);
	}

	.topImg {
		width: 750rpx;
		height: 528rpx;
	}

	.editBox {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
		line-height: 48rpx;

		image {
			width: 32rpx;
			height: 32rpx;
			margin-right: 10rpx;
		}
	}

	.pageView {
		padding: 0 32rpx;
		position: relative;
		z-index: 1;
		background: transparent;
		box-sizing: border-box;
		margin-top: -50rpx;
	}

	.ItemBox {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
        z-index: 99;
		image {
			width: 100rpx;
			height: 100rpx;

		}

		text {
			font-weight: 400;
			font-size: 28rpx;
			color: #333333;
			line-height: 48rpx;
			margin-top: 8rpx;
		}
	}

	.cardBox-car {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.cardBox-car-img {
			width: 220rpx;
			height: 160rpx;
		}

		.cardBox-car-center {
			width: calc(100% - 240rpx - 40rpx);

			.titleFont {
				font-weight: 500;
				font-size: 32rpx;
				color: #333333;
				line-height: 48rpx;
			}

			.textFont {
				font-weight: 400;
				font-size: 28rpx;
				color: #999999;
				line-height: 48rpx;
			}
		}
	}

	.formView {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;

		.formData-label {
			width: 160rpx;
			// font-weight: bold;
			font-size: 28rpx;
			color: #000000;
		}

		.formData-center {
			width: calc(100% - 160rpx);
		}
	}

	.title {
		font-weight: 600;
		font-size: 68rpx;
		color: #333333;
		line-height: 78rpx;
		text-align: center;
	}

	.titleText {
		font-weight: 500;
		font-size: 28rpx;
		color: #666666;
		line-height: 28rpx;
		text-align: center;
	}

	.cardBox {
		background: #fff;
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.05);
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		padding: 34rpx 38rpx;
		box-sizing: border-box;
		position: relative;

		.cardBox-icon1 {
			width: 150rpx;
			height: 48rpx;
			background: #E1F1FF;
			border-radius: 16rpx 0rpx 72rpx 0rpx;
			position: absolute;
			top: 0;
			left: 0;
			font-weight: 400;
			font-size: 24rpx;
			color: #4399E5;
			line-height: 48rpx;
			text-align: center;
		}

		.cardBox-icon2 {
			width: 150rpx;
			height: 48rpx;
			background: #FFF1E8;
			border-radius: 16rpx 0rpx 72rpx 0rpx;
			position: absolute;
			top: 0;
			left: 0;
			font-weight: 400;
			font-size: 24rpx;
			color: var(--primary-color);
			line-height: 48rpx;
			text-align: center;
		}

		.cardBox-title {
			font-weight: 500;
			font-size: 32rpx;
			color: #333333;
			line-height: 48rpx;
		}
	}

	.fixeView {
		width: 100%;
		height: 158rpx;
		background: #FFFFFF;
		position: fixed;
		z-index: 10;
		left: 0;
		bottom: 0;
		padding: 15rpx 32rpx 0 32rpx;
		box-sizing: border-box;
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(0, 0, 0, 0.03);

		.fixeView-item {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 40rpx;
			font-weight: 500;
			font-size: 30rpx;
			border: 1px solid transparent;
			background: var(--primary-color);
			color: #FFFFFF;
		}

	}

	.tishi {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;

		image {
			width: 32rpx;
			height: 32rpx;
			margin-right: 10rpx;
			margin-top: 10rpx;
		}

		.tishi-text {
			width: calc(100% - 52rpx);
			font-weight: 400;
			font-size: 24rpx;
			color: #999999;
			line-height: 48rpx;
		}

	}
	.qtmd{
		position: relative;
	}
	.xian{
		width: 100%;
		height: 10rpx;
		position: absolute;
		top: 20rpx;
	}
	.xian-img{
		width: 80%;
		height: 5rpx;
		z-index: 1;
	}
	.btzc{
		display: flex;
		justify-content: space-between;
		background: linear-gradient( 135deg, #C8DCFF 0%, #FFFFFF 80%);
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		padding:20rpx 30rpx;
	   margin-top: 30rpx;
	}
	.ckxq{
		display: flex;
		align-items: center;
	}
	.ckxq-text{
		margin-right: 10rpx;
	}
</style>