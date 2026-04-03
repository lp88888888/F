// 定义每个主题的颜色配置
const themeColorConfigs = {
  light: {
    $color: '#09BABE', // 主题色
    $pColor: '#09BABE', // 价格颜色
    $pageBgColor: '#F8F9FB', // 页面背景色
    $pageBBgColor: '#D1E5F9', // 页面顶部背景色 深
    $bgLgColor: 'linear-gradient(to bottom,#5AD6D6,#069FA4)', // 背景渐变色(按钮常用)
    $bgTopColor: 'linear-gradient( 180deg, #D1E5F9 0%, #FFFFFF 96%)', // 顶部背景色
    $bgTemToPageColor: 'linear-gradient(to bottom, $color, $pageBgColor)', // 主题色到页面背景色的渐变色
  },
  dark: {
    $color: '#333333',
    $pColor: '#333333',
    $pageBgColor: '#222222',
    $pageBBgColor: '#444444',
    $bgLgColor: 'linear-gradient(to bottom, #666666, #333333)',
    $bgTopColor: 'linear-gradient(180deg, #444444 0%, #222222 96%)',
    $bgTemToPageColor: 'linear-gradient(to bottom, $color, $pageBgColor)',
  },
  blue: {
    $color: '#1890ff',
    $pColor: '#1890ff',
    $pageBgColor: '#ecf5ff',
    $pageBBgColor: '#d1e5f9',
    $bgLgColor: 'linear-gradient(to bottom, #5dade2, #1890ff)',
    $bgTopColor: 'linear-gradient(180deg, #d1e5f9 0%, #ffffff 96%)',
    $bgTemToPageColor: 'linear-gradient(to bottom, $color, $pageBgColor)',
  },
  green: {
    $color: '#09BABE',
    $pColor: '#09BABE',
    $pageBgColor: '#F8F9FB',
    $pageBBgColor: '#D1E5F9',
    $bgLgColor: 'linear-gradient(to bottom,#5AD6D6,#069FA4)',
    $bgTopColor: 'linear-gradient( 180deg, #D1E5F9 0%, #FFFFFF 96%)',
    $bgTemToPageColor: 'linear-gradient(to bottom, $color, $pageBgColor)',
  },
  pink: {
    $color: '#09BABE',
    $pColor: '#09BABE',
    $pageBgColor: '#F8F9FB',
    $pageBBgColor: '#D1E5F9',
    $bgLgColor: 'linear-gradient(to bottom,#5AD6D6,#069FA4)',
    $bgTopColor: 'linear-gradient( 180deg, #D1E5F9 0%, #FFFFFF 96%)',
    $bgTemToPageColor: 'linear-gradient(to bottom, $color, $pageBgColor)',
  },
};

// 根据主题名获取颜色配置
export default function getThemeColors(themeName: string) {
  return themeColorConfigs[themeName] || themeColorConfigs.green;
}

// 如果需要，也可以导出颜色配置对象
export { themeColorConfigs };