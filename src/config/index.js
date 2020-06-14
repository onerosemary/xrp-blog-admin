import Vue from 'vue'

// dev是代理，需要转换下
// const devHosts = 'http://medicalbeauty.bx-cy.com'
// const hosts = process.env.NODE_ENV === 'development' ? devHosts : process.env.VUE_APP_BASE_API

// 地址写死先, 这个是sw上地址
// const imgUrl = 'http://localhost:4000/uploads/'
const imgUrl = 'http://xiangruiping.cn/uploads/'

// 编辑器图片 上传配置

// 图片的base url, 用于拼接后台给的图片
const IMG_BASE_URL = `${imgUrl}`

// 图片上传地址
const IMG_UPLOAD_URL = `${process.env.VUE_APP_BASE_API}/article/uploadfile`

Vue.prototype.imgUrl = imgUrl

export {
  IMG_BASE_URL,
  IMG_UPLOAD_URL
}
