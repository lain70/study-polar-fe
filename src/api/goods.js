import axios from 'axios'
import envs from '@/envs'

const goodsApi = axios.create({
  baseURL: envs.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'x-auth-user-service-key': envs.serviceKey
  }
})

export function getFeaturedGoods () {
  return goodsApi.get('/goods/featured')
}
