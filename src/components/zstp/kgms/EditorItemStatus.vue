<script setup>
import { SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const props = defineProps({
  status: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <el-text :type="props.status" v-if="props.status" class="editor-item-status">
    <el-icon v-if="props.status === 'success'">
      <SuccessFilled />
    </el-icon>
    <el-icon v-if="props.status === 'danger'">
      <CircleCloseFilled />
    </el-icon>
    <el-text :type="props.status" v-if="props.message">{{ props.message }}</el-text>
  </el-text>

</template>

<style scoped lang="scss">

</style>
