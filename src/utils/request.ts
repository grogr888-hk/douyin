import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import config from '@/config'
import { _notice } from './index'

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  timeout: 60000
})

// request拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 如果没有设置Content-Type，默认application/json
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    // Set Authorization header if token exists
    if (!config.headers['Authorization']) {
      try {
        const t = localStorage.getItem('token')
        if (t) {
          config.headers['Authorization'] = 'Bearer ' + t.replace(/"/g, '')
        }
      } catch (e) {}
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data === undefined || data === null || data === '') {
      _notice('请求失败，请稍后重试！')
      return { success: false, code: 500, data: [] }
    } else if (typeof data === 'string') {
      return { success: true, code: 200, data }
    } else {
      if (data.data === undefined || data.data === null) {
        data.data = { ...data }
      }
      let resCode = data.code
      if (resCode) {
        try {
          resCode = Number(resCode)
        } catch (e) {
          data.code = resCode = 500
          data.success = false
        }
        if (resCode === 0) {
          data.code = resCode = 200
          data.success = true
        }
        if (resCode !== 200) {
          _notice(data.message || '请求失败，请稍后重试！')
        } else {
          data.success = true
        }
      } else {
        data.code = 200
        data.success = true
      }
      return data
    }
  },
  (error) => {
    if (error.response === undefined) {
      _notice('服务器响应超时')
      return { success: false, code: 500, msg: '服务器响应超时', data: [] }
    }
    if (error.response.status >= 500) {
      _notice('服务器出现错误')
      return { success: false, code: 500, msg: '服务器出现错误', data: [] }
    }
    if (error.response.status === 404) {
      _notice('接口不存在')
      return { success: false, code: 404, msg: '接口不存在', data: [] }
    }
    if (error.response.status === 400) {
      _notice('接口报错')
      return { success: false, code: 400, msg: '接口报错', data: [] }
    }
    if (error.response.status === 401) {
      return { success: false, code: 401, msg: '用户名或密码不正确', data: [] }
    } else {
      const data = error.response.data
      if (data === null || data === undefined) {
        _notice('请求失败，请稍后重试！')
        return { success: false, code: 500, data: [] }
      } else {
        const resCode = data.code
        if (data.data === undefined || data.data === null) {
          data.data = { ...data }
        }
        if (resCode && typeof resCode == 'number' && resCode !== 200) {
          _notice(data.message || '请求失败，请稍后重试！')
        } else {
          data.code = 200
          data.success = true
        }
        return data
      }
    }
  }
)
    

export interface ApiResponse<T = any> {
  data: T
  success: boolean
}

export async function request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  
}
