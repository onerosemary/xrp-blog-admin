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
        <el-form-item label="备注信息" prop="remark" style="width: 200px">
            <el-input v-model="form.remark" size="small" clearable placeholder="请填写" />
        </el-form-item>
      </div>
      <div>
      <el-form-item label="角色权限" prop="resourceIds">
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps"
          :default-checked-keys="checkedTreeKeys">
        </el-tree>
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
import { add, modify, getDetail } from '@/api/role'
import{ getTree } from '@/api/common'

/* 权限实现思路1
1, 区分菜单 与 按钮， 每个对象加上path
2, 提交之前，组装下数据
3， 组装思路： 1) 用户选中 商品管理 -> 商品列表 -> 添加
    /shopping/product 那么菜单path肯定有 商品管理/商品列表 , 按钮 放在childrenBtn数组对象中，并用product标识
    因为，后面可以通过获取路由查找 product 设置按钮是否显示

    11) 如果 用户选中 商品管理 -> 商品列表 -> 添加，编辑 2个按钮， 思路同上childrenBtn数组对象中, 就有2个

    111) 如果用户选中 商品管理 -> 商品分类 -> 添加， 同上~

权限实现思路2
基于路由列表参考，path设置为 对应的path， 在permission.js中去遍历匹配

权限实现思路3
去借鉴下 admin-template的思路 看看有没更简单的方法

*/

export default {
  data() {
    const checkTree = (rule, value, callback) => {
      if(this.$refs.tree.getCheckedNodes().length === 0){
        callback(new Error('请选中角色权限菜单'))
      }else{
        callback()
      }
    }
    return {
      checkedTreeKeys: [], // 主要用于回选
      data: [],
      defaultProps: {
        children: 'childMenus',
        label: 'name'
      },
      form: {
        name: '',
        remark: '',
        resourceIds: '',
        checkKey: '' // 用户保存回选中状态
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        resourceIds: [
          { required: true, validator: checkTree, trigger: 'change' }
        ]
      }
    }
  },
  components: {
  },
  mounted() {
    this.getTreeData()
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
    // 获取tree数据
    getTreeData() {
      getTree().then((res) => {
        this.data = res.data
      })
    },

    // 获取选择角色
    changeRole(id) {
      this.form.roleId = id

    },
    //  获取用户信息
    getDetail() {
      getDetail({roleId: this.queryId}).then(res => {
        const {id, name, remark, checkKey } = res.data
        this.form = {
            id,
            name,
            remark,
            checkKey
        }
        this.checkedTreeKeys = checkKey.split(',')
        console.log('this.checkedTreeKeys', this.checkedTreeKeys)
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        const getCheckedNodes = this.$refs.tree.getCheckedNodes()
        const roleIdNews = []
        //  组装数组把父pid 也带上
        getCheckedNodes.forEach((item, index) => {
          roleIdNews.push(item.id)
          if(item.pid !== 0){
            roleIdNews.push(item.pid)
          }
        })

        if (valid) {
          this.form.resourceIds = String(_.uniq(roleIdNews)) // 数组转 字符串
          this.form.checkKey = String(this.$refs.tree.getCheckedKeys()) // 字段用于回选
          // console.log(this.$refs.tree.getCheckedNodes())
          // console.log(this.$refs.tree.getCheckedKeys())
          console.log(this.form)

          if(parseInt(this.queryId) === -1){ // 添加
            add(this.form).then(res => {
              this.$message({
                message: '角色添加成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/role/role'
            })
          }else { // 编辑
            this.form.id = this.queryId
            modify(this.form).then(res => {
              this.$message({
                message: '角色编辑成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/role/role'
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
     
      
    }
</style>
