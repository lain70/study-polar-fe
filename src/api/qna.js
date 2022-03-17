import requestCstmr from '@/utils/requestCstmr'

/* 1:1 문의 목록 조회 */
export function getQnaList(params) {
    return requestCstmr({
        url: '/qna/list',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        data: null,
        params
    })
}

/* 1:1 문의 상세 조회 */
export function getQnaDetail(params) {
    return requestCstmr({
        url: '/qna/detail',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        data: null,
        params
    })
}

/* 1:1 문의 등록 */
export function registQnaInfo(params) {
    return requestCstmr({
        url: '/qna/save',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: params
    })
}

/* 1:1 문의 수정 */
export function updateQnaInfo(params) {
    return requestCstmr({
        url: '/qna/update',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: params
    })
}