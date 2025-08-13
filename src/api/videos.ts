import { request } from '@/utils/request'
import { useSettingsStore } from '@/store/settings'

export async function recommendedVideo(params = {}) {
  const settings = useSettingsStore()
  const { start = 0, pageSize = 10 } = params
  const pg = Math.floor(start / pageSize) + 1
  const query = {
    ac: 'list',
    pg,
    sourceId: settings.selectedSourceId,
    t: settings.category
  }
  const res = await request({ url: '/proxy/vod', method: 'get', params: query })
  return res
}

export async function recommendedLongVideo(params = {}) {
  return recommendedVideo(params)
}