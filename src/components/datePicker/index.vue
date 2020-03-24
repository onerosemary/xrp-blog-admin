<template>
    <div class="date-picker">
        <el-date-picker
            size="small"
            v-model="time"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="change"
            value-format="yyyy-MM-dd"
            >
        </el-date-picker>
    </div>
</template>
<script>
export default {
    data() {
        return{
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