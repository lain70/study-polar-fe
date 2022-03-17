<template>
  <div>
	<div>
      <h2 class="title">폴라베어샵 1:1문의</h2>
    </div>
	<div class="polarfrm">
      <div class="polarwrap">
		<div class="btn-area">
			<button type="default" class="btn-green" @click="fn_goToPage()">문의하기</button>
		</div>
		<br/>
        <table class="polartbl center">
          <colgroup>
		        <col style="width:50px">
		        <col style="width:80px">
		        <col style="width:150px">
				<col style="width:50px">
		        <col style="width:80px">
		        <col style="width:80px">
          </colgroup>
          <tbody>
			<tr class="tbl head">
              <td>
                <div>
                  <label>
		        	<p>
		        		문의 번호
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		문의 제목
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		문의 내용
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		답변여부
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		작성자ID
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		작성일시
	        		</p>
                  </label>
                </div>
              </td>
            </tr>
			<tr class="tbl contents" v-for="(row, index) in qnaDataList" :key="index">
              <td>
                <div>
                  <label>
		        	<p>
		        		{{row.qnaNo}}
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		{{row.qnaTitle}}
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p @click="fn_goToPage(row.qnaNo, row.qnaUserId)" class="t-href">
		        		{{row.qnaContents}}
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		{{(row.answerYn=='Y')?'답변':'미답변'}}
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		{{row.qnaUserId}}
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		{{row.regDate.replace('T', ' ')}}
	        		</p>
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
	  <div class="list-paging">
		  <div class="paging-tbl-area">
			<table class="paging-tbl">
				<tr>
					<td><a @click="fn_clickPaging(selPage - 1)">◀</a><td>
					<td>
						<a> {{selPage}} / {{totalPageCnt}} page </a>
					<td>
					<td><a @click="fn_clickPaging(selPage + 1)">▶</a></td>
				</tr>
			</table>
		  </div>
	  </div>
      </div>
    </div>
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
	computed:{
	},
	data () {
		return {
			qnaDataList: [],
			totalCnt: 0,
			totalPageCnt: 0,
			//페이징 처리 영역
			startNumber: 0,
			pageCount: 5,
			selPage: 1,

			nowPage:{
				color: 'red'
			}
    	}
	},
	created(){
		this.fn_getQnaInfoList();
	},
	activated(){

  },

  mounted () {

  },

  methods: {
	  fn_getQnaInfoList(){
		  this.startNumber = (this.selPage-1) * this.pageCount;
		  let params ={
			  startNum : this.startNumber,
			  pageCnt : this.pageCount
		  }

		  console.log(params)
		  getQnaList(params).then(res =>{
			  console.log(res);
			  if(res.status && res.status === 200){
					this.qnaDataList = res.data;
					this.totalCnt = parseInt(res.headers['x-total-count'])

				}else{
					if(res.data && res.data.ERROR_MSG){
						alert(res.data.ERROR_MSG)
					}else{
						alert('시스템 오류가 발생하였습니다.')
					}
				}
		  })
		  this.fn_calPaging();

	  },

	  fn_calPaging(){
		  if(this.totalCnt % this.pageCount > 0){
			  this.totalPageCnt = parseInt(this.totalCnt / this.pageCount) + 1
		  }else{
			  this.totalPageCnt = parseInt(this.totalCnt / this.pageCount) + 1
		  }

	  },

	  fn_clickPaging(page){
		  if(page < 1 || page > this.totalPageCnt){
			  return;
		  }
		  console.log(page)
		  this.selPage = page
		  this.fn_getQnaInfoList();
	  },

	  fn_goToPage(qnaNo, qnaUserId){
		this.$router.push({
			name:"qnaDetail",
			query:{
				selQnaNo: qnaNo?qnaNo:'',
				selQnaUserId: qnaUserId?qnaUserId:'',
				selPageNum: this.selPage?this.selPage:1
			}
		});
	  }
  }
}
</script>
<style lang="scss" src="@/assets/scss/common.scss"></style>