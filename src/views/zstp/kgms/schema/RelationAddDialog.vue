<script setup>
import { computed, ref } from 'vue'
import _ from 'lodash'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from '@/utils/zstp/message.js'
import { zstpRequest } from '@/api/zstp/axios.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const emits = defineEmits(['on-success'])

const kgName = computed(() => {
  return route.params.kgName
})

const title = '对象属性定义'
const dialogVisible = ref(false)

const tableData = ref([])
const conceptData = ref({})
const open = (data) => {
  conceptData.value = data
  tableData.value = getTableDataItem(5)
  requestTree()
  dialogVisible.value = true
}

const conceptTree = ref([])
function requestTree () {
  zstpRequest({
    url: `/edit/concept/${route.params.kgName}/0/tree`,
    method: 'POST'
  }).then((res) => {
    const root = []
    for (const item of res) {
      const parent = _.find(res, { id: item.conceptId })
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(item)
      } else {
        root.push(item)
      }
    }
    conceptTree.value = root[0]?.children || []
  })
}

function confirm () {
  const usefulData =_.filter(tableData.value, item => {
    return item.name && item.rangeValue?.length
  })
  if (usefulData?.length) {
    zstpRequest({
      url: `/definition/relation/${kgName.value}/batch/${conceptData.value.id}`,
      method: 'POST',
      data: usefulData
    }).then((res) => {
      const errorData = res.error
      if (errorData && errorData.length > 0) {
        res.success.forEach(item => {
          const index = _.findIndex(this.data, { name: item.origin.name })
          this.data.splice(index, 1)
        })
        // 错误信息处理
        const errorMsg = errorData[0].note
        ElMessage.error(errorMsg)
        return false
      }
      ElMessage({
        type: 'success',
        message: '成功添加'
      })
      emits('on-success')
      dialogVisible.value = false
    })
  } else {
    ElMessage.error('请至少填写一个属性名称和值域')
  }
}

function getTableDataItem (length = 1) {
  const arr = []
  for (let i = 0; i < length; i++) {
    arr.push({
      name: '',
      key: '',
      rangeValue: [],
      functional: 0,
      direction: 0,
      status: 0
    })
  }
  return arr
}

function handleAddTableDataItem (length = 1) {
  tableData.value.push(...getTableDataItem(length))
}

function deleteItem (rowData) {
  let index = rowData.$index
  tableData.value.splice(index, 1)
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    class="zstp-dialog-with-title-style"
    width="900">
    <div class="attribute-add-dialog-content">
      <el-table
        :data="tableData"
        :height="tableData.length < 10 ? undefined : '528px'"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="对象属性名称">
          <template #default="scope">
            <el-input
              class="form-item-input"
              :maxlength="50"
              v-model="scope.row.name"
              style="width: 100%"
              placeholder="请输入名称"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="key"
          label="唯一标识">
          <template #default="scope">
            <el-input placeholder="选填" :maxlength="50" class="tag-input"
                      v-model="scope.row.key"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="rangeValue"
          width="200"
          label="值域">
          <template #default="scope">
            <el-cascader
              :options="conceptTree"
              collapse-tags
              v-model="scope.row.rangeValue"
              :props="{ multiple: true, value: 'id',label: 'name', checkStrictly: true, emitPath: false }"
              clearable></el-cascader>
          </template>
        </el-table-column>
        <el-table-column
          prop="direction"
          width="120"
          label="指向">
          <template #default="scope">
            <el-select
              v-model="scope.row.direction"
              placeholder="请选择">
              <el-option
                label="正向"
                :value="0">
              </el-option>
              <el-option
                label="无向"
                :value="1">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="140" align="center">
          <!-- 自定义头部 -->
          <template #header>
            <div class="custom-header">
              <p class="custom-header-title">唯一性</p>
              <p class="custom-header-ps">(对象属性关系唯一)</p>
            </div>
          </template>
          <!-- 表格里面的功能 -->
          <template #default="scope">
            <el-checkbox v-model="scope.row.functional" class="centerCheck"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          label="">
          <template #default="scope">
            <el-link type="danger" :underline="false" @click="deleteItem(scope)">
              <el-icon>
                <Delete />
              </el-icon>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div class="tip">
          属性定义不支持添加重复属性，如有重复系统会自动忽略.
        </div>
        <el-space>
          <el-dropdown
            split-button
            type="primary"
            @command="handleAddTableDataItem"
            @click="handleAddTableDataItem(1)">
            继续添加
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="3">3个</el-dropdown-item>
                <el-dropdown-item :command="5">5个</el-dropdown-item>
                <el-dropdown-item :command="10">10个</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="primary" @click="confirm">
            全部添加
          </el-button>
        </el-space>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.attribute-add-dialog-content {
  margin: 0 calc(var(--el-dialog-padding-primary) * -1);

  .el-table {
    --el-table-header-bg-color: #ebeef5;
  }
}
.custom-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 55px;

  p {
    margin: 0;
    padding: 0;
  }

  .custom-header-ps {
    position: absolute;
    bottom: 0;
    font-size: 8px;
    line-height: 12px;
    color: #adadad;
  }
}
.dialog-footer {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  .tip {
    position: relative;
    color: var(--el-text-color-placeholder);

    &::before {
      content: "*";
      color: var(--el-color-danger);
      position: absolute;
      left: -8px;
    }
  }
}
</style>
