<template>
    <div class="store-type">
        <el-select v-model="value" :placeholder=" type ?'消费门店' : '注册门店'" class="handle-select mr10" size="small" @change="change">
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
        },
        type: { // 1是默认的 消费门店, 0是注册门店
            type: Number,
            default: () => 1
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
                // res.data.records.unshift({
                //     id: null,
                //     name: '全部'
                // })
                this.dataList = res.data.records
            })
        },
        change() {
            if(this.type) { // 消费门店 1
                this.$emit('change', this.value)
            }else { // 注册门店 0
                this.$emit('changeRegister', this.value)
            }
            
        }
    }
}
</script>
<style lang="scss" scoped>
    .store-type{
        display: inline-block;
    }
</style>