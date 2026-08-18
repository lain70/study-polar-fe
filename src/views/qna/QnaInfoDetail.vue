<template>
  <div class="inquiry-page">
    <header class="site-header">
      <router-link class="brand" :to="{ name: 'main' }">
        <span class="brand-mark" aria-hidden="true">P</span>
        <span>POLAR BEAR SHOP</span>
      </router-link>
      <nav aria-label="페이지 메뉴">
        <router-link :to="{ name: 'main' }">쇼핑 홈</router-link>
        <router-link to="/csr">문의하기</router-link>
        <button type="button">회원정보 수정</button>
      </nav>
    </header>

    <main>
      <section class="page-hero">
        <p>MEMBER SUPPORT</p>
        <h1>{{ selQnaNo ? '문의 상세' : '새 문의 작성' }}</h1>
        <span>{{ selQnaNo ? '문의 내용과 답변 상태를 확인해 보세요.' : '궁금한 내용을 자세히 남겨주세요.' }}</span>
      </section>

      <section class="form-section">
        <div class="form-heading">
          <div>
            <p>{{ selQnaNo ? 'INQUIRY DETAIL' : 'CONTACT US' }}</p>
            <h2>{{ selQnaNo ? '문의 정보' : '문의 내용 입력' }}</h2>
          </div>
          <span><i></i> 필수 입력 항목</span>
        </div>

        <div v-if="selQnaNo" class="meta-grid">
          <div><span>문의 번호</span><strong>{{ qnaData.qnaNo }}</strong></div>
          <div><span>작성자 ID</span><strong>{{ qnaData.qnaUserId }}</strong></div>
          <div><span>작성일</span><strong>{{ qnaData.regDate || '-' }}</strong></div>
        </div>

        <div class="form-card">
          <label v-if="!selQnaNo" class="field">
            <span>작성자 ID <i></i></span>
            <input v-model="qnaData.qnaUserId" type="text" placeholder="작성자 아이디를 입력해 주세요">
          </label>

          <label class="field">
            <span>문의 제목 <i></i></span>
            <input
              v-model="qnaData.qnaTitle"
              type="text"
              placeholder="문의 제목을 입력해 주세요"
              :readonly="qnaData.answerYn === 'Y'"
            >
          </label>

          <label class="field">
            <span>문의 내용 <i></i></span>
            <textarea
              v-model="qnaData.qnaContents"
              rows="10"
              placeholder="문의 내용을 자세히 입력해 주세요"
              :readonly="qnaData.answerYn === 'Y'"
            ></textarea>
          </label>

          <label v-if="qnaData.answerYn !== 'Y'" class="field">
            <span>문의 비밀번호 <i></i></span>
            <input v-model="qnaData.qnaUserPwd" type="password" placeholder="문의 확인에 사용할 비밀번호를 입력해 주세요">
            <small>문의 수정 시 확인을 위해 사용됩니다.</small>
          </label>
        </div>

        <section v-if="selQnaNo" class="answer-card">
          <div class="answer-heading">
            <div>
              <p>SHOP ANSWER</p>
              <h2>답변 내용</h2>
            </div>
            <span class="status" :class="{ 'status--complete': qnaData.answerYn === 'Y' }">
              {{ qnaData.answerYn === 'Y' ? '답변 완료' : '답변 대기' }}
            </span>
          </div>
          <dl v-if="qnaData.answerYn === 'Y'" class="answer-meta">
            <div><dt>담당 상담원</dt><dd>{{ qnaData.csrName || '-' }}</dd></div>
            <div><dt>답변일</dt><dd>{{ qnaData.replyUpdtDate || '-' }}</dd></div>
          </dl>
          <div class="answer-content">
            {{ qnaData.qreplyContents || '문의 내용을 확인하고 있습니다. 답변이 등록되면 이곳에서 확인할 수 있습니다.' }}
          </div>
        </section>

        <div class="button-area">
          <button type="button" class="secondary-button" @click="fn_goQnaList">목록으로</button>
          <button v-if="selQnaNo" type="button" class="primary-button" @click="fn_updateQna">문의 수정</button>
          <button v-else type="button" class="primary-button" @click="fn_registQna">문의 등록</button>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <strong>POLAR BEAR SHOP</strong>
      <p>회원만을 위한 작은 쇼핑 공간입니다.</p>
      <span>© POLAR BEAR SHOP. ALL RIGHTS RESERVED.</span>
    </footer>
  </div>
</template>

<script>
import { getQnaDetail, registQnaInfo, updateQnaInfo } from '@/api/qna.js'
export default {
  name: 'QnaInfoList',
  props: {

  },
  components: {
  },
  computed: {
    qnaData () {
      const qnaData = this.data
      qnaData.regDate = qnaData.regDate ? qnaData.regDate.replace('T', ' ') : qnaData.regDate
      qnaData.replyUpdtDate = qnaData.replyUpdtDate ? qnaData.replyUpdtDate.replace('T', ' ') : qnaData.replyUpdtDate
      return qnaData
    }
  },
  data () {
    return {
      data: [],
      selQnaNo: '',
      selQnaUserId: '',
      selPageNum: ''
    	}
  },
  created () {
    if (this.$route.query.selQnaNo) {
      this.selQnaNo = this.$route.query.selQnaNo
    }

    if (this.$route.query.selQnaUserId) {
      this.selQnaUserId = this.$route.query.selQnaUserId
    }

    if (this.$route.query.selPageNum) {
      this.selPageNum = this.$route.query.selPageNum
    }

    if (this.selQnaNo) {
      this.fn_getQnaInfoDetail()
    }
  },
  activated () {

  },

  mounted () {

  },

  methods: {
	  fn_getQnaInfoDetail () {
		  const params = {
			  qnaNo: this.selQnaNo,
			  qnaUserId: this.selQnaUserId
		  }

		  console.log(params)
      getQnaDetail(params).then(res => {
        if (res) {
				  if (res.status && res.status === 200) {
            this.data = res.data
          } else {
            if (res.data && res.data.ERROR_MSG) {
              alert(res.data.ERROR_MSG)
            } else {
              alert('시스템 오류가 발생하였습니다.')
            }
          }
			  }
      })
	  },

	  fn_registQna () {
		  if (!this.qnaData.qnaUserId) {
			  alert('작성자 ID를 입력하여 주세요.')
			  return
		  }

		  if (!this.qnaData.qnaUserPwd) {
			  alert('비밀번호를 입력하여 주세요.')
			  return
		  }

		  if (!this.qnaData.qnaTitle) {
			  alert('문의 제목을 입력하여주세요.')
			  return
		  }

		  if (!this.qnaData.qnaContents) {
			  alert('문의 내용을 입력하여 주세요.')
			  return
		  }

		  const params = {
			  qnaUserId: this.qnaData.qnaUserId,
			  qnaUserPwd: this.qnaData.qnaUserPwd,
			  qnaTitle: this.qnaData.qnaTitle,
			  qnaContents: this.qnaData.qnaContents
		  }

		  registQnaInfo(params).then(res => {
			  console.log(res)
			  if (res) {
				  if (res.status && res.status === 200) {
            alert('정상 저장 되었습니다.')
            this.fn_goQnaList()
          } else {
            if (res.data && res.data.ERROR_MSG) {
              alert(res.data.ERROR_MSG)
            } else {
              alert('시스템 오류가 발생하였습니다.')
            }
          }
			  }
		  })
	  },

	  fn_updateQna () {
		  if (!this.qnaData.qnaUserPwd) {
			  alert('비밀번호를 입력하여 주세요.')
			  return
		  }

		  if (!this.qnaData.qnaTitle) {
			  alert('문의 제목을 입력하여주세요.')
			  return
		  }

		  if (!this.qnaData.qnaContents) {
			  alert('문의 내용을 입력하여 주세요.')
			  return
		  }

		  const params = {
			  qnaNo: this.selQnaNo,
			  qnaUserId: this.selQnaUserId,
			  qnaUserPwd: this.qnaData.qnaUserPwd,
			  qnaTitle: this.qnaData.qnaTitle,
			  qnaContents: this.qnaData.qnaContents
		  }
		  console.log(params)
		  updateQnaInfo(params).then(res => {
			  console.log(res)
			  if (res.status && res.status === 200) {
          alert('정상 저장 되었습니다.')
          this.fn_goQnaList()
        } else {
          if (res.data && res.data.ERROR_MSG) {
            alert(res.data.ERROR_MSG)
          } else {
            alert('시스템 오류가 발생하였습니다.')
          }
        }
		  }).then(err => {
			  console.log(err)
		  })
	  },

	  fn_goQnaList () {
      this.$router.push({
        name: 'qnaList',
        query: {
          selPageNum: this.selPageNum ? this.selPageNum : 1
        }
      })
	  }
  }
}
</script>
<style lang="scss" scoped>
.inquiry-page {
  --ink: #18343a;
  --muted: #6f8083;
  --line: #dce5e3;
  min-height: 100vh;
  background: #f8faf9;
  color: var(--ink);
  text-align: left;
}

.site-header {
  min-height: 82px;
  padding: 0 max(28px, calc((100% - 980px) / 2));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  border-bottom: 1px solid var(--line);
  background: #fff;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: var(--ink);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-decoration: none;
}

.brand-mark {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid #9ab2ae;
  border-radius: 50%;
  font-family: Georgia, serif;
  font-size: 19px;
  letter-spacing: 0;
}

.site-header nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.site-header nav a,
.site-header nav button {
  border: 0;
  background: transparent;
  color: #4d6266;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.site-header nav .router-link-exact-active {
  color: #4d827b;
}

.page-hero {
  padding: 66px max(28px, calc((100% - 980px) / 2));
  background: var(--ink);
  color: #fff;
}

.page-hero p,
.form-heading p,
.answer-heading p {
  margin: 0 0 12px;
  color: #87aaa5;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.2em;
}

.page-hero h1 {
  margin: 0 0 14px;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 43px;
  font-weight: 400;
  letter-spacing: -0.04em;
}

.page-hero > span {
  color: #b8c9c7;
  font-size: 13px;
}

.form-section {
  max-width: 980px;
  margin: 0 auto;
  padding: 72px 28px 100px;
}

.form-heading,
.answer-heading {
  margin-bottom: 25px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.form-heading h2,
.answer-heading h2 {
  margin: 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 29px;
  font-weight: 400;
}

.form-heading > span {
  color: #899697;
  font-size: 10px;
}

i {
  display: inline-block;
  width: 4px;
  height: 4px;
  margin-left: 3px;
  border-radius: 50%;
  background: #6c918c;
  vertical-align: top;
}

.meta-grid {
  margin-bottom: 18px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--line);
  background: #fff;
}

.meta-grid > div {
  padding: 18px 20px;
  display: flex;
  gap: 16px;
  border-right: 1px solid var(--line);
  font-size: 11px;
}

.meta-grid > div:last-child {
  border-right: 0;
}

.meta-grid span {
  color: #899697;
}

.form-card {
  padding: 34px;
  border-top: 2px solid var(--ink);
  background: #fff;
}

.field {
  margin-bottom: 26px;
  display: block;
}

.field:last-child {
  margin-bottom: 0;
}

.field > span {
  display: block;
  margin-bottom: 9px;
  font-size: 12px;
  font-weight: 800;
}

.field input,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0 15px;
  border: 1px solid #ccd9d7;
  border-radius: 2px;
  outline: 0;
  background: #fbfcfc;
  color: var(--ink);
  font: inherit;
  font-size: 13px;
}

.field input {
  height: 50px;
}

.field textarea {
  min-height: 210px;
  padding-top: 15px;
  line-height: 1.7;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  border-color: #5e8e87;
  box-shadow: 0 0 0 3px rgba(94, 142, 135, 0.1);
}

.field input[readonly],
.field textarea[readonly] {
  background: #f1f4f3;
  color: #64777a;
}

.field small {
  display: block;
  margin-top: 8px;
  color: #8b999a;
  font-size: 10px;
}

.answer-card {
  margin-top: 54px;
  padding: 30px 34px 34px;
  border: 1px solid var(--line);
  background: #eef4f2;
}

.status {
  padding: 7px 11px;
  border-radius: 15px;
  background: #e3e7e6;
  color: #778485;
  font-size: 10px;
  font-weight: 700;
}

.status--complete {
  background: #d4e6e1;
  color: #397068;
}

.answer-meta {
  margin: 0 0 20px;
  display: flex;
  gap: 30px;
  font-size: 11px;
}

.answer-meta div {
  display: flex;
  gap: 10px;
}

.answer-meta dt {
  color: #829092;
}

.answer-meta dd {
  margin: 0;
  font-weight: 700;
}

.answer-content {
  min-height: 100px;
  padding: 22px;
  background: #fff;
  color: #506669;
  font-size: 13px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.button-area {
  margin-top: 28px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.primary-button,
.secondary-button {
  height: 46px;
  padding: 0 24px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.primary-button {
  border: 0;
  background: var(--ink);
  color: #fff;
}

.secondary-button {
  border: 1px solid #bac9c7;
  background: #fff;
  color: var(--ink);
}

.site-footer {
  min-height: 140px;
  padding: 34px max(28px, calc((100% - 980px) / 2));
  display: grid;
  grid-template-columns: 1fr auto;
  align-content: center;
  gap: 10px 30px;
  border-top: 1px solid var(--line);
  background: #eef3f1;
  color: #718184;
  font-size: 10px;
}

.site-footer strong {
  color: var(--ink);
  font-size: 11px;
  letter-spacing: 0.16em;
}

.site-footer p {
  grid-row: 2;
  margin: 0;
}

.site-footer span {
  grid-column: 2;
  grid-row: 2;
}

@media (max-width: 700px) {
  .site-header {
    min-height: 72px;
    padding: 0 20px;
  }

  .brand {
    font-size: 10px;
  }

  .site-header nav a:first-child,
  .site-header nav button {
    display: none;
  }

  .page-hero {
    padding: 54px 20px;
  }

  .page-hero h1 {
    font-size: 36px;
  }

  .form-section {
    padding: 58px 20px 80px;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }

  .meta-grid > div {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .meta-grid > div:last-child {
    border-bottom: 0;
  }

  .form-card,
  .answer-card {
    padding: 26px 20px;
  }

  .answer-meta {
    flex-direction: column;
    gap: 8px;
  }

  .site-footer {
    padding: 32px 20px;
    display: flex;
    flex-direction: column;
  }
}
</style>
