<script setup>

import ConceptTree from '@/components/zstp/kgms/ConceptTree.vue'
import PageContent from '@/components/zstp/PageContent.vue'
import { RouterView, useRouter } from 'vue-router'
import { useQueryPage } from '@/utils/zstp/useQueryPage.js'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
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

const conceptAddDialogRef = ref(null)

function handleAddConcept (data) {
  conceptAddDialogRef.value.open(data)
}

function handleTreeNodeClick (data) {
  router.push({
    name: 'zstpAttributeTable',
    query: {
      conceptId: data.id
    }
  })
}

</script>

<template>
  <page-content class="schema-definition" no-breadcrumb no-main-gap no-margin>
    <template #main-left>
<!--      {{query.conceptId}}-->
      <concept-tree
        @node-click="handleTreeNodeClick"
        v-model:concept-id="query.conceptId">
        <template #default="{data}">
          <div class="concept-item" :title="data.name">
            <el-text truncated class="concept-name">{{ data.name }}</el-text>
            <div class="concept-add-icon">
              <el-link @click.stop="handleAddConcept(data)" :underline="false">
                <el-icon>
                  <Plus />
                </el-icon>
              </el-link>
            </div>
          </div>
        </template>
      </concept-tree>
      <concept-add-dialog ref="conceptAddDialogRef" />
    </template>
    <template #main-center>
      <RouterView />
    </template>
  </page-content>
</template>

<style scoped lang="scss">
@use "@/assets/zstp/styles/mixin" as *;

.schema-definition {
  :deep(.body-main) {
    height: 100% !important;
  }

  :deep(.body-main-middle) {
    padding: var(--pd-margin-padding-2);
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
