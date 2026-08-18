import { loginUser, logoutUser, logoutCsrUser } from '@/api/login.js'

export default {
  state: {
    userId: '',
    csrNm: '',
    userNo: '',
    lastLoginDt: '',
    accessToken: '',
    refreshToken: ''
  },
  mutations: {
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_CSR_NAME: (state, csrNm) => {
      state.csrNm = csrNm
    },
    SET_USER_NO: (state, userNo) => {
      state.userNo = userNo
    },
    SET_LAST_LOGIN_DT: (state, lastLoginDt) => {
      state.lastLoginDt = lastLoginDt
    },
    SET_ACCESS_TOKEN: (state, accessToken) => {
      state.accessToken = accessToken
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      state.refreshToken = refreshToken
    }

  },
  actions: {
    UserLoginProc ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginUser(userInfo).then(response => {
          if (response && response.status === 200) {
            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            commit('SET_USER_NO', response.data.userNo)
            commit('SET_USER_ID', response.data.userId)
            commit('SET_ACCESS_TOKEN', response.data.accessToken)
            commit('SET_REFRESH_TOKEN', response.data.refreshToken)
            resolve(true)
          } else {
            reject(new Error('로그인 응답이 올바르지 않습니다.'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    UserLogoutProc ({ commit }) {
      return logoutUser().then(response => {
        if (!response || response.status !== 200) {
          throw new Error('로그아웃 응답이 올바르지 않습니다.')
        }

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        commit('SET_USER_NO', '')
        commit('SET_USER_ID', '')
        commit('SET_ACCESS_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
      })
    },
    CsrLogoutProc ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        console.log('store actions Logout')
        logoutCsrUser(userInfo).then(response => {
          console.log(response)
          if (response && response.status === 200) {
            localStorage.setItem('accessToken', '')
            localStorage.setItem('refreshToken', '')
            resolve(true)
          } else {
            if (response.data && response.data.ERROR_MSG) {
              alert(response.data.ERROR_MSG)
            } else {
              alert('시스템 오류가 발생하였습니다.')
            }
            reject()
          }
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    }
  }
}
