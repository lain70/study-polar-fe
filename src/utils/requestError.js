export function getRequestErrorMessage (error, fallback = '시스템 오류가 발생하였습니다.') {
  const data = error && error.response && error.response.data
  return data && typeof data.ERROR_MSG === 'string' && data.ERROR_MSG.trim()
    ? data.ERROR_MSG
    : fallback
}
