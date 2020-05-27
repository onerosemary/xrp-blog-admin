import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取登录人信息
export function getInfo() {
  return request({
    url: '/user/current',
    method: 'get'
  })
}
