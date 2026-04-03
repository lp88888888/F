<template>
	<view class="input_box">
		<image class="input_icon" v-if="gifStatus" :src="icoUrl + 'BdDigitalMan/idle_6.gif'" mode="aspectFill"></image>

		<view class="" style="margin-top: 256rpx">
			<view class="tips_text" v-if="!inputStatus && speekStatus">{{ popupText }}</view>
			<view class="input_view" >
				<view class="input_sr" v-if="!inputStatus && !speekStatus" @longpress.stop="handleSpeakStart">
					<image class="input_sr_img" :src="`${icoUrl}BdDigitalMan/dmIcon7.png`" mode="" @click.stop="handleIput"> </image>
					<view class="input_sr_r">
						<text class="input_sr_r_text">按住说话</text>
					</view>
				</view>
				<view class="input_sr" v-if="inputStatus">
					<image class="input_sr_img" :src="`${icoUrl}BdDigitalMan/dmIcon4.png`" mode="" @click.stop="handleIput"> </image>
					<view class="input_sr_r">
						<textarea
							class="input_sr_r_input"
							v-model="messageValue"
							:show-confirm-bar="false"
							placeholder="请输入你想资讯的问题"
							@confirm="inputconfirm"
							auto-height
						/>
					</view>
					<up-icon
						v-if="messageValue"
						:name="icoUrl + 'BdDigitalMan/submt-icon.png'"
						size="28"
						@click="inputconfirm({ detail: { value: messageValue } })"
					></up-icon>
				</view>
				<view
					class="input_yynow"
					v-if="!inputStatus && speekStatus"
					:style="{ backgroundColor: isCancel ? '#FF0000' : themeStore.themeColors.$color }"
					@touchstart="onStartRecord"
					@touchmove="onTouchMove"
					@touchend="onTouchEnd"
				>
					<image class="input_yynow_img" :src="`${imgUrl}static/seekp_icon.gif`" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { imgUrl, aiUrl } from '@/config';
import { useTheme } from '@/composables/useTheme';
const { themeStore, pageTheme } = useTheme();
const icoUrl = computed(() => themeStore.imgUrl);

const props = defineProps({
	gifStatus: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['inputconfirm', 'recordstart', 'recordcancel', 'recordsend']);

const popupText = ref('松手发送，上移取消');

const messageValue = ref('');
const inputStatus = ref(false);
const speekStatus = ref(false);

// 输入框、按住说话切换状态
const handleIput = () => {
	inputStatus.value = !inputStatus.value;
	speekStatus.value = false;
};

// 按住说话
const handleSpeakStart = () => {
	inputStatus.value = false;
	speekStatus.value = true;
};

// 触摸移动
const startY = ref(0);

// 是否上移取消
const isCancel = ref(false);

/**开始录音 */
const onStartRecord = (e: TouchEvent) => {
	if (!inputStatus.value && speekStatus.value) {
		console.log('开始触摸', e);
		startY.value = e.touches[0].clientY;
		popupText.value = '松手发送，上移取消';
		emit('recordstart');
	}
};

const onTouchMove = (e: TouchEvent) => {
	e.preventDefault();
	e.stopPropagation();
	if (!inputStatus.value && speekStatus.value) {
		console.log('触摸移动', e);
		const currentY = e.touches[0].clientY;
		const moveY = startY.value - currentY; // 向上为正
		if (moveY > 60) {
			popupText.value = '松手取消';
			isCancel.value = true;
		} else {
			popupText.value = '松手发送，上移取消';
			isCancel.value = false;
		}
	}
};

const onTouchEnd = (e: TouchEvent) => {
	if (!inputStatus.value && speekStatus.value) {
		console.log('触摸结束', e);
		speekStatus.value = false;
		isCancel.value = false;
		popupText.value = '松手发送，上移取消';
		if (isCancel.value) {
			emit('recordcancel');
		} else {
			emit('recordsend');
		}
	}
};

// 输入框确认
const inputconfirm = (e) => {
	console.log('输入的文字', e);
	emit('inputconfirm', e.detail.value);
};
</script>

<style scoped lang="scss">
view {
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
}

.input_box {
	width: 750rpx;
	position: relative;
	align-items: center;

	.input_icon {
		width: 315rpx;
		height: 315rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}

	.tips_text {
		width: 686rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #6e6e6e;
		text-align: center;
		position: absolute;
		left: 0;
		bottom: 120rpx;
		z-index: 1;
	}

	.input_view {
		width: 686rpx;
		min-height: 112rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(174, 213, 171, 0.5029);
		border-radius: 32rpx;
		position: relative;
		z-index: 5;

		.input_sr {
			width: 686rpx;
			min-height: 112rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 14rpx 28rpx;

			.input_sr_img {
				width: 56rpx;
				height: 56rpx;
				margin-right: 20rpx;
			}

			.input_sr_r {
				flex: 1 0;
				width: 0;
				min-height: 84rpx;
				background-color: #f6f6f6;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.input_sr_r_text {
					font-weight: 400;
					font-size: 28rpx;
					color: #6e6e6e;
				}

				.input_sr_r_input {
					width: 100%;
					min-height: 84rpx;
					max-height: 200rpx;
					background-color: #ffffff;
					font-weight: 400;
					font-size: 28rpx;
					padding-top: 26rpx;
					box-sizing: border-box;
				}
			}
		}

		.input_yynow {
			width: 686rpx;
			height: 112rpx;
			background-color: #0000ff;
			border-radius: 32rpx;

			.input_yynow_img {
				width: 686rpx;
				height: 112rpx;
			}
		}
	}
}
</style>
