<script setup>
import { computed, ref } from 'vue'
import _ from 'lodash'
import { Delete } from '@element-plus/icons-vue'
import { useConfig } from '@/utils/zstp/useConfig.js'
import { ElMessage } from '@/utils/zstp/message.js'
import { zstpRequest } from '@/api/zstp/axios.js'
import { useRoute } from 'vue-router'

const config = useConfig()
const route = useRoute()
const emits = defineEmits(['on-success'])

const kgName = computed(() => {
  return route.params.kgName
})

const title = '数值属性定义'
const dialogVisible = ref(false)

const tableData = ref([])
const conceptData = ref({})
const open = (data) => {
  conceptData.value = data
  tableData.value = getTableDataItem(5)
  dialogVisible.value = true
}

function confirm () {
  const usefulData =_.filter(tableData.value, item => {
    return item.name
  })
  if (usefulData?.length) {
    zstpRequest({
      url: `/definition/numeric/${kgName.value}/batch/${conceptData.value.id}`,
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
    ElMessage.error('请至少填写一个属性名称')
  }
}

function getTableDataItem (length = 1) {
  const arr = []
  for (let i = 0; i < length; i++) {
    arr.push({
      name: '',
      indexed: 0,
      dataType: 5,
      dataUnit: '',
      functional: 1
    })
  }
  return arr
}

function getRowIndexedDisabled (data) {
  return data.dataType === 10 || data.dataType === 9
}

function handleAddTableDataItem (length = 1) {
  tableData.value.push(...getTableDataItem(length))
}

function deleteItem (rowData) {
  let index = rowData.$index
  tableData.value.splice(index, 1)
}

function dataTypeChange (data) {
  if (data.dataType > 2) {
    data.dataUnit = ''
  }
  data.indexed = 0
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="900">
    <div class="attribute-add-dialog-content">
      <el-table
        :data="tableData"
        :height="tableData.length < 10 ? undefined : '528px'"
        style="width: 100%">
        <el-table-column
          prop="name"
          width="200"
          label="数值属性名称">
          <template #default="scope">
            <el-input size="small" :maxlength="50" v-model.trim="scope.row.name"
                      placeholder="请输入名称"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="key"
          label="唯一标识">
          <template #default="scope">
            <el-input placeholder="选填" :maxlength="50" size="small" class="tag-input"
                      v-model.trim="scope.row.key"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="dataType"
          width="200">
          <template #header>
            数据类型
          </template>
          <template #default="scope">
            <el-select
              size="small"
              @change="dataTypeChange(scope.row)"
              v-model="scope.row.dataType"
              placeholder="请选择">
              <el-option
                v-for="(label, key) in config.dataTypeMap"
                :key="key"
                :label="label"
                :title="label"
                :value="Number(key)">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="indexed"
          width="80"
          align="center"
          label="添加索引">
          <template #default="scope">
            <el-checkbox
              v-model="scope.row.indexed"
              :disabled="getRowIndexedDisabled(scope.row)"
              :true-value="1"
              :false-value="0"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="functional"
          width="80"
          align="center"
          label="属性多值">
          <template #default="scope">
            <el-checkbox
              v-model="scope.row.functional"
              :true-value="0"
              :false-value="1"></el-checkbox>
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
