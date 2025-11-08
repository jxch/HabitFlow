<script setup lang="ts">
import {apis, pb} from '../api/pb.ts'
import {ref} from 'vue'
import {useMessage} from 'naive-ui'
import HabitAvatarText from "./HabitAvatarText.vue";

const message = useMessage();

const currentUser = ref<any>({
  isLoggedIn: apis.isLoggedIn(),
  username: apis.username(),
  userEmail: apis.userEmail(),
});
pb.authStore.onChange(() => {
  currentUser.value.isLoggedIn = apis.isLoggedIn();
  currentUser.value.username = apis.username();
  currentUser.value.userEmail = apis.userEmail();
})

function logout() {
  apis.logout();
  message.success("注销成功");
}
</script>

<template>
  <n-space vertical>
    <n-space align="center">
      <HabitAvatarText
          :text="currentUser.username"
          size="large"
          :circle="true"
      />
      <n-p>{{ currentUser.username }}</n-p>
    </n-space>
    <n-space align="center">
      <n-p style="color: gray">{{ currentUser.userEmail }}</n-p>
    </n-space>
    <n-space justify="end">
      <n-button type="error" @click="logout">注销</n-button>
    </n-space>
  </n-space>
</template>
