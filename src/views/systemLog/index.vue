<template>
    <div class="container system-log">
        <div class="log-left">
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item name="1">
                    <template slot="title">
                    <div class="log-date">
                        <p>2020</p>
                        <p>01月</p>
                    </div>
                    </template>
                    <ul class="log-ul">
                        <li class="active">
                            <p>03月</p>
                            <p>100条</p>
                        </li>
                        <li>
                            <p>02月</p>
                            <p>99条</p>
                        </li>
                    </ul>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template slot="title">
                    <div class="log-date">
                        <p>2020</p>
                        <p>01月</p>
                    </div>
                    </template>
                    <ul class="log-ul">
                        <li>
                            <p>03月</p>
                            <p>100条</p>
                        </li>
                        <li>
                            <p>03月</p>
                            <p>99条</p>
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="log-right">
            <ul>
                <li>
                    <h3><p>用户名</p> <p class="date">23:32:45</p></h3>
                    <div class="log-msg">
                        <span>新增商品</span> 商品名称商品名称
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activeName: '1'
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