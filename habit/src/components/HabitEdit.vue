<script setup lang="ts">
import {ref, toRaw, watchEffect, onMounted} from 'vue'
import type {FormInst} from 'naive-ui'
import {useMessage} from 'naive-ui'
import {randomRgbaStr} from '../util/chromaUtil.ts'

import {apis, pb} from '../api/pb.ts'
import {habitRefreshEvent} from '../bus/bm.ts'

const message = useMessage();

interface Props {
  item?: any,
  show?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
});
const emit = defineEmits<{ 'update:show': [value: boolean] }>();

const habitRef = ref<FormInst | null>(null)
const habit = ref({
  habit_name: null,
  description: null,
  frequency: 1,
  cycle_day: 1,
  color: randomRgbaStr(),
  archive: false,
  user: apis.userid(),
});
pb.authStore.onChange(() => {
  habit.value.user = apis.userid();
})

watchEffect(() => {
  if (props.item) {
    habit.value.habit_name = props.item.habit_name;
    habit.value.description = props.item.description;
    habit.value.frequency = props.item.frequency;
    habit.value.cycle_day = props.item.cycle_day;
    habit.value.color = props.item.color;
    habit.value.archive = props.item.archive;
  }
});

let loading = ref(false)

async function createHabit() {
  await habitRef.value?.validate();
  loading.value = true
  if (props.item) {
    apis.habit_base.update(props.item.id, toRaw(habit.value)).then(() => {
      message.success(`${props.item.habit_name}已更新`);
      emit('update:show', false);
      habitRefreshEvent();
    }).finally(() => {
      loading.value = false
    });
  } else {
    apis.habit_base.create(toRaw(habit.value)).then(res => {
      message.success(`${res.habit_name}已添加`);
      habitRefreshEvent();
    }).finally(() => {
      loading.value = false
    });
  }
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

onMounted(() => {
  if (props.item) {
    const currentButton = cycleButtons.value.filter((button) => button.frequency == props.item.frequency && button.cycle_day == props.item.cycle_day);
    if (currentButton && currentButton.length > 0) {
      cycleButtonClick(currentButton[0]);
    }
  } else {
    cycleButtonClick(cycleButtons.value[0]);
  }
});
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

      <n-flex justify="end">
        <n-button round type="primary" :onclick="createHabit" :loading="loading">保存</n-button>
      </n-flex>
    </n-form>
  </n-card>
</template>
