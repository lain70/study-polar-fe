<template>
  <div class="event-page">
    <header>
      <router-link class="brand" :to="{ name: 'main' }">POLAR BEAR SHOP</router-link>
      <nav aria-label="주요 메뉴">
        <router-link :to="{ name: 'main' }">홈</router-link>
        <router-link :to="{ name: 'main', hash: '#new-arrivals' }">신상품</router-link>
        <router-link :to="{ name: 'main', hash: '#best-items' }">베스트</router-link>
        <router-link :to="{ name: 'eventList' }">이벤트</router-link>
      </nav>
    </header>
    <main>
      <p class="eyebrow">POLAR BEAR EVENT</p>
      <h1>이벤트</h1>
      <p v-if="isLoading" class="message">이벤트를 불러오는 중입니다.</p>
      <p v-else-if="errorMessage" class="message error" role="alert">{{ errorMessage }}</p>
      <div v-else-if="events.length" class="event-grid">
        <article v-for="event in events" :key="event.eventNo">
          <div class="image">
            <img v-if="event.mainImageUrl" :src="imageUrl(event.mainImageUrl)" :alt="event.eventTitle">
            <span v-else>POLAR BEAR EVENT</span>
            <strong :class="{ ended: event.progressStatus === 'ENDED' }">{{ statusLabel(event.progressStatus) }}</strong>
          </div>
          <h2>{{ event.eventTitle }}</h2>
          <p>{{ date(event.eventStartDate) }} ~ {{ date(event.eventEndDate) }}</p>
        </article>
      </div>
      <p v-else class="message">현재 표시할 이벤트가 없습니다.</p>
    </main>
  </div>
</template>

<script>
import { getEvents } from '@/api/events'
import envs from '@/envs'

export default {
  name: 'EventListView',
  data: () => ({ events: [], isLoading: false, errorMessage: '' }),
  created () {
    this.isLoading = true
    getEvents()
      .then(({ data }) => { this.events = data })
      .catch(() => { this.errorMessage = '이벤트를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.' })
      .finally(() => { this.isLoading = false })
  },
  methods: {
    imageUrl (path) { return /^https?:\/\//.test(path) ? path : `${envs.apiBaseUrl.replace(/\/api$/, '')}${path}` },
    statusLabel (status) { return status === 'ENDED' ? '종료' : '진행중' },
    date (value) { return value ? value.slice(0, 10).replace(/-/g, '.') : '-' }
  }
}
</script>

<style lang="scss" scoped>
.event-page { min-height: 100vh; background: #f8faf9; color: #18343a; text-align: left; }
header { padding: 30px max(32px, calc((100% - 1180px) / 2)); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #dce5e3; background: #fff; }
.brand { color: #18343a; font-size: 12px; font-weight: 800; letter-spacing: .16em; text-decoration: none; }
nav { display: flex; gap: 28px; } nav a { color: #526c68; font-size: 13px; text-decoration: none; } nav a.router-link-active { color: #18343a; font-weight: 700; }
main { max-width: 1180px; margin: 0 auto; padding: 72px 32px 100px; }
.eyebrow { color: #78908c; font-size: 11px; font-weight: 800; letter-spacing: .16em; } h1 { margin: 8px 0 42px; font: 400 42px Georgia, serif; }
.event-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 34px 22px; } article { min-width: 0; }
.image { height: 250px; position: relative; display: grid; place-items: center; overflow: hidden; background: #e6eeec; color: #78908c; font-size: 11px; letter-spacing: .12em; }
.image img { width: 100%; height: 100%; object-fit: cover; } .image strong { position: absolute; top: 14px; right: 14px; padding: 7px 10px; background: #18343a; color: #fff; font-size: 11px; } .image strong.ended { background: #7c8987; }
article h2 { margin: 18px 0 9px; font-size: 18px; } article p { margin: 0; color: #71827f; font-size: 13px; } .message { padding: 60px 0; text-align: center; } .error { color: #b14949; }
@media(max-width:800px){header{align-items:flex-start;gap:20px;flex-direction:column}nav{gap:16px;flex-wrap:wrap}.event-grid{grid-template-columns:1fr}.image{height:220px}}
</style>
