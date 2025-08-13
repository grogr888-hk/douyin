<template>
  <div class="PasswordLogin">
    <BaseHeader mode="light" backMode="dark" backImg="back">
      <template v-slot:right>
        <span class="f14" @click="$router.push('/login/help')">帮助与设置</span>
      </template>
    </BaseHeader>
    <div class="content">
      <div class="desc">
        <div class="title">手机号密码登录</div>
      </div>

      <LoginInput autofocus type="phone" v-model="phone" placeholder="请输入手机号" />
      <LoginInput
        autofocus
        class="mt1r"
        type="password"
        v-model="password"
        placeholder="请输入密码"
      />

      <div class="protocol" :class="showAnim ? 'anim-bounce' : ''">
        <Tooltip style="top: -150%; left: -10rem" v-model="showTooltip" />
        <div class="left">
          <Check v-model="isAgree" />
        </div>
        <div class="right">
          已阅读并同意
          <span
            class="link"
            @click="$router.push('/service-protocol', { type: '“抖音”用户服务协议' })"
            >用户协议</span
          >
          和
          <span class="link" @click="$router.push('/service-protocol', { type: '“抖音”隐私政策' })"
            >隐私政策</span
          >
          ，同时登录并使用抖音火山版（原“火山小视频”）和抖音
        </div>
      </div>

      <div class="notice" v-if="notice">
        {{ notice }}
      </div>

      <dy-button
        type="primary"
        :loading="loading"
        :active="false"
        :disabled="disabled"
        @click="login"
      >
        {{ loading ? '登录中' : '登录' }}
      </dy-button>
      <div style="margin-top:10px;">
        <dy-button
          type="default"
          :active="false"
          :disabled="disabled"
          @click="register"
        >注册</dy-button>
      </div>

      <div class="options">
        <span>
          忘记了？<span class="link" @click="$router.push('/login/retrieve-password')"
            >找回密码</span
          >
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import Check from '../../components/Check'
import LoginInput from './components/LoginInput'
import Tooltip from './components/Tooltip'

const router = useRouter()
const auth = useAuthStore()
const phone = ref('')
const password = ref('')
const isAgree = ref(false)
const disabled = ref(false)
const loading = ref(false)
const notice = ref('')
const showAnim = ref(false)
const showTooltip = ref(false)

function validatePhone(phone) {
  return /^1\d{10}$/.test(phone)
}

async function login() {
  notice.value = ''
  if (!validatePhone(phone.value)) {
    notice.value = '请输入正确的手机号'
    return
  }
  if (!isAgree.value || disabled.value) return
  loading.value = true
  disabled.value = true
  const res = await auth.login({ username: phone.value, password: password.value })
  loading.value = false
  disabled.value = false
  if (res.success && auth.user && auth.user.status === 'approved') {
    router.push('/')
  } else if (res.code === 403 && res.msg && res.msg.includes('待审核')) {
    notice.value = '账号待审核，请等待管理员审批'
  } else if (res.msg) {
    notice.value = res.msg
  } else {
    notice.value = '登录失败'
  }
}

async function register() {
  notice.value = ''
  if (!validatePhone(phone.value)) {
    notice.value = '请输入正确的手机号'
    return
  }
  if (!isAgree.value || disabled.value) return
  loading.value = true
  disabled.value = true
  const res = await auth.register({ username: phone.value, password: password.value })
  loading.value = false
  disabled.value = false
  if (res.success) {
    notice.value = '注册成功，待管理员审核'
    router.push('/me')
  } else if (res.msg) {
    notice.value = res.msg
  } else {
    notice.value = '注册失败'
  }
}
</script>