import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/pc/user/login',
    method: 'get',
    params
  })
}

export function getInfo() {
  return request({
    url: '/pc/user/getLoginUserInfo',
    method: 'get'
  })
}

