import { request } from '@/utils/request'

export async function register({ username, password }) {
  return request({ url: '/auth/register', method: 'post', data: { username, password } })
}

export async function login({ username, password }) {
  return request({ url: '/auth/login', method: 'post', data: { username, password } })
}

export async function fetchMe() {
  return request({ url: '/auth/me', method: 'get' })
}