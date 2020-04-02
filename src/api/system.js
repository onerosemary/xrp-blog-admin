import request from '@/utils/request'

// 用户列表
export function list(data) {
    return request({
        url: '/pc/user/list',
        method: 'post',
        data
    })
}

// 用户添加
export function add(data) {
    return request({
        url: '/pc/user/add',
        method: 'post',
        data
    })
}

// 用户编辑
export function modify(data) {
    return request({
        url: '/pc/user/modify',
        method: 'post',
        data
    })
}

// 用户删除
export function delete1(params) {
    return request({
        url: '/pc/user/delete',
        method: 'get',
        params
    })
}

// 用户详情
export function getUserInfo(params) {
    return request({
        url: '/pc/user/getUserInfoById',
        method: 'get',
        params
    })
}