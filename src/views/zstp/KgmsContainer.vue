<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { zstpRequest } from '@/api/zstp/axios.js'
import { ref } from 'vue'
import _ from 'lodash'
import KgAddDialog from '@/views/zstp/kgms/KgAddDialog.vue'

const kgList = ref([])
const route = useRoute()
const router = useRouter()

const kgAddDialogRef = ref(null)

function init () {
  zstpRequest({
    url: '/graph/all',
    method: 'POST'
  }).then((res) => {
    kgList.value = res
    let kgName = route.params?.kgName
    if (!res?.length) {
      kgAddDialogRef.value.open()
    }
    if (!(kgName && _.find(kgList.value, { kgName: kgName }))) {
      kgName = kgList.value[0].kgName
      router.replace({
        params: {
          ...route.params,
          kgName: kgName
        }
      })
    }
  })
}

init()

function handleAddKg () {
  if (!kgList.value.length) {
    init()
  }
}

</script>

<template>
  <div class="kg-container">
    <RouterView v-if="route.params.kgName" />
    <kg-add-dialog @on-success="handleAddKg" ref="kgAddDialogRef" />
  </div>
</template>

<style scoped>
.kg-container {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss" src="@/assets/zstp/styles/common.scss"></style>
