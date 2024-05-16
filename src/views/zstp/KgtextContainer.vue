<script setup>
const src = import.meta.env.BASE_URL + 'zstp/kgdatalake/index.html#/home/default_user_graph_18f7711b051/dataLakeDataSet'
const tag = 'i' + 'frame'
</script>

<template>
  <div class="container">
    <component :is="tag" class="content" :src="src"/>
  </div>
</template>

<style scoped>
.container{
  width: 100%;
  height: 100%;

  .content{
    width: 100%;
    height: 100%;
    display: block;
    border: none;
  }
}
</style>
