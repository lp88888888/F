<template>
	<view class="container" :data-theme="pageTheme">
		<up-sticky>
			<up-navbar title="服务超市" bgColor="transparent" @leftClick="toBack" placeholder :fixed="true"></up-navbar>

		</up-sticky>
		<view class="card">
			<view class="card-icon-card-header">
				<view class="card-icon-card-header_lt">
					<image class="card-icon-card-header-img" :src="icoUrl + 'icon_bg.png'"></image>
					<text class="title-text-primary">首页常用</text>
					<image class="card-title-icon" :src="imgUrl + 'static/card_lt_icon.png'"></image>
				</view>
				<view class="card-header-actions">
					<!-- 编辑模式：显示“确认” -->
					<text v-if="editMode" class="action-btn confirm-btn" @click.stop="savemut()">
						确认
					</text>

					<!-- 正常模式：显示“管理” -->
					<text v-else class="action-btn manage-btn" @click.stop="toggleEditMode">
						管理
					</text>
				</view>
			</view>
			<view class="card-item">
				<view class="grid-box">
					<view class="grid-box-item" style="width: 140rpx" v-for="(item, index) in homeCommon"
						:key="index" @click="handleItemClick(index, item)" @longpress="startDrag(index)">
						<view v-if="editMode&&item.fixed!=1" class="delete-badge" @click.stop="removeItem(index)">
							×
						</view>
						<image class="grid-box-img" :src="item.iconUrl"></image>
						<text class="grid-box-text">{{ item.entryName }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="service-page">
			<!-- 左侧导航 -->
			<scroll-view class="sidebar" scroll-y>
				<view v-for="(group, index) in others" :key="index" class="menu-item"
					:class="{ active: currentIndex === index }" @click="currentIndex = index">
					{{ group.name }}
				</view>
			</scroll-view>

			<!-- 右侧内容区 -->
			<scroll-view class="content" scroll-y>
				<view class="grid">
					<view v-for="(item, i) in others[currentIndex]?.data" :key="i" class="card1" @tap="tabsClick(item)">
						<view v-if="editMode" class="delete-badge1" @click.stop="addToHomeCommon(i)">
							+
						</view>
						<image class="grid-box-img" :src="item.iconUrl"></image>
						<text class="label">{{ item.entryName }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<SateLayer ref="sateLayerRef"></SateLayer>
	</view>
</template>

<script setup lang="ts">
	import theme from '@/utils/theme'
	import SateLayer from '@/components/SateLayer/index.vue';
	import { ref, computed, onMounted } from 'vue';
	import { random, guid, timeFormat } from '@/uni_modules/uview-plus';
	import { getclassify, getgridMenuhome,putgridMenu } from '@/api/points.ts';
	import { useCommonStore } from '@/store/modules/common';
	import { imgUrl } from '@/config';
	import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app';
	import { toNav, toBack } from '@/utils/route';
	import { useAppStore } from '@/store/modules/app';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	const sateLayerRef = ref(null);
	const icoUrl = computed(() => {
		return themeStore.imgUrl
	})
	const appStore = useAppStore();
	const toggleEditMode = () => {
		editMode.value = true
	}
	const confirmEdit = () => {
		// TODO: 可在此处调用 API 保存排序/删除结果
		// saveHomeCommonConfig(homeCommon.value[0].data)

		editMode.value = false
	}
	const dragIndex=ref(null)
	const removeItem = (index) => {
	 if (!homeCommon.value || !Array.isArray(homeCommon.value)) return;
	
	  if (homeCommon.value.length <= 4) {
	    uni.showToast({
	      title: '首页常用至少保留4项',
	      icon: 'none',
	      duration: 1500
	    });
	    return;
	  }
	
	  // 检查索引是否合法
	  if (index < 0 || index >= homeCommon.value.length) return;
	
	  // 执行删除
	  homeCommon.value.splice(index, 1);
	}
	const editMode = ref(false)
	const gethome = async () => {
		let params={
			secondaryIconPath: pageTheme.value,
		}
		const res = await getgridMenuhome(params)
		if(res.code==200){
			homeCommon.value=res.rows.filter(item => (item.businessType == '0' &&item.entryName !== '更多服务'));
		}
	}
	const savemut =async () => {
		let params={
			gridMenu:homeCommon.value
		}
		 const data = homeCommon.value.map((item, index) => ({
		    gridMenuId: item.id,       
		    priority: index         
		  }));
		const res = await putgridMenu(data)
		if(res.code==200){
			uni.showToast({
				title: '保存成功',
				icon: 'none',
				duration: 1500
			})
			editMode.value = false
		}
	}
	
	const addToHomeCommon = (index) => {
		// 1. 获取当前页签的数据
		// 6. （可选）限制最大数量，例如最多 8 个
		if (homeCommon.value.length >= 14) {
		  uni.showToast({ title: '首页常用最多14个', icon: 'none' });
		  // homeCommon.value.pop(); // 移除刚加的
		  return;
		}
		const currentTabData = others.value[currentIndex.value]?.data;
		if (!currentTabData || index < 0 || index >= currentTabData.length) return;

		// 2. 取出要移动的项
		const itemToMove = { ...currentTabData[index] }; // 深拷贝防引用问题

		 // 确保有 id（防止无效数据）
		  if (itemToMove.id == null) {
		    console.warn('Item missing id, cannot add to homeCommon');
		    return;
		  }
		
		  // 3. 初始化 homeCommon 结构（如果不存在）
		  if (!homeCommon.value) {
		    homeCommon.value = [];
		  }
		
		  // 4. 【关键】去重：检查是否已存在相同 id
		  const isExist = homeCommon.value.some(item => item.id === itemToMove.id);
		  if (isExist) {
		    uni.showToast({ title: '已在首页常用', icon: 'none', duration: 1000 });
		    return;
		  }
		
		
		 
		homeCommon.value.push(itemToMove);
	};
	// 长按开始拖拽
	const startDrag = (index) => {
		if (!editMode.value) return
		dragIndex.value = index
		uni.showToast({ title: '点击目标位置交换', icon: 'none', duration: 1500 })
	}

	// 点击项（处理拖拽交换 or 正常跳转）
	const handleItemClick = (index, item) => {
		if (!editMode.value) {
			tabsClick(item)
			return
		}

		// 编辑模式下：
		if (dragIndex.value === null) {
			// 未拖拽：可长按启动拖拽（已由 longpress 处理）
			return
		}

		if (dragIndex.value === index) {
			// 点击自己：取消拖拽
			dragIndex.value = null
			return
		}
		const dragIndex = ref(null) // 当前正在拖拽的索引
		// 交换位置
		const list = homeCommon.value
		const temp = list[dragIndex.value]
		list[dragIndex.value] = list[index]
		list[index] = temp

		// 重置拖拽状态
		dragIndex.value = null
	}
	const tabsClick = (item) => {
		if (editMode.value) {
			return;
		}
		console.log("首页金刚区点击", item)
		if (item.entryName == '更多服务') {
			return;
		}
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
	// 所有服务数据 —— 统一管理，支持动态扩展


	// 默认选中第一项
	const currentIndex = ref(0)

	// 点击处理
	const handleClick = (item : any) => {
		console.log('点击了:', item.label)
		// uni.navigateTo({ url: `/pages/xxx?name=${item.label}` })
	}

	onLoad(() => {

	});
	onShow(() => {
		getlist()
		gethome()
	})
	const homeCommonCategories = [
		
	];
	const homeCommon = ref([]); // 首页常用
	const others = ref([]);
	const getlist = async () => {
		others.value = []

		let params = {
			secondaryIconPath: pageTheme.value,
		};
		const res = await getclassify(params);
		Object.keys(res.data).forEach(key => {
			const items = res.data[key]
				.filter(item =>
					item.businessType == '0' &&
					item.entryName !== '更多服务'  // ← 排除 entryName 为“更多服务”的项
				) // 获取该分类的数据数组
			// 对 items 按 priority 升序排序（从小到大）
			items.sort((a, b) => a.priority - b.priority);
			if (homeCommonCategories.includes(key)) {
				
			} else {
				others.value.push({
					name: key,
					data: items
				});
			}
		});
		console.log(others.value, homeCommon.value, 'ssssssssssssss')
	};
</script>

<style lang="scss" scoped>
	
	.delete-badge {
		position: absolute;
		top: 0rpx;
		right: 22rpx;
		width: 32rpx;
		height: 32rpx;
		background-color: #ff4d4f;
		border-radius: 50%;
		color: white;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		line-height: 1;
	}
	.delete-badge1 {
		position: absolute;
		top: 0rpx;
		right: 22rpx;
		width: 32rpx;
		height: 32rpx;
		background-color: var(--primary-color);
		border-radius: 50%;
		color: white;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		line-height: 1;
	}

	.manage-btn {
		display: inline-block;
		color: #666;
		margin-top: 24rpx;
		margin-right: 32rpx;
	}

	.confirm-btn {
		display: inline-block;
		margin-top: 24rpx;
		margin-right: 32rpx;
		color: var(--primary-color);
		/* 蓝色确认按钮 */
	}

	.container {
		background: var(--head-color);
		min-height: 100vh;
		overflow: hidden;

	}

	.service-page {
		display: flex;
		height: 65vh;
		background-color: #fff;
	}

	.sidebar {
		width: 210rpx;
		background-color: #F6F6F6;
	}

	.menu-item {
		width: 210rpx;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		;
		padding: 30rpx 20rpx;
		text-align: center;
		font-size: 28rpx;
		color: #555;
		transition: all 0.2s;

	}

	.menu-item.active {
		background-color: #fff;
		color: var(--primary-color);
		font-weight: bold;
	}

	.content {
		flex: 1;
		padding: 30rpx 20rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 500;
		margin-bottom: 30rpx;
		color: #333;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24rpx;
	}

	.card1 {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 16rpx;
		text-align: center;
		transition: transform 0.2s;
		position: relative;
	}

	.card1:active {
		transform: scale(0.96);
	}

	/* 图标图片样式 */
	.icon-img {
		width: 48rpx;
		height: 48rpx;
		margin-bottom: 12rpx;
	}

	.label {
		font-size: 24rpx;
		color: #555;
		margin-top: 8rpx;
		line-height: 1.4;
		max-width: 140rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.card {
		width: 702rpx;
		margin: 32rpx 24rpx;
		border-radius: 32rpx;
		display: flex;
		flex-direction: column;
		background-image: var(--linear-color);
		box-shadow: 0rpx 2rpx 8rpx 0rpx var(--label-color);
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

	.grid-box-img {
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 10rpx;
	}

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
			position: relative;
		}
	}

	.grid-box-text {
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
	}
</style>