<script setup lang="ts">
import {ref} from 'vue'
import {useMessage, useLoadingBar} from 'naive-ui'
import type {FormInst} from 'naive-ui'
import {apis} from '../api/pb.ts'

const message = useMessage();
const loadingBar = useLoadingBar()

const loginRef = ref<FormInst | null>(null)
const user = ref<any>({
  email: null,
  password: null,
});

const rules = {
  email: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入邮箱'
  },
  password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入密码'
  },
}

async function login() {
  await loginRef.value?.validate();
  loadingBar.start();
  apis.login(user.value.email, user.value.password).then((currentUser) => {
    message.success(`${currentUser.record.name}登录成功`);
  }).catch(() => {
    message.error("用户名或密码不正确")
    loadingBar.error();
  }).finally(() => {
    loadingBar.finish();
  });
}
</script>

<template>
  <n-form ref="loginRef" :model="user" :rules="rules">
    <n-form-item label="邮箱" path="email" required>
      <n-input v-model:value="user.email" placeholder="example@example.com"/>
    </n-form-item>
    <n-form-item label="密码" path="password" required>
      <n-input type="password" v-model:value="user.password" show-password-on="mousedown" placeholder="password"/>
    </n-form-item>
    <n-flex justify="end">
      <n-button type="primary" @click="login">登录</n-button>
    </n-flex>
  </n-form>
</template>
