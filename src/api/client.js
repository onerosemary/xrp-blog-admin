import request from '@/utils/request'

// 客户列表
export function clientList(data) {
    return request({
        url: '/pc/customer/list',
        method: 'post',
        data
    })
}

// 客户修改
export function clientUpdate(data) {
    return request({
        url: '/pc/customer/update',
        method: 'post',
        data
    })
}

// 清空所有客户积分
export function clientClearAllPoints(params) {
    return request({
        url: '/pc/customer/clearAllPoints',
        method: 'get',
        params
    })
}

// 清空积分
export function clientClearPoints(params) {
    return request({
        url: '/pc/customer/clearPoints',
        method: 'get',
        params
    })
}

// 删除
export function clientDeletet(params) {
    return request({
        url: '/pc/customer/deletet',
        method: 'get',
        params
    })
}

// 获取个人详情信息
export function clientGetInfoById(params) {
    return request({
        url: '/pc/customer/getInfoById',
        method: 'get',
        params
    })
}

// 查询某客户的追踪日志
export function clientLogList(data) {
    return request({
        url: '/pc/customer/logList',
        method: 'post',
        data
    })
}

// 新增日志某客户的追踪日志
export function clientLogAdd(data) {
    return request({
        url: '/pc/customer/add',
        method: 'post',
        data
    })
}

// 客户咨询 模块

// 获取发给客服消息的 客户列表
export function serviceList(data) {
    return request({
        url: '/pc/service/list',
        method: 'post',
        data
    })
}

// 获取某个客户发给客服的消息记录
export function serviceGetLogs(data) {
    return request({
        url: '/pc/service/getLogs',
        method: 'post',
        data
    })
}

// 客服设置 个人信息
export function chatSetGetInfo(params) {
    return request({
        url: '/pc/service/getInfo',
        method: 'get',
        params
    })
}

// 客服设置 添加
export function chatSetAdd(data) {
    return request({
        url: '/pc/service/add',
        method: 'post',
        data
    })
}

// 客服设置 编辑
export function chatSetUpdate(data) {
    return request({
        url: '/pc/service/update',
        method: 'post',
        data
    })
}