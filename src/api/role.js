import request from '@/utils/request'

// 角色列表
export function list(data) {
    return request({
        url: '/pc/role/list',
        method: 'post',
        data
    })
}

// 角色添加
export function add(data) {
    return request({
        url: '/pc/role/add',
        method: 'post',
        data
    })
}

// 角色编辑
export function modify(data) {
    return request({
        url: '/pc/role/modifyRoleResource',
        method: 'post',
        data
    })
}

// 角色删除
export function delete1(params) {
    return request({
        url: '/pc/role/delete',
        method: 'get',
        params
    })
}

// 角色详情
export function getDetail(params) {
    return request({
        url: '/pc/role/getDetail',
        method: 'get',
        params
    })
}