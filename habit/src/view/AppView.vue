<script setup lang="ts">
import {menus} from '../router'
import {ref} from 'vue'

const menuOptions = ref<any[]>(menus)
</script>

<template>
  <n-layout has-sider class="page-full">
    <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="true"
        @collapse="true"
        @expand="false"
    >
      <n-menu
          :collapsed="true"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          class="page-full-height"
      />
    </n-layout-sider>
    <n-layout>
      <router-view class="view-container"/>
    </n-layout>
  </n-layout>
</template>
