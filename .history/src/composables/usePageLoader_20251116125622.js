import { ref, computed } from 'vue'

/**
 * 页面加载状态管理 Composable
 * 用于控制加载动画的显示/隐藏和进度更新
 */
export function usePageLoader(options = {}) {
  const {
    autoHideDelay = 2000, // 自动隐藏延迟（毫秒）
    showMinDuration = 800  // 最小显示时间，保证动画完整
  } = options

  // 状态
  const isLoading = ref(false)
  const progress = ref(0)
  const loadingText = ref('加载中...')
  
  // 内部计时器
  let autoHideTimer = null
  let progressTimer = null
  const loadStartTime = ref(null)

  /**
   * 显示加载动画
   */
  const show = (text = '加载中...') => {
    isLoading.value = true
    loadingText.value = text
    progress.value = 0
    loadStartTime.value = Date.now()
    
    // 清除之前的计时器
    if (autoHideTimer) clearTimeout(autoHideTimer)
    if (progressTimer) clearInterval(progressTimer)
    
    // 模拟进度增长（非线性）
    progressTimer = setInterval(() => {
      if (progress.value < 90) {
        const increase = Math.random() * 15 + 5
        progress.value = Math.min(progress.value + increase, 90)
      }
    }, 300)
  }

  /**
   * 隐藏加载动画
   * @param {number} delay - 延迟隐藏的时间（毫秒），0 表示立即隐藏
   */
  const hide = (delay = autoHideDelay) => {
    // 清除进度计时器
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }

    // 完成进度条
    progress.value = 100

    // 计算最小显示时间已否满足
    const elapsedTime = loadStartTime.value ? Date.now() - loadStartTime.value : 0
    const minDelay = Math.max(0, showMinDuration - elapsedTime)
    const totalDelay = Math.max(delay, minDelay)

    // 设置延迟隐藏
    autoHideTimer = setTimeout(() => {
      isLoading.value = false
      progress.value = 0
      loadStartTime.value = null
    }, totalDelay)
  }

  /**
   * 立即隐藏加载动画
   */
  const hideImmediate = () => {
    if (progressTimer) clearInterval(progressTimer)
    if (autoHideTimer) clearTimeout(autoHideTimer)
    isLoading.value = false
    progress.value = 0
    loadStartTime.value = null
  }

  /**
   * 更新加载进度
   * @param {number} percent - 0-100 之间的百分比
   */
  const setProgress = (percent) => {
    progress.value = Math.max(0, Math.min(percent, 100))
  }

  /**
   * 更新加载文字
   */
  const setText = (text) => {
    loadingText.value = text
  }

  /**
   * 检查当前是否正在加载
   */
  const isLoadingActive = computed(() => isLoading.value)

  /**
   * 清理资源（卸载时调用）
   */
  const cleanup = () => {
    if (autoHideTimer) clearTimeout(autoHideTimer)
    if (progressTimer) clearInterval(progressTimer)
  }

  return {
    // 状态
    isLoading: isLoadingActive,
    progress: computed(() => progress.value),
    loadingText: computed(() => loadingText.value),
    
    // 方法
    show,
    hide,
    hideImmediate,
    setProgress,
    setText,
    cleanup
  }
}
