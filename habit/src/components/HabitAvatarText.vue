<script setup lang="ts">
interface Props {
  text: string,
  color?: string,
  backgroundColor: string,
}

const props = withDefaults(defineProps<Props>(), {color: 'snow'});
</script>

<template>
  <n-avatar size="small"
      :style="{
      color: props.color,
      backgroundColor: props.backgroundColor
    }">
    <b>{{ props.text.substring(0, 1) }}</b>
  </n-avatar>
</template>
