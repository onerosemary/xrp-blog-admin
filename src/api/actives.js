import request from '@/utils/request'

// 秒杀列表
export function seckillList(data) {
    return request({
        url: '/pc/seckill/list',
        method: 'post',
        data
    })
}