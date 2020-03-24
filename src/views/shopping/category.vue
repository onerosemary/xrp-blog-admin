<template>
  <div class="container">
    <div class="handle-box">
      <el-input v-model="query.name" placeholder="搜索名称" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="getList">搜索</el-button>
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
      <el-table-column label="图标" width="150">
          <template slot-scope="scope">
            <img class="list-img" :src="scope.row.imgUrl" />
          </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" />
      <el-table-column
        label="顺序"
      >
        <template slot-scope="scope">
          <div v-if="orderIndex === scope.row.id" class="sort-box">
            <el-input v-model="orderValue" placeholder="请输入内容"></el-input>
            <el-button type="text" @click="saveOrder">保存</el-button>
            <el-button type="text" class="order-cancel" @click="orderCancel">取消</el-button>
          </div>
          <div v-else>
            {{scope.row.sort}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="categoryorder(scope.row)"
          >修改顺序</el-button>
          <el-button
            size="mini"
            @click="categorydelete(scope.row.id)"
          >删除</el-button>
          <el-button
            size="mini"
            @click="handle(scope.row.id)"
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
import { categoryList, categoryOrder, isOn, categorydelete } from '@/api/shopping'
export default {
  name: 'Store',
  data() {
    return {
      orderIndex: -1, // 排序索引
      orderValue: '', // 排序绑定order
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
    // 排序修改
    categoryorder(row) {
      const {id, sort} = row
      this.orderIndex = id // 索引显示
      this.orderValue = sort // 文本赋值      
    },
    // 保存排序
    saveOrder() {
      const data = {
        id: this.orderIndex,
        sort: this.orderValue
      }
      categoryOrder(data).then(res => {
        this.$message({
          message: `修改顺序成功！`,
          type: 'success'
        })
        this.orderIndex = -1 // 重置
        this.getList()
      })
    },
    // 取消排序
    orderCancel() {
      this.orderIndex = -1
    },
    categorydelete(id) {
      this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        categorydelete({id}).then(res => {
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