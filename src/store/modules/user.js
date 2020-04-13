import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { generaMenu } from '@/utils/index'
import _ from 'lodash'

import router from '@/router'
import { resetRouter } from '@/router'


const getDefaultState = () => {
  return {
    token: getToken(),
    userId: '', // 当前登录用户id
    name: '',
    companyId: '',
    routers: [], // 动态路由
    permissionBtns: [], // 动态按钮权限
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
  SET_USERID: (state, id) => {
    state.userId = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_COMPANYID: (state, companyId) => {
    state.companyId = companyId
  },
  SET_ROUTERS: (state, routers) => {
    state.routers = routers
  },
  SETPERMISSIONBTNS: (state, myPermissionBtns) => {
    state.permissionBtns = myPermissionBtns
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        const {id, name, companyId, roleDetail } = data

        let routers = []
        // 组装路由数据
        generaMenu(routers, roleDetail.resourceList).then(data => {
          const {myrouters, myPermissionBtns} = data
          console.log('myPermissionBtns---', _.uniq(myPermissionBtns))
          routers = myrouters
          commit ('SETPERMISSIONBTNS',  _.uniq(myPermissionBtns)) // 动态按钮权限存储vuex中
        }).catch(err => {
          console.log('err---', err)
        })
        commit('SET_ROUTERS', routers) // 动态路由存储vuex中
        
        commit('SET_USERID', id)
        commit('SET_NAME', name)
        commit('SET_COMPANYID', companyId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

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

