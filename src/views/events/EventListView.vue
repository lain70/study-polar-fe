<template>
  <div class="event-page">
    <header class="site-header">
      <div class="utility-bar">
        <router-link class="brand" :to="{ name: 'main' }" aria-label="Polar Bear Shop 홈">
          <span class="brand-mark" aria-hidden="true">P</span>
          <span>POLAR BEAR SHOP</span>
        </router-link>
        <form class="search-form" role="search" @submit.prevent>
          <label class="sr-only" for="event-site-search">상품 검색</label>
          <input id="event-site-search" type="search" placeholder="찾고 있는 상품을 검색해 보세요">
          <button type="submit" aria-label="검색">검색</button>
        </form>
        <div class="account-actions">
          <button v-if="isAuthenticated" class="account-button" type="button" @click="editUserInfo">
            <span aria-hidden="true">○</span>
            회원정보 수정
          </button>
          <button class="auth-button" type="button" :disabled="isLoggingOut" @click="handleAuthAction">
            {{ authButtonText }}
          </button>
          <p v-if="logoutError" class="logout-error" role="alert">{{ logoutError }}</p>
        </div>
      </div>
      <nav class="main-nav" aria-label="주요 메뉴">
        <router-link :to="{ name: 'main' }">홈</router-link>
        <router-link :to="{ name: 'main', hash: '#new-arrivals' }">신상품</router-link>
        <router-link :to="{ name: 'main', hash: '#best-items' }">베스트</router-link>
        <router-link :to="{ name: 'eventList' }">이벤트</router-link>
        <router-link to="/csr">문의하기</router-link>
      </nav>
    </header>
    <main>
      <p class="eyebrow">POLAR BEAR EVENT</p>
      <h1>이벤트</h1>
      <p v-if="isLoading" class="message">이벤트를 불러오는 중입니다.</p>
      <p v-else-if="errorMessage" class="message error" role="alert">{{ errorMessage }}</p>
      <div v-else-if="events.length" class="event-grid">
        <article v-for="event in events" :key="event.eventNo">
          <div class="image">
            <img v-if="event.mainImageUrl" :src="imageUrl(event.mainImageUrl)" :alt="event.eventTitle">
            <span v-else>POLAR BEAR EVENT</span>
            <strong :class="{ ended: event.progressStatus === 'ENDED' }">{{ statusLabel(event.progressStatus) }}</strong>
          </div>
          <h2>{{ event.eventTitle }}</h2>
          <p>{{ date(event.eventStartDate) }} ~ {{ date(event.eventEndDate) }}</p>
        </article>
      </div>
      <p v-else class="message">현재 표시할 이벤트가 없습니다.</p>
    </main>
  </div>
</template>

<script>
import { getEvents } from '@/api/events'
import envs from '@/envs'

export default {
  name: 'EventListView',
  data: () => ({ events: [], isLoading: false, errorMessage: '', isAuthenticated: Boolean(localStorage.getItem('accessToken')), isLoggingOut: false, logoutError: '' }),
  computed: {
    authButtonText () {
      if (!this.isAuthenticated) return '로그인'
      return this.isLoggingOut ? '로그아웃 중' : '로그아웃'
    }
  },
  created () {
    this.isLoading = true
    getEvents()
      .then(({ data }) => { this.events = data })
      .catch(() => { this.errorMessage = '이벤트를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.' })
      .finally(() => { this.isLoading = false })
  },
  methods: {
    imageUrl (path) { return /^https?:\/\//.test(path) ? path : `${envs.apiBaseUrl.replace(/\/api$/, '')}${path}` },
    statusLabel (status) { return status === 'ENDED' ? '종료' : '진행중' },
    date (value) { return value ? value.slice(0, 10).replace(/-/g, '.') : '-' },
    editUserInfo () { this.$router.push({ name: 'userPasswordConfirm' }) },
    handleAuthAction () {
      if (!this.isAuthenticated) {
        this.$router.push({ name: 'userLogin' })
        return
      }
      this.logout()
    },
    logout () {
      this.logoutError = ''
      this.isLoggingOut = true
      this.$store.dispatch('UserLogoutProc')
        .then(() => { this.isAuthenticated = false })
        .catch(() => { this.logoutError = '로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.' })
        .finally(() => { this.isLoggingOut = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-page { --ink: #18343a; --line: #dce5e3; min-height: 100vh; background: #f8faf9; color: var(--ink); text-align: left; }
.site-header { position: relative; z-index: 10; border-bottom: 1px solid var(--line); background: rgba(255, 255, 255, .96); }
.utility-bar { max-width: 1240px; min-height: 92px; margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: 250px minmax(280px, 560px) 250px; align-items: center; justify-content: space-between; gap: 28px; }
.brand { display: inline-flex; align-items: center; gap: 11px; color: var(--ink); font-size: 12px; font-weight: 800; letter-spacing: .16em; text-decoration: none; }
.brand-mark { width: 36px; height: 36px; display: grid; flex: 0 0 auto; place-items: center; border: 1px solid #9ab2ae; border-radius: 50%; font: 19px Georgia, serif; letter-spacing: 0; }
.search-form { height: 46px; display: flex; border: 1px solid #cbd8d6; border-radius: 24px; background: #f7faf9; overflow: hidden; }
.search-form input { min-width: 0; flex: 1; padding: 0 20px; border: 0; outline: 0; background: transparent; color: var(--ink); font-size: 13px; }
.search-form input::placeholder { color: #97a6a6; } .search-form button { padding: 0 20px; border: 0; background: transparent; color: var(--ink); font-size: 12px; font-weight: 800; cursor: pointer; }
.account-actions { position: relative; justify-self: end; display: inline-flex; align-items: center; gap: 14px; }
.account-button,.auth-button { border: 0; background: transparent; color: var(--ink); font-size: 12px; font-weight: 700; cursor: pointer; } .account-button span { width: 26px; height: 26px; display: grid; place-items: center; border: 1px solid #b9c8c6; border-radius: 50%; font-size: 11px; }
.auth-button { padding-left: 14px; border-left: 1px solid #d9e2e0; color: #667b80; } .auth-button:disabled { cursor: wait; opacity: .6; } .logout-error { position: absolute; top: 30px; right: 0; width: 250px; margin: 0; color: #b14949; font-size: 10px; text-align: right; }
.main-nav { min-height: 54px; display: flex; align-items: center; justify-content: center; gap: clamp(34px, 6vw, 76px); border-top: 1px solid #edf1f0; }
.main-nav a { color: #40585d; font-size: 13px; font-weight: 700; text-decoration: none; } .main-nav a:hover,.main-nav .router-link-exact-active { color: #4d827b; }
main { max-width: 1180px; margin: 0 auto; padding: 72px 32px 100px; }
.eyebrow { color: #78908c; font-size: 11px; font-weight: 800; letter-spacing: .16em; } h1 { margin: 8px 0 42px; font: 400 42px Georgia, serif; }
.event-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 34px 22px; } article { min-width: 0; }
.image { height: 250px; position: relative; display: grid; place-items: center; overflow: hidden; background: #e6eeec; color: #78908c; font-size: 11px; letter-spacing: .12em; }
.image img { width: 100%; height: 100%; object-fit: cover; } .image strong { position: absolute; top: 14px; right: 14px; padding: 7px 10px; background: #18343a; color: #fff; font-size: 11px; } .image strong.ended { background: #7c8987; }
article h2 { margin: 18px 0 9px; font-size: 18px; } article p { margin: 0; color: #71827f; font-size: 13px; } .message { padding: 60px 0; text-align: center; } .error { color: #b14949; }
@media(max-width:800px){.utility-bar{grid-template-columns:1fr;gap:20px;padding:24px 20px}.account-actions{justify-self:start}.main-nav{gap:18px;flex-wrap:wrap;padding:14px 20px}.event-grid{grid-template-columns:1fr}.image{height:220px}}
</style>
