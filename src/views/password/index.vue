<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">个人信息</div>
      <p class="head-span-sub">修改密码</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="旧密码" prop="oldPwd" style="width: 200px">
        <el-input v-model="form.oldPwd" show-password size="small" clearable placeholder="请填写" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd" style="width: 200px">
        <el-input v-model="form.newPwd" show-password size="small" clearable placeholder="请填写" />
      </el-form-item>
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>

import { updatePwd } from '@/api/user'
import { checkAccount } from '@/utils/validate'
export default {
  data() {
    return {
      form: {
        oldPwd: '',
        newPwd: ''
      },
      rules: {
        oldPwd: [
          { required: true, validator: checkAccount, trigger: 'blur' }
        ],
        newPwd: [
          { required: true, validator: checkAccount, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },

  mounted() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updatePwd(this.form).then(res => {
            this.$message({
              message: '密码修改成功, 需要重新登录',
              type: 'success'
            })
            setTimeout(() => {
              // 退出重新登录
              this.$store.dispatch('user/logout')
              window.location.reload()
            }, 1000)
          })
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
      width: 500px;
      padding-top: 15px;
      /deep/.handle-select{
          width: 200px;
      }
      .group-item{
        display: flex;
        /deep/.el-form-item{
          margin-right: 20px;
        }
      }

    }
</style>
