<script setup lang="ts">
import UserLogin from "../components/UserLogin.vue";
import UserInfo from "../components/UserInfo.vue";
import {pb} from '../api/pb.ts'
import {ref} from 'vue'

const isLoggedIn = ref<boolean>(pb.authStore.isValid);
pb.authStore.onChange(() => {
  isLoggedIn.value = pb.authStore.isValid
})

</script>

<template>
  <n-flex justify="center" style="width: 400px">
    <n-card v-show="!isLoggedIn">
      <UserLogin/>
    </n-card>
    <n-card v-show="isLoggedIn">
      <UserInfo/>
    </n-card>
  </n-flex>
</template>
