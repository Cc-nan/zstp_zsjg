<script setup>
import { ref } from 'vue'
import { zstpRequest } from '@/api/zstp/axios.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const entity = ref({})
const rules = {}

zstpRequest({
  url: `/edit/basic/${route.params.kgName}/detail`,
  method: 'GET',
  params: {
    id: route.query.entityId,
    isEntity: true
  }
}).then((res) => {
  console.log(res)
})
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
      <el-form-item label="所属概念" prop="parent">
        <el-tag v-for="parent of (entity.parent || [])" :key="parent.id">{{ parent.name }}</el-tag>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/zstp/styles/mixin" as *;

.entity-detail-edit {
  padding: var(--pd-margin-padding-2);
  @include scroll();
}
</style>
