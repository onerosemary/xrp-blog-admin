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
      data: [ {
        id: 1,
        path: '/',
        level: 1,
        label: '数据预览 (菜单)'
      },{
        id: 2,
        path: '/store',
        level: 1,
        label: '门店管理 (菜单)',
        children: [{
          id: 3,
          pid: 2,
          path: '/store',
          isBtn: true,
          label: '添加'
        }, {
          id: 4,
          pid: 2,
          path: '/store',
          isBtn: true,
          label: '编辑'
        }, {
          id: 5,
          pid: 2,
          path: '/store',
          isBtn: true,
          label: '删除'
        }]
      },{
        id: 6,
        path: '/shopping',
        level: 1,
        label: '商品管理 (菜单)',
        children: [{
          id: 7,
          pid: 6,
          path: '/shopping/category',
          level: 2,
          label: '商品分类 (菜单)',
          children: [{
            id: 8,
            pid: 7,
            path: '/shopping/category',
            isBtn: true,
            label: '添加'
          }, {
            id: 9,
            pid: 7,
            path: '/shopping/category',
            isBtn: true,
            label: '编辑'
          }, {
            id: 10,
            pid: 7,
            path: '/shopping/category',
            isBtn: true,
            label: '删除'
          }, {
            id: 11,
            pid: 7,
            path: '/shopping/category',
            isBtn: true,
            label: '修改顺序'
          }]
        },{
          id: 12,
          pid: 6,
          path: '/shopping/product',
          level: 2,
          label: '商品列表 (菜单)',
          children: [{
            id: 13,
            pid: 12,
            path: '/shopping/product',
            isBtn: true,
            label: '添加'
          }, {
            id: 14,
            pid: 12,
            path: '/shopping/product',
            isBtn: true,
            label: '编辑'
          }, {
            id: 15,
            pid: 12,
            path: '/shopping/product',
            isBtn: true,
            label: '删除'
          }, {
            id: 16,
            pid: 12,
            path: '/shopping/product',
            isBtn: true,
            label: '推荐首页'
          }, {
            id: 17,
            pid: 12,
            path: '/shopping/product',
            isBtn: true,
            label: '上下架'
          }]
        },{
          id: 18,
          pid: 6,
          path: '/shopping/orders',
          level: 2,
          label: '订单列表 (菜单)',
          children: [{
            id: 19,
            pid: 18,
            path: '/shopping/orders',
            isBtn: true,
            label: '删除'
          }, {
            id: 20,
            pid: 18,
            path: '/shopping/orders',
            isBtn: true,
            label: '发货'
          }, {
            id: 21,
            pid: 18,
            path: '/shopping/orders',
            isBtn: true,
            label: '关联分销'
          }, {
            id: 22,
            pid: 18,
            path: '/shopping/orders',
            isBtn: true,
            label: '详情'
          }]
        }]
      }, {
        id: 23,
        path: '/client',
        level: 1,
        label: '客户管理 (菜单)',
        children: [{
          id: 24,
          pid: 23,
          path: '/client/list',
          level: 2,
          label: '客户列表 (菜单)',
          children: [{
            id: 241,
            pid: 24,
            path: '/client/list',
            isBtn: true,
            label: '详情'
          }, {
            id: 242,
            pid: 24,
            path: '/client/list',
            isBtn: true,
            label: '编辑'
          }, {
            id: 243,
            pid: 24,
            path: '/client/list',
            isBtn: true,
            label: '删除'
          }, {
            id: 244,
            pid: 24,
            path: '/client/list',
            isBtn: true,
            label: '清空所有积分'
          }, {
            id: 245,
            pid: 24,
            path: '/client/list',
            isBtn: true,
            label: '清空积分'
          }]
        }, {
          id: 25,
          pid: 23,
          path: '/client/chat',
          level: 1,
          label: '客户咨询 (菜单)',
          children: [{
            id: 251,
            pid: 25,
            path: '/client/chat',
            isBtn: true,
            label: '客服设置'
          }]
        }]
      },{
        id: 26,
        path: '/actives',
        level: 1,
        label: '活动管理 (菜单)',
        children: [{
          id: 27,
          pid: 26,
          path: '/actives/discount',
          level: 2,
          label: '优惠劵 (菜单)',
          children: [{
            id: 28,
            pid: 27,
            path: '/actives/discount',
            isBtn: true,
            label: '添加'
          }, {
            id: 29,
            pid: 27,
            path: '/actives/discount',
            isBtn: true,
            label: '编辑'
          }, {
            id: 30,
            pid: 27,
            path: '/actives/discount',
            isBtn: true,
            label: '删除'
          }, {
            id: 31,
            pid: 27,
            path: '/actives/discount',
            isBtn: true,
            label: '修改顺序'
          }, {
            id: 32,
            pid: 27,
            path: '/actives/discount',
            isBtn: true,
            label: '上下架'
          }]
        },{
          id: 33,
          pid: 26,
          path: '/actives/group',
          level: 2,
          label: '拼团 (菜单)',
          children: [{
            id: 34,
            pid: 33,
            path: '/actives/group',
            isBtn: true,
            label: '添加'
          }, {
            id: 35,
            pid: 33,
            path: '/actives/group',
            isBtn: true,
            label: '编辑'
          }, {
            id: 36,
            pid: 33,
            path: '/actives/group',
            isBtn: true,
            label: '删除'
          }, {
            id: 37,
            pid: 33,
            path: '/actives/group',
            isBtn: true,
            label: '上下架'
          }]
        },{
          id: 38,
          pid: 26,
          path: '/actives/seckill',
          level: 2,
          label: '秒杀 (菜单)',
          children: [{
            id: 39,
            pid: 38,
            path: '/actives/seckill',
            isBtn: true,
            label: '添加'
          }, {
            id: 40,
            pid: 38,
            path: '/actives/seckill',
            isBtn: true,
            label: '编辑'
          }, {
            id: 41,
            pid: 38,
            path: '/actives/seckill',
            isBtn: true,
            label: '删除'
          }, {
            id: 42,
            pid: 38,
            path: '/actives/seckill',
            isBtn: true,
            label: '上下架'
          }]
        },{
          id: 43,
          pid: 26,
          path: '/actives/distribution',
          level: 2,
          label: '分销 (菜单)',
          children: [{
            id: 44,
            pid: 43,
            path: '/actives/distribution',
            isBtn: true,
            label: '添加'
          }, {
            id: 45,
            pid: 43,
            path: '/actives/distribution',
            isBtn: true,
            label: '编辑'
          }, {
            id: 46,
            pid: 43,
            path: '/actives/distribution',
            isBtn: true,
            label: '删除'
          }, {
            id: 47,
            pid: 43,
            path: '/actives/distribution',
            isBtn: true,
            label: '上下架'
          }]
        },{
          id: 48,
          pid: 26,
          path: '/actives/rebate',
          level: 2,
          label: '返佣 (菜单)'
        }]
      },{
        id: 49,
        path: '/integral',
        level: 1,
        label: '积分管理 (菜单)',
        children: [{
          id: 50,
          pid: 49,
          path: '/integral/mall',
          level: 2,
          label: '积分商城 (菜单)',
          children: [{
            id: 51,
            pid: 50,
            path: '/integral/mall',
            isBtn: true,
            label: '添加'
          }, {
            id: 52,
            pid: 50,
            path: '/integral/mall',
            isBtn: true,
            label: '编辑'
          }, {
            id: 53,
            pid: 50,
            path: '/integral/mall',
            isBtn: true,
            label: '删除'
          }, {
            id: 54,
            pid: 50,
            path: '/integral/mall',
            isBtn: true,
            label: '上下架'
          }, {
            id: 55,
            pid: 50,
            path: '/integral/mall',
            isBtn: true,
            label: '设置积分规则'
          }]
        },{
          id: 56,
          pid: 49,
          path: '/integral/log',
          isBtn: true,
          label: '积分日志 (菜单)'
        }]
      },{
        id: 56,
        path: '/role',
        level: 1,
        label: '角色列表 (菜单)',
        children: [{
          id: 57,
          pid: 56,
          path: '/role/roleList',
          isBtn: true,
          label: '添加'
        }, {
          id: 58,
          pid: 56,
          path: '/role/roleList',
          isBtn: true,
          label: '编辑'
        }, {
          id: 59,
          pid: 56,
          path: '/role/roleList',
          isBtn: true,
          label: '删除'
        }]
      },{
        id: 60,
        path: '/system',
        level: 1,
        label: '系统用户列表 (菜单)',
        children: [{
          id: 61,
          pid: 60,
          path: '/system/systemList',
          isBtn: true,
          label: '添加'
        }, {
          id: 62,
          pid: 60,
          path: '/system/systemList',
          isBtn: true,
          label: '编辑'
        }, {
          id: 63,
          pid: 60,
          path: '/system/systemList',
          isBtn: true,
          label: '删除'
        }]
      },
      ],
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
      getDetail({id: this.queryId}).then(res => {
        const {id, name, password, roleDetail, remark } = res.data
        this.form = {
            id,
            name,
            password,
            roleId: String(roleDetail.id),
            remark
        }
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
              path: '/role/roleList'
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
              path: '/role/roleList'
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
