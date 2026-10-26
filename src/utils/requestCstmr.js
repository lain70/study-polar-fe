import axios from 'axios'
import envs from '@/envs'

const service = axios.create({
  baseURL: envs.apiBaseUrl,
  timeout: 30000, // timeout은 5초로 설정
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'x-auth-user-service-key': envs.serviceKey
  }
})

// axios의 reqeust 인터셉터 진행 부
service.interceptors.request.use(

  config => {
    // 토큰이 존재하는 경우 유효한 토큰인지 확인한다.
    // if (getToken()) {
    //     config.headers.Authorization = localStorage.getItem('accessToken');
    //     // config.headers['Authorization'] = sessionStorage.accessToken
    // }
    return config
  },
  error => {
    // 에러가 날경우 진행 부분
    console.log('요청 설정을 처리하지 못했습니다.') // for debug
    return Promise.reject(error)
  }
)

// axios의 response 인터셉터
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)
export default service
