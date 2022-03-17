import requestCsr from '@/utils/requestCsr'

/* 상담사 로그인 */
export function loginCsrUser(params) {
    return requestCsr({
        url: '/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: params,
        // params
    })
}

/* 상담사 로그아웃 */
export function logoutCsrUser(params) {
    return requestCsr({
        url: '/auth/logout',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: params,
        // params
    })
}