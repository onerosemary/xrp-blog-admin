<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">{{queryId === -1 ? '积分商品添加': '积分商品编辑'}}</div>
      <!-- <p class="head-span-sub">如商品无折扣，价格栏只填写现价即可。</p> -->
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="积分商品图片" prop="attachments" class="upload-item">
        <upload :queryId="queryId" :attachments="form.attachments" @uploadSuccess="uploadSuccess" :amount="5" :cover="true"></upload>
      </el-form-item>
      <el-form-item label="积分商品名称" prop="title">
          <el-input v-model="form.title" size="small" placeholder="请填写" />
      </el-form-item>      
      <div class="goods-type">
        <el-form-item label="兑换积分" 
        prop="goodsPropertys[0].points"
        >
            <el-input v-model="form.goodsPropertys[0].points" size="small" placeholder="请填写" />
        </el-form-item>
        <el-form-item 
          label="库存数量" 
          prop="goodsPropertys[0].stock"
        >
            <el-input v-model="form.goodsPropertys[0].stock" size="small" placeholder="请填写" />
        </el-form-item>
        <el-form-item label="限购" prop="purchaseLimit">
            <el-input v-model="form.purchaseLimit" size="small" placeholder="请填写" />
        </el-form-item>
        <el-form-item label="销量(注水)" prop="virtualSalesVolume">
            <el-input v-model="form.virtualSalesVolume" size="small" placeholder="请填写" />
        </el-form-item>
      </div>
      <el-form-item label="详情介绍" class="detail-msg" prop="contents">
        <editor
          ref="editor"
          v-model="form.contents"
          :receive-config="editorConfig"
          class="editor"
          @blur="blur"
        ></editor>
      </el-form-item>
      <div class="delivery-type">
        <el-form-item label="取货方式" prop="deliveryType">
            <el-radio-group v-model="form.deliveryType">
              <el-radio label="0">门店自提</el-radio>
              <el-radio label="1">快递到家</el-radio>
            </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import upload from '@/components/upload'
import editor from '@/components/Editor'
import { addIntegral, updateIntegral, getInfoIntegral } from '@/api/integral'
export default {
  data() {
    const attachments = (rule, value, callback) => {
      if (this.form.attachments.length === 0) {
        callback(new Error('积分商品图片不可为空'))
      } else {
        callback()
      }
    }
    const contents = (rule, value, callback) => {
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
        attachments: [], // 商品图片
        cover: '', // 商品封面
        title: '', // 商品名称
        purchaseLimit: '', // 商品限购
        virtualSalesVolume: '', // 销量(注水)
        contents: '', // 编辑器
        deliveryType: '', // 取货方式
        goodsPropertys: [{ // 商品类型
          name: '', // 取title
          points: '', // 兑换积分
          stock: '', // 库存数量
        }]
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
        virtualSalesVolume: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        contents: [
          { required: true, validator: contents, trigger: 'blur' }
        ],
        deliveryType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        'goodsPropertys[0].points': [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        'goodsPropertys[0].stock': [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        purchaseLimit: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    upload,
    editor
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
      this.getInfoIntegral()
    }
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return parseInt(this.$route.query.id)
    }
  },
  methods: {
    //  获取积分商品信息
    getInfoIntegral() {
      getInfoIntegral({id: this.queryId}).then(res => {
        const { data } = res
        this.form = {
          id: this.queryId,
          attachments: data.attachments, // 积分商品图片
          cover: data.cover, // 积分商品封面
          title: data.title, // 积分商品名称
          purchaseLimit: data.purchaseLimit, // 积分商品限购
          virtualSalesVolume: data.virtualSalesVolume, // 销量(注水)
          contents: data.contents, // 编辑器
          deliveryType: String(data.deliveryType), // 取货方式
          goodsPropertys: data.goodsPropertys
        }
      })
    },
    blur() { // 校验编辑器内容
      this.$refs.form.validateField('contents')
    },
    // 商品图片
    uploadSuccess(list){
      this.form.attachments = list
    },
    submitForm(formName) {
      if(this.form.attachments.length > 0) { // 封面设置 提交赋值，取第一张
        this.form.cover = this.form.attachments[0].attachmentUrl
      }else{
        this.form.cover = ''
      }

      if(this.form.title){ // 赋值
        this.form.goodsPropertys[0].name = this.form.title
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(parseInt(this.queryId) === -1){ // 添加
            addIntegral(this.form).then(res => {
              this.$message({
                message: '积分商品添加成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/integral/mall'
            })
          }else { // 编辑
            updateIntegral(this.form).then(res => {
              this.$message({
                message: '积分商品编辑成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/integral/mall'
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
        /deep/.el-form-item{
          margin-right: 20px;
        }
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
