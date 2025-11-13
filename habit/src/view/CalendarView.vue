<script setup lang="ts">
import {ref} from "vue";
import dayjs from 'dayjs';
import {apis} from "../api/pb.ts";
import {batchFillClockDaysDesc, weeksToFirstDayOfMonth} from "../util/dayUtil.ts";
import {doAndOnHabitRefreshEvent} from "../bus/bm.ts";
import {useLoadingBar} from "naive-ui";
import TableProgress from "../components/TableProgress.vue";
import HabitAvatarText from "../components/HabitAvatarText.vue";

const loadingBar = useLoadingBar();
const value = ref(Date.now());
const dateGroup = ref<Map<string, any>>(new Map());
const itemModal = ref({
  visible: false,
  title: '',
  items: [],
});

function refresh(weeks: number = 5) {
  loadingBar.start();
  apis.habit_view_clock.getFullList().then((items) => {
    const fillItems = batchFillClockDaysDesc(items, weeks);
    dateGroup.value.clear();
    for (const item of fillItems) {
      const dates = item.clock_days ? item.clock_days.split(',') : [];
      const numbers = item.numbers ? String(item.numbers).split(',') : [];
      for (const date of dates) {
        if (dateGroup.value.has(date)) {
          const dayGroup = dateGroup.value.get(date);
          dayGroup.push({
            ...item,
            clock_days: dates.slice(dates.indexOf(date)),
            numbers: numbers.slice(dates.indexOf(date)),
          })
        } else {
          dateGroup.value.set(date, [{
            ...item,
            clock_days: dates.slice(dates.indexOf(date)),
            numbers: numbers.slice(dates.indexOf(date)),
          }]);
        }
      }
    }
  }).catch(() => {
    loadingBar.error();
  }).finally(() => {
    loadingBar.finish();
  });
}

function onPanelChange(info: any): void {
  refresh(-weeksToFirstDayOfMonth(info.year, info.month));
}

function formatDate(year: number, month: number, day: number) {
  return dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
}

function getItems(year: number, month: number, day: number) {
  return dateGroup.value.get(formatDate(year, month, day))
      ?.sort((a: any, b: any) => a.habit_name.localeCompare(b.habit_name));
}

function getValidItems(year: number, month: number, day: number) {
  return getItems(year, month, day)?.filter((item: any) => {
    return Number(String(item.numbers).split(',')[0]) > 0
  })?.sort((a: any, b: any) => a.habit_name.localeCompare(b.habit_name));
}

function showModal(year: number, month: number, day: number) {
  itemModal.value.visible = true;
  itemModal.value.items = getItems(year, month, day);
  itemModal.value.title = formatDate(year, month, day);
}

function handleUpdate(_: number, {year, month, date}: { year: number, month: number, date: number }) {
  showModal(year, month, date);
}

doAndOnHabitRefreshEvent(refresh);
</script>

<template>
  <n-card>
    <n-calendar
        v-model:value="value"
        #="{ year, month, date }"
        @panel-change="onPanelChange"
        @update:value="handleUpdate"
    >
      <n-flex>
        <n-flex v-for="item in getValidItems(year, month, date)">
          <TableProgress
              :color="item.color"
              :habit_name="item.habit_name"
              :cycle_day="item.cycle_day"
              :frequency="item.frequency"
              :today-number="Number(String(item.numbers).split(',')[0])"
              @click="showModal(year, month, date)"
          />
        </n-flex>
      </n-flex>
    </n-calendar>
    <n-modal
        v-model:show="itemModal.visible"
        :title="itemModal.title"
        :show-mask="false"
        preset="card"
        style="width: 800px"
        draggable
    >
      <n-table :bottom-bordered="false" :bordered="false" :single-column="true">
        <n-tr>
          <n-td></n-td>
          <n-td>习惯</n-td>
          <n-td>当日进度</n-td>
          <n-td>当前进度</n-td>
          <n-td>目标</n-td>
        </n-tr>
        <n-tr v-for="item in itemModal.items">
          <n-td>
            <HabitAvatarText :background-color="item['color']" :text="item['habit_name']"/>
          </n-td>
          <n-td><span :style="{color: item['color']}">{{ item['habit_name'] }}</span></n-td>
          <n-td>
            <TableProgress
                :color="item['color']"
                :habit_name="item['habit_name']"
                :cycle_day="item['cycle_day']"
                :frequency="item['frequency']"
                :today-number="Number(String(item['numbers']).split(',')[0])"
            />
          </n-td>
          <n-td>
            <TableProgress
                :color="item['color']"
                :habit_name="item['habit_name']"
                :cycle_day="item['cycle_day']"
                :frequency="item['frequency']"
                :percent="String(item['numbers']).split(',').slice(0, item['cycle_day']).reduce((sum, val, _idx) => sum + (Number(val) || 0), 0) / item['frequency'] * 100"
            />
          </n-td>
          <n-td>
            <span :style="{color: item['color']}">
              {{
                `${String(item['numbers']).split(',').slice(0, item['cycle_day']).reduce((sum, val, _idx) => sum + (Number(val) || 0), 0)}/${item['frequency']}-${item['cycle_day']}`
              }}
            </span>
          </n-td>
        </n-tr>
      </n-table>
    </n-modal>
  </n-card>
</template>
