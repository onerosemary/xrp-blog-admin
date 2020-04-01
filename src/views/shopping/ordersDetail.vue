<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">订单详情</div>
      <p class="head-span-sub">{{detailData.createTime}}</p>
    </div>
    <div class="order-detail">
        <div class="or-1">
            <div class="good-item">
                <p><img :src="imgUrl + detailData.goodsCover"  width="200" height="130"/></p>
                <p>{{detailData.goodsName}}</p>
            </div>
            <div class="good-spec">
                <div class="good-spec-item">
                    <p class="gs">规格</p>
                    <p>{{detailData.goodsSpecs}}</p>
                </div>
                <div class="good-pr">
                    <p class="gs">数量</p>
                    <p>{{detailData.goodsCnt}}</p>
                </div>
                <div class="good-pr">
                    <p class="gs">价格</p>
                    <p>{{detailData.goodsPrice}}</p>
                </div>
            </div>
            
            <div class="coupon-title">
                <p style="color: #9EA1A9;">优惠卷</p>
                <p class="name">需要接口提供字段</p>
            </div>
            <div class="good-spec">
                <div class="good-spec-item">
                    <p class="gs">类型</p>
                    <p>{{detailData.couponType}}</p>
                </div>
                <div class="good-pr">
                    <p class="gs">满</p>
                    <p>{{detailData.minPrice}}</p>
                </div>
                <div class="good-pr">
                    <p class="gs">减</p>
                    <p>{{detailData.couponAmount}}</p>
                </div>
            </div>
        </div>
        <div class="or-2">
            <div class="good-right">
                <p class="c1">实付金额</p>
                <p class="price">￥ {{detailData.orderAmount / 100}}</p>
            </div>
            <div class="good-right">
                <p class="c1">订单状态</p>
                <p class="c2" v-if="parseInt(detailData.status) === 1">
                    付定金
                </p>
                <p class="c2" v-if="parseInt(detailData.status) === 2">
                    已支付,待使用
                </p>
                <p class="c2" v-if="parseInt(detailData.status) === 3">
                    已支付,待发货
                </p>
                <p class="c2" v-if="parseInt(detailData.status) === 4">
                    已完成(发货、使用)
                </p>
                <p class="c2" v-if="parseInt(detailData.status) === 5">
                    申请退款
                </p>
                <p class="c2" v-if="parseInt(detailData.status) === 6">
                    退款待财务审核
                </p>
                <p class="c2" v-if="parseInt(detailData.status) === 7">
                    退款待总经理审核
                </p>
                <p class="c2" v-if="parseInt(detailData.status) === 8">
                    退款完成
                </p>
            </div>
            <div class="good-right">
                <p class="c1">收货人</p>
                <p class="c2">{{detailData.consigneeName}}</p>
            </div>
            <div class="good-right">
                <p class="c1">手机号</p>
                <p class="c2">{{detailData.consigneePhone}}</p>
            </div>
            <div class="good-right">
                <p class="c1">地址</p>
                <p class="c2">{{detailData.consigneeAddress}}</p>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import { orderDetail } from '@/api/shopping'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      detailData: {}
    }
  },
  mounted() {
    if(parseInt(this.queryId) !== -1){ // 编辑
      this.orderDetail()
    }
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return parseInt(this.$route.query.id)
    }
  },
  methods: {
    //  获取商品信息
    orderDetail() {
      orderDetail({id: this.queryId}).then(res => {
        res.data.createTime = parseTime(res.data.createTime)
        this.detailData = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
   .order-detail{
       display: flex;
       padding-top: 30px;
       .or-1{
           flex: 3;
           .good-item{
               width: 130px;
               p{
                   font-size: 13px;
                   color: #2C3F58;
                   margin: 0;
                   padding-top: 10px;
               }
           }
           .good-spec{
               width: 60%;
               margin-top: 20px;
               border-top: 1px solid #eee;
               display: flex;
               div{
                   width: 150px;
                   margin-right: 20px;
                   font-size: 13px;
               }
               .gs{
                   color: #9EA1A9;
               }
           }
           .coupon-title{
               font-size: 13px;
           }
       }
       .c1{
           color: #9EA1A9;
           font-size: 13px;
       }
       .or-2{
           border-left: 1px solid #eee;
           flex: 1;
           padding-right: 30px;
           .good-right{
               text-align: right;
               margin-bottom: 30px;
               .price{
                   font-size: 36px;
                   color: #2C3F58;
               }
               .c2{
                   font-size: 13px;
                   padding-left: 20px;
               }
               p{
                   margin: 0;
                   padding: 0;
               }
           }
       }
   }
</style>
