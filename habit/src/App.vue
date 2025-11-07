<script setup lang="ts">
import AppView from './view/AppView.vue'
import {darkTheme} from 'naive-ui'

</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <n-notification-provider>
        <n-loading-bar-provider>
          <AppView/>
        </n-loading-bar-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>

</style>
