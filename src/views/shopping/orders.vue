<template>
  <div class="container">
    <div class="handle-box">
      <store-list @change="storeListChange"></store-list>
      <el-select v-model="query.orderType" placeholder="订单类型" @change="getList" class="handle-select mr10" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="普通 " :value="1" />
        <el-option label="秒杀" :value="2" />
        <el-option label="拼团" :value="3" />
        <el-option label="分销" :value="4" />
        <el-option label="积分" :value="5" />
      </el-select>
      <el-select v-model="query.status" placeholder="状态" @change="getList" class="handle-select mr10" size="small" style="width: 170px">
        <el-option label="全部" :value="null" />
        <el-option label="付定金 " :value="1" />
        <el-option label="已支付,待使用" :value="2" />
        <el-option label="已支付,待发货" :value="3" />
        <el-option label="已完成(发货、使用)" :value="4" />
        <el-option label="申请退款" :value="5" />
        <el-option label="退款待财务审核" :value="6" />
        <el-option label="退款待总经理审核" :value="7" />
        <el-option label="退款完成" :value="8" />
      </el-select>
      <datePicker @change="datePickerChange"></datePicker>
      <el-input v-model="query.title" placeholder="门店名" class="handle-input mr10" size="small" clearable @clear="getList" />
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
      <el-table-column label="封面" width="100">
          <template slot-scope="scope">
            <img class="list-img" :src="scope.row.goodsCover" />
          </template>
      </el-table-column>
      <el-table-column label="标题" width="100">
          <template slot-scope="scope">
            {{scope.row.goodsName}}
          </template>
      </el-table-column>
      <el-table-column label="消费门店" prop="storeName" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{scope.row.orderType}}
        </template>
      </el-table-column>
      <el-table-column label="消费(￥)">
        <template slot-scope="scope">
          {{scope.row.orderAmount | price}}
        </template>
      </el-table-column>
      <el-table-column
        label="购买人"
        prop="customerName"
      />
      <el-table-column
        label="规格"
        prop="goodsSpecs"
      />
      <el-table-column label="取货方式" >
        <template slot-scope="scope">
          <span>{{parseInt(scope.row.deliveryType) === 0 ? '门店自提' : '快递到家'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" >
        <template slot-scope="scope">
          <span>{{scope.row.goodsCnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <span v-if="parseInt(scope.row.status) === 1">已付定金</span>
          <span v-else-if="parseInt(scope.row.status) === 2">已支付,待使用</span>
          <span v-else-if="parseInt(scope.row.status) === 3">待发货</span>
          <span v-else-if="parseInt(scope.row.status) === 4">已发货</span>
          <span v-else-if="parseInt(scope.row.status) === 5">已完成</span>
          <span v-else-if="parseInt(scope.row.status) === 6">退款申请中</span>
          <span v-else-if="parseInt(scope.row.status) === 7">退款已确认、待退货</span>
          <span v-else-if="parseInt(scope.row.status) === 8">退款已拒绝</span>
          <span v-else-if="parseInt(scope.row.status) === 9">已退货、待验收</span>
          <span v-else-if="parseInt(scope.row.status) === 10">退款完成</span>
          <span v-else-if="parseInt(scope.row.status) === 11">已完成(关联返佣)</span>
        </template>
      </el-table-column>
      
      <el-table-column label="接待人">
        <template slot-scope="scope">
          {{scope.row.recpPeop}}
        </template>
      </el-table-column>
      <el-table-column label="支付时间">
        <template slot-scope="scope">
          {{scope.row.payTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <!-- 退款完成 -->
          <!-- <el-button
          v-has="'orderDelete'"
          v-if="parseInt(scope.row.status) === 8"
          size="mini"
          @click="handleDelete(scope.row.id)"
          >删除</el-button> -->
          <!-- 已支付,待发货 -->
          <el-button
          v-has="'orderSend'"
          v-if="parseInt(scope.row.status) === 3"
          size="mini"
          @click="handle(scope.row.id)"
          >发货</el-button>
          <!-- 已完成(发货、使用) -->
          <el-button
          v-has="'ordersDistribution'"
          v-else-if="parseInt(scope.row.status) === 5 && scope.row.orderType === '普通'"
          size="mini"
          @click="handleDistribution(scope.row.id)"
          >关联分销</el-button>
          <el-button
          v-has="'orderDetail'"
          type="text"
          size="mini"
          @click="handleDetail(scope.row.id)"
          >详情</el-button>
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
import { orderList, orderDelete } from '@/api/shopping'
import { parseTime } from '@/utils'
export default {
  name: 'Store',
  data() {
    return {
      time: '',
      query: {
        companyId: null,
        orderType: '',
        startTime: null,
        endTime: null,
        status: '',
        title: null
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
    // 删除订单
    handleDelete(id) {
      this.$confirm('此操作将永久删除该商品订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        orderDelete({id}).then(res => {
          this.$message({
            message: `删除订单成功！`,
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
          message: '已取消订单删除'
        })       
      })
    },
    // 获取选择消费门店
    storeListChange(id) {
      this.query.companyId = id
      this.getList()
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
      const {companyId, orderType, startTime, endTime, title, status} = this.query

      const params = {
        companyId, // 关键词
        orderType,
        startTime: startTime,
        endTime: endTime,
        status,
        title: title,
        zbPage: {
          current: this.currentPage,
          size: this.pageSize
        }

      }
      orderList(params).then(res => {
        const { records, total } = res.data
        records.forEach((item, index) => {
          item.goodsCover = this.imgUrl + item.goodsCover
          item.payTime = item.payTime && parseTime(item.payTime)
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
    // 发货跳转
    handle(id) {
      this.$router.push({
        path: '/shopping/ordersHandleSend',
        query: {
          id: id
        }
      })
    },
    // 详情跳转
    handleDetail(id) {
      this.$router.push({
        path: '/shopping/ordersDetail',
        query: {
          id: id
        }
      })
    },
    // 关联返佣
    handleDistribution(id) {
      this.$router.push({
        path: '/shopping/ordersHandleDistribution',
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