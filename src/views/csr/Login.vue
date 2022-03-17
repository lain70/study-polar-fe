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
import store from '@/store'

export default {
  data () {
    return {
		checkSaveId: false,
		tempCsrId: '',
		tempCsrPwd: ''
    }
  },
  filters: {
  },
  computed: {
  },
  watch: {

  },
  created (){

  },
  mounted () {
  },
  destroyed () {
  },
  beforeDestroy () {
  },
  methods: {
	  fn_csrLogin(){

		  let params ={
			  csrId: this.tempCsrId,
			  csrPwd: this.tempCsrPwd,
			  type:'CSR'
		  }

		  store.dispatch('CsrLoginProc', params).then(response => {
			  console.log(response)
			  if(response){
				  this.$router.push({
					name:"csrQnaList",
					query:{
						selPageNum: 1
					}
				});
			  }
		  })
	  }
  }
}
</script>
<style lang="scss" src="@/assets/scss/common.scss"></style>