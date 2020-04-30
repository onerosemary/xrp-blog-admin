<template>
  <div class="container">
    <div class="handle-box">
      <el-select v-model="query.businessType" placeholder="状态" @change="getList" class="handle-select mr10" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="购买消费" :value="1" />
        <el-option label="积分消耗" :value="2" />
      </el-select>
      <datePicker @change="datePickerChange"></datePicker>
      <el-input v-model="query.keyword" placeholder="搜索手机号" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="getList">搜索</el-button>

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
      <el-table-column label="积分" prop="points" />
      <el-table-column label="用户">
        <template slot-scope="scope">
          {{scope.row.mobile}}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="status">
        <template slot-scope="scope">
          <span v-if="parseInt(scope.row.businessType) === 1">购买消费</span>
          <span v-if="parseInt(scope.row.businessType) === 2">积分消耗</span>
        </template>
      </el-table-column>
      <el-table-column
        label="积分内容"
        prop="remark"
      />
      
      <el-table-column label="记录时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
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
import { logListIntegral, isOnIntegral, deleteIntegral } from '@/api/integral'
import { parseTime } from '@/utils'
export default {
  name: 'Store',
  data() {
    return {
      time: '',
      query: {
        businessType: '',
        startTime: null,
        endTime: null,
        keyword: null
      },
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示条数
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
      const {businessType, startTime, endTime, keyword} = this.query

      const params = {
        businessType,
        startTime,
        endTime,
        keyword,
        zbPage: {
          current: this.currentPage,
          size: this.pageSize
        }

      }
      logListIntegral(params).then(res => {
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