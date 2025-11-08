<script setup lang="ts">
import {ref, toRaw, computed} from 'vue'
import type {FormInst} from 'naive-ui'
import {useMessage} from 'naive-ui'
import {randomRgbaStr} from '../util/chromaUtil.ts'

import {apis, pb} from '../api/pb.ts'
import {habitRefreshEvent} from '../bus/bm.ts'

const message = useMessage();

const habitRef = ref<FormInst | null>(null)
const habit = ref({
  habit_name: null,
  description: null,
  frequency: 1,
  cycle_day: 1,
  color: randomRgbaStr(),
  archive: false,
  user: pb.authStore.record ? pb.authStore.record.id : null,
});
pb.authStore.onChange(() => {
  habit.value.user = pb.authStore.record.id;
})

let createHabitLoading = ref(false)

async function createHabit() {
  await habitRef.value?.validate();
  createHabitLoading.value = true
  apis.habit_base.create(toRaw(habit.value)).then(res => {
    createHabitLoading.value = false
    message.success(`${res.habit_name}已添加`);
    habitRefreshEvent();
  })
}

const rules = {
  habit_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入习惯的名称'
  },
  color: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请选择习惯的颜色'
  },
  frequency: {
    required: true,
    type: 'number',
    min: 1,
    trigger: ['blur', 'input'],
    message: '请选择习惯的频次'
  },
  cycle_day: {
    required: true,
    type: 'number',
    min: 1,
    trigger: ['blur', 'input'],
    message: '请选择习惯的周期'
  },
}

const cycleButtons = ref([
  {name: '每天一次', frequency: 1, cycle_day: 1, type: 'tertiary'},
  {name: '每天两次', frequency: 2, cycle_day: 1, type: 'tertiary'},
  {name: '每天三次', frequency: 3, cycle_day: 1, type: 'tertiary'},
  {name: '每周一次', frequency: 1, cycle_day: 7, type: 'tertiary'},
  {name: '每周两次', frequency: 2, cycle_day: 7, type: 'tertiary'},
  {name: '每周三次', frequency: 3, cycle_day: 7, type: 'tertiary'},
])

let currentCycleButton: any = undefined;

function cycleButtonClick(button: any) {
  if (button.type === 'primary') {
    button.type = 'tertiary'
  } else {
    habit.value.frequency = button.frequency
    habit.value.cycle_day = button.cycle_day

    if (currentCycleButton != undefined) {
      currentCycleButton.type = 'tertiary'
    }

    button.type = 'primary'
    currentCycleButton = button
  }
}

</script>

<template>
  <n-card style="height: 100%" size="small">
    <n-form ref="habitRef" :model="habit" :rules="rules" label-placement="left" label-width="auto" size="small">
      <n-form-item path="habit_name" label="名称" required>
        <n-input v-model:value="habit.habit_name" placeholder="新习惯"/>
      </n-form-item>

      <n-form-item path="color" label="颜色" required>
        <n-color-picker v-model:value="habit.color"/>
      </n-form-item>

      <n-form-item path="frequency" label="频率" required>
        <n-input-number v-model:value="habit.frequency" :min="1"/>
      </n-form-item>

      <n-form-item path="cycle_day" label="周期" required>
        <n-input-number v-model:value="habit.cycle_day" :min="1"/>
      </n-form-item>

      <n-form-item label="快选">
        <n-flex>
          <n-button v-for="(button) in cycleButtons"
                    :type="button.type"
                    @click="cycleButtonClick(button)"
                    strong secondary>
            {{ button.name }}
          </n-button>
        </n-flex>
      </n-form-item>

      <n-form-item path="tags" label="标签">
        <n-dropdown trigger="hover">
          <n-button>选择</n-button>
        </n-dropdown>
      </n-form-item>

      <n-form-item path="description" label="描述">
        <n-input type="textarea" v-model:value="habit.description" placeholder="新习惯"/>
      </n-form-item>

      <n-form-item>
        <n-flex justify="end">
          <n-button round type="primary" :onclick="createHabit" :loading="createHabitLoading">保存</n-button>
        </n-flex>
      </n-form-item>

    </n-form>
  </n-card>
</template>
