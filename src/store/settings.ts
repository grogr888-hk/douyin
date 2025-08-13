import { defineStore } from 'pinia'
import { ref } from 'vue'
import { request } from '@/utils/request'

export const useSettingsStore = defineStore('settings', () => {
  const sources = ref([])
  const selectedSourceId = ref(null)
  const category = ref('')
  const changedAt = ref(Date.now())
  const settingsLoaded = ref(false)

  async function init() {
    const res1 = await request({ url: '/sources', method: 'get' })
    if (res1.success && res1.data && Array.isArray(res1.data.sources)) {
      sources.value = res1.data.sources
    }
    const res2 = await request({ url: '/settings', method: 'get' })
    if (res2.success && res2.data && res2.data.settings) {
      selectedSourceId.value = res2.data.settings.default_source_id
      category.value = res2.data.settings.default_category || ''
    }
    settingsLoaded.value = true
  }

  async function selectAndMaybeSave({ sourceId, category: cat, persist } = {}) {
    if (sourceId !== undefined) selectedSourceId.value = sourceId
    if (cat !== undefined) category.value = cat
    changedAt.value = Date.now()
    if (persist) {
      await request({
        url: '/admin/settings',
        method: 'put',
        data: {
          default_source_id: selectedSourceId.value,
          default_category: category.value
        }
      })
    }
  }

  return {
    sources,
    selectedSourceId,
    category,
    changedAt,
    settingsLoaded,
    init,
    selectAndMaybeSave
  }
})