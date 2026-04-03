<template>
	<view class="page-container" :style="{ backgroundColor: '#FCFFFC' }" :data-theme="pageTheme">
		<!-- 占位：给顶部自定义导航预留高度 -->
		<view :style="{ height: topBoxHeight + 'px' }"></view>

		<!-- 一键救援悬浮 -->
		<view class="kf-box" @click="toNav('/pages_A/roadRescue/index')">
			<image class="kf-img" :src="`${imgUrl}static/new_kf_img.png`"></image>
			<text class="kf-text">一键救援</text>
		</view>

		<!-- 积分 @click="toNav('/pages_D/volumePricing/discount/index')" -->
		<view class="jf_box">
			<!-- <image class="jf_img" src="/static/tabbar/tabbar-jy.png" mode="heightFix"></image> -->
			<text class="jf_text">我的积分：</text>
			<text class="jf_text jf_text1">{{ getAlljf() }}</text>
			<text class="jf_text jf_text2">分</text>
			<!-- <text class="jf_text">已连续签到：</text>
			<text class="jf_text jf_text1">0</text>
			<text class="jf_text">天</text>
			<view class="jf_btn" @click="toast('功能开发中')">
				<text class="jf_btn_text">签到</text>
			</view> -->
		</view>

		<!-- 头部图片 -->
		<view class="header-box">
			<swiper class="top-swiper" circular autoplay interval="3500" duration="500" indicator-dots
				indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#ffffff">
				<swiper-item v-for="(item, index) in headerBanners" :key="index" @click="PageTo(item)">
					<image class="top-img" :src="item.imageUrl" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 小猴模块 -->
		<view class="monkey_box">
			<image class="monkey_box_bg" :src="`${imgUrl}redindex/monkey_bg.png`"></image>
			<image class="monkey_box_img" @click="toNav('/pages_E/digitalHuman/index')"
				:src="icoUrl + 'BdDigitalMan/idle_6.gif'" mode="aspectFill"></image>

			<view class="monkey_box_count">
				<!-- <text class="monkey_box_count_tips">点点我或说出"小猴小猴"唤醒我哦~</text> -->
				<view class="monkey_box_count_seach" @click="handleChangeDwinput">
					<image class="monkey_box_count_seach_img" :src="`${imgUrl}redindex/monkey_mike.png`"></image>
					<!-- <input class="monkey_box_count_seach_input" type="text" placeholder="搜地点、查路况、找服务" /> -->
					<text class="monkey_box_count_seach_input" style="color: #909599">搜地点、查路况、找服务</text>
					<image class="monkey_box_count_seach_img1" :src="imgUrl + 'static/monkey_confirm.png'"></image>
				</view>
			</view>
		</view>

		<view class="page-view">
			<!-- 高速路况 -->
			<view class="card">
				<view class="card-icon-card-header">
					<view class="card-icon-card-header_lt">
						<image class="card-icon-card-header-img" :src="`${imgUrl}redindex/icon_bg.png`"></image>
						<text class="title-text-primary">高速路况</text>
						<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
					</view>
				</view>

				<view class="card-item">
					<view class="route-card">
						<view class="route-item" @click="openMap('start')">
							<text class="route-place">{{ mylocationinfo.name || '我的位置' }}</text>
							<text class="route-location" v-if="mylocationinfo.name">{{ mylocationinfo.address }}</text>
						</view>
						<image class="arrow-img" :src="`${imgUrl}redindex/to_line.png`"></image>
						<view class="route-item" @click="openMap('end')">
							<text class="route-place">{{ endlocationinfo.name || '目的地' }}</text>
							<text class="route-location"
								v-if="endlocationinfo.name">{{ endlocationinfo.address }}</text>
						</view>
					</view>

					<view v-if="routeByLngLat.totalDistance" class="router_info">
						<view class="router_info_times">
							<text class="router_info_times_1">{{ routeByLngLat.totalDistance }}km</text>
							<text class="router_info_times_2">&nbsp;&nbsp;.&nbsp;&nbsp;</text>
							<text class="router_info_times_3">约{{ routeByLngLat.totalTime }}</text>
						</view>

						<scroll-view class="router_info_length" scroll-x :show-scrollbar="false">
							<view class="router_info_length_item" v-if="routeByLngLat.cityDistanceStart">
								<text
									class="router_info_length_item_text">城市通行{{ routeByLngLat.cityDistanceStart }}公里</text>
							</view>
							<view class="router_info_length_item bg_o" v-if="routeByLngLat.highwayDistance">
								<text
									class="router_info_length_item_text">高速通行{{ routeByLngLat.highwayDistance }}公里</text>
							</view>
							<view class="router_info_length_item" v-if="routeByLngLat.cityDistanceEnd">
								<text
									class="router_info_length_item_text">城市通行{{ routeByLngLat.cityDistanceEnd }}公里</text>
							</view>
						</scroll-view>

						<view class="route-timeline">
							<view class="tl-item" v-for="(node, index) in timelineNodes" :key="index">
								<!-- 左侧：圆点 + 竖线 -->
								<view class="tl-left" v-if="node.km != 0">
									<view class="tl-dot" :class="node.dotClass">
										<template v-if="node.dotType === 'flag'">
											<text class="flag-text">{{ node.flagText }}</text>
										</template>
										<template v-else>
											<text class="km-val">{{ node.km }}</text>
											<text class="km-unit">km</text>
										</template>
									</view>

									<view v-if="index !== timelineNodes.length - 1" class="tl-line"
										:class="node.lineClass"></view>
								</view>

								<!-- 右侧：标题行 + 内容面板 -->
								<view class="tl-right" v-if="node.km != 0">
									<view class="tl-head">
										<view class="tl-title-wrap">
											<text class="tl-title" :class="node.titleClass">{{ node.title }}</text>
											<image v-if="node.weatherIcon"
												:src="`https://tranalioss.shanyitong.com/wximage/trip-pro/weather/${node.weatherIcon}.png`"
												class="icon-32 m-r-10" mode="heightFix"></image>
											<text v-if="node.conditiontxt" class="tl-sub">{{ node.conditiontxt }}</text>
											<text v-if="node.subTitle" class="tl-sub">{{ node.subTitle }}</text>
											<view v-if="node.rightText" class="tl-right-text"
												@tap.stop="node.onRightTextClick && node.onRightTextClick(node)">
												<text
													:class="['', 'rt-muted', 'rt-danger', 'rt-success'][node.rightClass]">{{ node.rightText }}</text>
												<image v-if="node.rightArrow" class="tl-arrow-tri"
													:src="`${imgUrl}static/home_line_arrow${node.rightClass}.png`"
													mode=""></image>
											</view>
										</view>

										<view v-if="node.badge" class="tl-right-area">
											<!-- 右侧胶囊按钮：绿通预约 / 以量定价 -->
											<view v-if="node.badge" class="tl-badge" :class="node.badge.class"
												@tap.stop="node.badge.onClick && node.badge.onClick(node)">
												{{ node.badge.text }}
											</view>
										</view>
									</view>

									<!-- 灰色：ETC/人工通道 -->
									<view v-if="node.panel === 'channels' && node.channels.length"
										class="tl-panel tl-panel-gray">
										<scroll-view class="tl-panel_scroll" scroll-x="true" :show-scrollbar="false">
											<view class="ch-row" v-for="(ch, ci) in node.channels" :key="ci">
												<text class="ch-name"
													:style="{ opacity: ch.laneType === 1 ? '1' : '0' }">ETC</text>
												<view class="bar" :class="ch.status ? 'bar-green' : 'bar-red'"> </view>
												<!-- <view class="ch-bars"></view> -->
											</view>
										</scroll-view>
									</view>
									
									<view class="rout_box" v-if="node.routinfo">
										<view class="rout_title">
											<image class="rout_img" :src="`${imgUrl}static/rout_icon.png`" mode=""></image>
											<text class="rout_text">路况信息</text>
										</view>
										<view class="rout_count">
											<text class="rout_count_txt">{{node.routinfo}}</text>
										</view>
									</view>

									<!-- 灰色：占用车道 + 时间 -->
									<view v-else-if="node.panel === 'lane'"
										class="tl-panel tl-panel-gray tl-panel-lane">
										<view class="lane-row">
											<text class="ch-name">占用车道</text>
											<view class="ch-bars">
												<view class="bar" v-for="(b, bi) in node.laneBars" :key="bi" :class="b">
												</view>
											</view>
											<text class="lane-time">{{ node.laneTime }}</text>
										</view>
									</view>

									<!-- 绿色：服务区 icon + 了解详情 -->
									<view v-else-if="node.panel === 'service'" class="tl-panel tl-panel-green">
										<view style="flex: 1">
											<view v-if="(node.serviceAreas || []).length" class="svc-icons">
												<view class="svc-icon" v-for="(it, si) in node.serviceAreas || []"
													:key="si">
													<image class="service-img" :src="it.serviceInfoPicUrl"></image>
												</view>
											</view>
										</view>
										<view class="svc-btn" @click="goServiceDetail(node)"> 了解详情 </view>
									</view>

									<!-- 无面板占位 -->
									<view v-else class="tl-spacer"></view>
								</view>
							</view>
						</view>

						<view class="router_go_btn" @click="navigateToApp()">
							<text class="router_go_btn_text">按上述路线开始导航 {{ '>' }} </text>
						</view>
					</view>

					<view v-if="!endlocationinfo.name" class="grid-box">
						<view class="grid-box-item" style="width: 140rpx" v-for="(item, index) in lkTabs" :key="index"
							@click="tabsClick(item)">
							<image class="grid-box-img" :src="item.iconUrl"></image>
							<text class="grid-box-text">{{ item.entryName }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 优惠通行 -->
			<view v-if="vehicleType == 1" class="card card-w">
				<view class="card-icon-card-header">
					<view class="card-icon-card-header_lt">
						<image class="card-icon-card-header-img" :src="`${imgUrl}redindex/icon_bg.png`"></image>
						<text class="title-text-primary">优惠通行</text>
						<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
					</view>
				</view>
			
				<view class="card-icon-card-item">
					<view class="card-icon-card-items">
						<view class="card-icon-card-box flex flex-col" v-for="(item, index) in yhList" :key="index"
							@click="tabsClick(item)">
							<view class="yh-card-header">
								<image v-if="item.hot == 1" class="hot-img" :src="imgUrl + 'static/hot_icon.png'">
								</image>
								<text class="card_sm_head_text">{{ item.name }}</text>
								<image class="card_sm_head_icon" :src="`${imgUrl}redindex/card_lt_icon_green.png`"> </image>
							</view>
							<view class="yh-card-item">
								<image class="yh-img" :src="item.icon"></image>
								<view class="flex flex-col flex-1">
									<text class="fs-28 col3">已报名：32人</text>
									<text class="yh-time">2025.11.15～2026.11.1</text>
								</view>
								<view class="yh-btn">报名中</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 出行生活 -->
			<view v-if="vehicleType != 1" class="card">
				<view class="card-icon-card-header">
					<view class="card-icon-card-header_lt">
						<image class="card-icon-card-header-img" :src="`${imgUrl}redindex/icon_bg.png`"></image>
						<text class="title-text-primary">出行生活+</text>
						<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
					</view>
					<image class="card_icon_card_header_rt_map" :src="`${imgUrl}redindex/fw_card_icon.png`" mode="heightFix"
						@click="toNav('/pages_E/service/carlife')"></image>
				</view>

				<view class="card-item mt35">
					<!-- #ifdef MP-WEIXIN -->
					<map v-if="currentLat" :latitude="currentLat" :longitude="currentLng" :markers="mapMarkers"
						:scale="scale" class="map" id="myMap" @regionchange="onRegionChange"
						@click="toNav('/pages_E/service/carlife')"></map>
					<!-- #endif -->
					<!-- #ifdef APP-HARMONY -->
					<view style="width: 100%;height: 400rpx;position: relative;">
						<map v-if="currentLat" :latitude="currentLat" :longitude="currentLng" :markers="mapMarkers"
							:scale="scale" class="map" id="myMap" style="height: 400rpx;" @regionchange="onRegionChange"
							@click="toNav('/pages_E/service/carlife')"></map>
						<view
							style="width: 100%;height: 60rpx;position: absolute;left: 0;bottom: 0;z-index: 1;background-image: var(--linear-color);">
						</view>
					</view>

					<!-- #endif -->

					<!-- <view class="card_lx mt25">
						<view class="card_sm_head">
							<view class="card_sm_head_l">
								<text class="card_sm_head_text">一起"趣"旅行</text>
								<image class="card_sm_head_icon" :src="icoUrl + 'rt_icon.png'"> </image>
							</view>
							<view class="card_sm_head_r">
								<image class="card_sm_head_r_icon" :src="icoUrl + 'shape_icon.png'"></image>
							</view>
						</view>

						<view class="lx_info">
							<image v-if="dataList[0].image" class="lx_info_img" :src="imgUrl + 'static/qlx.png'"> </image>
							<image v-else class="lx_info_img" :src="dataList[0].image"></image>
							<view class="lx_info_texts">
								<text class="lx_info_title">{{ dataList[0].name }}</text>
								<text class="lx_info_time">2026.3.15-18</text>
								<view class="lx_info_rinfo">
									<text class="lx_info_rinfo_text">已报名：</text>
									<text class="lx_info_rinfo_text lx_info_rinfo_text1">32人</text>
									<view class="lx_info_rinfo_btn">
										<text class="lx_info_rinfo_btn_text">报名中</text>
									</view>
								</view>
							</view>
						</view>
					</view> -->
				</view>
			</view>

			<!-- 业务办理 -->
			<!-- #ifdef APP-HARMONY -->
			<view class="card" :style="{marginTop:vehicleType != 1?'-60rpx':'0', }"
				style="position: relative;z-index: 2;">
			<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="card" style="margin-top: -15%;z-index: 99999;">
				<!-- #endif -->
					<view class="card-icon-card-header" >
						<view class="card-icon-card-header_lt">
							<image class="card-icon-card-header-img" :src="`${imgUrl}redindex/icon_bg.png`"></image>
							<text class="title-text-primary">业务办理</text>
							<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
						</view>
					</view>

					<view class="card-item">
						<!-- 货车 -->
						<view v-if="vehicleType == 1" class="grid-box-1"
							style="display: grid; gap: 0; grid-template-columns: repeat(4, 1fr)">
							<view v-for="(item, index) in hcywTabs" :key="index" @click="tabsClick(item)">
								<view class="flex flex-col ali-cen" style="margin-bottom: 32rpx">
									<image class="grid-box-img" :src="item.iconUrl"></image>
									<text class="grid-box-text">{{ item.entryName }}</text>
								</view>
							</view>
						</view>
						<!-- 客车 -->
						<view v-else class="grid-box">
							<view class="grid-box-item" style="width: 140rpx" v-for="(item, index) in ywTabs" :key="index"
								@click="tabsClick(item)">
								<image class="grid-box-img" :src="item.iconUrl"></image>
								<text class="grid-box-text texNoWrap">{{ item.entryName }}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 出行服务 -->
				<view class="card">
					<view class="card-icon-card-header">
						<view class="card-icon-card-header_lt">
							<image class="card-icon-card-header-img" :src="`${imgUrl}redindex/icon_bg.png`"></image>
							<text class="title-text-primary">出行服务</text>
							<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
						</view>
					</view>

					<view class="card-item">
						<view class="grid-box" style="justify-content: flex-start">
							<view class="grid-box-item" style="width: 140rpx" v-for="(item, index) in fwTabs" :key="index"
								@click="tabsClick(item)">
								<image class="grid-box-img" :src="item.iconUrl"></image>
								<text class="grid-box-text">{{ item.entryName }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 货车接单 -->
				<view v-if="vehicleType == 1" class="card card-w">
					<view class="card-icon-card-header">
						<view class="card-icon-card-header_lt">
							<image class="card-icon-card-header-img" :src="`${imgUrl}redindex/icon_bg.png`"></image>
							<text class="title-text-primary">货车接单</text>
							<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
						</view>
					</view>

					<view class="hc-card" v-for="(item, index) in goodsorder" :key="index" @click="toNav('/pages_D/informationMatch/detail?id=' + item.id)">
						<view class="flex ali-cen just-sb m-b-30">
							<view class="flex ali-cen flex-1">
								<text
									class="city-name u-line-1">{{ item.loadingAddrName ? item.loadingAddrName[2] : '灞桥区' }}</text>
								<image class="arrow-img" :src="`${imgUrl}redindex/to_line.png`"></image>
								<text
									class="city-name u-line-1">{{ item.unloadingAddrName ? item.unloadingAddrName[2] : '长安区' }}</text>
							</view>
							<text class="hc-num u-line-1">{{ item.weight || '10' }}吨{{ item.goodsName || '苹果' }}</text>
						</view>
						<view class="flex ali-cen just-sb">
							<view class="flex flex-col">
								<view class="flex m-b-25">
									<view class="hc-label">发布时间</view>
									<view class="hc-value">{{ item.createTime || '2025-12-18 22:20:00' }}</view>
								</view>
								<view class="flex">
									<view class="hc-label">发布人</view>
									<view class="hc-value">{{ item.contactPerson || '某某公司' }}</view>
								</view>
							</view>
							<view class="hc-btn">抢单</view>
						</view>
					</view>

					<view class="hc-card-btn" @click="informationMatchFun('/pages_D/informationMatch/index')">
						更多物流订单
						{{ '>' }}
					</view>
				</view>

				<!-- 完成任务 -->
				<view class="card card-w">
					<view class="card-icon-card-header">
						<view class="card-icon-card-header_lt">
							<image class="card-icon-card-header-img" :src="`${imgUrl}redindex/icon_bg.png`"></image>
							<text class="title-text-primary">{{ closeTask == 1 ? '完成任务' : '福利兑换' }}</text>
							<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
						</view>

						<view class="card-icon-card-header_rt">
							<image v-if="closeTask == 1" class="card-icon-card-header_rt_img"
								:src="imgUrl + 'static/card_jf_icon.png'"></image>
							<image v-if="closeTask != 1" class="card-icon-card-header_rt_img" :src="''"></image>
							<view v-if="closeTask == 1" class="card-icon-card-header_rt_r" @click="handleCloseTask">
								<text class="card-icon-card-header_rt_r_txt">不再提示任务</text>
								<uni-icons type="closeempty" size="12" color="#909599"></uni-icons>
							</view>
							<view v-if="closeTask != 1" class="card-icon-card-header_rt_r"
								@click="toRec('/pages/home/home?type=points')">
								<text class="card-icon-card-header_rt_r_txt">兑换更多福利</text>
								<image class="card_sm_head_r_aright" :src="imgUrl + 'static/card_double right.png'">
								</image>
							</view>
						</view>
					</view>

					<view class="card-item">
						<!-- <view class="rw_list" v-if="closeTask == 1"> -->
						<view class="rw_list" v-if="closeTask == 1">
							<view class="rw_item card-w" v-for="(item, index) in jfTabs" :key="index">
								<image class="rw_item_img" :src="item.icon"></image>
								<text class="rw_item_text">{{ item.name }}</text>
								<view class="rw_item_btn-1" v-if="item.info?.getPoint">
									<text class="rw_item_btn_text-1">奖励已发放</text>
								</view>
								<view class="rw_item_btn" v-else @click="toLink(item.path)">
									<text class="rw_item_btn_text">领{{ item.info?.point || '' }}积分</text>
								</view>
							</view>
						</view>

						<view v-if="closeTask == 1" class="card_sm_head">
							<view class="card_sm_head_l">
								<text class="card_sm_head_text">福利兑换</text>
								<image class="card_sm_head_icon" :src="`${imgUrl}redindex/card_lt_icon_green.png`"></image>
							</view>
							<view class="card_sm_head_r" @click="toRec('/pages/home/home?type=points')">
								<text class="card_sm_head_r_text">兑换更多福利</text>
								<image class="card_sm_head_r_aright" :src="imgUrl + 'static/card_double right.png'">
								</image>
							</view>
						</view>

						<view class="card_goods_list">
							<view class="card_goods_item" v-for="(item, index) in productList" :key="index"
								@click="toNav(`/pages_A/points/details?id=${item.id}`)">
								<view class="card_goods_item_img">
									<image class="card_goods_item_img_1" :src="item.picUrl"></image>
								</view>
								<text class="card_goods_item_title u-line-1">{{ item.spuName }}</text>
								<view class="card_goods_item_jf">
									<text class="card_goods_item_jf_num">{{ item.point }}</text>
									<image class="card_goods_item_jf_icon" :src="imgUrl + 'tab4.png'"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>


			<image class="head_bg" :src="`${imgUrl}redindex/head_bg.png`" mode=""></image>
			<!-- 导航栏放置最后：vue 页面靠 z-index 控制即可 -->
			<view class="nav-container" id="navID" :style="{ backgroundColor: props.scrollTop > 20 ? '#FE9388' : '' }">
				
				
				<up-navbar bgColor="transparent" placeholder :fixed="false">
					<template #left>
						<view class="weather_box" @click="toNav('/pages_A/weather/index')">
							<image
								:src="`https://tranalioss.shanyitong.com/wximage/trip-pro/weather/${weatherNow.icon}.png`"
								class="weather-icon" mode="heightFix"></image>
							<view class="weather_info">
								<text class="weather-text">{{ weatherNow.temp || '0' }}℃</text>
								<text class="weather-cs">{{ cityDw || '--' }}</text>
							</view>
						</view>
					</template>

					<template #center>
						<view class="fl-ce-ce" style="flex-direction: row" @click="toJump('/pages_A/car/myCar')">
							<!-- <text class="titleIcon" :style="{
								color: themeStore.themeColors.$secondaryColor,
								border: `1px solid ${themeStore.themeColors.$secondaryColor}`
							}">客</text> -->
							<image v-if="vehicleType == 1 && carNumber" class="kfImg" :src="`${imgUrl}redindex/huo_icon.png`"
								mode="scaleToFill" />
							<image v-if="vehicleType != 1 && carNumber" class="kfImg" :src="`${imgUrl}redindex/ke_icon.png`"
								mode="scaleToFill" />
							<text class="titleText">{{ carNumber ? carNumber : '请绑定车辆' }}</text>
							<!-- <image class="qhImg" :src="imgUrl+'static/qh_kh_icon.png'" mode="scaleToFill" /> -->
							<view v-if="carNumber" @tap.stop>
								<picker mode="selector" :range="licensePlateRange" :value="carPickerIndex"
									@change="onCarPickerChange">
									<view class="native-select">
										<image class="qhImg" :src="imgUrl + 'static/qh_kh_icon.png'"
											mode="scaleToFill" />
									</view>
								</picker>
							</view>
						</view>
					</template>

					<template #right>
						<!-- 	<view class="theme-switcher" @click="toNav('/pages_A/setting/themeswitcher')">
						<image class="pf-img" :src="imgUrl + 'ind-icon-pf.png'"></image>
					</view> -->
					</template>
				</up-navbar>
			</view>

			<!-- <up-gap height="90"></up-gap> -->
			<SateLayer ref="sateLayerRef"></SateLayer>

			<!-- 出行体验官弹窗 -->
			<up-popup v-model:show="showExperiencePopup" mode="center" :closeOnClickOverlay="true" :round="24"
				bgColor="transparent" z-index="9999999">
				<view class="exp-popup" @tap.stop>
					<image class="exp-popup__card" :src="imgUrl + 'experience/ex_popup.png'" mode="widthFix" />

					<view class="exp-popup__btn-wrap" @tap="handleExperienceApply">
						<image class="exp-popup__btn-bg" :src="imgUrl + 'experience/ex_btn.png'" mode="widthFix" />
						<text class="exp-popup__btn-text">立即申请</text>
					</view>

					<image class="exp-popup__close" :src="imgUrl + 'experience/ex_close.png'" mode="aspectFit"
						@tap="closeExperiencePopup" />
				</view>
			</up-popup>

			<!-- 订单二维码弹窗 -->
			<up-popup v-model:show="showOrder" mode="center" :closeOnClickOverlay="true" :round="24"
				bgColor="transparent" z-index="9999999">
				<view>
					<view class="orderBox">
						<image class="orderBox-bgImg" :src="imgUrl + 'home-order-beij@2x.png'"></image>
						<view class="orderBox-box">
							<view style="align-items: center">
								<text class="fontBox">扫码付订单二维码</text>
								<view class="timer">
									<view class="tex28_66_b">2025-12-22</view>
									<view class="timer-right">
										<text class="fontText1">{{ splitDataTime[0] }}</text>
										<text class="fontText2">时</text>
										<text class="fontText1">{{ splitDataTime[1] }}</text>
										<text class="fontText2">分</text>
										<text class="fontText1">{{ splitDataTime[2] }}</text>
										<text class="fontText2">秒</text>
									</view>
								</view>
							</view>

							<view class="fl-al-ce-col">
								<view class="station">
									<text class="station-text1">出口：</text>
									<text class="station-text2 texNoWrap">{{ orderLayer.payStationName }}</text>
								</view>
								<image class="codeBox" :src="orderLayer.codeUrl" />
								<text class="tips">出示此二维码，核验成功后放行</text>
							</view>
						</view>
					</view>

					<view class="order-close-wrap">
						<image class="orderBox-close" @click="closeOrederLayer" :src="imgUrl + 'ic_close_white.png'">
						</image>
					</view>
				</view>
			</up-popup>
			<UpdateProtocol></UpdateProtocol>
		</view>
</template>

<script setup lang="ts">
	import { ref, computed, watch, onMounted, nextTick } from 'vue';
	import { onPageScroll, onUnload, onShow, onReady } from '@dcloudio/uni-app';
	import { imgUrl } from '../../config';
	import { toNav, toRec } from '@/utils/route';
	import { CurrentPage, showAlert2 ,openLocation} from '@/utils/util';
	import { toast } from '@/utils/common';
	import { splitTime } from '@/utils/date';
	import { useAppStore } from '@/store/modules/app';
	import { useElementRects } from '@/utils/useElementRect';
	import { bannerList } from '@/api/car';
	import { getTadayApi } from '@/api/weather.ts';
	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	import { postmapServicesList } from '@/api/map.ts';
	import { getmemberpointsDetailStatistics, getmembermakePoint, postsaveSignInPoint } from '@/api/member';
	import { getByUserIdAndVehicleAll } from '@/api/user';
	import { getNewsList, recordShow, shouldShow, getRouteByLngLat, gridMenu,tiyanguan } from '@/api/home';
	import { updateClickVolume, getLocationInfoid } from '@/api/index';
	import { getPrSupplyRouteSubscription, listPrSupplySource } from '@/api/premium';
	import { listPoints, getpageTypeActivityInfo } from '@/api/points';
	import { getEvents, getgetTollStationByIdList, getgetServiceAreaPageList, getServiceAreaById } from '@/api/map';
		import UpdateProtocol from '@/components/PrivacyDialog/UpdateProtocol.vue'
	import { useCommonStore } from '@/store/modules/common';
	const commonState = useCommonStore();
	const scale = ref(8);
	const props = defineProps<{
		scrollTop : number;
	}>();
	const address = ref<{ lat : number; lng : number }>({ lat: 0, lng: 0 }); // 用户当前位置（或逆地理结果）
	const center = ref<{ lat : number; lng : number }>({ lat: 0, lng: 0 }); // 地图中心点
	const arr = ref<any[]>([]);
	const rpx2px = (rpx : number) => {
		const sys = uni.getSystemInfoSync();
		return (rpx * sys.windowWidth) / 750;
	};
	const mapContainerW = computed(() => Math.round(rpx2px(702)));
	const mapContainerH = computed(() => Math.round(rpx2px(353)));
	const mapContext = ref(null);
	let regionTimer : ReturnType<typeof setTimeout> | null = null;

	const PageTo = (val : any) => {
		// 内部 0，
		if (val.jumpType == 0) {
			uni.navigateTo({
				url: val.jumpAddr,
			});
			// 外部 1，
		} else if (val.jumpType == 1) {
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(val.jumpAddr),
			});
			// 小程序 2
		} else if (val.jumpType == 2) {
			uni.navigateTo({
				url: val.jumpAddr,
			});
		}
	};
	const listQuery = ref({
		pageNum: 1,
		pageSize: 30,
		categoryId: '',
	});
	// 积分
	const getAlljf = () => {
		if (!isLogin.value) return 0;
		const info = uni.getStorageSync('userInfo');
		if (!info.pointsAccount) return 0;
		return info.pointsAccount.commonPoint || 0;
	};
	//获取积分规则
	const pointsRules = ref({});
	const getPoints = async () => {
		const res = await getmembermakePoint();
		console.log('积分见到你---', res);
		if (res.code == 200) {
			pointsRules.value = res.rows;
			if (isLogin.value) {
				res.data.registerPointRule.getPoint = true;
			}
			jfTabs.value[0].info = res.data.registerPointRule;

			jfTabs.value[1].info = res.data.bindVehiclePointRule;
			jfTabs.value[2].info = res.data.completeInfoPointRule;
			getcarlist()
			console.log(jfTabs.value, 'jfTabs[2].value');
		}
	};

	const goodsorder = ref([]);
	const getPrSupplyRouteSubscriptionFun = async () => {
		if (isLogin.value) {
			const res = await getPrSupplyRouteSubscription();
			datObj.value = res.data;
			listPrSupplySourceFun1();
		} else {
			listPrSupplySourceFuns();
		}
	};
	const listPrSupplySourceFun1 = async () => {
		let params = {
			pageNum: 1,
			pageSize: 1,
			loadingCity: datObj.value.loadingCity,
			loadingDistrict: datObj.value.loadingDistrict,
			loadingProvince: datObj.value.loadingProvince,
			unloadingCity: datObj.value.unloadingCity,
			unloadingDistrict: datObj.value.unloadingDistrict,
			unloadingProvince: datObj.value.unloadingProvince,
			bodyworkLenMax: datObj.value.bodyworkLenMax,
			bodyworkLenMin: datObj.value.bodyworkLenMin,
			carType: '',
		};
		const res = await listPrSupplySource(params);
		console.log('查询的订单数据：', res.rows);
		goodsorder.value = res.rows;
		if (res.rows.length == 0) {
			listPrSupplySourceFuns();
		}
	};
	const toLink = (url) => {
		if (!isLogin.value) {
			return toast('登录后可领取');
		}
		toNav(url);
	};
	const listPrSupplySourceFuns = async () => {
		let data = {
			pageNum: 1,
			pageSize: 1,
		};
		const res = await listPrSupplySource(data);
		goodsorder.value = res.rows;
	};

	// 聚合点
	const listPrSupplySourceFun = async () => {
		const st = uni.getStorageSync('address') || {};
		const userLng = address.value.lng || currentLng.value || st.lng || 108.953098;
		const userLat = address.value.lat || currentLat.value || st.lat || 34.2778;
		// const userLng = 108.884636;
		// const userLat = 34.194608;
		// 地图中心：优先 center，其次用户坐标
		const centerLng = center.value.lng || userLng;
		const centerLat = center.value.lat || userLat;
		let params = {
			types: [1, 2, 3, 4, 5, 6, 7, 8],
			longitude: userLng,
			latitude: userLat,
			centerLat,
			centerLng,
			zoom: scale.value,
			coordType: 1,
			containerW: mapContainerW.value,
			containerH: mapContainerH.value,
		};
		const res = await postmapServicesList(params);
		dataList.value = res.data.list;
		if (res.data.clusters.length) {
			let hasList = res.data.clusters;
			mapMarkers.value = hasList.map((item, index) => {
				(item.id = index + 1), (item.width = '20');
				item.height = '20';
				item.latitude = Number(item.lat);
				item.longitude = Number(item.lng);
				item.iconPath = getIconPathByType(item);
				
				return item;
			});
		}
		// updateMarkersWithScale(scale.value);
	};
	onReady(() => {
		mapContext.value = uni.createMapContext('myMap');
	});
	// 商品列表
	const productList = ref([]);
	// 获取商品列表
	const getData = async () => {
		const params = {
			...listQuery.value,
			categoryId: undefined,
			redeemable: 1, //0：全部 1：可兑换
			spuName: undefined,
		};
		let res = await getpageTypeActivityInfo(vehicleType == 1 ? 0 : 1);
		console.log('商品数据', res);
		if (res.code === 200) {
			productList.value = res.data;
		}
		// 	const res = await listPoints(params);
		// 	if (res.code == 200) {
		// 		let {
		// 			list,
		// 			total
		// 		} = res.data;
		// 		productList.value = list.splice(0,4);
		// 		console.log("object", productList.value)
		// 	} else {

		// 	}
	};

	// ====== 聚合相关逻辑 ======
	const CLUSTER_ID_BASE = 100000;

	const clusterPointsByKm = (points : any[], currentScale : number) => {
		if (!Array.isArray(points) || points.length === 0) return [];

		// Step 1: 根据 scale 确定聚合半径（单位：公里）
		let radiusKm : number;
		if (currentScale <= 6) radiusKm = 200; // 全国
		else if (currentScale <= 8) radiusKm = 100;
		else if (currentScale <= 10) radiusKm = 50;
		else if (currentScale <= 12) radiusKm = 30;
		else if (currentScale <= 14) radiusKm = 10;
		else if (currentScale <= 16) radiusKm = 0.5;
		else radiusKm = 0.1;

		// Step 2: 将公里转换为经纬度网格大小（1° ≈ 111 km）
		const gridSize = radiusKm / 111.0;
		if (!Number.isFinite(gridSize) || gridSize <= 0) return [];

		// Step 3: 网格聚类（同时统计 routeDirectionCode，用于聚合点 icon 取“多数派”）
		const grid : Record<
			string,
			{
				sumLat : number;
				sumLng : number;
				count : number;
				dirCount : Record<string, number>;
			}
		> = {};

		for (const p of points) {
			const lat = Number(p.latitude);
			const lng = Number(p.longitude);
			if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

			const x = Math.floor(lng / gridSize);
			const y = Math.floor(lat / gridSize);
			const key = `${x}_${y}`;

			if (!grid[key]) {
				grid[key] = { sumLat: 0, sumLng: 0, count: 0, dirCount: {} };
			}

			grid[key].sumLat += lat;
			grid[key].sumLng += lng;
			grid[key].count += 1;

			const dir = String(p.routeDirectionCode ?? '');
			grid[key].dirCount[dir] = (grid[key].dirCount[dir] || 0) + 1;
		}

		const pickMajorDir = (dirCount : Record<string, number>) => {
			let best = '';
			let bestN = -1;
			for (const k in dirCount) {
				const n = dirCount[k];
				if (n > bestN) {
					bestN = n;
					best = k;
				}
			}
			return best;
		};

		return Object.values(grid).map((g) => ({
			latitude: g.sumLat / g.count,
			longitude: g.sumLng / g.count,
			count: g.count,
			routeDirectionCode: pickMajorDir(g.dirCount),
		}));
	};

	const updateMarkersWithScale = (currentScale : number) => {
		if (currentScale <= 14 && dataList.value.length > 0) {
			const clusters = clusterPointsByKm(dataList.value, currentScale);

			mapMarkers.value = clusters.map((item, index) => ({
				id: CLUSTER_ID_BASE + index, // 必须是 number，markerTap 才稳定
				latitude: item.latitude,
				longitude: item.longitude,
				width: 48,
				height: 48,
				iconPath: item.routeDirectionCode == 1 ? imgUrl + 'dadian-icon.png' : imgUrl + 'chongqi-icon.png',
				// 聚合点显示数量（如你不需要可删除 label）
				label: {
					content: String(item.count),
					color: '#ffffff',
					fontSize: 12,
					bgColor: '#ff9b36',
					borderRadius: 12,
					padding: 4,
					anchorX: 0,
					anchorY: -34,
				},
			}));
		} else {
			// 显示原始点
			mapMarkers.value = dataList.value.map((item) => ({
				id: item.id,
				latitude: Number(item.latitude),
				longitude: Number(item.longitude),
				width: 27,
				height: 32,
				iconPath: item.routeDirectionCode == 1 ? imgUrl + 'dadian-icon.png' : imgUrl + 'chongqi-icon.png',
			}));
		}
	};

	// 点 marker 的默认行为：打开系统地图（你也可以改成跳详情页）
	// const handleMarkerTap = (e: any) => {
	// 	const markerIdRaw = e?.detail?.markerId;
	// 	const markerId = Number(markerIdRaw);

	// 	// 聚合点：点击后放大一级（注意：scale 越大越放大）
	// 	if (Number.isFinite(markerId) && markerId >= CLUSTER_ID_BASE) {
	// 		scale.value = Math.min(18, scale.value + 1);
	// 		updateMarkersWithScale(scale.value);
	// 		return;
	// 	}

	// 	// 原始点：缓存详情
	// 	const filterMaker = dataList.value.find((item) => item.id == markerIdRaw || item.id == markerId);
	// 	if (filterMaker) {
	// 		uni.setStorageSync('k1yMerInfo', filterMaker);
	// 	}
	// };

	// 主题
	import { useTheme } from '@/composables/useTheme';
	const { themeStore, pageTheme } = useTheme();
	const icoUrl = computed(() => {
		return themeStore.imgUrl
	})

	import SateLayer from '@/components/SateLayer/index.vue';

	const appStore = useAppStore();

	// 顶部预留高度（用于 navbar）
	const { queryAll } = useElementRects(['#navID']);
	const topBoxHeight = ref(100);

	const navBgColor = ref('#D7E1EB');
	const inpBgColor = ref('rgba(255,255,255,.7)');
	const cityDw = ref('');

	const longitude = ref(0);
	const latitude = ref(0);
	const currentLat = ref<number>(0);
	const currentLng = ref<number>(0);
	const weatherNow = ref<any>({});
	const startWeatherNow = ref<any>({});
	const endWeatherNow = ref<any>({});
	const carNumber = ref<any>(uni.getStorageSync('carNumber'));
	const vehicleType = ref(2);

	// 登录态（computed，不要对它赋值）
	const isLogin = computed(() => appStore.checkLogin());

	/** ========= 体验官弹窗 ========= */
	const showExperiencePopup = ref(false);
	type GlobalData = { hasCheckExperiencePopup ?: boolean };
	const app = getApp<{ globalData : GlobalData }>();
	const isshow = ref<boolean>(true);
	const openExperiencePopup = () => (showExperiencePopup.value = true);
	const closeExperiencePopup = () => (showExperiencePopup.value = false);

	const handleExperienceApply = () => {
		if (!isLogin.value) {
			// #ifdef MP-WEIXIN
			uni.navigateTo({
				url: '/pages_A/login/login?fromPage=' + CurrentPage(),
			});
			// #endif
			// #ifdef APP
			uni.navigateTo({ url: '/pages_A/login_password/login' });
			// #endif
			return;
		}
		toNav('/pages_E/experience/index');
		showExperiencePopup.value = false;
	};

	const checkExperiencePopup = async () => {
		const res : any = await tiyanguan();
		if(res.data==1){
		  if (!isLogin.value) {
		  	showExperiencePopup.value = true;
		  	return;
		  }
		  if (app.globalData.hasCheckExperiencePopup) return;
		  app.globalData.hasCheckExperiencePopup = true;
		  
		  try {
		  	const res : any = await shouldShow();
		  	if (res.code === 200 && (res.data === true || res.data?.show)) {
		  		openExperiencePopup();
		  		await recordShow({ popupCode: 'experience_officer' });
		  	}
		  } catch (e) {
		  	console.error('出行体验官弹窗判断失败:', e);
		  }	
		}
		
	};

	/** ========= banner ========= */
	const headerBanners = ref([]);
	const yhList = computed(() => [
		{ name: '“以量定价”差异化收费活动', icon: imgUrl + 'static/yh_bm1.png', hot: '1', route: '/pages_D/volumePricing/discount/index' },
		// { name: '“货车积分”补贴活动', icon: imgUrl + 'static/yh_bm2.png', hot: '0', route: '' },
	]);
	/** ========= tabs ========= */
	const lkTabs = computed(() => [
		{ entryName: '路况地图', iconUrl: imgUrl + 'redindex/lkdt_icon.png', jumpType: 0, jumpPage: '/pages_A/map/index' },
		{ entryName: '路况信息', iconUrl: imgUrl + 'redindex/lkxx_icon.png', jumpType: 0, jumpPage: '/pages_A/mapInfo/index' },
		// #ifndef APP-HARMONY
		
		// #endif
		{ entryName: '高速直播', iconUrl: imgUrl + 'redindex/gszb_icon.png', jumpType: 1, jumpPage: 'https://gaoguantong.ruitong369.com/GaoGuanTongServer/gaoguantongHTML/html/direction/12122/MainTest.html?wxH5=1' },
		{ entryName: '服务区', iconUrl: imgUrl + 'redindex/fwq_icon.png', jumpType: 0, jumpPage: '/pages_A/station/index' },
		{ entryName: '收费站', iconUrl: imgUrl + 'redindex/sfz_icon.png', jumpType: 0, jumpPage: '/pages_A/toll/index' },
	]);

	const ywTabs = computed(() => [
		{ entryName: '通行费票据', iconUrl: imgUrl + 'redindex/card_bill.png', jumpType: 0, jumpPage: '/pages_A/tollInvoice/index' },
		{ entryName: 'ETC办理', iconUrl: imgUrl + 'redindex/card_etc.png', jumpType: 2, jumpPage: 'wxe442a27a2747b061' },
		{ entryName: '通行费查询', iconUrl: imgUrl + 'redindex/card_query_money.png', jumpType: 1, jumpPage: 'https://gaoguantong.ruitong369.com/GaoGuanTongServer/gaoguantongHTML/html/direction/12122/feequery.html' },
		{ entryName: '通行费补缴', iconUrl: imgUrl + 'redindex/card_payment.png', jumpType: 2, jumpPage: 'wxf52b8d2bb696e5f4' },
		// { entryName: '扫码付', iconUrl: imgUrl + 'redindex/card_scan_code.png', jumpType: '', jumpPage: '' },
		{
			entryName: '便民电子证照',
			iconUrl: imgUrl + 'redindex/bmdzz_icon.png',
			jumpType: 1,
			jumpPage: 'https://qyfw.sanqinchuxing.com/Wechat/Home/Index',
		},
		{
			entryName: '运政资质',
			iconUrl: imgUrl + 'redindex/yzzz_icon.png',
			jumpType: 1,
			jumpPage: 'https://qyfw.sanqinchuxing.com/Wechat/Home/Index?TabIndex=tab-verify',
		},
	]);
	
	const hcywTabs = computed(() => [
		{ entryName: '通行费票据', iconUrl: imgUrl + 'redindex/card_bill.png', jumpType: 0, jumpPage: '/pages_A/tollInvoice/index' },
		{ entryName: 'ETC办理', iconUrl: imgUrl + 'redindex/card_etc.png', jumpType: 2, jumpPage: 'wxe442a27a2747b061' },
		{ entryName: '通行费补缴', iconUrl: imgUrl + 'redindex/card_payment.png', jumpType: 2, jumpPage: 'wxf52b8d2bb696e5f4' },
		{ entryName: '通行费查询', iconUrl: imgUrl + 'redindex/card_query_money.png', jumpType: 1, jumpPage: 'https://gaoguantong.ruitong369.com/GaoGuanTongServer/gaoguantongHTML/html/direction/12122/feequery.html' },
		{ entryName: '绿通预约', iconUrl: imgUrl + 'redindex/card_greengo.png', jumpType: 2, jumpPage: 'wxa153df20e8888c68' },
		{ entryName: '运政办理', iconUrl: imgUrl + 'redindex/card_politics.png', jumpType: 2, jumpPage: 'wx00a6d2bbd6cf9160' },
		// { entryName: '扫码付', iconUrl: imgUrl + 'redindex/card_scan_code.png', jumpType: '', jumpPage: '' },
		// { entryName: '更多服务', iconUrl: imgUrl + 'redindex/card_ywmore.png', jumpType: '', jumpPage: '' },
		{
			entryName: '便民电子证照',
			iconUrl: imgUrl + 'redindex/bmdzz_icon.png',
			jumpType: 1,
			jumpPage: 'https://qyfw.sanqinchuxing.com/Wechat/Home/Index',
		},
		{
			entryName: '运政资质',
			iconUrl: imgUrl + 'redindex/yzzz_icon.png',
			jumpType: 1,
			jumpPage: 'https://qyfw.sanqinchuxing.com/Wechat/Home/Index?TabIndex=tab-verify',
		},
	]);

	const fwTabs = computed(() => [
		{ entryName: '充电', iconUrl: imgUrl + 'redindex/cd_icon.png', jumpType: 0, jumpPage: '/pages_A/chargingPiles/index' },
		{ entryName: '加油', iconUrl: imgUrl + 'redindex/jy_icon.png', jumpType: 0, jumpPage: '/pages_D/refuelingRefilling/index' },
		// { entryName: '酒店住宿', iconUrl: imgUrl + 'redindex/jdzs_icon.png', jumpType: 0, jumpPage: '/pages_B/hotel/hotelist' },
		{ entryName: '汽车维修', iconUrl: imgUrl + 'redindex/qcwx_icon.png', jumpType: 0, jumpPage: '/pages_D/repair/carRepair' },
		// { entryName: '餐饮美食', iconUrl: imgUrl + 'redindex/cyms_icon.png', jumpType: 0, jumpPage: '/pages_B/dining/index' },
		// { entryName: '餐饮美食', iconUrl: imgUrl + 'redindex/card_food.png', jumpType: 0, jumpPage: '/' },
	]);

	// 根据业务类型查询金刚列表
	const businessTypeFun = async (val) => {
		const now = new Date();
		const params = {
			startTime: formatToMinuteWithSec00(now),
			endTime: formatToMinuteWithSec00(now),
			secondaryIconPath: val
		};
		const res : any = await gridMenu('0', params);
		console.log("高速路况金刚区",res)
		// if (res?.code == 200) {
		// 	const truedata = res.rows.filter(item => item.enabled == 1)
		// 	// #ifdef APP-HARMONY
		// 	const harmonydata = truedata.filter(item => item.showDeviceTypes.includes('2'))
		// 	lkTabs.value = harmonydata.filter(item => item.secondaryBusinessType === '高速路况')
		// 	hcywTabs.value = harmonydata.filter(item => item.secondaryBusinessType === '业务办理')
		// 	fwTabs.value = harmonydata.filter(item =>  item.secondaryBusinessType === '出行服务')
		// 	// #endif
		// 	// #ifndef APP-HARMONY
		// 	lkTabs.value = truedata.filter(item => item.secondaryBusinessType === '高速路况')
		// 	hcywTabs.value = truedata.filter(item => item.secondaryBusinessType === '业务办理')
		// 	fwTabs.value = truedata.filter(item => item.secondaryBusinessType === '出行服务')
		// 	// #endif
		// }
	};

	const jfTabs = ref([
		{
			name: '加入会员',
			icon: imgUrl + 'redindex/vip_icon.png',
			type: '',
			route: '/pages_A/chargingPiles/index',
			info: {
				getPoint: false,
				point: '',
			},
			path: '/pages_C/member/registeredPersonal',
		},
		{
			name: '绑定车辆',
			icon: imgUrl + 'redindex/bdcl_icon.png',
			type: '',
			route: '/pages_D/refuelingRefilling/index',
			info: {
				getPoint: false,
				point: '',
			},
			path: '/pages_A/car/addCar',
		},
		{
			name: '完善信息',
			icon: imgUrl + 'redindex/wsxx_icon.png',
			type: '',
			route: '/pages_B/hotel/hotelist',
			info: {
				getPoint: false,
				point: '',
			},
			path: '/pages_A/personalinformation/personal',
		},
	]);

	// 小猴子全局搜索
	const handleChangeDwinput = () => {
		// toast('“全局搜索”正在赶来的路上');
		toNav('/pages_E/globalsearch/index');
	};

	const sateLayerRef = ref(null);
	const tabsClick = (item) => {
		console.log("首页金刚区点击",item)
		// 内部 0，
		if (item.jumpType == 0) {
			if(item.jumpPage == '/') return toast('该功能正在快马加鞭赶来的路上');
			if (item.entryName == '扫码付') return toast('该功能正在快马加鞭赶来的路上');
			toNav(item.jumpPage);
			// 外部 1，
		} else if (item.jumpType == 1) {
			// #ifdef MP-WEIXIN
			if(item.custom == 1) return toast('该功能正在快马加鞭赶来的路上');
			// #endif
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(item.jumpPage),
			});
			// 小程序 2
		} else if (item.jumpType == 2) {
			navLink(item.jumpPage)
		}
	};
	const navLink = (appid: string) => {
		// 登录校验
		if(appid == 'https://yjglfp.sx12122.cn/'){
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
			});
		}else if(appid == 'https://gaoguantong.ruitong369.com/GaoGuanTongServer/gaoguantongHTML/html/direction/12122/MainTest.html?wxH5=1'){
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
			});
		}else{
			sateLayerRef.value.open(appStore.MiniProgramConfig[appid]);
		}
	};
	const qqmapsdk = new QQMapWX({
		key: 'PLTBZ-QWLKZ-D3QX5-ZQGDB-3UBWK-4ZBYB', // 请替换为你的腾讯地图key
	});
	//获取当前位置 //遍历获取code
	const getUserAddress = () => {
		qqmapsdk.reverseGeocoder({
			success: (res) => {
				console.log(res.result.formatted_addresses.standard_address, 'res.result.formatted_addresses.standard_address');
				const adInfo = res.result.ad_info;
				cityDw.value = res.result.address_component.city;
				let address = {
					lat: res.result.location.lat,
					lng: res.result.location.lng,
					city: res.result.address_component.city,
					cityCode: adInfo.adcode.substr(0, 4) + '00',
					province: res.result.address_component.province,
					provinceCode: adInfo.adcode.substr(0, 2) + '0000',
					district: res.result.address_component.district,
					districtCode: adInfo.adcode,
					standardAddress: res.result.formatted_addresses.standard_address,
				};
				address.value = { lat: address.lat, lng: address.lng };
				if (!center.value.lat || !center.value.lng) {
					center.value = { ...address.value };
				}
				listPrSupplySourceFun();
				getcityid(res.result.address_component);
				uni.setStorageSync('address', address);
				mylocationinfo.value = {
					location: {
						longitude: uni.getStorageSync('address').lng,
						latitude: uni.getStorageSync('address').lat,
					},
					name: uni.getStorageSync('address').standardAddress,
				};
			},
			fail: (err) => {
				let address = {
					lat: 34.2778,
					lng: 108.953098,
					city: '西安市',
					cityCode: '610100',
					province: '陕西省',
					provinceCode: '610000',
					district: '雁塔区',
					districtCode: '610104',
				};
				address.value = { lat: address.lat, lng: address.lng };
				if (!center.value.lat || !center.value.lng) {
					center.value = { ...address.value };
				}
				uni.setStorageSync('address', address);
				mylocationinfo.value = {
					location: {
						longitude: uni.getStorageSync('address').lng,
						latitude: uni.getStorageSync('address').lat,
					},
					name: uni.getStorageSync('address').city + uni.getStorageSync('address').district,
				};
				getcityid(address);
				console.error('逆地理编码失败:', err);
			},
		});
	};

	/** ========= 获取位置 ========= */
	const getLocation = () => {
		uni.getLocation({
			type: 'wgs84',
			success: (res) => {
				longitude.value = res.longitude;
				latitude.value = res.latitude;
				getList();
				getServiceList();
			},
			fail: () => {
				getList();
				getServiceList();
			},
		});
	};

	/** ========= 获取 navbar 实际高度 ========= */
	const handleQuery = async () => {
		try {
			const result : any = await queryAll();
			for (const i in result) {
				if (result[i].id === 'navID' && result[i].height > 0) {
					topBoxHeight.value = result[i].height;
				}
			}
		} catch (err) {
			console.log('获取尺寸失败:', err);
		}
	};

	/** ========= 百度原生选点（仅 App） ========= */
	let bdMapPlugin : any = null;
	// #ifdef APP-PLUS
	bdMapPlugin = uni.requireNativePlugin('bdMapPlugin');
	// #endif

	const mylocationinfo = ref<any>({
		name: '',
		address: '',
		location: { latitude: null, longitude: null },
	});
	const endlocationinfo = ref<any>({
		name: '',
		address: '',
		location: { latitude: null, longitude: null },
	});
	const mapMarkers = ref<any[]>([]);

	// 服务区详情跳转
	const goServiceDetail = (node : any) => {
		toNav(`/pages_A/stationDetails/index?id=${node.id}`);
	};
	const fetchWeatherByLatLng = async (lat : number, lng : number) => {
		// 1) 腾讯逆地理：拿 city/district/province
		const geo : any = await new Promise((resolve, reject) => {
			qqmapsdk.reverseGeocoder({
				location: { latitude: lat, longitude: lng },
				success: resolve,
				fail: reject,
			});
		});

		const comp = geo?.result?.address_component || {};
		const district = comp.district || '';
		const city = comp.city || '';
		const province = comp.province || '';

		// 2) 你的后端：根据 district + city 换 locationId（兜底用 city / province）
		const locParams = {
			locationNameZh: district || city || province,
			adm2NameZh: city || province,
		};

		const locRes : any = await getLocationInfoid(locParams);
		if (locRes?.code !== 200 || !locRes?.data?.locationId) return null;

		// 3) 天气接口：拿 now（其中包含 icon / temp 等）
		const weatherParams = {
			key: 'c378003293184af18adad854cc0c12bc',
			location: locRes.data.locationId,
			lang: 'zh-hans',
			unit: 'm',
		};

		const wRes : any = await getTadayApi(weatherParams);
		return wRes?.now ?? null;
	};

	// 按类型写入对应 ref
	const updateStartEndWeather = async (type : 'start' | 'end', lat : number, lng : number) => {
		try {
			const now = await fetchWeatherByLatLng(lat, lng);
			if (!now) return;

			if (type === 'start') startWeatherNow.value = now;
			else endWeatherNow.value = now;
		} catch (e) {
			console.log('获取选点天气失败:', e);
		}
	};
	const section1Ref = ref<any>({});
	const section2Ref = ref<any>({});
	const expandAllServiceAreas = ref(false);
	const toggleServiceAreas = () => {
		expandAllServiceAreas.value = !expandAllServiceAreas.value;
	};

	// 保留 1 位小数
	const to1Decimal = (v : any) : number => {
		const n = Number(v);
		return Number.isFinite(n) ? Number(n.toFixed(1)) : 0;
	};

	// 从字符串里提取数字（如 “12.3km”）
	const extractTo1Decimal = (v : any) : number => {
		if (v == null) return 0;
		if (typeof v === 'number') return to1Decimal(v);
		const m = String(v).match(/-?\d+(\.\d+)?/);
		return m ? to1Decimal(m[0]) : 0;
	};

	const timelineNodes = computed(() => {
		const sections = routeByLngLat.value?.sections ?? [];

		const entry1 = sections.find((it : any) => it?.entryExitType === 1) ?? { name: '', lanes: [] };
		const entry2 = sections.find((it : any) => it?.entryExitType === 2) ?? { name: '', lanes: [] };

		const serviceAreaList = routeByLngLat.value?.serviceAreaList ?? [];
		const serviceNum = serviceAreaList.length;
		const firstServiceArea = serviceAreaList[0] ?? { serviceAreaName: '', detailList: [], distance: 0 };

		const distance1 = to1Decimal(entry1?.startDistance ?? 0);
		const distance3 = to1Decimal(entry2?.startDistance ?? 0);

		// ========= 生成“服务区节点数组” =========
		// 折叠：1 个节点
		// 展开：N 个节点（左侧 km 也随之展开）
		const serviceNodes = (() => {
			if (!serviceNum) return [];

			if (!expandAllServiceAreas.value) {
				// 折叠：只显示第一个服务区
				return [
					{
						id: firstServiceArea.id,
						dotType: 'km',
						km: extractTo1Decimal(firstServiceArea?.distance ?? 0),
						dotClass: 'dot-km dot-green',
						lineClass: 'line-solid',
						title: `${firstServiceArea?.serviceAreaName}等${serviceNum}个服务区`,
						titleClass: 'title-success',
						rightText: '展开途径服务区',
						rightClass: '3',
						rightArrow: true,
						onRightTextClick: toggleServiceAreas,
						panel: 'service',
						// 面板复用你之前的渲染：传数组也行
						serviceAreas: firstServiceArea.detailList ? firstServiceArea.detailList.slice(0, 5) : [],
					},
				];
			}

			// 展开：每个服务区一个节点（左侧 km 对应各自 distance）
			return serviceAreaList.map((sa : any, idx : number) => ({
				id: sa.id,
				dotType: 'km',
				km: extractTo1Decimal(sa?.distance ?? 0),
				dotClass: 'dot-km dot-green',
				lineClass: 'line-solid',
				title: sa?.serviceAreaName || `服务区${idx + 1}`,
				titleClass: 'title-success',
				// 只在第一个节点放“收起”按钮，避免每行都有
				rightText: idx === 0 ? '收起' : '',
				rightClass: '3', //绿色
				rightArrow: idx === 0,
				onRightTextClick: idx === 0 ? toggleServiceAreas : undefined,
				panel: 'service',
				serviceAreas: sa.detailList ? sa.detailList.slice(0, 5) : [], // 每个节点只渲染自己
			}));
		})();

		// ========= 其余节点照旧 =========
		return [
			// 起点
			{
				dotType: 'flag',
				flagText: '起',
				dotClass: 'dot-flag dot-orange',
				lineClass: 'line-dotted',
				title: '出发',
				conditiontxt: `${routeByLngLat.value.startLocation?.weather.condition}`,
				subTitle: `${routeByLngLat.value.startLocation?.weather.temperature}℃`,
				rightText: '',
				rightArrow: false,
				panel: '',
			},

			// 收费站1
			{
				dotType: 'km',
				km: distance1,
				dotClass: 'dot-km dot-orange',
				lineClass: 'line-solid',
				title: entry1.name || '',
				rightText:'',
				routinfo: entry1.vehicleControl || '', //部分车辆管制
				badge: entry1.volumePricingFlag ? {
					text:"以量定价",
					class:'badge-orange',
					onClick:toyldj
				} : null,
				rightClass: '1', //灰色
				rightArrow: true,
				panel: 'channels',
				channels: entry1.lanes || [],
			},

			// 服务区：这里用“数组展开”
			...serviceNodes,

			// 收费站2
			{
				dotType: 'km',
				km: distance3,
				dotClass: 'dot-km dot-orange',
				lineClass: 'line-dotted',
				title: entry2.name || '',
				rightText:'',
				routinfo: entry2.vehicleControl || '',
				badge: entry2.volumePricingFlag ? {
					text:"以量定价",
					class:'badge-orange',
					onClick:toyldj
				} : null,
				rightArrow: false,
				panel: 'channels',
				channels: entry2.lanes || [],
			},

			// 终点
			{
				dotType: 'flag',
				flagText: '止',
				dotClass: 'dot-flag dot-green',
				lineClass: '',
				title: '到达',
				conditiontxt: `${routeByLngLat.value.endLocation?.weather.condition}`,
				subTitle: `${routeByLngLat.value.endLocation?.weather.temperature}℃`,
				rightText: '',
				rightArrow: false,
				panel: '',
			},
		];
	});
	
	const toyldj = () => {
		toNav('/pages_D/volumePricing/discount/index')
	}
	const pad2 = (n : number) => String(n).padStart(2, '0');

	const formatToMinuteWithSec00 = (d : Date) => {
		const y = d.getFullYear();
		const m = pad2(d.getMonth() + 1);
		const day = pad2(d.getDate());
		const hh = pad2(d.getHours());
		const mm = pad2(d.getMinutes());
		return `${y}-${m}-${day} ${hh}:${mm}:00`;
	};

	// 你原来的工具函数（保持不变即可）
	const getFalseIdxs = (arr : any[]) => (arr ?? []).map((v, i) => (v === false ? i : -1)).filter((i) => i !== -1);

	// banner
	const getBannerList = async () => {
		const type = vehicleType.value == 1 ? '4' : '3'; //1货车、2客车
		const now = new Date();
		const weatherWords = weatherNow.value.text
		const pattern = /[晴雾云雨雪阴]/g;
		const matches = weatherWords.match(pattern);
		const params = {
			name:'红色',
			color: 'red',
			
			// startTime: formatToMinuteWithSec00(now),
			// endTime: formatToMinuteWithSec00(now),
		};
		let res : any = await bannerList(type,params);
		if (res.code == 200) {
			headerBanners.value = res.rows.filter((t : any) => t.enabled == 1);
		}
	};
	// 跳转绿通预约
	const goGreenPassReserve = () => {
		// toNav('/pages_A/greenPass/reserve/index')
	};

	const goVolumePricing = () => {
		toNav('/packageA/pages/volumePricing/discount/index');
	};
	const navigateToApp = () => {
		openLocation({
			latitude: Number(endlocationinfo.value.location.latitude), //维度
			longitude: Number(endlocationinfo.value.location.longitude), //经度
			scale: 18, //缩放比例，范围5~18，默认为18
			name: endlocationinfo.value.name,
		});
	};
	const applyPickedLocation = (type : string, res : any) => {
		console.log('-0-0--00-0--0-0', res);
		console.log('-0-0--00-0--0-0', type);
		// res 结构在不同端不完全一致，这里做兼容
		const picked = {
			name: res.name || res.address || '',
			address: res.address || res.name || '',
			location: {
				latitude: res.latitude ?? res.location?.latitude,
				longitude: res.longitude ?? res.location?.longitude,
			},
		};

		if (picked.location?.latitude) {
			if (type === 'start') mylocationinfo.value = picked;
			else endlocationinfo.value = picked;
			// 顺便更新地图 marker（小程序用）
			const lat = picked.location.latitude;
			const lng = picked.location.longitude;

			if (lat) {
				if (type === 'start') mylocationinfo.value = picked;
				else endlocationinfo.value = picked;

				// 关键：用天气接口刷新对应 icon/temp
				updateStartEndWeather(type as 'start' | 'end', lat, lng);

				// 你原来的逻辑保留
				mapMarkers.value = [
					{ id: type === 'start' ? 1 : 2, latitude: lat, longitude: lng, title: picked.name || (type === 'start' ? '起点' : '终点') },
				];
				latitude.value = lat;
				longitude.value = lng;

				// 同时满足起点和终点条件时调用路线查询
				if (mylocationinfo.value.location?.latitude && endlocationinfo.value.location?.latitude) {
					getRouteByLngLatFun();
				}
			}
			// mapMarkers.value = [
			// 	{
			// 		id: type === 'start' ? 1 : 2,
			// 		latitude: lat,
			// 		longitude: lng,
			// 		title: picked.name || (type === 'start' ? '起点' : '终点'),
			// 	},
			// ];

			// // 如果你希望地图中心跟随（小程序用）
			// latitude.value = lat;
			// longitude.value = lng;
			// if (type === 'end') {
			// 	getRouteByLngLatFun();
			// }
			console.log('起点位置', mylocationinfo.value);
			console.log('终点位置', endlocationinfo.value);
		}
	};
	const openMapType = ref('');
	const openMap = (type : string) => {
		// #ifdef MP-WEIXIN
		uni.chooseLocation({
			success: (res) => {
				applyPickedLocation(type, res);
			},
			fail: (err) => {
				console.log('chooseLocation fail:', err);
			},
		});
		// #endif
		// #ifdef APP-HARMONY
		openMapType.value = type
		toNav('/pages/mapSearch/indexBD')
		// #endif
	};

	/** ========= 天气 ========= */
	const getWeatherNow = async (locationId : string) => {
		const params = {
			key: 'c378003293184af18adad854cc0c12bc',
			location: locationId,
			lang: 'zh-hans',
			unit: 'm',
		};
		try {
			const response : any = await getTadayApi(params);
			weatherNow.value = response.now;
			getBannerList()
		} catch (error) { }
	};

	const getcityid = async (e : any) => {
		const params = { locationNameZh: e.district, adm2NameZh: e.city };
		const response : any = await getLocationInfoid(params);
		if (response.code === 200) {
			await getWeatherNow(response.data.locationId);
			uni.setStorageSync('locationId', response.data.locationId);
		}
	};

	/** ========= 登录校验跳转 ========= */
	const toJump = (url : string) => {
		if (!isLogin.value) {
			showAlert2(
				'提示',
				'本次操作需要您进行登录验证',
				false,
				'取消',
				'确定',
				() => {
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages_A/login/login?fromPage=' + CurrentPage(),
				});
				// #endif
				// #ifdef APP
				uni.navigateTo({ url: '/pages_A/login_password/login' });
				// #endif
				},
				null
			);
			return;
		}
		uni.navigateTo({ url });
	};
	const informationMatchFun = (url : String) => {
		// 登录校验
		if (!isLogin.value) {
			showAlert2(
				'提示',
				'本次操作需要您进行登录验证',
				false,
				'取消',
				'确定',
				(success) => {
					// #ifdef MP-WEIXIN
					uni.navigateTo({
						url: '/pages_A/login/login?fromPage=' + CurrentPage(),
					});
					// #endif
					// #ifdef APP
					uni.navigateTo({ url: '/pages_A/login_password/login' });
					// #endif
				},
				null
			);
			return;
		}
		uni.navigateTo({
			url: url,
		});
	};

	/** ========= 订单二维码弹窗计时 ========= */
	const orderLayer = ref<any>({
		payStationName: 'bndnd ',
		codeUrl: imgUrl + 'dsewf.png',
	});
	const showOrder = ref(false);
	const splitDataTime = ref(splitTime(new Date()));
	let inter : ReturnType<typeof setInterval> | null = null;

	const openTime = () => {
		if (inter) clearInterval(inter);
		inter = setInterval(() => {
			splitDataTime.value = splitTime(new Date());
		}, 1000);
	};
	const closeOrederLayer = () => {
		showOrder.value = false;
	};

	/** ========= 其它接口） ========= */
	const newArray = ref<any[]>([]);
	const getNewsListFun = async () => {
		const userInfo = uni.getStorageSync('userInfo');
		const params = { pageNum: 1, pageSize: 20, type: 'HEADLINE', userId: userInfo?.id };
		const res : any = await getNewsList(params);
		if (res?.code === '0') {
			newArray.value = res.page.records.map((item : any) => item.title);
		}
	};
	const routeByLngLat = ref({
		sections: [],
		serviceAreaList: [],
		startLocation: {
			weather: {
				temperature: 16,
			},
		},
		endLocation: {
			weather: {
				temperature: 16,
			},
		},
	});
	// 根据经纬度获取路线
	const getRouteByLngLatFun = async () => {
		routeByLngLat.value = [];
		const params = {
			startLongitude: mylocationinfo.value.location.longitude || uni.getStorageSync('address').lng,
			startLatitude: mylocationinfo.value.location.latitude || uni.getStorageSync('address').lat,
			endLongitude: endlocationinfo.value.location.longitude || 0,
			endLatitude: endlocationinfo.value.location.latitude || 0,
			coordType: '1',
		};
		const res : any = await getRouteByLngLat(params);
		console.log("当行数据",res)
		if (res.code == 200) {
			routeByLngLat.value = res.data;
		}
	};
	const businessList = ref([]);




	const datObj = ref<any>({});
	const dataList = ref<any[]>([]);
	const onRegionChange = (e) => {
		if (e.type === 'end') {
			if (!mapContext) return;

			// 防抖：避免拖动时频繁触发接口
			if (regionTimer) clearTimeout(regionTimer);
			regionTimer = setTimeout(() => {
				mapContext.value.getCenterLocation({
					success: (res) => {
						center.value = {
							lat: res.latitude,
							lng: res.longitude,
						};
						getMapScaleEstimate();
						console.log('中心点更新:', center.value);
					},
					fail: (err) => {
						console.error('获取中心点失败:', err);
					},
				});
			}, 120);
		}
	};

	// const getMapScaleEstimate = () => {
	// 	if (!mapContext) return;

	// 	mapContext.getRegion({
	// 		success: (res) => {
	// 			const { southwest, northeast } = res;
	// 			const latSpan = northeast.latitude - southwest.latitude;
	// 			const lngSpan = northeast.longitude - southwest.longitude;

	// 			const maxSpan = Math.max(Math.abs(latSpan), Math.abs(lngSpan));

	// 			let estimatedScale;
	// 			if (maxSpan > 10) estimatedScale = 5;
	// 			else if (maxSpan > 5) estimatedScale = 6;
	// 			else if (maxSpan > 1) estimatedScale = 8;
	// 			else if (maxSpan > 0.5) estimatedScale = 10;
	// 			else if (maxSpan > 0.1) estimatedScale = 12;
	// 			else if (maxSpan > 0.05) estimatedScale = 14;
	// 			else if (maxSpan > 0.01) estimatedScale = 16;
	// 			else estimatedScale = 16;

	// 			console.log('估算缩放级别:', estimatedScale);
	// 			scale.value = estimatedScale;

	// 			// 拉取新视野数据 + 更新聚合点
	// 			listPrSupplySourceFun();
	// 		},
	// 		fail: (err) => {
	// 			console.warn('getRegion 不支持或失败:', err);
	// 		},
	// 	});
	// };
	const getMapScaleEstimate = () => {
		mapContext.value.getRegion({
			success: (res) => {
				const { southwest, northeast } = res;
				const latSpan = northeast.latitude - southwest.latitude;
				const lngSpan = northeast.longitude - southwest.longitude;

				// 简单估算：取最大跨度
				const maxSpan = Math.max(Math.abs(latSpan), Math.abs(lngSpan));

				// 根据经验公式估算 scale（需自行校准）
				let estimatedScale;
				if (maxSpan > 10) estimatedScale = 5;
				else if (maxSpan > 5) estimatedScale = 6;
				else if (maxSpan > 1) estimatedScale = 8;
				else if (maxSpan > 0.5) estimatedScale = 10;
				else if (maxSpan > 0.1) estimatedScale = 12;
				else if (maxSpan > 0.05) estimatedScale = 14;
				else if (maxSpan > 0.01) estimatedScale = 16;
				else estimatedScale = 16;

				console.log('估算缩放级别:', estimatedScale);
				scale.value = estimatedScale;
				listPrSupplySourceFun();
			},
			fail: (err) => {
				console.warn('getRegion 不支持或失败:', err);
				// 回退到固定值或忽略
			},
		});
	};
	const eventList = ref<any>({});
	const bannerCard = ref<any[]>([]);
	const getRoadList = async () => {
		const res : any = await getEvents({ eventType: '04' });
		eventList.value = res?.clazz?.list?.[0] || {};
	};
	const getRoadListsg = async () => {
		const res : any = await getEvents({ eventType: '03' });
		bannerCard.value = res?.clazz?.list || [];
	};

	const stationList = ref<any>({});
	const getList = async () => {
		const params = { latitude: latitude.value, longitude: longitude.value, operationalStatus: '01', pageNum: 1, pageSize: 1 };
		try {
			const res : any = await getgetTollStationByIdList(params);
			stationList.value = res?.rows?.[0] || {};
		} catch (e) { }
	};

	const serviceList = ref<any>({});
	const serviceInfoList = ref<any[]>([]);
	const getServiceList = async () => {
		const params = { latitude: latitude.value, longitude: longitude.value, pageNum: 1, pageSize: 10, operationalStatus: '01' };
		const res : any = await getgetServiceAreaPageList(params);
		const records = res?.rows?.[0];
		serviceList.value = records || {};
		if (records?.id) await getServiceDetail(records.id);
	};

	const getServiceDetail = async (id : any) => {
		const res : any = await getServiceAreaById(id);
		serviceInfoList.value = res?.data?.detailList || [];
	};

	/** ========= watch / 生命周期 ========= */
	watch(
		[() => themeStore.imgUrl, () => props.scrollTop],
		([newImgUrl, top]) => {
			icoUrl.value = newImgUrl;

			if (top > 20) {
				(navBgColor.value = '#FFFFFF'), (inpBgColor.value = '#EEEEEE');
			} else {
				navBgColor.value = 'transparent';
				inpBgColor.value = '#transparent';
			}
		},
		{ immediate: true }
	);
	// 获取组件颜色
	const componentColor = themeStore.themeColors;

	// 关闭任务
	const closeTask = ref(1);
	const handleCloseTask = () => {
		closeTask.value = 2;
		uni.setStorageSync('mytaskstatus', 2);
	};
	const getIconPathByType = (item) => {
		const point = item.points?.[0];

		// 1. 优先使用自定义 image（如果存在且有效）
		if (point?.image && typeof point.image === 'string' && point.image.trim()) {
			return point.image;
		}

		// 2. 根据 type 判断
		const type = point?.type;

		if (type === 1) {
			return imgUrl + '1buchong-icon.png';
		}

		// 其他类型（2～8）统一用 chongqi-icon.png
		if ([2, 3, 4, 5, 6, 7, 8].includes(type)) {
			return imgUrl + type + 'buchong-icon.png';
		}

		// 3. 默认兜底图标（可选）
		// return imgUrl + '1buchong-icon.png'; // 或者返回 '' 表示不显示图标
	};
	onShow(() => {
		carNumber.value = uni.getStorageSync('carNumber');
		vehicleType.value = uni.getStorageSync('vclType') || 2;
		getcarData();
		businessTypeFun(pageTheme.value);
		console.log('------onShow-------0-0-0-0');
		// #ifdef APP-HARMONY
		if (commonState.chooseLocation && openMapType.value) {
			applyPickedLocation(openMapType.value, commonState.chooseLocation)
			commonState.chooseLocation = null
		}
		// #endif

	});
	onMounted(() => {
		carNumber.value = uni.getStorageSync('carNumber');
		closeTask.value = uni.getStorageSync('mytaskstatus') || 1;
		getUserAddress();
		getPrSupplyRouteSubscriptionFun();
		getRoadList();
		getRoadListsg();
		getLocation();
		checkExperiencePopup();
		openTime();
		getData();
		getcarData();

		if (uni.getStorageSync('Token')) {
			getPoints();
		}
		setTimeout(() => {
			handleQuery();
		}, 300);
		initMap();
		businessTypeFun(pageTheme.value);
		// if(pageTheme.value=="green"){
		// 	businessTypeFun(pageTheme.value);
		// }else{
		// 	businessTypeFun('blue');
		// }
	});
	// 初始化地图
	const ismakepoint=ref(true)
	const carlist = ref<any>([]);
	const getcarlist = async () => {
		// const userId = uni.getStorageSync('userInfo')?.id;
		// if (!userId) return;
		// const params = {
		// 	userId: userId,
		// };
		// const res = await getByUserIdAndVehicleAll(params)
		// carlist.value = res.data;
		// if (carlist.value.length >= 3) {
		// 	jfTabs.value[1].info = {
		// 		getPoint: true
		// 	};
		// 	console.log('获取积分', jfTabs.value)
		// }
		const allGetPointTrue = jfTabs.value.every(item => {
		  return item.info!=null && item.info.getPoint === true;
		});
		
		if (allGetPointTrue) {
		  // 所有 getPoint 都是 true，执行你的处理逻辑
		// ismakepoint.value=false
		handleCloseTask()
		  
		}
	}

	const initMap = async () => {
		try {
			// 获取用户位置
			const locationRes : any = await new Promise((resolve, reject) => {
				uni.getLocation({
					type: 'gcj02', // 腾讯地图使用gcj02坐标系
					success: resolve,
					fail: reject,
				});
			});
			console.log('初始化地图:', locationRes);
			currentLat.value = locationRes.latitude;
			currentLng.value = locationRes.longitude;
		} catch (err) {
			console.error('初始化地图失败:', err);
		} finally {
		}
	};
	const carNumberList = ref<any[]>([]);
	const carPickerIndex = ref(0);
	const getcarData = async () => {
		try {
			const userId = uni.getStorageSync('userInfo')?.id;
			if (!userId) return;
			const params = {
				userId: userId,
			};
			const res : any = await getByUserIdAndVehicleAll(params);
			carNumberList.value = res.data;
			console.log('查询的车辆信息', res.data);
			if (carNumber.value) {
				console.log('存在车牌号', carNumber.value);
				let index = carNumberList.value.findIndex((e) => e.licensePlate == carNumber.value);
				console.log('缓存的车牌在数据哪里', carNumberList.value[index]);
				carPickerIndex.value = index;
				vehicleType.value = carNumberList.value[index].vehicleType;
			} else {
				console.log('不存在车牌号', carNumber.value);
				if (res.data.length) {
					carNumber.value = res.data[0].licensePlate;
					vehicleType.value = res.data[0].vehicleType;
					uni.setStorageSync('carNumber', carNumber.value);
				}
			}
			uni.setStorageSync('vclType', vehicleType.value);
		} catch (e) { }
	};
	const licensePlateRange = computed(() =>
		carNumberList.value.map((v) => v?.licensePlate).filter((s : any) => typeof s === 'string' && s.trim().length > 0)
	);

	const onCarPickerChange = (e : any) => {
		const idx = Number(e?.detail?.value ?? 0);
		if (!licensePlateRange.value.length) {
			toast('暂无可选车辆');
			return;
		}
		carPickerIndex.value = idx;
		const plate = licensePlateRange.value[idx];
		vehicleType.value = carNumberList.value[idx].vehicleType;
		carNumber.value = plate;
		uni.setStorageSync('carNumber', carNumber.value);
		getBannerList();
		getData();
	};

	onPageScroll((e) => {
		if (e.scrollTop > 20) {
			navBgColor.value = '#FFFFFF';
			inpBgColor.value = '#EEEEEE';
		} else {
			navBgColor.value = '#D7E1EB';
			inpBgColor.value = 'rgba(255,255,255,.7)';
		}
	});

	onUnload(() => {
		if (inter) clearInterval(inter);
	});
</script>

<style scoped lang="scss">
	/* 兼容 vue 页面：必须显式声明 display:flex（nvue 默认 flex，这里是关键差异） */
	view {
		box-sizing: border-box;
	}

	.card_icon_card_header_rt_map {
		width: 209rpx;
		height: 48rpx;
		margin-top: 10rpx;
	}

	.page-container {
		width: 750rpx;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		z-index: 2;
	}

	/* 导航栏 */
	.nav-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
	}
	
	.head_bg{
		width:100%;
		height:326rpx;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}

	.weather_box {
		display: flex;
		flex-direction: row;
		align-items: center;

		.weather-icon {
			height: 48rpx;
			margin-right: 12rpx;
		}

		.weather_info {
			display: flex;
			flex-direction: column;
			align-items: flex-end;

			.weather-text {
				font-weight: 400;
				font-size: 36rpx;
				color: #333333;
			}

			.weather-cs {
				font-weight: 400;
				font-size: 20rpx;
				color: #909599;
				text-align: right;
			}
		}
	}

	.fl-ce-ce {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.titleIcon {
		font-size: 24rpx;
		line-height: 30rpx;
		padding: 0 4rpx;
		border-radius: 10rpx;
		margin-right: 8rpx;
	}

	.titleText {
		font-size: 36rpx;
		line-height: 30rpx;
		font-weight: 500;
	}

	.theme-switcher {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.pf-img {
		width: 44rpx;
		height: 40rpx;
		margin-bottom: 4rpx;
	}

	/* 一键救援悬浮 */
	.kf-box {
		position: fixed;
		top: 535rpx;
		right: 10rpx;
		z-index: 9;
		display: flex;
		flex-direction: column;
		align-items: center;

		.kf-img {
			width: 100rpx;
			height: 100rpx;
		}

		.kf-text {
			font-weight: 400;
			font-size: 20rpx;
			color: #FF3939;
		}
	}

	/* 积分模块 */
	.jf_box {
		width: 702rpx;
		height: 98rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		.jf_img {
			height: 58rpx;
			margin-right: 20rpx;
		}

		.jf_text {
			font-weight: 400;
			font-size: 28rpx;
			color: #6e6e6e;
		}

		.jf_text1 {
			color: #FF3939;
		}

		.jf_text2 {
			display: inline-block;
			flex: 1;
		}

		.jf_btn {
			width: 88rpx;
			height: 40rpx;
			// background: #efefef;
			background: #ff9b36;
			border-radius: 8rpx;
			margin-left: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.jf_btn_text {
				font-weight: 400;
				font-size: 24rpx;
				// color: #909599;
				color: #ffffff;
			}
		}
	}

	.header-box {
		position: relative;
		z-index: 0;
		width: 702rpx;
		height: 388rpx;
		display: flex;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.top-swiper {
		width: 702rpx;
		height: 388rpx;
	}

	.top-img {
		width: 702rpx;
		height: 388rpx;
		border-radius: 20rpx;
	}

	/* 小猴模块 */
	.monkey_box {
		width: 702rpx;
		height: 266rpx;
		position: relative;
		top: -40rpx;
		z-index: 5;

		.monkey_box_bg {
			width: 702rpx;
			height: 188rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 1;
		}

		.monkey_box_img {
			width: 220rpx;
			height: 266rpx;
			position: absolute;
			top: 0;
			left: -20rpx;
			z-index: 2;
		}

		.monkey_box_count {
			width: 432rpx;
			height: 188rpx;
			position: absolute;
			bottom: 0;
			right: 24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			z-index: 10;

			.monkey_box_count_tips {
				font-weight: 400;
				font-size: 24rpx;
				color: var(--secondary-color);
				margin-bottom: 32rpx;
			}

			.monkey_box_count_seach {
				width: 432rpx;
				height: 68rpx;
				background: #ffffff;
				box-shadow: 0rpx 3rpx 10rpx 0rpx #dfedde;
				border-radius: 18rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-left: 14rpx;

				.monkey_box_count_seach_img {
					width: 40rpx;
					height: 40rpx;
					margin-right: 14rpx;
				}

				.monkey_box_count_seach_input {
					flex: 1;
					height: 68rpx;
					font-weight: 400;
					font-size: 24rpx;
					line-height: 68rpx;
				}

				.monkey_box_count_seach_img1 {
					width: 68rpx;
					height: 68rpx;
				}
			}
		}
	}

	/* 主内容 */
	.page-view {
		position: relative;
		z-index: 2;
		padding-left: 24rpx;
		padding-right: 24rpx;
		margin-top: -20rpx;
		display: flex;
		flex-direction: column;
	}

	.card {
		width: 702rpx;
		border-radius: 32rpx;
		display: flex;
		flex-direction: column;
		background-image:  linear-gradient( to bottom right, #FEFEFE 0%, #FFF1F1 100%);
		box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(252,225,225,0.5926);
		margin-bottom: 32rpx;
	}

	.card-icon-card-header {
		width: 702rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-right: 24rpx;

		.card-icon-card-header_lt {
			position: relative;
			width: 230rpx;
			height: 74rpx;
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			justify-content: center;
			padding-top: 8rpx;

			.card-icon-card-header-img {
				width: 230rpx;
				height: 74rpx;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
			}

			.title-text-primary {
				font-family: DingTalk, DingTalk;
				font-weight: normal;
				font-size: 32rpx;
				color: #ffffff;
				z-index: 2;
				line-height: 35rpx;
			}

			.card-title-icon {
				width: 16rpx;
				height: 16rpx;
				margin-left: 8rpx;
				z-index: 2;
			}
		}

		.card-icon-card-header_rt {
			flex: 1;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.card-icon-card-header_rt_img {
				width: 114rpx;
				height: 25rpx;
			}

			.card-icon-card-header_rt_r {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.card-icon-card-header_rt_r_txt {
					font-size: 24rpx;
					color: #909599;
					margin-right: 10rpx;
				}
			}
		}
	}

	.card-item {
		width: 702rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.map-placeholder {
		width: 702rpx;
		height: 344rpx;
		border-radius: 24rpx;
		background: #f3f5f9;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #909599;
		font-size: 26rpx;
	}

	/* 路线卡片 */
	.route-card {
		width: 680rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-bottom: 28rpx;

		.arrow-img {
			width: 140rpx;
			height: 26rpx;
			margin-left: 10rpx;
			margin-right: 10rpx;
		}

		.route-item {
			width: 240rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.route-place {
				font-weight: 400;
				font-size: 32rpx;
				color: #333333;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 205rpx;
				text-align: center;
			}

			.route-location {
				font-weight: 400;
				font-size: 24rpx;
				color: #909599;
				margin-top: 16rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 268rpx;
				text-align: center;
			}
		}
	}

	/* 导航信息 */
	.router_info {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 28rpx;

		.router_info_times {
			width: 702rpx;
			display: flex;
			flex-direction: row;
			align-items: flex-end;
			padding-left: 32rpx;
			margin-bottom: 24rpx;

			.router_info_times_1 {
				font-weight: 500;
				font-size: 36rpx;
				color: #333333;
			}

			.router_info_times_2 {
				font-size: 32rpx;
				color: #333333;
			}

			.router_info_times_3 {
				font-size: 28rpx;
				color: #333333;
			}
		}

		.router_info_length {
			width: 702rpx;
			padding-left: 32rpx;
			margin-bottom: 51rpx;
			white-space: nowrap;

			.router_info_length_item {
				display: inline-flex;
				height: 40rpx;
				background: #07c07d;
				border-radius: 8rpx;
				padding: 0 20rpx;
				margin-right: 20rpx;
				align-items: center;

				.router_info_length_item_text {
					font-weight: 400;
					font-size: 24rpx;
					color: #ffffff;
				}
			}
		}

		.router_info_timeline {
			width: 634rpx;

			.timeline_item {
				display: flex;
				flex-direction: row;

				.timeline_item_l {
					width: 60rpx;
					margin-right: 24rpx;
					display: flex;
					flex-direction: column;
					align-items: center;

					.timeline_item_l_dot {
						width: 60rpx;
						height: 60rpx;
						background: #ff9b36;
						border-radius: 50%;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
					}

					.timeline_item_l_dot_s {
						width: 46rpx;
						height: 46rpx;
						background: #ff9b36;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.timeline_item_l_line {
						flex: 1;
						width: 24rpx;
						background: #ff9b36;
						margin-top: -5rpx;
					}

					.timeline_item_l_dot_text {
						font-size: 24rpx;
						color: #ffffff;
					}

					.timeline_item_l_dot_text1 {
						font-size: 20rpx;
						color: #ffffff;
					}
				}

				.timeline_item_r {
					flex: 1;

					.timeline_item_r_title {
						height: 60rpx;
						margin-bottom: 15rpx;
						display: flex;
						align-items: center;
					}

					.timeline_item_r_info {
						width: 562rpx;
						height: 120rpx;
						background: #efefef;
						border-radius: 12rpx;
						margin-bottom: 49rpx;
					}
				}
			}
		}

		.router_go_btn {
			width: 498rpx;
			height: 88rpx;
			border-radius: 18rpx;
			border: 2rpx solid #FF3939;
			display: flex;
			align-items: center;
			justify-content: center;

			.router_go_btn_text {
				font-weight: 500;
				font-size: 28rpx;
				color: #FF3939;
			}
		}
	}

	.grid-box-1 {
		width: 702rpx;
		padding-bottom: 28rpx;
	}

	/* 九宫格 */
	.grid-box {
		width: 702rpx;
		padding-bottom: 28rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		

		.grid-box-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			// margin: 0 15rpx;
			margin-bottom: 32rpx;
		}
	}

	/* 旅行卡片 */
	.card_lx {
		width: 702rpx;
		height: 260rpx;
		background-image: var(--head-color);
		box-shadow: 0rpx 2rpx 8rpx 0rpx var(--label-color);
		border-radius: 32rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 10;

		.lx_info {
			width: 654rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.lx_info_img {
				width: 200rpx;
				height: 156rpx;
				margin-right: 20rpx;
			}

			.lx_info_texts {
				flex: 1;
				height: 156rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.lx_info_title {
					font-weight: 400;
					font-size: 28rpx;
					color: #333333;
				}

				.lx_info_time {
					font-weight: 400;
					font-size: 24rpx;
					color: #6e6e6e;
				}

				.lx_info_rinfo {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;

					.lx_info_rinfo_text {
						font-weight: 400;
						font-size: 24rpx;
						color: #6e6e6e;
					}

					.lx_info_rinfo_text1 {
						flex: 1;
						text-align: left;
						color: #ff9b36;
					}

					.lx_info_rinfo_btn {
						width: 128rpx;
						height: 48rpx;
						background: #ff9b36;
						border-radius: 10rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						.lx_info_rinfo_btn_text {
							font-weight: 400;
							font-size: 28rpx;
							color: #ffffff;
						}
					}
				}
			}
		}
	}

	/* 小标题 */
	.card_sm_head {
		width: 654rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 21rpx;
		margin-bottom: 20rpx;

		.card_sm_head_l {
			display: flex;
			flex-direction: row;
			align-items: flex-start;

			.card_sm_head_text {
				font-family: DingTalk, DingTalk;
				font-weight: normal;
				font-size: 32rpx;
				color: #FF3939;
				margin-right: 8rpx;
			}

			.card_sm_head_icon {
				width: 16rpx;
				height: 16rpx;
			}
		}

		.card_sm_head_r {
			display: flex;
			flex-direction: row;
			align-items: center;

			.card_sm_head_r_text {
				font-weight: 400;
				font-size: 24rpx;
				color: #909599;
				margin-right: 10rpx;
			}

			.card_sm_head_r_icon {
				width: 80rpx;
				height: 18rpx;
			}
		}
	}

	/* 任务列表 */
	.rw_list {
		.rw_item {
			width: 654rpx;
			height: 88rpx;
			background: linear-gradient( to right, #FFDEDE 0%, #FEFEFE 100%);
			border-radius: 16rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding-left: 20rpx;
			padding-right: 28rpx;
			margin-bottom: 29rpx;
			border-bottom: 3rpx solid #FD7061;

			&:last-child {
				margin-bottom: 0;
			}

			.rw_item_img {
				width: 76rpx;
				height: 76rpx;
				margin-right: 20rpx;
			}

			.rw_item_text {
				flex: 1;
				text-align: left;
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
			}

			.rw_item_btn {
				width: 146rpx;
				height: 48rpx;
				background-color: #ff9b36;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.rw_item_btn_text {
					font-weight: 400;
					font-size: 24rpx;
					color: #ffffff;
				}
			}

			.rw_item_btn-1 {
				width: 148rpx;
				height: 52rpx;
				background: #efefef;
				border-radius: 8rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.rw_item_btn_text-1 {
					font-weight: 400;
					font-size: 24rpx;
					color: #909599;
				}
			}
		}
	}

	/* 福利列表 */
	.card_goods_list {
		width: 654rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 33rpx;
		gap: 10;

		.card_goods_item {
			width: calc(654rpx / 4);
			display: flex;
			flex-direction: column;
			align-items: center;

			.card_goods_item_img {
				width: calc(654rpx / 4);
				height: 164rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.card_goods_item_img_1 {
					height: 100rpx;
					width: 164rpx;
					margin-right: 10rpx;
				}
			}

			.card_goods_item_title {
				width: 136rpx;
				font-weight: 400;
				font-size: 24rpx;
				color: #333333;
			}

			.card_goods_item_jf {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.card_goods_item_jf_num {
					font-weight: 400;
					font-size: 28rpx;
					color: #ff9b36;
				}

				.card_goods_item_jf_icon {
					width: 27rpx;
					height: 21rpx;
				}
			}
		}
	}

	/* 体验官弹窗 */
	.exp-popup {
		width: 580rpx;
		padding: 40rpx 30rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: transparent;
	}

	.exp-popup__card {
		width: 520rpx;
		border-radius: 24rpx;
		overflow: hidden;
	}

	.exp-popup__btn-wrap {
		width: 364rpx;
		height: 98rpx;
		margin-top: -122rpx;
		margin-bottom: 56rpx;
		position: relative;
	}

	.exp-popup__btn-bg {
		width: 364rpx;
		height: 98rpx;
		border-radius: 999rpx;
	}

	.exp-popup__btn-text {
		position: absolute;
		left: 0;
		top: 0;
		width: 364rpx;
		height: 98rpx;
		text-align: center;
		line-height: 98rpx;
		font-size: 30rpx;
		color: #ffffff;
		font-weight: 600;
	}

	.exp-popup__close {
		width: 96rpx;
		height: 96rpx;
		margin-bottom: 30rpx;
	}

	/* 订单弹窗 */
	.orderBox-close {
		width: 70rpx;
		height: 70rpx;
		margin: 0 auto;
	}

	.order-close-wrap {
		flex: 1;
		display: flex;
		align-items: center;
		margin-top: 30rpx;
		justify-content: center;
	}

	.tex28_66_b {
		font-size: 28rpx;
		color: #666666;
		font-weight: bold;
	}

	.orderBox {
		width: 700rpx;
		height: 880rpx;
		position: relative;

		.orderBox-bgImg {
			position: absolute;
			top: 0;
			left: 0;
			width: 700rpx;
			height: 880rpx;
		}

		.orderBox-box {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			width: 700rpx;
			height: 880rpx;
		}

		.fontBox {
			display: inline-block;
			font-size: 34rpx;
			font-weight: bold;
			letter-spacing: 3rpx;
			color: #ffffff;
			margin-bottom: 30rpx;
			text-align: center;
			padding: 20rpx 0 0 0;
		}

		.timer {
			width: 636rpx;
			height: 63rpx;
			background-color: #ffffff;
			border-radius: 28rpx;
			border: solid 1rpx #e1e1e1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 20rpx;
			margin: 0 auto;
		}

		.timer-right {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		.fontText1 {
			display: inline-block;
			width: 48rpx;
			height: 48rpx;
			background-color: #f3f5f9;
			border-radius: 4rpx;
			line-height: 48rpx;
			text-align: center;
			font-size: 28rpx;
			letter-spacing: 3rpx;
			color: #333333;
			font-weight: bold;
		}

		.fontText2 {
			font-size: 28rpx;
			color: #999999;
			margin: 0 6rpx;
		}

		.station {
			margin-top: 70rpx;
			width: 700rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			.station-text1 {
				font-size: 30rpx;
				font-weight: bold;
				letter-spacing: 3rpx;
				color: #666666;
			}

			.station-text2 {
				max-width: 500rpx;
				font-size: 30rpx;
				font-weight: bold;
				letter-spacing: 3rpx;
				color: #333333;
			}
		}

		.codeBox {
			width: 440rpx;
			height: 440rpx;
			margin: 40rpx auto 0;
			display: block;
		}

		.tips {
			width: 480rpx;
			height: 60rpx;
			background-color: #f0f0f0;
			text-align: center;
			line-height: 60rpx;
			font-size: 28rpx;
			letter-spacing: 3rpx;
			color: #666666;
			margin-top: 20rpx;
		}
	}

	.fl-al-ce-col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* 单行省略（你模板里用的是 texNoWrap） */
	.texNoWrap,
	.tex-no-wrap {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.wx-map {
		width: 702rpx;
		height: 344rpx;
		border-radius: 24rpx 24rpx 0 0;
		overflow: hidden;
	}

	.kfImg {
		width: 48rpx;
		height: 48rpx;
		margin-right: 20rpx;
	}

	.qhImg {
		width: 32rpx;
		height: 32rpx;
		margin-left: 20rpx;
	}

	.card_sm_head_text {
		font-family: DingTalk, DingTalk;
		font-weight: normal;
		font-size: 32rpx;
		color: #FF3939;
		margin-right: 8rpx;
	}

	.card_sm_head_icon {
		width: 16rpx;
		height: 16rpx;
	}

	.hot-img {
		width: 28rpx;
		height: 32rpx;
	}

	.yh-card-header {
		display: flex;
		margin-bottom: 18rpx;
	}

	.card-icon-card-item {
		padding: 0 24rpx 10rpx;
	}

	.card-icon-card-box {
		margin-bottom: 24rpx;
	}

	.yh-card-item {
		width: 654rpx;
		height: 164rpx;
		background: linear-gradient( to bottom right, #FFE8E8 0%, #FFF4F4 100%);;
		box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(252,225,225,0.5926);
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		padding: 12rpx 24rpx 12rpx 12rpx;
		box-sizing: border-box;

		.yh-img {
			width: 140rpx;
			height: 140rpx;
			border-radius: 16rpx;
			margin-right: 24rpx;
		}

		.yh-time {
			font-weight: 400;
			font-size: 24rpx;
			color: #909599;
			margin-top: 40rpx;
		}

		.yh-btn {
			width: 128rpx;
			height: 52rpx;
			background: #ff9b36;
			border-radius: 10rpx;
			font-weight: 400;
			font-size: 28rpx;
			color: #ffffff;
			text-align: center;
			line-height: 52rpx;
		}
	}

	.card-w {
		background:  linear-gradient( to bottom right, #FEFEFE 0%, #FFF1F1 100%);
	}

	.hc-card {
		width: 654rpx;
		height: 232rpx;
		background: linear-gradient( to bottom right, #FFE8E8 0%, #FFF4F4 100%);;
		box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(252,225,225,0.5926);
		border-radius: 16rpx;
		padding: 38rpx 24rpx 32rpx;
		box-sizing: border-box;
		margin: 0 24rpx 32rpx;
	}

	.city-name {
		width: 110rpx;
		font-weight: 500;
		font-size: 36rpx;
		color: #000000;
	}

	.hc-num {
		width: 190rpx;
		font-weight: 500;
		font-size: 36rpx;
		color: #ff9b36;
	}

	.hc-label {
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
		width: 120rpx;
		margin-right: 26rpx;
	}

	.hc-value {
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.hc-btn {
		width: 148rpx;
		height: 52rpx;
		background: #ff9b36;
		border-radius: 10rpx;
		text-align: center;
		line-height: 52rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #ffffff;
	}

	.arrow-img {
		width: 140rpx;
		height: 26rpx;
		margin-left: 10rpx;
		margin-right: 10rpx;
	}

	.hc-card-btn {
		width: 498rpx;
		height: 88rpx;
		border-radius: 20rpx;
		border: 2rpx solid #FF3939;
		font-weight: 500;
		font-size: 28rpx;
		color: #FF3939;
		text-align: center;
		line-height: 88rpx;
		box-sizing: border-box;
		margin: 0 auto 32rpx;
	}

	/* ====== 高速路况：截图风格时间轴 ====== */
	.route-timeline {
		width: 634rpx;
		margin: 0 auto 10rpx;
		display: flex;
		flex-direction: column;
	}

	.tl-item {
		width: 634rpx;
		display: flex;
		flex-direction: row;
	}

	.tl-left {
		width: 68rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tl-dot {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999rpx;
	}

	.dot-flag {
		width: 46rpx;
		height: 46rpx;
	}

	.dot-km {
		width: 60rpx;
		height: 60rpx;
		flex-direction: column;
	}

	.dot-red {
		background: #ef4519;
	}

	.dot-orange {
		background: #ff9b36;
	}

	.dot-green {
		background: #07c07d;
	}

	.flag-text {
		font-size: 24rpx;
		color: #ffffff;
		font-weight: 600;
	}

	.km-val {
		font-size: 20rpx;
		color: #ffffff;
		// font-weight: 600;
		line-height: 24rpx;
	}

	.km-unit {
		font-size: 18rpx;
		color: #ffffff;
		line-height: 18rpx;
	}

	.tl-line {
		flex: 1;
		margin-top: -6rpx;
		margin-bottom: -6rpx;
	}

	.line-solid {
		width: 24rpx;
		background: #ff9b36;
		border-radius: 999rpx;
	}

	.line-dotted {
		width: 0;
		border-left: 2rpx dashed #ff9b36;
	}

	.tl-right {
		width: 566rpx;
		padding-left: 18rpx;
		padding-bottom: 26rpx;
	}

	.tl-head {
		height: 60rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12rpx;
	}

	.tl-title-wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		// flex: 1;
		min-width: 0;
	}

	.tl-title {
		font-size: 30rpx;
		color: #333333;
		font-weight: 600;
		max-width: 360rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-right: 24rpx;
	}

	.title-danger {
		color: #ff4d4f;
		font-weight: 600;
	}

	.title-success {
		color: #07c07d;
		font-weight: 600;
	}

	.tl-sub {
		margin-left: 12rpx;
		font-size: 28rpx;
		color: #333333;
	}

	.tl-right-text {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 22rpx;
		white-space: nowrap;
	}

	.rt-muted {
		color: #909599;
	}

	.rt-danger {
		color: #ef4519;
	}

	.rt-success {
		color: #07c07d;
	}

	.tl-arrow {
		margin-left: 6rpx;
		font-size: 24rpx;
		color: #909599;
	}

	.tl-panel {
		border-radius: 16rpx;
	}
	
	.rout_box{
		flex: 1;
		background: #EFEFEF;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		padding-top: 19rpx;
		padding-right: 20rpx;
		padding-bottom: 19rpx;
		padding-left: 20rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		.rout_title{
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 20rpx;
			.rout_img{
				width: 34rpx;
				height: 34rpx;
				margin-right: 10rpx;
			}
			.rout_text{
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
			}
		}
		.rout_count{
			width: 100%;
			background: #FFFFFF;
			border-radius: 12rpx;
			padding-top:12rpx;
			padding-bottom: 12rpx;
			padding-left:17rpx;
			padding-right: 17rpx;
			box-sizing: border-box;
			.rout_count_txt{
				font-weight: 400;
				font-size: 24rpx;
				color: #333333;
			}
		}
	}

	.tl-panel_scroll {
		flex: 1 0;
		display: flex;
		white-space: nowrap;
	}

	.tl-panel-gray {
		background: #efefef;
		padding: 16rpx 18rpx;
		display: flex;
		align-items: center;
	}

	.ch-row {
		display: inline-block;
		margin-right: 8rpx;
	}

	.ch-name {
		font-size: 24rpx;
		color: #333333;
	}

	.ch-bars {
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
	}

	.bar {
		width: 40rpx;
		height: 40rpx;
		border-radius: 4rpx;
	}

	.bar-green {
		background: #07c07d;
	}

	.bar-red {
		background: #ef4519;
	}

	/* 占用车道那行：右侧时间 */
	.tl-panel-lane .lane-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.lane-time {
		margin-left: 14rpx;
		font-size: 24rpx;
		color: #ef4519;
		white-space: nowrap;
	}

	/* 服务区绿色面板 */
	.tl-panel-green {
		background: rgba(7, 192, 125, 0.19);
		padding: 16rpx 16rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.svc-icons {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.svc-icon {
		width: 52rpx;
		height: 52rpx;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10rpx;
	}

	.svc-btn {
		height: 56rpx;
		padding: 0 18rpx;
		background: #25c17a;
		border-radius: 12rpx;
		color: #ffffff;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tl-spacer {
		height: 12rpx;
	}

	/* 右侧信息区：文字 + 按钮并排 */
	.tl-right-area {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx;
	}

	/* 胶囊按钮 */
	.tl-badge {
		height: 40rpx;
		padding: 0 18rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
	}

	.badge-green {
		background: #628f2f;
	}

	.badge-orange {
		background: #ff9b36;
	}

	/* 向右小三角 */
	.tl-arrow-tri {
		width: 16rpx;
		height: 16rpx;
		margin-left: 8rpx;
	}

	.mt25 {
		margin-top: -25rpx;
	}

	.map {
		width: 702rpx;
		height: 400rpx;
		border-radius: 38rpx 38rpx 0rpx 0rpx;
	}

	.card_sm_head_r_aright {
		width: 18rpx;
		height: 18rpx;
	}

	.grid-box-img {
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 10rpx;
	}

	.grid-box-text {
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
	}

	.bg_o {
		background: #ff9b36 !important;
	}

	.service-img {
		width: 40rpx;
		height: 40rpx;
	}
</style>