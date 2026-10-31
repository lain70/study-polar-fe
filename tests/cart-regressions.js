/* eslint-env node */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const vm = require('node:vm')

function component (file, dependencies = {}) {
  const source = fs.readFileSync(require('node:path').join(__dirname, '../src/', file), 'utf8')
  const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]
    .replace(/^import[^\n]*\n/gm, '').replace('export default', 'module.exports =')
  const context = { module: { exports: {} }, SiteHeader: {}, SiteFooter: {}, AccountIcon: {}, ...dependencies }
  vm.runInNewContext(script, context)
  const definition = context.module.exports
  const state = definition.data()
  for (const [key, fn] of Object.entries(definition.methods || {})) state[key] = fn.bind(state)
  for (const [key, fn] of Object.entries(definition.computed || {})) Object.defineProperty(state, key, { get: fn.bind(state) })
  return state
}

test('cart excludes unavailable and overstock items from the amount', () => {
  const state = component('views/cart/CartView.vue')
  state.items = [
    { available: true, unitPrice: 15000, quantity: 2, stockQuantity: 3 },
    { available: false, unitPrice: null, quantity: 2, stockQuantity: 0 },
    { available: true, unitPrice: 5000, quantity: 9, stockQuantity: 3 }
  ]
  assert.equal(state.totalAmount, 30000)
})

test('failed load clears previous member data without reporting an empty cart', async () => {
  const state = component('views/cart/CartView.vue', { getCart: async () => { throw new Error('offline') } })
  state.items = [{ goodsNo: 1 }]
  await state.loadCart()
  assert.equal(state.items.length, 0)
  assert.equal(state.hasLoaded, false)
  assert.match(state.errorMessage, /불러오지/)
})

test('invalid quantity cannot trigger an update', async () => {
  let called = false
  const state = component('views/cart/CartView.vue', { updateCartItem: async () => { called = true } })
  for (const quantity of [0, -1, 1.5, 11, '2']) {
    state.quantities[7] = quantity
    await state.saveQuantity({ goodsNo: 7, stockQuantity: 10 })
  }
  assert.equal(called, false)
})

test('failed delete retains the item and exposes the server error', async () => {
  const state = component('views/cart/CartView.vue', {
    deleteCartItem: async () => { throw Object.assign(new Error('unauthorized'), { response: { data: { ERROR_MSG: '다시 로그인해 주세요.' } } }) }
  })
  state.items = [{ goodsNo: 7 }]
  await state.removeItem(state.items[0])
  assert.equal(state.items.length, 1)
  assert.equal(state.notice, '')
  assert.equal(state.isSaving, false)
  assert.equal(state.errorMessage, '다시 로그인해 주세요.')
})

test('a session change removes cart details before returning to login', () => {
  const state = component('views/cart/CartView.vue')
  let destination
  state.$router = { replace: route => { destination = route } }
  state.items = [{ goodsNo: 7 }]
  state.handleSessionChange({ key: 'accessToken' })
  assert.equal(state.items.length, 0)
  assert.equal(destination.name, 'userLogin')
})

test('anonymous add returns to the same product after login and never writes cart', async () => {
  let called = false
  let destination
  const state = component('views/goods/GoodsDetailView.vue', {
    localStorage: { getItem: () => null },
    addCartItem: async () => { called = true }
  })
  state.goods = { goodsNo: 7 }
  state.$router = { push: route => { destination = route } }
  await state.addToCart()
  assert.equal(called, false)
  assert.equal(destination.name, 'userLogin')
  assert.equal(destination.query.goodsNo, '7')
})

test('logout from cart navigates away from private contents', async () => {
  const state = component('components/SiteHeader.vue', { localStorage: { getItem: () => 'fixture-token' } })
  let destination
  state.$route = { name: 'cart' }
  state.$router = { replace: route => { destination = route } }
  state.$store = { dispatch: async () => {} }
  state.logout()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(state.isAuthenticated, false)
  assert.equal(destination.name, 'userLogin')
})

test('cart success opens a modal only after the request succeeds', async () => {
  let resolveRequest
  let opened = 0
  const state = component('views/goods/GoodsDetailView.vue', {
    localStorage: { getItem: () => 'fixture-token' },
    addCartItem: () => new Promise(resolve => { resolveRequest = resolve })
  })
  state.goods = { goodsNo: 7, goodsStatus: 'ON_SALE' }
  state.$refs = { cartDialog: { open: false, showModal: () => { opened++ } } }
  const request = state.addToCart()
  assert.equal(opened, 0)
  resolveRequest()
  await request
  assert.equal(opened, 1)
  assert.equal(state.isAddingToCart, false)
})

test('failed cart request never opens the success modal', async () => {
  let opened = false
  const state = component('views/goods/GoodsDetailView.vue', {
    localStorage: { getItem: () => 'fixture-token' },
    addCartItem: async () => { throw new Error('offline') }
  })
  state.goods = { goodsNo: 7, goodsStatus: 'ON_SALE' }
  state.$refs = { cartDialog: { open: false, showModal: () => { opened = true } } }
  await state.addToCart()
  assert.equal(opened, false)
  assert.match(state.cartError, /담지 못했습니다/)
})

test('late response for a different product cannot open the success modal', async () => {
  let resolveRequest
  let opened = false
  const state = component('views/goods/GoodsDetailView.vue', {
    localStorage: { getItem: () => 'fixture-token' },
    addCartItem: () => new Promise(resolve => { resolveRequest = resolve })
  })
  state.goods = { goodsNo: 7, goodsStatus: 'ON_SALE' }
  state.$refs = { cartDialog: { open: false, showModal: () => { opened = true } } }
  const request = state.addToCart()
  state.goods = { goodsNo: 8, goodsStatus: 'ON_SALE' }
  resolveRequest()
  await request
  assert.equal(opened, false)
})

test('modal cart action closes the dialog and navigates to cart', () => {
  let closed = false
  let destination
  const state = component('views/goods/GoodsDetailView.vue', { localStorage: { getItem: () => 'fixture-token' } })
  state.$refs = { cartDialog: { open: true, close: () => { closed = true } } }
  state.$router = { push: route => { destination = route } }
  state.goToCart()
  assert.equal(closed, true)
  assert.equal(destination.name, 'cart')
})
