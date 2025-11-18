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
  bottom: 12px; /* slight inset from bottom */
  display: flex;
  justify-content: center;
  pointer-events: none; /* avoid intercepting clicks */
  z-index: 10000; /* make sure it's above other elements */
}

.notice-inner {
  background: rgba(255,255,255,0.92); /* more visible on light backgrounds */
  backdrop-filter: blur(4px);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px; /* small font */
  color: #0f172a; /* darker text for contrast */
  box-shadow: 0 2px 8px rgba(16,24,40,0.12);
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
