<!-- 个人信息 -->
<template>
	<view class="personal-box" :data-theme="pageTheme">
		<!-- <cos-header title='个人信息' :background-color="backgroundColor" :font-color="fontColor" :fixed="fixed"
			:defaultNavBarheight="100"></cos-header> -->
		<u-sticky bgColor="transparent" z-index="99999">
			<view class="searchView">
				<up-navbar title="个人信息" bgColor="transparent" @leftClick="toBack" :titleStyle="{fontWeight: 'bold'}"
					placeholder :fixed="true"></up-navbar>
			</view>
		</u-sticky>
		<!-- <up-navbar title="个人信息" @leftClick="toBack" placeholder :fixed="true" :titleStyle="{fontWeight: 'bold'}"></up-navbar> -->
		<view :style="{ paddingTop: 0 + 'px'}">
			<up-cell-group>
				<!-- #ifdef APP -->
				<!-- <up-cell title="头像" value="0" @click="selectActive">
					<template #value>
						<view class="flex ali-cen" >
							<image class="activeImg" :src="avatarUrl"  />
							<up-icon name="arrow-right" color="#999999"></up-icon>
						</view>
					</template>
				</up-cell> -->
				<view class="avatar flex just-sb ali-cen" @click="selectActive" style="padding: 0 20rpx;">
					<view class="ava-label fs-28 col6">头像</view>
					<view class="flex ali-cen">
						<image class="img" :src="avatarUrl" />
						<up-icon name="arrow-right" color="#999999"></up-icon>
					</view>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<button class="avatar flex just-sb ali-cen" open-type="chooseAvatar" @chooseavatar="chooseAvatar">
					<view class="ava-label fs-28 col6">头像</view>
					<view class="flex ali-cen">
						<image class="img" :src="avatarUrl" />
						<up-icon name="arrow-right" color="#999999"></up-icon>
					</view>
				</button>
				<!-- #endif -->

				<view style="height: 10rpx;"></view>
				<up-cell title="昵称" value="新版本" :isLink="true">
					<template #value>
						<input class="cell-h" style="text-align: right;" @input="getNickname" @blur="saveName"
							type="nickname" v-model="nickName" placeholder="请输入昵称" />
					</template>
				</up-cell>
				<up-cell title="性别" value="新版本" :isLink="true" @click="sexopneFun">
					<template #value>
						<view class="cell-h">
							<view class="default" v-if="sex">选择性别</view>
							<view class="choice" v-else>{{sextext}}</view>
						</view>
					</template>
				</up-cell>
				<up-cell title="生日" value="新版本" :isLink="true" @click="birthday ? null : timeshow=true">
					<template #value>
						<view class="cell-h">
							<view class="default">{{ birthday ? birthday : '去完善' }}</view>
						</view>
					</template>
				</up-cell>
				<up-cell title="手机号码" value="新版本" :isLink="true">
					<template #value>
						<view class="cell-h">{{ formatPhone }}</view>
					</template>
				</up-cell>
				<!-- #ifndef APP-HARMONY -->
				<up-cell title="微信" value="新版本" :isLink="true">
					<template #value>
						<view class="cell-h">1.0.0</view>
					</template>
				</up-cell>
				<!-- #endif -->
			</up-cell-group>
		</view>
		<!-- 性别选择 -->
		<up-picker :show="show" :columns="columns" @cancel='show=false' @confirm='sexdefineFun' keyName="label"
			valueName="value">
		</up-picker>
		<up-datetime-picker hasInput :show="timeshow" v-model="birthday" :minDate="31536000000" mode="date"
			@cancel='timeshow=false' :defaultValue="birthday ? new Date(birthday) : new Date()"
			@confirm='bindDateChange'>
		</up-datetime-picker>
	</view>
</template>
<script setup lang="ts">
	import moment from "moment";
	import {
		imgUrl,
	} from '../../config';
	import {
		onLoad,
		onBackPress
	} from "@dcloudio/uni-app";
	import {
		ref,
		reactive,
		onMounted
	} from 'vue';
	import {
		updateMember
	} from '@/api/user';
	import {
		getMiniUserInfo
	} from '@/api/login';
	import uploadFile from '@/utils/upload'
	import {
		formatPhoneNumWithMask,
		toast
	} from '@/utils/common';
	import {
		useAppStore
	} from '@/store/modules/app';
	import {
		useTheme
	} from '@/composables/useTheme';
	const {
		themeStore,
		pageTheme
	} = useTheme();
	import { toNav, toBack } from '@/utils/route';
	import CosHeader from '@/components/customNavBar/index.vue';
	const backgroundColor = ref<string>("#FFFFFF");
	const fontColor = ref<string>('#000');
	const fixed = ref<boolean>(true);
	const navBarHeight = ref(0);
	onMounted(() => {
		// 从cos-header组件获取实际高度或计算
		const sysInfo = uni.getSystemInfoSync();
		navBarHeight.value = sysInfo.statusBarHeight + 44; // 44是默认导航栏高度
	});
	const appStore = useAppStore();
	//性别	
	const sex = ref(true)
	const sextext = ref('')
	const show = ref(false)
	const columns = ref([
		[{
			value: 'male',
			label: '男'
		},
		{
			value: 'female',
			label: '女'
		}
		]
	]);

	const avatarUrl = ref<string>(uni.getStorageSync('userInfo')?.headImageUrl || '');
	const nickName = ref(uni.getStorageSync('userInfo')?.nickName || '');
	const userInfo = ref(uni.getStorageSync('userInfo') || {});
	const formatPhone = ref(uni.getStorageSync('userInfo')?.mobile || '');
	const birthday = ref(uni.getStorageSync('userInfo')?.birthday || '');
	const chooseAvatar = async (e) => {
		console.log('头像', e.detail.avatarUrl);
		try {
			uni.showLoading({
				title: '上传中...'
			});
			const uploadRes = await uploadFile<{
				readUrl : string
			}>({
				url: '/file/upload',
				filePath: e.detail.avatarUrl, // 使用微信返回的头像路径
			});
			console.log('上传结果', uploadRes.data.url);
			await updateMember({
				headImageUrl: uploadRes.data.url,
			});

			avatarUrl.value = uploadRes.data.url;
		} catch (err) {
			uni.showToast({
				title: '上传失败',
				icon: 'none'
			});
		} finally {
			uni.hideLoading();
		}
	};

	// 修改昵称
	const saveName = async () => {
		const res = await updateMember({
			nickName: nickName.value
		});
		if (res.code == 200) {
			if (res.clazz) {
				userInfo.value = res.clazz
				appStore.updateUserInfo(res.clazz);
			} else {
				userInfo.value.nickName = nickName.value
				appStore.updateUserInfo(userInfo.value);
			}
		} else {
			totas(res.msg)
		}

	}
	// 获取昵称
	const getNickname = (e) => {
		nickName.value = e.detail.value
		console.log(nickName.value, 111111111)
	}
	const sexopneFun = () => {
		show.value = true
	}
	// 修改性别
	const sexdefineFun = async (e) => {
		sextext.value = e.value[0].label
		sex.value = false
		show.value = false;
		const res = await updateMember({
			sex: e.value[0].label == '男' ? '1' : '2'
		});
		if (res.code == 200) {
			if (res.clazz) {
				userInfo.value = res.clazz
				appStore.updateUserInfo(res.clazz);
			} else {
				userInfo.value.sex = e.value[0].label == '男' ? '1' : '2'
				appStore.updateUserInfo(userInfo.value);
			}
		} else {
			toast(res.msg)
		}
	};
	//生日
	const timeshow = ref(false)
	const timeishow = ref(true)

	// 选择生日
	const bindDateChange = (e) => {
		if (e.value == null) {
			e.value = 31536000000
		}
		uni.showModal({
			title: '提示',
			content: '生日信息维护后不可修改，确定保存?',
			cancelText: '取消',
			confirmText: '确定',
			success: async (res) => {
				if (res.confirm) {
					birthday.value = e.value ? moment(e.value).format("YYYY-MM-DD") : "";
					timeshow.value = false
					timeishow.value = false
					const ress = await updateMember({
						birthday: birthday.value
					});
					if (ress.code == 200) {
						if (res.clazz) {
							userInfo.value.birthday = birthday.value
							appStore.updateUserInfo(ress.clazz);
						} else {
							userInfo.value.birthday = birthday.value
							appStore.updateUserInfo(userInfo.value);
						}
					} else {
						toast(ress.msg)
					}
				} else if (res.cancel) {

				}
			}
		})
		// showConfirm('生日信息维护后不可修改，确定保存?').then(() => {
		// 	birthday.value = moment(e.value).format("YYYY-MM-DD")
		// 	// timeshow.value = false
		// 	// timeishow.value = false
		// 	// updateMember({
		// 	// 	birthday: birthday.value
		// 	// });
		// 	// userInfo.value.birthday = birthday.value;
		// 	// appStore.updateUserInfo(userInfo.value);
		// })

	};
	// 获取用户信息
	const getUserInfo = async () => {
		const res = await getMiniUserInfo();
		userInfo.value = res.clazz
		if (res.clazz.sex === '1') {
			sextext.value = '男';
			sex.value = false
		}
		if (res.clazz.sex === '2') {
			sextext.value = '女';
			sex.value = false
		}
		avatarUrl.value = res.clazz.headImageUrl
		birthday.value = res.clazz.birthday
		formatPhone.value = formatPhoneNumWithMask(res.clazz.mobile)
	}

	const selectActive = async () => {
		const path = await chooseOneImage();
		if (path) {
			const uploadRes = await uploadFile({
				url: '/file/upload',
				filePath: path, // 使用微信返回的头像路径
			});
			console.log('上传结果', uploadRes.data.url);


			const ress = await updateMember({
				headImageUrl: uploadRes.data.url,
			});
			if (ress.code == 200) {
				avatarUrl.value = uploadRes.data.url;
				if (ress.clazz) {
					userInfo.value.headImageUrl = uploadRes.data.url
					appStore.updateUserInfo(ress.clazz);
				} else {
					userInfo.value.headImageUrl = uploadRes.data.url
					appStore.updateUserInfo(userInfo.value);
				}
			} else {
				toast(ress.msg)
			}


		}

		console.log(path);
	}
	const chooseOneImage = () : Promise<string> => {
		return new Promise<string>((resolve, reject) => {
			// #ifdef MP-WEIXIN
			uni.chooseMedia({
				count: 1,
				mediaType: ['image'],
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				camera: 'back',
				success: (res) => {
					const file = res.tempFiles?.[0];
					if (file?.tempFilePath) {
						console.log('压缩后大小：', file.size, '字节');
						resolve(file.tempFilePath);
					} else {
						reject(new Error('未选择图片'));
					}
				},
				fail: (err) => reject()
			});
			// #endif

			// #ifndef MP-WEIXIN
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					const path = res.tempFilePaths?.[0];
					if (path) resolve(path);
					else reject(new Error('未选择图片'));
				},
				fail: (err) => reject()
			});
			// #endif
		});
	};
	onLoad(() => {
		getUserInfo()
	})
</script>

<style scoped lang="scss">
	@import './personal.scss';

	.searchView {
		background: var(--head-color);
	}

	.activeImg {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	::v-deep .u-cell__value {
		color: #999999 !important;
	}

	::v-deep .u-input {
		display: none !important;
	}
</style>