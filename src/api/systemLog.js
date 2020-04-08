import request from '@/utils/request'

// 年
export function yearOperate(data) {
    return request({
        url: '/pc/operate/year',
        method: 'post',
        data
    })
}

// 月
export function monthOperate(data) {
    return request({
        url: '/pc/operate/month',
        method: 'post',
        data
    })
}

// 日
export function dayOperate(data) {
    return request({
        url: '/pc/operate/day',
        method: 'post',
        data
    })
}