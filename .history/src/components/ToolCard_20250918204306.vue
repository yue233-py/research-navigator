<template>
  <div class="tool-card" @click="openTool" @contextmenu="handleRightClick">
    <div class="tool-icon-wrapper">
      <div class="tool-icon">
        <img
          v-if="showIcon && iconUrlToTry"
          :src="iconUrlToTry"
          :alt="tool.name"
          @error="handleIconError"
          @load="handleIconLoad"
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
      isLoading: true,
      showIcon: false,
      loadingStatus: '未开始',
      hasCached: false,

      // URL尝试逻辑
      domain: '',
      faviconUrlList: [],
      currentUrlIndex: 0
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

      const cachedIcon = this.getCachedIcon(this.domain);
      if (cachedIcon) {
        this.faviconUrlList = [cachedIcon];
        this.hasCached = true;
        this.loadingStatus = '使用缓存';
        this.startLoadingProcess();
        return;
      }
      
      this.loadFromNetwork();
    },
    
    loadFromNetwork() {
      this.loadingStatus = '网络获取中';
      
      this.faviconUrlList = [
        `https://favicon.qq.com/cgi-bin/get_favicon?url=${this.tool.url}`,
        `https://icons.duckduckgo.com/ip3/${this.domain}.ico`,
        `https://api.faviconkit.com/${this.domain}/64`,
        `https://www.google.com/s2/favicons?domain=${this.domain}&sz=64`,
        `https://${this.domain}/favicon.ico`
      ];

      this.startLoadingProcess();
    },

    startLoadingProcess() {
      this.isLoading = true;
      this.showIcon = true;
      this.currentUrlIndex = 0;
    },

    handleIconError() {
      const nextIndex = this.currentUrlIndex + 1;
      if (nextIndex < this.faviconUrlList.length) {
        this.loadingStatus = `源 ${this.currentUrlIndex + 1} 失败，尝试下一个...`;
        this.currentUrlIndex = nextIndex;
      } else {
        this.showIcon = false;
        this.isLoading = false;
        this.loadingStatus = '所有源获取失败';
      }
    },
    
    handleIconLoad() {
      this.isLoading = false;
      this.loadingStatus = '加载成功';
      if (!this.hasCached) {
        this.cacheIcon(this.domain, this.iconUrlToTry);
      }
    },
    
    refreshIcon() {
      this.clearIconCache(this.domain);
      this.isLoading = true;
      this.showIcon = false;
      this.hasCached = false;
      this.faviconUrlList = [];
      this.currentUrlIndex = 0;
      this.initializeIcon();
    },

    getCachedIcon(domain) {
      try {
        const cached = localStorage.getItem(`favicon_cache_${domain}`);
        if (cached) {
          const { url, timestamp } = JSON.parse(cached);
          const cacheTime = 7 * 24 * 60 * 60 * 1000;
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