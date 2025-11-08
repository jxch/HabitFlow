<script setup lang="ts">
import {ref} from 'vue'
import {menus, redirectLogin} from '../router'
import {apis, pb} from '../api/pb.ts'

const menuOptions = ref<any[]>(menus)
const activeKey = ref<string>(window.location.pathname)

function checkAndRedirectLogin() {
  if (!apis.isLoggedIn()) {
    redirectLogin();
  }
}

checkAndRedirectLogin();
pb.authStore.onChange(() => {
  checkAndRedirectLogin();
})
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
          v-model:value="activeKey"
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
