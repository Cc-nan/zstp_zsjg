<template>
  <div class="page-filter-item">
    <div class="page-filter-item-label" :title="label">
      <slot name="label">
        <div class="page-filter-item-title">
          {{ label }}
        </div>
      </slot>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  label: String
})
</script>

<style scoped lang="scss">
@use "@/assets/zstp/styles/mixin" as *;

.page-filter-item {
  display: flex;
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  border-radius: var(--el-border-radius-base);

  &:hover {
    box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
  }

  &:focus-within {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset;
  }

  & + .page-filter-item {
    margin-left: var(--pd-margin-padding-1);
  }

  & > ::v-deep(:first-child) {
    margin: 1px 0 1px 1px;
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  & > ::v-deep(:last-child) {
    margin: 1px 1px 1px 0;
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
  }

  .page-filter-item-label {
    position: relative;
    display: flex;
    flex: 1 0 auto;
    align-items: center;
    justify-content: center;
    font-size: var(--el-font-size-base);
    color: var(--el-text-color-secondary);
    background: var(--el-bg-color);
    padding: 0 var(--pd-margin-padding-2);

    .page-filter-item-title {
      @include line-hidden;

      width: 100%;
      text-align: center;
    }

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 1px;
      height: 16px;
      margin: auto 0;
      content: "";
      background: var(--el-bg-color);
    }
  }

  :deep(.el-input__wrapper) {
    box-shadow: none !important;
  }
}
</style>
