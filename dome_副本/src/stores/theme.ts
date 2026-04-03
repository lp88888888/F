import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 多主题颜色配置
const themeColorConfigs = {
  light: {
    $color: '#09BABE',
    $pColor: '#09BABE',
    $pageBgColor: '#F8F9FB',
    $pageBBgColor: '#D1E5F9',
    $bgLgColor: 'linear-gradient(to bottom, #5AD6D6, #069FA4)',
    $bgTopColor: 'linear-gradient(180deg, #D1E5F9 0%, #FFFFFF 96%)',
    $bgTemToPageColor: 'linear-gradient(to bottom, #09BABE, #F8F9FB)',
	$headcolor:'#D7E1EB',
	$labelColor:'#CBF7F6',
	$primaryColor:'#1FC5C5',
	$linearColor:'#DAFDFF',
	$secondaryColor:'#4788FA',
	$DigitaColor:'#1FC5C5',
  },
  orange: {
    $color: '#5AD6D6',
    $pColor: '#5AD6D6',
    $pageBgColor: 'red',
    $pageBBgColor: '#2D2D2D',
    $bgLgColor: 'linear-gradient(to bottom, #6AE0E0, #2CB2B6)',
    $bgTopColor: 'linear-gradient(180deg, #2D2D2D 0%, #1A1A1A 96%)',
    $bgTemToPageColor: 'linear-gradient(to bottom, #5AD6D6, #1A1A1A)',
	$headcolor:'#FFE0BC',
	$labelColor:'#FFE7CB',
	$primaryColor:'#FF6A00',
	$linearColor:'#FFF3E6',
	$secondaryColor:'#FF8400',
	$DigitaColor:'#FF6A00',
  },
  blue: {
    $color: '#2D8CF0',
    $pColor: '#2D8CF0',
		$pColorOpa: 'rgba(72, 129, 245, 0.1)',
    $pageBgColor: '#ECF5FF',
    $pageBBgColor: '#D1E5F9',
    $bgLgColor: 'linear-gradient(to bottom, #5CADFF, #2D8CF0)',
    $bgTopColor: 'linear-gradient(180deg, #D1E5F9 0%, #FFFFFF 96%)',
	$bgNTopColor: 'linear-gradient(to bottom, #D1E5F9, #FFFFFF)',
    $bgTemToPageColor: 'linear-gradient(to bottom, #D1E5F9, #FFFFFF)',
	$headcolor:'#C0E1FF',
	$labelColor:'#D5EAFF',
	$primaryColor:'#5FAFFF',
	$linearColor:'linear-gradient(to bottom, #E1F5FF, #FCFCFB)',
	$linear2Color:'linear-gradient(to bottom, #FCFCFB, #E1F5FF)',
	$linear3Color:'linear-gradient(to left, #FCFCFB, #E1F5FF)',
	$secondaryColor:'#4E9AFF',
	$shadow:'0rpx 4rpx 16rpx 0rpx rgba(211,231,209,0.4)',
	$button:'linear-gradient( 270deg, #80A653 0%, #B2D38A 100%);',
	$DigitaColor:'#4881F5',
	$DigitaBgColor1:'linear-gradient(to right, #E9F0FF , #FEFEFE)',
	$DigitaBgColor2:'linear-gradient(to right, #F9FCFF, #E6EEFF)',
	$DigitaButColor1:'linear-gradient(to right, #165DED, #5E90F5)',
	$DigitaButColor2:'#CBDCFF',
	$tabbarBg:'linear-gradient( to bottom, #F9FCFF, #E6EEFF)',
	$homeCardBoxShadow:'0rpx 2rpx 8rpx 0rpx #D5EAFF',
	$homeHyCardBg:'linear-gradient(to left, #F9FCFF, #E6EEFF)',
	$tabbarBg1:'linear-gradient(to bottom, #CBEBFE, #F5FBFF)',
	$mineCardBg:'linear-gradient(to right, #F9FCFF, #E6EEFF)',
	$mineCardBoxShadow:'0px 2px 8px 0px #C2DBED',
	$butColor:'linear-gradient(to left, #4881F5, #82AAF9)',
	$butColorDef:'linear-gradient(to left, #E8F3FF, #F8FAFF)',
	$color2:'#D0EDFF',
	$color3:'#BFDBFE',
	$badgeBgColor:'#ECF2FF',
	
	$badgeBgColorsy:'#F2F8FD',
	$pageheadbg: 'linear-gradient(to bottom, #D1E5F9, #FFFFFF)' 
  },
  green: {
    $color: '#628F2F',
    $pColor: '#628F2F',
	$pColorOpa: 'rgba(98, 143, 47, 0.1)',
    $pageBgColor: '#F0F9F4',
    $pageBBgColor: '#D1E5F9',
    $bgLgColor: 'linear-gradient(to right, #b2d38a, #80a653)',
    $bgTopColor: 'linear-gradient(180deg, #D1E5F9 0%, #FFFFFF 96%)',
    $bgNTopColor: 'linear-gradient(to bottom, #D1E5F9, #FFFFFF)',
    $bgTemToPageColor: 'linear-gradient(to bottom, #ECFCEF, #FCFFFC)',
	$headcolor:'#B7E2B3',
	$labelColor:'#D4F4E0',
	$primaryColor:'#628F2F',
	$linearColor:'linear-gradient(to bottom, #FEFEFE, #EBF8EE)',
	$linear2Color:'linear-gradient(to bottom, #EBF8EE, #FEFEFE)',
	$linear3Color:'linear-gradient(to left, #EBF8EE, #FEFEFE)',
	$secondaryColor:'#42B162',
	$shadow:'0rpx 4rpx 16rpx 0rpx rgba(211,231,209,0.4)',
	$button:'linear-gradient( 270deg, #80A653 0%, #B2D38A 100%);',
	$DigitaColor:"#07C07D",
	$DigitaBgColor1:'linear-gradient(to right, #E3F6E7 , #FEFEFE)',
	$DigitaBgColor2:'linear-gradient(to right, #F6FBF7, #FDFEFD)',
	$DigitaButColor1:'linear-gradient(to right, #80A653, #B2D38A)',
	$DigitaButColor2:'#D3E7D1',
	$tabbarBg:'linear-gradientto bottom, #FEFEFE, #EBF8EE)',
	$homeCardBoxShadow:'0rpx 2rpx 8rpx 0rpx #d3e7d1',
	$homeHyCardBg:'linear-gradient(to left, #f8fcf9, #edfff1)',
	$tabbarBg1:'linear-gradient(to bottom, #ECFCEF, #FCFFFC)',
	$mineCardBg:'linear-gradient(to right, #FEFEFE, #EBF8EE)',
	$mineCardBoxShadow:'0px 2px 8px 0px #D3E7D1',
	$butColor:'linear-gradient(to left, #759e44, #acd483)',
	$butColorDef:'linear-gradient(to left, #EBF8EE, #FEFEFE)',
	$color2:'#EFFDF2',
	$color3:'#A7F3D0',
	$badgeBgColor:'#EBF9EB',
	$badgeBgColorsy:'#F5FDF6',
	$pageheadbg: 'linear-gradient(to bottom, #D8F7DE, #FFFFFF)'
	
	
  },
  pink: {
    $color: '#ED3321',
    $pColor: '#ED3321',
    $pageBgColor: '#F0F9F4',
    $pageBBgColor: '#D1E5F9',
    $bgLgColor: 'linear-gradient(to bottom, #36D46F, #ED3321)',
    $bgTopColor: 'linear-gradient(180deg, #D1E5F9 0%, #FFFFFF 96%)',
    $bgTemToPageColor: 'linear-gradient(to bottom, #ED3321, #F0F9F4)',
  	$headcolor:'#B7E2B3',
  	$labelColor:'#D4F4E0',
  	$primaryColor:'#ED3321',
  	$linearColor:'#FFD0D0',
  	$secondaryColor:'#ED3321',
	$DigitaColor:"#ED3321"
  }
};

export const useThemeStore = defineStore('theme', () => {
  const theme = ref('green'); // 默认主题
  
  // 主题对应的图片基础路径
  const themeImgUrls = {
    light: 'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/light/',
    orange: 'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/orange/',
    blue: 'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/blue/',
    green: 'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/green/',
	pink: 'https://tranalioss.shanyitong.com/tongyipingtai/images/app-static/pink/'
  };
  const themeLocalImgUrls = {
    light: '@/images/theme/light/',
    orange: '@/images/theme/orange/',
    blue: '@/images/theme/blue/',
    green: '@/images/theme/green/',
  	pink: '@/images/theme/pink/'
  };
  

  // 获取当前主题的颜色配置
  const themeColors = computed(() => {
    return themeColorConfigs[theme.value] || themeColorConfigs.green;
  });

  // 初始化主题（从本地存储读取）
  const initTheme = () => {
    try {
      const savedTheme = uni.getStorageSync('app-theme');
      if (savedTheme) {
        theme.value = savedTheme;
        applyTheme(savedTheme);
      }
      return theme.value;
    } catch (error) {
      console.error('初始化主题失败:', error);
      return 'green';
    }
  };

  // 切换主题（核心方法）
  const toggleTheme = (themeValue: string) => {
    theme.value = themeValue;
    applyTheme(themeValue);
    uni.$emit('themeChanged', themeValue); // 触发全局事件，通知页面更新
    console.log('主题已切换到:', themeValue);
  };

  // 应用主题（保存+设置属性）
  const applyTheme = (themeValue: string) => {
    try {
      uni.setStorageSync('app-theme', themeValue); // 持久化存储
      setPageThemeAttribute(themeValue); // 给所有页面设置data-theme属性
      
      // 设置CSS自定义属性（变量）
      setCssVariables(themeValue);
      
      // H5平台特殊处理
      // #ifdef H5
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', themeValue);
      }
      // #endif
      
    } catch (error) {
      console.error('应用主题失败:', error);
    }
  };

  // 设置CSS变量
  const setCssVariables = (themeValue: string) => {
    const colors = themeColorConfigs[themeValue] || themeColorConfigs.green;
    
    // H5平台设置CSS变量
    // #ifdef H5
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      Object.entries(colors).forEach(([key, value]) => {
        // 将驼峰命名转换为中划线命名（如：$color -> --theme-color）
        const cssVarName = '--theme-' + key.replace('$', '').replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(cssVarName, value);
      });
    }
    // #endif
    
    // 小程序平台可以通过设置内联样式或使用uni.setStorageSync传递颜色值
    // #ifdef MP-WEIXIN
    uni.setStorageSync('theme-colors', colors);
    // #endif
  };

  // 给页面设置主题属性（小程序兼容）
  const setPageThemeAttribute = (themeValue: string) => {
    try {
      // ... (原有代码保持不变)
    } catch (error) {
      console.error('设置页面主题属性失败:', error);
    }
  };

  // 获取当前主题
  const getCurrentTheme = () => {
    return theme.value;
  };
  // 获取本地图片路径
  const getLocalImgUrl = computed(() => {
	  let url = ''
	  // #ifdef MP-WEIXIN
		url = themeImgUrls[theme.value] || themeImgUrls.green;
	  // #endif
	  // #ifndef MP-WEIXIN
		url = themeLocalImgUrls[theme.value] || themeLocalImgUrls.green;
	  // #endif
		return url
    
  });
  // 获取当前主题对应的图片基础路径
  const getImgUrl = computed(() => {
    return themeImgUrls[theme.value] || themeImgUrls.green;
  });

  // 获取指定主题的图片路径
  const getThemeImgUrl = (themeName: string) => {
    return themeImgUrls[themeName] || themeImgUrls.green;
  };

  // 获取指定主题的颜色配置
  const getThemeColors = (themeName?: string) => {
    const targetTheme = themeName || theme.value;
    return themeColorConfigs[targetTheme] || themeColorConfigs.green;
  };

  return {
    theme: computed(() => theme.value), // 响应式主题值
    themeColors, // 响应式颜色配置
    imgUrl: getImgUrl, // 响应式图片路径
    localImgUrl: getLocalImgUrl, // 响应式图片路径(本地)
    toggleTheme,
    applyTheme,
    initTheme,
    getCurrentTheme,
    getThemeImgUrl,
    getThemeColors,
    themeColorConfigs // 如果需要，可以导出所有主题配置
  };
});