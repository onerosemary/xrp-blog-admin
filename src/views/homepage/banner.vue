<template>
  <div class="container">
    <div class="handle-box" v-if="tableData.length < 6">
      <el-button v-has="'bannerAdd'" type="primary" size="small" @click="handle(-1)">添加banner</el-button>
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

      <el-table-column label="封面图片">
        <template slot-scope="scope">
            <img class="list-img" :src="scope.row.cover" />
        </template>
      </el-table-column>
      <el-table-column label="类型">
          <template slot-scope="scope">
            <span v-if="parseInt(scope.row.bannerType) === 0">外链</span>
            <span v-if="parseInt(scope.row.bannerType) === 1">普通商品</span>
            <span v-if="parseInt(scope.row.bannerType) === 2">优惠券列表</span>
          </template>
      </el-table-column>
      <el-table-column label="外链地址">
        <template slot-scope="scope">
          {{scope.row.bannerUrl}}
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime}}
          </template>
      </el-table-column>
      <el-table-column
        label="顺序"
        width="150"
      >
        <template slot-scope="scope">
          <div v-if="orderIndex === scope.row.id" class="sort-box">
            <el-input v-model="orderValue" placeholder="请输入内容"></el-input>
            <el-button type="text" @click="saveOrder">保存</el-button>
            <el-button type="text" class="order-cancel" @click="orderCancel">取消</el-button>
          </div>
          <div v-else>
            {{scope.row.indexNumber}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="330">
        <template slot-scope="scope">
          <el-button
            v-has="'bannerOrder'"
            size="mini"
            @click="bannerOrder(scope.row)"
          >修改顺序</el-button>
          <el-button
            v-has="'bannerUpdate'"
            size="mini"
            @click="handle(scope.row.id)"
          >编辑</el-button>
          <el-button
            v-has="'bannerDelete'"
            size="mini"
            @click="bannerDelete(scope.row.id)"
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
import { bannerList, bannerOrder, discountIsOn, bannerDelete } from '@/api/homepage'
import { parseTime } from '@/utils'
export default {
  name: 'Store',
  data() {
    return {
      orderIndex: -1, // 排序索引
      orderValue: '', // 排序绑定order
      time: '',
      query: {
        type: null,
        status: '',
        title: null,
        startTime: null,
        endTime: null
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
    // 排序修改
    bannerOrder(row) {
      const {id, indexNumber} = row
      this.orderIndex = id // 索引显示
      this.orderValue = indexNumber // 文本赋值      
    },
    // 保存排序
    saveOrder() {
      const data = {
        id: this.orderIndex,
        indexNumber: this.orderValue
      }
      bannerOrder(data).then(res => {
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
    bannerDelete(id) {
      this.$confirm('此操作将永久删除该banner, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        bannerDelete({id}).then(res => {
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
      const params = {
        zbPage: {
          current: this.currentPage,
          size: this.pageSize
        }
      }
      bannerList(params).then(res => {
        const { records, total } = res.data
        // imgUrl 
        records.forEach((item, index) => {
          item.createTime = item.createTime && parseTime(item.createTime)
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
        path: '/homepage/bannerHandle',
        query: {
          id: id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .handle-box{
        text-align: right;
    }
  .el-dropdown-link{
    cursor: pointer;
    font-size: 12px;
  }
  .sort-box{
    display: flex;
    align-items: center;
    /deep/ .el-input{
      width: 100px;
      margin-right: 8px;
    }
    /deep/.el-input__inner{
      width: 50px;
      line-height: 30px;
      height: 30px;
      font-size: 12px;
    }
    /deep/.el-button--text{
      font-size: 13px;
    }
    .order-cancel{
      color: #999;
    }
  }
</style>