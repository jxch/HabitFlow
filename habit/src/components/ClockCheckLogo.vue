<script setup lang="ts">
import {computed} from 'vue'
import {
  CheckSquareRegular, SquareRegular
} from '@vicons/fa';
import {NIcon} from "naive-ui";

interface Props {
  date: string,
  clock_days: string,
  numbers: string,
  color: string,
  frequency: number,
  cycle_day: number,
}

const props = withDefaults(defineProps<Props>(), {});

function dateIndex(): number {
  if (props.clock_days == null) {
    return -1;
  }

  return props.clock_days.split(",").indexOf(props.date) as number;
}

function number(): number {
  if (props.numbers == null || props.numbers == 0 || dateIndex() == -1) {
    return 0;
  }
  return (props.numbers + '').split(",")[dateIndex()] as number;
}

const clock = computed(() => ({
  isClock: (props.clock_days || '').includes(props.date || ''),
  clockColorStyle: props.color,
  depth: 5 - Math.min(Math.floor(number() / props.frequency / props.cycle_day), 4) as any,
  number: number(),
}));

function click() {
  console.log(number())
}
</script>

<template>
  <n-button text style="font-size: 24px" :focusable="false" @click="click">
    <n-icon :color="clock.isClock ? clock.clockColorStyle : 'gray'" :depth="clock.depth">
      <CheckSquareRegular v-if="clock.isClock"/>
      <SquareRegular v-if="!clock.isClock"/>
    </n-icon>
  </n-button>
</template>

<style scoped>

</style>