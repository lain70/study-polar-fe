<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <template v-if="name === 'user'">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" />
    </template>
    <template v-else-if="name === 'cart'">
      <path d="M3 3h2l2.5 12h11L21 7H6" />
      <circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" />
    </template>
    <template v-else-if="name === 'orders'">
      <path d="m12 3 9 5-9 5-9-5 9-5Z M3 8v9l9 5 9-5V8 M12 13v9 M7.5 5.5l9 5" />
    </template>
    <path v-else d="m9 5 7 7-7 7" />
  </svg>
</template>

<script>
export default {
  name: 'AccountIcon',
  props: { name: { type: String, default: 'user' } }
}
</script>
