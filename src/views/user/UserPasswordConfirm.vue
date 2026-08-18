<template>
  <main class="profile-page">
    <section class="profile-card" aria-labelledby="confirm-title">
      <router-link class="brand" :to="{ name: 'main' }">POLAR BEAR SHOP</router-link>
      <p class="kicker">ACCOUNT SECURITY</p>
      <h1 id="confirm-title">비밀번호 재확인</h1>
      <p class="description">회원정보를 안전하게 보호하기 위해 비밀번호를 한 번 더 입력해 주세요.</p>

      <form @submit.prevent="confirmPassword">
        <label for="current-password">현재 비밀번호</label>
        <input
          id="current-password"
          ref="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          :disabled="isSubmitting"
        >
        <p v-if="errorMessage" class="message error" role="alert">{{ errorMessage }}</p>
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? '확인 중...' : '확인' }}
        </button>
      </form>
      <router-link class="cancel-link" :to="{ name: 'main' }">취소</router-link>
    </section>
  </main>
</template>

<script>
import { confirmUserPassword } from '@/api/user.js'
import { clearUserProfileSession, setUserProfileSession } from '@/utils/userProfileSession.js'

export default {
  name: 'UserPasswordConfirm',
  data () {
    return {
      password: '',
      isSubmitting: false,
      errorMessage: ''
    }
  },
  mounted () {
    clearUserProfileSession()
    this.$refs.password.focus()
  },
  methods: {
    confirmPassword () {
      this.errorMessage = ''
      if (!this.password) {
        this.errorMessage = '비밀번호를 입력해 주세요.'
        return
      }

      this.isSubmitting = true
      confirmUserPassword(this.password)
        .then(response => {
          setUserProfileSession(this.password, response.data)
          this.password = ''
          this.$router.push({ name: 'userInfoEdit' })
        })
        .catch(error => {
          this.errorMessage = this.getErrorMessage(error)
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    getErrorMessage (error) {
      const data = error && error.response && error.response.data
      return (data && data.ERROR_MSG) || '비밀번호 확인에 실패했습니다.'
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-page { min-height: 100vh; padding: 56px 24px; box-sizing: border-box; display: grid; place-items: center; background: #f7faf9; color: #18343a; }
.profile-card { width: min(100%, 520px); padding: 44px 48px; box-sizing: border-box; border: 1px solid #ccd9d7; border-radius: 8px; background: #fff; box-shadow: 0 24px 70px rgba(24, 52, 58, 0.1); }
.brand { color: #18343a; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-decoration: none; }
.kicker { margin: 42px 0 12px; color: #6c918c; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; }
h1 { margin: 0; font-family: Georgia, 'Noto Serif KR', serif; font-size: 38px; font-weight: 400; }
.description { margin: 14px 0 32px; color: #667b80; font-size: 14px; line-height: 1.7; }
form { display: flex; flex-direction: column; }
label { margin-bottom: 8px; font-size: 13px; font-weight: 700; }
input { height: 52px; padding: 0 16px; border: 1px solid #ccd9d7; border-radius: 4px; outline: none; font-size: 15px; }
input:focus { border-color: #5e8e87; box-shadow: 0 0 0 3px rgba(94, 142, 135, 0.12); }
button { height: 56px; margin-top: 28px; border: 0; border-radius: 4px; background: #18343a; color: #fff; font-weight: 700; cursor: pointer; }
button:disabled { cursor: wait; opacity: 0.68; }
.message { margin: 14px 0 -8px; font-size: 12px; }
.error { color: #b14949; }
.cancel-link { display: block; margin-top: 20px; color: #667b80; font-size: 13px; text-align: center; }
@media (max-width: 600px) { .profile-card { padding: 36px 24px; } h1 { font-size: 32px; } }
</style>
