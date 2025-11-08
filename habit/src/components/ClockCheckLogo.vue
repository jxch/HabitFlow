<script setup lang="ts">
import {computed, ref} from 'vue'
import {
  CheckSquareRegular, SquareRegular
} from '@vicons/fa';
import {NIcon, useLoadingBar, useMessage} from "naive-ui";

import dayjs from 'dayjs';
import {apis, business} from '../api/pb.ts'
import {habitRefreshEvent, onHabitRefreshEvent} from '../bus/bm.ts'
import {iconDepthMapRange} from "../util/numberUtil.ts"

const message = useMessage()
const loadingBar = useLoadingBar()

interface Props {
  date: string,
  clock_days: string | null,
  numbers: string | number,
  color: string,
  frequency: number,
  cycle_day: number,
  habit_id: string,
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
  depth: iconDepthMapRange(number.value / (props.frequency / props.cycle_day)) as any,
  number: number.value,
  todyDone: number.value >= props.frequency / props.cycle_day,
}));

const clockHistory = ref<any>([]);
const clockDates = ref<string>('');

async function getClockHistory() {
  loadingBar.start();
  const items = await business.getClock(props.habit_id, props.date);
  if (items && items.length > 0) {
    clockHistory.value = items;
    clockDates.value = items.map(item => dayjs(item.clock_date).format('YYYY-MM-DD HH:mm:ss')).join('<br/>');
  }
  loadingBar.finish();
}

function clearClockHistory() {
  loadingBar.start();
  business.clearClock(props.habit_id, props.date).then(() => {
    message.success(`${props.date}已清空`);
    habitRefreshEvent();
  }).catch(() => {
    loadingBar.error();
  }).finally(() => {
    loadingBar.finish();
  });
}

function redoClock() {
  const item = clockHistory.value[0];
  if (item) {
    loadingBar.start();
    apis.habit_clock.delete(item.id).then(() => {
      message.success(`${dayjs(item.clock_date).format('YYYY-MM-DD HH:mm:ss')}的打卡记录已撤销`);
      habitRefreshEvent();
    }).catch(() => {
      loadingBar.error();
    }).finally(() => {
      loadingBar.finish();
    })
  }
}

onHabitRefreshEvent(() => {
  getClockHistory();
});
</script>

<template>
  <n-flex justify="center">
    <n-popconfirm :show-icon="false" v-if="number">
      <template #trigger>
        <n-button text style="font-size: 24px" :focusable="false" @click="getClockHistory" :title="number">
          <n-icon :color="clock.isClock ? clock.clockColorStyle : 'gray'" :depth="clock.depth">
            <CheckSquareRegular v-if="clock.todyDone"/>
            <SquareRegular v-if="!clock.todyDone"/>
          </n-icon>
        </n-button>
      </template>
      <template #action>
        <n-button size="tiny" @click="redoClock">撤销一次</n-button>
        <n-button size="tiny" type="error" @click="clearClockHistory">清空</n-button>
      </template>
      <n-space vertical>
        <n-p v-for="item in clockHistory" :key="item.id">
          {{ dayjs(item.clock_date).format('YYYY-MM-DD HH:mm:ss') }}
        </n-p>
      </n-space>
    </n-popconfirm>

    <n-button v-if="!number" text style="font-size: 24px" :focusable="false" :title="number">
      <n-icon :color="clock.isClock ? clock.clockColorStyle : 'gray'" :depth="clock.depth">
        <CheckSquareRegular v-if="clock.todyDone"/>
        <SquareRegular v-if="!clock.todyDone"/>
      </n-icon>
    </n-button>
  </n-flex>
</template>
