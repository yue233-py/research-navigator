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

/* 深海背景遮罩 */
.loading-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    #0a1929 0%,
    #0d2949 30%,
    #0f3a5f 60%,
    #0a2a45 100%
  );
  overflow: hidden;
}

/* 气泡动画 */
.bubble {
  position: absolute;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(100, 150, 200, 0.3));
  border-radius: 50%;
  filter: blur(1px);
  opacity: 0.6;
  animation: float-up 4s infinite ease-in;
}

.bubble-1 {
  width: 30px;
  height: 30px;
  left: 10%;
  bottom: -50px;
  animation-duration: 4s;
  animation-delay: 0s;
}

.bubble-2 {
  width: 20px;
  height: 20px;
  left: 30%;
  bottom: -50px;
  animation-duration: 5s;
  animation-delay: 0.5s;
}

.bubble-3 {
  width: 25px;
  height: 25px;
  left: 50%;
  bottom: -50px;
  animation-duration: 4.5s;
  animation-delay: 1s;
}

.bubble-4 {
  width: 15px;
  height: 15px;
  left: 70%;
  bottom: -50px;
  animation-duration: 5.5s;
  animation-delay: 0.8s;
}

.bubble-5 {
  width: 35px;
  height: 35px;
  left: 85%;
  bottom: -50px;
  animation-duration: 6s;
  animation-delay: 1.5s;
}

@keyframes float-up {
  0% {
    bottom: -50px;
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    bottom: 110vh;
    opacity: 0;
  }
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

/* 鱼影加载动画 */
.fish-loader {
  position: relative;
  width: 120px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fish-svg {
  width: 100px;
  height: 60px;
  filter: drop-shadow(0 0 15px rgba(100, 200, 255, 0.6));
  animation: swim 2s ease-in-out infinite;
}

.fish-body {
  fill: #1e4d7b;
  stroke: #00d4ff;
  stroke-width: 1.5;
}

.fish-head {
  fill: #2a5f99;
  stroke: #00d4ff;
  stroke-width: 1.5;
}

.fish-eye {
  fill: #00d4ff;
  filter: drop-shadow(0 0 3px rgba(0, 212, 255, 0.8));
}

.fish-tail {
  fill: #0099cc;
  stroke: #00d4ff;
  stroke-width: 1.5;
  filter: drop-shadow(0 0 5px rgba(0, 212, 255, 0.5));
}

.fish-fin {
  fill: #0099cc;
  stroke: #00d4ff;
  stroke-width: 1;
  opacity: 0.8;
}

@keyframes swim {
  0%, 100% {
    transform: translateX(0) scaleX(1);
  }
  25% {
    transform: translateX(15px) scaleX(1);
  }
  50% {
    transform: translateX(20px) scaleX(1);
  }
  75% {
    transform: translateX(10px) scaleX(1);
  }
}

/* 加载文字 */
.loading-text {
  color: #00d4ff;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 2px;
  margin: 10px 0 0 0;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  animation: text-glow 2s ease-in-out infinite;
}

@keyframes text-glow {
  0%, 100% {
    opacity: 1;
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  }
  50% {
    opacity: 0.7;
    text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
  }
}

/* 进度条 */
.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 10px;
  border: 1px solid rgba(0, 212, 255, 0.3);
  box-shadow: inset 0 0 10px rgba(0, 212, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    #0099cc 0%,
    #00d4ff 50%,
    #0099cc 100%
  );
  border-radius: 2px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
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
  .fish-loader {
    width: 100px;
    height: 60px;
  }

  .fish-svg {
    width: 80px;
    height: 48px;
  }

  .loading-text {
    font-size: 14px;
    letter-spacing: 1px;
  }

  .progress-bar {
    width: 150px;
  }
}
</style>
