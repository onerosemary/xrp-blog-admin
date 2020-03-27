<template>
  <div class="container">
    <div class="handle-box">
      <el-select v-model="query.status" placeholder="状态" @change="getList" class="handle-select mr10" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="上架" :value="1" />
        <el-option label="下架" :value="0" />
      </el-select>
      <datePicker @change="datePickerChange"></datePicker>
      <el-input v-model="query.title" placeholder="搜索积分商品" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="getList">搜索</el-button>
      <el-button type="primary" size="small" @click="handle(-1)">添加积分商品</el-button>
      <el-button type="primary" size="small" @click="handle2">积分规则设置</el-button>

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
      <el-table-column label="封面" width="100">
          <template slot-scope="scope">
            <img class="list-img" :src="scope.row.cover" />
          </template>
      </el-table-column>
      <el-table-column label="名称" prop="title" />
      <el-table-column label="兑换积分">
        <template slot-scope="scope">
          {{scope.row.points}}
        </template>
      </el-table-column>
      <el-table-column
        label="剩余库存"
      >
        <template slot-scope="scope">
          {{scope.row.stock}}
        </template>
      </el-table-column>
      <el-table-column
        label="已兑换数量"
        prop="salesVolume"
      />
      <el-table-column
        label="已兑换积分"
        prop="usePoints"
      />
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <span v-if="parseInt(scope.row.status) === 0">下架</span>
          <span v-if="parseInt(scope.row.status) === 1">上架</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            v-if="parseInt(scope.row.status) === 1"
            size="mini"
            @click="isOnIntegral(scope.row)"
          >下架</el-button>
          <el-button
            v-if="parseInt(scope.row.status) === 0"
            size="mini"
            @click="isOnIntegral(scope.row)"
          >上架</el-button>
          <el-button
            size="mini"
            @click="handle(scope.row.id)"
          >编辑</el-button>
          <el-button
            size="mini"
            @click="deleteIntegral(scope.row.id)"
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
import datePicker from '@/components/datePicker'
import { listIntegral, isOnIntegral, deleteIntegral } from '@/api/integral'
import { parseTime } from '@/utils'
export default {
  name: 'Store',
  data() {
    return {
      time: '',
      query: {
        status: '',
        startTime: null,
        endTime: null,
        title: null
      },
      currentPage: 1, // 当前页
      pageSize: 5, // 每页显示条数
      total: 0, // 总条数
      loading: false,
      tableData: []
    }
  },
  components: {
    datePicker
  },
  created() {
    this.getList()
  },
  methods: {
    deleteIntegral(id) {
      this.$confirm('此操作将永久删除该积分商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        deleteIntegral({id}).then(res => {
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
    isOnIntegral(row) {
      const {id, status} = row
      const text = parseInt(status) === 0 ? '上架' : '下架'
      const params = {
        id,
        status: parseInt(status) === 0 ? 1 : 0 // 1上架， 0下架
      }
      isOnIntegral(params).then(res => {
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
    // 选择日期
    datePickerChange(time){
      if(!!time){
        const [startTime, endTime] = time
        this.query.startTime = startTime + ' 00:00:00'
        this.query.endTime = endTime + ' 23:59:59'
      }else { // 为null
        this.query.startTime = time
        this.query.endTime = time
      }
      this.getList()
    },
    // 列表接口
    getList() {
      const {status, startTime, endTime, title} = this.query

      const params = {
        status,
        startTime,
        endTime,
        title,
        zbPage: {
          current: this.currentPage,
          size: this.pageSize
        }

      }
      listIntegral(params).then(res => {
        const { records, total } = res.data
        // imgUrl 
        records.forEach((item, index) => {
          item.cover = this.imgUrl + item.cover
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
    handle(id) {
      this.$router.push({
        path: '/integral/mallHandle',
        query: {
          id: id
        }
      })
    },
    // 设置积分规则
    handle2() {
      this.$router.push({
        path: '/integral/mallRuleHandle'
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