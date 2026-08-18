<template>
  <main class="signup-page">
    <section class="signup-card" aria-labelledby="signup-title">
      <router-link class="brand" :to="{ name: 'main' }">
        <span class="brand-mark" aria-hidden="true">P</span>
        <span>POLAR BEAR SHOP</span>
      </router-link>

      <p class="signup-kicker">CREATE ACCOUNT</p>
      <h1 id="signup-title">회원가입</h1>
      <p class="signup-description">
        Polar Bear Shop 상담 계정을 만들어 보세요.
      </p>

      <form class="signup-form" @submit.prevent="signup">
        <label for="signup-id">아이디</label>
        <input
          id="signup-id"
          ref="userId"
          v-model.trim="userId"
          type="text"
          maxlength="30"
          autocomplete="username"
          placeholder="아이디를 입력해 주세요"
          :disabled="isSubmitting || isCompleted"
        >

        <label for="signup-name">이름</label>
        <input
          id="signup-name"
          v-model.trim="name"
          type="text"
          autocomplete="name"
          placeholder="이름을 입력해 주세요"
          :disabled="isSubmitting || isCompleted"
        >

        <label for="signup-phone">전화번호 <span>(선택)</span></label>
        <input
          id="signup-phone"
          v-model.trim="phone"
          type="tel"
          autocomplete="tel"
          placeholder="전화번호를 입력해 주세요"
          :disabled="isSubmitting || isCompleted"
        >

        <label for="signup-password">비밀번호</label>
        <input
          id="signup-password"
          v-model="password"
          type="password"
          autocomplete="new-password"
          placeholder="비밀번호를 입력해 주세요"
          :disabled="isSubmitting || isCompleted"
        >

        <label for="signup-password-confirm">비밀번호 확인</label>
        <input
          id="signup-password-confirm"
          v-model="passwordConfirm"
          type="password"
          autocomplete="new-password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          :disabled="isSubmitting || isCompleted"
        >

        <p v-if="errorMessage" class="message error-message" role="alert">
          {{ errorMessage }}
        </p>
        <p v-if="successMessage" class="message success-message" role="status">
          {{ successMessage }}
        </p>

        <button type="submit" :disabled="isSubmitting || isCompleted">
          {{ isSubmitting ? '가입 중...' : '회원가입' }}
        </button>
      </form>

      <p class="login-link">
        이미 계정이 있으신가요?
        <router-link :to="{ name: 'userLogin' }">로그인</router-link>
      </p>
    </section>
  </main>
</template>

<script>
import { registerUser } from '@/api/login.js'

export default {
  name: 'UserJoin',
  data () {
    return {
      userId: '',
      name: '',
      phone: '',
      password: '',
      passwordConfirm: '',
      isSubmitting: false,
      isCompleted: false,
      errorMessage: '',
      successMessage: ''
    }
  },
  mounted () {
    this.$refs.userId.focus()
  },
  methods: {
    signup () {
      this.errorMessage = ''
      this.successMessage = ''

      if (!this.userId || !this.name || !this.password || !this.passwordConfirm) {
        this.errorMessage = '아이디, 이름, 비밀번호를 모두 입력해 주세요.'
        return
      }

      if (this.password !== this.passwordConfirm) {
        this.errorMessage = '비밀번호가 일치하지 않습니다.'
        return
      }

      this.isSubmitting = true
      registerUser({
        userId: this.userId,
        userName: this.name,
        userPhone: this.phone,
        userPwd: this.password
      })
        .then(() => {
          this.isCompleted = true
          this.successMessage = '회원가입이 완료되었습니다. 로그인해 주세요.'
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

      return '회원가입에 실패했습니다. 입력 정보를 확인해 주세요.'
    }
  }
}
</script>

<style lang="scss" scoped>
.signup-page {
  --ink: #18343a;
  --muted: #667b80;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 56px 24px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 12% 10%, rgba(169, 203, 199, 0.38), transparent 28%),
    radial-gradient(circle at 90% 90%, rgba(85, 113, 118, 0.18), transparent 30%),
    #f7faf9;
  color: var(--ink);
}

.signup-card {
  width: min(100%, 520px);
  box-sizing: border-box;
  padding: 44px 48px;
  border: 1px solid rgba(204, 217, 215, 0.8);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 70px rgba(24, 52, 58, 0.1);
  text-align: left;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-decoration: none;
}

.brand-mark {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid #9ab2ae;
  border-radius: 50%;
  font-family: Georgia, serif;
  font-size: 18px;
  letter-spacing: 0;
}

.signup-kicker {
  margin: 42px 0 12px;
  color: #6c918c;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
}

.signup-card h1 {
  margin: 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 38px;
  font-weight: 400;
  letter-spacing: -0.045em;
}

.signup-description {
  margin: 14px 0 32px;
  color: var(--muted);
  font-size: 14px;
}

.signup-form {
  display: flex;
  flex-direction: column;
}

.signup-form label {
  margin: 18px 0 8px;
  font-size: 13px;
  font-weight: 700;
}

.signup-form label:first-child {
  margin-top: 0;
}

.signup-form label span {
  color: #8b9b9e;
  font-size: 11px;
  font-weight: 400;
}

.signup-form input {
  width: 100%;
  height: 52px;
  box-sizing: border-box;
  padding: 0 16px;
  border: 1px solid #ccd9d7;
  border-radius: 4px;
  outline: none;
  background: #fff;
  color: var(--ink);
  font-size: 15px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.signup-form input:focus {
  border-color: #5e8e87;
  box-shadow: 0 0 0 3px rgba(94, 142, 135, 0.12);
}

.signup-form input::placeholder {
  color: #9baaaa;
}

.signup-form button {
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

.signup-form button:hover:not(:disabled) {
  background: #28535a;
  transform: translateY(-1px);
}

.signup-form button:disabled,
.signup-form input:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}

.message {
  margin: 16px 0 -8px;
  font-size: 12px;
  line-height: 1.5;
}

.error-message {
  color: #b14949;
}

.success-message {
  color: #397068;
}

.login-link {
  margin: 24px 0 0;
  color: var(--muted);
  font-size: 13px;
  text-align: center;
}

.login-link a {
  margin-left: 6px;
  color: var(--ink);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 560px) {
  .signup-page {
    padding: 0;
    place-items: stretch;
  }

  .signup-card {
    width: 100%;
    min-height: 100vh;
    padding: 36px 22px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .signup-kicker {
    margin-top: 36px;
  }

  .signup-card h1 {
    font-size: 32px;
  }
}
</style>
