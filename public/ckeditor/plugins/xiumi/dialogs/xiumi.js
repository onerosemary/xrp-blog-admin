CKEDITOR.dialog.add('xiumiDialog', function (editor) {
  var body = document.querySelector('body')
  bodyWidth = body.offsetWidth
  bodyHeight = body.offsetHeight

  function mapDom(root, fn) {
    if (fn) fn(root)
    if (root.childNodes.length > 0) {
      Array.prototype.forEach.call(root.childNodes, function (child) {
        mapDom(child, fn)
      })
    }
  }
  var urlReg = /url\("(.*)"\)/
  var trigger = false

  function getSrc(html) {
    var srcArr = []
    var dom = document.createElement('div')
    dom.innerHTML = html
    mapDom(dom, function (el) {
      if (el.style && el.style.backgroundImage && el.style.backgroundImage.match(urlReg)) srcArr.push(el.style.backgroundImage.match(urlReg)[1])
      if (el.tagName === 'IMG') {
        srcArr.push(el.src)
      }
    })
    return srcArr
  }

  function setSrc(html, codeList) {
    var srcArr = getSrc(html)
    for (var i = 0, length = srcArr.length; i < length; i++) {
      html = html.replace(srcArr[i], editor.config.img_base_url + codeList[i])
    }
    return html
  }
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
  // ajax 方法
  var ajax = (function () {
    function createXMLHttpRequest() {
      // In IE, using the native XMLHttpRequest for local files may throw
      // "Access is Denied" errors.
      if (!CKEDITOR.env.ie || location.protocol != 'file:') {
        try {
          return new XMLHttpRequest();
        } catch (e) {}
      }

      try {
        return new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {}
      try {
        return new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {}

      return null;
    }

    function checkStatus(xhr) {
      // HTTP Status Codes:
      //	 2xx : Success
      //	 304 : Not Modified
      //	   0 : Returned when running locally (file://)
      //	1223 : IE may change 204 to 1223 (see http://dev.jquery.com/ticket/1450)

      return (xhr.readyState == 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status === 0 || xhr.status == 1223));
    }

    function getResponseText(xhr) {
      if (checkStatus(xhr))
        return xhr.responseText;
      return null;
    }

    function post(url, data, contentType, callback, getResponseFn) {
      var xhr = createXMLHttpRequest();

      if (!xhr)
        return null;

      xhr.open('POST', url, true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (callback) {
            callback(getResponseFn(xhr));
          }
          xhr = null;
        }
      };

      // xhr.setRequestHeader('Content-type', contentType || 'application/json; charset=UTF-8');
      xhr.setRequestHeader('Authorization', cookie.get('token'));

      xhr.send(data);
    }

    return {

      /**
       * Creates an asynchronous POST `XMLHttpRequest` of the given `url`, `data` and optional `contentType`.
       * Once the request is done, regardless if it is successful or not, the `callback` is called
       * with `XMLHttpRequest#responseText` or `null` as an argument.
       *
       *		CKEDITOR.ajax.post( 'url/post.php', 'foo=bar', null, function( data ) {
       *			console.log( data );
       *		} );
       *
       *		CKEDITOR.ajax.post( 'url/post.php', JSON.stringify( { foo: 'bar' } ), 'application/json', function( data ) {
       *			console.log( data );
       *		} );
       *
       * @since 4.4.0
       * @param {String} url The URL of the request.
       * @param {String/Object/Array} data Data passed to `XMLHttpRequest#send`.
       * @param {String} [contentType='application/x-www-form-urlencoded; charset=UTF-8'] The value of the `Content-type` header.
       * @param {Function} [callback] A callback executed asynchronously with `XMLHttpRequest#responseText` or `null` as an argument,
       * depending on the `status` of the request.
       */
      post: function (url, data, contentType, callback) {
        return post(url, data, contentType, callback, getResponseText);
      }
    };
  })()
  return {
    title: '秀米编辑',
    minWidth: bodyWidth - 60,
    minHeight: bodyHeight - 100,
    contents: [{
      id: 'tab-basic',
      label: 'xiumi1',
      elements: [{
        type: 'html',
        html: '<iframe id="xiumi" src="https://xiumi.us/studio/v5#/paper" style="width: 100%; height:' + (bodyHeight - 100) + 'px"></iframe>'
      }]
    }],
    buttons: [],
    onShow: function () {
      var xiumi = document.getElementById('xiumi');
      var parent = xiumi.parentNode
      // 刷新页面
      parent.removeChild(xiumi)
      parent.appendChild(xiumi)
    },
    onLoad: function () {
      var xiumi = document.getElementById('xiumi');
      var xiumi_url = "https://xiumi.us";
      var _this = this
      xiumi.onload = function () {
        console.log('load');
        console.log("postMessage");
        xiumi.contentWindow.postMessage('ready', xiumi_url);
      };
      window.addEventListener('message', function (event) {
        if (event.origin == xiumi_url && typeof event.data === 'string') {
          // 把 HTML 中的 src 进行替换
          if (trigger) return
          trigger = true
          // var srcArr = getSrc(event.data).join(',')
          var formDate = new FormData()
          var srcArr = getSrc(event.data)
          formDate.append('imgURL', srcArr)
          formDate.append('targetFolderPath', 'xiumi')
          formDate.append('suffix', '.png')
          // var data = {
          //   imgURL: srcArr,
          //   targetFolderPath: 'xiumi',
          //   suffix: '.png'
          // }
          ajax.post(editor.config.url_upload_url, formDate, '', function (res) {
            res = JSON.parse(res)
            if (res.code === 'HMPB0001') {
              editor.insertHtml(setSrc(event.data, res.data))
              _this.hide()
              trigger = false
            }
          })
        }
      }, false);
    },
  }
})
