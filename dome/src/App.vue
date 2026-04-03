<template>
  <div id="app"></div>
</template>

<script setup lang="ts">
declare const getApp: <T = any>() => T;

// ===================== 导入模块 =====================
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import { nextTick } from 'vue';
import { useThemeStore } from './stores/theme';
import { useMqttStore } from '@/store/modules/mqtt';
import { postinsert } from '@/api/user';

// ===================== 常量定义 =====================
const TRACK_API = {
  single: 'https://your-domain.com/api/track/upload',
  batch: 'https://your-domain.com/api/track/batch-upload',
};

type PlatformType = 'ios' | 'android' | 'windows' | 'mac' | 'unknown';

// ===================== 类型定义 =====================
interface GlobalData {
  hasFetchExperienceInfo?: boolean;
}

interface TrackData {
  pagePath: string;
  pageTitle?: string; // 新增：页面标题
  enterTime: string;
  leaveTime: string;
  stayTime: string;
  platform: PlatformType;
  timestamp: number;
  sessionId?: string;
}

interface GlobalTrackState {
  pageEnterTime: Record<string, number>;
  pageTitle: Record<string, string>; // 新增：存储页面标题
  trackCache: TrackData[];
  currentTabbarPage?: string;
}

// ===================== 全局状态 =====================
const globalState: GlobalTrackState = reactive({
  pageEnterTime: {},
  pageTitle: {}, // 新增初始化
  trackCache: [],
  currentTabbarPage: undefined,
});

// ===================== 工具函数 =====================
function generateUUID(): string {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 多渠道获取页面路由（核心优化：解决路由获取失败问题）
 */
function getPageRoute(pageContext?: any, pageConfig?: any): string {
  if (pageContext?.route) return pageContext.route;
  try {
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      if (currentPage?.route) return currentPage.route;
      if ((currentPage as any)?.$page?.path) return (currentPage as any).$page.path;
    }
  } catch (error) {
    console.error('[埋点] 从页面栈获取路由失败：', error);
  }
  if (pageConfig?.path) return pageConfig.path;
  const fallbackRoute = `unknown_page_${Date.now()}`;
  console.warn('[埋点] 路由获取失败，使用兜底标识：', fallbackRoute);
  return fallbackRoute;
}

/**
 * 新增：获取当前页面标题
 * 优先从 pages.json 配置中获取，兜底从页面实例或动态设置中获取
 */
function getCurrentPageTitle(): string {
  try {
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1] as any;
      
      // 1. 优先从 pages.json 配置的 navigationBarTitleText 获取
      if (currentPage.$page?.meta?.navigationBarTitleText) {
        return currentPage.$page.meta.navigationBarTitleText;
      }
      
      // 2. 兜底从页面实例的 data 或 options 获取（动态设置标题的场景）
      if (currentPage.data?.title) return currentPage.data.title;
      if (currentPage.$page?.options?.title) return currentPage.$page.options.title;
    }
  } catch (error) {
    console.error('[埋点] 获取页面标题失败：', error);
  }
  return '未知页面标题';
}

function getPlatformType(): PlatformType {
  try {
    const systemInfo = uni.getSystemInfoSync();
    return systemInfo.platform as PlatformType;
  } catch (error) {
    console.error('[埋点] 获取系统信息失败：', error);
    return 'unknown';
  }
}

// ===================== 埋点核心逻辑 =====================

/**
 * 新增：处理页面进入（记录进入时间 + 标题）
 */
function handlePageEnter(pageRoute?: string) {
  const route = pageRoute || getPageRoute();
  if (!route) return;

  // 记录进入时间
  globalState.pageEnterTime[route] = Date.now();
  // 记录页面标题
  const title = getCurrentPageTitle();
  globalState.pageTitle[route] = title;
  
  console.log(`[埋点] 进入页面：${route}，标题：${title}`);
}

/**
 * 处理页面离开逻辑（修改：整合页面标题）
 */
function handlePageLeave(pageRoute?: string) {
  const route = pageRoute || getPageRoute();
  if (!route) return;

  const enterTime = globalState.pageEnterTime[route];
  const pageTitle = globalState.pageTitle[route]; // 获取标题
  if (!enterTime) {
    console.warn('[埋点] 未找到页面进入时间，跳过上报：', route);
    return;
  }

  const leaveTime = Date.now();
  const stayTime = ((leaveTime - enterTime) / 1000).toFixed(2);

  const trackData: TrackData = {
    pagePath: route,
    pageTitle: pageTitle || '未知页面标题', // 新增标题字段
    enterTime: new Date(enterTime).toISOString(),
    leaveTime: new Date(leaveTime).toISOString(),
    stayTime,
    platform: getPlatformType(),
    timestamp: leaveTime,
    sessionId: uni.getStorageSync('session_uuid'),
  };

  console.log('[埋点] 页面停留数据：', trackData);
  uploadTrack(trackData);
  
  // 清理已上报的数据
  delete globalState.pageEnterTime[route];
  delete globalState.pageTitle[route];
}

/**
 * 处理 Tabbar 页面切换（修改：整合 handlePageEnter）
 */
function initTabbarTrack() {
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.onAppRoute) {
    wx.onAppRoute((res: any) => {
      if (res?.path) {
        const pageRoute = res.path;
        console.log(`[埋点] Tabbar 切换到：${pageRoute}`);
        
        // 先处理上一个 Tabbar 页面的离开
        if (globalState.currentTabbarPage) {
          handlePageLeave(globalState.currentTabbarPage);
        }
        
        // 处理当前 Tabbar 页面的进入（含标题获取）
        handlePageEnter(pageRoute);
        globalState.currentTabbarPage = pageRoute;
      }
    });
  }
  // #endif

  uni.onTabBarMidButtonTap?.(() => {
    // 中间按钮点击处理（按需）
  });
}

/**
 * 新增：监听普通页面路由变化
 */
function initPageRouteTrack() {
  uni.onAppRoute((res: any) => {
    if (res?.path) {
      const pageRoute = res.path;
      console.log(`[埋点] 路由变化到：${pageRoute}`);
      
      // 处理当前页面的进入（含标题获取）
      handlePageEnter(pageRoute);
    }
  });
}

async function uploadTrack(trackData: TrackData) {
  try {
    await uni.request({
      url: TRACK_API.single,
      method: 'POST',
      data: trackData,
      timeout: 5000,
    });
    console.log('[埋点] 上报成功：', trackData.pagePath);
  } catch (error) {
    console.error('[埋点] 上报失败，缓存数据：', error);
    const cacheItem = JSON.parse(JSON.stringify(trackData));
    globalState.trackCache.push(cacheItem);
    uni.setStorageSync('trackCache', globalState.trackCache);
  }
}

// ===================== 会话埋点逻辑 =====================
async function reportSession(uuid: string) {
  if (!uuid) return;
  try {
    const params = {
      name: '会话',
      type: 'session',
      sessionId: uuid,
      deviceType: 'wx',
    };
    await postinsert(params);
    console.log('[会话埋点] 上报成功：', uuid);
  } catch (error) {
    console.error('[会话埋点] 上报失败：', error);
  }
}

// ===================== 生命周期钩子 =====================
onLaunch(() => {
  // 1. 初始化会话ID
  let uuid = uni.getStorageSync('session_uuid') as string;
  if (!uuid) {
    uuid = generateUUID();
    uni.setStorageSync('session_uuid', uuid);
  }
  if (uni.getStorageSync('Token')) {
    reportSession(uuid);
  }

  // 2. 初始化全局数据
  const app = getApp<{ globalData?: Partial<GlobalData> }>();
  if (!app.globalData) {
    app.globalData = { hasFetchExperienceInfo: false };
  }
  if (typeof app.globalData.hasFetchExperienceInfo === 'undefined') {
    app.globalData.hasFetchExperienceInfo = false;
  }

  // 3. 初始化主题
  const themeStore = useThemeStore();
  const currentTheme = themeStore.initTheme();
  console.log('当前主题:', currentTheme);

  // 4. 监听主题变化
  uni.$on('themeChanged', (theme: string) => {
    console.log('全局主题变化:', theme);
    nextTick(() => {
      // #ifdef H5
      if (typeof document !== 'undefined') {
        const html = document.documentElement;
        console.log('H5主题属性:', html.getAttribute('data-theme'));
      }
      // #endif
    });
  });

  // 5. 初始化 Tabbar 埋点
  initTabbarTrack();

  // 6. 新增：初始化普通页面路由监听
  initPageRouteTrack();

  // 7. 新增：处理初始页面的进入（应用启动时的第一个页面）
  nextTick(() => {
    const initialRoute = getPageRoute();
    handlePageEnter(initialRoute);
  });
});

onHide(() => {
  // 1. 上报会话结束
  const uuid = uni.getStorageSync('session_uuid') as string;
  if (uuid && uni.getStorageSync('Token')) {
    reportSession(uuid);
    uni.removeStorageSync('session_uuid');
  }

  // 2. 处理当前页面埋点
  handlePageLeave();
  
  // 3. 处理 Tabbar 页面埋点
  if (globalState.currentTabbarPage) {
    handlePageLeave(globalState.currentTabbarPage);
  }
});

onShow(() => {
  // 1. 初始化MQTT
  const mqttStore = useMqttStore();

  // 2. 微信小程序更新检测
  // #ifdef MP-WEIXIN
  if (uni.canIUse('getUpdateManager')) {
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        console.log('检测到新版本：', res);
        updateManager.onUpdateReady(() => {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            showCancel: false,
            success: (modalRes) => {
              if (modalRes.confirm) {
                updateManager.applyUpdate();
              }
            },
          });
        });
        updateManager.onUpdateFailed(() => {
          uni.showToast({
            title: '新版本下载失败',
            icon: 'none',
          });
        });
      }
    });
  } else {
    uni.showModal({
      title: '更新提示',
      content: '当前微信版本过低，部分功能无法使用，请升级到最新微信版本后重试',
    });
  }
  // #endif

  console.log('App Show');
});
</script>

<style lang="scss">
@import "@/uni_modules/uview-plus/index.scss";
@import '@/styles/theme.css';
@import '@/style/common.css';

page {
  color: var(--text-color);
  background-color: var(--background-color);
  /* #ifndef MP-WEIXIN */
  transition: color 0.3s ease, background-color 0.3s ease;
  /* #endif */
  min-height: 100vh;
}

::v-deep .u-navbar__content {
  background: transparent !important;
}
</style>