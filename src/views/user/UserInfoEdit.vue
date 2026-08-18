<template>
  <main class="profile-page">
    <section class="profile-card" aria-labelledby="edit-title">
      <router-link class="brand" :to="{ name: 'main' }">POLAR BEAR SHOP</router-link>
      <p class="kicker">MY ACCOUNT</p>
      <h1 id="edit-title">회원정보 수정</h1>

      <form @submit.prevent="save">
        <span class="field-label">아이디</span>
        <span class="user-id">{{ profile.userId }}</span>

        <label for="user-name">이름</label>
        <input id="user-name" v-model.trim="profile.userName" type="text" autocomplete="name" :disabled="isSubmitting">

        <label for="user-phone">전화번호 <span>(선택)</span></label>
        <input id="user-phone" v-model.trim="profile.userPhone" type="tel" autocomplete="tel" :disabled="isSubmitting">

        <label for="new-password">새 비밀번호 <span>(변경할 때만 입력)</span></label>
        <input id="new-password" v-model="newPassword" type="password" autocomplete="new-password" :disabled="isSubmitting">

        <label for="new-password-confirm">새 비밀번호 확인</label>
        <input id="new-password-confirm" v-model="newPasswordConfirm" type="password" autocomplete="new-password" :disabled="isSubmitting">

        <p v-if="message" class="message" :class="{ error: isError }" :role="isError ? 'alert' : 'status'">{{ message }}</p>
        <button type="submit" :disabled="isSubmitting || isCompleted">
          {{ isSubmitting ? '수정 중...' : '수정하기' }}
        </button>
      </form>
      <router-link class="cancel-link" :to="{ name: 'main' }">메인으로 돌아가기</router-link>
    </section>
  </main>
</template>

<script>
import { updateUserInfo } from '@/api/user.js'
import { clearUserProfileSession, getUserProfileSession } from '@/utils/userProfileSession.js'

export default {
  name: 'UserInfoEdit',
  data () {
    return {
      currentPassword: '',
      profile: { userId: '', userName: '', userPhone: '' },
      newPassword: '',
      newPasswordConfirm: '',
      isSubmitting: false,
      isCompleted: false,
      isError: false,
      message: ''
    }
  },
  created () {
    const session = getUserProfileSession()
    if (!session) {
      this.$router.replace({ name: 'userPasswordConfirm' })
      return
    }
    this.currentPassword = session.confirmedPassword
    this.profile = { ...session.userProfile }
  },
  beforeDestroy () {
    clearUserProfileSession()
    this.currentPassword = ''
  },
  methods: {
    save () {
      this.message = ''
      this.isError = false
      if (!this.profile.userName) {
        this.showError('이름을 입력해 주세요.')
        return
      }
      if (this.newPassword !== this.newPasswordConfirm) {
        this.showError('새 비밀번호가 일치하지 않습니다.')
        return
      }

      this.isSubmitting = true
      updateUserInfo({
        currentUserPwd: this.currentPassword,
        newUserPwd: this.newPassword,
        userName: this.profile.userName,
        userPhone: this.profile.userPhone
      })
        .then(() => {
          this.isCompleted = true
          this.message = '회원정보가 수정되었습니다.'
          clearUserProfileSession()
          this.currentPassword = ''
        })
        .catch(error => {
          const data = error && error.response && error.response.data
          this.showError((data && data.ERROR_MSG) || '회원정보 수정에 실패했습니다.')
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    showError (message) {
      this.isError = true
      this.message = message
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-page { min-height: 100vh; padding: 56px 24px; box-sizing: border-box; display: grid; place-items: center; background: #f7faf9; color: #18343a; }
.profile-card { width: min(100%, 560px); padding: 44px 48px; box-sizing: border-box; border: 1px solid #ccd9d7; border-radius: 8px; background: #fff; box-shadow: 0 24px 70px rgba(24, 52, 58, 0.1); }
.brand { color: #18343a; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-decoration: none; }
.kicker { margin: 42px 0 12px; color: #6c918c; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; }
h1 { margin: 0 0 32px; font-family: Georgia, 'Noto Serif KR', serif; font-size: 38px; font-weight: 400; }
form { display: flex; flex-direction: column; }
label { margin: 18px 0 8px; font-size: 13px; font-weight: 700; }
label span { color: #8b9b9e; font-size: 11px; font-weight: 400; }
.field-label { margin-bottom: 8px; font-size: 13px; font-weight: 700; }
.user-id { min-height: 52px; padding: 0 16px; box-sizing: border-box; display: flex; align-items: center; border-bottom: 1px solid #ccd9d7; color: #52686c; font-size: 15px; }
input { height: 52px; padding: 0 16px; border: 1px solid #ccd9d7; border-radius: 4px; outline: none; font-size: 15px; }
input:focus { border-color: #5e8e87; box-shadow: 0 0 0 3px rgba(94, 142, 135, 0.12); }
input:disabled { background: #eef3f2; color: #718083; }
button { height: 56px; margin-top: 28px; border: 0; border-radius: 4px; background: #18343a; color: #fff; font-weight: 700; cursor: pointer; }
button:disabled { cursor: not-allowed; opacity: 0.68; }
.message { margin: 16px 0 -8px; color: #397068; font-size: 12px; }
.message.error { color: #b14949; }
.cancel-link { display: block; margin-top: 20px; color: #667b80; font-size: 13px; text-align: center; }
@media (max-width: 600px) { .profile-card { padding: 36px 24px; } h1 { font-size: 32px; } }
</style>
