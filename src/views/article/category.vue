<template>
  <div class="container">
    <div class="handle-box">
      <!-- <el-input v-model="query.name" placeholder="搜索名称" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="getList">搜索</el-button> -->
      <el-button type="primary" size="small" @click="handle(-1)">添加文章分类</el-button>

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

      <el-table-column label="名称" prop="name" />
  
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button

            size="mini"
            @click="handle(scope.row.id)"
          >编辑</el-button>
          <el-button

            size="mini"
            @click="categorydelete(scope.row.id)"
          >删除</el-button>
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
import { articleType } from '@/api/article'
export default {
  name: 'Category',

  data() {
    return {
      query: {
        name: null
      },
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示条数
      total: 0, // 总条数
      loading: false,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    categorydelete(id) {
      this.$confirm('此操作将永久删除该文章分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        categorydelete({ id }).then(res => {
          this.$message({
            message: `删除成功！`,
            type: 'success'
          })
          // 删除当前 row
          this.tableData.forEach((item, index) => {
            if (parseInt(item.id) === parseInt(id)) {
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
    // 列表接口
    getList() {
      // const { name } = this.query
      // const params = {
      //   name,
      //   zbPage: {
      //     current: this.currentPage,
      //     size: this.pageSize
      //   }
      // }
      articleType().then(res => {
        this.tableData = res.data
        // const { records, total } = res.data
        // this.tableData = records
        // this.total = parseInt(total)
      })
    },
    handleSearch() {
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    // 添加/编辑 跳转
    handle(id) {
      this.$router.push({
        path: '/shopping/categoryHandle',
        query: {
          id: id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-dropdown-link{
    cursor: pointer;
    font-size: 12px;
  }
  .sort-box{
    display: flex;
    align-items: center;
    /deep/ .el-input{
      width: 100px;
      margin-right: 20px;
    }
    /deep/.el-input__inner{
      line-height: 30px;
      height: 30px;
    }
    /deep/.el-button--text{
      font-size: 13px;
    }
    .order-cancel{
      color: #999;
    }
  }
</style>
