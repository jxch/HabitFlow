<script setup lang="ts">
import {apis} from '../api/pb.ts'

const columns: any[] = [];
const data: any[] = [];

apis.habit_base.getFullList().then(res => {
  console.log(res)
});
</script>

<template>
  <n-data-table
      :columns="columns"
      :data="data"
      :pagination="false"
      :bordered="false"

  />
</template>

<style scoped>

</style>