<script setup lang="ts">
import {computed} from 'vue'
import {getOptimalTextColor} from '../util/chromaUtil.ts'

interface Props {
  text: string,
  color?: string,
  backgroundColor: string,
}

const props = withDefaults(defineProps<Props>(), {color: 'snow'});

const avatar = computed(() => ({
  style: {
    color: props.color,
    backgroundColor: props.backgroundColor,
  },
  text: props.text.substring(0, 1),
  textColor: getOptimalTextColor(props.color),
}));
</script>

<template>
  <n-avatar size="small" :style="avatar.style">
    <b :style="{color: avatar.textColor}">{{ avatar.text }}</b>
  </n-avatar>
</template>
