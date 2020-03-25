import request from '@/utils/request'

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


// 商品分类添加
export function categoryAdd(data) {
  return request({
    url: '/pc/classify/add',
    method: 'post',
    data
  })
}

// 商品分类编辑
export function categoryEditor(data) {
  return request({
    url: '/pc/classify/update',
    method: 'post',
    data
  })
}

// 商品分类删除
export function categorydelete(params) {
  return request({
    url: '/pc/classify/delete',
    method: 'get',
    params
  })
}

// 获取id商品分类信息
export function getCategoryInfo(params) {
  return request({
    url: '/pc/classify/detail',
    method: 'get',
    params
  })
}

// 商品分类排序
export function categoryOrder(data) {
  return request({
    url: '/pc/classify/order',
    method: 'post',
    data
  })
}

// 订单列表
export function orderList(data) {
  return request({
    url: '/pc/order/list',
    method: 'post',
    data
  })
}


// 订单详情
export function orderDetail(params) {
  return request({
    url: '/pc/order/detail',
    method: 'get',
    params
  })
}

// 订单发货添加
export function orderSend(data) {
  return request({
    url: '/pc/order/deliver',
    method: 'post',
    data
  })
}

// 订单删除
export function orderDelete(params) {
  return request({
    url: '/pc/order/delete',
    method: 'get',
    params
  })
}

// 订单 关联分销
export function buildRake(data) {
  return request({
    url: '/pc/rake/buildRake',
    method: 'post',
    data
  })
}
