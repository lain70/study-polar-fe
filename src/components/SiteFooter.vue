<template>
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
</template>

<script>
export default { name: 'SiteFooter' }
</script>

<style lang="scss" scoped>
.site-footer { max-width: 1240px; margin: 100px auto 0; padding: 42px 32px 54px; display: flex; align-items: flex-end; justify-content: space-between; gap: 30px; border-top: 1px solid #dce5e3; color: #718182; font-size: 11px; }
.footer-brand { display: flex; align-items: center; gap: 11px; color: #18343a; } .brand-mark { width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid #9ab2ae; border-radius: 50%; font: 19px Georgia, serif; }
.footer-brand strong { display: block; color: #18343a; font-size: 11px; letter-spacing: .12em; } .footer-brand p { margin: 6px 0 0; color: #9aa8a7; font-size: 9px; letter-spacing: .12em; } .copyright { color: #a2adaa; }
@media(max-width:800px){.site-footer{align-items:flex-start;flex-direction:column}}
</style>
