<script setup>

import ConceptTree from '@/components/zstp/kgms/ConceptTree.vue'
import PageContent from '@/components/zstp/PageContent.vue'
import { RouterView, useRouter } from 'vue-router'
import { useQueryPage } from '@/utils/zstp/useQueryPage.js'
import { ref } from 'vue'
import ConceptAddDialog from '@/views/zstp/kgms/schema/ConceptAddDialog.vue'

const {
  query
} = useQueryPage({
  conceptId: {
    type: 'number',
    value: 0
  }
})

// const route = useRoute()
const router = useRouter()

function handleTreeNodeClick (data) {
  router.push({
    name: 'zstpEntityList',
    query: {
      conceptId: data.id
    }
  })
}

</script>

<template>
  <page-content class="schema-definition" no-main-gap>
    <template #main-left>
      <!--      {{query.conceptId}}-->
    </template>
    <template #main-center>
      <div class="schema-definition-content">
        <concept-tree
          @node-click="handleTreeNodeClick"
          v-model:concept-id="query.conceptId">
          <template #default="{data}">
            <div class="concept-item" :title="data.name">
              <el-text truncated class="concept-name">{{ data.name }}</el-text>
            </div>
          </template>
        </concept-tree>
        <el-divider direction="vertical"></el-divider>
        <RouterView />
      </div>
    </template>
  </page-content>
</template>

<style scoped lang="scss">
@use "@/assets/zstp/styles/mixin" as *;

.schema-definition {

  .schema-definition-content{
    display: flex;
    height: 100%;

    .el-divider{
      height: 100%;
      margin: 0;
    }
  }

  .concept-item {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: var(--pd-margin-padding-1);

    .concept-name {
      flex: auto;
      width: 1px;
    }

    .concept-add-icon {
      flex: none;
      margin-right: var(--pd-margin-padding-1);
    }
  }
}
</style>
