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
      // 状态管理
      isLoading: true, // 初始默认为加载中
      showIcon: false,
      loadingStatus: '未开始',
      hasCached: false,

      // URL尝试逻辑
      domain: '',
      faviconUrlList: [],   // 要尝试的URL列表
      currentUrlIndex: 0  // 当前尝试的URL索引
    }
  },
  computed: {
    /**
     * 计算当前应该尝试加载的图标URL
     */
    iconUrlToTry() {
      if (this.faviconUrlList.length > 0 && this.currentUrlIndex < this.faviconUrlList.length) {
        return this.faviconUrlList[this.currentUrlIndex];
      }
      return null;
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
        this.isLoading = false;
        this.loadingStatus = '无URL';
        return;
      }
      
      try {
        this.domain = new URL(this.tool.url).hostname;
      } catch (error) {
        this.isLoading = false;
        this.loadingStatus = 'URL解析失败';
        return;
      }
      
      this.loadingStatus = '初始化...';

      // 1. 检查缓存
      const cachedIcon = this.getCachedIcon(this.domain);
      if (cachedIcon) {
        this.faviconUrlList = [cachedIcon]; // 将缓存的URL作为唯一且首个尝试
        this.hasCached = true;
        this.loadingStatus = '使用缓存';
        this.startLoadingProcess();
        return;
      }
      
      // 2. 无缓存，从网络获取
      this.loadFromNetwork();
    },
    
    loadFromNetwork() {
      this.loadingStatus = '网络获取中';
      
      // 最终优化的URL列表，将腾讯API置于首位
      this.faviconUrlList = [
        // 1. 优先使用腾讯API，它对国内网站支持最好。注意：它需要完整的URL
        `https://favicon.qq.com/cgi-bin/get_favicon?url=${this.tool.url}`,

        // 2. DuckDuckGo 作为备选，覆盖范围广
        `https://icons.duckduckgo.com/ip3/${this.domain}.ico`,
        
        // 3. Favicon Kit API，另一个强大的备选
        `https://api.faviconkit.com/${this.domain}/64`,

        // 4. Google API 作为补充，对国际网站很有效
        `https://www.google.com/s2/favicons?domain=${this.domain}&sz=64`,
        
        // 5. 终极回退，直接访问网站的favicon.ico
        `https://${this.domain}/favicon.ico`
      ];

      this.startLoadingProcess();
    },

    /**
     * 启动图片加载尝试
     */
    startLoadingProcess() {
      this.isLoading = true;
      this.showIcon = true; // 开始让<img>标签渲染
      this.currentUrlIndex = 0;
    },

    /**
     * 核心：当一个图标URL加载失败时触发
     */
    handleIconError() {
      const nextIndex = this.currentUrlIndex + 1;
      // 检查是否还有下一个URL可以尝试
      if (nextIndex < this.faviconUrlList.length) {
        this.loadingStatus = `源 ${this.currentUrlIndex + 1} 失败，尝试下一个...`;
        this.currentUrlIndex = nextIndex; // Vue会侦测到变化，更新:src，触发下一次加载
      } else {
        // 所有URL都失败了
        this.showIcon = false;
        this.isLoading = false;
        this.loadingStatus = '所有源获取失败';
      }
    },
    
    /**
     * 当图标成功加载时触发
     */
    handleIconLoad() {
      this.isLoading = false;
      this.loadingStatus = '加载成功';
      // 如果不是从缓存加载的，就写入缓存
      if (!this.hasCached) {
        this.cacheIcon(this.domain, this.iconUrlToTry);
      }
    },
    
    refreshIcon() {
      this.clearIconCache(this.domain);
      // 重置所有状态
      this.isLoading = true;
      this.showIcon = false;
      this.hasCached = false;
      this.faviconUrlList = [];
      this.currentUrlIndex = 0;
      this.initializeIcon();
    },

    // --- 缓存相关方法 ---
    getCachedIcon(domain) {
      try {
        const cached = localStorage.getItem(`favicon_cache_${domain}`);
        if (cached) {
          const { url, timestamp } = JSON.parse(cached);
          const cacheTime = 7 * 24 * 60 * 60 * 1000; // 7天
          if (Date.now() - timestamp < cacheTime) {
            return url;
          }
          localStorage.removeItem(`favicon_cache_${domain}`);
        }
      } catch (e) { console.warn("读取缓存失败", e); }
      return null;
    },
    
    cacheIcon(domain, url) {
      try {
        const data = { url, timestamp: Date.now() };
        localStorage.setItem(`favicon_cache_${domain}`, JSON.stringify(data));
      } catch (e) { console.warn("写入缓存失败", e); }
    },

    clearIconCache(domain) {
      try {
        localStorage.removeItem(`favicon_cache_${domain}`);
      } catch (e) { console.warn("清除缓存失败", e); }
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