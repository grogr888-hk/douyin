import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import routes from './routes'
import { useBaseStore } from '@/store/pinia'
import { IS_SUB_DOMAIN } from '@/config'
import { useAuthStore } from '@/store/auth'

const protectedPrefixes = ['/home', '/video-detail']

const router = createRouter({
  history: IS_SUB_DOMAIN ? createWebHashHistory() : createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach(async (to, from) => {
  const baseStore = useBaseStore()
  // Animation logic
  const noAnimation = ['/', '/home', '/me', '/home/live', '/test']
  if (noAnimation.indexOf(from.path) !== -1 && noAnimation.indexOf(to.path) !== -1) {
    // animation logic unchanged
  } else {
    const toDepth = routes.findIndex((v) => v.path === to.path)
    const fromDepth = routes.findIndex((v) => v.path === from.path)
    if (toDepth > fromDepth) {
      if (to.matched && to.matched.length) {
        const toComponentName = to.matched[0].components?.default.name
        baseStore.updateExcludeNames({ type: 'remove', value: toComponentName })
      }
    } else {
      if (from.matched && from.matched.length) {
        const fromComponentName = from.matched[0].components?.default.name
        baseStore.updateExcludeNames({ type: 'add', value: fromComponentName })
      }
    }
  }

  // Auth gating
  const authStore = useAuthStore()
  if (!authStore.token) {
    await authStore.init()
  }
  // Only require approval for protected routes
  if (
    protectedPrefixes.some((prefix) => to.path.startsWith(prefix)) &&
    to.path !== '/login' && to.path !== '/admin' &&
    !authStore.isApproved
  ) {
    return { path: '/me' }
  }
  return true
})

export default router
