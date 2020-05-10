<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">商品发货</div>
      <p class="head-span-sub">编辑发货信息</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="" prop="attachments" class="upload-item">
        <div class="good-img">
            <p><img :src="imgUrl + dataDetail.goodsCover" width="100" height="100" /></p>
            <dl>
                <dt>{{dataDetail.goodsName}}</dt>
                <dd>{{dataDetail.goodsSpecs}} x {{dataDetail.goodsCnt}}</dd>
                <dd>￥{{dataDetail.goodsPrice}}</dd>
            </dl>
        </div>
      </el-form-item>
      <el-form-item label="" style="margin-bottom: 20px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="title">收货人</span>
                <el-button style="float: right; padding: 3px 0; margin-top: 9px" type="text" @click="doCopy">复制</el-button>
            </div>
            <div class="text item">
                {{dataDetail.consigneeName}}：{{dataDetail.consigneePhone}}
            </div>
            <div class="text item">
                地址：{{dataDetail.consigneeAddress}}
            </div>
          </el-card>
      </el-form-item>
      <div class="kuaidi">
          <el-form-item label="快递公司" prop="expressCompany" style="margin-right: 20px">
            <el-input v-model="form.expressCompany" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item label="运单号" prop="expressNo">
            <el-input v-model="form.expressNo" size="small" placeholder="请填写" />
          </el-form-item>
      </div>

      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { orderSend, categoryEditor, orderDetail } from '@/api/shopping'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

export default {
  data() {
    return {
      form: {
        expressCompany: '', // 快递公司
        expressNo: '', // 运单号
        id: '' // 订单id
      },
      dataDetail: {}, // 订单详情
      rules: {
        expressCompany: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        expressNo: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
  },
  watch: {

  },
  mounted() {
    if(parseInt(this.queryId)) {
      this.orderDetail()
    }
  },
  computed: {
    queryId() {
      return parseInt(this.$route.query.id)
    }
  },
  methods: {
    // 复制功能
    doCopy() {
        // 需要复制的内容
        const msg = `${this.dataDetail.consigneeName}:${this.dataDetail.consigneePhone} ${this.dataDetail.consigneeAddress}`
        this.$copyText(msg).then((e) => {
            this.$message({
                message: '复制成功',
                type: 'success'
            })
        }).catch(err => {
            this.$message({
                message: '复制失败, 请手动复制',
                type: 'success'
            })
        })
    },
    //  获取订单详情信息
    orderDetail() {
      orderDetail({id: this.queryId}).then(res => {
        this.dataDetail = res.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          if(parseInt(this.queryId)){ // 添加
            this.form.id = this.queryId
            orderSend(this.form).then(res => {
              this.$message({
                message: '订单发货表单提交成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/shopping/orders'
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
      .create-btn{
          margin-top: 40px;
      }
      .el-form-item{
          margin-bottom: 0;
      }
      .good-img{
          display: flex;
          dl{
              dt{
                padding-left: 20px;
              }
              dd{
                  margin-left: 20px;
                  line-height: 25px;
                  color: #9EA1A9;
                  font-size: 13px;
              }
          }
      }
      /deep/.box-card{
          .el-card__header{
              padding: 0 20px;
          }
          .title{
              color: #9EA1A9;
          }
      }
      .kuaidi{
          display: flex;
          /deep/.el-form-item {
              flex: 1;
          }
      }
    }
</style>
