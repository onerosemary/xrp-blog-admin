<template>
  <div class="container">
    <div class="handle-box">
      <el-input v-model="query.name" placeholder="门店名" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="handleSearch">搜索</el-button>
      <el-button v-has="'storeAdd'" type="primary" size="small" @click="handle(-1)">添加门店</el-button>
    </div>
    <el-table
      v-loading="loading"
      class="base-table"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        width="50"
      >
        <template slot-scope="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="店照" width="180">
        <template slot-scope="scope">
          <img :src="imgUrl + scope.row.imgUrl" width="60"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          {{scope.row.status === 1 ? '上架' : '下架'}}
        </template>
      </el-table-column>
      <el-table-column label="门店" width="180" class-name="name-store">
        <template slot-scope="scope">
            <!-- 总店 -->
            <div v-if="$store.getters.companyId === 1">
              <div class="self" v-if="scope.row.id === 1">本店</div>
            </div>
            <div v-else>
              <!-- 分店 -->
              <div class="self" v-if="scope.row.id === 1">总店</div>
              <div class="self" v-if="scope.row.id === $store.getters.companyId">本店</div>
            </div>
            {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="address" />
      <el-table-column label="操作" width="220" v-if="$store.getters.companyId === 1">
        <template slot-scope="scope">
          <el-button
            
            v-if="parseInt(scope.row.status) === -1"
            size="mini"
            @click="storeUpdown(scope.row.id, scope.row.status)"
          >上架</el-button>
          <el-button
            
            v-if="parseInt(scope.row.status)  === 1"
            size="mini"
            @click="storeUpdown(scope.row.id, scope.row.status)"
          >下架</el-button>
          <el-button
            v-has="'storeUpdate'"
            size="mini"
            @click="handle(scope.row.id, scope.row.id === $store.getters.companyId)"
          >编辑</el-button>
          <el-button
            v-has="'storeDelete'"
            size="mini"
            type="danger"
            v-if="scope.row.id !== $store.getters.companyId"
            @click="handleDelete(scope.row.id)"
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
import { storeList } from '@/api/common'
import { deleteStore, updown } from '@/api/store'
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
  computed: {
    isSelf() {

    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 上下架
    storeUpdown(id, status) {
      const text = parseInt(status) === -1 ? '上架' : '下架'
      const params = {
        id,
        status: parseInt(status) === -1 ? 1 : -1 // 1上架， -1下架
      }
      updown(params).then(res => {
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
    // 列表接口
    getList() {
      const params = {
        name: this.query.name, // 关键词
        zbPage: {
          current: this.currentPage,
          pages: this.pageSize
        }

      }
      storeList(params).then(res => {
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
    handle(id, isbendian) {
      if(isbendian) { // 本店
        this.$router.push({
          path: '/store/handle',
          query: {
            id: id,
            isbendian: 1
          }
        })
      }else {
        this.$router.push({
          path: '/store/handle',
          query: {
            id: id
          }
        })
      }
      
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该门店, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        deleteStore({id}).then(res => {
          this.$message({
            message: `删除门店成功！`,
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
          message: '已取消门店删除'
        })       
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/.name-store{
    position: relative;
    overflow: hidden;
  }
  .self{
    position: absolute;
    background: #409EFF;
    height: 20px;
    color: #fff;
    width: 60px;
    transform: rotate(45deg);
    top: 1px;
    text-align: center;
    line-height: 20px;
    right: -19px;
    font-size: 11px;
  }
</style>