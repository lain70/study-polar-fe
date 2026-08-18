import axios from 'axios'
import envs from '@/envs'

const productApi = axios.create({
  baseURL: envs.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'x-auth-user-service-key': envs.serviceKey
  }
})

export function getFeaturedProducts () {
  return productApi.get('/products/featured')
}
