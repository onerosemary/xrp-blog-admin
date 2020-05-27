<template>
  <div class="container">
    <!-- <div class="handle-box">
      <el-input v-model="query.name" placeholder="门店名" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="handleSearch">搜索</el-button>
      <el-button  type="primary" size="small" @click="handle(-1)">添加门店</el-button>
    </div> -->
    <el-table
      v-loading="loading"
      class="base-table"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        width="50"
      >
        <template slot-scope="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户" width="180" prop="name" />
      <el-table-column label="评论内容" class-name="name-store">
        <template slot-scope="scope">
          {{ scope.row.text }}
        </template>
      </el-table-column>
      <el-table-column label="点赞数"  width="180" class-name="name-store">
        <template slot-scope="scope">
          {{ scope.row.likes.length }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <!-- <el-button

            size="mini"
            @click="handle(scope.row.id, scope.row.id === $store.getters.companyId)"
          >编辑</el-button> -->
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row._id)"
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
import { commentList, commentDel } from '@/api/comment'
export default {
  name: 'Comment',
  data() {
    return {
      query: {
        // address: '',
        name: ''
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
    handleDelete(id) {
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        commentDel({ id }).then(res => {
          this.$message({
            message: `删除成功！`,
            type: 'success'
          })
          // // 删除当前 row
          this.getList()
          // this.tableData.forEach((item, index) => {
          //   if (parseInt(item._id) === parseInt(id)) {
          //     this.tableData.splice(index, 1)
          //   }
          // })
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
      const params = {
        page: this.currentPage,
        size: this.pageSize
      }

      commentList(params).then(res => {
        const { data, total } = res
        this.tableData = data
        this.total = parseInt(total)
      })
    },
    handleSearch() {
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/.name-store{
    position: relative;
    overflow: hidden;
  }
  .self{
    position: absolute;
    background: #409EFF;
    height: 20px;
    color: #fff;
    width: 60px;
    transform: rotate(45deg);
    top: 1px;
    text-align: center;
    line-height: 20px;
    right: -19px;
    font-size: 11px;
  }
</style>
