import request from '@/utils/request'


// 获取一级评论列表
export function commentList(params) {
  return request({
    url: '/post/all',
    method: 'get',
    params
  })
}

// 删除一级评论
export function commentDel(params) {
  return request({
    url: '/post/deleteId',
    method: 'get',
    params
  })
}
