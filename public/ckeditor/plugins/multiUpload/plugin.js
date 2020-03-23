CKEDITOR.plugins.add('multiUpload', {
  icons: 'multiUpload',
  init: function (editor) {
    // cookie 操作方法
    var cookie = {
      set: function (key, val, time) { //设置cookie方法
        var date = new Date(); //获取当前时间
        var expiresDays = time; //将date设置为n天以后的时间
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
        document.cookie = key + "=" + val + ";expires=" + date.toGMTString(); //设置cookie
      },
      get: function (key) { //获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g, ""); //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";") //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips; //声明变量tips
        for (var i = 0; i < arrCookie.length; i++) { //使用for循环查找cookie中的tips变量
          var arr = arrCookie[i].split("="); //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
          if (key == arr[0]) { //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
            tips = arr[1]; //将cookie的值赋给变量tips
            break; //终止for循环遍历
          }
        }
        return tips;
      },
      delete: function (key) { //删除cookie方法
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime() - 10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" + date.toGMTString(); //设置cookie
      }
    }
    // Plugin logic goes here...
    var _file = document.getElementById('editorMultiUploadPick'); //获取页面中的file文件选择器对象
    /**
     * 初始化图片上传插件
     */
    var htmlElements = '';
    var uploader = new plupload.Uploader({
      runtimes: 'html5,flash,silverlight,html4',
      browse_button: 'editorMultiUploadPick', // you can pass an id...
      container: document.getElementById('editorMultiUploadContainer'), // ... or DOM Element itself
      url: editor.config.img_upload_url,
      flash_swf_url: '/static/plupload-2.3.6/js/Moxie.swf',
      silverlight_xap_url: '/static/plupload-2.3.6/js/Moxie.xap',
      filters: {
        max_file_size: '2mb',
        mime_types: [{
          title: "Image files",
          extensions: "jpg,gif,png,jpeg"
        }, ]
      },
      // file_data_name: 'contentImg',
      // multipart_params: {
      //   topic: 'articleImage',
      //   topicDetail: '文章图片'
      // },
      headers: {
        'Authorization': cookie.get('ruilan_token')
      },
      init: {
        FilesAdded: function (up, files) {
          if (files.length > 10) {
            showToast('error', '每次最多上传10张图片！')
            this.stop()
            for (var i = 0, filesLength = files.length; i < filesLength; i++) {
              up.removeFile(files[i])
            }
            // files.forEach((file) => {
            //   up.removeFile(file)
            // })
            return false
          }
          uploader.start();
          var loadingNode = document.createElement("div");
          loadingNode.id = 'editorLoading'
          loadingNode.style = 'position: fixed; top: 50%; left: 50%; width: 120px; height: 80px; margin: -40px 0 0 -60px; border-radius: 4px; background: rgba(0, 0, 0, .5); color: #fff; font-size: 14px; text-align:center; line-height: 80px; z-index: 200;'
          loadingNode.innerHTML = '正在上传图片...'
          document.body.appendChild(loadingNode)
          htmlElements = '';
        },
        FileUploaded: function (uploader, file, responseObject) {
          var res = JSON.parse(responseObject.response)
          if (res && res.data && res.data.length && res.data[0]) {
            showToast('success', '图片 ' + file.name + ' 上传成功')
            console.log('res---', res)
            htmlElements += "<img style='vertical-align: middle; max-width: 100%;' src='" + editor.config.img_base_url + res.data + "' />"
          }
          if (uploader.total.uploaded === uploader.files.length) {
            // var root = (editor.editable ? editor.editable() : (editor.mode == 'wysiwyg' ? editor.document && editor.document.getBody() : editor.textarea));
            // 判断现在编辑器内容是否为空
            editor.insertHtml(htmlElements)
            // if (root.hasClass('placeholder')) {
            //   editor.setData(htmlElements)
            // } else {
            //   editor.insertHtml(htmlElements)
            // }
          }
        },
        UploadComplete: function (uploader, files) {
          document.body.removeChild(document.getElementById('editorLoading'))
        },
        Error: function (up, err) {
          var errReason = ''
          if (err.code === -600) {
            errReason = '文件大小超过2mb'
          }
          showToast('error', '图片 ' + err.file.name + ' 上传失败。错误原因：' + errReason)

        }
      }
    });
    uploader.init();

    function showToast(type, text) {
      var toastId = 'toast-' + new Date().getTime()
      var options = {}
      var toastWrapper = document.getElementById('toast-wrapper')
      if (type === 'success') {
        options = {
          borderColor: '#e1f3d8',
          color: '#67c23a',
          bgColor: '#f0f9eb'
        }
      } else if (type === 'error') {
        options = {
          borderColor: '#fde2e2',
          color: '#f56c6c',
          bgColor: '#fef0f0'
        }
      }
      var toastHtml = '<div id="' + toastId + '" style="border: 1px solid ' + options.borderColor + '; width: 100%; margin-bottom: 10px; border-radius: 3px; padding:10px 20px; line-height: 28px; color: ' + options.color + '; background-color: ' + options.bgColor + '; font-size: 14px;">' + text + '</div>'
      if (!toastWrapper) {
        toastWrapper = document.createElement('div')
        toastWrapper.id = 'toast-wrapper'
        toastWrapper.style = 'width: 380px; position: fixed; top: 20px; left: 50%; margin-left: -190px; z-index: 100'
        document.body.appendChild(toastWrapper)
      }
      toastWrapper.innerHTML += toastHtml
      setTimeout(function () {
        var parent = document.getElementById('toast-wrapper')
        parent.removeChild(document.getElementById(toastId))
      }, 3000)
    }
    editor.addCommand('openFileComm', { //添加命令
      exec: function (editor) { //命令调用时执行此函数
        _file.click(); //触发文件选择器的点击事件
      },
      async: true
    });

    editor.ui.addButton('multiUpload', {
      label: '多图片上传',
      command: 'openFileComm',
      toolbar: 'insert'
    })
  }
});
