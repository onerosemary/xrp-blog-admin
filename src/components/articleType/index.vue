<template>
  <div class="article-type">
    <el-select v-model="value" placeholder="分类" class="handle-select mr10" size="small" @change="change">
      <el-option v-for="(item, index) in dataList" :key="index" :label="item.name" :value="item.id" />
    </el-select>
  </div>
</template>
<script>
import { articleType } from '@/api/article'
export default {
  props: {
    cid: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      value: '',
      dataList: []
    }
  },
  watch: {
    cid(val) {
      if (val) {
        this.value = parseInt(val)
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      articleType().then(res => {
        // setTimeout(() => {
        //   if (this.cid === '') {
        //     const all = {
        //       id: null,
        //       name: '全部'
        //     }
        //     res.data.unshift(all)
        //   }
        // }, 30)

        this.dataList = res.data
      })
    },
    change() {
      this.$emit('change', this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
    .article-type{
        display: inline-block;
    }
</style>
