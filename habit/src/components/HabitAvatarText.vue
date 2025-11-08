<script setup lang="ts">
import {computed} from 'vue'
import {getOptimalTextColor, randomRgbaStr} from '../util/chromaUtil.ts'

interface Props {
  text: string | null,
  color?: string,
  backgroundColor?: string,
  circle?: boolean,
  size?: string,
}

const props = withDefaults(defineProps<Props>(), {
  color: 'snow',
  circle: false,
  backgroundColor: randomRgbaStr(),
  size: 'small',
  text: '',
});

const avatar = computed(() => ({
  style: {
    color: props.color,
    backgroundColor: props.backgroundColor,
  },
  text: (props.text || '').substring(0, 1),
  textColor: getOptimalTextColor(props.color),
}));
</script>

<template>
  <n-avatar :size="props.size" :style="avatar.style" :circle="props.circle">
    <b :style="{color: avatar.textColor}">{{ avatar.text }}</b>
  </n-avatar>
</template>
