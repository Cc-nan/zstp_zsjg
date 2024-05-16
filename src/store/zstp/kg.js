import { defineStore } from 'pinia'
import { zstpRequest } from '@/api/zstp/axios.js'
import _ from 'lodash'
import { ref } from 'vue'

export const useZstpKgStore = defineStore('zstpKg', {
  state: () => {
    return {
      kgName: '',
      conceptTree: [],
      conceptList: []
    }
  },
  actions: {
    setKg(kgName) {
      this.kgName = kgName
      this.requestConcept()
    },
    requestConcept () {
      zstpRequest({
        url: `/edit/concept/${this.kgName}/0/tree`,
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
        this.conceptTree = root
        this.conceptList = res
      })
    }
  }
})

export const useZstpKgStore = defineStore('zstpKg', () => {
  const kgName = ref('')
  const conceptTree =  ref([])
  const conceptList =  ref([])

  function setKg(kgName) {
    kgName.value = kgName
    requestConcept()
  }

  async function requestConcept () {
    const res = await zstpRequest({
      url: `/edit/concept/${kgName.value}/0/tree`,
      method: 'POST'
    })
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
  }

  return { kgName, conceptTree, conceptList, setKg, requestConcept }
})
