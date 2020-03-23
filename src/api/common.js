// 全局公用接口

import request from '@/utils/request'

// 商品分类
export function goodsTypeList(params) {
    return request({
      url: '/pc/classify/list',
      method: 'get',
      params
    })
  }
  