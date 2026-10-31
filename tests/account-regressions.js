/* eslint-env node */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const vm = require('node:vm')

function load (file, dependencies = {}) {
  const source = fs.readFileSync(require('node:path').join(__dirname, '../src/views/user/', file), 'utf8')
  const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]
    .replace(/^import[^\n]*\n/gm, '').replace('export default', 'module.exports =')
  const context = { module: { exports: {} }, SiteHeader: {}, SiteFooter: {}, AccountIcon: {}, ...dependencies }
  vm.runInNewContext(script, context)
  const definition = context.module.exports
  const state = definition.data()
  for (const [name, method] of Object.entries(definition.methods || {})) state[name] = method.bind(state)
  return { state, definition }
}

const flush = () => new Promise(resolve => setImmediate(resolve))

test('profile fetch exposes loading then current member details', async () => {
  const profile = { userId: 'member', userName: 'Member', userPhone: null }
  const { state } = load('UserInfoView.vue', { getUserInfo: async () => ({ data: profile }), localStorage: { getItem: () => 'token' } })
  const loading = state.loadProfile()
  assert.equal(state.isLoading, true)
  await loading
  assert.equal(state.profile, profile)
  assert.equal(state.isLoading, false)
})

test('profile error hides old data and a retry can recover', async () => {
  let failed = true
  const { state } = load('UserInfoView.vue', {
    getUserInfo: async () => {
      if (failed) throw new Error('offline')
      return { data: { userId: 'member' } }
    },
    localStorage: { getItem: () => 'token' }
  })
  state.profile = { userId: 'previous' }
  await state.loadProfile()
  assert.equal(state.profile, null)
  assert.match(state.errorMessage, /불러오지/)
  failed = false
  await state.loadProfile()
  assert.equal(state.profile.userId, 'member')
  assert.equal(state.errorMessage, '')
})

test('late profile response from a previous account cannot populate the screen', async () => {
  let token = 'first'
  let complete
  const { state } = load('UserInfoView.vue', {
    getUserInfo: () => new Promise(resolve => { complete = resolve }),
    localStorage: { getItem: () => token }
  })
  const request = state.loadProfile()
  token = 'second'
  complete({ data: { userId: 'first-member' } })
  await request
  assert.equal(state.profile, null)
})

test('wrong password never creates an edit session or navigates', async () => {
  let navigated = false
  let stored = false
  const { state } = load('UserPasswordConfirm.vue', {
    confirmUserPassword: async () => { throw new Error('incorrect') },
    setUserProfileSession: () => { stored = true }
  })
  state.$router = { push: () => { navigated = true } }
  state.password = 'fixture-only'
  state.confirmPassword()
  await flush()
  assert.equal(navigated, false)
  assert.equal(stored, false)
  assert.match(state.errorMessage, /실패/)
})

test('correct password establishes the edit session before navigating and clears the field', async () => {
  let stored = false
  const { state } = load('UserPasswordConfirm.vue', {
    confirmUserPassword: async () => ({ data: { userId: 'member' } }),
    setUserProfileSession: () => { stored = true }
  })
  let destination
  state.$router = { push: route => { assert.equal(stored, true); destination = route } }
  state.password = 'fixture-only'
  state.confirmPassword()
  await flush()
  assert.equal(destination.name, 'userInfoEdit')
  assert.equal(state.password, '')
})

test('opening edit URL directly still requires password confirmation', () => {
  const { state, definition } = load('UserInfoEdit.vue', { getUserProfileSession: () => null })
  let destination
  state.$router = { replace: route => { destination = route } }
  definition.created.call(state)
  assert.equal(destination.name, 'userPasswordConfirm')
})
