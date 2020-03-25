// 全局公用接口
import request from '@/utils/request'

// 商品列表
export function goodsList(data) {
  return request({
    url: '/pc/goods/list',
    method: 'post',
    data
  })
}

// 商品分类
export function goodsTypeList(data) {
    return request({
      url: '/pc/classify/list',
      method: 'post',
      data
    })
  }
  
// 门店列表
export function storeList(data) {
  return request({
    url: '/pc/company/list',
    method: 'post',
    data
  })
}
