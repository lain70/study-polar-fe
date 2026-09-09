<template>
  <div class="shop-page">
    <site-header />

    <main>
      <section class="hero-section">
        <div class="hero-shade"></div>
        <div class="hero-content">
          <p class="eyebrow">WELCOME · POLAR BEAR SHOP</p>
          <h1>polar bear shop에<br>오신걸 환영합니다.</h1>
          <p>
            캠핑, 트레킹, 낚시를 위한 믿음직한 아웃도어 장비를 만나보세요.
          </p>
          <a class="hero-link" href="#best-items">추천 상품 보기</a>
        </div>
      </section>

      <section id="new-arrivals" class="category-section content-section">
        <div class="section-heading">
          <div>
            <p class="section-kicker">SHOP BY CATEGORY</p>
            <h2>오늘은 무엇을 찾으세요?</h2>
          </div>
          <span>POLAR BEAR SHOP 큐레이션</span>
        </div>

        <div class="category-grid">
          <a href="#best-items" class="category-card category-card--camping">
            <span>01</span>
            <strong>CAMPING</strong>
            <p>텐트부터 취사와 수납까지 캠핑의 모든 순간</p>
          </a>
          <a href="#best-items" class="category-card category-card--trekking">
            <span>02</span>
            <strong>TREKKING</strong>
            <p>가방, 등산화와 안전 장비로 완성하는 산행</p>
          </a>
          <a href="#best-items" class="category-card category-card--fishing">
            <span>03</span>
            <strong>FISHING</strong>
            <p>민물과 바다를 아우르는 낚시 장비와 소품</p>
          </a>
          <a href="#best-items" class="category-card category-card--water">
            <span>04</span>
            <strong>WATER</strong>
            <p>카약, SUP와 해양 활동을 위한 안전한 선택</p>
          </a>
          <a href="#best-items" class="category-card category-card--travel">
            <span>05</span>
            <strong>TRAVEL</strong>
            <p>피크닉과 여행을 더 가볍고 여유롭게</p>
          </a>
          <a href="#best-items" class="category-card category-card--wear">
            <span>06</span>
            <strong>OUTDOOR WEAR</strong>
            <p>날씨 변화에 대비하는 의류, 신발과 방한용품</p>
          </a>
        </div>
      </section>

      <section id="best-items" class="goods-section content-section">
        <div class="section-heading">
          <div>
            <p class="section-kicker">CUSTOMER'S PICK</p>
            <h2>지금 만나볼 수 있는 상품</h2>
          </div>
          <span>판매중 · 품절 상품</span>
        </div>

        <p v-if="isLoadingGoods" class="goods-message">상품을 불러오는 중입니다.</p>
        <p v-else-if="goodsError" class="goods-message goods-message--error" role="alert">{{ goodsError }}</p>
        <div v-else-if="goods.length" class="goods-grid" aria-label="판매 상품">
          <article v-for="goods in goods" :key="goods.goodsNo" class="goods-card">
            <router-link class="goods-card-link" :to="{ name: 'goodsDetail', params: { goodsNo: goods.goodsNo } }">
              <div class="goods-image">
                <img v-if="goods.representativeImageUrl" :src="imageUrl(goods.representativeImageUrl)" :alt="goods.goodsNameKo">
                <span v-else>POLAR<br>BEAR</span>
              </div>
              <p class="goods-category">{{ goods.brandNameKo || 'POLAR BEAR' }} · {{ goods.categoryName }}</p>
              <h3>{{ goods.goodsNameKo }}</h3>
              <p v-if="goods.goodsNameEn" class="goods-name-en">{{ goods.goodsNameEn }}</p>
              <div class="goods-price">
                <strong>{{ currency(goods.discountPrice == null ? goods.salePrice : goods.discountPrice) }}</strong>
                <del v-if="hasDiscount(goods)">{{ currency(goods.salePrice) }}</del>
              </div>
              <p class="goods-status" :class="{ 'goods-status--sold-out': goods.goodsStatus === 'SOLD_OUT' }">{{ goods.goodsStatus === 'SOLD_OUT' ? '품절' : '판매중' }}</p>
            </router-link>
          </article>
        </div>
        <p v-else class="goods-message">현재 판매중인 상품이 없습니다.</p>
      </section>

      <section class="support-banner">
        <div>
          <p class="section-kicker">MEMBER SUPPORT</p>
          <h2>도움이 필요하신가요?</h2>
          <p>상품과 주문에 관한 궁금한 점을 문의해 주세요.</p>
        </div>
        <router-link to="/csr">문의하기</router-link>
      </section>
    </main>

    <site-footer />
  </div>
</template>

<script>
import { getFeaturedGoods } from '@/api/goods'
import envs from '@/envs'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'

export default {
  name: 'MainView',
  components: { SiteHeader, SiteFooter },
  data () {
    return {
      goods: [],
      isLoadingGoods: false,
      goodsError: ''
    }
  },
  created () {
    this.loadGoods()
  },
  methods: {
    loadGoods () {
      this.isLoadingGoods = true
      this.goodsError = ''
      getFeaturedGoods()
        .then(({ data }) => {
          this.goods = data
        })
        .catch(() => {
          this.goodsError = '상품을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
        })
        .finally(() => {
          this.isLoadingGoods = false
        })
    },
    imageUrl (path) {
      return `${envs.apiBaseUrl.replace(/\/api$/, '')}${path}`
    },
    currency (value) {
      return `${Number(value || 0).toLocaleString('ko-KR')}원`
    },
    hasDiscount (goods) {
      return goods.discountPrice != null && Number(goods.discountPrice) < Number(goods.salePrice)
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-page {
  --ink: #18343a;
  --muted: #6f8083;
  --line: #dce5e3;
  min-height: 100vh;
  background: #f8faf9;
  color: var(--ink);
  text-align: left;
}

.hero-section {
  position: relative;
  min-height: 560px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #47666b url('../assets/images/bg_login.png') center 42% / cover no-repeat;
  color: #fff;
}

.hero-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(14, 42, 47, 0.88) 0%, rgba(22, 54, 59, 0.57) 48%, rgba(20, 45, 49, 0.08) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  width: min(100% - 64px, 1240px);
  margin: 0 auto;
}

.eyebrow,
.section-kicker {
  margin: 0 0 15px;
  color: #82aaa4;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.2em;
}

.eyebrow {
  color: #c4dcda;
}

.hero-content h1 {
  margin: 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: clamp(44px, 5vw, 70px);
  font-weight: 400;
  line-height: 1.18;
  letter-spacing: -0.05em;
}

.hero-content > p:not(.eyebrow) {
  margin: 24px 0 30px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
}

.hero-link {
  display: inline-flex;
  height: 46px;
  padding: 0 24px;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.68);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.content-section {
  max-width: 1240px;
  margin: 0 auto;
  padding: 100px 32px 0;
}

.section-heading {
  margin-bottom: 30px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.section-heading h2,
.support-banner h2 {
  margin: 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 31px;
  font-weight: 400;
  letter-spacing: -0.035em;
}

.section-heading > span {
  color: #879597;
  font-size: 11px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.category-card {
  min-height: 210px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: var(--ink);
  text-decoration: none;
  transition: transform 0.2s;
}

.category-card:hover {
  transform: translateY(-3px);
}

.category-card--camping {
  background: #dceae7;
}

.category-card--trekking {
  background: #ece6d9;
}

.category-card--fishing {
  background: #d9e0e3;
}

.category-card--water {
  background: #dbe8ed;
}

.category-card--travel {
  background: #e7e2d8;
}

.category-card--wear {
  background: #dfe5dc;
}

.category-card span {
  margin-bottom: auto;
  color: rgba(24, 52, 58, 0.5);
  font-size: 10px;
}

.category-card strong {
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
  letter-spacing: 0.05em;
}

.category-card p {
  margin: 9px 0 0;
  color: #64777a;
  font-size: 12px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.goods-card {
  min-width: 0;
}

.goods-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.goods-card-link:focus-visible {
  outline: 2px solid #4d827b;
  outline-offset: 5px;
}

.goods-image {
  aspect-ratio: 4 / 5;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.75);
  font-family: Georgia, serif;
  font-size: clamp(24px, 3vw, 40px);
  line-height: 0.9;
  text-align: center;
  background: #e5edeb;
  overflow: hidden;
}

.goods-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.goods-card-link:hover .goods-image img {
  transform: scale(1.025);
}

.goods-category {
  margin: 16px 0 6px;
  color: #7b9290;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.goods-card h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.goods-name-en {
  min-height: 28px;
  margin: 5px 0 0;
  color: #879694;
  font-size: 10px;
  line-height: 1.4;
}

.goods-price {
  margin-top: 12px;
  display: flex;
  align-items: baseline;
  gap: 7px;
}

.goods-price strong {
  font-size: 14px;
}

.goods-price del {
  color: #9ba8a7;
  font-size: 10px;
}

.goods-status {
  margin: 10px 0 0;
  color: #97a4a5;
  font-size: 10px;
  letter-spacing: 0.12em;
}

.goods-status--sold-out {
  color: #a35252;
}

.goods-message {
  padding: 48px 0;
  color: #7d8f8d;
  text-align: center;
}

.goods-message--error {
  color: #b14949;
}

.support-banner {
  max-width: 1176px;
  margin: 110px auto;
  padding: 48px 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  background: var(--ink);
  color: #fff;
}

.support-banner > div > p:last-child {
  margin: 13px 0 0;
  color: #b8c9c7;
  font-size: 13px;
}

.support-banner a {
  padding: 14px 28px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
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
  .hero-section {
    min-height: 500px;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .category-card {
    min-height: 160px;
  }

  .goods-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .support-banner {
    margin: 90px 24px;
  }
}

@media (max-width: 560px) {
  .hero-section {
    min-height: 430px;
  }

  .hero-content {
    width: calc(100% - 40px);
  }

  .hero-content h1 {
    font-size: 38px;
  }

  .content-section {
    padding: 76px 20px 0;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .section-heading h2,
  .support-banner h2 {
    font-size: 27px;
  }

  .goods-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px 12px;
  }

  .support-banner {
    margin: 76px 20px;
    padding: 36px 28px;
    align-items: flex-start;
    flex-direction: column;
  }

}
</style>
