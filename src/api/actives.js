import request from '@/utils/request'

// 秒杀列表
export function seckillList(data) {
    return request({
        url: '/pc/seckill/list',
        method: 'post',
        data
    })
}

// 秒杀列表删除
export function seckillIsDelete(params) {
    return request({
        url: '/pc/seckill/delete',
        method: 'get',
        params
    })
}

// 秒杀详情查询
export function seckillIsGetInfo(params) {
    return request({
        url: '/pc/seckill/getInfo',
        method: 'get',
        params
    })
}

// 秒杀上下架
export function seckillIsOn(params) {
    return request({
        url: '/pc/seckill/isOn',
        method: 'get',
        params
    })
}

// 秒杀添加
export function seckillAdd(data) {
    return request({
        url: '/pc/seckill/add',
        method: 'post',
        data
    })
}

// 秒杀编辑
export function seckillUpdate(data) {
    return request({
        url: '/pc/seckill/update',
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
// 添加拼团
export function assembleAdd(data) {
    return request({
        url: '/pc/assemble/add',
        method: 'post',
        data
    })
}

// 编辑拼团
export function assembleModify(data) {
    return request({
        url: '/pc/assemble/modify',
        method: 'post',
        data
    })
}

// 拼团列表删除
export function assembleDelete(params) {
    return request({
        url: '/pc/assemble/delete',
        method: 'get',
        params
    })
}

// 拼团列表上下架
export function assembleUpdown(params) {
    return request({
        url: '/pc/assemble/updown',
        method: 'get',
        params
    })
}



// 拼团详情
export function assembleDetails(params) {
    return request({
        url: '/pc/assemble/details',
        method: 'get',
        params
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