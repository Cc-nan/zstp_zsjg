<script setup>
import { ref } from 'vue'
import { zstpRequest } from '@/api/zstp/axios.js'
import { useRoute } from 'vue-router'
import _ from 'lodash'
import EditorItemStatus from '@/components/zstp/kgms/EditorItemStatus.vue'
import { ElMessage } from '@/utils/zstp/message.js'

const route = useRoute()
const entity = ref({})
const entityBackup = ref({})
const editStatusMap = ref({})
const rules = {}

zstpRequest({
  url: `/edit/basic/${route.params.kgName}/detail`,
  method: 'GET',
  params: {
    id: route.query.entityId,
    isEntity: true
  }
}).then((res) => {
  // for (const attr of res.attrValue) {
  //   if (attr.dataType === 9 && !attr.dataValue) {
  //     attr.dataValue = {
  //       name: '',
  //       href: ''
  //     }
  //   }
  // }
  entity.value = res
  entityBackup.value = _.cloneDeep(res)
})

function handleNameChange (field) {
  if (entity.value[field] !== entityBackup.value[field]) {
    zstpRequest({
      url: `/edit/entity/${route.params.kgName}/update/name`,
      method: 'POST',
      data: {
        id: entity.value.id,
        name: entity.value.name,
        meaningTag: entity.value.meaningTag,
        key: entity.value.key,
        type: 0
      }
    }).then(() => {
      entityBackup.value[field] = entity.value[field]
      editStatusMap.value[field] = {
        status: 'success'
      }
    }, (error) => {
      if (error.message) {
        ElMessage.error(error.message)
      }
      editStatusMap.value[field] = {
        status: 'danger',
        message: '自动保存失败'
      }
    })
  }
}

function handleAbsChange () {
  if (entity.value.abs !== entityBackup.value.abs) {
    zstpRequest({
      url: `/edit/basic/${route.params.kgName}/update/abs`,
      method: 'POST',
      data: {
        id: entity.value.id,
        abs: entity.value.abs
      }
    }).then(() => {
      entityBackup.value.abs = entity.value.abs
      editStatusMap.value.abs = {
        status: 'success'
      }
    }, (error) => {
      if (error.message) {
        ElMessage.error(error.message)
      }
      editStatusMap.value.abs = {
        status: 'danger',
        message: '自动保存失败'
      }
    })
  }
}

function handleAttrChange (attr) {
  console.log(attr)
  const backupAttr = entityBackup.value.attrValue.find(item => item.id === attr.id)
  if (attr.dataValue !== backupAttr.dataValue) {
    zstpRequest({
      url: `/edit/entity/${route.params.kgName}/number/update`,
      method: 'POST',
      data: {
        entityId: route.query.entityId,
        attrValue: attr.dataValue,
        attrId: attr.id
      }
    }).then(() => {
      backupAttr.dataValue = attr.dataValue
      editStatusMap.value['attr-id-' + attr.id] = {
        status: 'success'
      }
    })
  }
}
</script>

<template>
  <div class="entity-detail-edit">
    <el-form
      ref="formRef"
      style="max-width: 600px"
      :model="entity"
      :rules="rules"
      label-width="auto"
      class="entity-detail-edit-form"
      size="large"
      status-icon>
      <el-form-item label="ID" prop="id">
        {{ entity.id }}
      </el-form-item>
      <el-form-item label="所属概念" prop="parent">
        <el-tag v-for="parent of (entity.parent || [])" :key="parent.id">{{ parent.name }}</el-tag>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="entity.name" @blur="handleNameChange('name')"
                  @keyup.enter="handleNameChange('name')"></el-input>
        <editor-item-status :status="editStatusMap.name?.status" :message="editStatusMap.name?.message" />
      </el-form-item>
      <el-form-item label="消歧项" prop="meaningTag">
        <el-input v-model="entity.meaningTag" @blur="handleNameChange('meaningTag')"
                  @keyup.enter="handleNameChange('meaningTag')"></el-input>
        <editor-item-status :status="editStatusMap.meaningTag?.status" :message="editStatusMap.meaningTag?.message" />
      </el-form-item>
      <el-form-item label="唯一标识" prop="key">
        <el-input v-model="entity.key" @blur="handleNameChange('key')"
                  @keyup.enter="handleNameChange('key')"></el-input>
        <editor-item-status :status="editStatusMap.key?.status" :message="editStatusMap.key?.message" />
      </el-form-item>
      <el-form-item label="描述" prop="abs">
        <el-input v-model="entity.abs" type="textarea" @blur="handleAbsChange"
                  @keyup.enter="handleAbsChange"></el-input>
        <editor-item-status :status="editStatusMap.abs?.status" :message="editStatusMap.abs?.message" />
      </el-form-item>
      <el-form-item
        v-for="attr of entity.attrValue"
        :key="attr.id"
        :label="attr.name"
        :prop="attr.id">
        <el-input-number
          v-if="attr.dataType === 1"
          v-model="attr.dataValue"
          :step="1"
          step-strictly
          @change="handleAttrChange(attr)">
        </el-input-number>
        <el-input-number
          v-if="attr.dataType === 2"
          v-model="attr.dataValue"
          :step="0.1"
          @change="handleAttrChange(attr)">
        </el-input-number>
        <el-date-picker
          class="el-date-picker"
          type="datetime"
          v-if="attr.dataType === 4"
          v-model="attr.dataValue"
          format="YYYY-MM-DD hh:mm:ss"
          value-format="YYYY-MM-DD hh:mm:ss"
          @change="handleAttrChange(attr)">
        </el-date-picker>
<!--        <el-date-picker-->
<!--          class="el-date-picker"-->
<!--          type="date"-->
<!--          v-if="attr.dataType === 41"-->
<!--          v-model="attr.dataValue"-->
<!--          format="YYYY-MM-DD"-->
<!--          value-format="YYYY-MM-DD"-->
<!--          @change="handleAttrChange(attr)">-->
<!--        </el-date-picker>-->

        <el-input
          v-if="attr.dataType === 5"
          v-model="attr.dataValue"
          @blur="handleAttrChange(attr)"
          @keyup.enter="handleAttrChange(attr)">
        </el-input>
        <el-input
          v-if="attr.dataType === 10"
          v-model="attr.dataValue"
          type="textarea"
          @blur="handleAttrChange(attr)"
          @keyup.enter="handleAttrChange(attr)">
        </el-input>
        <div v-if="attr.dataType === 9">
          {{ attr.dataValue }}
        </div>
        <editor-item-status :status="editStatusMap['attr-id-' + attr.id]?.status" :message="editStatusMap['attr-id-' + attr.id]?.message" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/zstp/styles/mixin" as *;

.entity-detail-edit {
  padding: var(--pd-margin-padding-2);
  @include scroll();
  width: 100%;

  .el-input-number, :deep(.el-date-editor) {
    width: 100%;
  }

  .editor-item-status {
    position: absolute;
    right: -28px;
  }
}
</style>
