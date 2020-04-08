<template>
  <div class="container">
    <div class="handle-box">
      <el-select v-model="query.type" placeholder="优惠劵类型" @change="getList" class="handle-select mr10" size="small">
        <el-option label="全部" :value="0" />
        <el-option label="商品优惠券" :value="1" />
        <el-option label="无门槛抵扣券" :value="2" />
        <el-option label="满减券" :value="3" />
        <el-option label="现金红包" :value="4" />
      </el-select>
      <el-select v-model="query.status" placeholder="状态" @change="getList" class="handle-select mr10" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="上架" :value="1" />
        <el-option label="下架" :value="0" />
      </el-select>
      <datePicker @change="datePickerChange"></datePicker>

      <el-input v-model="query.title" placeholder="搜索名称" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="getList">搜索</el-button>
      <el-button v-has="'couponAdd'" type="primary" size="small" @click="handle(-1)">添加优惠券</el-button>

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
      <el-table-column label="金额(￥)" width="80">
          <template slot-scope="scope">
            {{scope.row.couponPrice | price}}
          </template>
      </el-table-column>
      <el-table-column label="名称" prop="title" />
      <el-table-column label="类型">
          <template slot-scope="scope">
            <span v-if="parseInt(scope.row.couponType) === 1">商品优惠券</span>
            <span v-if="parseInt(scope.row.couponType) === 2">无门槛抵扣券</span>
            <span v-if="parseInt(scope.row.couponType) === 3">满减券</span>
            <span v-if="parseInt(scope.row.couponType) === 4">现金红包</span>
          </template>
      </el-table-column>
      <el-table-column label="内容" prop="name">
        <template slot-scope="scope">
          <span v-if="parseInt(scope.row.couponType) === 1">{{scope.row.goodsName}}</span>
          <span v-if="parseInt(scope.row.couponType) === 2">无门槛抵扣券</span>
          <span v-if="parseInt(scope.row.couponType) === 3">满{{scope.row.minPrice | price}}减{{scope.row.couponPrice | price}}</span>
          <span v-if="parseInt(scope.row.couponType) === 4">现金红包</span>
        </template>
      </el-table-column>
      <el-table-column label="已领/总数量">
          <template slot-scope="scope">
            {{scope.row.receivedNumber || 0}}/{{scope.row.stock}}
          </template>
      </el-table-column>
      <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime}}
          </template>
      </el-table-column>
      <el-table-column label="状态" width="60">
          <template slot-scope="scope">
            {{parseInt(scope.row.status) === 0 ? '下架' : '上架'}}
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
            v-has="'couponOrder'"
            size="mini"
            @click="discountOrder(scope.row)"
          >修改顺序</el-button>
          <el-button
            v-has="'couponUpDown'"
            v-if="scope.row.status === 0"
            size="mini"
            @click="discountUpdown(scope.row.id, scope.row.status)"
          >上架</el-button>
          <el-button
            v-has="'couponUpDown'"
            v-if="scope.row.status === 1"
            size="mini"
            @click="discountUpdown(scope.row.id, scope.row.status)"
          >下架</el-button>
          <el-button
            v-has="'couponUpdate'"
            size="mini"
            @click="handle(scope.row.id)"
          >编辑</el-button>
          <el-button
            v-has="'couponDelete'"
            size="mini"
            @click="discountDelete(scope.row.id)"
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
import { discountList, discountOrder, discountIsOn, discountDelete } from '@/api/actives'
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
  components: {
    datePicker
  },
  created() {
    this.getList()
  },
  methods: {
    // 排序修改
    discountOrder(row) {
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
      discountOrder(data).then(res => {
        this.$message({
          message: `修改顺序成功！`,
          type: 'success'
        })
        this.orderIndex = -1 // 重置
        this.getList()
      })
    },
    // 上下架
    discountUpdown(id, status) {
      const text = parseInt(status) === 0 ? '上架' : '下架'
      const params = {
        id,
        status: parseInt(status) === 0 ? 1 : 0 // 1上架， 0下架
      }
      discountIsOn(params).then(res => {
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
    // 取消排序
    orderCancel() {
      this.orderIndex = -1
    },
    discountDelete(id) {
      this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        discountDelete({id}).then(res => {
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
      const {title, status, type, startTime, endTime,} = this.query
      const params = {
        type,
        status,
        title,
        startTime,
        endTime,
        zbPage: {
          current: this.currentPage,
          size: this.pageSize
        }
      }
      discountList(params).then(res => {
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