import request from '@/utils/request'

// 商品列表
export function goodsList(data) {
  return request({
    url: '/pc/goods/list',
    method: 'post',
    data
  })
}

// 推荐首页
export function isNewIndex(params) {
  return request({
    url: '/pc/goods/isNew',
    method: 'get',
    params
  })
}

// 上下架
export function isOn(params) {
  return request({
    url: '/pc/goods/isOn',
    method: 'get',
    params
  })
}

// 删除商品
export function deleteGoods(params) {
  return request({
    url: '/pc/goods/delete',
    method: 'get',
    params
  })
}

// 商品添加
export function addGood(data) {
  return request({
    url: '/pc/goods/add',
    method: 'post',
    data
  })
}

// 获取id商品信息
export function getGoodsInfo(params) {
  return request({
    url: '/pc/goods/getGoodsInfo',
    method: 'get',
    params
  })
}

// 商品编辑
export function editorGood(data) {
  return request({
    url: '/pc/goods/update',
    method: 'post',
    data
  })
}

// 商品分类列表
export function categoryList(data) {
  return request({
    url: '/pc/classify/list',
    method: 'post',
    data
  })
}