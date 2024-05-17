<template>
  <el-container
    direction="vertical"
    :class="{'body-container-margin': !noMargin, 'body-container-no-header': noHeader}"
    class="body-container">
    <slot name="body">
      <el-header class="body-header" v-if="!noHeader">
        <slot name="header">
          <div class="body-header-left">
            <div class="body-header-back" v-if="allowBack">
              <slot name="header-back">
                <el-button :icon="Back" circle @click="goBackHandler"/>
              </slot>
            </div>
            <div class="body-breadcrumb" v-if="!props.noBreadcrumb">
              <slot name="breadcrumb">
                <slot name="page-title">
                  <el-breadcrumb separator="/">
                    <el-breadcrumb-item
                      v-for="(item, index) in pageNavMenu"
                      :key="item.id">
                      <template v-if="item.clickable === false || (index + 1 === pageNavMenu.length)">
                        <el-tooltip :content="item.name" v-if="!noNavTooltip">
                          <el-link :underline="false" class="page-title-disabled">
                            {{ item.name }}
                          </el-link>
                        </el-tooltip>
                        <el-link :underline="false" class="page-title-disabled" v-else>
                          {{ item.name }}
                        </el-link>
                      </template>
                      <el-link :underline="false" v-else @click="go(item)">
                        {{ item.name }}
                      </el-link>
                    </el-breadcrumb-item>
                  </el-breadcrumb>
                </slot>
              </slot>
            </div>
            <div class="body-header-extra">
              <slot name="header-extra"></slot>
              <template v-if="pageNavMenuTip">
                <el-popover
                  placement="bottom"
                  width="300"
                  trigger="hover"
                  :content="pageNavMenuTip">
                  <template #reference>
                    <el-icon class="el-icon-question">
                      <QuestionFilled/>
                    </el-icon>
                  </template>
                </el-popover>
              </template>
            </div>
            <slot name="header-left"></slot>
          </div>
          <div class="body-header-center">
            <slot name="header-center"></slot>
          </div>
          <div class="body-header-right">
            <slot name="header-right"></slot>
            <slot name="header-right-extra"></slot>
          </div>
        </slot>
      </el-header>
      <el-main class="body-main">
        <slot>
          <div class="body-main-left">
            <slot name="main-left"></slot>
          </div>
          <div class="body-main-gap" v-if="!noMainGap"></div>
          <div class="body-main-right">
            <slot name="main-right"></slot>
          </div>
          <div class="body-main-gap" v-if="!noMainGap"></div>
          <div class="body-main-center">
            <slot name="main-center">
              <slot name="main-top-prepend"></slot>
              <div class="body-main-top">
                <slot name="main-top">
                  <div class="body-main-top-left">
                    <slot name="main-top-left"></slot>
                  </div>
                  <div class="body-main-top-center">
                    <slot name="main-top-center"></slot>
                  </div>
                  <div class="body-main-top-right">
                    <slot name="main-top-right"></slot>
                  </div>
                </slot>
              </div>
              <div class="body-main-middle" ref="tableSlot">
                <slot name="main-table" :height="tableHeight"></slot>
              </div>
              <div class="body-main-bottom">
                <slot name="main-bottom">
                  <div class="body-main-bottom-left">
                    <slot name="main-bottom-left"></slot>
                  </div>
                  <div class="body-main-bottom-center">
                    <slot name="main-bottom-center"></slot>
                  </div>
                  <div class="body-main-bottom-right">
                    <slot name="main-bottom-right"></slot>
                  </div>
                </slot>
              </div>
            </slot>
          </div>
        </slot>
      </el-main>
      <el-footer class="body-footer">
        <slot name="footer"></slot>
      </el-footer>
    </slot>
  </el-container>
</template>

<script setup>
import { Back, QuestionFilled } from '@element-plus/icons-vue'
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  allowBack: Boolean,
  noBreadcrumb: Boolean,
  noMainGap: Boolean,
  noMargin: Boolean,
  noNavTooltip: Boolean,
  navMenu: {
    type: Array
  },
  goBack: {
    type: Function
  }
})

const slots = useSlots()

const noHeader = computed(() => {
  return props.noBreadcrumb
    && !slots.header
    && !slots['header-extra']
    && !slots['header-left']
    && !slots['header-center']
    && !slots['header-right']
    && !slots['header-right-extra']
})

const router = useRouter()

function goBackHandler () {
  if (props.goBack) {
    props.goBack()
  } else {
    router.back()
  }
}

const reactiveMenuData = inject('reactiveMenuData') ?? {}

function go (menu) {
  reactiveMenuData.methods.jump(menu)
}

const pageNavMenuTip = computed(() => {
  return reactiveMenuData.currentMenu?.config?.pageTip
})

const pageNavMenu = computed(() => {
  const menus = reactiveMenuData?.currentMenuWithParents || []
  return props.navMenu || menus.filter(item => item.config?.route)
})
const tableSlot = ref(null)
const tableHeight = ref(null)

onMounted(() => {
  if (tableSlot.value) {
    const tableHeightListener = () => {
      calcTableHeight()
    }
    window.addEventListener('resize', tableHeightListener)
    nextTick(() => {
      calcTableHeight()
    })

    const calcTableHeight = () => {
      const style = window.getComputedStyle(tableSlot.value)
      const children = tableSlot.value.querySelector('*')
      if (children) {
        const tableStyle = window.getComputedStyle(children)
        tableHeight.value = parseInt(style.height, 10) -
          parseInt(tableStyle?.marginTop || 0, 10) -
          parseInt(tableStyle?.marginBottom || 0, 10)
      } else {
        tableHeight.value = parseInt(style.height, 10)
      }
    }

    onBeforeUnmount(() => {
      window.removeEventListener('resize', tableHeightListener)
    })
  }
})
</script>

<style lang="scss">
@use "@/assets/zstp/styles/mixin.scss" as *;

.body-container {
  margin: 0;
  height: 100%;
  display: block;
  background: #eef3fa;

  .body-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: var(--pd-subpage-body-header-height) !important;
    padding: 0 var(--pd-subpage-body-main-margin);
    background: var(--pd-card-bg-color);
    //box-shadow: var(--pd-card-box-shadow);

    &:empty {
      display: none;
    }

    .body-header-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      white-space: nowrap;

      .body-header-back:not(:empty),
      .body-breadcrumb:not(:empty),
      .body-header-extra:not(:empty) {
        margin-right: var(--pd-subpage-body-main-margin);
      }

      .el-breadcrumb__item .el-link--inner {
        max-width: 300px;

        @include line-hidden;
      }

      .el-breadcrumb__separator {
        vertical-align: middle;
      }

      .page-title-disabled {
        font-weight: normal;
        color: var(--el-text-color-primary);
        cursor: text;
      }

      .body-header-extra:not(:empty) {
        .el-icon-question {
          color: var(--el-text-color-secondary);
        }
      }
    }

    .body-header-right {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      white-space: nowrap;
    }
  }

  .body-main {
    display: flex;
    flex-direction: row;
    height: calc(100% - #{--pd-subpage-body-header-height});
    padding: 0;
    overflow: visible;

    .body-main-gap {
      width: var(--pd-subpage-body-main-gap);
    }

    .body-main-left, .body-main-right {
      background: var(--el-color-white);
      box-shadow: var(--pd-card-box-shadow);

      &:empty {
        display: none;

        & + .body-main-gap {
          display: none;
        }
      }
    }

    .body-main-left {
      flex: 0 0 auto;
      order: 1;

      & + .body-main-gap {
        order: 2;
      }
    }

    .body-main-right {
      flex: 0 0 auto;
      order: 5;

      & + .body-main-gap {
        order: 4;
      }
    }

    .body-main-center {
      display: flex;
      flex: 1;
      flex-direction: column;
      order: 3;
      max-width: 100%;
      overflow: hidden;
      background: var(--el-color-white);
      box-shadow: var(--pd-card-box-shadow);
      height: 100%;
      border-radius: var(--el-border-radius-base);

      .body-main-top, .body-main-bottom {
        display: flex;
        flex: 0 0 auto;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--pd-subpage-body-main-margin);
        margin-top: -1px;
        border-bottom: var(--pd-divider);

        &-left,
        &-center,
        &-right {
          display: flex;

          //flex: 1;
          align-items: center;
        }

        &-left {
          justify-content: flex-start;

          &:empty {
            display: none;
          }
        }

        &-center {
          justify-content: center;

          &:empty {
            display: none;
          }
        }

        &-right {
          flex: 1;
          justify-content: flex-end;

          &:empty {
            display: none;
          }
        }
      }

      .body-main-top {

        &-left,
        &-center,
        &-right {
          height: var(--pd-subpage-body-main-top-height);
        }

        &-left > .el-input {
          width: 250px;
        }
      }

      .body-main-middle {
        flex: 1;

        @include scroll;
      }

      .body-main-bottom {

        &-left,
        &-center,
        &-right {
          height: var(--pd-subpage-body-main-bottom-height);
        }
      }
    }

    & > *:only-child {
      width: 100%;
    }
  }

  .body-footer:empty {
    display: none;
  }

  &.body-container-margin, &.body-container-no-header {
    .body-main {
      height: calc(100% - var(--pd-subpage-body-header-height) - var(--pd-subpage-body-main-margin));
    }
  }

  &.body-container-margin.body-container-no-header {
    .body-main {
      height: calc(100% - var(--pd-subpage-body-main-gap) - var(--pd-subpage-body-main-margin));
    }
  }

  &.body-container-margin, &.body-container-margin.body-container-no-header {
    .body-main {
      margin: var(--pd-subpage-body-main-gap) var(--pd-subpage-body-main-margin) var(--pd-subpage-body-main-margin);
      margin-top: 0;
    }
  }
}

#app > .body-container {
  height: 100%;
  margin: 0;
}

</style>
