<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">系统角色</div>
      <p class="head-span-sub">{{queryId === -1 ? '添加角色信息': '编辑角色信息'}}</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <div class="group-item">
        <el-form-item label="角色名称" prop="name" style="width: 200px">
            <el-input v-model="form.name" size="small" placeholder="请填写" clearable />
        </el-form-item>
        <el-form-item label="备注信息" prop="password" style="width: 200px">
            <el-input v-model="form.password" size="small" clearable placeholder="请填写" />
        </el-form-item>
      </div>
      <div>
        <el-form-item label="角色权限" prop="name">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item name="1">
              <template slot="title">
                数据预览<el-checkbox class="all-check" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              </template>
              <div class="list-check">
                <el-checkbox-group v-model="checkedMenus" @change="handlecheckedMenusChange">
                  <el-checkbox v-for="menu in menus" :label="menu" :key="menu.id">{{menu.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-collapse-item>
            <el-collapse-item  name="2">
              <template slot="title">
                门店管理<el-checkbox class="all-check" :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2">全选</el-checkbox>
              </template>
              <div class="list-check">
                <el-checkbox-group v-model="checkedMenus" @change="handlecheckedMenusChange2">
                  <el-checkbox v-for="menu in menus2" :label="menu" :key="menu.id">{{menu.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-collapse-item>
            <el-collapse-item name="3">
              <template slot="title">
                商品管理<el-checkbox class="all-check"   @change="handleCheckAllChange3">全选</el-checkbox>
              </template>
              <div v-for="menu in menus3" :key="menu.id">
                  <el-checkbox-group v-model="checkedMenu">
                    <el-checkbox class="alone-menu" :label="menu.id"  :indeterminate="isIndeterminate3" @change="handleCheckedMenu">{{menu.name}}</el-checkbox>
                  </el-checkbox-group>
                  <div class="list-check">
                    <el-checkbox-group v-model="checkedMenus" @change="handlecheckedMenusChange3">
                      <el-checkbox v-for="cmenu in menu.children" :label="cmenu" :key="cmenu.id">{{cmenu.name}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
              </div>
              
            </el-collapse-item>
            <el-collapse-item title="客户管理" name="4">
              <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
            <el-collapse-item title="活动管理" name="5">
              <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
            <el-collapse-item title="积分管理" name="6">
              <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
            <el-collapse-item title="角色列表" name="7">
              <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
            <el-collapse-item title="系统用户列表" name="8">
              <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>
      </div>
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import _ from 'lodash'
import roleList from '@/components/roleList'
import storeList from '@/components/storeList'
import { add, modify, getDetail } from '@/api/system'
import { checkAccount } from '@/utils/validate'

const menuOptions = [{id: 1, name: '数据预览'}]
const menuOptions2 = [{id: 2, name: '添加'}, {id: 3, name: '编辑'}, {id: 4, name: '删除'}]
const menuOptions3 = [
  { 
    id: 55, 
    name: '商品分类(菜单)', 
    children: [{id: 5, pid:55, name: '添加'}, {id: 6, pid: 55, name: '编辑'}, {id: 7, pid: 55, name: '删除'}]
  },
  { 
    id: 66, 
    name: '商品列表(菜单)', 
    children: [{id: 8, pid:66,  name: '添加'}, {id: 9, pid:66, name: '编辑'}, {id: 10, pid:66, name: '删除'}]
  }
]
export default {
  data() {
    return {
      oldCheckedMenu: [], // 记录上次值
      activeName: '3',
      checkAll: false, // 全选
      checkedMenus: [],
      menus: menuOptions,
      isIndeterminate: true, 
      
      checkAll2: false, // 全选
      // checkedMenus: [],
      menus2: menuOptions2,
      isIndeterminate2: true,     

      checkedMenu: [], // 二级菜单
      checkAll3: true, // 全选
      // checkedMenus: [],
      menus3: menuOptions3,
      isIndeterminate3: false,
      
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
      this.getDetail()
    }
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return parseInt(this.$route.query.id)
    }
  },
  methods: {
    // 权限
    handleCheckAllChange(val) {
      this.checkedMenus = val ? menuOptions : []
      this.isIndeterminate = false
      console.log('checkedMenus', this.checkedMenus)
    },
    handlecheckedMenusChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.menus.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.menus.length
      console.log('checkedMenus', this.checkedMenus)
    },

    handleCheckAllChange2(val) {
      this.checkedMenus = val ? menuOptions2 : []
      this.isIndeterminate2 = false
      console.log('checkedMenus', this.checkedMenus)
    },
    handlecheckedMenusChange2(value) {
      let checkedCount = value.length
      this.checkAll2 = checkedCount === this.menus2.length
      this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.menus2.length
      console.log('checkedMenus', this.checkedMenus)
    },

    // 选中二级菜单
    handleCheckedMenu(isCheck) {
      const compareVal = _.difference(this.oldCheckedMenu, this.checkedMenu) // 比较数组值, 获取取消id    
      
      if(!isCheck) { // 取消
        const cancelId = compareVal[0]
        console.log('cancelId', cancelId)

        const filterMenus = this.checkedMenus.filter(({ pid }) => parseInt(pid) !== parseInt(cancelId))
        this.checkedMenus = filterMenus
        console.log('this.checkedMenus', this.checkedMenus)
        return
      }
      
      const checkId = this.checkedMenu[this.checkedMenu.length -1] // 二级菜单id
      menuOptions3.forEach(item => {
        if(item.id === checkId) {
          if(item.children.length > 0){ // 有二级菜单
              item.children.forEach(citem => {
                this.checkedMenus.push(citem)
              })
          }else {
            this.checkedMenus.push(item)
          }
        }
      })
      // 记录上次选中值
      this.oldCheckedMenu = this.checkedMenu
      console.log('二级菜单', this.checkedMenu)
      console.log('checkedMenus', this.checkedMenus)
    },


    handleCheckAllChange3(val) {
      // this.checkedMenus = val ? menuOptions3 : []
      console.log('checkAll3---', this.checkAll3)
      return
      if(val) {
        menuOptions3.forEach(item => {
          if(item.children.length > 0){ // 有二级菜单
              item.children.forEach(citem => {
                this.checkedMenus.push(citem)
              })
          }else {
            this.checkedMenus.push(item)
          }
        })
      }else {
        this.checkedMenus = []
      }
      // this.isIndeterminate3 = false
      console.log('checkedMenus', this.checkedMenus)
    },
    handlecheckedMenusChange3(value) {
      const myPid = value[value.length - 1].pid
      console.log('myPid--', myPid)
      const globalLen = this.menus3.filter(({id}) => parseInt(id) === parseInt(myPid))[0].children.length // 全局pid的len
      const cLen = this.checkedMenus.filter(({ pid }) => parseInt(pid) === parseInt(myPid)).length // 选中len
      console.log('cLen', cLen)
      console.log('globalLen', globalLen)
      
      // 数组去重
      _.uniq(this.checkedMenus)
      let checkedCount = cLen
      // let checkedCount = value.length
      // this.checkAll3 = checkedCount === this.menus3.length
      // this.checkAll3 = checkedCount === cLen
      this.isIndeterminate3 = checkedCount > 0 && checkedCount < globalLen
      
      this.checkedMenus.forEach(item => {
        this.checkedMenu.push(item.pid) // 是否全选选中二级菜单
      })


      console.log('checkedMenus', this.checkedMenus)
      console.log('二级菜单', this.checkedMenu)
      
    },
    // 获取选择消费门店
    storeListChange(id) {
      this.form.companyId = id

    },
    // 获取选择角色
    changeRole(id) {
      this.form.roleId = id

    },
    //  获取用户信息
    getDetail() {
      getDetail({id: this.queryId}).then(res => {
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
              path: '/system/systemList'
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
              path: '/system/systemList'
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
      width: 800px;
      padding-top: 15px;
      // /deep/.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      //     background-color: none;
      //     border-color: none;
      // }
      // /deep/.is-checked .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
      //     background-color: #409EFF;
      //     border-color: #409EFF;
      // }
      /deep/.el-collapse-item__header{
        position: relative;
        background: rgba(97,175,254,.1);
        text-indent: 2.5em;
      }
      /deep/.el-collapse-item__arrow{
        position: absolute;
        left: -20px;
        top: 18px;
        margin: 0;
        transition: none
      }
      /deep/.el-collapse-item__arrow.is-active{
        position: absolute;
        left: -3px;
        top: 0;
        transition: none
      }
      .all-check{
        position: absolute;
        right: 10px;
        /deep/.el-checkbox__label{
          text-indent: 0;
          font-size: 13px;
        }
      }
      .alone-menu{
        padding: 20px 0 0 20px;
      }
      .list-check{
        padding: 20px 20px 0 20px;
      }
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
