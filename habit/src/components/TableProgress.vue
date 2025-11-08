<script setup lang="ts">
import {computed} from 'vue'

interface Props {
  color: string,
  frequency?: number,
  cycle_day?: number,
  number: number,
}

const props = withDefaults(defineProps<Props>(), {
  frequency: 1,
  cycle_day: 1,
});

const percentage = computed(() => {
  return (props.number / (props.frequency / props.cycle_day) * 100).toFixed(0);
})
</script>

<template>
  <n-progress
      type="circle"
      :color="props.color"
      :percentage="percentage"
      :stroke-width="15"
      style="width: 26px;"
      :size="small"
      :title="`今日进度：${percentage}%`"
  >
    <span style="text-align: center;"></span>
  </n-progress>
</template>
