<script setup lang="ts">
import UserSignin from "../components/UserSignin.vue";
import UserInfo from "../components/UserInfo.vue";
import {pb, apis} from '../api/pb.ts'
import {ref} from 'vue'
import UserSignup from "../components/UserSignup.vue";

const isLoggedIn = ref<boolean>(apis.isLoggedIn());
pb.authStore.onChange(() => {
  isLoggedIn.value = apis.isLoggedIn()
})

</script>

<template>
  <n-flex justify="center" style="width: 400px">
    <n-card v-show="!isLoggedIn">
      <n-tabs
          default-value="signin"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      >
        <n-tab-pane name="signin" tab="登录">
          <UserSignin/>
        </n-tab-pane>
        <n-tab-pane name="signup" tab="注册">
          <UserSignup/>
        </n-tab-pane>
      </n-tabs>
    </n-card>
    <n-card v-show="isLoggedIn">
      <UserInfo/>
    </n-card>
  </n-flex>
</template>
