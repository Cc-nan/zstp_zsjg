import { ElMessage } from './message'
// import { isDesktop } from '@/utils/zstp/device-detect'
// import { useUserStore } from '@/store/modules/user'
// import { setCompletenessHeader, setLogHeaderInComponent } from '@/utils/update-request'
// import { simpleTranslate as t } from '@/utils/config'
// import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'

function isSuccess (data) {
  return data.errCode === 200 || data.errCode === 0 || data.ErrorCode === 0
}

function isNoPermissions (data) {
  const errorInfo = data.message || data.ErrorInfo || ''
  return data.errCode === 201 || data.ErrorCode === 800401 || data.ErrorCode === 800403 || errorInfo.includes('Jwt expired')
}

function buildErrorInfo (data) {
  console.log(data)
  let errorInfo = data.message || data.ErrorInfo || data.rspDesc
  if (data.data?.length) {
    errorInfo += '：'
    for (const item of data.data) {
      errorInfo += item.path + ' ' + item.message + ';'
    }
  }
  return errorInfo
}

function goLogin (router) {
  setTimeout(() => {
    router.replace({
      name: 'login'
    })
  }, 1000)
}

function showError (errorInfo) {
  ElMessage({
    message: errorInfo,
    type: 'error'
  })
}

function showErrorInfo (code, errorInfo, silent) {
  const error = new Error(`${code}-/${errorInfo}`)
  if (!silent) {
    showError(errorInfo)
  }
  return Promise.reject(error)
}

function validateJSONResponse (data, router, silent) {
  let errorInfo = ''
  if (isSuccess(data)) {
    if (typeof data.count === 'number') {
      return {
        data: data.data,
        count: data.count
      }
    } else {
      return data.data ?? {}
    }
  } else if (isNoPermissions(data)) {
    goLogin(router)
    return data.data ?? {}
  } else if (data.message || data.ErrorInfo || data.rspDesc) {
    errorInfo = buildErrorInfo(data)
  } else {
    errorInfo = '未知错误'
  }
  return showErrorInfo(data.errCode || data.ErrorCode, errorInfo, silent)
}

export function updateRequestHeaders (settings, config) {
  // const userStore = useUserStore()
  const exUrl = config.noPermissionUrls || []
  // const token = userStore.token
  const token = ''
  settings.headers = settings.headers || {}
  if (token && !exUrl.find(url => url === settings.url)) {
    settings.headers.authorization = settings.headers.authorization || token
  }
  // if (config.headerConfig.completeness) {
  //   setCompletenessHeader(settings.headers, settings)
  // }
  // if (config.headerConfig.log) {
  //   setLogHeaderInComponent(settings.headers)
  // }
  return settings
}

export function validateResponse (data, router, silent) {
  if (data instanceof Blob) {
    return data.text().then((s) => {
      if (data.type.toLocaleLowerCase().includes('application/json')) {
        return validateJSONResponse(JSON.parse(s), router, silent)
      } else {
        return Promise.reject(new Error('未知返回类型'))
      }
    })
  } else {
    return validateJSONResponse(data, router, silent)
  }
}

export function resolveSuccessResponse (response, data, url, router, silent) {
  if (response.headers['content-disposition']?.indexOf('attachment;') === 0) {
    return response
  } else if (url === '/oauth/token') {
    if (data.message || data.ErrorInfo) {
      return showErrorInfo(
        data.errCode || data.ErrorCode,
        buildErrorInfo(data),
        silent
      )
    } else {
      return data
    }
  } else {
    return validateResponse(data, router, silent)
  }
}

export function resolveFailedResponse (response, data, error, router, silent) {
  let errorInfo = '未知错误'
  let code = 1
  if (response) {
    code = response.status
    if (code === 401) {
      goLogin(router)
      return Promise.reject(error || new Error(response.statusText))
    } else if (code === 403) {
      errorInfo = '暂无权限，无法操作'
    } else {
      const info = data?.message || error?.message || response.statusText || response.status
      errorInfo = info || errorInfo
    }
  } else if (error.config.url === '/api/kguser/users/current/detail') {
    goLogin(router)
    return Promise.reject(error)
  }
  return showErrorInfo(code, errorInfo, silent)
}

// class RetryableError extends Error {
// }
//
// class FatalError extends Error {
// }

// export function streamRequest (requestConfig, config, messageHandler) {
//   const abortController = new AbortController()
//   const { signal } = abortController
//   return fetchEventSource(requestConfig.url, Object.assign({}, requestConfig.config, {
//     signal,
//     async onopen (response) {
//       if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
//         return
//       } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
//         throw new FatalError()
//       } else {
//         throw new RetryableError()
//       }
//     },
//     onmessage (msg) {
//       if (msg.event === 'FatalError') {
//         throw new FatalError(msg.data)
//       } else {
//         if (msg.data === '[DONE]') {
//           abortController.abort(msg.data)
//         }
//         messageHandler(msg)
//       }
//     },
//     onclose () {
//       throw new RetryableError()
//     },
//     onerror (err) {
//       if (err instanceof FatalError) {
//         ElMessage.error(err.message)
//         throw err
//       } else {
//         // do nothing to automatically retry. You can also
//         // return a specific retry interval here.
//       }
//     }
//   }, config))
// }
