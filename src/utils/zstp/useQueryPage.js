import _ from 'lodash'
import { nextTick, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useQueryPage (config, handleRouteChange) {
  const route = useRoute()
  const router = useRouter()
  const defaultQueryConfig = reactive(Object.assign({}, config))
  const queryConfig = reactive({})

  function buildURLQuery (q = queryConfig) {
    const settings = defaultQueryConfig
    const query = Object.assign({}, route.query)
    query._t = new Date().getTime()
    Object.entries(q).forEach(([k, value]) => {
      const config = settings[k]
      let key = k
      let defaultValue
      let reserveTransform
      if (settings[k] instanceof Object) {
        const { map, transform, value: settingsValue } = config
        reserveTransform = config.reserveTransform
        key = map || k
        if (transform) {
          defaultValue = transform(settingsValue, q)
        } else {
          defaultValue = settingsValue
        }
      } else {
        defaultValue = settings[k]
      }
      if (!_.isEqual(defaultValue, value) && (value || value === 0)) {
        if (reserveTransform) {
          query[key] = reserveTransform(value, q)
        } else {
          query[key] = value instanceof Object ? JSON.stringify(value) : value.toString()
        }
      } else {
        delete query[key]
      }
    })
    return query
  }

  function updatePageURL (isReplace = true, q = queryConfig) {
    const query = buildURLQuery(q)
    if (isReplace) {
      router.replace({
        query
      })
    } else {
      router.push({
        query
      })
    }
  }

  function refresh () {
    updatePageURL()
  }

  function transformQueryValue (rv, type, config, query) {
    const isObject = config instanceof Object
    if (isObject && config.transform) {
      rv = config.transform(rv, query)
    } else {
      switch (type) {
        case 'number':
          rv = parseFloat(rv)
          if (isNaN(rv)) {
            rv = isObject ? config.value : config
          }
          break
        case 'boolean':
          rv = Boolean(rv)
          break
        case 'json':
          rv = typeof rv === 'string' ? JSON.parse(rv) : rv
          break
      }
    }
    return rv
  }

  watch(() => route.query, () => {
    const query = route.query || {}
    const settings = defaultQueryConfig
    Object.keys(settings).forEach(k => {
      const config = settings[k]
      const isObject = config instanceof Object
      const v = query[isObject ? config.map || k : k]
      const type = isObject ? config.type || typeof config.value : typeof config
      let rv = ((typeof v === 'string' || typeof v === type) ? v : isObject ? config.value : config)
      rv = transformQueryValue(rv, type, config, query)
      queryConfig[k] = rv
    })
    nextTick(() => {
      handleRouteChange?.(queryConfig)
    })
  }, {
    immediate: true
  })

  return {
    default: defaultQueryConfig,
    query: queryConfig,
    updatePageURL,
    refresh
  }
}
