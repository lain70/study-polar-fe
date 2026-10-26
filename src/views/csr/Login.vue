<template>
  <div class="csrlogin">

    <div class="csrloginwrap">
      <h1>폴라베어샵 상담원 페이지</h1>
      <div class="inpbox">
        <label class="loginlabel">
          <input type="text" class="logininput" size="20" placeholder="상담원 ID를 입력해 주세요." ref="userId" v-model="tempCsrId" @keypress.enter="verify">
        </label>
        <label class="loginlabel">
          <input type="password" size="20" class="logininput" placeholder="비밀번호를 입력해 주세요." ref="password" v-model="tempCsrPwd" @keypress.enter="verify">
        </label>
      </div>
      <div class="inpbox">
        <label class="uxcheck">
          <input type="checkbox" aria-hidden="true" v-model="checkSaveId">
          <span>상담원 ID 저장</span>
        </label>
      </div>
      <div class="btnarea">
        <button type="button" class="btn-custom" @click="fn_csrLogin">로그인</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getRequestErrorMessage } from '@/utils/requestError'
import store from '@/store'

export default {
  name: 'CsrLoginView',
  data () {
    return {
      checkSaveId: false,
      tempCsrId: '',
      tempCsrPwd: ''
    }
  },
  computed: {
  },
  watch: {

  },
  created () {

  },
  mounted () {
  },
  unmounted () {
  },
  beforeUnmount () {
  },
  methods: {
    fn_csrLogin () {
      const params = {
        csrId: this.tempCsrId,
        csrPwd: this.tempCsrPwd,
        type: 'CSR'
      }

      store.dispatch('CsrLoginProc', params).then(response => {
        console.log(response)
        if (response) {
          this.$router.push({
            name: 'csrQnaList',
            query: {
              selPageNum: 1
            }
          })
        }
      }).catch(error => { alert(getRequestErrorMessage(error)) })
    }
  }
}
</script>
<style lang="scss" src="@/assets/scss/common.scss"></style>
