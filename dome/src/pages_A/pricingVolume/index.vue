<template>
	<view>
		<view class="content">
			<image class="topImg" :src="imgUrl+'del/backImg.png'"></image>
			<view class="card cardBack1">
				<image class="cardTitleIcon" :src="imgUrl+'del/title-right-icon.png'" mode=""></image>
				<view class="card-title">
					<view class="card-title-item">
						<view class="card-title-item-iext">活动详情</view>
						<view class="card-title-item-icon"></view>
					</view>
					<image class="card-title-icon" :src="imgUrl+'del/title_icon.png'"></image>
				</view>
				<view class="card-center">
					<view class="card-center-left">
						<view class="leftTitle">活动申请</view>
						<up-gap height="8"></up-gap>
						<view class="lefttext">点击参与活动</view>
						<up-gap height="16"></up-gap>
						<view class="leftBut">参与活动</view>
						
						<view class="leftBott">
							<view class="leftBott-item">
								<view class="leftBott-item-title">没有活动</view>
								<up-gap height="8"></up-gap>
								<view class="leftBott-item-text">快去参与~</view>
							</view>
						</view>
					</view>
					<view class="card-center-right">
						<view class="card-center-right-item rightback1">
							<view class="rightView">
								<text>申请记录</text>
								<u-icon name="play-right-fill" color="#3E699D" size="12"></u-icon>
							</view>
							<u-icon :name="imgUrl+'del/icon_1.png'" size="32"></u-icon>
						</view>
						<view class="card-center-right-item rightback2">
							<view class="rightView">
								<text>前置次数查询</text>
								<u-icon name="play-right-fill" color="#A17348" size="12"></u-icon>
							</view>
							<u-icon :name="imgUrl+'del/icon_1.png'" size="32"></u-icon>
						</view>
						<view class="card-center-right-item rightback3">
							<view class="rightView">
								<text>优惠记录</text>
								<u-icon name="play-right-fill" color="#52A358" size="12"></u-icon>
							</view>
							<u-icon :name="imgUrl+'del/icon_1.png'" size="32"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<up-gap height="12"></up-gap>
			<view class="card cardBack2">
				<view class="card-title">
					<view class="card-title-item">
						<view class="card-title-item-iext">报名指南</view>
						<view class="card-title-item-icon"></view>
					</view>
					<image class="card-title-icon" :src="imgUrl+'del/title_icon.png'"></image>
				</view>
				<up-gap height="12"></up-gap>
				<view class="cardtext">
					<view class="cardtext-item">1.点击“首页-活动申请”模块</view>
					<view class="cardtext-item">2.确定要参与的活动，点击“<text class="cardtextIcon">立即申请</text>”</view>
					<view class="cardtext-item">3.核实手机号、车牌、行驶证信息，并上传身 份照片和车辆照片</view>
					<view class="cardtext-item">4.阅读并同意授权《数据授权服务协议》，点 击”提交申请"</view>
					<view class="cardtext-item">5.参与活动成功</view>
					<view class="cardtext-item">6.点击“ <text class="cardtextIcon">申请记录</text>"，可查看活动参与进度</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {ref} from 'vue';
	import { imgUrl } from '@/config';
	
	const toLink = (url)=>{
		uni.navigateTo({
			url
		})
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>