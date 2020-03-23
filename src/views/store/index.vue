<template>
  <div class="container">
    <div class="handle-box">
      <!-- <el-select v-model="query.address" placeholder="地址" class="handle-select mr10" size="small">
        <el-option key="1" label="广东省" value="广东省" />
        <el-option key="2" label="湖南省" value="湖南省" />
      </el-select> -->
      <el-input v-model="query.name" placeholder="门店名" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">搜索</el-button>
      <el-button type="primary" size="small" @click="handle(-1)">添加门店</el-button>
      <el-button size="small">本店信息修改</el-button>
    </div>
    <el-table
      v-loading="loading"
      class="base-table"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        width="180"
      >
        <template slot-scope="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="店照" width="180" prop="imgUrl" />
      <el-table-column label="门店" width="180" prop="name" />
      <el-table-column label="地址" prop="address" />
      <el-table-column
        label="管理员账号"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="管理员密码"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handle(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
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
import { list } from '../../api/store'
export default {
  name: 'Store',
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
    // 列表接口
    getList() {
      const params = {
        name: this.query.name, // 关键词
        zbPage: {
          current: this.currentPage,
          pages: this.pageSize
        }

      }
      list(params).then(res => {
        const { records, total } = res.data
        this.tableData = records
        this.total = parseInt(total)
      })
    },
    handleSearch() {
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handle(id, row) {
      this.$router.push({
        path: '/store/handle',
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
