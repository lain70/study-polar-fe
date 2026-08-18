import { loginAdmin, logoutAdmin } from '@/api/admin'

export default {
  namespaced: true,
  state: {
    adminNo: '',
    adminId: '',
    adminName: '',
    adminDepartment: '',
    adminPosition: '',
    accessToken: ''
  },
  mutations: {
    SET_ADMIN_INFO (state, adminInfo) {
      state.adminNo = adminInfo.adminNo
      state.adminId = adminInfo.adminId
      state.adminName = adminInfo.adminName
      state.adminDepartment = adminInfo.adminDepartment
      state.adminPosition = adminInfo.adminPosition
      state.accessToken = adminInfo.accessToken
    },
    CLEAR_ADMIN_INFO (state) {
      state.adminNo = ''
      state.adminId = ''
      state.adminName = ''
      state.adminDepartment = ''
      state.adminPosition = ''
      state.accessToken = ''
    }
  },
  actions: {
    login ({ commit }, credentials) {
      return loginAdmin(credentials).then(response => {
        localStorage.setItem('adminAccessToken', response.data.accessToken)
        localStorage.setItem('adminRefreshToken', response.data.refreshToken)
        localStorage.setItem('adminName', response.data.adminName || '')
        localStorage.setItem('adminDepartment', response.data.adminDepartment || '')
        localStorage.setItem('adminPosition', response.data.adminPosition || '')
        commit('SET_ADMIN_INFO', response.data)
        return response.data
      })
    },
    logout ({ commit }) {
      return logoutAdmin().finally(() => {
        localStorage.removeItem('adminAccessToken')
        localStorage.removeItem('adminRefreshToken')
        localStorage.removeItem('adminName')
        localStorage.removeItem('adminDepartment')
        localStorage.removeItem('adminPosition')
        commit('CLEAR_ADMIN_INFO')
      })
    }
  }
}
