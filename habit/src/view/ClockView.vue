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

import dayjs from 'dayjs';
import {getRecentWeeks} from '../util/dayUtil.ts'
import {apis} from '../api/pb.ts'
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
                  title: '打卡', backgroundColor: row.color, icon: CheckmarkDoneOutline, click: () => {
                    habitClock.value.habit = row.id;
                    apis.habit_clock.create(toRaw(habitClock.value)).then(res => {
                      message.success("打卡 +1");
                      habitClockEvent();
                    })
                  }
                }),
                h(TableButton, {
                  title: '重做', backgroundColor: "gray", icon: ArrowCounterclockwise20Filled, click: () => {
                    apis.habit_view_clock_number.getFullList({
                      filter: `habit_id = '${row.id}' && clock_day = '${dayjs().format('YYYY-MM-DD')}'`
                    }).then(res => {
                      if (res == null || res == []) {
                        return;
                      }
                      for (let item of res) {
                        Promise.all((item.clock_ids + '').split(',')
                            .map(id => apis.habit_clock.delete(id))).then(r => {
                          message.success("今日重做")
                          habitClockEvent();
                        })
                      }
                    })
                  }
                }),
              ]
            })
      }
    },
  ]

  columns.push(...datesColumns);
  columns.push(...optionColumns);

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
      :columns="columns"
      :data="data"
      :pagination="false"
      :bordered="false"
  />
</template>

<style scoped>

</style>