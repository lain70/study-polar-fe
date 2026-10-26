<template>
  <div class="application-shell">
    <router-view/>
  </div>
</template>

<style lang="stylus">
html,
body
  margin 0
  min-height 100%

body
  background var(--color-background)

#app
  font-family var(--font-body)
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  min-height 100vh
</style>
