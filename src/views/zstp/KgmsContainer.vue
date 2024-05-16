<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { zstpRequest } from '@/api/zstp/axios.js'
import { ref } from 'vue'
import _ from 'lodash'

const kgList = ref([])
const route = useRoute()
const router = useRouter()
zstpRequest({
  url: '/graph/all',
  method: 'POST'
}).then((res) => {
  kgList.value = res
  let kgName = route.params?.kgName
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
</script>

<template>
  <RouterView v-if="route.params.kgName" />
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;

  .content {
    width: 100%;
    height: 100%;
    display: block;
    border: none;
  }
}
</style>
<style lang="scss" src="@/assets/zstp/styles/common.scss"></style>
