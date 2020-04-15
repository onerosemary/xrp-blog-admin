<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">banner</div>
      <p class="head-span-sub">{{queryId === -1 ? '添加banner': '编辑banner'}}</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="轮播图 (尺寸 700x300)" prop="attachments" class="upload-item">
        <upload class="slideshow" :queryId="queryId" :attachments="form.attachments" @uploadSuccess="uploadSuccess" format="img" :amount="1"></upload>
      </el-form-item>
      <el-form-item label="类型" prop="bannerType">
          <el-select v-model="form.bannerType" placeholder="请选择" class="handle-select mr10" size="small">
            <el-option label="商品" :value="1" />
            <el-option label="优惠券" :value="2" />
            <el-option label="外链" :value="0" />
          </el-select>
      </el-form-item>
      <el-form-item 
        v-if="parseInt(form.bannerType) === 1"
        label="选择商品" 
        :prop="parseInt(form.bannerType) === 1 ? 'businessId' : ''"
        :rules = "[{ required: true, message: '不能为空', trigger: 'change' }]"
        >
            <select-goods class="good-c" :cover="goodsCover" @change="changeGood"></select-goods>
      </el-form-item>
      <el-form-item v-if="parseInt(form.bannerType) === 0" label="外链地址" 
      :prop="parseInt(form.bannerType) === 0 ? 'bannerUrl' : ''"
      :rules = "[{ required: true, message: '不能为空', trigger: 'blur' }]">
          <el-input v-model="form.bannerUrl" size="small" placeholder="请填写" />
      </el-form-item>
      
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import selectGoods from '@/components/selectGoods'
import upload from '@/components/upload'
import { bannerAdd, bannerUpdate, bannerGetInfo } from '@/api/homepage'
export default {
  data() {
    const attachments = (rule, value, callback) => {
      if (this.form.attachments.length === 0) {
        callback(new Error('轮播图不可为空'))
      } else {
        callback()
      }
    }
    return {
      selectOne: null, // 选中的商品
      goodsCover: '', // 选中商品封面(编辑)
      form: {
        btype: 0, // 0: banner 1：活动
        attachments:[], // 分类图片
        cover: '', // 分类图片（后端）
        bannerType: '', // 类型
        businessId: '', // 商品id
        bannerUrl: ''
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
        bannerType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    upload,
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
      this.bannerGetInfo()
    }
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return parseInt(this.$route.query.id)
    }
  },
  methods: {
    //  获取选中商品详情
    changeGood(data) {
      this.selectOne = data // 赋值
      this.form.businessId = data.id
      // 校验
      this.$refs.form.validateField('businessId')
      
    },
    //  获取商品信息
    bannerGetInfo() {
      bannerGetInfo({id: this.queryId}).then(res => {
        const {id, bannerType, cover, bannerUrl, businessId, goodsCover  } = res.data

        this.form = {
            id,
            btype: 0, // 0: banner 1：活动
            attachments:[{
                attachmentExt: 'image/png', // 回选文件格式, 不提交，仅供回选使用
                attachmentType: 0, // 回选文件类型
                attachmentUrl: cover // 回选文件地址
            }], // 分类图片
            cover, // 轮播图（后端）
            bannerType, // 类型
            bannerUrl, // url
            businessId // 商品id
        }
        setTimeout(() => {
            this.goodsCover = this.imgUrl + goodsCover // 商品封面
        }, 500)
      })
    },
    // 商品图片
    uploadSuccess(list){
      console.log('list', list)
      this.form.attachments = list
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if(this.form.attachments.length > 0){
            this.form.cover = this.form.attachments[0].attachmentUrl
        }else {
            this.form.cover = ''
        }

        //  类型
        if(parseInt(this.form.bannerType) === 1) { // 选择商品
            this.form.bannerUrl = '' // 外链清空
        }else if(parseInt(this.form.bannerType) === 0) {
            this.form.businessId = '' // 商品清空
        }else {
            this.form.bannerUrl = '' // 外链清空
            this.form.businessId = '' // 商品清空
        }

        if (valid) {
          if(parseInt(this.queryId) === -1){ // 添加
            bannerAdd(this.form).then(res => {
              this.$message({
                message: 'banner新增成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/homepage/banner'
            })
          }else { // 编辑
            this.form.id = this.queryId
            bannerUpdate(this.form).then(res => {
              this.$message({
                message: 'banner编辑成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/homepage/banner'
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
    /deep/.slideshow{
        .upload-file{
            width: 300px;
        }
        .layer-mask{
            width: 300px!important;
        }
        div {
            img{
                width: 300px;
            }
        }
    }
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
