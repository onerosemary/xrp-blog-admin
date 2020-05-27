/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @fileds  账号，密码
 * @reg 英文，数字，不少于6个字符
 */
export function checkAccount(rule, value, callback) {
  const reg = /^[0-9A-Za-z]{6,}$/

  if (!value) {
    return callback(new Error('不能为空'))
  } else if (!reg.test(value)) {
    return callback(new Error('只支持英文, 数字, 并不能少于6个字符'))
  } else {
    callback()
  }
}

