<template>
  <div class="detail-page">
    <header class="site-header">
      <div class="utility-bar">
        <router-link class="brand" :to="{ name: 'main' }" aria-label="Polar Bear Shop 홈">
          <span class="brand-mark" aria-hidden="true">P</span>
          <span>POLAR BEAR SHOP</span>
        </router-link>

        <form class="search-form" role="search" @submit.prevent>
          <label class="sr-only" for="detail-search">상품 검색</label>
          <input id="detail-search" type="search" placeholder="찾고 있는 상품을 검색해 보세요">
          <button type="submit" aria-label="검색">검색</button>
        </form>

        <div class="account-actions">
          <button v-if="isAuthenticated" class="account-button" type="button" @click="editUserInfo">
            회원정보
          </button>
          <button class="auth-button" type="button" :disabled="isLoggingOut" @click="handleAuthAction">
            {{ authButtonText }}
          </button>
          <p v-if="logoutError" class="logout-error" role="alert">{{ logoutError }}</p>
        </div>
      </div>

      <nav class="main-nav" aria-label="주요 메뉴">
        <router-link :to="{ name: 'main' }">홈</router-link>
        <router-link :to="{ name: 'main', hash: '#new-arrivals' }">신상품</router-link>
        <router-link :to="{ name: 'main', hash: '#best-items' }">베스트</router-link>
        <router-link to="/csr">문의하기</router-link>
      </nav>
    </header>

    <main class="detail-main">
      <nav class="breadcrumb" aria-label="현재 위치">
        <router-link :to="{ name: 'main' }">홈</router-link>
        <span aria-hidden="true">/</span>
        <span>상품 상세</span>
      </nav>

      <div v-if="isLoading" class="state-panel" aria-live="polite">
        <span class="loading-mark" aria-hidden="true">P</span>
        <p>상품 정보를 불러오는 중입니다.</p>
      </div>

      <div v-else-if="errorMessage" class="state-panel state-panel--error" role="alert">
        <p>{{ errorMessage }}</p>
        <div>
          <button type="button" @click="loadGoods">다시 시도</button>
          <router-link :to="{ name: 'main' }">홈으로 돌아가기</router-link>
        </div>
      </div>

      <template v-else-if="goods">
        <section class="product-overview" aria-labelledby="product-title">
          <div class="gallery">
            <div class="thumbnail-list" aria-label="상품 추가 이미지">
              <button
                v-for="(image, index) in images"
                :key="image.goodsImageNo || image.imageUrl"
                type="button"
                :class="{ 'is-active': activeImageIndex === index }"
                :aria-label="`${goods.goodsNameKo} 이미지 ${index + 1} 보기`"
                :aria-pressed="activeImageIndex === index"
                @click="activeImageIndex = index"
              >
                <img :src="imageUrl(image.imageUrl)" alt="">
              </button>
            </div>

            <div class="main-image">
              <img v-if="activeImage" :src="imageUrl(activeImage.imageUrl)" :alt="goods.goodsNameKo">
              <span v-else>POLAR<br>BEAR</span>
            </div>
          </div>

          <aside class="purchase-info">
            <div class="product-heading">
              <p>{{ goods.brandNameKo || 'POLAR BEAR' }} · {{ goods.categoryName }}</p>
              <h1 id="product-title">{{ goods.goodsNameKo }}</h1>
              <span v-if="goods.goodsNameEn">{{ goods.goodsNameEn }}</span>
              <p v-if="goods.shortDescription" class="short-description">{{ goods.shortDescription }}</p>
            </div>

            <div class="price-block">
              <p v-if="hasDiscount" class="original-price">{{ currency(goods.salePrice) }}</p>
              <div>
                <strong v-if="hasDiscount">{{ discountRate }}%</strong>
                <b>{{ currency(sellingPrice) }}</b>
              </div>
            </div>

            <dl class="benefit-list">
              <div>
                <dt>배송비</dt>
                <dd>{{ shippingLabel }}</dd>
              </div>
              <div>
                <dt>카드 혜택</dt>
                <dd>카드사별 혜택은 결제 단계에서 확인</dd>
              </div>
              <div>
                <dt>판매 상태</dt>
                <dd :class="{ 'sold-out': isSoldOut }">{{ isSoldOut ? '품절' : '판매중' }}</dd>
              </div>
            </dl>

            <div class="notice-card">
              <span aria-hidden="true">i</span>
              <p>상품 및 주문에 관해 궁금한 점이 있다면 고객센터로 문의해 주세요.</p>
            </div>

            <router-link class="inquiry-button" to="/csr">상품 문의하기</router-link>
          </aside>
        </section>

        <nav class="detail-tabs" aria-label="상품 상세 메뉴">
          <a href="#product-description">상품 상세</a>
          <a href="#product-information">상품 정보</a>
          <a href="#purchase-notice">구매 전 확인</a>
        </nav>

        <section id="product-description" class="detail-section description-section">
          <p class="section-kicker">PRODUCT STORY</p>
          <h2>상품 상세</h2>
          <p v-if="goods.detailDescription" class="detail-description">{{ goods.detailDescription }}</p>
          <p v-else class="empty-description">등록된 상품 상세 설명이 없습니다.</p>
        </section>

        <section id="product-information" class="detail-section information-section">
          <p class="section-kicker">PRODUCT INFORMATION</p>
          <h2>상품 정보</h2>
          <dl>
            <div v-for="item in productInformation" :key="item.label">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
        </section>

        <section id="purchase-notice" class="detail-section notice-section">
          <p class="section-kicker">PLEASE NOTE</p>
          <h2>구매 전 확인해 주세요</h2>
          <ul>
            <li>상품 색상은 화면 설정과 촬영 환경에 따라 실제와 다르게 보일 수 있습니다.</li>
            <li>배송 및 교환·반품 조건은 주문 전 고객센터를 통해 확인해 주세요.</li>
            <li>상품에 관한 문의 시 상품명을 함께 알려주시면 빠르게 안내받을 수 있습니다.</li>
          </ul>
        </section>
      </template>
    </main>

    <footer class="site-footer">
      <div class="footer-brand">
        <span class="brand-mark" aria-hidden="true">P</span>
        <div>
          <strong>POLAR BEAR SHOP</strong>
          <p>A WARM SHOP IN THE POLAR</p>
        </div>
      </div>
      <p>일상에 따뜻함을 더하는 작은 쇼핑 공간입니다.</p>
      <p class="copyright">© POLAR BEAR SHOP. ALL RIGHTS RESERVED.</p>
    </footer>
  </div>
</template>

<script>
import { getGoodsDetail } from '@/api/goods'
import envs from '@/envs'

export default {
  name: 'GoodsDetailView',
  data () {
    return {
      goods: null,
      activeImageIndex: 0,
      isLoading: false,
      errorMessage: '',
      isAuthenticated: Boolean(localStorage.getItem('accessToken')),
      isLoggingOut: false,
      logoutError: ''
    }
  },
  computed: {
    images () {
      return this.goods && Array.isArray(this.goods.images) ? this.goods.images : []
    },
    activeImage () {
      return this.images[this.activeImageIndex] || null
    },
    sellingPrice () {
      return this.goods.discountPrice == null ? this.goods.salePrice : this.goods.discountPrice
    },
    hasDiscount () {
      return this.goods.discountPrice != null && Number(this.goods.discountPrice) < Number(this.goods.salePrice)
    },
    discountRate () {
      if (!this.hasDiscount || Number(this.goods.salePrice) <= 0) {
        return 0
      }
      return Math.round((1 - Number(this.goods.discountPrice) / Number(this.goods.salePrice)) * 100)
    },
    shippingLabel () {
      if (this.goods.shippingType === 'FREE' || Number(this.goods.shippingFee) === 0) {
        return '무료배송'
      }
      if (this.goods.shippingType === 'CONDITIONAL') {
        return `${this.currency(this.goods.shippingFee)} · 조건부 무료`
      }
      return this.currency(this.goods.shippingFee)
    },
    isSoldOut () {
      return this.goods.goodsStatus === 'SOLD_OUT'
    },
    productInformation () {
      return [
        { label: '판매자', value: this.goods.sellerName || '-' },
        { label: '제조사', value: this.goods.manufacturer || '-' },
        { label: '원산지', value: this.goods.originCountry || '-' },
        { label: '과세 구분', value: this.goods.taxType === 'TAX_EXEMPT' ? '면세 상품' : '과세 상품' },
        { label: '배송 안내', value: this.shippingLabel }
      ]
    },
    authButtonText () {
      if (!this.isAuthenticated) {
        return '로그인'
      }
      return this.isLoggingOut ? '로그아웃 중' : '로그아웃'
    }
  },
  watch: {
    '$route.params.goodsNo': 'loadGoods'
  },
  created () {
    this.loadGoods()
  },
  methods: {
    loadGoods () {
      this.isLoading = true
      this.errorMessage = ''
      this.goods = null
      this.activeImageIndex = 0
      getGoodsDetail(this.$route.params.goodsNo)
        .then(({ data }) => {
          this.goods = data
        })
        .catch(error => {
          this.errorMessage = error.response && error.response.status === 404
            ? '판매 중인 상품을 찾을 수 없습니다.'
            : '상품 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    imageUrl (path) {
      if (/^https?:\/\//.test(path)) {
        return path
      }
      return `${envs.apiBaseUrl.replace(/\/api$/, '')}${path}`
    },
    currency (value) {
      return `${Number(value || 0).toLocaleString('ko-KR')}원`
    },
    editUserInfo () {
      this.$router.push({ name: 'userPasswordConfirm' })
    },
    handleAuthAction () {
      if (!this.isAuthenticated) {
        this.$router.push({ name: 'userLogin' })
        return
      }
      this.logout()
    },
    logout () {
      this.logoutError = ''
      this.isLoggingOut = true
      this.$store.dispatch('UserLogoutProc')
        .then(() => {
          this.isAuthenticated = false
        })
        .catch(() => {
          this.logoutError = '로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.'
        })
        .finally(() => {
          this.isLoggingOut = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-page {
  --ink: var(--color-foreground);
  --muted: #6f8083;
  --line: var(--color-border);
  min-height: 100vh;
  background: var(--color-background);
  color: var(--ink);
  text-align: left;
}

.site-header {
  position: relative;
  z-index: 10;
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.97);
}

.utility-bar {
  max-width: 1240px;
  min-height: 92px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: minmax(200px, 1fr) minmax(220px, 480px) auto;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
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
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #9ab2ae;
  border-radius: 50%;
  font-family: Georgia, serif;
  font-size: 19px;
  letter-spacing: 0;
}

.search-form {
  height: 46px;
  display: flex;
  border: 1px solid #cbd8d6;
  border-radius: 24px;
  background: #f7faf9;
  overflow: hidden;
}

.search-form input {
  min-width: 0;
  flex: 1;
  padding: 0 20px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font-size: 13px;
}

.search-form button {
  padding: 0 20px;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.account-actions {
  position: relative;
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 14px;
}

.account-button,
.auth-button {
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.auth-button {
  padding-left: 14px;
  border-left: 1px solid #d9e2e0;
  color: #667b80;
}

.auth-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.logout-error {
  position: absolute;
  top: 30px;
  right: 0;
  width: 250px;
  margin: 0;
  color: var(--color-destructive);
  font-size: 12px;
  text-align: right;
}

.main-nav {
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(34px, 6vw, 76px);
  border-top: 1px solid #edf1f0;
}

.main-nav a {
  color: #40585d;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.detail-main {
  width: min(100% - 64px, 1240px);
  margin: 0 auto;
  padding-bottom: 110px;
}

.breadcrumb {
  min-height: 78px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #899896;
  font-size: 12px;
}

.breadcrumb a {
  color: #617775;
  text-decoration: none;
}

.product-overview {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(360px, 0.7fr);
  gap: clamp(48px, 7vw, 90px);
}

.gallery {
  min-width: 0;
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 16px;
}

.thumbnail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thumbnail-list button {
  width: 82px;
  aspect-ratio: 1;
  padding: 0;
  border: 1px solid transparent;
  background: #eef3f1;
  cursor: pointer;
  overflow: hidden;
}

.thumbnail-list button.is-active {
  border-color: var(--ink);
}

.thumbnail-list img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.main-image {
  aspect-ratio: 4 / 5;
  display: grid;
  place-items: center;
  background: #e6eeec;
  color: rgba(24, 52, 58, 0.35);
  font-family: Georgia, serif;
  font-size: clamp(44px, 6vw, 80px);
  line-height: 0.88;
  text-align: center;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.purchase-info {
  padding-top: 10px;
}

.product-heading > p:first-child,
.section-kicker {
  margin: 0 0 16px;
  color: #71918d;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.17em;
}

.product-heading h1 {
  margin: 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: clamp(32px, 3vw, 44px);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: -0.04em;
}

.product-heading > span {
  margin-top: 8px;
  display: block;
  color: #8a9998;
  font-size: 12px;
}

.short-description {
  margin: 22px 0 0;
  color: #687a7d;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

.price-block {
  margin-top: 35px;
  padding: 28px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.original-price {
  margin: 0 0 6px;
  color: var(--color-muted-foreground);
  font-size: 13px;
  text-decoration: line-through;
}

.price-block > div {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.price-block strong {
  color: #b35c4e;
  font-size: 21px;
}

.price-block b {
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 31px;
  font-weight: 500;
}

.benefit-list {
  margin: 0;
  padding: 22px 0;
  border-bottom: 1px solid var(--line);
}

.benefit-list > div {
  min-height: 34px;
  display: grid;
  grid-template-columns: 90px 1fr;
  align-items: center;
  gap: 18px;
}

.benefit-list dt {
  color: #778986;
  font-size: 12px;
}

.benefit-list dd {
  margin: 0;
  color: #324d51;
  font-size: 12px;
  font-weight: 600;
}

.benefit-list .sold-out {
  color: #a35252;
}

.notice-card {
  margin-top: 22px;
  padding: 17px 18px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #edf3f1;
}

.notice-card span {
  width: 18px;
  height: 18px;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #8ba5a1;
  border-radius: 50%;
  color: #64847f;
  font-family: Georgia, serif;
  font-size: 12px;
}

.notice-card p {
  margin: 0;
  color: #667c79;
  font-size: 12px;
  line-height: 1.6;
}

.inquiry-button {
  height: 52px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ink);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.detail-tabs {
  margin-top: 110px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--line);
}

.detail-tabs a {
  min-height: 62px;
  display: grid;
  place-items: center;
  border-right: 1px solid var(--line);
  color: #506468;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.detail-tabs a:last-child {
  border-right: 0;
}

.detail-section {
  padding: 95px 7%;
  scroll-margin-top: 20px;
}

.detail-section + .detail-section {
  border-top: 1px solid var(--line);
}

.detail-section h2 {
  margin: 0 0 35px;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 30px;
  font-weight: 400;
  letter-spacing: -0.03em;
}

.detail-description,
.empty-description {
  margin: 0;
  color: #52676a;
  font-size: 14px;
  line-height: 2;
  white-space: pre-wrap;
}

.empty-description {
  color: #8a9998;
}

.information-section dl {
  margin: 0;
  border-top: 1px solid #aebcba;
}

.information-section dl > div {
  min-height: 58px;
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  border-bottom: 1px solid var(--line);
}

.information-section dt {
  padding-left: 20px;
  color: #657a7d;
  font-size: 12px;
}

.information-section dd {
  margin: 0;
  color: #314c50;
  font-size: 12px;
}

.notice-section ul {
  margin: 0;
  padding: 28px 32px 28px 50px;
  background: #eef3f1;
  color: #617477;
  font-size: 12px;
  line-height: 2;
}

.state-panel {
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #758886;
}

.loading-mark {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border: 1px solid #a9bcb9;
  border-radius: 50%;
  font-family: Georgia, serif;
  font-size: 25px;
}

.state-panel--error div {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.state-panel--error button,
.state-panel--error a {
  padding: 12px 18px;
  border: 1px solid #9db0ad;
  background: transparent;
  color: var(--ink);
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;
}

.site-footer {
  min-height: 170px;
  padding: 38px max(32px, calc((100% - 1240px) / 2));
  display: grid;
  grid-template-columns: 1fr auto;
  align-content: center;
  align-items: center;
  gap: 12px 40px;
  border-top: 1px solid var(--line);
  background: #eef3f1;
  color: #687b7e;
  font-size: 12px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--ink);
}

.footer-brand strong {
  font-size: 12px;
  letter-spacing: 0.16em;
}

.footer-brand p {
  margin: 5px 0 0;
  color: #8b9b9d;
  font-size: 12px;
  letter-spacing: 0.12em;
}

.copyright {
  grid-column: 2;
  margin: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 900px) {
  .utility-bar {
    padding: 20px 24px;
    grid-template-columns: 1fr auto;
  }

  .search-form {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .product-overview {
    grid-template-columns: 1fr;
  }

  .purchase-info {
    padding-top: 0;
  }
}

@media (max-width: 560px) {
  .utility-bar {
    padding: 18px;
    gap: 18px;
  }

  .brand {
    font-size: 12px;
  }

  .account-button {
    display: none;
  }

  .main-nav {
    padding: 0 14px;
    justify-content: space-between;
    gap: 12px;
  }

  .main-nav a {
    font-size: 12px;
  }

  .detail-main {
    width: calc(100% - 40px);
    padding-bottom: 76px;
  }

  .breadcrumb {
    min-height: 60px;
  }

  .gallery {
    display: flex;
    flex-direction: column-reverse;
  }

  .thumbnail-list {
    flex-direction: row;
    overflow-x: auto;
  }

  .thumbnail-list button {
    width: 66px;
    flex: 0 0 66px;
  }

  .product-heading h1 {
    font-size: 31px;
  }

  .detail-tabs {
    margin-top: 76px;
  }

  .detail-tabs a {
    min-height: 54px;
    font-size: 12px;
  }

  .detail-section {
    padding: 72px 0;
  }

  .detail-section h2 {
    font-size: 27px;
  }

  .information-section dl > div {
    grid-template-columns: 110px 1fr;
  }

  .site-footer {
    padding: 34px 20px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
}

.search-form:focus-within { outline: 3px solid var(--color-ring); outline-offset: 3px; }
.account-button, .auth-button, .main-nav a { min-height: 44px; display: inline-flex; align-items: center; }
.main-image, .detail-section { border-radius: var(--radius-card); }
</style>
