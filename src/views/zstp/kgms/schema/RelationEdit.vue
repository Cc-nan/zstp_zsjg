<script setup>

import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { zstpRequest } from '@/api/zstp/axios.js'
import { ElMessage } from '@/utils/zstp/message.js'
import { useZstpKgStore } from '@/store/zstp/kg.js'

const route = useRoute()
const kgStore = useZstpKgStore()
kgStore.requestConcept()
const conceptTree = computed(() => {
  return kgStore.conceptTree?.[0]?.children || []
})

watch(() => route.query.conceptId, () => {
  requestConceptDetail()
}, {
  immediate: true
})

const attrDetail = ref({})

function requestConceptDetail () {
  zstpRequest({
    url: `/edit/attribute/${route.params.kgName}/info/${route.query.attrId}`,
    method: 'GET'
  }).then((res) => {
    attrDetail.value = res
  })
}

function handleSave () {
  zstpRequest({
    url: `/edit/attribute/${route.params.kgName}/definition/update`,
    method: 'POST',
    data: attrDetail.value
  }).then(() => {
    ElMessage.success('修改成功')
  })
}

const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'change' },
    { min: 1, max: 50, message: '1-50个字符', trigger: 'change' }
  ],
  rangeValue: [
    { required: true, message: '请选择值域', trigger: 'change' }
  ]
}
</script>

<template>
  <div class="content-edit">
    <div class="content-main">
      <div class="content-main-header">
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
      <el-form :model="attrDetail" label-width="120px" size="large" :rules="rules">
        <el-form-item label="属性ID" prop="id">
          {{ attrDetail.id }}
        </el-form-item>
        <el-form-item label="定义域" prop="domainName">
          <el-input v-model="attrDetail.domainName" disabled readonly></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="attrDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="唯一标识" prop="key">
          <el-input v-model="attrDetail.key"></el-input>
        </el-form-item>
        <el-form-item label="别称" prop="synonym">
          <el-tag v-for="synonym of attrDetail.synonym" :key="synonym">{{ synonym }}</el-tag>
        </el-form-item>
        <el-form-item label="索引" prop="indexed">
          <el-radio-group v-model="attrDetail.indexed" disabled>
            <el-radio :value="1">添加</el-radio>
            <el-radio :value="0">不添加</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="属性多值" prop="functional">
          <el-radio-group v-model="attrDetail.functional" disabled>
            <el-radio :value="1">不支持</el-radio>
            <el-radio :value="0">支持</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="指向" prop="direction">
          <el-select v-model="attrDetail.direction" disabled size="large">
            <el-option :value="1">无向</el-option>
            <el-option :value="0">正向</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值域" prop="rangeValue">
          <el-cascader
            :options="conceptTree"
            collapse-tags
            v-model="attrDetail.rangeValue"
            :props="{ multiple: true, value: 'id',label: 'name', checkStrictly: true, emitPath: false }"
            clearable></el-cascader>
        </el-form-item>
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

    .content-main-header {
      text-align: right;
      padding: var(--pd-margin-padding-2);
    }
  }

  .el-form {
    max-width: 600px;

    .el-cascader {
      width: 100%;
    }
  }
}
</style>
