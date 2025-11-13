<script setup lang="ts">
import {computed} from 'vue'

interface Props {
  color: string,
  frequency?: number,
  cycle_day?: number,
  todayNumber?: number,
  habit_name?: string,
  percent?: number,
}

const props = withDefaults(defineProps<Props>(), {
  frequency: 1,
  cycle_day: 1,
  habit_name: '',
  percent: -1,
  todayNumber: -1,
});

const percentage = computed(() => {
  if (props.percent >= 0) {
    return props.percent;
  }

  if (props.todayNumber == 0) {
    return 0;
  }

  return Math.min(Number((props.todayNumber / (props.frequency / props.cycle_day) * 100).toFixed(0)), 100);
})
</script>

<template>
  <n-progress
      type="circle"
      :color="props.color"
      :percentage="percentage"
      :stroke-width="15"
      style="width: 26px;"
      :title="`${habit_name} 进度：${percentage}%`"
  >
    <span style="text-align: center;"></span>
  </n-progress>
</template>
