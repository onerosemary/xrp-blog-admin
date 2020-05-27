import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import { Message } from 'element-ui'
// import store from '@/store'
import { getToken } from '@/utils/auth'
import { parseTime } from '@/utils/index'

// 导出接口集合
const exportApis = ['/standardStatistics/exportData']

// 导出下载文件方法
function downloadfile(res) {
  console.log(JSON.stringify(res.headers))
  console.log('---res.data--', res.data)
  const blob = new Blob([res.data], { type: 'application/vnd.ms-excel,charset=utf-8' })
  const filename = res.headers['content-disposition']
    ? res.headers['content-disposition'].split('filename=')[1]
    : parseTime(new Date(), '{yyyy}{mm}{dd}') + '.xlsx'
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename)
  } else {
    const downloadElement = document.createElement('a')
    const href = window.URL.createObjectURL(blob) // 创建下载的链接
    downloadElement.style.display = 'none'
    downloadElement.href = href
    downloadElement.download = filename // 下载后文件名
    document.body.appendChild(downloadElement)
    downloadElement.click() // 点击下载
    document.body.removeChild(downloadElement) // 下载完成移除元素
    window.URL.revokeObjectURL(href) // 释放掉blob对象
  }
}

// create an axios instance
axios.defaults.withCredentials = false
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (exportApis.includes(config.url)) {
      config['responseType'] = 'blob' // 导出接口 请求头必须设置，否则乱码
    }
    if (getToken()) {
      config.headers['Authorization'] = `${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // 如果 content-type = x-download 导出文件
    if (
      response.headers['content-type'] ===
      'application/x-download;charset=utf-8'
    ) {
      downloadfile(response)
      return
    }
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
