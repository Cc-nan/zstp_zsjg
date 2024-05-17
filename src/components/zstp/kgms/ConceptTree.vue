<script setup>
import _ from 'lodash'
import { nextTick, ref, watch } from 'vue'
import { useZstpKgStore } from '@/store/zstp/kg.js'

const emits = defineEmits(['node-click'])
const conceptId = defineModel('conceptId', { type: Number, default: 0 })

const treeProps = {
  children: 'children',
  label: 'name'
}

const treeRef = ref(null)
const kw = ref('')
const kgStore = useZstpKgStore()

watch([kgStore.kgName], () => {
  if (kgStore.kgName) {
    kgStore.requestConcept(true)
  }
}, {
  immediate: true
})

watch(() => kgStore.conceptTree.value, () => {
  nextTick(() => {
    treeRef.value.setCurrentKey(conceptId.value)
  })
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}
const handleClick = (data) => {
  emits('node-click', data)
  conceptId.value = data.id
}
const debounceTreeSearch = _.debounce(() => {
  treeRef.value.filter(kw.value)
}, 300, {
  leading: false,
  trailing: true
})
watch(() => kw.value, debounceTreeSearch)
</script>

<template>
  <div class="zstp-concept-tree">
    <div class="input-container">
      <el-input v-model="kw" />
    </div>
    <el-divider />
    <div class="tree-container">
      <el-tree
        :default-expanded-keys="[conceptId]"
        ref="treeRef"
        highlight-current
        node-key="id"
        :props="treeProps"
        :current-node-key="conceptId"
        :filter-node-method="filterNode"
        @node-click="handleClick"
        :data="kgStore.conceptTree">
        <template #default="{data, node}">
          <slot :data="data" :node="node">
            <el-text truncated :title="data.name">{{ data.name }}</el-text>
          </slot>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/zstp/styles/mixin.scss" as *;

.zstp-concept-tree {
  width: 240px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: none;

  .input-container {
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;

    .el-input {
      flex: none;
    }
  }

  .el-divider {
    margin: 0;
  }


  .tree-container {
    height: 1px;
    flex: auto;
    @include scroll();
    padding: 16px 1px;

    .el-tree {
      --el-tree-node-content-height: 32px;
    }
  }
}
</style>
