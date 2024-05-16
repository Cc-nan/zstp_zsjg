import { ref } from 'vue'

const config = ref({
  dataTypeMap: {
    1: '整数值',
    2: '浮点值',
    4: '日期时间',
    41: '日期',
    // 42: '时间',
    5: '短文本型',
    // 6: '计算属性',
    // 8: 'Map型',
    10: '文本型',
    9: '超链接'
  },
  composeTypeMap: {
    1: '时空',
    21: '图片',
    22: '音频',
    23: '视频',
    24: '文档'
  }
})

export function useConfig () {
  return config
}
