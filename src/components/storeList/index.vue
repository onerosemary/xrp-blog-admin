<template>
    <div class="store-type">
        <el-select v-model="value" placeholder="消费门店" class="handle-select mr10" size="small" @change="change">
            <el-option v-for="(item, index) in dataList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
    </div>
</template>
<script>
import { storeList } from '@/api/common'
export default {
    data() {
        return {
            value: null,
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
            storeList(data).then(res => {
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
    .store-type{
        display: inline-block;
    }
</style>