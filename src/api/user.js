import requestCsr from '@/utils/requestCsr'

export function confirmUserPassword (userPwd) {
  return requestCsr({
    url: '/user/password-confirm',
    method: 'POST',
    data: { userPwd }
  })
}

export function updateUserInfo (params) {
  return requestCsr({
    url: '/user/info',
    method: 'PUT',
    data: params
  })
}
