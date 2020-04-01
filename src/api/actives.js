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

// 分销删除
export function distributionDelete(params) {
    return request({
        url: '/pc/dist/delete',
        method: 'get',
        params
    })
}

// 分销添加
export function distributionAdd(data) {
    return request({
        url: '/pc/dist/add',
        method: 'post',
        data
    })
}
// 分销编辑
export function distributionModify(data) {
    return request({
        url: '/pc/dist/modify',
        method: 'post',
        data
    })
}

// 分销详情
export function distributionDetail(params) {
    return request({
        url: '/pc/dist/detail',
        method: 'get',
        params
    })
}

// 优惠劵列表
export function discountList(data) {
    return request({
        url: '/pc/coupon/list',
        method: 'post',
        data
    })
}

// 优惠劵添加
export function discountAdd(data) {
    return request({
        url: '/pc/coupon/add',
        method: 'post',
        data
    })
}

// 优惠劵编辑
export function discountUpdate(data) {
    return request({
        url: '/pc/coupon/update',
        method: 'post',
        data
    })
}

// 优惠劵删除
export function discountDelete(params) {
    return request({
        url: '/pc/coupon/delete',
        method: 'get',
        params
    })
}

// 优惠劵获取详情
export function discountGetInfo(params) {
    return request({
        url: '/pc/coupon/getInfo',
        method: 'get',
        params
    })
}

// 优惠劵上下架
export function discountIsOn(params) {
    return request({
        url: '/pc/coupon/isOn',
        method: 'get',
        params
    })
}

// 优惠劵修改顺序
export function discountOrder(params) {
    return request({
        url: '/pc/coupon/order',
        method: 'get',
        params
    })
}