import { defineStore } from "pinia";
import { getInfo, checkToken } from "@/api/user";

type state = {
  token: String
}

/*
  defineStore 是需要传参数的，其中第一个参数是id，就是一个唯一的值，
  简单点说就可以理解成是一个命名空间.
  第二个参数就是一个对象，里面有三个模块需要处理，第一个是 state，
  第二个是 getters，第三个是 actions。
*/

const useUser = defineStore('user', {
  state: () => ({
    account: 0,
    roles: [],
    token_timer: '', // checkToken，定时器,
    home_animate: sessionStorage.getItem('homeAnimate') || false 
  }),
  getters: {
    //基本使用
    newAccount(state) {
      return 'Dear ' + state.account
    },
  },
  actions: {
    // 获取个人信息
    getInfo(state: state) {
      return new Promise((resolve, reject) => {
        getInfo({
          token: state.token
        })
          .then((response: any) => {
            this.roles = response['roles']
    
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
  }
})

export default useUser
