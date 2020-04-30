import request from '@/utils/request'

// 添加门店
export function addStore(data) {
    return request({
        url: '/pc/company/addStore',
        method: 'post',
        data
    })
}
// 门店开关
export function updown(params) {
    return request({
        url: '/pc/company/updown',
        method: 'get',
        params
    })
}

// 修改指定门店(超级管理员 去修改其它门店信息)
export function elseEditorStore(data) {
    return request({
        url: '/pc/company/modifyCompanyDetails',
        method: 'post',
        data
    })
}

// 查询指定门店(超级管理员，每个门店管理员登录后 去修改自己本地门店信息)
export function elseStoreDetail(params) {
    return request({
        url: '/pc/company/storeDetail',
        method: 'get',
        params
    })
}


// 修改本店门店(超级管理员，每个门店管理员登录后 去修改自己本地门店信息)
export function selfeditorStore(data) {
    return request({
        url: '/pc/company/modifyCurrentCompanyDetails',
        method: 'post',
        data
    })
}

// 查询本店门店(超级管理员，每个门店管理员登录后 去修改自己本地门店信息)
export function selfStoreDetail(params) {
    return request({
        url: '/pc/company/currentStoreDetail',
        method: 'get',
        params
    })
}

// 门店删除
export function deleteStore(params) {
    return request({
        url: '/pc/company/deleteStore',
        method: 'get',
        params
    })
}
