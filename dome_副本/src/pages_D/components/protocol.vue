<template>
	<view class="popup-container">
		<view class="popup-content">
			<view class="popup-header">用户协议</view>

			<scroll-view class="popup-con" scroll-y="true" @scroll="onScroll" scroll-top="0">
				<rich-text :nodes="richText" id="richText"></rich-text>
			</scroll-view>
			
			<!-- 占位 -->
		    <view class="bottom-bar-s"></view>
			
			<view class="bottom-bar">
				<view class="agree-con">
					<image v-if="!isChecked" @click="onProtocol" class="agree-icon"
						:src="imgUrl + 'volumePricing/vp_agree.png'" />
					<image v-else class="agree-icon" :src="imgUrl + 'volumePricing/vp_agreed.png'" />
					<view>
						<text class="agree-txt">已阅读并同意</text>
						<text @click="onProtocol" class="protocol">《服务协议》</text>
					</view>
				</view>

				<view class="confirm-btn" :class="{ opacity: !isChecked }" @click="confirmSelection">
					同意协议
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, onMounted, getCurrentInstance } from 'vue';
	import { imgUrl } from '../../config';
	// 获取当前组件实例
	const instance = getCurrentInstance()
	// 定义状态
	const isChecked = ref(false); // 是否勾选
	const richTextHeight = ref(0);
	const scrollViewHeight = ref(0);
	const richText = ref(`
<h3>陕易通平台“以量定价”差异化收费服务协议</h3>
<p><strong>甲方：</strong>参与“以量定价”差异化收费的6型货车司乘</p>
<p><strong>乙方：</strong>陕西交通控股集团有限公司延延分公司</p>
<p><strong>丙方：</strong>陕易通平台</p>
<p>本协议是用于乙方“以量定价”差异化收费优惠活动（以下简称“以量定价”），甲方在使用陕易通平台报名参与活动前，请仔细阅读本协议。当点击“同意”完成活动报名申请操作时，即表示已充分理解并接受本协议的全部条款。</p>
<h3>一、活动介绍</h3>
<h4>（一）活动内容</h4>
<p>甲方通过陕易通平台报名参与乙方主办的“以量定价”活动，在乙方活动时间及路段内，甲方报名之日起在指定路段内达到历史通行次数的增量部分给予3至3.5折通行费优惠。</p>
<h4>（二）活动时间</h4>
<p>2025年11月1日00:00:00起至2026年10月31日23:59:59止，具体活动期间依据乙方运营需求可做灵活调整，乙方应提前5个工作日通过陕易通平台予以公告。</p>
<h4>（三）实施对象</h4>
<p>6型货车(采用JT/T489-2019中规定的全国统一的车型分类标准)：所有动力类型，包括燃油车、加气车、充电车。若在本协议有效期内，国家对“6型货车”范围进行调整的，则对应适用新范围。</p>

<h4>（四）优惠路段</h4>
<p>乙方本次活动实施路段分别为：路段1：永坪⇋青化砭；路段2：青化砭⇋蟠龙；路段3：永坪⇋蟠龙；路段4：子长东⇋永坪；路段5：子长东⇋蟠龙；路段6：子长东⇋青化砭。</p>

<p><em>（注：优惠仅适用于甲方在满足优惠路径单元指定的收费站上下站，及必须有完整进出的行程。</em></p>

<h4>（五）“通行增量部分”判定</h4>
<ul>
  <li>本期通行次数：本协议活动区间，甲方在本协议约定的优惠活动路段上的半年度通行次数。</li>
  <li>前置通行次数判定：甲方在本活动开始前上年度同期的半年度通行总次数。</li>
  <li>新用户判定：对于新用户，参加活动前最少行驶1次优惠路段，才能享受优惠政策。</li>
  <li>老用户判定：前置次数采用“最大范围覆盖”原则。</li>
</ul>

<h4>（六）差异化优惠折扣</h4>
<p>1. 指定活动期间，永坪-蟠龙24.66公里区段六型货车折扣率3.5折；青化砭-蟠龙22.27公里区段六型货车折扣率3.5折；永坪-青化砭46.93公里区段六型货车折扣率3折。</p>
<p>2. 优惠可叠加享受：甲方可在原有优惠金额基础上，叠加享受乙方提供的差异化通行费折扣。</p>

<h4>（七）优惠生效规则</h4>
<p>甲方完成活动要求的前置通行次数后，丙方将通过短信消息进行实时推送，甲方自通知发送时起满24小时后，在约定的优惠路段完成完整进出站行程即可享受优惠。</p>

<h3>二、用户数据授权</h3>
<h4>（一）授权范围</h4>
<p>甲方报名参与活动即表示授权同意乙方及丙方获取其注册车辆在活动路段的历史及实时通行数据。</p>

<h4>（二）授权期限</h4>
<p>从甲方在丙方平台确认提交申请报名起，授权生效，直至本次活动结束。</p>

<h4>（三）数据用途</h4>
<p>丙方获取甲方的车辆通行相关数据仅用于乙方主办的“以量定价”优惠活动及后续业务优化工作。</p>

<h3>三、双方权利与义务</h3>
<h4>（一）甲方权利与义务</h4>
<ul>
  <li>有权在活动期间通过丙方平台实时查询与活动相关的各类信息。</li>
  <li>满足活动前置条件并符合优惠规则时，有权享受通行费优惠。</li>
</ul>

<h4>（二）乙方权利与义务</h4>
<ul>
  <li>乙方有权对活动规则、优惠对象等进行适当调整，并提前5个工作日通过丙方平台公示。</li>
  <li>确保活动期间优惠政策的准确执行。</li>
</ul>

<h4>（三）丙方权利与义务</h4>
<ul>
  <li>负责保障平台的稳定运行，并向甲方传达活动内容。</li>
  <li>严格履行数据安全保护义务。</li>
</ul>

<h3>四、数据安全与隐私保护</h3>
<p>丙方承诺平台符合信息系统三级安全等保要求，并采用行业标准的安全技术和管理措施保护甲方的数据安全。</p>

<h3>五、违约责任</h3>
<p>若甲方违反本协议，提供虚假信息或通过不正当手段骗取优惠，乙方有权要求并同步丙方取消甲方的参与活动资格。</p>

<h3>六、协议变更与解除</h3>
<p>乙方有权依据法律法规变化、业务调整或活动实际需要变更本协议内容。</p>

<h3>七、争议解决</h3>
<p>若本协议履行过程中发生争议，三方应首先友好协商解决。</p>

<h3>八、其他</h3>
<p>本协议的成立、生效、履行、解释及争议的解决均应适用中华人民共和国法律。</p>

`);
	// 声明事件
	const emit = defineEmits<{
		(e : 'close') : void;
		(e : 'onConfirmProtocol') : void;
		(e : 'onProtocol') : void;
	}>();
	// 页面初始化
	onMounted(() => {
		setTimeout(() => {
			getRichTextHeight();
			getScrollViewHeight(); // 获取滚动容器高度
		}, 100);
	});

	// 获取富文本的高度
	const getRichTextHeight = () => {
		const query = uni.createSelectorQuery().in(instance);
		query.select('#richText')
			.boundingClientRect((rect) => {
				if (rect) {
					richTextHeight.value = rect.height;
				}
			})
			.exec();
	};

	// 获取滚动容器的高度
	const getScrollViewHeight = () => {
		const query = uni.createSelectorQuery().in(instance);
		query.select('.popup-con')
			.boundingClientRect((rect) => {
				if (rect) {
					scrollViewHeight.value = rect.height;
				}
			})
			.exec();
	};

	// 滚动事件处理
	const onScroll = (e : any) => {
		const { scrollTop } = e.detail;
		// console.log('当前滚动位置:', scrollTop);
		// console.log('富文本总高度:', richTextHeight.value);
		// console.log('滚动容器高度:', scrollViewHeight.value);

		if (!isChecked.value) {
			// 滚动距离 + 滚动容器高度 >= 富文本总高度 - 误差值
			const isBottom = scrollTop + scrollViewHeight.value >= richTextHeight.value - 10;
			if (isBottom) {
				isChecked.value = true;
			}
		}
	};

	// 关闭弹窗
	const closePopup = () => {
		emit('close');
	};

	// 确认协议
	const confirmSelection = () => {
		if (!isChecked.value) return;
		emit('onConfirmProtocol', isChecked.value);
		closePopup();
	};

	// 显示协议
	const onProtocol = () => {
		emit('onProtocol');
	};
</script>

<style lang="scss">
	.popup-container {
		width: 100%;
		height: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		z-index: 9999;
	}

	.popup-content {
		width: 100%;
		background: linear-gradient(180deg, #FFF6F9 0%, #F7F8FA 100%);
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		padding: 0 24rpx;
	}

	.popup-header {
		height: 98rpx;
		line-height: 98rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		padding: 0 30rpx;
		border-radius: 24rpx 24rpx 0 0;
	}

	.popup-con {
		padding: 37rpx 30rpx 0;
		background: #FFFFFF;
		border-radius: 24px 24px 0px 0px;
		max-height: 866rpx;
		overflow-y: scroll;
		box-sizing: border-box;
	}

	.bottom-bar {
		width: 100%;
		height: 314rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		background: #FFFFFF;
		box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.3);
		box-sizing: border-box;
		padding: 40rpx;
	}
	
	.bottom-bar-s {
	  width: 100%;
	  height: 334rpx;
	}

	.agree-con {
		display: flex;
		align-items: center;
	}

	.agree-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 26rpx;
	}

	.agree-txt {
		color: #3A3A3A;
	}

	.protocol {
		color: #1876FF;
	}

	.confirm-btn {
		width: 100%;
		text-align: center;
		margin-top: 40rpx;
		height: 96rpx;
		line-height: 96rpx;
		border-radius: 46rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: 500;
		background: #EE8F40;
	}

	.opacity {
		opacity: 0.5;
	}
</style>