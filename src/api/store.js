import request from '@/utils/request'

// 列表
export function list(data) {
  return request({
    url: '/pc/company/list',
    method: 'post',
    data
  })
}
