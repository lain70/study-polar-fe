<template>
  <div>
	<div>
      <h2 class="title">폴라베어샵 1:1문의</h2>
    </div>
	<div class="polarfrm">
      <div class="polarwrap">
		<div class="btn-area">
			<div v-if="pollingYn" style="text-align: left; float:left">
				<button type="default" class="btn-blue" @click="fn_autoQnaInfoOff()">자동새로고침끄기</button>
				<button type="default" class="btn-green" @click="fn_logout()">로그아웃</button>
			</div>
			<div v-else style="text-align: left; float:left">
				<button type="default" class="btn-blue" @click="fn_autoSelectQnaInfo()">자동새로고침켜기</button>
				<button type="default" class="btn-green" @click="fn_logout()">로그아웃</button>
			</div>
			<div style="text-align: right;">
				<button type="default" class="btn-green" @click="fn_saveQnaCsrInfo()">담당자 지정</button>
			</div>

		</div>
		<br/>
        <table class="polartbl center">
          <colgroup>
				<col style="width:20px">
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
                </div>
              </td>
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
                <div v-if="row.csrNo">
					<input type="checkbox" v-model="row.checked" disabled/>
                </div>
				<div v-else>
					<input type="checkbox" v-model="row.checked"  @click="fnCheckAll(row.qnaNo, $event)"/>
                </div>
              </td>
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
import { getCsrQnaList, registCsrNoInfo, checkQnaCsrNo } from '@/api/csr.js'
import store from '@/store'

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
			pageCount: 10,
			selPage: 1,

			nowPage:{
				color: 'red'
			},

			polling: null,
			pollingYn: false
    	}
	},
	created(){
		if(!localStorage.getItem('accessToken')){
			alert('잘못된 접근입니다.');
			this.$router.push({
					name:"login",
				});
		}

		this.fn_autoSelectQnaInfo();
	},
	activated(){

  },

  mounted () {

  },
  destroyed(){
	  this.fn_autoQnaInfoOff();
  },

  methods: {
	  fn_autoQnaInfoOff(){
		  this.pollingYn = false;
		  clearInterval(this.polling)
	  },

	  fn_autoSelectQnaInfo (){
		  if(this.polling != null){
			  this.polling = null
		  }
		  this.pollingYn = true;
		  this.fn_getQnaInfoList();
		  this.polling = setInterval(() => {
			  this.startNumber = 0;
			  this.selPage = 1;
			  this.fn_getQnaInfoList();
		  }, 10000)
	  },

	  fnCheckAll(id, e){
			this.qnaDataList.forEach(item => {
				if(id === item.qnaNo){
					item.checked = true
				}
			});
		},



	  fn_getQnaInfoList(){
		  this.startNumber = (this.selPage-1) * this.pageCount;
		  let params ={
			  startNum : this.startNumber,
			  pageCnt : this.pageCount
		  }

		  getCsrQnaList(params).then(res =>{
			  console.log(res);
			  if(res.status && res.status === 200){
					this.qnaDataList = res.data;
					this.qnaDataList.forEach((item, idx) => {
						if(item.csrNo){
							item.checked = true
						}else{
							item.checked = false
						}

						item.index = idx
					})

					this.totalCnt = parseInt(res.headers['x-total-count'])
							this.fn_calPaging();
				}else{
					clearInterval(this.polling)
					if(res.data && res.data.ERROR_MSG){
						alert(res.data.ERROR_MSG)
					}else{
						alert('시스템 오류가 발생하였습니다.')
					}
				}

		  }).catch(err => {
			  clearInterval(this.polling)
		  })

		this.fn_calPaging();

	  },

	  fn_saveQnaCsrInfo(){
		  let qnaNoList = []
		  let qnaUserIdList = []
		this.qnaDataList.forEach(item => {
			if(item.answerYn === 'N' && item.checked){
				qnaNoList.push(item.qnaNo)
				qnaUserIdList.push(item.qnaUserId)
			}
		});

		if(qnaNoList.length < 1){
			alert('선택된 1:1문의가 없습니다.');
			return;
		}

		console.log(qnaNoList)
		  let params ={
			  qnaNoList:qnaNoList.join(','),
			  qnaUserIdList:qnaUserIdList.join(',')

		  }

		  registCsrNoInfo(params).then(res =>{
			  console.log(res)
			  if(res){
				  if(res.status && res.status === 200){
					alert('정상 저장 되었습니다.');
					this.fn_getQnaInfoList();
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

	  fn_logout(){
		  let params ={}
		  store.dispatch('CsrLogoutProc', params).then(response => {

			  if(response){
				  alert('로그아웃 되었습니다.')
				  this.$router.push({
					name:"login",
				});
			  }
		  })
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
		let params ={
			qnaNo: qnaNo,
			qnaUserId: qnaUserId
		}

		checkQnaCsrNo(params).then(res =>{
			if(res){
				  if(res.status && res.status === 200){
					this.$router.push({
						name:"csrQnaDetail",
						query:{
							selQnaNo: qnaNo?qnaNo:'',
							selQnaUserId: qnaUserId?qnaUserId:'',
							selPageNum: this.selPage?this.selPage:1
						}
					});
				}else{
					if(res.data && res.data.ERROR_MSG){
						alert(res.data.ERROR_MSG)
					}else{
						alert('시스템 오류가 발생하였습니다.')
					}
				}
			  }
		})


	  }
  }
}
</script>
<style lang="scss" src="@/assets/scss/common.scss"></style>