<template>
    <div class="select-goods">
        <div class="cover-goods" @click="choose">
          <img v-if="chooseImg"  :src="chooseImg" width="100" height="100"/>
          <i v-else class="el-icon-plus"></i>
        </div>
        <div class="good-title">
          {{chooseTitle}}
        </div>
        <el-dialog
          class="dialog-styles"
          title="选择商品 (已上架)"
          :visible.sync="dialogVisible"
          width="50%"
          :before-close="hidden">
          <div class="select-search">
            <el-input v-model="query.title" placeholder="商品搜索" class="handle-input mr10" size="small" clearable @clear="getList" />
            <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" @click="getList">搜索</el-button>
          </div>
          <el-table
            v-loading="loading"
            :data="tableData"
            height="350"
            class="cust-select-goods"
            style="width: 100%">
            <el-table-column
              label="商品"
              width="80">
              <template slot-scope="scope">
                <img :src="scope.row.cover" width="50" height="50"/>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                {{scope.row.title}}
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="80">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  v-loading.fullscreen.lock="fullscreenLoading"
                  @click="chooseGood(scope.row)"
                >选取
                </el-button>
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
        </el-dialog>
    </div>
</template>
<script>
import { goodsList } from '@/api/common'
import { getGoodsInfo } from '@/api/shopping'
import { parseTime } from '@/utils'
export default {
    name: 'SelectGoods',
    data() {
        return {
            dialogVisible: false,
            chooseImg: '', // 展示图片
            chooseTitle: '', // 商品名称
            goodOne: null, // 选中商品整个详情
            query: {
              cid: null,
              status: 1, // 上架商品
              startTime: null,
              endTime: null,
              title: ''
            },
            currentPage: 1, // 当前页
            pageSize: 5, // 每页显示条数
            total: 0, // 总条数
            loading: false,
            fullscreenLoading: false,
            tableData: []
        }
    },
    props: {
      cover: {
        type: String,
        default: () => ''
      },
      goodTitle: {
        type: String,
        default: () => ''
      }
    },
    watch: {
      cover(value) { // 编辑
        if(value) {
          this.chooseImg = value
        }
      },
      goodTitle(value) { // 编辑
        if(value) {
          this.chooseTitle = value
        }
      }
    },
    mounted() {
        this.getList()
    },
    methods: {
      // 弹窗选择商品
      async chooseGood(row) {
  
        const {id, cover, title} = row
        this.chooseImg = cover // 替换封面
        this.chooseTitle = title // 商品标题
        // 请求规格
        await this.getGoodsInfo(id)
        if(this.goodOne) {
          this.hidden()
          console.log('this.goodOne---', this.goodOne)
          this.$emit('change', this.goodOne)
        }
      },
      //  获取商品信息
      getGoodsInfo(id) {
        this.fullscreenLoading = true
        return getGoodsInfo({id}).then(res => {
          this.fullscreenLoading = false
          const { data } = res
          // 商品规格 分
          data.goodsPropertys.forEach(item => {
            item.originalPrice = item.originalPrice / 100
            item.price = item.price / 100
          })
          this.goodOne = data // 赋值商品详情
        }).catch(err => {
            this.fullscreenLoading = false
        })
      },
      choose() {
        this.show()
      },
      show() {
        this.dialogVisible = true
      },
      hidden() {
        this.dialogVisible = false
      },
      // 列表接口
      getList() {
        const {cid, status, startTime, endTime, title} = this.query
        const params = {
          cid: cid,
          status,
          startTime,
          endTime,
          title,
          zbPage: {
            current: this.currentPage,
            size: this.pageSize
          }

        }
        this.loading = true
        goodsList(params).then(res => {
          this.loading = false
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
      handleCurrentChange(val) {
        this.currentPage = val
        this.getList()
      },
      change() {
        console.log('value', this.value)
        // this.$emit('change', value)
      }
    }
}
</script>
<style lang="scss" scoped>
  .good-title{
    font-size: 12px;
  }
  .dialog-styles{
    /deep/.el-dialog__body{
      padding-top: 10px;
    }
  }
  /deep/.el-table::before{
    height: 0px;
  }
  .select-search{
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  /deep/.cust-select-goods{
    th{
      line-height: 30px;
      padding: 5px 0;
    }
    td{
      padding: 2px 0;
    }
  }
  .cover-goods{
    cursor: pointer;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    i.el-icon-plus{
      font-size: 28px;
      color: #8c939d;
    }
  }
</style>