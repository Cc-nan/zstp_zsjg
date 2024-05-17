export default [
  {
    path: '/zstp/:kgName?',
    name: 'zstpKgms',
    component: () => import('@/views/zstp/KgmsContainer.vue'),
    redirect: {name: 'zstpSchema'},
    children: [
      {
        path: 'schema',
        name: 'zstpSchema',
        component: () => import('@/views/zstp/kgms/SchemaDefinition.vue'),
        redirect: {name: 'zstpAttributeTable'},
        children: [
          {
            path: 'attr/table',
            name: 'zstpAttributeTable',
            component: () => import('@/views/zstp/kgms/schema/AttributeTable.vue')
          },
          {
            path: 'concept/edit',
            name: 'zstpConceptEdit',
            component: () => import('@/views/zstp/kgms/schema/ConceptEdit.vue')
          },
          {
            path: 'attribute/edit',
            name: 'zstpAttributeEdit',
            component: () => import('@/views/zstp/kgms/schema/AttributeEdit.vue')
          },
          {
            path: 'relation/edit',
            name: 'zstpRelationEdit',
            component: () => import('@/views/zstp/kgms/schema/RelationEdit.vue')
          }
        ]
      },
      {
        path: 'entity',
        name: 'zstpEntity',
        component: () => import('@/views/zstp/kgms/EntityEdit.vue'),
        children: [
          {
            path: 'list',
            name: 'zstpEntityList',
            component: () => import('@/views/zstp/kgms/entity/EntityTable.vue'),
          },
          {
            path: 'edit',
            name: 'zstpEntityEdit',
            component: () => import('@/views/zstp/kgms/entity/EntityDetailEdit.vue'),
          },
          {
            path: 'list/relation',
            name: 'zstpEntityListForRelation',
            component: () => import('@/views/zstp/kgms/entity/EntityTableForRelation.vue'),
          },
          {
            path: 'edit/relation',
            name: 'zstpEntityRelationEdit',
            component: () => import('@/views/zstp/kgms/entity/EntityRelationEdit.vue'),
          }
        ]
      }
    ]
  }
]
