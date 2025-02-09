<script setup>

import PageContent from '@/components/zstp/PageContent.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { zstpRequest } from '@/api/zstp/axios.js'
import { useConfig } from '@/utils/zstp/useConfig.js'
import { ElMessage } from '@/utils/zstp/message.js'

const config = useConfig()
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

const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'change' },
    { min: 1, max: 50, message: '1-50个字符', trigger: 'change' }
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
        <!--        <el-form-item label="别称" prop="synonym">-->
        <!--          <el-tag v-for="synonym of attrDetail.synonym" :key="synonym">{{ synonym }}</el-tag>-->
        <!--        </el-form-item>-->
        <el-form-item label="数据类型" prop="synonym">
          <el-select
            @change="dataTypeChange(scope.row)"
            v-model="attrDetail.dataType"
            placeholder="请选择">
            <el-option
              v-for="(label, key) in config.dataTypeMap"
              :key="key"
              :label="label"
              :title="label"
              :value="Number(key)">
            </el-option>
          </el-select>
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
  }
}
</style>
