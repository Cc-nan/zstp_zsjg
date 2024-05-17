import { defineStore } from 'pinia'
import { zstpRequest } from '@/api/zstp/axios.js'
import _ from 'lodash'
import { ref } from 'vue'

export const useZstpKgStore = defineStore('zstpKg', () => {
  const kgName = ref('')
  const conceptTree = ref([])
  const conceptList = ref([])
  const kgList = ref([])
  const kg = ref({})

  function setKgByKgName (kgNameValue) {
    conceptList.value = []
    conceptTree.value = []
    kgName.value = kgNameValue
    kg.value = _.find(kgList.value, { kgName: kgNameValue })
  }

  function requestKgList () {
    return zstpRequest({
      url: '/graph/all',
      method: 'GET'
    }).then((res) => {
      kgList.value = res
      return res
    })
  }

  function requestConcept (force) {
    if (force || !conceptList.value.length) {
      return zstpRequest({
        url: `/edit/concept/${kgName.value}/0/tree`,
        method: 'POST'
      }).then((res) => {
        const root = []
        for (const item of res) {
          const parent = _.find(res, { id: item.conceptId })
          if (parent) {
            if (!parent.children) {
              parent.children = []
            }
            parent.children.push(item)
          } else {
            root.push(item)
          }
        }
        conceptTree.value = root
        conceptList.value = res
      })
    }
  }

  return { kgName, kg, kgList, conceptTree, conceptList, setKgByKgName, requestKgList, requestConcept }
})
