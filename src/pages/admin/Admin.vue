<template>
  <div class="admin-console">
    <h2>后台管理控制台</h2>
    <div class="tabs">
      <button :class="{active: tab==='users'}" @click="tab='users'">用户审核</button>
      <button :class="{active: tab==='sources'}" @click="tab='sources'">视频源管理</button>
    </div>
    <div v-if="tab==='users'" class="tab-content">
      <h3>待审核用户</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>用户名</th><th>注册时间</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in pendingUsers" :key="u.id">
            <td>{{u.id}}</td>
            <td>{{u.username}}</td>
            <td>{{u.created_at}}</td>
            <td>
              <button @click="approve(u.id, 'approved')">通过</button>
              <button @click="approve(u.id, 'rejected')">拒绝</button>
            </td>
          </tr>
        </tbody>
      </table>
      <h3 style="margin-top:32px;">已通过用户</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>用户名</th><th>注册时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in approvedUsers" :key="u.id">
            <td>{{u.id}}</td>
            <td>{{u.username}}</td>
            <td>{{u.created_at}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="tab==='sources'" class="tab-content">
      <h3>视频源管理</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>名称</th><th>Base URL</th><th>启用</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in sources" :key="s.id">
            <td>{{s.id}}</td>
            <td><input v-model="s.name" /></td>
            <td><input v-model="s.base_url" style="width:220px;" /></td>
            <td><input type="checkbox" v-model="s.active" /></td>
            <td>
              <button @click="saveSource(s)">保存</button>
              <button @click="deleteSource(s.id)">删除</button>
            </td>
          </tr>
          <tr>
            <td>新建</td>
            <td><input v-model="newSource.name" /></td>
            <td><input v-model="newSource.base_url" style="width:220px;" /></td>
            <td><input type="checkbox" v-model="newSource.active" /></td>
            <td>
              <button @click="addNewSource">添加</button>
            </td>
          </tr>
        </tbody>
      </table>
      <h3 style="margin-top:32px;">默认设置</h3>
      <div>
        <label>默认源:
          <select v-model="settings.default_source_id">
            <option v-for="s in sources" :value="s.id">{{s.name}}</option>
          </select>
        </label>
        <label style="margin-left:16px;">默认分类:
          <input v-model="settings.default_category" />
        </label>
        <button @click="saveSettings" style="margin-left:16px;">保存设置</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import {
  getUsersByStatus, approveUser,
  listSources, addSource, updateSource, deleteSource,
  getAdminSettings, updateAdminSettings
} from '@/api/admin'

const tab = ref('users')
const pendingUsers = ref([])
const approvedUsers = ref([])
const sources = ref([])
const newSource = ref({ name: '', base_url: '', active: true })
const settings = ref({ default_source_id: '', default_category: '' })

async function fetchUsers() {
  const resPending = await getUsersByStatus('pending')
  pendingUsers.value = resPending.success ? resPending.data.users || [] : []
  const resApproved = await getUsersByStatus('approved')
  approvedUsers.value = resApproved.success ? resApproved.data.users || [] : []
}
async function approve(id, status) {
  await approveUser(id, status)
  fetchUsers()
}

async function fetchSources() {
  const res = await listSources()
  sources.value = res.success ? res.data.sources || [] : []
}
async function saveSource(s) {
  await updateSource(s.id, s)
  fetchSources()
}
async function deleteSource(id) {
  await deleteSource(id)
  fetchSources()
}
async function addNewSource() {
  if (!newSource.value.name || !newSource.value.base_url) return
  await addSource(newSource.value)
  newSource.value = { name: '', base_url: '', active: true }
  fetchSources()
}

async function fetchSettings() {
  const res = await getAdminSettings()
  settings.value = res.success && res.data.settings ? res.data.settings : settings.value
}
async function saveSettings() {
  await updateAdminSettings(settings.value)
  fetchSettings()
}

onMounted(() => {
  fetchUsers()
  fetchSources()
  fetchSettings()
})
</script>
<style scoped>
.admin-console {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  padding: 24px 20px;
  border-radius: 16px;
  margin-top: 40px;
  box-shadow: 0 2px 16px #0001;
}
.tabs {
  margin-bottom: 16px;
}
.tabs button {
  margin-right: 12px;
  padding: 6px 24px;
  border-radius: 6px;
  border: none;
  background: #4668e8;
  color: #fff;
  cursor: pointer;
}
.tabs button.active { background: #222; }
.tab-content table { margin-top: 12px; border-collapse: collapse; width: 100%; }
.tab-content th, .tab-content td { border: 1px solid #eee; padding: 6px 8px; }
.tab-content input[type="text"], .tab-content input[type="checkbox"], .tab-content select {
  font-size: 14px;
}
</style>