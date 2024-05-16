<script setup>

import PageContent from '@/components/zstp/PageContent.vue'
import { zstpRequest } from '@/api/zstp/axios.js'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { useConfig } from '@/utils/zstp/useConfig.js'
import { useTablePage } from '@/utils/zstp/useTablePage.js'
import _ from 'lodash'
import AttributeAddDialog from '@/views/zstp/kgms/schema/AttributeAddDialog.vue'
import RelationAddDialog from '@/views/zstp/kgms/schema/RelationAddDialog.vue'
import { ElMessage, ElMessageBox } from '@/utils/zstp/message.js'

const route = useRoute()
const router = useRouter()
const getTableData = _.debounce(() => {
  return zstpRequest({
    url: `/edit/attribute/${route.params.kgName}?conceptId=${query.conceptId}`,
    method: 'GET'
  }, loading).then((res) => {
    tableData.data = res
  })
}, 300, {
  trailing: true,
  leading: false
})
const {query, loading, tableData} = useTablePage({
  conceptId: {
    type: 'number',
    value: 0
  }
}, getTableData)

watch(() => query.conceptId.value, () => {
  getTableData()
}, {
  immediate: true
})

const config = useConfig()
function getAttrType (data) {
  let type = ''
  let obj = config.value.dataTypeMap
  if (data.type.toString() === '0') {
    type = obj[data.dataType] || '数值'
  } else if (data.type === 2) {
    if (data.composeType === 1) {
      type = '时空'
    } else if (data.composeType > 20) {
      type = `多模态（${config.value.composeTypeMap[data.composeType]}）`
    }
  } else {
    type = '对象'
  }
  return type
}

const handleEditConcept = () => {
  router.push({
    name: 'zstpConceptEdit',
    params: {
      kgName: route.params.kgName
    },
    query: {
      conceptId: query.conceptId
    }
  })
}

const attributeAddDialogRef = ref(null)
const relationAddDialogRef = ref(null)
function addNumericalAttributeBtn () {
  attributeAddDialogRef.value.open({
    id: query.conceptId
  })
}
function addObjectAttributeBtn () {
  relationAddDialogRef.value.open({
    id: query.conceptId
  })
}

function editAttrBtn (row) {
  let name = 'zstpAttributeEdit'
  if (row.type === 1) {
    name = 'zstpRelationEdit'
  }
  router.push({
    name,
    query: {
      ...route.query,
      attrId: row.id
    }
  })
}

function confirmDeleteAttrBtn (row) {
  ElMessageBox.confirm('确认删除属性"' + row.name + '" 吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  }).then(() => {
      return zstpRequest({
        url: `/edit/attribute/${route.params.kgName}/definition/delete/${row.id}`,
        method: 'POST'
      }).then(() => {
        getTableData()
      })
    }, () => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}
function deleteConceptBtn () {
  ElMessageBox.confirm('确认删除概念吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  }).then(() => {
      return zstpRequest({
        url: `/edit/basic/${route.params.kgName}/delete/${query.conceptId}?force=true&concept=true`,
        method: 'POST'
      }).then(() => {
        router.replace({
          name: 'zstpAttributeTable',
          params: {
            kgName: route.params.kgName
          }
        })
      })
    }, () => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}
</script>

<template>
  <page-content class="attribute-table" no-breadcrumb no-main-gap no-margin>
    <template #main-top-left>
      本体建模
    </template>
    <template #main-top-right>
      <el-space>
        <el-button-group class="button-group" v-if="query.conceptId !== 0">
          <el-button @click="handleEditConcept" class="" plain type="primary">
            编辑概念
          </el-button>
          <el-button @click="addNumericalAttributeBtn" class="" plain
                     type="primary">
            添加数值属性
          </el-button>
          <el-button @click="addObjectAttributeBtn" class="" plain type="primary">
            添加对象属性
          </el-button>
          <!--          <el-button @click="timeSpaceVisible = true" plain size="small" type="primary" :disabled="$menuPower.isRead">-->
          <!--            添加时空属性-->
          <!--          </el-button>-->
          <!--          <el-button @click="mediaVisible = true" plain size="small" type="primary" :disabled="$menuPower.isRead">-->
          <!--            添加多模态属性-->
          <!--          </el-button>-->
        </el-button-group>
        <el-button v-if="query.conceptId !== 0"
                   @click="deleteConceptBtn" class="deleteConceptBtn" type="danger"
                   plain>
          删除概念
        </el-button>
      </el-space>
      <attribute-add-dialog @on-success="getTableData" ref="attributeAddDialogRef"/>
      <relation-add-dialog @on-success="getTableData"  ref="relationAddDialogRef"/>
    </template>
    <template #main-table>
      <el-table
        v-loading="loading"
        border
        @selection-change="handleSelectionChange"
        :data="tableData.data"
        height="100%">
        <el-table-column
          prop="id"
          label="ID"
          width="100"
          align="left">
          <template #default="scope">
            <div class="line-hidden" :title="scope.row.id">
              {{ scope.row.id }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          sortable
          sort-by="name"
          min-width="120"
          show-overflow-tooltip
          label="属性名">
          <template #default="scope">
            <span class="primary">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          sort-by="conceptName"
          min-width="120"
          show-overflow-tooltip
          label="所属概念">
          <template #default="scope">
            <div class="line-hidden" :title="scope.row.conceptName">
              {{ scope.row.domainName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          sort-by="type"
          min-width="120"
          label="属性类型">
          <template #default="scope">
            <div class="line-hidden">
              {{ getAttrType(scope.row) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          sort-by="rangeValue"
          show-overflow-tooltip
          label="值域">
          <template #default="scope">
            {{ (scope.row.rangeName || []).join('、') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template #default="scope">
            <el-space>
              <el-link
                type="primary"
                plain
                :underline="false"
                size="small"
                @click="editAttrBtn(scope.row)">
                {{ '编辑' }}
              </el-link>

              <el-link
                type="danger"
                plain
                :underline="false"
                @click="confirmDeleteAttrBtn(scope.row)"
                size="small">
                删除
              </el-link>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </page-content>
</template>

<style scoped lang="scss">
.attribute-table {
  .el-table {
    --el-table-header-bg-color: #ebeef5;
  }
}
</style>
