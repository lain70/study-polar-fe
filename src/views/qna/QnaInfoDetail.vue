<template>
  <div>
	<div>
      <h2 v-if="selQnaNo" class="title">폴라베어샵 1:1문의상세</h2>
	  <h2 v-else class="title">폴라베어샵 1:1문의하기</h2>
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
				  <div v-if="selQnaNo">
                  <label>
		        	<p>
		        		{{qnaData.qnaUserId}}
	        		</p>
                  </label>
                </div>
				  <div v-else>
					  <input type="text" class="custom-input" v-model="qnaData.qnaUserId"/>
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
                <div v-if="qnaData.answerYn ==='Y'">
					<input type="text" class="custom-input" v-model="qnaData.qnaTitle" readonly/>
                </div>
				<div v-else>
					<input type="text" class="custom-input" v-model="qnaData.qnaTitle"/>
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
                <div v-if="qnaData.answerYn ==='Y'">
					<textarea class="custom-textarea" rows="25" v-model="qnaData.qnaContents" readonly></textarea>
                </div>
				<div v-else>
					<textarea class="custom-textarea" rows="25" v-model="qnaData.qnaContents"></textarea>
                </div>
              </td>
            </tr>
			<tr class="tbl detail">
              <td>
                <div>
                  <label>
		        	<p>
		        		비밀번호
	        		</p>
                  </label>
                </div>
              </td>
			  <td colspan="5">
                <div v-if="qnaData.answerYn !=='Y'">
					<input type="password" class="custom-input" v-model="qnaData.qnaUserPwd"/>
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
		        		{{(qnaData.answerYn ==='Y')?'답변':'미답변'}}
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
		        		{{qnaData.replyUpdtDate}}
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
					<textarea class="custom-textarea" rows="25" v-model="qnaData.qreplyContents" readonly></textarea>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
		<br/>
		<div class="btn-area">
			<div style="text-align: left; float:left">
				<button type="default" class="btn-blue" @click="fn_goQnaList">목록</button>
			</div>
			<div style="text-align: right;">
				<button v-if="selQnaNo" type="default" class="btn-green" @click="fn_updateQna">수정하기</button>
				<button v-else type="default" class="btn-green" @click="fn_registQna">문의하기</button>
			</div>
		</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getQnaDetail,registQnaInfo, updateQnaInfo } from '@/api/qna.js'
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
		getQnaDetail(params).then(res =>{

			if(res){
				  if(res.status && res.status === 200){
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

	  fn_registQna(){
		  if(!this.qnaData.qnaUserId){
			  alert('작성자 ID를 입력하여 주세요.');
			  return
		  }

		  if(!this.qnaData.qnaUserPwd){
			  alert('비밀번호를 입력하여 주세요.');
			  return
		  }

		  if(!this.qnaData.qnaTitle){
			  alert('문의 제목을 입력하여주세요.');
			  return
		  }

		  if(!this.qnaData.qnaContents){
			  alert('문의 내용을 입력하여 주세요.');
			  return
		  }

		  let params ={
			  qnaUserId: this.qnaData.qnaUserId,
			  qnaUserPwd: this.qnaData.qnaUserPwd,
			  qnaTitle: this.qnaData.qnaTitle,
			  qnaContents: this.qnaData.qnaContents
		  }

		  registQnaInfo(params).then(res =>{
			  console.log(res)
			  if(res){
				  if(res.status && res.status === 200){
					alert('정상 저장 되었습니다.');
					this.fn_goQnaList();
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

	  fn_updateQna(){
		  if(!this.qnaData.qnaUserPwd){
			  alert('비밀번호를 입력하여 주세요.');
			  return
		  }

		  if(!this.qnaData.qnaTitle){
			  alert('문의 제목을 입력하여주세요.');
			  return
		  }

		  if(!this.qnaData.qnaContents){
			  alert('문의 내용을 입력하여 주세요.');
			  return
		  }

		  let params ={
			  qnaNo: this.selQnaNo,
			  qnaUserId: this.selQnaUserId,
			  qnaUserPwd: this.qnaData.qnaUserPwd,
			  qnaTitle: this.qnaData.qnaTitle,
			  qnaContents: this.qnaData.qnaContents
		  }
		  console.log(params)
		  updateQnaInfo(params).then(res => {
			  console.log(res)
			  if(res.status && res.status === 200){
					alert('정상 저장 되었습니다.');
					this.fn_goQnaList();
				}else{
					if(res.data && res.data.ERROR_MSG){
						alert(res.data.ERROR_MSG)
					}else{
						alert('시스템 오류가 발생하였습니다.')
					}
				}
		  }).then(err=>{
			  console.log(err)
		  })
	  },

	  fn_goQnaList(){
		this.$router.push({
			name:"qnaList",
			query:{
				selPageNum: this.selPageNum?this.selPageNum:1
			}
		});
	  }
  }
}
</script>
<style lang="scss" src="@/assets/scss/common.scss"></style>