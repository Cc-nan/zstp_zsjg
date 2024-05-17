<script setup>
import { useTablePage } from '@/utils/zstp/useTablePage.js'
import { zstpRequest } from '@/api/zstp/axios.js'
import { useRoute, useRouter } from 'vue-router'
import EntityAddDialog from '@/views/zstp/kgms/entity/EntityAddDialog.vue'
import { ref } from 'vue'
import FilterItem from '@/components/zstp/FilterItem.vue'
import { ElMessage, ElMessageBox } from '@/utils/zstp/message.js'

const route = useRoute()
const router = useRouter()
const {
  loading,
  query,
  tableData,
  buildConfirmTableDataDeleteHandler,
  buildTableDataDeleteHandler,
  search,
  refresh,
  resetSearch,
  handlePageChange,
  handleSelectionChange,
  handleSizeChange,
  hasSelection,
  deleteResultHandler,
  selectionData
} = useTablePage({
  conceptId: {
    type: 'number',
    value: 0
  },
  kw: {
    type: 'string'
  },
  meaningTag: {
    type: 'string'
  }
}, getTableData)

function getTableData (query) {
  tableData.data = []
  return zstpRequest({
    url: `/edit/entity/${route.params.kgName}/list`,
    method: 'POST',
    data: {
      conceptId: [query.conceptId],
      page: query.pageNo,
      inherit: true,
      fuzzy: true,
      size: query.pageSize,
      kw: query.kw,
      meaningTag: query.meaningTag,
      type: 1,
      query: []
    }
  }, loading).then(data => {
    tableData.data = data.content
    tableData.total = data.totalElements
  })
}

const entityAddDialogRef = ref(null)

function handleAddEntity () {
  entityAddDialogRef.value.open({ id: query.conceptId })
}

function handleDeleteEntity(ids) {
  ElMessageBox.confirm(
    '此操作将永久删除选中实体，是否继续',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      zstpRequest({
        url: `/edit/entity/${route.params.kgName}/batch/delete`,
        method: 'POST',
        data: ids
      }).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        deleteResultHandler(ids.length)
      })
    }, () => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}

function editInstance (row) {
  router.push({
    name: 'zstpEntityEdit',
    query: {
      ...query,
      entityId: row.id
    }
  })
}
</script>

<template>
  <div class="entity-table">
    <div class="entity-table-header">
      <div class="header-left">
        <filter-item label="实体名称">
          <el-input v-model="query.kw" />
        </filter-item>
        <filter-item label="消岐项">
          <el-input v-model="query.meaningTag" />
        </filter-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div class="header-right">
        <el-space>
          <el-button
            v-if="query.conceptId"
            @click="handleAddEntity"
            type="primary">添加实体
          </el-button>
          <el-button
            :disabled="!hasSelection"
            @click="handleDeleteEntity(tableData.selection)"
            type="danger">批量删除
          </el-button>
        </el-space>
        <entity-add-dialog @entity-add="search" ref="entityAddDialogRef" />
      </div>
    </div>
    <el-divider />
    <div class="entity-table-main" v-loading="loading">
      <el-table
        height="100%"
        @selection-change="handleSelectionChange"
        :data="tableData.data" border>
        <el-table-column
          align="center"
          type="selection"
          width="60">
        </el-table-column>
        <el-table-column
          label="ID"
          prop="id"
          width="100">
          <template #default="scope">
            <div :title="scope.row.id" class="line-hidden">
              {{ scope.row.id }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          min-width="180px"
          show-overflow-tooltip>
          <template #default="scope">
            <div class="primary name" @click="goInstanceGraph(scope.row.id)">
              <div class="under-line">
                {{ scope.row.name }}
                <!--                <span v-html="highLight(scope.row.name, filterText)" class="under-line-span"></span>-->
                <i v-if="scope.row.meaningTag">&nbsp;({{ scope.row.meaningTag }}) </i>
              </div>
              <!--              <span v-if="scope.row.isNew" class="icon-new">new</span>-->
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="所属概念"
          prop="concept"
          show-overflow-tooltip>
          <template #default="scope">
            <span>
              {{ scope.row.parent.map(o => o.name).join('、') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="置信度"
          prop="reliability"
          width="190px">
          <template #default="scope">
            <div :title="scope.row.reliability" class="line-hidden num-modify">
              <div v-show="!scope.row.reliabilityInputVisible">
                <span
                  v-if="(scope.row.reliability && scope.row.reliability < 0.6 ) || scope.row.reliability === 0 "
                  class="low grade">低</span>
                <span v-if="scope.row.reliability && scope.row.reliability >= 0.6 && scope.row.reliability < 0.8"
                      class="middle grade">中</span>
                <span v-if="scope.row.reliability && scope.row.reliability >= 0.8"
                      class="high grade">高</span>
                <span>{{ scope.row.reliability }}</span>
              </div>
              <span v-if="scope.row.reliabilityInputVisible" class="scoreInput">
                 <el-input-number
                   v-model="scope.row.reliability"
                   :step="0.1"
                   size="mini">
                 </el-input-number>
                <!--<el-button size="mini" @click.stop="scoreSubmit(scope.row, 'reliability')">确定</el-button>-->
                <i class="ic-done table-icon table-icon-done" @click.stop="scoreSubmit(scope.row, 'reliability')"></i>
                <i class="ic-close table-icon table-icon-close" @click.stop="scoreCancel(scope.row, 'reliability')"></i>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="权重"
          prop="score"
          width="190px">
          <template #default="scope">
            <div :title="scope.row.score" class="line-hidden num-modify">
              <div v-show="!scope.row.scoreInputVisible">
                <span
                  v-if="(scope.row.score && scope.row.score < 0.6 ) || scope.row.score === 0 "
                  class="low grade">低</span>
                <span v-if="scope.row.score && scope.row.score >= 0.6 && scope.row.score < 0.8"
                      class="middle grade">中</span>
                <span v-if="scope.row.score && scope.row.score >= 0.8"
                      class="high grade">高</span>
                <span>{{ scope.row.score }}</span>
              </div>
              <span v-if="scope.row.scoreInputVisible" class="scoreInput">
                 <el-input-number
                   v-model="scope.row.score"
                   :step="0.1"
                   size="mini">
                 </el-input-number>
                <!--<el-button size="mini" @click.stop="scoreSubmit(scope.row, 'score')">确定</el-button>-->
                <i class="ic-done table-icon table-icon-done" @click.stop="scoreSubmit(scope.row, 'score')"></i>
                <i class="ic-close table-icon table-icon-close" @click.stop="scoreCancel(scope.row, 'score')"></i>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="updateTime"
          show-overflow-tooltip
          width="190px">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="170">
          <template #default="scope">
            <el-space>
              <el-link
                :underline="false"
                type="primary"
                @click="editInstance(scope.row)">{{ '编辑' }}
              </el-link>
              <el-link
                :underline="false"
                type="danger"
                @click="handleDeleteEntity([scope.row.id])">删除
              </el-link>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-divider />
    <div class="entity-table-footer">
      <el-pagination
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        v-model:current-page="query.pageNo"
        v-model:page-size="query.pageSize"
        layout="prev, next"
        :total="tableData.total" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.entity-table {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .entity-table-header {
    flex: none;
    display: flex;
    padding: 0 var(--pd-margin-padding-2);
    height: 55px;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      gap: var(--pd-margin-padding-2);
    }
  }

  .entity-table-main {
    height: 1px;
    flex: auto;
    padding: var(--pd-margin-padding-2);
  }

  .entity-table-footer {
    flex: none;
    padding: var(--pd-margin-padding-1) var(--pd-margin-padding-2);
    display: flex;
    justify-content: flex-end;
  }

  .el-divider {
    margin: 0;
  }
}
</style>
