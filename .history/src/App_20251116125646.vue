<template>
  <div id="app">
    <!-- 加载动画 -->
    <LoadingOverlay 
      :is-visible="pageLoader.isLoading.value"
      :loading-text="pageLoader.loadingText.value"
      :progress="pageLoader.progress.value"
    />
    
    <!-- 背景 -->
    <div class="background"></div>
    
    <!-- 右上角时间地点组件 -->
    <TimeLocationWidget />
    
    <!-- 主要内容 -->
    <div class="container">
      <!-- 标题 -->
      <header class="header">
        <h1 style="color: black; opacity: 0.4;">个人自由导航平台</h1>
        <p class="subtitle">Research Navigation Platform</p>
      </header>

      <!-- 顶部导航 -->
      <NavigationHeader />

      <!-- 搜索框 -->
      <SearchBox />

      <!-- 工具分类区域 -->
      <div class="content">
        <CategorySection 
          v-for="category in categories" 
          :key="category.id"
          :category="category"
        />
      </div>
    </div>
    <FooterNotice />
  </div>
</template>

<script>
import NavigationHeader from './components/NavigationHeader.vue'
import SearchBox from './components/SearchBox.vue'
import CategorySection from './components/CategorySection.vue'
import TimeLocationWidget from './components/TimeLocationWidget.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import FooterNotice from './components/FooterNotice.vue'
import { navigationData } from './data/navigationData.js'
import { usePageLoader } from './composables/usePageLoader.js'

export default {
  name: 'App',
  components: {
    NavigationHeader,
    SearchBox,
    CategorySection,
    TimeLocationWidget
    ,FooterNotice
  },
  data() {
    return {
      categories: navigationData
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  color: #333;
}
/* 适用于 Chrome, Safari, 新版 Edge 等 Webkit 内核的浏览器 */
body::-webkit-scrollbar {
  display: none;
}
#app {
  min-height: 100vh;
  position: relative;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(240, 242, 245, 0.3), rgba(250, 251, 252, 0.85)),
    url('./assets/image/background-image.png');
  background-size: cover, cover;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
  z-index: -1;
}


.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding-top: 30px;
}

.header h1 {
  color: #1a2332;
  font-size: 2.2rem;
  font-weight: 500;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.content {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .container {
    padding: 15px;
  }
}
</style>
/* Footer adjustments: ensure page content doesn't get hidden by fixed notice */
@media (max-width: 768px) {
  .container {
    padding-bottom: 52px; /* leave space on small screens */
  }
}