<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">系统用户</div>
      <p class="head-span-sub">{{queryId === -1 ? '添加系统用户信息': '编辑系统用户信息'}}</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="账号" prop="name" style="width: 200px">
          <el-input v-model="form.name" size="small" placeholder="请填写" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password" style="width: 200px">
          <el-input show-password v-model="form.password" size="small" clearable placeholder="请填写" />
      </el-form-item>
      <div class="group-item">
        <el-form-item label="门店" prop="companyId">
            <store-list :cid="String(form.companyId)" @change="storeListChange"></store-list>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
            <!-- 当前用户是超级管理员roleId=1  选择的companyId不等于1 则角色只显示 门店管理员 选项 -->
            <role-list :door="$store.getters.companyId === 1 &&  String(form.companyId) === '1'" :cid="form.roleId" :all="false" @change="changeRole"></role-list>
        </el-form-item>
      </div>
      <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" size="small" placeholder="请填写" />
      </el-form-item>
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import roleList from '@/components/roleList'
import storeList from '@/components/storeList'
import { add, modify, getUserInfo } from '@/api/system'
import { checkAccount } from '@/utils/validate'
export default {
  data() {
    return {
      form: {
        companyId: '',
        name: '',
        password: '',
        roleId: '',
        remark: ''
      },
      rules: {
        companyId: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, validator: checkAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: checkAccount, trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    storeList,
    roleList
  },
  mounted() {
    if(parseInt(this.queryId) !== -1){ // 编辑
      this.getUserInfo()
    }
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return parseInt(this.$route.query.id)
    }
  },
  methods: {
    // 获取选择消费门店
    storeListChange(id) {
      this.form.companyId = id

    },
    // 获取选择角色
    changeRole(id) {
      this.form.roleId = id

    },
    //  获取用户信息
    getUserInfo() {
      getUserInfo({id: this.queryId}).then(res => {
        const {id, name, password, companyId, roleDetail, remark } = res.data
        this.form = {
            id,
            name,
            password,
            companyId: String(companyId),
            roleId: String(roleDetail.id),
            remark
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          if(parseInt(this.queryId) === -1){ // 添加
            add(this.form).then(res => {
              this.$message({
                message: '用户新增成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/system/system'
            })
          }else { // 编辑
            this.form.id = this.queryId
            modify(this.form).then(res => {
              this.$message({
                message: '用户编辑成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/system/system'
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
