<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">{{ queryId === -1 ? '文章添加': '文章编辑' }}</div>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="文章图片"  class="upload-item">
        <upload :query-id="queryId"  :attachments="form.attachments" :amount="1" format="img" :cover="true" @uploadSuccess="uploadSuccess" />
      </el-form-item>
      <el-form-item label="文章名称" prop="title">
        <el-input v-model="form.title" size="small" placeholder="请填写" maxlength="32" show-word-limit />
      </el-form-item>
      <el-form-item label="文章摘要" prop="sub">
        <el-input v-model="form.sub" size="small" placeholder="请填写" maxlength="32" show-word-limit />
      </el-form-item>
     <div class="delivery-type">
        <el-form-item label="文章分类" prop="type">
          <article-type :cid="form.type" @change="articleTypeChange" />
        </el-form-item>
        <el-form-item label="浏览量" prop="looks">
          <el-input v-model="form.looks" size="small" placeholder="请填写" />
        </el-form-item>
      </div>
      <el-form-item label="详情介绍" class="detail-msg" prop="content">
        <editor
          ref="editor"
          v-model="form.content"
          :receive-config="editorConfig"
          class="editor"
          @blur="blur"
        />
      </el-form-item>
      
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import articleType from '@/components/articleType'
import upload from '@/components/upload'
import editor from '@/components/Editor'
import { articleAdd, getInfo, articleUpdate } from '@/api/article'
export default {
  components: {
    upload,
    articleType,
    editor
  },
  data() {
    const attachments = (rule, value, callback) => {
      if (this.form.attachments.length === 0) {
        callback(new Error('文章图片不可为空'))
      } else {
        callback()
      }
    }
    const content = (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    return {
      // editor
      editorConfig: {
        // height: 600,
        autoGrow_maxHeight: 300
      },
      form: {
        attachments: [], // 分类图片
        cover: '', // 文章封面
        title: '', // 文章名称
        sub: '',
        // cid: null, // 文章分类
        type: '',
        looks: 0, // 取货方式
        content: '', // 编辑器
        author: 'xrp'
      },
      rules: {
        attachments: [
          {
            type: 'array',
            required: true,
            validator: attachments,
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, validator: content, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return this.$route.query.id
    }
  },
  watch: {
    'form.attachments': {
      handler(value) {
        if (value.length > 0) {
          // 校验 图片方法
          this.$refs.form.validateField('attachments')
        }
      },
      deep: true
    }
  },
  mounted() {
    if (parseInt(this.queryId) !== -1) { // 编辑
      this.getArticleInfo()
    }
  },
  methods: {
    // 获取选择分类
    articleTypeChange(id) {
      this.form.type= id
    },
    //  获取文章信息
    getArticleInfo() {
      getInfo({ id: this.queryId }).then(res => {
        const { data } = res
        // 赋值

        this.form = {
          attachments: [{
            attachmentExt: 'image/png', // 回选文件格式, 不提交，仅供回选使用
            attachmentType: 0, // 回选文件类型
            attachmentUrl: data.cover // 回选文件地址
          }], // 分类图片
          cover: data.cover, // 文章封面
          title: data.title, // 文章名称
          sub: data.sub,
          type: data.type,
          looks: data.looks, // 取货方式
          content: data.content, // 编辑器
          author: data.author
        }
      })
    },
    blur() { // 校验编辑器内容
      this.$refs.form.validateField('content')
    },
    // 获取选择分类
    goodsTypeChange(id) {
      this.form.cid = id
    },
    // 文章图片
    uploadSuccess(list) {
      console.log('list', list)
      if(list.length > 0) {
        this.form.cover = list[0].attachmentUrl.filename
        console.log('this.form.cover', this.form.cover)
      }
      
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.type = String(this.form.type)
          this.form.looks = parseInt(this.form.looks)
          if (parseInt(this.queryId) === -1) { // 添加
            articleAdd(this.form).then(res => {
              this.$message({
                message: '文章添加成功',
                type: 'success'
              })
            })
            // this.$router.push({
            //   path: '/shopping/product'
            // })
            this.$router.go(-1)
          } else { // 编辑
            this.form.id = this.queryId
            articleUpdate(this.form).then(res => {
              this.$message({
                message: '文章编辑成功',
                type: 'success'
              })
            })
            // this.$router.push({
            //   path: '/shopping/product'
            // })
            this.$router.go(-1)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .body-span{
      width: 707px;
      padding-top: 15px;
      .specification{
        display: flex;
        /deep/.g1{
          margin-bottom: 22px;
        }
        /deep/.g2{
          width: 100px;
          margin-right: 20px;
          margin-bottom: 22px;
          .el-form-item__content{
            width: 100px;
          }
          /deep/ .el-input__inner{
            width: 100px;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
          }
        }
      }

      .el-form-item{
          margin-bottom: 0;
      }
      .upload-item{
        /deep/.el-form-item__content{
          line-height: inherit;
          margin-bottom: 10px;
          .el-upload__tip{
            color: #ADB1B5;
          }
        }
      }
      .dyLable {
        /deep/ .el-form-item__label{
          padding-right: 10px;
        }
        /deep/ .el-input__inner{
          width: 100px;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
        }
      }
      /deep/.el-form-item__content{
        display: flex
      }
      /deep/.dyInput {
        width: 100px;
        margin-right: 20px;
        .el-input__inner{
          width: 100px;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
        }
      }
      /deep/.guige{
        width: 250px;
        .el-input__inner{
          width: 250px;
        }
      }
      /deep/ .el-select .el-input__inner{
        // border-radius: 0;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
      }
      /deep/ .form-item-header{
        color: #ADB1B5;
        margin-bottom: 0;
        height: 30px;
        line-height: 30px;
        div{
          font-size: 12px;
        }
        .f-i-h{
          margin-right: 130px;
        }
      }
      /deep/.add-form-item{
        margin-bottom: 0;
        .add-new-input{
          width: 100%;
          line-height: 18px;
          text-align: right;
          font-size: 12px;
          color: #29BEC6;
          padding-right: 97px;
          span{
            cursor: pointer;
          }
        }
      }

      .sort-del{
        width: 150px;
        height: 30px;
        line-height: 30px;
        margin-top: 7px;
        color: #333;
        .jt-bottom{
          transform: rotate(-180deg);
          display: inline-block;
        }
        .el-icon-close{
          color: #FF3F1D;
        }
        span{
          cursor: pointer;
          text-align: center;
          font-size: 16px;
          margin: 0 2px;
          font-weight: bold;
        }
        .el-icon-top{
          color: #9EA1A9;
        }
      }
      .title{
        line-height: 30px;
        margin-top: 10px;
        font-size: 14px;
        color: #ADB1B5;
        span{
          font-size: 12px;
          display: inline-block;
          width: 100px;
          margin-right: 20px;
        }
        .first{
          width: 250px;
        }
      }
      .goods-type{
        display: flex;
      }
      .delivery-type{
        display: flex;
        margin-right: 20px;
        /deep/.el-radio-group{
          margin-top: 12px;
          margin-right: 20px;
        }
        /deep/.el-radio__label{
          font-size: 12px;
        }
      }
      .detail-msg{
        margin: 10px 0;
        /deep/ .el-form-item__content{
          display: block;
        }
        .custom__error{
          color: #F56C6C;
          font-size: 12px;
          line-height: 1;
          padding-top: 4px;
          position: absolute;
          top: 100%;
          left: 0;
        }
      }
    }
</style>
