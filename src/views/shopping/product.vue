<template>
  <div class="container">
    <div class="handle-box">
      <goods-type @change="goodsTypeChange"></goods-type>
      <el-select v-model="query.status" placeholder="状态" @change="getList" class="handle-select mr10" size="small">
        <el-option label="上架" value="1" />
        <el-option label="下架" value="0" />
        <el-option label="推荐首页" value="2" />
      </el-select>
      <datePicker @change="datePickerChange"></datePicker>
      <el-input v-model="query.title" placeholder="门店名" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="getList">搜索</el-button>
      <el-button type="primary" size="small" @click="handle(-1)">添加商品</el-button>

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
      <el-table-column label="价格(￥)">
        <template slot-scope="scope">
          {{scope.row.minPrice | price}}
        </template>
      </el-table-column>
      <el-table-column
        label="库存"
        prop="stock"
      />
      <el-table-column
        label="销量"
        prop="salesVolume"
      />
      <el-table-column label="分类" >
        <template slot-scope="scope">
          <span>{{scope.row.cname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <span v-if="parseInt(scope.row.status) === 0">下架</span>
          <div v-else>
            <span v-if="parseInt(scope.row.status) === 1 && parseInt(scope.row.isNew) === 1" class="cblue">首页推荐</span>
            <span v-else class="cblue">上架</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            v-if="parseInt(scope.row.status) === 1 && parseInt(scope.row.isNew) === 0"
            size="mini"
            @click="recommendIndex(scope.row)"
          >推荐首页</el-button>
          <el-button
            v-if="parseInt(scope.row.status) === 1 && parseInt(scope.row.isNew) === 1"
            size="mini"
            @click="recommendIndex(scope.row)"
          >取消推荐</el-button>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link cblue">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="dropdow-css">
              <el-dropdown-item v-if="parseInt(scope.row.status) === 1" :command="beforeHandleCommand(scope.row, -1)">下架</el-dropdown-item>
              <el-dropdown-item v-if="parseInt(scope.row.status) === 0" :command="beforeHandleCommand(scope.row, 1)">上架</el-dropdown-item>
              <el-dropdown-item :command="beforeHandleCommand(scope.row, 2)">编辑</el-dropdown-item>
              <el-dropdown-item :command="beforeHandleCommand(scope.row, 0)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
import goodsType from '@/components/goodsType'
import datePicker from '@/components/datePicker'
import { isNewIndex, isOn, deleteGoods } from '@/api/shopping'
import { goodsList } from '@/api/common'
import { parseTime } from '@/utils'
export default {
  name: 'Store',
  data() {
    return {
      time: '',
      query: {
        cid: null,
        status: null,
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
    goodsType,
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
    beforeHandleCommand(command, num) {
      return {
        num: parseInt(num),
        command
      }
    },
    // 操作
    handleCommand(command) {
      console.log('command--', command)
      const { num } = command
      switch(num) {
        case -1:
          // 下架
          console.log('下架')
          this.goodsIsOn(command)
          break
        case 1:
          // 上架
          console.log('上架')
          this.goodsIsOn(command)
          break
        case 2:
          // 编辑
          console.log('编辑')
          this.handle(command.command.id)
          break
        case 0:
          // 删除
          console.log('删除')
          this.deleteGood(command)
          break
        default:
          console.log('error')
      }
    },
    deleteGood(c) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        const {id} = c.command
        deleteGoods({id}).then(res => {
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
    goodsIsOn(c) {
      const {id, status} = c.command
      const text = parseInt(status) === 0 ? '上架' : '下架'
      const params = {
        id,
        status: parseInt(status) === 0 ? 1 : 0 // 1上架， 0下架
      }
      isOn(params).then(res => {
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
    // 获取选择分类
    goodsTypeChange(id) {
      this.query.cid = id
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
      const {cid, status, startTime, endTime, title} = this.query

      const params = {
        cid: cid, // 关键词
        status: parseInt(status) === 2 ? null : status,
        isNew: parseInt(status) === 2 ? 1 : null, // 如果状态是3，代表首页推荐查询
        startTime: startTime,
        endTime: endTime,
        title: title,
        zbPage: {
          current: this.currentPage,
          size: this.pageSize
        }

      }
      goodsList(params).then(res => {
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
        path: '/shopping/productHandle',
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