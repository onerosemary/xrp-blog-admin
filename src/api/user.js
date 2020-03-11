import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/user/login',
    method: 'get',
    params
  })
}

export function getInfo() {
  return request({
    url: '/user/getLoginUserInfo',
    method: 'get'
  })
}
