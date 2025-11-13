<script setup lang="ts">
import {computed} from 'vue'

interface Props {
  color: string,
  frequency?: number,
  cycle_day?: number,
  todayNumber: number,
}

const props = withDefaults(defineProps<Props>(), {
  frequency: 1,
  cycle_day: 1,
});

const percentage = computed(() => {
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
      :title="`今日进度：${percentage}%`"
  >
    <span style="text-align: center;"></span>
  </n-progress>
</template>
