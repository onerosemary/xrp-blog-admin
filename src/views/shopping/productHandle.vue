<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">{{queryId === -1 ? '商品添加': '商品编辑'}}</div>
      <p class="head-span-sub">如商品无折扣，价格栏只填写现价即可。</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="商品图片" prop="attachments" class="upload-item">
        <upload :attachments="form.attachments" @uploadSuccess="uploadSuccess"></upload>
      </el-form-item>
      <el-form-item label="商品名称" prop="title">
          <el-input v-model="form.title" size="small" placeholder="请填写" />
      </el-form-item>
      <el-form-item>
        <div class="title"><span class="first">规格</span><span>原价</span><span>现价</span><span>库存</span></div>
      </el-form-item>
      <div
        v-for="(domain, index) in form.goodsPropertys"
        :key="domain.key"
        class="specification"
      >
      <el-form-item
        class="g1"
        :prop="'goodsPropertys.' + index + '.name'"
        :rules="{
          required: true, message: '不能为空', trigger: 'blur'
        }"
      >
        <el-input  v-model="domain.name" placeholder="请填写" class="dyInput guige" />
      </el-form-item>
      <el-form-item
        class="g2"
        :prop="'goodsPropertys.' + index + '.originalPrice'"
        :rules="{
          required: true, message: '不能为空', trigger: 'blur'
        }"
      >
        <el-input  v-model="domain.originalPrice" placeholder="请填写" class="dyInput" />
      </el-form-item>
      <el-form-item
        class="g2"
        :prop="'goodsPropertys.' + index + '.price'"
        :rules="{
          required: true, message: '不能为空', trigger: 'blur'
        }"
      >
        <el-input  v-model="domain.price" placeholder="请填写" class="dyInput" />
      </el-form-item>
      <el-form-item
        class="g2"
        :prop="'goodsPropertys.' + index + '.stock'"
        :rules="{
          required: true, message: '不能为空', trigger: 'blur'
        }"
      >
        <el-input  v-model="domain.stock" placeholder="请填写" class="dyInput" />
      </el-form-item>
        <div class="sort-del">
          <span v-if="index !== 0" class="el-icon-top" title="上移" @click="sortMove(index, 'up')" />
          <span v-if="form.goodsPropertys.length !== (index+1)" class="el-icon-bottom" title="下移" @click="sortMove(index, 'down')" />
          <span v-if="form.goodsPropertys.length !== 1" class="el-icon-close" title="删除" @click.prevent="removeDomain(domain)" />
        </div>
      </div>
      <el-form-item class="add-form-item">
        <div class="add-new-input"><span @click="addDomain()">新增表头字段</span></div>
      </el-form-item>
      <div class="goods-type">
        <el-form-item label="分类" prop="cid">
            <goods-type :cid="form.cid" @change="goodsTypeChange" style="margin-right:10px"></goods-type>
        </el-form-item>
        <el-form-item label="销量" prop="virtualSalesVolume">
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
        <el-form-item label="订金" prop="deposit">
            <el-input v-model="form.deposit" size="small" placeholder="请填写" />
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
import goodsType from '@/components/goodsType'
import editor from '@/components/Editor'
import { addGood, editorGood, getGoodsInfo } from '@/api/shopping'
export default {
  data() {
    const attachments = (rule, value, callback) => {
      console.log('value---', value)
      if (value.length < 0) {
        callback(new Error('商品图片不可为空'))
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
        attachments:[], // 商品图片
        cover: '', // 商品封面
        title: '', // 商品名称
        cid: '', // 商品分类
        virtualSalesVolume: '', // 销量
        contents: '', // 编辑器
        deliveryType: '', // 取货方式
        deposit: '', // 定金
        goodsPropertys: [{ // 商品类型
          name: '', // 规格
          originalPrice: '', // 原价
          price: '', // 现价
          stock: '', // 库存
          key: Date.now()
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
        goodsType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        virtualSalesVolume: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        cid: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        contents: [
          { required: true, validator: contents, trigger: 'blur' }
        ],
        deliveryType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        deposit: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    upload,
    goodsType,
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
      this.getGoodsInfo()
    }
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return parseInt(this.$route.query.id)
    }
  },
  methods: {
    //  获取商品信息
    getGoodsInfo() {
      getGoodsInfo({id: this.queryId}).then(res => {
        const { data } = res
        // 赋值
        // 商品规格 分
        data.goodsPropertys.forEach(item => {
          item.originalPrice = item.originalPrice / 100
          item.price = item.price / 100
        })
        this.form = {
          attachments: data.attachments, // 商品图片
          cover: data.cover, // 商品封面
          title: data.title, // 商品名称
          cid: String(data.cid), // 商品分类
          virtualSalesVolume: data.virtualSalesVolume,
          contents: data.contents,
          deliveryType: String(data.deliveryType),
          deposit: (data.deposit) / 100,
          goodsPropertys: data.goodsPropertys
        }
      })
    },
    blur() { // 校验编辑器内容
      this.$refs.form.validateField('contents')
    },
    // 获取选择分类
    goodsTypeChange(id) {
      this.form.cid = id
    },
    // 商品图片
    uploadSuccess(list){
      console.log('list', list)
      this.form.attachments = list
    },

    // 排序
    sortMove(index, type) {
      const goodsPropertysObj = this.form.goodsPropertys
      const currentObj = goodsPropertysObj[index] // 当前对象
      if (type === 'up') { // 上
        const currentObjPrev = goodsPropertysObj[index - 1] // 当前的对象 上一个
        goodsPropertysObj.splice(index - 1, 1, currentObj) // 替换上一个为 当前对象
        goodsPropertysObj.splice(index, 1, currentObjPrev) // 替换当前对象为 上一个
      } else { // 下
        const currentObjNext = goodsPropertysObj[index + 1] // 当前的对象 下一个
        goodsPropertysObj.splice(index + 1, 1, currentObj) // 替换下一个为 当前对象
        goodsPropertysObj.splice(index, 1, currentObjNext) // 替换当前对象为 下一个
      }
    },
    removeDomain(item) {
      var index = this.form.goodsPropertys.indexOf(item)
      if (index !== -1) {
        this.form.goodsPropertys.splice(index, 1)
      }
    },
    addDomain() {
      this.form.goodsPropertys.push({
        name: '',
        originalPrice: '',
        price: '',
        stock: '',
        key: Date.now()
      })
    },
    submitForm(formName) {
      if(this.form.attachments.length > 0) { // 封面设置 提交赋值，取第一张
        this.form.cover = this.form.attachments[0].attachmentUrl
      }else{
        this.form.cover = ''
      }
      if(this.form.goodsPropertys.length > 0){ // 规格价格是分
        this.form.goodsPropertys.forEach((item) => {
            item.originalPrice = item.originalPrice * 100
            item.price = item.price * 100
        })
      }
      if(this.form.deposit){ // 定金是分
        this.form.deposit = this.form.deposit * 100
      }
      console.log('this.form---', this.form)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(parseInt(this.queryId) === -1){ // 添加
            addGood(this.form).then(res => {
              this.$message({
                message: '商品添加成功',
                type: 'success'
              })
            })
            setTimeout(()=>{
              this.$router.push({
                path: '/shopping/product'
              })
            }, 1500)
          }else { // 编辑
            this.form.id = this.queryId
            editorGood(this.form).then(res => {
              this.$message({
                message: '商品编辑成功',
                type: 'success'
              })
            })
            setTimeout(()=>{
              this.$router.push({
                path: '/shopping/product'
              })
            }, 1500)
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
