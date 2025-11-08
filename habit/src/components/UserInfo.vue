<script setup lang="ts">
import {apis, pb} from '../api/pb.ts'
import {ref} from 'vue'
import {useMessage} from 'naive-ui'
import HabitAvatarText from "./HabitAvatarText.vue";

const message = useMessage();

const currentUser = ref<any>({
  isLoggedIn: pb.authStore.isValid,
  username: pb.authStore.record ? pb.authStore.record.name : null,
  userEmail: pb.authStore.record ? pb.authStore.record.email : null,
});
pb.authStore.onChange(() => {
  currentUser.value.isLoggedIn = pb.authStore.isValid;
  currentUser.value.username = pb.authStore.record.name;
  currentUser.value.userEmail = pb.authStore.record.email;
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
    <n-button type="error" @click="logout">注销</n-button>
  </n-space>
</template>
