import { createVNode, render } from 'vue'
import ForceConfirmDialogConstructor from './ForceConfirmDialog.vue'

export const PdForceConfirmDialog = (appContext, title, formSize) => {
  const props = {
    formSize
  }
  const vNode = createVNode(ForceConfirmDialogConstructor, props, null)
  vNode.appContext = appContext
  return new Promise((resolve, reject) => {
    props.callback = (action) => {
      if (action === 'success') {
        resolve(title)
      } else {
        reject(new Error('Delete canceled'))
      }
    }
    render(vNode, document.body)
    vNode.component?.exposed?.handleOpen(title)
  })
}

export default ForceConfirmDialogConstructor
