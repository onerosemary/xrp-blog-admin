<template>
  <div class="container">
    <el-radio-group v-has="'allCompanySum'" v-model="globalType" size="medium" class="global-box" @change="handleGlobal">
      <el-radio-button :label="0" >自己店</el-radio-button>
      <el-radio-button :label="1">所有店汇总</el-radio-button>
    </el-radio-group>
    <el-row :gutter="20">
      <el-col :span="15">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-shop grid-con-icon el-icon-location" />
                <div class="grid-cont-right">
                  <div class="grid-num">{{totalData.companyNumber}}</div>
                  <div>门店</div>
                  <p v-if="totalData.companyActiveNumber" class="grid-sub">近七日活跃 {{totalData.companyActiveNumber}} 家</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                
                <i class="el-icon-lx-people grid-con-icon el-icon-user-solid" />
                <div class="grid-cont-right">
                  <div class="grid-num">{{totalData.customerNumber}}</div>
                  <div>客户</div>
                  <p v-if="totalData.customerActiveNumber" class="grid-sub">昨日活跃 {{totalData.customerActiveNumber}} 人</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-goods grid-con-icon el-icon-coin" />
                <div class="grid-cont-right">
                  <div class="grid-num">{{totalData.totalAmont / 100}}</div>
                  <div>收入(元)</div>
                  <p v-if="totalData.totalYesterdayAmont" class="grid-sub">昨日 {{totalData.totalYesterdayAmont  / 100}}</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-people grid-con-icon el-icon-tickets" />
                <div class="grid-cont-right">
                  <div class="grid-num">{{totalData.orderNumber}}</div>
                  <div>订单</div>
                  <p v-if="totalData.orderAddNumber" class="grid-sub">今日新增 {{totalData.orderAddNumber}} 单</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-shop grid-con-icon el-icon-s-custom" />
                <div class="grid-cont-right">
                  <div class="grid-num">{{totalData.partnerNumber}}</div>
                  <div>合伙人</div>
                  <p v-if="totalData.partnerAddNumber" class="grid-sub">近七日新增 {{totalData.partnerAddNumber}} 人</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-goods grid-con-icon el-icon-document-remove" />
                <div class="grid-cont-right">
                  <div class="grid-num">{{totalData.rakeback / 100}}</div>
                  <div>返佣(元)</div>
                  <p v-if="totalData.rakebackYesterday" class="grid-sub">昨日 {{totalData.rakebackYesterday / 100}}</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="height:340px;">
          <div slot="header" class="clearfix" style="position: relative;">
            <span>销售数据</span>
            <div class="type-ve">
              <el-radio-group v-model="saleType" @change="getSaleData">
                <el-radio :label="0">30 天</el-radio>
                <el-radio :label="1">12 月</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="ve-echarts">
            <p class="avgSaleAmount" v-if="saleType === 0">日均销售: <b>￥{{avgSaleAmount}}</b></p>
            <p class="avgSaleAmount" v-if="saleType === 1">月均销售: <b>￥{{avgSaleAmount}}</b></p>
            <ve-histogram v-loading="loading" :data="chartData" :settings="chartSettings"  :legend-visible="false" :colors="colors"></ve-histogram>
          </div>
        </el-card>
      </el-col>
      <el-col :span="9">
          <el-card shadow="hover" >
          <div slot="header" class="clearfix">
            <span>待办清单</span>
          </div>
          <ul class="todoUl">
            <!-- 处理过 -->
            <!-- <li class="green">
              <div class="icon-div"><i class="el-icon-success"></i></div>
              <div>
                <p>返佣订单：XXXXXXX(订单商品名）</p>
                <p>订单金额：￥199 丨  返佣金额：￥19 丨 分销人：xxxx </p>
              </div>
            </li> -->
            <li v-for="(item, index) in undolistData" :key="index">
              <div class="icon-div"><i class="el-icon-warning"></i></div>
              <div v-if="parseInt(item.undoType) === 1">
                <p>退款订单：{{item.goodsName}}(订单商品名） </p>
                <p> 订单金额：￥{{item.orderAmount / 100}} 丨 退款金额：￥{{item.realAmount / 100}} 丨 退款人：{{item.customerName}} </p>
              </div>
              <div v-if="parseInt(item.undoType) === 2">
                <p>返佣订单：{{item.goodsName}}(订单商品名） </p>
                <p> 订单金额：￥{{item.orderAmount / 100}} 丨 返佣金额：￥{{item.realAmount / 100}} 丨 分销人：{{item.customerName}} </p>
              </div>
              <div class="handle-btn">
                <p><i class="el-icon-success" title="同意" @click="checkTodo(item)"></i></p>
                <p><i class="el-icon-error" title="拒绝" @click="checkTodo(item)"></i></p>
              </div>
            </li>
            
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {getSaleData, getTotal, undolist, rakeVerify, refundVerify} from '@/api/home'
export default {
  name: 'Dashboard',
  components: {
    // Schart
  },
  data() {
    this.chartSettings = {
      labelMap: {
        time: '时间',
        saleAmount: '销售额(￥)'
      }
    }
    this.colors = ['#409EFF']
    return {
      globalType: 0, 
      indexImg: require('@/static/login-bg.jpg'),
      todoList: [],
      data: [],
      totalData: {}, // 汇总
      saleType: 0, //  0:近30天数据 1:近12个月数据
      avgSaleAmount: 0,
      chartData: {
        columns: ['time', 'saleAmount'],
        rows: [
          // { '日期': '1/1', '当日销售': 1393}
        ]
      },
      loading: true,
      undolistData: []
    }
  },
  mounted() {
    // 汇总数据
    this.getTotal()
    // 销售数据
    this.getSaleData()
    // 代办清单查询
    this.undolist()
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  methods: {
    handleGlobal() {
      // 自己店/汇总店 切换
      // 汇总数据
      this.getTotal()
      // 销售数据
      this.getSaleData()
    },
    //  待办清单
    checkTodo(item, isOk) {
      if(item.undoType === 1 && isOk) { // 退款 同意

      }else if(item.undoType === 1 && isOk) { // 退款 不同意

      }
    },
    getTotal() {
      
      const params = {
        companyId: this.globalType === 0 ? this.companyId: null
      }
      getTotal(params).then(res => {
        this.totalData = res.data
      })
    },
    getSaleData() {
      // 重置
      this.chartData.rows = []
      const params = {
        companyId: this.globalType === 0 ? this.companyId: null,
        type: this.saleType 
      }
      this.loading = true
      getSaleData(params).then(res => {
        this.loading = false
        const {avgSaleAmount, dataVOS} = res.data
        this.avgSaleAmount = avgSaleAmount
        if(dataVOS.length > 0) {
          dataVOS.map(item => {
            item.saleAmount = item.saleAmount / 100
          })
          this.chartData.rows = dataVOS
        }
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    undolist() {
      const params = {
        zbPage: {
          current: 1,
          size: 100
        }
      }
      undolist(params).then(res => {
        const {records, pages} = res.data
        this.undolistData = records
      })
    }
  }
}
</script>

<style lang="scss" scoped>
ul, li{
  margin: 0;
  padding: 0;
  list-style:none;
}
.global-box{
  margin-bottom: 15px;
}
.ve-echarts{
  position: relative;
  .avgSaleAmount{
    position: absolute;
    left: 0;
    top: -7px;
    font-size: 13px;
    color: #999;
    b{
      font-size: 16px;
      color: #666;
    }
  }
}
.todoUl {
  li{
    position: relative;
    display: flex;
    
    font-size: 12px;
    background: #FAECD8;
    padding: 0 10px;
    border:1px solid rgba(250,236,216,1);
    border-radius:4px;
    color: #EAA26F;
    margin-bottom: 15px;
    .icon-div{
      
      padding: 11px 5px 0 0;
      i{
        font-size: 16px;
        color: #EAA26F;
      }
    }
    .handle-btn{
      display: flex;
      position: absolute;
      right: 5px;
      top: 7px;
      p{
        margin:0 5px;
        padding:0;
      }
      i{
        cursor: pointer;
        font-size: 22px;
        margin: 2px 0;
      }
      .el-icon-success{
        color: #67C23A;
        
      }
      .el-icon-error{
        color: #409EFF;
      }
    }
  }
  li{
    &.green{
      background: #F0F9EB;
      color: #67C23A;
      .icon-div{
        i{
          font-size: 16px;
          color: #67C23A;
        }
      }
    }
  }
}
.type-ve{
  position: absolute;
  right: 0;
  top: 0;
  /deep/ .el-radio{
    margin-right: 10px;
  }
}
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}
.grid-sub{
    font-size: 12px;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    /* background: rgb(45, 140, 240); */
    background: #eee;
}

.grid-con-1 .grid-num {
    color: #409EFF;
}

.grid-con-2 .grid-con-icon {
    /* background: rgb(100, 213, 114); */
    background: #eee;
}

.grid-con-2 .grid-num {
    color: #409EFF;
}

.grid-con-3 .grid-con-icon {
    /* background: rgb(242, 94, 67); */
    background: #eee;
}

.grid-con-3 .grid-num {
    color: #409EFF;
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
