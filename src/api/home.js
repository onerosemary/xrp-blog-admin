
import request from '@/utils/request'

// 首页销售数据
export function getSaleData(params) {
  return request({
    url: '/pc/home/getSaleData',
    method: 'get',
    params
  })
}

// 数据汇总
export function getTotal(params) {
    return request({
      url: '/pc/home/getTotal',
      method: 'get',
      params
    })
}

// 待办清单
export function undolist(data) {
    return request({
      url: '/pc/home/undolist',
      method: 'post',
      data
    })
}

// 返佣审核
export function rakeVerify(params) {
    return request({
      url: '/pc/home/rakeVerify',
      method: 'get',
      params
    })
}

// 退款审核
export function refundVerify(params) {
    return request({
      url: '/pc/home/refundVerify',
      method: 'get',
      params
    })
}