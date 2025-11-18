<template>
  <div class="footer-notice" aria-hidden="false">
    <div class="notice-inner">
      <span>湘ICP备00000000号-0 | 湘公网安备 43000000000000号</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterNotice'
}
</script>

<style scoped>
.footer-notice {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 8px; /* slight inset from bottom */
  display: flex;
  justify-content: center;
  pointer-events: none; /* avoid intercepting clicks */
  z-index: 9999;
}

.notice-inner {
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(4px);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px; /* small font */
  color: #334155;
  box-shadow: 0 1px 4px rgba(16,24,40,0.06);
  pointer-events: auto; /* allow selection if needed */
  max-width: calc(100% - 40px);
  text-align: center;
}

@media (max-width: 480px) {
  .notice-inner {
    font-size: 10px;
    padding: 3px 6px;
  }
}
</style>
