<template>
    <div class="container system-log">
        <div class="log-left">
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item :name="index" v-for="(item, index) in yearData" :key="index">
                    <template slot="title">
                        <div class="log-date" @click="currentYear(item)">
                            <p>{{item.operateYear}}</p>
                            <p>{{item.operateMonth}}月</p>
                        </div>
                    </template>
                    <ul class="log-ul">
                        <li v-for="(day, n) in currentDayList" :key="n" @click="currentDay(item.operateYear, item.operateMonth, day.operateDay)">
                            <p>{{day.operateDay}} 日</p>
                            <p>{{day.cnt}} 条</p>
                        </li>
                    </ul>
                </el-collapse-item>
                
            </el-collapse>
        </div>
        <div class="log-right">
            <ul>
                <li v-for="(record, i) in currentRightList" :key="i">
                    <h3><p>{{record.operateName}}</p> <p class="date">{{record.createTime}}</p></h3>
                    <div class="log-msg">
                        <span>{{record.operateType}}</span> {{record.relateDes}}
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {yearOperate, monthOperate, dayOperate} from '@/api/systemLog'
export default {
    data() {
        return {
            activeName: 0,
            yearData: [], // 左边 年与月 列表
            currentDayList: [], // 左边 当前年与月的 日与条数 列表
            currentRightList: [] // 右边 当前日 记录操作列表
        }
    },
    mounted() {
        this.yearList()
    },
    methods: {
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
                this.currentDay(year, month, this.currentDayList[0].operateDay)
            })
        },
        // 点击左边 当前日
        currentDay(year, month, day) {
            let params= {
                year,
                month,
                day
            }
            dayOperate(params).then(res => {
                this.currentRightList = res.data.records
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.system-log{
    display: flex;
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
                    color: #9EA1A9;
                    span{
                        display: inline-block;
                        margin-right: 10px;
                        color: #409EFF;   
                    }
                }
            }
        }
    }
}
</style>