<template>
  <div class="container">
    <div class="handle-box">
      <article-type @change="articleTypeChange" />
      <!-- <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" size="small" @change="getList">
        <el-option label="全部" value="null" />
        <el-option label="首页推荐" value="0" />
        <el-option label="热文" value="1" />
      </el-select> -->
      <!-- <el-input v-model="query.title" placeholder="搜索文章" class="handle-input mr10" size="small" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="getList">搜索</el-button> -->
      <el-button type="primary" size="small" @click="handleLink(-1)">添加文章</el-button>

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
          <img class="list-img" :src="imgUrl + scope.row.cover">
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" />
      <el-table-column label="分类">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column
        label="浏览量"
        prop="looks"
      />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="parseInt(scope.row.isnew) === 1">首页推荐</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isnew === 0"
            size="mini"
            @click="recommendIndex(scope.row)"
          >推荐首页</el-button>
          <el-button
            v-if="scope.row.isnew === 1"
            size="mini"
            @click="recommendIndex(scope.row)"
          >取消推荐</el-button>
          <el-button
            size="mini"
            @click="handleLink(scope.row._id)"
          >编辑</el-button>
          <el-button
            size="mini"
            @click="deleteArticle(scope.row._id)"
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
import articleType from '@/components/articleType'

import { articleList, articleDel, isNew } from '@/api/article'
// import { goodsList } from '@/api/common'
import { parseTime } from '@/utils'
export default {
  name: 'List',
  components: {
    articleType

  },
  data() {
    return {
      time: '',
      query: {
        cid: null,
        status: null,
        title: null
      },
      type: 0,
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
    // 推荐首页
    recommendIndex(row) {
      const { _id:id, isnew } = row
      const text = parseInt(isnew) === 0 ? '推荐首页' : '取消推荐'
      const params = {
        id,
        isnew: parseInt(isnew) === 0 ? 1 : 0
      }
      isNew(params).then(res => {
        this.$message({
          message: `${text}, 成功！`,
          type: 'success'
        })
        // 更新当前 row
        this.tableData.forEach((item, index) => {
          if (parseInt(item._id) === parseInt(id)) {
            this.$set(this.tableData[index], 'isnew', params.isnew)
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
      switch (num) {
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
          this.deleteArticle(command)
          break
        default:
          console.log('error')
      }
    },
    deleteArticle(id) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 继续删除
        articleDel({ id }).then(res => {
          this.$message({
            message: `删除成功！`,
            type: 'success'
          })
          // 删除当前 row
          this.tableData.forEach((item, index) => {
            if (parseInt(item._id) === parseInt(id)) {
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
      const { id, status } = c.command
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
          if (parseInt(item.id) === parseInt(id)) {
            this.$set(this.tableData[index], 'status', params.status)
          }
        })
      })
    },
    // 获取选择分类
    articleTypeChange(id) {
      this.type= id
      this.getList()
    },

    // 列表接口
    getList() {
      // const { cid, status, startTime, endTime, title } = this.query

      const params = {
        type: this.type,
        page: this.currentPage,
        size: this.pageSize
      }
      articleList(params).then(res => {
        const { data, total } = res
        // imgUrl
        data.forEach((item, index) => {
          // item.cover = this.imgUrl + item.cover
          item.date = parseTime(item.date)
        })
        this.tableData = data
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
    handleLink(id) {

      this.$router.push({
        path: '/article/listHandle',
        query: {
          id
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
