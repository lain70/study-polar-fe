<template>
  <admin-goods-layout title="상품 등록">
    <form class="goods-form" @submit.prevent="submit">
      <section><h2>기본 정보</h2><div class="grid">
        <label>상품 코드*<input v-model.trim="form.goodsCode" required></label><label>판매자*<input v-model.trim="form.sellerName" required></label>
        <label>상품명(한글)*<input v-model.trim="form.goodsNameKo" required></label><label>상품명(영문)<input v-model.trim="form.goodsNameEn"></label>
        <label>브랜드<select v-model="form.brandNo"><option :value="null">선택 안 함</option><option v-for="brand in brandOptions" :key="brand.brandNo" :value="brand.brandNo">{{ brand.brandNameKo }}</option></select></label><label>카테고리*<select v-model="form.categoryNo" required><option :value="null" disabled>선택</option><option v-for="category in categoryOptions" :key="category.categoryNo" :value="category.categoryNo">{{ category.categoryName }}</option></select></label>
        <label>제조사<input v-model.trim="form.manufacturer"></label><label>원산지<input v-model.trim="form.originCountry"></label>
      </div></section>
      <section><h2>가격·재고</h2><div class="grid">
        <label>원가*<input v-model.number="form.costPrice" type="number" min="0" required></label><label>판매가*<input v-model.number="form.salePrice" type="number" min="0" required></label>
        <label>할인가<input v-model.number="form.discountPrice" type="number" min="0"></label><label>재고 수량<input v-model.number="form.stockQuantity" type="number" min="0"></label>
        <label>안전재고<input v-model.number="form.safetyStockQuantity" type="number" min="0"></label><label>과세 구분<select v-model="form.taxType"><option value="TAXABLE">과세</option><option value="TAX_EXEMPT">면세</option></select></label>
        <label>배송비 유형<select v-model="form.shippingType"><option value="FREE">무료</option><option value="PAID">유료</option><option value="CONDITIONAL">조건부 무료</option></select></label><label>배송비<input v-model.number="form.shippingFee" type="number" min="0"></label>
      </div></section>
      <section><h2>판매·전시</h2><div class="grid">
        <label>상품 상태<select v-model="form.goodsStatus"><option v-for="status in statuses" :key="status.value" :value="status.value">{{ status.label }}</option></select></label>
        <label>사용 여부<select v-model="form.useYn"><option value="Y">사용</option><option value="N">미사용</option></select></label>
        <label>전시 여부<select v-model="form.displayYn"><option value="Y">전시</option><option value="N">미전시</option></select></label><span></span>
        <label>전시 시작일<input v-model="form.displayStartDate" type="datetime-local"></label><label>전시 종료일<input v-model="form.displayEndDate" type="datetime-local"></label>
      </div></section>
      <section><h2>이미지·설명</h2>
        <label>상품 이미지 <small>첫 번째 이미지가 대표 이미지입니다. JPG, PNG, WEBP, GIF / 파일당 10MB</small><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple @change="selectImages"></label>
        <div class="previews"><img v-for="image in previews" :key="image" :src="image" alt="상품 이미지 미리보기"></div>
        <label>짧은 설명<textarea v-model.trim="form.shortDescription" rows="3"></textarea></label><label>상세 설명<textarea v-model.trim="form.detailDescription" rows="8"></textarea></label><label>검색 키워드<input v-model.trim="form.searchKeywords" placeholder="쉼표로 구분"></label>
      </section>
      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p><div class="actions"><router-link :to="{ name: 'adminGoodsList' }">취소</router-link><button :disabled="isSubmitting">{{ isSubmitting ? '등록 중...' : '상품 등록' }}</button></div>
    </form>
  </admin-goods-layout>
</template>
<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import { createAdminGoods, getAdminGoodsList } from '@/api/admin.js'
export default {
  name: 'AdminGoodsCreateView',
  components: { AdminGoodsLayout },
  data () { return { files: [], previews: [], brandOptions: [], categoryOptions: [], isSubmitting: false, errorMessage: '', statuses: [{ value: 'READY', label: '판매대기' }, { value: 'ON_SALE', label: '판매중' }, { value: 'SOLD_OUT', label: '품절' }, { value: 'SALE_ENDED', label: '판매종료' }, { value: 'SALE_COMPLETED', label: '판매완료' }], form: { goodsCode: '', goodsNameKo: '', goodsNameEn: '', brandNo: null, categoryNo: null, sellerName: localStorage.getItem('adminName') || '', manufacturer: '', originCountry: '', costPrice: 0, salePrice: 0, discountPrice: null, stockQuantity: 0, safetyStockQuantity: 0, taxType: 'TAXABLE', shippingType: 'FREE', shippingFee: 0, goodsStatus: 'READY', useYn: 'Y', displayYn: 'Y', displayStartDate: null, displayEndDate: null, shortDescription: '', detailDescription: '', searchKeywords: '' } } },
  created () { getAdminGoodsList({ page: 1, size: 1 }).then(({ data }) => { this.brandOptions = data.brands; this.categoryOptions = data.categories }).catch(() => { this.errorMessage = '브랜드와 카테고리 정보를 불러오지 못했습니다.' }) },
  beforeDestroy () { this.revokePreviews() },
  methods: {
    selectImages (event) { this.revokePreviews(); this.files = Array.from(event.target.files); this.previews = this.files.map(file => URL.createObjectURL(file)) },
    revokePreviews () { this.previews.forEach(url => URL.revokeObjectURL(url)); this.previews = [] },
    submit () { this.errorMessage = ''; if (this.form.discountPrice !== null && this.form.discountPrice > this.form.salePrice) { this.errorMessage = '할인가는 판매가보다 클 수 없습니다.'; return } const data = new FormData(); data.append('goods', new Blob([JSON.stringify(this.form)], { type: 'application/json' })); this.files.forEach(file => data.append('images', file)); this.isSubmitting = true; createAdminGoods(data).then(({ data }) => this.$router.push({ name: 'adminGoodsDetail', params: { goodsNo: data.goodsNo } })).catch(error => { const body = error.response && error.response.data; this.errorMessage = (body && body.ERROR_MSG) || '상품 등록에 실패했습니다.' }).finally(() => { this.isSubmitting = false }) }
  }
}
</script>
<style lang="scss" scoped>
.goods-form { margin-top: 36px; } section { margin-bottom: 20px; padding: 28px; border: 1px solid #dce5e3; background: #fff; } h2 { margin: 0 0 22px; font-size: 17px; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 22px; } label { display: flex; flex-direction: column; gap: 8px; color: #49615e; font-size: 12px; font-weight: 700; } input,select,textarea { box-sizing: border-box; width: 100%; padding: 12px; border: 1px solid #cbd8d5; background: #fff; font: inherit; } textarea { resize: vertical; } small { color: #879894; font-weight: 400; } .previews { margin: 14px 0 20px; display: flex; flex-wrap: wrap; gap: 10px; } .previews img { width: 100px; height: 100px; object-fit: cover; } .actions { display: flex; justify-content: flex-end; gap: 10px; } .actions a,.actions button { padding: 13px 24px; border: 1px solid #183c43; background: #fff; color: #183c43; text-decoration: none; cursor: pointer; } .actions button { background: #183c43; color: #fff; } .error { color: #b14949; } @media(max-width:700px){.grid{grid-template-columns:1fr}}
</style>
