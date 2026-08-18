<template>
  <main class="home-page">
    <section class="hero-panel" aria-label="Polar Bear Shop 소개">
      <div class="hero-overlay"></div>
      <div class="brand">
        <span class="brand-mark" aria-hidden="true">P</span>
        <span>POLAR BEAR SHOP</span>
      </div>
      <div class="hero-copy">
        <p class="eyebrow">A WARM SHOP IN THE POLAR</p>
        <h1>차가운 일상에<br>따뜻한 쇼핑을.</h1>
        <p class="description">
          Polar Bear Shop의 새로운 이야기를 만나보세요.
        </p>
      </div>
      <p class="photo-caption">POLAR BEAR SHOP · SEOUL</p>
    </section>

    <section class="login-panel" aria-labelledby="login-title">
      <div class="login-card">
        <p class="login-kicker">MEMBER ACCESS</p>
        <h2 id="login-title">다시 만나 반가워요.</h2>
        <p class="login-description">
          계정 정보를 입력하고 Polar Bear Shop에 로그인하세요.
        </p>

        <form class="login-form" @submit.prevent="login">
          <label for="user-id">아이디</label>
          <input
            id="user-id"
            ref="userId"
            v-model.trim="userId"
            type="text"
            autocomplete="username"
            placeholder="아이디를 입력해 주세요"
            :disabled="isSubmitting"
          >

          <div class="password-label">
            <label for="password">비밀번호</label>
            <span>보안 입력</span>
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="비밀번호를 입력해 주세요"
            :disabled="isSubmitting"
          >

          <p v-if="errorMessage" class="error-message" role="alert">
            {{ errorMessage }}
          </p>

          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? '로그인 중...' : '로그인' }}
          </button>
        </form>

        <p class="signup-link">
          아직 계정이 없으신가요?
          <router-link :to="{ name: 'userJoin' }">회원가입</router-link>
        </p>

        <p class="security-note">
          <span aria-hidden="true">●</span>
          Spring Security로 인증 정보를 확인합니다.
        </p>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'HomeView',
  data () {
    return {
      userId: '',
      password: '',
      isSubmitting: false,
      errorMessage: ''
    }
  },
  mounted () {
    this.$refs.userId.focus()
  },
  methods: {
    login () {
      this.errorMessage = ''

      if (!this.userId || !this.password) {
        this.errorMessage = '아이디와 비밀번호를 모두 입력해 주세요.'
        return
      }

      this.isSubmitting = true
      const loginRequest = {
        userId: this.userId,
        userPwd: this.password
      }

      this.$store.dispatch('UserLoginProc', loginRequest)
        .then(() => {
          this.$router.push({
            name: 'main'
          })
        })
        .catch(error => {
          this.errorMessage = this.getErrorMessage(error)
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    getErrorMessage (error) {
      const responseData = error && error.response && error.response.data

      if (responseData && responseData.ERROR_MSG) {
        return responseData.ERROR_MSG
      }

      if (typeof responseData === 'string') {
        return responseData
      }

      return '로그인에 실패했습니다. 입력 정보를 확인해 주세요.'
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  --ink: #18343a;
  --muted: #667b80;
  --ice: #eaf3f2;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(420px, 0.88fr);
  background: #f7faf9;
  color: var(--ink);
}

.hero-panel {
  position: relative;
  min-height: 100vh;
  padding: 54px 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  color: #fff;
  text-align: left;
  background: #557176 url('../assets/images/bg_login.png') center / cover no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(15, 43, 48, 0.82) 0%, rgba(23, 55, 60, 0.48) 52%, rgba(20, 44, 49, 0.08) 100%);
}

.brand,
.hero-copy,
.photo-caption {
  position: relative;
  z-index: 1;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  font-family: Georgia, serif;
  font-size: 20px;
  letter-spacing: 0;
}

.hero-copy {
  max-width: 590px;
  margin: auto 0;
}

.eyebrow,
.login-kicker {
  margin: 0 0 18px;
  color: #c8ddda;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
}

.hero-copy h1 {
  margin: 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: clamp(52px, 5.5vw, 82px);
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: -0.055em;
}

.description {
  margin: 28px 0 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 16px;
  line-height: 1.8;
}

.photo-caption {
  margin: 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 10px;
  letter-spacing: 0.18em;
}

.login-panel {
  min-height: 100vh;
  padding: 48px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 90% 8%, rgba(169, 203, 199, 0.32), transparent 28%),
    #f7faf9;
}

.login-card {
  width: min(100%, 440px);
  text-align: left;
}

.login-kicker {
  margin-bottom: 14px;
  color: #6c918c;
}

.login-card h2 {
  margin: 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 38px;
  font-weight: 400;
  letter-spacing: -0.045em;
}

.login-description {
  margin: 16px 0 38px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-form label {
  margin-bottom: 9px;
  font-size: 13px;
  font-weight: 700;
}

.password-label {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.password-label label {
  margin-bottom: 9px;
}

.password-label span {
  margin-bottom: 9px;
  color: #8b9b9e;
  font-size: 11px;
}

.login-form input {
  width: 100%;
  height: 54px;
  box-sizing: border-box;
  padding: 0 16px;
  border: 1px solid #ccd9d7;
  border-radius: 4px;
  outline: none;
  background: rgba(255, 255, 255, 0.86);
  color: var(--ink);
  font-size: 15px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.login-form input:focus {
  border-color: #5e8e87;
  box-shadow: 0 0 0 3px rgba(94, 142, 135, 0.12);
}

.login-form input::placeholder {
  color: #9baaaa;
}

.login-form button {
  height: 56px;
  margin-top: 28px;
  border: 0;
  border-radius: 4px;
  background: var(--ink);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.login-form button:hover:not(:disabled) {
  background: #28535a;
  transform: translateY(-1px);
}

.login-form button:disabled,
.login-form input:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}

.error-message {
  margin: 14px 0 -8px;
  color: #b14949;
  font-size: 12px;
  line-height: 1.5;
}

.signup-link {
  margin: 22px 0 0;
  color: var(--muted);
  font-size: 13px;
  text-align: center;
}

.signup-link a {
  margin-left: 6px;
  color: var(--ink);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.security-note {
  margin: 24px 0 0;
  color: #819194;
  font-size: 11px;
  text-align: center;
}

.security-note span {
  margin-right: 6px;
  color: #75a39c;
  font-size: 7px;
}

@media (max-width: 900px) {
  .home-page {
    grid-template-columns: 1fr;
  }

  .hero-panel {
    min-height: 42vh;
    padding: 32px;
  }

  .hero-copy {
    margin: 64px 0;
  }

  .hero-copy h1 {
    font-size: clamp(42px, 10vw, 64px);
  }

  .login-panel {
    min-height: auto;
    padding: 72px 28px;
  }
}

@media (max-width: 520px) {
  .hero-panel {
    min-height: 38vh;
    padding: 24px;
  }

  .description,
  .photo-caption {
    display: none;
  }

  .login-panel {
    padding: 56px 22px;
  }

  .login-card h2 {
    font-size: 32px;
  }
}
</style>
