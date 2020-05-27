import request from '@/utils/request'

// 图片上传接口
// export function uploadfile(data) {
//   return request({
//     url: '/article/uploadfile',
//     method: 'post',
//     data
//   })
// }


// 文章添加
export function articleAdd(data) {
  return request({
    url: '/article/add',
    method: 'post',
    data
  })
}

// 文章编辑
export function articleUpdate(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

// 文章详情查询
export function getInfo(params) {
  return request({
    url: '/article/detail',
    method: 'get',
    params
  })
}

// 文章列表
export function articleList(data) {
  return request({
    url: '/article/list',
    method: 'post',
    data
  })
}

// 文章推荐首页
export function isNew(params) {
  return request({
    url: '/article/isNew',
    method: 'get',
    params
  })
}


// 文章分类
export function articleType(params) {
  return request({
    url: '/article/type',
    method: 'get',
    params
  })
}

// 根据id删除文章
export function articleDel(params) {
  return request({
    url: '/article/del',
    method: 'get',
    params
  })
}
