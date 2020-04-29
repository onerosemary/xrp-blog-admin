<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">客户资料</div>
      <p class="head-span-sub">客户个人资料及相关信息</p>
    </div>
    <div class="client-detail">
        <div class="client-left">
          <fieldset class="fieldset-border">
            <legend>账号信息</legend>
            <div class="account-box">
                <div class="avatar">
                    <img class="list-img" width="100" height="100" :src="imgUrl + detailData.headPic" />
                </div>
                <div class="row">
                    <div class="col">
                        <h5>昵称</h5>
                        <p>{{detailData.nickname}}</p>
                    </div>
                    <div class="col">
                        <h5>身份</h5>
                        <p>{{parseInt(detailData.identity) === 0 ? '客户' : '合伙人'}}</p>
                    </div>
                    <div class="col">
                        <h5>等级</h5>
                        <p v-if="parseInt(detailData.level) === 0">无</p>
                        <p v-if="parseInt(detailData.level) === 1">Lv 1</p>
                        <p v-if="parseInt(detailData.level) === 2">Lv 2</p>
                        <p v-if="parseInt(detailData.level) === 3">Lv 3</p>
                    </div>
                    <div class="col">
                        <h5>积分</h5>
                        <p>{{detailData.points}}</p>
                    </div>
                    <div class="col">
                        <h5>消费总额</h5>
                        <p>{{detailData.totalMoney | price}}</p>
                    </div>
                    <div class="col">
                        <h5>注册时间</h5>
                        <p>{{detailData.createTime}}</p>
                    </div>
                    <div class="col">
                        <h5>注册门店</h5>
                        <p>{{detailData.companyName}}</p>
                    </div>
                    <div class="col">
                        <h5>所在地</h5>
                        <p>{{detailData.address}}</p>
                    </div>
                    <div class="col">
                        <h5>主要消费项目</h5>
                        <p>{{detailData.mainConsumptionItems}}</p>
                    </div>
                </div>
            </div>
          </fieldset>
          <fieldset class="fieldset-border">
            <legend>详细信息</legend>
            <div class="row">
                <div class="col">
                    <h5>姓名</h5>
                    <p>{{detailData.name}}</p>
                </div>
                <div class="col">
                    <h5>联系方式</h5>
                    <p>{{detailData.phone}}</p>
                </div>
                <div class="col">
                    <h5>性别</h5>
                    <p v-if="parseInt(detailData.sex) === 0">未知</p>
                    <p v-if="parseInt(detailData.sex) === 1">男</p>
                    <p v-if="parseInt(detailData.sex) === 2">女</p>
                </div>
                <!-- <div class="col">
                    <h5>身高（cm）</h5>
                    <p>{{detailData.height}}</p>
                </div>
                <div class="col">
                    <h5>体重（kg）</h5>
                    <p>{{detailData.weight}}</p>
                </div> -->
                <div class="col">
                    <h5>出生日期</h5>
                    <p>{{detailData.birthday}}</p>
                </div>
            </div>
          </fieldset>
          <fieldset class="fieldset-border">
            <legend>消费信息</legend>
            <div class="row2">
                <h5>消费门店</h5>
                <h5>消费金额</h5>
                <h5>消费次数</h5>
                <h5>最后消费时间</h5>
                <h5>操作</h5>
            </div>
            <div v-if="detailData.consumption && detailData.consumption.length > 0">
                <div class="row2" v-for="(item, index) in detailData.consumption" :key="index">
                    <p class="col2">
                        {{item.companyName}}
                    </p>
                    <p class="col2">
                        {{item.totalMoney | price}}
                    </p>
                    <p class="col2">
                        {{item.totalNumber}}
                    </p>
                    <p class="col2">
                        {{item.lastTime}}
                    </p>
                    <p class="col2">
                        <el-button
                        type="text"
                        size="mini"
                        >详情</el-button>
                    </p>
                </div>
            </div>
            <div class="no-data1" v-else>
                暂无消费记录
            </div>
          </fieldset>
        </div>
        <div class="client-right">
            <div class="client-log">
                <h3 class="client-log-title">客户信息日志</h3>
                <el-scrollbar class="infinite-list-wrapper" style="height: 350px">
                    <ul class="log-ul" v-if="clientLog.length > 0">
                        <li v-for="(log, i) in clientLog" :key="i">
                            <div><i class="el-icon-warning-outline"></i> {{log.createTime}}</div>
                            <p>{{log.remark}}</p>
                        </li>
                    </ul>
                    <div class="no-data1" style="height: 350px; line-height: 350px" v-else> 暂无日志记录</div>
                </el-scrollbar>
                <div class="send">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                        <el-form-item prop="remark">
                            <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入内容"
                                v-model="ruleForm.remark">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <div class="add-btn"><el-button type="primary" size="small" @click="submitForm('ruleForm')">添加日志</el-button></div>
                        </el-form-item>
                    </el-form>

                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import { clientGetInfoById, clientLogList, clientLogAdd } from '@/api/client'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      detailData: {},
      clientLog: [],
      ruleForm: {
          remark: '', // 添加客户信息
      },
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示条数
      total: 0, // 总条数
      rules: {
        remark: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    if(parseInt(this.queryId) !== -1){ // 编辑
      this.clientGetInfoById()
    }
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return parseInt(this.$route.query.id)
    }
  },
  methods: {
    //  获取客户信息
    clientGetInfoById() {
      clientGetInfoById({id: this.queryId}).then(res => {
        res.data.createTime = parseTime(res.data.createTime)
        if(res.data.consumption) {
            res.data.consumption.map(item => {
                item.lastTime = parseTime(item.lastTime)
            })
        }
        this.detailData = res.data
        // 客户日志列表
        this.searchLog()
      })
    },

    // 查询某客户的追踪日志
    searchLog() {
        const params = {
            customerId: this.queryId,
            zbPage: {
                current: this.currentPage,
                size: this.pageSize
            }
        }
        clientLogList(params).then(res => {
            const { records, total } = res.data
            records.map(item => {
                item.createTime = parseTime(item.createTime)
            })
            this.clientLog = records
            this.total = parseInt(total)
        })
    },
    // 提交日志
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                const params = {
                    customerId: this.queryId,
                    remark: this.ruleForm.remark
                }
                clientLogAdd(params).then(res => {
                    this.$message({
                        message: '添加日志成功',
                        type: 'success'
                    })
                    this.searchLog()
                })
            } else {
                console.log('error submit!!')
                return false
            }
        })
    },
  }
}
</script>
<style lang="scss" scoped>
    .fieldset-border{
        border: 1px dashed #ccc;
        border-radius: 5px;
        margin-bottom: 20px;
        font-size: 14px;
        legend{
            color: #29BEC6;
        }
    }
    .no-data1{
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 12px;
        color: #ADB1B5;
    }
   .client-detail{
       display: flex;
       padding-top: 30px;
       .client-left{
           flex: 3;
           .account-box{
               display: flex;
               .avatar{
                   margin: 15px 20px 0 0;
               }
           }
           .row{
               display: flex;
               .col{
                   margin: 0 15px;
                   h5{
                       color: #ADB1B5;
                   }
                   p{
                       color: #2C3F58;
                       font-size: 13px;
                   }
               }
           }
           .row2{
               display: flex;
               h5{
                   flex: 1;
                   color: #ADB1B5;
               }
               .col2{
                   flex: 1;
                   color: #2C3F58;
                   font-size: 13px;
               }
           }
           
       }
       .client-right{
           
           flex: 1;
           margin-left: 20px;
           .client-log{
               position: relative;
               min-height: 500px;
               box-shadow:0px 3px 9px rgba(0,0,0,0.08);
               border-radius:8px;
               .client-log-title{
                   padding: 15px 15px 0 15px;
                   font-size: 14px;
                   color: #29BEC6;
               }
               .send{
                    position: absolute;
                    bottom: 15px;
                    left: 0;
                    padding: 0 15px;
                    width: 100%;
                    /deep/.el-textarea__inner{
                        font-size: 12px;
                    }
                    /deep/.el-form-item{
                        margin-bottom: 0;
                    }
                }
               .add-btn{
                   padding-top: 5px;
                   text-align: right;
               }
           }
           .log-ul{
                margin: 0;
                padding: 0 15px;
               li{
                   margin: 0 0 10px 0;
                   padding: 5px;
                   list-style: none;
                   font-size: 12px;
                   background: #F0F9EB;
                   color: #67C23A;
                   border-radius:4px;
                   p{
                       margin: 5px 0 0 0;
                       padding: 0;
                   }
                   
               }
           }
           
       }
   }
</style>
