<template>
  <admin-product-layout title="상품 목록">
    <section class="search-panel">
      <form @submit.prevent="searchProducts">
        <div class="primary-filters">
          <label>검색 조건<select v-model="searchType"><option value="PRODUCT_NO">상품번호</option><option value="PRODUCT_NAME">상품명</option><option value="PRODUCT_CODE">상품 코드</option></select></label>
          <label class="keyword-field">검색어<input v-model.trim="keyword" :type="searchType === 'PRODUCT_NO' ? 'number' : 'text'" :placeholder="keywordPlaceholder"></label>
          <label>등록 시작일시<input v-model="registeredFrom" type="datetime-local"></label>
          <label>등록 종료일시<input v-model="registeredTo" type="datetime-local"></label>
        </div>
        <div class="advanced-filters">
          <details><summary>상품 상태 <span>{{ selectedStatuses.length ? `${selectedStatuses.length}개 선택` : '전체' }}</span></summary><div class="checkbox-list"><label v-for="status in statusOptions" :key="status.value"><input v-model="selectedStatuses" type="checkbox" :value="status.value">{{ status.label }}</label></div></details>
          <details><summary>브랜드 <span>{{ selectedBrands.length ? `${selectedBrands.length}개 선택` : '전체' }}</span></summary><div class="checkbox-list"><label v-for="brand in brandOptions" :key="brand"><input v-model="selectedBrands" type="checkbox" :value="brand">{{ brand }}</label><p v-if="!brandOptions.length">등록된 브랜드가 없습니다.</p></div></details>
          <details><summary>카테고리 <span>{{ selectedCategories.length ? `${selectedCategories.length}개 선택` : '전체' }}</span></summary><div class="checkbox-list"><label v-for="category in categoryOptions" :key="category"><input v-model="selectedCategories" type="checkbox" :value="category">{{ category }}</label><p v-if="!categoryOptions.length">등록된 카테고리가 없습니다.</p></div></details>
        </div>
        <div class="search-actions"><button type="button" class="reset-button" @click="resetFilters">초기화</button><button type="submit">상품 조회</button></div>
      </form>
    </section>
    <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    <section class="result-header">
      <div><strong>상품 조회 결과</strong><span>총 {{ totalCount }}개</span></div>
      <div class="result-actions">
        <label>목록 표시<select v-model.number="pageSize" @change="changePageSize"><option :value="20">20개</option><option :value="50">50개</option><option :value="100">100개</option></select></label>
        <router-link :to="{ name: 'adminProductCreate' }">상품 등록</router-link>
      </div>
    </section>
    <div class="table-wrap">
      <table>
        <thead><tr><th>이미지</th><th>상품번호</th><th>상품명</th><th>브랜드/카테고리</th><th>판매자</th><th>판매가</th><th>상태</th><th>전시</th></tr></thead>
        <tbody>
          <tr v-for="product in products" :key="product.productNo">
            <td><img v-if="product.representativeImageUrl" :src="imageUrl(product.representativeImageUrl)" :alt="product.productNameKo"><span v-else class="no-image">NO IMAGE</span></td>
            <td><router-link :to="{ name: 'adminProductDetail', params: { productNo: product.productNo } }">{{ product.productNo }}</router-link></td>
            <td><router-link :to="{ name: 'adminProductDetail', params: { productNo: product.productNo } }"><strong>{{ product.productNameKo }}</strong><small>{{ product.productNameEn }}</small></router-link></td>
            <td>{{ product.brandName || '-' }}<small>{{ product.categoryName }}</small></td><td>{{ product.sellerName }}</td>
            <td>{{ currency(product.discountPrice || product.salePrice) }}</td><td>{{ statusLabel(product.productStatus) }}</td><td>{{ product.displayYn === 'Y' ? '전시' : '미전시' }}</td>
          </tr>
          <tr v-if="!isLoading && !products.length"><td colspan="8" class="empty">등록된 상품이 없습니다.</td></tr>
        </tbody>
      </table>
    </div>
    <nav v-if="totalPages > 1" class="pagination" aria-label="상품 목록 페이지">
      <button type="button" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">이전</button>
      <button v-for="pageNumber in visiblePageNumbers" :key="pageNumber" type="button" :class="{ active: currentPage === pageNumber }" :aria-current="currentPage === pageNumber ? 'page' : null" @click="changePage(pageNumber)">{{ pageNumber }}</button>
      <button type="button" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">다음</button>
    </nav>
  </admin-product-layout>
</template>
<script>
import AdminProductLayout from '@/components/admin/AdminProductLayout.vue'
import { getAdminProducts } from '@/api/admin.js'
import envs from '@/envs'
export default {
  name: 'AdminProductListView',
  components: { AdminProductLayout },
  data: () => ({
    products: [],
    searchType: 'PRODUCT_NAME',
    keyword: '',
    registeredFrom: '',
    registeredTo: '',
    selectedStatuses: [],
    selectedBrands: [],
    selectedCategories: [],
    brandOptions: [],
    categoryOptions: [],
    statusOptions: [
      { value: 'READY', label: '판매대기' },
      { value: 'ON_SALE', label: '판매중' },
      { value: 'SOLD_OUT', label: '품절' },
      { value: 'SALE_ENDED', label: '판매종료' },
      { value: 'SALE_COMPLETED', label: '판매완료' }
    ],
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
    isLoading: false,
    errorMessage: ''
  }),
  computed: {
    keywordPlaceholder () {
      return { PRODUCT_NO: '상품번호 입력', PRODUCT_NAME: '한글 또는 영문 상품명 입력', PRODUCT_CODE: '상품 코드 입력' }[this.searchType]
    },
    totalPages () {
      return Math.max(1, Math.ceil(this.totalCount / this.pageSize))
    },
    visiblePageNumbers () {
      const pageCount = Math.min(this.totalPages, 5)
      const startPage = Math.max(1, Math.min(this.currentPage - 2, this.totalPages - pageCount + 1))
      return Array.from({ length: pageCount }, (_, index) => startPage + index)
    }
  },
  created () { this.loadProducts() },
  methods: {
    loadProducts () {
      this.errorMessage = ''
      if (this.registeredFrom && this.registeredTo && this.registeredTo < this.registeredFrom) {
        this.errorMessage = '등록 종료일시는 시작일시 이후로 선택해 주세요.'
        return
      }
      this.isLoading = true
      getAdminProducts({
        searchType: this.searchType,
        keyword: this.keyword || undefined,
        registeredFrom: this.registeredFrom || undefined,
        registeredTo: this.registeredTo || undefined,
        statuses: this.selectedStatuses.length ? this.selectedStatuses.join(',') : undefined,
        brands: this.selectedBrands.length ? this.selectedBrands.join(',') : undefined,
        categories: this.selectedCategories.length ? this.selectedCategories.join(',') : undefined,
        page: this.currentPage,
        size: this.pageSize
      }).then(({ data }) => {
        this.products = data.items
        this.totalCount = data.totalCount
        this.brandOptions = data.brands
        this.categoryOptions = data.categories
      }).catch(() => { this.errorMessage = '상품 목록을 불러오지 못했습니다.' }).finally(() => { this.isLoading = false })
    },
    searchProducts () {
      this.currentPage = 1
      this.loadProducts()
    },
    changePageSize () {
      this.currentPage = 1
      this.loadProducts()
    },
    changePage (pageNumber) {
      if (pageNumber < 1 || pageNumber > this.totalPages || pageNumber === this.currentPage) return
      this.currentPage = pageNumber
      this.loadProducts()
    },
    resetFilters () {
      this.searchType = 'PRODUCT_NAME'
      this.keyword = ''
      this.registeredFrom = ''
      this.registeredTo = ''
      this.selectedStatuses = []
      this.selectedBrands = []
      this.selectedCategories = []
      this.currentPage = 1
      this.pageSize = 20
      this.loadProducts()
    },
    currency (value) { return `${Number(value || 0).toLocaleString('ko-KR')}원` },
    imageUrl (path) { return `${envs.apiBaseUrl.replace(/\/api$/, '')}${path}` },
    statusLabel (status) { return { READY: '판매대기', ON_SALE: '판매중', SOLD_OUT: '품절', SALE_ENDED: '판매종료', SALE_COMPLETED: '판매완료' }[status] || status }
  }
}
</script>
<style lang="scss" scoped>
.search-panel { margin-top: 36px; padding: 26px; border: 1px solid #d7e2df; background: #fff; } .primary-filters { display: grid; grid-template-columns: 160px minmax(220px,1fr) 220px 220px; gap: 16px; } label { display: flex; flex-direction: column; gap: 8px; color: #536a66; font-size: 11px; font-weight: 700; } input,select { min-width: 0; padding: 12px; box-sizing: border-box; border: 1px solid #cbd8d5; background: #fff; } .advanced-filters { margin-top: 18px; display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; } details { position: relative; border: 1px solid #d5dfdd; } summary { padding: 13px 14px; display: flex; justify-content: space-between; color: #405b57; font-size: 12px; font-weight: 700; cursor: pointer; list-style: none; } summary span { color: #82938f; font-size: 10px; font-weight: 400; } .checkbox-list { position: absolute; z-index: 3; top: 46px; left: -1px; right: -1px; max-height: 220px; padding: 14px; display: grid; gap: 11px; overflow-y: auto; border: 1px solid #cbd8d5; background: #fff; box-shadow: 0 12px 28px rgba(20,49,57,.12); } .checkbox-list label { flex-direction: row; align-items: center; } .checkbox-list input { padding: 0; } .checkbox-list p { color: #879793; font-size: 11px; } .search-actions { margin-top: 22px; display: flex; justify-content: center; gap: 8px; } button,.result-header a { padding: 12px 22px; border: 0; background: #183c43; color: #fff; text-decoration: none; cursor: pointer; } .reset-button { border: 1px solid #b9cac6; background: #fff; color: #526c68; } .result-header { margin: 28px 0 12px; display: flex; align-items: center; justify-content: space-between; } .result-header > div:first-child { display: flex; align-items: baseline; gap: 10px; } .result-header span { color: #728682; font-size: 11px; } .result-actions { display: flex; align-items: flex-end; gap: 10px; } .result-actions label { flex-direction: row; align-items: center; white-space: nowrap; } .result-actions select { padding: 10px 30px 10px 10px; } .table-wrap { overflow-x: auto; background: #fff; } table { width: 100%; border-collapse: collapse; } th,td { padding: 14px; border-bottom: 1px solid #e1e8e6; font-size: 12px; } th { color: #718682; text-align: left; } td img,.no-image { width: 54px; height: 54px; object-fit: cover; display: grid; place-items: center; background: #edf2f1; color: #93a29f; font-size: 8px; } td a { color: #163b43; text-decoration: none; } td small { margin-top: 5px; display: block; color: #81918e; } .empty { padding: 50px; text-align: center; } .pagination { margin-top: 22px; display: flex; justify-content: center; gap: 6px; } .pagination button { min-width: 38px; padding: 10px 12px; border: 1px solid #cbd8d5; background: #fff; color: #526c68; } .pagination button.active { border-color: #183c43; background: #183c43; color: #fff; } .pagination button:disabled { opacity: .4; cursor: default; } .error { color: #b14949; } @media(max-width:1100px){.primary-filters{grid-template-columns:1fr 2fr}.advanced-filters{grid-template-columns:1fr}} @media(max-width:650px){.primary-filters{grid-template-columns:1fr}.result-header{align-items:flex-start;gap:12px;flex-direction:column}.result-actions{width:100%;justify-content:space-between}}
</style>
