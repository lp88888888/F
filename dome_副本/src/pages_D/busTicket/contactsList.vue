<template>
  <view class="contacts-page">
    
    <!-- 新增按钮 -->
    <!-- <u-button 
      text="新增乘客" 
      class="add-btn"
      @click="toNav('/pages_D/busTicket/addContacts')"
    ></u-button> -->
    <view class="addchenke"  @click="toNav('/pages_D/busTicket/addContacts')" >添加乘车人<image :src="imgUrl+'addck-icon.png'" mode="" class="icon"></image></view>
    <!-- 联系人列表 -->
    <view class="contacts-list">
      <!-- 空状态 -->
      <u-empty 
        v-if="contacts.length === 0" 
        text="暂无常用联系人" 
        mode="list"
        class="empty-placeholder"
      ></u-empty>
      
      <!-- 联系人项 -->
      <view 
        v-for="(contact, index) in contacts" 
        :key="contact.id" 
        class="contact-item"
      >
        <!-- 复选框 -->
        <u-checkbox 
          v-model="contact.checked" 
          shape="square"
          active-color="$color"
          size="28rpx"
          @change="handleCheckChange(index)"
        ></u-checkbox>
        
        <!-- 联系人信息 -->
        <view class="contact-info">
          <text class="contact-name">{{ contact.name }}</text>
          <text class="id-number">{{ maskIdNumber(contact.idNumber) }}</text>
        </view>
        <image :src="imgUrl+'emit-icon.png'" mode="" class="emit-icon"></image>
        <!-- 操作按钮组 - 直接放在右侧 -->
    <!--    <view class="operation-buttons">
          <u-button 
            icon="edit" 
            size="mini" 
            class="edit-btn"
            @click.stop="handleEditContact(index)"
          ></u-button>
          <u-button 
            icon="trash" 
            size="mini" 
            class="delete-btn"
            @click.stop="handleDeleteContact(index)"
          ></u-button>
        </view> -->
      </view>
    </view>
    
    <!-- 底部确定按钮 -->
    <!-- <u-button 
      text="确定" 
      class="confirm-btn"
      @click="handleConfirm"
      :disabled="selectedCount === 0"
    ></u-button> -->
	<view class="fix-bott">
		确认
	</view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { toNav, toBack } from '@/utils/route';
import { imgUrl } from '@/config';
// 联系人信息接口
interface Contact {
  id: number;
  name: string;
  idNumber: string;
  checked: boolean;
}

// 联系人列表数据
const contacts = ref<Contact[]>([
  { id: 1, name: '张三', idNumber: '610123199001011234', checked: false },
  { id: 2, name: '李四', idNumber: '610123199203045678', checked: true },
  { id: 3, name: '王五', idNumber: '610123199506079012', checked: false }
]);

// 选中数量
const selectedCount = computed(() => {
  return contacts.value.filter(contact => contact.checked).length;
});

// 处理复选框变化
const handleCheckChange = (index: number) => {
  console.log(`选中状态变化: ${contacts.value[index].name} - ${contacts.value[index].checked}`);
};

// 处理新增联系人
const handleAddContact = () => {
  console.log('新增联系人');
  const newId = contacts.value.length > 0 
    ? Math.max(...contacts.value.map(c => c.id)) + 1 
    : 1;
  contacts.value.push({
    id: newId,
    name: `新联系人${newId}`,
    idNumber: '610123199909091234',
    checked: false
  });
};

// 处理编辑联系人
const handleEditContact = (index: number) => {
  console.log(`编辑联系人: ${contacts.value[index].name}`);
  // 实际项目中可打开编辑弹窗
};

// 处理删除联系人
const handleDeleteContact = (index: number) => {
  const contact = contacts.value[index];
  uni.showModal({
    title: '删除确认',
    content: `确定要删除 ${contact.name} 吗？`,
    confirmColor: '#FF4D4F',
    success: (res) => {
      if (res.confirm) {
        contacts.value.splice(index, 1);
      }
    }
  });
};

// 处理确定按钮点击
const handleConfirm = () => {
  const selectedContacts = contacts.value.filter(contact => contact.checked);
  console.log('选中的联系人:', selectedContacts);
  router.back();
};

// 身份证号脱敏处理
const maskIdNumber = (id: string) => {
  return id.replace(/^(.{6})(?:\d+)(.{4})$/, '$1********$2');
};
</script>

<style lang="scss" scoped>
	.fix-bott{
		width: 622rpx;
		height: 96rpx;
		background: #00BEBE;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		font-weight: 500;
		font-size: 32rpx;
		color: #FFFFFF;
		line-height: 96rpx;
		text-align: center;
		position: fixed;
		bottom: 60rpx;
		left: 50%;
		transform: translateX(-50%);
	}
	.emit-icon{
		width: 32rpx;
		height: 32rpx;
	}
	.addchenke{
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		padding: 30rpx 0;
		font-weight: 500;
		font-size: 28rpx;
		color: #00BEBE;
		.icon{
			width: 32rpx;
			height: 32rpx;
			margin-right: 20rpx;
		}
	}
// 引入全局变量
$spacing: 24rpx;
$border-radius: 8rpx;

.contacts-page {
background: #F8F9FB;
  min-height: 100vh;
  padding: 0 $spacing;
  padding-bottom: 120rpx; // 预留底部按钮空间
}

// 新增按钮
.add-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #FFFFFF;
  color: $color;
  border: 1px dashed $color;
  font-size: 28rpx;
  border-radius: $border-radius;
  margin: 20rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '+';
    font-size: 32rpx;
    margin-right: 10rpx;
    font-weight: bold;
  }
}

// 联系人列表
.contacts-list {
  background-color: #FFFFFF;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  
  .empty-placeholder {
    padding: 150rpx 0;
  }
  
  // 联系人项
  .contact-item {
    display: flex;
    align-items: center;
    padding: 0 $spacing;
    height: 110rpx;
    border-bottom: 1px solid #F5F5F5;
    
    &:last-child {
      border-bottom: none;
    }
    
    // 联系人信息
    .contact-info {
      flex: 1;
      margin-left: 20rpx;
      
      .contact-name {
        font-size: 30rpx;
        color: #333333;
        font-weight: 500;
        display: block;
        margin-bottom: 4rpx;
      }
      
      .id-number {
        font-size: 24rpx;
        color: #999999;
        letter-spacing: 0.5rpx;
      }
    }
    
    // 操作按钮组 - 右侧布局
    .operation-buttons {
      display: flex;
      align-items: center;
      gap: 10rpx;
      
      .edit-btn {
        color: #666666;
        background-color: #F5F5F5;
        width: 60rpx;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 20rpx;
        padding: 0;
        
        &:hover {
          background-color: #EEEEEE;
        }
      }
      
      .delete-btn {
        color: #FF4D4F;
        background-color: rgba(255, 77, 79, 0.08);
        width: 60rpx;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 20rpx;
        padding: 0;
        
        &:hover {
          background-color: rgba(255, 77, 79, 0.15);
        }
      }
    }
  }
}

// 底部确定按钮
.confirm-btn {
  position: fixed;
  bottom: 30rpx;
  left: $spacing;
  right: $spacing;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 30rpx;
  background-color: $color;
  color: #FFFFFF;
  border-radius: $border-radius;
  
  &:disabled {
    background-color: #DDDDDD;
    color: #FFFFFF;
    opacity: 0.7;
  }
}
</style>