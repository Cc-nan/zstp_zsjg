<script setup>

import PageContent from '@/components/zstp/PageContent.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { zstpRequest } from '@/api/zstp/axios.js'
import _ from 'lodash'
import { ElMessage } from '@/utils/zstp/message.js'
import { useEventBus } from '@vueuse/core'
import EditorItemStatus from '@/components/zstp/kgms/EditorItemStatus.vue'

const route = useRoute()
const router = useRouter()
const conceptTreeBus = useEventBus('conceptTree')

const goBack = () => {
  router.go(-1)
}

watch(() => route.query.conceptId, () => {
  requestConceptDetail()
}, {
  immediate: true
})

const conceptDetail = ref({})
const conceptDetailBackup = ref({})
const editStatusMap = ref({})

function requestConceptDetail () {
  zstpRequest({
    url: `/edit/basic/${route.params.kgName}/detail`,
    method: 'GET',
    params: {
      id: route.query.conceptId,
      isEntity: false
    }
  }).then((res) => {
    conceptDetail.value = res
    conceptDetailBackup.value = _.cloneDeep(res)
  })
}

function handleNameChange (field) {
  if (conceptDetail.value[field] !== conceptDetailBackup.value[field]) {
    zstpRequest({
      url: `/edit/concept/${route.params.kgName}/update`,
      method: 'POST',
      data: {
        id: conceptDetail.value.id,
        name: conceptDetail.value.name,
        meaningTag: conceptDetail.value.meaningTag,
        key: conceptDetail.value.key,
        type: 0
      }
    }).then(() => {
      conceptDetailBackup.value[field] = conceptDetail.value[field]
      editStatusMap.value[field] = {
        status: 'success'
      }
      if (field === 'name') {
        conceptTreeBus.emit('on-concept-name-update')
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
  if (conceptDetail.value.abs !== conceptDetailBackup.value.abs) {
    zstpRequest({
      url: `/edit/basic/${route.params.kgName}/update/abs`,
      method: 'POST',
      data: {
        id: conceptDetail.value.id,
        abs: conceptDetail.value.abs,
        concept: true
      }
    }).then(() => {
      conceptDetailBackup.value.abs = conceptDetail.value.abs
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

const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'change' },
    { min: 1, max: 50, message: '1-50个字符', trigger: 'change' }
  ]
}
</script>

<template>
  <div class="content-edit">
<!--    <div class="content-header">-->
<!--      <el-page-header @back="goBack">-->
<!--        <template #title>-->
<!--          &nbsp;-->
<!--        </template>-->
<!--        <template #content>-->
<!--          <el-text truncated :title="conceptDetail.name"> 概念编辑 > {{ conceptDetailBackup.name }}</el-text>-->
<!--        </template>-->
<!--      </el-page-header>-->
<!--    </div>-->
    <div class="content-main">
      <el-form :model="conceptDetail" label-width="120px" size="large" :rules="rules">
        <el-form-item label="ID" prop="id">
          {{ conceptDetail.id }}
        </el-form-item>
        <el-form-item label="父概念" prop="parent">
          <el-tag v-for="parent of conceptDetail.parent" :key="parent.id">{{ parent.name }}</el-tag>
        </el-form-item>
        <el-form-item label="子概念" prop="sons">
          <el-tag v-for="son of conceptDetail.sons" :key="son.id">{{ son.name }}</el-tag>
          <span v-if="!conceptDetail.sons?.length">无</span>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="conceptDetail.name" @blur="handleNameChange('name')"
                    @keyup.enter="handleNameChange('name')"></el-input>
          <editor-item-status :status="editStatusMap.name?.status" :message="editStatusMap.name?.message" />
        </el-form-item>
        <el-form-item label="消歧项" prop="meaningTag">
          <el-input v-model="conceptDetail.meaningTag" @blur="handleNameChange('meaningTag')"
                    @keyup.enter="handleNameChange('meaningTag')"></el-input>
          <editor-item-status :status="editStatusMap.meaningTag?.status" :message="editStatusMap.meaningTag?.message" />
        </el-form-item>
        <el-form-item label="唯一标识" prop="key">
          <el-input v-model="conceptDetail.key" @blur="handleNameChange('key')"
                    @keyup.enter="handleNameChange('key')"></el-input>
          <editor-item-status :status="editStatusMap.key?.status" :message="editStatusMap.key?.message" />
        </el-form-item>
        <!--        <el-form-item label="同义词" prop="synonym">-->
        <!--          <el-tag v-for="synonym of conceptDetail.synonym" :key="synonym">{{ synonym }}</el-tag>-->
        <!--        </el-form-item>-->
        <el-form-item label="描述" prop="abs">
          <el-input v-model="conceptDetail.abs" type="textarea" @blur="handleAbsChange"
                    @keyup.enter="handleAbsChange"></el-input>
          <editor-item-status :status="editStatusMap.abs?.status" :message="editStatusMap.abs?.message" />
        </el-form-item>
        <!--        <el-form-item label="图片" prop="imageUrl">-->
        <!--          <el-input v-model="conceptDetail.imageUrl"></el-input>-->
        <!--        </el-form-item>-->
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/zstp/styles/mixin" as *;
.content-edit {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;

  .content-header {
    flex: none;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: var(--pd-margin-padding-2);
  }

  .content-main {
    height: 1px;
    flex: auto;
    padding: 0 var(--pd-margin-padding-2) var(--pd-margin-padding-2);
    @include scroll();
  }

  .el-form {
    max-width: 600px;
  }

  .editor-item-status {
    position: absolute;
    right: -28px;
  }
}
</style>
