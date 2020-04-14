<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">客服设置</div>
      <p class="head-span-sub">设置客服信息</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="客服名称" prop="nickname" class="form-item-chat">
          <el-input v-model="form.nickname" size="small" placeholder="请填写" />
      </el-form-item>
      <fieldset class="fieldset-border">
        <legend>服务时间</legend>
        <el-form-item prop="week" style="margin-bottom: 10px">
          <el-checkbox-group v-model="checkboxGroup1" size="small" @change="changeWeek">
            <el-checkbox v-for="(item, index) in weekList" :key="index" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="时间" prop="serviceTime">
          <el-time-select
            size="small"
            placeholder="起始时间"
            v-model="startTime"
            :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
            }">
          </el-time-select>
         <el-time-select
            size="small"
            placeholder="结束时间"
            v-model="endTime"
            :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
                minTime: startTime
            }">
         </el-time-select>
        </el-form-item>  
      </fieldset>
      
      <fieldset class="fieldset-border">
        <legend>自动回复</legend>
        <el-form-item style="margin-top: 10px">
            <el-input
                class="form-item-chat2"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入"
                v-model="form.autoReply">
            </el-input>
        </el-form-item>
      </fieldset>
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { chatSetAdd, chatSetUpdate, chatSetGetInfo } from '@/api/client'
export default {
  data() {
    const checkWeek = (rule, value, callback) => {
      if (this.checkboxGroup1.length === 0) {
        callback(new Error('服务时间不可为空'))
      } else {
        callback()
      }
    }
    return {
      startTime: '',
      endTime: '',
      weekList: ['周一','周二','周三','周四','周五','周六','周天'],
      checkboxGroup1: [],
      queryId: -1, // 添加
      form: {
        nickname: '',
        serviceTime: '',
        week: '',
        autoReply: ''
      },
      rules: {
        nickname: [{ required: true, message: '不能为空', trigger: 'blur' }],
        week: [{ required: true, validator: checkWeek, trigger: 'blur' }]
      }
    }
  },

  mounted() {
    this.chatSetGetInfo()
  },
  methods: {
    // 选中周
    changeWeek() {
        const cbx = JSON.stringify(this.checkboxGroup1)
        this.form.week = JSON.parse(cbx).join(',')
    },
    //  获取客服设置信息
    chatSetGetInfo() {
      chatSetGetInfo().then(res => {
        const { id, nickname, week, serviceTime, autoReply  } = res.data
        if(id) { // 编辑
            this.queryId = id
        }
        // 转换 week
        if(week) {
            this.checkboxGroup1 = week.split(',')
        }
        // 转换 serviceTime
        if(serviceTime) {
            this.startTime = serviceTime.split(',')[0]
            this.endTime = serviceTime.split(',')[1]
        }
        this.form = {
           id,
           nickname,
           serviceTime,
           week,
           autoReply 
        }
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        
        if (valid) {
          
          this.form.serviceTime = `${this.startTime},${this.endTime}`
          
          if(parseInt(this.queryId) === -1){ // 添加
            chatSetAdd(this.form).then(res => {
              this.$message({
                message: '客服设置新增成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/client/chat'
            })
          }else { // 编辑
        
            chatSetUpdate(this.form).then(res => {
              this.$message({
                message: '客服设置编辑成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/client/chat'
            })
          }
          
        } else {
          console.log('error submit!!');
          return false
        }
      })
    }
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
    .body-span{
        width: 600px;
        /deep/.form-item-chat{
            width: 200px;
        }
        /deep/.form-item-chat2{
            font-size: 12px;
        }
    }
</style>
