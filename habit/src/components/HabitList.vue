<script setup lang="ts">
import {ref, h} from 'vue'
import {NSpace, useMessage, useLoadingBar} from 'naive-ui'
import HabitAvatarText from "../components/HabitAvatarText.vue";
import TableButton from "../components/TableButton.vue";
import {
  Edit32Regular, Archive20Regular, Delete20Regular
} from '@vicons/fluent'
import {
  Undo
} from '@vicons/carbon'

import {apis} from '../api/pb.ts'
import {habitRefreshEvent, onHabitRefreshEvent} from '../bus/bm.ts'

const message = useMessage()
const loadingBar = useLoadingBar()

interface Props {
  archive?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  archive: false,
});

function createTableButtons(row: any) {
  const editH = h(TableButton, {
    title: '编辑', backgroundColor: row.color, icon: Edit32Regular, click: () => {
      message.info("编辑")
    }
  });

  const archiveH = h(TableButton, {
    title: '归档', backgroundColor: "gray", icon: Archive20Regular, click: () => {
      loadingBar.start();
      apis.habit_base.update(row.id, {archive: true}).then(() => {
        message.success(`${row.habit_name}归档成功`)
        habitRefreshEvent();
      }).catch(() => {
        loadingBar.error();
        message.error("操作失败，请重试")
      }).finally(() => {
        loadingBar.finish();
      })
    }
  });

  const undoH = h(TableButton, {
    title: '恢复', backgroundColor: "#2ab174", icon: Undo, click: () => {
      loadingBar.start();
      apis.habit_base.update(row.id, {archive: false}).then(() => {
        message.success(`${row.habit_name}恢复成功`)
        habitRefreshEvent();
      }).catch(() => {
        loadingBar.error();
        message.error("操作失败，请重试")
      }).finally(() => {
        loadingBar.finish();
      })
    }
  });

  const deleteH = h(TableButton, {
    title: '删除', backgroundColor: "#c12626", icon: Delete20Regular,
    confirm: true, confirmText: '确定要删除这个习惯吗？',
    click: () => {
      loadingBar.start();
      apis.habit_base.delete(row.id).then(() => {
        message.success(`${row.habit_name}删除成功`)
        habitRefreshEvent();
      }).catch(() => {
        loadingBar.error();
        message.error("操作失败，请重试")
      }).finally(() => {
        loadingBar.finish();
      })
    }
  });

  return props.archive ? [undoH, deleteH] : [editH, archiveH, deleteH];
}

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
    title: '', key: 'operation', render(row: any) {
      return h(NSpace, {justify: 'end'}, createTableButtons(row))
    }
  },
]);

let data = ref<any>([]);

function refresh() {
  loadingBar.start();
  apis.habit_base.getFullList({
    filter: `archive = ${props.archive}`,
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
  <n-data-table size="small"
                :columns="columns"
                :data="data"
                :pagination="false"
                :bordered="false"
  />
</template>

<style scoped>

</style>