<template>
  <div class="tool-card" @click="openTool" @contextmenu="handleRightClick">
    <div class="tool-icon-wrapper">
      <div class="tool-icon">
        <!-- 显示网站favicon或fallback到emoji -->
        <img 
          v-if="currentIconUrl && showIcon" 
          :src="currentIconUrl" 
          :alt="tool.name"
          @error="handleFaviconError"
          @load="handleFaviconLoad"
          class="favicon-img"
        />
        <!-- 加载中指示器 -->
        <div v-else-if="isLoading" class="loading-indicator">⟳</div>
        <!-- emoji fallback -->
        <span v-else class="emoji-fallback">{{ tool.icon }}</span>
      </div>
    </div>
    
    <div class="tool-info">
      <h3 class="tool-name">{{ tool.name }}</h3>
      <p class="tool-description" v-if="tool.description">{{ tool.description }}</p>
    </div>
    
    <!-- 调试信息 (开发模式) -->
    <div v-if="showDebug" class="debug-info" @click.stop>
      <div>缓存: {{ hasCached ? '✅' : '❌' }}</div>
      <div>状态: {{ loadingStatus }}</div>
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
      domain: ''
    }
  },
  mounted() {
    this.initializeIcon();
  },
  methods: {
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
    
    async initializeIcon() {
      if (!this.tool.url) {
        this.loadingStatus = '无URL';
        return;
      }
      
      try {
        const url = new URL(this.tool.url);
        // 对于一些特殊域名如 github.io，我们希望获取主域的图标
        const domainParts = url.hostname.split('.');
        if (domainParts.length > 2 && ['github.io', 'gitlab.io'].includes(domainParts.slice(-2).join('.'))) {
          this.domain = `${domainParts[domainParts.length - 3]}.${domainParts.slice(-2).join('.')}`;
        } else {
          this.domain = url.hostname;
        }
      } catch (error) {
        this.loadingStatus = 'URL解析失败';
        return;
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
    
    async loadFromNetwork() {
      this.isLoading = true;
      this.loadingStatus = '网络获取中';
      
      // 优先尝试高质量、稳定的服务，最后回退到直接访问
      const faviconUrls = [
        `https://icons.duckduckgo.com/ip3/${this.domain}.ico`,        // DuckDuckGo: 稳定且质量不错
        `https://www.google.com/s2/favicons?domain=${this.domain}&sz=64`, // Google: 非常稳定
        `https://icon.horse/icon/${this.domain}`,                      // Icon.horse: 功能强大，但可能返回mask-icon
        `https://${this.domain}/favicon.ico`                           // 终极回退: 直接访问标准路径
      ];
      
      for (const url of faviconUrls) {
        try {
          const isValid = await this.testImageUrl(url, 5000);
          if (isValid) {
            this.currentIconUrl = url;
            this.cacheIcon(this.domain, url);
            this.showIcon = true;
            this.loadingStatus = `来自 ${new URL(url).hostname}`;
            this.isLoading = false;
            return;
          }
        } catch (error) {
          // 静默处理失败，继续尝试下一个
          console.warn(`获取图标失败: ${url}`, error.message || error);
        }
      }
      
      // 所有网络获取方式失败
      this.isLoading = false;
      this.loadingStatus = '获取失败';
    },
    
    testImageUrl(url, timeout = 3000) {
      return new Promise((resolve) => {
        const img = new Image();
        let timer;

        const cleanup = () => {
          clearTimeout(timer);
          img.onload = null;
          img.onerror = null;
        };

        timer = setTimeout(() => {
          cleanup();
          resolve(false);
        }, timeout);
        
        img.onload = () => {
          // 确保图标不是一个极小的、无效的占位符
          if (img.naturalWidth > 8 && img.naturalHeight > 8) {
            cleanup();
            resolve(true);
          } else {
            cleanup();
            resolve(false);
          }
        };
        
        img.onerror = () => {
          cleanup();
          resolve(false);
        };
        
        // 添加 crossOrigin 属性可以减少一些CORS相关的错误，虽然不一定总能解决
        img.crossOrigin = "anonymous";
        img.src = url;
      });
    },

    // 其他方法 (getCachedIcon, cacheIcon, etc.) 保持不变...
    getCachedIcon(domain) {
       try {
         const cached = localStorage.getItem(`favicon_cache_${domain}`);
         if (cached) {
           const { url, timestamp } = JSON.parse(cached);
           const now = Date.now();
           const cacheTime = 7 * 24 * 60 * 60 * 1000;  // 缓存7天
           if (now - timestamp < cacheTime) {
             return url;
           } else {
             localStorage.removeItem(`favicon_cache_${domain}`);
           }
         }
       } catch (error) {
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
         console.warn('缓存写入失败:', error);
       }
     },
     
     getPresetIcon(domain) {
       const presetIcons = {
         'www.google.com': 'https://www.google.com/s2/favicons?domain=google.com&sz=32',
         'github.com': 'https://www.google.com/s2/favicons?domain=github.com&sz=32',
         'www.bing.com': 'https://www.google.com/s2/favicons?domain=bing.com&sz=32',
       };
       return presetIcons[domain] || presetIcons[domain.replace('www.', '')];
     },
     
     handleFaviconError() {
       this.showIcon = false;
       this.loadingStatus = '图片加载失败';
      // 错误发生时，清除可能存在的坏缓存
       this.clearIconCache(this.domain);
     },
     
     handleFaviconLoad() {
       // 成功加载后不再需要此方法，所有状态已在 loadFromNetwork 中设置
     },
     
     refreshIcon() {
       this.clearIconCache(this.domain);
       // 重置状态以重新加载
      this.currentIconUrl = null;
      this.showIcon = false;
       this.initializeIcon();
     },
     
     clearIconCache(domain) {
       try {
         localStorage.removeItem(`favicon_cache_${domain}`);
       } catch (error) {
         console.warn('缓存清理失败:', error);
       }
     }
  }
}
</script>

<style scoped>
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

/* 响应式设计 */
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