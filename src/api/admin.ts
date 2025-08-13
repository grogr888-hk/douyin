import { request } from '@/utils/request'

export function getUsersByStatus(status: 'pending'|'approved'|'rejected') {
  return request({ url: '/admin/users', method: 'get', params: { status } })
}

export function approveUser(id: number, status: 'approved'|'rejected' = 'approved') {
  return request({ url: `/admin/users/${id}/approve`, method: 'post', data: { status } })
}

export function listSources() {
  return request({ url: '/admin/sources', method: 'get' })
}

export function addSource(data: { name: string, base_url: string, active: boolean }) {
  return request({ url: '/admin/sources', method: 'post', data })
}

export function updateSource(id: number, payload: any) {
  return request({ url: `/admin/sources/${id}`, method: 'put', data: payload })
}

export function deleteSource(id: number) {
  return request({ url: `/admin/sources/${id}`, method: 'delete' })
}

export function getAdminSettings() {
  return request({ url: '/admin/settings', method: 'get' })
}

export function updateAdminSettings(data: { default_source_id?: number, default_category?: string }) {
  return request({ url: '/admin/settings', method: 'put', data })
}