<template>
  <div class="member-center">
    <h2>会员中心</h2>
    <div v-if="!auth.isLoggedIn">
      <div class="info">需要注册并通过审核后才可观看视频</div>
      <div class="actions">
        <button @click="goLogin">登录</button>
        <button @click="goLogin">注册</button>
      </div>
    </div>
    <div v-else-if="auth.user && auth.user.status !== 'approved'">
      <div class="status-badge pending">待审核</div>
      <div class="info">您的注册信息已提交，管理员审核通过后可登录观看视频</div>
      <button @click="auth.logout">退出登录</button>
    </div>
    <div v-else>
      <div class="status-badge approved">已通过</div>
      <div class="actions">
        <button @click="goHome">进入首页</button>
        <button @click="auth.logout">退出登录</button>
        <button v-if="auth.user && auth.user.role==='admin'" @click="goAdmin">进入后台</button>
      </div>
    </div>
    <BaseFooter :init-tab="5" />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import BaseFooter from '@/components/BaseFooter.vue'

const auth = useAuthStore()
const router = useRouter()
function goLogin() {
  router.push('/login')
}
function goHome() {
  router.push('/')
}
function goAdmin() {
  router.push('/admin')
}
</script>

<style scoped>
.member-center {
  max-width: 400px;
  margin: 50px auto 0 auto;
  background: #fff;
  padding: 30px 18px 70px 18px;
  border-radius: 18px;
  box-shadow: 0 2px 16px #0001;
  text-align: center;
}
.status-badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 18px;
}
.status-badge.pending { background: #f7cb51; color: #222; }
.status-badge.approved { background: #69e177; color: #222; }
.actions button {
  margin: 8px 10px;
  padding: 8px 24px;
  border-radius: 6px;
  border: none;
  background: #4668e8;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
}
.info {
  margin: 12px 0 20px 0;
  color: #666;
  font-size: 15px;
}
</style>