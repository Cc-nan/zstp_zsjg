import useAxiosApi, { axiosLoad } from '@/utils/zstp/useAxiosApi.js'

export function zstpRequest (config, loading) {
  return axiosLoad(() => {
    return useAxiosApi(config.url, {
      method: config.method || 'GET',
      baseURL: config.baseURL ?? '/jwlz-application-sjjc',
      headers: {
        apk: '445a793dd0314abd875b7980d7ffbbd6'
      }
    })
  }, config, loading)
}
