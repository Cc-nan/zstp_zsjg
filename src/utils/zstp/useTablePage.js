import _ from 'lodash'
import { useQueryPage } from '@/utils/zstp/useQueryPage'
import { useTableData } from '@/utils/zstp/useTableData'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

export function useTablePage (config, getTableData, autoInit = true, keyField = 'id') {
  const route = useRoute()
  const router = useRouter()
  const inited = ref(autoInit) // 是否已初始化，设为false,将不自动调用getTableData来获取列表数据
  const tableConfig = _.merge({ // 参数的定义，禁止直接使用this.query.default.xx，使用this.query.xx；转换的方法在QueryPageMixin中
    pageNo: {
      value: 1, // 默认值
      type: 'number', // 值类型 number,string,json
      map: 'p' // 参数缩写
    },
    pageSize: {
      value: 20,
      type: 'number',
      map: 's'
    },
    kw: '' // 简写，类型默认string
  }, config)
  const queryPage = useQueryPage(tableConfig, (query) => {
    tableData.tableData.highlightText = query.kw
    if (!inited.value) {
      return
    }
    return getTableData(query)
  })
  const tableData = useTableData(queryPage.query, (query) => {
    return new Promise(resolve => {
      queryPage.updatePageURL()
      resolve(query)
    })
  }, keyField)

  // 清空query的搜索
  function resetSearch (exclude) {
    const query = Object.assign({}, route.query)
    for (const key of Object.keys(queryPage.default)) {
      if (!exclude.includes(key)) {
        delete query[key]
      }
    }
    query._t = new Date().getTime()
    router.push({
      query
    })
  }

  return Object.assign(queryPage, tableData, {
    inited,
    resetSearch
  })
}
