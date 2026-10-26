/* eslint-env node */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

function loadModule (file, dependencies = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../src', file), 'utf8')
    .replace(/^import[^\n]*\n/gm, '')
    .replace('export default', 'module.exports =')
  const context = { module: { exports: {} }, console: { log () {} }, ...dependencies }
  vm.runInNewContext(source, context)
  return context.module.exports
}
const helperSource = fs.readFileSync(path.join(__dirname, '../src/utils/requestError.js'), 'utf8').replace('export function', 'function')
const helperContext = {}
vm.runInNewContext(helperSource, helperContext)
const { getRequestErrorMessage } = helperContext
const flush = () => new Promise(resolve => setImmediate(resolve))

function client () {
  const service = loadModule('utils/requestCstmr.js', { axios, envs: {} })
  return { service, mock: new MockAdapter(service) }
}

test('successful requests still resolve their data', async () => {
  const { service, mock } = client()
  mock.onGet('/test').reply(200, { ok: true })
  assert.deepEqual((await service.get('/test')).data, { ok: true })
})
test('HTTP failures reject with the original server response', async () => {
  const { service, mock } = client()
  mock.onGet('/test').reply(400, { ERROR_MSG: '잘못된 요청입니다.' })
  await assert.rejects(service.get('/test'), error => error.response.status === 400 && getRequestErrorMessage(error) === '잘못된 요청입니다.')
})
test('network failures reject instead of resolving undefined', async () => {
  const { service, mock } = client()
  mock.onGet('/test').networkError()
  await assert.rejects(service.get('/test'), error => getRequestErrorMessage(error) === '시스템 오류가 발생하였습니다.')
})
test('timeouts reject and retain their error code', async () => {
  const { service, mock } = client()
  mock.onGet('/test').timeout()
  await assert.rejects(service.get('/test'), error => error.code === 'ECONNABORTED')
})
test('request interceptor failures propagate the original error', async () => {
  const { service } = client()
  const failure = new Error('setup failure')
  service.interceptors.request.use(() => { throw failure })
  await assert.rejects(service.get('/test'), error => error === failure)
})
test('error messages fall back safely when the response is missing or malformed', () => {
  for (const error of [undefined, new Error('network'), { response: { data: { ERROR_MSG: {} } } }, { response: { data: { ERROR_MSG: ' ' } } }]) {
    assert.equal(getRequestErrorMessage(error), '시스템 오류가 발생하였습니다.')
  }
})

function loadView (file, dependencies) {
  const source = fs.readFileSync(path.join(__dirname, '../src/views', file), 'utf8').match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]
    .replace(/^import[^\n]*\n/gm, '').replace('export default', 'module.exports =')
  const messages = []
  const context = { module: { exports: {} }, console: { log () {} }, alert: message => messages.push(message), clearInterval () {}, getRequestErrorMessage, ...dependencies }
  vm.runInNewContext(source, context)
  const component = context.module.exports
  const state = component.data()
  for (const [name, method] of Object.entries(component.methods)) state[name] = method.bind(state)
  Object.defineProperty(state, 'qnaData', { get: () => state.data })
  return { state, messages }
}

const error = { response: { data: { ERROR_MSG: '요청 처리에 실패했습니다.' } } }
for (const [file, api, method] of [
  ['qna/QnaInfoList.vue', 'getQnaList', 'fn_getQnaInfoList'],
  ['qna/QnaInfoDetail.vue', 'getQnaDetail', 'fn_getQnaInfoDetail'],
  ['qna/QnaInfoDetail.vue', 'registQnaInfo', 'fn_registQna'],
  ['qna/QnaInfoDetail.vue', 'updateQnaInfo', 'fn_updateQna'],
  ['csr/CsrQnaInfoDetail.vue', 'getCsrQnaDetail', 'fn_getQnaInfoDetail'],
  ['csr/CsrQnaInfoDetail.vue', 'registCsrQnaReply', 'fn_saveQnaReply'],
  ['csr/CsrQnaInfoDetail.vue', 'updateCsrQnaReply', 'fn_updateQnaReply'],
  ['csr/CsrQnaInfoList.vue', 'getCsrQnaList', 'fn_getQnaInfoList'],
  ['csr/CsrQnaInfoList.vue', 'registCsrNoInfo', 'fn_saveQnaCsrInfo'],
  ['csr/CsrQnaInfoList.vue', 'checkQnaCsrNo', 'fn_goToPage']
]) {
  test(`${method} / ${api}: rejected requests display an error without success navigation`, async () => {
    let calls = 0
    const { state, messages } = loadView(file, { [api]: () => { calls++; return Promise.reject(error) } })
    state.data = { qnaUserId: 'test', qnaUserPwd: 'test-only', qnaTitle: 'title', qnaContents: 'content', csrNo: 1, answerYn: 'Y', qnaReplyContents: 'reply' }
    state.qnaDataList = [{ qnaNo: 1, qnaUserId: 'test', answerYn: 'N', checked: true }]
    state.pollingYn = true
    state[method]()
    await flush()
    assert.equal(calls, 1)
    assert.deepEqual(messages, ['요청 처리에 실패했습니다.'])
    if (api === 'getCsrQnaList') assert.equal(state.pollingYn, false)
  })
}
test('CSR logout rejects an Error for an absent response', async () => {
  const module = loadModule('store/modules/user.js', { logoutCsrUser: () => Promise.resolve(undefined) })
  await assert.rejects(module.actions.CsrLogoutProc({}, {}), error => typeof error.message === 'string' && error.message.includes('로그아웃'))
})
test('CSR logout preserves transport errors', async () => {
  const failure = new Error('transport failure')
  const module = loadModule('store/modules/user.js', { logoutCsrUser: () => Promise.reject(failure) })
  await assert.rejects(module.actions.CsrLogoutProc({}, {}), error => error === failure)
})
