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
        v-for="attr of attrValue"
        :key="attr.id"
        :label="attr.name"
        :prop="attr.id">
        <el-input
          v-model="attr.dataValue"
          @blur="handleAbsChange"
          @keyup.enter="handleAttrChange(item)">
        </el-input>
        <editor-item-status :status="editStatusMap.abs?.status" :message="editStatusMap.abs?.message" />
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

  .editor-item-status {
    position: absolute;
    right: -28px;
  }
}
</style>
