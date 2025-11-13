<script setup lang="ts">
import {apis} from '../api/pb.ts'
import {batchFillClockDaysDesc} from "../util/dayUtil.ts";
import {doAndOnHabitRefreshEvent} from "../bus/bm.ts";
import dayjs from 'dayjs';
import {useLoadingBar} from "naive-ui";
import {ref} from "vue";
import {generateHeatmapColors} from "../util/chromaUtil.ts";

const loadingBar = useLoadingBar();
const heatmaps = ref<any>([]);

function toHeatmapData(item: any) {
  const dates = item.clock_days ? item.clock_days.split(',') : [];
  const numbers = item.numbers ? String(item.numbers).split(',') : [];

  return dates.map((date: string, index: number) => {
    return {
      timestamp: dayjs(date).toDate().getTime(),
      value: numbers[index],
    }
  });
}

function refresh() {
  loadingBar.start();
  apis.habit_view_clock.getFullList().then((items) => {
    const fillItems = batchFillClockDaysDesc(items, 100);
    heatmaps.value = fillItems.map((item: any) => {
      return {
        habit_name: item.habit_name,
        data: toHeatmapData(item),
        customActiveColors: generateHeatmapColors(item.color),
        minimumColor: 'DimGray',
        color: item.color,
      }
    });
  }).catch(() => {
    loadingBar.error();
  }).finally(() => {
    loadingBar.finish();
  });
}

doAndOnHabitRefreshEvent(refresh);
</script>

<template>
  <n-flex vertical>
    <n-flex v-for="heatmap in heatmaps">
      <n-scrollbar x-scrollable style="max-width: 100%">
        <n-heatmap
            :data="heatmap.data"
            :active-colors="heatmap.customActiveColors"
            :minimum-color="heatmap.minimumColor"
            :tooltip="{ placement: 'bottom', delay: 500 }"
        >
          <template #footer>
            <n-text depth="3">
              <n-tag :bordered="false" round size="small"
                     :color="{ color: heatmap.color, textColor: 'snow'}">
                {{ heatmap.habit_name }}
              </n-tag>
            </n-text>
          </template>
          <template #tooltip="{ timestamp: date, value: tooltipValue }">
            <n-flex>
              <span :style="{color: heatmap.color}">{{ tooltipValue ?? 0 }} - {{
                  new Date(date).toLocaleDateString()
                }} {{ dayjs(date).format('ddd') }}</span>
            </n-flex>
          </template>
        </n-heatmap>
      </n-scrollbar>
    </n-flex>
  </n-flex>
</template>
