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
      // 右键菜单 - 刷新图标
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
        this.domain = new URL(this.tool.url).hostname;
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
      
      // 简化的获取策略 - 只用最稳定的Google服务
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${this.domain}&sz=32`;
      
      try {
        const isValid = await this.testImageUrl(faviconUrl, 3000);
        if (isValid) {
          this.currentIconUrl = faviconUrl;
          this.cacheIcon(this.domain, faviconUrl, 'google');
          this.showIcon = true;
          this.loadingStatus = 'Google服务成功';
          this.isLoading = false;
          return;
        }
      } catch (error) {
        console.warn('Google favicon服务失败:', error);
      }
      
      // 备用方案：尝试Icon.horse
      try {
        const backupUrl = `https://icon.horse/icon/${this.domain}`;
        const isValid = await this.testImageUrl(backupUrl, 5000);
        if (isValid) {
          this.currentIconUrl = backupUrl;
          this.cacheIcon(this.domain, backupUrl, 'iconhorse');
          this.showIcon = true;
          this.loadingStatus = 'Icon.horse成功';
          this.isLoading = false;
          return;
        }
      } catch (error) {
        console.warn('Icon.horse服务失败:', error);
      }
      
      // 全部失败
      this.isLoading = false;
      this.loadingStatus = '获取失败';
    },
    
    // 简化的图片测试
    testImageUrl(url, timeout = 3000) {
      return new Promise((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => {
          resolve(false);
        }, timeout);
        
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
    
    // 增强的缓存系统
    getCachedIcon(domain) {
      try {
        const cached = localStorage.getItem(`favicon_cache_${domain}`);
        if (cached) {
          const { url, timestamp, source } = JSON.parse(cached);
          const now = Date.now();
          
          // 不同来源的缓存时间
          const cacheTime = source === 'preset' ? 30 * 24 * 60 * 60 * 1000 : // 预设缓存30天
                           source === 'google' ? 7 * 24 * 60 * 60 * 1000 :   // Google缓存7天
                           3 * 24 * 60 * 60 * 1000;                          // 其他缓存3天
          
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
    
    cacheIcon(domain, url, source = 'network') {
      try {
        localStorage.setItem(`favicon_cache_${domain}`, JSON.stringify({
          url,
          timestamp: Date.now(),
          source,
          domain
        }));
        
        // 同时添加到成功列表
        this.addToSuccessfulDomains(domain);
      } catch (error) {
        console.warn('缓存写入失败:', error);
      }
    },
    
    // 记录成功获取的域名
    addToSuccessfulDomains(domain) {
      try {
        const successful = JSON.parse(localStorage.getItem('successful_domains') || '[]');
        if (!successful.includes(domain)) {
          successful.push(domain);
          localStorage.setItem('successful_domains', JSON.stringify(successful));
        }
      } catch (error) {
        // 忽略错误
      }
    },
    
    // 预设图标库 - 手动维护的高质量图标
    getPresetIcon(domain) {
      const presetIcons = {
        // 搜索引擎
        'www.google.com': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOjSURBVFiFtZddaFxVFIafb2YyM5lkJpM0bZpJ2qS1NYFqLFYLVoQi1YpFH6woiA/1QUG0L4IgPvhSfRELFkEQfVIQfBDxQcEHi1UraCu2VKRqW5tY0zRpkzTJJJPJzGTmzp/7wFRsOpf4wYaz2Pus9a+99j5nC/yz7v1fgN/84Z2d4s0d6pCqdhFWIhpQCoJCWEopCFZBSgKYgmSWpOS1CZLJKb2+5qXX7pNQcKeLvv3W5pHEpnZjL/CYEvBEyqyy/jI28L2xQTOjbNCHqRmsglUwCyLAlKYzlJRhYPw3t/W/9ueZwT0t8LRVJrDqZlW8WpW//9ILb12eQ+wSdfZlYhPJwKh8kQosgmVVxmRkW1JnBrJWIaoXdgNbgN9X0/w5vH/3+MFKjj8HfDW3r0/P3HVJZy0jZEOjRQohhgCNoQiJJI0BRSBI7SgSqoKS6TGY/fJl9etgp/fLlY1m2nfnLnT9u1AKtJBAPKABISEfj+LVCkS9Kq5rUa5YBIMBEr4v5WJBnvn6gZ98n+HVlV1k6u/+fvmrn9uHjjF7ZhA5IShYTjV6xVAipaABgOZyAagWXd0uw+kEo8Uw7lWZC5XaS8dVW9L8efuXj8nNv7xCvt8rRXHOdAWTCzxIQUKARhCMQjRaKhNfT3Y7T7Wt96lIeDYhCQ3kk7OZbG0rWjlSM3r6xTVKhIICjgFGjSACQhJhJRQLEGkgmYiwu7sLKVshHa3B9n4BIZZcjc7oGPAGcFkjUCWpGTSCAhJhBSJIpYFYNnwXPBupV0VtJjKGVLQq1D5YOvb2kTXVBQLJlaMhFrZvt1xRFRKh8b2nJ9fPqhQJhNGZXhKy1CnltAGCRjS8L+lZIZOXGkZKjP7TzLNfPW/5J3e5ffnQ+7eDr18YJgsCixGnW1pPfhD+/JVvG9q3v4i8cv27BQoJhPUiJpJ2FGPDPZzY9gy3n7qPE8PnuH72AEXfJ5dpQLgN3pZCnj7sP3fJqfQHj5iKjKwwRiOs0NZwDWzONRBDApAwJ31VbS5YJlZh41FePbGbtls2Idr2IRJR5HPNVfHM6djLh/7x5Gxy5sZqZWc21X75hKoK5tQ8pz4+xbGjpziw+x4y6xoIfZ9ivuDcuGFrWA0KhCWo1oQJJqJO6vBv3vWrn6ER8/1H4M9v3b0pNfDgSfPG2JCd+eKDpdEfqNz2dWCf5oPCJWfhYjf4G6qHMLaG8CrTAAAAAElFTkSuQmCC',
        'scholar.google.com': 'https://www.google.com/s2/favicons?domain=scholar.google.com&sz=32',
        'github.com': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOISURBVFiFtZddaF1VFIafb2bOOScnycmPaX6atE1TY4u1/SkotRYKFqSCINJKVfRBfVEQBV+EQsCX+iL4oA8KvigFQfqg4IOCtFK02l5oS9vaWJo2f5eSk5OTk3N+7tm/L1KRmpM9fmHBXnuvtb79rbX2Xltw79p9E/Dbp+8+Jv+d/URXK8JFEKJEhKh8v1f3rT9/PvdRfhNw6fThl9TZZf+KlDYDtQ/7+J0XHz80dyt4U4AT375zWMpnT0gpFgDXsXDTDklqHpSSP3uP4MaXy+5EAsxr+xN7T5+6/qfQSFIikKi2Hq3qfpzW6yPQIFBK5rNZJ7Xjqec+AGEF8I3zp4+orMCnCn3Y+pAWBpJjEJo9Ik5+9m3vdcgMgpDCKNyqQ6dLd8JKwA8r5eRv+YeLCsBICwMaLJxoxHpvGTbW1o9/yYDKpQLALBZSz/v5Pm2LQFF7k7b74l9xPb9B7Hxh9eWmKJBV19lG8qeNEHcLM3D1zKCemQPbp1zcLkfaRF5o7YiUCxwbXMuiFp5Eu4r3S9/TmgTQRt0rjGQdOF4Q1/p4rJsHaD0Vv7+LuxnxwTwwKcUmMNt8bS+WFDC3/9OOZrwFnXtFJhO5PYP5HFgNfHD65cV9PTDKB8AoBAwwmHVSKJD4g6B44FiCVqCjWIEhJCTTLq9kUmAJgfYCGBAmXVe6MdJUUmBYGN5WOwLBOzwKzEUKiBF/u+8sCr6PtR8eLBWQJsLwO0pF2hJlKAJ7VdOm9lq1mKsQ1DXdBZF0WKgVQjsaSzYo9BZGnKDCJiCG3SsaHJSjN3dKITDqX9zQv85Zez3ot8aKL6lIuPHJ3ZPf6Bm0KJAhwHgQOl3KZEVxNRfNBHgQLpj7BLDqQHQNZiKXPR6YDcz+rEJKBR5+e5gKsYMUBqrGUTNgXsaSBQFFzGaJgCPZRGFsHOUAyDogcmYEKoTlnFNdAqhYEQKdVMoNNuJ3YKcRfHDEtOgxL6cSgCg8vQVOXNAJJb3wZ8vQg3bBWnCwB3gKKh+uZEqD46qsoBPK0bWuN8kCWJ1MoVVQKIy5J6BxKLIIkLXB8OQqgegE2g9XQJXSiLsgKkMr9bCgfmRBsBPYpNBtF8w7KYGpTqCCALCgBlCBEqACVNIqc0lVqvHaQXCJhsJhEkGKwSPO+H7xjt3cCqvzz3yO/5pBf4JGZH3MZQaRLcCzwbGGlOK3qLpVVgVOVK14CKONwQqOAr8A/6jS0tF/mYQNlwAAAABJRU5ErkJggg==',
        'www.bing.com': 'https://www.google.com/s2/favicons?domain=bing.com&sz=32',
        
        // 常用网站直接用Google的服务
        'xueshu.baidu.com': 'https://www.google.com/s2/favicons?domain=xueshu.baidu.com&sz=32',
        'www.researchgate.net': 'https://www.google.com/s2/favicons?domain=researchgate.net&sz=32',
        'pubmed.ncbi.nlm.nih.gov': 'https://www.google.com/s2/favicons?domain=pubmed.ncbi.nlm.nih.gov&sz=32',
        'www.x-mol.com': 'https://www.google.com/s2/favicons?domain=x-mol.com&sz=32',
        'chat.deepseek.com': 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=32',
        'xinghuo.xfyun.cn': 'https://www.google.com/s2/favicons?domain=xfyun.cn&sz=32',
        'translate.google.com': 'https://www.google.com/s2/favicons?domain=translate.google.com&sz=32',
        'www.grammarly.com': 'https://www.google.com/s2/favicons?domain=grammarly.com&sz=32',
        'weixin.qq.com': 'https://www.google.com/s2/favicons?domain=weixin.qq.com&sz=32'
      };
      
      // 检查精确匹配和去www匹配
      return presetIcons[domain] || presetIcons[domain.replace('www.', '')] || 
             presetIcons['www.' + domain];
    },
    
    handleFaviconError() {
      this.showIcon = false;
      this.loadingStatus = '图片加载失败';
      
      // 从缓存中移除失效的图标
      try {
        localStorage.removeItem(`favicon_cache_${this.domain}`);
      } catch (error) {
        // 忽略
      }
    },
    
    handleFaviconLoad() {
      this.showIcon = true;
      this.isLoading = false;
      this.loadingStatus = '加载成功';
    },
    
    // 手动刷新图标
    refreshIcon() {
      this.showIcon = false;
      this.isLoading = false;
      this.currentIconUrl = null;
      this.loadingStatus = '重新获取';
      
      // 清除缓存
      try {
        localStorage.removeItem(`favicon_cache_${this.domain}`);
      } catch (error) {
        // 忽略
      }
      
      // 重新加载
      setTimeout(() => {
        this.initializeIcon();
      }, 100);
    }
  },
  
  // 全局方法：清理所有缓存
  beforeCreate() {
    // 添加全局清理方法
    if (!window.clearFaviconCache) {
      window.clearFaviconCache = () => {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('favicon_cache_')) {
            localStorage.removeItem(key);
          }
        });
        console.log('Favicon缓存已清理');
      };
      
      window.listFaviconCache = () => {
        const keys = Object.keys(localStorage);
        const cacheItems = keys.filter(key => key.startsWith('favicon_cache_'));
        console.log(`找到 ${cacheItems.length} 个缓存项:`, cacheItems);
        return cacheItems;
      };
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