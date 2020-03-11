import Vue from 'vue'
// 全局挂载Vue上属性

/**
 * 计算table 百分比
 * columnWidth 列的宽带
 * tableWidth 总宽度
 */

function tableColumnMinWidth(columnWidth, tableWidth) {
  return parseFloat((columnWidth / tableWidth * 100).toFixed(4)) + '%'
}
/**
 * 计算屏幕高度差
 */
function heightV(h) {
  const screenHeight = document.body.clientHeight || document.documentElement.clientHeight
  return (screenHeight - h) + 'px'
}

Vue.prototype.heightV = heightV
Vue.prototype.tabWidth = tableColumnMinWidth
