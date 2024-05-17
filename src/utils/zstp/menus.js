export default [
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
]
