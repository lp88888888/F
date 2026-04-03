<template>
	<view class="page-container" :style="{ backgroundColor: '#FCFFFC' }" :data-theme="pageTheme">
		<!-- 占位：给顶部自定义导航预留高度 -->
		<view :style="{ height: topBoxHeight + 'px' }"></view>

		<!-- 一键救援悬浮 -->
		<view class="kf-box" @click="toNav('/pages_A/roadRescue/index')">
			<image class="kf-img" :src="imgUrl + 'static/new_kf_img.png'"></image>
			<text class="kf-text">一键救援</text>
		</view>

		<!-- 积分 @click="toNav('/pages_D/volumePricing/discount/index')" -->
		<view class="jf_box">
			<!-- <image class="jf_img" src="/static/tabbar/tabbar-jy.png" mode="heightFix"></image> -->
			<text class="jf_text">我的积分：</text>
			<text class="jf_text jf_text1">{{ getAlljf() }}</text>
			<text class="jf_text jf_text2">分</text>

			<view class="fl-al-ce" style="flex-direction: row;">
				<view class="theme-switcher" style="margin-right: 20rpx;" @click="toNav('/pages_E/globalsearch/index')">
					<u-icon :name="imgUrl + 'search-icons2.png'" size="40rpx"></u-icon>
				</view>
				<view class="theme-switcher" @click="toNav('/pages_A/setting/themeswitcher')">
					<u-icon :name="imgUrl + 'ind-icon-pf.png'" size="40rpx"></u-icon>
				</view>
			</view>
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
			<image class="monkey_box_bg" :src="icoUrl + 'monkey_bg.png'"></image>
			<image class="monkey_box_img" @click="toUrlLogin('/pages_E/digitalHuman/index')"
				:src="icoUrl + 'BdDigitalMan/idle_6.gif'" mode="aspectFill"></image>
			<view class="maQp" @click="toUrlLogin('/pages_E/digitalHuman/index')">
				<view class="maQp-View" >
					<image class="maQp-bg" :src="icoUrl+'home-index-qp2.png'" mode=""></image>
					<view class="maQp-View-center">
						<image class="maQp-View-icon" :src="icoUrl+'home-index-heads.png'" mode=""></image>
						<!-- <text class="maQp-View-text" :style="{ color: themeStore.themeColors.$primaryColor }">点点我或说出"小猴小猴"唤醒我哦~</text> -->
						<text class="maQp-View-text" :style="{ color: themeStore.themeColors.$primaryColor }">点点我唤醒我哦~</text>
					</view>
				</view>
			</view>
			<view class="monkey_box_count">
				<!-- <text class="monkey_box_count_tips">点点我唤醒我哦~</text> -->
				<!-- <view class="monkey_box_count_seach" @click="handleChangeDwinput">
					<image class="monkey_box_count_seach_img" :src="icoUrl + 'monkey_mike.png'"></image>
					<text class="monkey_box_count_seach_input" style="color: #909599">搜地点、查路况、找服务</text>
					<image class="monkey_box_count_seach_img1" :src="imgUrl + 'static/monkey_confirm.png'"></image>
				</view> -->
				<view class="route-card">
					<view class="route-item" @click="openMap('start')">
						<text class="route-place">{{ mylocationinfo.name || '我的位置' }}</text>
						<text class="route-location">{{ mylocationinfo.address|| '' }}</text>
					</view>
					<image class="arrow-img" :src="icoUrl + 'to_line.png'"></image>
					<view class="route-item" @click="openMap('end')">
						<text class="route-place">{{ endlocationinfo.name || '目的地' }}</text>
						<text class="route-location">{{ endlocationinfo.address || '请输入目的地' }}</text>
					</view>
				</view>
				<view class="monkey_box_count_bottom" v-if="routeByLngLat.totalDistance && !lxIsSHow">
					<text class="monkey_box_count_bottom_item" v-if="!lxIsSHow"
						:style="{ color: themeStore.themeColors.$primaryColor }" @click="lxIsSHow = true">展开内容</text>
					<text class="monkey_box_count_bottom_item" :style="{ color: themeStore.themeColors.$primaryColor }"
						@click="lxClear">一键清空</text>
				</view>
			</view>
		</view>

		<view class="page-view">
			<!-- 速小猴看路况 -->
			<view class="card" v-if="routeByLngLat.totalDistance && lxIsSHow && isLogin"
				:style="{ background: themeStore.themeColors.$linearColor, boxShadow: themeStore.themeColors.$homeCardBoxShadow }">
				<view class="card-icon-card-header" style="align-items: center;">
					<view class="card-icon-card-header_lt" style="width: 320rpx;justify-content: flex-start;">
						<image class="card-icon-card-header-img" style="width: 320rpx;" :src="icoUrl + 'icon_bg2.png'">
						</image>
						<text class="title-text-primary" style="margin-left: 36rpx;">速小猴看路况</text>
						<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
					</view>
					<text class="iconText" v-if="!qureyShow">已完成思考</text>
				</view>
				<view class="szrBox">
					<view class="querBoxTitle" v-if="qureyShow">
						<up-icon :name="icoUrl+'BdDigitalMan/dmIcon8.png'" size="14"></up-icon>
						<text
							class="querBoxTitle-text">解析{{!qureyShow?'完成':'中'}}(基于「{{queryTextName(chatCot)}}」技能回答)</text>
					</view>
					<view :class="[textShow?'':'szrBox-A']">
						<view :class="[textShow?'szrBox-text':'szrBox-text2']">{{answerText}}</view>
						<view class="textAi" v-if="textShow && answerText">该内容由人工智能AI生成</view>
						<view class="bbView" v-if="textShow && answerText" >
							<view class="bbView-Box" @click="bobaoShow?voiceStop():voicePlay(audioSrc)">
								<image class="bbView-Box-bg" v-if="bobaoShow" :src="icoUrl+'home-index-bobao-icon3.png'" mode=""></image>
								<image class="bbView-Box-bg" v-else :src="icoUrl+'home-index-bobao-icon2.png'" mode=""></image>
								<view class="bbView-Box-view">
									<image class="bbView-Box-view-img" v-if="bobaoShow" :src="icoUrl+'home-index-bobao-icon1.png'"></image>
									<image class="bbView-Box-view-img" v-else :src="imgUrl+'home-index-bobao-icon.png'"></image>
									<text class="bbView-Box-view-text" :style="{ color: bobaoShow?'#333333':'#ffffff' }">{{bobaoShow?'停止播报':'开始播报'}}</text>
								</view>
							</view>
						</view>
						<view class="szrBox-but" v-if="!qureyShow"
							:style="{ color: themeStore.themeColors.$primaryColor }" @click="textShow = !textShow">
							{{textShow?'点击收起':'展开'}}
						</view>
					</view>
				</view>
			</view>
			<!-- 出行方案 -->
			<view class="card" v-if="routeByLngLat.totalDistance && lxIsSHow">
				<view class="card-icon-card-header">
					<view class="card-icon-card-header_lt">
						<image class="card-icon-card-header-img" :src="icoUrl + 'icon_bg.png'"></image>
						<text class="title-text-primary">出行方案</text>
						<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
					</view>
					<view class="fl-ce-ce" @click="handleMapMode">
						<u-icon :name="icoUrl + 'address-icon-1.png'" size="32rpx"></u-icon>
						<text class="iconText" :style="{ color: themeStore.themeColors.$primaryColor }">地图模式</text>
					</view>
				</view>

				<view class="card-item">
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
											<view class="tq_tag" v-if="node.alerts">
												<text class="tq_tag_text"
													v-for="(titem,tindex) in node.alerts">{{ titem.eventType?.name }}</text>
											</view>
											<view v-if="node.rightText" class="tl-right-text"
												@tap.stop="node.onRightTextClick && node.onRightTextClick(node)">
												<text
													:class="['', 'rt-muted', 'rt-danger', 'rt-success'][node.rightClass]">{{ node.rightText }}</text>
												<image v-if="node.rightArrow" class="tl-arrow-tri"
													:src="`${imgUrl}static/home_line_arrow${node.rightClass}.png`"
													mode=""></image>
											</view>
										</view>

									</view>

									<!-- 收费站下对应服务： 以量定价 / 可办理ETC / 绿通预约  -->
									<view v-if="node.badges && node.badges.length" class="tl-right-area">
										<text class="tl-badge"
											:style="{ color: themeStore.themeColors.$primaryColor, borderColor: themeStore.themeColors.$primaryColor }"
											v-for="(badgeItem, badgeIndex) in node.badges" :key="badgeIndex"
											@tap.stop="badgeItem.onClick && badgeItem.onClick(node)">
											{{ badgeItem?.text || '' }}
										</text>
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
											<image class="rout_img" :src="`${imgUrl}static/rout_icon.png`" mode="">
											</image>
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
					<view class="lxBottomTetx" @click="lxIsSHow = false">
						<u-icon name="arrow-up" size="30rpx" :color="themeStore.themeColors.$primaryColor"></u-icon>
						<text class="lxBottomTetx-text" :style="{ color: themeStore.themeColors.$primaryColor }">
							全部收起</text>
					</view>
				</view>
			</view>
			<!-- 出行服务 -->
			<view class="card">
				<view class="card-icon-card-header">
					<view class="card-icon-card-header_lt">
						<image class="card-icon-card-header-img" :src="icoUrl + 'icon_bg.png'"></image>
						<text class="title-text-primary">出行服务</text>
						<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
					</view>
				</view>
				<view class="card-item">
					<view class="grid-box">
						<view class="grid-box-item" style="width: 140rpx" v-for="(item, index) in lkTabs" :key="index"
							@click="tabsClick(item)">
							<image class="grid-box-img" :src="item.iconUrl"></image>
							<text class="grid-box-text">{{ item.entryName }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="card">
				<view class="card-icon-card-header" style="align-items: center;">
					<view class="card-icon-card-header_lt">
						<image class="card-icon-card-header-img" :src="icoUrl + 'icon_bg.png'"></image>
						<text class="title-text-primary">服务区</text>
						<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
					</view>
					<text class="iconText" :style="{ color: themeStore.themeColors.$primaryColor,fontSize:'28rpx' }"
						@click="toNav('/pages_A/station/index')">全部</text>
				</view>
				<view class="card_item" style="padding: 0rpx 0rpx 0rpx 0rpx;">
					<swiper class="swiper" :style="{ width: '702rpx', height: swiperHeight + 'rpx' }" :autoplay="false"
						:current="swiperCurrent" @change="handleSwiperChange">
						<swiper-item v-for="(item, index) in serviceInfoList" :key="index"
							:style="{width: '702rpx',height:'100%' }">
							<view class="service-card" @click="handleFwqDetail(item)">
								<view class="header-section">
									<view class="image-wrapper">
										<u-image :src="item.serviceAreaPicture || imgUrl + 'del/car-back1.png'" lazyLoad
											width="190rpx" height="190rpx" radius="16rpx"></u-image>
										<view class="status-badge">{{ item.operationalStatus == '01' ? '正常' : '关闭' }}</view>
										<view class="star-overlay" v-if="item.starRatingLabel">
											<text class="star-text">{{item.starRatingLabel}}</text>
										</view>
									</view>

									<view class="info-content">
										<view class="title-row">
											<text class="title">{{ item.serviceAreaName }}</text>
											<text class="direction">{{item.lineDirection || ''}}</text>
										</view>
										<view class="fl-ce-sb" style="margin-bottom: 20rpx;">
											<text class="address texNoWrap">{{ item.address }}</text>
											<text class="distance" style="margin-left: 20rpx;">{{ item.distance }}</text>
										</view>
										<!-- <view class="title-row">
											<text class="title">{{ item.serviceAreaName || '' }}{{ handleEstimate(item) }}</text>
											<text class="distance">{{ item.distance }}</text>
										</view>
										<text class="address texNoWrap">{{ item.address }}</text> -->

										<view class="tag-group" v-if="item.detailList && item.detailList.length">
											<view class="tag-item"
												:style="{ background: (item1.serviceInfoCode == '05' || item1.serviceInfoCode == '13' || item1.serviceInfoCode == '16')?'#FFF6DC':themeStore.themeColors.$badgeBgColor}"
												v-for="(item1, index1) in item.displayTags " :key="index1">
												<u-icon :name="item1.serviceInfoPicUrl" size="24rpx"></u-icon>
												<text class="tag-text"
													:style="{ color: (item1.serviceInfoCode == '05' || item1.serviceInfoCode == '13' || item1.serviceInfoCode == '16')?'#FFBC05':themeStore.themeColors.$primaryColor}">{{ item1.serviceInfoName }}</text>
											</view>
										</view>
									</view>
								</view>

								<view class="bottom-section" v-if="hasBottomData(item)">
									<view class="promo-box texNoWrap"
										v-if="item.serviceAreaActivityList && item.serviceAreaActivityList.length">
										<view class="promo-title">限时活动：</view>
										<text
											class="promo-text texNoWrap">{{ item.serviceAreaActivityList[0].activityContent }}</text>
									</view>
									<view class="action-cards">
										<view class="cardd gas-card"
											v-if="item.gasStationList && item.gasStationList.length && item.gasStationList[0].odsGasStationOilPriceVoList.length"
											@click.stop="goJyDetail(item.gasStationList[0])">
											<view class="fl-al-ce"
												style="display: flex;flex-direction: row;align-items: center;">
												<view class="fl-al-ce"
													v-for="(events,evIndex) in gasCoumStationList(item.gasStationList[0].odsGasStationOilPriceVoList)"
													:key="evIndex"
													style="flex-direction: row;align-items: center;margin-right: 20rpx;">
													<text class="card-label">{{events.oilName}}</text>
													<view class="price-row">
														<view class="price-num">{{events.stationPrice}}</view>
														<view class="price-unit">元/L</view>
													</view>
												</view>
											</view>
											<view class="card-btn">
												<text class="btn-text orange-text">去加油</text>
												<u-icon name="arrow-right" size="20rpx" color="#FF5405"></u-icon>
											</view>
										</view>
										<view class="cardd charge-card"
											v-if="item.chargingStationList && item.chargingStationList.length"
											@click.stop="goCdDetail(item.chargingStationList[0])">
											<view class="fl-al-ce"
												style="display: flex;flex-direction: row;align-items: center;">
												<text class="card-label">空闲充电桩</text>
												<view class="card-icon-item iconK"
													:style="{ background: themeStore.themeColors.$badgeBgColor,border:`2rpx solid ${themeStore.themeColors.$primaryColor}` }">
													<view class="card-icon-item-text"
														:style="{ background: themeStore.themeColors.$primaryColor }">快
													</view>
													<view class="card-icon-item-num"
														:style="{ color: themeStore.themeColors.$primaryColor }">
														{{item.chargingStationList[0].slowFree + item.chargingStationList[0].fastFree }}/{{ item.chargingStationList[0].slowTotal + item.chargingStationList[0].fastTotal }}
													</view>
												</view>
											</view>
											<view class="card-btn">
												<text class="btn-text blue-text">去充电</text>
												<u-icon name="arrow-right" size="20rpx" color="#4881F5"></u-icon>
											</view>
										</view>
									</view>
								</view>
								<image class="watermark" v-if="item.themeLabel == '红色印记'" :src="imgUrl+'static/station-icon-1.png'" lazy-load></image>
								<image class="watermark" v-if="item.themeLabel == '綜台服务'" :src="imgUrl+'static/station-icon-2.png'" lazy-load></image>
								<image class="watermark" v-if="item.themeLabel == '交文旅融合'" :src="imgUrl+'static/station-icon-3.png'" lazy-load></image>
								<image class="watermark" v-if="item.themeLabel == '休闲运动'" :src="imgUrl+'static/station-icon-4.png'" lazy-load></image>
								<image class="watermark" v-if="item.themeLabel == '温馨驿站'" :src="imgUrl+'static/station-icon-5.png'" lazy-load></image>
								<image class="watermark" v-if="item.themeLabel == '红色文化'" :src="imgUrl+'static/station-icon-6.png'" lazy-load></image>
								<!-- <view class="bottom-section" v-if="hasBottomData(item)">
							<view class="promo-box" v-if="item.serviceAreaActivityList && item.serviceAreaActivityList.length">
								<view class="promo-title">限时活动：</view>
								<view class="promo-text">{{ item.serviceAreaActivityList[0].activityContent }}</view>
							</view>

							<view class="action-cards" >
								<view class="car2d gas-card" v-if="item.gasStationList && item.gasStationList.length && item.gasStationList[0].odsGasStationOilPriceVoList.length" @click.stop="goJyDetail(item.gasStationList[0])">
									<text class="card-label">{{ item.gasStationList[0].odsGasStationOilPriceVoList[0].oilName }}</text>
									<view class="price-row">
										<text class="price">{{ item.gasStationList[0].odsGasStationOilPriceVoList[0].stationPrice }}</text>
										<text class="unit">元/L</text>
									</view>
									<view class="card-btn orange-text">
										去加油 
										<u-icon name="arrow-right" size="20rpx" color="#FF5405"></u-icon>
									</view>
								</view>

								<view class="car2d charge-card" v-if="item.chargingStationList && item.chargingStationList.length" @click.stop="goCdDetail(item.chargingStationList[0])">
									<text class="card-label">空闲充电桩</text>
									<view class="price-row">
										<text class="price">{{item.chargingStationList[0].slowFree + item.chargingStationList[0].fastFree }}</text>
										<text class="price">/{{ item.chargingStationList[0].slowTotal + item.chargingStationList[0].fastTotal }}</text>
									</view>
									<view class="card-btn blue-text">
										去充电 
										<u-icon name="arrow-right" size="20rpx" color="#4881F5"></u-icon>
									</view>
								</view>
							</view>
						</view> -->
							</view>
						</swiper-item>
					</swiper>
					<view class="swiper_dot">
						<view :class="[index == swiperCurrent?'swiper_dot_active':'swiper_dot_item']"
							:style="{background: index == swiperCurrent?themeStore.themeColors.$primaryColor:'#D8D8D8'}"
							v-for="(item,index) in serviceInfoList"></view>
					</view>
				</view>
			</view>

			<!-- 出行生活 -->
			<view class="card" v-for="(item,index) in activitylist" 
				:style="{ background: themeStore.themeColors.$linearColor, boxShadow: themeStore.themeColors.$homeCardBoxShadow }">
				<view class="card_lx">
					<view class="card_sm_head">
						<view class="card_sm_head_l">
							<text class="card_sm_head_text">{{item.activityName }}</text>
							<image class="card_sm_head_icon" :src="icoUrl + 'rt_icon.png'"> </image>
						</view>
					</view>

					<view class="lx_info">
						<image  v-if="!item.image" class="lx_info_img" :src="imgUrl + 'static/qlx.png'"> </image>
						<image v-else class="lx_info_img" :src="item.image"></image>
						<view class="lx_info_texts">
							<text class="lx_info_title">{{item.activitySubtitle }}</text>
							<text class="lx_info_time">{{item.startDate}}</text>
							<view class="lx_info_rinfo">
								<text class="lx_info_rinfo_text"></text>
								<!-- <text class="lx_info_rinfo_text lx_info_rinfo_text1">32人</text> -->
								<view class="lx_info_rinfo_btn">
									<text class="lx_info_rinfo_btn_text" @click="toNav(item.jumpRoute)" >去报名</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>


			<!-- 优惠通行 -->
			<!-- <view v-if="vehicleType == 1" class="card card-w"> -->
			<view v-if="vehicleType == 1 && yhList.length" class="card card-w">
				<view class="card-icon-card-header">
					<view class="card-icon-card-header_lt">
						<image class="card-icon-card-header-img" :src="icoUrl + 'icon_bg.png'"></image>
						<text class="title-text-primary">优惠通行</text>
						<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
					</view>
				</view>
				<view class="card-icon-card-item">
					<view class="card-icon-card-items">
						<view class="card-icon-card-box flex flex-col" v-for="(item, index) in yhList" :key="index"
							@click="tabsyyClick(item)">
							<view class="yh-card-header">
								<image class="hot-img" :src="imgUrl + 'static/hot_icon.png'"></image>
								<text class="card_sm_head_text">&nbsp;&nbsp;{{ item.name }}</text>
								<image class="card_sm_head_icon" :src="icoUrl + 'card_lt_icon_green.png'"> </image>
							</view>
							<view class="yh-card-item">
								<image class="yh-img" :src="item.imageUrl"></image>
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

			<!-- 完成任务 -->
			<view class="card card-w">
				<view class="card-icon-card-header">
					<view class="card-icon-card-header_lt">
						<image class="card-icon-card-header-img" :src="icoUrl + 'icon_bg.png'"></image>
						<text class="title-text-primary">福利兑换</text>
						<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
					</view>

					<view class="card-icon-card-header_rt">
						<!-- <image v-if="closeTask == 1" class="card-icon-card-header_rt_img"
							:src="imgUrl + 'static/card_jf_icon.png'"></image>
						<image v-if="closeTask != 1" class="card-icon-card-header_rt_img" :src="''"></image>
						<view v-if="closeTask == 1" class="card-icon-card-header_rt_r" @click="handleCloseTask">
							<text class="card-icon-card-header_rt_r_txt">不再提示任务</text>
							<uni-icons type="closeempty" size="12" color="#909599"></uni-icons>
						</view> -->
						<view class="card-icon-card-header_rt_r"
							@click="toRec('/pages/home/home?type=points')">
							<text class="card-icon-card-header_rt_r_txt">兑换更多福利</text>
							<image class="card_sm_head_r_aright" :src="imgUrl + 'static/card_double right.png'">
							</image>
						</view>
					</view>
				</view>

				<view class="card-item">
					<!-- <view class="rw_list" v-if="closeTask == 1"> -->
					<!-- <view class="rw_list" v-if="closeTask == 1">
						<view class="rw_item card-w" v-for="(item, index) in jfTabs" :key="index">
							<image class="rw_item_img" :src="icoUrl+item.icon"></image>
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
							<image class="card_sm_head_icon" :src="icoUrl + 'card_lt_icon_green.png'"></image>
						</view>
						<view class="card_sm_head_r" @click="toRec('/pages/home/home?type=points')">
							<text class="card_sm_head_r_text">兑换更多福利</text>
							<image class="card_sm_head_r_aright" :src="imgUrl + 'static/card_double right.png'">
							</image>
						</view>
					</view> -->

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

		<!-- 导航栏放置最后：vue 页面靠 z-index 控制即可 -->
		<view class="nav-container" :style="{background:themeStore.themeColors.$tabbarBg1}" id="navID">
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
						<view class="weather_box_icon" v-if="weatherNowyujing.length>0">
							<!-- {{weatherNowyujing[0]?.eventType?.name}} -->
							预警
						</view>
					</view>
				</template>

				<template #center>
					<view class="fl-ce-ce" style="flex-direction: row" @click="toJump('/pages_A/car/myCar')">
						<!-- <text class="titleIcon" :style="{
								color: themeStore.themeColors.$secondaryColor,
								border: `1px solid ${themeStore.themeColors.$secondaryColor}`
							}">客</text> -->
						<image v-if="vehicleType == 1 && carNumber" class="kfImg" :src="icoUrl + 'huo_icon.png'"
							mode="scaleToFill" />
						<image v-if="vehicleType != 1 && carNumber" class="kfImg" :src="icoUrl + 'ke_icon.png'"
							mode="scaleToFill" />
						<text class="titleText"
							v-if="uni.getStorageSync('Token')">{{ carNumber ? carNumber : '请绑定车辆' }}</text>
						<text class="titleText" v-else>点击登录</text>
						<!-- <image class="qhImg" :src="imgUrl+'static/qh_kh_icon.png'" mode="scaleToFill" /> -->
						<view v-if="carNumber" @tap.stop>
							<picker mode="selector" :range="licensePlateRange" :value="carPickerIndex"
								@change="onCarPickerChange">
								<view class="native-select">
									<image class="qhImg" :src="imgUrl + 'static/qh_kh_icon.png'" mode="scaleToFill" />
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
		<up-popup v-model:show="showExperiencePopup1" mode="center" @close="getHomeConfig" :closeOnClickOverlay="true" :round="24"
			bgColor="transparent" z-index="9999999">
			<view class="exp-popup1" @click="getHomeConfig" :style="{ backgroundImage: `url(${imgUrl}home-zs-bj.png)`,backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center' }">
				<view class="lw-vox">
					<text class="lw-vox-text-1">
						{{maskPhone(liwuobj.senderPhone)}}，送你一份礼物
					</text>
					<image class="lw-avi" :src="liwuobj.spuPicUrl"></image>
					<text class="lw-vox-text-2">
						{{liwuobj.spuName}}
					</text>
				</view>
				<!-- <view class="order-close-wrap1" >
					<image class="orderBox-close1" @click="showExperiencePopup1=false"
						:src="imgUrl + 'ic_close_white.png'">
					</image>
				</view> -->

			</view>
		</up-popup>
		<!-- 订单二维码弹窗 -->
		<up-popup v-model:show="showOrder" mode="center" :closeOnClickOverlay="true" :round="24" bgColor="transparent"
			z-index="9999999">
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
		<PageDurationTracker pageName="首页" />

		<!-- #ifdef APP -->
		<UpdateProtocol></UpdateProtocol>
		<gao-ChatSSEClient ref="chatSSEClientRef" :heartbeat-timeout="120000" :timeout="300000" :max-retry-count="5"
			@onOpen="openCore" @onError="errorCore" @onMessage="messageCore" @onFinish="finishCore" />
		<!-- #endif -->
		<AudioPlayer ref="audioRef" @onEnded="handleEnded"></AudioPlayer>
		
		<HomeAiHuman ref='aipop'></HomeAiHuman>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed, watch, onMounted, nextTick,onUnmounted } from 'vue';
	import { onPageScroll, onUnload, onShow, onReady } from '@dcloudio/uni-app';
	import { imgUrl, aiUrl } from '../../config';
	import { toNav, toRec } from '@/utils/route';
	import PageDurationTracker from '@/components/PageDurationTracker.vue'
	import HomeAiHuman from '@/components/OpenAiHuman/HomeAiHuman'
	import { CurrentPage, showAlert2, openLocation, getUUID, formatTimestamp,fixQuotes } from '@/utils/util';
	import { toast } from '@/utils/common';
	import { splitTime } from '@/utils/date';
	import { useAppStore } from '@/store/modules/app';
	import { useElementRects } from '@/utils/useElementRect';
	import { bannerList } from '@/api/car';
	import { getTadayApi, getWeatherWarnings } from '@/api/weather.ts';
	import QQMapWX from '../../common/qqmap-wx-jssdk.js';
	import { postmapServicesList, getServiceAreaByLngLatlist } from '@/api/map.ts';
	import { getmemberpointsDetailStatistics, getmembermakePoint, postsaveSignInPoint } from '@/api/member';
	import { getByUserIdAndVehicleAll } from '@/api/user';
	import { getNewsList, recordShow, shouldShow, getRouteByLngLat, gridMenu, tiyanguan, gethomeconfig, gethomefwq,getActiveList } from '@/api/home';
	import { updateClickVolume, getLocationInfoid } from '@/api/index';
	import { getPrSupplyRouteSubscription, listPrSupplySource } from '@/api/premium';
	import { listPoints, getpageTypeActivityInfo, getclassify, postreceive, gethasunreceived, getunreceivedlist, getgridMenuhome } from '@/api/points';
	import { getEvents, getgetTollStationByIdList, getgetServiceAreaPageList, getServiceAreaById } from '@/api/map';
	import UpdateProtocol from '@/components/PrivacyDialog/UpdateProtocol.vue'
	import { useCommonStore } from '@/store/modules/common';
	import { getOpenToken, openChat } from "@/api/openApi";
	import { getToken } from "@/utils/token";
	import { textCensor } from "@/api/language";
	// #ifdef APP-PLUS
	import { request } from '@/uni_modules/hans-request'
	// #endif
	import AudioPlayer from '@/components/AudioPlayer';
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
	const textShow = ref(true);
	const mapContainerW = computed(() => Math.round(rpx2px(702)));
	const mapContainerH = computed(() => Math.round(rpx2px(353)));
	const mapContext = ref(null);
	const aipop = ref(null);
	let regionTimer : ReturnType<typeof setTimeout> | null = null;
	const toUrlLogin = (url) => {
		if (isLogin.value) {
			// toNav(url);
			aipop.value.handleopen()
		} else {
			uni.showToast({ title: '登录后使用，请先登录', icon: 'none' });
		}
	};
	const maskPhone = (raw) => {
		if (!raw) return ''
		const clean = String(raw).replace(/\D/g, '')
		if (clean.length === 11 && /^1[3-9]/.test(clean)) {
			return clean.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
		}
		return raw // 或 return '***'
	}
	const getisliwu = async () => {
		const res = await gethasunreceived();
		if (res.code == 200) {
			if (res.data) {
				gerliwulist()
			} else {
				showExperiencePopup1.value = false
			}
		}
	};
	const getactivitylist = async () => {
		const res = await getActiveList();
		if (res.code == 200) {
			activitylist.value = res.data
			console.log('-0-00--0-0getactivitylist-0-00-0-0-0-0-',activitylist.value);
		}
	};
	const activitylist = ref<any[]>([])

	const getHomeConfig = async () => {
		const res = await postreceive();
		if (res.code == 200) {
			uni.navigateTo({
				url: '/pages_A/order/index',
			});
			showExperiencePopup1.value = false
		}
	};
	const liwuobj = ref({})
	const gerliwulist = async () => {
		const res = await getunreceivedlist();
		if (res.code == 200) {
			liwuobj.value = res.data[0]
			showExperiencePopup1.value = true
		}
	};

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
	const handleEstimate = (item) => {
		if (item.serviceAreaName == '曲江服务区' || item.serviceAreaName == '汉城服务区') {
			return `(${['', '内环', '外环'][item.locationDirection]})`;
		}
		if (item.locationDirection) {
			return `(${item.serviceAreaName.indexOf('绕城') != -1 ? ['', '内环', '外环'][item.locationDirection] : ['', '上行', '下行'][item.locationDirection]
				})`;
		}
		return '';
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
		let res = await getpageTypeActivityInfo(vehicleType.value == 1 ? 0 : 1);
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
	const topBoxHeight = ref(88);

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
	const showExperiencePopup1 = ref(false);
	type GlobalData = { hasCheckExperiencePopup ?: boolean };
	const app = getApp<{ globalData : GlobalData }>();
	const isshow = ref<boolean>(true);
	const openExperiencePopup = () => (showExperiencePopup.value = true);
	const closeExperiencePopup = () => (showExperiencePopup.value = false);

	// 打开地图模式
	const handleMapMode = () => {
		uni.setStorageSync('mapmodedata', {
			mylocationinfo: JSON.stringify(mylocationinfo.value),
			endlocationinfo: JSON.stringify(endlocationinfo.value),
			routeByLngLat: JSON.stringify({
				totalDistance: routeByLngLat.value.totalDistance,
				totalTime: routeByLngLat.value.totalTime
			}),
		})
		uni.navigateTo({
			url: '/pages_B/mapmode/index',
			// success: () => {
			// 	uni.$emit('mapmodedata', {
			// 		mylocationinfo: JSON.stringify(mylocationinfo.value),
			// 		endlocationinfo: JSON.stringify(endlocationinfo.value),
			// 		routeByLngLat: JSON.stringify({
			// 			totalDistance: routeByLngLat.value.totalDistance,
			// 			totalTime: routeByLngLat.value.totalTime
			// 		}),
			// 	});
			// }
		})
	};

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
		if (res.data == 1) {
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

	/** ========= tabs ========= */
	const lkTabs = ref([]);
	// const ywTabs = ref([]);
	const fwTabs = ref([]);
	const ywTabs = computed(() => {
		return hcywTabs.value.filter(item => item.entryName != '绿通预约' && item.entryName != '运政办理' && item.entryName != '更多服务')
	})
	const hcywTabs = ref([])
	// const ywTabs = ref([])
	// const lkTabs = computed(() => [
	// 	{ name: '路况地图', icon: icoUrl.value + 'lkdt_icon.png', type: '', route: '/pages_A/map/index' },
	// 	{ name: '路况信息', icon: icoUrl.value + 'lkxx_icon.png', type: '', route: '/pages_A/mapInfo/index' },
	// 	{ name: '高速直播', icon: icoUrl.value + 'gszb_icon.png', type: '', route: '' },
	// 	{ name: '服务区', icon: icoUrl.value + 'fwq_icon.png', type: '', route: '/pages_A/station/index' },
	// 	{ name: '收费站', icon: icoUrl.value + 'sfz_icon.png', type: '', route: '/pages_A/toll/index' },
	// ]);

	// const ywTabs = computed(() => [
	// 	{ name: 'ETC申办', icon: imgUrl + 'static/card_etc.png', text: '免费申办 包邮到家', type: 'appid', route: 'wxe442a27a2747b061' },
	// 	{ name: '通行费查询', icon: imgUrl + 'static/card_query_money.png', text: '查询比价 选择实惠', type: '', route: '/pages_A/tollInvoice/query' },
	// 	{ name: '扫码付', icon: imgUrl + 'static/card_scan_code.png', text: '人工车道 快速支付', type: '', route: '' },
	// 	{ name: '通行费票据', icon: imgUrl + 'static/card_bill.png', text: '未开发票快速申请', type: '', route: '/pages_A/tollInvoice/index' },
	// 	{ name: '通行费补缴', icon: imgUrl + 'static/card_payment.png', text: '补缴费用一次不跑', type: 'appid', route: 'wxf52b8d2bb696e5f4' },
	// ]);

	// const hcywTabs = computed(() => [
	// 	{ name: 'ETC申办', icon: imgUrl + 'static/card_etc.png', text: '免费申办 包邮到家', type: 'appid', route: 'wxe442a27a2747b061' },
	// 	{ name: '绿通预约', icon: imgUrl + 'static/card_greengo.png', text: '鲜活农产 预约上路', type: 'appid', route: 'wxa153df20e8888c68' },
	// 	{ name: '通行费票据', icon: imgUrl + 'static/card_bill.png', text: '未开发票快速申请', type: '', route: '/pages_A/tollInvoice/index' },
	// 	{ name: '通行费补缴', icon: imgUrl + 'static/card_payment.png', text: '补缴费用一次不跑', type: 'appid', route: 'wxf52b8d2bb696e5f4' },
	// 	{ name: '扫码付', icon: imgUrl + 'static/card_scan_code.png', text: '人工车道 快速支付', type: '', route: '' },
	// 	{ name: '通行费查询', icon: imgUrl + 'static/card_query_money.png', text: '查询比价 选择实惠', type: '', route: '/pages_A/tollInvoice/query' },
	// 	{ name: '运政办理', icon: imgUrl + 'static/card_politics.png', text: '道路运政 一网通办', type: 'appid', route: 'wx00a6d2bbd6cf9160' },
	// 	{ name: '更多服务', icon: imgUrl + 'static/card_ywmore.png', text: '查询比价 选择实惠', type: '', route: '' },
	// ]);

	// const fwTabs = computed(() => [
	// 	{ name: '充电', icon: icoUrl.value + 'cd_icon.png', type: '', route: '/pages_A/chargingPiles/index' },
	// 	{ name: '加油', icon: icoUrl.value + 'jy_icon.png', type: '', route: '/pages_D/refuelingRefilling/index' },
	// 	{ name: '酒店住宿', icon: icoUrl.value + 'jdzs_icon.png', type: '', route: '/pages_B/hotel/hotelist' },
	// 	{ name: '汽车维修', icon: icoUrl.value + 'qcwx_icon.png', type: '', route: '/pages_D/repair/carRepair' },
	// 	// { name: '餐饮美食', icon: icoUrl.value + 'cyms_icon.png', type: '', route: '/pages_B/dining/index' },
	// 	// { name: '餐饮美食', icon: imgUrl + 'static/card_food.png', type: '', route: '' },
	// ]);

	// 根据业务类型查询金刚列表
	const businessTypeFun = async (val) => {
		const now = new Date();
		const params = {
			startTime: formatToMinuteWithSec00(now),
			endTime: formatToMinuteWithSec00(now),
			secondaryIconPath: val
		};
		const res : any = await getclassify(params);
		console.log("高速路况金刚区", res)
		if (res?.code == 200) {
			// const truedata = res.rows.filter(item => item.enabled == 1)
			// const truedata = res.data['首页常用'].filter(item => item.enabled == 1 && item.businessType == '0').sort((a, b) => b.priority - a.priority);
			const truedata = res.data['基础服务'].filter(item => item.businessType == '0');
			// #ifdef APP-HARMONY
			const harmonydata = truedata.filter(item => item.showDeviceTypes.includes('2'))
			// const harmonydata = truedata.filter(item => item.showDeviceTypes.includes('2'))
			lkTabs.value = harmonydata
			// #endif
			// #ifndef APP-HARMONY
			lkTabs.value = truedata
			// #endif
		}
	};

	const jfTabs = ref([
		{
			name: '加入会员',
			icon: 'vip_icon.png',
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
			icon: 'bdcl_icon.png',
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
			icon: 'wsxx_icon.png',
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
		console.log("首页金刚区点击", item)
		// 内部 0，
		if (item.jumpType == 0) {
			if (item.jumpPage == '/') return toast('该功能正在快马加鞭赶来的路上');
			toNav(item.jumpPage);
			// 外部 1，
		} else if (item.jumpType == 1) {
			// #ifdef MP-WEIXIN
			if (item.custom == 1) return toast('该功能正在快马加鞭赶来的路上');
			// #endif
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(item.jumpPage),
			});
			// 小程序 2
		} else if (item.jumpType == 2) {
			navLink(item.jumpPage)
			// if ( item.jumpPage == 'wxe442a27a2747b061') {
			// 	sateLayerRef.value.open({
			// 		address: '',
			// 		appId: 'wxe442a27a2747b061',
			// 		appSrcId: 'gh_95045762f7a8',
			// 		enterprise: '陕西高速公路电子收费有限公司',
			// 		name: 'ETC申请',
			// 		state: '01',
			// 		status: '01',
			// 	});
			// }
			// if ( item.jumpPage == 'wxf52b8d2bb696e5f4') {
			// 	sateLayerRef.value.open({
			// 		address: '',
			// 		appId: 'wxf52b8d2bb696e5f4',
			// 		appSrcId: 'gh_dd4bedd2010f',
			// 		enterprise: '行云数聚（北京）科技有限公司',
			// 		name: '通行费补缴',
			// 		state: '01',
			// 		status: '01',
			// 	});
			// }
			// if (item.jumpPage == 'wxa153df20e8888c68') {
			// 	sateLayerRef.value.open({
			// 		address: '/pages/appointment/view/index/index',
			// 		appId: 'wxa153df20e8888c68',
			// 		appSrcId: 'gh079c162b7d29',
			// 		enterprise: '陕西蓝德智慧交通科技有限公司',
			// 		name: '绿通预约',
			// 		state: '01',
			// 		status: '01',
			// 	});
			// }
			// if (item.jumpPage == 'wx00a6d2bbd6cf9160') {
			// 	sateLayerRef.value.open({
			// 		address: '',
			// 		appId: 'wx00a6d2bbd6cf9160',
			// 		appSrcId: '',
			// 		enterprise: '中国交通通信信息中心',
			// 		name: '运政办理',
			// 		state: '01',
			// 		status: '01',
			// 	});
			// }
		}
		// return;
		// if (item.entryName == '高速直播') return toast('该功能正在快马加鞭赶来的路上');
		// if (item.entryName == '通行费查询') return toast('该功能正在快马加鞭赶来的路上');
		// if (item.entryName == '扫码付') return toast('该功能正在快马加鞭赶来的路上');
		// console.log('78993030', item);
		// // #ifdef APP-HARMONY
		// if (item.entryName == 'ETC办理') return toast('该功能正在快马加鞭赶来的路上');
		// if (item.entryName == '通行费补缴') return toast('该功能正在快马加鞭赶来的路上');
		// // #endif
		// // jid 
		// if (item.entryName == 'ETC办理' || item.jumpPage == 'wxe442a27a2747b061') {
		// 	sateLayerRef.value.open({
		// 		address: '',
		// 		appId: 'wxe442a27a2747b061',
		// 		appSrcId: 'gh_95045762f7a8',
		// 		enterprise: '陕西高速公路电子收费有限公司',
		// 		name: 'ETC申请',
		// 		state: '01',
		// 		status: '01',
		// 	});
		// }
		// if (item.entryName == '通行费补缴' || item.jumpPage == 'wxf52b8d2bb696e5f4') {
		// 	sateLayerRef.value.open({
		// 		address: '',
		// 		appId: 'wxf52b8d2bb696e5f4',
		// 		appSrcId: 'gh_dd4bedd2010f',
		// 		enterprise: '行云数聚（北京）科技有限公司',
		// 		name: '通行费补缴',
		// 		state: '01',
		// 		status: '01',
		// 	});
		// }
		// if (item.type == 'appid') {
		// 	navLink(item.route);
		// } else {
		// 	if ((!item.jumpPage && !item.route) || item.jumpPage == '/') return toast('该功能正在快马加鞭赶来的路上');
		// 	toNav(item.jumpPage || item.route);
		// }
	};
	const navLink = (appid : string) => {
		// 登录校验
		// if (!isLogin.value) {
		// 	showAlert2(
		// 		'提示',
		// 		'本次操作需要您进行登录验证',
		// 		false,
		// 		'取消',
		// 		'确定',
		// 		(success) => {
		// 			// #ifdef MP-WEIXIN
		// 			uni.navigateTo({
		// 				url: '/pages_A/login/login?fromPage=' + CurrentPage(),
		// 			});
		// 			// #endif
		// 			// #ifdef APP
		// 			uni.navigateTo({ url: '/pages_A/login_password/login' });
		// 			// #endif
		// 		},
		// 		null
		// 	);
		// 	return;
		// }


		if (appid == 'https://yjglfp.sx12122.cn/') {
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
			});
		} else if (appid == 'https://gaoguantong.ruitong369.com/GaoGuanTongServer/gaoguantongHTML/html/direction/12122/MainTest.html?wxH5=1') {
			uni.navigateTo({
				url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
			});
		} else {
			sateLayerRef.value.open(appStore.MiniProgramConfig[appid]);
		}
	};
	// const navLink = (appid : string) => {
	// 	// 登录校验
	// 	if (!isLogin.value) {
	// 		showAlert2(
	// 			'提示',
	// 			'本次操作需要您进行登录验证',
	// 			false,
	// 			'取消',
	// 			'确定',
	// 			(success) => {
	// 				// #ifdef MP-WEIXIN
	// 				uni.navigateTo({
	// 					url: '/pages_A/login/login?fromPage=' + CurrentPage(),
	// 				});
	// 				// #endif
	// 				// #ifdef APP
	// 				uni.navigateTo({ url: '/pages_A/login_password/login' });
	// 				// #endif
	// 			},
	// 			null
	// 		);
	// 		return;
	// 	}
	// 	// #ifdef APP-HARMONY
	// 	return toast('该功能正在快马加鞭赶来的路上')
	// 	// #endif
	// 	if (appid == 'wxe442a27a2747b061') {
	// 		sateLayerRef.value.open({
	// 			address: '',
	// 			appId: 'wxe442a27a2747b061',
	// 			appSrcId: 'gh_95045762f7a8',
	// 			enterprise: '陕西高速公路电子收费有限公司',
	// 			name: 'ETC申请',
	// 			state: '01',
	// 			status: '01',
	// 		});
	// 	}
	// 	if (appid == 'wxf52b8d2bb696e5f4') {
	// 		sateLayerRef.value.open({
	// 			address: '',
	// 			appId: 'wxf52b8d2bb696e5f4',
	// 			appSrcId: 'gh_dd4bedd2010f',
	// 			enterprise: '行云数聚（北京）科技有限公司',
	// 			name: '通行费补缴',
	// 			state: '01',
	// 			status: '01',
	// 		});
	// 	}
	// 	if (appid == 'wxa153df20e8888c68') {
	// 		sateLayerRef.value.open({
	// 			address: '/pages/appointment/view/index/index',
	// 			appId: 'wxa153df20e8888c68',
	// 			appSrcId: 'gh079c162b7d29',
	// 			enterprise: '陕西蓝德智慧交通科技有限公司',
	// 			name: '绿通预约',
	// 			state: '01',
	// 			status: '01',
	// 		});
	// 	}

	// 	if (appid == 'wx00a6d2bbd6cf9160') {
	// 		sateLayerRef.value.open({
	// 			address: '',
	// 			appId: 'wx00a6d2bbd6cf9160',
	// 			appSrcId: '',
	// 			enterprise: '中国交通通信信息中心',
	// 			name: '运政办理',
	// 			state: '01',
	// 			status: '01',
	// 		});
	// 	}

	// 	if (appid == 'https://yjglfp.sx12122.cn/') {
	// 		uni.navigateTo({
	// 			url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
	// 		});
	// 	}
	// 	if (appid == 'https://gaoguantong.ruitong369.com/GaoGuanTongServer/gaoguantongHTML/html/direction/12122/MainTest.html?wxH5=1') {
	// 		uni.navigateTo({
	// 			url: '/pages_A/raffleH5/index?linkUrl=' + encodeURIComponent(appid),
	// 		});
	// 	}
	// };
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
					name: uni.getStorageSync('address').city,
					address: uni.getStorageSync('address').standardAddress,
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
					standardAddress: '西安市',
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
					name: uni.getStorageSync('address').city,
					address: uni.getStorageSync('address').city + uni.getStorageSync('address').district,
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

	const mylocationinfo = ref<any>({
		name: '',
		address: '',
		city: '',
		location: { latitude: null, longitude: null },
	});
	const endlocationinfo = ref<any>({
		name: '',
		address: '',
		city: '',
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
						title: `${firstServiceArea?.serviceAreaName}${handleEstimate(firstServiceArea)}等${serviceNum}个服务区`,
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
				title: `${sa?.serviceAreaName}${handleEstimate(sa)}` || `服务区${idx + 1}`,
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
				alerts: routeByLngLat.value.startLocation?.weather.alerts || []
			},

			// 收费站1
			{
				dotType: 'km',
				km: distance1,
				dotClass: 'dot-km dot-orange',
				lineClass: 'line-solid',
				title: entry1.name || '',
				rightText: '',
				routinfo: entry1.vehicleControl || '', //部分车辆管制
				badges: [
					...(entry1.volumePricingFlag ? [{
						text: '以量定价',
						class: 'badge-orange',
						onClick: toyldj,
					}] : []),
					...(entry1.etcNetworkFlag ? [{
						text: '可办理ETC',
						class: 'badge-orange',
					}] : []),
				],
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
				rightText: '',
				routinfo: entry2.vehicleControl || '',
				badges: [
					...(entry2.volumePricingFlag ? [{
						text: '以量定价',
						class: 'badge-orange',
						onClick: toyldj,
					}] : []),
					...(entry2.etcNetworkFlag ? [{
						text: '可办理ETC',
						class: 'badge-orange',
					}] : []),
				],
				rightArrow: false,
				panel: 'channels',
				channels: entry2.lanes || [],
			},

			// 终点
			{
				dotType: 'flag',
				flagText: '到',
				dotClass: 'dot-flag dot-green',
				lineClass: '',
				title: '到达',
				conditiontxt: `${routeByLngLat.value.endLocation?.weather.condition}`,
				subTitle: `${routeByLngLat.value.endLocation?.weather.temperature}℃`,
				rightText: '',
				rightArrow: false,
				panel: '',
				alerts: routeByLngLat.value.endLocation?.weather.alerts || []
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
	// const detailListRows = (arr) => {
	// 	console.log('-0-0-0--00--0', arr);
	// 	if(arr && arr.length){
	// 		return arr.slice(0,5)
	// 	}
	// 	return []

	// }
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
			name: matches[0],
			// 自定义
			// custom:"测试",
			color: pageTheme.value,

			// startTime: formatToMinuteWithSec00(now),
			// endTime: formatToMinuteWithSec00(now),
		};
		let res : any = await bannerList(type, params);
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
					if (uni.getStorageSync('Token')) {
						setChat(`查询${mylocationinfo.value.name}到${endlocationinfo.value.name}的路况`)
					}
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
	const lxIsSHow = ref(false);// 是否查看路线
	const lxClear = () => {
		endlocationinfo.value = {};
		routeByLngLat.value = [];
		getServiceList()
	}
	const openMapType = ref('');
	const openMap = (type : string) => {
		// #ifdef MP-WEIXIN
		uni.chooseLocation({
			success: (res) => {
				console.log('-0-0-0--00--0', res);
				applyPickedLocation(type, res);
			},
			fail: (err) => {
				console.log('chooseLocation fail:', err);
			},
		});
		// #endif
		// #ifdef APP
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
	const weatherNowyujing = ref([])
	const getgetWeatherWarnings = async (locationId : string) => {
		const params = {
			location: locationId,
		};
		try {
			const response : any = await getWeatherWarnings(params);
			weatherNowyujing.value = response.data.alerts || [];
			getBannerList()
		} catch (error) { }
	};
	const getcityid = async (e : any) => {
		const params = { locationNameZh: e.district, adm2NameZh: e.city };
		const response : any = await getLocationInfoid(params);
		if (response.code === 200) {
			await getWeatherNow(response.data.locationId);
			await getgetWeatherWarnings(response.data.locationId);
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
		lxIsSHow.value = true;
		const params = {
			startLongitude: mylocationinfo.value.location.longitude || uni.getStorageSync('address').lng,
			startLatitude: mylocationinfo.value.location.latitude || uni.getStorageSync('address').lat,
			endLongitude: endlocationinfo.value.location.longitude || 0,
			endLatitude: endlocationinfo.value.location.latitude || 0,
			coordType: '1',
		};
		const res : any = await getRouteByLngLat(params);
		console.log("查询的路径信息", res)
		if (res.code == 200) {
			routeByLngLat.value = res.data;
			serviceInfoList.value = routeByLngLat.value.serviceAreaList.map(item => ({
				...item,
				// 提前计算好，这样模板里直接访问属性，不会触发函数执行
				displayTags: item.detailList ? item.detailList.slice(0, 5) : []
			})) || [];
			console.log
			if (serviceInfoList.value.length) {
				handleSwiperChange({ detail: { current: 0 } })
			}
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
		const params = { latitude: latitude.value, longitude: longitude.value, pageNum: 1, pageSize: 5, operationalStatus: '01' };
		const res : any = await gethomefwq(params);
		console.log("查询的服务区", res)
		serviceInfoList.value = res.data.map(item => ({
			...item,
			// 提前计算好，这样模板里直接访问属性，不会触发函数执行
			displayTags: item.detailList ? item.detailList.slice(0, 5) : []
		})) || [];
		if (serviceInfoList.value.length) {
			handleSwiperChange({ detail: { current: 0 } })
		}
		// const records = res?.rows?.[0];
		// serviceList.value = records || {};
		// if (records?.id) await getServiceDetail(records.id);
	};
	const getServiceDetail = async (id : any) => {
		const res : any = await getServiceAreaById(id);
		// serviceInfoList.value = res?.data?.detailList || [];
	};

	// 去加油
	const goJyDetail = (item) => {
		toNav('/pages_D/refuelingRefilling/details?merId=' + item.stationId);
	};

	// 去充电
	const goCdDetail = (item) => {
		toNav('/pages_A/chargingPiles/queryDetail?id=' + item.stationId);
	};

	// 服务区详情
	const handleFwqDetail = (item) => {
		toNav('/pages_A/stationDetails/index?id=' + item.id)
	}

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

	// 查询以量定价
	const tabsyyClick = (item) => {
		if (item.jumpAddr == '/') return toast('该功能正在快马加鞭赶来的路上');
		toNav(item.jumpAddr)
	}
	// const yhList = ref( [
	// 	{ name: '“以量定价”差异化收费活动', icon: imgUrl + 'static/yh_bm1.png', hot: '1', jumpType: 0, jumpPage: '/pages_D/volumePricing/discount/index' },
	// 	// { name: '“货车积分”补贴活动', icon: imgUrl + 'static/yh_bm2.png', hot: '0', route: '' },
	// ]);
	const yhList = ref([])
	const getyldj = async () => {
		try {
			const res = await gethomeconfig({ name: "“以量定价”差异化收费活动", enabled: 1 })
			console.log("以量定价数据", res)
			yhList.value = res.rows
		} catch (err) {
			console.log("以量定价错误", err)
		}
	}
	const gethome = async (val) => {
		let params = {
			secondaryIconPath: val,
		}
		const res = await getgridMenuhome(params)
		if (res.code == 200) {
			const truedata = res.rows.filter(item =>  item.businessType == '0');
			const harmonydata = truedata.filter(item => item.showDeviceTypes.includes('2'))
			lkTabs.value = truedata
		}
	}
	onShow(() => {
		carNumber.value = uni.getStorageSync('carNumber');
		vehicleType.value = uni.getStorageSync('vclType') || 2;
		getcarData();
		if (uni.getStorageSync('Token')) {
			gethome(pageTheme.value)
			getPoints();
		} else {
			businessTypeFun(pageTheme.value);
		}

		// #ifdef APP
		console.log('------onShow-------0-0-0-0', commonState.chooseLocation);
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
		getactivitylist()
		if (!endlocationinfo.value.location?.latitude) {
			getLocation();
		}
		checkExperiencePopup();
		openTime();
		getData();
		getcarData();
		if (uni.getStorageSync('Token')) {
			getPoints();
			getyldj()
			getisliwu()
			gethome(pageTheme.value)
		} else {
			businessTypeFun(pageTheme.value);
		}
		setTimeout(() => {
			handleQuery();
		}, 300);
		initMap();
		audioInit();
		// if(pageTheme.value=="green"){
		// 	businessTypeFun(pageTheme.value);
		// }else{
		// 	businessTypeFun('blue');
		// }
	});
	// 初始化地图
	const ismakepoint = ref(true)
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
			return item.info != null && item.info.getPoint === true;
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
			if(!res.data.length){
				carNumber.value = ''
				vehicleType.value = 2
				uni.removeStorageSync('carNumber')
				uni.removeStorageSync('vclType')
				return;
			}
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
	const swiperHeight = ref(500);
	const swiperCurrent = ref(0);
	const gasCoumStationList = (arr) => {
		if (!arr || !Array.isArray(arr)) return [];
		let newArr = [];
		for (let item of arr) {
			// 增加对 item 和 oilName 的安全判断
			if (item && item.oilName && (item.oilName.includes('92') || item.oilName.includes('95'))) {
				newArr.push(item);
			}
		}
		return newArr;
	};
	const hasBottomData = (item : any) => {
		let num = 0
		if (item.serviceAreaActivityList && item.serviceAreaActivityList.length) {
			num = num + 1
		}
		if (item.gasStationList && item.gasStationList.length) {
			num = num + 1
		}
		if (item.chargingStationList && item.chargingStationList.length) {
			num = num + 1
		}
		return num
		// return (item.serviceAreaActivityList && item.serviceAreaActivityList.length) || (item.gasStationList && item.gasStationList.length) ||(item.chargingStationList && item.chargingStationList.length)
	};
	const handleSwiperChange = (e : any) => {
		const currentIdx = e.detail.current;
		swiperCurrent.value = e.detail.current
		const currentItem = serviceInfoList.value[currentIdx];
		console.log('-0---0-0------------', currentItem)
		console.log('-0---0-0------------', hasBottomData(currentItem))
		let targetHeight = 280; // 基础高度
		if (hasBottomData(currentItem) == 3) {
			targetHeight = 500; // 展开时的高度
		} else if (hasBottomData(currentItem) == 2) {
			targetHeight = 400; // 展开时的高度
		} else if (hasBottomData(currentItem) == 1) {
			targetHeight = 315; // 展开时的高度
		} else {
			targetHeight = 280; // 只有头部信息时的高度 (建议根据设计稿实际高度调整)
		}
		nextTick(() => {
			swiperHeight.value = targetHeight
		})

		console.log('-0---0-0--swiperHeight----------', swiperHeight.value)
		// if (hasBottomData(currentItem)) {
		// 	swiperHeight.value = 480; // 展开时的高度
		// } else {
		// 	swiperHeight.value = 270; // 只有头部信息时的高度 (建议根据设计稿实际高度调整)
		// }
	};
	/* 大模型请求 */
	const chatSSEClientRef = ref(null);
	const answerText = ref('')
	const qureyShow = ref(true);
	const chatCot = ref([])
	const queryTextName = computed(() => {
		return (cot) => {
			let title = '大模型'
			console.log();
			if (cot && Array.isArray(cot) && cot.length) {
				if (cot[0].outputs) {
					title = cot[0].outputs.name
				}
			}

			return title
		}
	})
	const setChat = async (query) => {
		answerText.value = ''
		qureyShow.value = true
		chatCot.value = []
		const requestTime = formatTimestamp((new Date().getTime() - 1000), 'YYYY-MM-DD HH:mm:ss');
		try {
			const tokenRes = await getOpenToken(requestTime);
			if (tokenRes.status === 200) {
				// #ifdef APP-PLUS
				// start(tokenRes.result, requestTime,query);
				if (uni.getSystemInfoSync().platform == 'ios') {
					iosStart(tokenRes.result, requestTime, query)
				} else {
					start(tokenRes.result, requestTime, query);
				}
				// #endif
				// #ifdef MP-WEIXIN || APP-HARMONY
				const messageId = getUUID()
				const task = uni.request({
					url: aiUrl + '/copilot/v1/openApi/chat',
					header: {
						copilotToken: tokenRes.result,
						requestTime: requestTime,
						copilotAk: 'copilot_ak_4qZ84MGWrRoXcMwY',
						assistantId: 118,
					},
					enableChunked: true,          // 关键 1
					responseType: 'arraybuffer',  // 关键 2
					method: 'POST',
					data: {
						type: 'IM_CLICK',
						assistantId: 118,
						query: query,
						sessionId: getUUID(),
						params: {
							userCode: getToken(), // 用户token
							// 'user_info': formData.value || undefined,
							userLat: uni.getStorageSync('address').lat || '',
							userLon: uni.getStorageSync('address').lng || '',
							useLon: uni.getStorageSync('address').lng || '',
							'member_id': uni.getStorageSync('userInfo').id || '',
							// 'member_id':'131',
							// 'memberType': uni.getStorageSync('userInfo').memberType || '1',
							// mobile:parseTokens(uni.getStorageSync('Token'))?.member_phone,
						}
					},
					success: (res) => {
						console.log(res)
					},
					fail: (err) => {
						console.log('err', err)
					}
				})

				// 2. 监听流式片段
				let textBuf = ''           // 文本缓冲
				let byteBuf = new ArrayBuffer(0) // 二进制缓冲

				task.onChunkReceived(({ data }) => {
					if (!data || data.byteLength === 0) return
					/* 1. 先拼上一次剩下的半截 */
					const tmp = new Uint8Array(byteBuf.byteLength + data.byteLength)
					tmp.set(new Uint8Array(byteBuf), 0)
					tmp.set(new Uint8Array(data), byteBuf.byteLength)

					/* 2. 安全解码：把能解的解掉，剩下的留到下次 */
					const { str, remain } = safeDecode(tmp.buffer)
					textBuf += str
					byteBuf = tmp.buffer.slice(tmp.buffer.byteLength - remain)

					/* 3. 按 SSE 边界切包 */
					const pieces = textBuf.split('\n\n')
					textBuf = pieces.pop() || '' // 最后一项不完整
					pieces.forEach(chunk => {
						if (!chunk.startsWith('data:')) return
						const jsonStr = chunk.slice(5).trim()
						try {
							const msg = JSON.parse(jsonStr)
							console.log('收到消息:', msg)
							chatCot.value = msg.data.cot
							if (msg.code == 100) {
								answerText.value = answerText.value + (msg.data.answer || '')
							} else {
								answerText.value = msg.data.answer
								qureyShow.value = false
								getVoice(msg.data.answer)
							}
						} catch (e) {
							console.warn('JSON 解析失败:', e, jsonStr)
						}
					})
				})
				// #endif
			} else {
				console.log("------tokenRes-------", tokenRes);
				toast(tokenRes.message);
			}
		} catch (e) {
			console.log("------e-------", e);
			toast(e.message);
		}
	};
	/* 手工 UTF-8 解码（带越界保护）*/
	function utf8Decode(ab : ArrayBuffer) : string {
		const view = new DataView(ab)
		let out = ''
		let i = 0
		while (i < view.byteLength) {
			const byte1 = view.getUint8(i++)
			if (byte1 < 0x80) {                                      // 1 字节
				out += String.fromCharCode(byte1)
			} else if (byte1 < 0xE0) {                               // 2 字节
				if (i >= view.byteLength) break                        // 保护
				const byte2 = view.getUint8(i++)
				out += String.fromCharCode(((byte1 & 0x1F) << 6) | (byte2 & 0x3F))
			} else if (byte1 < 0xF0) {                               // 3 字节
				if (i + 1 > view.byteLength) break                     // 保护
				const byte2 = view.getUint8(i++)
				const byte3 = view.getUint8(i++)
				out += String.fromCharCode(((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F))
			} else {                                                 // 4 字节
				if (i + 2 > view.byteLength) break                     // 保护
				const byte2 = view.getUint8(i++)
				const byte3 = view.getUint8(i++)
				const byte4 = view.getUint8(i++)
				const code = (((byte1 & 0x07) << 18) | ((byte2 & 0x3F) << 12) |
					((byte3 & 0x3F) << 6) | (byte4 & 0x3F)) - 0x10000
				out += String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF))
			}
		}
		return out
	}

	/* 把 ArrayBuffer 转成字符串，同时返回「可能剩下的半截字节数」*/
	function safeDecode(ab : ArrayBuffer) : { str : string; remain : number } {
		const view = new DataView(ab)
		let cutPos = view.byteLength
		// 从后往前找第一个非完整 UTF-8 的头
		while (cutPos > 0 && (view.getUint8(cutPos - 1) & 0x80) !== 0) {
			cutPos--
			// 如果找到完整头就停
			const b = view.getUint8(cutPos)
			if ((b & 0xE0) === 0xC0 && view.byteLength - cutPos >= 2) break
			if ((b & 0xF0) === 0xE0 && view.byteLength - cutPos >= 3) break
			if ((b & 0xF8) === 0xF0 && view.byteLength - cutPos >= 4) break
		}
		const slice = view.buffer.slice(0, cutPos)
		return { str: utf8Decode(slice), remain: view.byteLength - cutPos }
	}
	const sseLog = ref('');
	const sseStatus = ref('')
	const sseRunning = ref(false);
	let sseBuffer = ''
	const iosStart = (token, requestTime, query) => {
		sseBuffer = ''
		try {
			const task = request({
				url: aiUrl + '/copilot/v1/openApi/chat',
				method: 'POST',
				responseType: 'text',
				enableChunked: true,
				timeout: 10 * 60 * 1000,
				header: {
					Accept: 'text/event-stream',
					'Content-Type': 'application/json',
					copilotToken: token,
					requestTime: requestTime,
					copilotAk: 'copilot_ak_4qZ84MGWrRoXcMwY',
					assistantId: '118',
				},
				data: {
					type: 'IM_CLICK',
					assistantId: 118,
					query: query,
					sessionId: getUUID(),
					// skillId:skillData.value.skill_id || undefined,
					params: {
						userCode: getToken(), // 用户token
						// 'user_info': formData.value || undefined,
						userLat: uni.getStorageSync('address').lat || '',
						userLon: uni.getStorageSync('address').lng || '',
						useLon: uni.getStorageSync('address').lng || '',
						'member_id': uni.getStorageSync('userInfo').id || '',
						// 'member_id':'131',
						// 'memberType': uni.getStorageSync('userInfo').memberType || '1',
						// mobile:parseTokens(uni.getStorageSync('Token'))?.member_phone,
					},
				},
				success: (res) => {
					// console.log('success', res.statusCode, res.data)
				},
				fail: (err) => {
					console.log('fail', err)
				},
			});
			if (task && typeof task.onHeadersReceived === 'function') {
				task.onHeadersReceived((res) => {
					console.log('-0-0-22111112220-0--', res);
					sseLog.value = `${sseLog.value}[HEADERS] statusCode=${res.statusCode}\n`
					if (res.statusCode === 401) sseStatus.value = 'UNAUTHORIZED (401)'
					else sseStatus.value = `CONNECTED (${res.statusCode})`
				})
			}

			if (task && typeof task.onTextChunkReceived === 'function') {
				task.onTextChunkReceived((res) => {
					const text = res.text || '';
					if (!text) return;
					// 累积到缓冲区
					sseBuffer += text;
					// 处理缓冲区中的完整 SSE 事件
					processSSEBuffer();
				})
			} else if (task && typeof task.onChunkReceived === 'function') {
				task.onChunkReceived((res) => {
					const text = res.text || '';
					if (!text) return;
					// 累积到缓冲区
					sseBuffer += text;
					// 处理缓冲区中的完整 SSE 事件
					processSSEBuffer();
				})
			}
		} catch (err) {
			console.log('-0-00999980', err);
		}
	}
	// ============================================
	// 核心：SSE 缓冲区处理函数
	// ============================================
	/**
	 * 处理 SSE 缓冲区，提取完整的事件块
	 * SSE 格式：data: {...}\n\n 或 data: {...}\n\ndata: {...}\n\n
	 */
	function processSSEBuffer() {
		// SSE 事件以 \n\n 分隔
		let boundaryIndex;

		while ((boundaryIndex = sseBuffer.indexOf('\n\n')) !== -1) {
			// 提取一个完整的 SSE 块
			const chunk = sseBuffer.substring(0, boundaryIndex);
			sseBuffer = sseBuffer.substring(boundaryIndex + 2);

			// 解析并处理这个 SSE 块
			parseAndHandleSSEChunk(chunk);
		}

		// 防止缓冲区无限增长（保留未完整的数据）
		if (sseBuffer.length > 10000) {
			// 如果缓冲区太大，尝试处理最后一行
			const lastNewline = sseBuffer.lastIndexOf('\n');
			if (lastNewline > 0) {
				const chunk = sseBuffer.substring(0, lastNewline);
				sseBuffer = sseBuffer.substring(lastNewline + 1);
				parseAndHandleSSEChunk(chunk);
			}
		}
	}

	/**
	 * 解析单个 SSE 块并更新 UI
	 */
	function parseAndHandleSSEChunk(chunk) {
		// 按行分割，处理多行 data: 的情况
		const lines = chunk.split('\n');
		let dataLines = [];
		let eventType = '';

		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed) continue;

			if (trimmed.startsWith('event:')) {
				eventType = trimmed.substring(6).trim();
			} else if (trimmed.startsWith('data:')) {
				dataLines.push(trimmed.substring(5).trim());
			} else if (trimmed.startsWith('id:')) {
				// 可选：处理 id 字段
			}
		}

		// 合并多行 data（有些 SSE 实现会把一个 JSON 分成多行）
		const dataStr = dataLines.join('\n');

		if (!dataStr || dataStr === '[DONE]') {
			if (dataStr === '[DONE]') {
				finishCore(); // 流结束
			}
			return;
		}

		// 解析 JSON
		try {
			const parsed = JSON.parse(dataStr);
			handleParsedMessage(parsed);
		} catch (e) {
			console.warn('JSON 解析失败，可能是未完成的数据:', dataStr.substring(0, 100));
			// 如果是未完成的 JSON，可能还需要更多数据，这里不处理
		}
	}

	/**
	 * 处理解析后的消息，更新聊天界面
	 */
	function handleParsedMessage(msg) {
		console.log('收到消息:', msg);

		// 检查消息结构
		if (!msg || !msg.data) return;

		const { code, data, message } = msg;

		// 提取文本内容（优先使用 llm_result 流式片段，其次是 answer 完整答案）
		let textFragment = '';

		if (data.llm_result) {
			// 流式片段（逐字返回）
			textFragment = data.llm_result;
		} else if (data.answer && code == 200) {
			// 最终完整答案
			textFragment = data.answer;
		}
		chatCot.value = data.cot
		if (code == 100) {
			answerText.value = answerText.value + (data.answer || '')
		} else {
			answerText.value = data.answer
			qureyShow.value = false
		}
		// 更新消息到聊天列表
		if (textFragment || data.answer || data.queryId) {
			// chatStore.setServiceQueryMessage({
			//     type: 'text',
			//     id: messageId.value,
			//     queryId: data.queryId,
			//     sessionId: data.sessionId || '',
			//     code: code,
			//     cot: data.cot,
			//     msgText: data.answer || '',      // 完整答案
			//     answer: data.answer || '',
			//     aiData: data.data || null,
			//     isLoading: code !== 200,          // 200 表示完成
			//     // 流式更新：追加文本
			//     streamText: textFragment          
			// });

			// 滚动到底部

		}

		// 处理完成状态
		if (code == 200) {
			console.log('-0-0-00结束结束结束结束00-0-0-', code);
			// 最终完成，触发语音播报

			// finishCore();
		}
	}
	const start = (token, requestTime, query) => {
		chatSSEClientRef.value.startChat({
			/**
			 * 将它换成你的地址
			 * 注意：
			 * 如果使用 sse-server.js 要在手机端使用的话，请确保你的手机和电脑处在一个局域网下并且是正常的ip地址
			 */
			url: aiUrl + '/copilot/v1/openApi/chat',
			// 请求头
			headers: {
				// 'content-type': 'application/json',   
				copilotToken: token,
				// 'copilot-token': token,
				requestTime: requestTime,
				copilotAk: 'copilot_ak_4qZ84MGWrRoXcMwY',
				assistantId: '118',
			},
			// 默认为 post
			method: 'post',
			body: {
				type: 'IM_CLICK',
				assistantId: 118,
				query: query,
				sessionId: getUUID(),
				// skillId: skillData.value.skill_id || undefined,
				params: {
					userCode: getToken(), // 用户token
					// 'user_info': formData.value || undefined,
					userLat: uni.getStorageSync('address').lat || '',
					userLon: uni.getStorageSync('address').lng || '',
					useLon: uni.getStorageSync('address').lng || '',
					'member_id': uni.getStorageSync('userInfo').id || '',
					'memberType': uni.getStorageSync('userInfo').memberType || '1',
					// mobile: parseToken(uni.getStorageSync('Token'))?.member_phone,
					// etcCarId: etcData.value.cardId || undefined,
					// plateNum: plateNum.value || undefined
				},
			},
			onMessage: messageCore,      // ← 必须显式传入
			onError: errorCore,
			onOpen: openCore,
			onFinish: finishCore
		});
	};
	const openCore = (response) => {
		console.log("open sse：", response);
	};
	const errorCore = (err) => {
		console.log("error sse：", err);
	};
	const messageCore = (msg) => {

		const data = JSON.parse(msg.data)
		console.log('返回数据：', data);
		// chatStore.setServiceQueryMessage({
		// 	type: 'text',
		// 	id: messageId.value,
		// 	queryId: data.data.queryId,
		// 	sessionId: data.data.sessionId || '',
		// 	code: data.code,
		// 	cot: data.data.cot,
		// 	msgText: data.data.answer ? data.data.answer : '',
		// 	answer: data.data.answer ? data.data.answer : '',
		// 	aiData: data.data.data || null
		// })

		if (data.code == 200) {
			// etcData.value = {};
			// plateNum.value = ''
			// getVoice(data.data.answer,true)
		}
	};
	const audioRef = ref(null);
	const handleEnded = () => {
		bobaoShow.value = false;
	  // uni.showToast({ title: '播报完毕', icon: 'none' });
	};
	const getVoice = async (text) => {
		uni.showLoading({ title: '合成中' })
		try {
			let res = await textCensor({
				lan:'zh',
				ctp:1,
				tex:fixQuotes(text),
				cuid:getUUID(),
				per:6561,
			})
			if(res.code == 200){
				// bobaoShow.value = true;
				audioSrc.value = res.data.url
				voicePlay(res.data.url)
			}
		} catch (e) {
			console.log('222332232',e);
			uni.showToast({ title: e.message || '合成失败', icon: 'none' })
		}
		uni.hideLoading()
	}
	let audioVoice = null
	const bobaoShow = ref(false);
	const audioSrc = ref('');
	const voicePlay = async (audioSrc)=>{
		audioRef.value.play(audioSrc)
		bobaoShow.value = true
		// if(audioSrc){
		// 	audioVoice.src = audioSrc
		// 	bobaoShow.value = true;
		// 	audioVoice.play()
		// }else{
		// 	getVoice(answerText.value)
		// }
		
	}
	// 停止播放
	const voiceStop = () => {
		audioRef.value.stop()
		// isBobaoShow.value = false;
		// audioVoice.stop()
		// // #ifdef MP-WEIXIN
		// 	// audioVoice.src = '';
		// // #endif
		bobaoShow.value = false;
	}
	// 音频初始化
	const audioInit = ()=>{
		audioVoice = uni.createInnerAudioContext() 
		// 音频停止事件
		audioVoice.onPause(event=>{
			console.log('---------------onPause-------------------', event);
			voiceStop()
		})
		// 音频停止事件
		audioVoice.onStop(event=>{
			console.log('---------------onStop-------------------', event);
			voiceStop()
		})
		// 音频自然播放结束事件
		audioVoice.onEnded(event=>{
			console.log('---------------onEnded-------------------', event);
			voiceStop()
		})
		audioVoice.onError(event=>{
			console.log('---------------onError-------------------', event);
			// voiceStop()
		})
	}
	const finishCore = () => {
		console.log("finish sse");
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
	onUnmounted(()=>{
		// 页面卸载，销毁数据
		audioVoice.destroy()
	})
	onUnload(() => {
		if (inter) clearInterval(inter);
	});
</script>

<style scoped lang="scss">
	.bbView{
		flex: 1;
		display: flex;
		justify-content: flex-end;
		.bbView-Box{
			width: 210rpx;
			position: relative;
		}
		.bbView-Box-bg{
			width: 210rpx;
			height: 82rpx;
		}
		.bbView-Box-view{
			position: absolute;
			top: 0;
			left: 0;
			width: 210rpx;
			height: 82rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.bbView-Box-view-img{
				width: 30rpx;
				height: 30rpx;
			}
			.bbView-Box-view-text{
				font-size: 24rpx;
				margin-left: 10rpx;
			}
		}
	}
	.textAi {
		font-size: 26rpx;
		padding: 20rpx 0;
		color: #666666;
	}
	.lxBottomTetx {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-bottom: 20rpx;

		.lxBottomTetx-text {
			font-size: 24rpx;

		}
	}

	.monkey_box_count_bottom {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		padding-bottom: 20rpx;

		// margin-top:20rpx;
		.monkey_box_count_bottom_item {
			font-size: 24rpx;
			margin-right: 30rpx;
		}
	}

	.swiper_dot {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0;
		margin-top: 12rpx;

		.swiper_dot_item {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			background: #D8D8D8;
			margin-right: 12rpx;
		}

		.swiper_dot_active {
			width: 32rpx;
			height: 12rpx;
			border-radius: 27rpx;
			background: #628F2F;
			margin-right: 12rpx;
		}
	}
	.star-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(193,141,0,0.5);
		padding: 6rpx 0;
		align-items: center;
		border-bottom-left-radius: 12rpx;
		border-bottom-right-radius: 12rpx;
	}
	
	.star-text {
		color: #ffffff;
		font-size: 20rpx;
	}
	.service-card {
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 24rpx;
		margin: 0 20rpx;
		margin-top: 0rpx;
		padding-bottom: 32rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
		position: relative;
		.watermark {
			position: absolute;
			right: 0rpx;
			top: 150rpx;
			width: 96rpx;
			height: 96rpx;
			z-index: 1;
			// transform: rotate(-15deg);
			// opacity: 0.6;
		}
		.header-section {
			display: flex;

			.image-wrapper {
				position: relative;
				width: 190rpx;
				height: 190rpx;

				.status-badge {
					position: absolute;
					top: 0;
					left: 0;
					background-color: #52c41a;
					color: #ffffff;
					font-size: 22rpx;
					padding: 4rpx 16rpx;
					border-radius: 16rpx 0 16rpx 0;
					z-index: 1;
				}
			}

			.info-content {
				flex: 1;
				width: 0;
				margin-left: 24rpx;
				.direction {
					font-size: 26rpx;
					color: #666;
					margin-left: 16rpx;
				}
				.title-row {
					width: 100%;
					display: flex;
					// justify-content: space-between;
					align-items: center;
					margin-bottom: 8rpx;

					.title {
						// width: 100%;
						font-size: 36rpx;
						font-weight: bold;
						color: #333;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.distance {
						font-size: 26rpx;
						color: #999;
					}
				}

				.address {
					width: 100%;
					font-size: 26rpx;
					color: #666;
					line-height: 1.4;
					display: block;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}

				.tag-group {
					display: flex;
					flex-wrap: wrap;
					gap: 12rpx;

					.tag-item {
						display: flex;
						align-items: center;
						// background-color: #f0f9f1;
						padding: 6rpx 16rpx;
						border-radius: 40rpx;

						text {
							font-size: 24rpx;
							// color: #52a55d;
							margin-left: 4rpx;
						}
					}
				}
			}
		}

		.bottom-section {
			// display: flex;
			// justify-content: space-between;
			// align-items: flex-start;
			// margin-top: 30rpx;

			.promo-box {
				width: 100%;
				display: flex;
				flex: 1;
				margin-top: 20rpx;
				padding-right: 20rpx;

				.promo-title {
					font-size: 24rpx !important;
					color: #333333;
					font-weight: 500;
				}

				.promo-text {
					width: 80%;
					font-size: 24rpx !important;
					color: #333333;
					// line-height: 1.6;
					font-weight: 500;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					/* 限制显示为3行 */
					overflow: hidden;
				}
			}

			.action-cards {
				gap: 16rpx;

				.cardd {
					width: 600rpx;
					padding: 20rpx;
					border-radius: 16rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					margin-top: 20rpx;

					.iconK {
						color: #47DFDA;
						background-color: #EAFFFF;
						border: 2rpx solid #47DFDA;

						&-text {
							color: #fff;
							background-color: #47DFDA;
						}
					}

					.card-icon-item {
						width: 130rpx;
						height: 38rpx;
						border-radius: 8rpx 8rpx 8rpx 8rpx;
						border: 2rpx solid none;
						display: flex;
						flex-direction: row;
						font-size: 24rpx;

						.card-icon-item-text {
							width: 40rpx;
							height: 36rpx;
							line-height: 36rpx;
							text-align: center;
							font-size: 24rpx;
							color: #FFFFFF;
							border-radius: 8rpx;
							font-weight: 700;
						}

						.card-icon-item-num {
							width: 76rpx;
							line-height: 36rpx;
							text-align: center;
							font-weight: 400;
							color: #47DFDA;
							font-size: 24rpx;
						}
					}
				}

				.card-label {
					font-size: 24rpx;
					color: #666;
					margin-right: 15rpx;
				}

				.price-row {
					display: flex;
					align-items: baseline;
					margin-bottom: 10rpx;

					.price {
						font-size: 40rpx;
						font-weight: bold;
						color: #333;
					}

					.unit,
					.total {
						font-size: 22rpx;
						color: #666;
						margin-left: 4rpx;
					}
				}

				.car2d {
					width: 200rpx;
					padding: 20rpx;
					border-radius: 16rpx;
					display: flex;
					flex-direction: column;
				}

				.card-btn {
					font-size: 24rpx;
					display: flex;
					align-items: center;
					font-weight: bold;
				}

				.gas-card {
					background-color: #FFF4EF;
				}

				.charge-card {
					background-color: #EAF1FF;
				}

				.orange-text {
					color: #FF5405;
				}

				.blue-text {
					color: #4881F5;
				}
			}
		}
	}

	.iconText {
		font-size: 24rpx;
		color: #999999;
	}

	.szrBox {
		padding: 10rpx 30rpx 20rpx 30rpx;

		.szrBox-text {
			font-size: 28rpx;
			line-height: 40rpx;
			color: #333333;
		}

		.szrBox-text2 {
			flex: 1;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #333333;
			lines: 1;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}

		.szrBox-but {
			text-align: center;
			font-size: 24rpx;
		}
	}

	.szrBox-A {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.iconText {
		font-size: 24rpx;
		color: #999999;
	}

	.szrBox {
		padding: 10rpx 30rpx 20rpx 30rpx;

		.querBoxTitle {
			flex: 1;
			height: 44rpx;
			display: flex;
			align-items: center;

			.querBoxTitle-text {
				flex: 1;
				padding-left: 20rpx;
				height: 28rpx;
				line-height: 28rpx;
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
				text-align: left;
			}
		}

		.szrBox-text {
			font-size: 28rpx;
			line-height: 40rpx;
			color: #333333;
		}

		.szrBox-text2 {
			flex: 1;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #333333;
			lines: 1;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}

		.szrBox-but {
			text-align: center;
			font-size: 24rpx;
		}
	}

	.szrBox-A {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

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
	}

	/* 导航栏 */
	.nav-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		background-image: var(--success-color);
	}

	.weather_box {
		display: flex;
		flex-direction: row;
		align-items: center;

		.weather_box_icon {
			margin-left: 10rpx;
			width: 80rpx;
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
			border-radius: 8rpx;
			background: #FFFFFF;
			box-sizing: border-box;
			border: 1px solid #FD4848;
			font-size: 20rpx;
			font-weight: 500;
			color: #FD4848;
		}

		.weather-icon {
			height: 48rpx;
			margin-right: 4rpx;
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
			color: var(--primary-color);
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
		margin-top: -6rpx;

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
			color: var(--primary-color);
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
		// top: -40rpx;
		z-index: 5;
		.maQp{
			width: 310rpx;
			height: 121rpx;
			position: absolute;
			z-index: 3;
			top: 0;
			left: 130rpx;
			
			.maQp-View{
				width: 310rpx;
				height: 121rpx;
				position: relative;
				.maQp-bg{
					top: 0;
					left: 0;
					position: absolute;
					width: 310rpx;
					height: 121rpx;
					border-radius: 0rpx 0rpx 0rpx 0rpx;
				}
				.maQp-View-center{
					width: 310rpx;
					height: 121rpx;
					top: 0;
					left: 0;
					position: absolute;
					display: flex;
					flex-direction: row;
					align-items: center;
					padding-left: 50rpx;
					.maQp-View-icon{
						width: 40rpx;
						height: 40rpx;
					}
					.maQp-View-text{
						font-weight: 400;
						font-size: 22rpx;
						margin-left: 10rpx;
					}
				}
			}
		}
		.monkey_box_bg {
			width: 702rpx;
			height: 216rpx;
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
			height: 200rpx;
			position: absolute;
			bottom: 8rpx;
			right: 24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 10rpx 0;
			box-sizing: border-box;
			z-index: 10;

			.monkey_box_count_tips {
				font-weight: 400;
				font-size: 24rpx;
				color: var(--secondary-color);
				margin-bottom: 10rpx;
				margin-right: 50%;
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
		// margin-top: -20rpx;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.card {
		width: 702rpx;
		border-radius: 32rpx;
		display: flex;
		flex-direction: column;
		background-image: var(--linear-color);
		box-shadow: 0rpx 2rpx 8rpx 0rpx var(--label-color);
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
		// width: 480rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-bottom: 16rpx;

		.arrow-img {
			width: 100rpx;
			height: 20rpx;
			margin-left: 10rpx;
			margin-right: 10rpx;
		}

		.route-item {
			width: 180rpx;
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
				width: 160rpx;
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
				width: 180rpx;
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
			border: 2rpx solid var(--primary-color);
			display: flex;
			align-items: center;
			justify-content: center;

			.router_go_btn_text {
				font-weight: 500;
				font-size: 28rpx;
				color: var(--primary-color);
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
				color: var(--primary-color);
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
			background-image: var(--head-color);
			border-radius: 16rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding-left: 20rpx;
			padding-right: 28rpx;
			margin-bottom: 29rpx;
			border-bottom: 3rpx solid var(--secondary-color);

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

	// 收礼物

	.exp-popup1 {
		width: 690rpx;
		height: 880rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.lw-vox {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			z-index: 1;
			margin-top: 310rpx;

			.lw-vox-text-1 {
				font-weight: 700;
				font-size: 30rpx;
				color: #A1591F;
				line-height: 41rpx;
			}

			.lw-avi {
				width: 200rpx;
				height: 200rpx;
				border-radius: 0rpx 0rpx 0rpx 0rpx;
				margin-top: 30rpx;
				margin-bottom: 30rpx;
			}

			.lw-vox-text-2 {
				font-weight: 400;
				font-size: 24rpx;
				color: #4D2402;
				line-height: 33rpx;
			}
		}

		.order-close-wrap1 {
			width: 100%;
			position: absolute;
			bottom: -52rpx;
			display: flex;
			justify-content: center;

			.orderBox-close1 {
				width: 51rpx;
				height: 51rpx;
				margin-top: 32rpx;
				margin-left: 25rpxs;
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
		// margin-right: 20rpx;
	}

	.qhImg {
		width: 32rpx;
		height: 32rpx;
		// margin-left: 20rpx;
	}

	.card_sm_head_text {
		font-family: DingTalk, DingTalk;
		font-weight: normal;
		font-size: 32rpx;
		color: var(--primary-color);
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
		background: var(--head-color);
		box-shadow: 0rpx 2rpx 8rpx 0rpx var(--label-color);
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
		background: var(--head-color);
	}

	.hc-card {
		width: 654rpx;
		height: 232rpx;
		background: var(--head-color);
		box-shadow: 0rpx 2rpx 8rpx 0rpx var(--label-color);
		border-radius: 16rpx;
		padding: 38rpx 24rpx 32rpx;
		box-sizing: border-box;
		margin: 0 24rpx 32rpx;
	}

	.city-name {
		width: 110rpx;
		font-weight: 500;
		font-size: 36rpx;
		color: var(--primary-color);
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
		border: 2rpx solid var(--primary-color);
		font-weight: 500;
		font-size: 28rpx;
		color: var(--primary-color);
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

	.tq_tag {
		flex: 1 0;
		display: flex;
		flex-direction: row;

		.tq_tag_text {
			height: 40rpx;
			border-radius: 8rpx;
			border: 2rpx solid #FD4848;
			line-height: 36rpx;
			padding-left: 10rpx;
			padding-right: 10rpx;
			font-size: 20rpx;
			font-weight: 500;
			color: #FD4848;
			margin-left: 24rpx;
		}
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

	.rout_box {
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

		.rout_title {
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 20rpx;

			.rout_img {
				width: 34rpx;
				height: 34rpx;
				margin-right: 10rpx;
			}

			.rout_text {
				font-weight: 500;
				font-size: 24rpx;
				color: #333333;
			}
		}

		.rout_count {
			width: 100%;
			background: #FFFFFF;
			border-radius: 12rpx;
			padding-top: 12rpx;
			padding-bottom: 12rpx;
			padding-left: 17rpx;
			padding-right: 17rpx;
			box-sizing: border-box;

			.rout_count_txt {
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
		margin-bottom: 18rpx;

		/* 胶囊按钮 */
		.tl-badge {
			height: 40rpx;
			padding-left: 8rpx;
			padding-right: 8rpx;
			border-radius: 8rpx;
			font-size: 20rpx;
			border: 2rpx solid;
			line-height: 40rpx;
			margin-right: 20rpx;
			background-color: #ffffff;
		}
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