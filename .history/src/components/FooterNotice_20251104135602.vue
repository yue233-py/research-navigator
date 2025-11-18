<template>
  <div class="footer-notice" aria-hidden="false">
    <div class="notice-inner">
        <span>
          <a class="beian-link" href="http://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" aria-label="工信部备案查询">粤ICP备2025473557号</a>
          <span class="sep">&nbsp;|&nbsp;</span>
          <span class="order">备案订单号：175568880767020328（已通过省通信管理局审核）</span>
        </span>
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
