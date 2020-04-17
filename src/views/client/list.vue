<template>
  <div class="container">
    <div class="handle-box">
      <!-- 注册门店 -->
      <store-list @changeRegister="changeRegister" :type="0"></store-list>
      <!-- 消费门店 -->
      <store-list @change="storeListChange"></store-list>
      <el-select v-model="query.level" placeholder="等级" @change="getList" class="handle-select mr10" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="Lv 1" :value="1" />
        <el-option label="Lv 2" :value="2" />
        <el-option label="Lv 3" :value="3" />
      </el-select>
      <el-select v-model="query.identity" placeholder="身份" @change="getList" class="handle-select mr10" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="客户" :value="0" />
        <el-option label="合伙人" :value="1" />
      </el-select>
      <datePicker @change="datePickerChange"></datePicker>

      <el-input v-model="query.name" placeholder="搜索名称" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="getList">搜索</el-button>
      <el-button v-has="'customerClearAll'"  type="primary" size="small" @click="clientClearAllPoints">清空所有积分</el-button>

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
      <el-table-column label="头像" width="100">
          <template slot-scope="scope">
            <img class="list-img" :src="imgUrl + scope.row.headPic" />
          </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="注册门店" prop="companyName" />
      <el-table-column label="消费金额(￥)/消费门店">
          <template slot-scope="scope">
            {{scope.row.totalMoney | price}} / {{scope.row.totalCompanyNumber}}
          </template>
      </el-table-column>
      <el-table-column label="积分" prop="points" />
      <el-table-column label="分销次数" prop="shareNumber" />
      <el-table-column label="已赚佣金(￥)">
          <template slot-scope="scope">
            {{scope.row.totalCash | price}}
          </template>
      </el-table-column>
      <el-table-column label="账户佣金(￥)">
          <template slot-scope="scope">
            {{scope.row.balance | price}}
          </template>
      </el-table-column>
      <el-table-column label="等级" prop="level">
        <template slot-scope="scope">
          <span v-if="parseInt(scope.row.level) === 1">Lv 1</span>
          <span v-if="parseInt(scope.row.level) === 2">Lv 2</span>
          <span v-if="parseInt(scope.row.level) === 3">Lv 3</span>
        </template>
      </el-table-column>
      <el-table-column label="身份" prop="identityStr"/>
      <el-table-column label="注册时间">
          <template slot-scope="scope">
            {{scope.row.createTime}}
          </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button
             v-has="'clientDetail'" 
            type="text"
            size="mini"
            @click="handleDetail(scope.row.id)"
            >详情</el-button>
          <el-button
             v-has="'customerClear'" 
            size="mini"
            @click="clientClearPoints(scope.row.id)"
          >清空积分</el-button>
          <el-button
            v-has="'customerUpdate'" 
            size="mini"
            @click="handle(scope.row.id)"
          >编辑</el-button>
          <el-button
            v-has="'customerDelete'" 
            size="mini"
            @click="clientDeletet(scope.row.id)"
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
import storeList from '@/components/storeList'
import datePicker from '@/components/datePicker'
import { clientList, clientDeletet, clientClearPoints, clientClearAllPoints } from '@/api/client'
import { parseTime } from '@/utils'
export default {
  name: 'Store',
  data() {
    return {
      time: '',
      query: {
        companyId: null, // 注册门店id
        saleCompanyId: null, // 消费门店id
        identity: '', // 身份
        level: '', // 等级
        name: null, // 搜索
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
  components: {
    storeList,
    datePicker
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取选择消费门店
    storeListChange(id) {
      this.query.saleCompanyId = id
      this.getList()
    },
    // 获取选择注册门店
    changeRegister(id) {
      this.query.companyId = id
      this.getList()
    },
    // 清空所有客户积分
    clientClearAllPoints() {
      this.$confirm('此操作将清空所有客户的积分, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续
        clientClearAllPoints().then(res => {
          this.$message({
            message: `所有客户积分已全部清空成功！`,
            type: 'success'
          })
          // 更新列表
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清空客户积分'
        })       
      })
    },
    // 清空积分
    clientClearPoints(id) {
      this.$confirm('此操作将清空该客户的积分, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续
        clientClearPoints({id}).then(res => {
          this.$message({
            message: `积分清空成功！`,
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
          message: '已取消清空'
        })       
      })
    },
    clientDeletet(id) {
      this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        clientDeletet({id}).then(res => {
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
      const {companyId, saleCompanyId, identity, level, name, startTime, endTime,} = this.query
      const params = {
        companyId,
        saleCompanyId,
        identity,
        level,
        name,
        startTime,
        endTime,
        zbPage: {
          current: this.currentPage,
          size: this.pageSize
        }
      }
      clientList(params).then(res => {
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
    // 详情跳转
    handleDetail(id) {
      this.$router.push({
        path: '/client/clientDetail',
        query: {
          id: id
        }
      })
    },
    // 添加/编辑 跳转
    handle(id) {
      this.$router.push({
        path: '/actives/discountHandle',
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