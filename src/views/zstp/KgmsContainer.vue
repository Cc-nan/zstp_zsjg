<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { nextTick, ref } from 'vue'
import _ from 'lodash'
import KgAddDialog from '@/views/zstp/kgms/KgAddDialog.vue'
import { useReactiveMenu, ReactiveMenuItem } from 'reactive-menu-item'
import { Menu, Refresh } from '@element-plus/icons-vue'
import KgChangeDialog from '@/views/zstp/kgms/KgChangeDialog.vue'
import { useZstpKgStore } from '@/store/zstp/kg.js'

const route = useRoute()
const router = useRouter()

const reactiveMenuData = useReactiveMenu([
  {
    name: '知识存储',
    enable: true,
    checked: true,
    type: 'menu',
    order: 1,
    config: {
      isDefault: true,
      icon: 'path://M142.622701 222.211956h128.317443V354.922124H142.622701zM342.103385 222.211956h568.977193V354.922124h-568.977193zM342.103385 462.493331h568.977193v132.710169h-568.977193zM342.103385 695.342113h568.977193v132.711975h-568.977193zM142.622701 462.493331h128.317443v132.710169H142.622701zM142.622701 695.342113h128.317443v132.711975H142.622701z',
      viewBox: '0 0 1024 1024',
      boundary: false
    },
    children: [
      {
        name: '本体建模',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: true,
          boundary: true,
          route: {
            name: 'zstpAttributeTable'
          }
        },
        children: [
          {
            name: '概念编辑',
            enable: true,
            checked: true,
            type: 'shadowMenu',
            order: 1,
            config: {
              isDefault: true,
              boundary: true,
              route: {
                name: 'zstpConceptEdit'
              }
            }
          },
          {
            name: '数值属性编辑',
            enable: true,
            checked: true,
            type: 'shadowMenu',
            order: 1,
            config: {
              isDefault: true,
              boundary: true,
              route: {
                name: 'zstpAttributeEdit'
              }
            }
          },
          {
            name: '对象属性编辑',
            enable: true,
            checked: true,
            type: 'shadowMenu',
            order: 1,
            config: {
              isDefault: true,
              boundary: true,
              route: {
                name: 'zstpRelationEdit'
              }
            }
          }
        ]
      },
      {
        name: '实体编辑',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: true,
          boundary: true,
          route: {
            name: 'zstpEntityList'
          }
        },
        children: [
          {
            name: '实体属性编辑',
            enable: true,
            checked: true,
            type: 'shadowMenu',
            order: 1,
            config: {
              isDefault: true,
              boundary: true,
              route: {
                name: 'zstpEntityEdit'
              }
            }
          }
        ]
      },
      {
        name: '关系编辑',
        enable: true,
        checked: true,
        type: 'menu',
        order: 1,
        config: {
          isDefault: true,
          boundary: true,
          route: {
            name: 'zstpEntityListForRelation'
          }
        },
        children: [
          {
            name: '实体关系编辑',
            enable: true,
            checked: true,
            type: 'shadowMenu',
            order: 1,
            config: {
              isDefault: true,
              boundary: true,
              route: {
                name: 'zstpEntityRelationEdit'
              }
            }
          }
        ]
      }
    ]
  }
], {
  mock: {},
  config: {
    resetId: true
  }
})

const kgStore = useZstpKgStore()

const isCollapse = ref(false)
const kgAddDialogRef = ref(null)
const kgChangeDialogRef = ref(null)

function init () {
  kgStore.requestKgList().then((res) => {
    let kgName = route.params?.kgName
    if (!res?.length) {
      kgAddDialogRef.value.open()
      return
    }
    const currentKg = _.find(kgStore.kgList, { kgName: kgName })
    if (!(kgName && currentKg)) {
      kgName = res?.[0]?.kgName
      kgStore.setKgByKgName(kgName)
      router.replace({
        params: {
          ...route.params,
          kgName: kgName
        }
      })
    } else {
      kgStore.setKgByKgName(currentKg.kgName)
    }
  })
}

init()

function handleAddKg (res) {
  router.push({
    name: 'zstpKgms',
    params: {
      kgName: res.kgName
    }
  })
  nextTick(() => {
    init()
  })
}

function handleChangeKg (kgName) {
  router.push({
    name: 'zstpKgms',
    params: {
      kgName
    }
  })
  kgStore.setKgByKgName(kgName)
}

function newKg () {
  kgAddDialogRef.value.open()
}

function changeKg () {
  kgChangeDialogRef.value.open()
}

</script>

<template>
  <div class="zstp-container">
    <div class="zstp-container-left" :class="{'zstp-container-left-collapse': isCollapse}">
      <div class="zstp-container-logo">
        知识图谱
      </div>
      <el-menu
        :collapse="isCollapse"
        :default-active="reactiveMenuData.activeIndex"
        class="el-menu-demo"
        mode="vertical"
        :ellipsis="false">
        <reactive-menu-item
          v-for="item of reactiveMenuData.menus"
          :key="item.id"
          :data="item">
        </reactive-menu-item>
      </el-menu>
    </div>
    <div class="zstp-container-right">
      <div class="zstp-container-header">
        <div class="header-left">
          <el-link type="info" :underline="false" @click="isCollapse = !isCollapse">
            <el-icon>
              <Menu />
            </el-icon>
          </el-link>
        </div>
        <div class="header-right">
          <el-menu
            :ellipsis="false"
            class="el-menu-demo"
            mode="horizontal">
            <el-menu-item @click="changeKg">
              {{ kgStore?.kg?.title }}
              <el-icon>
                <Refresh />
              </el-icon>
            </el-menu-item>
            <el-menu-item @click="newKg">新建图谱</el-menu-item>
          </el-menu>
          <!--                  <el-menu-->
          <!--                    :default-active="reactiveMenuData.topActiveIndex"-->
          <!--                    class="el-menu-demo"-->
          <!--                    mode="horizontal"-->
          <!--                    :ellipsis="false">-->
          <!--                    <reactive-menu-item v-for="item of reactiveMenuData.menus" :key="item.id" :data="item" />-->
          <!--                  </el-menu>-->
        </div>
      </div>
      <div class="zstp-container-main">
        <RouterView v-if="kgStore.kgName" :key="kgStore.kgName" />
        <kg-add-dialog @on-success="handleAddKg" ref="kgAddDialogRef" />
        <kg-change-dialog @kg-change="handleChangeKg" ref="kgChangeDialogRef" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.zstp-container {
  height: 100%;
  display: flex;

  .zstp-container-left {
    flex: none;
    height: 100%;
    width: 240px;

    &.zstp-container-left-collapse {
      width: 64px;

      .zstp-container-logo {
        font-size: 14px;
      }
    }

    .zstp-container-logo {
      background: var(--el-color-primary);
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 40px;
    }

    .el-menu {
      border: none;
      width: calc(100% - 1px);
    }
  }

  .zstp-container-right {
    width: 1px;
    height: 100%;
    flex: auto;
    display: flex;
    flex-direction: column;

    .zstp-container-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--pd-margin-padding-2);

      .header-left {
        .el-link {
          font-size: 24px;
          color: var(--el-text-color-primary);

          &:hover {
            color: var(--el-color-primary);
          }
        }
      }

      .header-right {
        flex: none;

        .el-menu {
          border: none;
        }
      }
    }

    .zstp-container-main {
      height: 1px;
      flex: auto;
    }

  }
}
</style>
<style lang="scss" src="@/assets/zstp/styles/common.scss"></style>
