<script setup lang="ts">
import {h, ref, computed, toRaw} from 'vue'
import {NSpace, useMessage, useLoadingBar} from 'naive-ui'

import {
  ArrowCounterclockwise20Filled
} from '@vicons/fluent'
import {
  CheckmarkDoneOutline
} from '@vicons/ionicons5'

import ClockCheckLogo from "../components/ClockCheckLogo.vue";
import TableButton from "../components/TableButton.vue";
import HabitAvatarText from "../components/HabitAvatarText.vue";

import {getRecentWeeks} from '../util/dayUtil.ts'
import {apis, business} from '../api/pb.ts'
import {onHabitRefreshEvent, habitClockEvent, onHabitClockEvent} from "../bus/bm.ts";

const message = useMessage()
const loadingBar = useLoadingBar()

const habitClockData = ref({
  habit: null,
});
const habitClock = computed(() => ({
  ...habitClockData.value,
  user: apis.currentUserId,
}));

function redoTodayClock(habitId) {
  business.redoTodayClock(habitId).then(() => {
    message.success("今日重做");
    habitClockEvent();
  });
}

function clock(habitId) {
  habitClock.value.habit = habitId;
  apis.habit_clock.create(toRaw(habitClock.value)).then(() => {
    message.success("打卡 +1");
    habitClockEvent();
  })
}

function createColumns() {
  let dates = getRecentWeeks({dateFormat: 'DD'});

  const datesColumns = dates.map((d: any) => {
    return {
      title: d.weekdayNumberName,
      key: d.date,
      align: 'center',
      children: [
        {
          title: d.dateFormat,
          align: 'center',
          render(row: any) {
            return h(ClockCheckLogo, {
              date: d.date.format('YYYY-MM-DD'),
              clock_days: row.clock_days,
              numbers: row.numbers,
              color: row.color,
              frequency: row.frequency,
              cycle_day: row.cycle_day,
            })
          },
        }
      ],
    }
  })

  const columns: any[] = [
    {title: '', key: 'progressChart'},
    {title: '', key: 'progressUnit'},
    {
      title: '', key: 'habitLogo', render(row: any) {
        return h(HabitAvatarText, {backgroundColor: row.color, text: row.habit_name})
      }
    },
    {
      title: '习惯', key: 'habit_name', render(row: any) {
        return h('n-p', {style: `color: ${row.color}; font-weight: bold;`}, row.habit_name)
      }
    },
  ]
  const optionColumns: any[] = [
    {
      title: '', key: 'operation', render(row: any) {
        return h(NSpace, {justify: "end"},
            {
              default: () => [
                h(TableButton, {
                  title: '打卡',
                  backgroundColor: row.color,
                  icon: CheckmarkDoneOutline,
                  click: () => clock(row.id),
                }),
                h(TableButton, {
                  title: '重做',
                  backgroundColor: "gray",
                  icon: ArrowCounterclockwise20Filled,
                  click: () => redoTodayClock(row.id),
                }),
              ],
            })
      }
    },
  ]

  columns.push(...datesColumns, ...optionColumns);
  return columns;
}

const columns = ref<any>(createColumns());

const data = ref<any>([])

function refresh() {
  loadingBar.start();
  apis.habit_view_clock.getFullList().then((res) => {
    data.value = res
  }).catch(() => {
    loadingBar.error();
  }).finally(() => {
    loadingBar.finish();
  });
}

refresh();
onHabitRefreshEvent(() => {
  refresh();
});
onHabitClockEvent(() => {
  refresh();
})
</script>

<template>
  <n-data-table
      :size="'small'"
      :columns="columns"
      :data="data"
      :pagination="false"
      :bordered="false"
  />
</template>

