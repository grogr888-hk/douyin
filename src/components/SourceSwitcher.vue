<template>
  <div>
    <button class="global-switch-btn" @click="visible = true">切换视频源</button>
    <div v-if="visible" class="switcher-modal">
      <div class="switcher-content">
        <label>视频源:
          <select v-model="selectedSource">
            <option v-for="s in settingsStore.sources" :key="s.id" :value="s.id">{{s.name}}</option>
          </select>
        </label>
        <label>分类:
          <input v-model="selectedCategory" placeholder="分类ID(可选)" />
        </label>
        <div style="margin-top: 8px">
          <button @click="apply">应用</button>
          <button @click="visible = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { useAuthStore } from '@/store/auth'

const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const visible = ref(false)
const selectedSource = ref(null)
const selectedCategory = ref('')

onMounted(async () => {
  if (!settingsStore.settingsLoaded) await settingsStore.init()
  selectedSource.value = settingsStore.selectedSourceId
  selectedCategory.value = settingsStore.category
})

function apply() {
  settingsStore.selectAndMaybeSave({
    sourceId: selectedSource.value,
    category: selectedCategory.value,
    persist: authStore.user && authStore.user.role === 'admin'
  })
  visible.value = false
}
</script>
<style scoped>
.global-switch-btn {
  position: fixed;
  bottom: 75px;
  right: 18px;
  z-index: 9999;
  background: #fff;
  color: #333;
  padding: 7px 14px;
  border-radius: 20px;
  border: 1px solid #eee;
  box-shadow: 0 1px 5px #0001;
  font-size: 14px;
  cursor: pointer;
}
.switcher-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.switcher-content {
  background: #fff;
  padding: 20px 30px;
  border-radius: 14px;
  min-width: 300px;
  box-shadow: 0 2px 16px #0002;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.switcher-content label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 15px;
  margin-bottom: 7px;
}
.switcher-content select,
.switcher-content input {
  margin-top: 2px;
  font-size: 14px;
  padding: 3px 8px;
}
.switcher-content button {
  margin-right: 10px;
  padding: 4px 16px;
  border-radius: 4px;
  border: none;
  background: #4668e8;
  color: #fff;
  cursor: pointer;
}
.switcher-content button:last-child {
  background: #aaa;
  color: #fff;
}
</style>