<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">秒杀设置</div>
      <p class="head-span-sub">{{queryId === -1 ? '添加秒杀信息': '编辑秒杀信息'}}</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="选择秒杀商品" prop="cover">
        <select-goods :cover="form.cover" @change="changeGood"></select-goods>
      </el-form-item>
      <div class="group-item">
        <el-form-item label="秒杀时间设置" prop="time">
            <el-date-picker
              class="custom-date-picker"
              @change="changeTime"
              size="small"
              v-model="form.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="每人限购" prop="purchaseLimit">
            <el-input v-model="form.purchaseLimit" size="small" placeholder="请填写" />
        </el-form-item>
        <el-form-item label="已参加人数" prop="joinNumber">
            <el-input v-model="form.joinNumber" size="small" placeholder="请填写" />
        </el-form-item>
      </div>
      <div class="group-property-item" v-if="form.seckillGoodsProperty.length > 0">
        <ul class="group-property-title">
          <li class="w200">规格</li>
          <li class="w80">价格(￥)</li>
          <li class="w80">库存</li>
          <li class="w130">秒杀价(￥)</li>
          <li class="w130">预置出售数量</li>
        </ul>
        <ul v-for="(item, index) in form.seckillGoodsProperty" :key="index">
          <li class="w200">{{item.name}}</li>
          <li class="w80">{{item.oriPrice}}</li>
          <li class="w80">{{item.stock}}</li>
          <li class="w130">
            <el-form-item 
              :prop="'seckillGoodsProperty.' + index + '.price'"
              :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }"
            >
              <el-input v-model="item.price" size="small" placeholder="请填写" />
            </el-form-item>
          </li>
          <li class="w130">
            <el-form-item 
              :prop="'seckillGoodsProperty.' + index + '.maxStock'"
              :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }"
            >
              <el-input v-model="item.maxStock" size="small" placeholder="请填写" />
            </el-form-item>
          </li>
        </ul>
      </div>
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { getCategoryInfo } from '@/api/shopping'
import { seckillAdd, seckillIsGetInfo, seckillUpdate } from '@/api/actives'
import selectGoods from '@/components/selectGoods'
import { parseTime } from '@/utils/index'
export default {
  data() {
    const cover = (rule, value, callback) => {
      if (this.form.cover === '') {
        callback(new Error('封面图片不可为空'))
      } else {
        callback()
      }
    }
    return {
      selectOne: null, // 选中的商品
      time: null,
      form: {
        time: null, // 秒杀时间
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        goodsId: '', // 商品id
        cover: '', // 商品封面
        joinNumber: '', // 参与人数
        purchaseLimit: '', // 每人限购, 0 为不限购
        seckillGoodsProperty: [], // 商品规格
      },
      pickerOptions: {
          disabledDate(time) { // 禁止当前日期前一天
            return time.getTime() < Date.now() - 8.64e7
          }
      },
      rules: {
        cover: [
          { required: true, validator: cover, trigger: 'change' }
        ],
        time: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        joinNumber: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        purchaseLimit: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
      selectGoods
  },
  watch: {
    'form.cover': {
      handler(value) {
        if(value){
          // 校验 图片方法
          this.$refs.form.validateField('cover')
        }
      },
      deep: true
    }
  },
  mounted() {
    if(parseInt(this.queryId) !== -1){ // 编辑
      this.seckillIsGetInfo()
    }
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return parseInt(this.$route.query.id)
    }
  },
  methods: {
    changeTime() {
        if(this.form.time.length > 0) {
          const [startTime, endTime] = this.form.time
          this.form.startTime = startTime
          this.form.endTime = endTime
        }else {
          this.form.startTime = null
          this.form.endTime = null
        }        
    },
    //  获取选中商品详情
    changeGood(data) {
      this.form.seckillGoodsProperty = [] //  初始化
      this.selectOne = data // 赋值
      
      // 封面赋值
      this.form.cover =this.imgUrl + data.cover
      // 商品id
      this.form.goodsId = data.id
      
      // 组装后端需要商品规格的数据
      const seckillGoodsProperty = []
      data.goodsPropertys.forEach(item => {
        seckillGoodsProperty.push({
          goodsId: data.id, //  商品id
          propertyId: item.id, // 商品规格id
          isShow: 1, // 是否参与分销 1-参与 0-未参与
          name: item.name,
          oriPrice: item.price, // 现价
          stock: item.stock // 库存数量
        })
      })

      this.form.seckillGoodsProperty = seckillGoodsProperty
    },
    //  获取拼团详情信息
    seckillIsGetInfo() {
      seckillIsGetInfo({id: this.queryId}).then(res => {
        let { id, goodsId, cover, startTime, endTime, joinNumber, purchaseLimit, propertyVOS:seckillGoodsProperty } = res.data
        seckillGoodsProperty.forEach(item => { // 价格 单位 元
          item.goodsId = goodsId
          item.oriPrice = item.originalPrice / 100
          item.price = item.price / 100
        })
        // 时间解析格式
        startTime = parseTime(startTime)
        endTime = parseTime(endTime)
      
        this.form = {
            id, // 拼团返回id
            goodsId, // 商品id
            cover: this.imgUrl  + cover, // 商品封面
            cover1: cover, // 备份替换（没有url）
            time: [startTime, endTime], // 秒杀时间
            startTime, // 开始时间
            endTime, // 结束时间
            joinNumber, // 参与人数
            purchaseLimit, // 每人限购, 0 为不限购
            seckillGoodsProperty, // 商品规格
        }
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          // 设置平团价格 单位 分
          this.form.seckillGoodsProperty.forEach(item => {
            item.oriPrice = item.oriPrice * 100
            item.price = item.price * 100
          })

          if(parseInt(this.queryId) === -1){ // 添加
            this.form.cover = this.selectOne && this.selectOne.cover // 重新赋值(没有url)
            seckillAdd(this.form).then(res => {
              this.$message({
                message: '秒杀添加成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/actives/seckill'
            })
          }else { // 编辑
            this.form.cover = this.form.cover1 // 重新赋值(没有url)
            seckillUpdate(this.form).then(res => {
              this.$message({
                message: '秒杀编辑成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/actives/seckill'
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
