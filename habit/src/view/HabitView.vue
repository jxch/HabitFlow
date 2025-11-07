<script setup lang="ts">
import HabitEdit from "../components/HabitEdit.vue";
import HabitList from "../components/HabitList.vue";
</script>

<template>
  <n-split direction="horizontal" :max="0.35" :min="0.15" :default-size="0.20">
    <template #1>
      <HabitEdit/>
    </template>
    <template #2>
      <HabitList/>
    </template>
  </n-split>
</template>

<style scoped>

</style>