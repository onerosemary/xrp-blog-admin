<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">订单关联返佣</div>
      <p class="head-span-sub">编辑返佣信息</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="" prop="attachments" class="upload-item">
        <div class="good-img">
            <p><img :src="dataDetail.goodsCover" width="100" height="100" /></p>
            <dl>
                <dt>{{dataDetail.goodsName}}</dt>
                <dd>{{dataDetail.goodsSpecs}} x {{dataDetail.goodsCnt}}</dd>
                <dd>￥{{dataDetail.goodsPrice}}</dd>
            </dl>
        </div>
      </el-form-item>
      <div class="kuaidi">
          <el-form-item label="佣金（￥）" prop="rakeAmt" style="margin-right: 20px">
            <el-input v-model="form.rakeAmt" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item label="分销人手机号码" prop="customerPhone">
            <el-input v-model="form.customerPhone" size="small" placeholder="请填写" />
          </el-form-item>
      </div>

      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { orderSend, categoryEditor, orderDetail, buildRake } from '@/api/shopping'

export default {
  data() {
    return {
      form: {
        customerPhone: '', // 分销人手机号
        rakeAmt: '', // 佣金
        orderId: '' // 订单id
      },
      dataDetail: {}, // 订单详情
      rules: {
        customerPhone: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        rakeAmt: [
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
            this.form.orderId = this.queryId
            this.form.rakeAmt = this.form.rakeAmt * 100 // 佣金 分
            buildRake(this.form).then(res => {
              if(res.code === 'MBCM0001') {
                this.$message({
                  message: '订单关联返佣 成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/shopping/orders'
                })
              }
            }).catch(err => {
              this.form.rakeAmt = this.form.rakeAmt / 100
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
