<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">优惠卷</div>
      <p class="head-span-sub">{{queryId === -1 ? '添加优惠卷信息': '编辑优惠卷信息'}}</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
        <el-form-item label="名称" prop="title" style="width: 605px">
            <el-input v-model="form.title" size="small" placeholder="请填写" />
        </el-form-item>
        <div class="group-item">
            <el-form-item label="类型" prop="couponType">
                <el-select v-model="form.couponType" placeholder="请选择"  class="handle-select mr10" size="small">
                    <el-option label="商品优惠券" :value="1" />
                    <el-option label="无门槛抵扣券" :value="2" />
                    <el-option label="满减券" :value="3" />
                    <el-option label="现金红包" :value="4" />
                </el-select>
            </el-form-item>
            <div v-show="parseInt(form.couponType) === 1" class="h-f">
              <el-form-item label="优惠金额" prop="couponPrice" :rules = "[{ required: true, message: '不能为空', trigger: 'blur' }]">
                  <el-input v-model="form.couponPrice" size="small" placeholder="请填写" />
              </el-form-item>
              <el-form-item 
              label="选择商品" 
              :prop="parseInt(form.couponType) === 1 ? 'goodsId' : ''"
              :rules = "[{ required: true, message: '不能为空', trigger: 'change' }]"
              >
                  <select-goods class="good-c" :cover="goodsCover" @change="changeGood"></select-goods>
              </el-form-item>
            </div>
            <div v-show="parseInt(form.couponType) === 2" class="h-f">
              <el-form-item label="优惠金额" :prop="parseInt(form.couponType) === 2 ? 'couponPrice': ''" :rules = "[{ required: true, message: '不能为空', trigger: 'blur' }]">
                  <el-input v-model="form.couponPrice" size="small" placeholder="请填写" />
              </el-form-item>
            </div>
            <div v-show="parseInt(form.couponType) === 3" class="h-f">
              <el-form-item label="满" :prop="parseInt(form.couponType) === 3 ? 'minPrice': ''" :rules = "[{ required: true, message: '不能为空', trigger: 'blur' }]">
                  <el-input v-model="form.minPrice" size="small" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="减" :prop="parseInt(form.couponType) === 3 ? 'couponPrice': ''" :rules = "[{ required: true, message: '不能为空', trigger: 'blur' }]">
                  <el-input v-model="form.couponPrice" size="small" placeholder="请填写" />
              </el-form-item>
            </div>
            <div v-show="parseInt(form.couponType) === 4" class="h-f">
              <el-form-item label="金额" :prop="parseInt(form.couponType) === 4 ? 'couponPrice': ''" :rules = "[{ required: true, message: '不能为空', trigger: 'blur' }]">
                  <el-input v-model="form.couponPrice" size="small" placeholder="请填写" />
              </el-form-item>
            </div>
        </div>
        
        <div class="group-item">
            <el-form-item label="有效截止时间" prop="endTime">
                <el-date-picker
                size="small"
                v-model="form.endTime"
                type="datetime"
                placeholder="选择时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                >
                </el-date-picker>
            </el-form-item>
            
            <el-form-item label="每人限领数" prop="limitCnt">
                <el-input v-model="form.limitCnt" size="small" placeholder="请填写" />
            </el-form-item>
            <el-form-item label="预发数量" prop="stock">
                <el-input v-model="form.stock" size="small" placeholder="请填写" />
            </el-form-item>
        </div>
        <el-form-item label="设为用户资料补充奖励" prop="isPerfect" style="width: 605px">
            <el-radio-group v-model="form.isPerfect">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
        </el-form-item>
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { getCategoryInfo } from '@/api/shopping'
import { discountAdd, discountGetInfo, discountUpdate } from '@/api/actives'
import { parseTime } from '@/utils/index'
import selectGoods from '@/components/selectGoods'
export default {
  data() {
    return {
      selectOne: null, // 选中的商品
      time: null,
      goodsCover: '', // 选中商品封面(编辑)
      form: {
        title: '', // 优惠券名称
        couponPrice: '', // 优惠金额/抵扣金额/满减金额/红包金额 单位:分
        couponType: '', // 优惠券类型
        endTime: '', // 截止时间
        goodsId: '', // 商品id
        limitCnt: '', // 每人限领数量
        minPrice: '', // 满减券：最低消费价格
        stock: '', // 总库存数量
        isShow: 0, // 是否首页弹框展示 0:否 1:是
        isPerfect: 0, // 0:否 1:是
      },
      pickerOptions: {
          disabledDate(time) { // 禁止当前日期前一天
            return time.getTime() < Date.now() - 8.64e7
          }
      },
      rules: {
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        couponType: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        limitCnt: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
      selectGoods
  },
  watch: {
  },
  mounted() {
    if(parseInt(this.queryId) !== -1){ // 编辑
      this.discountGetInfo()
    }
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return parseInt(this.$route.query.id)
    }
  },
  methods: {
    //  获取选中商品详情
    changeGood(data) {
      this.selectOne = data // 赋值
      this.form.goodsId = data.id
      // 校验
      this.$refs.form.validateField('goodsId')
      
    },
    //  获取优惠劵详情信息
    discountGetInfo() {
      discountGetInfo({id: this.queryId}).then(res => {
        console.log('res.data---', res.data)
        let { id, title, couponPrice, couponType, endTime, goodsId, limitCnt, minPrice, stock, goodsCover, isShow, isPerfect } = res.data
        this.goodsCover = this.imgUrl + goodsCover // 商品封面
        this.form = {
            id, // 编辑id
            title, // 优惠券名称
            couponPrice: couponPrice / 100, // 优惠金额/抵扣金额/满减金额/红包金额 单位:分
            couponType, // 优惠券类型
            endTime: parseTime(endTime), // 截止时间
            goodsId, // 商品id
            limitCnt, // 每人限领数量
            minPrice: minPrice / 100, // 满减券：最低消费价格
            stock, // 总库存数量
            isShow, // 是否首页弹框展示 0:否 1:是
            isPerfect
        }
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          if(this.form.couponPrice) {
            this.form.couponPrice = this.form.couponPrice * 100
          }
          if(this.form.minPrice) {
            this.form.minPrice = this.form.minPrice * 100
          }
          
          if(parseInt(this.queryId) === -1){ // 添加
            discountAdd(this.form).then(res => {
              this.$message({
                message: '优惠劵新增成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/actives/discount'
            })
          }else { // 编辑
            discountUpdate(this.form).then(res => {
              this.$message({
                message: '优惠劵编辑成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/actives/discount'
            })
          }
          
        } else {
          console.log('error submit!!');
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    /deep/.good-c{
        // position: relative;
        // top: 10px;
        .cover-goods{
            width: 60px;
            height: 60px;
            img{
                width: 60px;
                height: 60px;
            }
        }
    }
    /deep/.handle-select{
      width: 150px;
    }
    .h-f{
      display: flex;
    }
    .body-span{
      width: 707px;
      padding-top: 15px;
      .group-item{
        display: flex;
        /deep/.el-form-item{
          margin-right: 20px;
        }
        /deep/ .custom-date-picker{
            width: 350px;
        }
      }
      // .el-form-item{
      //     margin-bottom: 0;
      // }
      .group-property-item{
        /deep/.el-form-item{
            margin-bottom: 0;
        }
        margin-top: 40px;
        .group-property-title{
          margin-bottom: 15px;
        }
        ul{
          display: flex;
          padding: 0;
          margin: 0 0 22px 0;
          li{
            list-style: none;
            display: flex;
            align-items: center;
            font-size: 13px;
            color: #606266;
          }
          .w200{
            width: 200px;
          }
          .w80{
            width: 80px;
            margin-left: 10px;
          }
          .w130{
            width: 130px;
            margin-right: 20px;
          }
        }
      }
      /deep/ .form-item-header{
        color: #ADB1B5;
        margin-bottom: 0;
        height: 30px;
        line-height: 30px;
        div{
          font-size: 12px;
        }
        .f-i-h{
          margin-right: 130px;
        }
      }
      /deep/.add-form-item{
        margin-bottom: 0;
        .add-new-input{
          width: 100%;
          line-height: 18px;
          text-align: right;
          font-size: 12px;
          color: #29BEC6;
          padding-right: 97px;
          span{
            cursor: pointer;
          }
        }
      }

    }
</style>
