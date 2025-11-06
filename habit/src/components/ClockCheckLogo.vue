<script setup lang="ts">
import {
  CheckSquare, CheckSquareRegular
} from '@vicons/fa'

const props = defineProps<{
  isClock: boolean,
  clockColorStyle: string,
  nonClockColorStyle: string,
}>();
</script>

<template>
  <n-icon>
    <CheckSquare v-if="props.isClock" :style="props.clockColorStyle"/>
    <CheckSquareRegular v-if="!props.isClock" :style="props.nonClockColorStyle"/>
  </n-icon>
</template>

<style scoped>

</style>