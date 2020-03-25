<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">拼团设置</div>
      <p class="head-span-sub">{{queryId === -1 ? '添加拼团信息': '编辑拼团信息'}}</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="选择拼团商品" prop="name">
        <select-goods></select-goods>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" size="small" placeholder="请填写" />
      </el-form-item>
      
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { categoryAdd, categoryEditor, getCategoryInfo } from '@/api/shopping'
import selectGoods from '@/components/selectGoods'
export default {
  data() {
    const attachments = (rule, value, callback) => {
      if (this.form.attachments.length === 0) {
        callback(new Error('商品图片不可为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        attachments:[], // 分类图片
        imgUrl: '', // 分类图片（后端）
        name: '', // 分类名称
        order: 0 // 默认
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
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
      selectGoods
  },
  watch: {
    'form.attachments': {
      handler(value) {
        if(value.length > 0){
          // 校验 图片方法
          this.$refs.form.validateField('attachments')
        }
      },
      deep: true
    }
  },
  mounted() {
    if(parseInt(this.queryId) !== -1){ // 编辑
      this.getCategoryInfo()
    }
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return parseInt(this.$route.query.id)
    }
  },
  methods: {
    //  获取商品信息
    getCategoryInfo() {
      getCategoryInfo({id: this.queryId}).then(res => {
        const { name, imgUrl, sort  } = res.data
        this.form = {
            id: this.queryId,
            attachments:[{
                attachmentExt: 'image/png', // 回选文件格式, 不提交，仅供回选使用
                attachmentType: 0, // 回选文件类型
                attachmentUrl: imgUrl // 回选文件地址
            }], // 分类图片
            imgUrl, // 分类图片（后端）
            name, // 分类名称
            order: sort // 排序
        }
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if(this.form.attachments.length > 0){
            this.form.imgUrl = this.form.attachments[0].attachmentUrl
        }else {
            this.form.imgUrl = ''
        }
        if (valid) {
          if(parseInt(this.queryId) === -1){ // 添加
            categoryAdd(this.form).then(res => {
              this.$message({
                message: '商品分类新增成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/shopping/category'
            })
          }else { // 编辑
            this.form.id = this.queryId
            categoryEditor(this.form).then(res => {
              this.$message({
                message: '商品分类编辑成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/shopping/category'
            })
          }
          
        } else {
          console.log('error submit!!');
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
