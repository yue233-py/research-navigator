<template>
  <div class="category-section">
    <div class="category-header">
      <span class="category-icon">{{ category.icon }}</span>
      <h2 class="category-title">{{ category.name }}</h2>
    </div>
    
    <div class="tools-grid">
      <ToolCard 
        v-for="tool in category.tools" 
        :key="tool.id"
        :tool="tool"
      />
    </div>
  </div>
</template>

<script>
import ToolCard from './ToolCard.vue'

export default {
  name: 'CategorySection',
  components: {
    ToolCard
  },
  props: {
    category: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.category-section {
  background: transparent !important;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.5);
  transition: all 0.2s ease;
}

.category-section:hover {
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  border-color: rgba(203, 213, 224, 0.6);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}

.category-icon {
  font-size: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent !important;
  border-radius: 10px;
  color: #374151;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.category-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
  letter-spacing: 0.5px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

@media (max-width: 768px) {
  .category-section {
    padding: 20px;
  }
  
  .tools-grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px;
  }
  
  .category-title {
    font-size: 1.1rem;
  }
  
  .category-icon {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .tools-grid {
    grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
    gap: 8px;
  }
}
</style>