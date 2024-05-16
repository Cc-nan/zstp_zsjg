<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    class="dialog-mini"
    :title="'确认删除'">
    <div>
      <div class="tip-line">
        <span>
          '请输入'
          <span class="title">{{ title }}</span>
          '来执行此次删除操作'
        </span>
      </div>
      <el-input v-model="confirmTitle" :size="props.formSize" @keydown.enter="handleDelete"/>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleDelete" :disabled="title !== confirmTitle">
        确认
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from '@/utils/zstp/message'
import { isRef, ref } from 'vue'

const props = defineProps({
  formSize: {
    type: String,
    default: 'default'
  },
  callback: {
    type: Function
  }
})
const emits = defineEmits(['close', 'success'])
const visible = ref(false)
const title = ref('')
const confirmTitle = ref('')

function handleOpen (v) {
  visible.value = true
  title.value = isRef(v) ? v.value : v
}

function handleClose () {
  visible.value = false
  confirmTitle.value = ''
  emits('close')
  props.callback?.('close')
}

function handleDelete () {
  if (title.value !== confirmTitle.value) {
    ElMessage({
      type: 'error',
      message: '输入内容不正确'
    })
  } else {
    visible.value = false
    confirmTitle.value = ''
    emits('success')
    props.callback?.('success')
  }
}

defineExpose({ handleClose, handleOpen })
</script>

<style scoped lang="scss">
.tip-line {
  margin-bottom: var(--pd-margin-padding-2);
  white-space: pre-line;
}

.title {
  padding: 2px 4px;
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
  border-radius: var(--el-border-radius-base);
}
</style>
