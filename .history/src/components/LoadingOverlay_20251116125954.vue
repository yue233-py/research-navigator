<template>
  <transition
    name="loading-fade"
    @enter="onEnter"
    @after-leave="onAfterLeave"
  >
    <div v-if="isVisible" class="loading-overlay">
      <!-- 深海背景遮罩 -->
      <div class="loading-backdrop">
        <!-- 气泡效果 -->
        <div class="bubble bubble-1"></div>
        <div class="bubble bubble-2"></div>
        <div class="bubble bubble-3"></div>
        <div class="bubble bubble-4"></div>
        <div class="bubble bubble-5"></div>
      </div>
      
      <!-- 加载动画容器 -->
      <div class="loading-container">
        <!-- 鱼影形状的加载动画 -->
        <div class="fish-loader">
          <svg class="fish-svg" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
            <!-- 鱼身 -->
            <ellipse cx="40" cy="30" rx="25" ry="18" class="fish-body" />
            <!-- 鱼头 -->
            <circle cx="15" cy="30" r="12" class="fish-head" />
            <!-- 鱼眼 -->
            <circle cx="12" cy="28" r="3" class="fish-eye" />
            <!-- 尾鳍 -->
            <path d="M 65 25 Q 80 15 85 25 Q 80 30 65 35 Z" class="fish-tail" />
            <!-- 背鳍 -->
            <path d="M 35 12 L 40 5 L 45 12 Z" class="fish-fin" />
            <!-- 腹鳍 -->
            <path d="M 30 45 L 33 52 L 36 45 Z" class="fish-fin" />
          </svg>
        </div>
        
        <!-- 加载文字 -->
        <p class="loading-text">{{ loadingText }}</p>
        
        <!-- 进度条 -->
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    isVisible: {
      type: Boolean,
      default: true
    },
    loadingText: {
      type: String,
      default: '加载中...'
    },
    progress: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value <= 100
    },
    duration: {
      type: Number,
      default: 800 // 过渡动画持续时间（毫秒）
    }
  },
  emits: ['loading-end'],
  methods: {
    onEnter(el) {
      // 进入动画回调
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.transition = `opacity ${this.duration}ms ease-in-out`;
        el.style.opacity = '1';
      }, 10);
    },
    onAfterLeave() {
      // 离开动画完成后的回调
      this.$emit('loading-end');
    }
  }
}
</script>

<style scoped>
/* 加载覆盖层容器 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

/* 背景遮罩 */
.loading-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(240, 242, 245, 0.95) 0%,
    rgba(250, 251, 252, 0.98) 100%
  );
  backdrop-filter: blur(2px);
}

/* 加载动画容器 */
.loading-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* 旋转加载动画 */
.spinner {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-circle {
  position: absolute;
  width: 50px;
  height: 50px;
  border: 4px solid rgba(26, 35, 50, 0.1);
  border-top-color: #1a2332;
  border-right-color: #1a2332;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 加载文字 */
.loading-text {
  color: #1a2332;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  margin: 10px 0 0 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* 进度条 */
.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(26, 35, 50, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    #1a2332 0%,
    #334155 100%
  );
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* 过渡动画 */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.8s ease-in-out;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

.loading-fade-enter-to,
.loading-fade-leave-from {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .spinner-circle {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }

  .spinner {
    width: 40px;
    height: 40px;
  }

  .loading-text {
    font-size: 14px;
  }

  .progress-bar {
    width: 150px;
  }
}
</style>
