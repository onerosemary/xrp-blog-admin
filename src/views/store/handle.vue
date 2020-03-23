<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">门店信息</div>
      <p class="head-span-sub">请一定要填写支付宝或微信 APPID 等信息，否则客户无法在 APP 中进行支付。</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <div>
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="form.name" size="small" placeholder="请填写" />
        </el-form-item>
        <el-form-item label="门店医师" prop="aaa">
          <el-input v-model="form.aaa" size="small" placeholder="请填写" />
        </el-form-item>
        <el-form-item label="管理员账号" prop="userName">
          <el-input v-model="form.userName" size="small" placeholder="请填写" />
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input v-model="form.password" type="password" size="small" placeholder="请填写" />
        </el-form-item>
      </div>
      <div>
        <el-form-item label="门店地址" prop="address">
          <div style="display:flex; align-items: center;">
            <el-input v-model="form.address" size="small" placeholder="请填写" />
            <el-button type="primary" size="small" style="padding: 8px 10px; margin-left:5px">搜索</el-button>
          </div>
        </el-form-item>
        <el-form-item label="地图定位" class="map-wrap">
            <div id="map-panel"></div>
            <div id="map-container" class="map-container"></div>
        </el-form-item>
      </div>
      <div>
        <fieldset class="fieldset-border">
          <legend>支付宝接口</legend>
          <el-form-item label="API" prop="alipayAppid">
            <el-input v-model="form.alipayAppid" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item label="密钥" prop="alipayPublicKey">
            <el-input v-model="form.alipayPublicKey" type="password" size="small" placeholder="请填写" />
          </el-form-item>
        </fieldset>
        <fieldset class="fieldset-border">
          <legend>微信接口</legend>
          <el-form-item label="API" prop="wxAppid">
            <el-input v-model="form.wxAppid" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item label="密钥" prop="wxMerchkey">
            <el-input v-model="form.wxMerchkey" type="password" size="small" placeholder="请填写" />
          </el-form-item>
        </fieldset>
      </div>
    </el-form>

  </div>
</template>
<script>
// https://www.jianshu.com/p/56979d9022d9
export default {
  data() {
    return {
      form: {
        name: '',
        userName: '',
        password: '',
        alipayAppid: '',
        alipayPublicKey: '',
        wxAppid: '',
        wxMerchkey: '',
        address: '',
        longitude: '', // 经度
        latitude: '' // 纬度
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {

  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
    .map-container {
        width: 100%;
        height: 368px;
    }
    .body-span{
        display: flex;
        padding-top: 15px;
        div{
            flex: 1;
            width: 85%;
        }
        .el-form-item{
            margin-bottom: 0;
        }
        .fieldset-border{
            border: 1px dashed #ccc;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
            legend{
                color: #29BEC6;
            }
        }
    }
</style>
