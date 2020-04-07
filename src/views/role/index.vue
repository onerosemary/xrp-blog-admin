<template>
  <div class="container">
    <div class="handle-box">
      <el-input v-model="query.name" placeholder="角色" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="getList">搜索</el-button>
      <el-button type="primary" size="small" @click="handle(-1)">添加角色</el-button>
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
      <el-table-column label="角色" prop="name" />

      <el-table-column label="备注">
        <template slot-scope="scope">
          {{scope.row.companyName}}
        </template>
      </el-table-column>
      
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.companyId !== 0"
            size="mini"
            @click="handle(scope.row.id)"
          >编辑</el-button>
          <el-button
            size="mini"
            v-if="scope.row.companyId !== 0"
            @click="deleteHandle(scope.row.id)"
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
import { list, delete1 } from '@/api/role'
import { parseTime } from '@/utils'
export default {
  name: 'Rebate',
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
      list(params).then(res => {
        const { records, total } = res.data
        records.forEach((item, index) => {
          item.createTime = parseTime(item.createTime)
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
    deleteHandle(roleId) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        delete1({roleId}).then(res => {
          this.$message({
            message: `删除成功！`,
            type: 'success'
          })
          // 删除当前 row
          this.tableData.forEach((item, index) => {
            if(parseInt(item.id) === parseInt(roleId)){
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
    handle(id) {
      this.$router.push({
        path: '/role/roleHandle',
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
</style>