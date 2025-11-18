<template>
  <div class="search-container">
    <div class="search-box">
      <input 
        v-model="searchText"
        type="text" 
        placeholder="输入搜索关键词(Google)..."
        class="search-input"
        @keyup.enter="handleSearch"
        style="background: transparent !important;"
      
      />
      <button 
        class="search-button"
        @click="handleSearch"
        style="background-color: transparent;  cursor: pointer;"
      >
        <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  data() {
    return {
      searchText: ''
    }
  },
  methods: {
    handleSearch() {
      if (this.searchText.trim()) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(this.searchText)}`;
        window.open(searchUrl, '_blank');
      }
    }
  }
}
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 550px;
  display: flex;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.2s ease;
}

.search-box:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(203, 213, 224, 0.8);
}

.search-box:focus-within {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-color: rgba(148, 163, 184, 0.8);
}

.search-input {
  flex: 1;
  padding: 14px 20px;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
  color: #374151;
  font-family: inherit;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-button {
  padding: 14px 18px;
  border: none;
  background: #374151;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 0;
}

.search-button:hover {
  background: #1f2937;
}

.search-icon {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .search-container {
    padding: 0 15px;
  }
  
  .search-input {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .search-button {
    padding: 12px 16px;
  }
}
</style>