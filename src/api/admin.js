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

export function getAdminProducts (params) {
  return requestAdmin({ url: '/admin/products', method: 'GET', params })
}

export function getAdminProduct (productNo) {
  return requestAdmin({ url: `/admin/products/${productNo}`, method: 'GET' })
}

export function createAdminProduct (formData) {
  return requestAdmin({
    url: '/admin/products',
    method: 'POST',
    data: formData
  })
}
