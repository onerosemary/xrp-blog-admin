<template>
    <div class="select-goods">
        <el-select
            size="small"
            v-model="value"
            filterable
            @change="change"
            placeholder="请选择商品">
            <el-option
                v-for="item in tableData"
                :key="item.id"
                :label="item.title"
                :value="item.id">
            </el-option>
        </el-select>
    </div>
</template>
<script>
import { goodsList } from '@/api/common'
export default {
    name: 'SelectGoods',
    data() {
        return {
            value: '',
            tableData: []
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
      // 列表接口
      getList() {
        const params = {
          cid: null, // 关键词
          status: null,
          isNew: null,
          startTime: null,
          endTime: null,
          title: null,
          zbPage: {
            current: 1,
            size: 10000
          }

        }
        goodsList(params).then(res => {
          const { records } = res.data
          // imgUrl 
          records.forEach((item, index) => {
            item.cover = this.imgUrl + item.cover
          })
          this.tableData = records
        })
      },
      change() {
        console.log('value', this.value)
        // this.$emit('change', value)
      }
    }
}
</script>