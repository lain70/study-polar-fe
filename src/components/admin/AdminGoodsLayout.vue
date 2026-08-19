<template>
  <div class="admin-layout">
    <aside>
      <router-link class="brand" :to="{ name: 'adminDashboard' }"><span>P</span> POLAR ADMIN</router-link>
      <nav aria-label="관리자 메뉴">
        <router-link :to="{ name: 'adminDashboard' }">대시보드</router-link>
        <router-link class="active" :to="{ name: 'adminGoodsList' }">상품 관리</router-link>
        <a href="#">회원 관리</a>
        <a href="#">문의 관리</a>
      </nav>
      <router-link :to="{ name: 'main' }">상점으로 이동 ↗</router-link>
    </aside>
    <main>
      <header>
        <div><p>GOODS MANAGEMENT</p><h1>{{ title }}</h1></div>
        <button type="button" :disabled="isLoggingOut" @click="logout">로그아웃</button>
      </header>
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminGoodsLayout',
  props: { title: { type: String, required: true } },
  data: () => ({ isLoggingOut: false }),
  methods: {
    logout () {
      this.isLoggingOut = true
      this.$store.dispatch('admin/logout').finally(() => {
        this.$router.replace({ name: 'adminLogin' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-layout { min-height: 100vh; display: grid; grid-template-columns: 250px minmax(0, 1fr); background: #f2f6f5; color: #143139; text-align: left; }
aside { min-height: 100vh; padding: 34px 28px; box-sizing: border-box; display: flex; flex-direction: column; background: #102a31; }
.brand { display: flex; align-items: center; gap: 10px; color: #fff; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-decoration: none; }
.brand span { width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid #77928e; border-radius: 50%; font-family: Georgia, serif; }
nav { margin-top: 72px; display: flex; flex-direction: column; gap: 8px; }
nav a { padding: 14px 16px; border-left: 2px solid transparent; color: #9eb1ae; font-size: 13px; text-decoration: none; }
nav a.active { border-color: #9fc5be; background: rgba(255,255,255,.06); color: #fff; }
aside > a:last-child { margin-top: auto; color: #9fc5be; font-size: 11px; text-decoration: none; }
main { min-width: 0; padding: 42px 48px 64px; }
header { display: flex; align-items: center; justify-content: space-between; }
header p { margin: 0 0 8px; color: #78908c; font-size: 10px; font-weight: 800; letter-spacing: .16em; }
header h1 { margin: 0; font-family: Georgia, 'Noto Serif KR', serif; font-size: 34px; font-weight: 400; }
header button { padding: 9px 14px; border: 1px solid #c9d6d3; background: #fff; color: #526c68; cursor: pointer; }
@media (max-width: 800px) { .admin-layout { grid-template-columns: 1fr; } aside { min-height: auto; } nav { margin-top: 28px; } main { padding: 30px 20px; } }
</style>
