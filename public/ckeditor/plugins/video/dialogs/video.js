CKEDITOR.dialog.add('videoDialog', function (editor) {
  var body = document.querySelector('body')
  bodyWidth = body.offsetWidth
  bodyHeight = body.offsetHeight

  return {
    title: '插入视频',
    minWidth: 400,
    minHeight: 200,
    contents: [{
      id: 'tab-basic-video',
      label: 'xiumi1',
      elements: [{
          type: 'text',
          id: 'videoAddress',
          label: '通用视频地址:'
        },
        {
          type: 'html',
          html: '<p style="color: #e6a23c">提示：支持 腾讯、优酷、爱奇艺视频，请复制视频分享中的 通用代码！</p><div style="margin-top: 10px;"><img src="http://img.haomai-mrm.com/plugin/1/567/2018/11/18327611-ddbc-4b55-923e-d27e1b7eb7e5.gif"/></div>',
        },
      ]
    }],
    // buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
    onOk: function () {
      console.log('ok')
      var text = this.getValueOf('tab-basic-video', 'videoAddress')
      var srcReg = /src=['"](.*?)["']/
      var dom = document.createElement('div')
      dom.innerHTML = text
      console.dir(text.match(srcReg))

      var src = text.match(srcReg)[1]
      src = src.replace('http://', 'https://')
      // var width = text.match(widthReg)[1]
      // var height = text.match(heightReg)[1]
      var root = (editor.editable ? editor.editable() : (editor.mode == 'wysiwyg' ? editor.document && editor.document.getBody() : editor.textarea));
      // 判断现在编辑器内容是否为空
      if (root.hasClass('placeholder')) {
        editor.setData('<iframe src="' + src + '" width="100%" height="220px"></iframe>')
      } else {
        editor.insertHtml('<iframe src="' + src + '" width="100%" height="220px"></iframe>')
      }
    },
    onLoad: function () {},
  }
})
