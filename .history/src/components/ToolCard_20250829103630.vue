<template>
  <div class="tool-card" @click="openTool">
    <div class="tool-icon-wrapper">
      <div class="tool-icon">
        <!-- 显示网站favicon或fallback到emoji -->
        <img 
          v-if="faviconUrl && !faviconError && showIcon" 
          :src="faviconUrl" 
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
  </div>
</template>

<script>
export default {
  name: 'ToolCard',
  props: {
    tool: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      faviconUrl: null,
      faviconError: false,
      showIcon: false,
      isLoading: false,
      retryCount: 0,
      maxRetries: 2
    }
  },
  mounted() {
    this.loadFavicon();
  },
  methods: {
    openTool() {
      if (this.tool.url) {
        window.open(this.tool.url, '_blank');
      }
    },
    
    async loadFavicon() {
      if (!this.tool.url) return;
      
      this.isLoading = true;
      
      try {
        const domain = new URL(this.tool.url).hostname;
        
        // 检查缓存
        const cachedIcon = this.getCachedIcon(domain);
        if (cachedIcon) {
          this.faviconUrl = cachedIcon;
          this.showIcon = true;
          this.isLoading = false;
          return;
        }
        
        // 方法1: 优先使用手动配置的高质量图标
        const customIcon = this.getCustomIcon(domain);
        if (customIcon) {
          this.faviconUrl = customIcon;
          this.cacheIcon(domain, customIcon);
          this.showIcon = true;
          this.isLoading = false;
          return;
        }
        
        // 方法2: 尝试多种favicon获取方式（按可靠性排序）
        const faviconSources = [
          // 最可靠的服务
          `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
          // 高质量但可能较慢的服务
          `https://icon.horse/icon/${domain}`,
          // 备用服务
          `https://api.faviconkit.com/${domain}/32`,
          // 直接获取（最不可靠但是原始的）
          `https://${domain}/favicon.ico`,
        ];
        
        // 并发测试前两个最可靠的服务
        const primarySources = faviconSources.slice(0, 2);
        const results = await Promise.allSettled(
          primarySources.map(url => this.testImageUrl(url, 2000)) // 2秒超时
        );
        
        // 检查并发结果
        for (let i = 0; i < results.length; i++) {
          if (results[i].status === 'fulfilled' && results[i].value) {
            this.faviconUrl = primarySources[i];
            this.cacheIcon(domain, primarySources[i]);
            this.showIcon = true;
            this.isLoading = false;
            return;
          }
        }
        
        // 如果前两个失败，尝试其他服务
        for (let i = 2; i < faviconSources.length; i++) {
          try {
            const isValid = await this.testImageUrl(faviconSources[i], 3000);
            if (isValid) {
              this.faviconUrl = faviconSources[i];
              this.cacheIcon(domain, faviconSources[i]);
              this.showIcon = true;
              this.isLoading = false;
              return;
            }
          } catch (error) {
            console.warn(`Failed to load favicon from ${faviconSources[i]}:`, error);
          }
        }
        
        // 全部失败，使用emoji
        this.faviconError = true;
        this.isLoading = false;
        
      } catch (error) {
        console.warn('Failed to extract domain from URL:', error);
        this.faviconError = true;
        this.isLoading = false;
      }
    },
    
    // 改进的图片测试方法
    testImageUrl(url, timeout = 3000) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const timer = setTimeout(() => {
          img.onload = null;
          img.onerror = null;
          resolve(false);
        }, timeout);
        
        img.onload = () => {
          clearTimeout(timer);
          // 检查图片尺寸，过小的图片可能是占位符
          if (img.naturalWidth > 8 && img.naturalHeight > 8) {
            resolve(true);
          } else {
            resolve(false);
          }
        };
        
        img.onerror = () => {
          clearTimeout(timer);
          resolve(false);
        };
        
        // 设置crossOrigin以避免CORS问题
        img.crossOrigin = 'anonymous';
        img.src = url;
      });
    },
    
    // 缓存机制
    getCachedIcon(domain) {
      try {
        const cached = localStorage.getItem(`favicon_${domain}`);
        if (cached) {
          const { url, timestamp } = JSON.parse(cached);
          // 缓存7天
          if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
            return url;
          } else {
            localStorage.removeItem(`favicon_${domain}`);
          }
        }
      } catch (error) {
        // 忽略localStorage错误
      }
      return null;
    },
    
    cacheIcon(domain, url) {
      try {
        localStorage.setItem(`favicon_${domain}`, JSON.stringify({
          url,
          timestamp: Date.now()
        }));
      } catch (error) {
        // 忽略localStorage错误
      }
    },
    
    // 扩展的手动配置（更全面）
    getCustomIcon(domain) {
      const customIcons = {
        // 搜索引擎 - 使用最稳定的Google服务
        'www.google.com': 'https://www.google.com/s2/favicons?domain=google.com&sz=32',
        'scholar.google.com': 'https://www.google.com/s2/favicons?domain=scholar.google.com&sz=32',
        'www.bing.com': 'https://www.google.com/s2/favicons?domain=bing.com&sz=32',
        'xueshu.baidu.com': 'https://www.google.com/s2/favicons?domain=xueshu.baidu.com&sz=32',
        
        // 学术平台
        'www.researchgate.net': 'https://www.google.com/s2/favicons?domain=researchgate.net&sz=32',
        'pubmed.ncbi.nlm.nih.gov': 'https://www.google.com/s2/favicons?domain=pubmed.ncbi.nlm.nih.gov&sz=32',
        'www.x-mol.com': 'https://www.google.com/s2/favicons?domain=x-mol.com&sz=32',
        'www.wanfangdata.com.cn': 'https://www.google.com/s2/favicons?domain=wanfangdata.com.cn&sz=32',
        
        // AI工具
        'chat.deepseek.com': 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=32',
        'xinghuo.xfyun.cn': 'https://www.google.com/s2/favicons?domain=xfyun.cn&sz=32',
        'www.notion.ai': 'https://www.google.com/s2/favicons?domain=notion.so&sz=32',
        'www.jasper.ai': 'https://www.google.com/s2/favicons?domain=jasper.ai&sz=32',
        'www.copy.ai': 'https://www.google.com/s2/favicons?domain=copy.ai&sz=32',
        'www.paperpal.com': 'https://www.google.com/s2/favicons?domain=paperpal.com&sz=32',
        
        // 开发工具
        'github.com': 'https://www.google.com/s2/favicons?domain=github.com&sz=32',
        'translate.google.com': 'https://www.google.com/s2/favicons?domain=translate.google.com&sz=32',
        'www.grammarly.com': 'https://www.google.com/s2/favicons?domain=grammarly.com&sz=32',
        
        // 专利和法律
        'www.soopat.com': 'https://www.google.com/s2/favicons?domain=soopat.com&sz=32',
        
        // 社交和通讯
        'weixin.qq.com': 'https://www.google.com/s2/favicons?domain=weixin.qq.com&sz=32',
        
        // 微软系列
        'copilot.microsoft.com': 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=32',
        
        // 更多常用网站 - 全部使用Google服务确保稳定性
        'www.cqvip.com': 'https://www.google.com/s2/favicons?domain=cqvip.com&sz=32',
        'kezi.ai': 'https://www.google.com/s2/favicons?domain=kezi.ai&sz=32',
        'peiyu.ai': 'https://www.google.com/s2/favicons?domain=peiyu.ai&sz=32',
        'www.xfyun.cn': 'https://www.google.com/s2/favicons?domain=xfyun.cn&sz=32',
        'paperfake.com': 'https://www.google.com/s2/favicons?domain=paperfake.com&sz=32',
        'jidanka.com': 'https://www.google.com/s2/favicons?domain=jidanka.com&sz=32',
        'flowith.ai': 'https://www.google.com/s2/favicons?domain=flowith.ai&sz=32',
        'trace.ai': 'https://www.google.com/s2/favicons?domain=trace.ai&sz=32'
      };
      
      return customIcons[domain] || customIcons[domain.replace('www.', '')];
    },
    
    handleFaviconError() {
      this.faviconError = true;
      this.showIcon = false;
      
      // 重试机制
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        setTimeout(() => {
          this.faviconError = false;
          this.loadFavicon();
        }, 1000 * this.retryCount); // 递增延迟重试
      }
    },
    
    handleFaviconLoad() {
      this.showIcon = true;
      this.isLoading = false;
      this.faviconError = false;
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