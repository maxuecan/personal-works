import { getInfo, checkToken, logout } from '@/api/user'
import { getToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  account: 0,
  token: getToken(),
  roles: [],
  token_timer: '', // checkToken，定时器,
  home_animate: sessionStorage.getItem('homeAnimate') || false 
}

const mutations = {
  SET_ACCOUNT(state: any, account: string) {
    state.account = account
  },
  SET_TOKEN(state: any, token: string) {
    state.token = token
  },
  SET_ROLES(state: any, roles: any[]) {
    state.roles = roles
  },
  SET_TIMER_EMPTY: (state: any, string: string) => {
    state.token_timer = string
  },
  SET_HOME_ANIMATE: (state: any, bol: boolean) => {
    state.home_animate = bol
  }
}

const actions = {
  getAaccount({ commit }) {
    commit('SET_ACCOUNT')
  },
  getToken({ commit }) {
    commit('SET_TOKEN')
  },
  // 重置/删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  // 每20s checkToken
  checkToken({ commit, state }, boolean) {
    if (boolean) {
      if (!state.token_timer) {
        state.token_timer = setInterval(() => {
          checkToken({
            token: state.token 
          })
            .then((response) => {
              console.log(response)
            })
        }, 20000)
      }
    } else {
      if (state.token_timer) {
        clearInterval(state.token_timer)
        commit('SET_TIMER_EMPTY', '')
      }
    }
  },
  // 获取个人信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({
        token: state.token
      })
        .then((response) => {
          commit('SET_ROLES', response['roles'])
  
          // 登录的时候需要调用一次checktoken
          checkToken({
            token: state.token
          })
            .then((response) => {
  
            })
  
          resolve(response)
        })
        .catch(() => {})
    })
  },
  // 登出
  logout({ dispatch, commit, state }, boolean) {
    return new Promise((resolve, reject) => {
      dispatch('checkToken', false)
      logout({
        token: state.token,
        emergency: boolean
      })
        .then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          commit('SET_ROLES', [])
          resetRouter()
          resolve()
        })
        .catch((error) => {
          dispatch('checkToken', true)
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
