import Cookies from 'js-cookie'

const TokenKey = 'blog_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 用户信息
const userInfo = 'userInfo'

export function getUserInfo() {
  return Cookies.get(userInfo)
}

export function setUserInfo(token) {
  return Cookies.set(userInfo, token)
}

export function removeUserInfo() {
  return Cookies.remove(userInfo)
}

