<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">门店信息</div>
      <p class="head-span-sub">请一定要填写支付宝或微信 APPID 等信息，否则客户无法在 APP 中进行支付。</p>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules">
      <div class="body-span">
        <div class="flex1">
          <el-form-item label="门店图片" prop="attachments" class="upload-item">
            <upload :queryId="queryId" :attachments="form.attachments" @uploadSuccess="uploadSuccess" format="img" :amount="1"></upload>
          </el-form-item>
          <el-form-item label="门店名称" prop="name">
            <el-input v-model="form.name" size="small" placeholder="请填写" />
          </el-form-item>
          <el-form-item label="门店医师数量" prop="physicianCnt">
            <el-input v-model="form.physicianCnt" size="small" placeholder="请填写" />
          </el-form-item>
        </div>
        <div class="flex2">
          <el-form-item ref="addrDetails" label="地图定位门店地址" prop="address" style="margin-bottom: 15px;">
            <el-col style="width: 378px;">
              <el-input
                size="small"
                v-model="form.address"
                placeholder="请输入店铺地址"
                clearable
                @blur="mapSearch"
              ></el-input>
            </el-col>
            <el-col style="width: 90px; margin-left: 12px;">
              <el-button @click="mapSearch" size="small">搜索地图</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="">
            <el-col v-if="placeSearch" :span="9">
              <el-scrollbar class="map-panel">
                <div id="map-panel"></div>
              </el-scrollbar>
            </el-col>
            <el-col :span="15">
              <div id="map-container" class="map-container"></div>
            </el-col>
          </el-form-item>
        </div>
        <div class="flex3">
          <fieldset class="fieldset-border">
            <legend>支付宝接口</legend>
            <el-form-item label="API" prop="alipayAppid">
              <el-input v-model="form.alipayAppid" size="small" placeholder="请填写" />
            </el-form-item>
            <el-form-item label="密钥" prop="alipayPublicKey">
              <el-input v-model="form.alipayPublicKey"  size="small" placeholder="请填写" />
            </el-form-item>
          </fieldset>
          <fieldset class="fieldset-border">
            <legend>微信接口</legend>
            <el-form-item label="API" prop="wxAppid">
              <el-input v-model="form.wxAppid" size="small" placeholder="请填写" />
            </el-form-item>
            <el-form-item label="密钥" prop="wxMerchkey">
              <el-input v-model="form.wxMerchkey" size="small" placeholder="请填写" />
            </el-form-item>
          </fieldset>
        </div>
      </div>
      <el-form-item class="create-btn">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import upload from '@/components/upload'
import { addStore, elseEditorStore, elseStoreDetail, selfeditorStore, selfStoreDetail } from '@/api/store'
// https://lbs.amap.com/api/javascript-api/guide/abc/prepare
export default {
  data() {
    const attachments = (rule, value, callback) => {
      if (this.form.attachments.length === 0) {
        callback(new Error('门店图片不可为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        attachments:[], // 门店图片
        imgUrl: '', // 门店图片(后端接口需要)
        name: '', // 门店名称
        physicianCnt: '', // 医师数量
        alipayAppid: '', // 支付宝接口
        alipayPublicKey: '',
        wxAppid: '', // 微信接口
        wxMerchkey: '',
        address: '', // 门店地址
        location: '', // 经纬度（后端接口需要）
        longitude: '', // 经度
        latitude: '' // 纬度
      },
      rules: {
        attachments: [
          {
            type: 'array',
            required: true,
            validator: attachments,
            trigger: 'change'
          }
        ],
        name: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        physicianCnt: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        userName: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        password: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        alipayAppid: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        alipayPublicKey: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        wxAppid: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        wxMerchkey: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        address: [ { required: true, message: '不能为空', trigger: 'blur' } ]
      },
      map: null, // 地图实例
      mapMarker: null, // 地图标记实例
      placeSearch: null, // 地图搜索服务实例
      geocoder: null // 地图地理信息编码转换实例
    }
  },
  components: {
    upload
  },
  watch: {
    'form.attachments': {
      handler(value) {
        if(value.length > 0){
          // 校验 图片方法
          this.$refs.form.validateField('attachments')
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initMap()
    if(parseInt(this.queryId) !== -1 && this.isbendian !== 1){ // 编辑
      this.getCurrentStoreDetailInfo()
    }else { // 本店 编辑
      this.getbendianStoreDetailInfo()
    }    
  },
  computed: {
    queryId() { // -1 为添加， 其它为 编辑
      return parseInt(this.$route.query.id)
    },
    isbendian() { // 本店
      return parseInt(this.$route.query.isbendian)
    }
  },
  methods: {
    //  获取本店信息
    getbendianStoreDetailInfo() {
      selfStoreDetail().then(res => {
        const { imgUrl, name, physicianCnt,  alipayAppid, alipayPublicKey, wxAppid, wxMerchkey, address, location} = res.data
        this.form = {
            companyId: this.queryId, // 编辑id
            attachments:[{
                attachmentExt: 'image/png', // 回选文件格式, 不提交，仅供回选使用
                attachmentType: 0, // 回选文件类型
                attachmentUrl: imgUrl // 回选文件地址
            }], // 分类图片
            imgUrl, // 门店图片(后端接口需要)
            name, // 门店名称
            physicianCnt, // 医师数量
            alipayAppid, // 支付宝接口
            alipayPublicKey,
            wxAppid, // 微信接口
            wxMerchkey,
            address, // 门店地址
            location, // 经纬度（后端接口需要）
            longitude: location && location.split(',')[0], // 经度
            latitude: location && location.split(',')[1], // 纬度
        }
      })
      console.log('this.form 本店--', this.form)
    },
    //  获取门店信息
    getCurrentStoreDetailInfo() {
      elseStoreDetail({id: this.queryId}).then(res => {
        const { imgUrl, name, physicianCnt,  alipayAppid, alipayPublicKey, wxAppid, wxMerchkey, address, location} = res.data
        this.form = {
            companyId: this.queryId, // 编辑id
            attachments:[{
                attachmentExt: 'image/png', // 回选文件格式, 不提交，仅供回选使用
                attachmentType: 0, // 回选文件类型
                attachmentUrl: imgUrl // 回选文件地址
            }], // 分类图片
            imgUrl, // 门店图片(后端接口需要)
            name, // 门店名称
            physicianCnt, // 医师数量
            alipayAppid, // 支付宝接口
            alipayPublicKey,
            wxAppid, // 微信接口
            wxMerchkey,
            address, // 门店地址
            location, // 经纬度（后端接口需要）
            longitude: location.split(',')[0], // 经度
            latitude: location.split(',')[1], // 纬度
        }
      })
    },
    // 门店图片上传成功
    uploadSuccess(list){
      console.log('list', list)
      this.form.attachments = list
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if(this.form.attachments.length > 0){
            this.form.imgUrl = this.form.attachments[0].attachmentUrl
        }else {
            this.form.imgUrl = ''
        }
        if (valid) {
          console.log('this.form---', this.form)
          // 组装经纬度数据(后台需要)
          this.form.location = `${this.form.longitude},${this.form.latitude}`
        
          if(parseInt(this.queryId) === -1){ // 添加
            addStore(this.form).then(res => {
              this.$message({
                message: '新增门店成功',
                type: 'success'
              })
            })
            this.$router.push({
              path: '/store/store'
            })
          }else { 
            if(this.isbendian) { // 本店编辑
              selfeditorStore(this.form).then(res => {
                this.$message({
                  message: '本店编辑成功',
                  type: 'success'
                })
              })
            }else {
              // 编辑
              elseEditorStore(this.form).then(res => {
                this.$message({
                  message: '门店编辑成功',
                  type: 'success'
                })
              })
            }
            
            this.$router.push({
              path: '/store/store'
            })
          }
          
        } else {
          console.log('error submit!!');
          return false
        }
      })
    },
    // 初始化地图
    initMap() {
      this.map = new AMap.Map('map-container', {
        resizeEnable: true,
        zoom: 16
      })
      // 添加标记
      if (!this.mapMarker) {
        this.mapMarker = new AMap.Marker({
          map: this.map
        })
      }
      if (this.form.longitude) {
        // 如果有位置信息，直接选中
        const LngLat = new AMap.LngLat(
          this.form.longitude,
          this.form.latitude
        )
        this.mapMarker.setPosition(LngLat)
        this.map.setCenter(LngLat)
      }
      AMap.event.addListener(this.map, 'click', e => {
        const lng = e.lnglat.getLng() // 经度值
        const lat = e.lnglat.getLat() // 纬度值
        console.log(lng, lat)
        this.form.longitude = lng
        this.form.latitude = lat
        this.mapMarker.setPosition(new AMap.LngLat(lng, lat))
        this.map.setCenter(new AMap.LngLat(lng, lat))
        if (!this.geocoder) {
          // 地理编码
          AMap.service(['AMap.Geocoder'], () => {
            this.geocoder = new AMap.Geocoder()
          })
        }
        this.geocoder.getAddress([lng, lat], (status, res) => {
          let address = ''
          if (status === 'complete' && res.regeocode) {
            if (
              res.regeocode.formattedAddress &&
              res.regeocode.addressComponent.district
            ) {
              address = res.regeocode.formattedAddress.split(
                res.regeocode.addressComponent.district
              )[1]
              this.form.address = address
              console.log('this.form---', this.form)
            }
          } else {
            console.log('根据地址查询位置失败')
          }
        })
      })
    },
    // 地图关键字查询
    mapSearch() {
      if (this.form.address) {
        if (!this.placeSearch) {
          // 搜索服务
          AMap.service(['AMap.PlaceSearch'], () => {
            this.placeSearch = new AMap.PlaceSearch({
              pageSize: 5, // 单页显示结果条数
              pageIndex: 1, // 页码
              // city: this.value.merchantForm.addr, // 兴趣点城市
              citylimit: true, // 是否强制限制在设置的城市内搜索
              map: this.map, // 展现结果的地图实例
              panel: 'map-panel', // 结果列表将在此容器中进行展示。
              autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
            })
            AMap.event.addListener(this.placeSearch, 'listElementClick', e => {
              this.form.longitude = e.data.location.lng
              this.form.latitude = e.data.location.lat
              this.form.address = e.data.name
              this.placeSearch = null
            })
          })
        }
        // this.placeSearch.setCity(
        //   this.value.merchantForm.addr[this.value.merchantForm.addr.length - 1]
        // )
        
        this.placeSearch.search(
          this.form.address,
          (status, result) => {
            console.log(status)
            console.log(result)

            if (status === 'complete' && result.poiList.count) {
              this.form.longitude =
                result.poiList.pois[0].location.lng
              this.form.latitude =
                result.poiList.pois[0].location.lat
                console.log('this.form', this.form)
            } else {
              // 搜索不到地址
              this.form.longitude = ''
              this.form.latitude = ''
            }
            this.$nextTick(() => {
              this.$refs.form.validateField('addrDetails')
            })
          }
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
    .map-container {
        width: 100%;
        height: 368px;
    }
    .body-span{
        display: flex;
        padding-top: 15px;
        .flex1{
            flex: 1;
        }
        .flex2{
            flex: 2;
            padding:0 50px;
        }
        .flex3{
            flex: 1;
        }
        .el-form-item{
            margin-bottom: 15px;
        }
        .fieldset-border{
            border: 1px dashed #ccc;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
            legend{
                color: #29BEC6;
            }
        }
    }
    /deep/.upload-demo{
      line-height: initial;
    }
    // amap
    .map-container {
      width: 100%;
      height: 368px;
    }
    .map-panel {
      position: relative;
      width: 100%;
      height: 368px;
      /deep/ .amap_lib_placeSearch_page {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
    }

</style>
