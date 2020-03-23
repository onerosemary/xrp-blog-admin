import {
  IMG_UPLOAD_URL,
  IMG_BASE_URL,
  // URL_UPLOAD_URL
} from '@/config'
const baseConfig = {
  language: 'zh-cn',
  toolbar: [
    ['multiUpload'],
    ['FontSize'],
    ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'TextColor', 'BGColor'],
    ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'NumberedList', 'BulletedList'],
    ['HorizontalRule']
  ],
  img_upload_url: IMG_UPLOAD_URL,
  img_base_url: IMG_BASE_URL,
  allowedContent: {
    $1: {
      attributes: true,
      styles: true,
      classes: true
    }
  },
  extraPlugins: 'multiUpload',
  imageResize: {
    maxWidth: 800,
    maxHeight: 800
  },
  resize_enabled: false,
  fontSize_defaultLabel: '16px'
}
const customConfig = {
  language: 'zh-cn',
  toolbar: [
    [
      'NewPage', '-', 'FontSize', 'lineheight', '-', 'Undo', 'Redo', '-', 'Link', 'Unlink', '-', 'Table', 'HorizontalRule', 'Smiley',
      'SpecialChar', '-'
    ],
    '/',
    [
      'Bold', 'Italic', 'Underline', 'Strike', 'NumberedList', 'BulletedList', 'textindent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-',
      'TextColor', 'BGColor'
    ],
    '/',
    [
      'multiUpload', 'video', 'xiumi'
    ]
  ],
  img_upload_url: IMG_UPLOAD_URL,
  // url_upload_url: URL_UPLOAD_URL,
  img_base_url: IMG_BASE_URL,
  allowedContent: {
    $1: {
      attributes: true,
      styles: true,
      classes: true
    }
  },
  extraPlugins: 'multiUpload, video, xiumi',
  imageResize: {
    maxWidth: 800,
    maxHeight: 800
  },
  resize_enabled: false,
  fontSize_defaultLabel: '16px'
}
// 开发环境增加源码
if (process.env.NODE_ENV === 'development') {
  customConfig.toolbar[0].unshift('Source')
}
export {
  baseConfig,
  customConfig
}
