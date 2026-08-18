<template>
  <main class="admin-login-page">
    <section class="admin-identity" aria-label="Polar Bear Shop 관리자 시스템 소개">
      <div class="grid-overlay"></div>
      <router-link class="admin-brand" :to="{ name: 'main' }">
        <span class="brand-mark" aria-hidden="true">P</span>
        <span>POLAR BEAR SHOP</span>
      </router-link>

      <div class="identity-copy">
        <p class="eyebrow">OPERATIONS CONSOLE</p>
        <h1>차분하고 정확한<br>운영의 시작.</h1>
        <p>회원과 문의, 상점 운영을 안전하게 관리하는 전용 공간입니다.</p>
      </div>

      <div class="security-status">
        <span class="status-dot" aria-hidden="true"></span>
        <div>
          <strong>SECURE ADMIN ACCESS</strong>
          <p>승인된 관리자 계정만 접근할 수 있습니다.</p>
        </div>
      </div>
    </section>

    <section class="admin-form-panel" aria-labelledby="admin-login-title">
      <div class="admin-login-card">
        <div class="access-label">
          <span>ADMINISTRATOR</span>
          <span>01</span>
        </div>
        <h2 id="admin-login-title">관리자 로그인</h2>
        <p class="login-description">관리자 계정으로 운영 콘솔에 접속하세요.</p>

        <form @submit.prevent="login">
          <label for="admin-id">관리자 아이디</label>
          <input
            id="admin-id"
            ref="adminId"
            v-model.trim="adminId"
            type="text"
            autocomplete="username"
            placeholder="관리자 아이디"
            :disabled="isSubmitting"
          >

          <div class="password-label">
            <label for="admin-password">비밀번호</label>
            <span>ENCRYPTED</span>
          </div>
          <input
            id="admin-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="비밀번호"
            :disabled="isSubmitting"
          >

          <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>

          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? '인증 확인 중...' : '운영 콘솔 접속' }}
          </button>
        </form>

        <router-link class="back-link" :to="{ name: 'main' }">← 상점 메인으로 돌아가기</router-link>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'AdminLoginView',
  data () {
    return {
      adminId: '',
      password: '',
      isSubmitting: false,
      errorMessage: ''
    }
  },
  mounted () {
    this.$refs.adminId.focus()
  },
  methods: {
    login () {
      this.errorMessage = ''

      if (!this.adminId || !this.password) {
        this.errorMessage = '관리자 아이디와 비밀번호를 모두 입력해 주세요.'
        return
      }

      this.isSubmitting = true
      this.$store.dispatch('admin/login', {
        userId: this.adminId,
        userPwd: this.password
      }).then(() => {
        this.$router.replace({ name: 'adminDashboard' })
      }).catch(error => {
        this.errorMessage = this.getErrorMessage(error)
      }).finally(() => {
        this.isSubmitting = false
      })
    },
    getErrorMessage (error) {
      const responseData = error && error.response && error.response.data

      if (responseData && responseData.ERROR_MSG) {
        return responseData.ERROR_MSG
      }

      return '관리자 로그인에 실패했습니다. 입력 정보를 확인해 주세요.'
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-login-page {
  --navy: #102a31;
  --deep: #0a1d23;
  --mint: #9fc5be;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(430px, 0.92fr);
  background: #f3f7f6;
  color: var(--navy);
  text-align: left;
}

.admin-identity {
  position: relative;
  min-height: 100vh;
  padding: 52px 64px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background: linear-gradient(145deg, #163940, var(--deep));
  color: #fff;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.16;
  background-image: linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: linear-gradient(to bottom right, #000, transparent 80%);
}

.admin-brand,
.identity-copy,
.security-status {
  position: relative;
  z-index: 1;
}

.admin-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-decoration: none;
}

.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 50%;
  font-family: Georgia, serif;
  font-size: 20px;
  letter-spacing: 0;
}

.identity-copy {
  max-width: 600px;
}

.eyebrow {
  margin: 0 0 22px;
  color: var(--mint);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.26em;
}

.identity-copy h1 {
  margin: 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: clamp(50px, 5.2vw, 78px);
  font-weight: 400;
  line-height: 1.14;
  letter-spacing: -0.055em;
}

.identity-copy > p:last-child {
  max-width: 470px;
  margin: 28px 0 0;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
}

.security-status {
  display: flex;
  align-items: center;
  gap: 14px;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #8fd3c5;
  box-shadow: 0 0 0 6px rgba(143, 211, 197, 0.12);
}

.security-status strong {
  font-size: 10px;
  letter-spacing: 0.16em;
}

.security-status p {
  margin: 5px 0 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.admin-form-panel {
  min-height: 100vh;
  padding: 48px;
  box-sizing: border-box;
  display: grid;
  place-items: center;
}

.admin-login-card {
  width: min(100%, 430px);
}

.access-label {
  display: flex;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid #cddbd8;
  color: #63827d;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.admin-login-card h2 {
  margin: 42px 0 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 40px;
  font-weight: 400;
  letter-spacing: -0.045em;
}

.login-description {
  margin: 14px 0 34px;
  color: #6f8083;
  font-size: 14px;
}

form {
  display: flex;
  flex-direction: column;
}

form label {
  margin-bottom: 9px;
  font-size: 12px;
  font-weight: 800;
}

.password-label {
  margin-top: 21px;
  display: flex;
  justify-content: space-between;
}

.password-label span {
  color: #849895;
  font-size: 9px;
  letter-spacing: 0.14em;
}

input {
  height: 54px;
  padding: 0 16px;
  border: 1px solid #c8d6d3;
  border-radius: 3px;
  outline: 0;
  background: rgba(255, 255, 255, 0.86);
  color: var(--navy);
  font-size: 14px;
}

input:focus {
  border-color: #547d77;
  box-shadow: 0 0 0 3px rgba(84, 125, 119, 0.12);
}

form button {
  height: 56px;
  margin-top: 28px;
  border: 0;
  border-radius: 3px;
  background: var(--navy);
  color: #fff;
  font-weight: 800;
  letter-spacing: 0.05em;
  cursor: pointer;
}

form button:disabled,
input:disabled {
  cursor: wait;
  opacity: 0.65;
}

.error-message {
  margin: 14px 0 -8px;
  color: #a84242;
  font-size: 12px;
}

.back-link {
  display: inline-block;
  margin-top: 28px;
  color: #607975;
  font-size: 12px;
  text-decoration: none;
}

@media (max-width: 900px) {
  .admin-login-page {
    grid-template-columns: 1fr;
  }

  .admin-identity {
    min-height: 390px;
    padding: 36px 28px;
  }

  .identity-copy h1 {
    font-size: 44px;
  }

  .admin-form-panel {
    min-height: auto;
    padding: 64px 28px;
  }
}
</style>
