<template>
    <div class="goods-type">
        <el-select v-model="value" placeholder="分类" class="handle-select mr10" size="small" @change="change">
            <el-option v-for="(item, index) in dataList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
    </div>
</template>
<script>
import { goodsTypeList } from '@/api/common'
export default {
    data() {
        return {
            value: '',
            dataList: []
        }
    },
    props: {
        cid: {
            type: String,
            default: () => ''
        }
    },
    watch: {
        cid(val){
            if(val){
                this.value = parseInt(val)
            }
        }
    },
    mounted () {
        this.getList()
    },
    methods: {
        getList() {
            const data = {
                name: '',
                zbPage: {
                    current: -1,
                    size: -1
                }
            }
            goodsTypeList(data).then(res => {
               setTimeout(() => {
                   if(this.cid === ''){
                        const all = {
                            id: null,
                            name: '全部'
                        }
                        res.data.records.unshift(all)
                    }
               }, 30)
                
                
                this.dataList = res.data.records
            })
        },
        change() {
            this.$emit('change', this.value)
        }
    }
}
</script>
<style lang="scss" scoped>
    .goods-type{
        display: inline-block;
    }
</style>