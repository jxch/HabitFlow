<script setup lang="ts">
import {ref, toRaw} from "vue";
import type {FormInst} from "naive-ui";
import {useMessage, useLoadingBar} from 'naive-ui'
import {apis} from '../api/pb.ts'

const message = useMessage();
const loadingBar = useLoadingBar();

const signupRef = ref<FormInst | null>(null)
const user = ref<any>({
  name: null,
  email: null,
  password: null,
  passwordConfirm: null,
  verified: false,
  emailVisibility: true,
});

const rules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入姓名'
  },
  email: [{
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入邮箱'
  }, {
    validator: (_rule: any, value: any) => {
      return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    trigger: ['input', 'blur'],
    message: '请输入有效的邮箱'
  }],
  password: [{
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入密码'
  }, {
    validator: (_rule: any, value: any) => {
      return value && value.length >= 8;
    },
    trigger: ['blur', 'input'],
    message: '密码至少8位数'
  }],
  passwordConfirm: [{
    required: true,
    trigger: ['blur', 'input'],
    message: '请再次输入密码',
  }, {
    validator: (_rule: any, value: any) => {
      return value === user.value.password
    },
    trigger: ['blur', 'input'],
    message: '两次密码输入不一致',
  }],
}

async function signup() {
  await signupRef.value?.validate();
  loadingBar.start();
  apis.users.create(toRaw(user.value)).then(() => {
    apis.login(user.value.email, user.value.password).then(() => {
      message.success("注册并登录成功");
    }).catch(() => {
      loadingBar.error();
    }).finally(() => {
      loadingBar.finish();
    })
  }).catch(() => {
    message.error("注册失败，请更换邮箱并重试")
    loadingBar.error();
  }).finally(() => {
    loadingBar.finish();
  });
}
</script>

<template>
  <n-form ref="signupRef" :model="user" :rules="rules">
    <n-form-item label="姓名" path="name" required>
      <n-input v-model:value="user.name" placeholder="username"/>
    </n-form-item>
    <n-form-item label="邮箱" path="email" required>
      <n-input v-model:value="user.email" placeholder="example@example.com"/>
    </n-form-item>
    <n-form-item label="密码" path="password" required>
      <n-input type="password" v-model:value="user.password"
               show-password-on="mousedown" placeholder="password"/>
    </n-form-item>
    <n-form-item label="确认密码" path="passwordConfirm" required>
      <n-input type="password" v-model:value="user.passwordConfirm"
               show-password-on="mousedown" placeholder="password"/>
    </n-form-item>
    <n-flex justify="end">
      <n-button type="primary" @click="signup">注册并登录</n-button>
    </n-flex>
  </n-form>
</template>
