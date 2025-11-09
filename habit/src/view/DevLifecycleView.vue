<script setup lang="ts">
import DevLifecycleEdit from "../components/DevLifecycleEdit.vue";
import DevLifecycleList from "../components/DevLifecycleList.vue";

</script>

<template>
  <n-split direction="horizontal" :max="0.35" :min="0.15" :default-size="0.20">
    <template #1>
      <DevLifecycleEdit/>
    </template>
    <template #2>
      <DevLifecycleList/>
    </template>
  </n-split>
</template>
