<template>
  <div class="container">
    <div class="handle-box">
      <el-select v-model="query.status" placeholder="状态" @change="getList" class="handle-select mr10" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="进行中" :value="1" />
        <el-option label="已结束" :value="2" />
      </el-select>
      <datePicker @change="datePickerChange"></datePicker>
      <el-input v-model="query.title" placeholder="拼团商品名称" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="getList">搜索</el-button>
      <el-button v-has="'groupAdd'" type="primary" size="small" @click="handle(-1)">添加拼团</el-button>

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
      <el-table-column label="商品" prop="title" />
      
      <el-table-column
        label="开团人数"
        prop="needPeop"
      />
      <el-table-column
        label="已参人数"
        prop="totalCnt"
      />
      <el-table-column label="上架时间">
        <template slot-scope="scope">
          {{scope.row.startTime}}
        </template>
      </el-table-column>
      <el-table-column label="已售金额 ">
        <template slot-scope="scope">
          {{scope.row.totalSales | price}}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <span v-if="parseInt(scope.row.status) === 0">已下架</span>
          <span v-if="parseInt(scope.row.status) === 1">进行中</span>
          <span v-if="parseInt(scope.row.status) === 2" class="cblue">结束</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="225">
        <template slot-scope="scope">
          <el-button
            v-has="'groupUpDown'"
            v-if="parseInt(scope.row.status) === 0"
            size="mini"
            @click="assembleUpdown(scope.row.id, scope.row.status)"
          >上架</el-button>
          <el-button
            v-has="'groupUpDown'"
            v-if="parseInt(scope.row.status) === 1"
            size="mini"
            @click="assembleUpdown(scope.row.id, scope.row.status)"
          >下架</el-button>

          <el-button
            v-has="'groupUpdate'"
            size="mini"
            @click="handle(scope.row.id)"
          >编辑</el-button>
          <el-button
            v-has="'groupDelete'"
            size="mini"
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
import datePicker from '@/components/datePicker'
import { assembleList, isNewIndex, isOn, assembleDelete, assembleUpdown } from '@/api/actives'
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
    deleteHandle(assembleId) {
      this.$confirm('此操作将永久删除该拼团商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        assembleDelete({assembleId}).then(res => {
          this.$message({
            message: `删除成功！`,
            type: 'success'
          })
          // 删除当前 row
          this.tableData.forEach((item, index) => {
            if(parseInt(item.id) === parseInt(assembleId)){
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
    assembleUpdown(assembleId, status) {
      const text = parseInt(status) === 0 ? '上架' : '下架'
      const params = {
        assembleId,
        status: parseInt(status) === 0 ? 1 : 0 // 1上架， 0下架
      }
      assembleUpdown(params).then(res => {
        this.$message({
          message: `${text}, 成功！`,
          type: 'success'
        })
        // 更新当前 row
        this.tableData.forEach((item, index) => {
           if(parseInt(item.id) === parseInt(assembleId)){
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
        status: status,
        startTime: startTime,
        endTime: endTime,
        title: title,
        zbPage: {
          current: this.currentPage,
          size: this.pageSize
        }

      }
      assembleList(params).then(res => {
        const { records, total } = res.data
        // imgUrl 
        records.forEach((item, index) => {
          item.cover = this.imgUrl + item.cover
          
          item.startTime = item.startTime && parseTime(item.startTime)
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
        path: '/actives/groupHandle',
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