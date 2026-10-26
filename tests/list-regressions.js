/* eslint-env node */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

function loadComponent (file, dependencies = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../src/views', file), 'utf8')
  const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]
    .replace(/^import[\s\S]*?from[^\n]*\n/gm, '')
    .replace('export default', 'module.exports =')
  const context = { module: { exports: {} }, console: { log () {} }, ...dependencies }
  vm.runInNewContext(script, context, { filename: file })
  const component = context.module.exports
  const state = component.data()
  for (const [name, method] of Object.entries(component.methods || {})) state[name] = method.bind(state)
  for (const [name, getter] of Object.entries(component.computed || {})) Object.defineProperty(state, name, { get: getter.bind(state) })
  return { state, source }
}

function deferred () {
  const request = {}
  request.promise = new Promise((resolve, reject) => { request.resolve = resolve; request.reject = reject })
  return request
}

const flush = () => new Promise(resolve => setImmediate(resolve))

for (const file of ['qna/QnaInfoList.vue', 'csr/CsrQnaInfoList.vue']) {
  test(`${file}: pagination covers zero, exact multiples and remainders`, () => {
    const { state } = loadComponent(file)
    for (const count of [0, 1, state.pageCount, state.pageCount * 2, state.pageCount * 2 + 1]) {
      state.totalCnt = count
      state.fn_calPaging()
      assert.equal(state.totalPageCnt, Math.max(1, Math.ceil(count / state.pageCount)))
    }
  })
}
test('customer inquiry recalculates pages after the asynchronous count response', async () => {
  const response = deferred()
  const { state } = loadComponent('qna/QnaInfoList.vue', { getQnaList: () => response.promise })
  state.fn_getQnaInfoList()
  response.resolve({ status: 200, data: [{ qnaNo: 1 }], headers: { 'x-total-count': '12' } })
  await flush()
  assert.equal(state.totalPageCnt, 3)
  state.fn_getQnaInfoList = () => {}
  state.fn_clickPaging(2)
  assert.equal(state.selPage, 2)
  state.fn_clickPaging(4)
  assert.equal(state.selPage, 2)
})
