<script setup>
import { computed, ref } from 'vue'
import { zstpRequest } from '@/api/zstp/axios.js'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from '@/utils/zstp/message.js'
import { useZstpKgStore } from '@/store/zstp/kg.js'
import _ from 'lodash'

const emits = defineEmits(['entity-add'])
const dialogVisible = ref(false)
const parent = ref({})
const getFormItem = (length = 1) => {
  const arr = []
  const key = formList.value.at(-1)?.key || 0
  for (let i = 0; i < length; i++) {
    arr.push({
      key: key + 1 + i,
      name: '',
      description: ''
    })
  }
  return arr
}
const formList = ref([])
const handleAddFormItem = (length) => {
  formList.value.push(...getFormItem(length))
}
const route = useRoute()
const router = useRouter()
const kgStore = useZstpKgStore()

const open = (parentData) => {
  parent.value = _.find(kgStore.conceptList, ['id', parentData.id]) || parentData
  formList.value = getFormItem(2)

  dialogVisible.value = true
}
const title = computed(() => {
  if (parent.value.name) {
    return `创建 ${parent.value.name} 的实体`
  } else  {
    return '添加实体'
  }
})

const kgName = computed(() => {
  return route.params.kgName
})
const handleAddConcept = (formItem) => {
  return zstpRequest({
    url: `/edit/entity/${kgName.value}/add`,
    method: 'POST',
    data: {
      name: formItem.name,
      meaningTag: formItem.meaningTag,
      conceptId: parent.value.id,
      type: 1
    }
  }).then((res) => {
    formItem.id = res
    emits('entity-add')
  })
}

const handleEditConcept = (formItem) => {
  router.push({
    name: 'zstpEntityEdit',
    params: {
      kgName: route.params.kgName
    },
    query: {
      conceptId: parent.value.id,
      entityId: formItem.id
    }
  })
  dialogVisible.value = false
}

const handleDeleteConcept = (formItem) => {
  zstpRequest({
    url: `/edit/basic/${kgName.value}/delete/${formItem.id}?concept=true`
  }).then(() => {
    const index = formList.value.findIndex(item => item.key === formItem.key)
    formList.value.splice(index, 1)
    ElMessage.success('删除成功')
  })
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :title="title"
    class="zstp-dialog-with-title-style"
    width="500">
    <div class="form-list">
      <div class="form-item" v-for="formItem of formList" :key="formItem.key">
        <div class="form-item-input">
          <el-input v-model="formItem.name" :disabled="formItem.id" class="form-item-name" placeholder="请输入概念名" />
          <el-input v-model="formItem.meaningTag" :disabled="formItem.id" class="form-item-meaningTag"
                    placeholder="请输入消歧项" />
        </div>
        <div class="form-item-tool">
          <el-space>
            <el-button
              v-if="!formItem.id"
              type="primary"
              key="add"
              @click="handleAddConcept(formItem)"
              :disabled="!formItem.name">添加
            </el-button>
            <el-link
              :underline="false"
              v-if="formItem.id"
              type="success"
              key="edit"
              @click="handleEditConcept(formItem)"
              :disabled="!formItem.name">编辑
            </el-link>
            <el-link
              :underline="false"
              v-if="formItem.id"
              type="danger"
              key="delete"
              @click="handleDeleteConcept(formItem)"
              :disabled="!formItem.name">删除
            </el-link>
          </el-space>
        </div>
      </div>
    </div>
    <template #footer>
      <el-dropdown
        split-button
        type="primary"
        @command="handleAddFormItem"
        @click="handleAddFormItem(1)">
        继续添加
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="3">3个</el-dropdown-item>
            <el-dropdown-item :command="5">5个</el-dropdown-item>
            <el-dropdown-item :command="10">10个</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
@use "@/assets/zstp/styles/mixin" as *;

.form-list {
  max-height: 60vh;
  @include scroll();

  .form-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--pd-margin-padding-2);
    margin-bottom: var(--pd-margin-padding-1);

    .form-item-input {
      display: flex;
      flex: auto;
      gap: var(--pd-margin-padding-1);
    }

    .form-item-tool {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      flex: none;
    }
  }
}
</style>
