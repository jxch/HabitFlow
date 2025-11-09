<script setup lang="ts">
import {ref} from 'vue'
import {menus, redirectLogin} from '../router'
import {apis, pb} from '../api/pb.ts'

const activeKey = ref<string>(window.location.pathname)
const isSuperUser = ref<boolean>(apis.isSuperUser());

function createMenus() {
  if (isSuperUser.value) {
    return menus;
  }

  return menus.filter(m => m.role != 'SUPER');
}

const menuOptions = ref<any[]>(createMenus());

function checkAndRedirectLogin() {
  if (!apis.isLoggedIn()) {
    redirectLogin();
  }
}

checkAndRedirectLogin();
pb.authStore.onChange(() => {
  checkAndRedirectLogin();
  isSuperUser.value = apis.isSuperUser();
  menuOptions.value = createMenus();
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
