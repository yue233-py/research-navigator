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
        { 
          name: '必应搜索', 
          url: 'https://www.bing.com', 
          icon: '🔍',
          faviconUrl: null,
          showIcon: false,
          isLoading: false
        },
        { 
          name: '谷歌学术', 
          url: 'https://scholar.google.com', 
          icon: '🎓',
          faviconUrl: null,
          showIcon: false,
          isLoading: false
        },
        { 
          name: 'X-MOL学术', 
          url: 'https://www.x-mol.com', 
          icon: '🧪',
          faviconUrl: null,
          showIcon: false,
          isLoading: false
        },
        { 
          name: '知网', 
          url: 'https://www.cnki.net', 
          icon: '📖',
          faviconUrl: null,
          showIcon: false,
          isLoading: false
        },
        { 
          name: 'Github', 
          url: 'https://github.com', 
          icon: '💻',
          faviconUrl: null,
          showIcon: false,
          isLoading: false
        },
        { 
          name: '专利检索', 
          url: 'https://www.soopat.com', 
          icon: '⚖️',
          faviconUrl: null,
          showIcon: false,
          isLoading: false
        },
        { 
          name: '纬度学术', 
          url: 'https://sso.hnlat.com/', 
          icon: '🧪',
          faviconUrl: null,
          showIcon: false,
          isLoading: false
        }
      ]
    }
  },
  mounted() {
    this.loadAllFavicons();
  },
  methods: {
    async loadAllFavicons() {
      // 并发加载所有图标，提升速度
      const loadPromises = this.navItems.map((item, index) => 
        this.loadFavicon(index)
      );
      
      await Promise.all(loadPromises);
    },
    
    async loadFavicon(index) {
      const item = this.navItems[index];
      if (!item.url) return;
      
      try {
        const domain = new URL(item.url).hostname;
        
        // 1. 检查缓存
        const cachedIcon = this.getCachedIcon(domain);
        if (cachedIcon) {
          this.$set(this.navItems[index], 'faviconUrl', cachedIcon);
          this.$set(this.navItems[index], 'showIcon', true);
          return;
        }
        
        // 2. 检查预设图标
        const presetIcon = this.getPresetIcon(domain);
        if (presetIcon) {
          this.$set(this.navItems[index], 'faviconUrl', presetIcon);
          this.$set(this.navItems[index], 'showIcon', true);
          this.cacheIcon(domain, presetIcon, 'preset');
          return;
        }
        
        // 3. 网络获取
        this.$set(this.navItems[index], 'isLoading', true);
        
        // 优先使用Google服务
        const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=24`;
        const isGoogleValid = await this.testImageUrl(googleUrl, 2000);
        
        if (isGoogleValid) {
          this.$set(this.navItems[index], 'faviconUrl', googleUrl);
          this.$set(this.navItems[index], 'showIcon', true);
          this.cacheIcon(domain, googleUrl, 'google');
        } else {
          // 备用：Icon.horse
          const iconhorseUrl = `https://icon.horse/icon/${domain}?size=24`;
          const isIconhorseValid = await this.testImageUrl(iconhorseUrl, 3000);
          
          if (isIconhorseValid) {
            this.$set(this.navItems[index], 'faviconUrl', iconhorseUrl);
            this.$set(this.navItems[index], 'showIcon', true);
            this.cacheIcon(domain, iconhorseUrl, 'iconhorse');
          }
        }
        
        this.$set(this.navItems[index], 'isLoading', false);
        
      } catch (error) {
        console.warn(`Failed to load favicon for ${item.name}:`, error);
        this.$set(this.navItems[index], 'isLoading', false);
      }
    },
    
    // 测试图片URL是否有效
    testImageUrl(url, timeout = 2000) {
      return new Promise((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => resolve(false), timeout);
        
        img.onload = () => {
          clearTimeout(timer);
          resolve(img.naturalWidth > 8 && img.naturalHeight > 8);
        };
        
        img.onerror = () => {
          clearTimeout(timer);
          resolve(false);
        };
        
        img.src = url;
      });
    },
    
    // 获取缓存图标
    getCachedIcon(domain) {
      try {
        const cached = localStorage.getItem(`nav_favicon_${domain}`);
        if (cached) {
          const { url, timestamp, source } = JSON.parse(cached);
          const now = Date.now();
          
          // 导航栏图标缓存时间更长（7天）
          const cacheTime = 7 * 24 * 60 * 60 * 1000;
          
          if (now - timestamp < cacheTime) {
            return url;
          } else {
            localStorage.removeItem(`nav_favicon_${domain}`);
          }
        }
      } catch (error) {
        // 忽略缓存错误
      }
      return null;
    },
    
    // 缓存图标
    cacheIcon(domain, url, source = 'network') {
      try {
        localStorage.setItem(`nav_favicon_${domain}`, JSON.stringify({
          url,
          timestamp: Date.now(),
          source,
          domain
        }));
      } catch (error) {
        // 忽略缓存错误
      }
    },
    
    // 预设图标库
    getPresetIcon(domain) {
      const presetIcons = {
        // 搜索引擎
        'www.bing.com': 'https://www.google.com/s2/favicons?domain=bing.com&sz=24',
        'scholar.google.com': 'https://www.google.com/s2/favicons?domain=scholar.google.com&sz=24',
        
        // 学术平台
        'www.x-mol.com': 'https://www.google.com/s2/favicons?domain=x-mol.com&sz=24',
        'www.cnki.net': 'https://www.google.com/s2/favicons?domain=cnki.net&sz=24',
        'sso.hnlat.com': 'https://www.google.com/s2/favicons?domain=hnlat.com&sz=24',
        
        // 开发工具
        'github.com': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJ6SURBVEiJtZU9aBRBFMd/M5vNJpvNx2aj0VitNhaChWBhYWFhIQiCYGVhYWGxsLGwsLBQsLGwsLBQG1sLCwsLwcJCG2uxsLGwUBsLCwsLtbGwsLBQsLGwsLGwsLBQsLGwsLGwsLGwsP8bM5mdmdmd9+a9NwswDMMwDMMwDMMwjP8VSimllFLqf6WUUkoppZRSSimllFJKKaWUUkop9b8ipZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKfW/IqWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSin1vyKllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkr9r0gppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSiml1P+KlFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkop9b8ipZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSiml1P+KlFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSin1vyL/AJzDq6hm0t8tAAAAAElFTkSuQmCC',
        
        // 专利
        'www.soopat.com': 'https://www.google.com/s2/favicons?domain=soopat.com&sz=24'
      };
      
      return presetIcons[domain] || presetIcons[domain.replace('www.', '')] || 
             presetIcons['www.' + domain];
    },
    
    handleFaviconError(index) {
      this.$set(this.navItems[index], 'showIcon', false);
      this.$set(this.navItems[index], 'isLoading', false);
      
      // 从缓存中移除失效图标
      try {
        const domain = new URL(this.navItems[index].url).hostname;
        localStorage.removeItem(`nav_favicon_${domain}`);
      } catch (error) {
        // 忽略错误
      }
    },
    
    handleFaviconLoad(index) {
      this.$set(this.navItems[index], 'showIcon', true);
      this.$set(this.navItems[index], 'isLoading', false);
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