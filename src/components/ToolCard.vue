```vue
<template>
  <div class="tool-card" @click="openTool" @contextmenu="handleRightClick">
    <div class="tool-icon-wrapper">
      <div class="tool-icon">
        <img 
          v-if="currentIconUrl && showIcon" 
          :src="currentIconUrl" 
          :alt="tool.name"
          @error="handleFaviconError"
          @load="handleFaviconLoad"
          class="favicon-img"
        />
        <div v-else-if="isLoading" class="loading-indicator">⟳</div>
        <span v-else class="emoji-fallback">{{ tool.icon }}</span>
      </div>
    </div>
    
    <div class="tool-info">
      <h3 class="tool-name">{{ tool.name }}</h3>
      <p class="tool-description" v-if="tool.description">{{ tool.description }}</p>
    </div>
    
    <div v-if="showDebug" class="debug-info" @click.stop>
      <div>缓存: {{ hasCached ? '✅' : '❌' }}</div>
      <div>状态: {{ loadingStatus }}</div>
      <div v-if="errorDetails">错误: {{ errorDetails }}</div>
      <button @click="refreshIcon" class="refresh-btn">🔄</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToolCard',
  props: {
    tool: {
      type: Object,
      required: true
    },
    showDebug: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentIconUrl: null,
      showIcon: false,
      isLoading: false,
      loadingStatus: '未开始',
      hasCached: false,
      domain: '',
      errorDetails: ''
    }
  },
  mounted() {
    this.initializeIcon();
  },
  methods: {
    async initializeIcon() {
      if (!this.tool.url) {
        this.loadingStatus = '无URL';
        return;
      }
      
      try {
        const url = new URL(this.tool.url);
        this.domain = url.hostname;
      } catch (error) {
        this.loadingStatus = 'URL解析失败';
        this.errorDetails = error.message;
        return;
      }
      
      // 检查 tool.icon 是否为有效 URL
      if (this.tool.icon && /^https?:\/\//i.test(this.tool.icon)) {
        const isValid = await this.testImageUrl(this.tool.icon, 3000);
        if (isValid) {
          this.currentIconUrl = this.tool.icon;
          this.showIcon = true;
          this.loadingStatus = '使用自定义图标URL';
          this.cacheIcon(this.domain, this.tool.icon); // 缓存自定义图标
          return;
        } else {
          this.errorDetails = `自定义图标URL无效: ${this.tool.icon}`;
          console.warn(`自定义图标URL无效: ${this.tool.icon}`);
        }
      }
      
      // 1. 检查预设图标库
      const presetIcon = this.getPresetIcon(this.domain);
      if (presetIcon) {
        this.currentIconUrl = presetIcon;
        this.showIcon = true;
        this.loadingStatus = '使用预设图标';
        return;
      }
      
      // 2. 检查浏览器缓存
      const cachedIcon = this.getCachedIcon(this.domain);
      if (cachedIcon) {
        this.currentIconUrl = cachedIcon;
        this.showIcon = true;
        this.hasCached = true;
        this.loadingStatus = '使用缓存';
        return;
      }
      
      // 3. 尝试网络获取
      this.loadFromNetwork();
    },
    
    // 以下方法保持不变
    openTool() {
      if (this.tool.url) {
        window.open(this.tool.url, '_blank');
      }
    },
    
    handleRightClick(e) {
      if (this.showDebug) {
        e.preventDefault();
        this.refreshIcon();
      }
    },
    
    async loadFromNetwork() {
      this.isLoading = true;
      this.loadingStatus = '网络获取中';
      
      const origin = `https://${this.domain}`;
      const faviconUrls = [
        { url: `https://www.google.com/s2/favicons?domain=${this.domain}&sz=32`, retry: false },
        { url: `https://icon.horse/icon/${this.domain}`, retry: false },
        { url: `https://logo.clearbit.com/${this.domain}`, retry: false },
        { url: async () => await this.fetchIconFromHtml(this.tool.url), retry: false },
        { url: `${origin}/favicon.ico`, retry: true }
      ];
      
      for (const source of faviconUrls) {
        let iconUrl = typeof source.url === 'function' ? await source.url() : source.url;
        if (iconUrl) {
          const isValid = await this.testImageUrl(iconUrl, 3000, source.retry);
          if (isValid) {
            this.currentIconUrl = iconUrl;
            this.cacheIcon(this.domain, iconUrl);
            this.showIcon = true;
            this.loadingStatus = `图标来自 ${iconUrl}`;
            this.isLoading = false;
            return;
          } else {
            this.errorDetails = `无法加载 ${this.domain}: ${iconUrl}`;
            console.warn(`无法加载图标: ${iconUrl} for ${this.domain}`);
          }
        }
      }
      
      this.isLoading = false;
      this.loadingStatus = '获取失败';
      this.errorDetails = `所有源均失败 for ${this.domain}`;
    },
    
    async fetchIconFromHtml(pageUrl) {
      try {
        const proxies = [
          `https://api.allorigins.win/raw?url=${encodeURIComponent(pageUrl)}`,
          `https://corsproxy.io/?${encodeURIComponent(pageUrl)}`
        ];
        for (const proxyUrl of proxies) {
          try {
            const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(5000) });
            if (!res.ok) {
              this.errorDetails = `HTML请求失败: ${res.status} for ${proxyUrl}`;
              continue;
            }
            
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            let link = doc.querySelector('link[rel~="icon"], link[rel~="shortcut icon"], link[rel~="apple-touch-icon"]');
            
            if (link && link.href) {
              let iconUrl = link.href;
              if (!iconUrl.startsWith('http')) {
                const base = new URL(pageUrl).origin;
                iconUrl = iconUrl.startsWith('/') ? `${base}${iconUrl}` : `${base}/${iconUrl}`;
              }
              return iconUrl;
            }
          } catch (e) {
            this.errorDetails = `解析HTML失败: ${e.message} for ${proxyUrl}`;
            console.warn(`解析HTML失败 for ${proxyUrl}:`, e);
          }
        }
      } catch (e) {
        this.errorDetails = `解析HTML失败: ${e.message}`;
        console.warn('解析 <link rel="icon"> 失败:', e);
      }
      return null;
    },
    
    async testImageUrl(url, timeout = 3000, retry = false) {
      const attemptFetch = () => new Promise((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => resolve(false), timeout);
        
        img.onload = () => {
          clearTimeout(timer);
          resolve(img.naturalWidth >= 16 && img.naturalHeight >= 16);
        };
        
        img.onerror = () => {
          clearTimeout(timer);
          resolve(false);
        };
        
        img.src = url;
      });
      
      let isValid = await attemptFetch();
      if (!isValid && retry) {
        isValid = await attemptFetch();
      }
      return isValid;
    },
    
    getCachedIcon(domain) {
      try {
        const cached = localStorage.getItem(`favicon_cache_${domain}`);
        if (cached) {
          const { url, timestamp } = JSON.parse(cached);
          const now = Date.now();
          const cacheTime = 7 * 24 * 60 * 60 * 1000;
          if (now - timestamp < cacheTime) {
            return url;
          } else {
            localStorage.removeItem(`favicon_cache_${domain}`);
          }
        }
      } catch (error) {
        this.errorDetails = `缓存读取失败: ${error.message}`;
        console.warn('缓存读取失败:', error);
      }
      return null;
    },
    
    cacheIcon(domain, url) {
      try {
        localStorage.setItem(`favicon_cache_${domain}`, JSON.stringify({
          url,
          timestamp: Date.now()
        }));
      } catch (error) {
        this.errorDetails = `缓存写入失败: ${error.message}`;
        console.warn('缓存写入失败:', error);
      }
    },
    
    getPresetIcon(domain) {
      const presetIcons = {
        'google.com': 'https://www.google.com/favicon.ico',
        'github.com': 'https://github.githubassets.com/favicon.ico',
        'bing.com': 'https://www.bing.com/favicon.ico',
        'mail.google.com': 'https://www.google.com/favicon.ico',
        'console.aliyun.com': 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-32-32.ico',
        'console.volcengine.com': 'https://www.volcengine.com/favicon.ico',
        'jdcloud.com': 'https://www.jdcloud.com/favicon.ico'
      };
      return presetIcons[domain] || presetIcons[domain.replace('www.', '')];
    },
    
    handleFaviconError() {
      this.showIcon = false;
      this.loadingStatus = '图片加载失败';
      this.clearIconCache();
    },
    
    handleFaviconLoad() {
      this.showIcon = true;
      this.isLoading = false;
      this.loadingStatus = '加载成功';
      this.errorDetails = '';
    },
    
    refreshIcon() {
      this.clearIconCache();
      this.errorDetails = '';
      this.initializeIcon();
    },
    
    clearIconCache() {
      try {
        localStorage.removeItem(`favicon_cache_${this.domain}`);
      } catch (error) {
        this.errorDetails = `缓存清理失败: ${error.message}`;
        console.warn('缓存清理失败:', error);
      }
    }
  }
}
</script>

<style scoped>
/* 样式保持不变 */
.tool-card {
  background: transparent;
  border-radius: 12px;
  padding: 16px 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid rgba(226, 232, 240, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 110px;
  justify-content: center;
  backdrop-filter: blur(8px);
  position: relative;
}

.tool-card:hover {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: rgba(203, 213, 224, 0.8);
}

.tool-icon-wrapper {
  margin-bottom: 10px;
  transition: transform 0.15s ease;
}

.tool-card:hover .tool-icon-wrapper {
  transform: scale(1.02);
}

.tool-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.favicon-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 3px;
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
}

.emoji-fallback {
  font-size: 16px;
  color: #374151;
}

.loading-indicator {
  font-size: 16px;
  color: #6b7280;
  animation: rotate 1s linear infinite;
}

.debug-info {
  position: absolute;
  top: -40px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 9px;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

.refresh-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  font-size: 12px;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tool-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tool-name {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.tool-description {
  font-size: 10px;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .tool-card {
    padding: 14px 10px;
    min-height: 95px;
  }
  
  .tool-icon {
    width: 36px;
    height: 36px;
  }
  
  .favicon-img {
    width: 20px;
    height: 20px;
  }
  
  .emoji-fallback,
  .loading-indicator {
    font-size: 15px;
  }
  
  .tool-name {
    font-size: 12px;
  }
  
  .tool-description {
    font-size: 9px;
  }
}

@media (max-width: 480px) {
  .tool-card {
    padding: 12px 8px;
    min-height: 85px;
  }
  
  .tool-icon {
    width: 32px;
    height: 32px;
  }
  
  .favicon-img {
    width: 18px;
    height: 18px;
  }
  
  .emoji-fallback,
  .loading-indicator {
    font-size: 14px;
  }
  
  .tool-name {
    font-size: 11px;
  }
}
</style>