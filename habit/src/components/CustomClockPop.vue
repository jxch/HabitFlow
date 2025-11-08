<script setup lang="ts">
import {ref, toRaw} from 'vue'
import dayjs from 'dayjs';

const clock = ref<any>({
  datetime: dayjs().toDate(),
});

interface Props {
  habitName: string,
  habitId: string,
}

const props = withDefaults(defineProps<Props>(), {
});
</script>

<template>
  <n-form label-width="auto" size="small">
    <n-form-item>

    </n-form-item>
    <n-form-item label="时间">
      <n-date-picker type="datetime" v-model:value="clock.datetime"/>
    </n-form-item>
  </n-form>
</template>
