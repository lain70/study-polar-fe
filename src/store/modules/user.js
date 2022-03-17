import { loginCsrUser, logoutCsrUser } from '@/api/login.js'
import store from '@/store'

export default {
    state: {
        csrId: '',
        csrNm: '',
        csrNo: '',
        lastLoginDt: '',
        accessToken: '',
        refreshToken: '',
    },
    mutations: {
        SET_CSR_ID: (state, csrId) => {
            state.csrId = csrId
        },
        SET_CSR_NAME: (state, csrNm) => {
            state.csrNm = csrNm
        },
        SET_CSR_NO: (state, csrNo) => {
            state.csrNo = csrNo
        },
        SET_LAST_LOGIN_DT: (state, lastLoginDt) => {
            state.lastLoginDt = lastLoginDt
        },
        SET_ACCESS_TOKEN: (state, accessToken) => {
            state.accessToken = accessToken
        },
        SET_REFRESH_TOKEN: (state, refreshToken) => {
            state.refreshToken = refreshToken
        },

    },
    actions: {
        CsrLoginProc({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                console.log('store actions Login')
                loginCsrUser(userInfo).then(response => {
                    console.log(response)
                    if (response && response.status === 200) {
                        localStorage.setItem('accessToken', response.data.accessToken)
                        localStorage.setItem('refreshToken', response.data.refreshToken)
                        commit('SET_CSR_NO', response.data.csrNo)
                        commit('SET_CSR_ID', response.data.csrId)
                        commit('SET_ACCESS_TOKEN', response.data.accessToken)
                        commit('SET_REFRESH_TOKEN', response.data.refreshToken)
                        resolve(true);
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
        },
        CsrLogoutProc({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                console.log('store actions Logout')
                logoutCsrUser(userInfo).then(response => {
                    console.log(response)
                    if (response && response.status === 200) {
                        localStorage.setItem('accessToken', '')
                        localStorage.setItem('refreshToken', '')
                        resolve(true);
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
        },
    }
}