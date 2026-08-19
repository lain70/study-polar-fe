import requestAdmin from '@/utils/requestAdmin'

export function loginAdmin (params) {
  return requestAdmin({
    url: '/admin/auth/login',
    method: 'POST',
    data: params
  })
}

export function logoutAdmin () {
  return requestAdmin({
    url: '/admin/auth/logout',
    method: 'POST'
  })
}

export function getAdminGoodsList (params) {
  return requestAdmin({ url: '/admin/goods', method: 'GET', params })
}

export function getAdminGoods (goodsNo) {
  return requestAdmin({ url: `/admin/goods/${goodsNo}`, method: 'GET' })
}

export function createAdminGoods (formData) {
  return requestAdmin({
    url: '/admin/goods',
    method: 'POST',
    data: formData
  })
}
