<template>
  <div>
    <site-header />
    <main class="account-page">
      <nav class="breadcrumb" aria-label="현재 위치"><router-link :to="{ name: 'main' }">홈</router-link><span aria-hidden="true">/</span><span aria-current="page">마이페이지</span></nav>
      <header class="account-heading">
        <div>
          <p class="eyebrow">MY POLAR BEAR</p>
          <h1>마이페이지</h1>
          <p class="description">장바구니부터 내 정보까지,<br class="mobile-break"> 나의 쇼핑을 한곳에서 관리하세요.</p>
        </div>
        <span class="profile-symbol"><account-icon name="user" /></span>
      </header>

      <section class="menu-grid" aria-label="마이페이지 메뉴">
        <router-link class="menu-card" :to="{ name: 'cart' }">
          <span class="card-icon"><account-icon name="cart" /></span>
          <h2>장바구니</h2>
          <p>마음에 담아 둔 상품을 확인하고<br> 수량을 관리하세요.</p>
          <span class="card-action">장바구니 보기<account-icon name="arrow" /></span>
        </router-link>
        <router-link class="menu-card" :to="{ name: 'userInfoView' }">
          <span class="card-icon"><account-icon name="user" /></span>
          <h2>내 정보 보기</h2>
          <p>등록된 회원정보를 확인하고<br> 안전하게 수정하세요.</p>
          <span class="card-action">내 정보 확인<account-icon name="arrow" /></span>
        </router-link>
        <button class="menu-card menu-card--pending" type="button" disabled aria-describedby="orders-notice">
          <span class="card-icon"><account-icon name="orders" /></span>
          <span class="pending-badge">준비 중</span>
          <h2>주문정보</h2>
          <p id="orders-notice">주문 내역을 확인하는 기능은<br> 준비 중입니다.</p>
          <span class="card-action">곧 만나요</span>
        </button>
      </section>
      <aside class="account-help"><p>쇼핑 중 궁금한 점이 있으신가요?</p><router-link to="/csr">고객센터 문의하기 <span aria-hidden="true">→</span></router-link></aside>
    </main>
    <site-footer />
  </div>
</template>

<script>
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import AccountIcon from '@/components/AccountIcon.vue'

export default {
  name: 'MyPageView',
  components: { SiteHeader, SiteFooter, AccountIcon }
}
</script>

<style lang="scss" scoped>
.account-page { max-width: 1120px; margin: 0 auto; padding: 30px 28px 60px; text-align: left; color: var(--color-foreground); }
.breadcrumb { display: flex; gap: 12px; font-size: 13px; color: var(--color-muted-foreground); }
.breadcrumb a { color: inherit; text-underline-offset: 4px; }
.account-heading { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 52px 0 38px; }
.eyebrow { margin: 0 0 12px; color: var(--color-primary); font-size: 12px; font-weight: 800; letter-spacing: .18em; }
h1 { margin: 0; font-size: clamp(30px, 4vw, 42px); letter-spacing: -.04em; line-height: 1.3; }
.description { margin: 16px 0 0; color: var(--color-muted-foreground); line-height: 1.8; }
.profile-symbol { width: 90px; height: 90px; display: grid; place-items: center; border: 1px solid var(--color-border); border-radius: 50%; background: var(--color-card); color: var(--color-primary); }
.profile-symbol svg { width: 36px; height: 36px; }
.menu-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
.menu-card { position: relative; display: flex; align-items: flex-start; flex-direction: column; min-width: 0; padding: 32px 28px 26px; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-card); color: var(--color-foreground); font: inherit; text-align: left; text-decoration: none; }
a.menu-card:hover { border-color: var(--color-primary); box-shadow: 0 8px 24px rgba(24, 52, 58, .06); }
.card-icon { display: grid; place-items: center; width: 52px; height: 52px; margin-bottom: 24px; border-radius: 14px; background: var(--color-background); color: var(--color-primary); }
.card-icon svg { width: 26px; height: 26px; }
h2 { margin: 0 0 10px; font-size: 22px; letter-spacing: -.03em; }
.menu-card p { margin: 0 0 28px; color: var(--color-muted-foreground); font-size: 14px; line-height: 1.8; }
.card-action { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: auto; padding-top: 20px; border-top: 1px solid var(--color-border); font-size: 14px; font-weight: 700; color: var(--color-primary); }
.card-action svg { width: 18px; height: 18px; }
.menu-card--pending:disabled { opacity: 1; cursor: not-allowed; background: var(--color-background); }
.menu-card--pending .card-action { color: var(--color-muted-foreground); }
.pending-badge { position: absolute; top: 32px; right: 24px; padding: 3px 10px; border: 1px solid var(--color-border); border-radius: 20px; font-size: 12px; color: var(--color-muted-foreground); }
.account-help { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-top: 28px; padding: 22px 26px; border: 1px solid var(--color-border); border-radius: var(--radius-card); font-size: 14px; }
.account-help p { margin: 0; color: var(--color-muted-foreground); }
.account-help a { display: inline-flex; align-items: center; min-height: 44px; gap: 18px; color: var(--color-primary); font-weight: 700; text-underline-offset: 4px; }
.mobile-break { display: none; }
@media (max-width: 760px) {
  .account-page { padding: 24px 20px 40px; }
  .account-heading { padding: 34px 0 28px; gap: 12px; }
  .description { font-size: 14px; }
  .profile-symbol { width: 60px; height: 60px; flex-shrink: 0; }
  .profile-symbol svg { width: 28px; height: 28px; }
  .menu-grid { grid-template-columns: 1fr; gap: 16px; }
  .menu-card { padding: 24px; }
  .card-icon { margin-bottom: 18px; }
  .menu-card p { margin-bottom: 20px; }
  .menu-card p br { display: none; }
  .mobile-break { display: initial; }
  .account-help { padding: 18px 24px; }
}
</style>
