// utils/markdownParser.js
import markdownit from 'markdown-it';

let linkMap = {};

export function parseMarkdown(mdText) {
  linkMap = {};
  // 初始化 markdown-it（关闭 linkify 避免依赖问题）
  const md = markdownit({
    linkify: true,
    breaks: true,
    html: true, // 允许解析 HTML 标签
    xhtmlOut: true
  });

  // 第一步：解析 Markdown（若输入是 Markdown 则用这个，若直接是 HTML 可跳过）
  let html = md.render(mdText || '');

  // 第二步：修复 HTML 中的问题（核心修复逻辑）
  html = html
    // 修复链接缺失的 //
    .replace(/https:\/([^/])/g, 'https://$1')
    // 给 img 添加适配样式
    .replace(/<img /g, '<img style="max-width: 100%; height: auto;" ')
    // 闭合 br 标签
    .replace(/<br>/g, '<br/>')
    // 替换 a 标签的 href 为 data-link，存储真实链接
    // .replace(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g, (match, href, text) => {
    //   const linkKey = `link_${Object.keys(linkMap).length + 1}`;
    //   linkMap[linkKey] = href;
    //   return `<a data-link="${linkKey}" style="color: #007aff; text-decoration: underline;">${text}</a>`;
    // });
	// 第三步：新增 /pages 路径替换逻辑（核心）
  // 正则匹配裸的 /pages 路径（未被 <a> 包裹的）
  // const pagesPathRegex = /\/pages[\w\/\?=&-]+(?=\s|$|<|>|"|')/g;
	//  html = html.replace(pagesPathRegex, (path) => {
	//   console.log('34567890-=',path);
	// const linkKey = `link_${Object.keys(linkMap).length + 1}`;
	// // 标记为本地页面链接，存储原始路径
	// linkMap[linkKey] = { type: 'page', url: path };
	// // 替换为带 data-link 的 <a> 标签
	// return `<a data-link="${path}" style="color: #007aff; text-decoration: underline;">${path}</a>`;
	//  });
	// console.error('PDF 下载失败：', html);
  return { html, linkMap };
}

// 处理链接点击跳转
export function handleLinkJump(linkKey) {
  if (!linkKey || !linkMap[linkKey]) return;
  const url = linkMap[linkKey];

  // 区分 PDF 下载、网页跳转
  if (url.endsWith('.pdf') || url.includes('pdf')) {
    // 小程序：下载 PDF（需使用 uni.downloadFile）
    // APP：直接打开 PDF 链接
    if (uni.getSystemInfoSync().platform === 'app-plus') {
      plus.runtime.openURL(url);
    } else {
      uni.downloadFile({
        url,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.openDocument({
              filePath: res.tempFilePath,
              showMenu: true,
              title: '通行票据.pdf'
            });
          }
        },
        fail: (err) => {
          uni.showToast({ title: 'PDF 下载失败', icon: 'none' });
          console.error('PDF 下载失败：', err);
        }
      });
    }
  } else {
    // 网页链接：小程序用 web-view 打开，APP 直接打开
    uni.navigateTo({
      url: `/pages/webview/webview?url=${encodeURIComponent(url)}`
    });
  }
}