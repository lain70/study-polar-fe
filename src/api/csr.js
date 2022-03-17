import requestCsr from '@/utils/requestCsr'

/* 1:1 문의 목록 조회 */
export function getCsrQnaList(params) {
    return requestCsr({
        url: '/csr/qna/list',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        data: null,
        params
    })
}

/* 1:1 문의 상세 조회 */
export function getCsrQnaDetail(params) {
    return requestCsr({
        url: '/csr/qna/detail',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        data: null,
        params
    })
}

/* 1:1 문의 담당자 등록 */
export function registCsrNoInfo(params) {
    return requestCsr({
        url: '/csr/qna/savecsrinfo',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: params,
        params
    })
}

/* 1:1 문의 담당자 확인 */
export function checkQnaCsrNo(params) {
    return requestCsr({
        url: '/csr/qna/checkqnacsr',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: null,
        params
    })
}

/* 1:1 문의 답변 등록 */
export function registCsrQnaReply(params) {
    return requestCsr({
        url: '/csr/qna/savereplay',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: params
    })
}

/* 1:1 문의 답변 수정 */
export function updateCsrQnaReply(params) {
    return requestCsr({
        url: '/csr/qna/updatereplay',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: params
    })
}