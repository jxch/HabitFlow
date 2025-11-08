<script setup lang="ts">
import {ref} from 'vue'
import {useMessage, useLoadingBar} from 'naive-ui'
import {apis} from '../api/pb.ts'

const message = useMessage();
const loadingBar = useLoadingBar()

const user = ref<any>({
  email: null,
  password: null,
});

async function login() {
  loadingBar.start()
  const currentUser = await apis.login(user.value.email, user.value.password);
  message.success(`${currentUser.record.name}登录成功`);
  loadingBar.finish()
}
</script>

<template>
  <n-form>
    <n-form-item label="邮箱">
      <n-input v-model:value="user.email" placeholder="example@example.com"/>
    </n-form-item>
    <n-form-item label="密码">
      <n-input type="password" v-model:value="user.password" show-password-on="mousedown" placeholder="password"/>
    </n-form-item>
    <n-form-item>
      <n-button type="primary" @click="login">登录</n-button>
    </n-form-item>
  </n-form>
</template>
