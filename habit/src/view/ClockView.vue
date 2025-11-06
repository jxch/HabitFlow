<script setup lang="ts">
import {h} from 'vue'
import {NButton} from 'naive-ui'

import {getRecentWeeks} from '../util/dayUtil.ts'
import ClockCheckLogo from "../components/ClockCheckLogo.vue";
import {apis} from '../api/pb.ts'

function createColumns() {
  let dates = getRecentWeeks({dateFormat: 'DD'});

  const datesColumns = dates.map((d: any) => {
    return {
      title: d.weekdayNumberName,
      key: d.date,
      children: [{title: d.dateFormat,}],
      render(row: any) {
        return h(ClockCheckLogo, row)
      }
    }
  })

  const columns: any[] = [
    {title: '', key: 'progressChart'},
    {title: '', key: 'progressUnit'},
    {title: '', key: 'habitLogo'},
    {title: '习惯', key: 'habitName'},
  ]
  const optionColumns: any[] = [
    {
      title: '', key: 'clock', render(row: any) {
        return h(NButton, {size: 'small'})
      }
    },
    {
      title: '', key: 'undo', render(row: any) {
        return h(NButton, {size: 'small'})
      }
    },
    {
      title: '', key: 'edit', render(row: any) {
        return h(NButton, {size: 'small'})
      }
    },
    {
      title: '', key: 'archive', render(row: any) {
        return h(NButton, {size: 'small'})
      }
    },
    {
      title: '', key: 'delete', render(row: any) {
        return h(NButton, {size: 'small'})
      }
    },
  ]

  columns.push(...datesColumns);
  columns.push(...optionColumns);

  return columns;
}

const columns: any[] = createColumns();

const data: any[] = []

apis.view_habit_clock_number.getFullList().then((res) => {
  console.log(res)
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