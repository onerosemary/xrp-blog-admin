<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">退货地址设置</div>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <div class="kuaidi">
          <el-form-item label="地址" prop="rtnAddress" style="margin-right: 20px">
            <el-input v-model="form.rtnAddress" size="small" placeholder="请填写" />
          </el-form-item>
      </div>
      <div class="kuaidi">
          <el-form-item label="收货人" prop="rtnPeop" style="margin-right: 20px">
            <el-input v-model="form.rtnPeop" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item label="联系方式" prop="rtnPhone" style="margin-right: 20px">
            <el-input v-model="form.rtnPhone" size="small" placeholder="请填写" />
          </el-form-item>
      </div>
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { rtnGoodsAddress, getGoodsAddress } from '@/api/store'
export default {
  data() {
    return {
      form: {
        rtnAddress: '',
        rtnPeop: '',
        rtnPhone: ''
      },
      rules: {
        rtnAddress: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        rtnPeop: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        rtnPhone: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getGoodsAddress()
  },
  methods: {
    //  获取订单详情信息
    getGoodsAddress() {
      getGoodsAddress().then(res => {
        if(Object.keys(res.data).length > 0) {
            this.form = res.data
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
            rtnGoodsAddress(this.form).then(res => {
                this.$message({
                message: '退货地址设置成功',
                type: 'success'
                })
            })
          
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
      width: 450px;
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
