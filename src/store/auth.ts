import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { request } from '@/utils/request'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const approved = ref(false)
  const isLoggedIn = computed(() => !!token.value)
  const isApproved = computed(() => !!token.value && approved.value)

  async function init() {
    const t = localStorage.getItem('token')
    if (t) {
      token.value = t
      await fetchMe()
    }
  }

  async function fetchMe() {
    if (!token.value) return
    const res = await request({ url: '/auth/me', method: 'get' })
    if (res.success && res.data && res.data.user) {
      user.value = res.data.user
      approved.value = res.data.user.status === 'approved'
    } else {
      user.value = null
      approved.value = false
    }
  }

  async function register({ username, password }) {
    const res = await request({
      url: '/auth/register',
      method: 'post',
      data: { username, password }
    })
    return res
  }

  async function login({ username, password }) {
    const res = await request({
      url: '/auth/login',
      method: 'post',
      data: { username, password }
    })
    if (res.success && res.data && res.data.token) {
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)
      await fetchMe()
    }
    return res
  }

  function logout() {
    token.value = null
    user.value = null
    approved.value = false
    localStorage.removeItem('token')
  }

  return {
    token,
    user,
    approved,
    isLoggedIn,
    isApproved,
    init,
    fetchMe,
    register,
    login,
    logout
  }
})