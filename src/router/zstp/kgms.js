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
      }
    ]
  }
]
