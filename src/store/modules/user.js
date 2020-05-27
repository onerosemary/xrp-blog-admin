import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo } from '@/utils/auth'
// import { generaMenu } from '@/utils/index'
import _ from 'lodash'

import router from '@/router'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken() || '',
    userInfo: getUserInfo() && JSON.parse(getUserInfo()) || '' // 用户信息
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ email: username.trim(), password: password }).then(response => {
        const { token, userInfo } = response
        commit('SET_TOKEN', token)
        setToken(token)

        commit('SET_USER', userInfo)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo().then(response => {
  //       const { data } = response
  //       const { id, name, companyId, roleDetail } = data

  //       let routers = []
  //       // 组装路由数据
  //       generaMenu(routers, roleDetail.resourceList).then(data => {
  //         const { myrouters, myPermissionBtns } = data
  //         // console.log('myPermissionBtns---', _.uniq(myPermissionBtns))
  //         routers = myrouters
  //         commit('SETPERMISSIONBTNS', _.uniq(myPermissionBtns)) // 动态按钮权限存储vuex中
  //       }).catch(err => {
  //         console.log('err---', err)
  //       })
  //       commit('SET_ROUTERS', routers) // 动态路由存储vuex中

  //       commit('SET_USERID', id)
  //       commit('SET_NAME', name)
  //       commit('SET_COMPANYID', companyId)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter([])
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

