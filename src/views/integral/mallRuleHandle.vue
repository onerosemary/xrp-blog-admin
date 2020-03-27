<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">积分规则设置</div>
      <p class="head-span-sub">设置积分与等级</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <fieldset class="set-rule">
        <legend>积分设置</legend>
       <div class="flex-rule">
          <el-form-item label="消费（￥）" prop="payAmount">
              <el-input v-model="form.payAmount" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item label="获得积分" prop="points">
              <el-input v-model="form.points" size="small" placeholder="请填写" />
          </el-form-item>
       </div>
      </fieldset>
      <fieldset class="set-rule" style="margin-top: 30px">
        <legend>等级设置</legend>
        <div class="set-rule-title">积分</div>
       <div class="flex-rule">
          <el-form-item prop="levelRules[0].minPoints">
              <el-input v-model="form.levelRules[0].minPoints" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item>
              -
          </el-form-item>
          <el-form-item  prop="levelRules[0].maxPoints">
              <el-input v-model="form.levelRules[0].maxPoints" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item>
              Lv1
          </el-form-item>
       </div>
       <div class="flex-rule">
          <el-form-item prop="levelRules[1].minPoints">
              <el-input v-model="form.levelRules[1].minPoints" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item>
              -
          </el-form-item>
          <el-form-item  prop="levelRules[1].maxPoints">
              <el-input v-model="form.levelRules[1].maxPoints" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item>
              Lv2
          </el-form-item>
       </div>
       <div class="flex-rule">
          <el-form-item prop="levelRules[2].minPoints">
              <el-input v-model="form.levelRules[2].minPoints" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item>
              -
          </el-form-item>
          <el-form-item  prop="levelRules[2].maxPoints">
              <el-input v-model="form.levelRules[2].maxPoints" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item>
              Lv3
          </el-form-item>
       </div>
      </fieldset>
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { mallAddIntegral, mallUpdateIntegral, mallGetInfoIntegral } from '@/api/integral'
export default {
  data() {
    return {
      queryId: -1, // 默认为 添加
      form: {
        payAmount: '', // 消费金额
        points: '', // 积分值
        levelRules: [{
          name:'Lv1',
          level: 1,
          minPoints: '',
          maxPoints: '',
        },{
          name:'Lv2',
          level: 2,
          minPoints: '',
          maxPoints: '',
        },{
          name:'Lv3',
          level: 3,
          minPoints: '',
          maxPoints: '',
        }]
      },
      rules: {
        payAmount: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        points: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        'levelRules[0].minPoints': [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        'levelRules[0].maxPoints': [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        'levelRules[1].minPoints': [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        'levelRules[1].maxPoints': [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        'levelRules[2].minPoints': [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        'levelRules[2].maxPoints': [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
    this.mallGetInfoIntegral()
  },
  methods: {
    //  获取商品信息
    mallGetInfoIntegral() {
      mallGetInfoIntegral().then(res => {
        if(res.code === 'MBCM0001' && res.data) { // 编辑
          res.data.payAmount = res.data.payAmount / 100 // 消费金额 单位元
          this.form = res.data
          this.queryId = res.data.id
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.form.payAmount) { // 消费金额
            this.form.payAmount = this.form.payAmount * 100
          }
          console.log('this.form---', this.form)
          if(parseInt(this.queryId) === -1){ // 添加
            mallAddIntegral(this.form).then(res => {
              this.$message({
                message: '积分规则设置成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/integral/mall'
            })
          }else { // 编辑
            mallUpdateIntegral(this.form).then(res => {
              this.$message({
                message: '积分规则设置编辑成功',
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
      
      .set-rule-title{
        color: #4D4D4D;
        font-size: 14px;
        padding: 10px 0;
      }
      .set-rule{
        border: 1px dashed #ccc;
        border-radius: 5px;
        /deep/.el-form-item{
            margin-right: 20px;
        }
        .flex-rule{
          display: flex;
        }
        legend{
          color: #29BEC6;
        }
      }
    }
</style>
