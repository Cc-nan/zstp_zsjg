<script setup>

import PageContent from '@/components/zstp/PageContent.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { zstpRequest } from '@/api/zstp/axios.js'
import { ElMessage } from '@/utils/zstp/message.js'

const route = useRoute()
const router = useRouter()
const goBack = () => {
  router.go(-1)
}

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
</script>

<template>
  <page-content no-breadcrumb no-main-gap no-margin class="content-edit">
    <template #main-top-left>
      <el-page-header @back="goBack">
        <template #title>
          &nbsp;
        </template>
        <template #content>
          <el-text truncated :title="attrDetail.name"> 对象属性编辑 > {{ attrDetail.name }} </el-text>
        </template>
      </el-page-header>
    </template>
    <template #main-top-right>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
    <template #main-table>
      <el-form :model="attrDetail" label-width="120px" size="large">
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
        <el-form-item label="值域" prop="range">
          {{ attrDetail.rangeName?.join('、') }}
        </el-form-item>
      </el-form>
    </template>
  </page-content>
</template>

<style scoped lang="scss">
.content-edit {
  .el-form {
    max-width: 600px;
  }
}
</style>
