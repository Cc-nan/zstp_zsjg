<script setup>
import { ref } from 'vue'

const title = 'Title'
const dialogVisible = ref(false)

const open = () => {
  dialogVisible.value = true
}

function confirm () {
  dialogVisible.value = false
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500">
    <div>This is a message</div>
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
