<script setup lang="ts">
import {computed} from 'vue'
import {
  CheckSquareRegular, SquareRegular
} from '@vicons/fa';
import {NIcon} from "naive-ui";

interface Props {
  date: string,
  clock_days: string | null,
  numbers: string | number,
  color: string,
  frequency: number,
  cycle_day: number,
  habit_id : string,
}

const props = withDefaults(defineProps<Props>(), {});

function dateIndex(): number {
  if (props.clock_days == null) {
    return -1;
  }

  return (props.clock_days || '').split(",").indexOf(props.date) as number;
}

const number = computed(() => {
  if (props.numbers == null || props.numbers == 0 || dateIndex() == -1) {
    return 0;
  }
  return Number((props.numbers + '').split(",")[dateIndex()]);
});

const clock = computed(() => ({
  isClock: number.value > 0,
  clockColorStyle: props.color,
  depth: 5 - Math.min(Math.floor((number.value / 2) / (props.frequency / props.cycle_day)), 4) as any,
  number: number.value,
  todyDone: number.value >= props.frequency / props.cycle_day,
}));

function click() {

}
</script>

<template>
  <n-button text style="font-size: 24px" :focusable="false" @click="click" :title="number">
    <n-icon :color="clock.isClock ? clock.clockColorStyle : 'gray'" :depth="clock.depth">
      <CheckSquareRegular v-if="clock.todyDone"/>
      <SquareRegular v-if="!clock.todyDone"/>
    </n-icon>
  </n-button>
</template>
