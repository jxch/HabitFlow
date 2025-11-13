<script setup lang="ts">
import {ref} from 'vue'
import {apis} from "../api/pb.ts";
import {useLoadingBar} from "naive-ui";
import dayjs from 'dayjs';
import {batchFillClockDaysDesc} from "../util/dayUtil.ts";
import {doAndOnHabitRefreshEvent} from "../bus/bm.ts";
import {slidingWindowSum} from "../util/numberUtil.ts";


const loadingBar = useLoadingBar();

const avgDays = ref<number>(30);
const radarOption = ref<any>({
  title: {
    text: '综合完成率',
    left: 'left',
    top: 'top',
    textStyle: {
      color: 'snow',
      fontSize: 18,
    },
  },
  legend: {
    data: ['平均完成率', '今日完成率'],
    left: 'left',
    top: 'bottom',
    orient: 'vertical',
    textStyle: {
      color: 'snow'
    },
  },
  radar: {
    indicator: [{name: 'empty', max: 100},],
    center: ['50%', '50%'],
    radius: ['10%', '80%'],
    name: {
      textStyle: {
        color: 'snow',
        fontWeight: 'normal',
      }
    },
  },
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      name: 'Budget vs spending',
      type: 'radar',
      data: [
        {value: [0], name: '平均完成率'},
        {value: [0], name: '今日完成率'},
      ]
    }
  ]
});

function refresh(weeks: number = 5) {
  loadingBar.start();
  apis.habit_view_clock.getFullList().then((items) => {
    if (!items) {
      return;
    }

    const avgRate: number[] = [];
    const dayRate: number[] = [];
    const indicator = [];
    const fillItems = batchFillClockDaysDesc(items, weeks);
    for (let item of fillItems) {
      item['numbersSliding'] = slidingWindowSum(item.numbers, item.cycle_day);
      item['rate'] = item['numbersSliding'].map((num: number) => Number(num / item.frequency * 100).toFixed(2));
      const indexOf = item.clock_days.indexOf(dayjs(item.habit_created).format('YYYY-MM-DD'));
      let avg: number = 0;
      if (indexOf >= 0) {
        const sum = item['rate'].slice(0, indexOf + 1).reduce((a: number, b: number) => Number(a) + Number(b));
        avg = Number(Number(Number(sum) / Math.min(indexOf + 1, avgDays.value)).toFixed(2));
      }

      avgRate.push(avg);
      dayRate.push(item['rate'][0]);
      indicator.push({name: item.habit_name, max: 100});
    }

    radarOption.value.radar.indicator = indicator;
    radarOption.value.series[0].data[0].value = avgRate;
    radarOption.value.series[0].data[1].value = dayRate;
  }).catch((e: any) => {
    loadingBar.error();
    throw e;
  }).finally(() => {
    loadingBar.finish();
  });
}

doAndOnHabitRefreshEvent(refresh);
</script>

<template>
  <n-card style="height: 400px; width: 30%">
    <v-chart :option="radarOption" style="height: 100%; width: 100%"/>
  </n-card>

</template>
