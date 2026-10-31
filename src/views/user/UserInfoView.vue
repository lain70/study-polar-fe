<template>
  <div>
    <site-header />
    <main class="info-page">
      <nav class="breadcrumb" aria-label="현재 위치"><router-link :to="{ name: 'myPage' }">마이페이지</router-link><span aria-hidden="true">/</span><span aria-current="page">내 정보 보기</span></nav>
      <header class="info-heading"><p class="eyebrow">MY PROFILE</p><h1>내 정보 보기</h1><p>가입하신 회원정보를 확인하세요.</p></header>
      <section class="info-panel" aria-labelledby="profile-title" :aria-busy="isLoading">
        <div class="panel-heading"><span class="profile-icon"><account-icon name="user" /></span><h2 id="profile-title">회원 기본정보</h2></div>
        <p v-if="isLoading" role="status">회원정보를 불러오는 중입니다.</p>
        <div v-else-if="errorMessage" class="error-panel"><p role="alert">{{ errorMessage }}</p><button type="button" @click="loadProfile">다시 시도</button></div>
        <template v-else-if="profile">
          <dl>
            <div><dt>아이디</dt><dd>{{ profile.userId }}</dd></div>
            <div><dt>이름</dt><dd>{{ profile.userName }}</dd></div>
            <div><dt>전화번호</dt><dd>{{ profile.userPhone || '등록된 전화번호가 없습니다.' }}</dd></div>
          </dl>
          <div class="edit-section">
            <p>정보 수정 전 비밀번호를 한 번 더 확인합니다.</p>
            <router-link class="edit-button" :to="{ name: 'userPasswordConfirm' }">정보 수정하기<account-icon name="arrow" /></router-link>
          </div>
        </template>
      </section>
      <router-link class="back-link" :to="{ name: 'myPage' }">마이페이지로 돌아가기</router-link>
    </main>
    <site-footer />
  </div>
</template>

<script>
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import AccountIcon from '@/components/AccountIcon.vue'
import { getUserInfo } from '@/api/user'

export default {
  name: 'UserInfoView',
  components: { SiteHeader, SiteFooter, AccountIcon },
  data () { return { profile: null, isLoading: false, errorMessage: '' } },
  created () { this.loadProfile() },
  mounted () { window.addEventListener('storage', this.handleSessionChange) },
  beforeUnmount () { window.removeEventListener('storage', this.handleSessionChange) },
  methods: {
    handleSessionChange (event) {
      if (event.key === 'accessToken' || event.key === null) {
        this.profile = null
        this.$router.replace({ name: 'userLogin', query: { redirect: 'userInfoView' } })
      }
    },
    async loadProfile () {
      const token = localStorage.getItem('accessToken')
      this.profile = null
      this.errorMessage = ''
      this.isLoading = true
      try {
        const { data } = await getUserInfo()
        if (token === localStorage.getItem('accessToken')) this.profile = data
      } catch (error) {
        this.errorMessage = (error.response && error.response.data && error.response.data.ERROR_MSG) || '회원정보를 불러오지 못했습니다. 다시 시도해 주세요.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info-page { max-width: 820px; margin: 0 auto; padding: 30px 28px 60px; text-align: left; color: var(--color-foreground); }
.breadcrumb { display: flex; gap: 12px; font-size: 13px; color: var(--color-muted-foreground); }
.breadcrumb a, .back-link { color: var(--color-muted-foreground); text-underline-offset: 4px; }
.info-heading { padding: 42px 0 28px; }
.eyebrow { margin: 0 0 12px; color: var(--color-primary); font-size: 12px; font-weight: 800; letter-spacing: .18em; }
h1 { margin: 0; font-size: clamp(30px, 4vw, 38px); letter-spacing: -.04em; }
.info-heading > p:last-child { margin: 12px 0 0; color: var(--color-muted-foreground); }
.info-panel { padding: 32px; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-card); }
.panel-heading { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.profile-icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: var(--color-background); color: var(--color-primary); }
.profile-icon svg { width: 22px; height: 22px; }
h2 { margin: 0; font-size: 18px; }
dl { margin: 0; }
dl > div { display: grid; grid-template-columns: 130px minmax(0, 1fr); padding: 22px 0; border-top: 1px solid var(--color-border); gap: 16px; }
dt { color: var(--color-muted-foreground); }
dd { margin: 0; font-weight: 600; overflow-wrap: anywhere; }
.edit-section { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px; padding-top: 26px; border-top: 1px solid var(--color-border); }
.edit-section p { margin: 0; font-size: 13px; color: var(--color-muted-foreground); }
.edit-button { display: inline-flex; align-items: center; justify-content: center; gap: 18px; min-height: 48px; padding: 12px 22px; background: var(--color-primary); color: var(--color-on-primary); border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 700; }
.edit-button svg { width: 16px; height: 16px; }
.edit-button:hover { background: var(--color-foreground); }
.back-link { display: inline-flex; align-items: center; min-height: 44px; margin-top: 20px; font-size: 14px; }
.error-panel p { color: var(--color-destructive); }
.error-panel button { min-height: 44px; padding: 8px 18px; border: 1px solid var(--color-border); border-radius: 6px; background: var(--color-background); color: var(--color-foreground); }
@media (max-width: 600px) {
  .info-page { padding: 24px 20px 40px; }
  .info-heading { padding-top: 30px; }
  .info-panel { padding: 24px 20px; }
  dl > div { grid-template-columns: 78px minmax(0, 1fr); gap: 12px; font-size: 14px; }
  .edit-section { align-items: stretch; flex-direction: column; }
}
</style>
