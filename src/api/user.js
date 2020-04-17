import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/pc/user/login',
    method: 'get',
    params
  })
}

// 获取登录人信息
export function getInfo() {
  return request({
    url: '/pc/user/getLoginUserInfo',
    method: 'get'
  })
}

// 修改登录人密码
export function updatePwd(params) {
  return request({
    url: '/pc/user/updatePwd',
    method: 'get',
    params
  })
}
