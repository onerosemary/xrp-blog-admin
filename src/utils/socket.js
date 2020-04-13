var global_callback = null;
var websock = null;

function initWebSocket(userId, toId) { //初始化weosocket

    // ws地址
    var wsuri = `ws://120.25.247.94:8088/webSocket?fid=${userId}&toid=${toId}&eid=0&source=0`;
    websock = new WebSocket(wsuri);
    websock.onmessage = function (e) {
        websocketonmessage(e);
    }
    websock.onclose = function (e) {
        websocketclose(e);
    }
    websock.onopen = function () {
        websocketOpen();
    }
    //连接发生错误的回调方法
    websock.onerror = function () {
        console.log("WebSocket连接发生错误");
    }
}
// 实际调用的方法
function sendSock(agentData, callback) {
    global_callback = callback;
    
    if (websock.readyState === websock.OPEN) {
        //若是ws开启状态
        websocketsend(agentData)
        console.log('进入1')
    } else if (websock.readyState === websock.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        console.log('进入2')
        setTimeout(function () {
            sendSock(agentData, callback);
        }, 1000);
    } else {
        console.log('进入3')
        console.log('agentData', agentData)
        // 若未开启 ，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData, callback);
        }, 5000);
    }
}
//数据接收
function websocketonmessage(e) {
    if(global_callback!=null&&global_callback!=""&&global_callback!=undefined){
        global_callback(JSON.parse(e.data));
    }
    console.log('数据接受', JSON.parse(e.data))
    // return JSON.parse(e.data);
}

//数据发送
function websocketsend(agentData) {
    console.log('数据发送', agentData)
    websock.send(JSON.stringify(agentData));
}
//关闭
function websocketclose(e) {
    console.log("connection closed (" + e.code + ")");
}
function websocketOpen(e) {
    console.log("连接成功");
    // heartbeat();
    // login();
}
// initWebSocket(userId, toId);
export{initWebSocket, sendSock}