import requestCsr from '@/utils/requestCsr'

/* 상담사 로그인 */
export function loginUser (params) {
  return requestCsr({
    url: '/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: params
    // params
  })
}

/* 상담사 회원가입 */
export function registerUser (params) {
  return requestCsr({
    url: '/user/join',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: params
  })
}

/* 회원 로그아웃 */
export function logoutUser () {
  return requestCsr({
    url: '/auth/logout',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
}

/* 상담사 로그아웃 */
export function logoutCsrUser (params) {
  return requestCsr({
    url: '/auth/logout',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: params
    // params
  })
}
