<template>
  <div class="footer-notice">
    <div class="notice-inner">
      <a 
        class="beian-link" 
        href="https://beian.miit.gov.cn/" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="工信部备案查询"
      >
        粤ICP备2025473557号
      </a>
      <span class="sep">|</span>
      <span class="order">备案订单号：175568880767020328</span>
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
  width: 100%;
  padding: 20px 0 16px;
  text-align: center;
  margin-top: 60px;
}

.notice-inner {
  font-size: 13px;
  color: rgba(100, 116, 139, 0.4); /* 非常淡的灰色 */
  line-height: 1.5;
  letter-spacing: 0.3px;
}

.beian-link {
  color: rgba(100, 116, 139, 0.45);
  text-decoration: none;
  transition: all 0.3s ease;
}

.beian-link:hover {
  color: rgba(100, 116, 139, 0.7);
  text-decoration: none;
}

.beian-link:focus-visible {
  outline: 1px solid rgba(59, 130, 246, 0.3);
  outline-offset: 2px;
  border-radius: 2px;
}

.sep {
  margin: 0 8px;
  color: rgba(100, 116, 139, 0.3);
}

.order {
  color: rgba(100, 116, 139, 0.35);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .footer-notice {
    padding: 16px 0 12px;
    margin-top: 40px;
  }
  
  .notice-inner {
    font-size: 12px;
    padding: 0 16px;
  }
  
  .sep {
    margin: 0 6px;
  }
}

/* 超小屏幕：换行显示 */
@media (max-width: 480px) {
  .notice-inner {
    font-size: 9px;
    line-height: 1.6;
  }
  
  .sep {
    display: block;
    margin: 2px 0;
    opacity: 0;
    height: 0;
  }
  
  .order {
    display: block;
    margin-top: 2px;
  }
}
</style>