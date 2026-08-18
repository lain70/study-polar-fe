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
        <h1>1:1 문의</h1>
        <span>궁금한 점을 남겨주시면 확인 후 정성껏 답변해 드립니다.</span>
      </section>

      <section class="inquiry-content">
        <div class="content-heading">
          <div>
            <p>MY INQUIRY</p>
            <h2>문의 내역</h2>
          </div>
          <button type="button" class="primary-button" @click="fn_goToPage()">
            새 문의 작성
          </button>
        </div>

        <div class="table-wrap">
          <table class="inquiry-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>문의 내용</th>
                <th>답변 상태</th>
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in qnaDataList" :key="row.qnaNo">
                <td data-label="번호">{{ row.qnaNo }}</td>
                <td data-label="제목" class="title-cell">{{ row.qnaTitle }}</td>
                <td data-label="문의 내용">
                  <button class="detail-link" type="button" @click="fn_goToPage(row.qnaNo, row.qnaUserId)">
                    {{ row.qnaContents }}
                  </button>
                </td>
                <td data-label="답변 상태">
                  <span class="status" :class="{ 'status--complete': row.answerYn === 'Y' }">
                    {{ row.answerYn === 'Y' ? '답변 완료' : '답변 대기' }}
                  </span>
                </td>
                <td data-label="작성자">{{ row.qnaUserId }}</td>
                <td data-label="작성일">{{ row.regDate.replace('T', ' ') }}</td>
              </tr>
              <tr v-if="qnaDataList.length === 0">
                <td colspan="6" class="empty-state">등록된 문의가 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination" aria-label="페이지 이동">
          <button type="button" aria-label="이전 페이지" @click="fn_clickPaging(selPage - 1)">←</button>
          <span><strong>{{ selPage }}</strong> / {{ totalPageCnt || 1 }}</span>
          <button type="button" aria-label="다음 페이지" @click="fn_clickPaging(selPage + 1)">→</button>
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
import { getQnaList } from '@/api/qna.js'

export default {
  name: 'QnaInfoList',
  props: {

  },
  components: {
  },
  computed: {
  },
  data () {
    return {
      qnaDataList: [],
      totalCnt: 0,
      totalPageCnt: 0,
      // 페이징 처리 영역
      startNumber: 0,
      pageCount: 5,
      selPage: 1,

      nowPage: {
        color: 'red'
      }
    	}
  },
  created () {
    this.fn_getQnaInfoList()
  },
  activated () {

  },

  mounted () {

  },

  methods: {
	  fn_getQnaInfoList () {
		  this.startNumber = (this.selPage - 1) * this.pageCount
		  const params = {
			  startNum: this.startNumber,
			  pageCnt: this.pageCount
		  }

		  console.log(params)
		  getQnaList(params).then(res => {
			  console.log(res)
			  if (res.status && res.status === 200) {
          this.qnaDataList = res.data
          this.totalCnt = parseInt(res.headers['x-total-count'])
        } else {
          if (res.data && res.data.ERROR_MSG) {
            alert(res.data.ERROR_MSG)
          } else {
            alert('시스템 오류가 발생하였습니다.')
          }
        }
		  })
		  this.fn_calPaging()
	  },

	  fn_calPaging () {
		  if (this.totalCnt % this.pageCount > 0) {
			  this.totalPageCnt = parseInt(this.totalCnt / this.pageCount) + 1
		  } else {
			  this.totalPageCnt = parseInt(this.totalCnt / this.pageCount) + 1
		  }
	  },

	  fn_clickPaging (page) {
		  if (page < 1 || page > this.totalPageCnt) {
			  return
		  }
		  console.log(page)
		  this.selPage = page
		  this.fn_getQnaInfoList()
	  },

	  fn_goToPage (qnaNo, qnaUserId) {
      this.$router.push({
        name: 'qnaDetail',
        query: {
          selQnaNo: qnaNo || '',
          selQnaUserId: qnaUserId || '',
          selPageNum: this.selPage ? this.selPage : 1
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
  padding: 0 max(28px, calc((100% - 1180px) / 2));
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
  padding: 76px max(28px, calc((100% - 1180px) / 2));
  background: var(--ink);
  color: #fff;
}

.page-hero p,
.content-heading p {
  margin: 0 0 12px;
  color: #87aaa5;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.2em;
}

.page-hero h1 {
  margin: 0 0 15px;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 45px;
  font-weight: 400;
  letter-spacing: -0.04em;
}

.page-hero span {
  color: #b8c9c7;
  font-size: 13px;
}

.inquiry-content {
  max-width: 1180px;
  min-height: 430px;
  margin: 0 auto;
  padding: 80px 28px 100px;
}

.content-heading {
  margin-bottom: 28px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.content-heading h2 {
  margin: 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 31px;
  font-weight: 400;
}

.primary-button {
  height: 44px;
  padding: 0 22px;
  border: 0;
  background: var(--ink);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.table-wrap {
  overflow-x: auto;
  border-top: 2px solid var(--ink);
}

.inquiry-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.inquiry-table th,
.inquiry-table td {
  padding: 18px 14px;
  border-bottom: 1px solid var(--line);
  font-size: 12px;
  text-align: center;
  vertical-align: middle;
}

.inquiry-table th {
  background: #f0f5f3;
  color: #53696d;
  font-size: 11px;
  font-weight: 800;
}

.inquiry-table th:nth-child(1) { width: 7%; }
.inquiry-table th:nth-child(2) { width: 18%; }
.inquiry-table th:nth-child(3) { width: 29%; }
.inquiry-table th:nth-child(4) { width: 12%; }
.inquiry-table th:nth-child(5) { width: 13%; }
.inquiry-table th:nth-child(6) { width: 21%; }

.title-cell,
.detail-link {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-link {
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  color: #365f64;
  font-size: 12px;
  text-align: left;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.status {
  display: inline-block;
  padding: 6px 9px;
  border-radius: 14px;
  background: #edf0ef;
  color: #7b8788;
  font-size: 10px;
  font-weight: 700;
}

.status--complete {
  background: #dcebe7;
  color: #397068;
}

.empty-state {
  height: 120px;
  color: #8b999a;
}

.pagination {
  margin-top: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
}

.pagination button {
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
  cursor: pointer;
}

.pagination span {
  color: #899697;
  font-size: 11px;
}

.pagination strong {
  color: var(--ink);
}

.site-footer {
  min-height: 140px;
  padding: 34px max(28px, calc((100% - 1180px) / 2));
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
    padding: 58px 20px;
  }

  .page-hero h1 {
    font-size: 37px;
  }

  .inquiry-content {
    padding: 60px 20px 80px;
  }

  .inquiry-table thead {
    display: none;
  }

  .inquiry-table,
  .inquiry-table tbody,
  .inquiry-table tr,
  .inquiry-table td {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .inquiry-table tr {
    padding: 17px 0;
    border-bottom: 1px solid var(--line);
  }

  .inquiry-table td {
    padding: 6px 4px 6px 92px;
    border: 0;
    position: relative;
    text-align: left;
  }

  .inquiry-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 4px;
    color: #8b999a;
    font-size: 10px;
  }

  .inquiry-table .empty-state {
    padding: 40px 0;
    text-align: center;
  }

  .inquiry-table .empty-state::before {
    display: none;
  }

  .site-footer {
    padding: 32px 20px;
    display: flex;
    flex-direction: column;
  }
}
</style>
