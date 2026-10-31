<template>
  <div>
    <site-header />
    <main class="cart-page" :aria-busy="isLoading || isSaving">
      <h1>장바구니</h1>
      <p class="intro">회원님의 장바구니는 계정에 저장됩니다. 상품을 담아도 재고가 예약되지는 않습니다.</p>
      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
      <p v-if="notice" role="status">{{ notice }}</p>
      <p v-if="isLoading" role="status">장바구니를 불러오는 중입니다.</p>
      <section v-else-if="hasLoaded && !items.length" class="empty-cart">
        <h2>장바구니가 비어 있습니다.</h2>
        <router-link :to="{ name: 'main' }">상품 둘러보기</router-link>
      </section>
      <template v-else-if="hasLoaded">
        <ul class="cart-items">
          <li v-for="item in items" :key="item.goodsNo" class="cart-item">
            <img v-if="item.representativeImageUrl" :src="imageUrl(item.representativeImageUrl)" :alt="item.goodsNameKo">
            <div v-else class="image-placeholder" aria-hidden="true">P</div>
            <div class="item-info">
              <router-link v-if="item.available" :to="{ name: 'goodsDetail', params: { goodsNo: item.goodsNo } }">{{ item.goodsNameKo }}</router-link>
              <strong v-else>{{ item.goodsNameKo }}</strong>
              <p v-if="item.available">{{ currency(item.unitPrice) }} / 개</p>
              <p v-if="!item.available || item.quantity > item.stockQuantity" class="error">{{ !item.available ? '현재 구매할 수 없는 상품입니다.' : '담은 수량이 현재 재고를 초과합니다. 수량을 줄여 주세요.' }}</p>
              <form class="quantity-form" @submit.prevent="saveQuantity(item)">
                <label :for="`quantity-${item.goodsNo}`">수량<span class="sr-only">: {{ item.goodsNameKo }}</span></label>
                <input :id="`quantity-${item.goodsNo}`" v-model.number="quantities[item.goodsNo]" type="number" min="1" :max="item.stockQuantity || 1" step="1" required :disabled="!item.available || isSaving">
                <button type="submit" :disabled="!item.available || isSaving">변경</button>
                <button type="button" :disabled="isSaving" :aria-label="`${item.goodsNameKo} 삭제`" @click="removeItem(item)">삭제</button>
              </form>
            </div>
            <strong class="line-total">{{ item.available ? currency(Number(item.unitPrice) * item.quantity) : '구매 불가' }}</strong>
          </li>
        </ul>
        <aside class="summary">
          <p>구매 가능한 상품 금액 <strong>{{ currency(totalAmount) }}</strong></p>
          <p>배송비는 포함되지 않습니다. 품절·재고 초과 상품은 합계에서 제외됩니다.</p>
          <p>주문·결제 기능은 아직 제공하지 않습니다.</p>
          <router-link :to="{ name: 'main' }">계속 쇼핑하기</router-link>
        </aside>
      </template>
      <button v-if="errorMessage" type="button" :disabled="isLoading || isSaving" @click="loadCart">다시 불러오기</button>
    </main>
    <site-footer />
  </div>
</template>

<script>
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { getCart, updateCartItem, deleteCartItem } from '@/api/cart'
import envs from '@/envs'

export default {
  name: 'CartView',
  components: { SiteHeader, SiteFooter },
  data () {
    return { items: [], quantities: {}, isLoading: false, isSaving: false, hasLoaded: false, errorMessage: '', notice: '' }
  },
  computed: {
    totalAmount () {
      return this.items.filter(item => item.available && item.quantity <= item.stockQuantity)
        .reduce((total, item) => total + Number(item.unitPrice) * item.quantity, 0)
    }
  },
  created () { this.loadCart() },
  mounted () { window.addEventListener('storage', this.handleSessionChange) },
  beforeUnmount () { window.removeEventListener('storage', this.handleSessionChange) },
  methods: {
    handleSessionChange (event) {
      if (event.key === 'accessToken' || event.key === null) {
        this.items = []
        this.quantities = {}
        this.hasLoaded = false
        this.$router.replace({ name: 'userLogin', query: { redirect: 'cart' } })
      }
    },
    async loadCart () {
      this.isLoading = true
      this.hasLoaded = false
      this.errorMessage = ''
      try {
        const { data } = await getCart()
        this.items = data
        this.quantities = Object.fromEntries(data.map(item => [item.goodsNo, item.quantity]))
        this.hasLoaded = true
      } catch (error) {
        this.items = []
        this.errorMessage = this.message(error, '장바구니를 불러오지 못했습니다.')
      } finally {
        this.isLoading = false
      }
    },
    async saveQuantity (item) {
      const quantity = this.quantities[item.goodsNo]
      if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > item.stockQuantity) {
        this.errorMessage = '수량은 현재 재고 이내의 1 이상 정수로 입력해 주세요.'
        return
      }
      await this.changeItem(() => updateCartItem(item.goodsNo, quantity), '수량을 변경했습니다.')
    },
    async removeItem (item) {
      await this.changeItem(() => deleteCartItem(item.goodsNo), '상품을 삭제했습니다.')
    },
    async changeItem (action, notice) {
      if (this.isSaving) return
      this.isSaving = true
      this.errorMessage = ''
      this.notice = ''
      try {
        await action()
        this.notice = notice
        await this.loadCart()
      } catch (error) {
        this.errorMessage = this.message(error, '변경에 실패했습니다. 다시 시도해 주세요.')
      } finally {
        this.isSaving = false
      }
    },
    message (error, fallback) {
      return (error.response && error.response.data && error.response.data.ERROR_MSG) || fallback
    },
    currency (value) { return `${Number(value).toLocaleString('ko-KR')}원` },
    imageUrl (path) {
      if (/^https?:\/\//.test(path)) return path
      return `${envs.apiBaseUrl.replace(/\/api$/, '')}${path}`
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-page { max-width: 1100px; margin: 0 auto; padding: 48px 24px; text-align: left; color: var(--color-foreground); }
h1 { font-size: 32px; }
.intro, .summary > p:not(:first-child) { color: var(--color-muted-foreground); line-height: 1.7; }
.cart-items { list-style: none; padding: 0; margin: 32px 0; }
.cart-item { display: flex; gap: 24px; align-items: center; padding: 24px 0; border-bottom: 1px solid var(--color-border); }
.cart-item img, .image-placeholder { width: 110px; height: 130px; object-fit: cover; border-radius: var(--radius-card); background: var(--color-muted); }
.image-placeholder { display: grid; place-items: center; flex-shrink: 0; }
.item-info { flex: 1; min-width: 0; overflow-wrap: anywhere; }
a { color: inherit; text-underline-offset: 4px; }
.quantity-form { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
input { width: 78px; padding: 8px; box-sizing: border-box; }
input, button { min-height: 44px; font: inherit; border: 1px solid var(--color-border); border-radius: 4px; }
button { padding: 8px 16px; cursor: pointer; background: var(--color-background); color: var(--color-foreground); }
button:disabled { opacity: 0.6; cursor: not-allowed; }
.error { color: var(--color-destructive); }
.summary, .empty-cart { padding: 24px; background: var(--color-muted); border-radius: var(--radius-card); }
.summary > p:first-child { display: flex; justify-content: space-between; gap: 16px; font-size: 20px; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (max-width: 600px) {
  .cart-item { gap: 12px; flex-wrap: wrap; }
  .cart-item img, .image-placeholder { width: 72px; height: 90px; }
  .line-total { width: 100%; text-align: right; }
  .summary > p:first-child { font-size: 17px; }
}
</style>
