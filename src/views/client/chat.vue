 <template>
  <div class="container">
    <div class="chat-title">
      <h4>客户咨询</h4>
      <router-link class="set" to="home"><i class="el-icon-setting"></i>设置</router-link>
    </div>
    <div class="chat-box" v-if="leftListData.length > 0 || searchText">
      <div class="chat-left">
        <el-input
          class="search-chat"
          size="small"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          :debounce="500"
          @input="searchHandle"
          v-model="searchText">
       </el-input>
       <el-scrollbar v-if="leftListData.length > 0" class="infinite-list-wrapper" :style="{overflowY: 'auto', height: heightV(150)}">
         <ul 
         class="chat-ul-left"
         v-infinite-scroll="leftList"
         infinite-scroll-distance="40"
         infinite-scroll-disabled="disabled">
           <li v-for="(item, index) in leftListData" :key="index" @click="rightList(item, $event)">
             <div class="chat-time">{{item.receiveTime}}</div>
             <div class="person-header"><img class="list-img" :src="item.customerrHeadPic" /></div>
             <div class="person-text">
               <div class="person-name">{{item.customerNickname}}</div>
               <p><el-badge :value="item.messageCount" class="item badge-num">{{item.lastContent}}</el-badge></p>
             </div>
           </li>
         </ul>
         <p v-if="leftListData.length > 0 && loading" class="tips-loading">加载中...</p>
         <p v-if="leftListData.length > 0 && noMore" class="tips-loading" style="padding: 15px 0">没有更多了</p>
       </el-scrollbar>
       <div v-else class="no-datas">
         搜索不到数据
       </div>
      </div>
      <div class="chat-right" v-if="customerNickname">
        <div class="chat-current-msg">
          <p class="name">{{customerNickname}}</p>
          <!-- <p class="tel">18888888888</p> -->
        </div>
        <el-scrollbar ref="myScrollbar" class="infinite-list-wrapper" :style="{overflowY: 'auto', height: heightV(230)}">
          <div class="more-msg" v-if="loading2">查看更多消息</div>
          <div class="more-msg" v-if="noMore2">没有更多消息</div>
          <ul class="right-ul">
            <li v-for="(Ritem, i) in rightListData" :key="i">
              <!-- 商品信息 -->
              <div class="client-msg shopping-msg" v-if="parseInt(Ritem.type) === 1">
                <div class="client-header">
                  <img class="list-img" :src="Ritem.customerrHeadPic" />
                  <p>{{Ritem.sendTime}}</p>
                </div>
                <div class="shopping-send-msg">
                  <img class="list-img" :src="Ritem.titleUrl" />
                  <p class="shopping-send-text">{{Ritem.title}}</p>
                  <p class="shopping-send-icon"><i class="el-icon-arrow-right"></i></p>
                </div>
              </div>

              <!-- 客户发送过来 -->
              <div class="client-msg" v-if="(parseInt(Ritem.type) === 0 || parseInt(Ritem.type) === 2) && Ritem.fromOrTo === 0">
                <div class="client-header">
                  <img class="list-img" :src="Ritem.customerrHeadPic" />
                  <p>{{Ritem.sendTime}}</p>
                </div>
                <div class="client-send-msg">
                  <p>{{Ritem.content}}</p>
                </div>
              </div>
              <!-- 我发送的信息 -->
              <div class="me-msg" v-if="(parseInt(Ritem.type) === 0 || parseInt(Ritem.type) === 2) && Ritem.fromOrTo === 1">
                <p>{{Ritem.content}}</p>
              </div>
            </li>
          </ul>
          
        </el-scrollbar>
        <!-- 本地文本域发送信息 -->
        <div class="send">
          <el-input
            ref="sendMsg"
            class="send-to-client"
            type="textarea"
            :rows="2"
            placeholder="请输入"
            v-model="textarea"
            @keyup.enter="sendText()">
          </el-input>
          <div class="send-btn" @click="sendText()">
            发送
          </div>
        </div>
      </div>
      <div class="chat-right no-chat" v-else>
        <div>
          <img :src="noData" width="76.5" height="81"/>
          <p>请选择左侧的客户进行回复</p>
        </div>
      </div>
    </div>
    <div class="no-chat" v-else :style="{height: heightV(150)}">
      <div>
        <img :src="noData" width="76.5" height="81"/>
        <p>无咨询消息</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {serviceList, serviceGetLogs} from '@/api/client'
import { formatTime, debounce } from '@/utils'

export default {
  name: 'Chat',
  data() {
    return {
      timeout: 540000, // 9分钟发一次心跳
      timeoutObj: null,
      serverTimeoutObj: null,

      ws: null, // 实列
      wsUrl: '', // ws连接地址
      lockReconnect: false, // 避免ws重复连接
      noData: require('@/assets/404_images/chat.png'),
      textarea: '', // 发送信息
      toId: '', // 接收信息的客户id
      customerNickname: '', // 右边客户昵称字段
      loading: false,
      searchText: '', // 搜索关键词 (left)
      leftListData: [], // (left)
      currentPage: 1, // 当前页(left)
      sizePage: 10, // 每页显示条数(left)
      totalPage: 0, // 总页数(left)

      loading2: false,
      endFlag: false,

      rightListData: [], // (right)
      currentPage2: 1, // 当前页(right)
      sizePage2: 10, // 每页显示条数(right)
      totalPage2: 0, // 总页数(right)
    }
  },

  computed: {
      noMore() {
          return this.currentPage > this.totalPage
      },
      disabled() {
          return this.loading || this.noMore
      },
      noMore2() {
          return this.currentPage2 > this.totalPage2
      },
  },
  mounted() {
    this.leftList()
    window.addEventListener('resize', this.resize, true)
    window.addEventListener('scroll', this.onscroll, true)
  },
  beforeDestroy() {
      window.removeEventListener('resize', this.resize, true)
      window.removeEventListener('scroll', this.resize, true)
  },
  methods: {
    //  监听聊天窗口滚动事件
    onscroll: debounce(function() {
        // 判断是否滚动到顶部
        const myScrollbar = this.$refs['myScrollbar'].wrap.scrollHeight // 记录滚动条总高度
        const scrollTop = this.$refs['myScrollbar'].wrap.scrollTop // 记录当前滚动位置
        if(!this.noMore2 && parseFloat(scrollTop) === 0) {
          // 加载分页
          this.rightList()

          setTimeout(() => {
            // 每次加载，如果有下一页，当前滚动前一页位置
            this.$refs['myScrollbar'].wrap.scrollTop = this.$refs['myScrollbar'].wrap.scrollHeight - myScrollbar
          }, 500)
        }
    }, 300),
    // 初始化ws
    createWebSocket(userId, toId) {
      try{
          if('WebSocket' in window){
              if(process.env.NODE_ENV === 'development') {
                this.wsUrl = `ws://120.25.247.94:8088/webSocket?fid=${userId}&toid=${toId}&eid=0&source=1`
              }else {// 测试线上环境
                this.wsUrl = `ws://medicalbeauty-back.bx-cy.com/webSocket?fid=${userId}&toid=${toId}&eid=0&source=1`
              }
              
              this.ws = new WebSocket(this.wsUrl)
          }else if('MozWebSocket' in window){  
              this.ws = new MozWebSocket(this.wsUrl)
          }else{
              console.log('您的浏览器不支持websocket协议')
          }
          this.initEventHandle()
      }catch(e){
          this.reconnect(this.wsUrl)
          console.log(e)
      }     
    },
    initEventHandle() {
      const _this = this
      _this.ws.onclose = function () {
          _this.reconnect(_this.wsUrl)
          console.log("ws连接关闭!"+ new Date().toLocaleString())
      }
      _this.ws.onerror = function () {
          _this.reconnect(_this.wsUrl);
          console.log("ws连接错误!")
      }
      _this.ws.onopen = function () {
          _this.heartCheck()      // 心跳检测重置
          console.log("ws连接成功!" + new Date().toLocaleString())
      }
      _this.ws.onmessage = function (event) {    // 如果获取到消息，心跳检测重置
          // this.heartCheck.reset().start() // 拿到任何消息都说明当前连接是正常的
          console.log('接受到信息', event.data)
          const serverData = JSON.parse(event.data)
          let showData = {}
          if(parseInt(serverData.type) === 1) { // 商品信息
            // 组装本地显示数据
            showData = {
              customerrHeadPic: serverData.avatarUrl,
              sendTime: '',
              titleUrl: serverData.message.titleUrl,
              title: serverData.message.title,
              type: serverData.type
            }
          }else { // App消息
            // 组装本地显示数据
            showData = {
              customerrHeadPic: serverData.avatarUrl,
              sendTime: '',
              content: serverData.message,
              type: serverData.type,
              fromOrTo: 0 // 前端自己的标识，自己对应列表
            }
          }
          
          _this.rightListData.push(showData)

          _this.heartCheck()     
          console.log("ws收到消息啦:" + event.data)
          window.setTimeout(()=> {
            _this.scrollBottm()
          }, 500)
      }
    },
    reconnect() {
      if(this.lockReconnect) return
      this.lockReconnect = true
      setTimeout(()=> {
        this.createWebSocket(this.$store.getters.userId, this.toId)
        this.lockReconnect = false
      }, 3000)
    },
    heartCheck() { 
      window.clearTimeout(this.timeoutObj)
      window.clearTimeout(this.serverTimeoutObj)
      this.timeoutObj = setTimeout(()=> {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        // onmessage拿到返回的心跳就说明连接正常
        this.ws.send('HeartBeat')
        console.log('HeartBeat')
        this.serverTimeoutObj = setTimeout(()=> {
          // 如果超过一定时间还没重置，说明后端主动断开了
          this.ws.close()  // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        }, this.timeout)
      }, this.timeout)
      
    },
    // 滚动条到底部
    scrollBottm() {
      this.$nextTick(() => {
        this.$refs['myScrollbar'].wrap.scrollTop = this.$refs['myScrollbar'].wrap.scrollHeight
      })
      
    },
    // 发送信息
    sendText() {
      // 组装本地显示数据
      const showData = {
        content: this.textarea,
        type: 0,
        fromOrTo: 1 // 前端自己的标识，自己对应列表
      }
      this.rightListData.push(showData)

      this.ws.send(this.textarea)
      this.textarea = '' // 清空
      setTimeout(()=> {
        this.scrollBottm()
      }, 500)
    },
    resize: debounce(function() {
        this.currentPage = 1
        this.leftListData = [] // 先清空
        this.leftList()

        // right 重置
        this.currentPage2 = 1
        this.customerNickname = ''
        this.rightListData = []
    }, 300),
    // 左边客户头像列表 搜索
    searchHandle() {
      // 重置
      this.currentPage = 1
      this.leftListData = []
      this.leftList()
    },
    // 左边客户头像列表
    leftList() {
        this.loading = true
        let params= {
            companyId: this.$store.getters.companyId,
            customerName: this.searchText,
            zbPage: {
                current: this.currentPage,
                size: this.sizePage
            }
        }
        serviceList(params).then(res => {
            const { records, pages } = res.data
            records.map(item => {
              item.receiveTime = formatTime(item.receiveTime)
            })
            if (records.length > 0) {
                this.currentPage++
                this.leftListData = this.leftListData.concat(records)
                this.totalPage = parseInt(pages)
                this.loading = false
            } else {
                this.loading = true
            }

        })
    },
    // 右边详情列表数据
    rightList(item, event) {
 
      if(event && event.type === 'click') {
        this.customerNickname = item.customerNickname
        // 重置
        this.currentPage2 = 1
        this.rightListData = []
      }
      // 保存客户id, 用于ws
      if(item && item.customerId) {
        this.toId = item.customerId
      }
      
      if(event && event.type === 'click') {
        // 初始化ws
        this.createWebSocket(this.$store.getters.userId, this.toId)
      }
      

      this.loading2 = true
      let params= {
          companyId: this.$store.getters.companyId,
          customerId: this.toId,
          zbPage: {
              current: this.currentPage2,
              size: this.sizePage2
          }
      }
      serviceGetLogs(params).then(res => {
          const { records, pages } = res.data
          records.map(item => {
            item.sendTime = formatTime(item.sendTime)
          })
          if (records.length > 0) {
              this.currentPage2++
              this.rightListData = [...records, ...this.rightListData]

              this.loading2 = false
              this.totalPage2 = parseInt(pages)

              if(event && event.type === 'click') { // 初始化第一次
                // 滚动到底部
                setTimeout(()=> {
                  this.scrollBottm()
                }, 500)
              }
              
          } else {
              this.loading2 = true
          }

      })
    }
  }
}
</script>
<style lang="scss" scoped>
.right-ul{
  padding-bottom: 20px!important;
}
.more-msg {
    color: rgb(64, 158, 255);
    text-align: center;
    font-size: 12px;
    line-height: 22px;
}
.container{
  padding: 0 20px;
  ul, li, p{
    margin: 0;
    padding: 0;
  }
  .no-chat{
    display: flex;
    align-items: center;
    justify-content: center;
    div{
      text-align: center;
    }
    p{
      font-size: 12px;
      color: #9EA1A9;
    }
  }
  .chat-title{
    position: relative;
    top: 20px;
    display: flex;
    align-items: center;
    h4{
      margin: 0;
      margin-right: 20px;
    }
    .set{
      color: #A39FAF;
      font-size: 12px;
    }
  }
  .chat-box{
    display: flex;
    margin-top: 30px;
    .chat-left{
      flex: 2;
      margin: 11px 20px 0 0;
      /deep/.search-chat{
        .el-input__inner{
          border-radius: 0;
          border: 0;
          border-bottom: 1px solid #E5EAF0;
        }
        
      }
      .chat-ul-left{
        margin: 20px 0 0 0;
        padding:0;
        li{
          cursor: pointer;
          position: relative;
          margin: 10px 0 0 0;
          display: flex;
          align-items: center;
          padding: 8px 10px;
          background: #FFFFFF;
          border-radius:4px;
          box-shadow:0px 3px 9px rgba(0,0,0,0.08);
          .chat-time{
            font-size: 11px;
            color: #787C84;
            position: absolute;
            top: 5px;
            right: 5px;
          }
          .person-name{
            font-size: 13px;
            padding-bottom: 5px;
          }
          .person-header{
            margin: 0 10px 0 0;
            width: 50px;
            height: 50px;
            img{
              border-radius: 100%;
              width: 50px;
              height: 50px;
            }
          }
          .person-text{
            position: relative;
            p{
              margin: 0;
              font-size: 12px;
              color: #787C84;
              /deep/.badge-num{
                .el-badge__content{
                  right: -15px;
                  top: 6px;
                }
              }
            }
            .record-number{
              display: block;
              width: 30px;
              height: 30px;
            }
          }
        }
      }
    }
    .chat-right{
      flex: 4;
      .chat-current-msg{
        .name{
          padding: 12px 0;
        }
        .tel{
          font-size: 12px;
          color: #787C84;
          padding: 5px 0;
        }
        border-bottom: 1px solid #E5EAF0;
      }
      .client-msg{
        display: flex;
        margin-top: 20px;
        .client-header{
          img{
            width: 50px;
            height: 50px;
            border-radius: 100%;
          }
          p{
            font-size: 11px;
            color: #787C84;
          }
        }
        .client-send-msg{
          margin: 6px 0 0 20px;
          p{
            font-size: 13px;
            padding: 10px;
            border-radius:8px;
            box-shadow:0px 3px 9px rgba(0,0,0,0.08);
          }
        }
      }
      .shopping-msg{
        margin-bottom: 40px;
      }
      .shopping-send-msg{
        cursor: pointer;
        margin-left: 20px;
        display: flex;
        align-items: center;
        height: 60px;
        box-shadow:0px 3px 9px rgba(0,0,0,0.08);
        border-radius: 8px;
        img{
          width: 60px;
          width: 60px;
        }
        .shopping-send-text{
          width: 280px;
          padding: 0 10px;
          font-size: 13px;
          line-height: 18px;
        }
        .shopping-send-icon{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 60px;
          color: #fff;
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
          background: #18ADE7;
          i{
            font-size: 30px;
          }
          
        }
      }
      .me-msg{
        text-align: right;
        margin-top: 20px;
        p{
          font-size: 13px;
          display: inline-block;
          padding: 10px;
          color: #fff;
          background: #18ADE7;
          border-radius:24px;
        }
        
      }
      .send{
        position: relative;
        .send-to-client{
          /deep/.el-textarea__inner{
            font-size: 13px;
          }
        }
        .send-btn{
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          font-size: 12px;
          right: 10px;
          top: 5px;
          width: 40px;
          height: 40px;
          color: #fff;
          background: #18ADE7;
          border-radius: 100%;
        }
      }
      
    }
    
  }
}
  
</style>
