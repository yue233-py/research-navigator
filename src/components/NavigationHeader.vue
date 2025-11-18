<template>
  <div class="navigation-header">
    <div class="nav-items">
      <a 
        v-for="(item, index) in navItems" 
        :key="item.name"
        :href="item.url"
        target="_blank"
        class="nav-item"
      >
        <span class="nav-icon">
          <!-- 优先显示图标，失败则显示URL -->
          <img 
            v-if="item.faviconUrl" 
            :src="item.faviconUrl" 
            :alt="item.name"
            @error="handleFaviconError(item)"
            class="favicon-img"
          />
          <span v-else>{{ item.url }}</span>
        </span>
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
        { 
          name: '必应搜索', 
          url: 'https://www.bing.com', 
          icon: '🔍',
          faviconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSLSwJEotYQqJQu1mpY6-wwWqRi2GE5Sf7Q&s'
        },
        { 
          name: '谷歌学术', 
          url: 'https://scholar.google.com', 
          icon: '🎓',
          faviconUrl: 'https://www.google.com/s2/favicons?domain=scholar.google.com&sz=16'
        },
        { 
          name: 'X-MOL学术', 
          url: 'https://www.x-mol.com', 
          icon: '🧪',
          faviconUrl: 'https://www.google.com/s2/favicons?domain=x-mol.com&sz=16'
        },
        { 
          name: '知网', 
          url: 'https://www.cnki.net', 
          icon: '📖',
          faviconUrl: 'https://img.ixintu.com/download/jpg/20200805/d52939d4459459805154da5eb3ba926d_512_512.jpg!bg'
        },
        { 
          name: 'Github', 
          url: 'https://github.com', 
          icon: '💻',
          faviconUrl: 'https://www.google.com/s2/favicons?domain=github.com&sz=16'
        },
        { 
          name: '专利检索', 
          url: 'https://tysf.cponline.cnipa.gov.cn/am/#/user/login', 
          icon: '⚖️',
          faviconUrl: 'https://www.google.com/s2/favicons?domain=tysf.cponline.cnipa.gov.cn&sz=16'
        },
        { 
          name: '纬度学术', 
          url: 'https://spis.hnlat.com/', 
          icon: '🧪',
          faviconUrl: 'https://zhengxin-pub.cdn.bcebos.com/logopic/0e7c08a9c4bb8f7594d6e11f16edd97c_fullsize.jpg'
        }
      ]
    }
  },
  methods: {
    handleFaviconError(item) {
      // 如果图标加载失败，使用URL代替
      item.faviconUrl = null;
    }
  }
}
</script>

<style scoped>
.navigation-header {
  margin-bottom: 20px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 14px;
}

.favicon-img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  border-radius: 2px;
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
    width: 14px;
    height: 14px;
    font-size: 12px;
  }
  
  .favicon-img {
    width: 14px;
    height: 14px;
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
