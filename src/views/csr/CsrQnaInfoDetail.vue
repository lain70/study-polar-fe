<template>
  <div>
	<div>
      <h2 class="title">폴라베어샵 1:1문의 답변하기</h2>
    </div>
	<div class="polarfrm">
      <div class="polarwrap">
        <table class="polartbl center">
          <colgroup>
		        <col style="width:80px">
		        <col style="width:80px">
		        <col style="width:80px">
				<col style="width:80px">
		        <col style="width:80px">
		        <col style="width:80px">
          </colgroup>
          <tbody>
			<tr class="tbl detail" style="height: 50px">
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
		        		{{qnaData.qnaNo}}
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		작성자 ID
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
				  <div>
                  <label>
		        	<p>
		        		{{qnaData.qnaUserId}}
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
			  <td>
                <div>
                  <label>
		        	<p>
		        		{{qnaData.regDate}}
	        		</p>
                  </label>
                </div>
              </td>
            </tr>
			<tr class="tbl detail">
              <td>
                <div>
                  <label>
		        	<p>
		        		문의제목
	        		</p>
                  </label>
                </div>
              </td>
			  <td colspan="5">
                <div>
					<input type="text" class="custom-input" v-model="qnaData.qnaTitle" readonly/>
                </div>
              </td>
            </tr>
			<tr class="tbl detail" style="height: 300px">
              <td>
                <div>
                  <label>
		        	<p>
		        		문의내용
	        		</p>
                  </label>
                </div>
              </td>
			  <td colspan="5">
                <div>
					<textarea class="custom-textarea" rows="25" v-model="qnaData.qnaContents" readonly></textarea>
                </div>
              </td>
            </tr>
			<tr v-if="selQnaNo" class="tbl detail" style="height: 50px">
              <td>
                <div>
                  <label>
		        	<p>
		        		답변 여부
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		{{(qnaData.answerYn=='Y')?'답변':'미답변'}}
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		담당상담원
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		{{qnaData.csrName}}
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		답변일시
	        		</p>
                  </label>
                </div>
              </td>
			  <td>
                <div>
                  <label>
		        	<p>
		        		{{qnaData.replyUpdtDate?qnaData.replyUpdtDate.replace('T',' '):qnaData.replyUpdtDate}}
	        		</p>
                  </label>
                </div>
              </td>
            </tr>
			<tr v-if="selQnaNo" class="tbl detail" style="height: 300px">
              <td>
                <div>
                  <label>
		        	<p>
		        		답변 내용
	        		</p>
                  </label>
                </div>
              </td>
			  <td colspan="5">
                <div>
					<textarea class="custom-textarea" rows="25" v-model="qnaData.qnaReplyContents"></textarea>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
		<br/>
		<div class="btn-area">
			<div style="text-align: left; float:left">
				<button type="default" class="btn-blue" @click="fn_goCsrQnaList">목록</button>
			</div>
			<div style="text-align: right;">
				<button v-if="qnaData.answerYn && qnaData.answerYn === 'Y'" type="default" class="btn-green" @click="fn_updateQnaReply">수정하기</button>
				<button v-else type="default" class="btn-green" @click="fn_saveQnaReply">답변하기</button>
			</div>
		</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCsrQnaDetail,registCsrQnaReply, updateCsrQnaReply } from '@/api/csr.js'
export default {
	name: 'QnaInfoList',
	props: {

	},
	components: {
	},
	computed:{
		qnaData(){
			let qnaData = this.data;
			qnaData.regDate = qnaData.regDate?qnaData.regDate.replace('T', ' '):qnaData.regDate
			qnaData.replyUpdtDate = qnaData.replyUpdtDate?qnaData.replyUpdtDate.replace('T', ' '):qnaData.replyUpdtDate
			return qnaData;
		}
	},
	data () {
		return {
			data: [],
			selQnaNo:'',
			selQnaUserId: '',
			selPageNum:'',
    	}
	},
	created(){
		console.log(!localStorage.getItem('accessToken'))
		if(localStorage.getItem('accessToken')){
			alert('잘못된 접근입니다.');
			this.$router.push({
					name:"login",
				});
		}
		if(this.$route.query.selQnaNo){
			this.selQnaNo = this.$route.query.selQnaNo;
		}

		if(this.$route.query.selQnaUserId){
			this.selQnaUserId = this.$route.query.selQnaUserId;
		}

		if(this.$route.query.selPageNum){
			this.selPageNum = this.$route.query.selPageNum
		}

		if(this.selQnaNo){
			this.fn_getQnaInfoDetail();
		}

	},
	activated(){

  },

  mounted () {

  },

  methods: {
	  fn_getQnaInfoDetail(){
		  let params ={
			  qnaNo : this.selQnaNo,
			  qnaUserId : this.selQnaUserId
		  }

		  console.log(params)
		getCsrQnaDetail(params).then(res =>{

			if(res){
				  if(res.status && res.status === 200){
					  console.log(res.data)
					this.data = res.data
				}else{
					if(res.data && res.data.ERROR_MSG){
						alert(res.data.ERROR_MSG)
					}else{
						alert('시스템 오류가 발생하였습니다.')
					}
				}
			  }
		})
	  },

	  fn_saveQnaReply(){
		  if(!this.qnaData.csrNo){
			  alert('담당자가 지정되어 있지 않습니다.');
			  return
		  }

		  if(!this.qnaData.qnaReplyContents){
			  alert('문의 내용을 입력하여 주세요.');
			  return
		  }

		  let params ={
			  qnaNo: this.selQnaNo,
			  qnaUserId: this.qnaData.qnaUserId,
			  qnaReplyContents: this.qnaData.qnaReplyContents
		  }

		  console.log(params)
		  registCsrQnaReply(params).then(res =>{
			  console.log(res)
			  if(res){
				  if(res.status && res.status === 200){
					alert('정상 저장 되었습니다.');
					this.fn_getQnaInfoDetail();
				}else{
					if(res.data && res.data.ERROR_MSG){
						alert(res.data.ERROR_MSG)
					}else{
						alert('시스템 오류가 발생하였습니다.')
					}
				}
			  }
		  })
	  },

	  fn_updateQnaReply(){
		  if(!this.qnaData.answerYn || this.qnaData.answerYn === 'N'){
			  alert('담당자가 지정되어 있지 않습니다.');
			  return
		  }

		  if(!this.qnaData.qnaReplyContents){
			  alert('문의 내용을 입력하여 주세요.');
			  return
		  }

		  let params ={
			  qnaNo: this.selQnaNo,
			  qnaReplyNo: this.qnaData.qnaReplyNo,
			  qnaUserId: this.qnaData.qnaUserId,
			  qnaReplyContents: this.qnaData.qnaReplyContents
		  }

		  updateCsrQnaReply(params).then(res =>{
			  console.log(res)
			  if(res){
				  if(res.status && res.status === 200){
					alert('정상 저장 되었습니다.');
					this.fn_getQnaInfoDetail();
				}else{
					if(res.data && res.data.ERROR_MSG){
						alert(res.data.ERROR_MSG)
					}else{
						alert('시스템 오류가 발생하였습니다.')
					}
				}
			  }
		  })
	  },

	  fn_goCsrQnaList(){
		this.$router.push({
			name:"csrQnaList",
			query:{
				selPageNum: this.selPageNum?this.selPageNum:1
			}
		});
	  }
  }
}
</script>
<style lang="scss" src="@/assets/scss/common.scss"></style>