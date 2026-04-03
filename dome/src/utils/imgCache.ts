/**
 * 预加载/取缓存 二合一
 * 用法：
 *   import { preload, cached } from '@/utils/imgCache.js'
 *   onLaunch  : preload(['url1','url2'])      // 启动时批量预下
 *   页面模板  : <image :src="cached(url)" />
 *   任意逻辑 : cached(url).then(local=>{})
 */
const IMG_DIR = '_doc/img_cache';            // App 端持久目录
const MEM_CACHE = new Map();                 // 小程序/H5 内存兜底

/* 1. 批量预下（仅 App 端真正写盘，小程序/H5 走内存） */
export function preload(list) {
  if (!Array.isArray(list)) list = [list];
  list.forEach(url => download(url));
}

/* 2. 取本地路径（同步返回已缓存地址，异步兜底） */
export function cached(url) {
  // App 端：Storage 里有就用，没有就异步下
  // #ifdef APP-PLUS
  const key = `img_${hash(url)}`;
  const local = uni.getStorageSync(key);
  if (local) return local;          // 同步命中
  download(url);                    // 异步补一张
  return url;                       // 先回原图
  // #endif

  // 非 App：内存 Map 里有就用，没有就异步下
  // #ifndef APP-PLUS
  if (MEM_CACHE.has(url)) return MEM_CACHE.get(url);
  download(url);
  return url;
  // #endif
}

/* 真正下载：App 写盘，其他端写内存 */
function download(url) {
  // #ifdef APP-PLUS
  const key = `img_${hash(url)}`;
  if (uni.getStorageSync(key)) return;          // 已存在
  uni.downloadFile({
    url,
    success: ({ statusCode, tempFilePath }) => {
      if (statusCode !== 200) return;
      plus.io.resolveLocalFileSystemURL(tempFilePath, entry => {
        getCacheDir(dir => {
          entry.moveTo(dir, `${key}.png`, newEntry => {
            uni.setStorageSync(key, newEntry.toLocalURL());
          });
        });
      });
    }
  });
  // #endif

  // #ifndef APP-PLUS
  if (MEM_CACHE.has(url)) return;
  uni.downloadFile({ url }).then(({ tempFilePath }) => {
    MEM_CACHE.set(url, tempFilePath);
  });
  // #endif
}

/* 工具：保证缓存目录存在 */
function getCacheDir(callback) {
  plus.io.resolveLocalFileSystemURL(
    IMG_DIR,
    entry => callback(entry),
    () => {
      plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => {
        fs.root.getDirectory('img_cache', { create: true }, callback);
      });
    }
  );
}

/* 工具：简单 hash */
function hash(str) {
  let h = 0, i = str.length;
  while (i--) h = (h << 5) - h + str.charCodeAt(i);
  return (h >>> 0).toString(36);
}