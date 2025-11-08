<script setup lang="ts">
import {h, ref, toRaw} from 'vue'
import {NSpace, useMessage, useLoadingBar, NDatePicker} from 'naive-ui'

import {
  ArrowCounterclockwise20Filled
} from '@vicons/fluent'
import {
  CheckmarkDoneOutline
} from '@vicons/ionicons5'
import {
  AddTaskRound
} from '@vicons/material'

import ClockCheckLogo from "../components/ClockCheckLogo.vue";
import TableButton from "../components/TableButton.vue";
import HabitAvatarText from "../components/HabitAvatarText.vue";

import dayjs from 'dayjs';
import {getRecentWeeks} from '../util/dayUtil.ts'
import {apis, business, pb} from '../api/pb.ts'
import {onHabitRefreshEvent, habitRefreshEvent} from "../bus/bm.ts";

const message = useMessage()
const loadingBar = useLoadingBar()

const habitClock = ref({
  habit: null,
  user: apis.userid(),
  clock_date: new Date(),
});
pb.authStore.onChange(() => {
  habitClock.value.user = apis.userid();
})

function redoTodayClock(habitId) {
  business.redoTodayClock(habitId).then(() => {
    message.success("今日重做");
    habitRefreshEvent();
  });
}

function clockCustom(habitId, createdDate) {
  habitClock.value.habit = habitId;
  habitClock.value.clock_date = createdDate;
  loadingBar.start();
  apis.habit_clock.create(toRaw(habitClock.value)).then(() => {
    message.success("打卡 +1");
    habitRefreshEvent();
  }).catch(() => {
    loadingBar.error();
  }).finally(() => {
    loadingBar.finish();
  });
}

function clock(habitId) {
  clockCustom(habitId, new Date());
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
              habit_id: row.id,
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
      title: '', key: 'operation', align: 'center', render(row: any) {
        return h(NSpace, {justify: "end"},
            {
              default: () => [
                h(TableButton, {
                  title: '打卡',
                  backgroundColor: row.color,
                  icon: CheckmarkDoneOutline,
                  click: () => clock(row.id),
                  size: 'small',
                }),
                h(TableButton, {
                  title: '自定义打卡',
                  backgroundColor: '#8FBC8F',
                  icon: AddTaskRound,
                  confirm: true,
                  confirmShowIcon: false,
                  confirmComponent: h(NDatePicker, {
                    type: 'datetime',
                    value: habitClock.value.clock_date.getTime(),
                    'onUpdate:value': (newValue) => {
                      habitClock.value.clock_date = dayjs(newValue).toDate()
                    },
                  }),
                  click: () => {
                    clockCustom(row.id, habitClock.value.clock_date);
                  },
                  size: 'small',
                }),
                h(TableButton, {
                  title: '重做',
                  backgroundColor: "gray",
                  icon: ArrowCounterclockwise20Filled,
                  click: () => redoTodayClock(row.id),
                  size: 'small',
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

