<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">拼团设置</div>
      <p class="head-span-sub">{{queryId === -1 ? '添加拼团信息': '编辑拼团信息'}}</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules" class="body-span">
      <el-form-item label="选择拼团商品" prop="cover">
        <select-goods :cover="form.cover" :goodTitle="form.title" @change="changeGood"></select-goods>
      </el-form-item>
      <div class="group-item">
        <el-form-item label="开团人数" prop="needPeop">
            <el-input v-model="form.needPeop" size="small" placeholder="请填写" />
        </el-form-item>
        <!-- <el-form-item label="开团结束时间" prop="endTime">
            <el-date-picker
              size="small"
              v-model="form.endTime"
              type="datetime"
              placeholder="选择时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              >
            </el-date-picker>
        </el-form-item> -->
        <el-form-item label="已参加人数" prop="joinPeop">
            <el-input v-model="form.joinPeop" size="small" placeholder="请填写" />
        </el-form-item>
      </div>
      <div class="group-property-item" v-if="form.properties.length > 0">
        <ul class="group-property-title">
          <li class="w200">规格</li>
          <li class="w60">价格(￥)</li>
          <li class="w60">库存</li>
          <li>拼团价</li>
        </ul>
        <ul v-for="(item, index) in form.properties" :key="index">
          <li class="w200">{{item.name}}</li>
          <li class="w60">{{item.oriPrice}}</li>
          <li class="w60">{{item.stock}}</li>
          <li>
            <el-form-item 
              :prop="'properties.' + index + '.price'"
              :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }"
            >
              <el-input v-model="item.price" size="small" placeholder="请填写" />
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
import { assembleAdd, assembleDetails, assembleModify } from '@/api/actives'
import selectGoods from '@/components/selectGoods'
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
      form: {
        goodsId: '', // 商品id
        cover: '', // 商品封面
        title: '', // 商品标题
        needPeop: '', // 开团人数
        // endTime: '', // 拼团开始时间
        joinPeop: '', // 已参数人数
        properties: [], // 商品规格
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
        needPeop: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        joinPeop: [
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
      this.assembleDetails()
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
      this.form.properties = [] //  初始化
      this.selectOne = data // 赋值
      
      // 封面赋值
      this.form.cover = this.imgUrl + data.cover
      // 商品id
      this.form.goodsId = data.id
      
      // 组装后端需要商品规格的数据
      const properties = []
      data.goodsPropertys.forEach(item => {
        properties.push({
          propertyId: item.id, // 商品规格id
          isShow: 1, // 是否参与分销 1-参与 0-未参与
          name: item.name,
          oriPrice: item.price, // 现价
          // price: '', // 定义拼团价格
          stock: item.stock // 库存数量
        })
      })

      this.form.properties = properties
    },
    //  获取拼团详情信息
    assembleDetails() {
      assembleDetails({assembleId: this.queryId}).then(res => {
        const { id, goodsId, cover, needPeop, joinPeop, properties, title } = res.data
        properties.forEach(item => { // 价格 单位 元
          item.oriPrice = item.oriPrice / 100
          item.price = item.price / 100
        })

        this.form = {
            id, // 拼团返回id
            goodsId: '', // 商品id
            cover: this.imgUrl  + cover, // 商品封面
            needPeop, // 开团人数
            // endTime, // 拼团开始时间
            joinPeop, // 已参数人数
            properties, // 商品规格
            title
        }
      })
    },

    submitForm(formName) {

      this.$refs[formName].validate((valid) => {      
        if (valid) {
          // 设置平团价格 单位 分
          this.form.properties.forEach(item => {
            item.oriPrice = item.oriPrice * 100
            item.price = item.price * 100
          })

          if(parseInt(this.queryId) === -1){ // 添加
            assembleAdd(this.form).then(res => {
              this.$message({
                message: '拼团添加成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/actives/group'
            })
          }else { // 编辑
            assembleModify(this.form).then(res => {
              this.$message({
                message: '拼团编辑成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/actives/group'
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
            margin-right: 20px;
            font-size: 13px;
            color: #606266;
          }
          .w200{
            width: 200px;
          }
          .w60{
            width: 60px;
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
