<template>
  <div class="date-picker">
    <el-date-picker
      v-model="time"
      size="small"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      @change="change"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: ''
    }
  },
  methods: {
    change() {
      this.$emit('change', this.time)
    }
  }
}
</script>
<style lang="scss" scoped>
    .date-picker{
        display: inline-block;
        margin-right: 10px;
        /deep/.el-range-editor--small.el-input__inner{
            width: 250px;
        }
    }
</style>
