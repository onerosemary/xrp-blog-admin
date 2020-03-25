import request from '@/utils/request'

// 秒杀列表
export function seckillList(data) {
    return request({
        url: '/pc/seckill/list',
        method: 'post',
        data
    })
}

//拼团列表
export function assembleList(data) {
    return request({
        url: '/pc/assemble/list',
        method: 'post',
        data
    })
}

//分销列表
export function distributionList(data) {
    return request({
        url: '/pc/dist/list',
        method: 'post',
        data
    })
}

// 分销上下架
export function distributionUpdown(params) {
    return request({
        url: '/pc/dist/updown',
        method: 'get',
        params
    })
}
