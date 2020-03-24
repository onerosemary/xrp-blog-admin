<template>
    <div>
        <!-- 放大 -->
        <div v-show="currentZoomURI" class="zoom-in-bg" @click="zoomInClose"></div>
        <div v-show="currentZoomURI" class="zoom-in-show">
        <i class="el-icon-close" @click="zoomInClose"></i>
        <img v-if="isTypePic(zoomInType)" :src="currentZoomURI" />
        <video v-else :src="currentZoomURI" class="avatar video-avatar-zoom" controls="controls">您的浏览器不支持视频播放</video>
        </div>
        <el-upload
            class="upload-demo"
            :accept="format ? String(acceptImg) : String(acceptImgVideo)"
            :action="uploadUrl"
            :before-upload="beforeAvatarUpload"
            :on-progress="uploadProgress"
            :on-success="handleVideoSuccess"
            :show-file-list = false
            >
            <div v-if="fileList.length < amount" class="upload-file">
              <el-progress v-if="isShowPercent && imgIndex === -1" type="circle" :percentage="uploadPercent"></el-progress>
              <i v-else class="el-icon-plus"></i>
            </div>
            <div slot="tip" class="el-upload__tip">
              <span v-if="format">只能上传{{String(acceptImg)}}，且图片不超过2M</span>
              <span v-else>只能上传{{String(acceptImgVideo)}}文件，且图片不超过2M, 视频不超过20M</span>
            </div>
            <ul v-if="fileList.length > 0" class="upload-preview">
              <li v-for="(item, index) in fileList" :key="index">
                <el-progress v-if="isShowPercent && imgIndex === index" type="circle" :percentage="uploadPercent"></el-progress>
                <div class="cover" v-if="cover && index === 0">封面</div>
                <div class="layer-mask" @click="layerHandle($event)">
                  <i class="el-icon-edit" @click="editorUpload(index)"></i>
                  <i class="el-icon-zoom-in" @click.stop="zoomInUpload(index)"></i>
                  <i class="el-icon-delete" @click.stop="delUpload(index)"></i>
                </div>
                <div v-if="isTypePic(item)">
                    <img :src="imgUrl + item.response.data" width="100" height="100" />
                </div>
                <video v-else
                :src="imgUrl + item.response.data"
                class="avatar video-avatar"
                controls="controls">您的浏览器不支持视频播放</video> 
              </li>
            </ul>
          </el-upload>
    </div>
</template>
<script>
export default {
  data() {
    return {
      uploadUrl: `${process.env.VUE_APP_BASE_API}/pc/file/upload`,//你要上传视频到你后台的地址
      imgIndex: -1, // 放大/删除/编辑索引
      currentZoomURI: '', // 当前放大图片/视频
      zoomInType: '', // 当前放大类型（图片/视频）
      arrType: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'], // 图片类型聚焦管理
      uploadPercent: 0, // 上传加载进度
      isShowPercent: false, // 是否显示进度条
      acceptImgVideo: ['.mp4','.jpg', '.png', '.gif', '.jpeg'], // 识别上传图片和视频类型
      acceptImg: ['.jpg', '.png', '.gif', '.jpeg'], // 识别上传图片类型
      acceptVideo: ['video/mp4'], // 识别上传视频类型
      fileList: [],
      form: {
        name: '',
      },
      flag: true, // 编辑使用
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    queryId: { // 编辑回传id
      type: Number,
      default: () => 0
    },
    attachments: { // 编辑回传接受的数据
      type: Array,
      default: () => []
    },
    format: { // 默认支持视频与图片, 参数为img 为仅支持 图片格式
      type: String,
      default: () => ''
    },
    amount: { // 默认1， 可设置上传数
      type: Number,
      default: () => 1
    },
    cover: { // 默认不显示封面 标识
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    attachments: {
      handler(value){
        // 编辑
        if(this.queryId !== -1 && value && this.flag) {
          this.flag = false // 只执行一次
          // 组装下数据格式
          value.forEach(item => {
            this.fileList.push({
              raw: {
                type: item.attachmentExt
              },
              response: {
                data: item.attachmentUrl
              }
            })
          })
        }
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    // 上传进度条
    uploadProgress (event, file, fileList) {
      this.isShowPercent = true
      this.uploadPercent = Math.floor(event.loaded / event.total * 100)
    },
    // 校验
    beforeAvatarUpload(file) {
      let isOk = true
      const isVideo = this.acceptVideo.includes(file.type) // 是否支持的视频格式
      
      const isIMG = this.arrType.includes(file.type) // 是否支持的图片格式
      const isLt2M = file.size / 1024 / 1024 < 2 // 图片大小
      const isLt20M = file.size / 1024 / 1024 < 20 // 视频大小
      if(this.format === 'img') { // 仅支持图片
        if (isIMG) { // 图片
          if(!isLt2M){
            this.$message.error('上传图片大小不能超过 2MB!')
            isOk = false
          }
        }else {
          this.$message.error(`上传格式只支持 ${String(this.acceptImg)} 格式!`)
          isOk = false
        }
      }else { // 支持的多格式
        if (isIMG) { // 图片
          if(!isLt2M){
            this.$message.error('上传图片大小不能超过 2MB!')
            isOk = false
          }
        }else if(isVideo) { // 视频
          if(!isLt20M){
            this.$message.error('上传视频大小不能超过 20MB!')
            isOk = false
          }
        }else { // 其它格式
          this.$message.error(`上传格式只支持 ${String(this.acceptImgVideo)} 格式!`)
          isOk = false
        }
      }
      
      // 通过验证
      if(isOk){
        return true
      }else{
        return false
      }
    },
    // 组装后端需要的接口数据
    assembleData() {
      const newFileList = []
      if(this.fileList.length > 0) {
        this.fileList.forEach(item => {
          newFileList.push({
            attachmentExt: item.raw.type, // 附件扩展名
            attachmentType: item.raw.type.includes('image') ? 0 : 1, // 0:图片 1：视频
            attachmentUrl: item.response.data // 附件地址
          })
        })
      }
      // 发送给父级
      this.$emit('uploadSuccess', newFileList)
    },
    // 上传成功回调
    handleVideoSuccess(response, file, fileList) {
      if(this.imgIndex !== -1){ // 编辑
        this.fileList.splice(this.imgIndex,1,file)
        this.imgIndex = -1
      }else { // 添加
        this.fileList.push(file)
      }
      this.isShowPercent = false // 隐藏进度条
      this.uploadPercent = 0
      console.log('this.fileList---', this.fileList)
      // 传父级
      this.assembleData()
    },
    // 放大
    zoomInUpload(index) {
      const curr = this.fileList[index]
      this.zoomInType = curr
      this.currentZoomURI = this.imgUrl + curr.response.data
    },
    // 关闭
    zoomInClose() {
      this.currentZoomURI = ''
    },
    // 判断是否图片类型
    isTypePic(item) {
      if(!item) return
      return this.arrType.includes(item.raw.type.trim())
    },
    // 编辑图片/小视频
    editorUpload(index){
      this.imgIndex = parseInt(index)
    },
    // 删除点击的图片/小视频
    delUpload(index) {
      this.$confirm('删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fileList.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 传父级
        this.assembleData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })        
      })
    },
    // 阻止点击layer层
    layerHandle(e) {
      const event = e || window.event
      const target = event.target || event.srcElement
      if(target.className === 'layer-mask') {
        // 阻止冒泡
        window.event ? window.event.cancelBubble = true : event.stopPropagation()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
    .video-avatar {
      display: block;
      width: 100px;
      height: 100px;
    }
    .video-avatar-zoom{
       width: 700px;
       height: 500px;
    }
    /deep/.el-upload--picture-card{
      width: 100px;
      height: 100px;
      vertical-align: top;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /deep/.el-upload-list--picture-card .el-upload-list__item{
      width: 100px;
      height: 100px;
    }
    .upload-file{
      float: left;
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      vertical-align: top;
      i{
        font-size: 28px;
        color: #8c939d;
      }
    }
    /deep/.el-upload{
      clear: both;
    }
    .zoom-in-bg{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: .5;
      background: #000;
      z-index: 1000;
    }
    .zoom-in-show{
      position: fixed;
      width: 700px;
      height: 500px;
      background: #fff;
      z-index: 1001;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      .el-icon-close{
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
        display: inline-block;
        color: #909399;
        cursor: pointer;
        z-index: 1;
      }
      img{
        max-width: 500px;
      }
    }
    .upload-preview{
      display: flex;
      margin: 0;
      padding: 0;
      li{
        position: relative;
        margin: 0 5px;
        list-style: none;
        height: 100px;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        overflow: hidden;
        .cover{
          background: #29BEC6;
          color: #fff;
          font-size: 10px;
          position: absolute;
          top: 4px;
          right: -14px;
          width: 60px;
          transform: rotate(30deg);
        }
        .layer-mask{
          // display: flex;
          display: none;
          align-items: center;
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;
          height: 100px;
          text-align: center;
          color: #fff;
          font-size: 16px;
          background-color: rgba(0,0,0,.5);
          transition: opacity .3s;
          z-index: 1;
          i{
            flex: 1;
          }
        }
        &:hover{
          .layer-mask{
            display: flex;
          }
        }
      }
    }
    /deep/.el-progress{
      margin-top: 0!important;
      position: absolute;
      left: 0;
      top: 0;
      width: 100px;
      height: 100px;
    }
    /deep/.el-progress-circle{
      height: 100px!important;
      width: 100px!important;
    }
</style>
