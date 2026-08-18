<template>
  <div class="admin-dashboard">
    <aside>
      <div class="brand"><span>P</span> POLAR ADMIN</div>
      <nav aria-label="관리자 메뉴">
        <a class="active" href="#overview">대시보드</a>
        <router-link :to="{ name: 'adminProductList' }">상품 관리</router-link>
        <a href="#members">회원 관리</a>
        <a href="#inquiries">문의 관리</a>
        <a href="#operations">운영 설정</a>
      </nav>
      <router-link :to="{ name: 'main' }">상점으로 이동 ↗</router-link>
    </aside>

    <main>
      <header>
        <div>
          <p>OPERATIONS / OVERVIEW</p>
          <h1>관리자 대시보드</h1>
        </div>
        <div class="admin-profile">
          <span>{{ adminInitial }}</span>
          <div>
            <strong>{{ adminName || '관리자' }}</strong>
            <p>{{ adminDepartment || '운영 부서' }} · {{ adminPosition || '관리자' }}</p>
          </div>
          <button type="button" :disabled="isLoggingOut" @click="logout">로그아웃</button>
        </div>
      </header>

      <section id="overview" class="welcome-panel">
        <div>
          <p>WELCOME BACK</p>
          <h2>오늘의 상점 운영 현황을<br>한눈에 확인하세요.</h2>
        </div>
        <span>{{ currentDate }}</span>
      </section>

      <section class="summary-grid" aria-label="운영 요약">
        <article v-for="item in summaryItems" :key="item.label">
          <p>{{ item.label }}</p>
          <strong>{{ item.value }}</strong>
          <span>{{ item.description }}</span>
        </article>
      </section>

      <section class="empty-panel">
        <p>ADMIN WORKSPACE</p>
        <h2>관리 기능을 준비하고 있습니다.</h2>
        <span>회원, 문의, 상품 관리 기능이 이 공간에 순차적으로 추가됩니다.</span>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboardView',
  data () {
    return {
      isLoggingOut: false,
      summaryItems: [
        { label: 'MEMBERS', value: '—', description: '전체 회원' },
        { label: 'INQUIRIES', value: '—', description: '미처리 문의' },
        { label: 'SYSTEM', value: 'NORMAL', description: '서비스 상태' }
      ]
    }
  },
  computed: {
    adminName () {
      return this.$store.state.admin.adminName || localStorage.getItem('adminName')
    },
    adminDepartment () {
      return this.$store.state.admin.adminDepartment || localStorage.getItem('adminDepartment')
    },
    adminPosition () {
      return this.$store.state.admin.adminPosition || localStorage.getItem('adminPosition')
    },
    adminInitial () {
      return this.adminName ? this.adminName.charAt(0) : 'A'
    },
    currentDate () {
      return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long' }).format(new Date())
    }
  },
  methods: {
    logout () {
      this.isLoggingOut = true
      this.$store.dispatch('admin/logout').finally(() => {
        this.isLoggingOut = false
        this.$router.replace({ name: 'adminLogin' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-dashboard {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  background: #f2f6f5;
  color: #143139;
  text-align: left;
}

aside {
  min-height: 100vh;
  padding: 34px 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #102a31;
  color: #fff;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.brand span {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid #77928e;
  border-radius: 50%;
  font-family: Georgia, serif;
}

nav {
  margin-top: 72px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

nav a {
  padding: 14px 16px;
  border-left: 2px solid transparent;
  color: #9eb1ae;
  font-size: 13px;
  text-decoration: none;
}

nav a.active {
  border-color: #9fc5be;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

aside > a {
  margin-top: auto;
  color: #9fc5be;
  font-size: 11px;
  text-decoration: none;
}

main {
  padding: 42px 48px 64px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header p,
.welcome-panel p,
.empty-panel > p {
  margin: 0 0 8px;
  color: #78908c;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

header h1 {
  margin: 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 34px;
  font-weight: 400;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-profile > span {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #d7e5e2;
  font-weight: 800;
}

.admin-profile strong {
  font-size: 12px;
}

.admin-profile p {
  margin: 4px 0 0;
  letter-spacing: 0;
  font-size: 10px;
}

.admin-profile button {
  margin-left: 12px;
  padding: 8px 12px;
  border: 1px solid #c9d6d3;
  background: #fff;
  color: #526c68;
  font-size: 10px;
  cursor: pointer;
}

.welcome-panel {
  min-height: 220px;
  margin-top: 48px;
  padding: 42px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(125deg, #1b4147, #102a31);
  color: #fff;
}

.welcome-panel h2 {
  margin: 18px 0 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 34px;
  font-weight: 400;
  line-height: 1.35;
}

.welcome-panel > span {
  color: #9fc5be;
  font-size: 11px;
}

.summary-grid {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.summary-grid article {
  padding: 26px;
  border: 1px solid #dae4e2;
  background: #fff;
}

.summary-grid p {
  margin: 0;
  color: #839591;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.summary-grid strong {
  margin: 18px 0 8px;
  display: block;
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 400;
}

.summary-grid span,
.empty-panel span {
  color: #7b8d89;
  font-size: 11px;
}

.empty-panel {
  margin-top: 22px;
  padding: 34px;
  border: 1px dashed #c3d2cf;
  background: rgba(255, 255, 255, 0.45);
}

.empty-panel h2 {
  margin: 10px 0;
  font-size: 17px;
}

@media (max-width: 900px) {
  .admin-dashboard {
    grid-template-columns: 1fr;
  }

  aside {
    min-height: auto;
  }

  nav {
    margin-top: 30px;
    flex-direction: row;
    overflow-x: auto;
  }

  aside > a {
    margin-top: 26px;
  }

  main {
    padding: 32px 22px;
  }

  header,
  .welcome-panel {
    gap: 24px;
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
