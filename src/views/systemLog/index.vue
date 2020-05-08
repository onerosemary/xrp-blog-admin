<template>
    <div class="container system-log">
        <el-scrollbar class="infinite-list-wrapper log-left" :style="{overflowY: 'auto', height: heightV(90)}">
            
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item :name="index" v-for="(item, index) in yearData" :key="index">
                    <template slot="title">
                        <div class="log-date" @click="currentYear(item)">
                            <p>{{item.operateYear}}</p>
                            <p>{{item.operateMonth}}月</p>
                        </div>
                    </template>
                    <ul class="log-ul">
                        <li :class="{active: activeIndex1 === index && activeIndex2 === n}" v-for="(day, n) in currentDayList" :key="n" @click="clickCurrentDay(item.operateYear, item.operateMonth, day.operateDay, index, n)">
                            <p>{{day.operateDay}} 日</p>
                            <p>{{day.cnt}} 条</p>
                        </li>
                    </ul>
                </el-collapse-item>
                
            </el-collapse>
       
        </el-scrollbar>
        
        <div class="log-right">
            <el-scrollbar v-if="currentRightList.length > 0" class="infinite-list-wrapper" :style="{overflowY: 'auto', height: heightV(90)}">
                <ul
                    v-infinite-scroll="currentDay"
                    infinite-scroll-distance="40"
                    infinite-scroll-disabled="disabled">
                    <li v-for="(record, i) in currentRightList" :key="i">
                        <h3><p>{{record.operateName}}</p> <p class="date">{{record.createTime}}</p></h3>
                        <div class="log-msg">
                            <p v-html="record.relateDes"></p>
                        </div>
                    </li>
                </ul>
                <p v-if="currentRightList.length > 0 && loading" class="tips-loading">加载中...</p>
                <p v-if="currentRightList.length > 0 && noMore" class="tips-loading">没有更多了</p>
            </el-scrollbar>
            <div v-else class="no-datas">
                暂无数据
            </div>
        </div>
    </div>
</template>
<script>
import {yearOperate, monthOperate, dayOperate} from '@/api/systemLog'
import { debounce } from '@/utils'
export default {
    data() {
        return {
            activeIndex1: 0, // 点击选中当前
            activeIndex2: 0, // 点击选中当前
            activeName: 0,
            yearData: [], // 左边 年与月 列表
            currentDayList: [], // 左边 当前年与月的 日与条数 列表
            currentRightList: [], // 右边 当前日 记录操作列表
            loading: false,
            currentPage: 1, // 当前页
            sizePage: 10, // 每页显示条数
            totalPage: 0, // 总页数
            memory: {}, // 记录点击的菜单参数
            isFirst: true // 只调用进入页面第一次
        }
    },
    mounted() {
        this.yearList()
        window.addEventListener('resize', this.resize, true)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize, true)
    },
    computed: {
        noMore() {
            return this.currentPage > this.totalPage
        },
        disabled() {
            return this.loading || this.noMore
        }
    },
    methods: {
        resize: debounce(function() {
            this.currentPage = 1
            this.currentRightList = [] // 先清空
            this.currentDay()
        }, 300),
        // 年和月 列表
        yearList() {
            yearOperate({}).then(res => {
                this.yearData = res.data.records
                // 默认调用当前第一个展开列表
                this.currentYear(this.yearData[0])
            })
        },
        // 点击左边 当前年与月
        currentYear(item) {
            
            const {operateYear:year, operateMonth:month} = item
            let params= {
                year,
                month
            }
            monthOperate(params).then(res => {
                this.currentDayList = res.data

                // 默认调用当前第一个 右边列表
                this.memory = { // 记录点击左边参数
                    year,
                    month,
                    day: this.currentDayList[0].operateDay
                }
                if(this.isFirst){ // 默认只调1次
                    this.isFirst = false
                    this.currentDay()
                }
            })
        },
        clickCurrentDay(year, month, day, index, n) {
            this.activeIndex1 = index // 一级索引
            this.activeIndex2 = n // 二级索引

            // 重置
            this.memory = {}
            this.currentPage = 1
            this.currentRightList = []

            this.memory = {
                year,
                month,
                day
            }
            this.currentDay()
        },
        // 点击左边 当前日
        currentDay() {
            this.loading = true
            const {year, month, day} = this.memory
            let params= {
                year,
                month,
                day,
                zbPage: {
                    current: this.currentPage,
                    size: this.sizePage
                }
            }
            dayOperate(params).then(res => {
                const { records, pages } = res.data
                if (records.length > 0) {
                    this.currentPage++
                    this.currentRightList = this.currentRightList.concat(records)
                    this.totalPage = parseInt(pages)
                    this.loading = false
                } else {
                    this.loading = true
                }
 
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.system-log{
    display: flex;
    height: 100%;
    .log-left{
        flex: 1;
        .log-date{
            width: 100%;
            padding: 0 5px;
            display: flex;
            font-size: 14px;
            justify-content: space-between;
            p{
                margin: 0;
                padding: 0
            }
        }
        .log-ul {
            margin: 0;
            padding: 0;
            li{
                display: flex;
                cursor: pointer;
                justify-content: space-between;
                background: #F6F8FC;
                padding: 0 10px;
                margin: 0 0 1px 0;
                
                &.active{
                    background: #409EFF;
                    color: #fff;
                }
                p{
                    margin: 0;
                    padding: 5px 0;
                }
            }
        }
    }
    .log-right{
        flex: 3;
        margin-left: 20px;
        ul{
            margin: 0;
            padding: 0;
            li{
                margin: 0;
                padding: 0;
                list-style: none;
                h3{
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                    .date{
                        font-weight: lighter;
                        color: #9EA1A9;
                    }
                }
                .log-msg{
                    background: #F6F8FC;
                    padding: 5px 0;
                    text-indent: 1em;
                    font-size: 13px;
                    //color: #9EA1A9;
                    p{
                        display: inline-block;
                        margin-right: 10px;
                        color: #409EFF;
                        span{
                            color: #9EA1A9;
                        }   
                    }
                }
            }
        }
    }
}
</style>