import axios from 'axios'
import envs from '@/envs'

const service = axios.create({
  baseURL: envs.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'x-auth-user-service-key': envs.serviceKey
  }
})

service.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('adminAccessToken')

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  if (accessToken) {
    config.headers.Authorization = accessToken
  }

  return config
}, error => Promise.reject(error))

service.interceptors.response.use(
  response => response,
  error => {
    const status = error.response && error.response.status
    const requestUrl = error.config && error.config.url
    const isLoginRequest = requestUrl === '/admin/auth/login'

    if (!isLoginRequest && [401, 403, 406].includes(status)) {
      localStorage.removeItem('adminAccessToken')
      localStorage.removeItem('adminRefreshToken')
      localStorage.removeItem('adminName')
      localStorage.removeItem('adminDepartment')
      localStorage.removeItem('adminPosition')

      if (window.location.pathname !== '/admin/login') {
        window.location.replace('/admin/login')
      }
    }

    return Promise.reject(error)
  }
)

export default service
