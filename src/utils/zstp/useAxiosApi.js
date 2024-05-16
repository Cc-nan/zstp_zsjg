import { useAxios } from '@vueuse/integrations/useAxios'
import axios, { CanceledError } from 'axios'
import {
  resolveFailedResponse,
  resolveSuccessResponse,
  updateRequestHeaders
} from './useRequestApi.js'

const instance = axios.create({
  withCredentials: false,
  timeout: 600 * 1000
})

export function initInterceptors (router, globalConfig, silent = false) {
  instance.interceptors.request.use((config) => {
    return updateRequestHeaders(config, globalConfig)
  }, (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  })

  instance.interceptors.response.use((response) => {
    const url = response.config.url
    const data = response.data
    return resolveSuccessResponse(response, data, url, router, silent)
  }, (error) => {
    if (error instanceof CanceledError) {
      return Promise.reject(error)
    }
    const response = error.response
    const data = response?.data
    return resolveFailedResponse(response, data, error, router, silent)
  })
}
initInterceptors({}, {})
export function axiosLoad (requestFunc, config, loading) {
  if (loading) {
    loading.value = true
  }
  const { execute } = requestFunc(config?.pathParams)
  return execute(config).then((res) => {
    if (loading) {
      loading.value = false
    }
    const error = res.error.value
    if (!error) {
      return res.response.value
    } else {
      return Promise.reject(error)
    }
  }, (error) => {
    if (loading) {
      loading.value = false
    }
    return Promise.reject(error)
  })
}

export function axiosLoadByConfig (config, loading) {
  return axiosLoad(() => {
    return useAxiosApi(config.url)
  }, config, loading)
}

export default function useAxiosApi (url, config = {}, options = {}) {
  const { pathParams } = config
  if (pathParams) {
    Object.keys(pathParams).forEach(key => url = url.replace('{' + key + '}', pathParams[key]))
    delete config.pathParams
  }
  return useAxios(url, config, instance, options)
}
