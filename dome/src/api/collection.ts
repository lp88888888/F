import request from '@/utils/request'

// 获得商品收藏分页
export function favoriteList(data: any) {
  return request({
    url: '/merchant/api/product/favorite/page',
    method: 'GET',
	params: data
  })
}
