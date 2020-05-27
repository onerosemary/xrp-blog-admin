<template>
  <div class="store-type">
    <el-select v-model="value" placeholder="角色" class="handle-select mr10" size="small" @change="change">
      <el-option v-for="(item, index) in dataList" :key="index" :label="item.name" :value="item.id" />
    </el-select>
  </div>
</template>
<script>
// import { roleList } from '@/api/common'
export default {
  props: {
    cid: {
      type: String,
      default: () => ''
    },
    all: { // 是否显示全部
      type: Boolean,
      default: true
    },
    door: { // 当前用户是超级管理员roleId=1  选择的companyId不等于1 则角色只显示 门店管理员 选项
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      value: null,
      dataList: []
    }
  },
  watch: {
    cid(val) {
      if (val) {
        this.value = parseInt(val)
      }
    },
    door(val) {
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      const data = {
        name: '',
        zbPage: {
          current: 1,
          size: 10000
        }
      }
      roleList(data).then(res => {
        if (this.all) {
          res.data.records.unshift({
            id: '',
            name: '全部'
          })
        }
        if (!this.door) { // 门店管理员
          this.dataList = res.data.records.filter(item => item.id === 2)
        } else {
          this.dataList = res.data.records
        }
      })
    },
    change() {
      this.$emit('change', this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
    .store-type{
        display: inline-block;
    }
</style>
