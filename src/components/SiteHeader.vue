<template>
  <header class="site-header">
    <div class="utility-bar">
      <router-link class="brand" :to="{ name: 'main' }" aria-label="Polar Bear Shop 홈">
        <span class="brand-mark" aria-hidden="true">P</span>
        <span>POLAR BEAR SHOP</span>
      </router-link>
      <form class="search-form" role="search" @submit.prevent>
        <label class="sr-only" for="site-search">상품 검색</label>
        <input id="site-search" type="search" placeholder="찾고 있는 상품을 검색해 보세요">
        <button type="submit" aria-label="검색">검색</button>
      </form>
      <div class="account-actions">
        <router-link class="account-link" :to="{ name: 'myPage' }">
          <span class="account-icon"><account-icon name="user" /></span>
          <span>마이페이지</span>
        </router-link>
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
</template>

<script>
import AccountIcon from '@/components/AccountIcon.vue'

export default {
  name: 'SiteHeader',
  components: { AccountIcon },
  data: () => ({ isAuthenticated: Boolean(localStorage.getItem('accessToken')), isLoggingOut: false, logoutError: '' }),
  computed: {
    authButtonText () {
      if (!this.isAuthenticated) return '로그인'
      return this.isLoggingOut ? '로그아웃 중' : '로그아웃'
    }
  },
  methods: {
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
        .then(() => {
          this.isAuthenticated = false
          if (['cart', 'myPage', 'userInfoView'].includes(this.$route.name)) this.$router.replace({ name: 'userLogin' })
        })
        .catch(() => { this.logoutError = '로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.' })
        .finally(() => { this.isLoggingOut = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.account-link { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; color: var(--color-foreground); font-size: 13px; font-weight: 700; text-decoration: none; white-space: nowrap; }
.account-icon { display: grid; place-items: center; width: 32px; height: 32px; border: 1px solid var(--color-border); border-radius: 50%; }
.account-icon svg { width: 19px; height: 19px; }
.account-link:hover, .account-link.router-link-active { color: var(--color-primary); }
@media (max-width: 480px) { .account-link { gap: 6px; font-size: 12px; } .account-icon { width: 26px; height: 26px; } }
.site-header { position: relative; z-index: 10; border-bottom: 1px solid var(--color-border); background: rgba(255, 255, 255, .96); }
.utility-bar { max-width: 1240px; min-height: 100px; margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: minmax(200px, 1fr) minmax(220px, 480px) auto; align-items: center; justify-content: space-between; gap: 28px; }
.brand { display: inline-flex; align-items: center; gap: 11px; color: var(--color-foreground); font-size: 12px; font-weight: 800; letter-spacing: .16em; text-decoration: none; }
.brand-mark { width: 36px; height: 36px; display: grid; flex: 0 0 auto; place-items: center; border: 1px solid #9ab2ae; border-radius: 50%; font: 19px Georgia, serif; letter-spacing: 0; }
.search-form { height: 46px; display: flex; border: 1px solid #cbd8d6; border-radius: 24px; background: #f7faf9; overflow: hidden; }
.search-form input { min-width: 0; flex: 1; padding: 0 20px; border: 0; outline: 0; background: transparent; color: var(--color-foreground); font-size: 14px; }
.search-form input::placeholder { color: var(--color-muted-foreground); } .search-form button { padding: 0 20px; border: 0; background: transparent; color: var(--color-foreground); font-size: 12px; font-weight: 800; cursor: pointer; }
.account-actions { position: relative; justify-self: end; display: inline-flex; align-items: center; gap: 14px; } .account-button,.auth-button { border: 0; background: transparent; color: var(--color-foreground); font-size: 12px; font-weight: 700; cursor: pointer; }
.account-button span { width: 26px; height: 26px; display: grid; place-items: center; border: 1px solid #b9c8c6; border-radius: 50%; font-size: 12px; }
.auth-button { padding-left: 14px; border-left: 1px solid #d9e2e0; color: #667b80; } .auth-button:disabled { cursor: wait; opacity: .6; }
.logout-error { position: absolute; top: 30px; right: 0; width: 250px; margin: 0; color: var(--color-destructive); font-size: 12px; text-align: right; }
.main-nav { min-height: 56px; display: flex; align-items: center; justify-content: center; gap: clamp(34px, 6vw, 76px); }
.main-nav a { color: #40585d; font-size: 14px; font-weight: 700; text-decoration: none; } .main-nav a:hover,.main-nav .router-link-exact-active { color: #4d827b; }
@media(max-width:800px){.utility-bar{grid-template-columns:1fr;gap:20px;padding:24px 20px}.account-actions{justify-self:start}.main-nav{gap:18px;flex-wrap:wrap;padding:14px 20px}}

.search-form:focus-within { outline: 3px solid var(--color-ring); outline-offset: 3px; }
.account-button, .auth-button, .main-nav a { min-height: 44px; display: inline-flex; align-items: center; gap: 8px; }
.main-nav a { border-bottom: 2px solid transparent; }
.main-nav a:hover { border-bottom-color: var(--color-primary); }
@media (min-width: 801px) and (max-width: 1100px) { .utility-bar { gap: 16px; padding: 0 24px; } .brand { letter-spacing: .06em; } }

@media (max-width: 800px) {
  .utility-bar { grid-template-columns: minmax(0, 1fr) auto; gap: 16px; padding: 20px; }
  .brand { font-size: 11px; letter-spacing: .08em; }
  .account-actions { grid-column: 2; grid-row: 1; justify-self: end; }
  .search-form { grid-column: 1 / -1; grid-row: 2; }
  .auth-button { padding: 0 4px; border: 0; }
  .account-button { font-size: 11px; }
  .account-button span { display: none; }
  .main-nav { gap: 20px; padding: 0 16px; }
}
</style>
