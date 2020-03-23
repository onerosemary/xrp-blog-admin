<template>
  <div class="container">
    <div class="handle-box">
      <el-input v-model="query.name" placeholder="搜索名称" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" size="small" @click="getList">搜索</el-button>
      <el-button type="primary" size="small" @click="handle(-1)">添加商品分类</el-button>

    </div>
    <el-table
      v-loading="loading"
      class="base-table"
      :data="tableData"

    >
      <el-table-column
        label="序号"
        width="50"
      >
        <template slot-scope="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="图标" width="100">
          <template slot-scope="scope">
            <img class="list-img" :src="scope.row.imgUrl" />
          </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" />
      <el-table-column
        label="顺序（倒序）"
        prop="sort"
      />
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
          >修改顺序</el-button>
          <el-button
            size="mini"
          >删除</el-button>
          <el-button
            size="mini"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        background
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { categoryList, isNewIndex, isOn, deleteGoods } from '@/api/shopping'
export default {
  name: 'Store',
  data() {
    return {
      query: {
        name: null
      },
      currentPage: 1, // 当前页
      pageSize: 5, // 每页显示条数
      total: 0, // 总条数
      loading: false,
      tableData: []
    }
  },
  components: {
  },
  created() {
    this.getList()
  },
  methods: {
    // 推荐首页
    recommendIndex(row) {
      const { id, isNew } = row
      const text = parseInt(isNew) === 0 ? '推荐首页' : '取消推荐'
      const params = {
        id,
        isNew: parseInt(isNew) === 0 ? 1 : 0 // 0 不是新品 1 是新品
      }
      isNewIndex(params).then(res => {
        this.$message({
          message: `${text}, 成功！`,
          type: 'success'
        })
        // 更新当前 row
        this.tableData.forEach((item, index) => {
           if(parseInt(item.id) === parseInt(id)){
             this.$set(this.tableData[index], 'isNew', params.isNew)
           }
        })
      })
    },
    deleteGood(c) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        const {id} = c.command
        deleteGoods({id}).then(res => {
          this.$message({
            message: `删除成功！`,
            type: 'success'
          })
          // 删除当前 row
          this.tableData.forEach((item, index) => {
            if(parseInt(item.id) === parseInt(id)){
              this.tableData.splice(index, 1)
            }
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })       
      })
    },
    // 上下架
    goodsIsOn(c) {
      const {id, status} = c.command
      const text = parseInt(status) === 0 ? '上架' : '下架'
      const params = {
        id,
        status: parseInt(status) === 0 ? 1 : 0 // 1上架， 0下架
      }
      isOn(params).then(res => {
        this.$message({
          message: `${text}, 成功！`,
          type: 'success'
        })
        // 更新当前 row
        this.tableData.forEach((item, index) => {
           if(parseInt(item.id) === parseInt(id)){
             this.$set(this.tableData[index], 'status', params.status)
           }
        })
      })
    },
    // 列表接口
    getList() {
      const {name} = this.query
      const params = {
        name,
        zbPage: {
          current: this.currentPage,
          size: this.pageSize
        }
      }
      categoryList(params).then(res => {
        const { records, total } = res.data
        // imgUrl 
        records.forEach((item, index) => {
          item.imgUrl = this.imgUrl + item.imgUrl
        })
        this.tableData = records
        this.total = parseInt(total)
      })
    },
    handleSearch() {
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    handle(id) {
      this.$router.push({
        path: '/shopping/productHandle',
        query: {
          id: id
        }
      })
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-dropdown-link{
    cursor: pointer;
    font-size: 12px;
  }
</style>