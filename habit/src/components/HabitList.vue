<script setup lang="ts">
import {ref, h} from 'vue'
import {NSpace, useMessage, useLoadingBar} from 'naive-ui'
import HabitAvatarText from "../components/HabitAvatarText.vue";
import TableButton from "../components/TableButton.vue";
import {
  Edit32Regular, Archive20Regular, Delete20Regular
} from '@vicons/fluent'

import {apis} from '../api/pb.ts'
import {habitRefreshEvent, onHabitRefreshEvent} from '../bus/bm.ts'

const message = useMessage()
const loadingBar = useLoadingBar()

const columns = ref([
  {
    title: '', key: 'color', render(row: any) {
      return h(HabitAvatarText, {backgroundColor: row.color, text: row.habit_name})
    }
  },
  {title: '习惯', key: 'habit_name'},
  {title: '标签', key: 'tags'},
  {
    title: '频率', key: 'frequency', render(row: any) {
      return h('p', {}, `${row.frequency}次/${row.cycle_day}天`)
    }
  },
  {title: '描述', key: 'description'},
  {
    title: '', key: 'option', render(row: any) {
      return h(NSpace, {justify: 'end'}, [
        h(TableButton, {
          title: '编辑', backgroundColor: row.color, icon: Edit32Regular, click: () => {
            message.info("编辑")
          }
        }),
        h(TableButton, {
          title: '归档', backgroundColor: "gray", icon: Archive20Regular, click: () => {
            message.info("归档")
          }
        }),
        h(TableButton, {
          title: '删除', backgroundColor: "#c12626", icon: Delete20Regular,
          confirm: true, confirmText: '确定要删除这个习惯吗？',
          click: () => {
            loadingBar.start();
            apis.habit_base.delete(row.id).then(() => {
              message.success(`${row.habit_name}删除成功`)
              habitRefreshEvent();
            }).catch(() => {
              loadingBar.error();
              message.error(`${row.habit_name}删除失败`)
            }).finally(() => {
              loadingBar.finish();
            })
          }
        }),
      ])
    }
  },
]);

let data = ref<any>([]);

function refresh() {
  loadingBar.start();
  apis.habit_base.getFullList({
    filter: 'archive = false',
  }).then(res => {
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
      :columns="columns"
      :data="data"
      :pagination="false"
      :bordered="false"
  />
</template>

<style scoped>

</style>