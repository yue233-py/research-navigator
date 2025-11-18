<template>
  <div class="navigation-header">
    <div class="nav-items">
      <a 
        v-for="item in navItems" 
        :key="item.name"
        :href="item.url"
        target="_blank"
        class="nav-item"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-text">{{ item.name }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationHeader',
  data() {
    return {
      navItems: [
        { name: '必应搜索', url: 'https://www.bing.com', icon: '🔍' },
        { name: '谷歌学术', url: 'https://scholar.google.com', icon: '🎓' },
        { name: 'X-MOL学术', url: 'https://www.x-mol.com', icon: '🧪' },
        { name: '知网', url: 'https://www.cnki.net', icon: '📖' },
        { name: 'Github', url: 'https://github.com', icon: '💻' },
        { name: '专利检索', url: 'https://www.soopat.com', icon: '⚖️' },
         { name: '纬度学术', url: 'https://sso.hnlat.com/', icon: '🧪' },
       
      ]
    }
  }
}
</script>

<style scoped>
.navigation-header {
  margin-bottom: 25px;
}

.nav-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.65);
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 400;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(203, 213, 224, 0.8);
}

.nav-icon {
  font-size: 14px;
  opacity: 0.8;
}

.nav-text {
  white-space: nowrap;
  color: #1f2937;
}

@media (max-width: 768px) {
  .nav-items {
    gap: 8px;
  }
  
  .nav-item {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .nav-icon {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .nav-items {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .nav-item {
    flex-shrink: 0;
  }
}
</style>