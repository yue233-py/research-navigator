<template>
  <div class="tool-card" @click="openTool">
    <div class="tool-icon-wrapper">
      <div class="tool-icon">
        <!-- 显示网站favicon或fallback到emoji -->
        <img 
          v-if="faviconUrl && !faviconError" 
          :src="faviconUrl" 
          :alt="tool.name"
          @error="handleFaviconError"
          class="favicon-img"
        />
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
      faviconError: false
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
      
      try {
        const domain = new URL(this.tool.url).hostname;
        
        // 方法1: 优先使用手动配置的高质量图标
        const customIcon = this.getCustomIcon(domain);
        if (customIcon) {
          this.faviconUrl = customIcon;
          return;
        }
        
        // 方法2: 尝试多种favicon获取方式
        const faviconSources = [
          `https://icon.horse/icon/${domain}`, // 高质量favicon服务
          `https://www.google.com/s2/favicons?domain=${domain}&sz=32`, // Google favicon服务
          `https://${domain}/favicon.ico`, // 直接获取
        ];
        
        // 依次尝试不同的favicon源
        for (const source of faviconSources) {
          try {
            // 简单的图片预加载测试
            const isValid = await this.testImageUrl(source);
            if (isValid) {
              this.faviconUrl = source;
              return;
            }
          } catch (error) {
            console.warn(`Failed to load favicon from ${source}:`, error);
          }
        }
      } catch (error) {
        console.warn('Failed to extract domain from URL:', error);
        this.faviconError = true;
      }
    },
    
    // 测试图片URL是否有效
    testImageUrl(url) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        
        // 设置超时时间
        setTimeout(() => resolve(false), 3000);
      });
    },
    
    // 手动配置一些常用网站的高质量图标
    getCustomIcon(domain) {
      const customIcons = {
        // 搜索引擎
        'www.google.com': 'https://www.google.com/favicon.ico',
        'scholar.google.com': 'https://scholar.google.com/favicon.ico',
        'www.bing.com': 'https://www.bing.com/favicon.ico',
        'xueshu.baidu.com': 'https://xueshu.baidu.com/favicon.ico',
        
        // 学术平台
        'www.researchgate.net': 'https://www.researchgate.net/favicon.ico',
        'pubmed.ncbi.nlm.nih.gov': 'https://pubmed.ncbi.nlm.nih.gov/favicon.ico',
        'www.x-mol.com': 'https://www.x-mol.com/favicon.ico',
        'www.wanfangdata.com.cn': 'https://www.wanfangdata.com.cn/favicon.ico',
        
        // AI工具
        'chat.deepseek.com': 'https://chat.deepseek.com/favicon.ico',
        'xinghuo.xfyun.cn': 'https://xinghuo.xfyun.cn/favicon.ico',
        'www.notion.ai': 'https://www.notion.so/images/favicon.ico',
        'www.jasper.ai': 'https://www.jasper.ai/favicon.ico',
        'www.copy.ai': 'https://www.copy.ai/favicon.ico',
        'www.paperpal.com': 'https://www.paperpal.com/favicon.ico',
        
        // 开发工具
        'github.com': 'https://github.com/favicon.ico',
        'translate.google.com': 'https://translate.google.com/favicon.ico',
        'www.grammarly.com': 'https://www.grammarly.com/favicon.ico',
        
        // 专利和法律
        'www.soopat.com': 'https://www.soopat.com/favicon.ico',
        
        // 社交和通讯
        'weixin.qq.com': 'https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico',
        
        // 微软系列
        'copilot.microsoft.com': 'https://copilot.microsoft.com/favicon.ico',
        
        // 科研工具
        'www.chartgo.com': 'https://www.chartgo.com/favicon.ico',
        'flowith.ai': 'https://flowith.ai/favicon.ico',
        'trace.ai': 'https://trace.ai/favicon.ico',
        
        // 中文学术网站
        'www.cqvip.com': 'https://www.cqvip.com/favicon.ico',
        'kezi.ai': 'https://kezi.ai/favicon.ico',
        'peiyu.ai': 'https://peiyu.ai/favicon.ico',
        'www.xfyun.cn': 'https://www.xfyun.cn/favicon.ico',
        
        // 更多工具网站
        'www.research.ai': 'https://www.research.ai/favicon.ico',
        'www.plagiarismchecker.co': 'https://www.plagiarismchecker.co/favicon.ico',
        'www.bookbaby.com': 'https://www.bookbaby.com/favicon.ico',
        'www.essaytyper.com': 'https://www.essaytyper.com/favicon.ico',
        'paperfake.com': 'https://paperfake.com/favicon.ico',
        'jidanka.com': 'https://jidanka.com/favicon.ico',
        'www.imagedupefinder.com': 'https://www.imagedupefinder.com/favicon.ico',
        'academic.phrasebank.manchester.ac.uk': 'https://academic.phrasebank.manchester.ac.uk/favicon.ico',
        'www.academic-englishuk.com': 'https://www.academic-englishuk.com/favicon.ico',
        'peiqi.xfyun.cn': 'https://peiqi.xfyun.cn/favicon.ico',
        'scholar.deepseek.com': 'https://scholar.deepseek.com/favicon.ico',
        'math.deepseek.com': 'https://math.deepseek.com/favicon.ico',
        'www.creative.ai': 'https://www.creative.ai/favicon.ico'
      };
      
      return customIcons[domain] || customIcons[domain.replace('www.', '')];
    },
    
    handleFaviconError() {
      this.faviconError = true;
      // 可以尝试备用方案
      if (!this.faviconUrl?.includes('icon.horse')) {
        try {
          const domain = new URL(this.tool.url).hostname;
          this.faviconUrl = `https://icon.horse/icon/${domain}`;
          this.faviconError = false;
        } catch (error) {
          // 最终失败，显示emoji
        }
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
}

.emoji-fallback {
  font-size: 16px;
  color: #374151;
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
  
  .emoji-fallback {
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
  
  .emoji-fallback {
    font-size: 14px;
  }
  
  .tool-name {
    font-size: 11px;
  }
}

/* 加载动画效果 */
.tool-icon {
  position: relative;
}

.favicon-img {
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
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
</style>