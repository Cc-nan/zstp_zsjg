import { PdForceConfirmDialog } from '@/components/zstp/ForceConfirmDialog'
import { ElMessage, ElMessageBox } from '@/utils/zstp/message'
import { computed, getCurrentInstance, reactive, ref } from 'vue'

export function useTableData (config, requestTableData, keyField = 'id') {
  const appContext = getCurrentInstance()?.appContext
  const loading = ref(false) // table 数据加载时的loading状态
  const query = config || reactive({})
  query.kw = query.kw ?? ''
  query.pageNo = query.pageNo ?? 1
  query.pageSize = query.pageSize ?? 10
  const tableData = reactive({
    highlightText: '',
    deleteLoading: {},
    selection: [], // table中选中行的数据list,默认是id的数组
    data: [], // table中要展示的数据
    editData: null, // table中编辑的数据
    total: 0 // 列表全部数据条数
  })

  const hasSelection = computed(() => {
    return tableData.selection.length > 0
  })

  const selectionData = computed(() => {
    const { data, selection } = tableData
    return (data).filter(item => (selection).includes(item[keyField]))
  })

  function deleteResultHandler (length = 1) {
    if (tableData.data.length === length && query.pageNo > 1) {
      query.pageNo--
    }
    return requestTableData(query)
  }

  function goPage (page) {
    return handlePageChange(page)
  }

  function handlePageChange (val) {
    query.pageNo = val
    return requestTableData(query)
  }

  function handleSizeChange (val) {
    query.pageNo = 1
    query.pageSize = val
    return requestTableData(query)
  }

  // el-table @selection-change 时调用，默认记录id,可覆写
  function handleSelectionChange (v) {
    tableData.selection = v.map(v => v[keyField])
  }

  function search () {
    return handlePageChange(1)
  }

  function buildConfirmTableDataDeleteHandler (requestHandler, nameKey = 'name', formSize = 'default') {
    return (row, ...args) => {
      if (tableData.deleteLoading[row[keyField]]) {
        ElMessage.warning(`选中数据中的${row[nameKey]}已经在删除操作中，本次操作将被跳过`)
        return Promise.resolve(row)
      } else {
        tableData.deleteLoading[row[keyField]] = true
      }
      return PdForceConfirmDialog(appContext, row[nameKey], formSize).then(() => {
        return requestHandler(row, ...args).then(() => {
          ElMessage.success('删除成功')
          // 会判断是否需要加载前一页数据
          deleteResultHandler(row.length)
          return row
        })
      }).finally(() => {
        delete tableData.deleteLoading[row[keyField]]
      })
    }
  }

  function buildTableDataDeleteHandler (requestHandler, nameKey = 'name') {
    return (rows, ...args) => {
      const names = rows.map(row => row[nameKey]).join('、')
      return ElMessageBox.confirm(`此操作将永久删除${names}, 是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const names = []
        const newRows = []
        rows.forEach(row => {
          if (tableData.deleteLoading[row[keyField]]) {
            names.push(row[nameKey])
          } else {
            newRows.push(row)
            tableData.deleteLoading[row[keyField]] = true
          }
        })
        if (names.length) {
          ElMessage.warning(`选中数据中的${names.join('、')}已经在删除操作中，本次操作将被跳过`)
          if (names.length === rows.length) {
            return Promise.resolve(rows)
          }
        }
        return requestHandler(newRows, ...args).then(() => {
          ElMessage.success('删除成功')
          // 会判断是否需要加载前一页数据
          deleteResultHandler(newRows.length)
          return newRows
        }).finally(() => {
          newRows.forEach(row => {
            delete tableData.deleteLoading[row[keyField]]
          })
        })
      })
    }
  }

  return {
    query,
    loading,
    tableData,
    deleteResultHandler,
    goPage,
    handlePageChange,
    handleSizeChange,
    handleSelectionChange,
    hasSelection,
    selectionData,
    search,
    buildTableDataDeleteHandler,
    buildConfirmTableDataDeleteHandler
  }
}
