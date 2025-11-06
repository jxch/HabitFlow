<script setup lang="ts">
import AppView from './view/AppView.vue'
import {darkTheme} from 'naive-ui'

</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-notification-provider>
      <AppView/>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>

</style>
