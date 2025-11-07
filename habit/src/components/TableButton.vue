<script setup lang="ts">
import type {Component} from "vue";
import {NIcon} from 'naive-ui'

interface Props {
  title: string,
  color?: string,
  backgroundColor: string,
  icon: Component,
  click?: Function,
  confirm?: boolean,
  confirmText?: string,
}

const props = withDefaults(defineProps<Props>(), {
  color: 'snow',
  confirm: false,
  confirmText: '',
  click: () => {
  }
});
</script>

<template>
  <n-popconfirm v-if="props.confirm"
                positive-text="确认"
                :negative-text="null"
                @positive-click="props.click">
    <template #trigger>
      <n-button
          :title="props.title"
          :color="props.backgroundColor"
          :style="{color: props.color}"
          circle>
        <template #icon>
          <n-icon>
            <component :is="icon"/>
          </n-icon>
        </template>
      </n-button>
    </template>
    {{ props.confirmText }}
  </n-popconfirm>
  <n-button v-if="!props.confirm"
            :title="props.title"
            :color="props.backgroundColor"
            :style="{color: props.color}"
            @click="props.click"
            :focusable="false"
            circle>
    <template #icon>
      <n-icon>
        <component :is="icon"/>
      </n-icon>
    </template>
  </n-button>
</template>

<style scoped>

</style>