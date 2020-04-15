
import request from '@/utils/request'
// APP 首页设置


// banner 列表
export function bannerList(data) {
  return request({
    url: '/pc/banner/list',
    method: 'post',
    data
  })
}

// banner 添加
export function bannerAdd(data) {
    return request({
        url: '/pc/banner/add',
        method: 'post',
        data
    })
}

// banner 修改
export function bannerUpdate(data) {
    return request({
        url: '/pc/banner/update',
        method: 'post',
        data
    })
}

// banner 获取banner信息
export function bannerGetInfo(params) {
    return request({
        url: '/pc/banner/getInfo',
        method: 'get',
        params
    })
}

// banner 删除
export function bannerDelete(params) {
    return request({
        url: '/pc/banner/delete',
        method: 'get',
        params
    })
}

// banner 修改顺序
export function bannerOrder(params) {
    return request({
        url: '/pc/banner/order',
        method: 'get',
        params
    })
}

// banner 获取弹框活动信息
export function bannerGetActInfo(params) {
    return request({
        url: '/pc/banner/getActInfo',
        method: 'get',
        params
    })
}