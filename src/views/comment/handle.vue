<template>
  <div class="container">
    <div class="head-span">
      <div class="head-span-title">门店信息</div>
      <p class="head-span-sub">请一定要填写支付宝或微信 APPID 等信息，否则客户无法在 APP 中进行支付。</p>
      <el-steps :active="stepActive" finish-status="success" class="step-class">
        <el-step title="填写基本店铺信息" />
        <el-step title="绑定支付宝/微信" />
      </el-steps>
    </div>

    <el-form ref="form" :model="form" label-position="top" status-icon :rules="rules">
      <div v-show="stepActive === 0" class="body-span">
        <div class="flex1">
          <el-form-item label="门店图片" prop="attachments" class="upload-item">
            <upload :query-id="queryId" :attachments="form.attachments" format="img" :amount="1" @uploadSuccess="uploadSuccess" />
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
                v-model="form.address"
                size="small"
                placeholder="请输入店铺地址"
                clearable
                @blur="mapSearch"
              />
            </el-col>
            <el-col style="width: 90px; margin-left: 12px;">
              <el-button size="small" @click="mapSearch">搜索地图</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="">
            <el-col v-if="placeSearch" :span="9">
              <el-scrollbar class="map-panel">
                <div id="map-panel" />
              </el-scrollbar>
            </el-col>
            <el-col :span="15">
              <div id="map-container" class="map-container" />
            </el-col>
          </el-form-item>
        </div>
      </div>
      <div v-if="stepActive === 1" class="body-span">
        <div class="flex3">
          <fieldset class="fieldset-border">
            <legend><span v-for="(item, index) in payNames" :key="index" :class="{active: payIndex === index}" @click="payShow(index)">{{ item }}</span></legend>
            <div v-if="parseInt(payIndex) === 0">
              <!-- 微信 -->
              <el-form-item label="appid" :prop="stepActive === 1 && parseInt(payIndex) === 0 ? 'wxAppid' : ''">
                <el-input v-model="form.wxAppid" size="small" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="app 密钥" :prop="stepActive === 1 && parseInt(payIndex) === 0 ? 'wxAppSecret' : ''">
                <el-input v-model="form.wxAppSecret" size="small" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="商户号" :prop="stepActive === 1 && parseInt(payIndex) === 0 ? 'wxMerchNo' : ''">
                <el-input v-model="form.wxMerchNo" size="small" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="商户密钥" :prop="stepActive === 1 && parseInt(payIndex) === 0 ? 'wxMerchKey' : ''">
                <el-input v-model="form.wxMerchKey" size="small" placeholder="请填写" />
              </el-form-item>
              <div class="certificate">
                <div>证书文件</div>
                <ul>
                  <li>
                    <el-upload
                      class="upload-demo"
                      accept=".p12, .pem"
                      :headers="headers"
                      :action="uploadUrl + (payIndex + 1) + '/' +storeId"
                      :on-preview="handlePreview"
                      :on-success="handleSuccess"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      multiple
                      :limit="3"
                      :on-exceed="handleExceed"
                      :file-list="fileList"
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传证书文件 <b>.p12, .pem</b> 后缀文件</div>
                    </el-upload>
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="parseInt(payIndex) === 1">
              <!-- 支付宝 -->
              <el-form-item label="appid" :prop="stepActive === 1 && parseInt(payIndex) === 1 ? 'alipayAppid' : ''">
                <el-input v-model="form.alipayAppid" size="small" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="应私钥" :prop="stepActive === 1 && parseInt(payIndex) === 1 ? 'privateKey' : ''">
                <el-input v-model="form.privateKey" size="small" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="应公钥" :prop="stepActive === 1 && parseInt(payIndex) === 1 ? 'publicKey' : ''">
                <el-input v-model="form.publicKey" size="small" placeholder="请填写" />
              </el-form-item>
              <el-form-item label="签约账号" :prop="stepActive === 1 && parseInt(payIndex) === 1 ? 'alipayPid' : ''">
                <el-input v-model="form.alipayPid" size="small" placeholder="请填写" />
              </el-form-item>
              <div class="certificate">
                <div>证书文件</div>
                <ul>
                  <!-- <li class="active"><p>RootCert</p><div class="bg"><i class="el-icon-upload"></i></div></li>
                  <li><p>Key_RSA2</p><div class="bg"><i class="el-icon-upload"></i></div></li>
                  <li><p>Key_xxxxxx</p><div class="bg"><i class="el-icon-upload"></i></div></li> -->
                  <li>
                    <el-upload
                      class="upload-demo"
                      accept=".crt"
                      :headers="headers"
                      :action="uploadUrl + (payIndex + 1) + '/' +storeId"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :on-success="handleSuccess"
                      :before-remove="beforeRemove"
                      multiple
                      :limit="3"
                      :on-exceed="handleExceed"
                      :file-list="fileList2"
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传证书文件 <b>.crt</b> 后缀文件</div>
                    </el-upload>
                  </li>
                </ul>
              </div>
            </div>
          </fieldset>

        </div>
      </div>
      <el-form-item class="create-btn">
        <el-button v-if="stepActive === 0" type="primary" @click="submitNext('form')">下一步</el-button>
        <el-button v-if="stepActive === 1" type="primary" @click="submitForm('form')">保存</el-button>
        <el-button v-if="stepActive === 1" type="text" @click="stepActive = 0">上一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import upload from '@/components/upload'
// import { addStore, elseEditorStore, elseStoreDetail, selfeditorStore, selfStoreDetail } from '@/api/store'
// https://lbs.amap.com/api/javascript-api/guide/abc/prepare
export default {
  components: {
    upload
  },
  data() {
    const attachments = (rule, value, callback) => {
      if (this.form.attachments.length === 0) {
        callback(new Error('门店图片不可为空'))
      } else {
        callback()
      }
    }
    return {
      headers: {
        'Authorization': getToken()
      }, // 设置上传的请求头部
      uploadUrl: `${process.env.VUE_APP_BASE_API}/pc/company/uploadcert/`, // 你要上传视频到你后台的地址
      payNames: ['微信接口', '支付宝接口'],
      fileList: [], // 微信
      fileList2: [], // 支付宝
      // acceptType: ['.p12', '.pem', '.crt'], // 识别上传证书类型

      payIndex: 0,
      stepActive: 0, // 步骤
      form: {
        attachments: [], // 门店图片
        imgUrl: '', // 门店图片(后端接口需要)
        name: '', // 门店名称
        physicianCnt: '', // 医师数量

        alipayAppid: '', // 支付宝接口
        privateKey: '',
        publicKey: '',
        alipayPid: '',
        publicKeyCert: '', // 证书
        alipayPublicKeyCert: '', // 证书
        alipayRootCert: '', // 证书

        wxAppid: '', // 微信接口
        wxAppSecret: '',
        wxMerchNo: '',
        wxMerchKey: '',
        wxCertPem: '', // 证书
        wxCertificatePath: '', // 证书
        wxKeyPem: '', // 证书

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
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        physicianCnt: [{ required: true, message: '不能为空', trigger: 'blur' }],
        userName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '不能为空', trigger: 'blur' }],

        wxAppid: [{ required: true, message: '不能为空', trigger: 'blur' }],
        wxAppSecret: [{ required: true, message: '不能为空', trigger: 'blur' }],
        wxMerchNo: [{ required: true, message: '不能为空', trigger: 'blur' }],
        wxMerchKey: [{ required: true, message: '不能为空', trigger: 'blur' }],

        alipayAppid: [{ required: true, message: '不能为空', trigger: 'blur' }],
        privateKey: [{ required: true, message: '不能为空', trigger: 'blur' }],
        publicKey: [{ required: true, message: '不能为空', trigger: 'blur' }],
        alipayPid: [{ required: true, message: '不能为空', trigger: 'blur' }],

        address: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      storeId: -1, // 门店id
      map: null, // 地图实例
      mapMarker: null, // 地图标记实例
      placeSearch: null, // 地图搜索服务实例
      geocoder: null // 地图地理信息编码转换实例
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
  watch: {
    'form.attachments': {
      handler(value) {
        if (value.length > 0) {
          // 校验 图片方法
          this.$refs.form.validateField('attachments')
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initMap()
    if (parseInt(this.queryId) !== -1 && this.isbendian !== 1) { // 编辑
      this.getCurrentStoreDetailInfo()
    } else if (parseInt(this.queryId) !== -1 && this.isbendian === 1) { // 本店 编辑
      this.getbendianStoreDetailInfo()
    }
  },
  methods: {
    payShow(index) {
      this.payIndex = index
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)

      if (parseInt(this.payIndex) === 0) { // 微信
        const sindex = this.fileList.map(item => item.uid).indexOf(file.uid) // 删除的索引
        this.fileList.splice(sindex, 1)
        console.log('微信', this.fileList)
      } else if (parseInt(this.payIndex) === 1) { // 支付宝
        const sindex2 = this.fileList2.map(item => item.uid).indexOf(file.uid) // 删除的索引
        this.fileList2.splice(sindex2, 1)
        console.log('支付宝', this.fileList2)
      }
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleSuccess(response, file, fileList) {
      if (parseInt(this.payIndex) === 0) { // 微信
        this.fileList = fileList
      } else if (parseInt(this.payIndex) === 1) { // 支付宝
        this.fileList2 = fileList
      }
      console.log('微信上传后', this.fileList)
      console.log('支付宝上传后', this.fileList2)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    //  获取本店信息
    getbendianStoreDetailInfo() {
      selfStoreDetail().then(res => {
        const { imgUrl, name, physicianCnt, alipayAppid, privateKey, publicKey, alipayPid, publicKeyCert, alipayPublicKeyCert, alipayRootCert, wxAppid, wxAppSecret, wxMerchNo, wxMerchKey, wxCertPem, wxCertificatePath, wxKeyPem, address, location } = res.data
        this.form = {
          companyId: this.queryId, // 编辑id
          attachments: [{
            attachmentExt: 'image/png', // 回选文件格式, 不提交，仅供回选使用
            attachmentType: 0, // 回选文件类型
            attachmentUrl: imgUrl // 回选文件地址
          }], // 分类图片
          imgUrl, // 门店图片(后端接口需要)
          name, // 门店名称
          physicianCnt, // 医师数量

          alipayAppid,
          privateKey,
          publicKey,
          alipayPid,
          publicKeyCert,
          alipayPublicKeyCert,
          alipayRootCert,

          wxAppid,
          wxAppSecret,
          wxMerchNo,
          wxMerchKey,
          wxCertPem,
          wxCertificatePath,
          wxKeyPem,

          address, // 门店地址
          location, // 经纬度（后端接口需要）
          longitude: location && location.split(',')[0], // 经度
          latitude: location && location.split(',')[1] // 纬度
        }
        // 证据文件 微信回选
        if (wxCertificatePath) {
          this.fileList = [
            {
              name: 'apiclient_cert.p12',
              url: `${wxCertificatePath}`
            },
            {
              name: 'apiclient_cert.pem',
              url: `${wxCertPem}`
            },
            {
              name: 'apiclient_key.pem',
              url: `${wxKeyPem}`
            }
          ]
        }

        // 证据文件 支付宝回选
        if (publicKeyCert) {
          this.fileList2 = [
            {
              name: 'alipayCertPublicKey_RSA2.crt',
              url: `${publicKeyCert}`
            },
            {
              name: 'alipayRootCert.crt',
              url: `${alipayRootCert}`
            },
            {
              name: 'appCertPublicKey',
              url: `${alipayPublicKeyCert}`
            }
          ]
        }
      })
      console.log('this.form 本店--', this.form)
    },
    //  获取门店信息
    getCurrentStoreDetailInfo() {
      elseStoreDetail({ id: this.queryId }).then(res => {
        const { imgUrl, name, physicianCnt, alipayAppid, privateKey, publicKey, alipayPid, publicKeyCert, alipayPublicKeyCert, alipayRootCert, wxAppid, wxAppSecret, wxMerchNo, wxMerchKey, wxCertPem, wxCertificatePath, wxKeyPem, address, location } = res.data
        this.form = {
          companyId: this.queryId, // 编辑id
          attachments: [{
            attachmentExt: 'image/png', // 回选文件格式, 不提交，仅供回选使用
            attachmentType: 0, // 回选文件类型
            attachmentUrl: imgUrl // 回选文件地址
          }], // 分类图片
          imgUrl, // 门店图片(后端接口需要)
          name, // 门店名称
          physicianCnt, // 医师数量
          alipayAppid,
          privateKey,
          publicKey,
          alipayPid,
          publicKeyCert,
          alipayPublicKeyCert,
          alipayRootCert,

          wxAppid,
          wxAppSecret,
          wxMerchNo,
          wxMerchKey,
          wxCertPem,
          wxCertificatePath,
          wxKeyPem,
          address, // 门店地址
          location, // 经纬度（后端接口需要）
          longitude: location.split(',')[0], // 经度
          latitude: location.split(',')[1] // 纬度
        }
        // 证据文件 微信回选
        if (wxCertificatePath) {
          this.fileList = [
            {
              name: 'apiclient_cert.p12',
              url: `${wxCertificatePath}`
            },
            {
              name: 'apiclient_cert.pem',
              url: `${wxCertPem}`
            },
            {
              name: 'apiclient_key.pem',
              url: `${wxKeyPem}`
            }
          ]
        }

        // 证据文件 支付宝回选
        if (publicKeyCert) {
          this.fileList2 = [
            {
              name: 'alipayCertPublicKey_RSA2.crt',
              url: `${publicKeyCert}`
            },
            {
              name: 'alipayRootCert.crt',
              url: `${alipayRootCert}`
            },
            {
              name: 'appCertPublicKey',
              url: `${alipayPublicKeyCert}`
            }
          ]
        }
      })
    },
    // 门店图片上传成功
    uploadSuccess(list) {
      console.log('list', list)
      this.form.attachments = list
    },
    // 下一步表单提交
    submitNext(formName) {
      console.log('form---', this.form)

      this.$refs[formName].validate((valid) => {
        if (this.form.attachments.length > 0) {
          this.form.imgUrl = this.form.attachments[0].attachmentUrl
        } else {
          this.form.imgUrl = ''
        }
        if (valid) {
          console.log('this.form---', this.form)
          // 组装经纬度数据(后台需要)
          this.form.location = `${this.form.longitude},${this.form.latitude}`

          if (parseInt(this.queryId) === -1) { // 添加
            if (this.storeId === -1) { // 新建
              addStore(this.form).then(res => {
                this.storeId = res.data // 获取门店id
                this.stepActive = 1 // 下一步
              })
            } else {
              this.stepActive = 1 // 下一步
            }
          } else {
            this.stepActive = 1 // 下一步
          }
          // else {
          //   if(this.isbendian) { // 本店编辑
          //     selfeditorStore(this.form).then(res => {
          //       this.$message({
          //         message: '本店编辑成功',
          //         type: 'success'
          //       })
          //     })
          //   }else {
          //     // 编辑
          //     elseEditorStore(this.form).then(res => {
          //       this.$message({
          //         message: '门店编辑成功',
          //         type: 'success'
          //       })
          //     })
          //   }
          // }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 表单提交
    submitForm(formName) {
      if (this.fileList.length > 0) {
        this.fileList.forEach(item => {
          if (item.name === 'apiclient_cert.p12') {
            this.form.wxCertificatePath = item.url || item.response.data[0] // item.url 兼容重新编辑处理
          }
          if (item.name === 'apiclient_cert.pem') {
            this.form.wxCertPem = item.url || item.response.data[0]
          }
          if (item.name === 'apiclient_key.pem') {
            this.form.wxKeyPem = item.url || item.response.data[0]
          }
        })
      }

      if (this.fileList2.length > 0) {
        this.fileList2.forEach(item => {
          if (item.name === 'alipayCertPublicKey_RSA2.crt') {
            this.form.publicKeyCert = item.url || item.response.data[0]
          }
          if (item.name === 'alipayRootCert.crt') {
            this.form.alipayRootCert = item.url || item.response.data[0]
          }
          if (item.name.indexOf('appCertPublicKey' === 0)) { // appCertPublicKey_2021001152612533.crt
            this.form.alipayPublicKeyCert = item.url || item.response.data[0]
          }
        })
      }

      if (this.form.wxAppid || this.form.wxAppSecret || this.form.wxMerchNo || this.form.wxMerchKey) { // 微信判断
        if (this.fileList.length !== 3) {
          this.$message({
            message: '微信相关输入框或微信3个文件证书必须上传',
            type: 'warning'
          })
          return
        }
      }

      if (this.form.alipayAppid || this.form.privateKey || this.form.publicKey || this.form.alipayPid) { // 支付宝判断
        if (this.fileList2.length !== 3) {
          this.$message({
            message: '支付宝相关输入框或支付宝3个文件证书必须上传',
            type: 'warning'
          })
          return
        }
      }

      this.$refs[formName].validate((valid) => {
        if (this.form.attachments.length > 0) {
          this.form.imgUrl = this.form.attachments[0].attachmentUrl
        } else {
          this.form.imgUrl = ''
        }
        if (valid) {
          // 组装经纬度数据(后台需要)
          this.form.location = `${this.form.longitude},${this.form.latitude}`
          if (parseInt(this.queryId) !== -1) { // 编辑状态
            this.form.companyId = parseInt(this.queryId) // 赋值门店id
          } else {
            this.form.companyId = this.storeId // 赋值门店id
          }

          // 编辑
          elseEditorStore(this.form).then(res => {
            this.$message({
              message: '门店编辑成功',
              type: 'success'
            })
          })
          this.$router.push({
            path: '/store/store'
          })

          if (this.isbendian) { // 本店编辑
            selfeditorStore(this.form).then(res => {
              this.$message({
                message: '本店编辑成功',
                type: 'success'
              })
            })
          }
        } else {
          console.log('error submit!!')
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
    /deep/.step-class{
      width: 700px;
      margin: 0 auto;
      .el-step__title{
        font-size: 12px;
        line-height: 16px;
        padding-bottom: 5px;
      }
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
                span{
                  cursor: pointer;
                  display: inline-block;
                  margin-left: 15px;
                  color: #D1D5D5;
                  &.active{
                    color:  #29BEC6;
                  }
                }
            }
            .certificate{
              font-size: 13px;
              color: #606266;
              ul{
                display: flex;
                justify-content: space-between;
                margin: 0;
                padding: 0;
                li{
                  font-size: 12px;
                  list-style: none;
                  margin-right: 15px;
                  cursor: pointer;
                  margin-top: 15px;
                  p{
                    margin: 0;
                    padding: 0;
                    line-height: 22px;
                  }
                  .bg{
                    width: 48px;
                    height: 48px;
                    background: #D1D5D5;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .el-icon-upload{
                      font-size: 22px;
                      color: #fff;
                    }

                  }
                  &.active{
                    .bg{
                      background: #67C23A;
                    }
                    .el-icon-upload{
                      font-size: 22px;
                      color: #fff;
                    }

                  }
                }
              }

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
