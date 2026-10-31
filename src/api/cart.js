import request from '@/utils/requestCsr'

export function getCart () {
  return request({ url: '/user/cart', method: 'GET' })
}

export function addCartItem (goodsNo, quantity) {
  return request({ url: `/user/cart/${goodsNo}`, method: 'POST', data: { quantity } })
}

export function updateCartItem (goodsNo, quantity) {
  return request({ url: `/user/cart/${goodsNo}`, method: 'PUT', data: { quantity } })
}

export function deleteCartItem (goodsNo) {
  return request({ url: `/user/cart/${goodsNo}`, method: 'DELETE' })
}
