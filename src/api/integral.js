import request from '@/utils/request'

// 添加积分商品
export function addIntegral(data) {
    return request({
        url: '/pc/points/add',
        method: 'post',
        data
    })
}

// 编辑积分商品
export function updateIntegral(data) {
    return request({
        url: '/pc/points/update',
        method: 'post',
        data
    })
}

// 积分商品详情信息
export function getInfoIntegral(params) {
    return request({
        url: '/pc/points/getGoodsInfo',
        method: 'get',
        params
    })
}

// 积分商品列表
export function listIntegral(data) {
    return request({
        url: '/pc/points/list',
        method: 'post',
        data
    })
}

// 积分商品上下架
export function isOnIntegral(params) {
    return request({
        url: '/pc/points/isOn',
        method: 'get',
        params
    })
}

// 积分商品删除
export function deleteIntegral(params) {
    return request({
        url: '/pc/points/delete',
        method: 'get',
        params
    })
}