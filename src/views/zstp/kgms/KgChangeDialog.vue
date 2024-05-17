<script setup>
import { ref } from 'vue'
import { useZstpKgStore } from '@/store/zstp/kg.js'

const kgStore = useZstpKgStore()
const title = '切换图谱'
const dialogVisible = ref(false)
const form = ref({
  kgName: ''
})

const open = () => {
  dialogVisible.value = true
  form.value.kgName = kgStore.kgName
}

const emits = defineEmits(['kg-change'])
function confirm () {
  emits('kg-change', form.value.kgName)
  dialogVisible.value = false
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    class="zstp-dialog-with-title-style"
    :title="title"
    width="500">
    <el-radio-group v-model="form.kgName">
      <el-radio
        v-for="item of kgStore.kgList"
        :key="item.kgName"
        :value="item.kgName"
        border>{{ item.title }}</el-radio>
    </el-radio-group>
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
