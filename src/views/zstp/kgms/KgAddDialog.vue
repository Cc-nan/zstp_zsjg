<script setup>
import { nextTick, ref } from 'vue'
import { ElMessage } from '@/utils/zstp/message.js'
import { zstpRequest } from '@/api/zstp/axios.js'

const title = '添加图谱'
const dialogVisible = ref(false)
const form = ref({
  name: ''
})

const open = () => {
  dialogVisible.value = true
  form.value.name = ''
  nextTick(() => {
    formRef.value.clearValidate()
  })
}

const emits = defineEmits(['on-success'])
function confirm () {
  formRef.value.validate().then((valid) => {
    if (valid) {
      zstpRequest({
        url: '/graph',
        method: 'POST',
        data: {
          title: form.value.name
        }
      }).then(() => {
        ElMessage.success('创建成功')
        emits('on-success')
        dialogVisible.value = false
      })
    }
  })
}

const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'change' },
    { min: 1, max: 50, message: '1-50个字符', trigger: 'change' }
  ]
}
const formRef = ref(null)

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="图谱名称：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
