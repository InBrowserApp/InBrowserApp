<template>
  <n-flex align="center" :wrap="false">
    <AirplaneModeToggle />
    <LanguageMenuIcon />
    <n-popover
      style="padding: 0; width: 288px"
      placement="bottom-end"
      display-directive="show"
      trigger="click"
      v-model:show="show"
    >
      <template #trigger>
        <n-icon size="22" class="menu-icon">
          <menu-outline />
        </n-icon>
      </template>

      <div style="overflow: auto; max-height: 79vh">
        <n-menu :options="menuOptions" :indent="18" @update:value="handleUpdateMobileMenu" />
      </div>
    </n-popover>
  </n-flex>
</template>

<script setup lang="ts">
import { NPopover, NIcon, NMenu, NFlex } from 'naive-ui'
import MenuOutline from '@vicons/ionicons5/MenuOutline'
import { ref } from 'vue'
import LanguageMenuIcon from './sub-menus/LanguageMenuIcon.vue'
import AirplaneModeToggle from './sub-menus/AirplaneModeToggle.vue'

import { useCollapsedMenuOptions } from './sub-menus/use-menu-links'

const show = ref(false)

const menuOptions = useCollapsedMenuOptions()

const handleUpdateMobileMenu = () => {
  show.value = false
}
</script>

<style scoped>
/* Avoid Disabled Style */
:deep(.n-menu .n-menu-item-content.n-menu-item-content--disabled) {
  opacity: inherit;
  cursor: inherit;
}

.menu-icon {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
