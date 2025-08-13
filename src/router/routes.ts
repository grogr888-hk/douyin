import Home from '../pages/home/index.vue'
import MemberCenter from '../pages/me/Me.vue'
import Admin from '../pages/admin/Admin.vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/home/music', component: () => import('@/pages/home/Music.vue') },
  { path: '/home/music-rank-list', component: () => import('@/pages/home/MusicRankList.vue') },
  { path: '/home/live', component: () => import('@/pages/home/LivePage.vue') },
  { path: '/me', component: MemberCenter },
  { path: '/admin', component: Admin },
  // Login routes
  { path: '/login', component: () => import('@/pages/login/Login.vue') },
  { path: '/login/other', component: () => import('@/pages/login/OtherLogin.vue') },
  { path: '/login/password', component: () => import('@/pages/login/PasswordLogin.vue') },
  { path: '/login/verification-code', component: () => import('@/pages/login/VerificationCode.vue') },
  { path: '/login/retrieve-password', component: () => import('@/pages/login/RetrievePassword.vue') },
  { path: '/login/help', component: () => import('@/pages/login/Help.vue') },
  // Video detail and search
  { path: '/video-detail', name: 'video-detail', component: () => import('@/pages/other/VideoDetail.vue') },
  { path: '/home/search', component: () => import('@/pages/home/SearchPage.vue') },
  // People (keep only FindAcquaintance as example)
  { path: '/people/find-acquaintance', component: () => import('@/pages/people/FindAcquaintance.vue') }
]

export default routes